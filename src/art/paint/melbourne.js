// Built-in art for the city and Carlton: the Royal Exhibition Building and
// the museum in Carlton Gardens, Lygon St's trattorias, cinema and gelateria,
// the State Library, Parliament, the GPO, Bourke St's department store and the
// Public Purse, Flinders Street Station, Fed Square, St Paul's, Queen Vic
// Market's sheds and stalls, office towers, and a few interior bits.
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
  // ---- Carlton Gardens
  // The Royal Exhibition Building: rendered wings with arched windows, a
  // portico, and the big grey dome with its lantern and flag.
  exhibition: {
    foot: [14, 3], tex: [228, 132], variants: ['carlton'],
    paint(p) {
      const W = 228, H = 132, wall = '#e8d8b4', trim = '#c8b088', roof = '#7a828c';
      p.shadow(114, H - 1, 220);
      // the wings
      p.r(roof, 2, 52, W - 4, 10); for (let x = 4; x < W - 4; x += 5) p.r(shade(roof, 0.15), x, 52, 2, 10);
      box(p, 2, 62, W - 4, H - 63, wall);
      p.r(trim, 2, 62, W - 4, 3); p.r(trim, 2, 84, W - 4, 2);
      for (let x = 8; x < W - 14; x += 14) { if (x > 92 && x < 128) continue; arch(p, x, 68, 8, 14); arch(p, x, 90, 8, H - 96); }
      // pavilions at each end
      for (const x of [2, W - 32]) { box(p, x, 46, 30, H - 47, shade(wall, 0.05)); p.r(trim, x, 46, 30, 3); p.r(roof, x + 2, 38, 26, 8); p.r(shade(roof, 0.2), x + 4, 38, 22, 1); arch(p, x + 11, 56, 8, 18); arch(p, x + 11, 84, 8, H - 90); }
      // the portico and entrance
      box(p, 88, 52, 52, H - 53, '#f0e4c4');
      p.r(trim, 86, 52, 56, 4);
      for (let i = 0; i < 10; i++) p.r(shade(trim, 0.1), 114 - i * 3, 42 + i, i * 6, 1);   // pediment
      columns(p, 92, 134, 60, H - 8, 9, '#f4ecd8');
      p.r('#3a2a1e', 107, H - 30, 14, 26); p.r('#5a4a3a', 108, H - 29, 12, 25); p.r('#e8c060', 108, H - 34, 12, 3);
      p.r('#d8ccb0', 84, H - 6, 60, 5); p.r('#c8bca0', 80, H - 3, 68, 3);  // steps
      // the drum and the dome
      box(p, 92, 30, 44, 14, wall); for (let x = 96; x < 132; x += 8) arch(p, x, 33, 4, 9);
      for (let j = 0; j < 22; j++) { const w = Math.round(Math.sqrt(1 - ((j - 22) / 22) ** 2) * 26); p.r(j % 4 ? '#8a98a4' : '#7a8894', 114 - w, 8 + j, w * 2, 1); }
      for (const dx of [-14, -6, 2, 10]) p.r('#a8b4be', 114 + dx, 12, 2, 18);
      p.r('#c8a040', 92, 29, 44, 2);
      box(p, 109, 2, 10, 8, '#e8d8b4'); p.r('#8a98a4', 108, 0, 12, 2);
      p.r('#5a5a60', 113, -2, 1, 4);
    },
  },
  // Melbourne Museum: a giant charcoal roof blade over a glass box.
  museum: {
    foot: [10, 3], tex: [164, 80], variants: ['carlton'],
    paint(p) {
      const W = 164, H = 80;
      p.shadow(82, H - 1, 156);
      box(p, 6, 30, W - 12, H - 31, '#c8d0d4');
      for (let x = 8; x < W - 8; x += 10) { p.r('#7a9aaa', x, 34, 8, H - 40); p.r('#a8c8d8', x + 1, 35, 2, 8); }
      p.r('#e8643a', 18, 38, 20, 10); p.r('#3a8ad0', 120, 44, 18, 10); p.r('#e8c040', 70, 36, 14, 6);   // coloured panels
      // the blade roof, sloping up to the right
      for (let i = 0; i < 18; i++) p.r(i < 2 ? '#5a5e66' : '#3a3e44', 0, 26 - Math.round(i * 0.4) - i, W, 2);
      for (let i = 0; i < 12; i++) p.r('#2a2e34', W - 30 + i * 2, 4 + i, 2, 24 - i);
      p.r('#4a4e56', 0, 26, W, 4); centred(p, 'MUSEUM', 82, 27, '#f4f4f0');
      p.r('#2a2e33', 70, H - 22, 24, 21); p.r('#a8c8d8', 72, H - 20, 9, 19); p.r('#a8c8d8', 83, H - 20, 9, 19);
    },
  },
  // The Hochgurtel fountain: a bluestone basin and tiers of cast iron.
  fountain: {
    foot: [3, 2], tex: [48, 52], variants: ['carlton'],
    paint(p) {
      p.shadow(24, 51, 46);
      p.r('#6a6e78', 2, 34, 44, 16); p.r('#8a8e98', 2, 34, 44, 2); p.r('#4a4e58', 2, 48, 44, 2);
      p.r('#5a9ac8', 5, 36, 38, 9); p.r('#8ac0e0', 8, 37, 12, 2); p.r('#8ac0e0', 28, 40, 8, 1);
      p.r('#7a6a5a', 20, 14, 8, 24); p.r('#9a8a7a', 21, 14, 2, 24);
      p.r('#7a6a5a', 12, 22, 24, 4); p.r('#9a8a7a', 12, 22, 24, 1);
      p.r('#7a6a5a', 16, 8, 16, 3); p.r('#9a8a7a', 16, 8, 16, 1); p.blob(24, 5, 3, '#7a6a5a');
      for (const [x, y] of [[13, 26], [34, 26], [17, 11], [30, 11]]) p.r('#a8d8f0', x, y, 1, 8);   // water falling
    },
  },

  // ---- Lygon St
  trattoria: {
    foot: [4, 3], tex: [64, 72], variants: ['pasta', 'nonna', 'pizza', 'espresso', 'cannoli'],
    paint(p, v) {
      const S = {
        pasta:    ['#e8d8b8', '#2a6a3a', 'PASTA LA VISTA', '#f4f0e6', '#c8302a'],
        nonna:    ['#c8a078', '#7a1a24', "NONNA'S RULES", '#f4e0b0', '#2a6a3a'],
        pizza:    ['#e8e0cc', '#c8302a', 'PIZZA MY HEART', '#f4f0e6', '#2a6a3a'],
        espresso: ['#3a2a24', '#1e1e24', 'GRIND & BEAR IT', '#e8c060', '#c8302a'],
        cannoli:  ['#f0c8c8', '#f4f0e6', 'CANNOLI CORNER', '#c8443a', '#3a9a6a'],
      }[v];
      const [wall, sign, name, nameCol, aw] = S;
      shopfront(p, 64, 72, wall, sign, sign, name, nameCol, aw, (p, x, y, w, h) => {
        // checked tablecloths and candles in Chianti bottles
        for (let i = 0; i < 2; i++) { const tx = x + 3 + i * 18; for (let k = 0; k < 12; k++) p.r(k % 2 ? '#f4f0e6' : '#c8302a', tx + k, y + h - 8, 1, 3); p.r('#3a6a2a', tx + 5, y + h - 13, 2, 5); p.r('#f4e060', tx + 5, y + h - 15, 2, 2); }
        p.r('#f8d898', x + 2, y + 2, w - 4, 1);
      });
      // chalkboard menu out the front
      p.r('#6a4a2a', 52, 60, 10, 12); p.r('#2a2e2a', 53, 61, 8, 8); p.r('#f4f4f0', 54, 62, 5, 1); p.r('#f4f4f0', 54, 64, 6, 1); p.r('#f4f4f0', 54, 66, 4, 1);
    },
  },
  // Lygon Pictures: an old picture palace with a marquee of bulbs.
  cinema: {
    foot: [6, 3], tex: [96, 84], variants: ['lygon'],
    paint(p) {
      const W = 96, H = 84;
      box(p, 2, 8, W - 4, H - 9, '#c8a8d8'); p.r('#b090c0', 2, 8, W - 4, 3);
      p.r('#e8d8f0', 30, 2, 36, 8); centred(p, 'PICTURES', 48, 4, '#6a3a8a');
      for (const x of [8, 76]) arch(p, x, 16, 12, 16, '#5a6a9a');
      // the marquee with bulbs
      p.r('#2a1e34', 6, 36, W - 12, 14); p.r('#f4f0e6', 8, 38, W - 16, 10);
      centred(p, 'LYGON', 48, 39, '#6a3a8a'); centred(p, 'NOW SHOWING', 48, 44, '#c8302a');
      for (let x = 7; x < W - 7; x += 4) { p.r('#f8e070', x, 35, 2, 1); p.r('#f8e070', x, 50, 2, 1); }
      // posters and the doors
      for (const [x, c] of [[8, '#3a8ad0'], [22, '#e8643a'], [62, '#3a9a5a'], [76, '#e8c040']]) { p.r('#1e1e24', x, 56, 12, 18); p.r(c, x + 1, 57, 10, 16); p.r('#f4f4f0', x + 3, 60, 6, 2); p.blob(x + 6, 67, 3, shade(c, -0.3)); }
      p.r('#2a1e34', 38, 54, 20, H - 55); p.r('#a8c4d4', 40, 56, 7, H - 58); p.r('#a8c4d4', 49, 56, 7, H - 58);
    },
  },
  // The gelateria: pastel, with a giant cone sign. Its door leads inside.
  gelateria: {
    foot: [4, 3], tex: [64, 76], variants: ['lygon'],
    paint(p) {
      shopfront(p, 64, 76, '#bfe4d4', '#f0a0b8', '#f0a0b8', 'GELATO', '#f4f4f0', '#f0a0b8', (p, x, y, w, h) => {
        for (let i = 0; i < 6; i++) { const c = ['#f4e0a0', '#f0a0b8', '#8ad0a0', '#6a3a24', '#f4f0e6', '#e8643a'][i]; p.r('#c8ccd0', x + 2 + i * 6, y + h - 7, 5, 6); p.blob(x + 4 + i * 6, y + h - 8, 2, c); }
      });
      // the cone sign on top
      for (let j = 0; j < 12; j++) p.r(j % 3 ? '#d8a050' : '#b8803a', 30 - Math.round((12 - j) / 3), 2 + j, Math.round((12 - j) / 1.5) + 2, 1);
      p.blob(32, 2, 4, '#f0a0b8'); p.r('#f8c8d8', 30, 0, 2, 1);
    },
  },
  // Cafe umbrellas on Lygon St's footpath tables.
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
  bocce: {
    foot: [7, 2], tex: [112, 32], variants: ['piazza'], flat: true, solid: false,
    paint(p) {
      p.r('#8a5a32', 0, 0, 112, 32); p.r('#d8c8a0', 2, 2, 108, 28);
      for (let i = 0; i < 60; i++) p.r('#c8b890', 2 + Math.floor(hash(i, 3) * 106), 2 + Math.floor(hash(i, 7) * 27), 1, 1);
      for (const [x, y, c] of [[30, 12, '#c8302a'], [36, 18, '#c8302a'], [70, 14, '#2a5aa8'], [78, 20, '#2a5aa8']]) { p.blob(x, y, 2, c); p.r('#ffffff', x - 1, y - 1, 1, 1); }
      p.blob(56, 16, 1, '#f4f0e6');
    },
  },

  // ---- The city
  // The State Library: a grey stone portico, columns and steps, the green
  // copper dome of the reading room behind.
  statelibrary: {
    foot: [14, 3], tex: [228, 128], variants: ['swanston'],
    paint(p) {
      const W = 228, H = 128, stone = '#c8c4b8';
      p.shadow(114, H - 1, 220);
      // the dome behind
      for (let j = 0; j < 26; j++) { const w = Math.round(Math.sqrt(1 - ((j - 26) / 26) ** 2) * 34); p.r(j % 5 ? '#6ab09a' : '#5a9a88', 114 - w, 6 + j, w * 2, 1); }
      for (const dx of [-20, -8, 4, 16]) p.r('#8ac8b4', 114 + dx, 10, 2, 22);
      box(p, 106, 0, 16, 7, '#c8c4b8');
      box(p, 74, 32, 80, 12, stone); for (let x = 78; x < 150; x += 8) arch(p, x, 34, 4, 8);
      // the wings
      box(p, 2, 50, W - 4, H - 51, stone);
      p.r(shade(stone, -0.15), 2, 50, W - 4, 4);
      for (let x = 8; x < W - 10; x += 12) { if (x > 70 && x < 154) continue; arch(p, x, 60, 7, 14); p.r('#3a3a40', x, 84, 7, 12); p.r('#5a7a9a', x + 1, 85, 5, 10); }
      // the portico: pediment, columns, entrance and the big steps
      p.r(shade(stone, 0.1), 72, 46, 84, 6);
      for (let i = 0; i < 12; i++) p.r(shade(stone, 0.05 - (i % 2) * 0.05), 114 - (12 - i) * 3.4, 34 + i, (12 - i) * 6.8, 1);
      centred(p, 'STATE LIBRARY', 114, 54, '#5a5a60');
      columns(p, 78, 148, 61, H - 14, 10, '#e0dccc');
      p.r('#2a2a30', 106, H - 36, 16, 22); p.r('#4a3a2a', 107, H - 35, 14, 21);
      for (let s = 0; s < 4; s++) p.r(shade(stone, 0.12 - s * 0.05), 70 - s * 4, H - 14 + s * 3, 88 + s * 8, 3);
    },
  },
  // Parliament House at the top of Bourke St: a wall of columns over steps.
  parliament: {
    foot: [14, 3], tex: [228, 112], variants: ['spring'],
    paint(p) {
      const W = 228, H = 112, stone = '#e0d4b8';
      p.shadow(114, H - 1, 222);
      box(p, 2, 18, W - 4, H - 19, stone);
      p.r(shade(stone, 0.1), 0, 14, W, 8); p.r(shade(stone, -0.1), 0, 22, W, 3);
      for (let x = 4; x < W - 4; x += 8) p.r(shade(stone, 0.15), x, 10, 4, 4);   // balustrade
      p.r('#3a3a40', 8, 30, W - 16, 52); p.r('#4a4a50', 9, 31, W - 18, 50);
      for (let x = 14; x < W - 14; x += 12) { arch(p, x, 36, 6, 14); arch(p, x, 58, 6, 16); }
      columns(p, 8, W - 12, 26, 84, 11, '#f0e8d4');
      for (let s = 0; s < 8; s++) p.r(shade(stone, 0.1 - (s % 2) * 0.08), 10 - s, 84 + s * 3, W - 20 + s * 2, 3);
      p.r('#c8302a', 108, 2, 12, 8); p.r('#1a2a6a', 108, 2, 6, 4); p.r('#5a5a60', 107, 0, 1, 14);
    },
  },
  // The GPO: stacked arches in cream stone, a little clock tower.
  gpo: {
    foot: [8, 3], tex: [132, 100], variants: ['bourke'],
    paint(p) {
      const W = 132, H = 100, stone = '#ece0c4';
      p.shadow(66, H - 1, 128);
      box(p, 2, 22, W - 4, H - 23, stone);
      p.r(shade(stone, -0.12), 2, 46, W - 4, 2); p.r(shade(stone, -0.12), 2, 68, W - 4, 2);
      for (let x = 6; x < W - 10; x += 12) { arch(p, x, 28, 8, 16); arch(p, x, 50, 8, 16); arch(p, x, 72, 9, H - 74, '#3a4a5a'); }
      box(p, 54, 2, 24, 22, stone); p.blob(66, 12, 6, '#f4f0e6'); p.blob(66, 12, 5, '#fffaf0'); p.r('#2a2a30', 66, 8, 1, 4); p.r('#2a2a30', 66, 12, 3, 1);
      p.r(shade(stone, -0.2), 52, 0, 28, 3);
      centred(p, 'G.P.O', 66, 26, '#6a5a3a');
    },
  },
  // The department store with its Christmas windows (all year round).
  deptstore: {
    foot: [10, 3], tex: [164, 100], variants: ['bourke'],
    paint(p) {
      const W = 164, H = 100;
      box(p, 2, 4, W - 4, H - 5, '#d8c8b0');
      for (let y = 10; y < 52; y += 14) for (let x = 8; x < W - 10; x += 12) { p.r('#3a3a40', x, y, 8, 10); p.r('#7a9ab0', x + 1, y + 1, 6, 8); }
      p.r('#7a1a24', 2, 54, W - 4, 10); centred(p, 'BOURKE & CO', W / 2, 57, '#e8c060');
      // the windows: a tree, a teddy, a train set, presents
      for (let i = 0; i < 4; i++) {
        const x = 6 + i * 40; if (i === 2) continue;
        p.r('#2a2a30', x, 66, 34, 28); p.r('#1a2a4a', x + 1, 67, 32, 26);
        for (let k = 0; k < 8; k++) p.r(['#c8302a', '#e8c040', '#3a9a5a', '#f4f0e6'][k % 4], x + 2 + k * 4, 68, 2, 1);
        if (i === 0) { for (let j = 0; j < 14; j++) p.r('#2a7a3a', x + 17 - Math.round(j / 2), 74 + j, j + 1, 1); p.r('#e8c040', x + 16, 72, 2, 2); }
        if (i === 1) { p.blob(x + 17, 80, 5, '#a8703a'); p.blob(x + 17, 74, 4, '#a8703a'); p.blob(x + 13, 71, 2, '#a8703a'); p.blob(x + 21, 71, 2, '#a8703a'); p.r('#c8302a', x + 14, 77, 6, 2); }
        if (i === 3) { for (const [px, c] of [[4, '#c8302a'], [13, '#3a8ad0'], [22, '#e8c040']]) { p.r(c, x + px, 82, 8, 8); p.r('#f4f0e6', x + px + 3, 82, 2, 8); } }
      }
      p.r('#2a2a30', 86, 66, 32, H - 67); p.r('#a8c4d4', 88, 68, 13, H - 70); p.r('#a8c4d4', 103, 68, 13, H - 70);
    },
  },
  // The Public Purse: the giant bronze handbag in the Bourke St Mall.
  purse: {
    foot: [2, 1], tex: [40, 30], variants: ['mall'],
    paint(p) {
      p.shadow(20, 29, 36);
      p.r(BRONZE, 4, 12, 32, 16); p.r(shade(BRONZE, 0.25), 4, 12, 32, 2); p.r(shade(BRONZE, -0.3), 4, 26, 32, 2);
      p.r(shade(BRONZE, -0.15), 6, 18, 28, 1);
      for (let i = 0; i < 9; i++) p.r(shade(BRONZE, 0.1), 12 + i * 2, 10 - Math.round(Math.sin(i / 8 * Math.PI) * 8), 2, 2);   // the handle
      p.r('#e8c870', 18, 14, 4, 3);
    },
  },
  // Flinders Street Station: mustard and red brick, the green dome, the
  // clocks over the entrance and the clock tower.
  flindersst: {
    foot: [18, 3], tex: [292, 128], variants: ['flinders'],
    paint(p) {
      const W = 292, H = 128, y1 = '#e8b04a', br = '#b0583a';
      p.shadow(146, H - 1, 286);
      box(p, 2, 46, W - 4, H - 47, y1);
      for (let y = 52; y < H - 6; y += 10) p.r(br, 2, y, W - 4, 2);
      for (let x = 10; x < W - 12; x += 16) { if (x > 110 && x < 180) continue; arch(p, x, 56, 8, 16, '#4a6a8a', br); p.r('#3a3a40', x, 82, 8, H - 86); }
      p.r(br, 2, 44, W - 4, 4);
      // the dome over the entrance
      box(p, 112, 34, 68, 14, y1); p.r(br, 112, 38, 68, 2);
      for (let j = 0; j < 30; j++) { const w = Math.round(Math.sqrt(1 - ((j - 30) / 30) ** 2) * 30); p.r(j % 5 ? '#5aa08a' : '#4a8a78', 146 - w, 4 + j, w * 2, 1); }
      for (const dx of [-16, -4, 8]) p.r('#7ac0aa', 146 + dx, 8, 2, 26);
      p.r('#e8b04a', 144, 0, 4, 5);
      // the big arched entrance and the row of clocks under it
      p.r(br, 116, 50, 60, H - 51); p.r('#2a2a30', 120, 66, 52, H - 67);
      for (let i = 0; i < 8; i++) { p.r('#f4f4f0', 122 + i * 6, 60, 5, 5); p.r('#2a2a30', 124 + i * 6, 61, 1, 2); }
      p.r(y1, 120, 54, 52, 4); centred(p, 'FLINDERS STREET', 146, 54, '#2a2a30');
      // the clock tower on the corner
      box(p, W - 28, 12, 24, H - 13, y1); for (let y = 18; y < H - 6; y += 10) p.r(br, W - 28, y, 24, 2);
      p.blob(W - 16, 26, 7, '#f4f4f0'); p.r('#2a2a30', W - 16, 21, 1, 5); p.r('#2a2a30', W - 16, 26, 4, 1);
      p.r('#5aa08a', W - 30, 4, 28, 8); p.r('#7ac0aa', W - 28, 4, 24, 2);
    },
  },
  // Federation Square: shards of sandstone, zinc and glass.
  fedsquare: {
    foot: [8, 3], tex: [132, 88], variants: ['fed'],
    paint(p) {
      const W = 132, H = 88;
      p.shadow(66, H - 1, 128);
      box(p, 2, 14, W - 4, H - 15, '#c8a878');
      for (let y = 16; y < H - 4; y += 6) for (let x = 2 + ((y / 6) % 2) * 3; x < W - 4; x += 7) {
        const k = hash(x, y);
        const c = k < 0.4 ? '#d8b888' : k < 0.65 ? '#a8a8a8' : k < 0.85 ? '#7a9aaa' : '#b89868';
        for (let j = 0; j < 6; j++) p.r(c, x + Math.round(j / 2), y + j, 6 - Math.round(j / 2), 1);
      }
      p.r('#3a3e44', 2, 10, 60, 6); for (let i = 0; i < 8; i++) p.r('#5a5e66', 62 + i * 4, 10 - i, 4, 6 + i);
      p.r('#2a2e33', 52, H - 26, 28, 25); p.r('#a8c8d8', 54, H - 24, 24, 23);
    },
  },
  // St Paul's Cathedral: sandstone gothic with a tall spire.
  stpauls: {
    foot: [6, 3], tex: [100, 156], variants: ['cathedral'],
    paint(p) {
      const W = 100, H = 156, stone = '#b8a07a';
      p.shadow(50, H - 1, 96);
      box(p, 4, 80, W - 8, H - 81, stone);
      for (let y = 84; y < H - 4; y += 6) p.r(shade(stone, -0.08), 4, y, W - 8, 1);
      for (let i = 0; i < 16; i++) p.r(shade(stone, -0.25), 50 - (16 - i) * 2.8, 64 + i, (16 - i) * 5.6, 1);
      // the spire
      box(p, 38, 40, 24, 42, stone);
      for (let j = 0; j < 40; j++) p.r(j % 6 ? '#5a5a60' : '#6a6a70', 50 - Math.round(j / 3.6), 2 + j, Math.round(j / 1.8) + 1, 1);
      p.r('#e8c060', 49, 0, 2, 3);
      arch(p, 45, 50, 10, 18, '#c8443a');
      // the rose window and doors
      p.blob(50, 92, 8, '#4a3a5a'); p.blob(50, 92, 6, '#c8443a'); p.blob(50, 92, 3, '#3a8ad0'); p.r('#e8c040', 49, 86, 2, 12); p.r('#e8c040', 44, 91, 12, 2);
      for (const x of [14, 76]) arch(p, x, 92, 10, 24, '#5a4a7a');
      p.r('#3a2a1e', 42, H - 28, 16, 27); p.r('#4a3a2a', 43, H - 27, 6, 26); p.r('#4a3a2a', 51, H - 27, 6, 26);
      for (const x of [4, W - 10]) for (let j = 0; j < 10; j++) p.r(stone, x + 3 - Math.round(j / 4), 70 + j, Math.round(j / 2) + 1, 1);
    },
  },
  // Office towers along the edge of the grid.
  citytower: {
    foot: [5, 3], tex: [80, 196], variants: ['glass', 'brown', 'blue', 'stripe'],
    paint(p, v) {
      const W = 80, H = 196;
      const [wall, glass, lit] = { glass: ['#5a7a8a', '#8ab0c8', '#c8e0f0'], brown: ['#8a6a4a', '#3a3a40', '#f4d070'], blue: ['#2a4a7a', '#5a8ac8', '#a8c8f0'], stripe: ['#e8e4dc', '#4a5a6a', '#f4d070'] }[v];
      p.shadow(40, H - 1, 78);
      box(p, 4, 8, W - 8, H - 9, wall);
      for (let y = 14; y < H - 18; y += (v === 'stripe' ? 8 : 6)) {
        if (v === 'stripe') p.r(glass, 6, y, W - 12, 4);
        else for (let x = 8; x < W - 10; x += 6) p.r(hash(x, y) > 0.92 ? lit : glass, x, y, 4, 4);
      }
      if (v === 'glass') for (let y = 14; y < H - 20; y += 3) p.r('rgba(255,255,255,0.18)', 8 + ((y * 3) % 30), y, 6, 1);
      p.r(shade(wall, -0.2), 4, H - 18, W - 8, 17); p.r('#2a2e33', 30, H - 16, 20, 15); p.r('#a8c4d4', 32, H - 14, 16, 13);
      p.r(shade(wall, 0.15), 8, 2, W - 16, 6); p.r('#c8302a', 38, 0, 3, 2);   // rooftop and its little red light
    },
  },
  // Giant chess on the State Library forecourt: flat paving squares...
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
  marketshed: {
    foot: [12, 3], tex: [192, 60], variants: ['qvm'], solid: false, roof: true, lined: true,
    paint(p) {
      p.r('#9aa2aa', 0, 0, 192, 38); for (let x = 2; x < 192; x += 4) p.r('#8a929a', x, 0, 1, 38);
      p.r('#b8c0c8', 0, 0, 192, 3); p.r('#6a7280', 0, 36, 192, 3);
      p.r('#2a5a3a', 0, 39, 192, 6); for (let x = 4; x < 192; x += 8) p.r('#3a7a4a', x, 40, 4, 4);   // green valance
      for (let x = 2; x < 192; x += 30) { p.r('#2a5a3a', x, 45, 3, 15); p.r('#3a7a4a', x, 45, 1, 15); }
      centred(p, 'VICTORIA MARKET', 96, 15, '#f4f0e6');
    },
  },
  // Market stalls: trestles of produce, cheese, flowers and socks.
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
