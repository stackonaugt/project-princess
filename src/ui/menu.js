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

  const row = (label, ...right) => h('div', { class: 'set-row' }, h('span', {}, label), ...right);
  const mail = (kind, line) => h('div', { class: 'set-mail' },
    h('a', { class: 'wood-btn', href: `mailto:sebastian@horey.com.au?subject=${encodeURIComponent(`${kind.toUpperCase()}: Project Princess`)}`, target: '_blank', rel: 'noopener' }, kind === 'Bug report' ? 'Report Bug' : 'Feature Request'),
    h('p', { class: 'small' }, line));
  const found = state.foundCount(), friends = Object.values(d.friends).filter(f => f.met).length;

  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Settings'), h('button', { class: 'wood-btn small', onclick: close }, 'Back')),
    h('div', { class: 'm-scroll' },
      h('div', { class: 'set-stats' },
        ...[[d.day, 'days'], [`$${d.money}`, 'money'], [found, 'pets'], [friends, 'friends'], [d.stats.chats, 'chats'], [d.stats.gifts, 'treats given']]
          .map(([v, l]) => h('div', {}, h('b', {}, v), h('span', {}, l)))),
      h('div', { class: 'set-group' },
        row('Sound', h('button', { class: 'set-toggle' + (d.settings.sound ? ' on' : ''), 'aria-pressed': d.settings.sound, onclick: e => { d.settings.sound = !d.settings.sound; e.currentTarget.classList.toggle('on', d.settings.sound); state.save(); sfx.select(); } }, h('i'))),
        row('Character', h('button', { class: 'wood-btn small', onclick: () => { close(); setTimeout(() => bus.emit('game:hero'), 50); } }, 'Change')),
        canFull ? row('Full screen', h('button', { class: 'wood-btn small', onclick: () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}) }, 'Toggle')) : null),
      h('div', { class: 'set-group' }, h('h4', {}, 'Saving'),
        h('p', { class: 'small' }, 'Your game saves itself every few seconds on this device.'),
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
      h('div', { class: 'set-group' }, h('h4', {}, `Save slot ${state.slot || ''}`),
        h('div', { class: 'row' },
          h('button', { class: 'wood-btn', onclick: () => bus.emit('game:title') }, 'Back to title screen'),
          h('button', { class: 'wood-btn danger', onclick: () => {
            if (!confirm('Delete this save slot and start again? Copy your save code first if you want a backup.')) return;
            bus.emit('game:reset');
          } }, 'Delete this slot'))),
      h('div', { class: 'set-group' },
        row('How to play', h('button', { class: 'wood-btn small', onclick: () => { sfx.select(); openHelp(panel, () => openMenu(panel, close)); } }, 'Open ▶'))),
      h('div', { class: 'set-group' },
        mail('Bug report', 'Send Seb an email, preferably with a screenshot, and describe the bug.'),
        mail('Feature request', 'Send Seb an email with your idea. Big or small.')),
      msg,
      h('p', { class: 'small center credits' }, 'Project Princess. The pets belong to their humans. Made with Phaser.')));
}

// How to play: a second screen of sections that open and close.
const HELP = [
  ['Getting started', ['Princess has got out again. Find her on Allen St, then go and meet your friends\' pets.', 'The To Do app on your phone always says what to do next.']],
  ['Moving around', ['Phone: drag on the left of the screen to move, push the stick all the way (or hold B) to run, tap A to talk. You can also tap a spot to walk there.', 'Keyboard: arrows or WASD to move, Shift to run, Space to talk, P for the Petdex, B for the bag, M for your phone.', 'Walk off the edge of a zone at a green sign to go to the next one. Witches hats mean not yet.']],
  ['Getting around town', ['You can walk all the way from Laverton through Altona North, Footscray and Flemington to Brunswick, Coburg, Preston, Reservoir, Carlton and the city.', 'Tap your myki at a station reader to catch the train to any station you have already visited. The Map app shows where trains and trams stop.']],
  ['Pets and treats', ['Walk up to a pet and press A to say hello. Pets you find move into your place on Allen St.', 'When you head out the front door, pick up to three to come along. They follow you around.', 'Chat once a day and give one treat a day to grow your friendship. The Petdex shows what they love.', 'Some pets keep odd hours. Try visiting at different times of day.']],
  ['Battles', ['With a team, wild things jump out of tall grass. Pick moves that suit their type. The Petdex remembers the matchups you have seen.', 'Most pets have owners. Talk to them for a friendly play-fight, and win to befriend their pet. Princess is free.', 'A pet who has had enough runs home. Everyone rests up at home.', 'Some trainers are not friendly. Lose to them, or run away, and they will want money.', 'Pets evolve once they reach a high enough level AND like you enough.']],
  ['Making friends', ['Townsfolk have hearts too. Chat daily and bring gifts. The Friends app shows what you know they love.', 'Good friends sometimes run over to help in battles near where they hang out.', 'Friends post requests in the To Do app. Bring them what they want for a bonus.']],
  ['Shops and money', ['Battles and requests earn money. Selling crops and fish does too.', 'Romey\'s pet shop on Hope St, Brunswick sells treats and gear. Olly at Bunnings in Altona North sells seeds, tools and house upgrades.', 'Drinks, books and presents are for friends, not pets.']],
  ['The garden', ['Chris at the Edgars Creek community garden in Reservoir hands out plots. Bunnings sells a backyard veggie patch.', 'Water each plot once a day (rain counts). The Garden app reminds you which ones are thirsty.']],
  ['Home', ['Use your bed to sleep until morning or have a nap. The day ends at 2am wherever you are.', 'Entering your house heals every pet.']],
];
function openHelp(panel, back) {
  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('button', { class: 'wood-btn small', onclick: back }, '◀ Back'), h('h2', {}, 'How to play')),
    h('div', { class: 'm-scroll' }, ...HELP.map(([title, lines], i) => h('details', { class: 'set-help', open: i === 0 },
      h('summary', {}, title), h('ul', { class: 'help' }, ...lines.map(l => h('li', {}, l)))))));
}
