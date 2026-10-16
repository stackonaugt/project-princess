// Events you are meant to turn up to. When one starts (and you know about it),
// a pop-up offers to take you straight there (systems/event-prompts.js), once
// per event per day.
//
// Each event: { id, name, zone, entry, where, known(data), active(day, minutes, data) }
//   zone, entry   where "Go now" drops you (World restarts into that zone)
//   known         true once the player has found out about it (never prompt before)
//   active        true while it is on and still worth going to (not already done)
//   also          other zone ids that count as already being there (optional)
// Add your own with registerEvent({...}) from your data file (the fishing
// competition does this). Ids must be unique; registering an id again replaces it.
import { weekday, inMeeting } from './routines.js';
import { BAKE_OFF } from './cooking.js';
import { SHOW_DAY, DIVISIONS } from './dog-show.js';
import { compOpen, compWeek } from './bowls-club.js';
import { COMP as FISH_COMP } from './fishing.js';

export const EVENTS = [];
export function registerEvent(e) {
  const i = EVENTS.findIndex(x => x.id === e.id);
  if (i >= 0) EVENTS[i] = e; else EVENTS.push(e);
  return e;
}

// Tuesday council meeting, 6:30 to 9:30pm in the chamber. Known once the
// council is part of your life: chapter 2, or a motion you have looked at.
registerEvent({
  id: 'council', name: 'The council meeting', where: 'the council chamber, Civic Parade', zone: 'chamber', entry: 'door', also: ['civiccentre'],
  known: d => (d.story?.chapter || 0) >= 2 || (d.council?.known?.length || 0) > 0 || Object.keys(d.council?.given || {}).length > 0 || (d.council?.passed?.length || 0) > 0,
  active: (day, minutes, d) => inMeeting({ day, minutes }) && d.council?.metDay !== day,
});

// The Great Coburg Bake Off: Saturdays from 9am to 4pm, once Betty has told you about it.
registerEvent({
  id: 'bakeoff', name: 'The Great Coburg Bake Off', where: 'the hall by Betty\'s, Moreland Rd', zone: 'bakeoff', entry: 'door', also: ['moreland'],
  known: d => (d.side?.bake || 0) >= 1,
  active: (day, minutes, d) => weekday(day) === BAKE_OFF.day && minutes >= 9 * 60 && minutes < 16 * 60 && d.flags?.bakeoffWeek !== Math.floor(day / 7),
});

// The Exhibition dog show judging day, once you have registered a dog and while divisions are left.
registerEvent({
  id: 'dogshow', name: 'Dog show judging', where: 'the Exhibition', zone: 'exhibition', entry: 'door',
  known: d => !!d.side?.show?.entered,
  active: (day, minutes, d) => weekday(day) === SHOW_DAY.day && minutes >= SHOW_DAY.from && minutes < SHOW_DAY.to && DIVISIONS.some(x => !(d.side?.show?.claimed || []).includes(x.id)),
});

// The bowls club championship: Wednesdays 10am to 4pm, for members who have not played this week.
registerEvent({
  id: 'bowlscomp', name: 'The bowls club championship', where: 'the Brunswick Bowls Club', zone: 'bowls', entry: 'street',
  known: d => !!d.side?.bowlsMember,
  active: (day, minutes, d) => compOpen(day, minutes) && d.side?.bowlsCompWeek !== compWeek(day),
});

// The Coburg Lake Fishing Comp (systems/angler.js): Sundays 7am to noon, once you have joined (shown Ross a rare fish).
registerEvent({
  id: 'fishcomp', name: 'The Coburg Lake Fishing Comp', where: 'Coburg Lake, with Ross', zone: 'coburglake', entry: 'west',
  known: d => !!d.fishing?.member,
  active: (day, minutes, d) => weekday(day) === FISH_COMP.day && minutes >= FISH_COMP.from * 60 && minutes < FISH_COMP.to * 60 && d.fishing?.compWeek !== Math.floor(day / 7),
});

// The events starting now that the player should be told about: known,
// on, not shown yet today, and not where you already are.
export function dueEvents(data, regionId) {
  const seen = data.flags?.eventPrompts || {};
  return EVENTS.filter(e => seen[e.id] !== data.day && e.zone !== regionId && !(e.also || []).includes(regionId)
    && safe(() => e.known(data)) && safe(() => e.active(data.day, data.minutes, data)));
}
const safe = f => { try { return !!f(); } catch { return false; } };
export function markPrompted(data, id) { (data.flags.eventPrompts ||= {})[id] = data.day; }
