// THE BRUNSWICK BOWLS CLUB, Victoria St, Brunswick East. Two greens behind
// the bluestone wall, with the wrought iron BBC arch over the steps up from
// the street and the long curved shelters down the side. The brick clubhouse
// with its green verandah sits between the greens and Fleming Park. Through
// the gate at the east end, the bocce courts, and on the corner the cream
// render of Fleming Park Hall.
import { MapBuilder } from '../MapBuilder.js';

export function buildBowls() {
  const b = new MapBuilder({ id: 'bowls', w: 40, h: 26, fill: 'c', seed: 641 });

  // Victoria St along the bottom, behind the bluestone wall
  b.fill(0, 22, 40, 2, '#').hline(0, 39, 21, 'f').hline(0, 39, 24, 'f');
  b.fenceH(0, 39, 20, 'bluestone', [14, 15]);
  b.fill(14, 20, 2, 2, 'c');
  b.put('bbcarch', 13, 19);
  b.sign(17, 21, ['Brunswick Bowls Club.', 'Barefoot bowls Friday nights. Everyone welcome, nobody good. Do not let the dog on the green.']);

  // The clubhouse along the top, facing the greens
  b.put('bowlsclub', 4, 2);
  b.fill(4, 5, 32, 2, 'f');
  b.put('bench', 14, 6); b.put('bench', 24, 6);

  // The two greens, with ditches of fine gravel around them
  b.fill(2, 8, 17, 11, 'g'); b.fill(3, 9, 15, 9, 'L');
  b.fill(21, 8, 16, 11, 'g'); b.fill(22, 9, 14, 9, 'L');
  b.put('bowlshelter', 2, 19); b.put('bowlshelter', 6, 19); b.put('bowlshelter', 21, 19); b.put('bowlshelter', 25, 19);
  // Old blokes bowling, and the President himself
  b.npc('crazyjeff', 10, 13, { face: 'right', path: [[10, 13], [15, 13], [10, 13]] });
  b.npc('bowler1', 6, 11, { face: 'right' }); b.npc('bowler2', 28, 12, { face: 'left' });
  b.put('parkbin', 19, 19); b.put('potplant', 20, 8, { v: 'succulent' });

  // The bocce courts through the gate on the east side
  b.put('boccearch', 37, 7);
  b.fill(37, 8, 3, 11, 'g');
  b.fenceV(36, 8, 18, 'metal', [12, 13]);
  b.sign(37, 19, ['Brunswick East Bocce Association.', 'The same four blokes have been playing the same game since 1987. Nobody is winning. Nobody is losing.']);

  // Fleming Park Hall, on the corner
  b.put('flemhall', 31, 2);
  b.put('infosign', 30, 5, { v: 'park' });
  b.put('car', 2, 21, { v: 'white' }); b.put('car', 24, 21, { v: 'blue' }); b.put('car', 33, 21, { v: 'red' });
  b.put('streettree', 8, 21); b.put('streettree', 29, 21);
  b.put('powerpole', 20, 21);

  // A strip of tall grass behind the bocce shed
  b.fill(0, 8, 2, 11, 'g'); b.wildGrass(1, 13, 1.5, 3); b.wildGrass(38, 24, 2, 1.2);

  b.exit(0, 2, 1, 18, 'fleming', 'bowls', 'Fleming Park');
  b.exit(0, 25, 6, 1, 'fleming', 'bowls', 'Fleming Park');
  b.exit(39, 21, 1, 4, 'eblygon', 'bowls', 'Lygon St');
  b.entry('east', 2, 10, 'right').entry('southwest', 2, 24, 'up').entry('west', 38, 21, 'left').entry('street', 14, 21, 'up');


  b.lane({ axis: 'x', pos: 22.5, dir: -1, from: -3, to: 43, every: [12, 24], speed: 50, kinds: ['veh-car-h-white', 'veh-ute-h'] });
  b.lane({ axis: 'x', pos: 23.5, dir: 1, from: -3, to: 43, every: [12, 24], speed: 50, kinds: ['veh-car-h-blue', 'veh-car-h-red'] });

  b.forage(1, 11, ['snag', 'tennis']);
  b.forage(38, 24, ['cheese', 'feather']);
  b.magpies([[12, 13], [30, 13]]);
  b.scatter([0, 0, b.w, b.h], 0.015, [['potplant', 3, ['succulent', 'geranium', 'fern']], ['bike', 1, ['blue', 'red']]], { clearance: 0, on: 'fc' });
  return b.finish();
}
