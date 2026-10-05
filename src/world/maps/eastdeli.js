// PASTA LA VISTA, the deli on Lygon St, Brunswick East. A long glass case of
// cheese, salami and olives, shelves of tinned everything, a slicer older
// than Enzo, and Enzo himself, who will not sell you young cheese.
import { MapBuilder } from '../MapBuilder.js';

export function buildEastDeli() {
  const b = new MapBuilder({ id: 'eastdeli', w: 20, h: 15, fill: 'W', seed: 661 });
  b.fill(1, 2, 18, 12, 'T');
  b.set(10, 14, 'D');

  b.put('delicase', 2, 6); b.put('delicase', 6, 6);
  b.put('shopcounter', 10, 6);
  b.put('shopshelf', 1, 2, { v: 'treats' }); b.put('shopshelf', 3, 2, { v: 'treats' });
  b.put('shopshelf', 6, 2, { v: 'toys' }); b.put('shopshelf', 15, 2, { v: 'treats' });
  b.put('wineshelf', 17, 2, { v: 'red' });
  b.put('shelf', 13, 1, { v: 'wall', onWall: true }); b.put('picture', 9, 1, { v: 'family', onWall: true });
  b.put('planttable', 15, 10, { v: 'natives' });
  b.put('doormat', 10, 13);
  b.sign(2, 10, ['Two years minimum.', 'Enzo does not sell young cheese. "Anything younger is for children." He has said this since 1981.']);

  b.npc('enzo', 5, 9, { face: 'up' });
  b.exit(10, 14, 1, 1, 'lygon', 'eastdeli', 'Lygon St');
  b.entry('door', 10, 13, 'up');
  b.noDress = true;
  return b.finish();
}
