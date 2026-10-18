// Pet school lessons in the world: no meters, no timing bars. You move, the
// pet responds. Pure rules (no Phaser, no DOM), so tests can drive them.
//
//   course   Lead the course: the pet follows your trail. Run at a hurdle for
//            a run-up, zigzag through the weave, and wait at the far end of
//            the tunnel (you cannot go through it) or the pet backs out.
//   special  A lesson built on the pet's own personality (SPECIALS):
//            lookaway  only comes to you while you stand still and look away
//            charge    charges at you when you stop: steer it past the bins to the flags
//            herd      round the chooks into the pen
//            seek      hide and seek: watch for the rustling bush
//
// Each lesson takes a class level (0 to 4, systems/training.js) and an area in
// world pixels. The runner (school-runner.js) feeds tick(dt, handler) with the
// player's position, facing and speed, and draws pet, props and solids.
import { hash } from '../util.js';

export const SPECIALS = {
  stanley: 'lookaway', ziggy: 'lookaway',
  poppy: 'charge', rusty: 'charge',
  chloe: 'herd', girlie: 'herd', marty: 'herd',
  spooky: 'seek', salami: 'seek', princess: 'seek', emilio: 'seek',
};
export const specialFor = (id, behaviour) => SPECIALS[id] || ({ aloof: 'lookaway', zoomies: 'charge', phase: 'seek', stalk: 'seek' }[behaviour]) || 'herd';
export const LESSON_TITLES = { course: 'Lead the course', lookaway: 'Come when called', charge: 'Steer the charge', herd: 'Round up the chooks', seek: 'Hide and seek' };
export const LESSON_HELP = {
  course: 'Your pet follows your path. Run at the hurdles for a run-up. Zigzag through the weave poles. You cannot fit in the tunnel: lead your pet to it, then hurry round to the far end and wait.',
  lookaway: 'NAME will not come while you watch. Stand still and turn your back. Look at NAME and they stop. Get NAME to your feet three times.',
  charge: 'NAME charges at you whenever you stop. Stand where the charge runs over a flag and misses the bins. Touch every flag.',
  herd: 'NAME follows your path, and the chooks run from NAME. Get them all through the gap into the pen.',
  seek: 'NAME is hiding in the bushes. Watch for a rustle, then walk up to that bush. Three finds.',
};

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

