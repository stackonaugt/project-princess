// GILBERT RD, Preston: the last leg before Reservoir. Shops along the
// route 11 tram, the market's stalls and car park, and weatherboards
// with lemon trees heading towards Reservoir.
//
//   y2-8 shops   y9 footpath   y10-13 road with tram tracks   y14 footpath   y15-24 market, car park, houses
import { MapBuilder } from '../MapBuilder.js';
import { street, furnish } from './citykit.js';

export function buildPreston() {
  const b = new MapBuilder({ id: 'preston', w: 48, h: 26, fill: 'c', seed: 305 });
  street(b, 9, { rows: 4, tram: true });

  // North: Gilbert Rd shops
  b.fill(0, 0, 48, 3, 'b');
  const row = [['shop', 'milk bar'], ['redshop', 'red'], ['shop', 'books'], ['bshop', 'vinyl'], ['cafe', 'green'], ['shop', 'pizza']];
  row.forEach(([k, v], i) => b.put(k, 1 + i * 4, 6, { v }));
  // Anaconda: camping and fishing gear. Rusty out the front runs the shop.
  b.put('anaconda', 25, 6);
  b.npc('bazza', 31, 9, { face: 'down' });
  b.put('weatherboard', 37, 6, { v: 'blue' }); b.put('weatherboard', 42, 6, { v: 'cream' });
  b.put('tramstop', 20, 9, { v: '19' });
  [[18, 9], [27, 9]].forEach(([x, y]) => b.put('table', x, y));
  furnish(b, 9, { skip: [18, 20, 27, 31], seed: 0 });
  furnish(b, 14, { skip: [46], seed: 3, step: 8 });

  // South: market stalls, the car park, then weatherboards
  b.put('canopy', 1, 16); b.put('canopy', 10, 16);
  [[3, 18, 'red'], [6, 18, 'blue'], [12, 18, 'blue'], [16, 18, 'red']].forEach(([x, y, v]) => b.put('crate', x, y, { v }));
  b.put('trolley', 9, 20);
  b.fill(19, 15, 15, 7, 'P');
  [[20, 16, 'white'], [24, 18, 'red'], [28, 16, 'yellow'], [31, 19, 'blue']].forEach(([x, y, v]) => b.put('car', x, y, { v }));
  b.fill(0, 21, 34, 4, '.');
  b.wildGrass(10, 23, 5, 1.5); b.wildGrass(27, 23, 4, 1.4);
  b.fill(34, 15, 14, 10, '.');
  b.put('weatherboard', 35, 16, { v: 'mint' }); b.put('weatherboard', 40, 16, { v: 'lemon' });
  b.put('tree', 45, 17, { v: 'lemon' }); b.put('tree', 39, 21, { v: 'lemon' });
  b.fenceH(34, 47, 19, 'picket', [37, 42]);
  b.put('billboard', 42, 21, { v: 'trains' });
  b.sign(45, 15, ['Gilbert Rd, Preston.', 'Reservoir is the next suburb up. You can smell the lemon trees.']);

  b.forage(15, 22, ['lemon', 'sardine']);
  b.forage(37, 23, ['tennis', 'chicken']);
  b.magpies([[5, 23], [30, 23]]);

  b.exit(0, 9, 1, 1, 'coburg', 'east', 'Coburg');
  b.exit(47, 14, 1, 1, 'loddon', 'west', 'Loddon Ave, Reservoir');
  b.entry('west', 1, 9, 'right').entry('east', 46, 14, 'left');
  // Lived-in touches: pot plants and bikes outside shops (walk-through)
  b.scatter([0, 0, b.w, b.h], 0.015, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
