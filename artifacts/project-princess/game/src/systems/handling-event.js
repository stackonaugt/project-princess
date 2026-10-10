import { COURSES } from './course.js';

export const HALL_AREA = { x: 8 * 16, y: 8 * 16, w: 24 * 16, h: 13 * 16 };
const point = (x, y, area = HALL_AREA) => ({ x: area.x + x / 100 * area.w, y: area.y + y / 100 * area.h });
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = n => Math.max(0, Math.min(10, Math.round(n)));

// The handler is always controlled by the player. Only the dog performs a
// commanded obstacle animation; walking never teleports the handler.
export class HandlingEvent {
  // speedy: a Speed type pet runs the agility course faster. evolved: an
  // evolved pet carries itself better and gets a presentation bonus.
  constructor(tier = 'novice', mode = 'course', variant = 0, { area = HALL_AREA, speedy = false, evolved = false } = {}) {
    this.tier = tier; this.mode = mode; this.speedy = speedy; this.evolved = evolved; this.course = COURSES[tier] || COURSES.novice;
    const kinds = mode === 'course' ? this.course.stations :
      mode === 'presentation' ? ['heel', 'sit', 'stay'] :
      tier === 'novice' ? ['heel', 'sit', 'stay', 'recall'] :
      tier === 'open' ? ['heel', 'down', 'heel', 'stay', 'recall'] :
      ['heel', 'sit', 'heel', 'down', 'stay', 'heel', 'recall'];
    const points = [[20, 80], [50, 80], [80, 65], [80, 25], [50, 20], [25, 30], [15, 55]];
    this.stations = kinds.map((kind, i) => ({ kind, ...point(variant % 2 ? 100 - points[i][0] : points[i][0], points[i][1], area) }));
    this.start = point(variant % 2 ? 88 : 10, 85, area);
    this.dog = { ...this.start }; this.index = 0; this.phase = 'approach';
    this.elapsed = 0; this.nearTime = 0; this.hold = 0; this.actionTime = 0;
    this.faults = 0; this.separation = 0; this.complete = false; this.jump = 0;
    this.message = 'Walk your dog to the numbered station, then give one clear cue.';
  }
  get station() { return this.stations[this.index]; }
  get target() {
    if (this.phase !== 'weave') return this.station;
    return { x: this.station.x + (this.weaveIndex - 2) * 9, y: this.station.y + (this.weaveIndex % 2 ? -11 : 11) };
  }
  get ready() { return this.nearTime >= .3 && this.nearTime <= (this.tier === 'champion' ? 1 : 1.6); }
  get defaultCue() {
    if (this.phase === 'weave') return this.weaveIndex % 2 ? 'right' : 'left';
    if (this.phase === 'hold') return 'recall';
    return this.station?.kind === 'recall' ? 'stay' : this.station?.kind;
  }
  // feedback: the last cue's verdict, shown as a tick or a cross over the dog.
  fault(text) { this.faults++; this.message = text; this.feedback = { ok: false, n: (this.feedback?.n || 0) + 1 }; }
  good() { this.feedback = { ok: true, n: (this.feedback?.n || 0) + 1 }; }
  advance() {
    this.index++; this.phase = 'approach'; this.nearTime = 0; this.jump = 0;
    if (this.index >= this.stations.length) { this.complete = true; this.message = 'Run complete. Walk to the judges for your result.'; }
    else this.message = `Next: station ${this.index + 1}. Walk there together.`;
  }
  cue(id, handler) {
    if (this.complete || this.phase === 'action') return;
    const s = this.station;
    if (this.phase === 'hold') {
      const required = s.kind === 'recall' ? .5 : this.tier === 'champion' ? 5 : 3;
      if (id === 'stay') { this.message = 'One calm cue is enough. Let your dog hold the position.'; return; }
      if (id !== 'recall' || this.hold < required || distance(handler, s) < 28)
        return this.fault('Too early. Step away, let your dog wait, then call them back.');
      this.phase = 'action'; this.actionTime = 0; this.actionStart = { ...this.dog }; this.actionEnd = { x: handler.x - 7, y: handler.y };
      this.good(); this.message = 'Your dog comes back to you.'; return;
    }
    if (this.phase === 'weave') {
      const expected = this.weaveIndex % 2 ? 'right' : 'left';
      if (id !== expected)
        return this.fault(`Wrong side. Pole ${this.weaveIndex + 1} goes on the ${expected}.`);
      if (distance(this.dog, this.target) > 20)
        return this.fault(`Too far from pole ${this.weaveIndex + 1}. Walk to the marked pole, then cue ${expected === 'left' ? 'Left' : 'Right'}.`);
      this.good();
      if (++this.weaveIndex >= 5) this.advance();
      else this.message = `Pole ${this.weaveIndex} done. Pole ${this.weaveIndex + 1}: walk to it and cue ${this.weaveIndex % 2 ? 'Right' : 'Left'}.`;
      return;
    }
    if (distance(this.dog, s) > 17 || distance(handler, this.dog) > 30)
      return this.fault('Your dog is not in position. Walk closer together before giving the cue.');
    if (id !== (s.kind === 'recall' ? 'stay' : s.kind))
      return this.fault('That is not the requested cue. Look at the station and try again.');
    if (s.kind === 'jump' && !this.ready) this.fault('The jump was rushed or late. Wait for your dog to gather their stride.');
    if (s.kind === 'weave') { this.good(); this.phase = 'weave'; this.weaveIndex = 0; this.message = 'Weave: walk to the marked pole and cue Left, then Right, then Left, Right, Left.'; return; }
    if (s.kind === 'stay' || s.kind === 'recall') {
      this.good(); this.phase = 'hold'; this.hold = 0; this.dog = { x: s.x, y: s.y };
      this.message = 'Your dog waits on the mat. Walk a few steps away before calling Come.'; return;
    }
    const previous = this.index ? this.stations[this.index - 1] : this.start;
    const length = distance(previous, s) || 1;
    this.actionEnd = ['jump', 'tunnel'].includes(s.kind) ?
      { x: s.x + (s.x - previous.x) / length * 23, y: s.y + (s.y - previous.y) / length * 23 } : { ...this.dog };
    if (!(s.kind === 'jump' && !this.ready)) this.good();
    this.phase = 'action'; this.actionTime = 0; this.actionStart = { ...this.dog }; this.message = `${s.kind === 'down' ? 'Down' : s.kind} demonstrated. Keep handling calmly.`;
  }
  tick(dt, handler) {
    if (this.complete) return;
    dt = Math.max(0, Math.min(.05, dt)); this.elapsed += dt;
    if (this.phase === 'action') {
      this.actionTime += dt;
      const progress = Math.min(1, this.actionTime / .9);
      const ease = progress * progress * (3 - 2 * progress);
      const from = this.actionStart || this.dog;
      this.dog.x = from.x + (this.actionEnd.x - from.x) * ease;
      this.dog.y = from.y + (this.actionEnd.y - from.y) * ease;
      this.jump = this.station.kind === 'jump' ? Math.sin(Math.min(1, this.actionTime / .9) * Math.PI) * 12 : 0;
      if (this.actionTime >= .9) this.advance();
      return;
    }
    if (this.phase === 'hold') {
      this.hold += dt;
      if (distance(handler, this.dog) > 95) {
        this.fault('You went too far; your dog broke the stay. Bring them back and reset.');
        this.phase = 'approach'; this.hold = 0;
      } else {
        const seconds = this.station.kind === 'recall' ? .5 : this.tier === 'champion' ? 5 : 3;
        this.message = this.hold >= seconds ? 'Stay held. Step clear of the mat and cue Come.' : 'Keep walking calmly away. Your dog is holding the stay.';
      }
      return;
    }
    const target = { x: handler.x - 9, y: handler.y - 1 }, d = distance(this.dog, target);
    this.moving = d > 3; this.flip = target.x < this.dog.x;
    if (d > 2) {
      const step = Math.min(d, dt * (this.tier === 'champion' ? 48 : 58) * (this.speedy && this.mode === 'course' ? 1.3 : 1));
      this.dog.x += (target.x - this.dog.x) / d * step;
      this.dog.y += (target.y - this.dog.y) / d * step;
    }
    if (distance(handler, this.dog) > 31) this.separation += dt;
    if (this.phase === 'approach') {
      if (distance(this.dog, this.station) < 17) {
        this.nearTime = (this.nearTime + dt) % 2.6;
        if (this.station.kind === 'jump') this.message = this.ready ? 'Your dog gathers their stride. Cue Jump now.' : 'Wait for your dog to gather their stride.';
        else this.message = `Dog in position: cue ${this.defaultCue === 'recall' ? 'Come' : this.defaultCue}.`;
      } else this.nearTime = 0;
    }
  }
  result() {
    const targetTime = this.mode === 'presentation' ? 45 : this.tier === 'champion' ? 100 : 110;
    const marks = [
      clamp(10 - this.faults * (this.tier === 'champion' ? 1.5 : 1)),
      clamp(10 - this.separation * .35 - this.faults * .2),
      clamp(10 - Math.max(0, this.elapsed - targetTime) / 12 - this.faults * .25),
    ];
    if (this.evolved && this.mode === 'presentation') for (let i = 0; i < marks.length; i++) marks[i] = clamp(marks[i] + 1.5);
    const score = Math.round(marks.reduce((a, b) => a + b, 0) / 30 * 100);
    return { score, complete: this.complete, passed: this.complete && score >= this.course.pass,
      cleanRuns: this.complete && score >= this.course.pass ? 3 : this.complete && score >= this.course.pass - 5 ? 2 : 1,
      marks, faults: this.faults, seconds: Math.round(this.elapsed), mode: this.mode };
  }
}
