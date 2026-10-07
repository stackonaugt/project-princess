// EDWARDES LAKE PARK, south: the red athletics track, the Little Athletics
// clubhouse, toilets and Edwardes St. North to the lake, east into the
// park, south down Edwardes St to Loddon Ave, or the skyrail path to the station.
import { MapBuilder } from '../MapBuilder.js';

export function buildTrack() {
  const b = new MapBuilder({ id: 'track', w: 44, h: 30, seed: 161 });

  // Edwardes St down the west side
  b.fill(1, 0, 2, 30, '#').vline(3, 0, 29, 'f');
  b.fenceV(4, 1, 28, 'log', [12, 13, 24, 25]);

  // The track: red oval with the infield
  b.put('trackoval', 11, 6);
  b.reserve(24, 14, 12.5);
  b.put('infosign', 23, 13);

  // Gravel paths linking everything
  b.fill(20, 0, 3, 6, 'u').fill(37, 12, 7, 3, 'u').fill(5, 12, 7, 2, 'u').fill(5, 24, 14, 2, 'u');
  // ...and the path south under the skyrail to Reservoir Station
  b.fill(19, 24, 4, 2, 'u').fill(21, 26, 2, 4, 'u');
  b.sign(23, 27, ['Skyrail path.', 'Under the Mernda line to Reservoir Station. The columns have murals now.']);

  // Clubhouse, toilets, gym
  b.put('clubhouse', 7, 26, { v: 'athletics' });
  b.put('amenities', 6, 8);
  b.put('bench', 14, 24); b.put('bench', 32, 24); b.put('parkbin', 13, 22);
  b.sign(6, 23, ['Preston Reservoir Little Athletics.', 'Saturday mornings: tiny humans running in circles. Spectators welcome, snacks encouraged.']);

  // Bush and tall grass round the edges (wild encounters will live here)
  b.ellipse(39, 4, 4, 3.5, '"', '.L').ellipse(8, 3, 3, 2.5, '"', '.').ellipse(39, 25, 4, 3, '"', '.');
  [[6, 17], [36, 8], [10, 21], [40, 19], [28, 26], [16, 3]].forEach(([x, y]) => b.put('tall', x, y, { v: 'biggum' }));

  b.exit(1, 29, 2, 1, 'loddon', 'south', 'Shortcut to Loddon Ave');
  b.exit(1, 0, 2, 1, 'lake', 'southwest', 'Edwardes Lake');
  b.exit(20, 0, 3, 1, 'lake', 'south', 'Edwardes Lake');
  b.exit(43, 12, 1, 3, 'lakepark', 'west', 'Lake Park');
  b.exit(21, 29, 2, 1, 'reservoir', 'north', 'Reservoir Station');
  b.entry('skyrail', 21, 27, 'up').entry('northwest', 2, 2, 'down').entry('south', 2, 27, 'up').entry('north', 21, 2, 'down').entry('east', 41, 13, 'left');

  const loop = []; for (let i = 0; i < 20; i++) { const a = -i / 20 * Math.PI * 2; loop.push([24 + Math.cos(a) * 11.5, 14 + Math.sin(a) * 7]); }
  b.npc('nathan', loop[0][0], loop[0][1], { path: loop, speed: 46 });

  b.lane({ axis: 'y', pos: 1.5, dir: 1, from: -3, to: 33, every: [8, 16], speed: 60, kinds: ['veh-car-v-silver', 'veh-car-v-yellow'] });
  b.lane({ axis: 'y', pos: 2.5, dir: -1, from: -3, to: 33, every: [9, 17], speed: 60, kinds: ['veh-car-v-yellow'] });

  b.forage(39, 4, ['tennis', 'feather']);
  b.forage(8, 3, ['carrot', 'chicken']);
  b.forage(24, 16, ['tennis', 'snag']);
  b.magpies([[30, 22], [12, 18], [35, 9]]);
  b.border(['gum', 'gum', 'oak']);
  b.scatter([5, 1, 38, 28], 0.05, [['tree', 2, ['gum', 'oak']], ['bush', 2, ['green', 'berry']]]);
  // Lived-in touches (walk-through props)
  b.scatter([0, 0, b.w, b.h], 0.008, [['flowerbed', 2, ['natives', 'mixed']], ['ball', 1, ['soccer', 'beach']], ['bike', 1, ['blue', 'red', 'kids']]], { clearance: 0 });
  return b.finish();
}
