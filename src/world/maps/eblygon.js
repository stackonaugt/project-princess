// LYGON ST, Brunswick East, from the owner's Street View shots. All concrete,
// no grass. North side, a row of Victorian shops with tall parapets: Bed Bath
// N' Table's clearance outlet, Mr Wilkinson's bar (green, the yellow W),
// Lygon's, the pink This Is Not A Toy Store and Benjy's karaoke bar with its
// rainbow awning. South side, the new apartments: the concrete tower with
// lime fins, the grey block with deep balconies and green tiles, and the old
// yellow brick building at 300, tagged all over. Lygon St runs north towards
// Moreland Rd and Coburg, which is locked for now.
//
//   y0-6 north side shops   y7 footpath   y8-13 Lygon St   y14 footpath
//   y15-21 apartments   y22-25 the back lane
import { MapBuilder } from '../MapBuilder.js';

export function buildEbLygon() {
  const b = new MapBuilder({ id: 'eblygon', w: 44, h: 26, fill: 'c', seed: 651 });

  b.hline(0, 43, 7, 'f');
  b.fill(0, 8, 44, 2, '#').hline(0, 43, 10, '+').hline(0, 43, 11, '+').fill(0, 12, 44, 2, '#');
  b.hline(0, 43, 14, 'f');
  // Lygon St heads north off the top (towards Moreland Rd, Coburg)
  b.fill(30, 0, 4, 7, '#').vline(29, 0, 6, 'f').vline(34, 0, 6, 'f');

  // North side, west to east
  b.put('bbnt', 0, 4);
  b.put('lygonshop', 7, 4, { v: 'wilkinson' });
  b.put('table', 7, 7); b.put('table', 11, 7);
  b.put('lygonshop', 12, 4, { v: 'lygons' });
  b.put('lygonshop', 17, 4, { v: 'toystore' });
  b.put('lygonshop', 22, 4, { v: 'benjys' });
  b.put('gigposters', 27, 6);
  b.sign(28, 7, ['Lygon St, Brunswick East.', 'Bars, karaoke, a toy store that is not a toy store, and apartments all the way up. Not a blade of grass.']);
  b.put('graffiti', 36, 5, { v: 'paste' });
  b.put('rollerdoor', 40, 4, { v: 'tagged' });

  // South side: the apartments and the old yellow brick building at 300
  b.put('lygonapts', 0, 15, { v: 'fins' });
  b.put('lygonshop', 9, 16, { v: 'oldbrick' });
  b.put('lygonapts', 15, 15, { v: 'balconies' });
  b.put('lygonapts', 25, 15, { v: 'fins' });
  b.put('lygonapts', 35, 15, { v: 'balconies' });

  // Street furniture: tram stops, poles, bike hoops. No trees on this bit.
  b.put('tramstop', 24, 7, { v: '1' }); b.put('tramstop', 14, 14, { v: '1' });
  b.put('powerpole', 6, 7); b.put('powerpole', 21, 7); b.put('powerpole', 37, 7);
  b.put('bikehoop', 33, 14); b.put('bikehoop', 34, 14);
  b.put('car', 2, 14, { v: 'white' }); b.put('car', 26, 7, { v: 'red' }); b.put('car', 40, 14, { v: 'blue' });

  // The back lane behind the apartments
  b.put('bin', 10, 22, { v: 'red' }); b.put('bin', 11, 22, { v: 'yellow' }); b.put('crate', 28, 22, { v: 'blue' });
  b.fenceH(0, 43, 25, 'colorbond');

  b.exit(0, 7, 1, 8, 'ebnicholson', 'west', 'Nicholson St');
  b.exit(0, 22, 1, 3, 'bowls', 'west', 'Brunswick Bowls Club');
  b.exit(30, 0, 4, 1, null, null, 'Moreland Rd, Coburg', ['Lygon St carries on north towards Moreland Rd.', 'Not today. Bring Betty back some coffee beans when you do.']);
  b.entry('east', 1, 8, 'right').entry('bowls', 2, 23, 'right').entry('north', 31, 2, 'down');

  b.npc('mrwilkinson', 9, 7, { face: 'down' });
  b.npc('abbysaunt', 20, 14, { face: 'up' });

  b.lane({ axis: 'x', pos: 10.5, dir: 1, from: -6, to: 50, every: [28, 48], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 11.5, dir: -1, from: -6, to: 50, every: [32, 52], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 8.5, dir: -1, from: -3, to: 47, every: [8, 16], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white'] });
  b.lane({ axis: 'x', pos: 13.5, dir: 1, from: -3, to: 47, every: [8, 16], speed: 56, kinds: ['veh-car-h-blue', 'veh-ute-h'] });

  b.forage(2, 23, ['croissant', 'cheese']);
  b.forage(35, 23, ['sardine', 'feather']);
  b.magpies([[20, 23], [38, 2]]);
  b.scatter([0, 0, b.w, b.h], 0.02, [['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  b.noDress = true;
  return b.finish();
}
