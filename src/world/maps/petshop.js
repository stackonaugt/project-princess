// THE LEASH YOU CAN DO: the pet shop on Hope St, Brunswick, near Mem and
// Corni's. Talk to Olly at the counter to buy treats and gear (see src/ui/shop.js).
//
//   y0-1  top wall     y2  shelves and the aquarium along the back
//   y6, y10  aisles    y15 the counter by the door (Olly stands beside it)
//   y18   bottom wall, door at x11 back out to Hope St
import { MapBuilder } from '../MapBuilder.js';

export function buildPetShop() {
  const b = new MapBuilder({ id: 'petshop', w: 22, h: 19, fill: 'W', seed: 501 });
  b.fill(1, 2, 20, 16, 'o');
  b.fill(1, 2, 20, 3, 'n');
  b.set(11, 18, 'D');

  // Back wall: shelves of treats, toys and gear, and Kevin the goldfish
  b.put('shopshelf', 1, 2, { v: 'treats' }); b.put('shopshelf', 3, 2, { v: 'treats' }); b.put('shopshelf', 5, 2, { v: 'toys' });
  b.put('aquarium', 9, 2); b.put('aquarium', 11, 2);
  b.put('shopshelf', 15, 2, { v: 'gear' }); b.put('shopshelf', 17, 2, { v: 'gear' }); b.put('shopshelf', 19, 2, { v: 'toys' });
  b.put('picture', 8, 1, { v: 'dog', onWall: true }); b.put('picture', 13, 1, { v: 'family', onWall: true });
  // Aisles
  b.put('shopshelf', 3, 6, { v: 'toys' }); b.put('shopshelf', 5, 6, { v: 'treats' });
  b.put('shopshelf', 15, 6, { v: 'treats' }); b.put('shopshelf', 17, 6, { v: 'gear' });
  // Pet beds on display, and the counter by the door
  b.put('shopshelf', 3, 10, { v: 'gear' }); b.put('shopshelf', 5, 10, { v: 'toys' });
  b.put('shopshelf', 15, 10, { v: 'toys' }); b.put('shopshelf', 17, 10, { v: 'treats' });
  b.put('petbed', 16, 14); b.put('petbed', 18, 14); b.put('cattree', 19, 16);
  b.put('shopcounter', 2, 15);
  b.put('plant', 1, 17, { v: 'fiddle' }); b.put('plant', 20, 7, { v: 'fiddle' }); b.put('plant', 8, 6, { v: 'fiddle' });
  b.put('rug', 9, 11, { v: 'red' });
  b.put('doormat', 11, 17);

  b.npc('olly', 5, 15, { face: 'right' });
  b.exit(11, 18, 1, 1, 'hope', 'petshop', 'Hope St');
  b.entry('door', 11, 17, 'up');
  return b.finish();
}
