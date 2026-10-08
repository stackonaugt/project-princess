export const BAKE_STAGES = [
  {
    name: "Mixing",
    instruction:
      "Fold steadily. Aim for the centre of the green band, then stop mixing.",
    label: "Stop mixing",
    speed: 0.22,
    target: 0.6,
    width: 0.23,
  },
  {
    name: "Baking",
    instruction:
      "Watch the oven. Take the bake out in the green band, before it over-browns.",
    label: "Take out of oven",
    speed: 0.16,
    target: 0.74,
    width: 0.2,
  },
  {
    name: "Finishing",
    instruction:
      "Finish neatly. Place the topping when the moving marker enters the green band.",
    label: "Place topping",
    speed: 0.32,
    target: 0.5,
    width: 0.25,
  },
];
export class BakingSession {
  constructor() {
    this.stage = 0;
    this.clock = 0;
    this.value = 0;
    this.score = 0;
    this.results = [];
    this.complete = false;
    this.feedback = "";
  }
  get current() {
    return BAKE_STAGES[this.stage];
  }
  tick(dt) {
    if (this.complete) return;
    this.clock += Math.max(0, Math.min(0.1, dt));
    this.value =
      this.stage === 2
        ? (Math.sin(this.clock * 2) + 1) / 2
        : Math.min(1, this.clock * this.current.speed);
    if (this.clock > 15) this.action();
  }
  action() {
    if (this.complete) return;
    const d = this.current,
      clean = Math.abs(this.value - d.target) <= d.width / 2;
    this.score += clean ? 1 : 0;
    this.results.push({ name: d.name, clean });
    this.feedback = clean
      ? `${d.name}: beautifully done.`
      : `${d.name}: room for improvement. The bake is still usable.`;
    this.stage++;
    this.clock = 0;
    this.value = 0;
    this.complete = this.stage === BAKE_STAGES.length;
  }
  result() {
    return { score: this.score, results: this.results };
  }
}
