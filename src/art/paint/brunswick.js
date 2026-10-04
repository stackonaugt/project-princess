// Built-in art for Brunswick: Rose's flats on Donald St, A1 Bakery on
// Sydney Rd, Mem and Corni's apartments on Hope St, and Brunswick Station.
// Same format as objects.js.
import { shade } from './painter.js';
import { bricks, tileRoof } from './laverton.js';
import { hash } from '../../util.js';

function box(p, x, y, w, h, c) {
  p.r(c, x, y, w, h); p.r(shade(c, 0.18), x, y, w, 1); p.r(shade(c, -0.22), x, y + h - 1, w, 1);
}
function win(p, x, y, w, h, { frame = '#5a6068', glass = '#6a8aa8', blind = null } = {}) {
  p.r(frame, x - 1, y - 1, w + 2, h + 2); p.r(glass, x, y, w, h); p.r(shade(glass, 0.3), x + 1, y + 1, Math.max(1, w >> 2), 2);
  if (blind) p.r(blind, x, y, w, Math.floor(h / 2));
}
function plants(p, x, y, w) {
  for (let i = 0; i < w; i += 3) { const c = ['#3f8a3e', '#57a84a', '#2f7a37', '#c8443a', '#e77fb8'][Math.floor(hash(x + i, y) * 5)]; p.blob(x + i + 1, y, 2, c); p.r('#3f8a3e', x + i + 1, y + 1, 1, 3); }
}

