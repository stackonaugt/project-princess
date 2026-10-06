// The crowd: unnamed passers-by (looks and lines in data/crowd.js). Outdoors
// they walk in from one exit and out another (sometimes through a shop door,
// which is them popping into the shop), stop to look in shop windows, and wait
// by the myki reader or tram stop. Inside shops they browse and leave. Paths
// are found over the map's solid grid, keeping to footpaths and crossing roads
// only where they have to. No menu, no gifts: talking gets one line.
import { Actor } from './entities.js';
import { TILE as T } from '../config.js';
import { CROWD, CROWD_LINES } from '../data/crowd.js';
import { NPCS } from '../data/npcs.js';
import { state } from '../systems/state.js';

const COST = { '#': 14, '+': 14, P: 3, '"': 3, h: 2 };      // roads are a last resort
const BROWSE = 'fckbu=pqQKon';                                  // ground you'd stand on to look in a window
// How many people are about by day in each outdoor zone. Quiet residential
// streets have nobody, shopping strips and the city are busy. Unlisted: 2.
const BUSY = {
  allen: 0, woods: 0, loddon: 0, glasgow: 0, holmes: 0, moreland: 0, murray: 0,
  lohse: 1, donald: 1, hope: 1, civic: 1, track: 1, lake: 1, lakepark: 1, wetlands: 1, coburglake: 1, fleming: 1, bowls: 1,
  station: 2, brunswick: 3, reservoir: 3, prestonhigh: 3, coburgmall: 4, coburg: 3, preston: 3, ebnicholson: 2, nicholson: 2, altona: 3, flemington: 2,
  sydney: 5, albion: 4, coburgsyd: 5, prestonmkt: 6, summerhill: 5, eblygon: 4, footscray: 5, gardens: 4,
  lygon: 6, bourke: 7, swanston: 8, laneways: 6, flinders: 9,
};
// What you call them when you talk to them
export const CROWD_NAME = { street: 'Local', station: 'Commuter', shop: 'Shopper' };

class Walker extends Actor {
  constructor(scene, look, x, y) {
    super(scene, x, y, `npc-${look.id}-down`, 32);
    this.lookId = look.id;
    this.fitBody(8, 5);
    this.route = []; this.wait = 0; this.speed = 26 + Math.random() * 12;
    this.setDir('down');
  }
  setDir(dir) {
    this.dir = dir;
    const tex = dir === 'right' ? `npc-${this.lookId}-left` : `npc-${this.lookId}-${dir}`;
    if (this.texture.key !== tex) this.setTexture(tex, 0);
    this.setFlipX(dir === 'right');
  }
  faceTowards(x, y) {
    const dx = x - this.x, dy = y - this.y;
    this.setDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  }
  update(player, dt, frozen) {
    let moving = false;
    this.wait -= dt;
    if (!frozen && this.wait <= 0 && !this.fading) {
      const t = this.route[0];
      if (!t) { this.done?.(this); this.done = null; }
      else {
        const dx = t.x - this.x, dy = t.y - this.y, d = Math.hypot(dx, dy);
        if (d < 1.5) {
          this.route.shift();
          if (t.pause) { this.wait = t.pause; this.setDir(t.face || 'up'); }
        } else if (Math.hypot(player.x - (this.x + dx / d * 12), player.y - (this.y + dy / d * 12)) < 11) this.wait = 0.4;   // you're in the way
        else {
          const s = Math.min(this.speed, d / dt);
          this.setVelocity(dx / d * s, dy / d * s);
          this.setDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
          moving = true;
        }
      }
    }
    if (!moving) this.setVelocity(0, 0);
    const anim = `${this.texture.key}-walk`;
    if (moving && this.scene.anims.exists(anim)) this.anims.play(anim, true);
    else { this.anims.stop(); this.setFrame(0); }
    this.syncExtras();
  }
}

