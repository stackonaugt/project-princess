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

test('closing school cancels animation and resolves exactly once without XP', () => {
  let queue = new Map(), sequence = 0, callbacks = 0, result = 'pending';
  globalThis.requestAnimationFrame = fn => { queue.set(++sequence, fn); return sequence; };
  globalThis.cancelAnimationFrame = id => queue.delete(id);
  const panel = new Element();
  const session = openTraining(panel, () => {}, { id: 'salami', name: 'Salami', species: 'cat', day: 2, done: r => { result = r; callbacks++; } });
  session.action();
  assert.equal(queue.size, 1);
  session.cleanup(); session.cleanup();
  assert.equal(result, null); assert.equal(callbacks, 1); assert.equal(queue.size, 0);
});

const { PET_BY_ID } = await import('../game/src/data/pets.js');
const { MOVES, PET_MOVES } = await import('../game/src/data/moves.js');
const { petFighter, foeFighter, damage } = await import('../game/src/systems/battle.js');
const { effectiveness } = await import('../game/src/data/types.js');
const { givePhoneTreat, beginMartyCare, needsMartyCare, martyApproach } = await import('../game/src/systems/pet-care.js');
const { PET_FRAMES } = await import('../game/src/art/sprites.js');

function newPetSave() { state.useSlot(3); state.deleteSlot(3); state.useSlot(3); }

test('every recruitment route fills empty team slots and preserves the chosen team when full', () => {
  newPetSave();
  for (const id of ['princess', 'marty', 'salami', 'spooky']) assert.equal(state.findPet(id), true);
  assert.deepEqual(state.data.party, ['princess', 'marty', 'salami']);
  assert.equal(state.findPet('marty'), false);
  state.setParty(['marty']); state.findPet('poppy');
  assert.deepEqual(state.data.party, ['marty', 'poppy']);
  state.save(); state.useSlot(3);
  assert.deepEqual(state.data.party, ['marty', 'poppy']);
});

test('Marty has a curly cavoodle sprite, Stinky matchup and all four moves', () => {
  assert.equal(PET_BY_ID.marty.owner, 'Trish and Gordon');
  assert.equal(effectiveness('smelly', 'fairy'), 2);
  assert.equal(MOVES.gordonfood.name, 'Human Food from Gordon');
  assert.deepEqual(PET_MOVES.marty, ['smellpoo', 'bite', 'growl', 'gordonfood']);
  assert.ok(MOVES.gordonfood.effect.heal > 0);
  assert.equal(PET_FRAMES.cavoodle.length, 2);
  assert.notDeepEqual(...PET_FRAMES.cavoodle);
  for (const rows of PET_FRAMES.cavoodle) { assert.equal(rows.length, 16); assert.ok(rows.every(r => r.length === 16)); }
});

test('first Marty match is level three even with two pets; rematches return to full strength', () => {
  newPetSave(); state.findPet('princess'); state.pet('princess').level = 5;
  assert.deepEqual(trainerTeam('gordon'), [['pet:marty', 3]]);
  state.findPet('salami'); assert.deepEqual(trainerTeam('gordon'), [['pet:marty', 3]]);
  state.data.beaten.gordon = 1;
  assert.deepEqual(trainerTeam('gordon'), [['pet:marty', 8]]);
});

test('a fresh Princess wins the gentle match using Claw Attack against worst-case Smell Poo hits', () => {
  newPetSave(); state.findPet('princess'); state.pet('princess').level = 5;
  const princess = petFighter('princess'), marty = foeFighter('pet:marty', 3), random = Math.random;
  try {
    for (let turn = 0; turn < 20 && princess.hp > 0 && marty.hp > 0; turn++) {
      Math.random = () => 0.5; marty.hp -= damage(princess, marty, MOVES.clawattack).dmg;
      if (marty.hp <= 0) break;
      let sample = 0; Math.random = () => sample++ === 0 ? 0 : 0.999;
      princess.hp -= damage(marty, princess, MOVES.smellpoo).dmg;
    }
    assert.ok(marty.hp <= 0 && princess.hp > 0, `Princess ${princess.hp}, Marty ${marty.hp}`);
  } finally { Math.random = random; }
});