class Lesson {
  constructor(kind, { level = 0, area, seed = 0.5, name = 'Your pet', speedy = false }) {
    this.kind = kind; this.level = Math.max(0, Math.min(4, level | 0)); this.area = area; this.seed = seed; this.name = name; this.speedy = speedy;
    this.pet = { x: area.x + 20, y: area.y + area.h / 2, moving: false, flip: false, jump: 0, alpha: 1 };
    this.elapsed = 0; this.faults = 0; this.complete = false; this.ended = false;
    this.timeLimit = 100; this.trail = []; this.solids = []; this.feedback = null;
    this.start = { x: area.x + 12, y: area.y + area.h / 2 };
    this.message = LESSON_HELP[kind].replace(/NAME/g, name);
  }
  // Hints only replace a ✓ or ✗ message after a moment, so you get to read it.
  hint(text) { if (this.elapsed - (this.lastNote ?? -9) > 2.5) this.message = text; }
  rand(i) { return hash(Math.floor(this.seed * 997), i, this.level + 3); }
  fault(text) { this.faults++; this.message = text; this.lastNote = this.elapsed; this.feedback = { ok: false, n: (this.feedback?.n || 0) + 1 }; }
  good(text) { if (text) this.message = text; this.lastGood = this.lastNote = this.elapsed; this.feedback = { ok: true, n: (this.feedback?.n || 0) + 1 }; }
  // Follow the handler's path, a little behind them (the trail is the path you walked).
  follow(dt, handler, gap = 14, max = 125) {
    const last = this.trail[this.trail.length - 1];
    if (!last || dist(last, handler) >= 3) this.trail.push({ x: handler.x, y: handler.y });
    if (this.trail.length > 200) this.trail.shift();
    // The point on the trail `gap` px behind the handler (measured along the path walked).
    let target = this.trail[0], prev = { x: handler.x, y: handler.y }, acc = 0;
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const p = this.trail[i], seg = dist(prev, p);
      if (acc + seg >= gap) { const t = (gap - acc) / (seg || 1); target = { x: prev.x + (p.x - prev.x) * t, y: prev.y + (p.y - prev.y) * t }; break; }
      acc += seg; prev = p;
    }
    this.moveTo(dt, target, max);
  }
  moveTo(dt, target, speed) {
    const d = dist(this.pet, target), step = Math.min(d, speed * dt);
    const before = { x: this.pet.x, y: this.pet.y };
    if (d > 0.5) { this.pet.x += (target.x - this.pet.x) / d * step; this.pet.y += (target.y - this.pet.y) / d * step; }
    // Smoothed velocity (about a quarter of a second), so a hurdle reads the run-up, not one frame.
    const k = Math.min(1, dt * 8), ix = dt ? (this.pet.x - before.x) / dt : 0, iy = dt ? (this.pet.y - before.y) / dt : 0;
    this.pet.vx = (this.pet.vx || 0) + (ix - (this.pet.vx || 0)) * k; this.pet.vy = (this.pet.vy || 0) + (iy - (this.pet.vy || 0)) * k;
    this.pet.moving = step > 0.2; if (Math.abs(target.x - this.pet.x) > 0.5) this.pet.flip = target.x < this.pet.x;
    return d - step;
  }
  resetTrail(handler) { this.trail = [{ x: this.pet.x, y: this.pet.y }, { x: handler.x, y: handler.y }]; }
  tick(dt, handler) {
    if (this.ended) return;
    dt = Math.max(0, Math.min(0.05, dt)); this.elapsed += dt;
    this.pet.jump = Math.max(0, this.pet.jump - dt);
    this.update(dt, handler);
    if (this.complete) this.ended = true;
    else if (this.elapsed >= this.timeLimit) { this.ended = true; this.message = `Time is up. ${this.name} had a good practice anyway.`; }
  }
  // 3 clean, 2 with a slip or two, 1 for finishing at all, 0 out of time.
  result() {
    const score = !this.complete ? 0 : this.faults === 0 ? 3 : this.faults <= 2 ? 2 : 1;
    return { score, complete: this.complete, faults: this.faults, seconds: Math.round(this.elapsed) };
  }
}

