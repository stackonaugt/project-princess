// Daily routines: where people with a schedule are at a given time.
// A map places such a person with b.npc(id, x, y, { at: '<place>' }); they only
// appear while routine(id) says they are at that place (checked every 10 game
// minutes, so people come and go while you watch).
//
// The week: day 1 is a Monday. Council meets on Tuesday evenings, like the real
// Hobsons Bay council.

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const weekday = day => WEEKDAYS[(day - 1) % 7];
export const isWeekend = day => ['Saturday', 'Sunday'].includes(weekday(day));
export const isMeetingDay = day => weekday(day) === 'Tuesday';
export const MEETING = [18 * 60 + 30, 21 * 60 + 30];
export const inMeeting = d => isMeetingDay(d.day) && d.minutes >= MEETING[0] && d.minutes < MEETING[1];
import { authoredValue } from '../authoring/overrides.js';

const COUNCILLORS = ['lesley', 'malcolm', 'kirsty', 'dahlia', 'rayna', 'deanna'];
// Which weekdays each councillor pops into the civic centre foyer (10am to 4pm).
const FOYER_DAYS = {
  lesley: ['Monday', 'Wednesday', 'Friday'], malcolm: ['Monday', 'Wednesday'],
  kirsty: ['Thursday'], dahlia: ['Wednesday', 'Friday'], rayna: ['Monday', 'Thursday'], deanna: ['Tuesday', 'Thursday'],
};

const BASE_ROUTINES = {
  // Paddy: out the door early on weekdays, at the civic centre all day (the
  // chamber on Tuesday nights), home in the evening. Weekends at home.
  paddy(d) {
    const m = d.minutes;
    if (isWeekend(d.day)) return m < 18 * 60 ? 'yard' : 'home';
    if (m < 8 * 60) return d.flags.paddyLeft === d.day ? null : 'leaving';
    if (inMeeting(d) && d.council?.metDay !== d.day) return 'chamber';
    if (m < (isMeetingDay(d.day) ? MEETING[0] : 17 * 60 + 30)) return 'reception';
    if (isMeetingDay(d.day) && m < MEETING[1] + 30) return null;   // walking home after the meeting
    return 'home';
  },
};
// The story (systems/story.js) moves some people around:
export const ROUTINE_OVERRIDES = authoredValue('data/routines.js', 'ROUTINE_OVERRIDES', {});
export const ROUTINES = new Proxy(BASE_ROUTINES, {
  get(target, key) {
    const original = target[key];
    const rules = typeof key === 'string' ? ROUTINE_OVERRIDES[key] : null;
    if (!Array.isArray(rules) || !rules.length) return original;
    return data => {
      const matching = rules.find(rule =>
        (!rule.days?.length || rule.days.includes(weekday(data.day))) &&
        data.minutes >= rule.from && data.minutes < rule.until);
      return matching ? matching.place : typeof original === 'function' ? original(data) : null;
    };
  },
});
//   Chapter 2: Rayna is away walking the Camino; Lesley eats lunch in the foyer
//   every weekday, 11am to 3pm, until the fish pie sends her home for a week.
//   Chapter 3: Trish and Gordon are in bed with gastro (Helen is looking after them).
const st = d => d.story || {};
const ch = (d, n) => st(d).chapter === n && !st(d).done?.[n];
// Each councillor has a house in Laverton (allen.js, woods.js): out the front
// first thing (7 to 9:30am) and home again in the evening (5 to 10pm, or
// after the Tuesday meeting till 11pm). Lesley stays home while she is sick.
const atHouse = d => (d.minutes >= 7 * 60 && d.minutes < 9.5 * 60) || (d.minutes >= 17 * 60 && d.minutes < (isMeetingDay(d.day) ? 23 : 22) * 60 && !inMeeting(d));
for (const id of COUNCILLORS) {
  ROUTINES[id] = d => (id === 'rayna' && ch(d, 2)) ? null
    : (id === 'lesley' && st(d).ch2?.sickUntil >= d.day) ? (d.minutes < 22 * 60 ? 'house' : null)
    : id === 'lesley' && ch(d, 2) && !isWeekend(d.day) && d.minutes >= 11 * 60 && d.minutes < 15 * 60 && !inMeeting(d) ? 'foyer'
    : inMeeting(d) && d.council?.metDay !== d.day ? 'chamber'
    : FOYER_DAYS[id].includes(weekday(d.day)) && d.minutes >= 10 * 60 && d.minutes < 16 * 60 ? 'foyer'
    : atHouse(d) ? 'house' : null;
}

