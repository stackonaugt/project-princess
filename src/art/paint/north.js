// Built-in art for Coburg and Preston (see src/data/north.js for the people):
//   nshop        two-storey shopfronts with gentle joke names (Sydney Rd, Coburg and High St, Preston)
//   townhall     Coburg Town Hall on Bell St: cream render, columns, a clock and the Merri-bek banner
//   skystation   the new skyrail stations at Coburg (Upfield line) and Preston (Mernda line)
//   library      the Coburg Library hub on the Victoria St Mall
//   stall        Preston Market stalls (deli, fruit and veg, fish, cakes, plants, one shut)
//   marketsign   the tall Preston Market pylon sign
//   placard      a SAVE PRESTON MARKET placard on a stake
//   coffeecart   a coffee cart outside Preston Station
//   weir         the old bluestone weir at Coburg Lake, with water going over
//   rotunda      a little heritage band rotunda at Coburg Lake
//   woodoven, bakecase   inside the Turkish bakery on Sydney Rd
//   bettyhouse   Betty and Ward's townhouse on Moreland Rd: red brick pier, white render, glass balconies, a taupe front wall
//   alisonapts   Alison's block on Murray Rd, Preston: dark brown cladding, white box frames, a red stripe
// Plus item icons (NORTH_ITEM_ART) and battle foes (NORTH_FOE_ART).
// Same format as objects.js.
import { shade, textWidth } from './painter.js';
import { bricks } from './laverton.js';
import { hash } from '../../util.js';

const centred = (p, s, cx, y, c) => p.text(s, Math.round(cx - textWidth(s) / 2), y, c);
function box(p, x, y, w, h, c) { p.r(c, x, y, w, h); p.r(shade(c, 0.18), x, y, w, 1); p.r(shade(c, -0.22), x, y + h - 1, w, 1); }
function win(p, x, y, w, h, frame, glass = '#5a6a7a') { p.r(frame, x - 1, y - 1, w + 2, h + 2); p.r(glass, x, y, w, h); p.r(shade(glass, 0.3), x + 1, y + 1, 2, 2); }
const COLS = ['#c8443a', '#2f6aa3', '#e8c040', '#3a8a4a', '#f07ab0', '#6a3ab0', '#e8823a', '#3ab0b0', '#f4efe0'];

// Shopfronts. wall/trim/fascia/ink colours, the sign, an awning (two colours) or none.
const NSHOPS = {
  // Sydney Rd, Coburg
  bakery:   { wall: '#e8d8b8', trim: '#f4ecd8', fascia: '#b8302a', ink: '#f4e8c8', label: 'KNEAD TO KNOW', awning: ['#b8302a', '#f4e8c8'] },
  bridal:   { wall: '#f4eef0', trim: '#ffffff', fascia: '#e8c8d4', ink: '#8a3a5a', label: 'ALTAR EGO', awning: null },
  discount: { wall: '#3a6ab8', trim: '#f0d040', fascia: '#f0d040', ink: '#c8302a', label: 'CHEAP THRILLS', awning: ['#c8302a', '#f0d040'], brick: false },
  barber:   { wall: '#2a2e36', trim: '#5a5e66', fascia: '#f4f4f0', ink: '#1e1e24', label: 'SHEAR LUCK', awning: null },
  phone:    { wall: '#d8dce0', trim: '#f4f4f0', fascia: '#1e6ab0', ink: '#ffffff', label: 'CRACKED IT', awning: null },
  kebab:    { wall: '#a8553a', trim: '#e8dcc0', fascia: '#1e1e24', ink: '#f0a030', label: 'DONER & DUSTED', awning: ['#f0a030', '#1e1e24'], brick: true },
  grocer:   { wall: '#c89a5a', trim: '#e8d0a0', fascia: '#3a7a3a', ink: '#f4efe0', label: 'CUMIN SOON', awning: ['#3a7a3a', '#f4efe0'], brick: true },
  // High St, Preston
  greekcake: { wall: '#f4f4f0', trim: '#2a6ab8', fascia: '#2a6ab8', ink: '#ffffff', label: 'ZORBA THE BAKE', awning: ['#2a6ab8', '#ffffff'] },
  opshop:   { wall: '#7a5a8a', trim: '#e8d8f0', fascia: '#e8d8f0', ink: '#4a2a5a', label: 'SECOND ACT', awning: null },
  realestate: { wall: '#1e2a3a', trim: '#c8a040', fascia: '#c8a040', ink: '#1e2a3a', label: 'GOUGE & CO', awning: null },
  laundro:  { wall: '#e8f0f4', trim: '#ffffff', fascia: '#3ab0c8', ink: '#ffffff', label: 'SUDS LAW', awning: null },
  pho:      { wall: '#c8443a', trim: '#f0d040', fascia: '#f0d040', ink: '#c8302a', label: 'PHO-NOMENAL', awning: ['#c8302a', '#f0d040'], brick: true },
};

