// Inside ANACONDA, Plenty Rd, Preston: tents pitched on the shop floor, a
// rack of kayaks, fishing rods, shelves of camping gear, and Bazza at the
// counter (fishing rods unlock fishing, see WorldScene.goFishing).
import { MapBuilder } from '../MapBuilder.js';

export function buildAnaconda() {
  const b = new MapBuilder({ id: 'anaconda', w: 24, h: 16, fill: 'W', seed: 871 });
  b.fill(1, 2, 22, 13, 'o');
  b.set(12, 15, 'D');
  b.put('kayakrack', 1, 2); b.put('rodrack', 5, 2); b.put('rodrack', 7, 2); b.put('bunshelf', 10, 2, { v: 'garden' });
  b.put('tent', 3, 6, { v: 'orange' }); b.put('tent', 9, 6, { v: 'green' });
  b.put('picnic', 16, 6); b.put('bunshelf', 19, 2, { v: 'tools' });
  b.put('shopcounter', 2, 12);
  b.sign(15, 11, ['PLAY MORE, PAY LESS.', 'A rod, some bait, and Edwardes Lake. That is the whole plan.']);
  b.put('doormat', 12, 14);
  b.npc('bazza', 5, 12, { face: 'right' });
  b.exit(12, 15, 1, 1, 'preston', 'anaconda', 'Plenty Rd');
  b.entry('door', 12, 14, 'up');
  b.noDress = true;
  return b.finish();
}
