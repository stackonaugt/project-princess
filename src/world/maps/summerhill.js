// SUMMERHILL SHOPPING CENTRE, Reservoir: across Plenty Rd from Loddon Ave.
// From the owner's photo: two wings of shops under brown zigzag roofs, the
// taller supermarket block with its red sign, a zebra crossing out the front,
// a big car park with trolley bays and planted islands, the pylon sign on the
// Plenty Rd footpath, and Summerhill Rd along the bottom. Trev collects trolleys (and battles you); Darren has lost
// his car. Walk through the sliding doors to go inside (summerhillmall.js).
//
//   x0 Plenty Rd footpath (back to Loddon Ave)   y4-8 the centre   y9 walkway
//   y10-11 drive aisle with a zebra crossing   y12-20 car park (mulch island at y15)
//   y22-25 Summerhill Rd
import { MapBuilder } from '../MapBuilder.js';

export function buildSummerhill() {
  const b = new MapBuilder({ id: 'summerhill', w: 44, h: 28, seed: 161 });

  // Plenty Rd footpath down the west edge, a grassy verge
  b.vline(0, 0, 27, 'f');
  b.put('pylonsign', 1, 9);
  b.sign(2, 3, ['Summerhill Shopping Centre.', 'Supermarket, chemist, newsagency, hot bread, a $2 shop and a food court. Open seven days.']);

  // The centre and its walkway
  b.put('summerhillcentre', 12, 4);
  b.fill(3, 9, 37, 1, 'c');
  b.fill(1, 10, 41, 2, '#').fill(24, 10, 2, 2, 'z');
  b.put('pedsign', 23, 9); b.put('pedsign', 26, 9);
  b.exit(24, 9, 2, 1, 'summerhillmall', 'door', 'Summerhill Shopping Centre');
  b.put('bench', 6, 9); b.put('bench', 32, 9);
  b.put('bin', 20, 9, { v: 'red' }); b.put('bin', 29, 9, { v: 'yellow' });
  b.put('trolley', 9, 9); b.put('trolley', 38, 9);
  b.put('tall', 10, 7, { v: 'bottlebrush' }); b.put('tall', 39, 7, { v: 'bottlebrush' });

  // The car park, with a planted island down the middle
  b.fill(3, 12, 36, 9, 'P');
  b.fill(3, 15, 36, 1, 'm');
  for (const x of [11, 12, 24, 25, 33, 34]) b.set(x, 15, 'P');
  [5, 9, 19, 22, 28, 31, 37].forEach(x => b.put('sapling', x, 15));
  b.put('trolleybay', 15, 15); b.put('trolleybay', 26, 15);
  b.put('lamp', 14, 15); b.put('lamp', 36, 15);
  [[4, 12, 'silver'], [8, 12, 'white'], [15, 12, 'red'], [27, 12, 'blue'], [33, 12, 'silver'],
   [6, 18, 'white'], [13, 18, 'yellow'], [22, 18, 'silver'], [29, 18, 'red'], [35, 18, 'white']].forEach(([x, y, v]) => b.put('car', x, y, { v }));
  b.put('trolley', 20, 13); b.put('trolley', 31, 19); b.put('trolley', 11, 19);
  b.put('carparksign', 3, 12);
  b.sign(39, 12, ['Three hour parking.', 'Trolleys must not leave the car park. One left anyway. It was last seen at Edwardes Lake.']);

  // Weedy verges, good for wild encounters
  b.wildGrass(41, 15, 1.6, 3.5);
  b.wildGrass(2, 18, 1.2, 2.5);
  b.scatter([39, 11, 4, 10], 0.08, [['bush', 2, ['green']], ['tree', 1, ['gum']]]);

  // Summerhill Rd, the driveway into the car park and a bus stop
  b.fill(18, 21, 4, 1, 'P');
  b.hline(1, 43, 22, 'f').fill(1, 23, 43, 2, '#').hline(1, 43, 25, 'f');
  b.fill(0, 23, 1, 2, '#');
  b.put('busshelter', 30, 21);
  b.put('powerpole', 8, 21); b.put('powerpole', 38, 21);
  b.put('lamp', 16, 22); b.put('lamp', 26, 22);
  b.sign(42, 21, ['Summerhill Rd.', 'East to Reservoir East and Bundoora. Not today. The car park has everything you need.']);
  b.wildGrass(12, 26.5, 3, 0.8); b.wildGrass(34, 26.5, 3, 0.8);

  b.exit(0, 0, 1, 28, 'loddon', 'summerhill', 'Loddon Ave');
  b.exit(43, 22, 1, 4, null, null, 'Summerhill Rd', ['Summerhill Rd heads east, towards Reservoir East. Not today.']);
  b.entry('west', 1, 12, 'right').entry('door', 24, 10, 'down');

  b.lane({ axis: 'x', pos: 23.5, dir: -1, from: -3, to: 47, every: [7, 14], speed: 56, kinds: ['veh-car-h-white', 'veh-car-h-red', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 24.5, dir: 1, from: -3, to: 47, every: [8, 15], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });

  b.npc('trev', 18, 14, { path: [[18, 14], [35, 14], [35, 16], [18, 16]], speed: 30 });
  b.npc('darren', 9, 17, { path: [[9, 17], [21, 17], [21, 13], [9, 13]] });

  b.forage(41, 12, ['chicken', 'tennis']);
  b.forage(5, 26, ['snag', 'feather']);
  b.magpies([[40, 19], [20, 26]]);
  b.border(['gum', 'oak']);
  b.scatter([0, 0, b.w, b.h], 0.01, [['potplant', 2, ['succulent', 'fern']], ['bike', 1, ['blue', 'red']]], { clearance: 0, on: 'c' });
  return b.finish();
}
