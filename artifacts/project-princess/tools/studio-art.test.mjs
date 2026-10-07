import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, copyFile, writeFile, rm, symlink, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { assetLayout, suppliedAssetPath, entityArtBindings, runtimeArtBindingFailures } from '../game/src/art/asset-rules.js';
import { suppliedArtCatalog, validateBuildArt, validateEntityArt } from './studio-art.mjs';

test('sheet geometry follows runtime framing, and rejects partial/oversized frames', () => {
  assert.equal(assetLayout('pets', 64, 32).frames, 2);
  assert.equal(assetLayout('npcs', 48, 32).frames, 3);
  assert.equal(assetLayout('npcs', 32, 64).frames, 1);
  assert.equal(assetLayout('portraits', 1200, 900).frames, 1);
  for (const [folder, w, h] of [['pets', 35, 16], ['npcs', 48, 31], ['pets', 1040, 16], ['pets', 0, 16], ['portraits', 4097, 1]]) {
    assert.throws(() => assetLayout(folder, w, h));
  }
  assert.ok(suppliedAssetPath('portraits/photo.webp', 'portraits'));
  for (const file of ['../pets/a.png', 'pets/../../a.png', 'pets/a.jpg', 'pets/a.png?x=1', '/pets/a.png']) {
    assert.equal(suppliedAssetPath(file, 'pets'), false);
  }
});

test('aliases target only custom entities, including separate NPC portraits and evolved art', () => {
  const bindings = entityArtBindings({
    pets: { friend: { record: { evolution: {} }, art: { sprite: 'pets/princess.png',
      portrait: 'portraits/princess.jpg', evolvedSprite: 'pets/princess.png', evolvedPortrait: 'portraits/poppy.jpg' } } },
    npcs: { princess: { art: { sprite: 'npcs/trish.png', portrait: 'portraits/princess.jpg' } } },
  });
  assert.deepEqual(bindings.map(binding => binding.key),
    ['pet-friend', 'portrait-friend', 'pet-friend-evolved', 'portrait-friend-evolved', 'npc-princess', 'npcportrait-princess']);
  assert.equal(bindings[0].path, 'pets/princess.png');
  assert.equal(bindings[0].slot, 'sprite');
  assert.equal(bindings[4].slot, 'sprite');
});

test('runtime bindings require the assigned file, a custom texture, and compatible decoded dimensions', () => {
  const bindings = entityArtBindings({
    pets: { friend: { record: { evolution: {} }, art: {
      sprite: 'pets/friend.png',
      portrait: 'portraits/friend.jpg',
      evolvedSprite: 'pets/friend-evolved.png',
      evolvedPortrait: 'portraits/friend-evolved.webp',
    } } },
    npcs: { neighbor: { record: {}, art: {
      sprite: 'npcs/neighbor.png',
      portrait: 'portraits/neighbor.png',
    } } },
  });
  const runtime = new Map([
    ['pet-friend', { exists: true, custom: true, path: 'pets/friend.png', width: 32, height: 16 }],
    ['portrait-friend', { exists: true, custom: true, path: 'portraits/friend.jpg', width: 64, height: 80 }],
    ['pet-friend-evolved', { exists: true, custom: true, path: 'pets/friend-evolved.png', width: 32, height: 16 }],
    ['portrait-friend-evolved', { exists: true, custom: true, path: 'portraits/friend-evolved.webp', width: 96, height: 96 }],
    ['npc-neighbor', { exists: true, custom: true, path: 'npcs/neighbor.png', width: 48, height: 32 }],
    ['npcportrait-neighbor', { exists: true, custom: true, path: 'portraits/neighbor.png', width: 64, height: 64 }],
  ]);
  assert.deepEqual(runtimeArtBindingFailures(bindings, key => runtime.get(key)), []);

  runtime.delete('pet-friend-evolved');
  runtime.set('npc-neighbor', { exists: true, custom: true, path: 'npcs/wrong.png', width: 48, height: 32 });
  runtime.set('npcportrait-neighbor', { exists: true, custom: true, path: 'portraits/neighbor.png', width: 0, height: 32 });
  const failures = runtimeArtBindingFailures(bindings, key => runtime.get(key));
  assert.match(failures[0], /pet "friend" evolvedSprite .*pets\/friend-evolved\.png.*did not load as runtime texture "pet-friend-evolved"/i);
  assert.match(failures[1], /NPC "neighbor" sprite expected "npcs\/neighbor\.png".*loaded "npcs\/wrong\.png"/i);
  assert.match(failures[2], /NPC "neighbor" portrait .*incompatible runtime dimensions 0×32/i);
});

test('unassigned stable-ID artwork produces no custom binding failures', () => {
  const bindings = entityArtBindings({
    pets: { princess: { record: { evolution: {} }, art: {} } },
    npcs: { trish: { record: {}, art: {} } },
  });
  assert.deepEqual(bindings, []);
  assert.deepEqual(runtimeArtBindingFailures(bindings, () => null), []);
});

