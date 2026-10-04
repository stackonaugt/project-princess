// Everything that gets saved lives in `state.data`. Saved to localStorage
// automatically, and can be exported as a code to move between devices.

import { SAVE_KEY, LEGACY_SAVE_KEYS, POINTS_PER_HEART, MAX_HEARTS, RAIN_CHANCE } from '../config.js';
import { PETS, PET_BY_ID } from '../data/pets.js';
import { ITEMS } from '../data/items.js';
import { bus } from '../bus.js';
import { rng } from '../util.js';

const VERSION = 3;

function fresh() {
  return {
    v: VERSION, created: Date.now(),
    day: 1, minutes: 9 * 60,     // the very first day starts at 9am
    region: 'laverton', pos: null, dir: 'down',
    visited: ['laverton'],
    pets: {},          // id -> { found, day, date, points, talkedDay, giftedDay, reactions: {item: 'love'|...}, chats }
    inventory: {},     // item id -> count
    forage: {},        // region -> { day, taken: [index...] }
    npcDay: {},        // npc id -> last day they gave a gift
    stats: { steps: 0, gifts: 0, chats: 0, treats: 0 },
    settings: { sound: true },
    seenIntro: false,
  };
}

function petRecord(d, id) {
  return d.pets[id] || (d.pets[id] = { found: false, day: 0, date: null, points: 0, talkedDay: 0, giftedDay: 0, reactions: {}, chats: 0 });
}

// Make sure anything loaded from storage or a code has the right shape.
function sanitise(raw) {
  const d = fresh();
  if (!raw || typeof raw !== 'object') return d;
  for (const k of ['day', 'minutes']) if (Number.isFinite(raw[k])) d[k] = raw[k];
  if (typeof raw.region === 'string' && ['laverton', 'brunswick', 'reservoir'].includes(raw.region)) d.region = raw.region;
  if (raw.pos && Number.isFinite(raw.pos.x) && Number.isFinite(raw.pos.y)) d.pos = { x: raw.pos.x, y: raw.pos.y };
  if (typeof raw.dir === 'string') d.dir = raw.dir;
  if (Array.isArray(raw.visited)) d.visited = [...new Set(['laverton', ...raw.visited.filter(r => typeof r === 'string')])];
  if (raw.pets && typeof raw.pets === 'object') for (const id of Object.keys(raw.pets)) if (PET_BY_ID[id]) Object.assign(petRecord(d, id), raw.pets[id]);
  if (raw.inventory) for (const [k, n] of Object.entries(raw.inventory)) if (ITEMS[k] && n > 0) d.inventory[k] = Math.min(99, n | 0);
  if (raw.forage && typeof raw.forage === 'object') d.forage = raw.forage;
  if (raw.npcDay && typeof raw.npcDay === 'object') d.npcDay = raw.npcDay;
  if (raw.stats) Object.assign(d.stats, raw.stats);
  if (raw.settings) Object.assign(d.settings, raw.settings);
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

  load() {
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { /* ignore */ }
    if (raw) { this.data = sanitise(raw); this.isNewGame = false; return; }
    const legacy = migrateLegacy();
    if (legacy) { this.data = legacy; this.isNewGame = false; this.migrated = true; this.save(); return; }
    this.data = fresh(); this.isNewGame = true;
  },
  save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.data)); } catch (e) { /* storage full or blocked */ }
  },
  reset() {
    try { localStorage.removeItem(SAVE_KEY); LEGACY_SAVE_KEYS.forEach(k => localStorage.removeItem(k)); } catch (e) { /* ignore */ }
  },

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

  // World
  visit(region) { if (!this.data.visited.includes(region)) this.data.visited.push(region); },
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
