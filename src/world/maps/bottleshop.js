// The Edinburgh Castle bottle shop, out the back of the hotel on Sydney Rd.
// Fridges of cans along the back, wine racks, stacked slabs, the wall of beer
// coasters, an old sideboard with the fancy bottles, and Macca at the counter.
// Talk to him to buy beers and wines for your friends (see src/ui/shop.js).
//
//   y0-1  top wall (coasters)   y2 fridges   y6, y9 wine racks and slabs
//   y12   the counter            y14 bottom wall, door at x9 back to Sydney Rd
import { MapBuilder } from '../MapBuilder.js';

export function buildBottleShop() {
  const b = new MapBuilder({ id: 'bottleshop', w: 19, h: 15, fill: 'W', seed: 711 });
  b.fill(1, 2, 17, 12, 'o');
  b.fill(1, 2, 17, 2, 'n');
  b.set(9, 14, 'D');

  // Back wall: fridges full of cans and stubbies, coasters above
  b.put('beerfridge', 1, 2, { v: 'cans' }); b.put('beerfridge', 3, 2, { v: 'stubbies' }); b.put('beerfridge', 5, 2, { v: 'cans' });
  b.put('beerfridge', 12, 2, { v: 'cans' }); b.put('beerfridge', 14, 2, { v: 'stubbies' }); b.put('beerfridge', 16, 2, { v: 'cans' });
  b.put('coasterwall', 8, 1, { onWall: true });
  b.put('sideboard', 12, 12);
  // Wine racks and stacks of slabs
  b.put('wineshelf', 2, 6, { v: 'red' }); b.put('wineshelf', 4, 6, { v: 'white' });
  b.put('wineshelf', 13, 6, { v: 'red' }); b.put('wineshelf', 15, 6, { v: 'white' });
  b.put('slabs', 8, 7, { v: 'green' }); b.put('slabs', 10, 7, { v: 'blue' });
  b.put('slabs', 2, 9, { v: 'gold' }); b.put('slabs', 3, 9, { v: 'green' }); b.put('slabs', 16, 9, { v: 'blue' }); b.put('slabs', 15, 9, { v: 'gold' });
  b.put('plant', 17, 12, { v: 'fiddle' });
  b.put('barcounter', 2, 12);
  b.put('doormat', 9, 13);

  b.npc('macca', 5, 12, { face: 'right' });
  b.exit(9, 14, 1, 1, 'albion', 'bottleshop', 'Sydney Rd');
  b.entry('door', 9, 13, 'up');
  return b.finish();
}
