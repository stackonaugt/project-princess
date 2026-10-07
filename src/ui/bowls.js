// Lawn bowls at the Brunswick Bowls Club. Three bowls: aim (the line swings,
// press A to lock it), then strength (the bar fills and empties, press A), then
// watch it roll. Bowls have bias, so they curve in as they slow down. Closest
// to the jack wins. Returns { best } in centimetres (null if all three ended
// up in the ditch). In bowls mode the old blokes have already bowled: beat
// their closest (`rival`) to count a win. With { mode: 'ducks' } it is the
// same game reskinned: toss stale bread to a paddling duck, no bias.
import { h } from './dom.js';
import { sfx } from '../systems/sfx.js';

const W = 220, H = 360, CM = 8;            // canvas size; centimetres per pixel
const START = { x: W / 2, y: H - 24 }, DECEL = 60, VMAX = 195, BIAS = 34, R = 5;
const GREEN = { x0: 14, y0: 14, x1: W - 14, y1: H - 6 };

export function openBowls(panel, close, { done, mode = 'bowls' }) {
  const ducks = mode === 'ducks', bias = ducks ? 0 : BIAS;
  const rival = ducks ? null : Math.round(18 + Math.random() * 55);
  const jack = { x: W / 2 + (Math.random() - 0.5) * 90, y: 60 + Math.random() * 70 };
  const bowls = [];                         // { x, y, cm } where each one stopped
  let phase = 'aim', t0 = performance.now(), aim = 0, power = 0, roll = null, raf = 0, result = null;
  const cv = h('canvas', { width: W, height: H, class: 'bowls-green pix' });
  const g = cv.getContext('2d');
  const tip = h('p', { class: 'center bowls-tip' });
  const info = h('p', { class: 'small center meta' });
  const btn = h('button', { class: 'wood-btn kara-btn', tabindex: '-1', onpointerdown: e => { e.preventDefault(); press(); } }, 'Lock aim');
  const head = h('div', { class: 'm-head' }, h('h2', {}, ducks ? 'Feed the ducks' : 'Lawn bowls'), h('button', { class: 'wood-btn small', onclick: close }, 'Close'));
  panel.replaceChildren(head, h('div', { class: 'm-scroll bowls' }, tip, h('div', { class: 'center' }, cv), h('div', { class: 'center' }, btn), info));

  const best = () => bowls.filter(b => b.cm !== null).reduce((m, b) => Math.min(m, b.cm), Infinity);
  const status = () => {
    const left = 3 - bowls.length - (roll ? 1 : 0);
    info.textContent = `${ducks ? 'Bread' : 'Bowls'} left: ${Math.max(0, left)}${bowls.some(b => b.cm !== null) ? ` · Closest: ${best()} cm` : ''}${rival ? ` · To beat: ${rival} cm` : ''}`;
  };
  const say = text => { tip.textContent = text; };

  const draw = now => {
    const ball = (x, y, r, c, l) => { g.fillStyle = '#1e1a18'; g.beginPath(); g.arc(x, y, r + 1, 0, 7); g.fill(); g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.fillStyle = l; g.fillRect(x - r / 2, y - r / 2, 2, 2); };
    const crumb = (x, y) => { g.fillStyle = '#1e1a18'; g.fillRect(x - 4, y - 3, 8, 6); g.fillStyle = '#d8a860'; g.fillRect(x - 3, y - 2, 6, 4); g.fillStyle = '#f0d8a0'; g.fillRect(x - 2, y - 1, 4, 2); };
    const bowl = (x, y) => ducks ? crumb(x, y) : ball(x, y, R, '#2a4ab8', '#7a9af0');
    if (ducks) {
      // the pond: reeds round the edge, ripples, a duck paddling about
      g.fillStyle = '#6a8a3a'; g.fillRect(0, 0, W, H);
      g.fillStyle = '#3a78a8'; g.fillRect(GREEN.x0, GREEN.y0, GREEN.x1 - GREEN.x0, GREEN.y1 - GREEN.y0);
      g.fillStyle = '#5a98c8';
      for (let i = 0; i < 18; i++) { const rx = GREEN.x0 + (i * 53) % (GREEN.x1 - GREEN.x0 - 14), ry = GREEN.y0 + ((i * 97 + now / 40) % (GREEN.y1 - GREEN.y0 - 4)); g.fillRect(rx, ry, 10, 1); }
      g.fillStyle = '#8a6a3a'; g.fillRect(START.x - 14, START.y - 4, 28, 14);   // the jetty
      jack.x += Math.sin(now / 900) * 0.15;
      // a mallard, drawn at double size so it reads on a phone
      const q = (c, x, y, w, h) => { g.fillStyle = c; g.fillRect(jack.x + x * 2, jack.y + y * 2, w * 2, h * 2); };
      q('#1e1a18', -4, -5, 9, 6); q('#8a6a48', -3, -2, 7, 3); q('#a88a68', -3, -2, 5, 1);
      q('#2a7a4a', 0, -4, 3, 3); q('#f0b030', 3, -3, 2, 1); q('#ffffff', 0, -1, 3, 1);
      g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(jack.x - 10, jack.y + 4, 20, 1);
    } else {
      // the green: mown stripes, the ditch and the bank
      g.fillStyle = '#c8b890'; g.fillRect(0, 0, W, H);
      g.fillStyle = '#3f8a3e'; g.fillRect(GREEN.x0, GREEN.y0, GREEN.x1 - GREEN.x0, GREEN.y1 - GREEN.y0);
      g.fillStyle = '#4a9a46';
      for (let y = GREEN.y0; y < GREEN.y1; y += 40) g.fillRect(GREEN.x0, y, GREEN.x1 - GREEN.x0, 20);
      g.fillStyle = '#f4f0e6'; g.fillRect(START.x - 12, START.y - 4, 24, 14);   // the mat
      ball(jack.x, jack.y, 3, '#f4f4f0', '#ffffff');
    }
    bowls.forEach(b => b.cm !== null && bowl(b.x, b.y));
    if (phase === 'aim' || phase === 'power') {
      const a = phase === 'aim' ? Math.sin((now - t0) / 700) * 0.42 : aim;
      if (phase === 'aim') aim = a;
      g.strokeStyle = 'rgba(255,255,255,0.8)'; g.setLineDash([4, 4]); g.beginPath(); g.moveTo(START.x, START.y); g.lineTo(START.x + Math.sin(a) * 260, START.y - Math.cos(a) * 260); g.stroke(); g.setLineDash([]);
      bowl(START.x, START.y);
    }
    if (phase === 'power') {
      power = 0.5 - Math.cos((now - t0) / 500) / 2;
      g.fillStyle = '#1e1a18'; g.fillRect(W - 12, 40, 8, 120);
      g.fillStyle = power > 0.85 ? '#e2506a' : power > 0.5 ? '#f5c83a' : '#5aa83a'; g.fillRect(W - 11, 159 - power * 118, 6, power * 118);
    }
    if (roll) bowl(roll.x, roll.y);
  };

  let last = performance.now();
  const tick = now => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (roll) {
      const sp = Math.hypot(roll.vx, roll.vy);
      if (sp <= DECEL * dt) stop();
      else {
        const k = (sp - DECEL * dt) / sp; roll.vx *= k; roll.vy *= k;
        roll.vx += bias * (1 - sp / VMAX) * dt;          // the bias: it curves in as it slows
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
    if (d === null) { sfx.bump(); say(ducks ? 'Into the reeds. A rat gets that one.' : 'In the ditch! Crazy Jeff winces.'); }
    else if (ducks) { (d <= 40 ? sfx.found : sfx.blip)(); say(d <= 40 ? `${d} cm! Right under its beak. Gobbled.` : d <= 60 ? `${d} cm. The duck paddles over, eventually.` : `${d} cm. A seagull swoops in and nicks it.`); }
    else { (d <= 30 ? sfx.found : sfx.blip)(); say(d <= 15 ? `${d} cm! A toucher, nearly. The old blokes clap.` : d <= 50 ? `${d} cm from the jack. Lovely bowl.` : `${d} cm away. Bit heavy, bit light, who knows.`); }
    status();
    if (bowls.length >= 3) return setTimeout(finish, 900);
    setTimeout(() => { phase = 'aim'; t0 = performance.now(); btn.textContent = 'Lock aim'; say(ducks ? 'Next bit of bread. Aim, then strength.' : 'Next bowl. Aim, then strength.'); }, 900);
  };

  const press = () => {
    if (phase === 'aim') { phase = 'power'; t0 = performance.now(); btn.textContent = ducks ? 'Toss!' : 'Bowl!'; sfx.select(); say('Now the strength. Not too hard!'); return; }
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
    result = { best: Number.isFinite(b) ? b : null, rival };
    btn.textContent = ducks ? 'Done' : 'Shake hands';
    if (ducks) return say(result.best === null ? 'Not one crumb reached a duck. The seagulls are thrilled.'
      : result.best <= 40 ? `Closest crumb: ${result.best} cm. The ducks are delighted. One quacks at you, very pointedly.`
      : `Closest crumb: ${result.best} cm. The ducks get there in the end.`);
    if (result.best !== null && result.best < rival) return say(`Closest bowl: ${result.best} cm, inside Crazy Jeff's ${rival}. You win the end! The old blokes are stunned.`);
    say(result.best === null ? 'All three in the ditch. Crazy Jeff says even he did that once. In 1974.'
      : result.best <= 15 ? `Closest bowl: ${result.best} cm. Crazy Jeff wants you on the pennant team.`
      : result.best <= 50 ? `Closest bowl: ${result.best} cm. Not bad at all for a first timer.`
      : `Closest bowl: ${result.best} cm. Barefoot bowls is about the vibe, mate.`);
  };

  say(ducks ? 'Toss the bread close to the duck. Press A (or tap) to aim, then again for strength.'
    : `The old blokes are ${rival} cm off the jack. Get closer to win. Aim first: press A when the line points where you want. Bowls curve right as they slow.`);
  status();
  raf = requestAnimationFrame(tick);
  return { action: press, cleanup: () => { cancelAnimationFrame(raf); done(result); } };
}
