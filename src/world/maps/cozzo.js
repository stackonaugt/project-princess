// Inside FRANCO COZZO, Barkly St, Footscray: a big showroom. Beds along the
// back wall, couches in a row, rugs on the floor, armchairs, side tables,
// lamps and bookcases. Walk up to any piece to see its name and price and buy
// it (forSale: an id in data/furniture.js). Franco behind the counter. Megalo!
import { MapBuilder } from '../MapBuilder.js';
import { FURNITURE } from '../../data/furniture.js';

const FV = Object.fromEntries(Object.entries(FURNITURE).map(([id, f]) => [id, f.v]));

export function buildCozzo() {
  const b = new MapBuilder({ id: 'cozzo', w: 30, h: 21, fill: 'W', seed: 861 });
  b.fill(1, 2, 28, 18, 'K');
  b.set(15, 20, 'D');
  const sell = (kind, x, y, id) => b.put(kind, x, y, { v: FV[id], forSale: id });
  // beds along the back wall
  sell('bed', 2, 2, 'canopy'); sell('bed', 5, 2, 'waterbed'); sell('bed', 8, 2, 'brass'); sell('bed', 11, 2, 'futon');
  // bookcases and lamps on the back wall
  sell('bookshelf', 14, 2, 'walnut'); sell('bookshelf', 17, 2, 'crates');
  sell('floorlamp', 20, 2, 'crystal'); sell('floorlamp', 22, 2, 'arc'); sell('floorlamp', 24, 2, 'lava'); sell('floorlamp', 26, 2, 'paper');
  // couches in a row, facing the door
  sell('couch', 13, 6, 'velvet'); sell('couch', 17, 6, 'banana'); sell('couch', 21, 6, 'leather'); sell('couch', 25, 6, 'floral');
  // armchairs and side tables
  sell('armchair', 2, 8, 'wingback'); sell('armchair', 4, 8, 'recliner'); sell('armchair', 6, 8, 'egg'); sell('armchair', 8, 8, 'beanbag');
  sell('sidetable', 2, 11, 'marble'); sell('sidetable', 4, 11, 'glass'); sell('sidetable', 6, 11, 'cane'); sell('sidetable', 8, 11, 'stump');
  // rugs on the showroom floor
  sell('rug', 12, 11, 'persian'); sell('rug', 16, 11, 'shag'); sell('rug', 20, 11, 'stripe'); sell('rug', 24, 11, 'jute');
  b.put('plant', 28, 2, { v: 'fiddle' }); b.put('plant', 1, 18, { v: 'fern' }); b.put('plant', 28, 18, { v: 'fiddle' });
  b.put('shopcounter', 3, 16);
  b.put('doormat', 15, 19);
  b.npc('franco', 4, 15, { face: 'down', counter: true });   // behind the counter
  b.exit(15, 20, 1, 1, 'footscray', 'cozzo', 'Barkly St');
  b.entry('door', 15, 19, 'up');
  b.noDress = true;
  return b.finish();
}
