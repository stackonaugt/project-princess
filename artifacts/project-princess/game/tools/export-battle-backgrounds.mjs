// Export editable battle background starting points and guide images.
// Run: node tools/export-battle-backgrounds.mjs          (keeps existing files)
//      node tools/export-battle-backgrounds.mjs --force  (redraws starter art too)
//
// Starter art (never overwritten without --force, the owner may have edited it):
//   <kind>.png, <kind>-night.png              desktop, 320 x 180
//   <kind>-phone.png, <kind>-night-phone.png  phone,   192 x 320
// Guides (always redrawn from BG_TEMPLATES in src/systems/battle-backdrop.js):
//   guide-desktop.png, guide-phone.png          transparent layer, same size as the art
//   guide-desktop-big.png, guide-phone-big.png  4x picture with labels, to look at
import { mkdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { hash } from '../src/util.js';
import { BG_TEMPLATES } from '../src/systems/battle-backdrop.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets/sprites/backgrounds/templates');
await mkdir(root, { recursive: true });
const force = process.argv.includes('--force');
const unit = 3;
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

// Each shape: canvas size, horizon, and the pads under the fighters' feet.
// A pad is centred just above the feet.
const SHAPES = {
  desktop: { suffix: '', horizon: 66 },
  phone: { suffix: '-phone', horizon: 150 },
};
const padsFor = t => [
    { x: t.mine.x, y: t.mine.y - 2, rx: Math.round(t.pet * 1.8 / 2), ry: Math.max(7, Math.round(t.pet / 6)) },
    { x: t.foe.x, y: t.foe.y - 2, rx: Math.round(t.pet * 1.6 / 2), ry: Math.max(7, Math.round(t.pet / 6)) },
];

