// The council noticeboard in the civic centre foyer: every motion, what it
// needs, what you've chipped in, and how the vote looks. See data/council.js.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { MOTIONS, MOTION_ORDER, MAX_PER_MEETING } from '../data/council.js';
import { ITEMS } from '../data/items.js';
import { NPCS } from '../data/npcs.js';
import { itemIcon, npcIcon } from './images.js';
import { weekday } from '../data/routines.js';
import { sfx } from '../systems/sfx.js';

export function openCouncil(panel, close) {
  const msg = h('p', { class: 'small center', role: 'status' });
  const render = () => {
    const short = id => NPCS[id].name.replace(/^(Cr|Mayor) /, '');
    panel.replaceChildren(
      h('div', { class: 'm-head' }, h('h2', {}, 'Council motions'), h('button', { class: 'wood-btn small', onclick: close }, 'Done')),
      h('p', { class: 'dex-sum' }, `Today is ${weekday(state.data.day)}. Council meets Tuesdays at 6:30pm.`),
      h('div', { class: 'm-scroll' },
        h('div', { class: 'note' }, h('h4', {}, 'How this board works'),
          h('p', { class: 'small' }, 'Each card below is a motion: an idea for council to vote on. Chip in what it needs from your bag or your wallet. Once it has everything, it goes to the next Tuesday meeting at 6:30pm and council votes on it. If it passes, something in town changes.')),
        h('div', { class: 'note' }, h('h4', {}, 'Winning votes'),
          h('p', { class: 'small' }, `Every motion splits council differently. Win over the undecided: some want a present, some want to be your friend, some need convincing another way. Paddy has tips at home in the evening. At most ${MAX_PER_MEETING} motions go to each meeting.`),
          state.paddyDeposed() ? h('p', { class: 'small' }, 'Paddy is not mayor right now, so councillors won by friendship need twice the hearts.') : null),
        state.foundCount() < 1 ? h('div', { class: 'note' }, h('p', {}, 'The noticeboard is empty apart from a flyer for a lost cockatoo. Council business can wait: go and find some more pets first.')) : null,
        ...MOTION_ORDER.filter(id => state.motionUnlocked(id)).map(id => {
          const m = MOTIONS[id], given = state.motionGiven(id), passed = state.motionPassed(id), ready = state.motionReady(id);
          const needs = Object.entries(m.needs).map(([k, n]) => {
            const have = given[k] || 0, done = have >= n;
            const label = k === 'money' ? `Money ($${n})` : `${n} × ${ITEMS[k].name}`;
            const canGive = !done && !passed && (k === 'money' ? state.data.money >= n - have : state.count(k) > 0);
            return h('div', { class: 'gear-row' },
              k === 'money' ? h('span', { class: 'shop-glyph' }, '$') : h('img', { class: 'pix', src: itemIcon(k, 32), alt: '', width: 24, height: 24 }),
              h('span', {}, `${label}: ${k === 'money' ? (done ? 'paid' : 'not yet') : `${have} of ${n}`}`),
              done ? h('span', { class: 'meta' }, '✓') : h('button', { class: 'wood-btn small', disabled: !canGive, onclick: () => {
                const got = state.chipIn(id, k);
                if (got) { sfx.pickup(); state.save(); msg.textContent = `Chipped in ${k === 'money' ? `$${got}` : `${got} × ${ITEMS[k].name}`}.`; render(); }
              } }, 'Chip in'));
          });
          const v = passed ? null : state.councilVote(id);
          const undecided = v ? v.undecided.map(w => {
            const sw = m.votes.swing[w];
            const how = sw.hearts ? ` (${state.swingHearts(sw.hearts)} hearts, you have ${state.friendHearts(w)})` : '';
            return h('div', { class: 'gear-row' }, h('img', { class: 'pix', src: npcIcon(w), alt: '', width: 24, height: 24 }), h('span', { class: 'small' }, `${short(w)} ${sw.hint}${how}.`));
          }) : [];
          return h('div', { class: 'note' },
            h('h4', {}, m.title),
            h('p', { class: 'small' }, `Moved by ${NPCS[m.sponsor].name}. ${m.effect}`),
            v ? h('p', { class: 'small' }, `Votes now: ${v.yes.length} yes (${v.yes.map(short).join(', ')}), ${v.no.length} no. ${v.passed ? 'It would pass.' : 'It would fail.'}`) : null,
            ...undecided,
            passed ? h('p', { class: 'meta' }, 'Passed ✓') : ready ? h('p', { class: 'meta' }, 'Ready for Tuesday\'s meeting.') : null,
            ...(passed ? [] : needs));
        }),
        MOTION_ORDER.some(id => !state.motionUnlocked(id)) && state.foundCount() >= 1 ? h('p', { class: 'small center' }, 'More motions go up on the board as you find more pets.') : null,
        msg));
  };
  render();
}