// Lead the course.
export class CourseLesson extends Lesson {
  constructor(opts) {
    super('course', opts);
    const L = this.level, a = this.area;
    const plan = [['hurdle', 'hurdle'], ['hurdle', 'tunnel', 'hurdle'], ['hurdle', 'weave3', 'tunnel'],
      ['hurdle', 'weave5', 'tunnel', 'hurdle'], ['hurdle', 'weave5', 'tunnel', 'hurdle', 'hurdle']][L];
    this.timeLimit = [100, 100, 110, 110, 100][L];
    this.runUp = L >= 3 ? 90 : 80;              // pet speed needed over a hurdle (walking is 64, running 108)
    // Two rows: left to right along the top, right to left along the bottom.
    const top = a.y + a.h * 0.32, bottom = a.y + a.h * 0.74, perRow = Math.ceil(plan.length / 2);
    this.stations = plan.map((kind, i) => {
      const row = i < perRow ? 0 : 1, n = row ? plan.length - perRow : perRow, k = row ? i - perRow : i;
      const span = a.w - 70, x0 = a.x + 38 + span * ((k + 0.5) / n);
      const dir = row ? -1 : 1, x = row ? a.x + a.w - (x0 - a.x) : x0;
      const s = { kind: kind.startsWith('weave') ? 'weave' : kind, x, y: row ? bottom : top, dir };
      if (s.kind === 'weave') { const poles = +kind.slice(5); s.poles = Array.from({ length: poles }, (_, j) => x + (j - (poles - 1) / 2) * 16 * dir); }
      if (s.kind === 'tunnel') {
        s.entrance = { x: x - 18 * dir, y: s.y }; s.exit = { x: x + 18 * dir, y: s.y };
        this.solids.push({ x: x - 16, y: s.y - 8, w: 32, h: 14 });
      }
      return s;
    });
    const lastRow = plan.length > perRow ? 1 : 0;
    this.finish = { x: lastRow ? a.x + 18 : a.x + a.w - 18, y: lastRow ? bottom : top };
    this.start = { x: a.x + 12, y: top };
    this.pet.x = this.start.x - 6; this.pet.y = this.start.y;
    this.index = 0; this.phase = 'follow'; this.weave = 0; this.weaveSide = 0; this.cooldown = 0;
    this.message = `${LESSON_HELP.course} Start at station 1.`;
  }
  get station() { return this.stations[this.index]; }
  // Where the next thing to do is (the runner rings it).
  get target() {
    const s = this.station; if (!s) return this.finish;
    if (s.kind === 'weave') return { x: s.poles[Math.min(this.weave, s.poles.length - 1)], y: s.y };
    if (s.kind === 'tunnel') return this.phase === 'tunnel' ? s.exit : s.entrance;
    return s;
  }
  update(dt, handler) {
    const s = this.station, prev = { x: this.pet.x, y: this.pet.y };
    this.cooldown = Math.max(0, this.cooldown - dt);
    if (this.phase === 'tunnel') return this.inTunnel(dt, handler, s);
    if (this.phase === 'out') {
      if (this.moveTo(dt, this.outTo, 90) < 1) { this.phase = 'follow'; this.resetTrail(handler); this.pet.alpha = 1; }
      return;
    }
    this.follow(dt, handler);
    if (!s) {
      if (dist(this.pet, this.finish) < 22) { this.complete = true; this.good(this.faults ? `Finished, with ${this.faults} slip${this.faults > 1 ? 's' : ''}.` : `A clean round! ${this.name} is very pleased with ${this.name === 'Emilio' ? 'himself' : 'that'}.`); }
      else this.hint('Last bit: lead the way to the finish flag.');
      return;
    }
    const crossed = x => (prev.x - x) * s.dir < 0 && (this.pet.x - x) * s.dir >= 0;
    if (s.kind === 'hurdle' && crossed(s.x)) {
      if (Math.abs(this.pet.y - s.y) > 11) { this.message = 'Through the posts, not round them. Come back and try it again.'; return; }
      const speed = Math.hypot(this.pet.vx || 0, this.pet.vy || 0), straight = Math.abs(this.pet.vy || 0) <= Math.abs(this.pet.vx || 0) * 0.6;
      if (speed >= this.runUp && (straight || this.level < 3)) { this.pet.jump = 0.45; this.good(`Over! Lovely run-up.`); }
      else this.fault(speed < this.runUp ? `Clunk. ${this.name} trots into the bar. Run at the hurdle for a run-up.` : `Clunk. Too much of an angle. Run straight at the hurdle.`);
      this.next();
    } else if (s.kind === 'weave') {
      const pole = s.poles[this.weave];
      if (this.resetWeave) {
        if ((this.pet.x - s.poles[0]) * s.dir < -8) { this.resetWeave = false; this.message = 'Back at the start of the weave. Zigzag: one side of each pole, then the other.'; }
        return;
      }
      if (!crossed(pole)) return;
      const dy = this.pet.y - s.y;
      if (this.weave === 0 && (Math.abs(dy) > 16 || Math.abs(dy) < 1.5)) return;   // just walking past, not into the weave
      const side = Math.sign(dy);
      if (Math.abs(dy) < 1.5 || Math.abs(dy) > 16 || (this.weave > 0 && side === this.weaveSide)) {
        this.fault(Math.abs(dy) > 16 ? `${this.name} skipped pole ${this.weave + 1}. Go back to the start of the weave.` : `Wrong side of pole ${this.weave + 1}. Go back to the start of the weave.`);
        this.weave = 0; this.resetWeave = true; return;
      }
      this.weaveSide = side; this.weave++;
      if (this.weave >= s.poles.length) { this.good('Weave done! Nice zigzag.'); this.next(); }
      else this.message = `Pole ${this.weave} done. Now the other side of pole ${this.weave + 1}.`;
    } else if (s.kind === 'tunnel') {
      const side = (this.pet.x - s.entrance.x) * s.dir <= 4;
      if (!this.cooldown && side && dist(this.pet, s.entrance) < 20) { this.phase = 'tunnel'; this.wait = 0; this.message = `${this.name} goes into the tunnel. Quick, round to the far end and wait there.`; }
      else this.hint(`Lead ${this.name} to the tunnel mouth (station ${this.index + 1}).`);
    } else this.hint(`Station ${this.index + 1}: ${s.kind === 'hurdle' ? 'run at the hurdle' : s.kind}.`);
  }
  inTunnel(dt, handler, s) {
    this.pet.alpha = 0.35;
    const mid = { x: s.x, y: s.y };
    this.moveTo(dt, mid, 60); this.wait += dt;
    if (dist(handler, s.exit) < 28) {
      this.phase = 'out'; this.outTo = { x: s.exit.x + 6 * s.dir, y: s.y }; this.good(`${this.name} pops out the far end, straight to you.`); this.next(); return;
    }
    if (this.wait > (this.level >= 3 ? 2.5 : 4)) {
      this.phase = 'out'; this.outTo = { x: s.entrance.x - 10 * s.dir, y: s.y }; this.cooldown = 1.5;
      this.fault(`Nobody at the far end, so ${this.name} backs out. Lead them in again, then wait at the other end.`);
    }
  }
  next() { this.index++; this.weave = 0; this.weaveSide = 0; this.resetWeave = false; }
  props() {
    const out = this.stations.map((s, i) => ({ ...s, n: i + 1, done: i < this.index }));
    out.push({ kind: 'flag', ...this.finish });
    return out;
  }
}

