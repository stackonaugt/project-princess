// FLINDERS ST, laid out from the owner's aerial photo: the Yarra across the
// top with Princes Bridge, big and ornate, crossing it into Swanston St. Fed
// Square on the left, huge, with its plaza (and, this season, the best of the
// Queen Vic Market's stalls); Flinders Street Station on the right, its dome
// and clocks over the entrance. Across Flinders St, St Paul's and the
// rooftops, with Degraves St's alley running off into the laneways.
// West back along to Swanston St; the myki reader is under the clocks.
//
//   y0 Southbank   y1-7 the Yarra (Princes Bridge x33-40)   y8-9 the promenade
//   y10-25 Fed Square (x2-23) and its plaza, Swanston St (x34-39), the station (x42-77)
//   y26-27 footpath   y28-31 Flinders St (tram 29-30)   y32-33 footpath
//   y34-51 rooftops, St Paul's (x8-19), Degraves St's alley (x50-52)
import { MapBuilder } from '../MapBuilder.js';
import { hstreet, vstreet, liven } from './melbkit.js';

export function buildFlinders() {
  const b = new MapBuilder({ id: 'flinders', w: 80, h: 52, fill: 'R', seed: 906 });
  // The river, the bridge and the promenade
  b.fill(0, 0, 80, 1, 'k').fill(0, 1, 80, 7, '~').fill(0, 8, 80, 2, 'k');
  b.fill(34, 0, 1, 10, 'f').fill(39, 0, 1, 10, 'f').fill(35, 0, 4, 10, '#').fill(36, 0, 2, 10, '+');   // Princes Bridge
  for (let y = 1; y < 8; y++) { b.put('bridgerail', 33, y, { v: y % 3 === 1 ? 'lamp' : 'plain' }); b.put('bridgerail', 40, y, { v: y % 3 === 1 ? 'lamp' : 'plain' }); }
  for (const y of [3, 6]) { b.put('bridgepier', 32, y); b.put('bridgepier', 41, y); }
  b.ducks(14, 4, 8, 2, 3); b.ducks(62, 4, 8, 2, 2);
  for (const x of [4, 14, 24, 46, 58, 70]) b.put('streettree', x, 8);
  b.put('bench', 8, 9); b.put('bench', 28, 9); b.put('bench', 52, 9); b.put('bench', 66, 9);
  b.sign(30, 9, ['Princes Bridge and the Yarra.', 'It is not upside down. It is just carrying a lot of the Dandenongs with it.']);

  // Swanston St down from the bridge
  vstreet(b, 34, 10, 27, { rows: 4, tram: true });
  b.fill(35, 26, 4, 2, '#').fill(36, 26, 2, 2, '+');

  // Fed Square, big, and its plaza with the market stalls
  b.put('fedsquare', 2, 13);
  b.fill(24, 10, 10, 16, 'k').fill(0, 21, 34, 5, 'k');
  b.fill(25, 11, 8, 5, '.'); b.wildGrass(29, 13, 3, 1.8);
  b.put('donutvan', 3, 22);
  b.put('marketstall', 9, 22, { v: 'deli' }); b.put('marketstall', 12, 22, { v: 'fruit' }); b.put('marketstall', 15, 22, { v: 'veg' }); b.put('marketstall', 18, 22, { v: 'flowers' });
  b.put('souvenir', 22, 22);
  b.sign(26, 20, ['Federation Square.', 'Sandstone, zinc and glass, all at angles. Melbourne argued about it for ten years, then started meeting under it.']);
  b.sign(8, 25, ['The market, on tour.', 'The best of the Queen Vic stalls set up at Fed Square for the season. Hot jam donuts included.']);

  // Flinders Street Station
  b.fill(40, 10, 2, 16, 'f').fill(40, 24, 40, 2, 'f');
  b.put('flindersst', 42, 15);
  b.put('myki', 54, 24, { travel: true });
  b.sign(51, 24, ['Flinders Street Station, 1910.', 'Meet you under the clocks. Tap your myki at the reader to catch a train to anywhere you have been.']);
  for (const x of [44, 64, 74]) b.put('lamp', x, 24);

  // Flinders St
  hstreet(b, 26, { rows: 4, tram: true });
  b.put('tramstop', 30, 26, { v: '1' }); b.put('tramstop', 46, 33, { v: '6' });
  for (const x of [4, 14, 24, 60, 70]) b.put('streettree', x, 33);

  // Across the road: St Paul's, the rooftops and the alley to Degraves St
  b.put('stpauls', 8, 44);
  b.fill(50, 34, 3, 18, 'b');
  b.put('bin', 50, 38, { v: 'garbage' }); b.put('crate', 52, 42, { v: 'red' });
  b.sign(20, 33, ['St Paul\'s Cathedral.', 'The spires went up in 1926, forty years after the rest. Melbourne has always liked a long planning process.']);

  b.npc('dev', 58, 25, { face: 'down' });
  b.npc('marj', 50, 25, { face: 'right' });
  b.npc('officer', 62, 25, { path: [[60, 25], [76, 25]] });
  b.npc('dot', 5, 21, { face: 'down' });
  b.npc('yianni', 10, 21, { face: 'down' });
  b.npc('carmel', 14, 21, { face: 'down' });
  b.npc('mai', 24, 24, { face: 'left' });

  b.forage(31, 15, ['sardine', 'croissant']);
  b.forage(2, 9, ['feather', 'tennis']);
  b.forage(51, 47, ['lemon', 'carrot']);
  b.magpies([[27, 12], [10, 8]]);

  b.exit(0, 26, 1, 8, 'swanston', 'east', 'Swanston St');
  b.exit(50, 51, 3, 1, 'laneways', 'south', 'Degraves St');
  b.exit(34, 0, 6, 1, null, null, 'Southbank', ['Southbank, the Arts Centre spire and the casino.', 'The spire is very pointy. The casino is very loud. Another day.']);
  b.exit(79, 26, 1, 8, null, null, 'Richmond', ['Flinders St heads east to the MCG and Richmond.', 'No game on today. Another time.']);
  b.entry('station', 55, 25, 'down').entry('west', 1, 27, 'right').entry('laneways', 51, 50, 'up').entry('north', 36, 1, 'down');
  liven(b, 0.006);
  b.noDress = true;
  return b.finish();
}
