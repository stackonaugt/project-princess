// LAVERTON STATION: over Maher Rd from the reserve. Car parks, the green
// "Reunion" sculpture, orange platform canopies and the footbridge.
// Catch the train (myki reader) to any suburb you've visited, or head east
// along the road to Brunswick.
import { MapBuilder } from '../MapBuilder.js';

export function buildStation() {
  const b = new MapBuilder({ id: 'station', w: 44, h: 28, seed: 91 });

  // Maher Rd with the crossing from the reserve
  b.fill(0, 0, 44, 2, '#').fill(18, 0, 2, 2, 'z').hline(0, 43, 2, 'f');

  // Car parks either side of the plaza
  b.fill(0, 3, 16, 6, 'P').fill(29, 3, 15, 6, 'P').fill(16, 3, 13, 7, 'c');
  [[2, 4, 'white'], [8, 4, 'blue'], [12, 6, 'red'], [31, 4, 'silver'], [35, 6, 'yellow'], [40, 4, 'white']].forEach(([x, y, v]) => b.put('car', x, y, { v }));
  b.put('carparksign', 15, 3); b.put('carparksign', 29, 9);
  b.fill(0, 9, 16, 1, 'c').fill(29, 9, 15, 1, 'c');

  // Plaza
  b.put('reunion', 21, 5);
  b.sign(24, 5, ['"Reunion" by Grant Finck.', 'A big green sculpture. Locals call it many things. Most of them are affectionate.']);
  b.put('stationhouse', 16, 7);
  b.put('sizzle', 26, 4);
  b.put('bench', 22, 8); b.put('parkbin', 25, 8);
  b.put('tall', 1, 7, { v: 'biggum' }); b.put('tall', 6, 8, { v: 'biggum' });

  // Platform, tracks and the far platform
  b.fill(0, 10, 44, 2, 'p');
  b.hline(0, 43, 12, 'r').hline(0, 43, 13, 'r');
  b.fill(0, 14, 44, 2, 'p');
  b.put('canopy', 6, 10); b.put('canopy', 20, 10);
  b.put('canopy', 10, 14);
  b.put('myki', 19, 10, { travel: true });
  b.put('bench', 24, 11); b.put('bench', 12, 15);
  b.put('lamp', 4, 11); b.put('lamp', 36, 11); b.put('lamp', 4, 15);
  b.sign(17, 11, ['Laverton Station. Werribee line.', 'Tap your myki at the reader to catch a train to anywhere you have already been.']);

  // Footbridge over the tracks
  b.fill(30, 12, 3, 2, 'B');
  b.put('footbridge', 30, 9);

  // South side: car park 5 and the road east to Brunswick
  b.fill(0, 16, 44, 1, 'f');
  b.fill(0, 17, 44, 4, 'P');
  [[3, 18, 'red'], [14, 17, 'silver'], [22, 19, 'white'], [37, 18, 'blue']].forEach(([x, y, v]) => b.put('car', x, y, { v }));
  b.hline(0, 43, 21, 'f');
  b.fill(0, 22, 44, 2, '#').hline(0, 43, 24, 'f');
  b.sign(40, 25, ['Railway Ave.', 'East: Brunswick. A long walk, or a short train ride.']);
  b.put('powerpole', 10, 25); b.put('powerpole', 30, 25);

  b.exit(18, 0, 2, 1, 'lohse', 'south', 'Lohse St Reserve');
  b.exit(43, 22, 1, 2, 'brunswick', 'west', 'Brunswick');
  b.entry('north', 18, 3, 'down').entry('station', 20, 11, 'down').entry('east', 42, 23, 'left');

  b.npc('commuter', 29, 11, { face: 'down' });
  b.npc('gaz', 27, 6, { face: 'down' });
  b.npc('marisol', 9, 15, { face: 'up' });

  b.lane({ axis: 'x', pos: 12.5, dir: 1, from: -12, to: 56, every: [30, 55], speed: 120, kinds: ['veh-train-h'], train: true, under: true });
  b.lane({ axis: 'x', pos: 13.5, dir: -1, from: -12, to: 56, every: [35, 60], speed: 120, kinds: ['veh-train-h'], train: true, under: true });
  b.lane({ axis: 'x', pos: 0.5, dir: -1, from: -3, to: 47, every: [9, 18], speed: 56, kinds: ['veh-car-h-red', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 1.5, dir: 1, from: -3, to: 47, every: [10, 20], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });
  b.lane({ axis: 'x', pos: 22.5, dir: -1, from: -3, to: 47, every: [10, 20], speed: 60, kinds: ['veh-car-h-white', 'veh-ute-h'] });

  b.forage(41, 26, ['chicken', 'feather']);
  b.magpies([[12, 26], [33, 26]]);
  b.border(['gum', 'oak']);
  b.scatter([1, 25, 42, 2], 0.2, [['bush', 2, ['green']], ['tree', 1, ['gum']]]);
  return b.finish();
}
