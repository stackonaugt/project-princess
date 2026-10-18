// MEREDITH: RECEPTION. Where the charter bus drops you. The wristband tent,
// the drop-off car park, the Driveway up to the gate, and to the west the
// streets of Tom Mankeys under its red neon X. The High Road runs east to
// Blue Gums, the Low Road south-east to the Amphitheatre and Bush Camp.
import { MapBuilder } from '../MapBuilder.js';
import { road, camp, gums } from './mfkit.js';

export function buildMfReception() {
  const b = new MapBuilder({ id: 'mfreception', w: 54, h: 36, seed: 9101 });

  // The Driveway, down from the gate to the car park, and the roads out
  road(b, 18, 0, 18, 12, 3);
  b.fill(14, 15, 18, 11, 'g');                               // the drop-off car park
  road(b, 31, 8, 51, 8, 3);                                   // The High Road, east
  road(b, 20, 12, 31, 8, 3);
  road(b, 31, 24, 51, 30, 3);                                 // The Low Road, south-east
  road(b, 31, 24, 31, 33, 3);                                 // To Bush Camp
  // Tom Mankeys' streets: Mulholland Drive and the little lanes off it
  road(b, 2, 26, 14, 26, 2); road(b, 2, 6, 14, 6, 2);
  for (const x of [3, 7, 11]) road(b, x, 6, x, 26, 1);

  b.put('mfbus', 16, 18, { interact: 'mfbus' });
  b.entry('bus', 20, 22, 'down').entry('start', 20, 22, 'down');
  b.put('mfreceptent', 22, 11);
  b.npc('mfgate', 25, 15, { face: 'down' });
  b.put('mfroadsign', 30, 14, { v: 'reception' });
  b.put('mfroadsign', 33, 12, { v: 'high' });
  b.put('mfroadsign', 35, 22, { v: 'low' });
  b.put('mfroadsign', 29, 30, { v: 'bushcamp' });
  b.sign(26, 23, ['Shuttle bus stop.', 'Buses back to the city leave from here. Not before the festival is over. Not even if you ask nicely.']);
  b.put('mfbins', 14, 27);
  b.put('mfhelperhut', 36, 3);
  b.put('mfwatertank', 40, 3);
  b.put('mfflag', 21, 9, { v: 'pink' }); b.put('mfflag', 28, 9, { v: 'yellow' });

  // Tom Mankeys: tents packed in between the lanes, the red neon X
  b.put('mfxneon', 4, 12);
  b.reserve(5, 14, 1.5);
  b.npc('mfmankey', 6, 14, { face: 'down' });
  camp(b, [1, 1, 13, 4], 0.7); camp(b, [1, 8, 2, 17], 0.7); camp(b, [4, 16, 3, 9], 0.7); camp(b, [8, 8, 3, 17], 0.7); camp(b, [12, 8, 2, 17], 0.6);
  b.put('mfportaloo', 1, 27); b.put('mfportaloo', 2, 27, { v: 'green' });
  b.sign(9, 27, ['Tom Mankeys.', 'The fanciest camp at Meredith: a neon X, fairy lights and somebody\'s grandma\'s rug.']);

  // Gums along the High Road and in the corners, long grass to the south
  gums(b, [32, 0, 22, 7], 0.12, ['blue']);
  gums(b, [34, 12, 20, 10], 0.08, ['blue', 'spotted']);
  gums(b, [0, 29, 28, 7], 0.1, ['spotted', 'red']);
  b.wildGrass(42, 17, 4, 2.5); b.wildGrass(20, 31, 4, 2); b.wildGrass(45, 33, 3, 1.5);

  b.exit(53, 8, 1, 3, 'mfbluegums', 'reception', 'Blue Gums');
  b.exit(53, 30, 1, 3, 'mfamphi', 'reception', 'The Amphitheatre');
  b.exit(31, 35, 3, 1, 'mfbush', 'reception', 'Bush Camp');
  b.exit(18, 0, 3, 1, null, null, 'the front gate', ['The front gate. The charter bus will take you home when it is all over.']);
  b.entry('bluegums', 51, 9, 'left').entry('amphi', 51, 31, 'left').entry('bush', 32, 33, 'up');
  b.forage(44, 18, ['festpie', 'feather']);
  return b.finish();
}
