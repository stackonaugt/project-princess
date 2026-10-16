// The bag: treats you're carrying, and who you know loves them.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { ITEMS, isTreat } from '../data/items.js';
import { PETS } from '../data/pets.js';
import { itemIcon, petIcon } from './images.js';
import { GEAR, GEAR_ORDER } from '../data/gear.js';
import { UPGRADES } from '../data/upgrades.js';
import { EQUIPMENT_SLOTS } from '../data/fishing.js';
import { bestRod, fishingLevel } from '../systems/angler.js';
import { form } from '../systems/forms.js';
import { givePhoneTreat, phoneTreatPets, isHealingTreat } from '../systems/pet-care.js';
import { petFighter } from '../systems/battle.js';
import { sfx } from '../systems/sfx.js';

// Bag tabs, like the shops: each item lands in the first tab that fits.
const KINDS = [
  ['treats', 'Treats', (it, id) => isTreat(id) && !it.fish && !it.crop],
  ['fish', 'Fishing', it => it.fish || it.junk || it.bait],   // bait lives with the fish, not the garden
  ['crops', 'Crops', it => it.crop],
  ['presents', 'Presents', it => it.gift || it.drink || it.lolly || it.vape || it.book],
  ['garden', 'Garden', it => it.farm],
  ['party', 'Party', it => it.deco],
  ['special', 'Special', () => true],
];
const kindOf = id => KINDS.find(([, , test]) => test(ITEMS[id], id))[0];
let tab = 'treats';

export function openBag(panel, close) {
  let selected = null, careMessage = null;
  const render = () => {
    const all = state.bagItems(), have = new Set(all.map(kindOf));
    const tabs = [...KINDS.filter(([k]) => have.has(k)).map(([k, label]) => [k, label]), ['gear', 'Equipment']];
    if (!tabs.some(([k]) => k === tab)) tab = tabs[0][0];
    const items = all.filter(id => kindOf(id) === tab);
    if (!items.includes(selected)) selected = items[0] || null;
    const detail = tab === 'gear' ? null : selected ? (() => {
      const fans = PETS.filter(p => state.isFound(p.id) && state.pet(p.id).reactions[selected] === 'love').map(p => p.name);
      return h('div', { class: 'note bag-detail' },
        h('div', { class: 'gear-row' }, h('img', { class: 'pix', src: itemIcon(selected, 48), alt: '', width: 40, height: 40 }), h('h4', {}, `${ITEMS[selected].name} ×${state.count(selected)}`)),
        h('p', {}, ITEMS[selected].desc),
        careMessage ? h('p', { role: 'status', class: 'small' }, careMessage) : null,
        isHealingTreat(selected) && state.foundCount() ? h('div', { style: { maxHeight: '160px', overflowY: 'auto' } },
          h('p', { class: 'small' }, phoneTreatPets().length ? 'Give this treat to someone on your team:' : 'Treats are for the pets on your team. Pick a team at the front door.'),
          ...phoneTreatPets().map(id => {
            const f = petFighter(id), full = f.hp >= f.maxHp;
            return h('button', { class: 'wood-btn small gear-pet', disabled: full, onclick: () => {
              const result = givePhoneTreat(id, selected); careMessage = result.reason;
              if (result.ok) sfx.pickup(); render();
            } }, h('img', { class: 'pix', src: petIcon(id, 24), alt: '', width: 24, height: 24 }), `${f.name} · ${f.hp}/${f.maxHp}${full ? ' (full)' : ''}`);
          })) : null,
        h('p', { class: 'small' }, fans.length ? `Loved by ${fans.join(' and ')}.` : ITEMS[selected].drink || ITEMS[selected].gift ? 'A present for a friend. Not for pets.' : ITEMS[selected].bait ? 'For fishing. Every cast uses one.' : ITEMS[selected].farm ? 'For the garden. Use it when you water a bed.' : ITEMS[selected].trophy ? 'A trophy. With the trophy cabinet (Bunnings, House tab) it goes on show at home.' : ITEMS[selected].story || ITEMS[selected].deco ? 'Hang on to this. You will know when you need it.' : 'Give it to a pet to see how they feel about it.'));
    })() : h('div', { class: 'note bag-detail' }, h('p', {}, all.length ? 'Tap an item to look at it.' : 'Your bag is empty. Look for treats around town, and chat to people. Some of them are very generous.'));
    panel.replaceChildren(
      h('div', { class: 'm-head' }, h('h2', {}, 'Bag'), h('button', { class: 'wood-btn small', onclick: close }, 'Close')),
      h('div', { class: 'tabs' }, ...tabs.map(([k, label]) => h('button', { class: 'tab' + (tab === k ? ' on' : ''), onclick: () => { tab = k; sfx.select(); render(); } }, label))),
      detail || "",
      h('div', { class: 'm-scroll' },
        tab === 'gear' ? [equipmentNote(), gearNote(render)] : h('div', { class: 'bag-grid' }, ...items.map(id => h('button', {
          class: 'slot' + (id === selected ? ' on' : ''), 'aria-label': ITEMS[id].name,
          onclick: () => { selected = id; careMessage = null; sfx.select(); render(); },
        }, h('img', { class: 'pix', src: itemIcon(id, 48), alt: '' }), h('b', {}, state.count(id))))),
        tab === 'gear' ? null : h('p', { class: 'small center' }, 'Choose a food treat above to restore a pet’s energy. Toys are given in person. Drinks and presents are for your friends around town.')));
  };
  render();
}

