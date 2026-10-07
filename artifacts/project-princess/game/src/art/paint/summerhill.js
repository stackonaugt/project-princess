// Built-in art for Summerhill Shopping Centre, Reservoir (placeholder until
// the owner's photos arrive): the long low centre with its terracotta
// entrance tower and SUMMERHILL sign, the pylon sign by Plenty Rd, trolley
// bays, and inside: the supermarket, the specialty shops, the food court
// stalls and a coin-operated tram ride. Same format as objects.js.
// Also the Summerhill foes (SH_FOE_ART, merged into enemies.js) and present
// icons (SH_ITEM_ART, merged into items.js).
import { shade, outline, textWidth } from './painter.js';
import { bricks } from './laverton.js';
import { hash } from '../../util.js';

function box(p, x, y, w, h, c) {
  p.r(c, x, y, w, h); p.r(shade(c, 0.18), x, y, w, 1); p.r(shade(c, -0.22), x, y + h - 1, w, 1);
}
const centred = (p, s, cx, y, c) => p.text(s, Math.round(cx - textWidth(s) / 2), y, c);
function big(p, s, cx, y, scale, c) {
  const w = textWidth(s) * scale;
  p.ctx.save(); p.ctx.translate(Math.round(cx - w / 2), y); p.ctx.scale(scale, scale); p.text(s, 0, 0, c); p.ctx.restore();
}
function glass(p, x, y, w, h, frame = '#3a3e44', g = '#8ab4c8') {
  p.r(frame, x - 1, y - 1, w + 2, h + 2); p.r(g, x, y, w, h);
  p.r(shade(g, 0.35), x + 1, y + 1, Math.max(1, w >> 3), h - 2); p.r(shade(g, -0.15), x, y + h - 2, w, 2);
}
// Colourful stock on shelves seen through a window.
function stock(p, x, y, w, rows, seed, gap = 6) {
  const cols = ['#c8443a', '#2f6aa3', '#e8c040', '#3a8a4a', '#f07ab0', '#e8823a', '#f4efe0', '#6a3ab0'];
  for (let r = 0; r < rows; r++) {
    p.r('#c8ccd0', x, y + r * gap + 4, w, 1);
    for (let i = 0; i < w - 1; i += 3) p.r(cols[Math.floor(hash(i, r, seed) * cols.length)], x + i, y + r * gap, 2, 4);
  }
}
// A rising sun, the centre's logo.
function sun(p, cx, cy, r) {
  for (let a = 0; a < 7; a++) { const t = Math.PI * (a / 6); p.r('#f0b030', Math.round(cx + Math.cos(t) * (r + 3)) - 1, Math.round(cy - Math.sin(t) * (r + 3)) - 1, 2, 2); }
  p.blob(cx, cy, r, '#f0b030'); p.r('#f0b030', cx - r, cy, r * 2, 1);
  p.blob(cx, cy, r - 2, '#f8d050');
}

const CREAM = '#ecdcbc', TERRA = '#c8643a';

