// Pure, bounded local routing. Coordinates are sprite feet, not body centres.
export class LocalRouter {
  constructor(map, tile = 16) { this.map = map; this.tile = tile; }
  clear(x, y) {
    const { w, h, solid } = this.map, t = this.tile;
    if (x < 4 || y < 5 || x + 4 > w * t || y > h * t) return false;
    for (let j = Math.floor((y - 5 + 0.01) / t); j <= Math.floor((y - 0.01) / t); j++)
      for (let i = Math.floor((x - 4 + 0.01) / t); i <= Math.floor((x + 4 - 0.01) / t); i++)
        if (solid[j * w + i]) return false;
    return true;
  }
  point(i) { return { x: (i % this.map.w + 0.5) * this.tile, y: (Math.floor(i / this.map.w) + 0.75) * this.tile }; }
  segment(a, b) {
    const n = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 2);
    for (let k = 0; k <= n; k++) if (!this.clear(a.x + (b.x - a.x) * k / (n || 1), a.y + (b.y - a.y) * k / (n || 1))) return false;
    return true;
  }
  route(start, goal, radius = 0) {
    if (!radius && !this.clear(goal.x, goal.y)) return { status: 'unreachable', points: [] };
    const { w, h } = this.map, size = w * h;
    if (size > 120000) return { status: 'too-large', points: [] };
    const parents = new Int32Array(size).fill(-2), queue = new Int32Array(size);
    // Connect the actual starting footprint to a nearby grid point, never through a corner.
    const sx = Math.floor(start.x / this.tile), sy = Math.floor(start.y / this.tile);
    let root = -1, best = Infinity;
    for (let y = sy - 1; y <= sy + 1; y++) for (let x = sx - 1; x <= sx + 1; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const i = y * w + x, p = this.point(i), d = Math.hypot(p.x - start.x, p.y - start.y);
      if (d < best && this.segment(start, p)) { best = d; root = i; }
    }
    if (root < 0) return { status: 'unreachable', points: [] };
    let head = 0, tail = 1, end = -1; queue[0] = root; parents[root] = -1;
    while (head < tail) {
      const i = queue[head++], p = this.point(i);
      if (typeof radius === 'function' ? radius(p) : radius ? Math.hypot(p.x - goal.x, p.y - goal.y) <= radius : Math.hypot(p.x - goal.x, p.y - goal.y) <= this.tile && this.segment(p, goal)) { end = i; break; }
      const x = i % w, y = Math.floor(i / w);
      for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
        const nx = x + dx, ny = y + dy, ni = ny * w + nx;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h || parents[ni] !== -2) continue;
        if (!this.segment(p, this.point(ni))) continue;
        parents[ni] = i; queue[tail++] = ni;
      }
    }
    if (end < 0) return { status: 'unreachable', points: [] };
    const points = [];
    for (let i = end; i >= 0; i = parents[i]) points.push(this.point(i));
    points.reverse();
    if (!radius) points.push({ ...goal });
    return { status: 'ok', points, visited: head };
  }
}

// One route, one interaction, at most two moving-target/stall replans.
export class AutoWalk {
  constructor(router, player, feedback) { Object.assign(this, { router, player, feedback }); this.cancel(); }
  cancel() { this.points = []; this.target = null; this.player.target = null; this.player.setVelocity?.(0, 0); this.age = 0; this.idle = 0; this.retries = 0; }
  start(goal, target = null, radius = 0) {
    this.cancel();
    const result = this.router.route(this.player, goal, radius);
    if (result.status !== 'ok') { this.feedback('No reachable walking route. Try another spot.'); return false; }
    Object.assign(this, { points: result.points, goal, target, radius, last: { x: this.player.x, y: this.player.y } });
    return true;
  }
  update(dt, interact) {
    if (!this.points.length) return;
    this.age += dt;
    if (this.target?.ref && (!this.target.ref.active || this.target.ref.gone || !this.target.ref.visible)) {
      this.cancel(); this.feedback('They have left. Check the map for their current location.'); return;
    }
    const p = this.player;
    if (this.target) {
      const t = this.target.ref || this.target;
      if (Math.hypot(t.x - p.x, t.y - p.y) <= this.radius + 1) { const target = this.target; this.cancel(); interact(target); return; }
    }
    while (this.points.length && Math.hypot(this.points[0].x - p.x, this.points[0].y - p.y) < 1.5) this.points.shift();
    const moved = Math.hypot(p.x - this.last.x, p.y - this.last.y);
    this.idle = moved > 0.2 ? 0 : this.idle + dt; this.last = { x: p.x, y: p.y };
    if (!this.points.length || this.idle > 0.8) {
      if (!this.target && !this.points.length) { this.cancel(); return; }
      if (this.retries >= 2 || this.age > 35) { this.cancel(); this.feedback('Walking stopped. Tap again when the way is clear.'); return; }
      const t = this.target?.ref || this.target || this.goal;
      const result = this.router.route(p, t, this.radius);
      this.retries++; this.idle = 0;
      if (result.status !== 'ok') { this.cancel(); this.feedback('That interaction cannot be reached from here.'); return; }
      this.points = result.points;
    }
    if (this.age > 90) { this.cancel(); this.feedback('Walking stopped. Choose a nearer destination.'); return; }
    p.target = this.points[0];
  }
}
