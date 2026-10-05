// BELL ST, Coburg: the walk from Brunswick towards Reservoir. Six lanes of
// Bell St traffic, the old Pentridge Prison bluestone wall and watchtower
// (apartments inside now, of course), shops, and brick houses with nonna
// gardens on the south side.
//
//   y2-8 Pentridge and shops   y9 footpath   y10-13 Bell St   y14 footpath   y15-24 houses and gardens
//   x26-28 a path south (bottom edge) to Sydney Rd at Albion St, Brunswick
import { MapBuilder } from '../MapBuilder.js';
import { street, furnish } from './citykit.js';

export function buildCoburg() {
  const b = new MapBuilder({ id: 'coburg', w: 48, h: 26, fill: 'c', seed: 304 });
  street(b, 9, { rows: 4, trucks: true, speed: 62 });

  // North: the Pentridge wall and its watchtower, new apartments behind it
  b.fill(0, 0, 30, 8, 'g');
  b.put('aptblock', 2, 3, { v: 'grey' }); b.put('aptblock', 17, 3, { v: 'grey' });
  b.fenceH(0, 29, 8, 'bluestone', [13, 14]);
  b.put('watchtower', 13, 7);
  b.sign(16, 9, ['HM Prison Pentridge, 1850 to 1997.', 'Now it is apartments and a cafe. The bluestone walls stayed. The vibe is "heritage".']);
  b.put('bshop', 30, 6, { v: 'yoga' }); b.put('cafe', 34, 6, { v: 'green' }); b.put('redshop', 38, 6, { v: 'cream' });
  b.put('terrace', 42, 6, { v: 'brick' }); b.put('terrace', 45, 6, { v: 'sand' });
  furnish(b, 9, { skip: [13, 14, 16], seed: 5 });
  furnish(b, 14, { skip: [46], seed: 1, step: 8 });

  // South: brick veneers, a nonna's veggie garden and lemon tree
  b.fill(0, 15, 48, 11, '.');
  b.put('brickhouse', 1, 16, { v: 'tan' }); b.put('weatherboard', 6, 16, { v: 'mint' });
  b.fenceH(0, 10, 19, 'brickwall', [3, 8]);
  b.put('veggie', 12, 16); b.put('veggie', 12, 19); b.put('tree', 16, 17, { v: 'lemon' }); b.put('tree', 17, 21, { v: 'lemon' });
  b.fenceH(11, 18, 15, 'picket', [14]);
  b.put('house', 20, 16, { v: 'red' });
  b.put('ute', 27, 17, { v: 'silver' });
  b.fill(26, 15, 3, 6, 'h');
  // A footpath south, back down Sydney Rd to Albion St, Brunswick
  b.fill(26, 21, 3, 5, 'f');
  b.sign(29, 21, ['Sydney Rd, south.', 'Back down to Albion St and the Edinburgh Castle, Brunswick.']);
  b.put('brickhouse', 30, 16, { v: 'red' }); b.put('weatherboard', 35, 16, { v: 'lemon' });
  b.put('tall', 40, 16, { v: 'cypress' }); b.put('tall', 42, 16, { v: 'cypress' });
  b.fenceH(29, 47, 19, 'brickwall', [32, 37, 44]);
  b.wildGrass(8, 23, 4, 1.6); b.wildGrass(37, 23, 4, 1.6);
  b.put('billboard', 22, 21, { v: 'pies' });
  b.sign(45, 15, ['Bell St, Coburg.', 'Halfway to Reservoir. Bell St traffic is a national treasure. Of noise.']);

  b.forage(14, 23, ['lemon', 'carrot']);
  b.forage(44, 22, ['cheese', 'croissant']);
  b.magpies([[24, 23], [33, 22]]);

  b.exit(0, 9, 1, 1, 'donald', 'east', 'Donald St, Brunswick');
  b.exit(47, 14, 1, 1, 'preston', 'west', 'Preston');
  b.exit(26, 25, 3, 1, 'albion', 'east', 'Sydney Rd, Brunswick');
  b.entry('west', 1, 9, 'right').entry('east', 46, 14, 'left').entry('south', 27, 24, 'up');
  // Lived-in touches: pot plants and bikes outside shops (walk-through)
  b.scatter([0, 0, b.w, b.h], 0.012, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
