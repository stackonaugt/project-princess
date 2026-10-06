// Characters that walk around: the player, pets and townsfolk.
import { TILE as T, WALK_SPEED, RUN_SPEED, PET_SPEED } from '../config.js';
import { custom, fitScale, frameCount, playerTexture } from '../art/textures.js';
import { HEROES } from '../data/heroes.js';
import { state } from '../systems/state.js';
import { petTex } from '../systems/forms.js';
import { inWindow, isNight } from '../systems/clock.js';
import { sfx } from '../systems/sfx.js';

export const toWorld = (tx, ty) => ({ x: (tx + 0.5) * T, y: (ty + 0.75) * T });

// Base: a physics sprite standing on its feet, with a shadow, a tall-grass
// tuft and an optional emote bubble.
class Actor extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, tex, slot = 16) {
    const t = scene.textures.get(tex);
    super(scene, x, y, tex, t.has(0) ? 0 : undefined);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1);
    this.slot = slot;
    this.applyScale();
    this.shadow = scene.add.image(x, y, 'fx-shadow').setOrigin(0.5, 0.75);
    this.tuft = scene.add.image(x, y, scene.tuftKey).setOrigin(0.5, 1).setVisible(false);
    this.bubble = scene.add.image(x, y, 'fx-bubble-zzz').setOrigin(0.5, 1).setVisible(false);
    this.bob = 0;
  }
  applyScale() { this.setScale(fitScale(this.scene, this.texture.key, this.slot)); }
  // Physics body in world pixels, centred on the feet.
  fitBody(w, h) {
    const s = this.scaleX, fw = this.frame.realWidth, fh = this.frame.realHeight;
    this.body.setSize(w / s, h / s, false);
    this.body.setOffset(fw / 2 - w / (2 * s), fh - h / s);
  }
  emote(key, ms = 1600) {
    this.bubble.setTexture(key).setVisible(true);
    this.bubbleUntil = this.scene.time.now + ms;
  }
  syncExtras() {
    const top = this.y - this.displayHeight;
    this.setDepth(this.y);
    this.shadow.setPosition(this.x, this.y).setDepth(this.y - 0.5).setAlpha(this.alpha).setVisible(this.visible);
    const inGrass = this.scene.groundAt(this.x, this.y - 2) === '"';
    this.tuft.setVisible(inGrass && this.visible).setPosition(this.x, this.y + 1).setDepth(this.y + 0.5);
    if (this.bubble.visible && this.scene.time.now > (this.bubbleUntil || 0)) this.bubble.setVisible(false);
    this.bubble.setPosition(this.x, top - 1 + Math.sin(this.scene.time.now / 200)).setDepth(9500);
  }
  // Single-frame custom art gets a little hop instead of a walk cycle.
  setBob(moving, rate = 8) {
    const bob = moving && Math.floor(this.scene.time.now / 1000 * rate) % 2 ? 1 : 0;
    if (bob !== this.bob) { this.bob = bob; this.setOrigin(0.5, 1 + bob / this.frame.realHeight); }
  }
  destroy(fromScene) { this.shadow?.destroy(); this.tuft?.destroy(); this.bubble?.destroy(); super.destroy(fromScene); }
}

