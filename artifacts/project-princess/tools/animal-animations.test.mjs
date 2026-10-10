import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { PETS } from '../game/src/data/pets.js';
import { PET_POSE_SHEETS } from './extend-pet-poses.mjs';
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

test('the runtime and template sheets decode and preserve both supplied frames exactly', async () => {
  const runtimePath = new URL('pets/spooky-evolved.png', art);
  const templatePath = new URL('templates/pets/spooky-evolved.png', art);
  const suppliedPath = new URL('pets/spooky-evolution.png', art);
  const runtime = sharp(runtimePath.pathname);
  const metadata = await runtime.metadata();
  assert.equal(metadata.width, 176);
  assert.equal(metadata.height, 16);
  const original = await sharp(suppliedPath.pathname).ensureAlpha().raw().toBuffer();
  const preserved = await runtime.clone().extract({ left: 0, top: 0, width: 32, height: 16 }).ensureAlpha().raw().toBuffer();
  assert.deepEqual(preserved, original);
  const template = await sharp(templatePath.pathname).ensureAlpha().raw().toBuffer();
  const pixels = await runtime.clone().ensureAlpha().raw().toBuffer();
  assert.deepEqual(template, pixels);
});

test('every actual base and evolved pet texture has an extended runtime and editable template', async () => {
  const expected = PETS.flatMap(p => [p.id, ...(p.evolution ? [`${p.id}-evolved`] : [])]);
  assert.deepEqual(
    [...PET_POSE_SHEETS.map(p => p.id), 'spooky-evolved'].sort(),
    expected.sort(),
  );
  for (const id of expected) {
    const texture = `pet-${id}`;
    for (const folder of ['pets', 'templates/pets']) {
      const metadata = await sharp(new URL(`${folder}/${id}.png`, art).pathname).metadata();
      assert.equal(metadata.width, 176, `${folder}/${id}`);
      assert.equal(metadata.height, 16, `${folder}/${id}`);
      assert.deepEqual(animationFrames(texture, 11, 'idle'), [0], texture);
      assert.deepEqual(animationFrames(texture, 11, 'walk'), [1, 2, 3, 4], texture);
      assert.deepEqual(animationFrames(texture, 11, 'jump'), [5, 6, 7], texture);
      assert.deepEqual(animationFrames(texture, 11, 'paw'), [8, 9, 10], texture);
    }
  }
});

test('all original runtime and template pixels are preserved, including evolution sources', async () => {
  for (const [file, [width, expected]] of Object.entries(PET_ORIGINAL_PIXELS)) {
    const pixels = await sharp(new URL(file, art).pathname)
      .extract({ left: 0, top: 0, width, height: 16 }).ensureAlpha().raw().toBuffer();
    assert.equal(createHash('sha256').update(pixels).digest('hex'), expected, file);
  }
  for (const id of ['princess', 'poppy']) {
    const source = sharp(new URL(`pets/${id}-evolution.png`, art).pathname);
    const { width } = await source.metadata();
    const original = await source.ensureAlpha().raw().toBuffer();
    const preserved = await sharp(new URL(`pets/${id}-evolved.png`, art).pathname)
      .extract({ left: 0, top: 0, width, height: 16 }).ensureAlpha().raw().toBuffer();
    assert.deepEqual(preserved, original, `${id} evolved runtime uses supplied art`);
  }
});

test('new walking and action drawings are visible and distinct for each runtime and template', async () => {
  for (const { id } of PET_POSE_SHEETS) for (const folder of ['pets', 'templates/pets']) {
    const sheet = sharp(new URL(`${folder}/${id}.png`, art).pathname);
    const frames = [];
    for (let i = 0; i < 11; i++) {
      const pixels = await sheet.clone().extract({ left: i * 16, top: 0, width: 16, height: 16 })
        .ensureAlpha().raw().toBuffer();
      assert.ok(pixels.some((p, n) => n % 4 === 3 && p > 0), `${id}/${i} is visible`);
      assert.ok(pixels.some((p, n) => n % 4 === 3 && p === 0), `${id}/${i} keeps transparency`);
      frames.push(pixels.toString('hex'));
    }
    const walk = animationFrames(`pet-${id}`, 11, 'walk').map(i => frames[i]);
    assert.equal(new Set(walk).size, 4, `${folder}/${id} has four distinct strides`);
    for (const action of ['jump', 'paw']) {
      const poses = animationFrames(`pet-${id}`, 11, action).map(i => frames[i]);
      assert.equal(new Set(poses).size, 3, `${folder}/${id} has three distinct ${action} poses`);
      assert.ok(poses.every(p => !frames.slice(0, 5).includes(p)),
        `${folder}/${id} ${action} is not a standing or walking drawing`);
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
