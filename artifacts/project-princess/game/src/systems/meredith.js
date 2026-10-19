// The Meredith Music Festival, part 1: night one. The rules and story beats
// (words, people and places are in data/meredith.js).
//
//   1 invited   the day after the party, Jess's charter bus waits on Allen St
//   2 arrived   off the bus at Reception (no pets: they are all at home): get a wristband
//   3 wristband find the crew at Top Camp, pitch your tent (a mini game: good or crappy)
//   4 pitched   carry the couch down to Charlotte at the Amphitheatre
//   5 carrying  ...which turns the day into night
//   6 night     Jess's pet portal demo: Toby comes out of it, then every pet from home does
//   7 hunt      get the scattered pets back (play-fights, quests, trades, the Eye, the crowd, a dance off)
//   8 sunrise   everyone is back: Mama King (dance with the crew), then the Ice Kids'
//               set curses the festival (m.cursed), both in front of the stage
//               (mfstagefront, cutscene only); then someone notices the sun coming
//               up and everyone heads to the Sunset Strip (mfsunview, cutscene only)
//   9 done      the Flame Queen rises: Princess, lost through the portal all night (to be continued)
//  10 home
//
// Time runs MF_CLOCK.slow times slower here and holds at dusk or before dawn
// until the story moves it on, so the day never ends by itself.
import { state } from './state.js';
import { ui } from '../ui/ui.js';
import { h } from '../ui/dom.js';
import { bus } from '../bus.js';
import { sfx } from './sfx.js';
import { controls } from './controls.js';
import { readyTeam, START_LEVEL } from './battle.js';
import { form, isEvolved, evolve, petTex } from './forms.js';
import { PETS } from '../data/pets.js';
import { NPCS } from '../data/npcs.js';
import { PEOPLE } from '../data/dialogue.js';
import { TRAINERS, ENEMIES } from '../data/enemies.js';
import { ITEMS } from '../data/items.js';
import { invalidateMap } from '../data/regions.js';
import { FEST_CROWD } from '../data/crowd.js';
import { TILE as T } from '../config.js';
import { TUNING } from '../data/tuning.js';
import { custom } from '../art/textures.js';
import { npcIcon, petPortrait, itemIcon } from '../ui/images.js';
import { MF_TEXT, MF_STAGE as S, MF_SCATTER, MF_SPARE, MF_STAY_HOME, MF_CLOCK, MF_TRAINERS, MF_NPCS, MF_COCKTAIL, MF_ENCOUNTERS, MF_MUSIC, MF_CUTSCENES, isMeredith, freshMeredith } from '../data/meredith.js';
import { pick } from '../util.js';

export { isMeredith };
export const fmt = (s, v = {}) => String(s).replace(/\{(\w+)\}/g, (m, k) => v[k] ?? m);
const L = (a, v) => (Array.isArray(a) ? a : [a]).map(s => fmt(s, v));
export const mf = () => state.data.meredith ||= freshMeredith();
const stage = () => mf().stage;
export const nightPhase = () => stage() >= S.night && stage() <= S.sunrise;
const hunting = () => stage() === S.hunt;
const pending = id => hunting() && !!mf().scatter[id] && !mf().got.includes(id);
const petName = id => form(id).name;
const whoName = id => NPCS[id]?.name || id;
const T_ = MF_TEXT;
const wait = (world, ms) => new Promise(r => world.time.delayedCall(ms, r));
// Where pets you have got back wait at the campsite, when your team is full.
const CAMP = [[10, 34], [12, 35], [14, 34], [16, 35], [11, 36], [13, 33], [15, 36], [17, 34], [9, 35], [18, 36]];

// ------------------------------------------------------------ who and what is here
export function mfSpotActive(n) {
  const s = stage(), c = n.mf;
  if (c?.from && s < c.from) return false;
  if (c?.until && s >= c.until) return false;
  if (c?.night && !nightPhase()) return false;
  // A friend with a pet somewhere in the crowd is off in the crowd, not in their spot.
  if (Object.entries(mf().scatter).some(([pid, sc]) => sc.by === n.id && sc.how === 'crowd' && pending(pid))) return false;
  return true;
}

// Which pets show up in this festival zone, and how. Nobody brings a pet:
// until the portal there are none here at all.
export function mfPets(world) {
  const out = [], z = world.regionId, d = mf();
  let camp = 0;
  for (const p of PETS) {
    const rec = state.pet(p.id), here = (x, y, extra) => ({ ...p, zone: z, home: [x, y], range: 1, behaviour: 'wander', sleeps: null, challenge: false, ...extra });
    if (state.inParty(p.id) && rec.found) { out.push({ data: p, mode: 'follow' }); continue; }
    const sc = d.scatter[p.id];
    if (sc && pending(p.id) && sc.zone === z) {
      if (sc.how === 'wild') out.push({ data: here(sc.at[0], sc.at[1]), mode: 'wild' });
      if (['goer', 'quest'].includes(sc.how) || (sc.how === 'dance' && nightPhase())) {
        const spot = world.map.npcs.find(n => n.id === sc.by);
        if (spot) out.push({ data: here(spot.x + 1, spot.y + 1), mode: 'wild' });
      }
      continue;
    }
    // Got back but not on the team: hanging out at the campsite with Jess.
    if (z === 'mftop' && rec.found && (d.got.includes(p.id) || p.id === 'toby') && stage() >= S.hunt) {
      const [x, y] = CAMP[camp++ % CAMP.length];
      out.push({ data: { ...p, homeSpot: { zone: 'mftop', x, y }, sleeps: null, challenge: false }, mode: 'home' });
    }
  }
  return out;
}

// ------------------------------------------------------------ the clock
export function mfClock(delta) {
  const m = state.data;
  m.minutes += delta / MF_CLOCK.slow;
  const day = !nightPhase();
  if (day && stage() < S.done && m.minutes > MF_CLOCK.dayHold) m.minutes = MF_CLOCK.dayHold;
  // After the Ice Kids' set it is the small hours, waiting on the sunrise.
  const hold = mf().cursed ? MF_CLOCK.dawn - 20 : MF_CLOCK.nightHold;
  if (!day && m.minutes > hold) m.minutes = hold;
  if (stage() >= S.done && m.minutes > MF_CLOCK.dayHold) m.minutes = MF_CLOCK.dayHold;
}

// ------------------------------------------------------------ getting there
// Jess texts and the charter bus waits on Allen St. Hidden until it's ready:
// only the Cheats app's Send the Meredith bus sets flags.meredith.
export async function mfInvite(world) {
  if (!state.data.flags.meredith || stage()) return;
  mf().stage = S.invited;
  invalidateMap('allen');
  world.save();
  sfx.found?.();
  await ui.say(T_.invite, { name: 'Pawphone' });
  ui.toast('Added to your To Do list');
  if (world.regionId === 'allen') world.scene.restart({ region: 'allen', entry: 'house' });
}

async function boardBus(world) {
  if (stage() !== S.invited) return ui.say(['The charter bus is booked. It goes when the festival does.']);
  await ui.say([T_.busDriver]);
  const go = await ui.say({ text: T_.busAsk, choices: [{ label: T_.busYes, value: true }, { label: T_.busNo, value: false }] }, { cancelValue: false });
  if (!go) return ui.say(T_.busNotYet);
  const d = state.data, m = mf();
  m.partyBefore = [...d.party];
  if (d.hero !== 'helen') { m.heroBefore = d.hero; world.setHero('helen'); }
  // Every pet stays home: the portal brings them later.
  state.setParty([]);
  await ui.say(T_.stayHome);
  await ui.say(T_.busRide);
  m.stage = S.arrived;
  invalidateMap('allen');
  d.minutes = MF_CLOCK.dayStart;
  world.goTo('mfreception', 'bus', 0);
}

async function busHome(world) {
  if (stage() < S.done) return ui.say(T_.noLeaveYet);
  const go = await ui.say({ text: T_.busHomeAsk, choices: [{ label: T_.busYes, value: true }, { label: T_.busNo, value: false }] }, { cancelValue: false });
  if (!go) return;
  await ui.say(T_.busHome);
  const d = state.data, m = mf();
  state.healAll();
  state.setParty((m.partyBefore || []).filter(id => state.isFound(id)));
  if (m.heroBefore) { world.setHero(m.heroBefore); m.heroBefore = null; }
  m.stage = S.home;
  for (const z of ['allen', 'mftop', 'mfamphi']) invalidateMap(z);
  d.minutes = Math.max(d.minutes, 17 * 60);
  world.goTo('allen', 'house', 0);
}

// Things you walk up to at the festival (and the bus on Allen St).
export async function mfInteract(world, t) {
  if (t.kind === 'mfbus') return world.regionId === 'allen' ? boardBus(world) : busHome(world);
  if (t.kind === 'mftent') return tent(world);
  if (t.kind === 'mfbar') return bar(world);
}

