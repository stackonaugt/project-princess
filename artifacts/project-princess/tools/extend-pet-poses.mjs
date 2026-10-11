// Offline pixel-art authoring only. Runtime animations use complete PNG frames.
// Re-running keeps the original frames; do not run over hand-edited action poses.
import sharp from 'sharp';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PETS } from '../game/src/data/pets.js';
import { PET_FRAMES, BASE_PALETTE } from '../game/src/art/sprites.js';

const root = new URL('../game/assets/sprites/', import.meta.url);
const SIZE = 16;
const blank = () => Buffer.alloc(SIZE * SIZE * 4);
const index = (x, y) => (y * SIZE + x) * 4;
const put = (target, source, x, y, dx, dy) => {
  if (dx < 0 || dx >= SIZE || dy < 0 || dy >= SIZE) return;
  const i = index(x, y);
  if (source[i + 3]) source.copy(target, index(dx, dy), i, i + 4);
};

// Lower-body boundaries follow each animal's shape, not a shared limb rig.
export const PET_POSE_SHEETS = [
  { id: 'princess', cut: 12, split: 7, originals: 3 },
  { id: 'princess-evolved', cut: 12, split: 7, originals: 3, source: 'princess-evolution' },
  { id: 'salami', cut: 12, split: 9 },
  { id: 'salami-evolved', cut: 12, split: 9 },
  { id: 'spooky', cut: 13, split: 9, bunny: true },
  { id: 'poppy', cut: 13, split: 7 },
  { id: 'poppy-evolved', cut: 13, split: 7, source: 'poppy-evolution' },
  { id: 'rusty', cut: 11, split: 7 },
  { id: 'rusty-evolved', cut: 11, split: 7 },
  { id: 'stanley', cut: 12, split: 8 },
  { id: 'stanley-evolved', cut: 12, split: 8 },
  { id: 'girlie', cut: 13, split: 8 },
  { id: 'girlie-evolved', cut: 13, split: 8 },
  { id: 'chloe', cut: 12, split: 8 },
  { id: 'chloe-evolved', cut: 12, split: 8 },
  { id: 'ziggy', cut: 12, split: 8 },
  { id: 'ziggy-evolved', cut: 12, split: 8 },
  { id: 'emilio', cut: 13, split: 8, bird: true },
  { id: 'marty', cut: 12, split: 8 },
  { id: 'marty-evolved', cut: 12, split: 8 },
];

function transform(source, position) {
  const target = blank();
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const next = position(x, y);
    if (next) put(target, source, x, y, ...next);
  }
  return target;
}

function walk(source, spec, phase) {
  const { cut, split } = spec;
  const steps = [[-1, 1, 0, 1], [1, -1, 1, 0], [0, 0, 1, 1]];
  const [hind, front, hindLift, frontLift] = steps[phase];
  return transform(source, (x, y) => y < cut ? [x, y] :
    [x + (x < split ? hind : front), y - (x < split ? hindLift : frontLift)]);
}

function jump(source, spec, phase) {
  const { cut, split } = spec;
  if (phase === 0) {
    // Gather the entire body, keeping ears, crowns and hats inside the frame.
    return transform(source, (x, y) => [x, 3 + Math.floor(y * .8)]);
  }
  if (phase === 1) {
    // Tuck the hind legs forwards and the forelegs backwards in mid-air.
    return transform(source, (x, y) => y < cut ? [x, y] :
      [x + (x < split ? 1 : -1), cut - 1 + Math.floor((y - cut) / 2)]);
  }
  // Stretch the forelegs towards landing while the hind feet trail behind.
  return transform(source, (x, y) => y < cut ? [x, y] :
    [x + (x < split ? -1 : 1), y - (x < split ? 1 : 0)]);
}