// The supermarket front: red COLES fascia, the windows full of stock, the
// checkouts and an open doorway in the middle. texW is the texture width.
function supermarket(p, texW) {
  const sx = 2, W = texW - 4, top = 4, base = 75;
  p.r(CREAM, sx, top, W, base - top);
  box(p, sx, top, W, 14, '#d8202a'); big(p, 'COLES', sx + W / 2, top + 2, 2, '#f4f4f0');
  p.r('#f4f4f0', sx, top + 14, W, 2);
  glass(p, sx + 3, top + 20, W - 6, 30, '#3a3e44', '#c8dce4');
  stock(p, sx + 6, top + 23, W - 12, 4, 21, 7);
  // checkouts either side of the open doorway
  const mid = sx + Math.round(W / 2), n = Math.max(2, Math.floor(W / 80));
  for (let i = 0; i < n; i++) for (const side of [-1, 1]) { const x = mid + side * (30 + i * 26) - (side < 0 ? 16 : 0); box(p, x, top + 52, 16, 12, '#4a4e56'); p.r('#1e1e22', x + 2, top + 50, 5, 4); p.r('#e8302a', x + 4, top + 51, 1, 1); }
  p.r('#d8d0c0', mid - 15, top + 50, 30, base - top - 50);
  p.r('#3a3e44', mid - 17, top + 50, 2, base - top - 50); p.r('#3a3e44', mid + 15, top + 50, 2, base - top - 50);
  if (W > 300) for (const x of [sx + 40, sx + W - 120]) { box(p, x, top + 2, 80, 10, '#f4f4f0'); big(p, x < mid ? 'FRESH' : 'DOWN DOWN', x + 40, top + 4, 1, '#d8202a'); }
  p.r(shade(CREAM, -0.2), sx, base - 3, W, 3);
  outline(p.ctx, 0, 0, texW, 76);
}

