// Baking model. Pure state, no DOM. Every bake has its own recipe in
// data/cooking.js (BAKES): its ingredients and their colours, how many lemons
// to squeeze, how hot and how long the oven runs, the toppings that suit it
// and the piping pattern you trace on top.
//
//   baked:  mixing (squeeze lemons first if the recipe has juice), oven, finishing.
//           Each round is worth one star; good or bad juicing is half a star either way.
//   drink:  squeezing, then sugar and water. 1.5 stars each (lemonade).
//
// The Great Coburg Bake Off uses the same session with competition: true, and
// the judges mark each round out of 10 from the same qualities.
import { BAKES } from '../data/cooking.js';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

// The generic bake, used when no recipe is given (and by the older tests).
export const INGREDIENTS = [
  { id: "flour", name: "Flour", dry: true, target: 6, colour: "#f3ecdc" },
  { id: "sugar", name: "Caster sugar", dry: true, target: 4, colour: "#fbfaf5" },
  { id: "eggs", name: "Eggs", dry: false, target: 3, colour: "#f2b632" },
  { id: "butter", name: "Soft butter", dry: false, target: 5, colour: "#f2d36b" },
  { id: "milk", name: "Milk", dry: false, target: 2, colour: "#ffffff" },
];
const GENERIC = {
  ingredients: INGREDIENTS,
  oven: { heat: 0.6, time: 16, checks: 3, fragile: 0 },
  look: { shape: 'layer', crumb: '#f4e0a8', crust: '#d0a050' },
  toppings: [{ id: 'cream', name: 'Cream', colour: '#fffaf0', fit: 1 }, { id: 'icing', name: 'Icing', colour: '#fbe4ee', fit: 0.9 }, { id: 'choc', name: 'Chocolate', colour: '#4a2616', fit: 0.8 }, { id: 'banana', name: 'Banana cream', colour: '#f2e49a', fit: 0.4 }],
  piping: 'ring',
};
export const bakeSpec = id => BAKES[id] || GENERIC;

export const POUR_MAX = 10;
// Units a held pour adds per second (the cup holds POUR_MAX). Nothing comes back out.
export const POUR_RATE = { practice: 5, competition: 6 };
// Seconds the fill lines show before you have to remember them.
export const FLASH_TIME = 3;
// Competition only: seconds to finish the cake before the judges call time.
export const DECO_TIME = 30;
export const MIX_METHODS = [
  { id: "fold", name: "Fold", weight: 1 },
  { id: "whisk", name: "Whisk", weight: 2 },
];

const STAGE_INFO = {
  juice: { name: "Squeezing", label: "Done squeezing", instruction: "Hold Squeeze to juice each lemon. Steady pressure works. Squeeze too hard and the pips go in." },
  mix: { name: "Mixing", label: "Batter is ready", instruction: "Watch the fill lines: they vanish after a moment. Hold Pour to fill each cup to the line, in order. Nothing comes back out. Then mix." },
  oven: { name: "Baking", label: "Take out of oven", instruction: "The door is shut, so you cannot see the cake. Set the dial, watch the timer and peek only when you must: every peek lets heat out." },
  finish: { name: "Finishing", label: "Present the cake", instruction: "Pick a topping that suits this bake, then trace the piping pattern carefully with your finger or mouse." },
};
export const BAKE_STAGES = ['mix', 'oven', 'finish'].map(k => ({ activity: k, ...STAGE_INFO[k] }));

