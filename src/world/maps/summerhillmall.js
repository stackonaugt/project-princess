// Inside SUMMERHILL SHOPPING CENTRE, laid out from the owner's notes: plain
// grey floor, Coles right across the back wall, Bakers Delight on the left at
// the back, the other shops down both sides, a cafe on the right as you come
// in, and the sandwich shop and boba tea in the middle with the food court
// tables. Coles (Deb), Bakers Delight (Thuy), the chemist (Mei), the
// newsagency (Kostas), Everything $2 (Raj), Curl Up & Dye (Shaz, chat only).
// Bill at his usual table, Connie walking her laps, Lyn at the Lincraft stall.
//
//   y0-1 top wall   y2-4 Coles   x1-5 / x38-42 side shops   y23 bottom wall, doors at x21-22
import { MapBuilder } from '../MapBuilder.js';

export function buildSummerhillMall() {
  const b = new MapBuilder({ id: 'summerhillmall', w: 44, h: 24, fill: 'W', seed: 171 });
  b.fill(1, 2, 42, 21, 'q');
  b.set(21, 23, 'D').set(22, 23, 'D');

  // Coles across the whole back wall
  b.put('colesfront', 1, 2, { shop: 'summerfresh', keeper: 'deb' });
  b.npc('deb', 12, 5, { face: 'down' });
  // Down the left side: Bakers Delight at the back, then the chemist and the newsagency
  b.put('mallshop', 1, 6, { v: 'bakers' }); b.npc('thuy', 6, 8, { face: 'left' });
  b.put('mallshop', 1, 11, { v: 'chemist' }); b.npc('mei', 6, 13, { face: 'left' });
  b.put('mallshop', 1, 16, { v: 'news' }); b.npc('kostas', 6, 18, { face: 'left' });
  // Down the right side: the hairdresser, the $2 shop and the cafe by the doors
  b.put('mallshop', 38, 6, { v: 'hair' }); b.npc('shaz', 37, 8, { face: 'right' });
  b.put('mallshop', 38, 11, { v: 'twodollar' }); b.npc('raj', 37, 13, { face: 'right' });
  b.put('mallshop', 38, 17, { v: 'cafe' });
  for (const y of [20, 21]) { b.put('table', 35, y); b.put('stool', 34, y); }

  // The middle: the sandwich shop and boba tea, the food court tables
  b.put('foodstall', 16, 8, { v: 'sandwich' }); b.put('foodstall', 24, 8, { v: 'boba' });
  for (const x of [15, 19, 23, 27]) { b.put('table', x, 12); b.put('stool', x - 1, 12); b.put('stool', x + 1, 12); }
  for (const x of [17, 21, 25]) { b.put('table', x, 15); b.put('stool', x - 1, 15); b.put('stool', x + 1, 15); }
  b.npc('bill', 20, 11, { face: 'down' });
  // Lincraft's stall: craft bits, prank supplies and paint for the house.
  b.put('foodstall', 29, 15, { v: 'lincraft' }); b.npc('lyn', 31, 17, { face: 'down' });
  b.sign(29, 10, ['Food court.', 'Sangas and boba. Bill has had the same table since 1996. Do not sit there.']);

  // A coin ride, benches and big pot plants
  b.put('kiddieride', 10, 20); b.put('kiddieride', 12, 20);
  b.sign(14, 21, ['A coin ride shaped like a W-class tram.', 'Two dollars for one minute. It goes nowhere, slowly. Exactly like the real thing.']);
  b.put('bench', 8, 11); b.put('bench', 31, 18);
  b.put('tallplant', 7, 6); b.put('tallplant', 36, 6); b.put('tallplant', 1, 21); b.put('tallplant', 42, 21);
  b.sign(19, 20, ['Centre directory.', 'You are here. So is everyone else in Reservoir on a Tuesday.']);
  b.put('doormat', 21, 22);

  b.npc('connie', 8, 5, { path: [[8, 5], [35, 5], [35, 18], [24, 18], [24, 17], [8, 17]], speed: 44 });

  b.exit(21, 23, 2, 1, 'summerhill', 'door', 'Car park');
  b.entry('door', 21, 22, 'up');
  b.noDress = true;
  return b.finish();
}
