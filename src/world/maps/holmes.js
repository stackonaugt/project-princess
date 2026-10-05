// HOLMES ST, Brunswick East (from the owner's Street View shots). Adam and
// Chelsea's red brick unit, Unit 1/42, sits on the corner behind its low red
// brick wall, with the driveway down the side (Chloe's turf) and the next
// unit behind. On the Mitchell St corner, the auto parts shop with its blue
// fascia. Across Holmes St: the new grey and orange townhouses, the old red
// brick corner house, the tram tracks and the 4 to 6pm tram lane signs.
//
//   y0-9 north side (Adam's, the units, the auto parts shop)
//   y10 footpath   y11-16 Holmes St with the tram tracks   y17 footpath
//   y18-25 south side (townhouses, the corner house, Mitchell St)
import { MapBuilder } from '../MapBuilder.js';

export function buildHolmes() {
  const b = new MapBuilder({ id: 'holmes', w: 44, h: 26, fill: 'c', seed: 601 });

  // Holmes St: footpaths, road, two tram tracks, road, footpath
  b.hline(0, 43, 10, 'f');
  b.hline(0, 43, 11, '#').hline(0, 43, 12, '#').hline(0, 43, 13, '+').hline(0, 43, 14, '+').hline(0, 43, 15, '#').hline(0, 43, 16, '#');
  b.hline(0, 43, 17, 'f');

  // Mitchell St runs south off Holmes St, past the auto parts corner
  b.fill(26, 18, 2, 8, '#').vline(25, 18, 25, 'f').vline(28, 18, 25, 'f');

  // Adam and Chelsea's: Unit 1 at the front, the second unit behind, and the
  // driveway between them where Chloe sits and judges the street.
  b.put('adamunit', 4, 6, { v: 'front' });
  b.put('adamunit', 4, 1, { v: 'back' });
  b.fill(11, 0, 3, 10, 'h');                      // the driveway down the side
  b.fenceH(1, 10, 9, 'brickwall', [6]);           // the low red brick front wall
  b.fenceV(0, 0, 9, 'paling');
  b.fill(1, 9, 9, 1, '.').fill(1, 9, 2, 1, '"');
  b.put('letterbox', 6, 9);
  b.sign(2, 9, ['Unit 1/42 Holmes St.', 'Adam and Chelsea live here, and so does Chloe, who considers the driveway her office.']);
  b.put('bin', 14, 9, { v: 'red' }); b.put('bin', 15, 9, { v: 'yellow' });
  b.put('car', 11, 1, { v: 'silver' });
  b.put('tall', 17, 9, { v: 'hedge' });

  // More units, then the auto parts shop on the Mitchell St corner
  b.put('adamunit', 18, 6, { v: 'back' });
  b.fenceH(18, 24, 9, 'brickwall');
  b.put('autoparts', 26, 7);
  b.fill(34, 7, 9, 3, 'P');
  b.put('car', 35, 7, { v: 'blue' }); b.put('ute', 39, 7, { v: 'white' });
  b.put('rollerdoor', 34, 4, { v: 'grey' });
  b.put('factory', 35, 0, { v: 'tin' });
  b.put('powerpole', 9, 10); b.put('powerpole', 33, 10);
  b.put('tramlanesign', 20, 10); b.put('tramlanesign', 38, 17);
  b.put('streettree', 2, 10); b.put('streettree', 24, 10);

  // Across the road: the new townhouses, then the old red brick corner house
  b.put('townhouse', 2, 20, { v: 'a' }); b.put('townhouse', 6, 20, { v: 'b' });
  b.put('townhouse', 10, 20, { v: 'a' });
  b.fenceH(1, 13, 23, 'render', [4, 8, 12]);
  b.put('bungalow', 16, 20, { v: 'corner' });
  b.fenceH(15, 24, 23, 'brickwall', [19]);
  b.fill(15, 23, 10, 1, '.');
  b.put('tall', 22, 22, { v: 'hedge' });
  b.put('streettree', 14, 17); b.put('streettree', 31, 17);
  b.put('bungalow', 30, 20, { v: 'cream' });
  b.fenceH(29, 40, 23, 'brickwall', [33]);
  b.put('keepleft', 24, 18);
  b.put('car', 7, 18, { v: 'white' }); b.put('car', 20, 18, { v: 'red' }); b.put('car', 35, 18, { v: 'blue' });

  // Wild patches: the nature strip corners and the gravel by the sheds
  b.fill(41, 0, 3, 6, 'g').fill(41, 2, 2, 2, '"');
  b.wildGrass(42, 24, 2, 2); b.wildGrass(19, 24, 2, 1.2);

  b.exit(0, 10, 1, 8, 'donald', 'east', 'Donald St, Brunswick');
  b.exit(43, 10, 1, 8, 'ebnicholson', 'west', 'Nicholson St');
  b.exit(26, 25, 2, 1, 'fleming', 'north', 'Fleming Park');
  b.entry('west', 1, 11, 'right').entry('east', 42, 11, 'left').entry('south', 26, 23, 'up');

  b.npc('adam', 8, 10, { face: 'down' });
  b.npc('chelsea', 10, 10, { face: 'down' });
  b.npc('tradie', 30, 17, { face: 'up' });

  b.lane({ axis: 'x', pos: 13.5, dir: 1, from: -6, to: 50, every: [28, 48], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 14.5, dir: -1, from: -6, to: 50, every: [32, 52], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 11.5, dir: -1, from: -3, to: 47, every: [7, 14], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 16.5, dir: 1, from: -3, to: 47, every: [7, 14], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });

  b.forage(42, 3, ['tennis', 'chicken']);
  b.forage(16, 24, ['sardine', 'feather']);
  b.magpies([[12, 24], [40, 5]]);
  b.scatter([0, 0, b.w, b.h], 0.02, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
