// Built-in art for map objects (trees, houses, props).
//
// Each object kind has:
//   foot     [w, h] footprint in tiles. This is what blocks movement.
//   tex      [w, h] texture size in pixels. The texture sits bottom-centre on
//            the footprint, so tall things (trees, roofs) overhang upwards.
//   variants list of variant names (each becomes its own texture).
//   solid    false for things you can walk through (reeds, crops).
//   paint    draws one variant. sx/sy give the top-left of the footprint.
//
// To replace one with your own PNG, see assets/sprites/README.md.

import { hash } from '../../util.js';
import { textWidth } from './painter.js';

const T = 16;

function frame(def) {
  const [fw, fh] = def.foot, [tw, th] = def.tex;
  return { W: fw * T, H: fh * T, sx: Math.round((tw - fw * T) / 2), sy: th - fh * T, tw, th };
}

export const OBJECTS = {
  tree: {
    foot: [1, 1], tex: [32, 40], variants: ['gum', 'oak', 'fruit', 'lemon', 'pine', 'palm'],
    paint(p, v) {
      p.shadow(16, 38, 16);
      if (v === 'gum') {
        p.r('#d8cbb4', 14, 16, 4, 24); p.r('#b5a68a', 17, 16, 1, 24); p.r('#c4b393', 15, 28, 1, 5);
        p.r('#d8cbb4', 10, 19, 4, 2); p.r('#d8cbb4', 18, 15, 5, 2);
        p.blob(9, 15, 6, '#557f52'); p.blob(23, 11, 6, '#557f52'); p.blob(15, 8, 7, '#5f8a5a');
        p.blob(22, 9, 4, '#73a06a'); p.blob(10, 12, 4, '#73a06a'); p.blob(15, 4, 3, '#8fbb80');
        return;
      }
      if (v === 'pine') {
        p.r('#6b4226', 14, 30, 4, 10);
        for (let i = 0; i < 4; i++) {
          const y = 4 + i * 7, w = 6 + i * 4;
          p.r('#245a33', 16 - w, y + 4, w * 2, 5); p.r('#2f7340', 16 - w + 2, y + 3, w * 2 - 4, 4);
          p.r('#3f8a4e', 16 - w + 4, y + 3, w - 4, 2);
        }
        p.r('#2f7340', 14, 0, 4, 6);
        return;
      }
      if (v === 'palm') {
        for (let y = 10; y < 40; y += 3) { p.r('#8a6a3e', 14, y, 5, 3); p.r('#6e5230', 14, y + 2, 5, 1); }
        const frond = (dx, dy) => { for (let i = 0; i < 9; i++) p.r(i % 2 ? '#3f8a3e' : '#2f7a37', 16 + dx * i, 8 + dy * i + Math.floor(i * i / 12), 3, 2); };
        frond(-1.4, -0.2); frond(1.4, -0.2); frond(-1, 0.5); frond(1, 0.5); frond(-0.5, -0.8); frond(0.5, -0.8);
        p.blob(16, 9, 3, '#4a7a2a');
        return;
      }
      const small = v === 'lemon';
      p.r('#6b4226', 14, small ? 26 : 24, 4, 16); p.r('#4e2f1a', 17, small ? 26 : 24, 1, 16);
      const cy = small ? 19 : 16, rr = small ? 9 : 12;
      const dark = small ? '#2a5e2e' : '#2c6a33', mid = small ? '#357a38' : '#3b8a3e', hi = small ? '#4a9447' : '#4f9e46';
      p.blob(16, cy, rr, dark); p.blob(16, cy - 1, rr - 1, mid); p.blob(13, cy - 4, Math.round(rr / 2), hi); p.blob(11, cy - 6, 2, '#6dbb58');
      if (v === 'fruit') [[21, 18], [9, 20], [17, 11], [23, 12]].forEach(([x, y]) => p.r('#e05a4a', x, y, 2, 2));
      if (v === 'lemon') [[20, 19], [11, 21], [16, 14], [22, 23], [13, 16]].forEach(([x, y]) => { p.r('#f5d63a', x, y, 2, 2); p.px('#fff3a0', x, y); });
    },
  },

  bush: {
    foot: [1, 1], tex: [16, 16], variants: ['berry', 'green', 'rose', 'hydrangea'],
    paint(p, v) {
      p.shadow(8, 15, 12);
      p.blob(8, 10, 6, '#2f7a37'); p.blob(8, 9, 5, '#46993f'); p.blob(6, 7, 2, '#5fb24f');
      const dots = { berry: '#d8405a', rose: '#f28bb0', hydrangea: '#7fa6e8' }[v];
      if (dots) [[5, 9], [10, 11], [9, 6], [3, 12]].forEach(([x, y]) => p.r(dots, x, y, 2, 2));
    },
  },

  rock: {
    foot: [1, 1], tex: [16, 16], variants: ['a'],
    paint(p) {
      p.shadow(8, 15, 13);
      p.blob(8, 10, 6, '#6e6a62'); p.blob(7, 9, 5, '#8c877d'); p.blob(6, 7, 2, '#a8a397'); p.r('#5d5a53', 9, 12, 4, 1);
    },
  },

  sign: {
    foot: [1, 1], tex: [16, 16], variants: ['wood'],
    paint(p) {
      p.shadow(8, 15, 10);
      p.r('#6b4226', 7, 6, 2, 10); p.r('#4a2a12', 1, 1, 14, 8); p.r('#b07a42', 2, 2, 12, 6);
      p.r('#7b4a24', 4, 4, 8, 1); p.r('#7b4a24', 4, 6, 6, 1);
    },
  },

  lamp: {
    foot: [1, 1], tex: [16, 32], variants: ['street'],
    paint(p) {
      p.shadow(8, 31, 8);
      p.r('#3c4148', 7, 6, 2, 26); p.r('#5a6068', 7, 6, 1, 26); p.r('#3c4148', 5, 29, 6, 3);
      p.r('#3c4148', 4, 3, 8, 3); p.r('#fff1b0', 5, 6, 6, 2); p.r('#2a2e33', 6, 2, 4, 1);
    },
  },

  bench: {
    foot: [2, 1], tex: [32, 16], variants: ['wood'],
    paint(p) {
      p.shadow(16, 15, 28);
      p.r('#3a3a3a', 3, 9, 2, 6); p.r('#3a3a3a', 27, 9, 2, 6);
      p.r('#8a5a2e', 2, 2, 28, 3); p.r('#8a5a2e', 2, 6, 28, 3); p.r('#a8723c', 2, 9, 28, 3);
      p.r('#5e3a1a', 2, 5, 28, 1); p.r('#5e3a1a', 2, 12, 28, 1);
    },
  },

  bin: {
    foot: [1, 1], tex: [16, 16], variants: ['red', 'yellow', 'green'],
    paint(p, v) {
      const lid = { red: '#c8443a', yellow: '#e8c030', green: '#6aa83a' }[v];
      p.shadow(8, 15, 10);
      p.r('#2f4a36', 4, 5, 8, 10); p.r('#3d5e45', 5, 5, 2, 10); p.r('#1e3024', 4, 14, 8, 1);
      p.r(lid, 3, 3, 10, 3); p.r('#ffffff40', 4, 3, 8, 1); p.r('#1e1e1e', 3, 13, 2, 2); p.r('#1e1e1e', 11, 13, 2, 2);
    },
  },

  letterbox: {
    foot: [1, 1], tex: [16, 16], variants: ['brick', 'metal'],
    paint(p, v) {
      p.shadow(8, 15, 8);
      if (v === 'brick') {
        p.r('#a8553a', 4, 4, 8, 11); for (let y = 6; y < 15; y += 3) p.r('#8e4430', 4, y, 8, 1);
        p.r('#2a1a0c', 6, 6, 4, 1);
      } else {
        p.r('#6b4226', 7, 8, 2, 7); p.r('#c8443a', 4, 3, 8, 6); p.r('#e2705f', 4, 3, 8, 1); p.r('#2a1a0c', 5, 5, 4, 1);
      }
    },
  },

  // Fences join up with their neighbours. Variant = style:mask (mask bits L1 R2 U4 D8).
  fence: {
    foot: [1, 1], tex: [16, 16], variants: 'mask', styles: ['picket', 'colorbond', 'park'],
    paint(p, v) {
      const [style, m] = v.split(':'); const mask = +m;
      const L = mask & 1, R = mask & 2, U = mask & 4, D = mask & 8;
      if (style === 'colorbond') {
        const c = '#6f7a66', d = '#59634f', hi = '#86917c';
        if (L || R || !(U || D)) {
          const x0 = L ? 0 : 6, x1 = R ? 16 : 10;
          p.r(c, x0, 2, x1 - x0, 12); for (let x = x0; x < x1; x += 2) p.r(d, x, 2, 1, 12); p.r(hi, x0, 2, x1 - x0, 1); p.r(d, x0, 13, x1 - x0, 1);
        }
        if (U || D) { const y0 = U ? 0 : 2, y1 = D ? 16 : 14; p.r(d, 6, y0, 4, y1 - y0); p.r(c, 7, y0, 2, y1 - y0); }
        return;
      }
      if (style === 'park') {
        const c = '#2e2e34', hi = '#5a5a66';
        if (L || R || !(U || D)) {
          const x0 = L ? 0 : 7, x1 = R ? 16 : 9;
          p.r(c, x0, 5, x1 - x0, 1); p.r(c, x0, 11, x1 - x0, 1);
          for (let x = x0 + 1; x < x1; x += 3) { p.r(c, x, 3, 1, 11); p.px(hi, x, 3); }
        }
        if (U || D) { const y0 = U ? 0 : 3, y1 = D ? 16 : 14; p.r(c, 7, y0, 2, y1 - y0); p.r(hi, 7, y0, 1, y1 - y0); }
        p.r(c, 6, 3, 4, 11);
        return;
      }
      // white picket
      const c = '#f4f0e6', s = '#c9c3b5';
      p.r('#9a958a40', 2, 14, 12, 1);
      if (L || R || !(U || D)) {
        const x0 = L ? 0 : 5, x1 = R ? 16 : 11;
        p.r(c, x0, 6, x1 - x0, 2); p.r(c, x0, 10, x1 - x0, 2);
        for (let x = x0 + 1; x < x1; x += 4) { p.r(c, x, 3, 2, 11); p.r(s, x + 1, 4, 1, 10); p.px(c, x, 2); }
      }
      if (U || D) { const y0 = U ? 0 : 3, y1 = D ? 16 : 14; p.r(c, 6, y0, 4, y1 - y0); p.r(s, 9, y0, 1, y1 - y0); }
    },
  },

  shed: {
    foot: [6, 3], tex: [96, 56], variants: ['grey', 'blue'],
    paint(p, v) {
      const { sx, sy, W, H } = frame(this);
      const wall = v === 'blue' ? ['#8fa3b5', '#7b8fa1', '#55697a', '#6c8193'] : ['#a7afb3', '#8e979b', '#6c757a', '#848d92'];
      p.r('rgba(30,50,20,.22)', sx + 2, sy + H - 2, W - 2, 4);
      p.r(wall[0], sx, sy + 10, W, H - 10);
      for (let x = 0; x < W; x += 3) p.r(wall[1], sx + x, sy + 10, 1, H - 10);
      p.r(wall[2], sx, sy - 6, W, 17); p.r(wall[3], sx, sy - 6, W, 2);
      for (let x = 0; x < W; x += 4) p.r('#5d666b', sx + x, sy - 4, 1, 15);
      const dw = 28; p.r('#5d666b', sx + 10, sy + H - 26, dw + 2, 26); p.r('#c3c8cb', sx + 11, sy + H - 25, dw, 25);
      for (let y = 0; y < 25; y += 3) p.r('#a9afb2', sx + 11, sy + H - 25 + y, dw, 1);
      p.r('#3a4a5a', sx + W - 26, sy + H - 30, 16, 10); p.r('#6f8fa8', sx + W - 25, sy + H - 29, 14, 8);
      p.r('#e8b730', sx + W - 30, sy + 14, 24, 7); p.text(v === 'blue' ? 'PARTS' : 'SHED 9', sx + W - 28, sy + 15, '#3a2412');
    },
  },

  terrace: {
    foot: [3, 3], tex: [48, 60], variants: ['brick', 'cream', 'sage', 'sand'],
    paint(p, v) {
      const { sx, sy, W, H } = frame(this);
      const wall = { brick: '#a8553a', cream: '#e8dcc2', sage: '#9fb39a', sand: '#c9b08a' }[v];
      const door = { brick: '#5a8a6a', cream: '#b84a3a', sage: '#3a5a8a', sand: '#2f5b4a' }[v];
      p.r('rgba(30,50,20,.22)', sx + 2, sy + H - 2, W - 2, 4);
      p.r(wall, sx + 1, sy + 12, W - 2, H - 12);
      if (v === 'brick') for (let y = sy + 14; y < sy + H; y += 4) p.r('#8e4430', sx + 1, y, W - 2, 1);
      p.r('#5f636c', sx - 0, sy, W, 13); p.r('#73777f', sx, sy, W, 2);
      p.r('#6e5a4a', sx + W - 12, sy - 6, 6, 8); p.r('#4e3e32', sx + W - 13, sy - 7, 8, 2);
      p.r('#f2efe6', sx, sy + 12, W, 2);
      p.r('#3d2a1a', sx + 6, sy + 28, 11, 20); p.r(door, sx + 7, sy + 29, 9, 19); p.r('#f0c040', sx + 14, sy + 39, 1, 2);
      p.r('#9fd0ea', sx + 8, sy + 25, 7, 2);
      p.r('#f2efe6', sx + 25, sy + 22, 16, 17); p.r('#7fb4d2', sx + 27, sy + 24, 12, 13); p.r('#f2efe6', sx + 32, sy + 24, 1, 13);
      p.r('#b0dcf0', sx + 28, sy + 25, 3, 2);
      p.r('#f2efe6', sx, sy + 26, W, 2);
      for (let x = 0; x < W; x += 4) p.r('#f2efe6', sx + x + 1, sy + 28, 2, 2);
      p.r('#f2efe6', sx + 1, sy + 28, 2, 20); p.r('#f2efe6', sx + W - 3, sy + 28, 2, 20);
      p.r('#2e2e34', sx + 1, sy + H - 2, W - 2, 2);
    },
  },

  cafe: {
    foot: [4, 3], tex: [64, 56], variants: ['green'],
    paint(p) {
      const { sx, sy, W, H } = frame(this);
      p.r('rgba(30,50,20,.22)', sx + 2, sy + H - 2, W - 2, 4);
      p.r('#2f5b4a', sx, sy + 10, W, H - 10);
      p.r('#24483a', sx, sy - 2, W, 13); p.r('#f4dfae', sx + 6, sy + 1, W - 12, 8);
      p.text('CAFE', sx + Math.round((W - textWidth('CAFE')) / 2), sy + 3, '#2f5b4a');
      for (let i = 0; i < 8; i++) p.r(i % 2 ? '#f4efe0' : '#c8443a', sx + i * 8, sy + 14, 8, 7);
      p.r('#9a3028', sx, sy + 21, W, 1);
      p.r('#f4efe0', sx + 4, sy + 24, 26, 20); p.r('#a8d4e8', sx + 6, sy + 26, 22, 16); p.r('#ffffff', sx + 8, sy + 28, 3, 3);
      p.r('#6a4a2a', sx + 9, sy + 36, 14, 6); p.r('#f4efe0', sx + 11, sy + 34, 3, 2); p.r('#f4efe0', sx + 17, sy + 34, 3, 2);
      p.r('#3d2a1a', sx + 40, sy + 26, 14, 22); p.r('#6a4a2a', sx + 41, sy + 27, 12, 21); p.r('#f0c040', sx + 51, sy + 37, 1, 2);
      p.r('#2a1a0c', sx + 33, sy + 30, 5, 10); p.r('#f4efe0', sx + 34, sy + 31, 3, 4);
    },
  },

  shop: {
    foot: [4, 3], tex: [64, 56], variants: ['milk bar', 'records', 'bakery', 'pho', 'books'],
    paint(p, v) {
      const { sx, sy, W, H } = frame(this);
      const col = { 'milk bar': ['#e8dcc2', '#2f6aa3'], records: ['#3a3a48', '#e77fb8'], bakery: ['#f0d9a8', '#a0582a'], pho: ['#c8443a', '#f5d63a'], books: ['#e8dcc2', '#3f6a4a'] }[v];
      p.r('rgba(30,50,20,.22)', sx + 2, sy + H - 2, W - 2, 4);
      p.r(col[0], sx, sy + 6, W, H - 6);
      p.r('#4a4e56', sx, sy - 2, W, 9); p.r('#5d616a', sx, sy - 2, W, 2);
      p.r(col[1], sx + 2, sy + 8, W - 4, 9);
      const label = v.toUpperCase(); p.text(label, sx + Math.round((W - textWidth(label)) / 2), sy + 10, col[0] === '#3a3a48' ? '#ffffff' : '#ffffff');
      for (let i = 0; i < 8; i++) p.r(i % 2 ? '#f4efe0' : col[1], sx + i * 8, sy + 19, 8, 5);
      p.r('#2a2e33', sx + 3, sy + 26, 34, 20); p.r('#a8d4e8', sx + 4, sy + 27, 32, 18);
      if (v === 'milk bar') { p.r('#c8443a', sx + 6, sy + 29, 8, 10); p.r('#f4efe0', sx + 7, sy + 31, 6, 2); p.r('#f5d63a', sx + 18, sy + 30, 9, 7); p.r('#2f6aa3', sx + 28, sy + 33, 6, 9); }
      if (v === 'records') { [[7, 30], [17, 30], [27, 30]].forEach(([x, y]) => { p.blob(sx + x + 3, sy + y + 4, 4, '#1e1e24'); p.px('#e77fb8', sx + x + 3, sy + y + 4); }); }
      if (v === 'bakery') { [[7, 38], [16, 38], [25, 38]].forEach(([x, y]) => { p.r('#c8823a', sx + x, sy + y, 7, 4); p.r('#e8b060', sx + x + 1, sy + y, 5, 1); }); }
      if (v === 'pho') { p.blob(sx + 18, sy + 37, 6, '#f4efe0'); p.r('#c8823a', sx + 13, sy + 35, 10, 2); p.r('#3a2412', sx + 20, sy + 29, 1, 7); }
      if (v === 'books') { for (let i = 0; i < 7; i++) p.r(['#c8443a', '#2f6aa3', '#e8c030', '#3f8a4e'][i % 4], sx + 6 + i * 4, sy + 33, 3, 10); }
      p.r('#3d2a1a', sx + 42, sy + 26, 14, 22); p.r('#7b4a24', sx + 43, sy + 27, 12, 21); p.r('#a8d4e8', sx + 45, sy + 29, 8, 8); p.r('#f0c040', sx + 53, sy + 39, 1, 2);
    },
  },

  weatherboard: {
    foot: [4, 3], tex: [64, 58], variants: ['cream', 'blue', 'mint', 'lemon'],
    paint(p, v) {
      const { sx, sy, W, H } = frame(this);
      const wall = { cream: ['#efe6cf', '#d6caae'], blue: ['#cfe0ea', '#b0c6d4'], mint: ['#d4ead6', '#b4d0b6'], lemon: ['#f4ecb8', '#ddd398'] }[v];
      const roof = v === 'blue' ? ['#6c757a', '#5a6268'] : ['#b0583a', '#8e4430'];
      p.r('rgba(30,50,20,.22)', sx + 2, sy + H - 2, W - 2, 4);
      p.r(wall[0], sx + 1, sy + 14, W - 2, H - 14);
      for (let y = sy + 16; y < sy + H; y += 3) p.r(wall[1], sx + 1, y, W - 2, 1);
      for (let i = 0; i < 18; i++) { const w = Math.round(W - 10 + i * 14 / 17); p.r(i % 4 === 3 ? roof[1] : roof[0], sx + W / 2 - Math.round(w / 2), sy - 4 + i, w, 1); }
      p.r('#6e5a4a', sx + 10, sy - 9, 5, 7);
      p.r('#6b4226', sx + 25, sy + 30, 12, 18); p.r('#f0c040', sx + 34, sy + 39, 1, 2);
      p.r('#f4f0e6', sx + 22, sy + 26, 18, 2); p.r('#f4f0e6', sx + 22, sy + 26, 2, 22); p.r('#f4f0e6', sx + 38, sy + 26, 2, 22);
      [5, 44].forEach(wx => { p.r('#f4f0e6', sx + wx, sy + 22, 14, 13); p.r('#86b8d6', sx + wx + 2, sy + 24, 10, 9); p.r('#f4f0e6', sx + wx + 6, sy + 24, 1, 9); p.r('#a8d0e6', sx + wx + 3, sy + 25, 2, 2); });
      p.r('#c9c0a8', sx, sy + H - 3, W, 3);
    },
  },

  brickhouse: {
    foot: [4, 3], tex: [64, 56], variants: ['tan', 'red'],
    paint(p, v) {
      const { sx, sy, W, H } = frame(this);
      const brick = v === 'red' ? ['#a8553a', '#8e4430'] : ['#c88a5a', '#ad7448'];
      p.r('rgba(30,50,20,.22)', sx + 2, sy + H - 2, W - 2, 4);
      p.r(brick[0], sx + 1, sy + 14, W - 2, H - 14);
      for (let y = sy + 16; y < sy + H; y += 3) for (let x = sx + 1 + ((y / 3) % 2) * 3; x < sx + W - 1; x += 6) p.r(brick[1], x, y, 1, 1);
      for (let y = sy + 16; y < sy + H; y += 3) p.r(brick[1], sx + 1, y, W - 2, 1);
      // hip roof
      for (let i = 0; i < 18; i++) { const w = W - 16 + i; p.r(i % 3 === 2 ? '#3e4046' : '#4e5158', sx + (W - w) / 2, sy - 4 + i, w, 1); }
      p.r('#5d616a', sx + 8, sy - 4, W - 16, 1);
      // garage roller door
      p.r('#3a3a3a', sx + 34, sy + 24, 26, 24); p.r('#e8e4d8', sx + 35, sy + 25, 24, 23);
      for (let y = 0; y < 23; y += 3) p.r('#c9c3b5', sx + 35, sy + 25 + y, 24, 1);
      p.r('#f4f0e6', sx + 5, sy + 24, 20, 12); p.r('#86b8d6', sx + 6, sy + 25, 18, 10); p.r('#f4f0e6', sx + 14, sy + 25, 1, 10);
      p.r('#6b4226', sx + 25, sy + 34, 8, 14); p.r('#f0c040', sx + 31, sy + 41, 1, 2);
    },
  },

  warehouse: {
    foot: [8, 4], tex: [128, 72], variants: ['hardware'],
    paint(p) {
      const { sx, sy, W, H } = frame(this);
      p.r('rgba(30,50,20,.22)', sx + 2, sy + H - 2, W - 2, 4);
      p.r('#3d6e5e', sx, sy + 8, W, H - 8);
      for (let x = 0; x < W; x += 4) p.r('#335e50', sx + x, sy + 8, 1, H - 8);
      p.r('#5b6066', sx, sy - 8, W, 17); p.r('#71767c', sx, sy - 8, W, 2);
      for (let x = 0; x < W; x += 6) p.r('#4c5157', sx + x, sy - 6, 1, 15);
      p.r('#e07a2e', sx + 20, sy + 12, W - 40, 11); p.text('HARDWARE BARN', sx + Math.round((W - textWidth('HARDWARE BARN')) / 2), sy + 15, '#ffffff');
      [[8, 36], [W - 44, 36]].forEach(([x]) => { p.r('#2a2e33', sx + x, sy + 30, 36, 34); p.r('#c3c8cb', sx + x + 1, sy + 31, 34, 33); for (let y = 0; y < 33; y += 3) p.r('#a9afb2', sx + x + 1, sy + 31 + y, 34, 1); });
      p.r('#2a2e33', sx + 52, sy + 36, 24, 28); p.r('#a8d4e8', sx + 53, sy + 37, 22, 27); p.r('#2a2e33', sx + 63, sy + 37, 2, 27);
    },
  },

  shelter: {
    foot: [3, 1], tex: [48, 40], variants: ['laverton', 'brunswick', 'reservoir'],
    paint(p, v) {
      const { sx, sy, W, H } = frame(this);
      p.shadow(24, 39, 44);
      p.r('#3c4148', sx + 2, sy - 18, 2, 34); p.r('#3c4148', sx + W - 4, sy - 18, 2, 34);
      p.r('#8a5a2e', sx + 8, sy + 6, W - 16, 3); p.r('#5e3a1a', sx + 10, sy + 9, 2, 6); p.r('#5e3a1a', sx + W - 12, sy + 9, 2, 6);
      p.r('#2a5a8a', sx - 0, sy - 24, W, 7); p.r('#3a72a8', sx, sy - 24, W, 2); p.r('#1e3e60', sx, sy - 18, W, 1);
      p.r('#f4efe0', sx + 6, sy - 14, W - 12, 8);
      const label = v.toUpperCase(); p.text(label, sx + Math.round((W - textWidth(label)) / 2), sy - 13, '#1e3e60');
    },
  },

  myki: {
    foot: [1, 1], tex: [16, 24], variants: ['reader'],
    paint(p) {
      p.shadow(8, 23, 8);
      p.r('#2a2e33', 7, 10, 2, 14); p.r('#2a2e33', 3, 1, 10, 11); p.r('#8dc63f', 4, 2, 8, 9);
      p.r('#2a2e33', 5, 4, 6, 3); p.r('#d8f0a8', 6, 5, 4, 1); p.r('#f4efe0', 5, 8, 6, 2);
    },
  },

  container: {
    foot: [3, 1], tex: [48, 28], variants: ['red', 'blue', 'green', 'orange'],
    paint(p, v) {
      const c = { red: ['#a8403a', '#8a302a'], blue: ['#2f5f8f', '#244a70'], green: ['#3f7a4a', '#2f5e38'], orange: ['#d0802e', '#a86420'] }[v];
      p.shadow(24, 27, 46);
      p.r(c[0], 0, 4, 48, 22); for (let x = 1; x < 48; x += 3) p.r(c[1], x, 6, 1, 19);
      p.r(c[1], 0, 4, 48, 2); p.r('#ffffff30', 0, 4, 48, 1); p.r(c[1], 0, 25, 48, 2);
      p.r('#2a2a2a', 40, 8, 1, 15); p.r('#2a2a2a', 44, 8, 1, 15);
    },
  },

  car: {
    foot: [2, 1], tex: [32, 22], variants: ['white', 'red', 'blue', 'silver', 'yellow'],
    paint(p, v) {
      const c = { white: ['#f0f0ec', '#c9c9c4'], red: ['#c8443a', '#9a3028'], blue: ['#3a6aa8', '#2a5080'], silver: ['#b8bcc4', '#8e939b'], yellow: ['#e8c030', '#b8961e'] }[v];
      p.shadow(16, 21, 30);
      p.r('#1e1e1e', 4, 16, 6, 5); p.r('#1e1e1e', 22, 16, 6, 5);
      p.r(c[0], 1, 9, 30, 10); p.r(c[1], 1, 16, 30, 3);
      p.r(c[0], 7, 3, 18, 8); p.r('#7fb4d2', 9, 4, 6, 6); p.r('#7fb4d2', 17, 4, 6, 6); p.r(c[1], 15, 4, 2, 6);
      p.r('#f5e66b', 29, 11, 2, 2); p.r('#d83c3c', 1, 11, 2, 2);
    },
  },

  trolley: {
    foot: [1, 1], tex: [16, 16], variants: ['wire'],
    paint(p) {
      p.shadow(8, 15, 12);
      p.r('#9aa0a8', 2, 4, 12, 7); for (let x = 3; x < 14; x += 2) p.r('#cfd4da', x, 5, 1, 5);
      p.r('#cfd4da', 2, 4, 12, 1); p.r('#c8443a', 1, 2, 3, 2); p.r('#9aa0a8', 3, 11, 1, 3); p.r('#9aa0a8', 12, 11, 1, 3);
      p.r('#1e1e1e', 2, 13, 3, 2); p.r('#1e1e1e', 11, 13, 3, 2);
    },
  },

  crate: {
    foot: [1, 1], tex: [16, 16], variants: ['blue', 'red'],
    paint(p, v) {
      const c = v === 'red' ? ['#c8443a', '#9a3028'] : ['#2f6aa3', '#244f7a'];
      p.shadow(8, 15, 14);
      p.r(c[0], 2, 4, 12, 11); p.r(c[1], 2, 4, 12, 2);
      for (let x = 3; x < 13; x += 3) p.r(c[1], x, 7, 2, 6);
      p.r('#f4efe0', 5, 8, 6, 2);
    },
  },

  table: {
    foot: [1, 1], tex: [16, 16], variants: ['cafe'],
    paint(p) {
      p.shadow(8, 15, 14);
      p.r('#3a3a3a', 0, 6, 3, 8); p.r('#3a3a3a', 13, 6, 3, 8);
      p.r('#5e3a1a', 7, 8, 2, 7); p.blob(8, 6, 5, '#e8dcc2'); p.blob(8, 5, 4, '#f4efe0');
      p.r('#f4efe0', 6, 3, 3, 2); p.px('#6a4a2a', 7, 3);
    },
  },

  picnic: {
    foot: [2, 1], tex: [32, 18], variants: ['wood'],
    paint(p) {
      p.shadow(16, 17, 30);
      p.r('#8a5a2e', 1, 12, 30, 3); p.r('#8a5a2e', 1, 1, 30, 3);
      p.r('#a8723c', 3, 4, 26, 8); p.r('#8a5a2e', 3, 7, 26, 1); p.r('#5e3a1a', 6, 12, 2, 4); p.r('#5e3a1a', 24, 12, 2, 4);
    },
  },

  bbq: {
    foot: [1, 1], tex: [16, 18], variants: ['council'],
    paint(p) {
      p.shadow(8, 17, 14);
      p.r('#9aa0a8', 1, 6, 14, 11); p.r('#b8bcc4', 1, 6, 14, 1); p.r('#2a2e33', 2, 3, 12, 4); p.r('#5d616a', 3, 4, 10, 2);
      p.r('#c8443a', 11, 10, 2, 2);
    },
  },

  swings: {
    foot: [3, 1], tex: [48, 36], variants: ['park'],
    paint(p) {
      p.shadow(24, 35, 44);
      p.r('#c8443a', 3, 4, 2, 32); p.r('#c8443a', 43, 4, 2, 32); p.r('#c8443a', 3, 3, 42, 3); p.r('#e2705f', 3, 3, 42, 1);
      [[12], [30]].forEach(([x]) => { p.r('#5a5a66', x, 6, 1, 20); p.r('#5a5a66', x + 6, 6, 1, 20); p.r('#2f6aa3', x - 1, 25, 9, 3); });
    },
  },

  slide: {
    foot: [2, 2], tex: [32, 40], variants: ['park'],
    paint(p) {
      p.shadow(16, 39, 28);
      p.r('#9aa0a8', 3, 8, 2, 30); p.r('#9aa0a8', 11, 8, 2, 30);
      for (let y = 12; y < 38; y += 5) p.r('#9aa0a8', 3, y, 10, 1);
      p.r('#e8c030', 2, 6, 12, 4);
      for (let i = 0; i < 24; i++) p.r(i % 4 === 0 ? '#f0d050' : '#e8c030', 13 + i * 0.7, 8 + i * 1.2, 6, 3);
    },
  },

  mural: {
    foot: [4, 1], tex: [64, 32], variants: ['a', 'b'],
    paint(p, v) {
      p.r('rgba(30,50,20,.22)', 1, 29, 64, 3);
      p.r('#9a5a3e', 0, 4, 64, 28); for (let y = 6; y < 32; y += 4) p.r('#7e4630', 0, y, 64, 1);
      p.r('#6e4030', 0, 2, 64, 3);
      const cols = v === 'a' ? ['#e77fb8', '#f5d63a', '#3fa38f', '#7fa6e8', '#f29a5b'] : ['#a24fc9', '#8dc63f', '#f28bb0', '#2f6aa3', '#f5e66b'];
      for (let i = 0; i < 9; i++) p.blob(4 + hash(i, 3) * 56, 10 + hash(i, 7) * 16, 3 + Math.floor(hash(i, 9) * 5), cols[i % cols.length]);
      // a big friendly cat face, because Brunswick
      p.blob(32, 17, 8, '#f4efe0'); p.r('#f4efe0', 24, 7, 4, 6); p.r('#f4efe0', 36, 7, 4, 6);
      p.r('#3a2412', 28, 15, 2, 2); p.r('#3a2412', 34, 15, 2, 2); p.r('#f08aa0', 31, 19, 2, 1);
    },
  },

  sizzle: {
    foot: [2, 1], tex: [32, 34], variants: ['stand'],
    paint(p) {
      p.shadow(16, 33, 30);
      p.r('#c8443a', 0, 2, 32, 6); for (let i = 0; i < 4; i++) p.r('#f4efe0', i * 8 + 4, 2, 4, 6);
      p.r('#9a3028', 0, 8, 32, 1); p.r('#9aa0a8', 1, 8, 1, 24); p.r('#9aa0a8', 30, 8, 1, 24);
      p.r('#2a2e33', 4, 20, 24, 4); p.r('#5d616a', 4, 18, 24, 2);
      for (let i = 0; i < 5; i++) p.r('#a0522d', 6 + i * 4, 17, 3, 2);
      p.r('#d8d4cc80', 12, 11, 2, 3); p.r('#d8d4cc60', 16, 9, 2, 3); p.r('#d8d4cc80', 20, 12, 2, 2);
      p.r('#f4efe0', 2, 26, 28, 6); p.text('SNAGS', 6, 27, '#c8443a');
    },
  },

  tank: {
    foot: [1, 1], tex: [16, 26], variants: ['corrugated'],
    paint(p) {
      p.shadow(8, 25, 15);
      p.r('#8e979b', 1, 4, 14, 21); for (let y = 6; y < 25; y += 2) p.r('#a7afb3', 1, y, 14, 1);
      p.r('#6c757a', 1, 2, 14, 3); p.r('#5d666b', 6, 1, 4, 2);
    },
  },

  reeds: {
    foot: [1, 1], tex: [16, 18], variants: ['a'], solid: false,
    paint(p) {
      for (let i = 0; i < 6; i++) {
        const x = 2 + i * 2 + (i % 2), h = 8 + (i * 5) % 7;
        p.r(i % 2 ? '#5a8a3a' : '#4a7a2a', x, 18 - h, 1, h);
        if (i % 2 === 0) p.r('#7a4a2a', x, 18 - h - 2, 1, 3);
      }
    },
  },

  crops: {
    foot: [1, 1], tex: [16, 16], variants: ['sprout', 'leafy', 'flower'], solid: false,
    paint(p, v) {
      [[4, 6], [11, 5], [7, 11], [12, 12]].forEach(([x, y], i) => {
        p.r('#3f8a3e', x, y, 1, 3);
        if (v !== 'sprout') { p.r('#57a84a', x - 2, y - 1, 2, 2); p.r('#57a84a', x + 1, y - 1, 2, 2); }
        if (v === 'flower' && i % 2 === 0) p.r('#f5e66b', x - 1, y - 3, 3, 2);
        if (v === 'sprout') p.r('#86ca5e', x - 1, y - 1, 3, 1);
      });
    },
  },

  tramstop: {
    foot: [1, 1], tex: [16, 32], variants: ['19'],
    paint(p) {
      p.shadow(8, 31, 8);
      p.r('#3c4148', 7, 8, 2, 24); p.r('#3a8a5a', 3, 1, 10, 11); p.r('#f5d63a', 3, 1, 10, 3);
      p.text('19', 5, 5, '#f4efe0');
    },
  },

  plane: {
    foot: [4, 2], tex: [64, 44], variants: ['trainer'],
    paint(p) {
      p.shadow(32, 43, 56, 0.2);
      p.r('#e8e4d8', 6, 22, 52, 9); p.r('#c9c3b5', 6, 29, 52, 2); p.r('#e8b730', 6, 25, 52, 2);
      p.r('#e8e4d8', 22, 8, 12, 34); p.r('#c9c3b5', 22, 8, 2, 34);
      p.r('#e8e4d8', 52, 16, 6, 20); p.r('#c8443a', 54, 14, 4, 8);
      p.r('#86b8d6', 12, 23, 8, 4); p.r('#3a3a3a', 3, 20, 3, 13); p.r('#5d616a', 1, 25, 3, 3);
      p.blob(27, 13, 3, '#2f5f8f'); p.r('#f4efe0', 26, 12, 2, 2); p.blob(27, 37, 3, '#2f5f8f'); p.r('#f4efe0', 26, 36, 2, 2);
    },
  },
};

// Which object kinds give off light at night.
export const LIGHT_SOURCES = { lamp: { x: 8, y: 6, r: 44 }, shelter: { x: 24, y: 18, r: 40 }, myki: { x: 8, y: 6, r: 16 } };