// Stanley: only comes while you stand still and look away.
export class LookAwayLesson extends Lesson {
  constructor(opts) {
    super('lookaway', opts);
    this.visits = 0; this.need = 3; this.timeLimit = 90; this.peeked = false;
    this.speed = 30 * (1 + this.level * 0.08);
    this.spot = this.farSpot(0, this.start); this.pet.x = this.spot.x; this.pet.y = this.spot.y; this.phase = 'waiting';
  }
  farSpot(i, from) {
    const a = this.area;
    for (let k = 0; k < 12; k++) {
      const p = { x: a.x + 16 + this.rand(i * 13 + k) * (a.w - 32), y: a.y + 16 + this.rand(i * 17 + k + 5) * (a.h - 32) };
      if (dist(p, from) > Math.min(a.w, a.h) * 0.6) return p;
    }
    return { x: a.x + a.w - 16, y: a.y + 16 };
  }
  update(dt, handler) {
    if (this.phase === 'leaving') { if (this.moveTo(dt, this.spot, 70) < 1) this.phase = 'waiting'; return; }
    const [fx, fy] = DIRS[handler.dir] || [0, 1], d = dist(handler, this.pet) || 1;
    const look = (fx * (this.pet.x - handler.x) + fy * (this.pet.y - handler.y)) / d;   // 1: looking right at the pet
    const still = (handler.speed || 0) < 5, away = look < -0.2;
    if (d < 14) {
      this.visits++; this.good(this.visits >= this.need ? `${this.name} sits at your feet. That is three. Good dog.` : `${this.name} sits at your feet! ${this.visits} of ${this.need}. Off ${this.name} goes again.`);
      if (this.visits >= this.need) { this.complete = true; return; }
      this.spot = this.farSpot(this.visits, handler); this.phase = 'leaving'; this.approaching = false; return;
    }
    if (still && away) {
      this.moveTo(dt, handler, this.speed); this.approaching = true; this.peeked = false;
      this.hint(`${this.name} pads closer. Do not look.`);
    } else {
      this.pet.moving = false;
      if (this.approaching && look > 0.5 && d < 70 && !this.peeked) { this.peeked = true; this.fault(`You peeked. ${this.name} stops dead and pretends to sniff something.`); }
      if (this.level >= 2 && look > 0.5) this.moveTo(dt, { x: this.pet.x + (this.pet.x - handler.x) / d * 20, y: this.pet.y + (this.pet.y - handler.y) / d * 20 }, 16);
      if (look > 0.5) this.approaching = false;
      if (!this.peeked) this.hint(still ? `Turn your back on ${this.name} and wait.` : `Stand still. ${this.name} does not come to a moving target.`);
    }
    this.clampPet();
  }
  clampPet() { const a = this.area; this.pet.x = Math.max(a.x + 6, Math.min(a.x + a.w - 6, this.pet.x)); this.pet.y = Math.max(a.y + 6, Math.min(a.y + a.h - 6, this.pet.y)); }
  props() { return []; }
}

