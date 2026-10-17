import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { PETS } from '../game/src/data/pets.js';
import { PET_POSE_SHEETS } from './extend-pet-poses.mjs';
import { readdirSync } from 'node:fs';
import { PET_ORIGINAL_PIXELS } from './fixtures/pet-original-pixels.mjs';
import { animationFrames, actionFrameAt } from '../game/src/data/animation-layouts.js';

const art = new URL('../game/assets/sprites/', import.meta.url);
const key = 'pet-spooky-evolved';

test('evolved Spooky keeps walking, jump and paw poses in separate sequences', () => {
  assert.deepEqual(animationFrames(key, 11, 'idle'), [0]);
  assert.deepEqual(animationFrames(key, 11, 'walk'), [1, 2, 3, 4]);
  assert.deepEqual(animationFrames(key, 11, 'jump'), [5, 6, 7]);
  assert.deepEqual(animationFrames(key, 11, 'paw'), [8, 9, 10]);
});

test('short replacement sheets keep their original two-frame walking fallback', () => {
  assert.deepEqual(animationFrames(key, 2, 'walk'), [0, 1]);
  assert.deepEqual(animationFrames(key, 2, 'jump'), []);
  assert.deepEqual(animationFrames(key, 2, 'paw'), []);
});

test('action poses start at takeoff and finish without wrapping', () => {
  const frames = animationFrames(key, 11, 'jump');
  assert.deepEqual([0, .4, .8, 1, 2].map(p => actionFrameAt(frames, p)), [5, 6, 7, 7, 7]);
  assert.equal(actionFrameAt(frames, -.1), 5);
  assert.equal(actionFrameAt([], .5), 0);
  assert.equal(actionFrameAt(['takeoff-url', 'airborne-url', 'landing-url'], .8), 'landing-url');
});

// The owner's custom sheets, at any resolution: one row of square frames.
const SHEETS = readdirSync(new URL('pets/', art)).filter(f => f.endsWith('.png')).map(f => f.slice(0, -4)).sort();
const frame = async id => { const m = await sharp(new URL(`pets/${id}.png`, art).pathname).metadata(); return { ...m, size: m.height }; };

test('every custom pet sheet has all eleven action frames, and every form has art', async () => {
  for (const id of SHEETS) {
    const { width, size } = await frame(id);
    assert.equal(width, size * 11, `pets/${id}.png is 11 square frames`);
    assert.deepEqual(animationFrames(`pet-${id}`, 11, 'walk'), [1, 2, 3, 4], id);
  }
  for (const p of PETS) for (const id of [p.id, ...(p.evolution ? [`${p.id}-evolved`] : [])]) {
    const built = id.endsWith('-evolved') ? p.evolution.sprite : p.sprite;
    assert.ok(SHEETS.includes(id) || built, `${id} has a custom sheet or built-in art`);
  }
});

test("the owner's supplied frames still lead each sheet, pixel for pixel", async () => {
  for (const [file, [width, height, expected]] of Object.entries(PET_ORIGINAL_PIXELS)) {
    const pixels = await sharp(new URL(file, art).pathname)
      .extract({ left: 0, top: 0, width, height }).ensureAlpha().raw().toBuffer();
    assert.equal(createHash('sha256').update(pixels).digest('hex'), expected, file);
  }
});

test('walking, jump and paw frames are visible, and the actions are new drawings', async () => {
  for (const id of SHEETS) {
    const { size } = await frame(id);
    const sheet = sharp(new URL(`pets/${id}.png`, art).pathname);
    const frames = [];
    for (let i = 0; i < 11; i++) {
      const pixels = await sheet.clone().extract({ left: i * size, top: 0, width: size, height: size }).ensureAlpha().raw().toBuffer();
      assert.ok(pixels.some((p, n) => n % 4 === 3 && p > 0), `${id}/${i} is visible`);
      assert.ok(pixels.some((p, n) => n % 4 === 3 && p === 0), `${id}/${i} keeps transparency`);
      frames.push(createHash('sha1').update(pixels).digest('hex'));
    }
    const walk = animationFrames(`pet-${id}`, 11, 'walk').map(i => frames[i]);
    assert.ok(new Set(walk).size >= 2, `${id} has a stride`);
    for (const action of ['jump', 'paw']) {
      const poses = animationFrames(`pet-${id}`, 11, action).map(i => frames[i]);
      assert.ok(new Set(poses).size >= 2, `${id} ${action} moves`);
      assert.ok(poses.some(p => !frames.slice(0, 5).includes(p)), `${id} ${action} has its own drawing`);
    }
  }
});

test('short replacements and partial action exports never walk through jump or paw frames', () => {
  for (const id of [...PET_POSE_SHEETS.map(p => p.id), 'spooky-evolved']) {
    const texture = `pet-${id}`;
    assert.deepEqual(animationFrames(texture, 1, 'walk'), [0]);
    assert.deepEqual(animationFrames(texture, 2, 'walk'), [0, 1]);
    assert.deepEqual(animationFrames(texture, 3, 'walk'), [1, 0, 2, 0]);
    for (let count = 1; count <= 16; count++) {
      const walk = animationFrames(texture, count, 'walk');
      assert.ok(walk.every(i => i < 5 && i < count), `${texture}/${count} walk`);
      for (const action of ['jump', 'paw']) {
        const frames = animationFrames(texture, count, action);
        assert.ok(frames.every(i => i < count && !walk.includes(i)), `${texture}/${count} ${action}`);
        if (count < 11) assert.deepEqual(frames, []);
      }
    }
  }
});