// ------------------------------------------------------------ your tent
async function tent(world) {
  const m = mf();
  if (stage() < S.wristband) return ui.say(['A bare patch of grass. Somebody has saved it with a single camp chair.']);
  if (!m.tent) {
    await ui.say(T_.tentSpot);
    const go = await ui.say({ text: T_.pitchAsk, choices: [{ label: T_.pitchYes, value: true }, { label: T_.busNo, value: false }] }, { cancelValue: false });
    if (!go) return;
    await ui.say(T_.pitchIntro);
    const pegs = await pitchGame(world);
    if (pegs === null) return;
    m.tent = pegs >= 3 ? 'good' : 'crappy';
    await ui.say(m.tent === 'good' ? T_.pitchGood : T_.pitchCrappy);
    if (stage() === S.wristband) m.stage = S.pitched;
    invalidateMap('mftop');
    world.save();
    ui.toast(T_.couchHint);
    world.scene.restart({ region: world.regionId, entry: null });
    return;
  }
  const go = await ui.say({ text: T_.restAsk, choices: [{ label: T_.restYes, value: true }, { label: T_.restNo, value: false }] }, { cancelValue: false });
  if (!go) return;
  world.cameras.main.fadeOut(400, 0, 0, 0);
  await new Promise(r => world.cameras.main.once('camerafadeoutcomplete', r));
  rest(world);
  world.cameras.main.fadeIn(500, 0, 0, 0);
  await ui.say(T_.rested);
}

// Four pegs: a marker slides along a bar; hammer when it is in the green.
// Resolves with the number of good pegs (0 to 4), or null if you stop.
function pitchGame(world) {
  return new Promise(resolve => {
    const PEGS = 4;
    let peg = 0, good = 0, pos = 0, dir = 1, ended = false, zone = 0, pauseFor = 0;
    const mark = h('i', { style: 'position:absolute;top:-3px;bottom:-3px;width:4px;background:#1e1a2a;border-radius:2px' });
    const green = h('i', { style: 'position:absolute;top:0;bottom:0;background:#5ad06a;border-radius:3px' });
    const track = h('div', { style: 'position:relative;height:14px;margin:6px 0;background:#f2c8d8;border:2px solid #4a2a4a;border-radius:4px;min-width:160px' }, green, mark);
    const status = h('p', { role: 'status', 'aria-live': 'polite' });
    const hit = () => {
      if (ended || pauseFor > 0) return;
      const ok = Math.abs(pos - zone) <= 0.11;
      if (ok) { good++; sfx.select?.(); } else sfx.bump?.();
      sfx.hit?.();
      world.player.perform?.('throw');
      world.cameras.main.shake(80, 0.003);
      ui.toast(ok ? 'Perfect peg!' : 'Wonky peg.');
      peg++;
      if (peg >= PEGS) return finish(good);
      pauseFor = 0.45; place();
    };
    const place = () => { zone = 0.15 + Math.random() * 0.7; green.style.left = `${(zone - 0.11) * 100}%`; green.style.width = '22%'; };
    const bar = h('section', { class: 'hall-event-bar', 'aria-label': 'Pitch your tent' }, h('b', {}, 'Pitch your tent'), status, track,
      h('div', { class: 'hall-cues' }, h('button', { class: 'wood-btn small', onclick: hit }, 'Hammer')),
      h('button', { class: 'wood-btn small hall-leave', onclick: () => finish(null) }, 'Stop'));
    const finish = n => {
      if (ended) return; ended = true;
      world.events.off('update', tick);
      bar.remove(); document.body.classList.remove('hall-event');
      ui.activity = null; controls.release(); if (world.cameras?.main) world.onResize();
      resolve(n);
    };
    const tick = (_t, delta) => {
      if (ended || document.hidden) return;
      const dt = delta / 1000;
      if (pauseFor > 0) { pauseFor -= dt; return; }
      pos += dir * dt * (0.9 + peg * 0.35);
      if (pos > 1) { pos = 1; dir = -1; } else if (pos < 0) { pos = 0; dir = 1; }
      mark.style.left = `calc(${pos * 100}% - 2px)`;
      status.textContent = fmt(T_.pitchBar, { n: peg + 1 });
    };
    place();
    document.body.append(bar); document.body.classList.add('hall-event');
    world.onResize(); controls.release();
    ui.activity = { walk: false, action: hit, cancel: () => finish(null) };
    world.events.on('update', tick);
    world.events.once('shutdown', () => finish(null));
  });
}

// Everyone gets their energy back, and the team fills up again from the campsite.
function rest(world) {
  state.healAll();
  const party = [...state.data.party];
  for (const id of ['toby', ...mf().got]) if (party.length < 3 && !party.includes(id) && state.isFound(id)) party.push(id);
  state.setParty(party);
  world.syncFollowers();
}

// ------------------------------------------------------------ the Pink Flamingo bar
async function bar(world) {
  const m = mf(), day = state.data.day, price = MF_COCKTAIL.price;
  await ui.say(T_.barSign);
  const choices = [];
  if (m.cocktail !== day) choices.push({ label: `${T_.barDrink} ($${price})`, value: 'drink' });
  choices.push({ label: `${T_.barTake} ($${price})`, value: 'take' }, { label: T_.barNo, value: null });
  const act = await ui.say({ text: fmt(T_.barAsk, { price }) + (m.cocktail === day ? ` ${T_.barAlready}` : ''), choices }, { cancelValue: null });
  if (!act) return;
  if (!state.spend(price)) return ui.say(T_.barBroke);
  sfx.pickup?.();
  if (act === 'drink') {
    m.cocktail = day;
    world.heartsFx?.(world.player, 4);
    await ui.say(T_.barDrunk);
  } else {
    state.addItem('flamingo');
    ui.toast(T_.barTook);
  }
  world.save();
}

// ------------------------------------------------------------ arriving in a zone
export async function mfEnter(world) {
  const m = mf(), z = world.regionId;
  nightStreams(world);
  ambience(world);
  if (z === 'mfamphi') { stageNotes(world); bobSilhouettes(world); seatCrew(world); }
  if (z === 'mfstagefront') return stageShow(world);
  if (z === 'mfsunview') return sunrise(world);
  if (z === 'mfreception' && m.stage === S.arrived && !m.arrivedSeen) {
    m.arrivedSeen = true; world.save();
    await ui.card({ kicker: 'Meredith', title: 'The Supernatural Amphitheatre', lines: T_.arriveCard, button: 'Let\'s go' });
    ui.toast(T_.wristbandHint);
  }
  if (m.stage === S.night && !m.nightSeen) {
    m.nightSeen = true; world.save();
    await ui.say(T_.nightFalls);
    await ui.card({ kicker: 'Meredith', title: 'Night one', lines: T_.nightCard, button: 'Let\'s go' });
    ui.toast(T_.portalHint);
  }
  if (m.stage === S.hunt && !m.huntSeen) { m.huntSeen = true; world.save(); ui.toast(T_.huntToast); }
  if (m.stage === S.done && !m.woke && z === 'mftop') { m.woke = true; world.save(); await ui.say(T_.afterSunrise); }
  // Once a night, somewhere in the dark: the Meredith echidna.
  if (hunting() && !m.glimpsed && ['mfamphi', 'mfbush', 'mfpines'].includes(z) && Math.random() < 0.35) {
    m.glimpsed = true; world.save();
    world.time.delayedCall(2500, () => glimpse(world));
  }
  if (z === 'mfamphi' && m.stage === S.sunrise && !m.cursed) return toTheStage(world);
  if (z === 'mfamphi' && m.stage === S.sunrise && m.cursed && !m.sunNoticed) {
    m.sunNoticed = true; world.save();
    await wait(world, 900);
    await ui.say(T_.sunNotice);
    return ui.toast(T_.sunriseHint);
  }
  if (z === 'mfsunset' && m.stage === S.sunrise && m.cursed) {
    if (!m.sunNoticed) { m.sunNoticed = true; await ui.say(T_.sunNotice.slice(0, 2)); }
    return world.goTo('mfsunview', 'hill', 0);
  }
  if (z === 'mfamphi' && hunting()) {
    const c = crowdPet();
    if (c && !m.crowdOffered) { m.crowdOffered = true; world.time.delayedCall(1200, () => !ui.blocking() && crowdSearch(world, c)); }
  }
}

async function glimpse(world) {
  if (ui.blocking() || world.leaving) return;
  const p = world.player, y = p.y - 30;
  const spark = world.add.image(p.x - 70, y, 'fx-sparkle').setDepth(9600).setScale(2).setTint(0xf0d070);
  world.tweens.add({ targets: spark, x: p.x + 70, duration: 2600, onComplete: () => spark.destroy() });
  await ui.say(T_.glimpse);
}

