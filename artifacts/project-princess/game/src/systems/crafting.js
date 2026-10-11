import { invalidateMap } from "../data/regions.js";
import { state } from "./state.js";
import { CRAFT_RECIPES, MATERIAL_ALTS, MATERIAL_NAMES } from "../data/crafting.js";
import { ITEMS } from "../data/items.js";
import { skill, awardSkill } from "./player-skills.js";
// How much of a material you have: scrap plus any new stock that stands in for it.
export const materialCount = k => [k, ...(MATERIAL_ALTS[k] || [])].reduce((n, x) => n + state.count(x), 0);
export const materialName = k => MATERIAL_NAMES[k] || ITEMS[k]?.name || k;
// Use scrap first, then new stock.
function useMaterial(k, n) {
  for (const x of [k, ...(MATERIAL_ALTS[k] || [])]) { const take = Math.min(n, state.count(x)); if (take) state.removeItem(x, take); n -= take; if (!n) return; }
}
export function craftReason(id) {
  const r = CRAFT_RECIPES[id];
  if (!r) return "Unknown recipe";
  if (r.requires && !state.count(r.requires)) return `Make ${CRAFT_RECIPES[r.requires].name.toLowerCase()} first`;
  if (r.unique && state.count(id)) return "Already made";
  if (skill("crafting").level < r.level)
    return `Crafting level ${r.level} required`;
  const missing = Object.entries(r.needs).filter(
    ([k, n]) => materialCount(k) < n,
  );
  return missing.length ? "More materials needed" : null;
}
export function craft(id) {
  const reason = craftReason(id);
  if (reason) return { ok: false, reason };
  const r = CRAFT_RECIPES[id];
  for (const [k, n] of Object.entries(r.needs)) useMaterial(k, n);
  state.addItem(id);
  if (['coursekit','courseextension','weavekit'].includes(id)) invalidateMap('yard');
  awardSkill("crafting", r.xp);
  state.save();
  return { ok: true, xp: r.xp };
}
