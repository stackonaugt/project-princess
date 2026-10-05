// Smaller built-in art for the city and Carlton: footpath umbrellas, giant
// chess, the laneway coffee cart, the souvenir kiosk, market stalls and the
// hot jam donut van, Hosier Lane's walls, a few interior bits and 47-49
// Nicholson St. The big landmarks are in cbd.js.
// Same format as objects.js. Outlines are added automatically.
import { shade, textWidth } from './painter.js';
import { hash } from '../../util.js';

function box(p, x, y, w, h, c) {
  p.r(c, x, y, w, h); p.r(shade(c, 0.18), x, y, w, 1); p.r(shade(c, -0.22), x, y + h - 1, w, 1); p.r(shade(c, -0.1), x + w - 1, y + 1, 1, h - 2);
}
const centred = (p, s, cx, y, c) => p.text(s, Math.round(cx - textWidth(s) / 2), y, c);
function big(p, s, x, y, scale, c) { p.ctx.save(); p.ctx.translate(x, y); p.ctx.scale(scale, scale); p.text(s, 0, 0, c); p.ctx.restore(); }
// An arched window: dark frame, glass, a glint and a round top.
function arch(p, x, y, w, h, glass = '#5a7a9a', frame = '#4a4038') {
  p.r(frame, x, y + 2, w, h - 2); p.r(frame, x + 1, y, w - 2, 2);
  p.r(glass, x + 1, y + 2, w - 2, h - 3); p.r(glass, x + 2, y + 1, w - 4, 1);
  p.r(shade(glass, 0.35), x + 1, y + 2, 1, 3);
}
// A row of classical columns from y0 to y1.
function columns(p, x0, x1, y0, y1, step, c = '#e8e0cc') {
  for (let x = x0; x <= x1; x += step) { p.r(c, x, y0, 4, y1 - y0); p.r(shade(c, 0.2), x, y0, 1, y1 - y0); p.r(shade(c, -0.2), x + 3, y0, 1, y1 - y0); p.r(shade(c, -0.1), x - 1, y0, 6, 2); p.r(shade(c, -0.1), x - 1, y1 - 2, 6, 2); }
}
// A striped shop awning across a shopfront.
function awning(p, x, y, w, c1, c2 = '#f4f0e6') {
  for (let i = 0; i < w; i += 6) p.r(i % 12 ? c2 : c1, x + i, y, Math.min(6, w - i), 6);
  for (let i = 0; i < w; i += 6) p.r(i % 12 ? shade(c2, -0.15) : shade(c1, -0.2), x + i + 1, y + 6, 4, 2);
  p.r(shade(c1, -0.3), x, y, w, 1);
}
// A heritage shopfront with an awning, a name and a window display.
function shopfront(p, W, H, wall, sign, signCol, name, nameCol, aw, window) {
  const top = 14;
  p.r(wall, 0, top, W, H - top); p.r(shade(wall, 0.15), 0, top, W, 1); p.r(shade(wall, -0.18), W - 2, top, 2, H - top);
  p.r(shade(wall, -0.1), 0, top - 4, W, 4); p.r(shade(wall, 0.1), 2, top - 6, W - 4, 2);
  for (const x of [6, W - 22]) arch(p, x, top + 4, 16, 14);
  p.r(sign, 2, top + 21, W - 4, 9); centred(p, name, W / 2, top + 23, nameCol);
  awning(p, 1, top + 30, W - 2, aw);
  p.r('#2a2e33', 4, top + 38, W - 22, H - top - 39); p.r('#3a3028', 5, top + 39, W - 24, H - top - 41);
  window(p, 5, top + 39, W - 24, H - top - 41);
  p.r('#2a2e33', W - 16, top + 38, 12, H - top - 38); p.r(shade(signCol, -0.3), W - 15, top + 39, 10, H - top - 39); p.r('#a8c4d4', W - 13, top + 41, 6, 7);
}

// Scrawled tags over a wall: squiggles in a few colours.
function scrawl(p, x, y, w, h, seed, cols = ['#1e1e24', '#e77fb8', '#3fa38f', '#f5d63a', '#f4f4f0', '#7fa6e8']) {
  for (let i = 0; i < Math.floor(w * h / 70); i++) {
    const c = cols[Math.floor(hash(i, seed) * cols.length)], tx = x + 1 + Math.floor(hash(seed, i) * (w - 10)), ty = y + 1 + Math.floor(hash(i + 3, seed) * (h - 7));
    for (let k = 0; k < 8; k++) p.r(c, tx + k, ty + Math.round(Math.sin(k * 1.3 + i) * 2) + 2, 1, 2);
    if (i % 2) p.r(c, tx, ty + 5, 8, 1);
  }
}

