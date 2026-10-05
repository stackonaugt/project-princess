// Built-in art for Plenty Rd, Preston (at Bell St), from the owner's photos:
//   North side: the Stolberg Hotel (sage green corner pub, black blackletter
//   STOLBERG blade signs, a Carlton Draught sign on the roof), the Plenty & More
//   cafe with lime umbrellas, and Plenty Road Convenience (grey painted brick,
//   a hazard-striped parapet, SMOKES AMERICAN CONFECTIONARY VAPES).
//   South side: the grey building with the Aboriginal "meeting place" mural and
//   an undercroft car park, The Secondhand Man (charcoal brick), the brick
//   printers with a roller door, and Preston Wheels & Tyres (red, stepped).
// Plus the insides of Bunnings, Franco Cozzo, Anaconda and the convenience store.
// Same format as objects.js.
import { shade, outline, textWidth } from './painter.js';
import { bricks } from './laverton.js';
import { hash } from '../../util.js';

function box(p, x, y, w, h, c) {
  p.r(c, x, y, w, h); p.r(shade(c, 0.18), x, y, w, 1); p.r(shade(c, -0.22), x, y + h - 1, w, 1);
}
const centred = (p, s, cx, y, c) => p.text(s, Math.round(cx - textWidth(s) / 2), y, c);
function big(p, s, x, y, scale, c) { p.ctx.save(); p.ctx.translate(x, y); p.ctx.scale(scale, scale); p.text(s, 0, 0, c); p.ctx.restore(); }
function win(p, x, y, w, h, frame, glass = '#4a5a6a') { p.r(frame, x - 1, y - 1, w + 2, h + 2); p.r(glass, x, y, w, h); p.r(shade(glass, 0.3), x + 1, y + 1, 2, 2); }
const COLS = ['#c8443a', '#2f6aa3', '#e8c040', '#3a8a4a', '#f07ab0', '#6a3ab0', '#e8823a', '#3ab0b0', '#f4efe0'];

