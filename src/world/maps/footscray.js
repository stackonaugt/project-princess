// BARKLY ST, Footscray: halfway between Laverton and Brunswick. A row of
// shops (pho, curry, a bakery), terraces, and the market's stalls and
// car park across the road.
//
//   y2-8 shops and terraces   y9 footpath   y10-11 road   y12 footpath   y13-24 market and a pocket park
import { MapBuilder } from '../MapBuilder.js';
import { street, furnish } from './citykit.js';

export function buildFootscray() {
  const b = new MapBuilder({ id: 'footscray', w: 48, h: 26, fill: 'c', seed: 302 });
  street(b, 9);

  // North: Barkly St shops
  b.fill(0, 0, 48, 3, 'b');
  const row = [['shop', 'pho'], ['redshop', 'red'], ['bshop', 'laundro'], ['shop', 'curry'], ['shop', 'signs'], ['cafe', 'green'], ['redshop', 'cream'], ['bshop', 'opshop'], ['shop', 'bakery']];
  row.forEach(([k, v], i) => b.put(k, 1 + i * 4, 6, { v }));
  b.put('terrace', 38, 6, { v: 'sand' }); b.put('terrace', 41, 6, { v: 'brick' }); b.put('terrace', 44, 6, { v: 'cream' });
  [[3, 9], [12, 9], [23, 9]].forEach(([x, y]) => b.put('table', x, y));
  b.put('busshelter', 30, 9);
  furnish(b, 9, { skip: [3, 12, 23, 30, 31], seed: 1 });

  // South: the market stalls, its car park, a laneway and a pocket park
  b.put('canopy', 1, 14); b.put('canopy', 10, 14);
  [[2, 16, 'red'], [4, 16, 'blue'], [12, 16, 'blue'], [15, 16, 'red']].forEach(([x, y, v]) => b.put('crate', x, y, { v }));
  b.put('trolley', 7, 17); b.put('trolley', 18, 15);
  b.fill(0, 18, 20, 7, 'P');
  [[1, 19, 'red'], [5, 21, 'white'], [9, 19, 'blue'], [14, 21, 'silver']].forEach(([x, y, v]) => b.put('car', x, y, { v }));
  b.fill(20, 13, 2, 12, 'b');
  b.put('graffiti', 22, 13, { v: 'paste' });
  b.fill(22, 15, 26, 10, '.');
  b.wildGrass(29, 20, 4, 2);
  b.put('tall', 24, 16, { v: 'biggum' }); b.put('tall', 38, 17, { v: 'biggum' }); b.put('tall', 45, 22, { v: 'biggum' });
  b.put('picnic', 33, 16); b.put('bench', 41, 15); b.put('playframe', 40, 20, { v: 'park' });
  b.put('mural', 26, 13, { v: 'b' });
  b.put('billboard', 34, 13, { v: 'trains' });
  b.sign(44, 12, ['Barkly St, Footscray.', 'Halfway to Brunswick. Have a pho. You have earned it.']);

  b.forage(31, 23, ['croissant', 'cheese']);
  b.forage(17, 23, ['sardine', 'chicken']);
  b.magpies([[36, 21], [27, 17]]);

  b.exit(0, 9, 1, 1, 'altona', 'east', 'Altona North');
  b.exit(47, 12, 1, 1, 'flemington', 'west', 'Flemington');
  b.entry('west', 1, 9, 'right').entry('east', 46, 12, 'left');
  // Lived-in touches: pot plants and bikes outside shops (walk-through)
  b.scatter([0, 0, b.w, b.h], 0.015, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
