// The Calendar app: the week ahead at a glance (council meetings, rain,
// Paddy's days off), plus today's to-dos (garden, requests). See also the
// morning reminders in WorldScene.reminders().
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { CROPS } from '../data/crops.js';
import { MOTION_ORDER } from '../data/council.js';
import { weekday, isMeetingDay, isWeekend } from '../data/routines.js';
import { timeLabel } from '../systems/clock.js';

// What's on for a given day (today or later this week).
export function dayEvents(day) {
  const ev = [];
  const ready = MOTION_ORDER.filter(id => !state.motionPassed(id) && state.motionReady(id)).length;
  if (isMeetingDay(day)) ev.push(ready ? `Council meeting, 6:30pm, 115 Civic Parade. ${ready} ${ready === 1 ? 'motion' : 'motions'} up for a vote.` : 'Council meeting, 6:30pm, 115 Civic Parade. Nothing on the agenda yet.');
  if (isMeetingDay(day)) ev.push('Bin night. The Bin Man is restless.');
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
  if (open) jobs.push(`${open} ${open === 1 ? 'request' : 'requests'} on the board.`);
  return jobs;
}

export function openCalendar(panel, close) {
  const today = state.data.day, jobs = todayJobs();
  const days = Array.from({ length: 7 }, (_, i) => today + i);
  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Calendar'), h('button', { class: 'wood-btn small', onclick: close }, 'Close')),
    h('p', { class: 'dex-sum' }, `Day ${today}, ${weekday(today)}.`),
    h('div', { class: 'm-scroll' },
      h('div', { class: 'note' }, h('h4', {}, 'Today\'s jobs'),
        ...(jobs.length ? jobs.map(j => h('p', { class: 'small' }, `• ${j}`)) : [h('p', { class: 'small' }, 'Nothing urgent. Go and say hi to someone.')])),
      ...days.map(day => {
        const ev = dayEvents(day);
        return h('div', { class: 'note' + (day === today ? ' cal-today' : '') },
          h('h4', {}, `${day === today ? 'Today' : day === today + 1 ? 'Tomorrow' : weekday(day)} · Day ${day}`),
          ...(ev.length ? ev.map(e => h('p', { class: 'small' }, `• ${e}`)) : [h('p', { class: 'small meta' }, 'Nothing on.')]));
      })));
}
