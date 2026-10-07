import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { reserveRemovedIds, validateEntities } from './studio-entities.mjs';
import { editorValue, sameTypes } from './dev-studio-plugin.mjs';
import { BASE_VALUES } from '../game/src/authoring/overrides.js';
import { mapWithEdits } from '../game/src/authoring/map-overrides.js';
import { isArchived, petVisible, petWorldMode } from '../game/src/authoring/archive.js';
import * as regions from '../game/src/data/regions.js';
import { PET_FRAMES } from '../game/src/art/sprites.js';
// Populate source snapshots, not authored/archived encounter lists.
import '../game/src/data/pets.js';
import '../game/src/data/npcs.js';
import '../game/src/data/moves.js';
import '../game/src/data/shops.js';
import '../game/src/systems/state.js';

function fixture(archived = false) {
  const pet = editorValue('PETS', BASE_VALUES['data/pets.js|PETS'])[0];
  const sourceId = pet.id;
  pet.id = 'archive_pet'; pet.name = 'Archive pet';
  const npc = editorValue('NPCS', BASE_VALUES['data/npcs.js|NPCS']).trish;
  const map = regions.ZONES.allen.build();
  const tile = Array.from(map.solid).findIndex((solid, i) => !solid && i % map.w > 4 && Math.floor(i / map.w) > 4);
  return {
    version: 1,
    maps: { allen: { npcs: [{ id: 'archive_npc', x: tile % map.w, y: Math.floor(tile / map.w), at: 'home' }] } },
    data: { world: { 'data/routines.js': { ROUTINE_OVERRIDES: {
      archive_npc: [{ days: [], from: 540, until: 1020, place: 'home' }],
    } } } },
    custom: {
      pets: { archive_pet: { record: pet, text: structuredClone(BASE_VALUES['data/dialogue.js|PET_TEXT'][sourceId]),
        moves: structuredClone(BASE_VALUES['data/moves.js|PET_MOVES'][sourceId]), art: {}, archived } },
      npcs: { archive_npc: { record: npc, text: structuredClone(BASE_VALUES['data/dialogue.js|PEOPLE'].trish), archived } },
    },
  };
}
const validate = (doc, previous) => validateEntities(doc, BASE_VALUES, regions, mapWithEdits, sameTypes, editorValue, PET_FRAMES, previous);

test('old documents, archived bundles, linked content and restoration validate unchanged', () => {
  validate({ version: 1, maps: {}, data: {} });
  const active = fixture();
  const archived = fixture(true);
  validate(active);
  validate(archived, active);
  const restored = structuredClone(archived);
  restored.custom.pets.archive_pet.archived = false;
  restored.custom.npcs.archive_npc.archived = false;
  validate(restored, archived);
  assert.deepEqual(restored, active);
  assert.equal(reserveRemovedIds(archived, active), undefined);
  assert.equal(reserveRemovedIds(restored, archived), undefined);
  for (const kind of ['pets', 'npcs']) {
    const invalid = fixture(true);
    Object.values(invalid.custom[kind])[0].archived = 'yes';
    assert.throws(() => validate(invalid), /archived must be a boolean/);
  }
});

test('archiving does not relax linked-content validation', () => {
  const doc = fixture(true);
  doc.custom.pets.archive_pet.moves = ['missing'];
  assert.throws(() => validate(doc), /missing battle move/);
  const invalidId = fixture(true);
  invalidId.custom.pets.archive_pet.record.id = 'new_pet';
  assert.throws(() => validate(invalidId), /stable ID/);
});

test('retired IDs survive omissions, import/reset, removal after restoration, and cannot be reassigned', () => {
  const original = fixture(true);
  const removed = { version: 1, maps: {}, data: {} };
  const retiredIds = reserveRemovedIds(removed, original);
  assert.deepEqual(retiredIds, { pets: ['archive_pet'], npcs: ['archive_npc'] });
  const saved = { ...removed, retiredIds };
  assert.deepEqual(reserveRemovedIds(removed, saved), retiredIds);
  assert.throws(() => reserveRemovedIds(fixture(), saved), /permanently reserved/);
  assert.deepEqual(reserveRemovedIds(removed, fixture()), retiredIds);
  for (const retiredIds of [[], { pets: 'bad' }, { pets: null }, { pets: false }, { pets: ['__proto__'] }, { unknown: [] }]) {
    assert.throws(() => reserveRemovedIds({ ...removed, retiredIds }));
  }
});

