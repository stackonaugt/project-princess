// Frame numbers are zero based. PNG sheets stay one horizontal row.
// Override a texture key here when it has extra action frames. Example:
// 'pet-princess': { idle:[0], walk:[1,2,3,4], jump:[5,6], sit:[7] },
// 'player-helen-down': { idle:[0], walk:[1,2,3,4], wave:[5,6], throw:[7,8] },
// Optional frameWidth/frameHeight allow rectangular frames instead of defaults.
const petActions = () => ({
  minFrames: 11,
  idle: [0],
  walk: [1, 2, 3, 4],
  jump: [5, 6, 7],
  paw: [8, 9, 10],
});
export const ANIMATION_LAYOUTS = {
  'pet-princess': petActions(),
  'pet-princess-evolved': petActions(),
  'pet-salami': petActions(),
  'pet-salami-evolved': petActions(),
  'pet-spooky': petActions(),
  'pet-poppy': petActions(),
  'pet-poppy-evolved': petActions(),
  'pet-rusty': petActions(),
  'pet-rusty-evolved': petActions(),
  'pet-stanley': petActions(),
  'pet-stanley-evolved': petActions(),
  'pet-girlie': petActions(),
  'pet-girlie-evolved': petActions(),
  'pet-chloe-evolved': petActions(),
  'pet-ziggy-evolved': petActions(),
  'pet-marty-evolved': petActions(),
  'pet-chloe': petActions(),
  'pet-ziggy': petActions(),
  'pet-emilio': petActions(),
  'pet-marty': petActions(),
  'pet-spooky-evolved': {
    minFrames: 11,
    idle: [0],
    walk: [1, 2, 3, 4],
    jump: [5, 6, 7],
    paw: [8, 9, 10],
  },
};
export function animationFrames(key, count, action = "walk", builtIn = false) {
  const layout = ANIMATION_LAYOUTS[key];
  // Older/replacement sheets keep their normal walk fallback until they
  // contain the whole mapped layout.
  const config = count < (layout?.minFrames || 0) ? undefined : layout;
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
  // A partially exported action sheet must not turn jump/paw poses into
  // walking frames. Keep legacy 1–3-frame replacements' fallback unchanged.
  if (!config && layout?.walk && count > Math.max(...layout.walk)) {
    return layout.walk.filter((i) => Number.isInteger(i) && i >= 0 && i < count);
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

// Actions follow their own progress rather than looping on the world clock.
export function actionFrameAt(frames, progress = 0) {
  if (!frames.length) return 0;
  const p = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  return frames[Math.min(frames.length - 1, Math.floor(p * frames.length))];
}
