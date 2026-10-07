import test from 'node:test';
import assert from 'node:assert/strict';
import { LocalRouter, AutoWalk } from '../game/src/world/navigation.js';
import { state } from '../game/src/systems/state.js';
import { objectives } from '../game/src/systems/story.js';
import { pinObjective, pinnedObjective, resolveDestination, nextWalkingExit, exitRestriction } from '../game/src/systems/guidance.js';
import { getMap, invalidateMap } from '../game/src/data/regions.js';

const point = (x, y) => ({ x: x * 16 + 8, y: y * 16 + 12 });
function router(rows) {
  return new LocalRouter({ w: rows[0].length, h: rows.length, solid: Uint8Array.from(rows.join(''), c => c === '#' ? 1 : 0) });
}
test('deterministic wall detour, every segment preserves the 8x5 footprint', () => {
  const r = router(['.....', '..#..', '..#..', '..#..', '.....']);
  const start = point(0, 2), goal = point(4, 2), a = r.route(start, goal);
  assert.equal(a.status, 'ok');
  assert.deepEqual(a, r.route(start, goal));
  assert.ok(a.points.some(p => p.y < 16 || p.y > 64));
  let previous = start;
  for (const p of a.points) { assert.ok(r.segment(previous, p)); previous = p; }
});
test('one tile passage works; diagonal corner cutting and sealed destinations fail', () => {
  const r = router(['#####', '.....', '#####']);
  assert.equal(r.route(point(0, 1), point(4, 1)).status, 'ok');
  assert.equal(router(['.#', '#.']).route(point(0, 0), point(1, 1)).status, 'unreachable');
  assert.equal(router(['.#.', '.#.', '.#.']).route(point(0, 1), point(2, 1)).status, 'unreachable');
});
test('exact off-centre target respects body and bounds', () => {
  const r = router(['..#', '..#', '...']);
  assert.equal(r.clear(30, 25), false);
  assert.equal(r.route(point(0, 0), { x: 30, y: 25 }).status, 'unreachable');
  assert.equal(r.clear(2, 20), false);
});
test('approach solid object from reachable in-range tile', () => {
  const r = router(['.....', '..#..', '.....']);
  const goal = point(2, 1), result = r.route(point(0, 1), goal, 22);
  assert.equal(result.status, 'ok');
  assert.ok(Math.hypot(result.points.at(-1).x - goal.x, result.points.at(-1).y - goal.y) <= 22);
  assert.ok(r.clear(result.points.at(-1).x, result.points.at(-1).y));
});
test('unreachable feedback, cancellation, and interaction happens once', () => {
  const r = router(['.....', '..#..', '.....']), player = { ...point(0, 1) }, feedback = [];
  const walk = new AutoWalk(r, player, s => feedback.push(s)), target = { kind: 'look', ...point(2, 1) };
  assert.equal(walk.start(target, target, 22), true);
  let calls = 0;
  for (let i = 0; i < 20; i++) { walk.update(.05, () => calls++); if (player.target) Object.assign(player, player.target); }
  assert.equal(calls, 1);
  walk.start(point(4, 2)); walk.cancel(); walk.update(.05, () => calls++);
  assert.equal(player.target, null); assert.equal(walk.points.length, 0);
  assert.equal(walk.start(point(2, 1)), false); assert.equal(feedback.length, 1);
});
test('stalled route and moving NPC chase stop after bounded replans', () => {
  const r = router(['..........', '..........']), p = { ...point(0, 0) }, feedback = [];
  const walk = new AutoWalk(r, p, s => feedback.push(s));
  const ref = { ...point(9, 0), active: true, visible: true };
  walk.start(ref, { kind: 'npc', ref }, 22);
  for (let i = 0; i < 100; i++) walk.update(.05, () => assert.fail('Not in range'));
  assert.equal(walk.points.length, 0); assert.equal(feedback.length, 1);
});
test('large region has an explicit search bound', () => {
  const r = new LocalRouter({ w: 1000, h: 1000, solid: new Uint8Array(1000000) });
  assert.equal(r.route(point(0, 0), point(1, 1)).status, 'too-large');
});
test('real directed region route honours Princess gate and known/unknown distinction', () => {
  state.data.visited = ['home', 'allen', 'woods'];
  const scene = { regionId: 'home', player: point(12, 8), navigation: { router: new LocalRouter(getMap('home')) }, shutShop: () => null };
  assert.equal(resolveDestination({ region: 'woods' }, scene).status, 'unreachable');
  assert.equal(resolveDestination({ region: 'bunnings' }, scene).status, 'unknown');
  state.findPet('princess');
  assert.ok(nextWalkingExit('home', 'woods', scene));
  assert.match(exitRestriction('swanston', { to: 'bourke', gate: 'bencarroll' }, scene), /locked/);
  assert.equal(exitRestriction('home', { to: 'allen' }, { ...scene, party: true }), 'You cannot leave your own party.');
});
test('stable pins use existing quest completion, conceal unrevealed objectives, and expire daily requests', () => {
  state.data.story.chapter = 1; state.data.pets = {};
  assert.deepEqual(objectives(1).map(o => o.id), ['find-pets']);
  pinObjective('story', 'find-pets');
  assert.equal(pinnedObjective().done, false);
  pinObjective('story', 'find-pets'); assert.equal(pinnedObjective(), null);
  state.data.pinned = { kind: 'request', id: 'expired', day: state.data.day - 1 };
  assert.equal(pinnedObjective(), null);
});
test('old saves load without a pin and malformed pins are rejected', () => {
  state.importCode(btoa(JSON.stringify({ v: 9, region: 'home', story: { chapter: 1 } })));
  assert.equal(state.data.pinned, null);
  state.importCode(btoa(JSON.stringify({ pinned: { kind: 'bad', id: 'a' } })));
  assert.equal(state.data.pinned, null);
});
test('pinned story completion follows state and survives valid save import', () => {
  state.data.story.chapter = 2;
  pinObjective('story', 'kitchen');
  assert.equal(pinnedObjective().done, false);
  const code = state.exportCode(); state.data.pinned = null; state.importCode(code);
  assert.equal(pinnedObjective().id, 'kitchen');
  state.data.upgrades.kitchen = true;
  assert.equal(pinnedObjective().done, true);
});
test('NPC guidance follows schedules only into discovered regions', () => {
  state.data.story.chapter = 0;
  state.data.day = 1; state.data.minutes = 12 * 60;
  state.data.visited = ['home'];
  const scene = { regionId: 'home', player: point(12, 8), navigation: { router: new LocalRouter(getMap('home')) }, shutShop: () => null, npcs: [], pets: [] };
  assert.equal(resolveDestination({ npc: 'paddy' }, scene).status, 'unknown');
  state.data.visited.push('civiccentre'); state.findPet('princess');
  assert.equal(resolveDestination({ npc: 'paddy' }, scene).status, 'exit');
  state.data.minutes = 23 * 60;
  assert.equal(resolveDestination({ npc: 'paddy' }, scene).status, 'unknown'); // no live NPC in fixture
  assert.equal(resolveDestination(undefined, scene).status, 'instructions');
});
test('Moreland and Brunswick East Lygon have reciprocal, reachable direct exits', () => {
  state.findPet('princess');
  const a = getMap('moreland'), b = getMap('eblygon');
  const outward = a.exits.find(e => e.to === 'eblygon'), back = b.exits.find(e => e.to === 'moreland');
  assert.ok(outward); assert.ok(back);
  assert.equal(a.exits.some(e => e.to === 'coburg'), false);
  assert.equal(getMap('coburg').exits.some(e => e.to === 'moreland'), false);
  assert.ok(b.exits.some(e => e.to === 'donald'), 'Existing Donald St connection retained');
  for (const [source, exit, destination] of [[a, outward, b], [b, back, a]]) {
    const entry = destination.entries[exit.entry], r = new LocalRouter(destination);
    assert.ok(entry, `Arrival ${exit.entry} exists`);
    assert.ok(r.clear(point(entry.x, entry.y).x, point(entry.x, entry.y).y));
    const sourceEntry = Object.values(source.entries)[0], sr = new LocalRouter(source);
    const result = sr.route(point(sourceEntry.x, sourceEntry.y), {}, p =>
      p.x >= exit.x * 16 && p.x < (exit.x + exit.w) * 16 && p.y >= exit.y * 16 && p.y < (exit.y + exit.h) * 16);
    assert.equal(result.status, 'ok', 'The actual exit footprint is reachable');
  }
  assert.equal(nextWalkingExit('moreland', 'eblygon', { shutShop: () => null }).to, 'eblygon');
  assert.equal(nextWalkingExit('eblygon', 'moreland', { shutShop: () => null }).to, 'moreland');
});
test('shopping objectives stay at known Bunnings when Olly is off duty', () => {
  state.data.story.chapter = 2;
  const kitchen = objectives(2).find(o => o.id === 'kitchen');
  assert.deepEqual(kitchen.destination, { region: 'bunnings' });
  state.data.story.chapter = 4;
  for (const id of ['renovations', 'decorations']) assert.deepEqual(objectives(4).find(o => o.id === id).destination, { region: 'bunnings' });
  state.data.minutes = 23 * 60;
  state.data.visited = ['home', 'bunnings', 'altona']; state.findPet('princess');
  invalidateMap('altona');
  const scene = { regionId: 'altona', player: point(2, 13), navigation: { router: new LocalRouter(getMap('altona')) }, shutShop: to => to === 'bunnings' ? ['Bunnings is closed.'] : null };
  const result = resolveDestination(kitchen.destination, scene);
  assert.equal(result.status, 'unreachable');
  assert.match(result.text, /closed|locked/);
  assert.doesNotMatch(result.text, /unknown/);
  scene.regionId = 'bunnings'; scene.interactables = [];
  assert.equal(resolveDestination(kitchen.destination, scene).status, 'local');
});
