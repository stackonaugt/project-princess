// Built-in art for Brunswick East: Holmes St (Adam's red brick unit, the auto
// parts shop on the Mitchell St corner, the new townhouses opposite, the old
// red brick corner house), the shopfront strip, the deli and record shop
// insides, plus the new items and wild things.
// Same format as objects.js.
import { shade, outline, textWidth } from './painter.js';
import { bricks, tileRoof, window_, door } from './laverton.js';
import { hash } from '../../util.js';

// Spray-paint tags: loopy scribbles in a few colours (as in brunswick.js).
function tags(p, x, y, w, h, seed, cols = ['#1e1e24', '#e77fb8', '#3fa38f', '#f5d63a', '#7fa6e8']) {
  for (let i = 0; i < Math.floor(w / 9); i++) {
    const c = cols[Math.floor(hash(i, seed) * cols.length)], tx = x + 2 + Math.floor(hash(seed, i) * (w - 12)), ty = y + 2 + Math.floor(hash(i + 3, seed) * (h - 8));
    for (let k = 0; k < 8; k++) p.r(c, tx + k, ty + Math.round(Math.sin(k * 1.3 + i) * 2) + 2, 1, 2);
    p.r(c, tx, ty + 5, 8, 1);
  }
}
const centred = (p, str, cx, y, c) => p.text(str, Math.round(cx - textWidth(str) / 2), y, c);

// Lygon St shopfronts: two-storey Italianate fronts with a cornice, arched
// upper windows, the painted sign and the shop window. Gentle joke names.
const SHOPS = {
  deli: { wall: '#e8dcc0', trim: '#f6efe0', fascia: '#2a6a3a', ink: '#f4efe0', label: 'PASTA LA VISTA', awning: ['#c8302a', '#f4efe0'] },
  gelato: { wall: '#f4c8d8', trim: '#fbe8ee', fascia: '#5ab0a8', ink: '#ffffff', label: 'BRAIN FREEZE', awning: ['#5ab0a8', '#fbe8ee'] },
  roaster: { wall: '#7a4a32', trim: '#c8a070', fascia: '#e8d8b0', ink: '#3a2a22', label: 'BEAN THERE', awning: null, brick: true },
  plants: { wall: '#f2ecdc', trim: '#ffffff', fascia: '#3f7a3a', ink: '#f4efe0', label: 'PLANT DADDY', awning: null },
  realty: { wall: '#eef0f2', trim: '#ffffff', fascia: '#1e2a48', ink: '#e8c040', label: 'GOUGE & CO', awning: null },
  records: { wall: '#2a2a34', trim: '#4a4a58', fascia: '#e8c040', ink: '#2a2a34', label: 'WAX LYRICAL', awning: null },
  pilates: { wall: '#dfe8ec', trim: '#f6fafc', fascia: '#8a9aa8', ink: '#ffffff', label: 'CORE VALUES', awning: ['#8a9aa8', '#f6fafc'] },
  pub: { wall: '#3a5a4a', trim: '#e8dcc0', fascia: '#1e2a24', ink: '#e8c040', label: 'THE LOCAL', awning: null, brick: true },
};

function shopWindow(p, v, x, y, w, h) {
  const dark = v === 'records' || v === 'pub' || v === 'roaster';
  const glass = dark ? '#3a4a5a' : '#a8d0e4';
  p.r('#2a2e33', x - 1, y - 1, w + 2, h + 2); p.r(glass, x, y, w, h); p.r(shade(glass, 0.3), x + 1, y + 1, 4, 2);
  const b = y + h;
  if (v === 'deli') {                                // salami on hooks, cheese wheels, a jar of olives
    p.r('#6a4a2a', x + 2, y + 2, w - 4, 1);
    for (let i = 0; i < 5; i++) { p.r('#8a2a2a', x + 4 + i * 6, y + 3, 3, 6); p.r('#e8c8b8', x + 5 + i * 6, y + 4, 1, 1); }
    for (let i = 0; i < 3; i++) { p.r('#e8c060', x + 3 + i * 8, b - 5, 7, 4); p.r('#c8a040', x + 3 + i * 8, b - 2, 7, 1); }
    p.r('#5a7a3a', x + 28, b - 7, 4, 6); p.r('#c8ccd0', x + 28, b - 8, 4, 1);
  } else if (v === 'gelato') {                       // tubs of gelato in a glass case
    p.r('#c8ccd0', x + 2, b - 6, w - 4, 5);
    ['#f4a0b0', '#a8e0a0', '#6a4a2a', '#f8f0d8', '#f0d040', '#b8a0e8'].forEach((c, i) => p.r(c, x + 3 + i * 5, b - 6, 4, 2));
    p.r('#e8b880', x + 25, y + 3, 5, 6); p.blob(x + 27, y + 3, 3, '#f4a0b0');   // a giant cone sign
  } else if (v === 'roaster') {                      // hessian sacks and the roaster drum
    for (let i = 0; i < 3; i++) { p.r('#c8b088', x + 2 + i * 7, b - 8, 6, 8); p.r('#a89068', x + 2 + i * 7, b - 8, 6, 1); p.r('#3a2a1a', x + 4 + i * 7, b - 5, 2, 1); }
    p.r('#8a8e96', x + 24, b - 12, 8, 9); p.blob(x + 28, b - 8, 3, '#5a5e66'); p.r('#c8443a', x + 30, b - 13, 2, 3);
  } else if (v === 'plants') {                       // a monstera, hanging pots, a cactus
    p.blob(x + 8, b - 9, 5, '#2f7a37'); p.r('#3f8a3e', x + 5, b - 12, 2, 2); p.r('#c8643a', x + 5, b - 4, 7, 4);
    for (const dx of [17, 24]) { p.r('#e8e4dc', x + dx + 2, y, 1, 3); p.r('#c8643a', x + dx, y + 3, 5, 3); p.blob(x + dx + 2, y + 7, 2, '#57a84a'); }
    p.r('#4a8a4a', x + 28, b - 9, 3, 8); p.r('#4a8a4a', x + 31, b - 7, 2, 1); p.r('#e8e4dc', x + 27, b - 2, 5, 2);
  } else if (v === 'realty') {                       // the listings: very small flats, very big numbers
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
      const cx = x + 2 + i * 11, cy = y + 2 + j * 8;
      p.r('#f4f4f0', cx, cy, 9, 7); p.r(['#7aa0c8', '#c8a070', '#8ac0a0'][(i + j) % 3], cx + 1, cy + 1, 7, 3); p.r('#c8302a', cx + 1, cy + 5, 6, 1);
    }
    p.r('#c8302a', x + 2, b - 3, w - 4, 2);
  } else if (v === 'records') {                      // records in the window, a turntable
    [[6, 5], [15, 4], [24, 5]].forEach(([dx, dy]) => { p.blob(x + dx, y + dy, 3, '#1e1e24'); p.r('#e8c040', x + dx, y + dy, 1, 1); });
    p.r('#6a4a2a', x + 3, b - 5, 14, 4); p.r('#1e1e24', x + 5, b - 6, 9, 1); p.r('#e8c040', x + 22, b - 6, 10, 5); p.text('LP', x + 24, b - 6, '#2a2a34');
  } else if (v === 'pilates') {                      // a reformer machine and a big pink ball
    p.r('#c8ccd0', x + 3, b - 5, 18, 3); p.r('#f4f4f0', x + 6, b - 7, 10, 2); p.r('#5a5e66', x + 3, b - 2, 2, 2); p.r('#5a5e66', x + 19, b - 2, 2, 2);
    p.blob(x + 27, b - 5, 4, '#f0a0c0'); p.r('#f8d0e0', x + 25, b - 8, 2, 1);
  } else if (v === 'pub') {                          // warm lights, a tap, a pint
    p.r('#5a4030', x, b - 7, w, 7); p.r('#f5d070', x + 3, y + 3, 3, 2); p.r('#f5d070', x + 14, y + 3, 3, 2); p.r('#f5d070', x + 25, y + 3, 3, 2);
    p.r('#e8a040', x + 8, b - 12, 4, 5); p.r('#f4efe0', x + 8, b - 12, 4, 1); p.r('#c8ccd0', x + 20, b - 13, 2, 6);
  }
}

