// Built-in art for the in-between city zones (Altona North, Footscray,
// Flemington, Coburg, Preston). Same format as objects.js.
import { shade, outline } from './painter.js';

function box(p, x, y, w, h, c) {
  p.r(c, x, y, w, h); p.r(shade(c, 0.18), x, y, w, 1); p.r(shade(c, -0.22), x, y + h - 1, w, 1); p.r(shade(c, -0.12), x + w - 1, y + 1, 1, h - 2);
}

export const CITY = {
  // Racecourse Rd housing tower: concrete, rows of windows and balconies.
  towerblock: {
    foot: [8, 3], tex: [128, 176], variants: ['flemington'],
    paint(p) {
      p.shadow(64, 175, 124);
      box(p, 4, 6, 120, 168, '#c8c4b8');
      p.r('#b0aca0', 4, 6, 6, 168); p.r('#dcd8cc', 10, 6, 2, 168);
      for (let fl = 0; fl < 13; fl++) {
        const y = 12 + fl * 12;
        p.r('#a8a498', 4, y + 9, 120, 1);
        for (let i = 0; i < 9; i++) {
          const x = 14 + i * 12, lit = (fl * 7 + i * 3) % 11 === 0;
          p.r('#3a4a5a', x, y, 8, 7); p.r(lit ? '#f4d070' : '#5a7a9a', x + 1, y + 1, 6, 5); p.r('#9ac0e0', x + 1, y + 1, 2, 1);
          if ((fl + i) % 4 === 0) { p.r('#e8e4dc', x - 1, y + 7, 10, 2); p.r(['#c8443a', '#3a8ad0', '#e8c040'][(fl + i) % 3], x + 1, y + 5, 3, 2); }  // washing on the balcony
        }
      }
      p.r('#8a867a', 4, 160, 120, 14); p.r('#3a2a1e', 56, 162, 16, 12); p.r('#9ad0e8', 58, 164, 12, 5);
      p.r('#f4f4f0', 30, 4, 20, 3); p.r('#9a9a9a', 90, 2, 2, 5); p.r('#9a9a9a', 96, 0, 2, 7);   // rooftop bits
      outline(p.ctx, 0, 0, 128, 176);
    },
  },
  // Billboards with gentle Melbourne jokes.
  billboard: {
    foot: [4, 1], tex: [64, 56], variants: ['rent', 'pies', 'trains'],
    paint(p, v) {
      p.r('#5a5a60', 14, 30, 3, 26); p.r('#5a5a60', 46, 30, 3, 26); p.r('#7a7a80', 15, 30, 1, 26); p.r('#7a7a80', 47, 30, 1, 26);
      const bg = { rent: '#f4f0e6', pies: '#c8443a', trains: '#2f6aa3' }[v];
      box(p, 0, 2, 64, 30, '#3a3a40'); p.r(bg, 2, 4, 60, 26);
      if (v === 'rent') { p.text('2 BED, 1 BATH', 6, 8, '#3a3a40'); p.text('$900 A WEEK', 8, 16, '#c8443a'); p.text('CHARMING', 14, 23, '#7a7a80'); }
      if (v === 'pies') { p.text('HOT PIES', 14, 8, '#fff4c0'); p.r('#c8823a', 22, 16, 20, 9); p.r('#e8b060', 22, 16, 20, 2); p.r('#8a5a2a', 30, 18, 4, 2); }
      if (v === 'trains') { p.text('TRAINS', 18, 8, '#f4f4f0'); p.text('ROUGHLY', 16, 15, '#f4f4f0'); p.text('ON TIME', 16, 22, '#e8c040'); }
      outline(p.ctx, 0, 0, 64, 56);
    },
  },
  // Old Pentridge Prison watchtower, Coburg. Bluestone, now with cafes nearby.
  watchtower: {
    foot: [2, 2], tex: [32, 64], variants: ['pentridge'],
    paint(p) {
      p.shadow(16, 63, 28);
      box(p, 6, 22, 20, 42, '#6a6e78');
      for (let y = 24; y < 62; y += 5) for (let x = 6 + ((y / 5) % 2) * 3; x < 26; x += 6) p.r('#5a5e68', x, y, 5, 4);
      box(p, 2, 10, 28, 12, '#7a7e88'); p.r('#3a3e48', 6, 13, 20, 5); p.r('#9ac0e0', 8, 14, 4, 3); p.r('#9ac0e0', 20, 14, 4, 3);
      p.r('#4a4e58', 0, 6, 32, 4); p.r('#6a6e78', 4, 2, 24, 4);
      p.r('#3a2a1e', 12, 50, 8, 14);
      outline(p.ctx, 0, 0, 32, 64);
    },
  },
};
