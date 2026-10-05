// SWANSTON ST at the State Library: the grand portico and the green dome of
// the reading room (door inside), the lawn where everyone eats lunch, giant
// chess on the forecourt, trams every minute, office towers and a strip of
// shops. North up to Lygon St, east along to Bourke St, west to Queen Vic
// Market and south down to Flinders St.
//
//   y0-13  side street north (x40-43), the library (x4-17) and its forecourt, towers and shops
//   y14-15 footpath   y16-19 the street (tram tracks y17-18)   y20-21 footpath
//   y22-31 shops, a tower, side street south (x20-23), a pocket lawn
import { MapBuilder } from '../MapBuilder.js';
import { hstreet, vstreet, furniture, liven } from './melbkit.js';

export function buildSwanston() {
  const b = new MapBuilder({ id: 'swanston', w: 48, h: 32, fill: 'c', seed: 903 });
  hstreet(b, 14, { rows: 4, tram: true });
  vstreet(b, 40, 0, 13);
  vstreet(b, 20, 22, 31, { rows: 2, tram: false });

  // The State Library, its forecourt, the lawn and the chess
  b.put('statelibrary', 4, 6);
  b.fill(2, 9, 18, 5, 'k');
  b.fill(2, 11, 6, 3, '.'); b.wildGrass(4, 12, 2.2, 1.2);
  b.put('chessboard', 13, 10);
  b.put('chesspiece', 14, 11, { v: 'king' }); b.put('chesspiece', 16, 12, { v: 'pawn' }); b.put('chesspiece', 13, 13, { v: 'knight' });
  b.exit(10, 9, 2, 1, 'reading', 'door', 'The Reading Room');
  b.put('lamp', 8, 9); b.put('lamp', 18, 9);
  b.sign(19, 13, ['State Library Victoria. Free, and open to everyone.', 'The reading room has a dome six storeys high. Bring a book. Or just look up.']);

  // North side: a tower, the shops, a little lawn by the side street
  b.put('citytower', 21, 6, { v: 'brown' });
  b.put('redshop', 26, 10, { v: 'red' });
  b.put('shop', 30, 10, { v: 'pho' });
  b.put('bshop', 34, 10, { v: 'laundro' });
  b.fill(26, 6, 14, 4, '.'); b.wildGrass(32, 7, 3, 1.2);
  b.put('tree', 27, 6, { v: 'oak' }); b.put('tree', 38, 8, { v: 'gum' });
  b.put('terrace', 44, 10, { v: 'sage' });
  b.put('tramstop', 24, 15); b.put('tramstop', 8, 20);

  // South side
  b.put('bshop', 2, 22, { v: 'vegan' });
  b.put('shop', 6, 22, { v: 'curry' });
  b.put('bshop', 10, 22, { v: 'tattoo' });
  b.put('cafe', 14, 22);
  b.put('shop', 25, 22, { v: 'signs' });
  b.put('redshop', 29, 22, { v: 'cream' });
  b.put('bshop', 33, 22, { v: 'origin' });
  b.put('terrace', 37, 22, { v: 'brick' });
  b.fill(40, 22, 8, 10, '.'); b.wildGrass(44, 27, 3, 2);
  b.put('bench', 41, 23); b.put('streettree', 46, 23); b.put('tree', 41, 30, { v: 'oak' });
  b.fill(0, 26, 20, 6, 'b').fill(24, 26, 16, 6, 'b');
  b.put('graffiti', 2, 27, { v: 'tags' }); b.put('rollerdoor', 8, 27, { v: 'grey' }); b.put('skip', 14, 28);
  b.put('bin', 26, 27, { v: 'red' }); b.put('bin', 27, 27, { v: 'yellow' }); b.put('mural', 30, 27, { v: 'b' });
  furniture(b, 14, 2, 38, { step: 6, skip: [10, 11, 24, 40, 41, 42, 43] });
  furniture(b, 21, 2, 46, { step: 6, skip: [8, 20, 21, 22, 23], seed: 3 });

  b.npc('chesskev', 12, 11, { face: 'right' });
  b.npc('luca', 22, 14, { face: 'down' });

  b.forage(5, 13, ['croissant', 'sardine']);
  b.forage(45, 30, ['feather', 'tennis']);
  b.forage(30, 8, ['carrot', 'cheese']);
  b.magpies([[34, 7], [43, 25]]);

  b.exit(40, 0, 4, 1, 'lygon', 'south', 'Lygon St, Carlton');
  b.exit(47, 17, 1, 1, 'bourke', 'west', 'Bourke St');
  b.exit(0, 17, 1, 1, 'queenvic', 'east', 'Queen Victoria Market');
  b.exit(20, 31, 4, 1, 'flinders', 'north', 'Flinders St');
  b.entry('north', 41, 2, 'down').entry('east', 46, 18, 'left').entry('west', 1, 18, 'right').entry('south', 21, 29, 'up').entry('reading', 10, 10, 'down');
  liven(b);
  return b.finish();
}
