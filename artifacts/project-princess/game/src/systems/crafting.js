import { state } from "./state.js";
import { CRAFT_RECIPES } from "../data/crafting.js";
import { skill, awardSkill } from "./player-skills.js";
export function craftReason(id) {
  const r = CRAFT_RECIPES[id];
  if (!r) return "Unknown recipe";
  if (r.unique && state.count(id)) return "Already made";
  if (skill("crafting").level < r.level)
    return `Crafting level ${r.level} required`;
  const missing = Object.entries(r.needs).filter(
    ([k, n]) => state.count(k) < n,
  );
  return missing.length ? "More materials needed" : null;
}
export function craft(id) {
  const reason = craftReason(id);
  if (reason) return { ok: false, reason };
  const r = CRAFT_RECIPES[id];
  for (const [k, n] of Object.entries(r.needs)) state.removeItem(k, n);
  state.addItem(id);
  awardSkill("crafting", r.xp);
  state.save();
  return { ok: true, xp: r.xp };
}
