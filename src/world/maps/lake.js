// EDWARDES LAKE: the lake itself. A concrete path loops the water past
// reedy tussocks, weeping gums and the outdoor gym; Edwardes St runs down
// the west side behind a pipe railing. Ducks have opinions.
import { MapBuilder } from '../MapBuilder.js';

export function buildLake() {
  const b = new MapBuilder({ id: 'lake', w: 44, h: 30, seed: 171 });

  // Edwardes St and the railing
  b.fill(1, 0, 2, 30, '#').vline(3, 0, 29, 'f');
  b.fenceV(4, 0, 29, 'rail', [14, 15]);

  // The lake: two overlapping basins, a path loop and an island
  b.ellipse(25, 14, 15.5, 10.5, 'f');
  b.ellipse(25, 14, 14.3, 9.4, '.');
  b.ellipse(23, 13, 11.5, 7, '~').ellipse(31, 16, 8, 5.5, '~');
  b.ellipse(27, 12, 1.8, 1.1, '.', '~');
  b.put('tall', 27, 12, { v: 'willowgum' });
  for (let i = 0; i < 40; i++) {
    const a = i / 40 * Math.PI * 2, x = Math.round(25 + Math.cos(a) * 13.3), y = Math.round(14 + Math.sin(a) * 8.6);
    if (b.get(x, y) === '.' && i % 4 !== 0) b.put('tussock', x, y, { v: i % 3 ? 'a' : 'b' });
  }
  b.ducks(24, 13, 9, 5, 5);
  b.fill(5, 14, 6, 2, 'f');          // path from Edwardes St
  b.fill(20, 24, 3, 6, 'f');          // path south to the track
  b.fill(39, 12, 5, 3, 'f');          // path east to the wetlands

  // Around the lake
  [[7, 3], [12, 26], [36, 3], [41, 22], [9, 8], [33, 27]].forEach(([x, y]) => b.put('tall', x, y, { v: 'willowgum' }));
  [[16, 1], [40, 7], [6, 22]].forEach(([x, y]) => b.put('tall', x, y, { v: 'biggum' }));
  b.put('gym', 34, 1); b.put('gym', 37, 1);
  b.put('bench', 14, 2); b.put('bench', 28, 26); b.put('parkbin', 13, 3);
  b.sign(18, 3, ['Edwardes Lake.', 'Please do not feed the ducks bread. They are on a diet. (They are not on a diet.)']);
  b.ellipse(8, 27, 3.5, 2, '"', '.').ellipse(41, 27, 2.5, 2.5, '"', '.').ellipse(6, 4, 2, 3, '"', '.');

  b.exit(20, 29, 3, 1, 'track', 'north', 'Athletics Track');
  b.exit(43, 12, 1, 3, 'wetlands', 'west', 'Edgars Creek Wetlands');
  b.entry('south', 21, 27, 'up').entry('east', 41, 13, 'left');

  b.npc('abby', 10, 15, { path: [[10, 15], [10, 24], [20, 24.5], [20, 25], [36, 23], [40, 14], [36, 4], [12, 4]] });

  b.lane({ axis: 'y', pos: 1.5, dir: 1, from: -3, to: 33, every: [8, 16], speed: 60, kinds: ['veh-car-v-silver', 'veh-car-v-yellow'] });
  b.lane({ axis: 'y', pos: 2.5, dir: -1, from: -3, to: 33, every: [9, 17], speed: 60, kinds: ['veh-car-v-yellow'] });

  b.forage(8, 27, ['feather', 'sardine']);
  b.forage(41, 27, ['carrot', 'tennis']);
  b.forage(30, 25, ['sardine', 'croissant']);
  b.magpies([[16, 27], [38, 6]]);
  b.border(['gum', 'gum', 'oak']);
  // Lived-in touches (walk-through props)
  b.scatter([0, 0, b.w, b.h], 0.008, [['flowerbed', 2, ['natives', 'mixed']], ['ball', 1, ['soccer', 'beach']], ['bike', 1, ['blue', 'red', 'kids']]], { clearance: 0 });
  return b.finish();
}
