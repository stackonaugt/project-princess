// LYGON ST, Carlton: Melbourne's little Italy, from the owner's photos. Two
// rows of two-storey Victorian shops with iron lace verandahs and striped
// canopies, every one different, plane trees and umbrellas along the
// footpath, red sports cars parked out the front. Bluestone lanes run behind
// both rows, with more rooftops behind them.
// North up the side street to Brunswick, west to Carlton Gardens, east to
// Lygon St in Brunswick East. The gelateria has a door inside.
//
//   y0-3 rooftops   y4-5 back lane   y6-11 north shops   y12-13 footpath
//   y14 parking   y15-18 Lygon St (tram 16-17)   y19 parking   y20-21 footpath
//   y22-27 south shops   y28-29 back lane   y30-35 rooftops   side street x27-30
import { MapBuilder } from '../MapBuilder.js';
import { CARS, vstreet, liven } from './melbkit.js';

export function buildLygon() {
  const b = new MapBuilder({ id: 'lygon', w: 64, h: 36, fill: 'R', seed: 901 });
  // Lygon St itself
  b.fill(0, 12, 64, 2, 'f').fill(0, 14, 64, 6, '#').fill(0, 16, 64, 2, '+').fill(0, 20, 64, 2, 'f');
  b.lane({ axis: 'x', pos: 15.5, dir: -1, from: -4, to: 69, every: [7, 14], speed: 44, kinds: CARS });
  b.lane({ axis: 'x', pos: 16.5, dir: -1, from: -6, to: 71, every: [26, 44], speed: 44, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 17.5, dir: 1, from: -6, to: 71, every: [26, 44], speed: 44, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 18.5, dir: 1, from: -4, to: 69, every: [7, 14], speed: 44, kinds: CARS });
  // The side street north to Brunswick, and the back lanes
  b.fill(0, 4, 64, 2, 'b').fill(0, 28, 64, 2, 'b');
  vstreet(b, 27, 0, 13, { rows: 2 });
  b.fill(26, 22, 2, 6, 'b');   // a lane through the south shops to the back

  // North side: five shops, the side street, five more, two terraces
  ['trattoria', 'pasticceria', 'gelato', 'books', 'caffe'].forEach((v, i) => b.put('carltonshop', 1 + i * 5, 6, { v }));
  ['cinema', 'salumeria', 'bella', 'florist', 'vino'].forEach((v, i) => b.put('carltonshop', 31 + i * 5, 6, { v }));
  b.put('carltonterrace', 56, 8, { v: 'twostorey' }); b.put('carltonterrace', 59, 8, { v: 'red' });
  b.exit(14, 12, 1, 1, 'gelateria', 'door', 'Gelateria');
  // South side: five shops, the lane, three more, then six terraces
  ['pizzeria', 'meatball', 'records', 'bakery', 'barber'].forEach((v, i) => b.put('carltonshop', 1 + i * 5, 22, { v }));
  ['shoes', 'tailor', 'pasta'].forEach((v, i) => b.put('carltonshop', 28 + i * 5, 22, { v }));
  b.put('carltonterrace', 43, 24, { v: 'cream' }); b.put('carltonterrace', 46, 24, { v: 'brick' }); b.put('carltonterrace', 49, 24, { v: 'sage' });
  b.put('carltonterrace', 52, 24, { v: 'blue' }); b.put('carltonterrace', 55, 24, { v: 'twostorey' }); b.put('carltonterrace', 58, 24, { v: 'red' });

  // The footpaths: plane trees, umbrellas, lamps, a tram stop
  for (const x of [5, 15, 24, 35, 45, 55]) b.put('streettree', x, 13);
  for (const x of [3, 8, 18, 22, 38, 42, 48, 52]) b.put('parasol', x, 13, { v: ['red', 'green', 'cream'][x % 3] });
  for (const x of [10, 33, 60]) b.put('lamp', x, 12);
  b.put('tramstop', 40, 20, { v: '1' });
  for (const x of [8, 20, 36, 50]) b.put('streettree', x, 20);
  b.put('bikehoop', 30, 21); b.put('bikehoop', 31, 21); b.put('lamp', 14, 20); b.put('lamp', 46, 20);
  b.sign(29, 21, ['Lygon St, Carlton.', 'Iron lace, striped canopies and a spruiker every ten metres. Little Italy since the 1950s.']);
  // Sports cars parked out the front, as in the owner's photos
  for (const [x, v] of [[2, 'red'], [6, 'red'], [10, 'yellow'], [34, 'red'], [44, 'black'], [56, 'red']]) b.put('sportscar', x, 14, { v });
  for (const [x, v] of [[4, 'black'], [16, 'red'], [22, 'red'], [38, 'yellow'], [50, 'red'], [58, 'red']]) b.put('sportscar', x, 19, { v });

  // The back lanes: bins, crates and the odd weed patch
  for (const [x, v] of [[3, 'garbage'], [4, 'yellow'], [20, 'red'], [36, 'garbage'], [37, 'yellow'], [52, 'red']]) b.put('bin', x, 4, { v });
  b.put('crate', 12, 4, { v: 'red' }); b.put('crate', 44, 4, { v: 'blue' });
  for (const [x, v] of [[6, 'garbage'], [7, 'yellow'], [33, 'red'], [47, 'garbage']]) b.put('bin', x, 28, { v });
  b.put('crate', 16, 28, { v: 'blue' }); b.put('skip', 40, 28);
  b.fill(58, 2, 6, 2, '.'); b.wildGrass(61, 3, 2.6, 1.2);
  b.fill(0, 30, 7, 2, '.'); b.wildGrass(3, 30, 2.6, 1.2);
  b.fill(19, 30, 6, 2, '.'); b.wildGrass(21, 31, 2.4, 1);

  b.npc('spruiker', 9, 12, { face: 'down' });
  b.npc('mia', 12, 20, { path: [[12, 20], [34, 20], [12, 20]] });
  b.npc('enzo', 41, 12, { face: 'right' });
  b.npc('vince', 43, 12, { face: 'left' });

  b.forage(61, 2, ['lemon', 'cheese']);
  b.forage(2, 31, ['tennis', 'croissant']);
  b.forage(22, 5, ['basil', 'tomato']);
  b.magpies([[60, 3], [21, 30]]);

  b.exit(27, 0, 4, 1, 'flemington', 'south', 'Flemington');
  b.exit(0, 12, 1, 10, 'gardens', 'west', 'Carlton Gardens');
  b.exit(63, 12, 1, 10, 'eblygon', 'west', 'Lygon St, Brunswick East');
  b.entry('north', 28, 2, 'down').entry('west', 1, 13, 'right').entry('east', 62, 13, 'left').entry('gelateria', 14, 13, 'down');
  liven(b, 0.01);
  b.noDress = true;
  return b.finish();
}
