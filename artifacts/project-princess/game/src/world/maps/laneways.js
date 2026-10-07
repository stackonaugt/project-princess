// HOSIER LANE and DEGRAVES ST: the laneways, dense as the real thing. The
// city here is rooftop after rooftop with only narrow bluestone alleys
// between. Hosier Lane runs across the top, painted wall to wall; two alleys
// drop down from it, joined by Centre Place and a tiny courtyard garden; at
// the bottom, Degraves St with its cafes and tables down the middle.
// Up the alley to Swanston St, down the alley to Flinders St.
//
//   x20-22 y0-7 the alley from Swanston St   y8-10 Hosier Lane (art on y8)
//   x6-7, x40-41 alleys down   y18-19 Centre Place   x14-19 y20-23 the courtyard
//   y26-28 Degraves St cafes   y29-33 Degraves St   x22-24 y34-39 the alley to Flinders St
import { MapBuilder } from '../MapBuilder.js';
import { tables, liven } from './melbkit.js';

export function buildLaneways() {
  const b = new MapBuilder({ id: 'laneways', w: 48, h: 40, fill: 'R', seed: 905 });

  // The alleys
  b.fill(20, 0, 3, 8, 'b');
  b.fill(3, 8, 42, 3, 'b');
  b.fill(6, 11, 2, 18, 'b').fill(40, 11, 2, 18, 'b');
  b.fill(6, 18, 36, 2, 'b');
  b.fill(14, 20, 6, 4, '.');
  b.fill(2, 29, 44, 5, 'k');
  b.fill(22, 34, 3, 6, 'b');

  // Hosier Lane: painted from end to end
  for (const [x, v] of [[4, 'melb'], [8, 'koala'], [12, 'tram'], [16, 'melb'], [24, 'tram'], [28, 'koala'], [32, 'melb'], [36, 'tram']]) b.put('laneart', x, 8, { v });
  b.graffiti(40, 8);
  b.put('skip', 43, 10); b.put('bin', 3, 10, { v: 'garbage' });
  b.sign(23, 9, ['Hosier Lane.', 'Paint is allowed here. So every wall has been painted about four hundred times.']);
  b.put('bin', 7, 14, { v: 'yellow' }); b.put('crate', 41, 22, { v: 'blue' }); b.put('crate', 40, 13, { v: 'red' });

  // Centre Place and the courtyard garden
  b.wildGrass(16.5, 21.5, 2.6, 1.6);
  b.put('espressocart', 26, 18);
  b.sign(20, 20, ['A courtyard garden.', 'Somebody planted tomatoes in a shopping trolley. The rats are very grateful.']);

  // Degraves St: cafes along the north side, tables down the middle
  for (const [x, k, v] of [[2, 'bshop', 'vegan'], [8, 'cafe', 'green'], [12, 'shop', 'bakery'], [16, 'bshop', 'origin'], [20, 'shop', 'books'], [24, 'redshop', 'cream'],
    [28, 'bshop', 'oatmilk'], [32, 'cafe', 'green'], [36, 'shop', 'records'], [42, 'redshop', 'red']]) b.put(k, x, 26, { v });
  tables(b, 31, 4, 44, { step: 5, skip: [6, 7, 23, 40, 41] });
  b.put('lamp', 9, 33); b.put('lamp', 30, 33);
  b.sign(26, 33, ['Degraves St.', 'Twelve cafes in fifty metres. Every one of them will tell you the others are fine.']);

  b.npc('remy', 28, 18, { face: 'left' });
  b.npc('spray', 19, 10, { face: 'up' });

  b.forage(15, 23, ['croissant', 'feather']);
  b.forage(44, 9, ['sardine', 'cheese']);
  b.magpies([[17, 21]]);

  b.exit(20, 0, 3, 1, 'swanston', 'south', 'Swanston St');
  b.exit(22, 39, 3, 1, 'flinders', 'laneways', 'Flinders St');
  b.entry('north', 21, 1, 'down').entry('south', 23, 38, 'up');
  liven(b, 0.01);
  b.noDress = true;
  return b.finish();
}
