// HOPE ST: Mem and Corni's apartment building, with its concrete fins,
// balconies overflowing with plants and sage green awnings. Around it:
// roller doors, a bike co-op in an old workshop, a gravel lot gone to weeds
// and an empty tin shed. The Upfield path runs past on the west, back down
// to Brunswick Station.
import { MapBuilder } from '../MapBuilder.js';

export function buildHope() {
  const b = new MapBuilder({ id: 'hope', w: 40, h: 24, fill: 'c', seed: 121 });

  // Upfield line and shared path down the west side
  b.vline(1, 0, 23, 'r').vline(2, 0, 23, 'r');
  b.vline(5, 0, 23, '=');
  b.fenceV(4, 0, 23, 'park', [12, 13, 14, 15]);
  b.fenceV(3, 0, 23, 'park', [12, 13, 14, 15]);

  // Hope St
  b.fill(3, 13, 37, 2, '#').hline(6, 39, 12, 'f').hline(6, 39, 15, 'f');
  b.fill(1, 13, 2, 2, 'x');

  // Weedy gravel strip beside the path, and two lock-ups facing the street
  b.fill(6, 0, 6, 7, 'g').fill(6, 2, 3, 3, '"');
  b.put('rollerdoor', 6, 7, { v: 'tagged' }); b.put('rollerdoor', 9, 7, { v: 'grey' });
  b.fenceV(12, 0, 8, 'paling');
  b.put('crate', 11, 9, { v: 'red' });

  // Mem and Corni's building, with a wide forecourt
  b.put('hopeapts', 13, 6);
  b.fill(12, 9, 16, 3, 'f');
  b.put('bikehoop', 13, 10); b.put('bikehoop', 14, 10);
  b.sign(24, 10, ['Mem and Corni\'s place.', 'Fourth floor. You can tell which balcony: it has the most plants. It always has the most plants.']);

  // East: a little car park, the bike co-op and an old tin shed
  b.fenceV(25, 0, 5, 'paling');
  b.put('graffiti', 26, 4, { v: 'paste' });
  b.put('car', 26, 6, { v: 'yellow' }); b.put('bin', 30, 6, { v: 'yellow' }); b.put('bin', 31, 6, { v: 'red' });
  // THE LEASH YOU CAN DO, the pet shop, run by Ed (inside: src/world/maps/petshop.js)
  b.put('petshop', 28, 8);
  b.put('doormat', 30, 11); b.put('doormat', 31, 11);
  b.exit(30, 11, 2, 1, 'petshop', 'door', 'The Leash You Can Do');
  b.put('factory', 32, 3, { v: 'brewery' });
  b.put('bikehoop', 35, 10); b.put('bikehoop', 36, 10);
  b.put('powerpole', 10, 12); b.put('powerpole', 35, 12);
  b.put('streettree', 20, 15);

  // Across the road: a vacant lot behind a low bluestone wall
  b.fill(11, 17, 15, 6, 'g').fill(12, 19, 3, 2, '"');
  b.fenceH(10, 26, 16, 'bluestone', [17, 18]).fenceV(10, 17, 23, 'bluestone').fenceV(26, 17, 23, 'bluestone').fenceH(11, 25, 23, 'bluestone');
  b.sign(17, 17, ['Vacant lot.', 'Coming soon: "luxury living". Currently: weeds, one shopping trolley, excellent cat hangout.']);
  b.put('trolley', 21, 20);
  b.put('graffiti', 6, 17, { v: 'tags' });
  b.fill(6, 20, 2, 2, '"');
  b.put('shed', 28, 18, { v: 'blue' });
  b.put('rollerdoor', 35, 19, { v: 'green' });
  b.put('crate', 34, 20, { v: 'blue' });

  b.exit(5, 23, 1, 1, 'brunswick', 'north', 'Brunswick Station');
  b.exit(39, 15, 1, 2, 'sydney', 'west', 'Sydney Rd');
  b.entry('south', 5, 21, 'up').entry('east', 38, 15, 'left').entry('petshop', 30, 12, 'down');

  b.npc('mem', 16, 9, { face: 'down' });
  b.npc('corni', 18, 9, { face: 'down' });

  b.lane({ axis: 'y', pos: 1.5, dir: 1, from: -14, to: 38, every: [35, 60], speed: 110, kinds: ['veh-train-v'], train: true });
  b.lane({ axis: 'y', pos: 2.5, dir: -1, from: -14, to: 38, every: [40, 70], speed: 110, kinds: ['veh-train-v'], train: true });
  b.lane({ axis: 'x', pos: 13.5, dir: -1, from: 3, to: 43, every: [12, 24], speed: 50, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'y', pos: 5.5, dir: -1, from: -2, to: 26, every: [12, 26], speed: 72, kinds: ['veh-bike-v'] });

  b.forage(22, 19, ['tennis', 'carrot']);
  b.forage(36, 10, ['feather', 'croissant']);
  b.forage(8, 1, ['sardine', 'feather']);
  b.magpies([[16, 20], [37, 22]]);
  // Lived-in touches: pot plants and bikes outside shops (walk-through)
  b.scatter([0, 0, b.w, b.h], 0.025, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