function skyline(kind, night, W, horizon) {
  let s = '';
  if (kind === 'houses') {
    let i = 0;
    for (let x = -30; x < W; x += 78, i++) {
      const h = (10 + hash(i, 1, 5) * 4) * unit, base = horizon - 4 * unit;
      const colors = [0xc8784a, 0xd89a6a, 0xe8d8c0];
      s += rect(x, base - h, 60, h, dim(colors[i % 3], night));
      s += poly([[x - 6, base - h], [x + 30, base - h - 21], [x + 66, base - h]], dim(0x8a3a2a, night));
      const win = night ? 0xf4d070 : 0x6a8ab0;
      s += rect(x + 12, base - h + 12, 12, 9, dim(win, night));
      s += rect(x + 36, base - h + 12, 12, 9, dim(win, night));
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

function landscape(kind, night, shape) {
  const t = BG_TEMPLATES[shape], W = t.w, H = t.h, horizon = SHAPES[shape].horizon;
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
  s += skyline(far, night, W, horizon);
  s += rect(0, horizon, W, H - horizon, dim(ground, night));
  const specks = Math.round(70 * (W * (H - horizon)) / (320 * 114));
  for (let i = 0; i < specks; i++) {
    const x = Math.floor(hash(i, 7, 3) * W), y = horizon + 4 + Math.floor(hash(i, 8, 3) * (H - horizon));
    s += rect(x, y, far === 'warehouses' ? 18 : 3, far === 'warehouses' ? 2 : 6, dim(dark, night));
  }
  const padColor = dim(pad, night);
  // The desktop pads stay where the original templates had them.
  const pads = shape === 'desktop' ? [{ x: 90, y: 150, rx: 51, ry: 9 }, { x: 224, y: 108, rx: 45, ry: 9 }] : padsFor(t);
  for (const p of pads) s += ellipse(p.x, p.y, p.rx, p.ry, padColor) + ellipse(p.x, p.y - 2, Math.round(p.rx * .8), Math.round(p.ry / 2), '#ffffff', .12);
  if (night) s += rect(0, 0, W, H, '#0b1436', .3);
  s += rect(0, 0, W, H, 'url(#paper)');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${s}</svg>`;
}

// The guide: where each fighter's feet go (cross), the space a standard pet
// fills (outline), the status boxes (blue, hatched) and the edges that may be
// out of view (yellow). `labels` adds words, for the big picture.
function guide(shape, { labels = false, under = '' } = {}) {
  const t = BG_TEMPLATES[shape], g = t.guide, W = t.w, H = t.h;
  const S = labels ? 4 : 1, z = v => v * S;
  let s = `<defs><pattern id="hatch" width="${z(4)}" height="${z(4)}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="${z(1.5)}" height="${z(4)}" fill="#2f6fd6" opacity=".55"/></pattern></defs>`;
  if (under) s += `<image href="${under}" width="${z(W)}" height="${z(H)}" style="image-rendering:pixelated"/>`;
  const band = (x, y, w, h) => `<rect x="${z(x)}" y="${z(y)}" width="${z(w)}" height="${z(h)}" fill="#ffd21f" opacity=".35"/>`;
  if (g.hiddenTop) s += band(0, 0, W, g.hiddenTop);
  if (g.sides) s += band(0, g.hiddenTop, g.sides, H - g.hiddenTop) + band(W - g.sides, g.hiddenTop, g.sides, H - g.hiddenTop);
  for (const [x, y, w, h] of [g.foeBox, g.mineBox])
    s += `<rect x="${z(x)}" y="${z(y)}" width="${z(w)}" height="${z(h)}" fill="url(#hatch)" stroke="#2f6fd6" stroke-width="${S}"/>`;
  const fighter = (a, color, wide) => {
    const fy = a.y, h = t.pet, w = wide ? t.pet * 1.1 : t.pet;
    let f = `<rect x="${z(a.x - w / 2)}" y="${z(fy - h)}" width="${z(w)}" height="${z(h)}" fill="none" stroke="${color}" stroke-width="${S}" stroke-dasharray="${z(2)} ${z(2)}"/>`;
    f += `<rect x="${z(a.x - 5)}" y="${z(fy) - S / 2}" width="${z(11)}" height="${S}" fill="${color}"/><rect x="${z(a.x) - S / 2}" y="${z(fy - 5)}" width="${S}" height="${z(11)}" fill="${color}"/>`;
    return f;
  };
  s += fighter(t.mine, '#e8203a') + fighter(t.foe, '#c020c8');
  if (labels) {
    const text = (x, y, str, color, size = 13, anchor = 'start') => `<text x="${x}" y="${y}" font-family="DejaVu Sans, sans-serif" font-weight="bold" font-size="${size}" fill="${color}" text-anchor="${anchor}" stroke="#ffffff" stroke-width="3" paint-order="stroke">${str}</text>`;
    const mineFeet = t.mine.y, foeFeet = t.foe.y;
    s += text(z(t.mine.x), z(mineFeet - t.pet) - 8, 'YOUR PET', '#e8203a', 15, 'middle');
    s += text(z(t.mine.x), z(mineFeet) + 18, `feet at ${t.mine.x}, ${Math.round(mineFeet)}`, '#e8203a', 12, 'middle');
    s += text(z(t.foe.x), z(foeFeet - t.pet) - 8, 'OPPONENT', '#c020c8', 15, 'middle');
    s += text(z(t.foe.x), z(foeFeet) + 18, `feet at ${t.foe.x}, ${Math.round(foeFeet)}`, '#c020c8', 12, 'middle');
    s += text(z(g.foeBox[0]) + 6, z(g.foeBox[1] + g.foeBox[3]) - 8, 'opponent box', '#1d4fa8', 12);
    s += text(z(g.mineBox[0]) + 6, z(g.mineBox[1]) + 18, 'your pet box', '#1d4fa8', 12);
    if (g.hiddenTop) s += text(z(W) - 8, z(g.hiddenTop) - 8, 'top may be cut off: keep it to sky', '#8a6a00', 12, 'end');
    if (g.sides) s += text(z(W / 2), z(H) - 6, `edges (${g.sides} px) may be cut off`, '#8a6a00', 12, 'middle');
    s += text(8, 18, `${shape === 'phone' ? 'PHONE' : 'DESKTOP'} ${W} x ${H}`, '#222222', 14);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${z(W)}" height="${z(H)}" viewBox="0 0 ${z(W)} ${z(H)}" shape-rendering="crispEdges">${s}</svg>`;
}

const exists = async file => access(file).then(() => true, () => false);
let wrote = 0, kept = 0;
for (const shape of Object.keys(SHAPES)) {
  for (const kind of ['laverton', 'brunswick', 'reservoir']) for (const night of [false, true]) {
    const file = join(root, `${kind}${night ? '-night' : ''}${SHAPES[shape].suffix}.png`);
    if (!force && await exists(file)) { kept++; continue; }
    await sharp(Buffer.from(landscape(kind, night, shape))).png().toFile(file); wrote++;
  }
  await sharp(Buffer.from(guide(shape))).png().toFile(join(root, `guide-${shape}.png`));
  const under = `data:image/png;base64,${(await sharp(Buffer.from(landscape('laverton', false, shape))).png().toBuffer()).toString('base64')}`;
  await sharp(Buffer.from(guide(shape, { labels: true, under }))).png().toFile(join(root, `guide-${shape}-big.png`));
}
console.log(`Battle backgrounds: wrote ${wrote} starter PNGs, kept ${kept} existing ones, redrew 4 guides in ${root}`);
