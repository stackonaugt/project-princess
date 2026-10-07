// Shared by the development picker, save validation and runtime frame splitting.
export const ART_REQUIREMENTS = {
  pets: 'PNG, square frames in one horizontal row (16×16 or 32×32 recommended).',
  npcs: 'PNG, frames twice as tall as wide in one horizontal row (16×32 or 32×64 recommended).',
  portraits: 'PNG, JPEG or WebP, any aspect ratio up to 4096×4096; square recommended.',
};

export function assetLayout(folder, width, height) {
  if (![width, height].every(n => Number.isInteger(n) && n > 0 && n <= 4096)) {
    throw new Error('Image dimensions must be between 1 and 4096 pixels.');
  }
  if (folder === 'portraits') return { width, height, frames: 1 };
  const frameWidth = folder === 'pets' ? height : height / 2;
  if (!Number.isInteger(frameWidth) || width % frameWidth || width / frameWidth > 64) {
    throw new Error(`${ART_REQUIREMENTS[folder]} Sheet width must be an exact multiple of frame width, with 1–64 frames.`);
  }
  return { width, height, frameWidth, frameHeight: height, frames: width / frameWidth };
}

export function suppliedAssetPath(value, folder) {
  return typeof value === 'string' &&
    new RegExp(`^${folder}/[a-z0-9_-]+\\.${folder === 'portraits' ? '(png|jpe?g|webp)' : 'png'}$`).test(value);
}

export function entityArtBindings(custom = {}) {
  const bindings = [];
  for (const kind of ['pets', 'npcs']) for (const [id, entity] of Object.entries(custom[kind] || {})) {
    const prefix = kind === 'pets' ? 'pet' : 'npc';
    for (const [slot, key, folder] of [
      ['sprite', `${prefix}-${id}`, kind],
      ['portrait', `${kind === 'npcs' ? 'npcportrait' : 'portrait'}-${id}`, 'portraits'],
      ...(kind === 'pets' && entity.record?.evolution ? [
        ['evolvedSprite', `pet-${id}-evolved`, 'pets'],
        ['evolvedPortrait', `portrait-${id}-evolved`, 'portraits'],
      ] : []),
    ]) if (entity.art?.[slot]) bindings.push({ kind, id, slot, key, path: entity.art[slot], folder });
  }
  return bindings;
}

export function runtimeArtBindingFailures(bindings, inspectTexture) {
  const failures = [];
  for (const binding of bindings) {
    const label = `${binding.kind === 'pets' ? 'pet' : 'NPC'} "${binding.id}" ${binding.slot}`;
    const actual = inspectTexture(binding.key);
    if (!actual?.exists) {
      failures.push(`Assigned artwork for ${label} (${binding.path}) did not load as runtime texture "${binding.key}"; built-in artwork would be used.`);
      continue;
    }
    if (!actual.custom) {
      failures.push(`Assigned artwork for ${label} (${binding.path}) resolved to default texture "${binding.key}" instead of custom art.`);
      continue;
    }
    if (actual.path !== binding.path) {
      failures.push(`Assigned artwork for ${label} expected "${binding.path}" in texture "${binding.key}", but runtime loaded "${actual.path || 'an unknown path'}".`);
      continue;
    }
    try {
      assetLayout(binding.folder, actual.width, actual.height);
    } catch (error) {
      failures.push(`Assigned artwork for ${label} (${binding.path}) has incompatible runtime dimensions ${actual.width}×${actual.height}: ${error.message}`);
    }
  }
  return failures;
}
