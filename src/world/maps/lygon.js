// LYGON ST, Carlton: Melbourne's little Italy. Trattorias with striped
// awnings and umbrellas on the footpath (and a spruiker out the front of each),
// the old picture palace, the gelateria (door inside), and behind the south
// shops a piazza with a bocce court where the nonnos hold court.
// North up the side street to Brunswick, east to Carlton Gardens, south down
// to Swanston St and the city. West is Melbourne Uni (locked for now).
//
//   y0-8   side street north, back lots, north shops (y6-8)
//   y9-10  footpath (umbrellas on y10)   y11-14 Lygon St   y15-16 footpath
//   y17-19 south shops   y20-29 the piazza (bocce, lawn, plane trees); side street south x42-45
import { MapBuilder } from '../MapBuilder.js';
import { hstreet, vstreet, tables, furniture, liven } from './melbkit.js';

export function buildLygon() {
  const b = new MapBuilder({ id: 'lygon', w: 50, h: 30, fill: 'c', seed: 901 });
  hstreet(b, 9, { rows: 4 });
  vstreet(b, 4, 0, 8);
  vstreet(b, 42, 17, 29);

  // Back lots behind the north shops
  b.fill(8, 0, 34, 5, 'b');
  b.put('rollerdoor', 9, 2, { v: 'grey' }); b.put('bin', 13, 3, { v: 'garbage' }); b.put('bin', 14, 3, { v: 'yellow' });
  b.put('crate', 20, 3, { v: 'red' }); b.put('crate', 21, 3, { v: 'blue' }); b.put('skip', 30, 3);
  b.put('graffiti', 34, 1, { v: 'paste' });
  b.fill(43, 0, 7, 5, '.'); b.wildGrass(46, 2, 2.2, 1.2);   // a weedy corner lot

  // North side of Lygon St
  b.put('terrace', 0, 6, { v: 'brick' });
  b.put('trattoria', 8, 6, { v: 'pasta' });
  b.put('cinema', 12, 6);
  b.put('trattoria', 18, 6, { v: 'nonna' });
  b.put('gelateria', 22, 6);
  b.exit(25, 9, 1, 1, 'gelateria', 'door', 'Gelateria');
  b.put('trattoria', 26, 6, { v: 'pizza' });
  b.put('terrace', 30, 6, { v: 'sand' });
  b.put('trattoria', 33, 6, { v: 'espresso' });
  b.put('shop', 37, 6, { v: 'bakery' });
  b.put('trattoria', 41, 6, { v: 'cannoli' });
  b.put('terrace', 45, 6, { v: 'cream' });
  tables(b, 10, 9, 47, { step: 4, skip: [25, 4, 5, 6, 7] });

  // South side
  b.put('terrace', 0, 17, { v: 'sage' });
  b.put('shop', 3, 17, { v: 'books' });
  b.put('bshop', 7, 17, { v: 'vinyl' });
  b.put('cafe', 11, 17);
  b.put('redshop', 15, 17, { v: 'cream' });
  b.put('terrace', 19, 17, { v: 'brick' });
  b.put('terrace', 22, 17, { v: 'sand' });
  b.fill(25, 17, 3, 3, 'f');                                   // walkway through to the piazza
  b.put('bshop', 28, 17, { v: 'opshop' });
  b.put('terrace', 32, 17, { v: 'cream' });
  b.put('bshop', 35, 17, { v: 'yoga' });
  b.put('terrace', 39, 17, { v: 'brick' });
  b.put('terrace', 46, 17, { v: 'sage' });
  furniture(b, 15, 2, 40, { step: 5, skip: [26] });
  b.put('busshelter', 30, 15);
  b.sign(24, 16, ['Piazza Italia, through here.', 'Bocce most afternoons. The nonnos have been arguing about one point since 1978.']);

  // The piazza: pavers round the bocce court, then lawn and plane trees
  b.fill(0, 20, 42, 10, '.');
  b.fill(2, 20, 24, 6, 'k');
  b.put('bocce', 4, 22);
  b.put('bench', 4, 20); b.put('bench', 9, 20); b.put('bench', 14, 25);
  b.put('table', 20, 21); b.put('table', 22, 23); b.put('parasol', 18, 23, { v: 'green' });
  b.put('tall', 1, 27, { v: 'biggum' }); b.put('streettree', 12, 27); b.put('streettree', 28, 22); b.put('streettree', 36, 27);
  b.put('tree', 32, 24, { v: 'lemon' });
  b.wildGrass(31, 27, 4, 1.6); b.wildGrass(7, 28, 3, 1.2); b.wildGrass(38, 22, 2.4, 1.4);
  b.sign(26, 20, ['A plaque: "Piazza Italia. A gift to Carlton."', 'Someone has added, in texta: "Best coffee is still at my mum\'s."']);

  b.npc('spruiker', 16, 10, { face: 'down' });
  b.npc('mia', 12, 15, { path: [[12, 15], [24, 15], [12, 15]] });
  b.npc('enzo', 6, 21, { face: 'down' });
  b.npc('vince', 12, 21, { face: 'down' });

  b.forage(34, 26, ['lemon', 'cheese']);
  b.forage(45, 3, ['tennis', 'croissant']);
  b.forage(20, 27, ['basil', 'tomato']);
  b.magpies([[30, 28], [8, 26]]);

  b.exit(4, 0, 4, 1, 'brunswick', 'south', 'Brunswick');
  b.exit(49, 11, 1, 1, 'gardens', 'west', 'Carlton Gardens');
  b.exit(42, 29, 4, 1, 'swanston', 'north', 'Swanston St');
  b.exit(0, 11, 1, 1, null, null, 'Melbourne Uni', ['Grattan St heads off to Melbourne Uni.', 'Mia says the library is lovely. You are not enrolled. Another day.']);
  b.entry('north', 5, 2, 'down').entry('east', 48, 12, 'left').entry('south', 43, 27, 'up').entry('gelateria', 25, 10, 'down');
  liven(b);
  return b.finish();
}
