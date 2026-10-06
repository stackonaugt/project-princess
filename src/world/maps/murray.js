// MURRAY RD at ST GEORGES RD, Preston (from the owner's Street View shots
// and notes): built up, not green. Alison's apartment block on the left: dark
// brown panels, deep balconies in white box frames, a red stripe up the side,
// glass along a grey base wall and a row of young trees, with Alison out the
// front. Right beside it a street runs north to Glasgow Ave. East of that,
// wall to wall townhouses, a block of flats and brick houses, with more flats
// and back yards behind. South of Murray Rd, St Georges Rd and the 11 tram
// curve off south-west past a cleared building site.
//
//   y0-6 behind the buildings   y7-10 Alison's block, the street north, houses and flats
//   y11 footpath   y12-13 Murray Rd   y14 footpath   x4-9 St Georges Rd south   y15-25 the building site
import { MapBuilder } from '../MapBuilder.js';

export function buildMurray() {
  const b = new MapBuilder({ id: 'murray', w: 44, h: 26, seed: 371 });

  // Murray Rd, and St Georges Rd with the tram tracks heading south-west
  b.hline(0, 43, 11, 'f').hline(0, 43, 12, '#').hline(0, 43, 13, '#').hline(0, 43, 14, 'f');
  b.vline(4, 15, 25, 'f').vline(5, 14, 25, '#').fill(6, 14, 2, 12, '+').vline(8, 14, 25, '#').vline(9, 15, 25, 'f');
  b.fill(5, 11, 4, 1, 'z');

  // Behind the buildings: a car park on the left, back yards and more flats on the right
  b.fill(0, 0, 44, 7, 'c');
  b.fill(0, 0, 12, 7, 'P');
  b.put('car', 1, 3, { v: 'white' }); b.put('car', 5, 3, { v: 'blue' }); b.put('car', 8, 1, { v: 'red' });
  b.put('aptblock', 17, 1);
  b.put('flats', 28, 1, { v: 'donald' });
  b.fill(37, 0, 7, 7, '.'); b.fenceV(37, 0, 6, 'paling'); b.put('hoist', 39, 2); b.put('tree', 42, 1, { v: 'lemon' });
  b.fenceH(16, 43, 6, 'paling', [27, 36]);

  // Alison's block on the left, with its glass and young trees
  b.put('alisonapts', 0, 8, { v: 'murray' });
  b.sign(12, 11, ['388 Murray Rd.', 'Alison lives up there. Right now she is down here, standing out the front for no reason.']);
  [1, 4, 8, 10].forEach(x => b.put('sapling', x, 11));
  b.npc('alison', 6, 11, { face: 'down' });
  b.put('powerpole', 16, 11); b.put('powerpole', 32, 11);

  // A street running north right beside Alison's, to Glasgow Ave
  b.fill(12, 0, 1, 11, 'f').fill(13, 0, 2, 11, '#').fill(15, 0, 1, 11, 'f');
  b.exit(13, 0, 2, 1, 'glasgow', 'southeast', 'Glasgow Ave');

  // East of the street, wall to wall: townhouses, flats and brick houses
  b.put('townhouse', 16, 8, { v: 'a' }); b.put('townhouse', 20, 8, { v: 'b' });
  b.put('aptblock', 24, 8);
  b.put('brickhouse', 34, 8, { v: 'red' }); b.put('brickhouse', 38, 8, { v: 'tan' });
  b.put('bin', 41, 11, { v: 'red' }); b.put('bin', 40, 11, { v: 'yellow' }); b.put('bin', 23, 11, { v: 'red' });
  b.put('streettree', 28, 11); b.put('streettree', 37, 11);

  // South of Murray Rd: a cleared building site behind a wire fence
  b.fill(10, 15, 34, 11, 'c');
  b.fill(12, 17, 28, 8, 'g');
  b.ellipse(19, 21, 3, 1.4, '.', 'g').ellipse(19, 21, 3, 1.4, '"', '.');
  b.fenceH(11, 40, 16, 'metal', [25, 26]);
  b.sign(24, 15, ['Building site.', 'There used to be display homes here. Soon there will be 400 apartments. For now: dirt, a shopping trolley and one very confident magpie.']);
  b.put('trolley', 30, 23); b.put('billboard', 13, 18, { v: 'rent' });
  b.put('skip', 34, 18); b.put('skip', 36, 22);
  b.put('brickhouse', 0, 16, { v: 'red' }); b.put('brickhouse', 0, 21, { v: 'tan' });

  b.exit(43, 11, 1, 4, 'prestonmkt', 'west', 'Preston Market');
  b.exit(4, 25, 6, 1, 'coburg', 'market', 'Bell St, Coburg');
  b.exit(0, 11, 1, 4, null, null, 'Murray Rd', ['Murray Rd heads west to Coburg.', 'Too far for today. Bell St is the quicker way.']);
  b.entry('north', 14, 1, 'down').entry('east', 42, 11, 'left').entry('south', 6, 24, 'up').entry('middle', 22, 12, 'down');

  b.lane({ axis: 'x', pos: 12.5, dir: -1, from: -3, to: 47, every: [7, 14], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 13.5, dir: 1, from: -3, to: 47, every: [7, 14], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });

  b.forage(36, 22, ['cheese', 'tennis']);
  b.forage(22, 23, ['lemon', 'feather']);
  b.magpies([[22, 19], [40, 3]]);
  b.scatter([0, 0, b.w, b.h], 0.01, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
