// The Meredith Music Festival, part 1: night one. The rules and story beats
// (words, people and places are in data/meredith.js).
//
//   1 invited   the day after the party, Jess's charter bus waits on Allen St
//   2 arrived   off the bus at Reception: get a wristband
//   3 wristband find the crew at Top Camp, pitch your tent
//   4 pitched   carry the couch down to Charlotte at the Amphitheatre
//   5 carrying  ...which turns the day into night
//   6 night     Jess's pet portal demo at the campsite goes wrong
//   7 hunt      find the scattered pets (wild play-fights, festival goers, the crowd, a dance off)
//   8 sunrise   everyone is back: the Ice Kids' set curses the festival (m.cursed),
//               then the sunrise at the Sunset Strip
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
import { form, isEvolved, evolve } from './forms.js';
import { PETS } from '../data/pets.js';
import { NPCS } from '../data/npcs.js';
import { TRAINERS } from '../data/enemies.js';
import { ITEMS } from '../data/items.js';
import { invalidateMap } from '../data/regions.js';
import { FEST_CROWD } from '../data/crowd.js';
import { TILE as T } from '../config.js';
import { TUNING } from '../data/tuning.js';
import { npcIcon, petPortrait } from '../ui/images.js';
import { MF_TEXT, MF_STAGE as S, MF_SCATTER, MF_SPARE, MF_STAY_HOME, MF_CLOCK, MF_TRAINERS, isMeredith, freshMeredith } from '../data/meredith.js';
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