export const BRUNSWICK = {
  // Rose's place: a three-storey 60s block of flats in blue-grey render
  flats: {
    foot: [9, 3], tex: [148, 120], variants: ['donald'],
    paint(p) {
      const sx = 2, W = 144, H = 120, top = 14, wall = '#a8b4c0', fin = '#bcc6d0', dark = '#8a96a4';
      p.r('rgba(30,50,20,.22)', sx + 2, H - 2, W - 2, 3);
      p.r(wall, sx, top, W, H - top);
      p.r('#6a7480', sx - 2, top - 6, W + 4, 6); p.r('#8a94a0', sx - 2, top - 6, W + 4, 1);     // flat roof edge
      for (let i = 0; i < 6; i++) {
        const x = sx + 6 + i * 23;
        p.r(fin, x, top, 5, H - top); p.r(dark, x + 4, top, 1, H - top);                         // vertical pilasters
        for (let f = 0; f < 3; f++) win(p, x + 8, top + 8 + f * 33, 11, 18, { blind: f === 1 && i % 2 ? '#e8e0cc' : null });
      }
      // balconies with pot plants on the right
      for (let f = 0; f < 2; f++) {
        const y = top + 28 + f * 33;
        p.r('#5a6068', sx + W - 26, y, 24, 2); for (let x = sx + W - 26; x < sx + W - 2; x += 3) p.r('#5a6068', x, y + 2, 1, 8); p.r('#5a6068', sx + W - 26, y + 10, 24, 1);
        plants(p, sx + W - 24, y - 2, 20);
      }
      p.r('#2a2e33', sx + W - 26, H - 26, 14, 26); p.r('#4a5058', sx + W - 25, H - 25, 12, 25);      // entry
      p.r('#f5e6a0', sx + 50, top + 64, 3, 4); p.r('#3a3e44', sx + 49, top + 63, 5, 1);              // wall lamp
      p.r('#9aa4b0', sx + 30, top + 40, 1, 8); p.r('#9aa4b0', sx + 30, top + 48, 6, 1);              // a crack. it's rented
    },
  },
  aptblock: {
    foot: [10, 3], tex: [160, 128], variants: ['grey'], solid: true,
    paint(p) {
      const W = 160, H = 128;
      for (let f = 0; f < 7; f++) {
        const y = 6 + f * 17;
        p.r(f % 2 ? '#a8acb2' : '#b8bcc2', 0, y, W, 17);
        for (let x = 4; x < W; x += 20) { win(p, x, y + 3, 12, 10, { frame: '#7a7e84', glass: '#5a6a7a' }); if ((x + f) % 3 === 0) p.r('#8a8e94', x - 2, y + 13, 16, 2); }
      }
      p.r('#7a7e84', 0, 0, W, 6); p.r('#c8ccd2', 0, 0, W, 1);
    },
  },
  // A1 Bakery: blue painted brick with an ornate wavy parapet and the big sign
  a1bakery: {
    foot: [8, 3], tex: [140, 112], variants: ['sydney'],
    paint(p) {
      const sx = 6, W = 128, H = 112, top = 34, blue = '#2a5ab8';
      p.r(blue, sx, top, W, H - top);
      for (let y = top + 2; y < top + 40; y += 3) p.r(shade(blue, -0.1), sx, y, W, 1);
      // wavy parapet with white trim and urns
      for (let x = 0; x < W; x++) { const h = Math.round(6 + Math.sin(x / W * Math.PI * 2) * 4); p.r(blue, sx + x, top - h, 1, h); p.r('#f0f0ea', sx + x, top - h - 2, 1, 2); }
      for (const x of [0, 42, 84, W - 6]) { p.r('#f0f0ea', sx + x, top - 16, 6, 30); p.r('#d8d8d0', sx + x + 4, top - 16, 2, 30); p.r('#f0f0ea', sx + x + 1, top - 20, 4, 4); }
      p.r('#3a2a8a', sx + 52, top + 6, 26, 18); p.text('A1', sx + 58, top + 8, '#ffffff'); p.text('BAKERY', sx + 54, top + 16, '#ffffff');
      p.text('GSNK', sx + 96, top + 4, '#7aa0e8');
      // the big A1 BAKERY box sign on its pole
      p.r('#9aa0a8', sx + 30, 6, 2, 30);
      box(p, sx + 14, 0, 34, 28, '#2a4ab0'); p.r('#f4f4f0', sx + 16, 2, 30, 24);
      p.r('#d8282a', sx + 19, 4, 4, 12); p.r('#d8282a', sx + 26, 4, 4, 12); p.r('#d8282a', sx + 19, 4, 11, 3); p.r('#d8282a', sx + 19, 9, 11, 2); // A
      p.r('#d8282a', sx + 34, 4, 4, 12); p.r('#d8282a', sx + 32, 4, 3, 3); p.r('#d8282a', sx + 32, 14, 8, 2);        // 1
      p.text('BAKERY', sx + 19, 19, '#2a4ab0');
      // shopfront under the verandah
      p.r('#1e1e24', sx, top + 42, W, 10); p.text('A1 MIDDLE EAST FOOD STORE', sx + 6, top + 45, '#d8d8d0');
      p.r('#c8443a', sx + 4, top + 45, 2, 5);
      for (let i = 0; i < 4; i++) {
        const x = sx + 4 + i * 32; p.r('#2a3a8a', x, top + 54, 28, H - top - 56); p.r('#7a9ac8', x + 2, top + 56, 24, 12);
        p.r('#f4f4f0', x + 3, top + 56, 22, 3); p.text(i === 1 ? 'BREAD' : i === 2 ? 'PIES' : '', x + 5, top + 57, '#c8443a');
        p.r('#b8a070', x + 4, top + 62, 8, 4); p.r('#d8c090', x + 14, top + 63, 8, 3);
      }
      p.r('#3a2a2a', sx + 58, top + 54, 12, H - top - 54);
    },
  },
  verandah: {
    foot: [8, 1], tex: [128, 22], variants: ['steel'], solid: false, roof: true,
    paint(p) {
      p.r('#d8d8d0', 0, 0, 128, 16); for (let x = 1; x < 128; x += 3) p.r('#b8b8b0', x, 0, 1, 16);
      p.r('#f0f0ea', 0, 0, 128, 2); p.r('#9a9a92', 0, 14, 128, 2); p.r('#5a5a62', 0, 16, 128, 4);
    },
  },
  // Ornate red-brick shop with a moulded parapet
  redshop: {
    foot: [4, 3], tex: [64, 76], variants: ['red', 'cream'],
    paint(p, v) {
      const W = 64, H = 76, top = 18, brick = v === 'red' ? '#a8503a' : '#d8c4a0';
      bricks(p, 0, top, W, H - top, brick, 3);
      p.r('#e8dcc0', 20, 0, 24, 18); p.r('#d8c8a8', 22, 4, 20, 10); p.r('#e8dcc0', 28, 0, 8, 2); p.blob(32, 9, 4, '#c8b898');
      p.r('#e8dcc0', 0, top - 2, W, 3); p.r('#e8dcc0', 0, top + 26, W, 2);
      p.r('#e8dcc0', 6, top + 4, 14, 18); p.r('#5a6a7a', 8, top + 6, 10, 15); p.r('#e8dcc0', 44, top + 4, 14, 18); p.r('#5a6a7a', 46, top + 6, 10, 15);
      p.r('#c8443a', 0, top + 30, W, 6); p.r('#f0d040', 0, top + 36, W, 2);
      p.r('#2a2e33', 4, top + 40, 40, H - top - 40); p.r('#7a9ac8', 5, top + 41, 38, 14); p.r('#3a2a2a', 48, top + 40, 12, H - top - 40);
    },
  },
  // Mem and Corni's apartments on Hope St: concrete fins, plant-filled
  // balconies, sage green awnings over a brick base
  hopeapts: {
    foot: [12, 3], tex: [196, 150], variants: ['hope'],
    paint(p) {
      const sx = 2, W = 192, H = 150, top = 6, base = 98;
      p.r('rgba(30,50,20,.22)', sx + 2, H - 2, W - 2, 3);
      p.r('#9a9c9e', sx, top, W, base - top);
      for (let f = 0; f < 4; f++) {
        const y = top + 4 + f * 22;
        p.r('#3a3d42', sx, y, W, 16);                                                     // recessed balcony
        p.r('#b8bab8', sx, y + 16, W, 4);                                                 // slab edge
        for (let x = sx; x < sx + W; x += 3) p.r('#5a5d62', x, y + 6, 1, 10); p.r('#6a6d72', sx, y + 6, W, 1);
        plants(p, sx + 4 + (f * 7) % 20, y + 12, W - 30);
      }
      for (let i = 0; i < 6; i++) { const x = sx + 6 + i * 36; p.r('#c8c8c4', x, top, 6, base - top + 6); p.r('#a8a8a4', x + 5, top, 1, base - top + 6); } // fins
      p.r('#b8b8b4', sx, top - 2, W, 4);
      // brick base with shopfronts and the fire booster
      bricks(p, sx, base, W, H - base, '#d8b088', 6);
      for (let i = 0; i < 5; i++) { const x = sx + 6 + i * 38; p.r('#2a2e33', x, base + 18, 26, H - base - 18); p.r('#5a6a7a', x + 1, base + 19, 24, 22); }
      // sage green awnings
      for (let i = 0; i < 5; i++) {
        const x = sx + 2 + i * 38;
        for (let j = 0; j < 12; j++) p.r(j % 3 === 0 ? '#a8bc9a' : '#98ae8a', x - (j >> 2), base + 2 + j, 34 + (j >> 1), 1);
        p.r('#7a9070', x - 3, base + 14, 37, 2);
      }
      p.r('#c8443a', sx + 120, base + 30, 2, 16); p.r('#c8443a', sx + 120, base + 30, 12, 2); p.r('#9aa0a8', sx + 124, base + 34, 2, 12); p.r('#c8443a', sx + 128, base + 32, 4, 4);
    },
  },
  // Brunswick Station's heritage building: red brick, cream trim, red roof
  brunstation: {
    foot: [6, 2], tex: [104, 70], variants: ['heritage'],
    paint(p) {
      const sx = 4, W = 96, H = 70, top = 34;
      p.r('rgba(30,50,20,.22)', sx + 2, H - 2, W - 2, 3);
      bricks(p, sx, top, W, H - top, '#b45a3e', 2);
      tileRoof(p, sx - 2, 4, W + 4, 22, '#b8402e');
      for (let x = 0; x < W + 4; x += 3) p.r('#a0382a', sx - 2 + x, 6, 1, 20);
      p.r('#f0d8a0', sx - 2, 24, W + 4, 6); for (let x = 0; x < W + 4; x += 4) p.r('#d8bc80', sx - 2 + x, 26, 2, 3);  // cream frieze
      // verandah roof on red posts along the platform side
      p.r('#c84a34', sx - 4, top - 4, W + 8, 6); p.r('#a03a28', sx - 4, top + 1, W + 8, 1);
      for (const x of [0, 30, 62, W - 2]) { p.r('#9a2a22', sx + x, top + 2, 2, H - top - 2); p.r('#c84a34', sx + x - 1, top + 2, 4, 2); }
      p.r('#e8d4a0', sx + 18, top + 6, 22, 22); p.r('#b45a3e', sx + 20, top + 8, 18, 18);
      for (const x of [8, 46, 74]) { p.r('#e8d4a0', x + sx, top + 8, 12, 20); p.r(x === 46 ? '#8a3a2a' : '#5a6a7a', x + sx + 2, top + 10, 8, 18); }
      p.r('#2a5ab8', sx + 22, top + 10, 14, 8); p.r('#f4f4f0', sx + 24, top + 12, 10, 1); p.r('#f4f4f0', sx + 24, top + 14, 8, 1);
      p.r('#f4f4f0', sx + 4, H - 10, W - 8, 1); p.r('#f4f4f0', sx + 4, H - 4, W - 8, 1);       // white rail
      for (let x = sx + 4; x < sx + W - 4; x += 6) p.r('#f4f4f0', x, H - 10, 1, 7);
    },
  },
  sighut: {
    foot: [2, 2], tex: [32, 48], variants: ['weatherboard'],
    paint(p) {
      p.shadow(16, 47, 30);
      p.r('#e8dcb4', 2, 18, 28, 30); for (let y = 20; y < 48; y += 3) p.r('#d0c498', 2, y, 28, 1);
      for (let j = 0; j < 14; j++) p.r(j % 3 === 2 ? '#8a2a22' : '#a8382c', 2 - (j >> 2) + 2, 4 + j, 28 - 4 + (j >> 1), 1);
      p.r('#6a4a3a', 22, 0, 5, 8); p.r('#4a3a2a', 21, 0, 7, 2);
      p.r('#5a3a2a', 6, 28, 8, 20); p.r('#5a6a7a', 18, 26, 8, 8);
    },
  },
  boomgate: {
    foot: [1, 1], tex: [48, 34], variants: ['up'],
    paint(p) {
      p.shadow(8, 33, 10);
      p.r('#d8dcdf', 5, 12, 6, 22); p.r('#9aa0a8', 5, 30, 6, 4);
      p.r('#e8e8e8', 2, 6, 12, 7); p.blob(5, 9, 2, '#c8282a'); p.blob(11, 9, 2, '#c8282a');
      for (let i = 0; i < 9; i++) p.r(i % 2 ? '#c8282a' : '#f4f4f0', 12 + i * 4, 18 - i, 4, 3);        // raised arm
      p.r('#3a3a3a', 6, 0, 4, 6); p.r('#f0c020', 7, 1, 2, 2);
    },
  },
  bikehoop: {
    foot: [1, 1], tex: [16, 16], variants: ['steel'], solid: false,
    paint(p) { for (let t = 0; t <= 16; t++) { const a = Math.PI * t / 16; p.r('#a8acb4', 8 - Math.cos(a) * 5, 14 - Math.sin(a) * 9, 2, 2); } },
  },
  mailpillar: {
    foot: [1, 1], tex: [16, 30], variants: ['render'],
    paint(p) { p.shadow(8, 29, 12); box(p, 2, 4, 12, 26, '#c8ccd0'); p.r('#e8ecef', 4, 8, 8, 6); p.r('#3a3e44', 5, 10, 6, 1); p.r('#a8acb2', 2, 2, 12, 3); },
  },
  booster: {
    foot: [1, 1], tex: [24, 20], variants: ['fire'],
    paint(p) {
      p.r('#9aa0a8', 2, 14, 20, 3); p.r('#c8282a', 3, 4, 3, 10); p.r('#c8282a', 10, 6, 3, 8); p.r('#c8282a', 17, 4, 3, 10);
      p.r('#c8282a', 2, 3, 5, 2); p.r('#c8282a', 16, 3, 5, 2); p.r('#f4f4f0', 8, 0, 8, 5); p.r('#c8282a', 9, 1, 6, 1);
    },
  },
};

