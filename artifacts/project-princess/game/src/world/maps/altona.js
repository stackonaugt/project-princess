// KOROROIT CREEK RD, Altona North: the first leg of the long walk from
// Laverton to Brunswick. Factories, a container yard, trucks, the creek
// and its reeds, and billboards. Not much happening, which is the point.
//
//   y2-8   factories, Bunnings (Olly, out the front), container yard     y9 footpath   y10-11 road   y12 footpath
//   y13-24 truck parking, Kororoit Creek, a weedy lot
import { MapBuilder } from '../MapBuilder.js';
import { street, furnish } from './citykit.js';

export function buildAltona() {
  const b = new MapBuilder({ id: 'altona', w: 48, h: 26, fill: 'c', seed: 301 });
  street(b, 9, { trucks: true, speed: 60 });

  // North side: factories and the container yard
  b.fill(0, 0, 48, 2, 'g');
  // the buildings run a long way back: rooftops behind each one
  b.fill(1, 0, 8, 4, 'R'); b.fill(40, 0, 6, 6, 'R');
  b.put('factory', 1, 6, { v: 'tin' });
  // Bunnings Warehouse: doors into the store (Olly is inside), and Gaz's
  // sausage sizzle out the front.
  b.fill(11, 0, 11, 1, 'R');
  b.put('bunningsbig', 11, 4);
  b.exit(15, 8, 2, 1, 'bunnings', 'door', 'Bunnings Warehouse');
  b.put('sizzle', 19, 8);
  b.npc('gaz', 18, 9, { face: 'up' });
  b.put('skip', 23, 7); b.put('crate', 24, 8, { v: 'blue' }); b.put('crate', 25, 8, { v: 'red' });
  b.fill(26, 2, 12, 7, 'g');
  b.fenceH(26, 37, 2, 'metal'); b.fenceV(26, 3, 8, 'metal', [7]); b.fenceV(37, 3, 8, 'metal', [7]);
  [[27, 3, 'red'], [31, 3, 'blue'], [27, 5, 'green'], [33, 5, 'orange'], [29, 7, 'blue']].forEach(([x, y, v]) => b.put('container', x, y, { v }));
  b.put('trolley', 35, 7);
  b.put('shed', 40, 6, { v: 'blue' });
  furnish(b, 9, { skip: [1, 9, 12, 15, 16, 17, 18, 26, 37], seed: 3 });

  // South: truck parking, the creek, a weedy lot with billboards
  b.fill(0, 13, 18, 5, 'P');
  b.put('ute', 2, 14, { v: 'white' }); b.put('car', 7, 14, { v: 'silver' }); b.put('ute', 12, 16, { v: 'red' });
  b.fill(0, 18, 18, 7, '.');
  b.wildGrass(9, 21, 4, 2);
  b.put('billboard', 3, 19, { v: 'rent' });
  b.put('tall', 15, 20, { v: 'biggum' }); b.put('tall', 1, 23, { v: 'biggum' });
  // Kororoit Creek, under the road bridge
  b.fill(19, 13, 6, 12, '.');
  b.fill(21, 13, 2, 12, '~');
  [[20, 15], [20, 19], [23, 17], [23, 22], [20, 23]].forEach(([x, y]) => b.put('reeds', x, y));
  b.fill(25, 13, 23, 12, '.');
  b.vline(26, 13, 24, '=');
  [[28, 15], [31, 18], [29, 22]].forEach(([x, y], i) => b.put('tussock', x, y, { v: i % 2 ? 'a' : 'b' }));
  b.wildGrass(33, 21, 3, 1.5);
  b.put('billboard', 38, 14, { v: 'pies' });
  b.put('shed', 40, 19, { v: 'blue' });
  b.put('tall', 45, 15, { v: 'biggum' });
  b.sign(17, 12, ['Kororoit Creek Rd, Altona North.', 'Brunswick is three suburbs east. Long walk. The train is quicker, but you knew that.']);
  b.put('infosign', 27, 13);
  // Spiro's fish and chip van, right by the creek
  b.put('fishvan', 31, 13);
  b.npc('spiro', 32, 16, { face: 'up' });

  b.forage(30, 23, ['tennis', 'feather']);
  b.forage(5, 23, ['chicken', 'snag']);
  b.magpies([[34, 16], [11, 18]]);
  b.ducks(21.5, 20, 0.6, 3, 2);

  b.fill(9, 0, 1, 9, 'f');                         // a lane north, up to the council in Altona
  b.exit(9, 0, 1, 1, 'civic', 'south', 'Civic Parade, Altona');
  b.exit(0, 9, 1, 1, 'station', 'east', 'Laverton Station');
  b.exit(47, 12, 1, 1, 'footscray', 'west', 'Footscray');
  b.entry('bunnings', 15, 9, 'down').entry('north', 9, 2, 'down').entry('west', 1, 9, 'right').entry('east', 46, 12, 'left');
  return b.finish();
}