// Which pets show up in this festival zone, and how.
export function mfPets(world) {
  const out = [], z = world.regionId, d = mf();
  let camp = 0;
  for (const p of PETS) {
    const rec = state.pet(p.id), here = (x, y, extra) => ({ ...p, zone: z, home: [x, y], range: 1, behaviour: 'wander', sleeps: null, challenge: false, ...extra });
    if (state.inParty(p.id) && rec.found) { out.push({ data: p, mode: 'follow' }); continue; }
    if (p.id === 'toby' && !rec.found && z === 'mftop') { out.push({ data: here(21, 34), mode: 'wild' }); continue; }
    const sc = d.scatter[p.id];
    if (sc && pending(p.id) && sc.zone === z) {
      if (sc.how === 'wild') out.push({ data: here(sc.at[0], sc.at[1]), mode: 'wild' });
      if (sc.how === 'goer' || (sc.how === 'dance' && nightPhase())) {
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
  const stay = d.party.filter(id => MF_STAY_HOME.includes(id));
  state.setParty(d.party.filter(id => !MF_STAY_HOME.includes(id)));
  if (stay.length) await ui.say(T_.stayHome);
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
}

async function tent(world) {
  if (stage() < S.wristband) return ui.say(['A bare patch of grass. Somebody has saved it with a single camp chair.']);
  if (stage() === S.wristband) {
    const go = await ui.say({ text: T_.pitchAsk, choices: [{ label: T_.pitchYes, value: true }, { label: T_.busNo, value: false }] }, { cancelValue: false });
    if (!go) return;
    await ui.say(T_.pitched);
    mf().stage = S.pitched; world.save();
    return ui.toast(T_.couchHint);
  }
  const go = await ui.say({ text: T_.restAsk, choices: [{ label: T_.restYes, value: true }, { label: T_.restNo, value: false }] }, { cancelValue: false });
  if (!go) return;
  world.cameras.main.fadeOut(400, 0, 0, 0);
  await new Promise(r => world.cameras.main.once('camerafadeoutcomplete', r));
  rest(world);
  world.cameras.main.fadeIn(500, 0, 0, 0);
  await ui.say(T_.rested);
}

// Everyone gets their energy back, and the team fills up again from the campsite.
function rest(world) {
  state.healAll();
  const party = [...state.data.party];
  for (const id of ['toby', ...mf().got]) if (party.length < 3 && !party.includes(id) && state.isFound(id)) party.push(id);
  state.setParty(party);
  world.syncFollowers();
}

// ------------------------------------------------------------ arriving in a zone
export async function mfEnter(world) {
  const m = mf(), z = world.regionId;
  nightStreams(world);
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
  // Once a night, somewhere in the dark: the Meredith echidna.
  if (hunting() && !m.glimpsed && ['mfamphi', 'mfbush', 'mfpines'].includes(z) && Math.random() < 0.35) {
    m.glimpsed = true; world.save();
    world.time.delayedCall(2500, () => glimpse(world));
  }
  if (z === 'mfamphi' && m.stage === S.sunrise && !m.cursed) return iceKids(world);
  if (z === 'mfsunset' && m.stage === S.sunrise && m.cursed) return sunrise(world);
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
// Returns true when the festival handled the chat (the story, a held pet).
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
  // Someone with one of your pets.
  const held = Object.entries(m.scatter).find(([pid, sc]) => sc.by === id && pending(pid));
  if (held) {
    const [pid, sc] = held;
    if (sc.how === 'goer') { await goerBattle(world, npc, pid, opts); return true; }
    if (sc.how === 'dance') { await danceOff(world, npc, pid, opts); return true; }
  }
  if (id === 'charlotte' && crowdPet()) {
    await ui.say(pick(NPCS.charlotte.lines || [['Water first.']]), opts);
    await crowdSearch(world, crowdPet());
    return true;
  }
  return false;
}

// What people say at the festival, with a rumour about a missing pet.
export function mfChatLines(id, info) {
  const pool = T_.friends[id] ? T_.friends[id].map(l => [l]) : info.lines || [];
  let lines = pool.length ? pick(pool) : [pick(T_.festLines)];
  if (hunting()) {
    const left = Object.keys(mf().scatter).filter(pending);
    if (left.length && Math.random() < 0.65) lines = [...lines, rumour(pick(left))];
    else if (Math.random() < 0.3) lines = [...lines, pick(T_.legend)];
  }
  return lines;
}
function rumour(pid) {
  const sc = mf().scatter[pid];
  return fmt(T_.rumour[sc.how], { pet: petName(pid), place: T_.placeName[sc.zone] || 'the festival', who: whoName(sc.by) });
}

// Pets: the festival's own cases. Returns true when handled.
export async function mfTalkPet(world, pet) {
  const id = pet.id, opts = { name: petName(id), portrait: petPortrait(id) };
  const rec = state.pet(id);
  if (id === 'toby' && !rec.found) { pet.pause(4); await ui.say(pick(Object.values(pet.data_.lines || {})) || ['Toby sneezes.'], { ...opts, name: 'Toby' }); return true; }
  const sc = mf().scatter[id];
  if (sc && pending(id)) {
    pet.pause(6); pet.facePoint(world.player.x);
    const v = { name: petName(id), who: whoName(sc.by) };
    if (sc.how !== 'wild') { await ui.say(L(T_.heldPet, v), opts); return true; }
    await ui.say(L(T_.wildPet, v), opts);
    if (!readyTeam().length) { await ui.say(['Your pets are worn out. Have a lie down in your tent at the campsite first.'], opts); return true; }
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

// ------------------------------------------------------------ the portal
async function portal(world, opts) {
  const cam = world.cameras.main, d = state.data, m = mf();
  await ui.say(T_.portal, opts);
  cam.flash(300, 160, 80, 255);
  await ui.say(T_.portalWrong.slice(0, 3), opts);
  cam.shake(1400, 0.012); sfx.encounter?.();
  await ui.say(T_.portalWrong.slice(3), opts);
  cam.flash(500, 255, 255, 255);
  // Every pet you have found (except the ones at home with the twins) goes flying.
  const spare = [...MF_SPARE];
  let k = 0;
  m.scatter = {}; m.got = [];
  for (const id of state.foundIds().filter(id => !MF_STAY_HOME.includes(id))) {
    const sc = MF_SCATTER[id] || { ...spare[k % spare.length] };
    if (!MF_SCATTER[id] && sc.at) sc.at = [sc.at[0] + Math.floor(k / spare.length) * 3, sc.at[1]];
    if (!MF_SCATTER[id]) k++;
    m.scatter[id] = sc;
    state.pet(id).hp = null;
  }
  // Princess is home with the twins, but the portal pulls her in too. Nobody finds her till dawn.
  m.lostPrincess = state.isFound('princess');
  // Toby, tuned to the portal now.
  const levels = state.foundIds().filter(id => id !== 'toby').map(id => state.pet(id).level || START_LEVEL[id] || 5);
  const avg = levels.length ? Math.round(levels.reduce((a, b) => a + b, 0) / levels.length) : 10;
  state.findPet('toby');
  const toby = state.pet('toby');
  toby.level = Math.max(toby.level || 0, Math.max(5, Math.min(40, avg - 2))); toby.hp = null;
  state.setParty(['toby']);
  m.stage = S.hunt;
  if (m.lostPrincess) await ui.say(T_.princessPulled);
  await ui.say(T_.portalAfter, opts);
  ui.banner('New Petdex entry!', 'Toby');
  await ui.say([T_.tobyJoins]);
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
  m.stage = S.sunrise; world.save();
  world.mfRefresh?.();
  if (world.regionId === 'mfamphi') return iceKids(world);
  ui.toast(T_.iceHint);
}

// ------------------------------------------------------------ night traffic
// At night the roads fill with people heading to and from the stage: black
// silhouettes walking edge to edge, both ways, like cars in the city. Scenery
// only (no collisions), and gone once the Ice Kids' curse scatters everyone.
// Routes between the zone's edge entries, keeping to the dirt roads where it
// can (a cheap Dijkstra: road tiles cost 1, grass 4, anything solid is out).
function nightRoutes(map) {
  const { w, h, ground, solid } = map;
  const ends = Object.values(map.entries || {}).filter(e => Number.isFinite(e.x) && (e.x < 4 || e.y < 4 || e.x > w - 5 || e.y > h - 5));
  const route = (a, b) => {
    const dist = new Float64Array(w * h).fill(Infinity), prev = new Int32Array(w * h).fill(-1), done = new Uint8Array(w * h);
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
        if (x < 0 || y < 0 || x >= w || y >= h || done[n] || solid[n]) continue;
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
  if (!nightPhase() || mf().cursed || world.mfStreams) return;
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

// ------------------------------------------------------------ the Ice Kids close night one
async function iceKids(world) {
  if (world.iceBusy) return;
  world.iceBusy = true;
  const cam = world.cameras.main, m = mf(), sx = 30 * T, sy = 33 * T;
  // Look down at the stage for the set, then back to Helen.
  cam.stopFollow();
  cam.pan(sx, 37 * T, 1400, 'Sine.easeInOut');
  await new Promise(r => world.time.delayedCall(1500, r));
  // The band walks on: drawn on the stage deck, in front of the stage art.
  const band = ['mficesinger', 'mficeguitar'].map((id, i) => {
    const key = world.textures.exists(`npc-${id}`) ? `npc-${id}` : `npc-${id}-down`;
    const spr = world.add.sprite((27.5 + i * 5) * T, 36.1 * T, key, 0).setOrigin(0.5, 1).setDepth(38 * T + 2).setAlpha(0);
    world.tweens.add({ targets: spr, alpha: 1, duration: 800 });
    return spr;
  });
  // A packed crowd in front of the barrier, facing the stage and bopping.
  const crowd = [];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 11; i++) {
    const c = FEST_CROWD[(r * 11 + i * 5) % FEST_CROWD.length];
    const x = (21.5 + i * 1.7 + (r % 2) * 0.85 + Math.sin(i * 7 + r) * 0.3) * T, y = (40.2 + r * 0.8) * T;
    const p = world.add.sprite(x, y, `npc-${c.id}-up`, 0).setOrigin(0.5, 1).setDepth(y);
    p.festId = c.id;
    world.tweens.add({ targets: p, y: y - 2, duration: 260 + (i % 3) * 40, yoyo: true, repeat: -1, delay: (i * 70 + r * 110) % 400 });
    crowd.push(p);
  }
  await ui.say(T_.iceKids);
  const glow = world.add.image(sx, sy, 'fx-glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9550).setScale(6).setTint(0x7ad8ff).setAlpha(0);
  world.tweens.add({ targets: glow, alpha: 0.9, duration: 900, yoyo: true, repeat: -1 });
  cam.flash(400, 120, 200, 255);
  await ui.say(T_.iceCurse.slice(0, 2));
  cam.shake(1600, 0.01); sfx.encounter?.();
  for (let i = 0; i < 10; i++) {
    const s = world.add.image(sx + (i - 4.5) * 14, sy, 'fx-glow').setTint(0x1a0a22).setScale(1.4).setDepth(9560).setAlpha(0.95);
    world.tweens.add({ targets: s, x: s.x + (i - 4.5) * 30, y: sy - 160 - (i % 3) * 40, alpha: 0, duration: 2200, delay: i * 140, onComplete: () => s.destroy() });
  }
  // The crowd scatters as the Dickheads come off the stage.
  crowd.forEach((p, i) => {
    world.tweens.killTweensOf(p);
    const right = p.x > sx;
    if (world.anims.exists(`npc-${p.festId}-left-walk`)) p.play(`npc-${p.festId}-left-walk`);
    p.setFlipX(right);
    world.tweens.add({ targets: p, x: p.x + (right ? 1 : -1) * (180 + (i % 4) * 40), y: p.y + (i % 3) * 12, alpha: 0, duration: 1600 + (i % 5) * 150, delay: (i % 7) * 60, onComplete: () => p.destroy() });
  });
  await new Promise(r => world.time.delayedCall(2000, r));
  await ui.say(T_.iceCurse.slice(2));
  cam.flash(600, 30, 0, 50);
  m.cursed = true;
  invalidateMap('mfamphi');   // the silhouette crowd has gone too
  state.data.minutes = Math.max(state.data.minutes, 29 * 60);   // the set ran very late
  ui.updateHud(world.regionId);
  world.save();
  glow.destroy();
  world.tweens.add({ targets: band, alpha: 0, duration: 900, onComplete: () => band.forEach(b => b.destroy()) });
  await ui.say(T_.iceAfter);
  if (world.cameras?.main) {
    cam.pan(world.player.x, world.player.y, 900, 'Sine.easeInOut');
    await new Promise(r => world.time.delayedCall(950, r));
    cam.startFollow(world.player, true, 0.2, 0.2);
  }
  ui.toast(T_.sunriseHint);
  world.iceBusy = false;
}

async function goerBattle(world, npc, pid, opts) {
  const t = TRAINERS[npc.id];
  await ui.say(t.challenge, opts);
  if (!readyTeam().length) return ui.say(['Your pets are worn out. Have a lie down in your tent at the campsite first.'], opts);
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

// The couch rides along on your head down to the Amphitheatre.
export function carryCouch(world) {
  if (stage() !== S.carrying) return;
  const img = world.add.image(world.player.x, world.player.y - 28, 'fx-sparkle').setVisible(false);
  try {
    const key = 'obj-mfcouch-green';
    if (world.textures.exists(key)) img.setTexture(key).setScale(0.35).setVisible(true);
  } catch (e) { /* no couch art: nothing on your head */ }
  const tick = () => { if (!img.active || stage() !== S.carrying) { img.destroy(); world.events.off('update', tick); return; } img.setPosition(world.player.x, world.player.y - 26).setDepth(world.player.y + 1); };
  world.events.on('update', tick);
  world.events.once('shutdown', () => { world.events.off('update', tick); });
}

// ------------------------------------------------------------ finding a friend in the crowd
const crowdPet = () => Object.entries(mf().scatter).find(([pid, sc]) => sc.how === 'crowd' && pending(pid))?.[0] || null;

export async function crowdSearch(world, pid) {
  if (world.regionId !== 'mfamphi' || !nightPhase() || ui.activity) return;
  const sc = mf().scatter[pid], v = { pet: petName(pid), who: whoName(sc.by) };
  await ui.say(L(T_.crowdStart, v), { name: 'Charlotte', portrait: npcIcon('charlotte') });
  const m = world.map, open = [];
  for (let y = 9; y < 31; y++) for (let x = 6; x < 50; x++) if (!m.solid[y * m.w + x] && Math.hypot((x + 0.5) * T - world.player.x, (y + 0.5) * T - world.player.y) > 90) open.push([x, y]);
  if (!open.length) return;
  return new Promise(resolve => {
    let left = 75, move = 0, ended = false, friend = null;
    const place = () => {
      friend?.destroy();
      const [x, y] = pick(open);
      friend = world.spawnNpc({ id: sc.by, x, y, face: 'down' });
      friend.setDepth(friend.y).setAlpha(0); world.tweens.add({ targets: friend, alpha: 1, duration: 400 });
    };
    const status = h('p', { role: 'status', 'aria-live': 'polite' });
    const bar = h('section', { class: 'hall-event-bar', 'aria-label': 'Find your friend in the crowd' },
      h('b', {}, `Find ${v.who}`), status, h('button', { class: 'wood-btn small hall-leave', onclick: () => finish(false) }, 'Give up'));
    const finish = async found => {
      if (ended) return; ended = true;
      world.events.off('update', tick);
      bar.remove(); document.body.classList.remove('hall-event');
      ui.activity = null; controls.release(); if (world.cameras?.main) world.onResize();
      const fopts = { name: v.who, portrait: npcIcon(sc.by) };
      if (found) {
        friend.setVelocity?.(0, 0);
        world.heartsFx?.(friend, 6);
        await ui.say(L(T_.crowdFound, v), fopts);
        friend.destroy();
        mf().crowdOffered = false;
        await recover(world, pid);
      } else {
        world.tweens.add({ targets: friend, alpha: 0, duration: 400, onComplete: () => friend.destroy() });
        mf().crowdOffered = false;
        if (world.player?.active) await ui.say([fmt(T_.crowdMissed, v)]);
      }
      resolve(found);
    };
    const tick = (_t, delta) => {
      if (ended || document.hidden) return;
      const dt = delta / 1000;
      left -= dt; move -= dt;
      if (move <= 0) { move = 14; place(); }
      status.textContent = fmt(T_.crowdBar, { who: v.who, s: Math.max(0, Math.ceil(left)) });
      if (friend && Math.hypot(friend.x - world.player.x, friend.y - world.player.y) < 20) finish(true);
      else if (left <= 0) finish(false);
    };
    document.body.append(bar); document.body.classList.add('hall-event');
    world.onResize(); controls.release();
    ui.activity = { walk: true, action: () => {}, cancel: () => finish(false) };
    world.events.on('update', tick);
    world.events.once('shutdown', () => finish(false));
    tick(0, 0);
  });
}

// ------------------------------------------------------------ the dance off
const ARROWS = { up: '↑', down: '↓', left: '←', right: '→' };
export async function danceOff(world, npc, pid, opts) {
  const v = { pet: petName(pid) };
  await ui.say(L(T_.danceIntro, v), opts);
  const go = await ui.say({ text: T_.danceAsk, choices: [{ label: T_.danceYes, value: true }, { label: T_.danceNo, value: false }] }, { ...opts, cancelValue: false });
  if (!go) return;
  const ROUNDS = 8, NEED = 6, WINDOW = 1.7;
  const won = await new Promise(resolve => {
    let n = 0, got = 0, t = 0, want = null, answered = false, ended = false;
    const sign = world.add.text(npc.x, npc.y - 40, '', { fontSize: '16px', fontStyle: 'bold', color: '#f5e66b', stroke: '#1e1a16', strokeThickness: 4 }).setOrigin(0.5, 1).setDepth(9600);
    const status = h('p', { role: 'status', 'aria-live': 'polite' });
    const answer = dir => {
      if (!want || answered || ended) return;
      answered = true;
      const ok = dir === want;
      if (ok) { got++; sfx.select?.(); world.player.perform?.('wave'); world.reactFx?.(npc, 'jump'); }
      else sfx.bump?.();
      sign.setText(ok ? '✓' : '✗').setColor(ok ? '#7be07b' : '#ff6a5a');
    };
    const pads = h('div', { class: 'hall-cues' }, ...Object.entries(ARROWS).map(([dir, a]) => h('button', { class: 'wood-btn small', onclick: () => answer(dir) }, a)));
    const bar = h('section', { class: 'hall-event-bar', 'aria-label': 'Dance off' }, h('b', {}, 'Dance off'), status, pads,
      h('button', { class: 'wood-btn small hall-leave', onclick: () => finish() }, 'Stop'));
    const offDir = bus.on('input:dir', (dx, dy) => answer(dx > 0 ? 'right' : dx < 0 ? 'left' : dy < 0 ? 'up' : 'down'));
    let lastVec = '';
    const finish = () => {
      if (ended) return; ended = true;
      world.events.off('update', tick); offDir();
      sign.destroy(); bar.remove(); document.body.classList.remove('hall-event');
      ui.activity = null; controls.release(); if (world.cameras?.main) world.onResize();
      resolve(got >= NEED);
    };
    const next = () => {
      if (n >= ROUNDS) return finish();
      n++; t = 0; answered = false;
      want = pick(Object.keys(ARROWS));
      sign.setText(ARROWS[want]).setColor('#f5e66b');
      npc.setDir?.(want === 'right' ? 'right' : want === 'left' ? 'left' : want === 'up' ? 'up' : 'down');
    };
    const tick = (_t, delta) => {
      if (ended || document.hidden) return;
      // Joystick swipes count too (touch screens send no arrow keys).
      const vec = controls.vector(), dir = Math.abs(vec.x) > 0.5 ? (vec.x > 0 ? 'right' : 'left') : Math.abs(vec.y) > 0.5 ? (vec.y > 0 ? 'down' : 'up') : '';
      if (dir && dir !== lastVec) answer(dir);
      lastVec = dir;
      t += delta / 1000;
      if (t > WINDOW) next();
      status.textContent = fmt(T_.danceBar, { n, got, need: NEED });
    };
    document.body.append(bar); document.body.classList.add('hall-event');
    world.onResize(); controls.release();
    ui.activity = { walk: false, action: () => {}, cancel: () => finish() };
    world.events.on('update', tick);
    world.events.once('shutdown', finish);
    next();
  });
  if (won) { await ui.say(L(T_.danceWin, v), opts); await recover(world, pid); }
  else await ui.say(L(T_.danceLose, v), opts);
}

// ------------------------------------------------------------ the sunrise that is not the sun
async function sunrise(world) {
  if (world.sunriseBusy) return;
  world.sunriseBusy = true;
  const d = state.data, cam = world.cameras.main;
  await ui.say(T_.sunrise.slice(0, 3));
  const key = world.textures.exists('pet-princess-evolved') ? 'pet-princess-evolved' : 'pet-princess';
  const x = cam.worldView.centerX, y0 = cam.worldView.bottom + 10, y1 = cam.worldView.top + cam.worldView.height * 0.45;
  const glow = world.add.image(x, y0, 'fx-glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9550).setScale(5).setTint(0xff8a2a).setAlpha(0.9);
  const queen = world.add.sprite(x, y0, key, 0).setOrigin(0.5, 0.5).setDepth(9560);
  queen.setDisplaySize(96 * queen.width / queen.height, 96);
  world.tweens.add({ targets: [queen, glow], y: y1, duration: 3200, ease: 'Sine.easeOut' });
  world.tweens.add({ targets: glow, scale: 7, alpha: 1, duration: 1600, yoyo: true, repeat: -1 });
  await new Promise(r => world.time.delayedCall(3300, r));
  cam.flash(600, 255, 180, 80);
  await ui.say(T_.sunrise.slice(3));
  const m = mf();
  if (m.lostPrincess) {
    // She floats down into Helen's arms: found, and evolved if she was not already.
    const me = world.player;
    world.tweens.add({ targets: queen, x: me.x, y: me.y - 24, displayHeight: 24, displayWidth: 24 * queen.width / queen.height, duration: 1600, ease: 'Sine.easeInOut' });
    world.tweens.add({ targets: glow, x: me.x, y: me.y - 24, scale: 2, duration: 1600 });
    await new Promise(r => world.time.delayedCall(1700, r));
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
  mf().stage = S.done;
  d.minutes = 12 * 60;
  world.save();
  ui.updateHud(world.regionId);
  if (news?.length) await ui.say(news);
  await ui.say(T_.afterSunrise);
  world.sunriseBusy = false;
}

// ------------------------------------------------------------ ways out
export function mfExitBlock(world, ex) {
  const s = stage();
  if (world.regionId === 'mfreception' && s === S.arrived && ex.to) return T_.needWristband;
  return null;
}

// What the To Do list says, while the festival is on.
export function mfObjective() {
  const s = stage(), m = mf();
  if (!s || s >= S.home) return null;
  const left = Object.keys(m.scatter).filter(p => !m.got.includes(p)).length;
  const text = {
    [S.invited]: 'Catch the charter bus on Allen St to Meredith (talk to the driver)',
    [S.arrived]: T_.wristbandHint, [S.wristband]: `${T_.campHint} Pitch your tent.`, [S.pitched]: T_.couchHint,
    [S.carrying]: T_.couchCarry, [S.night]: T_.portalHint, [S.hunt]: fmt(T_.huntHint, { n: left }),
    [S.sunrise]: m.cursed ? T_.sunriseHint : T_.iceHint, [S.done]: 'Take the charter bus home from Reception',
  }[s];
  return { text, done: false };
}
