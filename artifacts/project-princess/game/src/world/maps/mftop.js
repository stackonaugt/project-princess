// MEREDITH: TOP CAMP. The biggest camping ground, closest to the
// Amphitheatre: tents in every direction, the Meredith Eye on the
// Amphitheatre side, a Helper Hut up the High Road end, and our campsite:
// gazebos, chairs, eskies, a Hills Hoist, your tent (once you have pitched
// it) and, tonight, Jess's pet portal, small enough to sit in a tent.
import { MapBuilder } from '../MapBuilder.js';
import { road, camp, gums, mfStage, mfTent } from './mfkit.js';
import { MF_STAGE } from '../../data/meredith.js';

export function buildMfTop() {
  const b = new MapBuilder({ id: 'mftop', w: 56, h: 40, seed: 9104 });

  road(b, 0, 21, 14, 21, 3);                         // the Esplanade from the Amphitheatre
  road(b, 14, 21, 28, 2, 3);                          // The Long and Winding Road, up to the High Road
  road(b, 26, 0, 26, 3, 3);
  road(b, 26, 2, 53, 2, 3);                           // Freeway of Love
  road(b, 28, 21, 53, 19, 3);                         // Highway to Hell, east
  road(b, 14, 21, 31, 37, 3);                         // down to South Bank
  road(b, 0, 21, 0, 21, 1);

  // The Meredith Eye, beside the Amphitheatre
  b.fill(1, 12, 10, 4, 'u');
  b.put('mfeye', 3, 12);
  b.npc('mfeyeguy', 9, 15, { face: 'down' });
  b.sign(2, 16, ['The Meredith Eye.', 'It goes round. You go round with it. You can see all the way to Geelong. Nearly.']);

  // The Helper Hut and the water tank up the north
  b.fill(38, 5, 14, 6, 'g');
  b.put('mfhelperhut', 42, 6);
  b.npc('mfhelper', 43, 9, { face: 'down' });
  b.put('mfwatertank', 47, 6);
  b.put('mfbins', 49, 9);
  b.npc('james', 39, 10, { face: 'left' });

  // Our campsite
  b.fill(6, 25, 18, 10, '.');
  b.reserve(15, 29, 6);
  b.put('mfgazebo', 9, 25, { v: 'white' }); b.put('mfgazebo', 13, 25, { v: 'blue' });
  b.put('mfcampchair', 10, 27, { v: 'red' }); b.put('mfcampchair', 14, 27, { v: 'green' }); b.put('mfcampchair', 11, 28, { v: 'blue' });
  b.put('mfesky', 12, 27, { v: 'blue' }); b.put('mfesky', 15, 28, { v: 'red' });
  b.put('mfhoist', 18, 25);
  // Your tent: still in its bag till you pitch it, then good or crappy (systems/meredith.js)
  const tent = mfTent();
  if (tent) b.put('mftent', 7, 31, { v: tent, interact: 'mftent' });
  else b.put('mftentbag', 7, 31, { interact: 'mftent' });
  b.put('mftent', 10, 32, { v: 'green' }); b.put('mftent', 13, 32, { v: 'purple' }); b.put('mfbigtent', 16, 32, { v: 'grey' });
  // Jess's portal, by the door of Jess's tent (she brings it out at night)
  if (mfStage() >= MF_STAGE.night) b.put('mfportal', 19, 32, { v: mfStage() >= MF_STAGE.hunt ? 'red' : 'on' });
  b.put('mfflag', 6, 26, { v: 'purple' });
  b.sign(8, 35, ['Our campsite.', 'Six chairs, two gazebos, one Hills Hoist and a very strong opinion about couches.']);
  b.npc('seb', 12, 30, { face: 'down', mf: { until: MF_STAGE.hunt } });
  b.npc('jess', 20, 34, { face: 'left' });
  b.npc('gabe', 16, 30, { face: 'down', mf: { until: MF_STAGE.night } });
  b.npc('betty', 8, 29, { face: 'right' });
  b.npc('paddy', 17, 27, { face: 'down' });
  b.npc('olly', 21, 27, { face: 'left' });
  b.npc('ward', 9, 30, { face: 'down' });
  b.entry('camp', 14, 30, 'down');

  // Tents everywhere else
  camp(b, [30, 4, 8, 7], 0.95); camp(b, [30, 12, 24, 6], 0.95); camp(b, [30, 23, 24, 15], 0.95); camp(b, [16, 4, 8, 14], 0.9); camp(b, [1, 1, 22, 10], 0.9);
  camp(b, [24, 26, 6, 12], 0.9); camp(b, [1, 17, 12, 3], 0.9);
  b.npc('mfbluecrew', 41, 22, { face: 'down' });
  gums(b, [0, 0, 56, 40], 0.035, ['blue', 'red']);
  b.wildGrass(4, 38, 4, 1.5); b.wildGrass(50, 31, 3, 3); b.wildGrass(24, 13, 2, 2);

  b.exit(0, 21, 1, 3, 'mfamphi', 'top', 'The Amphitheatre');
  b.exit(26, 0, 3, 1, 'mfbluegums', 'top', 'Blue Gums');
  b.exit(55, 19, 1, 3, 'mfpines', 'top', 'South Pines');
  b.exit(31, 39, 3, 1, 'mfsunset', 'top', 'Sunset Strip');
  b.entry('amphi', 2, 22, 'right').entry('bluegums', 27, 2, 'down').entry('pines', 53, 20, 'left').entry('sunset', 32, 37, 'up');
  b.forage(51, 27, ['icypole', 'feather']);
  return b.finish();
}
