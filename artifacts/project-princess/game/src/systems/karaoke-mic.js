// Karaoke with a real microphone. The pure parts (judging a beat, turning a
// loudness stream into "sung" moments, the score) are used by both tap and mic
// mode and are unit tested in tools/karaoke-mic.test.mjs. openMic() is the only
// part that touches the browser.

// Tap or voice at time t: the nearest beat not yet hit, judged on how close.
// Returns { index, grade } or null when nothing is within the good window.
export function judgeAt(cuesAt, hit, t, { perfect, good }) {
  let best = -1, bd = Infinity;
  cuesAt.forEach(({ t: at }, i) => { const d = Math.abs(t - at); if (hit[i] === null && d < bd) { bd = d; best = i; } });
  if (best < 0 || bd > good) return null;
  return { index: best, grade: bd <= perfect ? 'perfect' : 'good' };
}

// The score is the same whatever you sang with, so party and friendship
// rewards stay balanced: perfect 2, good 1, out of 2 a beat.
export function scoreOf(hit, total = hit.length) {
  const els = hit.filter(x => x === 'perfect').length * 2 + hit.filter(x => x === 'good').length;
  const pct = total ? Math.round(els / (total * 2) * 100) : 0;
  return { pct, stars: pct >= 80 ? 3 : pct >= 50 ? 2 : pct >= 20 ? 1 : 0 };
}

// Background noise from the "Stay quiet..." second: the median loudness, so a
// cough or a beep does not wreck it. The voice threshold sits well above it.
export const MIC = {
  CALIBRATE: 1,      // seconds of quiet before the first line
  MIN_THRESHOLD: 0.006,   // quiet laptop mics: speech is often only 0.01 to 0.05 RMS
  MAX_THRESHOLD: 0.3,
  OVER_FLOOR: 2.5,   // times the noise floor
  RELEASE: 0.7,      // drop below this share of the threshold to stop "singing"
  DIP: 0.7,          // a new word: the voice dips to this share of its peak...
  RISE: 1.4,         // ...then rises by this much over the dip
  MIN_GAP: 0.12,     // seconds between two counted words
  LAG: 0.06,         // seconds the mic and the singer run behind the music
  DRIFT: 6,          // seconds for the floor to creep up to steady leaking music
};
export function noiseFloor(samples) {
  const s = samples.filter(Number.isFinite).sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
}
export function thresholdFor(floor) {
  return Math.min(MIC.MAX_THRESHOLD, Math.max(MIC.MIN_THRESHOLD, floor * MIC.OVER_FLOOR, floor + 0.004));
}

// Turns loudness (RMS, 0 to 1) frame by frame into word onsets: the voice
// rising over the threshold, or a fresh syllable (a dip then a rise) while it
// stays loud. Holding one long note counts once, not on every beat. A slow
// floor follows steady noise (music leaking from speakers) so it stops counting.
export function onsetDetector(threshold) {
  let on = false, peak = 0, trough = Infinity, last = -Infinity, prevT = null, quiet = 0;
  return {
    get threshold() { return Math.max(threshold, quiet * MIC.OVER_FLOOR); },
    push(t, x) {
      const dt = prevT === null ? 0 : Math.max(0, t - prevT); prevT = t;
      quiet = x < quiet ? x : quiet + (x - quiet) * Math.min(1, dt / MIC.DRIFT);
      const thr = this.threshold;
      if (!on) {
        if (x < thr) return false;
        on = true; peak = x; trough = x;
        if (t - last < MIC.MIN_GAP) return false;
        last = t; return true;
      }
      if (x < thr * MIC.RELEASE) { on = false; return false; }
      if (x < trough) trough = x;
      if (trough <= peak * MIC.DIP && x >= trough * MIC.RISE && x >= thr && t - last >= MIC.MIN_GAP) {
        last = t; peak = x; trough = x; return true;
      }
      if (x > peak) { peak = x; trough = x; }
      return false;
    },
  };
}

