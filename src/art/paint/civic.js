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
  // The domed council chamber: a tan brick drum with a big dark grey dome.
  chamberdome: {
    foot: [8, 3], tex: [144, 96], variants: ['dome'],
    paint(p) {
      const sx = 8, W = 128, H = 96, base = 58;
      // the dome: a wide ellipse, darker at the edges, with seams
      for (let y = 0; y < base - 4; y++) {
        const t = (base - 4 - y) / (base - 4), half = Math.round(Math.sqrt(Math.max(0, 1 - t * t)) * (W / 2 + 8));
        p.r(y < 6 ? '#5a6068' : '#40464e', sx + W / 2 - half, y + 4, half * 2, 1);
      }
      for (let i = -3; i <= 3; i++) for (let y = 10; y < base - 6; y += 2) { const half = Math.sqrt(Math.max(0, 1 - ((base - 4 - y) / (base - 4)) ** 2)) * (W / 2 + 8); p.r('#34393f', Math.round(sx + W / 2 + i / 3.6 * half), y + 4, 1, 1); }
      p.r('#6a7078', sx + W / 2 - 20, 8, 40, 2);   // a soft highlight
      p.r('#2a2e34', sx - 8, base - 2, W + 16, 3);  // the eave
      // the brick drum and COUNCIL CHAMBER
      bricks(p, sx, base, W, H - base - 1, '#d8c098', 11);
      centred(p, 'COUNCIL CHAMBER', sx + W / 2, base + 8, '#5a4a3a');
      p.r('#2a2e33', sx + W / 2 - 9, base + 16, 18, H - base - 17); p.r('#a8c8d8', sx + W / 2 - 8, base + 17, 16, H - base - 18); p.r('#2a2e33', sx + W / 2, base + 17, 1, H - base - 18);
      outline(p.ctx, 0, 0, 144, H);
    },
  },
  // The civic centre: a low brick building, flat grey fascia, a glass entry canopy.
  civiccentre: {
    foot: [10, 3], tex: [164, 72], variants: ['brick'],
    paint(p) {
      const sx = 2, W = 160, H = 72, top = 18;
      bricks(p, sx, top, W, H - top - 1, '#c8b08a', 4);
      p.r('#8a8e96', sx - 2, top - 8, W + 4, 9); p.r('#a8acb4', sx - 2, top - 8, W + 4, 2);   // flat roof fascia
      for (const x of [8, 34, 108, 134]) { p.r('#2a2e33', sx + x - 1, top + 12, 20, 18); p.r('#7a9ab0', sx + x, top + 13, 18, 16); p.r('#a8c4d4', sx + x + 1, top + 14, 4, 3); }
      // glass entry under a flat canopy on posts
      p.r('#2a2e33', sx + 62, top + 10, 38, H - top - 11); p.r('#a8d0e0', sx + 63, top + 11, 36, H - top - 12);
      for (const x of [72, 81, 90]) p.r('#2a2e33', sx + x, top + 11, 1, H - top - 12);
      p.r('#d8dcdf', sx + 54, top + 2, 54, 6); p.r('#f4f4f0', sx + 54, top + 2, 54, 1); p.r('#9a9ea6', sx + 54, top + 7, 54, 1);
      p.r('#8a8e96', sx + 56, top + 8, 2, H - top - 9); p.r('#8a8e96', sx + 104, top + 8, 2, H - top - 9);
      centred(p, 'CIVIC CENTRE', sx + 81, top - 6, '#f4f4f0');
      outline(p.ctx, 0, 0, 164, H);
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
