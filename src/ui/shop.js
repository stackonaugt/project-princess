// The pet shop: buy treats and gear with the money you earn in battles.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { ITEMS } from '../data/items.js';
import { GEAR, GEAR_ORDER } from '../data/gear.js';
import { itemIcon } from './images.js';
import { sfx } from '../systems/sfx.js';

let tab = 'treats';

export function openShop(panel, close) {
  const msg = h('p', { class: 'small center', role: 'status' });
  const render = () => {
    const rows = tab === 'treats'
      ? Object.entries(ITEMS).filter(([, it]) => it.price).map(([id, it]) => ({ id, name: it.name, desc: it.desc, price: it.price, icon: itemIcon(id, 32), have: state.count(id), buy: () => state.addItem(id) }))
      : GEAR_ORDER.map(id => ({ id, name: GEAR[id].name, desc: GEAR[id].desc, price: GEAR[id].price, icon: itemIcon(`gear-${id}`, 32), have: state.gearCount(id), buy: () => state.addGear(id) }));
    panel.replaceChildren(
      h('div', { class: 'm-head' }, h('h2', {}, 'The Leash You Can Do'), h('button', { class: 'wood-btn small', onclick: close }, 'Done')),
      h('p', { class: 'dex-sum shop-money' }, `You have $${state.data.money}`),
      h('div', { class: 'tabs', role: 'tablist' }, ...[['treats', 'Treats'], ['gear', 'Gear']].map(([id, label]) =>
        h('button', { class: 'tab' + (tab === id ? ' on' : ''), role: 'tab', 'aria-selected': tab === id, onclick: () => { tab = id; sfx.select(); render(); } }, label))),
      h('div', { class: 'm-scroll' },
        tab === 'gear' ? h('p', { class: 'small' }, 'Gear goes on a pet from your bag. One piece each. It helps in battles.') : null,
        ...rows.map(r => h('div', { class: 'shop-row' },
          h('img', { class: 'pix', src: r.icon, alt: '' }),
          h('div', { class: 'shop-info' }, h('b', {}, r.name), h('p', {}, r.desc), h('small', {}, r.have ? `You have ${r.have}` : '')),
          h('button', {
            class: 'wood-btn small', disabled: state.data.money < r.price,
            onclick: () => {
              if (!state.spend(r.price)) { sfx.bump(); return; }
              r.buy(); sfx.pickup(); state.save();
              msg.textContent = `Bought: ${r.name}.`;
              render();
            },
          }, `$${r.price}`))),
        msg));
  };
  render();
}