// What's in each shop window.
function shopWindow(p, v, x, y, w, h) {
  p.r('#2a2e33', x - 1, y - 1, w + 2, h + 2); p.r('#a8c8d8', x, y, w, h); p.r('#c8e0ec', x + 1, y + 1, 4, 2);
  const b = y + h;
  if (v === 'bakery') {                                    // long pide and round simit on trays
    for (let i = 0; i < 3; i++) { p.r('#c8823a', x + 2 + i * 11, b - 5, 10, 3); p.r('#e8b060', x + 3 + i * 11, b - 5, 8, 1); }
    for (let i = 0; i < 4; i++) { p.blob(x + 5 + i * 8, b - 10, 3, '#b8702a'); p.r('#a8c8d8', x + 5 + i * 8, b - 10, 1, 1); }
  } else if (v === 'bridal') {                             // a white dress on a mannequin, a veil
    p.r('#f4f4f0', x + 12, b - 16, 6, 4); p.r('#ffffff', x + 9, b - 12, 12, 12); p.r('#e8e8f0', x + 19, b - 12, 2, 12);
    p.blob(x + 15, b - 18, 2, '#e8d4c4'); p.r('#f4f4f8', x + 24, b - 14, 6, 14); p.r('#e8c8d4', x + 2, b - 6, 5, 6);
  } else if (v === 'discount') {                           // everything, piled up
    for (let i = 0; i < 14; i++) p.r(COLS[Math.floor(hash(i, 5) * COLS.length)], x + 1 + (i % 7) * 5, b - 6 - Math.floor(i / 7) * 6, 4, 5);
    p.r('#f0d040', x + 2, y + 2, 16, 6); p.text('$2', x + 5, y + 3, '#c8302a');
  } else if (v === 'barber') {                             // a chair and the pole
    p.r('#c8302a', x + w - 4, y + 1, 2, h - 2); for (let j = 0; j < h - 2; j += 3) p.r('#f4f4f0', x + w - 4, y + 1 + j, 2, 1);
    p.r('#1e1e24', x + 8, b - 9, 10, 5); p.r('#1e1e24', x + 8, b - 14, 3, 6); p.r('#8a8e96', x + 12, b - 4, 2, 4);
  } else if (v === 'phone') {                              // phones, one very cracked
    for (let i = 0; i < 4; i++) { p.r('#1e1e24', x + 3 + i * 8, b - 13, 6, 11); p.r('#3a6ab8', x + 4 + i * 8, b - 12, 4, 8); }
    p.r('#f4f4f0', x + 4, b - 11, 1, 1); p.r('#f4f4f0', x + 5, b - 10, 1, 1); p.r('#f4f4f0', x + 6, b - 9, 1, 2);
  } else if (v === 'kebab') {                              // the spit
    p.r('#8a8e96', x + 10, y + 2, 1, h - 3); p.r('#a0582a', x + 7, y + 4, 7, h - 8); p.r('#c8823a', x + 8, y + 4, 2, h - 8);
    p.r('#e85a3a', x + 2, y + 3, 3, h - 5); p.r('#f0a030', x + 20, b - 6, 12, 4);
  } else if (v === 'grocer') {                             // sacks of spices
    for (let i = 0; i < 5; i++) { const c = ['#c8302a', '#e8a030', '#6a8a3a', '#8a4a2a', '#f0d040'][i]; p.r('#d8c8a0', x + 1 + i * 7, b - 8, 6, 8); p.blob(x + 4 + i * 7, b - 8, 2, c); }
  } else if (v === 'greekcake') {                          // cakes, baklava and koulourakia
    for (let i = 0; i < 3; i++) { p.r('#f4e8d0', x + 2 + i * 11, b - 10, 9, 6); p.r(['#f07ab0', '#6a3a1a', '#f4f4f0'][i], x + 2 + i * 11, b - 12, 9, 2); }
    for (let i = 0; i < 6; i++) p.r('#d8a040', x + 2 + i * 5, b - 3, 4, 2);
  } else if (v === 'opshop') {                             // a rack of coats, a lamp, books
    p.r('#5a5e66', x + 2, y + 3, w - 4, 1);
    for (let i = 0; i < 6; i++) p.r(COLS[Math.floor(hash(i, 8) * COLS.length)], x + 3 + i * 5, y + 4, 4, 9);
    p.r('#f0d040', x + 26, b - 10, 6, 3); p.r('#8a6a42', x + 28, b - 7, 2, 7);
  } else if (v === 'realestate') {                         // listings with eye-watering prices
    for (let i = 0; i < 6; i++) { const lx = x + 2 + (i % 3) * 11, ly = y + 2 + Math.floor(i / 3) * 9; p.r('#f4f4f0', lx, ly, 9, 8); p.r('#7a9a6a', lx + 1, ly + 1, 7, 4); p.r('#c8302a', lx + 1, ly + 6, 7, 1); }
  } else if (v === 'laundro') {                            // machines with socks going round
    for (let i = 0; i < 3; i++) { p.r('#f4f8fa', x + 2 + i * 11, b - 13, 10, 13); p.blob(x + 7 + i * 11, b - 6, 3, '#3a4a5a'); p.r(['#c8443a', '#f5d63a', '#3fa38f'][i], x + 6 + i * 11, b - 6, 2, 2); }
  } else if (v === 'pho') {                                // a steaming bowl and lanterns
    p.blob(x + 16, b - 6, 6, '#f4efe0'); p.r('#c8823a', x + 11, b - 8, 10, 2); p.r('#3a2412', x + 18, b - 15, 1, 7);
    for (const lx of [4, 28]) { p.blob(x + lx, y + 5, 3, '#c8302a'); p.r('#f0d040', x + lx - 1, y + 8, 2, 2); }
  }
}

function nshop(p, v) {
  const s = NSHOPS[v], W = 62, x0 = 1, top = 3, H = 66;
  if (s.brick) bricks(p, x0, top, W, H - top - 1, s.wall, 7);
  else { p.r(s.wall, x0, top, W, H - top - 1); p.r(shade(s.wall, -0.12), x0 + W - 2, top, 2, H - top - 1); }
  p.r(s.trim, x0, top, W, 3); p.r(shade(s.trim, 0.3), x0, top, W, 1);
  p.r(s.trim, x0 + 20, top - 2, 22, 3); p.r(shade(s.trim, 0.3), x0 + 20, top - 2, 22, 1);
  for (const wx of [8, 40]) { p.r(s.trim, wx - 2, top + 7, 18, 16); p.r('#5a6a7a', wx, top + 9, 14, 12); p.r('#8aa4b8', wx + 1, top + 10, 4, 2); p.r(s.trim, wx + 6, top + 9, 1, 12); }
  if (s.awning) { for (let i = 0; i < W; i += 6) p.r(i % 12 ? s.awning[1] : s.awning[0], x0 + i, top + 25, 6, 6); p.r(shade(s.awning[0], -0.3), x0, top + 31, W, 1); }
  else { p.r(shade(s.wall, -0.3), x0, top + 28, W, 3); p.r(shade(s.wall, 0.15), x0, top + 27, W, 1); }
  p.r(shade(s.fascia, -0.3), x0 + 2, top + 33, W - 4, 11); p.r(s.fascia, x0 + 3, top + 34, W - 6, 9); p.r(shade(s.fascia, 0.2), x0 + 3, top + 34, W - 6, 1);
  centred(p, s.label, x0 + W / 2, top + 36, s.ink);
  shopWindow(p, v, x0 + 4, top + 47, 34, H - top - 50);
  p.r('#2a1a10', x0 + 42, top + 46, 14, H - top - 47); p.r(shade(s.fascia, -0.2), x0 + 43, top + 47, 12, H - top - 48);
  p.r('#a8d0e4', x0 + 45, top + 49, 8, 7); p.r('#f0c040', x0 + 53, top + 58, 1, 2);
  if (v === 'realestate') { p.r('#8a6a42', x0 + 58, top + 50, 1, 13); p.r('#f4f4f0', x0 + 54, top + 46, 8, 6); p.text('SOLD', x0 + 54, top + 47, '#c8302a'); }
  p.r(shade(s.wall, -0.35), x0, H - 2, W, 1);
}

