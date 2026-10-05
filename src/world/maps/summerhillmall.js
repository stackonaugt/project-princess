// Inside SUMMERHILL SHOPPING CENTRE: a terrazzo concourse lined with shops,
// each with its shopkeeper out the front. Summerhill Fresh (Deb), the chemist
// (Mei), the newsagency (Kostas), hot bread (Thuy), Everything $2 (Raj) and
// Curl Up & Dye (Shaz, chat only). The food court stalls sit in the middle
// with Bill at his usual table, and Connie walks her laps.
//
//   y0-1 top wall   y2-4 shopfronts   y5-18 concourse   y19 bottom wall, doors at x20-21
import { MapBuilder } from '../MapBuilder.js';

export function buildSummerhillMall() {
  const b = new MapBuilder({ id: 'summerhillmall', w: 42, h: 20, fill: 'W', seed: 171 });
  b.fill(1, 2, 40, 17, 'Q');
  b.set(20, 19, 'D').set(21, 19, 'D');

  // Shopfronts along the top
  b.put('supermarket', 1, 2);
  b.put('mallshop', 11, 2, { v: 'chemist' });
  b.put('mallshop', 17, 2, { v: 'news' });
  b.put('mallshop', 23, 2, { v: 'hotbread' });
  b.put('mallshop', 29, 2, { v: 'twodollar' });
  b.put('mallshop', 35, 2, { v: 'hair' });
  b.npc('deb', 5, 5, { face: 'down' });
  b.npc('mei', 13, 5, { face: 'down' });
  b.npc('kostas', 19, 5, { face: 'down' });
  b.npc('thuy', 25, 5, { face: 'down' });
  b.npc('raj', 31, 5, { face: 'down' });
  b.npc('shaz', 37, 5, { face: 'down' });

  // The food court
  b.put('foodstall', 4, 9, { v: 'dimsum' }); b.put('foodstall', 9, 9, { v: 'kebab' }); b.put('foodstall', 14, 9, { v: 'sushi' });
  for (const x of [5, 9, 13, 17]) { b.put('table', x, 13); b.put('stool', x - 1, 13); b.put('stool', x + 1, 13); }
  b.put('table', 7, 16); b.put('table', 11, 16); b.put('table', 15, 16);
  b.npc('bill', 10, 12, { face: 'down' });
  b.sign(19, 10, ['Food court.', 'Dim sum, kebabs, sushi. Bill has had the same table since 1996. Do not sit there.']);

  // The other end: a coin ride, benches and big pot plants
  b.put('kiddieride', 30, 11); b.put('kiddieride', 32, 11);
  b.sign(31, 13, ['A coin ride shaped like a W-class tram.', 'Two dollars for one minute. It goes nowhere, slowly. Exactly like the real thing.']);
  b.put('bench', 26, 15); b.put('bench', 35, 15);
  b.put('tallplant', 24, 9); b.put('tallplant', 40, 9); b.put('tallplant', 1, 17); b.put('tallplant', 40, 17);
  b.put('floorswirl', 27, 8, { v: 'mint' }); b.put('floorswirl', 21, 15, { v: 'pink' });
  b.sign(18, 17, ['Centre directory.', 'You are here. So is everyone else in Reservoir on a Tuesday.']);
  b.put('doormat', 20, 18);

  b.npc('connie', 3, 7, { path: [[3, 7], [39, 7], [39, 17], [23, 17], [23, 15], [3, 15]], speed: 44 });

  b.exit(20, 19, 2, 1, 'summerhill', 'door', 'Car park');
  b.entry('door', 20, 18, 'up');
  b.noDress = true;
  return b.finish();
}
