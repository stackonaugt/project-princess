// Built-in art for three shops the owner asked for by name:
//   Brunswick Bound (Sydney Rd): a cream Victorian two-storey with a balustrade
//     parapet and tags upstairs, a black fascia, a window of books and a warm
//     "Books" sign. Inside: tall bookcases, display tables, a bird mural.
//   Anaconda (Plenty Rd, Preston): grey cladding, an orange portico, the
//     HIKE BIKE CAMP FISH KAYAK band and PLAY MORE PAY LESS posters.
//   Franco Cozzo (Barkly St, Footscray): the white building with the big black
//     FRANCO COZZO letters, an Italian flag at one end, an Australian flag on
//     the corner, and showroom windows full of furniture.
// Same format as objects.js.
import { shade, outline, textWidth } from './painter.js';
import { hash } from '../../util.js';

function box(p, x, y, w, h, c) {
  p.r(c, x, y, w, h); p.r(shade(c, 0.18), x, y, w, 1); p.r(shade(c, -0.22), x, y + h - 1, w, 1);
}
const centred = (p, s, cx, y, c) => p.text(s, Math.round(cx - textWidth(s) / 2), y, c);
function big(p, s, x, y, scale, c) { p.ctx.save(); p.ctx.translate(x, y); p.ctx.scale(scale, scale); p.text(s, 0, 0, c); p.ctx.restore(); }
const SPINES = ['#c8443a', '#2f6aa3', '#e8c040', '#3a8a4a', '#f07ab0', '#6a3ab0', '#e8823a', '#f4efe0', '#1e1e24', '#3ab0b0'];

