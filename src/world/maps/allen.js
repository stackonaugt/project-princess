// ALLEN ST: the cul-de-sac out the front of Helen and Paddy's new place.
// Princess's turf. Brick veneers, a keep-left island, utes in driveways.
import { MapBuilder } from '../MapBuilder.js';

export function buildAllen() {
  const b = new MapBuilder({ id: 'allen', w: 40, h: 30, seed: 61 });

  // The court: footpath ring, then the turning circle, then the street south
  b.ellipse(20, 12, 8.2, 6.8, 'f');
  b.ellipse(20, 12, 6.2, 5.0, '#');
  b.fill(17, 15, 6, 15, '.').fill(17, 15, 1, 15, 'f').fill(22, 15, 1, 15, 'f').fill(18, 15, 4, 15, '#');
  b.put('keepleft', 19, 17);

  // Helen and Paddy's place
  b.put('hphouse', 5, 4);
  b.fill(4, 7, 9, 3, 'L');
  b.fill(10, 7, 1, 3, 'h');
  b.put('doormat', 10, 7);
  b.fill(13, 1, 3, 10, 'h');                       // driveway up to the side gate
  b.put('ute', 13, 8, { v: 'red' });
  b.fenceH(4, 12, 3, 'colorbond').fenceH(16, 18, 2, 'colorbond');
  b.put('tall', 4, 9, { v: 'cypress' });
  ['purple', 'purple', 'white'].forEach((v, i) => b.put('agapanthus', 5 + i, 7, { v }));
  b.put('letterbox', 12, 10, { v: 'brick' });
  b.put('bin', 16, 9, { v: 'red' }); b.put('bin', 16, 10, { v: 'yellow' });
  b.sign(9, 10, ['16 Allen St.', 'Home. Or it will be, once the renovation is finished. Any day now. Any year now.']);

  // Neighbours around the court
  const nb = (kind, x, y, v, dx) => { b.put(kind, x, y, { v }); b.fill(x + dx, y + 3, 2, 3, 'h'); };
  nb('house', 21, 1, 'grey', 4);
  nb('house', 28, 5, 'red', 4);
  nb('house', 30, 14, 'cream', 1);
  nb('house', 2, 14, 'orange', 4);
  nb('house', 4, 22, 'cream', 4);
  nb('house', 27, 22, 'red', 0);
  b.put('ute', 25, 6, { v: 'white' });
  b.put('car', 32, 9, { v: 'silver' });
  b.put('trailer', 6, 17);
  b.put('car', 27, 25, { v: 'blue' });
  b.put('bin', 26, 4, { v: 'green' }); b.put('bin', 35, 17, { v: 'red' }); b.put('bin', 3, 25, { v: 'yellow' });
  b.put('letterbox', 21, 4, { v: 'metal' }); b.put('letterbox', 34, 9, { v: 'brick' });
  b.fenceH(28, 33, 9, 'metal', [32, 33]).fenceH(2, 7, 17, 'colorbond');

  // Street furniture and trees
  b.put('powerpole', 16, 7); b.put('powerpole', 24, 21); b.put('powerpole', 16, 26);
  b.put('tall', 29, 11, { v: 'biggum' });
  b.put('tall', 23, 17, { v: 'pear' }); b.put('tall', 16, 18, { v: 'pear' });
  b.put('tall', 12, 15, { v: 'cypress' });
  b.sign(23, 27, ['Allen St.', 'South to Woods St, the reserve and the station.']);

  b.exit(18, 29, 4, 1, 'woods', 'east', 'Woods St');
  b.exit(13, 1, 3, 1, 'yard', 'gate', 'Backyard');
  b.exit(10, 7, 1, 1, 'home', 'front', 'Home');
  b.entry('house', 10, 9, 'down').entry('driveway', 14, 3, 'down').entry('south', 19, 28, 'up');
  b.reserve(20, 12, 4);

  b.magpies([[8, 27], [33, 19], [13, 12]]);
  b.border(['gum', 'oak', 'gum', 'pine']);
  b.scatter([1, 1, 38, 28], 0.05, [['tree', 2, ['gum', 'oak']], ['bush', 3, ['green', 'rose', 'hydrangea']], ['agapanthus', 2, ['purple']]]);
  for (let y = 1; y < 29; y++) for (let x = 1; x < 39; x++) if (b.get(x, y) === '.' && b.rand() < 0.05 && !b.occ[y][x]) b.set(x, y, ',');
  // Tall grass for wild encounters
  b.wildGrass(33, 3); b.wildGrass(3, 11); b.wildGrass(35, 25); b.wildGrass(12, 27);
  return b.finish();
}
