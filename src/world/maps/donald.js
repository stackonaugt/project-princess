// DONALD ST: Rose's street, just off Sydney Rd. Her three-storey blue-grey
// block of flats with the charcoal slat fence (Salami's turf), Victorian
// houses with white rendered fences, tall poplars, and the new apartment
// towers looming behind.
import { MapBuilder } from '../MapBuilder.js';

export function buildDonald() {
  const b = new MapBuilder({ id: 'donald', w: 40, h: 26, seed: 111 });

  // Donald St with parking lanes
  b.fill(0, 14, 40, 2, '#').hline(0, 39, 13, 'f').hline(0, 39, 16, 'f');
  // Down to Sydney Rd
  b.fill(26, 16, 2, 10, '#').vline(25, 17, 25, 'f').vline(28, 17, 25, 'f');

  // Rose's flats, driveway down the side to the car park behind
  b.put('flats', 3, 7);
  b.fill(12, 1, 3, 12, 'c');
  b.put('car', 12, 3, { v: 'silver' });
  b.fill(2, 10, 10, 2, '.');
  b.fenceH(1, 15, 12, 'slat', [12, 13, 14]);
  b.put('mailpillar', 15, 11);
  b.put('bush', 4, 11, { v: 'green' }); b.put('agapanthus', 7, 11);
  b.put('tree', 8, 13, { v: 'oak' });
  b.put('bikehoop', 5, 13);
  b.sign(11, 11, ['10 Donald St.', 'Rose lives here. So does Salami, who considers Rose a flatmate at best.']);
  b.put('tall', 1, 5, { v: 'poplar' }); b.put('tall', 1, 9, { v: 'poplar' });

  // Victorian houses with rendered front walls
  b.put('terrace', 17, 8, { v: 'cream' }); b.put('terrace', 20, 8, { v: 'sage' });
  b.put('house', 29, 7, { v: 'red' });
  b.fenceH(16, 38, 12, 'render', [18, 21, 32, 33]);
  b.put('tree', 24, 11, { v: 'fruit' }); b.put('bush', 17, 11, { v: 'hydrangea' }); b.put('bin', 23, 11, { v: 'red' });
  b.put('tree', 22, 13, { v: 'oak' }); b.put('tree', 34, 13, { v: 'oak' });

  // The towers behind
  b.put('aptblock', 18, 2);
  b.put('tall', 16, 4, { v: 'poplar' }); b.put('tall', 37, 3, { v: 'biggum' });

  // South side
  b.put('terrace', 2, 18, { v: 'brick' }); b.put('terrace', 5, 18, { v: 'cream' }); b.put('terrace', 8, 18, { v: 'sand' });
  b.put('house', 13, 18, { v: 'cream' });
  b.put('terrace', 30, 18, { v: 'sage' }); b.put('terrace', 33, 18, { v: 'brick' });
  b.fenceH(1, 23, 17, 'picket', [3, 6, 9, 15, 16]);
  b.put('car', 3, 15, { v: 'blue' }); b.put('car', 18, 14, { v: 'red' }); b.put('car', 33, 15, { v: 'white' });
  b.put('powerpole', 10, 16); b.put('powerpole', 36, 16);

  b.exit(26, 25, 2, 1, 'sydney', 'donald', 'Sydney Rd');
  b.entry('south', 26, 23, 'up');

  b.forage(36, 22, ['sardine', 'feather']);
  b.forage(6, 3, ['chicken', 'ribbon']);
  b.magpies([[20, 23], [6, 4]]);
  b.border(['oak', 'gum', 'fruit']);
  b.scatter([1, 1, 11, 5], 0.12, [['bush', 2, ['green', 'rose']], ['tree', 1, ['oak']]]);
  b.scatter([15, 21, 10, 4], 0.25, [['bush', 2, ['green', 'rose']], ['tree', 1, ['fruit']]]);
  return b.finish();
}
