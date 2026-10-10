// Baking model: three different activities, no rewards. Pure state, no DOM.
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

export const INGREDIENTS = [
  { id: "flour", name: "Flour", dry: true, target: 6 },
  { id: "sugar", name: "Caster sugar", dry: true, target: 4 },
  { id: "eggs", name: "Eggs", dry: false, target: 3 },
  { id: "butter", name: "Soft butter", dry: false, target: 5 },
  { id: "milk", name: "Milk", dry: false, target: 2 },
];
export const POUR_MAX = 10;
export const DECO_TYPES = [
  { id: "berry", name: "Berry" },
  { id: "cream", name: "Cream swirl" },
  { id: "leaf", name: "Mint leaf" },
];
export const DECO_PIECES = 5;
export const DECO_SLOTS = 9; // 0..7 ring, 8 centre
// Competition only: seconds to dress the cake before the judges call time.
export const DECO_TIME = 30;
// Units a held pour adds per second (the cup holds POUR_MAX).
export const POUR_RATE = { practice: 3, competition: 4.5 };
export const MIX_METHODS = [
  { id: "fold", name: "Fold", weight: 1 },
  { id: "whisk", name: "Whisk", weight: 2 },
];

export const BAKE_STAGES = [
  {
    name: "Mixing",
    activity: "mix",
    instruction:
      "Add ingredients to the line on each cup, dry before wet. Then mix until the batter is glossy.",
    label: "Batter is ready",
  },
  {
    name: "Baking",
    activity: "oven",
    instruction:
      "Steer the heat. Let the cake rise tall and turn golden, then take it out before it darkens.",
    label: "Take out of oven",
  },
  {
    name: "Finishing",
    activity: "decorate",
    instruction:
      "Dress the cake. Fill the centre, keep the ring balanced and mix your toppings.",
    label: "Present the cake",
  },
];

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

