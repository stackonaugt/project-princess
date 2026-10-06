// Map app: the whole route as a list of stops, like the PTV app, suburb by
// suburb. Trains and trams are marked once you've been somewhere.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { ZONES, SUBURBS, ROUTE, TRAM_ZONES } from '../data/regions.js';

export function openMap(panel, close) {
  const here = state.data.region, groups = [];
  for (const id of ROUTE) {
    const sub = ZONES[id].suburb;
    if (!groups.length || groups[groups.length - 1].sub !== sub) groups.push({ sub, zones: [] });
    groups[groups.length - 1].zones.push(id);
  }
  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Map'), h('button', { class: 'wood-btn small', onclick: close }, 'Back')),
    h('div', { class: 'ptv-key' }, h('span', { class: 'ptv-badge train' }, 'Train'), h('span', { class: 'ptv-badge tram' }, 'Tram'), h('span', {}, 'Walk anywhere, or tap your myki at a station.')),
    h('div', { class: 'm-scroll' }, h('ol', { class: 'route' }, ...groups.map(g => {
      const S = SUBURBS[g.sub], seen = state.suburbVisited(g.sub);
      return h('li', { class: 'route-suburb' + (S.between ? ' between' : '') },
        h('h4', {}, seen ? S.name : '???'),
        h('ul', {}, ...g.zones.map(z => {
          const visited = state.data.visited.includes(z), Z = ZONES[z];
          const train = visited && z === S.station && !S.between, tram = visited && TRAM_ZONES.includes(z);
          return h('li', { class: 'stop' + (visited ? ' seen' : '') + (z === here ? ' here' : '') + (Z.indoor ? ' inside' : '') },
            h('i', { class: 'dot' }), h('span', {}, visited ? Z.name : '???'),
            train ? h('span', { class: 'ptv-badge train' }, 'Train') : null, tram ? h('span', { class: 'ptv-badge tram' }, 'Tram') : null,
            z === here ? h('b', { class: 'you' }, 'You are here') : null);
        })));
    }))));
}
