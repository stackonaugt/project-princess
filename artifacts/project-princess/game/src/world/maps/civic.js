// CIVIC PARADE, ALTONA: Hobsons Bay City Council. The domed council chamber
// (door into the chamber), the low brick civic centre (door into the foyer,
// where Paddy works), the field gun and hedges, the rainbow path on the lawn,
// three flagpoles, the clock tower and the pelican sign. Reached from Lohse St
// Reserve along the road.
//
//   y1-8   car park (left), the chamber dome x8-18, the civic centre x21-32
//   y9-19  lawn: rainbow path, field gun, flags, clock tower, paths to both doors
//   y20-23 Civic Parade (footpath, road, footpath), west back to Lohse St Reserve
import { MapBuilder } from '../MapBuilder.js';
import { state } from '../../systems/state.js';

export function buildCivic() {
  const b = new MapBuilder({ id: 'civic', w: 40, h: 26, fill: '.', seed: 811 });

  // Civic Parade along the bottom
  b.hline(0, 39, 20, 'f').hline(0, 39, 21, '#').hline(0, 39, 22, '#').hline(0, 39, 23, 'f');
  b.fill(0, 24, 40, 2, '.');

  // Car park and the buildings along the top
  b.fill(1, 1, 7, 8, 'P');
  b.put('car', 2, 2, { v: 'white' }); b.put('car', 5, 2, { v: 'silver' }); b.put('car', 2, 6, { v: 'red' }); b.put('car', 5, 6, { v: 'blue' });
  b.fill(8, 9, 25, 1, 'k');                        // a paved forecourt along the fronts
  b.put('chamberdome', 8, 5);
  b.put('civiccentre', 21, 5);
  b.fill(19, 6, 2, 3, 'k');                        // the link between them
  b.put('tallplant', 19, 7); b.put('bench', 20, 8);
  b.fill(10, 1, 22, 5, 'L');
  b.sign(20, 4, ['Altona City Theatre, out the back.', 'Tonight: a musical about the Westgate Bridge. Tickets selling slowly.']);
  b.put('tall', 33, 2, { v: 'cypress' }); b.put('tall', 35, 2, { v: 'cypress' }); b.put('tall', 37, 2, { v: 'cypress' });
  b.put('tree', 33, 6, { v: 'pine' }); b.put('tree', 37, 6, { v: 'oak' });

  // Paths across the lawn to each door
  b.fill(13, 10, 2, 10, 'k'); b.fill(26, 10, 2, 10, 'k');
  b.exit(13, 9, 2, 1, 'chamber', 'door', 'Council chamber');
  b.exit(26, 9, 2, 1, 'civiccentre', 'door', 'Civic centre');
  b.entry('chamber', 13, 11, 'down').entry('hall', 26, 11, 'down');

  // The lawn: rainbow path, field gun, flags, memorial, clock tower, pelican sign
  b.put('rainbowpath', 2, 12);
  b.put('fieldgun', 8, 12);
  b.put('flagpole', 20, 11, { v: 'aus' }); b.put('flagpole', 21, 11, { v: 'aboriginal' }); b.put('flagpole', 22, 11, { v: 'rainbow' });
  b.fill(19, 13, 6, 1, 'k');
  b.sign(23, 13, ['A war memorial, with a sundial on top.', 'Lest we forget.']);
  b.put('clocktower', 36, 12);
  b.put('hbccsign', 30, 18);
  b.put('tall', 17, 15, { v: 'cypress' }); b.put('tall', 31, 13, { v: 'cypress' }); b.put('tall', 1, 18, { v: 'cypress' });
  b.put('bush', 7, 14, { v: 'green' }); b.put('bush', 11, 14, { v: 'green' });
  b.wildGrass(34, 16, 3, 1.6);
  b.wildGrass(20, 17, 2, 1);
  b.npc('parking', 22, 20, { face: 'up' });
  b.sign(29, 18, ['Hobsons Bay City Council.', 'Customer service open 8:30am to 5pm. Council meets Tuesdays at 6:30pm. All welcome.']);
  b.put('powerpole', 6, 20); b.put('powerpole', 34, 20); b.put('lamp', 18, 20);

  b.forage(36, 18, ['tennis', 'snag']);
  if (state.motionPassed('lemontree')) { b.put('tree', 16, 12, { v: 'lemon' }); b.forage(16, 14, ['lemon']); }   // a council motion
  b.fill(36, 24, 2, 2, 'f');                       // the path south to Kororoit Creek Rd
  b.exit(36, 25, 2, 1, 'altona', 'north', 'Kororoit Creek Rd');
  b.border(['gum', 'oak']);
  b.clear(0, 24, 36, 2).clear(38, 24, 2, 2);         // no trees along the bottom
  b.magpies([[16, 17], [33, 14]]);

  b.exit(0, 20, 1, 4, 'lohse', 'east', 'Lohse St Reserve');
  b.exit(39, 20, 1, 4, 'footscray', 'west', 'Footscray');
  b.entry('west', 1, 20, 'right').entry('south', 36, 23, 'up');
  b.lane({ axis: 'x', pos: 21.5, dir: -1, from: -4, to: 44, every: [8, 16], speed: 56, kinds: ['veh-car-h-red', 'veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 22.5, dir: 1, from: -4, to: 44, every: [8, 16], speed: 56, kinds: ['veh-car-h-blue', 'veh-car-h-white'] });
  return b.finish();
}
