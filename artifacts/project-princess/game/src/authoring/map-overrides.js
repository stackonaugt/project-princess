import { AUTHORING } from './overrides.js';
import { isArchived } from './archive.js';
import { OBJECTS } from '../art/paint/objects.js';
import { terrainWithCurveEdits } from '../art/paint/terrain-features.js';

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stableValue(value[key])]));
  }
  return value;
}

function sourceObjectKey(object) {
  const identity = structuredClone(object);
  // Fence variants are calculated from their neighbours in MapBuilder.finish;
  // style and placement are the stable source properties.
  if (identity.kind === 'fence') delete identity.v;
  return JSON.stringify(stableValue(identity));
}

export function sourceObjectIdentity(object) {
  const identity = structuredClone(object);
  if (identity.kind === 'fence') delete identity.v;
  return identity;
}

export function sourceObjectMatches(objects, identity) {
  if (!identity || typeof identity !== 'object' || Array.isArray(identity)) return [];
  const key = sourceObjectKey(identity);
  return objects.flatMap((object, index) => sourceObjectKey(object) === key ? [index] : []);
}

export function resolveSourceObjectIndex(objects, identity) {
  const matches = sourceObjectMatches(objects, identity);
  return matches.length === 1 ? matches[0] : -1;
}

function editedObjectIndex(objects, edit) {
  if (edit && typeof edit === 'object' && Object.hasOwn(edit, 'source')) {
    return resolveSourceObjectIndex(objects, edit.source);
  }
  return typeof edit === 'number' ? edit : edit?.index;
}

export function mapWithEdits(map, edit) {
  if (!edit && !map.clearArea && !map.objectLayout) return map;
  edit ||= {};
  map = terrainWithCurveEdits(map, edit.terrainFeatures, edit.tiles);
  const result = {
    ...map,
    ground: map.ground.map(row => row.split('')),
    objects: map.objects.map((object, index) => ({ ...object, ...map.objectLayout?.[index] })),
    exits: map.exits.map(exit => ({ ...exit })),
    ...(map.tileRotations ? { tileRotations: map.tileRotations.map(row => [...row]) } : {}),
    npcs: [...(map.npcs || []), ...(edit.npcs || []).map(npc => ({ ...npc }))],
  };
  for (const tile of edit.tiles || []) {
    if (result.ground[tile.y]?.[tile.x] !== undefined) {
      result.ground[tile.y][tile.x] = tile.tile;
      if (tile.rotation !== undefined) {
        result.tileRotations ||= Array.from({ length: result.h }, () => Array(result.w).fill(0));
        result.tileRotations[tile.y][tile.x] = tile.rotation;
      }
    }
  }
  const objectEdits = edit.objects || {};
  for (const move of objectEdits.move || []) {
    const index = editedObjectIndex(map.objects, move);
    if (Number.isInteger(index) && result.objects[index]) {
      const { index: _index, source: _source, ...values } = move;
      Object.assign(result.objects[index], values);
    }
  }
  const removedObjects = new Set((objectEdits.remove || [])
    .map(reference => editedObjectIndex(map.objects, reference))
    .filter(Number.isInteger));
  result.objects = result.objects.filter((_, index) => !removedObjects.has(index));
  result.objects.push(...(objectEdits.add || []).map(object => {
    const [w, h] = OBJECTS[object.kind]?.foot || [1, 1];
    return { ...object, w, h, v: object.v || '', rotation: object.rotation || 0 };
  }));
  if (map.clearArea) {
    const { x, y, w, h } = map.clearArea;
    result.objects = result.objects.filter(object =>
      !(object.x < x + w && object.x + object.w > x &&
        object.y < y + h && object.y + object.h > y));
  }
  const exitEdits = edit.exits || {};
  for (const update of exitEdits.update || []) {
    const { index, ...values } = update;
    if (result.exits[index]) Object.assign(result.exits[index], values);
  }
  result.exits = result.exits.filter((_, index) => !(exitEdits.remove || []).includes(index));
  result.exits.push(...(exitEdits.add || []));
  result.ground = result.ground.map(row => row.join(''));
  result.solid = new Uint8Array(result.w * result.h);
  for (let y = 0; y < result.h; y++) for (let x = 0; x < result.w; x++) {
    if ('~rWVRY'.includes(result.ground[y][x])) result.solid[y * result.w + x] = 1;
  }
  for (const object of result.objects) {
    const def = OBJECTS[object.kind];
    if (!def || def.solid === false || def.flat || def.roof || def.deck || def.above || object.onWall) continue;
    for (let y = object.y; y < object.y + object.h; y++) for (let x = object.x; x < object.x + object.w; x++) {
      if (x >= 0 && y >= 0 && x < result.w && y < result.h) result.solid[y * result.w + x] = 1;
    }
  }
  return result;
}

export const authoredMap = map => {
  const result = mapWithEdits(map, AUTHORING.maps[map.id]);
  return { ...result, npcs: result.npcs.filter(npc => !isArchived('npcs', npc.id)) };
};
