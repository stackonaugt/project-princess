// The Requests app: what townsfolk are after today (data/requests.js).
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { ITEMS } from '../data/items.js';
import { NPCS } from '../data/npcs.js';
import { ZONES, npcZone } from '../data/regions.js';
import { itemIcon, npcIcon } from './images.js';

export function openRequests(panel, close) {
  const reqs = state.todaysRequests();
  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Requests'), h('button', { class: 'wood-btn small', onclick: close }, 'Close')),
    h('p', { class: 'dex-sum' }, 'New requests every morning. Give the person what they asked for as their gift for the day.'),
    h('div', { class: 'm-scroll' }, ...reqs.map(q => h('div', { class: 'friend-card note' },
      h('div', { class: 'gear-row' },
        h('img', { class: 'pix', src: npcIcon(q.who), alt: '', width: 32, height: 32 }),
        h('div', {}, h('b', {}, NPCS[q.who].name), h('p', { class: 'small' }, q.text),
          h('p', { class: 'meta small' }, q.done ? 'Done ✓' : `Reward: $${q.money} and extra friendship. Usually at ${ZONES[npcZone(q.who)]?.name || 'around town'}. You have ${state.count(q.item)}.`)),
        h('img', { class: 'pix', src: itemIcon(q.item, 32), alt: ITEMS[q.item].name, width: 32, height: 32 })))),
      reqs.length ? null : h('p', { class: 'center' }, 'No requests today. Make some friends around town first.')));
}
