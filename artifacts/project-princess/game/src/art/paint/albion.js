// Built-in art for Sydney Rd at Albion St, Brunswick: the Edinburgh Castle
// Hotel (white art deco, green band and window frames, red base, HOTEL down
// the corner), its bottle shop in black brick, the white deco shops across
// Albion St, the green heritage tram shelter, a skip, traffic lights and the
// yellow crossing. Plus the bottle shop's insides: fridges of cans, wine
// racks, slabs, the wall of beer coasters and the counter.
// Same format as objects.js.
import { shade, outline, textWidth } from './painter.js';
import { bricks } from './laverton.js';
import { hash } from '../../util.js';

const T = 16;
function frame(def) {
  const [fw, fh] = def.foot, [tw, th] = def.tex;
  return { W: fw * T, H: fh * T, sx: Math.round((tw - fw * T) / 2), sy: th - fh * T, tw, th };
}
function box(p, x, y, w, h, c) {
  p.r(c, x, y, w, h); p.r(shade(c, 0.18), x, y, w, 1); p.r(shade(c, -0.22), x, y + h - 1, w, 1);
}
function centred(p, str, cx, y, c) { p.text(str, Math.round(cx - textWidth(str) / 2), y, c); }
function tags(p, x, y, w, h, seed) {
  const cols = ['#1e1e24', '#e77fb8', '#3fa38f', '#7fa6e8', '#c8443a'];
  for (let i = 0; i < Math.floor(w / 10); i++) {
    const c = cols[Math.floor(hash(i, seed) * cols.length)], tx = x + 2 + Math.floor(hash(seed, i) * (w - 12)), ty = y + 1 + Math.floor(hash(i + 3, seed) * (h - 6));
    for (let k = 0; k < 8; k++) p.r(c, tx + k, ty + Math.round(Math.sin(k * 1.4 + i) * 1.5) + 2, 1, 2);
  }
}
// Steel-framed deco window: green frame, a few panes, a sill.
function decoWindow(p, x, y, w, h, frameC = '#2f6a4a') {
  p.r(frameC, x - 1, y - 1, w + 2, h + 2); p.r('#6a8aa0', x, y, w, h);
  p.r('#9ab8c8', x + 1, y + 1, 2, 2);
  for (let i = x + Math.floor(w / 3); i < x + w - 1; i += Math.floor(w / 3)) p.r(frameC, i, y, 1, h);
  p.r(frameC, x, y + Math.floor(h / 2), w, 1);
  p.r('#e8e4dc', x - 1, y + h + 1, w + 2, 1);
}
const cans = ['#c8443a', '#2a7a3a', '#2a5a8a', '#e8b830', '#16161a', '#f07ab0', '#f4efe0', '#3a9ab0', '#c8ccd0', '#e8823a'];