// ---------------------------------------------------------------- Player
export class Player extends Actor {
  constructor(scene, x, y, dir = 'down') {
    super(scene, x, y, playerTexture(state.data.hero || 'helen', 'down')[0], 32);
    this.fitBody(8, 5);
    this.dir = dir; this.moving = false;
    this.target = null;   // tap-to-walk destination
    this.stuck = 0;
    this.setDir(dir);
  }
  texFor(dir) { return playerTexture(state.data.hero || 'helen', dir); }
  refreshLook() { const d = this.dir; this.dir = null; this.setTexture(this.texFor(d)[0], 0); this.setDir(d); }
  setDir(dir) {
    this.dir = dir;
    const [tex, flip] = this.texFor(dir);
    if (this.texture.key !== tex) { this.setTexture(tex, this.scene.textures.get(tex).has(0) ? 0 : undefined); this.applyScale(); this.fitBody(8, 5); }
    this.setFlipX(flip);
  }
  facing() { return { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] }[this.dir]; }

  update(input, blocked) {
    let { x, y, run, analog } = input;
    if (blocked) { x = 0; y = 0; this.target = null; }
    if (!x && !y && this.target) {
      const dx = this.target.x - this.x, dy = this.target.y - this.y, d = Math.hypot(dx, dy);
      if (d < 3) this.target = null; else { x = dx / d; y = dy / d; analog = 1; run = d > 80; }
    } else if (x || y) this.target = null;
    this.moving = !!(x || y);
    const boost = run ? (HEROES[state.data.hero]?.perk.runBoost || 1) : 1;
    const speed = (run ? RUN_SPEED * boost : WALK_SPEED) * (analog ?? 1);
    this.setVelocity(x * speed, y * speed);
    if (this.moving) {
      const dir = Math.abs(x) > Math.abs(y) ? (x > 0 ? 'right' : 'left') : (y > 0 ? 'down' : 'up');
      this.setDir(dir);
      const anim = `${this.texture.key}-walk`;
      if (this.scene.anims.exists(anim)) { this.anims.play(anim, true); this.anims.timeScale = run ? 1.6 : 1; } else this.setBob(true);
      // Give up on a tap target if we're walking into a wall.
      if (this.target && this.body.blocked.none === false) { this.stuck += 1; if (this.stuck > 20) { this.target = null; this.stuck = 0; } } else this.stuck = 0;
      state.data.stats.steps += 1;
    } else {
      this.anims.stop();
      const t = this.scene.textures.get(this.texture.key);
      if (t.has(0)) this.setFrame(0);
      this.setBob(false);
    }
    this.syncExtras();
  }
}

// ---------------------------------------------------------------- Pets
// mode: 'wild' (in its own patch), 'home' (relaxing at your place) or
// 'follow' (on your team, trailing behind you).
export class Pet extends Actor {
  constructor(scene, data, { mode = 'wild', index = 0, near = null } = {}) {
    const spot = mode === 'home' ? [data.homeSpot.x, data.homeSpot.y] : data.home;
    let home = toWorld(spot[0], spot[1]);
    if (mode === 'follow' && near) home = { x: near.x - 10 - index * 8, y: near.y + 4 + index * 4 };
    super(scene, home.x, home.y, petTex(data.id));
    this.data_ = data; this.id = data.id;
    this.mode = mode; this.index = index;
    this.range = mode === 'home' ? 1.5 : data.range;
    this.home = home;
    this.fitBody(8, 5);
    this.state_ = 'idle'; this.timer = 0.5 + Math.random() * 2; this.target = null;
    this.speedMul = 1; this.patrolIndex = 0; this.cool = 0; this.alertedDay = 0;
    this.phaseT = 4 + Math.random() * 4;
    this.setInteractive({ useHandCursor: true });
  }
  get asleep() { return this.mode !== 'follow' && inWindow(state.data.minutes, this.data_.sleeps); }

  pause(sec) { this.state_ = 'idle'; this.timer = sec; this.target = null; this.setVelocity(0, 0); }
  refreshForm() { this.anims.stop(); this.setTexture(petTex(this.id), 0); this.applyScale(); }
  facePoint(x) { this.setFlipX(x < this.x); }

