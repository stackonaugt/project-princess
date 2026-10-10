// Focused, draft-only browser regression. Never clicks Save or writes the
// authoring file; uses a fresh browser context without real player saves.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const studioURL = process.env.STUDIO_URL || 'http://127.0.0.1:80/studio/';
const authoringPath = new URL('../game/src/authoring/overrides.json', import.meta.url);
const originalBytes = await readFile(authoringPath);
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
    (existsSync('/repl/tools/bin/chromium') ? '/repl/tools/bin/chromium' : undefined),
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.addInitScript(() => {
  window.propDraws = [];
  const draw = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function(source, ...args) {
    if (this.canvas.id === 'map-props') window.propDraws.push({
      type: source.tagName,
      src: source.src || '',
      finite: args.every(Number.isFinite),
      width: args.length === 4 ? args[2] : undefined,
      height: args.length === 4 ? args[3] : undefined,
    });
    return draw.call(this, source, ...args);
  };
});

async function fullRedrawParity(label) {
  const before = await page.locator('#map-props').evaluate(canvas => canvas.toDataURL());
  await page.locator('#show-collision').check();
  await page.locator('#show-collision').uncheck();
  const after = await page.locator('#map-props').evaluate(canvas => canvas.toDataURL());
  assert.equal(before === after, true, `${label}: dirty redraw differs from full redraw`);
}

async function drag(from, to) {
  const canvas = page.locator('#map-canvas');
  await canvas.scrollIntoViewIfNeeded();
  const bounds = await canvas.boundingBox();
  const point = ([x, y]) => ({ x: bounds.x + x * 16 + 8, y: bounds.y + y * 16 + 8 });
  const start = point(from), end = point(to);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(end.x, end.y, { steps: 6 });
  await page.mouse.up();
}

