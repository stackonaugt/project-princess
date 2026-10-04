// The bag: treats you're carrying, and who you know loves them.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { ITEMS } from '../data/items.js';
import { PETS } from '../data/pets.js';
import { itemIcon } from './images.js';
import { sfx } from '../systems/sfx.js';

export function openBag(panel, close) {
  let selected = state.bagItems()[0] || null;
  const render = () => {
    const items = state.bagItems();
    const detail = selected && state.count(selected) ? (() => {
      const fans = PETS.filter(p => state.isFound(p.id) && state.pet(p.id).reactions[selected] === 'love').map(p => p.name);
      return h('div', { class: 'note' },
        h('h4', {}, ITEMS[selected].name),
        h('p', {}, ITEMS[selected].desc),
        h('p', { class: 'small' }, fans.length ? `Loved by ${fans.join(' and ')}.` : 'Give it to a pet to see how they feel about it.'));
    })() : h('div', { class: 'note' }, h('p', {}, items.length ? 'Tap a treat to look at it.' : 'Your bag is empty. Look for treats around town, and chat to people. Some of them are very generous.'));
    panel.replaceChildren(
      h('div', { class: 'm-head' }, h('h2', {}, 'Bag'), h('button', { class: 'wood-btn small', onclick: close }, 'Close')),
      h('div', { class: 'm-scroll' },
        h('div', { class: 'bag-grid' }, ...items.map(id => h('button', {
          class: 'slot' + (id === selected ? ' on' : ''), 'aria-label': ITEMS[id].name,
          onclick: () => { selected = id; sfx.select(); render(); },
        }, h('img', { class: 'pix', src: itemIcon(id, 48), alt: '' }), h('b', {}, state.count(id))))),
        detail,
        h('p', { class: 'small center' }, 'To give a treat, talk to a pet you have already met.')));
  };
  render();
}