  randomPointNearHome(range) {
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * Math.PI * 2, d = Math.random() * range * T;
      const x = this.home.x + Math.cos(a) * d, y = this.home.y + Math.sin(a) * d;
      if (!this.scene.solidAt(x, y)) return { x, y };
    }
    return { ...this.home };
  }
  walkTo(p, speedMul = 1, maxTime = 5) { this.target = p; this.speedMul = speedMul; this.state_ = 'walk'; this.timer = this.lastTimer = maxTime; }

  think(player, dt) {
    const d = this.data_, hearts = state.hearts(this.id);
    if (this.mode === 'home') return this.walkTo(this.randomPointNearHome(this.range), 0.8);
    const dist = Math.hypot(player.x - this.x, player.y - this.y);
    const night = isNight(state.data.minutes);
    this.cool -= dt;

    if (d.behaviour === 'stalk' && dist < 76 && dist > 22 && this.cool <= 0) {
      const a = Math.atan2(this.y - player.y, this.x - player.x);
      return this.walkTo({ x: player.x + Math.cos(a) * 18, y: player.y + Math.sin(a) * 14 }, hearts >= 6 ? 1.4 : 1.1, 1.2);
    }
    if (d.behaviour === 'aloof') {
      if (hearts < 3 && dist < 34 && this.cool <= 0) {
        const a = Math.atan2(this.y - player.y, this.x - player.x);
        if (Math.random() < 0.3) this.emote('fx-bubble-dots', 1200);
        return this.walkTo({ x: this.x + Math.cos(a) * 28, y: this.y + Math.sin(a) * 28 }, 0.8, 1.5);
      }
      if (hearts >= 6 && dist < 70 && dist > 24) return this.walkTo({ x: player.x, y: player.y + 10 }, 0.9, 1.5);
    }
    if (d.behaviour === 'zoomies' && dist < 60 && dist > 16 && this.cool <= 0 && Math.random() < 0.6) {
      this.cool = 7;
      this.emote('fx-bubble-alert', 800);
      this.charging = true;
      return this.walkTo({ x: player.x, y: player.y }, 2.6, 2);
    }
    if (d.behaviour === 'patrol') {
      if (dist < 48 && this.alertedDay !== state.data.day && !state.isFound(this.id)) {
        this.alertedDay = state.data.day; this.emote('fx-bubble-alert', 1500); sfx.yap(); this.facePoint(player.x);
        return this.pause(1.5);
      }
      const p = d.patrol[this.patrolIndex++ % d.patrol.length];
      return this.walkTo(toWorld(p[0], p[1]), 1, 8);
    }
    if (d.behaviour === 'zoomies' && Math.random() < 0.3) return this.walkTo(this.randomPointNearHome(this.range * 1.4), 2.4, 3);
    const range = d.behaviour === 'stalk' && night ? this.range * 1.8 : this.range;
    this.walkTo(this.randomPointNearHome(range), d.behaviour === 'phase' && night ? 1.3 : 1);
  }

  // Team pets trot along a breadcrumb trail behind you.
  follow(player, dt, frozen) {
    const trail = this.scene.trail, gap = 7 * (this.index + 1);
    const t = trail.length > gap ? trail[trail.length - 1 - gap] : { x: player.x - 12, y: player.y + 4 };
    const dx = t.x - this.x, dy = t.y - this.y, d = Math.hypot(dx, dy);
    if (d > 160) { this.setPosition(t.x, t.y); this.body.reset(t.x, t.y); }
    const moving = !frozen && d > 4;
    if (moving) {
      const sp = Math.min(150, Math.max(30, d * 4));
      this.setVelocity(dx / d * sp, dy / d * sp);
      if (Math.abs(dx) > 0.5) this.setFlipX(dx < 0);
    } else this.setVelocity(0, 0);
    const anim = `${this.texture.key}-walk`;
    if (moving && this.scene.anims.exists(anim)) { this.anims.play(anim, true); this.anims.timeScale = d > 30 ? 1.6 : 1; }
    else { this.anims.stop(); if (this.scene.textures.get(this.texture.key).has(0)) this.setFrame(0); }
    if (!this.scene.anims.exists(anim)) this.setBob(moving, 8);
    if (this.data_.behaviour === 'phase') this.setAlpha(isNight(state.data.minutes) ? 1 : 0.85);
    this.syncExtras();
  }

  update(player, dt, frozen) {
    const d = this.data_;
    if (this.mode === 'follow') return this.follow(player, dt, frozen);
    if (frozen || this.asleep) {
      this.setVelocity(0, 0); this.anims.stop(); this.setBob(false);
      if (this.asleep && !frozen && !this.bubble.visible && Math.random() < 0.01) this.emote('fx-bubble-zzz', 2200);
      this.phaseAlpha(dt, frozen);
      this.syncExtras();
      return;
    }
    this.timer -= dt;
    if (this.state_ === 'idle' && this.timer <= 0) this.think(player, dt);
    if (this.state_ === 'walk') {
      const dx = this.target.x - this.x, dy = this.target.y - this.y, dist = Math.hypot(dx, dy);
      const blocked = !this.body.blocked.none && this.timer < this.lastTimer - 0.4;
      if (dist < 2 || this.timer <= 0 || blocked) {
        if (this.charging && Math.hypot(player.x - this.x, player.y - this.y) < 22) this.bounce();
        this.charging = false;
        this.pause(d.behaviour === 'stalk' ? 0.4 + Math.random() : 1 + Math.random() * 2.5);
      } else {
        const sp = PET_SPEED * this.speedMul;
        this.setVelocity(dx / dist * sp, dy / dist * sp);
        if (Math.abs(dx) > 0.5) this.setFlipX(dx < 0);
        if (this.body.blocked.none) this.lastTimer = this.timer;
      }
    }
    const moving = this.state_ === 'walk';
    const anim = `${this.texture.key}-walk`;
    if (moving && this.scene.anims.exists(anim)) { this.anims.play(anim, true); this.anims.timeScale = this.speedMul; }
    else { this.anims.stop(); if (this.scene.textures.get(this.texture.key).has(0)) this.setFrame(0); }
    if (!this.scene.anims.exists(anim)) this.setBob(moving, 6 * this.speedMul);
    this.phaseAlpha(dt, false);
    this.syncExtras();
  }

  // Poppy: charge, bonk, delight.
  bounce() {
    sfx.bump();
    this.emote('fx-bubble-heart', 1200);
    this.scene.tweens.add({ targets: this, y: this.y - 5, duration: 120, yoyo: true, ease: 'Quad.easeOut' });
    this.scene.cameras.main.shake(120, 0.004);
  }

  // Spooky: flickers and teleports, more solid at night.
  phaseAlpha(dt, frozen) {
    if (this.data_.behaviour !== 'phase') return;
    const night = isNight(state.data.minutes);
    if (frozen) { this.setAlpha(night ? 1 : 0.85); return; }
    this.phaseT -= dt;
    const base = night ? 1 : 0.75;
    if (this.phaseT < 0.6 && this.phaseT > 0) this.setAlpha(base * Math.abs(Math.cos(this.phaseT * 14)));
    else this.setAlpha(base);
    if (this.phaseT <= 0) {
      const p = this.randomPointNearHome(this.range);
      this.setPosition(p.x, p.y); this.body.reset(p.x, p.y);
      this.phaseT = night ? 12 + Math.random() * 8 : 5 + Math.random() * 5;
      this.pause(1 + Math.random() * 2);
    }
  }
}