// Piping patterns, as strokes of points on the cake top (0 to 1 each way).
const circle = (cx, cy, r, n = 16, turns = 1, grow = 0) => Array.from({ length: n * turns + 1 }, (_, i) => {
  const a = i / n * Math.PI * 2 - Math.PI / 2, rr = r + grow * i / (n * turns);
  return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
});
export const PIPING = {
  zigzag: [[[.2, .32], [.35, .46], [.5, .32], [.65, .46], [.8, .32]], [[.2, .56], [.35, .7], [.5, .56], [.65, .7], [.8, .56]]],
  dots: [[.3, .35], [.7, .35], [.5, .5], [.3, .65], [.7, .65]].map(([x, y]) => circle(x, y, .06, 8)),
  lattice: [[[.25, .25], [.75, .75]], [[.25, .5], [.5, .75]], [[.5, .25], [.75, .5]], [[.75, .25], [.25, .75]], [[.5, .25], [.25, .5]], [[.75, .5], [.5, .75]]],
  wave: [.35, .5, .65].map(y => Array.from({ length: 13 }, (_, i) => [.18 + i * .055, y + Math.sin(i / 12 * Math.PI * 2) * .06])),
  ring: [circle(.5, .5, .3, 20)],
  spiral: [circle(.5, .5, .04, 14, 2, .28)],
};
const NEAR = .055, FAR = .085;
function resample(strokes, step = .02) {
  const out = [];
  for (const s of strokes) for (let i = 1; i < s.length; i++) {
    const [ax, ay] = s[i - 1], [bx, by] = s[i], n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / step));
    for (let k = 0; k <= n; k++) out.push([ax + (bx - ax) * k / n, ay + (by - ay) * k / n]);
  }
  return out;
}
const nearest = (p, pts) => pts.reduce((m, q) => Math.min(m, Math.hypot(p[0] - q[0], p[1] - q[1])), Infinity);

export function bakeColour(brown) {
  const stops = [
    [0, [244, 228, 184]],
    [0.4, [232, 190, 110]],
    [0.62, [205, 140, 60]],
    [0.85, [120, 72, 34]],
    [1, [48, 28, 18]],
  ];
  const b = clamp(brown);
  for (let i = 1; i < stops.length; i++) {
    if (b <= stops[i][0]) {
      const [a0, c0] = stops[i - 1],
        [a1, c1] = stops[i],
        k = (b - a0) / (a1 - a0);
      return `rgb(${c0.map((v, j) => Math.round(v + (c1[j] - v) * k)).join(",")})`;
    }
  }
  return "rgb(48,28,18)";
}

const juiceState = lemons => ({ lemons, lemon: 0, pressure: 0, squeezing: false, yields: Array(lemons).fill(0), pips: 0, done: false });