export const SUMMERHILL = {
  // The centre from the car park, from the owner's photo: two wings of
  // specialty shops under brown zigzag roofs with deep eaves, and the taller
  // flat-roofed supermarket block in the middle with its big red sign
  // (sliding doors at footprint columns 12-13).
  summerhillcentre: {
    foot: [26, 5], tex: [420, 132], variants: ['front'], lined: true,
    paint(p) {
      const H = 132, base = H - 1, eave = 70, roofTop = 34;
      const wings = [[2, 150, [['AUSTRALIA POST', '#d8202a', '#f4efe0'], ['GIFTS', '#f4f4f0', '#3a3a44'], ['CAFE', '#2a2a30', '#e8c040']]],
        [270, 418, [['CHEMIST', '#3a9a5a', '#f4efe0'], ['NEWS', '#2f6aa3', '#f4efe0'], ['$2 SHOP', '#d8202a', '#f8d050']]]];
      for (const [x0, x1, signs] of wings) {
        // shopfronts in the shade of the eaves
        p.r('#3a3a40', x0, eave, x1 - x0, base - eave);
        const bay = (x1 - x0) / 3;
        for (let i = 0; i < 3; i++) {
          const bx = Math.round(x0 + i * bay);
          glass(p, bx + 6, eave + 22, Math.round(bay) - 12, base - eave - 26, '#26262a', '#8aa4b0');
          stock(p, bx + 9, eave + 26, Math.round(bay) - 18, 3, 50 + i + x0, 8);
          const [t, bg, fg] = signs[i];
          if (t === 'AUSTRALIA POST') { box(p, bx + bay / 2 - 20, eave + 5, 40, 15, bg); centred(p, 'AUSTRALIA', bx + bay / 2, eave + 7, fg); centred(p, 'POST', bx + bay / 2, eave + 13, fg); }
          else { box(p, bx + bay / 2 - 18, eave + 8, 36, 9, bg); centred(p, t, bx + bay / 2, eave + 10, fg); }
          p.r('#1e1e22', bx, eave, 3, base - eave);   // dark posts
        }
        // the folded zigzag roof
        const gw = 37;
        for (let gx = x0; gx < x1; gx += gw) {
          const w = Math.min(gw, x1 - gx);
          for (let j = 0; j <= eave - 8 - roofTop; j++) {
            const half = Math.round((j / (eave - 8 - roofTop)) * w / 2), cx = gx + w / 2;
            p.r('#b8a48a', cx - half, roofTop + j, half, 1);
            p.r('#8a7864', cx, roofTop + j, half, 1);
          }
          p.r('#d8c8b0', gx + w / 2 - 1, roofTop, 2, 2);
        }
        p.r('#a8967e', x0, eave - 8, x1 - x0, 3);
        p.r('#6a5a4a', x0, eave - 5, x1 - x0, 6); p.r('#4a3e34', x0, eave + 1, x1 - x0, 2);
      }
      // the supermarket block in the middle
      const cx0 = 150, cx1 = 270, mid = 210;
      p.r('#e4e0d8', cx0, 22, cx1 - cx0, base - 22); p.r('#c8c4bc', cx1 - 4, 22, 4, base - 22);
      p.r('#7a6a5a', cx0 - 8, 8, cx1 - cx0 + 16, 14); p.r('#9a8a78', cx0 - 8, 8, cx1 - cx0 + 16, 2); p.r('#4a3e34', cx0 - 8, 22, cx1 - cx0 + 16, 2);
      centred(p, 'SUMMERHILL SHOPPING CENTRE', mid, 13, '#f4efe0');
      box(p, mid - 34, 32, 68, 26, '#d8202a'); big(p, 'COLES', mid, 37, 2, '#f4f4f0');
      centred(p, 'SUPERMARKETS', mid, 50, '#f8d8d8');
      // the entrance: canopy, sliding doors, glass either side
      p.r('#3a3e44', mid - 40, 78, 80, 5); p.r('#5a5e66', mid - 40, 78, 80, 1);
      glass(p, mid - 18, 86, 36, base - 87, '#2a2e33', '#a8d0e0');
      p.r('#2a2e33', mid - 1, 86, 2, base - 87);
      p.r('#f4efe0', mid - 13, 100, 8, 3); p.r('#f4efe0', mid + 5, 100, 8, 3);
      for (const gx of [cx0 + 6, mid + 24]) { glass(p, gx, 88, 30, base - 92, '#2a2e33', '#9ab8c8'); stock(p, gx + 3, 92, 24, 3, gx, 8); }
      p.r('#e8c040', cx0 + 4, 64, 8, 12); p.r('#2a2a30', cx0 + 7, 76, 2, 8);   // a yellow donation bin
      outline(p.ctx, 0, 0, 420, H);
    },
  },
  // The yellow pedestrian crossing sign (a walking figure in a diamond).
  pedsign: {
    foot: [1, 1], tex: [16, 36], variants: ['yellow'],
    paint(p) {
      p.shadow(8, 35, 8);
      p.r('#8a8e96', 7, 12, 2, 23);
      for (let j = 0; j < 7; j++) p.r('#f0c020', 8 - j - 1, 1 + j, (j + 1) * 2, 1);
      for (let j = 0; j < 6; j++) p.r('#f0c020', 8 - (6 - j), 8 + j, (6 - j) * 2, 1);
      p.r('#1e1e22', 7, 4, 2, 2); p.r('#1e1e22', 7, 6, 2, 3); p.r('#1e1e22', 6, 9, 1, 2); p.r('#1e1e22', 9, 9, 1, 2);
    },
  },
  // The big pylon sign by Plenty Rd, with the tenants listed underneath.
  pylonsign: {
    foot: [2, 1], tex: [36, 100], variants: ['summerhill'], lined: true,
    paint(p) {
      p.shadow(18, 99, 26);
      p.r('#6a6e76', 8, 70, 4, 29); p.r('#6a6e76', 24, 70, 4, 29);
      box(p, 2, 2, 32, 30, TERRA); sun(p, 18, 15, 5);
      centred(p, 'SUMMER', 18, 18, '#f4efe0'); centred(p, 'HILL', 18, 24, '#f4efe0');
      [['COLES', '#d8202a', '#f4efe0'], ['POST', '#d8202a', '#f4efe0'], ['CHEMIST', '#f4f4f0', '#3a9a5a'], ['NEWS', '#2f6aa3', '#f4efe0'], ['BREAD', '#e8c040', '#8a3a1a'], ['$2', '#c8302a', '#f8d050']].forEach(([s, bg, fg], i) => {
        box(p, 2, 33 + i * 7, 32, 7, bg); centred(p, s, 18, 34 + i * 7, fg);
      });
      outline(p.ctx, 0, 0, 36, 100);
    },
  },
  // A trolley bay: a little roof, a sign and nested trolleys.
  trolleybay: {
    foot: [3, 1], tex: [52, 36], variants: ['bay'],
    paint(p) {
      p.shadow(26, 35, 46);
      p.r('#8a8e96', 4, 6, 2, 29); p.r('#8a8e96', 46, 6, 2, 29);
      p.r('#c8302a', 2, 3, 48, 5); p.r(shade('#c8302a', 0.25), 2, 3, 48, 1);
      centred(p, 'TROLLEYS', 26, 4, '#f4efe0');
      for (let i = 0; i < 6; i++) {
        const x = 7 + i * 6;
        p.r('#9aa0a8', x, 20, 10, 8); for (let j = 1; j < 10; j += 2) p.r('#cfd4da', x + j, 21, 1, 6);
        p.r('#c8302a', x, 18, 3, 2);
      }
      p.r('#1e1e1e', 8, 30, 3, 2); p.r('#1e1e1e', 42, 30, 3, 2);
    },
  },

  // ---- Inside
  // The supermarket front: green fascia, glass, aisles and checkouts behind.
  supermarket: {
    foot: [9, 3], tex: [148, 76], variants: ['fresh'], lined: true,
    paint(p) { supermarket(p, 148); },
  },
  // Coles right across the back wall of the centre (the owner's note).
  colesfront: {
    foot: [42, 3], tex: [676, 76], variants: ['wide'], lined: true,
    paint(p) { supermarket(p, 676); },
  },
  // Specialty shops along the concourse. Each variant has its own fascia and window.
  mallshop: {
    foot: [5, 3], tex: [84, 68], variants: ['chemist', 'news', 'hotbread', 'twodollar', 'hair', 'bakers', 'cafe'], lined: true,
    paint(p, v) {
      const sx = 2, W = 80, top = 4, base = 67;
      const look = {
        chemist: ['#3a9a5a', 'CHEMIST', '#f4efe0'], news: ['#2f6aa3', 'NEWSAGENCY', '#f4efe0'], hotbread: ['#e8c040', 'HOT BREAD', '#8a3a1a'],
        twodollar: ['#c8302a', 'EVERYTHING $2', '#f8d050'], hair: ['#2a2a30', 'CURL UP & DYE', '#f07ab0'],
        bakers: ['#6a2a1a', 'BAKERS DELIGHT', '#f8d878'], cafe: ['#2a3a2a', 'CAFE CREMA', '#f4efe0'],
      }[v];
      p.r(CREAM, sx, top, W, base - top);
      box(p, sx, top, W, 12, look[0]); centred(p, look[1], sx + W / 2, top + 4, look[2]);
      glass(p, sx + 3, top + 16, W - 6, 26, '#3a3e44', '#d0e0e8');
      if (v === 'chemist') {
        stock(p, sx + 6, top + 18, W - 12, 3, 31, 8);
        p.r('#3a9a5a', sx + W - 14, top + 1, 9, 3); p.r('#3a9a5a', sx + W - 11, top - 2, 3, 9);
      } else if (v === 'news') {
        for (let i = 0; i < 9; i++) for (let r = 0; r < 2; r++) p.r(['#c8302a', '#f4efe0', '#e8c040', '#2f6aa3', '#f07ab0'][(i + r * 2) % 5], sx + 6 + i * 8, top + 19 + r * 11, 6, 9);
        box(p, sx + 56, top + 46, 20, 9, '#e8c040'); centred(p, 'LOTTO', sx + 66, top + 48, '#c8302a');
      } else if (v === 'bakers') {   // loaves on the racks, scrolls in the cabinet
        for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) { const x = sx + 8 + i * 9, y = top + 20 + r * 8; p.r('#c8843a', x, y, 7, 5); p.r('#e8b060', x + 1, y, 5, 2); p.r('#8a4a1a', x + 2, y + 2, 1, 1); p.r('#8a4a1a', x + 4, y + 2, 1, 1); }
        box(p, sx + 4, top + 44, W - 8, 8, '#f4f4f0'); p.r('#d8e8f0', sx + 6, top + 45, W - 12, 5);
        for (let i = 0; i < 6; i++) p.blob(sx + 12 + i * 11, top + 48, 2.5, ['#c8843a', '#f07ab0', '#f8e0a0'][i % 3]);
      } else if (v === 'cafe') {   // a coffee machine, a cake cabinet and a chalkboard
        p.r('#c8ccd0', sx + 8, top + 20, 22, 14); p.r('#8a8e96', sx + 10, top + 22, 18, 3); p.r('#1e1e22', sx + 12, top + 27, 3, 5); p.r('#1e1e22', sx + 22, top + 27, 3, 5);
        p.r('#f4efe0', sx + 13, top + 31, 2, 2); p.r('#f4efe0', sx + 23, top + 31, 2, 2);
        for (let i = 0; i < 4; i++) p.r(['#f07ab0', '#8a4a1a', '#f8e0a0', '#e8302a'][i], sx + 38 + i * 9, top + 24, 7, 5);
        box(p, sx + 4, top + 44, 26, 10, '#1e2a1e'); p.text('FLAT', sx + 7, top + 46, '#f4efe0'); p.r('#f4efe0', sx + 7, top + 52, 12, 1);
        p.r('#6a4a2a', sx + 36, top + 46, 6, 6); p.r('#6a4a2a', sx + 60, top + 46, 6, 6);   // little tables out the front
      } else if (v === 'hotbread') {
        for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) p.blob(sx + 10 + i * 8, top + 21 + r * 8, 2.5, ['#d8923a', '#f0c070', '#f07ab0', '#c87a3a'][(i + r) % 4]);
        box(p, sx + 4, top + 44, W - 8, 8, '#f4f4f0'); p.r('#d8e8f0', sx + 6, top + 45, W - 12, 5);
        for (let i = 0; i < 6; i++) p.r(['#c8843a', '#f8e0a0'][i % 2], sx + 9 + i * 11, top + 47, 8, 3);
      } else if (v === 'twodollar') {
        stock(p, sx + 6, top + 18, W - 12, 3, 41, 8);
        box(p, sx + 4, top + 45, 24, 9, '#f8d050'); centred(p, 'ALL $2', sx + 16, top + 47, '#c8302a');
        for (let i = 0; i < 10; i++) p.r(['#f07ab0', '#e8c040', '#3ab0b0', '#c8302a'][i % 4], sx + 4 + i * 8, top + 15, 3, 3);
      } else {
        // a salon chair, a mirror and a hood dryer
        p.r('#f4f4f0', sx + 12, top + 19, 18, 14); p.r('#a8c8d8', sx + 13, top + 20, 16, 12);
        p.r('#c8302a', sx + 14, top + 33, 14, 6); p.r('#2a2a30', sx + 20, top + 39, 2, 3);
        p.blob(sx + 54, top + 24, 7, '#f07ab0'); p.r('#c8ccd0', sx + 53, top + 30, 2, 10);
        box(p, sx + 36, top + 45, 38, 8, '#f07ab0'); centred(p, 'WALK INS', sx + 55, top + 47, '#2a2a30');
      }
      if (!['hotbread', 'news', 'hair', 'bakers', 'cafe'].includes(v)) p.r('#d8d0c0', sx + 30, top + 44, 20, base - top - 44);
      p.r(shade(CREAM, -0.2), sx, base - 3, W, 3);
      outline(p.ctx, 0, 0, 84, 68);
    },
  },
  // Food court stalls: a menu board, a counter, a bain-marie.
  foodstall: {
    foot: [4, 2], tex: [68, 54], variants: ['dimsum', 'kebab', 'sushi', 'sandwich', 'boba', 'lincraft'], lined: true,
    paint(p, v) {
      const sx = 2, W = 64, top = 2, base = 53;
      const [c, name, fg] = { dimsum: ['#c8302a', 'DIM SUM', '#f8d050'], kebab: ['#e8823a', 'KEBABS', '#f4efe0'], sushi: ['#1e2a48', 'SUSHI', '#f4efe0'],
        sandwich: ['#3a8a3a', 'SANGA SHACK', '#f8d050'], boba: ['#f07ab0', 'BUBBLE TROUBLE', '#2a2a30'], lincraft: ['#7a3a8a', 'LINCRAFT', '#f4efe0'] }[v];
      box(p, sx, top, W, 10, c); centred(p, name, sx + W / 2, top + 3, fg);
      box(p, sx + 2, top + 11, W - 4, 14, '#1e1e22');
      for (let i = 0; i < 4; i++) { p.r(['#e8c040', '#f4efe0', '#e8823a', '#3a8a4a'][i], sx + 5 + i * 14, top + 13, 10, 6); p.r('#f4efe0', sx + 5 + i * 14, top + 20, 10, 1); }
      p.r(shade(c, -0.1), sx + 2, top + 25, W - 4, base - top - 26);
      box(p, sx, top + 30, W, 8, '#c8ccd0');
      if (v === 'dimsum') for (let i = 0; i < 5; i++) { p.blob(sx + 8 + i * 12, top + 32, 4, '#c8a060'); p.r('#f4efe0', sx + 6 + i * 12, top + 30, 5, 2); }
      else if (v === 'kebab') { p.r('#8a5a2e', sx + 10, top + 14, 6, 16); p.r('#a8703a', sx + 11, top + 15, 2, 14); for (let i = 0; i < 4; i++) p.r(['#e8302a', '#3a8a4a', '#f4efe0', '#e8c040'][i], sx + 24 + i * 9, top + 32, 7, 3); }
      else if (v === 'sandwich') for (let i = 0; i < 5; i++) { const x = sx + 6 + i * 12; p.r('#e8c070', x, top + 31, 9, 2); p.r(['#3a8a3a', '#e8302a', '#f8d050'][i % 3], x, top + 33, 9, 1); p.r('#e8c070', x, top + 34, 9, 2); }
      else if (v === 'lincraft') {
        // balls of yarn, a row of paint tins and a jar of googly eyes
        for (let i = 0; i < 4; i++) p.blob(sx + 8 + i * 7, top + 33, 3, ['#e8607a', '#5a9ad8', '#f8d050', '#6ac06a'][i]);
        for (let i = 0; i < 3; i++) { const x = sx + 38 + i * 8; p.r('#c8ccd0', x, top + 30, 6, 7); p.r(['#b8c8a8', '#f0c4c8', '#a8c8e0'][i], x, top + 32, 6, 3); }
        for (let i = 0; i < 3; i++) { p.r('#f4f4f0', sx + 6 + i * 16, top + 13, 4, 4); p.r('#1e1e22', sx + 7 + i * 16, top + 15, 2, 2); }
      }
      else if (v === 'boba') for (let i = 0; i < 6; i++) { const x = sx + 5 + i * 10; p.r(['#e8c8a0', '#c8a0e8', '#a0e8c8', '#f8b0c8'][i % 4], x, top + 30, 6, 8); p.r('#2a1a1a', x + 1, top + 35, 4, 2); p.r('#f4f4f0', x + 3, top + 27, 1, 4); }
      else for (let i = 0; i < 12; i++) { p.r('#f4f4f0', sx + 4 + i * 5, top + 32, 4, 3); p.r(['#e8823a', '#2a2a30', '#f07ab0'][i % 3], sx + 5 + i * 5, top + 32, 2, 1); }
      p.r(shade(c, -0.3), sx, base - 3, W, 3);
      outline(p.ctx, 0, 0, 68, 54);
    },
  },
  // A coin-operated ride: a little green and gold tram.
  kiddieride: {
    foot: [1, 1], tex: [20, 28], variants: ['tram'],
    paint(p) {
      p.shadow(10, 27, 18);
      p.r('#c8302a', 2, 20, 16, 6); p.r('#e85a4a', 2, 20, 16, 1); p.r('#e8c040', 13, 22, 3, 2);
      p.r('#2a6a3a', 3, 6, 14, 14); p.r('#3a8a4a', 3, 6, 14, 1); p.r('#e8c040', 3, 14, 14, 2);
      p.r('#a8d0e0', 5, 8, 4, 4); p.r('#a8d0e0', 11, 8, 4, 4);
      p.r('#3a3e44', 9, 2, 1, 4); p.r('#3a3e44', 7, 2, 5, 1);
      p.r('#f4efe0', 6, 17, 8, 2);
    },
  },
};

