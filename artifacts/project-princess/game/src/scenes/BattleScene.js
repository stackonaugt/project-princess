// Battles. Launched over the paused World scene; draws the backdrop, the
// fighters and the animations. Menus and text are HTML (src/ui/battle.js),
// the rules live in src/systems/battle.js.
//
// Start one with scene.launch('Battle', { wild: { id, level } } or
// { trainer: npcId }, plus suburb and done(result)). result.outcome is
// 'win' | 'lose' | 'run' | 'forfeit'; result.kod lists pets that ran home.

import { TYPES } from '../data/types.js';
import { petSize } from '../data/pet-sizes.js';
import { MOVES } from '../data/moves.js';
import { ENEMIES, TRAINERS } from '../data/enemies.js';
import { ITEMS } from '../data/items.js';
import { PET_BY_ID } from '../data/pets.js';
import { NPCS } from '../data/npcs.js';
import { effectiveness, typeList, typeName } from '../data/types.js';
import { form, canEvolve, evolve, petTex } from '../systems/forms.js';
import { friendInfo, ASSIST_HEARTS } from '../data/friends.js';
import { ZONES, npcZone } from '../data/regions.js';
import { state } from '../systems/state.js';
import { sfx } from '../systems/sfx.js';
import { isNight } from '../systems/clock.js';
import { battleUI as B } from '../ui/battle.js';
import { itemIcon, petIcon } from '../ui/images.js';
import { custom, playerTexture } from '../art/textures.js';
import { hash } from '../util.js';
import * as R from '../systems/battle.js';

const hex = c => parseInt(c.slice(1), 16);
const MAX_TEAM = 3;
// Chance each turn (from the second) that a nearby friend turns up, and when your pet is low on energy.
const FRIEND_CHANCE = 0.15, FRIEND_CHANCE_LOW = 0.3;

// Backdrops per suburb: sky, distant stuff, ground, and the pads they stand on.
const SCENERY = {
  laverton: { ground: 0x86c04e, groundDark: 0x6aa63c, pad: 0x5e9a36, far: 'houses' },
  brunswick: { ground: 0x8e8c88, groundDark: 0x74726e, pad: 0x6a6864, far: 'warehouses' },
  reservoir: { ground: 0x78b850, groundDark: 0x5e9e3e, pad: 0x4e8a32, far: 'park' },
};

export class BattleScene extends Phaser.Scene {
  constructor() { super('Battle'); }

  init(data) {
    this.opts = data;
    if (data.exhibition) {
      const party = [...(data.exhibitionParty || state.data.party)];
      const pets = [...new Set([...party, data.exhibitionPet].filter(Boolean))];
      this.exhibitionSnapshot = { party, hp: Object.fromEntries(pets.map(id => [id, state.pet(id).hp])) };
      for (const id of pets) state.pet(id).hp = null;
    }
    this.trainer = data.trainer ? TRAINERS[data.trainer] : null;
    this.over = false;
  }

