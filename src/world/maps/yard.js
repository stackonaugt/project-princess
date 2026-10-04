// YARD: the big backyard behind the Allen St house. Lawn, a steel carport
// over the old picnic table, the shed, a Hills Hoist and tall paling fences.
import { MapBuilder } from '../MapBuilder.js';

export function buildYard() {
  const b = new MapBuilder({ id: 'yard', w: 30, h: 22, fill: 'L', seed: 52 });

  // House across the top, back door in the laundry
  b.put('hpback', 2, 2);
  b.fill(2, 5, 16, 2, 'h');           // concrete path along the back of the house
  b.put('doormat', 13, 5);

  // Driveway down the right side, under the carport
  b.fill(20, 2, 8, 13, 'h');
  b.put('carport', 20, 7);
  b.put('post', 20, 10); b.put('post', 24, 10); b.put('post', 20, 7); b.put('post', 24, 7);
  b.put('picnic', 21, 8);
  b.put('kennel', 22, 12);
  b.put('petbed', 25, 9, { v: 'green' });
  b.put('gardenshed', 24, 16);
  b.put('bin', 19, 3, { v: 'red' }); b.put('bin', 19, 4, { v: 'yellow' }); b.put('bin', 19, 5, { v: 'green' });

  // Garden
  b.put('hoist', 9, 11);
  b.put('veggie', 3, 15);
  b.sign(7, 16, ['The veggie patch.', 'Nothing growing yet. Paddy says "after the renovation". Paddy has said that before.']);
  b.put('tall', 1, 19, { v: 'cypress' }); b.put('tall', 16, 19, { v: 'cypress' }); b.put('tall', 28, 18, { v: 'biggum' });
  b.put('tall', 1, 8, { v: 'cypress' });
  b.put('bush', 5, 19, { v: 'green' }); b.put('bush', 11, 20, { v: 'rose' }); b.put('bush', 19, 20, { v: 'green' });
  b.put('agapanthus', 18, 5); b.put('agapanthus', 1, 5);

  // Paling fence all round, with the side gate by the driveway
  b.fenceH(0, 29, 21, 'paling').fenceV(0, 0, 20, 'paling').fenceV(29, 0, 20, 'paling', [3, 4]);
  b.fenceH(0, 29, 0, 'paling', []);

  b.exit(13, 5, 1, 1, 'home', 'back', 'Home');
  b.exit(29, 3, 1, 2, 'allen', 'driveway', 'Allen St', null, { team: true });
  b.entry('backdoor', 13, 7, 'down').entry('gate', 27, 4, 'left');
  // Family clutter: the twins' trampoline and toys, garden bits
  b.put('trampoline', 12, 13);
  b.put('trike', 6, 9); b.put('ball', 10, 8, { v: 'beach' }); b.put('ball', 17, 16, { v: 'soccer' });
  b.put('wheelbarrow', 7, 15); b.put('hosereel', 18, 7);
  b.put('potplant', 3, 6, { v: 'herbs' }); b.put('potplant', 15, 6, { v: 'geranium' }); b.put('potplant', 16, 6, { v: 'succulent' });
  b.put('flowerbed', 8, 19, { v: 'natives' }); b.put('birdbath', 22, 18); b.put('gnome', 4, 17, { v: 'red' });
  return b.finish();
}
