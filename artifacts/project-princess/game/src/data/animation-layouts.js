// Frame numbers are zero based. PNG sheets stay one horizontal row.
// Override a texture key here when it has extra action frames. Example:
// 'pet-princess': { idle:[0], walk:[1,2,3,4], jump:[5,6], sit:[7] },
// 'player-helen-down': { idle:[0], walk:[1,2,3,4], wave:[5,6], throw:[7,8] },
// Optional frameWidth/frameHeight allow rectangular frames instead of defaults.
export const ANIMATION_LAYOUTS = {};
export function animationFrames(key, count, action = "walk", builtIn = false) {
  const config = ANIMATION_LAYOUTS[key];
  const explicit = config?.[action];
  if (explicit)
    return explicit.filter((i) => Number.isInteger(i) && i >= 0 && i < count);
  if (action === "idle") return [0];
  if (action !== "walk") {
    if (builtIn && /^(player|npc)-/.test(key) && count >= 7)
      return action === "wave"
        ? [3, 4, 3]
        : action === "throw"
          ? [5, 6]
          : action === "reward"
            ? [3, 4]
            : [];
    return [];
  }
  // Existing two-frame sheets include the idle frame in their walk cycle.
  if (count <= 2) return Array.from({ length: count }, (_, i) => i);
  if (builtIn && /^(player|npc)-/.test(key)) return [1, 0, 2, 0];
  if (count === 3) return [1, 0, 2, 0];
  const reserved = new Set(
    Object.entries(config || {})
      .filter(([a, v]) => a !== "walk" && a !== "idle" && Array.isArray(v))
      .flatMap(([, v]) => v),
  );
  return Array.from({ length: count - 1 }, (_, i) => i + 1).filter(
    (i) => !reserved.has(i),
  );
}
export const frameAt = (frames, time, rate = 8) =>
  frames.length ? frames[Math.floor((time * rate) / 1000) % frames.length] : 0;
