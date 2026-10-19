// MEREDITH: BUSH CAMP. Tents under spotted gums along Ring-a-Ding-Ding Road,
// the Sportsfield and its toilet block up the north-east, and down the south
// tip the Ecoplex: a cinema screen in the bush with hay bales to sit on.
import { MapBuilder } from '../MapBuilder.js';
import { road, camp, gums } from './mfkit.js';

export function buildMfBush() {
  const b = new MapBuilder({ id: 'mfbush', w: 54, h: 40, seed: 9102 });

  road(b, 31, 0, 31, 8, 3);                       // from Reception
  road(b, 31, 8, 51, 8, 3);                       // across the Sportsfield to the Amphitheatre
  // Ring-a-Ding-Ding Road, a loop round the camp
  for (let a = 0; a < Math.PI * 2; a += 0.04) b.fill(Math.round(20 + Math.cos(a) * 14), Math.round(18 + Math.sin(a) * 8), 2, 2, '=');
  road(b, 31, 8, 30, 12, 2);
  road(b, 20, 26, 20, 30, 2);                     // To Cinema
  // The Sportsfield and the toilet block
  b.fill(37, 11, 15, 8, 'L');
  b.put('mftoilet', 40, 3);
  b.put('mfwatertank', 47, 3);
  b.put('mfbins', 36, 4);
  b.sign(38, 19, ['The Sportsfield.', 'Footy in the winter. In December, a lot of people lying down.']);
  b.wildGrass(44, 15, 4, 2);

  // The camp: tents everywhere inside and around the loop
  camp(b, [9, 13, 23, 10], 0.95);
  camp(b, [1, 1, 26, 8], 0.9);
  camp(b, [36, 21, 16, 8], 0.9);
  b.reserve(30, 30, 3);

  // The Ecoplex: the screen, the hay bale seats and the projector caravan
  b.fill(12, 31, 18, 7, 'u');
  b.put('mfscreen', 15, 30);
  for (const [x, y] of [[14, 34], [18, 34], [22, 34], [16, 36], [20, 36], [24, 36]]) b.put('mfhaybale', x, y);
  b.put('mfprojector', 27, 36);
  b.sign(12, 33, ['The Ecoplex Cinema.', 'In a secluded corner of Bush Camp. Pelting rain, magpies and a film nobody can name.']);
  b.put('mfportaloo', 30, 24); b.put('mfportaloo', 31, 24, { v: 'green' });

  gums(b, [0, 0, 54, 40], 0.07, ['spotted', 'spotted', 'red']);
  b.wildGrass(6, 30, 4, 3); b.wildGrass(44, 33, 5, 3); b.wildGrass(3, 12, 2, 3);

  b.npc('nathan', 14, 11, { face: 'down' });
  b.npc('sinead', 26, 11, { face: 'down' });
  b.npc('mfglitter', 9, 25, { face: 'right' });

  b.exit(31, 0, 3, 1, 'mfreception', 'bush', 'Reception');
  b.exit(53, 8, 1, 3, 'mfamphi', 'bush', 'The Amphitheatre');
  b.entry('reception', 32, 2, 'down').entry('amphi', 51, 9, 'left');
  b.forage(6, 28, ['hotchips', 'feather']);
  b.forage(48, 31, ['icypole', 'tennis']);
  return b.finish();
}
