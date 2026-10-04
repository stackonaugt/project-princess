// Built-in art for Brunswick: Rose's flats on Donald St, A1 Bakery on
// Sydney Rd, Mem and Corni's apartments on Hope St, and Brunswick Station.
// Same format as objects.js.
import { shade, outline, textWidth } from './painter.js';
import { bricks, tileRoof } from './laverton.js';
import { hash } from '../../util.js';

function box(p, x, y, w, h, c) {
  p.r(c, x, y, w, h); p.r(shade(c, 0.18), x, y, w, 1); p.r(shade(c, -0.22), x, y + h - 1, w, 1);
}
function win(p, x, y, w, h, { frame = '#5a6068', glass = '#6a8aa8', blind = null } = {}) {
  p.r(frame, x - 1, y - 1, w + 2, h + 2); p.r(glass, x, y, w, h); p.r(shade(glass, 0.3), x + 1, y + 1, Math.max(1, w >> 2), 2);
  if (blind) p.r(blind, x, y, w, Math.floor(h / 2));
}
function plants(p, x, y, w) {
  for (let i = 0; i < w; i += 3) { const c = ['#3f8a3e', '#57a84a', '#2f7a37', '#c8443a', '#e77fb8'][Math.floor(hash(x + i, y) * 5)]; p.blob(x + i + 1, y, 2, c); p.r('#3f8a3e', x + i + 1, y + 1, 1, 3); }
}

// Text scaled up (whole pixels) for big painted signs and street art.
function bigText(p, str, x, y, scale, c) {
  p.ctx.save(); p.ctx.translate(x, y); p.ctx.scale(scale, scale); p.text(str, 0, 0, c); p.ctx.restore();
}
function centred(p, str, cx, y, c) { p.text(str, Math.round(cx - textWidth(str) / 2), y, c); }
// Corrugated iron: vertical ribs with a light top edge.
function corrugated(p, x, y, w, h, c) {
  p.r(c, x, y, w, h);
  for (let i = x; i < x + w; i += 3) { p.r(shade(c, 0.14), i, y, 1, h); p.r(shade(c, -0.14), i + 2, y, 1, h); }
}
// A roller door: horizontal slats, darker towards the bottom.
function rollerDoor(p, x, y, w, h, c) {
  p.r(shade(c, -0.4), x - 1, y - 1, w + 2, h + 1);
  for (let j = 0; j < h; j++) p.r(j % 3 === 2 ? shade(c, -0.2) : j % 3 === 0 ? shade(c, 0.12) : c, x, y + j, w, 1);
  p.r(shade(c, -0.35), x, y + h - 2, w, 2); p.r('#3a3a3a', x + Math.floor(w / 2) - 2, y + h - 4, 4, 1);
}
// Spray-paint tags: loopy scribbles in a few colours.
function tags(p, x, y, w, h, seed, cols = ['#1e1e24', '#e77fb8', '#3fa38f', '#f5d63a', '#7fa6e8']) {
  for (let i = 0; i < Math.floor(w / 9); i++) {
    const c = cols[Math.floor(hash(i, seed) * cols.length)], tx = x + 2 + Math.floor(hash(seed, i) * (w - 12)), ty = y + 2 + Math.floor(hash(i + 3, seed) * (h - 8));
    for (let k = 0; k < 8; k++) p.r(c, tx + k, ty + Math.round(Math.sin(k * 1.3 + i) * 2) + 2, 1, 2);
    p.r(c, tx, ty + 5, 8, 1);
  }
}
// Steel-framed factory windows (lots of little panes).
function factoryWindow(p, x, y, w, h) {
  p.r('#2a2e33', x - 1, y - 1, w + 2, h + 2); p.r('#7a9ab0', x, y, w, h);
  for (let i = x + 3; i < x + w; i += 4) p.r('#3a3e44', i, y, 1, h);
  for (let j = y + 3; j < y + h; j += 4) p.r('#3a3e44', x, j, w, 1);
  p.r('#a8c4d4', x + 1, y + 1, 2, 2); p.r('#5a6a78', x, y + h - 3, w, 3);
}

// Brunswick shopfronts with gentle joke names. Two storeys: parapet, upper
// windows, an awning, the painted fascia sign and the shop window.
const SHOPS = {
  tattoo: { wall: '#34343e', trim: '#c8443a', fascia: '#1e1e24', ink: '#f0c040', label: 'INK & IRONY', awning: null },
  oatmilk: { wall: '#e8e0cc', trim: '#f4efe0', fascia: '#5a7a42', ink: '#f4efe0', label: 'OAT CUISINE', awning: ['#5a7a42', '#f4efe0'] },
  origin: { wall: '#4a4d52', trim: '#5e6166', fascia: '#f4f4f0', ink: '#34363a', label: 'ORIGIN STORY', awning: null },
  opshop: { wall: '#c86a9a', trim: '#f4d8e4', fascia: '#f0d040', ink: '#6a2a6a', label: 'THREADBARE', awning: ['#6a2a6a', '#f0d040'] },
  vinyl: { wall: '#24405e', trim: '#3a5a7a', fascia: '#e77fb8', ink: '#ffffff', label: 'SPIN CYCLE', awning: null },
  vegan: { wall: '#f2ecdc', trim: '#ffffff', fascia: '#3f7a3a', ink: '#ffffff', label: 'LEAFY CLEAVER', awning: ['#3f7a3a', '#f2ecdc'] },
  bikecoop: { wall: '#a8553a', trim: '#e8dcc0', fascia: '#2a5ab8', ink: '#ffffff', label: 'CHAIN GANG', awning: null, brick: true },
  laundro: { wall: '#cfe0ea', trim: '#f4f8fa', fascia: '#2f6aa3', ink: '#ffffff', label: 'SUDS LAW', awning: ['#2f6aa3', '#f4f8fa'] },
  yoga: { wall: '#c8b8e0', trim: '#f0eaf8', fascia: '#6a4a9a', ink: '#f4efe0', label: 'DOWNWARD DOG', awning: null },
};

