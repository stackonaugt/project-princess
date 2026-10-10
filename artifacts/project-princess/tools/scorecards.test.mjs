import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { state } from '../game/src/systems/state.js';
import { SAVE_KEY } from '../game/src/config.js';
import { recordScorecard, normaliseScorecards, SCORECARD_LIMIT, BAKE_CRITERIA } from '../game/src/systems/scorecards.js';
import { recordHallScorecard } from '../game/src/systems/show-scorecards.js';
import { openScorecards } from '../game/src/ui/scorecards.js';

const initial = JSON.stringify(state.data);
const reset = () => { state.data = JSON.parse(initial); state.slot = null; };
const bakeCard = (entryName = 'Cake') => ({
  kind: 'bakeoff', entryId: 'cake', entryName, event: 'Bake-off', division: 'Saturday bake-off',
  criteria: BAKE_CRITERIA.map((label, i) => ({ label, judge: ['Betty', 'Ruth', 'Hallie'][i], score: 8 + i })),
  outcome: '1st place',
});

test('old saves and malformed history load without fabricating cards or changing old results', () => {
  reset();
  const raw = { ...state.data, scorecards: undefined };
  raw.flags.lastBakeResult = { name: 'Old cake', total: 29 };
  state.importCode('PP3-' + btoa(JSON.stringify(raw)));
  assert.deepEqual(state.data.scorecards, []);
  assert.deepEqual(state.data.flags.lastBakeResult, raw.flags.lastBakeResult);
  assert.deepEqual(normaliseScorecards({ length: 3 }), []);
  assert.deepEqual(normaliseScorecards([null, {}, { ...bakeCard(), day: 1, criteria: [{ score: 99 }] }]), []);
  assert.throws(() => recordScorecard(state.data, { ...bakeCard(), criteria: [] }), /incomplete/);
});

test('history is bounded, stores detached snapshots and survives slots and save codes', () => {
  reset();
  const card = bakeCard();
  recordScorecard(state.data, card);
  card.criteria[0].score = 0;
  assert.equal(state.data.scorecards[0].criteria[0].score, 8);
  for (let day = 2; day <= 40; day++) {
    state.data.day = day; recordScorecard(state.data, bakeCard(`Cake ${day}`));
  }
  assert.equal(state.data.scorecards.length, SCORECARD_LIMIT);
  assert.equal(state.data.scorecards[0].day, 11);
  assert.equal(state.data.scorecards.at(-1).day, 40);
  const saved = structuredClone(state.data.scorecards);
  const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  state.slot = 2; state.save();
  assert.ok(values.has(`${SAVE_KEY}-slot2`));
  state.useSlot(2);
  assert.deepEqual(state.data.scorecards, saved);
  const code = state.exportCode(); reset(); state.importCode(code);
  assert.deepEqual(state.data.scorecards, saved);
  delete globalThis.localStorage;
});

test('completed failed and repeat hall runs record individual marks; cancelled and home runs do not', async () => {
  reset();
  state.data.pets.princess = { found: true, evolved: false };
  const result = { complete: true, mode: 'course', passed: false, marks: [3, 4, 5] };
  const before = structuredClone(state.data);
  recordHallScorecard({ ...result, cancelled: true }, 'princess', 'Neighbourhood novice');
  recordHallScorecard({ ...result, complete: false }, 'princess', 'Neighbourhood novice');
  assert.deepEqual(state.data, before);
  recordHallScorecard(result, 'princess', 'Neighbourhood novice practice', true);
  recordHallScorecard({ ...result, mode: 'obedience', marks: [9, 8, 10], passed: true }, 'princess', 'City circuit');
  assert.equal(state.data.scorecards.length, 2);
  assert.equal(state.data.scorecards[0].total, 12);
  assert.equal(state.data.scorecards[1].criteria[0].label, 'Command accuracy');
  assert.equal(state.data.scorecards[1].entryName, 'Princess');
  const { scorecards, ...unchanged } = state.data;
  const { scorecards: old, ...expected } = before;
  assert.deepEqual(unchanged, expected);
  const world = await readFile(new URL('../game/src/scenes/WorldScene.js', import.meta.url), 'utf8');
  assert.match(world, /if\(this.regionId==='exhibition'\)recordHallScorecard/);
  assert.match(world, /recordHallScorecard\(r,sh.pet,d.name\);this.save\(\);await judgeHallEvent/g);
});

// A small DOM verifies navigation and read-only behaviour without a game/browser.
class Element {
  constructor(tag) { this.tag = tag; this.children = []; this.attrs = {}; this.style = {}; this.events = {}; }
  setAttribute(key, value) { this.attrs[key] = value; }
  addEventListener(key, value) { this.events[key] = value; }
  append(child) { this.children.push(child); }
  replaceChildren(...children) { this.children = children; }
  querySelector(tag) {
    for (const child of this.children) {
      if (child.tag === tag) return child;
      const nested = child.querySelector?.(tag); if (nested) return nested;
    }
  }
  focus() {}
  get textContent() { return this.children.map(c => typeof c === 'string' ? c : c.textContent).join(' '); }
}

