// Battle rules: levels, stats, damage, the enemy's choices. No drawing here;
// the BattleScene shows it all (src/scenes/BattleScene.js).
//
// Battles are play-fights. Nobody faints: they "have had enough" and, for
// your pets, run home to Allen St until they've had a rest.

import { PET_BY_ID } from '../data/pets.js';
import { ENEMIES, ENCOUNTERS } from '../data/enemies.js';
import { MOVES, PET_MOVES } from '../data/moves.js';
import { effectiveness } from '../data/types.js';
import { HEROES } from '../data/heroes.js';
import { state } from './state.js';

// The level each pet is at when you first befriend them.
export const START_LEVEL = { princess: 5, salami: 7, spooky: 8, poppy: 10, stanley: 12 };
export const MAX_LEVEL = 30;
// Moves of these types use the special stat instead of attack.
const SPECIAL_TYPES = new Set(['psychic', 'ghost', 'fairy']);

export const petLevel = id => state.pet(id).level || START_LEVEL[id] || 5;
export const xpToNext = lv => 12 + lv * 8;
export function xpReward(foe, trainer) { return Math.round((8 + foe.level * 5) * (trainer ? 1.5 : 1)); }

export function statsAt(base, lv) {
  const s = k => Math.floor(2 * base[k] * lv / 100) + 5;
  return { hp: Math.floor(2 * base.hp * lv / 100) + lv + 12, attack: s('attack'), defence: s('defence'), special: s('special'), speed: s('speed') };
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
  const d = PET_BY_ID[id], rec = state.pet(id), level = petLevel(id);
  const f = fighter({ side: 'mine', petId: id, name: d.name, type: d.type, level, base: d.stats, moves: PET_MOVES[id], tex: `pet-${id}`, faces: 'right' });
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

// A random wild encounter for this suburb, or null.
export function rollEncounter(suburb, night) {
  const table = (ENCOUNTERS[suburb] || []).filter(e => !(e.day && night));
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
  const stab = move.type === user.type ? 1.5 : 1;
  const critChance = 1 / 16 + (user.side === 'mine' ? user.hearts * 0.012 : 0);
  const crit = Math.random() < critChance;
  const mult = stab * eff * (crit ? 1.5 : 1) * (user.charged ? 2 : 1) * (0.85 + Math.random() * 0.15);
  const dmg = Math.max(1, Math.floor(((2 * user.level / 5 + 2) * move.power * A / D / 50 + 2) * mult));
  return { dmg, eff, crit };
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
    const before = f.maxHp;
    f.level = rec.level;
    f.stats = statsAt(f.base, f.level);
    f.maxHp = f.stats.hp;
    f.hp = Math.min(f.maxHp, f.hp + (f.maxHp - before));
  }
  return gained;
}

export { MOVES };
