// Small props that make places feel lived in: pot plants, garden beds,
// toys, bikes, aircon units. Most are walk-through (solid: false) so they
// can be sprinkled around houses without blocking anything. MapBuilder's
// dress() step places them in front gardens automatically (see finish()).
import { shade } from './painter.js';

function box(p, x, y, w, h, c) {
  p.r(c, x, y, w, h); p.r(shade(c, 0.2), x, y, w, 1); p.r(shade(c, -0.22), x, y + h - 1, w, 1); p.r(shade(c, -0.12), x + w - 1, y + 1, 1, h - 2);
}
const leaf = (p, x, y, c) => { p.r(c, x, y, 2, 1); p.r(shade(c, 0.25), x, y, 1, 1); };

export const PROPS = {
  potplant: {
    foot: [1, 1], tex: [16, 18], variants: ['succulent', 'fern', 'geranium', 'lavender', 'herbs'], solid: false,
    paint(p, v) {
      p.shadow(8, 17, 9);
      const pot = v === 'herbs' ? '#e8e4dc' : v === 'lavender' ? '#5a6a8a' : '#c8643a';
      box(p, 4, 11, 8, 6, pot); p.r(shade(pot, 0.15), 3, 10, 10, 2); p.r(shade(pot, -0.3), 4, 12, 8, 1);
      if (v === 'succulent') { p.blob(8, 8, 3, '#6aa88a'); p.blob(6, 9, 2, '#8ac8a8'); p.blob(10, 9, 2, '#5a9878'); p.r('#e8a0b8', 8, 5, 1, 1); }
      if (v === 'fern') for (let i = 0; i < 5; i++) { const dx = (i - 2) * 2; for (let j = 0; j < 6; j++) leaf(p, 7 + dx + Math.round(dx * j / 6), 9 - j, j % 2 ? '#3a8a3e' : '#4fa04a'); }
      if (v === 'geranium') { p.blob(8, 8, 4, '#3a7a3a'); for (const [x, y] of [[6, 6], [10, 6], [8, 4], [5, 9], [11, 9]]) { p.r('#e83a4a', x, y, 2, 2); p.r('#ff7a8a', x, y, 1, 1); } }
      if (v === 'lavender') for (let i = 0; i < 6; i++) { const x = 4 + i * 1.6; p.r('#5a8a4a', x, 6, 1, 5); p.r('#9a7ad8', x, 2 + (i % 2), 1, 4); }
      if (v === 'herbs') { p.blob(8, 8, 3, '#5aa84a'); p.r('#7ac85a', 6, 6, 2, 1); p.r('#7ac85a', 9, 5, 2, 1); p.r('#4a8a3a', 10, 8, 2, 2); }
    },
  },
  flowerbed: {
    foot: [2, 1], tex: [32, 16], variants: ['mixed', 'roses', 'natives'], flat: true,
    paint(p, v) {
      p.r('#6a4a2e', 1, 5, 30, 9); p.r('#7a5a3a', 1, 5, 30, 1); p.r('#5a3a22', 2, 12, 28, 2);   // mulch bed
      p.r('#9a9488', 0, 13, 32, 2); p.r('#b8b2a4', 0, 13, 32, 1);   // edging
      const cols = { mixed: ['#f28bb0', '#f5e66b', '#ffffff', '#b79cf0'], roses: ['#d8405a', '#f28bb0', '#e83a4a'], natives: ['#e8a030', '#c8443a', '#f5e66b'] }[v];
      for (let i = 0; i < 9; i++) {
        const x = 3 + i * 3 + (i % 2), y = 6 + (i % 3) * 2;
        p.r('#3f8a3e', x, y + 1, 2, 3); p.r('#5fb24f', x, y + 1, 1, 1);
        p.r(cols[i % cols.length], x, y, 2, 2);
      }
      if (v === 'natives') { p.r('#7a8a5a', 5, 3, 1, 4); p.r('#c8443a', 4, 2, 3, 2); p.r('#7a8a5a', 24, 3, 1, 4); p.r('#e8a030', 23, 2, 3, 2); }
    },
  },
  birdbath: {
    foot: [1, 1], tex: [16, 20], variants: ['stone'], solid: false,
    paint(p) {
      p.shadow(8, 19, 10);
      box(p, 6, 10, 4, 8, '#b8b4aa'); box(p, 4, 17, 8, 2, '#a8a49a');
      box(p, 1, 6, 14, 4, '#c8c4ba'); p.r('#7ab0d8', 3, 6, 10, 2); p.r('#b8e0f4', 4, 6, 3, 1);
      p.r('#3a3a40', 11, 3, 3, 3); p.r('#f4f4f0', 12, 4, 1, 1); p.r('#e8a030', 14, 4, 1, 1);   // a little wren
    },
  },
  gnome: {
    foot: [1, 1], tex: [16, 16], variants: ['red', 'blue'], solid: false,
    paint(p, v) {
      p.shadow(8, 15, 7);
      const hat = v === 'blue' ? '#3a6ad0' : '#c8443a';
      p.r('#3a6a3a', 5, 10, 6, 5); p.r('#5a8a5a', 5, 10, 2, 4);
      p.r('#f4f4f0', 5, 8, 6, 4); p.r('#f2c79a', 6, 6, 4, 3); p.r('#e88a7a', 7, 7, 2, 1);
      p.r(hat, 6, 2, 4, 4); p.r(hat, 7, 0, 2, 2); p.r(shade(hat, 0.3), 6, 2, 1, 3);
      p.r('#6a4226', 5, 15, 2, 1); p.r('#6a4226', 9, 15, 2, 1);
    },
  },
  bike: {
    foot: [1, 1], tex: [24, 16], variants: ['blue', 'red', 'kids'], solid: false,
    paint(p, v) {
      p.shadow(12, 15, 18);
      const c = { blue: '#2f6aa3', red: '#c8443a', kids: '#e77fb8' }[v], small = v === 'kids';
      const r = small ? 3 : 4, ax = small ? 7 : 6, bx = small ? 17 : 18, y = 11;
      for (const x of [ax, bx]) { p.blob(x, y, r, '#2a2a30'); p.ctx.save(); p.ctx.globalCompositeOperation = 'destination-out'; p.blob(x, y, r - 1, '#000'); p.ctx.restore(); p.r('#8a8a90', x, y, 1, 1); }
      p.r(c, ax, y - 1, bx - ax, 1); p.r(c, ax + 3, y - 5, 1, 5); p.r(c, ax + 3, y - 5, bx - ax - 4, 1); p.r(c, bx - 2, y - 6, 1, 6);
      p.r('#2a2a30', ax + 1, y - 7, 5, 2); p.r('#c8c8cc', bx - 4, y - 8, 5, 1);
      if (small) { p.r('#f4f4f0', ax + 2, y - 9, 2, 2); p.r('#e8c040', bx - 3, y - 10, 2, 1); }
    },
  },
  trike: {
    foot: [1, 1], tex: [16, 16], variants: ['red'], solid: false,
    paint(p) {
      p.shadow(8, 15, 12);
      p.blob(4, 12, 2, '#2a2a30'); p.blob(12, 12, 2, '#2a2a30'); p.blob(9, 13, 2, '#2a2a30');
      p.r('#c8443a', 4, 9, 9, 2); p.r('#e8705f', 4, 9, 9, 1); p.r('#c8443a', 11, 4, 2, 6); p.r('#f4f4f0', 9, 3, 6, 1); p.r('#3a6ad0', 4, 7, 4, 2);
    },
  },
  ball: {
    foot: [1, 1], tex: [16, 16], variants: ['soccer', 'beach'], solid: false,
    paint(p, v) {
      p.shadow(8, 15, 8);
      p.blob(8, 10, 4, '#f4f4f0');
      if (v === 'soccer') { p.r('#1e1e22', 7, 9, 2, 2); p.r('#1e1e22', 5, 11, 1, 1); p.r('#1e1e22', 10, 12, 1, 1); }
      else { p.r('#e83a4a', 5, 7, 3, 6); p.r('#3a8ad0', 9, 7, 3, 6); p.r('#f5d63a', 7, 6, 2, 2); }
      p.r('#ffffff', 6, 7, 1, 1);
    },
  },
  acunit: {
    foot: [1, 1], tex: [16, 16], variants: ['split'], solid: false,
    paint(p) {
      p.shadow(8, 15, 13);
      box(p, 1, 5, 14, 10, '#e8e8e4');
      p.blob(9, 10, 3, '#5a5e64'); p.r('#8a8e94', 7, 8, 4, 1); p.r('#8a8e94', 7, 10, 4, 1); p.r('#8a8e94', 7, 12, 4, 1);
      p.r('#c8c8c4', 2, 7, 3, 6); p.r('#a8a8a4', 3, 15, 2, 1); p.r('#a8a8a4', 12, 15, 2, 1);
    },
  },
  wheelbarrow: {
    foot: [1, 1], tex: [24, 16], variants: ['green'], solid: false,
    paint(p) {
      p.shadow(12, 15, 18);
      p.r('#3f8a3e', 4, 6, 14, 5); p.r('#5fb24f', 4, 6, 14, 1); p.r('#2f6a2e', 6, 11, 10, 1);
      p.r('#6a4a2e', 6, 5, 9, 2);   // a load of mulch
      p.r('#8a6a4a', 17, 8, 6, 1); p.r('#8a6a4a', 17, 10, 6, 1);
      p.blob(4, 13, 2, '#2a2a30'); p.r('#5a5a60', 13, 11, 1, 4);
    },
  },
  hosereel: {
    foot: [1, 1], tex: [16, 16], variants: ['green'], solid: false,
    paint(p) {
      p.shadow(8, 15, 10);
      p.r('#5a5e64', 4, 7, 1, 8); p.r('#5a5e64', 11, 7, 1, 8); p.blob(8, 9, 4, '#3a9a4a'); p.blob(8, 9, 2, '#2a6a3a'); p.r('#f4d040', 7, 8, 2, 2);
      p.r('#3a9a4a', 12, 12, 3, 1); p.r('#3a9a4a', 14, 13, 2, 2);
    },
  },
  trampoline: {
    foot: [3, 2], tex: [48, 36], variants: ['net'],
    paint(p) {
      p.shadow(24, 35, 44);
      const oval = (cy, rx, ry, c) => { for (let dy = -ry; dy <= ry; dy++) { const w = Math.round(rx * Math.sqrt(1 - (dy * dy) / (ry * ry))); p.r(c, 24 - w, cy + dy, w * 2, 1); } };
      for (const x of [7, 17, 30, 40]) { p.r('#5a5e64', x, 24, 2, 11); p.r('#8a8e94', x, 24, 1, 11); }   // legs
      oval(22, 21, 8, '#2f6aa3'); oval(22, 19, 7, '#5a9ad8');   // padded rim
      oval(22, 16, 5, '#2a2a30'); oval(21, 12, 3, '#3a3a44');   // the mat
      for (const x of [4, 43]) p.r('#8a8e94', x, 2, 1, 20);   // net poles
      p.r('rgba(230,240,250,0.35)', 4, 2, 40, 16); for (let y = 4; y < 18; y += 3) p.r('rgba(255,255,255,0.3)', 4, y, 40, 1);
      p.r('#8a8e94', 4, 2, 40, 1);
    },
  },
  meterbox: {
    foot: [1, 1], tex: [16, 16], variants: ['grey'], solid: false,
    paint(p) { box(p, 3, 4, 10, 10, '#b8bcc0'); p.r('#8a8e94', 5, 6, 6, 4); p.r('#f4d040', 6, 7, 2, 1); p.r('#5a5e64', 7, 14, 2, 2); },
  },
};
