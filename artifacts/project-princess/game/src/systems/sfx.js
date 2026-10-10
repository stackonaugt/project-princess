// Tiny synthesised sound effects (no audio files needed).
import { state } from './state.js';

let ctx = null, unlocked = false;
function audio() {
  if (!unlocked) return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
// Browsers only allow sound after the first tap or key press.
['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.addEventListener(ev, () => { unlocked = true; if (state.data.settings.sound) audio(); }, { once: true, passive: true }));

function tone(freq, dur = 0.08, { type = 'square', vol = 0.06, slide = 0, delay = 0 } = {}) {
  if (!state.data.settings.sound) return;
  const a = audio(); if (!a) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.linearRampToValueAtTime(freq + slide, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
}

export const sfx = {
  blip: () => tone(660 + Math.random() * 60, 0.03, { vol: 0.025 }),
  select: () => tone(880, 0.05, { vol: 0.04 }),
  open: () => { tone(520, 0.06); tone(780, 0.08, { delay: 0.06 }); },
  close: () => { tone(780, 0.06); tone(520, 0.08, { delay: 0.06 }); },
  pickup: () => { tone(660, 0.06); tone(990, 0.1, { delay: 0.07 }); },
  heart: () => { tone(784, 0.08, { type: 'triangle', vol: 0.08 }); tone(1046, 0.14, { type: 'triangle', vol: 0.08, delay: 0.09 }); },
  found: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.14, { type: 'triangle', vol: 0.08, delay: i * 0.11 })),
  bump: () => tone(140, 0.12, { type: 'sawtooth', vol: 0.05, slide: -60 }),
  yap: () => { tone(900, 0.05, { slide: 300 }); tone(950, 0.05, { slide: 300, delay: 0.12 }); },
  ding: () => { tone(1320, 0.25, { type: 'triangle', vol: 0.05 }); tone(1320, 0.25, { type: 'triangle', vol: 0.05, delay: 0.3 }); },
  bell: () => { tone(2100, 0.12, { type: 'sine', vol: 0.05 }); tone(2100, 0.18, { type: 'sine', vol: 0.04, delay: 0.14 }); },
  honk: () => { tone(330, 0.18, { type: 'square', vol: 0.04 }); tone(415, 0.18, { type: 'square', vol: 0.03 }); },
  myki: () => { tone(1568, 0.07, { vol: 0.05 }); tone(1568, 0.07, { vol: 0.05, delay: 0.12 }); },
  quack: () => tone(480, 0.09, { type: 'sawtooth', vol: 0.04, slide: -200 }),
  // Battles
  encounter: () => [880, 660, 880, 660, 1046].forEach((f, i) => tone(f, 0.06, { type: 'square', vol: 0.03, delay: i * 0.07 })),
  hit: () => tone(180, 0.1, { type: 'square', vol: 0.06, slide: -90 }),
  superHit: () => { tone(220, 0.08, { type: 'square', vol: 0.07, slide: -120 }); tone(110, 0.14, { type: 'sawtooth', vol: 0.05, delay: 0.06, slide: -50 }); },
  weakHit: () => tone(260, 0.06, { type: 'triangle', vol: 0.05, slide: -40 }),
  whoosh: () => tone(300, 0.18, { type: 'sawtooth', vol: 0.025, slide: 500 }),
  healUp: () => [523, 659, 784].forEach((f, i) => tone(f, 0.08, { type: 'triangle', vol: 0.06, delay: i * 0.06 })),
  statDown: () => tone(600, 0.2, { type: 'triangle', vol: 0.05, slide: -300 }),
  statUp: () => tone(400, 0.2, { type: 'triangle', vol: 0.05, slide: 400 }),
  faint: () => tone(500, 0.4, { type: 'triangle', vol: 0.06, slide: -380 }),
  levelUp: () => [523, 659, 784, 659, 784, 1046].forEach((f, i) => tone(f, 0.09, { type: 'square', vol: 0.03, delay: i * 0.08 })),
  win: () => [784, 784, 784, 1046].forEach((f, i) => tone(f, i === 3 ? 0.3 : 0.08, { type: 'square', vol: 0.035, delay: i * 0.1 })),
  // A little brass fanfare for a finished bake (layered saw and square, like a trumpet).
  trumpet: () => [[523, 0], [523, .12], [523, .24], [659, .36], [784, .56], [659, .78], [784, .9]].forEach(([f, d], i) => { tone(f, i === 6 ? .5 : .1, { type: 'sawtooth', vol: .035, delay: d }); tone(f * 2, i === 6 ? .5 : .1, { type: 'square', vol: .012, delay: d }); }),
  sad: () => { tone(392, 0.12, { type: 'triangle' }); tone(330, 0.18, { type: 'triangle', delay: 0.12 }); },
};
