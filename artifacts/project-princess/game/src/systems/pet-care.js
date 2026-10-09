// Phone care uses the same food preferences and recovery as battle treats.
import { addTutorial,completeTutorial } from './todo.js';
import { state } from './state.js';
import { PET_BY_ID } from '../data/pets.js';
import { isTreat } from '../data/items.js';
import { petFighter, readyTeam } from './battle.js';
import { bus } from '../bus.js';

export const recoveryFraction = { love: 0.6, like: 0.4, neutral: 0.25, dislike: 0.1 };
// Toys still build friendship in person, but cannot restore energy through the phone.
export const isHealingTreat = item => isTreat(item) && !['tennis', 'bluestring', 'ribbon', 'duckfeather', 'feather'].includes(item);
export function treatReaction(id, item) {
  const pet = PET_BY_ID[id];
  return pet.loves.includes(item) ? 'love' : pet.likes.includes(item) ? 'like' : pet.dislikes.includes(item) ? 'dislike' : 'neutral';
}
export function givePhoneTreat(id, item) {
  if (!PET_BY_ID[id] || !state.isFound(id) || !isHealingTreat(item) || state.count(item) < 1) return { ok: false, reason: 'Choose a food treat and a pet you have befriended.' };
  const f = petFighter(id);
  if (f.hp >= f.maxHp) return { ok: false, reason: `${f.name} already has full energy. Keep the treat for later.` };
  const reaction = treatReaction(id, item), rec = state.pet(id);
  const hp = Math.min(f.maxHp, f.hp + Math.ceil(f.maxHp * recoveryFraction[reaction]));
  state.removeItem(item);
  rec.reactions[item] = reaction;
  rec.hp = hp === f.maxHp ? null : hp;
  if (id === 'marty') { state.data.flags.martyCare = false; completeTutorial('marty-care'); }
  bus.emit('petdex:changed');
  state.save();
  return { ok: true, healed: hp - f.hp, hp, maxHp: f.maxHp, reaction, reason: `${f.name} ${reaction === 'love' ? 'loves' : reaction === 'like' ? 'likes' : reaction === 'dislike' ? 'reluctantly nibbles' : 'eats'} the treat. +${hp - f.hp} energy (${hp}/${f.maxHp}).` };
}
export function beginMartyCare() {
  const f = petFighter('marty');
  state.pet('marty').hp = Math.max(1, Math.floor(f.maxHp * 0.55));
  state.addItem('chicken', 2);
  state.data.flags.martyCare = true;
  addTutorial('marty-care', 'Restore energy with a treat', 'Open Pawphone → Bag, select a food treat and give it to Marty. Two chicken neckies are in your bag. This works for any befriended pet.');
  bus.emit('petdex:changed');
}
export function needsMartyCare() {
  if (!state.data.flags.martyCare || !state.isFound('marty')) return false;
  const f = petFighter('marty');
  return f.hp < f.maxHp;
}
export function martyApproach(region, x, y, approached, ownerPresent) {
  return region === 'woods' && !approached && ownerPresent && !state.isFound('marty') && !state.data.beaten.gordon && readyTeam().length > 0 && x >= 16 && x <= 24 && y >= 10 && y <= 15;
}
