import test from 'node:test';
import assert from 'node:assert/strict';

const storage = new Map();
globalThis.localStorage = { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) };

const { state } = await import('../game/src/systems/state.js');
const { SAVE_KEY } = await import('../game/src/config.js');
const { ZONES } = await import('../game/src/data/regions.js');
const { PLANT_SPOT_ORDER, plantAt } = await import('../game/src/data/furniture.js');

const homePlants = () => ZONES.home.build().objects.filter(o => o.kind === 'plant').map(o => `${o.x},${o.y}:${o.v}`);

test('a new pot plant replaces one spot at home, not every plant', () => {
  state.useSlot(1);
  assert.deepEqual(homePlants(), ['1,10:fiddle', '22,9:fern', '1,12:fern']);
  state.placeFurniture('monstera', 'hall');
  assert.deepEqual(homePlants(), ['1,10:monstera', '22,9:fern', '1,12:fern']);
  assert.equal(plantAt(state.data.furniture, 'lounge'), 'mixed');
  state.placeFurniture('cactus', 'lounge');
  assert.deepEqual(homePlants(), ['1,10:monstera', '22,9:cactus', '1,12:fern']);
  state.placeFurniture('mixed', 'hall');
  assert.deepEqual(homePlants(), ['1,10:fiddle', '22,9:cactus', '1,12:fern']);
  state.placeFurniture('lily');   // no spot chosen: nothing changes
  assert.deepEqual(homePlants(), ['1,10:fiddle', '22,9:cactus', '1,12:fern']);
});

test('the twins\' room pair is replaced together', () => {
  state.useSlot(1);
  state.data.upgrades.twinsroom = true;
  assert.ok(homePlants().includes('5,7:fern') && homePlants().includes('1,7:fiddle'));
  state.placeFurniture('lily', 'twins');
  assert.ok(homePlants().includes('5,7:lily') && homePlants().includes('1,7:lily'));
  assert.ok(homePlants().includes('1,10:fiddle'), 'Other spots keep their plants');
});

test('plant spots survive a reload, and old whole-house plants are kept', () => {
  state.useSlot(1);
  state.placeFurniture('bird', 'bedroom');
  state.save(); state.useSlot(1);
  assert.equal(plantAt(state.data.furniture, 'bedroom'), 'bird');

  // An old save: one plant for the whole house and no per-spot record.
  const old = JSON.parse(storage.get(`${SAVE_KEY}-slot1`));
  old.furniture = { couch: 'old', plant: 'cactus', owned: ['cactus'] };
  storage.set(`${SAVE_KEY}-slot2`, JSON.stringify(old));
  state.useSlot(2);
  for (const spot of PLANT_SPOT_ORDER) assert.equal(plantAt(state.data.furniture, spot), 'cactus', spot);
  // Junk in the save is ignored.
  old.furniture = { plant: 'velvet', plants: { hall: 'nope', lounge: 'velvet', study: 'ivy' } };
  storage.set(`${SAVE_KEY}-slot3`, JSON.stringify(old));
  state.useSlot(3);
  assert.deepEqual(state.data.furniture.plants, { study: 'ivy' });
  assert.equal(state.data.furniture.plant, 'mixed');
});
