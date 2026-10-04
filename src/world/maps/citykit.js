// Shared bits for the in-between city zones: a main road with footpaths,
// traffic and street furniture. Each zone file adds its own buildings.
const CARS = ['veh-car-h-red', 'veh-car-h-white', 'veh-car-h-blue', 'veh-ute-h'];

// A main road along row y: footpath, `rows` of road (middle rows as tram
// track if tram), footpath. Returns the two footpath rows.
export function street(b, y, { rows = 2, tram = false, trucks = false, speed = 56 } = {}) {
  const w = b.w;
  b.hline(0, w - 1, y, 'f');
  for (let i = 0; i < rows; i++) {
    const isTram = tram && i > 0 && i < rows - 1;
    b.hline(0, w - 1, y + 1 + i, isTram ? '+' : '#');
    const dir = i < rows / 2 ? -1 : 1;
    if (isTram) b.lane({ axis: 'x', pos: y + 1.5 + i, dir, from: -6, to: w + 6, every: [30, 50], speed: 50, kinds: ['veh-tram-h'], tram: true });
    else b.lane({ axis: 'x', pos: y + 1.5 + i, dir, from: -4, to: w + 4, every: [6, 13], speed, kinds: trucks ? [...CARS, 'veh-truck-h'] : CARS });
  }
  b.hline(0, w - 1, y + rows + 1, 'f');
  return [y, y + rows + 1];
}

// Street furniture along a footpath row, skipping the given columns.
export function furnish(b, y, { from = 3, to = b.w - 4, step = 7, skip = [], seed = 0 } = {}) {
  const kinds = ['lamp', 'bin', 'bikehoop', 'powerpole', 'parkbin', 'streettree'];
  for (let x = from, i = seed; x <= to; x += step, i++) {
    if (skip.some(s => Math.abs(s - x) < 2)) continue;
    const k = kinds[i % kinds.length];
    b.put(k, x, y, k === 'bin' ? { v: ['red', 'yellow', 'garbage'][i % 3] } : {});
  }
}
