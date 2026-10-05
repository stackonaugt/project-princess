// SYDNEY RD, COBURG: the top end of Sydney Rd. Less oat milk than
// Brunswick, more pide. Knead to Know (Hakan's Turkish bakery, door inside),
// Altar Ego and the other bridal shops Sydney Rd is famous for, a $2 shop,
// a barber, a kebab shop and a spice grocer, with the 19 tram down the
// middle. West along the Victoria St Mall to Coburg Station, east on to
// Coburg Lake, south back down to Bell St.
//
//   y0-1 back lane   y3-5 north shops   y6-7 footpath   y8 road   y9-10 tram   y11 road
//   y12-13 footpath   y14-16 south shops (Bell St road at x17-22)   y17-18 lane   y19-25 houses, pocket park
import { MapBuilder } from '../MapBuilder.js';

export function buildCoburgSyd() {
  const b = new MapBuilder({ id: 'coburgsyd', w: 48, h: 26, fill: 'c', seed: 311 });

  // Sydney Rd across the map
  b.hline(0, 47, 6, 'f').hline(0, 47, 7, 'f');
  b.hline(0, 47, 8, '#').hline(0, 47, 9, '+').hline(0, 47, 10, '+').hline(0, 47, 11, '#');
  b.hline(0, 47, 12, 'f').hline(0, 47, 13, 'f');

  // The back lane behind the north shops
  b.fill(0, 0, 48, 2, 'b');
  b.fill(13, 2, 1, 4, 'b');

  // North side
  b.put('nshop', 1, 3, { v: 'bakery' });
  b.exit(3, 6, 1, 1, 'pidebakery', 'door', 'Knead to Know');
  b.entry('pidebakery', 4, 7, 'down');
  b.put('nshop', 5, 3, { v: 'bridal' }); b.put('nshop', 9, 3, { v: 'discount' });
  b.put('nshop', 14, 3, { v: 'barber' }); b.put('redshop', 18, 3, { v: 'red' }); b.put('nshop', 22, 3, { v: 'kebab' });
  b.put('nshop', 26, 3, { v: 'bridal' }); b.put('nshop', 30, 3, { v: 'phone' });
  b.put('decoshop', 34, 3, { v: 'lease' });
  b.put('terrace', 38, 3, { v: 'cream' }); b.put('terrace', 41, 3, { v: 'brick' }); b.put('terrace', 44, 3, { v: 'sage' });
  b.sign(8, 6, ['Altar Ego, bridal couture.', 'Sydney Rd has a bridal shop for every kind of wedding. Mostly the big kind.']);
  b.sign(25, 6, ['Altar Ego II.', 'Yes, there are two. The second one is for when the first one runs out of tulle.']);
  b.sign(37, 6, ['For Lease.', 'Ideal for a fourth bridal shop, a vape shop, or a cafe that will close in eight months.']);
  b.put('table', 2, 7); b.put('table', 6, 7);

  // South side, with the road down to Bell St
  b.vline(17, 14, 25, 'f').fill(18, 14, 4, 12, '#').vline(22, 14, 25, 'f');
  b.fill(19, 14, 2, 12, '+');
  b.fill(18, 12, 4, 2, 'z');
  b.put('nshop', 1, 14, { v: 'phone' }); b.put('nshop', 5, 14, { v: 'grocer' }); b.put('shop', 9, 14, { v: 'pizza' });
  b.put('shop', 13, 14, { v: 'curry' });
  b.sign(16, 13, ['Sydney Rd, south.', 'Down to Bell St, the Pentridge wall and Coburg Town Hall.']);
  b.put('redshop', 23, 14, { v: 'cream' }); b.put('nshop', 27, 14, { v: 'kebab' }); b.put('shop', 31, 14, { v: 'books' });
  b.put('cafe', 35, 14, { v: 'green' });
  b.put('umbrella', 39, 13); b.put('table', 41, 13);

  // The lane behind, then houses and a little pocket park
  b.fill(0, 17, 17, 2, 'b').fill(23, 17, 25, 2, 'b');
  b.put('bin', 3, 17, { v: 'red' }); b.put('bin', 4, 17, { v: 'yellow' }); b.put('crate', 11, 17, { v: 'blue' }); b.put('crate', 29, 17, { v: 'red' });
  b.put('graffiti', 24, 18, { v: 'paste' });
  b.fill(0, 19, 17, 7, '.').fill(23, 19, 25, 7, '.');
  b.put('weatherboard', 1, 20, { v: 'blue' }); b.put('brickhouse', 6, 20, { v: 'tan' }); b.put('weatherboard', 11, 20, { v: 'cream' });
  b.fenceH(0, 16, 19, 'picket', [3, 8, 13]);
  b.put('tree', 15, 23, { v: 'lemon' });
  b.put('brickhouse', 24, 20, { v: 'red' }); b.put('weatherboard', 29, 20, { v: 'mint' });
  b.fenceH(23, 33, 19, 'picket', [26, 31]);
  // pocket park
  b.fill(35, 19, 13, 7, 'L');
  b.ellipse(41, 22, 4.5, 2.5, '"', 'L');
  b.put('tall', 35, 20, { v: 'biggum' }); b.put('tall', 46, 21, { v: 'poplar' }); b.put('bench', 38, 19);
  b.put('swings', 43, 19);
  b.sign(34, 19, ['Pocket park.', 'Thirteen square metres of grass. In Coburg, that counts as a nature reserve.']);
  b.wildGrass(5, 24, 3, 1.4);

  // Street furniture
  b.put('tramstop', 12, 7); b.put('tramstop', 33, 12);
  b.put('powerpole', 20, 7); b.put('powerpole', 44, 7); b.put('powerpole', 8, 12); b.put('powerpole', 28, 12);
  b.put('streettree', 17, 7); b.put('streettree', 3, 12); b.put('streettree', 24, 12); b.put('streettree', 46, 12);
  b.put('bikehoop', 30, 7); b.put('bin', 35, 7, { v: 'yellow' });

  b.npc('layla', 7, 7, { face: 'down' });

  b.exit(0, 6, 1, 8, 'coburgmall', 'east', 'Victoria St Mall');
  b.exit(47, 6, 1, 8, 'coburglake', 'south', 'Coburg Lake');
  b.exit(17, 25, 6, 1, 'coburg', 'north', 'Bell St');
  b.entry('west', 1, 7, 'right').entry('east', 46, 12, 'left').entry('south', 17, 24, 'up');

  b.lane({ axis: 'x', pos: 9.5, dir: 1, from: -6, to: 54, every: [25, 45], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 10.5, dir: -1, from: -6, to: 54, every: [30, 50], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 8.5, dir: -1, from: -3, to: 51, every: [6, 12], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 11.5, dir: 1, from: -3, to: 51, every: [6, 12], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });
  b.lane({ axis: 'y', pos: 18.5, dir: 1, from: 12, to: 29, every: [14, 26], speed: 50, kinds: ['veh-car-v-silver', 'veh-car-v-yellow'] });

  b.forage(14, 1, ['pide', 'cheese']);
  b.forage(40, 24, ['tennis', 'feather']);
  b.forage(30, 23, ['lemon', 'carrot']);
  b.magpies([[44, 24], [9, 23]]);
  b.scatter([0, 0, b.w, b.h], 0.02, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
