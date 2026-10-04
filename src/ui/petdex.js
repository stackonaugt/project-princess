// The Petdex: every pet, where to find them, and how close you are.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { PETS } from '../data/pets.js';
import { TYPES, weaknessesOf } from '../data/types.js';
import { MOVES, PET_MOVES } from '../data/moves.js';
import { petLevel, petFighter, xpToNext } from '../systems/battle.js';
import { ITEMS } from '../data/items.js';
import { REGIONS, REGION_ORDER } from '../data/regions.js';
import { MAX_HEARTS } from '../config.js';
import { petIcon, petPortrait, hasPhoto, itemIcon } from './images.js';
import { sfx } from '../systems/sfx.js';

let tab = 'all';

export function openPetdex(panel, close) {
  renderList(panel, close);
}

const typeBadge = type => h('span', { class: 'type', style: { background: TYPES[type].colour } }, TYPES[type].name);
const hearts = n => h('span', { class: 'hearts', 'aria-label': `${n} of ${MAX_HEARTS} hearts` },
  ...Array.from({ length: MAX_HEARTS }, (_, i) => h('i', { class: i < n ? 'on' : '' })));

function header(panel, close, title, back) {
  return h('div', { class: 'm-head' },
    back ? h('button', { class: 'wood-btn small', onclick: back }, '◀ Back') : null,
    h('h2', {}, title),
    h('button', { class: 'wood-btn small', onclick: close, 'aria-label': 'Close' }, 'Close'));
}

function renderList(panel, close) {
  const found = state.foundCount(), total = PETS.length;
  const totalHearts = PETS.reduce((s, p) => s + (state.isFound(p.id) ? state.hearts(p.id) : 0), 0);
  const tabs = h('div', { class: 'tabs', role: 'tablist' },
    ...['all', ...REGION_ORDER].map(id => h('button', {
      class: 'tab' + (tab === id ? ' on' : ''), role: 'tab', 'aria-selected': tab === id,
      onclick: () => { tab = id; sfx.select(); renderList(panel, close); },
    }, id === 'all' ? 'All' : REGIONS[id].name)));
  const pets = PETS.filter(p => tab === 'all' || p.region === tab);
  const grid = h('div', { class: 'dex-grid' }, ...pets.map((p, idx) => {
    const known = state.isFound(p.id);
    return h('button', { class: 'card' + (known ? '' : ' unknown'), onclick: () => { sfx.select(); renderDetail(panel, close, p); } },
      h('span', { class: 'thumb' }, h('img', { class: 'pix', src: petIcon(p.id), alt: '' })),
      h('div', { class: 'card-info' },
        h('div', { class: 'card-top' }, h('span', { class: 'num' }, `#${String(PETS.indexOf(p) + 1).padStart(3, '0')}`), known ? typeBadge(p.type) : null),
        h('h3', {}, known ? p.name : '???'),
        h('p', { class: 'meta' }, known ? p.species : `Somewhere in ${REGIONS[p.region].name}`),
        known ? hearts(state.hearts(p.id)) : h('p', { class: 'meta' }, 'Not found yet')));
  }));
  const pct = Math.round(found / total * 100);
  panel.replaceChildren(
    header(panel, close, 'Petdex'),
    h('div', { class: 'dex-sum' },
      h('div', { class: 'bar' }, h('span', { style: { width: pct + '%' } })),
      h('p', {}, found === total ? `All ${total} pets found. Absolute legend.` : `${found} of ${total} pets found · ${totalHearts} hearts earned`)),
    tabs, h('div', { class: 'm-scroll' }, grid));
}

