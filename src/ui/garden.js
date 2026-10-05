// Garden app: how your plots are going.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { CROPS } from '../data/crops.js';
import { getMap } from '../data/regions.js';
import { itemIcon } from './images.js';

function plotRow(p) {
  const f = state.data.farm[p.id], c = f && CROPS[f.crop];
  if (!c) return h('li', { class: 'plot-row' }, h('span', { class: 'plot-name' }, p.label), h('span', { class: 'meta' }, 'Empty'));
  const ready = f.growth >= c.days, watered = f.watered === state.data.day;
  return h('li', { class: 'plot-row' },
    h('img', { class: 'pix', src: itemIcon(f.crop, 24), alt: '' }),
    h('span', { class: 'plot-name' }, `${c.name}`),
    h('span', { class: 'meta' }, ready ? 'Ready to pick!' : `${f.growth}/${c.days} days${watered ? ' · watered today' : ' · needs water'}`));
}

export function openGarden(panel, close) {
  const groups = [];
  if (state.data.flags.garden) groups.push(['Edgars Creek community garden', getMap('wetlands').plots]);
  if (state.hasUpgrade('veggiepatch')) groups.push(['Backyard veggie patch', getMap('yard').plots]);
  const seeds = Object.entries(state.data.seeds);
  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Garden'), h('button', { class: 'wood-btn small', onclick: close }, 'Back')),
    h('div', { class: 'm-scroll' },
      groups.length ? null : h('div', { class: 'note' }, h('p', {}, 'No garden yet. Wen at the Edgars Creek community garden in Reservoir is handing out plots. Olly at Bunnings in Altona North sells a backyard veggie patch.')),
      ...groups.map(([title, plots]) => h('div', { class: 'note' }, h('h4', {}, title), h('ul', { class: 'plots' }, ...plots.map(plotRow)))),
      h('div', { class: 'note' }, h('h4', {}, 'Seeds'), seeds.length
        ? h('div', { class: 'gear-row' }, ...seeds.map(([c, n]) => h('span', { class: 'pref' }, h('img', { src: itemIcon(`seed-${c}`, 24), alt: '' }), `${CROPS[c].name} ×${n}`)))
        : h('p', { class: 'small' }, 'No seeds. Gaz (Laverton Station) and Dimitri (Reservoir Station) sell them.')),
      h('div', { class: 'note' }, h('h4', {}, 'Tips'), h('ul', { class: 'help' },
        h('li', {}, 'Water each plot once a day. Rain counts.'),
        h('li', {}, 'Pets help: Poppy digs up extra, Spooky makes things grow overnight if you water after dark, Stanley sometimes finds a bonus one, and Princess gets you a better price at Dimitri\'s.')))));
}
