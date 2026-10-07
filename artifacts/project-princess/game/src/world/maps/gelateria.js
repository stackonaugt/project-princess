// Inside the GELATERIA on Lygon St: terrazzo, a long glass case of tubs,
// a few marble tables, and Gina, who has opinions about pistachio.
import { MapBuilder } from '../MapBuilder.js';

export function buildGelateria() {
  const b = new MapBuilder({ id: 'gelateria', w: 16, h: 12, fill: 'W', seed: 908 });
  b.fill(1, 2, 14, 9, 'Q');
  b.set(8, 11, 'D');
  b.put('gelatocase', 3, 3); b.put('gelatocase', 6, 3);
  b.put('counter', 10, 3, { v: 'kettle' }); b.put('fridge', 12, 2);
  b.put('picture', 3, 1, { v: 'beach', onWall: true }); b.put('shelf', 12, 1, { onWall: true });
  b.put('table', 3, 7); b.put('stool', 2, 7); b.put('stool', 4, 7);
  b.put('table', 12, 7); b.put('stool', 11, 7); b.put('stool', 13, 7);
  b.put('plant', 1, 9, { v: 'fiddle' }); b.put('plant', 14, 9, { v: 'fern' });
  b.sign(9, 5, ['Today\'s flavours.', 'Pistachio, fior di latte, stracciatella, blood orange, and "Nonna\'s tiramisu" (do not ask Gina for the recipe).']);
  b.put('doormat', 8, 10);
  b.npc('gina', 7, 5, { face: 'down' });
  b.exit(8, 11, 1, 1, 'lygon', 'gelateria', 'Lygon St');
  b.entry('door', 8, 10, 'up');
  b.noDress = true;
  return b.finish();
}
