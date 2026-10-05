// Built-in art for Brunswick East: the Lygon St shopfronts, the enviro park
// by the Merri Creek (chook run, market stalls, the mudbrick centre), the
// deli and record shop insides, plus the new items and wild things.
// Same format as objects.js.
import { shade, outline, textWidth } from './painter.js';
import { bricks } from './laverton.js';
import { hash } from '../../util.js';

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

  // The chook run at the enviro park: a wire run, a little red coop, hens.
  chookpen: {
    foot: [3, 2], tex: [48, 40], variants: ['run'], lined: true,
    paint(p) {
      p.shadow(24, 39, 44);
      p.r('#c8b070', 1, 22, 46, 17); p.r('#b09858', 1, 36, 46, 3);                       // straw
      p.r('#c8302a', 4, 10, 16, 16); p.r('#e8e4dc', 2, 7, 20, 4); p.r('#f4f0e8', 2, 7, 20, 1);   // coop and roof
      p.r('#2a1a10', 9, 18, 6, 8); p.r('#e8c060', 11, 20, 2, 2);
      chook(p, 26, 30, '#a8582a'); chook(p, 34, 33, '#f4efe0'); chook(p, 22, 34, '#1e1e24');
      for (let x = 1; x < 48; x += 4) p.r('rgba(200,204,208,0.55)', x, 14, 1, 25);           // the wire
      for (let y = 14; y < 39; y += 4) p.r('rgba(200,204,208,0.45)', 1, y, 46, 1);
      p.r('#8a6a42', 0, 13, 2, 26); p.r('#8a6a42', 46, 13, 2, 26); p.r('#8a6a42', 0, 13, 48, 2);
      outline(p.ctx, 0, 0, 48, 40);
    },
  },

  // Market stalls under striped canopies.
  stall: {
    foot: [3, 1], tex: [48, 44], variants: ['veg', 'honey', 'plants'], lined: true,
    paint(p, v) {
      const stripe = { veg: '#3f8a3e', honey: '#e8a020', plants: '#c8443a' }[v];
      p.shadow(24, 43, 44);
      p.r('#8a8e96', 4, 10, 2, 33); p.r('#8a8e96', 42, 10, 2, 33);
      for (let i = 0; i < 46; i += 6) p.r(i % 12 ? '#f4efe0' : stripe, 1 + i, 4, 6, 8);
      for (let i = 0; i < 46; i += 6) p.r(i % 12 ? '#f4efe0' : stripe, 1 + i, 12, 6, 2);
      p.r(shade(stripe, -0.3), 1, 14, 46, 1);
      p.r('#a8784a', 2, 28, 44, 4); p.r('#c8986a', 2, 28, 44, 1); p.r('#6a4a2a', 4, 32, 2, 11); p.r('#6a4a2a', 42, 32, 2, 11);
      if (v === 'veg') {
        for (let i = 0; i < 4; i++) { p.r('#c8a070', 4 + i * 10, 23, 9, 5); p.blob(8 + i * 10, 23, 3, ['#c8302a', '#3f8a3e', '#e8822a', '#7a3a8a'][i]); }
      } else if (v === 'honey') {
        for (let i = 0; i < 6; i++) { p.r('#e8a020', 5 + i * 7, 22, 5, 6); p.r('#c8443a', 5 + i * 7, 21, 5, 2); p.r('#f8d070', 6 + i * 7, 23, 1, 3); }
      } else {
        for (let i = 0; i < 5; i++) { p.r('#c8643a', 5 + i * 8, 24, 5, 4); p.blob(7 + i * 8, 22, 3, ['#3f8a3e', '#57a84a', '#e77fb8', '#2f7a37', '#f5d63a'][i]); }
      }
      outline(p.ctx, 0, 0, 48, 44);
    },
  },

  // The enviro park's mudbrick centre: earthy walls, a tin roof with solar
  // panels, a big rainwater tank and a green door.
  mudbrick: {
    foot: [6, 3], tex: [96, 72], variants: ['centre'], lined: true,
    paint(p) {
      p.shadow(48, 71, 92);
      p.r('#c8946a', 4, 26, 88, 45);
      for (let y = 28; y < 70; y += 5) for (let x = 4 + ((y / 5) % 2) * 5; x < 92; x += 10) p.r(shade('#c8946a', hash(x, y) > 0.5 ? 0.08 : -0.08), x, y, 9, 4);
      p.r('#9aa0a8', 0, 14, 96, 12); for (let x = 0; x < 96; x += 3) p.r('#b8bec6', x, 14, 1, 12); p.r('#6a7078', 0, 25, 96, 2);
      for (let i = 0; i < 4; i++) { p.r('#1e2a48', 10 + i * 14, 4, 12, 11); p.r('#3a5a8a', 11 + i * 14, 5, 10, 9); p.r('#6a8ab8', 11 + i * 14, 5, 3, 2); }
      p.r('#2f6a3a', 42, 46, 12, 24); p.r('#3f8a4a', 43, 47, 10, 22); p.r('#e8c040', 51, 58, 1, 2);
      for (const wx of [12, 66]) { p.r('#6a4a2a', wx - 1, 38, 18, 14); p.r('#8ab0c8', wx, 39, 16, 12); p.r('#6a4a2a', wx + 7, 39, 1, 12); p.r('#b8d8e8', wx + 1, 40, 4, 2); }
      p.r('#3a8a5a', 30, 34, 8, 3); p.r('#3a8a5a', 58, 34, 8, 3);
      p.r('#8a6a42', 0, 30, 4, 40); p.r('#a8b0b8', 86, 34, 10, 36); for (let y = 36; y < 70; y += 4) p.r('#8a9098', 86, y, 10, 1);   // the tank
      outline(p.ctx, 0, 0, 96, 72);
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
