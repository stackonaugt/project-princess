// FLEMING PARK, Brunswick East. The big oval with its cricket pitch down the
// middle and the gravel ring road around it, the red Vivian Adams Pavilion on
// the Albert St side, the playground and barbecues up the top, and the dog
// off leash area down the bottom end where Trudy walks her greyhound. The
// Merri Creek drain runs along the east edge, which is where the rakali live.
import { MapBuilder } from '../MapBuilder.js';

export function buildFleming() {
  const b = new MapBuilder({ id: 'fleming', w: 46, h: 34, seed: 631 });

  // Albert St across the top, Victoria St across the bottom
  b.fill(0, 0, 46, 2, '#').hline(0, 45, 2, 'f');
  b.fill(0, 31, 46, 2, '#').hline(0, 45, 30, 'f').hline(0, 45, 33, 'f');

  // The oval: mown lawn with a gravel ring path round it
  b.ellipse(21, 16, 16, 11, 'u');
  b.ellipse(21, 16, 15, 10, 'L');
  b.fill(18, 14, 7, 1, 'g');                         // the cricket pitch
  b.sign(21, 27, ['Fleming Park.', 'Cricket in summer, footy in winter, dogs all year round. The oval is not the off leash area. The cricket is firm on this.']);

  // Paths in from Albert St and down to Victoria St
  b.fill(20, 3, 3, 3, 'u').fill(20, 27, 3, 4, 'u').fill(4, 16, 2, 15, 'u');

  // Playground, barbecues and the toilet block, up the Albert St end
  b.put('playframe', 28, 4, { v: 'pink' });
  b.put('slide', 34, 4); b.put('swings', 37, 6);
  b.fill(27, 3, 16, 6, 'm');
  b.put('bbq', 26, 7); b.put('picnic', 24, 7); b.put('picnic', 24, 4);
  b.put('toiletblock', 41, 3);
  b.put('shade', 28, 8);
  b.sign(26, 9, ['Fleming Park playground.', 'Shade sails, a pink slide and a barbecue that works. Bring twenty cents for the barbecue. It is free. Bring it anyway.']);

  // The Vivian Adams Pavilion, on the oval's east side
  b.put('pavilion', 38, 13);
  b.put('bench', 37, 16); b.put('bench', 43, 16);
  b.sign(37, 17, ['The Vivian Adams Pavilion.', 'Home of the local cricket and footy. Inside: pies, a urn, and forty years of premiership photos.']);

  // The dog off leash area, down the bottom end, fenced and full of dogs
  b.fill(8, 24, 14, 5, 'L');
  b.fenceH(8, 21, 23, 'park', [14, 15]).fenceH(8, 21, 29, 'park').fenceV(7, 24, 28, 'park').fenceV(22, 24, 28, 'park');
  b.put('infosign', 14, 23, { v: 'park' });
  b.put('bench', 9, 28); b.put('parkbin', 21, 28);
  b.sign(10, 23, ['Fleming Park Dog Off Leash Area.', 'Off the lead down here, on the lead everywhere else, and never, ever on the cricket pitch.']);

  // The creek drain down the east edge: reeds, water and the rakali
  for (let y = 2; y < 31; y++) { const x = 44 + Math.round(Math.sin(y * 0.4)); b.set(x, y, '~').set(x + 1, y, '~'); }
  for (let y = 4; y < 30; y += 3) { const x = 44 + Math.round(Math.sin(y * 0.4)); if (b.get(x - 1, y) === '.') b.put('reeds', x - 1, y); }

  // Big old elms round the edges, and tall grass in the corners
  [[6, 5], [10, 7], [33, 24], [38, 26], [13, 12], [8, 20], [30, 29], [3, 10]].forEach(([x, y]) => b.put('tall', x, y, { v: 'biggum' }));
  b.wildGrass(8, 11, 3, 2); b.wildGrass(32, 27, 3.5, 1.6); b.wildGrass(41, 23, 2.5, 2); b.wildGrass(14, 5, 3, 1.4);

  // Along the bottom: the west half back to Nicholson St, the east half to the bowls club
  b.exit(0, 2, 1, 2, 'ebnicholson', 'north', 'Nicholson St');
  b.exit(0, 33, 23, 1, 'ebnicholson', 'north', 'Nicholson St');
  b.exit(45, 30, 1, 4, 'bowls', 'southwest', 'Brunswick Bowls Club');   // east along the road at the bottom right
  b.entry('nicholson', 2, 2, 'down').edgeEntry('south', 'x', 32, 0, 45, 'up').entry('bowls', 44, 33, 'left')
    .entry('south', 21, 4, 'down');

  b.npc('michael', 15, 26, { face: 'down' });

  b.lane({ axis: 'x', pos: 0.5, dir: -1, from: -3, to: 49, every: [12, 24], speed: 56, kinds: ['veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 31.5, dir: 1, from: -3, to: 49, every: [12, 24], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-red'] });

  b.forage(9, 12, ['tennis', 'feather']);
  b.forage(33, 28, ['carrot', 'chicken']);
  b.forage(42, 24, ['sardine', 'feather']);
  b.magpies([[18, 20], [36, 9]]);
  b.border(['oak', 'gum', 'oak']);
  b.scatter([0, 0, b.w, b.h], 0.01, [['ball', 1, ['soccer', 'beach']], ['bike', 1, ['blue', 'red', 'kids']]], { clearance: 0 });
  return b.finish();
}
