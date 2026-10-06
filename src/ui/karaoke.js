// Karaoke with the dela Cruz family at Lohse St Reserve. Pick a song, the
// backing track plays and the lyrics roll by; press Sing! (A, Space or tap)
// as each line starts. Songs and timings: assets/karaoke/songs.json, one
// { id, title, artist, lines: [[seconds, text]] } per song, with <id>.mp3.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { sfx } from '../systems/sfx.js';
import { heroIcon } from './images.js';

let songs = null;
const loadSongs = () => songs ? Promise.resolve(songs) : fetch('assets/karaoke/songs.json').then(r => r.json()).then(s => (songs = s));
const PERFECT = 0.3, GOOD = 0.7;   // seconds either side of a line's start

export function openKaraoke(panel, close, { done }) {
  let action = null, audio = null, raf = 0, result = null;
  const stop = () => { cancelAnimationFrame(raf); if (audio) { audio.pause(); audio.src = ''; audio = null; } };
  const head = title => h('div', { class: 'm-head' }, h('h2', {}, title), h('button', { class: 'wood-btn small', onclick: close }, 'Close'));

  const pick = () => {
    panel.replaceChildren(head('Karaoke'), h('div', { class: 'm-scroll' }, h('p', { class: 'center' }, 'Loading the song book...')));
    loadSongs().then(list => {
      const btns = list.map(s => h('button', { class: 'wood-btn party-answer kara-song', onclick: () => { sfx.select(); sing(s); } }, h('b', {}, s.title), h('small', {}, ` ${s.artist}`)));
      panel.replaceChildren(head('Karaoke'), h('div', { class: 'm-scroll' },
        h('div', { class: 'note' }, h('p', {}, 'Tito Ramon hands you the mic. "Pick a song! Any song! Except mine."'), h('p', { class: 'small' }, 'Press Sing! (A or Space) just as each line starts. Perfect timing scores best.')),
        ...btns.map(b => h('div', { class: 'center' }, b))));
      btns[0]?.focus();
    }).catch(() => panel.replaceChildren(head('Karaoke'), h('div', { class: 'm-scroll' }, h('p', { class: 'center' }, 'The song book is missing. Check your internet and try again.'))));
  };

  const sing = song => {
    const lines = song.lines, hit = lines.map(() => null);
    let perfect = 0, good = 0, shown = -1;
    const stage = h('div', { class: 'kara-stage' }, h('img', { class: 'pix kara-singer', src: heroIcon(state.data.hero), alt: '' }), h('div', { class: 'kara-notes' }));
    const prev = h('p', { class: 'kara-line prev' }), cur = h('p', { class: 'kara-line cur' }), next = h('p', { class: 'kara-line next' });
    const lane = h('div', { class: 'kara-lane' }, h('div', { class: 'kara-now' })), feedback = h('p', { class: 'kara-fb center' }, 'Get ready...');
    const scoreEl = h('p', { class: 'small center meta' });
    const btn = h('button', { class: 'wood-btn kara-btn', tabindex: '-1', onpointerdown: e => { e.preventDefault(); press(); } }, 'Sing!');
    const stopBtn = h('button', { class: 'wood-btn small', onclick: () => finish() }, 'Stop');
    const cues = lines.map(() => { const c = h('div', { class: 'kara-cue' }); lane.append(c); return c; });
    const notesBox = stage.querySelector('.kara-notes');
    const score = () => { scoreEl.textContent = `Perfect ${perfect} · Good ${good} · Lines ${lines.length}`; };
    const press = () => {
      if (!audio) return;
      const t = audio.currentTime;
      let best = -1, bd = 9;
      lines.forEach(([at], i) => { const d = Math.abs(t - at); if (hit[i] === null && d < bd) { bd = d; best = i; } });
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
      if (i !== shown) { shown = i; prev.textContent = lines[i - 1]?.[1] || ''; cur.textContent = lines[i]?.[1] || '♪ ♪ ♪'; next.textContent = lines[i + 1]?.[1] || ''; }
      const a = lines[i]?.[0] ?? 0, b = lines[i + 1]?.[0] ?? a + 4;
      cur.style.setProperty('--fill', `${Math.max(0, Math.min(1, (t - a) / Math.max(0.5, b - a))) * 100}%`);
      cues.forEach((c, k) => { const x = (lines[k][0] - t) / 4; c.style.left = `${15 + x * 85}%`; c.style.display = x < -0.2 || x > 1.05 ? 'none' : ''; if (hit[k] === null && t - lines[k][0] > GOOD) { hit[k] = 'miss'; c.classList.add('miss'); } });
      if (audio.ended) return finish();
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

  const finish = () => {
    if (!audio) return;
    cancelAnimationFrame(raf);
    const t = audio.currentTime; stop();
    const els = panel.querySelectorAll('.kara-cue.perfect').length * 2 + panel.querySelectorAll('.kara-cue.good').length;
    const due = panel.querySelectorAll('.kara-cue.perfect, .kara-cue.good, .kara-cue.miss').length || 1;   // lines that have come up so far
    const pct = Math.round(els / (due * 2) * 100);
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
