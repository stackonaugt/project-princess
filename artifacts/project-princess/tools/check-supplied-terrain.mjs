// Read-only supplied-PNG regression suite. Can run standalone or alongside
// either terrain check; uses a fresh page with no game/Studio entry point.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { suppliedTerrainFixtures } from './fixtures/supplied-terrain-browser.mjs';

export async function checkSuppliedTerrain(browser, studioURL) {
  assert.ok(!process.env.TERRAIN_INJECT_SEAM ||
    ['gap', 'protrusion'].includes(process.env.TERRAIN_INJECT_SEAM),
  'TERRAIN_INJECT_SEAM must be gap or protrusion');
  const authoring = new URL('../game/src/authoring/overrides.json', import.meta.url);
  const before = await readFile(authoring);
  const output = process.env.SUPPLIED_TERRAIN_SCREENSHOTS || '/tmp/project-princess-supplied-terrain';
  const context = await browser.newContext({ viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const errors = [], writes = [];
  page.on('pageerror', error => errors.push(error.message));
  // Block all writes, not just saves made by the editor.
  await page.route('**/*', async route => {
    if (!['GET', 'HEAD'].includes(route.request().method())) {
      writes.push(`${route.request().method()} ${route.request().url()}`);
      return route.abort();
    }
    if (route.request().isNavigationRequest())
      return route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Terrain fixtures</title>' });
    return route.continue();
  });
  try {
    const base = new URL('../', studioURL);
    await page.goto(new URL('__terrain_fixture__', base).href);
    await page.addScriptTag({ url: new URL('lib/phaser.min.js', base).href });
    const entry = new URL('studio/main.js', base).href;
    const storageBefore = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
    const result = await page.evaluate(suppliedTerrainFixtures, {
      entry, outputMode: Boolean(process.env.SUPPLIED_TERRAIN_SCREENSHOTS),
      injectSeam: process.env.TERRAIN_INJECT_SEAM,
    });
    await mkdir(output, { recursive: true });
    for (const failure of result.failures) {
      const parts = [];
      for (const name of ['expected', 'actual', 'diff']) {
        const data = failure[name], bytes = Buffer.from(data.png.split(',')[1], 'base64');
        await writeFile(`${output}/${failure.label}-${name}.png`, bytes);
        parts.push({ input: bytes, left: parts.length * data.w, top: 0 });
      }
      await sharp({ create: { width: failure.actual.w * 3, height: failure.actual.h,
        channels: 4, background: '#333333' } }).composite(parts).png()
        .toFile(`${output}/${failure.label}-comparison.png`);
      console.error(`${failure.label}: ${failure.count} seam pixels; crop at ` +
        `${failure.actual.x},${failure.actual.y}; expected | actual | diff: ${output}/${failure.label}-comparison.png`);
    }
    for (const sample of result.samples)
      await writeFile(`${output}/${sample.label}.png`, Buffer.from(sample.png.split(',')[1], 'base64'));
    await writeFile(`${output}/report.json`, JSON.stringify({
      comparisons: result.comparisons, controls: result.controls,
      groundScale: result.groundScale, materials: result.materials,
      failures: result.failures.map(({ label, count, actual }) =>
        ({ label, pixels: count, crop: { x: actual.x, y: actual.y, w: actual.w, h: actual.h } })),
    }, null, 2));
    const storageAfter = await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }));
    assert.deepEqual(storageAfter, storageBefore, 'Fixture imports must not write player storage');
    assert.deepEqual(await readFile(authoring), before, 'Fixture checks must not change saved authoring');
    assert.deepEqual(writes, [], 'Fixture checks must not attempt writes');
    assert.deepEqual(errors, [], 'Fixture browser errors');
    assert.equal(result.failures.length, 0, `Supplied terrain seams detected. Comparisons: ${output}`);
    console.log(`Supplied PNG terrain: ${result.comparisons} comparisons; ${result.controls} negative controls; ` +
      `${result.materials.join(', ')}; gameplay ${result.groundScale}x, phone DPR 1/2/3, Studio 12/16/24/32. No saved-data writes.`);
    return result;
  } finally {
    await context.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
      (existsSync('/repl/tools/bin/chromium') ? '/repl/tools/bin/chromium' : undefined),
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    await checkSuppliedTerrain(browser, process.env.STUDIO_URL || 'http://127.0.0.1:80/studio/');
  } finally {
    await browser.close();
  }
}