export const PLENTY = {
  stolberg: {
    foot: [10, 3], tex: [164, 96], variants: ['hotel'],
    paint(p) {
      const sx = 2, W = 160, H = 96, top = 26, sage = '#a8b098', sd = shade(sage, -0.15);
      // Carlton Draught sign on the roof
      p.r('#8a8e96', sx + 22, top - 18, 2, 18); p.blob(sx + 23, top - 20, 9, '#c8302a'); p.blob(sx + 23, top - 20, 7, '#1e3a8a'); p.r('#e8c040', sx + 18, top - 21, 10, 2);
      p.r(sage, sx, top, W, H - top - 1); p.r(sd, sx + W - 3, top, 3, H - top - 1);
      p.r(shade(sage, 0.15), sx, top, W, 2); p.r(sd, sx, top + 30, W, 3); p.r(shade(sage, 0.12), sx, top + 30, W, 1);   // string course
      for (let i = 0; i < 7; i++) win(p, sx + 10 + i * 21, top + 8, 10, 16, '#7a8270', i % 3 === 0 ? '#4a3a6a' : '#5a6a7a');
      for (let i = 0; i < 6; i++) win(p, sx + 8 + i * 25, top + 40, 18, 22, '#2a2e33', '#3a3048');
      p.r('#2a2a30', sx + W - 18, top + 40, 12, H - top - 41); p.r('#4a3a2a', sx + W - 17, top + 41, 10, H - top - 42);
      // black blackletter STOLBERG blade signs
      for (const x of [4, W - 30]) { p.r('#141416', sx + x, top + 2, 9, 34); p.r('#3a3a40', sx + x, top + 2, 1, 34); 'STOLBER'.split('').forEach((ch, i) => p.text(ch, sx + x + 3, top + 4 + i * 4.5, '#f4efe0')); }
      p.r('#f4efe0', sx + 64, top + 44, 18, 10); p.text('HAPPY', sx + 64, top + 45, '#6a3ab0');
      outline(p.ctx, 0, 0, 164, H);
    },
  },
  convenience: {
    foot: [5, 3], tex: [84, 76], variants: ['plenty'],
    paint(p) {
      const sx = 2, W = 80, H = 76, top = 10, g = '#7a7e84';
      bricks(p, sx, top, W, H - top - 1, g, 6);
      for (let x = 0; x < W; x += 6) { p.r(x % 12 ? '#e8c040' : '#1e1e22', sx + x, top, 6, 2); }   // hazard stripe on the parapet
      for (const x of [10, 34, 58]) win(p, sx + x, top + 8, 10, 14, '#5a5e64');
      // the white sign
      box(p, sx + 2, top + 28, W - 4, 14, '#f4f4f0'); p.r('#1e1e22', sx + 2, top + 28, W - 4, 1);
      centred(p, 'PLENTY ROAD', sx + 40, top + 30, '#1e1e22'); centred(p, 'CONVENIENCE', sx + 40, top + 36, '#1e1e22');
      p.r('#1e1e22', sx + 2, top + 42, W - 4, 6); p.text('SMOKES  LOLLIES  VAPES', sx + 5, top + 43, '#f4f4f0');
      // glass front full of colourful stock, the door
      p.r('#2a2e33', sx + 4, top + 50, 50, H - top - 52); p.r('#3a4048', sx + 5, top + 51, 48, H - top - 54);
      for (let s = 0; s < 2; s++) for (let i = 0; i < 11; i++) p.r(COLS[Math.floor(hash(i, s, 4) * COLS.length)], sx + 7 + i * 4, top + 53 + s * 6, 3, 4);
      p.r('#2a2e33', sx + 58, top + 50, 16, H - top - 51); p.r('#5a6a78', sx + 59, top + 51, 14, H - top - 52);
      p.r('#3a8a4a', sx + 47, top + 64, 4, 6);   // a neon leaf in the window
      outline(p.ctx, 0, 0, 84, H);
    },
  },
  plentycafe: {
    foot: [4, 3], tex: [64, 66], variants: ['more'],
    paint(p) {
      const sx = 0, W = 64, H = 66, top = 26;
      bricks(p, sx, top, W, H - top - 1, '#7a7e84', 9);
      box(p, sx + 1, top + 2, W - 2, 9, '#f4f4f0'); p.text('PLENTY', sx + 4, top + 4, '#3a8a4a'); p.text('& MORE', sx + 30, top + 4, '#1e1e22');
      p.r('#2a2e33', sx + 4, top + 14, W - 8, H - top - 16); p.r('#c8b898', sx + 5, top + 15, W - 10, H - top - 18);
      p.r('#f4f4f0', sx + 12, top + 18, 16, 6); p.r('#6a4a2a', sx + 34, top + 20, 20, 2);
      outline(p.ctx, 0, 0, 64, H);
    },
  },
  // A lime green cafe umbrella over a table and two wicker chairs. Walk-through-ish: it blocks one tile.
  umbrella: {
    foot: [1, 1], tex: [32, 36], variants: ['lime'],
    paint(p) {
      p.shadow(16, 35, 24);
      p.r('#8a8e96', 15, 8, 2, 26);
      for (let j = 0; j < 7; j++) p.r(j < 6 ? '#c8e040' : '#a8c020', 16 - (6 + j * 2), 2 + j, (6 + j * 2) * 2, 1);
      p.r('#6a4a2a', 9, 24, 14, 3); p.r('#5a3a1a', 11, 27, 2, 8); p.r('#5a3a1a', 19, 27, 2, 8);
      p.r('#8a6a42', 2, 26, 6, 8); p.r('#8a6a42', 24, 26, 6, 8);
    },
  },
  muralbuilding: {
    foot: [12, 3], tex: [196, 76], variants: ['meetingplace'],
    paint(p) {
      const sx = 2, W = 192, H = 76, top = 8;
      p.r('#8a8e94', sx, top, W, 26); for (let x = 0; x < W; x += 24) p.r('#6a7078', sx + x, top + 2, 22, 20);   // glazed upper floor
      p.r('#a8acb4', sx, top, W, 2);
      // the mural band: ochres, reds, blacks, with the words in white
      for (let x = 0; x < W; x++) { const v = hash(x, 3); p.r(v < 0.3 ? '#a8502a' : v < 0.55 ? '#c8843a' : v < 0.75 ? '#5a2a1a' : '#3a3a2a', sx + x, top + 26, 1, 18); }
      for (let i = 0; i < 14; i++) p.blob(sx + 8 + i * 13, top + 30 + Math.floor(hash(i, 9) * 10), 2, ['#6a9a3a', '#e8c040', '#f4efe0'][i % 3]);
      p.text('MANY MANY YEARS AGO SOME ELDERS DECIDED', sx + 10, top + 28, '#f4efe0');
      p.text('THEIR PEOPLE NEEDED A MEETING PLACE', sx + 16, top + 36, '#f4efe0');
      // the undercroft car park, with columns and a boom gate
      p.r('#2a2e33', sx, top + 44, W, H - top - 45);
      for (let x = 0; x < W; x += 32) p.r('#8a8e94', sx + x + 2, top + 44, 4, H - top - 45);
      for (const [x, c] of [[14, '#c8ccd0'], [46, '#3a6aa8'], [78, '#c8443a'], [112, '#e8e4dc']]) { p.r(c, sx + x, top + 56, 18, 8); p.r(shade(c, 0.3), sx + x + 3, top + 54, 12, 3); }
      p.r('#e8e4dc', sx + 150, top + 52, 2, 14); for (let x = 0; x < 30; x += 6) p.r(x % 12 ? '#c8302a' : '#f4f4f0', sx + 152 + x, top + 52, 6, 2);
      outline(p.ctx, 0, 0, 196, H);
    },
  },
  secondhandman: {
    foot: [6, 3], tex: [100, 64], variants: ['shop'],
    paint(p) {
      const sx = 2, W = 96, H = 64, top = 6;
      bricks(p, sx, top, W, H - top - 1, '#3a3c42', 8);
      p.r('#3a3c42', sx + 30, top - 4, 36, 5);
      centred(p, 'THE SECONDHAND MAN', sx + 48, top + 6, '#e8c8a0');
      p.r('#141416', sx + 6, top + 18, 28, H - top - 19); p.r('#5a4a3a', sx + 7, top + 19, 26, H - top - 20);   // open roller door, furniture inside
      p.r('#e8e0c8', sx + 10, top + 38, 18, 8); p.r('#8a5a32', sx + 12, top + 30, 8, 8);
      p.r('#141416', sx + 38, top + 20, 10, H - top - 21); p.r('#e8b0b8', sx + 39, top + 22, 8, H - top - 23);   // the pink door under a black awning
      p.r('#1e1e22', sx + 36, top + 16, 14, 4);
      for (const x of [54, 76]) { p.r('#1e1e22', sx + x - 1, top + 18, 18, 16); p.r('#c8ccd0', sx + x, top + 19, 16, 14); for (let i = 1; i < 4; i++) p.r('#1e1e22', sx + x + i * 4, top + 19, 1, 14); p.r('#1e1e22', sx + x, top + 26, 16, 1); }
      outline(p.ctx, 0, 0, 100, H);
    },
  },
  printers: {
    foot: [4, 3], tex: [64, 64], variants: ['brick'],
    paint(p) {
      const sx = 0, W = 64, H = 64, top = 10;
      bricks(p, sx, top, W, H - top - 1, '#a8603a', 3);
      p.r('#8a8e86', sx + 4, top - 6, 40, 10); centred(p, 'PRINTERS', sx + 24, top - 3, '#3a3a3a');
      p.r('#2a2e33', sx + 6, top + 14, 18, H - top - 15); p.r('#c8ccd0', sx + 7, top + 15, 16, H - top - 16);
      p.r('#2a2e33', sx + 34, top + 10, 26, H - top - 11); for (let j = 0; j < H - top - 12; j += 3) p.r(j % 6 ? '#b8bcc4' : '#9a9ea6', sx + 35, top + 11 + j, 24, 2);
      outline(p.ctx, 0, 0, 64, H);
    },
  },
  wheelstyres: {
    foot: [5, 3], tex: [84, 70], variants: ['preston'],
    paint(p) {
      const sx = 2, W = 80, H = 70, top = 18, red = '#c8302a';
      // stepped parapet
      p.r(red, sx, top, W, H - top - 1);
      for (let i = 0; i < 4; i++) p.r(red, sx + 10 + i * 6, top - 4 - i * 3, W - 20 - i * 12, 4 + i * 3);
      box(p, sx + 12, top + 4, 56, 12, '#f4f4f0'); centred(p, 'WHEELS & TYRES', sx + 40, top + 8, red);
      for (const x of [6, 50]) { p.r('#2a2e33', sx + x, top + 22, 24, H - top - 25); p.r('#5a6a78', sx + x + 1, top + 23, 22, H - top - 27); for (let i = 0; i < 3; i++) { p.blob(sx + x + 5 + i * 7, top + 34, 3, '#2a2a2a'); p.blob(sx + x + 5 + i * 7, top + 34, 1, '#c8ccd0'); } }
      p.r('#c8ccd0', sx + 33, top + 22, 12, H - top - 23);
      outline(p.ctx, 0, 0, 84, H);
    },
  },

  // ---- Insides
  bunshelf: {
    foot: [3, 1], tex: [48, 48], variants: ['tools', 'paint', 'garden'],
    paint(p, v) {
      p.r('#3a3e44', 0, 0, 3, 48); p.r('#3a3e44', 45, 0, 3, 48);
      for (let s = 0; s < 4; s++) {
        const y = 4 + s * 11;
        p.r('#e8643a', 0, y + 9, 48, 2);
        for (let i = 0; i < 6; i++) {
          const x = 4 + i * 7, c = COLS[(i + s * 2 + v.length) % COLS.length];
          if (v === 'paint') { p.r('#d8dce0', x, y + 3, 6, 6); p.r(c, x, y + 5, 6, 2); }
          else if (v === 'garden') { p.r('#8a4a2a', x, y + 5, 6, 4); p.blob(x + 3, y + 3, 3, i % 2 ? '#3f8a3e' : '#57a84a'); }
          else { p.r('#c8a070', x, y + 2, 6, 7); p.r(c, x + 1, y + 4, 4, 2); }
        }
      }
    },
  },
  planttable: {
    foot: [3, 1], tex: [48, 26], variants: ['natives'],
    paint(p) {
      box(p, 0, 12, 48, 4, '#8a8e96'); p.r('#5a5e66', 2, 16, 2, 10); p.r('#5a5e66', 44, 16, 2, 10);
      for (let i = 0; i < 7; i++) { p.r('#2a2a2a', 2 + i * 6, 8, 5, 5); p.blob(4 + i * 6, 5, 3, ['#3f8a3e', '#57a84a', '#c8443a', '#e77fb8', '#f5d63a'][i % 5]); }
    },
  },
  tent: {
    foot: [3, 2], tex: [48, 36], variants: ['orange', 'green'],
    paint(p, v) {
      const c = v === 'green' ? '#3a8a4a' : '#e8643a';
      p.shadow(24, 35, 46);
      for (let j = 0; j < 26; j++) { const half = Math.round(4 + j * 0.8); p.r(j < 3 ? shade(c, 0.2) : c, 24 - half, 8 + j, half * 2, 1); }
      p.r(shade(c, -0.35), 18, 22, 12, 12); p.r('#2a2a2a', 23, 22, 2, 12);
      p.r('#e8e4dc', 24, 8, 1, 26);
    },
  },
  kayakrack: {
    foot: [3, 1], tex: [48, 34], variants: ['kayaks'],
    paint(p) {
      p.r('#5a5e66', 2, 2, 3, 32); p.r('#5a5e66', 43, 2, 3, 32);
      for (let i = 0; i < 3; i++) { const c = ['#e8c040', '#c8302a', '#3ab0b0'][i]; p.r(c, 4, 5 + i * 9, 40, 6); p.r(shade(c, 0.3), 6, 5 + i * 9, 36, 1); p.r('#1e1e22', 20, 6 + i * 9, 8, 3); }
    },
  },
  rodrack: {
    foot: [2, 1], tex: [32, 44], variants: ['rods'],
    paint(p) {
      box(p, 0, 34, 32, 10, '#6a4a2a');
      for (let i = 0; i < 7; i++) { p.r('#2a2a2a', 3 + i * 4, 2 + (i % 2) * 3, 1, 34); p.r(COLS[i], 3 + i * 4, 26, 2, 3); }
    },
  },
  vapecase: {
    foot: [2, 1], tex: [32, 40], variants: ['glass'],
    paint(p) {
      box(p, 0, 0, 32, 40, '#2a2a30'); p.r('#3a4048', 2, 2, 28, 36);
      for (let s = 0; s < 5; s++) for (let i = 0; i < 7; i++) { const c = COLS[(i * 3 + s) % COLS.length]; p.r(c, 3 + i * 4, 4 + s * 7, 2, 5); p.r('#f4f4f0', 3 + i * 4, 4 + s * 7, 2, 1); }
      p.r('rgba(255,255,255,0.3)', 4, 3, 2, 34);
    },
  },
  candyshelf: {
    foot: [2, 1], tex: [32, 40], variants: ['usa'],
    paint(p) {
      box(p, 0, 0, 32, 40, '#e8e4dc'); p.r('#c8443a', 0, 0, 32, 4); p.text('USA', 10, 0, '#f4f4f0');
      for (let s = 0; s < 4; s++) { p.r('#b8b4ac', 2, 12 + s * 8, 28, 1); for (let i = 0; i < 6; i++) { const c = ['#e8823a', '#3a2a8a', '#c8302a', '#f5d63a', '#5a2a1a', '#2f6aa3'][(i + s) % 6]; p.r(c, 3 + i * 5, 6 + s * 8, 4, 6); } }
    },
  },
};
