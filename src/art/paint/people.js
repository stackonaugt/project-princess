// Built-in people, drawn in code at 16x32 (Stardew proportions).
//
// A "look" describes a person:
//   skin, hair, shirt, pants, shoes   colours
//   hairStyle  'short' | 'long' | 'bob' | 'bun' | 'curly' | 'bald' | 'cap' | 'spiky' | 'pixie'
//   cap        colour of a cap (with hairStyle 'cap')
//   glasses, beard, moustache, hivis, apron, collar (booleans or colours)
//   longBeard  a big beard down the chest (colour)
//   scarf      a scarf hanging down the front (colour)
//   baby       true draws a toddler instead (see drawBaby)
//
// drawPerson(p, look, dir, step) paints one frame: dir is 'down' | 'up' | 'left'
// (right is the left frame mirrored), step is 0 standing, 1 and 2 mid-stride.

import { shade } from './painter.js';

export const FRAME_W = 16, FRAME_H = 32;

export function drawPerson(p, look, dir, step) {
  const L = { skin: '#f2c79a', hair: '#6b3f1f', shirt: '#3fa38f', pants: '#33446e', shoes: '#3a2418', hairStyle: 'short', ...look };
  if (L.baby) return drawBaby(p, L, dir, step);
  const bob = step ? -1 : 0;
  if (dir === 'left') side(p, L, step, bob); else front(p, L, dir === 'up', step, bob);
  if (dir !== 'up') extras(p, L, dir, bob);
}

// Things drawn over the top of the body: long beards and scarves.
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
}

// Toddlers: big head, onesie, tiny legs. Fills the bottom of the 16x32 frame.
export function drawBaby(p, L, dir, step) {
  const skin = L.skin, sk2 = shade(skin, -0.15), hair = L.hair, hl = shade(hair, 0.2);
  const suit = L.shirt, sd = shade(suit, -0.2), sl = shade(suit, 0.18);
  const y = step ? -1 : 0, back = dir === 'up', side = dir === 'left';
  // legs and feet
  const lift = s => (step === s ? 1 : 0);
  p.r(sd, 5, 28 + y, 3, 2 - lift(1)); p.r(sd, 9, 28 + y, 3, 2 - lift(2));
  p.r(L.shoes || '#f4f4f0', 5, 30 - lift(1), 3, 2); p.r(L.shoes || '#f4f4f0', 9, 30 - lift(2), 3, 2);
  // onesie body
  p.r(suit, 4, 22 + y, 9, 7); p.r(sl, 5, 22 + y, 6, 1); p.r(sd, 11, 23 + y, 2, 6);
  if (L.motif && !back) { p.r(L.motif, 6, 24 + y, 4, 3); p.r(shade(L.motif, 0.3), 7, 24 + y, 1, 1); }
  // arms
  const sw = step === 1 ? 1 : step === 2 ? -1 : 0;
  if (side) { p.r(suit, 6, 23 + y, 3, 3); p.r(skin, 4, 25 + y + sw, 2, 2); }
  else { p.r(suit, 2, 23 + y, 2, 3 + sw); p.r(skin, 2, 26 + y + sw, 2, 1); p.r(suit, 13, 23 + y, 2, 3 - sw); p.r(skin, 13, 26 + y - sw, 2, 1); }
  // big round head
  p.blob(8, 17 + y, 5, skin); p.r(sk2, 11, 17 + y, 2, 4);
  if (back) { p.blob(8, 16 + y, 5, hair); p.r(hl, 6, 13 + y, 3, 1); return; }
  // wispy hair on top
  p.r(hair, 4, 12 + y, 9, 2); p.r(hair, 3, 13 + y, 2, 2); p.r(hl, 6, 12 + y, 3, 1); p.r(hair, 8, 11 + y, 2, 1);
  if (side) {
    p.r(hair, 9, 13 + y, 4, 4); p.r('#2a1a10', 5, 17 + y, 1, 1); p.r('rgba(230,110,110,0.45)', 5, 19 + y, 2, 1); p.r(sk2, 3, 18 + y, 1, 1);
  } else {
    p.r(L.eyes || '#2a4a7a', 6, 17 + y, 1, 1); p.r(L.eyes || '#2a4a7a', 10, 17 + y, 1, 1);
    p.r('rgba(230,110,110,0.45)', 4, 19 + y, 2, 1); p.r('rgba(230,110,110,0.45)', 11, 19 + y, 2, 1);
    p.r(shade(skin, -0.3), 7, 20 + y, 3, 1); p.r('#ffffff', 8, 20 + y, 1, 1);
  }
}

