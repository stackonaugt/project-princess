// WAX LYRICAL, the record shop on Lygon St, Brunswick East. Crates of vinyl
// down the middle, gig posters floor to ceiling, a listening turntable in the
// corner, and Juno at the counter, who will let you play it once.
import { MapBuilder } from '../MapBuilder.js';

export function buildRecords() {
  const b = new MapBuilder({ id: 'records', w: 18, h: 15, fill: 'W', seed: 671 });
  b.fill(1, 2, 16, 12, 'o');
  b.set(9, 14, 'D');

  b.put('gigposters', 2, 1, { onWall: true }); b.put('gigposters', 6, 1, { onWall: true }); b.put('gigposters', 12, 1, { onWall: true });
  b.put('recordbin', 2, 4, { v: 'a' }); b.put('recordbin', 5, 4, { v: 'b' }); b.put('recordbin', 8, 4, { v: 'a' });
  b.put('recordbin', 2, 7, { v: 'b' }); b.put('recordbin', 5, 7, { v: 'a' }); b.put('recordbin', 8, 7, { v: 'b' });
  b.put('recordbin', 12, 4, { v: 'a' }); b.put('recordbin', 12, 7, { v: 'b' });
  b.put('shopcounter', 2, 11);
  b.put('stool', 15, 10); b.put('sidetable', 15, 11);
  b.put('plant', 16, 2, { v: 'fiddle' });
  b.put('doormat', 9, 13);
  b.sign(12, 11, ['Play it once.', 'Juno will put anything on the turntable for you. Once. Then you decide. That is the system.']);

  b.npc('juno', 5, 12, { face: 'right' });
  b.exit(9, 14, 1, 1, 'lygon', 'records', 'Lygon St');
  b.entry('door', 9, 13, 'up');
  b.noDress = true;
  return b.finish();
}
