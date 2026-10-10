import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { MOVES, PET_MOVES } from '../game/src/data/moves.js';
import { PETS } from '../game/src/data/pets.js';
import { MOVE_ANIMATIONS, SIGNATURE_ANIMATIONS, ANIMATION_POSES, moveAnimations } from '../game/src/data/move-animations.js';
import { EVOLUTION_TIMING, flickerSchedule } from '../game/src/systems/evolution-fx.js';

const source = await readFile(new URL('../game/src/systems/battle-animations.js', import.meta.url), 'utf8');
const handled = new Set([...source.matchAll(/case '([a-z]+)'/g)].map(m => m[1]));
const GENERAL = MOVE_ANIMATIONS.slice(0, 12);   // lunge ... flame: shared by every move
const petMoves = PETS.flatMap(p => [
  ...(PET_MOVES[p.id] || []).map(id => [p.id, id]),
  ...(p.evolution?.moves || []).map(id => [`${p.id} (${p.evolution.name})`, id]),
]);

test('every animation name the Studio offers has a battle handler', () => {
  for (const anim of MOVE_ANIMATIONS) assert.ok(handled.has(anim), `no case '${anim}' in battle-animations.js`);
});

test('every pet move, base and evolved, resolves to handled animations', () => {
  for (const [pet, id] of petMoves) {
    assert.ok(MOVES[id], `${pet}: move ${id} exists`);
    const anims = moveAnimations(id, MOVES[id]);
    assert.ok(anims.length, `${pet}: ${id} has an animation`);
    for (const anim of anims) {
      assert.ok(MOVE_ANIMATIONS.includes(anim), `${pet}: ${id} plays ${anim}, which the Studio does not list`);
      assert.ok(handled.has(anim), `${pet}: ${id} plays ${anim}, which has no handler`);
    }
  }
});

test('signature routines point at real moves and real animations', () => {
  for (const [id, anim] of Object.entries(SIGNATURE_ANIMATIONS)) {
    assert.ok(MOVES[id], `signature move ${id} exists`);
    for (const a of [].concat(anim)) assert.ok(MOVE_ANIMATIONS.includes(a) && handled.has(a), `${id} -> ${a}`);
  }
  for (const [anim, action] of Object.entries(ANIMATION_POSES)) {
    assert.ok(MOVE_ANIMATIONS.includes(anim), anim);
    assert.ok(['walk', 'jump', 'paw'].includes(action), `${anim} poses with ${action}`);
  }
});

test("Poppy scoots and Princess humps her bed, whatever the move's generic anim", () => {
  assert.deepEqual(moveAnimations('scoot', { ...MOVES.scoot, anim: 'heal' }), ['scoot']);
  assert.deepEqual(moveAnimations('humpbed', MOVES.humpbed), ['bed']);
  assert.deepEqual(moveAnimations('runaway', MOVES.runaway), ['zoomies', 'fade']);
  assert.deepEqual(moveAnimations('lunge-only', { anim: 'lunge' }), ['lunge']);
});

test('every base pet has at least one routine of its own', () => {
  for (const p of PETS) {
    const own = (PET_MOVES[p.id] || []).flatMap(id => moveAnimations(id, MOVES[id])).filter(a => !GENERAL.includes(a));
    assert.ok(own.length, `${p.id} has a special routine`);
  }
});

test('the evolution sequence speeds up and stays around four to six seconds', () => {
  const s = flickerSchedule();
  for (let i = 1; i < s.length; i++) assert.ok(s[i] <= s[i - 1], 'flicker never slows down');
  const total = EVOLUTION_TIMING.glow + s.reduce((a, b) => a + b, 0) + EVOLUTION_TIMING.burst + EVOLUTION_TIMING.reveal;
  assert.ok(total >= 3500 && total <= 6000, `${total} ms`);
});
