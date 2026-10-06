// GLASGOW AVE: Tim and Nick's little brick unit at 57C (Stanley's domain),
// behind an orange brick fence with a pear tree out the front. Next door's
// grand brick house, cream fences and a transmission tower on the skyline.
import { MapBuilder } from '../MapBuilder.js';

export function buildGlasgow() {
  const b = new MapBuilder({ id: 'glasgow', w: 48, h: 26, seed: 151 });

  // Glasgow Ave: footpath, nature strip, road, nature strip, footpath
  b.hline(0, 40, 11, 'f').fill(0, 13, 48, 2, '#').hline(0, 40, 16, 'f');
  // Botha Ave crosses at the roundabout, with a big yarn-bombed gum in the middle
  b.fill(42, 0, 2, 26, '#').vline(41, 0, 25, 'f').vline(44, 0, 25, 'f');
  b.ellipse(42.5, 13.5, 4.6, 4.6, '#');
  b.ellipse(42.5, 13.5, 2.9, 2.9, 'k');
  b.ellipse(42.5, 13.5, 1.8, 1.8, 'm');
  b.put('tall', 42, 13, { v: 'yarngum' });
  b.sign(45, 10, ['Botha Ave roundabout.', 'Someone has knitted the gum tree a jumper. Nobody knows who. Nobody asks.']);
  b.put('car', 33, 12, { v: 'yellow' });

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
  b.put('tall', 38, 7, { v: 'biggum' });
  b.put('house', 2, 18, { v: 'red' }); b.put('house', 12, 18, { v: 'grey' }); b.put('house', 22, 18, { v: 'cream' }); b.put('house', 31, 18, { v: 'orange' });
  b.fenceH(1, 38, 17, 'colorbond', [4, 5, 14, 15, 24, 25, 33, 34]);
  b.put('house', 45, 18, { v: 'red' });
  b.put('powerpole', 14, 12); b.put('powerpole', 34, 15); b.put('pylon', 15, 3);

  b.exit(0, 13, 1, 2, 'lakepark', 'south', 'Lake Park');
  b.exit(47, 13, 1, 2, 'reservoir', 'west', 'Reservoir Station');
  b.exit(42, 25, 2, 1, 'murray', 'north', 'Murray Rd, Preston');
  b.entry('southeast', 42, 24, 'up').entry('west', 1, 14, 'right').entry('east', 46, 13, 'left');

  b.npc('pina', 9, 15, { face: 'up' });
  b.npc('tim', 23, 7, { face: 'down' });
  b.npc('nicholas', 27, 7, { face: 'left' });

  b.lane({ axis: 'x', pos: 13.5, dir: 1, from: -3, to: 38, every: [14, 26], speed: 50, kinds: ['veh-car-h-white', 'veh-car-h-red'] });

  b.forage(36, 12, ['cheese', 'croissant']);
  b.forage(10, 3, ['sardine', 'chicken']);
  b.magpies([[28, 15], [6, 23]]);
  b.border(['gum', 'oak', 'fruit']);
  // Tall grass for wild encounters
  b.wildGrass(3, 2); b.wildGrass(33, 2); b.wildGrass(13, 22); b.wildGrass(23, 22);
  return b.finish();
}
