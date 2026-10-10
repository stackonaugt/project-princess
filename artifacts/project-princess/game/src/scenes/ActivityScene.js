import { CourseSession, CUES } from "../systems/course.js";
import { SparringSession } from "../systems/player-combat.js";
import { skill } from "../systems/player-skills.js";
import { state } from "../systems/state.js";
import { controls } from "../systems/controls.js";
import { ui } from "../ui/ui.js";
import { h } from "../ui/dom.js";
import { petTex } from "../systems/forms.js";
import { playerTexture, custom, frameCount } from "../art/textures.js";
import { animationFrames, frameAt, actionFrameAt } from "../data/animation-layouts.js";

export class ActivityScene extends Phaser.Scene {
  constructor() {
    super("Activity");
  }
  init(opts) {
    this.opts = opts;
    this.ended = false;
    this.lastX = null;
    this.cueUntil = 0;
  }
  create() {
    this.course = this.opts.mode === "course";
    this.session = this.course
      ? new CourseSession(this.opts.tier, this.opts.variant)
      : new SparringSession(skill("combat").level);
    this.paint = this.add.graphics();
    this.warning = this.add.graphics();
    const [key, flip] = playerTexture(state.data.hero || "helen", "down");
    this.hero = this.add.sprite(0, 0, key, 0).setOrigin(0.5, 1).setFlipX(flip);
    this.dog = this.course
      ? this.add.sprite(0, 0, petTex(this.opts.pet), 0).setOrigin(0.5, 1)
      : null;
    this.dummy = !this.course ? this.add.graphics() : null;
    this.caption = h("p", {
      class: "activity-status",
      role: "status",
      "aria-live": "polite",
    });
    this.needle = h("span", { class: "bake-marker" });
    this.timing = h(
      "div",
      {
        class: "bake-track course-timing",
        "aria-label": "Cue the jump while the marker is in the green band",
      },
      h("span", { class: "bake-band", style: { left: "48%", width: "38%" } }),
      this.needle,
    );
    this.score = h("p", { class: "small" });
    const button = (label, fn) =>
      h("button", { class: "wood-btn small", onclick: fn }, label);
    this.buttons = h(
      "div",
      { class: "activity-buttons" },
      ...(this.course
        ? Object.entries(CUES).map(([id, label]) =>
            button(label, () => this.act(id)),
          )
        : [
            button("Attack (A)", () => this.act("attack")),
            button("Dodge (B)", () => this.act("dodge")),
            button("Block", () => this.act("block")),
          ]),
    );
    this.finishButton = button("Leave practice", () =>
      this.finish(this.session.complete),
    );
    this.overlay = h(
      "section",
      {
        class: "activity-overlay",
        "aria-label": this.course ? "Dog agility course" : "Player sparring",
      },
      h(
        "div",
        { class: "activity-header" },
        h("b", {}, this.course ? this.session.course.name : "Player sparring"),
        this.finishButton,
      ),
      this.caption,
      this.score,
      this.timing,
      this.buttons,
    );
    document.body.append(this.overlay);
    document.body.classList.add("activity-playing");
    document.body.classList.toggle("activity-course", this.course);
    ui.activity = {
      action: () =>
        this.act(
          this.course
            ? this.session.phase === "weaving"
              ? this.session.weaveCount % 2
                ? "right"
                : "left"
              : this.session.phase === "performing"
                ? "recall"
                : this.session.station?.kind
            : "attack",
        ),
      cancel: () => (this.course ? this.finish(false) : this.act("dodge")),
    };
    this.layout();
    this.observer = new ResizeObserver(() => this.layout());
    this.observer.observe(this.overlay);
    this.scale.on("resize", this.layout, this);
    this.events.once("shutdown", () => {
      this.scale.off("resize", this.layout, this);
      this.observer?.disconnect();
      this.overlay?.remove();
      document.body.classList.remove("activity-playing", "activity-course");
      ui.activity = null;
      controls.release();
    });
  }
  layout() {
    this.children.list
      .filter((c) => c.name === "station-label")
      .forEach((c) => c.destroy());
    this.W = this.scale.width;
    this.H = this.scale.height;
    this.area = {
      left: this.W * 0.06,
      top: Math.max(
        Math.min(160, this.H * 0.3),
        this.overlay.getBoundingClientRect().bottom + 14,
      ),
      width: this.W * 0.88,
      height: Math.max(
        65,
        this.H -
          Math.max(
            Math.min(160, this.H * 0.3),
            this.overlay.getBoundingClientRect().bottom + 14,
          ) -
          (this.course ? 30 : Math.min(180, this.H * 0.32)),
      ),
    };
    this.paint.clear();
    this.paint
      .fillStyle(this.course ? 0x718f4c : 0x9e8056)
      .fillRect(0, 0, this.W, this.H);
    const a = this.area;
    this.paint
      .lineStyle(2, 0xdcd3af, 0.8)
      .strokeRoundedRect(a.left, a.top, a.width, a.height, 14);
    if (this.course) {
      const ss = this.session.stations,
        points = [
          { x: this.session.stations[0].x < 50 ? 10 : 90, y: 78 },
          ...ss,
        ];
      this.paint.lineStyle(3, 0xc8b886, 0.65);
      for (let i = 1; i < points.length; i++) {
        const x = this.point(points[i - 1]),
          y = this.point(points[i]);
        this.paint.lineBetween(x.x, x.y, y.x, y.y);
      }
      ss.forEach((s, i) => {
        const p = this.point(s),
          r = Math.min(16, a.width * 0.035);
        if (s.kind === "jump") {
          this.paint.fillStyle(0xece2c2).fillRect(p.x - r, p.y - 12, r * 2, 4);
          this.paint
            .fillStyle(0xaf5547)
            .fillRect(p.x - r, p.y - 18, 4, 20)
            .fillRect(p.x + r - 4, p.y - 18, 4, 20);
        } else if (s.kind === "tunnel") {
          this.paint
            .fillStyle(0x406e9a)
            .fillRoundedRect(p.x - r, p.y - 15, r * 2, 20, 9);
          this.paint.fillStyle(0x24394b).fillCircle(p.x - r + 5, p.y - 5, 6);
        } else if (s.kind === "weave") {
          for (let j = -1; j <= 1; j++)
            this.paint
              .fillStyle(j % 2 ? 0xf1d889 : 0xdb604b)
              .fillRect(p.x + j * 9, p.y - 18, 3, 22);
        } else {
          this.paint
            .lineStyle(3, s.kind === "stay" ? 0xedcd66 : 0xb2d9d0)
            .strokeCircle(p.x, p.y, r);
        }
        this.add
          .text(p.x, p.y + 8, `${i + 1}`, {
            fontSize: "11px",
            color: "#f8eed2",
            backgroundColor: "#40532d",
          })
          .setName("station-label")
          .setOrigin(0.5);
      });
    }
    // Resize replaces labels rather than leaving old screen coordinates behind.
    const labels = this.children.list.filter((c) => c.name === "station-label");
    while (labels.length > (this.course ? this.session.stations.length : 0))
      labels.shift().destroy();
    this.hero.setScale(
      (Math.min(2.5, this.W / 180) * 32) / this.hero.frame.realHeight,
    );
    if (this.dog)
      this.dog.setScale(
        (Math.min(2.4, this.W / 180) * 22) / this.dog.frame.realHeight,
      );
  }
  point(p) {
    const a = this.area;
    return {
      x: a.left + (p.x / 100) * a.width,
      y: a.top + (p.y / 100) * a.height,
    };
  }
  act(kind) {
    if (this.session.complete) return this.finish(true);
    if (this.session[this.course ? "cue" : "action"](kind, controls.vector()))
      this.cueUntil = this.session[this.course ? "time" : "clock"] + 0.65;
  }
  pose(sprite, action, clock, moving = false, actionProgress = null) {
    const key = sprite.texture.key,
      n = frameCount(this, key);
    let frames = animationFrames(key, n, action, !custom.has(key));
    if (action === "jump" && frames.length && actionProgress !== null) {
      sprite.setFrame(actionFrameAt(frames, actionProgress));
      return;
    }
    if (!frames.length)
      frames = animationFrames(
        key,
        n,
        moving ? "walk" : "idle",
        !custom.has(key),
      );
    sprite.setFrame(frameAt(frames, clock * 1000, moving ? 9 : 6));
  }
  update(_time, delta) {
    if (!this.session || this.ended) return;
    const s = this.session,
      dt = Math.min(0.1, delta / 1000),
      v = controls.vector();
    s.tick(dt, v);
    this.caption.textContent = s.status;
    const clock = this.course ? s.time : s.clock;
    if (this.course) {
      const wave = clock < this.cueUntil,
        p = this.point(s),
        station = s.station;
      const weave = s.phase === "weaving" ? Math.sin(s.actionTime * 11) * 8 : 0;
      this.dog.setPosition(p.x + weave, p.y - s.jump).setFlipX(!!s.flip);
      this.hero.setPosition(Math.max(this.area.left + 12, p.x - 35), p.y + 12);
      this.pose(
        this.dog,
        s.jump ? "jump" : s.moving ? "walk" : "idle",
        clock,
        s.moving,
        s.actionTime / 0.8,
      );
      this.pose(
        this.hero,
        wave ? "wave" : s.moving ? "walk" : "idle",
        clock,
        s.moving,
      );
      this.score.textContent = `Station ${Math.min(s.index + 1, s.stations.length)}/${s.stations.length} · ${Math.floor(s.time)}s · ${s.score}/100 · Qualify: ${s.course.pass}`;
      this.timing.hidden = !(s.phase === "waiting" && station?.kind === "jump");
      this.needle.style.left = `${s.timing * 100}%`;
      const expected =
        s.phase === "weaving"
          ? s.weaveCount % 2
            ? "right"
            : "left"
          : s.phase === "performing" && station?.kind === "stay"
            ? "recall"
            : station?.kind;
      [...this.buttons.children].forEach((b, i) => {
        const id = Object.keys(CUES)[i];
        b.hidden = ["left", "right"].includes(id) !== (s.phase === "weaving");
        b.disabled =
          s.phase === "walking" ||
          (s.phase === "performing" && station?.kind !== "stay");
        b.setAttribute("aria-pressed", !s.complete && id === expected);
      });
      this.dog.setAlpha(
        s.phase === "performing" && station?.kind === "tunnel" ? 0.5 : 1,
      );
    } else {
      this.timing.hidden = true;
      const p = this.point(s),
        f = this.point(s.foe);
      this.hero.setPosition(p.x, p.y).setFlipX(s.x > s.foe.x);
      this.pose(
        this.hero,
        s.attackUntil > clock
          ? "throw"
          : s.blockUntil > clock
            ? "wave"
            : v.x || v.y
              ? "walk"
              : "idle",
        clock,
        !!(v.x || v.y),
      );
      this.dummy.clear();
      this.dummy.fillStyle(0x62452d).fillRect(f.x - 3, f.y - 35, 6, 35);
      this.dummy
        .fillStyle(0xcab994)
        .fillRoundedRect(f.x - 14, f.y - 40, 28, 30, 5);
      this.warning.clear();
      if (s.telegraph) {
        const t = this.point(s.telegraph);
        this.warning
          .lineStyle(3, 0xe65742, 0.9)
          .strokeEllipse(
            t.x,
            t.y,
            this.area.width * 0.28,
            this.area.height * 0.28,
          );
      }
      this.score.textContent = `You: ${s.hp}/70 · Stamina: ${Math.floor(s.stamina)}/${s.maxStamina} · Dummy: ${s.foe.hp}/${s.foe.maxHp}. Move with arrows/WASD or joystick.`;
    }
    if (s.complete) {
      this.finishButton.textContent = "Finish";
      this.finishButton.onclick = () => this.finish(true);
    }
  }
  finish(completed) {
    if (this.ended) return;
    this.ended = true;
    const result = completed ? this.session.result() : { cancelled: true };
    const done = this.opts.done;
    this.scene.stop();
    done?.(result);
  }
}
