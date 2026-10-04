// HOPE ST: Mem and Corni's apartment building, with its concrete fins,
// balconies overflowing with plants and sage green awnings. Across the road
// is a gravel lot and an old warehouse. The Upfield path runs past on the
// west, back down to Brunswick Station.
import { MapBuilder } from '../MapBuilder.js';

export function buildHope() {
  const b = new MapBuilder({ id: 'hope', w: 40, h: 24, seed: 121 });

  // Upfield line and shared path down the west side
  b.vline(1, 0, 23, 'r').vline(2, 0, 23, 'r');
  b.vline(5, 0, 23, '=');
  b.fenceV(4, 0, 23, 'park', [12, 13, 14, 15]);
  b.fenceV(3, 0, 23, 'park', [12, 13, 14, 15]);

  // Hope St
  b.fill(3, 13, 37, 2, '#').hline(6, 39, 12, 'f').hline(6, 39, 15, 'f');
  b.fill(1, 13, 2, 2, 'x');

  // Mem and Corni's building, with a wide forecourt
  b.put('hopeapts', 13, 6);
  b.fill(12, 9, 16, 3, 'f');
  b.put('bikehoop', 13, 10); b.put('bikehoop', 14, 10);
  b.put('bush', 26, 9, { v: 'green' }); b.put('bush', 12, 9, { v: 'green' });
  b.sign(21, 10, ['Mem and Corni\'s place.', 'Fourth floor. You can tell which balcony: it has the most plants. It always has the most plants.']);
  b.put('tall', 9, 6, { v: 'biggum' }); b.put('tall', 31, 7, { v: 'pear' });
  b.put('shed', 30, 4, { v: 'grey' });

  // Across the road: an empty gravel lot behind a low wall, and a warehouse
  b.fill(10, 17, 16, 6, 'g');
  b.fenceH(9, 26, 16, 'bluestone', [17, 18]).fenceV(9, 17, 22, 'bluestone').fenceV(26, 17, 22, 'bluestone');
  b.put('shed', 29, 18, { v: 'blue' });
  b.put('mural', 7, 17, { v: 'b' });
  b.sign(17, 17, ['Vacant lot.', 'Coming soon: "luxury living". Currently: weeds, one shopping trolley, excellent cat hangout.']);
  b.put('trolley', 20, 20);
  b.put('powerpole', 10, 12); b.put('powerpole', 30, 12);

  b.exit(5, 23, 1, 1, 'brunswick', 'north', 'Brunswick Station');
  b.entry('south', 5, 21, 'up');

  b.lane({ axis: 'y', pos: 1.5, dir: 1, from: -14, to: 38, every: [35, 60], speed: 110, kinds: ['veh-train-v'], train: true });
  b.lane({ axis: 'y', pos: 2.5, dir: -1, from: -14, to: 38, every: [40, 70], speed: 110, kinds: ['veh-train-v'], train: true });
  b.lane({ axis: 'x', pos: 13.5, dir: -1, from: 3, to: 43, every: [12, 24], speed: 50, kinds: ['veh-car-h-red', 'veh-ute-h'] });
  b.lane({ axis: 'y', pos: 5.5, dir: -1, from: -2, to: 26, every: [12, 26], speed: 72, kinds: ['veh-bike-v'] });

  b.forage(22, 19, ['tennis', 'carrot']);
  b.forage(36, 9, ['feather', 'croissant']);
  b.magpies([[16, 20], [35, 21]]);
  b.border(['oak', 'gum']);
  b.scatter([6, 1, 6, 10], 0.25, [['bush', 2, ['green', 'berry']], ['tree', 1, ['gum']]]);
  b.scatter([33, 17, 6, 6], 0.2, [['bush', 2, ['green']], ['tree', 1, ['oak']]]);
  return b.finish();
}
