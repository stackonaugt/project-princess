// Battle balance simulator. Runs thousands of battles with the real rules
// (src/systems/battle.js) and a sensible player, and prints win rates,
// battle length and XP pace along the intended route.
//
//   node tools/balance.mjs            the whole route
//   node tools/balance.mjs 500        fewer runs per matchup (faster)
//
// Tune: levels in src/data/enemies.js (ENCOUNTERS, TRAINERS), START_LEVEL
// and xp formulas in src/systems/battle.js, ENCOUNTER_RATE in config.js.
// Rough targets: wild battles 85-98% wins; trainers 55-85% with a sensible
// team at the expected level; nobody should be a guaranteed loss.

globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
const R = await import('../src/systems/battle.js');
const { MOVES } = await import('../src/data/moves.js');
const { TRAINERS, ENCOUNTERS } = await import('../src/data/enemies.js');
const { effectiveness } = await import('../src/data/types.js');
const { state } = await import('../src/systems/state.js');
const { PET_BY_ID } = await import('../src/data/pets.js');

const RUNS = +process.argv[2] || 2000;

function mine(id, level, { hearts = 3, evolved = false, gear = null } = {}) {
  const rec = state.pet(id);
  Object.assign(rec, { found: true, level, hp: null, evolved, gear, points: hearts * 25 });
  return R.petFighter(id);
}

// The player: heal when low, otherwise the hit that does most damage.
function pickMine(f, foe) {
  const heal = f.moves.find(m => MOVES[m].effect?.heal);
  if (heal && f.hp / f.maxHp < 0.35 && Math.random() < 0.8) return heal;
  let best = f.moves[0], bv = -1;
  for (const m of f.moves) {
    const mv = MOVES[m];
    const v = mv.power ? mv.power * effectiveness(mv.type, foe.type) * ([].concat(f.type).includes(mv.type) ? 1.5 : 1) : (mv.effect?.charge && !f.charged ? 40 : 10);
    if (v > bv) { bv = v; best = m; }
  }
  return best;
}

function use(u, t, id) {
  const m = MOVES[id], e = m.effect || {};
  if (e.evade && u.lastMove === id && Math.random() < 0.5) { u.lastMove = null; return; }
  u.lastMove = id;
  if (e.usesHeld && !u.held) return;
  if (m.power) {
    if (t.evade) return;
    let { dmg } = R.damage(u, t, m);
    if (dmg >= t.hp && R.refusesToLose(t)) dmg = t.hp - 1;
    t.hp = Math.max(0, t.hp - dmg); u.charged = false;
    if (e.drain) u.hp = Math.min(u.maxHp, u.hp + Math.max(1, Math.floor(dmg * e.drain)));
    if (e.destroyItem) t.held = null;
  }
  if (e.heal) { u.hp = Math.min(u.maxHp, u.hp + Math.ceil(u.maxHp * e.heal)); if (e.usesHeld) u.held = null; }
  if (e.foeHeal) t.hp = Math.min(t.maxHp, t.hp + Math.ceil(t.maxHp * e.foeHeal));
  if (e.recoil) u.hp = Math.max(0, u.hp - Math.ceil(u.maxHp * e.recoil));
  const st = (f, k, d) => { f.stages[k] = Math.max(-6, Math.min(6, f.stages[k] + d)); };
  if (e.foeAtk) st(t, 'atk', -e.foeAtk); if (e.foeDef) st(t, 'def', -e.foeDef);
  if (e.selfAtk) st(u, 'atk', e.selfAtk); if (e.selfDef) st(u, 'def', e.selfDef);
  if (e.evade) u.evade = true; if (e.charge) u.charged = true;
}

// One battle: your team (fighters) against a list of foes. Returns stats.
function battle(team, foes) {
  let turns = 0, fi = 0, foe = foes[0], me = team.find(f => f.hp > 0);
  while (me && foe && turns < 200) {
    turns++;
    const a = pickMine(me, foe), b = R.chooseFoeMove(foe, me);
    const pr = id => (MOVES[id].effect?.evade ? 1 : 0);
    const meFirst = pr(a) !== pr(b) ? pr(a) > pr(b) : me.stats.speed !== foe.stats.speed ? me.stats.speed > foe.stats.speed : Math.random() < 0.5;
    for (const [u, t, id] of meFirst ? [[me, foe, a], [foe, me, b]] : [[foe, me, b], [me, foe, a]]) {
      if (u.hp <= 0 || t.hp <= 0) continue;
      use(u, t, id);
    }
    const regen = R.gearBonus(me).regen; if (regen && me.hp > 0) me.hp = Math.min(me.maxHp, me.hp + Math.ceil(me.maxHp * regen));
    me.evade = false; foe.evade = false;
    if (foe.hp <= 0) { foe = foes[++fi]; }
    if (me.hp <= 0) me = team.find(f => f.hp > 0);
  }
  return { win: !foe, turns, left: team.reduce((s, f) => s + f.hp / f.maxHp, 0) / team.length };
}

