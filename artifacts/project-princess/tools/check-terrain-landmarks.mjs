// Read-only visual fixtures for the owner's annotated terrain regressions.
// Exports the actual Studio ground + prop layers; never presses Save.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { checkSuppliedTerrain } from './check-supplied-terrain.mjs';

const url = process.env.STUDIO_URL || 'http://127.0.0.1:80/studio/';
const output = process.env.TERRAIN_SCREENSHOTS || '/tmp/project-princess-terrain';
const authoring = new URL('../game/src/authoring/overrides.json', import.meta.url);
const before = await readFile(authoring);
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
    (existsSync('/repl/tools/bin/chromium') ? '/repl/tools/bin/chromium' : undefined),
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const errors = [], writes = [], captures = [];
const areas = [
  ['coburglake', 'Coburg Lake'], ['wetlands', 'Edgars Creek Wetlands'],
  ['lakepark', 'Lake Park playground'], ['lake', 'Edwardes Lake'],
  ['gardens', 'Carlton Gardens'], ['nicholson', 'Nicholson St path crossing'],
  ['glasgow', 'Glasgow Ave roundabout'], ['reading', 'Oval Reading Room'],
  ['flinders', 'Flinders river and bridge'], ['civic', 'Civic Parade roof'],
  ['allen', 'Allen St turning circle'],
];
try {
  await checkSuppliedTerrain(browser, url);
  await mkdir(output, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (request.url().includes('/__studio_api/') && request.method() !== 'GET')
      writes.push(`${request.method()} ${request.url()}`);
  });
  await page.goto(url);
  await page.locator('#map-counts').filter({ hasText: 'props' }).waitFor();
  await page.locator('#show-grid').uncheck();
  for (const [id, title] of areas) {
    const response = page.waitForResponse(response =>
      response.url().includes(`map?id=${id}`) && response.status() === 200);
    await page.locator('#map-region').selectOption(id);
    const data = await (await response).json();
    if (['allen', 'glasgow', 'reading'].includes(id))
      assert.equal(data.map.terrainFeatures?.length, 1, 'Studio API must carry landmark shapes');
    if (id === 'reading') assert.ok(data.map.objectLayout, 'Studio API must carry Reading Room prop layout');
    await page.evaluate(() => new Promise(resolve =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.waitForTimeout(150);
    const result = await page.evaluate(id => {
      const ground = document.querySelector('#map-ground'), props = document.querySelector('#map-props');
      const canvas = document.createElement('canvas');
      canvas.width = ground.width; canvas.height = ground.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(ground, 0, 0); ctx.drawImage(props, 0, 0);
      const pixel = (x, y) => [...ground.getContext('2d').getImageData(x, y, 1, 1).data];
      const facts = id === 'flinders' ? {
        river: [[0, 32], [ground.width - 1, 32], [34 * 16 - 1, 32], [40 * 16, 32]]
          .map(([x, y]) => pixel(x, y)),
      } : {};
      return { png: canvas.toDataURL('image/png'), facts };
    }, id);
    if (id === 'flinders') {
      for (const [r, g, b, alpha] of result.facts.river)
        assert.ok(b > r && b > g && alpha === 255, 'River must reach its built edges with opaque blue water');
    }
    const image = Buffer.from(result.png.split(',')[1], 'base64');
    await writeFile(`${output}/${id}.png`, image);
    const preview = await sharp(image).resize({ width: 390, height: 300, fit: 'inside' }).png().toBuffer();
    const label = Buffer.from(`<svg width="420" height="32"><rect width="420" height="32" fill="#f7f4e8"/><text x="14" y="22" font-family="sans-serif" font-size="16" fill="#303929">${title}</text></svg>`);
    const i = captures.length / 2, left = i % 3 * 420, top = Math.floor(i / 3) * 350;
    captures.push({ input: label, left, top }, { input: preview, left: left + 14, top: top + 40 });
    console.log(`Captured ${id}: ${JSON.stringify(result.facts)}`);
  }
  assert.deepEqual(errors, [], 'No browser errors');
  assert.deepEqual(writes, [], 'Visual verification never writes authoring data');
  assert.deepEqual(await readFile(authoring), before, 'Saved authoring bytes unchanged');
  await sharp({ create: { width: 1260, height: 1400, channels: 4, background: '#f7f4e8' } })
    .composite(captures).png().toFile(`${output}/overview.png`);
  console.log(`Terrain overview: ${output}/overview.png`);
} finally {
  await browser.close();
}
