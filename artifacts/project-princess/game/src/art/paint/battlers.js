// Battle art for the foes in data/battlers.js: Kos's polling, Lambros's
// permit, Tito Ramon's karaoke, Mark Teapot's tiny MP, Amy's couch, Austin
// and Nala, Pam's tickets and Dave's footy gear. Same rules as enemies.js:
// [width, height, paint(p)], 1px outline added for you, objects face front.

import { shade, painter } from './painter.js';
import { drawPerson } from './people.js';
import { PET_FRAMES, BASE_PALETTE } from '../sprites.js';

function face(p, x, y, gap = 4) {
  p.r('#ffffff', x, y, 2, 2); p.r('#ffffff', x + gap, y, 2, 2);
  p.r('#1a1010', x + 1, y + 1, 1, 1); p.r('#1a1010', x + gap, y + 1, 1, 1);
  p.r('#1a1010', x + 2, y + 3, gap - 2, 1);
}

// A person drawn at half size in the bottom of a 16x32 frame: the tiny MP.
function tiny(p, look) {
  if (typeof document === 'undefined') return drawPerson(p, look, 'left', 0);
  const c = document.createElement('canvas'); c.width = 16; c.height = 32;
  drawPerson(painter(c.getContext('2d')), look, 'left', 0);
  p.ctx.imageSmoothingEnabled = false;
  p.ctx.drawImage(c, 0, 0, 16, 32, 4, 16, 8, 16);
}

const lab = PET_FRAMES.lab[0];

