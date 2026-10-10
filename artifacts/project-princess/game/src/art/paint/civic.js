// Built-in art for Hobsons Bay City Council, Civic Parade, Altona: the domed
// council chamber (with COUNCIL CHAMBER on its brick base and the field gun
// out the front), the low brick civic centre with its glass entry canopy,
// the clock tower, flagpoles, the pelican sign and the rainbow path. Inside:
// the foyer (curved timber reception desk, grey couches, orange stools, green
// booths, terrazzo with coloured swirls, the noticeboard) and the chamber (a
// U of timber desks, orange chairs, the big screen, flags, rope barriers).
// Same format as objects.js.
import { shade, outline, textWidth } from './painter.js';
import { bricks } from './laverton.js';

const T = 16;
function box(p, x, y, w, h, c) {
  p.r(c, x, y, w, h); p.r(shade(c, 0.18), x, y, w, 1); p.r(shade(c, -0.22), x, y + h - 1, w, 1);
}
const centred = (p, s, cx, y, c) => p.text(s, Math.round(cx - textWidth(s) / 2), y, c);
const FLAGS = {
  aus: p => { p.r('#1a2a6a', 0, 0, 20, 12); p.r('#f4f4f0', 2, 2, 6, 1); p.r('#f4f4f0', 4, 1, 1, 4); p.r('#c8302a', 2, 2, 6, 1); [[13, 3], [16, 6], [12, 8], [15, 10], [9, 9]].forEach(([x, y]) => p.r('#f4f4f0', x, y, 1, 1)); },
  aboriginal: p => { p.r('#1a1a1a', 0, 0, 20, 6); p.r('#c8302a', 0, 6, 20, 6); p.blob(10, 6, 3, '#f0c020'); },
  tsi: p => { p.r('#2a8a4a', 0, 0, 20, 2); p.r('#2a8a4a', 0, 10, 20, 2); p.r('#2a5aa8', 0, 2, 20, 8); p.r('#1a1a1a', 0, 2, 20, 1); p.r('#1a1a1a', 0, 9, 20, 1); p.r('#f4f4f0', 8, 4, 4, 3); },
  rainbow: p => ['#e83a3a', '#f08a2a', '#f0d030', '#3aa84a', '#3a6ad8', '#8a3ab0'].forEach((c, i) => p.r(c, 0, i * 2, 20, 2)),
};

