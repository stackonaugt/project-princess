import test from 'node:test';
import assert from 'node:assert/strict';
import { ZONES } from '../game/src/data/regions.js';
import { OBJECTS } from '../game/src/art/paint/objects.js';
import {
  mapWithEdits, resolveSourceObjectIndex, sourceObjectIdentity, sourceObjectMatches,
} from '../game/src/authoring/map-overrides.js';
import {
  bindLegacyObjectReferences, validateMapEdits,
} from './dev-studio-plugin.mjs';
import { propArtworkBounds, propArtworkSize } from '../game/studio/prop-artwork.js';
import { state } from '../game/src/systems/state.js';

const baseMap = () => ZONES.allen.build();

test('generated canvases and decoded PNGs use the same map artwork size', () => {
  const definition = { tex: [32, 64] };
  assert.deepEqual(propArtworkSize({ width: 32, height: 64 }, definition),
    { width: 32, height: 64 });
  assert.deepEqual(propArtworkSize({
    naturalWidth: 128, naturalHeight: 256, width: 10, height: 20,
  }, definition), { width: 32, height: 64 });
  assert.deepEqual(propArtworkSize({ width: 32, height: 64 }, definition, 24),
    { width: 48, height: 96 });
  assert.deepEqual(propArtworkSize({ width: 32, height: 64 }, undefined, 12),
    { width: 24, height: 48 });
});

test('invalid artwork dimensions fail explicitly rather than creating invisible props', () => {
  for (const source of [
    { width: 0, height: 64 }, { width: 32, height: NaN },
    { naturalWidth: 0, naturalHeight: 0, width: 32, height: 64 },
  ]) assert.throws(() => propArtworkSize(source, { tex: [32, 64] }), /positive, finite/);
});

test('every generated Allen prop has finite rotated drawing and redraw dimensions at every zoom', () => {
  for (const object of baseMap().objects) {
    const definition = OBJECTS[object.kind];
    const source = { width: definition.tex[0], height: definition.tex[1] };
    for (const cell of [12, 16, 24, 32]) for (const rotation of [0, 1, 2, 3]) {
      const size = propArtworkSize(source, definition, cell);
      const bounds = propArtworkBounds({ ...object, rotation }, size, cell);
      assert.ok(Object.values(size).every(value => Number.isFinite(value) && value > 0));
      assert.ok(Object.values(bounds).every(Number.isFinite));
      assert.ok(bounds.right > bounds.left && bounds.bottom > bounds.top);
      assert.ok(bounds.left <= object.x * cell && bounds.right >= (object.x + object.w) * cell);
      assert.ok(bounds.top <= object.y * cell && bounds.bottom >= (object.y + object.h) * cell);
    }
  }
});

test('rotated redraw bounds preserve the bottom-center sprite anchor and include the footprint', () => {
  const object = { x: 10, y: 10, w: 1, h: 1 };
  const size = { width: 32, height: 64 };
  assert.deepEqual(propArtworkBounds(object, size, 16),
    { left: 149, top: 109, right: 187, bottom: 179 });
  assert.deepEqual(propArtworkBounds(object, null, 16),
    { left: 157, top: 157, right: 179, bottom: 179 });
  const rotated = propArtworkBounds({ ...object, rotation: 1 }, size, 16);
  assert.equal(rotated.left, 157);
  assert.equal(rotated.right, 235);
  assert.equal(rotated.top, 157);
  assert.equal(rotated.bottom, 195);
});

test('older map overrides still apply without rotation fields', () => {
  const map = baseMap();
  const x = 2, y = 2, tile = map.ground[y][x] === '.' ? '#' : '.';
  const edited = mapWithEdits(map, {
    tiles: [{ x, y, tile }],
    objects: { move: [{ index: 0, x: map.objects[0].x + 1, y: map.objects[0].y }], add: [], remove: [] },
  });

  assert.equal(edited.ground[y][x], tile);
  assert.equal(edited.objects[0].x, map.objects[0].x + 1);
  assert.equal(edited.objects[0].rotation || 0, 0);
});

test('legacy index-only prop edits are bound to their source objects when saved', () => {
  const map = baseMap();
  const edits = { objects: { move: [{ index: 0, x: 4, y: 5 }], remove: [1] } };
  bindLegacyObjectReferences(edits, map);

  assert.deepEqual(edits.objects.move[0].source, sourceObjectIdentity(map.objects[0]));
  assert.deepEqual(edits.objects.remove[0], {
    index: 1, source: sourceObjectIdentity(map.objects[1]),
  });
});

