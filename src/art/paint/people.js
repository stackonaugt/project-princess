// Built-in people, drawn in code at 16x32 (Stardew proportions).
//
// A "look" describes a person:
//   skin, hair, shirt, pants, shoes   colours
//   hairStyle  'short' | 'long' | 'bob' | 'bun' | 'messybun' | 'curly' | 'bald' | 'cap'
//              | 'spiky' | 'pixie' | 'mullet' | 'wavy' (long waves) | 'wavyshort'
//   cap        colour of a cap (with hairStyle 'cap')
//   streak     a coloured streak in the fringe (colour)
//   glasses, beard, moustache, stubble, hivis, apron, collar (booleans or colours)
//   longBeard  a big beard down the chest (colour)
//   scarf      a scarf hanging down the front (colour)
//   sunglasses lens colour; shades 'rect' | 'wrap' | 'round'; frame colour (default dark)
//   hoops      hoop earrings (colour)
//   logo       a slogan printed across the chest (colour), e.g. Julie's Labor tee
//   lips       lipstick (colour)
//   shirtPattern / pantsPattern  'leopard' | 'plaid' | 'stripes' | 'gingham' | 'dots'
//   shirtAccent / pantsAccent    pattern colour, or [colour, colour] for plaid
//   pinafore   a pinafore dress over the shirt (colour); pinaforePattern, pinaforeAccent
//   blazer     an open jacket over the shirt (colour); blazerPattern, blazerAccent
//   jersey     football jersey colours, e.g. ['#c8202a', '#1e1e24'] (horizontal hoops)
//   bumbag     a bum bag on the waist (colour)
//   gloves     work gloves (colour)
//   hat        a broad brimmed hat (colour)
//   beret      a floppy beret (colour)    headband  an alice band (colour)
//   hood       a hoodie with the hood up (colour; set shirt to match)
//   coat       a long open coat down to the knees (colour); tatters: true rips the hem
//   rips       a torn shirt, skin showing through (true)
//   holding    something in one hand: 'monkey' | 'teddy' (toys), 'pint' (a Guinness),
//              'wine' (a glass of red), 'book', 'vape', 'bass' (a bass guitar), 'mic'
//   baby       true draws a toddler instead (see drawBaby). Toddlers also take
//              motif (colour) + print ('teddy' | 'star' | 'heart', or a plain patch),
//              and pants (+ pantsPattern) for a top and trousers instead of a onesie.
//
// drawPerson(p, look, dir, step) paints one frame: dir is 'down' | 'up' | 'left'
// (right is the left frame mirrored), step is 0 standing, 1 and 2 mid-stride.

import { shade } from './painter.js';

export const FRAME_W = 16, FRAME_H = 32;

export function drawPerson(p, look, dir, step) {
  const L = { skin: '#f2c79a', hair: '#6b3f1f', shirt: '#3fa38f', pants: '#33446e', shoes: '#3a2418', hairStyle: 'short', ...look };
  if (L.jersey) { L.shirt = L.jersey[0]; L.shirtPattern = L.shirtPattern || 'jersey'; L.shirtAccent = L.jersey; }
  L.sleeve = L.coat || L.blazer || L.shirt;
  L.twoPiece = !!look.pants;
  if (L.baby) return drawBaby(p, L, dir, step);
  const bob = step ? -1 : 0;
  if (dir === 'left') side(p, L, step, bob); else front(p, L, dir === 'up', step, bob);
  if (dir !== 'up') extras(p, L, dir, bob);
  headwear(p, L, dir, bob);
}

// Hats and hoods go on last, over the hair.
function headwear(p, L, dir, y) {
  const side = dir === 'left', back = dir === 'up';
  if (L.hood) {
    const c = L.hood, d = shade(c, -0.25), l = shade(c, 0.18);
    if (back) { p.r(c, 2, 3 + y, 12, 13); p.r(l, 4, 4 + y, 6, 1); p.r(d, 11, 5 + y, 2, 10); }
    else if (side) { p.r(c, 4, 3 + y, 8, 3); p.r(c, 8, 6 + y, 5, 10); p.r(l, 5, 3 + y, 4, 1); p.r(d, 11, 7 + y, 2, 8); }
    else { p.r(c, 2, 3 + y, 12, 3); p.r(c, 2, 6 + y, 2, 10); p.r(c, 12, 6 + y, 2, 10); p.r(l, 4, 3 + y, 7, 1); p.r(d, 12, 7 + y, 2, 8); p.r('#e8e4dc', 6, 16 + y, 1, 3); p.r('#e8e4dc', 9, 16 + y, 1, 3); }
  }
  if (L.beret) {   // a floppy beret, slumped to one side
    const c = L.beret, d = shade(c, -0.3), l = shade(c, 0.22);
    p.r(c, 3, 1 + y, 11, 3); p.r(c, 2, 2 + y, 2, 2); p.r(l, 5, 1 + y, 5, 1); p.r(d, 3, 3 + y, 11, 1); p.r(c, 7, 0 + y, 1, 1);
  }
  if (L.headband && !back) {   // an alice band over the hair
    p.r(L.headband, 3, 3 + y, 10, 1); if (!side) p.r(shade(L.headband, 0.25), 5, 3 + y, 4, 1);
  }
  if (L.hat) {
    const c = L.hat, d = shade(c, -0.28), l = shade(c, 0.2);
    p.r(c, 3, 1 + y, 10, 4); p.r(l, 4, 1 + y, 6, 1); p.r(d, 3, 4 + y, 10, 1); // crown and band
    p.r(c, 0, 5 + y, 16, 2); p.r(d, 0, 6 + y, 16, 1); p.r(l, 1, 5 + y, 5, 1); // brim
    if (!back) p.r('rgba(20,10,10,0.25)', 3, 7 + y, 10, 1); // shade on the face
  }
}