export const ALBION = {
  // The Edinburgh Castle Hotel, 702 Sydney Rd. Its corner (the right-hand
  // end) faces Albion St.
  edcastle: {
    foot: [10, 3], tex: [168, 116], variants: ['hotel'],
    paint(p) {
      const sx = 4, W = 160, H = 116, top = 26, green = '#2f6a4a', cream = '#f2eee2', red = '#b8482e';
      // stepped deco parapet
      p.r(cream, sx, top, W, H - top - 1);
      p.r(cream, sx + 40, top - 10, 80, 10); p.r(cream, sx + 60, top - 16, 40, 6);
      p.r('#fbf8f0', sx + 40, top - 10, 80, 1); p.r('#fbf8f0', sx + 60, top - 16, 40, 1); p.r('#fbf8f0', sx, top, W, 1);
      for (const x of [42, 116]) p.r('#dcd6c6', sx + x, top - 8, 2, 8);
      // EDINBURGH CASTLE across the parapet in green
      p.r(green, sx + 34, top + 3, 92, 9); p.r(shade(green, 0.2), sx + 34, top + 3, 92, 1);
      centred(p, 'EDINBURGH CASTLE', sx + 80, top + 5, cream);
      // speed lines, very deco
      for (const dy of [5, 7, 9]) { p.r('#d8d2c2', sx + 6, top + dy, 24, 1); p.r('#d8d2c2', sx + 130, top + dy, 24, 1); }
      // first floor windows with green frames
      for (let i = 0; i < 7; i++) decoWindow(p, sx + 8 + i * 21, top + 18, 13, 16, green);
      // the green band between the floors
      p.r(green, sx, top + 40, W, 5); p.r(shade(green, 0.25), sx, top + 40, W, 1); p.r(shade(green, -0.3), sx, top + 44, W, 1);
      // ground floor: red tiled base, cream above, big green-framed windows and doors
      p.r(red, sx, H - 16, W, 15); for (let x = 0; x < W; x += 4) p.r(shade(red, -0.15), sx + x, H - 16, 1, 15);
      p.r(shade(red, 0.2), sx, H - 16, W, 1);
      for (const x of [6, 46, 98, 132]) decoWindow(p, sx + x, top + 52, 22, 20, green);
      for (const x of [32, 76, 120]) {
        p.r('#1e2a22', sx + x - 1, top + 49, 12, H - top - 49);
        p.r(green, sx + x, top + 50, 10, H - top - 51); p.r(shade(green, 0.2), sx + x, top + 50, 10, 1);
        p.r('#9ab8c8', sx + x + 2, top + 53, 6, 8); p.r('#e8c040', sx + x + 8, top + 66, 1, 2);
      }
      // HOTEL down the corner on a green blade sign, lit at night (cream letters)
      p.r('#1e2a22', sx + W - 12, top - 4, 11, 46); p.r(green, sx + W - 11, top - 3, 9, 44);
      'HOTEL'.split('').forEach((ch, i) => p.text(ch, sx + W - 8, top + i * 8, '#f8f0c8'));
      // corner pier and a lamp
      p.r('#e2dccc', sx + W - 2, top, 2, H - top - 1);
      p.r('#1e1e24', sx + 26, top + 46, 1, 3); p.blob(sx + 26, top + 50, 2, '#f5e08a');
      p.r('rgba(0,0,0,0.25)', sx, H - 2, W, 1);
      outline(p.ctx, 0, 0, 168, H);
    },
  },
  // The bottle shop out the back, 694 Sydney Rd: black brick, a hanging
  // BOTTLESHOP sign, brewery posters in the window and pot plants by the door.
  bottleshop: {
    foot: [5, 3], tex: [84, 72], variants: ['black'],
    paint(p) {
      const sx = 2, W = 80, H = 72, top = 8;
      bricks(p, sx, top, W, H - top - 1, '#26262a', 5);
      p.r('#3a3a40', sx, top, W, 3); p.r('#4a4a52', sx, top, W, 1);
      // upper windows
      for (const x of [8, 32, 56]) { p.r('#121214', x + sx - 1, top + 7, 16, 15); p.r('#4a5a6a', x + sx, top + 8, 14, 13); p.r('#6a7a8a', x + sx + 1, top + 9, 3, 2); }
      // hanging blade sign under a little awning
      p.r('#3a3a40', sx, top + 26, W, 3);
      p.r('#9aa0a8', sx + 12, top + 29, 1, 3); p.r('#9aa0a8', sx + 64, top + 29, 1, 3);
      p.r('#f4efe0', sx + 9, top + 32, 60, 10); p.r('#121214', sx + 10, top + 33, 58, 8);
      centred(p, 'BOTTLESHOP', sx + 39, top + 35, '#f4efe0');
      // the window: brewery posters and stacked cans
      p.r('#121214', sx + 4, top + 44, 40, H - top - 46); p.r('#3a4a5a', sx + 5, top + 45, 38, H - top - 48);
      [['#e8b830', 6], ['#f07ab0', 16], ['#3a9ab0', 27]].forEach(([c, x]) => { p.r(c, sx + x, top + 46, 9, 11); p.r('#f4efe0', sx + x + 2, top + 48, 5, 2); p.r(shade(c, -0.3), sx + x + 1, top + 52, 7, 3); });
      for (let i = 0; i < 9; i++) p.r(cans[i % cans.length], sx + 6 + i * 4, H - 8, 3, 4);
      // door, open, warm light inside
      p.r('#121214', sx + 50, top + 44, 18, H - top - 45); p.r('#e8c070', sx + 51, top + 45, 16, H - top - 46);
      p.r('#a8823a', sx + 51, H - 10, 16, 8); for (let i = 0; i < 4; i++) p.r(cans[(i * 3) % cans.length], sx + 53 + i * 3, top + 50, 2, 6);
      // pot plants by the door
      for (const x of [46, 72]) { p.r('#8a4a2a', sx + x, H - 9, 6, 7); p.r('#a8603a', sx + x, H - 9, 6, 1); p.blob(sx + x + 3, H - 12, 4, '#3f8a3e'); p.blob(sx + x + 2, H - 14, 2, '#57a84a'); }
      outline(p.ctx, 0, 0, 84, H);
    },
  },
  // White art deco shops across Albion St. Vacant, FOR LEASE, tagged.
  decoshop: {
    foot: [4, 3], tex: [64, 66], variants: ['lease', 'cafe'],
    paint(p, v) {
      const sx = 0, W = 64, H = 66, top = 10, wall = '#ecebe4';
      p.r(wall, sx, top, W, H - top - 1);
      p.r(wall, sx + 16, top - 8, 32, 8); p.r('#ffffff', sx + 16, top - 8, 32, 1); p.r('#ffffff', sx, top, W, 1);
      for (const dy of [2, 4, 6]) p.r('#d0cec4', sx + 20, top - 8 + dy, 24, 1);
      p.r('#d0cec4', sx + 4, top + 4, W - 8, 1);
      for (const x of [6, 36]) decoWindow(p, sx + x, top + 9, 20, 12, '#3a3e44');
      // awning ledge and the shopfront
      p.r('#c8c6bc', sx, top + 27, W, 3); p.r('#ffffff', sx, top + 26, W, 1);
      p.r('#2a2e33', sx + 3, top + 32, 40, H - top - 34); p.r(v === 'cafe' ? '#e8c070' : '#4a5a68', sx + 4, top + 33, 38, H - top - 36);
      if (v === 'lease') {
        p.r('#f4efe0', sx + 9, top + 37, 28, 10); p.r('#c8443a', sx + 9, top + 37, 28, 2);
        centred(p, 'FOR', sx + 23, top + 40, '#1e1e24'); p.r('#f4efe0', sx + 9, top + 47, 28, 7); centred(p, 'LEASE', sx + 23, top + 48, '#1e1e24');
      } else {
        p.r('#6a4a2a', sx + 6, H - 10, 34, 2); for (const x of [10, 22, 32]) { p.r('#f4efe0', sx + x, H - 13, 3, 3); }
        p.r('#1e1e24', sx + 8, top + 34, 30, 6); centred(p, 'COFFEE', sx + 23, top + 35, '#f4efe0');
      }
      p.r('#2a2e33', sx + 46, top + 32, 14, H - top - 33); p.r('#5a6a78', sx + 47, top + 33, 12, H - top - 34);
      // a dado of tags along the bottom
      tags(p, sx, H - 16, W, 14, v === 'lease' ? 7 : 11);
      outline(p.ctx, 0, 0, 64, H);
    },
  },
  // The curved green heritage tram shelter, cast-iron posts and all.
  heritageshelter: {
    foot: [4, 1], tex: [64, 44], variants: ['green'],
    paint(p) {
      const g = '#2f6a4a', gl = shade(g, 0.25);
      p.shadow(32, 43, 60);
      for (const x of [4, 30, 58]) { p.r('#1e2a22', x, 10, 3, 33); p.r(gl, x, 10, 1, 33); p.r('#1e2a22', x - 1, 40, 5, 3); }
      // the curved roof: a shallow arch, lighter on top
      for (let x = 0; x < 64; x++) { const h = Math.round(4 + Math.sin((x / 63) * Math.PI) * 4); p.r(g, x, 10 - h, 1, h + 3); p.r(gl, x, 10 - h, 1, 1); }
      p.r(shade(g, -0.3), 0, 12, 64, 1);
      // fretwork brackets
      for (const x of [4, 30, 58]) { p.r(g, x - 4, 13, 11, 1); p.r(g, x - 2, 14, 7, 1); }
      // a timber bench and a glass end panel
      p.r('#8a5a2e', 9, 32, 18, 3); p.r('#5e3a1a', 10, 35, 2, 6); p.r('#5e3a1a', 24, 35, 2, 6);
      p.r('rgba(168,208,228,0.55)', 34, 16, 22, 22); p.r('#f4efe0', 38, 20, 14, 8); p.text('19', 41, 22, g);
    },
  },
  skip: {
    foot: [2, 1], tex: [32, 22], variants: ['yellow'],
    paint(p) {
      p.shadow(16, 21, 30);
      p.r('#c89a1a', 1, 6, 30, 15); p.r('#e8c030', 3, 6, 26, 13); p.r('#f4d860', 3, 6, 26, 1);
      p.r('#c89a1a', 0, 4, 32, 3); p.r('#3a3a3a', 4, 18, 4, 3); p.r('#3a3a3a', 24, 18, 4, 3);
      // rubble poking out the top
      p.r('#8a8a8a', 6, 2, 6, 3); p.r('#a8603a', 14, 1, 7, 4); p.r('#d8d4c8', 22, 3, 5, 2);
      p.text('SKIP', 9, 11, '#3a2a10');
    },
  },
  trafficlight: {
    foot: [1, 1], tex: [16, 40], variants: ['lights'],
    paint(p) {
      p.shadow(8, 39, 8);
      p.r('#3a3e44', 7, 8, 2, 32); p.r('#5a5e66', 7, 8, 1, 32);
      p.r('#1e1e22', 4, 0, 8, 18); p.r('#2a2a30', 4, 0, 8, 1);
      p.blob(8, 3, 2, '#e83a2a'); p.blob(8, 9, 2, '#5a4a1a'); p.blob(8, 15, 2, '#1a4a2a');
      p.r('#e8c030', 9, 24, 4, 6); p.r('#1e1e22', 10, 26, 2, 2);    // the button you press nine times
    },
  },
  // Yellow painted crossing lines, flat on the road.
  crossing: {
    foot: [1, 1], tex: [16, 16], variants: ['h', 'v'], solid: false, flat: true,
    paint(p, v) {
      for (let i = 1; i < 16; i += 4) { if (v === 'h') p.r('#e8d040', i, 1, 2, 14); else p.r('#e8d040', 1, i, 14, 2); }
    },
  },

  // ---- Inside the bottle shop
  beerfridge: {
    foot: [2, 1], tex: [32, 40], variants: ['cans', 'stubbies'],
    paint(p, v) {
      box(p, 0, 0, 32, 40, '#2a2a30');
      p.r('#f4f8fa', 2, 2, 28, 3); p.text('COLD', 9, 2, '#2a5a8a');
      p.r('#a8c8d8', 2, 6, 28, 32); p.r('#c8e0ea', 2, 6, 28, 1);
      for (let s = 0; s < 4; s++) {
        const y = 8 + s * 8;
        p.r('#8a9aa8', 2, y + 6, 28, 1);
        for (let i = 0; i < 7; i++) {
          const c = cans[(i + s * 3) % cans.length], x = 3 + i * 4;
          if (v === 'stubbies') { p.r('#4a2a12', x + 1, y, 1, 2); p.r('#4a2a12', x, y + 2, 3, 4); p.r(c, x, y + 3, 3, 2); }
          else { p.r(c, x, y + 1, 3, 5); p.r(shade(c, 0.35), x, y + 1, 3, 1); }
        }
      }
      p.r('#1e1e22', 15, 6, 2, 32); p.r('#c8ccd0', 13, 18, 1, 6); p.r('#c8ccd0', 18, 18, 1, 6);
      p.r('rgba(255,255,255,0.35)', 4, 7, 2, 30);
    },
  },
  wineshelf: {
    foot: [2, 1], tex: [32, 36], variants: ['red', 'white'],
    paint(p, v) {
      box(p, 0, 0, 32, 36, '#7a4a2a');
      p.r('#5a3418', 2, 2, 28, 32);
      const wines = v === 'red' ? ['#3a0e1a', '#2a0a12', '#4a1424', '#3a0e1a'] : ['#a8b860', '#c8d890', '#f0a0b8', '#e8902a'];
      for (let s = 0; s < 4; s++) {
        const y = 3 + s * 8;
        p.r('#a8723c', 2, y + 7, 28, 1);
        for (let i = 0; i < 6; i++) { const x = 3 + i * 5, c = wines[(i + s) % wines.length]; p.r(c, x, y + 2, 3, 5); p.r(c, x + 1, y, 1, 2); p.r('#f4efe0', x, y + 4, 3, 1); }
      }
      p.r('#f4efe0', 9, 31, 14, 4); p.text(v === 'red' ? 'RED' : 'WHITE', v === 'red' ? 11 : 8, 31, '#5a1a2a');
    },
  },
  slabs: {
    foot: [1, 1], tex: [16, 26], variants: ['green', 'blue', 'gold'],
    paint(p, v) {
      p.shadow(8, 25, 14);
      const c = { green: '#2a7a3a', blue: '#2a3a6a', gold: '#e8b830' }[v];
      for (let i = 0; i < 4; i++) { const y = 20 - i * 6; box(p, 1, y, 14, 6, i % 2 ? shade(c, 0.12) : c); p.r('#f4efe0', 4, y + 2, 8, 2); p.r(shade(c, -0.3), 1, y + 5, 14, 1); }
    },
  },
  // A wall covered in beer coasters and can labels. Hangs on a wall.
  coasterwall: {
    foot: [3, 1], tex: [48, 16], variants: ['coasters'], solid: false, lined: true,
    paint(p) {
      p.r('#3a2a1a', 0, 1, 48, 15);
      for (let j = 0; j < 3; j++) for (let i = 0; i < 9; i++) {
        const c = cans[Math.floor(hash(i, j, 5) * cans.length)], x = 1 + i * 5 + (j % 2), y = 2 + j * 5;
        p.r(c, x, y, 4, 4); p.r(shade(c, 0.4), x + 1, y + 1, 2, 1);
      }
    },
  },
  sideboard: {
    foot: [3, 1], tex: [48, 30], variants: ['oak'],
    paint(p) {
      box(p, 0, 12, 48, 18, '#8a5a32'); p.r('#6a4024', 2, 16, 44, 1);
      for (const x of [4, 18, 32]) { p.r('#7a4a2a', x, 18, 12, 10); p.r('#a8723c', x + 5, 22, 2, 2); }
      // bottles on display
      [['#3a0e1a', 4], ['#e8902a', 10], ['#2a3a20', 16], ['#16161a', 22], ['#a8b860', 30], ['#3a0e1a', 38]].forEach(([c, x]) => { p.r(c, x, 4, 4, 8); p.r(c, x + 1, 1, 2, 3); p.r('#f4efe0', x, 7, 4, 2); });
    },
  },
  barcounter: {
    foot: [3, 1], tex: [48, 28], variants: ['till'],
    paint(p) {
      box(p, 0, 12, 48, 16, '#2a2a30'); p.r('#3a3a44', 2, 16, 44, 1);
      box(p, 0, 9, 48, 4, '#8a5a32');
      box(p, 32, 1, 12, 9, '#3a3a40'); p.r('#7ad0a0', 34, 3, 8, 3);
      p.r('#16161a', 6, 3, 4, 7); p.r('#e8d8b0', 6, 5, 4, 2);   // a can of Guinness on the counter
      for (let i = 0; i < 4; i++) p.r(cans[i + 2], 14 + i * 4, 6, 3, 4);   // a little row of singles
      p.r('#f4efe0', 6, 18, 20, 6); p.text('ID 25', 8, 19, '#c8443a');
    },
  },
};