test('source-backed map edits validate against their source rather than a shifted index', () => {
  const map = baseMap();
  const source = sourceObjectIdentity(map.objects[0]);
  assert.doesNotThrow(() => validateMapEdits('allen', {
    objects: { move: [{ index: 0, source, x: map.objects[0].x, y: map.objects[0].y }] },
  }, { ...map, objects: [{ kind: 'bush', x: 1, y: 1, w: 1, h: 1 }, ...map.objects] },
  OBJECTS, { ZONES: {} }, {}));

  assert.throws(() => validateMapEdits('allen', {
    objects: { move: [{ index: 0, source, x: map.objects[0].x, y: map.objects[0].y }] },
  }, { ...map, objects: [map.objects[0], { ...map.objects[0] }] },
  OBJECTS, { ZONES: {} }, {}), /ambiguous.*clear or rebind/);
});

test('source identities rebase prop moves and removals after source objects are inserted', () => {
  const map = baseMap();
  const source = map.objects[0];
  const identity = sourceObjectIdentity(source);
  const edit = {
    objects: {
      move: [{ index: 0, source: identity, x: 18, y: 18 }],
      remove: [{ index: 1, source: sourceObjectIdentity(map.objects[1]) }],
    },
  };
  const inserted = { kind: 'tree', x: 25, y: 25, w: 1, h: 1, v: 'oak' };
  const changedMap = { ...map, objects: [inserted, ...map.objects] };
  const result = mapWithEdits(changedMap, edit);

  assert.deepEqual(
    [result.objects[1].kind, result.objects[1].x, result.objects[1].y],
    [source.kind, 18, 18],
  );
  assert.deepEqual(result.objects[0], inserted);
  assert.equal(result.objects.some(object =>
    object.kind === map.objects[1].kind && object.x === map.objects[1].x && object.y === map.objects[1].y), false);
});

test('deleted or ambiguous source props never fall back to their old index', () => {
  const map = baseMap();
  const target = map.objects[0];
  const identity = sourceObjectIdentity(target);
  const replacement = { kind: 'bush', x: target.x, y: target.y, w: 1, h: 1, v: 'green' };
  const changedMap = { ...map, objects: [replacement, ...map.objects.slice(1)] };
  const edit = {
    objects: {
      move: [{ index: 0, source: identity, x: 18, y: 18 }],
      remove: [{ index: 0, source: identity }],
    },
  };

  assert.equal(resolveSourceObjectIndex(changedMap.objects, identity), -1);
  assert.deepEqual(sourceObjectMatches([target, { ...target }], identity), [0, 1]);
  const result = mapWithEdits(changedMap, edit);
  assert.deepEqual(result.objects[0], replacement);
  const ambiguous = mapWithEdits({ ...map, objects: [target, { ...target }] }, {
    objects: { move: [{ index: 0, source: identity, x: 18, y: 18 }] },
  });
  assert.deepEqual(ambiguous.objects.slice(0, 2), [target, { ...target }]);
  const invalidReference = mapWithEdits(changedMap, {
    objects: { move: [{ index: 0, source: null, x: 18, y: 18 }] },
  });
  assert.deepEqual(invalidReference.objects[0], replacement);
});

test('rebound stale prop moves and removals validate and apply to their unique source props', () => {
  const map = baseMap();
  const candidates = map.objects.flatMap((object, index) =>
    sourceObjectMatches(map.objects, sourceObjectIdentity(object)).length === 1 ? [index] : []);
  assert.ok(candidates.length >= 2, 'The test map needs two uniquely identifiable source props');
  const [moveIndex, removeIndex] = candidates;
  const edits = {
    objects: {
      move: [{
        index: 999,
        source: { kind: 'removed_prop', x: 0, y: 0, w: 1, h: 1 },
        x: 1, y: 1,
      }],
      remove: [{
        index: 1000,
        source: { kind: 'removed_prop', x: 2, y: 2, w: 1, h: 1 },
      }],
      add: [],
    },
  };

  edits.objects.move[0] = {
    ...edits.objects.move[0],
    index: moveIndex,
    source: sourceObjectIdentity(map.objects[moveIndex]),
  };
  edits.objects.remove[0] = {
    ...edits.objects.remove[0],
    index: removeIndex,
    source: sourceObjectIdentity(map.objects[removeIndex]),
  };
  assert.doesNotThrow(() => validateMapEdits('allen', edits, map, OBJECTS, { ZONES: {} }, {}));
  const repaired = mapWithEdits(map, edits);
  assert.deepEqual(
    [repaired.objects[moveIndex].x, repaired.objects[moveIndex].y],
    [1, 1],
    'A repaired move must update its chosen source, not its old index',
  );
  assert.equal(repaired.objects.some(object =>
    JSON.stringify(sourceObjectIdentity(object)) === JSON.stringify(sourceObjectIdentity(map.objects[removeIndex]))),
  false, 'A repaired removal must remove its chosen source');
  assert.equal(repaired.objects.some(object => object.kind === 'removed_prop'), false);
});

