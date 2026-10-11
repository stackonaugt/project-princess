// Fishing round two: more fish in tiers, rods gated by the fishing skill,
// four fish per spot per day, bait in the Bag's Fishing tab, Ross Millward's
// comp at Coburg Lake, and equipment (rods, tackle, clothing).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const storage = new Map();
globalThis.localStorage = { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) };
const { state } = await import('../game/src/systems/state.js');
const { ITEMS, isTreat } = await import('../game/src/data/items.js');
const { UPGRADES, FISHING_ORDER } = await import('../game/src/data/upgrades.js');
const { NPCS } = await import('../game/src/data/npcs.js');
const { PEOPLE } = await import('../game/src/data/dialogue.js');
const { ITEM_ART } = await import('../game/src/art/paint/items.js');
const { SKILLS, skill, awardSkill } = await import('../game/src/systems/player-skills.js');
const { FISH, FISH_TABLES, DAILY_FISH, COMP, rodFor, EQUIPMENT_SLOTS } = await import('../game/src/data/fishing.js');
const { FishFight, fishingEase } = await import('../game/src/systems/fishing.js');
const A = await import('../game/src/systems/angler.js');
const { getMap } = await import('../game/src/data/regions.js');

const seeded = seed => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
function fresh() { state.reset?.(); state.data = JSON.parse(JSON.stringify(state.data)); state.data.inventory = {}; state.data.upgrades = {}; state.data.playerSkills = {}; state.data.hero = 'helen'; state.data.day = 3; state.data.minutes = 10 * 60; state.data.fishing = { day: 0, caught: {}, log: {}, best: {}, member: false, compWeek: -1, compWins: 0 }; }

// A player with a human reaction delay, so harder fish and easier fights show.
function human(fish, ease, seed) {
  const rng = seeded(seed), f = new FishFight({ fish, zone: FISH[fish].zone, ease, rng });
  const seen = []; let last = -9;
  while (!f.over) {
    seen.push({ pos: f.pos, tension: f.tension, inZone: f.inZone, c: f.centre, zw: f.zw });
    f.step(1 / 30); if (f.over) break;
    const s = seen[Math.max(0, seen.length - 9)];
    if (f.t - last < 0.2 || (rng() > 0.2 && s.tension > 0.65)) continue;
    if (!s.inZone || Math.abs(s.pos - s.c) > s.zw * 0.35 || f.t - last > 1) { f.tap(); last = f.t; }
  }
  return f.result === 'caught';
}
const rate = (fish, ease) => { let n = 0; for (let s = 0; s < 300; s++) n += human(fish, ease, s); return n / 300; };

test('every fish is an item with art, a fight and a size; cheap ones sell for less', () => {
  for (const [id, f] of Object.entries(FISH)) {
    assert.ok(ITEMS[id], id); assert.ok(ITEM_ART[id], `${id} art`);
    for (const r of ITEM_ART[id].rows) assert.equal(r.length, 12, `${id} art row`);
    assert.equal(f.fight.length, 2); assert.ok(f.cm[1] >= f.cm[0] && f.kg[1] >= f.kg[0]);
    assert.equal(!!ITEMS[id].junk, !!f.junk);
  }
  assert.equal(ITEMS.carp.sell, 3); assert.equal(ITEMS.yabby.sell, 4); assert.equal(ITEMS.redfin.sell, 8);
  // Rarer sells for more, tier by tier.
  const best = t => Math.max(...Object.keys(FISH).filter(id => !FISH[id].junk && FISH[id].tier === t).map(id => ITEMS[id].sell));
  const worst = t => Math.min(...Object.keys(FISH).filter(id => !FISH[id].junk && FISH[id].tier === t).map(id => ITEMS[id].sell));
  for (let t = 1; t <= 3; t++) assert.ok(worst(t) > best(t - 1), `tier ${t} pays more than tier ${t - 1}`);
  for (const t of Object.values(FISH_TABLES)) for (const [id] of t) assert.ok(FISH[id], id);
  assert.ok(isTreat('murraycod') && !isTreat('bait') && !isTreat('fishtrophy'));
});