export class BakingSession {
  constructor({ competition = false } = {}) {
    this.competition = competition;
    this.stage = 0;
    this.clock = 0;
    this.value = 0;
    this.score = 0;
    this.quality = 0;
    this.results = [];
    this.complete = false;
    this.feedback = "";
    this.initStage();
  }
  get current() {
    const stage = BAKE_STAGES[Math.min(this.stage, BAKE_STAGES.length - 1)];
    if (!this.competition) return stage;
    const instructions = [
      'Competition recipe: measure dry ingredients exactly, whisk four times, then add wet ingredients and fold four times. Extra mixing toughens the crumb.',
      'The hall oven runs unevenly. Adjust the dial to keep the heat steady; remove the cake when fully risen and golden, before it darkens.',
      `Use all three toppings. Fill the centre and arrange a balanced ring with no adjacent repeats. The judges call time after ${DECO_TIME} seconds.`,
    ];
    return { ...stage, instruction: instructions[Math.min(this.stage, 2)] };
  }
  initStage() {
    this.clock = 0;
    this.value = 0;
    if (this.stage === 0)
      this.st = { amounts: {}, order: [], strokes: 0, effort: 0, method: "fold", whisk: 0, fold: 0, wrongMethod: 0 };
    else if (this.stage === 1)
      this.st = { heat: 0.5, temp: 0.2, rise: 0, brown: 0, crack: 0, out: false, heatStress: 0 };
    else if (this.stage === 2)
      this.st = { slots: Array(DECO_SLOTS).fill(null) };
    else this.st = null;
  }
  // ---- stage 0
  pour(id, d) {
    if (this.stage !== 0 || this.complete) return;
    const s = this.st,
      before = s.amounts[id] || 0,
      now = clamp(before + d, 0, POUR_MAX);
    s.amounts[id] = now;
    if (now > 0 && !s.order.includes(id)) s.order.push(id);
    if (now === 0) s.order = s.order.filter((x) => x !== id);
  }
  setMethod(id) {
    if (this.stage === 0 && MIX_METHODS.some((m) => m.id === id))
      this.st.method = id;
  }
  stroke() {
    if (this.stage !== 0 || this.complete) return;
    const m = MIX_METHODS.find((x) => x.id === this.st.method);
    this.st.strokes++;
    this.st.effort += m.weight;
    if (this.competition) {
      const wet = INGREDIENTS.some(i => !i.dry && this.st.amounts[i.id] > 0);
      const expected = wet ? 'fold' : 'whisk';
      if (m.id === expected) this.st[expected] = (this.st[expected] || 0) + 1;
      else this.st.wrongMethod = (this.st.wrongMethod || 0) + 1;
    }
  }
  mixState() {
    const e = this.st.effort;
    return e === 0 ? "dry" : e < 10 ? "lumpy" : e <= 16 ? "glossy" : "tight";
  }
  smoothness() {
    return clamp(this.st.effort / 10);
  }
  // ---- stage 1
  setHeat(v) {
    if (this.stage === 1) this.st.heat = clamp(v);
  }
  nudgeHeat(d) {
    if (this.stage === 1) this.setHeat(this.st.heat + d);
  }
  tick(dt) {
    if (this.complete) return;
    dt = Math.max(0, Math.min(0.1, dt));
    this.clock += dt;
    // The judges call time on the decorating table.
    if (this.stage === 2 && this.competition && this.clock >= DECO_TIME) return this.finishStage();
    if (this.stage !== 1) return;
    const s = this.st;
    const fluctuation = this.ovenDrift(this.clock);
    s.temp += (clamp(s.heat + fluctuation) - s.temp) * dt * 0.8;
    if (this.competition && this.clock > 4)
      s.heatStress = (s.heatStress || 0) + Math.max(0, Math.abs(s.temp - .6) - .12) * dt;
    const t = s.temp;
    const rate = t < 0.3 ? 0.02 : t < 0.45 ? 0.05 : t <= 0.72 ? 0.09 : 0.07;
    s.rise = clamp(s.rise + rate * dt);
    s.brown = clamp(s.brown + Math.max(0, t - 0.25) * 0.14 * dt);
    if (t > 0.75) s.crack += dt * 0.05;
    this.value = s.brown;
    if (this.clock > 45 || s.brown >= 1) this.finishStage();
  }
  // The hall oven wanders: a slow swing plus a quicker flutter that is
  // out of step with it, so steering it takes attention all the way through.
  ovenDrift(t) {
    return this.competition ? Math.sin(t * .7) * .2 + Math.sin(t * 1.9 + 1) * .08 : 0;
  }
  decoTimeLeft() {
    return this.stage === 2 && this.competition ? Math.max(0, Math.ceil(DECO_TIME - this.clock)) : null;
  }
  ovenCue() {
    const s = this.st;
    if (s.brown > 0.85) return "Dark and bitter. Out, now.";
    if (s.brown > 0.55 && s.rise > 0.85) return "Golden and tall. Ready.";
    if (s.temp > 0.75) return "The crust is racing ahead.";
    if (s.rise < 0.3) return "Barely lifting. Be patient.";
    if (s.brown < 0.3) return "Still pale, rising nicely.";
    return "Colour is building.";
  }
  // ---- stage 2
  piecesPlaced() {
    return this.st.slots.filter(Boolean).length;
  }
  place(slot, type) {
    if (this.stage !== 2 || this.complete) return false;
    const sl = this.st.slots;
    if (slot < 0 || slot >= DECO_SLOTS) return false;
    if (sl[slot]) {
      sl[slot] = null;
      return true;
    }
    if (this.piecesPlaced() >= DECO_PIECES) return false;
    if (!DECO_TYPES.some((t) => t.id === type)) return false;
    sl[slot] = type;
    return true;
  }
  // ---- scoring
  stageQuality() {
    const s = this.st;
    if (this.stage === 0) {
      let off = 0,
        tot = 0;
      for (const i of INGREDIENTS) {
        off += Math.abs((s.amounts[i.id] || 0) - i.target);
        tot += i.target;
      }
      const measure = clamp(1 - off / (this.competition ? 4 : tot));
      const ids = INGREDIENTS.map((i) => i.id),
        o = s.order;
      let ok = 0,
        pairs = 0;
      for (let a = 0; a < o.length; a++)
        for (let b = a + 1; b < o.length; b++) {
          pairs++;
          if (ids.indexOf(o[a]) < ids.indexOf(o[b])) ok++;
        }
      const order = pairs ? ok / pairs : 0;
      const e = s.effort;
      const mix = this.competition ?
        clamp(1 - Math.abs((s.whisk || 0) - 4) / 4) * clamp(1 - Math.abs((s.fold || 0) - 4) / 4) * clamp(1 - (s.wrongMethod || 0) / 4) :
        e < 10 ? e / 10 : e <= 16 ? 1 : clamp(1 - (e - 16) / 10);
      return Math.round(100 * (0.45 * measure + 0.25 * order + 0.3 * mix));
    }
    if (this.stage === 1) {
      const rise = clamp(s.rise),
        brown = clamp(1 - Math.abs(s.brown - 0.62) / (this.competition ? .15 : .4)),
        crack = 1 - clamp(s.crack * 3);
      const stability = this.competition ? clamp(1 - (s.heatStress || 0) * .6) : 1;
      return Math.round(100 * (0.4 * rise + 0.45 * brown + 0.15 * crack) * stability);
    }
    const ring = s.slots.slice(0, 8);
    const placed = ring.map((t, i) => (t ? i : -1)).filter((i) => i >= 0);
    let balance = 0,
      adj = 0;
    if (placed.length) {
      let x = 0,
        y = 0;
      for (const i of placed) {
        x += Math.cos((i * Math.PI) / 4);
        y += Math.sin((i * Math.PI) / 4);
      }
      balance = clamp(1 - Math.hypot(x, y) / placed.length);
      for (const i of placed) if (ring[(i + 1) % 8] === ring[i]) adj++;
    }
    const spacing = placed.length ? 1 - adj / placed.length : 0;
    const variety = clamp((new Set(s.slots.filter(Boolean)).size - 1) / 2);
    const centre = s.slots[8] ? 1 : 0;
    const quality = Math.round(
      100 * (0.35 * balance + 0.25 * centre + 0.2 * variety + 0.2 * spacing),
    );
    return this.competition ? Math.round(quality * (.5 + .5 * Math.min(balance, variety, spacing, centre))) : quality;
  }
  canFinish() {
    if (this.complete) return false;
    if (this.stage === 0) return this.st.strokes > 0;
    if (this.stage === 2) return this.piecesPlaced() === DECO_PIECES;
    return true;
  }
  finishStage() {
    if (this.complete) return;
    const d = this.current,
      q = this.stageQuality(),
      clean = q >= (this.competition ? 70 : 60);
    this.score += clean ? 1 : 0;
    this.results.push({ name: d.name, clean, quality: q });
    this.quality = Math.round(
      this.results.reduce((a, r) => a + r.quality, 0) / this.results.length,
    );
    this.feedback = clean
      ? `${d.name}: beautifully done.`
      : `${d.name}: room for improvement. The bake is still usable.`;
    this.stage++;
    this.complete = this.stage >= BAKE_STAGES.length;
    this.initStage();
  }
  // Legacy entry point.
  action() {
    this.finishStage();
  }
  result() {
    return {
      score: this.score,
      quality: this.quality,
      complete: this.complete,
      stage: this.stage,
      results: this.results.map((r) => ({ ...r })),
    };
  }
}