test('yard prop edits survive upgrade-dependent objects appearing before their sources', () => {
  const previous = state.data;
  try {
    state.data = structuredClone(state.data);
    delete state.data.upgrades.pool;
    delete state.data.upgrades.veggiepatch;
    const original = ZONES.yard.build();
    const sourceSignIndex = original.objects.findIndex(object =>
      object.kind === 'sign' && object.x === 17 && object.y === 14);
    const toolboxIndex = original.objects.findIndex(object => object.kind === 'toolbox');
    assert.ok(sourceSignIndex >= 0);
    assert.ok(toolboxIndex >= 0);

    state.data.upgrades.pool = true;
    state.data.upgrades.veggiepatch = true;
    const upgraded = ZONES.yard.build();
    assert.notEqual(upgraded.objects[sourceSignIndex].kind, 'sign');
    const edit = {
      objects: {
        move: [{
          index: sourceSignIndex,
          source: sourceObjectIdentity(original.objects[sourceSignIndex]),
          x: 19, y: 15,
        }],
        remove: [{
          index: toolboxIndex,
          source: sourceObjectIdentity(original.objects[toolboxIndex]),
        }],
      },
    };
    const result = mapWithEdits(upgraded, edit);
    assert.ok(result.objects.some(object => object.kind === 'sign' && object.x === 19 && object.y === 15));
    assert.ok(result.objects.some(object => object.kind === 'paddlingpool'));
    assert.equal(result.objects.some(object => object.kind === 'toolbox'), false);

    const optionalSign = upgraded.objects.find(object => object.kind === 'sign' && object.x === 15 && object.y === 3);
    const optionalEdit = {
      objects: { move: [{ index: upgraded.objects.indexOf(optionalSign),
        source: sourceObjectIdentity(optionalSign), x: 19, y: 4 }] },
    };
    state.data.upgrades.pool = false;
    state.data.upgrades.veggiepatch = false;
    const withoutUpgrades = mapWithEdits(ZONES.yard.build(), optionalEdit);
    assert.ok(withoutUpgrades.objects.some(object => object.kind === 'flowerbed' && object.x === 8 && object.y === 1));
  } finally { state.data = previous; }
});

test('tile and prop artwork rotations do not change the collision map', () => {
  const map = baseMap();
  const x = 2, y = 2, tile = map.ground[y][x] === '.' ? '#' : '.';
  const object = map.objects[0];
  const edited = mapWithEdits(map, {
    tiles: [{ x, y, tile, rotation: 1 }],
    objects: {
      move: [{ index: 0, x: object.x, y: object.y, rotation: 3 }],
      add: [], remove: [],
    },
  });

  assert.equal(edited.ground[y][x], tile);
  assert.equal(edited.tileRotations[y][x], 1);
  assert.equal(edited.objects[0].rotation, 3);
  assert.deepEqual(edited.solid, map.solid);
});

test('rotated added props keep their original collision footprint', () => {
  const map = baseMap();
  const kind = Object.keys(OBJECTS).find(id => OBJECTS[id].foot?.[0] === 1 && OBJECTS[id].foot?.[1] === 1);
  const prop = { kind, x: 1, y: 1, v: OBJECTS[kind].variants?.[0] || '' };
  const plain = mapWithEdits(map, { objects: { move: [], add: [prop], remove: [] } });
  const rotated = mapWithEdits(map, {
    objects: { move: [], add: [{ ...prop, rotation: 2 }], remove: [] },
  });

  assert.equal(rotated.objects.at(-1).rotation, 2);
  assert.equal(rotated.objects.at(-1).w, plain.objects.at(-1).w);
  assert.equal(rotated.objects.at(-1).h, plain.objects.at(-1).h);
  assert.deepEqual(rotated.solid, plain.solid);
});

test('imported yard furniture preserves pre-import authored prop indexes', () => {
  const yard = ZONES.yard.build();
  for (const [index, kind, x, y] of [
    [11, 'petbed', 6, 8], [121, 'trampoline', 12, 6], [122, 'trike', 6, 12],
    [125, 'wheelbarrow', 7, 5], [128, 'potplant', 15, 14],
  ]) {
    const object = yard.objects[index];
    assert.deepEqual([object.kind, object.x, object.y], [kind, x, y]);
  }
});

test('course clearing happens after authored moves without modifying the saved document', () => {
  const previous = state.data;
  try {
    state.data = structuredClone(state.data);
    state.addItem('coursekit');
    const yard = ZONES.yard.build();
    const edit = { objects: { move: [{ index: 121, x: 13, y: 3 },
      { index: 122, x: 20, y: 2 }], add: [], remove: [] } };
    const before = JSON.stringify(edit);
    const effective = mapWithEdits(yard, edit);
    assert.ok(effective.objects.some(o => o.kind === 'trampoline' && o.x === 13 && o.y === 3));
    assert.ok(effective.objects.some(o => o.kind === 'trike' && o.x === 20 && o.y === 2));
    for (let y = 6; y < 14; y++) for (let x = 2; x < 17; x++)
      assert.equal(effective.solid[y * effective.w + x], 0);
    assert.equal(JSON.stringify(edit), before);
  } finally { state.data = previous; }
});