// ------------------------------------------------------------ talking
// Everyone at the festival: festival chat and festival things only. No
// errands from home, no bake practice, no council advice.
export async function mfTalk(world, npc, opts) {
  if (await mfTalkNpc(world, npc, opts)) return;
  const id = npc.id, info = npc.info, day = state.data.day, f = state.friend(id);
  if (!f.met) { f.met = true; bus.emit('friends:changed'); }
  // Festival goers only play-fight once the pets are here (the Melbourne crew are on holiday).
  const t = stage() >= S.hunt && MF_TRAINERS[id] ? TRAINERS[id] : null;
  if (t && !state.data.beaten[id]) return world.challenge(npc, t, opts);
  await world.chatNpc(npc, opts);
  for (;;) {
    const choices = [];
    const giftable = state.bagItems().filter(i => !ITEMS[i].story && !ITEMS[i].deco);
    if (f.giftedDay !== day && giftable.length) choices.push({ label: 'Give a gift', value: 'gift' });
    if (id === 'paddy') choices.push({ label: 'Ask about the council', value: 'council' });
    if (t) choices.push({ label: 'Play-fight', value: 'fight' });
    if (!choices.length) break;
    const act = await ui.say({ text: 'Anything else?', choices: [...choices, { label: 'Goodbye', value: null }] }, { ...opts, cancelValue: null });
    if (!act) break;
    if (act === 'gift') {
      const choice = await ui.say({
        text: `Give ${info.name} a gift?`,
        choices: [...giftable.map(i => ({ label: ITEMS[i].name, value: i, icon: itemIcon(i, 32), note: `×${state.count(i)}` })), { label: 'Not today', value: null }],
      }, { ...opts, cancelValue: null });
      if (choice) await world.giveFriendGift(npc, choice, opts);
    }
    if (act === 'council') await ui.say(T_.noCouncil, opts);
    if (act === 'fight') { await world.challenge(npc, t, opts); break; }
    world.save();
  }
  world.save();
}

// The festival's own cases. Returns true when the festival handled the chat.
export async function mfTalkNpc(world, npc, opts) {
  const id = npc.id, s = stage(), m = mf();
  if (id === 'mfgate') {
    if (s === S.arrived) { await ui.say(T_.wristband, opts); m.stage = S.wristband; world.save(); ui.toast(T_.campHint); }
    else await ui.say(T_.wristbandAgain, opts);
    return true;
  }
  if (id === 'seb' && world.regionId === 'mftop' && s === S.wristband) { await ui.say(T_.campSeb, opts); return true; }
  if (id === 'gabe' && world.regionId === 'mftop' && s === S.pitched) {
    await ui.say(T_.couchGabe, opts);
    const go = await ui.say({ text: T_.couchAsk, choices: [{ label: T_.couchYes, value: true }, { label: T_.busNo, value: false }] }, { ...opts, cancelValue: false });
    if (!go) return true;
    m.stage = S.carrying; world.save();
    carryCouch(world);
    ui.toast(T_.couchCarry);
    return true;
  }
  if (id === 'charlotte' && s === S.carrying) {
    await ui.say(T_.couchArrive, opts);
    m.stage = S.night;
    state.data.minutes = MF_CLOCK.nightStart;
    for (const z of ['mfamphi', 'mftop']) invalidateMap(z);
    world.save();
    world.goTo('mfamphi', 'couch', 0);
    return true;
  }
  if (id === 'jess' && s === S.night) { await portal(world, opts); return true; }
  // The Helper Hut has spare tent pegs, if somebody needs them.
  if (id === 'mfhelper' && Object.entries(m.scatter).some(([pid, sc]) => sc.want === 'pegs' && pending(pid) && !m.quest[pid]) && !state.count('pegs')) {
    await ui.say(PEOPLE.mfhelper?.pegs || ['Here, take some pegs.'], opts);
    state.addItem('pegs'); sfx.pickup?.();
    ui.toast(`You got: ${ITEMS.pegs.name}`);
    world.save();
    return true;
  }
  // Someone with one of your pets.
  const held = Object.entries(m.scatter).find(([pid, sc]) => sc.by === id && pending(pid));
  if (held) {
    const [pid, sc] = held;
    if (!m.heard.includes(pid)) m.heard.push(pid);
    if (sc.how === 'goer') { await goerBattle(world, npc, pid, opts); return true; }
    if (sc.how === 'dance') { await danceOff(world, npc, pid, opts); return true; }
    if (sc.how === 'eye') { await eyeGame(world, npc, pid, opts); return true; }
    if (sc.how === 'quest') { await questTalk(world, npc, pid, sc, opts); return true; }
  }
  if (id === 'charlotte' && crowdPet()) {
    await ui.say(pick(NPCS.charlotte.lines || [['Water first.']]), opts);
    await crowdSearch(world, crowdPet());
    return true;
  }
  return false;
}

// What people say at the festival, with a rumour about a missing pet. Friends
// from home have festival lines; nobody uses their everyday ones here.
export function mfChatLines(id, info) {
  const pool = T_.friends[id] ? T_.friends[id].map(l => [l]) : MF_NPCS[id] ? info.lines || [] : [];
  let lines = pool.length ? pick(pool) : [pick(T_.festLines)];
  if (hunting()) {
    const left = Object.keys(mf().scatter).filter(pending);
    if (left.length && Math.random() < 0.65) { const pid = pick(left); lines = [...lines, rumour(pid)]; if (!mf().heard.includes(pid)) mf().heard.push(pid); }
    else if (Math.random() < 0.3) lines = [...lines, pick(T_.legend)];
  }
  return lines;
}
const place = sc => T_.placeName[sc.zone] || 'the festival';
function rumour(pid) {
  const sc = mf().scatter[pid];
  return fmt(T_.rumour[sc.how], { pet: petName(pid), place: place(sc), who: whoName(sc.by) });
}

// Pets: the festival's own cases. Returns true when handled.
export async function mfTalkPet(world, pet) {
  const id = pet.id, opts = { name: petName(id), portrait: petPortrait(id) };
  const rec = state.pet(id);
  const sc = mf().scatter[id];
  if (sc && pending(id)) {
    pet.pause(6); pet.facePoint(world.player.x);
    const v = { name: petName(id), who: whoName(sc.by) };
    if (!mf().heard.includes(id)) mf().heard.push(id);
    if (sc.how !== 'wild') { await ui.say(L(T_.heldPet, v), opts); return true; }
    await ui.say(L(T_.wildPet, v), opts);
    if (!readyTeam().length) { await ui.say(T_.eyeWorn, opts); return true; }
    const go = await ui.say({ text: fmt(T_.wildAsk, v), choices: [{ label: 'Let\'s go', value: true }, { label: 'Not now', value: false }] }, { ...opts, cancelValue: false });
    if (!go) return true;
    TRAINERS.mfwild = { name: v.name, team: [['pet:' + id, Math.max(5, rec.level || START_LEVEL[id] || 10)]], money: 0, intro: `${v.name} crackles with purple sparks!` };
    const result = await world.startBattle({ trainer: 'mfwild' });
    if (result.outcome === 'win') { await ui.say(L(T_.wildBack, v), opts); await recover(world, id); }
    else if (result.outcome === 'lose') { await ui.say(L(T_.wildLose, v), opts); await mfLost(world); }
    return true;
  }
  // A pet you have got back, at the campsite: bring them along.
  if (pet.mode === 'home' && rec.found) {
    pet.pause(4);
    const go = await ui.say({ text: fmt(T_.campSwap, { name: petName(id) }), choices: [{ label: T_.campSwapYes, value: true }, { label: 'Just a pat', value: false }] }, { ...opts, cancelValue: false });
    if (!go) return false;
    let party = [...state.data.party];
    if (party.length >= 3) {
      const out = await ui.say({ text: T_.campSwapWho, choices: [...party.map(p => ({ label: petName(p), value: p })), { label: 'Never mind', value: null }] }, { ...opts, cancelValue: null });
      if (!out) return true;
      party = party.filter(p => p !== out);
      ui.toast(fmt(T_.campBack, { name: petName(out) }));
    }
    state.setParty([...party, id]);
    world.syncFollowers();
    world.save();
    world.scene.restart({ region: world.regionId, entry: null });
    return true;
  }
  return false;
}

// ------------------------------------------------------------ live effects
// Textures drawn once: the portal's spiral, a music note, the torch's dark.
function ensureFx(world) {
  const tx = world.textures;
  if (!tx.exists('fx-mfspiral')) {
    const c = tx.createCanvas('fx-mfspiral', 64, 64), g = c.context;
    for (let arm = 0; arm < 3; arm++) for (let i = 0; i < 90; i++) {
      const a = arm * Math.PI * 2 / 3 + i * 0.09, r = i * 0.34;
      g.fillStyle = i % 9 < 5 ? '#c890ff' : '#7a3ae0';
      g.fillRect(Math.round(32 + Math.cos(a) * r), Math.round(32 + Math.sin(a) * r), 2, 2);
    }
    g.fillStyle = '#ffffff'; g.fillRect(30, 30, 4, 4);
    c.refresh();
  }
  if (!tx.exists('fx-mfnote')) {
    const c = tx.createCanvas('fx-mfnote', 8, 10), g = c.context;
    g.fillStyle = '#ffffff';
    g.fillRect(4, 0, 1, 8); g.fillRect(5, 0, 3, 1); g.fillRect(7, 1, 1, 2); g.fillRect(1, 6, 4, 3); g.fillRect(0, 7, 1, 1);
    c.refresh();
  }
  if (!tx.exists('fx-mftorch')) {
    const S2 = 1024, c = tx.createCanvas('fx-mftorch', S2, S2), g = c.context;
    const grad = g.createRadialGradient(S2 / 2, S2 / 2, 26, S2 / 2, S2 / 2, 58);
    grad.addColorStop(0, 'rgba(6,4,12,0)'); grad.addColorStop(1, 'rgba(6,4,12,0.97)');
    g.fillStyle = grad; g.fillRect(0, 0, S2, S2);
    c.refresh();
  }
}