function shopWindow(p, v, x, y, w, h) {
  const glass = v === 'tattoo' || v === 'vinyl' ? '#3a4a5a' : '#a8d0e4';
  p.r('#2a2e33', x - 1, y - 1, w + 2, h + 2); p.r(glass, x, y, w, h); p.r(shade(glass, 0.3), x + 1, y + 1, 4, 2);
  const b = y + h;
  if (v === 'tattoo') {                              // flash sheet: a heart, an anchor, a little tram
    p.r('#f4efe0', x + 2, y + 2, 30, 9);
    p.blob(x + 7, y + 5, 2, '#c8443a'); p.r('#c8443a', x + 5, y + 6, 5, 2); p.r('#c8443a', x + 6, y + 8, 3, 1);
    p.r('#2f6aa3', x + 16, y + 3, 1, 6); p.r('#2f6aa3', x + 14, y + 4, 5, 1); p.r('#2f6aa3', x + 14, y + 8, 5, 1);
    p.r('#3a8a5a', x + 23, y + 4, 7, 4); p.r('#f5d63a', x + 23, y + 4, 7, 1); p.r('#1e1e24', x + 26, y + 3, 1, 1);
    p.r('#e77fb8', x + 3, b - 2, 28, 1);
  } else if (v === 'oatmilk') {                     // cups and a tower of oat milk cartons
    for (let i = 0; i < 3; i++) { p.r('#f4efe0', x + 3 + i * 7, b - 7, 5, 6); p.r('#6a4a2a', x + 3 + i * 7, b - 7, 5, 1); }
    for (let i = 0; i < 2; i++) { p.r('#e8d8a8', x + 24, b - 6 - i * 5, 8, 5); p.r('#5a7a42', x + 24, b - 4 - i * 5, 8, 1); }
  } else if (v === 'origin') {                       // one plant, one bag of beans, on a plinth. Minimal.
    p.r('#e8e4dc', x + 14, b - 7, 8, 7); p.r('#8a5a3a', x + 15, b - 13, 6, 6); p.r('#f4efe0', x + 16, b - 11, 4, 1);
    p.r('#c8a070', x + 3, b - 5, 5, 5); p.blob(x + 5, b - 8, 3, '#3f8a3e');
  } else if (v === 'opshop') {                       // mannequin in a loud jacket, a lamp, a hat
    p.r('#e8d8c0', x + 7, y + 3, 4, 4); p.r('#f29a5b', x + 5, y + 7, 8, 7); p.r('#7fa6e8', x + 6, y + 9, 1, 1); p.r('#a24fc9', x + 10, y + 11, 1, 1);
    p.r('#3a3a48', x + 6, y + 14, 6, b - y - 14);
    p.r('#e8c030', x + 20, y + 4, 8, 4); p.r('#6a4a2a', x + 23, y + 8, 2, b - y - 9); p.r('#c8443a', x + 28, b - 5, 6, 4);
  } else if (v === 'vinyl') {                        // records in the window
    [[6, 5], [15, 4], [24, 5]].forEach(([dx, dy]) => { p.blob(x + dx, y + dy, 3, '#1e1e24'); p.r('#e77fb8', x + dx, y + dy, 1, 1); p.r('#5a5a68', x + dx - 2, y + dy - 2, 1, 1); });
    p.r('#f5d63a', x + 2, b - 5, 30, 5); p.text('SALE', x + 10, b - 5, '#1e1e24');
  } else if (v === 'vegan') {                        // "salami" made of beetroot, carrot "sausages"
    p.r('#f4f4f0', x + 2, b - 4, w - 4, 3);
    for (let i = 0; i < 3; i++) { p.blob(x + 6 + i * 9, b - 7, 3, '#b83a5a'); p.r('#e88aa0', x + 5 + i * 9, b - 8, 2, 1); }
    for (let i = 0; i < 5; i++) p.r('#e8823a', x + 4 + i * 6, y + 3, 4, 2);
    p.r('#6a4a2a', x + 2, y + 2, w - 4, 1); p.r('#3f8a3e', x + 30, y + 4, 2, 3);
  } else if (v === 'bikecoop') {                     // a bike in the window, wheels on hooks
    p.blob(x + 9, b - 6, 5, '#2a2e33'); p.blob(x + 9, b - 6, 4, glass); p.blob(x + 25, b - 6, 5, '#2a2e33'); p.blob(x + 25, b - 6, 4, glass);
    p.r('#c8443a', x + 9, b - 10, 16, 2); p.r('#c8443a', x + 14, b - 10, 2, 5); p.r('#1e1e24', x + 12, b - 12, 5, 1);
    p.blob(x + 18, y + 5, 3, '#5a5e66'); p.blob(x + 18, y + 5, 2, glass);
  } else if (v === 'yoga') {                         // mats, a fern and a dog doing the pose
    for (let i = 0; i < 3; i++) p.r(['#e77fb8', '#3fa38f', '#f5d63a'][i], x + 3 + i * 4, b - 14, 3, 13);
    p.r('#8a6a42', x + 18, b - 5, 6, 4); p.r('#a8723c', x + 18, b - 6, 6, 1);
    p.r('#c8823a', x + 22, b - 4, 9, 1); p.r('#c8823a', x + 22, b - 6, 2, 3); p.r('#c8823a', x + 29, b - 9, 3, 6); p.r('#c8823a', x + 21, b - 7, 3, 2); p.r('#1e1e24', x + 21, b - 7, 1, 1);
    p.blob(x + 30, y + 5, 3, '#3f8a3e'); p.r('#c8643a', x + 28, y + 8, 5, 4);
  } else if (v === 'laundro') {                      // washing machines with spinning socks
    for (let i = 0; i < 3; i++) { p.r('#f4f8fa', x + 2 + i * 11, b - 13, 10, 13); p.blob(x + 7 + i * 11, b - 6, 3, '#3a4a5a'); p.r(['#c8443a', '#f5d63a', '#3fa38f'][i], x + 6 + i * 11, b - 6, 2, 2); }
  }
}

