// Everything that gets saved lives in `state.data`. Saved to localStorage
// automatically, in one of three save slots (picked on the title screen),
// and can be exported as a code to move between devices.

import { SAVE_KEY, LEGACY_SAVE_KEYS, POINTS_PER_HEART, MAX_HEARTS, RAIN_CHANCE, DAY_START } from '../config.js';
const DAY_START_MIN = DAY_START;
import { PETS, PET_BY_ID } from '../data/pets.js';
import { isArchived, petVisible } from '../authoring/archive.js';
import { ITEMS, isTreat } from '../data/items.js';
import { GEAR } from '../data/gear.js';
import { bus } from '../bus.js';
import { rng } from '../util.js';
import { ZONES, invalidateMap } from '../data/regions.js';
import { MOTIONS, MOTION_ORDER, motionReady, MAX_PER_MEETING } from '../data/council.js';
import { isMeetingDay } from '../data/routines.js';
import { requestsFor, REQUEST_BONUS } from '../data/requests.js';
import { CROPS } from '../data/crops.js';
import { UPGRADES } from '../data/upgrades.js';
import { FRIEND_POINTS } from '../data/friends.js';
import { CHAPTERS } from '../data/story.js';
import { FURNITURE, DEFAULT_FURNITURE } from '../data/furniture.js';
import { normaliseScorecards } from './scorecards.js';

const VERSION = 10;
export const MAX_TEAM = 3;
export const SLOT_COUNT = 3;
const slotKey = n => `${SAVE_KEY}-slot${n}`;
// Old npc ids -> new ones (the owner renamed some people).
const RENAMED = { jules: 'pearman', busker: 'jordan', priya: 'abby', dimitri: 'james', wen: 'chris', kez: 'nathan', marisol: 'ardi', commuter: 'jack', ed: 'ward', wren: 'shannon', sal: 'franco', bev: 'greco' };

function fresh() {
  return {
    playerSkills: {},
    scorecards: [],
    v: VERSION, created: Date.now(),
    day: 1, minutes: 9 * 60,     // the very first day starts at 9am
    region: 'home', pos: null, dir: 'down',   // region = the zone you're in (see data/regions.js)
    visited: ['home'],
    pinned: null,       // optional single story objective/request; safe for older saves
    hero: null, startGiven: false,        // 'helen' | 'hadrian' | 'aleksy' (see data/heroes.js)
    party: [],         // pet ids on your team (max 3), they follow you around
    pets: {},          // id -> { found, day, date, points, talkedDay, giftedDay, reactions: {item: 'love'|...}, chats, level, xp, hp }
    beaten: {},        // trainer id -> day you last beat them
    money: 25,         // dollars, earned in battles and spent at the pet shop
    gear: {},          // gear id -> how many you own but haven't put on a pet
    friends: {},       // npc id -> { points, talkedDay, giftedDay, reactions, events: [hearts seen], met }
    seeds: {},         // crop id -> packets of seeds
    farm: {},          // plot id -> { crop, growth, watered (day), boost } (see data/crops.js)
    soil: {},          // plot id -> { family, crop } from its last finished crop
    upgrades: {},      // upgrade id -> true (see data/upgrades.js)
    matchups: [],      // type matchups tried in battle, 'fire>water' (the Petdex shows the strong and weak ones)
    bakeStars: {},     // star ratings of the baked things in the bag, oldest first: { sponge: [3, 1.5] }
    flags: {},         // one-off story flags, e.g. garden (Chris gave you plots)
    spell: null,       // today's protection spell from the milk bar: { id, day }
    inventory: {},     // item id -> count
    forage: {},        // region -> { day, taken: [index...] }
    npcDay: {},        // npc id -> last day they gave a gift
    council: { given: {}, passed: [], lost: {}, silly: [], won: {}, known: [] },   // motions (data/council.js): items chipped in, passed ids, id -> day it lost a vote, SILLY_MOTIONS indexes that passed, motion -> councillors won over
    wallPaint: null,   // the colour of the walls at home (Lincraft paint, Summerhill)
    // Side missions and mini-games: pranks scoped out (Chapter 3), duck feeding,
    // bowls wins, the bake-off rivalry (0 untold, 1 Betty asked, 2 Meghan beaten).
    side: { scouted: [], duckWins: 0, duckling: false, bowlsWins: 0, trophy: false, bake: 0, bakeQuest: {cooked:[],quality:{},practices:0,entries:0}, show: {entered:false,pet:null,practice:0,practiceDay:0,divisions:{},claimed:[]}, school: { lessonDay: {}, stamps: {}, skills: {} } },
    recipes: [],       // recipes learnt beyond the starting ones (data/cooking.js)
    requests: { day: 0, done: [] },                 // today's requests board (data/requests.js): ids fulfilled today
    furniture: { ...DEFAULT_FURNITURE, owned: Object.values(DEFAULT_FURNITURE) },    // what's in the house (Franco Cozzo, data/furniture.js)
    stats: { steps: 0, gifts: 0, chats: 0, treats: 0 },
    settings: { sound: true, dayLength: 1, paused: false },
    seenIntro: false,
    story: freshStory(),   // the chapters (systems/story.js)
  };
}
const freshStory = () => ({ chapter: 0, done: {}, ch2: {}, pranks: [], invited: [], party: null, heroBefore: null });