function renderDetail(panel, close, p) {
  const back = () => { sfx.select(); renderList(panel, close); };
  const known = state.isFound(p.id);
  if (!known) {
    panel.replaceChildren(header(panel, close, '???', back), h('div', { class: 'm-scroll detail' },
      h('div', { class: 'portrait unknown' }, h('img', { class: 'pix', src: petIcon(p.id, 128), alt: 'Unknown pet' })),
      h('p', { class: 'center' }, h('b', {}, `#${String(PETS.indexOf(p) + 1).padStart(3, '0')}`)),
      h('p', { class: 'meta center' }, `Lives somewhere in ${REGIONS[p.region].name}.`),
      h('div', { class: 'note' }, h('h4', {}, 'Rumour'), h('p', {}, p.clue))));
    return;
  }
  const rec = state.pet(p.id), hc = state.hearts(p.id);
  const pref = (list, kind) => h('div', { class: 'prefs' }, h('span', { class: 'lbl' }, kind),
    ...(list.length ? list.map(id => rec.reactions[id]
      ? h('span', { class: 'pref' }, h('img', { src: itemIcon(id), alt: '' }), ITEMS[id].name)
      : h('span', { class: 'pref unknown' }, '?')) : [h('span', { class: 'pref none' }, 'Nothing!')]));
  const statBar = (label, v) => h('div', { class: 'stat' }, h('span', {}, label), h('div', { class: 'bar' }, h('span', { style: { width: v + '%' } })), h('b', {}, v));
  const photo = hasPhoto(p.id);
  panel.replaceChildren(
    header(panel, close, p.name, back),
    h('div', { class: 'm-scroll detail' },
      h('div', { class: 'detail-top' },
        h('div', { class: 'portrait' + (photo ? ' photo' : '') }, h('img', { class: photo ? '' : 'pix', src: petPortrait(p.id), alt: p.name })),
        h('div', {},
          h('div', { class: 'card-top' }, h('span', { class: 'num' }, `#${String(PETS.indexOf(p) + 1).padStart(3, '0')}`), typeBadge(p.type)),
          h('p', { class: 'meta' }, `${p.species} from ${REGIONS[p.region].name}`),
          h('p', { class: 'meta' }, `Lives with ${p.owner}`),
          hearts(hc),
          h('p', { class: 'meta small' }, `First met on day ${rec.day}. Chats: ${rec.chats}.`))),
      h('p', { class: 'bio' }, p.bio),
      h('div', { class: 'note' }, h('h4', {}, 'Favourite spot'), h('p', {}, p.favouriteSpot)),
      hc >= 2 ? h('div', { class: 'note' }, h('h4', {}, 'Fun fact'), h('p', {}, p.funFact))
        : h('div', { class: 'note locked' }, h('h4', {}, 'Fun fact'), h('p', {}, 'Reach 2 hearts to unlock.')),
      h('div', { class: 'note' }, h('h4', {}, 'Treats'), pref(p.loves, 'Loves'), pref(p.likes, 'Likes'), pref(p.dislikes, 'Dislikes'),
        h('p', { class: 'small' }, 'Give treats to discover what they like. One treat per pet per day.')),
      battleNote(p, statBar),
      h('div', { class: 'note' }, h('h4', {}, `${TYPES[p.type].name} type`), h('p', {}, TYPES[p.type].blurb),
        h('p', { class: 'small' }, `Strong against: ${TYPES[p.type].strong.map(t => TYPES[t].name).join(', ')}.`),
        h('p', { class: 'small' }, `Watch out for: ${weaknessesOf(p.type).map(t => TYPES[t].name).join(', ')}.`))));
}

function battleNote(p, statBar) {
  const f = petFighter(p.id), rec = state.pet(p.id);
  const hp = rec.hp === 0 ? 'Resting at home' : `${f.hp} / ${f.maxHp} HP`;
  return h('div', { class: 'note battle' }, h('h4', {}, `Level ${petLevel(p.id)} `, h('small', {}, `${hp} · ${rec.xp || 0} / ${xpToNext(petLevel(p.id))} XP`)),
    statBar('HP', p.stats.hp), statBar('Attack', p.stats.attack), statBar('Defence', p.stats.defence), statBar('Speed', p.stats.speed), statBar('Special', p.stats.special),
    h('h4', { style: { marginTop: '8px' } }, 'Moves'),
    ...PET_MOVES[p.id].map(id => {
      const m = MOVES[id];
      return h('div', { class: 'move-row' }, h('span', {}, m.name), h('span', { class: 'type', style: { background: TYPES[m.type].colour } }, TYPES[m.type].name), h('small', {}, m.power ? `Power ${m.power}` : 'Special'));
    }));
}
