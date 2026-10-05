// The bag: treats you're carrying, and who you know loves them.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { ITEMS } from '../data/items.js';
import { PETS } from '../data/pets.js';
import { itemIcon, petIcon } from './images.js';
import { GEAR, GEAR_ORDER } from '../data/gear.js';
import { form } from '../systems/forms.js';
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
        h('p', { class: 'small' }, fans.length ? `Loved by ${fans.join(' and ')}.` : ITEMS[selected].drink || ITEMS[selected].gift ? 'A present for a friend. Not for pets.' : ITEMS[selected].farm ? 'For the garden. Use it when you water a bed.' : 'Give it to a pet to see how they feel about it.'));
    })() : h('div', { class: 'note' }, h('p', {}, items.length ? 'Tap a treat to look at it.' : 'Your bag is empty. Look for treats around town, and chat to people. Some of them are very generous.'));
    panel.replaceChildren(
      h('div', { class: 'm-head' }, h('h2', {}, 'Bag'), h('button', { class: 'wood-btn small', onclick: close }, 'Close')),
      h('div', { class: 'm-scroll' },
        h('div', { class: 'bag-grid' }, ...items.map(id => h('button', {
          class: 'slot' + (id === selected ? ' on' : ''), 'aria-label': ITEMS[id].name,
          onclick: () => { selected = id; sfx.select(); render(); },
        }, h('img', { class: 'pix', src: itemIcon(id, 48), alt: '' }), h('b', {}, state.count(id))))),
        detail,
        h('p', { class: 'small center' }, 'Treats go to pets: talk to one you have met. Drinks and presents are for your friends around town.'),
        gearNote(render)));
  };
  render();
}

// Gear you own, and who is wearing what.
function gearNote(render) {
  const owned = GEAR_ORDER.filter(id => state.gearCount(id));
  const pets = state.foundIds();
  const wearing = pets.filter(id => state.pet(id).gear);
  if (!owned.length && !wearing.length) return h('div', { class: 'note' }, h('h4', {}, 'Gear'), h('p', { class: 'small' }, 'No gear yet. Ed\'s pet shop on Hope St, Brunswick sells leads, collars and more.'));
  return h('div', { class: 'note' }, h('h4', {}, 'Gear'),
    ...owned.map(g => h('div', {},
      h('div', { class: 'gear-row' }, h('img', { class: 'pix', src: itemIcon(`gear-${g}`, 32), alt: '', width: 24, height: 24 }), h('b', {}, `${GEAR[g].name} ×${state.gearCount(g)}`), h('span', { class: 'small' }, GEAR[g].desc)),
      pets.length ? h('div', { class: 'gear-row' }, h('span', { class: 'small' }, 'Put it on:'),
        ...pets.map(id => h('button', { class: 'wood-btn small gear-pet', onclick: () => { state.equip(id, g); sfx.select(); state.save(); render(); } },
          h('img', { src: petIcon(id, 24), alt: '' }), form(id).name))) : null)),
    ...wearing.map(id => h('div', { class: 'gear-row' },
      h('img', { class: 'pix', src: petIcon(id, 24), alt: '', width: 24, height: 24 }),
      h('span', {}, `${form(id).name} is wearing the ${GEAR[state.pet(id).gear].name.toLowerCase()}.`),
      h('button', { class: 'link-btn', onclick: () => { state.equip(id, null); sfx.select(); state.save(); render(); } }, 'Take off'))));
}
