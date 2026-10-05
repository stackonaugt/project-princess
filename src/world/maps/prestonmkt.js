// PRESTON MARKET: rows of stalls on a concrete floor, the car park to the
// north, and the fight to keep it. Stavros's deli, Linh's fruit and veg,
// Marko's fish, a cake stall and a plant stall, plus a few shuttered ones
// with SAVE PRESTON MARKET signs. Bev and her clipboard by the entrance.
// In the south-west corner, the fenced-off "redevelopment site", gone to
// weeds (artist's impressions blow about in it). West to Murray Rd (Alison's),
// east to Preston Station,
// south down a bluestone lane to Bell St.
//
//   y0-8 car park   y9 entrance footpath   y10-24 the market floor   y25-27 the redevelopment site and lane
import { MapBuilder } from '../MapBuilder.js';

export function buildPrestonMkt() {
  const b = new MapBuilder({ id: 'prestonmkt', w: 44, h: 28, fill: 'c', seed: 351 });

  // The car park
  b.fill(0, 0, 44, 8, 'P');
  b.fill(0, 4, 44, 1, '#');
  [[2, 1, 'white'], [8, 2, 'red'], [14, 1, 'silver'], [26, 2, 'blue'], [32, 1, 'white'], [5, 6, 'yellow'], [19, 6, 'silver'], [29, 6, 'red'], [38, 6, 'white']].forEach(([x, y, v]) => b.put('car', x, y, { v }));
  b.put('ute', 40, 1, { v: 'silver' });
  b.put('trolley', 23, 2); b.put('trolley', 35, 6); b.put('trolley', 12, 6);
  b.fill(0, 8, 44, 2, 'f');
  b.put('marketsign', 20, 8);
  b.put('placard', 18, 9); b.put('placard', 23, 9);

  // The market floor: three rows of stalls with aisles between
  b.fill(0, 10, 44, 15, 'k');
  const rows = [
    [11, [['deli', 4], ['cakes', 9], ['shut', 14], ['fruit', 24], ['fruit', 29], ['shut', 34]]],
    [16, [['fish', 4], ['shut', 9], ['plants', 14], ['deli', 24], ['cakes', 29], ['plants', 34]]],
    [21, [['shut', 4], ['fruit', 9], ['fish', 14], ['shut', 24], ['deli', 29], ['shut', 34]]],
  ];
  for (const [y, stalls] of rows) for (const [v, x] of stalls) b.put('stall', x, y, { v });
  b.put('placard', 13, 23); b.put('placard', 27, 13); b.put('placard', 38, 23);
  b.put('bench', 20, 14); b.put('bench', 20, 19); b.put('parkbin', 22, 14);
  b.put('crate', 3, 13, { v: 'blue' }); b.put('crate', 8, 18, { v: 'red' }); b.put('crate', 33, 13, { v: 'red' });
  b.sign(19, 10, ['Preston Market, since 1970.', 'Fruit, fish, fetta and forty languages. Every stallholder here signed the petition.']);

  // The "redevelopment site": fenced off and gone to weeds
  b.fill(0, 25, 34, 3, '.');
  b.ellipse(8, 26, 7, 1.6, '"', '.').ellipse(24, 26, 6, 1.6, '"', '.');
  b.fenceH(0, 33, 25, 'park', [16, 17]);
  b.sign(15, 24, ['Proposed Preston Market Precinct.', '"Thousands of new homes and a reimagined market." The weeds were here first.']);
  b.put('billboard', 28, 26, { v: 'rent' });
  // ...and the lane down to Bell St
  b.fill(34, 25, 10, 3, 'b');
  b.fill(37, 24, 3, 1, 'b');

  // The stallholders
  b.npc('stavros', 5, 13, { face: 'down' });
  b.npc('linh', 25, 13, { face: 'down' });
  b.npc('marko', 5, 18, { face: 'down' });
  b.npc('bev', 21, 9, { face: 'down' });

  b.exit(43, 8, 1, 17, 'prestonhigh', 'west', 'Preston Station');
  b.exit(0, 10, 1, 15, 'murray', 'east', 'Murray Rd');
  b.exit(38, 27, 2, 1, 'coburg', 'market', 'Bell St');
  b.entry('east', 42, 12, 'left').entry('south', 38, 26, 'up').entry('west', 1, 12, 'right');

  b.forage(41, 1, ['tennis', 'chicken']);
  b.forage(3, 26, ['fetta', 'sardine']);
  b.forage(31, 26, ['lemon', 'carrot']);
  b.magpies([[16, 26], [42, 20]]);
  return b.finish();
}
