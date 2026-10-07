// EAST BRUNSWICK TAKE AWAY AND MILK BAR, Nicholson St. A narrow shop: a
// drinks fridge, racks of lollies and a hot food cabinet down one side, and
// at the back the Sorceress behind the counter, with her shelf of bottled
// protection spells and a crystal ball she will not explain.
//
//   y0-1 top wall   y2-3 the spell shelf and the counter
//   y5-11 the shop floor   y13 bottom wall, door at x8 back to Nicholson St
import { MapBuilder } from '../MapBuilder.js';

export function buildEbMilkBar() {
  const b = new MapBuilder({ id: 'ebmilkbar', w: 18, h: 14, fill: 'W', seed: 621 });
  b.fill(1, 2, 16, 11, 'T');
  b.set(8, 13, 'D');

  // Behind the counter: the spells, and the crystal ball on the end
  b.put('potionshelf', 2, 2, { v: 'spells' }); b.put('potionshelf', 5, 2, { v: 'spells' });
  b.put('shelf', 9, 1, { v: 'wall', onWall: true }); b.put('picture', 13, 1, { v: 'beach', onWall: true });
  b.put('shopcounter', 2, 5);
  b.put('crystalball', 6, 5);

  // The shop itself: fridge, lollies, hot food
  b.put('fridge', 16, 2, { v: 'silver' }); b.put('fridge', 16, 4, { v: 'silver' });
  b.put('candyshelf', 14, 7, { v: 'usa' });
  b.put('shopshelf', 11, 2, { v: 'treats' });
  b.put('shopshelf', 1, 9, { v: 'treats' });
  b.put('rug', 8, 9, { v: 'red' });
  b.put('doormat', 8, 12);
  b.sign(12, 11, ['PRICES SUBJECT TO THE MOON.', 'No refunds on warding. The Sorceress says the spell worked, you simply were not attacked.']);

  b.npc('sorceress', 4, 6, { face: 'down' });
  b.exit(8, 13, 1, 1, 'ebnicholson', 'milkbar', 'Nicholson St');
  b.entry('door', 8, 12, 'up');
  b.noDress = true;
  return b.finish();
}
