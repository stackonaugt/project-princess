// LAVERTON STATION: over Maher Rd from the reserve. A plaza with the green
// "Reunion" balloon sculpture, the big footbridge with its LAVERTON tower
// and glass lift box, an island platform with the red-roofed station
// building, and a long side platform beyond. Catch the train (myki) to any
// suburb you've visited, or head east along Railway Ave to Brunswick.
//
//   y0-2   Maher Rd and footpath
//   y3-7   car parks and the plaza (footbridge stairs go up here)
//   y8     fence and gravel        y9   track
//   y10-12 island platform         y13-14 two tracks
//   y15-17 side platform           y18-26 car park 5, Railway Ave
import { MapBuilder } from '../MapBuilder.js';

export function buildStation() {
  const b = new MapBuilder({ id: 'station', w: 44, h: 30, seed: 91 });

  // Maher Rd with the crossing from the reserve
  b.fill(0, 0, 44, 2, '#').fill(18, 0, 2, 2, 'z').hline(0, 43, 2, 'f');

  // Car parks either side of the plaza
  b.fill(0, 3, 14, 5, 'P').fill(30, 3, 14, 5, 'P').fill(14, 3, 16, 5, 'c');
  [[2, 4, 'white'], [8, 4, 'blue'], [5, 6, 'red'], [32, 4, 'silver'], [36, 6, 'yellow'], [40, 4, 'white'], [11, 6, 'silver']].forEach(([x, y, v]) => b.put('car', x, y, { v }));
  b.put('tall', 0, 6, { v: 'biggum' }); b.put('tall', 13, 7, { v: 'biggum' }); b.put('tall', 43, 6, { v: 'biggum' }); b.put('tall', 30, 7, { v: 'biggum' });
  b.put('carparksign', 14, 3);

  // The plaza
  b.put('reunion', 16, 4);
  b.sign(18, 5, ['"Reunion" by Grant Finck.', 'Four giant green balloons, twisted into something. A dog? A clover? A cry for help? Locals have opinions.']);
  b.put('ptsign', 22, 3);
  b.put('buszone', 13, 2);
  b.put('sizzle', 19, 3);
  b.put('bench', 14, 6); b.put('bench', 19, 7);
  b.put('bikerack', 28, 6);
  [15, 17, 21, 23].forEach(x => b.put('bollard', x, 2));
  b.put('parkbin', 22, 6);

  // Footbridge: stairs rise from the plaza and cross every track
  b.put('footbridge', 24, 5);
  b.put('lavtower', 27, 4);
  b.put('bluepillar', 23, 7);
  b.fill(0, 8, 44, 1, 'g');
  b.fenceH(0, 43, 8, 'park', [24, 25, 26]);

  // Tracks and platforms
  b.hline(0, 43, 9, 'r');
  b.fill(0, 10, 44, 3, 'p');
  b.hline(0, 43, 13, 'r').hline(0, 43, 14, 'r');
  b.fill(0, 15, 44, 3, 'p');
  [9, 13, 14].forEach(y => b.fill(24, y, 3, 1, 'B'));

  // Island platform: the station building, white fences, myki readers
  b.put('islandbuilding', 10, 10);
  b.fenceH(2, 8, 10, 'picket').fenceH(17, 22, 10, 'picket').fenceH(28, 40, 10, 'picket');
  b.put('myki', 20, 11, { travel: true });
  b.put('bluepillar', 23, 11); b.put('bluepillar', 27, 11);
  b.put('stanchion', 6, 12); b.put('stanchion', 34, 12);
  b.put('bench', 30, 11);
  b.sign(17, 11, ['Laverton Station. Werribee line.', 'Tap your myki at the reader to catch a train to anywhere you have already been.']);

  // Side platform: long shelters with beige panel walls
  b.put('canopy', 2, 15); b.put('canopy', 10, 15); b.put('canopy', 30, 15);
  b.fenceH(0, 43, 17, 'panel', [36, 37]);
  b.put('bench', 5, 16); b.put('bench', 33, 16); b.put('lamp', 20, 16); b.put('lamp', 41, 15);
  b.put('stanchion', 22, 15);

  // South side: car park 5 and Railway Ave east to Brunswick
  b.fill(0, 18, 44, 1, 'f');
  b.fill(0, 19, 44, 4, 'P');
  [[3, 20, 'red'], [14, 19, 'silver'], [22, 21, 'white'], [37, 20, 'blue'], [29, 19, 'yellow']].forEach(([x, y, v]) => b.put('car', x, y, { v }));
  b.put('tall', 8, 21, { v: 'biggum' }); b.put('tall', 33, 22, { v: 'biggum' });
  b.hline(0, 43, 23, 'f');
  b.fill(0, 24, 44, 2, '#').hline(0, 43, 26, 'f');
  b.sign(40, 27, ['Railway Ave.', 'East: Brunswick. A long walk, or a short train ride.']);
  b.put('powerpole', 10, 27); b.put('powerpole', 30, 27);

  b.exit(18, 0, 2, 1, 'lohse', 'south', 'Lohse St Reserve');
  b.exit(43, 24, 1, 2, 'brunswick', 'west', 'Brunswick');
  b.entry('north', 18, 3, 'down').entry('station', 21, 12, 'down').entry('east', 42, 25, 'left');

  b.npc('commuter', 31, 12, { face: 'down' });
  b.npc('gaz', 20, 4, { face: 'down' });
  b.npc('marisol', 22, 16, { face: 'up' });

  const train = { axis: 'x', from: -12, to: 56, speed: 120, kinds: ['veh-train-h'], train: true, under: true };
  b.lane({ ...train, pos: 9.5, dir: 1, every: [30, 55] });
  b.lane({ ...train, pos: 13.5, dir: -1, every: [35, 60] });
  b.lane({ ...train, pos: 14.5, dir: 1, every: [45, 80] });
  b.lane({ axis: 'x', pos: 0.5, dir: -1, from: -3, to: 47, every: [9, 18], speed: 56, kinds: ['veh-car-h-red', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 1.5, dir: 1, from: -3, to: 47, every: [10, 20], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });
  b.lane({ axis: 'x', pos: 24.5, dir: -1, from: -3, to: 47, every: [10, 20], speed: 60, kinds: ['veh-car-h-white', 'veh-ute-h'] });

  b.forage(41, 28, ['chicken', 'feather']);
  b.forage(1, 12, ['sardine', 'ribbon']);
  b.magpies([[12, 28], [33, 28]]);
  b.border(['gum', 'oak']);
  b.scatter([1, 27, 42, 2], 0.2, [['bush', 2, ['green']], ['tree', 1, ['gum']]]);
  return b.finish();
}
