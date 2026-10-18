// Built-in art for the Meredith festival (the zones in src/world/maps/mf*.js).
//
// Drawn at double detail, as the owner asked: every object here has `hd: 2`,
// so `paintHd` paints at twice the texture size (32 pixels per tile) and the
// game shows it at normal size, like the hi-res pet sheets. The style follows
// the owner's own sprites: flat saturated colours, two or three tones (light
// top edge, darker bottom and right) and a black 1px outline added
// automatically (textures.js). `paint` is a normal-size preview for the studio.
//
// Custom art drops in as usual: assets/sprites/objects/<kind>-<variant>.png.
import { hash } from '../../util.js';
import { painter, shade, textWidth } from './painter.js';

const HD = 2;

// ------------------------------------------------------------ helpers (hd pixels)
// A block with Seb's shading: light top edge, darker bottom and right.
function box(p, c, x, y, w, h, edge = 2) {
  p.r(c, x, y, w, h);
  p.r(shade(c, 0.22), x, y, w, edge);
  p.r(shade(c, -0.28), x, y + h - edge, w, edge);
  p.r(shade(c, -0.18), x + w - edge, y, edge, h);
}
// Pixel font text, scaled up (s = pixel size in hd pixels).
function text(p, str, x, y, c, s = 1) {
  const ctx = p.ctx;
  ctx.save(); ctx.translate(Math.round(x), Math.round(y)); ctx.scale(s, s); p.text(str, 0, 0, c); ctx.restore();
}
const tw = (str, s = 1) => textWidth(str.toUpperCase()) * s;
function ctext(p, str, cx, y, c, s = 1) { text(p, str, cx - tw(str, s) / 2, y, c, s); }
// Leafy clump: dark underside, mid body, light top and speckles.
function clump(p, x, y, r, [d, m, l], seed) {
  p.blob(x + 1, y + 2, r, d); p.blob(x - 1, y, r - 1, m); p.blob(x - Math.round(r / 3), y - Math.round(r / 3), Math.max(1, Math.round(r / 2)), l);
  for (let i = 0; i < r * 3; i++) { const a = hash(seed, i) * 6.28, rr = hash(i, seed) * r; p.r(i % 3 ? l : d, Math.round(x + Math.cos(a) * rr), Math.round(y + Math.sin(a) * rr), 2, 2); }
}
function shadow(p, cx, cy, w, a = 0.25) {
  p.ctx.fillStyle = `rgba(40,30,10,${a})`;
  p.ctx.fillRect(Math.round(cx - w / 2), cy - 4, w, 6);
  p.ctx.fillRect(Math.round(cx - w / 2) + 4, cy - 6, w - 8, 10);
}
// The studio preview: paint at hd, then shrink onto the normal-size canvas.
function preview(def) {
  return function paint(p, v, o) {
    if (typeof document === 'undefined') return;
    const c = document.createElement('canvas');
    c.width = def.tex[0] * HD; c.height = def.tex[1] * HD;
    def.paintHd(painter(c.getContext('2d')), v, o);
    p.ctx.imageSmoothingEnabled = false;
    p.ctx.drawImage(c, 0, 0, def.tex[0], def.tex[1]);
  };
}
const make = defs => {
  for (const def of Object.values(defs)) { def.hd = HD; def.paint = preview(def); }
  return defs;
};

const LANTERN = { pink: '#f2509a', green: '#4ad85a', blue: '#3a8ae8', yellow: '#f5d03a', red: '#e83a3a', purple: '#a050e0', orange: '#f08a2a', cyan: '#3ad0d8' };
const LANTERN_SETS = {
  a: ['pink', 'green', 'blue', 'yellow', 'red'],
  b: ['purple', 'orange', 'cyan', 'pink', 'green'],
  c: ['yellow', 'red', 'purple', 'blue', 'orange'],
  d: ['green', 'pink', 'yellow', 'cyan', 'purple'],
};
const sagAt = (i, v) => 10 + Math.round(Math.sin((i + 0.5) / 5 * Math.PI) * 10) + (v === 'b' || v === 'd' ? 4 : 0);
const hex = c => parseInt(c.slice(1), 16);

const GUM = {
  blue: { bark: '#e8e2d4', patch: '#c8c0ae', dark: '#a39a86', leaf: ['#3e5e52', '#5f8070', '#8aa898'] },
  red: { bark: '#d8c0a0', patch: '#b89a78', dark: '#8e7558', leaf: ['#3e5a34', '#5a7a46', '#86a466'] },
  spotted: { bark: '#e0dccc', patch: '#9ea6a0', dark: '#8a8a80', leaf: ['#405e40', '#628256', '#90ac7a'] },
};

const TENT = { orange: '#e8742a', blue: '#3a6ac8', green: '#3a9a4a', purple: '#7a4ab0', grey: '#8a8e98', red: '#c8342a', yellow: '#e8c030', brown: '#8a5a32', teal: '#2a9a9a' };

