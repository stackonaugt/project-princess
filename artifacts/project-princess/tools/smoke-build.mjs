// Run after building. Optional first argument selects a built-site directory.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const output = resolve(process.argv[2] || fileURLToPath(new URL('../dist/public', import.meta.url)));
const html = await readFile(resolve(output, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(resolve(output, 'assets/sprites/manifest.json'), 'utf8'));
assert.ok(Array.isArray(manifest.files), 'Built sprite manifest must contain a files array');

// Derive the mount path from the built module URL, not the current dev config.
const moduleURL = html.match(/<script\b[^>]*type="module"[^>]*src="([^"]+)"/)?.[1];
assert.ok(moduleURL, 'Built HTML must contain a module script');
const base = new URL('../', new URL(moduleURL, 'http://localhost/')).pathname;
const mime = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
};

// No Vite middleware, source files, SPA fallback, or generated manifest.
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!pathname.startsWith(base)) {
      response.writeHead(404).end();
      return;
    }
    let file = resolve(output, pathname.slice(base.length) || 'index.html');
    if (!file.startsWith(output + sep)) {
      response.writeHead(403).end();
      return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    response.writeHead(200, {
      'Content-Type': mime[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    }).end(body);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 500).end();
  }
});

const errors = [];
const loaded = new Set();
let browser;
let startup;
try {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const url = `http://127.0.0.1:${server.address().port}${base}`;
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    || (existsSync('/repl/tools/bin/chromium') ? '/repl/tools/bin/chromium' : undefined);
  browser = await chromium.launch({
    executablePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader'],
  });
  // A fresh context prevents saves, service workers, and cached sprites masking failures.
  const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(20_000);
  page.on('pageerror', error => errors.push(`JavaScript: ${error.stack || error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`Console: ${message.text()}`);
  });
  page.on('requestfailed', request => errors.push(`Request: ${request.url()} (${request.failure()?.errorText})`));
  page.on('response', response => {
    if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
    if (response.ok()) loaded.add(new URL(response.url()).pathname);
  });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.locator('#title .title-logo').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#title .title-logo').innerText(), 'Project Princess');
  assert.equal(await page.locator('#title .slot-main').count(), 3, 'All three save slots must appear');
  for (const button of await page.locator('#title .slot-main').all()) {
    assert.ok(await button.isVisible() && await button.isEnabled(), 'Save-slot button must be usable');
  }
  assert.ok(await page.locator('#loading').evaluate(el => el.classList.contains('done')), 'Loading must finish');
  assert.ok(await page.locator('#game canvas').isVisible(), 'Phaser must create a visible canvas');

  startup = await page.evaluate(files => {
    const game = window.__pp?.game;
    // Phaser may use blob URLs internally, so verify texture keys and decoded
    // dimensions rather than comparing the texture image URL to the request.
    const prefixes = { player: 'player', pets: 'pet', portraits: 'portrait', npcs: 'npc', objects: 'obj', tiles: 'tile', items: 'item', vehicles: 'veh', enemies: 'foe' };
    const sprites = files.filter(file => {
      const match = /^([a-z]+)\/([a-z0-9_-]+)\.(png|jpe?g|webp)$/i.exec(file);
      const key = match && prefixes[match[1]] && `${prefixes[match[1]]}-${match[2].toLowerCase()}`;
      if (!key || !game?.textures.exists(key)) return false;
      const image = game.textures.get(key).getSourceImage();
      return image && image.width > 0 && image.height > 0;
    });
    return {
      bootActive: game?.scene.isActive('Boot'),
      worldActive: game?.scene.isActive('World'),
      sprites,
      artwork: window.__pp?.artworkStatus?.(),
      defaultTextures: ['pet-princess', 'pet-princess-evolved', 'npc-trish-down']
        .filter(key => game?.textures.exists(key)),
      titleImagesOK: Array.from(document.querySelectorAll('#title img')).every(img => img.complete && img.naturalWidth > 0),
    };
  }, manifest.files);
  assert.ok(startup.bootActive && !startup.worldActive, 'Game must remain at the title, not bypass it');
  assert.ok(startup.titleImagesOK, 'Title-screen artwork must decode');
  assert.ok(startup.artwork, 'Runtime artwork binding diagnostics must be available');
  assert.deepEqual(startup.artwork.failures, [],
    `Assigned artwork must resolve to its expected custom textures:\n${startup.artwork.failures.join('\n')}`);
  assert.deepEqual(startup.defaultTextures, ['pet-princess', 'pet-princess-evolved', 'npc-trish-down'],
    'Stable-ID pets and NPCs without a custom assignment must retain their built-in artwork');
  assert.ok(loaded.has(`${base}assets/sprites/manifest.json`), 'Game must request the built manifest');
  for (const sprite of manifest.files) {
    const pathname = new URL(`assets/sprites/${sprite}`, url).pathname;
    assert.ok(loaded.has(pathname), `Manifest sprite was not loaded successfully: ${sprite}`);
    assert.ok(startup.sprites.includes(sprite), `Manifest sprite missing from Phaser textures: ${sprite}`);
  }
  for (const privatePath of ['studio/', '__studio_api/catalog', 'src/main.js']) {
    assert.equal((await fetch(new URL(privatePath, url))).status, 404, `${privatePath} must not be public`);
  }
  await page.locator('#title .slot-main').first().click();
  await page.waitForFunction(() => {
    const game = window.__pp?.game;
    return game?.scene.isActive('World') && game.scene.getScene('World').map?.w > 0;
  });
  assert.ok(await page.evaluate(() => window.__pp.game.scene.getScene('World').map.solid.length > 0),
    'The production map and its collision data must load');
  // Only this fresh browser context is touched, never a real player's save.
  await page.evaluate(() => {
    window.__pp.state.data.money = 321;
    window.__pp.state.save();
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#title .slot-main').first().waitFor();
  assert.match(await page.locator('#title .slot-main').first().innerText(), /\$321/, 'Save slot must survive reload');
  await page.locator('#title .slot-main').first().click();
  await page.waitForFunction(() => window.__pp?.game.scene.isActive('World'));
  assert.equal(await page.evaluate(() => window.__pp.state.data.money), 321, 'Saved progress must load');
  // Catch errors from the first few title-screen frames as well as initial loading.
  await page.waitForTimeout(300);
} catch (error) {
  errors.push(error.stack || String(error));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}

if (errors.length) {
  console.error(`Production-build smoke check failed:\n${errors.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Production-build smoke check passed at ${base}: title, map, save/reload, ${manifest.files.length} manifest sprites, ${startup.artwork.bindings.length} assigned artwork bindings, stable-ID defaults, editor excluded, no JavaScript errors or failed requests.`);
}
