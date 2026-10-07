// LOHSE ST RESERVE: around the corner from Woods St. Sandy paths under big
// gums, a playground, the black toilet block with its shade roof, an arched
// picnic shelter, and Maher Rd with the crossing to the station.
import { MapBuilder } from '../MapBuilder.js';
import { state } from '../../systems/state.js';

export function buildLohse() {
  const b = new MapBuilder({ id: 'lohse', w: 40, h: 28, seed: 81 });

  // Streets: Lohse St down the west side, Maher Rd along the bottom
  b.fill(0, 0, 3, 24, '#').vline(3, 0, 23, 'f');
  b.fill(0, 24, 40, 2, '#').hline(3, 39, 23, 'f').hline(0, 39, 26, 'f');
  b.fill(18, 24, 2, 2, 'z');
  b.fill(0, 27, 40, 1, 'f');   // the footpath along the bottom, no trees in the way

  // Sandy paths: an X through the reserve, a plaza and the playground
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    b.fill(Math.round(5 + t * 30), Math.round(3 + t * 18), 2, 1, 'u');
    b.fill(Math.round(35 - t * 30), Math.round(3 + t * 18), 2, 1, 'u');
  }
  b.ellipse(20, 12.5, 5, 3.5, 'u');
  b.fill(24, 0, 2, 10, 'u');
  b.ellipse(26, 7, 6, 3.4, 'u');
  b.fill(4, 13, 7, 9, 'u');

  // Playground
  b.put('playframe', 27, 5);
  b.put('swings', 20, 7);
  b.put('springrider', 31, 8);
  b.put('bench', 27, 9);
  b.put('parkbin', 22, 9);

  // Toilet block, shade roof and the picnic shelters
  b.put('toiletblock', 7, 17);
  b.put('shade', 4, 15);
  b.put('picnic', 5, 15);
  b.put('archshelter', 4, 19);
  b.put('parkbin', 10, 17);
  b.put('gascage', 12, 20); b.put('gascage', 13, 20);
  b.put('bench', 15, 15);
  // The dela Cruz family's karaoke by the shade (talk to them to sing)
  b.npc('ramon', 8, 13, { face: 'down', at: 'karaoke', still: true, sing: true });
  b.npc('liza', 10, 13, { face: 'down', at: 'karaoke', still: true, sing: true });
  b.npc('migs', 7, 14, { face: 'right', at: 'karaoke', sing: true });
  b.npc('bea', 11, 14, { face: 'left', at: 'karaoke', sing: true });
  b.sign(4, 12, ['Lohse St Reserve.', 'Toilets open 7am till dusk. The playground is open whenever you are brave enough.']);

  // Big gums, and backyard fences along the east side
  [[11, 5], [14, 3], [31, 13], [37, 6], [28, 18], [12, 9], [36, 19], [16, 20]].forEach(([x, y]) => b.put('tall', x, y, { v: 'biggum' }));
  b.put('tall', 6, 8, { v: 'cypress' });
  b.fenceV(38, 1, 22, 'colorbond');

  // Street bits
  b.put('powerpole', 3, 6); b.put('powerpole', 30, 23);
  b.sign(21, 23, ['Maher Rd.', 'Cross here for Laverton Station.']);

  b.exit(0, 0, 1, 26, 'woods', 'east', 'Woods St');   // Lohse St carries on into Woods St all the way along
  b.exit(18, 27, 2, 1, 'station', 'north', 'Laverton Station');
  b.exit(39, 24, 1, 2, 'civic', 'west', 'Civic Parade, Altona');
  b.entry('east', 38, 26, 'left').edgeEntry('west', 'y', 1, 0, 25, 'right').entry('south', 18, 26, 'up');

  // Council motions that change the reserve (data/council.js)
  if (state.motionPassed('bookswap')) { b.put('streetlibrary', 9, 14); b.forage(8, 14, ['paperback']); }
  if (state.motionPassed('dogpark')) b.sign(12, 16, ['Off-lead dog park.', 'Passed by council. Dogs welcome. Pets on your team love a run here.']);
  b.forage(33, 10, ['carrot', 'ribbon']);
  b.forage(10, 14, ['chicken', 'tennis']);
  b.magpies([[17, 8], [33, 16], [8, 22]]);
  b.lane({ axis: 'x', pos: 24.5, dir: -1, from: -3, to: 43, every: [10, 20], speed: 56, kinds: ['veh-car-h-red', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 25.5, dir: 1, from: -3, to: 43, every: [11, 22], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });

  b.border(['gum', 'oak', 'gum']);
  b.scatter([4, 1, 34, 22], 0.04, [['bush', 2, ['green', 'berry']], ['tree', 1, ['gum']]]);
  for (let y = 1; y < 23; y++) for (let x = 4; x < 38; x++) if (b.get(x, y) === '.' && b.rand() < 0.08 && !b.occ[y][x]) b.set(x, y, ',');
  // Tall grass for wild encounters
  b.wildGrass(28, 2); b.wildGrass(13, 12); b.wildGrass(34, 12); b.wildGrass(21, 18);
  // Lived-in touches (walk-through props)
  b.scatter([0, 0, b.w, b.h], 0.012, [['flowerbed', 2, ['natives', 'mixed']], ['ball', 1, ['soccer', 'beach']], ['bike', 1, ['blue', 'red', 'kids']]], { clearance: 0 });
  return b.finish();
}
