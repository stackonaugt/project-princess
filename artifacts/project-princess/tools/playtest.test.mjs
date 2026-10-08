import test from 'node:test';
import assert from 'node:assert/strict';

const storage = new Map();
globalThis.localStorage = { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) };
const listeners = new Map();
class Element {
  constructor() { this.children = []; this.style = {}; this.listeners = {}; this.classList = { add() {}, remove() {}, toggle() {} }; }
  append(el) { this.children.push(el); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(k, v) { if (k === 'style') this.style.cssText = v; else this[k] = v; }
  addEventListener(k, fn) { this.listeners[k] = fn; }
  setPointerCapture() {}
  getBoundingClientRect() { return { left: 0, top: 0 }; }
}
globalThis.Node = Element;
globalThis.HTMLInputElement = class {};
globalThis.HTMLTextAreaElement = class {};
const elements = new Map();
globalThis.document = { createElement: () => new Element(), createTextNode: text => ({ text }), getElementById: id => { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); }, addEventListener() {}, body: new Element() };
globalThis.window = { addEventListener(k, fn) { listeners.set(k, fn); } };
globalThis.matchMedia = () => ({ matches: false });
const { state } = await import('../game/src/systems/state.js');
const { trainerTeam, starterEncounter } = await import('../game/src/systems/battle.js');
const { TRAINERS } = await import('../game/src/data/enemies.js');
const { controls } = await import('../game/src/systems/controls.js');
const { openTraining } = await import('../game/src/ui/training.js');
const { petSize } = await import('../game/src/data/pet-sizes.js');

test('one starter can access second-pet challenges; rematches keep full teams', () => {
  state.data.party = ['princess']; Object.assign(state.pet('princess'), { found: true, hp: null, level: 5 });
  state.data.beaten = {};
  assert.deepEqual(trainerTeam('rose'), [['pet:salami', 5]]);
  assert.deepEqual(trainerTeam('adam'), [['pet:chloe', 5]]);
  assert.equal(trainerTeam('binman').length, 2);
  state.data.beaten.rose = 1;
  assert.deepEqual(trainerTeam('rose'), TRAINERS.rose.team);
  state.data.party.push('salami'); Object.assign(state.pet('salami'), { found: true, hp: null, level: 7 });
  assert.deepEqual(trainerTeam('adam'), TRAINERS.adam.team);
});

test('solo early encounters are capped; later locations and full teams retain levels', () => {
  state.data.party = ['princess'];
  const encounter = { id: 'bag', level: 10 };
  assert.equal(starterEncounter(encounter, 'brunswick').level, 4);
  assert.equal(starterEncounter(encounter, 'reservoir').level, 10);
  state.data.party.push('salami');
  assert.equal(starterEncounter(encounter, 'brunswick').level, 10);
  assert.equal(petSize('new-pet'), 16);
  assert.ok(petSize('salami') < petSize('chloe'));
});

test('held keys and joystick cannot carry movement through a map transition', () => {
  controls.init();
  const key = (type, repeat = false) => listeners.get(type)({ key: 'ArrowLeft', repeat, target: {}, preventDefault() {} });
  key('keydown'); assert.equal(controls.vector().x, -1);
  controls.requireFreshMovement(); controls.release();
  key('keydown', true); assert.equal(controls.vector().x, 0);
  key('keyup'); key('keydown'); assert.equal(controls.vector().x, -1); key('keyup');
  const zone = elements.get('joyZone');
  const pointer = { pointerId: 1, clientX: 0, clientY: 0, preventDefault() {} };
  zone.listeners.pointerdown(pointer); zone.listeners.pointermove({ ...pointer, clientX: 40 });
  assert.ok(controls.vector().x > 0);
  controls.requireFreshMovement(); controls.release(); zone.listeners.pointermove({ ...pointer, clientX: 42 });
  assert.equal(controls.vector().x, 0);
  zone.listeners.pointerup(pointer); zone.listeners.pointerdown(pointer); zone.listeners.pointermove({ ...pointer, clientX: 40 });
  assert.ok(controls.vector().x > 0); zone.listeners.pointerup(pointer);
});

test('school skill progress and existing stamps survive save reload', () => {
  state.useSlot(1);
  state.data.side.school = { lessonDay: { princess: 1 }, stamps: { princess: 2 }, skills: { princess: { Recall: 6 } } };
  state.save(); state.useSlot(1);
  assert.equal(state.data.side.school.skills.princess.Recall, 6);
  assert.equal(state.data.side.school.stamps.princess, 2);
});

test('all practical drills can be completed; cancellation resolves once without a score', () => {
  state.data.settings.sound = false;
  let now = 100, queue = new Map(), sequence = 0;
  const previousPerformance = globalThis.performance, previousRandom = Math.random;
  globalThis.performance = { now: () => now };
  globalThis.requestAnimationFrame = fn => { queue.set(++sequence, fn); return sequence; };
  globalThis.cancelAnimationFrame = id => queue.delete(id);
  Math.random = () => .5;
  const advance = ms => { for (let elapsed = 0; elapsed < ms; elapsed += 50) { now += Math.min(50, ms - elapsed); const pending = [...queue.values()]; queue.clear(); pending.forEach(fn => fn(now)); } };
  try {
    for (let drill = 0; drill < 3; drill++) {
      const panel = new Element(); let result, callbacks = 0;
      const session = openTraining(panel, () => session.cleanup(), { id: 'princess', name: 'Princess', behaviour: 'patrol', day: 1, done: r => { result = r; callbacks++; } });
      panel.children[1].children[drill].listeners.click();
      session.action();
      for (let round = 0; round < 3; round++) { advance(drill === 0 ? 1850 : drill === 1 ? 3000 : 1400); session.action(); advance(1000); }
      session.action(); session.cleanup();
      assert.equal(callbacks, 1); assert.equal(result.score, 3); assert.equal(queue.size, 0);
    }
    const panel = new Element(); let result = 'pending', callbacks = 0;
    const session = openTraining(panel, () => {}, { id: 'salami', name: 'Salami', behaviour: 'stalk', day: 2, done: r => { result = r; callbacks++; } });
    session.action(); advance(500); session.cleanup(); session.cleanup();
    assert.equal(result, null); assert.equal(callbacks, 1); assert.equal(queue.size, 0);
  } finally { globalThis.performance = previousPerformance; Math.random = previousRandom; }
});
