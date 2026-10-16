// Karaoke with the dela Cruz family at Lohse St Reserve. Pick a song, the
// backing track plays and the lyrics roll by; press Sing! (A, Space or tap)
// as each line starts. Songs and timings: assets/karaoke/songs.json, one
// { id, title, artist, lines: [[seconds, text]] } per song, with <id>.mp3.
import { h } from './dom.js';
import { state } from '../systems/state.js';
import { sfx } from '../systems/sfx.js';
import { heroIcon } from './images.js';
import { judgeAt, scoreOf, onsetDetector, noiseFloor, thresholdFor, openMic, micAvailable, MIC, MIC_WHY } from '../systems/karaoke-mic.js';

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
// Songs are cut to about a minute (the owner found full songs too long):
// start a few seconds before the first line, stop at the first line that
// starts after SONG_SECONDS of singing. Used by the park and the party.
export const SONG_SECONDS = 55;
export function songWindow(lines) {
  const first = lines[0]?.[0] ?? 0, start = Math.max(0, first - 3);
  const cut = lines.find(([t]) => t >= first + SONG_SECONDS);
  const end = cut ? cut[0] : (lines.at(-1)?.[0] ?? first) + 5;
  return { start, end, lines: lines.filter(([t]) => t < end) };
}
// How fast a song is: words per second over the whole song (for the song list)
const pace = song => { const w = song.lines.reduce((n, [, t]) => n + t.split(/\s+/).length, 0), d = song.lines.at(-1)[0] - song.lines[0][0] || 1; return w / d; };