export const SHOPS2 = {
  bbound: {
    foot: [4, 3], tex: [64, 76], variants: ['books'],
    paint(p) {
      const x0 = 1, W = 62, H = 76, top = 10;
      // balustrade parapet with an urn
      p.r('#e4dcc4', x0, top - 4, W, 4); for (let x = 2; x < W; x += 3) p.r('#cfc6ac', x0 + x, top - 3, 1, 3);
      p.r('#e4dcc4', x0 + 28, top - 9, 6, 5); p.r('#f0e8d4', x0 + 27, top - 10, 8, 2);
      // cream upper storey, tagged, two tall windows
      p.r('#e8e0c8', x0, top, W, 28); p.r('#d4cab0', x0 + W - 2, top, 2, 28);
      for (const x of [8, 38]) { p.r('#4a4038', x0 + x - 1, top + 5, 18, 20); p.r('#5a7a9a', x0 + x, top + 6, 16, 18); p.r('#8aa4b8', x0 + x + 1, top + 7, 3, 3); p.r('#e8e0c8', x0 + x + 7, top + 6, 1, 18); }
      for (let i = 0; i < 3; i++) { const tx = x0 + 26 + i * 4; for (let k = 0; k < 6; k++) p.r('#6a6a72', tx + k % 3, top + 8 + i * 5 + Math.round(Math.sin(k + i) * 2), 1, 1); }
      // black fascia with the logo box and the name
      p.r('#141416', x0, top + 28, W, 12); p.r('#f4efe0', x0 + 2, top + 29, 9, 10); p.blob(x0 + 6, top + 34, 3, '#2a2a2a'); p.r('#f4efe0', x0 + 5, top + 33, 1, 1); p.r('#f4efe0', x0 + 7, top + 33, 1, 1);
      p.text('BRUNSWICK', x0 + 14, top + 29, '#f4efe0'); p.text('BOUND', x0 + 14, top + 35, '#f4efe0');
      // the shop window: shelves of colourful covers and a warm BOOKS sign
      p.r('#2a2e33', x0 + 3, top + 42, 38, H - top - 44); p.r('#3a3028', x0 + 4, top + 43, 36, H - top - 46);
      for (let s = 0; s < 3; s++) for (let i = 0; i < 8; i++) { const c = SPINES[Math.floor(hash(i, s, 3) * SPINES.length)]; p.r(c, x0 + 6 + i * 4, top + 47 + s * 7, 3, 5); }
      p.r('#f8e0b0', x0 + 12, top + 44, 18, 1); centred(p, 'BOOKS', x0 + 21, top + 44, '#f8d898');
      // the door
      p.r('#141416', x0 + 44, top + 42, 15, H - top - 43); p.r('#5a4a3a', x0 + 45, top + 43, 13, H - top - 44); p.r('#a8c4d4', x0 + 47, top + 45, 9, 10);
      outline(p.ctx, 0, 0, 64, H);
    },
  },
  anaconda: {
    foot: [12, 3], tex: [196, 72], variants: ['preston'],
    paint(p) {
      const x0 = 2, W = 192, H = 72, top = 14, orange = '#e8643a';
      p.r('#6a7280', x0, top, W, H - top - 1); for (let x = 0; x < W; x += 4) p.r('#5e6674', x0 + x, top, 1, H - top - 1);
      p.r('#8a929e', x0, top - 4, W, 5);
      // the orange band
      p.r(orange, x0 + 60, top + 8, W - 62, 10); p.r(shade(orange, 0.2), x0 + 60, top + 8, W - 62, 1);
      p.text('HIKE  BIKE  CAMP  FISH  KAYAK', x0 + 70, top + 11, '#f4f4f0');
      // the portico with ANACONDA in big orange letters
      box(p, x0 + 4, top - 12, 54, 10, '#5a6270');
      big(p, 'ANACONDA', x0 + 8, top - 11, 1.6, orange);
      p.r('#4a525e', x0 + 6, top - 2, 4, H - top - 1); p.r('#4a525e', x0 + 52, top - 2, 4, H - top - 1);
      p.r(orange, x0 + 10, top + 6, 42, 6); centred(p, 'ANACONDA', x0 + 31, top + 7, '#f4f4f0');
      p.r('#2a2e33', x0 + 14, top + 16, 34, H - top - 17); p.r('#a8c8d8', x0 + 15, top + 17, 32, H - top - 18); p.r('#2a2e33', x0 + 30, top + 17, 1, H - top - 18);
      // windows: posters and a tent photo
      p.r('#1e2228', x0 + 62, top + 22, W - 66, H - top - 26);
      p.r('#f4f4f0', x0 + 66, top + 26, 30, 8); p.text('PLAY MORE', x0 + 67, top + 26, '#1e2228'); p.text('PAY LESS', x0 + 69, top + 31, '#1e2228');
      p.r('#e8b830', x0 + 102, top + 25, 40, 26); p.r('#3a8a4a', x0 + 102, top + 40, 40, 11); p.r('#e8643a', x0 + 112, top + 34, 16, 10); p.r('#2a2a2a', x0 + 119, top + 37, 3, 7);
      p.r('#3a6a3a', x0 + 148, top + 25, 38, 26); p.r('#2a4a2a', x0 + 160, top + 30, 12, 21);
      p.r('#e8643a', x0, H - 10, W, 9);
      outline(p.ctx, 0, 0, 196, H);
    },
  },
  francocozzo: {
    foot: [12, 3], tex: [196, 80], variants: ['footscray'],
    paint(p) {
      const x0 = 2, W = 192, H = 80, top = 8;
      p.r('#f2f2ee', x0, top, W, 40); p.r('#dcdcd6', x0 + W - 3, top, 3, 40);
      // flags: Italian at the left end, Australian on the corner
      p.r('#2a8a4a', x0 + 4, top + 8, 4, 12); p.r('#f4f4f0', x0 + 8, top + 8, 4, 12); p.r('#c8302a', x0 + 12, top + 8, 4, 12);
      p.r('#1a2a6a', x0 + W - 24, top + 4, 18, 12); p.r('#c8302a', x0 + W - 22, top + 6, 6, 1); p.r('#f4f4f0', x0 + W - 19, top + 5, 1, 4);
      [[W - 11, 7], [W - 13, 11], [W - 9, 12]].forEach(([x, y]) => p.r('#f4f4f0', x0 + x, top + y, 1, 1));
      // the big black lettering
      big(p, 'FRANCO COZZO', x0 + 26, top + 12, 3, '#141416');
      // dark band, then the glass showroom with furniture inside
      p.r('#2a2e33', x0, top + 40, W, 5);
      p.r('#3a3e44', x0, top + 45, W, H - top - 46);
      for (let x = 2; x < W - 4; x += 24) {
        p.r('#a8c0cc', x0 + x, top + 47, 22, H - top - 50);
        p.r('#c8dce4', x0 + x + 1, top + 48, 5, 3);
        const k = Math.floor(x / 24) % 4;
        if (k === 0) { p.r('#e8c040', x0 + x + 3, top + 62, 16, 6); p.r('#c8a020', x0 + x + 3, top + 60, 3, 4); p.r('#c8a020', x0 + x + 16, top + 60, 3, 4); }   // a banana-yellow couch
        if (k === 1) { p.r('#6a3a1a', x0 + x + 3, top + 60, 16, 8); p.r('#8a5a32', x0 + x + 3, top + 60, 16, 2); }   // brown leather
        if (k === 2) { p.r('#e8e0c8', x0 + x + 4, top + 58, 14, 10); p.r('#c8a070', x0 + x + 4, top + 58, 14, 2); }  // a cream armchair
        if (k === 3) { p.r('#8a5a32', x0 + x + 3, top + 64, 16, 2); p.r('#8a5a32', x0 + x + 4, top + 66, 2, 4); p.r('#8a5a32', x0 + x + 16, top + 66, 2, 4); }   // a dining table
      }
      outline(p.ctx, 0, 0, 196, H);
    },
  },

  // ---- Inside Brunswick Bound
  bookcase: {
    foot: [2, 1], tex: [32, 44], variants: ['a', 'b'],
    paint(p, v) {
      box(p, 0, 0, 32, 44, '#a8723c'); p.r('#8a5a2e', 2, 2, 28, 40);
      for (let s = 0; s < 5; s++) {
        const y = 3 + s * 8;
        p.r('#c48a52', 2, y + 7, 28, 1);
        for (let i = 0; i < 9; i++) { const c = SPINES[Math.floor(hash(i + (v === 'b' ? 20 : 0), s, 7) * SPINES.length)]; const h = 5 + Math.floor(hash(i, s) * 2); p.r(c, 3 + i * 3, y + 7 - h, 2, h); }
      }
    },
  },
  booktable: {
    foot: [2, 1], tex: [32, 24], variants: ['new', 'kids'],
    paint(p, v) {
      box(p, 1, 10, 30, 6, '#c8a070'); p.r('#a8804a', 3, 16, 3, 8); p.r('#a8804a', 26, 16, 3, 8);
      for (let i = 0; i < 4; i++) for (let j = 0; j < (v === 'kids' ? 2 : 3); j++) { const c = SPINES[(i * 3 + j + (v === 'kids' ? 4 : 0)) % SPINES.length]; p.r(c, 3 + i * 7, 8 - j * 2, 6, 3); p.r(shade(c, 0.3), 3 + i * 7, 8 - j * 2, 6, 1); }
    },
  },
  // The flock of paper birds on the wall
  birdmural: {
    foot: [3, 1], tex: [48, 16], variants: ['birds'], solid: false, lined: true,
    paint(p) {
      for (let i = 0; i < 16; i++) {
        const x = Math.floor(hash(i, 2) * 44), y = Math.floor(hash(i, 5) * 12) + 1, c = ['#c8643a', '#2a3a58', '#e8a030', '#5a8ac8'][i % 4];
        p.r(c, x, y, 3, 1); p.r(c, x + 1, y - 1, 1, 1); p.r(c, x + 3, y - 1, 1, 1);
      }
    },
  },
};
