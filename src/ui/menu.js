// Menu: sound, saving, moving your save between devices, help.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { sfx } from '../systems/sfx.js';
import { bus } from '../bus.js';

export function openMenu(panel, close) {
  const d = state.data;
  const msg = h('p', { class: 'small center', role: 'status' });
  const flash = t => { msg.textContent = t; };
  const codeBox = h('textarea', { class: 'code', rows: 3, placeholder: 'Paste a save code here', 'aria-label': 'Save code' });
  const canFull = document.fullscreenEnabled && !navigator.standalone;

  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Menu'), h('button', { class: 'wood-btn small', onclick: close }, 'Close')),
    h('div', { class: 'm-scroll' },
      h('div', { class: 'note' }, h('h4', {}, 'Settings'),
        h('div', { class: 'row' },
          h('button', { class: 'wood-btn', onclick: e => { d.settings.sound = !d.settings.sound; e.target.textContent = `Sound: ${d.settings.sound ? 'on' : 'off'}`; state.save(); sfx.select(); } }, `Sound: ${d.settings.sound ? 'on' : 'off'}`),
          h('button', { class: 'wood-btn', onclick: () => { close(); setTimeout(() => bus.emit('game:hero'), 50); } }, 'Change character'),
          canFull ? h('button', { class: 'wood-btn', onclick: () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}) }, 'Full screen') : null)),
      h('div', { class: 'note' }, h('h4', {}, 'Saving'),
        h('p', {}, 'Your game saves itself every few seconds on this device.'),
        h('div', { class: 'row' },
          h('button', { class: 'wood-btn', onclick: () => { bus.emit('game:save'); flash('Saved.'); } }, 'Save now'),
          h('button', { class: 'wood-btn', onclick: async () => {
            const code = state.exportCode(); codeBox.value = code; codeBox.select();
            try { await navigator.clipboard.writeText(code); flash('Save code copied. Paste it on your other device.'); } catch (e) { flash('Copy the code above and paste it on your other device.'); }
          } }, 'Copy save code')),
        codeBox,
        h('div', { class: 'row' }, h('button', { class: 'wood-btn', onclick: () => {
          try {
            if (!codeBox.value.trim()) return flash('Paste a save code first.');
            if (!confirm('Load this save? Your current progress on this device will be replaced.')) return;
            state.importCode(codeBox.value); location.reload();
          } catch (e) { flash('That code did not work. Check you copied all of it.'); }
        } }, 'Load save code'))),
      h('div', { class: 'note' }, h('h4', {}, 'How to play'),
        h('ul', { class: 'help' },
          h('li', {}, 'Find every pet in Laverton, Brunswick and Reservoir. Walk up and press A (or Space) to say hello.'),
          h('li', {}, 'Pets you find move into your place on Allen St. When you head out the door, pick up to three to come along. They follow you around.'),
          h('li', {}, 'Chat once a day and give one treat a day to grow your friendship. Find out what each pet loves.'),
          h('li', {}, 'Treats appear around town each morning. Some locals will give you one a day too.'),
          h('li', {}, 'Tap your myki at a green reader to catch the train to a station you have already visited.'),
          h('li', {}, 'Some pets keep odd hours. Try visiting at different times of day.'),
          h('li', {}, 'Phone: drag on the left of the screen to move, push the stick all the way (or hold B) to run, tap A to talk. You can also tap a pet or a spot on the map.'),
          h('li', {}, 'Keyboard: arrows or WASD to move, Shift to run, Space to talk, P for the Petdex, B for the bag, M for this menu.'))),
      h('div', { class: 'note' }, h('h4', {}, 'Your stats'),
        h('p', {}, `Day ${d.day}. ${d.stats.chats} chats, ${d.stats.gifts} treats given, ${d.stats.treats} treats collected.`)),
      h('div', { class: 'row center' }, h('button', { class: 'link-btn', onclick: () => {
        if (!confirm('Start over? Your Petdex, bag and friendships will be cleared.')) return;
        bus.emit('game:reset');
      } }, 'Start over')),
      msg,
      h('p', { class: 'small center credits' }, 'Project Princess. The pets belong to their humans. Made with Phaser.')));
}