// A sprite of a person standing about in a cutscene (their own art if Seb drew it).
function personSprite(world, id, x, y, dir = 'up') {
  const fest = custom.has(`npc-${id}-meredith`) ? `npc-${id}-meredith` : null;
  const key = fest || (custom.has(`npc-${id}`) ? `npc-${id}` : `npc-${id}-${dir === 'right' ? 'left' : dir}`);
  const spr = world.add.sprite(x, y, world.textures.exists(key) ? key : `npc-${id}-down`, 0).setOrigin(0.5, 1).setDepth(y);
  if (spr.height > 40) spr.setScale(32 / spr.height);
  if (dir === 'right' && !fest && !custom.has(`npc-${id}`)) spr.setFlipX(true);
  return spr;
}
const bop = (world, spr, i = 0) => world.tweens.add({ targets: spr, y: spr.y - 2, duration: 240 + (i % 4) * 45, yoyo: true, repeat: -1, delay: (i * 83) % 400 });

// Music notes float up out of the back of the stage, all night long.
function stageNotes(world) {
  ensureFx(world);
  const cx = 29 * T, top = 30 * T, cols = [0xff7ac0, 0x7ad8ff, 0xffe07a, 0x9aff9a, 0xffffff];
  world.time.addEvent({ delay: nightPhase() ? 260 : 700, loop: true, callback: () => {
    if (mf().cursed && stage() >= S.sunrise) return;
    const x = cx + (Math.random() - 0.5) * 13 * T, n = world.add.image(x, top + Math.random() * 20, 'fx-mfnote').setTint(pick(cols)).setDepth(8700).setAlpha(0.95);
    world.tweens.add({ targets: n, y: n.y - 70 - Math.random() * 60, x: x + (Math.random() - 0.5) * 40, alpha: 0, angle: (Math.random() - 0.5) * 40, duration: 2400 + Math.random() * 1200, ease: 'Sine.easeOut', onComplete: () => n.destroy() });
  } });
}
// The crowd silhouettes bob to the music, each at their own speed.
function bobSilhouettes(world) {
  world.map.objects.filter(o => o.kind === 'mfsil' && o.sprite).forEach((o, i) => {
    world.tweens.add({ targets: o.sprite, y: o.sprite.y - 1 - (i % 3), duration: 220 + ((i * 37) % 9) * 30, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: (i * 97) % 500 });
  });
}
// Charlotte and Gabe sit on the couch at night; the middle seat stays free for you.
function seatCrew(world) {
  if (!nightPhase()) return;
  const couch = world.map.objects.find(o => o.kind === 'mfcouch' && o.v === 'crew');
  if (!couch) return;
  const slots = world.seats.filter(sl => sl.x > couch.x * T && sl.x < (couch.x + couch.w) * T && Math.abs(sl.depth - (couch.y + couch.h) * T) < 2);
  ['charlotte', 'gabe'].forEach((id, i) => {
    const n = world.npcs.find(x => x.id === id && !x.gone), sl = slots[i === 0 ? 0 : 2];
    if (n && sl && !sl.taken) { n.sit(sl); n.sitFor = 1e9; n.idle = null; }
  });
}

// The night's sound: crowd and music all the time after dark (sfx.js).
// Day and night the Amphitheatre plays Seb's tracks; further away they are quieter.
function ambience(world) {
  const z = world.regionId, night = nightPhase(), loud = z === 'mfamphi' || z === 'mfflamingo';
  const list = night ? MF_MUSIC.night : MF_MUSIC.day;
  if (MF_CUTSCENES.includes(z)) sfx.ambience?.(z === 'mfstagefront' ? { crowd: 1, music: 0 } : null);
  else sfx.ambience?.({ crowd: night ? (loud ? 1 : 0.55) : (loud ? 0.5 : 0.25), music: loud ? 1 : 0.35, file: list?.length ? list : null });
  world.events.once('shutdown', () => sfx.ambience?.(null, { soon: true }));
}

