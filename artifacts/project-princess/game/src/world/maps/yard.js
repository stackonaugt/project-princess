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
  b.put('hproof', 2, 18);              // the house runs right down to the fence
  b.fill(2, 15, 16, 3, 'h');           // concrete path along the back of the house
  b.put('doormat', 13, 16);

  // Driveway down the right side to the side gate, under the carport
  b.fill(20, 1, 8, 20, 'h');           // concrete all the way from the shed down to the front gate
  b.put('carport', 20, 4);             // the shade, up by the shed
  b.put('post', 20, 7); b.put('post', 24, 7); b.put('post', 20, 4); b.put('post', 24, 4);
  b.put('picnic', 21, 5);
  b.put('kennel', 22, 11);
  b.put('petbed', 25, 12, { v: 'green' });
  b.put('petbed', 23, 13, { v: 'blue' });   // Girlie's, by the kennel
  b.put('petbed', 6, 8, { v: 'blue' });   // Chloe's, by the back fence
  b.put('bin', 19, 18, { v: 'red' }); b.put('bin', 19, 17, { v: 'yellow' }); b.put('bin', 19, 16, { v: 'green' });

  // The shed in the far right corner
  b.put('gardenshed', 25, 2, {interact:'workbench'});
  b.put('toolbox',24,5); b.put('sawhorse',25,6);

  // Garden
  b.put('hoist', 9, 9);
  b.put('veggie', 3, 2);
  b.sign(7, 3, ['The veggie patch.', 'Nothing growing yet. Paddy says "after the renovation". Paddy has said that before.']);
  b.put('tall', 1, 1, { v: 'cypress' }); b.put('tall', 16, 1, { v: 'cypress' }); b.put('tall', 21, 1, { v: 'biggum' });
  b.put('tall', 1, 13, { v: 'cypress' });
  b.put('bush', 5, 1, { v: 'green' }); b.put('bush', 11, 1, { v: 'rose' }); b.put('bush', 18, 2, { v: 'green' });
  b.put('agapanthus', 18, 14); b.put('agapanthus', 1, 15);

  // Paling fence all round, with the side gate at the bottom of the driveway
  b.fenceH(0, 29, 21, 'paling', [21, 22, 23, 24, 25, 26, 27]).fenceV(0, 0, 20, 'paling').fenceV(29, 0, 20, 'paling');
  b.fenceH(0, 29, 0, 'paling', []);

  b.exit(13, 17, 1, 1, 'home', 'back', 'Home');
  b.exit(21, 21, 7, 1, 'allen', 'driveway', 'Allen St', null, { team: true });   // out the front, down the driveway
  b.entry('backdoor', 13, 15, 'up').entry('gate', 24, 19, 'up');
  b.npc('paddy', 8, 11, { face: 'down', at: 'yard' });   // weekends: Paddy is home, pottering in the yard
  // Family clutter: the twins' trampoline and toys, garden bits
  b.put('trampoline', 12, 6);
  b.put('trike', 6, 12); b.put('ball', 10, 13, { v: 'beach' }); b.put('ball', 22, 9, { v: 'soccer' });
  b.put('wheelbarrow', 7, 5); b.put('hosereel', 18, 13);
  b.put('potplant', 3, 14, { v: 'herbs' }); b.put('potplant', 15, 14, { v: 'geranium' }); b.put('potplant', 16, 14, { v: 'succulent' });
  // House upgrades (bought from Olly): the veggie patch and the paddling pool
  if (state.hasUpgrade('veggiepatch')) {
    [[12, 2], [13, 2], [14, 2], [12, 4], [13, 4], [14, 4]].forEach(([x, y], i) => b.plot(`yd${i + 1}`, x, y, `Bed ${i + 1}`));
    b.sign(15, 3, ['The veggie patch.', 'Water each bed once a day. Rain counts. The pets will "help".']);
  }
  if (state.hasUpgrade('pool')) b.put('paddlingpool', 2, 8);
  b.put('flowerbed', 8, 1, { v: 'natives' }); b.put('gnome', 4, 5, { v: 'red' });
  if (state.count('coursekit')) b.clear(2,6,15,8); // Paddy clears the practice lawn when the kit is built.
  b.put('sign', 17, 14, {interact:'course'});
  b.put('sign', 18, 7, {interact:'sparring'});
  return b.finish();
}
