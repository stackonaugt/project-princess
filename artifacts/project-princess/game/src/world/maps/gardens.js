// CARLTON GARDENS: the Royal Exhibition Building, big and to scale, with the
// Hochgurtel fountain on its forecourt; Melbourne Museum beside it under its
// huge blade of a canopy; avenues of big elms and planes, a pond with ducks
// and the playground. Possums everywhere after dark.
// North up the path to Nicholson St (Murchison St), south to Lygon St.
//
//   y0-14  the museum (x3-20, canopy y9-13) and the Exhibition Building (x26-55)
//   y15-26 the forecourt and fountain (x30-51)   x22-23 the path north
//   y28-29 the east-west avenue   y30-45 lawns, the pond, the playground
import { MapBuilder } from '../MapBuilder.js';

export function buildGardens() {
  const b = new MapBuilder({ id: 'gardens', w: 64, h: 46, fill: '.', seed: 902 });

  // Paths of decomposed granite
  b.fill(22, 0, 2, 29, 'u');                     // north to Murchison St
  b.fill(0, 28, 64, 2, 'u');                     // the east-west avenue
  b.fill(40, 26, 2, 20, 'u');                    // south to Lygon St
  b.fill(30, 15, 22, 12, 'u');                   // the forecourt
  b.fill(24, 16, 6, 2, 'u');
  for (let i = 0; i < 14; i++) { b.fill(8 + i, 44 - i, 2, 1, 'u'); b.fill(54 - i, 44 - i, 2, 1, 'u'); }   // diagonals to the avenue
  for (let i = 0; i < 12; i++) { b.fill(2 + i * 1.6 | 0, 27 - i, 2, 1, 'u'); }

  // The museum, its canopy over the plaza, and the Exhibition Building
  b.put('museum', 3, 3);
  b.fill(3, 9, 19, 6, 'k');
  b.put('museumroof', 3, 9);
  b.put('exhibition', 26, 5);
  b.put('fountain', 38, 18);
  b.sign(36, 16, ['Royal Exhibition Building, 1880.', 'World Heritage listed. Australia\'s first parliament sat here. So did a lot of wedding photos.']);
  b.sign(21, 13, ['Melbourne Museum.', 'Dinosaurs, a forest gallery and Phar Lap. The horse is very still. Do not tap the glass.']);
  for (const x of [31, 50]) { b.put('lamp', x, 16); b.put('lamp', x, 25); }
  b.put('bench', 32, 23); b.put('bench', 48, 23); b.put('bench', 34, 26); b.put('bench', 46, 26);
  b.put('infosign', 25, 18);

  // Big elms and planes along the avenues, and behind the buildings
  for (let x = 2; x < 62; x += 6) { if (Math.abs(x - 40) < 3 || Math.abs(x - 22) < 3) continue; b.put('bigelm', x, 27, { v: x % 12 ? 'elm' : 'plane' }); b.put('bigelm', x + 3, 31, { v: 'elm' }); }
  for (let y = 19; y < 26; y += 6) { b.put('bigelm', 20, y, { v: 'plane' }); b.put('bigelm', 25, y + 3, { v: 'plane' }); }
  for (let y = 33; y < 45; y += 5) { b.put('bigelm', 38, y, { v: 'elm' }); b.put('bigelm', 43, y + 2, { v: 'elm' }); }
  for (const x of [57, 60]) for (const y of [4, 10, 16, 22]) b.put('bigelm', x, y, { v: 'fig' });
  b.put('tall', 1, 16, { v: 'biggum' }); b.put('tall', 6, 20, { v: 'biggum' });

  // The pond, with ducks
  b.ellipse(14, 37, 7, 3.4, '~');
  b.put('reeds', 7, 37); b.put('reeds', 20, 36); b.put('reeds', 13, 40);
  b.ducks(14, 37, 5, 2, 4);
  b.put('bench', 10, 32); b.put('bench', 18, 42);

  // The playground and a picnic lawn
  b.fill(48, 34, 12, 8, 'm');
  b.put('playframe', 49, 36, { v: 'pink' }); b.put('swings', 55, 35); b.put('springrider', 54, 39);
  b.put('picnic', 28, 34); b.put('picnic', 30, 39);

  // Tall grass for wild encounters
  b.wildGrass(9, 22, 3, 1.8); b.wildGrass(26, 39, 3, 1.6); b.wildGrass(58, 30.5, 3, 1.2); b.wildGrass(3, 42, 2.6, 1.6); b.wildGrass(52, 44, 3, 1);

  b.npc('ana', 12, 13, { face: 'down' });
  b.npc('jun', 9, 18, { face: 'right' });
  b.npc('dell', 16, 23, { face: 'left' });
  b.npc('possumpat', 30, 28, { path: [[30, 28], [56, 28], [30, 28]] });

  b.forage(46, 21, ['feather', 'chicken']);
  b.forage(4, 33, ['tennis', 'strawberry']);
  b.forage(33, 42, ['lemon', 'carrot']);
  b.magpies([[12, 24], [50, 31]]);

  b.exit(40,15,2,1,'exhibition','door','Dog show');
  b.entry('exhibition',40,16,'down');
  b.exit(22, 0, 2, 1, 'nicholson', 'gardens', 'Nicholson St');
  b.exit(40, 45, 2, 1, 'swanston', 'west', 'Swanston St', null, { gate: 'bencarroll' });
  b.exit(0, 28, 1, 2, 'lygon', 'west', 'Lygon St');
  b.exit(63, 28, 1, 2, 'bourke', 'west', 'Spring St');
  b.entry('north', 22, 1, 'down').entry('south', 40, 44, 'up').entry('west', 1, 28, 'right').entry('east', 62, 28, 'left');
  b.border(['oak', 'gum']);
  b.scatter([0, 30, b.w, 16], 0.02, [['bush', 3, ['green', 'rose', 'hydrangea']], ['agapanthus', 2, ['purple', 'white']], ['rock', 1]], { clearance: 1 });
  const map = b.finish();
  // The two-cell path advancing up to two columns per row touched only at
  // corners. Add the missing overlap after dressing so source furniture and
  // creator prop identities are not changed by this terrain-only repair.
  const ground = map.ground.map(row => [...row]);
  for (let i = 0; i < 13; i++) {
    const x = Math.floor(2 + i * 1.6), y = 27 - i;
    for (let dx = 0; dx < 3; dx++) if ('.,\"u'.includes(ground[y][x + dx]))
      ground[y][x + dx] = 'u';
  }
  return { ...map, ground: ground.map(row => row.join('')) };
}