// Poppy and Rusty: charges at you whenever you stop.
export class ChargeLesson extends Lesson {
  constructor(opts) {
    super('charge', opts);
    const L = this.level, a = this.area, flags = L >= 2 ? 3 : 2, bins = [1, 2, 3, 4, 5][L];
    this.timeLimit = 100; this.windup = L >= 4 ? 0.45 : 0.6; this.chargeSpeed = this.speedy ? 175 : 140;
    const used = [this.start];
    const place = (i, gap) => {
      for (let k = 0; k < 20; k++) {
        const p = { x: a.x + 30 + this.rand(i * 31 + k) * (a.w - 50), y: a.y + 14 + this.rand(i * 37 + k + 7) * (a.h - 28) };
        if (used.every(q => dist(p, q) > gap)) { used.push(p); return p; }
      }
      const p = { x: a.x + 30 + (i * 47) % (a.w - 50), y: a.y + 20 + (i * 29) % (a.h - 40) }; used.push(p); return p;
    };
    this.flags = Array.from({ length: flags }, (_, i) => ({ ...place(i, 50), hit: false }));
    this.bins = Array.from({ length: bins }, (_, i) => place(100 + i, 26));
    this.pet.x = this.start.x; this.pet.y = this.start.y; this.phase = 'sit'; this.stillFor = 0; this.dazed = 0;
  }
  update(dt, handler) {
    const still = (handler.speed || 0) < 5;
    if (this.phase === 'dazed') { this.dazed -= dt; this.pet.moving = false; if (this.dazed <= 0) this.phase = 'sit'; return; }
    if (this.phase === 'charge') {
      const before = { x: this.pet.x, y: this.pet.y };
      const left = this.moveTo(dt, this.goal, this.chargeSpeed);
      const near = p => { // closest point of this step's segment to p
        const vx = this.pet.x - before.x, vy = this.pet.y - before.y, len2 = vx * vx + vy * vy || 1;
        const t = Math.max(0, Math.min(1, ((p.x - before.x) * vx + (p.y - before.y) * vy) / len2));
        return dist(p, { x: before.x + vx * t, y: before.y + vy * t });
      };
      const bin = this.bins.find(b => near(b) < 8);
      if (bin) { this.phase = 'dazed'; this.dazed = 0.9; this.fault(`BONK. ${this.name} charges straight into a bin. Fine, just a bit embarrassed.`); return; }
      for (const f of this.flags) if (!f.hit && near(f) < 12) { f.hit = true; this.good(`Flag! ${this.flags.filter(g => g.hit).length} of ${this.flags.length}.`); }
      if (this.flags.every(f => f.hit)) { this.complete = true; this.message = `Every flag! ${this.name} flops down, delighted.`; return; }
      if (left < 1 || dist(this.pet, handler) < 12) { this.phase = 'sit'; this.stillFor = 0; }
      return;
    }
    this.pet.moving = false;
    this.stillFor = still ? this.stillFor + dt : 0;
    if (this.stillFor >= this.windup && dist(handler, this.pet) > 16) {
      this.phase = 'charge'; this.goal = { x: handler.x, y: handler.y }; this.stillFor = 0;
      this.hint(`${this.name} charges!`);
    } else if (!still) this.hint(`${this.name} watches you, bum wiggling. Stop where the charge will cross a flag, clear of the bins.`);
  }
  props() { return [...this.bins.map(b => ({ kind: 'bin', ...b })), ...this.flags.map(f => ({ kind: 'pennant', ...f }))]; }
}