// A tiny hen, side on (for the chook run).
function chook(p, x, y, c) {
  p.r(c, x, y, 5, 3); p.r(c, x + 4, y - 2, 2, 3); p.r('#c8302a', x + 5, y - 3, 1, 1); p.r('#e8a020', x + 6, y - 1, 1, 1);
  p.r(shade(c, -0.2), x, y, 1, 2); p.r('#1e1e24', x + 5, y - 1, 1, 1); p.r('#e8a020', x + 1, y + 3, 1, 1); p.r('#e8a020', x + 3, y + 3, 1, 1);
}

export const BRUNSEAST = {
  // Concetta's chook run: a wire run, a little red coop and three hens.
  chookpen: {
    foot: [3, 2], tex: [48, 40], variants: ['run'], lined: true,
    paint(p) {
      p.shadow(24, 39, 44);
      p.r('#c8b070', 1, 22, 46, 17); p.r('#b09858', 1, 36, 46, 3);
      p.r('#c8302a', 4, 10, 16, 16); p.r('#e8e4dc', 2, 7, 20, 4); p.r('#f4f0e8', 2, 7, 20, 1);
      p.r('#2a1a10', 9, 18, 6, 8); p.r('#e8c060', 11, 20, 2, 2);
      chook(p, 26, 30, '#a8582a'); chook(p, 34, 33, '#f4efe0'); chook(p, 22, 34, '#1e1e24');
      for (let x = 1; x < 48; x += 4) p.r('rgba(200,204,208,0.55)', x, 14, 1, 25);
      for (let y = 14; y < 39; y += 4) p.r('rgba(200,204,208,0.45)', 1, y, 46, 1);
      p.r('#8a6a42', 0, 13, 2, 26); p.r('#8a6a42', 46, 13, 2, 26); p.r('#8a6a42', 0, 13, 48, 2);
      outline(p.ctx, 0, 0, 48, 40);
    },
  },
  eshop: {
    foot: [4, 3], tex: [64, 66], variants: Object.keys(SHOPS), lined: true,
    paint(p, v) {
      const s = SHOPS[v], W = 62, x0 = 1, top = 3, H = 66;
      if (s.brick) bricks(p, x0, top, W, H - top - 1, s.wall, 7);
      else { p.r(s.wall, x0, top, W, H - top - 1); p.r(shade(s.wall, -0.12), x0 + W - 2, top, 2, H - top - 1); }
      // cornice and a curved pediment with the year
      p.r(s.trim, x0, top, W, 4); p.r(shade(s.trim, 0.3), x0, top, W, 1); p.r(shade(s.trim, -0.2), x0, top + 4, W, 1);
      p.r(s.trim, x0 + 20, top - 3, 22, 4); p.r(s.trim, x0 + 24, top - 4, 14, 1); p.r(shade(s.trim, 0.3), x0 + 20, top - 3, 22, 1);
      p.text('1892', x0 + 24, top - 1, shade(s.trim, -0.35));
      // arched upper windows
      for (const wx of [8, 40]) {
        p.r(s.trim, wx - 2, top + 9, 18, 15); p.r(s.trim, wx, top + 7, 14, 2);
        p.r('#5a6a7a', wx, top + 10, 14, 11); p.r('#5a6a7a', wx + 2, top + 9, 10, 1);
        p.r('#8aa4b8', wx + 1, top + 11, 4, 2); p.r(s.trim, wx + 6, top + 10, 1, 11); p.r(shade(s.trim, -0.25), wx - 2, top + 23, 18, 1);
      }
      if (s.awning) { for (let i = 0; i < W; i += 6) p.r(i % 12 ? s.awning[1] : s.awning[0], x0 + i, top + 25, 6, 6); p.r(shade(s.awning[0], -0.3), x0, top + 31, W, 1); }
      else { p.r(shade(s.wall, -0.3), x0, top + 28, W, 3); p.r(shade(s.wall, 0.15), x0, top + 27, W, 1); }
      p.r(shade(s.fascia, -0.3), x0 + 2, top + 33, W - 4, 11); p.r(s.fascia, x0 + 3, top + 34, W - 6, 9); p.r(shade(s.fascia, 0.2), x0 + 3, top + 34, W - 6, 1);
      centred(p, s.label, x0 + W / 2, top + 36, s.ink);
      shopWindow(p, v, x0 + 4, top + 47, 34, H - top - 50);
      // the door, with a little sign
      p.r('#2a1a10', x0 + 42, top + 46, 14, H - top - 47); p.r(shade(s.fascia, -0.2), x0 + 43, top + 47, 12, H - top - 48);
      p.r('#a8d0e4', x0 + 45, top + 49, 8, 7); p.r('#f4f4f0', x0 + 46, top + 51, 6, 2); p.r('#f0c040', x0 + 53, top + 58, 1, 2);
      p.r(shade(s.wall, -0.35), x0, H - 2, W, 1);
      outline(p.ctx, 0, 0, 64, H);
    },
  },

  // ---------------------------------------------------------- Holmes St
  // Adam's place, Unit 1/42 Holmes St: a single-storey red brick unit with a
  // hip tile roof, white-framed windows with vertical blinds and a recessed
  // porch with a lattice screen. 'back' is the next unit down the driveway.
  adamunit: {
    foot: [6, 3], tex: [96, 66], variants: ['front', 'back'], lined: true,
    paint(p, v) {
      const top = 24, H = 66;
      p.shadow(48, H - 1, 92);
      bricks(p, 2, top, 92, H - top - 1, '#a8483a', v === 'front' ? 3 : 8);
      tileRoof(p, -1, 2, 98, 22, '#6a4a40');
      p.r('#8a2a22', 0, top - 1, 96, 2);                                   // red fascia board
      // the porch: recessed, with a lattice screen and the front door
      p.r('#5a2a22', 36, top + 8, 22, H - top - 9); p.r('#3a1a14', 36, top + 8, 22, 2);
      for (let x = 37; x < 47; x += 2) for (let y = top + 22; y < H - 3; y += 2) p.r('#e8dcc8', x, y, 1, 1);
      door(p, 49, top + 12, 8, H - top - 15, '#4a2a1a', false);
      // windows with white frames and vertical blinds
      for (const wx of [8, 64]) {
        p.r('#f4f0e6', wx - 1, top + 9, 24, 24); p.r('#e8e4dc', wx, top + 10, 22, 22);
        for (let x = wx + 1; x < wx + 22; x += 3) p.r('#d0ccc4', x, top + 10, 1, 22);
        p.r('#f4f0e6', wx + 10, top + 9, 2, 24); p.r('#c8c4b8', wx - 2, top + 33, 26, 2);
      }
      if (v === 'front') { p.r('#f4f4f0', 80, top + 4, 8, 3); p.text('1', 82, top + 3, '#2a2a2a'); }
      outline(p.ctx, 0, 0, 96, H);
    },
  },

  // The auto parts shop on the Mitchell St corner: red brick, a big blue
  // fascia with a red stripe, posters in the windows and green steel-framed
  // windows down the side.
  autoparts: {
    foot: [7, 3], tex: [112, 70], variants: ['corner'], lined: true,
    paint(p) {
      const top = 6, H = 70;
      p.shadow(56, H - 1, 108);
      bricks(p, 1, top + 16, 110, H - top - 17, '#a8503a', 5);
      p.r('#1e4aa8', 0, top, 112, 14); p.r('#3a6ad0', 0, top, 112, 1); p.r('#c8302a', 0, top + 14, 112, 3); p.r('#f4f4f0', 0, top + 13, 112, 1);
      centred(p, 'BURNOUT AUTO PARTS', 56, top + 4, '#f4f4f0');
      // shop windows with posters
      for (const wx of [6, 30]) {
        p.r('#2a2e33', wx - 1, top + 23, 22, 34); p.r('#9ac8d8', wx, top + 24, 20, 32); p.r('#c8e4ec', wx + 1, top + 25, 4, 2);
        p.r('#e8c040', wx + 3, top + 30, 7, 10); p.r('#c8302a', wx + 3, top + 30, 7, 3); p.r('#1e4aa8', wx + 12, top + 34, 6, 12); p.r('#f4f4f0', wx + 13, top + 36, 4, 1);
      }
      p.r('#2a2e33', 53, top + 22, 14, H - top - 23); p.r('#4a5a6a', 54, top + 23, 12, H - top - 24); p.r('#9ac8d8', 55, top + 24, 4, 16); p.r('#9ac8d8', 61, top + 24, 4, 16);
      p.r('#c8302a', 70, top + 26, 8, 22); p.text('OPEN', 70, top + 30, '#f4f4f0'); p.r('#f4f4f0', 71, top + 38, 6, 6); p.text('6', 72, top + 39, '#c8302a');
      // green steel windows down the side
      for (const wx of [82, 96]) { p.r('#2a4a3a', wx - 1, top + 22, 12, 30); p.r('#5a8a7a', wx, top + 23, 10, 28); for (let y = top + 26; y < top + 51; y += 4) p.r('#2a4a3a', wx, y, 10, 1); p.r('#2a4a3a', wx + 5, top + 23, 1, 28); }
      outline(p.ctx, 0, 0, 112, H);
    },
  },

  // New townhouses across Holmes St: grey render, a charcoal brick band with
  // a balcony, and an orange timber-clad box on top.
  townhouse: {
    foot: [4, 3], tex: [64, 96], variants: ['a', 'b'], lined: true,
    paint(p, v) {
      const H = 96;
      p.shadow(32, H - 1, 60);
      p.r('#8a8e94', 2, 4, 60, H - 5);                                       // grey render behind
      p.r('#c8743a', 4, 2, 40, 30); for (let y = 4; y < 32; y += 3) p.r('#a85a2a', 4, y, 40, 1); p.r('#e0904a', 4, 2, 40, 1);   // timber box
      p.r('#2a2e33', 10, 10, 26, 12); p.r('#6a8aa8', 11, 11, 24, 10); p.r('#9ab8d0', 12, 12, 6, 2);
      p.r('#5a5e64', 44, 6, 18, 26); p.r('#2a2e33', 48, 12, 10, 8); p.r('#6a8aa8', 49, 13, 8, 6);
      p.r('#34363c', 2, 34, 60, 24); for (let y = 36; y < 58; y += 3) p.r('#2a2c30', 2, y, 60, 1);   // charcoal brick band
      p.r('#1e1e22', 2, 46, 60, 2); p.r('#6a8aa8', 8, 38, 20, 7); p.r('#6a8aa8', 38, 38, 18, 7);
      p.r('#4a4e54', 2, 58, 60, 37);
      p.r('#1e1e22', v === 'a' ? 8 : 40, 66, 14, H - 67); p.r('#3a3e44', v === 'a' ? 9 : 41, 67, 12, H - 68);   // dark front door
      p.r('#2a2e33', v === 'a' ? 30 : 8, 64, 26, 18); p.r('#7a9ab8', v === 'a' ? 31 : 9, 65, 24, 16); p.r('#b8d4e8', v === 'a' ? 32 : 10, 66, 6, 2);
      p.r('#4a4e54', 0, H - 8, 64, 7); p.r('#5a5e64', 0, H - 8, 64, 1);    // the low rendered front wall
      p.blob(v === 'a' ? 26 : 58, H - 12, 4, '#3f7a3a');
      outline(p.ctx, 0, 0, 64, H);
    },
  },

  // Brick bungalows: tile roof, deep eaves, bay windows. red: 199 Nicholson
  // St; cream: the cream brick one on the corner; deco: cream brick with dark
  // bands and a stepped parapet; corner: the old red brick house on Mitchell
  // St with its chimney and striped window awning.
  bungalow: {
    foot: [5, 3], tex: [80, 66], variants: ['red', 'cream', 'deco', 'corner'], lined: true,
    paint(p, v) {
      const top = 26, H = 66, brick = v === 'cream' || v === 'deco' ? '#d8b878' : '#9a4a38';
      p.shadow(40, H - 1, 76);
      if (v === 'corner') { bricks(p, 56, 0, 9, 18, '#9a4a38', 4); p.r('#6a3a2a', 55, 0, 11, 2); }
      bricks(p, 2, top, 76, H - top - 1, brick, v.length + 2);
      tileRoof(p, -1, 6, 82, 20, '#b8583a', { hipL: v !== 'deco' });
      if (v === 'deco') {
        p.r('#3a2a22', 44, 8, 30, 20); bricks(p, 46, 10, 26, 16, '#5a3a2a', 3); p.r('#e8e4dc', 50, 12, 18, 6);   // the dark brick parapet
        for (const y of [top + 12, top + 30]) p.r('#3a2a22', 2, y, 76, 2);   // dark bands
      }
      p.r('#f4f0e6', 0, top - 1, 80, 2);
      // a porch on the left, windows on the right
      p.r('#3a2a22', 12, top + 8, 14, H - top - 9); door(p, 15, top + 12, 8, H - top - 15, '#5a3a2a', false);
      window_(p, 34, top + 10, 16, 20, { curtain: '#f0e8d8' }); window_(p, 56, top + 10, 18, 20, { curtain: '#f0e8d8' });
      if (v === 'corner' || v === 'deco') for (let i = 0; i < 18; i += 3) p.r(i % 6 ? '#f4efe0' : '#5a7a5a', 56 + i, top + 6, 3, 5);   // striped awning
      if (v === 'red') { p.text('199', 4, top + 4, '#f4f0e6'); }
      outline(p.ctx, 0, 0, 80, H);
    },
  },

  // A "LANE 4-6PM" tram lane sign on a pole.
  tramlanesign: {
    foot: [1, 1], tex: [16, 34], variants: ['lane'],
    paint(p) {
      p.shadow(8, 33, 8);
      p.r('#6a6e74', 7, 10, 2, 24); p.r('#1e1e22', 2, 0, 12, 14); p.r('#f4f4f0', 3, 1, 10, 12);
      p.r('#1e1e22', 5, 2, 6, 4); p.r('#f4f4f0', 6, 3, 1, 1); p.r('#f4f4f0', 9, 3, 1, 1); p.r('#1e1e22', 4, 6, 8, 1);   // a little tram
      p.text('4-6', 3, 8, '#1e1e22');
    },
  },

  // ---------------------------------------------------------- Nicholson St
  // The shop strip by Victoria St: graffitied red brick parapets over a long
  // blue awning. sandwich: the sandwich parlour (with a rainbow lottery
  // board); milkbar: the takeaway and milk bar (door inside); mural: the
  // black shopfront painted with brush lettering.
  nshop: {
    foot: [4, 3], tex: [64, 80], variants: ['sandwich', 'milkbar', 'mural'], lined: true,
    paint(p, v) {
      const H = 80, top = 14;
      p.shadow(32, H - 1, 62);
      bricks(p, 1, top, 62, 22, '#a8503a', v.length);
      for (const [x, w] of [[4, 10], [24, 14], [48, 12]]) { p.r('#a8503a', x, top - 4, w, 4); p.r('#c8705a', x, top - 4, w, 1); }   // stepped parapet
      tags(p, 2, top + 2, 58, 18, v.length * 5);
      if (v === 'sandwich') {                                              // the rainbow lottery board up top
        p.r('#f4f4f0', 30, 0, 30, 16); ['#c8302a', '#e8823a', '#f0d040', '#3fa38f', '#2f6aa3'].forEach((c, i) => p.r(c, 34 + i * 2, 4 + i, 22 - i * 4, 2));
        p.text('LUCKY', 35, 9, '#1e4aa8'); p.r('#8a8e96', 44, 16, 2, 2);
      }
      // the awning, and the sign along it
      const fascia = { sandwich: '#f4f4f0', milkbar: '#2f6ab8', mural: '#1e1e24' }[v];
      p.r(shade(fascia, -0.3), 0, top + 22, 64, 12); p.r(fascia, 0, top + 23, 64, 9); p.r('#c8302a', 0, top + 32, 64, 2);
      centred(p, { sandwich: 'SANDWICHES', milkbar: 'MILK BAR', mural: 'FORAGING' }[v], 32, top + 25, { sandwich: '#1e1e24', milkbar: '#f4f4f0', mural: '#f4f4f0' }[v]);
      // the shopfront
      const wall = v === 'mural' ? '#1e1e24' : '#e8e4dc';
      p.r(wall, 1, top + 34, 62, H - top - 35);
      p.r('#2a2e33', 4, top + 37, 34, H - top - 41); p.r(v === 'mural' ? '#3a4a5a' : '#a8d0e4', 5, top + 38, 32, H - top - 43);
      if (v === 'sandwich') { p.r('#c8302a', 8, H - 14, 26, 4); p.r('#e8d8b0', 10, H - 18, 8, 4); p.r('#7ab04a', 12, H - 19, 4, 1); }
      if (v === 'milkbar') {
        p.r('#c8302a', 6, top + 40, 14, 6); p.text('COLD', 7, top + 41, '#f4f4f0');
        for (let i = 0; i < 4; i++) p.r(['#e8c040', '#3fa38f', '#e77fb8', '#f4f4f0'][i], 22 + i * 3, H - 16, 2, 8);
        p.r('#f0d040', 6, H - 12, 12, 6); p.text('ICE', 7, H - 12, '#c8302a');
      }
      if (v === 'mural') {                                                 // white brush lettering and a big smiley
        for (let i = 0; i < 4; i++) { p.r('#f4f4f0', 8 + i * 7, top + 42, 4, 1); p.r('#f4f4f0', 9 + i * 7, top + 42, 1, 6); p.r('#f4f4f0', 7 + i * 7, top + 46, 5, 1); }
        p.blob(52, top + 44, 5, '#f0d040'); p.r('#1e1e24', 50, top + 42, 1, 2); p.r('#1e1e24', 54, top + 42, 1, 2); p.r('#1e1e24', 50, top + 46, 5, 1);
      }
      const dx = v === 'mural' ? 42 : 43;
      p.r('#2a1a10', dx - 1, top + 36, 14, H - top - 37); p.r('#3a4a5a', dx, top + 37, 12, H - top - 38); p.r('#a8d0e4', dx + 2, top + 39, 8, 8);
      if (v === 'milkbar') { p.r('#f4f4f0', dx + 3, top + 49, 6, 3); p.text('OPEN', dx - 1, top + 54, '#f0d040'); }
      outline(p.ctx, 0, 0, 64, H);
    },
  },

  // A red-topped public phone booth.
  phonebooth: {
    foot: [1, 1], tex: [16, 34], variants: ['red'], lined: true,
    paint(p) {
      p.shadow(8, 33, 14);
      p.r('#c8302a', 1, 2, 14, 7); p.r('#e8503a', 1, 2, 14, 1); p.r('#f4f4f0', 3, 4, 10, 2);
      p.r('#9aa0a8', 2, 9, 12, 24); p.r('#c8ccd0', 3, 10, 10, 10); p.r('#2a2e33', 6, 12, 5, 7); p.r('#5a5e64', 2, 26, 12, 7);
      outline(p.ctx, 0, 0, 16, 34);
    },
  },

  // The new apartments across Nicholson St: a green panel wall with white
  // branches running up it, beige render and black balconies.
  greenapts: {
    foot: [8, 3], tex: [128, 112], variants: ['branches'], lined: true,
    paint(p) {
      const H = 112;
      p.shadow(64, H - 1, 124);
      p.r('#3f8a3e', 2, 6, 44, H - 7); p.r('#57a84a', 2, 6, 44, 1);
      for (let i = 0; i < 9; i++) { const x = 4 + i * 5; for (let y = 8; y < H - 14; y++) p.r('#f4f4f0', x + Math.round(Math.sin(y * 0.09 + i) * 3), y, 1, 1); }
      for (let i = 0; i < 6; i++) for (let y = 14; y < H - 18; y += 6) { const x = 6 + i * 7; p.r('#f4f4f0', x + ((y / 6) % 3), y, 3, 1); }
      p.r('#e8dcc4', 46, 2, 80, H - 3); p.r('#f4ecd8', 46, 2, 80, 1); p.r('#c8bea4', 46, 0, 80, 3);
      for (let f = 0; f < 3; f++) {
        const y = 10 + f * 30;
        for (const wx of [54, 82, 106]) { p.r('#2a2e33', wx, y, 16, 14); p.r('#5a7a98', wx + 1, y + 1, 14, 12); p.r('#8aaac8', wx + 2, y + 2, 4, 2); }
        p.r('#1e1e22', 76, y + 14, 46, 6); for (let x = 77; x < 122; x += 2) p.r('#2a2a30', x, y + 14, 1, 6);   // balcony
      }
      p.r('#9aa0a8', 2, H - 14, 124, 13); p.r('#c86a3a', 70, H - 12, 40, 10); p.r('#5a5e64', 10, H - 12, 24, 10);   // planters and the bin cupboard
      outline(p.ctx, 0, 0, 128, H);
    },
  },

  // ---------------------------------------------------------- Fleming Park
  // The Brunswick Bowls Club clubhouse: brick, a long green verandah, BBC.
  bowlsclub: {
    foot: [8, 3], tex: [128, 64], variants: ['club'], lined: true,
    paint(p) {
      const H = 64, top = 18;
      p.shadow(64, H - 1, 124);
      bricks(p, 2, top, 124, H - top - 1, '#b8684a', 6);
      p.r('#9aa0a8', 0, 4, 128, 14); for (let x = 0; x < 128; x += 3) p.r('#b8bec6', x, 4, 1, 14);
      for (let i = 0; i < 4; i++) { p.r('#1e2a48', 70 + i * 14, 0, 12, 7); p.r('#3a5a8a', 71 + i * 14, 1, 10, 5); }   // solar panels
      p.r('#2f6a4a', 0, top + 6, 128, 6); p.r('#3f8a5a', 0, top + 6, 128, 1);   // green verandah
      for (let x = 4; x < 128; x += 20) p.r('#e8e4dc', x, top + 12, 2, H - top - 13);
      for (const wx of [10, 34, 82, 106]) { p.r('#e8e4dc', wx - 1, top + 17, 14, 14); p.r('#6a8aa8', wx, top + 18, 12, 12); p.r('#e8e4dc', wx + 5, top + 18, 1, 12); }
      p.r('#f4f4f0', 52, top + 15, 24, 10); centred(p, 'BBC', 64, top + 17, '#2f6a4a');
      door(p, 58, top + 27, 12, H - top - 29, '#2f6a4a', false);
      outline(p.ctx, 0, 0, 128, H);
    },
  },

  // Fleming Park Hall on Victoria St: cream render, a curved parapet with
  // pilasters, two tall windows and a door.
  flemhall: {
    foot: [5, 3], tex: [80, 70], variants: ['hall'], lined: true,
    paint(p) {
      const H = 70, c = '#e8dcb4', d = '#c8bc94';
      p.shadow(40, H - 1, 76);
      p.r(c, 2, 16, 76, H - 17); p.r(shade(c, -0.1), 74, 16, 4, H - 17);
      for (let i = 0; i < 9; i++) { const w = Math.round(Math.sqrt(81 - (i - 9) ** 2) * 2.4); p.r(c, 40 - w, 6 + i, w * 2, 1); }   // the curved parapet
      p.r(shade(c, 0.3), 18, 6, 44, 1);
      for (const x of [2, 20, 56, 72]) { p.r(d, x, 8, 6, H - 9); p.r(shade(c, 0.25), x, 8, 1, H - 9); p.r(c, x - 1, 6, 8, 3); }   // pilasters
      p.r(d, 2, 28, 76, 2);
      for (const wx of [10, 60]) { p.r('#5a6a7a', wx - 1, 34, 12, 24); p.r('#8aa4b8', wx, 35, 10, 22); p.r('#f4f4f0', wx + 4, 35, 1, 22); p.r('#f4f4f0', wx, 45, 10, 1); }
      p.r('#6a4a2a', 32, 36, 16, H - 37); p.r('#8a6a42', 33, 37, 6, H - 39); p.r('#8a6a42', 41, 37, 6, H - 39);
      p.text('HALL', 33, 20, '#8a7a5a');
      outline(p.ctx, 0, 0, 80, H);
    },
  },

  // The Vivian Adams Pavilion: a red, angular little pavilion by the oval
  // with grandstand steps down the front.
  pavilion: {
    foot: [5, 3], tex: [80, 56], variants: ['red'], lined: true,
    paint(p) {
      const H = 56;
      p.shadow(40, H - 1, 76);
      for (let i = 0; i < 18; i++) p.r('#c8443a', 4 + i * 2, 18 - i, 72 - i * 2, 1);
      p.r('#c8443a', 4, 18, 72, 20); p.r('#a8342a', 4, 36, 72, 2); p.r('#e8604a', 4, 18, 72, 1);
      p.r('#2a2e33', 10, 22, 22, 12); p.r('#5a7a98', 11, 23, 20, 10);
      for (let i = 0; i < 5; i++) { p.r('#8a8e96', 4 + i * 4, 38 + i * 3, 72 - i * 8, 3); p.r('#b8bcc4', 4 + i * 4, 38 + i * 3, 72 - i * 8, 1); }   // grandstand steps
      outline(p.ctx, 0, 0, 80, H);
    },
  },

  // The curved grey shelters along the bowls green (drawn over you).
  bowlshelter: {
    foot: [4, 1], tex: [64, 40], variants: ['grey'], roof: true, lined: true,
    paint(p) {
      p.r('#3a3e44', 2, 2, 60, 9); p.r('#5a5e64', 2, 2, 60, 2); p.r('#2a2e33', 2, 10, 60, 2);
      for (let x = 4; x < 62; x += 8) p.r('#4a4e54', x, 3, 1, 7);
      for (const x of [6, 56]) p.r('#1e1e22', x, 12, 2, 28);
    },
  },

  // The wrought iron BBC arch over the steps up from Victoria St (walk under it).
  bbcarch: {
    foot: [3, 1], tex: [48, 48], variants: ['bbc'], roof: true, lined: true,
    paint(p) {
      for (const x of [2, 44]) p.r('#e8e4dc', x, 8, 2, 40);
      for (let i = 0; i < 40; i++) { const y = 10 - Math.round(Math.sin(i / 39 * Math.PI) * 8); p.r('#e8e4dc', 4 + i, y, 1, 1); p.r('#e8e4dc', 4 + i, y + 10, 1, 1); }
      for (let i = 0; i < 3; i++) { p.r('#1e1e22', 12 + i * 9, 6, 2, 9); p.r('#1e1e22', 12 + i * 9, 6, 6, 2); p.r('#1e1e22', 12 + i * 9, 13, 6, 2); }
      p.r('#1e1e22', 17, 8, 1, 2); p.r('#1e1e22', 26, 8, 1, 2); p.r('#1e1e22', 17, 11, 1, 2); p.r('#1e1e22', 26, 11, 1, 2);
      p.r('#f4f4f0', 30, 8, 1, 1);
    },
  },

  // The bocce club's black sign over the gate (walk under it).
  boccearch: {
    foot: [3, 1], tex: [48, 44], variants: ['bocce'], roof: true, lined: true,
    paint(p) {
      for (const x of [2, 44]) p.r('#8a8e96', x, 6, 2, 38);
      p.r('#1e1e22', 0, 2, 48, 9); centred(p, 'BOCCE CLUB', 24, 4, '#f4f4f0');
    },
  },

  // ---------------------------------------------------------- inside the milk bar
  // The Sorceress's shelf of bottled protection spells, glowing faintly.
  potionshelf: {
    foot: [2, 1], tex: [32, 44], variants: ['spells'], lined: true,
    paint(p) {
      p.shadow(16, 43, 30);
      p.r('#4a2a5a', 1, 2, 30, 41); p.r('#6a3a7a', 1, 2, 30, 1);
      for (let s = 0; s < 3; s++) {
        const y = 6 + s * 12;
        p.r('#2a1a34', 2, y + 9, 28, 2);
        for (let i = 0; i < 5; i++) { const c = ['#7ae8c8', '#e87ab8', '#f0d040', '#8ab0ff', '#c8a0ff'][(i + s) % 5]; p.r(c, 4 + i * 5, y + 3, 3, 6); p.r('#f4f4f0', 4 + i * 5, y + 4, 1, 2); p.r('#c8a070', 5 + i * 5, y + 1, 1, 2); }
      }
      outline(p.ctx, 0, 0, 32, 44);
    },
  },
  // A crystal ball on a little stand.
  crystalball: {
    foot: [1, 1], tex: [16, 22], variants: ['ball'], lined: true,
    paint(p) {
      p.shadow(8, 21, 12);
      p.r('#6a4a2a', 3, 16, 10, 5); p.r('#8a6a42', 3, 16, 10, 1);
      p.blob(8, 10, 6, '#8ab0e8'); p.blob(8, 10, 4, '#b8d0ff'); p.r('#f4f4f0', 5, 6, 2, 2); p.r('#c8a0ff', 9, 11, 2, 2);
      outline(p.ctx, 0, 0, 16, 22);
    },
  },
  // Inside the deli: a glass counter of cheese, salami and olives.
  delicase: {
    foot: [3, 1], tex: [48, 30], variants: ['deli'], lined: true,
    paint(p) {
      p.shadow(24, 29, 44);
      p.r('#d8d4cc', 1, 14, 46, 15); p.r('#f4f0e8', 1, 14, 46, 1); p.r('#a8a49c', 1, 26, 46, 3);
      p.r('#c8e4ec', 2, 4, 44, 10); p.r('#e8f4f8', 3, 5, 10, 1);
      for (let i = 0; i < 5; i++) p.r(['#e8c060', '#8a2a2a', '#f4f0d8', '#5a7a3a', '#c86a5a'][i], 4 + i * 8, 10, 7, 4);
      p.r('#8a2a2a', 6, 7, 2, 3); p.r('#8a2a2a', 30, 7, 2, 3);
      outline(p.ctx, 0, 0, 48, 30);
    },
  },

  // Crates of records in the record shop.
  recordbin: {
    foot: [2, 1], tex: [32, 26], variants: ['a', 'b'], lined: true,
    paint(p, v) {
      p.shadow(16, 25, 28);
      p.r('#8a6a42', 2, 14, 28, 11); p.r('#a8845a', 2, 14, 28, 1); p.r('#6a4a2a', 2, 23, 28, 2);
      const cols = v === 'a' ? ['#c8443a', '#2f6aa3', '#e8c040', '#3fa38f', '#f4efe0'] : ['#7a3ab0', '#e77fb8', '#1e1e24', '#e8823a', '#5ab0a8'];
      for (let i = 0; i < 6; i++) { p.r(cols[i % cols.length], 4 + i * 4, 6 + (i % 2), 4, 9); p.r(shade(cols[i % cols.length], -0.25), 7 + i * 4, 6 + (i % 2), 1, 9); }
      outline(p.ctx, 0, 0, 32, 26);
    },
  },

  // Gig posters pasted on a wall (inside the record shop, or a lane wall).
  gigposters: {
    foot: [2, 1], tex: [32, 20], variants: ['a'], lined: true,
    paint(p) {
      [['#e8c040', '#1e1e24'], ['#c8443a', '#f4efe0'], ['#3fa38f', '#1e1e24'], ['#f0a0c0', '#2a2a34']].forEach(([bg, ink], i) => {
        const x = 1 + i * 8, y = 2 + (i % 2) * 2;
        p.r('#1e1a18', x - 1, y - 1, 8, 15); p.r(bg, x, y, 6, 13); p.r(ink, x + 1, y + 2, 4, 2); p.r(ink, x + 1, y + 7, 4, 1); p.r(ink, x + 1, y + 9, 3, 1);
      });
    },
  },
};

