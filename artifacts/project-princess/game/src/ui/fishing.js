// The fishing mini-game. Cast, wait for a bite, then fight the fish: it bolts
// away from the green zone, fast at first, and every tap (A, Space, a click or
// a tap anywhere on the water) pulls it back. Keep it in the green until the
// landing bar fills. Pull too hard and the line snaps; let it run to the end of
// the line and it throws the hook. The rules live in systems/fishing.js.
// Resolves with the item id caught, or null if it got away.
import { h } from './dom.js';
import { ITEMS } from '../data/items.js';
import { HEROES } from '../data/heroes.js';
import { state } from '../systems/state.js';
import { itemIcon } from './images.js';
import { sfx } from '../systems/sfx.js';
import { FishFight, FIGHT } from '../systems/fishing.js';
import { drawPersonPreview, FRAME_W, FRAME_H } from '../art/paint/people.js';

export { FIGHT };

// Rough sizes in cm, for bragging rights.
const SIZES = { redfin: [18, 45], carp: [25, 70], eel: [40, 110], yabby: [6, 18], oldboot: [28, 31] };

const LOST = {
  snap: 'Snap! The line broke. Easy does it next time.',
  thrown: 'It ran to the end of the line and threw the hook.',
  time: 'It wore you out and slipped away.',
};

// The angler: the current hero, side on, leaning back on a bent rod.
const AW = 72, AH = 44, SCALE = 3, BANK = 26, WATER_Y = 36;
function heroLook() { return (HEROES[state.data?.hero] || HEROES.helen).look; }
function personCanvas() {
  const c = document.createElement('canvas'); c.width = FRAME_W; c.height = FRAME_H;
  drawPersonPreview(c.getContext('2d'), heroLook(), 'left', 0);
  return c;
}
function line(ctx, c, x0, y0, x1, y1) {
  ctx.fillStyle = c;
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) ctx.fillRect(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), 1, 1);
}
function drawAngler(ctx, person, { lean = 0, bend = 0, cast = 0.6, splash = 0, t = 0 }) {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, AW, AH);
  // Bank, then water with a few ripples.
  ctx.fillStyle = '#6dbb58'; ctx.fillRect(0, WATER_Y - 2, BANK, AH);
  ctx.fillStyle = '#4e9a44'; ctx.fillRect(0, WATER_Y - 2, BANK, 1);
  ctx.fillStyle = '#8a6a44'; ctx.fillRect(0, WATER_Y + 1, BANK + 1, AH);
  ctx.fillStyle = '#3a7ab0'; ctx.fillRect(BANK + 1, WATER_Y, AW, AH);
  ctx.fillStyle = '#7ab0d8';
  for (let i = 0; i < 5; i++) ctx.fillRect(BANK + 4 + ((i * 11 + Math.floor(t * 6)) % (AW - BANK - 6)), WATER_Y + 2 + (i % 3) * 2, 3, 1);
  // The person, rotated back about their feet when pulling.
  const fx = 12, fy = WATER_Y - 2, a = -lean * 0.22;
  const rot = (x, y) => [fx + (x - fx) * Math.cos(a) - (y - fy) * Math.sin(a), fy + (x - fx) * Math.sin(a) + (y - fy) * Math.cos(a)];
  ctx.save(); ctx.translate(fx, fy); ctx.rotate(a); ctx.translate(-fx, -fy);
  ctx.save(); ctx.translate(fx + FRAME_W / 2, 0); ctx.scale(-1, 1); ctx.drawImage(person, 0, fy - FRAME_H); ctx.restore();
  ctx.restore();
  // Hands at the front of the chest; the rod runs up and out over the water.
  const [hx, hy] = rot(fx + 6, fy - 14);
  const tipX = hx + 30 - bend * 6, tipY = hy - 16 + bend * 14;
  const cx = hx + 18, cy = hy - 14;
  ctx.fillStyle = '#2a1810';
  let px = hx, py = hy;
  for (let i = 1; i <= 24; i++) {
    const s = i / 24, x = (1 - s) * (1 - s) * hx + 2 * (1 - s) * s * cx + s * s * tipX, y = (1 - s) * (1 - s) * hy + 2 * (1 - s) * s * cy + s * s * tipY;
    line(ctx, i < 7 ? '#2a1810' : '#6a4a2a', px, py, x, y); px = x; py = y;
  }
  ctx.fillStyle = '#b8bcc4'; ctx.fillRect(Math.round(hx + 2), Math.round(hy), 2, 2);           // reel
  ctx.fillStyle = heroLook().skin || '#f2c79a'; ctx.fillRect(Math.round(hx), Math.round(hy - 1), 2, 2);   // hands
  // The line to the water, ending where the fish is pulling.
  const wx = BANK + 4 + cast * (AW - BANK - 8);
  line(ctx, 'rgba(244,239,224,.85)', tipX, tipY, wx, WATER_Y);
  if (splash > 0) {
    ctx.fillStyle = '#f4efe0';
    for (let i = 0; i < 4; i++) ctx.fillRect(Math.round(wx - 3 + ((i * 3 + Math.floor(t * 20)) % 7)), WATER_Y - 1 - ((i + Math.floor(t * 15)) % 2) * splash, 1, 1);
  }
}