export const MEREDITH = make({
  // A tall, straight blue gum: smooth pale bark and a high, thin canopy.
  mfgum: {
    foot: [1, 1], tex: [40, 88], variants: ['blue', 'red', 'spotted'],
    paintHd(p, v) {
      const g = GUM[v] || GUM.blue, W = 80, H = 176;
      shadow(p, W / 2, H - 2, 34);
      p.r(g.bark, 36, 40, 10, H - 42); p.r(shade(g.bark, 0.2), 36, 40, 3, H - 42); p.r(g.dark, 43, 40, 3, H - 42);
      p.r(shade(g.bark, -0.08), 34, H - 10, 14, 8);   // flared base
      for (let i = 0; i < 9; i++) p.r(g.patch, 37 + Math.round(hash(i, 3) * 6), 50 + i * 13, 3 + Math.round(hash(i, 5) * 3), 5);
      // Branches up into the canopy
      p.r(g.bark, 28, 44, 10, 4); p.r(g.bark, 26, 30, 4, 16); p.r(g.bark, 44, 34, 10, 4); p.r(g.bark, 52, 20, 4, 16); p.r(g.bark, 38, 18, 6, 24);
      const L = g.leaf;
      clump(p, 24, 26, 12, L, 1); clump(p, 56, 20, 13, L, 2); clump(p, 40, 12, 12, L, 3); clump(p, 16, 40, 8, L, 4); clump(p, 64, 36, 8, L, 5);
      for (let i = 0; i < 10; i++) p.r(L[0], 10 + Math.round(hash(i, 9) * 60), 44 + Math.round(hash(i, 8) * 10), 2, 4);   // drooping leaves
    },
  },
  // The Red Tree: a dead gum at the back of the Amphitheatre, painted bright red.
  mfredtree: {
    foot: [2, 1], tex: [56, 96],
    paintHd(p) {
      const R = '#d8302a', L = '#f2604a', D = '#962018', W = 112;
      shadow(p, W / 2, 190, 60);
      p.r(R, 48, 70, 18, 120); p.r(L, 48, 70, 5, 120); p.r(D, 61, 70, 5, 120);
      p.r(R, 42, 178, 30, 10); p.r(D, 42, 186, 30, 2);
      const limb = (x0, y0, x1, y1, w) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n; p.r(R, x, y, w, w); p.r(L, x, y, Math.max(1, w / 3), w); } };
      limb(52, 76, 22, 30, 8); limb(60, 74, 90, 24, 8); limb(56, 72, 58, 6, 7);
      limb(24, 34, 10, 10, 4); limb(26, 36, 34, 4, 4); limb(88, 28, 104, 6, 4); limb(88, 28, 80, 4, 4); limb(58, 10, 46, 0, 3); limb(58, 10, 68, 0, 3);
      limb(40, 54, 26, 50, 3); limb(74, 50, 96, 46, 3);
      p.r('#f4e8dc', 50, 120, 12, 2);   // a ribbon someone tied on
    },
  },
  // A string of hanging fabric lanterns over the Amphitheatre. They glow at night.
  mflantern: {
    foot: [4, 1], tex: [64, 64], variants: ['a', 'b', 'c', 'd'], above: true, solid: false,
    lights: v => (LANTERN_SETS[v] || LANTERN_SETS.a).map((c, i) => ({ x: 6.5 + i * 12.5, y: (sagAt(i, v) + 20) / 2, r: 14, tint: hex(LANTERN[c]) })),
    paintHd(p, v) {
      const set = LANTERN_SETS[v] || LANTERN_SETS.a;
      // The wire, sagging between two trees
      for (let x = 0; x < 128; x++) p.r('#2a2a2a', x, 8 + Math.round(Math.sin(x / 128 * Math.PI) * 10) + (v === 'b' || v === 'd' ? 4 : 0), 1, 1);
      set.forEach((name, i) => {
        const c = LANTERN[name], x = 6 + i * 25, y = sagAt(i, v);
        p.r('#2a2a2a', x + 6, y - 2, 1, 4);
        p.r(shade(c, -0.35), x + 1, y + 1, 12, 3);                 // top ring
        p.r(c, x, y + 4, 14, 24); p.r(shade(c, 0.35), x + 3, y + 4, 3, 24); p.r(shade(c, -0.25), x + 11, y + 4, 3, 24);
        for (let k = 8; k < 26; k += 6) p.r(shade(c, -0.15), x, y + k, 14, 1);   // fabric folds
        p.r(shade(c, -0.35), x + 1, y + 28, 12, 3);                // bottom ring
        p.r(shade(c, 0.1), x + 5, y + 31, 4, 4); p.r(shade(c, -0.1), x + 6, y + 35, 2, 3);   // tassel
      });
    },
  },
  // The One and Only Stage: a long timber shed stage under the gums, with
  // speaker stacks, a lighting truss and a band in the light.
  mfstage: {
    foot: [14, 4], tex: [224, 124],
    lights: [{ x: 50, y: 40, r: 40, tint: 0xff4aa0 }, { x: 112, y: 36, r: 50, tint: 0x6ab0ff }, { x: 174, y: 40, r: 40, tint: 0xffd04a }],
    paintHd(p) {
      const W = 448, H = 248;
      // Roof: dark corrugated iron, a long low skillion
      p.r('#3a3e44', 20, 22, 408, 30);
      for (let x = 22; x < 426; x += 6) p.r('#4c5258', x, 22, 2, 30);
      p.r('#5e646a', 20, 22, 408, 3); p.r('#22262a', 20, 50, 408, 4);
      p.r('#c8b89a', 14, 52, 420, 8); p.r('#e0d0b0', 14, 52, 420, 2);   // timber fascia
      text(p, 'MEREDITH', 224 - tw('MEREDITH', 2) / 2, 54, '#3a2a1a', 2);
      // The stage mouth
      p.r('#141418', 36, 60, 376, 112);
      // Lighting truss and cans
      p.r('#9aa0a8', 40, 66, 368, 4);
      for (let i = 0; i < 12; i++) { const x = 56 + i * 30, c = ['#ff4aa0', '#6ab0ff', '#ffd04a', '#5aff8a'][i % 4]; p.r('#2a2a30', x, 70, 8, 8); p.r(c, x + 2, 76, 4, 3); }
      // Light beams
      p.ctx.globalAlpha = 0.18;
      for (let i = 0; i < 6; i++) { const x = 80 + i * 56, c = ['#ff4aa0', '#6ab0ff', '#ffd04a'][i % 3]; for (let k = 0; k < 80; k += 2) p.r(c, x - k / 4, 80 + k, 8 + k / 2, 2); }
      p.ctx.globalAlpha = 1;
      // The band: drums, a guitarist, a singer
      p.r('#c8343a', 196, 140, 56, 20); p.blob(224, 150, 12, '#e8e4dc'); p.blob(224, 150, 9, '#c8c0b4');
      p.r('#d8c040', 196, 132, 12, 3); p.r('#d8c040', 240, 132, 12, 3);
      const person = (x, shirt, hair) => { p.r(shirt, x, 112, 14, 26); p.blob(x + 7, 104, 7, '#e8b48a'); p.r(hair, x, 96, 14, 6); p.r('#2a2a30', x + 1, 138, 5, 20); p.r('#2a2a30', x + 8, 138, 5, 20); };
      person(120, '#3a3a44', '#3a2416'); p.r('#c8342a', 112, 122, 26, 8); p.r('#e8e4dc', 136, 124, 18, 3);
      person(300, '#e8e4dc', '#d8b060'); p.r('#9aa0a8', 296, 104, 2, 52); p.r('#2a2a2a', 292, 100, 8, 6);
      // Speaker stacks both sides
      for (const sx of [24, 384]) {
        box(p, '#1e1e22', sx, 92, 40, 96);
        for (let k = 0; k < 3; k++) { p.blob(sx + 20, 108 + k * 30, 11, '#3a3a40'); p.blob(sx + 20, 108 + k * 30, 6, '#141418'); p.r('#5a5a62', sx + 16, 104 + k * 30, 3, 3); }
      }
      // Front deck and the barrier
      box(p, '#8a6236', 30, 172, 388, 22, 3);
      for (let x = 34; x < 416; x += 20) p.r('#6e4c28', x, 176, 2, 16);
      p.r('#a8acb4', 10, 214, 428, 4);
      for (let x = 12; x < 438; x += 16) p.r('#8a8e96', x, 214, 3, 30);
      p.r('#6a6e76', 10, 240, 428, 4);
    },
  },
  // Couches on the Amphitheatre hill. Everyone brings their own.
  mfcouch: {
    foot: [3, 1], tex: [48, 30], variants: ['green', 'red', 'floral', 'brown', 'blue', 'mustard', 'kouch'],
    paintHd(p, v) {
      const C = { green: '#3a7a4a', kouch: '#2e7a52', red: '#b8343a', floral: '#e8d8b8', brown: '#7a4a2a', blue: '#3a5a9a', mustard: '#d8a02a' }[v] || '#3a7a4a';
      const W = 96;
      shadow(p, W / 2, 58, 92);
      box(p, C, 6, 18, 84, 22, 3);                          // backrest
      for (let x = 14; x < 86; x += 26) p.r(shade(C, -0.15), x + 22, 20, 2, 18);   // seams
      box(p, shade(C, -0.06), 2, 26, 14, 26, 3); box(p, shade(C, -0.06), 80, 26, 14, 26, 3);   // arms
      for (let i = 0; i < 3; i++) box(p, shade(C, 0.08), 16 + i * 22, 36, 22, 12, 3);    // cushions
      p.r(shade(C, -0.3), 14, 48, 68, 4);
      p.r('#2a1a10', 6, 52, 4, 6); p.r('#2a1a10', 86, 52, 4, 6);   // legs
      if (v === 'floral') for (let i = 0; i < 14; i++) { const x = 8 + Math.round(hash(i, 4) * 78), y = 20 + Math.round(hash(i, 7) * 28); p.r('#d8507a', x, y, 3, 3); p.r('#5a9a4a', x + 3, y + 1, 2, 2); }
      if (v === 'kouch') {   // the crew's sign, on a broom handle behind the couch
        p.r('#8a6236', 46, 0, 3, 20);
        box(p, '#f4f0e6', 26, 0, 44, 13);
        text(p, 'KOUCH HOLE 2', 29, 4, '#1e1e22');
      }
    },
  },
  // The Pink Flamingo: a white marquee bar with a pink sign, at the back of the Amphitheatre.
  mfflamingo: {
    foot: [8, 3], tex: [128, 92],
    lights: [{ x: 64, y: 20, r: 36, tint: 0xff5aa8 }],
    paintHd(p) {
      const W = 256, H = 184;
      shadow(p, W / 2, H - 2, 250);
      // Marquee roof: three white peaks
      for (let i = 0; i < 3; i++) {
        const cx = 44 + i * 84;
        for (let y = 0; y < 34; y++) { const half = Math.round(8 + y * 1.25); p.r(y < 3 ? '#ffffff' : '#ece8e2', cx - half, 50 + y, half * 2, 1); }
        p.r('#c8c2ba', cx - 50, 82, 100, 3);
        p.r('#8a8e96', cx - 1, 40, 2, 12);
      }
      // Clear walls with the bar inside
      p.r('#d8dce2', 6, 84, 244, 60); p.r('#b8bec8', 6, 84, 244, 3);
      for (let x = 10; x < 250; x += 40) p.r('#c8ccd4', x, 84, 2, 60);
      p.r('#3a2a2a', 20, 96, 216, 30);                 // inside, dim
      for (let x = 28; x < 230; x += 12) { p.r(['#f2509a', '#f5d03a', '#e8e4dc'][x % 3], x, 100, 6, 10); }   // bottles
      // The pink bar front
      box(p, '#f26aa8', 10, 128, 236, 34, 3);
      text(p, 'PINK FLAMINGO', 128 - tw('PINK FLAMINGO', 2) / 2, 138, '#ffffff', 2);
      p.r('#c84a88', 10, 162, 236, 12);
      // The flamingo on top
      const fx = 120;
      p.r('#f26aa8', fx, 6, 20, 14); p.r('#f78ec0', fx, 6, 20, 4);                // body
      p.r('#f26aa8', fx + 18, -2 + 4, 4, 14); p.blob(fx + 22, 4, 4, '#f26aa8');     // neck and head
      p.r('#2a2a2a', fx + 25, 3, 5, 3); p.r('#f5d03a', fx + 24, 2, 2, 2);
      p.r('#d84a8a', fx + 6, 20, 2, 26); p.r('#d84a8a', fx + 12, 20, 2, 26);        // legs on the roof
    },
  },
  // Pink Adirondack chairs on the Flamingo's raised turf. You can sit in them.
  mfchair: {
    foot: [1, 1], tex: [16, 26], variants: ['pink', 'white'],
    paintHd(p, v) {
      const c = v === 'white' ? '#f0eee8' : '#f26aa8';
      shadow(p, 16, 50, 28);
      for (let i = 0; i < 5; i++) box(p, c, 5 + i * 4.6, 6 + Math.abs(2 - i) * 2, 4, 30, 1);   // the fan back
      box(p, shade(c, -0.05), 2, 30, 28, 6, 2);   // arms
      box(p, shade(c, 0.05), 6, 34, 20, 8, 2);    // seat
      p.r(shade(c, -0.3), 4, 42, 4, 10); p.r(shade(c, -0.3), 24, 42, 4, 10);
    },
  },
  // Food stalls and vans: South Bank and the International Food Court.
  mffood: {
    foot: [4, 2], tex: [64, 58], variants: ['potato', 'krishna', 'dumpling', 'pizza', 'coffee', 'tucker', 'gelato', 'noodles'],
    lights: [{ x: 32, y: 30, r: 26, tint: 0xffd890 }],
    paintHd(p, v) {
      const W = 128, H = 116;
      shadow(p, W / 2, H - 2, 124);
      const S = {
        potato: ['#b8282e', 'BAKED POTATOES', '#f4e8c8', 'van'], krishna: ['#e8922a', 'HARE KRISHNA FOOD', '#7a2a6a', 'tent'],
        dumpling: ['#f0ece2', 'DUMPLINGS', '#c8282e', 'tent'], pizza: ['#2e6a3a', 'WOODFIRED PIZZA', '#f4e8c8', 'van'],
        coffee: ['#3a2a22', 'COFFEE', '#f4e8c8', 'van'], tucker: ['#9a7a4a', 'TUCKER TENT', '#2a1a10', 'tent'],
        gelato: ['#9ad8d0', 'GELATO', '#d8507a', 'van'], noodles: ['#e8c030', 'NOODLES', '#c8282e', 'tent'],
      }[v] || ['#b8282e', 'FOOD', '#f4e8c8', 'van'];
      const [c, name, ink, kind] = S;
      if (kind === 'van') {
        box(p, c, 6, 24, 116, 70, 3);
        p.r(shade(c, 0.3), 6, 24, 116, 3);
        p.r('#1e1e22', 20, 44, 72, 30); p.r('#e8d0a0', 22, 66, 68, 6);   // hatch and counter
        for (let x = 26; x < 88; x += 10) p.r(['#d8302a', '#f5d03a', '#e8e4dc'][x % 3], x, 56, 4, 10);
        box(p, '#d8d4cc', 14, 32, 84, 10, 2); text(p, name, 56 - tw(name) / 2, 34, '#2a2a2a');
        p.r('#8a8e96', 4, 18, 98, 4); p.r(shade(c, -0.1), 8, 14, 90, 4);   // awning
        p.blob(30, 98, 9, '#1e1e22'); p.blob(30, 98, 4, '#8a8e96'); p.blob(96, 98, 9, '#1e1e22'); p.blob(96, 98, 4, '#8a8e96');
        p.r('#8a8e96', 108, 80, 18, 4);   // drawbar
        text(p, name.split(' ')[0], 104 - tw(name.split(' ')[0]) / 2, 82, ink);
      } else {
        // Canvas tent: peaked roof, open front, a counter
        for (let y = 0; y < 30; y++) { const half = Math.round(20 + y * 1.4); p.r(y < 3 ? shade(c, 0.3) : c, 64 - half, 8 + y, half * 2, 1); }
        for (let x = 10; x < 120; x += 12) p.r(shade(c, -0.12), x, 30, 6, 8);
        p.r(shade(c, -0.25), 10, 38, 108, 3);
        p.r('#3a2a22', 14, 41, 100, 34);
        p.r('#8a8e96', 12, 38, 3, 60); p.r('#8a8e96', 113, 38, 3, 60);
        for (let x = 22; x < 106; x += 14) p.r(['#d8302a', '#f5d03a', '#5aa83a'][x % 3], x, 62, 8, 8);
        box(p, '#e8dcc0', 10, 74, 108, 22, 3);
        text(p, name, 64 - tw(name) / 2, 82, ink);
        if (v === 'dumpling') for (let i = 0; i < 4; i++) { p.blob(24 + i * 26, 46, 5, '#d8282e'); p.r('#f5d03a', 23 + i * 26, 51, 2, 4); }
      }
    },
  },
  // The Meredith Eye: a ferris wheel next to the Amphitheatre.
  mfeye: {
    foot: [6, 2], tex: [96, 156],
    lights: [{ x: 48, y: 58, r: 46, tint: 0xffd87a }, { x: 48, y: 16, r: 18, tint: 0xff6a5a }],
    paintHd(p) {
      const W = 192, H = 312, cx = 96, cy = 116, R = 80;
      shadow(p, cx, H - 2, 160);
      // A-frame legs
      const leg = (x0, x1) => { for (let y = cy; y < H - 30; y++) { const x = x0 + (x1 - x0) * (y - cy) / (H - 30 - cy); p.r('#e8e4dc', x, y, 6, 1); p.r('#b8b4ac', x + 4, y, 2, 1); } };
      leg(94, 40); leg(92, 146);
      // Rim and spokes
      for (let a = 0; a < 360; a += 1) { const r = a * Math.PI / 180; p.r('#c8282e', cx + Math.cos(r) * R - 2, cy + Math.sin(r) * R - 2, 5, 5); }
      for (let a = 0; a < 360; a += 1) { const r = a * Math.PI / 180; p.r('#f05a4a', cx + Math.cos(r) * (R - 3) - 1, cy + Math.sin(r) * (R - 3) - 2, 2, 2); }
      for (let k = 0; k < 12; k++) { const r = k * Math.PI / 6; for (let d = 0; d < R; d += 1) p.r('#f5d03a', cx + Math.cos(r) * d - 1, cy + Math.sin(r) * d - 1, 2, 2); }
      p.blob(cx, cy, 9, '#f5d03a'); p.blob(cx, cy, 4, '#c8282e');
      // Gondolas
      const G = ['#3a6ac8', '#f5d03a', '#3a9a4a', '#f2509a', '#e8742a', '#7a4ab0'];
      for (let k = 0; k < 12; k++) { const r = k * Math.PI / 6 + 0.26, gx = cx + Math.cos(r) * R, gy = cy + Math.sin(r) * R; p.r('#2a2a2a', gx - 1, gy, 2, 6); box(p, G[k % 6], gx - 8, gy + 5, 16, 13, 2); p.r('#e8f0ff', gx - 5, gy + 8, 10, 3); }
      // Bulbs round the rim
      for (let k = 0; k < 24; k++) { const r = k * Math.PI / 12; p.r('#fff4b0', cx + Math.cos(r) * (R + 4) - 1, cy + Math.sin(r) * (R + 4) - 1, 3, 3); }
      // The sign on top and the ticket booth
      box(p, '#c8282e', cx - 22, 18, 44, 16, 2); ctext(p, 'EYE', cx, 21, '#fff4b0', 2);
      p.r('#c8282e', cx - 1, 34, 2, 6);
      box(p, '#e8e4dc', 18, H - 40, 156, 12, 3);
      box(p, '#3a6ac8', 136, H - 70, 30, 34, 3); p.r('#e8f0ff', 140, H - 62, 22, 10); text(p, 'RIDES', 140, H - 48, '#fff4b0');
    },
  },
  // Heaven Eleven, the festival's 24 hour corner store.
  mfheaven: {
    foot: [6, 3], tex: [96, 76],
    lights: [{ x: 48, y: 30, r: 34, tint: 0xd8f0ff }],
    paintHd(p) {
      const W = 192, H = 152;
      shadow(p, W / 2, H - 2, 188);
      box(p, '#e8e4dc', 6, 40, 180, 106, 3);
      p.r('#2a5aa8', 6, 22, 180, 22); p.r('#3a6ac8', 6, 22, 180, 3);
      for (const [y, c] of [[44, '#e8742a'], [48, '#3a9a4a'], [52, '#c8282e']]) p.r(c, 6, y, 180, 4);   // the stripes
      ctext(p, 'HEAVEN ELEVEN', 96, 28, '#ffffff', 2);
      box(p, '#ffffff', 158, 2, 26, 22, 2); ctext(p, 'H11', 171, 9, '#c8282e');   // the logo on a pole
      p.r('#8a8e96', 170, 24, 2, 0);
      // Windows full of things, and the door
      for (const wx of [16, 108]) {
        p.r('#bfe0f0', wx, 66, 68, 50); p.r('#e8f6ff', wx, 66, 68, 4);
        for (let y = 76; y < 114; y += 12) { p.r('#8a8e96', wx + 2, y + 8, 64, 2); for (let x = wx + 4; x < wx + 62; x += 7) p.r(['#c8282e', '#f5d03a', '#3a6ac8', '#3a9a4a', '#f2509a'][(x + y) % 5], x, y, 5, 8); }
      }
      p.r('#5a6a7a', 86, 70, 20, 76); p.r('#bfe0f0', 89, 74, 14, 40);
      text(p, 'OPEN 24 HRS', 112, 122, '#c8282e');
      p.r('#8a8e96', 6, 140, 180, 6);
    },
  },
  // A Helper Hut: volunteers, water, a first aid kit and a lost property box.
  mfhelperhut: {
    foot: [3, 2], tex: [48, 50],
    paintHd(p) {
      shadow(p, 48, 98, 92);
      for (let y = 0; y < 24; y++) { const half = Math.round(16 + y * 1.4); p.r(y < 3 ? '#ffffff' : '#e8302a', 48 - half, 18 + y, half * 2, 1); }
      p.r('#c8282e', 12, 42, 72, 3);
      p.r('#8a8e96', 14, 44, 3, 50); p.r('#8a8e96', 79, 44, 3, 50);
      p.r('#3a2a22', 18, 45, 60, 30);
      box(p, '#f4f0e6', 12, 70, 72, 24, 3);
      box(p, '#e8302a', 36, 4, 24, 16, 2); ctext(p, 'HH', 48, 9, '#ffffff');
      text(p, 'HELPER HUT', 48 - tw('HELPER HUT') / 2, 78, '#c8282e');
      p.r('#3a8ac8', 22, 60, 10, 10); p.r('#3a8ac8', 64, 60, 10, 10);   // water jugs
    },
  },
  // The sportsfield toilet block: green colorbond, a row of doors.
  mftoilet: {
    foot: [5, 2], tex: [80, 54],
    paintHd(p) {
      shadow(p, 80, 106, 156);
      box(p, '#4a7a4a', 4, 26, 152, 78, 3);
      for (let x = 6; x < 154; x += 6) p.r('#3e6a3e', x, 30, 2, 70);
      p.r('#c8ccd0', 0, 16, 160, 12); p.r('#e8ecf0', 0, 16, 160, 3); p.r('#9a9ea4', 0, 26, 160, 2);
      for (let i = 0; i < 5; i++) { box(p, '#d8d4cc', 12 + i * 29, 46, 22, 56, 2); p.r('#3a8a3a', 28 + i * 29, 72, 3, 4); p.r('#c8282e', 18 + i * 29, 52, 10, 4); }
      box(p, '#f4f0e6', 52, 30, 56, 12, 2); text(p, 'TOILETS', 80 - tw('TOILETS') / 2, 33, '#2a2a2a');
    },
  },
  mfportaloo: {
    foot: [1, 1], tex: [16, 38], variants: ['blue', 'green'],
    paintHd(p, v) {
      const c = v === 'green' ? '#3a8a4a' : '#2a6ab8';
      shadow(p, 16, 74, 30);
      box(p, c, 2, 12, 28, 62, 2); p.r(shade(c, 0.3), 0, 6, 32, 8); p.r(shade(c, -0.2), 0, 12, 32, 2);
      p.r('#e8e4dc', 6, 20, 20, 4); p.r('#d8302a', 22, 40, 4, 6); p.r(shade(c, -0.2), 4, 30, 2, 40);
    },
  },
  // Dome tents in every colour, with guy ropes out the sides.
  mftent: {
    foot: [2, 2], tex: [32, 30], variants: Object.keys(TENT),
    paintHd(p, v) {
      const c = TENT[v] || TENT.orange;
      shadow(p, 32, 58, 62);
      for (let y = 0; y < 44; y++) { const half = Math.round(Math.sqrt(Math.max(0, 1 - ((44 - y) / 44) ** 2)) * 28); p.r(y < 4 ? shade(c, 0.3) : c, 32 - half, 12 + y, half * 2, 1); }
      for (let y = 14; y < 56; y++) { const half = Math.round(Math.sqrt(Math.max(0, 1 - ((56 - y) / 44) ** 2)) * 28); p.r(shade(c, -0.25), 32 + half - 3, y, 3, 1); }
      p.r(shade(c, 0.35), 31, 12, 2, 44);                               // pole sleeve
      for (let y = 30; y < 56; y++) { const half = Math.round((y - 30) * 0.5); p.r('#2a2422', 32 - half, y, half * 2, 1); }   // door
      p.r('#d8d4cc', 31, 30, 2, 26);                                    // zip
      p.r('#d8d4cc', 2, 50, 8, 1); p.r('#d8d4cc', 54, 50, 8, 1);        // guy ropes
      p.r('#8a8e96', 1, 52, 2, 4); p.r('#8a8e96', 61, 52, 2, 4);
    },
  },
  // A big family tunnel tent.
  mfbigtent: {
    foot: [3, 2], tex: [48, 34], variants: ['grey', 'blue', 'green', 'brown'],
    paintHd(p, v) {
      const c = TENT[v] || TENT.grey, d = shade(c, -0.25);
      shadow(p, 48, 66, 94);
      for (let i = 0; i < 3; i++) for (let y = 0; y < 40; y++) { const half = Math.round(Math.sqrt(Math.max(0, 1 - ((40 - y) / 40) ** 2)) * 18); p.r(y < 3 ? shade(c, 0.3) : i === 1 ? c : shade(c, -0.08), 18 + i * 30 - half + 12, 22 + y, half * 2, 1); }
      p.r(d, 6, 60, 84, 3);
      p.r('#2a2422', 10, 40, 18, 22); p.r('#d8d4cc', 18, 40, 2, 22);
      p.r('#e8742a', 30, 22, 60, 3);
    },
  },
  // Gazebos: the crew's shade. Drawn over you when you walk under.
  mfgazebo: {
    foot: [3, 3], tex: [48, 64], variants: ['white', 'blue', 'green', 'red', 'stripe'], roof: true, solid: false,
    paintHd(p, v) {
      const c = { white: '#f0eee8', blue: '#3a6ac8', green: '#3a8a4a', red: '#c8342a', stripe: '#f0eee8' }[v] || '#f0eee8';
      // Legs
      for (const x of [6, 86]) { p.r('#8a8e96', x, 40, 4, 84); p.r('#b8bcc4', x, 40, 1, 84); }
      for (const x of [14, 78]) p.r('#6a6e76', x, 36, 3, 58);
      // Canopy: a low pyramid with a valance
      for (let y = 0; y < 30; y++) { const half = Math.round(6 + y * 1.45); p.r(y < 3 ? shade(c, 0.25) : c, 48 - half, 6 + y, half * 2, 1); }
      for (let y = 0; y < 30; y++) { const half = Math.round(6 + y * 1.45); p.r(shade(c, -0.18), 48 + half - 4, 6 + y, 4, 1); }
      if (v === 'stripe') for (let x = 4; x < 92; x += 12) p.r('#c8342a', x, 36, 6, 12);
      p.r(shade(c, -0.1), 2, 36, 92, 12); p.r(shade(c, -0.3), 2, 46, 92, 2);
      for (let x = 2; x < 94; x += 8) p.r(shade(c, -0.2), x, 48, 4, 2);
      if (v === 'stripe') for (let x = 2; x < 94; x += 12) p.r('#c8342a', x, 36, 6, 12);
    },
  },
  mfesky: {
    foot: [1, 1], tex: [16, 16], variants: ['blue', 'red', 'white'],
    paintHd(p, v) {
      const c = { blue: '#2a6ab8', red: '#c8342a', white: '#f0eee8' }[v] || '#2a6ab8';
      shadow(p, 16, 30, 30);
      box(p, '#f4f4f0', 2, 8, 28, 8, 2);   // white lid
      box(p, c, 2, 14, 28, 16, 2);
      p.r('#2a2a2a', 10, 6, 12, 3);
    },
  },
  // A folding camp chair. You can sit in it.
  mfcampchair: {
    foot: [1, 1], tex: [16, 24], variants: ['blue', 'green', 'red', 'black'],
    paintHd(p, v) {
      const c = { blue: '#2a5aa8', green: '#2e7a3e', red: '#b8282e', black: '#2a2a30' }[v] || '#2a5aa8';
      shadow(p, 16, 46, 28);
      p.r('#8a8e96', 4, 22, 2, 26); p.r('#8a8e96', 26, 22, 2, 26);
      box(p, c, 6, 6, 20, 24, 2);
      box(p, shade(c, -0.1), 4, 28, 24, 8, 2);
      p.r('#1e1e22', 0, 26, 6, 3); p.r('#1e1e22', 26, 26, 6, 3);
      p.r('#3a3a40', 27, 22, 4, 4);   // the cup holder
    },
  },
  // Tom Mankeys' red neon X on its black frame.
  mfxneon: {
    foot: [3, 1], tex: [48, 64],
    lights: [{ x: 24, y: 22, r: 40, tint: 0xff2a2a }],
    paintHd(p) {
      shadow(p, 48, 126, 70);
      p.r('#1e1e22', 14, 70, 4, 56); p.r('#1e1e22', 78, 70, 4, 56);
      p.r('#1e1e22', 10, 6, 76, 4);
      for (let i = 0; i < 64; i++) {
        for (const [x, y] of [[16 + i, 10 + i], [80 - i, 10 + i]]) { p.r('#ff2a2a', x, y, 5, 5); p.r('#ffb0a0', x + 1, y + 1, 2, 2); }
      }
    },
  },
  // The charter bus.
  mfbus: {
    foot: [8, 2], tex: [128, 54],
    paintHd(p) {
      const W = 256, H = 108;
      shadow(p, W / 2, H - 2, 250);
      box(p, '#f4f2ee', 6, 14, 244, 76, 3);
      p.r('#2a5aa8', 6, 60, 244, 8); p.r('#c8282e', 6, 68, 244, 4);
      p.r('#2a3a4a', 34, 22, 210, 30); p.r('#4a5a6a', 34, 22, 210, 4);
      for (let x = 34; x < 244; x += 30) p.r('#d8dce2', x, 22, 2, 30);
      p.r('#2a3a4a', 8, 22, 22, 50); p.r('#5a6a7a', 10, 24, 6, 20);     // windscreen and door
      p.r('#3a4a5a', 12, 52, 14, 36);
      text(p, 'CHARTER', 120, 76, '#2a5aa8', 2);
      for (const x of [44, 200]) { p.blob(x, 92, 13, '#1e1e22'); p.blob(x, 92, 6, '#a8acb4'); p.blob(x, 92, 2, '#3a3a40'); }
      p.r('#f5d03a', 6, 78, 4, 6); p.r('#c8282e', 246, 78, 4, 6);
      p.r('#d8dce2', 6, 10, 244, 4);
    },
  },
  // Reception: the wristband tent by the car park.
  mfreceptent: {
    foot: [6, 3], tex: [96, 66],
    paintHd(p) {
      shadow(p, 96, 130, 188);
      for (let i = 0; i < 2; i++) { const cx = 50 + i * 92; for (let y = 0; y < 30; y++) { const half = Math.round(8 + y * 1.3); p.r(y < 3 ? '#ffffff' : '#ece8e2', cx - half, 14 + y, half * 2, 1); } }
      p.r('#c8c2ba', 4, 44, 184, 3);
      p.r('#8a8e96', 6, 44, 3, 82); p.r('#8a8e96', 183, 44, 3, 82);
      p.r('#3a2a22', 10, 47, 172, 40);
      box(p, '#2a5aa8', 46, 50, 100, 18, 2); ctext(p, 'RECEPTION', 96, 54, '#ffffff', 2);
      box(p, '#f4f0e6', 10, 96, 172, 30, 3);
      for (let x = 24; x < 170; x += 22) { p.r('#f5d03a', x, 92, 10, 4); p.r('#c8282e', x + 2, 90, 6, 2); }   // the wristbands
    },
  },
  mfhaybale: {
    foot: [2, 1], tex: [32, 24], variants: ['square', 'round'],
    paintHd(p, v) {
      shadow(p, 32, 46, 62);
      if (v === 'round') {
        p.blob(32, 26, 20, '#d8b060'); p.blob(30, 24, 16, '#e8c878');
        for (let r = 4; r < 20; r += 5) for (let a = 0; a < 6.28; a += 0.3) p.r('#b8904a', 32 + Math.cos(a) * r, 26 + Math.sin(a) * r, 2, 2);
        return;
      }
      box(p, '#d8b060', 2, 16, 60, 30, 3);
      for (let i = 0; i < 30; i++) p.r(i % 2 ? '#e8c878' : '#b8904a', 4 + Math.round(hash(i, 2) * 54), 20 + Math.round(hash(i, 6) * 22), 4, 1);
      p.r('#8a5a2e', 18, 16, 2, 30); p.r('#8a5a2e', 44, 16, 2, 30);   // twine
    },
  },
  // The Ecoplex: an outdoor cinema screen in the bush.
  mfscreen: {
    foot: [8, 1], tex: [128, 100],
    lights: [{ x: 64, y: 44, r: 54, tint: 0xd8e8ff }],
    paintHd(p) {
      const W = 256, H = 200;
      // Scaffolding
      for (const x of [14, 122, 236]) { p.r('#8a8e96', x, 20, 4, 176); }
      for (let y = 30; y < 190; y += 34) { p.r('#9aa0a8', 14, y, 226, 3); }
      // The screen and its film: a sunset over hills
      box(p, '#1e1e22', 16, 12, 224, 136, 3);
      p.r('#f4e8c8', 24, 20, 208, 120);
      p.r('#f2a85a', 24, 20, 208, 50); p.r('#f2c878', 24, 60, 208, 30);
      p.blob(150, 84, 16, '#fff0b0');
      for (let x = 24; x < 232; x++) { const h = 20 + Math.round(Math.sin(x / 23) * 10 + Math.sin(x / 9) * 4); p.r('#5a7a46', x, 140 - h, 1, h); }
      text(p, 'ECOPLEX', 128 - tw('ECOPLEX', 2) / 2, 154, '#f4e8c8', 2);
    },
  },
  // The Ecoplex projector: a little vintage caravan with a window at the back.
  mfprojector: {
    foot: [2, 2], tex: [32, 40],
    paintHd(p) {
      shadow(p, 32, 78, 62);
      p.blob(32, 40, 26, '#e8e0cc'); p.r('#e8e0cc', 6, 40, 52, 30); p.r('#c8b898', 6, 54, 52, 4);
      p.r('#3a8a8a', 6, 58, 52, 6);
      p.r('#1e1e22', 22, 26, 20, 16); p.blob(32, 34, 5, '#d8e8ff');
      p.blob(20, 72, 7, '#1e1e22'); p.r('#8a8e96', 52, 62, 10, 3);
    },
  },
  mfspeaker: {
    foot: [1, 1], tex: [16, 42],
    paintHd(p) {
      shadow(p, 16, 82, 30);
      box(p, '#1e1e22', 2, 6, 28, 76, 2);
      for (let k = 0; k < 3; k++) { p.blob(16, 18 + k * 24, 9, '#3a3a40'); p.blob(16, 18 + k * 24, 4, '#141418'); }
    },
  },
  mflighttower: {
    foot: [1, 1], tex: [16, 74],
    lights: [{ x: 8, y: 6, r: 50, tint: 0xfff4d0 }],
    paintHd(p) {
      shadow(p, 16, 146, 24);
      for (let y = 18; y < 146; y += 1) { p.r('#9aa0a8', 8, y, 2, 1); p.r('#9aa0a8', 22, y, 2, 1); }
      for (let y = 20; y < 146; y += 10) { p.r('#8a8e96', 8, y, 16, 2); }
      box(p, '#2a2a30', 2, 2, 28, 16, 2); p.r('#fff4d0', 6, 6, 20, 6);
    },
  },
  // Painted road signs on the festival's dirt roads.
  mfroadsign: {
    foot: [1, 1], tex: [32, 40], variants: ['hell', 'high', 'low', 'winding', 'electric', 'loop', 'bushcamp', 'topcamp', 'amphi', 'pines', 'reception', 'bluegums', 'sunset'],
    paintHd(p, v) {
      const T = { hell: ['HIGHWAY', 'TO HELL RD'], high: ['THE HIGH', 'ROAD'], low: ['THE LOW', 'ROAD'], winding: ['LONG AND', 'WINDING RD'], electric: ['ELECTRIC', 'AVENUE'],
        loop: ['LOOP DE', 'LOOP'], bushcamp: ['TO BUSH', 'CAMP'], topcamp: ['TO TOP', 'CAMP'], amphi: ['AMPHI', 'THEATRE'], pines: ['TO SOUTH', 'PINES'],
        reception: ['RECEPTION', 'BUS STOP'], bluegums: ['TO BLUE', 'GUMS'], sunset: ['SUNSET', 'STRIP'] }[v] || ['MEREDITH', ''];
      shadow(p, 32, 78, 22);
      p.r('#8a6236', 30, 30, 5, 48); p.r('#a87a46', 30, 30, 2, 48);
      box(p, v === 'hell' ? '#c8282e' : '#e8742a', 2, 6, 60, 26, 2);
      ctext(p, T[0], 32, 10, '#ffffff'); ctext(p, T[1], 32, 20, '#ffffff');
    },
  },
  // Rubbish, recycling and compost under one sign.
  mfbins: {
    foot: [3, 1], tex: [48, 34],
    paintHd(p) {
      shadow(p, 48, 66, 92);
      for (const [i, c] of [[0, '#c8282e'], [1, '#e8c030'], [2, '#3a8a3a']]) { box(p, '#2a2a30', 4 + i * 30, 30, 28, 34, 2); box(p, c, 2 + i * 30, 26, 32, 6, 2); }
      p.r('#8a8e96', 46, 0, 3, 26); box(p, '#f4f0e6', 18, 0, 60, 14, 2); ctext(p, 'RUBBISH', 48, 4, '#2a2a2a');
    },
  },
  mfflag: {
    foot: [1, 1], tex: [16, 60], variants: ['pink', 'blue', 'yellow', 'green', 'purple'],
    paintHd(p, v) {
      const c = { pink: '#f2509a', blue: '#3a8ae8', yellow: '#f5d03a', green: '#4ab85a', purple: '#a050e0' }[v] || '#f2509a';
      shadow(p, 16, 118, 14);
      p.r('#8a8e96', 6, 4, 2, 116);
      for (let y = 4; y < 80; y++) { const w = Math.round(14 + Math.sin(y / 76 * Math.PI) * 6 - y / 12); p.r(y < 6 ? shade(c, 0.3) : c, 8, y, w, 1); p.r(shade(c, -0.25), 8 + w - 2, y, 2, 1); }
    },
  },
  // A Hills Hoist at camp, hung with towels.
  mfhoist: {
    foot: [2, 2], tex: [32, 44], solid: false,
    paintHd(p) {
      shadow(p, 32, 86, 50);
      p.r('#a8acb4', 31, 20, 3, 66);
      for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4; for (let d = 0; d < 28; d++) p.r('#a8acb4', 32 + Math.cos(a) * d, 20 + Math.sin(a) * d * 0.35, 2, 2); }
      for (const [x, c] of [[8, '#3ad0d8'], [22, '#f2509a'], [40, '#f5d03a'], [50, '#3a6ac8']]) box(p, c, x, 24, 10, 20, 2);
    },
  },
  // Jess's pet portal: a little orange tent, fairy lights and a very large battery.
  mfportal: {
    foot: [2, 2], tex: [32, 34], variants: ['off', 'on', 'red'],
    lights: v => v === 'off' ? [] : [{ x: 16, y: 18, r: 34, tint: v === 'red' ? 0xff2a2a : 0xa050ff }],
    paintHd(p, v) {
      const c = '#e8742a';
      shadow(p, 32, 66, 62);
      for (let y = 0; y < 40; y++) { const half = Math.round(Math.sqrt(Math.max(0, 1 - ((40 - y) / 40) ** 2)) * 22); p.r(y < 3 ? shade(c, 0.3) : c, 28 - half, 22 + y, half * 2, 1); }
      for (let y = 40; y < 62; y++) { const half = Math.round((y - 40) * 0.45); p.r(v === 'off' ? '#2a2422' : v === 'red' ? '#ff4a3a' : '#c890ff', 28 - half, y, half * 2, 1); }
      for (let i = 0; i < 9; i++) { const a = Math.PI + i * Math.PI / 8; p.r(['#f5d03a', '#f2509a', '#3ad0d8'][i % 3], 28 + Math.cos(a) * 22, 62 + Math.sin(a) * 40 - 2, 3, 3); }
      box(p, '#2a2a30', 48, 40, 14, 22, 2); p.r(v === 'red' ? '#ff2a2a' : '#4ad85a', 51, 44, 8, 3); p.r('#c8282e', 52, 36, 3, 4); p.r('#2a2a2a', 56, 36, 3, 4);
      p.r('#2a2a2a', 40, 58, 8, 1);
    },
  },
  mfwatertank: {
    foot: [2, 2], tex: [32, 46],
    paintHd(p) {
      shadow(p, 32, 90, 62);
      box(p, '#a8b4bc', 4, 16, 56, 70, 3);
      for (let y = 22; y < 84; y += 5) p.r('#8a96a0', 4, y, 56, 2);
      p.r('#c8d4dc', 2, 12, 60, 6);
      box(p, '#2a6ab8', 10, 40, 44, 14, 2); ctext(p, 'WATER', 32, 44, '#ffffff');
      p.r('#3a3a40', 14, 70, 4, 6); p.r('#3a3a40', 46, 70, 4, 6);
    },
  },
});

