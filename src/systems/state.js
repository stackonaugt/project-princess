// Everything that gets saved lives in `state.data`. Saved to localStorage
// automatically, in one of three save slots (picked on the title screen),
// and can be exported as a code to move between devices.

import { SAVE_KEY, LEGACY_SAVE_KEYS, POINTS_PER_HEART, MAX_HEARTS, RAIN_CHANCE, DAY_START } from '../config.js';
const DAY_START_MIN = DAY_START;
import { PETS, PET_BY_ID } from '../data/pets.js';
import { ITEMS, isTreat } from '../data/items.js';
import { GEAR } from '../data/gear.js';
import { bus } from '../bus.js';
import { rng } from '../util.js';
import { ZONES } from '../data/regions.js';
import { CROPS } from '../data/crops.js';
import { UPGRADES } from '../data/upgrades.js';
import { FRIEND_POINTS } from '../data/friends.js';

const VERSION = 9;
export const MAX_TEAM = 3;
export const SLOT_COUNT = 3;
const slotKey = n => `${SAVE_KEY}-slot${n}`;

function fresh() {
  return {
    v: VERSION, created: Date.now(),
    day: 1, minutes: 9 * 60,     // the very first day starts at 9am
    region: 'home', pos: null, dir: 'down',   // region = the zone you're in (see data/regions.js)
    visited: ['home'],
    hero: null, startGiven: false,        // 'helen' | 'hadrian' | 'aleksy' (see data/heroes.js)
    party: [],         // pet ids on your team (max 3), they follow you around
    pets: {},          // id -> { found, day, date, points, talkedDay, giftedDay, reactions: {item: 'love'|...}, chats, level, xp, hp }
    beaten: {},        // trainer id -> day you last beat them
    money: 25,         // dollars, earned in battles and spent at the pet shop
    gear: {},          // gear id -> how many you own but haven't put on a pet
    friends: {},       // npc id -> { points, talkedDay, giftedDay, reactions, events: [hearts seen], met }
    seeds: {},         // crop id -> packets of seeds
    farm: {},          // plot id -> { crop, growth, watered (day), boost } (see data/crops.js)
    upgrades: {},      // upgrade id -> true (see data/upgrades.js)
    flags: {},         // one-off story flags, e.g. garden (Wen gave you plots)
    inventory: {},     // item id -> count
    forage: {},        // region -> { day, taken: [index...] }
    npcDay: {},        // npc id -> last day they gave a gift
    stats: { steps: 0, gifts: 0, chats: 0, treats: 0 },
    settings: { sound: true },
    seenIntro: false,
  };
}

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
  if (raw.pets && typeof raw.pets === 'object') for (const id of Object.keys(raw.pets)) if (PET_BY_ID[id]) Object.assign(petRecord(d, id), raw.pets[id]);
  if (raw.inventory) for (const [k, n] of Object.entries(raw.inventory)) if (ITEMS[k] && n > 0) d.inventory[k] = Math.min(99, n | 0);
  if (raw.forage && typeof raw.forage === 'object') d.forage = raw.forage;
  if (raw.npcDay && typeof raw.npcDay === 'object') d.npcDay = raw.npcDay;
  if (raw.beaten && typeof raw.beaten === 'object') d.beaten = raw.beaten;
  if (Number.isFinite(raw.money)) d.money = Math.max(0, Math.floor(raw.money));
  if (raw.gear && typeof raw.gear === 'object') for (const [k, n] of Object.entries(raw.gear)) if (GEAR[k] && n > 0) d.gear[k] = n | 0;
  for (const r of Object.values(d.pets)) if (r.gear && !GEAR[r.gear]) r.gear = null;
  if (raw.friends && typeof raw.friends === 'object') d.friends = raw.friends;
  if (raw.seeds && typeof raw.seeds === 'object') for (const [k, n] of Object.entries(raw.seeds)) if (CROPS[k] && n > 0) d.seeds[k] = n | 0;
  if (raw.farm && typeof raw.farm === 'object') for (const [k, f] of Object.entries(raw.farm)) if (f && CROPS[f.crop]) d.farm[k] = f;
  if (raw.upgrades && typeof raw.upgrades === 'object') for (const k of Object.keys(raw.upgrades)) if (UPGRADES[k]) d.upgrades[k] = true;
  if (raw.flags && typeof raw.flags === 'object') d.flags = raw.flags;
  if (raw.stats) Object.assign(d.stats, raw.stats);
  if (raw.settings) Object.assign(d.settings, raw.settings);
  if (['helen', 'hadrian', 'aleksy'].includes(raw.hero)) d.hero = raw.hero;
  d.startGiven = !!raw.startGiven;
  if (Array.isArray(raw.party)) d.party = raw.party.filter(id => d.pets[id]?.found && d.pets[id].hp !== 0).slice(0, MAX_TEAM);
  d.seenIntro = !!raw.seenIntro;
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
      return d && { n: i + 1, hero: d.hero, day: d.day, pets: PETS.filter(p => d.pets[p.id]?.found).length, money: d.money, region: d.region };
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
  findPet(id) {
    const r = this.pet(id);
    if (r.found) return false;
    Object.assign(r, { found: true, day: this.data.day, date: new Date().toISOString() });
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
    bus.emit('bag:changed');
  },
  bagItems() { return Object.keys(ITEMS).filter(k => this.count(k) > 0); },
  // What a pet will eat (no drinks, presents or fertiliser).
  treatItems() { return this.bagItems().filter(isTreat); },

  // Money and gear
  addMoney(n) { this.data.money = Math.max(0, this.data.money + Math.round(n)); bus.emit('money:changed'); },
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

  // World
  visit(zone) { if (!this.data.visited.includes(zone)) this.data.visited.push(zone); },
  suburbVisited(suburb) { return this.data.visited.some(z => ZONES[z]?.suburb === suburb); },

  // Team
  inParty(id) { return this.data.party.includes(id); },
  setParty(ids) { this.data.party = ids.filter(id => this.isFound(id)).slice(0, MAX_TEAM); bus.emit('petdex:changed'); },
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
