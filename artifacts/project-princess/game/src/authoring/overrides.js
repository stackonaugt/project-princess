import stored from './overrides.json' with { type: 'json' };

const EMPTY = Object.freeze({ version: 1, maps: {}, data: {} });
const validRoot = stored && stored.version === 1 &&
  stored.maps && typeof stored.maps === 'object' && !Array.isArray(stored.maps) &&
  stored.data && typeof stored.data === 'object' && !Array.isArray(stored.data);

export const AUTHORING = validRoot ? stored : EMPTY;
// Unmodified snapshots for development validation. Never mutate source records.
export const BASE_VALUES = {};

function merge(base, patch) {
  if (Array.isArray(patch)) return patch;
  if (!patch || typeof patch !== 'object') return patch;
  if (!base || typeof base !== 'object' || Array.isArray(base)) return patch;
  const result = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    result[key] = key in result ? merge(result[key], value) : value;
  }
  return result;
}

export function authoredValue(moduleName, exportName, base) {
  BASE_VALUES[`${moduleName}|${exportName}`] = JSON.parse(JSON.stringify(base));
  const section = Object.values(AUTHORING.data).find(value => value?.[moduleName]);
  const patch = section?.[moduleName]?.[exportName];
  const value = patch === undefined ? base : merge(base, patch);
  const pets = AUTHORING.custom?.pets || {};
  const npcs = AUTHORING.custom?.npcs || {};
  if (exportName === 'PETS') return [...value, ...Object.values(pets).map(pet => pet.record)];
  const additions = exportName === 'NPCS' ? Object.entries(npcs).map(([id, npc]) => [id, npc.record])
    : exportName === 'PEOPLE' ? Object.entries(npcs).map(([id, npc]) => [id, npc.text])
    : exportName === 'PET_TEXT' ? Object.entries(pets).map(([id, pet]) => [id, pet.text])
    : exportName === 'PET_MOVES' ? Object.entries(pets).map(([id, pet]) => [id, pet.moves]) : [];
  return additions.length ? { ...value, ...Object.fromEntries(additions) } : value;
}
