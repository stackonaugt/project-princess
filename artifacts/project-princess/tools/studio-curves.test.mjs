import test from 'node:test';
import assert from 'node:assert/strict';
import { ZONES } from '../game/src/data/regions.js';
import { OBJECTS } from '../game/src/art/paint/objects.js';
import { TILE_NAMES, paintGround } from '../game/src/art/paint/tiles.js';
import { painter } from '../game/src/art/paint/painter.js';
import { mapWithEdits, sourceObjectIdentity } from '../game/src/authoring/map-overrides.js';
import {
  activeTerrainFeatures, curveValues, terrainWithCurveEdits, validateTerrainFeatureEdits,
} from '../game/src/art/paint/terrain-features.js';
import { validateMapEdits } from './dev-studio-plugin.mjs';

const cases = ['allen', 'glasgow', 'reading', 'lake'];
const draft = map => {
  const feature = map.terrainFeatures[0];
  return { terrainFeatures: { [feature.id]: curveValues(feature) } };
};
const canvas = () => ({
  save() {}, restore() {}, clip() {}, rect() {}, ellipse() {}, beginPath() {},
  moveTo() {}, lineTo() {}, quadraticCurveTo() {}, closePath() {}, stroke() {},
  fillRect() {}, drawImage() {}, translate() {}, rotate() {},
});

test('source landmarks stay unchanged until a creator edits their curves', () => {
  for (const id of cases) {
    const map = ZONES[id].build(), before = JSON.stringify(map);
    assert.equal(terrainWithCurveEdits(map), map);
    assert.equal(activeTerrainFeatures(map).length, 1);
    assert.equal(JSON.stringify(map), before);
    validateTerrainFeatureEdits(map, draft(map).terrainFeatures);
  }
});

test('ellipse, ring and approach changes round-trip through authoring and the shared preview', () => {
  for (const id of cases) {
    const map = ZONES[id].build(), before = JSON.stringify(map), edits = draft(map);
    const curve = Object.values(edits.terrainFeatures)[0];
    curve.layers[0].shapes[0].cx -= .5;
    curve.layers[0].shapes[0].rx -= .5;
    if (id === 'lake') curve.layers[0].shapes[0].innerRx -= .5;
    const approach = curve.layers[0].shapes.find(shape => shape.kind === 'rect');
    if (approach) { approach.x += .25; approach.w -= .5; }
    validateMapEdits(id, edits, map, OBJECTS, { ZONES }, TILE_NAMES);
    const saved = JSON.parse(JSON.stringify({ version: 1, maps: { [id]: edits }, data: {} }));
    const gameplay = mapWithEdits(map, saved.maps[id]);
    const preview = terrainWithCurveEdits(map, edits.terrainFeatures);
    assert.deepEqual(gameplay.ground, preview.ground);
    assert.deepEqual(gameplay.terrainFeatures, preview.terrainFeatures);
    assert.equal(activeTerrainFeatures(gameplay).length, 1);
    assert.deepEqual(gameplay.terrainFeatures[0].layers[0].shapes, curve.layers[0].shapes);
    paintGround(painter(canvas()), gameplay, ZONES[id].grass,
      Object.fromEntries(Object.values(TILE_NAMES).map(name => [name, { width: 16, height: 16 }])));
    assert.equal(JSON.stringify(map), before, 'source map stays immutable');
    assert.deepEqual(gameplay.exits, map.exits);
    assert.deepEqual(gameplay.entries, map.entries);
  }
});

test('reshaping the oval room also changes wall collision without touching doorway tiles', () => {
  const map = ZONES.reading.build(), edits = draft(map);
  edits.terrainFeatures['oval-room'].layers[0].shapes[0].rx = 7;
  const result = mapWithEdits(map, edits);
  let changed = 0;
  for (let y = 0; y < map.h; y++) for (let x = 0; x < map.w; x++) {
    if (map.ground[y][x] === 'D') assert.equal(result.ground[y][x], 'D');
    if (map.ground[y][x] === 'o' && result.ground[y][x] === 'W') {
      changed++;
      assert.equal(result.solid[y * map.w + x], 1);
    }
  }
  assert.ok(changed > 0, 'narrower room restores walls at its sides');
});

