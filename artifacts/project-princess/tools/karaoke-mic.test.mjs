// Karaoke mic mode: judging voice from a loudness stream, with fake streams.
import test from 'node:test';
import assert from 'node:assert/strict';

const root = new URL('../game/src/', import.meta.url);
const mic = await import(new URL('systems/karaoke-mic.js', root));
const { judgeAt, scoreOf, scoreVoice, noiseFloor, thresholdFor, onsetDetector, micProblem, rms, MIC } = mic;

const LV = { easy: { every: 0, perfect: 0.3, good: 0.7 }, hard: { every: 1, perfect: 0.12, good: 0.28 } };
const FPS = 60;
// A loudness stream: background noise plus a "syllable" (a 0.18 s bump) at each time.
function stream(until, sungAt, { noise = 0.004, voice = 0.12, hold = false, music = 0 } = {}) {
  const out = [];
  for (let i = 0; i <= until * FPS; i++) {
    const t = i / FPS;
    let x = noise * (1 + 0.3 * Math.sin(i * 1.7)) + (t > 1.5 ? music : 0);
    for (const s of sungAt) { const d = t - s; if (d >= 0 && d < 0.18) x = Math.max(x, voice * Math.sin(Math.PI * d / 0.18) + noise); }
    if (hold && t >= sungAt[0] && t <= sungAt.at(-1) + 0.2) x = Math.max(x, voice);
    out.push({ t, level: x });
  }
  return out;
}
const cues = times => times.map((t, i) => ({ t, line: i, word: 0 }));
const BEATS = [2, 2.6, 3.2, 3.8, 4.4, 5, 5.6, 6.2];

test('judgeAt is the tap rule: nearest unhit beat, perfect or good, else null', () => {
  const c = cues([1, 2]), hit = [null, null];
  assert.deepEqual(judgeAt(c, hit, 1.1, LV.easy), { index: 0, grade: 'perfect' });
  assert.deepEqual(judgeAt(c, hit, 1.5, LV.easy), { index: 0, grade: 'good' });
  assert.equal(judgeAt(c, hit, 3, LV.easy), null);
  hit[0] = 'perfect';
  assert.deepEqual(judgeAt(c, hit, 1.4, LV.easy), { index: 1, grade: 'good' }, 'a hit beat is skipped');
});

test('the score scale is unchanged (perfect 2, good 1)', () => {
  assert.deepEqual(scoreOf(['perfect', 'perfect', 'good', 'miss']), { pct: 63, stars: 2 });
  assert.deepEqual(scoreOf(['perfect', 'perfect', 'perfect', 'perfect', 'good']), { pct: 90, stars: 3 });
  assert.deepEqual(scoreOf([]), { pct: 0, stars: 0 });
});

test('calibration: median floor, threshold clamped above it', () => {
  assert.equal(noiseFloor([0.01, 0.9, 0.01, 0.02, 0.01]), 0.01, 'a cough does not raise it');
  assert.equal(thresholdFor(0), MIC.MIN_THRESHOLD);
  assert.ok(thresholdFor(0.02) >= 0.05);
  assert.equal(thresholdFor(1), MIC.MAX_THRESHOLD);
  assert.ok(Math.abs(rms(new Float32Array([0.5, -0.5, 0.5, -0.5])) - 0.5) < 1e-6);
});

test('singing on every beat scores perfect', () => {
  const hit = scoreVoice(cues(BEATS), stream(7, BEATS.map(t => t + 0.02)), LV.hard, { calibrateUntil: 1 });
  assert.deepEqual(hit, BEATS.map(() => 'perfect'));
});

test('slightly late singing is good, very late is a miss', () => {
  const hit = scoreVoice(cues([2, 4]), stream(6, [2.25 - MIC.LAG + 0.06, 4.6]), LV.hard, { calibrateUntil: 1 });
  assert.deepEqual(hit, ['good', 'miss']);
});

test('silence, or quiet background noise, scores nothing', () => {
  assert.deepEqual(scoreVoice(cues(BEATS), stream(7, []), LV.hard, { calibrateUntil: 1 }), BEATS.map(() => 'miss'));
  assert.equal(scoreOf(scoreVoice(cues(BEATS), stream(7, [], { noise: 0.05 }), LV.hard, { calibrateUntil: 1 })).pct, 0);
});

test('one long held note does not hit every word', () => {
  const hit = scoreVoice(cues(BEATS), stream(7, BEATS, { hold: true }), LV.hard, { calibrateUntil: 1 });
  assert.equal(hit.filter(h => h !== 'miss').length, 1);
});

test('a loud room raises the bar: noise at the voice level does not count', () => {
  const loud = stream(7, BEATS, { noise: 0.1, voice: 0.02 });
  assert.equal(scoreOf(scoreVoice(cues(BEATS), loud, LV.hard, { calibrateUntil: 1 })).pct, 0);
});

test('steady music leaking in after calibration is soaked up by the floor', () => {
  const det = onsetDetector(thresholdFor(0.004));
  let count = 0;
  for (const f of stream(20, [], { music: 0.06 })) if (f.t > 1 && det.push(f.t, f.level)) count++;
  assert.ok(count <= 1, `steady music counted ${count} times`);
  // ...but a real voice on top of it still does
  const hit = scoreVoice(cues(BEATS.map(t => t + 10)), stream(18, BEATS.map(t => t + 10), { music: 0.06, voice: 0.3 }), LV.hard, { calibrateUntil: 1 });
  assert.ok(scoreOf(hit).pct >= 80, scoreOf(hit).pct);
});

test('mic problems map to friendly reasons', () => {
  assert.equal(micProblem({ name: 'NotAllowedError' }), 'denied');
  assert.equal(micProblem({ name: 'NotFoundError' }), 'nomic');
  assert.equal(micProblem({ name: 'NotReadableError' }), 'busy');
  assert.equal(micProblem({ reason: 'insecure' }), 'insecure');
  assert.equal(micProblem(new Error('x')), 'failed');
  for (const why of Object.values(mic.MIC_WHY)) assert.ok(why.length < 140 && !/—/.test(why));
});
