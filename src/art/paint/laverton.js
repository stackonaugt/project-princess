// Built-in art for Laverton: brick veneers, the Woods St units, the park,
// the station. Same format as objects.js. Objects with roof: true are drawn
// above characters and fade when you walk underneath (carports, canopies).
import { shade } from './painter.js';
import { hash } from '../../util.js';

function box(p, x, y, w, h, c) {
  p.r(c, x, y, w, h); p.r(shade(c, 0.18), x, y, w, 1); p.r(shade(c, -0.22), x, y + h - 1, w, 1);
}

// Brick wall: 3px courses, staggered joints, slight colour variation per brick.
export function bricks(p, x, y, w, h, base, seed = 1) {
  const mortar = shade(base, 0.28);
  p.r(mortar, x, y, w, h);
  for (let row = 0; row * 3 < h; row++) {
    const off = row % 2 ? 3 : 0;
    for (let bx = -off; bx < w; bx += 6) {
      const v = hash(bx + seed * 7, row + seed * 13);
      const c = v > 0.85 ? shade(base, -0.12) : v < 0.15 ? shade(base, 0.08) : base;
      const x0 = Math.max(0, bx), x1 = Math.min(w, bx + 5);
      if (x1 > x0) p.r(c, x + x0, y + row * 3, x1 - x0, Math.min(2, h - row * 3));
    }
  }
}

// Terracotta (or concrete) tile hip roof, as a trapezoid seen from the front.
export function tileRoof(p, x, y, w, h, base, { hipL = true, hipR = true } = {}) {
  const dark = shade(base, -0.25), light = shade(base, 0.15);
  for (let j = 0; j < h; j++) {
    const inset = Math.round((h - j) * 0.9);
    const x0 = x + (hipL ? inset : 0), x1 = x + w - (hipR ? inset : 0);
    p.r(j % 3 === 2 ? dark : base, x0, y + j, x1 - x0, 1);
    if (j % 3 === 0) for (let i = x0 + ((j / 3) % 2 ? 2 : 0); i < x1; i += 4) p.r(light, i, y + j, 2, 1);
  }
  p.r(dark, x + (hipL ? Math.round(h * 0.9) : 0), y, w - (hipL ? Math.round(h * 0.9) : 0) - (hipR ? Math.round(h * 0.9) : 0), 1);
}

function window_(p, x, y, w, h, { frame = '#f4f0e6', curtain = '#f0e8d8', split = true } = {}) {
  p.r(shade(frame, -0.25), x - 1, y - 1, w + 2, h + 2);
  p.r(frame, x, y, w, h);
  p.r('#6a8aa8', x + 1, y + 1, w - 2, h - 2);
  p.r('#9ab8d0', x + 2, y + 2, Math.floor(w / 3), 2);
  if (curtain) { p.r(curtain, x + 1, y + 1, 3, h - 2); p.r(curtain, x + w - 4, y + 1, 3, h - 2); }
  if (split) p.r(frame, x + Math.floor(w / 2), y, 1, h);
  p.r(shade(frame, -0.1), x - 1, y + h + 1, w + 2, 1); // sill
}

function door(p, x, y, w, h, c = '#5a3a2a', screen = true) {
  p.r('#2a1a10', x - 1, y - 1, w + 2, h + 1); p.r(c, x, y, w, h);
  if (screen) { for (let j = 2; j < h; j += 3) p.r('#1e1e22', x + 1, y + j, w - 2, 1); p.r('#3a3a40', x + 1, y + 1, w - 2, 1); }
  p.r('#d8b860', x + w - 3, y + Math.floor(h / 2), 1, 2);
}

// A generic Melbourne brick veneer, front-on.
function veneer(p, o) {
  const { W, H, sx, roof, brick, trim = '#f4f0e6', roofH = 32, wallTop, porch = true, garage = false, solar = false, chimney = true, seed = 1 } = o;
  const top = wallTop;
  bricks(p, sx, top, W, H - top, brick, seed);
  if (chimney) { bricks(p, sx + W - 30, top - roofH - 6, 8, roofH, shade(brick, -0.05), seed + 3); p.r('#7a7d84', sx + W - 31, top - roofH - 7, 10, 2); }
  tileRoof(p, sx - 4, top - roofH, W + 8, roofH, roof);
  if (solar) for (let i = 0; i < 4; i++) { p.r('#2a3a5a', sx + 20 + i * 11, top - roofH + 14, 10, 12); p.r('#4a6a9a', sx + 21 + i * 11, top - roofH + 15, 4, 2); }
  p.r(trim, sx - 4, top - 1, W + 8, 3); p.r(shade(trim, -0.2), sx - 4, top + 2, W + 8, 1); // fascia and gutter
  return top;
}

