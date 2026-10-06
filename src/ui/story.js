// Story screens: the Story app on the Pawphone, chapter title cards, the
// West is Best News reports (with the election vote bar), and the party
// mini-games. Words are in data/story.js.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { bus } from '../bus.js';
import { sfx } from '../systems/sfx.js';
import { CHAPTERS, TRIVIA } from '../data/story.js';
import { objectives, partyReady, chapterNow } from '../systems/story.js';
import { itemIcon, npcIcon } from './images.js';

// The Story app: this chapter's objectives.
export function openStoryApp(panel, close) {
  const s = state.data.story, n = chapterNow();
  const ch = CHAPTERS[n];
  const body = [];
  if (!n) body.push(h('div', { class: 'note' }, h('p', {}, 'The story starts soon. Head outside and find Princess first.')));
  else if (n > 4) body.push(h('div', { class: 'note' }, h('h4', {}, 'The end, for now'), h('p', {}, `Paddy got ${s.party?.votes ?? '?'}% of the vote. ${s.party?.won ? 'He is Mayor of Hobsons Bay!' : 'Not quite enough, this time.'}`), h('p', { class: 'small' }, 'More chapters are planned. Keep playing in the meantime.')));
  else {
    body.push(h('div', { class: 'note' }, h('h4', {}, `Chapter ${n}: ${ch.title}`), ...ch.intro.slice(-1).map(t => h('p', { class: 'small' }, t))));
    if (s.done[n]) body.push(h('div', { class: 'note' }, h('p', {}, `Chapter ${n} is done${s.ch2.deposed && n === 2 ? ' (Paddy was rolled)' : ''}. The next one starts tomorrow morning.`)));
    else body.push(h('div', { class: 'note' }, h('h4', {}, 'To do'), ...objectives(n).map(o => h('p', { class: 'small' + (o.done ? ' meta' : '') }, `${o.done ? '✓' : '○'} ${o.text}`))));
    if (partyReady()) body.push(h('div', { class: 'center' }, h('button', { class: 'wood-btn', onclick: () => { close(); bus.emit('story:party'); } }, 'Throw the party!')));
  }
  const past = Object.keys(s.done).map(Number).filter(k => k < n);
  if (past.length) body.push(h('div', { class: 'note' }, h('h4', {}, 'So far'), ...past.map(k => h('p', { class: 'small meta' }, `Chapter ${k}: ${CHAPTERS[k].title} ✓`))));
  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'Story'), h('button', { class: 'wood-btn small', onclick: close }, 'Close')),
    h('div', { class: 'm-scroll' }, ...body));
}

// A big title card: { kicker, title, lines, button }.
export function openCard(panel, close, { kicker, title, lines, button = 'Continue' }) {
  const go = h('button', { class: 'wood-btn', onclick: close }, button);
  panel.replaceChildren(h('div', { class: 'story-card' },
    kicker ? h('p', { class: 'story-kicker' }, kicker) : null,
    h('h2', { class: 'story-title' }, title),
    ...lines.map(t => h('p', {}, t)),
    h('div', { class: 'center' }, go)));
  setTimeout(() => go.focus(), 50);
  return { action: close };
}

// West is Best News. With `votes`, a bar fills up to Paddy's share, with a line at 50%.
export function openNews(panel, close, { lines, votes = null }) {
  const go = h('button', { class: 'wood-btn' }, 'Continue');
  let shown = votes === null;
  const fill = h('div', { class: 'vote-fill' }), label = h('span', { class: 'vote-label' }, '0%');
  const bar = votes === null ? null : h('div', { class: 'vote-bar' }, fill, h('div', { class: 'vote-half' }), label);
  panel.replaceChildren(h('div', { class: 'news' },
    h('div', { class: 'news-head' }, h('span', { class: 'news-live' }, 'LIVE'), h('b', {}, 'WEST IS BEST NEWS'), h('span', {}, 'Hobsons Bay')),
    h('div', { class: 'news-anchor' }, h('img', { class: 'pix', src: npcIcon('jack'), alt: '' }), h('div', {}, ...lines.map(t => h('p', {}, t)))),
    bar ? h('div', {}, h('p', { class: 'small center' }, 'Paddy McPherson, share of the vote'), bar) : null,
    h('div', { class: 'news-ticker' }, h('span', {}, 'TRAFFIC: Westgate Bridge slow, as is tradition  ·  WEATHER: four seasons, one day  ·  SPORT: the Seagulls are up and about  ·  ')),
    h('div', { class: 'center' }, go)));
  const finish = () => { if (shown) close(); };
  go.onclick = finish;
  if (votes !== null) {
    let v = 0;
    const t = setInterval(() => {
      v = Math.min(votes, v + 1);
      fill.style.width = `${v}%`; label.textContent = `${v}%`;
      fill.classList.toggle('win', v >= 50);
      if (v % 5 === 0) sfx.blip();
      if (v >= votes) { clearInterval(t); shown = true; (votes >= 50 ? sfx.found : sfx.sad)(); }
    }, 45);
  }
  setTimeout(() => go.focus(), 50);
  return { action: finish };
}

