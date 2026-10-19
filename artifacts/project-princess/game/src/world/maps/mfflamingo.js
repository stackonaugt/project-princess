// MEREDITH: THE PINK FLAMINGO. The bar at the back of the Amphitheatre, up
// close: a big white rectangular marquee with the bar along its back wall
// (walk up to it for a Pink Flamingo), and out the front, at the bottom, the
// raised turf of pink lawn chairs and hay bales. Shuffles dances here at night.
import { MapBuilder } from '../MapBuilder.js';
import { gums } from './mfkit.js';

export function buildMfFlamingo() {
  const b = new MapBuilder({ id: 'mfflamingo', w: 30, h: 22, seed: 9110 });
  b.fill(0, 0, 30, 22, '.');
  b.fill(5, 1, 20, 8, 'u');                       // trampled floor under the marquee
  b.put('mfmarquee', 6, 1, { interact: 'mfbar' });
  b.sign(4, 7, ['The Pink Flamingo.', 'We never close. Much. Opening hours vary. So do the patrons.']);

  // The turf out the front: pink lawn chairs in rows, hay bales around the edge
  b.fill(3, 10, 24, 9, 'L');
  for (const y of [11, 14]) for (let x = 5; x <= 24; x += 2) if (x < 13 || x > 16) b.put('mfchair', x, y, { v: x % 4 === 1 ? 'white' : 'pink' });
  for (const [x, y] of [[3, 17], [6, 17], [21, 17], [24, 17], [3, 11], [26, 13]]) b.put('mfhaybale', x, y, { v: (x + y) % 3 ? 'square' : 'round' });
  gums(b, [0, 19, 30, 3], 0.25, ['red', 'blue']);
  gums(b, [0, 0, 4, 10], 0.3, ['blue']); gums(b, [26, 0, 4, 10], 0.3, ['blue']);
  b.wildGrass(27, 18, 1.5, 1.5);

  b.npc('mfshuffle', 15, 13, { face: 'down', mf: { night: true } });

  b.exit(13, 21, 4, 1, 'mfamphi', 'flamingo', 'The Amphitheatre');
  b.entry('amphi', 15, 19, 'up');
  return b.finish();
}
