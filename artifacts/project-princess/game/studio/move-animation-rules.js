import { MOVE_ANIMATIONS } from '../src/data/move-animations.js';

export function unsupportedMoveAnimations(document) {
  const unsupported = [];
  function visit(value, path = []) {
    if (!value || typeof value !== 'object') return;
    if (!Array.isArray(value) && Object.hasOwn(value, 'anim') && !MOVE_ANIMATIONS.includes(value.anim)) {
      unsupported.push({ path: path.join(' → '), value: value.anim });
    }
    if (Array.isArray(value)) value.forEach((item, index) => visit(item, [...path, String(index + 1)]));
    else for (const [key, child] of Object.entries(value)) visit(child, [...path, key]);
  }
  visit(document);
  return unsupported;
}

export function assertSupportedMoveAnimations(document) {
  const unsupported = unsupportedMoveAnimations(document);
  if (!unsupported.length) return;

  const details = unsupported.slice(0, 5).map(({ path, value }) =>
    `${path || 'move'}: ${JSON.stringify(value)}`);
  const remaining = unsupported.length > details.length
    ? `; and ${unsupported.length - details.length} more`
    : '';
  throw new Error(
    `Unsupported move animation for ${details.join('; ')}${remaining}. ` +
    `Supported animations: ${MOVE_ANIMATIONS.join(', ')}.`,
  );
}
