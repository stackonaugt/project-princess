// Shops: buy treats, gear, seeds, tools, house upgrades, presents and drinks,
// and sell your crops.
// Which tabs a shop has is set in src/data/shops.js.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { bus } from '../bus.js';
import { ITEMS, isTreat } from '../data/items.js';
import { GEAR, GEAR_ORDER } from '../data/gear.js';
import { CROPS, CROP_ORDER } from '../data/crops.js';
import { UPGRADES, UPGRADE_ORDER, TOOL_ORDER, FISHING_ORDER } from '../data/upgrades.js';
import { COUCHES, COUCH_ORDER } from '../data/furniture.js';
import { HEROES } from '../data/heroes.js';
import { SHOPS } from '../data/shops.js';
import { invalidateMap } from '../data/regions.js';
import { itemIcon } from './images.js';
import { sfx } from '../systems/sfx.js';

const TAB_NAMES = { treats: 'Treats', gear: 'Gear', seeds: 'Seeds', tools: 'Tools', upgrades: 'House', gifts: 'Presents', drinks: 'Drinks', lollies: 'Lollies', vapes: 'Vapes', books: 'Books', fishing: 'Fishing', furniture: 'Couches', sell: 'Sell' };
const tabFor = {};

// What a shop pays for one of an item: crops at their price, treats at half.
// Princess on your team charms an extra 20% out of them.
export function sellPrice(id) {
  const base = CROPS[id] ? CROPS[id].sell : ITEMS[id].sell || Math.floor((ITEMS[id].price || 2) / 2);
  return Math.max(1, Math.round(base * (state.inParty('princess') ? 1.2 : 1)));
}

