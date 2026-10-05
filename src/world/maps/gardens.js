// CARLTON GARDENS: the Royal Exhibition Building with its dome, the
// Hochgurtel fountain out the front, Melbourne Museum and its blade of a roof,
// avenues of plane trees and elms, a pond with ducks and the playground.
// Possums everywhere after dark. West to Lygon St, east to Nicholson St, south down to Bourke St.
//
//   y0-9   the Exhibition Building (x3-16) and the museum (x30-39)
//   y10-11 the east-west avenue   x22-23 the north-south avenue
//   y12-33 lawns, the fountain, the pond and the playground
import { MapBuilder } from '../MapBuilder.js';

export function buildGardens() {
  const b = new MapBuilder({ id: 'gardens', w: 48, h: 34, fill: '.', seed: 902 });

  // Avenues of decomposed granite
  b.fill(0, 10, 48, 2, 'u');
  b.fill(22, 0, 2, 34, 'u');
  b.fill(4, 9, 14, 1, 'k').fill(30, 9, 10, 1, 'k');
  b.fill(5, 12, 9, 6, 'u');                                   // the fountain forecourt
  b.fill(24, 26, 16, 1, 'u').fill(8, 24, 14, 1, 'u');

  // The Exhibition Building and the museum
  b.put('exhibition', 3, 6);
  b.put('museum', 30, 6);
  b.put('fountain', 8, 13);
  b.sign(14, 12, ['Royal Exhibition Building, 1880.', 'World Heritage listed. Australia\'s first parliament sat here. So did a lot of wedding photos.']);
  b.sign(29, 9, ['Melbourne Museum.', 'Dinosaurs, a forest gallery and Phar Lap. The horse is very still. Do not tap the glass.']);
  b.put('lamp', 6, 12); b.put('lamp', 13, 17); b.put('bench', 5, 18); b.put('bench', 11, 18);

  // Avenue trees
  for (let y = 13; y < 33; y += 4) { b.put('tall', 21, y, { v: 'poplar' }); b.put('tall', 24, y + 2, { v: 'poplar' }); }
  for (let x = 2; x < 46; x += 5) { if (Math.abs(x - 22) < 3) continue; b.put('streettree', x, 12); }
  b.put('tall', 1, 20, { v: 'biggum' }); b.put('tall', 16, 22, { v: 'biggum' }); b.put('tall', 44, 14, { v: 'biggum' });
  b.put('tree', 18, 29, { v: 'oak' }); b.put('tree', 3, 31, { v: 'oak' }); b.put('tree', 45, 30, { v: 'oak' });

  // The pond, with ducks
  b.ellipse(36, 20, 6, 3.2, '~');
  b.put('reeds', 30, 20); b.put('reeds', 41, 19); b.put('reeds', 34, 23);
  b.ducks(36, 20, 4.5, 2, 3);
  b.put('bench', 32, 15); b.put('bench', 38, 25);

  // The playground and a picnic lawn
  b.fill(4, 25, 12, 7, 'm');
  b.put('playframe', 5, 27, { v: 'pink' }); b.put('swings', 11, 26); b.put('springrider', 10, 30);
  b.put('picnic', 28, 29); b.put('picnic', 34, 29);
  b.put('infosign', 25, 13);

  // Tall grass for wild encounters
  b.wildGrass(16, 16, 2.6, 1.6); b.wildGrass(42, 31, 3, 1.4); b.wildGrass(29, 16, 2.4, 1.6); b.wildGrass(2, 15, 2, 2.6); b.wildGrass(19, 32, 2, 1.2);
  b.border(['oak', 'gum']);

  b.npc('ana', 34, 10, { face: 'down' });
  b.npc('jun', 12, 15, { face: 'left' });
  b.npc('dell', 11, 21, { face: 'right' });
  b.npc('possumpat', 27, 22, { path: [[27, 22], [27, 30], [40, 30], [27, 30]] });

  b.forage(41, 13, ['feather', 'chicken']);
  b.forage(15, 30, ['tennis', 'strawberry']);
  b.forage(30, 32, ['lemon', 'carrot']);
  b.magpies([[19, 18], [43, 27]]);

  b.exit(0, 10, 1, 2, 'lygon', 'east', 'Lygon St');
  b.exit(22, 33, 2, 1, 'bourke', 'north', 'Bourke St');
  b.exit(47, 10, 1, 2, 'nicholson', 'west', 'Nicholson St');
  b.exit(22, 0, 2, 1, null, null, 'Museum car park', ['The museum car park. Forty dollars for two hours.', 'You turn around. Your wallet thanks you.']);
  b.entry('west', 1, 10, 'right').entry('south', 22, 31, 'up').entry('east', 46, 10, 'left');
  b.scatter([0, 12, b.w, 22], 0.02, [['bush', 3, ['green', 'rose', 'hydrangea']], ['agapanthus', 2, ['purple', 'white']], ['rock', 1]], { clearance: 1 });
  return b.finish();
}
