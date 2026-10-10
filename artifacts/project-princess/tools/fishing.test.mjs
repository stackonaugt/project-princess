import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FishFight, FIGHT, FIGHT_TUNING } from '../game/src/systems/fishing.js';

const ZONE = { redfin: 0.18, carp: 0.3, eel: 0.12, yabby: 0.24, oldboot: 0.4 };
const seeded = seed => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

// Plays one fight at 60 fps with a bot that decides when to tap.
function play(fish, bot, seed) {
  const f = new FishFight({ fish, zone: ZONE[fish], rng: seeded(seed) });
  let last = -9;
  while (!f.over) { if (bot(f, last)) { f.tap(); last = f.t; } f.step(1 / 60); }
  return f;
}
const idle = () => false;
const spam = (f, last) => f.t - last > 0.07;
// A careful player: taps when the fish is outside the zone or heading out, and eases off when the line is tight.
const careful = (f, last) => {
  if (f.t - last < 0.14 || f.tension > 0.72) return false;
  const off = f.centre - f.pos, away = Math.sign(f.vel) !== Math.sign(off);
  return Math.abs(off) > f.zw * 0.3 && (away || Math.abs(off) > f.zw * 0.5) && !(Math.abs(f.vel) > 0.25 && !away);
};

test('every fish has fight numbers', () => {
  for (const fish of Object.keys(ZONE)) assert.ok(FIGHT[fish], fish);
});

test('the fish bolts away from the zone at the bite', () => {
  const f = new FishFight({ fish: 'redfin', zone: 0.18, rng: seeded(1) });
  assert.ok(f.inZone, 'starts on the hook in the zone');
  for (let i = 0; i < 30; i++) f.step(1 / 60);
  assert.ok(!f.inZone, 'half a second later it has run out of the zone');
});

test('a tap pulls the fish back towards the zone and tightens the line', () => {
  const f = new FishFight({ fish: 'carp', zone: 0.3, rng: seeded(2) });
  f.pos = 0.95; f.vel = 0;
  f.tap();
  assert.ok(f.vel < 0, 'pulled back towards the centre');
  assert.ok(f.tension > 0, 'line tension rises');
});

test('doing nothing never lands a fish', () => {
  for (const fish of Object.keys(ZONE)) for (let s = 0; s < 40; s++) assert.notEqual(play(fish, idle, s).result, 'caught', `${fish} seed ${s}`);
});

test('mashing the button snaps the line', () => {
  for (const fish of Object.keys(ZONE)) for (let s = 0; s < 20; s++) assert.equal(play(fish, spam, s).result, 'snap', `${fish} seed ${s}`);
});

test('a careful player lands fish, but never on the first pass', () => {
  for (const fish of Object.keys(ZONE)) {
    let caught = 0;
    for (let s = 0; s < 60; s++) {
      const f = play(fish, careful, s);
      if (f.result === 'caught') { caught++; assert.ok(f.t > 5, `${fish} landed too fast: ${f.t.toFixed(1)}s`); }
    }
    assert.ok(caught >= 45, `${fish}: only ${caught}/60 landed`);
  }
});

test('a fight always ends within the time limit', () => {
  const f = new FishFight({ fish: 'eel', zone: 0.12, rng: seeded(3) });
  let steps = 0;
  while (!f.over && steps < 100000) { if (steps % 40 === 0 && f.tension < 0.5) f.tap(); f.step(1 / 60); steps++; }
  assert.ok(f.over);
  assert.ok(f.t <= FIGHT_TUNING.timeLimit + 0.05);
});

test('every cast uses one bait, and there is no fishing without it', () => {
  const src = readFileSync(new URL('../game/src/scenes/WorldScene.js', import.meta.url), 'utf8');
  const body = src.slice(src.indexOf('async goFishing()'), src.indexOf('// ------------------------------------------------------------ pets'));
  assert.match(body, /if \(state\.count\('bait'\) < 1\) return ui\.say/);
  const removeAt = body.indexOf("state.removeItem('bait')"), fishAt = body.indexOf('ui.fish(');
  assert.ok(removeAt > 0 && removeAt < fishAt, 'bait is taken before the cast');
  assert.doesNotMatch(body, /if \(bait\) state\.removeItem/);
});
