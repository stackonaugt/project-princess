// BOURKE ST at Spring St, the top of the city: Parliament House, huge, its
// steps and colonnade looking down Bourke St; the gardens beside it; across
// the road the Princess Theatre and the Imperial Hotel on the corner, with
// rooftops packed in all around. Spring St comes down from Nicholson St, and
// Bourke St's trams turn down the hill towards Swanston St.
//
//   x0-33 y0-16 the gardens   x34-39 Spring St north   x40-73 y7-16 Parliament
//   y17-18 footpath   y19-22 Bourke St (tram 20-21)   y23-24 footpath
//   y25-45 rooftops, the Princess Theatre (x6-17) and the Imperial (x55-63)
//   x64-69 Bourke St down the hill (tram 66-67) to Swanston St
import { MapBuilder } from '../MapBuilder.js';
import { hstreet, vstreet, liven } from './melbkit.js';

export function buildBourke() {
  const b = new MapBuilder({ id: 'bourke', w: 76, h: 46, fill: 'R', seed: 904 });
  b.fill(0, 0, 34, 17, '.');
  vstreet(b, 34, 0, 18, { rows: 4, tram: true });
  hstreet(b, 17, { rows: 4, tram: true });
  vstreet(b, 64, 23, 45, { rows: 4, tram: true });
  b.fill(35, 17, 4, 2, '#').fill(36, 17, 2, 2, '+');   // Spring St meets Bourke St
  b.fill(65, 23, 4, 2, '#').fill(66, 23, 2, 2, '+');   // and Bourke St turns down the hill

  // Parliament House, with its gardens and footpath
  b.put('parliament', 40, 7);
  b.sign(41, 17, ['Parliament House, Spring St.', 'If you stand on the steps long enough, someone will hand you a placard.']);
  for (const x of [44, 52, 62, 70]) b.put('lamp', x, 17);

  // The gardens beside Parliament
  b.fill(0, 8, 34, 2, 'u').fill(15, 0, 2, 17, 'u');
  for (let i = 0; i < 8; i++) b.fill(24 + i, 9 + i, 2, 1, 'u');
  for (const [x, y, v] of [[3, 3, 'elm'], [9, 4, 'elm'], [22, 3, 'plane'], [28, 4, 'elm'], [5, 13, 'plane'], [11, 14, 'elm'], [21, 13, 'elm'], [30, 12, 'fig']]) b.put('bigelm', x, y, { v });
  b.put('bench', 18, 7); b.put('bench', 6, 10); b.put('bench', 26, 7);
  b.put('fountain', 13, 10, { v: 'carlton' });
  b.wildGrass(4, 6, 2.6, 1.4); b.wildGrass(26, 14, 3, 1.4); b.wildGrass(9, 1.5, 2.4, 1);
  b.sign(17, 16, ['The Parliament Gardens.', 'Lunch for half the public servants in Victoria, and the night shift for every possum in the city.']);

  // South side: the Princess Theatre, the Imperial on the corner, rooftops all round
  b.put('princess', 6, 30);
  b.put('imperial', 55, 28);
  b.sign(13, 23, ['The Princess Theatre, 1886.', 'There is a ghost, they say: Federici, the baritone. He still has the best seat in the house.']);
  b.sign(60, 23, ['The Imperial Hotel.', 'Pots downstairs, a rooftop up top, and a politician in the corner pretending not to be one.']);
  for (const x of [4, 24, 34, 46]) b.put('streettree', x, 24);
  b.put('tramstop', 28, 23, { v: '86' }); b.put('bikehoop', 40, 24); b.put('bikehoop', 41, 24);

  b.npc('raelene', 56, 18, { face: 'down' });

  b.forage(20, 12, ['feather', 'lemon']);
  b.forage(31, 2, ['sardine', 'croissant']);
  b.magpies([[8, 7], [27, 11]]);

  b.exit(34, 0, 6, 1, 'nicholson', 'south', 'Nicholson St');
  b.exit(64, 45, 6, 1, 'swanston', 'bourke', 'Swanston St', null, { gate: 'bencarroll' });
  b.exit(0, 17, 1, 8, 'gardens', 'east', 'Carlton Gardens');
  b.entry('north', 36, 1, 'down').entry('south', 66, 44, 'up').entry('west', 1, 20, 'right');
  liven(b, 0.006);
  b.noDress = true;
  return b.finish();
}
