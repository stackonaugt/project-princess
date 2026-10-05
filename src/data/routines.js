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
for (const id of COUNCILLORS) {
  ROUTINES[id] = d => inMeeting(d) ? 'chamber'
    : FOYER_DAYS[id].includes(weekday(d.day)) && d.minutes >= 10 * 60 && d.minutes < 16 * 60 ? 'foyer' : null;
}

// Is this person at this place right now? People without a routine always are.
export function isAt(id, place, d) {
  if (!place) return true;
  const r = ROUTINES[id];
  return !r || r(d) === place;
}
