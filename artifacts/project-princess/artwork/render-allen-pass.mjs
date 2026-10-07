// A restrained pixel-art pass over the original templates, not a new silhouette.
// Run from any directory: node artifacts/project-princess/artwork/render-allen-pass.mjs
// ImageMagick is only needed for editing; the game loads the resulting PNGs.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { shade } from '../game/src/art/paint/painter.js';

const sprites = fileURLToPath(new URL('../game/assets/sprites/', import.meta.url));
const palette = new Map();
const family = (oldColour, newColour, factors) => {
  for (const factor of factors) palette.set(shade(oldColour, factor), shade(newColour, factor));
};

// Keep the tile shapes, brick courses and shade groups intact.
family('#b4553a', '#ad513d', [-0.35, -0.25, -0.1, -0.08, 0, 0.15, 0.28]);
family('#d4a86a', '#d0a16c', [-0.28, -0.18, -0.12, -0.05, 0, 0.08, 0.28]);
family('#f4f0e6', '#f5edd8', [-0.3, -0.25, -0.2, -0.15, 0, 0.1]);
for (const [from, to] of [
  ['#5a7a98', '#31577f'], ['#7a9ab8', '#6093b6'], ['#b8d4e8', '#c3dfe8'],
  ['#5a6a7a', '#345773'], ['#8aa4b8', '#8bb1c3'],
  ['#3f8a3e', '#397c4b'], ['#f5e66b', '#efca65'], ['#f28bb0', '#e996ae'],
  ['#7a8a4a', '#6e7d4a'],
]) palette.set(from, to);

for (const name of ['hphouse-allen', 'hproof-yard']) {
  const args = [join(sprites, 'templates/objects', `${name}.png`)];
  for (const [from, to] of palette) args.push('-fill', to, '-opaque', from);
  if (name === 'hphouse-allen') {
    // A shallow eave shadow and porch recess add depth without moving the door.
    args.push('-fill', 'rgba(53,47,57,0.18)', '-draw', 'rectangle 5,55 130,57');
    args.push('-fill', 'rgba(53,47,57,0.25)', '-draw', 'rectangle 77,55 95,57');
  }
  args.push('-depth', '8', '-strip', '-define', 'png:color-type=6',
    join(sprites, 'objects', `${name}.png`));
  execFileSync('magick', args);
}
