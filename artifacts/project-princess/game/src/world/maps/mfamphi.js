// MEREDITH: THE SUPERNATURAL AMPHITHEATRE. A grassy bowl falling down to
// the One and Only Stage, with couches all over the hill and two strings of
// fabric lanterns running from the stage up the hill (they glow at night).
// From up here you see the back of the stage, with the music pouring out of
// it (the front is a cutscene, mfstagefront.js). Up the back: the
// International Food Court with the Tucker Tent, the Red Tree and the Pink
// Flamingo (walk in: mfflamingo.js). Heaven Eleven is down the bottom left.
// The crew's couch goes on the hill once you have carried it down.
import { MapBuilder } from '../MapBuilder.js';
import { road, gums, lanternString, mfStage, mfCursed } from './mfkit.js';
import { MF_STAGE } from '../../data/meredith.js';

export function buildMfAmphi() {
  const b = new MapBuilder({ id: 'mfamphi', w: 58, h: 42, seed: 9103 });

  // The back of the bowl: the Esplanade along the top, paths down the sides
  road(b, 0, 9, 57, 9, 2);
  road(b, 0, 4, 6, 9, 2);
  road(b, 0, 21, 6, 21, 3);
  road(b, 52, 9, 55, 7, 3);
  road(b, 52, 33, 55, 35, 3);
  road(b, 4, 10, 4, 33, 2); road(b, 52, 10, 52, 33, 2);
  // The hill (mown) and the mosh in front of the stage
  b.fill(7, 11, 44, 20, 'L');
  b.fill(9, 28, 40, 6, 'u');

  b.put('mfstageback', 22, 34);
  b.put('mflighttower', 12, 27); b.put('mflighttower', 45, 27);
  b.sign(20, 31, ['The One and Only Stage.', 'One stage, every band. No clashes, no rushing about. Just find a spot and stay.']);

  // International Food Court, top left
  b.fill(7, 1, 22, 7, 'u');
  b.put('mffood', 8, 1, { v: 'dumpling' }); b.put('mffood', 13, 1, { v: 'pizza' }); b.put('mffood', 18, 1, { v: 'tucker' }); b.put('mffood', 23, 1, { v: 'coffee' });
  b.put('picnic', 10, 5); b.put('picnic', 16, 5); b.put('picnic', 22, 5);
  b.sign(7, 7, ['The International Food Court.', 'Eating and drinking and not much else. Curries, burgers, noodles and an inordinate number of coffee carts.']);

  // The Red Tree, at the back of the Amphitheatre
  b.put('mfredtree', 31, 6);
  b.sign(34, 7, ['The Red Tree.', 'A dead gum tree at the back of the Amphitheatre. Somebody painted it red in about 2004. It has stayed red.']);

  // The Pink Flamingo, top right: walk in under the marquee
  b.put('mfflamingo', 41, 1);
  b.fill(40, 4, 10, 4, 'u');
  b.sign(39, 4, ['The Pink Flamingo.', 'We never close. Much. Opening hours vary. So do the patrons.']);
  b.exit(43, 4, 3, 1, 'mfflamingo', 'amphi', 'The Pink Flamingo');

  // Heaven Eleven, bottom left: walk up to the counter and buy (no clerk)
  b.fill(5, 34, 15, 8, 'u');
  b.put('mfheaven', 7, 36, { shop: 'heaveneleven' });
  b.sign(14, 39, ['Heaven Eleven.', 'Open all day and all night. Ice, sunscreen, socks and pies. What else is there?']);

  // Couches all over the hill (strangers'), and lanterns strung across it
  const couches = ['green', 'red', 'floral', 'brown', 'blue', 'mustard'];
  let k = 0;
  for (let y = 12; y <= 26; y += 3) for (let x = 8 + (y % 2) * 2; x <= 46; x += 6) {
    if ((x * 7 + y * 3) % 5 === 0) continue;
    if (x >= 22 && x <= 28 && y >= 15 && y <= 18) continue;   // our spot
    b.put('mfcouch', x, y, { v: couches[k++ % couches.length] });
  }
  b.reserve(25, 17, 2);
  if (mfStage() >= MF_STAGE.night) b.put('mfcouch', 24, 17, { v: 'crew' });
  // Two strings of lanterns, from the stage diagonally up the hill to the left and the right
  lanternString(b, 20, 31, -1, 10);
  lanternString(b, 36, 31, 1, 10);

  // At night the crowd packs in: silhouettes in the mosh and against the
  // barrier (gone once the Ice Kids' curse scatters everyone).
  const st = mfStage();
  if (st >= MF_STAGE.night && !(st >= MF_STAGE.sunrise && mfCursed())) {
    const v = 'abcdef';
    let n = 0;
    for (const y of [29, 31]) for (let x = 9 + (y === 31 ? 1 : 0); x <= 45; x += 4) {
      if (x >= 25 && x <= 30) continue;                       // the aisle down to the stage
      if (y === 31 && x >= 18 && x <= 22) continue;           // the stage sign
      b.put('mfsil', x, y, { v: v[n++ % 6] });
    }
  }
  gums(b, [0, 10, 4, 32], 0.4, ['blue', 'red']);
  gums(b, [54, 10, 4, 32], 0.4, ['blue', 'red']);
  gums(b, [0, 36, 5, 6], 0.25, ['red']); gums(b, [37, 36, 21, 6], 0.25, ['red']);
  b.wildGrass(2, 38, 2, 2); b.wildGrass(55, 39, 2, 2);

  b.npc('rose', 14, 14, { face: 'down' });
  b.npc('mem', 33, 20, { face: 'down' });
  b.npc('corni', 35, 20, { face: 'down' });
  b.npc('alison', 42, 15, { face: 'down' });
  b.npc('jordan', 10, 24, { face: 'right' });
  b.npc('mfcouchking', 30, 25, { face: 'down' });
  b.npc('charlotte', 23, 16, { face: 'down', mf: { from: MF_STAGE.wristband } });
  b.npc('gabe', 27, 16, { face: 'down', mf: { from: MF_STAGE.night } });
  b.npc('seb', 25, 16, { face: 'down', mf: { from: MF_STAGE.hunt } });

  b.exit(0, 4, 1, 3, 'mfreception', 'amphi', 'Reception');
  b.exit(0, 21, 1, 3, 'mfbush', 'amphi', 'Bush Camp');
  b.exit(57, 7, 1, 3, 'mftop', 'amphi', 'Top Camp');
  b.exit(57, 35, 1, 3, 'mfsunset', 'amphi', 'South Bank');
  b.entry('reception', 2, 5, 'right').entry('bush', 2, 22, 'right').entry('top', 55, 8, 'left').entry('sunset', 55, 36, 'left')
    .entry('couch', 25, 19, 'up').entry('flamingo', 44, 6, 'down');
  return b.finish();
}
