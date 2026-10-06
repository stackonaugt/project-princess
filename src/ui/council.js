// The council noticeboard in the civic centre foyer: every motion, what it
// needs, what you've chipped in, and how the vote looks. See data/council.js.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { MOTIONS, MOTION_ORDER, SWING } from '../data/council.js';
import { ITEMS } from '../data/items.js';
import { NPCS } from '../data/npcs.js';
import { itemIcon, npcIcon } from './images.js';
import { weekday } from '../data/routines.js';
import { sfx } from '../systems/sfx.js';

export function openCouncil(panel, close) {
  const msg = h('p', { class: 'small center', role: 'status' });
  const render = () => {
    const v = state.councilVote();
    const swing = Object.entries(SWING).map(([id, base]) => {
      const need = state.swingHearts(base), hc = state.friendHearts(id), yes = hc >= need;
      return h('div', { class: 'gear-row' }, h('img', { class: 'pix', src: npcIcon(id), alt: '', width: 24, height: 24 }),
        h('span', {}, `${NPCS[id].name}: ${yes ? 'voting yes' : `voting no (needs ${need} hearts, has ${hc})`}`));
    });
    panel.replaceChildren(
      h('div', { class: 'm-head' }, h('h2', {}, 'Council motions'), h('button', { class: 'wood-btn small', onclick: close }, 'Done')),
      h('p', { class: 'dex-sum' }, `Today is ${weekday(state.data.day)}. Council meets Tuesdays at 6:30pm.`),
      h('div', { class: 'm-scroll' },
        h('div', { class: 'note' }, h('h4', {}, 'How this board works'),
          h('p', { class: 'small' }, 'Each card below is a motion: an idea for council to vote on. Chip in what it needs from your bag or your wallet. Once it has everything, it goes to the next Tuesday meeting at 6:30pm and council votes on it. If it passes, something in town changes.')),
        h('div', { class: 'note' },
          h('h4', {}, `If council voted now: ${v.yes.length} yes, ${v.no.length} no. ${v.passed ? 'Motions would pass.' : 'Motions would fail.'}`),
          state.paddyDeposed() ? h('p', { class: 'small' }, 'Paddy is not mayor right now, so the swing votes are twice as hard to win.') : null,
        h('p', { class: 'small' }, 'Paddy, Rayna and Deanna vote yes. Lesley and Malcolm vote no. The swing votes:'), ...swing),
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
          return h('div', { class: 'note' },
            h('h4', {}, m.title),
            h('p', { class: 'small' }, `Moved by ${NPCS[m.sponsor].name}. ${m.effect}`),
            passed ? h('p', { class: 'meta' }, 'Passed ✓') : ready ? h('p', { class: 'meta' }, 'Ready for Tuesday\'s meeting.') : null,
            ...(passed ? [] : needs));
        }),
        MOTION_ORDER.some(id => !state.motionUnlocked(id)) && state.foundCount() >= 1 ? h('p', { class: 'small center' }, 'More motions go up on the board as you find more pets.') : null,
        msg));
  };
  render();
}
