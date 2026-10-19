// MEREDITH: SOUTH BANK AND THE SUNSET STRIP. South Bank's food stalls by the
// side of the stage, then the long grassy rise of the Sunset Strip, hay
// bales and flags along the top, and the paddocks rolling away east. The
// best seat at Meredith for a sunset. Or a sunrise.
import { MapBuilder } from '../MapBuilder.js';
import { road, gums } from './mfkit.js';

export function buildMfSunset() {
  const b = new MapBuilder({ id: 'mfsunset', w: 54, h: 34, seed: 9105 });

  road(b, 0, 8, 22, 8, 3);                       // Southbank Road from the Amphitheatre
  road(b, 30, 0, 30, 8, 3);                      // up to Top Camp
  road(b, 22, 8, 51, 6, 3);                      // Loo Rd, east to South Pines
  b.fill(3, 11, 18, 10, 'u');                     // South Bank
  b.put('mffood', 3, 11, { v: 'potato' }); b.put('mffood', 8, 11, { v: 'krishna' }); b.put('mffood', 13, 11, { v: 'gelato' }); b.put('mffood', 3, 17, { v: 'noodles' });
  b.put('picnic', 10, 16); b.put('picnic', 14, 16); b.put('picnic', 10, 19); b.put('picnic', 15, 19);
  b.put('mfwatertank', 18, 17);
  b.put('mfbins', 8, 20);
  b.sign(20, 12, ['South Bank Food.', 'Baked potatoes, Hare Krishna curries, noodles and gelato, right beside the stage.']);
  b.put('mfroadsign', 22, 11, { v: 'sunset' });

  // The Sunset Strip: a long rise of mown grass, hay bales along the top
  b.fill(24, 12, 28, 16, 'L');
  for (const [x, y] of [[26, 14], [30, 14], [34, 14], [38, 14], [42, 14], [46, 14], [28, 18], [36, 18], [44, 18], [32, 22], [40, 22]]) b.put('mfhaybale', x, y, { v: (x + y) % 3 ? 'square' : 'round' });
  for (const [x, v] of [[25, 'pink'], [31, 'blue'], [37, 'yellow'], [43, 'green'], [49, 'purple']]) b.put('mfflag', x, 12, { v });
  b.sign(24, 26, ['The Sunset Strip.', 'A big crowd gathers here every evening to watch the sun go down. They clap when it does.']);
  b.fenceH(1, 52, 31, 'park');
  b.npc('tim', 29, 16, { face: 'right' });
  b.npc('adam', 39, 20, { face: 'down' });
  b.npc('chelsea', 41, 20, { face: 'down' });
  b.npc('mfsunsal', 34, 16, { face: 'down' });
  b.entry('strip', 38, 25, 'up');

  gums(b, [0, 21, 24, 10], 0.12, ['red']);
  gums(b, [0, 0, 28, 6], 0.15, ['blue', 'red']);
  gums(b, [34, 0, 20, 4], 0.15, ['blue']);
  b.wildGrass(6, 26, 4, 2); b.wildGrass(48, 26, 3, 2);

  b.exit(0, 8, 1, 3, 'mfamphi', 'sunset', 'The Amphitheatre');
  b.exit(30, 0, 3, 1, 'mftop', 'sunset', 'Top Camp');
  b.exit(53, 6, 1, 3, 'mfpines', 'sunset', 'South Pines');
  b.entry('amphi', 2, 9, 'right').entry('top', 31, 2, 'down').entry('pines', 51, 7, 'left');
  b.forage(47, 24, ['hotchips', 'feather']);
  return b.finish();
}
