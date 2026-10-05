// MURRAY RD at ST GEORGES RD, Preston (from the owner's Street View shots),
// just west of Preston Market. Alison's apartment block on the corner: dark
// brown panels, deep balconies in white box frames, a red stripe up the side,
// glass along a grey base wall and a row of young trees. Alison stands out
// the front. Red-roofed houses along Asling St to the east, St Georges Rd
// and the 11 tram curving off to the south-west, and a big empty lot of
// cracked concrete going to weeds.
//
//   y0-6 back fences   y7-10 Alison's block and the houses   y11 footpath   y12-13 Murray Rd   y14 footpath
//   x4-9 St Georges Rd south   y15-25 the empty lot
import { MapBuilder } from '../MapBuilder.js';

export function buildMurray() {
  const b = new MapBuilder({ id: 'murray', w: 44, h: 26, seed: 371 });

  // Murray Rd, and St Georges Rd with the tram tracks heading south-west
  b.hline(0, 43, 11, 'f').hline(0, 43, 12, '#').hline(0, 43, 13, '#').hline(0, 43, 14, 'f');
  b.vline(4, 15, 25, 'f').vline(5, 14, 25, '#').fill(6, 14, 2, 12, '+').vline(8, 14, 25, '#').vline(9, 15, 25, 'f');
  b.fill(5, 11, 4, 1, 'z');

  // Alison's block, with its glass and young trees
  b.fill(0, 0, 44, 7, '.');
  b.put('alisonapts', 10, 8, { v: 'murray' });
  b.sign(9, 11, ['388 Murray Rd.', 'Alison lives up there. Right now she is down here, standing out the front for no reason.']);
  [11, 14, 18, 21].forEach(x => b.put('sapling', x, 11));
  b.npc('alison', 16, 11, { face: 'down' });
  b.put('tall', 2, 8, { v: 'palm' }); b.put('powerpole', 1, 11); b.put('powerpole', 30, 11);
  b.put('bin', 23, 11, { v: 'red' }); b.put('bin', 24, 11, { v: 'yellow' });

  // Asling St: red-roofed brick houses
  b.put('house', 25, 8, { v: 'red' }); b.put('house', 32, 8, { v: 'orange' }); b.put('brickhouse', 39, 8, { v: 'red' });
  b.fenceH(24, 43, 7, 'paling');
  b.put('tree', 30, 4, { v: 'lemon' }); b.put('tree', 37, 3, { v: 'fruit' });
  b.wildGrass(6, 3, 4, 1.6); b.wildGrass(20, 3, 3, 1.4);

  // The empty lot south of Murray Rd: cracked concrete, weeds, a wire fence
  b.fill(10, 15, 34, 11, 'c');
  b.fill(12, 17, 28, 8, '.');
  b.ellipse(19, 21, 6, 2.6, '"', '.').ellipse(33, 20, 5, 2.2, '"', '.');
  b.fenceH(11, 40, 16, 'park', [25, 26]);
  b.sign(24, 15, ['Empty lot.', 'There used to be display homes here. Now it is weeds, a shopping trolley and one very confident magpie.']);
  b.put('trolley', 30, 23); b.put('billboard', 13, 18, { v: 'rent' });
  b.fill(0, 15, 4, 11, '.'); b.put('tree', 1, 18, { v: 'gum' });

  b.exit(43, 11, 1, 4, 'prestonmkt', 'west', 'Preston Market');
  b.exit(4, 25, 6, 1, null, null, 'St Georges Rd', ['St Georges Rd and the 11 tram head south towards Thornbury.', 'Not today. Alison says it is "too far to walk". It is not.']);
  b.exit(0, 11, 1, 4, null, null, 'Murray Rd', ['Murray Rd heads west to Coburg.', 'Too far for today. Bell St is the quicker way.']);
  b.entry('east', 42, 11, 'left');

  b.lane({ axis: 'x', pos: 12.5, dir: -1, from: -3, to: 47, every: [7, 14], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 13.5, dir: 1, from: -3, to: 47, every: [7, 14], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });

  b.forage(36, 22, ['cheese', 'tennis']);
  b.forage(2, 22, ['lemon', 'feather']);
  b.magpies([[22, 19], [15, 2]]);
  b.scatter([0, 0, b.w, b.h], 0.01, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
