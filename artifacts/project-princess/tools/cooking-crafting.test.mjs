// Cooking, Chapter 2 and crafting fixes: the dodgy fish pie bakes badly on
// purpose, Cr Bentleigh's own pie is a present, Coles sells plain lemons, and
// crafting takes scavenged scrap or new Bunnings stock.
import test from 'node:test';
import assert from 'node:assert/strict';

const storage = new Map();
globalThis.localStorage = { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) };
const { state } = await import('../game/src/systems/state.js');
const { BakingSession, DODGY_MIN } = await import('../game/src/systems/baking.js');
const { BAKES } = await import('../game/src/data/cooking.js');
const { ITEMS } = await import('../game/src/data/items.js');
const { SHOPS } = await import('../game/src/data/shops.js');
const { LUNCH, RECIPES } = await import('../game/src/data/story.js');
const { CRAFT_RECIPES, MATERIAL_ALTS } = await import('../game/src/data/crafting.js');
const { craft, craftReason, materialCount } = await import('../game/src/systems/crafting.js');
const { awardSkill } = await import('../game/src/systems/player-skills.js');
const { friendInfo } = await import('../game/src/data/friends.js');
const { getMap, invalidateMap } = await import('../game/src/data/regions.js');

function bake(s, well) {
  for (const i of s.ingredients) s.pour(i.id, well ? i.target : 10);
  for (let i = 0; i < (well ? 12 : 1); i++) s.stroke();
  s.finishStage();
  s.setHeat(well ? s.spec.oven.heat : 1);
  while (s.kind === 'oven' && (well ? s.st.brown < .62 : true)) s.tick(.05);
  if (s.kind === 'oven') s.finishStage();
  const tops = s.toppingChoices().slice().sort((a, b) => a.fit - b.fit);
  s.chooseTopping((well ? tops[tops.length - 1] : tops[0]).id);
  if (well) for (const st of s.pattern()) { for (let i = 1; i < st.length; i++) for (let k = 0; k <= 5; k++) s.pipe(st[i - 1][0] + (st[i][0] - st[i - 1][0]) * k / 5, st[i - 1][1] + (st[i][1] - st[i - 1][1]) * k / 5); s.lift(); }
  else for (let i = 0; i < 20; i++) s.pipe(.95, i / 20);
  s.finishStage();
}

test('the dodgy fish pie scores badly made bakes highly and a careful one too low', () => {
  assert.ok(BAKES.fishpie.dodgy);
  const bad = new BakingSession({ recipe: 'fishpie' }); bake(bad, false);
  assert.ok(bad.complete && bad.stars >= DODGY_MIN, `bad bake ${bad.stars}`);
  assert.equal(bad.result().dodgy, true);
  const good = new BakingSession({ recipe: 'fishpie' }); bake(good, true);
  assert.ok(good.stars < DODGY_MIN, `careful bake ${good.stars}`);
  assert.match(bad.current.instruction || '', /./);
});

test('no windowsill, and the swap leaves a pie and a silly reminder', () => {
  assert.doesNotMatch(JSON.stringify(RECIPES.fishpie), /windowsill/i);
  assert.doesNotMatch(ITEMS.fishpie.desc, /windowsill/i);
  assert.equal(LUNCH.already, 'You already swapped the pie, silly.');
  assert.ok(ITEMS.lesleypie.gift && ITEMS.lesleypie.liked);
  assert.equal(ITEMS.lesleypie.giftLines.lesley[0], 'love');
});

test('the cup is grey and no ingredient is grey', () => {
  const grey = c => { const n = parseInt(c.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255; return Math.max(r, g, b) - Math.min(r, g, b) < 20 && r > 100 && r < 180; };
  for (const b of Object.values(BAKES)) for (const i of b.ingredients) assert.ok(!grey(i.colour), i.id);
});

test('Coles lemons are just lemons; Bunnings sells new materials dearer than scrap', () => {
  assert.equal(ITEMS.lemon.name, 'Lemon');
  for (const id of SHOPS.bunnings.materials) {
    assert.ok(!/scrap|salvaged|offcut/i.test(ITEMS[id].name), id);
    assert.ok(Object.values(MATERIAL_ALTS).flat().includes(id), id);
  }
  for (const [scrap, [fresh]] of Object.entries(MATERIAL_ALTS)) assert.ok(ITEMS[fresh].price > ITEMS[scrap].price, fresh);
  for (const id of ['timber', 'cloth', 'cord', 'bolts']) assert.ok(!SHOPS.bunnings.materials.includes(id));
});

test('recipes accept scrap or new stock, scrap first', () => {
  state.useSlot(3); state.data.inventory = {};
  state.addItem('timber', 1); state.addItem('wood', 2); state.addItem('bolts', 1);
  assert.equal(materialCount('timber'), 3);
  assert.equal(craftReason('birdhouse'), null);
  assert.ok(craft('birdhouse').ok);
  assert.equal(state.count('timber'), 0); assert.equal(state.count('wood'), 1); assert.equal(state.count('bolts'), 0);
  assert.equal(state.count('birdhouse'), 1);
});

test('homemade presents are gifts people love', () => {
  const gifts = Object.keys(CRAFT_RECIPES).filter(id => ITEMS[id].gift && id !== 'ropeball');
  assert.ok(gifts.length >= 5);
  for (const id of gifts) { assert.ok(ITEMS[id].lovedBy.length, id); for (const w of ITEMS[id].lovedBy) assert.ok(friendInfo(w).loves.includes(id), `${w} loves ${id}`); }
});

test('the junk pile by the shed is a walkable forage spot', () => {
  invalidateMap('yard'); const m = getMap('yard');
  const s = m.spawns.find(x => x.items.includes('timber'));
  assert.ok(s); assert.equal(m.solid[Math.floor(s.y) * m.w + Math.floor(s.x)], 0);
});