test('Woods approach respects location, owner schedule, repeat visits and progression', () => {
  newPetSave(); state.findPet('princess');
  assert.ok(martyApproach('woods', 20, 12, false, true));
  assert.equal(martyApproach('woods', 20, 12, true, true), false);
  assert.equal(martyApproach('woods', 20, 12, false, false), false);
  assert.equal(martyApproach('lohse', 20, 12, false, true), false);
  assert.equal(martyApproach('woods', 4, 12, false, true), false);
  state.findPet('marty'); assert.equal(martyApproach('woods', 20, 12, false, true), false);
});

test('phone care restores real HP, consumes one food, clears tutorial and survives reload', () => {
  newPetSave(); state.findPet('marty'); beginMartyCare();
  assert.ok(needsMartyCare()); assert.equal(state.count('chicken'), 2);
  assert.equal(givePhoneTreat('marty', 'tennis').ok, false);
  assert.equal(givePhoneTreat('princess', 'chicken').ok, false);
  const result = givePhoneTreat('marty', 'chicken');
  assert.ok(result.ok && result.healed > 0); assert.equal(result.reaction, 'love');
  assert.equal(state.count('chicken'), 1); assert.equal(state.pet('marty').hp, null);
  assert.equal(needsMartyCare(), false);
  assert.equal(givePhoneTreat('marty', 'chicken').ok, false);
  assert.equal(state.count('chicken'), 1);
  state.useSlot(3); assert.equal(state.pet('marty').hp, null);
  state.pet('marty').hp = 0; assert.ok(givePhoneTreat('marty', 'chicken').ok);
  assert.ok(petFighter('marty').hp > 0);
});

const { addTutorial,completeTutorial,tutorialNotes,syncTodo,unreadTodo,readTodo } = await import('../game/src/systems/todo.js');
const { SKILLS,awardSkill,skill } = await import('../game/src/systems/player-skills.js');
const { exitRestriction } = await import('../game/src/systems/guidance.js');
const { getMap,invalidateMap } = await import('../game/src/data/regions.js');
const { COURSES,CourseSession } = await import('../game/src/systems/course.js');
const { CRAFT_RECIPES } = await import('../game/src/data/crafting.js');
const { SHOPS } = await import('../game/src/data/shops.js');

test('tutorial notes and unread quest badges persist, acknowledge once and track real completion',()=>{
  newPetSave();state.findPet('princess');syncTodo();
  addTutorial('grass','Long grass','Walk through grass.');
  assert.equal(unreadTodo(),1);addTutorial('grass','Long grass','Walk through grass.');
  assert.equal(unreadTodo(),1);state.save();state.useSlot(3);assert.equal(unreadTodo(),1);
  readTodo();assert.equal(unreadTodo(),0);assert.equal(tutorialNotes()[0].done,false);
  state.data.side.bake=1;syncTodo();assert.equal(unreadTodo(),1);
  completeTutorial('grass');assert.equal(tutorialNotes()[0].done,true);
  readTodo();syncTodo();assert.equal(unreadTodo(),0);
});
test('Farming preserves existing Gathering XP and shortcut opens only after Marty',()=>{
  newPetSave();awardSkill('gathering',80);assert.equal(SKILLS.gathering.name,'Farming');assert.equal(skill('gathering').level,2);
  state.findPet('princess');assert.match(exitRestriction('allen',{to:'station'}),/Marty/);
  assert.equal(exitRestriction('allen',{to:'woods'}),null);
  state.findPet('marty');assert.equal(exitRestriction('allen',{to:'station'}),null);
});
test('shed crafting uses shop materials and yard upgrades add real stations on a clear lawn',()=>{
  newPetSave();assert.deepEqual(COURSES.yardstarter.stations,['jump','jump']);
  assert.ok(SHOPS.bunnings.tabs.includes('materials'));assert.ok(SHOPS.bunnings.materials.includes('bolts'));
  assert.equal(CRAFT_RECIPES.courseextension.requires,'coursekit');assert.equal(CRAFT_RECIPES.weavekit.requires,'courseextension');
  state.addItem('coursekit');invalidateMap('yard');const map=getMap('yard');
  assert.ok(map.objects.find(o=>o.kind==='gardenshed'&&o.interact==='workbench'));
  assert.ok(map.objects.find(o=>o.kind==='toolbox'));
  for(let y=6;y<14;y++)for(let x=2;x<17;x++)assert.equal(map.solid[y*map.w+x],0,`${x},${y}`);
  assert.equal(getMap('allen').npcs.some(n=>n.id==='trist_test'),false);
  assert.ok(new CourseSession('novice').stations.length > new CourseSession('yardstarter').stations.length);
});
