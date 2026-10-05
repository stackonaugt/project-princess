// BRUNSWICK BOUND, Sydney Rd: a long, narrow bookshop. Tall timber bookcases
// down both walls, display tables of new releases and kids' books, a flock of
// paper birds on the wall, and Wren at the counter by the door.
//
//   y0-1  top wall (bird mural)   y2 bookcases along the back
//   y4-10 bookcases down the sides, tables down the middle
//   y11   the counter by the door   y13 bottom wall, door at x9 back to Sydney Rd
import { MapBuilder } from '../MapBuilder.js';

export function buildBookShop() {
  const b = new MapBuilder({ id: 'bookshop', w: 18, h: 14, fill: 'W', seed: 841 });
  b.fill(1, 2, 16, 11, 'o');
  b.set(9, 13, 'D');

  b.put('birdmural', 12, 1, { onWall: true });
  b.put('bookcase', 1, 2, { v: 'a' }); b.put('bookcase', 3, 2, { v: 'b' }); b.put('bookcase', 5, 2, { v: 'a' });
  b.put('bookcase', 8, 2, { v: 'b' }); b.put('bookcase', 10, 2, { v: 'a' });
  b.put('bookcase', 1, 5, { v: 'b' }); b.put('bookcase', 1, 7, { v: 'a' }); b.put('bookcase', 1, 9, { v: 'b' });
  b.put('bookcase', 15, 5, { v: 'a' }); b.put('bookcase', 15, 7, { v: 'b' }); b.put('bookcase', 15, 9, { v: 'a' });
  b.put('booktable', 6, 6, { v: 'new' }); b.put('booktable', 10, 6, { v: 'new' }); b.put('booktable', 8, 9, { v: 'kids' });
  b.put('plant', 16, 2, { v: 'fiddle' });
  b.put('shopcounter', 3, 11);
  b.put('doormat', 9, 12);
  b.sign(13, 11, ['New releases.', 'Staff pick: whatever Wren is reading this week. Wren reads a book a day.']);

  b.npc('wren', 5, 12, { face: 'right' });
  b.exit(9, 13, 1, 1, 'sydney', 'bookshop', 'Sydney Rd');
  b.entry('door', 9, 12, 'up');
  b.noDress = true;
  return b.finish();
}