// ------------------------------------------------------------ the portal
async function portal(world, opts) {
  const cam = world.cameras.main, m = mf();
  ensureFx(world);
  const po = world.map.objects.find(o => o.kind === 'mfportal');
  const px = po ? (po.x + 0.5) * T : 19.5 * T, py = po ? (po.y + 1) * T - 8 : 32.5 * T;
  await ui.say(T_.portal, opts);
  // The spiral opens: purple, spinning, a flashing light, whomp whomp zap.
  const glow = world.add.image(px, py, 'fx-glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(py + 2).setScale(1.2).setTint(0xa050ff).setAlpha(0);
  const spiral = world.add.image(px, py, 'fx-mfspiral').setDepth(py + 3).setScale(0.05);
  world.tweens.add({ targets: spiral, scale: 0.42, duration: 600, ease: 'Back.easeOut' });
  world.tweens.add({ targets: spiral, angle: 360, duration: 900, repeat: -1 });
  world.tweens.add({ targets: glow, alpha: 0.9, duration: 140, yoyo: true, repeat: -1 });
  sfx.portal?.();
  await wait(world, 900);
  // Toby comes out of it.
  const toby = world.add.sprite(px, py, petTex('toby'), 0).setOrigin(0.5, 1).setDepth(py + 4).setScale(0.1);
  const tH = 16 / toby.height;
  world.tweens.add({ targets: toby, scale: tH, x: px - 18, y: py + 14, duration: 500, ease: 'Quad.easeOut' });
  cam.flash(200, 160, 80, 255);
  await wait(world, 550);
  toby.setDepth(toby.y);
  await ui.say(T_.portalToby, opts);
  state.findPet('toby');
  // Then it goes wrong: every pet you have found, pulled out of home and flung into the sky.
  const flung = state.foundIds().filter(id => !MF_STAY_HOME.includes(id));
  spiral.setTint(0xff4a3a); glow.setTint(0xff2a2a);
  sfx.alarm?.();
  await ui.say(T_.portalWrong.slice(0, 2), opts);
  world.tweens.add({ targets: spiral, scale: 0.7, duration: 800 });
  cam.shake(1400, 0.01);
  for (let i = 0; i < Math.max(3, flung.length); i++) world.time.delayedCall(i * 260, () => {
    sfx.portal?.();
    const id = flung[i];
    if (!id) return;
    const p = world.add.sprite(px, py, petTex(id), 0).setOrigin(0.5, 1).setDepth(9560);
    p.setScale(16 / p.height);
    world.tweens.add({ targets: p, x: px + (i % 2 ? 1 : -1) * (60 + i * 26), y: py - 260 - (i % 3) * 40, angle: 360 * (i % 2 ? 1 : -1), duration: 1300, ease: 'Quad.easeOut', onComplete: () => p.destroy() });
  });
  await ui.say(T_.portalWrong.slice(2, 3), opts);
  await ui.say(L(T_.portalWrong.slice(3, 5), { pet: flung.length ? petName(flung[0]) : 'Toby' }), opts);
  cam.flash(500, 255, 255, 255); sfx.encounter?.();
  await ui.say(T_.portalWrong.slice(5), opts);
  // Every pet you have found (but Spooky, Emilio and Toby) is out there somewhere now.
  const spare = [...MF_SPARE];
  let k = 0;
  m.scatter = {}; m.got = []; m.heard = []; m.quest = {};
  for (const id of flung) {
    const sc = MF_SCATTER[id] ? { ...MF_SCATTER[id] } : { ...spare[k % spare.length] };
    if (!MF_SCATTER[id] && sc.at) sc.at = [sc.at[0] + Math.floor(k / spare.length) * 3, sc.at[1]];
    if (!MF_SCATTER[id]) k++;
    m.scatter[id] = sc;
    state.pet(id).hp = null;
  }
  // Princess is pulled through too. Nobody finds her till dawn.
  m.lostPrincess = state.isFound('princess');
  // Toby, tuned to the portal now.
  const levels = state.foundIds().filter(id => id !== 'toby').map(id => state.pet(id).level || START_LEVEL[id] || 5);
  const avg = levels.length ? Math.round(levels.reduce((a, b) => a + b, 0) / levels.length) : 10;
  const tr = state.pet('toby');
  tr.level = Math.max(tr.level || 0, Math.max(5, Math.min(40, avg - 2))); tr.hp = null;
  state.setParty(['toby']);
  m.stage = S.hunt;
  spiral.destroy(); glow.destroy();
  if (m.lostPrincess) await ui.say(T_.princessPulled);
  await ui.say(T_.portalAfter, opts);
  ui.banner('New Petdex entry!', 'Toby');
  await ui.say([T_.tobyJoins]);
  toby.destroy();
  invalidateMap('mftop');
  world.save();
  world.goTo('mftop', 'camp', 0);
}

// ------------------------------------------------------------ getting pets back
export async function recover(world, id) {
  const m = mf();
  if (!m.got.includes(id)) m.got.push(id);
  const rec = state.pet(id);
  rec.hp = null;
  sfx.found?.();
  const pet = world.pets.find(p => p.id === id && p.mode !== 'follow');
  if (state.data.party.length < 3) {
    state.setParty([...state.data.party, id]);
    if (pet) world.joinTeam(pet);
    world.syncFollowers();
    ui.banner(petName(id), fmt(T_.petBack, { name: petName(id) }));
  } else {
    if (pet) { world.pets.splice(world.pets.indexOf(pet), 1); world.tweens.add({ targets: pet, alpha: 0, duration: 400, onComplete: () => pet.destroy() }); }
    ui.toast(fmt(T_.campFull, { name: petName(id) }));
  }
  world.mfRefresh?.();
  world.save();
  const left = Object.keys(m.scatter).filter(p => !m.got.includes(p));
  if (left.length) return ui.toast(fmt(T_.huntHint, { n: left.length }));
  await ui.say(T_.allBack, { name: 'Jess', portrait: npcIcon('jess') });
  await ui.say(T_.mamaCall, { name: 'Nathan', portrait: npcIcon('nathan') });
  m.stage = S.sunrise; m.show = 'mamaking'; world.save();
  world.mfRefresh?.();
  if (world.regionId === 'mfamphi') return toTheStage(world);
  ui.toast(T_.mamaHint);
}

// Quests: someone wants an item before they hand a pet back (and some still battle you after).
async function questTalk(world, npc, pid, sc, opts) {
  const m = mf(), Q = PEOPLE[npc.id]?.quest || {}, item = sc.want, asked = `ask:${pid}`;
  const v = { who: whoName(npc.id), item: ITEMS[item]?.name || item, pet: petName(pid) };
  if (!m.quest[pid]) {
    if (!state.count(item)) {
      await ui.say(m.heard.includes(asked) ? Q.waiting : Q.ask, opts);
      if (!m.heard.includes(asked)) m.heard.push(asked);
      return world.save();
    }
    if (!m.heard.includes(asked)) { await ui.say(Q.ask, opts); m.heard.push(asked); }
    const go = await ui.say({ text: fmt(T_.questHave, v), choices: [{ label: T_.questGive, value: true }, { label: T_.questKeep, value: false }] }, { ...opts, cancelValue: false });
    if (!go) return;
    state.removeItem(item);
    m.quest[pid] = true;
    world.save();
    await ui.say(Q.give, opts);
  }
  if (sc.fight) return goerBattle(world, npc, pid, opts);
  return recover(world, pid);
}

async function goerBattle(world, npc, pid, opts) {
  const t = TRAINERS[npc.id];
  await ui.say(t.challenge, opts);
  if (!readyTeam().length) return ui.say(T_.eyeWorn, opts);
  const go = await ui.say({ text: t.ask, choices: [{ label: t.yes, value: true }, { label: t.no, value: false }] }, { ...opts, cancelValue: false });
  if (!go) return;
  const result = await world.startBattle({ trainer: npc.id });
  if (result.outcome === 'win') {
    const first = state.data.beaten[npc.id] !== state.data.day;
    state.data.beaten[npc.id] = state.data.day;
    await ui.say(t.win, opts);
    if (first && t.money) { const cash = Math.round(t.money * TUNING.money.allMoney); state.addMoney(cash); await ui.say(`${t.name} hands over $${cash}. Fair's fair.`, opts); }
    await recover(world, pid);
  } else if (result.outcome === 'lose') { await ui.say(t.lose, opts); await mfLost(world); }
}

export async function mfLost(world) {
  await ui.say(T_.lost);
  state.healAll();
  const party = [];
  for (const id of ['toby', ...mf().got]) if (party.length < 3 && state.isFound(id)) party.push(id);
  state.setParty(party);
  world.goTo('mftop', 'camp', 0);
}

// ------------------------------------------------------------ the Meredith Eye
// Spin the Eye: it stops on a seat with a present, a seat with a problem (a
// play-fight), or, sooner or later, Stanley's seat. Keep spinning till then.
async function eyeGame(world, npc, pid, opts) {
  const m = mf(), E = PEOPLE.mfeyeguy?.eye || {};
  await ui.say(E.intro, opts);
  let ask = E.ask;
  for (;;) {
    const go = await ui.say({ text: ask, choices: [{ label: E.yes, value: true }, { label: E.no, value: false }] }, { ...opts, cancelValue: false });
    if (!go) return;
    ask = E.again;
    m.eyeSpins = (m.eyeSpins || 0) + 1;
    const n = m.eyeSpins;
    const outcome = n >= 4 || (n > 1 && Math.random() < 0.1 + n * 0.12) ? 'stanley' : n === 1 || Math.random() < 0.5 ? 'reward' : 'challenge';
    const seat = await spinEye(world, outcome === 'stanley' ? 7 : 1 + Math.floor(Math.random() * 12));
    if (seat === null) return;
    const v = { n: seat };
    if (outcome === 'stanley') {
      await ui.say(L(E.stanley, v), opts);
      await recover(world, pid);
      await ui.say(E.after, opts);
      return;
    }
    if (outcome === 'reward') {
      await ui.say([fmt(E.reward, v)], opts);
      if (Math.random() < 0.4) { const cash = 5 + Math.floor(Math.random() * 3) * 5; state.addMoney(cash); await ui.say([fmt(T_.eyeRewardCash, { cash })], opts); }
      else { const it = pick(['icypole', 'hotchips', 'festsocks', 'electrolytes', 'sunscreen']); state.addItem(it); sfx.pickup?.(); await ui.say([`You got: ${ITEMS[it].name}.`], opts); }
      world.save();
      continue;
    }
    await ui.say([fmt(E.challenge, v)], opts);
    if (!readyTeam().length) { await ui.say(T_.eyeWorn, opts); return; }
    const night = nightPhase(), pool = MF_ENCOUNTERS.filter(e => !(e.day && night));
    const foe = pick(pool), lv = Math.max(5, Math.round((state.pet(state.data.party[0])?.level || 10) - 1));
    await ui.say([fmt(pick(T_.eyeFoes), { f: ENEMIES[foe.id]?.name || foe.id })], opts);
    TRAINERS.mfwild = { name: 'The Meredith Eye', team: [[foe.id, lv]], money: 0, intro: 'Something climbs out of the gondola!' };
    const result = await world.startBattle({ trainer: 'mfwild' });
    if (result.outcome === 'lose') return mfLost(world);
    if (result.outcome !== 'win') return;
  }
}

// The Eye goes round: a light runs round the gondolas, slows and stops on `seat` (1 to 12).
function spinEye(world, seat) {
  const eye = world.map.objects.find(o => o.kind === 'mfeye');
  return new Promise(resolve => {
    const cx = eye ? eye.x * T + 48 : 3 * T + 48, cy = eye ? (eye.y + eye.h) * T - 156 + 58 : 14 * T - 98, R = 40;
    const light = world.add.image(cx, cy, 'fx-glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9550).setScale(0.6).setTint(0xfff0a0);
    const status = h('p', { role: 'status', 'aria-live': 'polite' });
    const bar = h('section', { class: 'hall-event-bar', 'aria-label': 'The Meredith Eye' }, h('b', {}, 'The Meredith Eye'), status);
    document.body.append(bar); document.body.classList.add('hall-event');
    world.onResize(); controls.release();
    const hd = { walk: false, action: () => {}, cancel: () => {} };
    ui.activity = hd;
    const steps = 36 + (seat - 1);   // three times round, then the seat
    let i = 0, ended = false;
    const end = val => {
      if (ended) return; ended = true;
      bar.remove(); document.body.classList.remove('hall-event');
      if (ui.activity === hd) ui.activity = null;
      controls.release(); if (world.cameras?.main) world.onResize();
      world.time.delayedCall(600, () => light.destroy());
      resolve(val);
    };
    const step = () => {
      if (ended) return;
      const k = i % 12, a = k * Math.PI / 6 + 0.26 - Math.PI / 2;
      light.setPosition(cx + Math.cos(a) * R, cy + Math.sin(a) * R + 6);
      status.textContent = fmt(T_.eyeBar, { n: k + 1 });
      sfx.blip?.();
      if (i >= steps) { sfx.ding?.(); return end(seat); }
      i++;
      const left = steps - i;
      world.time.delayedCall(left < 14 ? 60 + (14 - left) * 28 : 55, step);
    };
    world.events.once('shutdown', () => end(null));
    step();
  });
}

// ------------------------------------------------------------ night traffic
// At night the roads fill with people heading to and from the stage: black
// silhouettes walking edge to edge, both ways, like cars in the city. Scenery
// only (no collisions), and gone once the Ice Kids' curse scatters everyone.
// Routes between the zone's edge entries, keeping to the dirt roads where it
// can (a cheap Dijkstra: road tiles cost 1, grass 4, anything solid is out).
function nightRoutes(map) {
  const { w, h: mh, ground, solid } = map;
  const ends = Object.values(map.entries || {}).filter(e => Number.isFinite(e.x) && (e.x < 4 || e.y < 4 || e.x > w - 5 || e.y > mh - 5));
  const route = (a, b) => {
    const dist = new Float64Array(w * mh).fill(Infinity), prev = new Int32Array(w * mh).fill(-1), done = new Uint8Array(w * mh);
    const s0 = a.y * w + a.x, goal = b.y * w + b.x;
    dist[s0] = 0;
    const open = [s0];
    while (open.length) {
      let bi = 0;
      for (let i = 1; i < open.length; i++) if (dist[open[i]] < dist[open[bi]]) bi = i;
      const c = open.splice(bi, 1)[0];
      if (done[c]) continue;
      done[c] = 1;
      if (c === goal) break;
      const cx = c % w, cy = (c - cx) / w;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const x = cx + dx, y = cy + dy, n = y * w + x;
        if (x < 0 || y < 0 || x >= w || y >= mh || done[n] || solid[n]) continue;
        const d = dist[c] + (ground[y][x] === '=' ? 1 : 4);
        if (d < dist[n]) { dist[n] = d; prev[n] = c; open.push(n); }
      }
    }
    if (prev[goal] < 0) return null;
    const path = [];
    for (let c = goal; c >= 0; c = prev[c]) path.push([c % w, Math.floor(c / w)]);
    return path.reverse();
  };
  const out = [];
  for (let i = 0; i < ends.length; i++) for (let j = i + 1; j < ends.length; j++) {
    const r = route(ends[i], ends[j]);
    if (r && r.length > 12) out.push(r);
  }
  return out.slice(0, 6);
}

function nightStreams(world) {
  if (!nightPhase() || mf().cursed || world.mfStreams || world.region?.cutscene) return;
  const routes = world.map.mfRoutes ||= nightRoutes(world.map);
  if (!routes.length) return;
  world.mfStreams = true;
  world.events.once('shutdown', () => { world.mfStreams = false; });   // the scene is reused zone to zone
  let n = 0;
  const walk = (p, pts, i, speed) => {
    if (!p.active) return;
    if (i >= pts.length) return world.tweens.add({ targets: p, alpha: 0, duration: 400, onComplete: () => p.destroy() });
    const [x, y] = pts[i], dx = x - p.x, dy = y - p.y;
    const dir = Math.abs(dx) > Math.abs(dy) ? 'left' : dy < 0 ? 'up' : 'down';
    if (dir !== p.dir) {
      p.dir = dir;
      if (world.anims.exists(`npc-${p.festId}-${dir}-walk`)) p.play(`npc-${p.festId}-${dir}-walk`);
      else p.setTexture(`npc-${p.festId}-${dir}`, 0);
    }
    if (dir === 'left') p.setFlipX(dx > 0);
    world.tweens.add({ targets: p, x, y, duration: Math.max(1, Math.hypot(dx, dy)) / speed * 1000,
      onUpdate: () => p.setDepth(p.y), onComplete: () => walk(p, pts, i + 1, speed) });
  };
  world.time.addEvent({ delay: 900, loop: true, callback: () => {
    if (!nightPhase() || mf().cursed) return;
    const r = routes[n % routes.length], back = Math.floor(n / routes.length) % 2 === 1;
    const c = FEST_CROWD[(n * 5) % FEST_CROWD.length];
    n++;
    if (Math.random() < 0.3) return;
    const ox = (Math.random() - 0.5) * 10, oy = (Math.random() - 0.5) * 8;
    const pts = (back ? [...r].reverse() : r).map(([x, y]) => [(x + 0.5) * T + ox, (y + 0.75) * T + oy]);
    const p = world.add.sprite(pts[0][0], pts[0][1], `npc-${c.id}-down`, 0).setOrigin(0.5, 1).setDepth(pts[0][1]).setTintFill(0x0c0a12).setAlpha(0);
    p.festId = c.id; p.isMfWalker = true;
    world.tweens.add({ targets: p, alpha: 0.92, duration: 500 });
    walk(p, pts, 1, 22 + Math.random() * 10);
  } });
}

// ------------------------------------------------------------ the big sets (in front of the stage)
// Off to the front of the stage (a cutscene zone) for Mama King, then the Ice Kids.
async function toTheStage(world) {
  if (world.leaving || world.showBusy) return;
  const m = mf();
  if (!m.show) m.show = m.mamaDone ? 'icekids' : 'mamaking';
  await wait(world, 700);
  if (world.leaving) return;
  world.goTo('mfstagefront', 'crowd', 0);
}

// Hold the controls for a scene (dialogue still works); call the result to give them back.
function hold() {
  const hd = { walk: false, action: () => {}, cancel: () => {} };
  ui.activity = hd;
  return () => { if (ui.activity === hd) ui.activity = null; controls.release(); };
}

// The crew around you in front of the stage (tile x, y), all facing the stage.
const STAGE_CREW = [['nathan', 13.2, 13.9], ['jordan', 11.9, 14.5], ['charlotte', 10.6, 13.9], ['gabe', 9.3, 14.5], ['seb', 15.8, 13.9], ['jess', 17.1, 14.5], ['mem', 18.4, 13.9], ['corni', 19.7, 14.5], ['rose', 8, 13.9]];

async function stageShow(world) {
  if (world.showBusy) return;
  const m = mf();
  if (stage() !== S.sunrise || m.cursed) return world.goTo('mfamphi', 'couch', 0);
  world.showBusy = true;
  ensureFx(world);
  const cam = world.cameras.main;
  cam.stopFollow();
  cam.centerOn(14 * T, 9 * T);
  world.player.setDir?.('up');
  let release = hold();
  const crew = STAGE_CREW.map(([id, x, y]) => personSprite(world, id, x * T, y * T, 'up'));
  if (m.show !== 'icekids') {
    const band = ['mfmama1', 'mfmama2'].map((id, i) => { const s = personSprite(world, id, (12 + i * 4) * T, 8.4 * T, 'down'); s.setDepth(9 * T + 2).setAlpha(0); world.tweens.add({ targets: s, alpha: 1, duration: 800 }); return s; });
    const warm = [0xffb04a, 0xff7ac0, 0xffe07a].map((tint, i) => world.add.image((10 + i * 4) * T, 6 * T, 'fx-glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9550).setScale(3).setTint(tint).setAlpha(0.5));
    warm.forEach((g, i) => world.tweens.add({ targets: g, alpha: 0.9, duration: 500 + i * 120, yoyo: true, repeat: -1 }));
    band.forEach((b, i) => bop(world, b, i));
    crew.forEach((c, i) => bop(world, c, i));
    sfx.ambience?.({ crowd: 1, music: 1.2, file: MF_MUSIC.mamaking || null, style: 'mamaking' });
    await ui.say(T_.mamaKing);
    release();
    const got = await dance(world, { rounds: 10, window: 1.5, anchor: crew[0], title: T_.mamaDance, bar: T_.mamaBar });
    release = hold();
    await ui.say(got >= 7 ? T_.mamaWin : T_.mamaOk);
    await ui.say(T_.mamaBye);
    world.tweens.add({ targets: band, alpha: 0, duration: 800 });
    warm.forEach(g => world.tweens.add({ targets: g, alpha: 0, duration: 600, onComplete: () => g.destroy() }));
    m.mamaDone = true; m.show = 'icekids'; world.save();
    sfx.ambience?.({ crowd: 0.8, music: 0 });
    await wait(world, 1200);
    band.forEach(b => b.destroy());
  }
  await iceKids(world, crew);
  release();
  world.showBusy = false;
  world.goTo('mfamphi', 'couch', 0);
}

// The dance: copy the arrow over the leader's head, in time. Resolves with how many you got.
const ARROWS = { up: '↑', down: '↓', left: '←', right: '→' };
function dance(world, { rounds = 8, window: WINDOW = 1.7, anchor, title, bar: barText, need = 0 }) {
  return new Promise(resolve => {
    let n = 0, got = 0, t = 0, want = null, answered = false, ended = false;
    const sign = world.add.text(anchor.x, anchor.y - (anchor.displayHeight || 32) - 8, '', { fontSize: '16px', fontStyle: 'bold', color: '#f5e66b', stroke: '#1e1a16', strokeThickness: 4 }).setOrigin(0.5, 1).setDepth(9600);
    const status = h('p', { role: 'status', 'aria-live': 'polite' });
    const answer = dir => {
      if (!want || answered || ended) return;
      answered = true;
      const ok = dir === want;
      if (ok) { got++; sfx.select?.(); world.player.perform?.('wave'); world.reactFx?.(anchor, 'jump'); }
      else sfx.bump?.();
      sign.setText(ok ? '✓' : '✗').setColor(ok ? '#7be07b' : '#ff6a5a');
    };
    const pads = h('div', { class: 'hall-cues' }, ...Object.entries(ARROWS).map(([dir, a]) => h('button', { class: 'wood-btn small', onclick: () => answer(dir) }, a)));
    const bar = h('section', { class: 'hall-event-bar', 'aria-label': title }, h('b', {}, title), status, pads,
      h('button', { class: 'wood-btn small hall-leave', onclick: () => finish() }, 'Stop'));
    const offDir = bus.on('input:dir', (dx, dy) => answer(dx > 0 ? 'right' : dx < 0 ? 'left' : dy < 0 ? 'up' : 'down'));
    let lastVec = '';
    const finish = () => {
      if (ended) return; ended = true;
      world.events.off('update', tick); offDir();
      sign.destroy(); bar.remove(); document.body.classList.remove('hall-event');
      ui.activity = null; controls.release(); if (world.cameras?.main) world.onResize();
      resolve(got);
    };
    const next = () => {
      if (n >= rounds) return finish();
      n++; t = 0; answered = false;
      want = pick(Object.keys(ARROWS));
      sign.setText(ARROWS[want]).setColor('#f5e66b');
      if (anchor.setDir) anchor.setDir(want);
      else anchor.setFlipX?.(want === 'right');
    };
    const tick = (_t, delta) => {
      if (ended || document.hidden) return;
      // Joystick swipes count too (touch screens send no arrow keys).
      const vec = controls.vector(), dir = Math.abs(vec.x) > 0.5 ? (vec.x > 0 ? 'right' : 'left') : Math.abs(vec.y) > 0.5 ? (vec.y > 0 ? 'down' : 'up') : '';
      if (dir && dir !== lastVec) answer(dir);
      lastVec = dir;
      t += delta / 1000;
      if (t > WINDOW) next();
      status.textContent = fmt(barText, { n, got, need });
    };
    document.body.append(bar); document.body.classList.add('hall-event');
    world.onResize(); controls.release();
    ui.activity = { walk: false, action: () => {}, cancel: () => finish() };
    world.events.on('update', tick);
    world.events.once('shutdown', finish);
    next();
  });
}

export async function danceOff(world, npc, pid, opts) {
  const v = { pet: petName(pid) };
  await ui.say(L(T_.danceIntro, v), opts);
  const go = await ui.say({ text: T_.danceAsk, choices: [{ label: T_.danceYes, value: true }, { label: T_.danceNo, value: false }] }, { ...opts, cancelValue: false });
  if (!go) return;
  const NEED = 6;
  const got = await dance(world, { rounds: 8, window: 1.7, anchor: npc, title: 'Dance off', bar: T_.danceBar, need: NEED });
  if (got >= NEED) { await ui.say(L(T_.danceWin, v), opts); await recover(world, pid); }
  else await ui.say(L(T_.danceLose, v), opts);
}

// Strobes, lasers and blue lightning; then the Dickheads pour off the stage.
async function iceKids(world, crew = []) {
  const cam = world.cameras.main, m = mf(), sx = 14 * T, sy = 6 * T;
  sfx.ambience?.({ crowd: 0.6, music: 1.2, file: MF_MUSIC.icekids || null, style: 'icekids' });
  await ui.say(T_.iceKids.slice(0, 2));
  // The strobe and the lasers.
  const view = cam.worldView;
  const strobe = world.add.rectangle(view.centerX, view.centerY, view.width * 2, view.height * 2, 0xffffff).setDepth(9540).setAlpha(0).setBlendMode(Phaser.BlendModes.ADD);
  const lasers = world.add.graphics().setDepth(9545).setBlendMode(Phaser.BlendModes.ADD);
  let lt = 0, flick = 0;
  const fx = (_t, delta) => {
    lt += delta / 1000; flick += delta;
    if (flick > 90) { flick = 0; strobe.setAlpha(strobe.alpha > 0 ? 0 : 0.35); }
    lasers.clear();
    for (let i = 0; i < 7; i++) {
      const a = Math.PI / 2 + Math.sin(lt * 1.3 + i * 0.9) * 0.9;
      lasers.lineStyle(2, [0x5aff6a, 0xff3a5a, 0x7ad8ff][i % 3], 0.75);
      lasers.lineBetween(sx + (i - 3) * 22, sy - 10, sx + (i - 3) * 22 + Math.cos(a) * 400, sy - 10 + Math.sin(a) * 400);
    }
  };
  world.events.on('update', fx);
  crew.forEach(c => world.tweens.killTweensOf(c));
  // The band walks on in a cold blue light.
  const band = ['mficesinger', 'mficeguitar'].map((id, i) => { const s = personSprite(world, id, (12 + i * 4) * T, 8.4 * T, 'down'); s.setDepth(9 * T + 2).setAlpha(0); world.tweens.add({ targets: s, alpha: 1, duration: 900 }); return s; });
  const glow = world.add.image(sx, sy + 20, 'fx-glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9550).setScale(6).setTint(0x7ad8ff).setAlpha(0);
  world.tweens.add({ targets: glow, alpha: 0.8, duration: 900, yoyo: true, repeat: -1 });
  await ui.say(T_.iceKids.slice(2));
  // Let their song play a while before the curse (Seb: 40 seconds at least).
  if (MF_MUSIC.icekids) { const left = (MF_MUSIC.curseAfter || 0) - (sfx.musicTime?.() || 0); if (left > 0 && state.data.settings.sound) await wait(world, left * 1000); }
  await ui.say(T_.iceCurse.slice(0, 1));
  // Blue lightning: jagged bolts out of the stage, over and over.
  const bolts = world.add.graphics().setDepth(9560).setBlendMode(Phaser.BlendModes.ADD);
  const zap = () => {
    bolts.clear();
    for (let b = 0; b < 3; b++) {
      const x = sx + (Math.random() - 0.5) * 160, y = sy - 20;
      const tx = x + (Math.random() - 0.5) * 260, ty = sy + 60 + Math.random() * 140;
      const pts = [{ x, y }];
      for (let k = 1; k <= 8; k++) pts.push({ x: x + (tx - x) * k / 8 + (Math.random() - 0.5) * 26, y: y + (ty - y) * k / 8 });
      bolts.lineStyle(5, 0x3a8aff, 0.55); bolts.strokePoints(pts);
      bolts.lineStyle(2, 0xe8f6ff, 1); bolts.strokePoints(pts);
    }
    sfx.zap?.();
    cam.flash(80, 120, 180, 255);
    world.time.delayedCall(110, () => bolts.active && bolts.clear());
  };
  const storm = world.time.addEvent({ delay: 420, loop: true, callback: zap });
  zap();
  await ui.say(T_.iceCurse.slice(1, 2));
  cam.shake(1800, 0.012); sfx.encounter?.();
  // The Dickheads pour out of the stage and down through the crowd.
  const pour = world.time.addEvent({ delay: 90, repeat: 44, callback: () => {
    const id = pick(['mfdick1', 'mfdick2', 'mfdick3']), x = sx + (Math.random() - 0.5) * 12 * T;
    const d = world.add.sprite(x, 9 * T, `npc-${id}-down`, 0).setOrigin(0.5, 1).setDepth(9 * T + 3).setScale(0.6).setAlpha(0);
    if (world.anims.exists(`npc-${id}-down-walk`)) d.play(`npc-${id}-down-walk`);
    world.tweens.add({ targets: d, alpha: 1, scale: 1, duration: 260 });
    world.tweens.add({ targets: d, x: x + (Math.random() - 0.5) * 360, y: 22 * T + Math.random() * 40, duration: 1800 + Math.random() * 900, onUpdate: () => d.setDepth(d.y), onComplete: () => d.destroy() });
  } });
  await wait(world, 1200);
  await ui.say(T_.iceCurse.slice(2));
  pour.remove(); storm.remove();
  cam.flash(600, 30, 0, 50);
  m.cursed = true; m.show = null;
  invalidateMap('mfamphi');   // the silhouette crowd has gone too
  state.data.minutes = Math.max(state.data.minutes, 29 * 60);   // the set ran very late
  ui.updateHud(world.regionId);
  world.save();
  world.events.off('update', fx);
  strobe.destroy(); lasers.destroy(); bolts.destroy(); glow.destroy();
  world.tweens.add({ targets: band, alpha: 0, duration: 900, onComplete: () => band.forEach(b => b.destroy()) });
  sfx.ambience?.(null);
  await ui.say(T_.iceAfter);
}

// ------------------------------------------------------------ finding a friend in the crowd
// It is pitch black in the crowd. Charlotte lends you a torch: the people near
// it light up, and the friend you are after only shows up in its light.
const crowdPet = () => Object.entries(mf().scatter).find(([pid, sc]) => sc.how === 'crowd' && pending(pid))?.[0] || null;

export async function crowdSearch(world, pid) {
  if (world.regionId !== 'mfamphi' || !nightPhase() || ui.activity) return;
  const sc = mf().scatter[pid], v = { pet: petName(pid), who: whoName(sc.by) };
  await ui.say(L(T_.crowdStart, v), { name: 'Charlotte', portrait: npcIcon('charlotte') });
  ensureFx(world);
  const m = world.map, open = [];
  for (let y = 11; y < 33; y++) for (let x = 6; x < 50; x++) if (!m.solid[y * m.w + x] && m.ground[y][x] !== '=') open.push([x, y]);
  if (!open.length) return;
  const far = () => { const c = open.filter(([x, y]) => Math.hypot((x + 0.5) * T - world.player.x, (y + 0.5) * T - world.player.y) > 120); return pick(c.length ? c : open); };
  return new Promise(resolve => {
    let move = 25, ended = false, friend = null;
    const LIT = 42, INK = 0x0c0a12;
    // The dark, with a hole for your torch.
    const dark = world.add.image(world.player.x, world.player.y - 12, 'fx-mftorch').setDepth(9450);
    // A packed crowd, all in silhouette, swaying.
    const crowd = [];
    for (let i = 0; i < 46; i++) {
      const [x, y] = pick(open), c = FEST_CROWD[(i * 7) % FEST_CROWD.length];
      const p = world.add.sprite((x + Math.random()) * T, (y + 0.75) * T, `npc-${c.id}-${['down', 'up', 'left'][i % 3]}`, 0).setOrigin(0.5, 1).setTintFill(INK);
      p.setDepth(p.y);
      bop(world, p, i);
      crowd.push(p);
    }
    const placeFriend = () => {
      friend?.destroy();
      const [x, y] = far();
      friend = world.spawnNpc({ id: sc.by, x, y, face: 'down', still: true });
      friend.setDepth(friend.y).setTintFill(INK); friend.lit = false;
    };
    const status = h('p', { role: 'status', 'aria-live': 'polite' }, fmt(T_.crowdBar, v));
    const bar = h('section', { class: 'hall-event-bar', 'aria-label': 'Find your friend in the dark' },
      h('b', {}, `Find ${v.who}`), status, h('button', { class: 'wood-btn small hall-leave', onclick: () => finish(false) }, 'Give up'));
    const finish = async found => {
      if (ended) return; ended = true;
      world.events.off('update', tick);
      bar.remove(); document.body.classList.remove('hall-event');
      ui.activity = null; controls.release(); if (world.cameras?.main) world.onResize();
      if (dark.active) world.tweens.add({ targets: dark, alpha: 0, duration: 500, onComplete: () => dark.destroy() });
      crowd.forEach(p => p.active && world.tweens.add({ targets: p, alpha: 0, duration: 500, onComplete: () => p.destroy() }));
      const fopts = { name: v.who, portrait: npcIcon(sc.by) };
      if (found) {
        friend.clearTint?.();
        friend.setVelocity?.(0, 0);
        const glow = world.add.image(friend.x, friend.y - 14, 'fx-glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9460).setScale(2).setTint(0xfff0b0).setAlpha(0.8);
        world.heartsFx?.(friend, 6);
        await ui.say(L(T_.crowdFound, v), fopts);
        glow.destroy();
        friend.destroy();
        mf().crowdOffered = false;
        await recover(world, pid);
      } else {
        if (friend?.active) world.tweens.add({ targets: friend, alpha: 0, duration: 400, onComplete: () => friend.destroy() });
        mf().crowdOffered = false;
        if (world.player?.active) await ui.say([fmt(T_.crowdMissed, v)]);
      }
      resolve(found);
    };
    const tick = (_t, delta) => {
      if (ended || document.hidden) return;
      const dt = delta / 1000, px = world.player.x, py = world.player.y - 12;
      dark.setPosition(px, py);
      move -= dt;
      if (move <= 0) { move = 25; placeFriend(); ui.toast(fmt(T_.crowdMoved, v)); }
      // Only the people in the torchlight show who they are.
      for (const p of crowd) { const lit = Math.hypot(p.x - px, p.y - 12 - py) < LIT; if (lit !== p.lit) { p.lit = lit; if (lit) p.clearTint(); else p.setTintFill(INK); } }
      const d = Math.hypot(friend.x - px, friend.y - 12 - py);
      if ((d < LIT) !== friend.lit) { friend.lit = d < LIT; if (friend.lit) friend.clearTint(); else friend.setTintFill(INK); }
      if (d < 22) finish(true);
    };
    placeFriend();
    document.body.append(bar); document.body.classList.add('hall-event');
    world.onResize(); controls.release();
    ui.activity = { walk: true, action: () => {}, cancel: () => finish(false) };
    world.events.on('update', tick);
    world.events.once('shutdown', () => finish(false));
    tick(0, 0);
  });
}

// ------------------------------------------------------------ the sunrise that is not the sun
// The crew in a row on the hill at the Sunset Strip, backs to us (tile x).
const SUN_CREW = [['jess', 4], ['seb', 5.8], ['gabe', 7.6], ['charlotte', 9.4], ['mem', 20.6], ['corni', 22.4], ['rose', 24.2], ['nathan', 26]];

async function sunrise(world) {
  if (world.sunriseBusy || stage() !== S.sunrise || !mf().cursed) return;
  world.sunriseBusy = true;
  const d = state.data, cam = world.cameras.main, m = mf();
  const release = hold();
  cam.stopFollow();
  cam.centerOn(15 * T, 8 * T);
  world.player.setDir?.('up');
  SUN_CREW.forEach(([id, x]) => personSprite(world, id, x * T, 15.75 * T, 'up'));
  await ui.say(T_.sunrise.slice(0, 3));
  const key = world.textures.exists('pet-princess-evolved') ? 'pet-princess-evolved' : 'pet-princess';
  const x = 15 * T, y0 = 14 * T, y1 = 6 * T;
  const glow = world.add.image(x, y0, 'fx-glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9550).setScale(5).setTint(0xff8a2a).setAlpha(0.9);
  const queen = world.add.sprite(x, y0, key, 0).setOrigin(0.5, 0.5).setDepth(9560);
  queen.setDisplaySize(96 * queen.width / queen.height, 96);
  world.tweens.add({ targets: [queen, glow], y: y1, duration: 3200, ease: 'Sine.easeOut' });
  world.tweens.add({ targets: glow, scale: 7, alpha: 1, duration: 1600, yoyo: true, repeat: -1 });
  await wait(world, 3300);
  cam.flash(600, 255, 180, 80);
  await ui.say(T_.sunrise.slice(3));
  if (m.lostPrincess) {
    // She floats down into Helen's arms: found, and evolved if she was not already.
    const me = world.player;
    world.tweens.add({ targets: queen, x: me.x, y: me.y - 24, displayHeight: 24, displayWidth: 24 * queen.width / queen.height, duration: 1600, ease: 'Sine.easeInOut' });
    world.tweens.add({ targets: glow, x: me.x, y: me.y - 24, scale: 2, duration: 1600 });
    await wait(world, 1700);
    await ui.say(T_.princessLands);
    const was = isEvolved('princess');
    evolve('princess');
    if (!was) await ui.say(T_.princessEvolved);
    m.lostPrincess = false;
    if (!m.got.includes('princess')) m.got.push('princess');
    state.setParty(['princess', ...d.party.filter(id => id !== 'princess')].slice(0, 3));
    world.syncFollowers();
    ui.toast(T_.princessTeam);
  }
  await ui.say(T_.goodnight);
  await ui.card({ kicker: 'Meredith, part 1', title: 'To be continued', lines: T_.sunriseCard, button: 'Keep playing' });
  queen.destroy(); glow.destroy();
  const news = state.newDay();
  m.stage = S.done;
  d.minutes = 12 * 60;
  world.save();
  release();
  if (news?.length) await ui.say(news);
  world.sunriseBusy = false;
  // You wake up in your tent at Top Camp.
  for (const z of ['mftop', 'mfamphi']) invalidateMap(z);
  world.goTo('mftop', 'camp', 0);
}

// ------------------------------------------------------------ ways out
export function mfExitBlock(world, ex) {
  const s = stage();
  if (world.regionId === 'mfreception' && s === S.arrived && ex.to) return T_.needWristband;
  return null;
}

// The couch rides along on your head down to the Amphitheatre.
export function carryCouch(world) {
  if (stage() !== S.carrying) return;
  const img = world.add.image(world.player.x, world.player.y - 28, 'fx-sparkle').setVisible(false);
  try {
    const key = 'obj-mfcouch-crew';
    if (world.textures.exists(key)) img.setTexture(key).setScale(0.35).setVisible(true);
  } catch (e) { /* no couch art: nothing on your head */ }
  const tick = () => { if (!img.active || stage() !== S.carrying) { img.destroy(); world.events.off('update', tick); return; } img.setPosition(world.player.x, world.player.y - 26).setDepth(world.player.y + 1); };
  world.events.on('update', tick);
  world.events.once('shutdown', () => { world.events.off('update', tick); });
}

// What the To Do list says while the festival is on: the next step...
export function mfObjective() {
  const s = stage(), m = mf();
  if (!s || s >= S.home) return null;
  const left = Object.keys(m.scatter).filter(p => !m.got.includes(p)).length;
  const text = {
    [S.invited]: 'Catch the charter bus on Allen St to Meredith (talk to the driver)',
    [S.arrived]: T_.wristbandHint, [S.wristband]: `${T_.campHint} Pitch your tent.`, [S.pitched]: T_.couchHint,
    [S.carrying]: T_.couchCarry, [S.night]: T_.portalHint, [S.hunt]: fmt(T_.huntHint, { n: left }),
    [S.sunrise]: m.cursed ? T_.sunriseHint : m.mamaDone ? T_.iceHint : T_.mamaHint, [S.done]: 'Take the charter bus home from Reception',
  }[s];
  return { text, done: false };
}
// ...and during the hunt, a line for every pet still out there (specific once someone has told you).
export function mfQuests() {
  const m = mf();
  if (stage() !== S.hunt) return [];
  const out = Object.entries(m.scatter).map(([pid, sc]) => {
    const v = { pet: petName(pid), who: whoName(sc.by), place: place(sc), item: ITEMS[sc.want]?.name || '' };
    return { text: m.heard.includes(pid) ? fmt(T_.todo[sc.how], v) : fmt(T_.todoUnknown, v), done: m.got.includes(pid) };
  });
  if (m.lostPrincess) out.push({ text: T_.todoPrincess, done: false });
  return out;
}
