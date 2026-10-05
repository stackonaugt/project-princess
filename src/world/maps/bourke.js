// BOURKE ST: the Mall at the west end (trams only, buskers, the giant bronze
// Public Purse, the department store's Christmas windows and the old GPO),
// then Bourke St proper up the hill to Parliament House, where there is
// nearly always a rally on the steps. North up Spring St to Carlton Gardens,
// south down a bluestone laneway to Hosier Lane, west back to Swanston St.
//
//   y0-9   the department store, the GPO, shops, Spring St north (x29-32), Parliament (x34-47)
//   y10-11 footpath   y12-15 the Mall (x0-25, trams only) then the road   y16-17 footpath
//   y18-20 south shops, laneway south (x20-22)   y21-29 back lanes and Parliament Gardens
import { MapBuilder } from '../MapBuilder.js';
import { CARS, vstreet, furniture, liven } from './melbkit.js';

export function buildBourke() {
  const b = new MapBuilder({ id: 'bourke', w: 50, h: 30, fill: 'c', seed: 904 });

  // The street: the Mall's pavers and tram tracks, then cars from x26 east
  b.hline(0, 49, 10, 'f').hline(0, 49, 11, 'f').hline(0, 49, 16, 'f').hline(0, 49, 17, 'f');
  b.hline(0, 25, 12, 'k').hline(0, 25, 15, 'k').hline(26, 49, 12, '#').hline(26, 49, 15, '#');
  b.hline(0, 49, 13, '+').hline(0, 49, 14, '+');
  b.lane({ axis: 'x', pos: 13.5, dir: -1, from: -6, to: 56, every: [26, 44], speed: 40, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 14.5, dir: 1, from: -6, to: 56, every: [28, 46], speed: 40, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 12.5, dir: -1, from: 26, to: 54, every: [8, 16], speed: 48, kinds: CARS });
  b.lane({ axis: 'x', pos: 15.5, dir: 1, from: 26, to: 54, every: [8, 16], speed: 48, kinds: CARS });
  vstreet(b, 29, 0, 9);

  // North side: the department store, the GPO, a few shops, then Parliament
  b.put('deptstore', 1, 7);
  b.put('gpo', 11, 7);
  b.put('shop', 19, 7, { v: 'signs' });
  b.put('cafe', 23, 7);
  b.put('souvenir', 21, 12);
  b.fill(33, 0, 17, 10, 'k');
  b.put('parliament', 34, 6);
  b.put('flagpole', 33, 8, { v: 'aboriginal' }); b.put('flagpole', 48, 8, { v: 'aus' });
  b.sign(47, 11, ['Parliament House, Spring St.', 'If you stand on the steps long enough, someone will hand you a placard.']);

  // In the Mall: the Public Purse, a busker's spot, benches
  b.put('purse', 8, 16);
  b.put('bench', 15, 16); b.put('bench', 3, 11);
  b.put('tramstop', 18, 11); b.put('tramstop', 30, 16);
  b.sign(11, 16, ['"The Public Purse", 1994.', 'A giant bronze handbag. People lean on it, sit on it and, on Saturday nights, get stuck in it.']);
  furniture(b, 11, 8, 32, { step: 6, skip: [18, 29, 30, 31, 32] });
  furniture(b, 17, 2, 46, { step: 6, skip: [8, 15, 20, 21, 22, 30], seed: 2 });

  // South side
  b.put('shop', 0, 18, { v: 'pho' });
  b.put('bshop', 4, 18, { v: 'laundro' });
  b.put('redshop', 8, 18, { v: 'cream' });
  b.put('shop', 12, 18, { v: 'records' });
  b.put('cafe', 16, 18);
  b.fill(20, 18, 3, 12, 'b');                                  // the laneway down to Hosier Lane
  b.put('bshop', 23, 18, { v: 'vinyl' });
  b.put('shop', 27, 18, { v: 'bakery' });
  b.put('terrace', 31, 18, { v: 'cream' });
  b.put('trattoria', 34, 18, { v: 'espresso' });

  // Back lanes behind the south shops
  b.fill(0, 21, 20, 9, 'b').fill(23, 21, 13, 9, 'b');
  b.put('rollerdoor', 2, 23, { v: 'tagged' }); b.put('laneart', 7, 23, { v: 'koala' }); b.put('skip', 13, 24); b.put('bin', 16, 24, { v: 'garbage' });
  b.put('mural', 24, 22, { v: 'a' }); b.put('rollerdoor', 30, 24, { v: 'grey' }); b.put('crate', 28, 27, { v: 'red' });
  b.sign(19, 21, ['A laneway, heading south.', 'Every wall from here to Flinders St is painted. Some of it twice a week.']);

  // Parliament Gardens: a patch of lawn and big old trees
  b.fill(38, 18, 12, 12, '.');
  b.put('tall', 39, 19, { v: 'biggum' }); b.put('tall', 47, 21, { v: 'biggum' }); b.put('tree', 43, 27, { v: 'oak' }); b.put('tree', 48, 28, { v: 'palm' });
  b.put('bench', 42, 19); b.put('fountain', 44, 23);
  b.wildGrass(41, 26, 2.6, 1.6); b.wildGrass(47, 25, 1.6, 2);
  b.fenceV(37, 18, 29, 'metal', [20, 21]);

  b.npc('raelene', 40, 10, { face: 'down' });
  b.npc('mai', 24, 12, { face: 'left' });
  b.npc('officer', 6, 12, { path: [[3, 12], [19, 12]] });

  b.forage(46, 29, ['feather', 'lemon']);
  b.forage(10, 27, ['sardine', 'croissant']);
  b.magpies([[44, 20]]);

  b.exit(0, 13, 1, 1, 'swanston', 'east', 'Swanston St');
  b.exit(29, 0, 4, 1, 'gardens', 'south', 'Carlton Gardens');
  b.exit(20, 29, 3, 1, 'laneways', 'north', 'Hosier Lane');
  b.exit(49, 13, 1, 1, null, null, 'Collingwood', ['Bourke St runs out at Spring St. Collingwood is that way.', 'Another day. The pies are not going anywhere.']);
  b.entry('west', 1, 14, 'right').entry('north', 30, 2, 'down').entry('south', 21, 27, 'up');
  liven(b);
  return b.finish();
}
