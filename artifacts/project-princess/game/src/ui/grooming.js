import { h } from './dom.js';
import { ui } from './ui.js';
import { petIcon } from './images.js';
import { controls } from '../systems/controls.js';
import { form } from '../systems/forms.js';

// The grooming table: hold a brush button for a slow stroke (about 0.9s is
// perfect), three strokes on each area. While you hold, a brush sweeps over
// that part of the dog and a meter fills; let go in the green.
const AREAS = ['Head', 'Coat', 'Paws'];
const BEST = 900, MIN = 450, MAX = 1500, FULL = 1800;
// Where the brush sweeps on the dog picture (percent of the picture box).
const SPOTS = [{ left: 68, top: 30 }, { left: 45, top: 45 }, { left: 40, top: 80 }];

export function groomDog(id) {
  return new Promise(resolve => {
    const counts = [0, 0, 0], qualities = [];
    const message = h('p', { role: 'status', 'aria-live': 'polite' }, 'Hold a brush button for a slow stroke and let go in the green. Three strokes on each area.');
    const dog = h('img', { class: 'groom-dog pix', src: petIcon(id, 96), alt: form(id).name, width: 96, height: 96 });
    const brush = h('span', { class: 'groom-brush', 'aria-hidden': 'true' });
    const sparkle = h('span', { class: 'groom-sparkle', 'aria-hidden': 'true' }, '✦ ✧ ✦');
    const picture = h('div', { class: 'groom-picture' }, dog, brush, sparkle);
    const fill = h('span', { class: 'groom-fill' });
    const meter = h('div', { class: 'groom-meter', 'aria-hidden': 'true' },
      h('span', { class: 'groom-zone', style: `left:${MIN / FULL * 100}%;width:${(MAX - MIN) / FULL * 100}%` }), fill);
    let ended = false, pressed = null, raf = 0;
    const tick = () => {
      if (!pressed) return;
      const t = performance.now() - pressed.time;
      fill.style.width = `${Math.min(100, t / FULL * 100)}%`;
      fill.classList.toggle('good', t >= MIN && t <= MAX);
      raf = requestAnimationFrame(tick);
    };
    const start = index => {
      if (ended || counts[index] >= 3) return;
      pressed = { index, time: performance.now() };
      Object.assign(brush.style, { left: `${SPOTS[index].left}%`, top: `${SPOTS[index].top}%` });
      picture.classList.add('brushing'); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
    };
    const stop = () => { pressed = null; cancelAnimationFrame(raf); picture.classList.remove('brushing'); };
    const finish = result => {
      if (ended) return; ended = true; stop();
      document.removeEventListener('visibilitychange', pause);
      panel.remove(); ui.activity = null; controls.release(); resolve(result);
    };
    const stroke = (index, duration) => {
      if (ended || counts[index] >= 3 || document.hidden) return;
      counts[index]++; qualities.push(Math.max(0, 100 - Math.abs(duration - BEST) / 9));
      buttons[index].textContent = `${AREAS[index]} ${counts[index]}/3`;
      buttons[index].disabled = counts[index] === 3;
      const good = duration >= MIN && duration <= MAX;
      message.textContent = duration < MIN ? 'Too quick. Hold the brush a bit longer for a gentle stroke.' :
        duration > MAX ? 'A little long. Let go a bit sooner next time.' : 'A gentle stroke. Your dog relaxes.';
      if (good) { sparkle.classList.remove('show'); void sparkle.offsetWidth; sparkle.classList.add('show'); }
      if (counts.every(n => n === 3)) setTimeout(() => finish({ quality: Math.round(qualities.reduce((a, b) => a + b, 0) / 9) }), 450);
    };
    const release = (index, event) => {
      event?.preventDefault();
      if (pressed?.index === index) { const t = performance.now() - pressed.time; stop(); stroke(index, t); } else stop();
    };
    const buttons = AREAS.map((area, index) => h('button', {
      class: 'wood-btn', 'aria-label': `Brush ${area.toLowerCase()}`,
      onpointerdown: event => { event.preventDefault(); event.currentTarget.setPointerCapture?.(event.pointerId); start(index); },
      onpointerup: event => release(index, event),
      // Phones sometimes cancel a long press (a scroll or the long-press menu):
      // count the stroke anyway rather than losing it.
      onpointercancel: () => release(index),
      oncontextmenu: event => event.preventDefault(),
      onclick: event => { if (event.detail === 0) stroke(index, BEST); },
    }, `${area} 0/3`));
    const panel = h('section', { class: 'groom-panel', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Groom your dog' },
      h('h3', {}, `Groom ${form(id).name}`), picture, meter, message, h('div', { class: 'groom-zones' }, ...buttons),
      h('button', { class: 'wood-btn', onclick: () => finish(null) }, 'Leave grooming'));
    document.body.append(panel); controls.release();
    const pause = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', pause);
    ui.activity = { action: () => { const index = counts.findIndex(n => n < 3); if (index >= 0) stroke(index, BEST); }, cancel: () => finish(null) };
    buttons[0].focus();
  });
}
