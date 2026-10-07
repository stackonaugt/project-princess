import { clone } from './utils.js';

export const links = {
  PETS: ['pets', 'record'], NPCS: ['npcs', 'record'],
  PET_TEXT: ['pets', 'text'], PEOPLE: ['npcs', 'text'], PET_MOVES: ['pets', 'moves'],
};

export function overlayCustom(datasets, document) {
  for (const values of Object.values(datasets)) for (const [name, value] of Object.entries(values)) {
    const link = links[name];
    if (!link) continue;
    const entries = document.custom?.[link[0]] || {};
    if (name === 'PETS') {
      values[name] = value.filter(pet => !entries[pet.id])
        .concat(Object.values(entries).map(entity => clone(entity.record)));
    } else for (const [id, entity] of Object.entries(entries)) value[id] = clone(entity[link[1]]);
  }
}

// Split editor snapshots: built-in patches remain in data; custom records are
// only stored once, so removing an entity cannot leave a shadow copy behind.
export function persistCollection(context, section, file, name, value) {
  const link = links[name];
  const entries = link && context.document.custom?.[link[0]] || {};
  let builtIn = clone(value);
  if (name === 'PETS') {
    builtIn = value.filter(pet => !entries[pet.id]).map(clone);
    for (const pet of value) if (entries[pet.id]) entries[pet.id].record = clone(pet);
  } else if (link) {
    for (const [id, entity] of Object.entries(entries)) {
      if (Object.hasOwn(value, id)) entity[link[1]] = clone(value[id]);
      delete builtIn[id];
    }
  }
  context.document.data[section] ||= {};
  context.document.data[section][file] ||= {};
  context.document.data[section][file][name] = builtIn;
  context.changed();
}

export async function dataset(context, section) {
  if (!context.datasets.has(section)) {
    const result = await context.request(`data?section=${section}`);
    overlayCustom(result.data, context.document);
    context.datasets.set(section, result.data);
  }
  return context.datasets.get(section);
}

export function scheduleCharacters(context) {
  const result = context.catalog.scheduleCharacters.filter(character => !context.document.custom?.npcs?.[character.id]);
  for (const [id, entity] of Object.entries(context.document.custom?.npcs || {})) {
    const places = [...new Set(Object.values(context.document.maps).flatMap(edit =>
      (edit.npcs || []).filter(npc => npc.id === id).map(npc => npc.at)))];
    if (places.length) result.push({ id, name: entity.record.name, places });
  }
  return result;
}

export function removalReferences(context, kind, id) {
  const references = [];
  if (kind === 'npcs') {
    for (const [area, edits] of Object.entries(context.document.maps)) {
      if (edits.npcs?.some(npc => npc.id === id)) references.push(`placement in ${area}`);
    }
    const schedules = context.document.data.world?.['data/routines.js']?.ROUTINE_OVERRIDES;
    if (schedules?.[id]?.length) references.push('schedule rules');
  }
  // Other authored snapshots may explicitly reference this stable ID.
  function scan(value, path) {
    if (value === id) references.push(path);
    else if (Array.isArray(value)) value.forEach((item, index) => scan(item, `${path}[${index}]`));
    else if (value && typeof value === 'object') {
      for (const [key, item] of Object.entries(value)) {
        if (key === id) references.push(`${path}.${key}`);
        scan(item, `${path}.${key}`);
      }
    }
  }
  scan(context.document.data, 'saved content');
  for (const [group, entries] of Object.entries(context.document.custom || {})) {
    for (const [key, entity] of Object.entries(entries)) {
      if (group !== kind || key !== id) scan(entity, `${group}.${key}`);
    }
  }
  return [...new Set(references)];
}