// Trish and Gordon: in the garden by day, inside at night, and Thursday
// mornings shopping in Footscray.
ROUTINES.trish = ROUTINES.gordon = d => ch(d, 3) || d.minutes >= 19 * 60 ? null
  : weekday(d.day) === 'Thursday' && d.minutes >= 10 * 60 && d.minutes < 14 * 60 ? 'footscray' : 'woods';
// The dela Cruz family sing karaoke at Lohse St Reserve, 10am to 6pm.
ROUTINES.ramon = ROUTINES.liza = ROUTINES.migs = ROUTINES.bea = d => (d.minutes >= 10 * 60 && d.minutes < 18 * 60 ? 'karaoke' : null);
// The ghost haunts Reservoir Station after 9pm.
ROUTINES.ghost = d => (d.minutes >= 21 * 60 ? 'night' : null);
// A real fairy visits Coburg Station every third day, 9am to 5pm.
ROUTINES.fairy = d => (d.day % 3 === 0 && d.minutes >= 9 * 60 && d.minutes < 17 * 60 ? 'visit' : null);
// Mem and Corni: up to the Edinburgh Castle at 7pm, home at 11pm.
ROUTINES.mem = ROUTINES.corni = d => (d.minutes >= 19 * 60 && d.minutes < 23 * 60 ? 'pub' : 'home');
// Pearman ducks up to the Edinburgh Castle on Friday and Saturday evenings.
ROUTINES.pearman = d => (['Friday', 'Saturday'].includes(weekday(d.day)) && d.minutes >= 17 * 60 && d.minutes < 21 * 60 ? 'pub' : 'sydney');
// Ward: the bottle shop from 10am till 7pm, otherwise home with Betty on Moreland Rd.
ROUTINES.ward = d => (d.minutes >= 10 * 60 && d.minutes < 19 * 60 ? 'shop' : 'home');
// Shannon opens Brunswick Bound at 9am, closes at 8pm and heads home.
ROUTINES.shannon = d => (d.minutes >= 9 * 60 && d.minutes < 20 * 60 ? 'shop' : null);
// Tim and Nicholas walk Stanley round Edwardes Lake every evening.
ROUTINES.tim = ROUTINES.nicholas = d => (d.minutes >= 17 * 60 + 30 && d.minutes < 19 * 60 ? 'lake' : 'glasgow');

// Is this person at this place right now? People without a routine always are.
export function isAt(id, place, d) {
  if (!place) return true;
  const r = ROUTINES[id];
  return !r || r(d) === place;
}

// Everyone without a routine above still keeps hours. Shopkeepers are there
// while their shop is open; everyone else is out from the morning (between
// 6:30 and 8am) and heads home at night (between 8 and 10:30pm), a little
// different for each person. Night owls come out in the afternoon and stay
// till close. People at your place, and the ones the story needs on the spot
// (Ben Carroll on Parliament's steps, Julie's tutorial), are always about.
const ALWAYS = new Set(['bencarroll', 'julie', 'sam']);
const NIGHT_OWLS = { mrwilkinson: 14 * 60, possumpat: 17 * 60 };
// Opening hours by shop id, [open, close] in hours (25 = 1am). Plenty Road
// Convenience (vapeshop) never shuts and Sam never leaves.
const SHOP_HOURS = {
  milkbar: [6, 23], spells: [7, 23], vapeshop: [0, 99], coffeecart: [6.5, 15], donuts: [7, 18], fruit: [7, 17], qvdeli: [7, 17],
  souvenirs: [9, 18], chemist: [8, 21], hotbread: [7, 18], twodollar: [9, 18], pide: [6, 19], deli: [7, 17], fruitveg: [7, 17],
  opshop: [10, 17], gelateria: [11, 25], bottleshop: [10, 22], bookshop: [9, 19], bunnings: [6, 21], fishvan: [8, 18], anaconda: [9, 21], cozzo: [9, 18], petshop: [9, 18],
};
const spread = id => [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 997, 7) / 997;   // 0..1, fixed per person
export function onDuty(spot, info, d, home = false) {
  const id = spot.id;
  if (home || spot.at || ROUTINES[id] || ALWAYS.has(id) || spot.leave) return true;
  const m = d.minutes;
  if (NIGHT_OWLS[id] !== undefined) return m >= NIGHT_OWLS[id];
  if (info?.shop || spot.counter) { const [o, c] = SHOP_HOURS[info?.shop] || [8, 20]; return m >= o * 60 && m < c * 60; }
  const s = spread(id);
  return m >= 6 * 60 + 30 + s * 90 && m < 20 * 60 + s * 150;
}