// New item icons (12x12, same format as ITEM_ART in items.js).
export const EAST_ITEM_ART = {
  cannoli: { pal: { a: '#d8923a', b: '#f0c070', k: '#6a3a1a', w: '#f8f4e8', g: '#7ab04a' }, rows: [
    '............', '............', '............', '.gkkkkkkkkg.', 'gwkbaabbakwg', 'gwkaaaaaakwg',
    'gwkaabaaakwg', '.gkkkkkkkkg.', '............', '..w.w..w.w..', '............', '............'] },
  prosciutto: { pal: { p: '#e88a8a', w: '#f8e8e0', k: '#8a3a3a' }, rows: [
    '............', '...kkkkk....', '..kppwppk...', '.kpppwpppk..', '.kpwpppwpk..', '..kpppppwpk.',
    '..kppwppppk.', '...kpppwppk.', '....kkkppk..', '.......kk...', '............', '............'] },
  egg: { pal: { a: '#e8c8a0', b: '#f8e8d0', k: '#8a6a4a', s: '#d8b080' }, rows: [
    '............', '.....kk.....', '....kbak....', '...kbaaak...', '...kbaaak...', '..kbaasaak..',
    '..kaaaaaak..', '..kaasaaak..', '...kaaaak...', '....kkkk....', '............', '............'] },
  parmigiano: { pal: { a: '#f4e0a0', b: '#fff0c0', r: '#c8a050', k: '#6a4a1a' }, rows: [
    '............', '............', '.........kk.', '.......kkbk.', '.....kkaaak.', '...kkabaaak.',
    '.kkaaaaaaak.', 'kaaaaaaaaak.', 'krrrrrrrrrk.', 'kkkkkkkkkkk.', '............', '............'] },
  beans: { pal: { a: '#c8b088', b: '#8a7050', c: '#5a3a1a', w: '#f4efe0', k: '#4a3418' }, rows: [
    '....kkkk....', '...kbbbbk...', '..kaaaaaak..', '..kawwwwak..', '..kawccwak..', '..kawwwwak..',
    '..kaaaaaak..', '..kaaaaaak..', '..kaaaaaak..', '..kkkkkkkk..', '............', '............'] },
  honey: { pal: { l: '#c8443a', h: '#e8a020', y: '#f8d070', w: '#f4efe0', k: '#6a3a10' }, rows: [
    '............', '...kkkkkk...', '...kllllk...', '..kkkkkkkk..', '..khhhhhhk..', '..khyhhhhk..',
    '..khywwhhk..', '..khhwwhhk..', '..khhhhhhk..', '..khhhhhhk..', '...kkkkkk...', '............'] },
  kombucha: { pal: { a: '#d8a050', d: '#2a2a30', w: '#f4efe0', g: '#5ab04a', k: '#5a3a1a' }, rows: [
    '.....kk.....', '.....dd.....', '....kddk....', '....kaak....', '...kaaaak...', '...kaaaak...',
    '...kwwwwk...', '...kwggwk...', '...kaaaak...', '...kaaaak...', '...kkkkkk...', '............'] },
};

