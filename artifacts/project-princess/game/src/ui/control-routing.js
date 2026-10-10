// Dialogues own player input whenever they are open. Activity state can outlast
// a scene transition, so it must never prevent a visible prompt being cleared.
export function routeControlInput(kind, handlers, dx = 0, dy = 0) {
  const { dialog, activity, battle, modal, world } = handlers;
  if (dialog && (kind !== 'direction' || (dialog.choices && dy))) {
    return dialog[kind]?.(dx, dy);
  }
  if (kind === 'direction') {
    if (activity) return;
    if (battle) return battle.direction?.(dx, dy);
    if (modal) return modal.direction?.(dx, dy);
    return;
  }
  if (activity) return activity[kind]?.();
  if (battle) return battle[kind]?.();
  if (modal) return modal[kind]?.();
  if (kind === 'action') return world?.action?.();
}