// The whole judging for a stream of { t, level } frames (song time in seconds).
// Frames before calibrateUntil set the floor. Returns the hit array finish() scores.
export function scoreVoice(cuesAt, frames, lv, { calibrateUntil = -Infinity, threshold } = {}) {
  const hit = cuesAt.map(() => null);
  const thr = threshold ?? thresholdFor(noiseFloor(frames.filter(f => f.t < calibrateUntil).map(f => f.level)));
  const det = onsetDetector(thr);
  for (const { t, level } of frames) {
    if (t < calibrateUntil) continue;
    if (det.push(t, level)) { const j = judgeAt(cuesAt, hit, t - MIC.LAG, lv); if (j) hit[j.index] = j.grade; }
    cuesAt.forEach((c, i) => { if (hit[i] === null && t - MIC.LAG - c.t > lv.good) hit[i] = 'miss'; });
  }
  return hit.map(v => v ?? 'miss');
}

// Root mean square of one block of samples (-1..1).
export function rms(buf) {
  let s = 0; for (let i = 0; i < buf.length; i++) s += buf[i] * buf[i];
  return buf.length ? Math.sqrt(s / buf.length) : 0;
}

// Why the mic could not be used, in words for the player.
export const MIC_WHY = {
  insecure: 'The mic only works on a secure (https) page. Tap along this time.',
  unsupported: 'This browser cannot lend us a mic. Tap along this time.',
  denied: 'No mic allowed. That is fine: tap along instead.',
  nomic: 'No mic found on this device. Tap along instead.',
  busy: 'Something else is using the mic. Tap along instead.',
  failed: 'The mic would not start. Tap along instead.',
};
export function micProblem(err) {
  const n = err?.name || err?.reason || '';
  if (MIC_WHY[n]) return n;
  if (n === 'NotAllowedError' || n === 'SecurityError' || n === 'PermissionDeniedError') return 'denied';
  if (n === 'NotFoundError' || n === 'OverconstrainedError' || n === 'DevicesNotFoundError') return 'nomic';
  if (n === 'NotReadableError' || n === 'TrackStartError' || n === 'AbortError') return 'busy';
  return 'failed';
}

// Can this page ask for the mic at all? (http on a LAN IP cannot.)
export function micAvailable() {
  if (typeof window === 'undefined') return 'unsupported';
  if (!window.isSecureContext) return 'insecure';
  if (!navigator.mediaDevices?.getUserMedia || !(window.AudioContext || window.webkitAudioContext)) return 'unsupported';
  return null;
}

// Must be called from the player's tap: the AudioContext is made and resumed
// straight away (iOS Safari only lets it start inside a gesture), then the mic
// is asked for. Resolves to { level(), stop() }; rejects with a reason.
export function openMic() {
  const why = micAvailable();
  if (why) return Promise.reject({ reason: why });
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null, stream = null, stopped = false;
  const stop = () => {
    stopped = true;
    stream?.getTracks().forEach(tr => tr.stop()); stream = null;
    if (ctx && ctx.state !== 'closed') ctx.close().catch(() => {});
  };
  try { ctx = new AC(); ctx.resume?.().catch(() => {}); } catch (e) { return Promise.reject({ reason: 'unsupported' }); }
  return navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false } })
    .then(s => {
      stream = s;
      if (stopped) { stop(); throw { reason: 'failed' }; }
      return ctx.state === 'suspended' ? ctx.resume().catch(() => {}) : null;
    })
    .then(() => {
      const src = ctx.createMediaStreamSource(stream), an = ctx.createAnalyser();
      an.fftSize = 1024; src.connect(an);   // never to the speakers: no feedback
      const f32 = an.getFloatTimeDomainData ? new Float32Array(an.fftSize) : null, u8 = new Uint8Array(an.fftSize);
      const level = () => {
        if (!stream) return 0;
        if (f32) { an.getFloatTimeDomainData(f32); return rms(f32); }
        an.getByteTimeDomainData(u8); let s = 0; for (const v of u8) s += ((v - 128) / 128) ** 2; return Math.sqrt(s / u8.length);
      };
      return { level, stop, get live() { return !!stream && stream.getAudioTracks().some(tr => tr.readyState === 'live'); } };
    })
    .catch(e => { stop(); throw { reason: micProblem(e) }; });
}
