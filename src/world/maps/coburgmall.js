// COBURG STATION and the VICTORIA ST MALL. The Upfield line now runs
// overhead on a new skyrail (the level crossings are gone), with the station
// underneath. The mall runs east to Sydney Rd: plane trees, benches and the
// Coburg Library hub. The Upfield bike path runs north under the rail line
// towards Coburg Lake. A car park and a few shops to the south.
//
//   y3-5 the skyrail   y7-9 station and library   y11-16 the mall
//   x2-4 the Upfield bike path   y18-25 car park, shops, a weedy rail reserve
import { MapBuilder } from '../MapBuilder.js';

export function buildCoburgMall() {
  const b = new MapBuilder({ id: 'coburgmall', w: 44, h: 26, fill: 'c', seed: 321 });

  // Under the skyrail
  b.put('viaduct', 0, 3);
  for (let x = 6; x < 44; x += 7) b.put('pier', x, 5);

  // The Upfield bike path, north-south under the rail line
  b.fill(2, 0, 3, 26, '=');
  b.sign(5, 2, ['Upfield bike path.', 'North to Coburg Lake and the Merri Creek. Keep left. Ring your bell. Nobody will care.']);

  // Coburg Station and the library
  b.put('skystation', 13, 7, { v: 'coburg' });
  b.put('myki', 17, 10, { travel: true });
  b.sign(23, 10, ['Coburg Station. Upfield line.', 'Up on the new skyrail. Tap your myki to catch a train to anywhere you have already been.']);
  b.put('bikerack', 8, 9); b.put('busshelter', 10, 10);
  b.put('library', 28, 7, { v: 'coburg' });
  b.put('streetlibrary', 37, 10);

  // The Victoria St Mall: pavers, plane trees and benches, east to Sydney Rd
  b.fill(5, 11, 39, 6, 'k');
  [[8, 12], [15, 15], [22, 12], [29, 15], [36, 12]].forEach(([x, y]) => b.put('tall', x, y, { v: 'pear' }));
  b.put('bench', 11, 15); b.put('bench', 25, 15); b.put('bench', 33, 13); b.put('parkbin', 19, 15);
  b.put('flowerbed', 18, 12, { v: 'mixed' });
  b.sign(40, 11, ['Victoria St Mall.', 'Sydney Rd is just through here. Follow the smell of pide.']);

  // South: a car park, some shops and a weedy strip by the line
  b.fill(5, 18, 39, 1, 'f');
  b.fill(5, 19, 20, 6, 'P');
  [[6, 20, 'white'], [12, 22, 'red'], [18, 20, 'silver'], [21, 23, 'blue']].forEach(([x, y, v]) => b.put('car', x, y, { v }));
  b.put('shop', 26, 19, { v: 'milk bar' }); b.put('nshop', 30, 19, { v: 'laundro' }); b.put('shop', 34, 19, { v: 'signs' });
  b.put('trolley', 25, 23);
  b.fill(38, 19, 6, 7, '.');
  b.ellipse(41, 22, 2.5, 3, '"', '.');
  b.put('tall', 39, 19, { v: 'bottlebrush' });
  b.fill(0, 0, 2, 26, '.').ellipse(0, 20, 1.5, 4, '"', '.');

  b.npc('deb', 33, 11, { face: 'down' });
  b.npc('tash', 3, 14, { path: [[3, 14], [3, 22], [3, 6], [3, 14]], speed: 60 });

  b.exit(43, 11, 1, 6, 'coburgsyd', 'west', 'Sydney Rd, Coburg');
  b.exit(2, 0, 3, 1, 'coburglake', 'west', 'Coburg Lake');
  b.entry('station', 18, 11, 'down').entry('east', 42, 13, 'left').entry('north', 3, 1, 'down');

  b.lane({ axis: 'x', pos: 3.3, dir: 1, from: -12, to: 56, every: [40, 70], speed: 110, kinds: ['veh-train-h'], train: true, sky: true });
  b.lane({ axis: 'x', pos: 4.3, dir: -1, from: -12, to: 56, every: [45, 75], speed: 110, kinds: ['veh-train-h'], train: true, sky: true });

  b.forage(41, 24, ['feather', 'tennis']);
  b.forage(9, 24, ['pide', 'chicken']);
  b.magpies([[24, 21], [40, 9]]);
  b.fill(5, 0, 8, 3, '.'); b.wildGrass(9, 1, 3, 1);
  b.scatter([5, 11, 39, 6], 0.02, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'k' });
  return b.finish();
}
