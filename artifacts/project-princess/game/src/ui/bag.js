// The bag: treats you're carrying, and who you know loves them.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { ITEMS, isTreat } from '../data/items.js';
import { PETS } from '../data/pets.js';
import { itemIcon, petIcon } from './images.js';
import { GEAR, GEAR_ORDER } from '../data/gear.js';
import { form } from '../systems/forms.js';
import { sfx } from '../systems/sfx.js';

// Bag tabs, like the shops: each item lands in the first tab that fits.
const KINDS = [
  ['treats', 'Treats', (it, id) => isTreat(id) && !it.fish && !it.crop],
  ['fish', 'Fish', it => it.fish || it.junk],
  ['crops', 'Crops', it => it.crop],
  ['presents', 'Presents', it => it.gift || it.drink || it.lolly || it.vape || it.book],
  ['garden', 'Garden', it => it.farm],
  ['party', 'Party', it => it.deco],
  ['special', 'Special', () => true],
];
const kindOf = id => KINDS.find(([, , test]) => test(ITEMS[id], id))[0];
let tab = 'treats';

export function openBag(panel, close) {
  let selected = null;
  const render = () => {
    const all = state.bagItems(), have = new Set(all.map(kindOf));
    const tabs = [...KINDS.filter(([k]) => have.has(k)).map(([k, label]) => [k, label]), ['gear', 'Gear']];
    if (!tabs.some(([k]) => k === tab)) tab = tabs[0][0];
    const items = all.filter(id => kindOf(id) === tab);
    if (!items.includes(selected)) selected = items[0] || null;
    const detail = tab === 'gear' ? null : selected ? (() => {
      const fans = PETS.filter(p => state.isFound(p.id) && state.pet(p.id).reactions[selected] === 'love').map(p => p.name);
      return h('div', { class: 'note bag-detail' },
        h('div', { class: 'gear-row' }, h('img', { class: 'pix', src: itemIcon(selected, 48), alt: '', width: 40, height: 40 }), h('h4', {}, `${ITEMS[selected].name} ×${state.count(selected)}`)),
        h('p', {}, ITEMS[selected].desc),
        h('p', { class: 'small' }, fans.length ? `Loved by ${fans.join(' and ')}.` : ITEMS[selected].drink || ITEMS[selected].gift ? 'A present for a friend. Not for pets.' : ITEMS[selected].farm ? 'For the garden. Use it when you water a bed.' : ITEMS[selected].story || ITEMS[selected].deco ? 'Hang on to this. You will know when you need it.' : 'Give it to a pet to see how they feel about it.'));
    })() : h('div', { class: 'note bag-detail' }, h('p', {}, all.length ? 'Tap an item to look at it.' : 'Your bag is empty. Look for treats around town, and chat to people. Some of them are very generous.'));
    panel.replaceChildren(
      h('div', { class: 'm-head' }, h('h2', {}, 'Bag'), h('button', { class: 'wood-btn small', onclick: close }, 'Close')),
      h('div', { class: 'tabs' }, ...tabs.map(([k, label]) => h('button', { class: 'tab' + (tab === k ? ' on' : ''), onclick: () => { tab = k; sfx.select(); render(); } }, label))),
      detail,
      h('div', { class: 'm-scroll' },
        tab === 'gear' ? gearNote(render) : h('div', { class: 'bag-grid' }, ...items.map(id => h('button', {
          class: 'slot' + (id === selected ? ' on' : ''), 'aria-label': ITEMS[id].name,
          onclick: () => { selected = id; sfx.select(); render(); },
        }, h('img', { class: 'pix', src: itemIcon(id, 48), alt: '' }), h('b', {}, state.count(id))))),
        tab === 'gear' ? null : h('p', { class: 'small center' }, 'Treats go to pets: talk to one you have met. Drinks and presents are for your friends around town.')));
  };
  render();
}

// Gear you own, and who is wearing what.
function gearNote(render) {
  const owned = GEAR_ORDER.filter(id => state.gearCount(id));
  const pets = state.foundIds();
  const wearing = pets.filter(id => state.pet(id).gear);
  if (!owned.length && !wearing.length) return h('div', { class: 'note' }, h('h4', {}, 'Gear'), h('p', { class: 'small' }, 'No gear yet. Romey\'s pet shop on Hope St, Brunswick sells leads, collars and more.'));
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