export const LAVERTON = {
  // Helen and Paddy's new place on Allen St
  hphouse: {
    foot: [8, 3], tex: [136, 92], variants: ['allen'],
    paint(p) {
      const sx = 4, W = 128, H = 92, top = 52;
      veneer(p, { W, H, sx, roof: '#b4553a', brick: '#d4a86a', wallTop: top, roofH: 34, seed: 4 });
      // antenna on the chimney
      p.r('#5a5d64', sx + W - 26, 2, 1, 14); p.r('#5a5d64', sx + W - 32, 4, 12, 1); p.r('#5a5d64', sx + W - 30, 7, 8, 1);
      p.r('#5a3a2a', sx, H - 4, W, 4); // garden bed edge
      window_(p, sx + 10, top + 10, 24, 18); window_(p, sx + 42, top + 10, 24, 18);
      // porch with white posts, steps, lamp, security door
      p.r('#c9c5bb', sx + 70, top + 30, 28, 10); p.r('#b5b1a7', sx + 70, top + 30, 28, 1);
      p.r('#f4f0e6', sx + 70, top, 3, 36); p.r('#f4f0e6', sx + 92, top, 3, 36);
      door(p, sx + 76, top + 8, 11, 22, '#3a3a40');
      p.r('#f4f0e6', sx + 88, top + 20, 4, 10); for (let i = 0; i < 4; i++) p.r('#f4f0e6', sx + 73 + i * 4, top + 22, 1, 8); p.r('#f4f0e6', sx + 73, top + 22, 18, 1);
      p.r('#f5e6a0', sx + 82, top + 2, 4, 3);
      p.r('#d4d0c8', sx + 76, H - 6, 16, 3); p.r('#c4c0b6', sx + 74, H - 3, 20, 3); // steps
      // enclosed side porch: dark louvres over corrugated iron
      p.r('#2a2e33', sx + 98, top + 4, 26, 18); for (let j = 5; j < 22; j += 2) p.r('#3a3e44', sx + 99, top + j, 24, 1);
      p.r('#b8bcc4', sx + 98, top + 22, 26, 14); for (let i = 99; i < 124; i += 2) p.r('#9a9ea6', sx + i, top + 22, 1, 14);
      p.r('#f4f0e6', sx + 97, top, 2, 38); p.r('#f4f0e6', sx + 124, top, 2, 38);
      p.r('#d8dcdf', sx + 112, top + 28, 10, 8); p.r('#9a9ea6', sx + 113, top + 30, 8, 1); // air con
    },
  },
  // The back of Helen and Paddy's place, seen from the yard
  hpback: {
    foot: [14, 3], tex: [232, 84], variants: ['yard'],
    paint(p) {
      const sx = 4, W = 224, H = 84, top = 46;
      veneer(p, { W, H, sx, roof: '#b4553a', brick: '#d4a86a', wallTop: top, roofH: 32, chimney: true, seed: 7 });
      [[12, 'bed'], [56, 'bath'], [96, 'kit'], [136, 'meal']].forEach(([x, k]) => window_(p, sx + x, top + 8, k === 'bath' ? 14 : 26, k === 'bath' ? 10 : 16, { curtain: k === 'bath' ? null : '#f0e8d8' }));
      door(p, sx + 178, top + 8, 13, 30, '#e8e4d8', true);                    // laundry back door
      p.r('#c9c5bb', sx + 172, H - 4, 26, 4);
      window_(p, sx + 202, top + 8, 12, 10, { curtain: null, split: false });  // WC window
      p.r('#d8dcdf', sx + 150, top + 26, 12, 9); p.r('#9a9ea6', sx + 151, top + 28, 10, 1); // air con
      p.r('#f4f0e6', sx + 30, top + 30, 1, 8);
    },
  },
  kennel: {
    foot: [2, 1], tex: [32, 30], variants: ['red'],
    paint(p) {
      p.shadow(16, 29, 30);
      box(p, 3, 12, 26, 18, '#a8723c'); for (let y = 14; y < 30; y += 3) p.r('#8a5a2e', 3, y, 26, 1);
      for (let j = 0; j < 12; j++) p.r(j % 3 === 2 ? '#8a3028' : '#b8443a', 16 - j - 4, 1 + j, (j + 4) * 2, 1);
      p.r('#3a2412', 11, 18, 10, 12); p.r('#f4efe0', 12, 13, 8, 3); p.text('POP', 12, 13, '#8a3028');
    },
  },
  // Neighbours' houses
  house: {
    foot: [6, 3], tex: [104, 84], variants: ['cream', 'red', 'grey', 'orange'],
    paint(p, v) {
      const sx = 4, W = 96, H = 84, top = 46;
      const style = { cream: ['#9a6a4a', '#e0c890'], red: ['#b4553a', '#a8553a'], grey: ['#5a5f6a', '#d8b484'], orange: ['#c8643a', '#c89a6a'] }[v];
      veneer(p, { W, H, sx, roof: style[0], brick: style[1], wallTop: top, roofH: 30, solar: v === 'grey', chimney: v !== 'grey', seed: v.length });
      window_(p, sx + 8, top + 8, 22, 16, { curtain: v === 'red' ? '#d8d0b8' : '#f0e8d8' });
      door(p, sx + 40, top + 10, 11, 26, '#6b4226');
      p.r('#c9c5bb', sx + 36, H - 4, 20, 4);
      // garage roller door on the right
      p.r('#3a3a3a', sx + 60, top + 8, 32, 30); p.r('#e8e4d8', sx + 61, top + 9, 30, 29);
      for (let y = 0; y < 28; y += 3) p.r('#c9c3b5', sx + 61, top + 9 + y, 30, 1);
    },
  },
  // Woods St: a long row of two-storey public housing units
  unit: {
    foot: [5, 3], tex: [80, 114], variants: ['left', 'right', 'mural', 'endL', 'endR'],
    paint(p, v) {
      const W = 80, H = 114, top = 30, brick = '#d89a5a';
      bricks(p, 0, top, W, H - top, brick, v.length);
      tileRoof(p, -2, 4, W + 4, 26, '#6a4a3a', { hipL: v === 'endL', hipR: v === 'endR' });
      if (v === 'left' || v === 'endL') { bricks(p, 54, 0, 8, 22, '#c88a50', 9); p.r('#7a7d84', 53, 0, 10, 2); }
      p.r('#f4f0e6', -2, top - 1, W + 4, 2); p.r('#b8bcc4', W - 4, top + 1, 2, H - top - 2); // gutter, downpipe
      // upstairs windows
      window_(p, 8, top + 10, 22, 18, { curtain: '#e8e0cc' }); window_(p, 46, top + 10, 22, 18, { curtain: '#f4f0e6' });
      // concrete awning over the front door
      const doorX = v === 'right' || v === 'endR' ? 50 : 8;
      p.r('#d8d0c0', doorX - 4, top + 44, 24, 3); p.r('#b8b0a0', doorX - 4, top + 47, 24, 1);
      door(p, doorX, top + 50, 12, 32, '#3a2a2a');
      p.r('#f4f0e6', doorX + 13, top + 50, 2, 32);
      if (v === 'mural') window_(p, 36, top + 54, 24, 18, { curtain: '#f0f0e8' });
      else window_(p, v === 'right' || v === 'endR' ? 10 : 34, top + 54, 30, 18, { curtain: '#f0f0e8' });
      p.r('#c9c5bb', doorX - 2, H - 3, 18, 3); // front step
      if (v === 'mural') {
        const cols = ['#e8c030', '#e77fb8', '#3fa38f', '#c8443a', '#5a7aaa', '#8dc63f'];
        for (let i = 0; i < 6; i++) { p.r(cols[i], 22 + (i % 2) * 7, top + 52 + Math.floor(i / 2) * 7, 6, 6); p.r(cols[(i + 3) % 6], 63 + (i % 2) * 7, top + 52 + Math.floor(i / 2) * 7, 6, 6); }
        p.r('#7a4a9a', 22, top + 52, 13, 8); p.text('72', 23, top + 53, '#f5d63a');
      }
    },
  },
  agapanthus: {
    foot: [1, 1], tex: [16, 24], variants: ['purple', 'white'],
    paint(p, v) {
      const f = v === 'white' ? '#f4f4f0' : '#9a8ae0', fl = v === 'white' ? '#ffffff' : '#b8acf0';
      for (let i = 0; i < 7; i++) { const x = 2 + i * 2; p.r(i % 2 ? '#3f8a3e' : '#2f7a37', x, 15 - (i % 3), 1, 9 + (i % 3)); }
      [[4, 5], [11, 3], [8, 9]].forEach(([x, y]) => { p.r('#3f8a3e', x, y + 3, 1, 9); p.blob(x, y, 3, f); p.r(fl, x - 2, y - 2, 2, 1); p.r(fl, x + 1, y - 1, 1, 1); });
    },
  },
  tall: {
    foot: [1, 1], tex: [40, 72], variants: ['cypress', 'pear', 'biggum', 'poplar', 'bottlebrush', 'hedge'],
    paint(p, v) {
      p.shadow(20, 70, 22);
      if (v === 'cypress') {
        p.r('#4e2f1a', 18, 60, 4, 12);
        for (let j = 0; j < 58; j++) { const w = Math.round(Math.min(16, 3 + j * 0.45) * (j > 46 ? (58 - j) / 12 + 0.2 : 1)); const c = j % 5 < 2 ? '#2a5a3a' : (j % 5 === 2 ? '#3a6e48' : '#244e32'); p.r(c, 20 - w, 4 + j, w * 2, 1); }
        for (let i = 0; i < 14; i++) p.r('#4a7e58', 14 + Math.floor(hash(i, 3) * 12), 10 + Math.floor(hash(i, 5) * 44), 3, 2);
        return;
      }
      if (v === 'bottlebrush') {
        p.r('#5e3a1a', 18, 50, 4, 22);
        for (let i = 0; i < 40; i++) { const a = i * 2.4, r = Math.sqrt(i) * 3; p.blob(20 + Math.cos(a) * r, 30 + Math.sin(a) * r * 0.9, 3, i % 3 ? '#3a6a3a' : '#4a7e46'); }
        for (let i = 0; i < 26; i++) { const a = i * 1.7, r = 2 + Math.sqrt(i) * 3; p.r(i % 2 ? '#d83040' : '#e84858', 19 + Math.cos(a) * r, 28 + Math.sin(a) * r * 0.9, 2, 3); }
        return;
      }
      if (v === 'hedge') {
        p.r('#5e3a1a', 18, 60, 4, 12);
        p.blob(20, 42, 18, '#2f6a33'); p.blob(20, 40, 17, '#3f8a3e'); p.blob(14, 34, 7, '#57a84a'); p.blob(26, 46, 5, '#2f6a33');
        for (let i = 0; i < 20; i++) p.r('#6dbb58', 6 + ((i * 37) % 28), 26 + ((i * 23) % 30), 2, 1);
        return;
      }
      if (v === 'poplar') {
        p.r('#5e3a1a', 18, 58, 4, 14);
        for (let j = 0; j < 58; j++) { const w = Math.round(Math.sin((j + 3) / 62 * Math.PI) * 9); p.r(j % 4 === 0 ? '#3a7a2e' : '#4a8e36', 20 - w, 2 + j, w * 2, 1); }
        for (let i = 0; i < 30; i++) p.r(i % 2 ? '#6aae4a' : '#2e6a26', 12 + hash(i, 4) * 16, 4 + hash(i, 6) * 52, 2, 2);
        return;
      }
      if (v === 'pear') {
        p.r('#5e3a1a', 18, 52, 4, 20);
        for (let j = 0; j < 50; j++) { const w = Math.round(Math.sin((j + 2) / 52 * Math.PI) * 13); p.r(j % 4 === 0 ? '#3f8a3e' : '#4f9e46', 20 - w, 4 + j, w * 2, 1); }
        for (let i = 0; i < 26; i++) p.blob(10 + hash(i, 9) * 20, 8 + hash(i, 11) * 42, 2, i % 3 ? '#2f7a37' : '#6dbb58');
        return;
      }
      // big old river red gum
      p.r('#c8b89a', 17, 34, 6, 38); p.r('#a8987a', 21, 34, 2, 38); p.r('#d8cbb4', 18, 40, 2, 20);
      p.r('#c8b89a', 10, 38, 8, 3); p.r('#c8b89a', 22, 30, 9, 3);
      [[10, 22, 10], [28, 18, 10], [19, 12, 11], [8, 32, 7], [32, 30, 7], [20, 26, 8]].forEach(([x, y, r]) => p.blob(x, y, r, '#4f7a4a'));
      [[12, 18, 6], [26, 14, 6], [18, 8, 6], [30, 26, 4]].forEach(([x, y, r]) => p.blob(x, y, r, '#6a9a5e'));
      for (let i = 0; i < 18; i++) p.r('#86b07a', 4 + hash(i, 1) * 32, 4 + hash(i, 2) * 30, 2, 1);
    },
  },
  powerpole: {
    foot: [1, 1], tex: [24, 64], variants: ['timber'],
    paint(p) {
      p.shadow(12, 63, 8);
      p.r('#8a7a62', 10, 4, 4, 60); p.r('#6e6250', 13, 4, 1, 60); p.r('#6e6250', 2, 8, 20, 3); p.r('#d8d4cc', 4, 6, 2, 2); p.r('#d8d4cc', 18, 6, 2, 2);
      p.r('#f4f4f0', 9, 34, 6, 8); p.r('#3a8a5a', 10, 35, 4, 3); // parking sign
    },
  },
  keepleft: {
    foot: [1, 2], tex: [16, 36], variants: ['island'],
    paint(p) {
      p.r('#d8d4cc', 4, 16, 8, 20); p.r('#b8a070', 5, 18, 6, 16); p.r('#e8e4dc', 4, 16, 8, 1);
      p.r('#3c4148', 7, 4, 2, 18); p.r('#f4f4f0', 3, 1, 10, 10); p.r('#2a2a2a', 3, 1, 10, 1); p.r('#2a2a2a', 5, 6, 5, 1); p.r('#2a2a2a', 5, 5, 1, 3);
    },
  },
  trailer: {
    foot: [2, 1], tex: [32, 24], variants: ['junk'],
    paint(p) {
      p.shadow(16, 23, 30);
      box(p, 1, 10, 28, 10, '#5a5d64'); p.r('#3a3d44', 1, 13, 28, 1); p.r('#1e1e1e', 6, 18, 6, 5); p.r('#3a3d44', 28, 15, 4, 2);
      p.r('#a8723c', 4, 4, 10, 7); p.r('#7fa6c8', 15, 6, 8, 5); p.r('#c8443a', 22, 2, 2, 9); // junk
    },
  },
  ute: {
    foot: [2, 1], tex: [34, 24], variants: ['white', 'red', 'silver'],
    paint(p, v) {
      const c = { white: '#f0f0ec', red: '#c8443a', silver: '#b8bcc4' }[v];
      p.shadow(17, 23, 32);
      p.r('#1e1e1e', 4, 17, 6, 6); p.r('#1e1e1e', 24, 17, 6, 6);
      box(p, 1, 10, 32, 9, c); p.r(shade(c, -0.2), 1, 16, 32, 3);
      box(p, 18, 3, 13, 8, c); p.r('#7fb4d2', 20, 4, 9, 6); p.r('#3a3a3a', 2, 8, 15, 3);
      p.r('#f5e66b', 31, 12, 2, 2); p.r('#d83c3c', 1, 12, 1, 2);
    },
  },
  carport: {
    foot: [5, 4], tex: [88, 72], variants: ['steel'], solid: false, roof: true,
    paint(p) {
      p.r('#d8dcdf', 0, 0, 88, 64); for (let x = 2; x < 88; x += 4) p.r('#b8bcc0', x, 0, 1, 64);
      p.r('#9a9ea6', 0, 62, 88, 2); p.r('#f4f4f0', 0, 0, 88, 2); p.r('#8a8e96', 0, 30, 88, 2);
    },
  },
  post: {
    foot: [1, 1], tex: [16, 16], variants: ['steel'],
    paint(p) { p.r('#e8ecef', 7, 0, 3, 16); p.r('#b8bcc0', 9, 0, 1, 16); p.r('#9a9ea6', 6, 14, 5, 2); },
  },
  gardenshed: {
    foot: [3, 2], tex: [48, 48], variants: ['cream'],
    paint(p) {
      box(p, 2, 14, 44, 34, '#ece6d0'); for (let x = 4; x < 46; x += 4) p.r('#d8d0b8', x, 16, 1, 32);
      p.r('#c8c0a8', 0, 10, 48, 5); p.r('#b0a890', 0, 14, 48, 1);
      door(p, 18, 24, 12, 24, '#4a6a4a', false); p.r('#3a5a3a', 19, 25, 10, 1);
    },
  },
  hoist: {
    foot: [1, 1], tex: [56, 52], variants: ['hills'],
    paint(p) {
      p.shadow(28, 51, 10);
      p.r('#b8bcc4', 27, 14, 2, 38);
      for (let a = 0; a < 4; a++) { const ang = a * Math.PI / 2 + 0.4; for (let r = 0; r < 26; r++) p.r('#9a9ea6', 28 + Math.cos(ang) * r, 14 + Math.sin(ang) * r * 0.45, 1, 1); }
      for (let ring = 8; ring <= 26; ring += 6) for (let t = 0; t < 64; t++) { const ang = t / 64 * Math.PI * 2; p.r('#d8dcdf', 28 + Math.cos(ang) * ring, 14 + Math.sin(ang) * ring * 0.45, 1, 1); }
      // washing
      [[10, 14, '#e77fb8'], [36, 9, '#5a7aaa'], [44, 18, '#f4f4f0'], [18, 20, '#e8c030']].forEach(([x, y, c]) => { p.r(c, x, y, 6, 8); p.r(shade(c, -0.15), x, y + 7, 6, 1); });
    },
  },
  toiletblock: {
    foot: [3, 2], tex: [48, 54], variants: ['charcoal'],
    paint(p) {
      box(p, 2, 14, 44, 40, '#2e3036'); for (let y = 18; y < 52; y += 8) p.r('#3a3d44', 2, y, 44, 1);
      p.r('#1e2024', 0, 8, 48, 7); p.r('#3a3d44', 0, 8, 48, 1);
      box(p, 28, 24, 12, 30, '#b8bcc4'); p.r('#d8dcdf', 29, 25, 3, 28); p.r('#5a5d64', 37, 38, 1, 4);
      p.r('#f4f4f0', 8, 26, 10, 8); p.text('WC', 9, 28, '#2e3036');
    },
  },
  shade: {
    foot: [5, 3], tex: [80, 52], variants: ['flat'], solid: false, roof: true,
    paint(p) { p.r('#2a2c30', 0, 0, 80, 46); p.r('#3a3d44', 0, 0, 80, 2); for (let x = 6; x < 80; x += 12) p.r('#34373e', x, 2, 1, 44); p.r('#1e2024', 0, 44, 80, 2); },
  },
  playframe: {
    foot: [4, 2], tex: [64, 64], variants: ['park'],
    paint(p) {
      p.shadow(32, 62, 56);
      const post = (x, c = '#2f6aa3') => { p.r(c, x, 14, 3, 50); p.r(shade(c, 0.2), x, 14, 1, 50); };
      post(4); post(28); post(40, '#c8443a'); post(58, '#c8443a');
      p.r('#e8c030', 2, 30, 30, 4); p.r('#f0d050', 2, 30, 30, 1);           // deck
      p.r('#2f6aa3', 0, 8, 34, 6); for (let i = 0; i < 4; i++) p.r('#5a8ac8', 2 + i * 8, 9, 4, 4); // blue roof
      for (let i = 0; i < 26; i++) p.r(i % 4 === 0 ? '#5a9ad8' : '#2f8ac8', 30 + i * 0.4 - 30 + 2, 34 + i, 7, 2); // slide down left
      for (let y = 36; y < 62; y += 5) p.r('#e8c030', 40, y, 21, 2);          // ladder bars
      p.r('#c8443a', 38, 22, 24, 3); p.r('#8dc63f', 44, 26, 4, 10); p.r('#8dc63f', 52, 26, 4, 10); // monkey bars
    },
  },
  springrider: {
    foot: [1, 1], tex: [16, 22], variants: ['green'],
    paint(p) { p.r('#5a5d64', 6, 16, 4, 6); for (let y = 12; y < 18; y += 2) p.r('#8a8d94', 5, y, 6, 1); p.blob(8, 8, 5, '#6aa83a'); p.r('#f5d63a', 10, 5, 2, 2); p.r('#2a2a2a', 4, 7, 1, 1); },
  },
  archshelter: {
    foot: [3, 2], tex: [56, 48], variants: ['table'],
    paint(p) {
      p.shadow(28, 47, 50);
      p.r('#a8907a', 4, 28, 48, 18); for (let x = 6; x < 52; x += 4) p.r('#907a64', x, 28, 1, 18);   // deck
      p.r('#8a6a4a', 12, 27, 32, 3); box(p, 12, 32, 32, 7, '#a8845a'); p.r('#8a6a4a', 12, 42, 32, 3); // benches and table
      // a tunnel of steel hoops, seen from the side: two arches joined by ribs
      const arch = (ox, oy, c) => { for (let t = 0; t <= 60; t++) { const a = Math.PI * t / 60; p.r(c, ox + 26 - Math.cos(a) * 24, oy - Math.sin(a) * 26, 2, 2); } };
      arch(2, 44, '#3a3d44'); arch(2, 32, '#55585f');
      for (let t = 0; t <= 6; t++) { const a = Math.PI * t / 6; const x = 28 - Math.cos(a) * 24; p.r('#4a4d54', x, 32 - Math.sin(a) * 26, 2, 12); }
    },
  },
  gascage: {
    foot: [1, 1], tex: [16, 16], variants: ['meter'],
    paint(p) {
      p.r('#9a9ea6', 2, 4, 12, 11); p.r('#c4c8cc', 2, 4, 12, 1);
      for (let x = 3; x < 14; x += 2) p.r('#c4c8cc', x, 5, 1, 9); for (let y = 6; y < 15; y += 3) p.r('#c4c8cc', 3, y, 10, 1);
      p.r('#e8c030', 6, 9, 4, 4);
    },
  },
  parkbin: {
    foot: [1, 1], tex: [16, 22], variants: ['steel'],
    paint(p) { box(p, 3, 6, 10, 16, '#b8bcc4'); p.r('#d8dcdf', 4, 7, 2, 14); p.r('#8a8d94', 3, 4, 10, 3); p.r('#3a3a3a', 5, 5, 6, 1); },
  },
  canopy: {
    foot: [8, 2], tex: [128, 40], variants: ['orange'], solid: false, roof: true,
    paint(p) {
      p.r('#d8643a', 0, 0, 128, 34); for (let x = 2; x < 128; x += 4) p.r('#c4542e', x, 0, 1, 34);
      p.r('#f08050', 0, 0, 128, 2); p.r('#a8442a', 0, 32, 128, 3); p.r('#f4f4f0', 0, 35, 128, 3);
    },
  },
  stationhouse: {
    foot: [4, 2], tex: [68, 60], variants: ['laverton'],
    paint(p) {
      bricks(p, 2, 26, 64, 34, '#c8b8a0', 5);
      p.r('#d8643a', 0, 8, 68, 18); for (let x = 2; x < 68; x += 4) p.r('#c4542e', x, 8, 1, 18); p.r('#a8442a', 0, 24, 68, 2);
      window_(p, 8, 34, 18, 12, { curtain: null }); door(p, 36, 34, 12, 26, '#5a7a9a', false); p.r('#f4f4f0', 52, 34, 10, 8); p.text('WC', 53, 36, '#2a5a8a');
      p.r('#2a5a8a', 6, 0, 56, 8); p.text('LAVERTON', 18, 2, '#f4f4f0');
    },
  },
  footbridge: {
    foot: [3, 11], tex: [48, 180], variants: ['laverton'], solid: false, deck: true,
    paint(p) {
      const H = 180, top = H - 176;
      // concrete stairs down to the plaza (the first three tiles)
      p.r('#b8b4aa', 4, top, 40, 48);
      for (let y = top; y < top + 48; y += 4) { p.r('#d4d0c6', 6, y, 36, 2); p.r('#a8a49a', 6, y + 3, 36, 1); }
      p.r('#e8c030', 6, top + 46, 36, 2);
      // the walkway over the tracks
      p.r('#9aa0a8', 4, top + 48, 40, H - top - 48); p.r('#c9ccd2', 6, top + 48, 36, H - top - 48);
      for (let y = top + 52; y < H; y += 8) p.r('#b8bcc4', 6, y, 36, 1);
      // mesh balustrades
      for (const x of [2, 42]) {
        p.r('#5a5d64', x, top, 4, H - top);
        for (let y = top + 1; y < H; y += 3) p.r('#7a7d84', x + 1, y, 2, 1);
        p.r('#c4c8cc', x + 1, top, 1, H - top);
      }
    },
  },
  lavtower: {
    foot: [2, 2], tex: [44, 116], variants: ['laverton'],
    paint(p) {
      p.shadow(22, 115, 40);
      // glazed lift box on legs
      p.r('#4a4d54', 0, 8, 28, 26); p.r('#3a3d44', 0, 32, 28, 3);
      for (let i = 0; i < 3; i++) { p.r('#8ab0c8', 3 + i * 8, 12, 6, 10); p.r('#b8d4e4', 3 + i * 8, 12, 2, 4); }
      p.r('#5a5d64', 0, 24, 28, 8); p.r('#6a6d74', 0, 6, 28, 3);
      // tall concrete tower with LAVERTON down the front
      p.r('#c8c4bc', 26, 0, 16, 116); p.r('#dcd8d0', 27, 0, 3, 116); p.r('#a8a49c', 40, 0, 2, 116);
      p.r('#8ab4e0', 26, 92, 16, 24); for (let i = 0; i < 6; i++) p.r('#b8d4f0', 28 + i * 2, 94 + i * 3, 6, 1);
      [...'LAVERTON'].forEach((ch, i) => p.text(ch, 32, 6 + i * 10, '#7a8a9a'));
      // blue striped leg under the lift box
      p.r('#3a6ab8', 8, 34, 10, 82); for (let y = 38; y < 112; y += 7) { p.r('#e8e4f0', 8, y, 10, 1); p.r('#e08ab0', 9, y + 3, 7, 1); p.r('#1e3e80', 10, y + 5, 6, 1); }
    },
  },
  bluepillar: {
    foot: [1, 1], tex: [16, 56], variants: ['stripes'],
    paint(p) {
      p.shadow(8, 55, 14);
      p.r('#3a6ab8', 3, 0, 10, 56); p.r('#5a8ad0', 3, 0, 2, 56);
      for (let y = 2; y < 52; y += 6) { for (let i = 0; i < 8; i++) p.px(['#e8e4f0', '#e08ab0', '#1e3e80'][(y / 6 | 0) % 3], 4 + i, y + (i >> 1)); }
    },
  },
  islandbuilding: {
    foot: [6, 2], tex: [100, 60], variants: ['laverton'],
    paint(p) {
      const sx = 2, W = 96;
      p.r('rgba(30,50,20,.22)', sx + 2, 57, W, 3);
      p.r('#e4dcc4', sx, 26, W, 32); for (let x = sx + 6; x < sx + W; x += 12) p.r('#cfc6ac', x, 26, 1, 32);
      p.r('#c8643a', sx - 2, 6, W + 4, 20); for (let x = 0; x < W + 4; x += 4) p.r('#b4542e', sx - 2 + x, 6, 1, 20);
      p.r('#e07a4e', sx - 2, 6, W + 4, 2); p.r('#9a4428', sx - 2, 24, W + 4, 2);
      p.r('#2a6ac8', sx + 26, 26, 44, 9); p.text('LAVERTON', sx + 32, 28, '#ffffff');
      p.r('#2a2e33', sx + 38, 37, 20, 21); p.r('#6a8aa8', sx + 39, 38, 8, 20); p.r('#6a8aa8', sx + 49, 38, 8, 20); // glass doors
      p.r('#e8c030', sx + 40, 56, 16, 2);
      [[sx + 6, 'poster'], [sx + 74, 'map']].forEach(([x, k]) => { p.r('#f4f4f0', x, 36, 14, 16); p.r(k === 'poster' ? '#c8443a' : '#2a6ac8', x + 2, 38, 10, 12); });
    },
  },
  stanchion: {
    foot: [1, 1], tex: [64, 84], variants: ['overhead'],
    paint(p) {
      p.shadow(32, 83, 8);
      p.r('#8a8e96', 30, 8, 4, 76); p.r('#a8acb4', 30, 8, 1, 76);
      p.r('#7a7e86', 2, 10, 60, 3); p.r('#9a9ea6', 2, 10, 60, 1); p.r('#5a5e66', 8, 13, 2, 6); p.r('#5a5e66', 54, 13, 2, 6);
      p.r('#3a3d44', 0, 20, 64, 1);
    },
  },
  ptsign: {
    foot: [1, 1], tex: [44, 56], variants: ['laverton', 'brunswick'],
    paint(p, v) {
      p.shadow(22, 55, 14);
      p.r('#9aa0a8', 20, 40, 4, 16);
      p.r('#2a6ac8', 2, 0, 40, 30); p.r('#4a8ae0', 2, 0, 40, 2);
      p.text('PT', 33, 3, '#ffffff'); p.text(v.toUpperCase(), 4, 10, '#ffffff'); p.text('STATION', 4, 17, '#ffffff');
      p.r('#3a2a1e', 2, 30, 40, 6); p.r('#3a2a1e', 2, 36, 40, 4); p.r('#d8643a', 2, 40, 40, 5);
      p.r('#f4f4f0', 4, 32, 14, 1); p.r('#f4f4f0', 4, 37, 10, 1); p.r('#f4f4f0', 4, 42, 10, 1);
    },
  },

  bollard: {
    foot: [1, 1], tex: [16, 16], variants: ['steel'],
    paint(p) { p.shadow(8, 15, 6); p.r('#b8bcc4', 6, 3, 4, 12); p.r('#e8ecef', 6, 3, 1, 12); p.r('#e8c030', 6, 5, 4, 1); },
  },
  bikerack: {
    foot: [2, 1], tex: [32, 20], variants: ['bike'],
    paint(p) {
      for (const x of [3, 13, 23]) { p.r('#9aa0a8', x, 6, 2, 13); p.r('#9aa0a8', x + 5, 6, 2, 13); p.r('#9aa0a8', x, 5, 7, 2); }
      p.blob(12, 15, 4, '#2a2a2a'); p.blob(12, 15, 2, '#88aacc'); p.blob(24, 15, 4, '#2a2a2a'); p.blob(24, 15, 2, '#88aacc');
      p.r('#c8443a', 12, 10, 12, 2); p.r('#c8443a', 16, 10, 2, 6); p.r('#2a2a2a', 20, 7, 4, 2);
    },
  },
  buszone: {
    foot: [1, 1], tex: [16, 36], variants: ['sign'],
    paint(p) { p.r('#9aa0a8', 7, 10, 2, 26); p.r('#f4f4f0', 2, 0, 12, 14); p.r('#c8443a', 3, 1, 10, 12); p.text('BUS', 3, 2, '#ffffff'); p.r('#f4f4f0', 3, 8, 10, 4); },
  },

  reunion: {
    foot: [2, 1], tex: [44, 58], variants: ['green'],
    paint(p) {
      p.shadow(22, 57, 28, 0.3);
      // four glossy green balloons, like a giant balloon animal
      const ball = (cx, cy, rx, ry) => {
        for (let j = -ry; j <= ry; j++) { const w = Math.round(rx * Math.sqrt(1 - (j / ry) ** 2)); p.r('#1c8a48', cx - w, cy + j, w * 2, 1); }
        for (let j = -ry + 2; j <= ry - 3; j++) { const w = Math.round((rx - 2) * Math.sqrt(1 - (j / ry) ** 2)); p.r('#26a85a', cx - w - 1, cy + j - 1, w * 2, 1); }
        p.r('#7ae0a4', cx - Math.round(rx * 0.45), cy - Math.round(ry * 0.5), 3, 2); p.r('#c4f4d8', cx - Math.round(rx * 0.4), cy - Math.round(ry * 0.5), 1, 1);
        p.r('#126a36', cx - rx + 2, cy + ry - 1, rx * 2 - 4, 1);
      };
      ball(22, 44, 8, 12);   // the one standing on the ground
      ball(11, 22, 9, 7); ball(33, 14, 9, 7); ball(22, 24, 8, 7);
      p.r('#0e5a2e', 21, 30, 3, 4);
    },
  },

  carparksign: {
    foot: [1, 1], tex: [16, 30], variants: ['p'],
    paint(p) { p.r('#3c4148', 7, 10, 2, 20); p.r('#2a5aa8', 2, 1, 12, 11); p.r('#f4f4f0', 6, 3, 2, 7); p.r('#f4f4f0', 6, 3, 5, 1); p.r('#f4f4f0', 6, 6, 5, 1); p.r('#f4f4f0', 10, 3, 1, 4); },
  },
  veggie: {
    foot: [3, 2], tex: [48, 34], variants: ['raised'],
    paint(p) {
      box(p, 0, 4, 48, 30, '#8a6a4a'); p.r('#5e3e24', 3, 7, 42, 24);
      for (let y = 9; y < 30; y += 5) p.r('#4e3220', 3, y, 42, 1);
      [[8, 12], [20, 16], [32, 11], [40, 22], [12, 24]].forEach(([x, y]) => { p.r('#57a84a', x, y, 2, 3); p.r('#86ca5e', x - 1, y - 1, 4, 1); });
    },
  },
};
