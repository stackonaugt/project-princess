// Shared bits for the city and Carlton zones (Lygon St, Carlton Gardens,
// Swanston St, Bourke St, the laneways, Flinders St, Queen Vic Market).
export const CARS = ['veh-car-h-red', 'veh-car-h-white', 'veh-car-h-blue', 'veh-ute-h'];
export const CARS_V = ['veh-car-v-yellow', 'veh-car-v-silver'];

// A horizontal street: `walk` rows of footpath, then road rows (the middle
// ones tram tracks when tram is set), then `walk` rows of footpath, from x0
// to x1. Returns the first and last road rows.
export function hstreet(b, y, { rows = 4, tram = false, walk = 2, x0 = 0, x1 = b.w - 1, cars = true, speed = 52 } = {}) {
  for (let i = 0; i < walk; i++) b.hline(x0, x1, y + i, 'f');
  const r0 = y + walk;
  for (let i = 0; i < rows; i++) {
    const isTram = tram && i > 0 && i < rows - 1;
    b.hline(x0, x1, r0 + i, isTram ? '+' : '#');
    const dir = i < rows / 2 ? -1 : 1;
    if (isTram) b.lane({ axis: 'x', pos: r0 + i + 0.5, dir, from: x0 - 6, to: x1 + 7, every: [26, 44], speed: 46, kinds: ['veh-tram-h'], tram: true });
    else if (cars) b.lane({ axis: 'x', pos: r0 + i + 0.5, dir, from: x0 - 4, to: x1 + 5, every: [7, 14], speed, kinds: CARS });
  }
  for (let i = 0; i < walk; i++) b.hline(x0, x1, r0 + rows + i, 'f');
  return [r0, r0 + rows - 1];
}

// A vertical side street from y0 to y1: footpath, `rows` of road, footpath.
export function vstreet(b, x, y0, y1, { rows = 2, tram = false, cars = true } = {}) {
  b.vline(x, y0, y1, 'f');
  for (let i = 0; i < rows; i++) {
    const isTram = tram && i > 0 && i < rows - 1;
    b.vline(x + 1 + i, y0, y1, isTram ? '+' : '#');
    const dir = i < rows / 2 ? 1 : -1;
    if (isTram) b.lane({ axis: 'y', pos: x + 1.5 + i, dir, from: y0 - 6, to: y1 + 7, every: [28, 46], speed: 46, kinds: ['veh-tram'], tram: true });
    else if (cars) b.lane({ axis: 'y', pos: x + 1.5 + i, dir, from: y0 - 4, to: y1 + 5, every: [10, 20], speed: 48, kinds: CARS_V });
  }
  b.vline(x + rows + 1, y0, y1, 'f');
}

// Footpath dining: a cafe umbrella over a table every few tiles, skipping doors.
export function tables(b, y, x0, x1, { step = 4, skip = [], v = ['red', 'green', 'cream'] } = {}) {
  for (let x = x0, i = 0; x <= x1; x += step, i++) {
    if (skip.some(s => Math.abs(s - x) < 2)) continue;
    b.put('parasol', x, y, { v: v[i % v.length] });
  }
}

// Street furniture along a footpath row, skipping the given columns.
export function furniture(b, y, x0, x1, { step = 6, skip = [], seed = 0, kinds = ['lamp', 'bin', 'bikehoop', 'streettree', 'parkbin', 'lamp'] } = {}) {
  for (let x = x0, i = seed; x <= x1; x += step, i++) {
    if (skip.some(s => Math.abs(s - x) < 2)) continue;
    const k = kinds[i % kinds.length];
    b.put(k, x, y, k === 'bin' ? { v: ['red', 'yellow', 'garbage'][i % 3] } : {});
  }
}

// Pot plants and bikes outside shops (walk-through), like the other zones.
export function liven(b, density = 0.015) {
  b.scatter([0, 0, b.w, b.h], density, [['potplant', 3, ['succulent', 'herbs', 'fern', 'geranium']], ['bike', 2, ['blue', 'red']]], { clearance: 0, on: 'fck' });
}