export const NORTH = {
  nshop: { foot: [4, 3], tex: [64, 66], variants: Object.keys(NSHOPS), paint(p, v) { nshop(p, v); } },

  // Coburg Town Hall, Bell St, from the owner's photo: red brick with cream
  // render bands, red tile roofs on the two wings, and in the middle the
  // white rendered entry with columns under a little dome. Palms either side.
  townhall: {
    foot: [12, 4], tex: [196, 132], variants: ['merribek'],
    paint(p) {
      const W = 196, H = 132, top = 52, cx = 98, cream = '#ece2c8', cd = shade(cream, -0.14), brick = '#9a4a34';
      p.r('rgba(30,50,20,.22)', 2, H - 2, W - 2, 3);
      // the wings: red tile hip roofs over red brick with cream bands
      for (const [x0, w] of [[2, 70], [124, 70]]) {
        for (let j = 0; j < 22; j++) p.r(j % 3 ? '#b8583a' : '#9a4830', x0 + j, top - 22 + j, w - j * 2, 1);
        p.r('#7a3a28', x0 - 2, top - 1, w + 4, 2);
        bricks(p, x0, top + 1, w, H - top - 12, brick, x0);
        for (const y of [top + 4, top + 30]) p.r(cream, x0, y, w, 3);
        for (let i = 0; i < 3; i++) { const wx = x0 + 8 + i * 22; win(p, wx, top + 10, 10, 16, cream, '#4a5a6a'); p.blob(wx + 5, top + 10, 5, cream); p.blob(wx + 5, top + 10, 4, '#4a5a6a'); win(p, wx, top + 38, 10, 22, cream, '#4a5a6a'); }
      }
      // the centre: a white rendered drum and dome over a portico of columns
      p.r(cream, cx - 26, top - 10, 52, H - top);
      p.r(cd, cx + 23, top - 10, 3, H - top);
      p.r('#f4ecd8', cx - 18, top - 34, 36, 26); p.r(cd, cx + 15, top - 34, 3, 26);                   // the drum
      for (let x = cx - 14; x < cx + 14; x += 7) { p.r('#4a5a6a', x, top - 28, 3, 12); p.blob(x + 1.5, top - 28, 1.5, '#4a5a6a'); }
      for (let j = 0; j < 18; j++) { const half = Math.round(Math.sqrt(Math.max(0, 1 - (j / 18) ** 2)) * 21); p.r(j > 14 ? '#f8f4e8' : '#f0e8d4', cx - half, top - 35 - j, half * 2, 1); }   // the dome
      p.r('#d8ccb0', cx + 6, top - 50, 6, 14); p.r('#c8b898', cx - 1, top - 58, 3, 6); p.blob(cx, top - 58, 2, '#c8a040');
      p.r(shade(cream, 0.15), cx - 28, top - 12, 56, 3); for (let x = cx - 26; x < cx + 26; x += 5) p.r(cd, x, top - 9, 2, 2);   // cornice and dentils
      for (let i = 0; i < 4; i++) { const x = cx - 22 + i * 13; p.r('#faf4e4', x, top + 2, 6, H - top - 16); p.r(cd, x + 5, top + 2, 1, H - top - 16); p.r(cream, x - 1, top + 1, 8, 2); }
      p.r('#3a2a1a', cx - 8, top + 22, 16, H - top - 36); p.r('#6a4a2a', cx - 7, top + 23, 14, H - top - 37); p.r('#f0c040', cx + 3, top + 40, 2, 2);
      p.blob(cx, top + 22, 8, '#3a2a1a'); p.blob(cx, top + 22, 7, '#a8c8d8');                       // fanlight
      box(p, cx - 24, top + 6, 48, 9, '#3a8a7a'); centred(p, 'MERRI-BEK', cx, top + 8, '#f4f4f0');
      // the Aboriginal flag on the dome
      p.r('#1e1e24', cx + 1, top - 66, 10, 3); p.r('#c8302a', cx + 1, top - 63, 10, 3); p.r('#f0d040', cx + 4, top - 65, 3, 2); p.r('#7a5a3a', cx, top - 66, 1, 10);
      // bluestone plinth and steps
      p.r('#5a5e66', 0, H - 11, W, 10); for (let x = 0; x < W; x += 8) p.r('#4a4e56', x, H - 11, 1, 10); p.r('#6a6e76', 0, H - 11, W, 1);
      p.r('#b8b0a0', cx - 18, H - 11, 36, 3); p.r('#a8a090', cx - 20, H - 8, 40, 3); p.r('#989080', cx - 22, H - 5, 44, 4);
      // palms at each end
      for (const x of [8, 188]) { p.r('#8a6a4a', x - 1, top - 6, 3, H - top - 6); for (let i = 0; i < 7; i++) { const a = -Math.PI + i * Math.PI / 6; for (let r = 2; r < 12; r++) p.r(r % 2 ? '#3a7a3a' : '#4a8a3a', x + Math.cos(a) * r, top - 8 + Math.sin(a) * r * 0.7 + r * r * 0.03, 2, 2); } }
    },
  },

  // HM Prison Pentridge's gatehouse, Sydney Rd, Coburg, from the owner's
  // photos: bluestone, two crenellated towers with arrow slits either side of
  // the arched gate, walls running off each way, and one of the new
  // apartment towers standing up behind.
  pentridgegate: {
    foot: [10, 3], tex: [164, 140], variants: ['bluestone'],
    paint(p) {
      const W = 164, H = 140, top = 56, stone = '#7a6e60', sd = shade(stone, -0.2), sl = shade(stone, 0.14);
      // the apartment tower behind
      p.r('#c8ccd4', 104, 0, 40, top + 10); p.r('#a8acb4', 140, 0, 4, top + 10);
      for (let y = 4; y < top + 6; y += 6) for (let x = 108; x < 140; x += 8) p.r(y % 12 ? '#7a9ab8' : '#8aaac8', x, y, 6, 3);
      const blocks = (x, y, w, h) => { p.r(stone, x, y, w, h); for (let j = y; j < y + h; j += 5) { p.r(sd, x, j, w, 1); for (let i = x + ((j / 5) % 2) * 6; i < x + w; i += 12) p.r(sd, i, j, 1, 5); } p.r(sl, x, y, w, 1); };
      const battlements = (x, y, w) => { for (let i = x; i < x + w; i += 8) blocks(i, y - 6, 5, 6); };
      // the walls running off each side
      blocks(0, top + 20, W, H - top - 21); battlements(0, top + 20, 36); battlements(128, top + 20, 36);
      // the towers, each with a turret band and slits
      for (const tx of [38, 98]) {
        blocks(tx, top - 22, 28, H - top + 21); battlements(tx, top - 22, 28);
        p.r(sd, tx - 2, top - 8, 32, 3);
        for (const y of [top - 2, top + 22, top + 46]) p.r('#1e1a18', tx + 12, y, 3, 10);
      }
      // the gatehouse between, with its arched gate
      blocks(66, top, 32, H - top - 1); battlements(66, top, 32);
      p.blob(82, top + 40, 11, '#2a1e14'); p.r('#2a1e14', 71, top + 40, 22, H - top - 41);
      p.r('#5a3a1e', 73, top + 42, 18, H - top - 43); for (let x = 75; x < 91; x += 4) p.r('#4a2e16', x, top + 42, 1, H - top - 43);
      p.r(sl, 70, top + 26, 24, 2);
      p.text('1850', 75, top + 14, '#e8dcc0');
      p.r('rgba(0,0,0,.25)', 0, H - 3, W, 3);
    },
  },

  // A skyrail station: concrete deck on top, a long white canopy, a dark base
  // with a glass entry and a big letter.
  skystation: {
    foot: [10, 3], tex: [164, 100], variants: ['coburg', 'preston'],
    paint(p, v) {
      const sx = 2, W = 160, H = 100, base = 52, accent = v === 'coburg' ? '#e8a030' : '#3ab0a0', letter = v === 'coburg' ? 'C' : 'P';
      p.r('rgba(30,50,20,.25)', sx + 2, H - 2, W, 3);
      if (v === 'preston') {
        // Preston Station from the owner's photos: the skyrail deck, a white
        // lattice screen, then the whole building wrapped in tall rainbow fins
        // over a glass base.
        p.r('#b8bcb8', sx, 2, W, 10); p.r('#d0d4d0', sx, 2, W, 2); p.r('#8a8e8a', sx, 10, W, 2);
        p.r('#f4f4f0', sx, 12, W, 12); for (let x = sx; x < sx + W; x += 6) { p.r('#c8ccd0', x, 13, 1, 10); p.r('#c8ccd0', x + 3, 15, 1, 6); } p.r('#d8dcdf', sx, 18, W, 1);
        const fins = ['#e8508a', '#9a4ab8', '#f0c030', '#3aa84a', '#e8742a', '#3a7ad8', '#f07ab0', '#b8d040', '#2ab0b0', '#c83a3a'];
        for (let i = 0; i < 32; i++) { const x = sx + i * 5, c = fins[(i * 3) % fins.length], top = 24 + (i % 3); p.r(c, x, top, 4, H - top - 18); p.r(shade(c, 0.25), x, top, 1, H - top - 18); p.r(shade(c, -0.25), x + 3, top, 1, H - top - 18); p.blob(x + 2, top, 2, c); }
        p.r('#2a2e33', sx, H - 18, W, 17); p.r('#6a8a9a', sx + 2, H - 16, W - 4, 13);
        for (let x = sx + 2; x < sx + W - 2; x += 14) p.r('#2a2e33', x, H - 16, 1, 13);
        p.r('#2a2e33', sx + 68, H - 18, 24, 17); p.r('#a8c8d8', sx + 69, H - 17, 22, 15); p.r('#2a2e33', sx + 79, H - 17, 2, 15);
        p.r('#f4f4f0', sx + 14, H - 15, 22, 10); p.r('#1e3a8a', sx + 15, H - 14, 20, 8); p.text('MYKI', sx + 18, H - 13, '#f4f4f0');
        p.r('#f4f4f0', sx + 108, H - 15, 34, 9); p.text('PRESTON', sx + 111, H - 13, '#1e3a8a');
        return;
      }
      // concrete deck and a train-height parapet
      p.r('#b8bcb8', sx, 6, W, 14); p.r('#d0d4d0', sx, 6, W, 2); p.r('#8a8e8a', sx, 18, W, 2);
      for (let x = sx + 6; x < sx + W; x += 26) p.r('#a8aca8', x, 8, 1, 10);
      // the canopy: a long white wave
      for (let i = 0; i < 20; i++) { const x = sx + i * 8, t = 22 + Math.round(Math.sin(i * 0.6) * 3); p.r(i % 2 ? '#f4f8f4' : '#e0e6e2', x, t, 8, base - t); p.r('#c0c8c4', x, t, 8, 1); }
      p.r(accent, sx, base - 3, W, 3);
      // base
      p.r('#24272c', sx, base, W, H - base); for (let x = sx; x < sx + W; x += 16) p.r('#30343a', x, base, 1, H - base);
      p.r('#2a2e33', sx + 58, base + 8, 44, H - base - 8); p.r('#6a8a9a', sx + 60, base + 10, 40, H - base - 10); p.r('#2a2e33', sx + 79, base + 10, 2, H - base - 10);
      p.r('#9ab8c8', sx + 62, base + 12, 6, 3);
      // the big letter
      p.ctx.save(); p.ctx.translate(sx + 122, base + 8); p.ctx.scale(5, 5); p.text(letter, 0, 0, accent); p.ctx.restore();
      const name = v === 'coburg' ? 'COBURG' : 'PRESTON';
      centred(p, name, sx + 129, base + 36, '#c8ccd0');
      p.r('#f4f4f0', sx + 14, base + 10, 22, 14); p.r('#1e3a8a', sx + 15, base + 11, 20, 12); p.text('MYKI', sx + 18, base + 14, '#f4f4f0');
    },
  },

  // Coburg Station, from the owner's photo: the old red brick station
  // building, cream render around arched windows, a central gable with a
  // tall ornate chimney, and the skyrail deck running above behind it.
  coburgstation: {
    foot: [10, 3], tex: [164, 112], variants: ['heritage'],
    paint(p) {
      const W = 164, H = 112, wall = 56, cream = '#ece0c0', cd = shade(cream, -0.16), brick = '#a04a34';
      p.r('rgba(30,50,20,.25)', 4, H - 2, W - 4, 3);
      // the skyrail deck behind
      p.r('#b8bcb8', 0, 8, W, 12); p.r('#d0d4d0', 0, 8, W, 2); p.r('#8a8e8a', 0, 18, W, 2);
      // slate roof, with the central gable rising through it
      for (let j = 0; j < 22; j++) p.r(j % 3 ? '#5a5e66' : '#4a4e56', 4 + j, wall - 22 + j, W - 8 - j * 2, 1);
      p.r('#3a3e46', 2, wall - 1, W - 4, 2);
      for (let j = 0; j < 30; j++) p.r(j < 2 ? cd : brick, 82 - j, wall - 30 + j, j * 2, 1);                 // the gable
      p.r(cream, 64, wall - 4, 36, 3);
      p.blob(82, wall - 14, 5, cream); p.blob(82, wall - 14, 4, '#4a5a6a');                                  // round vent
      bricks(p, 76, wall - 56, 12, 28, brick, 3); p.r(cream, 74, wall - 58, 16, 3); p.r(cream, 76, wall - 44, 12, 2);   // the tall chimney
      p.r('#8a3a2a', 79, wall - 62, 6, 4);
      // the brick walls with cream bands
      bricks(p, 4, wall, W - 8, H - wall - 1, brick, 9);
      p.r(cream, 4, wall + 2, W - 8, 3); p.r(cd, 4, wall + 5, W - 8, 1); p.r(cream, 4, H - 12, W - 8, 2);
      // arched windows in cream surrounds, and the central arched doorway
      const arch = (x, y, w, h) => { p.r(cream, x - 2, y, w + 4, h + 2); p.blob(x + w / 2, y, w / 2 + 2, cream); p.r('#4a5a6a', x, y, w, h); p.blob(x + w / 2, y, w / 2, '#4a5a6a'); p.r('#7a9ab0', x + 1, y + 1, 2, 3); p.r(cream, x, y + h / 2, w, 1); };
      for (const x of [14, 34, 54, 104, 124, 144]) arch(x, wall + 18, 10, 22);
      p.r(cream, 70, wall + 10, 24, H - wall - 11); p.blob(82, wall + 14, 12, cream);
      p.r('#3a2a1a', 74, wall + 16, 16, H - wall - 17); p.blob(82, wall + 16, 8, '#3a2a1a'); p.blob(82, wall + 16, 6, '#a8c8d8'); p.r('#6a4a2a', 75, wall + 22, 14, H - wall - 23);
      p.r('#f0c040', 86, wall + 38, 2, 2);
      centred(p, 'COBURG', 82, wall + 6, '#6a2a1a');
      // the myki panel by the door
      p.r('#f4f4f0', 96, H - 30, 22, 14); p.r('#1e3a8a', 97, H - 29, 20, 12); p.text('MYKI', 99, H - 26, '#f4f4f0');
    },
  },

  // The Coburg Library hub: glass, timber fins and a green roof edge.
  library: {
    foot: [8, 3], tex: [128, 72], variants: ['coburg'],
    paint(p) {
      const W = 128, H = 72, top = 8;
      p.r('rgba(30,50,20,.22)', 2, H - 2, W - 2, 3);
      p.r('#3a8a5a', 0, top - 4, W, 5); p.r('#5aaa7a', 0, top - 4, W, 1);
      p.r('#5a6a78', 0, top, W, H - top - 1);
      for (let x = 0; x < W; x += 8) { p.r('#8aa4b8', x + 1, top + 2, 6, H - top - 6); p.r('#b8d0dc', x + 2, top + 3, 2, 3); }
      for (let x = 4; x < W; x += 12) p.r('#b8864a', x, top, 3, H - top - 1);           // timber fins
      // shelves seen through the glass
      for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) p.r(COLS[Math.floor(hash(i, j, 2) * COLS.length)], 10 + i * 18, top + 20 + j * 8, 10, 4);
      box(p, 34, top + 4, 60, 10, '#f4f4f0'); centred(p, 'COBURG LIBRARY', 64, top + 7, '#2a5a3a');
      p.r('#2a2e33', 56, top + 44, 16, H - top - 45); p.r('#a8c8d8', 57, top + 45, 14, H - top - 46); p.r('#2a2e33', 63, top + 45, 2, H - top - 46);
    },
  },

  // Preston Market stalls: a striped awning on poles over a counter of stock.
  stall: {
    foot: [3, 2], tex: [48, 48], variants: ['deli', 'fruit', 'fish', 'cakes', 'plants', 'shut'],
    paint(p, v) {
      const awn = { deli: ['#c8302a', '#f4efe0'], fruit: ['#3a8a3a', '#f4efe0'], fish: ['#2a6ab8', '#f4efe0'], cakes: ['#f07ab0', '#f4efe0'], plants: ['#6a8a3a', '#e8d8a0'], shut: ['#8a8e96', '#c8ccd0'] }[v];
      p.r('rgba(30,50,20,.22)', 2, 45, 44, 3);
      p.r('#5a5e66', 2, 8, 2, 38); p.r('#5a5e66', 44, 8, 2, 38);
      for (let i = 0; i < 48; i += 6) p.r(i % 12 ? awn[1] : awn[0], i, 4, 6, 8);
      for (let i = 0; i < 48; i += 6) p.blob(i + 3, 12, 3, i % 12 ? awn[1] : awn[0]);
      p.r(shade(awn[0], -0.3), 0, 4, 48, 1);
      // counter
      p.r('#8a6a42', 1, 28, 46, 18); p.r('#a8845a', 1, 28, 46, 2); p.r('#6a4a2a', 1, 44, 46, 2);
      const goods = {
        deli: () => { for (let i = 0; i < 4; i++) { p.r('#f4e8a0', 4 + i * 10, 24, 8, 5); p.r('#e8d070', 4 + i * 10, 28, 8, 1); } p.r('#a0302a', 8, 14, 3, 9); p.r('#a0302a', 20, 14, 3, 11); p.r('#c8823a', 32, 14, 3, 8); p.r('#2a3a1e', 38, 22, 6, 6); p.r('#5a7a2a', 39, 23, 4, 4); },
        fruit: () => { for (let i = 0; i < 6; i++) { const c = ['#c8302a', '#f0a030', '#f0d040', '#5aa83a', '#7a3a8a', '#e85a3a'][i]; p.r('#c8a070', 2 + i * 7, 22, 7, 6); for (let k = 0; k < 3; k++) p.blob(4 + i * 7 + k * 2, 22, 1.5, c); } },
        fish: () => { p.r('#e8f0f4', 2, 23, 44, 5); for (let i = 0; i < 5; i++) { p.r('#9fb8c8', 4 + i * 8, 22, 7, 3); p.r('#d8e8f0', 4 + i * 8, 22, 7, 1); p.r('#3a4a5a', 4 + i * 8, 23, 1, 1); } p.r('#e8826a', 10, 20, 4, 2); },
        cakes: () => { for (let i = 0; i < 4; i++) { p.r('#f4e8d0', 4 + i * 10, 22, 8, 6); p.r(['#f07ab0', '#6a3a1a', '#f4f4f0', '#d8a040'][i], 4 + i * 10, 21, 8, 2); } },
        plants: () => { for (let i = 0; i < 6; i++) { p.r('#b8643a', 3 + i * 7, 24, 5, 4); p.blob(5 + i * 7, 21, 3, i % 2 ? '#3f8a3e' : '#5aa84a'); } p.blob(14, 18, 2, '#f07ab0'); },
        shut: () => { p.r('#a8acb4', 2, 13, 44, 15); for (let j = 13; j < 28; j += 3) p.r('#8a8e96', 2, j, 44, 1); p.r('#f4f4f0', 8, 16, 32, 9); p.text('SAVE', 16, 17, '#c8302a'); p.text('US', 20, 22, '#c8302a'); },
      };
      goods[v]();
    },
  },
  // Preston Market's big open shed (the owner's photos): steel columns and
  // timber trusses under a pale roof you can half see through, drawn over
  // the stalls and faded right back when you walk in under it.
  marketroof: {
    foot: [42, 14], tex: [672, 236], variants: ['shed'], roof: true, solid: false,
    paint(p) {
      const W = 672, H = 236, eave = 12;
      p.r('rgba(220,226,222,0.28)', 0, eave, W, H - eave - 6);                 // the roof sheets, half see-through
      for (let y = eave; y < H - 6; y += 16) p.r('rgba(160,170,166,0.35)', 0, y, W, 1);
      p.r('#6a7a6a', 0, 0, W, eave); p.r('#8a9a8a', 0, 0, W, 2); p.r('#4a5a4a', 0, eave - 2, W, 2);   // the gutter edge along the front
      for (let x = 8; x < W; x += 56) {
        p.r('#8a5a2e', x - 20, eave, 40, 3);                                     // timber truss
        for (let i = 0; i < 20; i++) p.r('#a87040', x - 20 + i * 2, eave + 3 + Math.abs(10 - i), 2, 2);
        p.r('#4a6a4a', x, eave, 4, H - eave); p.r('#6a8a6a', x, eave, 1, H - eave);   // steel column
      }
      p.r('#4a5a4a', 0, H - 6, W, 3);
    },
  },
  // The mural wall along the front of the market: a low building painted
  // with fruit, veg and smiling stallholders, PRESTON MARKET in the corner.
  marketmural: {
    foot: [14, 2], tex: [224, 64], variants: ['left', 'right'],
    paint(p, v) {
      const W = 224, H = 64, top = 12;
      p.r('#d8d0c0', 0, 4, W, 10); p.r('#e8e0d0', 0, 4, W, 2);
      p.r('#f0d040', 0, top, W, H - top - 1);
      const cols = ['#e8302a', '#3aa84a', '#e8742a', '#3a7ad8', '#e77fb8', '#2a2a30'];
      for (let i = 0; i < 18; i++) { const x = 6 + i * 12, y = top + 14 + (i % 3) * 8; p.blob(x, y, 5, cols[(i + (v === 'right' ? 2 : 0)) % cols.length]); p.r('#2a2a30', x - 1, y - 1, 1, 1); p.r('#3aa84a', x, y - 6, 2, 2); }
      for (let i = 0; i < 3; i++) { const x = 30 + i * 70; p.r('#f4efe0', x, top + 6, 22, 30); p.blob(x + 11, top + 10, 6, '#f2c79a'); p.r('#2a2a30', x + 8, top + 9, 2, 2); p.r('#2a2a30', x + 13, top + 9, 2, 2); p.r('#c8302a', x + 9, top + 13, 5, 1); p.r(cols[i], x + 2, top + 18, 18, 18); }   // stallholders
      if (v === 'left') { p.r('#f4f4f0', 4, top + 2, 46, 18); p.text('PRESTON', 8, top + 5, '#2a2a30'); p.text('MARKET', 10, top + 12, '#2a2a30'); }
      else { p.r('#2a2a30', W - 70, top + 4, 64, 12); p.text('FRESH DAILY', W - 66, top + 7, '#f0d040'); }
      p.r('#2a2a30', 0, H - 4, W, 3);
    },
  },
  // The green steel arch over the market entrance, PRESTON MARKET in script
  // on its round sign (walk under it).
  marketarch: {
    foot: [6, 1], tex: [96, 72], variants: ['green'], roof: true,
    paint(p) {
      const G = '#2a7a4a', L = '#4a9a6a';
      for (const x of [4, 88]) { p.r(G, x, 20, 4, 52); p.r(L, x, 20, 1, 52); }
      for (let i = 0; i < 84; i++) { const y = 24 - Math.round(Math.sin(i / 83 * Math.PI) * 12); p.r(G, 6 + i, y, 1, 3); p.r(L, 6 + i, y, 1, 1); }
      for (let i = 0; i < 8; i++) p.r(G, 12 + i * 10, 24 - Math.round(Math.sin((i * 10 + 6) / 83 * Math.PI) * 12), 1, 14);   // ribs
      p.blob(48, 14, 13, G); p.blob(48, 14, 11, '#f4efe0');
      p.text('PRESTON', 34, 9, G); p.text('MARKET', 36, 16, G);
    },
  },
  marketsign: {
    foot: [1, 1], tex: [48, 72], variants: ['preston'],
    paint(p) {
      p.shadow(24, 71, 14); p.r('#5a5e66', 21, 30, 6, 41); p.r('#7a7e86', 21, 30, 1, 41);
      box(p, 2, 2, 44, 30, '#f4f4f0'); p.r('#c8302a', 3, 3, 42, 3); p.r('#2a6ab8', 3, 27, 42, 3);
      centred(p, 'PRESTON', 24, 10, '#2a6ab8'); centred(p, 'MARKET', 24, 17, '#c8302a');
    },
  },
  placard: {
    foot: [1, 1], tex: [28, 34], variants: ['save'], solid: false,
    paint(p) {
      p.r('#8a6a42', 13, 16, 2, 18); box(p, 1, 1, 26, 17, '#f4f4f0'); p.r('#c8302a', 1, 1, 26, 2);
      centred(p, 'SAVE', 14, 4, '#c8302a'); centred(p, 'PRESTON', 14, 9, '#1e1e24'); centred(p, 'MARKET', 14, 13, '#1e1e24');
    },
  },
  coffeecart: {
    foot: [2, 1], tex: [32, 38], variants: ['cart'],
    paint(p) {
      p.shadow(16, 37, 28);
      for (let i = 0; i < 32; i += 4) p.r(i % 8 ? '#f4efe0' : '#2a5a4a', i, 2, 4, 6); p.r('#1e3a30', 0, 8, 32, 1);
      p.r('#5a5e66', 2, 8, 1, 14); p.r('#5a5e66', 29, 8, 1, 14);
      p.r('#2a5a4a', 1, 20, 30, 14); p.r('#3a7a64', 1, 20, 30, 2); p.text('COFFEE', 5, 25, '#f4efe0');
      p.r('#c8ccd2', 8, 14, 10, 6); p.r('#1e1e24', 10, 17, 2, 3); p.r('#1e1e24', 14, 17, 2, 3); p.r('#f4f4f0', 22, 16, 3, 4);
      p.blob(6, 35, 2.5, '#1e1e22'); p.blob(26, 35, 2.5, '#1e1e22');
    },
  },
  // The bluestone weir at Coburg Lake: water pours over in a white sheet.
  weir: {
    foot: [6, 1], tex: [96, 26], variants: ['bluestone'],
    paint(p) {
      p.r('#4a4e58', 0, 4, 96, 12); for (let x = 0; x < 96; x += 7) p.r('#3a3e48', x, 4, 1, 12); p.r('#6a6e78', 0, 4, 96, 2); p.r('#5a5e68', 0, 9, 96, 1);
      p.r('#e8f4f8', 0, 16, 96, 6); for (let x = 0; x < 96; x += 3) p.r(x % 2 ? '#c8e4f0' : '#ffffff', x, 16 + (x % 4), 2, 6);
      for (let x = 2; x < 96; x += 5) p.blob(x, 23, 1.5, '#f4fafc');
    },
  },
  rotunda: {
    foot: [3, 3], tex: [52, 64], variants: ['heritage'],
    paint(p) {
      p.shadow(26, 63, 46);
      // roof: a little bell-shaped dome in green tin
      for (let j = 0; j < 16; j++) { const w = 6 + j * 2.6; p.r(j % 3 ? '#3a7a5a' : '#2a6a4a', Math.round(26 - w / 2), 4 + j, Math.round(w), 1); }
      p.r('#c8b898', 25, 0, 2, 5); p.r('#f4f4f0', 2, 20, 48, 3); for (let x = 3; x < 48; x += 4) p.r('#c8c4b8', x, 23, 2, 2);
      for (const x of [4, 17, 32, 46]) { p.r('#f4f4f0', x, 23, 3, 30); p.r('#c8c4b8', x + 2, 23, 1, 30); }
      p.r('#d8d0c0', 0, 52, 52, 4); p.r('#b8b0a0', 0, 56, 52, 6); p.r('#e8e0d0', 0, 52, 52, 1);
      for (let x = 4; x < 48; x += 3) p.r('#f4f4f0', x, 44, 1, 8); p.r('#f4f4f0', 4, 44, 44, 1);
    },
  },
  woodoven: {
    foot: [3, 2], tex: [48, 52], variants: ['pide'],
    paint(p) {
      p.shadow(24, 51, 44);
      p.blob(24, 24, 20, '#a8553a'); p.r('#a8553a', 4, 24, 40, 26);
      bricks(p, 4, 24, 40, 26, '#a8553a', 3);
      for (let j = 0; j < 20; j++) { const w = Math.round(Math.sqrt(400 - (20 - j) * (20 - j))); p.r(j % 3 ? '#a8553a' : '#8e4430', 24 - w, 4 + j, w * 2, 1); }
      p.r('#c8b898', 20, 0, 8, 6);
      p.r('#1e1210', 14, 28, 20, 14); p.blob(24, 28, 10, '#1e1210');
      p.r('#f0a030', 16, 36, 16, 5); p.r('#e8502a', 18, 34, 12, 3); p.r('#f8d060', 20, 37, 8, 2);
      p.r('#8a8e96', 6, 44, 36, 2);
    },
  },
  bakecase: {
    foot: [3, 1], tex: [48, 32], variants: ['breads'],
    paint(p) {
      p.shadow(24, 31, 46);
      p.r('#8a6a42', 0, 18, 48, 14); p.r('#a8845a', 0, 18, 48, 2);
      p.r('#c8e0ec', 1, 4, 46, 14); p.r('#e8f4f8', 1, 4, 46, 1); p.r('#2a2e33', 0, 3, 48, 1);
      for (let i = 0; i < 4; i++) { p.r('#c8823a', 3 + i * 11, 13, 9, 3); p.r('#e8b060', 4 + i * 11, 13, 7, 1); }
      for (let i = 0; i < 5; i++) { p.blob(5 + i * 9, 8, 2.5, '#b8702a'); p.r('#c8e0ec', 5 + i * 9, 8, 1, 1); }
    },
  },
  // Betty and Ward's place, Moreland Rd at Lygon St (from the owner's Street View
  // shots): two storeys, a red brick pier up the corner, white render, glass
  // balconies under a flat roof, and a taupe rendered front wall with lattice.
  bettyhouse: {
    foot: [7, 3], tex: [116, 92], variants: ['moreland'],
    paint(p) {
      const W = 112, x0 = 2, H = 92, top = 10, white = '#eceae4', taupe = '#a89a88';
      p.r('rgba(30,50,20,.22)', x0 + 2, H - 2, W - 2, 3);
      // flat roof slab and upper floor
      p.r('#8a8078', x0, top, W, 5); p.r('#a89e94', x0, top, W, 1);
      p.r(white, x0 + 4, top + 5, W - 8, 30); p.r(shade(white, -0.1), x0 + W - 8, top + 5, 4, 30);
      for (const wx of [14, 60]) { p.r('#4a5560', x0 + wx, top + 10, 30, 18); p.r('#7a8a98', x0 + wx + 2, top + 12, 8, 3); }
      // glass balcony balustrades
      p.r('#8a8078', x0, top + 34, W, 3);
      p.r('rgba(170,210,225,.75)', x0 + 6, top + 26, W - 30, 8); p.r('#c8dce4', x0 + 6, top + 26, W - 30, 1);
      for (let x = x0 + 6; x < x0 + W - 24; x += 14) p.r('#9aa8b0', x, top + 26, 1, 8);
      // ground floor
      p.r(white, x0 + 4, top + 37, W - 8, 36); p.r(shade(white, -0.1), x0 + W - 8, top + 37, 4, 36);
      p.r('#3a2a20', x0 + 40, top + 44, 12, 26); p.r('#6a4a32', x0 + 41, top + 45, 10, 25); p.r('#c8a040', x0 + 49, top + 57, 1, 2);
      p.r('#4a5560', x0 + 60, top + 44, 22, 16); p.r('#7a8a98', x0 + 62, top + 46, 6, 3);
      p.r('#c8ccd0', x0 + 30, top + 48, 6, 8); p.r('#5a5e66', x0 + 31, top + 49, 4, 3);   // intercom
      // the red brick pier up the corner, and one on the right
      for (const [bx, bw] of [[x0 + 88, 12], [x0 + 104, 6]]) bricks(p, bx, top - 4, bw, H - top - 6, '#a8503a', 4);
      // the taupe front wall with lattice on top, ivy spilling over
      p.r(taupe, x0, H - 20, W, 18); p.r(shade(taupe, 0.12), x0, H - 20, W, 1); p.r(shade(taupe, -0.15), x0, H - 4, W, 2);
      for (let x = x0 + 30; x < x0 + 70; x += 3) p.r('#8a7a68', x, H - 26, 1, 6); p.r('#8a7a68', x0 + 30, H - 26, 40, 1); p.r('#8a7a68', x0 + 30, H - 23, 40, 1);
      for (let i = 0; i < 18; i++) p.blob(x0 + 72 + (i % 9) * 4, H - 20 + Math.floor(i / 9) * 3 + (i % 2), 2, i % 3 ? '#4a7a3a' : '#5a9a4a');
      for (let i = 0; i < 6; i++) p.blob(x0 + 4 + i * 4, H - 20 + (i % 2), 2, '#4a7a3a');
      p.r(shade(taupe, -0.3), x0 + 44, H - 20, 8, 16);   // gate
    },
  },
  // Alison's apartments, Murray Rd at St Georges Rd, Preston: four floors of
  // dark brown panels with deep balconies, a few framed in white boxes, a red
  // stripe up the side, glass balustrades along a grey base, and young trees.
  alisonapts: {
    foot: [12, 3], tex: [196, 132], variants: ['murray'],
    paint(p) {
      const sx = 2, W = 192, H = 132, top = 8, base = 104, brown = '#5a4844';
      p.r('rgba(30,50,20,.22)', sx + 2, H - 2, W - 2, 3);
      p.r(brown, sx, top, W, base - top); p.r('#6a5854', sx, top, W, 2);
      for (let f = 0; f < 4; f++) {
        const y = top + 4 + f * 24;
        for (let i = 0; i < 6; i++) {
          const x = sx + 6 + i * 31 + (f % 2) * 8;
          if (x + 24 > sx + W - 34 && x < sx + W - 20) continue;
          p.r('#2a2224', x, y, 22, 16); p.r('#4a5a66', x + 3, y + 3, 16, 9); p.r('#6a7a86', x + 4, y + 4, 4, 2);
          p.r('#7a6864', x - 1, y + 16, 24, 3);
          if ((i + f) % 4 === 1) { p.r('#e8e8e4', x - 3, y - 3, 28, 3); p.r('#e8e8e4', x - 3, y + 16, 28, 3); p.r('#e8e8e4', x - 3, y - 3, 3, 22); p.r('#e8e8e4', x + 22, y - 3, 3, 22); }
        }
      }
      p.r('#b8402e', sx + W - 34, top, 14, base - top + 6); p.r('#c8503e', sx + W - 34, top, 2, base - top + 6);   // the red stripe
      // the grey base wall with a glass balustrade on top
      p.r('#5a5e64', sx, base, W, H - base - 2); p.r('#6a6e74', sx, base, W, 1);
      p.r('rgba(170,200,205,.8)', sx, base - 8, W, 8); for (let x = sx; x < sx + W; x += 16) p.r('#8a9aa0', x, base - 8, 1, 8);
      p.r('#3a3e44', sx + 84, base + 4, 16, H - base - 6); p.r('#7a8a98', sx + 86, base + 6, 12, 10);   // entry
      p.r('#c8ccd0', sx + 102, base + 8, 6, 8); p.text('388', sx + 101, base + 18, '#e8e8e4');
    },
  },
};

