// Progress belongs to the selected playable character, not a pet.
import { state } from "./state.js";
import { bus } from "../bus.js";
export const SKILLS = {
  cooking: {
    name: "Cooking",
    source: "Cook meals and practise your competition bake.",
    perk: "Every two levels add one point to your bake-off entry.",
  },
  crafting: {
    name: "Crafting",
    source: "Make toys, equipment and supplies at the yard workbench.",
    perk: "Level 2 unlocks weave poles; level 3 unlocks the training vest.",
  },
  handling: {
    name: "Pet handling",
    source: "Successful school lessons and daily course practice.",
    perk: "Each level adds 5% to successful pet training XP.",
  },
  combat: {
    name: "Combat",
    source: "Complete supervised sparring sessions in the yard.",
    perk: "Each level adds attack strength and stamina to player sparring.",
  },
  gathering: {
    name: "Gathering",
    source: "Harvest crops, forage and catch fish.",
    perk: "Every three levels gives one extra crop on harvest.",
  },
};
export const threshold = (level) => 40 * level * (level - 1);
export function skillProgress(xp = 0) {
  xp = Math.max(0, Math.min(3600, Number(xp) || 0));
  let level = 1;
  while (level < 10 && xp >= threshold(level + 1)) level++;
  return {
    xp,
    level,
    current: xp - threshold(level),
    needed: level === 10 ? 0 : threshold(level + 1) - threshold(level),
    fraction:
      level === 10
        ? 1
        : (xp - threshold(level)) / (threshold(level + 1) - threshold(level)),
  };
}
export function skill(id, hero = state.data.hero || "helen") {
  return skillProgress(state.data.playerSkills?.[hero]?.[id]);
}
export function awardSkill(id, xp) {
  if (!SKILLS[id] || !Number.isFinite(xp) || xp <= 0) return null;
  const hero = state.data.hero || "helen";
  state.data.playerSkills ??= {};
  state.data.playerSkills[hero] ??= {};
  const before = skill(id);
  state.data.playerSkills[hero][id] = Math.min(
    3600,
    before.xp + Math.floor(xp),
  );
  const after = skill(id);
  bus.emit("player:skill", id, after.level > before.level ? after.level : null);
  return after;
}
export const trainingXp = (score) =>
  Math.round(
    (8 + score * 10) * (1 + (score ? (skill("handling").level - 1) * 0.05 : 0)),
  );