function legs(p, L, step, bob, x1, x2, w) {
  const pants = L.pants, pd = shade(pants, -0.18), sh = L.shoes;
  // left leg
  const l1 = step === 1 ? 1 : 0, l2 = step === 2 ? 1 : 0;
  p.r(pants, x1, 26 + bob, w, 4 - l1); p.r(pd, x1 + w - 1, 26 + bob, 1, 4 - l1);
  p.r(sh, x1, 30 - l1, w, 2); p.r(shade(sh, 0.25), x1, 30 - l1, w - 1, 1);
  // right leg
  p.r(pants, x2, 26 + bob, w, 4 - l2); p.r(pd, x2 + w - 1, 26 + bob, 1, 4 - l2);
  p.r(sh, x2, 30 - l2, w, 2); p.r(shade(sh, 0.25), x2, 30 - l2, w - 1, 1);
}

function torso(p, L, x, w, bob, back) {
  const s = L.shirt, sd = shade(s, -0.2), sl = shade(s, 0.15);
  p.r(s, x, 17 + bob, w, 9);
  p.r(sl, x + 1, 17 + bob, w - 3, 1);
  p.r(sd, x + w - 2, 18 + bob, 2, 8);
  p.r(shade(L.pants, -0.1), x, 25 + bob, w, 1); // belt line
  if (L.hivis) { p.r('#f0d040', x, 20 + bob, w, 1); p.r('#e8e4d8', x, 22 + bob, w, 1); }
  if (L.apron) { p.r(L.apron, x + 2, 19 + bob, w - 4, 7); p.r(shade(L.apron, -0.15), x + 2, 19 + bob, w - 4, 1); }
  if (L.collar && !back) { p.r(shade(s, 0.35), x + 2, 17 + bob, 2, 1); p.r(shade(s, 0.35), x + w - 4, 17 + bob, 2, 1); }
}

