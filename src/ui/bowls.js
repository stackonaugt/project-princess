// Lawn bowls at the Brunswick Bowls Club. Three bowls: aim (the line swings,
// press A to lock it), then strength (the bar fills and empties, press A), then
// watch it roll. Bowls have bias, so they curve in as they slow down. Closest
// to the jack wins. Returns { best } in centimetres (null if all three ended
// up in the ditch).
import { h } from './dom.js';
import { sfx } from '../systems/sfx.js';

const W = 220, H = 360, CM = 8;            // canvas size; centimetres per pixel
const START = { x: W / 2, y: H - 24 }, DECEL = 60, VMAX = 195, BIAS = 34, R = 5;
const GREEN = { x0: 14, y0: 14, x1: W - 14, y1: H - 6 };

export function openBowls(panel, close, { done }) {
  const jack = { x: W / 2 + (Math.random() - 0.5) * 90, y: 60 + Math.random() * 70 };
  const bowls = [];                         // { x, y, cm } where each one stopped
  let phase = 'aim', t0 = performance.now(), aim = 0, power = 0, roll = null, raf = 0, result = null;
  const cv = h('canvas', { width: W, height: H, class: 'bowls-green pix' });
  const g = cv.getContext('2d');
  const tip = h('p', { class: 'center bowls-tip' });
  const info = h('p', { class: 'small center meta' });
  const btn = h('button', { class: 'wood-btn kara-btn', tabindex: '-1', onpointerdown: e => { e.preventDefault(); press(); } }, 'Lock aim');
  const head = h('div', { class: 'm-head' }, h('h2', {}, 'Lawn bowls'), h('button', { class: 'wood-btn small', onclick: close }, 'Close'));
  panel.replaceChildren(head, h('div', { class: 'm-scroll bowls' }, tip, h('div', { class: 'center' }, cv), h('div', { class: 'center' }, btn), info));

  const best = () => bowls.filter(b => b.cm !== null).reduce((m, b) => Math.min(m, b.cm), Infinity);
  const status = () => {
    const left = 3 - bowls.length - (roll ? 1 : 0);
    info.textContent = `Bowls left: ${Math.max(0, left)}${bowls.some(b => b.cm !== null) ? ` · Closest: ${best()} cm` : ''}`;
  };
  const say = text => { tip.textContent = text; };

  const draw = now => {
    // the green: mown stripes, the ditch and the bank
    g.fillStyle = '#c8b890'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#3f8a3e'; g.fillRect(GREEN.x0, GREEN.y0, GREEN.x1 - GREEN.x0, GREEN.y1 - GREEN.y0);
    g.fillStyle = '#4a9a46';
    for (let y = GREEN.y0; y < GREEN.y1; y += 40) g.fillRect(GREEN.x0, y, GREEN.x1 - GREEN.x0, 20);
    g.fillStyle = '#f4f0e6'; g.fillRect(START.x - 12, START.y - 4, 24, 14);   // the mat
    // the jack, the bowls already rolled
    const ball = (x, y, r, c, l) => { g.fillStyle = '#1e1a18'; g.beginPath(); g.arc(x, y, r + 1, 0, 7); g.fill(); g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.fillStyle = l; g.fillRect(x - r / 2, y - r / 2, 2, 2); };
    ball(jack.x, jack.y, 3, '#f4f4f0', '#ffffff');
    bowls.forEach(b => b.cm !== null && ball(b.x, b.y, R, '#2a4ab8', '#7a9af0'));
    if (phase === 'aim' || phase === 'power') {
      const a = phase === 'aim' ? Math.sin((now - t0) / 700) * 0.42 : aim;
      if (phase === 'aim') aim = a;
      g.strokeStyle = 'rgba(255,255,255,0.8)'; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(START.x, START.y); g.lineTo(START.x + Math.sin(a) * 260, START.y - Math.cos(a) * 260); g.stroke(); g.setLineDash([]);
      ball(START.x, START.y, R, '#2a4ab8', '#7a9af0');
    }
    if (phase === 'power') {
      power = 0.5 - Math.cos((now - t0) / 500) / 2;
      g.fillStyle = '#1e1a18'; g.fillRect(W - 12, 40, 8, 120);
      g.fillStyle = power > 0.85 ? '#e2506a' : power > 0.5 ? '#f5c83a' : '#5aa83a'; g.fillRect(W - 11, 159 - power * 118, 6, power * 118);
    }
    if (roll) ball(roll.x, roll.y, R, '#2a4ab8', '#7a9af0');
  };

  let last = performance.now();
  const tick = now => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (roll) {
      const sp = Math.hypot(roll.vx, roll.vy);
      if (sp <= DECEL * dt) stop();
      else {
        const k = (sp - DECEL * dt) / sp; roll.vx *= k; roll.vy *= k;
        roll.vx += BIAS * (1 - sp / VMAX) * dt;          // the bias: it curves in as it slows
        roll.x += roll.vx * dt; roll.y += roll.vy * dt;
        if (roll.x < GREEN.x0 || roll.x > GREEN.x1 || roll.y < GREEN.y0) stop(true);
      }
    }
    draw(now);
    raf = requestAnimationFrame(tick);
  };

  const stop = (ditch = false) => {
    const d = ditch ? null : Math.round(Math.hypot(roll.x - jack.x, roll.y - jack.y) * CM);
    bowls.push({ x: roll.x, y: roll.y, cm: d });
    roll = null;
    if (d === null) { sfx.bump(); say('In the ditch! Crazy Jeff winces.'); }
    else { (d <= 30 ? sfx.found : sfx.blip)(); say(d <= 15 ? `${d} cm! A toucher, nearly. The old blokes clap.` : d <= 50 ? `${d} cm from the jack. Lovely bowl.` : `${d} cm away. Bit heavy, bit light, who knows.`); }
    status();
    if (bowls.length >= 3) return setTimeout(finish, 900);
    setTimeout(() => { phase = 'aim'; t0 = performance.now(); btn.textContent = 'Lock aim'; say('Next bowl. Aim, then strength.'); }, 900);
  };

  const press = () => {
    if (phase === 'aim') { phase = 'power'; t0 = performance.now(); btn.textContent = 'Bowl!'; sfx.select(); say('Now the strength. Not too hard!'); return; }
    if (phase === 'power') {
      phase = 'roll'; btn.textContent = '...';
      const v = 40 + power * (VMAX - 40);
      roll = { x: START.x, y: START.y, vx: Math.sin(aim) * v, vy: -Math.cos(aim) * v };
      sfx.select(); say('Rolling...'); status();
    }
    if (phase === 'done') close();
  };

  const finish = () => {
    phase = 'done';
    const b = best();
    result = { best: Number.isFinite(b) ? b : null };
    btn.textContent = 'Shake hands';
    say(result.best === null ? 'All three in the ditch. Crazy Jeff says even he did that once. In 1974.'
      : result.best <= 15 ? `Closest bowl: ${result.best} cm. Crazy Jeff wants you on the pennant team.`
      : result.best <= 50 ? `Closest bowl: ${result.best} cm. Not bad at all for a first timer.`
      : `Closest bowl: ${result.best} cm. Barefoot bowls is about the vibe, mate.`);
  };

  say('Aim first: press A (or tap) when the line points where you want. Bowls curve to the right as they slow.');
  status();
  raf = requestAnimationFrame(tick);
  return { action: press, cleanup: () => { cancelAnimationFrame(raf); done(result); } };
}
