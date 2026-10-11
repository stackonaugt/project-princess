// The Brunswick Bowls Club: membership and the Wednesday club championship.
// Maureen the treasurer (east.js) takes the fee once you have beaten Crazy
// Jeff (the play-fight, or one end on the green). Members can enter the club
// championship once a week, Wednesdays 10am to 4pm: three ends against three
// sharper rivals, knocked out on the first one you lose. Win all three for the
// cup (the first time), $100 and giant tomato seeds, which nobody sells.
import { weekday } from './routines.js';

export const MEMBERSHIP_FEE = 40;
export const CLUB_COMP = {
  name: 'Brunswick Bowls Club Championship',
  day: 'Wednesday', from: 10 * 60, to: 16 * 60,
  // Each round's mark to beat (cm, edge to edge) is min + a random share of spread.
  rounds: [
    { who: 'bowler2', name: 'Stan', title: 'Round one: Stan', min: 6, spread: 18 },
    { who: 'bowler1', name: 'Merv', title: 'Semi final: Merv', min: 4, spread: 13 },
    { who: 'crazyjeff', name: 'Crazy Jeff', title: 'The final: Crazy Jeff', min: 2, spread: 9 },
  ],
  prize: { money: 100, trophy: 'bowlscup', seeds: ['gianttomato', 3] },
};

export const compWeek = day => Math.floor(day / 7);
export const compOpen = (day, minutes) => weekday(day) === CLUB_COMP.day && minutes >= CLUB_COMP.from && minutes < CLUB_COMP.to;
// Beat Crazy Jeff (in a play-fight, or one end at bowls) and you may join.
export const canJoin = data => !!data.beaten?.crazyjeff || (data.side?.bowlsWins || 0) >= 1 || !!data.side?.trophy;
export const isMember = data => !!data.side?.bowlsMember;
export const playedThisWeek = data => data.side?.bowlsCompWeek === compWeek(data.day);
export const compMark = (round, rand = Math.random) => { const r = CLUB_COMP.rounds[round]; return Math.round(r.min + rand() * r.spread); };

// What a championship win hands over (pure, so the tests can check it).
export function compPrize(data) {
  const p = CLUB_COMP.prize, first = !(data.inventory?.[p.trophy] > 0);
  return { money: p.money, seeds: p.seeds, trophy: first ? p.trophy : null };
}
export function awardComp(data) {
  const prize = compPrize(data);
  data.money = (data.money || 0) + prize.money;
  data.seeds[prize.seeds[0]] = (data.seeds[prize.seeds[0]] || 0) + prize.seeds[1];
  if (prize.trophy) data.inventory[prize.trophy] = (data.inventory[prize.trophy] || 0) + 1;
  data.side.bowlsCompWins = (data.side.bowlsCompWins || 0) + 1;
  return prize;
}