// The party mini-games: flip the snags, guest trivia, a dance-off.
// Calls done(score) when finished (0 to 8).
// Enter both clicks a focused button and sends the A action: run once only.
const once = fn => { let used = false; return () => { if (!used) { used = true; fn(); } }; };

export function openParty(panel, close, { guests, done }) {
  let score = 0, stage = 0, action = null, cleanup = () => {};
  const head = h('div', { class: 'm-head' }, h('h2', {}, 'The September Babies Bash'));
  const area = h('div', { class: 'm-scroll party' });
  panel.replaceChildren(head, area);
  const scoreLine = () => h('p', { class: 'small center meta' }, `Party score: ${score}`);
  const next = () => { cleanup(); cleanup = () => {}; action = null; stage++; [snags, trivia, dance, finish][stage - 1](); };

  // 1. Snags on the barbie: flip each one while the marker is in the green.
  const snags = () => {
    let round = 0, pos = 0, dir = 1, raf = 0, lock = 0;
    const marker = h('div', { class: 'fish-marker' }), zone = h('div', { class: 'fish-zone' });
    const bar = h('div', { class: 'fish-bar' }, zone, marker);
    const msg = h('p', { class: 'center' }, 'Round 1: flip the snag when the tongs are in the green!');
    const btn = h('button', { class: 'wood-btn', tabindex: '-1' }, 'Flip!');
    const setZone = () => { const w = 0.26 - round * 0.04, z0 = 0.1 + Math.random() * (0.8 - w); zone.style.left = `${z0 * 100}%`; zone.style.width = `${w * 100}%`; zone.dataset.a = z0; zone.dataset.b = z0 + w; };
    const tick = () => { pos += dir * (0.012 + round * 0.004); if (pos > 1) { pos = 1; dir = -1; } if (pos < 0) { pos = 0; dir = 1; } marker.style.left = `calc(${pos * 100}% - 6px)`; raf = requestAnimationFrame(tick); };
    const flip = () => {
      if (performance.now() < lock) return;
      lock = performance.now() + 700;
      const hit = pos >= +zone.dataset.a && pos <= +zone.dataset.b;
      if (hit) { score++; sfx.heart(); } else sfx.bump();
      round++;
      msg.textContent = (hit ? 'Perfect flip! Onions on the bottom, as is correct.' : 'Burnt it. Somebody will still eat it.') + (round < 3 ? ` Round ${round + 1}...` : '');
      if (round >= 3) { cancelAnimationFrame(raf); const go = once(next); btn.textContent = 'Next game'; btn.onclick = go; action = go; return; }
      setZone();
    };
    btn.onclick = flip; action = flip;
    setZone(); tick();
    cleanup = () => cancelAnimationFrame(raf);
    area.replaceChildren(h('div', { class: 'note' }, h('h4', {}, '1. Snags on the barbie'), h('p', { class: 'small' }, `${guests.length ? guests.length : 'No'} hungry ${guests.length === 1 ? 'guest' : 'guests'} are watching. No pressure.`)), msg, bar, h('div', { class: 'center' }, btn), scoreLine());
  };

  // 2. Guest trivia: three questions about the neighbours.
  const trivia = () => {
    const qs = [...TRIVIA].sort(() => Math.random() - 0.5).slice(0, 3);
    let i = 0;
    const ask = () => {
      const q = qs[i];
      const after = h('p', { class: 'center' });
      const opts = q.a.map((a, k) => h('button', { class: 'wood-btn party-answer', onclick: () => {
        opts.forEach(b => { b.disabled = true; });
        if (k === q.right) { score++; sfx.heart(); after.textContent = 'Correct! The guests are impressed.'; } else { sfx.bump(); after.textContent = `Not quite. It was: ${q.a[q.right]}.`; }
        const go = h('button', { class: 'wood-btn' }, i < 2 ? 'Next question' : 'Next game');
        go.onclick = once(() => { i++; if (i < 3) ask(); else next(); });
        action = () => go.click();
        after.append(h('div', { class: 'center' }, go)); go.focus();
      } }, a));
      action = null;
      area.replaceChildren(h('div', { class: 'note' }, h('h4', {}, `2. Guest trivia (${i + 1}/3)`), h('p', {}, q.q)), ...opts.map(b => h('div', { class: 'center' }, b)), after, scoreLine());
      opts[0].focus();
    };
    ask();
  };

  // 3. Dance-off: watch the moves, then repeat them.
  const dance = () => {
    const ARROWS = { left: '←', up: '↑', down: '↓', right: '→' }, keys = Object.keys(ARROWS);
    let round = 0, seq = [], typed = [], listening = false, timer = 0;
    const show = h('div', { class: 'dance-show' }), msg = h('p', { class: 'center' });
    const pads = keys.map(k => h('button', { class: 'wood-btn dance-pad', onclick: () => press(k) }, ARROWS[k]));
    const press = k => {
      if (!listening) return;
      typed.push(k); sfx.select();
      show.textContent = typed.map(x => ARROWS[x]).join(' ');
      if (typed[typed.length - 1] !== seq[typed.length - 1]) { listening = false; sfx.bump(); msg.textContent = 'You tripped over a toddler. The crowd still cheers.'; return after(); }
      if (typed.length === seq.length) { listening = false; score++; sfx.heart(); msg.textContent = 'Nailed it! Nicholas gives you a nod of respect.'; after(); }
    };
    const after = () => {
      round++;
      const go = h('button', { class: 'wood-btn' }, round < 2 ? 'Next round' : 'Finish');
      go.onclick = once(() => (round < 2 ? play() : next()));
      action = () => go.click();
      msg.append(h('div', { class: 'center' }, go));
    };
    const onKey = e => {
      const k = { ArrowLeft: 'left', ArrowUp: 'up', ArrowDown: 'down', ArrowRight: 'right', a: 'left', w: 'up', s: 'down', d: 'right' }[e.key];
      if (k && listening) { e.preventDefault(); e.stopPropagation(); press(k); }
    };
    window.addEventListener('keydown', onKey, true);
    const play = () => {
      seq = Array.from({ length: 4 + round }, () => keys[Math.floor(Math.random() * 4)]);
      typed = []; listening = false; action = null;
      msg.textContent = `Round ${round + 1}: watch the moves...`;
      let i = 0;
      show.textContent = '';
      clearInterval(timer);
      timer = setInterval(() => {
        if (i < seq.length) { show.textContent = ARROWS[seq[i]]; sfx.blip(); i++; return; }
        clearInterval(timer); show.textContent = '?'; listening = true; msg.textContent = 'Your turn! Repeat the moves.';
      }, 650);
    };
    cleanup = () => { clearInterval(timer); window.removeEventListener('keydown', onKey, true); };
    area.replaceChildren(h('div', { class: 'note' }, h('h4', {}, '3. Dance-off'), h('p', { class: 'small' }, 'Watch the moves, then repeat them with the arrows.')), show, msg, h('div', { class: 'dance-pads' }, ...pads), scoreLine());
    play();
  };

  const finish = () => {
    const go = h('button', { class: 'wood-btn' }, 'See how it went');
    go.onclick = close; action = close;
    area.replaceChildren(h('div', { class: 'note center' }, h('h4', {}, 'What a night!'), h('p', {}, `Party score: ${score} out of 8.`), h('p', { class: 'small' }, score >= 6 ? 'People will be talking about this one for years.' : score >= 3 ? 'A solid party. Nobody fell in the pool. Well, one person.' : 'Chaotic, but everyone had fun. Mostly the twins.')), h('div', { class: 'center' }, go));
    go.focus();
  };

  const start = h('button', { class: 'wood-btn' }, 'Let\'s go!');
  start.onclick = action = once(next);
  area.replaceChildren(h('div', { class: 'note' }, h('h4', {}, `${guests.length} ${guests.length === 1 ? 'guest' : 'guests'} turned up!`),
    h('div', { class: 'party-guests' }, ...guests.map(id => h('img', { class: 'pix', src: npcIcon(id), alt: id }))),
    h('p', { class: 'small' }, 'Three party games. Do well and the whole town hears about it.'),
    h('p', { class: 'small' }, h('img', { class: 'pix', src: itemIcon('bunting', 32), alt: '' }), ' The bunting is up, the drinks are cold and the twins are wearing party hats.')),
    h('div', { class: 'center' }, start));
  start.focus();
  return { action: () => action?.(), cleanup: () => { cleanup(); done(score); } };
}

