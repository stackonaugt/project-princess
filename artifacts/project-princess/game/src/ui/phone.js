// The Pawphone: the game's menu, as a little phone with apps. Apps open
// their own screens; closing an app comes back here (see ui.closeModal).
import { syncTodo,unreadTodo } from '../systems/todo.js';
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { timeLabel } from '../systems/clock.js';
import { appIcon } from './appicons.js';
import { needsMartyCare } from '../systems/pet-care.js';
import { sfx } from '../systems/sfx.js';
import { cheatsOn } from './cheats.js';

const APPS = [
  { id:'skills',label:'Skills',colour:'#d5b56f',icon:'skills' },
  { id: 'story', label: 'To Do', colour: '#ffffff', icon: 'todo' },
  { id: 'dex', label: 'Petdex', colour: '#e8403a', icon: 'dex' },
  { id: 'bag', label: 'Bag', colour: '#2a68c8', icon: 'bag' },
  { id: 'friends', label: 'Friends', colour: 'linear-gradient(135deg, #a03ac8, #e2306a 50%, #f5c83a)', icon: 'friends' },
  { id: 'map', label: 'Map', colour: '#6a6e78', icon: 'map' },
  { id: 'garden', label: 'Garden', colour: '#4a9a3a', icon: 'garden' },
  { id: 'calendar', label: 'Calendar', colour: '#f4f4f0', icon: 'calendar' },
  { id: 'scorecards', label: 'Scorecards', colour: '#e8d8a4', icon: 'todo' },
  { id: 'menu', label: 'Settings', colour: '#44474f', icon: 'settings' },
  { id: 'cheats', label: 'Cheats', colour: '#3a3a44', icon: 'cheats', cheat: true },
];
export const PHONE_APPS = APPS.map(a => a.id);

// The flip-open animation plays when you get the phone out, not when an app closes.
let flipped = false;
export const phoneClosed = () => { flipped = false; };

export function openPhone(panel, close, openApp) {
  syncTodo(); const count = unreadTodo();
  const d = state.data;
  panel.replaceChildren(
    h('div', { class: 'phone' + (flipped ? '' : ' flip') },
      h('div', { class: 'phone-bar' }, h('span', {}, timeLabel(d.minutes)), h('b', {}, 'Pawphone'), h('span', {}, `Day ${d.day} · $${d.money}`)),
      h('div', { class: 'phone-screen' },
        needsMartyCare() ? h('button', { class: 'wood-btn small', onclick: () => openApp('bag') }, 'Marty could use a treat. Open Bag') : null,
        h('div', { class: 'phone-apps' }, ...APPS.filter(a => !a.cheat || cheatsOn()).map(a => h('button', {
          class: 'app', onclick: () => { sfx.select(); openApp(a.id); },
        }, h('span', { class: 'app-icon', style: { background: a.colour } }, h('img', { class: 'pix', src: appIcon(a.icon), alt: '' })), h('span', { class: 'app-label' }, a.label), a.id === 'story' && count ? h('span', { class:'app-badge', 'aria-label':`${count} unread quests` }, count) : null)))),
      h('div', { class: 'phone-hinge' }),
      h('button', { class: 'phone-home', onclick: close, 'aria-label': 'Close the phone' })));
  flipped = true;
  panel.querySelector('.app')?.focus();
}
