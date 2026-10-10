// Draft-only terrain checks. Uses disposable browser contexts and never calls
// a save endpoint or mutates authoring/player data in the user's browser.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { checkSuppliedTerrain } from './check-supplied-terrain.mjs';

const studioURL = process.env.STUDIO_URL || 'http://127.0.0.1:80/studio/';
const authoringPath = new URL('../game/src/authoring/overrides.json', import.meta.url);
const originalBytes = await readFile(authoringPath);
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
    (existsSync('/repl/tools/bin/chromium') ? '/repl/tools/bin/chromium' : undefined),
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const errors = [], writes = [], timings = [];
let assertions = 0;

async function checkViewport(options) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (request.url().includes('/__studio_api/') && request.method() !== 'GET')
      writes.push(`${request.method()} ${request.url()}`);
  });
  await page.goto(studioURL);
  await page.locator('#map-counts').filter({ hasText: 'props' }).waitFor();
  await page.locator('#map-region').selectOption('allen');
  let region = 'allen', cell = 16, draft, base, grass;
  const history = [];

  async function load(id) {
    region = id;
    const response = await page.evaluate(async id => {
      const entry = document.querySelector('script[type="module"]').src;
      const fetchJSON = async route => {
        const response = await fetch(new URL(`../__studio_api/${route}`, entry));
        if (!response.ok) throw new Error(`Studio request failed: ${response.status}`);
        return response.json();
      };
      const [catalog, data] = await Promise.all([fetchJSON('catalog'), fetchJSON(`map?id=${id}`)]);
      const { ZONES } = await import(new URL('../src/data/regions.js', entry));
      const engineMap = ZONES[id].build();
      return { map: data.map, engineMap, edit: catalog.saved.maps[id] || {},
        grass: catalog.regions.find(region => region.id === id).grass };
    }, id);
    assert.deepEqual(response.map.terrainFeatures, response.engineMap.terrainFeatures,
      `${id}: Studio API must carry the game's landmark shapes`);
    assert.deepEqual(response.map.objectLayout, response.engineMap.objectLayout,
      `${id}: Studio API must carry the game's identity-preserving prop layout`);
    base = response.engineMap; draft = structuredClone(response.edit); grass = response.grass;
    history.length = 0;
  }

  async function parity(label) {
    // Wait for the coalesced redraw and any decoded supplied artwork.
    await page.evaluate(() => new Promise(resolve =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const result = await page.evaluate(async ({ map, edit, grass, cell }) => {
      const entry = document.querySelector('script[type="module"]').src;
      const [{ paintGround, TILE_NAMES }, { painter }, { mapWithEdits }] = await Promise.all([
        import(new URL('../src/art/paint/tiles.js', entry)),
        import(new URL('../src/art/paint/painter.js', entry)),
        import(new URL('../src/authoring/map-overrides.js', entry)),
      ]);
      const catalog = await (await fetch(new URL('../__studio_api/catalog', entry))).json();
      const custom = {};
      for (const name of new Set(Object.values(TILE_NAMES))) {
        if (!catalog.spriteFiles.tileActive.includes(`${name}.png`)) continue;
        const image = new Image();
        image.src = new URL(`../assets/sprites/tiles/${name}.png`, entry).href;
        await image.decode(); custom[name] = image;
      }
      const effective = mapWithEdits(map, edit);
      const expected = document.createElement('canvas');
      expected.width = map.w * cell; expected.height = map.h * cell;
      const ctx = expected.getContext('2d');
      ctx.scale(cell / 16, cell / 16);
      const start = performance.now();
      paintGround(painter(ctx), effective, grass, custom);
      const ms = performance.now() - start;
      const actual = document.querySelector('#map-ground');
      const a = actual.getContext('2d').getImageData(0, 0, actual.width, actual.height).data;
      const b = ctx.getImageData(0, 0, expected.width, expected.height).data;
      let different = Math.abs(a.length - b.length);
      for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) different++;
      return { different, ms };
    }, { map: base, edit: draft, grass, cell });
    assert.equal(result.different, 0, `${options.hasTouch ? 'Phone' : 'Desktop'} ${label}: Studio/game pixels differ`);
    timings.push(result.ms); assertions++;
  }

  async function paint(x, y, tile, rotation = 0) {
    await page.locator('#map-tool').selectOption('paint');
    await page.locator('#tile-brush').selectOption(tile);
    await page.locator('#tile-rotation').selectOption(String(rotation));
    history.push(structuredClone(draft));
    draft.tiles ||= [];
    draft.tiles = draft.tiles.filter(t => t.x !== x || t.y !== y);
    if (base.ground[y][x] !== tile || (base.tileRotations?.[y]?.[x] || 0) !== rotation)
      draft.tiles.push({ x, y, tile, ...(rotation ? { rotation } : {}) });
    if (options.hasTouch) {
      const canvas = page.locator('#map-canvas');
      await canvas.scrollIntoViewIfNeeded();
      await canvas.evaluate((element, { x, y, cell }) => {
        const scroll = element.closest('.studio-map-scroll');
        scroll.scrollLeft = Math.max(0, x * cell - 48);
        scroll.scrollTop = Math.max(0, y * cell - 48);
      }, { x, y, cell });
      const bounds = await canvas.boundingBox();
      const cdp = await context.newCDPSession(page);
      const point = { x: bounds.x + x * cell + cell / 2,
        y: bounds.y + y * cell + cell / 2, id: 1 };
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await cdp.detach();
    } else await page.locator('#map-canvas').click({
      position: { x: x * cell + cell / 2, y: y * cell + cell / 2 },
    });
  }

  if (process.env.TERRAIN_ONLY) {
    for (const id of process.env.TERRAIN_ONLY.split(',')) {
      await page.locator('#map-region').selectOption(id);
      await load(id);
      await parity(`${id} focused baseline`);
      const [x, y] = base.terrainFeatures[0].bounds;
      await paint(x, y, '~');
      await parity(`${id} focused terrain override`);
      draft = history.pop();
      await page.locator('#undo-map').click();
      await parity(`${id} focused undo`);
      for (const zoom of [24, 16]) {
        cell = zoom;
        await page.locator('#map-zoom').selectOption(String(zoom));
        await parity(`${id} focused zoom ${zoom}`);
      }
    }
    await context.close();
    return;
  }
  await load('allen');
  await parity('initial authored map');
  for (const [x, y, tile, rotation] of [
    [2, 2, '~', 0], [4, 2, '~', 0], [3, 2, '~', 0], // pools, join
    [3, 2, '.', 0], [3, 3, '~', 0],                  // removal, diagonal
    [2, 2, '=', 0], [3, 2, '=', 0], [4, 2, '=', 1], // path, dead-end, rotation
    [3, 2, '.', 0], [2, 2, 'w', 3],                 // erase path, bridge
    [0, 2, '~', 0], [0, 3, '~', 0],                // continuation at edge
  ]) {
    await paint(x, y, tile, rotation);
    await parity(`paint ${tile} ${x},${y} rotation ${rotation}`);
  }
  for (let i = 0; i < 3; i++) {
    draft = history.pop();
    await page.locator('#undo-map').click();
    await parity('undo contour edit');
  }
  for (const zoom of [12, 24, 32, 16]) {
    cell = zoom;
    await page.locator('#map-zoom').selectOption(String(zoom));
    await parity(`zoom ${zoom}`);
  }
  const retainedDraft = structuredClone(draft);
  for (const id of ['lohse', 'woods', 'coburglake', 'wetlands', 'lakepark',
    'lake', 'gardens', 'nicholson', 'glasgow', 'reading', 'flinders', 'civic', 'allen']) {
    await page.locator('#map-region').selectOption(id);
    await page.waitForFunction(id => document.querySelector('#map-region').value === id &&
      document.querySelector('#map-counts').textContent.includes('props'), id);
    await load(id);
    if (id === 'allen') draft = retainedDraft;
    await parity(`switch to ${id}`);
  }
  // The same landmark must yield to a draft brush edit, and recover its exact
  // curve after undo. Never write the draft to the authoring API.
  for (const [id, x, y] of [['glasgow', 39, 9], ['reading', 1, 1], ['allen', 10, 4]]) {
    await page.locator('#map-region').selectOption(id);
    await page.waitForFunction(id => document.querySelector('#map-region').value === id &&
      document.querySelector('#map-counts').textContent.includes('props'), id);
    await load(id);
    if (id === 'allen') draft = retainedDraft;
    await parity(`${id} landmark before draft`);
    await paint(x, y, '~');
    await parity(`${id} landmark draft overrides geometry`);
    draft = history.pop();
    await page.locator('#undo-map').click();
    await parity(`${id} landmark restored by undo`);
  }
  await context.close();
}

