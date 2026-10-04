// Friends app: the townsfolk you've met and how close you are.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { NPCS } from '../data/npcs.js';
import { ITEMS } from '../data/items.js';
import { friendInfo, ASSIST_HEARTS } from '../data/friends.js';
import { MAX_HEARTS } from '../config.js';
import { npcIcon, itemIcon } from './images.js';

const hearts = n => h('span', { class: 'hearts' }, ...Array.from({ length: MAX_HEARTS }, (_, i) => h('i', { class: i < n ? 'on' : '' })));

export function openFriends(panel, close) {
  const met = Object.keys(NPCS).filter(id => state.data.friends[id]?.met)
    .sort((a, b) => state.friendHearts(b) - state.friendHearts(a));
  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Friends'), h('button', { class: 'wood-btn small', onclick: close }, 'Back')),
    h('p', { class: 'dex-sum' }, met.length ? 'Chat every day and bring gifts. Good friends will help you out in battles.' : 'Nobody yet. Say hello to people around town!'),
    h('div', { class: 'm-scroll' }, h('div', { class: 'dex-grid' }, ...met.map(id => {
      const n = NPCS[id], f = state.friend(id), hc = state.friendHearts(id), info = friendInfo(id);
      const loves = info.loves.filter(i => f.reactions[i] === 'love');
      return h('div', { class: 'card friend-card' },
        h('span', { class: 'thumb' }, h('img', { class: 'pix', src: npcIcon(id), alt: '' })),
        h('div', { class: 'card-info' },
          h('h3', {}, n.name), h('p', { class: 'meta' }, n.role), hearts(hc),
          h('p', { class: 'meta small' }, loves.length ? h('span', {}, 'Loves: ', ...loves.map(i => h('img', { class: 'pix inline-icon', src: itemIcon(i, 20), alt: ITEMS[i].name, title: ITEMS[i].name }))) : 'Loves: ?'),
          hc >= ASSIST_HEARTS && info.assist ? h('p', { class: 'meta small assist' }, 'Can help in battles') : null));
    }))));
}