// Item icons, 12x12 (see ITEM_ART in items.js).
export const NORTH_ITEM_ART = {
  pide: { pal: { a: '#d8923a', b: '#f0c070', k: '#8a5a2e', y: '#f4d040', g: '#3a8a3a' }, rows: [
    '............', '............', '............', 'kk........kk', 'kakkkkkkkkak', 'kabyybgyybak',
    'kabyyygyybak', '.kaabbbbbak.', '..kkkkkkkk..', '............', '............', '............'] },
  fetta: { pal: { a: '#f4f4ec', b: '#ffffff', k: '#b8b8a8', w: '#c8dcec' }, rows: [
    '............', '............', '..wwwwwwww..', '.w........w.', '.w.kkkkkk.w.', '.w.kabbak.w.',
    '.w.kaaaak.w.', '.w.kaaaak.w.', '.w.kkkkkk.w.', '.wwwwwwwwww.', '............', '............'] },
  baklava: { pal: { a: '#d8a040', b: '#f0c870', k: '#8a5a1e', g: '#5a9a3a' }, rows: [
    '............', '............', '............', '.....kk.....', '....kbbk....', '...kbgbbk...',
    '..kbbbbgbk..', '.kaaaaaaaak.', 'kbbbbbbbbbbk', 'kaaaaaaaaaak', '.kkkkkkkkkk.', '............'] },
  olivejar: { pal: { a: '#c8dcd0', b: '#e8f4ec', k: '#5a6a60', o: '#4a2a3a', l: '#f4efe0', c: '#c8a040' }, rows: [
    '............', '...cccccc...', '...cccccc...', '..kaaaaaak..', '.kaboaooaak.', '.kaoaollaak.',
    '.kaaoalloak.', '.kaooaaoaak.', '.kaaoaoaoak.', '.kaaaaaaaak.', '..kkkkkkkk..', '............'] },
  cardigan: { pal: { a: '#c8643a', b: '#e8885a', k: '#7a3a1a', w: '#f4efe0' }, rows: [
    '............', '...kk..kk...', '..kaak.kaak.', '.kaaaakaaaak', 'kaabaawaabak', 'kak.aawaa.ak',
    'kak.aawaa.ak', 'kk..abwba..k', '....aawaa...', '....kkwkk...', '............', '............'] },
  // Betty's cooking (everyone loves it)
  doro: { pal: { a: '#c8b088', b: '#e0cca8', k: '#8a7050', r: '#8a2a1a', o: '#c8502a', e: '#f4efe0' }, rows: [
    '............', '..kkkkkkkk..', '.kaabaabaak.', 'kabrrorrabak', 'kaborreroabk', 'kabrrorrorak',
    'kaboroorrbak', 'kabarrrorbak', '.kaabaabaak.', '..kkkkkkkk..', '............', '............'] },
  misir: { pal: { a: '#c8b088', b: '#e0cca8', k: '#8a7050', r: '#c8502a', o: '#e8783a' }, rows: [
    '............', '..kkkkkkkk..', '.kaabaabaak.', 'kabaroorabak', 'kaborrrroabk', 'kabrorrorrak',
    'kaborrrroabk', 'kabaroorabak', '.kaabaabaak.', '..kkkkkkkk..', '............', '............'] },
  shiro: { pal: { a: '#3a3a3a', b: '#5a5a5a', k: '#1e1e1e', y: '#c8903a', o: '#e0b060' }, rows: [
    '............', '............', '............', '.kkkkkkkkkk.', 'kbaaaaaaaabk', 'kayyoyyoyyak',
    'kayoyyyyoyak', 'kayyyoyyyyak', '.kayyyyyyak.', '..kkkkkkkk..', '............', '............'] },
  sambusa: { pal: { a: '#d8a050', b: '#f0c878', k: '#8a5a2a', g: '#5a9a3a' }, rows: [
    '............', '............', '.....k......', '....kbk.....', '...kbak.....', '..kbaaak..k.',
    '.kbaaaak.kbk', 'kbaaaaaakbak', 'kkkkkkkkbaak', '......kkkkkk', '...g........', '............'] },
};

