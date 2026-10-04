// Keyboard, on-screen joystick and buttons, merged into one movement vector
// plus a few named actions sent over the bus:
//   input:action  (Space / Enter / E / Z / A button)
//   input:cancel  (Esc / X / B button)
//   input:dex, input:bag, input:menu
//   input:dir     (arrow pressed once; used by menus)

import { bus } from '../bus.js';

const keys = {};
const joy = { x: 0, y: 0, mag: 0, id: null };
let bHeld = false;

const MOVE_KEYS = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] };

export const controls = {
  touchMode: false,

  vector() {
    let x = 0, y = 0;
    for (const [k, [dx, dy]] of Object.entries(MOVE_KEYS)) if (keys[k]) { x += dx; y += dy; }
    x = Math.max(-1, Math.min(1, x)); y = Math.max(-1, Math.min(1, y));
    let run = !!keys.shift || bHeld;
    if (joy.mag > 0) { x = joy.x; y = joy.y; if (joy.mag > 0.92) run = true; }
    const m = Math.hypot(x, y);
    if (m > 1) { x /= m; y /= m; }
    return { x, y, run, analog: joy.mag > 0 ? Math.min(1, joy.mag / 0.6) : 1 };
  },

  release() { for (const k in keys) keys[k] = false; joy.x = joy.y = joy.mag = 0; bHeld = false; hideKnob(); },

  init() {
    window.addEventListener('keydown', e => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const k = e.key.toLowerCase();
      if (k in MOVE_KEYS || k === ' ' || k === 'tab') e.preventDefault();
      keys[k] = true;
      if (k in MOVE_KEYS && !matchMedia('(pointer: coarse)').matches) setTouchMode(false);
      if (e.repeat) return;
      if (k in MOVE_KEYS) bus.emit('input:dir', MOVE_KEYS[k][0], MOVE_KEYS[k][1]);
      if ([' ', 'enter', 'e', 'z'].includes(k)) bus.emit('input:action');
      if (['escape', 'x', 'backspace'].includes(k)) bus.emit('input:cancel');
      if (k === 'p') bus.emit('input:dex');
      if (k === 'i' || k === 'b') bus.emit('input:bag');
      if (k === 'm') bus.emit('input:menu');
    });
    window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
    window.addEventListener('blur', () => this.release());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.release(); });

    // Touch: floating joystick on the left, A and B on the right.
    const zone = document.getElementById('joyZone');
    zone.addEventListener('pointerdown', e => {
      e.preventDefault();
      if (joy.id !== null) return;
      joy.id = e.pointerId; zone.setPointerCapture(e.pointerId);
      const r = zone.getBoundingClientRect();
      joy.cx = e.clientX; joy.cy = e.clientY;
      showKnob(e.clientX - r.left, e.clientY - r.top);
    });
    zone.addEventListener('pointermove', e => {
      if (e.pointerId !== joy.id) return;
      const R = 44;
      let dx = e.clientX - joy.cx, dy = e.clientY - joy.cy;
      const d = Math.hypot(dx, dy);
      if (d > R) { joy.cx += dx * (1 - R / d); joy.cy += dy * (1 - R / d); dx = e.clientX - joy.cx; dy = e.clientY - joy.cy; }
      const mag = Math.min(1, Math.hypot(dx, dy) / R);
      if (mag < 0.18) { joy.x = joy.y = joy.mag = 0; } else { joy.x = dx / R; joy.y = dy / R; joy.mag = mag; }
      const r = zone.getBoundingClientRect();
      moveKnob(joy.cx - r.left, joy.cy - r.top, dx, dy);
    });
    const end = e => { if (e.pointerId !== joy.id) return; joy.id = null; joy.x = joy.y = joy.mag = 0; hideKnob(); };
    zone.addEventListener('pointerup', end); zone.addEventListener('pointercancel', end);

    const press = (id, fn, up) => {
      const el = document.getElementById(id);
      el.addEventListener('pointerdown', e => { e.preventDefault(); el.classList.add('down'); fn(); });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => el.addEventListener(t, () => { el.classList.remove('down'); up && up(); }));
    };
    press('btnA', () => bus.emit('input:action'));
    press('btnB', () => { bHeld = true; bus.emit('input:cancel'); }, () => { bHeld = false; });

    if (matchMedia('(pointer: coarse)').matches) setTouchMode(true);
    window.addEventListener('touchstart', () => setTouchMode(true), { passive: true });
  },
};

function setTouchMode(on) {
  if (controls.touchMode === on) return;
  controls.touchMode = on;
  document.body.classList.toggle('touch', on);
  bus.emit('layout:changed');
}

const base = () => document.getElementById('joyBase');
const knob = () => document.getElementById('joyKnob');
function showKnob(x, y) { const b = base(); b.style.left = x + 'px'; b.style.top = y + 'px'; b.classList.add('on'); knob().style.transform = 'translate(-50%,-50%)'; }
function moveKnob(x, y, dx, dy) { const b = base(); b.style.left = x + 'px'; b.style.top = y + 'px'; knob().style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`; }
function hideKnob() { const b = base(); if (!b) return; b.classList.remove('on'); b.style.left = b.style.top = ''; knob().style.transform = 'translate(-50%,-50%)'; }
