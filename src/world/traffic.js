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
    const key = pick(lane.kinds);
    const horiz = lane.axis === 'x';
    const start = (lane.dir > 0 ? lane.from : lane.to) * T;
    const pos = lane.pos * T;
    const s = this.scene.add.image(horiz ? start : pos, horiz ? pos : start, key);
    s.setOrigin(0.5, 0.5);
    if (horiz) s.setFlipX(lane.dir < 0); else s.setFlipY(lane.dir < 0);
    s.honked = false; s.stopped = 0;
    lane.list.push(s);
    const cam = this.scene.cameras.main.worldView;
    if (lane.tram && Phaser.Geom.Rectangle.Overlaps(cam, new Phaser.Geom.Rectangle(pos - 40, 0, 80, this.scene.map.h * T))) sfx.ding();
  }
  update(dt, player, frozen) {
    for (const lane of this.lanes) {
      lane.wait -= dt;
      if (lane.wait <= 0) { this.spawn(lane); lane.wait = lane.every[0] + Math.random() * (lane.every[1] - lane.every[0]); }
      const horiz = lane.axis === 'x';
      for (const s of lane.list) {
        const half = (horiz ? s.width : s.height) / 2;
        const along = horiz ? player.x - s.x : player.y - s.y;
        const across = Math.abs(horiz ? player.y - 4 - s.y : player.x - s.x);
        const blocking = !lane.under && !lane.sky && across < (horiz ? s.height : s.width) / 2 + 4 && along * lane.dir > 0 && along * lane.dir < half + 20;
        if (blocking || frozen) {
          s.stopped += dt;
          if (blocking && s.stopped > 1.5 && !s.honked && !lane.train && !lane.tram) { s.honked = true; sfx.honk(); }
          if (blocking && s.stopped > 1.2 && lane.tram && !s.honked) { s.honked = true; sfx.ding(); }
        } else {
          s.stopped = 0;
          const step = lane.speed * lane.dir * dt;
          if (horiz) s.x += step; else s.y += step;
        }
        s.setDepth(lane.sky ? 8700 : lane.under ? -995 : horiz ? s.y + s.height / 2 : s.y + half);
      }
      lane.list = lane.list.filter(s => {
        const p = horiz ? s.x : s.y;
        const done = lane.dir > 0 ? p > lane.to * T + 100 : p < lane.from * T - 100;
        if (done) s.destroy();
        return !done;
      });
    }
  }
}