function paw(source, spec, phase) {
  const { cut, split, bunny, bird } = spec;
  // A duck raises a webbed foot; a bunny's short forepaw starts higher.
  const frontCut = bunny ? cut - 1 : cut;
  const frontStart = split + (bird ? 1 : 0);
  let minX = SIZE;
  for (let y = frontCut; y < SIZE; y++) for (let x = frontStart; x < SIZE; x++) {
    if (source[index(x, y) + 3]) minX = Math.min(minX, x);
  }
  if (minX === SIZE) throw new Error(`No front paw found for ${spec.id}`);
  const raised = transform(source, (x, y) => {
    if (x >= frontStart && y >= frontCut) return null;
    // Fold the hindquarters slightly for balance, preserving the upper body.
    return y >= cut && x < split ? [x + 1, y - 1] : [x, y];
  });
  const lift = [1, 3, 2][phase];
  for (let y = frontCut; y < SIZE; y++) for (let x = frontStart; x < SIZE; x++) {
    // Rotate the complete lower foreleg towards the nose rather than simply
    // lifting the entire sprite. Hold is horizontal; raise/lower are angled.
    const dx = Math.min(15, minX + y - frontCut);
    const dy = frontCut - lift + (phase === 1 ? -(x - minX) : Math.floor((x - minX) / 2));
    put(raised, source, x, y, dx, dy);
  }
  return raised;
}

async function exists(url) {
  try { await access(url); return true; } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

function builtIn(id) {
  const pet = PETS.find(p => p.id === id);
  if (!pet) throw new Error(`Unknown pet ${id}`);
  const palette = { ...BASE_PALETTE, ...pet.pal };
  return PET_FRAMES[pet.sprite].map(rows => {
    const pixels = blank();
    rows.forEach((row, y) => [...row].forEach((ch, x) => {
      if (ch === '.') return;
      const hex = palette[ch];
      if (!hex) throw new Error(`Missing palette colour ${id}/${ch}`);
      const i = index(x, y);
      pixels[i] = parseInt(hex.slice(1, 3), 16);
      pixels[i + 1] = parseInt(hex.slice(3, 5), 16);
      pixels[i + 2] = parseInt(hex.slice(5, 7), 16);
      pixels[i + 3] = 255;
    }));
    // Match the game's built-in one-pixel outline.
    const outlined = Buffer.from(pixels);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
      if (pixels[index(x, y) + 3]) continue;
      if ([[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].some(([nx, ny]) =>
        nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && pixels[index(nx, ny) + 3] > 40)) {
        outlined.set([42, 24, 16, 255], index(x, y));
      }
    }
    return outlined;
  });
}

async function originalFrames(url, count) {
  const { data, info } = await sharp(fileURLToPath(url)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.height !== SIZE || info.width < count * SIZE || info.width % SIZE) {
    throw new Error(`Unexpected source dimensions for ${url}`);
  }
  return Array.from({ length: count }, (_, frame) => {
    const out = blank();
    for (let y = 0; y < SIZE; y++) {
      const start = (y * info.width + frame * SIZE) * 4;
      data.copy(out, y * SIZE * 4, start, start + SIZE * 4);
    }
    return out;
  });
}

export async function extendPetPoses() {
  for (const spec of PET_POSE_SHEETS) {
    for (const template of [true, false]) {
      const target = new URL(`${template ? 'templates/' : ''}pets/${spec.id}.png`, root);
      let source = target;
      let count = template ? 2 : spec.originals || 2;
      if (!await exists(source)) {
        if (spec.source && !template) source = new URL(`pets/${spec.source}.png`, root);
        else if (spec.id !== 'marty') source = new URL(`templates/pets/${spec.id}.png`, root);
      }
      const frames = await exists(source) ? await originalFrames(source, count) : builtIn(spec.id);
      const idle = frames[0];
      for (let i = 0; frames.length < 5; i++) frames.push(walk(idle, spec, i));
      for (let i = 0; i < 3; i++) frames.push(jump(idle, spec, i));
      for (let i = 0; i < 3; i++) frames.push(paw(idle, spec, i));
      const sheet = Buffer.alloc(SIZE * SIZE * 4 * frames.length);
      for (let f = 0; f < frames.length; f++) for (let y = 0; y < SIZE; y++) {
        frames[f].copy(sheet, (y * SIZE * frames.length + f * SIZE) * 4, y * SIZE * 4, (y + 1) * SIZE * 4);
      }
      await sharp(sheet, { raw: { width: SIZE * frames.length, height: SIZE, channels: 4 } }).png().toFile(fileURLToPath(target));
      console.log(`Extended ${template ? 'template' : 'runtime'} ${spec.id}: ${frames.length} frames`);
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await extendPetPoses();
