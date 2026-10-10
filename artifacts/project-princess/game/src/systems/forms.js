// Pet forms: a pet's current name, type, stats, moves and texture, which
// change when it evolves. Use form(id) instead of reading PET_BY_ID directly
// whenever the evolved form matters.

import { PET_BY_ID } from '../data/pets.js';
import { PET_MOVES } from '../data/moves.js';
import { state } from './state.js';

export const isEvolved = id => !!(state.pet(id).evolved && PET_BY_ID[id]?.evolution);

export function form(id) {
  const d = PET_BY_ID[id];
  const base = { ...d, moves: PET_MOVES[id], baseName: d.name };
  return isEvolved(id) ? { ...base, ...d.evolution, baseName: d.name } : base;
}

// Authored pet dialogue can use the base-form name while the pet keeps its
// identity after evolving. Display the name of its current form instead.
export function formText(id, text) {
  if (typeof text !== 'string') return text;
  const current = form(id);
  return current.baseName === current.name
    ? text
    : text.replaceAll(current.baseName, current.name);
}

export const petTex = id => (isEvolved(id) ? `pet-${id}-evolved` : `pet-${id}`);

// Ready to evolve: has an evolution, not yet evolved, level and hearts met.
export function canEvolve(id, level) {
  const e = PET_BY_ID[id]?.evolution, rec = state.pet(id);
  if (!e || rec.evolved || !rec.found) return false;
  return (level ?? rec.level) >= e.level && state.hearts(id) >= e.hearts;
}

export function evolve(id) {
  state.pet(id).evolved = true;
  state.pet(id).hp = null;
}

// What the Petdex says about a pet's evolution.
export function evolutionHint(id) {
  const e = PET_BY_ID[id]?.evolution;
  if (!e) return null;
  if (isEvolved(id)) return `Evolved from ${PET_BY_ID[id].name}.`;
  return `Something stirs in ${PET_BY_ID[id].name}. Reach level ${e.level} with ${e.hearts} hearts of friendship and see what happens.`;
}
