// The requests board: each day two townsfolk you've met ask for something
// they like. Give it to them (as their gift for the day) for a bonus: some
// money and extra friendship. Shown in the Pawphone's Requests app, and with
// a "!" over their heads. Requests are picked from the day number, so they
// stay the same if you reload.
import { NPCS } from './npcs.js';
import { isArchived } from '../authoring/archive.js';
import { ITEMS } from './items.js';
import { friendInfo } from './friends.js';
import { rng } from '../util.js';

export const REQUESTS_PER_DAY = 2;
export const REQUEST_BONUS = { money: [12, 30], points: 20 };
const ASKS = [
  '{who} would really love {item}.',
  '{who} is after {item}. Today, if possible.',
  '{who} asked around for {item}. Can you help?',
];

// Today's requests: [{ id, who, item, money, text }]
export function requestsFor(day, metIds) {
  const r = rng(day * 977 + 13);
  const pool = metIds.filter(id => NPCS[id] && !isArchived('npcs', id) && !['stranger'].includes(id));
  const out = [];
  for (let tries = 0; out.length < REQUESTS_PER_DAY && tries < 30; tries++) {
    const who = pool[Math.floor(r() * pool.length)];
    if (!who || out.some(q => q.who === who)) continue;
    const fi = friendInfo(who);
    const wants = [...fi.loves, ...fi.likes].filter(i => ITEMS[i] && (ITEMS[i].price || ITEMS[i].crop));
    if (!wants.length) continue;
    const item = wants[Math.floor(r() * wants.length)];
    const money = REQUEST_BONUS.money[0] + Math.floor(r() * (REQUEST_BONUS.money[1] - REQUEST_BONUS.money[0]));
    const text = ASKS[Math.floor(r() * ASKS.length)].replace('{who}', NPCS[who].name).replace('{item}', `a ${ITEMS[item].name.toLowerCase()}`);
    out.push({ id: `${day}-${who}`, who, item, money, text });
  }
  return out;
}
