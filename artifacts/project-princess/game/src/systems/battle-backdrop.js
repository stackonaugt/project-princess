// Supplied battle background PNGs: which file a battle uses and where the
// fighters stand on it. Pure maths (no Phaser) so it can be tested in Node.
//
// Two template shapes, both in assets/sprites/backgrounds/templates/:
//   desktop  320 x 180 (landscape), saved as <name>.png
//   phone    192 x 320 (portrait),  saved as <name>-phone.png
// Night versions add -night before -phone: <name>-night.png, <name>-night-phone.png.
// Any resolution of the same shape works (640 x 360, 384 x 640...): the
// anchors below are fractions of the image.

// Where the fighters' feet touch the ground, in template pixels, and how tall
// a standard pet (16 game pixels) is drawn on that template. `boxes` are the HTML status
// boxes at a typical screen of that shape (for the guide images only).
export const BG_TEMPLATES = {
  desktop: {
    w: 320, h: 180,
    mine: { x: 90, y: 154 }, foe: { x: 224, y: 110 },
    pet: 28,
    // Guide images: [x, y, w, h] where the status boxes usually sit, and how
    // much of the top is often out of view (1280 x 720 crops about 45).
    guide: { foeBox: [3, 31, 76, 37], mineBox: [242, 150, 76, 29], hiddenTop: 45, sides: 0 },
  },
  phone: {
    w: 192, h: 320,
    mine: { x: 48, y: 293 }, foe: { x: 140, y: 181 },
    pet: 46,
    // Measured at 390 x 844 and 412 x 915: the top 44 hides while the move
    // menu is open, and narrow phones lose up to 10 off each side.
    guide: { foeBox: [6, 6, 88, 76], mineBox: [97, 267, 88, 47], hiddenTop: 44, sides: 10 },
  },
};

// A battle field narrower than this (width / height) uses phone art.
// Desktop art is 1.78, phone art 0.6; this sits between them.
export const PHONE_ASPECT = 1.1;
export const isPhoneField = (W, field) => W / Math.max(1, field) < PHONE_ASPECT;

// Texture keys to try, best first. Each name (zone, suburb, default) is tried
// in turn; for each, the art drawn for this screen shape comes first, then the
// other shape, night versions before day ones after dark.
export function backgroundKeys(names, { night = false, phone = false } = {}) {
  const shapes = phone ? ['-phone', ''] : ['', '-phone'];
  return names.filter(Boolean).flatMap(name => shapes.flatMap(shape =>
    night ? [`battlebg-${name}-night${shape}`, `battlebg-${name}${shape}`] : [`battlebg-${name}${shape}`]));
}
export const templateFor = key => (/-phone$/.test(key) ? 'phone' : 'desktop');

// Fit an image of iw x ih (made from `template`) to a W x field battle field.
// The art covers the field where it can (scaled evenly, never squashed),
// bottom aligned, centred between the two pads; only the sky and the far
// sides are cropped. If covering would push a pad off screen or under the
// status boxes, the art is shrunk until both pads fit and the leftover edges
// are filled by stretching the art's edge pixels (see BattleScene).
// Fighters always stand exactly on the pads: mineFeet/foeFeet are the feet on
// screen; mine/foe are BattleScene's positions (it draws feet one unit up).
export function fitBackdrop({ W, field, iw, ih, template = 'desktop' }) {
  const t = BG_TEMPLATES[template] || BG_TEMPLATES.desktop;
  const fx = a => a.x / t.w, fy = a => a.y / t.h;
  const cover = Math.max(W / iw, field / ih), contain = Math.min(W / iw, field / ih);
  const place = k => {
    const dw = iw * k, dh = ih * k;
    const mid = (fx(t.mine) + fx(t.foe)) / 2 * dw;
    // Centre the pads, but never leave a gap at the sides when the art is wide enough.
    const left = dw >= W ? Math.min(0, Math.max(W - dw, W / 2 - mid)) : (W - dw) / 2;
    const top = field - dh;
    const unit = Math.max(2, Math.min(12, t.pet / t.h * dh / 16));
    const mineFeet = { x: left + fx(t.mine) * dw, y: top + fy(t.mine) * dh };
    const foeFeet = { x: left + fx(t.foe) * dw, y: top + fy(t.foe) * dh };
    return { k, left, top, dw, dh, unit, mineFeet, foeFeet, mine: { x: mineFeet.x, y: mineFeet.y + unit }, foe: { x: foeFeet.x, y: foeFeet.y + unit } };
  };
  // Room a pad needs: a pet and a bit each side, the foe's whole body plus a
  // status box (about 110 screen pixels) above it.
  const fits = p => p.mineFeet.x >= 9 * p.unit && p.foeFeet.x <= W - 9 * p.unit && p.foeFeet.y >= 16 * p.unit + Math.min(110, field * 0.2) && p.mineFeet.y <= field;
  let fit = place(cover);
  for (let i = 1; i <= 20 && !fits(fit); i++) fit = place(cover + (contain - cover) * i / 20);
  const r = Math.round;
  return {
    left: r(fit.left), top: r(fit.top), dw: r(fit.dw), dh: r(fit.dh), k: fit.k, unit: fit.unit,
    mine: { x: r(fit.mine.x), y: r(fit.mine.y) }, foe: { x: r(fit.foe.x), y: r(fit.foe.y) },
    mineFeet: { x: r(fit.mineFeet.x), y: r(fit.mineFeet.y) }, foeFeet: { x: r(fit.foeFeet.x), y: r(fit.foeFeet.y) },
    covers: fit.left <= 0.5 && fit.top <= 0.5 && fit.left + fit.dw >= W - 0.5,
  };
}
