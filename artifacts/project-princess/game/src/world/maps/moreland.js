// MORELAND RD at LYGON ST, Coburg (from the owner's Street View shots).
// Betty and Ward's townhouse sits on the north-east corner: a red brick pier,
// white render, glass balconies and a taupe front wall with lattice and ivy.
// Betty stands out the front with something she has just cooked. Next door,
// a catering kitchen and a cafe; across Moreland Rd, red-roofed brick houses
// and the Dunstan Ave bike lane. The walking connection is directly to
// Lygon St in Brunswick East, not a shortcut to Bell St.
//
//   y0-8 north side   y9-11 Betty's, catering, cafe   y12 footpath   y13-14 Moreland Rd   y15 footpath
//   x19-22 Lygon St   y16-25 south side
import { MapBuilder } from '../MapBuilder.js';

export function buildMoreland() {
  const b = new MapBuilder({ id: 'moreland', w: 44, h: 26, seed: 361 });

  // Moreland Rd and Lygon St
  b.hline(0, 43, 12, 'f').hline(0, 43, 13, '#').hline(0, 43, 14, '#').hline(0, 43, 15, 'f');
  b.vline(19, 0, 25, 'f').fill(20, 0, 2, 26, '#').vline(22, 0, 25, 'f');
  b.fill(19, 13, 4, 2, '#');             // Moreland Rd runs straight through: no footpath across the road
  b.fill(20, 12, 2, 1, 'z'); b.fill(20, 15, 2, 1, 'z');

  // North-east corner: Betty and Ward's place
  b.put('bettyhouse', 24, 9, { v: 'moreland' });
  b.sign(23, 12, ['Betty and Ward\'s.', 'You can smell the cooking from the tram stop. Ward runs the bottle shop on Sydney Rd.']);
  b.npc('betty', 28, 12, { face: 'down' });
  b.npc('ward', 30, 12, { face: 'down', at: 'home' });   // home from the bottle shop
  b.put('tree', 23, 8, { v: 'gum' });
  b.put('factory', 32, 9, { v: 'brick' });
  b.sign(31, 12, ['A catering kitchen.', 'Trays of food go out the roller door all day. Betty says hers is better. She is right.']);
  b.exit(35, 12, 1, 1, 'bakeoff', 'door', 'Saturday bake-off');
  b.entry('bakeoff', 36, 12, 'down');
  b.put('cafe', 40, 9, { v: 'green' });
  b.put('table', 41, 12); b.put('table', 43, 12);
  b.fill(23, 0, 21, 8, 'c'); b.fill(23, 0, 21, 2, 'b');
  b.put('weatherboard', 25, 3, { v: 'cream' }); b.put('unit', 31, 3, { v: 'left' }); b.put('unit', 36, 3, { v: 'right' });
  b.fill(23, 6, 21, 3, '.');

  // North-west corner: a newer house and a weedy nature strip
  b.put('brickhouse', 13, 9, { v: 'tan' });
  b.fenceH(0, 18, 8, 'colorbond', [15]);
  b.put('weatherboard', 2, 4, { v: 'blue' }); b.put('weatherboard', 8, 4, { v: 'mint' });
  b.wildGrass(6, 10, 4, 1.3); b.put('tree', 1, 10, { v: 'gum' });
  b.put('powerpole', 17, 12); b.put('powerpole', 5, 15); b.put('powerpole', 38, 15);
  b.put('streettree', 10, 12); b.put('streettree', 26, 15);

  // South side: red-roofed brick houses, the Dunstan Ave bike lane, a flat-roofed shop
  b.put('house', 1, 17, { v: 'red' }); b.put('house', 9, 17, { v: 'red' });
  b.fenceH(0, 18, 16, 'picket', [4, 12]);
  b.vline(28, 16, 25, '=');
  b.sign(29, 16, ['Dunstan Ave bike lane.', 'Green paint, a bollard and a lot of very serious cyclists.']);
  b.put('bollard', 28, 16);
  b.put('redshop', 31, 17, { v: 'cream' }); b.put('brickhouse', 37, 18, { v: 'red' });
  b.fill(23, 21, 21, 5, '.');
  b.wildGrass(33, 23, 4, 1.4); b.wildGrass(8, 23, 4, 1.3);
  b.put('tree', 24, 22, { v: 'lemon' });

  b.exit(19, 0, 4, 1, 'eblygon', 'moreland', 'Lygon St, Brunswick East');
  b.exit(43, 12, 1, 4, null, null, 'Roadworks');
  b.exit(19, 25, 4, 1, 'holmes', 'east', 'Holmes St, Brunswick East');
  b.exit(0, 12, 1, 4, 'albion', 'moreland', 'Sydney Rd, Brunswick');
  b.entry('north', 20, 1, 'down').entry('south', 20, 24, 'up').entry('west', 1, 13, 'right').entry('east', 42, 12, 'left');

  b.lane({ axis: 'x', pos: 13.5, dir: -1, from: -3, to: 47, every: [7, 14], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 14.5, dir: 1, from: -3, to: 47, every: [7, 14], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });
  b.lane({ axis: 'y', pos: 20.5, dir: 1, from: -3, to: 29, every: [12, 22], speed: 50, kinds: ['veh-car-v-silver', 'veh-car-v-yellow'] });
  b.lane({ axis: 'y', pos: 21.5, dir: -1, from: -3, to: 29, every: [12, 22], speed: 50, kinds: ['veh-car-v-yellow'] });

  b.forage(3, 22, ['lemon', 'chicken']);
  b.forage(41, 23, ['tennis', 'cheese']);
  b.magpies([[12, 23], [36, 24]]);
  b.scatter([0, 0, b.w, b.h], 0.01, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
