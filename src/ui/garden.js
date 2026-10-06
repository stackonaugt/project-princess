// Garden app: how your plots are going.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { CROPS } from '../data/crops.js';
import { getMap } from '../data/regions.js';
import { itemIcon, npcIcon } from './images.js';
import { sfx } from '../systems/sfx.js';

function plotRow(p) {
  const f = state.data.farm[p.id], c = f && CROPS[f.crop];
  if (!c) return h('li', { class: 'plot-row' }, h('span', { class: 'plot-name' }, p.label), h('span', { class: 'meta' }, 'Empty'));
  const ready = f.growth >= c.days, watered = f.watered === state.data.day;
  return h('li', { class: 'plot-row' },
    h('img', { class: 'pix', src: itemIcon(f.crop, 24), alt: '' }),
    h('span', { class: 'plot-name' }, `${c.name}`),
    h('span', { class: 'meta' + (!ready && !watered ? ' thirsty' : '') }, ready ? 'Ready to pick!' : `${c.days - f.growth} ${c.days - f.growth === 1 ? 'day' : 'days'} to go${watered ? ' · watered today' : ' · needs water!'}`));
}

// Community Notices: posts from people with seeds and plots. Unread ones are
// red; tap one to open it (it's then read) or fold it away again.
const NOTICES = [
  { id: 'chris', who: 'chris', title: 'Free plots!', text: 'G\'day all. I\'m handing out plots at the Edgars Creek community garden in Reservoir, behind the scout hall. Come and say hi. Bring a hat. Chris B.' },
  { id: 'olly', who: 'olly', title: 'Cheap veggie seeds', text: 'Hi neighbours! The Bunnings I work at on Kororoit Creek Rd, Altona North has heaps of cheap veggie seeds in the garden centre. Ask for Olly.' },
  { id: 'james', who: 'james', title: 'Seeds at the milk bar', text: 'Seeds for sale at my milk bar at Reservoir Station. I also buy your crops at full price. Cash only. Mostly. James.', when: () => state.data.friends.james?.met },
  { id: 'gaz', who: 'gaz', title: 'Snags AND seeds', text: 'Come for the sausage sizzle, stay for the seeds. Tomato, zucchini, the lot. Onions on the bottom, as is correct. Gaz.', when: () => state.data.friends.gaz?.met },
];
let openNotice = null;

export function openGarden(panel, close) {
  const groups = [], read = state.data.flags.noticesRead || (state.data.flags.noticesRead = []);
  if (state.data.flags.garden) groups.push(['Edgars Creek community garden', getMap('wetlands').plots]);
  if (state.hasUpgrade('veggiepatch')) groups.push(['Backyard veggie patch', getMap('yard').plots]);
  const seeds = Object.entries(state.data.seeds).filter(([, n]) => n > 0);
  const rerender = () => openGarden(panel, close);
  const notices = NOTICES.filter(n => !n.when || n.when());
  const planted = groups.flatMap(([, plots]) => plots).map(p => [p, state.data.farm[p.id]]).filter(([, f]) => f && CROPS[f.crop]);
  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Garden'), h('button', { class: 'wood-btn small', onclick: close }, 'Back')),
    h('div', { class: 'm-scroll' },
      h('div', { class: 'note' }, h('h4', {}, 'Community Notices'), ...notices.map(n => {
        const unread = !read.includes(n.id), isOpen = openNotice === n.id;
        return h('div', { class: 'notice' + (unread ? ' unread' : '') },
          h('button', { class: 'notice-head', onclick: () => { openNotice = isOpen ? null : n.id; if (!read.includes(n.id)) read.push(n.id); state.save(); sfx.select(); rerender(); } },
            h('img', { class: 'pix', src: npcIcon(n.who), alt: '' }), h('b', {}, n.title), h('span', { class: 'small' }, isOpen ? '▲' : '▼')),
          isOpen ? h('p', { class: 'small' }, n.text) : null);
      })),
      h('div', { class: 'note' }, h('h4', {}, 'Reminders'), planted.length
        ? h('ul', { class: 'plots' }, ...planted.map(([p]) => plotRow(p)))
        : h('p', { class: 'small' }, groups.length ? 'Nothing planted. Plant some seeds in an empty bed.' : 'No garden yet. Check the notices above.')),
      h('div', { class: 'note' }, h('h4', {}, 'Seed counter'), seeds.length
        ? h('div', { class: 'gear-row' }, ...seeds.map(([c, n]) => h('span', { class: 'pref' }, h('img', { src: itemIcon(`seed-${c}`, 24), alt: '' }), `${CROPS[c].name} ×${n}`)))
        : h('p', { class: 'small' }, 'No seeds. Olly (Bunnings), Gaz (Laverton Station) and James (Reservoir Station) sell them.')),
      ...groups.map(([title, plots]) => h('div', { class: 'note' }, h('h4', {}, title), h('ul', { class: 'plots' }, ...plots.map(plotRow)))),
      h('div', { class: 'note' }, h('h4', {}, 'Tips and tricks'), h('ul', { class: 'help' },
        h('li', {}, 'Water each plot once a day. Rain counts.'),
        h('li', {}, 'Fertiliser adds an extra day of growth when you water.'),
        h('li', {}, 'The long hose from Bunnings waters every bed in the garden at once. The sprinkler does the backyard every morning.'),
        h('li', {}, 'Pets help: Poppy digs up extra, Spooky makes things grow overnight if you water after dark, Stanley sometimes finds a bonus one, and Princess gets you a better price at James\'s.')))));
}
