// Big, to-scale art for Carlton and the city (from the owner's marked-up
// guide and reference photos): Lygon St's two-storey shops with iron lace
// verandahs, red sports cars, the Royal Exhibition Building and its fountain,
// the museum and its blade of a canopy, white boom-style terraces, Parliament,
// the Princess Theatre, the Imperial Hotel, the State Library, a balcony bar,
// Melbourne Central's cone, Flinders Street Station, Fed Square, St Paul's and
// Princes Bridge. Same format as objects.js. Outlines are added automatically.
import { shade, textWidth } from './painter.js';
import { hash } from '../../util.js';

function box(p, x, y, w, h, c) {
  p.r(c, x, y, w, h); p.r(shade(c, 0.18), x, y, w, 1); p.r(shade(c, -0.22), x, y + h - 1, w, 1); p.r(shade(c, -0.1), x + w - 1, y + 1, 1, h - 2);
}
const centred = (p, s, cx, y, c) => p.text(s, Math.round(cx - textWidth(s) / 2), y, c);
function big(p, s, cx, y, scale, c) { const w = textWidth(s) * scale; p.ctx.save(); p.ctx.translate(Math.round(cx - w / 2), y); p.ctx.scale(scale, scale); p.text(s, 0, 0, c); p.ctx.restore(); }
// An arched window: frame, glass, a glint and a round top.
function arch(p, x, y, w, h, glass = '#5a7a9a', frame = '#4a4038') {
  p.r(frame, x, y + 2, w, h - 2); p.r(frame, x + 1, y, w - 2, 2);
  p.r(glass, x + 1, y + 2, w - 2, h - 3); p.r(glass, x + 2, y + 1, w - 4, 1);
  p.r(shade(glass, 0.35), x + 1, y + 2, 1, Math.min(4, h - 3));
}
// A sash window with a sill and a cornice over it.
function sash(p, x, y, w, h, wall, glass = '#4a6278') {
  p.r(shade(wall, 0.2), x - 1, y - 3, w + 2, 2); p.r(shade(wall, -0.3), x - 1, y - 1, w + 2, 1);
  p.r(shade(wall, -0.4), x, y, w, h); p.r(glass, x + 1, y + 1, w - 2, h - 2); p.r(shade(wall, -0.4), x, y + Math.floor(h / 2), w, 1);
  p.r(shade(glass, 0.4), x + 1, y + 1, 1, 2); p.r(shade(wall, 0.25), x - 1, y + h, w + 2, 1);
}
// A run of classical columns between y0 and y1, each `cw` wide.
function columns(p, x0, x1, y0, y1, step, c = '#e8e0cc', cw = 4) {
  for (let x = x0; x <= x1; x += step) {
    p.r(c, x, y0, cw, y1 - y0); p.r(shade(c, 0.22), x, y0, 1, y1 - y0); p.r(shade(c, -0.25), x + cw - 1, y0, 1, y1 - y0);
    for (let f = 2; f < cw - 1; f += 2) p.r(shade(c, -0.08), x + f, y0 + 3, 1, y1 - y0 - 6);   // fluting
    p.r(shade(c, 0.1), x - 2, y0, cw + 4, 3); p.r(shade(c, -0.15), x - 1, y0 + 3, cw + 2, 1);   // capital
    p.r(shade(c, -0.1), x - 2, y1 - 3, cw + 4, 3);   // base
  }
}
// Steps: bands getting wider as they come down.
function steps(p, cx, y, w, n, c, grow = 4) {
  for (let s = 0; s < n; s++) { const ww = w + s * grow; p.r(shade(c, (s % 2 ? -0.06 : 0.06)), cx - ww / 2, y + s * 3, ww, 3); p.r(shade(c, -0.22), cx - ww / 2, y + s * 3 + 2, ww, 1); }
}
// A triangular pediment from (cx - w/2, y + h) up to the apex at (cx, y).
function pediment(p, cx, y, w, h, c) {
  for (let j = 0; j < h; j++) { const ww = Math.round(w * (j + 1) / h); p.r(j === 0 ? shade(c, 0.2) : c, cx - ww / 2, y + j, ww, 1); }
  for (let j = 0; j < h; j++) { const ww = Math.round(w * (j + 1) / h); p.r(shade(c, 0.25), cx - ww / 2, y + j, 2, 1); p.r(shade(c, -0.25), cx + ww / 2 - 2, y + j, 2, 1); }
  p.r(shade(c, -0.2), cx - w / 2, y + h, w, 2);
}
// A dome of radius r, its base at y (spans y - r*k .. y), ribbed.
function dome(p, cx, base, r, h, c, ribs = 6) {
  for (let j = 0; j < h; j++) {
    const w = Math.round(Math.sqrt(Math.max(0, 1 - ((h - j) / h) ** 2)) * r);
    p.r(j % 5 === 4 ? shade(c, -0.08) : c, cx - w, base - h + j, w * 2, 1);
    p.r(shade(c, 0.25), cx - w, base - h + j, Math.max(1, Math.round(w / 4)), 1);
    p.r(shade(c, -0.22), cx + w - Math.max(1, Math.round(w / 5)), base - h + j, Math.max(1, Math.round(w / 5)), 1);
  }
  for (let i = 1; i < ribs; i++) {
    const t = i / ribs * 2 - 1;
    for (let j = 2; j < h; j++) { const w = Math.sqrt(Math.max(0, 1 - ((h - j) / h) ** 2)) * r; p.r(shade(c, 0.15), Math.round(cx + t * w), base - h + j, 1, 1); }
  }
}
// Cast iron lace: a frieze of little diamonds between two rails.
function lace(p, x, y, w, h, c = '#2a2a30') {
  p.r(c, x, y, w, 1); p.r(c, x, y + h - 1, w, 1);
  for (let i = x; i < x + w; i += 4) {
    p.r(c, i, y, 1, h);
    for (let yy = y + 1; yy < y + h - 2; yy += 4) { p.r(c, i + 2, yy, 1, 1); p.r(c, i + 1, yy + 1, 1, 1); p.r(c, i + 3, yy + 1, 1, 1); p.r(c, i + 2, yy + 2, 1, 1); }
  }
}
// An iron balustrade: rails, balusters and little rings.
function balustrade(p, x, y, w, h, c = '#2a2a30') {
  p.r(c, x, y, w, 1); p.r(c, x, y + h - 1, w, 1);
  for (let i = x; i < x + w; i += 2) p.r(c, i, y, 1, h);
  for (let i = x + 1; i < x + w - 2; i += 6) { p.r(c, i, y + 2, 3, 1); p.r(c, i, y + h - 3, 3, 1); }
}
// A flag on a pole: Australian (blue with stars) or Victorian, or plain.
function flag(p, x, y, kind = 'aus') {
  p.r('#5a5a60', x, y, 1, 22); p.r('#c8c8c0', x, y - 1, 1, 1);
  const c = kind === 'red' ? '#c8302a' : '#1a2a6a';
  p.r(c, x + 1, y + 1, 14, 8);
  if (kind !== 'red') { p.r('#c8302a', x + 1, y + 1, 6, 1); p.r('#f4f4f0', x + 1, y + 2, 6, 1); p.r('#c8302a', x + 3, y + 1, 1, 4); p.px('#f4f4f0', x + 10, y + 3); p.px('#f4f4f0', x + 12, y + 6); p.px('#f4f4f0', x + 9, y + 7); p.px('#f4f4f0', x + 4, y + 7); }
}
// A bronze street lamp with a cluster of globes (Parliament's steps, Princes Bridge).
function globes(p, x, y, h, n = 3) {
  p.r('#3a3028', x, y + 4, 2, h); p.r('#5a4a3a', x, y + 4, 1, h); p.r('#3a3028', x - 2, y + h + 2, 6, 3);
  p.r('#3a3028', x - 4, y + 4, 10, 1);
  for (let i = 0; i < n; i++) { const gx = x - 4 + i * 5; p.blob(gx + 1, y + 2, 2, '#f8f0c8'); p.r('#ffffff', gx, y + 1, 1, 1); }
}
// Scrawled tags: squiggles in a few colours.
function scrawl(p, x, y, w, h, seed, cols = ['#1e1e24', '#e77fb8', '#3fa38f', '#f5d63a', '#f4f4f0', '#7fa6e8']) {
  for (let i = 0; i < Math.floor(w * h / 70); i++) {
    const c = cols[Math.floor(hash(i, seed) * cols.length)], tx = x + 1 + Math.floor(hash(seed, i) * (w - 10)), ty = y + 1 + Math.floor(hash(i + 3, seed) * (h - 7));
    for (let k = 0; k < 8; k++) p.r(c, tx + k, ty + Math.round(Math.sin(k * 1.3 + i) * 2) + 2, 1, 2);
  }
}
// Leafy canopy made of clumps (for the big elms and the gardens).
function leaves(p, cx, cy, r, cols, seed) {
  const [d, m, l] = cols;
  for (let i = 0; i < 9; i++) {
    const a = hash(seed, i) * 6.28, rr = r * (0.35 + hash(i, seed) * 0.5), x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.75, s = Math.round(r * (0.35 + hash(i + 9, seed) * 0.25));
    p.blob(x, y + 2, s, d);
  }
  for (let i = 0; i < 9; i++) {
    const a = hash(seed, i) * 6.28, rr = r * (0.35 + hash(i, seed) * 0.5), x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * 0.75, s = Math.round(r * (0.35 + hash(i + 9, seed) * 0.25));
    p.blob(x - 1, y, s - 1, m); p.blob(x - s / 3, y - s / 3, Math.max(1, Math.round(s / 2)), l);
  }
  for (let i = 0; i < r * 5; i++) { const a = hash(seed + 3, i) * 6.28, rr = hash(i, seed + 5) * r; p.r(i % 3 ? l : d, Math.round(cx + Math.cos(a) * rr), Math.round(cy + Math.sin(a) * rr * 0.75), 1, 1); }
}

