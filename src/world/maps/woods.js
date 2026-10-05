// WOODS ST: Helen and Paddy's old place, now home to Trish and Gordon.
// A long row of two-storey brick units with low cream fences and
// agapanthus, ornamental pears on the nature strip, and the shops on the
// corner of Lohse St.
import { MapBuilder } from '../MapBuilder.js';

export function buildWoods() {
  const b = new MapBuilder({ id: 'woods', w: 44, h: 26, seed: 71 });

  // Woods St and its footpaths
  b.fill(0, 12, 44, 2, '#').hline(0, 43, 11, 'f').hline(0, 43, 14, 'f');

  // The units. Number 72 has the colourful tiles.
  const row = ['endL', 'left', 'right', 'mural', 'left', 'right', 'endR'];
  row.forEach((v, i) => b.put('unit', 2 + i * 5, 6, { v }));
  b.fill(1, 9, 37, 1, '.');
  // front gardens: low cream fences with gaps for the paths
  const gates = [2, 7, 15, 17, 22, 30, 35];       // a gate in front of each front door
  b.fenceH(1, 37, 10, 'metal', gates);
  gates.forEach(x => b.set(x, 9, 'h').set(x, 10, 'h'));
  [4, 5, 9, 10, 12, 13, 24, 26, 28, 33, 36].forEach((x, i) => b.put('agapanthus', x, 9, { v: i % 4 === 3 ? 'white' : 'purple' }));
  b.put('bin', 14, 9, { v: 'red' }); b.put('bin', 23, 9, { v: 'yellow' }); b.put('bin', 31, 9, { v: 'green' });
  b.sign(16, 9, ['72 Woods St.', "Helen and Paddy's old place. Trish and Gordon live here now, and the agapanthus have never been happier."]);

  // Nature strip trees
  [3, 10, 21, 28, 35, 41].forEach(x => b.put('tall', x, 15, { v: 'pear' }));
  b.put('powerpole', 8, 15); b.put('powerpole', 30, 15);

  // Shops on the corner, with a car park
  b.put('shop', 1, 16, { v: 'curry' }); b.put('shop', 6, 16, { v: 'pizza' }); b.put('shop', 10, 16, { v: 'signs' });
  b.fill(0, 19, 15, 1, 'f');
  b.fill(0, 20, 15, 5, 'P');
  b.put('car', 2, 21, { v: 'white' }); b.put('car', 8, 21, { v: 'red' }); b.put('ute', 11, 23, { v: 'silver' });
  b.put('bin', 14, 18, { v: 'red' });
  b.put('carparksign', 14, 20);

  // Across the road: the car park carries on, and a house
  b.fill(15, 19, 9, 1, 'f').fill(15, 20, 9, 5, 'P');
  b.put('car', 17, 21, { v: 'yellow' }); b.put('car', 20, 23, { v: 'blue' });
  b.put('house', 27, 16, { v: 'grey' }); b.fill(31, 19, 2, 6, 'h');
  b.put('ute', 31, 20, { v: 'white' });
  b.put('tall', 25, 22, { v: 'biggum' }); b.put('tall', 40, 18, { v: 'biggum' }); b.put('tall', 36, 22, { v: 'cypress' });
  b.sign(42, 15, ['Woods St.', 'East to Lohse St Reserve. West to Allen St.']);

  b.exit(0, 12, 1, 2, 'allen', 'south', 'Allen St');
  b.exit(43, 12, 1, 2, 'lohse', 'north', 'Lohse St Reserve');
  b.entry('west', 1, 13, 'right').entry('east', 42, 13, 'left');

  b.npc('trish', 19, 9, { face: 'down' });
  b.npc('gordon', 21, 9, { face: 'down' });
  // The Bin Man and his three bins, out on the nature strip for bin night
  b.put('bin', 37, 15, { v: 'yellow' }); b.put('bin', 38, 15, { v: 'garbage' }); b.put('bin', 39, 15, { v: 'compost' });
  b.npc('binman', 38, 14, { face: 'down' });

  b.lane({ axis: 'x', pos: 12.5, dir: -1, from: -3, to: 47, every: [9, 18], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 13.5, dir: 1, from: -3, to: 47, every: [10, 20], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });

  b.forage(38, 9, ['feather', 'chicken']);
  b.forage(31, 22, ['tennis', 'feather']);
  b.magpies([[37, 15], [22, 22]]);
  b.border(['gum', 'oak', 'gum']);
  b.scatter([19, 17, 24, 8], 0.08, [['bush', 2, ['green', 'berry']], ['tree', 1, ['gum']]]);
  b.scatter([37, 1, 6, 9], 0.2, [['tree', 2, ['gum', 'oak']], ['bush', 1, ['green']]]);
  for (let y = 1; y < 25; y++) for (let x = 1; x < 43; x++) if (b.get(x, y) === '.' && b.rand() < 0.05 && !b.occ[y][x]) b.set(x, y, ',');
  // Tall grass for wild encounters
  b.wildGrass(9, 2); b.wildGrass(29, 2); b.wildGrass(36, 21);
  return b.finish();
}
