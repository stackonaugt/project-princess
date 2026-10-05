// FLINDERS ST: the station with its dome and the clocks over the entrance
// ("meet you under the clocks"), Swanston St heading north between it and
// St Paul's Cathedral, Fed Square's shards, then the river promenade, the
// Yarra and Princes Bridge over to the Southbank lawns. This is the city's
// train station: tap your myki out the front.
//
//   y0-8   the station (x2-19), Swanston St north (x20-25), St Paul's (x26-31), Fed Square (x33-40), towers
//   y9-11  the wide footpath under the clocks   y12-15 Flinders St (tram tracks y13-14)   y16 footpath
//   y17-19 the promenade   y20-26 the Yarra, Princes Bridge (x21-24)   y27-33 Southbank lawns
import { MapBuilder } from '../MapBuilder.js';
import { CARS, vstreet, furniture, liven } from './melbkit.js';

export function buildFlinders() {
  const b = new MapBuilder({ id: 'flinders', w: 52, h: 34, fill: 'c', seed: 906 });
  // Flinders St: a wide footpath under the clocks, cars, trams, cars, footpath
  b.fill(0, 9, 52, 3, 'f').fill(0, 12, 52, 4, '#').hline(0, 51, 13, '+').hline(0, 51, 14, '+').hline(0, 51, 16, 'f');
  b.lane({ axis: 'x', pos: 12.5, dir: -1, from: -4, to: 57, every: [7, 14], speed: 52, kinds: CARS });
  b.lane({ axis: 'x', pos: 15.5, dir: 1, from: -4, to: 57, every: [7, 14], speed: 52, kinds: CARS });
  b.lane({ axis: 'x', pos: 13.5, dir: -1, from: -6, to: 58, every: [26, 44], speed: 46, kinds: ['veh-tram-h'], tram: true });
  b.lane({ axis: 'x', pos: 14.5, dir: 1, from: -6, to: 58, every: [26, 44], speed: 46, kinds: ['veh-tram-h'], tram: true });
  vstreet(b, 20, 0, 8, { rows: 4, tram: true });

  // The station, the clocks and the myki reader
  b.put('flindersst', 2, 6);
  b.put('myki', 8, 9, { travel: true });
  b.sign(12, 9, ['Flinders Street Station, 1910.', 'Meet you under the clocks. Tap your myki at the reader to catch a train to anywhere you have been.']);

  // St Paul's, Fed Square and the towers
  b.put('stpauls', 26, 6);
  b.put('fedsquare', 33, 6);
  b.fill(32, 6, 10, 4, 'k');
  b.put('citytower', 42, 6, { v: 'glass' });
  b.put('citytower', 47, 6, { v: 'blue' });
  b.put('tramstop', 25, 11);
  furniture(b, 11, 30, 50, { step: 5, kinds: ['lamp', 'bin', 'bikehoop'] });

  // The promenade along the river
  b.fill(0, 17, 52, 3, 'k');
  for (let x = 2; x < 52; x += 6) if (x < 20 || x > 25) b.put('lamp', x, 19);
  b.put('bench', 8, 17); b.put('bench', 30, 17); b.put('bench', 44, 17);
  b.sign(26, 18, ['The Yarra.', 'It is not upside down. It is just carrying a lot of the Dandenongs with it.']);

  // The Yarra, Princes Bridge and Southbank
  b.fill(0, 20, 52, 7, '~');
  b.fill(21, 20, 4, 7, 'w');
  b.fill(0, 27, 52, 7, '.');
  b.fill(21, 27, 4, 7, 'u');
  b.put('tall', 3, 29, { v: 'biggum' }); b.put('tall', 16, 30, { v: 'poplar' }); b.put('tall', 30, 29, { v: 'biggum' }); b.put('tall', 46, 31, { v: 'poplar' });
  b.put('tree', 9, 32, { v: 'palm' }); b.put('tree', 38, 32, { v: 'palm' });
  b.put('picnic', 34, 28); b.put('bench', 8, 28);
  b.wildGrass(11, 30, 3.4, 1.8); b.wildGrass(40, 30, 4, 1.8);
  b.put('reeds', 4, 26); b.put('reeds', 47, 26);
  b.ducks(10, 23, 6, 1.5, 2); b.ducks(40, 23, 6, 1.5, 2);

  b.npc('dev', 12, 10, { face: 'down' });
  b.npc('marj', 6, 11, { face: 'right' });

  b.forage(45, 29, ['sardine', 'croissant']);
  b.forage(26, 32, ['feather', 'tennis']);
  b.magpies([[14, 29], [36, 31]]);

  b.exit(20, 0, 6, 1, 'swanston', 'south', 'Swanston St');
  b.exit(0, 13, 1, 1, 'laneways', 'east', 'Degraves St');
  b.exit(51, 13, 1, 1, null, null, 'Richmond', ['Flinders St heads east to the MCG and Richmond.', 'No game on today. Another time.']);
  b.exit(21, 33, 4, 1, null, null, 'Southbank', ['Southbank, the Arts Centre spire and the casino.', 'The spire is very pointy. The casino is very loud. Another day.']);
  b.entry('station', 10, 11, 'down').entry('north', 22, 2, 'down').entry('west', 1, 10, 'right');
  liven(b, 0.01);
  return b.finish();
}
