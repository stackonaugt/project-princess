// Inside BUNNINGS WAREHOUSE, Altona North: tall racks of tools, paint and
// garden gear, tables of seedlings, and Olly at the checkout by the doors.
// Six pot plants by the door are for the house. Gaz runs the sausage sizzle out the front (altona.js).
import { MapBuilder } from '../MapBuilder.js';
import { FURNITURE } from '../../data/furniture.js';

export function buildBunnings() {
  const b = new MapBuilder({ id: 'bunnings', w: 24, h: 16, fill: 'W', seed: 851 });
  b.fill(1, 2, 22, 13, 'Q');
  b.set(12, 15, 'D');
  b.put('bunshelf', 1, 3, { v: 'tools' }); b.put('bunshelf', 5, 3, { v: 'tools' }); b.put('bunshelf', 9, 3, { v: 'paint' });
  b.put('bunshelf', 1, 7, { v: 'paint' }); b.put('bunshelf', 5, 7, { v: 'garden' }); b.put('bunshelf', 9, 7, { v: 'tools' });
  b.put('planttable', 15, 3); b.put('planttable', 19, 3); b.put('planttable', 15, 7); b.put('planttable', 19, 7);
  b.put('wheelbarrow', 16, 10); b.put('hosereel', 20, 10); b.put('trolley', 13, 12);
  // pot plants for the house: walk up to one to buy it (data/furniture.js)
  ['monstera', 'bird', 'lemon', 'lily', 'ivy', 'cactus'].forEach((id, i) => b.put('plant', 16 + i, 12, { v: FURNITURE[id].v, forSale: id }));
  b.sign(22, 12, ['Indoor plants.', 'Pick one and Olly will swap every pot plant in your house for it. Delivered today.']);
  b.put('shopcounter', 2, 12);
  b.sign(9, 11, ['Aisle 4: Hinges.', 'All of them. Every hinge ever made. Olly knows where each one is.']);
  b.put('doormat', 12, 14);
  b.npc('olly', 3, 11, { face: 'down', counter: true, dwell: 30, path: [[3, 11], [3, 10], [13, 10], [13, 5], [13, 10], [3, 10], [3, 11]] });   // behind the counter, now and then a walk down the aisles
  b.exit(12, 15, 1, 1, 'altona', 'bunnings', 'Kororoit Creek Rd');
  b.entry('door', 12, 14, 'up');
  b.noDress = true;
  return b.finish();
}
