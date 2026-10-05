// LODDON AVE: Seb and Sinead's place, one of five tan-brick units around a
// shared concrete driveway, just off Plenty Rd. Poppy holds court in the
// courtyard. Bottlebrush, clipped hedges and cream metal fences.
import { MapBuilder } from '../MapBuilder.js';

export function buildLoddon() {
  const b = new MapBuilder({ id: 'loddon', w: 44, h: 30, seed: 141 });

  // Plenty Rd, six lanes with a planted median
  b.vline(33, 0, 29, 'f').fill(34, 0, 3, 30, '#').fill(37, 0, 1, 30, '.').fill(38, 0, 3, 30, '#').vline(41, 0, 29, 'f');
  [3, 9, 15, 26].forEach(y => b.put('tree', 37, y, { v: 'gum' }));

  // Loddon Ave
  b.fill(0, 21, 34, 2, '#').hline(0, 33, 20, 'f').hline(0, 33, 23, 'f');

  // The unit block: shared driveway and courtyard
  b.fill(14, 4, 9, 11, 'c').fill(17, 15, 4, 5, 'c');
  b.put('loddonunit', 14, 1, { v: 'double' });
  b.put('loddonunit', 7, 7, { v: 'garage' });
  b.put('loddonunit', 23, 6, { v: 'window' });
  b.put('loddonunit', 8, 14, { v: 'shutters' });
  b.put('loddonunit', 22, 14, { v: 'shutters' });
  b.fill(7, 17, 10, 2, 'L').fill(21, 17, 9, 2, 'L');
  b.fenceH(7, 29, 19, 'metal', [17, 18, 19, 20]);
  b.put('mailbank', 15, 18);
  b.put('tall', 21, 17, { v: 'bottlebrush' }); b.put('tall', 14, 13, { v: 'bottlebrush' });
  b.put('tall', 6, 13, { v: 'hedge' }); b.put('tall', 30, 13, { v: 'hedge' }); b.put('tall', 28, 18, { v: 'hedge' });
  b.put('bin', 22, 12, { v: 'green' }); b.put('bin', 22, 11, { v: 'yellow' }); b.put('bin', 13, 10, { v: 'red' });
  b.put('car', 18, 6, { v: 'white' });
  b.fenceV(6, 1, 12, 'paling').fenceV(31, 1, 18, 'paling').fenceH(6, 31, 0, 'paling');
  b.sign(16, 16, ['Loddon Ave units.', 'Unit 1, 835 Plenty Rd is Seb and Sinead\'s place. Poppy runs the courtyard, and the bins, and you.']);
  b.reserve(18, 10, 3);

  // Vacant block next door
  b.fill(1, 1, 5, 18, '"');

  // South side of Loddon Ave, and the side street to Glasgow Ave
  b.fill(4, 23, 2, 7, '#');
  b.put('house', 8, 25, { v: 'red' }); b.put('house', 17, 25, { v: 'cream' }); b.put('house', 25, 25, { v: 'orange' });
  b.fenceH(7, 32, 24, 'metal', [10, 11, 21, 22, 29, 30]);
  b.put('powerpole', 12, 20); b.put('powerpole', 26, 23); b.put('lamp', 32, 19);
  b.sign(3, 24, ['Glasgow Ave this way.', 'Tim and Nick live down here. So does a very judgemental schnauzer.']);

  // Across Plenty Rd: Summerhill Shopping Centre
  b.fill(42, 7, 2, 4, 'f');
  b.sign(42, 6, ['Summerhill Shopping Centre.', 'Just across Plenty Rd. Supermarket, hot bread, a $2 shop and a car park the size of a suburb.']);
  b.exit(43, 7, 1, 4, 'summerhill', 'west', 'Summerhill Shopping Centre');

  b.exit(0, 21, 1, 2, 'preston', 'east', 'Preston');
  b.exit(4, 29, 2, 1, 'track', 'south', 'Edwardes Lake Park');
  b.exit(34, 0, 7, 1, 'reservoir', 'east', 'Reservoir Station');
  b.exit(34, 29, 7, 1, null, null, 'Plenty Rd', ['Plenty Rd south heads towards Preston. Not today.']);
  b.entry('west', 1, 22, 'right').entry('south', 4, 27, 'up').entry('north', 34, 2, 'down').entry('home', 18, 17, 'up').entry('summerhill', 42, 8, 'left');

  b.lane({ axis: 'y', pos: 34.5, dir: 1, from: -3, to: 33, every: [4, 9], speed: 70, kinds: ['veh-car-v-silver', 'veh-car-v-yellow'] });
  b.lane({ axis: 'y', pos: 35.5, dir: 1, from: -3, to: 33, every: [5, 10], speed: 66, kinds: ['veh-car-v-silver'] });
  b.lane({ axis: 'y', pos: 39.5, dir: -1, from: -3, to: 33, every: [4, 9], speed: 70, kinds: ['veh-car-v-yellow', 'veh-car-v-silver'] });
  b.lane({ axis: 'x', pos: 21.5, dir: -1, from: -3, to: 34, every: [14, 26], speed: 50, kinds: ['veh-car-h-white', 'veh-ute-h'] });

  b.npc('sinead', 19, 13, { face: 'down' });
  b.npc('golfer', 25, 12, { face: 'left' });

  b.forage(3, 6, ['tennis', 'snag']);
  b.forage(16, 9, ['chicken', 'tennis']);
  b.magpies([[3, 12], [20, 27]]);
  b.border(['gum', 'oak']);
  return b.finish();
}