test('phone list and detail navigation are read-only and empty history does not reveal competitions', () => {
  reset();
  globalThis.Node = Element;
  globalThis.document = { createElement: tag => new Element(tag), createTextNode: text => text };
  const panel = new Element('section');
  let closed = false;
  openScorecards(panel, () => { closed = true; });
  assert.match(panel.textContent, /No judging cards/);
  assert.doesNotMatch(panel.textContent, /Bake-off|Exhibition|Breed|Grooming|champion/i);
  state.data.day = 6; recordScorecard(state.data, bakeCard('<Cake>'));
  state.data.day = 7; recordScorecard(state.data, bakeCard('New cake'));
  const before = JSON.stringify(state.data);
  openScorecards(panel, () => { closed = true; });
  const list = panel.children[1];
  assert.match(list.children[1].textContent, /New cake/);
  list.children[1].events.click();
  assert.match(panel.textContent, /Taste Betty 8\/10/);
  assert.match(panel.textContent, /Texture Ruth 9\/10/);
  assert.match(panel.textContent, /Presentation Hallie 10\/10/);
  assert.match(panel.textContent, /Total: 27\/30/);
  panel.querySelector('button').events.click();
  panel.children[1].children[2].events.click();
  assert.match(panel.textContent, /<Cake>/);
  panel.querySelector('button').events.click();
  panel.querySelector('button').events.click();
  assert.equal(closed, true);
  assert.equal(JSON.stringify(state.data), before);
  delete globalThis.Node; delete globalThis.document;
});

async function loadJudging(file, scope) {
  let source = await readFile(new URL(`../game/src/systems/${file}.js`, import.meta.url), 'utf8');
  source = source.replace(/^import .*;$/gm, '').replace(/^export /gm, '');
  vm.runInNewContext(source + `\nglobalThis.judge = ${file === 'bake-event' ? 'judgeBakeOff' : 'showPresentation'};`, scope);
  return scope.judge;
}

test('bake judging saves exact cards before dialogue and cannot award or record the same entry twice', async () => {
  reset(); state.data.day = 6;
  let items = 1, saved = 0;
  const originals = { removeItem: state.removeItem, addMoney: state.addMoney, addItem: state.addItem, addFriendPoints: state.addFriendPoints, count: state.count };
  state.count = () => items;
  state.removeItem = () => { items--; };
  state.addMoney = () => {}; state.addItem = () => {}; state.addFriendPoints = () => {};
  try {
    const world = {
      bakeAttempt: { id: 'cake', week: 0, session: { complete: true, score: 3, results: [95, 85, 100].map(quality => ({ quality })) } },
      save() { saved++; },
    };
    const scope = {
      state, recordScorecard, BAKE_CRITERIA,
      ITEMS: { cake: { name: 'Cake' } }, weekday: () => 6,
      BAKE_OFF: { day: 6, prize: [], results: ['Win', 'Second', 'Third', 'Fourth'], done: 'Done' },
      BAKE_CONTESTANTS: [{ name: 'Rival', dish: 'Cake', base: 27 }],
      awardSkill() {}, sfx: { found() {} }, raiseScorecard: async () => () => {},
      ui: { async say() { assert.ok(saved); assert.equal(state.data.scorecards.length, 1); } },
    };
    const judge = await loadJudging('bake-event', scope);
    await judge(world);
    assert.deepEqual(state.data.scorecards[0].criteria.map(c => c.score), [9, 8, 10]);
    assert.equal(state.data.scorecards[0].total, state.data.flags.lastBakeResult.total);
    // Restoring the old attempt still hits the original one-time weekly guard.
    world.bakeAttempt = { id: 'cake', week: 0 };
    await judge(world);
    assert.equal(items, 0); assert.equal(saved, 1); assert.equal(state.data.scorecards.length, 1);
  } finally { Object.assign(state, originals); }
});

test('failed and repeated presentation awards save new cards but repeat prizes stay one-time', async () => {
  reset();
  let quality = 50, prizes = 0, saves = 0;
  const originals = { addMoney: state.addMoney, addItem: state.addItem };
  state.addMoney = () => { prizes++; }; state.addItem = () => {};
  try {
    const scope = {
      state, recordScorecard, form: () => ({ name: 'Princess', species: 'Dog' }),
      groomDog: async () => ({ quality }), awardSkill() {}, sfx: { found() {} },
      SHOW_JUDGES: ['Alma', 'Ian', 'Noor'].map(name => ({ name, id: name })),
      raiseScorecard: async () => { assert.ok(saves); return () => {}; },
      ui: { say: async text => typeof text === 'object' ? 'grooming' : undefined },
    };
    const judge = await loadJudging('show-presentation', scope);
    const world = { chooseCoursePet: async () => 'princess', save() { saves++; } };
    await judge(world); assert.equal(prizes, 0);
    quality = 100; await judge(world); await judge(world);
    assert.equal(prizes, 1); assert.equal(saves, 3); assert.equal(state.data.scorecards.length, 3);
    assert.equal(state.data.scorecards[0].outcome, 'Completed · no award');
    assert.equal(state.data.scorecards[2].outcome, 'Award already recorded');
  } finally { Object.assign(state, originals); }
});