test('cheap fish fight exactly as before; rare fish are harder and rarer', () => {
  assert.deepEqual(FISH.carp.fight, [0.84, 0.2]); assert.equal(FISH.carp.zone, 0.3);
  assert.deepEqual(FISH.redfin.fight, [1.05, 0.5]); assert.equal(FISH.redfin.zone, 0.18);
  assert.deepEqual(FISH.yabby.fight, [0.95, 0.7]); assert.equal(FISH.yabby.zone, 0.24);
  const e = fishingEase({ level: 5, rodTier: 3 });
  assert.ok(rate('carp', e) > rate('browntrout', e) && rate('browntrout', e) > rate('murraycod', e));
  // Rarer: the best fish weigh least in every table.
  for (const t of Object.values(FISH_TABLES)) {
    const w = tier => t.filter(([id]) => FISH[id].tier === tier && !FISH[id].junk).reduce((a, [, n]) => a + n, 0);
    if (w(3)) assert.ok(w(3) < w(2) || !w(2)); if (w(2)) assert.ok(w(2) < w(0));
  }
});

test('the fishing skill makes fights easier, and the rods and lure add to it', () => {
  assert.ok(SKILLS.fishing);
  assert.equal(fishingEase({ level: 1, rodTier: 1 }), 0);
  assert.ok(fishingEase({ level: 5, rodTier: 1 }) > 0);
  assert.ok(fishingEase({ level: 5, rodTier: 3 }) > fishingEase({ level: 5, rodTier: 2 }));
  assert.ok(rate('eel', fishingEase({ level: 10, rodTier: 3 })) > rate('eel', 0) + 0.3);
  const f0 = new FishFight({ fish: 'bass', zone: FISH.bass.zone, rng: seeded(1) }), f1 = new FishFight({ fish: 'bass', zone: FISH.bass.zone, ease: 0.4, rng: seeded(1) });
  assert.ok(f1.zw > f0.zw && f1.speed < f0.speed && f1.hold < f0.hold);
});

test('rods unlock by fishing level and in order; only better rods hold the best fish', () => {
  fresh();
  assert.deepEqual(FISHING_ORDER, ['rod', 'rod2', 'rod3']);
  for (const id of FISHING_ORDER) assert.equal(UPGRADES[id].equipment, 'rod');
  assert.equal(A.rodLock('rod'), null);
  assert.match(A.rodLock('rod2'), /Fishing level 3/);
  awardSkill('fishing', 240); assert.equal(skill('fishing').level, 3);
  assert.match(A.rodLock('rod2'), /Needs a rod/);
  state.data.upgrades.rod = true;
  assert.equal(A.rodLock('rod2'), null);
  assert.match(A.rodLock('rod3'), /Fishing level 5/);
  awardSkill('fishing', 560); assert.equal(skill('fishing').level, 5);
  assert.match(A.rodLock('rod3'), /Needs carbon rod/);
  state.data.upgrades.rod2 = true;
  assert.equal(A.rodLock('rod3'), null);
  assert.equal(A.bestRod(), 'rod2'); assert.equal(A.rodTier(), 2);
  assert.equal(rodFor('carp'), 1); assert.equal(rodFor('bass'), 2); assert.equal(rodFor('murraycod'), 3);
  // The comp water never offers a fish your rod cannot hold.
  for (let s = 0; s < 300; s++) assert.ok(rodFor(A.rollFish('coburglake', { maxTier: 2, rng: seeded(s) })) <= 2);
});

