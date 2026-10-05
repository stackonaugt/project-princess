// Inside FRANCO COZZO, Barkly St, Footscray: a showroom of couches (the
// banana couch front and centre), armchairs, dining sets and lamps. Sal at
// the counter. Megalo!
import { MapBuilder } from '../MapBuilder.js';

export function buildCozzo() {
  const b = new MapBuilder({ id: 'cozzo', w: 22, h: 15, fill: 'W', seed: 861 });
  b.fill(1, 2, 20, 12, 'K');
  b.set(11, 14, 'D');
  b.put('rug', 2, 4, { v: 'red' }); b.put('rug', 9, 4, { v: 'blue' }); b.put('rug', 15, 4, { v: 'red' });
  b.put('couch', 2, 4, { v: 'front-leather' }); b.put('couch', 9, 4, { v: 'front-banana' }); b.put('couch', 16, 4, { v: 'front' });
  b.put('floorlamp', 6, 3); b.put('floorlamp', 13, 3); b.put('armchair', 19, 7);
  b.put('dining', 3, 8); b.put('dining', 14, 8); b.put('sidetable', 9, 8); b.put('armchair', 11, 8);
  b.put('plant', 20, 3, { v: 'fiddle' });
  b.put('shopcounter', 2, 11);
  b.sign(7, 11, ['MEGALO SALE!', 'Every couch, every day, forever. The sale never ends. It has never ended.']);
  b.put('doormat', 11, 13);
  b.npc('sal', 5, 11, { face: 'right' });
  b.exit(11, 14, 1, 1, 'footscray', 'cozzo', 'Barkly St');
  b.entry('door', 11, 13, 'up');
  b.noDress = true;
  return b.finish();
}
