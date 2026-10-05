// NICHOLSON ST, CARLTON: 47-49 Nicholson St on the corner of Murchison St,
// where Seb grew up (from the owner's photos). A row of terraces down
// Murchison St, the corner building with its graffiti and white awning, big
// gums, and the 96 tram rattling up Nicholson St. West back into Carlton Gardens.
//
//   y0-9   backyards, a bluestone lane (y8-9) and the gums
//   y10-12 terraces and 47-49 (x19-28)   y13-16 Murchison St (x0-29)
//   x30-35 Nicholson St with the tram   y17-27 the gardens' edge and more terraces
import { MapBuilder } from '../MapBuilder.js';
import { hstreet, vstreet, liven } from './melbkit.js';

export function buildNicholson() {
  const b = new MapBuilder({ id: 'nicholson', w: 40, h: 28, fill: '.', seed: 911 });
  hstreet(b, 13, { rows: 2, walk: 1, x0: 0, x1: 29, speed: 40 });
  vstreet(b, 30, 0, 27, { rows: 4, tram: true });

  // Backyards and the bluestone lane behind the terraces
  b.fill(0, 8, 30, 2, 'b');
  b.put('tall', 3, 4, { v: 'biggum' }); b.put('tall', 26, 5, { v: 'biggum' }); b.put('tree', 12, 3, { v: 'lemon' });
  b.put('hoist', 9, 5); b.put('shed', 17, 2);
  b.wildGrass(21, 3, 3, 1.6);
  b.fenceH(0, 29, 7, 'paling', [5, 14, 23]);
  b.put('bin', 6, 9, { v: 'garbage' }); b.put('bin', 7, 9, { v: 'yellow' });

  // Murchison St, north side: terraces, a front garden, then the corner
  ['brick', 'cream', 'sage', 'sand', 'brick'].forEach((v, i) => b.put('terrace', 1 + i * 3, 10, { v }));
  b.put('tall', 16, 10, { v: 'biggum' });
  b.sign(18, 12, ['47-49 Nicholson St, Carlton.', 'Seb grew up here. The walls have been tagged more times than the trams have run late.']);
  b.put('nicholson', 19, 10);
  b.put('lamp', 10, 13); b.put('bikehoop', 25, 13);

  // South side: the gardens' edge, then terraces behind little fences
  b.fill(0, 17, 14, 11, 'L');
  b.fill(0, 21, 13, 2, 'u'); b.fill(11, 17, 2, 4, 'u');
  b.put('tree', 3, 19, { v: 'oak' }); b.put('tree', 8, 25, { v: 'oak' }); b.put('tall', 2, 26, { v: 'poplar' }); b.put('bench', 6, 20);
  b.wildGrass(7, 25, 2.4, 1.4);
  ['cream', 'brick', 'sage', 'sand', 'cream'].forEach((v, i) => b.put('terrace', 14 + i * 3, 19, { v }));
  b.fenceH(14, 28, 18, 'picket', [15, 18, 21, 24, 27]);
  b.fill(14, 22, 16, 6, '.');
  b.put('tree', 22, 25, { v: 'lemon' }); b.wildGrass(18, 25, 2.5, 1.2);

  // The Fitzroy side of Nicholson St
  b.put('terrace', 36, 4, { v: 'sage' }); b.put('terrace', 36, 12, { v: 'brick' }); b.put('terrace', 36, 20, { v: 'cream' });
  b.put('tramstop', 35, 17);

  b.forage(28, 24, ['lemon', 'tennis']);
  b.forage(1, 2, ['feather', 'chicken']);
  b.magpies([[5, 18]]);

  b.exit(0, 21, 1, 2, 'gardens', 'east', 'Carlton Gardens');
  b.exit(31, 0, 4, 1, null, null, 'North Carlton', ['Nicholson St keeps going up to North Carlton.', 'Another day. The 96 will still be there.']);
  b.exit(31, 27, 4, 1, null, null, 'Victoria Pde', ['Down to Victoria Parade and the city.', 'The gardens are the nicer way. Back through the park.']);
  b.exit(39, 4, 1, 20, null, null, 'Fitzroy', ['Fitzroy. Smith St, Brunswick St, a lot of tote bags.', 'Another day.']);
  b.entry('west', 1, 21, 'right');
  liven(b, 0.01);
  return b.finish();
}
