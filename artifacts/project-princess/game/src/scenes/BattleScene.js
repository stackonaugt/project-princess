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
import { form, canEvolve, evolve, petTex, isEvolved } from '../systems/forms.js';
import { friendInfo, ASSIST_HEARTS } from '../data/friends.js';
import { ZONES, npcZone } from '../data/regions.js';
import { state } from '../systems/state.js';
import { sfx } from '../systems/sfx.js';
import { isNight } from '../systems/clock.js';
import { battleUI as B } from '../ui/battle.js';
import { itemIcon, petIcon } from '../ui/images.js';
import { custom, playerTexture } from '../art/textures.js';
import { hash } from '../util.js';
import { createBattleEffectTextures, playBattleAnimation } from '../systems/battle-animations.js';
import { moveAnimations } from '../data/move-animations.js';
import { playEvolution } from '../systems/evolution-fx.js';
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
    this.panelObserver = new ResizeObserver(() => this.layout());
    this.panelObserver.observe(document.querySelector('.bt-panel'));
    this.events.once('shutdown', () => { this.scale.off('resize', this.layout, this); this.panelObserver.disconnect(); });
    this.cameras.main.fadeIn(250, 255, 255, 255);
    this.run().catch(err => { console.error(err); this.finish('run'); });
  }

  npcKey(id) {
    if (custom.has(`npc-${id}`)) return `npc-${id}`;
    return this.textures.exists(`npc-${id}-down`) && NPCS[id] ? `npc-${id}-down` : null;
  }

  // ------------------------------------------------------------ layout & drawing
  layout() {
    // Message-panel resizing must not move the ground beneath an active tween.
    // Reconcile both fighters and their pads together when the move finishes.
    if (this.animating) return;
    const W = this.scale.width, H = this.scale.height;
    const panel = B.panelHeight() || 170, field = H - panel;
    document.getElementById('battle').style.setProperty('--bt-panel', `${panel}px`);
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
    const target = (f?.petId ? petSize(f.petId, isEvolved(f.petId)) : tall ? 26 : fr.height > 18 && !custom.has(key) ? fr.height : 16) * this.unit;
    const requested=f?.petId || custom.has(key) || tall ? target / fr.height : this.unit;
    const field=this.scale.height-(B.panelHeight()||170);
    return Math.min(requested,this.scale.width*.38/fr.width,Math.max(48,field*.40)/fr.height);
  }
  place(spr, f, pos) {
    if (!f || !spr.visible) return;
    spr.setOrigin(.5, this.footOrigin(spr.texture.key)).setScale(this.scaleFor(spr.texture.key, f)).setPosition(pos.x, pos.y - this.unit);
  }
  footOrigin(key) {
    this.footOrigins ||= new Map();
    if (this.footOrigins.has(key)) return this.footOrigins.get(key);
    const texture = this.textures.get(key), frame = texture.has(0) ? texture.get(0) : texture.get();
    let origin = 1;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = frame.cutWidth; canvas.height = frame.cutHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(texture.getSourceImage(), frame.cutX, frame.cutY, frame.cutWidth, frame.cutHeight, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      outer: for (let y = canvas.height - 1; y >= 0; y--) for (let x = 0; x < canvas.width; x++) {
        if (pixels[(y * canvas.width + x) * 4 + 3] > 32) { origin = (y + 1) / canvas.height; break outer; }
      }
    } catch (error) { console.warn(`Could not inspect grounding for ${key}`, error); }
    this.footOrigins.set(key, origin); return origin;
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
    const names = (this.opts.exhibition ? ['exhibition'] : [this.opts.region, this.opts.suburb, 'default']).filter(Boolean);
    const keys = names.flatMap(name => night ? [`battlebg-${name}-night`, `battlebg-${name}`] : [`battlebg-${name}`]);
    const background = keys.find(key => custom.has(key) && this.textures.exists(key));
    this.backgroundArt.setVisible(Boolean(background));
    if (background) {
      const field = Math.max(1, H - (B.panelHeight() || 170));
      // Cover, not squash: keep the art's shape, centre it and take a slice
      // that fills the field (a phone shows the middle of a wide picture).
      const src = this.textures.get(background).getSourceImage();
      const k = Math.max(W / src.width, field / src.height);
      this.backgroundArt.setTexture(background).setOrigin(0.5, 1).setPosition(W / 2, field).setDisplaySize(src.width * k, src.height * k);
      return;
    }
    if (this.opts.exhibition) {
      const field = H - (B.panelHeight() || 170);
      g.fillStyle(0xe2d7bc).fillRect(0, 0, W, field);
      g.fillStyle(0x6d7772).fillRect(0, 0, W, hz * .18);
      for (let x = 8 * u; x < W; x += 23 * u) {
        g.fillStyle(0xf1e5c5).fillRect(x, hz * .18, 4 * u, hz * .82);
        g.fillStyle(0x9b8360).fillRect(x - u, hz - 3 * u, 6 * u, 3 * u);
      }
      g.fillStyle(0x947d62).fillRect(0, hz - 4 * u, W, 4 * u);
      for (let i = 0; i < 10; i++) {
        const x = W * (i + .5) / 10;
        g.fillStyle([0xc28d68, 0xedc5a0, 0x9b7056][i % 3]).fillCircle(x, hz - 7 * u, 2 * u);
        g.fillStyle([0x607a8b, 0xa47788, 0x72936b][i % 3]).fillRect(x - 2 * u, hz - 5 * u, 4 * u, 3 * u);
        g.fillStyle([0xc15d4f, 0xe6c263, 0x609b95][i % 3]).fillTriangle(x - 2 * u, hz * .22, x + 2 * u, hz * .22, x, hz * .22 + 4 * u);
      }
      g.fillStyle(0xc9b28d).fillRect(0, hz, W, field - hz);
      g.lineStyle(1, 0x9e886a, .55);
      for (let y = hz; y < field; y += 7 * u) g.lineBetween(0, y, W, y);
      g.fillStyle(0x658f77).fillRect(W * .06, hz + 3 * u, W * .88, Math.max(1, field - hz - 4 * u));
      g.lineStyle(2, 0xe4d3a0).strokeRect(W * .06, hz + 3 * u, W * .88, Math.max(1, field - hz - 4 * u));
      for (const p of [this.minePos, this.foePos]) {
        g.fillStyle(0x53765f).fillEllipse(p.x, p.y - u, 30 * u, 6 * u);
      }
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
    createBattleEffectTextures(this);
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

  // One animation per move kind (or a list, played in turn). hit = the move does damage.
  async play(anim, user, target, type, hit) {
    for (const a of [].concat(anim)) await playBattleAnimation(this, a, user, target, type, hit, sfx);
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
          const m = MOVES[id], eff = R.knownEffect(m.type, this.foe.type);
          const note = m.power ? `Power ${m.power}${eff > 1 ? ' · Strong!' : eff !== null && eff < 1 ? ' · Weak' : ''}` : this.effectNote(m.effect);
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
      await this.play(moveAnimations(id, m), user, target, m.type, true);
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
      await this.play(moveAnimations(id, m), user, target, m.type, false);
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

  // Evolution, Pokémon style (systems/evolution-fx.js): glow, the two forms
  // flicker faster and faster, a burst of light, then the new form and a fanfare.
  async evolveFighter(f) {
    if (f.evolving || !canEvolve(f.petId, f.level)) return;
    f.evolving = true;
    const id = f.petId, before = f.name, active = f === this.mine && this.mineSpr.visible;
    await this.say(`What's this? ${before} is changing!`);
    const becomeNewForm = () => {
      evolve(id);
      const d = form(id);
      Object.assign(f, { name: d.name, type: d.type, base: d.stats, moves: d.moves, tex: petTex(id), stages: { atk: 0, def: 0 } });
      f.stats = R.fighterStats(f); f.maxHp = f.stats.hp; f.hp = f.maxHp;
      if (active) {
        this.setFighterSprite(this.mineSpr, f);
        this.mineSpr.setOrigin(.5, this.footOrigin(f.tex)).setPosition(this.minePos.x, this.minePos.y - this.unit);
      }
    };
    if (active) {
      this.animating = true;
      try {
        this.tweens.killTweensOf(this.mineSpr);
        await playEvolution(this, this.mineSpr, { from: f.tex, to: `pet-${id}-evolved`, reveal: becomeNewForm });
      } finally { this.animating = false; }
      if (!isEvolved(id)) becomeNewForm();
      this.layout();
      this.showMine();
    } else {
      becomeNewForm();
      sfx.evolveFanfare();
    }
    f.evolving = false;
    const d = form(id);
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
