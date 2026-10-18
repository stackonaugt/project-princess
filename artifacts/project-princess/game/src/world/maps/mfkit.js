// Helpers for the Meredith festival maps (mf*.js): dirt roads, campgrounds
// of tents, gazebos and chairs, stands of gums and strings of lanterns.
import { state } from '../../systems/state.js';

export const FEST_GRASS = ['#b4b266', '#aaa95e', '#8a8a46', '#cccb84'];
export const mfStage = () => state.data.meredith?.stage || 0;

// A dirt road, w wide, from (x0, y0) to (x1, y1) in straight steps.
export function road(b, x0, y0, x1, y1, w = 3) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) b.fill(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), w, w, '=');
  return b;
}
const TENTS = ['orange', 'blue', 'green', 'purple', 'grey', 'red', 'yellow', 'brown', 'teal'];
// A campground: tents in rough rows, the odd gazebo with chairs and eskies.
export function camp(b, [ax, ay, aw, ah], density = 0.5) {
  for (let y = ay; y < ay + ah - 1; y += 3) for (let x = ax + ((y / 3) % 2 ? 1 : 0); x < ax + aw - 1; x += 3) {
    const r = b.rand();
    if (r > density) continue;
    if (b.reserved[y]?.[x] || b.reserved[y + 1]?.[x + 1]) continue;
    const g = b.get(x, y);
    if (g !== '.' && g !== '"') continue;
    if (r < density * 0.12 && b.free(x, y, 3, 3)) {
      b.put('mfgazebo', x, y, { v: ['white', 'blue', 'green', 'red', 'stripe'][Math.floor(b.rand() * 5)] });
      if (b.rand() < 0.7) b.put('mfcampchair', x + 1, y + 1, { v: ['blue', 'green', 'red', 'black'][Math.floor(b.rand() * 4)] });
      continue;
    }
    if (r < density * 0.22 && b.free(x, y, 3, 2)) { b.put('mfbigtent', x, y, { v: ['grey', 'blue', 'green', 'brown'][Math.floor(b.rand() * 4)] }); continue; }
    if (b.free(x, y, 2, 2)) b.put('mftent', x, y, { v: TENTS[Math.floor(b.rand() * TENTS.length)] });
    if (b.rand() < 0.25 && b.free(x + 2, y + 1)) b.put(b.rand() < 0.5 ? 'mfesky' : 'mfcampchair', x + 2, y + 1, { v: ['blue', 'red', 'white'][Math.floor(b.rand() * 3)] });
  }
  return b;
}
// A stand of gums over grass.
export function gums(b, area, density = 0.08, variants = ['blue', 'spotted', 'red']) {
  return b.scatter(area, density, variants.map(v => ['mfgum', 1, [v]]), { clearance: 0 });
}
// A string of lanterns overhead from x0 to x1 (drawn above everyone).
export function lanterns(b, x0, x1, y, shift = 0) {
  const sets = ['a', 'b', 'c', 'd'];
  for (let x = x0, i = shift; x + 3 <= x1; x += 4, i++) b.put('mflantern', x, y, { v: sets[i % 4] });
  return b;
}
