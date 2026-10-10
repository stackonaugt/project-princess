import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { MOVE_ANIMATIONS } from '../game/src/data/move-animations.js';
import { MOVES } from '../game/src/data/moves.js';
import { assertSupportedMoveAnimations, unsupportedMoveAnimations } from '../game/studio/move-animation-rules.js';
import { createEditorApiPlugin } from './dev-studio-plugin.mjs';

test('the shared animation list contains every current battle move animation', () => {
  assert.deepEqual(MOVE_ANIMATIONS, [
    'lunge', 'bite', 'claw', 'beam', 'shout', 'heal',
    'fade', 'hop', 'dig', 'gust', 'stink', 'flame', 'bed', 'burnbed',
    'scoot', 'zoomies', 'herd', 'nap', 'stare', 'puppyeyes', 'snack',
    'fetch', 'splash', 'shake', 'string', 'stretch', 'sharpen',
  ]);
});

test('unsupported animations are reported with their authored record path', () => {
  const document = {
    data: {
      gameplay: {
        'data/moves.js': {
          MOVES: {
            safe: { anim: 'beam' },
            custom: { anim: 'sparkle' },
            missing: { anim: '' },
          },
        },
      },
    },
  };
  const original = structuredClone(document);

  assert.deepEqual(unsupportedMoveAnimations(document), [
    { path: 'data → gameplay → data/moves.js → MOVES → custom', value: 'sparkle' },
    { path: 'data → gameplay → data/moves.js → MOVES → missing', value: '' },
  ]);
  assert.deepEqual(document, original);
});

test('animation validation visits custom moves and nested collections', () => {
  assert.deepEqual(unsupportedMoveAnimations({
    custom: {
      pets: { friend: { moves: [{ name: 'Trick', anim: 'teleport' }] } },
    },
  }), [{ path: 'custom → pets → friend → moves → 1', value: 'teleport' }]);
});

test('the shared save assertion accepts the existing authored battle moves', () => {
  assert.doesNotThrow(() => assertSupportedMoveAnimations({ MOVES }));
});

test('the save endpoint rejects unsupported animations without changing saved authoring data', async () => {
  const authoringPath = new URL('../game/src/authoring/overrides.json', import.meta.url);
  const savedBefore = await readFile(authoringPath);
  const previous = JSON.parse(savedBefore);
  const revision = createHash('sha256').update(JSON.stringify(previous)).digest('hex');
  const document = {
    version: 1,
    maps: {},
    data: {
      gameplay: {
        'data/moves.js': {
          MOVES: { forbiddenMove: { name: 'Forbidden Move', anim: 'sparkle' } },
        },
      },
    },
  };

  let handler;
  createEditorApiPlugin().configureServer({
    middlewares: { use(callback) { handler = callback; } },
  });

  const request = {
    method: 'PUT',
    url: '/__studio_api/save',
    headers: {
      'content-type': 'application/json',
      'if-match': revision,
    },
    async *[Symbol.asyncIterator]() {
      yield Buffer.from(JSON.stringify(document));
    },
  };
  const response = {
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    end(body) { this.body = body; },
  };

  await handler(request, response, () => assert.fail('The save endpoint did not handle the request.'));

  assert.equal(response.statusCode, 400);
  assert.match(JSON.parse(response.body).error, /forbiddenMove.*"sparkle"/);
  assert.match(JSON.parse(response.body).error, /Supported animations:.*lunge/);
  assert.deepEqual(await readFile(authoringPath), savedBefore);
});
