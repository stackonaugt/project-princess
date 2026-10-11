// Fishing progress, without any screens (so it can be tested in Node): which
// rod you are using, how easy fights are, the daily limit per spot, logging a
// catch, and when the Coburg Lake comp is on. The trip and the comp themselves
// are in systems/fishing-trip.js; the numbers are in data/fishing.js.
import { state } from './state.js';
import { skill, awardSkill } from './player-skills.js';
import { fishingEase } from './fishing.js';
import { ITEMS } from '../data/items.js';
import { UPGRADES } from '../data/upgrades.js';
import { FISH, FISH_TABLES, FISH_XP, DAILY_FISH, COMP, rodFor } from '../data/fishing.js';
import { weekday } from '../data/routines.js';

const data = () => (state.data.fishing ||= { day: 0, caught: {}, log: {}, best: {}, member: false, compWeek: -1, compWins: 0 });

// The best rod you own (the one in use): its upgrade id, or null.
export function bestRod() {
  let best = null;
  for (const [id, u] of Object.entries(UPGRADES)) if (u.equipment === 'rod' && state.hasUpgrade(id) && (!best || u.rodTier > UPGRADES[best].rodTier)) best = id;
  return best;
}
export const rodTier = () => UPGRADES[bestRod()]?.rodTier || 0;
// Tackle in the bag (the golden lure) makes fights easier too. The best one counts.
export const lureEase = () => Math.max(0, ...Object.entries(ITEMS).filter(([id, it]) => it.equipment === 'tackle' && it.ease && state.count(id) > 0).map(([, it]) => it.ease));
export const fishingLevel = () => skill('fishing').level;
export const currentEase = () => fishingEase({ level: fishingLevel(), rodTier: Math.max(1, rodTier()), lure: lureEase() });

// A rod Bazza will sell you yet? Returns null when it can be bought, or why not.
export function rodLock(id) {
  const u = UPGRADES[id];
  if (!u?.equipment) return null;
  if (u.fishLevel && fishingLevel() < u.fishLevel) return `Fishing level ${u.fishLevel}`;
  if (u.needs && !state.hasUpgrade(u.needs)) return `Needs ${UPGRADES[u.needs].short || UPGRADES[u.needs].name.toLowerCase()}`;
  return null;
}

// Fish landed per spot reset each day.
function today() {
  const d = data();
  if (d.day !== state.data.day) { d.day = state.data.day; d.caught = {}; }
  return d;
}
export const caughtHere = zone => today().caught[zone] || 0;
export const fishedOut = zone => caughtHere(zone) >= DAILY_FISH;

// Pick what bites. Junk weighs half (you always use bait). With maxTier, fish
// a rod cannot hold are left out (the comp); otherwise they still bite.
export function rollFish(zone, { rng = Math.random, maxTier = Infinity } = {}) {
  const table = (FISH_TABLES[zone] || FISH_TABLES.default).filter(([id]) => rodFor(id) <= maxTier);
  const weight = ([id, w]) => (FISH[id]?.junk ? w / 2 : w);
  let r = rng() * table.reduce((a, e) => a + weight(e), 0);
  for (const e of table) { r -= weight(e); if (r <= 0) return e[0]; }
  return table[0][0];
}

// Log a landed catch: into the bag, the log, the biggest, today's count
// (not for junk, and not in the comp), and skill XP. Returns the XP.
export function recordCatch(id, size, zone, { comp = false } = {}) {
  const d = today(), f = FISH[id] || { tier: 0 };
  state.addItem(id);
  state.data.stats.fish = (state.data.stats.fish || 0) + 1;
  d.log[id] = (d.log[id] || 0) + 1;
  if (size?.kg && !f.junk) d.best[id] = Math.max(d.best[id] || 0, size.kg);
  if (!f.junk && !comp) d.caught[zone] = (d.caught[zone] || 0) + 1;
  const xp = f.junk ? FISH_XP.junk : FISH_XP.tiers[f.tier] || FISH_XP.tiers[0];
  awardSkill('fishing', xp);
  return xp;
}
export const recordLost = () => awardSkill('fishing', FISH_XP.lost);

// ------------------------------------------------------------ the comp
export const compWeek = (day = state.data.day) => Math.floor(day / 7);
export const compDay = (day = state.data.day) => weekday(day) === COMP.day;
export const compHours = (m = state.data.minutes) => m >= COMP.from * 60 && m < COMP.to * 60;
export const compOpen = () => compDay() && compHours() && data().compWeek !== compWeek();
export const isMember = () => !!data().member;
// Rare fish in the bag you could show Ross.
export const rareFish = () => Object.keys(FISH).filter(id => !FISH[id].junk && FISH[id].tier >= COMP.minTier && state.count(id) > 0);
export function joinComp() { data().member = true; }
export function startComp() { data().compWeek = compWeek(); }
// Rivals' bags for this comp, and where you came: place 0 is first.
export function compResults(kg, rng = Math.random) {
  const rows = COMP.rivals.map(r => ({ name: r.name, kg: Math.round((r.kg[0] + rng() * (r.kg[1] - r.kg[0])) * 100) / 100 }));
  rows.push({ name: 'You', kg: Math.round(kg * 100) / 100, you: true });
  rows.sort((a, b) => b.kg - a.kg || (a.you ? -1 : 1));
  return { rows, place: rows.findIndex(r => r.you) };
}
// Prizes for a place: money, and the cup and lure on your first win.
export function awardComp(place) {
  const d = data(), items = [];
  const money = COMP.prizes[place] || 0;
  if (money) state.addMoney(money);
  if (place === 0) {
    if (!d.compWins) for (const id of COMP.firstPrize) { state.addItem(id); items.push(id); }
    d.compWins++;
  }
  return { money, items };
}