try {
  await checkSuppliedTerrain(browser, studioURL);
  await checkViewport({ viewport: { width: 1440, height: 1100 } });
  await checkViewport({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  // Pixel fixtures for rotations and natural features, independent of drafts.
  const page = await browser.newPage();
  await page.goto(studioURL);
  const fixtures = await page.evaluate(async () => {
    const entry = document.querySelector('script[type="module"]').src;
    const [{ paintGround }, { painter }] = await Promise.all([
      import(new URL('../src/art/paint/tiles.js', entry)),
      import(new URL('../src/art/paint/painter.js', entry)),
    ]);
    const grass = ['#00ff00', '#00ff00', '#00ff00', '#00ff00'];
    const stamp = document.createElement('canvas'); stamp.width = stamp.height = 16;
    const s = stamp.getContext('2d');
    s.fillStyle = '#ff0000'; s.fillRect(0, 0, 8, 8);
    s.fillStyle = '#0000ff'; s.fillRect(8, 8, 8, 8);
    const render = (rows, rotation = 0, custom = {}) => {
      const canvas = document.createElement('canvas');
      const map = { w: rows[0].length, h: rows.length, ground: rows,
        tileRotations: rows.map(row => Array(row.length).fill(rotation)) };
      canvas.width = map.w * 16; canvas.height = map.h * 16;
      paintGround(painter(canvas.getContext('2d')), map, grass, custom);
      return canvas;
    };
    const pixel = (canvas, x, y) =>
      [...canvas.getContext('2d').getImageData(x, y, 1, 1).data];
    const turns = [0, 1, 2, 3].map(turn =>
      render(['...', '.w.', '...'], turn, { bridge: stamp }).toDataURL());
    const footpath = render(['...', '.f.', '...']);
    const water = render(['.....', '.~~~.', '.~.~.', '.~~~.', '.....']);
    const diagonal = render(['~.', '.~']);
    const path = render(['.....', '.===.', '.....']);
    return {
      distinctBridgeRotations: new Set(turns).size,
      squareFootpath: pixel(footpath, 16, 16),
      pathCap: pixel(path, 16, 16),
      pondHole: pixel(water, 40, 40), pondCorner: pixel(water, 16, 16),
      diagonalGap: pixel(diagonal, 16, 15),
    };
  });
  assert.equal(fixtures.distinctBridgeRotations, 4, 'Supplied bridge artwork must rotate by quarter turns');
  assert.notDeepEqual(fixtures.squareFootpath.slice(0, 3), [0, 255, 0]);
  assert.notDeepEqual(fixtures.pathCap.slice(0, 3), [0, 255, 0], 'Path cap must cover its square corner');
  assert.deepEqual(fixtures.pondHole.slice(0, 3), [0, 255, 0], 'Pond hole must remain grass');
  assert.deepEqual(fixtures.pondCorner.slice(0, 3), [0, 255, 0], 'Natural water bank must remain curved');
  assert.deepEqual(fixtures.diagonalGap.slice(0, 3), [0, 255, 0], 'Diagonal pools must remain separate');
  assert.deepEqual(errors, []);
  assert.deepEqual(writes, [], 'Draft terrain verification must never save');
  assert.deepEqual(await readFile(authoringPath), originalBytes, 'Authoring must be byte-identical');
  const coverage = process.env.TERRAIN_ONLY
    ? 'focused landmark painting, undo and zoom; shared pond/bridge/rotation fixtures'
    : 'joins, erasure, rotations, undo, zoom, region changes, ponds, holes and bridges';
  console.log(`Terrain verified: ${assertions} exact Studio/game pixel comparisons on desktop/phone; ${coverage}. Mean full-layer render ${(timings.reduce((a,b)=>a+b,0)/timings.length).toFixed(1)}ms; max ${Math.max(...timings).toFixed(1)}ms. No authoring writes.`);
} finally {
  await browser.close();
}
