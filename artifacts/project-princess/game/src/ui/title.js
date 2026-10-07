// The title screen: pick one of three save slots (or start a new game in an
// empty one). Shown once at boot, before the world starts.
import { h, $ } from './dom.js';
import { state, SLOT_COUNT } from '../systems/state.js';
import { HEROES } from '../data/heroes.js';
import { PETS } from '../data/pets.js';
import { isArchived } from '../authoring/archive.js';
import { ZONES } from '../data/regions.js';
import { frameDataURL } from '../art/textures.js';
import { sfx } from '../systems/sfx.js';

export function showTitle(scene) {
  return new Promise(resolve => {
    const el = $('title');
    const icon = (key, size) => frameDataURL(scene, key, 0, size);
    const render = () => {
      const slots = state.slots();
      el.replaceChildren(h('div', { class: 'title-panel' },
        h('div', { class: 'title-pets', 'aria-hidden': 'true' }, ...PETS.filter(p => !isArchived('pets', p.id)).map(p => h('img', { class: 'pix', src: icon(`pet-${p.id}`, 48), alt: '' }))),
        h('h1', { class: 'title-logo' }, 'Project Princess'),
        h('p', { class: 'title-sub' }, 'A pet adventure across Laverton, Brunswick and Reservoir'),
        h('div', { class: 'slots' }, ...Array.from({ length: SLOT_COUNT }, (_, i) => {
          const s = slots[i], n = i + 1;
          const pick = () => { sfx.select(); el.hidden = true; resolve(n); };
          if (!s) return h('div', { class: 'slot-card empty' },
            h('button', { class: 'slot-main', onclick: pick }, h('b', {}, `Slot ${n}`), h('span', {}, 'New game')));
          const hero = s.hero && HEROES[s.hero];
          return h('div', { class: 'slot-card' },
            h('button', { class: 'slot-main', onclick: pick },
              hero ? h('img', { class: 'pix', src: icon(`player-${s.hero}-down`, 64), alt: '' }) : null,
              h('span', { class: 'slot-info' },
                h('b', {}, `Slot ${n}: ${hero ? hero.name : 'New game'}`),
                h('span', {}, `Day ${s.day} · ${s.pets}/${s.totalPets} pets · $${s.money}`),
                h('small', {}, ZONES[s.region]?.name || ''))),
            h('button', { class: 'link-btn slot-del', onclick: () => {
              if (!confirm(`Delete slot ${n}? This cannot be undone.`)) return;
              state.deleteSlot(n); sfx.close(); render();
            } }, 'Delete'));
        })),
        h('p', { class: 'small title-foot' }, 'Your game saves itself. The pets belong to their humans.')));
      el.hidden = false;
      el.querySelector('.slot-main')?.focus();
    };
    render();
  });
}
