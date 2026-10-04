// BRUNSWICK: inner north. Sydney Rd with the 19 tram, the Upfield line and
// bike path, terraces, bluestone laneways, cafes and a park (Spooky's haunt).
import { MapBuilder } from '../MapBuilder.js';

export function buildBrunswick() {
  const b = new MapBuilder({ id: 'brunswick', w: 48, h: 34, seed: 22 });

  // Upfield line, its station and the bike path
  b.vline(10, 0, 33, 'r').vline(11, 0, 33, 'r');
  b.fill(6, 9, 4, 8, 'p').fill(6, 17, 4, 2, 'f');
  b.vline(12, 1, 32, '=');

  // Sydney Rd: footpath, road, two tram tracks, road, footpath
  b.vline(22, 0, 33, 'f').vline(23, 0, 33, '#').vline(24, 0, 33, '+').vline(25, 0, 33, '+').vline(26, 0, 33, '#').vline(27, 0, 33, 'f');

  // Dawson St, west to Laverton, with a level crossing
  b.fill(0, 20, 23, 2, '#').hline(1, 21, 19, 'f').hline(1, 21, 22, 'f');
  b.fill(10, 19, 2, 4, 'x');

  // West block of terraces and laneways
  const row = (y, vs) => [13, 16, 19].forEach((x, i) => b.put('terrace', x, y, { v: vs[i] }));
  row(1, ['brick', 'cream', 'sage']);
  b.hline(13, 21, 4, ',').fenceH(13, 21, 5, 'picket', [14, 17, 20]);
  b.fill(13, 6, 9, 2, 'b');
  b.put('mural', 13, 8, { v: 'a' }); b.put('crate', 18, 8, { v: 'blue' }); b.put('bin', 21, 8, { v: 'red' }); b.put('bin', 20, 8, { v: 'yellow' });
  row(9, ['sand', 'brick', 'cream']);
  b.hline(13, 21, 12, ',').fenceH(13, 21, 13, 'picket', [14, 17, 20]);
  b.fill(13, 14, 9, 2, 'b');                               // Salami's lane
  b.put('crate', 13, 15, { v: 'red' }); b.put('crate', 21, 14, { v: 'blue' });
  row(16, ['cream', 'sage', 'brick']);
  row(23, ['sage', 'brick', 'sand']);
  b.fill(13, 26, 9, 2, 'b');
  b.put('crate', 15, 26, { v: 'blue' }); b.put('bin', 21, 27, { v: 'red' });
  row(28, ['brick', 'cream', 'brick']);
  b.reserve(17, 14.5, 2);

  // East of Sydney Rd: shops, cafe tables, laneway murals
  b.put('cafe', 28, 1); b.put('shop', 32, 1, { v: 'records' }); b.put('shop', 36, 1, { v: 'pho' }); b.put('shop', 40, 1, { v: 'books' });
  b.fill(28, 4, 19, 2, 'f');
  b.put('table', 29, 4); b.put('table', 31, 4); b.put('tramstop', 27, 3);
  b.fill(28, 6, 19, 2, 'b');
  b.put('mural', 29, 8, { v: 'b' }); b.put('mural', 34, 8, { v: 'a' });
  b.put('terrace', 39, 8, { v: 'sage' }); b.put('terrace', 42, 8, { v: 'cream' });
  b.put('bin', 33, 8, { v: 'green' }); b.put('crate', 38, 8, { v: 'red' });
  b.fill(28, 12, 1, 22, 'f');

  // The park
  b.fenceH(29, 46, 13, 'park', [35, 36]);
  b.fenceV(29, 13, 32, 'park', [20, 21]);
  b.hline(30, 45, 20, '=').hline(30, 45, 21, '=');
  b.vline(35, 14, 31, '=').vline(36, 14, 31, '=');
  b.fill(30, 15, 5, 4, 'm');
  b.put('swings', 30, 17); b.put('slide', 33, 15);
  b.ellipse(41.5, 27, 4.2, 3.2, '~');
  b.ellipse(41.5, 27, 5.2, 4.2, ',', '.');
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; b.put('reeds', Math.round(41.5 + Math.cos(a) * 4.8), Math.round(27 + Math.sin(a) * 3.8)); }
  b.put('bench', 31, 22); b.put('bench', 38, 19); b.put('picnic', 31, 26); b.put('picnic', 31, 30);
  b.put('bin', 34, 22, { v: 'red' }); b.put('lamp', 37, 22); b.put('lamp', 34, 19); b.put('lamp', 44, 19);
  b.ducks(41.5, 27, 3, 2, 3);
  b.reserve(40, 22.5, 2.5);
  b.sign(33, 14, ['Randall Park.', 'Dogs on leads. Cats on whatever they like. Rabbits: unclear.']);

  // West strip beyond the railway
  b.put('shelter', 6, 10, { v: 'brunswick' });
  b.put('myki', 9, 10, { travel: true });
  b.put('lamp', 6, 15); b.put('bench', 7, 13);
  b.ellipse(3, 27, 2.6, 4, '"', '.').ellipse(3, 4, 2.4, 3, '"', '.');

  // Signs
  b.sign(5, 18, ['Brunswick Station. Upfield line.', 'Tap your myki at the reader to catch a train.']);
  b.sign(1, 23, ['Dawson St.', 'West: Laverton. A long way, but you have good shoes.']);
  b.sign(21, 32, ['Sydney Rd.', 'North: Coburg and Reservoir. South: the city (not yet).']);
  b.exit(0, 20, 1, 2, 'laverton', 'east', 'Laverton');
  b.exit(22, 0, 6, 1, 'reservoir', 'south', 'Reservoir');
  b.exit(22, 33, 6, 1, null, null, 'The city', ['The 19 tram to the city is replaced by buses this weekend.', 'And next weekend. The city will have to wait.']);

  b.entry('station', 8, 12, 'right').entry('west', 1, 21, 'right').entry('north', 22, 1, 'down');

  b.forage(3, 4, ['feather', 'carrot']);
  b.forage(19, 27, ['sardine', 'feather']);
  b.forage(44, 31, ['tennis', 'carrot']);
  b.forage(38, 24, ['ribbon', 'carrot']);
  b.forage(2, 28, ['carrot', 'chicken']);
  b.forage(45, 7, ['sardine', 'cheese']);

  b.npc('jules', 33, 5, { face: 'down' });
  b.npc('busker', 22, 11, { face: 'right' });
  b.npc('priya', 33, 21, { path: [[33, 21], [45, 21], [36, 21], [36, 30], [36, 15], [36, 21]] });

  b.lane({ axis: 'y', pos: 24.5, dir: 1, from: -6, to: 40, every: [25, 45], speed: 52, kinds: ['veh-tram'], tram: true });
  b.lane({ axis: 'y', pos: 25.5, dir: -1, from: -6, to: 40, every: [30, 50], speed: 52, kinds: ['veh-tram'], tram: true });
  b.lane({ axis: 'y', pos: 23.5, dir: 1, from: -3, to: 37, every: [7, 15], speed: 60, kinds: ['veh-car-v-yellow', 'veh-car-v-silver'] });
  b.lane({ axis: 'y', pos: 26.5, dir: -1, from: -3, to: 37, every: [8, 16], speed: 60, kinds: ['veh-car-v-silver', 'veh-car-v-yellow'] });
  b.lane({ axis: 'y', pos: 12.5, dir: 1, from: -2, to: 36, every: [12, 26], speed: 72, kinds: ['veh-bike-v'] });
  b.lane({ axis: 'y', pos: 10.5, dir: -1, from: -14, to: 48, every: [40, 65], speed: 120, kinds: ['veh-train-v'], train: true });
  b.lane({ axis: 'y', pos: 11.5, dir: 1, from: -14, to: 48, every: [45, 70], speed: 120, kinds: ['veh-train-v'], train: true });

  b.magpies([[3, 12], [40, 16], [44, 30]]);

  b.border(['oak', 'oak', 'fruit', 'pine']);
  b.scatter([1, 1, 9, 32], 0.18, [['tree', 3, ['oak', 'gum', 'fruit']], ['bush', 2, ['green', 'rose', 'berry']]]);
  b.scatter([30, 14, 17, 19], 0.12, [['tree', 4, ['oak', 'oak', 'fruit', 'pine']], ['bush', 2, ['rose', 'hydrangea', 'green']]], { clearance: 0 });
  b.scatter([13, 31, 9, 2], 0.3, [['bush', 1, ['rose', 'hydrangea']]], { clearance: 0 });
  for (let y = 1; y < 33; y++) for (let x = 1; x < 47; x++) if (b.get(x, y) === '.' && b.rand() < 0.1 && !b.occ[y][x]) b.set(x, y, ',');

  return b.finish();
}
