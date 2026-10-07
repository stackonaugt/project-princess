// The story chapters (words in data/story.js). Saved as state.data.story:
//   chapter   0 = not started, 1..4 = the current chapter, 5 = the end
//   done      chapter -> the day it finished
//   ch2       { start, deadline, swapped, sickUntil, deposed, pie }
//   pranks    friend ids pranked in Chapter 3
//   invited   friend ids invited to the party in Chapter 4
//   party     { score, attendees, votes, won } once the party is over
//   heroBefore  who you were before Chapter 3 (Helen is away)
// WorldScene starts chapters (startChapter), plays the scenes, and calls
// checkStory() whenever something might have finished one.

import { state } from './state.js';
import { PETS } from '../data/pets.js';
import { ITEMS } from '../data/items.js';
import { CH1, CH3_PRANKS, CH4, PRANKS } from '../data/story.js';
import { NPCS } from '../data/npcs.js';
import { isArchived } from '../authoring/archive.js';
import { petLevel } from './battle.js';
import { isEvolved } from './forms.js';
import { isMeetingDay, weekday } from '../data/routines.js';

export const story = () => state.data.story;
export const chapterNow = () => state.data.story.chapter;
// Is this chapter the one being played right now (started, not finished)?
export const inChapter = n => state.data.story.chapter === n && !state.data.story.done[n];

// The spill vote: the second Tuesday after Paddy tells you about it.
export function spillDeadline(start) {
  let day = start + 1;
  while (!isMeetingDay(day)) day++;
  return day + 7;
}

const count = (n, of) => ` (${Math.min(n, of)}/${of})`;
export const drinkCount = () => Object.keys(ITEMS).filter(id => ITEMS[id].drink).reduce((a, id) => a + state.count(id), 0);
export const decoCount = () => Object.keys(ITEMS).filter(id => ITEMS[id].deco).reduce((a, id) => a + state.count(id), 0);
export const attendees = () => story().invited.filter(id => NPCS[id] && !isArchived('npcs', id) && state.friendHearts(id) >= CH4.rsvpHearts);

// The objectives for a chapter: [{ text, done }].
export function objectives(n = chapterNow()) {
  const s = story(), d = state.data;
  if (n === 1) {
    const found = state.foundCount(), trained = PETS.filter(p => state.isFound(p.id) && petLevel(p.id) >= CH1.level).length;
    const evolved = PETS.some(p => isEvolved(p.id));
    const list = [{ id: 'find-pets', text: `Find 6 of your friends' pets${count(found, CH1.find)}`, done: found >= CH1.find }];
    if (found < CH1.find) return list;   // the rest stay hidden until six are enrolled
    return [...list,
      { id: 'train-pets', text: `Train ${CH1.trained} pets to level ${CH1.level}${count(trained, CH1.trained)}`, done: trained >= CH1.trained },
      { id: 'evolve-pet', text: 'Evolve a pet (level and friendship both high enough)', done: evolved },
    ];
  }
  if (n === 2) {
    const c = s.ch2;
    return [
      { id: 'kitchen', destination: { region: 'bunnings' }, text: 'Build the kitchen (Olly, Bunnings Warehouse, Altona North)', done: state.hasUpgrade('kitchen') },
      { id: 'fish-pie', destination: { region: 'home', kind: 'cook' }, text: 'Cook a very dodgy fish pie at the stove (any fish, a lemon, and laxatives from Preston Market or the Brunswick East milk bar)', done: !!c.pie || state.count('fishpie') > 0 || !!c.swapped },
      { id: 'lunch-swap', destination: { region: 'civiccentre', kind: 'lunch' }, text: `Swap it for Cr Bentleigh's lunch in the civic centre foyer before the spill vote on ${weekday(c.deadline || 1)}, day ${c.deadline || '?'}`, done: !!c.swapped },
    ];
  }
  if (n === 3) return [
    { id: 'prank-friends', text: `Prank ${CH3_PRANKS} of Helen's friends: Paddy, Corni, Mem, Rose, Slinks, Sinead, Tim or Nicholas. Visit them first to look for a prank${count(s.pranks.length, CH3_PRANKS)}`, done: s.pranks.length >= CH3_PRANKS },
    // Each prank you have planned: buy the thing, then go back and pull it.
    ...state.data.side.scouted.filter(id => PRANKS[id]).map(id => ({ id: `prank-${id}`, destination: state.count(PRANKS[id].item) ? { npc: id } : undefined, text: `${PRANKS[id].label} on ${NPCS[id]?.name || id}: ${state.count(PRANKS[id].item) || s.pranks.includes(id) ? 'go back and pull it' : `buy it at ${PRANKS[id].where}`}`, done: s.pranks.includes(id) })),
  ];
  if (n === 4) {
    const rooms = CH4.rooms.filter(id => state.hasUpgrade(id)).length;
    return [
      { id: 'renovations', destination: { region: 'bunnings' }, text: `Finish the renovations: kitchen, twins' room, study (Bunnings)${count(rooms, CH4.rooms.length)}`, done: rooms >= CH4.rooms.length },
      { id: 'drinks', destination: { region: 'bottleshop' }, text: `Party drinks from the bottle shop${count(drinkCount(), CH4.drinks)}`, done: drinkCount() >= CH4.drinks },
      { id: 'decorations', destination: { region: 'bunnings' }, text: `Decorations from Bunnings${count(decoCount(), CH4.decos)}`, done: decoCount() >= CH4.decos },
      { id: 'invitations', text: `Invite friends (talk to them). Those with ${CH4.rsvpHearts}+ hearts will come${count(s.invited.length, CH4.invites)}`, done: s.invited.length >= CH4.invites },
      { id: 'party', text: 'Throw the party! (Story app on the Pawphone)', done: !!s.party },
    ];
  }
  return [];
}

// Chapter 4: everything ready except the party itself?
export const partyReady = () => inChapter(4) && objectives(4).slice(0, 4).every(o => o.done);

// Chapter 1 and 3 finish on their own; 2 finishes with the lunch swap (or the
// spill), 4 with the party.
export const chapterFinished = n => inChapter(n) && (n === 1 || n === 3) && objectives(n).every(o => o.done);

// How Paddy goes at the election: a base, plus party guests, plus how well the
// party games went, plus being the sitting mayor. 50 or more wins.
export function electionVotes(score, guests) {
  const s = story();
  const v = 24 + Math.min(30, guests * 3) + score * 1.8 + (s.ch2.deposed ? 0 : 10) + Math.min(6, state.data.council.passed.length * 2);
  return Math.max(18, Math.min(78, Math.round(v)));
}