try {
  const writes = [];
  await page.route('**/__studio_api/catalog', async route => {
    const response = await route.fetch();
    const catalog = await response.json();
    catalog.saved.maps ||= {};
    catalog.saved.maps.allen ||= {};
    catalog.saved.maps.allen.objects ||= { move: [], add: [], remove: [] };
    const objectEdits = catalog.saved.maps.allen.objects;
    const removedProp = (kind, x, y) => ({
      index: 900,
      source: { kind, x, y, w: 1, h: 1 },
    });
    objectEdits.move = [...(objectEdits.move || []),
      { ...removedProp('removed_move_to_clear', 0, 0), x: 12, y: 12 },
      { ...removedProp('removed_move_to_rebind', 2, 2), x: 14, y: 14 },
    ];
    objectEdits.remove = [...(objectEdits.remove || []),
      removedProp('removed_removal_to_clear', 4, 4),
      removedProp('removed_removal_to_rebind', 6, 6),
    ];
    await route.fulfill({ response, body: JSON.stringify(catalog) });
  });
  page.on('request', request => {
    if (request.url().includes('/__studio_api/') && request.method() !== 'GET')
      writes.push(request.method());
  });
  await page.goto(studioURL);
  await page.locator('#map-counts').filter({ hasText: 'props' }).waitFor();
  await page.locator('#map-region').selectOption('allen');
  const { map } = await page.evaluate(async () => {
    const entry = document.querySelector('script[type="module"]').src;
    const response = await fetch(new URL('../__studio_api/map?id=allen', entry));
    if (!response.ok) throw new Error(`Map request failed: ${response.status}`);
    return response.json();
  });
  await page.waitForFunction(() => window.propDraws.some(draw =>
    draw.type === 'IMG' && draw.src.includes('hphouse')));
  const generatedKinds = ['house', 'tall', 'powerpole'];
  for (const kind of generatedKinds) {
    const object = map.objects.find(object => object.kind === kind);
    assert.ok(object, `Allen must have a ${kind} fixture`);
    const opaque = await page.locator('#map-props').evaluate((canvas, object) => {
      const pixels = canvas.getContext('2d').getImageData(
        object.x * 16, object.y * 16, object.w * 16, object.h * 16).data;
      return pixels.some((value, index) => index % 4 === 3 && value > 0);
    }, object);
    assert.ok(opaque, `${kind} artwork must be visible on the map, not merely in the picker`);
  }
  await fullRedrawParity('Initial mixed PNG/generated props');

  // Two overlapping generated trees exercise the clipped dirty redraw,
  // including translucent shadows that must not accumulate outside the patch.
  await page.locator('#map-tool').selectOption('place');
  await page.locator('#object-kind').selectOption('tree');
  for (const [x, y] of [[20, 12], [22, 12]]) {
    await page.locator('#map-canvas').click({ position: { x: x * 16 + 8, y: y * 16 + 8 } });
  }
  await page.locator('#map-tool').selectOption('select');
  for (const [from, to] of [
    [[22, 12], [23, 13]], [[23, 13], [22, 12]], [[22, 12], [21, 12]],
  ]) {
    await drag(from, to);
    await fullRedrawParity('Overlapping generated tree drag');
  }
  assert.equal(await page.locator('#object-x').inputValue(), '21', 'Drag must actually move the tree');
  for (const rotation of ['1', '2', '3', '0']) {
    await page.locator('#selected-object-rotation').selectOption(rotation);
    await page.locator('#move-object').click();
    await fullRedrawParity(`Generated prop rotation ${rotation}`);
  }
  // Supplied PNG props use the same sizing and dirty redraw path.
  await drag([5, 4], [6, 4]);
  assert.equal(await page.locator('#object-x').inputValue(), '6', 'Drag must actually move the PNG house');
  await fullRedrawParity('Supplied PNG house drag');

  for (const zoom of ['12', '24', '32', '16']) {
    await page.locator('#map-zoom').selectOption(zoom);
    assert.equal(await page.locator('#map-props').evaluate(canvas => canvas.width), map.w * Number(zoom));
    await fullRedrawParity(`Zoom ${zoom}`);
  }
  await page.locator('#map-region').selectOption('woods');
  await page.waitForFunction(() => document.querySelector('#map-region').value === 'woods' &&
    document.querySelector('#object-picker').options.length > 1);
  await fullRedrawParity('Woods region');
  await page.locator('#map-region').selectOption('allen');
  await page.locator('#object-picker').selectOption('base:0');
  await fullRedrawParity('Return to Allen');
  assert.equal(await page.locator('#map-source-repairs [data-edit-type="move"]').count(), 2,
    'Each stale move must have its own repair controls');
  assert.equal(await page.locator('#map-source-repairs [data-edit-type="remove"]').count(), 2,
    'Each stale removal must have its own repair controls');
  assert.match(await page.locator('#map-source-repairs').innerText(), /removed_move_to_clear/);
  assert.match(await page.locator('#map-source-repairs').innerText(), /removed_removal_to_clear/);

  const moveRepairs = page.locator('#map-source-repairs [data-edit-type="move"]');
  await moveRepairs.first().locator('[data-testid="clear-prop-edit"]').click();
  await page.waitForFunction(() =>
    document.querySelectorAll('#map-source-repairs [data-edit-type="move"]').length === 1);
  const remainingMove = page.locator('#map-source-repairs [data-edit-type="move"]').first();
  await remainingMove.locator('[data-testid="repair-prop-source"]').selectOption({ index: 1 });
  await remainingMove.locator('[data-testid="rebind-prop-edit"]').click();
  await page.waitForFunction(() =>
    document.querySelectorAll('#map-source-repairs [data-edit-type="move"]').length === 0);

  const removalRepairs = page.locator('#map-source-repairs [data-edit-type="remove"]');
  await removalRepairs.first().locator('[data-testid="clear-prop-edit"]').click();
  await page.waitForFunction(() =>
    document.querySelectorAll('#map-source-repairs [data-edit-type="remove"]').length === 1);
  const remainingRemoval = page.locator('#map-source-repairs [data-edit-type="remove"]').first();
  await remainingRemoval.locator('[data-testid="repair-prop-source"]').selectOption({ index: 1 });
  await remainingRemoval.locator('[data-testid="rebind-prop-edit"]').click();
  await page.waitForFunction(() =>
    document.querySelectorAll('#map-source-repairs [data-testid="unresolved-prop-edit"]').length === 0);
  assert.equal(await page.locator('#map-source-warning').innerText(), '',
    'The warning must clear after all stale edits are repaired');

  const exportPromise = page.waitForEvent('download');
  await page.locator('#export-edits').click();
  const download = await exportPromise;
  const exported = JSON.parse(await readFile(await download.path(), 'utf8'));
  const exportedObjects = exported.maps.allen.objects;
  assert.equal(exportedObjects.move.some(move => move.source?.kind === 'removed_move_to_clear'), false,
    'Cleared moves must be absent from the exported draft');
  const reboundMove = exportedObjects.move.find(move => move.source?.kind !== 'removed_move_to_clear' &&
    move.x === 14 && move.y === 14);
  assert.ok(reboundMove, 'Rebinding a move must preserve its saved destination');
  assert.ok(Number.isInteger(reboundMove.index) && reboundMove.index >= 0 && reboundMove.index < map.objects.length);
  assert.equal(reboundMove.source.kind, map.objects[reboundMove.index].kind,
    'A rebound move must identify the selected current source prop');
  assert.equal(exportedObjects.remove.some(reference =>
    reference.source?.kind === 'removed_removal_to_clear'), false,
  'Cleared removals must be absent from the exported draft');
  const reboundRemoval = exportedObjects.remove.find(reference =>
    reference.source?.kind !== 'removed_removal_to_clear');
  assert.ok(reboundRemoval, 'Rebinding a removal must retain a source-backed edit');
  assert.ok(Number.isInteger(reboundRemoval.index) && reboundRemoval.index >= 0 &&
    reboundRemoval.index < map.objects.length);
  assert.equal(reboundRemoval.source.kind, map.objects[reboundRemoval.index].kind,
    'A rebound removal must identify the selected current source prop');
  const draws = await page.evaluate(() => window.propDraws);
  assert.ok(draws.filter(draw => draw.type === 'CANVAS').length > 20);
  assert.ok(draws.some(draw => draw.type === 'IMG'));
  assert.ok(draws.every(draw => draw.finite && draw.width > 0 && draw.height > 0),
    'Every map draw must have positive finite artwork dimensions');
  assert.deepEqual(errors, []);
  assert.deepEqual(writes, [], 'The regression check must never save editor drafts');
  assert.deepEqual(await readFile(authoringPath), originalBytes, 'Authoring content must remain byte-identical');
  console.log('Studio props verified: visible generated houses/trees/street furniture and PNGs, overlap-safe dragging, rotations, every zoom, region switching, and stale move/removal repair; authoring unchanged.');
} finally {
  await browser.close();
}
