import { h } from './dom.js';
import { state } from '../systems/state.js';
import { normaliseScorecards, SCORECARD_LIMIT } from '../systems/scorecards.js';

export function openScorecards(panel, close) {
  // Build a copy, never write to game state or invoke judging/reward code.
  const cards = normaliseScorecards(state.data.scorecards).reverse();
  const body = h('div', { class: 'm-scroll scorecards-list' });
  const heading = (title, back) => h('div', { class: 'm-head' },
    h('h2', {}, title), h('button', { class: 'wood-btn small', onclick: back }, 'Back'));
  const list = () => {
    body.replaceChildren(
      h('p', { class: 'note' }, cards.length ?
        `Latest ${SCORECARD_LIMIT} completed judging cards · newest first. Reviewing does not give prizes or change progress.` :
        'No judging cards saved yet. Completed judging cards will appear here. Earlier results without a saved card are not included.'),
      ...cards.map(card => h('button', { class: 'scorecard-link', onclick: () => detail(card) },
        h('b', {}, card.entryName),
        h('span', {}, `${card.kind === 'exhibition' ? 'Exhibition · ' : ''}${card.event} · ${card.division}`),
        h('span', {}, `Day ${card.day} · ${card.total}/30`))));
    panel.replaceChildren(heading('Scorecards', close), body);
  };
  const detail = card => {
    const content = h('div', { class: 'm-scroll scorecard-detail' },
      h('h3', {}, card.entryName),
      h('p', {}, `${card.kind === 'exhibition' ? 'Exhibition · ' : ''}${card.event}`),
      h('p', {}, `${card.division} · Day ${card.day}`),
      ...card.criteria.map(c => h('div', { class: 'scorecard-mark' },
        h('div', {}, h('b', {}, c.label), h('small', {}, c.judge)),
        h('strong', {}, `${c.score}/10`))),
      h('p', { class: 'scorecard-total' }, `Total: ${card.total}/30`),
      h('p', {}, card.outcome),
      h('p', { class: 'note' }, 'Saved result only. No prizes or progress changes.'));
    panel.replaceChildren(heading('Judging card', list), content);
    panel.querySelector('button')?.focus();
  };
  list();
}