// ------------------------------------------------------------ battle foes (16x16, outlined)
function face(p, x, y, gap = 4) {
  p.r('#ffffff', x, y, 2, 2); p.r('#ffffff', x + gap, y, 2, 2);
  p.r('#1a1010', x + 1, y + 1, 1, 1); p.r('#1a1010', x + gap, y + 1, 1, 1);
  p.r('#1a1010', x + 2, y + 3, gap - 2, 1);
}
export const MF_FOE_ART = {
  glowstick: [16, 16, p => { p.r('#5aff6a', 6, 1, 4, 14); p.r('#c8ffc8', 7, 1, 1, 14); p.r('#2aa83a', 9, 1, 1, 14); p.r('#e8e4dc', 6, 0, 4, 1); face(p, 5, 6, 4); }],
  lostthong: [16, 16, p => { p.r('#3a8ae8', 2, 6, 12, 8); p.r('#6ab0ff', 2, 6, 12, 2); p.r('#f5d03a', 7, 4, 2, 6); p.r('#f5d03a', 4, 6, 4, 1); p.r('#f5d03a', 9, 6, 4, 1); face(p, 4, 9, 6); }],
  esky: [16, 16, p => { p.r('#f4f4f0', 1, 4, 14, 3); p.r('#2a6ab8', 1, 7, 14, 8); p.r('#4a8ad8', 1, 7, 14, 1); p.r('#2a2a2a', 6, 3, 4, 1); face(p, 4, 9, 6); }],
  gazebofoe: [16, 16, p => { p.r('#f0eee8', 1, 2, 14, 3); p.r('#d8d4cc', 0, 5, 16, 2); p.r('#8a8e96', 1, 7, 1, 8); p.r('#8a8e96', 14, 7, 1, 8); p.r('#8a8e96', 4, 7, 1, 6); face(p, 5, 2, 4); }],
  dustdevil: [16, 16, p => { for (let y = 1; y < 15; y++) { const w = Math.round(2 + (15 - y) * 0.7); p.r(y % 3 ? '#c8a878' : '#a8885a', 8 - w / 2 + Math.round(Math.sin(y) * 1.5), y, w, 1); } face(p, 5, 4, 4); }],
  festfly: [16, 16, p => { p.blob(8, 9, 4, '#2a3a2a'); p.r('#5a7a5a', 6, 7, 3, 2); p.r('#d8f0ff', 2, 3, 5, 3); p.r('#d8f0ff', 9, 3, 5, 3); p.r('#c8282e', 5, 8, 2, 2); p.r('#c8282e', 9, 8, 2, 2); }],
  glitterbomb: [16, 16, p => { p.blob(8, 9, 6, '#a050e0'); p.blob(7, 8, 4, '#c890ff'); p.r('#f5d03a', 7, 2, 2, 2); for (let i = 0; i < 8; i++) p.r(['#f5d03a', '#ffffff', '#3ad0d8'][i % 3], 2 + Math.round(hash(i, 1) * 12), 1 + Math.round(hash(i, 4) * 13), 1, 1); face(p, 5, 8, 4); }],
  theboot: [16, 16, p => { p.r('#5a3a1e', 4, 1, 6, 10); p.r('#7a5230', 4, 1, 2, 10); p.r('#5a3a1e', 4, 10, 10, 4); p.r('#2a1a10', 4, 14, 11, 1); p.r('#e8e4dc', 5, 3, 3, 1); face(p, 6, 6, 3); }],
  speakerstack: [16, 16, p => { p.r('#1e1e22', 3, 0, 10, 16); p.blob(8, 4, 3, '#3a3a40'); p.blob(8, 11, 3, '#3a3a40'); p.r('#ff4aa0', 3, 15, 10, 1); face(p, 5, 3, 4); }],
  sunsetfoe: [16, 16, p => { p.blob(8, 9, 6, '#f2a85a'); p.blob(8, 9, 4, '#fff0b0'); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; p.r('#f5d03a', 8 + Math.cos(a) * 7, 9 + Math.sin(a) * 7, 1, 1); } face(p, 5, 8, 4); }],
};