// Chloe, Girlie, Marty: herd the chooks into the pen.
export class HerdLesson extends Lesson {
  constructor(opts) {
    super('herd', opts);
    const a = this.area, L = this.level;
    this.timeLimit = 140; this.par = [70, 65, 60, 55, 50][L];
    const pw = 44, ph = 38;
    // The pen sits hard against the edge, so nobody can get stuck behind it.
    this.pen = { x: a.x + a.w - pw, y: a.y + a.h / 2 - ph / 2, w: pw, h: ph, gap: L >= 3 ? 16 : 20 };
    const p = this.pen, g0 = p.y + p.h / 2 - p.gap / 2, g1 = p.y + p.h / 2 + p.gap / 2, t = 4;
    this.solids.push({ x: p.x, y: p.y, w: p.w, h: t }, { x: p.x, y: p.y + p.h - t, w: p.w, h: t }, { x: p.x + p.w - t, y: p.y, w: t, h: p.h },
      { x: p.x, y: p.y, w: t, h: g0 - p.y }, { x: p.x, y: g1, w: t, h: p.y + p.h - g1 });
    const n = L >= 2 ? 4 : 3;
    this.chooks = Array.from({ length: n }, (_, i) => ({ x: a.x + a.w * (0.35 + this.rand(i) * 0.25), y: a.y + 18 + this.rand(i + 9) * (a.h - 36), penned: false, flip: false, moving: false, wob: this.rand(i + 20) * 6 }));
    this.pet.x = this.start.x; this.pet.y = this.start.y;
  }
  inPen(c) { const p = this.pen; return c.x > p.x + 4 && c.x < p.x + p.w - 4 && c.y > p.y + 4 && c.y < p.y + p.h - 4; }
  update(dt, handler) {
    this.follow(dt, handler, 12);
    const a = this.area, p = this.pen, g0 = p.y + p.h / 2 - p.gap / 2 + 2, g1 = p.y + p.h / 2 + p.gap / 2 - 2;
    for (const c of this.chooks) {
      const dp = dist(c, this.pet), dh = dist(c, handler);
      let vx = 0, vy = 0;
      if (c.penned) { vx = Math.sin(this.elapsed * 1.3 + c.wob) * 6; vy = Math.cos(this.elapsed + c.wob) * 4; }
      else if (dp < 46 || dh < 26) {   // run away from the dog (and you), a bit flappy
        const from = dp < 46 ? this.pet : handler, d = Math.max(1, dist(c, from));
        vx = (c.x - from.x) / d * 46 + Math.sin(this.elapsed * 7 + c.wob) * 10; vy = (c.y - from.y) / d * 46 + Math.cos(this.elapsed * 6 + c.wob) * 10;
      } else { vx = Math.sin(this.elapsed * 0.9 + c.wob) * 8; vy = Math.cos(this.elapsed * 0.7 + c.wob * 2) * 6; }
      // Chooks shy away from the fence, so they slide along it instead of
      // jamming in a corner, and there is always room for the dog behind them.
      if (!c.penned) {
        const m = 18, k = 4;
        if (c.x < a.x + m) vx += (a.x + m - c.x) * k;
        if (c.x > a.x + a.w - m) vx -= (c.x - (a.x + a.w - m)) * k;
        if (c.y < a.y + m) vy += (a.y + m - c.y) * k;
        if (c.y > a.y + a.h - m) vy -= (c.y - (a.y + a.h - m)) * k;
      }
      let nx = c.x + vx * dt, ny = c.y + vy * dt;
      // The pen walls: only the gap lets a chook in, and nothing gets out.
      const inside = c.penned;
      const xIn = x => x > p.x && x < p.x + p.w, yIn = y => y > p.y && y < p.y + p.h;
      if (!inside && !xIn(c.x) && xIn(nx) && yIn(ny) && !(ny > g0 && ny < g1 && nx < p.x + 8)) nx = c.x;
      if (!inside && !yIn(c.y) && yIn(ny) && xIn(nx)) ny = c.y;
      if (inside) { nx = Math.max(p.x + 6, Math.min(p.x + p.w - 6, nx)); ny = Math.max(p.y + 6, Math.min(p.y + p.h - 6, ny)); }
      c.moving = Math.hypot(nx - c.x, ny - c.y) > 0.3; if (Math.abs(nx - c.x) > 0.2) c.flip = nx < c.x;
      const e = c.penned ? 4 : 11;   // the dog stops 6 from the edge, so it can always get round a chook
      c.x = Math.max(a.x + e, Math.min(a.x + a.w - e, nx)); c.y = Math.max(a.y + e, Math.min(a.y + a.h - e, ny));
      if (!c.penned && this.inPen(c)) {
        c.penned = true; const left = this.chooks.filter(k => !k.penned).length;
        this.good(left ? `In the pen! ${left} to go.` : 'All the chooks are in. Gate shut!');
      }
    }
    if (this.chooks.every(c => c.penned)) {
      this.complete = true;
      // Slower than par counts as a slip or two.
      this.faults = this.elapsed <= this.par ? 0 : this.elapsed <= this.par + 25 ? 1 : 3;
    } else this.hint(`${this.name} follows your path. Swing round behind the chooks and push them to the gap.`);
  }
  props() { return [{ kind: 'pen', ...this.pen }, ...this.chooks.map(c => ({ kind: 'chook', ...c }))]; }
}

