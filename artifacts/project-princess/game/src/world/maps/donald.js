// DONALD ST: Rose's street, just south of Sydney Rd. Her three-storey
// blue-grey block of flats with the charcoal slat fence and the driveway
// down the side (Salami's turf), an old knitting mill turned apartments,
// a weedy vacant lot, and a bluestone lane full of roller doors behind
// the terraces. North back up to Sydney Rd.
import { MapBuilder } from '../MapBuilder.js';

export function buildDonald() {
  const b = new MapBuilder({ id: 'donald', w: 40, h: 26, fill: 'c', seed: 111 });

  // Donald St comes down from Sydney Rd, then runs across the map
  b.fill(27, 0, 2, 14, '#').vline(26, 0, 12, 'f').vline(29, 0, 12, 'f');
  b.hline(0, 39, 13, 'f').fill(0, 14, 40, 2, '#').hline(0, 39, 16, 'f');
  b.fill(27, 13, 2, 1, '#');

  // Rose's flats at number 10, with a scrappy front strip and the driveway
  b.fenceV(0, 0, 12, 'paling');
  b.put('flats', 1, 8);
  b.fill(1, 11, 8, 1, '.').fill(1, 11, 3, 1, '"');
  b.fenceH(1, 9, 12, 'slat', [8]);
  b.put('agapanthus', 9, 11);
  b.fill(10, 0, 3, 13, 'h');
  b.fenceV(9, 0, 7, 'slat');
  b.put('car', 10, 1, { v: 'silver' });
  b.put('crate', 12, 4, { v: 'blue' }); b.put('crate', 12, 5, { v: 'red' }); b.put('bin', 12, 9, { v: 'red' }); b.put('bin', 12, 10, { v: 'yellow' });
  b.put('mailpillar', 13, 12);
  b.sign(14, 12, ['10 Donald St.', 'Rose lives here. So does Salami, who considers Rose a flatmate at best.']);

  // The old knitting mill (apartments now, of course) and the towers behind
  b.fenceV(13, 0, 10, 'paling');
  b.put('aptblock', 14, 3);
  b.put('factory', 14, 9, { v: 'brick' });
  b.put('rollerdoor', 22, 10, { v: 'grey' });
  b.fenceV(25, 0, 9, 'paling');
  b.put('powerpole', 26, 13);

  // A vacant lot behind a palisade fence, in front of an empty tin shed
  b.put('factory', 31, 0, { v: 'tin' });
  b.fill(31, 3, 9, 9, 'g').fill(33, 5, 3, 2, '"').fill(37, 9, 2, 2, '"');
  b.fenceV(30, 0, 12, 'park', [7, 8]).fenceH(31, 39, 12, 'park', [34, 35]);
  b.put('trolley', 36, 5);
  b.sign(32, 11, ['For lease.', 'Development site. Vision: "vibrant". Current residents: weeds, a trolley, one very proud magpie.']);
  b.put('streettree', 38, 13);

  // South side: terraces, a corner shop and walls, backing onto the lane
  b.put('rollerdoor', 0, 19, { v: 'tagged' });
  b.put('terrace', 3, 18, { v: 'brick' }); b.put('terrace', 6, 18, { v: 'cream' }); b.put('terrace', 9, 18, { v: 'sand' });
  b.fill(12, 17, 1, 5, 'b');
  b.graffiti(13, 20);
  b.put('streettree', 14, 16);
  b.put('terrace', 17, 18, { v: 'sage' }); b.put('terrace', 20, 18, { v: 'brick' });
  b.put('rollerdoor', 23, 19, { v: 'green' });
  b.put('redshop', 26, 18, { v: 'cream' });
  b.put('terrace', 30, 18, { v: 'sage' }); b.put('terrace', 33, 18, { v: 'cream' });
  b.graffiti(36, 20, true);
  b.put('powerpole', 8, 16); b.put('powerpole', 36, 16);

  // The bluestone lane behind, with back fences beyond
  b.fill(0, 21, 40, 3, 'b').fill(1, 23, 3, 1, '"');
  b.fenceH(0, 39, 24, 'paling');
  b.put('bin', 10, 21, { v: 'red' }); b.put('crate', 16, 21, { v: 'blue' }); b.put('bin', 29, 21, { v: 'green' });

  // Parked cars
  b.put('car', 3, 15, { v: 'blue' }); b.put('car', 19, 14, { v: 'red' }); b.put('car', 34, 15, { v: 'white' });

  b.exit(27, 0, 2, 1, 'sydney', 'donald', 'Sydney Rd');
  b.exit(39, 16, 1, 2, 'eblygon', 'north', 'Lygon St, Brunswick East');
  b.exit(0, 14, 1, 2, 'brunswick', 'east', 'Brunswick Station');
  b.exit(39, 0, 1, 2, 'albion', 'south', 'Albion St');
  b.entry('albion', 39, 3, 'down').entry('north', 27, 2, 'down').entry('east', 38, 16, 'left').entry('west', 1, 14, 'right');

  b.npc('rose', 10, 11, { face: 'up' });

  b.forage(37, 7, ['sardine', 'feather']);
  b.forage(5, 22, ['chicken', 'ribbon']);
  b.magpies([[34, 8], [20, 22]]);
  // Lived-in touches: pot plants and bikes outside shops (walk-through)
  b.scatter([0, 0, b.w, b.h], 0.02, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
