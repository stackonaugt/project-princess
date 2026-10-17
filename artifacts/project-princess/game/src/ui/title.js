// The title screen: pick one of three save slots (or start a new game in an
// empty one). Shown once at boot, before the world starts.
import { h, $ } from './dom.js';
import { state, SLOT_COUNT } from '../systems/state.js';
import { HEROES } from '../data/heroes.js';
import { ZONES } from '../data/regions.js';
import { frameDataURL } from '../art/textures.js';
import { sfx } from '../systems/sfx.js';

// Drawn like an old Game Boy title: the logo, the hero and Princess, then
// Press start opens the save menu.
export function showTitle(scene) {
  return new Promise(resolve => {
    const el = $('title');
    const icon = (key, size) => frameDataURL(scene, key, 0, size);
    let started = false;
    const begin = () => { if (started) return; started = true; sfx.select(); render(); };
    const onKey = e => { if (!started && ['Enter', ' ', 'z', 'Z', 'x', 'X'].includes(e.key)) { e.preventDefault(); begin(); } };
    const close = n => { document.removeEventListener('keydown', onKey); sfx.select(); el.hidden = true; resolve(n); };
    document.addEventListener('keydown', onKey);
    const logo = () => h('div', { class: 'title-logo-wrap' },
      h('h1', { class: 'title-logo', 'aria-label': 'PetPals: Princess Edition' }, 'PetPals'),
      h('p', { class: 'title-edition', 'aria-hidden': 'true' }, 'Princess Edition'));
    const cast = () => h('div', { class: 'title-cast', 'aria-hidden': 'true' },
      h('img', { class: 'pix title-hero', src: icon('player-helen-down', 128), alt: '' }),
      h('img', { class: 'pix title-pet', src: icon('pet-princess', 128), alt: '' }));
    const foot = h('p', { class: 'title-foot' }, h('span', { class: 'title-copy' }, '©'), ' 2026 Allen St, Laverton · the pets belong to their humans');
    const slotMenu = () => {
      const slots = state.slots();
      return h('div', { class: 'title-menu', role: 'menu' }, ...Array.from({ length: SLOT_COUNT }, (_, i) => {
        const s = slots[i], n = i + 1;
        if (!s) return h('div', { class: 'slot-card empty' },
          h('button', { class: 'slot-main', onclick: () => close(n) }, h('b', {}, `Slot ${n}`), h('span', {}, 'New game')));
        const hero = s.hero && HEROES[s.hero];
        return h('div', { class: 'slot-card' },
          h('button', { class: 'slot-main', onclick: () => close(n) },
            hero ? h('img', { class: 'pix', src: icon(`player-${s.hero}-down`, 64), alt: '' }) : null,
            h('span', { class: 'slot-info' },
              h('b', {}, `Slot ${n}: ${hero ? hero.name : 'New game'}`),
              h('span', {}, `Day ${s.day} · ${s.pets}/${s.totalPets} pets · $${s.money}`),
              h('small', {}, ZONES[s.region]?.name || ''))),
          h('button', { class: 'link-btn slot-del', onclick: () => {
            if (!confirm(`Delete slot ${n}? This cannot be undone.`)) return;
            state.deleteSlot(n); sfx.close(); render();
          } }, 'Delete'));
      }));
    };
    const render = () => {
      el.replaceChildren(h('div', { class: `title-panel${started ? ' menu' : ''}` },
        logo(),
        started ? slotMenu() : cast(),
        started ? h('p', { class: 'title-hint' }, 'Your game saves itself.')
          : h('button', { class: 'title-start', onclick: begin }, 'PRESS START'),
        foot));
      el.hidden = false;
      el.querySelector(started ? '.slot-main' : '.title-start')?.focus();
    };
    render();
  });
}
