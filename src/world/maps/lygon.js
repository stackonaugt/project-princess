// LYGON ST, Brunswick East: the shopping strip. Two-storey Italianate fronts
// with arched upper windows and painted signs, built in 1892 and selling
// pilates now. Enzo's deli and Juno's record shop both have doors. Tash runs
// the coffee window. Lygon St runs north towards Moreland Rd and Coburg,
// which is locked for now.
//
//   y0-6 north side shops   y7 footpath   y8-13 Lygon St   y14 footpath
//   y15-21 south side shops   y22-25 the back lane
import { MapBuilder } from '../MapBuilder.js';

export function buildLygon() {
  const b = new MapBuilder({ id: 'lygon', w: 44, h: 26, fill: 'c', seed: 651 });

  b.hline(0, 43, 7, 'f');
  b.fill(0, 8, 44, 2, '#').hline(0, 43, 10, '+').hline(0, 43, 11, '+').fill(0, 12, 44, 2, '#');
  b.hline(0, 43, 14, 'f');
  // Lygon St heads north off the top (towards Moreland Rd, Coburg)
  b.fill(18, 0, 4, 7, '#').vline(17, 0, 6, 'f').vline(22, 0, 6, 'f');

  // North side: the deli, the gelato shop and the roaster
  b.put('eshop', 1, 4, { v: 'deli' });
  b.exit(4, 7, 1, 1, 'eastdeli', 'door', 'Pasta La Vista');
  b.put('eshop', 6, 4, { v: 'gelato' });
  b.put('eshop', 11, 4, { v: 'roaster' });
  b.put('table', 12, 7); b.put('table', 14, 7);
  b.sign(10, 7, ['Lygon St, Brunswick East.', 'One deli, one record shop, four coffee places and a pilates studio in an 1892 draper\'s. This is the strip.']);
  b.put('eshop', 23, 4, { v: 'plants' });
  b.put('eshop', 28, 4, { v: 'realty' });
  b.put('eshop', 33, 4, { v: 'pilates' });
  b.put('eshop', 38, 4, { v: 'pub' });
  b.put('picnic', 39, 7);

  // South side: the record shop, the coffee window and more shops
  b.put('eshop', 2, 15, { v: 'records' });
  b.exit(5, 14, 1, 1, 'records', 'door', 'Wax Lyrical');
  b.put('gigposters', 7, 15);
  b.put('eshop', 9, 15, { v: 'gelato' });
  b.put('eshop', 14, 15, { v: 'roaster' });
  b.put('table', 15, 14); b.put('table', 18, 14);
  b.put('eshop', 20, 15, { v: 'plants' });
  b.put('eshop', 25, 15, { v: 'deli' });
  b.put('eshop', 30, 15, { v: 'pilates' });
  b.put('eshop', 35, 15, { v: 'realty' });
  b.put('graffiti', 40, 16, { v: 'paste' });

  // Street furniture and the back lane behind the south shops
  b.put('tramstop', 24, 7, { v: '1' }); b.put('tramstop', 20, 14, { v: '1' });
  b.put('powerpole', 8, 7); b.put('powerpole', 31, 7);
  b.put('streettree', 16, 14); b.put('streettree', 34, 14);
  b.put('bikehoop', 26, 14); b.put('bikehoop', 27, 14);
  b.fill(0, 22, 44, 3, 'b').fill(1, 24, 3, 1, '"');
  b.fenceH(0, 43, 25, 'paling');
  b.put('bin', 10, 22, { v: 'red' }); b.put('bin', 11, 22, { v: 'yellow' }); b.put('crate', 28, 22, { v: 'blue' });
  b.put('rollerdoor', 40, 22, { v: 'tagged' });
  b.put('car', 6, 14, { v: 'white' }); b.put('car', 29, 7, { v: 'red' });

  b.exit(0, 7, 1, 8, 'nicholson', 'west', 'Nicholson St');
  b.exit(0, 22, 1, 3, 'bowls', 'west', 'Brunswick Bowls Club');
  b.exit(18, 0, 4, 1, null, null, 'Moreland Rd, Coburg', ['Lygon St carries on north towards Moreland Rd.', 'Not today. Bring Betty back some coffee beans when you do.']);
  b.entry('east', 1, 8, 'right').entry('bowls', 2, 23, 'right').entry('north', 19, 2, 'down')
    .entry('eastdeli', 4, 8, 'down').entry('records', 5, 13, 'up');

  b.npc('kev', 6, 7, { face: 'down' });
  b.npc('tash', 12, 14, { face: 'up' });

  b.lane({ axis: 'x', pos: 10.5, dir: 1, from: -6, to: 50, every: [28, 48], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 11.5, dir: -1, from: -6, to: 50, every: [32, 52], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 8.5, dir: -1, from: -3, to: 47, every: [8, 16], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white'] });
  b.lane({ axis: 'x', pos: 13.5, dir: 1, from: -3, to: 47, every: [8, 16], speed: 56, kinds: ['veh-car-h-blue', 'veh-ute-h'] });

  b.forage(2, 23, ['croissant', 'cheese']);
  b.forage(35, 23, ['sardine', 'feather']);
  b.magpies([[20, 23], [38, 2]]);
  b.scatter([0, 0, b.w, b.h], 0.025, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
