// Built-in art for things inside the house. Same format as objects.js:
// foot = blocking footprint in tiles, tex = texture size, anchored
// bottom-centre. flat: drawn on the floor under everything (rugs).
import { shade } from './painter.js';

const T = 16;
const wood = '#a8703e', woodD = '#7a4a24', woodL = '#c48a52';

function box(p, x, y, w, h, c) { // filled box with light top edge and dark bottom/right
  p.r(c, x, y, w, h); p.r(shade(c, 0.18), x, y, w, 1); p.r(shade(c, -0.22), x, y + h - 1, w, 1); p.r(shade(c, -0.12), x + w - 1, y + 1, 1, h - 2);
}
function line(p, c, x, y, w, h) { p.r(c, x, y, w, h); }

export const FURNITURE = {
  counter: {
    foot: [1, 1], tex: [16, 26], variants: ['plain', 'sink', 'stove', 'kettle'],
    paint(p, v) {
      box(p, 0, 10, 16, 16, '#eceae4');                  // cabinet
      line(p, '#cfcbc2', 7, 13, 1, 12); p.r('#9a958a', 5, 17, 1, 3); p.r('#9a958a', 10, 17, 1, 3);
      box(p, 0, 6, 16, 5, '#5a5d64');                    // stone bench top
      line(p, '#6e7178', 0, 6, 16, 1);
      if (v === 'sink') { p.r('#a8b0b8', 3, 7, 10, 3); p.r('#7a828a', 4, 8, 8, 1); p.r('#c4cad0', 7, 3, 2, 4); p.r('#c4cad0', 7, 3, 4, 1); }
      if (v === 'stove') {
        p.r('#1e1e22', 1, 6, 14, 4); [[3, 7], [10, 7]].forEach(([x, y]) => { p.r('#5a5d64', x, y, 3, 2); });
        box(p, 1, 12, 14, 12, '#2a2a30'); p.r('#3a4a5a', 3, 15, 10, 6); p.r('#8a8d94', 3, 13, 10, 1);
      }
      if (v === 'kettle') { p.r('#c8443a', 3, 2, 5, 5); p.r('#e2705f', 4, 3, 2, 1); p.r('#2a2a2a', 8, 3, 1, 2); p.r('#f4efe0', 10, 3, 4, 4); p.r('#6b4226', 11, 4, 2, 2); }
    },
  },
  fridge: {
    foot: [1, 1], tex: [16, 32],
    variants: ['silver'],
    paint(p) {
      box(p, 1, 2, 14, 30, '#c9ccd2'); p.r('#b0b4ba', 1, 12, 14, 1);
      p.r('#8a8d94', 12, 5, 1, 5); p.r('#8a8d94', 12, 15, 1, 8);
      p.r('#f5d63a', 4, 16, 3, 3); p.r('#e77fb8', 7, 20, 3, 2); p.r('#f4f4f0', 3, 5, 4, 5); // magnets and a drawing
    },
  },
  island: {
    foot: [3, 1], tex: [48, 24], variants: ['stone'],
    paint(p) {
      box(p, 1, 9, 46, 15, '#e4e0d6'); for (let x = 8; x < 46; x += 8) line(p, '#cfcbc2', x, 11, 1, 12);
      box(p, 0, 4, 48, 6, '#5a5d64'); line(p, '#6e7178', 0, 4, 48, 1);
      p.r('#f4efe0', 6, 1, 6, 4); p.r('#3fa38f', 7, 2, 4, 2);            // fruit bowl
      p.r('#c48a52', 30, 2, 10, 3); p.r('#e8d6a0', 31, 2, 8, 1);        // chopping board
    },
  },
  dining: {
    foot: [3, 2], tex: [48, 40], variants: ['oak'],
    paint(p) {
      const chair = (x, y, back) => { box(p, x, y, 8, 7, woodD); if (back) p.r(woodD, x, y - 5, 8, 3); };
      chair(4, 6, true); chair(20, 6, true); chair(36, 6, true);
      box(p, 2, 12, 44, 18, wood); line(p, woodL, 3, 13, 42, 1); line(p, woodD, 2, 29, 44, 1);
      p.r(woodD, 4, 30, 3, 8); p.r(woodD, 41, 30, 3, 8);
      p.r('#f4efe0', 8, 16, 6, 4); p.r('#f4efe0', 34, 18, 6, 4); p.r('#e8b060', 22, 18, 5, 5); p.r('#3f8a3e', 23, 15, 3, 3); // plates and a vase
      chair(10, 31, false); chair(30, 31, false);
    },
  },
  // Couches: '<side>' or '<side>-<style>', side front/back, style from Franco Cozzo
  // (banana: the famous yellow curve; leather: brown chesterfield).
  couch: {
    foot: [3, 1], tex: [48, 28], variants: ['front', 'back', 'back-banana', 'back-leather', 'back-velvet', 'back-floral', 'front-banana', 'front-leather', 'front-velvet', 'front-floral'],
    paint(p, v) {
      const [side, style] = String(v).split('-');
      if (style === 'banana') {
        // a curved yellow couch, darker at the ends like a banana
        for (let x = 0; x < 48; x++) { const lift = Math.round(Math.pow((x - 24) / 24, 2) * 8); const c = x < 4 || x > 43 ? '#8a6a20' : x < 9 || x > 38 ? '#d8b020' : '#f0d040';
          p.r(c, x, 6 + 8 - lift, 1, 14 + lift - 2); p.r(shade(c, 0.25), x, 6 + 8 - lift, 1, 1); }
        p.r('#3a2a10', 0, 12, 2, 4); p.r('#3a2a10', 46, 12, 2, 4);
        return;
      }
      const c = { leather: '#6a3a1a', velvet: '#1f6a4a', floral: '#e8b8c0' }[style] || '#5a7a9a', d = shade(c, -0.22), l = shade(c, 0.18);
      if (style === 'leather' || style === 'velvet') {
        box(p, 0, 6, 48, 22, d); p.r(c, 2, 8, 44, 14); p.r(l, 3, 9, 42, 2);
        for (let x = 6; x < 44; x += 6) for (let y = 12; y < 20; y += 4) p.r(shade(c, -0.35), x, y, 1, 1);   // buttons
        p.r(d, 0, 6, 6, 20); p.r(d, 42, 6, 6, 20); p.r(l, 1, 6, 4, 2); p.r(l, 43, 6, 4, 2);
        if (style === 'velvet') { p.r('#d8b040', 3, 26, 2, 2); p.r('#d8b040', 43, 26, 2, 2); p.r(shade(c, 0.32), 8, 10, 30, 1); }   // gold feet, sheen
        return;
      }
      const roses = () => { for (let i = 0; i < 14; i++) { const x = 3 + (i * 7) % 42, y = 9 + (i * 5) % 14; p.r('#c84a6a', x, y, 2, 2); p.r('#6a9a5a', x + 2, y + 1, 1, 1); } };
      if (side === 'back') {
        box(p, 0, 6, 48, 22, d); p.r(c, 2, 8, 44, 14); p.r(l, 3, 9, 42, 2);
        p.r(d, 0, 6, 5, 20); p.r(d, 43, 6, 5, 20);
        if (style === 'floral') { roses(); p.r('rgba(255,255,255,0.35)', 2, 8, 44, 1); }   // plastic cover glint
        return;
      }
      box(p, 0, 2, 48, 14, d); p.r(c, 2, 4, 44, 10); p.r(l, 3, 4, 42, 2);   // backrest
      box(p, 2, 14, 44, 10, c); p.r(l, 3, 15, 42, 1); line(p, d, 16, 15, 1, 8); line(p, d, 31, 15, 1, 8);
      box(p, 0, 8, 5, 18, d); box(p, 43, 8, 5, 18, d);
      if (style === 'floral') { roses(); p.r('#f4f0e6', 6, 8, 7, 6); p.r('#f4f0e6', 35, 8, 7, 6); p.r('rgba(255,255,255,0.4)', 3, 15, 42, 1); return; }   // doilies, plastic cover
      p.r('#f0c040', 6, 8, 7, 6); p.r('#e77fb8', 35, 8, 7, 6);            // cushions
    },
  },
  armchair: {
    foot: [1, 1], tex: [18, 26], variants: ['mustard', 'wingback', 'recliner', 'egg', 'beanbag'],
    paint(p, v) {
      if (v === 'beanbag') { box(p, 1, 12, 16, 13, '#7a3aa8'); p.blob(9, 15, 7, '#8a4ab8'); p.r('#b07ad8', 5, 11, 7, 2); p.r('#5a2a80', 2, 23, 14, 2); return; }
      if (v === 'egg') {
        p.r('#8a8e98', 8, 0, 2, 4); p.r('#6a6e78', 4, 24, 10, 2); p.r('#6a6e78', 8, 20, 2, 4);   // stand and chain
        p.blob(9, 13, 8, '#c8a060'); p.blob(9, 14, 6, '#8a6a3a'); p.r('#f4f0e6', 5, 14, 8, 5);   // rattan egg and cushion
        for (let y = 7; y < 21; y += 3) p.r('#a8804a', 2, y, 14, 1);
        p.blob(9, 14, 5, '#f0ead8'); return;
      }
      const c = { wingback: '#d8b040', recliner: '#5a4a3a' }[v] || '#c89a3a', d = shade(c, -0.22);
      if (v === 'wingback') {
        box(p, 1, 0, 16, 13, d); p.r(c, 3, 2, 12, 9); box(p, 0, 3, 4, 10, d); box(p, 14, 3, 4, 10, d);   // tall back and wings
        box(p, 2, 12, 14, 9, c); box(p, 0, 11, 4, 11, d); box(p, 14, 11, 4, 11, d);
        for (let x = 4; x < 14; x += 3) p.r('#a87820', x, 4, 1, 1);
        p.r('#7a4a24', 1, 22, 2, 3); p.r('#7a4a24', 15, 22, 2, 3); return;   // claw feet
      }
      if (v === 'recliner') {
        box(p, 1, 2, 16, 11, d); box(p, 2, 10, 14, 10, c); box(p, 0, 7, 4, 14, d); box(p, 14, 7, 4, 14, d);
        box(p, 3, 19, 12, 6, c); p.r('#1e1a18', 15, 14, 2, 3); return;   // footrest up, the button
      }
      box(p, 1, 5, 16, 10, d); box(p, 2, 13, 14, 10, c); box(p, 0, 10, 4, 14, d); box(p, 14, 10, 4, 14, d);
    },
  },
  tv: {
    foot: [3, 1], tex: [48, 34], variants: ['unit'],
    paint(p) {
      box(p, 0, 22, 48, 12, woodD); line(p, wood, 1, 23, 46, 1); p.r('#5a3a1a', 16, 26, 16, 6); p.r('#3a2a20', 4, 26, 8, 6);
      box(p, 6, 2, 36, 20, '#1e1e24'); p.r('#2a3a5a', 8, 4, 32, 15); p.r('#4a6a9a', 9, 5, 12, 4);
      p.r('#3fa38f', 22, 12, 10, 5); p.r('#f4efe0', 34, 26, 4, 5); p.r('#3f8a3e', 40, 18, 5, 5); // footy on tv, speaker, plant
    },
  },
  rug: {
    foot: [4, 3], tex: [64, 48], variants: ['red', 'blue', 'cream', 'persian', 'shag', 'stripe', 'jute'], solid: false, flat: true,
    paint(p, v) {
      if (v === 'persian') {
        p.r('#8a1e2a', 2, 2, 60, 44); p.r('#1e2a5a', 6, 6, 52, 36); p.r('#8a1e2a', 9, 9, 46, 30); p.r('#d8b060', 11, 11, 42, 26); p.r('#8a1e2a', 13, 13, 38, 22);
        for (let i = 0; i < 4; i++) { p.r('#1e2a5a', 30 - i * 4, 18 + i, 4 + i * 8, 1); p.r('#1e2a5a', 30 - i * 4, 30 - i, 4 + i * 8, 1); }
        p.r('#d8b060', 28, 22, 8, 4); for (let x = 7; x < 58; x += 4) { p.r('#d8b060', x, 7, 2, 1); p.r('#d8b060', x, 40, 2, 1); }
        for (let y = 3; y < 46; y += 3) { p.r('#f4efe0', 0, y, 2, 1); p.r('#f4efe0', 62, y, 2, 1); }
        return;
      }
      if (v === 'shag') { p.r('#d8701e', 2, 2, 60, 44); for (let i = 0; i < 260; i++) { const x = 2 + (i * 37) % 59, y = 2 + (i * 23) % 43; p.r(i % 3 ? '#f08a2a' : '#b85a14', x, y, 1, 2); } return; }
      if (v === 'stripe') { ['#e85a4a', '#f4efe0', '#3a8aa8', '#f0c040', '#f4efe0', '#3a8a5a'].forEach((c, i) => p.r(c, 2, 2 + i * 7.4, 60, 8)); for (let x = 4; x < 62; x += 3) { p.r('#f4efe0', x, 0, 1, 2); p.r('#f4efe0', x, 46, 1, 2); } return; }
      if (v === 'jute') { p.r('#c8a870', 2, 2, 60, 44); for (let y = 3; y < 46; y += 2) p.r(y % 4 ? '#b89860' : '#d8bc84', 3, y, 58, 1); p.r('#8a6a3a', 2, 2, 60, 1); p.r('#8a6a3a', 2, 45, 60, 1); return; }
      const c = { red: '#a8403a', blue: '#3a5a8a', cream: '#e4d4b4' }[v], d = shade(c, -0.2), l = shade(c, 0.25);
      p.r(c, 2, 2, 60, 44); p.r(d, 5, 5, 54, 38); p.r(c, 7, 7, 50, 34); p.r(l, 12, 12, 40, 24); p.r(c, 15, 15, 34, 18);
      for (let x = 4; x < 62; x += 3) { p.r(l, x, 0, 1, 2); p.r(l, x, 46, 1, 2); }
    },
  },
  bed: {
    foot: [2, 3], tex: [32, 64], variants: ['blue', 'pink', 'green', 'sage', 'canopy', 'waterbed', 'brass', 'futon'],
    paint(p, v) {
      if (v === 'canopy') {   // carved posts and a gold canopy over a red doona
        p.r('#a87820', 0, 0, 32, 8); p.r('#e8c040', 1, 1, 30, 4); for (let x = 1; x < 31; x += 4) p.r('#c89a30', x, 5, 3, 4);
        p.r(woodD, 0, 8, 3, 56); p.r(woodD, 29, 8, 3, 56); p.r(woodL, 1, 8, 1, 56); p.r(woodL, 30, 8, 1, 56);
        box(p, 3, 12, 26, 8, woodD); box(p, 3, 18, 26, 44, '#f4f0e6'); box(p, 5, 20, 10, 6, '#ffffff'); box(p, 17, 20, 10, 6, '#ffffff');
        box(p, 3, 30, 26, 32, '#a02a3a'); p.r('#e8c040', 3, 30, 26, 2); p.r('#e8c040', 3, 60, 26, 1); return;
      }
      if (v === 'waterbed') {   // padded wooden frame, a sloshing blue mattress
        box(p, 0, 8, 32, 56, woodD); box(p, 2, 10, 28, 52, '#3a7ab8');
        for (let y = 16; y < 60; y += 6) p.r('#6aaad8', 4 + (y % 12), y, 12, 1);
        box(p, 4, 12, 10, 6, '#ffffff'); box(p, 18, 12, 10, 6, '#ffffff'); p.r('#c8443a', 26, 50, 3, 3); return;   // heater dial
      }
      if (v === 'brass') {   // brass rails, a patchwork quilt
        for (let x = 1; x < 31; x += 5) p.r('#d8b040', x, 4, 2, 12); p.r('#e8c850', 0, 3, 32, 2); p.r('#b08a20', 0, 15, 32, 2);
        box(p, 1, 14, 30, 48, '#f4f0e6'); box(p, 3, 16, 12, 7, '#ffffff'); box(p, 17, 16, 12, 7, '#ffffff');
        const pc = ['#d8789a', '#5a7aaa', '#e8c040', '#6a9a5a', '#c8743a'];
        for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) p.r(pc[(x + y * 2) % 5], 1 + x * 6, 26 + y * 7, 6, 7);
        p.r('#d8b040', 0, 60, 32, 2); return;
      }
      if (v === 'futon') {   // a low mattress on slats
        p.r(woodL, 0, 22, 32, 42); for (let y = 24; y < 64; y += 4) p.r(woodD, 0, y, 32, 1);
        box(p, 2, 24, 28, 38, '#3a3a44'); box(p, 4, 26, 24, 7, '#e8e0c8'); box(p, 2, 38, 28, 24, '#c8443a'); p.r('#e85a4a', 2, 38, 28, 2); return;
      }
      const c = { blue: '#5a7aaa', pink: '#d8789a', green: '#6a9a5a', sage: '#5a7a6a' }[v];
      box(p, 0, 10, 32, 12, woodD); line(p, wood, 2, 12, 28, 2);          // headboard
      box(p, 1, 18, 30, 44, '#f4f0e6');                                   // sheet
      box(p, 3, 20, 12, 7, '#ffffff'); box(p, 17, 20, 12, 7, '#ffffff');  // pillows
      box(p, 1, 30, 30, 32, c); p.r(shade(c, 0.2), 1, 30, 30, 3); p.r(shade(c, -0.15), 2, 38, 28, 1); p.r(shade(c, -0.15), 2, 48, 28, 1);
    },
  },
  single: {
    foot: [1, 2], tex: [18, 40], variants: ['green'],
    paint(p) {
      box(p, 0, 1, 18, 9, woodD); box(p, 1, 8, 16, 32, '#f4f0e6'); box(p, 3, 9, 12, 6, '#ffffff');
      box(p, 1, 17, 16, 23, '#6a9a5a'); p.r('#86b874', 1, 17, 16, 2);
    },
  },
  robe: {
    foot: [2, 1], tex: [32, 36], variants: ['louvre'],
    paint(p) {
      box(p, 0, 0, 32, 36, '#f4f4f0'); line(p, '#d8d8d2', 15, 2, 2, 32);
      for (let y = 3; y < 33; y += 2) { p.r('#e2e2dc', 2, y, 12, 1); p.r('#e2e2dc', 18, y, 12, 1); }
      p.r('#b8b8b0', 13, 16, 1, 4); p.r('#b8b8b0', 18, 16, 1, 4);
    },
  },

  bookshelf: {
    foot: [2, 1], tex: [32, 34], variants: ['oak', 'walnut', 'crates'],
    paint(p, v) {
      if (v === 'crates') {   // stacked milk crates, two by three
        const cc = ['#2a6ab0', '#e8c030', '#c8302a'];
        for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) {
          const x = k * 16, y = 1 + r * 11, c = cc[(r + k) % 3];
          box(p, x, y, 16, 11, c); p.r('#2a2420', x + 2, y + 2, 12, 7);
          for (let i = 0; i < 4; i++) p.r(['#f4efe0', '#3f8a3e', '#e77fb8', '#c8443a'][(i + r) % 4], x + 3 + i * 3, y + 3, 2, 6);
          p.r(shade(c, 0.2), x + 3, y + 1, 10, 1);
        }
        return;
      }
      if (v === 'walnut') {   // glass doors, brass handles
        box(p, 0, 0, 32, 34, '#4a2a14'); p.r('#6a3a1a', 0, 0, 32, 2);
        for (let sh = 0; sh < 3; sh++) { const y = 4 + sh * 9; p.r('#2a1608', 3, y, 26, 8); for (let i = 0; i < 8; i++) p.r(['#7a1e2a', '#1e3a5a', '#2a4a2a', '#d8b060'][(i + sh) % 4], 4 + i * 3, y + 1, 2, 7); }
        p.r('rgba(200,230,255,0.25)', 3, 4, 12, 26); p.r('rgba(200,230,255,0.25)', 17, 4, 12, 26); p.r('rgba(255,255,255,0.5)', 5, 6, 1, 20); p.r('rgba(255,255,255,0.5)', 19, 6, 1, 20);
        p.r('#4a2a14', 15, 3, 2, 28); p.r('#e8c040', 13, 16, 1, 3); p.r('#e8c040', 18, 16, 1, 3);
        return;
      }
      box(p, 0, 0, 32, 34, woodD); for (let s = 0; s < 3; s++) {
        const y = 3 + s * 10; p.r('#3a2412', 2, y, 28, 8);
        for (let i = 0; i < 9; i++) p.r(['#c8443a', '#2f6aa3', '#e8c030', '#3f8a3e', '#e77fb8', '#f4efe0'][(i + s * 2) % 6], 3 + i * 3, y + 1 + (i % 3 === 0 ? 1 : 0), 2, 7 - (i % 3 === 0 ? 1 : 0));
      }
    },
  },
  bath: {
    foot: [3, 1], tex: [48, 22], variants: ['beige'],
    paint(p) {
      box(p, 0, 2, 48, 20, '#e8dcc4'); p.r('#d8c8a8', 3, 5, 42, 12); p.r('#c8b898', 3, 5, 42, 2); p.r('#efe4cc', 6, 9, 14, 2);
      p.r('#b8bcc4', 4, 3, 3, 3); p.r('#2a2a2a', 0, 0, 1, 2); p.r('#2a2a2a', 0, 0, 48, 1); // shower curtain rail
    },
  },

  // The bath along a wall, end on.
  bathv: {
    foot: [1, 3], tex: [16, 54], variants: ['beige'],
    paint(p) {
      box(p, 0, 4, 16, 50, '#e8dcc4'); p.r('#d8c8a8', 3, 8, 10, 42); p.r('#c8b898', 3, 8, 2, 42); p.r('#efe4cc', 8, 14, 2, 14);
      p.r('#b8bcc4', 6, 5, 4, 3); p.r('#2a2a2a', 15, 0, 1, 54);   // tap, and the shower curtain rail
    },
  },
  vanity: {
    foot: [1, 1], tex: [16, 30], variants: ['white'],
    paint(p) {
      box(p, 2, 0, 12, 10, '#c4dae2'); p.r('#e8f4f8', 3, 1, 4, 6);                    // mirror
      box(p, 0, 16, 16, 14, '#f4f4f0'); p.r('#c8c8c0', 2, 21, 12, 1); p.r('#9a9a92', 5, 19, 6, 1); p.r('#9a9a92', 5, 25, 6, 1);
      box(p, 0, 14, 16, 3, '#ffffff');
      box(p, 3, 10, 10, 5, '#ffffff'); p.r('#e4ecee', 4, 11, 8, 2);                  // vessel basin
      p.r('#b8bcc4', 7, 8, 2, 3); p.r('#3f8a3e', 13, 11, 2, 3);
    },
  },

  toilet: {
    foot: [1, 1], tex: [16, 22], variants: ['white'],
    paint(p) { box(p, 3, 0, 10, 8, '#f4f4f0'); box(p, 2, 8, 12, 9, '#f4f4f0'); p.r('#dfe6e8', 4, 10, 8, 5); box(p, 4, 17, 8, 5, '#e8e8e2'); },
  },
  washer: {
    foot: [1, 1], tex: [16, 22], variants: ['white'],
    paint(p) { box(p, 0, 2, 16, 20, '#f4f4f0'); p.r('#c9ccd2', 1, 3, 14, 3); p.blob(8, 13, 5, '#8a8d94'); p.blob(8, 13, 4, '#7fa6c8'); p.r('#c4e0f0', 6, 11, 2, 2); },
  },
  plant: {
    foot: [1, 1], tex: [16, 28], variants: ['fern', 'fiddle', 'monstera', 'bird', 'lemon', 'lily', 'ivy', 'cactus'],
    paint(p, v) {
      const pot = { monstera: '#e8e4dc', bird: '#3a3a44', lemon: '#c8743a', lily: '#f4f0e6', ivy: '#5a8ab8', cactus: '#d88a5a' }[v] || '#c8743a';
      if (v === 'ivy') { box(p, 3, 8, 10, 7, pot); p.r(shade(pot, 0.2), 3, 8, 10, 1); p.r('#e8e4dc', 7, 0, 2, 8);   // hanging pot, trailing vines
        for (const [x, n] of [[3, 12], [6, 10], [10, 13], [12, 9]]) for (let i = 0; i < n; i++) { p.r('#3f8a3e', x + (i % 2), 14 + i, 1, 1); if (i % 3 === 1) p.r('#8ac85a', x - 1, 14 + i, 2, 2); }
        p.blob(8, 8, 4, '#4f9e46'); return; }
      box(p, 4, 20, 8, 8, pot); p.r(shade(pot, 0.2), 4, 20, 8, 1);
      if (v === 'monstera') { p.r('#3a5a2a', 7, 12, 2, 8); [[4, 7], [11, 6], [7, 2], [3, 13], [12, 12]].forEach(([x, y]) => { p.blob(x, y + 2, 3.5, '#2a7a3a'); p.r('#f4efe0', x - 1, y + 1, 1, 2); p.r('#f4efe0', x + 1, y + 3, 1, 1); }); return; }
      if (v === 'bird') { for (const [x, h] of [[5, 16], [8, 19], [11, 14]]) { p.r('#3a6a2a', x, 20 - h + 6, 1, h - 6); p.r('#3f8a3e', x - 1, 20 - h, 3, 7); p.r('#57a84a', x - 1, 20 - h, 1, 6); }
        p.r('#f08a1e', 9, 4, 4, 2); p.r('#3a5ab8', 12, 3, 2, 1); p.r('#f08a1e', 10, 2, 2, 2); return; }
      if (v === 'lemon') { p.r('#5e3a1a', 7, 12, 2, 8); p.blob(8, 9, 6, '#2f7a37'); p.blob(6, 7, 3, '#3f8a3e'); [[5, 9], [10, 6], [11, 11], [7, 4]].forEach(([x, y]) => { p.r('#f5d63a', x, y, 2, 2); p.r('#fff4a0', x, y, 1, 1); }); return; }
      if (v === 'lily') { for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.4; for (let r = 0; r < 8; r++) p.r('#2f6a2f', 8 + Math.cos(a) * r * 0.9, 19 + Math.sin(a) * r * 1.4, 2, 2); }
        p.r('#f4f4f0', 5, 6, 2, 4); p.r('#f4f4f0', 10, 4, 2, 4); p.r('#f0e080', 5, 7, 1, 2); p.r('#f0e080', 10, 5, 1, 2); return; }
      if (v === 'cactus') { p.r('#3f8a3e', 6, 6, 4, 14); p.r('#57a84a', 6, 6, 1, 14); p.r('#3f8a3e', 2, 10, 4, 3); p.r('#3f8a3e', 2, 7, 2, 4); p.r('#3f8a3e', 10, 12, 4, 2); p.r('#3f8a3e', 12, 9, 2, 4);
        for (let y = 7; y < 19; y += 3) p.r('#f4efe0', 9, y, 1, 1); p.r('#e2306a', 7, 4, 2, 2); return; }
      if (v === 'fiddle') { p.r('#5e3a1a', 7, 8, 2, 12); [[4, 6], [10, 4], [5, 12], [11, 10], [8, 1]].forEach(([x, y]) => { p.blob(x, y + 2, 3, '#2f7a37'); p.r('#4f9e46', x - 1, y + 1, 2, 1); }); }
      else for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.45; for (let r = 0; r < 9; r++) p.r(r % 2 ? '#3f8a3e' : '#57a84a', 8 + Math.cos(a) * r, 19 + Math.sin(a) * r * 1.4, 2, 2); }
    },
  },
  floorlamp: {
    foot: [1, 1], tex: [16, 30], variants: ['brass', 'crystal', 'arc', 'lava', 'paper'],
    paint(p, v) {
      if (v === 'crystal') { p.r('#d8d8e0', 7, 8, 2, 20); p.r('#b8b8c8', 4, 27, 8, 2); p.r('#f4f0e6', 3, 1, 10, 7);
        for (let x = 3; x < 13; x += 2) { p.r('#c8e8f8', x, 8, 1, 3 + (x % 4)); p.r('#ffffff', x, 8 + (x % 4), 1, 1); } p.r('#f0a0d0', 4, 12, 1, 1); p.r('#a0e0f0', 11, 13, 1, 1); return; }
      if (v === 'arc') { p.r('#3a3a44', 0, 26, 7, 3); p.r('#c8ccd4', 3, 7, 2, 19); p.r('#e8ecf0', 3, 7, 1, 19);   // marble base, chrome pole
        [[4, 6], [5, 5], [6, 4], [7, 3], [8, 3], [9, 3], [10, 3], [11, 4], [12, 4]].forEach(([x, y]) => p.r('#c8ccd4', x, y, 2, 2));
        p.r('#8a8e98', 10, 6, 6, 3); p.r('#f4f0c8', 11, 9, 4, 1); return; }
      if (v === 'lava') { p.r('#8a8e98', 5, 24, 6, 5); p.r('#8a8e98', 6, 4, 4, 3); p.r('#6a3ab8', 5, 7, 6, 17); p.r('#f0508a', 7, 10, 3, 4); p.r('#f0508a', 6, 17, 4, 3); p.r('#ff8ab8', 7, 10, 1, 1); p.r('#c8ccd4', 5, 28, 6, 1); return; }
      if (v === 'paper') { p.r('#3a2a20', 7, 12, 2, 16); p.r('#3a2a20', 4, 27, 8, 2); p.blob(8, 7, 6, '#f8f4e8'); for (let y = 3; y < 12; y += 2) p.r('#e8e0c8', 3, y, 10, 1); p.r('#ffffff', 5, 4, 2, 2); return; }
      p.r('#b08a3a', 7, 8, 2, 20); p.r('#8a6a2a', 4, 27, 8, 2); p.r('#f4e8c8', 3, 1, 10, 8); p.r('#e8d8a8', 3, 7, 10, 1);
    },
  },
  boxes: {
    foot: [1, 1], tex: [16, 24], variants: ['stack', 'open'],
    paint(p, v) {
      const c = '#c8a070';
      box(p, 1, 12, 14, 12, c); p.r('#a8804e', 1, 12, 14, 1); p.r('#e8d8b8', 4, 16, 8, 3);
      if (v === 'stack') { box(p, 2, 3, 12, 10, shade(c, 0.08)); p.r('#a8804e', 7, 3, 2, 10); p.r('#3a2412', 4, 7, 5, 1); }
      else { p.r('#a8804e', 0, 9, 4, 4); p.r('#a8804e', 12, 9, 4, 4); p.r('#f4efe0', 4, 9, 4, 4); p.r('#5a7aaa', 8, 10, 3, 3); }
    },
  },
  ladder: {
    foot: [1, 1], tex: [16, 32], variants: ['alu'],
    paint(p) {
      p.r('#b8bcc4', 2, 2, 2, 30); p.r('#b8bcc4', 12, 2, 2, 30); p.r('#8e939b', 4, 2, 8, 2);
      for (let y = 8; y < 30; y += 6) p.r('#c9ccd2', 4, y, 8, 2);
      p.r('#e8e4d8', 5, 4, 6, 3); // paint tin on top
    },
  },
  paint: {
    foot: [1, 1], tex: [16, 14], variants: ['tins'],
    paint(p) {
      box(p, 1, 4, 6, 9, '#e8e4d8'); p.r('#7fa6c8', 1, 4, 6, 2); box(p, 8, 6, 6, 7, '#e8e4d8'); p.r('#e8b060', 8, 6, 6, 2);
      p.r('#3a2a20', 10, 1, 1, 5); p.r('#7fa6c8', 9, 0, 4, 2);
    },
  },
  toolbox: {
    foot: [1, 1], tex: [16, 12], variants: ['red'],
    paint(p) { box(p, 1, 4, 14, 8, '#c8443a'); p.r('#9a3028', 1, 7, 14, 1); p.r('#2a2a2a', 5, 1, 6, 1); p.r('#2a2a2a', 5, 1, 1, 3); p.r('#2a2a2a', 10, 1, 1, 3); },
  },
  // Tradies' gear for the unbuilt kitchen
  sawhorse: {
    foot: [2, 1], tex: [32, 22], variants: ['timber'],
    paint(p) {
      box(p, 1, 6, 30, 4, '#c8a060');                                    // the beam, with a length of pine on it
      for (const x of [3, 25]) { p.r('#a87a3a', x, 10, 2, 12); p.r('#a87a3a', x + 3, 10, 2, 12); }
      box(p, 4, 2, 22, 4, '#e0c088'); p.r('#c8443a', 12, 3, 4, 1);     // pencil mark
    },
  },
  bucket: {
    foot: [1, 1], tex: [16, 16], variants: ['plaster'],
    paint(p) { box(p, 3, 5, 10, 10, '#f4f4f0'); p.r('#c8ccd0', 3, 5, 10, 2); p.r('#d8d4cc', 4, 6, 8, 1); p.r('#3a3a3a', 3, 2, 10, 1); p.r('#3a3a3a', 3, 2, 1, 4); p.r('#3a3a3a', 12, 2, 1, 4); p.r('#2f6aa3', 5, 9, 6, 3); },
  },
  campstove: {
    foot: [2, 1], tex: [32, 26], variants: ['trestle'],
    paint(p) {
      box(p, 0, 10, 32, 4, '#d8d4cc'); p.r('#8e939b', 2, 14, 2, 12); p.r('#8e939b', 28, 14, 2, 12);    // trestle table
      box(p, 3, 5, 12, 5, '#2a2a30'); p.r('#5a5d64', 5, 6, 3, 2); p.r('#5a5d64', 10, 6, 3, 2);         // two-burner gas stove
      p.r('#c8443a', 18, 3, 5, 7); p.r('#e2705f', 19, 4, 2, 1); p.r('#f4efe0', 25, 6, 5, 4); p.r('#6b4226', 26, 7, 2, 2);  // kettle, mug
    },
  },
  esky: {
    foot: [1, 1], tex: [16, 14], variants: ['blue'],
    paint(p) { box(p, 1, 5, 14, 9, '#2f6aa3'); box(p, 1, 3, 14, 3, '#f4f4f0'); p.r('#c8ccd0', 6, 1, 4, 2); },
  },
  desk: {
    foot: [2, 1], tex: [32, 28], variants: ['oak'],
    paint(p) {
      box(p, 0, 12, 32, 4, woodL); p.r(woodD, 1, 16, 2, 12); p.r(woodD, 29, 16, 2, 12); box(p, 20, 16, 10, 10, wood);
      box(p, 5, 2, 14, 10, '#2a2a30'); p.r('#7ab0d8', 6, 3, 12, 7); p.r('#b8d8f0', 7, 4, 4, 2); p.r('#2a2a30', 11, 12, 2, 1);   // monitor
      p.r('#f4efe0', 21, 9, 6, 3); p.r('#c8443a', 22, 8, 4, 1);                                                                   // papers
    },
  },
  dropsheet: {
    foot: [3, 2], tex: [48, 32], variants: ['splats'], solid: false, flat: true,
    paint(p) {
      p.r('#e8e0cc', 1, 1, 46, 30); p.r('#d8d0bc', 1, 10, 46, 1); p.r('#d8d0bc', 20, 1, 1, 30);
      [[8, 6, '#7fa6c8'], [30, 20, '#e8b060'], [14, 24, '#7fa6c8'], [38, 8, '#f4f4f0']].forEach(([x, y, c]) => p.blob(x, y, 2, c));
    },
  },
  petbed: {
    foot: [1, 1], tex: [18, 14], variants: ['pink', 'blue', 'purple', 'green', 'grey'], solid: false, flat: true,
    paint(p, v) {
      const c = { pink: '#e77fb8', blue: '#5a7aaa', purple: '#7a5a9a', green: '#6a9a5a', grey: '#8a8d94' }[v];
      p.blob(9, 7, 7, shade(c, -0.15)); p.blob(9, 8, 5, shade(c, 0.3)); p.r(c, 2, 3, 14, 2);
    },
  },
  cattree: {
    foot: [1, 1], tex: [16, 34], variants: ['beige'],
    paint(p) {
      p.r('#e0c89a', 6, 6, 4, 24); for (let y = 8; y < 30; y += 3) p.r('#c8b080', 6, y, 4, 1);
      box(p, 1, 2, 14, 5, '#c8b8a0'); box(p, 2, 18, 12, 4, '#c8b8a0'); box(p, 0, 29, 16, 5, '#c8b8a0');
      p.r('#e8b060', 12, 22, 2, 4); p.blob(13, 27, 1, '#e8b060'); // dangly toy
    },
  },
  iwindow: {
    foot: [2, 1], tex: [32, 16], variants: ['blind', 'curtain', 'frosted'], solid: false,
    paint(p, v) {
      box(p, 2, 0, 28, 14, '#f4f4f0');
      p.r(v === 'frosted' ? '#c8d8e0' : '#8ec4e4', 4, 2, 24, 10);
      if (v === 'frosted') { for (let i = 0; i < 8; i++) p.r('#dce8ee', 5 + i * 3, 3 + (i % 3), 2, 2); }
      else { p.r('#b8dcf0', 5, 6, 8, 2); p.r('#5a8a4a', 4, 9, 24, 3); }              // treetops outside
      p.r('#f4f4f0', 4, 7, 24, 1);
      if (v === 'blind') { p.r('#4a4a50', 4, 2, 24, 3); p.r('#5a5a62', 4, 2, 24, 1); }
      if (v === 'curtain') { p.r('#4a6a9a', 0, 0, 5, 16); p.r('#4a6a9a', 27, 0, 5, 16); p.r('#5a7aaa', 1, 0, 1, 16); p.r('#3a3a40', 0, 0, 32, 1); }
    },
  },
  trough: {
    foot: [1, 1], tex: [16, 26], variants: ['laundry'],
    paint(p) {
      box(p, 1, 10, 14, 16, '#f4f4f0'); p.r('#d8d8d2', 1, 15, 14, 1); p.r('#9a9a92', 3, 18, 1, 3);
      box(p, 0, 7, 16, 4, '#d0d4d8'); p.r('#a8b0b8', 2, 8, 12, 2);
      p.r('#b8bcc4', 5, 2, 1, 5); p.r('#b8bcc4', 10, 2, 1, 5); p.r('#b8bcc4', 5, 2, 3, 1); p.r('#b8bcc4', 10, 2, 3, 1);
    },
  },
  shelf: {
    foot: [1, 1], tex: [16, 16], variants: ['wall'], solid: false,
    paint(p) { box(p, 1, 2, 14, 12, '#f4f4f0'); p.r('#d8d8d2', 2, 7, 12, 1); p.r('#e77fb8', 3, 4, 3, 3); p.r('#5a7aaa', 9, 9, 4, 3); },
  },

  picture: {
    foot: [1, 1], tex: [16, 16], variants: ['dog', 'beach', 'family'], solid: false,
    paint(p, v) {
      box(p, 2, 2, 12, 10, woodD);
      const bg = { dog: '#f4e8d0', beach: '#9fd0ea', family: '#e8dcc0' }[v];
      p.r(bg, 3, 3, 10, 8);
      if (v === 'dog') { p.blob(8, 7, 3, '#f4f0e8'); p.r('#e8508a', 7, 4, 2, 1); p.r('#2a1a1a', 7, 7, 1, 1); }
      if (v === 'beach') { p.r('#e8d6a0', 3, 9, 10, 2); p.r('#f5d63a', 10, 4, 2, 2); }
      if (v === 'family') { p.r('#6b3f1f', 4, 5, 2, 2); p.r('#c8443a', 4, 7, 2, 3); p.r('#e8d8a8', 8, 5, 2, 2); p.r('#2f6aa3', 8, 7, 2, 3); p.r('#3a2a1a', 11, 6, 1, 1); p.r('#f4f0e8', 11, 8, 2, 2); }
    },
  },
  doormat: {
    foot: [1, 1], tex: [16, 12], variants: ['welcome'], solid: false, flat: true,
    paint(p) { p.r('#8a5a3a', 1, 2, 14, 8); p.r('#a8723c', 2, 3, 12, 6); p.r('#6b4226', 4, 5, 8, 1); },
  },

  // ---- The pet shop (THE LEASH YOU CAN DO, Laverton)
  shopshelf: {
    foot: [2, 1], tex: [32, 34], variants: ['treats', 'toys', 'gear'],
    paint(p, v) {
      box(p, 0, 0, 32, 34, '#e8e4dc');
      const goods = {
        treats: ['#c8823a', '#e8b060', '#c8443a', '#f5d63a', '#9fb8c8'],
        toys: ['#d8e83a', '#e77fb8', '#3a8ad0', '#f0a050', '#6aa83a'],
        gear: ['#c8443a', '#2a2a32', '#3a8ad0', '#6a3ab0', '#e8c040'],
      }[v];
      for (let s = 0; s < 3; s++) {
        const y = 3 + s * 10;
        p.r('#b8b4ac', 2, y + 8, 28, 1);
        for (let i = 0; i < 6; i++) {
          const c = goods[(i + s) % goods.length], x = 3 + i * 4 + (s % 2);
          if (v === 'toys' && i % 2) { p.blob(x + 1.5, y + 6, 1.6, c); continue; }
          if (v === 'gear') { p.r(c, x, y + 1, 1, 6); p.r(c, x + 1, y + 6, 2, 1); continue; }
          p.r(c, x, y + 2, 3, 6); p.r(shade(c, 0.3), x, y + 2, 3, 1); p.r('#f4f4f0', x + 1, y + 4, 1, 2);
        }
      }
      p.r('#c8443a', 4, 31, 24, 2); p.r('#f4f4f0', 6, 31, 4, 1);
    },
  },
  shopcounter: {
    foot: [3, 1], tex: [48, 26], variants: ['till'],
    paint(p) {
      box(p, 0, 10, 48, 16, '#7a5a3a'); p.r('#8a6a4a', 2, 14, 44, 1); p.r('#6a4a2a', 2, 20, 44, 1);
      box(p, 0, 7, 48, 4, '#e8e4dc');
      box(p, 30, 0, 12, 8, '#3a3a40'); p.r('#7ad0a0', 32, 2, 8, 3); p.r('#2a2a30', 31, 6, 10, 1);
      p.r('#c8823a', 6, 3, 6, 5); p.r('#e8b060', 6, 3, 6, 1);   // a jar of treats
      p.r('#f4f4f0', 16, 5, 8, 3); p.r('#c8443a', 17, 6, 6, 1);  // dog tags
    },
  },
  aquarium: {
    foot: [2, 1], tex: [32, 26], variants: ['tropical'],
    paint(p) {
      box(p, 0, 16, 32, 10, '#3a3a40');
      p.r('#2a2a30', 0, 2, 32, 15); p.r('#5ab0d8', 1, 3, 30, 13); p.r('#8ad0f0', 1, 3, 30, 2);
      p.r('#d8c890', 1, 13, 30, 3); p.r('#3a8a4a', 5, 7, 1, 7); p.r('#3a8a4a', 24, 8, 1, 6); p.r('#5aaa5a', 25, 9, 1, 4);
      for (const [x, y, c] of [[9, 7, '#f08020'], [17, 10, '#e8c040'], [13, 5, '#e05a8a']]) { p.r(c, x, y, 3, 2); p.r(c, x - 1, y, 1, 2); p.r('#1a1010', x + 2, y, 1, 1); }
      p.r('#ffffff', 28, 5, 1, 1); p.r('#ffffff', 27, 8, 1, 1);
    },
  },

  // ---- Little extras around the house
  cot: {
    foot: [1, 1], tex: [16, 26], variants: ['white', 'oak'],
    paint(p, v) {
      const c = v === 'oak' ? woodL : '#f4f2ec', d = shade(c, -0.2);
      box(p, 1, 12, 14, 12, '#e8eef8'); p.r('#b8d0f0', 2, 14, 12, 8); p.r('#f4f4f0', 3, 13, 5, 3);   // mattress, blanket, pillow
      p.r('#f0c8d8', 9, 16, 4, 4); p.r('#e8a0b8', 10, 17, 2, 2);   // a little toy
      for (let x = 1; x <= 14; x += 3) p.r(c, x, 8, 1, 16);
      p.r(c, 0, 6, 16, 2); p.r(d, 0, 22, 16, 2); p.r(c, 0, 6, 1, 20); p.r(c, 15, 6, 1, 20);
    },
  },
  toybox: {
    foot: [1, 1], tex: [16, 16], variants: ['red'],
    paint(p) {
      box(p, 1, 6, 14, 9, '#c8443a'); p.r('#e8705f', 2, 7, 12, 1); p.r('#f4d040', 6, 9, 4, 3);
      p.r('#3a8ad0', 3, 3, 3, 4); p.r('#6ab0f0', 3, 3, 3, 1);   // block poking out
      p.blob(11, 5, 2, '#e8c040'); p.r('#f4f4f0', 2, 5, 2, 1);
    },
  },
  // The Brunswick Bowls Club Newcomer's Cup, won off the old blokes: a gold cup on a little plinth.
  trophy: {
    foot: [1, 1], tex: [16, 24], variants: ['bowls'],
    paint(p) {
      p.shadow(8, 23, 12);
      box(p, 3, 15, 10, 8, wood); p.r(woodD, 4, 19, 8, 1); p.r('#d8c070', 6, 17, 4, 1);
      p.r('#c89a20', 6, 13, 4, 2); p.r('#c89a20', 7, 10, 2, 3);
      p.r('#e8b830', 3, 2, 10, 8); p.r('#f8d860', 4, 2, 3, 6); p.r('#b88a18', 11, 3, 2, 7);
      p.r('#e8b830', 1, 3, 2, 4); p.r('#e8b830', 13, 3, 2, 4); p.r('#b88a18', 1, 6, 1, 1); p.r('#b88a18', 14, 6, 1, 1);
      p.r('#3a2a10', 5, 6, 6, 1);
    },
  },
  sidetable: {
    foot: [1, 1], tex: [16, 18], variants: ['oak', 'marble', 'glass', 'cane', 'stump'],
    paint(p, v) {
      const lamp = () => { p.r('#f4f0e6', 5, 0, 6, 5); p.r('#e8e0c8', 5, 4, 6, 1); p.r('#8a7a5a', 7, 5, 2, 1); };
      if (v === 'marble') { p.r('#d8b040', 4, 9, 1, 8); p.r('#d8b040', 11, 9, 1, 8); p.r('#d8b040', 4, 15, 8, 1); box(p, 1, 6, 14, 3, '#f4f4f0'); p.r('#c8c8d0', 3, 7, 5, 1); p.r('#c8c8d0', 9, 6, 3, 1); lamp(); return; }
      if (v === 'glass') { p.r('#8a8e98', 2, 8, 1, 9); p.r('#8a8e98', 13, 8, 1, 9); box(p, 1, 6, 14, 2, '#5a6a7a'); p.r('rgba(90,106,122,0.6)', 2, 12, 12, 1); p.r('#ffffff', 3, 6, 3, 1); lamp(); return; }
      if (v === 'cane') { box(p, 2, 6, 12, 11, '#d8b878'); for (let y = 8; y < 16; y += 2) for (let x = 3; x < 13; x += 2) p.r('#a8884a', x + (y % 4 ? 1 : 0), y, 1, 1); lamp(); return; }
      if (v === 'stump') { box(p, 2, 6, 12, 11, '#8a4a2a'); p.r('#d8a870', 2, 6, 12, 3); p.r('#a87a4a', 5, 7, 6, 1); p.r('#6a3a1a', 4, 10, 1, 6); p.r('#6a3a1a', 10, 11, 1, 5); lamp(); return; }
      box(p, 2, 6, 12, 11, wood); p.r(woodD, 3, 11, 10, 1); p.r('#e8c040', 7, 8, 2, 1);
      p.r('#f4f0e6', 5, 0, 6, 5); p.r('#e8e0c8', 5, 4, 6, 1); p.r('#8a7a5a', 7, 5, 2, 1);   // lamp
    },
  },
  stool: {
    foot: [1, 1], tex: [16, 16], variants: ['oak'], solid: false,
    paint(p) { p.r(woodD, 4, 9, 1, 6); p.r(woodD, 11, 9, 1, 6); p.r(woodD, 5, 12, 6, 1); box(p, 3, 6, 10, 3, woodL); },
  },
  washbasket: {
    foot: [1, 1], tex: [16, 16], variants: ['wicker'],
    paint(p) {
      box(p, 2, 6, 12, 9, '#c8a870'); for (let y = 8; y < 14; y += 2) p.r('#a8884a', 3, y, 10, 1);
      p.r('#3a8ad0', 4, 4, 5, 3); p.r('#f4f4f0', 8, 5, 4, 2); p.r('#e77fb8', 6, 3, 2, 2);
    },
  },
};
