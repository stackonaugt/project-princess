// Course rules are independent of Phaser. Dogs move to each station, then
// wait for a cue: missed cues cost points but never lock out another attempt.
export const COURSES = {
  novice: {
    name: "Neighbourhood novice",
    pass: 65,
    stations: ["jump", "tunnel", "stay", "jump", "recall"],
  },
  open: {
    name: "City circuit",
    pass: 72,
    stations: ["jump", "weave", "tunnel", "stay", "jump", "recall"],
  },
  champion: {
    name: "Exhibition championship",
    pass: 80,
    stations: ["weave", "jump", "stay", "tunnel", "weave", "jump", "recall"],
  },
};
export const CUES = {
  jump: "Jump",
  tunnel: "Through",
  weave: "Weave",
  stay: "Stay",
  recall: "Come",
  left: "Left",
  right: "Right",
};
export class CourseSession {
  constructor(tier = "novice", variant = 0) {
    this.course = COURSES[tier] || COURSES.novice;
    this.index = 0;
    this.time = 0;
    this.wait = 0;
    this.penalties = 0;
    this.complete = false;
    this.phase = "walking";
    this.actionTime = 0;
    this.x = 10;
    this.y = 78;
    this.moving = true;
    this.jump = 0;
    const points = [
      [28, 78],
      [52, 78],
      [78, 68],
      [78, 38],
      [52, 30],
      [26, 38],
      [12, 55],
    ];
    this.stations = this.course.stations.map((kind, i) => ({
      kind,
      x: points[i][0],
      y: points[i][1],
    }));
    // Alternating layouts still teach the same cues, without identical runs.
    if (variant % 2)
      this.stations = this.stations.map((s) => ({ ...s, x: 100 - s.x }));
    if (variant % 2) this.x = 90;
    this.status =
      "Walk to the first station. Choose its cue when your dog arrives.";
  }
  get station() {
    return this.stations[this.index];
  }
  get timing() {
    return (this.wait % 2.8) / 2.8;
  }
  get cueLabel() {
    return this.phase === "weaving"
      ? this.weaveCount % 2
        ? "Right"
        : "Left"
      : this.phase === "performing" && this.station?.kind === "stay"
        ? "Release (Come)"
        : CUES[this.station?.kind] || "Finish";
  }
  get score() {
    return Math.max(
      0,
      100 - this.penalties - Math.floor(Math.max(0, this.time - 75) / 3),
    );
  }
  cue(kind) {
    if (this.complete) return false;
    if (this.phase === "weaving") {
      const expected = this.weaveCount % 2 ? "right" : "left";
      if (kind !== expected) {
        this.penalties += 3;
        this.status = `Guide the next turn ${expected}.`;
        return false;
      }
      if (this.actionTime < this.weaveCount * 0.35) {
        this.status = "Let the dog finish this turn first.";
        return false;
      }
      this.weaveCount++;
      this.status = `Good turn. ${this.weaveCount < 4 ? "Now " + (this.weaveCount % 2 ? "right." : "left.") : "Weave complete."}`;
      if (this.weaveCount === 4) this.advance();
      return true;
    }
    if (this.phase === "performing" && this.station.kind === "stay") {
      if (kind !== "recall") return false;
      if (this.actionTime < 2) {
        this.penalties += 2;
        this.status =
          "A little early. Wait until the dog has held the stay for two seconds, then Come.";
        return false;
      }
      this.status = "Lovely patient stay. Release!";
      this.advance();
      return true;
    }
    if (this.phase !== "waiting") return false;
    if (kind !== this.station.kind) {
      this.penalties += 4;
      this.status = `Try ${CUES[this.station.kind].toLowerCase()}. The dog is waiting for a clear cue.`;
      return false;
    }
    if (
      this.station.kind === "jump" &&
      (this.timing < 0.48 || this.timing > 0.86)
    ) {
      this.penalties += 2;
      this.status =
        "Cue the jump in the green timing band. Wait for its next pass and try again.";
      return false;
    }
    this.phase = this.station.kind === "weave" ? "weaving" : "performing";
    this.weaveCount = 0;
    this.actionTime = 0;
    this.moving = kind !== "stay";
    this.status =
      kind === "stay"
        ? "Hold steady for two seconds, then release with Come."
        : kind === "weave"
          ? "Guide the dog left, right, left, right through the poles."
          : `${CUES[kind]}!`;
    return true;
  }
  tick(dt) {
    if (this.complete) return;
    dt = Math.max(0, Math.min(0.1, dt));
    this.time += dt;
    if (this.time >= 180) {
      this.complete = true;
      this.moving = false;
      this.status = "Time to rest. Try the course again whenever you like.";
      return;
    }
    if (this.phase === "walking") {
      const s = this.station,
        dx = s.x - this.x,
        dy = s.y - this.y,
        d = Math.hypot(dx, dy),
        step = 22 * dt;
      if (d <= step) {
        this.x = s.x;
        this.y = s.y;
        this.phase = "waiting";
        this.moving = false;
        this.wait = 0;
        this.status = `${CUES[s.kind]} station. Give the cue when ready.`;
      } else {
        this.x += (dx / d) * step;
        this.y += (dy / d) * step;
        this.flip = dx < 0;
      }
    } else if (this.phase === "waiting") {
      this.wait += dt;
      if (this.wait > 12) {
        this.penalties += 2;
        this.wait = 0;
        this.status =
          "Take your time. A clear cue is better than a rushed one.";
      }
    } else {
      this.actionTime += dt;
      if (this.phase === "weaving") return;
      if (this.station.kind === "stay") {
        if (this.actionTime >= 2)
          this.status = "Stay held. Release your dog with Come.";
        return;
      }
      const kind = this.station.kind;
      this.jump =
        kind === "jump"
          ? Math.sin(Math.min(1, this.actionTime / 0.8) * Math.PI) * 24
          : 0;
      const length =
        kind === "stay"
          ? 2
          : kind === "weave"
            ? 1.8
            : kind === "recall"
              ? 1.2
              : 0.8;
      if (this.actionTime >= length) this.advance();
    }
  }
  advance() {
    this.jump = 0;
    this.index++;
    this.moving = true;
    this.phase = "walking";
    if (this.index >= this.stations.length) {
      this.complete = true;
      this.moving = false;
      this.status = `Course finished: ${this.score}/100. ${this.score >= this.course.pass ? "Qualifying run!" : "Keep practising; every station is retryable."}`;
    }
  }
  result() {
    return {
      complete: this.complete && this.index === this.stations.length,
      score: this.score,
      passed:
        this.index === this.stations.length && this.score >= this.course.pass,
      time: this.time,
      penalties: this.penalties,
    };
  }
}
