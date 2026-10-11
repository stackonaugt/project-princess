// Round three: a battler in every suburb, ambushes, new evolutions, dog show bonuses.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

const G = new URL('../game/', import.meta.url);
const mod = p => import(new URL(p, G).href);
const { ZONES, SUBURBS, getMap } = await mod('src/data/regions.js');
const { TRAINERS, ENEMIES } = await mod('src/data/enemies.js');
const { MOVES } = await mod('src/data/moves.js');
const { NPCS } = await mod('src/data/npcs.js');
const { PET_BY_ID } = await mod('src/data/pets.js');
const { petSize } = await mod('src/data/pet-sizes.js');
const { HandlingEvent } = await mod('src/systems/handling-event.js');

const trainersIn = zone => (getMap(zone).npcs || []).map(n => n.id).filter(id => TRAINERS[id]);

test('every suburb has someone to battle outdoors', () => {
  for (const suburb of Object.keys(SUBURBS)) {
    const zones = Object.entries(ZONES).filter(([, z]) => z.suburb === suburb && !z.indoor && !z.home).map(([id]) => id);
    if (!zones.length) continue;
    assert.ok(zones.some(z => trainersIn(z).length), `${suburb} has no battler`);
  }
});

test('the new battlers stand where the owner asked', () => {
  const at = { kos: 'coburglake', lambros: 'coburg', meghan: 'moreland', golfer: 'loddon', guard: 'summerhill', ramon: 'lohse', markteapot: 'flemington', amy: 'altona' };
  for (const [id, zone] of Object.entries(at)) assert.ok(getMap(zone).npcs.some(n => n.id === id), `${id} in ${zone}`);
  assert.ok(!getMap('coburg').npcs.some(n => n.id === 'meghan'), 'Meghan has moved off Bell St');
  const golfer = getMap('loddon').npcs.find(n => n.id === 'golfer');
  assert.equal(getMap('loddon').ground[golfer.y][golfer.x], 'f', 'golfer is out on the street');
});

test('every trainer foe has moves, text and art', async () => {
  const { FOE_ART } = await mod('src/art/paint/enemies.js');
  for (const id of ['kos', 'lambros', 'guard', 'ramon', 'markteapot', 'amy', 'parking', 'doggies']) {
    const t = TRAINERS[id];
    assert.ok(NPCS[id], `${id} npc`); assert.ok(t.challenge && t.ask && t.win, `${id} lines`);
    for (const [foe] of t.team) {
      assert.ok(ENEMIES[foe], foe); assert.ok(FOE_ART[foe], `${foe} art`);
      for (const m of ENEMIES[foe].moves) assert.ok(MOVES[m], `${foe} move ${m}`);
    }
  }
  assert.deepEqual(TRAINERS.amy.team.map(([f]) => f), ['couch', 'austin', 'nala']);
  assert.deepEqual(TRAINERS.guard.team.map(([f]) => f), ['trolley']);
  assert.deepEqual(TRAINERS.markteapot.team.map(([f]) => f), ['pointcookmp']);
  assert.ok(/themselves|their/.test(MOVES.talkingup.text + MOVES.bragging.text), 'Austin is they/them');
});

test('ambushers wait for the right visit', () => {
  assert.equal(TRAINERS.golfer.ambush, 2);
  assert.equal(TRAINERS.ramon.ambush, 4);
});

test('BIG MART, Chlo-nado and Ziggy Iggy', () => {
  assert.equal(PET_BY_ID.marty.evolution.name, 'BIG MART');
  assert.equal(PET_BY_ID.ziggy.evolution.name, 'Ziggy Iggy');
  assert.equal(PET_BY_ID.chloe.evolution.name, 'Chlo-nado');
  assert.deepEqual(PET_BY_ID.chloe.evolution.type, PET_BY_ID.chloe.type, 'Chlo-nado keeps her type');
  assert.equal(PET_BY_ID.marty.evolution.type, PET_BY_ID.marty.type);
  assert.ok(petSize('marty', true) > petSize('marty') + 8, 'BIG MART is very tall');
  for (const id of ['marty', 'ziggy', 'chloe']) {
    assert.ok(existsSync(new URL(`assets/sprites/pets/${id}-evolved.png`, G)), `${id}-evolved.png`);
    for (const m of PET_BY_ID[id].evolution.moves) assert.ok(MOVES[m], `${id} move ${m}`);
  }
});

test('Speed types run agility faster; evolved pets present better', () => {
  const run = opts => {
    const e = new HandlingEvent('novice', 'course', 0, opts);
    const start = { ...e.dog }; e.phase = 'approach';
    e.tick(0.2, { x: e.dog.x + 200, y: e.dog.y });
    return Math.hypot(e.dog.x - start.x, e.dog.y - start.y);
  };
  assert.ok(run({ speedy: true }) > run({}), 'speedy dog covers more ground');
  const plain = new HandlingEvent('novice', 'presentation', 0, {}), evolved = new HandlingEvent('novice', 'presentation', 0, { evolved: true });
  for (const e of [plain, evolved]) { e.complete = true; e.faults = 2; e.elapsed = 60; }
  assert.ok(evolved.result().score > plain.result().score);
});
