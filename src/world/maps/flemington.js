// RACECOURSE RD, Flemington: the last stretch before Brunswick. The housing
// commission towers and their lawns, a few shops, the route 57 tram, and
// weatherboards and a little park on the south side.
//
//   y2-8 towers and shops   y9 footpath   y10-13 road with tram tracks   y14 footpath   y15-24 houses and a park
import { MapBuilder } from '../MapBuilder.js';
import { street, furnish } from './citykit.js';

export function buildFlemington() {
  const b = new MapBuilder({ id: 'flemington', w: 48, h: 26, fill: 'c', seed: 303 });
  street(b, 9, { rows: 4, tram: true });

  // North: the towers on their lawns, then a strip of shops
  b.fill(0, 0, 24, 9, 'L');
  b.put('towerblock', 1, 6); b.put('towerblock', 12, 6);
  b.put('playframe', 9, 3, { v: 'park' }); b.put('bench', 20, 7);
  b.fenceH(9, 11, 8, 'park', [10]); b.fenceH(20, 23, 8, 'park', [21]);
  b.fill(24, 0, 24, 3, 'b');
  b.put('shop', 24, 6, { v: 'pho' }); b.put('redshop', 28, 6, { v: 'red' }); b.put('cafe', 32, 6, { v: 'green' });
  b.put('terrace', 36, 6, { v: 'brick' }); b.put('terrace', 39, 6, { v: 'sage' }); b.put('terrace', 42, 6, { v: 'sand' }); b.put('terrace', 45, 6, { v: 'cream' });
  b.put('tramstop', 27, 9, { v: '19' });
  furnish(b, 9, { skip: [10, 21, 27], seed: 2 });
  furnish(b, 14, { skip: [46], seed: 4, step: 8 });

  // South: weatherboards, a little park, more houses
  b.fill(0, 15, 48, 11, '.');
  b.put('weatherboard', 1, 16, { v: 'cream' }); b.put('brickhouse', 6, 16, { v: 'red' }); b.put('weatherboard', 11, 16, { v: 'blue' });
  b.fenceH(0, 15, 19, 'picket', [3, 8, 13]);
  b.fill(16, 15, 14, 10, 'L');
  b.wildGrass(22, 22, 4, 1.6);
  b.put('swings', 18, 17); b.put('picnic', 25, 16); b.put('tall', 28, 19, { v: 'biggum' }); b.put('tall', 17, 21, { v: 'pear' });
  b.put('house', 31, 16, { v: 'grey' }); b.put('weatherboard', 38, 16, { v: 'lemon' }); b.put('brickhouse', 43, 16, { v: 'tan' });
  b.fenceH(31, 47, 19, 'picket', [34, 40, 45]);
  b.wildGrass(6, 23, 3, 1.4);
  b.put('billboard', 40, 21, { v: 'rent' });
  b.sign(46, 15, ['Racecourse Rd, Flemington.', 'Brunswick is just up the road. Your feet are very excited.']);

  b.forage(24, 19, ['carrot', 'lemon']);
  b.forage(36, 23, ['tennis', 'ribbon']);
  b.magpies([[20, 23], [44, 23]]);

  b.exit(0, 9, 1, 1, 'footscray', 'east', 'Footscray');
  b.exit(47, 14, 1, 1, 'brunswick', 'west', 'Brunswick Station');
  b.entry('west', 1, 9, 'right').entry('east', 46, 14, 'left');
  // Lived-in touches: pot plants and bikes outside shops (walk-through)
  b.scatter([0, 0, b.w, b.h], 0.012, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
