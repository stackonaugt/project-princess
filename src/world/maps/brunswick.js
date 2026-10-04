// BRUNSWICK STATION: the Upfield line with its heritage red-brick station,
// blue Metro signs, the level crossing on Dawson St, the little weatherboard
// signal hut and the Upfield shared path through the greenery.
// West along Dawson St to Laverton, east to Sydney Rd, north up the path to Hope St.
import { MapBuilder } from '../MapBuilder.js';

export function buildBrunswick() {
  const b = new MapBuilder({ id: 'brunswick', w: 40, h: 26, seed: 22 });

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

  // Upfield shared path with its low bluestone wall
  b.vline(26, 0, 17, '=');
  b.fenceV(27, 1, 16, 'bluestone');
  b.put('bikehoop', 25, 12); b.put('bikehoop', 25, 13);
  b.sign(25, 10, ['Upfield shared path.', 'North to Hope St. Cyclists, please ring your bell. Pedestrians, please pretend you heard it.']);

  // Greenery all round
  b.put('tall', 30, 4, { v: 'biggum' }); b.put('tall', 35, 9, { v: 'biggum' }); b.put('tall', 3, 6, { v: 'biggum' });
  b.put('tall', 7, 12, { v: 'pear' }); b.put('tall', 31, 14, { v: 'pear' });
  b.ellipse(33, 9, 5, 7, ',', '.');

  // South of Dawson St: a few houses and a laneway
  b.put('terrace', 2, 22, { v: 'brick' }); b.put('terrace', 5, 22, { v: 'cream' });
  b.put('terrace', 30, 22, { v: 'sage' }); b.put('terrace', 33, 22, { v: 'brick' });
  b.fill(9, 22, 2, 4, 'b');
  b.put('mural', 12, 22, { v: 'a' }); b.put('mural', 23, 22, { v: 'b' });
  b.put('powerpole', 8, 18); b.put('powerpole', 32, 18);

  b.exit(0, 19, 1, 2, 'station', 'east', 'Laverton');
  b.exit(39, 19, 1, 2, 'sydney', 'west', 'Sydney Rd');
  b.exit(26, 0, 1, 1, 'hope', 'south', 'Hope St');
  b.entry('station', 15, 11, 'down').entry('west', 1, 20, 'right').entry('east', 38, 20, 'left').entry('north', 26, 2, 'down');

  b.npc('priya', 26, 4, { path: [[26, 4], [26, 16], [30, 17], [26, 16]] });

  b.lane({ axis: 'y', pos: 19.5, dir: 1, from: -14, to: 40, every: [35, 60], speed: 110, kinds: ['veh-train-v'], train: true });
  b.lane({ axis: 'y', pos: 20.5, dir: -1, from: -14, to: 40, every: [40, 70], speed: 110, kinds: ['veh-train-v'], train: true });
  b.lane({ axis: 'x', pos: 19.5, dir: -1, from: -3, to: 43, every: [9, 18], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white'] });
  b.lane({ axis: 'x', pos: 20.5, dir: 1, from: -3, to: 43, every: [10, 20], speed: 56, kinds: ['veh-car-h-blue', 'veh-ute-h'] });
  b.lane({ axis: 'y', pos: 26.5, dir: 1, from: -2, to: 18, every: [12, 26], speed: 72, kinds: ['veh-bike-v'] });

  b.forage(34, 12, ['carrot', 'feather']);
  b.forage(4, 14, ['sardine', 'tennis']);
  b.magpies([[30, 9], [5, 10]]);
  b.border(['oak', 'gum', 'fruit']);
  b.scatter([1, 1, 10, 16], 0.2, [['tree', 3, ['oak', 'gum']], ['bush', 3, ['green', 'rose', 'berry']]]);
  b.scatter([28, 1, 11, 16], 0.2, [['tree', 2, ['oak', 'gum']], ['bush', 3, ['green', 'hydrangea']]]);
  return b.finish();
}