function trial(label, makeTeam, makeFoes) {
  let wins = 0, turns = 0, left = 0;
  for (let i = 0; i < RUNS; i++) {
    const r = battle(makeTeam(), makeFoes());
    wins += r.win; turns += r.turns; left += r.left;
  }
  const pct = (wins / RUNS * 100).toFixed(0).padStart(3);
  console.log(`${pct}% win  ${(turns / RUNS).toFixed(1).padStart(5)} turns  ${(left / RUNS * 100).toFixed(0).padStart(3)}% HP left   ${label}`);
}

const trainer = id => () => TRAINERS[id].team.map(([e, lv]) => R.foeFighter(e, lv));
const wildAvg = (suburb, bump = 0) => () => {
  const t = ENCOUNTERS[suburb], e = t[Math.floor(Math.random() * t.length)];
  return [R.foeFighter(e.id, e.lv[0] + Math.floor(Math.random() * (e.lv[1] - e.lv[0] + 1)) + bump)];
};

console.log(`\n${RUNS} runs per line. Win rate, average turns, average team HP left after.\n`);
console.log('--- Laverton (Princess only)');
trial('Princess L5 vs Laverton wild', () => [mine('princess', 5)], wildAvg('laverton'));
trial('Princess L6 vs Bin Man', () => [mine('princess', 6)], trainer('binman'));
trial('Princess L8 vs Bin Man', () => [mine('princess', 8)], trainer('binman'));
trial('Princess L7 vs Bin Man', () => [mine('princess', 7)], trainer('binman'));
console.log('--- The walk to Brunswick');
trial('Princess L7 vs Altona/Footscray/Flemington wild', () => [mine('princess', 7)], wildAvg('footscray'));
console.log('--- Brunswick');
trial('Princess L7 vs Brunswick wild', () => [mine('princess', 7)], wildAvg('brunswick'));
trial('Princess L7 vs Rose (Salami)', () => [mine('princess', 7)], trainer('rose'));
trial('Princess L8 + Salami L7 vs Slinks (Spooky)', () => [mine('princess', 8), mine('salami', 7)], trainer('slinks'));
trial('Princess L9 + Salami L8 + Spooky L8 vs Hipster', () => [mine('princess', 9), mine('salami', 8), mine('spooky', 8)], trainer('hipster'));
console.log('--- The walk to Reservoir');
trial('Team L9 vs Coburg/Preston wild', () => [mine('princess', 9), mine('salami', 9), mine('spooky', 9)], wildAvg('preston'));
console.log('--- Reservoir');
trial('Team L10 vs Reservoir wild', () => [mine('princess', 10), mine('salami', 10), mine('spooky', 10)], wildAvg('reservoir'));
trial('Team L11 vs Nathan (Rusty)', () => [mine('princess', 11), mine('salami', 11), mine('spooky', 11)], trainer('nathan'));
trial('Team L10 vs Sinead (Poppy)', () => [mine('princess', 10), mine('salami', 10), mine('spooky', 10)], trainer('sinead'));
trial('Team L11 vs Golfer Next Door', () => [mine('princess', 11), mine('poppy', 10), mine('salami', 11)], trainer('golfer'));
trial('Team L12 vs Tim (Stanley)', () => [mine('princess', 12), mine('poppy', 11), mine('salami', 12)], trainer('tim'));
trial('Team L10 vs the Stranger', () => [mine('princess', 10), mine('salami', 10), mine('spooky', 10)], trainer('stranger'));
console.log('--- Evolutions and gear');
trial('Flamcess L14 vs Reservoir wild +3', () => [mine('princess', 14, { evolved: true, hearts: 5 })], wildAvg('reservoir', 3));
trial('Princess L14 (not evolved) vs Reservoir wild +3', () => [mine('princess', 14)], wildAvg('reservoir', 3));
trial('Floppy L16 vs Tim (Stanley)', () => [mine('poppy', 16, { evolved: true, hearts: 5 })], trainer('tim'));
trial('Princess L6 + collar vs Bin Man', () => [mine('princess', 6, { gear: 'collar' })], trainer('binman'));
trial('Princess L6 + snack pouch vs Bin Man', () => [mine('princess', 6, { gear: 'pouch' })], trainer('binman'));

// XP pace: wild battles needed per level, using the average reward.
console.log('\n--- XP pace (wild battles needed to level up, at a typical foe level)');
for (const [lv, foeLv] of [[5, 4], [7, 6], [9, 7], [11, 9], [13, 10]]) {
  console.log(`  L${lv} -> L${lv + 1}: ${(R.xpToNext(lv) / R.xpReward({ level: foeLv }, false)).toFixed(1)} battles (foe L${foeLv})`);
}
