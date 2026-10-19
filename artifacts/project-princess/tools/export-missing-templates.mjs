// Export built-in art for anything that has no template PNG yet
// (enemies, objects, townsfolk, items). Boots the real game in headless
// Chromium so every sprite is painted by the same code the game uses.
// Only adds files: existing templates and custom art are never touched.
//   node tools/export-missing-templates.mjs
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const sprites = resolve(projectRoot, 'game/assets/sprites');
const have = folder => new Set((existsSync(`${sprites}/${folder}`) ? readdirSync(`${sprites}/${folder}`) : []).filter(f => f.endsWith('.png')).map(f => f.slice(0, -4)));
const skip = {};
for (const folder of ['enemies', 'objects', 'npcs', 'items']) skip[folder] = [...new Set([...have(`templates/${folder}`), ...have(folder)])];

const vite = await createServer({ configFile: resolve(projectRoot, 'vite.config.ts'), server: { host: '127.0.0.1', port: 0, hmr: false } });
let browser;
try {
  await vite.listen();
  const origin = `http://127.0.0.1:${vite.httpServer.address().port}${vite.config.base}`;
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.goto(`${origin}?slot=1`);
  await page.waitForFunction(() => window.__pp?.game?.scene?.getScene('World')?.player, null, { timeout: 120000 });
  const texturesUrl = await page.evaluate(() => performance.getEntriesByType('resource').map(e => e.name).find(n => /\/src\/art\/textures\.js/.test(n)));
  const out = await page.evaluate(async ({ skip, texturesUrl }) => {
    const { objectTexture } = await import(texturesUrl);
    const { OBJECTS } = await import(texturesUrl.replace(/textures\.js.*/, 'paint/objects.js'));
    const { ENEMIES } = await import(texturesUrl.replace(/art\/textures\.js.*/, 'data/enemies.js'));
    const { NPCS } = await import(texturesUrl.replace(/art\/textures\.js.*/, 'data/npcs.js'));
    const { ITEMS } = await import(texturesUrl.replace(/art\/textures\.js.*/, 'data/items.js'));
    const scene = window.__pp.game.scene.getScene('World'), tx = scene.textures;
    const files = [], missing = [];
    const grab = (folder, name, key, w, h) => {
      if (skip[folder].includes(name)) return;
      if (!tx.exists(key)) { missing.push(`${folder}/${name}`); return; }
      const src = tx.get(key).getSourceImage(), c = document.createElement('canvas');
      c.width = w || src.width; c.height = h || src.height;
      c.getContext('2d').drawImage(src, 0, 0);
      files.push([`${folder}/${name}.png`, c.toDataURL('image/png')]);
    };
    for (const id of Object.keys(ENEMIES)) grab('enemies', id, `foe-${id}`);
    for (const id of Object.keys(NPCS)) grab('npcs', id, `npc-${id}-down`, 48, 32);
    for (const id of Object.keys(ITEMS)) grab('items', id, `item-${id}`);
    for (const [kind, def] of Object.entries(OBJECTS)) {
      for (const v of def.variants?.length ? def.variants : [undefined]) {
        const name = v === undefined ? kind : `${kind}-${String(v).replace(/\s+/g, '').toLowerCase()}`;
        if (skip.objects.includes(name)) continue;
        try { grab('objects', name, objectTexture(scene, { kind, v, x: 0, y: 0 })); } catch { missing.push(`objects/${name}`); }
      }
    }
    return { files, missing };
  }, { skip, texturesUrl });
  for (const [path, url] of out.files) writeFileSync(`${sprites}/templates/${path}`, Buffer.from(url.split(',')[1], 'base64'));
  console.log(`Exported ${out.files.length} templates.`);
  if (out.missing.length) console.log(`No built-in art for: ${out.missing.join(' ')}`);
} finally {
  await browser?.close();
  await vite.close();
}
