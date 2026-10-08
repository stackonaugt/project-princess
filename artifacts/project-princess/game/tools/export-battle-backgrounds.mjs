// Export editable PNG starting points based on BattleScene's built-in art.
// Run: node tools/export-battle-backgrounds.mjs
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { hash } from '../src/util.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets/sprites/backgrounds/templates');
await mkdir(root, { recursive: true });
const W = 320, H = 180, horizon = 66, unit = 3;
const rgb = n => `#${n.toString(16).padStart(6, '0')}`;
const rect = (x, y, w, h, color, opacity = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" opacity="${opacity}"/>`;
const ellipse = (cx, cy, rx, ry, color, opacity = 1) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" opacity="${opacity}"/>`;
const poly = (pts, color) => `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${color}"/>`;
const circle = (cx, cy, r, color) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
const dim = (color, night) => {
  if (!night) return rgb(color);
  const c = [color >> 16 & 255, color >> 8 & 255, color & 255].map(v => Math.round(v * .55 + 28));
  return `#${c.map(v => v.toString(16).padStart(2, '0')).join('')}`;
};

function skyline(kind, night) {
  let s = '';
  if (kind === 'houses') {
    let i = 0;
    for (let x = -30; x < W; x += 78, i++) {
      const h = (10 + hash(i, 1, 5) * 4) * unit, base = horizon - 4 * unit;
      const colors = [0xc8784a, 0xd89a6a, 0xe8d8c0];
      s += rect(x, base - h, 60, h, dim(colors[i % 3], night));
      s += poly([[x - 6, base - h], [x + 30, base - h - 21], [x + 66, base - h]], dim(0x8a3a2a, night));
      const win = night ? '#f4d070' : '#6a8ab0';
      s += rect(x + 12, base - h + 12, 12, 9, dim(parseInt(win.slice(1), 16), night));
      s += rect(x + 36, base - h + 12, 12, 9, dim(parseInt(win.slice(1), 16), night));
    }
    s += rect(0, horizon - 18, W, 18, dim(0x5a6a5a, night));
    for (let x = 0; x < W; x += 24) s += rect(x, horizon - 18, 2, 18, dim(0x4a5a4a, night));
  } else if (kind === 'warehouses') {
    s += rect(0, horizon - 66, W, 66, dim(0xa85a3a, night));
    for (let y = horizon - 66; y < horizon; y += 9) s += rect(0, y, W, 2, dim(0x8a4a2e, night));
    for (let x = 0; x < W; x += 48) s += poly([[x, horizon - 66], [x + 48, horizon - 66], [x + 48, horizon - 90]], dim(0x6a6e74, night));
    for (let x = 36; x < W; x += 180) s += rect(x, horizon - 42, 66, 42, dim(0x3a3a40, night));
    s += rect(0, horizon - 108, W, 2, dim(0x2a2a2e, night));
    const tags = [0xe8508a, 0x4ab0e0, 0xf0c030];
    for (let i = 0; i < 5; i++) s += rect(Math.floor(hash(i, 2, 7) * W), horizon - (6 + hash(i, 3, 7) * 10) * unit, 24, 6, dim(tags[i % 3], night));
  } else {
    for (let x = -18, i = 0; x < W; x += 54, i++) {
      const r = (8 + hash(i, 2, 4) * 5) * unit;
      s += rect(x + 21, horizon - 36, 6, 36, dim(0x8a9a8a, night));
      s += circle(x + 24, horizon - 36 - r * .6, r, dim([0x6a9a6a, 0x7aa87a, 0x5a8a62][i % 3], night));
    }
    s += rect(0, horizon - 9, W, 9, dim(0x5a9ac8, night));
  }
  return s;
}

function landscape(kind, night) {
  const far = { laverton: 'houses', brunswick: 'warehouses', reservoir: 'park' }[kind];
  const ground = { laverton: 0x86c04e, brunswick: 0x8e8c88, reservoir: 0x78b850 }[kind];
  const dark = { laverton: 0x6aa63c, brunswick: 0x74726e, reservoir: 0x5e9e3e }[kind];
  const pad = { laverton: 0x5e9a36, brunswick: 0x6a6864, reservoir: 0x4e8a32 }[kind];
  const skyTop = night ? '#10183a' : '#7ec4ec', skyBottom = night ? '#34406e' : '#d8eef6';
  let s = `<defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="${skyTop}"/><stop offset="1" stop-color="${skyBottom}"/></linearGradient><pattern id="paper" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#fff" opacity=".035"/></pattern></defs>`;
  s += rect(0, 0, W, H, 'url(#sky)');
  if (night) for (let i = 0; i < 24; i++) s += rect(Math.floor(hash(i, 1, 2) * W), Math.floor(hash(i, 2, 2) * horizon * .8), 2, 2, '#f4f0d0');
  else for (let i = 0; i < 4; i++) {
    const x = Math.floor(hash(i, 3, 9) * W), y = Math.floor(horizon * (.15 + hash(i, 4, 9) * .4));
    s += rect(x, y, 42, 9, '#fff', .85) + rect(x + 9, y - 6, 21, 6, '#fff', .85);
  }
  s += skyline(far, night);
  s += rect(0, horizon, W, H - horizon, dim(ground, night));
  for (let i = 0; i < 70; i++) {
    const x = Math.floor(hash(i, 7, 3) * W), y = horizon + 4 + Math.floor(hash(i, 8, 3) * (H - horizon));
    s += rect(x, y, far === 'warehouses' ? 18 : 3, far === 'warehouses' ? 2 : 6, dim(dark, night));
  }
  const padColor = dim(pad, night);
  s += ellipse(224, 108, 45, 9, padColor) + ellipse(224, 106, 36, 4, '#ffffff', .12);
  s += ellipse(90, 150, 51, 9, padColor) + ellipse(90, 148, 41, 4, '#ffffff', .12);
  if (night) s += rect(0, 0, W, H, '#0b1436', .3);
  s += rect(0, 0, W, H, 'url(#paper)');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${s}</svg>`;
}

for (const kind of ['laverton', 'brunswick', 'reservoir']) for (const night of [false, true]) {
  const name = `${kind}${night ? '-night' : ''}.png`;
  const svg = landscape(kind, night);
  await sharp(Buffer.from(svg)).png().toFile(join(root, name));
}
await writeFile(join(root, 'README.md'), [
  '# Current battle backgrounds', '',
  "These are editable PNG starting points inspired by the game's current built-in battle scenes.",
  'Copy a file up one folder into assets/sprites/backgrounds/ to activate it, for example copy laverton.png to ../laverton.png.',
  'The templates folder is ignored by the game, so these originals remain safe to edit from.', '',
  'Files: laverton.png (suburban houses), brunswick.png (brick warehouses), reservoir.png (park and lake), plus matching -night.png versions. All are 320 x 180 PNGs.',
  'Edit with Procreate, Aseprite, Piskel or another image editor; keep the full canvas and save the result as a PNG in the parent folder.', '',
  "The game places both fighters over the image. The left lower pad is your pet's starting place; the upper-right pad is the opponent's.",
  'The artwork is a starter copy. Repaint it however you like.', '',
].join('\n'));
console.log(`Exported six editable battle PNG templates to ${root}`);
