// Story screens: the Story app on the Pawphone, chapter title cards, the
// West is Best News reports (with the election vote bar), and the party
// mini-games. Words are in data/story.js.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { bus } from '../bus.js';
import { sfx } from '../systems/sfx.js';
import { CHAPTERS, TRIVIA, GOALS } from '../data/story.js';
import { ZONES, npcZone } from '../data/regions.js';
import { objectives, partyReady, chapterNow } from '../systems/story.js';
import { itemIcon, npcIcon } from './images.js';
import { ITEMS } from '../data/items.js';
import { NPCS } from '../data/npcs.js';
import { FRIENDS } from '../data/friends.js';

// The To Do app: the story's jobs, and today's requests from friends.
let todoTab = 'todo';
export function openStoryApp(panel, close) {
  const s = state.data.story, n = chapterNow();
  const body = [];
  if (todoTab === 'todo') {
    if (!n) body.push(todoNote('Find Princess', [{ text: 'She has got out again. Head outside and find her on Allen St.', done: false }]));
    else if (n > 4) body.push(h('div', { class: 'note' }, h('h4', {}, 'All done, for now'), h('p', {}, `Paddy got ${s.party?.votes ?? '?'}% of the vote. ${s.party?.won ? 'He is Mayor of Hobsons Bay!' : 'Not quite enough, this time.'}`), h('p', { class: 'small' }, 'More is planned. Keep playing in the meantime.')));
    else if (s.done[n]) body.push(h('div', { class: 'note' }, h('h4', {}, GOALS[n] + ' ✓'), h('p', { class: 'small' }, s.ch2.deposed && n === 2 ? 'Paddy was rolled. Something new comes up tomorrow morning.' : 'Done! Something new comes up tomorrow morning.')));
    else body.push(todoNote(GOALS[n], objectives(n)));
    if (partyReady()) body.push(h('div', { class: 'center' }, h('button', { class: 'wood-btn', onclick: () => { close(); bus.emit('story:party'); } }, 'Throw the party!')));
    const past = Object.keys(s.done).map(Number).filter(k => k < n || (k === n && n > 4));
    if (past.length) body.push(h('div', { class: 'note' }, h('h4', {}, 'Done'), ...past.map(k => h('p', { class: 'todo-item done' }, h('span', { class: 'todo-box' }, '✓'), GOALS[k]))));
  } else {
    const reqs = state.todaysRequests();
    body.push(h('p', { class: 'small' }, 'Friends ask for things each morning. Give them what they want as their gift for the day.'));
    body.push(...reqs.map(q => h('div', { class: 'friend-card note' },
      h('div', { class: 'gear-row' },
        h('img', { class: 'pix', src: npcIcon(q.who), alt: '', width: 32, height: 32 }),
        h('div', {}, h('b', {}, NPCS[q.who].name), h('p', { class: 'small' }, q.text),
          h('p', { class: 'meta small' }, q.done ? 'Done ✓' : `Reward: $${q.money} and extra friendship. Usually at ${ZONES[npcZone(q.who)]?.name || 'around town'}. You have ${state.count(q.item)}.`)),
        h('img', { class: 'pix', src: itemIcon(q.item, 32), alt: ITEMS[q.item].name, width: 32, height: 32 })))));
    if (!reqs.length) body.push(h('p', { class: 'center' }, 'No requests today. Make some friends around town first: chat to people until they like you.'));
  }
  const tab = (id, label) => h('button', { class: 'tab' + (todoTab === id ? ' on' : ''), onclick: () => { todoTab = id; sfx.select(); openStoryApp(panel, close); } }, label);
  panel.replaceChildren(
    h('div', { class: 'm-head' }, h('h2', {}, 'To Do'), h('button', { class: 'wood-btn small', onclick: close }, 'Close')),
    h('div', { class: 'tabs' }, tab('todo', 'My To Do List'), tab('requests', 'Requests')),
    h('div', { class: 'm-scroll' }, ...body));
}
const todoNote = (title, list) => h('div', { class: 'note' }, h('h4', {}, title),
  ...list.map(o => h('p', { class: 'todo-item' + (o.done ? ' done' : '') }, h('span', { class: 'todo-box' }, o.done ? '✓' : ''), o.text)));

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