test('owned archived pets stay in party/home/dex; unowned ones have no new encounters', () => {
  const doc = fixture(true), pet = doc.custom.pets.archive_pet.record;
  assert.equal(isArchived('pets', pet.id, doc), true);
  assert.equal(petVisible(pet.id, false, doc), false);
  assert.equal(petVisible(pet.id, true, doc), true);
  assert.equal(petWorldMode(pet, pet.zone, false, false, false, doc), null);
  assert.equal(petWorldMode(pet, pet.zone, false, true, false, doc), null);
  assert.equal(petWorldMode(pet, pet.zone, false, true, true, doc), 'follow');
  assert.equal(petWorldMode(pet, pet.homeSpot.zone, true, true, false, doc), 'home');
  assert.equal(petWorldMode(pet, pet.homeSpot.zone, true, false, false, doc), null);
  assert.equal(petWorldMode(pet, pet.zone, false, false, false, fixture()), 'wild');
});

test('real runtime and old save round-trips preserve owned history, schedules, forms and stable IDs across archive/restore', async () => {
  // Isolate imports and JSON fixtures. Never touch the project's authoring file
  // or a player's browser storage; each phase gets a fresh module graph.
  const root = await mkdtemp(path.join(tmpdir(), 'princess-archive-'));
  try {
    await cp(fileURLToPath(new URL('../game/src', import.meta.url)), path.join(root, 'src'), { recursive: true });
    await writeFile(path.join(root, 'package.json'), '{"type":"module"}');
    const history = { found: true, points: 123, day: 4, date: '2025-01-02', level: 8, xp: 21,
      hp: 17, evolved: false, gear: null, reactions: { bread: 'love' }, chats: 9 };
    let save = { v: 8, day: 12, region: 'home', party: ['archive_pet'], pets: { archive_pet: history },
      friends: { archive_npc: { points: 900, met: true } }, beaten: { archive_npc: 3 },
      npcDay: { archive_npc: 7 }, story: { chapter: 4, invited: ['archive_npc'] } };
    for (const archived of [false, true, false]) {
      await writeFile(path.join(root, 'src/authoring/overrides.json'), JSON.stringify(fixture(archived)));
      const script = `
        import assert from 'node:assert/strict';
        import { state } from './src/systems/state.js';
        import { PET_BY_ID } from './src/data/pets.js';
        import { NPCS } from './src/data/npcs.js';
        import { PET_TEXT, PEOPLE } from './src/data/dialogue.js';
        import { PET_MOVES } from './src/data/moves.js';
        import { ROUTINES } from './src/data/routines.js';
        import { getMap } from './src/data/regions.js';
        import { form } from './src/systems/forms.js';
        import { attendees } from './src/systems/story.js';
        import { requestsFor } from './src/data/requests.js';
        const archived = ${archived};
        state.importCode(Buffer.from(JSON.stringify(${JSON.stringify(save)})).toString('base64'));
        assert.deepEqual(state.data.party, ['archive_pet']);
        assert.deepEqual(state.data.pets.archive_pet.reactions, { bread: 'love' });
        assert.equal(state.data.pets.archive_pet.points, 123);
        assert.equal(state.data.pets.archive_pet.level, 8);
        assert.equal(state.data.pets.archive_pet.xp, 21);
        assert.equal(state.data.pets.archive_pet.hp, 17);
        assert.equal(state.data.pets.archive_pet.date, '2025-01-02');
        assert.equal(state.data.pets.archive_pet.chats, 9);
        assert.equal(state.data.friends.archive_npc.points, 900);
        assert.equal(state.data.npcDay.archive_npc, 7);
        assert.equal(state.data.beaten.archive_npc, 3);
        assert.deepEqual(state.data.story.invited, ['archive_npc']);
        assert.equal(state.visiblePets().some(p => p.id === 'archive_pet'), true);
        assert.equal(state.foundIds().includes('archive_pet'), true);
        assert.ok(form('archive_pet').name);
        assert.ok(PET_BY_ID.archive_pet && NPCS.archive_npc && PET_TEXT.archive_pet && PEOPLE.archive_npc && PET_MOVES.archive_pet.length);
        assert.equal(ROUTINES.archive_npc({ day: 1, minutes: 600 }), 'home');
        assert.equal(getMap('allen').npcs.some(n => n.id === 'archive_npc'), !archived);
        assert.equal(attendees().includes('archive_npc'), !archived);
        assert.equal(requestsFor(1, ['archive_npc']).some(r => r.who === 'archive_npc'), !archived);
        const exported = JSON.parse(Buffer.from(state.exportCode().replace(/^PP3-/, ''), 'base64').toString());
        state.importCode(state.exportCode());
        assert.deepEqual(state.data.pets.archive_pet, exported.pets.archive_pet);
        state.data.pets.archive_pet.found = false;
        state.data.party = [];
        assert.equal(state.visiblePets().some(p => p.id === 'archive_pet'), !archived);
        assert.equal(state.findPet('archive_pet'), !archived);
        console.log(JSON.stringify(exported));
      `;
      await writeFile(path.join(root, 'check.mjs'), script);
      save = JSON.parse(execFileSync(process.execPath, ['check.mjs'], { cwd: root, encoding: 'utf8' }).trim());
    }
  } finally { await rm(root, { recursive: true, force: true }); }
});