// Paint a pattern over a rectangle. Coordinates are frame pixels; oy is the
// walking bob so the pattern moves with the body rather than shimmering.
function pattern(p, kind, base, acc, x, y, w, h, oy = 0) {
  if (!kind) return;
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) {
    const v = j - oy;
    let c = null;
    if (kind === 'stripes') { if (v % 2 === 0) c = acc || '#f4f4f0'; }
    else if (kind === 'jersey') { const cs = acc; c = cs[Math.floor(v / 2) % cs.length]; }
    else if (kind === 'gingham') {
      const a = i % 2 === 0, b = v % 2 === 0, dk = acc || shade(base, -0.3);
      if (a && b) c = dk; else if (a || b) c = mix(base, dk);
    } else if (kind === 'plaid') {
      const [c1, c2] = Array.isArray(acc) ? acc : [acc || shade(base, 0.35), shade(base, -0.3)];
      const hz = v % 4 === 1, vt = i % 4 === 2, hz2 = v % 4 === 3;
      if (hz && vt) c = mix(c1, c2); else if (hz) c = c1; else if (vt) c = c2; else if (hz2 && i % 2) c = shade(base, -0.15);
    } else if (kind === 'dots') {
      if ((i + (v % 4 < 2 ? 0 : 2)) % 4 === 0 && v % 2 === 0) c = acc || '#f4f4f0';
    } else if (kind === 'leopard') {
      const k = (i * 3 + v * 5) % 9;
      if (k === 0 || k === 4) c = acc || '#2a1a10'; else if (k === 1) c = shade(base, -0.3);
    }
    if (c) p.r(c, i, j, 1, 1);
  }
}

