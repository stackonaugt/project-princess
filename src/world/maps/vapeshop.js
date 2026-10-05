// Inside PLENTY ROAD CONVENIENCE, Preston: glass cases of vapes, a wall of
// American lollies, a drinks fridge, and Sam behind the counter.
import { MapBuilder } from '../MapBuilder.js';

export function buildVapeShop() {
  const b = new MapBuilder({ id: 'vapeshop', w: 16, h: 12, fill: 'W', seed: 881 });
  b.fill(1, 2, 14, 9, 'n');
  b.set(8, 11, 'D');
  b.put('vapecase', 1, 2); b.put('vapecase', 3, 2);
  b.put('candyshelf', 7, 2); b.put('candyshelf', 9, 2);
  b.put('beerfridge', 13, 2, { v: 'cans' });
  b.put('candyshelf', 12, 6);
  b.put('shopcounter', 2, 8);
  b.put('doormat', 8, 10);
  b.npc('sam', 5, 8, { face: 'right' });
  b.exit(8, 11, 1, 1, 'preston', 'vapeshop', 'Plenty Rd');
  b.entry('door', 8, 10, 'up');
  b.noDress = true;
  return b.finish();
}
