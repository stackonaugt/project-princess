// SYDNEY RD: the busiest bit of Brunswick. A1 Bakery with its big sign,
// blue wavy parapet and outdoor tables under the verandah (Spooky haunts
// the footpath out the front), red-brick shops, the 19 tram. West to the
// station, north up Donald St, east towards Coburg and Reservoir.
import { MapBuilder } from '../MapBuilder.js';

export function buildSydney() {
  const b = new MapBuilder({ id: 'sydney', w: 44, h: 26, seed: 101 });

  // Sydney Rd runs across the map: footpath, road, two tram tracks, road, footpath
  b.hline(0, 43, 12, 'f').hline(0, 43, 13, 'f');
  b.hline(0, 43, 14, '#').hline(0, 43, 15, '+').hline(0, 43, 16, '+').hline(0, 43, 17, '#');
  b.hline(0, 43, 18, 'f').hline(0, 43, 19, 'f');

  // North side: A1 Bakery and its neighbours
  b.put('redshop', 1, 9, { v: 'cream' });
  b.put('a1bakery', 6, 9);
  b.put('verandah', 6, 12);
  b.put('picnic', 7, 12); b.put('picnic', 11, 12);
  b.put('redshop', 14, 9, { v: 'red' });
  b.put('shop', 18, 9, { v: 'books' });
  b.put('cafe', 22, 9);
  b.put('table', 23, 12); b.put('table', 25, 12);
  // Donald St heads north between the shops
  b.fill(27, 0, 2, 12, '#').vline(26, 0, 11, 'f').vline(29, 0, 11, 'f');
  b.put('shop', 30, 9, { v: 'pho' });
  b.put('redshop', 34, 9, { v: 'red' });
  b.put('shop', 38, 9, { v: 'signs' });
  b.sign(25, 11, ['Donald St.', 'Quiet street, big trees, and a very important tabby.']);
  b.sign(5, 11, ['A1 Bakery.', 'Open every day. Fresh bread, za\'atar pies and the best seat on Sydney Rd. Spooky agrees.']);

  // Back lanes and car parking behind the shops
  b.fill(0, 6, 26, 2, 'b').fill(30, 6, 14, 2, 'b');
  b.put('bin', 3, 6, { v: 'red' }); b.put('bin', 20, 6, { v: 'yellow' }); b.put('crate', 12, 7, { v: 'blue' });
  b.put('mural', 32, 5, { v: 'a' });

  // South side
  b.put('terrace', 1, 20, { v: 'cream' }); b.put('shop', 4, 20, { v: 'records' }); b.put('redshop', 8, 20, { v: 'cream' });
  b.put('shop', 12, 20, { v: 'bakery' }); b.put('terrace', 16, 20, { v: 'sage' }); b.put('shop', 19, 20, { v: 'curry' });
  b.put('redshop', 23, 20, { v: 'red' }); b.put('shop', 27, 20, { v: 'pizza' }); b.put('terrace', 31, 20, { v: 'brick' });
  b.put('shop', 34, 20, { v: 'milk bar' }); b.put('redshop', 38, 20, { v: 'cream' });
  b.put('tramstop', 20, 13); b.put('tramstop', 9, 18);
  b.put('powerpole', 4, 13); b.put('powerpole', 16, 13); b.put('powerpole', 33, 13);
  b.put('powerpole', 15, 18); b.put('powerpole', 30, 18);
  b.put('bikehoop', 13, 13);

  b.exit(0, 12, 1, 8, 'brunswick', 'east', 'Brunswick Station');
  b.exit(43, 12, 1, 8, 'reservoir', 'west', 'Reservoir');
  b.exit(27, 0, 2, 1, 'donald', 'south', 'Donald St');
  b.entry('west', 1, 13, 'right').entry('east', 42, 13, 'left').entry('donald', 27, 2, 'down');

  b.npc('jules', 24, 13, { face: 'down' });
  b.npc('busker', 17, 12, { face: 'down' });

  b.lane({ axis: 'x', pos: 15.5, dir: 1, from: -6, to: 50, every: [25, 45], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 16.5, dir: -1, from: -6, to: 50, every: [30, 50], speed: 50, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 14.5, dir: -1, from: -3, to: 47, every: [6, 12], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 17.5, dir: 1, from: -3, to: 47, every: [6, 12], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });

  b.forage(15, 7, ['sardine', 'croissant']);
  b.forage(40, 13, ['feather', 'cheese']);
  b.magpies([[36, 7]]);
  b.border(['oak', 'fruit']);
  b.scatter([1, 1, 25, 5], 0.15, [['tree', 2, ['oak', 'fruit']], ['bush', 2, ['green', 'rose']]]);
  b.scatter([30, 1, 13, 5], 0.15, [['tree', 2, ['oak']], ['bush', 2, ['green']]]);
  return b.finish();
}
