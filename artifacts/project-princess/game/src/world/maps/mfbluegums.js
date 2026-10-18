// MEREDITH: BLUE GUMS. A campground up the north, under a plantation of tall
// blue gums. Loop de Loop and Loop de Lie wind round between the tents, and
// every gazebo is fighting the wind.
import { MapBuilder } from '../MapBuilder.js';
import { road, camp, gums } from './mfkit.js';

export function buildMfBlueGums() {
  const b = new MapBuilder({ id: 'mfbluegums', w: 50, h: 34, seed: 9106 });

  road(b, 0, 24, 49, 24, 3);                     // The High Road
  road(b, 26, 24, 26, 33, 3);                    // down to Top Camp
  for (let a = 0; a < Math.PI * 2; a += 0.05) b.fill(Math.round(14 + Math.cos(a) * 8), Math.round(12 + Math.sin(a) * 6), 2, 2, '=');   // Loop de Loop
  for (let a = 0; a < Math.PI * 2; a += 0.05) b.fill(Math.round(36 + Math.cos(a) * 7), Math.round(12 + Math.sin(a) * 7), 2, 2, '=');   // Loop de Lie
  road(b, 14, 18, 14, 24, 2); road(b, 36, 19, 36, 24, 2);
  b.put('mfroadsign', 12, 21, { v: 'loop' });
  b.put('mfroadsign', 28, 22, { v: 'topcamp' });

  // Gazebo Gary's enormous collapsed gazebo
  b.reserve(24, 16, 2.5);
  b.put('mfgazebo', 22, 13, { v: 'stripe' });
  b.put('mfesky', 25, 14, { v: 'white' });
  b.npc('mfgazebo', 24, 17, { face: 'down' });

  camp(b, [8, 8, 12, 9], 0.75); camp(b, [31, 7, 11, 11], 0.75); camp(b, [1, 1, 48, 5], 0.55); camp(b, [1, 27, 23, 6], 0.6); camp(b, [30, 27, 19, 6], 0.6);
  gums(b, [0, 0, 50, 34], 0.1, ['blue']);
  b.put('mfportaloo', 45, 21); b.put('mfportaloo', 46, 21);
  b.wildGrass(4, 16, 3, 3); b.wildGrass(45, 15, 3, 3);

  b.exit(0, 24, 1, 3, 'mfreception', 'bluegums', 'Reception');
  b.exit(26, 33, 3, 1, 'mftop', 'bluegums', 'Top Camp');
  b.entry('reception', 2, 25, 'right').entry('top', 27, 31, 'up');
  b.forage(46, 17, ['festpie', 'tennis']);
  return b.finish();
}
