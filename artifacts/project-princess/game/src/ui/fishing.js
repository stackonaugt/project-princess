// The fishing mini-game. Wait for a bite, then press Reel in (or A) while the
// little fish is inside the green zone. Smaller zones for trickier fish.
// Resolves with the item id caught, or null if it got away.
import { h } from './dom.js';
import { ITEMS } from '../data/items.js';
import { itemIcon } from './images.js';
import { sfx } from '../systems/sfx.js';

// Rough sizes in cm, for bragging rights.
const SIZES = { redfin: [18, 45], carp: [25, 70], eel: [40, 110], yabby: [6, 18], oldboot: [28, 31] };
// How fast the marker runs, and how much it darts about (a sudden change of
// direction). Eels thrash, carp are lazy, boots just sink.
const FIGHT = { redfin: [1.05, 0.5], carp: [0.84, 0.2], eel: [1.35, 0.9], yabby: [0.95, 0.7], oldboot: [0.7, 0] };

export function openFishing(panel, close, { fish, zone, done }) {
  const status = h('p', { class: 'fish-status center' }, 'You cast out. Wait for a bite...');
  const marker = h('div', { class: 'fish-marker' });
  const target = h('div', { class: 'fish-zone' });
  const bar = h('div', { class: 'fish-bar', 'aria-hidden': 'true' }, target, marker);
  const btn = h('button', { class: 'wood-btn', disabled: true }, 'Reel in');
  let phase = 'wait', pos = 0, dir = 1, raf = 0, result = null, overAt = 0, retries = 0, lastFrame = null;
  const water = h('div', { class: 'fish-water' });
  let zw = Math.max(0.1, zone);
  const [speed, dart] = FIGHT[fish] || [0.84, 0.3];
  let z0 = 0.15 + Math.random() * (0.7 - zw);
  target.style.left = `${z0 * 100}%`; target.style.width = `${zw * 100}%`;
  const finish = () => { cancelAnimationFrame(raf); clearTimeout(bite); done(result); };
  // The same key press that reels in must not also close the window: wait a moment.
  const shut = () => { if (performance.now() - overAt > 700) close(); };
  const reel = () => {
    if (phase !== 'bite') return;
    phase = 'over'; btn.disabled = true; overAt = performance.now(); cancelAnimationFrame(raf);
    if (pos >= z0 && pos <= z0 + zw) { result = fish; celebrate(); }
    else { sfx.sad(); status.textContent = 'It got away! Too early, or too late.'; }
    btn.textContent = !result && retries < 1 ? 'Try once more' : 'Done'; btn.disabled = false;
    btn.onclick = !result && retries < 1 ? () => {
      // The second go is harder: the fish is wary now and the zone shrinks.
      retries++; pos = 0; dir = 1; lastFrame = null; zw = Math.max(0.08, zw * 0.75); z0 = 0.15 + Math.random() * (0.7 - zw);
      target.style.left = `${z0 * 100}%`; target.style.width = `${zw * 100}%`; phase = 'bite'; btn.textContent = 'Reel in';
      btn.onclick = reel; btn.disabled = false; status.textContent = 'One more cast. Watch the green zone!'; raf = requestAnimationFrame(tick);
    } : shut;
  };
  // A proper fuss when you land one: the fish leaps out, confetti, and its size.
  const celebrate = () => {
    sfx.found(); setTimeout(() => sfx.heart(), 250);
    const it = ITEMS[fish], [lo, hi] = SIZES[fish] || [10, 40], cm = Math.round(lo + Math.random() * (hi - lo));
    const bits = Array.from({ length: 18 }, (_, i) => h('i', { class: 'fish-confetti', style: `--x:${Math.round(Math.cos(i * 0.35 * Math.PI) * (40 + (i % 3) * 25))}px;--y:${Math.round(-30 - Math.abs(Math.sin(i * 1.3)) * 70)}px;--c:${['#f5d63a', '#e2506a', '#6dbb58', '#f4efe0'][i % 4]};animation-delay:${(i % 6) * 30}ms` }));
    const pop = h('div', { class: 'fish-catch' }, ...bits, h('img', { class: 'pix fish-big', src: itemIcon(fish, 32), alt: '' }),
      h('b', {}, it.junk ? 'Oh no. An old boot.' : `You caught a ${it.name.toLowerCase()}!`),
      h('span', {}, it.junk ? 'Still counts. Kind of.' : `${cm} cm. ${cm > (lo + hi) / 2 + (hi - lo) / 4 ? 'A whopper!' : 'A nice one.'}`));
    water.replaceChildren(pop, h('div', { class: 'center' }, btn));
  };
  const tick = timestamp => {
    timestamp ??= performance.now();
    const dt = lastFrame == null ? 0 : Math.min(50, timestamp - lastFrame);
    lastFrame = timestamp;
    if (dart && Math.random() < dart * dt / 1000) dir = -dir;
    pos += dir * speed * dt / 1000;
    if (pos > 1) { pos = 1; dir = -1; } if (pos < 0) { pos = 0; dir = 1; }
    marker.style.left = `calc(${pos * 100}% - 6px)`;
    raf = requestAnimationFrame(tick);
  };
  const bite = setTimeout(() => {
    phase = 'bite'; sfx.select(); status.textContent = 'Bite! Reel in when the fish is in the green!';
    btn.disabled = false; btn.onclick = reel; tick();
  }, 900 + Math.random() * 1800);
  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Fishing'), h('button', { class: 'wood-btn small', onclick: close }, 'Stop')),
    water);
  water.replaceChildren(status, bar, h('div', { class: 'center' }, btn));
  return { action: () => (phase === 'bite' ? reel() : phase === 'over' ? shut() : null), cleanup: finish };
}
