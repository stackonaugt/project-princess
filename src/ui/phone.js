// The Pawphone: the game's menu, as a little phone with apps. Apps open
// their own screens; closing an app comes back here (see ui.closeModal).
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { timeLabel } from '../systems/clock.js';
import { petIcon, itemIcon, npcIcon } from './images.js';
import { sfx } from '../systems/sfx.js';
import { cheatsOn } from './cheats.js';

const APPS = [
  { id: 'story', label: 'Story', colour: '#d8862a', glyph: '📖' },
  { id: 'dex', label: 'Petdex', colour: '#e2506a', icon: () => petIcon('princess', 48) },
  { id: 'bag', label: 'Bag', colour: '#c8823a', icon: () => itemIcon('chicken', 48) },
  { id: 'friends', label: 'Friends', colour: '#3fa38f', icon: () => npcIcon('trish') },
  { id: 'map', label: 'Map', colour: '#2f6aa3', glyph: '🗺' },
  { id: 'garden', label: 'Garden', colour: '#5a9a38', icon: () => itemIcon('carrot', 48) },
  { id: 'calendar', label: 'Calendar', colour: '#7a4ab0', glyph: '📅' },
  { id: 'requests', label: 'Requests', colour: '#e8a030', glyph: '📌' },
  { id: 'menu', label: 'Settings', colour: '#6a6e78', glyph: '⚙' },
  { id: 'cheats', label: 'Cheats', colour: '#c8302a', glyph: '🛠', cheat: true },
];

export function openPhone(panel, close, openApp) {
  const d = state.data;
  panel.replaceChildren(
    h('div', { class: 'phone' },
      h('div', { class: 'phone-bar' }, h('span', {}, timeLabel(d.minutes)), h('b', {}, 'Pawphone'), h('span', {}, `Day ${d.day} · $${d.money}`)),
      h('div', { class: 'phone-screen' },
        h('div', { class: 'phone-apps' }, ...APPS.filter(a => !a.cheat || cheatsOn()).map(a => h('button', {
          class: 'app', onclick: () => { sfx.select(); openApp(a.id); },
        }, h('span', { class: 'app-icon', style: { background: a.colour } }, a.icon ? h('img', { class: 'pix', src: a.icon(), alt: '' }) : h('span', { class: 'glyph' }, a.glyph)), h('span', { class: 'app-label' }, a.label))))),
      h('button', { class: 'phone-home', onclick: close, 'aria-label': 'Close the phone' })));
  panel.querySelector('.app')?.focus();
}