function front(p, L, back, step, bob) {
  const skin = L.skin, sk2 = shade(skin, -0.18), hair = L.hair, hd = shade(hair, -0.25), hl = shade(hair, 0.18);
  const y = bob;
  // long hair hangs behind the shoulders
  if (L.hairStyle === 'long') p.r(hair, 2, 8 + y, 12, back ? 13 : 10);
  legs(p, L, step, y, 4, 8, 4);
  torso(p, L, 3, 10, y, back);
  // arms swing opposite to the legs
  const sw = step === 1 ? 1 : step === 2 ? -1 : 0;
  p.r(L.shirt, 1, 18 + y, 2, 5 + sw); p.r(shade(L.shirt, -0.2), 1, 18 + y, 1, 5 + sw);
  p.r(skin, 1, 23 + y + sw, 2, 2);
  p.r(L.shirt, 13, 18 + y, 2, 5 - sw); p.r(shade(L.shirt, -0.25), 14, 18 + y, 1, 5 - sw);
  p.r(sk2, 13, 23 + y - sw, 2, 2);
  // neck and head
  p.r(sk2, 6, 15 + y, 4, 2);
  p.r(skin, 3, 6 + y, 10, 9); p.r(skin, 4, 15 + y, 8, 1);
  p.r(sk2, 11, 7 + y, 2, 8); p.r(sk2, 4, 15 + y, 8, 1);
  if (back) {
    p.r(hair, 2, 4 + y, 12, 11); p.r(hl, 4, 5 + y, 6, 2); p.r(hd, 11, 6 + y, 2, 9); p.r(hd, 3, 13 + y, 10, 2);
    if (L.hairStyle === 'bald') { p.r(skin, 4, 4 + y, 8, 6); p.r(shade(skin, 0.15), 5, 5 + y, 3, 2); }
    if (L.hairStyle === 'bun') { p.r(hair, 6, 1 + y, 4, 4); p.r(hl, 7, 2 + y, 2, 1); }
    if (L.hairStyle === 'cap') { p.r(L.cap, 2, 3 + y, 12, 5); p.r(shade(L.cap, -0.2), 2, 7 + y, 12, 1); }
    return;
  }
  // face
  p.r('#2a1a10', 5, 10 + y, 1, 2); p.r('#2a1a10', 10, 10 + y, 1, 2);
  p.r('rgba(230,110,110,0.35)', 4, 12 + y, 2, 1); p.r('rgba(230,110,110,0.35)', 10, 12 + y, 2, 1);
  p.r(shade(skin, -0.32), 7, 13 + y, 2, 1);
  if (L.glasses) {
    const g = typeof L.glasses === 'string' ? L.glasses : '#3a2a20';
    p.r(g, 4, 9 + y, 3, 1); p.r(g, 9, 9 + y, 3, 1); p.r(g, 4, 12 + y, 3, 1); p.r(g, 9, 12 + y, 3, 1);
    p.r(g, 4, 10 + y, 1, 2); p.r(g, 6, 10 + y, 1, 2); p.r(g, 9, 10 + y, 1, 2); p.r(g, 11, 10 + y, 1, 2); p.r(g, 7, 10 + y, 2, 1);
  }
  if (L.beard) { p.r(hair, 4, 12 + y, 8, 4); p.r(hd, 5, 15 + y, 6, 1); p.r(shade(skin, -0.3), 7, 13 + y, 2, 1); }
  if (L.moustache) p.r(hair, 5, 12 + y, 6, 1);
  hairFront(p, L, y, hair, hd, hl, skin);
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
  const y = bob, pants = L.pants, pd = shade(pants, -0.2), sh = L.shoes;
  if (L.hairStyle === 'long') p.r(hair, 8, 8 + y, 5, 10);
  // legs: stride apart on steps
  const stride = (x, lift, dark) => { p.r(dark ? pd : pants, x, 26 + y, 3, 4 - lift); p.r(sh, x - 1, 30 - lift, 4, 2); p.r(shade(sh, 0.25), x - 1, 30 - lift, 3, 1); };
  if (step === 0) { stride(7, 0, true); stride(6, 0, false); }
  else if (step === 1) { stride(9, 1, true); stride(4, 0, false); }
  else { stride(4, 1, true); stride(9, 0, false); }
  torso(p, L, 5, 7, y, false);
  // arm
  const sw = step === 1 ? -2 : step === 2 ? 2 : 0;
  p.r(shade(L.shirt, -0.12), 7 + sw / 2, 18 + y, 3, 5); p.r(skin, 7 + sw, 23 + y, 2, 2);
  // head in profile, facing left
  p.r(sk2, 7, 15 + y, 3, 2);
  p.r(skin, 4, 6 + y, 8, 9); p.r(skin, 3, 10 + y, 1, 2); // nose
  p.r(sk2, 5, 15 + y, 6, 1);
  p.r('#2a1a10', 5, 10 + y, 1, 2);
  p.r('rgba(230,110,110,0.35)', 5, 12 + y, 2, 1);
  p.r(shade(skin, -0.3), 4, 13 + y, 2, 1);
  if (L.glasses) { const g = typeof L.glasses === 'string' ? L.glasses : '#3a2a20'; p.r(g, 4, 9 + y, 4, 1); p.r(g, 4, 12 + y, 3, 1); p.r(g, 4, 10 + y, 1, 2); p.r(g, 7, 9 + y, 4, 1); }
  if (L.beard) { p.r(hair, 4, 12 + y, 6, 4); p.r(shade(skin, -0.3), 4, 13 + y, 1, 1); }
  if (L.moustache) p.r(hair, 3, 12 + y, 4, 1);
  switch (L.hairStyle) {
    case 'bald': p.r(hair, 9, 8 + y, 3, 4); return;
    case 'cap':
      p.r(hair, 9, 7 + y, 3, 5);
      p.r(L.cap, 4, 3 + y, 9, 4); p.r(shade(L.cap, 0.2), 6, 3 + y, 4, 1); p.r(shade(L.cap, -0.25), 1, 7 + y, 6, 1);
      return;
    case 'curly':
      for (let i = 0; i < 4; i++) p.blob(6 + i * 2, 5 + y + (i % 2), 2, hair);
      p.r(hair, 9, 6 + y, 4, 8); p.r(hl, 7, 4 + y, 2, 1);
      return;
    default:
      p.r(hair, 4, 4 + y, 9, 3); p.r(hair, 8, 7 + y, 5, 5); p.r(hair, 4, 7 + y, 2, 1); p.r(hair, 12, 5 + y, 1, 8);
      p.r(hl, 6, 4 + y, 4, 1); p.r(hd, 9, 10 + y, 3, 1);
      if (L.hairStyle === 'spiky') { p.r(hair, 6, 2 + y, 2, 2); p.r(hair, 10, 3 + y, 2, 1); }
      if (L.hairStyle === 'bob') p.r(hair, 8, 12 + y, 5, 2);
      if (L.hairStyle === 'bun') { p.r(hair, 10, 2 + y, 4, 3); p.r(hl, 11, 2 + y, 2, 1); }
  }
}