function petRecord(d, id) {
  return d.pets[id] || (d.pets[id] = { found: false, day: 0, date: null, points: 0, talkedDay: 0, giftedDay: 0, reactions: {}, chats: 0, level: 0, xp: 0, hp: null, evolved: false, gear: null });
  // level 0 = not set yet (see START_LEVEL in systems/battle.js); hp null = full health
}

// Make sure anything loaded from storage or a code has the right shape.
function sanitise(raw) {
  const d = fresh();
  if (!raw || typeof raw !== 'object') return d;
  for (const k of ['day', 'minutes']) if (Number.isFinite(raw[k])) d[k] = raw[k];
  // Version 3 saves had one big 'laverton' map; it's now several zones.
  const oldLaverton = (raw.v || 0) < 4 || ((raw.v || 0) < 6 && ['reservoir', 'lake'].includes(raw.region));  // maps that were rebuilt
  if (typeof raw.region === 'string' && ZONES[raw.region]) d.region = raw.region;
  if (!oldLaverton && raw.pos && Number.isFinite(raw.pos.x) && Number.isFinite(raw.pos.y)) d.pos = { x: raw.pos.x, y: raw.pos.y };
  if (typeof raw.dir === 'string') d.dir = raw.dir;
  if (Array.isArray(raw.visited)) d.visited = [...new Set(['home', ...raw.visited.map(r => r === 'laverton' ? 'station' : r).filter(r => ZONES[r])])];
  if (raw.pinned && ['story', 'request'].includes(raw.pinned.kind) && typeof raw.pinned.id === 'string' && raw.pinned.id.length < 100) {
    d.pinned = { kind: raw.pinned.kind, id: raw.pinned.id, day: raw.pinned.day | 0, chapter: raw.pinned.chapter | 0 };
  }
  if (raw.pets && typeof raw.pets === 'object') for (const id of Object.keys(raw.pets)) if (PET_BY_ID[id]) Object.assign(petRecord(d, id), raw.pets[id]);
  if (raw.inventory) for (const [k, n] of Object.entries(raw.inventory)) if (ITEMS[k] && n > 0) d.inventory[k] = Math.min(99, n | 0);
  if (raw.forage && typeof raw.forage === 'object') d.forage = raw.forage;
  if (raw.npcDay && typeof raw.npcDay === 'object') d.npcDay = raw.npcDay;
  if (raw.beaten && typeof raw.beaten === 'object') d.beaten = raw.beaten;
  if (Number.isFinite(raw.money)) d.money = Math.max(0, Math.floor(raw.money));
  if (raw.gear && typeof raw.gear === 'object') for (const [k, n] of Object.entries(raw.gear)) if (GEAR[k] && n > 0) d.gear[k] = n | 0;
  for (const r of Object.values(d.pets)) if (r.gear && !GEAR[r.gear]) r.gear = null;
  if (raw.friends && typeof raw.friends === 'object') d.friends = raw.friends;
  // People renamed by the owner keep their friendships, gifts and battle wins.
  for (const obj of [d.friends, d.npcDay, d.beaten]) for (const [from, to] of Object.entries(RENAMED)) if (obj[from] && !obj[to]) { obj[to] = obj[from]; delete obj[from]; }
  if (raw.seeds && typeof raw.seeds === 'object') for (const [k, n] of Object.entries(raw.seeds)) if (CROPS[k] && n > 0) d.seeds[k] = n | 0;
  if (raw.farm && typeof raw.farm === 'object') for (const [k, f] of Object.entries(raw.farm)) if (f && CROPS[f.crop]) d.farm[k] = f;
  if (raw.soil && typeof raw.soil === 'object') for (const [k, s] of Object.entries(raw.soil)) if (s && typeof s.family === 'string' && typeof s.crop === 'string' && CROPS[s.crop]) d.soil[k] = { family: s.family, crop: s.crop };
  if (raw.upgrades && typeof raw.upgrades === 'object') for (const k of Object.keys(raw.upgrades)) if (UPGRADES[k]) d.upgrades[k] = true;
  if (raw.flags && typeof raw.flags === 'object') d.flags = raw.flags;
  d.scorecards = normaliseScorecards(raw.scorecards);
  if (Array.isArray(raw.matchups)) d.matchups = raw.matchups.filter(k => typeof k === 'string');
  if (raw.bakeStars && typeof raw.bakeStars === 'object') for (const [k, v] of Object.entries(raw.bakeStars)) if (Array.isArray(v)) d.bakeStars[k] = v.filter(n => typeof n === 'number' && n >= 0 && n <= 3);
  if (raw.spell && typeof raw.spell === 'object') d.spell = { id: String(raw.spell.id), day: +raw.spell.day || 0 };
  if (raw.council && typeof raw.council === 'object') d.council = { given: raw.council.given || {}, passed: Array.isArray(raw.council.passed) ? raw.council.passed : [], lost: raw.council.lost || {}, silly: Array.isArray(raw.council.silly) ? raw.council.silly : [], won: raw.council.won && typeof raw.council.won === 'object' ? raw.council.won : {}, known: Array.isArray(raw.council.known) ? raw.council.known : [], metDay: raw.council.metDay };
  if (typeof raw.wallPaint === 'string') d.wallPaint = raw.wallPaint;
  if (raw.side && typeof raw.side === 'object') {
    Object.assign(d.side, raw.side, { scouted: Array.isArray(raw.side.scouted) ? raw.side.scouted : [] });
    const bq=raw.side.bakeQuest||{}, sh=raw.side.show||{};
    const record = v => v && typeof v==='object' && !Array.isArray(v) ? v : {};
    d.side.bakeQuest={cooked:Array.isArray(bq.cooked)?bq.cooked.filter(x=>typeof x==='string'):[],quality:record(bq.quality),practices:Math.max(0,+bq.practices||0),entries:Math.max(0,+bq.entries||0)};
    d.side.show={entered:!!sh.entered,pet:typeof sh.pet==='string'?sh.pet:null,practice:Math.max(0,+sh.practice||0),practiceDay:Math.max(0,+sh.practiceDay||0),divisions:Object.fromEntries(['novice','open','champion'].filter(id=>record(sh.divisions)[id]).map(id=>{const p=record(record(sh.divisions)[id]);return[id,{battles:Array.isArray(p.battles)?[...new Set(p.battles.filter(x=>typeof x==='string'))].slice(0,2):[],course:Math.max(0,Math.min(100,+p.course||0)),obedience:Math.max(0,Math.min(3,+p.obedience||0))}];})),claimed:Array.isArray(sh.claimed)?sh.claimed.filter(x=>typeof x==='string'):[]};
    const school = raw.side.school || {};
    d.side.school = { lessonDay: school.lessonDay && typeof school.lessonDay === 'object' ? school.lessonDay : {}, stamps: school.stamps && typeof school.stamps === 'object' ? school.stamps : {}, skills: school.skills && typeof school.skills === 'object' ? school.skills : {} };
  }
  if(raw.playerSkills&&typeof raw.playerSkills==='object') for(const [hero,skills] of Object.entries(raw.playerSkills)){
    if(!skills||typeof skills!=='object')continue;d.playerSkills[hero]={};
    for(const key of ['cooking','crafting','handling','combat','gathering'])d.playerSkills[hero][key]=Math.max(0,Math.min(3600,Number(skills[key])||0));
  }
  if (Array.isArray(raw.recipes)) d.recipes = raw.recipes.filter(k => typeof k === 'string');
  if (raw.requests && typeof raw.requests === 'object') d.requests = { day: raw.requests.day | 0, done: Array.isArray(raw.requests.done) ? raw.requests.done : [] };
  if (raw.furniture && typeof raw.furniture === 'object') { Object.assign(d.furniture, raw.furniture); if (!Array.isArray(d.furniture.owned)) d.furniture.owned = []; for (const id of Object.values(DEFAULT_FURNITURE)) if (!d.furniture.owned.includes(id)) d.furniture.owned.push(id); }
  if (raw.stats) Object.assign(d.stats, raw.stats);
  if (raw.settings) Object.assign(d.settings, raw.settings);
  if (['helen', 'hadrian', 'aleksy'].includes(raw.hero)) d.hero = raw.hero;
  d.startGiven = !!raw.startGiven;
  if (Array.isArray(raw.party)) d.party = raw.party.filter(id => d.pets[id]?.found && d.pets[id].hp !== 0).slice(0, MAX_TEAM);
  d.seenIntro = !!raw.seenIntro;
  if (raw.story && typeof raw.story === 'object') {
    const st = raw.story;
    d.story = { ...freshStory(), chapter: Math.max(0, Math.min(5, st.chapter | 0)), done: st.done || {}, ch2: st.ch2 || {},
      pranks: Array.isArray(st.pranks) ? st.pranks : [], invited: Array.isArray(st.invited) ? st.invited : [], party: st.party || null,
      heroBefore: st.heroBefore || null };
  }
  d.created = raw.created || d.created;
  return d;
}

