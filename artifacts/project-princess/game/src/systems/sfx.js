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
if (typeof window !== 'undefined') ['pointerdown', 'keydown', 'touchstart'].forEach(ev => window.addEventListener(ev, () => { unlocked = true; if (state.data.settings.sound) audio(); }, { once: true, passive: true }));

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

// A burst of filtered white noise (splashes, shakes, the evolution flash).
function noise(dur = 0.3, { vol = 0.05, delay = 0, from = 4000, to = 300, q = 0.8 } = {}) {
  if (!state.data.settings.sound) return;
  const a = audio(); if (!a) return;
  const t = a.currentTime + delay, len = Math.max(1, Math.floor(a.sampleRate * dur));
  const buf = a.createBuffer(1, len, a.sampleRate), data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  src.buffer = buf; f.type = 'bandpass'; f.Q.value = q;
  f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(Math.max(40, to), t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(a.destination); src.start(t); src.stop(t + dur + 0.02);
}

// The evolution shimmer: a wobbling tone that climbs for `sec` seconds, with a
// fifth above it, both trembling faster as they rise.
function shimmer(sec) {
  if (!state.data.settings.sound) return;
  const a = audio(); if (!a) return;
  const t = a.currentTime, end = t + sec;
  const out = a.createGain();
  out.gain.setValueAtTime(0.0001, t); out.gain.exponentialRampToValueAtTime(0.05, t + 0.3);
  out.gain.setValueAtTime(0.05, end - 0.08); out.gain.exponentialRampToValueAtTime(0.0001, end);
  out.connect(a.destination);
  const lfo = a.createOscillator(), depth = a.createGain(), trem = a.createGain();
  lfo.frequency.setValueAtTime(6, t); lfo.frequency.exponentialRampToValueAtTime(28, end);
  depth.gain.value = 0.5; trem.gain.value = 0.5;
  lfo.connect(depth).connect(trem.gain); trem.connect(out);
  for (const [type, f0, f1, v] of [['triangle', 330, 1320, 1], ['sine', 495, 1980, 0.5]]) {
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, end);
    g.gain.value = v; o.connect(g).connect(trem); o.start(t); o.stop(end + 0.05);
  }
  lfo.start(t); lfo.stop(end + 0.05);
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
  // Pet move routines
  scoot: () => { tone(110, 0.22, { type: 'sawtooth', vol: 0.035, slide: 40 }); noise(0.22, { vol: 0.03, from: 900, to: 300 }); },
  zoom: () => { tone(220, 0.5, { type: 'sawtooth', vol: 0.025, slide: 700 }); tone(330, 0.4, { type: 'square', vol: 0.012, slide: 600, delay: 0.5 }); },
  snore: () => { tone(120, 0.45, { type: 'sawtooth', vol: 0.03, slide: 40 }); tone(160, 0.35, { type: 'triangle', vol: 0.03, slide: -60, delay: 0.55 }); },
  munch: () => noise(0.07, { vol: 0.05, from: 2500, to: 1200, q: 2 }),
  splash: () => { noise(0.45, { vol: 0.07, from: 5000, to: 400, q: 0.6 }); tone(180, 0.15, { type: 'sine', vol: 0.05, slide: -100 }); },
  shake: () => [0, .08, .16, .24, .32, .4].forEach(d => noise(0.06, { vol: 0.04, from: 3000, to: 1500, q: 1.5, delay: d })),
  shing: () => { tone(2400, 0.12, { type: 'square', vol: 0.02, slide: 900 }); noise(0.1, { vol: 0.025, from: 7000, to: 5000, q: 3 }); },
  // Evolution: a little rising glow, the shimmer while the forms flicker, the burst, then a fanfare.
  evolveStart: () => [392, 523, 659].forEach((f, i) => tone(f, 0.4, { type: 'sine', vol: 0.05, delay: i * 0.12, slide: f * 0.05 })),
  evolveShimmer: (sec = 2.2) => shimmer(sec),
  evolveBurst: () => { noise(0.7, { vol: 0.09, from: 6000, to: 200, q: 0.5 }); tone(160, 0.5, { type: 'sine', vol: 0.09, slide: -110 }); tone(1568, 0.5, { type: 'triangle', vol: 0.04, slide: 400 }); },
  evolveFanfare: () => [[523, 0, .12], [659, .12, .12], [784, .24, .12], [1046, .36, .3], [784, .7, .12], [1046, .84, .6]].forEach(([f, d, len]) => { tone(f, len, { type: 'square', vol: 0.035, delay: d }); tone(f / 2, len, { type: 'triangle', vol: 0.05, delay: d }); tone(f * 1.5, len, { type: 'sine', vol: 0.015, delay: d }); }),
  sad: () => { tone(392, 0.12, { type: 'triangle' }); tone(330, 0.18, { type: 'triangle', delay: 0.12 }); },
};
