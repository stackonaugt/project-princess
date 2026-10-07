// Custom content is ordinary JSON in the authoring document, never source code.
const own = (object, key) => Object.hasOwn(object || {}, key);
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const fail = message => { throw new Error(message); };
const ids = values => new Set(Object.keys(values || {}));
const point = (value, map) => Array.isArray(value) && value.length === 2 &&
  value.every(Number.isInteger) && value[0] >= 0 && value[1] >= 0 &&
  value[0] < map.w && value[1] < map.h;

// Tombstones are merged by the server, including on import/reset. A client
// cannot drop them and give old player progress to an unrelated new entity.
export function reserveRemovedIds(document, previous) {
  if (document.retiredIds !== undefined && (!object(document.retiredIds) ||
      Object.keys(document.retiredIds).some(key => !['pets', 'npcs'].includes(key)))) fail('Invalid retired IDs.');
  const retired = {};
  for (const kind of ['pets', 'npcs']) {
    const supplied = own(document.retiredIds, kind) ? document.retiredIds[kind] : [];
    if (!Array.isArray(supplied) || supplied.some(id => typeof id !== 'string' ||
        !/^[a-z][a-z0-9_]{1,47}$/.test(id))) fail('Retired IDs must be stable ID lists.');
    const reserved = new Set([...(previous?.retiredIds?.[kind] || []), ...supplied]);
    for (const id of Object.keys(previous?.custom?.[kind] || {})) {
      if (!own(document.custom?.[kind], id)) reserved.add(id);
    }
    for (const id of Object.keys(document.custom?.[kind] || {})) {
      if (reserved.has(id)) fail(`${id} is permanently reserved after removal. Use a new ID; archive instead of removing to allow restoration.`);
    }
    retired[kind] = [...reserved].sort();
  }
  return retired.pets.length || retired.npcs.length ? retired : undefined;
}

