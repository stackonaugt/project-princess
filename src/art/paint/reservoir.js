// Built-in art for Reservoir: the skyrail and the new station, the brick
// units on Loddon Ave, and Tim and Nick's street, Glasgow Ave.
// Same format as objects.js.
import { shade } from './painter.js';
import { bricks, tileRoof } from './laverton.js';

function box(p, x, y, w, h, c) {
  p.r(c, x, y, w, h); p.r(shade(c, 0.18), x, y, w, 1); p.r(shade(c, -0.22), x, y + h - 1, w, 1);
}
function shutterWin(p, x, y, w, h) {
  p.r('#6a4a3a', x - 1, y - 1, w + 2, h + 2); p.r('#d8ccb0', x, y, w, h);
  for (let j = 2; j < h; j += 2) p.r('#c4b898', x, y + j, w, 1);
  p.r('#b8ac8c', x, y, w, 2);
}
function win(p, x, y, w, h) {
  p.r('#f4f0e6', x - 1, y - 1, w + 2, h + 2); p.r('#6a8aa8', x, y, w, h); p.r('#9ab8d0', x + 1, y + 1, Math.max(1, w >> 2), 2); p.r('#f4f0e6', x + (w >> 1), y, 1, h);
}

export const RESERVOIR = {
  // The skyrail: an elevated concrete deck on piers. Drawn over people (it
  // fades when you walk underneath) and trains run along the top.
  viaduct: {
    foot: [44, 3], tex: [704, 64], variants: ['mernda'], solid: false, roof: true,
    paint(p) {
      const W = 704;
      p.r('#3a3d44', 0, 4, W, 6); for (let x = 0; x < W; x += 24) p.r('#2a2d33', x, 4, 2, 6);   // steel girder edge
      p.r('#b8b8b2', 0, 10, W, 36); p.r('#c8c8c2', 0, 10, W, 2);
      for (const y of [14, 30]) { for (let x = 0; x < W; x += 4) p.r('#6b4a2e', x, y, 2, 12); p.r('#5d616a', 0, y + 3, W, 2); p.r('#5d616a', 0, y + 9, W, 2); p.r('#c9ccd2', 0, y + 3, W, 1); p.r('#c9ccd2', 0, y + 9, W, 1); }
      p.r('#3a3d44', 0, 46, W, 8); for (let x = 0; x < W; x += 24) p.r('#2a2d33', x, 46, 2, 8);
      p.r('#9aa0a8', 0, 0, W, 3); for (let x = 12; x < W; x += 96) { p.r('#8a8e96', x, 0, 4, 12); p.r('#7a7e86', x - 10, 2, 24, 2); } // overhead wire masts
      p.r('rgba(20,30,20,.25)', 0, 54, W, 10);                                                      // shadow underneath
    },
  },
  pier: {
    foot: [1, 1], tex: [24, 24], variants: ['concrete'],
    paint(p) { p.shadow(12, 23, 20); box(p, 4, 6, 16, 18, '#a8a8a2'); p.r('#8a8a84', 4, 6, 3, 18); p.r('#c4c4be', 2, 2, 20, 5); },
  },
  // Reservoir Station: black base with the big R, under a white pleated canopy
  resstation: {
    foot: [12, 3], tex: [200, 112], variants: ['skyrail'],
    paint(p) {
      const sx = 4, W = 192, H = 112, base = 64;
      p.r('rgba(30,50,20,.25)', sx + 2, H - 2, W, 3);
      // the zigzag canopy, sloping up to the left
      for (let i = 0; i < 26; i++) {
        const x = sx + i * 8, top = 4 + Math.round(i * 1.2), bottom = base;
        p.r(i % 2 ? '#e8ece8' : '#d0d6d2', x, top, 8, bottom - top);
        p.r('#b8c0bc', x + (i % 2 ? 7 : 0), top, 1, bottom - top);
        for (let y = top + 6; y < bottom; y += 12) p.r('#f4f8f4', x + 2, y, 4, 1);
      }
      p.r('#9aa49e', sx, base - 2, W, 3);
      // black base with glazed entry and the big R
      p.r('#1e2024', sx, base, W, H - base); for (let x = sx; x < sx + W; x += 16) p.r('#2a2d32', x, base, 1, H - base);
      p.r('#2a2e33', sx + 70, base + 8, 44, H - base - 8); p.r('#5a7a8a', sx + 72, base + 10, 40, H - base - 10); p.r('#2a2e33', sx + 91, base + 10, 2, H - base - 10);
      p.r('#3a3d44', sx + 150, base + 8, 20, 24); p.r('#c8ccd0', sx + 154, base + 10, 4, 12); p.r('#c8ccd0', sx + 154, base + 10, 10, 3); p.r('#c8ccd0', sx + 161, base + 12, 3, 4); p.r('#c8ccd0', sx + 158, base + 15, 4, 3); p.r('#c8ccd0', sx + 160, base + 18, 4, 4);
      p.text('RESERVOIR', sx + 143, base + 34, '#9aa0a8'); p.text('STATION', sx + 147, base + 40, '#9aa0a8');
      p.r('#e8a030', sx + 30, base + 14, 2, 30); p.r('#c8443a', sx + 26, base + 10, 10, 6); // bus stop flag
    },
  },
  wayfinding: {
    foot: [1, 1], tex: [40, 34], variants: ['trail'],
    paint(p) {
      p.shadow(8, 33, 10); p.r('#3a3d44', 6, 12, 3, 22);
      [['CHEDDAR RD', 0], ['PIPE TRAIL', 7], ['LAKE PARK', 14]].forEach(([t, y]) => { p.r('#1e2024', 2, y, 36, 6); p.text(t, 3, y + 1, '#f4f4f0'); });
    },
  },
  busshelter: {
    foot: [2, 1], tex: [32, 32], variants: ['glass'],
    paint(p) {
      p.shadow(16, 31, 30); p.r('#3a3d44', 1, 4, 30, 3); p.r('#9ac0d0', 2, 7, 28, 20); p.r('#b8d8e4', 3, 8, 6, 18);
      p.r('#3a3d44', 1, 7, 2, 25); p.r('#3a3d44', 29, 7, 2, 25); p.r('#8a5a2e', 6, 22, 20, 3); p.r('#e8a030', 22, 10, 6, 8);
    },
  },
  sapling: {
    foot: [1, 1], tex: [16, 28], variants: ['gum'], solid: false,
    paint(p) {
      p.r('#9a7a5a', 7, 12, 2, 16);
      [[4, 6], [11, 4], [6, 12], [11, 11], [8, 2]].forEach(([x, y]) => { p.r('#7a9a6a', x - 2, y, 4, 2); p.r('#5a7a4e', x - 1, y + 2, 3, 1); });
    },
  },
  // Loddon Ave: a block of five tan-brick units with brown tile roofs
  loddonunit: {
    foot: [6, 3], tex: [104, 74], variants: ['shutters', 'garage', 'window', 'double'],
    paint(p, v) {
      const sx = 4, W = 96, H = 74, top = 36;
      p.r('rgba(30,50,20,.22)', sx + 2, H - 2, W, 3);
      bricks(p, sx, top, W, H - top, '#a8603e', v.length);
      tileRoof(p, sx - 4, top - 30, W + 8, 30, '#7a5a48');
      p.r('#6a4a32', sx - 4, top - 1, W + 8, 3);
      if (v === 'garage' || v === 'double') {
        const n = v === 'double' ? 2 : 1;
        for (let i = 0; i < n; i++) { const x = sx + 6 + i * 34; p.r('#5a3a28', x, top + 6, 30, 32); p.r('#8a5a3a', x + 1, top + 7, 28, 31); for (let y = 0; y < 30; y += 3) p.r('#7a4a2e', x + 1, top + 8 + y, 28, 1); }
        shutterWin(p, sx + 76, top + 8, 14, 16);
      } else {
        shutterWin(p, sx + 8, top + 6, 26, 22);
        if (v === 'window') { win(p, sx + 44, top + 8, 14, 18); p.r('#c8a070', sx + 46, top + 10, 4, 14); p.r('#c8a070', sx + 52, top + 10, 4, 14); }
        p.r('#5a3a2a', sx + 66, top + 8, 12, 30); p.r('#3a2a1e', sx + 67, top + 9, 10, 29); p.r('#d8b860', sx + 75, top + 22, 1, 2);
        p.r('#c88a5a', sx + 84, top + 10, 6, 10); p.r('#a8704a', sx + 84, top + 10, 6, 1);                 // meter box
      }
    },
  },
  mailbank: {
    foot: [2, 1], tex: [32, 22], variants: ['brick'],
    paint(p) {
      p.shadow(16, 21, 30);
      bricks(p, 1, 4, 30, 18, '#a8603e', 4); p.r('#8a4a30', 0, 2, 32, 3);
      for (let i = 0; i < 5; i++) { p.r('#c8ccd0', 3 + i * 6, 8, 4, 5); p.r('#3a3d44', 4 + i * 6, 10, 2, 1); }
    },
  },
  // Glasgow Ave: a newer brick house with a cream garage door and portico
  glasgowhouse: {
    foot: [9, 3], tex: [150, 80], variants: ['48'],
    paint(p) {
      const sx = 3, W = 144, H = 80, top = 40;
      p.r('rgba(30,50,20,.22)', sx + 2, H - 2, W, 3);
      bricks(p, sx, top, W, H - top, '#8a4a36', 8);
      tileRoof(p, sx - 4, top - 32, W + 8, 32, '#3a3a40');
      tileRoof(p, sx + 76, top - 16, 36, 16, '#3a3a40');
      p.r('#d8ccb0', sx - 4, top - 1, W + 8, 3);
      p.r('#3a3a3a', sx + 6, top + 6, 54, 34); p.r('#ece4cc', sx + 7, top + 7, 52, 33);
      for (let y = 0; y < 32; y += 6) p.r('#d4caae', sx + 7, top + 8 + y, 52, 1);
      for (let i = 0; i < 7; i++) p.r('#2a2a2a', sx + 9 + i * 7, top + 9, 5, 3);
      p.r('#ece4cc', sx + 82, top - 2, 5, 42); p.r('#ece4cc', sx + 104, top - 2, 5, 42);                  // portico columns
      p.r('#2a2a2a', sx + 90, top + 10, 11, 30);
      win(p, sx + 66, top + 10, 10, 20); win(p, sx + 118, top + 10, 16, 16);
    },
  },
  // Tim and Nick's: a small brick unit with a tiled roof and chimney
  timunit: {
    foot: [6, 3], tex: [100, 82], variants: ['57c'],
    paint(p) {
      const sx = 2, W = 96, H = 82, top = 42;
      p.r('rgba(30,50,20,.22)', sx + 2, H - 2, W, 3);
      bricks(p, sx, top, W, H - top, '#9a5236', 5);
      bricks(p, sx + 62, 2, 9, 30, '#a85a3a', 6); p.r('#6a6a6a', sx + 60, 0, 13, 3);
      p.r('#9a9ea6', sx + 74, 0, 1, 18); p.r('#9a9ea6', sx + 68, 2, 14, 1); p.r('#9a9ea6', sx + 70, 6, 10, 1);   // TV antenna
      tileRoof(p, sx - 4, top - 30, W + 8, 30, '#5a5a5e');
      p.r('#d8d4cc', sx - 4, top - 1, W + 8, 3);
      p.r('#3a3a40', sx + 10, top + 6, 40, 30); p.r('#2a2e33', sx + 12, top + 8, 36, 26);                    // porch
      p.r('#f4f4f0', sx + 30, top + 12, 12, 16); p.r('#c8282a', sx + 33, top + 14, 6, 6); p.r('#f4f4f0', sx + 34, top + 15, 4, 3); // Santa in the window
      p.r('#3a5a3a', sx + 18, top + 14, 8, 22);
      win(p, sx + 60, top + 10, 24, 18);
      p.r('#c8b898', sx + 86, top + 20, 6, 18); p.r('#2a2a2a', sx + 87, top + 22, 4, 3);                    // satellite dish post
    },
  },
  pylon: {
    foot: [1, 1], tex: [56, 120], variants: ['steel'],
    paint(p) {
      p.shadow(28, 119, 24, 0.15);
      const c = '#9aa0a8', d = '#7a8088';
      for (let j = 0; j < 112; j++) { const w = Math.round(4 + j * 0.13); p.r(c, 28 - w, 6 + j, 2, 1); p.r(d, 26 + w, 6 + j, 2, 1); if (j % 10 === 0) p.r(c, 28 - w, 6 + j, w * 2, 1); }
      for (let j = 6; j < 116; j += 10) { const w = Math.round(4 + (j - 6) * 0.13); for (let k = 0; k < 10; k++) p.px(d, 28 - w + Math.round(k * w * 0.2), j + k); }
      for (const y of [18, 34]) { p.r(c, 6, y, 44, 2); p.r('#c8ccd0', 8, y + 2, 2, 4); p.r('#c8ccd0', 46, y + 2, 2, 4); }
      p.r(c, 22, 2, 12, 3);
    },
  },
  // Edwardes Lake Park
  steamengine: {
    foot: [6, 2], tex: [100, 46], variants: ['a2'],
    paint(p) {
      p.shadow(50, 45, 96, 0.3);
      p.r('#3a3a3a', 0, 38, 100, 4); p.r('#6a6a6a', 0, 38, 100, 1);                                // rails
      // tender
      p.r('#1e1e22', 70, 16, 28, 20); p.r('#2a2a30', 70, 16, 28, 2); p.r('#141418', 70, 34, 28, 2);
      for (const x of [76, 90]) { p.blob(x, 38, 4, '#141418'); p.blob(x, 38, 2, '#3a3a40'); }
      // boiler, cab and chimney
      p.r('#1e1e22', 8, 14, 46, 14); p.r('#2a2a30', 8, 14, 46, 2); p.r('#3a3a40', 10, 16, 20, 1);
      p.r('#1e1e22', 52, 4, 18, 30); p.r('#2a2a30', 52, 4, 18, 2); p.r('#5a7a8a', 56, 8, 10, 7);
      p.r('#1e1e22', 12, 4, 6, 10); p.r('#2a2a30', 11, 3, 8, 2); p.r('#1e1e22', 30, 8, 6, 6);
      p.r('#c8282a', 4, 28, 66, 3);                                                                  // red running board
      p.r('#c8282a', 2, 22, 6, 8); p.r('#e8e4dc', 4, 24, 2, 2);                                     // buffer beam
      for (const x of [22, 36, 50]) { p.blob(x, 34, 7, '#141418'); p.blob(x, 34, 5, '#c8282a'); p.blob(x, 34, 2, '#141418'); }
      p.r('#9a9ea6', 18, 33, 36, 2);                                                                 // coupling rod
      p.blob(10, 36, 3, '#141418');
      p.r('#d8c070', 58, 20, 6, 3); p.text('A2', 76, 20, '#d8c070'); p.text('964', 74, 27, '#d8c070');
    },
  },
  // The athletics oval, drawn as one smooth shape on the ground
  trackoval: {
    foot: [27, 17], tex: [432, 272], variants: ['red'], solid: false, flat: true,
    paint(p) {
      const g = p.ctx, cx = 216, cy = 136, ell = (rx, ry, c, fill = true, w = 2) => { g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); if (fill) { g.fillStyle = c; g.fill(); } else { g.strokeStyle = c; g.lineWidth = w; g.stroke(); } };
      ell(208, 136, '#c0503a');
      for (let i = 0; i < 300; i++) { const a = Math.random() * Math.PI * 2, t = Math.random(); p.r('#cc5e46', cx + Math.cos(a) * (165 + t * 40), cy + Math.sin(a) * (95 + t * 38), 1, 1); }
      [0.2, 0.4, 0.6, 0.8].forEach(t => ell(160 + t * 48, 92 + t * 44, '#ece4dc', false, 1.5));
      ell(160, 92, '#6cbc4a');
      g.lineWidth = 1; ell(160, 92, '#ece4dc', false, 2);
      for (let i = 0; i < 40; i++) p.r(i % 2 ? '#62b244' : '#58a83c', cx - 150 + (i * 37) % 300, cy - 80 + (i * 53) % 160, 2, 3);
      p.r('#ece4dc', cx - 2, cy + 92, 3, 44);                                  // finish line
    },
  },
  clubhouse: {
    foot: [8, 2], tex: [128, 44], variants: ['athletics', 'scouts'],
    paint(p, v) {
      const W = 128, top = 12;
      p.r('rgba(30,50,20,.22)', 2, 41, W - 2, 3);
      bricks(p, 0, top, W, 44 - top, '#d8b878', v === 'scouts' ? 3 : 7);
      p.r('#9aa0a8', -2, 4, W + 4, 9); for (let x = 0; x < W; x += 4) p.r('#8a9098', x, 4, 1, 9); p.r('#c8ccd0', -2, 4, W + 4, 1);
      if (v === 'athletics') {
        p.r('#2a2a2a', 54, top + 8, 22, 24); p.r('#4a4a4a', 55, top + 9, 20, 23); for (let y = 0; y < 22; y += 3) p.r('#3a3a3a', 55, top + 10 + y, 20, 1);
        [12, 30, 90, 108].forEach(x => { p.r('#3a3a3a', x - 1, top + 7, 12, 9); p.r('#6a7a8a', x, top + 8, 10, 7); for (let i = x + 1; i < x + 10; i += 2) p.r('#3a3a3a', i, top + 8, 1, 7); });
        p.r('#f4f4f0', 8, top + 20, 24, 6); p.text('LITTLE A', 9, top + 21, '#c8443a');
      } else {
        p.r('#5a5a5e', 40, top + 10, 12, 22); p.r('#7a8a9a', 60, top + 8, 18, 10);
        p.r('#a24fc9', 66, top + 6, 8, 5); p.text('1ST RESERVOIR SCOUTS', 4, top + 2, '#5a3a8a');
        p.r('#3a8a5a', 90, top + 14, 3, 4); p.r('#c8443a', 94, top + 16, 6, 2); p.r('#2a5ab8', 102, top + 12, 5, 6);           // graffiti tags
      }
    },
  },
  amenities: {
    foot: [3, 2], tex: [48, 40], variants: ['tan'],
    paint(p) {
      p.r('rgba(30,50,20,.22)', 2, 37, 46, 3);
      bricks(p, 0, 12, 48, 28, '#d0b080', 2);
      p.r('#7a8088', -2, 6, 52, 7); p.r('#9aa0a8', -2, 6, 52, 1);
      p.r('#5a7a8a', 6, 18, 12, 22); p.r('#5a7a8a', 30, 18, 12, 22); p.r('#f4f4f0', 20, 18, 8, 8); p.text('WC', 21, 20, '#2a5aa8');
    },
  },
  gym: {
    foot: [2, 1], tex: [32, 30], variants: ['outdoor'],
    paint(p) {
      p.shadow(16, 29, 28);
      p.r('#3a6ab8', 4, 4, 3, 26); p.r('#3a6ab8', 25, 4, 3, 26); p.r('#3a6ab8', 4, 4, 24, 3);
      p.r('#9aa0a8', 10, 7, 1, 10); p.r('#2a2a2a', 8, 17, 6, 3); p.r('#9aa0a8', 20, 7, 1, 14); p.r('#2a2a2a', 17, 21, 7, 2);
      p.r('#e8c030', 12, 24, 10, 2);
    },
  },
  tussock: {
    foot: [1, 1], tex: [20, 22], variants: ['a', 'b'], solid: false,
    paint(p, v) {
      p.blob(10, 19, 7, v === 'b' ? '#8a8a40' : '#3f6a2e');
      for (let i = 0; i < 40; i++) {
        const x = 2 + (i * 7) % 16, h = 8 + (i * 5) % 12, lean = ((i % 5) - 2) / 3;
        const c = i % 4 === 0 ? '#a8c060' : (v === 'b' ? (i % 2 ? '#c8b860' : '#a89848') : (i % 2 ? '#5a8a3a' : '#6aa048'));
        for (let j = 0; j < h; j++) p.r(c, x + Math.round(lean * j), 22 - j, 1, 1);
      }
    },
  },
  infosign: {
    foot: [1, 1], tex: [24, 30], variants: ['park'],
    paint(p) { p.shadow(12, 29, 14); p.r('#6b4226', 4, 12, 2, 18); p.r('#6b4226', 18, 12, 2, 18); p.r('#3a5a3a', 1, 2, 22, 14); p.r('#e8e4d8', 3, 4, 18, 10); p.r('#3a8a5a', 5, 6, 14, 2); p.r('#5a8ac8', 5, 9, 8, 3); },
  },
};
