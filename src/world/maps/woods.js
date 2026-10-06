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
  [3, 21, 28, 35].forEach(x => b.put('tall', x, 15, { v: 'pear' }));
  b.put('powerpole', 30, 15);

  // The grey house on the west corner, then the car park running right up
  // to the footpath, and the shops on the Lohse St end.
  b.put('house', 2, 16, { v: 'grey' }); b.fill(6, 19, 2, 6, 'h');
  b.put('ute', 6, 20, { v: 'white' });
  b.fill(9, 15, 14, 10, 'P');
  b.put('car', 10, 16, { v: 'white' }); b.put('car', 14, 16, { v: 'red' }); b.put('car', 18, 19, { v: 'yellow' });
  b.put('car', 11, 22, { v: 'blue' }); b.put('ute', 16, 22, { v: 'silver' });
  b.put('carparksign', 22, 15);
  b.put('shop', 24, 16, { v: 'curry' }); b.put('shop', 29, 16, { v: 'pizza' }); b.put('shop', 33, 16, { v: 'signs' });
  b.fill(23, 19, 16, 1, 'f');
  b.put('bin', 38, 18, { v: 'red' });
  b.put('tall', 26, 22, { v: 'biggum' }); b.put('tall', 34, 22, { v: 'cypress' });

  // Lohse St runs down the east side, all the way along to the Reserve
  b.clear(39, 0, 5, 26);
  b.fill(39, 0, 2, 26, 'f').fill(41, 0, 3, 26, '#').fill(39, 12, 2, 2, '#');   // Woods St runs into it
  b.sign(38, 15, ['Woods St.', 'Lohse St runs along the east end, down past the Reserve. West to Allen St.']);

  b.exit(0, 12, 1, 2, 'allen', 'south', 'Allen St');
  b.exit(43, 0, 1, 26, 'lohse', 'west', 'Lohse St Reserve');
  b.entry('west', 1, 13, 'right').edgeEntry('east', 'y', 42, 0, 25, 'left');

  b.npc('trish', 19, 9, { face: 'down', at: 'woods' });
  b.npc('gordon', 21, 9, { face: 'down', at: 'woods' });
  // The Bin Man and his three bins, out on the nature strip for bin night
  b.put('bin', 36, 15, { v: 'yellow' }); b.put('bin', 37, 15, { v: 'garbage' }); b.put('bin', 38, 15, { v: 'compost' });
  b.npc('binman', 37, 14, { face: 'down' });

  b.lane({ axis: 'x', pos: 12.5, dir: -1, from: -3, to: 47, every: [9, 18], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 13.5, dir: 1, from: -3, to: 47, every: [10, 20], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });

  b.forage(38, 9, ['feather', 'chicken']);
  b.forage(37, 23, ['tennis', 'feather']);
  b.magpies([[25, 15], [30, 23]]);
  b.border(['gum', 'oak', 'gum']);
    b.scatter([37, 1, 2, 9], 0.2, [['tree', 2, ['gum', 'oak']], ['bush', 1, ['green']]]);
  for (let y = 1; y < 25; y++) for (let x = 1; x < 43; x++) if (b.get(x, y) === '.' && b.rand() < 0.05 && !b.occ[y][x]) b.set(x, y, ',');
  // Tall grass for wild encounters
  b.wildGrass(9, 2); b.wildGrass(29, 2); b.wildGrass(30, 23);
  return b.finish();
}
