// Built-in art for the things you battle: wild animals, rubbish that has
// come to life, and the Bin Man's bins. Animals face right like the pets
// (the battle flips them); objects face the front and get little faces.
//
// Each entry: [width, height, paint(p)]. Textures are `foe-<id>` and get a
// 1px outline. Custom art: assets/sprites/enemies/<id>.png.

import { shade } from './painter.js';
import { drawPerson, drawBaby } from './people.js';
import { PET_FRAMES, BASE_PALETTE } from '../sprites.js';

const pet = (frame, pal) => p => p.sprite(PET_FRAMES[frame][0], { ...BASE_PALETTE, ...pal }, 0, 0);

// Two beady eyes and an optional cross little mouth.
function face(p, x, y, { gap = 4, cross = true, mouth = true } = {}) {
  p.r('#ffffff', x, y, 2, 2); p.r('#ffffff', x + gap, y, 2, 2);
  p.r('#1a1010', x + 1, y + 1, 1, 1); p.r('#1a1010', x + gap, y + 1, 1, 1);
  if (cross) { p.r('#1a1010', x, y - 1, 2, 1); p.r('#1a1010', x + gap, y - 1, 2, 1); }
  if (mouth) p.r('#1a1010', x + 2, y + 3, gap - 2, 1);
}

function wheelie(p, lid, body, sticker) {
  const bd = shade(body, -0.25), bl = shade(body, 0.18);
  p.r(body, 2, 6, 12, 11); p.r(body, 3, 17, 10, 1);
  p.r(bl, 3, 6, 1, 10); p.r(bd, 12, 6, 2, 11);
  p.r(bd, 4, 13, 8, 1);
  p.r(lid, 1, 3, 14, 3); p.r(shade(lid, 0.3), 2, 3, 11, 1); p.r(shade(lid, -0.25), 1, 5, 14, 1);
  p.r(shade(lid, -0.1), 6, 2, 4, 1);
  if (sticker) { p.r(sticker, 5, 14, 6, 2); p.r(shade(sticker, 0.3), 5, 14, 6, 1); }
  p.blob(4, 18, 1.6, '#1e1e22'); p.blob(12, 18, 1.6, '#1e1e22'); p.r('#6a6a70', 4, 18, 1, 1); p.r('#6a6a70', 12, 18, 1, 1);
  face(p, 4, 8);
}

