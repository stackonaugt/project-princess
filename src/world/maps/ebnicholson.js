// NICHOLSON ST, Brunswick East. 199 Nicholson St, the red brick bungalow
// where Helen and Paddy used to live, behind its red brick wall and its
// overgrown yucca. Next door, the cream brick deco house. Down on the
// Victoria St corner, the shop strip: the sandwich parlour, the East
// Brunswick Take Away and Milk Bar (where the Sorceress works), and the
// black shopfront with the brush lettering. Across the road, the new green
// apartments. The 96 tram runs down the middle; its stop is the myki reader.
//
//   y0-8 houses   y9 footpath   y10-16 Nicholson St (tram 12-14)   y17 footpath
//   y18-25 shops, the apartments and Victoria St
import { MapBuilder } from '../MapBuilder.js';

export function buildEbNicholson() {
  const b = new MapBuilder({ id: 'ebnicholson', w: 46, h: 26, fill: 'c', seed: 611 });

  b.hline(0, 45, 9, 'f');
  b.fill(0, 10, 46, 2, '#').hline(0, 45, 12, '+').hline(0, 45, 13, '+');
  b.fill(0, 14, 46, 3, '#').hline(0, 45, 17, 'f');
  b.fill(20, 11, 6, 1, 'z').fill(20, 15, 6, 1, 'z');

  // 199 Nicholson St and its neighbours
  b.put('bungalow', 2, 5, { v: 'red' });
  b.put('bungalow', 9, 5, { v: 'deco' });
  b.put('bungalow', 16, 5, { v: 'cream' });
  b.fenceH(1, 21, 8, 'brickwall', [5, 12, 19]);
  b.fill(1, 8, 21, 1, '.').fill(6, 8, 2, 1, '"');
  b.put('tall', 7, 8, { v: 'cypress' }); b.put('tree', 14, 8, { v: 'lemon' });
  b.sign(4, 8, ['199 Nicholson St.', 'Helen and Paddy lived here before the twins, the mayoring and the house out west. The lemon tree is still going.']);
  b.put('letterbox', 12, 8);
  // Nonna Concetta's place and her chooks, up the top end
  b.put('bungalow', 24, 5, { v: 'cream' });
  b.fenceH(23, 31, 8, 'brickwall', [27]);
  b.fill(32, 0, 9, 8, '.');
  b.fenceH(32, 40, 8, 'picket', [36]).fenceV(31, 0, 8, 'picket').fenceV(41, 0, 8, 'picket');
  b.put('chookpen', 34, 3);
  b.put('tree', 39, 5, { v: 'lemon' }); b.put('tree', 32, 2, { v: 'lemon' });
  b.fill(37, 6, 3, 2, '"');
  b.sign(33, 8, ['Nonna Concetta\'s.', 'Three chooks, one lemon tree, and very strong views on which side of the street the bins go.']);
  b.put('bin', 28, 9, { v: 'garbage' }); b.put('bin', 29, 9, { v: 'yellow' });
  b.put('powerpole', 23, 9); b.put('powerpole', 43, 9);
  b.put('streettree', 10, 9); b.put('streettree', 30, 9);

  // The shop strip on the south side, with the milk bar in the middle
  b.put('nichshop', 2, 18, { v: 'sandwich' });
  b.put('nichshop', 7, 18, { v: 'milkbar' });
  b.exit(9, 23, 1, 1, 'ebmilkbar', 'door', 'East Brunswick Take Away and Milk Bar');
  b.put('nichshop', 12, 18, { v: 'mural' });
  b.put('phonebooth', 6, 23);
  b.put('bin', 11, 23, { v: 'garbage' });
  b.sign(17, 23, ['The milk bar.', 'Potato cakes, cold drinks and, behind the counter, a shelf of powerful protection spells. The prices move.']);
  b.graffiti(17, 20);

  // The new apartments on the Victoria St corner, with the tram stop out front
  b.put('greenapts', 22, 18);
  b.put('tramstop', 20, 17, { v: '96' });
  b.put('myki', 21, 17, { travel: true });
  b.sign(19, 23, ['Nicholson St tram stop. Route 96.', 'No train out here. Tap your myki at the reader and the 96 will take you anywhere you have already been.']);
  b.put('bikehoop', 41, 17); b.put('bikehoop', 42, 17);
  // Nicholson St carries on south to Carlton
  b.fill(32, 18, 3, 8, 'f');
  b.put('bungalow', 36, 20, { v: 'red' });
  b.fenceH(35, 45, 23, 'brickwall', [39]);
  b.fill(35, 23, 11, 1, '.');
  b.wildGrass(42, 24, 2.5, 1.2);

  b.put('car', 4, 17, { v: 'white' }); b.put('car', 30, 17, { v: 'blue' }); b.put('car', 15, 9, { v: 'red' });

  b.exit(0, 9, 1, 9, 'nicholson', 'north', 'Nicholson St, Carlton');
  b.exit(45, 9, 1, 9, 'holmes', 'south', 'Holmes St');
  b.exit(0, 0, 46, 1, 'fleming', 'south', 'Fleming Park');   // the whole top edge, back to the park
  b.entry('west', 1, 10, 'right').entry('east', 44, 10, 'left').entry('station', 21, 16, 'down')
    .edgeEntry('north', 'x', 1, 0, 45, 'down').entry('milkbar', 9, 24, 'down');

  b.npc('concetta', 36, 7, { face: 'down' });
  b.npc('hatman', 13, 24, { face: 'up' });

  b.lane({ axis: 'x', pos: 12.5, dir: 1, from: -6, to: 52, every: [26, 44], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 13.5, dir: -1, from: -6, to: 52, every: [30, 50], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 10.5, dir: -1, from: -3, to: 49, every: [7, 14], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 15.5, dir: 1, from: -3, to: 49, every: [7, 14], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });
  b.lane({ axis: 'x', pos: 16.5, dir: 1, from: -2, to: 48, every: [14, 28], speed: 72, kinds: ['veh-car-h-white'] });

  b.forage(38, 7, ['lemon', 'egg']);
  b.forage(43, 24, ['tennis', 'sardine']);
  b.magpies([[34, 7], [40, 24]]);
  b.scatter([0, 0, b.w, b.h], 0.02, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
