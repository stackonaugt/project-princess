import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BG_TEMPLATES, backgroundKeys, fitBackdrop, isPhoneField, templateFor } from '../game/src/systems/battle-backdrop.js';
import { keyForPath } from '../game/src/art/textures.js';

// Battle fields measured in the browser (viewport minus the battle panel).
const PHONES = [[390, 659], [412, 728], [440, 579], [360, 600], [390, 760]];
const DESKTOPS = [[1280, 538], [1920, 908], [1024, 590], [1440, 720]];
const template = name => BG_TEMPLATES[name];
const near = (a, b, tol = 1.5) => Math.abs(a - b) <= tol;

test('phone-shaped fields pick phone art, wide ones desktop art', () => {
  for (const [W, F] of PHONES) assert.ok(isPhoneField(W, F), `${W}x${F} is a phone field`);
  for (const [W, F] of DESKTOPS) assert.ok(!isPhoneField(W, F), `${W}x${F} is a desktop field`);
  assert.ok(!isPhoneField(844, 220), 'a phone on its side uses desktop art');
});

test('file names map to the keys the picker asks for', () => {
  assert.equal(keyForPath('backgrounds/laverton-phone.png'), 'battlebg-laverton-phone');
  assert.equal(keyForPath('backgrounds/laverton-night-phone.png'), 'battlebg-laverton-night-phone');
  assert.equal(templateFor('battlebg-laverton-night-phone'), 'phone');
  assert.equal(templateFor('battlebg-laverton-night'), 'desktop');
  assert.equal(templateFor('battlebg-default'), 'desktop');
});

test('the picker prefers this screen shape, then the other shape, zone before suburb before default', () => {
  const names = ['allen', 'laverton', 'default'];
  const day = backgroundKeys(names, { phone: true });
  assert.deepEqual(day.slice(0, 2), ['battlebg-allen-phone', 'battlebg-allen']);
  assert.deepEqual(day.slice(-2), ['battlebg-default-phone', 'battlebg-default']);
  assert.deepEqual(backgroundKeys(['laverton'], { phone: false }), ['battlebg-laverton', 'battlebg-laverton-phone']);
  assert.deepEqual(backgroundKeys(['laverton'], { phone: true, night: true }),
    ['battlebg-laverton-night-phone', 'battlebg-laverton-phone', 'battlebg-laverton-night', 'battlebg-laverton']);
  // Only a desktop file supplied: a phone still finds it.
  const have = new Set(['battlebg-laverton']);
  assert.equal(backgroundKeys(names, { phone: true }).find(k => have.has(k)), 'battlebg-laverton');
  assert.deepEqual(backgroundKeys([undefined, 'laverton'], {}), ['battlebg-laverton', 'battlebg-laverton-phone']);
});

function checkFit(W, field, shape, iw, ih) {
  const t = template(shape), fit = fitBackdrop({ W, field, iw, ih, template: shape });
  // Feet land exactly where the art's pads are, at any scale.
  assert.ok(near(fit.mineFeet.x, fit.left + t.mine.x / t.w * fit.dw), 'mine x on the pad');
  assert.ok(near(fit.mineFeet.y, fit.top + t.mine.y / t.h * fit.dh), 'mine y on the pad');
  assert.ok(near(fit.foeFeet.x, fit.left + t.foe.x / t.w * fit.dw), 'foe x on the pad');
  assert.ok(near(fit.foeFeet.y, fit.top + t.foe.y / t.h * fit.dh), 'foe y on the pad');
  // Not squashed: one scale both ways.
  assert.ok(Math.abs(fit.dw / iw - fit.dh / ih) < 0.01, 'evenly scaled');
  // Bottom of the art sits on the battle panel.
  assert.ok(near(fit.top + fit.dh, field), 'bottom aligned');
  // Both fighters fully on screen, the foe below the status box area.
  const half = 7 * fit.unit;
  assert.ok(fit.mineFeet.x - half >= -1 && fit.foeFeet.x + half <= W + 1, `${W}x${field} ${shape}: fighters on screen`);
  assert.ok(fit.foeFeet.y - 16 * fit.unit >= Math.min(110, field * 0.2) - 1, `${W}x${field} ${shape}: foe clear of the top box`);
  assert.ok(fit.mineFeet.y <= field && fit.mineFeet.y > fit.foeFeet.y, 'your pet stands in front');
  // A pet is drawn the size the template says.
  assert.ok(near(fit.unit * 16, t.pet / t.h * fit.dh, 0.6) || fit.unit === 12 || fit.unit === 2, 'pet size follows the art');
  // position = feet one unit lower (BattleScene draws feet one unit up)
  assert.ok(near(fit.mine.y - fit.mineFeet.y, fit.unit) && near(fit.foe.y - fit.foeFeet.y, fit.unit));
  return fit;
}

test('phone art on phones covers the field with both pets on their pads', () => {
  for (const [W, F] of PHONES) for (const scale of [1, 2, 4]) {
    const fit = checkFit(W, F, 'phone', 192 * scale, 320 * scale);
    assert.ok(fit.covers, `${W}x${F}: no gaps`);
  }
});

test('desktop art on desktops covers the field with both pets on their pads', () => {
  for (const [W, F] of DESKTOPS) for (const scale of [1, 3]) {
    const fit = checkFit(W, F, 'desktop', 320 * scale, 180 * scale);
    assert.ok(fit.covers, `${W}x${F}: no gaps`);
  }
});

test('the wrong shape still keeps both pets on their pads (art shrinks, edges filled)', () => {
  for (const [W, F] of PHONES) {
    const fit = checkFit(W, F, 'desktop', 320, 180);
    assert.ok(!fit.covers, 'desktop art on a phone shrinks to fit both pads');
  }
  for (const [W, F] of DESKTOPS) checkFit(W, F, 'phone', 192, 320);
  // Pixel art of an odd shape (the exhibition hall, 512 x 320) still works.
  checkFit(1280, 538, 'desktop', 512, 320);
});

test('the guide images and README describe the same layout as the code', () => {
  const readme = readFileSync(new URL('../game/assets/sprites/backgrounds/README.md', import.meta.url), 'utf8');
  for (const [name, t] of Object.entries(BG_TEMPLATES)) {
    assert.ok(readme.includes(`${t.w} x ${t.h}`), `README gives the ${name} size`);
    assert.ok(readme.includes(`${t.mine.x}, ${t.mine.y}`) && readme.includes(`${t.foe.x}, ${t.foe.y}`), `README gives the ${name} feet`);
  }
  for (const file of ['guide-phone.png', 'guide-desktop.png', 'laverton-phone.png', 'laverton.png']) {
    const png = readFileSync(new URL(`../game/assets/sprites/backgrounds/templates/${file}`, import.meta.url));
    const w = png.readUInt32BE(16), h = png.readUInt32BE(20), t = template(file.includes('phone') ? 'phone' : 'desktop');
    assert.deepEqual([w, h], [t.w, t.h], `${file} is ${t.w} x ${t.h}`);
  }
});