test('actual supplied files decode; missing, corrupt, wrong-kind and symlink files are rejected', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'princess-art-'));
  const source = new URL('../game/assets/sprites/', import.meta.url);
  try {
    for (const folder of ['pets', 'npcs', 'portraits']) await mkdir(path.join(root, folder));
    await copyFile(new URL('pets/princess.png', source), path.join(root, 'pets/friend.png'));
    await copyFile(new URL('templates/npcs/trish.png', source), path.join(root, 'npcs/friend.png'));
    await copyFile(new URL('portraits/princess.jpg', source), path.join(root, 'portraits/friend.jpg'));
    await writeFile(path.join(root, 'pets/broken.png'), 'not an image');
    const bytes = await readFile(new URL('pets/princess.png', source));
    await writeFile(path.join(root, 'pets/truncated.png'), bytes.subarray(0, 50));
    await symlink(path.join(root, 'pets/friend.png'), path.join(root, 'pets/link.png'));
    const catalog = await suppliedArtCatalog(root);
    assert.equal(catalog.assets.filter(asset => asset.valid).length, 3);
    assert.ok(catalog.assets.filter(asset => !asset.valid).length === 3);
    const custom = { pets: { friend: { record: {}, art: { sprite: 'pets/friend.png', portrait: 'portraits/friend.jpg' } } },
      npcs: { person: { record: {}, art: { sprite: 'npcs/friend.png', portrait: 'portraits/friend.jpg' } } } };
    await validateEntityArt(custom, root);
    for (const art of [
      { sprite: 'pets/missing.png' }, { sprite: 'pets/broken.png' }, { sprite: 'pets/truncated.png' },
      { sprite: 'pets/link.png' }, { sprite: '../pets/friend.png' }, { sprite: 'npcs/friend.png' },
      { portrait: 'pets/friend.png' }, { unknown: 'pets/friend.png' }, { evolvedSprite: 'pets/friend.png' },
      null, [],
    ]) await assert.rejects(validateEntityArt({ pets: { friend: { record: {}, art } } }, root));
    assert.equal(await readFile(path.join(root, 'pets/friend.png'), 'base64'), bytes.toString('base64'));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('production validation checks assigned art only and reports entity, slot and filename', async () => {
  const gameRoot = await mkdtemp(path.join(os.tmpdir(), 'princess-build-art-'));
  const spritesRoot = path.join(gameRoot, 'assets/sprites');
  const source = new URL('../game/assets/sprites/', import.meta.url);
  const authoringDirectory = path.join(gameRoot, 'src/authoring');
  try {
    for (const folder of ['pets', 'npcs', 'portraits']) {
      await mkdir(path.join(spritesRoot, folder), { recursive: true });
    }
    await mkdir(authoringDirectory, { recursive: true });
    await copyFile(new URL('pets/princess.png', source), path.join(spritesRoot, 'pets/friend.png'));
    await copyFile(new URL('pets/princess.png', source), path.join(spritesRoot, 'pets/evolved.png'));
    await copyFile(new URL('templates/npcs/trish.png', source), path.join(spritesRoot, 'npcs/person.png'));
    await copyFile(new URL('portraits/princess.jpg', source), path.join(spritesRoot, 'portraits/friend.jpg'));
    await copyFile(new URL('portraits/poppy.jpg', source), path.join(spritesRoot, 'portraits/evolved.jpg'));
    await copyFile(new URL('portraits/princess.jpg', source), path.join(spritesRoot, 'portraits/person.jpg'));
    await writeFile(path.join(spritesRoot, 'pets/unassigned-corrupt.png'), 'not an image');

    const authoringPath = path.join(authoringDirectory, 'overrides.json');
    const writeDocument = custom => writeFile(authoringPath, JSON.stringify({ custom }));
    const valid = {
      pets: { friend: { record: { evolution: {} }, art: {
        sprite: 'pets/friend.png',
        portrait: 'portraits/friend.jpg',
        evolvedSprite: 'pets/evolved.png',
        evolvedPortrait: 'portraits/evolved.jpg',
      } } },
      npcs: { person: { art: {
        sprite: 'npcs/person.png',
        portrait: 'portraits/person.jpg',
      } } },
    };
    await writeDocument(valid);
    await validateBuildArt(gameRoot);

    await writeDocument({
      pets: { friend: { art: { sprite: 'pets/missing.png' } } },
    });
    await assert.rejects(validateBuildArt(gameRoot), /friend sprite .*pets\/missing\.png.*missing/i);

    await writeFile(path.join(spritesRoot, 'pets/corrupt.png'), 'not an image');
    await writeDocument({ pets: { friend: { art: { sprite: 'pets/corrupt.png' } } } });
    await assert.rejects(validateBuildArt(gameRoot), /friend sprite .*pets\/corrupt\.png/);

    await copyFile(new URL('portraits/princess.jpg', source), path.join(spritesRoot, 'pets/wrong-format.png'));
    await writeDocument({ pets: { friend: { art: { sprite: 'pets/wrong-format.png' } } } });
    await assert.rejects(validateBuildArt(gameRoot), /friend sprite .*pets\/wrong-format\.png/);

    await copyFile(new URL('templates/npcs/trish.png', source), path.join(spritesRoot, 'pets/wrong-layout.png'));
    await writeDocument({ pets: { friend: { art: { sprite: 'pets/wrong-layout.png' } } } });
    await assert.rejects(validateBuildArt(gameRoot), /friend sprite .*pets\/wrong-layout\.png/);

    await writeDocument({ pets: { friend: { record: {}, text: {}, moves: [] } }, npcs: {} });
    await validateBuildArt(gameRoot);
  } finally { await rm(gameRoot, { recursive: true, force: true }); }
});