// Battle foes, same format as FOE_ART in enemies.js: [width, height, paint(p)].
function face(p, x, y, gap = 4) {
  p.r('#ffffff', x, y, 2, 2); p.r('#ffffff', x + gap, y, 2, 2);
  p.r('#1a1010', x + 1, y + 1, 1, 1); p.r('#1a1010', x + gap, y + 1, 1, 1);
  p.r('#1a1010', x, y - 1, 2, 1); p.r('#1a1010', x + gap, y - 1, 2, 1);
  p.r('#1a1010', x + 2, y + 3, gap - 2, 1);
}
export const NORTH_FOE_ART = {
  cravat: [16, 16, p => {                                   // a silk cravat, knotted
    p.r('#d86a1a', 4, 2, 8, 3); p.r('#f09040', 5, 2, 6, 1); p.r('#a84a10', 6, 5, 4, 3);
    p.r('#d86a1a', 4, 8, 4, 7); p.r('#d86a1a', 8, 8, 4, 6); p.r('#f0b060', 5, 9, 1, 4); p.r('#a84a10', 11, 8, 1, 6);
    face(p, 5, 3, 4);
  }],
  beret: [16, 16, p => {                                    // a black beret with eyes
    p.r('#1e1e22', 1, 6, 14, 5); p.r('#1e1e22', 3, 4, 10, 2); p.r('#3a3a42', 4, 4, 6, 1); p.r('#1e1e22', 7, 2, 2, 2);
    p.r('#2a2a30', 2, 11, 12, 2); p.r('#c8302a', 2, 11, 12, 1);
    face(p, 5, 7, 4);
  }],
  myki: [16, 16, p => {                                     // a myki card, cross
    p.r('#1e1e22', 1, 3, 14, 10); p.r('#2a2a30', 1, 3, 14, 1);
    p.r('#9ac83a', 1, 9, 14, 2); p.r('#c8e86a', 1, 9, 14, 1);
    p.r('#f4f4f0', 3, 4, 5, 1); face(p, 5, 6, 4);
  }],
  reader: [16, 20, p => {                                   // a myki reader on its post
    p.r('#5a5e66', 6, 12, 4, 8); p.r('#7a7e86', 6, 12, 1, 8);
    p.r('#e8a030', 2, 1, 12, 12); p.r('#f0c060', 2, 1, 12, 1); p.r('#b8781a', 13, 1, 1, 12);
    p.r('#1e1e22', 4, 3, 8, 5); p.r('#3ac83a', 5, 4, 6, 1); face(p, 5, 9, 4);
  }],
  swan: [16, 16, p => {                                     // a black swan, red beak
    p.r('#1e1e24', 2, 9, 10, 5); p.r('#2a2a32', 3, 8, 8, 2); p.r('#f4f4f0', 3, 10, 2, 1);
    p.r('#1e1e24', 11, 3, 2, 7); p.r('#1e1e24', 11, 2, 4, 2); p.r('#c8302a', 14, 3, 2, 1); p.r('#f4f4f0', 13, 2, 1, 1);
    p.r('#7ab8d8', 0, 14, 16, 2);
  }],
  render: [16, 20, p => {                                   // an artist's impression on an easel: glossy townhouses
    p.r('#8a6a42', 3, 12, 1, 8); p.r('#8a6a42', 12, 12, 1, 8);
    p.r('#f4f4f0', 1, 1, 14, 12); p.r('#a8d0f0', 2, 2, 12, 5);
    p.r('#c8ccd0', 3, 5, 3, 6); p.r('#8a8e96', 7, 4, 3, 7); p.r('#c8ccd0', 11, 6, 2, 5); p.r('#3a8a3a', 2, 10, 12, 2);
    face(p, 5, 7, 4);
  }],
  trolley: [16, 16, p => {                                  // a runaway shopping trolley
    p.r('#8a8e96', 2, 3, 12, 1); p.r('#8a8e96', 3, 10, 10, 1);
    for (let x = 3; x < 14; x += 2) p.r('#a8acb4', x, 4, 1, 6);
    for (let y = 4; y < 10; y += 2) p.r('#a8acb4', 3, y, 10, 1);
    p.r('#c8302a', 13, 1, 3, 2); p.r('#5a5e66', 14, 3, 1, 8);
    p.blob(4, 13, 1.6, '#1e1e22'); p.blob(12, 13, 1.6, '#1e1e22');
  }],
  // Alison's team: her toastie, her "boob pillows", and Alison herself, as a slug.
  toastie: [16, 16, p => {                                  // the same toasted sandwich, sun-dried tomato peeking out
    p.r('#c8823a', 1, 4, 14, 9); p.r('#e8b060', 2, 4, 12, 2); p.r('#a0602a', 1, 12, 14, 1);
    for (let x = 3; x < 14; x += 3) p.r('#8a4a1a', x, 6, 1, 6);                           // grill marks
    p.r('#f4d040', 0, 9, 3, 2); p.r('#f4d040', 13, 10, 3, 2); p.r('#f4d040', 6, 13, 3, 2);   // cheese oozing
    p.r('#b8302a', 10, 13, 3, 1);
    p.r('#ffffff', 5, 7, 2, 2); p.r('#ffffff', 9, 7, 2, 2); p.r('#1a1010', 6, 8, 1, 1); p.r('#1a1010', 9, 8, 1, 1); p.r('#1a1010', 7, 10, 2, 1);
  }],
  boobpillows: [16, 16, p => {                              // two very, very thin pillows
    for (const y of [5, 10]) { p.r('#f0e8f0', 1, y, 14, 3); p.r('#ffffff', 2, y, 12, 1); p.r('#c8b8c8', 1, y + 2, 14, 1); p.r('#c8b8c8', 0, y + 1, 1, 1); p.r('#c8b8c8', 15, y + 1, 1, 1); }
    p.r('#1a1010', 6, 6, 1, 1); p.r('#1a1010', 9, 6, 1, 1); p.r('#1a1010', 6, 11, 1, 1); p.r('#1a1010', 9, 11, 1, 1);
  }],
  slugalison: [16, 16, p => {                               // a slug with Alison's brown bob
    p.r('#8a7a5a', 1, 11, 13, 4); p.r('#a8987a', 2, 11, 10, 1); p.r('#6a5a42', 1, 14, 13, 1);
    p.r('#8a7a5a', 9, 6, 6, 6); p.r('#a8987a', 10, 6, 4, 1);
    p.r('#6a4a2a', 8, 4, 8, 3); p.r('#6a4a2a', 8, 6, 2, 4); p.r('#7a5a3a', 9, 4, 5, 1);    // the bob
    p.r('#5a4a32', 11, 1, 1, 4); p.r('#5a4a32', 14, 1, 1, 4); p.r('#1a1010', 11, 1, 1, 1); p.r('#1a1010', 14, 1, 1, 1);   // eye stalks
    p.r('#1a1010', 11, 8, 1, 1); p.r('#1a1010', 13, 8, 1, 1); p.r('#1a1010', 12, 10, 2, 1);
    p.r('rgba(200,220,230,.7)', 0, 15, 8, 1);                                              // slime trail
  }],
};
