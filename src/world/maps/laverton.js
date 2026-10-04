// LAVERTON: the west. Werribee train line, Laverton Creek, industrial sheds,
// a quiet court of brick veneers (Princess's turf) and the hardware barn
// with its eternal sausage sizzle.
import { MapBuilder } from '../MapBuilder.js';

export function buildLaverton() {
  const b = new MapBuilder({ id: 'laverton', w: 48, h: 34, seed: 11 });

  // Werribee line across the north, with a level crossing at x=40
  b.hline(1, 46, 4, 'r').hline(1, 46, 5, 'r');
  b.fill(40, 1, 2, 16, '#').fill(40, 4, 2, 2, 'x');
  b.fill(22, 6, 14, 2, 'p');                               // station platform
  b.fill(22, 8, 2, 8, 'f');                                // footpath down to Aviation Rd

  // Aviation Rd and its footpaths, east to Brunswick
  b.fill(10, 17, 38, 2, '#').hline(10, 47, 16, 'f').hline(10, 47, 19, 'f');
  b.fill(40, 16, 2, 1, '#');
  b.fill(1, 17, 9, 2, '=');                                // creek trail heading west

  // Laverton Creek, meandering north to south, bridged by the trail
  for (let y = 7; y < 33; y++) {
    const cx = 6 + Math.round(Math.sin(y * 0.45) * 1.5);
    const c = y === 17 || y === 18 ? 'w' : '~';
    b.set(cx, y, c).set(cx + 1, y, c);
    if (c === '~' && b.rand() < 0.35) b.put('reeds', cx + (b.rand() < 0.5 ? -1 : 2), y);
  }
  b.ellipse(3, 25, 2.5, 5, '"', '.').ellipse(14, 12, 3, 2, '"', '.').ellipse(8, 2, 6, 1.4, '"', '.');

  // North strip: an old training plane on display
  b.put('plane', 18, 1);
  b.sign(23, 2, ['An old air force training plane, retired with honours.', 'Laverton has been an air force town for about a hundred years. The planes are quieter now.']);

  // Station
  b.put('shelter', 28, 6, { v: 'laverton' });
  b.put('myki', 32, 6, { travel: true });
  b.put('bench', 25, 6);
  b.put('lamp', 35, 7);
  b.sign(24, 7, ['Laverton Station. Werribee line.', 'Tap your myki at the reader to catch a train to anywhere you have already been.']);

  // Industrial yards north of Aviation Rd
  b.fill(25, 8, 15, 8, 'c').fill(42, 8, 5, 8, 'c');
  b.put('shed', 26, 8, { v: 'grey' });
  b.put('shed', 33, 8, { v: 'blue' });
  b.put('container', 26, 13, { v: 'red' });
  b.put('container', 30, 13, { v: 'blue' });
  b.put('container', 34, 14, { v: 'orange' });
  b.put('container', 43, 8, { v: 'green' });
  b.put('car', 43, 13, { v: 'white' });
  b.put('trolley', 38, 12);
  b.put('bin', 39, 8, { v: 'yellow' });
  b.put('lamp', 24, 15);

  // The court (Princess patrols here)
  b.fill(19, 19, 2, 9, '#').ellipse(19.5, 28.5, 3.2, 2.6, '#');
  b.fill(18, 20, 1, 6, 'f').fill(21, 20, 1, 6, 'f');
  b.put('brickhouse', 13, 20, { v: 'tan' });
  b.put('brickhouse', 13, 26, { v: 'red' });
  b.put('brickhouse', 23, 20, { v: 'red' });
  b.put('brickhouse', 23, 26, { v: 'tan' });
  b.fenceH(11, 16, 24, 'colorbond').fenceH(23, 28, 24, 'colorbond');
  b.fenceV(11, 20, 23, 'colorbond').fenceV(28, 20, 23, 'colorbond');
  b.put('letterbox', 17, 21, { v: 'brick' });
  b.put('letterbox', 17, 26, { v: 'brick' });
  b.put('letterbox', 22, 21, { v: 'metal' });
  b.put('letterbox', 22, 26, { v: 'brick' });
  b.put('bin', 12, 25, { v: 'red' }); b.put('bin', 27, 25, { v: 'green' });
  b.put('bush', 16, 23, { v: 'rose' }); b.put('bush', 26, 23, { v: 'hydrangea' });
  b.put('lamp', 18, 26);
  b.sign(17, 19, ['Kookaburra Court. No through road.', 'Someone has added in texta: BEWARE OF THE POODLE.']);
  b.reserve(19.5, 24, 3);

  // Hardware barn, car park and the sizzle
  b.put('warehouse', 35, 20);
  b.fill(31, 24, 16, 8, 'c').fill(43, 19, 4, 5, 'c');
  b.put('sizzle', 32, 22);
  b.put('bin', 34, 22, { v: 'red' });
  ['white', 'red', 'silver', 'blue', 'yellow', 'white'].forEach((v, i) => b.put('car', [33, 37, 41, 33, 39, 43][i], i < 3 ? 26 : 29, { v }));
  b.put('trolley', 45, 25); b.put('trolley', 31, 30); b.put('trolley', 36, 31);
  b.put('lamp', 46, 28); b.put('lamp', 31, 27);
  b.sign(30, 21, ['Sausage sizzle today!', 'Underneath, smaller: "every day, forever".']);

  // Signs and edges
  b.sign(11, 15, ['Laverton Creek Trail.', 'Watch for snakes in summer and magpies in spring. Watch for poodles always.']);
  b.sign(46, 15, ['Aviation Rd.', 'East: Brunswick, via the West Gate. Bring snacks.']);
  b.sign(1, 16, ['Werribee: coming soon.', 'The trail is closed past here. Something about a very large goose.']);
  b.exit(0, 17, 1, 2, null, null, 'Werribee', ['The trail to Werribee is closed for now.', 'A very large goose is standing in the middle of it, daring you.']);
  b.exit(47, 17, 1, 2, 'brunswick', 'west', 'Brunswick');

  b.entry('station', 31, 7, 'down').entry('east', 46, 18, 'left').entry('start', 31, 7, 'down');

  // Treats that appear each day
  b.forage(3, 24, ['feather', 'chicken']);
  b.forage(14, 11, ['ribbon', 'chicken']);
  b.forage(45, 14, ['tennis', 'sardine']);
  b.forage(10, 2, ['feather', 'carrot']);
  b.forage(29, 30, ['ribbon', 'cheese']);

  b.npc('gaz', 33, 23, { face: 'down' });
  b.npc('marisol', 42, 11, { face: 'left' });
  b.npc('commuter', 26, 7, { face: 'down' });

  // Traffic
  b.lane({ axis: 'x', pos: 17.5, dir: -1, from: -3, to: 51, every: [6, 14], speed: 64, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h', 'veh-car-h-blue'] });
  b.lane({ axis: 'x', pos: 18.5, dir: 1, from: -3, to: 51, every: [7, 15], speed: 64, kinds: ['veh-car-h-blue', 'veh-ute-h', 'veh-car-h-white'] });
  b.lane({ axis: 'x', pos: 4.5, dir: 1, from: -12, to: 60, every: [35, 60], speed: 120, kinds: ['veh-train-h'], train: true });
  b.lane({ axis: 'x', pos: 5.5, dir: -1, from: -12, to: 60, every: [40, 70], speed: 120, kinds: ['veh-train-h'], train: true });

  b.magpies([[14, 13], [27, 3], [4, 30], [29, 22]]);

  // Greenery
  b.border(['gum', 'gum', 'oak', 'pine']);
  b.scatter([1, 7, 9, 26], 0.22, [['tree', 4, ['gum', 'gum', 'oak']], ['bush', 2, ['green', 'berry']], ['rock', 1]]);
  b.scatter([10, 8, 12, 8], 0.1, [['tree', 3, ['gum', 'oak']], ['bush', 2, ['green', 'berry']], ['rock', 1]]);
  b.scatter([1, 1, 46, 3], 0.08, [['tree', 2, ['gum', 'pine']], ['bush', 1, ['green']]]);
  b.scatter([10, 29, 20, 4], 0.12, [['tree', 2, ['gum', 'oak']], ['bush', 2, ['green', 'rose']]]);
  b.scatter([1, 1, 46, 32], 0.03, [['bush', 1, ['green']]]);
  for (let y = 1; y < 33; y++) for (let x = 1; x < 47; x++) if (b.get(x, y) === '.' && b.rand() < 0.06 && !b.occ[y][x]) b.set(x, y, ',');
  return b.finish();
}
