// RESERVOIR STATION: the skyrail. The Mernda line runs overhead on a
// concrete viaduct; underneath is the black station base with its big R and
// white pleated canopy, native garden beds and Broadway. North up Edwardes
// St to the lake, east to Loddon Ave and Plenty Rd, west back to Brunswick.
import { MapBuilder } from '../MapBuilder.js';

export function buildResStation() {
  const b = new MapBuilder({ id: 'reservoir', w: 44, h: 28, seed: 131 });

  // Under the skyrail
  b.fill(0, 2, 44, 5, 'c');
  b.put('viaduct', 0, 3);
  for (let x = 2; x < 44; x += 7) if (x < 32 || x > 37) b.put('pier', x, 5);

  // Edwardes St runs north-south under the viaduct
  b.fill(34, 0, 2, 28, '#').vline(33, 0, 27, 'f').vline(36, 0, 27, 'f');

  // Station forecourt, garden beds and black fence
  b.fill(8, 7, 25, 6, 'c');
  b.put('resstation', 14, 8);
  b.put('myki', 17, 11, { travel: true });
  b.put('busshelter', 10, 11); b.put('wayfinding', 9, 9);
  b.put('bikerack', 28, 11);
  b.sign(24, 12, ['Reservoir Station. Mernda line.', 'Rebuilt up on the skyrail. Tap your myki to catch a train to anywhere you have already been.']);
  b.fill(0, 13, 33, 2, 'm');
  [2, 6, 9, 13, 16, 24, 27, 30].forEach(x => b.put('sapling', x, 13 + (x % 2)));
  b.fenceH(0, 32, 15, 'park', [20, 21]);
  b.put('lamp', 7, 12); b.put('lamp', 31, 12);

  // Broadway
  b.fill(0, 17, 44, 2, '#').hline(0, 43, 16, 'f').hline(0, 43, 19, 'f');
  b.fill(34, 16, 2, 4, '#');

  // South of Broadway: shops and a car park
  b.put('shop', 1, 20, { v: 'milk bar' }); b.put('shop', 5, 20, { v: 'bakery' }); b.put('shop', 9, 20, { v: 'pho' });
  b.fill(0, 23, 13, 1, 'f');
  b.fill(14, 20, 18, 6, 'P');
  [[15, 21, 'white'], [20, 23, 'red'], [26, 21, 'silver']].forEach(([x, y, v]) => b.put('car', x, y, { v }));
  b.put('tall', 38, 22, { v: 'biggum' }); b.put('pylon', 40, 8); b.put('tall', 39, 13, { v: 'hedge' });
  b.put('powerpole', 12, 19); b.put('powerpole', 30, 19);

  b.exit(0, 17, 1, 2, 'glasgow', 'east', 'Glasgow Ave');
  b.exit(34, 0, 2, 1, 'track', 'skyrail', 'Edwardes Lake Park');
  b.exit(43, 17, 1, 2, 'loddon', 'north', 'Loddon Ave');
  b.entry('station', 20, 12, 'down').entry('west', 1, 18, 'right').entry('north', 34, 1, 'down').entry('east', 42, 18, 'left');

  b.npc('james', 3, 23, { face: 'up' });
  b.npc('stranger', 39, 14, { face: 'left' });

  b.lane({ axis: 'x', pos: 3.3, dir: 1, from: -12, to: 56, every: [30, 55], speed: 120, kinds: ['veh-train-h'], train: true, sky: true });
  b.lane({ axis: 'x', pos: 4.3, dir: -1, from: -12, to: 56, every: [35, 60], speed: 120, kinds: ['veh-train-h'], train: true, sky: true });
  b.lane({ axis: 'x', pos: 17.5, dir: -1, from: -3, to: 47, every: [7, 14], speed: 58, kinds: ['veh-car-h-white', 'veh-car-h-red', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 18.5, dir: 1, from: -3, to: 47, every: [8, 15], speed: 58, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });
  b.lane({ axis: 'y', pos: 34.5, dir: 1, from: -3, to: 31, every: [10, 20], speed: 56, kinds: ['veh-car-v-silver', 'veh-car-v-yellow'] });

  b.forage(5, 25, ['cheese', 'chicken']);
  b.forage(40, 25, ['tennis', 'feather']);
  b.magpies([[25, 14], [38, 26]]);
  b.border(['gum', 'oak']);
  b.scatter([37, 7, 6, 8], 0.15, [['bush', 2, ['green']], ['tree', 1, ['gum']]]);
  // Tall grass for wild encounters
  b.wildGrass(3, 8); b.wildGrass(8, 25);
  // Lived-in touches: pot plants and bikes outside shops (walk-through)
  b.scatter([0, 0, b.w, b.h], 0.012, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