test('four fish from one spot and it is fished out until tomorrow; junk does not count', () => {
  fresh();
  for (let i = 0; i < DAILY_FISH - 1; i++) A.recordCatch('carp', { cm: 40, kg: 1 }, 'lake');
  A.recordCatch('oldboot', { cm: 30, kg: 0.7 }, 'lake');
  assert.equal(A.fishedOut('lake'), false);
  A.recordCatch('redfin', { cm: 30, kg: 0.5 }, 'lake');
  assert.equal(A.fishedOut('lake'), true);
  assert.equal(A.fishedOut('wetlands'), false, 'per spot');
  assert.equal(state.count('carp'), 3);
  assert.ok(skill('fishing').xp > 0, 'catches give fishing XP');
  state.data.day++;
  assert.equal(A.fishedOut('lake'), false, 'a new day');
  // Saved and loaded intact.
  state.data.fishing.member = true;
  const back = JSON.parse(JSON.stringify(state.data));
  assert.ok(back.fishing.log.carp === 3 && back.fishing.member);
  const src = readFileSync(new URL('../game/src/systems/fishing-trip.js', import.meta.url), 'utf8');
  assert.match(src, /It\\'s all fished out here for now\. Come back later\./);
  const st = readFileSync(new URL('../game/src/systems/state.js', import.meta.url), 'utf8');
  assert.match(st, /fishing: \{ day: 0, caught: \{\}/); assert.match(st, /raw\.fishing/); assert.match(st, /'gathering','fishing'/);
});

test('bait shows in the Bag (Fishing tab), and the fishing screen shows how much is left', () => {
  assert.ok(ITEMS.bait.bait);
  const bag = readFileSync(new URL('../game/src/ui/bag.js', import.meta.url), 'utf8');
  assert.match(bag, /\['fish', 'Fishing', it => it\.fish \|\| it\.junk \|\| it\.bait\]/);
  assert.ok(bag.indexOf("['fish', 'Fishing'") < bag.indexOf("['garden', 'Garden'"), 'bait is filed before the garden');
  const trip = readFileSync(new URL('../game/src/systems/fishing-trip.js', import.meta.url), 'utf8');
  assert.match(trip, /Bait: \$\{state\.count\('bait'\)\}/);
});

test('Ross Millward runs the comp at Coburg Lake: scout look, rare fish entry, prizes', () => {
  fresh();
  assert.equal(NPCS.ross.name, 'Ross Millward');
  const L = NPCS.ross.look; assert.ok(L.hat && L.scarf && L.shirt === '#c8b07a');
  assert.ok(PEOPLE.ross.lines.length >= 3);
  for (const l of PEOPLE.ross.lines.flat()) assert.ok(l.length < 140 && !l.includes('—'), l);
  assert.ok(getMap('coburglake').npcs.some(n => n.id === 'ross'));
  assert.ok(ITEMS.fishtrophy.trophy && ITEMS.fishtrophy.trophyText);
  // Entry: a tier 2 fish.
  assert.deepEqual(A.rareFish(), []);
  state.addItem('carp'); assert.deepEqual(A.rareFish(), []);
  state.addItem('browntrout'); assert.deepEqual(A.rareFish(), ['browntrout']);
  A.joinComp(); assert.ok(A.isMember());
  // Sundays 7 to noon, once a week.
  state.data.day = 7; state.data.minutes = 6 * 60; assert.equal(A.compOpen(), false);
  state.data.minutes = 9 * 60; assert.equal(A.compOpen(), true);
  state.data.day = 6; assert.equal(A.compOpen(), false);
  state.data.day = 7; A.startComp(); assert.equal(A.compOpen(), false);
  // Results and prizes.
  const r = A.compResults(99); assert.equal(r.place, 0); assert.equal(r.rows.length, COMP.rivals.length + 1);
  assert.equal(A.compResults(0).place, COMP.rivals.length);
  const money = state.data.money, p = A.awardComp(0);
  assert.deepEqual(p.items, COMP.firstPrize); assert.equal(state.data.money, money + COMP.prizes[0]);
  assert.equal(state.count('fishtrophy'), 1); assert.equal(state.count('goldenlure'), 1);
  assert.deepEqual(A.awardComp(0).items, [], 'the cup is a one-off');
  assert.ok(A.lureEase() > 0, 'the golden lure helps');
});

test('equipment is data-driven: rods, tackle and the training vest have slots', () => {
  assert.equal(ITEMS.trainingvest.equipment, 'clothing');
  assert.equal(ITEMS.goldenlure.equipment, 'tackle');
  for (const u of Object.values(UPGRADES)) if (u.equipment) assert.ok(EQUIPMENT_SLOTS[u.equipment]);
  for (const it of Object.values(ITEMS)) if (it.equipment) assert.ok(EQUIPMENT_SLOTS[it.equipment]);
  const bag = readFileSync(new URL('../game/src/ui/bag.js', import.meta.url), 'utf8');
  assert.match(bag, /\['gear', 'Equipment'\]/);
});
