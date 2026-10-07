// NICHOLSON ST, Brunswick East, from the owner's notes and photos. On the
// north side, from the left: the black FORAGING shopfront, the sandwich
// parlour and the long East Brunswick Take Away and Milk Bar (where the
// Sorceress works), wall to wall; then a side street running up, one house,
// and 199 Nicholson St, the big red brick bungalow where Seb and Sinead used
// to live (the first September Babies parties), then Nonna Concetta's with her chooks. Back yards fill the space
// behind. On the south side, houses, the new green apartments and the 96 tram
// stop (the myki reader). The 96 runs down the middle.
//
//   y0-4 back yards   y5-8 shops and houses   y9 footpath   y10-16 Nicholson St (tram 12-14)
//   y17 footpath   y18-25 houses, the apartments and Victoria St
import { MapBuilder } from '../MapBuilder.js';

export function buildEbNicholson() {
  const b = new MapBuilder({ id: 'ebnicholson', w: 46, h: 26, fill: 'c', seed: 611 });

  b.hline(0, 45, 9, 'f');
  b.fill(0, 10, 46, 2, '#').hline(0, 45, 12, '+').hline(0, 45, 13, '+');
  b.fill(0, 14, 46, 3, '#').hline(0, 45, 17, 'f');
  b.fill(20, 11, 6, 1, 'z').fill(20, 15, 6, 1, 'z');

  // The shops on the north side, wall to wall, the milk bar twice as long
  b.fill(0, 8, 16, 1, 'f');
  b.put('nichshop', 0, 5, { v: 'mural' });
  b.put('nichshop', 4, 5, { v: 'sandwich' });
  b.put('nichmilkbar', 8, 5);
  b.exit(14, 8, 1, 1, 'ebmilkbar', 'door', 'East Brunswick Take Away and Milk Bar');   // right in front of its door
  b.put('bin', 3, 8, { v: 'garbage' }); b.put('phonebooth', 15, 8);
  b.sign(7, 8, ['The milk bar.', 'Potato cakes, cold drinks and, behind the counter, a shelf of powerful protection spells. The prices move.']);
  // behind the shops: a bluestone lane, bins and a back fence
  b.fill(0, 0, 16, 5, 'c'); b.fill(0, 2, 16, 1, 'b');
  b.fenceH(0, 15, 1, 'paling'); b.put('bin', 2, 3, { v: 'garbage' }); b.put('bin', 3, 3, { v: 'yellow' });
  b.put('rollerdoor', 9, 3, { v: 'tagged' });

  // A side street running up between the shops and the houses
  b.fill(16, 0, 1, 10, 'f').fill(17, 0, 2, 10, '#').fill(19, 0, 1, 10, 'f');
  b.put('streettree', 19, 4);

  // One house, then 199 Nicholson St, then Nonna Concetta's
  b.fill(20, 0, 26, 9, '.');
  b.put('bungalow', 20, 5, { v: 'deco' });
  b.put('house199', 26, 4);
  b.put('bungalow', 36, 5, { v: 'cream' });
  b.fenceH(20, 45, 8, 'brickwall', [22, 30, 38]);
  b.fill(26, 8, 7, 1, '.'); b.put('tall', 27, 8, { v: 'cypress' }); b.put('tree', 32, 8, { v: 'lemon' }); b.fill(28, 8, 2, 1, '"');
  b.sign(31, 9, ['199 Nicholson St.', 'Seb and Sinead lived here. The very first September Babies parties happened in this backyard. The lemon tree survived them all.']);
  b.put('letterbox', 29, 8);
  // back yards behind the houses: paling fences, a Hills hoist, a shed, a trampoline
  b.fenceH(20, 45, 3, 'paling', [24, 33, 41]);
  b.fenceV(25, 0, 2, 'paling'); b.fenceV(34, 0, 2, 'paling');
  b.put('hoist', 22, 1); b.put('gardenshed', 30, 0); b.put('trampoline', 26, 0); b.put('tree', 33, 1, { v: 'fruit' });
  b.put('chookpen', 38, 0);
  b.put('tree', 43, 1, { v: 'lemon' }); b.fill(41, 4, 3, 1, '"');
  b.sign(40, 8, ['Nonna Concetta\'s.', 'Three chooks, one lemon tree, and very strong views on which side of the street the bins go.']);
  b.put('bin', 41, 9, { v: 'garbage' }); b.put('bin', 42, 9, { v: 'yellow' });
  b.put('powerpole', 23, 9); b.put('powerpole', 44, 9);
  b.put('streettree', 34, 9);

  // The south side: houses, a graffiti wall and the new apartments with the tram stop
  b.put('bungalow', 1, 19, { v: 'red' }); b.put('bungalow', 8, 19, { v: 'corner' });
  b.fenceH(0, 14, 22, 'brickwall', [3, 10]); b.fill(0, 22, 15, 1, '.');
  b.fill(0, 23, 15, 3, '.'); b.put('tree', 2, 24, { v: 'gum' }); b.put('hoist', 11, 24);
  b.graffiti(15, 20);
  b.put('greenapts', 22, 18);
  b.put('tramstop', 20, 17, { v: '96' });
  b.put('myki', 21, 17, { travel: true });
  b.sign(19, 23, ['Nicholson St tram stop. Route 96.', 'No train out here. Tap your myki at the reader and the 96 will take you anywhere you have already been.']);
  b.put('bikehoop', 41, 17); b.put('bikehoop', 42, 17);
  b.put('bungalow', 31, 19, { v: 'cream' });
  b.put('bungalow', 37, 19, { v: 'deco' });
  b.fenceH(30, 45, 22, 'brickwall', [33, 39]);
  b.fill(30, 23, 16, 3, '.');
  b.wildGrass(42, 24, 2.5, 1.2);

  b.put('car', 4, 17, { v: 'white' }); b.put('car', 30, 17, { v: 'blue' }); b.put('car', 37, 9, { v: 'red' });

  b.exit(0, 9, 1, 9, 'nicholson', 'north', 'Nicholson St, Carlton');
  b.exit(45, 9, 1, 9, 'holmes', 'south', 'Holmes St');
  b.exit(0, 0, 46, 1, 'fleming', 'south', 'Fleming Park');   // the whole top edge, back to the park
  b.entry('west', 1, 10, 'right').entry('east', 44, 10, 'left').entry('station', 21, 16, 'down')
    .edgeEntry('north', 'x', 1, 0, 45, 'down').entry('milkbar', 14, 9, 'down');

  b.npc('concetta', 39, 9, { face: 'down' });
  b.npc('hatman', 11, 9, { face: 'up' });

  b.lane({ axis: 'x', pos: 12.5, dir: 1, from: -6, to: 52, every: [26, 44], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 13.5, dir: -1, from: -6, to: 52, every: [30, 50], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 10.5, dir: -1, from: -3, to: 49, every: [7, 14], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 15.5, dir: 1, from: -3, to: 49, every: [7, 14], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });
  b.lane({ axis: 'x', pos: 16.5, dir: 1, from: -2, to: 48, every: [14, 28], speed: 72, kinds: ['veh-car-h-white'] });

  b.forage(42, 4, ['lemon', 'egg']);
  b.forage(43, 24, ['tennis', 'sardine']);
  b.magpies([[34, 7], [40, 24]]);
  b.scatter([0, 0, b.w, b.h], 0.02, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