export function openFishing(panel, close, { fish, zone, done }) {
  const status = h('p', { class: 'fish-status center' }, 'You cast out. Wait for a bite...');
  const marker = h('div', { class: 'fish-marker' });
  const target = h('div', { class: 'fish-zone' });
  const bar = h('div', { class: 'fish-bar', 'aria-hidden': 'true' }, target, marker);
  const landFill = h('i', { class: 'fish-fill' });
  const tenseFill = h('i', { class: 'fish-fill' });
  const meters = h('div', { class: 'fish-meters', 'aria-hidden': 'true' },
    h('span', {}, 'Landing'), h('div', { class: 'fish-meter land' }, landFill),
    h('span', {}, 'Line'), h('div', { class: 'fish-meter tense' }, tenseFill));
  const canvas = h('canvas', { class: 'fish-angler', width: AW, height: AH, 'aria-hidden': 'true' });
  canvas.style.width = `${AW * SCALE}px`;
  const ctx = canvas.getContext?.('2d');
  let person = null;
  try { person = personCanvas(); } catch { person = null; }
  const btn = h('button', { class: 'wood-btn', type: 'button', disabled: true }, 'Reel in!');
  const water = h('div', { class: 'fish-water' });
  const fight = new FishFight({ fish, zone });
  target.style.left = `${fight.z0 * 100}%`; target.style.width = `${fight.zw * 100}%`;
  let phase = 'wait', raf = 0, result = null, overAt = 0, lastFrame = null, pullFx = 0, said = '', bite = 0;

  const draw = t => {
    if (!ctx || !person) return;
    const fighting = phase === 'fight';
    drawAngler(ctx, person, {
      lean: Math.min(1, pullFx + (fighting ? 0.25 : 0)),
      bend: fighting ? Math.min(1, 0.35 + fight.tension * 0.5 + pullFx * 0.4) : 0.1,
      cast: fighting ? fight.pos : 0.6, splash: fighting ? 1 + (fight.stamina > 0.5 ? 1 : 0) : 0, t,
    });
  };
  const say = text => { if (text !== said) { said = text; status.textContent = text; } };
  const finish = () => { cancelAnimationFrame(raf); clearTimeout(bite); done(result); };
  // The same key press that ends the fight must not also close the window: wait a moment.
  const shut = () => { if (performance.now() - overAt > 700) close(); };
  const end = () => {
    phase = 'over'; overAt = performance.now(); cancelAnimationFrame(raf);
    if (fight.result === 'caught') { result = fish; return celebrate(); }
    sfx.sad(); say(LOST[fight.result] || 'It got away!');
    water.classList.remove('pulling');
    btn.textContent = 'Done'; btn.disabled = false; btn.onclick = shut;
  };
  const pull = () => {
    if (phase === 'wait') return say('Not yet. Wait for a bite...');
    if (phase !== 'fight') return;
    fight.tap(); pullFx = 1; sfx.blip();
    water.classList.remove('pulling'); void water.offsetWidth; water.classList.add('pulling');
    if (fight.over) end();
  };
  // A proper fuss when you land one: the fish leaps out, confetti, and its size.
  const celebrate = () => {
    sfx.found(); setTimeout(() => sfx.heart(), 250);
    const it = ITEMS[fish], [lo, hi] = SIZES[fish] || [10, 40], cm = Math.round(lo + Math.random() * (hi - lo));
    const bits = Array.from({ length: 18 }, (_, i) => h('i', { class: 'fish-confetti', style: `--x:${Math.round(Math.cos(i * 0.35 * Math.PI) * (40 + (i % 3) * 25))}px;--y:${Math.round(-30 - Math.abs(Math.sin(i * 1.3)) * 70)}px;--c:${['#f5d63a', '#e2506a', '#6dbb58', '#f4efe0'][i % 4]};animation-delay:${(i % 6) * 30}ms` }));
    const pop = h('div', { class: 'fish-catch' }, ...bits, h('img', { class: 'pix fish-big', src: itemIcon(fish, 32), alt: '' }),
      h('b', {}, it.junk ? 'Oh no. An old boot.' : `You caught a ${it.name.toLowerCase()}!`),
      h('span', {}, it.junk ? 'Still counts. Kind of.' : `${cm} cm. ${cm > (lo + hi) / 2 + (hi - lo) / 4 ? 'A whopper!' : 'A nice one.'}`));
    btn.textContent = 'Done'; btn.disabled = false; btn.onclick = shut;
    water.onpointerdown = null; water.classList.remove('pulling');
    water.replaceChildren(pop, h('div', { class: 'center' }, btn));
  };
  const tick = timestamp => {
    timestamp ??= performance.now();
    const dt = lastFrame == null ? 0 : Math.min(50, timestamp - lastFrame) / 1000;
    lastFrame = timestamp;
    pullFx = Math.max(0, pullFx - dt * 4);
    if (phase === 'fight') {
      fight.step(dt);
      marker.style.left = `calc(${fight.pos * 100}% - 6px)`;
      marker.classList.toggle('in', fight.inZone);
      landFill.style.width = `${fight.progress * 100}%`;
      tenseFill.style.width = `${Math.min(1, fight.tension) * 100}%`;
      tenseFill.classList.toggle('hot', fight.tension > 0.7);
      if (fight.over) { draw(timestamp / 1000); return end(); }
      if (fight.t > 0.9) say(fight.tension > 0.7 ? 'Easy! The line is straining.'
        : fight.edge > 0.4 ? 'It is running out the line! Pull!'
        : !fight.inZone ? 'Tap to pull it back to the green!'
        : fight.stamina > 0.6 ? 'Still fresh. Keep it there...' : 'Hold it in the green...');
    }
    draw(timestamp / 1000);
    raf = requestAnimationFrame(tick);
  };
  bite = setTimeout(() => {
    phase = 'fight'; sfx.select(); say('Bite! It is running. Tap to pull it back!');
    btn.disabled = false; lastFrame = null;
  }, 900 + Math.random() * 1800);
  // Tapping or clicking anywhere on the water pulls (the button is just a big target).
  water.onpointerdown = e => { if (phase === 'over') return; e.preventDefault(); pull(); };
  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Fishing'), h('button', { class: 'wood-btn small', onclick: close }, 'Stop')),
    water);
  water.replaceChildren(h('div', { class: 'center' }, canvas), status, bar, meters, h('div', { class: 'center' }, btn));
  raf = requestAnimationFrame(tick);
  return { action: () => (phase === 'over' ? shut() : pull()), cleanup: finish };
}
