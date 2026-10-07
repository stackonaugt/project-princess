import { lstat, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { ART_REQUIREMENTS, assetLayout, suppliedAssetPath } from '../game/src/art/asset-rules.js';

export async function inspectAsset(root, file, folder) {
  if (!suppliedAssetPath(file, folder)) throw new Error('Choose an asset from the supplied files in the matching folder.');
  // Do not follow symlinks out of the supplied asset directory.
  const directory = path.join(root, folder);
  if (!(await lstat(directory)).isDirectory()) throw new Error('Asset folder is missing or is a symlink.');
  const full = path.join(root, file);
  const stat = await lstat(full);
  if (!stat.isFile() || stat.size > 20 * 1024 * 1024) throw new Error('Asset must be a regular image file no larger than 20 MB.');
  const bytes = await readFile(full);
  const image = sharp(bytes, { failOn: 'warning', limitInputPixels: 4096 * 4096 });
  const metadata = await image.metadata();
  const format = path.extname(file) === '.png' ? 'png' : /\.jpe?g$/.test(file) ? 'jpeg' : 'webp';
  if (metadata.format !== format || (metadata.pages || 1) !== 1 ||
      (metadata.orientation && metadata.orientation !== 1)) {
    throw new Error('Use a non-animated image in its actual file format, with orientation applied.');
  }
  const layout = assetLayout(folder, metadata.width, metadata.height);
  // Fully decode: a valid header alone must not make a truncated file selectable.
  await image.raw().toBuffer();
  return layout;
}

export async function suppliedArtCatalog(root) {
  const assets = [];
  for (const folder of Object.keys(ART_REQUIREMENTS)) {
    let names;
    try { names = await readdir(path.join(root, folder)); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    for (const name of names.sort()) {
      if (name.startsWith('.')) continue;
      const file = `${folder}/${name}`;
      try {
        assets.push({ path: file, folder, valid: true, ...await inspectAsset(root, file, folder) });
      } catch (error) {
        assets.push({ path: file, folder, valid: false, error: error.code === 'ENOENT' ? 'File is missing.' : error.message });
      }
    }
  }
  return { requirements: ART_REQUIREMENTS, assets };
}

export async function validateEntityArt(custom, root) {
  const checked = new Set();
  for (const kind of ['pets', 'npcs']) for (const [id, entity] of Object.entries(custom?.[kind] || {})) {
    if (entity.art === undefined) continue;
    const slots = { sprite: kind, portrait: 'portraits', ...(kind === 'pets' && entity.record?.evolution ?
      { evolvedSprite: 'pets', evolvedPortrait: 'portraits' } : {}) };
    if (!entity.art || typeof entity.art !== 'object' || Array.isArray(entity.art)) {
      throw new Error(`${id} artwork assignments: expected an object of slot-to-filename assignments.`);
    }
    for (const [slot, file] of Object.entries(entity.art)) {
      const filename = typeof file === 'string' ? file : JSON.stringify(file);
      if (!Object.hasOwn(slots, slot)) {
        throw new Error(`${id} ${slot} (${filename}): unsupported artwork slot.`);
      }
      const cacheKey = `${slots[slot]}:${file}`;
      if (checked.has(cacheKey)) continue;
      try { await inspectAsset(root, file, slots[slot]); checked.add(cacheKey); }
      catch (error) {
        const reason = error.code === 'ENOENT' ? 'artwork file is missing.' : error.message;
        throw new Error(`${id} ${slot} (${filename}): ${reason}`);
      }
    }
  }
}

export async function validateBuildArt(gameRoot) {
  const authoringPath = path.join(gameRoot, 'src/authoring/overrides.json');
  let document;
  try {
    document = JSON.parse(await readFile(authoringPath, 'utf8'));
  } catch (error) {
    throw new Error(`Unable to read artwork assignments from ${authoringPath}: ${error.message}`);
  }
  await validateEntityArt(document.custom, path.join(gameRoot, 'assets/sprites'));
}
