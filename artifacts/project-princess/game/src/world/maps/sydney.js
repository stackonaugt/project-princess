// SYDNEY RD: the busiest bit of Brunswick. A1 Bakery with its big sign,
// blue wavy parapet and outdoor tables under the verandah (Spooky haunts
// the footpath out the front), a row of shops with very Brunswick names,
// the 19 tram, and bluestone back lanes full of roller doors, factories and
// street art. West to Hope St, south down Donald St, east up Sydney Rd to
// Albion St and the Edinburgh Castle.
import { MapBuilder } from '../MapBuilder.js';

export function buildSydney() {
  const b = new MapBuilder({ id: 'sydney', w: 44, h: 26, fill: 'c', seed: 101 });

  // Sydney Rd runs across the map: footpath, road, two tram tracks, road, footpath
  b.hline(0, 43, 12, 'f').hline(0, 43, 13, 'f');
  b.hline(0, 43, 14, '#').hline(0, 43, 15, '+').hline(0, 43, 16, '+').hline(0, 43, 17, '#');
  b.hline(0, 43, 18, 'f').hline(0, 43, 19, 'f');

  // The back lane behind the north shops, and the factories behind that
  b.fill(0, 6, 44, 2, 'b');
  b.fenceV(0, 1, 5, 'brickwall').fenceV(43, 1, 5, 'brickwall');
  b.put('factory', 1, 3, { v: 'rope' });
  b.put('rollerdoor', 9, 4, { v: 'tagged' }); b.put('rollerdoor', 12, 4, { v: 'grey' });
  b.graffiti(15, 5);
  b.put('factory', 19, 3, { v: 'tin' });
  b.put('rollerdoor', 27, 4, { v: 'green' });
  // A vacant lot, gone to weeds
  b.fill(30, 1, 6, 5, 'g').fill(31, 2, 3, 2, '"');
  b.fenceH(30, 35, 1, 'park').fenceV(30, 2, 5, 'park').fenceV(35, 2, 5, 'park').fenceH(31, 34, 5, 'park', [32, 33]);
  b.put('trolley', 34, 4);
  b.sign(34, 2, ['Vacant lot.', 'Approved: 14 storeys of "boutique living". Currently: weeds, a trolley and a very confident pigeon.']);
  b.graffiti(36, 5, true);
  b.put('rollerdoor', 40, 4, { v: 'grey' });
  b.put('bin', 9, 6, { v: 'red' }); b.put('bin', 10, 6, { v: 'yellow' }); b.put('bin', 18, 6, { v: 'green' });
  b.put('crate', 28, 6, { v: 'blue' }); b.put('crate', 29, 6, { v: 'red' }); b.put('bin', 42, 6, { v: 'red' });
  // Little alleys from the lane through to Sydney Rd
  b.fill(5, 8, 1, 4, 'b').fill(36, 8, 1, 4, 'b');

  // North side: A1 Bakery and its neighbours
  b.put('bshop', 1, 9, { v: 'tattoo' });
  b.put('a1bakery', 6, 9);
  // (no verandah: Seb asked for the A1 awning to go)
  b.put('picnic', 7, 12); b.put('picnic', 11, 12);
  b.sign(4, 12, ['A1 Bakery.', 'Open every day. Fresh bread, za\'atar pies and the best seat on Sydney Rd. Spooky agrees.']);
  b.put('bshop', 14, 9, { v: 'oatmilk' });
  b.put('table', 15, 12); b.put('table', 17, 12);
  b.put('bshop', 18, 9, { v: 'opshop' });
  b.put('bbound', 22, 9);   // Brunswick Bound (inside: maps/bookshop.js)
  b.exit(25, 12, 1, 1, 'bookshop', 'door', 'Brunswick Bound');
  b.entry('bookshop', 25, 13, 'down');
  b.put('bshop', 26, 9, { v: 'origin' });
  b.put('garagecafe', 30, 9);
  b.put('table', 31, 12); b.put('table', 34, 12);
  b.put('bshop', 37, 9, { v: 'vegan' });
  b.put('terrace', 41, 9, { v: 'brick' });

  // South side, with Donald St heading off south between the shops
  b.fill(27, 20, 2, 6, '#').vline(26, 20, 25, 'f').vline(29, 20, 25, 'f');
  b.put('bshop', 1, 20, { v: 'laundro' }); b.put('redshop', 5, 20, { v: 'cream' }); b.put('shop', 9, 20, { v: 'pho' });
  b.put('shop', 13, 20, { v: 'books' }); b.put('redshop', 17, 20, { v: 'red' }); b.put('shop', 21, 20, { v: 'milk bar' });
  b.sign(25, 20, ['Donald St.', 'Quiet street, bluestone lanes, and a very important tabby.']);
  b.put('shop', 30, 20, { v: 'pizza' }); b.put('redshop', 34, 20, { v: 'cream' }); b.put('bshop', 38, 20, { v: 'yoga' });
  // ...and the lane behind them
  b.fill(0, 23, 26, 2, 'b').fill(30, 23, 14, 2, 'b').fill(1, 24, 3, 1, '"');
  b.fenceH(0, 25, 25, 'brickwall').fenceH(30, 43, 25, 'brickwall');
  b.put('bin', 8, 23, { v: 'red' }); b.put('bin', 9, 23, { v: 'yellow' }); b.put('crate', 33, 23, { v: 'blue' }); b.put('bin', 42, 23, { v: 'green' });

  // Street furniture
  b.put('tramstop', 24, 13); b.put('tramstop', 10, 18);
  b.put('powerpole', 5, 13); b.put('powerpole', 36, 13);
  b.put('powerpole', 15, 18); b.put('powerpole', 33, 18);
  b.put('streettree', 6, 18); b.put('streettree', 20, 18); b.put('streettree', 39, 18);
  b.put('bikehoop', 26, 13); b.put('bikehoop', 27, 13);

  b.exit(0, 12, 1, 8, 'hope', 'east', 'Hope St');
  b.exit(43, 12, 1, 8, 'albion', 'west', 'Albion St');
  b.exit(27, 25, 2, 1, 'donald', 'north', 'Donald St');
  b.entry('west', 1, 13, 'right').entry('east', 42, 13, 'left').entry('donald', 27, 23, 'up');

  b.npc('pearman', 16, 13, { face: 'down', at: 'sydney' });
  b.npc('jordan', 20, 12, { face: 'down' });
  b.npc('slinks', 13, 13, { face: 'left' });
  b.npc('hipster', 27, 13, { face: 'down' });

  b.lane({ axis: 'x', pos: 15.5, dir: 1, from: -6, to: 50, every: [25, 45], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 16.5, dir: -1, from: -6, to: 50, every: [30, 50], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 14.5, dir: -1, from: -3, to: 47, every: [6, 12], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 17.5, dir: 1, from: -3, to: 47, every: [6, 12], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });

  b.forage(15, 7, ['sardine', 'croissant']);
  b.forage(40, 13, ['feather', 'cheese']);
  b.forage(33, 3, ['carrot', 'tennis']);
  b.magpies([[32, 4], [22, 7]]);
  // Lived-in touches: pot plants and bikes outside shops (walk-through)
  b.scatter([0, 0, b.w, b.h], 0.02, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
