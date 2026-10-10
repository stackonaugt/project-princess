import test from "node:test";
import assert from "node:assert/strict";
import { state } from "../game/src/systems/state.js";
import {
  skill,
  skillProgress,
  awardSkill,
  trainingXp,
} from "../game/src/systems/player-skills.js";
import { craft } from "../game/src/systems/crafting.js";
import { CourseSession, COURSES } from "../game/src/systems/course.js";
import { SparringSession } from "../game/src/systems/player-combat.js";
import { BakingSession, INGREDIENTS } from "../game/src/systems/baking.js";
import {
  animationFrames,
  ANIMATION_LAYOUTS,
  frameAt,
} from "../game/src/data/animation-layouts.js";
import {
  showReady,
  divisionDone,
  divisionProgress,
} from "../game/src/systems/show-progress.js";
import { getMap, invalidateMap } from "../game/src/data/regions.js";
import { LocalRouter } from "../game/src/world/navigation.js";
const point = (x, y) => ({ x: x * 16 + 8, y: y * 16 + 12 });
const reset = () =>
  state.importCode(
    "PP3-" +
      Buffer.from(JSON.stringify({ hero: "helen", day: 1 })).toString("base64"),
  );
test("skills level independently per character, have real thresholds and survive save import", () => {
  reset();
  awardSkill("cooking", 80);
  assert.equal(skill("cooking").level, 2);
  assert.equal(skill("crafting").level, 1);
  state.data.hero = "hadrian";
  assert.equal(skill("cooking").level, 1);
  awardSkill("combat", 240);
  assert.equal(skill("combat").level, 3);
  const code = state.exportCode();
  reset();
  state.importCode(code);
  assert.equal(skill("combat").xp, 240);
  state.data.hero = "helen";
  assert.equal(skill("cooking").xp, 80);
  assert.equal(skillProgress(-20).level, 1);
  assert.equal(skillProgress(999999).level, 10);
  assert.equal(skillProgress(3600).fraction, 1);
});
test("crafting cannot consume ingredients on failure or duplicate unique equipment; unlocked recipes persist", () => {
  reset();
  state.addItem("timber", 4);
  const before = JSON.stringify(state.data.inventory);
  assert.equal(craft("coursekit").ok, false);
  assert.equal(JSON.stringify(state.data.inventory), before);
  for (const [id, n] of Object.entries({ cord: 2, cloth: 1, bolts: 2 }))
    state.addItem(id, n);
  assert.equal(craft("coursekit").ok, true);
  assert.equal(state.count("timber"), 0);
  assert.equal(state.count("coursekit"), 1);
  assert.equal(skill("crafting").xp, 55);
  assert.equal(craft("coursekit").ok, false);
  assert.equal(skill("crafting").xp, 55);
  assert.equal(craft("weavekit").ok, false);
  awardSkill("crafting", 25);
  for(const [k,n] of Object.entries({timber:6,cloth:4,cord:4,bolts:3})) state.addItem(k,n);
  assert.equal(craft('courseextension').ok,true);
  awardSkill('crafting',80);
  for (const [k, n] of Object.entries({ timber: 4, bolts: 2, cord: 1 }))
    state.addItem(k, n);
  assert.equal(craft("weavekit").ok, true);
});
test("all three agility courses need timing, weave turns and a patient release, and can qualify after mistakes", () => {
  for (const tier of Object.keys(COURSES))
    for (const variant of [0, 1]) {
      const c = new CourseSession(tier, variant);
      let steps = 0;
      while (!c.complete && steps++ < 6000) {
        c.tick(0.05);
        if (c.phase === "waiting") {
          if (c.station.kind === "jump") {
            if (c.timing > 0.55 && c.timing < 0.7) c.cue("jump");
          } else c.cue(c.station.kind);
        } else if (c.phase === "weaving")
          c.cue(c.weaveCount % 2 ? "right" : "left");
        else if (
          c.phase === "performing" &&
          c.station.kind === "stay" &&
          c.actionTime >= 2
        )
          c.cue("recall");
      }
      assert.ok(c.result().passed, tier);
      assert.equal(c.index, c.stations.length);
      assert.equal(c.penalties, 0);
    }
  const c = new CourseSession();
  while (c.phase === "walking") c.tick(0.1);
  assert.equal(c.cue("jump"), false);
  assert.equal(c.index, 0);
  assert.ok(c.penalties > 0);
  while (c.timing < 0.55) c.tick(0.1);
  assert.equal(c.cue("jump"), true);
  assert.ok(c.jump === 0);
  c.tick(0.1);
  assert.ok(c.jump > 0);
});
test("player sparring needs close-range attacks; blocks and dodges protect from telegraphed hits", () => {
  const far = new SparringSession();
  assert.equal(far.action("attack"), true);
  assert.equal(far.foe.hp, 70);
  assert.ok(far.stamina < far.maxStamina);
  const normal = new SparringSession();
  while (normal.clock < 2.55) normal.tick(0.05);
  assert.equal(normal.hp, 58);
  const block = new SparringSession();
  while (block.clock < 2) block.tick(0.05);
  block.action("block");
  while (block.clock < 2.55) block.tick(0.05);
  assert.equal(block.hp, 68);
  const dodge = new SparringSession();
  while (dodge.clock < 2.1) dodge.tick(0.05);
  dodge.action("dodge");
  while (dodge.clock < 2.55) dodge.tick(0.05);
  assert.equal(dodge.hp, 70);
  const attack = new SparringSession(3);
  attack.x = 60;
  while (!attack.complete) {
    attack.action("attack");
    for (let i = 0; i < 12; i++) attack.tick(0.05);
  }
  assert.equal(attack.result().win, true);
});
test("baking scores preparation instead of a random bonus; missed stages still produce a usable entry", () => {
  const s = new BakingSession();
  for (const ingredient of INGREDIENTS) s.pour(ingredient.id, ingredient.target);
  for (let i = 0; i < 12; i++) s.stroke();
  s.action();
  s.setHeat(.58);
  while (s.stage === 1 && s.st.brown < .62) s.tick(.05);
  s.action();
  for (const [slot, type] of [[8, 'cream'], [0, 'berry'], [2, 'leaf'], [4, 'berry'], [6, 'leaf']]) s.place(slot, type);
  s.action();
  assert.equal(s.result().score, 3);
  const miss = new BakingSession();
  miss.action();
  miss.action();
  miss.action();
  assert.equal(miss.complete, true);
  assert.equal(miss.score, 0);
});
test("two-frame art cycles both frames; four walk frames and reserved action frames remain separate", () => {
  assert.deepEqual(animationFrames("pet-test", 2), [0, 1]);
  assert.equal(frameAt([0, 1], 150, 8), 1);
  assert.equal(frameAt([0, 1], 300, 8), 0);
  ANIMATION_LAYOUTS["pet-test"] = { walk: [1, 2, 3, 4], jump: [5, 6] };
  assert.deepEqual(animationFrames("pet-test", 7), [1, 2, 3, 4]);
  assert.deepEqual(animationFrames("pet-test", 7, "jump"), [5, 6]);
  assert.deepEqual(
    animationFrames("player-helen-down", 7, "walk", true),
    [1, 0, 2, 0],
  );
  assert.deepEqual(
    animationFrames("player-helen-down", 7, "wave", true),
    [3, 4, 3],
  );
  delete ANIMATION_LAYOUTS["pet-test"];
});
test("show entry requires varied school successes and practice; event results and prizes survive reload", () => {
  reset();
  state.data.side.show.practice = 2;
  state.data.side.school.skills.princess = { recall: 6 };
  assert.equal(showReady("princess"), false);
  state.data.side.school.skills.princess = { recall: 3, lead: 3 };
  assert.equal(showReady("princess"), true);
  const p = divisionProgress("novice");
  p.battles = ["showmira", "showrafi"];
  p.course = 90;
  assert.equal(divisionDone("novice"), false);
  p.obedience = 2;
  state.data.side.show.claimed = ["novice"];
  state.importCode(state.exportCode());
  assert.equal(divisionDone("novice"), true);
  assert.deepEqual(state.data.side.show.claimed, ["novice"]);
});
test("Exhibition entry, exit, all rival owners and every new yard station are reachable", () => {
  reset();
  invalidateMap();
  const m = getMap("exhibition"),
    r = new LocalRouter(m),
    start = point(m.entries.door.x, m.entries.door.y);
  assert.ok(r.clear(start.x, start.y));
  for (const npc of m.npcs)
    assert.equal(r.route(start, point(npc.x, npc.y), 24).status, "ok", npc.id);
  const gardens = getMap("gardens"),
    gate = gardens.exits.find((e) => e.to === "exhibition");
  assert.ok(gate);
  assert.ok(new LocalRouter(gardens).clear(point(40, 16).x, point(40, 16).y));
  const yard = getMap("yard"),
    yr = new LocalRouter(yard),
    ys = point(yard.entries.backdoor.x, yard.entries.backdoor.y);
  for (const id of ["workbench", "course", "sparring"]) {
    const o = yard.objects.find((o) => o.interact === id);
    assert.ok(o, id);
    assert.equal(
      yr.route(ys, point(o.x + o.w / 2 - 0.5, o.y + o.h - 0.5), 24).status,
      "ok",
      id,
    );
  }
});