test('terrain painting takes precedence, keeps curve drafts and restores with tile undo', () => {
  for (const id of cases) {
    const map = ZONES[id].build(), edits = draft(map);
    Object.values(edits.terrainFeatures)[0].layers[0].shapes[0].rx -= .5;
    const [x, y] = map.terrainFeatures[0].bounds;
    const tile = map.ground[y][x] === '=' ? '.' : '=';
    edits.tiles = [{ x, y, tile, rotation: 2 }];
    const result = mapWithEdits(map, edits);
    assert.equal(activeTerrainFeatures(result).length, 0);
    assert.equal(result.ground[y][x], tile);
    assert.equal(result.tileRotations[y][x], 2);
    assert.deepEqual(result.ground, mapWithEdits(map, { tiles: edits.tiles }).ground);
    assert.equal(activeTerrainFeatures(mapWithEdits(map, { ...edits, tiles: [] })).length, 1);
    assert.ok(Object.keys(edits.terrainFeatures).length, 'draft geometry is never discarded');
  }
});

test('painting the original floor over a reshaped wall still switches to tile geometry', () => {
  const map = ZONES.reading.build(), edits = draft(map);
  edits.terrainFeatures['oval-room'].layers[0].shapes[0].rx = 7;
  const curved = terrainWithCurveEdits(map, edits.terrainFeatures);
  let point;
  for (let y = 0; y < map.h && !point; y++) for (let x = 0; x < map.w; x++) {
    if (map.ground[y][x] === 'o' && curved.ground[y][x] === 'W') { point = { x, y, tile: 'o' }; break; }
  }
  assert.ok(point);
  const result = mapWithEdits(map, { ...edits, tiles: [point] });
  assert.equal(result.ground[point.y][point.x], 'o');
  assert.equal(activeTerrainFeatures(result).length, 0);
});

test('curve edits preserve outside terrain rotations, supplied-art rules and source-backed props', () => {
  const map = ZONES.allen.build(), edits = draft(map);
  edits.terrainFeatures['turning-circle'].layers[0].shapes[0].ry -= 1;
  edits.tiles = [{ x: 2, y: 2, tile: 'o', rotation: 3 }];
  edits.objects = { move: [{ index: 0, source: sourceObjectIdentity(map.objects[0]),
    x: map.objects[0].x, y: map.objects[0].y, rotation: 1 }] };
  const result = mapWithEdits(map, edits);
  assert.equal(result.ground[2][2], 'o');
  assert.equal(result.tileRotations[2][2], 3);
  assert.equal(result.objects[0].rotation, 1);
  assert.equal(activeTerrainFeatures(result).length, 1);
  assert.equal(result.terrainFeatures[0].layers[0].material, map.terrainFeatures[0].layers[0].material);
  assert.deepEqual(result.wallPaint, map.wallPaint);
  assert.deepEqual(result.objects.slice(1), map.objects.slice(1));
});

test('changing clipping bounds leaves the intervening terrain untouched', () => {
  const map = { id: 'fixture', w: 12, h: 12,
    ground: Array.from({ length: 12 }, () => '#'.repeat(12)),
    terrainFeatures: [{ id: 'oval', bounds: [0, 0, 3, 3], replace: '#',
      layers: [{ material: '#', shapes: [{ kind: 'ellipse', cx: 1.5, cy: 1.5, rx: 1, ry: 1 }] }] }] };
  const values = curveValues(map.terrainFeatures[0]);
  values.bounds = [9, 9, 3, 3];
  values.layers[0].shapes[0].cx = values.layers[0].shapes[0].cy = 10.5;
  const result = terrainWithCurveEdits(map, { oval: values });
  assert.equal(result.ground[5][5], '#');
  assert.equal(result.ground[0][0], '.');
  assert.equal(result.ground[10][10], '#');
});

test('invalid and unknown curve edits cannot be saved or imported', () => {
  const map = ZONES.lake.build();
  for (const mutate of [
    curve => { curve.bounds = [-1, 0, 2, 2]; },
    curve => { curve.bounds[2] = .5; },
    curve => { curve.bounds[2] = map.w + 1; },
    curve => { curve.layers[0].shapes[0].rx = 0; },
    curve => { curve.layers[0].shapes[0].cx = NaN; },
    curve => { curve.layers[0].shapes[0].innerRx = 99; },
    curve => { curve.layers[0].shapes[0].kind = 'rect'; },
    curve => { curve.layers[0].shapes[1].w = -1; },
    curve => { curve.layers[0].shapes[1].x = map.w; },
    curve => { curve.layers[0].material = '~'; },
    curve => { curve.layers.push(curve.layers[0]); },
    curve => { curve.layers[0].shapes = []; },
    curve => { curve.source = []; },
  ]) {
    const edits = draft(map);
    mutate(edits.terrainFeatures['oval-loop']);
    assert.throws(() => validateMapEdits('lake', edits, map, OBJECTS, { ZONES }, TILE_NAMES), /landmark geometry/);
  }
  assert.throws(() => validateTerrainFeatureEdits(map, { missing: curveValues(map.terrainFeatures[0]) }),
    /landmark geometry/);
});