export class Crowd {
  constructor(scene) {
    this.scene = scene; this.list = [];
    const z = scene.region, m = scene.map;
    if (z.home) return;
    this.w = m.w; this.h = m.h; this.ground = m.ground; this.solid = m.solid;
    const open = (x, y) => x >= 0 && y >= 0 && x < m.w && y < m.h && !m.solid[y * m.w + x];
    // Ways in and out: every exit with an open tile
    this.portals = [];
    for (const e of m.exits) {
      if (!e.to || e.team || e.lines) continue;
      const tiles = [];
      for (let y = e.y; y < e.y + e.h; y++) for (let x = e.x; x < e.x + e.w; x++) if (open(x, y)) tiles.push([x, y]);
      if (tiles.length) this.portals.push(tiles);
    }
    if (!this.portals.length) return;
    // Spots to wait: in front of the myki reader or tram stop
    this.waits = m.objects.filter(o => o.kind === 'tramstop' || (o.kind === 'myki' && o.travel))
      .map(o => [[o.x, o.y + o.h], [o.x + 1, o.y + o.h], [o.x - 1, o.y + o.h]].filter(([x, y]) => open(x, y) && !'#+xzPr'.includes(m.ground[y][x]))).filter(a => a.length);
    // Shopfronts to look into: footpath with a wall or building right above
    this.windows = [];
    if (!z.indoor) for (let y = 1; y < m.h; y++) for (let x = 0; x < m.w; x++) if (open(x, y) && !open(x, y - 1) && BROWSE.includes(m.ground[y][x])) this.windows.push([x, y]);
    this.floor = [];
    if (z.indoor) for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) if (open(x, y) && m.ground[y][x] !== 'D') this.floor.push([x, y]);
    const shop = m.npcs.some(n => NPCS[n.id]?.shop);
    if (z.indoor && !shop) return;
    let n = z.indoor ? 1 + (this.floor.length > 200 ? 1 : 0) : BUSY[m.id] ?? 2;
    if (!n) return;
    const t = state.data.minutes;
    if (t >= 21 * 60) n = Math.ceil(n / 2);
    if (t >= 24 * 60) n = Math.min(n, 1);
    this.target = n;
    this.lineSet = z.indoor ? 'shop' : this.waits.length ? 'station' : 'street';
    for (let i = 0; i < n; i++) this.spawn(true);
  }

  // A route from a random way in, through a stop or two, to a random way out.
  plan() {
    const R = a => a[Math.floor(Math.random() * a.length)];
    const from = R(R(this.portals));
    const stops = [];
    if (this.scene.region.indoor) {
      for (let i = 0, k = 2 + Math.floor(Math.random() * 2); i < k && this.floor.length; i++) stops.push({ at: R(this.floor), pause: 2 + Math.random() * 4, face: R(['up', 'up', 'left', 'right']) });
    } else {
      const waiting = this.list.filter(w => w.waiting).length;
      if (this.waits.length && waiting < 2 && Math.random() < 0.5) stops.push({ at: R(R(this.waits)), pause: 20 + Math.random() * 40, face: 'down', wait: true });
      else if (this.windows.length && Math.random() < 0.45) stops.push({ at: R(this.windows), pause: 2 + Math.random() * 5, face: 'up' });
    }
    const to = this.scene.region.indoor ? from : R(R(this.portals.length > 1 ? this.portals.filter(p => !p.some(([x, y]) => x === from[0] && y === from[1])) : this.portals));
    const pts = [from, ...stops.map(s => s.at), to];
    const route = [];
    let waiting = false;
    for (let i = 1; i < pts.length; i++) {
      const leg = this.path(pts[i - 1], pts[i]);
      if (!leg) return null;
      route.push(...leg);
      const s = stops[i - 1];
      if (s && route.length) { route[route.length - 1] = { ...route[route.length - 1], pause: s.pause, face: s.face }; if (s.wait) waiting = true; }
    }
    return { from, route, waiting };
  }

  spawn(midway = false) {
    if (this.list.length >= this.target) return;
    const p = this.plan();
    if (!p || p.route.length < 2) return;
    const look = CROWD[Math.floor(Math.random() * CROWD.length)];
    let start = { x: (p.from[0] + 0.5) * T, y: (p.from[1] + 0.75) * T };
    if (midway) { const k = Math.floor(Math.random() * (p.route.length - 1)); start = p.route[k]; p.route = p.route.slice(k + 1); }
    const w = new Walker(this.scene, look, start.x, start.y);
    w.route = p.route; w.waiting = p.waiting;
    w.setAlpha(0); this.scene.tweens.add({ targets: w, alpha: 1, duration: 400 });
    w.done = () => this.leave(w);
    this.list.push(w);
  }

  leave(w) {
    w.fading = true;
    this.scene.tweens.add({ targets: w, alpha: 0, duration: 400, onComplete: () => {
      this.list = this.list.filter(x => x !== w); w.destroy();
      this.scene.time.delayedCall(2000 + Math.random() * 12000, () => this.spawn());
    } });
  }

  // Cheapest path over open tiles (Dijkstra, roads cost more), as world points
  // at the turns.
  path([sx, sy], [tx, ty]) {
    const W = this.w, H = this.h, N = W * H, dist = new Float32Array(N).fill(Infinity), prev = new Int32Array(N).fill(-1);
    const heap = [], push = (d, i) => { heap.push([d, i]); let k = heap.length - 1; while (k) { const q = (k - 1) >> 1; if (heap[q][0] <= heap[k][0]) break; [heap[q], heap[k]] = [heap[k], heap[q]]; k = q; } };
    const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let k = 0; for (;;) { const l = 2 * k + 1, r = l + 1; let m = k; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === k) break; [heap[m], heap[k]] = [heap[k], heap[m]]; k = m; } } return top; };
    const s = sy * W + sx, t = ty * W + tx;
    dist[s] = 0; push(0, s);
    while (heap.length) {
      const [d, i] = pop();
      if (i === t) break;
      if (d > dist[i]) continue;
      const x = i % W, y = (i / W) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const j = ny * W + nx;
        if (this.solid[j]) continue;
        const nd = d + (COST[this.ground[ny][nx]] || 1);
        if (nd < dist[j]) { dist[j] = nd; prev[j] = i; push(nd, j); }
      }
    }
    if (dist[t] === Infinity) return null;
    const tiles = [];
    for (let i = t; i !== -1; i = prev[i]) tiles.push(i);
    tiles.reverse();
    const out = [];
    for (let k = 1; k < tiles.length; k++) {
      const a = tiles[k - 1], b = tiles[k], c = tiles[k + 1];
      if (c !== undefined && b - a === c - b) continue;   // straight on: skip
      out.push({ x: (b % W + 0.5) * T, y: (((b / W) | 0) + 0.75) * T });
    }
    return out;
  }

  update(player, dt, frozen) { for (const w of this.list) w.update(player, dt, frozen); }
  candidates() { return this.list.filter(w => !w.fading && w.alpha > 0.5).map(w => ({ kind: 'crowd', ref: w, x: w.x, y: w.y - 4, bubble: 'fx-bubble-talk' })); }
  name() { return CROWD_NAME[this.lineSet] || 'Local'; }
  line() { const a = CROWD_LINES[this.lineSet] || CROWD_LINES.street; return a[Math.floor(Math.random() * a.length)]; }
}
