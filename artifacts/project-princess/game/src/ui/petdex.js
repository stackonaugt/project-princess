// The Petdex: every pet, where to find them, and how close you are.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { PETS } from '../data/pets.js';
import { isArchived } from '../authoring/archive.js';
import { TYPES, typeList, typeName, effectiveness } from '../data/types.js';
import { form, evolutionHint, isEvolved, canEvolve } from '../systems/forms.js';
import { GEAR } from '../data/gear.js';
import { MOVES, PET_MOVES } from '../data/moves.js';
import { petLevel, petFighter, xpToNext } from '../systems/battle.js';
import { ITEMS } from '../data/items.js';
import { REGIONS, REGION_ORDER } from '../data/regions.js';
import { MAX_HEARTS } from '../config.js';
import { petIcon, petPortrait, hasPhoto, itemIcon } from './images.js';
import { sfx } from '../systems/sfx.js';

let tab = 'all', detailTab = 'stats';

export function openPetdex(panel, close) {
  renderList(panel, close);
}

const typeBadge = type => typeList(type).map(t => h('span', { class: 'type', style: { background: TYPES[t].colour } }, TYPES[t].name));
const hearts = n => h('span', { class: 'hearts', 'aria-label': `${n} of ${MAX_HEARTS} hearts` },
  ...Array.from({ length: MAX_HEARTS }, (_, i) => h('i', { class: i < n ? 'on' : '' })));

function header(panel, close, title, back) {
  return h('div', { class: 'm-head' },
    back ? h('button', { class: 'wood-btn small', onclick: back }, '◀ Back') : null,
    h('h2', {}, title),
    h('button', { class: 'wood-btn small', onclick: close, 'aria-label': 'Close' }, 'Close'));
}

function renderList(panel, close) {
  const visible = state.visiblePets();
  if (tab !== 'all' && tab !== 'matchups' && !visible.some(p => p.region === tab)) tab = 'all';
  const found = state.foundCount(), total = visible.length;
  const totalHearts = PETS.reduce((s, p) => s + (state.isFound(p.id) ? state.hearts(p.id) : 0), 0);
  const tabs = h('div', { class: 'tabs', role: 'tablist' },
    ...['all', ...REGION_ORDER.filter(r => visible.some(p => p.region === r))].map(id => h('button', {
      class: 'tab' + (tab === id ? ' on' : ''), role: 'tab', 'aria-selected': tab === id,
      onclick: () => { tab = id; sfx.select(); renderList(panel, close); },
    }, id === 'all' ? 'All' : REGIONS[id].name)),
    h('button', { class: 'tab' + (tab === 'matchups' ? ' on' : ''), role: 'tab', 'aria-selected': tab === 'matchups', onclick: () => { tab = 'matchups'; sfx.select(); renderList(panel, close); } }, 'Matchups'));
  const pets = visible.filter(p => tab === 'all' || p.region === tab);
  const grid = h('div', { class: 'dex-grid' }, ...pets.map((p, idx) => {
    const known = state.isFound(p.id);
    return h('button', { class: 'card' + (known ? '' : ' unknown'), onclick: () => { sfx.select(); renderDetail(panel, close, p); } },
      h('span', { class: 'thumb' }, h('img', { class: 'pix', src: petIcon(p.id), alt: '' })),
      h('div', { class: 'card-info' },
        h('div', { class: 'card-top' }, h('span', { class: 'num' }, `#${String(PETS.indexOf(p) + 1).padStart(3, '0')}`), known ? typeBadge(form(p.id).type) : null),
        h('h3', {}, known ? form(p.id).name : '???'),
        isArchived('pets', p.id) ? h('p', { class: 'meta' }, 'Archived · still yours') : null,
        h('p', { class: 'meta' }, known ? form(p.id).species : `Somewhere in ${REGIONS[p.region].name}`),
        known ? hearts(state.hearts(p.id)) : h('p', { class: 'meta' }, 'Not found yet')));
  }));
  const pct = Math.round(found / total * 100);
  panel.replaceChildren(
    header(panel, close, 'Petdex'),
    h('div', { class: 'dex-sum' },
      h('div', { class: 'bar' }, h('span', { style: { width: pct + '%' } })),
      h('p', {}, found === total ? `All ${total} pets found. Absolute legend.` : `${found} of ${total} pets found · ${totalHearts} hearts earned`)),
    tabs, h('div', { class: 'm-scroll' }, tab === 'matchups' ? matchupsNote() : grid));
}

