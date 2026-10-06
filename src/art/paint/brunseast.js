// Built-in art for Brunswick East: Holmes St (Adam's red brick unit, the auto
// parts shop on the Mitchell St corner, the new townhouses opposite, the old
// red brick corner house), the Nicholson St shops, the milk bar's insides,
// Lygon St's shops and apartments, plus the new items and wild things.
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

// Lygon St, from the owner's Street View shots: single-storey Victorian
// shops with tall parapets (arched pediments, scrolls), each painted its own
// colour. Real names, because the owner asked for this exact strip.
function pediment(p, x0, W, c, kind) {
  const cx = x0 + W / 2, l = shade(c, 0.25), d = shade(c, -0.3);
  if (kind === 'arch') { p.r(c, cx - 10, 4, 20, 8); p.blob(cx, 5, 8, c); p.r(l, cx - 6, -2, 12, 1); p.blob(cx, 6, 4, d); p.blob(cx, 7, 3, c); }
  if (kind === 'scroll') { p.r(c, cx - 12, 6, 24, 6); p.r(c, cx - 6, 3, 12, 3); p.r(l, cx - 6, 3, 12, 1); for (const dx of [-14, 11]) { p.blob(cx + dx + 1, 9, 2, c); p.r(d, cx + dx, 9, 2, 1); } }
  for (const dx of [2, W - 5]) { p.r(c, x0 + dx, 6, 3, 6); p.blob(x0 + dx + 1, 5, 2, shade(c, -0.1)); }   // urns on the corners
}
function shopGlass(p, x, y, w, h, glass = '#2a3644') {
  p.r('#1e1e22', x - 1, y - 1, w + 2, h + 2); p.r(glass, x, y, w, h); p.r(shade(glass, 0.25), x + 1, y + 1, 3, 2);
}
const LYGON_SHOPS = {
  benjys: { wall: '#c8c8c4', ped: 'arch' },
  toystore: { wall: '#e070a8', ped: 'arch' },
  lygons: { wall: '#2a2a2e', ped: 'arch' },
  wilkinson: { wall: '#26262a', ped: 'scroll', ground: '#2f5a3a' },
  oldbrick: { wall: '#e8d890', ped: null, ground: '#b83a2a' },
};

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
  lygonshop: {
    foot: [5, 3], tex: [80, 74], variants: Object.keys(LYGON_SHOPS), lined: true,
    paint(p, v) {
      const s = LYGON_SHOPS[v], W = 78, x0 = 1, H = 74, top = 10, sf = 40, g = s.ground || s.wall;
      p.shadow(40, H - 1, 76);
      if (s.ped) pediment(p, x0, W, s.wall, s.ped);
      if (v === 'oldbrick') bricks(p, x0, top - 4, W, sf - top + 4, s.wall, 7); else p.r(s.wall, x0, top, W, sf - top);
      p.r(shade(s.wall, 0.2), x0, top, W, 1); p.r(shade(s.wall, -0.25), x0, top + 3, W, 1); p.r(shade(s.wall, -0.15), x0 + W - 2, top, 2, sf - top);
      p.r(g, x0, sf, W, H - sf - 1); p.r(shade(g, -0.2), x0 + W - 2, sf, 2, H - sf - 1);
      const win = (x, w, glass) => shopGlass(p, x0 + x, sf + 8, w, H - sf - 10, glass);
      if (v === 'benjys') {
        tags(p, x0 + 4, top + 4, 48, 14, 31, ['#1e1e24', '#1e1e24', '#3a3a44']);
        ['#f0a0c0', '#7ab0e8', '#f0d040', '#e8823a', '#b88ad8', '#e870a0'].forEach((c, k) => { for (let x = k * 4; x < W; x += 24) p.r(c, x0 + x, sf - 6, 4, 7); });
        for (const cx of [22, 56]) { p.blob(x0 + cx, sf - 3, 6, '#1e2a5a'); p.blob(x0 + cx, sf - 3, 5, '#2a3a7a'); centred(p, 'B', x0 + cx, sf - 5, '#f4f4f0'); }
        win(3, 50, '#1e2a3a'); p.text('KARAOKE', x0 + 6, sf + 12, '#c8e0ff'); p.text('BEER GDN', x0 + 6, sf + 19, '#c8e0ff');
        p.r('#f0a0c0', x0 + 42, sf + 14, 5, 8); p.r('#7ab0e8', x0 + 42, sf + 18, 5, 2); p.r('#f2c8a8', x0 + 43, sf + 11, 3, 3);   // the mannequin in sequins
        p.r('#1e1e22', x0 + 58, sf + 6, 16, H - sf - 7); p.r('#3a4a5a', x0 + 60, sf + 8, 12, H - sf - 10);
      } else if (v === 'toystore') {
        p.blob(x0 + 39, top + 10, 5, '#3f8a3e'); p.r('#1e3a1e', x0 + 37, top + 9, 4, 2); p.r('#f0d040', x0 + 38, top + 9, 1, 1);
        p.r('#2a2a44', x0 + 2, sf - 9, W - 4, 13); p.text('THIS IS NOT', x0 + 18, sf - 7, '#a8c8f0'); p.text('A TOY STORE', x0 + 18, sf - 1, '#a8c8f0');
        win(3, 52, '#3a3a4a');
        ['#f0d040', '#e870a0', '#7ab0e8', '#e8823a', '#57a84a', '#b88ad8'].forEach((c, k) => { p.r(c, x0 + 6 + k * 8, H - 9 - (k % 3) * 3, 5, 5 + (k % 3) * 3); p.r('#1e1e22', x0 + 7 + k * 8, H - 8 - (k % 3) * 3, 1, 1); });
        p.r('#e070a8', x0 + 58, sf + 6, 16, H - sf - 7); p.r('#4a3a2a', x0 + 60, sf + 8, 12, H - sf - 9); p.r('#f0d090', x0 + 61, sf + 10, 10, 6);
      } else if (v === 'lygons') {
        p.r('#3a3a40', x0 + 39, top + 2, 1, 4); p.blob(x0 + 39, top + 12, 6, '#1e1e22'); p.blob(x0 + 39, top + 12, 5, '#e8e0c8'); p.blob(x0 + 39, top + 12, 3, '#c8a040');
        p.r('#1e1e22', x0 + 2, sf - 4, W - 4, 4);
        win(3, 70, '#2a2a30'); for (const x of [12, 30, 48, 64]) p.r('#f5d070', x0 + x, sf + 10, 3, 2);   // warm lights inside
        p.blob(x0 + 34, sf + 20, 8, '#c8a040'); p.blob(x0 + 34, sf + 20, 7, '#2a2a30'); p.text('LYGONS', x0 + 23, sf + 18, '#e8c860');
        for (let k = 0; k < 4; k++) p.r('#f4f4f0', x0 + 56 + (k % 2) * 5, sf + 14 + Math.floor(k / 2) * 7, 4, 5);   // menus taped up
      } else if (v === 'wilkinson') {
        p.r('#1e1e22', x0 + 2, sf - 4, W - 4, 4); p.text('MR WILKINSON', x0 + 15, sf - 9, '#c8a050');
        p.r('#1e1a18', x0 + 28, sf, 6, H - sf - 1); for (let y = sf; y < H - 1; y += 3) p.r('#2e2a28', x0 + 28, y, 6, 1);   // the painted brick pier
        p.r('#3a2a1a', x0 + 24, sf + 2, 9, 8); p.r('#d8c060', x0 + 25, sf + 3, 7, 6); p.text('W', x0 + 27, sf + 4, '#2a2010');
        win(3, 22, '#1e2a24'); win(48, 27, '#1e2a24');
        for (let r = 9; r > 1; r -= 2) p.blob(x0 + 61, sf + 20, r, r % 4 === 1 ? '#3f8a3e' : '#1e2a24');   // the green spiral in the window
        p.r('#c8302a', x0 + 70, sf + 4, 6, 5); p.r('#f4efe0', x0 + 71, sf + 5, 4, 3);   // the round pizza sign
        p.r('#1e1e22', x0 + 35, sf + 6, 12, H - sf - 7); p.r('#3a4a44', x0 + 37, sf + 8, 8, H - sf - 9); p.r('#c8a050', x0 + 38, sf + 10, 1, 14);
      } else if (v === 'oldbrick') {
        tags(p, x0 + 2, sf + 2, W - 4, H - sf - 6, 77, ['#7ab0e8', '#e870a0', '#1e1e24', '#f4f4f0', '#3fa38f']);
        p.r('#8a2a1e', x0 + 22, sf + 6, 24, H - sf - 7); for (let y = sf + 8; y < H - 2; y += 3) p.r('#a83a2a', x0 + 23, y, 22, 1);   // roller door
        tags(p, x0 + 22, sf + 8, 24, 20, 12, ['#7ab0e8', '#f4f4f0']);
        p.text('300', x0 + 54, sf + 6, '#f4efe0'); p.r('#3a3a40', x0 + 52, sf + 13, 22, H - sf - 14); p.r('#c8c8cc', x0 + 54, sf + 16, 8, 10);   // the bike shop next door
      }
      p.r(shade(g, -0.35), x0, H - 2, W, 1);
      outline(p.ctx, 0, 0, 80, H);
    },
  },
  // Bed Bath N' Table clearance outlet at 297: dark green, a red band, grey awnings.
  bbnt: {
    foot: [7, 3], tex: [112, 74], variants: ['outlet'], lined: true,
    paint(p) {
      const W = 110, x0 = 1, H = 74, top = 8, sf = 40, c = '#1e2a26';
      p.shadow(56, H - 1, 108);
      p.r(c, x0 + 30, top - 4, 50, 5); p.r(shade(c, 0.2), x0 + 30, top - 4, 50, 1);
      p.r(c, x0, top, W, H - top - 1); p.r(shade(c, 0.2), x0, top, W, 1); p.r(shade(c, -0.3), x0 + W - 2, top, 2, H - top - 1);
      p.text("BED BATH N' TABLE", x0 + 22, top + 7, '#f4f4f0');
      p.r('#c8302a', x0, top + 15, W, 7); p.r('#e8443a', x0, top + 15, W, 1); p.text('CLEARANCE OUTLET', x0 + 25, top + 16, '#f4f4f0');
      p.r(shade(c, -0.2), x0, sf - 6, W, 2);
      const awning = (x, w) => { p.r('#c8c8c4', x0 + x, sf - 2, w, 6); p.r('#e8e8e4', x0 + x, sf - 2, w, 1); p.r('#8a8a88', x0 + x, sf + 3, w, 1); };
      shopGlass(p, x0 + 3, sf + 6, 48, H - sf - 8, '#e8e4dc');
      p.r('#f4f4f0', x0 + 8, H - 12, 22, 8); p.r('#e8d8c8', x0 + 10, H - 15, 7, 4); p.r('#e8d8c8', x0 + 19, H - 15, 7, 4); p.r('#c8b8a8', x0 + 8, H - 5, 22, 1);   // a made bed
      p.r('#c8302a', x0 + 34, sf + 9, 13, 10); p.text('SALE', x0 + 35, sf + 12, '#f4f4f0');
      for (let k = 0; k < 4; k++) p.r(['#c8302a', '#e8a0a0', '#f4f4f0', '#8a3a3a'][k], x0 + 34 + k * 3, H - 10, 2, 8);   // towels on a shelf
      awning(1, 52);
      p.r('#1e1e22', x0 + 58, sf + 6, 14, H - sf - 7); p.r('#d8d0c4', x0 + 60, sf + 8, 10, H - sf - 9); awning(55, 20); p.text('297', x0 + 59, sf + 5, '#2a2a2a');
      shopGlass(p, x0 + 78, sf + 6, 28, H - sf - 8, '#e8e4dc'); p.r('#c8302a', x0 + 80, sf + 10, 9, 8); awning(76, 32);
      p.r(shade(c, -0.35), x0, H - 2, W, 1);
      outline(p.ctx, 0, 0, 112, H);
    },
  },
  // The apartments across the road. 'fins': a concrete tower with lime green
  // fins up one corner. 'balconies': grey panels, deep timber-lined balconies,
  // green pixel tiles on the ground floor and a pub with its posters.
  lygonapts: {
    foot: [8, 7], tex: [128, 112], variants: ['fins', 'balconies'], lined: true,
    paint(p, v) {
      const H = 112, W = 126, x0 = 1;
      p.shadow(64, H - 1, 124);
      if (v === 'fins') {
        p.r('#a8a8a2', x0, 10, W, H - 11); p.r('#c0c0ba', x0, 10, W, 1); p.r('#4a4a50', x0 + 60, 0, 66, 12); p.r('#5a5a62', x0 + 60, 0, 66, 1);
        for (let x = 10; x < W; x += 22) p.r('#9a9a94', x0 + x, 12, 1, H - 30);
        for (let f = 0; f < 5; f++) { const y = 16 + f * 15; p.r('#3a3a40', x0 + 6, y, 36, 8); p.r('#a8c8d8', x0 + 7, y + 1, 34, 3); p.r('#d8e8f0', x0 + 6, y + 8, 36, 1); p.r('#3a3a40', x0 + 96, y + 2, 10, 9); }
        for (let k = 0; k < 6; k++) { const x = x0 + 44 + k * 3; p.r(k % 2 ? '#7ac83a' : '#a8e040', x, 14, 2, H - 34); }   // the green fins
        p.r('#3a3a40', x0, H - 20, W, 19); p.r('#f4efe0', x0 + 4, H - 20, 30, 4); p.text('CAFE', x0 + 10, H - 20, '#c8302a');
        shopGlass(p, x0 + 4, H - 14, 30, 11, '#5a6a7a'); shopGlass(p, x0 + 70, H - 14, 24, 11, '#5a6a7a'); p.r('#1e1e22', x0 + 100, H - 16, 12, 15);
      } else {
        p.r('#d8d8d4', x0, 4, W, H - 5); p.r('#ececea', x0, 4, W, 1);
        for (let x = 0; x < W; x += 16) p.r('#c4c4c0', x0 + x, 6, 1, H - 34);
        for (let f = 0; f < 3; f++) {
          const y = 12 + f * 22;
          for (const [x, w] of [[6, 52], [64, 56]]) { p.r('#1e1e22', x0 + x, y, w, 14); p.r('#8a5a3a', x0 + x + 1, y + 1, w - 2, 4); p.r('#2a2e33', x0 + x + 1, y + 5, w - 2, 8); p.r('#4a5a6a', x0 + x + 4, y + 6, 10, 6); }
          p.r('#57a84a', x0 + 70, y + 10, 4, 3);
        }
        const base = H - 28;
        for (let y = base; y < base + 12; y += 2) for (let x = 0; x < W; x += 3) p.r((x * 7 + y * 3) % 5 < 2 ? '#a8c838' : '#5a7a2a', x0 + x, y, 3, 2);   // the green pixel tiles
        p.r('#2a2a34', x0, base + 12, W, 15); for (let y = base + 13; y < H - 1; y += 3) p.r('#34343e', x0, y, W, 1);
        p.r('#1e1e22', x0 + 40, base + 4, 14, 23); p.r('#3a4a5a', x0 + 42, base + 6, 10, 21);
        shopGlass(p, x0 + 60, base + 4, 18, 18, '#2a3640'); shopGlass(p, x0 + 88, base + 4, 34, 18, '#2a3640');
        p.r('#f070b0', x0 + 90, base + 7, 9, 12); p.text('PARMA', x0 + 89, base + 22, '#f4f4f0'); p.r('#3a3a44', x0 + 101, base + 7, 9, 12); p.r('#7ab0e8', x0 + 112, base + 7, 8, 12);
        p.r('#f4f4f0', x0 + 8, base + 4, 22, 22); tags(p, x0 + 8, base + 4, 22, 22, 55, ['#1e1e24', '#e8823a', '#7ab0e8']);   // the tagged board by the tram stop
      }
      outline(p.ctx, 0, 0, 128, H);
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

  // Brick bungalows: tile roof, deep eaves, bay windows. red: red brick (199
  // Nicholson St itself is house199); cream: the cream brick one on the
  // corner; deco: cream brick with dark bands and a stepped parapet; corner: the old red brick house on Mitchell
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
  nichshop: {
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

  // The milk bar, double the length of the shops beside it (the owner's
  // note): the same graffitied parapet and blue awning, two windows of
  // drinks and lollies, the POTATO CAKES board and the door on the right.
  nichmilkbar: {
    foot: [8, 3], tex: [128, 80], variants: ['long'], lined: true,
    paint(p) {
      const H = 80, top = 14, W = 128;
      p.shadow(64, H - 1, 126);
      bricks(p, 1, top, W - 2, 22, '#a8503a', 7);
      for (const [x, w] of [[4, 12], [30, 16], [62, 20], [96, 14]]) { p.r('#a8503a', x, top - 4, w, 4); p.r('#c8705a', x, top - 4, w, 1); }
      tags(p, 2, top + 2, W - 6, 18, 35);
      p.r('#f4f4f0', 74, 0, 34, 14); p.text('ICECREAM', 75, 4, '#2f6ab8'); p.r('#c8302a', 76, 10, 30, 2); p.r('#8a8e96', 90, 14, 2, 2);   // the ice cream sign up top
      p.r(shade('#2f6ab8', -0.3), 0, top + 22, W, 12); p.r('#2f6ab8', 0, top + 23, W, 9); p.r('#c8302a', 0, top + 32, W, 2);
      centred(p, 'TAKE AWAY & MILK BAR', W / 2, top + 25, '#f4f4f0');
      p.r('#e8e4dc', 1, top + 34, W - 2, H - top - 35);
      for (const x0 of [4, 46]) { p.r('#2a2e33', x0, top + 37, 38, H - top - 41); p.r('#a8d0e4', x0 + 1, top + 38, 36, H - top - 43); }
      p.r('#c8302a', 7, top + 40, 14, 6); p.text('COLD', 8, top + 41, '#f4f4f0');
      for (let i = 0; i < 8; i++) p.r(['#e8c040', '#3fa38f', '#e77fb8', '#f4f4f0', '#c8302a'][i % 5], 24 + i * 2, H - 16, 1, 8);
      p.r('#f0d040', 7, H - 12, 12, 6); p.text('ICE', 8, H - 12, '#c8302a');
      for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) p.r(['#e77fb8', '#f0d040', '#3fa38f', '#e8823a'][(i + r) % 4], 49 + i * 4, top + 40 + r * 6, 3, 4);   // lolly jars
      p.r('#1e1e24', 50, H - 13, 30, 8); p.text('POTATO', 51, H - 12, '#f4f4f0');
      const dx = 96;
      p.r('#2a1a10', dx - 1, top + 36, 14, H - top - 37); p.r('#3a4a5a', dx, top + 37, 12, H - top - 38); p.r('#a8d0e4', dx + 2, top + 39, 8, 8);
      p.r('#f4f4f0', dx + 3, top + 49, 6, 3); p.text('OPEN', dx - 1, top + 54, '#f0d040');
      p.r('#c8302a', 112, top + 40, 12, 20); p.r('#f4f4f0', 113, top + 42, 10, 3); p.r('#f4f4f0', 113, top + 47, 10, 3); p.r('#f4f4f0', 113, top + 52, 10, 3);   // a drinks fridge by the door
      outline(p.ctx, 0, 0, W, H);
    },
  },

  // 199 Nicholson St, bigger and from the owner's photo: a wide red brick
  // California bungalow, low terracotta roof, a gable over the front porch
  // with cream rendered pillars, leadlight windows and a brick chimney.
  house199: {
    foot: [7, 4], tex: [112, 100], variants: ['red'], lined: true,
    paint(p) {
      const W = 112, H = 100, wall = 46;
      p.shadow(56, H - 1, 110);
      bricks(p, 20, 0, 10, 20, '#8a4030', 4); p.r('#6a3020', 19, 0, 12, 2);                          // chimney
      tileRoof(p, -1, 10, W + 2, 38, '#b8583a', { hipL: true, hipR: true });
      for (let j = 0; j < 30; j++) { const half = Math.round(j * 0.8); p.r(j % 3 ? '#b8583a' : '#9a4830', 84 - half, 18 + j, half * 2 + 2, 1); }   // the porch gable
      p.r('#f0e8d8', 70, 42, 30, 6); for (let x = 72; x < 98; x += 4) p.r('#c8b898', x, 42, 1, 6);    // timber battens in the gable
      bricks(p, 2, wall, W - 4, H - wall - 1, '#9a4a38', 5);
      p.r('#f4f0e6', 0, wall - 1, W, 2);
      // the porch: dark recess, rendered pillars on brick bases, the front door
      p.r('#3a2a22', 64, wall + 4, 42, H - wall - 5);
      for (const x of [62, 100]) { p.r('#ece4d0', x, wall + 2, 8, 34); p.r('#d8ccb0', x + 6, wall + 2, 2, 34); bricks(p, x - 1, wall + 36, 10, H - wall - 37, '#8a4030', x); }
      door(p, 80, wall + 12, 12, H - wall - 15, '#6a3a1a', false);
      p.r('#c8a040', 85, wall + 16, 2, 6); p.r('#a8d0e4', 82, wall + 14, 8, 1);
      p.text('199', 79, 43, '#6a3a1a');   // on the gable
      // the big front windows with leadlight across the top
      for (const x of [8, 34]) {
        window_(p, x, wall + 10, 22, 30, { curtain: '#f0e8d8' });
        for (let i = 0; i < 5; i++) p.r(['#c8302a', '#3fa38f', '#f0d040', '#3fa38f', '#c8302a'][i], x + 1 + i * 4, wall + 11, 3, 4);
      }
      p.r('#8a4030', 4, wall + 42, 54, 3);                                                         // a brick sill course
      outline(p.ctx, 0, 0, W, H);
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

// Wild things in Brunswick East (same format as FOE_ART in enemies.js).
export const EAST_FOE_ART = {
  sandwich: [16, 16, p => {                             // ham, cheese and tomato, half out of its paper bag
    p.r('#e8dcc0', 1, 9, 14, 6); p.r('#c8b898', 1, 13, 14, 2); p.r('#f4ecd8', 2, 9, 12, 1);
    p.r('#e8c88a', 3, 2, 10, 8); p.r('#d8a860', 3, 2, 10, 1); p.r('#f4e0b0', 4, 3, 8, 1);
    p.r('#e88a8a', 3, 5, 10, 1); p.r('#f0d040', 2, 6, 12, 1); p.r('#c8302a', 3, 7, 3, 1); p.r('#8a1a3a', 9, 7, 3, 1); p.r('#57a84a', 12, 7, 2, 1);
    p.r('#ffffff', 5, 3, 2, 2); p.r('#ffffff', 9, 3, 2, 2); p.r('#1a1010', 6, 4, 1, 1); p.r('#1a1010', 9, 4, 1, 1);
  }],
  surprisecandy: [16, 16, p => {                        // a bowl of mixed lollies
    p.r('#c8ccd0', 1, 9, 14, 4); p.r('#a8acb0', 2, 13, 12, 2); p.r('#e8ecf0', 1, 9, 14, 1);
    [['#e8302a', 3, 6], ['#57c84a', 6, 5], ['#f0d040', 9, 6], ['#7ab0e8', 11, 7], ['#f070b0', 5, 7], ['#e8823a', 8, 4], ['#b88ad8', 12, 5]].forEach(([c, x, y]) => p.r(c, x, y, 3, 3));
    p.r('#ffffff', 5, 10, 2, 2); p.r('#ffffff', 9, 10, 2, 2); p.r('#1a1010', 6, 11, 1, 1); p.r('#1a1010', 9, 11, 1, 1);
  }],
  pint: [16, 16, p => {                                 // a pint o' beer, perfect head
    p.r('#e8f0f4', 3, 2, 10, 13); p.r('#e8a838', 4, 5, 8, 9); p.r('#c88828', 10, 5, 2, 9); p.r('#f0c050', 5, 6, 2, 6);
    p.r('#f8f4e8', 3, 1, 10, 4); p.r('#ffffff', 4, 1, 4, 1); p.blob(5, 2, 1, '#f8f4e8'); p.blob(11, 2, 1, '#f8f4e8');
    p.r('#ffffff', 5, 7, 2, 2); p.r('#ffffff', 9, 7, 2, 2); p.r('#1a1010', 6, 8, 1, 1); p.r('#1a1010', 9, 8, 1, 1); p.r('#8a5a1a', 7, 11, 2, 1);
  }],
  psychbee: [16, 16, p => {                             // an enormous bee in every colour at once
    p.blob(5, 4, 3, '#c8f0ff'); p.blob(11, 4, 3, '#f0c8ff'); p.r('#ffffff', 4, 3, 2, 1); p.r('#ffffff', 10, 3, 2, 1);
    p.r('#f0d040', 3, 7, 10, 6); ['#e870a0', '#7ab0e8', '#57c84a'].forEach((c, k) => p.r(c, 5 + k * 3, 7, 2, 6));
    p.r('#1e1e24', 1, 8, 3, 4); p.r('#ffffff', 1, 9, 1, 1); p.r('#f070b0', 13, 9, 2, 2); p.r('#1e1e24', 14, 10, 2, 1);
    p.r('#b88ad8', 2, 6, 1, 2); p.r('#7ae8c8', 0, 5, 1, 1);
  }],
  partyguest: [16, 16, p => {                           // party hat, a balloon, no idea where they are
    p.r('#c8c8cc', 13, 0, 1, 6); p.blob(13, 1, 2, '#e870a0');
    p.r('#7ab0e8', 6, 0, 4, 1); p.r('#7ab0e8', 5, 1, 6, 1); p.r('#f0d040', 6, 1, 1, 1); p.r('#7ab0e8', 5, 2, 6, 1);
    p.r('#f2c8a0', 5, 3, 6, 5); p.r('#1a1010', 6, 5, 1, 1); p.r('#1a1010', 9, 5, 1, 1); p.r('#c8302a', 7, 7, 2, 1);
    p.r('#e8823a', 4, 8, 8, 5); p.r('#f0d040', 5, 9, 1, 1); p.r('#57c84a', 9, 11, 1, 1); p.r('#3a3a48', 5, 13, 2, 3); p.r('#3a3a48', 9, 13, 2, 3);
    p.r('#f2c8a0', 12, 9, 2, 2);
  }],
  crane: [16, 16, p => {                                // a tower crane with a pallet of bricks
    p.r('#f0c030', 3, 3, 2, 13); for (let y = 4; y < 16; y += 3) p.r('#c89020', 3, y, 2, 1);
    p.r('#f0c030', 0, 2, 16, 2); p.r('#c89020', 0, 3, 16, 1); p.r('#5a5e66', 0, 1, 3, 2); p.r('#f0c030', 3, 0, 2, 2);
    p.r('#2a2a30', 12, 4, 1, 6); p.r('#c8443a', 10, 10, 5, 3); p.r('#a8302a', 10, 12, 5, 1);
    p.r('#ffffff', 1, 5, 2, 2); p.r('#1a1010', 2, 6, 1, 1);
  }],
  bowler: [16, 16, p => {                               // crisp whites, a sun hat and a bowl ready to go
    p.r('#f4f4f0', 4, 1, 8, 2); p.r('#e8e8e4', 3, 3, 10, 1);
    p.r('#e0a07a', 5, 4, 6, 4); p.r('#1a1010', 6, 5, 1, 1); p.r('#1a1010', 9, 5, 1, 1); p.r('#8a5a4a', 7, 7, 2, 1);
    p.r('#f4f4f0', 4, 8, 8, 5); p.r('#d8d8d4', 10, 8, 2, 5); p.r('#e8e4dc', 5, 13, 2, 3); p.r('#e8e4dc', 9, 13, 2, 3);
    p.blob(13, 11, 2, '#2a2a30'); p.r('#c8302a', 13, 10, 1, 1); p.r('#e0a07a', 11, 10, 1, 2);
  }],
};
