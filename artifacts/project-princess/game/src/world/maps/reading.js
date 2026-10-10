// THE READING ROOM, State Library Victoria: an oval domed hall, long
// timber desks with green lamps under the dome, bookcases round the walls,
// and Margaret at the enquiries desk in the middle. Shhh.
import { MapBuilder } from '../MapBuilder.js';
import { withTerrainFeatures } from '../../art/paint/terrain-features.js';

export function buildReading() {
  const b = new MapBuilder({ id: 'reading', w: 24, h: 18, fill: 'W', seed: 909 });
  b.ellipse(11.5, 9, 11, 7.8, 'o');
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
  const map = b.finish();
  // Keep original source objects unchanged so saved source snapshots continue
  // to resolve. These default positions apply before the creator's own moves.
  const positions = {
    'bookcase:4,2': [5, 3], 'bookcase:8,2': [9, 2],
    'bookcase:14,2': [13, 2], 'bookcase:18,2': [17, 3],
    'bookcase:1,7': [2, 7], 'bookcase:1,10': [2, 10],
    'bookcase:21,7': [20, 7], 'bookcase:21,10': [20, 10],
    'plant:3,15': [5, 14], 'plant:20,15': [19, 14],
  };
  map.objectLayout = Object.fromEntries(map.objects.flatMap((object, index) => {
    const position = positions[`${object.kind}:${object.x},${object.y}`];
    return position ? [[index, { x: position[0], y: position[1] }]] : [];
  }));
  return withTerrainFeatures(map, [{
    id: 'oval-room', name: 'Oval Reading Room',
    bounds: [0, 0, 24, 18], replace: 'Wo', indoor: true,
    layers: [{ material: 'o', edge: '#f2f0ea', lineWidth: 6, shapes: [
      { kind: 'ellipse', cx: 12, cy: 9.5, rx: 11, ry: 7.8 },
    ] }],
  }]);
}