// ---- Lygon St shops. Two storeys, an ornate parapet with the year, iron lace
// on the balcony and under the verandah, a striped canopy over the footpath
// (as in the owner's photos). Every shop is different.
const SHOPS = {
  trattoria:   { wall: '#e6d6b8', trim: '#c8302a', name: 'NONNA ROSA TRATTORIA', sign: '#2a5a3a', ink: '#f4f0e6', aw: ['#c8302a', '#f4f0e6'], show: 'tables', year: '1889' },
  pasticceria: { wall: '#f0d4d8', trim: '#a8506a', name: 'DOLCE FAR NIENTE', sign: '#f4f0e6', ink: '#a8506a', aw: ['#e8a0b8', '#f4f0e6'], show: 'cakes', year: '1891' },
  pizzeria:    { wall: '#d8a878', trim: '#7a3a24', name: 'SLICE OF HEAVEN', sign: '#c8302a', ink: '#f4f0e6', aw: ['#2a7a4a', '#f4f0e6'], show: 'pizza', year: '1887' },
  caffe:       { wall: '#8a5a3e', trim: '#3a2a1e', name: 'ESPRESSO YOURSELF', sign: '#1e1e24', ink: '#e8c060', aw: ['#1e1e24', '#e8c060'], show: 'coffee', year: '1902' },
  books:       { wall: '#c8c0a8', trim: '#3a4a6a', name: 'READ BETWEEN THE WINES', sign: '#3a4a6a', ink: '#f4f0e6', aw: ['#3a4a6a', '#e8e0cc'], show: 'books', year: '1888' },
  bella:       { wall: '#e8e0cc', trim: '#8a6a3a', name: 'LA BELLA LYGON', sign: '#7a1a24', ink: '#e8c060', aw: ['#7a1a24', '#e8c060'], show: 'tables', year: '1890' },
  gelato:      { wall: '#bfe4d4', trim: '#5aa088', name: 'GELATO', sign: '#f0a0b8', ink: '#f4f4f0', aw: ['#f0a0b8', '#f4f4f0'], show: 'gelato', year: '1923' },
  cinema:      { wall: '#c8a8d8', trim: '#6a3a8a', name: 'LYGON PICTURES', sign: '#2a1e34', ink: '#f8e070', aw: ['#6a3a8a', '#f8e070'], show: 'film', year: '1913' },
  salumeria:   { wall: '#d8c8a0', trim: '#5a3a1e', name: 'SALUMERIA FRATELLI', sign: '#f4f0e6', ink: '#2a5a3a', aw: ['#2a5a3a', '#f4f0e6'], show: 'salami', year: '1886' },
  meatball:    { wall: '#a8553a', trim: '#5a2418', name: 'MEATBALL & CHAIN', sign: '#1e1e24', ink: '#f4f0e6', aw: ['#c8302a', '#1e1e24'], show: 'tables', year: '1892' },
  vino:        { wall: '#6a2a34', trim: '#3a141a', name: 'IN VINO VERITAS', sign: '#e8d8b0', ink: '#6a2a34', aw: ['#6a2a34', '#e8d8b0'], show: 'wine', year: '1895' },
  barber:      { wall: '#e8e4dc', trim: '#2a4a8a', name: 'SHEAR MADNESS', sign: '#2a4a8a', ink: '#f4f4f0', aw: ['#c8302a', '#f4f4f0'], show: 'barber', year: '1899' },
  shoes:       { wall: '#b8c8c0', trim: '#4a5a52', name: 'HEEL THYSELF', sign: '#4a5a52', ink: '#f4f0e6', aw: ['#4a5a52', '#e8e0cc'], show: 'shoes', year: '1897' },
  florist:     { wall: '#dce8d0', trim: '#4a7a3a', name: 'PETAL PUSHERS', sign: '#4a7a3a', ink: '#f4f0e6', aw: ['#e87aa8', '#f4f0e6'], show: 'flowers', year: '1896' },
  records:     { wall: '#2a2a30', trim: '#e8643a', name: 'VINYL COUNTDOWN', sign: '#e8643a', ink: '#1e1e24', aw: ['#e8643a', '#2a2a30'], show: 'records', year: '1901' },
  bakery:      { wall: '#f0e4cc', trim: '#a8702a', name: 'KNEAD FOR SPEED', sign: '#a8702a', ink: '#f4f0e6', aw: ['#a8702a', '#f4f0e6'], show: 'bread', year: '1885' },
  tailor:      { wall: '#a8b0c0', trim: '#2a3a5a', name: 'SEW WHAT', sign: '#2a3a5a', ink: '#e8c060', aw: ['#2a3a5a', '#e8e0cc'], show: 'suits', year: '1898' },
  pasta:       { wall: '#f0e0a8', trim: '#b8802a', name: 'PASTA LA VISTA', sign: '#2a6a3a', ink: '#f4f0e6', aw: ['#2a6a3a', '#f4f0e6'], show: 'pasta', year: '1894' },
};
function showWindow(p, kind, x, y, w, h) {
  p.r('#2a2420', x, y, w, h); p.r('#3a3028', x + 1, y + 1, w - 2, h - 2);
  p.r('#f8d898', x + 1, y + 1, w - 2, 1);   // warm light
  if (kind === 'tables') for (let i = 0; i < 2; i++) { const tx = x + 3 + i * Math.floor(w / 2); for (let k = 0; k < 12; k++) p.r(k % 2 ? '#f4f0e6' : '#c8302a', tx + k, y + h - 8, 1, 3); p.r('#3a6a2a', tx + 5, y + h - 13, 2, 5); p.r('#f4e060', tx + 5, y + h - 15, 2, 2); }
  if (kind === 'cakes') for (let i = 0; i < 4; i++) { const cx = x + 5 + i * 8; p.r('#c8ccd0', cx - 3, y + h - 5, 7, 1); p.r(['#f4e0e8', '#6a3a24', '#f4d080', '#e8a0b8'][i], cx - 2, y + h - 10, 5, 5); p.r('#c8302a', cx, y + h - 11, 1, 1); }
  if (kind === 'pizza') { p.blob(x + w / 2, y + h - 8, 6, '#e8b860'); p.blob(x + w / 2, y + h - 8, 5, '#c8402a'); for (let i = 0; i < 5; i++) p.r(i % 2 ? '#f4f0d0' : '#3a7a2a', x + w / 2 - 4 + i * 2, y + h - 10 + (i % 3), 1, 1); p.r('#7a4a2a', x + 3, y + 3, 10, 7); p.r('#e8643a', x + 5, y + 6, 6, 3); }
  if (kind === 'coffee') { p.r('#c8ccd0', x + 4, y + h - 14, 16, 10); p.r('#e8ecf0', x + 5, y + h - 13, 5, 4); p.r('#1e1e24', x + 12, y + h - 12, 6, 6); for (let i = 0; i < 4; i++) p.r('#f4f0e6', x + 24 + i * 4, y + h - 6, 3, 3); }
  if (kind === 'books') for (let i = 0; i < w - 4; i += 3) { const c = ['#c8302a', '#3a6aa8', '#e8c040', '#3a8a5a', '#f4f0e6', '#8a4a8a'][Math.floor(hash(i, 3) * 6)]; p.r(c, x + 2 + i, y + h - 12 + Math.floor(hash(i, 5) * 3), 2, 10); p.r(c, x + 2 + i, y + 4, 2, 7); }
  if (kind === 'gelato') for (let i = 0; i < 6; i++) { const c = ['#f4e0a0', '#f0a0b8', '#8ad0a0', '#6a3a24', '#f4f0e6', '#e8643a'][i]; p.r('#c8ccd0', x + 2 + i * 6, y + h - 7, 5, 6); p.blob(x + 4 + i * 6, y + h - 8, 2, c); }
  if (kind === 'film') for (const [i, c] of [[0, '#3a8ad0'], [1, '#e8643a'], [2, '#3a9a5a']]) { const px = x + 3 + i * 12; p.r('#1e1e24', px, y + 3, 10, h - 6); p.r(c, px + 1, y + 4, 8, h - 8); p.r('#f4f4f0', px + 2, y + 6, 6, 1); p.blob(px + 5, y + h - 9, 2, shade(c, -0.3)); }
  if (kind === 'salami') { for (let i = 0; i < 6; i++) { p.r('#3a3028', x + 4 + i * 6, y + 2, 1, 3); p.r(i % 2 ? '#8a2a24' : '#a85a3a', x + 3 + i * 6, y + 5, 3, 10); } p.r('#e8c870', x + 4, y + h - 7, 10, 5); p.r('#f4e8c0', x + 18, y + h - 6, 8, 4); }
  if (kind === 'wine') for (let i = 0; i < w - 6; i += 4) { const c = hash(i, 9) > 0.5 ? '#3a141a' : '#2a4a2a'; p.r(c, x + 3 + i, y + 6, 2, 7); p.r(c, x + 3 + i, y + 4, 1, 2); p.r(c, x + 3 + i, y + h - 12, 2, 7); }
  if (kind === 'barber') { p.r('#f4f4f0', x + 4, y + 3, 4, h - 6); for (let j = 0; j < h - 6; j += 4) { p.r('#c8302a', x + 4, y + 3 + j, 4, 1); p.r('#2a4a8a', x + 4, y + 5 + j, 4, 1); } p.r('#2a2a30', x + 14, y + h - 12, 10, 8); p.r('#c8302a', x + 15, y + h - 14, 8, 3); }
  if (kind === 'shoes') for (let i = 0; i < 4; i++) { const sx2 = x + 4 + i * 8, c = ['#c8302a', '#2a2a30', '#a8703a', '#3a6aa8'][i]; p.r(c, sx2, y + h - 6, 6, 2); p.r(c, sx2 + 3, y + h - 9, 3, 3); p.r(c, sx2 + 2, y + 8, 6, 2); p.r(c, sx2 + 5, y + 5, 2, 3); }
  if (kind === 'flowers') for (let i = 0; i < w - 6; i += 5) { p.r('#6a4a2a', x + 3 + i, y + h - 6, 4, 4); for (let k = 0; k < 3; k++) { p.r('#3a7a3a', x + 4 + i + k, y + h - 12, 1, 6); p.r(['#f07ab0', '#e8c040', '#f4f4f0', '#c8302a', '#8a6ad0'][(i + k) % 5], x + 3 + i + k, y + h - 14 + (k % 2), 2, 2); } }
  if (kind === 'records') for (let i = 0; i < 4; i++) { const rx = x + 4 + i * 9; p.r(['#e8c040', '#3a8ad0', '#c8302a', '#f4f0e6'][i], rx, y + 4, 8, 8); p.blob(rx + 4, y + h - 7, 4, '#1e1e24'); p.blob(rx + 4, y + h - 7, 1, '#e8643a'); }
  if (kind === 'bread') for (let i = 0; i < 5; i++) { p.r('#c8ccd0', x + 2, y + 9 + (i % 2) * 8, w - 4, 1); p.blob(x + 6 + i * 7, y + 7 + (i % 2) * 8, 3, i % 2 ? '#c8883a' : '#e0a858'); p.r('#f4d8a0', x + 5 + i * 7, y + 5 + (i % 2) * 8, 2, 1); }
  if (kind === 'suits') for (let i = 0; i < 3; i++) { const mx = x + 6 + i * 12; p.blob(mx + 3, y + 5, 2, '#d8c8a8'); p.r(['#2a3a5a', '#4a4a50', '#6a3a2a'][i], mx, y + 8, 7, h - 12); p.r('#f4f4f0', mx + 3, y + 8, 1, 5); p.r('#5a5a60', mx + 3, y + h - 4, 1, 3); }
  if (kind === 'pasta') { for (let i = 0; i < 4; i++) { p.r('#c8a060', x + 4 + i * 8, y + 3, 6, h - 10); p.r('#f4e0a0', x + 5 + i * 8, y + 4, 4, h - 12); } p.r('#2a6a3a', x + 3, y + h - 6, w - 6, 3); }
}
const CARLTONSHOP = {
  foot: [5, 6], tex: [80, 100], variants: Object.keys(SHOPS),
  paint(p, v) {
    const W = 80, H = 100, s = SHOPS[v], wall = s.wall;
    p.shadow(40, H - 1, 80);
    // the parapet: cornice, a raised pediment with the year, urns at the ends
    box(p, 0, 10, W, 8, shade(wall, 0.08)); p.r(shade(wall, -0.25), 0, 17, W, 1);
    for (let x = 2; x < W - 2; x += 4) p.r(shade(wall, -0.12), x, 12, 2, 4);   // balusters
    for (let j = 0; j < 8; j++) p.r(shade(wall, 0.12), W / 2 - 4 - j * 2, 2 + j, 8 + j * 4, 1);
    p.r(shade(wall, 0.25), W / 2 - 4, 2, 8, 1);
    centred(p, s.year, W / 2, 5, s.trim);
    for (const x of [2, W - 6]) { p.r(shade(wall, 0.1), x, 4, 4, 6); p.blob(x + 2, 4, 2, shade(wall, 0.1)); }
    // the upper storey wall, with tall windows behind the balcony
    p.r(wall, 0, 18, W, 34); p.r(shade(wall, -0.18), W - 2, 18, 2, 34);
    if (v === 'meatball' || v === 'vino') for (let y = 21; y < 52; y += 4) p.r(shade(wall, -0.12), 0, y, W, 1);   // brick courses
    for (const x of [8, 34, 60]) { p.r(s.trim, x - 1, 24, 14, 2); arch(p, x, 26, 12, 20, '#3a4a5a', shade(wall, -0.35)); p.r('#6a8aa8', x + 2, 28, 3, 3); }
    // the balcony verandah: a corrugated roof, lace frieze, posts, lace balustrade
    for (let x = 0; x < W; x += 3) p.r(x % 6 ? '#9aa0a6' : '#7a8086', x, 18, 2, 5);
    p.r('#5a6066', 0, 23, W, 1);
    lace(p, 0, 24, W, 5);
    for (const x of [0, 26, 52, W - 2]) p.r('#2a2a30', x, 24, 2, 28);
    balustrade(p, 0, 44, W, 7);
    // the street verandah and its striped canopy
    p.r('#7a8086', 0, 51, W, 2); p.r('#9aa0a6', 0, 51, W, 1);
    for (let x = 0; x < W; x += 8) { p.r(s.aw[0], x, 53, 4, 6); p.r(s.aw[1], x + 4, 53, 4, 6); }
    for (let x = 0; x < W; x += 4) p.blob(x + 2, 59, 2, x % 8 ? s.aw[1] : s.aw[0]);   // the scalloped edge
    lace(p, 2, 61, W - 4, 4);
    // the shopfront under the verandah: name board, windows and the door
    p.r(shade(wall, -0.3), 2, 65, W - 4, H - 66);
    p.r(s.sign, 3, 65, W - 6, 9); p.r(shade(s.sign, 0.2), 3, 65, W - 6, 1);
    if (textWidth(s.name) <= W - 8) centred(p, s.name, W / 2, 67, s.ink);
    else { const words = s.name.split(' '), half = Math.ceil(words.length / 2); p.r(s.sign, 3, 65, W - 6, 13); centred(p, words.slice(0, half).join(' '), W / 2, 66, s.ink); centred(p, words.slice(half).join(' '), W / 2, 72, s.ink); }
    const top = textWidth(s.name) <= W - 8 ? 75 : 79;
    showWindow(p, s.show, 5, top, 42, H - top - 4);
    p.r('#2a2420', 50, top, 14, H - top - 3); p.r(shade(s.trim, -0.2), 51, top + 1, 12, H - top - 4); p.r('#a8c4d4', 53, top + 3, 8, 8); p.r('#e8c060', 61, top + 14, 1, 2);
    showWindow(p, s.show === 'tables' ? 'tables' : s.show, 66, top, 10, H - top - 4);
    p.r('#c8c4b8', 2, H - 4, W - 4, 3);   // the step
    // verandah posts at the kerb, with lace brackets
    for (const x of [1, W - 3]) { p.r('#2a2a30', x, 59, 2, H - 60); p.r('#4a4a50', x, 59, 1, H - 60); p.r('#2a2a30', x - 1, H - 3, 4, 2); }
  },
};