const BRONZE = '#a8783a';

export const MELBOURNE = {
  // ---- Lygon St (the shops themselves are carltonshop in cbd.js)
  parasol: {
    foot: [1, 1], tex: [32, 36], variants: ['red', 'green', 'cream'],
    paint(p, v) {
      const c = { red: '#c8302a', green: '#2a7a4a', cream: '#f0e8d0' }[v];
      p.shadow(16, 35, 24);
      p.r('#8a8e96', 15, 8, 2, 26);
      for (let j = 0; j < 7; j++) p.r(j < 6 ? c : shade(c, -0.2), 16 - (6 + j * 2), 2 + j, (6 + j * 2) * 2, 1);
      for (let i = -12; i <= 12; i += 8) p.r(shade(c, 0.3), 16 + i, 8, 2, 1);
      p.r('#f4f0e6', 8, 24, 16, 3); p.r('#c8302a', 8, 24, 16, 1);
      p.r('#3a3a40', 11, 27, 2, 8); p.r('#3a3a40', 19, 27, 2, 8);
      p.r('#3a3a40', 2, 27, 5, 7); p.r('#3a3a40', 25, 27, 5, 7);
    },
  },
  // A bocce court with timber edging and a few balls mid-game.
  // ---- The city (the big landmarks are in cbd.js)
  chessboard: {
    foot: [4, 4], tex: [64, 64], variants: ['library'], flat: true, solid: false,
    paint(p) {
      for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) p.r((i + j) % 2 ? '#3a3a40' : '#e8e4d8', i * 8, j * 8, 8, 8);
      p.r('#8a8a90', 0, 0, 64, 1); p.r('#8a8a90', 0, 63, 64, 1); p.r('#8a8a90', 0, 0, 1, 64); p.r('#8a8a90', 63, 0, 1, 64);
    },
  },
  // ...and the knee-high pieces.
  chesspiece: {
    foot: [1, 1], tex: [16, 24], variants: ['king', 'pawn', 'knight'],
    paint(p, v) {
      const c = v === 'pawn' ? '#f4f0e6' : '#2a2a30', hi = shade(c, v === 'pawn' ? -0.1 : 0.3);
      p.shadow(8, 23, 12);
      p.r(c, 3, 19, 10, 4); p.r(c, 5, 12, 6, 7); p.r(hi, 5, 12, 1, 7);
      if (v === 'pawn') p.blob(8, 9, 3, c);
      if (v === 'king') { p.r(c, 4, 6, 8, 6); p.r(c, 7, 1, 2, 5); p.r(c, 5, 2, 6, 2); }
      if (v === 'knight') { p.r(c, 4, 5, 7, 7); p.r(c, 9, 7, 4, 3); p.r(c, 5, 3, 3, 2); p.r(hi, 7, 7, 1, 1); }
    },
  },
  // A laneway coffee cart.
  espressocart: {
    foot: [2, 1], tex: [36, 36], variants: ['laneway'],
    paint(p) {
      p.shadow(18, 35, 34);
      box(p, 2, 14, 32, 16, '#2a5a4a'); p.r('#f4f0e6', 4, 18, 28, 6); p.text('COFFEE', 7, 19, '#2a5a4a');
      p.r('#c8ccd0', 6, 8, 14, 6); p.r('#e8ecf0', 7, 9, 4, 4); p.r('#3a3a40', 20, 8, 4, 6);   // the machine
      for (let i = 0; i < 3; i++) p.r('#f4f4f0', 25 + i * 3, 10, 2, 4);
      p.blob(8, 32, 2, '#2a2a30'); p.blob(28, 32, 2, '#2a2a30');
      p.r('#c8a070', 2, 2, 32, 3); p.r('#5a5a60', 3, 5, 1, 9); p.r('#5a5a60', 32, 5, 1, 9);
    },
  },
  // A souvenir kiosk: koalas, snow globes, boomerangs and tram magnets.
  souvenir: {
    foot: [3, 1], tex: [48, 44], variants: ['bourke'],
    paint(p) {
      p.shadow(24, 43, 46);
      box(p, 2, 22, 44, 20, '#3a6aa8'); p.r('#2a5a98', 2, 36, 44, 6);
      p.r('#e8c040', 0, 4, 48, 8); centred(p, 'MELBOURNE', 24, 6, '#2a2a30');
      p.r('#5a5a60', 3, 12, 2, 10); p.r('#5a5a60', 43, 12, 2, 10);
      for (let i = 0; i < 5; i++) { p.blob(8 + i * 8, 18, 3, '#9a9aa2'); p.r('#2a2a30', 7 + i * 8, 18, 1, 1); p.r('#2a2a30', 9 + i * 8, 18, 1, 1); }   // koalas
      p.blob(12, 28, 3, '#c8e0f0'); p.r('#3a9a5a', 11, 29, 2, 2); p.blob(24, 28, 3, '#c8e0f0'); p.r('#c8302a', 23, 29, 2, 2);
      p.r('#a8703a', 32, 26, 8, 2); p.r('#a8703a', 32, 26, 2, 6);   // a boomerang
    },
  },
  // Queen Vic Market: a long shed roof on cast iron posts (walk under it).
  marketstall: {
    foot: [2, 1], tex: [32, 30], variants: ['fruit', 'veg', 'deli', 'flowers', 'socks'],
    paint(p, v) {
      p.shadow(16, 29, 30);
      p.r('#8a6a42', 2, 18, 28, 3); p.r('#6a4a2a', 4, 21, 2, 8); p.r('#6a4a2a', 26, 21, 2, 8);
      p.r('#f4f0e6', 2, 21, 28, 4); p.r('#c8302a', 2, 21, 28, 1);
      const items = { fruit: ['#e8643a', '#e8c040', '#c8302a', '#7ac040'], veg: ['#3a8a3a', '#e8823a', '#8a3a6a', '#c8b060'], deli: ['#e8c870', '#c86a5a', '#f4e8c0', '#8a4a2a'], flowers: ['#f07ab0', '#e8c040', '#f4f4f0', '#8a6ad0'], socks: ['#3a8ad0', '#c8302a', '#3a9a5a', '#e8c040'] }[v];
      for (let i = 0; i < 4; i++) {
        p.r('#a8804a', 3 + i * 7, 13, 6, 5);
        if (v === 'flowers') for (let k = 0; k < 3; k++) { p.r('#3a7a3a', 4 + i * 7 + k * 2, 8, 1, 6); p.r(items[(i + k) % 4], 3 + i * 7 + k * 2, 6, 3, 3); }
        else if (v === 'socks') { p.r(items[i], 4 + i * 7, 4, 3, 9); p.r(items[i], 4 + i * 7, 11, 5, 2); }
        else for (let k = 0; k < 3; k++) p.blob(5 + i * 7 + (k % 2) * 2, 12 - Math.floor(k / 2) * 2, 2, items[i]);
      }
      p.r('#f4f0e6', 12, 15, 8, 4); p.text('$2', 13, 15, '#c8302a');
    },
  },
  // The hot jam donut van.
  donutvan: {
    foot: [4, 2], tex: [64, 52], variants: ['qvm'],
    paint(p) {
      p.shadow(32, 51, 62);
      box(p, 2, 8, 60, 36, '#f4f0e6'); p.r('#c8302a', 2, 8, 60, 8); p.r('#c8302a', 2, 36, 60, 8);
      centred(p, 'HOT JAM DONUTS', 32, 10, '#f4f0e6');
      p.r('#2a2a30', 8, 18, 40, 16); p.r('#e8d8b0', 9, 19, 38, 14);
      for (let i = 0; i < 5; i++) { p.blob(14 + i * 7, 27, 3, '#d8a050'); p.r('#f4f0e6', 13 + i * 7, 25, 2, 1); }
      p.r('#a8b0b8', 2, 2, 60, 6); p.r('#c8d0d8', 4, 2, 56, 2);
      p.blob(12, 46, 4, '#1e1e22'); p.blob(52, 46, 4, '#1e1e22'); p.r('#8a8e96', 11, 45, 2, 2); p.r('#8a8e96', 51, 45, 2, 2);
      p.r('#f8f0b0', 54, 38, 6, 3);
    },
  },

  // Hosier Lane walls: brick, painted top to bottom.
  laneart: {
    foot: [4, 1], tex: [64, 52], variants: ['melb', 'tram', 'koala'],
    paint(p, v) {
      p.r('#9a4a3a', 0, 4, 64, 48); for (let y = 6; y < 52; y += 4) { p.r('#7a3a2e', 0, y, 64, 1); for (let x = (y / 4) % 2 * 4; x < 64; x += 8) p.r('#7a3a2e', x, y - 3, 1, 3); }
      p.r('#6a6a70', 0, 0, 64, 4); p.r('#8a8a90', 0, 0, 64, 1);
      for (let i = 0; i < 14; i++) p.r(['#f07ab0', '#3ab0b0', '#e8c040', '#f4f4f0'][i % 4], Math.floor(hash(i, 9) * 60), 40 + Math.floor(hash(i, 4) * 10), 3, 1);   // drips and tags
      if (v === 'melb') {
        p.r('#2a8ad0', 2, 10, 60, 26); p.r('#3aa0e8', 2, 10, 60, 3);
        big(p, 'MELB', 6, 16, 3, '#1e1e24'); big(p, 'MELB', 4, 14, 3, '#f4d040');
        p.blob(56, 14, 3, '#f07ab0'); p.blob(8, 34, 2, '#e8643a');
      }
      if (v === 'tram') {
        p.r('#f4f0e6', 4, 12, 56, 26); p.r('#3a9a5a', 6, 22, 52, 12); p.r('#e8c040', 6, 20, 52, 2);
        for (let x = 10; x < 54; x += 10) p.r('#5a7a9a', x, 24, 6, 6);
        p.r('#1e1e24', 30, 10, 1, 4); p.r('#1e1e24', 24, 9, 14, 1); p.blob(14, 36, 2, '#1e1e24'); p.blob(48, 36, 2, '#1e1e24');
        p.text('86', 8, 14, '#c8302a');
      }
      if (v === 'koala') {
        p.r('#f07ab0', 2, 8, 60, 32);
        p.blob(32, 25, 12, '#9a9aa2'); p.blob(20, 15, 6, '#9a9aa2'); p.blob(44, 15, 6, '#9a9aa2'); p.blob(20, 15, 3, '#f4f0e6'); p.blob(44, 15, 3, '#f4f0e6');
        p.r('#1e1e24', 29, 24, 6, 8); p.r('#1e1e24', 26, 21, 2, 2); p.r('#1e1e24', 36, 21, 2, 2); p.r('#f4d040', 4, 34, 10, 4);
      }
    },
  },
  // ---- Inside
  gelatocase: {
    foot: [3, 1], tex: [48, 30], variants: ['tubs'],
    paint(p) {
      box(p, 0, 10, 48, 20, '#e8ecf0'); p.r('#c8ccd0', 0, 24, 48, 6);
      p.r('#a8c8d8', 2, 2, 44, 10); p.r('#d8ecf4', 3, 3, 10, 2);
      const flav = ['#f4e0a0', '#f0a0b8', '#8ad0a0', '#6a3a24', '#f4f0e6', '#e8643a', '#c8302a', '#8a6ad0'];
      for (let i = 0; i < 8; i++) { p.r('#c8ccd0', 2 + i * 5.5, 12, 5, 6); p.r(flav[i], 3 + i * 5.5, 11, 3, 3); p.r(shade(flav[i], 0.3), 3 + i * 5.5, 11, 2, 1); }
    },
  },
  readingdesk: {
    foot: [3, 1], tex: [48, 30], variants: ['lamps'],
    paint(p) {
      box(p, 0, 14, 48, 8, '#8a5a32'); p.r('#a8703a', 0, 14, 48, 2);
      p.r('#6a4226', 3, 22, 3, 8); p.r('#6a4226', 42, 22, 3, 8);
      for (const x of [8, 32]) { p.r('#c8a040', x + 3, 6, 1, 8); p.r('#2a7a4a', x, 3, 8, 4); p.r('#5ab07a', x + 1, 3, 6, 1); p.r('#f8f0b0', x + 1, 7, 6, 1); }
      p.r('#f4f0e6', 18, 11, 10, 3); p.r('#c8302a', 18, 11, 10, 1);   // an open book
    },
  },
  // ---- Nicholson St
  // 47-49 Nicholson St, on the Murchison St corner (from the owner's photos):
  // a little iron lace terrace with a terracotta roof, then the painted red
  // brick upper storey, then the grey rendered parapet with its gable and dark
  // bay window. Graffiti all along the ground floor, a white awning on the corner.
  nicholson: {
    foot: [10, 3], tex: [164, 100], variants: ['corner'],
    paint(p) {
      const H = 100, base = 62;
      p.shadow(82, H - 1, 160);
      // the terrace (x0-46): hipped terracotta roof, cream wall, verandah with iron lace
      for (let j = 0; j < 16; j++) p.r(j % 3 ? '#b8603a' : '#a04e2e', 17 - j, 36 + j, 14 + j * 2, 1);
      p.r('#c8744a', 17, 36, 14, 1);
      p.r('#6e5a4a', 34, 28, 6, 9); p.r('#4e3e32', 33, 27, 8, 2);
      box(p, 2, 52, 44, H - 53, '#d8d0bc');
      p.r('#3d2a1a', 8, 68, 10, H - 70); p.r('#3a5a8a', 9, 69, 8, H - 71); p.r('#9fd0ea', 10, 66, 6, 2);
      p.r('#f2efe6', 26, 66, 14, 16); p.r('#5a7a9a', 27, 67, 12, 14); p.r('#f2efe6', 32, 67, 1, 14); p.r('#a8c8dc', 28, 68, 3, 2);
      p.r('#8a8e96', 0, 56, 48, 3); p.r('#a8acb4', 0, 56, 48, 1);                 // verandah roof
      for (let x = 1; x < 47; x += 3) { p.r('#2a2a30', x, 59, 1, 4); p.r('#2a2a30', x, 59, 3, 1); p.r('#2a2a30', x + 1, 61, 1, 1); }
      p.r('#2a2a30', 1, 59, 1, H - 61); p.r('#2a2a30', 45, 59, 1, H - 61);
      for (let x = 2; x < 45; x += 2) p.r('#2a2a30', x, H - 10, 1, 7);            // the lace fence
      p.r('#2a2a30', 2, H - 11, 43, 1);
      // the middle building (x48-104): painted red brick upstairs, graffiti down
      box(p, 48, 18, 56, base - 18, '#b0442e');
      for (let y = 22; y < base; y += 4) p.r('#963828', 49, y, 54, 1);
      p.r('#c4583e', 48, 14, 56, 5); p.r('#8a3424', 48, 19, 56, 1);              // a plain parapet
      p.r('#f2efe6', 70, 30, 12, 14); p.r('#3a4a5a', 71, 31, 10, 12); p.r('#7a9ab0', 72, 32, 3, 3);
      box(p, 48, base, 56, H - base - 1, '#8a8a88');
      scrawl(p, 48, base + 2, 56, H - base - 6, 7);
      p.r('#2a2e33', 58, base + 8, 14, H - base - 9); p.r('#4a4038', 59, base + 9, 12, H - base - 10);   // a roller door
      for (let y = base + 11; y < H - 2; y += 3) p.r('#3a3028', 59, y, 12, 1);
      scrawl(p, 58, base + 10, 14, 18, 11, ['#e77fb8', '#f5d63a', '#f4f4f0']);
      // the corner building (x104-164): grey render, a gable on top, a dark bay window
      box(p, 104, 14, 60, base - 14, '#9a9c9e');
      for (let j = 0; j < 12; j++) p.r('#9a9c9e', 134 - j * 2 - 6, 2 + j, j * 4 + 12, 1);     // the gable
      p.r('#b4b6b8', 128, 2, 12, 1); p.r('#7a7c7e', 104, 14, 60, 2);
      p.r('#f2efe6', 131, 6, 6, 5); p.r('#5a6a7a', 132, 7, 4, 4);                // a little oculus
      box(p, 118, 22, 32, 24, '#2a2e33');                                          // the bay window
      for (const x of [120, 130, 140]) { p.r('#3a4a5a', x, 24, 8, 18); p.r('#5a7a9a', x + 1, 25, 2, 4); }
      p.r('#4a4e54', 116, 46, 36, 3);
      p.r('#f4f4f0', 108, 32, 6, 3); p.text('47', 107, 31, '#3a3a3e');
      box(p, 104, base, 60, H - base - 1, '#26262a');
      scrawl(p, 104, base + 4, 60, H - base - 8, 13);
      p.r('#2a2e33', 140, base + 8, 14, H - base - 9); p.r('#4a5a6a', 141, base + 9, 12, H - base - 10); p.r('#f0c040', 151, base + 22, 1, 2);
      // the white cantilevered awning on the corner
      p.r('#f4f4f0', 100, base - 4, 64, 4); p.r('#d8d8d4', 100, base, 64, 2); p.r('#b8b8b4', 100, base + 2, 64, 1);
      p.r('#3a3a3e', 104, base + 3, 60, 1);
    },
  },
};
