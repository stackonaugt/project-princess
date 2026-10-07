// SYDNEY RD AT ALBION ST, Brunswick: the Edinburgh Castle Hotel on the
// corner (white art deco, green band, HOTEL down the corner), its bottle shop
// in black brick next door (door into the bottleshop zone), the curved green
// heritage tram shelter, a skip, traffic lights and the yellow crossings, and
// the vacant white deco shops across Albion St, all tagged. North up Sydney Rd
// is Coburg (Bell St); Albion St itself heads off to Brunswick West and East.
//
//   y0-5   back lots, factories      y6-7 bluestone back lane
//   y9-11  shops, bottle shop, the hotel | Albion St x30-31 | deco shops
//   y12-13 footpath   y14-17 Sydney Rd (19 tram)   y18-19 footpath
//   y20-25 shops and a lane west of Albion St, a pocket park east of it
import { MapBuilder } from '../MapBuilder.js';

export function buildAlbion() {
  const b = new MapBuilder({ id: 'albion', w: 48, h: 26, fill: 'c', seed: 701 });

  // Sydney Rd runs across the map, Albion St crosses it at x30-31
  b.hline(0, 47, 12, 'f').hline(0, 47, 13, 'f');
  b.hline(0, 47, 14, '#').hline(0, 47, 15, '+').hline(0, 47, 16, '+').hline(0, 47, 17, '#');
  b.hline(0, 47, 18, 'f').hline(0, 47, 19, 'f');
  b.fill(30, 0, 2, 12, '#').fill(30, 18, 2, 8, '#');
  b.vline(28, 0, 11, 'f').vline(29, 0, 11, 'f').vline(32, 0, 11, 'f').vline(33, 0, 11, 'f');
  b.vline(28, 20, 25, 'f').vline(29, 20, 25, 'f').vline(32, 20, 25, 'f').vline(33, 20, 25, 'f');

  // Back lots and the bluestone lane behind the north shops
  b.fill(0, 6, 28, 2, 'b');
  b.fenceV(0, 0, 5, 'brickwall');
  b.put('factory', 1, 2, { v: 'brick' });
  b.put('rollerdoor', 10, 4, { v: 'tagged' });
  b.graffiti(13, 5);
  b.put('rollerdoor', 16, 4, { v: 'green' });
  // The Edinburgh Castle's beer garden out the back, behind a brick wall
  b.fill(19, 0, 9, 6, 'k');
  b.fenceH(19, 27, 5, 'brickwall', [24]);
  b.fenceV(19, 0, 4, 'brickwall');
  b.put('picnic', 20, 1); b.put('picnic', 24, 1); b.put('picnic', 20, 3);
  b.put('plant', 26, 1, { v: 'fiddle' }); b.put('plant', 26, 3, { v: 'fiddle' });
  b.put('skip', 25, 6);
  b.put('bin', 18, 6, { v: 'red' }); b.put('bin', 9, 6, { v: 'yellow' }); b.put('crate', 14, 7, { v: 'blue' });

  // North side, west of Albion St: shops, the bottle shop, the hotel on the corner
  b.put('bshop', 1, 9, { v: 'bikecoop' });
  b.put('bshop', 5, 9, { v: 'laundro' });
  b.fill(9, 8, 1, 4, 'b');                               // a little alley to the lane
  b.put('bottleshop', 10, 9);
  b.fill(15, 8, 1, 4, 'b');
  b.put('edcastle', 17, 9);
  b.put('plant', 11, 12, { v: 'fiddle' });
  b.exit(13, 12, 2, 1, 'bottleshop', 'door', 'Bottle shop');
  b.entry('bottleshop', 13, 13, 'down');
  b.sign(16, 12, ['The Edinburgh Castle Hotel, 1930s Brunswick deco.', 'Front bar, beer garden, and the bottle shop next door. Trivia on Tuesdays.']);

  // North side, across Albion St: the white deco shops, mostly for lease
  b.put('decoshop', 34, 9, { v: 'lease' });
  b.put('decoshop', 38, 9, { v: 'cafe' });
  b.put('decoshop', 42, 9, { v: 'lease' });
  b.put('terrace', 46, 9, { v: 'brick' });
  b.fill(34, 0, 14, 8, '.');
  b.put('shed', 35, 3, { v: 'grey' });
  b.graffiti(41, 5, true);
  b.put('container', 43, 2, { v: 'green' });
  b.wildGrass(40, 6, 3, 1.5);
  b.put('table', 39, 12);

  // South side, west of Albion St: more shops, the lane behind
  b.put('redshop', 1, 20, { v: 'cream' }); b.put('shop', 5, 20, { v: 'books' });
  b.put('bshop', 9, 20, { v: 'tattoo' }); b.put('redshop', 13, 20, { v: 'red' });
  b.put('shop', 17, 20, { v: 'pho' }); b.put('bshop', 21, 20, { v: 'vinyl' });
  b.fill(25, 20, 3, 6, 'b');
  b.fill(0, 23, 25, 2, 'b');
  b.fenceH(0, 24, 25, 'brickwall');
  b.put('bin', 6, 23, { v: 'red' }); b.put('bin', 7, 23, { v: 'yellow' }); b.put('crate', 19, 23, { v: 'red' });

  // South side, east of Albion St: a little pocket park
  b.fill(34, 20, 14, 6, '.');
  b.fenceH(34, 47, 25, 'park');
  b.put('tall', 36, 21, { v: 'biggum' });
  b.put('bench', 40, 20);
  b.wildGrass(43, 23, 3, 1.5);
  b.wildGrass(37, 24, 2, 1);

  // Street furniture: heritage tram shelter, lights, crossings, poles
  b.put('heritageshelter', 20, 12);
  b.put('tramstop', 9, 18);
  b.put('bikehoop', 25, 13); b.put('bikehoop', 26, 13);
  for (const [x, y] of [[29, 13], [32, 13], [29, 18], [32, 18]]) b.put('trafficlight', x, y);
  for (const y of [11, 20]) { b.put('crossing', 30, y, { v: 'h' }); b.put('crossing', 31, y, { v: 'h' }); }
  for (let y = 14; y <= 17; y++) { b.put('crossing', 28, y, { v: 'v' }); b.put('crossing', 33, y, { v: 'v' }); }
  b.put('powerpole', 4, 13); b.put('powerpole', 36, 13); b.put('powerpole', 15, 18); b.put('powerpole', 40, 18);
  b.put('streettree', 6, 18); b.put('streettree', 21, 18); b.put('streettree', 44, 18);
  b.put('lamp', 44, 13);

  b.forage(41, 22, ['croissant', 'tennis']);
  b.forage(3, 24, ['sardine', 'snag']);

  b.exit(0, 12, 1, 8, 'sydney', 'east', 'Sydney Rd');
  b.exit(47, 12, 1, 8, 'coburg', 'south', 'Bell St, Coburg');
  b.exit(28, 0, 6, 1, null, null, 'Brunswick West', ['Albion St heads off to Brunswick West.', 'Nothing to see there yet. The sign says "coming soon". Sydney Rd is right here.']);
  b.exit(28, 25, 6, 1, 'donald', 'albion', 'Donald St');
  // Moreland Rd's start, heading south off Sydney Rd (closed to the north)
  b.clear(41, 18, 6, 8).fill(41, 18, 1, 8, 'f').fill(42, 18, 3, 8, '#').fill(45, 18, 1, 8, 'f');
  b.exit(42, 25, 3, 1, 'moreland', 'west', 'Moreland Rd');
  // Out the front of the Edinburgh Castle of an evening (routines.js)
  b.npc('mem', 24, 13, { face: 'left', at: 'pub' }); b.npc('corni', 25, 13, { face: 'left', at: 'pub' });
  b.npc('pearman', 22, 13, { face: 'right', at: 'pub' });
  b.entry('moreland', 43, 24, 'up').entry('south', 30, 24, 'up').entry('west', 1, 13, 'right').entry('east', 46, 13, 'left');

  b.lane({ axis: 'x', pos: 15.5, dir: 1, from: -6, to: 54, every: [25, 45], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 16.5, dir: -1, from: -6, to: 54, every: [30, 50], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 14.5, dir: -1, from: -3, to: 51, every: [6, 12], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 17.5, dir: 1, from: -3, to: 51, every: [6, 12], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });
  return b.finish();
}
