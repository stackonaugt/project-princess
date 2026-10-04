// Map app: the whole route as a train-line diagram, suburb by suburb.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { ZONES, SUBURBS, ROUTE } from '../data/regions.js';

export function openMap(panel, close) {
  const here = state.data.region, groups = [];
  for (const id of ROUTE) {
    const sub = ZONES[id].suburb;
    if (!groups.length || groups[groups.length - 1].sub !== sub) groups.push({ sub, zones: [] });
    groups[groups.length - 1].zones.push(id);
  }
  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Map'), h('button', { class: 'wood-btn small', onclick: close }, 'Back')),
    h('p', { class: 'dex-sum' }, 'Walk the whole way, or tap your myki at a station to skip ahead.'),
    h('div', { class: 'm-scroll' }, h('ol', { class: 'route' }, ...groups.map(g => {
      const S = SUBURBS[g.sub], seen = state.suburbVisited(g.sub);
      return h('li', { class: 'route-suburb' + (S.between ? ' between' : '') },
        h('h4', {}, seen ? S.name : '???', S.station ? h('span', { class: 'train', title: 'Train station' }, ' 🚆') : null),
        h('ul', {}, ...g.zones.map(z => {
          const visited = state.data.visited.includes(z);
          return h('li', { class: 'stop' + (visited ? ' seen' : '') + (z === here ? ' here' : '') },
            h('i', { class: 'dot' }), h('span', {}, visited ? ZONES[z].name : '???'), z === here ? h('b', { class: 'you' }, 'You are here') : null);
        })));
    }))));
}