// ---- Foes (merged into FOE_ART). [width, height, paint]
export const SH_FOE_ART = {
  trolley: [16, 16, p => {
    p.r('#9aa0a8', 2, 4, 12, 7); for (let x = 3; x < 14; x += 2) p.r('#cfd4da', x, 5, 1, 5);
    p.r('#cfd4da', 2, 4, 12, 1); p.r('#c8302a', 0, 2, 4, 2); p.r('#8a8e96', 3, 3, 1, 2);
    p.r('#9aa0a8', 3, 11, 1, 2); p.r('#9aa0a8', 12, 11, 1, 2); p.r('#8a8e96', 3, 12, 10, 1);
    p.r('#1e1e1e', 2, 13, 3, 2); p.r('#1e1e1e', 11, 14, 3, 2);   // the wonky wheel sits low
    p.r('#ffffff', 5, 6, 2, 2); p.r('#ffffff', 9, 6, 2, 2); p.r('#1a1010', 6, 7, 1, 1); p.r('#1a1010', 9, 7, 1, 1);
    p.r('#1a1010', 5, 5, 2, 1); p.r('#1a1010', 9, 5, 2, 1); p.r('#1a1010', 7, 9, 2, 1);
  }],
  seagull: [16, 16, p => {
    const w = '#f4f4f0', g = '#b8c0c8', k = '#2a2a30';
    p.r(g, 1, 7, 4, 2); p.r(k, 0, 7, 2, 1);
    p.r(w, 3, 7, 8, 5); p.r(g, 3, 7, 6, 2); p.r(k, 3, 8, 2, 1); p.r(shade(w, -0.1), 4, 11, 7, 1);
    p.r(w, 9, 3, 4, 5); p.r(shade(w, 0.5), 10, 3, 2, 1);
    p.r('#e8a030', 13, 5, 3, 1); p.r('#c8302a', 14, 6, 1, 1);
    p.r('#1a1010', 11, 4, 1, 1); p.r('#e8c040', 11, 5, 1, 1);
    p.r('#e8823a', 6, 12, 1, 3); p.r('#e8823a', 9, 12, 1, 3); p.r('#e8823a', 5, 15, 3, 1); p.r('#e8823a', 8, 15, 3, 1);
    p.r('#e8c040', 14, 8, 1, 3);   // a stolen chip
  }],
};

