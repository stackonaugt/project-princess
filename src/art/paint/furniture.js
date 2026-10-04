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
  couch: {
    foot: [3, 1], tex: [48, 28], variants: ['front', 'back'],
    paint(p, v) {
      const c = '#5a7a9a', d = shade(c, -0.22), l = shade(c, 0.18);
      if (v === 'back') {
        box(p, 0, 6, 48, 22, d); p.r(c, 2, 8, 44, 14); p.r(l, 3, 9, 42, 2);
        p.r(d, 0, 6, 5, 20); p.r(d, 43, 6, 5, 20);
        return;
      }
      box(p, 0, 2, 48, 14, d); p.r(c, 2, 4, 44, 10); p.r(l, 3, 4, 42, 2);   // backrest
      box(p, 2, 14, 44, 10, c); p.r(l, 3, 15, 42, 1); line(p, d, 16, 15, 1, 8); line(p, d, 31, 15, 1, 8);
      box(p, 0, 8, 5, 18, d); box(p, 43, 8, 5, 18, d);
      p.r('#f0c040', 6, 8, 7, 6); p.r('#e77fb8', 35, 8, 7, 6);            // cushions
    },
  },
  armchair: {
    foot: [1, 1], tex: [18, 22], variants: ['mustard'],
    paint(p) {
      const c = '#c89a3a', d = shade(c, -0.22);
      box(p, 1, 1, 16, 10, d); box(p, 2, 9, 14, 10, c); box(p, 0, 6, 4, 14, d); box(p, 14, 6, 4, 14, d);
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
    foot: [4, 3], tex: [64, 48], variants: ['red', 'blue', 'cream'], solid: false, flat: true,
    paint(p, v) {
      const c = { red: '#a8403a', blue: '#3a5a8a', cream: '#e4d4b4' }[v], d = shade(c, -0.2), l = shade(c, 0.25);
      p.r(c, 2, 2, 60, 44); p.r(d, 5, 5, 54, 38); p.r(c, 7, 7, 50, 34); p.r(l, 12, 12, 40, 24); p.r(c, 15, 15, 34, 18);
      for (let x = 4; x < 62; x += 3) { p.r(l, x, 0, 1, 2); p.r(l, x, 46, 1, 2); }
    },
  },
  bed: {
    foot: [2, 3], tex: [32, 56], variants: ['blue', 'pink', 'green', 'sage'],
    paint(p, v) {
      const c = { blue: '#5a7aaa', pink: '#d8789a', green: '#6a9a5a', sage: '#5a7a6a' }[v];
      box(p, 0, 2, 32, 12, woodD); line(p, wood, 2, 4, 28, 2);            // headboard
      box(p, 1, 10, 30, 44, '#f4f0e6');                                   // sheet
      box(p, 3, 12, 12, 7, '#ffffff'); box(p, 17, 12, 12, 7, '#ffffff');  // pillows
      box(p, 1, 22, 30, 32, c); p.r(shade(c, 0.2), 1, 22, 30, 3); p.r(shade(c, -0.15), 2, 30, 28, 1); p.r(shade(c, -0.15), 2, 40, 28, 1);
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
    foot: [2, 1], tex: [32, 34], variants: ['oak'],
    paint(p) {
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
    foot: [1, 1], tex: [16, 28], variants: ['fern', 'fiddle'],
    paint(p, v) {
      box(p, 4, 20, 8, 8, '#c8743a'); p.r('#e0904e', 4, 20, 8, 1);
      if (v === 'fiddle') { p.r('#5e3a1a', 7, 8, 2, 12); [[4, 6], [10, 4], [5, 12], [11, 10], [8, 1]].forEach(([x, y]) => { p.blob(x, y + 2, 3, '#2f7a37'); p.r('#4f9e46', x - 1, y + 1, 2, 1); }); }
      else for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.45; for (let r = 0; r < 9; r++) p.r(r % 2 ? '#3f8a3e' : '#57a84a', 8 + Math.cos(a) * r, 19 + Math.sin(a) * r * 1.4, 2, 2); }
    },
  },
  floorlamp: {
    foot: [1, 1], tex: [16, 30], variants: ['brass'],
    paint(p) { p.r('#b08a3a', 7, 8, 2, 20); p.r('#8a6a2a', 4, 27, 8, 2); p.r('#f4e8c8', 3, 1, 10, 8); p.r('#e8d8a8', 3, 7, 10, 1); },
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
};