export const FOE_ART = {
  bag: [16, 16, p => {
    const w = '#f4f4f0', g = '#c8ccd2';
    p.r(w, 4, 1, 2, 4); p.r(w, 10, 1, 2, 4); p.r(g, 5, 2, 1, 3); p.r(g, 11, 2, 1, 3);
    p.r(w, 3, 5, 10, 2); p.r(w, 2, 7, 12, 6); p.r(w, 3, 13, 10, 1); p.r(w, 4, 14, 3, 1); p.r(w, 9, 14, 3, 1);
    p.r(g, 12, 7, 2, 6); p.r(g, 3, 12, 9, 1); p.r(g, 7, 13, 1, 2);
    p.r('#d84a3a', 5, 11, 6, 1); p.r('#d84a3a', 6, 10, 1, 1); p.r('#d84a3a', 9, 10, 1, 1);
    face(p, 5, 7, { mouth: false });
  }],
  streetcat: [16, 16, pet('tabby', { a: '#e0954a', s: '#a85a22', c: '#f4c88a', w: '#f4ecd8', e: '#d8c030', p: '#d89a9a' })],
  dog: [16, 16, pet('frenchie', { a: '#a8783a', b: '#6a4a22', w: '#e8d8b8', g: '#e8d8b8', p: '#a87878', e: '#2a1a10', n: '#1a1010', l: '#c8985a' })],
  rat: [16, 16, p => {
    const a = '#7a6e66', b = '#5a5048', l = '#9a908a', k = '#e8a0a0';
    p.r(k, 0, 10, 1, 2); p.r(k, 1, 11, 2, 1); p.r(k, 2, 10, 1, 1);
    p.r(a, 3, 7, 9, 5); p.r(a, 4, 6, 7, 1); p.r(l, 5, 6, 5, 1); p.r(b, 3, 11, 9, 1);
    p.r(a, 10, 6, 4, 4); p.r(a, 14, 8, 1, 1); p.r(k, 15, 8, 1, 1);
    p.r(a, 10, 4, 2, 2); p.r(k, 11, 5, 1, 1);
    p.r('#e83a3a', 12, 7, 1, 1);
    p.r('#ffffff', 13, 10, 1, 1);
    p.r(k, 5, 12, 2, 1); p.r(k, 10, 12, 2, 1);
    p.r('#c8c4bc', 13, 9, 3, 1);
  }],
  boy: [16, 32, p => drawBaby(p, { hair: '#8a5a2a', skin: '#f2c8a0', shirt: '#e05a3a', motif: '#f4d040', shoes: '#3a6ad0', eyes: '#3a2a1a' }, 'left', 0)],
  balls: [16, 16, p => {
    const ball = (x, y) => { p.blob(x, y, 2.2, '#d8e840'); p.r('#f4f8c0', x - 1, y - 2, 2, 1); p.r('#a8b830', x + 1, y + 1, 1, 1); p.r('#ffffff', x - 2, y, 1, 1); p.r('#ffffff', x + 2, y - 1, 1, 1); };
    for (const [x, y] of [[3, 13], [7, 13], [11, 13], [14, 13], [5, 10], [9, 10], [13, 10], [7, 7], [11, 7], [9, 4]]) ball(x, y);
    face(p, 6, 9, { gap: 5 });
  }],
  commuter: [16, 32, p => drawPerson(p, { hair: '#5a5a5a', hairStyle: 'short', skin: '#f0c4a0', shirt: '#4a5a7a', pants: '#2a2a32', shoes: '#1a1a1a', collar: true, glasses: true, moustache: true }, 'left', 0)],
  ibis: [16, 16, p => {
    const w = '#f0eee6', g = '#c8c4b8', k = '#1e1e22';
    p.r(k, 0, 8, 3, 2); p.r(k, 1, 10, 2, 1);
    p.r(w, 2, 6, 8, 5); p.r(w, 3, 5, 6, 1); p.r(g, 3, 10, 7, 1); p.r(g, 4, 7, 3, 1);
    p.r(w, 9, 4, 2, 4); p.r(k, 9, 1, 3, 3); p.r('#ffffff', 11, 2, 1, 1);
    p.r(k, 12, 2, 2, 1); p.r(k, 13, 3, 2, 1); p.r(k, 14, 4, 1, 2); p.r(k, 15, 6, 1, 2);
    p.r(k, 5, 11, 1, 4); p.r(k, 8, 11, 1, 4); p.r(k, 4, 15, 3, 1); p.r(k, 7, 15, 3, 1);
    p.r('#a8d8a8', 3, 8, 3, 1);  // a dubious stain
  }],
  scooter: [16, 16, p => {
    const c = '#2fa8a0', d = shade(c, -0.25), k = '#1e1e22';
    p.r(c, 2, 12, 10, 2); p.r(shade(c, 0.25), 2, 12, 9, 1);
    p.r(d, 11, 3, 2, 10); p.r(k, 9, 2, 6, 1);
    p.r('#f4e070', 13, 5, 2, 2);
    p.blob(3, 14, 1.8, k); p.blob(12, 14, 1.8, k); p.r('#8a8a90', 3, 14, 1, 1); p.r('#8a8a90', 12, 14, 1, 1);
    face(p, 4, 9, { gap: 3, mouth: false });
  }],
  duck: [16, 16, p => {
    const b = '#8a6a4a', d = '#6a4a2a', g = '#2a7a4a';
    p.r(b, 2, 8, 10, 5); p.r(b, 3, 7, 7, 1); p.r(d, 3, 12, 9, 1); p.r(shade(b, 0.2), 4, 8, 4, 1);
    p.r('#3a5aa8', 6, 10, 3, 1); p.r(d, 1, 8, 2, 2);
    p.r(g, 9, 3, 4, 5); p.r(shade(g, 0.3), 10, 3, 2, 1); p.r('#f4f4f0', 9, 8, 3, 1);
    p.r('#e8a030', 13, 5, 3, 2); p.r('#1a1010', 11, 4, 1, 1); p.r('#e83a2a', 11, 3, 1, 1);
    p.r('#e8a030', 5, 13, 1, 2); p.r('#e8a030', 9, 13, 1, 2); p.r('#e8a030', 4, 15, 3, 1); p.r('#e8a030', 8, 15, 3, 1);
  }],
  magpie: [16, 16, p => {
    const k = '#1a1a1e', w = '#f4f4f0', g = '#8a8a90';
    p.r(k, 0, 8, 4, 2); p.r(w, 1, 9, 2, 1);
    p.r(k, 3, 6, 8, 5); p.r(w, 4, 6, 4, 2); p.r(w, 3, 9, 3, 1); p.r(g, 4, 10, 6, 1);
    p.r(k, 9, 3, 4, 5); p.r(w, 9, 5, 1, 2);
    p.r('#c8c4c0', 13, 5, 3, 1); p.r(g, 13, 6, 2, 1);
    p.r('#e8b030', 11, 4, 1, 1); p.r('#e83a2a', 10, 3, 2, 1);  // angry eyebrow
    p.r(k, 6, 11, 1, 4); p.r(k, 9, 11, 1, 4); p.r(k, 5, 15, 3, 1); p.r(k, 8, 15, 3, 1);
  }],
  recycling: [16, 20, p => wheelie(p, '#f0c830', '#2f5a3a', '#f0c830')],
  garbage: [16, 20, p => wheelie(p, '#24402c', '#2a4a32', '#c84a3a')],
  compost: [16, 20, p => {
    const w = '#f0f0ea', g = '#c8ccc0';
    p.r(w, 3, 9, 10, 9); p.r(g, 11, 9, 2, 9); p.r(shade(w, 0.5), 4, 9, 1, 8);
    p.r('#7ab83a', 2, 7, 12, 2); p.r(shade('#7ab83a', 0.3), 3, 7, 9, 1); p.r('#5a8a2a', 6, 6, 4, 1);
    p.r('#7ab83a', 5, 14, 6, 2);
    p.r('#9ad0f0', 2, 4, 1, 2); p.r('#9ad0f0', 13, 3, 1, 2); p.r('#c8c8c0', 7, 3, 1, 2);  // steam
    face(p, 5, 11, { gap: 4 });
  }],
};
