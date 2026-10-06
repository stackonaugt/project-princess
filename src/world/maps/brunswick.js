// BRUNSWICK STATION: the Upfield line with its heritage red-brick station,
// blue Metro signs, the level crossing on Dawson St, the little weatherboard
// signal hut and the Upfield shared path. Around it: a commuter car park,
// sawtooth-roof factories, roller doors and a weedy lot or two.
// West along Dawson St to Laverton, east to Sydney Rd, north up the path to Hope St,
// south down the bluestone lane to Lygon St, Carlton.
import { MapBuilder } from '../MapBuilder.js';
import { state } from '../../systems/state.js';

export function buildBrunswick() {
  const b = new MapBuilder({ id: 'brunswick', w: 40, h: 26, fill: 'c', seed: 22 });

  // The Upfield line runs north-south
  b.vline(19, 0, 25, 'r').vline(20, 0, 25, 'r');
  b.fill(12, 2, 7, 16, 'p');                          // main platform with the station building
  b.fill(21, 2, 3, 14, 'p');                          // far platform

  // Dawson St and the level crossing
  b.fill(0, 19, 40, 2, '#').hline(0, 39, 18, 'f').hline(0, 39, 21, 'f');
  b.fill(19, 18, 2, 4, 'x');
  b.put('boomgate', 17, 18); b.put('boomgate', 21, 21);
  b.put('sighut', 24, 16);

  // Station building, signs and the myki reader
  b.put('brunstation', 12, 6);
  b.put('ptsign', 10, 17, { v: 'brunswick' });
  b.put('myki', 16, 10, { travel: true });
  b.put('bench', 13, 12); b.put('bench', 21, 9);
  b.put('lamp', 17, 3); b.put('lamp', 17, 15); b.put('lamp', 22, 4);
  b.put('stanchion', 19, 2); b.put('stanchion', 19, 13);
  b.fenceH(12, 18, 2, 'picket', [15]).fenceV(11, 2, 17, 'picket', [8, 9]);
  b.sign(14, 15, ['Brunswick Station. Upfield line.', 'Tap your myki at the reader to catch a train to anywhere you have already been.']);

  // Upfield shared path with its low bluestone wall, and weeds by the line
  b.vline(26, 0, 17, '=');
  b.fenceV(27, 1, 16, 'bluestone');
  b.fill(24, 3, 2, 5, '"');
  b.put('bikehoop', 25, 12); b.put('bikehoop', 25, 13);
  b.sign(25, 10, ['Upfield shared path.', 'North to Hope St. Cyclists, please ring your bell. Pedestrians, please pretend you heard it.']);

  // West: an old factory and the commuter car park
  b.put('factory', 1, 2, { v: 'pickles' });
  b.fill(1, 6, 9, 10, '#').fill(1, 6, 9, 2, 'P').fill(1, 14, 9, 2, 'P');
  b.put('car', 1, 6, { v: 'white' }); b.put('car', 5, 6, { v: 'red' }); b.put('car', 7, 14, { v: 'blue' }); b.put('car', 3, 14, { v: 'silver' });
  b.put('streettree', 10, 4); b.put('streettree', 10, 12);
  b.sign(1, 16, ['Commuter car park.', 'Full by 7:02am. One hatchback has been circling since 2019.']);
  b.put('bin', 0, 16, { v: 'yellow' }); b.put('bin', 2, 16, { v: 'red' });

  // East of the path: a tin factory, roller doors and a weedy lot
  b.put('rollerdoor', 28, 2, { v: 'grey' });
  b.put('factory', 31, 1, { v: 'tin' });
  b.put('graffiti', 28, 9, { v: 'paste' });
  b.fill(33, 8, 6, 7, 'g').fill(34, 10, 3, 2, '"');
  b.fenceH(33, 38, 7, 'park').fenceV(32, 7, 14, 'park', [11, 12]).fenceH(33, 38, 14, 'park').fenceV(39, 7, 14, 'park');
  b.put('crate', 30, 15, { v: 'blue' }); b.put('crate', 31, 15, { v: 'red' });
  b.put('rollerdoor', 28, 12, { v: 'green' });
  b.put('streettree', 31, 6);

  // South of Dawson St: laneways, roller doors, murals and a mill
  b.put('rollerdoor', 1, 23, { v: 'tagged' }); b.put('rollerdoor', 4, 23, { v: 'green' });
  b.fill(9, 22, 2, 4, 'b');
  b.put('mural', 12, 22, { v: 'a' }); b.put('mural', 23, 22, { v: 'b' });
  b.put('rollerdoor', 28, 23, { v: 'grey' }); b.put('rollerdoor', 31, 23, { v: 'tagged' }); b.put('graffiti', 34, 24, { v: 'tags' });
  b.fill(38, 23, 2, 2, '"');
  b.put('powerpole', 8, 18); b.put('powerpole', 32, 18);

  b.exit(0, 19, 1, 2, 'flemington', 'east', 'Flemington');
  b.exit(39, 19, 1, 2, 'donald', 'west', 'Donald St');
  b.exit(26, 0, 1, 1, 'hope', 'south', 'Hope St');
  b.entry('station', 15, 11, 'down').entry('west', 1, 20, 'right').entry('east', 38, 20, 'left').entry('north', 26, 2, 'down');

  b.npc('abby', 26, 4, { path: [[26, 4], [26, 16], [30, 17], [26, 16]] });

  b.lane({ axis: 'y', pos: 19.5, dir: 1, from: -14, to: 40, every: [35, 60], speed: 110, kinds: ['veh-train-v'], train: true });
  b.lane({ axis: 'y', pos: 20.5, dir: -1, from: -14, to: 40, every: [40, 70], speed: 110, kinds: ['veh-train-v'], train: true });
  b.lane({ axis: 'x', pos: 19.5, dir: -1, from: -3, to: 43, every: [9, 18], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white'] });
  b.lane({ axis: 'x', pos: 20.5, dir: 1, from: -3, to: 43, every: [10, 20], speed: 56, kinds: ['veh-car-h-blue', 'veh-ute-h'] });
  b.lane({ axis: 'y', pos: 26.5, dir: 1, from: -2, to: 18, every: [12, 26], speed: 72, kinds: ['veh-bike-v'] });

  b.forage(36, 12, ['carrot', 'feather']);
  b.forage(5, 10, ['sardine', 'tennis']);
  b.magpies([[35, 9], [5, 9]]);
  // Lived-in touches: pot plants and bikes outside shops (walk-through)
  b.scatter([0, 0, b.w, b.h], 0.02, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
