// Inside KNEAD TO KNOW, Sydney Rd, Coburg: Hakan's Turkish bakery. A big
// wood-fired oven up the back, trays of pide cooling on the racks, a glass
// case of simit and borek, and Hakan at the counter.
import { MapBuilder } from '../MapBuilder.js';

export function buildPideBakery() {
  const b = new MapBuilder({ id: 'pidebakery', w: 16, h: 12, fill: 'W', seed: 881 });
  b.fill(1, 2, 14, 9, 'n');
  b.set(8, 11, 'D');
  b.put('woodoven', 6, 2);
  b.put('bunshelf', 1, 2, { v: 'garden' }); b.put('fridge', 12, 2); b.put('fridge', 13, 2);
  b.put('counter', 10, 3, { v: 'plain' }); b.put('counter', 11, 3, { v: 'sink' });
  b.put('bakecase', 2, 8);
  b.put('table', 11, 7); b.put('table', 13, 7); b.put('table', 11, 9); b.put('table', 13, 9);
  b.put('plant', 14, 9, { v: 'fiddle' });
  b.sign(6, 5, ['The oven.', 'Lit at four every morning. Hakan says it has not gone fully cold since 1989.']);
  b.put('doormat', 8, 10);
  b.npc('hakan', 4, 7, { face: 'down' });
  b.exit(8, 11, 1, 1, 'coburgsyd', 'pidebakery', 'Sydney Rd, Coburg');
  b.entry('door', 8, 10, 'up');
  b.noDress = true;
  return b.finish();
}
