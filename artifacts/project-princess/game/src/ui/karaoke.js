// Karaoke with the dela Cruz family at Lohse St Reserve. Pick a song, the
// backing track plays and the lyrics roll by; press Sing! (A, Space or tap)
// as each line starts. Songs and timings: assets/karaoke/songs.json, one
// { id, title, artist, lines: [[seconds, text]] } per song, with <id>.mp3.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { sfx } from '../systems/sfx.js';
import { heroIcon } from './images.js';

let songs = null;
export const loadSongs = () => songs ? Promise.resolve(songs) : fetch('assets/karaoke/songs.json').then(r => r.json()).then(s => (songs = s));
// Difficulty: which beats you hit, and how close (seconds either side) counts
// as perfect or good. Words are timed evenly through each line.
const LEVELS = [
  { id: 'easy', name: 'Easy', desc: 'Hit Sing! as each line starts.', every: 0, perfect: 0.3, good: 0.7 },
  { id: 'medium', name: 'Medium', desc: 'Every other word.', every: 2, perfect: 0.18, good: 0.4 },
  { id: 'hard', name: 'Hard', desc: 'Every single word. Good luck.', every: 1, perfect: 0.12, good: 0.28 },
];
const SING_RATE = 0.42;   // seconds a word takes, at most (fast lines squeeze in)
export function beats(lines, lv) {
  const out = [];
  lines.forEach(([a, text], li) => {
    const words = text.split(/\s+/).filter(Boolean), next = lines[li + 1]?.[0] ?? a + words.length * SING_RATE + 1;
    const step = Math.min(SING_RATE, (next - a) * 0.9 / Math.max(1, words.length));
    words.forEach((w, wi) => { if (lv.every ? wi % lv.every === 0 : wi === 0) out.push({ t: a + wi * step, line: li, word: wi }); });
  });
  return out;
}
// How fast a song is: words per second over the whole song (for the song list)
const pace = song => { const w = song.lines.reduce((n, [, t]) => n + t.split(/\s+/).length, 0), d = song.lines.at(-1)[0] - song.lines[0][0] || 1; return w / d; };