export const BATTLER_FOE_ART = {
  // Kos: a clipboard with a bar chart, and a smug post
  polling: [16, 16, p => {
    p.r('#8a5a2a', 2, 1, 12, 15); p.r('#a87440', 3, 1, 10, 1); p.r('#c8c8cc', 6, 0, 4, 2);
    p.r('#f4f4ec', 3, 3, 10, 12);
    p.r('#c8202a', 4, 10, 2, 4); p.r('#2a5ab8', 7, 8, 2, 6); p.r('#e8a020', 10, 11, 2, 3);
    face(p, 5, 4);
  }],
  fbpost: [16, 16, p => {
    p.r('#3a5ab8', 1, 2, 14, 12); p.r('#5a7ad8', 1, 2, 14, 2); p.r('#f4f4f0', 2, 5, 12, 8);
    p.r('#9aa0b0', 3, 9, 9, 1); p.r('#9aa0b0', 3, 11, 7, 1);
    p.r('#3a5ab8', 11, 12, 3, 3); p.r('#3a5ab8', 12, 10, 1, 2);   // thumbs up
    face(p, 4, 5);
  }],
  // Lambros: a permit in red tape, and the novelty scissors
  permit: [16, 16, p => {
    p.r('#f0ecd8', 2, 1, 12, 14); p.r('#c8c4b0', 12, 2, 2, 13);
    p.r('#a8a490', 4, 9, 8, 1); p.r('#a8a490', 4, 11, 6, 1);
    p.r('#c8202a', 1, 12, 14, 2); p.r('#c8202a', 7, 1, 2, 14);
    p.blob(11, 4, 2, '#c8202a');
    face(p, 3, 4);
  }],
  scissors: [16, 16, p => {
    p.blob(4, 12, 3, '#c8202a'); p.blob(4, 12, 1, '#f4f0e0');
    p.blob(11, 12, 3, '#c8202a'); p.blob(11, 12, 1, '#f4f0e0');
    p.r('#d8d8e0', 6, 1, 2, 9); p.r('#a8a8b0', 8, 1, 2, 9); p.r('#f0d040', 6, 8, 4, 2);
    face(p, 5, 3, 3);
  }],
  // Tito Ramon's karaoke
  videoke: [16, 16, p => {
    p.r('#2a2a30', 1, 2, 14, 13); p.r('#3a3a44', 1, 2, 14, 1);
    p.r('#3a8ad8', 3, 4, 10, 6); p.r('#f4f4f0', 6, 5, 4, 1);
    p.r('#f0d040', 4, 12, 2, 2); p.r('#e83a5a', 7, 12, 2, 2); p.r('#3ac85a', 10, 12, 2, 2);
    p.r('#c8c8cc', 13, 0, 1, 3); p.blob(13, 1, 1, '#4a4a54');
    face(p, 5, 6);
  }],
  myway: [16, 16, p => {
    p.blob(7, 11, 4, '#1e1e24'); p.blob(7, 11, 2, '#c8202a');
    p.r('#1e1e24', 10, 2, 2, 9); p.r('#1e1e24', 10, 2, 5, 2); p.r('#1e1e24', 13, 4, 2, 2);
    p.r('#f0d040', 2, 1, 1, 1); p.r('#f0d040', 4, 3, 1, 1);
    face(p, 4, 9, 3);
  }],
  powerballad: [16, 16, p => {
    p.blob(5, 6, 3, '#e8508a'); p.blob(10, 6, 3, '#e8508a'); p.r('#e8508a', 3, 7, 10, 3); p.r('#e8508a', 5, 10, 6, 2); p.r('#e8508a', 7, 12, 2, 2);
    p.r('#f8b0d0', 4, 4, 2, 1);
    [[1, 1], [14, 2], [0, 12], [15, 11], [12, 14]].forEach(([x, y]) => p.r('#f0e070', x, y, 1, 1));
    face(p, 5, 6);
  }],
  // Mark Teapot's MP: a tiny little politician in a suit
  pointcookmp: [16, 32, p => tiny(p, { hair: '#3a2a1e', hairStyle: 'short', skin: '#f2c8a8', shirt: '#a8c8e8', collar: true, blazer: '#1e2232', pants: '#1e2232', shoes: '#141414' })],
  // Amy's team: the mustard couch, Austin and Nala
  couch: [24, 16, p => {
    const c = '#c8962e', d = shade(c, -0.25), l = shade(c, 0.2);
    p.r(d, 2, 13, 2, 3); p.r(d, 20, 13, 2, 3);
    p.r(c, 2, 3, 20, 7); p.r(l, 3, 3, 18, 1);
    p.r(d, 9, 4, 1, 5); p.r(d, 15, 4, 1, 5);
    p.r(c, 0, 6, 4, 8); p.r(c, 20, 6, 4, 8); p.r(l, 0, 6, 4, 1); p.r(l, 20, 6, 4, 1);
    p.r(c, 4, 9, 16, 5); p.r(l, 4, 9, 16, 1); p.r(d, 4, 13, 16, 1); p.r(d, 11, 9, 1, 4);
    p.r('#d07a20', 14, 5, 4, 4); p.r('#a85a14', 15, 6, 1, 3); p.r('#a85a14', 14, 7, 4, 1);   // a plaid cushion, slightly too small
    p.r('#d07a20', 3, 7, 3, 3);
    face(p, 7, 5, 5);
  }],
  austin: [16, 32, p => drawPerson(p, { hair: '#5a3a22', hairStyle: 'short', skin: '#f2c8a8', shirt: '#1e1e24', shirtPattern: 'dots', shirtAccent: '#f4f4f0', collar: true, pants: '#7a8ac0', shoes: '#3a2a20' }, 'left', 0)],
  nala: [16, 16, p => {
    p.sprite(lab, { ...BASE_PALETTE, a: '#c8873e', b: '#9a6228', l: '#e0a868', e: '#2a1a10', n: '#1a1010', p: '#e8708a' }, 0, 0);
    p.r('#c86a22', 10, 3, 2, 1); p.r('#c86a22', 9, 5, 1, 2);   // ginger ears
    p.r('#f0e8dc', 9, 8, 3, 4);                                  // white chest
    p.r('#a89a8a', 13, 6, 2, 1);                                 // grey muzzle
    p.r('#e8e8e8', 8, 7, 1, 2);                                  // white collar
  }],
  // Pam's parking ticket and wheel clamp
  ticket: [16, 16, p => {
    p.r('#f4e060', 2, 1, 12, 14); p.r('#d8c040', 12, 2, 2, 13); p.r('#c8202a', 2, 1, 12, 3);
    p.r('#1e1e24', 4, 10, 8, 1); p.r('#1e1e24', 4, 12, 5, 1);
    face(p, 4, 5);
  }],
  clamp: [16, 16, p => {
    p.blob(8, 9, 6, '#1e1e24'); p.blob(8, 9, 3, '#8a8a90');
    p.r('#f0d020', 1, 6, 14, 3); p.r('#f0d020', 6, 3, 4, 12); p.r('#c8a810', 1, 8, 14, 1);
    p.r('#2a2a2a', 7, 11, 2, 2);
    face(p, 4, 4, 6);
  }],
  // Dave's footy gear
  footyrecord: [16, 16, p => {
    p.r('#2a4aa8', 3, 1, 10, 14); p.r('#e8e8e8', 3, 5, 10, 2); p.r('#c8202a', 3, 7, 10, 2);
    p.r('#1e2a68', 11, 1, 2, 14);
    face(p, 5, 10);
  }],
  halftimepie: [16, 16, p => {
    p.r('#e8e4dc', 1, 13, 14, 2);
    p.r('#c88a3a', 2, 7, 12, 6); p.r('#e0a858', 2, 7, 12, 2); p.r('#8a5a22', 2, 12, 12, 1);
    p.r('#6a3a1a', 7, 8, 2, 1);
    p.r('#e0e0e0', 5, 2, 1, 3); p.r('#e0e0e0', 8, 1, 1, 4); p.r('#e0e0e0', 11, 3, 1, 2);   // steam
    face(p, 5, 9);
  }],
};