// Equipment you own, by slot (data/fishing.js EQUIPMENT_SLOTS): anything with
// `equipment: '<slot>'`, whether it is an item in the bag or a rod bought from
// Bazza (UPGRADES). The best rod is the one in use. Pet gear follows below.
function equipmentNote() {
  const rows = {};
  const add = (slot, row) => (rows[slot] ||= []).push(row);
  const inUse = bestRod();
  for (const [id, u] of Object.entries(UPGRADES)) if (u.equipment && state.hasUpgrade(id)) add(u.equipment, { id, name: u.name, desc: u.desc, note: id === inUse ? 'In use' : 'Spare' });
  for (const [id, it] of Object.entries(ITEMS)) if (it.equipment && state.count(id) > 0) add(it.equipment, { id, name: it.name, desc: it.desc, note: it.equipment === 'tackle' ? 'Working from your bag' : state.count(id) > 1 ? `×${state.count(id)}` : 'Yours' });
  const slots = Object.keys(EQUIPMENT_SLOTS).filter(k => rows[k]);
  return h('div', { class: 'note' }, h('h4', {}, 'Equipment'),
    h('p', { class: 'small' }, `Fishing level ${fishingLevel()}. ${slots.length ? '' : 'No equipment yet. Bazza at Anaconda in Preston sells fishing rods; the shed at home makes things to wear.'}`),
    ...slots.map(k => h('div', {}, h('b', {}, EQUIPMENT_SLOTS[k]),
      ...rows[k].map(r => h('div', { class: 'gear-row' },
        h('img', { class: 'pix', src: itemIcon(r.id, 32), alt: '', width: 24, height: 24 }),
        h('b', {}, r.name), h('span', { class: 'small' }, `${r.note}. ${r.desc}`))))));
}

// Gear you own, and who is wearing what.
function gearNote(render) {
  const owned = GEAR_ORDER.filter(id => state.gearCount(id));
  const pets = state.foundIds();
  const wearing = pets.filter(id => state.pet(id).gear);
  if (!owned.length && !wearing.length) return h('div', { class: 'note' }, h('h4', {}, 'Pet gear'), h('p', { class: 'small' }, 'No gear yet. Romey\'s pet shop on Hope St, Brunswick sells leads, collars and more.'));
  return h('div', { class: 'note' }, h('h4', {}, 'Pet gear'),
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
