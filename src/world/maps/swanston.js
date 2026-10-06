// SWANSTON ST at the State Library, which is really big: the portico, the
// wings and the green dome of the reading room (door inside), then the big
// lawns either side of the paved forecourt where everyone eats lunch and plays
// giant chess. Beside it, a warehouse with a balcony bar on top. Across the
// road, Melbourne Central's glass cone over the old shot tower, and rooftops
// packed in everywhere else.
// The side street goes up to Bourke St, the road goes east to Flinders St,
// and a bluestone alley goes down into the laneways.
//
//   y0-15 the library (x6-41), the balcony bar (x44-52), the side street (x60-65)
//   y16-26 lawns (x2-15, x32-45) and the forecourt (x16-31)
//   y27-28 footpath   y29-32 Swanston St (tram 30-31)   y33-34 footpath
//   y35-47 rooftops, Melbourne Central (x16-29), the alley (x40-42)
import { MapBuilder } from '../MapBuilder.js';
import { hstreet, vstreet, liven } from './melbkit.js';

export function buildSwanston() {
  const b = new MapBuilder({ id: 'swanston', w: 72, h: 48, fill: 'R', seed: 903 });
  vstreet(b, 60, 0, 28, { rows: 4, tram: true });
  hstreet(b, 27, { rows: 4, tram: true });
  b.fill(61, 27, 4, 2, '#').fill(62, 27, 2, 2, '+');

  // The State Library, its lawns and forecourt
  b.put('statelibrary', 6, 6);
  b.fill(2, 16, 14, 11, '.').fill(32, 16, 14, 11, '.').fill(16, 16, 16, 11, 'k').fill(46, 16, 14, 11, 'f');
  b.fill(2, 22, 44, 1, 'k');
  b.exit(23, 16, 2, 1, 'reading', 'door', 'The Reading Room');
  b.put('chessboard', 18, 20);
  b.put('chesspiece', 19, 21, { v: 'king' }); b.put('chesspiece', 21, 22, { v: 'pawn' }); b.put('chesspiece', 18, 23, { v: 'knight' });
  for (const x of [16, 31]) { b.put('lamp', x, 17); b.put('lamp', x, 25); }
  for (const [x, y, v] of [[3, 17, 'elm'], [12, 18, 'plane'], [6, 24, 'elm'], [36, 17, 'plane'], [43, 19, 'elm'], [39, 25, 'elm']]) b.put('bigelm', x, y, { v });
  b.put('bench', 8, 21); b.put('bench', 38, 21); b.put('bench', 26, 25);
  b.wildGrass(8, 19, 2.6, 1.6); b.wildGrass(40, 24, 3, 1.4);
  b.sign(29, 17, ['State Library Victoria. Free, and open to everyone.', 'The reading room has a dome six storeys high. Bring a book. Or just look up.']);

  // Beside it: the balcony bar, and a plaza to the side street
  b.put('balconybar', 44, 9);
  b.put('parasol', 48, 18, { v: 'green' }); b.put('parasol', 52, 18, { v: 'cream' }); b.put('parasol', 56, 18, { v: 'red' });
  b.put('streettree', 50, 24); b.put('streettree', 57, 24); b.put('bikehoop', 47, 25); b.put('bikehoop', 48, 25);
  b.sign(53, 16, ['The Balcony, upstairs.', 'Spritz with a view of the library. Everyone says they are going in for one.']);

  // The street, and across it Melbourne Central
  b.put('tramstop', 24, 33, { v: '6' }); b.put('tramstop', 44, 27, { v: '19' });
  for (const x of [6, 14, 34, 52]) b.put('streettree', x, 34);
  b.put('melbcentral', 16, 40);
  b.sign(31, 34, ['Melbourne Central.', 'A glass cone over a shot tower from 1888. They made lead shot by dropping it fifty metres. Now it is a food court.']);
  // The alley down to the laneways
  b.fill(40, 35, 3, 13, 'b');
  b.put('bin', 40, 38, { v: 'garbage' }); b.put('graffiti', 42, 41, { v: 'tags' });

  b.npc('chesskev', 17, 21, { face: 'right' });
  b.npc('luca', 36, 28, { face: 'down' });

  b.forage(4, 25, ['croissant', 'sardine']);
  b.forage(44, 17, ['feather', 'tennis']);
  b.forage(41, 44, ['carrot', 'cheese']);
  b.magpies([[10, 23], [35, 20]]);

  b.exit(60, 0, 6, 1, 'bourke', 'south', 'Bourke St');
  b.exit(71, 27, 1, 8, 'flinders', 'west', 'Flinders St');
  b.exit(40, 47, 3, 1, 'laneways', 'north', 'Hosier Lane');
  b.exit(0, 27, 1, 8, 'gardens', 'south', 'Carlton Gardens');
  b.entry('bourke', 62, 1, 'down').entry('west', 1, 30, 'right').entry('east', 70, 28, 'left').entry('south', 41, 46, 'up').entry('reading', 24, 17, 'down');
  liven(b, 0.006);
  b.noDress = true;
  return b.finish();
}
