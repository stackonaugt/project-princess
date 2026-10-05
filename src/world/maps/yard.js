// YARD: the big backyard behind the Allen St house. The house is along the
// bottom (you see its roof and the laundry back door), the shed is up in the
// far right corner, the driveway and carport run down the right side to the
// side gate, and the lawn, Hills Hoist and veggie patch fill the rest.
//
//   y1-4   shed (top right), veggie patch, cypresses
//   y5-14  lawn: hoist, trampoline, paddling pool | driveway and carport x20-27
//   y15-16 concrete path along the back of the house, back door at x13
//   y17-19 the house (roof)                         | side gate at x29, y17-18
import { MapBuilder } from '../MapBuilder.js';
import { state } from '../../systems/state.js';

export function buildYard() {
  const b = new MapBuilder({ id: 'yard', w: 30, h: 22, fill: 'L', seed: 52 });

  // House along the bottom, back door in the laundry
  b.put('hproof', 2, 17);
  b.fill(2, 15, 16, 2, 'h');           // concrete path along the back of the house
  b.put('doormat', 13, 15);

  // Driveway down the right side to the side gate, under the carport
  b.fill(20, 6, 8, 13, 'h');
  b.put('carport', 20, 10);
  b.put('post', 20, 13); b.put('post', 24, 13); b.put('post', 20, 10); b.put('post', 24, 10);
  b.put('picnic', 21, 11);
  b.put('kennel', 22, 8);
  b.put('petbed', 25, 12, { v: 'green' });
  b.put('petbed', 23, 9, { v: 'blue' });   // Girlie's, by the kennel
  b.put('petbed', 6, 8, { v: 'blue' });   // Chloe's, by the back fence
  b.put('bin', 19, 18, { v: 'red' }); b.put('bin', 19, 17, { v: 'yellow' }); b.put('bin', 19, 16, { v: 'green' });

  // The shed in the far right corner
  b.put('gardenshed', 25, 2);

  // Garden
  b.put('hoist', 9, 9);
  b.put('veggie', 3, 2);
  b.sign(7, 3, ['The veggie patch.', 'Nothing growing yet. Paddy says "after the renovation". Paddy has said that before.']);
  b.put('tall', 1, 1, { v: 'cypress' }); b.put('tall', 16, 1, { v: 'cypress' }); b.put('tall', 21, 1, { v: 'biggum' });
  b.put('tall', 1, 13, { v: 'cypress' });
  b.put('bush', 5, 1, { v: 'green' }); b.put('bush', 11, 1, { v: 'rose' }); b.put('bush', 18, 2, { v: 'green' });
  b.put('agapanthus', 18, 14); b.put('agapanthus', 1, 15);

  // Paling fence all round, with the side gate at the bottom of the driveway
  b.fenceH(0, 29, 21, 'paling').fenceV(0, 0, 20, 'paling').fenceV(29, 0, 20, 'paling', [17, 18]);
  b.fenceH(0, 29, 0, 'paling', []);

  b.exit(13, 16, 1, 1, 'home', 'back', 'Home');
  b.exit(29, 17, 1, 2, 'allen', 'driveway', 'Allen St', null, { team: true });
  b.entry('backdoor', 13, 14, 'up').entry('gate', 27, 17, 'left');
  b.npc('paddy', 8, 11, { face: 'down', at: 'yard' });   // weekends: Paddy is home, pottering in the yard
  // Family clutter: the twins' trampoline and toys, garden bits
  b.put('trampoline', 12, 6);
  b.put('trike', 6, 12); b.put('ball', 10, 13, { v: 'beach' }); b.put('ball', 21, 6, { v: 'soccer' });
  b.put('wheelbarrow', 7, 5); b.put('hosereel', 18, 13);
  b.put('potplant', 3, 14, { v: 'herbs' }); b.put('potplant', 15, 14, { v: 'geranium' }); b.put('potplant', 16, 14, { v: 'succulent' });
  // House upgrades (bought from Olly): the veggie patch and the paddling pool
  if (state.hasUpgrade('veggiepatch')) {
    [[12, 2], [13, 2], [14, 2], [12, 4], [13, 4], [14, 4]].forEach(([x, y], i) => b.plot(`yd${i + 1}`, x, y, `Bed ${i + 1}`));
    b.sign(15, 3, ['The veggie patch.', 'Water each bed once a day. Rain counts. The pets will "help".']);
  }
  if (state.hasUpgrade('pool')) b.put('paddlingpool', 2, 8);
  b.put('flowerbed', 8, 1, { v: 'natives' }); b.put('birdbath', 22, 3); b.put('gnome', 4, 5, { v: 'red' });
  return b.finish();
}