function mix(a, b) {
  const h = s => [1, 3, 5].map(k => parseInt(s.slice(k, k + 2), 16));
  if (!/^#[0-9a-f]{6}$/i.test(a) || !/^#[0-9a-f]{6}$/i.test(b)) return a;
  const [x, y] = [h(a), h(b)];
  return '#' + x.map((v, k) => Math.round((v + y[k]) / 2).toString(16).padStart(2, '0')).join('');
}

const DIM = 'rgba(20,10,30,0.22)';

// Things drawn over the top of the body: long beards, scarves, bum bags, toys.
function extras(p, L, dir, y) {
  const side = dir === 'left';
  if (L.scarf) {
    const c = L.scarf, d = shade(c, -0.25);
    if (side) { p.r(c, 6, 16 + y, 3, 8); p.r(d, 6, 23 + y, 3, 1); }
    else { p.r(c, 5, 16 + y, 6, 2); p.r(c, 5, 18 + y, 2, 7); p.r(d, 6, 20 + y, 1, 2); p.r(c, 9, 18 + y, 2, 5); p.r('#2a3a2a', 9, 20 + y, 1, 1); }
  }
  if (L.longBeard) {
    const c = L.longBeard, d = shade(c, -0.18), l = shade(c, 0.2);
    if (side) { p.r(c, 3, 12 + y, 7, 4); p.r(c, 4, 16 + y, 5, 4); p.r(c, 5, 20 + y, 3, 2); p.r(d, 7, 14 + y, 1, 7); p.r(l, 4, 12 + y, 2, 1); }
    else {
      p.r(c, 3, 11 + y, 10, 5); p.r(c, 4, 16 + y, 8, 3); p.r(c, 5, 19 + y, 6, 2); p.r(c, 6, 21 + y, 4, 1);
      p.r(d, 7, 14 + y, 1, 7); p.r(d, 10, 15 + y, 1, 4); p.r(l, 4, 11 + y, 2, 2); p.r(l, 10, 11 + y, 2, 1);
      p.r(shade(L.skin, -0.32), 6, 12 + y, 4, 1); // mouth peeking through
    }
  }
  if (L.bumbag) {
    const c = L.bumbag, l = shade(c, 0.3);
    if (side) { p.r(c, 3, 23 + y, 4, 3); p.r(l, 3, 23 + y, 3, 1); p.r('#c8c8c8', 4, 24 + y, 1, 1); }
    else { p.r(c, 4, 22 + y, 6, 3); p.r(l, 5, 22 + y, 4, 1); p.r('#c8c8c8', 8, 23 + y, 1, 1); p.r(shade(c, -0.3), 4, 24 + y, 6, 1); }
  }
  if (L.holding) toy(p, L.holding, side ? 0 : 11, 20 + y);
}

// A small soft toy, about 5x7, with its top left at x, y.
function toy(p, kind, x, y) {
  if (kind === 'pint') { p.r('#1e1a18', x, y + 1, 4, 6); p.r('#16100c', x + 1, y + 3, 2, 3); p.r('#f0e4c8', x + 1, y + 1, 2, 2); p.r('rgba(255,255,255,0.5)', x + 1, y + 3, 1, 2); return; }
  if (kind === 'wine') { p.r('#d8e0e8', x, y + 1, 4, 1); p.r('#6a1424', x + 1, y + 2, 2, 2); p.r('#d8e0e8', x + 1, y + 1, 2, 1); p.r('#d8e0e8', x + 2, y + 4, 1, 2); p.r('#d8e0e8', x + 1, y + 6, 3, 1); return; }
  if (kind === 'book') { p.r('#2a1a12', x, y + 1, 4, 6); p.r('#c8443a', x + 1, y + 2, 3, 4); p.r('#f4efe0', x + 3, y + 2, 1, 4); return; }
  if (kind === 'bass') { p.r('#d8dce4', x - 3, y + 2, 6, 4); p.r('#8a8e96', x - 2, y + 3, 4, 2); p.r('#c8a070', x + 2, y - 4, 1, 7); p.r('#2a2a2a', x + 2, y - 5, 2, 1); return; }
  if (kind === 'mic') { p.r('#1e1a18', x + 1, y + 2, 2, 5); p.r('#8a8e96', x, y - 1, 4, 3); p.r('#c8ccd4', x + 1, y - 1, 1, 1); return; }
  if (kind === 'vape') { p.r('#3a3a44', x + 1, y + 2, 2, 4); p.r('#f06aa8', x + 1, y + 3, 2, 1); p.r('rgba(240,240,250,0.7)', x + 2, y, 2, 1); p.r('rgba(240,240,250,0.5)', x + 3, y - 1, 2, 1); return; }
  const fur = kind === 'teddy' ? '#b07a44' : '#7a4a26', face = kind === 'teddy' ? '#e0b888' : '#e8c89a', dk = shade(fur, -0.3);
  p.r(fur, x + 1, y, 3, 3); p.r(fur, x, y + 1, 1, 1); p.r(fur, x + 4, y + 1, 1, 1); // head and ears
  p.r(face, x + 1, y + 1, 3, 2); p.r('#1e1410', x + 1, y + 1, 1, 1); p.r('#1e1410', x + 3, y + 1, 1, 1);
  p.r(fur, x + 1, y + 3, 3, 3); p.r(dk, x + 3, y + 4, 1, 2); p.r(face, x + 2, y + 4, 1, 1); // body
  p.r(fur, x, y + 6, 1, 1); p.r(fur, x + 4, y + 6, 1, 1);
  if (kind === 'monkey') { p.r(fur, x + 4, y + 4, 1, 1); p.r(fur, x + 5, y + 3, 1, 1); } // curly tail
}

// Toddlers: big head, onesie (or top and pants), tiny legs.
export function drawBaby(p, L, dir, step) {
  const skin = L.skin, sk2 = shade(skin, -0.15), hair = L.hair, hl = shade(hair, 0.2);
  const suit = L.shirt, sd = shade(suit, -0.2), sl = shade(suit, 0.18);
  const y = step ? -1 : 0, back = dir === 'up', side = dir === 'left';
  const two = L.twoPiece;
  const lift = s => (step === s ? 1 : 0);
  if (two) {
    // top 22-26, pants 27-29
    const pc = L.pants, pd = shade(pc, -0.22);
    p.r(pc, 4, 27 + y, 9, 1);
    p.r(pc, 5, 28 + y, 3, 2 - lift(1)); p.r(pc, 9, 28 + y, 3, 2 - lift(2));
    pattern(p, L.pantsPattern, pc, L.pantsAccent, 4, 27 + y, 9, 3, y);
    p.r(pd, 11, 27 + y, 1, 3 - lift(2)); p.r(pd, 7, 28 + y, 1, 2 - lift(1));
    p.r(L.shoes || '#f4f4f0', 5, 30 - lift(1), 3, 2); p.r(L.shoes || '#f4f4f0', 9, 30 - lift(2), 3, 2);
    p.r(suit, 4, 22 + y, 9, 5); p.r(sl, 5, 22 + y, 6, 1); p.r(sd, 11, 23 + y, 2, 4);
    pattern(p, L.shirtPattern, suit, L.shirtAccent, 4, 22 + y, 9, 5, y);
  } else {
    p.r(sd, 5, 28 + y, 3, 2 - lift(1)); p.r(sd, 9, 28 + y, 3, 2 - lift(2));
    p.r(L.shoes || '#f4f4f0', 5, 30 - lift(1), 3, 2); p.r(L.shoes || '#f4f4f0', 9, 30 - lift(2), 3, 2);
    p.r(suit, 4, 22 + y, 9, 7); p.r(sl, 5, 22 + y, 6, 1); p.r(sd, 11, 23 + y, 2, 6);
  }
  if (L.motif && !back && !side) babyPrint(p, L, 6, 23 + y);
  // arms
  const sw = step === 1 ? 1 : step === 2 ? -1 : 0;
  if (side) { p.r(sd, 6, 23 + y, 3, 3); p.r(skin, 4, 25 + y + sw, 2, 2); }
  else { p.r(suit, 2, 23 + y, 2, 3 + sw); p.r(skin, 2, 26 + y + sw, 2, 1); p.r(sd, 13, 23 + y, 2, 3 - sw); p.r(skin, 13, 26 + y - sw, 2, 1); }
  // big round head
  p.blob(8, 17 + y, 5, skin); p.r(sk2, 11, 17 + y, 2, 4);
  if (back) { p.blob(8, 16 + y, 5, hair); p.r(hl, 6, 13 + y, 3, 1); p.r(hair, 7, 10 + y, 2, 1); return; }
  // wispy hair on top
  p.r(hair, 4, 12 + y, 9, 2); p.r(hair, 3, 13 + y, 2, 2); p.r(hl, 6, 12 + y, 3, 1); p.r(hair, 8, 11 + y, 2, 1);
  if (L.curl) p.r(hair, 9, 10 + y, 1, 1);
  if (side) {
    p.r(hair, 9, 13 + y, 4, 4); p.r('#2a1a10', 5, 17 + y, 1, 1); p.r('rgba(230,110,110,0.45)', 5, 19 + y, 2, 1); p.r(sk2, 3, 18 + y, 1, 1);
  } else {
    p.r(hair, 12, 14 + y, 1, 1); p.r(hair, 4, 14 + y, 1, 1);
    p.r(L.eyes || '#2a4a7a', 6, 17 + y, 1, 1); p.r(L.eyes || '#2a4a7a', 10, 17 + y, 1, 1);
    p.r('rgba(230,110,110,0.45)', 4, 19 + y, 2, 1); p.r('rgba(230,110,110,0.45)', 11, 19 + y, 2, 1);
    p.r(shade(skin, -0.3), 7, 20 + y, 3, 1); p.r('#ffffff', 8, 20 + y, 1, 1);
  }
}

// The little picture on a toddler's top, about 5x3 at x, y.
function babyPrint(p, L, x, y) {
  const c = L.motif, d = shade(c, -0.35), l = shade(c, 0.3);
  switch (L.print) {
    case 'teddy':
      p.r(c, x, y, 1, 1); p.r(c, x + 4, y, 1, 1); p.r(c, x, y + 1, 5, 2); p.r(c, x + 1, y + 3, 3, 1);
      p.r(d, x + 1, y + 2, 1, 1); p.r(d, x + 3, y + 2, 1, 1); p.r(l, x + 2, y + 3, 1, 1); p.r(l, x + 1, y + 1, 1, 1); return;
    case 'star':
      p.r(c, x + 2, y, 1, 3); p.r(c, x + 1, y + 1, 3, 1); p.r(c, x + 1, y + 2, 1, 1); p.r(c, x + 3, y + 2, 1, 1); p.r(l, x + 2, y, 1, 1); return;
    case 'heart':
      p.r(c, x + 1, y, 1, 1); p.r(c, x + 3, y, 1, 1); p.r(c, x, y, 1, 1); p.r(c, x + 4, y, 1, 1); p.r(c, x, y + 1, 5, 1); p.r(c, x + 1, y + 2, 3, 1); p.r(c, x + 2, y + 3, 1, 1); return;
    default:
      p.r(c, x, y + 1, 4, 3); p.r(l, x + 1, y + 1, 1, 1);
  }
}

function legs(p, L, step, bob, x1, x2, w) {
  const pants = L.pants, pd = shade(pants, -0.18), sh = L.shoes;
  const leg = (x, l) => {
    p.r(pants, x, 26 + bob, w, 4 - l);
    pattern(p, L.pantsPattern, pants, L.pantsAccent, x, 26 + bob, w, 4 - l, bob);
    p.r(L.pantsPattern ? DIM : pd, x + w - 1, 26 + bob, 1, 4 - l);
    p.r(sh, x, 30 - l, w, 2); p.r(shade(sh, 0.25), x, 30 - l, w - 1, 1);
  };
  leg(x1, step === 1 ? 1 : 0); leg(x2, step === 2 ? 1 : 0);
}

function torso(p, L, x, w, bob, back, side) {
  const s = L.shirt, sd = shade(s, -0.2), sl = shade(s, 0.15);
  p.r(s, x, 17 + bob, w, 9);
  pattern(p, L.shirtPattern, s, L.shirtAccent, x, 17 + bob, w, 9, bob);
  if (!L.shirtPattern) p.r(sl, x + 1, 17 + bob, w - 3, 1);
  p.r(L.shirtPattern ? DIM : sd, x + w - 2, 18 + bob, 2, 8);
  if (!L.pinafore) p.r(shade(L.pants, -0.1), x, 25 + bob, w, 1); // belt line
  if (L.jersey && back && !side) { p.r('#f4f4f0', 6, 19 + bob, 3, 1); p.r('#f4f4f0', 8, 20 + bob, 1, 3); } // number 7
  if (L.rips && !back) [[2, 19], [3, 20], [5, 21], [6, 22], [3, 23]].forEach(([i, j]) => p.r(i < w - 2 ? L.skin : DIM, x + i, j + bob, 1, 1));
  if (L.blazer) blazer(p, L, x, w, bob, back, side);
  if (L.coat) {
    const c = L.coat, d = shade(c, -0.22), l = shade(c, 0.15);
    if (back || side) { p.r(c, x, 17 + bob, w, 12); p.r(l, x + 1, 17 + bob, w - 2, 1); p.r(d, x + w - 2, 18 + bob, 2, 11); }
    else { p.r(c, x, 17 + bob, 3, 12); p.r(c, x + w - 3, 17 + bob, 3, 12); p.r(l, x, 17 + bob, 2, 1); p.r(d, x + w - 2, 18 + bob, 2, 11); p.r(d, x + 2, 18 + bob, 1, 10); }
    if (L.tatters) for (let i = 0; i < w; i += 2) p.r(i % 4 ? d : 'rgba(0,0,0,0)', x + i, 28 + bob, 1, 1), p.r(shade(c, -0.4), x + i + 1, 27 + bob + (i % 3 ? 1 : 0), 1, 1);
  }
  if (L.pinafore) pinafore(p, L, bob, back, side);
  // A slogan across the chest (colour), a few pixels of "lettering".
  if (L.logo && !back && !side) [0, 1, 3, 4, 5, 7].forEach(i => p.r(L.logo, x + 2 + i * (w - 5) / 8, 20 + bob, 1, 2));
  if (L.hivis) { p.r('#f0d040', x, 20 + bob, w, 1); p.r('#e8e4d8', x, 22 + bob, w, 1); }
  if (L.apron) { p.r(L.apron, x + 2, 19 + bob, w - 4, 7); p.r(shade(L.apron, -0.15), x + 2, 19 + bob, w - 4, 1); }
  if (L.collar && !back && !L.blazer) { p.r(shade(s, 0.35), x + 2, 17 + bob, 2, 1); p.r(shade(s, 0.35), x + w - 4, 17 + bob, 2, 1); }
}

function blazer(p, L, x, w, y, back, side) {
  const c = L.blazer, d = shade(c, -0.25), l = L.blazerTrim || shade(c, 0.22);
  const area = (ax, ay, aw, ah) => { p.r(c, ax, ay, aw, ah); pattern(p, L.blazerPattern, c, L.blazerAccent, ax, ay, aw, ah, y); };
  if (back) { area(x, 17 + y, w, 10); p.r(d, x + w - 2, 18 + y, 2, 9); p.r(d, x + w / 2 - 1, 22 + y, 1, 5); return; }
  if (side) {
    area(x + 1, 17 + y, w - 1, 10); p.r(d, x + w - 1, 18 + y, 1, 9);
    p.r(l, x + 1, 17 + y, 1, 3); // lapel
    return;
  }
  area(x, 17 + y, 4, 10); area(x + w - 4, 17 + y, 4, 10);
  p.r(c, x + 4, 17 + y, 1, 1); p.r(c, x + w - 5, 17 + y, 1, 1);
  p.r(l, x + 3, 18 + y, 1, 3); p.r(l, x + w - 4, 18 + y, 1, 3); // lapels
  p.r(d, x + w - 2, 18 + y, 2, 9);
}

function pinafore(p, L, y, back, side) {
  const c = L.pinafore, d = shade(c, -0.25);
  const area = (ax, ay, aw, ah) => { p.r(c, ax, ay, aw, ah); pattern(p, L.pinaforePattern, c, L.pinaforeAccent, ax, ay, aw, ah, y); };
  if (side) {
    area(7, 17 + y, 2, 2); area(5, 19 + y, 6, 5);
    area(4, 24 + y, 9, 3); area(3, 27 + y, 10, 2);
    p.r(DIM, 11, 24 + y, 2, 5);
    return;
  }
  if (back) { area(5, 17 + y, 2, 3); area(9, 17 + y, 2, 3); area(5, 20 + y, 6, 4); }
  else { area(5, 17 + y, 1, 2); area(10, 17 + y, 1, 2); area(5, 19 + y, 6, 5); p.r(d, 7, 21 + y, 2, 1); } // straps, bib, pocket
  area(3, 24 + y, 10, 3); area(2, 27 + y, 12, 2);
  p.r(DIM, 11, 24 + y, 2, 3); p.r(DIM, 12, 27 + y, 2, 2); p.r(DIM, 2, 28 + y, 12, 1);
}

function face(p, L, y) {
  const skin = L.skin;
  p.r('#2a1a10', 5, 10 + y, 1, 2); p.r('#2a1a10', 10, 10 + y, 1, 2);
  p.r('rgba(230,110,110,0.35)', 4, 12 + y, 2, 1); p.r('rgba(230,110,110,0.35)', 10, 12 + y, 2, 1);
  p.r(L.lips || shade(skin, -0.32), 7, 13 + y, 2, 1);
  if (L.stubble) { const s = 'rgba(40,25,15,0.28)'; p.r(s, 4, 12 + y, 8, 3); p.r(s, 5, 15 + y, 6, 1); }
  if (L.glasses) {
    const g = typeof L.glasses === 'string' ? L.glasses : '#3a2a20';
    p.r(g, 4, 9 + y, 3, 1); p.r(g, 9, 9 + y, 3, 1); p.r(g, 4, 12 + y, 3, 1); p.r(g, 9, 12 + y, 3, 1);
    p.r(g, 4, 10 + y, 1, 2); p.r(g, 6, 10 + y, 1, 2); p.r(g, 9, 10 + y, 1, 2); p.r(g, 11, 10 + y, 1, 2); p.r(g, 7, 10 + y, 2, 1);
    if (L.glassesTint !== false) { p.r('rgba(220,240,255,0.35)', 5, 10 + y, 1, 2); p.r('rgba(220,240,255,0.35)', 10, 10 + y, 1, 2); }
  }
  if (L.sunglasses) {
    const lens = L.sunglasses, f = L.frame || '#1e1e24', shine = 'rgba(255,255,255,0.45)';
    if (L.shades === 'wrap') {
      p.r(f, 3, 9 + y, 10, 1); p.r(lens, 3, 10 + y, 10, 2); p.r(f, 7, 11 + y, 2, 1); p.r(shine, 4, 10 + y, 2, 1); p.r(shine, 9, 10 + y, 1, 1);
    } else if (L.shades === 'round') {
      p.r(lens, 4, 10 + y, 3, 2); p.r(lens, 9, 10 + y, 3, 2);
      p.r(f, 4, 9 + y, 3, 1); p.r(f, 9, 9 + y, 3, 1); p.r(f, 3, 10 + y, 1, 2); p.r(f, 12, 10 + y, 1, 2);
      p.r(f, 4, 12 + y, 3, 1); p.r(f, 9, 12 + y, 3, 1); p.r(f, 7, 10 + y, 2, 1);
      p.r(shine, 4, 10 + y, 1, 1); p.r(shine, 9, 10 + y, 1, 1);
    } else {
      p.r(f, 3, 9 + y, 4, 4); p.r(f, 9, 9 + y, 4, 4); p.r(f, 7, 10 + y, 2, 1);
      p.r(lens, 4, 10 + y, 2, 2); p.r(lens, 10, 10 + y, 2, 2); p.r(shine, 4, 10 + y, 1, 1); p.r(shine, 10, 10 + y, 1, 1);
    }
  }
}

function front(p, L, back, step, bob) {
  const skin = L.skin, sk2 = shade(skin, -0.18), hair = L.hair, hd = shade(hair, -0.25), hl = shade(hair, 0.18);
  const y = bob, hs = L.hairStyle;
  // long hair hangs behind the shoulders
  if (hs === 'long') p.r(hair, 2, 8 + y, 12, back ? 13 : 10);
  if (hs === 'wavy') wavyBack(p, hair, hd, 2, 12, 8 + y, back ? 14 : 11);
  legs(p, L, step, y, 4, 8, 4);
  torso(p, L, 3, 10, y, back, false);
  // arms swing opposite to the legs
  const sw = step === 1 ? 1 : step === 2 ? -1 : 0, sv = L.sleeve, hand = L.gloves || skin;
  const arm = (x, n, dk) => { p.r(sv, x, 18 + y, 2, n); pattern(p, L.blazer ? L.blazerPattern : L.shirtPattern, sv, L.blazer ? L.blazerAccent : L.shirtAccent, x, 18 + y, 2, n, y); p.r(L.blazer || L.shirtPattern ? DIM : shade(sv, dk), x + (dk < -0.22 ? 1 : 0), 18 + y, 1, n); };
  arm(1, 5 + sw, -0.2); p.r(hand, 1, 23 + y + sw, 2, 2);
  arm(13, 5 - sw, -0.25); p.r(L.gloves ? shade(hand, -0.2) : sk2, 13, 23 + y - sw, 2, 2);
  // neck and head
  p.r(sk2, 6, 15 + y, 4, 2);
  if (hs === 'mullet') { p.r(hair, 4, 15 + y, 2, 3); p.r(hair, 10, 15 + y, 2, 3); p.r(hair, 3, 16 + y, 1, 2); p.r(hair, 12, 16 + y, 1, 2); p.r(hd, 3, 17 + y, 3, 1); p.r(hd, 10, 17 + y, 3, 1); }
  p.r(skin, 3, 6 + y, 10, 9); p.r(skin, 4, 15 + y, 8, 1);
  p.r(sk2, 11, 7 + y, 2, 8); p.r(sk2, 4, 15 + y, 8, 1);
  if (back) {
    p.r(hair, 2, 4 + y, 12, 11); p.r(hl, 4, 5 + y, 6, 2); p.r(hd, 11, 6 + y, 2, 9); p.r(hd, 3, 13 + y, 10, 2);
    if (hs === 'bald') { p.r(skin, 4, 4 + y, 8, 6); p.r(shade(skin, 0.15), 5, 5 + y, 3, 2); }
    if (hs === 'bun') { p.r(hair, 6, 1 + y, 4, 4); p.r(hl, 7, 2 + y, 2, 1); }
    if (hs === 'messybun') { p.r(hair, 5, 1 + y, 6, 4); p.r(hair, 4, 2 + y, 1, 1); p.r(hair, 11, 0 + y, 1, 2); p.r(hl, 6, 1 + y, 3, 1); p.r(hd, 7, 3 + y, 3, 1); p.r(hair, 3, 15 + y, 1, 1); p.r(hair, 12, 15 + y, 1, 1); }
    if (hs === 'cap') { p.r(L.cap, 2, 3 + y, 12, 5); p.r(shade(L.cap, -0.2), 2, 7 + y, 12, 1); }
    if (hs === 'mullet') { p.r(skin, 2, 11 + y, 1, 3); p.r(skin, 13, 11 + y, 1, 3); p.r(hair, 3, 14 + y, 10, 4); p.r(hd, 3, 17 + y, 10, 1); p.r(hd, 5, 12 + y, 6, 1); p.r(hl, 6, 15 + y, 1, 2); p.r(hl, 9, 14 + y, 1, 2); }
    if (hs === 'long') { p.r(hair, 3, 14 + y, 10, 6); p.r(hd, 3, 19 + y, 10, 1); p.r(hd, 8, 14 + y, 1, 5); }
    if (hs === 'wavy') { wavyBack(p, hair, hd, 3, 11, 13 + y, 8); p.r(hl, 4, 8 + y, 1, 2); p.r(hl, 10, 10 + y, 1, 2); p.r(hd, 7, 12 + y, 1, 6); p.r(hl, 5, 16 + y, 1, 2); p.r(hl, 10, 17 + y, 1, 2); }
    if (hs === 'curly' || hs === 'wavyshort') { for (let i = 0; i < 4; i++) p.r(hl, 4 + i * 2, 6 + y + (i % 2) * 3, 1, 1); }
    if (L.hoops) { p.r(L.hoops, 1, 13 + y, 1, 2); p.r(L.hoops, 14, 13 + y, 1, 2); }
    return;
  }
  face(p, L, y);
  if (L.beard) { p.r(hair, 4, 12 + y, 8, 4); p.r(hd, 5, 15 + y, 6, 1); p.r(shade(skin, -0.3), 7, 13 + y, 2, 1); }
  if (L.moustache) p.r(L.moustache === true ? hair : L.moustache, 5, 12 + y, 6, 1);
  hairFront(p, L, y, hair, hd, hl, skin);
  if (L.streak) { p.r(L.streak, 5, 4 + y, 1, 4); p.r(L.streak, 4, 7 + y, 1, 2); }
  if (L.hoops) { const c = L.hoops; for (const x of [1, 12]) { p.r(c, x + 1, 12 + y, 1, 1); p.r(c, x, 13 + y, 1, 2); p.r(c, x + 2, 13 + y, 1, 2); p.r(c, x + 1, 15 + y, 1, 1); } }
}

// Long wavy hair behind the head and shoulders: the edges wobble in and out.
function wavyBack(p, hair, hd, x1, x2, y, h) {
  p.r(hair, x1, y, x2 - x1 + 2, h);
  for (let j = 0; j < h; j += 2) { const o = (j / 2) % 2; p.r(hair, x1 - o, y + j, 1, 2); p.r(hair, x2 + 1 + o, y + j, 1, 2); }
  for (let i = x1; i <= x2 + 1; i++) if (i % 2) p.r(hair, i, y + h, 1, 1);
  p.r(hd, x1, y + h - 1, x2 - x1 + 2, 1);
}

function hairFront(p, L, y, hair, hd, hl, skin) {
  switch (L.hairStyle) {
    case 'bald':
      p.r(hair, 3, 8 + y, 1, 4); p.r(hair, 12, 8 + y, 1, 4);
      p.r(shade(skin, 0.15), 5, 6 + y, 4, 1);
      return;
    case 'cap':
      p.r(hair, 3, 7 + y, 1, 4); p.r(hair, 12, 7 + y, 1, 4);
      p.r(L.cap, 3, 3 + y, 10, 4); p.r(shade(L.cap, 0.2), 5, 3 + y, 4, 1);
      p.r(shade(L.cap, -0.25), 2, 7 + y, 12, 1); p.r(L.cap, 4, 7 + y, 9, 1);
      return;
    case 'pixie':
      p.r(hair, 3, 4 + y, 10, 4); p.r(hair, 2, 6 + y, 1, 3); p.r(hair, 13, 6 + y, 1, 3);
      p.r(hair, 4, 3 + y, 2, 1); p.r(hair, 8, 3 + y, 3, 1); p.r(hair, 3, 8 + y, 2, 1); p.r(hair, 11, 8 + y, 2, 1);
      p.r(hl, 5, 4 + y, 5, 1); p.r(hd, 4, 7 + y, 3, 1); p.r(hd, 9, 7 + y, 3, 1);
      return;
    case 'spiky':
      p.r(hair, 3, 4 + y, 10, 4); p.r(hair, 4, 3 + y, 1, 1); p.r(hair, 7, 2 + y, 2, 2); p.r(hair, 11, 3 + y, 1, 1);
      p.r(hl, 6, 4 + y, 3, 1); p.r(hair, 3, 8 + y, 1, 2); p.r(hair, 12, 8 + y, 1, 2); p.r(hd, 4, 7 + y, 8, 1);
      return;
    case 'curly':
      for (let i = 0; i < 6; i++) p.blob(4 + i * 1.6, 5 + y + (i % 2), 2, hair);
      p.r(hair, 2, 6 + y, 2, 7); p.r(hair, 12, 6 + y, 2, 7); p.r(hl, 5, 4 + y, 2, 1); p.r(hl, 9, 5 + y, 2, 1);
      p.r(hd, 4, 8 + y, 2, 1); p.r(hd, 10, 8 + y, 2, 1);
      return;
    case 'mullet':
      // short and textured on top, clipped sides, the party is at the back
      p.r(hair, 3, 4 + y, 10, 4); p.r(hair, 4, 3 + y, 8, 1); p.r(hair, 3, 8 + y, 2, 1); p.r(hair, 9, 8 + y, 3, 1);
      p.r(hl, 5, 4 + y, 2, 1); p.r(hl, 8, 4 + y, 2, 1); p.r(hd, 6, 7 + y, 3, 1); p.r(hd, 10, 6 + y, 2, 1);
      p.r(mix(mix(hair, skin), skin), 3, 9 + y, 1, 2); p.r(mix(mix(hair, skin), skin), 12, 9 + y, 1, 2); // faded sides
      return;
    case 'wavyshort':
      p.r(hair, 3, 4 + y, 10, 4); p.r(hair, 4, 3 + y, 3, 1); p.r(hair, 8, 3 + y, 4, 1);
      p.r(hair, 2, 6 + y, 1, 4); p.r(hair, 13, 6 + y, 1, 4); p.r(hair, 3, 8 + y, 2, 1); p.r(hair, 9, 8 + y, 4, 1);
      p.r(hl, 4, 4 + y, 2, 1); p.r(hl, 6, 5 + y, 2, 1); p.r(hl, 9, 4 + y, 2, 1); p.r(hl, 11, 5 + y, 1, 1);
      p.r(hd, 5, 7 + y, 3, 1); p.r(hd, 10, 7 + y, 2, 1);
      return;
    case 'wavy':
      p.r(hair, 3, 4 + y, 10, 4); p.r(hair, 2, 6 + y, 1, 4); p.r(hair, 13, 6 + y, 1, 4);
      p.r(hair, 3, 8 + y, 2, 1); p.r(hair, 10, 8 + y, 3, 1); p.r(hair, 9, 7 + y, 4, 1);
      p.r(hl, 4, 5 + y, 3, 1); p.r(hl, 9, 4 + y, 2, 1); p.r(hd, 6, 7 + y, 3, 1);
      // waves falling past the shoulders
      for (let j = 0; j < 10; j++) { const o = Math.floor(j / 2) % 2; p.r(hair, 1 + o, 8 + y + j, 2, 1); p.r(hair, 13 - o, 8 + y + j, 2, 1); }
      p.r(hair, 3, 9 + y, 1, 4); p.r(hair, 12, 9 + y, 1, 4);
      p.r(hl, 2, 10 + y, 1, 1); p.r(hl, 13, 13 + y, 1, 1); p.r(hd, 2, 15 + y, 1, 2); p.r(hd, 13, 16 + y, 1, 1);
      return;
    case 'messybun':
      p.r(hair, 3, 4 + y, 10, 4); p.r(hair, 2, 6 + y, 1, 4); p.r(hair, 13, 6 + y, 1, 4);
      p.r(hair, 3, 8 + y, 2, 1); p.r(hair, 11, 8 + y, 2, 1); p.r(hair, 7, 7 + y, 2, 2);
      p.r(hair, 5, 1 + y, 6, 3); p.r(hair, 4, 2 + y, 1, 1); p.r(hair, 11, 0 + y, 1, 2); p.r(hair, 6, 0 + y, 2, 1);
      p.r(hl, 6, 1 + y, 3, 1); p.r(hd, 8, 3 + y, 3, 1); p.r(hl, 4, 5 + y, 4, 1); p.r(hd, 9, 5 + y, 2, 1);
      p.r(hair, 2, 10 + y, 1, 3); p.r(hair, 13, 10 + y, 1, 2); // loose strands
      return;
    default: {
      // short base shared by long, bob and bun
      p.r(hair, 3, 4 + y, 10, 4); p.r(hair, 2, 6 + y, 1, 4); p.r(hair, 13, 6 + y, 1, 4);
      p.r(hair, 3, 8 + y, 3, 1); p.r(hair, 10, 8 + y, 3, 1); p.r(hair, 3, 9 + y, 1, 1); p.r(hair, 12, 9 + y, 1, 1);
      p.r(hl, 5, 5 + y, 4, 1); p.r(hl, 4, 6 + y, 1, 1); p.r(hd, 7, 7 + y, 3, 1);
      if (L.hairStyle === 'long') { p.r(hair, 2, 8 + y, 2, 9); p.r(hair, 12, 8 + y, 2, 9); p.r(hd, 2, 16 + y, 2, 1); p.r(hd, 12, 16 + y, 2, 1); }
      if (L.hairStyle === 'bob') { p.r(hair, 2, 8 + y, 2, 6); p.r(hair, 12, 8 + y, 2, 6); p.r(hd, 2, 13 + y, 2, 1); p.r(hd, 12, 13 + y, 2, 1); }
      if (L.hairStyle === 'bun') { p.r(hair, 6, 1 + y, 4, 3); p.r(hl, 7, 1 + y, 2, 1); }
    }
  }
}

function side(p, L, step, bob) {
  const skin = L.skin, sk2 = shade(skin, -0.18), hair = L.hair, hd = shade(hair, -0.25), hl = shade(hair, 0.18);
  const y = bob, pants = L.pants, pd = shade(pants, -0.2), sh = L.shoes, hs = L.hairStyle;
  if (hs === 'long') p.r(hair, 8, 8 + y, 5, 10);
  if (hs === 'wavy') wavyBack(p, hair, hd, 8, 11, 8 + y, 11);
  // legs: stride apart on steps
  const stride = (x, lift, dark) => {
    p.r(pants, x, 26 + y, 3, 4 - lift);
    pattern(p, L.pantsPattern, pants, L.pantsAccent, x, 26 + y, 3, 4 - lift, y);
    if (dark) p.r(L.pantsPattern ? DIM : pd, x, 26 + y, 3, 4 - lift);
    p.r(sh, x - 1, 30 - lift, 4, 2); p.r(shade(sh, 0.25), x - 1, 30 - lift, 3, 1);
  };
  if (step === 0) { stride(7, 0, true); stride(6, 0, false); }
  else if (step === 1) { stride(9, 1, true); stride(4, 0, false); }
  else { stride(4, 1, true); stride(9, 0, false); }
  torso(p, L, 5, 7, y, false, true);
  if (hs === 'mullet') { p.r(hair, 10, 14 + y, 3, 4); p.r(hd, 10, 17 + y, 3, 1); p.r(hl, 11, 15 + y, 1, 1); }
  // arm
  const sw = step === 1 ? -2 : step === 2 ? 2 : 0;
  p.r(shade(L.sleeve, -0.12), 7 + sw / 2, 18 + y, 3, 5);
  pattern(p, L.blazer ? L.blazerPattern : L.shirtPattern, shade(L.sleeve, -0.12), L.blazer ? L.blazerAccent : L.shirtAccent, 7 + sw / 2, 18 + y, 3, 5, y);
  p.r(L.gloves || skin, 7 + sw, 23 + y, 2, 2);
  // head in profile, facing left
  p.r(sk2, 7, 15 + y, 3, 2);
  p.r(skin, 4, 6 + y, 8, 9); p.r(skin, 3, 10 + y, 1, 2); // nose
  p.r(sk2, 5, 15 + y, 6, 1);
  p.r('#2a1a10', 5, 10 + y, 1, 2);
  p.r('rgba(230,110,110,0.35)', 5, 12 + y, 2, 1);
  p.r(L.lips || shade(skin, -0.3), 4, 13 + y, 2, 1);
  if (L.stubble) { const s = 'rgba(40,25,15,0.28)'; p.r(s, 4, 12 + y, 6, 3); p.r(s, 6, 15 + y, 3, 1); }
  if (L.glasses) { const g = typeof L.glasses === 'string' ? L.glasses : '#3a2a20'; p.r(g, 4, 9 + y, 4, 1); p.r(g, 4, 12 + y, 3, 1); p.r(g, 4, 10 + y, 1, 2); p.r(g, 6, 10 + y, 1, 2); p.r(g, 7, 9 + y, 4, 1); }
  if (L.sunglasses) {
    const f = L.frame || '#1e1e24';
    if (L.shades === 'wrap') { p.r(f, 3, 9 + y, 8, 1); p.r(L.sunglasses, 3, 10 + y, 4, 2); p.r(f, 7, 10 + y, 4, 1); }
    else { p.r(f, 3, 9 + y, 4, 1); p.r(f, 3, 12 + y, 4, 1); p.r(f, 3, 10 + y, 1, 2); p.r(f, 6, 10 + y, 1, 2); p.r(L.sunglasses, 4, 10 + y, 2, 2); p.r(f, 7, 10 + y, 4, 1); p.r('rgba(255,255,255,0.45)', 4, 10 + y, 1, 1); }
  }
  if (L.beard) { p.r(hair, 4, 12 + y, 6, 4); p.r(shade(skin, -0.3), 4, 13 + y, 1, 1); }
  if (L.moustache) p.r(L.moustache === true ? hair : L.moustache, 3, 12 + y, 4, 1);
  const hoop = () => { if (L.hoops) { const c = L.hoops; p.r(c, 9, 13 + y, 1, 1); p.r(c, 8, 14 + y, 1, 2); p.r(c, 10, 14 + y, 1, 2); p.r(c, 9, 16 + y, 1, 1); } };
  switch (hs) {
    case 'bald': p.r(hair, 9, 8 + y, 3, 4); return;
    case 'cap':
      p.r(hair, 9, 7 + y, 3, 5);
      p.r(L.cap, 4, 3 + y, 9, 4); p.r(shade(L.cap, 0.2), 6, 3 + y, 4, 1); p.r(shade(L.cap, -0.25), 1, 7 + y, 6, 1);
      return;
    case 'curly':
      for (let i = 0; i < 4; i++) p.blob(6 + i * 2, 5 + y + (i % 2), 2, hair);
      p.r(hair, 9, 6 + y, 4, 8); p.r(hl, 7, 4 + y, 2, 1);
      return;
    case 'mullet':
      p.r(hair, 4, 4 + y, 9, 3); p.r(hair, 5, 3 + y, 6, 1); p.r(hair, 4, 7 + y, 2, 1); p.r(hair, 10, 7 + y, 3, 7);
      p.r(mix(hair, skin), 8, 7 + y, 2, 3); p.r(hl, 6, 4 + y, 2, 1); p.r(hl, 9, 3 + y, 1, 1); p.r(hd, 11, 10 + y, 2, 1);
      return;
    case 'wavyshort':
      p.r(hair, 4, 4 + y, 9, 3); p.r(hair, 5, 3 + y, 6, 1); p.r(hair, 8, 7 + y, 5, 5); p.r(hair, 4, 7 + y, 3, 1); p.r(hair, 12, 5 + y, 1, 8);
      p.r(hl, 5, 4 + y, 2, 1); p.r(hl, 8, 5 + y, 2, 1); p.r(hl, 10, 8 + y, 1, 2); p.r(hd, 9, 10 + y, 3, 1); p.r(hair, 3, 6 + y, 1, 1);
      return;
    default:
      p.r(hair, 4, 4 + y, 9, 3); p.r(hair, 8, 7 + y, 5, 5); p.r(hair, 4, 7 + y, 2, 1); p.r(hair, 12, 5 + y, 1, 8);
      p.r(hl, 6, 4 + y, 4, 1); p.r(hd, 9, 10 + y, 3, 1);
      if (hs === 'spiky') { p.r(hair, 6, 2 + y, 2, 2); p.r(hair, 10, 3 + y, 2, 1); }
      if (hs === 'bob') p.r(hair, 8, 12 + y, 5, 2);
      if (hs === 'bun') { p.r(hair, 10, 2 + y, 4, 3); p.r(hl, 11, 2 + y, 2, 1); }
      if (hs === 'messybun') { p.r(hair, 9, 1 + y, 5, 4); p.r(hair, 14, 2 + y, 1, 1); p.r(hair, 12, 0 + y, 1, 1); p.r(hl, 10, 1 + y, 2, 1); p.r(hair, 5, 8 + y, 1, 3); }
      if (hs === 'wavy') { p.r(hair, 8, 12 + y, 5, 2); p.r(hl, 9, 9 + y, 1, 2); p.r(hd, 11, 12 + y, 1, 2); }
      if (L.streak) p.r(L.streak, 5, 4 + y, 3, 1);
      hoop();
  }
}