// Spooky, Salami, Princess, Emilio: hide and seek in the bushes.
export class SeekLesson extends Lesson {
  constructor(opts) {
    super('seek', opts);
    const a = this.area, L = this.level;
    this.timeLimit = 90; this.need = 3; this.finds = 0;
    this.hop = opts.phase ? 4.5 - L * 0.4 : 8 - L * 0.6;   // seconds before the pet moves to another bush
    this.rustleEvery = 2.6 + L * 0.5;
    const n = 5 + (L >= 2 ? 1 : 0);
    this.bushes = Array.from({ length: n }, (_, i) => ({
      x: a.x + 24 + ((i % 3) + 0.5) / 3 * (a.w - 48) + (this.rand(i) - 0.5) * 20,
      y: a.y + (i < 3 ? 0.3 : 0.75) * a.h + (this.rand(i + 7) - 0.5) * 10,
    }));
    if (n > 6) this.bushes.length = 6;
    this.at = Math.floor(this.rand(1) * this.bushes.length); this.since = 0; this.rustle = 0.8; this.searched = -1;
    this.hidePet();
  }
  hidePet() { const b = this.bushes[this.at]; this.pet.x = b.x; this.pet.y = b.y; this.pet.alpha = 0; this.pet.moving = false; }
  update(dt, handler) {
    if (this.phase === 'found') {
      this.showFor -= dt; this.pet.alpha = 1;
      if (this.showFor <= 0) { this.phase = null; this.move(this.finds * 3 + 11); }
      return;
    }
    this.since += dt; this.rustle -= dt;
    if (this.rustle <= -0.6) this.rustle = this.rustleEvery;
    if (this.since >= this.hop) this.move(Math.floor(this.elapsed * 10));
    const near = this.bushes.findIndex(b => dist(handler, b) < 16);
    if (near === this.at) {
      this.finds++; this.phase = 'found'; this.showFor = 1.1; this.searched = -1;
      this.good(this.finds >= this.need ? `Found ${this.name}! Three finds. ${this.name} looks thrilled to be caught.` : `Found ${this.name}! ${this.finds} of ${this.need}. Close your eyes... hiding again.`);
      if (this.finds >= this.need) this.complete = true;
      return;
    }
    if (near >= 0 && near !== this.searched) { this.searched = near; this.fault('Nobody in that bush. Just a snail. Watch for the rustle.'); }
    if (near < 0) this.searched = -1;
  }
  move(i) {
    const options = this.bushes.map((_, k) => k).filter(k => k !== this.at);
    this.at = options[Math.floor(this.rand(i) * options.length)]; this.since = 0; this.rustle = 0.5; this.hidePet();
  }
  get rustling() { return this.rustle > 0 && this.rustle < 0.6 ? this.at : -1; }
  props() { return this.bushes.map((b, i) => ({ kind: 'bush', ...b, rustle: i === this.rustling })); }
}

export function makeLesson(kind, opts) {
  const C = { course: CourseLesson, lookaway: LookAwayLesson, charge: ChargeLesson, herd: HerdLesson, seek: SeekLesson }[kind];
  return C ? new C(opts) : null;
}

// The open area a lesson needs (in tiles), near the player. map: { w, h, solid }.
// A few solid things (a pot plant, the trampoline) are fine: the lesson lets
// you walk over them. Water, walls and exits are not, so you cannot wander off.
export function findLessonArea(map, player, { w = 15, h = 8, tile = 16, exits = [], maxSolid = 0.12 } = {}) {
  const exit = (x, y) => exits.some(e => x >= e.x - 1 && x < e.x + e.w + 1 && y >= e.y - 1 && y < e.y + e.h + 1);
  const water = (x, y) => map.ground?.[y]?.[x] === '~';
  let best = null;
  for (const [W, H] of [[w, h], [w - 2, h - 1]]) {
    for (let y = 1; y + H < map.h; y++) for (let x = 1; x + W < map.w; x++) {
      let solid = 0, ok = true;
      for (let j = 0; j < H && ok; j++) for (let i = 0; i < W && ok; i++) {
        if (exit(x + i, y + j) || water(x + i, y + j)) ok = false;
        else if (map.solid[(y + j) * map.w + x + i]) { solid++; if (solid > W * H * maxSolid) ok = false; }
      }
      if (!ok) continue;
      const cx = (x + W / 2) * tile, cy = (y + H / 2) * tile;
      const cost = solid * 40 + Math.hypot(cx - player.x, cy - player.y);
      if (!best || cost < best.cost) best = { x: x * tile, y: y * tile, w: W * tile, h: H * tile, cost };
    }
    if (best) break;
  }
  if (!best) return null;
  const { cost, ...area } = best; void cost;
  return area;
}
