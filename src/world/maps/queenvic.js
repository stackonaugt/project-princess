// QUEEN VICTORIA MARKET: long shed roofs on green cast iron posts with
// stalls underneath (fruit, veg, the deli, flowers, three pairs of socks for
// ten dollars), the hot jam donut van, the car park, then Victoria St with
// its trams and a pocket of Flagstaff Gardens lawn across the road.
// East back to Swanston St.
//
//   y2-16  the sheds (x2-13 and x17-28, two rows), the donut van, the car park (x34-47)
//   y17-18 footpath   y19-22 Victoria St (tram tracks y20-21)   y23-24 footpath
//   y25-31 terraces, a cafe and the Flagstaff lawn
import { MapBuilder } from '../MapBuilder.js';
import { hstreet, furniture, liven } from './melbkit.js';

export function buildQueenVic() {
  const b = new MapBuilder({ id: 'queenvic', w: 48, h: 32, fill: 'c', seed: 907 });
  hstreet(b, 17, { rows: 4, tram: true });

  // The sheds, with a row of stalls under each roof and another out the front
  const STALLS = ['fruit', 'veg', 'deli', 'flowers', 'socks'];
  for (const [sx, sy] of [[2, 3], [17, 3], [2, 11], [17, 11]]) {
    b.put('marketshed', sx, sy);
    for (let i = 0; i < 4; i++) {
      b.put('stall', sx + 1 + i * 3, sy + 1, { v: STALLS[(i + sx + sy + 2) % STALLS.length] });
      b.put('stall', sx + 1 + i * 3, sy + 3, { v: STALLS[(i + sx + sy) % STALLS.length] });
    }
  }
  b.sign(15, 8, ['Queen Victoria Market, since 1878.', 'Get here early for the best fruit. Get here late for "two dollar a bag, two dollar!"']);
  b.put('crate', 14, 4, { v: 'red' }); b.put('crate', 14, 5, { v: 'blue' }); b.put('trolley', 30, 9);
  b.put('donutvan', 30, 3);
  b.put('table', 30, 7); b.put('table', 33, 7);

  // The car park, full by 7am on a Sunday
  b.fill(35, 2, 13, 14, 'P');
  b.fill(35, 8, 13, 2, '#');
  [[36, 3, 'white'], [40, 3, 'red'], [44, 3, 'silver'], [36, 11, 'blue'], [42, 11, 'yellow']].forEach(([x, y, v]) => b.put('car', x, y, { v }));
  b.put('carparksign', 34, 2);
  b.sign(34, 15, ['Market car park.', 'Two hours free. The queue to get out takes three.']);

  // Back of the market: crates, bins, a patch of weeds by the fence
  b.fill(0, 0, 35, 2, 'b');
  b.put('skip', 6, 0); b.put('bin', 10, 1, { v: 'compost' }); b.put('bin', 11, 1, { v: 'garbage' });
  b.fill(22, 0, 8, 2, '.'); b.wildGrass(26, 1, 3, 1);

  furniture(b, 17, 2, 46, { step: 7, skip: [24, 25] });
  b.put('tramstop', 24, 17);

  // South of Victoria St: terraces, a cafe, the Flagstaff lawn
  b.put('terrace', 0, 25, { v: 'brick' }); b.put('terrace', 3, 25, { v: 'cream' });
  b.put('cafe', 6, 25); b.put('shop', 10, 25, { v: 'milk bar' }); b.put('terrace', 14, 25, { v: 'sage' });
  b.fill(18, 25, 30, 7, '.');
  b.put('tall', 20, 26, { v: 'biggum' }); b.put('tall', 30, 30, { v: 'biggum' }); b.put('tree', 44, 26, { v: 'oak' }); b.put('tree', 38, 30, { v: 'gum' });
  b.put('bench', 25, 26); b.put('picnic', 34, 26);
  b.wildGrass(26, 29, 4, 1.8); b.wildGrass(42, 29, 3, 1.6);
  b.sign(18, 25, ['Flagstaff Gardens.', 'Lunchtime lawn for half the office towers in the city. The possums run the night shift.']);

  b.npc('dot', 31, 5, { face: 'down' });
  b.npc('stavros', 6, 6, { face: 'down' });
  b.npc('carmel', 20, 14, { face: 'down' });

  b.forage(46, 30, ['lemon', 'carrot']);
  b.forage(23, 1, ['tomato', 'strawberry']);
  b.forage(13, 15, ['cheese', 'chicken']);
  b.magpies([[36, 28]]);

  b.exit(47, 20, 1, 1, 'swanston', 'west', 'Swanston St');
  b.exit(0, 20, 1, 1, null, null, 'North Melbourne', ['Victoria St heads west to North Melbourne.', 'Another day. Bring a footy.']);
  b.entry('east', 46, 18, 'left');
  liven(b, 0.01);
  return b.finish();
}
