// Cars, utes and trucks, drawn bigger and with a bit more realism: a 3/4
// side view for traffic going left and right (and parked cars), a top-down
// view for traffic going up and down. Shared by fx.js (traffic) and the
// parked 'car' and 'ute' objects.
//
//   carSide(p, colour, { ute, x, y })   48x26, facing right
//   carTop(p, colour)                   24x44, facing down
//   truckSide(p, colour)                80x32, facing right
import { shade, outline } from './painter.js';

const GLASS = '#34485c', GLINT = '#8ab8d8', TYRE = '#1a1a1c', HUB = '#a8acb4';

function wheel(p, cx, cy) {
  p.blob(cx, cy, 4, TYRE); p.blob(cx, cy, 2, HUB); p.r('#5a5e66', cx - 1, cy - 1, 1, 1);
}

export function carSide(p, c, { ute = false, x = 0, y = 0 } = {}) {
  const lo = shade(c, -0.22), hi = shade(c, 0.3), roof = shade(c, 0.15);
  p.ctx.save(); p.ctx.translate(x, y);
  // lower body: boot, doors, bonnet
  p.r(c, 2, 11, 44, 9); p.r(hi, 3, 11, 42, 1); p.r(lo, 2, 18, 44, 2);
  p.r(c, 1, 12, 1, 6); p.r(c, 46, 12, 1, 6);
  if (ute) {
    // cab up front, open tray behind
    for (let j = 0; j < 7; j++) { const l = 26 + Math.floor(j / 3), r = 40 - Math.max(0, 3 - j); p.r(c, l, 4 + j, r - l, 1); }
    p.r(roof, 27, 3, 10, 2);
    p.r(GLASS, 29, 5, 9, 5); p.r(GLINT, 30, 5, 2, 2); p.r(c, 33, 5, 1, 5);
    p.r(lo, 3, 8, 22, 3); p.r(shade(c, -0.4), 4, 9, 20, 2); p.r(hi, 3, 8, 22, 1);   // tray sides
    p.r('#5a5e66', 24, 4, 1, 7);                                                       // headboard
  } else {
    // the cabin: a sloping windscreen, side windows, a lighter roof seen from above
    for (let j = 0; j < 8; j++) { const l = 13 - Math.min(j, 3), r = 33 + Math.min(j, 5); p.r(c, l, 3 + j, r - l, 1); }
    p.r(roof, 14, 2, 18, 2); p.r(shade(roof, 0.2), 15, 2, 14, 1);
    p.r(GLASS, 14, 5, 9, 5); p.r(GLASS, 25, 5, 9, 5); p.r(GLASS, 35, 6, 3, 4);
    p.r(GLINT, 15, 5, 2, 2); p.r(GLINT, 26, 5, 2, 2);
    p.r(c, 23, 4, 2, 7);                                                               // B pillar
  }
  // door seams, handles, mirror
  p.r(lo, 24, 12, 1, 6); if (!ute) p.r(lo, 13, 12, 1, 6);
  p.r(hi, 19, 13, 2, 1); p.r(hi, 29, 13, 2, 1);
  p.r(lo, 37, 9, 2, 2);
  // bumpers and lights
  p.r('#6a6e76', 46, 15, 2, 4); p.r('#6a6e76', 0, 15, 2, 4);
  p.r('#f8f0b0', 45, 12, 2, 2); p.r('#d83c3c', 1, 12, 2, 2);
  // wheel arches and wheels
  p.r(shade(c, -0.5), 6, 16, 10, 2); p.r(shade(c, -0.5), 32, 16, 10, 2);
  wheel(p, 11, 20); wheel(p, 37, 20);
  outline(p.ctx, x, y, 48, 26);
  // soft ground shadow (after the outline so it stays soft)
  p.r('rgba(0,0,0,.22)', 4, 24, 40, 2); p.r('rgba(0,0,0,.12)', 2, 23, 44, 1);
  p.ctx.restore();
}

export function carTop(p, c) {
  const lo = shade(c, -0.22), hi = shade(c, 0.3), roof = shade(c, 0.12);
  p.r('rgba(0,0,0,.22)', 4, 4, 18, 40);
  // tyres poking out at the sides
  for (const y of [8, 31]) { p.r(TYRE, 1, y, 3, 6); p.r(TYRE, 20, y, 3, 6); }
  // body
  p.r(c, 3, 2, 18, 40); p.r(c, 4, 1, 16, 42); p.r(lo, 3, 2, 1, 40); p.r(lo, 20, 2, 1, 40);
  p.r(hi, 5, 1, 14, 1);
  // boot (top), rear window, roof, windscreen, bonnet (bottom)
  p.r(GLASS, 5, 9, 14, 4); p.r(roof, 5, 13, 14, 14); p.r(shade(roof, 0.2), 6, 14, 12, 1);
  p.r(GLASS, 5, 27, 14, 6); p.r(GLINT, 6, 28, 3, 2);
  p.r(lo, 11, 34, 2, 7);                                                                 // bonnet crease
  p.r(lo, 2, 28, 2, 2); p.r(lo, 20, 28, 2, 2);                                           // mirrors
  p.r('#f8f0b0', 4, 41, 3, 2); p.r('#f8f0b0', 17, 41, 3, 2);
  p.r('#d83c3c', 4, 1, 3, 1); p.r('#d83c3c', 17, 1, 3, 1);
  outline(p.ctx, 0, 0, 24, 44);
}

export function truckSide(p, c) {
  const box = '#e8e4dc';
  p.r(box, 2, 2, 54, 22); p.r('#ffffff', 2, 2, 54, 1); p.r('#b8b4ac', 2, 22, 54, 2);
  for (let x = 6; x < 56; x += 8) p.r('#d4d0c8', x, 3, 1, 19);
  p.r('#2f6aa3', 8, 9, 40, 5); p.r('#f4f4f0', 10, 10, 3, 3); p.r('#f4f4f0', 15, 10, 10, 3);
  // cab
  p.r(c, 58, 6, 19, 18); p.r(shade(c, 0.3), 58, 6, 19, 1); p.r(shade(c, -0.25), 58, 21, 19, 3);
  p.r(GLASS, 66, 8, 9, 7); p.r(GLINT, 67, 8, 2, 2); p.r(shade(c, -0.25), 64, 8, 1, 12);
  p.r('#f8f0b0', 76, 17, 2, 3); p.r('#6a6e76', 76, 21, 3, 3);
  p.r('#3a3a40', 56, 18, 2, 6);
  for (const x of [10, 22, 44, 68]) wheel(p, x, 26);
  outline(p.ctx, 0, 0, 80, 32);
  p.r('rgba(0,0,0,.22)', 4, 30, 74, 2);
}