// ---------------------------------------------------------------- People
export class Npc extends Actor {
  constructor(scene, id, info, spot) {
    const pos = toWorld(spot.x, spot.y);
    const tex = custom.has(`npc-${id}`) ? `npc-${id}` : `npc-${id}-down`;
    super(scene, pos.x, pos.y, tex, 32);
    this.id = id; this.info = info; this.spot = spot;
    this.customArt = custom.has(`npc-${id}`);
    this.fitBody(10, 6);
    this.body.setImmovable(true);
    this.path = spot.path ? spot.path.map(([x, y]) => toWorld(x, y)) : null;
    this.pathIndex = 0; this.speed = spot.speed || 34; this.wait = 0;
    this.setDir(spot.face || 'down');
    // People standing about outdoors potter a few steps around their spot
    // now and then (shopkeepers at counters and `still` spots stay put).
    this.home = pos;
    this.idle = !this.path && !spot.counter && !spot.still && !scene.region?.indoor ? 2 + Math.random() * 6 : null;
    this.goal = null;
    this.setInteractive({ useHandCursor: true });
  }
  setDir(dir) {
    this.dir = dir;
    if (this.customArt) { this.setFlipX(dir === 'left'); return; }
    const tex = dir === 'right' ? `npc-${this.id}-left` : `npc-${this.id}-${dir}`;
    if (this.texture.key !== tex) this.setTexture(tex, 0);
    this.setFlipX(dir === 'right');
  }
  faceTowards(x, y) {
    const dx = x - this.x, dy = y - this.y;
    this.setDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  }
  pause(sec) { this.wait = sec; this.setVelocity(0, 0); }
  potter(player, dt) {
    if (!this.goal) {
      this.setVelocity(0, 0);
      if ((this.idle -= dt) > 0) return false;
      this.idle = 3 + Math.random() * 7;
      const away = Math.hypot(this.x - this.home.x, this.y - this.home.y) > 4;
      if (away) this.goal = { x: this.home.x, y: this.home.y, back: true };
      else {
        // One to two steps in a straight line, only over open ground
        const [dx, dy] = [[1, 0], [-1, 0], [0, 1], [0, -1]][Math.floor(Math.random() * 4)];
        const n = 1 + Math.floor(Math.random() * 2);
        for (let i = 1; i <= n; i++) if (this.scene.solidAt(this.home.x + dx * 16 * i, this.home.y - 4 + dy * 16 * i)) return false;
        this.goal = { x: this.home.x + dx * 16 * n, y: this.home.y + dy * 16 * n };
      }
    }
    const dx = this.goal.x - this.x, dy = this.goal.y - this.y, d = Math.hypot(dx, dy);
    const ahead = d > 0 && Math.hypot(player.x - (this.x + dx / d * 12), player.y - (this.y + dy / d * 12)) < 12;
    if (d < 2 || ahead) {
      if (d < 2) { this.body.reset(this.goal.x, this.goal.y); if (this.goal.back) this.setDir(this.spot.face || 'down'); }
      this.goal = null; this.setVelocity(0, 0); return false;
    }
    const sp = 22;
    this.setVelocity(dx / d * sp, dy / d * sp);
    this.setDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
    return true;
  }
  update(player, dt, frozen) {
    let moving = false;
    this.wait -= dt;
    if (this.path && !frozen && this.wait <= 0) {
      const t = this.path[this.pathIndex];
      const dx = t.x - this.x, dy = t.y - this.y, d = Math.hypot(dx, dy);
      const ahead = Math.hypot(player.x - (this.x + dx / d * 12), player.y - (this.y + dy / d * 12)) < 12;
      if (d < 2 && this.spot.leave && this.pathIndex === this.path.length - 1) { this.setVelocity(0, 0); this.scene.npcLeft(this); return; }
      if (d < 2) { this.pathIndex = (this.pathIndex + 1) % this.path.length; if (!this.spot.speed && !this.spot.leave) this.wait = 0.5 + Math.random() * 1.5; }
      else if (ahead) this.setVelocity(0, 0);
      else {
        this.setVelocity(dx / d * this.speed, dy / d * this.speed);
        this.setDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
        moving = true;
      }
    } else if (this.idle !== null && !frozen && this.wait <= 0) moving = this.potter(player, dt);
    else this.setVelocity(0, 0);
    const anim = this.customArt ? `npc-${this.id}-walk` : `${this.texture.key}-walk`;
    if (moving && this.scene.anims.exists(anim)) { this.anims.play(anim, true); this.anims.timeScale = this.speed > 40 ? 1.5 : 1; }
    else { this.anims.stop(); if (this.scene.textures.get(this.texture.key).has(0)) this.setFrame(0); }
    if (this.customArt && frameCount(this.scene, this.texture.key) < 2) this.setBob(moving);
    this.syncExtras();
  }
}
