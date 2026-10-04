// EDGARS CREEK WETLANDS: a reedy pond and the creek winding south, the
// 1st Reservoir Scout hall with its car park and log barriers, and the
// community garden (farming will grow from here). Easy to get lost.
import { MapBuilder } from '../MapBuilder.js';

export function buildWetlands() {
  const b = new MapBuilder({ id: 'wetlands', w: 44, h: 30, seed: 191 });

  // Leamington St across the top
  b.fill(0, 0, 44, 2, '#').hline(0, 43, 2, 'f');

  // The pond and the creek
  b.ellipse(30, 10, 7, 5.5, '~');
  for (let y = 14; y < 30; y++) { const x = 30 + Math.round(Math.sin(y * 0.5) * 2); b.set(x, y, '~').set(x + 1, y, '~'); }
  for (let i = 0; i < 36; i++) {
    const a = i / 36 * Math.PI * 2, x = Math.round(30 + Math.cos(a) * 8.2), y = Math.round(10 + Math.sin(a) * 6.6);
    if (b.get(x, y) === '.') b.put('tussock', x, y, { v: i % 2 ? 'a' : 'b' });
  }
  for (let y = 15; y < 29; y += 2) { const x = 30 + Math.round(Math.sin(y * 0.5) * 2); if (b.get(x - 1, y) === '.') b.put('tussock', x - 1, y); if (b.get(x + 2, y) === '.') b.put('tussock', x + 2, y, { v: 'b' }); }
  b.ducks(30, 10, 5, 3.5, 3);

  // Winding gravel paths, a little bridge over the creek
  b.fill(0, 8, 14, 2, 'u').fill(12, 8, 2, 14, 'u').fill(12, 20, 28, 2, 'u').fill(18, 20, 3, 10, 'u').fill(38, 3, 2, 18, 'u');
  for (let x = 28; x < 34; x++) if (b.get(x, 20) === '~' || b.get(x, 21) === '~') { b.set(x, 20, 'w').set(x, 21, 'w'); }
  b.sign(36, 22, ['Edgars Creek Wetlands.', 'Frogs, reeds and a lot of paths that look exactly the same. Keep the creek on your left. Or right.']);

  // Scout hall and its car park
  b.put('clubhouse', 1, 12, { v: 'scouts' });
  b.fill(1, 14, 10, 4, 'P');
  b.put('car', 2, 15, { v: 'white' }); b.put('car', 6, 15, { v: 'blue' });
  b.fenceH(1, 10, 18, 'log', [5, 6]);
  b.put('rock', 11, 15); b.put('rock', 11, 17);

  // Community garden
  b.fenceH(2, 10, 21, 'picket', [6]).fenceH(2, 10, 28, 'picket').fenceV(2, 22, 27, 'picket').fenceV(10, 22, 27, 'picket');
  b.fill(3, 22, 7, 6, 'g');
  [[3, 23], [7, 23], [3, 26], [7, 26]].forEach(([x, y], i) => {
    b.fill(x, y, 2, 2, 'd');
    for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) if ((j + k + i) % 2 === 0) b.put('crops', x + k, y + j, { v: ['sprout', 'leafy', 'flower', 'leafy'][i] });
  });
  b.put('tank', 9, 22);
  b.sign(5, 20, ['Reservoir Community Garden.', 'Plots opening soon! Bring a hat and a good attitude about snails.']);

  // Bush everywhere
  b.ellipse(20, 6, 5, 3, '"', '.').ellipse(41, 26, 3, 3, '"', '.').ellipse(24, 26, 4, 3, '"', '.').ellipse(6, 4, 4, 1.5, '"', '.');
  [[17, 13], [22, 15], [36, 4], [41, 14], [25, 4], [15, 26], [37, 27]].forEach(([x, y]) => b.put('tall', x, y, { v: 'biggum' }));
  b.put('pylon', 2, 3);

  b.exit(0, 8, 1, 2, 'lake', 'east', 'Edwardes Lake');
  b.exit(18, 29, 3, 1, 'lakepark', 'north', 'Lake Park');
  b.entry('west', 1, 9, 'right').entry('south', 19, 27, 'up');

  b.npc('wen', 6, 24, { face: 'down' });

  b.lane({ axis: 'x', pos: 0.5, dir: -1, from: -3, to: 47, every: [10, 20], speed: 56, kinds: ['veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 1.5, dir: 1, from: -3, to: 47, every: [11, 21], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-red'] });

  b.forage(20, 6, ['feather', 'carrot']);
  b.forage(41, 26, ['sardine', 'feather']);
  b.forage(24, 26, ['lemon', 'carrot']);
  b.magpies([[16, 17], [35, 17]]);
  b.border(['gum', 'gum', 'oak']);
  b.scatter([13, 3, 30, 26], 0.06, [['tree', 2, ['gum']], ['bush', 3, ['green', 'berry']]]);
  return b.finish();
}
