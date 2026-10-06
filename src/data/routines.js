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

const COUNCILLORS = ['lesley', 'malcolm', 'kirsty', 'dahlia', 'rayna', 'deanna'];
// Which weekdays each councillor pops into the civic centre foyer (10am to 4pm).
const FOYER_DAYS = {
  lesley: ['Monday', 'Wednesday', 'Friday'], malcolm: ['Monday', 'Wednesday'],
  kirsty: ['Thursday'], dahlia: ['Wednesday', 'Friday'], rayna: ['Monday', 'Thursday'], deanna: ['Tuesday', 'Thursday'],
};

export const ROUTINES = {
  // Paddy: out the door early on weekdays, at the civic centre all day (the
  // chamber on Tuesday nights), home in the evening. Weekends at home.
  paddy(d) {
    const m = d.minutes;
    if (isWeekend(d.day)) return m < 18 * 60 ? 'yard' : 'home';
    if (m < 8 * 60) return d.flags.paddyLeft === d.day ? null : 'leaving';
    if (inMeeting(d)) return 'chamber';
    if (m < (isMeetingDay(d.day) ? MEETING[0] : 17 * 60 + 30)) return 'reception';
    if (isMeetingDay(d.day) && m < MEETING[1] + 30) return null;   // walking home after the meeting
    return 'home';
  },
};
// The story (systems/story.js) moves some people around:
//   Chapter 2: Rayna is away walking the Camino; Lesley eats lunch in the foyer
//   every weekday, 11am to 3pm, until the fish pie sends her home for a week.
//   Chapter 3: Trish and Gordon are in bed with gastro (Helen is looking after them).
const st = d => d.story || {};
const ch = (d, n) => st(d).chapter === n && !st(d).done?.[n];
for (const id of COUNCILLORS) {
  ROUTINES[id] = d => (id === 'rayna' && ch(d, 2)) || (id === 'lesley' && st(d).ch2?.sickUntil >= d.day) ? null
    : id === 'lesley' && ch(d, 2) && !isWeekend(d.day) && d.minutes >= 11 * 60 && d.minutes < 15 * 60 && !inMeeting(d) ? 'foyer'
    : inMeeting(d) ? 'chamber'
    : FOYER_DAYS[id].includes(weekday(d.day)) && d.minutes >= 10 * 60 && d.minutes < 16 * 60 ? 'foyer' : null;
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
// Ward: the bottle shop till 7pm, then home to Betty on Moreland Rd.
ROUTINES.ward = d => (d.minutes < 19 * 60 ? 'shop' : 'home');
// Shannon closes Brunswick Bound at 8pm and heads home.
ROUTINES.shannon = d => (d.minutes < 20 * 60 ? 'shop' : null);
// Tim and Nicholas walk Stanley round Edwardes Lake every evening.
ROUTINES.tim = ROUTINES.nicholas = d => (d.minutes >= 17 * 60 + 30 && d.minutes < 19 * 60 ? 'lake' : 'glasgow');

// Is this person at this place right now? People without a routine always are.
export function isAt(id, place, d) {
  if (!place) return true;
  const r = ROUTINES[id];
  return !r || r(d) === place;
}