export function validateEntities(document, base, regions, mapWithEdits, sameTypes, editorValue, sprites, previous) {
  const custom = document.custom || { pets: {}, npcs: {} };
  if (!object(custom) || Object.keys(custom).some(key => !['pets', 'npcs'].includes(key)) ||
      !object(custom.pets) || !object(custom.npcs)) fail('Custom content needs pets and characters dictionaries.');
  const sourcePets = base['data/pets.js|PETS'];
  const sourceNpcs = base['data/npcs.js|NPCS'];
  const sourcePetIds = new Set(sourcePets.map(pet => pet.id));
  const allPetIds = new Set([...sourcePetIds, ...ids(custom.pets)]);
  const allNpcIds = new Set([...ids(sourceNpcs), ...ids(custom.npcs)]);
  const effective = (file, name) => {
    const patch = Object.values(document.data).find(section => section[file])?.[file]?.[name];
    const original = base[`${file}|${name}`];
    return Array.isArray(original) ? patch ?? original : { ...original, ...patch };
  };
  const moves = effective('data/moves.js', 'MOVES');
  const items = effective('data/items.js', 'ITEMS');
  const shops = effective('data/shops.js', 'SHOPS');
  const maps = Object.fromEntries(Object.entries(regions.ZONES).map(([id, zone]) =>
    [id, mapWithEdits(zone.build(), document.maps[id])]));
  const types = new Set(sourcePets.flatMap(pet => [pet.type, pet.evolution?.type].flat()).filter(Boolean));
  const required = (record, fields, label) => {
    if (!object(record) || fields.some(key => !own(record, key))) fail(`${label} is missing required fields.`);
  };
  function shape(record, templates, label) {
    const fields = new Set(templates.flatMap(template => Object.keys(template)));
    for (const [key, value] of Object.entries(record)) {
      if (!fields.has(key)) fail(`${label}: unsupported field "${key}".`);
      const samples = templates.filter(template => own(template, key));
      if (!samples.some(template => {
        try { sameTypes(template[key], value, `${label}.${key}`, true); return true; } catch { return false; }
      })) fail(`${label}.${key} has an unsupported shape.`);
    }
  }
  function stableId(id, builtIn, label) {
    if (!/^[a-z][a-z0-9_]{1,47}$/.test(id) || builtIn.has(id) ||
        ['constructor', 'prototype', '__proto__'].includes(id)) fail(`${label}: use a unique lowercase stable ID (2–48 letters, numbers or underscores).`);
  }
  function moveList(list, label) {
    if (!Array.isArray(list) || !list.length || list.some(id => typeof id !== 'string' || !own(moves, id))) {
      fail(`${label} references a missing battle move or has no moves.`);
    }
  }
  for (const [id, entity] of Object.entries(custom.pets)) {
    stableId(id, sourcePetIds, id);
    required(entity, ['record', 'text', 'moves'], id);
    if (Object.keys(entity).some(key => !['record', 'text', 'moves', 'art', 'archived'].includes(key))) fail(`Unsupported custom pet data for ${id}.`);
    if (own(entity, 'archived') && typeof entity.archived !== 'boolean') fail(`${id}: archived must be a boolean.`);
    const pet = entity.record;
    required(pet, ['id', 'name', 'species', 'type', 'sprite', 'pal', 'region', 'zone', 'home', 'range', 'homeSpot', 'behaviour', 'stats', 'loves', 'likes', 'dislikes'], id);
    if (pet.id !== id || typeof pet.name !== 'string' || !pet.name.trim()) fail(`${id} must keep its stable ID and have a name.`);
    shape(pet, sourcePets.map(pet => editorValue('PETS', [pet])[0]), id);
    if (!maps[pet.zone] || !point(pet.home, maps[pet.zone]) ||
        !maps[pet.homeSpot.zone] || !point([pet.homeSpot.x, pet.homeSpot.y], maps[pet.homeSpot.zone]) ||
        !['home', 'yard'].includes(pet.homeSpot.zone)) fail(`${id} has a missing or invalid pet placement.`);
    if (!Object.hasOwn(regions.SUBURBS, pet.region)) fail(`${id} has an unknown suburb.`);
    if (!Number.isFinite(pet.range) || pet.range < 0 ||
        Object.values(pet.stats).some(value => !Number.isFinite(value) || value <= 0)) fail(`${id} needs positive stats and a nonnegative range.`);
    if ([pet.type, pet.evolution?.type].flat().filter(Boolean).some(type => !types.has(type))) fail(`${id} has an unknown battle type.`);
    for (const key of ['loves', 'likes', 'dislikes']) {
      if (pet[key].some(item => !own(items, item))) fail(`${id}.${key} references a missing item.`);
    }
    if (!object(entity.text) || !object(entity.text.lines) || !entity.text.lines[0]?.length) fail(`${id} needs linked pet dialogue.`);
    shape(entity.text, Object.values(base['data/dialogue.js|PET_TEXT']), `${id} dialogue`);
    moveList(entity.moves, id);
    if (pet.evolution) moveList(pet.evolution.moves, `${id} evolution`);
    if (!own(sprites, pet.sprite) || (pet.evolution && !own(sprites, pet.evolution.sprite))) fail(`${id} needs an existing sprite template.`);
    if (pet.patrol?.some(position => !point(position, maps[pet.zone]))) fail(`${id} has a patrol outside its map.`);
  }
  for (const [id, entity] of Object.entries(custom.npcs)) {
    stableId(id, ids(sourceNpcs), id);
    required(entity, ['record', 'text'], id);
    if (Object.keys(entity).some(key => !['record', 'text', 'art', 'archived'].includes(key))) fail(`Unsupported custom character data for ${id}.`);
    if (own(entity, 'archived') && typeof entity.archived !== 'boolean') fail(`${id}: archived must be a boolean.`);
    required(entity.record, ['name', 'look'], id);
    shape(entity.record, Object.values(editorValue('NPCS', sourceNpcs)), id);
    if (typeof entity.record.name !== 'string' || !entity.record.name.trim()) fail(`${id} needs a name.`);
    if (entity.record.gift && !own(items, entity.record.gift)) fail(`${id} references a missing gift item.`);
    if (entity.record.shop && !own(shops, entity.record.shop)) fail(`${id} references a missing shop.`);
    if (!object(entity.text) || !Array.isArray(entity.text.lines) || !entity.text.lines.length) fail(`${id} needs linked character dialogue.`);
    shape(entity.text, Object.values(base['data/dialogue.js|PEOPLE']), `${id} dialogue`);
    for (const petId of Object.keys(entity.text.hints || {})) {
      if (!allPetIds.has(petId)) fail(`${id} dialogue references missing pet "${petId}".`);
    }
    if (!Object.values(maps).some(map => map.npcs.some(npc => npc.id === id))) fail(`${id} needs at least one map placement.`);
  }
  for (const [mapId, map] of Object.entries(maps)) {
    for (const npc of document.maps[mapId]?.npcs || []) {
      if (!own(custom.npcs, npc.id) || !point([npc.x, npc.y], map) ||
          typeof npc.at !== 'string' || !npc.at.trim() ||
          Object.keys(npc).some(key => !['id', 'x', 'y', 'at'].includes(key))) fail(`Invalid character placement on ${mapId}: ${npc.id}.`);
      if (map.solid[npc.y * map.w + npc.x]) fail(`${npc.id} is placed on a blocked tile in ${mapId}.`);
    }
    const seen = new Set();
    for (const npc of document.maps[mapId]?.npcs || []) {
      const key = `${npc.id}|${npc.at}`;
      if (seen.has(key)) fail(`Duplicate ${npc.id} placement "${npc.at}" in ${mapId}.`);
      seen.add(key);
    }
  }
  for (const [name, allowed] of [['PEOPLE', allNpcIds], ['PET_TEXT', allPetIds], ['PET_MOVES', allPetIds]]) {
    const file = name === 'PET_MOVES' ? 'data/moves.js' : 'data/dialogue.js';
    for (const id of Object.keys(effective(file, name))) {
      // Built-in dialogue can include intentionally scripted-only characters.
      if (!allowed.has(id) && !own(base[`${file}|${name}`], id)) fail(`${name} references missing entity "${id}". Remove the reference first.`);
    }
  }
  for (const [id, list] of Object.entries(effective('data/moves.js', 'PET_MOVES'))) moveList(list, id);
  // Validate references edited on built-ins too, without outlawing original
  // scripted exceptions such as Emilio's fishing-only "secret" location.
  const authoredPets = effective('data/pets.js', 'PETS');
  for (const pet of authoredPets) {
    const original = sourcePets.find(source => source.id === pet.id);
    if (!original) fail(`Unknown pet "${pet.id}" in built-in overrides.`);
    if ((pet.zone !== original.zone || JSON.stringify(pet.home) !== JSON.stringify(original.home)) &&
        (!maps[pet.zone] || !point(pet.home, maps[pet.zone]))) fail(`${pet.id} has a missing or invalid pet placement.`);
    if (!own(sprites, pet.sprite)) fail(`${pet.id} references a missing sprite template.`);
    for (const key of ['loves', 'likes', 'dislikes']) {
      if (pet[key]?.some(item => !own(items, item))) fail(`${pet.id} references a missing item.`);
    }
    if (pet.evolution) moveList(pet.evolution.moves, `${pet.id} evolution`);
  }
  for (const [id, npc] of Object.entries(effective('data/npcs.js', 'NPCS'))) {
    if (!allNpcIds.has(id)) fail(`Character information references missing entity "${id}".`);
    if (npc.gift !== sourceNpcs[id]?.gift && npc.gift && !own(items, npc.gift)) fail(`${id} references a missing gift item.`);
    if (npc.shop !== sourceNpcs[id]?.shop && npc.shop && !own(shops, npc.shop)) fail(`${id} references a missing shop.`);
  }
  // Removal never silently deletes references outside the entity's own bundle.
  const removed = new Set(['pets', 'npcs'].flatMap(kind => Object.keys(previous?.custom?.[kind] || {})
    .filter(id => !own(custom[kind], id))));
  function references(value, path) {
    if (typeof value === 'string' && removed.has(value)) fail(`Remove reference to "${value}" in ${path} first.`);
    if (Array.isArray(value)) value.forEach((entry, index) => references(entry, `${path}[${index}]`));
    else if (object(value)) for (const [key, entry] of Object.entries(value)) {
      if (removed.has(key)) fail(`Remove reference to "${key}" in ${path} first.`);
      references(entry, `${path}.${key}`);
    }
  }
  references(document.data, 'content');
  references(custom, 'custom entities');
  return { maps, npcs: Object.fromEntries([...allNpcIds].map(id => [id, true])) };
}
