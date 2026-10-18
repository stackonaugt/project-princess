// MEREDITH: SOUTH PINES AND OUTER SPACE. Out east: rows of old pines along
// Lone Pine Road, then Highway to Hell Rd running north up to Sanctuary Cove,
// and the open paddock of Outer Space with hay bales and long grass.
import { MapBuilder } from '../MapBuilder.js';
import { road, camp, gums } from './mfkit.js';

export function buildMfPines() {
  const b = new MapBuilder({ id: 'mfpines', w: 56, h: 38, seed: 9107 });

  road(b, 0, 17, 22, 17, 3);                      // Highway to Hell from Top Camp
  road(b, 22, 17, 40, 2, 3);                      // Highway to Hell Rd, north to Sanctuary Cove
  road(b, 0, 29, 12, 29, 3);                      // from the Sunset Strip
  for (let a = 0; a < Math.PI * 2; a += 0.04) b.fill(Math.round(16 + Math.cos(a) * 11), Math.round(28 + Math.sin(a) * 6), 2, 2, '=');   // Lone Pine Road
  b.put('mfroadsign', 23, 21, { v: 'hell' });
  b.put('mfroadsign', 4, 20, { v: 'pines' });
  b.sign(41, 4, ['Sanctuary Cove.', 'Where Highway to Hell Rd ends. Nobody knows why it is called that. Nobody has asked.']);

  // South Pines: rows of pines and tents
  for (let x = 2; x < 34; x += 3) for (const y of [21, 36]) b.put('tree', x, y, { v: 'pine' });
  camp(b, [9, 24, 15, 9], 0.75); camp(b, [1, 1, 20, 14], 0.6);

  // Outer Space: the open paddock, hay bales and long grass
  b.fill(32, 8, 23, 22, '"');
  for (const [x, y] of [[34, 10], [38, 12], [44, 10], [48, 14], [36, 18], [42, 20], [50, 22], [46, 26]]) b.put('mfhaybale', x, y, { v: (x + y) % 2 ? 'round' : 'square' });
  b.fill(38, 13, 6, 4, '.');
  b.npc('mfhaybale', 40, 15, { face: 'down' });
  b.sign(33, 30, ['Outer Space.', 'A new campground on the edge of the festival. Lots of space. Hence the name.']);
  b.fenceV(55, 0, 37, 'park');
  gums(b, [24, 30, 30, 8], 0.12, ['red']);

  b.exit(0, 17, 1, 3, 'mftop', 'pines', 'Top Camp');
  b.exit(0, 29, 1, 3, 'mfsunset', 'pines', 'Sunset Strip');
  b.exit(40, 0, 3, 1, null, null, 'Eltham', ['The far end of the festival. The festival boundary fence runs along here. Turn back.']);
  b.entry('top', 2, 18, 'right').entry('sunset', 2, 30, 'right');
  b.forage(52, 33, ['icypole', 'feather']);
  return b.finish();
}