// Records from the record shop (items with record: true): a sleeve with the
// disc peeking out. art: { cover, band }
export function paintRecord(p, a) {
  const k = '#1e1a18';
  p.blob(11, 8, 5, '#1e1e24'); p.blob(11, 8, 1, a.band); p.r('#3a3a44', 9, 4, 2, 1);
  p.r(k, 1, 2, 11, 12); p.r(a.cover, 2, 3, 9, 10); p.r(shade(a.cover, -0.2), 2, 12, 9, 1);
  p.r(a.band, 3, 5, 7, 2); p.r(a.band, 4, 9, 2, 2); p.r(shade(a.cover, 0.3), 2, 3, 9, 1);
}

// Wild things in Brunswick East (same format as FOE_ART in enemies.js).
export const EAST_FOE_ART = {
  scoby: [16, 16, p => {                               // a kombucha mother, out of its jar and cross about it
    p.r('#c8b898', 1, 8, 14, 7); p.r('#e8dcc0', 2, 7, 12, 3); p.r('#a89878', 1, 13, 14, 2);
    p.r('#d8c8a8', 3, 10, 3, 1); p.r('#b8a888', 9, 12, 4, 1); p.r('#e8a050', 0, 14, 3, 2); p.r('#e8a050', 13, 15, 3, 1);
    p.r('#ffffff', 4, 9, 2, 2); p.r('#ffffff', 9, 9, 2, 2); p.r('#1a1010', 5, 10, 1, 1); p.r('#1a1010', 9, 10, 1, 1);
    p.r('#1a1010', 4, 8, 2, 1); p.r('#1a1010', 9, 8, 2, 1); p.r('#1a1010', 6, 12, 3, 1);
  }],
  rakali: [16, 16, p => {                              // native water rat: dark back, gold belly, white tail tip
    p.r('#3a2e26', 3, 7, 9, 5); p.r('#4a3a30', 4, 6, 7, 2); p.r('#d8a050', 4, 11, 8, 2);
    p.r('#3a2e26', 0, 8, 4, 3); p.r('#2a201a', 0, 9, 1, 1); p.r('#1a1010', 1, 8, 1, 1); p.r('#5a4a40', 3, 6, 1, 2);
    p.r('#3a2e26', 12, 10, 3, 1); p.r('#3a2e26', 14, 11, 2, 1); p.r('#f4f4f0', 15, 12, 1, 2);
    p.r('#2a201a', 4, 13, 2, 1); p.r('#2a201a', 9, 13, 2, 1); p.r('#7ab0d8', 0, 15, 16, 1);
  }],
  cargobike: [16, 16, p => {                           // a long-tail cargo bike with a box full of shopping
    p.blob(3, 12, 3, '#2a2e33'); p.blob(3, 12, 2, '#c8ccd0'); p.blob(13, 12, 3, '#2a2e33'); p.blob(13, 12, 2, '#c8ccd0');
    p.r('#3fa38f', 3, 9, 10, 2); p.r('#3fa38f', 11, 6, 2, 6); p.r('#1e1e24', 10, 5, 4, 1); p.r('#3fa38f', 6, 7, 1, 3);
    p.r('#8a6a42', 0, 4, 7, 5); p.r('#a8845a', 0, 4, 7, 1); p.r('#3f8a3e', 1, 2, 2, 2); p.r('#e8823a', 4, 3, 2, 1);
    p.r('#ffffff', 1, 6, 2, 2); p.r('#ffffff', 4, 6, 2, 2); p.r('#1a1010', 2, 7, 1, 1); p.r('#1a1010', 4, 7, 1, 1);
  }],
};
