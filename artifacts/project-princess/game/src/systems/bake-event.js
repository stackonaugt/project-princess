import { state } from './state.js';
import { ui } from '../ui/ui.js';
import { BakingSession } from './baking.js';
import { ITEMS } from '../data/items.js';
import { RECIPES as COOK_RECIPES, BAKE_OFF } from '../data/cooking.js';
import { BAKE_CONTESTANTS } from '../data/bake-event.js';
import { itemIcon } from '../ui/images.js';
import { weekday } from '../data/routines.js';
import { awardSkill } from './player-skills.js';
import { sfx } from './sfx.js';
import { raiseScorecard } from './judge-votes.js';
import { recordScorecard, BAKE_CRITERIA } from './scorecards.js';

const SESSION_KEYS = ['stage', 'clock', 'value', 'score', 'quality', 'results', 'complete', 'feedback', 'st', 'competition'];
export function bakeAttempt(world) {
  if (world.bakeAttempt) return world.bakeAttempt;
  const raw = state.data.flags.bakeAttempt;
  if (!raw || !COOK_RECIPES[raw.id] || !Number.isInteger(raw.session?.stage) ||
      raw.session.stage < 0 || raw.session.stage > 3 || !Array.isArray(raw.session.results)) return null;
  const session = new BakingSession();
  for (const key of SESSION_KEYS) if (key in raw.session) session[key] = structuredClone(raw.session[key]);
  if (session.stage < 3 && (!session.st || typeof session.st !== 'object')) return null;
  world.bakeAttempt = { id: raw.id, week: raw.week, session, helped: !!raw.helped, drama: !!raw.drama };
  return world.bakeAttempt;
}
export function saveBakeAttempt(world) {
  const a = world.bakeAttempt;
  if (!a) return;
  const session = {};
  for (const key of SESSION_KEYS) session[key] = structuredClone(a.session[key]);
  state.data.flags.bakeAttempt = { id: a.id, week: a.week, session, helped: a.helped, drama: a.drama };
}
export function paintBakeOff(world) {
  if (world.regionId !== 'bakeoff') return;
  const g = world.add.graphics().setDepth(9 * 16);
  for (let i = 0; i < 3; i++) {
    const x = (4.5 + i * 6) * 16, y = 7.5 * 16;
    g.fillStyle(0xf1e1c5).fillEllipse(x, y, 18, 6);
    g.fillStyle([0xe4b962, 0xb58150, 0xb17886][i]).fillRect(x - 7, y - 8, 14, 7);
    g.fillStyle(0xffefda).fillEllipse(x, y - 8, 14, 5);
    for (let j = 0; j < 4; j++) g.fillStyle(i === 2 ? 0xb43c57 : 0xd29932).fillCircle(x - 5 + j * 3, y - 9, 1.5);
  }
}
export async function enterBakeOff(world, npc, opts = {}) {
  if (weekday(state.data.day) !== BAKE_OFF.day) return ui.say('The bake-off opens on Saturday. Betty can help you practise before then.', opts);
  const week = Math.floor(state.data.day / 7);
  if (state.data.flags.bakeoffWeek === week) return ui.say([BAKE_OFF.done], opts);
  if (world.regionId !== 'bakeoff') {
    await ui.say(['Betty: "Come inside the catering hall. Everybody is setting up their tables. You can speak to the contestants before you start."'], opts);
    world.goTo('bakeoff', 'door'); return;
  }
  const existing = bakeAttempt(world);
  if (existing?.week === week) {
    return ui.say(existing.session.complete ?
      'Your cake is ready. Bring it to Ruth at the judging counter.' :
      `Your entry is registered. Next: ${['the preparation bench', 'the oven station', 'the decorating table'][existing.session.stage]}.`, opts);
  }
  const entries = state.bagItems().filter(id => ITEMS[id]?.baked && COOK_RECIPES[id]);
  if (!entries.length) return ui.say([BAKE_OFF.noEntry], opts);
  const id = await ui.say({ text: 'Register a bake. Your entry is only used when judging is complete.',
    choices: [...entries.map(id => ({ label: ITEMS[id].name, value: id, icon: itemIcon(id, 32) })),
      { label: 'Look around first', value: null }] }, { ...opts, cancelValue: null });
  if (!id) return;
  world.bakeAttempt = { id, week, session: new BakingSession({competition:true}), helped: false, drama: false };
  world.save();
  await ui.say(['Registration complete. Walk to the preparation bench, then the oven and decorating table.',
    'Meghan glances at your entry and straightens her tablecloth. Betty pretends not to notice.'], opts);
}
export async function bakeStation(world, kind) {
  const a = bakeAttempt(world);
  if (!a) return enterBakeOff(world);
  if (a.week !== Math.floor(state.data.day / 7)) return enterBakeOff(world);
  if (kind === 'bakejudge') return judgeBakeOff(world);
  const index = ['bakeprep', 'bakeoven', 'bakedecor'].indexOf(kind);
  if (a.session.stage !== index) return ui.say(a.session.complete ?
    'Your cake is ready for Ruth at the judging counter.' :
    `Use ${['the preparation bench', 'the oven station', 'the decorating table'][a.session.stage]} next.`);
  if (index === 1 && !a.drama) {
    a.drama = true;
    const help = await ui.say({ text: 'A tray tips beside Meghan’s table. Her butter lands on the floor. She looks at your bag, then looks away.',
      choices: [{ label: 'Offer butter', value: true, note: state.count('butter') ? 'Uses one butter; she can finish her original recipe.' : 'You do not have any spare butter.' },
        { label: 'Help tidy the spill', value: false }] }, { cancelValue: false });
    if (help && state.count('butter')) {
      state.removeItem('butter'); a.helped = true; awardSkill('cooking', 5);
      await ui.say('Meghan accepts it quietly. "Thank you. I still intend to win." Betty’s eyebrows almost leave her face.');
    } else await ui.say('You help clear the floor. Meghan substitutes oil and carries on. Nobody is giving up today.');
    world.save();
  }
  const result = await ui.baking({ name: ITEMS[a.id].name, session: a.session, singleStage: true });
  world.save();
  if (result) ui.toast(a.session.complete ? 'Cake ready: take it to the judges' : `Next: ${['preparation', 'oven', 'decorating'][a.session.stage]} station`);
}
export async function bakeNpc(world, npc) {
  const opts = { name: npc.info.name };
  if (npc.id === 'betty') return enterBakeOff(world, npc, opts);
  if (npc.id === 'bakejudge' || npc.id === 'bakehallie') return judgeBakeOff(world, opts);
  const c = BAKE_CONTESTANTS.find(c => c.id === npc.id);
  if (!c) return;
  await ui.say([`${c.name} has ${c.dish.toLowerCase()} on the table.`,
    ...c.lines, npc.id === 'bakemeghan' && bakeAttempt(world)?.helped ?
      'She has left a spare piping bag on the edge of your table. Neither of you mentions it.' : 'The judges will taste every entry at the end.'], opts);
}
export async function judgeBakeOff(world, opts = {}) {
  const a = bakeAttempt(world);
  if (!a) return enterBakeOff(world, null, opts);
  if (state.data.flags.bakeoffWeek === a.week) return ui.say([BAKE_OFF.done], opts);
  if (a.week !== Math.floor(state.data.day / 7) || weekday(state.data.day) !== BAKE_OFF.day)
    return ui.say('This entry belongs to a previous Saturday. Register a fresh entry with Betty.', opts);
  if (!a.session.complete) return ui.say('Finish all three workstations before presenting your cake.', opts);
  if (!state.count(a.id)) return ui.say(`Your ${ITEMS[a.id].name.toLowerCase()} is no longer in the bag. Bake another before judging; your preparation is safe.`, opts);
  // Skill and recipe choice must not conceal mistakes in the actual bake.
  const marks = a.session.results.map(r => Math.max(0, Math.min(10, Math.floor(r.quality / 10))));
  const total = marks.reduce((x, y) => x + y, 0);
  const rivals = BAKE_CONTESTANTS.map((c, i) => ({ ...c,
    score: Math.min(29, c.base + 2 + (state.data.day + i) % 2 + (i === 0 && a.helped ? 1 : 0)) }));
  const place = rivals.filter(c => c.score >= total).length; // A tie is not a win over Meghan.
  const prize = BAKE_OFF.prize[place] || 0;
  // Commit the whole result before presentation; closing/reloading cannot award it twice.
  state.removeItem(a.id); state.data.flags.bakeoffWeek = a.week;
  state.data.side.bakeQuest.entries++; awardSkill('cooking', 40 + a.session.score * 5);
  if (prize) state.addMoney(prize);
  const wonRivalry = place === 0 && state.data.side.bake < 2;
  if (place === 0) { state.addItem('blueribbon'); sfx.found(); }
  if (wonRivalry) { state.data.side.bake = 2; state.addFriendPoints('betty', 50); }
  state.data.flags.lastBakeResult = { week: a.week, name: ITEMS[a.id].name, total, marks, place, rivals: rivals.map(c => ({ name: c.name, score: c.score })) };
  recordScorecard(state.data, {
    kind: 'bakeoff', entryId: a.id, entryName: ITEMS[a.id].name,
    event: 'Bake-off', division: 'Saturday bake-off',
    criteria: BAKE_CRITERIA.map((label, i) => ({ label, judge: ['Betty', 'Ruth', 'Hallie'][i], score: marks[i] })),
    outcome: `${['1st', '2nd', '3rd', '4th'][place] || `${place + 1}th`} place`,
  });
  world.bakeAttempt = null; delete state.data.flags.bakeAttempt; world.save();
  await ui.say(rivals.map(c => `${c.name} presents ${c.dish.toLowerCase()}. The judges award ${c.score}/30.`), opts);
  for (let i = 0; i < marks.length; i++) {
    const lowerCard = await raiseScorecard(world, ['betty', 'bakejudge', 'bakehallie'][i], marks[i]);
    try { await ui.say([
    `${['Betty · taste', 'Ruth · texture', 'Hallie · presentation'][i]} raises a card: ${marks[i]}/10.`,
    marks[i] >= 8 ? ['Light, balanced batter. The flavour comes through.', 'A lovely rise and golden crumb. You watched your oven carefully.', 'A balanced finish with room for every decoration.'][i] :
      ['Measure carefully and stop mixing when the batter is glossy.', 'Watch the rise and colour together, not just the heat setting.', 'Balance the decorations and give the centre a clear finish.'][i],
    ], opts); } finally { lowerCard(); }
  }
  await ui.say([`Your ${ITEMS[a.id].name.toLowerCase()}: ${total}/30.`,
    BAKE_OFF.results[place] + (prize ? ` You win $${prize}.` : ' Try again next Saturday.'),
    place === 0 ? 'The room applauds. Meghan nods once. Betty is trying, unsuccessfully, to look dignified.' :
      'The contestants share slices after judging. Even Betty admits the winning cake is good.',
    ...(wonRivalry ? BAKE_OFF.beatMeghan : []),
  ], opts);
}
