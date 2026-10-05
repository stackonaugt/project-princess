// Cheat mode, for testing. Add ?cheat=1 to the address (it is remembered on
// this device; ?cheat=0 turns it off). A Cheats app appears on the Pawphone.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { ZONES, ROUTE, invalidateMap } from '../data/regions.js';
import { ITEMS } from '../data/items.js';
import { CROPS } from '../data/crops.js';
import { GEAR } from '../data/gear.js';
import { PETS } from '../data/pets.js';
import { NPCS } from '../data/npcs.js';
import { UPGRADES } from '../data/upgrades.js';
import { MOTIONS, MOTION_ORDER } from '../data/council.js';
import { WEEKDAYS, weekday, MEETING } from '../data/routines.js';
import { POINTS_PER_HEART } from '../config.js';
import { sfx } from '../systems/sfx.js';

const KEY = 'project-princess-cheats';
export function cheatsOn() {
  try {
    const q = new URLSearchParams(location.search).get('cheat');
    if (q === '1') localStorage.setItem(KEY, '1');
    if (q === '0') localStorage.removeItem(KEY);
    return localStorage.getItem(KEY) === '1';
  } catch (e) { return false; }
}

const world = () => window.__pp.game.scene.getScene('World');

export function openCheats(panel, close) {
  const d = state.data, msg = h('p', { class: 'small center', role: 'status' });
  const done = t => { sfx.pickup(); state.save(); msg.textContent = t; };
  const btn = (label, fn) => h('button', { class: 'wood-btn small', onclick: fn }, label);
  const select = (id, opts, val) => h('select', { id, class: 'cheat-select' }, ...opts.map(([v, t]) => h('option', { value: v, selected: String(v) === String(val) }, t)));
  const zoneSel = select('cheatZone', ROUTE.map(z => [z, `${ZONES[z].name}`]), d.region);
  const hourSel = select('cheatHour', Array.from({ length: 20 }, (_, i) => [6 + i, `${(6 + i) % 12 || 12}${6 + i < 12 || 6 + i >= 24 ? 'am' : 'pm'}`]), Math.floor(d.minutes / 60));
  const heartSel = select('cheatHearts', Array.from({ length: 11 }, (_, i) => [i, `${i} hearts`]), 4);
  const go = (region, extra = {}) => { close(); setTimeout(() => world().scene.restart({ region, ...extra }), 50); };

  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Cheats'), h('button', { class: 'wood-btn small', onclick: close }, 'Close')),
    h('p', { class: 'dex-sum' }, `Testing tools. Day ${d.day} (${weekday(d.day)}). Turn off with ?cheat=0.`),
    h('div', { class: 'm-scroll' },
      h('div', { class: 'note' }, h('h4', {}, 'Go anywhere'), h('div', { class: 'row' }, zoneSel, btn('Go', () => go(zoneSel.value)))),
      h('div', { class: 'note' }, h('h4', {}, 'Time'),
        h('div', { class: 'row' }, hourSel, btn('Set time', () => { d.minutes = Number(hourSel.value) * 60; done(`It is now ${hourSel.selectedOptions[0].textContent}.`); })),
        h('div', { class: 'row' },
          btn('Next day', () => { const news = state.newDay(); state.save(); close(); setTimeout(() => world().scene.restart({ region: 'home', entry: world().bedEntry(), newDay: true, news }), 50); }),
          btn('Jump to Tuesday 6:30pm', () => { while (weekday(d.day) !== 'Tuesday') d.day++; d.minutes = MEETING[0]; done('Tuesday, 6:30pm. Council is meeting in the chamber.'); }),
          btn('Go to the council meeting', () => { while (weekday(d.day) !== 'Tuesday') d.day++; d.minutes = MEETING[0] + 1; go('chamber', { entry: 'door' }); }))),
      h('div', { class: 'note' }, h('h4', {}, 'Stuff'),
        h('div', { class: 'row' },
          btn('+$500', () => { state.addMoney(500); done('+$500'); }),
          btn('5 of every item', () => { Object.keys(ITEMS).forEach(i => state.addItem(i, 5)); done('Bag filled.'); }),
          btn('5 of every seed', () => { Object.keys(CROPS).forEach(c => state.addSeeds(c, 5)); done('Seeds added.'); }),
          btn('One of every gear', () => { Object.keys(GEAR).forEach(g => state.addGear(g)); done('Gear added.'); }))),
      h('div', { class: 'note' }, h('h4', {}, 'Pets'),
        h('div', { class: 'row' },
          btn('Find every pet', () => { PETS.forEach(p => state.findPet(p.id)); done('All pets found. They are at your place.'); }),
          btn('Pets +5 levels', () => { state.foundIds().forEach(id => { const r = state.pet(id); r.level = Math.min(50, (r.level || 5) + 5); r.hp = null; }); done('Pets levelled up.'); }),
          btn('Max pet hearts', () => { state.foundIds().forEach(id => { state.pet(id).points = 250; }); done('Every pet loves you.'); }),
          btn('Heal pets', () => { state.healAll(); done('Healed.'); }))),
      h('div', { class: 'note' }, h('h4', {}, 'Friends'),
        h('div', { class: 'row' }, heartSel, btn('Set everyone', () => {
          const n = Number(heartSel.value);
          Object.keys(NPCS).forEach(id => { const f = state.friend(id); f.met = true; f.points = n * POINTS_PER_HEART; });
          done(`Everyone is at ${n} hearts.`);
        }))),
      h('div', { class: 'note' }, h('h4', {}, 'Garden and house'),
        h('div', { class: 'row' },
          btn('Grow every crop', () => { Object.values(d.farm).forEach(f => { f.growth = CROPS[f.crop].days; }); done('Everything is ready to pick.'); }),
          btn('Open the community garden', () => { d.flags.garden = true; done('Chris has given you the plots.'); }),
          btn('Every upgrade', () => { Object.keys(UPGRADES).forEach(u => { d.upgrades[u] = true; }); invalidateMap('home'); invalidateMap('yard'); done('All upgrades and tools bought.'); }))),
      h('div', { class: 'note' }, h('h4', {}, 'Council'),
        h('div', { class: 'row' },
          btn('Fill every motion', () => { MOTION_ORDER.forEach(id => { d.council.given[id] = { ...MOTIONS[id].needs }; }); done('Every motion is ready for Tuesday.'); }),
          btn('Pass every motion', () => { MOTION_ORDER.forEach(id => state.passMotion(id)); done('All passed. Re-enter a zone to see changes.'); }))),
      h('div', { class: 'note' }, h('h4', {}, 'Character'),
        h('div', { class: 'row' }, ...['helen', 'hadrian', 'aleksy'].map(id => btn(id[0].toUpperCase() + id.slice(1), () => { d.hero = id; world().player.refreshLook(); done(`Now playing as ${id}.`); })))),
      msg));
}