export const CIVIC = {
  // The council chamber, from the owner's photo: a huge dark shell roof that
  // curves right down to the ground on both sides, over an arched front wall
  // of pale brick with COUNCIL CHAMBER across it, pilasters and glass doors.
  chamberdome: {
    foot: [11, 4], tex: [200, 130], variants: ['dome'],
    paint(p) {
      const W = 200, H = 130, cx = 100;
      p.shadow(cx, H - 1, 196);
      // the shell: a half ellipse from ground to ground, seams running up it
      for (let y = 8; y < H; y++) {
        const t = (H - y) / (H - 8), half = Math.round(Math.sqrt(Math.max(0, 1 - t * t)) * 98);
        p.r(y < 16 ? '#5a6068' : y < 40 ? '#4a5058' : '#40464e', cx - half, y, half * 2, 1);
      }
      for (let i = -5; i <= 5; i++) for (let y = 14; y < H - 4; y += 2) { const t = (H - y) / (H - 8), half = Math.sqrt(Math.max(0, 1 - t * t)) * 98; p.r('#353a40', Math.round(cx + i / 5.6 * half), y, 1, 1); }
      // Highlights fit the shell at each row, rather than protruding as bars.
      for (const [y, height, colour] of [[11, 2, '#6a7078'], [16, 1, '#5e646c']]) {
        const t = (H - y) / (H - 8);
        const half = Math.max(0, Math.floor(Math.sqrt(1 - t * t) * 98) - 2);
        p.r(colour, cx - half, y, half * 2, height);
      }
      // the arched front wall, set into the shell, with a pale rim
      for (let y = 56; y < H; y++) {
        const t = (H - y) / (H - 56), half = Math.round(Math.sqrt(Math.max(0, 1 - t * t)) * 80);
        p.r('#7a8088', cx - half - 3, y, half * 2 + 6, 1);
      }
      for (let y = 59; y < H; y++) {
        const t = (H - y) / (H - 59), half = Math.round(Math.sqrt(Math.max(0, 1 - t * t)) * 77);
        p.r(y % 4 === 0 ? '#c8b894' : '#e0d2b0', cx - half, y, half * 2, 1);
        for (let x = cx - half + ((y >> 2) % 2) * 4; x < cx + half; x += 8) p.r('#c8b894', x, y, 1, 1);
      }
      for (const x of [-56, -36, 36, 56]) p.r('#cbbb96', cx + x, 92, 4, H - 93);                    // pilasters
      centred(p, 'COUNCIL CHAMBER', cx, 82, '#4a3a2a');
      p.r('#2a2e33', cx - 14, 98, 28, H - 99); p.r('#a8c8d8', cx - 13, 99, 26, H - 100);             // glass doors
      p.r('#2a2e33', cx, 99, 1, H - 100); p.r('#d8e8f0', cx - 11, 101, 4, 6); p.r('#d8e8f0', cx + 3, 101, 4, 6);
      p.r('#9a8a6a', cx - 30, H - 3, 60, 2);                                                        // the step
      outline(p.ctx, 0, 0, W, H);
    },
  },
  // The civic centre, bigger, from the owner's photo: a long low building of
  // pale brick under a dark flat roof with a deep overhang, a big flat canopy
  // over the entry on square columns, glass behind, and the council's name on
  // a dark feature wall.
  civiccentre: {
    foot: [12, 4], tex: [196, 110], variants: ['brick'],
    paint(p) {
      const sx = 2, W = 192, H = 110, top = 40;
      p.shadow(98, H - 1, 194);
      // the roof from above, a deep dark overhang and the fascia
      p.r('#5a5e66', sx + 4, 10, W - 8, top - 18); for (let x = sx + 8; x < sx + W - 8; x += 6) p.r('#4e525a', x, 11, 1, top - 20);
      p.r('#6e727a', sx + 4, 10, W - 8, 2);
      for (const [x, w] of [[30, 10], [140, 14]]) { p.r('#8a8e96', sx + x, 13, w, 6); p.r('#a8acb4', sx + x, 13, w, 1); }   // plant on the roof
      p.r('#2a2e34', sx - 2, top - 8, W + 4, 8); p.r('#3a3e46', sx - 2, top - 8, W + 4, 2);
      bricks(p, sx, top, W, H - top - 1, '#d8c8a4', 4);
      // windows along the left wing
      for (let i = 0; i < 3; i++) { const x = sx + 6 + i * 22; p.r('#2a2e33', x, top + 14, 18, 26); p.r('#7a9ab0', x + 1, top + 15, 16, 24); p.r('#a8c4d4', x + 2, top + 16, 4, 3); p.r('#2a2e33', x + 1, top + 26, 16, 1); }
      // the entry, right over the path (exit tiles 26-27): glass behind a big flat canopy, sliding doors in the middle
      const ex = sx + 72, ew = 50;
      p.r('#2a2e33', ex, top + 10, ew, H - top - 11); p.r('#a8d0e0', ex + 1, top + 11, ew - 2, H - top - 12);
      for (const x of [10, 40]) p.r('#2a2e33', ex + x, top + 11, 1, H - top - 12);
      p.r('#2a2e33', ex + 13, top + 18, 24, H - top - 19); p.r('#c8e4ee', ex + 14, top + 19, 22, H - top - 20);   // the doors
      p.r('#2a2e33', ex + 24, top + 19, 2, H - top - 20); p.r('#f4f4f0', ex + 15, top + 20, 3, 8); p.r('#f4f4f0', ex + 27, top + 20, 3, 8);
      p.r('#3a9a4a', ex + 21, top + 13, 8, 4); p.r('#f4f4f0', ex + 22, top + 14, 6, 2);                     // a green EXIT/ENTRY light
      p.r('#d8dcdf', ex - 4, top + 2, ew + 8, 8); p.r('#f4f4f0', ex - 4, top + 2, ew + 8, 1); p.r('#9a9ea6', ex - 4, top + 9, ew + 8, 1);   // the canopy
      for (const x of [-3, ew - 2]) { p.r('#c8ccd0', ex + x, top + 10, 5, H - top - 11); p.r('#9a9ea6', ex + x + 4, top + 10, 1, H - top - 11); }
      centred(p, 'CIVIC CENTRE', ex + ew / 2, top + 3, '#3a3e46');
      p.r('#6a4a3a', ex + 12, H - 4, 26, 3); p.r('#8a6a52', ex + 12, H - 4, 26, 1);                           // the doormat
      // the dark feature wall with the council's name
      p.r('#3a3e46', sx + 128, top, 30, H - top - 1); p.r('#4a4e56', sx + 128, top, 30, 2);
      p.text('HOBSONS', sx + 130, top + 8, '#f4f4f0'); p.text('BAY', sx + 138, top + 15, '#f4f4f0'); p.text('CITY', sx + 136, top + 22, '#f4f4f0');
      p.r('#3aa0c8', sx + 132, top + 32, 22, 2);
      // the right wing
      for (let i = 0; i < 2; i++) { const x = sx + 162 + i * 14; p.r('#2a2e33', x, top + 14, 12, 26); p.r('#7a9ab0', x + 1, top + 15, 10, 24); p.r('#a8c4d4', x + 2, top + 16, 3, 3); }
      // planter boxes along the front
      for (const x of [8, 160]) { p.r('#8a8e96', sx + x, H - 9, 30, 8); for (let i = 0; i < 5; i++) p.blob(sx + x + 4 + i * 5, H - 10, 3, i % 2 ? '#3a7a3a' : '#4a8a3a'); }
      outline(p.ctx, 0, 0, 196, H);
    },
  },
  clocktower: {
    foot: [1, 1], tex: [24, 104], variants: ['civic'],
    paint(p) {
      p.shadow(12, 103, 18);
      box(p, 5, 6, 14, 98, '#ece8dc'); p.r('#d8d2c2', 16, 6, 3, 98);
      p.blob(12, 16, 5, '#2a2e33'); p.blob(12, 16, 4, '#f4f4f0'); p.r('#2a2e33', 12, 13, 1, 4); p.r('#2a2e33', 12, 16, 3, 1);
      'HOBSONS'.split('').forEach((ch, i) => p.text(ch, 10, 30 + i * 7, '#6a6a72'));
      p.r('#c8c4b8', 4, 4, 16, 3);
    },
  },
  flagpole: {
    foot: [1, 1], tex: [24, 80], variants: ['aus', 'aboriginal', 'rainbow', 'tsi'],
    paint(p, v) {
      p.shadow(4, 79, 8);
      p.r('#c8ccd0', 3, 2, 2, 78); p.r('#f4f4f0', 3, 0, 2, 2);
      p.ctx.save(); p.ctx.translate(4, 4); FLAGS[v](p); p.ctx.restore();
    },
  },
  fieldgun: {
    foot: [3, 1], tex: [56, 40], variants: ['olive'],
    paint(p) {
      p.shadow(28, 39, 50);
      p.r('#3f7a3a', 2, 30, 52, 8); p.r('#57a84a', 2, 30, 52, 2);   // hedge bed
      const o = '#7a7a52', od = '#5a5a3a', ol = '#9a9a6a';
      p.r(od, 6, 26, 38, 3);                                          // trail legs
      box(p, 18, 14, 18, 14, o); p.r(ol, 18, 14, 18, 2);               // gun shield
      for (let i = 0; i < 22; i++) p.r(od, 30 + i, 18 - Math.floor(i * 0.7), 3, 3);   // barrel, angled up
      p.r(ol, 30, 17, 20, 1);
      for (const x of [16, 38]) { p.blob(x, 30, 6, '#2a2a2a'); p.blob(x, 30, 3, '#5a5a3a'); }
    },
  },
  hbccsign: {
    foot: [3, 1], tex: [48, 34], variants: ['pelican'],
    paint(p) {
      p.shadow(24, 33, 46);
      box(p, 2, 4, 44, 28, '#f0eee8');
      p.text('HOBSONS', 5, 9, '#2a2a2a'); p.text('BAY CITY', 5, 16, '#2a2a2a'); p.text('COUNCIL', 5, 23, '#5a5a5a');
      p.r('#1e1e22', 38, 8, 4, 12); p.r('#1e1e22', 36, 12, 2, 6); p.r('#f4f4f0', 39, 10, 1, 6); p.r('#e8902a', 42, 12, 4, 2);   // the pelican
    },
  },
  // The rainbow path, an arch painted on the lawn. Flat: walk on it.
  rainbowpath: {
    foot: [6, 4], tex: [96, 64], variants: ['pride'], solid: false, flat: true,
    paint(p) {
      const cols = ['#e83a3a', '#f08a2a', '#f0d030', '#3aa84a', '#3a6ad8', '#8a3ab0'];
      for (let y = 0; y < 64; y++) for (let x = 0; x < 96; x++) {
        const dx = (x - 48) / 46, dy = (y - 62) / 58, r = Math.hypot(dx, dy);
        if (y > 62 && r > 0) continue;
        const band = Math.floor((r - 0.62) / 0.06);
        if (band >= 0 && band < 6) p.r(cols[5 - band], x, y, 1, 1);
      }
    },
  },
  streetlibrary: {
    foot: [1, 1], tex: [16, 30], variants: ['box'],
    paint(p) {
      p.shadow(8, 29, 10);
      p.r('#6a4a2a', 7, 16, 2, 14);
      box(p, 2, 4, 12, 12, '#c8443a'); p.r('#8a2a20', 1, 2, 14, 3); p.r('#a8d0e0', 4, 7, 8, 7);
      for (let i = 0; i < 4; i++) p.r(['#3a7ac8', '#e8c040', '#3a8a4a', '#f07ab0'][i], 4 + i * 2, 9, 2, 5);
    },
  },

  // A green fingerpost sign: v is '<place>-<direction>' (up, down, left, right).
  waysign: {
    foot: [1, 1], tex: [48, 44], variants: ['lohse-up', 'civic-right', 'lohse-left', 'station-down', 'station-left'],
    paint(p, v) {
      const [place, dir] = String(v).split('-');
      const words = { lohse: ['LOHSE ST', 'RESERVE'], civic: ['CIVIC', 'CENTRE'], station: ['LAVERTON', 'STATION'] }[place] || [place.toUpperCase()];
      p.shadow(24, 43, 8);
      p.r('#8a8e96', 23, 18, 2, 26);
      box(p, 2, 2, 44, 18, '#1e6a3a'); p.r('#f4f4f0', 3, 3, 42, 1); p.r('#f4f4f0', 3, 18, 42, 1);
      words.forEach((w, i) => centred(p, w, 22, 5 + i * 6, '#f4f4f0'));
      // the arrow
      const ax = 41, ay = 11, c = '#f4f4f0';
      if (dir === 'up') { p.r(c, ax, ay - 3, 1, 7); p.r(c, ax - 1, ay - 2, 3, 1); p.r(c, ax - 2, ay - 1, 5, 1); }
      else if (dir === 'down') { p.r(c, ax, ay - 3, 1, 7); p.r(c, ax - 1, ay + 2, 3, 1); p.r(c, ax - 2, ay + 1, 5, 1); }
      else if (dir === 'left') { p.r(c, ax - 3, ay, 7, 1); p.r(c, ax - 2, ay - 1, 1, 3); p.r(c, ax - 1, ay - 2, 1, 5); }
      else { p.r(c, ax - 3, ay, 7, 1); p.r(c, ax + 2, ay - 1, 1, 3); p.r(c, ax + 1, ay - 2, 1, 5); }
    },
  },

  // ---- Inside: the foyer
  receptiondesk: {
    foot: [4, 1], tex: [64, 30], variants: ['ply'],
    paint(p) {
      // curved plywood front with a diamond mesh, black top
      p.r('#d8b47a', 2, 10, 60, 20); p.r('#e8c890', 2, 10, 60, 2);
      for (let x = 4; x < 60; x += 6) for (let y = 14; y < 28; y += 6) { p.r('#b8945a', x, y, 3, 1); p.r('#b8945a', x + 3, y + 3, 3, 1); }
      p.r('#1e1e22', 0, 7, 64, 4); p.r('#3a3a40', 0, 7, 64, 1);
      box(p, 44, 0, 12, 8, '#2a2a30'); p.r('#7ab0d8', 45, 1, 10, 5);     // a screen
      p.r('#f4efe0', 10, 4, 10, 3); p.r('#3a8a4a', 24, 3, 3, 4);           // forms, a pen pot
    },
  },
  lobbycouch: {
    foot: [3, 1], tex: [48, 26], variants: ['grey'],
    paint(p) {
      box(p, 1, 4, 46, 12, '#a8a8a4'); box(p, 1, 14, 46, 10, '#c4c4c0'); p.r('#8a8a86', 1, 24, 46, 2);
      p.r('#b8b8b4', 16, 6, 1, 8); p.r('#b8b8b4', 32, 6, 1, 8);
    },
  },
  pouf: {
    foot: [1, 1], tex: [16, 16], variants: ['orange', 'pink'],
    paint(p, v) { const c = v === 'pink' ? '#e8b098' : '#c8643a'; box(p, 3, 5, 10, 10, c); p.r('#f4ece0', 3, 4, 10, 2); },
  },
  // The agenda on an easel at the back of the public gallery.
  agendaboard: {
    foot: [1, 1], tex: [20, 30], variants: ['easel'], lined: true,
    paint(p) {
      p.r('#5e3a1a', 3, 18, 2, 12); p.r('#5e3a1a', 15, 18, 2, 12); p.r('#5e3a1a', 9, 18, 2, 10);
      p.r('#3a2412', 1, 1, 18, 19); p.r('#f4efe0', 2, 2, 16, 17);
      p.r('#1e3a6a', 3, 3, 14, 3);
      for (let i = 0; i < 4; i++) p.r('#6a6e78', 4, 8 + i * 3, 8 + (i % 2) * 4, 1);
    },
  },
  // A brass plaque on the wall by the chamber doors.
  plaque: {
    foot: [2, 1], tex: [32, 10], variants: ['chambers'], solid: false, lined: true,
    paint(p) {
      p.r('#5a3a10', 0, 0, 32, 10); p.r('#c89a3a', 1, 1, 30, 8); p.r('#e8c060', 1, 1, 30, 1);
      for (let i = 0; i < 12; i++) p.r('#5a3a10', 3 + i * 2 + (i > 5 ? 2 : 0), 3, 1, 1);   // "COUNCIL"
      for (let i = 0; i < 12; i++) p.r('#5a3a10', 3 + i * 2 + (i > 7 ? 1 : 0), 6, 1, 1);   // "CHAMBERS"
    },
  },
  booth: {
    foot: [2, 1], tex: [32, 36], variants: ['green'],
    paint(p) {
      box(p, 1, 0, 30, 26, '#1f5a46'); p.r('#2a7058', 3, 2, 26, 1);
      for (let x = 6; x < 30; x += 8) p.r('#184a3a', x, 2, 1, 22);
      box(p, 3, 20, 26, 8, '#2a7058'); p.r('#3a3a40', 5, 28, 2, 8); p.r('#3a3a40', 25, 28, 2, 8);
    },
  },
  tallplant: {
    foot: [1, 1], tex: [24, 44], variants: ['pothos'],
    paint(p) {
      p.shadow(12, 43, 12);
      box(p, 7, 26, 10, 18, '#1e1e22');
      for (const [x, y, r] of [[12, 14, 6], [7, 20, 4], [17, 19, 4], [10, 8, 4], [15, 6, 3], [5, 12, 3], [19, 12, 3]]) p.blob(x, y, r, r > 4 ? '#3f8a3e' : '#57a84a');
      p.r('#3f8a3e', 4, 22, 1, 10); p.r('#3f8a3e', 20, 22, 1, 8);
    },
  },
  // The council noticeboard: motions you can chip in to. Talk to it.
  noticeboard: {
    foot: [2, 1], tex: [32, 38], variants: ['cork'],
    paint(p) {
      p.r('#6a4a2a', 3, 26, 2, 12); p.r('#6a4a2a', 27, 26, 2, 12);
      box(p, 0, 2, 32, 26, '#7a5a3a'); p.r('#c8a070', 2, 4, 28, 22);
      [[4, 6, '#f4f4f0'], [13, 5, '#f8e890'], [22, 7, '#a8d8f0'], [6, 16, '#f8c8d8'], [17, 15, '#f4f4f0']].forEach(([x, y, c]) => { p.r(c, x, y, 8, 9); p.r('#8a8a8a', x + 1, y + 2, 6, 1); p.r('#8a8a8a', x + 1, y + 4, 5, 1); p.r('#c8302a', x + 3, y, 2, 1); });
      centred(p, 'MOTIONS', 16, 30, '#2a2a2a');
    },
  },
  // Coloured swirls in the terrazzo (flat, walk on them).
  floorswirl: {
    foot: [4, 2], tex: [64, 32], variants: ['mint', 'pink'], solid: false, flat: true,
    paint(p, v) {
      const c = v === 'pink' ? '#f0c0c0' : '#a8e0d0', n = '#2a3a58';
      for (let y = 0; y < 32; y++) for (let x = 0; x < 64; x++) {
        const w = Math.sin(x / 9 + (v === 'pink' ? 2 : 0)) * 6 + 16;
        if (Math.abs(y - w) < 5) p.r(c, x, y, 1, 1);
        else if (Math.abs(y - w - 7) < 2) p.r(n, x, y, 1, 1);
      }
    },
  },

  // ---- Inside: the chamber
  councildesk: {
    foot: [2, 1], tex: [32, 30], variants: ['seat', 'mayor'],
    paint(p, v) {
      p.r('#1e1e22', 9, 0, 14, 10); p.r('#2a2a30', 10, 1, 12, 2);                 // the black chair behind
      box(p, 0, 10, 32, 20, '#8a5a32'); p.r('#a8723c', 1, 11, 30, 2);              // timber desk
      p.r('#1e1e22', 3, 13, 26, 1);
      p.r('#3a3a40', 20, 6, 8, 6); p.r('#7ab0d8', 21, 7, 6, 4);                    // laptop
      p.r('#2a2a2a', 8, 4, 1, 7); p.r('#5a5a60', 7, 3, 3, 2);                      // microphone
      p.r('#f4f4f0', 4, 7, 3, 4);                                                    // a water bottle
      if (v === 'mayor') { p.r('#d8b440', 12, 15, 8, 3); p.text('MAYOR', 6, 21, '#f4efe0'); }
    },
  },
  chamberchair: {
    foot: [1, 1], tex: [16, 22], variants: ['orange'],
    paint(p) {
      box(p, 2, 1, 12, 12, '#c8743a'); box(p, 2, 11, 12, 6, '#d8844a');
      p.r('#3a3a40', 3, 17, 1, 5); p.r('#3a3a40', 12, 17, 1, 5);
    },
  },
  bigscreen: {
    foot: [3, 1], tex: [48, 28], variants: ['agenda'], solid: false, lined: true,
    paint(p) {
      p.r('#d8dcdf', 0, 0, 48, 3);
      p.r('#1e1e22', 2, 3, 44, 25); p.r('#2a6ab8', 3, 4, 42, 23); p.r('#4a8ad8', 3, 4, 42, 2);
      centred(p, 'AGENDA', 24, 9, '#f4f4f0'); p.r('#a8c8f0', 8, 17, 32, 1); p.r('#a8c8f0', 8, 20, 26, 1); p.r('#a8c8f0', 8, 23, 28, 1);
    },
  },
  ropebarrier: {
    foot: [1, 1], tex: [16, 24], variants: ['blue'], solid: false,
    paint(p) {
      p.r('#c8ccd0', 7, 6, 2, 16); p.blob(8, 5, 2, '#d8dcdf'); p.r('#a8acb4', 4, 22, 8, 2);
      p.r('#2a3a8a', 0, 9, 7, 2); p.r('#2a3a8a', 9, 9, 7, 2);
    },
  },
  flagstand: {
    foot: [1, 1], tex: [24, 44], variants: ['aboriginal', 'aus', 'tsi'],
    paint(p, v) {
      p.r('#3a3a40', 2, 40, 8, 3); p.r('#c8ccd0', 5, 2, 2, 40); p.r('#e8c040', 5, 0, 2, 2);
      p.ctx.save(); p.ctx.translate(7, 4); FLAGS[v](p); p.ctx.restore();
    },
  },
};