// The single-file prototype only saved which pets you had found.
function migrateLegacy() {
  for (const key of LEGACY_SAVE_KEYS) {
    let old = null;
    try { old = JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { /* ignore */ }
    if (!old || !Array.isArray(old.found)) continue;
    const d = fresh();
    d.seenIntro = true;
    old.found.forEach(id => { if (PET_BY_ID[id]) Object.assign(petRecord(d, id), { found: true, day: 1, date: new Date().toISOString() }); });
    return d;
  }
  return null;
}

export const state = {
  data: fresh(),
  isNewGame: true,
  migrated: false,

  slot: null,   // 1..SLOT_COUNT once a slot is picked on the title screen

  // Older single saves (and the prototype's) move into slot 1 the first time.
  migrateToSlots() {
    try {
      if (localStorage.getItem(slotKey(1))) return;
      const old = localStorage.getItem(SAVE_KEY);
      if (old) { localStorage.setItem(slotKey(1), old); return; }
      const legacy = migrateLegacy();
      if (legacy) { localStorage.setItem(slotKey(1), JSON.stringify(legacy)); this.migrated = true; }
    } catch (e) { /* storage blocked */ }
  },
  readSlot(n) {
    try { const raw = JSON.parse(localStorage.getItem(slotKey(n)) || 'null'); return raw ? sanitise(raw) : null; } catch (e) { return null; }
  },
  // A short summary of each slot for the title screen (null = empty).
  slots() {
    return Array.from({ length: SLOT_COUNT }, (_, i) => {
      const d = this.readSlot(i + 1);
      return d && { n: i + 1, hero: d.hero, day: d.day, pets: PETS.filter(p => d.pets[p.id]?.found).length,
        totalPets: PETS.filter(p => petVisible(p.id, !!d.pets[p.id]?.found)).length, money: d.money, region: d.region };
    });
  },
  useSlot(n) {
    this.slot = n;
    const d = this.readSlot(n);
    this.data = d || fresh();
    this.isNewGame = !d;
    for (const ev of ['petdex:changed', 'bag:changed', 'money:changed']) bus.emit(ev);
  },
  deleteSlot(n) { try { localStorage.removeItem(slotKey(n)); } catch (e) { /* ignore */ } },
  save() {
    if (!this.slot) return;
    try { localStorage.setItem(slotKey(this.slot), JSON.stringify(this.data)); } catch (e) { /* storage full or blocked */ }
  },
  reset() { if (this.slot) this.deleteSlot(this.slot); },

  // Save codes: a compact text version of the save you can paste on another device.
  exportCode() {
    const json = JSON.stringify(this.data);
    return 'PP3-' + btoa(unescape(encodeURIComponent(json)));
  },
  importCode(code) {
    const clean = String(code || '').trim().replace(/^PP3-/, '');
    const raw = JSON.parse(decodeURIComponent(escape(atob(clean))));
    this.data = sanitise(raw);
    this.save();
  },

  // Pets
  pet(id) { return petRecord(this.data, id); },
  isFound(id) { return !!this.data.pets[id]?.found; },
  foundCount() { return PETS.filter(p => this.isFound(p.id)).length; },
  visiblePets() { return PETS.filter(p => petVisible(p.id, this.isFound(p.id))); },
  findPet(id) {
    if (!PET_BY_ID[id] || (isArchived('pets', id) && !this.isFound(id))) return false;
    const r = this.pet(id);
    if (r.found) return false;
    Object.assign(r, { found: true, day: this.data.day, date: new Date().toISOString() });
    if (this.data.party.length < MAX_TEAM && !this.data.party.includes(id)) this.data.party.push(id);
    bus.emit('petdex:changed');
    return true;
  },
  hearts(id) { return Math.min(MAX_HEARTS, Math.floor(this.pet(id).points / POINTS_PER_HEART)); },
  addPoints(id, n) {
    const r = this.pet(id), before = this.hearts(id);
    r.points = Math.max(0, Math.min(MAX_HEARTS * POINTS_PER_HEART, r.points + n));
    const after = this.hearts(id);
    bus.emit('petdex:changed');
    return { before, after };
  },

  // Bag
  count(item) { return this.data.inventory[item] || 0; },
  addItem(item, n = 1) { this.data.inventory[item] = Math.min(99, this.count(item) + n); bus.emit('bag:changed'); },
  removeItem(item, n = 1) {
    const left = this.count(item) - n;
    if (left > 0) this.data.inventory[item] = left; else delete this.data.inventory[item];
    const stars = this.data.bakeStars[item];
    if (stars) { while (stars.length > Math.max(0, left)) stars.shift(); if (!stars.length) delete this.data.bakeStars[item]; }
    bus.emit('bag:changed');
  },
  // A bake goes in the bag with its star rating; the oldest one is given away first.
  addBake(item, stars) { this.addItem(item); (this.data.bakeStars[item] ||= []).push(stars); },
  nextBakeStars(item) { const s = this.data.bakeStars[item] || []; return s.length >= this.count(item) && s.length ? s[0] : null; },
  bagItems() { return Object.keys(ITEMS).filter(k => this.count(k) > 0); },
  // What a pet will eat (no drinks, presents or fertiliser).
  treatItems() { return this.bagItems().filter(isTreat); },

  // Money and gear
  addMoney(n) { this.data.money = Math.max(0, this.data.money + Math.round(n)); bus.emit('money:changed'); },
  // Put a piece of furniture (or the pot plants) in the house; buying is up to the caller.
  placeFurniture(id) {
    const f = FURNITURE[id], furn = this.data.furniture;
    if (!f) return;
    furn[f.slot] = id;
    if (!furn.owned.includes(id)) furn.owned.push(id);
    invalidateMap('home');
    this.save();
  },
  spend(n) { if (this.data.money < n) return false; this.addMoney(-n); return true; },
  gearCount(id) { return this.data.gear[id] || 0; },
  addGear(id, n = 1) { this.data.gear[id] = this.gearCount(id) + n; bus.emit('bag:changed'); },
  // Put gear on a pet (the old piece goes back in the bag). id null takes it off.
  equip(petId, id) {
    const r = this.pet(petId);
    if (id && !this.gearCount(id)) return false;
    if (r.gear) this.addGear(r.gear);
    if (id) { this.data.gear[id]--; if (!this.data.gear[id]) delete this.data.gear[id]; }
    r.gear = id || null;
    bus.emit('bag:changed');
    return true;
  },

  // Friends (townsfolk). Same heart scale as pets.
  friend(id) { return this.data.friends[id] || (this.data.friends[id] = { points: 0, talkedDay: 0, giftedDay: 0, reactions: {}, events: [], met: false }); },
  friendHearts(id) { return Math.min(MAX_HEARTS, Math.floor((this.data.friends[id]?.points || 0) / POINTS_PER_HEART)); },
  addFriendPoints(id, n) {
    const f = this.friend(id), before = this.friendHearts(id);
    f.points = Math.max(0, Math.min(MAX_HEARTS * POINTS_PER_HEART, f.points + n));
    bus.emit('friends:changed');
    return { before, after: this.friendHearts(id) };
  },
  friendPoints: FRIEND_POINTS,

  // Seeds, plots and house upgrades
  seedCount(c) { return this.data.seeds[c] || 0; },
  addSeeds(c, n = 1) { this.data.seeds[c] = this.seedCount(c) + n; bus.emit('bag:changed'); },
  useSeed(c) { if (!this.seedCount(c)) return false; this.data.seeds[c]--; if (!this.data.seeds[c]) delete this.data.seeds[c]; bus.emit('bag:changed'); return true; },
  hasUpgrade(id) { return !!this.data.upgrades[id]; },

  // A new day: plots grow if they were watered (or it rained) on the day that
  // just ended, pets rest, and the pet door may turn up a present.
  // Returns lines to show when you wake up.
  newDay() {
    const d = this.data, ended = d.day, rained = !!this.rainWindow(ended), news = [];
    for (const plot of Object.values(d.farm)) {
      const c = CROPS[plot.crop];
      if (!c || plot.growth >= c.days) continue;
      if (plot.watered === ended || rained) plot.growth = Math.min(c.days, plot.growth + 1 + (plot.boost ? 1 : 0));
      plot.boost = false; plot.fed = false;
    }
    // The backyard sprinkler waters the home beds first thing.
    if (this.hasUpgrade('sprinkler')) for (const [id, plot] of Object.entries(d.farm)) if (id.startsWith('yd')) plot.watered = ended + 1;
    if (rained && Object.keys(d.farm).length) news.push('It rained yesterday, so the garden got a free drink.');
    if (this.hasUpgrade('sprinkler') && Object.keys(d.farm).some(id => id.startsWith('yd'))) news.push('The sprinkler ticks away in the backyard. The beds are watered.');
    // Council met last night and you weren't in the chamber: read about it in the morning.
    if (isMeetingDay(ended) && d.council.metDay !== ended) {
      for (const r of this.holdMeeting(ended)) news.push(r.passed ? `Council news: "${MOTIONS[r.id].title}" passed ${r.yes.length} votes to ${r.no.length}! ${MOTIONS[r.id].effect}` : `Council news: "${MOTIONS[r.id].title}" lost ${r.yes.length} votes to ${r.no.length}. Win over the undecided councillors (see the noticeboard) and try again next Tuesday.`);
    }
    // The spill vote (Chapter 2): out of time, and Paddy is rolled.
    const st = d.story, c2 = st.ch2;
    if (st.chapter === 2 && !st.done[2] && c2.deadline && ended >= c2.deadline && !c2.swapped && !c2.campaignWon) {
      c2.deposed = true; st.done[2] = ended;
      news.push(...CHAPTERS[2].failed);
    }
    d.day += 1; d.minutes = DAY_START_MIN; d.pos = null;
    this.healAll();
    const home = this.foundIds().filter(id => !this.inParty(id));
    if (this.hasUpgrade('petdoor') && home.length && rng(d.day * 31 + 7)() < 0.7) {
      const r = rng(d.day * 131 + 3), who = home[Math.floor(r() * home.length)];
      const item = ['tennis', 'feather', 'lemon', 'chicken', 'carrot'][Math.floor(r() * 5)];
      this.addItem(item);
      news.push(`${PET_BY_ID[who].name} came in through the pet door with a present: ${ITEMS[item].name.toLowerCase()}.`);
    }
    return news;
  },

  // The requests board (data/requests.js)
  todaysRequests() {
    const met = Object.entries(this.data.friends).filter(([id, f]) => f.met && this.friendHearts(id) >= 1).map(([id]) => id), key = `${this.data.day}:${met.length}`;
    if (this._reqKey !== key) { this._reqKey = key; this._req = requestsFor(this.data.day, met); }   // cached: the bubbles ask every frame
    return this._req.map(q => ({ ...q, destination: { npc: q.who }, done: this.data.requests.day === this.data.day && this.data.requests.done.includes(q.id) }));
  },
  completeRequest(id) {
    if (this.data.requests.day !== this.data.day) this.data.requests = { day: this.data.day, done: [] };
    this.data.requests.done.push(id);
  },

  // Council motions (data/council.js)
  // Motions go up on the noticeboard one at a time as you settle in: the
  // first once you have found two pets, another with each pet after that.
  // One motion on the board at a time: the next goes up once the last has
  // passed (and you have found one more pet than the motions before it).
  motionUnlocked(id) { const i = MOTION_ORDER.indexOf(id); return this.motionPassed(id) || (i < this.foundCount() && MOTION_ORDER.slice(0, i).every(m => this.motionPassed(m))); },
  motionPassed(id) { return this.data.council.passed.includes(id); },
  motionKnown(id) {
    return !!(this.data.flags.knownMotions?.includes(id) || this.motionPassed(id) ||
      this.data.council.known.some(key => key.startsWith(`${id}:`)) ||
      Object.values(this.data.council.given[id] || {}).some(n => n > 0));
  },
  learnMotion(id) {
    const known = this.data.flags.knownMotions ||= [];
    if (known.includes(id)) return false;
    known.push(id); return true;
  },
  motionGiven(id) { return this.data.council.given[id] || (this.data.council.given[id] = {}); },
  motionReady(id) { return motionReady(id, this.data.council.given[id]); },
  // Chip in towards a motion: all of one item you have (up to what's needed), or the money.
  chipIn(id, key) {
    const need = MOTIONS[id].needs[key] || 0, given = this.motionGiven(id), left = need - (given[key] || 0);
    if (left <= 0) return 0;
    if (key === 'money') { if (!this.spend(left)) return 0; given.money = need; return left; }
    const n = Math.min(left, this.count(key));
    for (let i = 0; i < n; i++) this.removeItem(key);
    given[key] = (given[key] || 0) + n;
    return n;
  },
  // Paddy not mayor (rolled in Chapter 2 and not re-elected, or lost the
  // election in Chapter 4): the swing votes are twice as hard to win.
  paddyDeposed() { const st = this.data.story; return st.party ? !st.party.won : !!st.ch2.deposed; },
  swingHearts(h) { return this.paddyDeposed() ? Math.min(10, h * 2) : h; },
  // Has this undecided councillor been won over on this motion?
  swingWon(motion, who) {
    const w = MOTIONS[motion].votes.swing[who];
    if (!w) return false;
    return (this.data.council.won[motion] || []).includes(who);
  },
  // What an undecided councillor wants, once you have found out (To Do list).
  swingKnown(motion, who) { return this.data.council.known.includes(`${motion}:${who}`); },
  learnSwing(motion, who) { this.learnMotion(motion); const k = `${motion}:${who}`; if (this.data.council.known.includes(k)) return false; this.data.council.known.push(k); return true; },
  winOver(motion, who) { const a = this.data.council.won[motion] || (this.data.council.won[motion] = []); if (!a.includes(who)) a.push(who); },
  // How each councillor votes on a motion right now.
  councilVote(motion) {
    const v = MOTIONS[motion].votes, yes = [...v.yes], no = [...v.no], undecided = [];
    for (const who of Object.keys(v.swing)) if (this.swingWon(motion, who)) yes.push(who); else { no.push(who); undecided.push(who); }
    return { yes, no, undecided, passed: yes.length >= 4 };
  },
  // The motions going to the next meeting: ready ones, at most MAX_PER_MEETING.
  meetingMotions() { return MOTION_ORDER.filter(id => !this.motionPassed(id) && this.motionReady(id)).slice(0, MAX_PER_MEETING); },
  // Vote on the ready motions (up to the cap). Returns the results.
  holdMeeting(day = this.data.day) {
    const c = this.data.council, results = [];
    c.metDay = day;
    for (const id of this.meetingMotions()) {
      const v = this.councilVote(id);
      results.push({ id, ...v });
      if (v.passed) this.passMotion(id); else c.lost[id] = day;
    }
    return results;
  },
  passMotion(id) {
    if (this.motionPassed(id)) return;
    this.data.council.passed.push(id);
    for (const z of { gardenplus: ['wetlands'], bookswap: ['lohse'], trees: ['allen'], lemontree: ['civic'] }[id] || []) invalidateMap(z);
    bus.emit('council:passed', id);
  },

  // World
  visit(zone) { if (!this.data.visited.includes(zone)) this.data.visited.push(zone); },
  suburbVisited(suburb) { return this.data.visited.some(z => ZONES[z]?.suburb === suburb); },

  // Team
  inParty(id) { return this.data.party.includes(id); },
  setParty(ids) { this.data.party = ids.filter(id => PET_BY_ID[id] && this.isFound(id)).slice(0, MAX_TEAM); bus.emit('petdex:changed'); },
  // Pets get their energy back at home (and overnight).
  healAll() { for (const r of Object.values(this.data.pets)) r.hp = null; },
  foundIds() { return PETS.filter(p => this.isFound(p.id)).map(p => p.id); },
  forageTaken(region, index) {
    const f = this.data.forage[region];
    return !!(f && f.day === this.data.day && f.taken.includes(index));
  },
  takeForage(region, index) {
    let f = this.data.forage[region];
    if (!f || f.day !== this.data.day) f = this.data.forage[region] = { day: this.data.day, taken: [] };
    f.taken.push(index);
  },

  // Weather is decided per day from the day number, so it's stable on reload.
  rainWindow(day = this.data.day) {
    const r = rng(day * 7919 + 17);
    if (r() > RAIN_CHANCE) return null;
    const from = (8 + Math.floor(r() * 10)) * 60, len = (1 + Math.floor(r() * 3)) * 60;
    return [from, from + len];
  },
  isRaining() {
    const w = this.rainWindow();
    return !!w && this.data.minutes >= w[0] && this.data.minutes < w[1];
  },
};
