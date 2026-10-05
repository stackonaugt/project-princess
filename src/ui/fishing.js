// The fishing mini-game. Wait for a bite, then press Reel in (or A) while the
// little fish is inside the green zone. Smaller zones for trickier fish.
// Resolves with the item id caught, or null if it got away.
import { h } from './dom.js';
import { ITEMS } from '../data/items.js';
import { itemIcon } from './images.js';
import { sfx } from '../systems/sfx.js';

export function openFishing(panel, close, { fish, zone, done }) {
  const status = h('p', { class: 'fish-status center' }, 'You cast out. Wait for a bite...');
  const marker = h('div', { class: 'fish-marker' });
  const target = h('div', { class: 'fish-zone' });
  const bar = h('div', { class: 'fish-bar', 'aria-hidden': 'true' }, target, marker);
  const btn = h('button', { class: 'wood-btn', disabled: true }, 'Reel in');
  let phase = 'wait', pos = 0, dir = 1, raf = 0, result = null;
  const zw = Math.max(0.1, zone), z0 = 0.15 + Math.random() * (0.7 - zw);
  target.style.left = `${z0 * 100}%`; target.style.width = `${zw * 100}%`;
  const finish = () => { cancelAnimationFrame(raf); clearTimeout(bite); done(result); };
  const reel = () => {
    if (phase !== 'bite') return;
    phase = 'over'; btn.disabled = true;
    if (pos >= z0 && pos <= z0 + zw) { result = fish; sfx.found(); status.replaceChildren(h('img', { class: 'pix', src: itemIcon(fish, 32), alt: '' }), ` You caught: ${ITEMS[fish].name}!`); }
    else { sfx.sad(); status.textContent = 'It got away! Too early, or too late.'; }
    btn.textContent = 'Done'; btn.disabled = false; btn.onclick = close;
  };
  const tick = () => {
    pos += dir * 0.014;
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
    h('div', { class: 'fish-water' }, status, bar, h('div', { class: 'center' }, btn)));
  return { action: () => (phase === 'bite' ? reel() : phase === 'over' ? close() : null), cleanup: finish };
}
