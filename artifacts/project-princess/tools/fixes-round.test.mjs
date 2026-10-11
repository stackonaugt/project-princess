import test from 'node:test';
import assert from 'node:assert/strict';
import { state } from '../game/src/systems/state.js';
import { BakingSession } from '../game/src/systems/baking.js';
import { BAKES } from '../game/src/data/cooking.js';
import { knownEffect } from '../game/src/systems/battle.js';
import { PET_BY_ID } from '../game/src/data/pets.js';
import { MOVES } from '../game/src/data/moves.js';
import { TYPES, effectiveness } from '../game/src/data/types.js';
import { onDuty } from '../game/src/data/routines.js';
import { showOpen } from '../game/src/data/dog-show.js';

function squeezeWell(s) { for (let i = 0; i < 2000 && s.juice && !s.juice.done; i++) { s.squeeze(s.juice.pressure < .7); s.tick(.05); } }
function bakeWell(s, { topping = 0 } = {}) {
  squeezeWell(s);
  for (const i of s.ingredients) s.pour(i.id, i.target);
  for (let i = 0; i < 12; i++) s.stroke();
  s.finishStage();
  if (s.spec.drink) return;
  s.setHeat(s.spec.oven.heat);
  while (s.kind === 'oven' && s.st.brown < .62) s.tick(.05);
  s.finishStage();
  s.chooseTopping(s.toppingChoices()[topping].id);
  for (const st of s.pattern()) { for (let i = 1; i < st.length; i++) for (let k = 0; k <= 5; k++) s.pipe(st[i - 1][0] + (st[i][0] - st[i - 1][0]) * k / 5, st[i - 1][1] + (st[i][1] - st[i - 1][1]) * k / 5); s.lift(); }
  s.finishStage();
}

test('every bake can earn three stars when it is made well', () => {
  for (const id of Object.keys(BAKES)) {
    const s = new BakingSession({ recipe: id });
    bakeWell(s);
    assert.equal(s.complete, true, id);
    assert.equal(s.stars, 3, id);
  }
});

test('lemonade is squeezing then sweetening, worth 1.5 stars each', () => {
  const s = new BakingSession({ recipe: 'lemonade' });
  assert.deepEqual(s.stages, ['juice', 'mix']);
  squeezeWell(s);
  assert.equal(s.kind, 'mix', 'the last lemon moves on to the sugar');
  s.finishStage();
  assert.ok(s.complete && s.stars >= 1 && s.stars <= 2, 'perfect juice alone is about half the stars');
});

test('squeezing too hard drops pips in, and pouring never comes back out', () => {
  const s = new BakingSession({ recipe: 'oilcake' });
  s.squeeze(true); for (let i = 0; i < 40; i++) s.tick(.05);
  assert.ok(s.juice.pips >= 1);
  s.juiceDone();
  s.pour('flour', 7); s.pour('flour', -3);
  assert.equal(s.st.amounts.flour, 7);
  assert.ok(s.juiceQ < 40);
});

test('the fill lines only show at the start', () => {
  const s = new BakingSession({ recipe: 'sponge' });
  assert.equal(s.showLines(), true);
  for (let i = 0; i < 40; i++) s.tick(.1);
  assert.equal(s.showLines(), false);
});

test('the oven: peeks are limited and let heat out, and heat changes the result', () => {
  const s = new BakingSession({ recipe: 'sponge' });
  s.finishStage();
  s.setHeat(.55); for (let i = 0; i < 30; i++) s.tick(.1);
  const before = s.st.temp;
  assert.equal(s.check(), true);
  assert.ok(s.st.temp < before);
  assert.equal(s.check(), false, 'the sponge only allows one peek');
  const hot = new BakingSession({ recipe: 'sponge' }); hot.finishStage(); hot.setHeat(.95);
  let best = 0; while (hot.kind === 'oven') { hot.tick(.1); if (hot.kind === 'oven') best = Math.max(best, hot.stageQuality()); }
  assert.ok(best < 70, `a scorching oven cannot make a good sponge (${best})`);
});

test('a topping that does not suit the bake costs marks', () => {
  const good = new BakingSession({ recipe: 'oilcake' }); bakeWell(good);
  const banana = new BakingSession({ recipe: 'oilcake' }); bakeWell(banana, { topping: 3 });
  assert.equal(BAKES.oilcake.toppings[3].id, 'banana');
  assert.ok(banana.results[2].quality < good.results[2].quality - 30);
});

test('bakes in the bag remember their stars, oldest first', () => {
  state.data.inventory.sponge = 0; delete state.data.bakeStars.sponge;
  state.addItem('sponge');
  state.addBake('sponge', 3); state.addBake('sponge', 1);
  assert.equal(state.nextBakeStars('sponge'), null, 'the unrated old one goes first');
  state.removeItem('sponge');
  assert.equal(state.nextBakeStars('sponge'), 3);
  state.removeItem('sponge');
  assert.equal(state.nextBakeStars('sponge'), 1);
  state.removeItem('sponge');
  assert.equal(state.data.bakeStars.sponge, undefined);
});

test('the move menu only shows Strong or Weak once a matchup is tried', () => {
  state.data.matchups = [];
  assert.equal(knownEffect('water', 'fire'), null);
  state.data.matchups.push('water>fire');
  assert.equal(knownEffect('water', 'fire'), 2);
  assert.equal(knownEffect('water', ['fire', 'rock']), null, 'dual types need both tried');
});

test('Steely and Muddy', () => {
  const rusty = PET_BY_ID.rusty.evolution, girlie = PET_BY_ID.girlie.evolution;
  assert.equal(rusty.name, 'Steely'); assert.equal(rusty.type, 'steel');
  assert.ok(rusty.moves.includes('dangerpaws') && rusty.moves.includes('sharpen'));
  assert.ok(MOVES.sharpen.effect.selfAtk > 0);
  assert.equal(girlie.name, 'Muddy'); assert.deepEqual(girlie.type, ['dirt', 'water']);
  assert.ok(TYPES.dirt && effectiveness('water', 'dirt') === 2);
  for (const m of girlie.moves) assert.ok(MOVES[m], m);
  assert.equal(PET_BY_ID.emilio.evolution, undefined);
});

test('Plenty Road Convenience never closes; the dog show judges on Sundays', () => {
  for (const t of [3 * 60, 12 * 60, 25 * 60]) assert.equal(onDuty('sam', t, 1), true);
  const weekday = d => ['Sunday', 'Monday'][d];
  assert.equal(showOpen(0, 10 * 60, weekday), true);
  assert.equal(showOpen(1, 10 * 60, weekday), false);
  assert.equal(showOpen(0, 18 * 60, weekday), false);
});
