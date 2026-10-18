// MEREDITH: THE SUPERNATURAL AMPHITHEATRE. A grassy bowl falling down to
// the One and Only Stage, with couches all over the hill and strings of
// fabric lanterns overhead (they glow at night). Up the back: the
// International Food Court, the Red Tree and the Pink Flamingo on its raised
// turf with the pink chairs. The crew's couch goes on the hill once you
// have carried it down (Kouch Hole 2).
import { MapBuilder } from '../MapBuilder.js';
import { road, gums, lanterns, mfStage } from './mfkit.js';
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

  b.put('mfstage', 22, 34);
  b.put('mfspeaker', 18, 33); b.put('mfspeaker', 39, 33);
  b.put('mflighttower', 12, 27); b.put('mflighttower', 45, 27);
  b.sign(20, 31, ['The One and Only Stage.', 'One stage, every band. No clashes, no rushing about. Just find a spot and stay.']);

  // International Food Court, top left
  b.fill(7, 1, 22, 7, 'u');
  b.put('mffood', 8, 1, { v: 'dumpling' }); b.put('mffood', 13, 1, { v: 'pizza' }); b.put('mffood', 18, 1, { v: 'noodles' }); b.put('mffood', 23, 1, { v: 'coffee' });
  b.put('picnic', 10, 5); b.put('picnic', 16, 5); b.put('picnic', 22, 5);
  b.sign(7, 7, ['The International Food Court.', 'Eating and drinking and not much else. Curries, burgers, noodles and an inordinate number of coffee carts.']);

  // The Red Tree, at the back of the Amphitheatre
  b.put('mfredtree', 31, 6);
  b.sign(34, 7, ['The Red Tree.', 'A dead gum tree at the back of the Amphitheatre. Somebody painted it red in about 2004. It has stayed red.']);

  // The Pink Flamingo and its raised turf of pink chairs, top right
  b.put('mfflamingo', 41, 1);
  b.fill(40, 5, 12, 3, 'L');
  for (let x = 41; x <= 50; x += 2) b.put('mfchair', x, 6, { v: 'pink' });
  b.sign(39, 4, ['The Pink Flamingo.', 'We never close. Much. Opening hours vary. So do the patrons.']);

  // Couches all over the hill (strangers'), and lanterns strung across it
  const couches = ['green', 'red', 'floral', 'brown', 'blue', 'mustard'];
  let k = 0;
  for (let y = 12; y <= 26; y += 3) for (let x = 8 + (y % 2) * 2; x <= 46; x += 6) {
    if ((x * 7 + y * 3) % 5 === 0) continue;
    if (x >= 22 && x <= 28 && y >= 15 && y <= 18) continue;   // our spot
    b.put('mfcouch', x, y, { v: couches[k++ % couches.length] });
  }
  b.reserve(25, 17, 2);
  if (mfStage() >= MF_STAGE.night) b.put('mfcouch', 24, 17, { v: 'kouch' });
  for (const [y, s] of [[12, 0], [17, 1], [22, 2], [27, 3]]) lanterns(b, 6, 51, y, s);

  gums(b, [0, 10, 4, 32], 0.4, ['blue', 'red']);
  gums(b, [54, 10, 4, 32], 0.4, ['blue', 'red']);
  gums(b, [0, 36, 21, 6], 0.25, ['red']); gums(b, [37, 36, 21, 6], 0.25, ['red']);
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
  b.npc('mfshuffle', 46, 8, { face: 'down', mf: { night: true } });

  b.exit(0, 4, 1, 3, 'mfreception', 'amphi', 'Reception');
  b.exit(0, 21, 1, 3, 'mfbush', 'amphi', 'Bush Camp');
  b.exit(57, 7, 1, 3, 'mftop', 'amphi', 'Top Camp');
  b.exit(57, 35, 1, 3, 'mfsunset', 'amphi', 'South Bank');
  b.entry('reception', 2, 5, 'right').entry('bush', 2, 22, 'right').entry('top', 55, 8, 'left').entry('sunset', 55, 36, 'left')
    .entry('couch', 25, 19, 'up');
  return b.finish();
}
