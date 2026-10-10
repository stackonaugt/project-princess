import test from 'node:test';
import assert from 'node:assert/strict';
import { state } from '../game/src/systems/state.js';
import { scaledLevel, scaleWild, scaleTrainer, SCALING } from '../game/src/systems/battle.js';
import { TRAINERS } from '../game/src/data/enemies.js';
import { BakingSession, DECO_TIME } from '../game/src/systems/baking.js';
import { listSprites } from '../game/tools/build-manifest.mjs';
import { keyForPath } from '../game/src/art/textures.js';

test('supplied enemy and battle background PNGs reach the sprite manifest', () => {
  const files = listSprites();
  assert.ok(files.some(f => f.startsWith('enemies/')), 'enemies/ must be listed');
  assert.ok(files.includes('backgrounds/laverton.png'), 'backgrounds/ must be listed');
  assert.ok(!files.some(f => f.includes('templates/')), 'templates stay out of the manifest');
  assert.equal(keyForPath('enemies/boy.png'), 'foe-boy');
  assert.equal(keyForPath('backgrounds/laverton.png'), 'battlebg-laverton');
});

test('foes start below the team and finish above it', () => {
  assert.ok(scaledLevel(5) < 5);
  assert.ok(scaledLevel(25) > 25);
  for (let p = 3; p < 30; p++) assert.ok(scaledLevel(p + 1) > scaledLevel(p));
});

test('wild levels follow team power in both directions', () => {
  for (let i = 0; i < 200; i++) {
    const weak = scaleWild({ id: 'x', level: 20 }, 6);
    assert.ok(weak.level <= Math.round(scaledLevel(6) + 1 + SCALING.maxAbove), `tough suburb eased: ${weak.level}`);
    const strong = scaleWild({ id: 'x', level: 3 }, 20);
    assert.ok(strong.level >= Math.round(scaledLevel(20) - 1), `easy suburb keeps up: ${strong.level}`);
  }
  assert.equal(scaleWild(null, 10), null);
});

test('trainers ease off first time, grow on rematches and story fights stay put', () => {
  const id = Object.keys(TRAINERS).find(k => !TRAINERS[k].once && TRAINERS[k].team.some(([, lv]) => lv >= 10));
  const team = TRAINERS[id].team;
  delete state.data.beaten[id];
  const first = scaleTrainer(id, team, 5);
  first.forEach(([, lv], i) => assert.ok(lv <= team[i][1]));
  assert.ok(first.some(([, lv], i) => lv < team[i][1]));
  state.data.beaten[id] = 1;
  const rematch = scaleTrainer(id, team, 28);
  rematch.forEach(([, lv], i) => assert.ok(lv >= team[i][1]));
  delete state.data.beaten[id];
  assert.deepEqual(scaleTrainer('julie', TRAINERS.julie.team, 25), TRAINERS.julie.team);
});

test('competition decorating has a time limit; practice does not', () => {
  const s = new BakingSession({ competition: true });
  s.finishStage(); s.finishStage();
  s.place(8, 'cream');
  for (let t = 0; t < DECO_TIME + 1 && s.stage === 2; t += .1) s.tick(.1);
  assert.equal(s.complete, true);
  assert.ok(s.results[2].quality < 60, 'one topping is not a finished cake');
  const p = new BakingSession();
  p.finishStage(); p.finishStage();
  for (let t = 0; t < DECO_TIME + 5; t += .1) p.tick(.1);
  assert.equal(p.stage, 2);
});
