// THE READING ROOM, State Library Victoria: the octagonal domed hall, long
// timber desks with green lamps under the dome, bookcases round the walls,
// and Margaret at the enquiries desk in the middle. Shhh.
import { MapBuilder } from '../MapBuilder.js';

export function buildReading() {
  const b = new MapBuilder({ id: 'reading', w: 24, h: 18, fill: 'W', seed: 909 });
  b.fill(1, 2, 22, 15, 'o');
  // cut the corners off, for the octagon
  for (let i = 0; i < 3; i++) { b.fill(1, 2 + i, 3 - i, 1, 'W'); b.fill(20 + i, 2 + i, 3 - i, 1, 'W'); b.fill(1, 16 - i, 3 - i, 1, 'W'); b.fill(20 + i, 16 - i, 3 - i, 1, 'W'); }
  b.set(12, 17, 'D');
  for (const x of [4, 8, 14, 18]) b.put('bookcase', x, 2, { v: x % 8 ? 'a' : 'b' });
  b.put('bookcase', 1, 7, { v: 'a' }); b.put('bookcase', 1, 10, { v: 'b' }); b.put('bookcase', 21, 7, { v: 'b' }); b.put('bookcase', 21, 10, { v: 'a' });
  // desks radiating out from the middle
  for (const [x, y] of [[4, 5], [17, 5], [4, 13], [17, 13], [3, 9], [18, 9]]) b.put('readingdesk', x, y);
  b.put('rug', 10, 7, { v: 'blue' });
  b.put('shopcounter', 10, 9);
  b.put('stool', 6, 6); b.put('stool', 18, 6); b.put('stool', 6, 14); b.put('stool', 18, 14);
  b.put('plant', 3, 15, { v: 'fiddle' }); b.put('plant', 20, 15, { v: 'fiddle' });
  b.sign(14, 15, ['Quiet, please.', 'The dome is 35 metres up. Everyone who walks in looks straight up, then pretends they did not.']);
  b.put('doormat', 12, 16);
  b.npc('margaret', 11, 8, { face: 'down' });
  b.exit(12, 17, 1, 1, 'swanston', 'reading', 'Swanston St');
  b.entry('door', 12, 16, 'up');
  b.noDress = true;
  return b.finish();
}