export const CBD = {
  carltonshop: CARLTONSHOP,

  // Parked sports cars, as in the owner's Lygon St photo.
  sportscar: {
    foot: [2, 1], tex: [40, 22], variants: ['red', 'yellow', 'black'],
    paint(p, v) {
      const c = { red: '#d0201a', yellow: '#f0c020', black: '#24262a' }[v];
      p.shadow(20, 21, 38);
      p.r(c, 2, 10, 36, 7); p.r(shade(c, 0.3), 3, 10, 34, 1); p.r(shade(c, -0.35), 2, 16, 36, 1);
      for (let i = 0; i < 6; i++) p.r(c, 10 + i, 9 - Math.round(i / 2), 20 - i * 2, 1);   // the low roof
      p.r('#2a3a4a', 13, 6, 14, 4); p.r('#6a8aa8', 14, 6, 5, 1); p.r(c, 20, 6, 1, 4);
      p.r(shade(c, -0.2), 2, 12, 4, 2); p.r('#f8f0c0', 36, 11, 2, 2); p.r('#c8302a', 2, 11, 1, 2);
      p.r(shade(c, -0.25), 14, 13, 12, 1);   // the side scoop
      for (const x of [9, 31]) { p.blob(x, 17, 3, '#1a1a1e'); p.r('#c8ccd0', x - 1, 16, 2, 2); }
    },
  },

  // ---- Carlton Gardens
  // The Royal Exhibition Building, to scale: long two-storey rendered wings
  // with rows of arches and pilasters, slate roofs, corner pavilions with
  // little domes, twin towers on the portico, the octagonal drum and the big
  // ribbed dome with its lantern and flag.
  exhibition: {
    foot: [30, 10], tex: [480, 236], variants: ['carlton'],
    paint(p) {
      const W = 480, H = 236, wall = '#e6d2a8', trim = '#c4a676', slate = '#6a727c', cx = W / 2;
      p.shadow(cx, H - 1, W - 8);
      const wingTop = 120;
      // slate roofs over the wings
      for (let j = 0; j < 22; j++) p.r(j % 3 ? slate : shade(slate, -0.1), 10 + j, wingTop - 22 + j, W - 20 - j * 2, 1);
      for (let x = 14; x < W - 14; x += 6) p.r(shade(slate, 0.15), x, wingTop - 18, 1, 16);
      // the wings
      box(p, 6, wingTop, W - 12, H - wingTop - 1, wall);
      p.r(trim, 6, wingTop, W - 12, 4); p.r(shade(trim, -0.2), 6, wingTop + 4, W - 12, 1);
      p.r(trim, 6, wingTop + 50, W - 12, 3);   // the string course between floors
      for (let x = 14; x < W - 20; x += 16) {
        if (x > cx - 64 && x < cx + 56) continue;
        p.r(shade(wall, 0.1), x - 3, wingTop + 5, 3, H - wingTop - 6);   // pilasters
        arch(p, x + 2, wingTop + 14, 9, 30, '#4a6a88', shade(wall, -0.35)); p.r(shade(wall, 0.2), x + 1, wingTop + 12, 11, 2);
        arch(p, x + 2, wingTop + 62, 9, 40, '#4a6a88', shade(wall, -0.35)); p.r(shade(wall, 0.2), x + 1, wingTop + 60, 11, 2);
      }
      // corner pavilions, each with a small dome
      for (const px of [6, W - 62]) {
        box(p, px, wingTop - 22, 56, H - wingTop + 21, shade(wall, 0.04));
        p.r(trim, px, wingTop - 22, 56, 4);
        for (let x = px + 6; x < px + 50; x += 8) p.r(shade(trim, -0.1), x, wingTop - 28, 4, 6);   // balustrade
        dome(p, px + 28, wingTop - 28, 16, 18, '#7a8894', 4); p.r(trim, px + 26, wingTop - 50, 4, 5);
        for (const ax of [px + 10, px + 24, px + 38]) { arch(p, ax, wingTop - 10, 8, 30, '#4a6a88', shade(wall, -0.35)); arch(p, ax, wingTop + 62, 8, 40, '#4a6a88', shade(wall, -0.35)); }
        p.r(shade(wall, 0.12), px + 2, wingTop - 18, 3, H - wingTop + 16); p.r(shade(wall, -0.15), px + 51, wingTop - 18, 3, H - wingTop + 16);
      }
      // the drum and the big dome
      box(p, cx - 64, 64, 128, 44, wall); p.r(trim, cx - 64, 64, 128, 4); p.r(trim, cx - 64, 104, 128, 4);
      for (let x = cx - 58; x < cx + 54; x += 14) { arch(p, x, 72, 8, 26, '#4a6a88', shade(wall, -0.35)); p.r(shade(wall, 0.15), x + 10, 70, 3, 34); }
      for (let x = cx - 62; x < cx + 60; x += 6) p.r(shade(trim, -0.1), x, 58, 3, 6);
      dome(p, cx, 60, 60, 46, '#8494a0', 9);
      p.r('#c8a040', cx - 60, 58, 120, 2);
      // the lantern, its little dome and the flag
      box(p, cx - 9, 4, 18, 14, wall); for (const x of [cx - 7, cx + 1]) arch(p, x, 6, 5, 10, '#4a6a88', shade(wall, -0.35));
      dome(p, cx, 6, 10, 6, '#8494a0', 3);
      p.r('#c8a040', cx - 1, -4, 2, 4);
      // the portico: twin towers, the great arch, the pediment and the steps
      for (const tx of [cx - 70, cx + 46]) {
        box(p, tx, 60, 24, H - 61, shade(wall, 0.06)); p.r(trim, tx, 60, 24, 3);
        for (let y = 70; y < H - 30; y += 34) arch(p, tx + 8, y, 8, 22, '#4a6a88', shade(wall, -0.35));
        dome(p, tx + 12, 60, 12, 12, '#7a8894', 3); p.r('#c8a040', tx + 11, 44, 2, 6);
      }
      box(p, cx - 46, 112, 92, H - 113, '#f0e2c0');
      pediment(p, cx, 96, 100, 18, '#f0e2c0');
      p.r(trim, cx - 48, 114, 96, 4);
      big(p, 'EXHIBITION BUILDING', cx, 120, 1, '#7a5a3a');
      columns(p, cx - 42, cx + 38, 130, H - 14, 12, '#f6ecd6', 6);
      p.r('#2a2a30', cx - 20, H - 66, 40, 52); arch(p, cx - 18, H - 72, 36, 58, '#3a4a5a', '#2a2a30');
      p.r('#e8c060', cx - 14, H - 60, 28, 3);
      steps(p, cx, H - 14, 96, 4, '#d8ccb0', 6);
      // flags along the roofline
      for (const fx of [40, 140, W - 140, W - 40]) flag(p, fx, wingTop - 44, fx < cx ? 'aus' : 'red');
    },
  },
  // The Hochgurtel fountain, big: a wide basin, three tiers of cast iron with
  // figures, and water spilling from every level.
  fountain: {
    foot: [6, 4], tex: [96, 104], variants: ['carlton'],
    paint(p) {
      const cx = 48;
      p.shadow(cx, 103, 94);
      p.r('#5a5e68', 2, 70, 92, 32); p.r('#8a8e98', 2, 70, 92, 3); p.r('#4a4e58', 2, 99, 92, 3);
      p.r('#4a8ac0', 6, 74, 84, 22); p.r('#6aa8d8', 6, 74, 84, 3);
      for (let i = 0; i < 10; i++) p.r('#a8d8f0', 8 + Math.floor(hash(i, 3) * 78), 78 + Math.floor(hash(i, 7) * 16), 6, 1);
      const iron = '#6a7a6a', hi = '#8a9a8a';
      p.r(iron, cx - 5, 26, 10, 50); p.r(hi, cx - 4, 26, 2, 50);
      // the tiers, each a wide bowl
      for (const [y, w] of [[58, 60], [38, 40], [20, 22]]) {
        p.r(shade(iron, -0.2), cx - w / 2, y + 3, w, 4); p.r(iron, cx - w / 2, y, w, 4); p.r(hi, cx - w / 2, y, w, 1);
        for (let x = cx - w / 2; x < cx + w / 2; x += 4) p.r('#a8d8f0', x, y + 7, 1, 6 + (x % 3));   // water falling
      }
      // figures round the base
      for (const fx of [cx - 22, cx + 18]) { p.r(iron, fx, 62, 6, 10); p.blob(fx + 3, 60, 3, iron); p.r(hi, fx, 62, 1, 10); }
      p.r(iron, cx - 3, 6, 6, 14); p.blob(cx, 5, 3, iron); p.r('#c8e8f8', cx, 0, 1, 6);
      p.r('#c8e8f8', cx - 2, 1, 1, 3); p.r('#c8e8f8', cx + 2, 1, 1, 3);
    },
  },
  // Melbourne Museum: a glass box under a long grey roof, and a separate
  // canopy (museumroof) out the front that you walk under.
  museum: {
    foot: [18, 6], tex: [288, 128], variants: ['carlton'],
    paint(p) {
      const W = 288, H = 128;
      p.shadow(W / 2, H - 1, W - 6);
      box(p, 4, 40, W - 8, H - 41, '#d4dadc');
      for (let x = 6; x < W - 8; x += 12) { p.r('#6a8a9a', x, 46, 10, H - 54); p.r('#9abccc', x + 1, 47, 3, 18); p.r('#5a7a8a', x + 10, 46, 2, H - 54); }
      p.r('#e8643a', 28, 52, 40, 22); p.r('#3a8ad0', 200, 60, 36, 18); p.r('#e8c040', 120, 50, 26, 10); p.r('#3a9a5a', 90, 70, 14, 20);
      // the roof: a dark plane sloping up to the east, its edge overhanging
      for (let i = 0; i < 30; i++) p.r(i < 2 ? '#6a6e76' : i % 4 ? '#3a3e44' : '#34383e', 0, 40 - i, W - Math.round(i * 2.2), 1);
      for (let i = 0; i < 26; i++) p.r('#2a2e34', W - 70 + i * 2, 10 + i, 2, 30 - i);
      p.r('#4a4e56', 0, 40, W, 5); big(p, 'MELBOURNE MUSEUM', W / 2, 41, 1, '#f4f4f0');
      p.r('#2a2e33', W / 2 - 24, H - 34, 48, 33); p.r('#a8c8d8', W / 2 - 22, H - 32, 21, 31); p.r('#a8c8d8', W / 2 + 1, H - 32, 21, 31);
    },
  },
  // The museum's huge canopy: a thin dark blade on slender posts, rising to
  // a point. Drawn over people, fades when you walk under it.
  museumroof: {
    foot: [18, 5], tex: [288, 120], variants: ['carlton'], solid: false, roof: true, lined: true,
    paint(p) {
      const W = 288;
      for (let i = 0; i < 40; i++) {
        const y = 60 - i * 1.4, w = W - i * 3;
        p.r(i % 5 ? 'rgba(52,58,68,0.92)' : 'rgba(40,44,52,0.92)', 0, y, w, 2);
      }
      for (let x = 4; x < W - 20; x += 16) p.r('rgba(90,96,108,0.9)', x, 6 + Math.max(0, (x - W + 120) / 3), 1, 56);   // the steel ribs
      p.r('rgba(110,118,130,0.95)', 0, 60, W, 2);
      for (let x = 20; x < W - 30; x += 40) { p.r('#c8ccd0', x, 62, 2, 58); p.r('#e8ecf0', x, 62, 1, 58); }   // slender posts
    },
  },
  // The big English elms of Carlton Gardens.
  bigelm: {
    foot: [1, 1], tex: [72, 88], variants: ['elm', 'plane', 'fig'],
    paint(p, v) {
      p.shadow(36, 86, 40);
      p.r('#5a4636', 32, 44, 8, 44); p.r('#7a6450', 33, 44, 2, 44); p.r('#4a3628', 38, 50, 2, 38);
      p.r('#5a4636', 24, 50, 10, 3); p.r('#5a4636', 40, 46, 10, 3);
      const cols = { elm: ['#2e5a2a', '#3e7a36', '#62a04a'], plane: ['#4a6a2a', '#6a8a3a', '#9ab45a'], fig: ['#1e4a2a', '#2e6a3a', '#4a8a4a'] }[v];
      leaves(p, 36, 32, 30, cols, v.length * 7);
    },
  },

  // ---- Nicholson St
  // White boom-style terraces on the Fitzroy side: two storeys, arched
  // loggias upstairs with iron lace, arches down, a scrolled parapet. They
  // sit wall to wall.
  boomterrace: {
    foot: [4, 5], tex: [64, 96], variants: ['white', 'cream', 'grey', 'blush'],
    paint(p, v) {
      const W = 64, H = 96, wall = { white: '#f2efe8', cream: '#ece0c4', grey: '#c8ccd0', blush: '#ecd8cc' }[v];
      p.r(wall, 0, 14, W, H - 14); p.r(shade(wall, -0.2), 0, 14, 1, H - 14); p.r(shade(wall, -0.2), W - 1, 14, 1, H - 14);
      // the parapet with a scrolled centrepiece and urns
      box(p, 0, 8, W, 8, shade(wall, 0.04));
      for (let j = 0; j < 7; j++) p.r(shade(wall, 0.05), W / 2 - 6 - j, 1 + j, 12 + j * 2, 1);
      p.blob(W / 2 - 10, 6, 3, shade(wall, 0.04)); p.blob(W / 2 + 10, 6, 3, shade(wall, 0.04));
      for (const x of [2, W - 6]) { p.r(shade(wall, -0.05), x, 2, 4, 6); p.blob(x + 2, 2, 2, shade(wall, -0.05)); }
      p.r(shade(wall, -0.3), 0, 16, W, 1);
      // the upstairs loggia: three arches with lace and a balustrade
      p.r(shade(wall, -0.35), 4, 20, W - 8, 28);
      for (let i = 0; i < 3; i++) { const x = 6 + i * 18; p.r('#3a4a5a', x, 24, 16, 24); arch(p, x, 20, 16, 8, shade(wall, -0.35), wall); p.r(wall, x - 2, 20, 2, 28); }
      p.r(wall, W - 6, 20, 2, 28);
      for (let i = 0; i < 3; i++) { const x = 6 + i * 18; lace(p, x, 26, 16, 4); p.r('#4a5a6a', x + 4, 32, 8, 14); p.r('#7a9ab0', x + 5, 33, 2, 4); }
      balustrade(p, 4, 40, W - 8, 8, shade(wall, -0.1));
      p.r(shade(wall, 0.15), 0, 49, W, 3); p.r(shade(wall, -0.25), 0, 52, W, 1);
      // downstairs: an arched porch and a big arched window
      p.r(shade(wall, -0.4), 6, 58, 20, H - 62); arch(p, 6, 56, 20, 6, shade(wall, -0.4), wall);
      p.r('#2a3a4a', 10, 64, 12, H - 68); p.r('#3a5a7a', 11, 65, 10, 14); p.r('#c8a040', 19, 78, 1, 2);
      arch(p, 34, 58, 22, 26, '#3a5a7a', shade(wall, -0.35)); p.r(shade(wall, -0.35), 44, 60, 2, 24); p.r(shade(wall, 0.2), 32, 84, 26, 2);
      // the front fence and a little garden
      p.r('#3a6a2a', 30, H - 8, 30, 4); p.r('#5a8a3a', 30, H - 8, 30, 1);
      for (let x = 0; x < W; x += 2) p.r('#2a2a30', x, H - 9, 1, 8);
      p.r('#2a2a30', 0, H - 10, W, 1); p.r('#2a2a30', 0, H - 2, W, 1);
      p.r(wall, 0, H - 10, 2, 10); p.r(wall, W - 2, H - 10, 2, 10);
    },
  },
  // Carlton's own terraces: single-storey cottages and two-storey terraces
  // with lacy verandahs, in brick and render, joined wall to wall.
  carltonterrace: {
    foot: [3, 4], tex: [48, 72], variants: ['brick', 'cream', 'sage', 'blue', 'twostorey', 'red'],
    paint(p, v) {
      const W = 48, H = 72, two = v === 'twostorey' || v === 'red';
      const wall = { brick: '#a8553a', cream: '#e8dcc2', sage: '#9fb39a', blue: '#9ab0c8', twostorey: '#d8c8a8', red: '#b0442e' }[v];
      const door = { brick: '#2f5b4a', cream: '#b84a3a', sage: '#3a5a8a', blue: '#f4f0e6', twostorey: '#5a3a24', red: '#1e2a3a' }[v];
      const top = two ? 6 : 26;
      p.r(wall, 0, top, W, H - top); p.r(shade(wall, -0.25), W - 1, top, 1, H - top);
      if (v === 'brick' || v === 'red') for (let y = top + 3; y < H; y += 4) p.r(shade(wall, -0.12), 0, y, W, 1);
      if (two) {
        box(p, 0, top - 4, W, 6, shade(wall, 0.1));
        for (const x of [6, 28]) sash(p, x, top + 8, 12, 16, wall);
        p.r('#7a8086', 0, top + 28, W, 3); lace(p, 0, top + 31, W, 4); p.r('#2a2a30', 0, top + 31, 2, H - top - 35); p.r('#2a2a30', W - 2, top + 31, 2, H - top - 35);
      } else {
        for (let j = 0; j < 14; j++) p.r(j % 3 ? '#8a9096' : '#7a8086', 0, top - 14 + j, W, 1);   // the iron roof
        p.r('#6e5a4a', 32, top - 20, 6, 8); p.r('#4e3e32', 31, top - 21, 8, 2);
        p.r(shade(wall, 0.15), 0, top, W, 2);
        p.r('#7a8086', 0, top + 6, W, 3); lace(p, 0, top + 9, W, 4); p.r('#2a2a30', 0, top + 9, 2, H - top - 13); p.r('#2a2a30', W - 2, top + 9, 2, H - top - 13);
      }
      p.r('#3d2a1a', 6, H - 30, 11, 22); p.r(door, 7, H - 29, 9, 21); p.r('#f0c040', 14, H - 18, 1, 2); p.r('#9fd0ea', 8, H - 33, 7, 2);
      sash(p, 26, H - 30, 14, 18, wall);
      for (let x = 0; x < W; x += 3) p.r('#f2efe6', x, H - 6, 1, 5);
      p.r('#f2efe6', 0, H - 7, W, 1);
      p.r('#3a6a2a', 22, H - 5, 22, 3);
    },
  },

  // ---- Bourke St and Spring St
  // Parliament House, big: a long flight of steps, a colonnade of giant
  // Doric columns, wings with two storeys of arched windows and pilasters, a
  // balustrade along the top, flags, and the bronze lamps on the steps.
  parliament: {
    foot: [34, 10], tex: [544, 230], variants: ['spring'],
    paint(p) {
      const W = 544, H = 230, stone = '#dcceb0', cx = W / 2;
      p.shadow(cx, H - 1, W - 4);
      // the wings
      box(p, 4, 40, W - 8, H - 41, stone);
      p.r(shade(stone, 0.12), 0, 32, W, 10); p.r(shade(stone, -0.2), 0, 42, W, 3);
      for (let x = 2; x < W - 2; x += 6) { p.r(shade(stone, 0.1), x, 22, 3, 10); p.r(shade(stone, -0.15), x + 2, 22, 1, 10); }   // balustrade
      p.r(shade(stone, 0.15), 0, 20, W, 3);
      p.r(shade(stone, 0.1), 4, 104, W - 8, 4);   // between floors
      for (let x = 12; x < W - 16; x += 18) {
        if (x > cx - 170 && x < cx + 160) continue;
        p.r(shade(stone, 0.12), x - 4, 46, 4, H - 70);
        arch(p, x + 2, 56, 10, 36, '#3a4a5a', shade(stone, -0.35)); pediment(p, x + 7, 50, 14, 4, shade(stone, 0.1));
        arch(p, x + 2, 118, 10, 44, '#3a4a5a', shade(stone, -0.35)); p.r(shade(stone, 0.15), x, 114, 14, 3);
      }
      // the colonnade: a deep shadowed loggia behind huge columns
      p.r('#4a4a50', cx - 172, 48, 344, 120); p.r('#5a5a62', cx - 170, 50, 340, 116);
      for (let x = cx - 160; x < cx + 150; x += 24) { arch(p, x + 6, 62, 10, 34, '#3a4a5a', '#3a3a40'); arch(p, x + 6, 112, 10, 40, '#3a4a5a', '#3a3a40'); }
      p.r(shade(stone, 0.18), cx - 180, 40, 360, 10); p.r(shade(stone, -0.2), cx - 180, 50, 360, 2);
      for (let x = cx - 176; x < cx + 172; x += 8) p.r(shade(stone, -0.1), x, 42, 4, 6);   // triglyphs
      columns(p, cx - 172, cx + 160, 52, 168, 24, '#f2ead6', 12);
      // the long flight of steps and the bronze lamps
      steps(p, cx, 168, 380, 20, '#e0d4b8', 6);
      for (const lx of [cx - 200, cx - 120, cx + 118, cx + 198]) globes(p, lx, 150, 50, 5);
      // flags on the roof: Australian, Aboriginal and Victorian
      flag(p, cx - 6, 0, 'aus');
      p.r('#5a5a60', 60, 0, 1, 22); p.r('#1e1e1e', 61, 1, 14, 4); p.r('#c8302a', 61, 5, 14, 4); p.blob(68, 5, 2, '#f0c020');
      flag(p, W - 70, 0, 'aus');
    },
  },
  // The Princess Theatre: Second Empire, cream and gold, three mansard towers,
  // statues on top and a marquee of bulbs.
  princess: {
    foot: [12, 6], tex: [192, 176], variants: ['spring'],
    paint(p) {
      const W = 192, H = 176, wall = '#efe6d0', gold = '#c8a040', cx = W / 2;
      p.shadow(cx, H - 1, W - 4);
      box(p, 4, 56, W - 8, H - 57, wall);
      // the three towers with mansard roofs and ironwork crowns
      for (const [tx, tw, th] of [[4, 44, 14], [cx - 30, 60, 30], [W - 48, 44, 14]]) {
        const top = 56 - th;
        box(p, tx, top, tw, th + 2, wall); p.r(gold, tx, top, tw, 2);
        for (let j = 0; j < 22; j++) { const w = Math.round(tw - 14 + j * 14 / 22); p.r(j % 4 ? '#5a6a7a' : '#4a5a6a', tx + (tw - w) / 2, top - 22 + j, w, 1); p.r('#7a8a9a', tx + (tw - w) / 2, top - 22 + j, 2, 1); }
        for (let x = tx + 9; x < tx + tw - 9; x += 4) p.r(gold, x, top - 26, 2, 4);
        p.r(gold, tx + 7, top - 23, tw - 14, 1);
        arch(p, tx + tw / 2 - 5, top - 16, 10, 12, '#3a4a5a', gold);
      }
      p.blob(cx, 0, 3, gold); p.r(gold, cx - 1, 2, 2, 6);
      // floors of windows with gold trim
      for (let y of [70, 100]) for (let x = 12; x < W - 16; x += 20) { p.r(gold, x - 2, y - 3, 14, 2); arch(p, x, y, 10, 20, '#3a4a5a', shade(wall, -0.35)); }
      p.r(gold, 4, 94, W - 8, 2); p.r(gold, 4, 124, W - 8, 2);
      // the marquee
      p.r('#2a1e34', 8, 128, W - 16, 18); p.r('#f4f0e6', 10, 130, W - 20, 14);
      big(p, 'PRINCESS', cx, 131, 2, '#8a2a3a');
      for (let x = 9; x < W - 9; x += 4) { p.r('#f8e070', x, 127, 2, 1); p.r('#f8e070', x, 146, 2, 1); }
      for (const [x, c] of [[12, '#3a8ad0'], [W - 32, '#e8643a']]) { p.r('#1e1e24', x, 150, 20, 22); p.r(c, x + 1, 151, 18, 20); p.r('#f4f4f0', x + 4, 154, 12, 2); }
      p.r('#2a1e34', cx - 30, 150, 60, H - 151); for (let i = 0; i < 4; i++) p.r('#a8c4d4', cx - 28 + i * 15, 152, 12, H - 154);
    },
  },
  // The Imperial Hotel on the Bourke and Spring corner: white, three storeys,
  // iron lace balconies, IMPERIAL across the parapet, a rooftop bar.
  imperial: {
    foot: [9, 6], tex: [144, 150], variants: ['corner'],
    paint(p) {
      const W = 144, H = 150, wall = '#f4f2ec', cx = W / 2;
      p.shadow(cx, H - 1, W - 4);
      // rooftop bar umbrellas behind the parapet
      for (const [i, x] of [20, 56, 92, 124].entries()) { p.r('#8a8e96', x, 10, 1, 10); for (let j = 0; j < 5; j++) p.r(['#c8302a', '#f0e8d0', '#2a5a3a', '#c8302a'][i], x - 4 - j, 4 + j, 9 + j * 2, 1); }
      box(p, 0, 18, W, H - 19, wall);
      box(p, 0, 18, W, 16, shade(wall, 0.02)); big(p, 'IMPERIAL', cx, 20, 2, '#2a2a30');
      for (let j = 0; j < 8; j++) p.r(shade(wall, 0.04), cx - 10 - j * 2, 10 + j, 20 + j * 4, 1);
      p.r(shade(wall, -0.25), 0, 34, W, 2);
      for (const y of [44, 80]) {
        for (let x = 10; x < W - 14; x += 22) { p.r(shade(wall, 0.15), x - 2, y - 3, 16, 2); sash(p, x, y, 12, 22, wall, '#3a4a5a'); }
        balustrade(p, 2, y + 18, W - 4, 8);
        p.r(shade(wall, 0.12), 0, y + 26, W, 3);
      }
      lace(p, 2, 70, W - 4, 4); lace(p, 2, 106, W - 4, 4);
      p.r('#2a2a30', 0, 110, W, 2);
      big(p, 'HOTEL', cx, 113, 1, '#2a2a30');
      // the ground floor: dark tiles, big windows and the corner door
      p.r('#2a3a34', 0, 120, W, H - 121);
      for (let x = 6; x < W - 30; x += 26) { p.r('#c8a040', x - 1, 123, 22, 1); p.r('#4a5a6a', x, 124, 20, H - 128); p.r('#f8d898', x + 1, 125, 18, 2); }
      p.r('#1e1e24', W - 26, 122, 20, H - 123); p.r('#5a4a3a', W - 24, 124, 16, H - 125); p.r('#e8c060', W - 10, 136, 1, 3);
      for (const x of [1, W - 3]) p.r('#2a2a30', x, 36, 2, H - 37);
    },
  },

  // ---- Swanston St
  // The State Library of Victoria, really big: a wide forecourt of steps, the
  // great portico of eight Corinthian columns and its pediment, long wings
  // with pilasters and tall windows, and the copper dome of the La Trobe
  // Reading Room rising behind.
  statelibrary: {
    foot: [36, 10], tex: [576, 248], variants: ['swanston'],
    paint(p) {
      const W = 576, H = 248, stone = '#cdc8bb', cx = W / 2;
      p.shadow(cx, H - 1, W - 6);
      // the dome behind: a tall drum, the green copper dome and its lantern
      box(p, cx - 110, 60, 220, 40, stone);
      for (let x = cx - 104; x < cx + 100; x += 16) { arch(p, x, 66, 10, 26, '#3a4a5a', shade(stone, -0.35)); p.r(shade(stone, 0.15), x + 12, 64, 3, 34); }
      dome(p, cx, 62, 104, 52, '#6aae98', 12);
      for (let x = cx - 100; x < cx + 100; x += 16) p.r('#a8d8c8', x, 56, 6, 3);   // the dome's ring of windows
      box(p, cx - 12, 0, 24, 14, stone); dome(p, cx, 2, 12, 6, '#6aae98', 3);
      p.r('#6aae98', cx - 104, 60, 208, 2);
      // the wings
      box(p, 4, 96, W - 8, H - 97, stone);
      p.r(shade(stone, 0.15), 0, 90, W, 8); p.r(shade(stone, -0.2), 0, 98, W, 2);
      for (let x = 2; x < W - 2; x += 6) p.r(shade(stone, -0.08), x, 84, 3, 6);
      p.r(shade(stone, 0.1), 0, 82, W, 2);
      for (let x = 14; x < W - 18; x += 20) {
        if (x > cx - 120 && x < cx + 110) continue;
        p.r(shade(stone, 0.12), x - 4, 102, 5, H - 130); p.r(shade(stone, -0.15), x, 102, 1, H - 130);
        sash(p, x + 4, 112, 10, 30, stone, '#3a4a5a'); pediment(p, x + 9, 104, 16, 5, shade(stone, 0.08));
        sash(p, x + 4, 160, 10, 40, stone, '#3a4a5a');
      }
      p.r(shade(stone, 0.1), 4, 150, W - 8, 3);
      // the portico
      p.r('#3a3a40', cx - 118, 120, 236, 98); p.r('#4a4a52', cx - 116, 122, 232, 94);
      for (let x = cx - 100; x < cx + 96; x += 30) arch(p, x + 8, 140, 12, 40, '#2a3a4a', '#2a2a30');
      p.r('#2a2a30', cx - 18, 168, 36, 50); p.r('#5a4030', cx - 16, 170, 32, 48); p.r('#e8c060', cx - 16, 166, 32, 2);
      pediment(p, cx, 76, 260, 34, shade(stone, 0.05));
      p.r(shade(stone, 0.18), cx - 132, 110, 264, 10); p.r(shade(stone, -0.25), cx - 132, 120, 264, 2);
      big(p, 'STATE LIBRARY', cx, 112, 1, '#5a5a60');
      columns(p, cx - 116, cx + 104, 122, 220, 31, '#ece6d6', 12);
      for (let x = cx - 116; x <= cx + 104; x += 31) { p.r('#f4eede', x - 3, 120, 18, 4); p.r('#d8d0bc', x - 1, 124, 14, 2); }   // the Corinthian capitals
      // the steps across the front
      steps(p, cx, 220, 300, 9, '#d4cfc2', 8);
    },
  },
  // A balcony bar next to the library: a rooftop terrace of umbrellas and
  // fairy lights on top of an old warehouse.
  balconybar: {
    foot: [9, 7], tex: [144, 144], variants: ['swanston'],
    paint(p) {
      const W = 144, H = 144, br = '#9a4a34';
      p.shadow(W / 2, H - 1, W - 4);
      // the balcony on top, with umbrellas, people-free tables and lights
      for (let i = 0; i < 4; i++) { const x = 14 + i * 36; p.r('#8a8e96', x, 16, 1, 14); for (let j = 0; j < 7; j++) p.r(j < 6 ? ['#2a7a4a', '#f0e8d0', '#c8302a', '#2a7a4a'][i] : '#2a2a30', x - 6 - j, 6 + j, 13 + j * 2, 1); }
      for (let x = 2; x < W; x += 5) p.r(x % 10 ? '#f8e070' : '#f4a0c0', x, 4 + Math.round(Math.sin(x / 9) * 2), 2, 2);
      box(p, 0, 26, W, H - 27, br);
      for (let y = 30; y < H; y += 4) { p.r(shade(br, -0.15), 0, y, W, 1); for (let x = (y % 8 ? 0 : 6); x < W; x += 12) p.r(shade(br, -0.15), x, y - 3, 1, 3); }
      balustrade(p, 0, 20, W, 8);
      p.r('#1e1e24', 10, 34, W - 20, 12); big(p, 'THE BALCONY', W / 2, 37, 1, '#f8e070');
      for (const y of [54, 84]) for (let x = 10; x < W - 16; x += 22) sash(p, x, y, 14, 22, br, '#3a4a5a');
      p.r('#2a2a30', 0, 112, W, H - 113);
      for (let x = 6; x < W - 6; x += 30) { p.r('#4a5a6a', x, 116, 24, H - 120); p.r('#f8d898', x + 1, 117, 22, 2); }
      p.r('#1e1e24', W / 2 - 10, 116, 20, H - 117); p.r('#5a4a3a', W / 2 - 8, 118, 16, H - 119);
    },
  },
  // Melbourne Central: the big glass cone over the old shot tower, inside
  // the shopping centre's corner, with the brick tower poking through.
  melbcentral: {
    foot: [14, 8], tex: [224, 200], variants: ['swanston'],
    paint(p) {
      const W = 224, H = 200, cx = W / 2;
      p.shadow(cx, H - 1, W - 4);
      box(p, 0, 104, W, H - 105, '#b8bcc0');
      for (let y = 110; y < H - 30; y += 12) p.r('#7a8a9a', 4, y, W - 8, 6);
      // the cone: a steep glass pyramid of struts
      for (let j = 0; j < 104; j++) {
        const w = Math.round(8 + j * 0.95);
        p.r('#5a7a94', cx - w, j, w * 2, 1);
        if (j % 6 === 0) p.r('#a8c8dc', cx - w, j, w * 2, 1);
      }
      for (let k = -6; k <= 6; k++) for (let j = 0; j < 104; j += 1) { const w = 8 + j * 0.95; p.r('#3a4a5a', Math.round(cx + (k / 6) * w), j, 1, 1); }
      for (let j = 10; j < 100; j += 9) p.r('rgba(255,255,255,0.35)', cx - 6 - j * 0.6, j, 6, 2);
      // the shot tower through the glass
      p.r('#9a4a34', cx - 10, 40, 20, 64); for (let y = 44; y < 104; y += 4) p.r('#7a3a28', cx - 10, y, 20, 1);
      p.r('#5a2a1e', cx - 12, 36, 24, 5); arch(p, cx - 3, 60, 6, 12, '#3a3a40', '#5a2a1e');
      p.r('#2a2e33', 0, 102, W, 3);
      p.r('#1e2a3a', 10, 120, 80, 10); big(p, 'MELBOURNE CENTRAL', 50, 122, 1, '#f4f4f0');
      // the clock and the entrance
      p.blob(W - 40, 125, 9, '#c8a040'); p.blob(W - 40, 125, 7, '#f4f0e6'); p.r('#2a2a30', W - 40, 120, 1, 5); p.r('#2a2a30', W - 40, 125, 4, 1);
      p.r('#2a2e33', cx - 30, H - 40, 60, 39); p.r('#a8c8d8', cx - 28, H - 38, 27, 37); p.r('#a8c8d8', cx + 1, H - 38, 27, 37);
      p.r('#3a8ad0', cx - 34, H - 46, 68, 6);
    },
  },

  // ---- Flinders St
  // Flinders Street Station, big: mustard and red brick, a long arcade of
  // arched windows, the green copper dome over the main entrance, the row of
  // clocks, and the clock tower on the corner.
  flindersst: {
    foot: [36, 9], tex: [576, 220], variants: ['flinders'],
    paint(p) {
      const W = 576, H = 220, y1 = '#e8b04a', br = '#b0583a', cx = 210;
      p.shadow(W / 2, H - 1, W - 4);
      box(p, 4, 96, W - 8, H - 97, y1);
      for (let y = 102; y < H - 6; y += 12) p.r(br, 4, y, W - 8, 3);
      p.r(br, 4, 92, W - 8, 6); for (let x = 6; x < W - 6; x += 8) p.r(shade(y1, 0.1), x, 86, 4, 6);
      for (let x = 14; x < W - 60; x += 22) {
        if (x > cx - 76 && x < cx + 70) continue;
        arch(p, x, 108, 12, 26, '#4a6a8a', br); arch(p, x, 150, 12, H - 158, '#3a3a40', br);
        p.r(shade(y1, 0.15), x + 15, 104, 3, H - 108);
      }
      // the domed entrance block
      box(p, cx - 80, 70, 160, 30, y1); p.r(br, cx - 80, 78, 160, 4); p.r(br, cx - 80, 92, 160, 4);
      for (let x = cx - 74; x < cx + 70; x += 18) arch(p, x, 82, 10, 12, '#4a6a8a', br);
      dome(p, cx, 72, 62, 56, '#5aa08a', 9);
      box(p, cx - 6, 4, 12, 14, y1); dome(p, cx, 6, 6, 5, '#5aa08a', 2);
      // the great arch and the clocks
      p.r(br, cx - 68, 100, 136, H - 101); p.r('#2a2a30', cx - 60, 128, 120, H - 129);
      arch(p, cx - 60, 120, 120, H - 120, '#2a2a30', '#2a2a30');
      p.r(y1, cx - 60, 104, 120, 8); big(p, 'FLINDERS STREET', cx, 106, 1, '#2a2a30');
      for (let i = 0; i < 9; i++) { p.r('#f4f4f0', cx - 52 + i * 12, 132, 9, 9); p.r('#2a2a30', cx - 48 + i * 12, 134, 1, 4); p.r('#2a2a30', cx - 48 + i * 12, 137, 3, 1); }
      p.r('#c8a040', cx - 54, 130, 108, 1); p.r('#c8a040', cx - 54, 142, 108, 1);
      // the clock tower on the corner
      box(p, W - 54, 24, 48, H - 25, y1); for (let y = 32; y < H - 6; y += 12) p.r(br, W - 54, y, 48, 3);
      p.blob(W - 30, 48, 13, '#f4f4f0'); p.blob(W - 30, 48, 11, '#fffaf0'); p.r('#2a2a30', W - 30, 39, 1, 9); p.r('#2a2a30', W - 30, 48, 7, 1);
      for (let y = 70; y < H - 30; y += 34) arch(p, W - 36, y, 12, 22, '#4a6a8a', br);
      p.r('#5aa08a', W - 58, 10, 56, 14); p.r('#7ac0aa', W - 56, 10, 52, 3); p.r(y1, W - 32, 2, 4, 8);
    },
  },
  // Federation Square, big: shards of sandstone, zinc and glass at odd
  // angles, the atrium's glass lattice, and the big screen.
  fedsquare: {
    foot: [22, 8], tex: [352, 180], variants: ['fed'],
    paint(p) {
      const W = 352, H = 180;
      p.shadow(W / 2, H - 1, W - 4);
      // the building blocks, each tilted, faced in the triangle pattern
      const blocks = [[2, 50, 120, 130, -10], [118, 26, 110, 154, 8], [224, 60, 126, 120, -6]];
      for (const [bx, by, bw, bh, tilt] of blocks) {
        for (let j = 0; j < bh; j++) p.r('#b89868', bx + Math.round(tilt * j / bh), by + j, bw, 1);
        for (let y = by + 2; y < by + bh - 2; y += 7) for (let x = bx + 2 + ((y / 7) % 2) * 4; x < bx + bw - 8; x += 8) {
          const k = hash(x, y);
          const c = k < 0.4 ? '#d8b888' : k < 0.62 ? '#a8a8a8' : k < 0.82 ? '#7a9aaa' : '#c8a070';
          for (let jj = 0; jj < 7; jj++) p.r(c, x + Math.round(tilt * (y - by) / bh) + Math.round(jj / 2), y + jj, 7 - Math.round(jj / 2), 1);
        }
        p.r('#3a3e44', bx + Math.round(tilt * 0), by - 4, bw, 5);
      }
      // the atrium: a lattice of glass and steel
      for (let j = 0; j < 90; j++) p.r('#8ab0c4', 40, 90 + j, 80, 1);
      for (let x = 40; x < 120; x += 8) for (let y = 90; y < 180; y += 8) { p.r('#4a5a6a', x, y, 8, 1); p.r('#4a5a6a', x + ((y / 8) % 2) * 4, y, 1, 8); }
      // the big screen
      p.r('#1e1e24', 236, 76, 70, 40); p.r('#3a8ad0', 239, 79, 64, 34); p.r('#f4f4f0', 252, 88, 38, 4); p.r('#e8c040', 246, 96, 50, 8);
      p.r('#2a2e33', 150, H - 40, 50, 39); p.r('#a8c8d8', 152, H - 38, 22, 37); p.r('#a8c8d8', 176, H - 38, 22, 37);
      big(p, 'FED SQUARE', 176, 36, 1, '#3a3e44');
    },
  },
  // St Paul's Cathedral, taller: sandstone gothic with three spires.
  stpauls: {
    foot: [12, 8], tex: [192, 280], variants: ['cathedral'],
    paint(p) {
      const W = 192, H = 280, stone = '#b8a07a', cx = W / 2;
      p.shadow(cx, H - 1, W - 4);
      box(p, 6, 150, W - 12, H - 151, stone);
      for (let y = 156; y < H - 4; y += 6) p.r(shade(stone, -0.08), 6, y, W - 12, 1);
      pediment(p, cx, 122, W - 20, 28, shade(stone, -0.2));
      // the three spires: the big central one and two smaller
      const spire = (x, top, w, base) => {
        box(p, x - w / 2, base - 60, w, 62, stone);
        arch(p, x - 5, base - 50, 10, 30, '#5a4a7a', shade(stone, -0.35));
        for (let j = 0; j < base - 60 - top; j++) p.r(j % 8 ? '#5a5a62' : '#6a6a72', x - Math.round((j / (base - 60 - top)) * (w / 2 - 1)) - 1, top + j, Math.round((j / (base - 60 - top)) * (w - 2)) + 2, 1);
        p.r('#e8c060', x - 1, top - 4, 2, 5);
        for (const dx of [-w / 2, w / 2 - 3]) { for (let j = 0; j < 12; j++) p.r(stone, x + dx + 1 - Math.round(j / 5), base - 72 + j, Math.round(j / 3) + 1, 1); }
      };
      spire(cx, 4, 40, 150); spire(30, 70, 26, 160); spire(W - 30, 70, 26, 160);
      // the rose window, the arched windows and the doors
      p.blob(cx, 172, 14, '#4a3a5a'); p.blob(cx, 172, 12, '#c8443a'); p.blob(cx, 172, 6, '#3a8ad0'); p.r('#e8c040', cx - 1, 160, 2, 24); p.r('#e8c040', cx - 12, 171, 24, 2);
      for (const x of [22, 50, W - 62, W - 34]) arch(p, x, 180, 12, 40, '#5a4a7a', shade(stone, -0.35));
      p.r('#3a2a1e', cx - 18, H - 50, 36, 49); arch(p, cx - 18, H - 56, 36, 10, '#3a2a1e', '#3a2a1e'); p.r('#4a3a2a', cx - 16, H - 48, 15, 47); p.r('#4a3a2a', cx + 1, H - 48, 15, 47);
    },
  },
  // Princes Bridge's ornate cast iron rail and its triple lamp standards,
  // one tile tall, set along both edges of the bridge.
  bridgerail: {
    foot: [1, 1], tex: [16, 40], variants: ['plain', 'lamp'],
    paint(p, v) {
      p.r('#2a3a34', 2, 24, 12, 16); p.r('#4a6a5a', 3, 24, 1, 16);
      for (let y = 26; y < 38; y += 4) { p.r('#6a8a7a', 5, y, 2, 2); p.r('#6a8a7a', 9, y + 2, 2, 2); }
      p.r('#8a9a8a', 0, 22, 16, 3);
      if (v === 'lamp') { p.r('#2a3a34', 7, 2, 2, 22); p.r('#2a3a34', 2, 6, 12, 1); for (const x of [2, 7, 12]) { p.blob(x + 1, 4, 2, '#f8f0c8'); p.r('#ffffff', x, 3, 1, 1); } }
    },
  },
  // The bridge's bluestone piers, seen on the water either side of the deck.
  bridgepier: {
    foot: [1, 1], tex: [16, 24], variants: ['stone'], solid: true,
    paint(p) {
      p.r('#5a5e66', 0, 4, 16, 20); p.r('#7a7e88', 0, 4, 16, 2); p.r('#4a4e56', 0, 20, 16, 4);
      for (let y = 8; y < 20; y += 4) p.r('#4a4e56', 0, y, 16, 1);
      p.r('#a8d8f0', 0, 22, 16, 1);
    },
  },
};