// ---- Present icons (merged into ITEM_ART): 12x12 rows centred in 16x16.
export const SH_ITEM_ART = {
  timtams: { pal: { a: '#c8302a', b: '#e85a4a', k: '#6a1a12', c: '#5a3018', w: '#f4efe0' }, rows: [
    '............', '............', 'kkkkkkkkkkkk', 'kaaaaaaaaaak', 'kawwwwaaaaak', 'kaaaaaaccccb',
    'kabbbbbccccb', 'kaaaaaaccccb', 'kaaaaaaaaaak', 'kkkkkkkkkkkk', '............', '............'] },
  handcream: { pal: { a: '#f4efe0', b: '#e8b8c8', k: '#8a6a6a', c: '#c8c8d0' }, rows: [
    '....kkk.....', '....kck.....', '...kkkkk....', '...kaaak....', '...kabak....', '...kbbbk....',
    '...kabak....', '...kaaak....', '...kaaak....', '...kaaak....', '....kkk.....', '............'] },
  sunscreen: { pal: { a: '#e8c040', b: '#e8823a', k: '#6a4a1a', w: '#f4efe0', c: '#2f6aa3' }, rows: [
    '.....kk.....', '.....cc.....', '....kccck...', '...kaaaaak..', '...kawwaak..', '...kabbbak..',
    '...kawwaak..', '...kaaaaak..', '...kaaaaak..', '...kaaaaak..', '....kkkkk...', '............'] },
  puzzlebook: { pal: { a: '#f4efe0', b: '#2a2a30', k: '#3a3a44', r: '#2f6aa3' }, rows: [
    '............', '..kkkkkkkk..', '..krrrrrrk..', '..kababab.k.', '..kbababak..', '..kababab.k.',
    '..kbababak..', '..kababab.k.', '..kbababak..', '..kkkkkkkk..', '............', '............'] },
  bdaycard: { pal: { a: '#f4efe0', b: '#e8c040', k: '#5a4a3a', p: '#f07ab0', d: '#c8843a' }, rows: [
    '............', '.kkkkkkkkkk.', '.kaaaapaaak.', '.kaaappbaak.', '.kaadddaaak.', '.kadddddaak.',
    '.kaddaddaak.', '.kaaddddaak.', '.kaaaaaaaak.', '.kkkkkkkkkk.', '............', '............'] },
  sausageroll: { pal: { a: '#d8923a', b: '#f0c070', k: '#8a5a2e', m: '#a0522d', r: '#c8302a' }, rows: [
    '............', '............', '............', '.kkkkkkkkkk.', 'kbbabbabbabk', 'kaaaaaaaaaam',
    'kbbbbbbbbbbm', '.kkkkkkkkkk.', '.........rr.', '........rr..', '............', '............'] },
  vanillaslice: { pal: { a: '#e8b860', b: '#f8e0a0', p: '#f07ab0', k: '#8a5a2e', w: '#f8f4e0' }, rows: [
    '............', '............', '.kkkkkkkkkk.', '.kppppppppk.', '.kaaaaaaaak.', '.kbbbbbbbbk.',
    '.kbbbbbbbbk.', '.kwbbbbbbwk.', '.kaaaaaaaak.', '.kkkkkkkkkk.', '............', '............'] },
  fingerbun: { pal: { a: '#d8a050', b: '#f0c070', p: '#f07ab0', w: '#f8f4e0', k: '#8a5a2e' }, rows: [
    '............', '............', '............', '..kkkkkkkk..', '.kpwpwpwppk.', '.kppwppwpwk.', 'kbbbbbbbbbbk',
    'kaaaaaaaaaak', '.kkkkkkkkkk.', '............', '............', '............'] },
  fidget: { pal: { a: '#3ab0b0', b: '#7ad8d8', k: '#1e4a4a', c: '#c8ccd0' }, rows: [
    '............', '....kkkk....', '...kabbak...', '...kaaaak...', '....kaak....', '.kkkkcckkkk.',
    'kabakcckaabk', 'kaaak..kaaak', '.kkk....kkk.', '............', '............', '............'] },
  fakeplant: { pal: { g: '#3a8a3a', l: '#6ab858', k: '#1e4a1e', p: '#f4efe0', o: '#8a8e96' }, rows: [
    '...lk.lk....', '..lgk.lgk...', '..lggklggk..', '...kgklgk...', '..lk.kk.lk..', '.lggk.klggk.',
    '..kgk.kgk...', '....kk......', '...oooooo...', '...opppoo...', '...oooooo...', '....oooo....'] },
};