export class BakingSession {
  constructor({ competition = false, recipe = null } = {}) {
    this.competition = competition;
    this.recipeId = recipe;
    this.stage = 0;
    this.clock = 0;
    this.value = 0;
    this.score = 0;
    this.quality = 0;
    this.stars = 0;
    this.juiceQ = null;
    this.results = [];
    this.complete = false;
    this.feedback = "";
    this.initStage();
  }
  get spec() { return bakeSpec(this.recipeId); }
  get ingredients() { return this.spec.ingredients; }
  get stages() { return this.spec.drink ? ['juice', 'mix'] : ['mix', 'oven', 'finish']; }
  get kind() { return this.stages[Math.min(this.stage, this.stages.length - 1)]; }
  get current() {
    const info = STAGE_INFO[this.kind];
    if (this.kind === 'mix' && this.spec.drink) return { ...info, name: 'Sweetening', label: 'Pour it out', instruction: 'Watch the lines, then add the sugar and the cold water to them, and stir until the sugar dissolves.' };
    if (!this.competition) return info;
    const extra = {
      mix: ' Competition rules: whisk the dry ingredients four times, then add the wet ones and fold four times. Extra mixing toughens the crumb.',
      oven: ' The hall oven also runs unevenly, so keep an eye on the thermometer.',
      finish: ` The judges call time after ${DECO_TIME} seconds.`,
    }[this.kind] || '';
    return { ...info, instruction: info.instruction + extra };
  }
  initStage() {
    this.clock = 0;
    this.value = 0;
    const k = this.complete ? null : this.kind;
    if (k === 'juice') this.st = { juice: juiceState(this.spec.juice || 2) };
    else if (k === 'mix')
      this.st = { amounts: {}, order: [], strokes: 0, effort: 0, method: "fold", whisk: 0, fold: 0, wrongMethod: 0, flash: FLASH_TIME,
        juice: this.spec.juice && !this.spec.drink ? juiceState(this.spec.juice) : null };
    else if (k === 'oven')
      this.st = { heat: 0.5, temp: 0.4, rise: 0, brown: 0, crack: 0, heatStress: 0, checks: 0, peek: 0, sunk: 0 };
    else if (k === 'finish')
      this.st = { topping: null, ink: [] };
    else this.st = null;
  }
  // ---- juicing
  get juice() { return this.st?.juice || null; }
  squeeze(on) { const j = this.juice; if (j && !j.done) j.squeezing = !!on; }
  nextLemon() {
    const j = this.juice; if (!j || j.done) return;
    j.squeezing = false; j.pressure = 0;
    if (++j.lemon >= j.lemons) this.kind === 'juice' ? this.finishStage() : this.juiceDone();
  }
  juiceDone() {
    const j = this.juice; if (!j || j.done) return;
    j.done = true; j.squeezing = false; j.pressure = 0;
    this.juiceQ = this.juiceQuality();
    if (this.kind === 'mix') this.feedback = this.juiceQ >= 70 ? 'Lovely juice, no pips.' : this.juiceQ < 40 ? 'Not much juice, and a few pips.' : 'Juice is in.';
  }
  juiceQuality() {
    const j = this.juice; if (!j) return this.juiceQ ?? 0;
    const avg = j.yields.reduce((a, b) => a + b, 0) / j.lemons;
    return Math.round(100 * clamp(avg - j.pips * 0.15));
  }
  tickJuice(dt) {
    const j = this.juice; if (!j || j.done) return;
    j.pressure = clamp(j.pressure + (j.squeezing ? 1.1 : -2.5) * dt);
    if (j.pressure > 0.9) {
      j.pips++; j.squeezing = false; j.pressure = 0;
      this.feedback = 'Too hard! Pips in the juice.';
      return;
    }
    if (j.pressure >= 0.35 && j.pressure <= 0.8) j.yields[j.lemon] = clamp(j.yields[j.lemon] + 0.6 * dt);
    if (j.yields[j.lemon] >= 1) this.nextLemon();
  }
  // ---- mixing
  pour(id, d) {
    if (this.kind !== 'mix' || this.complete || !(d > 0)) return;
    if (this.st.juice && !this.st.juice.done) return;
    const s = this.st, now = clamp((s.amounts[id] || 0) + d, 0, POUR_MAX);
    s.amounts[id] = now;
    if (now > 0 && !s.order.includes(id)) s.order.push(id);
  }
  setMethod(id) {
    if (this.kind === 'mix' && MIX_METHODS.some((m) => m.id === id)) this.st.method = id;
  }
  stroke() {
    if (this.kind !== 'mix' || this.complete) return;
    const m = MIX_METHODS.find((x) => x.id === this.st.method);
    this.st.strokes++;
    this.st.effort += m.weight;
    if (this.competition) {
      const wet = this.ingredients.some(i => !i.dry && this.st.amounts[i.id] > 0);
      const expected = wet ? 'fold' : 'whisk';
      if (m.id === expected) this.st[expected] = (this.st[expected] || 0) + 1;
      else this.st.wrongMethod = (this.st.wrongMethod || 0) + 1;
    }
  }
  mixState() {
    const e = this.st.effort;
    return e === 0 ? "dry" : e < 10 ? "lumpy" : e <= 16 ? "glossy" : "tight";
  }
  smoothness() { return clamp(this.st.effort / 10); }
  showLines() { return this.kind === 'mix' && this.st.flash > 0 && !(this.st.juice && !this.st.juice.done); }
  // ---- oven
  setHeat(v) { if (this.kind === 'oven') this.st.heat = clamp(v); }
  nudgeHeat(d) { if (this.kind === 'oven') this.setHeat(this.st.heat + d); }
  checksLeft() { return this.kind === 'oven' ? Math.max(0, this.spec.oven.checks - this.st.checks) : 0; }
  // Open the door for a look. Heat rushes out, and a delicate cake that is
  // only half risen may sink.
  check() {
    if (this.kind !== 'oven' || this.complete || !this.checksLeft()) return false;
    const s = this.st, fragile = this.spec.oven.fragile || 0;
    s.checks++; s.peek = 1.8; s.temp = clamp(s.temp - 0.15);
    const luck = (Math.sin(this.clock * 977 + s.checks * 13) + 1) / 2;
    if (s.rise > 0.25 && s.rise < 0.8 && luck < fragile) { s.sunk = clamp(s.sunk + 0.35); this.feedback = 'The cake sighs and sinks a little. Shut the door!'; }
    else this.feedback = this.ovenCue();
    return true;
  }
  tick(dt) {
    if (this.complete) return;
    dt = Math.max(0, Math.min(0.1, dt));
    if (this.kind === 'juice' || (this.kind === 'mix' && this.st.juice && !this.st.juice.done)) return this.tickJuice(dt);
    this.clock += dt;
    if (this.kind === 'mix') { this.st.flash = Math.max(0, this.st.flash - dt); return; }
    if (this.kind === 'finish') {
      if (this.competition && this.clock >= DECO_TIME) this.finishStage();
      return;
    }
    if (this.kind !== 'oven') return;
    const s = this.st, o = this.spec.oven;
    s.peek = Math.max(0, s.peek - dt);
    s.temp += (clamp(s.heat + this.ovenDrift(this.clock)) - s.temp) * dt * 0.8;
    if (this.competition && this.clock > 4)
      s.heatStress = (s.heatStress || 0) + Math.max(0, Math.abs(s.temp - o.heat) - .12) * dt;
    const t = s.temp;
    // Too cool and it barely rises, too hot and the crust races ahead of the middle.
    // A cool oven also caps how far it can rise, so it comes out dense.
    const cap = clamp(1 - Math.max(0, o.heat - t - .04) * 3, .2, 1);
    if (s.rise < cap) s.rise = Math.min(cap, s.rise + clamp(1 - Math.abs(t - o.heat) * 2.2, 0.15, 1) / o.time * dt);
    s.brown = clamp(s.brown + (t > 0.2 ? 0.62 / o.time * (t / o.heat) ** 2 : 0) * dt);
    if (t > o.heat + 0.18) s.crack += dt * 0.08;
    this.value = s.brown;
    if (this.clock > o.time * 2.5 || s.brown >= 1) this.finishStage();
  }
  // The hall oven wanders: a slow swing plus a quicker flutter that is
  // out of step with it, so steering it takes attention all the way through.
  ovenDrift(t) {
    return this.competition ? Math.sin(t * .7) * .2 + Math.sin(t * 1.9 + 1) * .08 : 0;
  }
  decoTimeLeft() {
    return this.kind === 'finish' && this.competition && !this.complete ? Math.max(0, Math.ceil(DECO_TIME - this.clock)) : null;
  }
  ovenCue() {
    const s = this.st;
    if (s.brown > 0.85) return "Dark and bitter. Out, now.";
    if (s.brown > 0.55 && s.rise > 0.85) return "Golden and tall. Ready.";
    if (s.temp > this.spec.oven.heat + 0.15) return "The crust is racing ahead.";
    if (s.rise < 0.3) return "Barely lifting. Be patient.";
    if (s.brown < 0.3) return "Still pale, rising nicely.";
    return "Colour is building.";
  }
  // ---- finishing
  toppingChoices() { return this.spec.toppings || GENERIC.toppings; }
  chooseTopping(id) {
    if (this.kind === 'finish' && this.toppingChoices().some(t => t.id === id)) this.st.topping = id;
  }
  pattern() { return PIPING[this.spec.piping] || PIPING.ring; }
  pipe(x, y) {
    if (this.kind !== 'finish' || this.complete || !this.st.topping) return;
    const ink = this.st.ink;
    if (ink.length < 900) ink.push([Math.round(clamp(x) * 1000) / 1000, Math.round(clamp(y) * 1000) / 1000]);
  }
  lift() { const ink = this.st?.ink; if (ink?.length && ink[ink.length - 1] !== null) ink.push(null); }
  traceQuality() {
    const ink = (this.st.ink || []).filter(Boolean);
    if (!ink.length) return 0;
    const path = resample(this.pattern());
    const covered = path.filter(p => nearest(p, ink) <= NEAR).length / path.length;
    const off = ink.filter(p => nearest(p, path) > FAR).length / ink.length;
    return clamp(covered * (1 - off * 0.8));
  }
  // ---- scoring (each 0 to 100)
  stageQuality() {
    const s = this.st, k = this.kind;
    if (k === 'juice') return this.juiceQuality();
    if (k === 'mix') {
      let off = 0, tot = 0;
      for (const i of this.ingredients) { off += Math.abs((s.amounts[i.id] || 0) - i.target); tot += i.target; }
      const measure = clamp(1 - off / (this.competition ? 4 : tot * .3));
      const ids = this.ingredients.map((i) => i.id), o = s.order;
      let ok = 0, pairs = 0;
      for (let a = 0; a < o.length; a++)
        for (let b = a + 1; b < o.length; b++) { pairs++; if (ids.indexOf(o[a]) < ids.indexOf(o[b])) ok++; }
      const order = pairs ? ok / pairs : 0;
      const e = s.effort;
      const mix = this.competition ?
        clamp(1 - Math.abs((s.whisk || 0) - 4) / 4) * clamp(1 - Math.abs((s.fold || 0) - 4) / 4) * clamp(1 - (s.wrongMethod || 0) / 4) :
        e < 10 ? e / 10 : e <= 16 ? 1 : clamp(1 - (e - 16) / 10);
      let q = 100 * (0.45 * measure + 0.25 * order + 0.3 * mix);
      if (this.competition && s.juice) q += this.juiceQ == null ? 0 : this.juiceQ >= 70 ? 5 : this.juiceQ < 40 ? -5 : 0;
      return Math.round(clamp(q, 0, 100));
    }
    if (k === 'oven') {
      const rise = clamp(s.rise),
        brown = clamp(1 - Math.abs(s.brown - 0.62) / (this.competition ? .15 : .3)),
        crack = 1 - clamp(s.crack * 3);
      const stability = this.competition ? clamp(1 - (s.heatStress || 0) * .6) : 1;
      return Math.round(100 * (0.35 * rise + 0.45 * brown + 0.2 * crack) * (1 - Math.min(.6, s.sunk || 0)) * stability);
    }
    if (k === 'finish') {
      const fit = this.toppingChoices().find(t => t.id === s.topping)?.fit || 0;
      return Math.round(100 * (0.4 * fit + 0.6 * this.traceQuality()));
    }
    return 0;
  }
  canFinish() {
    if (this.complete) return false;
    const k = this.kind;
    if (k === 'juice') return this.juice.lemon > 0 || this.juice.yields[0] > 0 || this.juice.done;
    if (k === 'mix') return this.st.strokes > 0 && !(this.st.juice && !this.st.juice.done);
    if (k === 'finish') return !!this.st.topping && this.st.ink.filter(Boolean).length >= 5;
    return true;
  }
  finishStage() {
    if (this.complete) return;
    if (this.kind === 'juice') this.juiceDone();
    if (this.kind === 'mix' && this.st.juice && !this.st.juice.done) this.juiceDone();
    const d = this.current, q = this.stageQuality(), clean = q >= (this.competition ? 70 : 60);
    this.score += clean ? 1 : 0;
    const extra = this.kind === 'finish' ? { topping: this.st.topping, ink: this.st.ink.slice() } : this.kind === 'oven' ? { rise: this.st.rise, brown: this.st.brown, sunk: this.st.sunk } : {};
    this.results.push({ name: d.name, kind: this.kind, clean, quality: q, ...extra });
    this.quality = Math.round(this.results.reduce((a, r) => a + r.quality, 0) / this.results.length);
    this.feedback = clean ? `${d.name}: beautifully done.` : `${d.name}: room for improvement. The bake is still usable.`;
    this.stage++;
    this.complete = this.stage >= this.stages.length;
    if (this.complete) this.stars = this.starRating();
    this.initStage();
  }
  // Out of 3, in halves.
  starRating() {
    const per = this.spec.drink ? 1.5 : 1;
    let stars = this.results.reduce((a, r) => a + r.quality / 100 * per, 0);
    if (this.spec.juice && !this.spec.drink && this.juiceQ != null) stars += this.juiceQ >= 70 ? .5 : this.juiceQ < 40 ? -.5 : 0;
    return clamp(Math.round(stars * 2) / 2, 0, 3);
  }
  // Legacy entry point.
  action() { this.finishStage(); }
  result() {
    return {
      score: this.score,
      quality: this.quality,
      stars: this.stars,
      recipe: this.recipeId,
      complete: this.complete,
      stage: this.stage,
      results: this.results.map((r) => ({ ...r })),
    };
  }
}
