// GLASGOW AVE: Tim and Nick's little brick unit at 57C (Stanley's domain),
// behind an orange brick fence with a pear tree out the front. Next door's
// grand brick house, cream fences and a transmission tower on the skyline.
import { MapBuilder } from '../MapBuilder.js';

export function buildGlasgow() {
  const b = new MapBuilder({ id: 'glasgow', w: 40, h: 26, seed: 151 });

  // Glasgow Ave: footpath, nature strip, road, nature strip, footpath
  b.hline(0, 39, 11, 'f').fill(0, 13, 40, 2, '#').hline(0, 39, 16, 'f');

  // 48: the big brick house
  b.put('glasgowhouse', 2, 6);
  b.fill(3, 9, 5, 4, 'h');
  b.put('car', 4, 9, { v: 'silver' });
  b.fenceH(1, 13, 10, 'brickwall', [3, 4, 5, 6, 7]);
  [9, 11].forEach(x => b.put('bush', x, 9, { v: 'green' }));

  // 57C: Tim and Nick's
  b.put('timunit', 21, 3);
  b.fill(19, 1, 2, 10, 'h');
  b.put('car', 19, 2, { v: 'white' });
  b.fill(21, 6, 7, 4, 'L');
  b.fenceH(18, 30, 10, 'brickwall', [19, 20]);
  b.fenceV(18, 1, 9, 'colorbond').fenceV(30, 1, 9, 'colorbond');
  b.put('bin', 18, 12, { v: 'green' }); b.put('bin', 21, 12, { v: 'yellow' });
  b.put('tall', 25, 12, { v: 'pear' });
  b.sign(22, 9, ['57C Glasgow Ave.', 'Tim and Nick\'s Reservoir mansion. Stanley lets them live here.']);
  b.reserve(25, 8, 2);

  // Neighbours
  b.put('house', 32, 4, { v: 'cream' }); b.fenceH(31, 39, 10, 'metal', [34, 35]);
  b.put('house', 2, 18, { v: 'red' }); b.put('house', 12, 18, { v: 'grey' }); b.put('house', 22, 18, { v: 'cream' }); b.put('house', 31, 18, { v: 'orange' });
  b.fenceH(1, 38, 17, 'colorbond', [4, 5, 14, 15, 24, 25, 33, 34]);
  b.put('powerpole', 14, 12); b.put('powerpole', 34, 15); b.put('pylon', 15, 3);

  b.exit(0, 13, 1, 2, 'loddon', 'south', 'Loddon Ave');
  b.entry('west', 1, 14, 'right');

  b.npc('pina', 9, 15, { face: 'up' });

  b.lane({ axis: 'x', pos: 13.5, dir: 1, from: -3, to: 43, every: [14, 26], speed: 50, kinds: ['veh-car-h-white', 'veh-car-h-red'] });

  b.forage(36, 12, ['cheese', 'croissant']);
  b.forage(10, 3, ['sardine', 'chicken']);
  b.magpies([[28, 15], [6, 23]]);
  b.border(['gum', 'oak', 'fruit']);
  return b.finish();
}
