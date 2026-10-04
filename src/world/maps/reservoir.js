// RESERVOIR: the north. Edwardes Lake, weatherboards with lemon trees,
// Broadway and the milk bar, the Mernda line, and a community garden
// waiting for farming to arrive.
import { MapBuilder } from '../MapBuilder.js';

export function buildReservoir() {
  const b = new MapBuilder({ id: 'reservoir', w: 48, h: 34, seed: 33 });

  // Edwardes Lake with its walking loop
  const LX = 14, LY = 8.2;
  b.ellipse(LX, LY, 12.4, 7.2, '=');
  b.ellipse(LX, LY, 11.2, 6.1, '.');
  b.ellipse(LX, LY, 9.6, 5.0, 's');
  b.ellipse(LX, LY, 8.6, 4.2, '~');
  b.ellipse(LX + 3, LY - 0.5, 1.6, 0.9, '.', '~');          // a little island
  b.put('tree', LX + 3, Math.round(LY - 0.5), { v: 'oak' });
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * Math.PI * 2 + 0.2;
    const x = Math.round(LX + Math.cos(a) * 9.1), y = Math.round(LY + Math.sin(a) * 4.7);
    if (b.get(x, y) === 's' && i % 3 !== 0) b.put('reeds', x, y);
  }
  b.ducks(LX, LY, 6.5, 3, 4);
  b.put('bench', 4, 8); b.put('bench', 24, 3); b.put('lamp', 3, 12); b.put('lamp', 26, 12);
  b.sign(11, 15, ['Edwardes Lake.', 'Please do not feed the ducks bread. They are on a diet. (They are not on a diet.)']);

  // Mernda line and Reservoir station
  b.vline(38, 0, 33, 'r').vline(39, 0, 33, 'r');
  b.fill(40, 6, 4, 9, 'p');
  b.put('shelter', 41, 7, { v: 'reservoir' });
  b.put('myki', 40, 9, { travel: true });
  b.put('lamp', 43, 13);
  b.sign(44, 14, ['Reservoir Station. Mernda line.', 'Tap your myki at the reader to catch a train.']);

  // Broadway, crossing the line
  b.fill(0, 17, 48, 2, '#').hline(1, 46, 16, 'f').hline(1, 46, 19, 'f');
  b.fill(38, 16, 2, 4, 'x');
  b.fill(44, 15, 1, 1, 'f');

  // Milk bar east of the line
  b.put('shop', 41, 20, { v: 'milk bar' });
  b.fill(40, 23, 7, 1, 'f');
  b.put('bin', 45, 22, { v: 'red' }); b.put('lamp', 40, 22);
  b.put('shop', 41, 26, { v: 'bakery' });
  b.fill(40, 29, 7, 1, 'f');

  // Gilbert Rd, south to Brunswick
  b.fill(22, 19, 2, 15, '#').vline(21, 20, 32, 'f').vline(24, 20, 32, 'f');

  // Weatherboards, picket fences and lemon trees
  const colours = ['cream', 'blue', 'mint', 'lemon'];
  [2, 7, 12, 17].forEach((x, i) => b.put('weatherboard', x, 20, { v: colours[i] }));
  b.fenceH(1, 20, 24, 'picket', [4, 9, 14, 19]);
  b.hline(1, 20, 25, 'f');
  [2, 7, 12, 17].forEach((x, i) => b.put('weatherboard', x, 27, { v: colours[(i + 2) % 4] }));
  b.fenceH(1, 20, 31, 'picket', [4, 9, 14, 19]);
  [6, 11, 16].forEach(x => { b.put('tree', x, 23, { v: 'lemon' }); b.put('tree', x, 30, { v: 'lemon' }); });
  b.put('letterbox', 1, 23, { v: 'metal' }); b.put('letterbox', 20, 30, { v: 'metal' });
  b.put('bush', 3, 23, { v: 'hydrangea' }); b.put('bush', 13, 23, { v: 'rose' }); b.put('bush', 8, 30, { v: 'rose' });
  b.put('bin', 5, 26, { v: 'yellow' }); b.put('bin', 15, 26, { v: 'red' }); b.put('lamp', 10, 26);
  b.reserve(10, 25.5, 2);

  // Community garden (farming will grow from here)
  b.fenceH(26, 36, 21, 'picket', [31]).fenceH(26, 36, 32, 'picket').fenceV(26, 22, 31, 'picket').fenceV(36, 22, 31, 'picket');
  b.fill(27, 22, 9, 10, 'g');
  [[28, 23], [32, 23], [28, 26], [32, 26], [28, 29], [32, 29]].forEach(([x, y], i) => {
    b.fill(x, y, 3, 2, 'd');
    if (i < 4) for (let j = 0; j < 2; j++) for (let k = 0; k < 3; k++) if ((k + j + i) % 2 === 0) b.put('crops', x + k, y + j, { v: ['sprout', 'leafy', 'flower', 'leafy'][i] });
  });
  b.put('tank', 35, 23); b.put('bench', 33, 31);
  b.sign(30, 20, ['Reservoir Community Garden.', 'Plots opening soon! Bring a hat and a good attitude about snails.']);

  // Lakeside park, north-east
  b.ellipse(31, 4, 4, 2.2, '"', '.');
  b.put('picnic', 28, 9); b.put('picnic', 33, 12); b.put('bbq', 31, 9); b.put('bin', 35, 9, { v: 'red' });
  b.reserve(30, 10, 3.5);

  // Signs and edges
  b.sign(21, 15, ['Broadway.', 'South: Brunswick, via Gilbert Rd.']);
  b.sign(1, 15, ['Coburg North: coming soon.', 'Somebody has taped a note to the sign: "Not today."']);
  b.sign(46, 20, ['Plenty Rd: CLOSED.', 'Level crossing removal works. Expected completion: 2031. Probably.']);
  b.exit(0, 17, 1, 2, null, null, 'Coburg North', ['The road west is blocked by roadworks.', 'A man in a hi-vis vest gives you a thumbs up. You give him one back. Nothing changes.']);
  b.exit(47, 17, 1, 2, null, null, 'Plenty Rd', ['Plenty Rd is closed for level crossing removal works.', 'The new skyrail will be lovely. Eventually.']);
  b.exit(22, 33, 2, 1, 'brunswick', 'north', 'Brunswick');

  b.entry('station', 42, 11, 'left').entry('south', 23, 32, 'up');

  b.forage(32, 4, ['tennis', 'feather']);
  b.forage(44, 3, ['chicken', 'sardine']);
  b.forage(26, 13, ['tennis', 'ribbon']);
  b.forage(3, 2, ['feather', 'carrot']);
  b.forage(45, 31, ['cheese', 'chicken']);

  b.npc('pina', 9, 23, { face: 'down' });
  b.npc('dimitri', 43, 23, { face: 'down' });
  b.npc('wen', 31, 25, { face: 'down' });
  const loop = []; for (let i = 0; i < 16; i++) { const a = -i / 16 * Math.PI * 2; loop.push([LX + Math.cos(a) * 11.8, LY + Math.sin(a) * 6.65]); }
  b.npc('kez', loop[0][0], loop[0][1], { path: loop, speed: 46 });

  b.lane({ axis: 'x', pos: 17.5, dir: -1, from: -3, to: 51, every: [7, 15], speed: 62, kinds: ['veh-car-h-white', 'veh-car-h-red', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 18.5, dir: 1, from: -3, to: 51, every: [8, 16], speed: 62, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });
  b.lane({ axis: 'y', pos: 38.5, dir: 1, from: -14, to: 48, every: [40, 65], speed: 120, kinds: ['veh-train-v'], train: true });
  b.lane({ axis: 'y', pos: 39.5, dir: -1, from: -14, to: 48, every: [45, 70], speed: 120, kinds: ['veh-train-v'], train: true });

  b.magpies([[29, 6], [5, 15], [44, 32]]);

  b.border(['oak', 'gum', 'palm', 'pine']);
  b.scatter([26, 1, 11, 15], 0.12, [['tree', 3, ['oak', 'gum', 'palm']], ['bush', 2, ['green', 'berry']]]);
  b.scatter([1, 1, 25, 15], 0.06, [['tree', 3, ['oak', 'gum', 'fruit']], ['bush', 2, ['green', 'rose']]], { clearance: 0, on: '.' });
  b.scatter([40, 1, 7, 5], 0.2, [['tree', 2, ['gum', 'oak']], ['bush', 1, ['green']]]);
  b.scatter([25, 20, 1, 13], 0.3, [['bush', 1, ['green', 'berry']]], { clearance: 0 });
  b.scatter([37, 20, 1, 13], 0.3, [['bush', 1, ['green', 'berry']]], { clearance: 0 });
  for (let y = 1; y < 33; y++) for (let x = 1; x < 47; x++) if (b.get(x, y) === '.' && b.rand() < 0.08 && !b.occ[y][x]) b.set(x, y, ',');
  return b.finish();
}
