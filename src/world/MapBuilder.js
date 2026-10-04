// Helper for writing region maps in code. A map is a grid of ground letters
// (see src/art/paint/tiles.js) plus a list of objects (trees, houses...).
// Everything is deterministic, so every player sees the same world.

import { OBJECTS } from '../art/paint/objects.js';
import { hash, rng } from '../util.js';

const SOLID_GROUND = '~rWV';
const GRASSY = '.,"L';

const DRESS_KINDS = new Set(['house', 'brickhouse', 'weatherboard', 'terrace', 'loddonunit', 'glasgowhouse', 'timunit', 'unit', 'hphouse']);

export class MapBuilder {
  constructor({ id, w, h, fill = '.', seed = 1 }) {
    Object.assign(this, { id, w, h });
    this.ground = Array.from({ length: h }, () => Array(w).fill(fill));
    this.occ = Array.from({ length: h }, () => Array(w).fill(null)); // object occupying each tile
    this.reserved = Array.from({ length: h }, () => Array(w).fill(false));
    this.objects = [];
    this.rand = rng(seed);
    this.exits = []; this.entries = {}; this.spawns = []; this.npcs = []; this.lanes = []; this.decor = [];
  }

  inside(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; }
  get(x, y) { return this.inside(x, y) ? this.ground[y][x] : null; }
  set(x, y, c) { if (this.inside(x, y)) this.ground[y][x] = c; return this; }
  fill(x, y, w, h, c) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.set(i, j, c); return this; }
  hline(x0, x1, y, c) { return this.fill(Math.min(x0, x1), y, Math.abs(x1 - x0) + 1, 1, c); }
  vline(x, y0, y1, c) { return this.fill(x, Math.min(y0, y1), 1, Math.abs(y1 - y0) + 1, c); }
  ellipse(cx, cy, rx, ry, c, only = null) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1 && (!only || only.includes(this.get(x, y)))) this.set(x, y, c);
    }
    return this;
  }
  // A patch of tall grass (wild encounters happen here). Only covers lawn.
  wildGrass(cx, cy, rx = 2.4, ry = 1.4) { return this.ellipse(cx, cy, rx, ry, '"', ['.', ',']); }
  // Keep an area clear of random scatter (pet homes, spawn points).
  reserve(cx, cy, r) {
    for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++) {
      if (this.inside(x, y) && Math.hypot(x - cx, y - cy) <= r) this.reserved[y][x] = true;
    }
    return this;
  }

  free(x, y, w = 1, h = 1) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (!this.inside(i, j) || this.occ[j][i]) return false;
    return true;
  }

  // Place an object with its footprint's top-left at tile x,y.
  // opts: v (variant), text (sign text), id, interact
  put(kind, x, y, opts = {}) {
    const def = OBJECTS[kind];
    if (!def) throw new Error(`Unknown object kind: ${kind}`);
    const [fw, fh] = def.foot;
    // Flat things (rugs, mats) and wall decorations can overlap other objects.
    const layered = def.flat || def.roof || def.deck || opts.onWall;
    if (!layered && !this.free(x, y, fw, fh)) return null;
    const o = { kind, x, y, w: fw, h: fh, v: opts.v ?? (Array.isArray(def.variants) ? def.variants[0] : ''), ...opts };
    this.objects.push(o);
    if (!layered) for (let j = y; j < y + fh; j++) for (let i = x; i < x + fw; i++) this.occ[j][i] = o;
    return o;
  }
  fenceH(x0, x1, y, style, gaps = []) { for (let x = x0; x <= x1; x++) if (!gaps.includes(x)) this.put('fence', x, y, { style }); return this; }
  fenceV(x, y0, y1, style, gaps = []) { for (let y = y0; y <= y1; y++) if (!gaps.includes(y)) this.put('fence', x, y, { style }); return this; }
  sign(x, y, text) { return this.put('sign', x, y, { text }); }

  // Trees around the edge, leaving gaps on paths/roads so exits stay open.
  border(variants = ['oak']) {
    for (let x = 0; x < this.w; x++) for (const y of [0, this.h - 1]) this.borderTree(x, y, variants);
    for (let y = 0; y < this.h; y++) for (const x of [0, this.w - 1]) this.borderTree(x, y, variants);
    return this;
  }
  borderTree(x, y, variants) {
    if (!GRASSY.includes(this.get(x, y))) return;
    this.put('tree', x, y, { v: variants[Math.floor(this.rand() * variants.length)] });
  }

  // Randomly sprinkle objects over grass inside an area.
  // kinds: [[kind, weight, variants?], ...]
  scatter([ax, ay, aw, ah], density, kinds, { clearance = 1, on = GRASSY } = {}) {
    const total = kinds.reduce((s, k) => s + k[1], 0);
    for (let y = ay; y < ay + ah; y++) for (let x = ax; x < ax + aw; x++) {
      if (this.rand() > density) continue;
      if (!on.includes(this.get(x, y)) || this.reserved[y]?.[x] || !this.free(x, y)) continue;
      if (this.nearBuilt(x, y, clearance)) continue;
      let roll = this.rand() * total, k = kinds[0];
      for (const kk of kinds) { roll -= kk[1]; if (roll <= 0) { k = kk; break; } }
      const [kind, , variants] = k;
      const [fw, fh] = OBJECTS[kind].foot;
      if (!this.free(x, y, fw, fh)) continue;
      this.put(kind, x, y, variants ? { v: variants[Math.floor(this.rand() * variants.length)] } : {});
    }
    return this;
  }
  nearBuilt(x, y, r) {
    for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) {
      const c = this.get(x + i, y + j), o = this.occ[y + j]?.[x + i];
      if (c && !GRASSY.includes(c) && c !== '=' ) return true;
      if (o && o.kind !== 'tree' && o.kind !== 'bush' && o.kind !== 'rock') return true;
    }
    return false;
  }

  // Gameplay markers
  // to = null makes a locked exit that shows `lines` instead.
  exit(x, y, w, h, to, entry, label, lines = null, extra = {}) { this.exits.push({ x, y, w, h, to, entry, label, lines, ...extra }); return this; }
  entry(name, x, y, dir = 'down') { this.entries[name] = { x, y, dir }; return this; }
  forage(x, y, items) { this.spawns.push({ x, y, items }); this.reserve(x, y, 0.5); return this; }
  npc(id, x, y, extra = {}) { this.npcs.push({ id, x, y, ...extra }); this.reserve(x, y, 1); return this; }
  lane(def) { this.lanes.push(def); return this; }
  ducks(cx, cy, rx, ry, n) { this.decor.push({ kind: 'duck', cx, cy, rx, ry, n }); return this; }
  magpies(points) { this.decor.push({ kind: 'magpie', points }); return this; }

  // Front-garden dressing: pot plants, garden beds, toys and bikes in the
  // lawn just in front of (and beside) houses, so streets look lived in.
  // Everything placed here is walk-through, so it never blocks a path.
  // Set b.noDress = true in a map to skip it.
  dress() {
    if (this.noDress) return;
    const grassy = (x, y) => '.,L'.includes(this.get(x, y) || '-') && this.free(x, y) && !this.reserved[y]?.[x];
    const pickOf = (list, r) => list[Math.floor(r * list.length) % list.length];
    const pots = ['succulent', 'fern', 'geranium', 'lavender', 'herbs'];
    for (const o of [...this.objects]) {
      if (!DRESS_KINDS.has(o.kind)) continue;
      const fy = o.y + o.h;
      for (let x = o.x - 1; x <= o.x + o.w; x++) {
        const r = hash(x * 7 + this.w, fy * 13 + o.x);
        if (!grassy(x, fy)) continue;
        if (r < 0.22) this.put('potplant', x, fy, { v: pickOf(pots, hash(x, fy)) });
        else if (r < 0.36 && grassy(x + 1, fy)) { this.put('flowerbed', x, fy, { v: pickOf(['mixed', 'roses', 'natives'], hash(fy, x)) }); x++; }
        else if (r < 0.40) this.put(pickOf(['gnome', 'birdbath', 'ball', 'trike', 'bike', 'hosereel'], hash(x + 3, fy)), x, fy, {});
      }
      // an aircon unit or meter box down one side
      const side = hash(o.x, o.y) > 0.5 ? o.x - 1 : o.x + o.w, sy = o.y + o.h - 1;
      if (grassy(side, sy) && hash(o.y, o.x) > 0.45) this.put(hash(side, sy) > 0.5 ? 'acunit' : 'meterbox', side, sy, {});
    }
  }

  finish() {
    this.dress();
    // Work out which way each fence joins up.
    for (const o of this.objects) if (o.kind === 'fence') {
      const n = (dx, dy) => this.occ[o.y + dy]?.[o.x + dx]?.kind === 'fence' ? 1 : 0;
      const mask = n(-1, 0) | n(1, 0) << 1 | n(0, -1) << 2 | n(0, 1) << 3;
      o.v = `${o.style || 'picket'}:${mask}`;
    }
    const solid = new Uint8Array(this.w * this.h);
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      const o = this.occ[y][x];
      if (SOLID_GROUND.includes(this.ground[y][x]) || (o && OBJECTS[o.kind].solid !== false)) solid[y * this.w + x] = 1;
    }
    return {
      id: this.id, w: this.w, h: this.h,
      ground: this.ground.map(r => r.join('')),
      objects: this.objects, solid,
      exits: this.exits, entries: this.entries, spawns: this.spawns, npcs: this.npcs, lanes: this.lanes, decor: this.decor,
    };
  }
}