  create() {
    this.makeFx();
    this.bg = this.add.graphics().setDepth(0);
    this.backgroundArt = this.add.image(0, 0, '__WHITE').setOrigin(0).setDepth(1).setVisible(false);
    this.foes = this.trainer ? R.trainerTeam(this.opts.trainer).map(([id, lv]) => R.foeFighter(id, lv)) : [R.foeFighter(this.opts.wild.id, this.opts.wild.level)];
    this.team = (this.opts.exhibitionPet?[this.opts.exhibitionPet]:R.readyTeam()).map(R.petFighter);
    this.foe = this.foes[0];
    this.mine = this.team[0];
    this.participants = new Set([this.mine.petId]);
    this.kod = [];
    this.runTries = 0;

    this.foeSpr = this.add.image(0, 0, '__WHITE').setOrigin(0.5, 1).setDepth(10).setVisible(false);
    this.mineSpr = this.add.image(0, 0, '__WHITE').setOrigin(0.5, 1).setDepth(11).setVisible(false);
    const [heroKey, heroFlip] = playerTexture(state.data.hero || 'helen', 'up');
    this.heroSpr = this.add.image(0, 0, heroKey, 0).setOrigin(0.5, 1).setDepth(12).setFlipX(heroFlip);
    const tKey = this.trainer && this.npcKey(this.opts.trainer);
    this.trainerSpr = tKey ? this.add.image(0, 0, tKey, 0).setOrigin(0.5, 1).setDepth(12) : null;

    B.open();
    this.layout();
    this.scale.on('resize', this.layout, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.layout, this));
    this.cameras.main.fadeIn(250, 255, 255, 255);
    this.run().catch(err => { console.error(err); this.finish('run'); });
  }

  npcKey(id) {
    if (custom.has(`npc-${id}`)) return `npc-${id}`;
    return this.textures.exists(`npc-${id}-down`) && NPCS[id] ? `npc-${id}-down` : null;
  }

  // ------------------------------------------------------------ layout & drawing
  layout() {
    const W = this.scale.width, H = this.scale.height;
    const panel = B.panelHeight() || 170, field = H - panel;
    this.unit = Math.max(2, Math.min(8, Math.floor(Math.min(W / 62, field / 40))));
    this.horizon = Math.round(field * 0.4);
    this.foePos = { x: Math.round(W * 0.7), y: Math.round(Math.max(field * 0.52, this.horizon + 10 * this.unit)) };
    this.minePos = { x: Math.round(W * 0.23), y: Math.round(field - 6 * this.unit) };
    this.drawBg(W, H);
    if (!this.animating) {
      this.place(this.foeSpr, this.foe, this.foePos);
      this.place(this.mineSpr, this.mine, this.minePos);
    }
    const u = this.unit;
    this.heroSpr.setScale(u * 26 / 32).setPosition(this.heroSpr.visible && this.heroIn ? this.minePos.x : this.heroSpr.x, this.minePos.y);
    this.trainerSpr?.setScale(u * 26 / 32).setY(this.foePos.y);
  }

  // Scale a sprite so pets and animals are 16 units tall and people about 26.
  scaleFor(key, f) {
    const tex = this.textures.get(key), fr = tex.has(0) ? tex.get(0) : tex.get();
    const tall = f && !f.petId && ENEMIES[f.id]?.tall;
    const target = (f?.petId ? petSize(f.petId) : tall ? 26 : fr.height > 18 && !custom.has(key) ? fr.height : 16) * this.unit;
    const requested=f?.petId || custom.has(key) || tall ? target / fr.height : this.unit;
    const field=this.scale.height-(B.panelHeight()||170);
    return Math.min(requested,this.scale.width*.38/fr.width,Math.max(48,field*.40)/fr.height);
  }
  place(spr, f, pos) {
    if (!f || !spr.visible) return;
    spr.setScale(this.scaleFor(spr.texture.key, f)).setPosition(pos.x, pos.y);
  }
  setFighterSprite(spr, f) {
    const tex = this.textures.get(f.tex), frame = tex.has(0) ? 0 : undefined;
    spr.setTexture(f.tex, frame).setVisible(true).setAlpha(1).clearTint().setAngle(0);
    // Built-in animals face right; foes turn to face your pet.
    spr.setFlipX(f.side === 'foe' && f.faces === 'right');
    spr.setScale(this.scaleFor(f.tex, f));
    this.tweens.killTweensOf(spr);
    if (f.float) this.tweens.add({ targets: spr, y: '-=' + this.unit * 2, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  drawBg(W, H) {
    const g = this.bg, S = SCENERY[this.opts.suburb] || SCENERY.laverton, u = this.unit, hz = this.horizon;
    const night = isNight(state.data.minutes);
    g.clear();
    // A location-specific PNG wins over suburb art, then the shared default.
    // Optional night variants retain the artist's colours without a tint.
    const names = [this.opts.region, this.opts.suburb, 'default'].filter(Boolean);
    const keys = names.flatMap(name => night ? [`battlebg-${name}-night`, `battlebg-${name}`] : [`battlebg-${name}`]);
    const background = keys.find(key => custom.has(key) && this.textures.exists(key));
    this.backgroundArt.setVisible(Boolean(background));
    if (background) {
      const field = Math.max(1, H - (B.panelHeight() || 170));
      this.backgroundArt.setTexture(background).setPosition(0, 0).setDisplaySize(W, field);
      return;
    }
    if (night) g.fillGradientStyle(0x10183a, 0x10183a, 0x34406e, 0x34406e, 1);
    else g.fillGradientStyle(0x7ec4ec, 0x7ec4ec, 0xd8eef6, 0xd8eef6, 1);
    g.fillRect(0, 0, W, hz);
    if (!night) { g.fillStyle(0xffffff, 0.85); for (let i = 0; i < 4; i++) { const cx = (hash(i, 3, 9) * W) | 0, cy = (hz * (0.15 + hash(i, 4, 9) * 0.4)) | 0; g.fillRect(cx, cy, 14 * u, 3 * u); g.fillRect(cx + 3 * u, cy - 2 * u, 7 * u, 2 * u); } }
    else { g.fillStyle(0xf4f0d0, 1); for (let i = 0; i < 24; i++) g.fillRect((hash(i, 1, 2) * W) | 0, (hash(i, 2, 2) * hz * 0.8) | 0, Math.max(1, u / 2), Math.max(1, u / 2)); }
    this.drawFar(g, S.far, W, hz, u, night);
    g.fillStyle(S.ground, 1); g.fillRect(0, hz, W, H - hz);
    g.fillStyle(S.groundDark, 1);
    for (let i = 0; i < 70; i++) {
      const x = (hash(i, 7, 3) * W) | 0, y = hz + 4 + ((hash(i, 8, 3) * (H - hz)) | 0);
      if (S.far === 'warehouses') g.fillRect(x, y, 6 * u, Math.max(1, u / 2)); else g.fillRect(x, y, u, 2 * u);
    }
    const pad = (p, w) => { g.fillStyle(S.pad, 1); g.fillEllipse(p.x, p.y - u, w * u, 6 * u); g.fillStyle(0xffffff, 0.12); g.fillEllipse(p.x, p.y - 1.6 * u, w * u * 0.8, 3 * u); };
    pad(this.foePos, 30); pad(this.minePos, 34);
    if (night) { g.fillStyle(0x0b1436, 0.3); g.fillRect(0, 0, W, H); }
  }
  drawFar(g, kind, W, hz, u, night) {
    const dim = c => night ? Phaser.Display.Color.ValueToColor(c).darken(45).color : c;
    if (kind === 'houses') {
      for (let x = -10 * u, i = 0; x < W; x += 26 * u, i++) {
        const h = (10 + hash(i, 1, 5) * 4) * u, base = hz - 4 * u;
        g.fillStyle(dim([0xc8784a, 0xd89a6a, 0xe8d8c0][i % 3]), 1); g.fillRect(x, base - h, 20 * u, h);
        g.fillStyle(dim(0x8a3a2a), 1); g.fillTriangle(x - 2 * u, base - h, x + 10 * u, base - h - 7 * u, x + 22 * u, base - h);
        g.fillStyle(dim(night ? 0xf4d070 : 0x6a8ab0), 1); g.fillRect(x + 4 * u, base - h + 4 * u, 4 * u, 3 * u); g.fillRect(x + 12 * u, base - h + 4 * u, 4 * u, 3 * u);
      }
      g.fillStyle(dim(0x5a6a5a), 1); g.fillRect(0, hz - 6 * u, W, 6 * u);  // colorbond fence
      g.fillStyle(dim(0x4a5a4a), 1); for (let x = 0; x < W; x += 8 * u) g.fillRect(x, hz - 6 * u, Math.max(1, u / 2), 6 * u);
    } else if (kind === 'warehouses') {
      g.fillStyle(dim(0xa85a3a), 1); g.fillRect(0, hz - 22 * u, W, 22 * u);
      g.fillStyle(dim(0x8a4a2e), 1); for (let y = hz - 22 * u; y < hz; y += 3 * u) g.fillRect(0, y, W, Math.max(1, u / 2));
      g.fillStyle(dim(0x6a6e74), 1);
      for (let x = 0; x < W; x += 16 * u) g.fillTriangle(x, hz - 22 * u, x + 16 * u, hz - 22 * u, x + 16 * u, hz - 30 * u);
      g.fillStyle(dim(0x3a3a40), 1); for (let x = 12 * u; x < W; x += 60 * u) g.fillRect(x, hz - 14 * u, 22 * u, 14 * u);   // roller doors
      g.fillStyle(dim(0x2a2a2e), 1); g.fillRect(0, hz - 36 * u, W, Math.max(1, u / 2));  // tram wire
      const tags = [0xe8508a, 0x4ab0e0, 0xf0c030];
      for (let i = 0; i < 5; i++) { g.fillStyle(dim(tags[i % 3]), 1); g.fillRect((hash(i, 2, 7) * W) | 0, hz - (6 + hash(i, 3, 7) * 10) * u, 8 * u, 2 * u); }
    } else {
      for (let x = -6 * u, i = 0; x < W; x += 18 * u, i++) {
        const r = (8 + hash(i, 2, 4) * 5) * u;
        g.fillStyle(dim(0x8a9a8a), 1); g.fillRect(x + 7 * u, hz - 12 * u, 2 * u, 12 * u);
        g.fillStyle(dim([0x6a9a6a, 0x7aa87a, 0x5a8a62][i % 3]), 1); g.fillCircle(x + 8 * u, hz - 12 * u - r * 0.6, r);
      }
      g.fillStyle(dim(0x5a9ac8), 1); g.fillRect(0, hz - 3 * u, W, 3 * u);  // the lake
    }
  }

  makeFx() {
    if (this.textures.exists('bt-dot')) return;
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xffffff); g.fillCircle(4, 4, 4); g.generateTexture('bt-dot', 8, 8); g.clear();
    g.fillStyle(0xffffff); g.fillRect(0, 0, 3, 20); g.generateTexture('bt-slash', 3, 20); g.clear();
    g.lineStyle(3, 0xffffff); g.strokeCircle(16, 16, 13); g.generateTexture('bt-ring', 32, 32); g.clear();
    g.fillStyle(0xffffff); g.fillRect(3, 0, 2, 8); g.fillRect(0, 3, 8, 2); g.generateTexture('bt-star', 8, 8); g.clear();
    g.fillStyle(0xffffff); g.fillCircle(6, 10, 6); g.fillCircle(13, 7, 7); g.fillCircle(19, 11, 5); g.generateTexture('bt-cloud', 26, 18); g.clear();
    g.fillStyle(0xffffff); g.fillTriangle(0, 0, 12, 0, 6, 12); g.generateTexture('bt-fang', 12, 12);
    g.destroy();
  }

  // ------------------------------------------------------------ animation helpers
  tw(targets, props) { return new Promise(res => this.tweens.add({ targets, ...props, onComplete: () => res() })); }
  wait(ms) { return new Promise(res => this.time.delayedCall(ms, res)); }
  sprOf(f) { return f.side === 'foe' ? this.foeSpr : this.mineSpr; }
  mid(spr) { return { x: spr.x, y: spr.y - spr.displayHeight / 2 }; }
  burst(x, y, colour, n = 10, { key = 'bt-dot', spread = 30, rise = 0, scale = 1, dur = 500 } = {}) {
    const s = this.unit / 4;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, d = (0.4 + Math.random() * 0.6) * spread * s;
      const p = this.add.image(x, y, key).setTint(colour).setDepth(30).setScale(scale * s * (0.6 + Math.random() * 0.6));
      this.tweens.add({ targets: p, x: x + Math.cos(a) * d, y: y + Math.sin(a) * d - rise * s, alpha: 0, duration: dur + Math.random() * 200, ease: 'Quad.easeOut', onComplete: () => p.destroy() });
    }
  }
  async hurt(f, eff) {
    const spr = this.sprOf(f), x = spr.x;
    if (eff > 1) { sfx.superHit(); this.cameras.main.shake(220, 0.012); } else if (eff < 1) sfx.weakHit(); else sfx.hit();
    for (let i = 0; i < 2; i++) { spr.setTintFill(0xffffff); await this.wait(60); spr.clearTint(); await this.wait(50); }
    await this.tw(spr, { x: x + this.unit * 2, duration: 45, yoyo: true, repeat: 2 });
    spr.x = x;
  }

  // One animation per move kind. hit = the move does damage.
  async play(anim, user, target, type, hit) {
    const us = this.sprOf(user), ts = this.sprOf(target), u = this.unit;
    const c = hex(TYPES[type].colour), dir = user.side === 'mine' ? 1 : -1;
    const ux = us.x, uy = us.y, tm = this.mid(ts), um = this.mid(us);
    this.animating = true;
    switch (anim) {
      case 'circle':
      case 'zoom': {
        sfx.whoosh();
        const centre = anim === 'circle' ? tm : um;
        for (let i = 0; i < 6; i++) {
          const a = i * Math.PI / 3;
          this.burst(us.x, us.y - u, c, 3);
          await this.tw(us, { x: centre.x + Math.cos(a) * 15 * u, y: centre.y + Math.sin(a) * 5 * u, duration: anim === 'zoom' ? 65 : 110 });
        }
        await this.tw(us, { x: ux, y: uy, duration: 180 });
        break;
      }
      case 'scoot': {
        await this.tw(us, { y: uy + 2 * u, duration: 100 });
        for (let i = 0; i < 3; i++) { this.burst(us.x, us.y, 0xb18b61, 3); await this.tw(us, { x: us.x + dir * 5 * u, duration: 140 }); }
        await this.tw(us, { x: ux, y: uy, duration: 160 });
        break;
      }
      case 'bed': {
        const bed = this.add.rectangle(ux + dir * 7 * u, uy - 2 * u, 18 * u, 5 * u, 0xd78ea0).setStrokeStyle(u, 0x684550).setDepth(9);
        await this.tw(us, { x: ux + dir * 5 * u, y: uy - 3 * u, duration: 120, yoyo: true, repeat: 3 });
        this.burst(ux, uy - 8 * u, 0xffb1c8, 6); bed.destroy();
        break;
      }
      case 'nap': {
        const z = this.add.text(ux, uy - 18 * u, 'z z z', { fontSize: `${3 * u}px`, color: '#ffffff' }).setDepth(30);
        const scale = us.scaleY;
        await this.tw(us, { scaleY: scale * .7, duration: 200 });
        await this.tw(z, { y: z.y - 8 * u, alpha: 0, duration: 650 });
        await this.tw(us, { scaleY: scale, duration: 160 }); z.destroy();
        break;
      }
      case 'stare': {
        const ray = this.add.graphics().setDepth(30);
        ray.lineStyle(u / 2, c, .7).lineBetween(um.x, um.y - 3 * u, tm.x, tm.y);
        ts.setTint(c); await this.wait(450); ts.clearTint(); ray.destroy();
        break;
      }
      case 'lunge': {
        sfx.whoosh();
        await this.tw(us, { x: ux + (ts.x - ux) * 0.45, y: uy + (ts.y - uy) * 0.45, duration: 170, ease: 'Quad.easeIn' });
        this.burst(tm.x, tm.y, c, 8);
        await this.tw(us, { x: ux, y: uy, duration: 220, ease: 'Quad.easeOut' });
        break;
      }
      case 'hop': {
        sfx.whoosh();
        await this.tw(us, { x: ux + (ts.x - ux) * 0.5, y: uy + (ts.y - uy) * 0.5 - 18 * u, duration: 220, ease: 'Quad.easeOut' });
        await this.tw(us, { x: ts.x - dir * 6 * u, y: ts.y, duration: 160, ease: 'Quad.easeIn' });
        this.burst(tm.x, ts.y - 2 * u, c, 10);
        await this.tw(us, { x: ux, y: uy, duration: 320, ease: 'Sine.easeInOut' });
        break;
      }
      case 'bite': {
        await this.tw(us, { x: ux + dir * 6 * u, duration: 120, yoyo: true });
        const top = this.add.image(tm.x, tm.y - 8 * u, 'bt-fang').setDepth(30).setScale(u / 2.5);
        const bot = this.add.image(tm.x, tm.y + 8 * u, 'bt-fang').setDepth(30).setScale(u / 2.5).setFlipY(true);
        sfx.hit();
        await Promise.all([this.tw(top, { y: tm.y - u, duration: 140, ease: 'Quad.easeIn' }), this.tw(bot, { y: tm.y + u, duration: 140, ease: 'Quad.easeIn' })]);
        this.burst(tm.x, tm.y, c, 6);
        await this.tw([top, bot], { alpha: 0, duration: 160 });
        top.destroy(); bot.destroy();
        break;
      }
      case 'claw': {
        for (let i = 0; i < 3; i++) {
          const s = this.add.image(tm.x + (i - 1) * 4 * u, tm.y, 'bt-slash').setDepth(30).setAngle(-30 * dir).setTint(i === 1 ? c : 0xffffff).setScale(u / 3, 0);
          sfx.whoosh();
          this.tweens.add({ targets: s, scaleY: u / 1.6, duration: 90, onComplete: () => this.tweens.add({ targets: s, alpha: 0, duration: 220, onComplete: () => s.destroy() }) });
          await this.wait(90);
        }
        await this.wait(120);
        break;
      }
      case 'beam': {
        for (let i = 0; i < 6; i++) {
          const r = this.add.image(um.x, um.y, 'bt-ring').setDepth(30).setTint(c).setScale(u / 6);
          this.tweens.add({ targets: r, x: tm.x, y: tm.y, scale: u / 2.5, alpha: 0.2, duration: 420, ease: 'Sine.easeIn', onComplete: () => r.destroy() });
          sfx.blip();
          await this.wait(70);
        }
        await this.wait(380);
        ts.setTint(c); await this.wait(140); ts.clearTint();
        break;
      }
      case 'shout': {
        sfx.yap();
        this.tweens.add({ targets: us, scaleY: us.scaleY * 1.15, scaleX: us.scaleX * 0.92, duration: 110, yoyo: true, repeat: 1 });
        for (let i = 0; i < 3; i++) {
          const r = this.add.image(um.x + dir * 6 * u, um.y - 2 * u, 'bt-ring').setDepth(30).setTint(c).setScale(u / 8);
          this.tweens.add({ targets: r, scale: u / 1.6, alpha: 0, x: r.x + dir * 14 * u, duration: 520, onComplete: () => r.destroy() });
          await this.wait(120);
        }
        await this.wait(260);
        break;
      }
      case 'heal': {
        sfx.healUp();
        for (let i = 0; i < 12; i++) {
          const p = this.add.image(um.x + (Math.random() - 0.5) * 16 * u, us.y - Math.random() * 6 * u, i % 3 ? 'bt-star' : 'bt-dot').setDepth(30).setTint(i % 2 ? 0x8af08a : 0xffffff).setScale(u / 3);
          this.tweens.add({ targets: p, y: p.y - (10 + Math.random() * 10) * u, alpha: 0, duration: 700, delay: i * 40, onComplete: () => p.destroy() });
        }
        us.setTint(0xb8ffb8); await this.wait(420); us.clearTint(); await this.wait(200);
        break;
      }
      case 'fade': {
        sfx.whoosh();
        await this.tw(us, { alpha: 0.25, duration: 380 });
        break;
      }
      case 'dig': {
        this.burst(ux, uy - u, 0x8a6a4a, 10, { rise: 10 });
        await this.tw(us, { y: uy + 8 * u, alpha: 0, duration: 260, ease: 'Quad.easeIn' });
        await this.wait(200);
        this.burst(ts.x, ts.y - u, 0x8a6a4a, 14, { rise: 20, spread: 40 });
        this.cameras.main.shake(160, 0.008);
        await this.tw(ts, { y: ts.y - 5 * u, duration: 120, yoyo: true, ease: 'Quad.easeOut' });
        us.setY(uy - 6 * u);
        await this.tw(us, { y: uy, alpha: 1, duration: 260, ease: 'Bounce.easeOut' });
        break;
      }
      case 'gust': {
        sfx.whoosh();
        for (let i = 0; i < 7; i++) {
          const s = this.add.image(um.x, tm.y + (Math.random() - 0.5) * 12 * u, 'bt-slash').setDepth(30).setAngle(90).setTint(i % 2 ? c : 0xffffff).setAlpha(0.85).setScale(u / 4, u / 2);
          this.tweens.add({ targets: s, x: tm.x + dir * 20 * u, alpha: 0, duration: 380, delay: i * 50, onComplete: () => s.destroy() });
        }
        await this.wait(300);
        await this.tw(ts, { angle: 8 * dir, duration: 80, yoyo: true, repeat: 1 });
        break;
      }
      case 'stink': {
        for (let i = 0; i < 7; i++) {
          const p = this.add.image(tm.x + (Math.random() - 0.5) * 16 * u, tm.y + (Math.random() - 0.3) * 10 * u, 'bt-cloud').setDepth(30).setTint(i % 2 ? 0x9ac040 : c).setAlpha(0).setScale(u / 6);
          this.tweens.add({ targets: p, alpha: 0.85, scale: u / 3, y: p.y - 6 * u, duration: 380, delay: i * 70, yoyo: true, hold: 200, onComplete: () => p.destroy() });
        }
        sfx.weakHit();
        await this.wait(900);
        break;
      }
      case 'flame': {
        for (let i = 0; i < 16; i++) {
          const p = this.add.image(tm.x + (Math.random() - 0.5) * 14 * u, ts.y - Math.random() * 4 * u, 'bt-dot').setDepth(30).setTint([0xf0a030, 0xe85030, 0xf8e070][i % 3]).setScale(u / 3);
          this.tweens.add({ targets: p, y: p.y - (10 + Math.random() * 14) * u, scale: 0.2, alpha: 0, duration: 600, delay: i * 30, onComplete: () => p.destroy() });
        }
        sfx.whoosh();
        await this.wait(700);
        break;
      }
      default: await this.wait(200);
    }
    this.animating = false;
  }

  // ------------------------------------------------------------ the battle
  say(text) { return B.message(text); }

  teamDots() {
    const dots = this.team.map(f => f.hp > 0 ? 'ok' : 'ko');
    while (dots.length < MAX_TEAM) dots.push('empty');
    return dots;
  }
  showMine() {
    const rec = state.pet(this.mine.petId);
    B.setFighter(this.mine, { team: this.teamDots(), xp: (rec.xp || 0) / R.xpToNext(this.mine.level) });
  }

  async run() {
    await this.intro();
    while (!this.over) {
      await this.maybeFriend();
      if (this.over) break;
      const action = await this.chooseAction();
      await this.turn(action);
      if (!this.over) await this.endOfTurn();
    }
  }

  async intro() {
    const W = this.scale.width, u = this.unit;
    sfx.encounter();
    this.heroSpr.setPosition(-20 * u, this.minePos.y).setScale(u * 26 / 32);
    this.heroIn = true;
    const tweensIn = [this.tw(this.heroSpr, { x: this.minePos.x, duration: 600, ease: 'Quad.easeOut' })];
    if (this.trainerSpr) {
      this.trainerSpr.setPosition(W + 20 * u, this.foePos.y).setScale(u * 26 / 32);
      tweensIn.push(this.tw(this.trainerSpr, { x: this.foePos.x, duration: 600, ease: 'Quad.easeOut' }));
    } else {
      this.setFighterSprite(this.foeSpr, this.foe);
      this.foeSpr.setPosition(W + 20 * u, this.foePos.y);
      tweensIn.push(this.tw(this.foeSpr, { x: this.foePos.x, duration: 600, ease: 'Quad.easeOut' }));
    }
    await Promise.all(tweensIn);
    if (this.trainer) {
      await this.say(this.trainer.intro || (this.trainer.prize ? `${this.trainer.name} wants a friendly play-fight!` : `The ${this.trainer.name} wants to battle!`));
      if (this.trainerSpr) await this.tw(this.trainerSpr, { x: W + 20 * u, duration: 400, ease: 'Quad.easeIn' });
      await this.sendOutFoe(this.sendText(this.foe));
    } else {
      B.setFighter(this.foe); B.show('foe');
      await this.say(ENEMIES[this.foe.id].appear);
    }
    await this.tw(this.heroSpr, { x: -20 * u, duration: 350, ease: 'Quad.easeIn' });
    this.heroIn = false; this.heroSpr.setVisible(false);
    await this.sendOutMine(this.mine, `Go, ${this.mine.name}!`);
  }

  sendText(f) {
    if (ENEMIES[f.id]?.sendOut) return ENEMIES[f.id].sendOut;   // a foe with its own entrance (Alison turning into a slug)
    const t = this.trainer.sendOut;
    return t ? t.replace('{f}', f.name.toLowerCase()) : `${this.trainer.name} sends out ${this.trainer.prize ? '' : 'the '}${f.name}!`;
  }

  // Some foes end the battle the moment they appear (the stranger's fentanyl).
  async endingFoe(f) {
    sfx.sad();
    const lines = ENEMIES[f.id].endLines || [];
    for (const line of lines) await B.message(line, { auto: false });
    this.finish('win');
  }

  async popIn(spr, f, pos) {
    this.setFighterSprite(spr, f);
    const s = spr.scaleX;
    spr.setPosition(pos.x, pos.y).setScale(0);
    const m = { x: pos.x, y: pos.y - 8 * this.unit };
    const ring = this.add.image(m.x, m.y, 'bt-ring').setDepth(30).setTint(hex(TYPES[typeList(f.type)[0]].colour)).setScale(this.unit / 8);
    this.tweens.add({ targets: ring, scale: this.unit, alpha: 0, duration: 450, onComplete: () => ring.destroy() });
    this.burst(m.x, m.y, 0xffffff, 10, { key: 'bt-star' });
    sfx.select();
    await this.tw(spr, { scaleX: s, scaleY: s, duration: 320, ease: 'Back.easeOut' });
    if (f.float) this.tweens.add({ targets: spr, y: '-=' + this.unit * 2, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }
  async sendOutFoe(text) {
    B.setFighter(this.foe); B.show('foe');
    const p = this.say(text);
    await this.popIn(this.foeSpr, this.foe, this.foePos);
    await p;
  }
  async sendOutMine(f, text) {
    this.mine = f;
    this.participants.add(f.petId);
    this.showMine(); B.show('mine');
    const p = this.say(text);
    await this.popIn(this.mineSpr, f, this.minePos);
    await p;
  }

  async chooseAction() {
    for (;;) {
      B.prompt(`What will ${this.mine.name} do?`);
      const others = this.team.filter(f => f !== this.mine && f.hp > 0);
      const bag = state.treatItems();
      const pick = await B.menu([
        { label: 'Fight', value: 'fight' },
        { label: 'Treat', value: 'treat', note: bag.length ? `${bag.reduce((a, id) => a + state.count(id), 0)} in bag` : 'bag empty', disabled: !bag.length },
        { label: 'Swap', value: 'swap', disabled: !others.length },
        { label: this.trainer ? 'Give up' : 'Run', value: 'run', back: true },
      ]);
      if (pick === 'fight') {
        B.prompt('Pick a move.');
        const move = await B.menu([...this.mine.moves.map(id => {
          const m = MOVES[id], eff = effectiveness(m.type, this.foe.type);
          const note = m.power ? `Power ${m.power}${eff > 1 ? ' · Strong!' : eff < 1 ? ' · Weak' : ''}` : this.effectNote(m.effect);
          return { label: m.name, value: id, type: m.type, note };
        }), { label: '◀ Back', value: null, back: true }], { layout: 'moves' });
        if (move) return { kind: 'move', move };
      } else if (pick === 'treat') {
        B.prompt(`Give ${this.mine.name} a treat? It gives them energy back.`);
        const item = await B.menu([...bag.map(id => ({ label: ITEMS[id].name, value: id, icon: itemIcon(id, 32), note: `×${state.count(id)}` })), { label: '◀ Back', value: null, back: true }], { layout: 'list' });
        if (item) return { kind: 'treat', item };
      } else if (pick === 'swap') {
        B.prompt('Who should go in?');
        const f = await B.menu([...others.map(o => ({ label: o.name, value: o, icon: petIcon(o.petId, 32), note: `Lv ${o.level} · ${o.hp}/${o.maxHp} HP` })), { label: '◀ Back', value: null, back: true }], { layout: 'list' });
        if (f) return { kind: 'swap', f };
      } else if (pick === 'run') return { kind: 'run' };
    }
  }
  effectNote(e = {}) {
    if (e.heal) return 'Heals';
    if (e.foeAtk) return 'Lowers attack';
    if (e.foeDef) return 'Lowers defence';
    if (e.evade) return 'Dodge';
    if (e.charge) return 'Next hit x2';
    if (e.selfAtk) return 'Raises attack';
    return '';
  }

  async turn(action) {
    const foeMove = R.chooseFoeMove(this.foe, this.mine);
    if (action.kind === 'run') {
      if (this.trainer) {
        await this.say(`You call off the play-fight. ${this.trainer.name} shrugs. "Any time."`);
        return this.finish('forfeit');
      }
      this.runTries++;
      if (Math.random() < R.runChance(this.mine, this.foe, this.runTries - 1)) {
        sfx.whoosh();
        this.tw(this.mineSpr, { x: -30 * this.unit, duration: 400 });
        await this.say('You got away safely!');
        return this.finish('run');
      }
      await this.say(`${this.foe.name} won't let you leave!`);
      return this.act(this.foe, foeMove);
    }
    if (action.kind === 'treat') { await this.giveTreat(action.item); return this.act(this.foe, foeMove); }
    if (action.kind === 'swap') { await this.swapTo(action.f); return this.act(this.foe, foeMove); }
    // Both use a move. Dodges go first, then the faster one.
    const prio = id => (MOVES[id].effect?.evade ? 1 : 0);
    const mineFirst = prio(action.move) !== prio(foeMove) ? prio(action.move) > prio(foeMove)
      : this.mine.stats.speed !== this.foe.stats.speed ? this.mine.stats.speed > this.foe.stats.speed : Math.random() < 0.5;
    const order = mineFirst ? [[this.mine, action.move], [this.foe, foeMove]] : [[this.foe, foeMove], [this.mine, action.move]];
    for (const [f, move] of order) {
      if (this.over) return;
      if (f.hp <= 0 || (f !== this.mine && f !== this.foe)) continue;
      await this.act(f, move);
    }
  }

  async act(f, moveId) {
    if (this.over || f.hp <= 0) return;
    const target = f.side === 'mine' ? this.foe : this.mine;
    await this.useMove(f, target, moveId);
    await this.checkOuts();
  }

  async endOfTurn() {
    const regen = R.gearBonus(this.mine).regen;
    if (regen && this.mine.hp > 0 && this.mine.hp < this.mine.maxHp) {
      this.mine.hp = Math.min(this.mine.maxHp, this.mine.hp + Math.ceil(this.mine.maxHp * regen));
      B.hp(this.mine);
      await this.say(`${this.mine.name} has a snack from the snack pouch.`);
    }
    for (const f of [this.mine, this.foe]) {
      if (f.evade) { f.evade = false; this.tweens.add({ targets: this.sprOf(f), alpha: 1, duration: 250 }); }
    }
  }

  async useMove(user, target, id) {
    const m = MOVES[id], e = m.effect || {};
    const fill = t => t.replaceAll('{u}', user.name).replaceAll('{t}', target.name);
    if (e.evade && user.lastMove === id && Math.random() < 0.5) {
      user.lastMove = null;
      return this.say(`${user.name} tries ${m.name} again, but it doesn't work twice in a row!`);
    }
    user.lastMove = id;
    if (e.usesHeld && !user.held) return this.say(`${user.name} reaches for the ${user.lostHeld || 'snack'}. It's gone! Somebody chewed it.`);

    const said = this.say(fill(m.text));
    if (m.power > 0) {
      if (target.evade) {
        await this.play(m.anim === 'beam' ? 'beam' : 'gust', user, target, m.type, false);
        await said;
        return this.say(`${target.name} isn't there! ${user.name} misses.`);
      }
      const r = R.damage(user, target, m);
      await this.play(m.anim, user, target, m.type, true);
      let dmg = r.dmg, refused = false;
      // In Julie's tutorial your pet always hangs on: you can't lose your first fight.
      if (dmg >= target.hp && (R.refusesToLose(target) || (this.trainer?.tutorial && target.side === 'mine'))) { dmg = target.hp - 1; refused = true; }
      target.hp = Math.max(0, target.hp - dmg);
      B.hp(target);
      await this.hurt(target, r.eff);
      user.charged = false;
      await said;
      if (r.crit) await this.say('A lucky hit!');
      if (r.eff > 1) await this.say("It's super effective!");
      if (r.eff < 1) await this.say("It's not very effective...");
      if (refused) await this.say(`${target.name} refuses to lose in front of you!`);
      if (e.drain && user.hp < user.maxHp) {
        user.hp = Math.min(user.maxHp, user.hp + Math.max(1, Math.floor(dmg * e.drain)));
        B.hp(user);
        await this.say(`${user.name} feels a bit better.`);
      }
      if (e.destroyItem && target.held) {
        target.lostHeld = target.held; target.held = null; B.hp(target);
        this.burst(this.mid(this.sprOf(target)).x, this.mid(this.sprOf(target)).y, 0xe8c080, 12, { key: 'bt-star' });
        await this.say(`${user.name} chews up ${target.name}'s ${target.lostHeld}!`);
      }
    } else {
      await this.play(m.anim, user, target, m.type, false);
      await said;
    }
    await this.applyEffects(user, target, e);
  }

  async applyEffects(user, target, e) {
    if (e.heal) {
      if (user.hp >= user.maxHp) await this.say(`${user.name} is already full of beans!`);
      else {
        user.hp = Math.min(user.maxHp, user.hp + Math.ceil(user.maxHp * e.heal));
        B.hp(user);
        await this.say(`${user.name} got some energy back!`);
      }
      if (e.usesHeld) { user.lostHeld = user.held; user.held = null; B.hp(user); }
    }
    const stage = async (f, key, delta, label) => {
      const before = f.stages[key];
      f.stages[key] = Math.max(-6, Math.min(6, before + delta));
      const spr = this.sprOf(f), m = this.mid(spr);
      if (f.stages[key] === before) return this.say(`${f.name}'s ${label} won't go any ${delta < 0 ? 'lower' : 'higher'}!`);
      if (delta < 0) { sfx.statDown(); this.burst(m.x, m.y - 6 * this.unit, 0x6a8ae0, 10, { rise: -30 }); }
      else { sfx.statUp(); this.burst(m.x, m.y + 6 * this.unit, 0xe86a4a, 10, { rise: 30 }); }
      return this.say(`${f.name}'s ${label} ${delta < 0 ? 'fell' : 'rose'}!`);
    };
    if (e.foeHeal && target.hp > 0) {
      target.hp = Math.min(target.maxHp, target.hp + Math.ceil(target.maxHp * e.foeHeal));
      B.hp(target);
      await this.play('heal', target, user, typeList(target.type)[0], false);
    }
    if (e.recoil && user.hp > 0) {
      user.hp = Math.max(0, user.hp - Math.ceil(user.maxHp * e.recoil));
      B.hp(user);
      await this.hurt(user, 1);
      await this.say((MOVES[user.lastMove]?.recoilText || '{u} is hurt by the effort.').replaceAll('{u}', user.name));
    }
    if (e.foeAtk && target.hp > 0) await stage(target, 'atk', -e.foeAtk, 'attack');
    if (e.foeDef && target.hp > 0) await stage(target, 'def', -e.foeDef, 'defence');
    if (e.selfAtk) await stage(user, 'atk', e.selfAtk, 'attack');
    if (e.selfDef) await stage(user, 'def', e.selfDef, 'defence');
    if (e.evade) user.evade = true;
    if (e.charge) { user.charged = true; await this.say(`${user.name} is ready to strike hard!`); }
  }

  // Friends with enough hearts who live in this suburb sometimes turn up and
  // help, at random, at most once a battle. You can't call them: they find you.
  nearbyFriends() {
    return Object.keys(NPCS).filter(id => friendInfo(id).assist && id !== this.opts.trainer && state.friendHearts(id) >= ASSIST_HEARTS
      && ZONES[npcZone(id)]?.suburb === this.opts.suburb);
  }
  async maybeFriend() {
    this.turnNo = (this.turnNo || 0) + 1;
    if (this.friendCame || this.turnNo < 2 || !this.mine || this.mine.hp <= 0) return;
    // More likely when your pet is struggling.
    const low = this.mine.hp < this.mine.maxHp * 0.4;
    if (Math.random() > (low ? FRIEND_CHANCE_LOW : FRIEND_CHANCE)) return;
    const who = this.nearbyFriends();
    if (!who.length) return;
    this.friendCame = true;
    await this.friendHelps(who[Math.floor(Math.random() * who.length)]);
    await this.checkOuts();
  }
  async friendHelps(id) {
    const a = friendInfo(id).assist, me = this.mine, foe = this.foe;
    sfx.myki();
    await this.say(`${NPCS[id].name} spots you from down the street and runs over!`);
    await this.say(a.line);
    if (a.heal) { await this.play('heal', me, foe, typeList(me.type)[0], false); me.hp = Math.min(me.maxHp, me.hp + Math.ceil(me.maxHp * a.heal)); B.hp(me); }
    if (a.damage) { this.cameras.main.shake(200, 0.01); foe.hp = Math.max(0, foe.hp - Math.ceil(foe.maxHp * a.damage)); B.hp(foe); await this.hurt(foe, 1); }
    await this.applyEffects(me, foe, { selfAtk: a.selfAtk, selfDef: a.selfDef, foeAtk: a.foeAtk, foeDef: a.foeDef });
  }

  async giveTreat(item) {
    const f = this.mine, d = PET_BY_ID[f.petId], rec = state.pet(f.petId), name = ITEMS[item].name.toLowerCase();
    const reaction = d.loves.includes(item) ? 'love' : d.likes.includes(item) ? 'like' : d.dislikes.includes(item) ? 'dislike' : 'neutral';
    state.removeItem(item);
    rec.reactions[item] = reaction;
    await this.say(`You toss ${f.name} a ${name}.`);
    await this.play('heal', f, this.foe, typeList(f.type)[0], false);
    f.hp = Math.min(f.maxHp, f.hp + Math.ceil(f.maxHp * { love: 0.6, like: 0.4, neutral: 0.25, dislike: 0.1 }[reaction]));
    B.hp(f);
    await this.say({
      love: `${f.name} LOVES it! Loads of energy back!`,
      like: `${f.name} likes it. Energy back!`,
      neutral: `${f.name} eats it politely. A bit of energy back.`,
      dislike: `${f.name} is not impressed, but nibbles it anyway.`,
    }[reaction]);
  }

  // Evolution, Pokémon style: flicker between the two forms, then a flash.
  async evolveFighter(f) {
    const id = f.petId, before = f.name, active = f === this.mine;
    await this.say(`What's this? ${before} is changing!`);
    if (active) {
      const spr = this.mineSpr, newTex = `pet-${id}-evolved`;
      for (let i = 0; i < 8; i++) {
        spr.setTexture(i % 2 ? f.tex : newTex, 0).setTintFill(0xffffff);
        sfx.blip();
        await this.wait(260 - i * 25);
      }
      this.cameras.main.flash(500, 255, 255, 255);
    }
    evolve(id);
    const d = form(id);
    Object.assign(f, { name: d.name, type: d.type, base: d.stats, moves: d.moves, tex: petTex(id), stages: { atk: 0, def: 0 } });
    f.stats = R.fighterStats(f); f.maxHp = f.stats.hp; f.hp = f.maxHp;
    if (active) {
      this.setFighterSprite(this.mineSpr, f); this.mineSpr.setPosition(this.minePos.x, this.minePos.y);
      this.burst(this.mid(this.mineSpr).x, this.mid(this.mineSpr).y, hex(TYPES[typeList(f.type)[0]].colour), 24, { key: 'bt-star', spread: 70 });
      this.showMine();
    }
    sfx.found();
    await this.say(`${before} evolved into ${d.name}!`);
    await this.say(`${d.name} is now ${typeName(d.type)} type, fully rested, with brand new moves.`);
  }

  async swapTo(f) {
    await this.say(`${this.mine.name}, come back!`);
    await this.tw(this.mineSpr, { x: -20 * this.unit, alpha: 0, duration: 300, ease: 'Quad.easeIn' });
    this.mine.evade = false; this.mine.stages = { atk: 0, def: 0 }; this.mine.charged = false;
    await this.sendOutMine(f, `Go, ${f.name}!`);
  }

  async checkOuts() {
    if (!this.over && this.foe.hp <= 0) await this.foeOut();
    if (!this.over && this.mine.hp <= 0) await this.mineOut();
  }

  async foeOut() {
    const f = this.foe, spr = this.foeSpr;
    sfx.faint();
    this.tweens.killTweensOf(spr);
    const leaving = f.owned ? this.tw(spr, { angle: 180 * (spr.flipX ? -1 : 1), y: spr.y - 2 * this.unit, duration: 400 }) : this.tw(spr, { y: spr.y + 6 * this.unit, alpha: 0, duration: 450, ease: 'Quad.easeIn' });
    await Promise.all([leaving, this.say(f.owned ? `${f.name} flops over for a belly rub. Play-fight over!` : `${f.name} ${ENEMIES[f.id].leave}`)]);
    if (f.owned) await this.tw(spr, { alpha: 0, duration: 250 });
    B.show('foe', false);
    // Experience for every pet that took part and is still going
    const xp = this.opts.exhibition || this.trainer?.noXp ? 0 : R.xpReward(f, !!this.trainer);
    for (const m of this.team.filter(t => xp && this.participants.has(t.petId) && t.hp > 0)) {
      const got = Math.round(xp * (R.gearBonus(m).xp || 1));
      const levels = R.gainXp(m, got);
      if (m === this.mine) this.showMine();
      await this.say(`${m.name} gained ${got} experience!`);
      for (const lv of levels) {
        sfx.levelUp();
        if (m === this.mine) { this.burst(this.mid(this.mineSpr).x, this.mid(this.mineSpr).y, 0xf8e070, 16, { key: 'bt-star', spread: 50 }); this.showMine(); }
        if (m === this.mine) B.hp(m);
        await this.say(`${m.name} grew to level ${lv}! Full energy again!`);
      }
      if (canEvolve(m.petId, m.level)) await this.evolveFighter(m);
    }
    if (!this.trainer && ENEMIES[f.id].tall) {   // only people have pockets
      const cash = R.wildMoney(f);
      state.addMoney(cash);
      await this.say(`You find $${cash} in loose change where ${f.name} was.`);
    }
    if (!this.trainer && ENEMIES[f.id].drop) {
      const [item, chance] = ENEMIES[f.id].drop;
      if (Math.random() < chance) { state.addItem(item); await this.say(`${f.name} left something behind. You got: ${ITEMS[item].name}!`); }
    }
    const next = this.foes[this.foes.indexOf(f) + 1];
    if (next) {
      this.foe = next;
      this.participants = new Set([this.mine.petId]);
      if (ENEMIES[next.id]?.ends) return this.endingFoe(next);
      return this.sendOutFoe(this.sendText(next));
    }
    sfx.win();
    for (const m of this.team) if (this.participants.has(m.petId) && m.hp > 0) state.addPoints(m.petId, 5);
    await this.say(this.trainer ? `You won the play-fight against ${this.trainer.name}!` : 'You won!');
    this.finish('win');
  }

  async mineOut() {
    const f = this.mine, spr = this.mineSpr;
    sfx.faint();
    this.kod.push(f.petId);
    this.participants.delete(f.petId);
    if(!this.opts.exhibition) R.saveFighter(f);
    if(!this.opts.exhibition) state.setParty(state.data.party.filter(id => id !== f.petId));
    spr.setFlipX(true);
    await Promise.all([
      this.say(this.opts.exhibition?`${f.name} rests beside the ring. Your team returns after the match.`:`${f.name} has had enough and runs home to Allen St!`),
      this.tw(spr, { x: -30 * this.unit, duration: 900, ease: 'Quad.easeIn' }),
      this.tw(spr, { y: spr.y - 3 * this.unit, duration: 110, yoyo: true, repeat: 3 }),
    ]);
    spr.setVisible(false);
    B.show('mine', false);
    const left = this.team.filter(t => t.hp > 0);
    if (!left.length) {
      await this.say('Your whole team has gone home for a nap. You lose the battle!');
      return this.finish('lose');
    }
    B.prompt("Who's next?");
    const next = left.length === 1 ? left[0] : await B.menu(left.map(o => ({ label: o.name, value: o, icon: petIcon(o.petId, 32), note: `Lv ${o.level} · ${o.hp}/${o.maxHp} HP` })), { layout: 'list' });
    await this.sendOutMine(next, `Go, ${next.name}!`);
  }

  finish(outcome) {
    if (this.over) return;
    this.over = true;
    for (const f of this.team) if (!this.opts.exhibition && f.hp > 0) R.saveFighter(f);
    if(this.exhibitionSnapshot){state.setParty(this.exhibitionSnapshot.party);for(const [id,hp]of Object.entries(this.exhibitionSnapshot.hp))state.pet(id).hp=hp;}
    state.save();
    this.cameras.main.fadeOut(300, 255, 255, 255);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      B.close();
      const done = this.opts.done;
      this.scene.stop();
      done && done({ outcome, kod: this.kod });
    });
  }
}
