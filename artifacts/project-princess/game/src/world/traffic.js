// Cars, trams, bikes and trains that pass by. They are scenery: they never
// hit you, and they politely wait if you're standing in their way.
import { TILE as T } from '../config.js';
import { sfx } from '../systems/sfx.js';
import { pick } from '../util.js';

export class Traffic {
  constructor(scene, lanes) {
    this.scene = scene;
    this.lanes = lanes.map(l => ({ ...l, wait: 1 + Math.random() * l.every[1] * 0.6, list: [] }));
  }
  spawn(lane) {
    if (lane.kinds.every(k => k.startsWith('veh-bike'))) lane.bike = true;
    const key = pick(lane.kinds);
    const horiz = lane.axis === 'x';
    const start = (lane.dir > 0 ? lane.from : lane.to) * T;
    const pos = lane.pos * T;
    const s = this.scene.add.image(horiz ? start : pos, horiz ? pos : start, key);
    // Side-on cars sit with their wheels on the bottom of their lane, not
    // centred on it, so the near lane never spills onto the footpath.
    if (horiz && !lane.tram && !lane.train) s.y = pos + T / 2 - 1 - s.height / 2;
    s.setOrigin(0.5, 0.5);
    if (horiz) s.setFlipX(lane.dir < 0); else s.setFlipY(lane.dir < 0);
    s.honked = false; s.stopped = 0;
    lane.list.push(s);
    const cam = this.scene.cameras.main.worldView;
    if (lane.tram && Phaser.Geom.Rectangle.Overlaps(cam, new Phaser.Geom.Rectangle(pos - 40, 0, 80, this.scene.map.h * T))) sfx.ding();
  }
  update(dt, player, frozen, others = []) {
    for (const lane of this.lanes) {
      lane.wait -= dt;
      if (lane.wait <= 0) {
        if (lane.list.length < (lane.tram || lane.train ? 2 : 1)) this.spawn(lane);
        lane.wait = (lane.every[0] + Math.random() * (lane.every[1] - lane.every[0])) * (lane.tram || lane.train || lane.bike ? 1 : 1.8);
      }
      const horiz = lane.axis === 'x';
      for (const s of lane.list) {
        const half = (horiz ? s.width : s.height) / 2;
        const inWay = q => {
          const along = horiz ? q.x - s.x : q.y - s.y;
          const across = Math.abs(horiz ? q.y - 4 - s.y : q.x - s.x);
          return across < (horiz ? s.height : s.width) / 2 + 4 && along * lane.dir > 0 && along * lane.dir < half + 20;
        };
        const blocking = !lane.under && !lane.sky && (inWay(player) || (!lane.train && others.some(inWay)));   // passers-by crossing hold up cars too
        if (blocking || frozen) {
          s.stopped += dt;
          if (blocking && lane.bike) { s.bell = (s.bell ?? 0.3) - dt; if (s.bell <= 0) { s.bell = 1.1; sfx.bell(); } }   // ring ring, until you move
          else if (blocking && s.stopped > 1.5 && !s.honked && !lane.train && !lane.tram) { s.honked = true; sfx.honk(); }
          if (blocking && s.stopped > 1.2 && lane.tram && !s.honked) { s.honked = true; sfx.ding(); }
        } else {
          s.stopped = 0;
          const step = lane.speed * lane.dir * dt;
          if (horiz) s.x += step; else s.y += step;
        }
        if (lane.bike) {   // bikes stay on their path: fade in and out over its last tile instead of riding through walls
          const p = horiz ? s.x : s.y, edge = Math.min(p - lane.from * T, lane.to * T - p);
          s.setAlpha(Math.max(0, Math.min(1, edge / T)));
        }
        s.setDepth(lane.sky ? 8700 : lane.under ? -995 : horiz ? s.y + s.height / 2 : s.y + half);
      }
      lane.list = lane.list.filter(s => {
        const p = horiz ? s.x : s.y;
        const m = lane.bike ? 0 : 100;
        const done = lane.dir > 0 ? p > lane.to * T + m : p < lane.from * T - m;
        if (done) s.destroy();
        return !done;
      });
    }
  }
}