// Every strong and weak matchup you have tried in battle, by attacking type.
function matchupsNote() {
  const seen = state.data.matchups.map(k => k.split('>')).filter(([a, d]) => TYPES[a] && TYPES[d]);
  const badge = t => h('span', { class: 'type', style: { background: TYPES[t].colour } }, TYPES[t].name);
  const rows = Object.keys(TYPES).map(a => {
    const strong = seen.filter(([x, d]) => x === a && effectiveness(a, d) > 1).map(([, d]) => d);
    const weak = seen.filter(([x, d]) => x === a && effectiveness(a, d) < 1).map(([, d]) => d);
    if (!strong.length && !weak.length) return null;
    return h('div', { class: 'note' }, h('h4', {}, badge(a), ' moves'),
      strong.length ? h('p', { class: 'small' }, 'Strong against: ', ...strong.map(badge)) : null,
      weak.length ? h('p', { class: 'small' }, 'Weak against: ', ...weak.map(badge)) : null);
  }).filter(Boolean);
  return h('div', {}, h('p', { class: 'small center' }, 'Matchups you have found in battle. Try a move on a new type to learn more.'),
    ...(rows.length ? rows : [h('p', { class: 'center' }, 'Nothing yet. A move that is super effective (or barely tickles) gets written down here.')]));
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
  const rec = state.pet(p.id), hc = state.hearts(p.id), f = form(p.id);
  const pref = (list, kind) => h('div', { class: 'prefs' }, h('span', { class: 'lbl' }, kind),
    ...(list.length ? list.map(id => rec.reactions[id]
      ? h('span', { class: 'pref' }, h('img', { src: itemIcon(id), alt: '' }), ITEMS[id].name)
      : h('span', { class: 'pref unknown' }, '?')) : [h('span', { class: 'pref none' }, 'Nothing!')]));
  const statBar = (label, v) => h('div', { class: 'stat' }, h('span', {}, label), h('div', { class: 'bar' }, h('span', { style: { width: Math.min(100, v) + '%' } })), h('b', {}, v));
  const photo = hasPhoto(p.id);
  const evo = isEvolved(p.id) || canEvolve(p.id) ? evolutionHint(p.id) : null;
  const tabs = { stats: 'Stats', moves: 'Moves', prefs: 'Preferences' };
  const content = detailTab === 'stats' ? battleNote(p, f, statBar)
    : detailTab === 'moves' ? movesNote(f)
    : h('div', {},
      h('div', { class: 'note' }, h('h4', {}, 'Treats'), pref(p.loves, 'Loves'), pref(p.likes, 'Likes'), pref(p.dislikes, 'Dislikes'),
        h('p', { class: 'small' }, 'Give treats to discover what they like. One treat per pet per day.')),
      h('div', { class: 'note' }, h('h4', {}, 'Favourite spot'), h('p', {}, p.favouriteSpot)),
      hc >= 2 ? h('div', { class: 'note' }, h('h4', {}, 'Fun fact'), h('p', {}, p.funFact))
        : h('div', { class: 'note locked' }, h('h4', {}, 'Fun fact'), h('p', {}, 'Reach 2 hearts to unlock.')));
  panel.replaceChildren(
    header(panel, close, f.name, back),
    h('div', { class: 'm-scroll detail' },
      h('div', { class: 'detail-top' },
        h('div', { class: 'portrait' + (photo ? ' photo' : '') }, h('img', { class: photo ? '' : 'pix', src: petPortrait(p.id), alt: f.name })),
        h('div', {},
          h('div', { class: 'card-top' }, h('span', { class: 'num' }, `#${String(PETS.indexOf(p) + 1).padStart(3, '0')}`), typeBadge(f.type)),
          h('p', { class: 'meta' }, `${f.species} from ${REGIONS[p.region].name}`),
          h('p', { class: 'meta' }, `Lives with ${p.owner}`),
          hearts(hc),
          h('p', { class: 'meta small' }, `First met on day ${rec.day}. Chats: ${rec.chats}.`))),
      h('p', { class: 'bio' }, f.bio),
      evo ? h('div', { class: 'note' }, h('h4', {}, 'Evolution'), h('p', {}, evo)) : null,
      h('div', { class: 'tabs dex-tabs' }, ...Object.entries(tabs).map(([id, label]) => h('button', { class: 'tab' + (detailTab === id ? ' on' : ''), onclick: () => { detailTab = id; sfx.select(); renderDetail(panel, close, p); } }, label))),
      content));
}

// Moves, and the type matchups you've actually seen in battle.
function movesNote(f) {
  const seen = state.data.matchups, mine = typeList(f.type);
  const strong = [...new Set(seen.filter(k => mine.includes(k.split('>')[0]) && effectiveness(...k.split('>')) > 1).map(k => k.split('>')[1]))];
  const weak = [...new Set(seen.filter(k => mine.includes(k.split('>')[1]) && effectiveness(...k.split('>')) > 1).map(k => k.split('>')[0]))];
  const list = ts => ts.length ? ts.map(t => TYPES[t].name).join(', ') : '??? (battle to find out)';
  return h('div', {},
    h('div', { class: 'note' }, h('h4', {}, 'Moves'), ...f.moves.map(id => {
      const m = MOVES[id];
      const hits = [...new Set(seen.filter(k => k.startsWith(m.type + '>') && effectiveness(...k.split('>')) > 1).map(k => TYPES[k.split('>')[1]].name))];
      return h('div', {}, h('div', { class: 'move-row' }, h('span', {}, m.name), h('span', { class: 'type', style: { background: TYPES[m.type].colour } }, TYPES[m.type].name), h('small', {}, m.power ? `Power ${m.power}` : 'Special')),
        m.power && hits.length ? h('p', { class: 'small meta' }, `Super effective on ${hits.join(', ')}`) : null);
    })),
    h('div', { class: 'note' }, h('h4', {}, `${typeName(f.type)} type`), ...mine.map(t => h('p', { class: 'small' }, TYPES[t].blurb)),
      h('p', { class: 'small' }, `Strong against: ${list(strong)}`),
      h('p', { class: 'small' }, `Watch out for: ${list(weak)}`)));
}

function battleNote(p, d, statBar) {
  const f = petFighter(p.id), rec = state.pet(p.id);
  const hp = rec.hp === 0 ? 'Resting at home' : `${f.hp} / ${f.maxHp} HP`;
  return h('div', { class: 'note battle' }, h('h4', {}, `Level ${petLevel(p.id)} `, h('small', {}, `${hp} · ${rec.xp || 0} / ${xpToNext(petLevel(p.id))} XP`)),
    statBar('HP', d.stats.hp), statBar('Attack', d.stats.attack), statBar('Defence', d.stats.defence), statBar('Speed', d.stats.speed), statBar('Special', d.stats.special),
    h('p', { class: 'small' }, rec.gear ? `Wearing: ${GEAR[rec.gear].name}. ${GEAR[rec.gear].desc}` : 'No gear. Buy some at the pet shop on Hope St, Brunswick.'));
}
