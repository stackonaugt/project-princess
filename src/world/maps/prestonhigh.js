// PRESTON STATION and HIGH ST. The Mernda line runs overhead on the skyrail
// (Bell St's level crossing is long gone), with the station underneath and
// a plaza out the front: Dimi's coffee cart, bike racks, and the Myki
// Inspector lurking by a pillar. High St runs across the bottom with the
// tram: Zorba the Bake, the Second Act op shop, a real estate agent
// with eye-watering prices, a pho place. West to Preston Market, south
// down to Plenty Rd.
//
//   y0-2 weedy verge   y3-5 the skyrail   y7-9 station   y10-16 plaza and shops
//   y17 footpath   y18-21 High St (tram 19-20)   y22 footpath   y23-25 south shops
import { MapBuilder } from '../MapBuilder.js';

export function buildPrestonHigh() {
  const b = new MapBuilder({ id: 'prestonhigh', w: 44, h: 28, fill: 'c', seed: 341 });

  // A weedy verge along the rail line, then the skyrail
  b.fill(0, 0, 44, 3, '.');
  b.wildGrass(8, 1, 4, 1.2); b.wildGrass(34, 1, 3, 1.2);
  b.put('viaduct', 0, 3);
  for (let x = 2; x < 44; x += 7) b.put('pier', x, 5);

  // The station and its plaza
  b.put('skystation', 2, 7, { v: 'preston' });
  b.put('myki', 7, 10, { travel: true });
  b.sign(13, 10, ['Preston Station. Mernda line.', 'Up on the skyrail. Tap your myki to catch a train to anywhere you have already been.']);
  b.fill(0, 10, 28, 7, 'k');
  b.put('coffeecart', 16, 12);
  b.put('bikerack', 2, 13); b.put('bikerack', 2, 15); b.put('bench', 10, 15); b.put('parkbin', 13, 15);
  b.put('tall', 20, 11, { v: 'pear' }); b.put('tall', 24, 14, { v: 'pear' });
  b.put('busshelter', 21, 16);

  // Shops on the north side of High St
  b.put('nshop', 28, 7, { v: 'greekcake' }); b.put('nshop', 32, 7, { v: 'opshop' });
  b.put('nshop', 36, 7, { v: 'realestate' }); b.put('nshop', 40, 7, { v: 'pho' });
  b.fill(28, 10, 16, 7, 'f');
  b.sign(39, 10, ['Gouge & Co. Real Estate.', '"Charming 1 bed, no windows, $620 a week. Pets considered (not really)."']);
  b.put('table', 29, 10); b.put('table', 31, 10);
  b.put('streetlibrary', 35, 11);
  b.put('placard', 27, 12);

  // High St with the tram
  b.hline(0, 43, 17, 'f');
  b.hline(0, 43, 18, '#').hline(0, 43, 19, '+').hline(0, 43, 20, '+').hline(0, 43, 21, '#');
  b.hline(0, 43, 22, 'f');

  // South side, with the road down to Plenty Rd
  b.vline(19, 23, 27, 'f').fill(20, 22, 3, 6, '#').vline(23, 23, 27, 'f');
  b.fill(20, 22, 3, 1, 'z');
  b.put('shop', 1, 23, { v: 'bakery' }); b.put('redshop', 5, 23, { v: 'cream' }); b.put('nshop', 9, 23, { v: 'barber' }); b.put('shop', 13, 23, { v: 'records' });
  b.sign(18, 22, ['High St, south.', 'Down to Bell St and Plenty Rd: the Stolberg, Anaconda and the convenience store.']);
  b.put('nshop', 24, 23, { v: 'discount' }); b.put('shop', 28, 23, { v: 'curry' });
  b.put('terrace', 32, 23, { v: 'brick' }); b.put('terrace', 35, 23, { v: 'cream' });
  b.fill(38, 23, 6, 5, '.'); b.wildGrass(41, 25, 2.5, 1.6); b.put('tree', 39, 24, { v: 'lemon' });

  // Street furniture
  b.put('tramstop', 9, 17); b.put('tramstop', 33, 22);
  b.put('powerpole', 26, 17); b.put('powerpole', 15, 22); b.put('powerpole', 30, 22);
  b.put('streettree', 4, 22); b.put('streettree', 26, 22); b.put('streettree', 37, 17);

  b.npc('inspector', 9, 12, { face: 'down' });
  b.npc('dimi', 17, 13, { face: 'down' });
  b.npc('nell', 34, 10, { face: 'down' });

  b.exit(0, 10, 1, 7, 'prestonmkt', 'south', 'Preston Market');
  b.exit(43, 18, 1, 4, 'murray', 'middle', 'Murray Rd');
  b.exit(19, 27, 5, 1, 'preston', 'north', 'Plenty Rd');
  b.entry('station', 8, 11, 'down').entry('east', 42, 19, 'left').entry('west', 1, 12, 'right').entry('south', 20, 26, 'up');

  b.lane({ axis: 'x', pos: 3.3, dir: 1, from: -12, to: 56, every: [30, 55], speed: 120, kinds: ['veh-train-h'], train: true, sky: true });
  b.lane({ axis: 'x', pos: 4.3, dir: -1, from: -12, to: 56, every: [35, 60], speed: 120, kinds: ['veh-train-h'], train: true, sky: true });
  b.lane({ axis: 'x', pos: 19.5, dir: 1, from: -6, to: 50, every: [25, 45], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 20.5, dir: -1, from: -6, to: 50, every: [30, 50], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 18.5, dir: -1, from: -3, to: 47, every: [6, 12], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 21.5, dir: 1, from: -3, to: 47, every: [6, 12], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });

  b.forage(22, 1, ['feather', 'tennis']);
  b.forage(42, 27, ['lemon', 'fetta']);
  b.magpies([[14, 1], [40, 24]]);
  b.scatter([0, 10, 44, 13], 0.015, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fck' });
  return b.finish();
}
