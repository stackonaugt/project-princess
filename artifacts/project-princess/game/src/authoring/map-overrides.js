import { AUTHORING } from './overrides.js';
import { isArchived } from './archive.js';
import { OBJECTS } from '../art/paint/objects.js';

export function mapWithEdits(map, edit) {
  if (!edit) return map;
  const result = {
    ...map,
    ground: map.ground.map(row => row.split('')),
    objects: map.objects.map(object => ({ ...object })),
    exits: map.exits.map(exit => ({ ...exit })),
    npcs: [...(map.npcs || []), ...(edit.npcs || []).map(npc => ({ ...npc }))],
  };
  for (const tile of edit.tiles || []) {
    if (result.ground[tile.y]?.[tile.x] !== undefined) result.ground[tile.y][tile.x] = tile.tile;
  }
  const objectEdits = edit.objects || {};
  for (const move of objectEdits.move || []) {
    if (result.objects[move.index]) Object.assign(result.objects[move.index], { x: move.x, y: move.y });
  }
  result.objects = result.objects.filter((_, index) => !(objectEdits.remove || []).includes(index));
  result.objects.push(...(objectEdits.add || []).map(object => {
    const [w, h] = OBJECTS[object.kind]?.foot || [1, 1];
    return { ...object, w, h, v: object.v || '' };
  }));
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
