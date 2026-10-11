// Shops: buy treats, gear, seeds, tools, house upgrades, presents and drinks,
// and sell your crops.
// Which tabs a shop has is set in src/data/shops.js.
import { PRANKS } from '../data/story.js';
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { bus } from '../bus.js';
import { ITEMS, isTreat } from '../data/items.js';
import { GEAR, GEAR_ORDER } from '../data/gear.js';
import { CROPS, CROP_ORDER } from '../data/crops.js';
import { UPGRADES, UPGRADE_ORDER, TOOL_ORDER, FISHING_ORDER } from '../data/upgrades.js';
import { FURNITURE, FURNITURE_ORDER, SLOTS, PLANT_SPOTS, plantAt, plantSpots } from '../data/furniture.js';
import { HEROES } from '../data/heroes.js';
import { SHOPS } from '../data/shops.js';
import { SPELLS, SPELL_ORDER, spellPrice } from '../data/east.js';
import { invalidateMap } from '../data/regions.js';
import { itemIcon } from './images.js';
import { sfx } from '../systems/sfx.js';

const TAB_NAMES = { materials: 'Materials', spells: 'Spells', treats: 'Treats', gear: 'Gear', seeds: 'Seeds', tools: 'Tools', upgrades: 'House', gifts: 'Presents', remedies: 'Remedies', pranks: 'Pranks', drinks: 'Drinks', lollies: 'Lollies', vapes: 'Vapes', books: 'Books', fishing: 'Fishing', furniture: 'Furniture', plants: 'Pot plants', sell: 'Sell', fish: 'Sell fish', party: 'Party', pantry: 'Pantry', paint: 'Paint' };
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
  let plantFor = null;   // the pot plant waiting for a spot at home (Pot plants tab)
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
    if (tab === 'treats') return (shop.treats || Object.keys(ITEMS).filter(id => !ITEMS[id].local)).filter(id => ITEMS[id].price && !ITEMS[id].crop && isTreat(id)).map(itemRow);
    if (tab === 'materials') return (shop.materials || []).map(itemRow);
    if (tab === 'gifts') return (shop.gifts || []).map(itemRow);
    if (tab === 'pantry') return (shop.pantry || []).map(itemRow);
    if (tab === 'pranks') return (shop.pranks || Object.values(PRANKS).map(pr => pr.item)).map(itemRow);
    // Lincraft's paint: the walls at home change colour straight away.
    if (tab === 'paint') return shop.paints.map(([name, colour, price]) => ({
      name, desc: 'Enough for every wall in the house. Lyn will even lend you a roller.', price, owned: (state.data.wallPaint || null) === colour, ownedLabel: 'On the walls ✓',
      act: () => { if (!state.spend(price)) { sfx.bump(); return; } state.data.wallPaint = colour; invalidateMap('home'); sfx.pickup(); state.save(); msg.textContent = `The walls at home are ${name} now.`; render(); },
    }));
    if (tab === 'remedies') return (shop.remedies || []).map(itemRow);
    if (tab === 'spells') return SPELL_ORDER.map(id => {
      const sp = SPELLS[id], price = spellPrice(id, state.data.day), on = state.data.spell?.id === id && state.data.spell.day === state.data.day;
      return { name: sp.name, desc: sp.desc, price, icon: itemIcon('gear-bandana', 32), owned: on, ownedLabel: 'Cast today ✓',
        act: buy(sp.name, price, () => { state.data.spell = { id, day: state.data.day }; }) };
    });
    if (tab === 'drinks') return Object.keys(ITEMS).filter(id => ITEMS[id].drink).map(itemRow);
    if (tab === 'lollies') return Object.keys(ITEMS).filter(id => ITEMS[id].lolly).map(itemRow);
    if (tab === 'vapes') return refused(tab) ? [] : Object.keys(ITEMS).filter(id => ITEMS[id].vape).map(itemRow);
    if (tab === 'party') return Object.keys(ITEMS).filter(id => ITEMS[id].deco).map(itemRow);
    if (tab === 'books') return Object.keys(ITEMS).filter(id => ITEMS[id].book).map(itemRow);
    if (tab === 'fishing') return [...upgradeRows(FISHING_ORDER), itemRow('bait')];
    // A pot plant replaces one spot at home (or a matching pair): pick it next.
    if (tab === 'plants') return FURNITURE_ORDER.filter(id => FURNITURE[id].shop === 'bunnings').map(id => {
      const c = FURNITURE[id], spots = plantSpots(u => state.hasUpgrade(u));
      const here = spots.filter(spot => plantAt(state.data.furniture, spot) === id).length;
      return { name: c.name, desc: `${c.desc}${here ? ` At home: ${here} of ${spots.length} spots.` : ''}`, price: c.price,
        owned: here === spots.length, ownedLabel: 'In every spot ✓',
        btnLabel: plantFor === id ? 'Choosing…' : c.price ? null : 'Put it back', free: !c.price,
        act: () => { plantFor = plantFor === id ? null : id; msg.textContent = ''; sfx.select(); render(); } };
    });
    if (tab === 'furniture') return FURNITURE_ORDER.filter(id => FURNITURE[id].shop !== 'bunnings').map(id => {
      const c = FURNITURE[id], f = state.data.furniture, owned = f.owned.includes(id), here = f[c.slot] === id;
      const place = () => { state.placeFurniture(id); sfx.pickup(); msg.textContent = `${c.name} is in the house now.`; render(); };
      return { name: c.name, desc: `${SLOTS[c.slot]}. ${c.desc}`, price: c.price, owned: here, ownedLabel: 'In the house ✓',
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
    if (tab === 'fish') return state.bagItems().filter(id => ITEMS[id].fish || ITEMS[id].junk).map(id => {
      const price = ITEMS[id].junk ? 1 : Math.round(sellPrice(id) * 1.5);
      return {
        name: ITEMS[id].name, desc: `You have ${state.count(id)}.`, price, icon: itemIcon(id, 32), sell: true,
        act: () => { state.removeItem(id); state.addMoney(price); sfx.pickup(); state.save(); msg.textContent = ITEMS[id].junk ? 'Spiro takes the boot. "For the bin. No charge. Well, a dollar."' : `Sold: ${ITEMS[id].name} for $${price}.`; render(); },
      };
    });
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
  // Where the chosen pot plant goes: one spot (or pair) at home.
  const plantChooser = () => {
    const id = plantFor, c = FURNITURE[id], furn = state.data.furniture;
    return h('div', { class: 'note plant-chooser' },
      h('p', {}, `Where should the ${c.name} go? It replaces the plant there.`),
      ...plantSpots(u => state.hasUpgrade(u)).map(spot => {
        const now = plantAt(furn, spot), same = now === id;
        return h('button', { class: 'wood-btn small', disabled: same || state.data.money < c.price, onclick: () => {
          if (c.price && !state.spend(c.price)) { sfx.bump(); return; }
          state.placeFurniture(id, spot); plantFor = null; sfx.pickup();
          msg.textContent = `${c.name} is in the house now. Spot: ${PLANT_SPOTS[spot].name}.`; render();
        } }, `${PLANT_SPOTS[spot].name}: ${same ? 'already here' : FURNITURE[now].name}`);
      }),
      h('button', { class: 'wood-btn small', onclick: () => { plantFor = null; sfx.select(); render(); } }, 'Not now'));
  };
  const render = () => {
    const tab = tabFor[shopId], rows = tab === 'sell' || tab === 'fish' ? rowsForRest(tab) : rowsFor(tab);
    panel.replaceChildren(...[
      h('div', { class: 'm-head' }, h('h2', {}, shop.name), h('button', { class: 'wood-btn small', onclick: close }, 'Done')),
      h('p', { class: 'dex-sum shop-money' }, `You have $${state.data.money}`),
      shop.tabs.length > 1 ? h('div', { class: 'tabs', role: 'tablist' }, ...shop.tabs.map(id =>
        h('button', { class: 'tab' + (tab === id ? ' on' : ''), role: 'tab', 'aria-selected': tab === id, onclick: () => { tabFor[shopId] = id; sfx.select(); render(); } }, TAB_NAMES[id]))) : null,
      h('div', { class: 'm-scroll' },
        tab === 'spells' ? h('p', { class: 'small' }, 'A spell protects your whole team until the end of the day. The prices move. The Sorceress does not explain the prices.') : null,
        tab === 'gear' ? h('p', { class: 'small' }, 'Gear goes on a pet from your bag. One piece each. It helps in battles.') : null,
        refused(tab) ? h('div', { class: 'note' }, h('p', {}, 'Sam leans right over the counter. "Absolutely not, little one. Lollies are that way."')) : null,
        tab === 'vapes' && !refused(tab) ? h('p', { class: 'small' }, 'Presents for adult friends who already vape. Sam says the law changed and these are "basically pharmacy only". There is a sign. It says VAPES.') : null,
        tab === 'drinks' || tab === 'gifts' || tab === 'books' || tab === 'lollies' ? h('p', { class: 'small' }, 'Presents for your friends around town. Not for pets. Everyone has favourites: check the Friends app.') : null,
        tab === 'pantry' ? h('p', { class: 'small' }, 'Baking supplies for the kitchen at home. Cook books from Brunswick Bound teach new recipes.') : null,
        tab === 'tools' ? h('p', { class: 'small' }, 'Garden tools work as soon as you buy them.') : null,
        tab === 'books' ? h('p', { class: 'small' }, 'Classics and the latest hits. Books make lovely presents. Some friends are big readers.') : null,
        tab === 'fishing' ? h('p', { class: 'small' }, 'With a rod, face the water at Edwardes Lake, Edgars Creek or Kororoit Creek and press A.') : null,
        tab === 'plants' ? h('p', { class: 'small' }, 'Each pot plant replaces one plant at home, or a matching pair. Pick the spot after you choose. Olly drops it round on the way home.') : null,
        tab === 'plants' && plantFor ? plantChooser() : null,
        tab === 'furniture' ? h('p', { class: 'small' }, 'Beds, couches, rugs, lamps and more. Delivered straight away. Things you own can go back in any time. Megalo service!') : null,
        tab === 'sell' ? h('p', { class: 'small' }, state.inParty('princess') ? 'Princess is charming the shopkeeper. You get 20% more.' : 'Crops sell well. Treats go for half what they cost.') : null,
        tab === 'fish' ? h('p', { class: 'small' }, 'Spiro pays better for fish than anyone in Melbourne. Catch them at Edwardes Lake, Edgars Creek or right here in Kororoit Creek.') : null,
        tab === 'fish' && !rows.length ? h('p', { class: 'center' }, '"No fish? Come back when you\'ve had a cast, mate."') : null,
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