export const BRUNSWICK = {
  bshop: {
    foot: [4, 3], tex: [64, 66], variants: Object.keys(SHOPS),
    paint(p, v) {
      const s = SHOPS[v], W = 62, x0 = 1, top = 3, H = 66;
      // body
      if (s.brick) bricks(p, x0, top, W, H - top - 1, s.wall, 5);
      else { p.r(s.wall, x0, top, W, H - top - 1); p.r(shade(s.wall, -0.12), x0 + W - 2, top, 2, H - top - 1); }
      // parapet with a little pediment and cap
      p.r(s.trim, x0, top, W, 3); p.r(shade(s.trim, 0.3), x0, top, W, 1);
      p.r(s.trim, x0 + 22, top - 2, 18, 3); p.r(shade(s.trim, 0.3), x0 + 22, top - 2, 18, 1);
      p.r(shade(s.wall, -0.18), x0, top + 3, W, 1);
      // upper windows
      for (const wx of [8, 40]) { p.r(s.trim, wx - 2, top + 7, 18, 16); p.r('#5a6a7a', wx, top + 9, 14, 12); p.r('#8aa4b8', wx + 1, top + 10, 4, 2); p.r(s.trim, wx + 6, top + 9, 1, 12); p.r(shade(s.trim, -0.25), wx - 2, top + 22, 18, 1); }
      // awning or a plain ledge
      if (s.awning) { for (let i = 0; i < W; i += 6) p.r(i % 12 ? s.awning[1] : s.awning[0], x0 + i, top + 25, 6, 6); p.r(shade(s.awning[0], -0.3), x0, top + 31, W, 1); }
      else { p.r(shade(s.wall, -0.3), x0, top + 28, W, 3); p.r(shade(s.wall, 0.15), x0, top + 27, W, 1); }
      // fascia sign
      p.r(shade(s.fascia, -0.3), x0 + 2, top + 33, W - 4, 11); p.r(s.fascia, x0 + 3, top + 34, W - 6, 9); p.r(shade(s.fascia, 0.2), x0 + 3, top + 34, W - 6, 1);
      centred(p, s.label, x0 + W / 2, top + 36, s.ink);
      // shopfront
      shopWindow(p, v, x0 + 4, top + 47, 34, H - top - 50);
      p.r('#2a1a10', x0 + 42, top + 46, 14, H - top - 47); p.r(shade(s.fascia, -0.2), x0 + 43, top + 47, 12, H - top - 48);
      p.r('#a8d0e4', x0 + 45, top + 49, 8, 7); p.r('#f0c040', x0 + 53, top + 58, 1, 2);
      p.r(shade(s.wall, -0.35), x0, H - 2, W, 1);
      outline(p.ctx, 0, 0, 64, H);
    },
  },
  // A cafe in an old mechanic's workshop. The roller doors are up, the hoist
  // is now a bench, and the ghost of AUTO REPAIRS is still on the parapet.
  garagecafe: {
    foot: [6, 3], tex: [96, 76], variants: ['brakefast'],
    paint(p) {
      const x0 = 1, W = 94, top = 8, H = 76;
      bricks(p, x0, top, W, H - top - 1, '#e2d4b4', 9);
      // stepped parapet with the faded old sign
      p.r('#e2d4b4', x0 + 20, top - 6, 54, 6); p.r('#f2e8d0', x0 + 20, top - 6, 54, 1); p.r('#f2e8d0', x0, top, W, 1);
      p.r('#d4c4a0', x0 + 18, top + 2, 58, 9); p.text('AUTO REPAIRS', x0 + 24, top + 4, '#b8a888');
      // the new sign, black with white letters
      p.r('#1e1e24', x0 + 22, top + 14, 50, 11); p.r('#3a3a44', x0 + 22, top + 14, 50, 1);
      centred(p, 'BRAKE FAST', x0 + 47, top + 17, '#f4f4f0');
      p.r('#c8443a', x0 + 74, top + 16, 6, 6); p.r('#f4f4f0', x0 + 76, top + 18, 2, 2);   // a little stop sign logo
      // two open roller-door bays with the cafe inside
      for (const bx of [5, 51]) {
        const y = top + 30, w = 38, h = H - y - 1;
        p.r('#2a2e33', bx - 1, y - 1, w + 2, h + 1);
        p.r('#5a4030', bx, y, w, h); p.r('#4a3428', bx, y + h - 8, w, 8);            // warm interior
        for (let j = 0; j < 5; j++) p.r(j % 2 ? '#8a8e96' : '#a8acb4', bx, y + j, w, 1);   // rolled-up door drum
        for (const lx of [8, 20, 32]) { p.r('#2a2a2a', bx + lx, y + 5, 1, 4); p.r('#f5d070', bx + lx - 2, y + 9, 5, 2); }  // pendant lights
        if (bx === 5) { p.r('#9aa0a8', bx + 4, y + 14, 14, 9); p.r('#c8ccd2', bx + 5, y + 15, 12, 2); p.r('#1e1e24', bx + 8, y + 18, 2, 3); p.r('#1e1e24', bx + 13, y + 18, 2, 3); // espresso machine
          p.r('#6a4a2a', bx, y + h - 12, w, 4); p.r('#8a6a42', bx, y + h - 12, w, 1); p.blob(bx + 30, y + 16, 3, '#3f8a3e'); p.r('#3f8a3e', bx + 30, y + 19, 1, 4); }
        else { p.r('#c8443a', bx + 4, y + 12, 6, 13); p.r('#f4f4f0', bx + 5, y + 14, 4, 3); p.blob(bx + 7, y + 10, 3, '#f4f4f0');   // old bowser, now a planter
          p.blob(bx + 7, y + 8, 3, '#3f8a3e'); p.r('#6a4a2a', bx + 14, y + h - 12, 20, 4); p.r('#8a6a42', bx + 14, y + h - 12, 20, 1);
          p.r('#1e1e24', bx + 22, y + 13, 10, 7); p.r('#f4f4f0', bx + 23, y + 14, 8, 1); p.r('#f4f4f0', bx + 23, y + 16, 6, 1); }   // chalkboard menu
      }
      p.r('#e2d4b4', x0 + 44, top + 30, 6, H - top - 31); p.r('#c8b898', x0 + 48, top + 30, 2, H - top - 31);
      outline(p.ctx, 0, 0, 96, H);
    },
  },
  // Sawtooth-roof factory: glazed teeth along the top, brick or tin walls.
  factory: {
    foot: [8, 3], tex: [128, 92], variants: ['brick', 'tin', 'pickles', 'rope', 'brewery'],
    paint(p, v) {
      const x0 = 1, W = 126, H = 92, wallTop = 30;
      // the saw teeth: a vertical glazed face, then the roof sloping down
      for (let t = 0; t < 4; t++) {
        const tx = x0 + t * 31.5;
        for (let j = 0; j < 32; j++) { const y = 4 + Math.round(j * 0.6); p.r(j % 3 ? '#8a9098' : '#7a8088', tx + j, y, 1, wallTop - y); p.r('#a8aeb6', tx + j, y, 1, 1); }
        p.r('#5a7088', tx, 4, 4, wallTop - 4); p.r('#9ab8d0', tx + 1, 6, 1, wallTop - 8);
      }
      p.r('#5a5e66', x0, wallTop - 2, W, 2);
      if (v === 'rope') {
        bricks(p, x0, wallTop, W, H - wallTop - 1, '#8a5444', 6);
        p.r('#a87a68', x0 + 34, wallTop + 3, 58, 9); p.text('ROPE WORKS', x0 + 44, wallTop + 5, '#d8c0a8');   // ghost sign
        for (const wx of [6, 104]) factoryWindow(p, x0 + wx, wallTop + 16, 16, 14);
        const y = wallTop + 20, w = 60, h = H - y - 1, bx = x0 + 34;                                          // big open door: a climbing wall inside
        p.r('#2a2e33', bx - 1, y - 1, w + 2, h + 1); p.r('#d8d0c0', bx, y, w, h); p.r('#b8b0a0', bx, y + h - 6, w, 6);
        for (let i = 0; i < 22; i++) p.r(['#e8823a', '#3fa38f', '#e77fb8', '#f5d63a', '#7fa6e8'][i % 5], bx + 2 + Math.floor(hash(i, 8) * (w - 6)), y + 2 + Math.floor(hash(i, 9) * (h - 12)), 3, 2);
        p.r('#f4f4f0', x0 + 4, wallTop + 36, 26, 15); p.text('CLIMB', x0 + 8, wallTop + 38, '#c8443a'); p.text('GYM', x0 + 11, wallTop + 45, '#c8443a');
      } else if (v === 'brewery') {
        corrugated(p, x0, wallTop, W, H - wallTop - 1, '#7a9ab0');
        p.r('#1e1e24', x0 + 30, wallTop + 4, 66, 11); p.r('#3a3a44', x0 + 30, wallTop + 4, 66, 1); centred(p, 'HOPE ST HOPS', x0 + 63, wallTop + 7, '#f5d63a');
        for (const wx of [6, 104]) factoryWindow(p, x0 + wx, wallTop + 8, 16, 12);
        const y = wallTop + 24, w = 52, h = H - y - 1, bx = x0 + 37;                                          // door up: kegs and a long table
        p.r('#2a2e33', bx - 1, y - 1, w + 2, h + 1); p.r('#4a3a2e', bx, y, w, h);
        for (let j = 0; j < 4; j++) p.r(j % 2 ? '#8a8e96' : '#a8acb4', bx, y + j, w, 1);
        for (let i = 0; i < 4; i++) { p.r('#b8bcc4', bx + 4 + i * 8, y + h - 14, 6, 13); p.r('#e8ecf0', bx + 5 + i * 8, y + h - 14, 1, 13); p.r('#7a7e86', bx + 4 + i * 8, y + h - 9, 6, 1); }
        p.r('#8a6a42', bx + 36, y + h - 10, 14, 3); p.r('#5a4030', bx + 37, y + h - 7, 2, 6); p.r('#5a4030', bx + 47, y + h - 7, 2, 6);
        for (const lx of [10, 26, 42]) { p.r('#2a2a2a', bx + lx, y + 4, 1, 3); p.r('#f5d070', bx + lx - 1, y + 7, 3, 2); }
        tags(p, x0 + 4, wallTop + 30, 28, 20, 11);
      } else if (v === 'pickles') {
        bricks(p, x0, wallTop, W, H - wallTop - 1, '#d8ccb0', 4);
        p.r('#6a8a4a', x0 + 26, wallTop + 3, 74, 9); p.text('PICKLE WORKS', x0 + 39, wallTop + 5, '#e8e0c0');   // ghost sign
        for (const wx of [6, 30, 82, 104]) factoryWindow(p, x0 + wx, wallTop + 16, 16, 14);
        p.r('#2a1a10', x0 + 54, wallTop + 34, 20, H - wallTop - 35); p.r('#3a6a8a', x0 + 55, wallTop + 35, 18, H - wallTop - 36); p.r('#3a6a8a', x0 + 64, wallTop + 35, 1, H - wallTop - 36);
        p.r('#f4f4f0', x0 + 8, wallTop + 38, 38, 9); p.text('ART STUDIOS', x0 + 9, wallTop + 40, '#3a6a8a');   // the pickles moved out, the painters moved in
        p.r('#e8823a', x0 + 86, wallTop + 40, 6, 12); p.r('#3a8a5a', x0 + 94, wallTop + 44, 6, 8); p.r('#c8443a', x0 + 102, wallTop + 42, 6, 10);   // paint tins
      } else if (v === 'brick') {
        bricks(p, x0, wallTop, W, H - wallTop - 1, '#a8503a', 11);
        p.r('#c8a888', x0 + 30, wallTop + 3, 66, 9); p.text('KNITTING MILLS', x0 + 36, wallTop + 5, '#e8d8c0');      // faded ghost sign
        for (const wx of [6, 40, 74, 104]) factoryWindow(p, x0 + wx, wallTop + 16, 16, 14);
        rollerDoor(p, x0 + 26, wallTop + 36, 30, H - wallTop - 37, '#5a7a6a');
        p.r('#2a1a10', x0 + 88, wallTop + 38, 12, H - wallTop - 39); p.r('#4a6a8a', x0 + 89, wallTop + 39, 10, H - wallTop - 40); p.r('#f0c040', x0 + 97, wallTop + 48, 1, 2);
        p.r('#f4f4f0', x0 + 62, wallTop + 40, 18, 9); p.text('APTS', x0 + 64, wallTop + 42, '#a8503a');   // it's apartments now, of course
      } else {
        corrugated(p, x0, wallTop, W, H - wallTop - 1, '#9aa4ac');
        for (const wx of [8, 98]) factoryWindow(p, x0 + wx, wallTop + 8, 18, 12);
        rollerDoor(p, x0 + 34, wallTop + 26, 40, H - wallTop - 27, '#c8ccd2');
        tags(p, x0 + 34, wallTop + 32, 40, 24, 7);
        p.r('#e8c030', x0 + 82, wallTop + 30, 34, 12); p.r('#c8a020', x0 + 82, wallTop + 41, 34, 1); p.text('FOR LEASE', x0 + 83, wallTop + 34, '#1e1e24');
        tags(p, x0 + 4, wallTop + 34, 26, 22, 3);
      }
      p.r('rgba(0,0,0,.2)', x0, H - 4, W, 3);
      outline(p.ctx, 0, 0, 128, H);
    },
  },
  // Back-lane garage with a roller door, the classic Brunswick laneway wall.
  rollerdoor: {
    foot: [3, 2], tex: [48, 52], variants: ['grey', 'tagged', 'green'],
    paint(p, v) {
      const x0 = 1, W = 46, H = 52, top = 12;
      for (let j = 0; j < 9; j++) p.r(j % 2 ? '#7a8088' : '#8a9098', x0, 3 + j, W, 1);        // skillion roof edge
      p.r('#a8aeb6', x0, 3, W, 1);
      bricks(p, x0, top, W, H - top - 1, v === 'green' ? '#b86a4a' : '#9a4a34', v.length);
      const door = { grey: '#a8acb2', tagged: '#b8bcc2', green: '#5a8a6a' }[v];
      rollerDoor(p, x0 + 5, top + 8, W - 10, H - top - 9, door);
      if (v === 'tagged') { tags(p, x0 + 5, top + 10, W - 10, H - top - 16, 5); }
      if (v === 'grey') { p.r('#f4f4f0', x0 + 4, top + 13, 38, 7); p.text('NO PARKING', x0 + 5, top + 14, '#c8443a'); }
      if (v === 'green') { p.r('#f4efe0', x0 + 30, top + 2, 8, 4); }
      p.r('rgba(0,0,0,.2)', x0, H - 4, W, 3);
      outline(p.ctx, 0, 0, 48, H);
    },
  },
  // A tall laneway wall covered in street art.
  graffiti: {
    foot: [4, 1], tex: [64, 52], variants: ['piece', 'tags', 'paste'],
    paint(p, v) {
      const x0 = 1, W = 62, H = 52, top = 4;
      bricks(p, x0, top, W, H - top - 1, v === 'paste' ? '#b8b0a4' : '#8a4a3a', 3);
      p.r('#6a6e76', x0, top - 2, W, 3); p.r('#8a8e96', x0, top - 2, W, 1);
      if (v === 'piece') {                             // big bubble letters, a drop shadow and some stars
        p.r('#3a8a9a', x0 + 2, top + 6, W - 4, 34);
        for (let i = 0; i < 6; i++) p.r('#f4f4f0', x0 + 6 + Math.floor(hash(i, 2) * 50), top + 8 + Math.floor(hash(i, 4) * 28), 1, 1);
        bigText(p, 'BRUNS', x0 + 4, top + 15, 3, '#1e1e24'); bigText(p, 'BRUNS', x0 + 2, top + 13, 3, '#f5d63a');
        p.r('#e77fb8', x0 + 5, top + 29, 52, 2); p.blob(x0 + 52, top + 10, 3, '#e77fb8');
      } else if (v === 'tags') {
        tags(p, x0, top + 4, W, 36, 9); tags(p, x0 + 6, top + 20, W - 10, 22, 4);
        p.r('#f4f4f0', x0 + 16, top + 6, 30, 9); p.text('BE KIND', x0 + 18, top + 8, '#c8443a');
      } else {                                          // wheat-paste posters
        const posters = [['LOST', '#f4f4f0', '#1e1e24'], ['GIG', '#f5d63a', '#c8443a'], ['YOGA', '#e77fb8', '#1e1e24'], ['RENT', '#7fa6e8', '#f4f4f0'], ['ZINE', '#f29a5b', '#1e1e24'], ['CAT', '#f4f4f0', '#3a8a5a']];
        posters.forEach(([t, bg, ink], i) => {
          const px = x0 + 3 + (i % 3) * 20, py = top + 6 + Math.floor(i / 3) * 20;
          p.r(shade(bg, -0.2), px + 1, py + 1, 17, 18); p.r(bg, px, py, 17, 18); p.text(t, px + 2, py + 3, ink);
          p.r(ink, px + 3, py + 10, 11, 1); p.r(ink, px + 3, py + 13, 8, 1);
        });
      }
      p.r('rgba(0,0,0,.2)', x0, H - 4, W, 3);
      outline(p.ctx, 0, 0, 64, H);
    },
  },
  // A plane tree in a black steel tree guard, in its little square of dirt.
  streettree: {
    foot: [1, 1], tex: [32, 56], variants: ['plane'],
    paint(p) {
      p.r('#6b4a2e', 9, 44, 14, 10); p.r('#5a3c24', 9, 52, 14, 2);
      p.r('#a89a7a', 14, 22, 5, 30); p.r('#c8bc9a', 14, 26, 2, 6); p.r('#8a7a5a', 18, 22, 1, 30); p.r('#d8d0b4', 16, 36, 2, 4);
      [[16, 14, 11], [8, 20, 7], [24, 20, 7], [12, 8, 6], [21, 8, 6]].forEach(([x, y, r]) => p.blob(x, y, r, '#4a8a3a'));
      [[13, 10, 5], [20, 12, 5], [9, 18, 3], [24, 16, 3]].forEach(([x, y, r]) => p.blob(x, y, r, '#62a24a'));
      for (let i = 0; i < 12; i++) p.r('#84c060', 5 + hash(i, 3) * 22, 4 + hash(i, 5) * 22, 2, 1);
      for (const x of [9, 13, 19, 22]) p.r('#1e1e24', x, 38, 1, 16);
      p.r('#1e1e24', 9, 38, 14, 1); p.r('#1e1e24', 9, 46, 14, 1); p.r('#3a3a44', 9, 39, 14, 1);
      outline(p.ctx, 0, 0, 32, 56);
    },
  },

  // Rose's place: a three-storey 60s block of flats in blue-grey render
  flats: {
    foot: [9, 3], tex: [148, 120], variants: ['donald'],
    paint(p) {
      const sx = 2, W = 144, H = 120, top = 14, wall = '#a8b4c0', fin = '#bcc6d0', dark = '#8a96a4';
      p.r('rgba(30,50,20,.22)', sx + 2, H - 2, W - 2, 3);
      p.r(wall, sx, top, W, H - top);
      p.r('#6a7480', sx - 2, top - 6, W + 4, 6); p.r('#8a94a0', sx - 2, top - 6, W + 4, 1);     // flat roof edge
      for (let i = 0; i < 6; i++) {
        const x = sx + 6 + i * 23;
        p.r(fin, x, top, 5, H - top); p.r(dark, x + 4, top, 1, H - top);                         // vertical pilasters
        for (let f = 0; f < 3; f++) win(p, x + 8, top + 8 + f * 33, 11, 18, { blind: f === 1 && i % 2 ? '#e8e0cc' : null });
      }
      // balconies with pot plants on the right
      for (let f = 0; f < 2; f++) {
        const y = top + 28 + f * 33;
        p.r('#5a6068', sx + W - 26, y, 24, 2); for (let x = sx + W - 26; x < sx + W - 2; x += 3) p.r('#5a6068', x, y + 2, 1, 8); p.r('#5a6068', sx + W - 26, y + 10, 24, 1);
        plants(p, sx + W - 24, y - 2, 20);
      }
      p.r('#2a2e33', sx + W - 26, H - 26, 14, 26); p.r('#4a5058', sx + W - 25, H - 25, 12, 25);      // entry
      p.r('#f5e6a0', sx + 50, top + 64, 3, 4); p.r('#3a3e44', sx + 49, top + 63, 5, 1);              // wall lamp
      p.r('#9aa4b0', sx + 30, top + 40, 1, 8); p.r('#9aa4b0', sx + 30, top + 48, 6, 1);              // a crack. it's rented
    },
  },
  aptblock: {
    foot: [10, 3], tex: [160, 128], variants: ['grey'], solid: true,
    paint(p) {
      const W = 160, H = 128;
      for (let f = 0; f < 7; f++) {
        const y = 6 + f * 17;
        p.r(f % 2 ? '#a8acb2' : '#b8bcc2', 0, y, W, 17);
        for (let x = 4; x < W; x += 20) { win(p, x, y + 3, 12, 10, { frame: '#7a7e84', glass: '#5a6a7a' }); if ((x + f) % 3 === 0) p.r('#8a8e94', x - 2, y + 13, 16, 2); }
      }
      p.r('#7a7e84', 0, 0, W, 6); p.r('#c8ccd2', 0, 0, W, 1);
    },
  },
  // A1 Bakery: blue painted brick with an ornate wavy parapet and the big sign
  a1bakery: {
    foot: [8, 3], tex: [140, 112], variants: ['sydney'],
    paint(p) {
      const sx = 6, W = 128, H = 112, top = 34, blue = '#2a5ab8';
      p.r(blue, sx, top, W, H - top);
      for (let y = top + 2; y < top + 40; y += 3) p.r(shade(blue, -0.1), sx, y, W, 1);
      // wavy parapet with white trim and urns
      for (let x = 0; x < W; x++) { const h = Math.round(6 + Math.sin(x / W * Math.PI * 2) * 4); p.r(blue, sx + x, top - h, 1, h); p.r('#f0f0ea', sx + x, top - h - 2, 1, 2); }
      for (const x of [0, 42, 84, W - 6]) { p.r('#f0f0ea', sx + x, top - 16, 6, 30); p.r('#d8d8d0', sx + x + 4, top - 16, 2, 30); p.r('#f0f0ea', sx + x + 1, top - 20, 4, 4); }
      p.r('#3a2a8a', sx + 52, top + 6, 26, 18); p.text('A1', sx + 58, top + 8, '#ffffff'); p.text('BAKERY', sx + 54, top + 16, '#ffffff');
      p.text('GSNK', sx + 96, top + 4, '#7aa0e8');
      // the big A1 BAKERY box sign on its pole
      p.r('#9aa0a8', sx + 30, 6, 2, 30);
      box(p, sx + 14, 0, 34, 28, '#2a4ab0'); p.r('#f4f4f0', sx + 16, 2, 30, 24);
      p.r('#d8282a', sx + 19, 4, 4, 12); p.r('#d8282a', sx + 26, 4, 4, 12); p.r('#d8282a', sx + 19, 4, 11, 3); p.r('#d8282a', sx + 19, 9, 11, 2); // A
      p.r('#d8282a', sx + 34, 4, 4, 12); p.r('#d8282a', sx + 32, 4, 3, 3); p.r('#d8282a', sx + 32, 14, 8, 2);        // 1
      p.text('BAKERY', sx + 19, 19, '#2a4ab0');
      // shopfront under the verandah
      p.r('#1e1e24', sx, top + 42, W, 10); p.text('A1 MIDDLE EAST FOOD STORE', sx + 6, top + 45, '#d8d8d0');
      p.r('#c8443a', sx + 4, top + 45, 2, 5);
      for (let i = 0; i < 4; i++) {
        const x = sx + 4 + i * 32; p.r('#2a3a8a', x, top + 54, 28, H - top - 56); p.r('#7a9ac8', x + 2, top + 56, 24, 12);
        p.r('#f4f4f0', x + 3, top + 56, 22, 3); p.text(i === 1 ? 'BREAD' : i === 2 ? 'PIES' : '', x + 5, top + 57, '#c8443a');
        p.r('#b8a070', x + 4, top + 62, 8, 4); p.r('#d8c090', x + 14, top + 63, 8, 3);
      }
      p.r('#3a2a2a', sx + 58, top + 54, 12, H - top - 54);
    },
  },
  verandah: {
    foot: [8, 1], tex: [128, 22], variants: ['steel'], solid: false, roof: true,
    paint(p) {
      p.r('#d8d8d0', 0, 0, 128, 16); for (let x = 1; x < 128; x += 3) p.r('#b8b8b0', x, 0, 1, 16);
      p.r('#f0f0ea', 0, 0, 128, 2); p.r('#9a9a92', 0, 14, 128, 2); p.r('#5a5a62', 0, 16, 128, 4);
    },
  },
  // Ornate red-brick shop with a moulded parapet
  redshop: {
    foot: [4, 3], tex: [64, 76], variants: ['red', 'cream'],
    paint(p, v) {
      const W = 64, H = 76, top = 18, brick = v === 'red' ? '#a8503a' : '#d8c4a0';
      bricks(p, 0, top, W, H - top, brick, 3);
      p.r('#e8dcc0', 20, 0, 24, 18); p.r('#d8c8a8', 22, 4, 20, 10); p.r('#e8dcc0', 28, 0, 8, 2); p.blob(32, 9, 4, '#c8b898');
      p.r('#e8dcc0', 0, top - 2, W, 3); p.r('#e8dcc0', 0, top + 26, W, 2);
      p.r('#e8dcc0', 6, top + 4, 14, 18); p.r('#5a6a7a', 8, top + 6, 10, 15); p.r('#e8dcc0', 44, top + 4, 14, 18); p.r('#5a6a7a', 46, top + 6, 10, 15);
      p.r('#c8443a', 0, top + 30, W, 6); p.r('#f0d040', 0, top + 36, W, 2);
      p.r('#2a2e33', 4, top + 40, 40, H - top - 40); p.r('#7a9ac8', 5, top + 41, 38, 14); p.r('#3a2a2a', 48, top + 40, 12, H - top - 40);
    },
  },
  // Mem and Corni's apartments on Hope St: concrete fins, plant-filled
  // balconies, sage green awnings over a brick base
  hopeapts: {
    foot: [12, 3], tex: [196, 150], variants: ['hope'],
    paint(p) {
      const sx = 2, W = 192, H = 150, top = 6, base = 98;
      p.r('rgba(30,50,20,.22)', sx + 2, H - 2, W - 2, 3);
      p.r('#9a9c9e', sx, top, W, base - top);
      for (let f = 0; f < 4; f++) {
        const y = top + 4 + f * 22;
        p.r('#3a3d42', sx, y, W, 16);                                                     // recessed balcony
        p.r('#b8bab8', sx, y + 16, W, 4);                                                 // slab edge
        for (let x = sx; x < sx + W; x += 3) p.r('#5a5d62', x, y + 6, 1, 10); p.r('#6a6d72', sx, y + 6, W, 1);
        plants(p, sx + 4 + (f * 7) % 20, y + 12, W - 30);
      }
      for (let i = 0; i < 6; i++) { const x = sx + 6 + i * 36; p.r('#c8c8c4', x, top, 6, base - top + 6); p.r('#a8a8a4', x + 5, top, 1, base - top + 6); } // fins
      p.r('#b8b8b4', sx, top - 2, W, 4);
      // brick base with shopfronts and the fire booster
      bricks(p, sx, base, W, H - base, '#d8b088', 6);
      for (let i = 0; i < 5; i++) { const x = sx + 6 + i * 38; p.r('#2a2e33', x, base + 18, 26, H - base - 18); p.r('#5a6a7a', x + 1, base + 19, 24, 22); }
      // sage green awnings
      for (let i = 0; i < 5; i++) {
        const x = sx + 2 + i * 38;
        for (let j = 0; j < 12; j++) p.r(j % 3 === 0 ? '#a8bc9a' : '#98ae8a', x - (j >> 2), base + 2 + j, 34 + (j >> 1), 1);
        p.r('#7a9070', x - 3, base + 14, 37, 2);
      }
      p.r('#c8443a', sx + 120, base + 30, 2, 16); p.r('#c8443a', sx + 120, base + 30, 12, 2); p.r('#9aa0a8', sx + 124, base + 34, 2, 12); p.r('#c8443a', sx + 128, base + 32, 4, 4);
    },
  },
  // Brunswick Station's heritage building: red brick, cream trim, red roof
  brunstation: {
    foot: [6, 2], tex: [104, 70], variants: ['heritage'],
    paint(p) {
      const sx = 4, W = 96, H = 70, top = 34;
      p.r('rgba(30,50,20,.22)', sx + 2, H - 2, W - 2, 3);
      bricks(p, sx, top, W, H - top, '#b45a3e', 2);
      tileRoof(p, sx - 2, 4, W + 4, 22, '#b8402e');
      for (let x = 0; x < W + 4; x += 3) p.r('#a0382a', sx - 2 + x, 6, 1, 20);
      p.r('#f0d8a0', sx - 2, 24, W + 4, 6); for (let x = 0; x < W + 4; x += 4) p.r('#d8bc80', sx - 2 + x, 26, 2, 3);  // cream frieze
      // verandah roof on red posts along the platform side
      p.r('#c84a34', sx - 4, top - 4, W + 8, 6); p.r('#a03a28', sx - 4, top + 1, W + 8, 1);
      for (const x of [0, 30, 62, W - 2]) { p.r('#9a2a22', sx + x, top + 2, 2, H - top - 2); p.r('#c84a34', sx + x - 1, top + 2, 4, 2); }
      p.r('#e8d4a0', sx + 18, top + 6, 22, 22); p.r('#b45a3e', sx + 20, top + 8, 18, 18);
      for (const x of [8, 46, 74]) { p.r('#e8d4a0', x + sx, top + 8, 12, 20); p.r(x === 46 ? '#8a3a2a' : '#5a6a7a', x + sx + 2, top + 10, 8, 18); }
      p.r('#2a5ab8', sx + 22, top + 10, 14, 8); p.r('#f4f4f0', sx + 24, top + 12, 10, 1); p.r('#f4f4f0', sx + 24, top + 14, 8, 1);
      p.r('#f4f4f0', sx + 4, H - 10, W - 8, 1); p.r('#f4f4f0', sx + 4, H - 4, W - 8, 1);       // white rail
      for (let x = sx + 4; x < sx + W - 4; x += 6) p.r('#f4f4f0', x, H - 10, 1, 7);
    },
  },
  sighut: {
    foot: [2, 2], tex: [32, 48], variants: ['weatherboard'],
    paint(p) {
      p.shadow(16, 47, 30);
      p.r('#e8dcb4', 2, 18, 28, 30); for (let y = 20; y < 48; y += 3) p.r('#d0c498', 2, y, 28, 1);
      for (let j = 0; j < 14; j++) p.r(j % 3 === 2 ? '#8a2a22' : '#a8382c', 2 - (j >> 2) + 2, 4 + j, 28 - 4 + (j >> 1), 1);
      p.r('#6a4a3a', 22, 0, 5, 8); p.r('#4a3a2a', 21, 0, 7, 2);
      p.r('#5a3a2a', 6, 28, 8, 20); p.r('#5a6a7a', 18, 26, 8, 8);
    },
  },
  boomgate: {
    foot: [1, 1], tex: [48, 34], variants: ['up'],
    paint(p) {
      p.shadow(8, 33, 10);
      p.r('#d8dcdf', 5, 12, 6, 22); p.r('#9aa0a8', 5, 30, 6, 4);
      p.r('#e8e8e8', 2, 6, 12, 7); p.blob(5, 9, 2, '#c8282a'); p.blob(11, 9, 2, '#c8282a');
      for (let i = 0; i < 9; i++) p.r(i % 2 ? '#c8282a' : '#f4f4f0', 12 + i * 4, 18 - i, 4, 3);        // raised arm
      p.r('#3a3a3a', 6, 0, 4, 6); p.r('#f0c020', 7, 1, 2, 2);
    },
  },
  bikehoop: {
    foot: [1, 1], tex: [16, 16], variants: ['steel'], solid: false,
    paint(p) { for (let t = 0; t <= 16; t++) { const a = Math.PI * t / 16; p.r('#a8acb4', 8 - Math.cos(a) * 5, 14 - Math.sin(a) * 9, 2, 2); } },
  },
  mailpillar: {
    foot: [1, 1], tex: [16, 30], variants: ['render'],
    paint(p) { p.shadow(8, 29, 12); box(p, 2, 4, 12, 26, '#c8ccd0'); p.r('#e8ecef', 4, 8, 8, 6); p.r('#3a3e44', 5, 10, 6, 1); p.r('#a8acb2', 2, 2, 12, 3); },
  },
  booster: {
    foot: [1, 1], tex: [24, 20], variants: ['fire'],
    paint(p) {
      p.r('#9aa0a8', 2, 14, 20, 3); p.r('#c8282a', 3, 4, 3, 10); p.r('#c8282a', 10, 6, 3, 8); p.r('#c8282a', 17, 4, 3, 10);
      p.r('#c8282a', 2, 3, 5, 2); p.r('#c8282a', 16, 3, 5, 2); p.r('#f4f4f0', 8, 0, 8, 5); p.r('#c8282a', 9, 1, 6, 1);
    },
  },
};

