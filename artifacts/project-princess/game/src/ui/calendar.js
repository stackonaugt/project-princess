// The Calendar app: the week ahead at a glance (council meetings, rain,
// Paddy's days off), plus today's to-dos (garden, requests). See also the
// morning reminders in WorldScene.reminders().
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { CROPS } from '../data/crops.js';
import { MOTION_ORDER } from '../data/council.js';
import { weekday, isMeetingDay, isWeekend, WEEKDAYS } from '../data/routines.js';
import { sfx } from '../systems/sfx.js';
import { timeLabel } from '../systems/clock.js';

// What's on for a given day (today or later this week).
export function dayEvents(day) {
  const ev = [];
  const ready = MOTION_ORDER.filter(id => !state.motionPassed(id) && state.motionReady(id)).length;
  if (isMeetingDay(day)) ev.push(ready ? `Council meeting, 6:30pm, 115 Civic Parade. ${ready} ${ready === 1 ? 'motion' : 'motions'} up for a vote.` : 'Council meeting, 6:30pm, 115 Civic Parade. Nothing on the agenda yet.');
  if (isMeetingDay(day)) ev.push('Bin night. The Bin Man is restless.');
  const st = state.data.story, c2 = st.ch2;
  if (st.chapter === 2 && !st.done[2] && c2.deadline === day) ev.push('THE SPILL VOTE. Paddy\'s job is on the line. Swap Cr Bentleigh\'s lunch before tonight!');
  if (st.chapter === 2 && !st.done[2] && c2.deadline > day && day >= state.data.day && !isWeekend(day) && !c2.swapped) ev.push('Cr Bentleigh eats lunch in the civic centre foyer, 11am to 3pm.');
  if (isWeekend(day)) ev.push('Paddy is home all day.');
  const rain = state.rainWindow(day);
  if (rain) ev.push(`Showers around ${timeLabel(rain[0])}. The garden waters itself.`);
  return ev;
}

// Today's jobs: thirsty or ripe plots, open requests.
export function todayJobs() {
  const d = state.data, jobs = [];
  const plots = Object.values(d.farm).filter(f => CROPS[f.crop]);
  const thirsty = plots.filter(f => f.watered !== d.day && f.growth < CROPS[f.crop].days).length;
  const ripe = plots.filter(f => f.growth >= CROPS[f.crop].days).length;
  if (ripe) jobs.push(`${ripe} ${ripe === 1 ? 'crop is' : 'crops are'} ready to pick.`);
  if (thirsty && !state.rainWindow()) jobs.push(`${thirsty} ${thirsty === 1 ? 'plot needs' : 'plots need'} watering.`);
  const open = state.todaysRequests().filter(q => !q.done).length;
  if (open) jobs.push(`${open} ${open === 1 ? 'request' : 'requests'} in the To Do app.`);
  return jobs;
}

// A classic month-style grid: four weeks from this Monday, dots for what's on.
// Tap a day to see the details under the grid. Days are a plain count.
let picked = null;
export function openCalendar(panel, close) {
  const today = state.data.day, jobs = todayJobs();
  if (picked === null || picked < today) picked = today;
  const start = today - ((today - 1) % 7);
  const dots = day => {
    const st = state.data.story, out = [];
    if (isMeetingDay(day)) out.push('council');
    if (state.rainWindow(day)) out.push('rain');
    if (isWeekend(day)) out.push('paddy');
    if (st.chapter === 2 && !st.done[2] && st.ch2.deadline === day) out.push('spill');
    return out;
  };
  const cells = Array.from({ length: 28 }, (_, i) => start + i).map(day => h('button', {
    class: 'cal-cell' + (day === today ? ' today' : '') + (day === picked ? ' picked' : '') + (day < today ? ' past' : ''),
    disabled: day < today,
    onclick: () => { picked = day; sfx.select(); openCalendar(panel, close); },
  }, h('b', {}, day), h('span', { class: 'cal-dots' }, ...dots(day).map(d => h('i', { class: `dot-${d}` })))));
  const ev = dayEvents(picked);
  panel.replaceChildren(
    h('div', { class: 'cal-head' }, h('div', {}, h('small', {}, weekday(today)), h('b', {}, `Day ${today}`)), h('button', { class: 'wood-btn small', onclick: close }, 'Close')),
    h('div', { class: 'm-scroll' },
      h('div', { class: 'cal-grid' }, ...WEEKDAYS.map(w => h('span', { class: 'cal-wd' }, w.slice(0, 3))), ...cells),
      h('div', { class: 'cal-key small' }, h('span', {}, h('i', { class: 'dot-council' }), 'Council and bins'), h('span', {}, h('i', { class: 'dot-rain' }), 'Rain'), h('span', {}, h('i', { class: 'dot-paddy' }), 'Paddy home')),
      h('div', { class: 'note' }, h('h4', {}, `${picked === today ? 'Today' : picked === today + 1 ? 'Tomorrow' : weekday(picked)} · Day ${picked}`),
        ...(ev.length ? ev.map(e => h('p', { class: 'small' }, `• ${e}`)) : [h('p', { class: 'small meta' }, 'Nothing on.')])),
      h('div', { class: 'note' }, h('h4', {}, 'Today\'s jobs'),
        ...(jobs.length ? jobs.map(j => h('p', { class: 'small' }, `• ${j}`)) : [h('p', { class: 'small' }, 'Nothing urgent. Go and say hi to someone.')]))));
}
