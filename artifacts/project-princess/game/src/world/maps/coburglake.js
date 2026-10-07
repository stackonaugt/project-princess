// COBURG LAKE RESERVE: the Merri Creek widens into a lake behind an old
// bluestone weir, with water pouring over it. Paths loop the water past
// the old quarry rocks, a heritage rotunda, barbecues and a playground.
// Kostas fishes from the bank, the black swans are in charge, and tall
// grass grows thick along the creek. West back along the Upfield bike path
// to Coburg Station, south to Sydney Rd.
import { MapBuilder } from '../MapBuilder.js';

export function buildCoburgLake() {
  const b = new MapBuilder({ id: 'coburglake', w: 44, h: 30, seed: 331 });

  // Merri Creek: in from the top, into the lake, over the weir and out the bottom
  for (let y = 0; y < 30; y++) {
    const cx = 23 + Math.round(Math.sin(y * 0.35) * 2);
    b.fill(cx - 1, y, 3, 1, '~');
  }
  b.ellipse(22, 12, 10.5, 5.5, '~');
  b.ellipse(19, 11, 1.6, 1, '.', '~');
  b.put('tall', 19, 11, { v: 'willowgum' });
  b.put('weir', 19, 18);
  // Footbridges over the creek
  b.fill(19, 3, 9, 1, 'w');
  b.fill(19, 24, 9, 1, 'w');

  // Paths: a loop round the lake, and out to the exits
  b.fill(0, 8, 9, 1, '=');                          // west, to the Upfield path
  b.vline(9, 3, 24, '=').hline(9, 19, 3, '=').hline(27, 36, 3, '=').vline(36, 3, 24, '=');
  b.hline(9, 19, 24, '=').hline(27, 36, 24, '=');
  b.vline(31, 24, 29, '=');                          // south, to Sydney Rd
  b.fill(30, 25, 3, 5, '=');

  // The old quarry face: rocks along the east bank
  [[38, 6], [39, 7], [41, 6], [40, 9], [42, 10], [38, 12]].forEach(([x, y]) => b.put('rock', x, y));
  b.sign(37, 4, ['The old quarry.', 'Bluestone came out of here for a hundred years. Now it is a lake with swans. Not a bad retirement.']);

  // West bank: rotunda, barbecues, picnic tables
  b.put('rotunda', 3, 11);
  b.put('bbq', 4, 16); b.put('picnic', 2, 18); b.put('picnic', 6, 18); b.put('parkbin', 7, 16);
  b.put('shade', 1, 20);
  b.sign(5, 9, ['Coburg Lake Reserve.', 'The weir was built in 1915 to make a swimming hole. People swam here. Ask Kostas. He did.']);

  // East bank: the playground
  b.put('playframe', 38, 15, { v: 'park' }); b.put('slide', 38, 19); b.put('swings', 40, 22);
  b.put('bench', 33, 20); b.put('bench', 12, 6);

  // Trees and reeds
  [[2, 2], [14, 1], [32, 1], [42, 1], [1, 25], [12, 27], [40, 27], [15, 21]].forEach(([x, y]) => b.put('tall', x, y, { v: 'biggum' }));
  [[28, 7], [29, 15], [14, 16], [12, 9]].forEach(([x, y]) => b.put('tall', x, y, { v: 'willowgum' }));
  for (let i = 0; i < 36; i++) {
    const a = i / 36 * Math.PI * 2, x = Math.round(22 + Math.cos(a) * 11.6), y = Math.round(12 + Math.sin(a) * 6.5);
    if (b.get(x, y) === '.' && i % 3 !== 0) b.put('tussock', x, y, { v: i % 2 ? 'a' : 'b' });
  }
  b.ducks(24, 12, 7, 3.5, 4);

  // Tall grass along the creek banks
  b.ellipse(17, 27, 4, 2, '"', '.').ellipse(28, 21, 3, 1.6, '"', '.').ellipse(40, 2, 2.5, 1.5, '"', '.').ellipse(4, 4, 3, 1.5, '"', '.');

  b.npc('kostas', 10, 13, { face: 'right' });

  b.exit(0, 8, 1, 1, 'coburgmall', 'north', 'Coburg Station');
  b.exit(30, 29, 3, 1, 'coburgsyd', 'east', 'Sydney Rd, Coburg');
  b.entry('west', 1, 8, 'right').entry('south', 31, 28, 'up');

  b.forage(17, 27, ['sardine', 'feather']);
  b.forage(41, 13, ['tennis', 'lemon']);
  b.forage(6, 26, ['cheese', 'pide']);
  b.magpies([[11, 22], [35, 9]]);
  b.border(['gum', 'oak', 'gum']);
  b.scatter([0, 0, b.w, b.h], 0.008, [['flowerbed', 2, ['natives', 'mixed']], ['ball', 1, ['soccer', 'beach']], ['bike', 1, ['blue', 'red', 'kids']]], { clearance: 0 });
  return b.finish();
}
