// Joining the Brunswick Bowls Club and the Wednesday club championship
// (rules and prizes in data/bowls-club.js). WorldScene's talk menu asks
// bowlsClubChoices() what to offer and hands the pick to bowlsClubAction().
import { state } from './state.js';
import { ui } from '../ui/ui.js';
import { sfx } from './sfx.js';
import { bus } from '../bus.js';
import { npcIcon } from '../ui/images.js';
import { invalidateMap } from '../data/regions.js';
import { ITEMS } from '../data/items.js';
import { MEMBERSHIP_FEE, CLUB_COMP, canJoin, isMember, compOpen, compWeek, playedThisWeek, compMark, awardComp } from '../data/bowls-club.js';

const CLUB_PEOPLE = ['crazyjeff', 'bowler1', 'bowler2', 'treasurer'];
const hours = `${CLUB_COMP.day}s, 10am to 4pm`;

export function bowlsClubChoices(id, data) {
  if (!CLUB_PEOPLE.includes(id)) return [];
  if (id === 'treasurer' && !isMember(data)) return [{ label: `Join the club ($${MEMBERSHIP_FEE})`, value: 'club:join' }];
  if (isMember(data) && compOpen(data.day, data.minutes) && !playedThisWeek(data) && (id === 'treasurer' || id === 'crazyjeff'))
    return [{ label: 'Enter the club championship', value: 'club:comp' }];
  if (id === 'treasurer') return [{ label: 'Ask about the championship', value: 'club:info' }];
  return [];
}

export async function bowlsClubAction(world, act, opts) {
  const d = state.data, maureen = { name: 'Maureen the Treasurer', portrait: npcIcon('treasurer') };
  if (act === 'club:info') {
    if (playedThisWeek(d)) return ui.say([`Maureen: "You have had your go this week, love. Same time next ${CLUB_COMP.day}."`], maureen);
    return ui.say([`Maureen: "The club championship is ${hours}. Members only. Three ends: Stan, then Merv, then Jeff in the final."`,
      '"Win the lot and it is a cup, a hundred dollars and a packet of Jeff\'s giant tomato seeds. You cannot buy those anywhere. Believe me, people have tried."'], maureen);
  }
  if (act === 'club:join') {
    if (!canJoin(d)) return ui.say(['Maureen: "Membership is for people who have beaten Crazy Jeff. Club rule. I did not write it. Well. I did type it up."', '"Have a bowl against the old blokes, or take him on in a play-fight. Then come and see me."'], maureen);
    const go = await ui.say({ text: `Maureen opens a very tidy ledger. "Forty dollars for the year. You have $${d.money}."`, choices: [{ label: `Pay $${MEMBERSHIP_FEE}`, value: true }, { label: 'Not today', value: false }] }, { ...maureen, cancelValue: false });
    if (!go) return;
    if (!state.spend(MEMBERSHIP_FEE)) { sfx.bump(); return ui.say([`Maureen: "Forty, love. Not ${d.money}. I do not do IOUs. Ask Jeff about 1994."`], maureen); }
    d.side.bowlsMember = true; sfx.found(); state.addFriendPoints('treasurer', 10); world.save();
    ui.toast('Brunswick Bowls Club member');
    return ui.say(['Maureen writes your name in the ledger in perfect cursive and hands you a badge.', `"Welcome to the club. The championship is ${hours}. Do not be late. Jeff is always late, but do not be."`], maureen);
  }
  if (act === 'club:comp') return championship(world, opts);
}

// Three ends against three rivals; lose one and you are out until next week.
async function championship(world, opts) {
  const d = state.data;
  if (!isMember(d) || playedThisWeek(d) || !compOpen(d.day, d.minutes)) return;
  d.side.bowlsCompWeek = compWeek(d.day); world.save();
  await ui.say(['Crazy Jeff rings a little brass bell. "The Brunswick Bowls Club Championship is UNDERWAY!"', 'Three ends. One each against Stan, Merv and me. Lose one and you are back on the scones.'], { name: 'Crazy Jeff', portrait: npcIcon('crazyjeff') });
  for (let i = 0; i < CLUB_COMP.rounds.length; i++) {
    const round = CLUB_COMP.rounds[i], mark = compMark(i);
    const r = await ui.bowls({ wins: d.side.bowlsWins || 0, rival: mark, rivalName: round.name, title: round.title });
    const won = !!r && r.best !== null && r.best < r.rival;
    CLUB_PEOPLE.forEach(id => state.addFriendPoints(id, won ? 6 : 3));
    if (!won) {
      sfx.sad?.(); world.save();
      return ui.say([`${round.name} shakes your hand. "Good bowling. Not quite good enough. See you next ${CLUB_COMP.day}."`, 'Out of the championship for this week. The scones are very good, though.'], { name: round.name, portrait: npcIcon(round.who) });
    }
    if (i < CLUB_COMP.rounds.length - 1) await ui.say([`Through! ${round.name} was ${r.rival} cm off. You were ${r.best}.`, `Next: ${CLUB_COMP.rounds[i + 1].title.split(': ')[1]}.`]);
  }
  const prize = awardComp(d);
  bus.emit('money:changed'); bus.emit('bag:changed'); invalidateMap('home'); sfx.found(); world.save();
  ui.banner('Club Champion!', prize.trophy ? 'A cup, $100 and giant tomato seeds' : '$100 and giant tomato seeds');
  return ui.say(['The old blokes take their hats off. Even Merv. Crazy Jeff hands over an envelope and a paper bag with "DO NOT EAT" on it.',
    'Crazy Jeff: "Giant tomato seeds. My dad\'s. They grow the size of a bowl. I have never given them to anyone."',
    `You won $${prize.money} and ${prize.seeds[1]} packets of giant tomato seeds.${prize.trophy ? ` And the ${ITEMS[prize.trophy].name}, for the cabinet at home.` : ''}`], { name: 'Crazy Jeff', portrait: npcIcon('crazyjeff') });
}
