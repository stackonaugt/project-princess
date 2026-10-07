// BELL ST, Coburg: the crossroads of the north. Six lanes of Bell St
// traffic, with Sydney Rd crossing it (the 19 tram tracks) north to Coburg's
// shops and south back to Brunswick. New apartments on the north-west corner
// (Pentridge's gatehouse is up Sydney Rd now, coburgsyd.js), Coburg Town Hall
// on the north-east, a bluestone lane up to Murray Rd, and brick houses with
// nonna gardens on the south side.
//
//   y2-8 apartments | Sydney Rd x25-30 | Town Hall x31-42, lane x43-44
//   y9 footpath   y10-13 Bell St   y14 footpath   y15-25 houses and gardens
import { MapBuilder } from '../MapBuilder.js';
import { street, furnish } from './citykit.js';

export function buildCoburg() {
  const b = new MapBuilder({ id: 'coburg', w: 48, h: 26, fill: 'c', seed: 304 });
  street(b, 9, { rows: 4, trucks: true, speed: 62 });

  // Sydney Rd crosses Bell St: footpath, road, tram tracks, road, footpath
  for (const [x, c] of [[25, 'f'], [26, '#'], [27, '+'], [28, '+'], [29, '#'], [30, 'f']]) {
    b.vline(x, 0, 8, c); b.vline(x, 15, 25, c);
    if (c !== 'f') { b.set(x, 9, c); b.set(x, 14, c); }
  }
  b.fill(26, 9, 4, 1, 'z'); b.fill(26, 14, 4, 1, 'z');

  // North-west: new apartments behind a low fence and street trees
  b.fill(0, 0, 25, 8, 'c');
  b.put('aptblock', 1, 3, { v: 'grey' }); b.put('aptblock', 14, 3, { v: 'grey' });
  b.fenceH(0, 24, 8, 'metal', [11, 12]);
  b.put('streettree', 6, 8); b.put('streettree', 18, 8);

  // North-east: Coburg Town Hall, the lane up to the market, a cafe and a terrace
  b.fill(31, 0, 12, 5, 'L');
  b.put('townhall', 31, 5, { v: 'merribek' });
  b.sign(33, 9, ['Coburg Town Hall.', 'Moreland City Council became Merri-bek in 2022. The bins have not noticed.']);
  b.fill(43, 0, 2, 9, 'b');
  b.sign(45, 9, ['Bluestone lane.', 'A shortcut up to Murray Rd. Mind the trolleys.']);
  b.put('terrace', 45, 6, { v: 'sand' });
  furnish(b, 9, { skip: [11, 12, 13, 14, 16, 25, 26, 27, 28, 29, 30, 31, 33, 36, 37, 38, 43, 44, 45], seed: 5 });
  furnish(b, 14, { skip: [25, 26, 27, 28, 29, 30, 36, 37, 38, 39, 46], seed: 1, step: 8 });

  // South: brick veneers, a nonna's veggie garden and lemon tree
  b.fill(0, 15, 25, 11, '.'); b.fill(31, 15, 17, 11, '.');
  b.put('brickhouse', 1, 16, { v: 'tan' }); b.put('weatherboard', 6, 16, { v: 'mint' });
  b.fenceH(0, 10, 19, 'brickwall', [3, 8]);
  b.put('veggie', 12, 16); b.put('veggie', 12, 19); b.put('tree', 16, 17, { v: 'lemon' }); b.put('tree', 17, 21, { v: 'lemon' });
  b.fenceH(11, 18, 15, 'picket', [14]);
  b.put('brickhouse', 19, 16, { v: 'red' });
  b.put('ute', 21, 20, { v: 'silver' });
  b.fill(20, 19, 3, 1, 'h');
  b.sign(24, 21, ['Sydney Rd, south.', 'Back down to Albion St and the Edinburgh Castle, Brunswick.']);
  b.put('brickhouse', 32, 16, { v: 'red' });
  b.put('weatherboard', 40, 16, { v: 'lemon' });
  b.put('tall', 44, 16, { v: 'cypress' }); b.put('tall', 46, 16, { v: 'cypress' });
  b.fenceH(31, 35, 19, 'brickwall', [34]); b.fenceH(40, 47, 19, 'brickwall', [42]);
  b.wildGrass(8, 23, 4, 1.6); b.wildGrass(33, 23, 2.4, 1.6);
  b.put('billboard', 41, 21, { v: 'pies' });
  b.sign(45, 15, ['Bell St, Coburg.', 'Brunswick people think the world ends at Bell St. It does not. It gets better pide.']);

  b.forage(14, 23, ['lemon', 'carrot']);
  b.forage(45, 23, ['cheese', 'pide']);
  b.magpies([[5, 23], [34, 22]]);

  b.lane({ axis: 'y', pos: 26.5, dir: 1, from: -3, to: 29, every: [9, 18], speed: 56, kinds: ['veh-car-v-silver', 'veh-car-v-yellow'] });
  b.lane({ axis: 'y', pos: 29.5, dir: -1, from: -3, to: 29, every: [10, 20], speed: 56, kinds: ['veh-car-v-yellow', 'veh-car-v-silver'] });

  b.exit(0, 9, 1, 1, null, null, 'Roadworks');   // no direct Bell St–Moreland shortcut
  b.exit(47, 14, 1, 1, 'preston', 'west', 'Plenty Rd, Preston');
  b.exit(25, 25, 6, 1, 'albion', 'east', 'Sydney Rd, Brunswick');
  b.exit(25, 0, 6, 1, 'coburgsyd', 'west', 'Sydney Rd, Coburg');
  b.exit(43, 0, 2, 1, 'murray', 'south', 'Murray Rd');
  b.entry('west', 1, 9, 'right').entry('east', 46, 14, 'left').entry('south', 25, 24, 'up')
    .entry('north', 25, 1, 'down').entry('market', 43, 1, 'down');
  // Lived-in touches: pot plants and bikes outside shops (walk-through)
  b.scatter([0, 0, b.w, b.h], 0.012, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  // Meghan Hopper walks Whitlam up and down Bell St in his pram.
  b.npc('meghan', 33, 14, { face: 'right', path: [[33, 14], [46, 14], [46, 14], [33, 14]], speed: 26 });
  return b.finish();
}
