// Battle rules: levels, stats, damage, the enemy's choices. No drawing here;
// the BattleScene shows it all (src/scenes/BattleScene.js).
//
// Battles are play-fights. Nobody faints: they "have had enough" and, for
// your pets, run home to Allen St until they've had a rest.

import { PET_BY_ID } from '../data/pets.js';
import { ENEMIES, ENCOUNTERS, TRAINERS } from '../data/enemies.js';
import { MOVES, PET_MOVES } from '../data/moves.js';
import { effectiveness, typeList, TYPES } from '../data/types.js';
import { bus } from '../bus.js';
import { form, petTex } from './forms.js';
import { GEAR } from '../data/gear.js';
import { SPELLS } from '../data/east.js';
import { HEROES } from '../data/heroes.js';
import { state } from './state.js';
import { BALANCE } from '../config.js';
import { TUNING } from '../data/tuning.js';

// The level each pet is at when you first befriend them.
export const START_LEVEL = { marty: 5, princess: 5, salami: 7, spooky: 8, poppy: 10, stanley: 12, ziggy: 14, emilio: 14 };
export const MAX_LEVEL = 30;
// Moves of these types use the special stat instead of attack.
const SPECIAL_TYPES = new Set(['psychic', 'ghost', 'fairy']);

export const petLevel = id => state.pet(id).level || START_LEVEL[id] || 5;
export const xpToNext = lv => Math.round(BALANCE.xpBase + lv * lv * BALANCE.xpCurve);
export function xpReward(foe, trainer) { return Math.round((8 + foe.level * 5) * (trainer ? 1.5 : 1) * BALANCE.xp); }
// Prize money: a little from wild things, more from trainers.
export const wildMoney = foe => Math.round((TUNING.money.wildBase + Math.floor(foe.level * TUNING.money.wildPerLevel + Math.random() * 4)) * BALANCE.money * TUNING.money.allMoney);

export function statsAt(base, lv) {
  const s = k => Math.floor(2 * base[k] * lv / 100) + 5;
  return { hp: Math.floor((2 * base.hp * lv / 100 + lv + 12) * BALANCE.hp), attack: s('attack'), defence: s('defence'), special: s('special'), speed: s('speed') };
}

// A protection spell from the milk bar lasts the rest of the day, and helps
// every pet on your team (data/east.js).
export function spellBonus() {
  const sp = state.data.spell;
  return sp && sp.day === state.data.day ? SPELLS[sp.id]?.bonus || {} : {};
}

// Stats at a level, with the pet's gear bonus (and today's spell) on top.
export function fighterStats(f) {
  const s = statsAt(f.base, f.level), b = { ...GEAR[f.gear]?.bonus || {} }, sp = f.side === 'mine' ? spellBonus() : {};
  for (const k of ['attack', 'defence', 'speed', 'special']) {
    const m = (b[k] || 1) * (sp[k] || 1);
    if (m !== 1) s[k] = Math.round(s[k] * m);
  }
  return s;
}
export function gearBonus(f) {
  const gd = GEAR[f.gear];
  const g = gd && (!gd.forType || typeList(f.type).includes(gd.forType)) ? gd.bonus : {};
  if (f.side !== 'mine') return g;
  const sp = spellBonus(), out = { ...g };
  for (const k of ['crit', 'regen']) if (sp[k]) out[k] = (out[k] || 0) + sp[k];
  return out;
}

function fighter(o) {
  const stats = statsAt(o.base, o.level);
  return {
    stages: { atk: 0, def: 0 }, evade: false, charged: false, held: null, lastMove: null, hearts: 0,
    ...o, stats, maxHp: stats.hp, hp: o.hp ?? stats.hp,
  };
}

// One of your pets, with its saved health.
export function petFighter(id) {
  const d = form(id), rec = state.pet(id), level = petLevel(id);
  const f = fighter({ side: 'mine', petId: id, name: d.name, type: d.type, level, base: d.stats, moves: d.moves, tex: petTex(id), faces: 'right' });
  f.gear = rec.gear || null;
  f.stats = fighterStats(f);
  if (rec.hp != null) f.hp = Math.max(0, Math.min(f.maxHp, rec.hp));
  f.hearts = state.hearts(id);
  return f;
}

