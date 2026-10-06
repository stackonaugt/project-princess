// The Hobsons Bay council chamber, inside the dome: face brick walls, navy
// carpet, a U of timber desks with black chairs and microphones, the big
// screen, flags, a rope barrier and rows of orange public seats. Council meets
// here on Tuesdays at 6:30pm (routines.js); be here to watch the debate.
//
//   y3-9   the councillors' U of desks   y10 rope barrier   y12-15 public seating
//   y17    bottom wall: door outside at x8, door to the foyer at x17
import { MapBuilder } from '../MapBuilder.js';

export function buildChamber() {
  const b = new MapBuilder({ id: 'chamber', w: 24, h: 18, fill: 'W', seed: 831 });
  b.fill(1, 2, 22, 15, 'U');
  b.set(8, 17, 'D'); b.set(17, 17, 'D');

  b.put('bigscreen', 10, 1, { onWall: true });
  b.put('flagstand', 16, 2, { v: 'aboriginal' }); b.put('flagstand', 17, 2, { v: 'aus' }); b.put('flagstand', 18, 2, { v: 'tsi' });
  // The U of desks: four across the top, two down each side
  b.put('councildesk', 7, 4); b.put('councildesk', 9, 4, { v: 'mayor' }); b.put('councildesk', 11, 4); b.put('councildesk', 13, 4);
  b.put('councildesk', 5, 6); b.put('councildesk', 5, 8);
  b.put('councildesk', 16, 6); b.put('councildesk', 16, 8);
  // Rope barrier and public seating
  for (const x of [5, 8, 11, 14, 17]) b.put('ropebarrier', x, 10);
  for (let x = 2; x <= 21; x += 2) b.put('chamberchair', x, 12);
  for (let x = 3; x <= 20; x += 2) if (x !== 9 && x !== 17) b.put('chamberchair', x, 14);
  b.put('tallplant', 1, 3); b.put('tallplant', 22, 3);
  b.put('agendaboard', 12, 15);   // tonight's agenda (WorldScene fills in the words)

  // Council in session (routines.js: Tuesday 6:30pm to 9:30pm)
  b.npc('paddy', 9.5, 3, { face: 'down', at: 'chamber' });
  b.npc('dahlia', 7.5, 3, { face: 'down', at: 'chamber' });
  b.npc('rayna', 11.5, 3, { face: 'down', at: 'chamber' });
  b.npc('deanna', 13.5, 3, { face: 'down', at: 'chamber' });
  b.npc('lesley', 4, 6, { face: 'right', at: 'chamber' });
  b.npc('malcolm', 4, 8, { face: 'right', at: 'chamber' });
  b.npc('kirsty', 18, 6, { face: 'left', at: 'chamber' });

  b.exit(8, 17, 1, 1, 'civic', 'chamber', 'Civic Parade');
  b.exit(17, 17, 1, 1, 'civiccentre', 'chamber', 'Civic centre foyer');
  b.entry('door', 8, 16, 'up').entry('foyer', 17, 16, 'up');
  b.noDress = true;
  return b.finish();
}