export function openShop(panel, close, shopId = 'petshop') {
  const shop = SHOPS[shopId];
  const msg = h('p', { class: 'small center', role: 'status' });
  if (!shop.tabs.includes(tabFor[shopId])) tabFor[shopId] = shop.tabs[0];
  const buy = (name, price, give) => () => {
    if (!state.spend(price)) { sfx.bump(); return; }
    give(); sfx.pickup(); state.save();
    msg.textContent = `Bought: ${name}.`;
    render();
  };
  // Toddlers can shop, but not on a shop's adultTabs (the vapes).
  const baby = !!HEROES[state.data.hero]?.look.baby, refused = t => baby && (shop.adultTabs || []).includes(t);
  const rowsFor = tab => {
    const itemRow = id => { const it = ITEMS[id]; return { name: it.name, desc: it.desc, price: it.price, icon: itemIcon(id, 32), have: state.count(id), act: buy(it.name, it.price, () => state.addItem(id)) }; };
    if (tab === 'treats') return (shop.treats || Object.keys(ITEMS).filter(id => ITEMS[id].price && !ITEMS[id].crop && !ITEMS[id].local && isTreat(id))).map(itemRow);
    if (tab === 'gifts') return (shop.gifts || []).map(itemRow);
    if (tab === 'drinks') return Object.keys(ITEMS).filter(id => ITEMS[id].drink).map(itemRow);
    if (tab === 'lollies') return Object.keys(ITEMS).filter(id => ITEMS[id].lolly).map(itemRow);
    if (tab === 'vapes') return refused(tab) ? [] : Object.keys(ITEMS).filter(id => ITEMS[id].vape).map(itemRow);
    if (tab === 'books') return Object.keys(ITEMS).filter(id => ITEMS[id].book).map(itemRow);
    if (tab === 'fishing') return [...upgradeRows(FISHING_ORDER), itemRow('bait')];
    if (tab === 'furniture') return COUCH_ORDER.map(id => {
      const c = COUCHES[id], f = state.data.furniture, owned = f.owned.includes(id), here = f.couch === id;
      const place = () => { f.couch = id; if (!f.owned.includes(id)) f.owned.push(id); invalidateMap('home'); sfx.pickup(); state.save(); msg.textContent = `${c.name} is in the lounge now.`; render(); };
      return { name: c.name, desc: c.desc, price: c.price, owned: here, ownedLabel: 'In the lounge ✓',
        btnLabel: owned ? 'Put it in' : null, free: owned,
        act: owned ? place : () => { if (!state.spend(c.price)) { sfx.bump(); return; } place(); } };
    });
    if (tab === 'gear') return GEAR_ORDER.map(id => ({ name: GEAR[id].name, desc: GEAR[id].desc, price: GEAR[id].price, icon: itemIcon(`gear-${id}`, 32), have: state.gearCount(id), act: buy(GEAR[id].name, GEAR[id].price, () => state.addGear(id)) }));
    if (tab === 'seeds') return (shop.seeds || CROP_ORDER).map(id => {
      const c = CROPS[id];
      return { name: `${c.name} seeds`, desc: `${c.blurb} Ready in ${c.days} days${c.regrow ? ', keeps producing' : ''}.`, price: c.seed, icon: itemIcon(`seed-${id}`, 32), have: state.seedCount(id), act: buy(`${c.name} seeds`, c.seed, () => state.addSeeds(id)) };
    });
    if (tab === 'upgrades' || tab === 'tools') return upgradeRows(tab === 'tools' ? TOOL_ORDER : UPGRADE_ORDER);
    return [];
  };
  const upgradeRows = ids => ids.map(id => {
      const u = UPGRADES[id], owned = state.hasUpgrade(id);
      return { name: u.name, desc: u.desc, price: u.price, owned, act: buy(u.name, u.price, () => {
        state.data.upgrades[id] = true;
        invalidateMap('home'); invalidateMap('yard');
        bus.emit('upgrade', id);
      }) };
    });
  const rowsForRest = tab => {
    if (tab === 'sell') return state.bagItems().map(id => ({
      name: ITEMS[id].name, desc: `You have ${state.count(id)}.`, price: sellPrice(id), icon: itemIcon(id, 32), sell: true,
      act: () => { state.removeItem(id); state.addMoney(sellPrice(id)); sfx.pickup(); state.save(); msg.textContent = `Sold: ${ITEMS[id].name} for $${sellPrice(id)}.`; render(); },
    }));
    return [];
  };
  // The bottle shop does not serve toddlers. Obviously.
  if (shop.adults && HEROES[state.data.hero]?.look.baby) {
    panel.replaceChildren(
      h('div', { class: 'm-head' }, h('h2', {}, shop.name), h('button', { class: 'wood-btn small', onclick: close }, 'Done')),
      h('div', { class: 'note' }, h('p', {}, 'The bottle shop guy leans over the counter and looks down. A long way down.'),
        h('p', {}, '"Nice try, little mate. Come back in about eighteen years. Or bring Helen."')));
    return;
  }
  const render = () => {
    const tab = tabFor[shopId], rows = tab === 'sell' ? rowsForRest(tab) : rowsFor(tab);
    panel.replaceChildren(...[
      h('div', { class: 'm-head' }, h('h2', {}, shop.name), h('button', { class: 'wood-btn small', onclick: close }, 'Done')),
      h('p', { class: 'dex-sum shop-money' }, `You have $${state.data.money}`),
      shop.tabs.length > 1 ? h('div', { class: 'tabs', role: 'tablist' }, ...shop.tabs.map(id =>
        h('button', { class: 'tab' + (tab === id ? ' on' : ''), role: 'tab', 'aria-selected': tab === id, onclick: () => { tabFor[shopId] = id; sfx.select(); render(); } }, TAB_NAMES[id]))) : null,
      h('div', { class: 'm-scroll' },
        tab === 'gear' ? h('p', { class: 'small' }, 'Gear goes on a pet from your bag. One piece each. It helps in battles.') : null,
        refused(tab) ? h('div', { class: 'note' }, h('p', {}, 'Sam leans right over the counter. "Absolutely not, little one. Lollies are that way."')) : null,
        tab === 'vapes' && !refused(tab) ? h('p', { class: 'small' }, 'Presents for adult friends who already vape. Sam says the law changed and these are "basically pharmacy only". There is a sign. It says VAPES.') : null,
        tab === 'drinks' || tab === 'gifts' || tab === 'books' || tab === 'lollies' ? h('p', { class: 'small' }, 'Presents for your friends around town. Not for pets. Everyone has favourites: check the Friends app.') : null,
        tab === 'tools' ? h('p', { class: 'small' }, 'Garden tools work as soon as you buy them.') : null,
        tab === 'books' ? h('p', { class: 'small' }, 'Classics and the latest hits. Books make lovely presents. Some friends are big readers.') : null,
        tab === 'fishing' ? h('p', { class: 'small' }, 'With a rod, face the water at Edwardes Lake, Edgars Creek or Kororoit Creek and press A.') : null,
        tab === 'furniture' ? h('p', { class: 'small' }, 'Pick a couch for the lounge. It is delivered straight away. Megalo service!') : null,
        tab === 'sell' ? h('p', { class: 'small' }, state.inParty('princess') ? 'Princess is charming the shopkeeper. You get 20% more.' : 'Crops sell well. Treats go for half what they cost.') : null,
        tab === 'sell' && !rows.length ? h('p', { class: 'center' }, 'Nothing to sell.') : null,
        ...rows.map(r => h('div', { class: 'shop-row' },
          r.icon ? h('img', { class: 'pix', src: r.icon, alt: '' }) : h('span', { class: 'shop-glyph' }, '🏠'),
          h('div', { class: 'shop-info' }, h('b', {}, r.name), h('p', {}, r.desc), h('small', {}, r.have ? `You have ${r.have}` : '')),
          r.owned ? h('span', { class: 'meta' }, r.ownedLabel || 'Done ✓')
            : h('button', { class: 'wood-btn small', disabled: !r.sell && !r.free && state.data.money < r.price, onclick: r.act }, r.btnLabel || (r.sell ? `Sell $${r.price}` : `$${r.price}`)))),
        msg)].filter(Boolean));
  };
  render();
}
