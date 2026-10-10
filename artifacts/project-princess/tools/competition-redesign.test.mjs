import test from 'node:test';
import assert from 'node:assert/strict';
import { HandlingEvent } from '../game/src/systems/handling-event.js';
import { BakingSession, INGREDIENTS } from '../game/src/systems/baking.js';
import { trainingStarted, binManReady, knowsMotion } from '../game/src/systems/progression-gates.js';
import { resumeSlot, rememberResume, clearResume } from '../game/src/systems/browser-resume.js';
import { PETS } from '../game/src/data/pets.js';
import { MOVES } from '../game/src/data/moves.js';
import { petSize } from '../game/src/data/pet-sizes.js';
import { getMap } from '../game/src/data/regions.js';

// Pick the best topping and trace the piping pattern exactly.
function finishWell(s) {
  s.chooseTopping(s.toppingChoices()[0].id);
  for (const st of s.pattern()) { for (let i = 1; i < st.length; i++) for (let k = 0; k <= 5; k++) s.pipe(st[i - 1][0] + (st[i][0] - st[i - 1][0]) * k / 5, st[i - 1][1] + (st[i][1] - st[i - 1][1]) * k / 5); s.lift(); }
}


test('availability does not expose undiscovered motion objectives', () => {
  const data = { flags: {}, council: { known: [], passed: [], given: {} }, side: { school: {} } };
  assert.equal(trainingStarted(data), false);
  assert.equal(knowsMotion(data, 'lemons'), false);
  data.flags.knownMotions = ['lemons'];
  assert.equal(knowsMotion(data, 'lemons'), true);
  data.side.school.lessonDay = { princess: 1 };
  assert.equal(trainingStarted(data), true);
});
test('Bin Man waits for a stronger team or chapter two', () => {
  assert.equal(binManReady({ pets: { princess: { found: true } }, story: { chapter: 1 } }), false);
  assert.equal(binManReady({ pets: { a: { found: true }, b: { found: true }, c: { found: true } } }), true);
  assert.equal(binManReady({ story: { chapter: 2 } }), true);
});
test('a suspended tab can restore its selected slot, but an intentional title reset clears it', () => {
  const values = new Map(), storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  assert.equal(resumeSlot(storage), 0);
  rememberResume(2, storage); assert.equal(resumeSlot(storage), 2);
  clearResume(storage); assert.equal(resumeSlot(storage), 0);
  assert.equal(rememberResume(99, storage), false);
});
test('show handling never advances by waiting or guides the handler automatically', () => {
  const event = new HandlingEvent(), handler = { ...event.start };
  for (let i = 0; i < 1000; i++) event.tick(.05, handler);
  assert.equal(event.index, 0); assert.deepEqual(handler, event.start);
  event.cue('jump', handler); assert.equal(event.index, 0); assert.equal(event.faults, 1);
});
test('a stay requires both waiting and the handler stepping away', () => {
  const event = new HandlingEvent('novice', 'obedience');
  event.index = 2; event.dog = { ...event.station };
  const handler = { x: event.station.x + 9, y: event.station.y };
  event.cue('stay', handler);
  for (let i = 0; i < 65; i++) event.tick(.05, handler);
  event.cue('recall', handler); assert.equal(event.phase, 'hold');
  handler.x += 35; event.cue('recall', handler);
  assert.equal(event.phase, 'action');
});
test('show marks are deferred and include three separate judges', () => {
  const event = new HandlingEvent('champion');
  assert.equal(event.result().passed, false);
  assert.equal(event.result().marks.length, 3);
  event.complete = true; event.faults = 5;
  assert.equal(event.result().passed, false);
  assert.ok(event.result().marks.every(mark => mark >= 0 && mark <= 10));
});
test('mixing measures, ingredient order and technique affect actual baking quality', () => {
  const good = new BakingSession();
  for (const ingredient of INGREDIENTS) good.pour(ingredient.id, ingredient.target);
  for (let i = 0; i < 12; i++) good.stroke();
  assert.ok(good.stageQuality() >= 90); good.finishStage(); assert.equal(good.stage, 1);
  const bad = new BakingSession();
  for (const ingredient of [...INGREDIENTS].reverse()) bad.pour(ingredient.id, 10);
  for (let i = 0; i < 40; i++) bad.stroke();
  assert.ok(bad.stageQuality() < good.results[0].quality);
});
test('workstation sessions remain serialisable and produce bounded quality', () => {
  const session = new BakingSession();
  for (const ingredient of INGREDIENTS) session.pour(ingredient.id, ingredient.target);
  for (let i = 0; i < 12; i++) session.stroke();
  session.finishStage();
  const restored = Object.assign(new BakingSession(), JSON.parse(JSON.stringify(session)));
  restored.setHeat(.58);
  while (restored.stage === 1 && restored.st.brown < .62) restored.tick(.1);
  restored.finishStage();
  finishWell(restored);
  restored.finishStage();
  assert.equal(restored.result().complete, true);
  assert.equal(restored.result().results.length, 3);
  assert.ok(restored.result().quality >= 0 && restored.result().quality <= 100);
});
test('new evolved forms retain stable identities and have valid moves and larger world proportions', () => {
  const princess = PETS.find(p => p.id === 'princess'), spooky = PETS.find(p => p.id === 'spooky');
  assert.equal(princess.evolution.name, 'Queencess'); assert.equal(princess.evolution.type, 'fairy');
  assert.equal(spooky.evolution.name, 'Ghost'); assert.equal(spooky.evolution.species, 'Large white bunny');
  assert.ok(petSize('spooky', true) > petSize('spooky'));
  for (const pet of [princess, spooky]) for (const id of pet.evolution.moves) assert.ok(MOVES[id], id);
});
test('bake-off workstations and return connection are part of the playable map', () => {
  const map = getMap('bakeoff');
  for (const kind of ['bakeprep', 'bakeoven', 'bakedecor', 'bakejudge'])
    assert.ok(map.objects.some(object => object.interact === kind), kind);
  assert.ok(map.exits.some(exit => exit.to === 'moreland'));
  assert.ok(getMap('moreland').exits.some(exit => exit.to === 'bakeoff'));
});