export function openKaraoke(panel, close, { done, intro }) {
  let action = null, audio = null, raf = 0, result = null;
  const stop = () => { cancelAnimationFrame(raf); if (audio) { audio.pause(); audio.src = ''; audio = null; } };
  const head = title => h('div', { class: 'm-head' }, h('h2', {}, title), h('button', { class: 'wood-btn small', onclick: close }, 'Close'));

  const pick = () => {
    panel.replaceChildren(head('Karaoke'), h('div', { class: 'm-scroll' }, h('p', { class: 'center' }, 'Loading the song book...')));
    loadSongs().then(list => {
      const btns = list.map(s => { const p = pace(s); return h('button', { class: 'wood-btn party-answer kara-song', onclick: () => { sfx.select(); level(s); } }, h('b', {}, s.title), h('small', {}, ` ${s.artist} · ${p > 2.2 ? 'fast' : p > 1.4 ? 'medium' : 'slow'}`)); });
      panel.replaceChildren(head('Karaoke'), h('div', { class: 'm-scroll' },
        h('div', { class: 'note' }, h('p', {}, intro || 'Tito Ramon hands you the mic. "Pick a song! Any song! Except mine."'), h('p', { class: 'small' }, 'Press Sing! (A or Space) on the beat. Pick how hard after the song. Fast songs are harder.')),
        ...btns.map(b => h('div', { class: 'center' }, b))));
      btns[0]?.focus();
    }).catch(() => panel.replaceChildren(head('Karaoke'), h('div', { class: 'm-scroll' }, h('p', { class: 'center' }, 'The song book is missing. Check your internet and try again.'))));
  };

  const level = song => {
    const btns = LEVELS.map(lv => h('button', { class: 'wood-btn party-answer kara-song', onclick: () => { sfx.select(); sing(song, lv); } }, h('b', {}, lv.name), h('small', {}, ` ${lv.desc}`)));
    panel.replaceChildren(head(song.title), h('div', { class: 'm-scroll' },
      h('div', { class: 'note' }, h('p', {}, 'How brave are we feeling?')), ...btns.map(b => h('div', { class: 'center' }, b))));
    btns[0]?.focus();
  };

  const sing = (song, lv) => {
    const lines = song.lines, cuesAt = beats(lines, lv), hit = cuesAt.map(() => null), PERFECT = lv.perfect, GOOD = lv.good;
    let perfect = 0, good = 0, shown = -1;
    const stage = h('div', { class: 'kara-stage' }, h('img', { class: 'pix kara-singer', src: heroIcon(state.data.hero), alt: '' }), h('div', { class: 'kara-notes' }));
    const prev = h('p', { class: 'kara-line prev' }), cur = h('p', { class: 'kara-line cur' + (lv.every ? ' words' : '') }), next = h('p', { class: 'kara-line next' });
    const lane = h('div', { class: 'kara-lane' }, h('div', { class: 'kara-now' })), feedback = h('p', { class: 'kara-fb center' }, 'Get ready...');
    const scoreEl = h('p', { class: 'small center meta' });
    const btn = h('button', { class: 'wood-btn kara-btn', tabindex: '-1', onpointerdown: e => { e.preventDefault(); press(); } }, 'Sing!');
    const stopBtn = h('button', { class: 'wood-btn small', onclick: () => finish(hit, cuesAt.length) }, 'Stop');
    const cues = cuesAt.map(() => { const c = h('div', { class: 'kara-cue' + (lv.every ? ' word' : '') }); lane.append(c); return c; });
    const notesBox = stage.querySelector('.kara-notes');
    const score = () => { scoreEl.textContent = `${lv.name} · Perfect ${perfect} · Good ${good} · Beats ${cuesAt.length}`; };
    const press = () => {
      if (!audio) return;
      const t = audio.currentTime;
      let best = -1, bd = 9;
      cuesAt.forEach(({ t: at }, i) => { const d = Math.abs(t - at); if (hit[i] === null && d < bd) { bd = d; best = i; } });
      if (best < 0 || bd > GOOD) { feedback.textContent = 'Too early!'; feedback.className = 'kara-fb center miss'; sfx.bump(); return; }
      hit[best] = bd <= PERFECT ? 'perfect' : 'good';
      if (hit[best] === 'perfect') perfect++; else good++;
      cues[best].classList.add(hit[best]);
      feedback.textContent = hit[best] === 'perfect' ? 'PERFECT!' : 'Good!'; feedback.className = `kara-fb center ${hit[best]}`;
      const n = h('span', {}, ['♪', '♫', '♬'][best % 3]); n.style.left = `${20 + Math.random() * 60}%`; notesBox.append(n); setTimeout(() => n.remove(), 1400);
      score();
    };
    const tick = () => {
      if (!audio) return;
      const t = audio.currentTime;
      let i = -1; while (i + 1 < lines.length && lines[i + 1][0] <= t + 0.05) i++;
      if (i !== shown) {
        shown = i; prev.textContent = lines[i - 1]?.[1] || ''; next.textContent = lines[i + 1]?.[1] || '';
        if (lv.every && lines[i]) {   // words as spans, the ones to hit underlined
          const marks = new Set(cuesAt.filter(c => c.line === i).map(c => c.word));
          cur.replaceChildren(...lines[i][1].split(/\s+/).filter(Boolean).flatMap((w, k) => [h('span', { class: marks.has(k) ? 'kara-beat' : '' }, w), ' ']));
        } else cur.textContent = lines[i]?.[1] || '♪ ♪ ♪';
      }
      if (lv.every) { const last = cuesAt.filter(c => c.line === i && c.t <= t + 0.05).at(-1)?.word ?? -1; cur.querySelectorAll('span').forEach((w, n) => w.classList.toggle('lit', n <= last)); }
      const a = lines[i]?.[0] ?? 0, b = lines[i + 1]?.[0] ?? a + 4;
      cur.style.setProperty('--fill', `${Math.max(0, Math.min(1, (t - a) / Math.max(0.5, b - a))) * 100}%`);
      const span = lv.every ? 2.5 : 4;   // seconds of lane on screen
      cues.forEach((c, k) => { const x = (cuesAt[k].t - t) / span; c.style.left = `${15 + x * 85}%`; c.style.display = x < -0.2 || x > 1.05 ? 'none' : ''; if (hit[k] === null && t - cuesAt[k].t > GOOD) { hit[k] = 'miss'; c.classList.add('miss'); } });
      if (audio.ended) return finish(hit, cuesAt.length);
      raf = requestAnimationFrame(tick);
    };
    panel.replaceChildren(h('div', { class: 'm-head' }, h('h2', {}, song.title), stopBtn),
      h('div', { class: 'm-scroll kara' }, stage, prev, cur, next, lane, feedback, h('div', { class: 'center' }, btn), scoreEl));
    score();
    audio = new Audio(`assets/karaoke/${song.id}.mp3`);
    audio.volume = state.data.settings.sound ? 0.8 : 0;
    audio.play().catch(() => { feedback.textContent = 'Tap Sing! to start the music.'; });
    action = press;
    tick();
  };

  const finish = (hit = [], total = hit.length) => {
    if (!audio) return;
    cancelAnimationFrame(raf);
    hit.forEach((v, i) => { if (v === null) hit[i] = 'miss'; });
    const t = audio.currentTime; stop();
    const els = hit.filter(x => x === 'perfect').length * 2 + hit.filter(x => x === 'good').length;
    const pct = total ? Math.round(els / (total * 2) * 100) : 0;
    const stars = pct >= 80 ? 3 : pct >= 50 ? 2 : pct >= 20 ? 1 : 0;
    result = { pct, stars, seconds: t };
    (stars >= 2 ? sfx.found : sfx.blip)();
    const go = h('button', { class: 'wood-btn', onclick: close }, 'Hand back the mic');
    panel.replaceChildren(head('Karaoke'), h('div', { class: 'm-scroll' }, h('div', { class: 'note center' },
      h('h4', {}, '★'.repeat(stars) + '☆'.repeat(3 - stars)),
      h('p', {}, `Score: ${pct}%`),
      h('p', { class: 'small' }, stars === 3 ? 'The whole park is clapping. Bea is crying. Tito Ramon is crying. A magpie bows.' : stars === 2 ? 'Tita Liza nods slowly. That is high praise.' : stars === 1 ? 'Brave. Very brave. Migs gives you a thumbs up.' : 'Tito Ramon gently takes the mic back. "Practice, anak. Practice."')),
      h('div', { class: 'center' }, go)));
    action = close; go.focus();
  };

  pick();
  return { action: () => action?.(), cleanup: () => { stop(); done(result); } };
}