// The morning paper (Chapter 1): { masthead, date, headline, lines, more }.
export function openPaper(panel, close, { masthead, date, headline, lines, more }) {
  const go = h('button', { class: 'wood-btn', onclick: close }, 'Put the paper down');
  panel.replaceChildren(h('div', { class: 'paper' },
    h('div', { class: 'paper-mast' }, masthead),
    h('div', { class: 'paper-date' }, date),
    h('h2', { class: 'paper-head' }, headline),
    h('div', { class: 'paper-body' }, ...lines.map(t => h('p', {}, t))),
    more ? h('p', { class: 'paper-more' }, more) : null,
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

// The party mini-games: the dance floor (rhythm), behind the bar, guest trivia.
// Calls done(score) when finished (0 to 8).
// Enter both clicks a focused button and sends the A action: run once only.
const once = fn => { let used = false; return () => { if (!used) { used = true; fn(); } }; };

export function openParty(panel, close, { guests, done }) {
  let score = 0, stage = 0, action = null, cleanup = () => {};
  const head = h('div', { class: 'm-head' }, h('h2', {}, 'The September Babies Bash'));
  const area = h('div', { class: 'm-scroll party' });
  panel.replaceChildren(head, area);
  const scoreLine = () => h('p', { class: 'small center meta' }, `Party score: ${score}`);
  const next = () => { cleanup(); cleanup = () => {}; action = null; stage++; [rhythm, bar, trivia, finish][stage - 1](); };

  // 1. Rhythm: notes fall down four lanes; hit each one as it crosses the line.
  const rhythm = () => {
    const ARROWS = ['←', '↓', '↑', '→'], KEYS = { ArrowLeft: 0, ArrowDown: 1, ArrowUp: 2, ArrowRight: 3, a: 0, s: 1, w: 2, d: 3 };
    const SPEED = 0.42, LINE = 0.85, WINDOW = 0.07;            // screen heights per second, where the line is, how close counts
    const notes = []; let t = 1.2;
    for (let i = 0; i < 18; i++) { notes.push({ lane: Math.floor(Math.random() * 4), at: t, el: null, done: false }); t += [0.45, 0.6, 0.9][i % 3]; }
    let hits = 0, raf = 0, t0 = 0, over = false;
    const field = h('div', { class: 'rhythm' }, ...ARROWS.map(() => h('div', { class: 'rhythm-lane' })), h('div', { class: 'rhythm-line' }));
    const msg = h('p', { class: 'center' }, 'Hot Potato (Laverton club mix). Hit each arrow as it crosses the line!');
    const lanes = [...field.querySelectorAll('.rhythm-lane')];
    notes.forEach(n => { n.el = h('div', { class: 'rhythm-note' }, ARROWS[n.lane]); lanes[n.lane].append(n.el); });
    const y = (n, now) => LINE - (n.at - now) * SPEED;
    const hit = lane => {
      if (over) return;
      const now = (performance.now() - t0) / 1000;
      const n = notes.find(n => !n.done && n.lane === lane && Math.abs(y(n, now) - LINE) < WINDOW);
      pads[lane].classList.add('on'); setTimeout(() => pads[lane].classList.remove('on'), 90);
      if (n) { n.done = true; hits++; n.el.classList.add('hit'); sfx.select(); } else sfx.bump();
    };
    const pads = ARROWS.map((a, i) => h('button', { class: 'wood-btn dance-pad', tabindex: '-1', onpointerdown: e => { e.preventDefault(); hit(i); } }, a));
    const onKey = e => { const k = KEYS[e.key]; if (k !== undefined && !over) { e.preventDefault(); e.stopPropagation(); hit(k); } };
    window.addEventListener('keydown', onKey, true);
    const tick = () => {
      const now = (performance.now() - t0) / 1000;
      for (const n of notes) {
        const ny = y(n, now);
        n.el.style.top = `${ny * 100}%`;
        n.el.style.display = ny < -0.1 || ny > 1.05 ? 'none' : '';
        if (!n.done && ny > LINE + WINDOW) { n.done = true; n.el.classList.add('miss'); }
      }
      if (notes.every(n => n.done) && now > notes[notes.length - 1].at + 0.6) return end();
      raf = requestAnimationFrame(tick);
    };
    const end = () => {
      over = true;
      const pts = hits >= 15 ? 3 : hits >= 11 ? 2 : hits >= 6 ? 1 : 0;
      score += pts; (pts >= 2 ? sfx.heart : sfx.bump)();
      msg.textContent = `${hits} of ${notes.length} notes! ${pts >= 3 ? 'The whole backyard is dancing. Nicholas does the worm.' : pts >= 2 ? 'Solid moves. Paddy dad-dances in approval.' : 'The twins love it anyway. They love everything.'}`;
      const go = h('button', { class: 'wood-btn' }, 'Next game');
      go.onclick = action = once(next);
      msg.append(h('div', { class: 'center' }, go)); go.focus();
    };
    cleanup = () => { cancelAnimationFrame(raf); window.removeEventListener('keydown', onKey, true); };
    area.replaceChildren(h('div', { class: 'note' }, h('h4', {}, '1. Dance floor'), h('p', { class: 'small' }, 'Arrow keys (or tap the pads) as each arrow reaches the line.')), field, h('div', { class: 'dance-pads' }, ...pads), msg, scoreLine());
    t0 = performance.now(); tick();
  };

  // 2. Behind the bar: each guest orders a drink. Pick it, then slide it down
  // the bar and stop it in front of them.
  const bar = () => {
    const names = guests.length ? guests.map(id => NPCS[id]?.name || id) : ['Nanna Trish', 'Pop Gordon', 'a neighbour'];
    const drinkIds = Object.keys(ITEMS).filter(id => ITEMS[id].drink);
    const orders = [0, 1, 2].map(i => {
      const who = guests.length ? guests[i % guests.length] : null;
      const fav = who && (FRIENDS[who]?.loves || []).find(x => ITEMS[x]?.drink);
      return { name: names[i % names.length], drink: fav || drinkIds[Math.floor(Math.random() * drinkIds.length)] };
    });
    let i = 0, raf = 0;
    const serve = () => {
      const o = orders[i];
      const opts = [o.drink, ...drinkIds.filter(x => x !== o.drink).sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
      const msg = h('p', { class: 'center' }, `${o.name}: "Could I grab a ${ITEMS[o.drink].name}, please?"`);
      let chosen = null;
      const glass = h('div', { class: 'bar-glass' }), target = h('div', { class: 'bar-target' }, o.name.split(' ')[0]);
      const counter = h('div', { class: 'bar-top' }, target, glass);
      const z0 = 0.62 + Math.random() * 0.2;
      target.style.left = `${z0 * 100}%`;
      let pos = 0, vel = 0, sliding = false, power = 0, pdir = 1;
      const meter = h('div', { class: 'bar-power' }, h('div', { class: 'bar-power-fill' }));
      const slide = h('button', { class: 'wood-btn', tabindex: '-1', disabled: true }, 'Slide!');
      const pickBtns = opts.map(id => h('button', { class: 'wood-btn party-answer bar-pick', onclick: () => {
        chosen = id; pickBtns.forEach(b => b.classList.toggle('on', b === pickBtns[opts.indexOf(id)]));
        glass.replaceChildren(h('img', { class: 'pix', src: itemIcon(id, 32), alt: '' }));
        slide.disabled = false; slide.focus(); action = () => slide.click();
      } }, h('img', { class: 'pix', src: itemIcon(id, 24), alt: '' }), ' ', ITEMS[id].name));
      const charge = () => { if (sliding) return; power += pdir * 0.025; if (power > 1) { power = 1; pdir = -1; } if (power < 0) { power = 0; pdir = 1; } meter.firstChild.style.width = `${power * 100}%`; raf = requestAnimationFrame(charge); };
      const move = () => {
        pos += vel; vel *= 0.94;
        glass.style.left = `calc(${pos * 100}% - 12px)`;
        if (vel > 0.0008 && pos < 1.02) { raf = requestAnimationFrame(move); return; }
        const good = chosen === o.drink && Math.abs(pos - (z0 + 0.06)) < 0.08;
        if (good) { score++; sfx.heart(); } else sfx.bump();
        msg.textContent = chosen !== o.drink ? `${o.name}: "That's... not what I asked for. I'll drink it though."` : pos > 1 ? 'It flies off the end of the bar. Pina catches it. Somehow.' : good ? `Perfect! ${o.name} catches it without looking. Legend.` : `${o.name} has to lean right over to reach it. Close!`;
        const go = h('button', { class: 'wood-btn' }, i < 2 ? 'Next order' : 'Next game');
        go.onclick = once(() => { i++; if (i < 3) serve(); else next(); });
        action = () => go.click();
        msg.append(h('div', { class: 'center' }, go)); go.focus();
      };
      slide.onclick = () => { if (sliding || !chosen) return; sliding = true; cancelAnimationFrame(raf); vel = 0.015 + power * 0.05; slide.disabled = true; pickBtns.forEach(b => { b.disabled = true; }); action = null; sfx.blip(); move(); };
      action = null;
      area.replaceChildren(h('div', { class: 'note' }, h('h4', {}, `2. Behind the bar (${i + 1}/3)`), h('p', { class: 'small' }, 'Pick the drink they asked for, then hit Slide! when the power is right.')), msg, h('div', { class: 'bar-picks' }, ...pickBtns), counter, meter, h('div', { class: 'center' }, slide), scoreLine());
      charge();
    };
    cleanup = () => cancelAnimationFrame(raf);
    serve();
  };

  // 3. Guest trivia: two questions about the neighbours.
  const trivia = () => {
    const qs = [...TRIVIA].sort(() => Math.random() - 0.5).slice(0, 2);
    let i = 0;
    const ask = () => {
      const q = qs[i];
      const after = h('p', { class: 'center' });
      const opts = q.a.map((a, k) => h('button', { class: 'wood-btn party-answer', onclick: () => {
        opts.forEach(b => { b.disabled = true; });
        if (k === q.right) { score++; sfx.heart(); after.textContent = 'Correct! The guests are impressed.'; } else { sfx.bump(); after.textContent = `Not quite. It was: ${q.a[q.right]}.`; }
        const go = h('button', { class: 'wood-btn' }, i < 1 ? 'Next question' : 'Finish');
        go.onclick = once(() => { i++; if (i < 2) ask(); else next(); });
        action = () => go.click();
        after.append(h('div', { class: 'center' }, go)); go.focus();
      } }, a));
      action = null;
      area.replaceChildren(h('div', { class: 'note' }, h('h4', {}, `3. Guest trivia (${i + 1}/2)`), h('p', {}, q.q)), ...opts.map(b => h('div', { class: 'center' }, b)), after, scoreLine());
      opts[0].focus();
    };
    ask();
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
    h('p', { class: 'small' }, 'Dancing, drinks and trivia. Do well and the whole town hears about it.'),
    h('p', { class: 'small' }, h('img', { class: 'pix', src: itemIcon('bunting', 32), alt: '' }), ' The bunting is up, the drinks are cold and the twins are wearing party hats.')),
    h('div', { class: 'center' }, start));
  start.focus();
  return { action: () => action?.(), cleanup: () => { cleanup(); done(score); } };
}

