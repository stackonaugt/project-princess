// Development-only authoring regression check. Restores the original edit
// document in finally; never reads or modifies a player's localStorage.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, writeFile, rename } from 'node:fs/promises';
import { chromium } from 'playwright';

const root = 'http://127.0.0.1:80';
async function api(route, options = {}) {
  const response = await fetch(`${root}/__studio_api/${route}`, options);
  return { status: response.status, data: await response.json() };
}
const original = (await api('catalog')).data;
const overridesPath = new URL('../game/src/authoring/overrides.json', import.meta.url);
const originalBytes = await readFile(overridesPath);
assert.equal(original.saved.version, 1);
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
    (existsSync('/repl/tools/bin/chromium') ? '/repl/tools/bin/chromium' : undefined),
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('dialog', dialog => dialog.accept());

async function save(document, revision) {
  return api('save', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'If-Match': revision },
    body: JSON.stringify(document),
  });
}
async function change(selector, value) {
  await page.locator(selector).fill(String(value));
  await page.locator(selector).dispatchEvent('change');
}
async function clickTile(x, y) {
  await page.locator('#map-canvas').click({ position: { x: x * 16 + 8, y: y * 16 + 8 } });
}

try {
  await page.goto(`${root}/studio/`);
  await page.locator('#map-canvas').waitFor();
  const baselineMap = (await api('map?id=allen')).data.map;
  await page.locator('#map-tool').selectOption('paint');
  await page.locator('#tile-brush').selectOption('~');
  await clickTile(2, 2);
  await page.locator('#map-tool').selectOption('place');
  const prop = original.objectKinds.find(kind => kind.foot[0] === 1 && kind.foot[1] === 1);
  await page.locator('#object-kind').selectOption(prop.id);
  await clickTile(3, 3);
  await page.locator('#object-picker').selectOption('base:0');
  await page.locator('#remove-object').click();
  await page.locator('#object-picker').selectOption('base:1');
  await change('#object-x', 0);
  await change('#object-y', 0);
  await page.locator('#move-object').click();
  await page.locator('#exit-picker').selectOption('base:0');
  await page.waitForFunction(() => document.querySelector('#exit-entry').options.length > 0);
  await change('#exit-label', 'Studio test exit');
  await page.locator('#update-exit').click();

  await page.getByTestId('nav-story').click();
  await page.locator('#data-collection').selectOption('data/story.js|GOALS');
  await page.getByTestId('record-GOALS-1').click();
  await change('[data-testid="field-GOALS-1"]', 'Studio test goal');
  await page.getByTestId('nav-gameplay').click();
  await page.getByTestId('field-PETS-0-name').waitFor();
  await change('[data-testid="field-PETS-0-name"]', 'Studio test pet');
  await change('[data-testid="new-entity-id"]', 'studio_pet');
  await change('[data-testid="new-entity-name"]', 'Studio custom pet');
  await page.getByTestId('create-entity').click();
  await page.getByTestId('remove-entity').waitFor();
  await change('[data-testid="new-entity-id"]', 'studio_pet_copy');
  await change('[data-testid="new-entity-name"]', 'Studio duplicated pet');
  await page.getByTestId('duplicate-entity').click();
  await page.getByTestId('remove-entity').waitFor();

  await page.getByTestId('nav-world').click();
  await page.locator('#data-collection').selectOption('data/npcs.js|NPCS');
  await page.getByTestId('record-NPCS-trish').click();
  await change('[data-testid="new-entity-id"]', 'studio_npc');
  await change('[data-testid="new-entity-name"]', 'Studio custom character');
  await page.getByTestId('create-entity').click();
  await page.getByTestId('record-NPCS-studio_npc').waitFor();
  await change('[data-testid="field-NPCS-@text-lines-0-0"]', 'Hello from the studio.');
  await change('[data-testid="new-entity-id"]', 'studio_npc_copy');
  await change('[data-testid="new-entity-name"]', 'Temporary duplicate');
  await page.getByTestId('duplicate-entity').click();
  await page.getByTestId('record-NPCS-studio_npc_copy').waitFor();
  await page.getByTestId('remove-entity').click();
  assert.equal(await page.getByTestId('record-NPCS-studio_npc_copy').count(), 0);
  await page.locator('#data-collection').selectOption('data/shops.js|SHOPS');
  await page.getByTestId('record-SHOPS-petshop').click();
  await change('[data-testid="field-SHOPS-petshop-name"]', 'Studio test shop');
  await page.locator('#data-collection').selectOption('data/routines.js|ROUTINE_OVERRIDES');
  const character = original.scheduleCharacters[0];
  await page.getByTestId('schedule-character').selectOption(character.id);
  await page.getByTestId('add-schedule').click();
  await page.getByTestId('nav-maps').click();
  await page.locator('#map-canvas').waitFor();
  const open = baselineMap.ground.flatMap((row, y) => [...row].map((tile, x) => ({ tile, x, y })))
    .find(({ tile, x, y }) => x > 4 && y > 4 && !'~rWVRY'.includes(tile) &&
      !baselineMap.objects.some(object => x >= object.x && x < object.x + object.w && y >= object.y && y < object.y + object.h));
  assert.ok(open, 'Need a walkable tile for custom NPC placement.');
  await change('#npc-x', open.x);
  await change('#npc-y', open.y);
  await page.getByTestId('add-npc').click();
  await page.getByTestId('nav-world').click();
  await page.locator('#data-collection').selectOption('data/routines.js|ROUTINE_OVERRIDES');
  await page.getByTestId('schedule-character').selectOption('studio_npc');
  await page.getByTestId('add-schedule').click();
  await page.getByTestId('remove-schedule').click();
  assert.equal(await page.getByTestId('record-ROUTINE_OVERRIDES-studio_npc').count(), 0);
  await page.getByTestId('schedule-character').selectOption('studio_npc');
  await page.getByTestId('add-schedule').click();
  await page.locator('#data-collection').selectOption('data/npcs.js|NPCS');
  await page.getByTestId('record-NPCS-studio_npc').click();
  await page.getByTestId('remove-entity').click();
  assert.match(await page.locator('#studio-message').textContent(), /Remove references first.*placement/);

  const savedResponse = page.waitForResponse(response => response.url().endsWith('/__studio_api/save') && response.request().method() === 'PUT');
  await page.getByTestId('save-project').click();
  const response = await savedResponse;
  const saved = await response.json();
  assert.equal(response.status(), 200, JSON.stringify(saved));
  assert.equal(saved.saved.maps.allen.tiles.find(tile => tile.x === 2 && tile.y === 2).tile, '~');
  assert.equal(saved.saved.data.story['data/story.js'].GOALS[1], 'Studio test goal');
  assert.equal(saved.saved.custom.pets.studio_pet.record.id, 'studio_pet');
  assert.equal(saved.saved.custom.pets.studio_pet_copy.record.id, 'studio_pet_copy');
  assert.deepEqual(saved.saved.custom.pets.studio_pet.moves, saved.saved.custom.pets.studio_pet_copy.moves);
  assert.equal(saved.saved.custom.npcs.studio_npc.text.lines[0][0], 'Hello from the studio.');
  assert.equal(saved.saved.custom.npcs.studio_npc_copy, undefined);
  await page.reload();
  await page.getByTestId('nav-world').click();
  await page.locator('#data-collection').selectOption('data/npcs.js|NPCS');
  await page.getByTestId('record-NPCS-studio_npc').click();
  assert.equal(await page.getByTestId('field-NPCS-@text-lines-0-0').inputValue(), 'Hello from the studio.');
  await page.getByTestId('nav-story').click();
  await page.locator('#data-collection').selectOption('data/story.js|GOALS');
  assert.equal(await page.getByTestId('field-GOALS-1').inputValue(), 'Studio test goal');

  // Verify the game imports, not just the studio snapshot.
  const game = await browser.newPage();
  await game.goto(root);
  const runtime = await game.evaluate(async ({ characterId }) => {
    const [regions, story, pets, shops, routines, npcs, dialogue, moves] = await Promise.all([
      import('/src/data/regions.js'), import('/src/data/story.js'),
      import('/src/data/pets.js'), import('/src/data/shops.js'), import('/src/data/routines.js'),
      import('/src/data/npcs.js'), import('/src/data/dialogue.js'), import('/src/data/moves.js'),
    ]);
    const map = regions.getMap('allen');
    return {
      tile: map.ground[2][2], object: map.objects[0],
      exit: map.exits[0].label, goal: story.GOALS[1], pet: pets.PETS[0].name,
      shop: shops.SHOPS.petshop.name,
      schedule: routines.ROUTINES[characterId]({ day: 1, minutes: 600 }),
      customPet: pets.PET_BY_ID.studio_pet.name,
      customCopy: pets.PET_BY_ID.studio_pet_copy.id,
      customMoves: moves.PET_MOVES.studio_pet,
      customDialogue: dialogue.PEOPLE.studio_npc.lines[0][0],
      customNpc: npcs.NPCS.studio_npc.name,
      placement: map.npcs.find(npc => npc.id === 'studio_npc'),
      customSchedule: routines.ROUTINES.studio_npc({ day: 1, minutes: 600 }),
    };
  }, { characterId: character.id });
  assert.equal(runtime.tile, '~');
  assert.equal(runtime.object.kind, baselineMap.objects[1].kind);
  assert.equal(runtime.object.x, 0);
  assert.equal(runtime.object.y, 0);
  assert.equal(runtime.exit, 'Studio test exit');
  assert.equal(runtime.goal, 'Studio test goal');
  assert.equal(runtime.pet, 'Studio test pet');
  assert.equal(runtime.shop, 'Studio test shop');
  assert.equal(runtime.schedule, character.places[0]);
  assert.equal(runtime.customPet, 'Studio custom pet');
  assert.equal(runtime.customCopy, 'studio_pet_copy');
  assert.deepEqual(runtime.customMoves, saved.saved.custom.pets.studio_pet.moves);
  assert.equal(runtime.customDialogue, 'Hello from the studio.');
  assert.equal(runtime.customNpc, 'Studio custom character');
  assert.equal(runtime.placement.x, open.x);
  assert.equal(runtime.customSchedule, 'home');
  await game.close();

  // Exercise the creator-facing archive/restore controls, persisted through
  // reload, then confirm encounter filtering in the real runtime imports.
  await page.getByTestId('nav-world').click();
  await page.locator('#data-collection').selectOption('data/npcs.js|NPCS');
  await page.getByTestId('record-NPCS-studio_npc').click();
  await page.getByTestId('archive-entity').click();
  assert.match(await page.getByTestId('archive-entity').textContent(), /Restore/);
  await page.getByTestId('nav-gameplay').click();
  await page.locator('#data-collection').selectOption('data/pets.js|PETS');
  // Pet records use list indices; find by the retained display name.
  await page.locator('#data-records button').filter({ hasText: 'Studio custom pet' }).first().click();
  await page.getByTestId('archive-entity').click();
  const archiveResponse = page.waitForResponse(response => response.url().endsWith('/__studio_api/save') && response.request().method() === 'PUT');
  await page.getByTestId('save-project').click();
  const archiveResult = await archiveResponse;
  assert.equal(archiveResult.status(), 200);
  const archiveSaved = await archiveResult.json();
  assert.equal(archiveSaved.saved.custom.pets.studio_pet.archived, true);
  assert.equal(archiveSaved.saved.custom.npcs.studio_npc.archived, true);
  await page.reload();
  await page.getByTestId('archive-entity').waitFor();
  assert.match(await page.getByTestId('archive-entity').textContent(), /Restore/);
  const archivedGame = await browser.newPage();
  await archivedGame.goto(root);
  const archivedRuntime = await archivedGame.evaluate(async () => {
    const [{ getMap }, { PET_BY_ID }, { state }, { petWorldMode }] = await Promise.all([
      import('/src/data/regions.js'), import('/src/data/pets.js'),
      import('/src/systems/state.js'), import('/src/authoring/archive.js'),
    ]);
    const pet = PET_BY_ID.studio_pet;
    const hidden = !state.visiblePets().some(p => p.id === pet.id);
    state.data.pets[pet.id] = { found: true, hp: 10 };
    state.setParty([pet.id]);
    return {
      hidden, npcHidden: !getMap('allen').npcs.some(n => n.id === 'studio_npc'),
      ownedVisible: state.visiblePets().some(p => p.id === pet.id),
      party: state.data.party, wild: petWorldMode(pet, pet.zone, false, false, false),
      follow: petWorldMode(pet, pet.zone, false, true, true),
    };
  });
  assert.deepEqual(archivedRuntime, { hidden: true, npcHidden: true, ownedVisible: true, party: ['studio_pet'], wild: null, follow: 'follow' });
  await archivedGame.close();
  await page.getByTestId('archive-entity').click();
  await page.getByTestId('nav-world').click();
  await page.locator('#data-collection').selectOption('data/npcs.js|NPCS');
  await page.getByTestId('record-NPCS-studio_npc').click();
  await page.getByTestId('archive-entity').click();
  const restoreResponse = page.waitForResponse(response => response.url().endsWith('/__studio_api/save') && response.request().method() === 'PUT');
  await page.getByTestId('save-project').click();
  const restoreResult = await restoreResponse;
  assert.equal(restoreResult.status(), 200);
  const restoredArchive = await restoreResult.json();
  assert.equal(restoredArchive.saved.custom.pets.studio_pet.archived, false);
  assert.equal(restoredArchive.saved.custom.npcs.studio_npc.archived, false);
  assert.deepEqual(restoredArchive.saved.maps, saved.saved.maps);
  assert.deepEqual(restoredArchive.saved.data, saved.saved.data);
  assert.deepEqual(restoredArchive.saved.custom.pets.studio_pet.moves, saved.saved.custom.pets.studio_pet.moves);
  saved.saved = restoredArchive.saved;
  saved.revision = restoredArchive.revision;

  const reject = async (mutate, message) => {
    const draft = structuredClone(saved.saved);
    mutate(draft);
    const result = await save(draft, saved.revision);
    assert.equal(result.status, 400, `${message}: ${JSON.stringify(result.data)}`);
  };
  await reject(draft => { draft.maps.allen.npcs = []; }, 'Missing NPC placement');
  await reject(draft => { draft.custom.pets.studio_pet.record.zone = 'missing'; }, 'Missing pet placement');
  await reject(draft => { draft.custom.pets.studio_pet.moves = ['missing']; }, 'Broken linked move');
  await reject(draft => { draft.custom.pets.studio_pet.record.id = 'princess'; }, 'Stable ID mutation');
  await reject(draft => { draft.custom.pets.princess = draft.custom.pets.studio_pet; }, 'Built-in ID collision');
  await reject(draft => { delete draft.custom.npcs.studio_npc; }, 'Referenced NPC removal');
  await reject(draft => { draft.maps.allen.npcs[0].x = -1; }, 'Out of bounds placement');
  await reject(draft => { draft.custom.pets.studio_pet.record.sprite = 'missing'; }, 'Missing sprite template');
  await reject(draft => { draft.data.world['data/routines.js'].ROUTINE_OVERRIDES.studio_npc[0].place = 'missing'; }, 'Broken schedule placement');
  const removal = structuredClone(saved.saved);
  delete removal.custom.npcs.studio_npc;
  delete removal.custom.pets.studio_pet_copy;
  removal.maps.allen.npcs = [];
  await reject(draft => { delete draft.custom.npcs.studio_npc; draft.maps.allen.npcs = []; }, 'Scheduled NPC removal');
  delete removal.data.world['data/routines.js'].ROUTINE_OVERRIDES.studio_npc;
  const removed = await save(removal, saved.revision);
  assert.equal(removed.status, 200, JSON.stringify(removed.data));
  const afterRemoval = (await api('data?section=world')).data.data;
  assert.equal(afterRemoval['data/npcs.js'].NPCS.studio_npc, undefined);
  const afterPetRemoval = (await api('data?section=gameplay')).data.data;
  assert.ok(!afterPetRemoval['data/pets.js'].PETS.some(pet => pet.id === 'studio_pet_copy'));
  const replaced = await save(saved.saved, removed.data.revision);
  assert.equal(replaced.status, 400, 'Permanently removed IDs cannot be reassigned, even by importing an old snapshot.');
  assert.match(replaced.data.error, /permanently reserved/);
  saved.saved = removed.data.saved;
  saved.revision = removed.data.revision;
  await page.reload();
  await page.getByTestId('nav-story').click();
  await page.locator('#data-collection').selectOption('data/story.js|GOALS');
  await page.getByTestId('record-GOALS-1').click();
  const invalid = structuredClone(saved.saved);
  invalid.maps.allen.exits.update[0].w = -1;
  assert.equal((await save(invalid, saved.revision)).status, 400);
  const badData = structuredClone(saved.saved);
  badData.data.story['data/story.js'].GOALS[1] = 123;
  assert.equal((await save(badData, saved.revision)).status, 400);
  const badEntry = structuredClone(saved.saved);
  badEntry.maps.allen.exits.update[0].to = 'allen';
  badEntry.maps.allen.exits.update[0].entry = '__missing_entry';
  assert.equal((await save(badEntry, saved.revision)).status, 400);
  assert.equal((await save(original.saved, 'stale-revision')).status, 409);
  assert.deepEqual((await api('catalog')).data.saved, saved.saved);
  const downloaded = page.waitForEvent('download');
  await page.getByTestId('export-edits').click();
  const exported = await downloaded;
  assert.deepEqual(JSON.parse(await readFile(await exported.path(), 'utf8')), saved.saved);
  await change('[data-testid="field-GOALS-1"]', 'Unsaved draft');
  await page.getByTestId('discard-drafts').click();
  await page.locator('#data-collection').selectOption('data/story.js|GOALS');
  await page.getByTestId('field-GOALS-1').waitFor();
  assert.equal(await page.getByTestId('field-GOALS-1').inputValue(), 'Studio test goal');
  const importedResponse = page.waitForResponse(response => response.url().endsWith('/__studio_api/save') && response.request().method() === 'PUT');
  const importedData = page.waitForResponse(response => response.url().includes('/__studio_api/data?section=story'));
  await page.locator('#import-file').setInputFiles({
    name: 'studio-backup.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(original.saved)),
  });
  assert.equal((await importedResponse).status(), 200);
  const importedSaved = (await api('catalog')).data.saved;
  assert.deepEqual({ ...importedSaved, retiredIds: undefined }, { ...original.saved, retiredIds: undefined });
  assert.ok(importedSaved.retiredIds.pets.includes('studio_pet'));
  assert.ok(importedSaved.retiredIds.npcs.includes('studio_npc'));
  // Wait for the import UI to finish before starting the next action.
  await importedData;
  await page.locator('#data-collection').waitFor();
  const resetResponse = page.waitForResponse(response => response.url().endsWith('/__studio_api/save') && response.request().method() === 'PUT');
  await page.getByTestId('restore-defaults').click();
  assert.equal((await resetResponse).status(), 200);
  assert.deepEqual((await api('catalog')).data.saved, { version: 1, maps: {}, data: {}, retiredIds: importedSaved.retiredIds });
  assert.deepEqual(errors, []);
  console.log('Studio verified: archive/restore UI and runtime encounter policy, retired ID reservations, custom pet/NPC creation and duplication, linked content, placements, removal, reload, invalid saves, stale revisions, export, import, discard and defaults.');
} finally {
  // The API intentionally retains permanent ID reservations across imports.
  // Only this development check restores its exact pre-test file atomically,
  // so synthetic fixture IDs do not accumulate and repeat runs remain safe.
  const temporary = new URL('./overrides.check-studio.tmp', overridesPath);
  await writeFile(temporary, originalBytes);
  await rename(temporary, overridesPath);
  await browser.close();
  console.log('Original authoring document restored; player save slots untouched.');
}
