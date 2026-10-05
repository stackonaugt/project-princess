// HOME: inside Helen and Paddy's new place on Allen St, Laverton.
// Based on the real floor plan, with the walls between the kitchen, meals
// and lounge knocked out. Mid-renovation, so expect boxes and paint tins.
//
//   x: 0         5    10        15        20  23
//   y0  ######## top wall (2 tiles tall) ######   back door at x21
//   y2  twins | bath |  kitchen / meals  | laundry   (kitchen not built yet: tradies' gear)
//   y8  ---- door -- door ---  (open)     ------
//   y9  hall ------------------  lounge
//   y11 ---- door ---- door --
//   y12 bed 1 (yours) | bed 2 (storage, later the study) | lounge
//   y18 ######## bottom wall ####  front door at x16
import { MapBuilder } from '../MapBuilder.js';
import { state } from '../../systems/state.js';

export function buildHome() {
  const b = new MapBuilder({ id: 'home', w: 24, h: 19, fill: 'W', seed: 41 });

  b.fill(1, 2, 5, 6, 'o');            // bed 3: the twins' room
  b.fill(7, 2, 3, 6, 'T');            // bathroom
  b.fill(11, 2, 8, 7, 'o');           // kitchen and meals, open to the lounge
  b.fill(20, 2, 3, 6, 'n');           // laundry and WC
  b.fill(1, 9, 10, 2, 'o');           // hall
  b.fill(11, 9, 12, 9, 'o');          // lounge
  b.fill(1, 12, 4, 6, 'o');           // bed 1 (yours)
  b.fill(6, 12, 4, 6, 'o');           // bed 2: storage, later the study (wall at x10)
  for (let y = 12; y <= 17; y++) b.set(10, y, 'W');
  b.set(3, 8, 'D').set(8, 8, 'D').set(19, 3, 'D').set(2, 11, 'D').set(8, 11, 'D');
  b.set(21, 0, 'D').set(21, 1, 'D');  // back door to the yard
  b.set(16, 18, 'D');                 // front door to Allen St

  // Kitchen and meals. Not built yet: a camp kitchen on a trestle among the
  // tradies' gear, until you buy the kitchen upgrade.
  if (state.hasUpgrade('kitchen')) {
    ['plain', 'sink', 'plain', 'stove', 'kettle'].forEach((v, i) => b.put('counter', 11 + i, 2, { v }));
    b.put('fridge', 16, 2);
    b.put('island', 12, 5);
    b.put('dining', 15, 6);
    b.put('stool', 12, 7); b.put('stool', 14, 7);
    b.put('plant', 17, 2, { v: 'fiddle' });
  } else {
    b.put('campstove', 11, 2);
    b.put('fridge', 16, 2);
    b.put('esky', 13, 2);
    b.put('dropsheet', 12, 4);
    b.put('sawhorse', 15, 6);
    b.put('ladder', 18, 5);
    b.put('bucket', 11, 7); b.put('paint', 12, 7); b.put('toolbox', 14, 4);
    b.put('boxes', 17, 7, { v: 'stack' });
  }
  b.put('cattree', 18, 2);
  b.put('iwindow', 13, 1, { v: 'blind', onWall: true });

  // Lounge
  b.put('rug', 13, 11, { v: 'red' });
  b.put('tv', 14, 10);
  const couch = state.data.furniture?.couch;   // from Franco Cozzo (data/furniture.js)
  b.put('couch', 14, 14, { v: couch && couch !== 'old' ? `back-${couch}` : 'back' });
  b.put('armchair', 19, 12);
  b.put('floorlamp', 12, 10);
  b.put('sidetable', 17, 14);
  b.put('plant', 1, 10, { v: 'fiddle' });
  b.put('picture', 5, 8, { v: 'beach', onWall: true }); b.put('picture', 10, 8, { v: 'dog', onWall: true });
  b.put('picture', 4, 1, { v: 'family', onWall: true });
  b.put('plant', 22, 9, { v: 'fern' });
  b.put('bookshelf', 20, 9);
  b.put('picture', 20, 8, { v: 'dog', onWall: true });
  b.put('picture', 22, 8, { v: 'family', onWall: true });
  b.put('doormat', 16, 17);
  b.put('boxes', 22, 16, { v: 'stack' });
  b.put('boxes', 21, 17, { v: 'open' });

  // Bedrooms
  b.put('bed', 3, 12, { v: 'sage' });
  b.put('robe', 1, 17);
  b.put('sidetable', 1, 14);
  b.put('plant', 1, 12, { v: 'fern' });
  b.put('iwindow', 3, 11, { v: 'curtain', onWall: true });
  // bed 3, top left: the twins' room. Half finished until you buy the upgrade.
  b.put('cot', 1, 2, { v: 'white' }); b.put('cot', 2, 2, { v: 'oak' });
  b.put('toybox', 5, 2);
  b.put('iwindow', 2, 1, { v: 'blind', onWall: true });
  if (state.hasUpgrade('twinsroom')) {   // finished: rug, plants, picture books
    b.put('rug', 2, 4, { v: 'blue' });
    b.put('plant', 5, 7, { v: 'fern' }); b.put('plant', 1, 7, { v: 'fiddle' });
  } else {
    b.put('dropsheet', 2, 4);
    b.put('ladder', 5, 5);
    b.put('paint', 1, 7);
  }
  // bed 2: storage for now. The study upgrade turns it into Paddy's study.
  if (state.hasUpgrade('study')) {
    b.put('desk', 6, 12); b.put('bookshelf', 8, 12);
    b.put('armchair', 8, 15); b.put('rug', 6, 14, { v: 'red' });
    b.put('plant', 9, 17, { v: 'fiddle' });
  } else {
    b.put('boxes', 6, 12, { v: 'stack' }); b.put('boxes', 7, 12, { v: 'open' }); b.put('boxes', 9, 12, { v: 'stack' });
    b.put('boxes', 6, 15, { v: 'stack' }); b.put('toolbox', 6, 17); b.put('boxes', 9, 17, { v: 'stack' });
  }
  b.put('picture', 7, 11, { v: 'beach', onWall: true });

  // Bathroom and laundry
  b.put('bath', 7, 2); b.put('vanity', 9, 6);
  b.put('washbasket', 22, 7);
  b.put('washer', 20, 2); b.put('trough', 21, 5); b.put('toilet', 22, 2);
  b.put('iwindow', 7, 1, { v: 'frosted', onWall: true }); b.put('shelf', 20, 1, { onWall: true });

  // Pet beds (pets you have found hang out here when they're not on your team)
  b.put('petbed', 19, 15, { v: 'pink' });
  b.put('petbed', 12, 16, { v: 'grey' });
  b.put('petbed', 4, 6, { v: 'purple' });
  b.put('petbed', 13, 15, { v: 'green' });   // Rusty's, by the heater

  // Paddy: heading out the door on weekday mornings, on the couch in the evenings (routines.js)
  b.npc('paddy', 15, 7, { face: 'down', at: 'leaving', leave: true, speed: 40, path: [[15, 9], [16, 10], [16, 16], [16, 17]] });
  b.npc('paddy', 18, 13, { face: 'left', at: 'home' });
  b.exit(16, 18, 1, 1, 'allen', 'house', 'Allen St', null, { team: true });
  b.exit(21, 0, 1, 2, 'yard', 'backdoor', 'Backyard');
  b.entry('bed', 3, 15, 'down').entry('front', 16, 16, 'up').entry('back', 21, 2, 'down');
  b.entry('cot', 2, 4, 'down');           // the twins wake up in their room
  b.entry('start', 3, 15, 'down');
  return b.finish();
}