// ------------------------------------------------------------ items (12x12)
export const MF_ITEM_ART = {
  icypole: { pal: { a: '#f2509a', b: '#ffffff', k: '#c8a070', c: '#3ad0d8' }, rows: [
    '............', '....aaaa....', '...abaaaa...', '...aaaaaa...', '...cccccc...', '...cbcccc...',
    '...cccccc...', '....cccc....', '.....kk.....', '.....kk.....', '.....kk.....', '............'] },
  festpie: { pal: { a: '#c88a3a', b: '#e8b060', d: '#8a5a2e', g: '#c8282e' }, rows: [
    '............', '............', '...bbbbbb...', '..bbaabbbb..', '.bbbbbbbbbb.', '.dddddddddd.',
    '.daaaaaaaad.', '.daaaaaaaad.', '..dddddddd..', '............', '............', '............'] },
  hotchips: { pal: { a: '#f5d03a', b: '#e8a830', w: '#f4f0e6', r: '#c8282e' }, rows: [
    '............', '...a.a.a....', '..aabaaba...', '..abaabaa...', '..wwwwwwww..', '..wrrwwrrw..',
    '...wwwwww...', '...wrrwww...', '....wwww....', '....wwww....', '............', '............'] },
  sunscreen: { pal: { a: '#f5d03a', b: '#f08a2a', w: '#ffffff', k: '#3a6ac8' }, rows: [
    '.....kk.....', '.....kk.....', '....aaaa....', '....aaaa....', '...aaaaaa...', '...awwwwa...',
    '...awbbwa...', '...awwwwa...', '...aaaaaa...', '...aaaaaa...', '....aaaa....', '............'] },
  festsocks: { pal: { a: '#3a8a4a', b: '#f4f0e6', c: '#c8282e' }, rows: [
    '............', '..aaa..aaa..', '..bbb..bbb..', '..aaa..aaa..', '..aaa..aaa..', '..aaa..aaa..',
    '..aaaa.aaaa.', '..aaaaaaaaaa', '..ccccacccc.', '............', '............', '............'] },
};
