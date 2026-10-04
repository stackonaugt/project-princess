// Pick up to three pets to bring with you when you leave the house.
import { h } from './dom.js';
import { state, MAX_TEAM } from '../systems/state.js';
import { PET_BY_ID } from '../data/pets.js';
import { TYPES } from '../data/types.js';
import { MAX_HEARTS } from '../config.js';
import { petIcon } from './images.js';
import { sfx } from '../systems/sfx.js';

export function openTeam(panel, done) {
  const picked = new Set(state.data.party.filter(id => state.isFound(id)));
  const render = () => {
    const ids = state.foundIds();
    panel.replaceChildren(
      h('div', { class: 'm-head' }, h('h2', {}, 'Who\'s coming?')),
      h('p', { class: 'dex-sum' }, `Pick up to ${MAX_TEAM} pets to bring along. The rest will hang out at home. Team pets won't be in their usual spots while they're with you.`),
      h('div', { class: 'm-scroll' },
        h('div', { class: 'dex-grid' }, ...ids.map(id => {
          const p = PET_BY_ID[id], on = picked.has(id);
          return h('button', {
            class: 'card team-card' + (on ? ' picked' : ''), 'aria-pressed': on,
            onclick: () => {
              if (on) picked.delete(id); else if (picked.size < MAX_TEAM) picked.add(id); else { sfx.bump(); return; }
              sfx.select(); render();
            },
          },
          h('span', { class: 'thumb' }, h('img', { class: 'pix', src: petIcon(id), alt: '' })),
          h('div', { class: 'card-info' },
            h('div', { class: 'card-top' }, h('span', { class: 'type', style: { background: TYPES[p.type].colour } }, TYPES[p.type].name)),
            h('h3', {}, p.name),
            h('p', { class: 'meta' }, `${state.hearts(id)} of ${MAX_HEARTS} hearts`)),
          h('span', { class: 'tick', 'aria-hidden': 'true' }, on ? '✓' : ''));
        })),
        h('div', { class: 'row center' },
          h('button', { class: 'wood-btn', onclick: () => done([...picked]) }, picked.size ? `Head out with ${picked.size}` : 'Head out alone'),
          h('button', { class: 'link-btn', onclick: () => done(null) }, 'Stay inside'))));
  };
  render();
}
