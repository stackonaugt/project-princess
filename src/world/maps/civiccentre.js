// The Hobsons Bay civic centre foyer: terrazzo with coloured swirls, the
// curved timber reception desk (Paddy hangs out here on weekdays), grey
// couches, orange stools, green booths, big pot plants and the council
// noticeboard, where you chip in to motions (data/council.js).
//
//   y0-1  top wall, door to the council chamber at x3
//   y2-14 the foyer      y15 bottom wall, the front doors at x13
import { MapBuilder } from '../MapBuilder.js';

export function buildCivicCentre() {
  const b = new MapBuilder({ id: 'civiccentre', w: 26, h: 16, fill: 'W', seed: 821 });
  b.fill(1, 2, 24, 13, 'Q');
  b.set(3, 0, 'D').set(3, 1, 'D');
  b.set(13, 15, 'D');

  b.put('floorswirl', 5, 7, { v: 'mint' }); b.put('floorswirl', 14, 10, { v: 'pink' }); b.put('floorswirl', 17, 4, { v: 'mint' });
  b.put('receptiondesk', 10, 4);
  b.put('tallplant', 9, 4);
  b.put('noticeboard', 6, 2);
  b.put('lobbycouch', 2, 10); b.put('lobbycouch', 2, 13);
  b.put('pouf', 7, 11, { v: 'orange' }); b.put('pouf', 8, 12, { v: 'pink' }); b.put('pouf', 9, 11, { v: 'orange' });
  b.put('booth', 22, 3); b.put('booth', 22, 6); b.put('booth', 22, 9);
  b.put('tallplant', 1, 3); b.put('tallplant', 24, 13); b.put('tallplant', 17, 13);
  b.put('picture', 12, 1, { v: 'beach', onWall: true }); b.put('picture', 18, 1, { v: 'family', onWall: true });
  b.put('doormat', 13, 14);
  b.put('plaque', 4, 1, { onWall: true, text: ['COUNCIL CHAMBERS.', 'Hobsons Bay City Council meets here on Tuesdays at 6:30pm. All welcome.'] });
  // Tables where people sit and eat their lunch
  b.put('table', 15, 12); b.put('pouf', 14, 12, { v: 'orange' }); b.put('pouf', 16, 12, { v: 'pink' });
  b.put('table', 20, 13); b.put('pouf', 19, 13, { v: 'pink' }); b.put('pouf', 21, 13, { v: 'orange' });

  // Paddy at reception on weekdays; councillors drop in on their days (routines.js)
  b.npc('narelle', 13, 3, { face: 'down', counter: true });   // behind the reception desk
  b.npc('paddy', 12, 6, { face: 'down', at: 'reception' });
  b.npc('lesley', 21, 9, { face: 'right', at: 'foyer', still: true });   // at her booth, lunch on the table
  b.npc('malcolm', 20, 11, { face: 'left', at: 'foyer' });
  b.npc('kirsty', 5, 12, { face: 'right', at: 'foyer' });
  b.npc('dahlia', 16, 7, { face: 'down', at: 'foyer' });
  b.npc('rayna', 18, 5, { face: 'down', at: 'foyer' });
  b.npc('deanna', 11, 12, { face: 'up', at: 'foyer' });

  b.exit(13, 15, 1, 1, 'civic', 'hall', 'Civic Parade');
  b.exit(3, 0, 1, 2, 'chamber', 'foyer', 'Council chamber');
  b.entry('door', 13, 13, 'up').entry('chamber', 3, 3, 'down');
  b.noDress = true;
  return b.finish();
}
