// EDWARDES LAKE PARK, east: the A2 964 steam engine in its fenced
// paddock, the playground with the pink slide, toilets, picnic spots and
// Griffiths St. West to the track, north through the bush to the wetlands.
import { MapBuilder } from '../MapBuilder.js';

export function buildLakePark() {
  const b = new MapBuilder({ id: 'lakepark', w: 44, h: 30, seed: 181 });

  // Griffiths St with parking down the park side
  b.vline(38, 0, 29, 'f').fill(39, 0, 2, 30, '#').vline(41, 0, 29, 'f').fill(37, 2, 1, 26, 'P');
  b.put('car', 36, 5, { v: 'blue' }); b.put('car', 36, 14, { v: 'white' }); b.put('car', 36, 22, { v: 'silver' });

  // Paths
  b.fill(0, 13, 37, 2, 'u').fill(18, 0, 3, 13, 'u').fill(26, 15, 2, 12, 'u');

  // Steam engine A2 964 behind its fence
  b.put('steamengine', 27, 20);
  b.fenceH(26, 34, 18, 'park').fenceH(26, 34, 23, 'park').fenceV(26, 19, 22, 'park').fenceV(34, 19, 22, 'park');
  b.fill(27, 19, 7, 4, 'g');
  b.sign(25, 17, ['Steam Engine A2 964.', 'Hauled passengers across Victoria for decades. Now hauls nothing but compliments.']);
  b.fenceH(28, 34, 25, 'log', [30, 31]);

  // Playground with the pink slide
  b.fill(6, 4, 10, 7, 'm');
  b.put('playframe', 7, 5, { v: 'pink' }); b.put('swings', 12, 8); b.put('springrider', 13, 5);
  b.put('bench', 8, 11); b.put('parkbin', 16, 10);
  b.sign(5, 3, ['Pink slide playground.', 'The slide is pink. The slide is fast. The slide has seen things.']);

  // Toilets, picnic area, bush
  b.put('amenities', 22, 3);
  b.put('picnic', 8, 18); b.put('picnic', 14, 22); b.put('bbq', 11, 18); b.put('parkbin', 16, 18);
  b.put('infosign', 33, 12);
  b.sign(35, 15, ['Edwardes Lake Park.', 'Lake to the west, wetlands to the north. Watch for snakes in summer and swooping magpies in spring.']);
  [[3, 22], [21, 18], [30, 5], [4, 8], [24, 26], [33, 2]].forEach(([x, y]) => b.put('tall', x, y, { v: 'biggum' }));
  b.ellipse(5, 26, 4, 2.5, '"', '.').ellipse(28, 8, 3, 3, '"', '.').ellipse(12, 26, 3, 2, '"', '.');

  b.exit(0, 13, 1, 2, 'track', 'east', 'Athletics Track');
  b.exit(18, 0, 3, 1, 'wetlands', 'south', 'Edgars Creek Wetlands');
  b.exit(39, 29, 2, 1, 'glasgow', 'west', 'Glasgow Ave');
  b.entry('west', 1, 13, 'right').entry('north', 19, 2, 'down').entry('south', 39, 27, 'up');

  b.npc('dimitri', 30, 25, { face: 'up' });

  b.lane({ axis: 'y', pos: 39.5, dir: 1, from: -3, to: 33, every: [9, 18], speed: 56, kinds: ['veh-car-v-silver', 'veh-car-v-yellow'] });
  b.lane({ axis: 'y', pos: 40.5, dir: -1, from: -3, to: 33, every: [10, 19], speed: 56, kinds: ['veh-car-v-yellow'] });

  b.forage(5, 26, ['feather', 'tennis']);
  b.forage(28, 8, ['chicken', 'ribbon']);
  b.forage(12, 26, ['carrot', 'cheese']);
  b.magpies([[20, 22], [9, 15], [31, 10]]);
  b.border(['gum', 'gum', 'oak']);
  b.scatter([1, 1, 35, 28], 0.04, [['tree', 2, ['gum']], ['bush', 2, ['green', 'berry']]]);
  return b.finish();
}
