// HOSIER LANE and DEGRAVES ST: the laneways. A bluestone lane runs down from
// Bourke St between walls painted top to bottom (and painted over again by
// Tuesday), then turns into Degraves St: tiny cafes, umbrellas and tables
// down the middle, a coffee cart, and Flinders St Station at the far end.
//
//   y0-19  Hosier Lane (x18-21), painted walls and old warehouses, a weedy lot (x29-38)
//   y20-24 Degraves St, cafes both sides   y25-29 the cafes' south side
import { MapBuilder } from '../MapBuilder.js';
import { tables, liven } from './melbkit.js';

export function buildLaneways() {
  const b = new MapBuilder({ id: 'laneways', w: 40, h: 30, fill: 'c', seed: 905 });

  // The lane and Degraves St
  b.fill(18, 0, 4, 20, 'b');
  b.fill(0, 20, 40, 5, 'b');

  // West wall: a warehouse, then painted walls and roller doors stepping down the lane
  b.put('factory', 2, 3, { v: 'brick' });
  b.put('laneart', 14, 2, { v: 'melb' });
  b.put('rollerdoor', 15, 5, { v: 'tagged' });
  b.put('graffiti', 14, 8, { v: 'tags' });
  b.put('mural', 14, 11, { v: 'a' });
  b.put('graffiti', 14, 14, { v: 'paste' });
  b.fill(2, 7, 10, 9, 'b');
  b.put('skip', 3, 9); b.put('bin', 7, 9, { v: 'garbage' }); b.put('bin', 8, 9, { v: 'yellow' }); b.put('crate', 10, 12, { v: 'blue' });
  b.put('graffiti', 4, 13, { v: 'tags' });

  // East wall
  b.put('graffiti', 22, 2, { v: 'tags' });
  b.put('laneart', 22, 5, { v: 'koala' });
  b.put('rollerdoor', 22, 8, { v: 'green' });
  b.put('laneart', 22, 11, { v: 'tram' });
  b.put('graffiti', 22, 14, { v: 'paste' });
  b.sign(17, 1, ['Hosier Lane.', 'Paint is allowed here. So every wall has been painted about four hundred times.']);

  // A weedy lot behind a wire fence
  b.fill(28, 6, 11, 11, '.');
  b.wildGrass(33, 11, 4, 3);
  b.fenceH(27, 39, 5, 'metal').fenceV(27, 6, 16, 'metal', [10, 11]).fenceH(27, 39, 17, 'metal');
  b.put('trolley', 36, 8); b.put('tall', 30, 7, { v: 'poplar' }); b.put('tree', 38, 15, { v: 'gum' });
  b.sign(26, 9, ['Vacant lot.', 'Approved: 58 storeys of "boutique living". Currently: weeds, a trolley and a fox.']);
  b.fill(22, 10, 5, 3, 'b');

  // Degraves St: cafes along the north side...
  b.put('bshop', 2, 17, { v: 'vegan' });
  b.put('cafe', 6, 17);
  b.put('trattoria', 10, 17, { v: 'espresso' });
  b.put('shop', 14, 17, { v: 'bakery' });
  b.put('bshop', 22, 17, { v: 'origin' });
  b.put('cafe', 26, 17);
  b.put('shop', 30, 17, { v: 'books' });
  b.put('redshop', 34, 17, { v: 'cream' });
  // ...tables down the middle...
  tables(b, 22, 3, 36, { step: 5, skip: [19, 20] });
  // ...and the south side
  b.put('trattoria', 1, 25, { v: 'cannoli' });
  b.put('bshop', 5, 25, { v: 'oatmilk' });
  b.put('redshop', 9, 25, { v: 'red' });
  b.put('espressocart', 14, 25);
  b.put('shop', 17, 25, { v: 'signs' });
  b.put('trattoria', 21, 25, { v: 'pasta' });
  b.put('bshop', 25, 25, { v: 'yoga' });
  b.put('cafe', 29, 25);
  b.put('terrace', 33, 25, { v: 'brick' });
  b.fill(0, 28, 40, 2, 'c');
  b.put('lamp', 13, 20); b.put('lamp', 27, 20);

  b.npc('remy', 15, 24, { face: 'down' });
  b.npc('spray', 19, 9, { face: 'left' });

  b.forage(37, 13, ['croissant', 'feather']);
  b.forage(5, 11, ['sardine', 'cheese']);

  b.exit(18, 0, 4, 1, 'bourke', 'south', 'Bourke St');
  b.exit(39, 20, 1, 5, 'flinders', 'west', 'Flinders St');
  b.exit(0, 20, 1, 5, null, null, 'Centre Place', ['Centre Place, and more laneways after that.', 'You have had three coffees already. Maybe another day.']);
  b.entry('north', 19, 2, 'down').entry('east', 38, 21, 'left');
  liven(b, 0.012);
  return b.finish();
}