// Someone else's: a wild thing, a bin, or an owner's pet ('pet:<id>').
export function foeFighter(id, level) {
  if (id.startsWith('pet:')) {
    const pid = id.slice(4), d = PET_BY_ID[pid];
    return fighter({ side: 'foe', petId: pid, id, name: d.name, type: d.type, level, base: d.stats, moves: PET_MOVES[pid], tex: `pet-${pid}`, faces: 'right', owned: true });
  }
  const e = ENEMIES[id];
  return fighter({ side: 'foe', id, name: e.name, type: e.type, level, base: e.stats, moves: e.moves, tex: `foe-${id}`, held: e.held || null, faces: e.faces || 'right', float: !!e.float });
}

// Pets on your team who still have energy.
export const readyTeam = () => state.data.party.filter(id => state.isFound(id) && state.pet(id).hp !== 0);

// Level scaling. Foes follow how strong your team is: a little below it
// while your pets are young, level with it in the middle of the game and a
// touch above it once they are seasoned. `power` blends the team's average
// and best level, so one strong pet carrying two babies still counts.
export const SCALING = { easyGap: -2, hardGap: 3, from: 5, to: 25, maxAbove: 2 };
export function teamPower(team = readyTeam()) {
  const ids = team.length ? team : state.data.party.filter(id => state.isFound(id));
  if (!ids.length) return null;
  const lvs = ids.map(petLevel);
  return (lvs.reduce((a, b) => a + b, 0) / lvs.length + Math.max(...lvs)) / 2;
}
export function scaledLevel(power) {
  const k = Math.max(0, Math.min(1, (power - SCALING.from) / (SCALING.to - SCALING.from)));
  return power + SCALING.easyGap + (SCALING.hardGap - SCALING.easyGap) * k;
}
const clampLevel = lv => Math.max(1, Math.min(MAX_LEVEL, Math.round(lv)));
// A wild thing: never more than a couple of levels above what your team can
// handle (so a tough suburb is not a wall early on), and never below it (so
// Laverton's bags keep up with you).
export function scaleWild(encounter, power = teamPower()) {
  if (!encounter || power == null) return encounter;
  const fair = scaledLevel(power) + (Math.random() * 2 - 1);
  return { ...encounter, level: clampLevel(Math.max(fair, Math.min(encounter.level, fair + SCALING.maxAbove))) };
}
// A trainer: first fights ease off for a weak team but never go above what
// is written for them; rematches grow with you but never drop below it.
// Once-only story fights (Julie's tutorial) stay exactly as written.
export function scaleTrainer(id, team, power = teamPower()) {
  const t = TRAINERS[id];
  if (!t || t.once || power == null) return team;
  const fair = scaledLevel(power) + 1, beaten = !!state.data.beaten[id];
  return team.map(([foe, level]) => [foe, clampLevel(beaten ? Math.max(level, fair) : Math.min(level, fair + SCALING.maxAbove + 1))]);
}

// A first pet should be able to win a second before needing a full team.
// Full rosters remain on rematches and when travelling with multiple pets.
export function trainerTeam(id) {
  return scaleTrainer(id, baseTrainerTeam(id));
}
function baseTrainerTeam(id) {
  const team = TRAINERS[id].team;
  const party = readyTeam();
  // Marty's gentle first match is written to stay gentle.
  if (id === 'gordon' && !state.data.beaten.gordon && !state.isFound('marty')) return [['pet:marty', 3]];
  if (party.length !== 1 || state.data.beaten[id]) return team;
  const lv = petLevel(party[0]);
  if (id === 'rose' || id === 'adam') return [[team.at(-1)[0], Math.min(team.at(-1)[1], Math.max(4, lv))]];
  if (id === 'binman') return team.slice(0, 2).map(([foe, level]) => [foe, Math.min(level, Math.max(3, lv - 1))]);
  if (id === 'mrwilkinson') return [[team[0][0], Math.min(team[0][1], lv + 1)]];
  return team;
}

export function starterEncounter(encounter, suburb) {
  const team = readyTeam();
  if (!encounter || team.length !== 1 || !['laverton', 'footscray', 'brunswick', 'brunswickeast'].includes(suburb)) return encounter;
  return { ...encounter, level: Math.min(encounter.level, Math.max(2, petLevel(team[0]) - 1)) };
}

// A random wild encounter for this suburb, or null.
export function rollEncounter(suburb, night, zone) {
  const table = (ENCOUNTERS[suburb] || []).filter(e => !(e.day && night) && (!e.zones || e.zones.includes(zone)));
  const weight = e => (night && e.night) || e.weight;
  let r = Math.random() * table.reduce((a, e) => a + weight(e), 0);
  for (const e of table) {
    r -= weight(e);
    if (r <= 0) return { id: e.id, level: e.lv[0] + Math.floor(Math.random() * (e.lv[1] - e.lv[0] + 1)) };
  }
  return null;
}