export function openKaraoke(panel, close, { done, intro }) {
  let action = null, audio = null, raf = 0, result = null, mic = null, primed = null;
  // Always let go of the mic: song over, Stop, Close or the modal shut.
  const dropMic = () => { mic?.stop(); mic = null; };
  const stop = () => { cancelAnimationFrame(raf); dropMic(); if (audio) { audio.pause(); audio.src = ''; audio = null; } if (primed) { primed.pause(); primed.src = ''; primed = null; } };
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
    const btns = LEVELS.map(lv => h('button', { class: 'wood-btn party-answer kara-song', onclick: () => { sfx.select(); mode(song, lv); } }, h('b', {}, lv.name), h('small', {}, ` ${lv.desc}`)));
    panel.replaceChildren(head(song.title), h('div', { class: 'm-scroll' },
      h('div', { class: 'note' }, h('p', {}, 'How brave are we feeling?')), ...btns.map(b => h('div', { class: 'center' }, b))));
    btns[0]?.focus();
  };

  // Sing into the mic or tap along. Tap is the default and the fallback; the
  // last choice is remembered (settings.karaokeMic, also in Settings).
  const mode = (song, lv) => {
    const s = state.data.settings, why = micAvailable();
    const tapBtn = h('button', { class: 'wood-btn party-answer kara-song', onclick: () => { sfx.select(); s.karaokeMic = false; state.save(); sing(song, lv); } }, h('b', {}, 'Tap along'), h('small', {}, ' Press Sing! on the beat.'));
    const micBtn = h('button', { class: 'wood-btn party-answer kara-song kara-micpick', onclick: () => { sfx.select(); s.karaokeMic = true; state.save(); withMic(song, lv); } }, h('b', {}, 'Sing with the mic'), h('small', {}, ' Make a noise on every beat. Any words will do.'));
    panel.replaceChildren(head(song.title), h('div', { class: 'm-scroll' },
      h('div', { class: 'note' }, h('p', {}, 'Real singing or finger singing?'),
        h('p', { class: 'small' }, why === 'insecure' ? 'The mic needs a secure (https) page, so tapping is safest here.' : 'Headphones help: then the mic only hears you, not the music.')),
      h('div', { class: 'center' }, tapBtn), h('div', { class: 'center' }, micBtn)));
    (s.karaokeMic ? micBtn : tapBtn).focus();
  };

  // Called from the tap on "Sing with the mic", so the AudioContext and the
  // song both start inside the gesture (iOS Safari will not allow it later).
  const withMic = (song, lv) => {
    const win = songWindow(song.lines);
    primed = new Audio(`assets/karaoke/${song.id}.mp3`);
    primed.muted = true; primed.play().then(() => primed?.pause()).catch(() => {});
    const msg = h('p', {}, 'Asking for the mic...');
    panel.replaceChildren(head(song.title), h('div', { class: 'm-scroll' }, h('div', { class: 'note center' }, msg)));
    openMic().then(m => {
      if (!primed) { m.stop(); return; }   // closed while asking
      mic = m; const a = primed; primed = null; sing(song, lv, a, win);
    }, err => {
      if (!primed) return;
      stop(); state.data.settings.karaokeMic = false; state.save();
      const tap = h('button', { class: 'wood-btn', onclick: () => { sfx.select(); sing(song, lv); } }, 'Tap along instead');
      panel.replaceChildren(head(song.title), h('div', { class: 'm-scroll' }, h('div', { class: 'note center' },
        h('p', {}, MIC_WHY[err?.reason] || MIC_WHY.failed),
        h('p', { class: 'small' }, err?.reason === 'denied' ? 'To sing for real later, allow the mic for this page in your browser settings.' : 'Tito Ramon: "No mic? We clap then!"')),
        h('div', { class: 'center' }, tap)));
      action = () => tap.click(); tap.focus();
    });
  };

  const sing = (song, lv, given = null, givenWin = null) => {
    const win = givenWin || songWindow(song.lines), lines = win.lines, cuesAt = beats(lines, lv), hit = cuesAt.map(() => null), GOOD = lv.good;
    const voice = !!mic, calib = [];   // mic mode: a quiet second, then listen
    let det = null;
    let perfect = 0, good = 0, shown = -1;
    const stage = h('div', { class: 'kara-stage' }, h('img', { class: 'pix kara-singer', src: heroIcon(state.data.hero), alt: '' }), h('div', { class: 'kara-notes' }));
    const prev = h('p', { class: 'kara-line prev' }), cur = h('p', { class: 'kara-line cur' + (lv.every ? ' words' : '') }), next = h('p', { class: 'kara-line next' });
    const lane = h('div', { class: 'kara-lane' }, h('div', { class: 'kara-now' })), feedback = h('p', { class: 'kara-fb center' }, 'Get ready...');
    const scoreEl = h('p', { class: 'small center meta' });
    const btn = h('button', { class: 'wood-btn kara-btn', tabindex: '-1', onpointerdown: e => { e.preventDefault(); if (voice) resume(); else press(); } }, voice ? 'Start the music' : 'Sing!');
    const meterFill = h('i'), meterMark = h('b'), meter = h('div', { class: 'kara-meter', role: 'meter', 'aria-label': 'Your voice' }, meterFill, meterMark);
    if (voice) btn.style.display = 'none';
    const resume = () => { if (audio?.paused && !audio.ended) audio.play().then(() => { btn.style.display = 'none'; }).catch(() => {}); };
    const stopBtn = h('button', { class: 'wood-btn small', onclick: () => finish(hit, cuesAt.length) }, 'Stop');
    const cues = cuesAt.map(() => { const c = h('div', { class: 'kara-cue' + (lv.every ? ' word' : '') }); lane.append(c); return c; });
    const notesBox = stage.querySelector('.kara-notes');
    const score = () => { scoreEl.textContent = `${lv.name}${voice ? ' · Mic' : ''} · Perfect ${perfect} · Good ${good} · Beats ${cuesAt.length}`; };
    const press = (at = null) => {
      if (!audio) return;
      const t = at ?? audio.currentTime, j = judgeAt(cuesAt, hit, t, lv);
      if (!j) { if (at === null) { feedback.textContent = 'Too early!'; feedback.className = 'kara-fb center miss'; sfx.bump(); } return; }
      const best = j.index; hit[best] = j.grade;
      if (hit[best] === 'perfect') perfect++; else good++;
      cues[best].classList.add(hit[best]);
      feedback.textContent = hit[best] === 'perfect' ? 'PERFECT!' : 'Good!'; feedback.className = `kara-fb center ${hit[best]}`;
      const n = h('span', {}, ['♪', '♫', '♬'][best % 3]); n.style.left = `${20 + Math.random() * 60}%`; notesBox.append(n); setTimeout(() => n.remove(), 1400);
      score();
    };
    const listen = t => {   // one mic frame: calibrate, then count sung words
      const x = mic?.level() ?? 0;
      if (!det) {
        if (t < win.start + MIC.CALIBRATE || !calib.length) { calib.push(x); if (!audio.paused) feedback.textContent = 'Stay quiet a sec...'; }
        else { det = onsetDetector(thresholdFor(noiseFloor(calib))); feedback.textContent = 'Sing on the dots!'; }
      } else if (det.push(t, x)) press(t - MIC.LAG);
      const thr = det?.threshold ?? thresholdFor(noiseFloor(calib));   // square root so quiet voices still show; the mark is the threshold
      meterFill.style.width = `${Math.min(1, Math.sqrt(x / (thr * 4))) * 100}%`; meterMark.style.left = '50%';
      meter.classList.toggle('loud', x >= thr);
    };
    const tick = () => {
      if (!audio) return;
      const t = audio.currentTime;
      if (voice) listen(t);
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
      cues.forEach((c, k) => { const x = (cuesAt[k].t - t) / span; c.style.left = `${15 + x * 85}%`; c.style.display = x < -0.2 || x > 1.05 ? 'none' : ''; if (hit[k] === null && t - (voice ? MIC.LAG : 0) - cuesAt[k].t > GOOD) { hit[k] = 'miss'; c.classList.add('miss'); } });
      if (t >= win.end - 1.2 && audio.volume > 0) audio.volume = Math.max(0, audio.volume - 0.03);   // fade out
      if (audio.ended || t >= win.end) return finish(hit, cuesAt.length);
      raf = requestAnimationFrame(tick);
    };
    panel.replaceChildren(h('div', { class: 'm-head' }, h('h2', {}, song.title), stopBtn),
      h('div', { class: 'm-scroll kara' }, stage, prev, cur, next, lane, voice ? meter : null, feedback, h('div', { class: 'center' }, btn), scoreEl));
    score();
    audio = given || new Audio(`assets/karaoke/${song.id}.mp3`);
    audio.muted = false;
    audio.volume = state.data.settings.sound ? 0.8 : 0;
    audio.currentTime = win.start;
    audio.addEventListener('loadedmetadata', () => { if (audio && audio.currentTime < win.start - 0.5) audio.currentTime = win.start; }, { once: true });
    audio.play().catch(() => { feedback.textContent = voice ? 'Tap to start the music.' : 'Tap Sing! to start the music.'; if (voice) btn.style.display = ''; });
    action = voice ? resume : () => press();
    tick();
  };

  const finish = (hit = [], total = hit.length) => {
    if (!audio) return;
    cancelAnimationFrame(raf);
    hit.forEach((v, i) => { if (v === null) hit[i] = 'miss'; });
    const t = audio.currentTime; stop();
    const { pct, stars } = scoreOf(hit, total);
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
