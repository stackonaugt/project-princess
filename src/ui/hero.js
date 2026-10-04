// Choose who you play as: Helen, or one of the twins.
import { h } from './dom.js';
import { HEROES, HERO_ORDER } from '../data/heroes.js';
import { ITEMS } from '../data/items.js';
import { heroIcon, itemIcon } from './images.js';
import { sfx } from '../systems/sfx.js';

export function openHero(panel, done, { canCancel = false } = {}) {
  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Who are you?'), canCancel ? h('button', { class: 'wood-btn small', onclick: () => done(null) }, 'Close') : null),
    h('div', { class: 'm-scroll' },
      h('div', { class: 'hero-grid' }, ...HERO_ORDER.map(id => {
        const hero = HEROES[id];
        return h('button', { class: 'card hero-card', onclick: () => { sfx.select(); done(id); } },
          h('span', { class: 'thumb tall' }, h('img', { class: 'pix', src: heroIcon(id), alt: '' })),
          h('div', { class: 'card-info' },
            h('h3', {}, hero.name),
            h('p', { class: 'meta' }, hero.blurb),
            h('p', { class: 'perk' }, h('b', {}, hero.perkName + ': '), hero.perkText),
            h('div', { class: 'prefs' }, h('span', { class: 'lbl' }, 'Starts with'),
              ...Object.entries(hero.start).map(([item, n]) => h('span', { class: 'pref' }, h('img', { src: itemIcon(item), alt: '' }), `${ITEMS[item].name}${n > 1 ? ' ×' + n : ''}`)))));
      }))));
}
