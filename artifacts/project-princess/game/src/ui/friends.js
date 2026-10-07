// Friends app: the townsfolk you've met, like a feed of profiles, with a tab
// for each suburb where people usually hang out.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { NPCS } from '../data/npcs.js';
import { ITEMS } from '../data/items.js';
import { friendInfo, ASSIST_HEARTS } from '../data/friends.js';
import { ZONES, SUBURBS, npcZone } from '../data/regions.js';
import { MAX_HEARTS } from '../config.js';
import { npcIcon, itemIcon } from './images.js';
import { sfx } from '../systems/sfx.js';

let tab = 'all';
const suburbOf = id => ZONES[npcZone(id)]?.suburb || 'other';

export function openFriends(panel, close) {
  const met = Object.keys(NPCS).filter(id => state.data.friends[id]?.met)
    .sort((a, b) => state.friendHearts(b) - state.friendHearts(a));
  const subs = [...new Set(met.map(suburbOf))];
  if (tab !== 'all' && !subs.includes(tab)) tab = 'all';
  const shown = met.filter(id => tab === 'all' || suburbOf(id) === tab);
  const tabBtn = (id, label) => h('button', { class: 'tab' + (tab === id ? ' on' : ''), onclick: () => { tab = id; sfx.select(); openFriends(panel, close); } }, label);
  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Friendsgram'), h('button', { class: 'wood-btn small', onclick: close }, 'Back')),
    h('div', { class: 'insta-stats' }, h('div', {}, h('b', {}, met.length), h('span', {}, 'friends')), h('div', {}, h('b', {}, met.reduce((n, id) => n + state.friendHearts(id), 0)), h('span', {}, 'hearts')), h('div', {}, h('b', {}, met.filter(id => state.friendHearts(id) >= ASSIST_HEARTS).length), h('span', {}, 'besties'))),
    h('div', { class: 'tabs' }, tabBtn('all', 'All'), ...subs.map(s => tabBtn(s, SUBURBS[s]?.name || 'Around town'))),
    h('div', { class: 'm-scroll' }, met.length ? null : h('p', { class: 'center' }, 'Nobody yet. Say hello to people around town!'),
      ...shown.map(id => {
        const n = NPCS[id], f = state.friend(id), hc = state.friendHearts(id), info = friendInfo(id);
        const loves = info.loves.filter(i => f.reactions[i] === 'love');
        return h('div', { class: 'insta-post' },
          h('div', { class: 'insta-head' }, h('span', { class: 'insta-ring' }, h('img', { class: 'pix', src: npcIcon(id), alt: '' })),
            h('div', {}, h('b', {}, n.name), h('p', { class: 'meta small' }, ZONES[npcZone(id)]?.name || 'Around town'))),
          h('p', { class: 'small' }, n.role || ''),
          h('div', { class: 'insta-foot' }, h('span', { class: 'insta-likes' }, '♥ '.repeat(hc).trim() || '♡', h('small', {}, ` ${hc}/${MAX_HEARTS}`)),
            loves.length ? h('span', { class: 'small' }, 'Loves ', ...loves.map(i => h('img', { class: 'pix inline-icon', src: itemIcon(i, 20), alt: ITEMS[i].name, title: ITEMS[i].name }))) : h('span', { class: 'small meta' }, 'Loves: ?')),
          hc >= ASSIST_HEARTS && info.assist ? h('p', { class: 'small assist' }, '#bestie · helps in battles') : null);
      })));
}