const stageMult = s => (s >= 0 ? (2 + s) / 2 : 2 / (2 - s));

export function damage(user, target, move) {
  const special = SPECIAL_TYPES.has(move.type);
  const A = (special ? user.stats.special : user.stats.attack) * stageMult(user.stages.atk);
  const D = (special ? (target.stats.special + target.stats.defence) / 2 : target.stats.defence) * stageMult(target.stages.def);
  const eff = effectiveness(move.type, target.type);
  learnMatchups(move.type, target.type);
  const stab = typeList(user.type).includes(move.type) ? 1.5 : 1;
  const critChance = 1 / 16 + (user.side === 'mine' ? user.hearts * 0.012 + (gearBonus(user).crit || 0) : 0);
  const crit = Math.random() < critChance;
  const mult = BALANCE.damage * stab * eff * (crit ? 1.5 : 1) * (user.charged ? 2 : 1) * (0.85 + Math.random() * 0.15);
  const dmg = Math.max(1, Math.floor(((2 * user.level / 5 + 2) * move.power * A / D / 50 + 2) * mult));
  return { dmg, eff, crit };
}

// Type matchups you've tried in battle (state.data.matchups, 'fire>water', neutral
// ones too). The move menu only says Strong or Weak once you have tried that move's
// type on every one of the foe's types; the Petdex lists the strong and weak ones.
function learnMatchups(atk, defType) {
  const seen = state.data.matchups;
  for (const t of typeList(defType)) {
    const key = `${atk}>${t}`;
    if (seen.includes(key)) continue;
    seen.push(key);
    const e = effectiveness(atk, t);
    if (e !== 1) bus.emit('matchup:learnt', `${TYPES[atk].name} is ${e > 1 ? 'strong' : 'weak'} against ${TYPES[t].name}`);
  }
}

// What the move menu may show: the effectiveness once it has been tried, else null.
export function knownEffect(atk, defType) {
  const seen = state.data.matchups;
  return typeList(defType).every(t => seen.includes(`${atk}>${t}`)) ? effectiveness(atk, defType) : null;
}

// Close friends sometimes refuse to give up (hang on with 1 HP).
export function refusesToLose(f) {
  return f.side === 'mine' && f.hearts >= 6 && f.hp > 1 && Math.random() < f.hearts * 0.035;
}

export function runChance(mine, foe, tries) {
  const boost = HEROES[state.data.hero]?.perk.runBoost ? 0.25 : 0;
  return Math.min(0.97, 0.55 + 0.35 * (mine.stats.speed / Math.max(1, foe.stats.speed)) + tries * 0.15 + boost);
}

// The enemy's choice: heal when hurt, prefer moves that hit hard.
export function chooseFoeMove(foe, target) {
  const opts = foe.moves.map(id => {
    const m = MOVES[id], e = m.effect || {};
    let w;
    if (e.heal) w = foe.hp / foe.maxHp < 0.45 ? 3 : 0.15;
    else if (m.power > 0) w = 1 + (m.power / 45) * effectiveness(m.type, target.type);
    else if (e.charge) w = foe.charged ? 0 : 0.7;
    else if (e.evade) w = foe.lastMove === id ? 0.1 : 0.6;
    else w = foe.lastMove === id ? 0.2 : 0.7;
    if (e.usesHeld && !foe.held) w = Math.min(w, 0.15);   // it might still reach for it. Comedy.
    return [id, w];
  });
  let r = Math.random() * opts.reduce((a, [, w]) => a + w, 0);
  for (const [id, w] of opts) { r -= w; if (r <= 0) return id; }
  return opts[0][0];
}

// Write a pet's battle result back into the save.
export function saveFighter(f) {
  const rec = state.pet(f.petId);
  rec.hp = f.hp >= f.maxHp ? null : f.hp;
  rec.level = f.level;
}

// Add experience; returns the list of levels gained.
export function gainXp(f, xp) {
  const rec = state.pet(f.petId), gained = [];
  rec.level = rec.level || f.level;
  rec.xp = (rec.xp || 0) + xp;
  while (rec.level < MAX_LEVEL && rec.xp >= xpToNext(rec.level)) {
    rec.xp -= xpToNext(rec.level);
    rec.level++;
    gained.push(rec.level);
  }
  if (gained.length) {
    f.level = rec.level;
    f.stats = fighterStats(f);
    f.maxHp = f.stats.hp;
    f.hp = f.maxHp;   // levelling up restores all energy
  }
  return gained;
}

export { MOVES };
