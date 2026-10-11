// The fishing fight. Pure state, no DOM, so it can be tested in Node.
//
// When a fish bites it bolts away from the green zone, fast at first. Each tap
// (A, Space, a click or a tap on the panel) pulls it back towards the middle of
// the zone. Hold it inside the zone long enough and you land it. A fresh fish
// barely counts towards landing, so it cannot be caught on the first pass.
//
// Ways to lose it:
//   snap     too much tension: tapping too hard against a fresh fish
//   thrown   the fish sits at the far end of the line too long and throws the hook
//   time     it tires you out before you land it
//
// FIGHT is [speed, dart] per fish: how hard it pulls, and how often it darts
// (a sudden change of direction). Eels thrash, carp are lazy, boots just sink.
// The numbers live with each fish in data/fishing.js (FISH).
import { FISH } from '../data/fishing.js';
export const FIGHT = Object.fromEntries(Object.entries(FISH).map(([id, f]) => [id, f.fight]));

// How much easier a fight is (0 to MAX_EASE): fishing level, the rod and the
// golden lure. Each level is a bit easier; each better rod a bit more.
export const MAX_EASE = 0.5;
export const fishingEase = ({ level = 1, rodTier = 1, lure = 0 } = {}) =>
  Math.min(MAX_EASE, Math.max(0, (level - 1) * 0.035 + (rodTier - 1) * 0.05 + lure));

export const FIGHT_TUNING = {
  timeLimit: 30,      // seconds before the fish gets away regardless
  edgeLimit: 1.6,     // seconds pinned at the end of the line before it throws the hook
  kick: 0.3,          // how hard one tap pulls the fish back
  pull: 1.25,         // how hard the fish swims away (times its speed)
  drag: 1.8,          // water drag on the fish
  tapTension: 0.13,   // tension added by a tap against a tired fish
  freshTension: 0.13, // extra tension per tap against a fresh fish
  slack: 0.5,         // tension that eases off each second
  drain: 0.22,        // landing progress lost each second outside the zone
  taut: 1.5,          // seconds after a tap that the line stays taut
};

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

export class FishFight {
  // zone: width of the green zone (0 to 1). rng: injectable for tests.
  // ease (0 to MAX_EASE, see fishingEase): a wider zone, a calmer fish, a
  // line that strains less and a shorter hold.
  constructor({ fish, zone = 0.2, ease = 0, rng = Math.random } = {}) {
    const [speed0, dart0] = FIGHT[fish] || [0.84, 0.3];
    ease = clamp(ease, 0, MAX_EASE);
    const speed = speed0 * (1 - ease * 0.35), dart = dart0 * (1 - ease * 0.5);
    this.fish = fish; this.speed = speed; this.dart = dart; this.rng = rng; this.ease = ease;
    this.strain = 1 - ease * 0.6;
    this.zw = clamp(zone * 1.2 * (1 + ease), 0.12, 0.45);
    this.z0 = 0.15 + rng() * (0.7 - this.zw);
    this.centre = this.z0 + this.zw / 2;
    this.pos = this.centre;
    this.run = rng() < 0.5 ? -1 : 1;
    // The bite: it bolts straight off, fast.
    this.vel = this.run * (0.9 + speed * 0.5);
    this.stamina = 1;
    this.tire = 6 + speed * 4;             // seconds until it is worn out
    this.hold = (2 + speed * 1.4) * (1 - ease * 0.4);   // seconds in the zone needed (once tired)
    this.tension = 0; this.progress = 0; this.edge = 0; this.t = 0;
    this.result = null;                    // 'caught' | 'snap' | 'thrown' | 'time'
    this.pulledAt = -99;
  }

  get inZone() { return this.pos >= this.z0 && this.pos <= this.z0 + this.zw; }
  get over() { return this.result !== null; }

  // One tap on the reel.
  tap() {
    if (this.over) return false;
    const toward = Math.sign(this.centre - this.pos) || 0;
    this.vel += toward * FIGHT_TUNING.kick;
    this.tension += (FIGHT_TUNING.tapTension + FIGHT_TUNING.freshTension * this.stamina) * this.strain;
    this.pulledAt = this.t;
    if (this.tension >= 1) this.result = 'snap';
    return true;
  }

  // Advance by dt seconds. Returns the result once the fight is over.
  step(dt) {
    if (this.over) return this.result;
    const T = FIGHT_TUNING;
    dt = Math.min(dt, 0.05);
    this.t += dt;
    this.stamina = Math.max(0, this.stamina - dt / this.tire);
    // Darting: a sudden change of heart about which way to swim.
    if (this.rng() < this.dart * 1.2 * dt) this.run = -this.run;
    this.vel += this.run * this.speed * T.pull * (0.45 + 0.55 * this.stamina) * dt;
    this.vel *= Math.exp(-T.drag * dt);
    this.pos += this.vel * dt;
    if (this.pos <= 0 || this.pos >= 1) {
      this.pos = clamp(this.pos); this.vel = 0; this.edge += dt;
      if (this.edge >= T.edgeLimit) this.result = 'thrown';
    } else this.edge = Math.max(0, this.edge - dt * 0.5);
    this.tension = Math.max(0, this.tension - T.slack * dt);
    // Only a taut line (reeled in the last moment) counts towards landing it.
    if (this.inZone && this.t - this.pulledAt <= T.taut) this.progress += dt * (0.25 + 0.75 * (1 - this.stamina)) / this.hold;
    else this.progress = Math.max(0, this.progress - T.drain * dt);
    if (!this.over && this.progress >= 1) { this.progress = 1; this.result = 'caught'; }
    if (!this.over && this.t >= T.timeLimit) this.result = 'time';
    return this.result;
  }
}
