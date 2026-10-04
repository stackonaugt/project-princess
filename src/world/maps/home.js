// HOME: inside Helen and Paddy's new place on Allen St, Laverton.
// Based on the real floor plan, with the walls between the kitchen, meals
// and lounge knocked out. Mid-renovation, so expect boxes and paint tins.
//
//   x: 0         5    10        15        20  23
//   y0  ######## top wall (2 tiles tall) ######   back door at x21
//   y2  bed 3 | bath |  kitchen / meals  | laundry
//   y8  ---- door -- door ---  (open)     ------
//   y9  hall ------------------  lounge
//   y11 ---- door ---- door --
//   y12 bed 1 (yours) | bed 2 (storage)
//   y18 ######## bottom wall ####  front door at x16
import { MapBuilder } from '../MapBuilder.js';

export function buildHome() {
  const b = new MapBuilder({ id: 'home', w: 24, h: 19, fill: 'W', seed: 41 });

  b.fill(1, 2, 5, 6, 'K');            // bed 3 (study)
  b.fill(7, 2, 3, 6, 'T');            // bathroom
  b.fill(11, 2, 8, 7, 'o');           // kitchen and meals, open to the lounge
  b.fill(20, 2, 3, 6, 'n');           // laundry and WC
  b.fill(1, 9, 10, 2, 'o');           // hall
  b.fill(11, 9, 12, 9, 'o');          // lounge
  b.fill(1, 12, 4, 6, 'K');           // bed 1
  b.fill(6, 12, 5, 6, 'K');           // bed 2
  b.set(3, 8, 'D').set(8, 8, 'D').set(19, 3, 'D').set(2, 11, 'D').set(8, 11, 'D');
  b.set(21, 0, 'D').set(21, 1, 'D');  // back door to the yard
  b.set(16, 18, 'D');                 // front door to Allen St

  // Kitchen and meals
  ['plain', 'sink', 'plain', 'stove', 'kettle'].forEach((v, i) => b.put('counter', 11 + i, 2, { v }));
  b.put('fridge', 16, 2);
  b.put('island', 12, 5);
  b.put('dining', 15, 6);
  b.put('cattree', 18, 2);
  b.put('iwindow', 13, 1, { onWall: true });
  b.put('plant', 17, 2, { v: 'fiddle' });

  // Lounge
  b.put('rug', 13, 11, { v: 'red' });
  b.put('tv', 14, 10);
  b.put('couch', 14, 14, { v: 'back' });
  b.put('armchair', 19, 12);
  b.put('floorlamp', 12, 10);
  b.put('plant', 22, 9, { v: 'fern' });
  b.put('bookshelf', 20, 9);
  b.put('picture', 20, 8, { v: 'dog', onWall: true });
  b.put('picture', 22, 8, { v: 'family', onWall: true });
  b.put('doormat', 16, 17);
  b.put('boxes', 22, 16, { v: 'stack' });
  b.put('boxes', 21, 17, { v: 'open' });

  // Bedrooms
  b.put('bed', 3, 12, { v: 'blue' });
  b.put('robe', 1, 17);
  b.put('plant', 1, 12, { v: 'fern' });
  b.put('picture', 4, 11, { v: 'beach', onWall: true });
  b.put('single', 1, 3);
  b.put('bookshelf', 3, 2);
  b.put('armchair', 4, 6);
  b.put('iwindow', 2, 1, { onWall: true });
  // bed 2 is the renovation dumping ground
  b.put('dropsheet', 7, 14);
  b.put('ladder', 10, 12); b.put('boxes', 6, 12, { v: 'stack' }); b.put('boxes', 7, 12, { v: 'open' });
  b.put('paint', 9, 17); b.put('toolbox', 6, 17); b.put('boxes', 10, 17, { v: 'stack' });

  // Bathroom and laundry
  b.put('bath', 7, 2); b.put('vanity', 9, 6);
  b.put('washer', 20, 2); b.put('toilet', 22, 2);

  // Pet beds (pets you have found hang out here when they're not on your team)
  b.put('petbed', 19, 15, { v: 'pink' });
  b.put('petbed', 12, 16, { v: 'grey' });
  b.put('petbed', 2, 6, { v: 'purple' });

  b.exit(16, 18, 1, 1, 'allen', 'house', 'Allen St', null, { team: true });
  b.exit(21, 0, 1, 2, 'yard', 'backdoor', 'Backyard');
  b.entry('bed', 3, 15, 'down').entry('front', 16, 16, 'up').entry('back', 21, 2, 'down');
  b.entry('start', 3, 15, 'down');
  return b.finish();
}
