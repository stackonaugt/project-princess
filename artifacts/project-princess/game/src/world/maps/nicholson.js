// NICHOLSON ST, CARLTON: 47-49 Nicholson St on the corner of Murchison St,
// where Seb grew up (from the owner's photos), in a tight grid of terraces
// packed back to back with bluestone lanes between. The only green is
// Murchison Square. Across Nicholson St, on the Fitzroy side, white boom-style
// terraces wall to wall. The 96 tram runs up the middle.
// North up Nicholson St to Brunswick East, south down it to Spring St and
// Bourke St, and down the side street past the square to Carlton Gardens.
//
//   x0-29 Carlton: terraces and roofs, a lane (y6-7), Murchison St (y18-21),
//   Murchison Square (x2-17, y22-37) and the side street (x18-21)
//   x30-35 Nicholson St (tram 32-33)   x36-39 the boom terraces   x40-47 Fitzroy roofs
import { MapBuilder } from '../MapBuilder.js';
import { hstreet, vstreet, liven } from './melbkit.js';

export function buildNicholson() {
  const b = new MapBuilder({ id: 'nicholson', w: 48, h: 40, fill: 'Y', seed: 911 });
  vstreet(b, 30, 0, 39, { rows: 4, tram: true });
  hstreet(b, 18, { rows: 2, walk: 1, x0: 2, x1: 29, cars: false });
  vstreet(b, 18, 22, 39, { rows: 2 });
  b.fill(2, 6, 28, 2, 'b').fill(22, 26, 8, 2, 'b');   // bluestone lanes

  // Carlton, north of Murchison St: terraces on the lane, roofs, terraces on the street
  const looks = ['brick', 'cream', 'sage', 'blue', 'twostorey', 'red'];
  for (let i = 0; i < 9; i++) b.put('carltonterrace', 2 + i * 3, 2, { v: looks[(i * 5 + 1) % 6] });
  for (let i = 0; i < 6; i++) b.put('carltonterrace', 2 + i * 3, 14, { v: looks[(i * 7 + 2) % 6] });
  b.put('nicholson', 20, 15);
  b.sign(24, 18, ['47-49 Nicholson St, Carlton.', 'Seb grew up here. The walls have been tagged more times than the trams have run late.']);
  b.put('bin', 9, 6, { v: 'garbage' }); b.put('bin', 10, 6, { v: 'yellow' }); b.put('bin', 24, 6, { v: 'green' });
  b.put('lamp', 12, 18); b.put('bikehoop', 16, 21);

  // Murchison Square, the only green for blocks
  b.fill(2, 22, 16, 16, '.');
  b.fill(2, 29, 16, 1, '=').fill(9, 22, 1, 16, '=');
  b.put('tall', 3, 23, { v: 'biggum' }); b.put('tall', 15, 24, { v: 'biggum' }); b.put('tree', 5, 34, { v: 'oak' }); b.put('tree', 14, 35, { v: 'oak' });
  b.put('bigelm', 12, 26, { v: 'elm' });
  b.put('bench', 6, 28); b.put('bench', 11, 30); b.put('lamp', 10, 28);
  b.wildGrass(5, 25, 2.4, 1.6); b.wildGrass(13, 33, 2.6, 1.6);
  b.sign(17, 22, ['Murchison Square.', 'Every kid on the block learnt to ride a bike here. A few of the trees still have the scars.']);

  // South of Murchison St, beside the square
  b.put('carltonterrace', 22, 22, { v: 'cream' }); b.put('carltonterrace', 25, 22, { v: 'red' });
  b.put('carltonterrace', 22, 28, { v: 'sage' }); b.put('carltonterrace', 25, 28, { v: 'brick' });

  // The Fitzroy side: white boom-style terraces, wall to wall
  ['white', 'cream', 'white', 'grey', 'white', 'blush', 'white'].forEach((v, i) => b.put('boomterrace', 36, 1 + i * 5, { v }));
  b.put('tramstop', 35, 20, { v: '96' });
  for (const y of [3, 11, 24, 33]) b.put('streettree', 30, y);
  for (const y of [8, 28]) b.put('lamp', 30, y);

  b.forage(15, 31, ['lemon', 'tennis']);
  b.forage(27, 7, ['feather', 'chicken']);
  b.magpies([[6, 32], [14, 27]]);

  b.exit(30, 0, 6, 1, 'ebnicholson', 'west', 'Nicholson St, Brunswick East');
  b.exit(30, 39, 6, 1, 'bourke', 'north', 'Spring St');
  b.exit(18, 39, 4, 1, 'gardens', 'north', 'Carlton Gardens');
  b.entry('north', 32, 1, 'down').entry('south', 32, 38, 'up').entry('gardens', 19, 38, 'up');
  liven(b, 0.008);
  b.noDress = true;
  return b.finish();
}
