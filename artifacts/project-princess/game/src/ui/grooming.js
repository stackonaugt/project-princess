import { h } from './dom.js';
import { ui } from './ui.js';
import { petIcon } from './images.js';
import { controls } from '../systems/controls.js';
import { form } from '../systems/forms.js';

export function groomDog(id) {
  return new Promise(resolve => {
    const counts = [0, 0, 0], qualities = [];
    const message = h('p', { role: 'status', 'aria-live': 'polite' }, 'Hold a brush for a slow stroke, then release. Three gentle strokes on each area.');
    const picture = h('div', {}); picture.innerHTML = petIcon(id, 88);
    let ended = false, pressed = null;
    const finish = result => {
      if (ended) return; ended = true;
      document.removeEventListener('visibilitychange', pause);
      panel.remove(); ui.activity = null; controls.release(); resolve(result);
    };
    const stroke = (index, duration) => {
      if (ended || counts[index] >= 3 || document.hidden) return;
      counts[index]++; qualities.push(Math.max(0, 100 - Math.abs(duration - 900) / 9));
      buttons[index].textContent = `${['Head', 'Coat', 'Paws'][index]} ${counts[index]}/3`;
      buttons[index].disabled = counts[index] === 3;
      message.textContent = duration < 450 ? 'Too quick. A slow, gentle stroke gives a better finish.' :
        duration > 1500 ? 'A little long. Keep the next stroke light and smooth.' : 'A gentle stroke. Your dog relaxes.';
      if (counts.every(n => n === 3)) finish({ quality: Math.round(qualities.reduce((a, b) => a + b, 0) / 9) });
    };
    const buttons = counts.map((_, index) => h('button', {
      class: 'wood-btn', 'aria-label': `Brush ${['head', 'coat', 'paws'][index]}`,
      onpointerdown: event => { event.preventDefault(); pressed = { index, time: performance.now() }; event.currentTarget.setPointerCapture?.(event.pointerId); },
      onpointerup: event => { event.preventDefault(); if (pressed?.index === index) stroke(index, performance.now() - pressed.time); pressed = null; },
      onpointercancel: () => { pressed = null; },
      onclick: event => { if (event.detail === 0) stroke(index, 900); },
    }, `${['Head', 'Coat', 'Paws'][index]} 0/3`));
    const panel = h('section', { class: 'groom-panel', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Groom your dog' },
      h('h3', {}, `Groom ${form(id).name}`), picture, message, h('div', { class: 'groom-zones' }, ...buttons),
      h('button', { class: 'wood-btn', onclick: () => finish(null) }, 'Leave grooming'));
    document.body.append(panel); controls.release();
    const pause = () => { if (document.hidden) pressed = null; };
    document.addEventListener('visibilitychange', pause);
    ui.activity = { action: () => { const index = counts.findIndex(n => n < 3); if (index >= 0) stroke(index, 900); }, cancel: () => finish(null) };
    buttons[0].focus();
  });
}
