// The main game scene: one region at a time. Restarted (with new data)
// whenever you walk to another suburb or catch a train.

import { TILE as T, GROUND_SCALE, MIN_TILES_SHORT_SIDE, MS_PER_GAME_MINUTE, DAY_START, DAY_END, FRIENDSHIP } from '../config.js';
import { REGIONS, REGION_ORDER, getMap } from '../data/regions.js';
import { PETS } from '../data/pets.js';
import { NPCS } from '../data/npcs.js';
import { ITEMS } from '../data/items.js';
import { TYPES } from '../data/types.js';
import { flavourFor } from '../data/flavour.js';
import { OBJECTS, LIGHT_SOURCES } from '../art/paint/objects.js';
import { paintGround, TILE_NAMES } from '../art/paint/tiles.js';
import { painter } from '../art/paint/painter.js';
import { custom, objectTexture, tuftTexture, fitScale } from '../art/textures.js';
import { Player, Pet, Npc, toWorld } from '../world/entities.js';
import { Traffic } from '../world/traffic.js';
import { state } from '../systems/state.js';
import { controls } from '../systems/controls.js';
import { darkness, isNight, timeLabel } from '../systems/clock.js';
import { sfx } from '../systems/sfx.js';
import { ui } from '../ui/ui.js';
import { setImageScene, petPortrait, npcIcon, itemIcon } from '../ui/images.js';
import { bus } from '../bus.js';
import { hash, pick, clamp } from '../util.js';

export class WorldScene extends Phaser.Scene {
  constructor() { super('World'); }

  init(data) {
    this.regionId = data.region || state.data.region;
    this.entryName = data.entry || null;
    this.newDay = !!data.newDay;
    this.firstLoad = !!data.firstLoad;
    this.leaving = false; this.endingDay = false; this.pending = null; this.lockedExit = null;
  }

  create() {
    const region = REGIONS[this.regionId];
    this.region = region;
    this.map = getMap(this.regionId);
    state.data.region = this.regionId;
    const firstVisit = !state.data.visited.includes(this.regionId);
    state.visit(this.regionId);
    setImageScene(this); ui.scene = this;
    this.tuftKey = tuftTexture(this, this.regionId, region.grass);
    this.talkIndex = {};

    this.buildGround();
    this.buildCollision();
    this.buildObjects();
    this.buildDecor();
    this.buildForage();

    const spawn = this.spawnPoint();
    this.player = new Player(this, spawn.x, spawn.y, spawn.dir);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.layer);

    this.pets = PETS.filter(p => p.region === this.regionId).map(p => {
      const pet = new Pet(this, p);
      this.physics.add.collider(pet, this.layer);
      pet.on('pointerdown', (ptr, lx, ly, ev) => { ev.stopPropagation(); this.tapTarget({ kind: 'pet', ref: pet }); });
      return pet;
    });
    this.npcs = this.map.npcs.filter(n => NPCS[n.id]).map(n => {
      const npc = new Npc(this, n.id, NPCS[n.id], n);
      npc.on('pointerdown', (ptr, lx, ly, ev) => { ev.stopPropagation(); this.tapTarget({ kind: 'npc', ref: npc }); });
      return npc;
    });
    this.physics.add.collider(this.player, this.npcs);
    this.traffic = new Traffic(this, this.map.lanes);

    this.setupLighting();
    this.setupRain();
    this.prompt = this.add.image(0, 0, 'fx-bubble-talk').setOrigin(0.5, 1).setDepth(9600).setVisible(false);
    this.tapMarker = this.add.image(0, 0, 'fx-sparkle').setDepth(9600).setVisible(false).setScale(2);

    this.setupCamera();
    this.input.on('pointerdown', p => this.onTap(p));
    ui.worldAction = () => this.interact();

    const offs = [
      bus.on('layout:changed', () => this.onResize()),
      bus.on('game:save', () => this.save()),
      bus.on('ui:modal', () => controls.release()),
    ];
    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', () => { offs.forEach(f => f()); this.scale.off('resize', this.onResize, this); });
    this.time.addEvent({ delay: 8000, loop: true, callback: () => this.save() });

    this.cameras.main.fadeIn(350, 20, 30, 18);
    ui.updateHud(this.regionId);
    this.lastLabel = '';
    this.wasRaining = state.isRaining();
    if (this.newDay) {
      const rain = state.rainWindow();
      ui.banner(`Day ${state.data.day}`, rain ? `Forecast: showers around ${timeLabel(rain[0])}` : 'Forecast: clear skies');
    } else ui.banner(region.name, region.tagline);
    this.save();
    this.intro(firstVisit);
  }

  // ------------------------------------------------------------ building
  buildGround() {
    const key = `ground-${this.regionId}`;
    if (!this.textures.exists(key)) {
      const { w, h } = this.map;
      const tex = this.textures.createCanvas(key, w * T * GROUND_SCALE, h * T * GROUND_SCALE);
      const p = painter(tex.getContext());
      p.ctx.scale(GROUND_SCALE, GROUND_SCALE);
      const tiles = {};
      for (const name of Object.values(TILE_NAMES)) if (custom.has(`tile-${name}`)) tiles[name] = this.textures.get(`tile-${name}`).getSourceImage();
      paintGround(p, this.map, this.region.grass, tiles);
      tex.refresh();
    }
    this.add.image(0, 0, key).setOrigin(0).setScale(1 / GROUND_SCALE).setDepth(-1000);
    // Water sparkles
    for (let y = 0; y < this.map.h; y++) for (let x = 0; x < this.map.w; x++) {
      if (this.map.ground[y][x] !== '~' || hash(x, y, 5) > 0.3) continue;
      const s = this.add.image(x * T + 3 + hash(x, y, 6) * 10, y * T + 4 + hash(x, y, 7) * 9, 'fx-sparkle').setDepth(-999).setAlpha(0);
      this.tweens.add({ targets: s, alpha: 0.9, duration: 700, yoyo: true, repeat: -1, delay: hash(x, y, 8) * 3000, repeatDelay: 1500 + hash(x, y, 9) * 2500 });
    }
  }

  buildCollision() {
    const { w, h, solid } = this.map;
    const data = [];
    for (let y = 0; y < h; y++) { const row = []; for (let x = 0; x < w; x++) row.push(solid[y * w + x] ? 1 : -1); data.push(row); }
    const tm = this.make.tilemap({ data, tileWidth: T, tileHeight: T });
    const ts = tm.addTilesetImage('collide', 'tex-collide', T, T, 0, 0);
    this.layer = tm.createLayer(0, ts, 0, 0).setVisible(false);
    this.layer.setCollision(1);
    this.physics.world.setBounds(0, 0, w * T, h * T);
  }

  buildObjects() {
    this.interactables = [];
    this.lights = [];
    for (const o of this.map.objects) {
      const def = OBJECTS[o.kind];
      const key = objectTexture(this, o);
      const x = (o.x + o.w / 2) * T, y = (o.y + o.h) * T;
      const img = this.add.image(x, y, key).setOrigin(0.5, 1).setDepth(y - 0.1);
      if (custom.has(key)) img.setScale(def.tex[0] / img.width);
      o.sprite = img;
      if (o.kind === 'sign' && o.text) this.interactables.push({ kind: 'sign', x, y: y - 6, lines: o.text, bubble: 'fx-bubble-read' });
      else if (o.travel) this.interactables.push({ kind: 'travel', x, y: y - 6, bubble: 'fx-bubble-read' });
      else {
        const lines = flavourFor(o.kind, o.v);
        if (lines) this.interactables.push({ kind: 'look', x, y: y - 4, r: Math.max(16, o.w * 8), lines, bubble: 'fx-bubble-dots', quiet: true });
      }
      const light = LIGHT_SOURCES[o.kind];
      if (light) {
        const sx = x - def.tex[0] / 2 + light.x, sy = y - def.tex[1] + light.y;
        const g = this.add.image(sx, sy, 'fx-glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(9001).setScale(light.r * 2 / 64).setAlpha(0);
        this.lights.push(g);
      }
    }
  }

  buildDecor() {
    this.ducks = []; this.magpies = [];
    for (const d of this.map.decor) {
      if (d.kind === 'duck') for (let i = 0; i < d.n; i++) {
        const a = Math.random() * Math.PI * 2, r = Math.random();
        const duck = this.add.sprite((d.cx + 0.5 + Math.cos(a) * d.rx * r) * T, (d.cy + 0.5 + Math.sin(a) * d.ry * r) * T, 'fx-duck', 0).play('fx-duck-swim');
        duck.area = d; duck.next = 0;
        this.ducks.push(duck);
      }
      if (d.kind === 'magpie') for (const [x, y] of d.points) {
        const m = this.add.sprite((x + 0.5) * T, (y + 0.8) * T, 'fx-magpie', 0).setOrigin(0.5, 1);
        m.home = { x: m.x, y: m.y }; m.next = 0;
        this.magpies.push(m);
      }
    }
  }

  buildForage() {
    this.forage = [];
    this.map.spawns.forEach((s, i) => {
      if (state.forageTaken(this.regionId, i)) return;
      const item = s.items[Math.floor(hash(state.data.day, i, this.regionId.length * 31) * s.items.length)];
      const pos = toWorld(s.x, s.y);
      const key = `item-${item}`;
      const img = this.add.image(pos.x, pos.y - 2, key).setOrigin(0.5, 1).setDepth(pos.y);
      img.setScale(fitScale(this, key, 12));
      this.tweens.add({ targets: img, y: pos.y - 5, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.forage.push({ kind: 'item', item, index: i, x: pos.x, y: pos.y, sprite: img, bubble: 'fx-bubble-alert' });
    });
  }

  spawnPoint() {
    const e = this.map.entries;
    let entry = this.entryName && e[this.entryName];
    if (!entry && !this.entryName && state.data.pos && state.data.region === this.regionId && !this.solidAt(state.data.pos.x, state.data.pos.y)) {
      return { ...state.data.pos, dir: state.data.dir };
    }
    entry = entry || e.start || e.station || Object.values(e)[0];
    return { ...toWorld(entry.x, entry.y), dir: entry.dir };
  }

  // ------------------------------------------------------------ lighting & weather
  setupLighting() {
    const W = this.map.w * T, H = this.map.h * T;
    this.night = this.add.rectangle(0, 0, W, H, 0x0b1436).setOrigin(0).setDepth(9000).setAlpha(0);
    this.dusk = this.add.rectangle(0, 0, W, H, 0xff8a3a).setOrigin(0).setDepth(8999).setAlpha(0);
  }
  updateLighting() {
    const m = state.data.minutes, dark = darkness(m), rain = state.isRaining() ? 0.18 : 0;
    this.night.setAlpha(Math.min(0.62, dark * 0.55 + rain));
    const duskAmt = m > 17.5 * 60 && m < 20.5 * 60 ? Math.sin((m - 17.5 * 60) / 180 * Math.PI) * 0.12 : 0;
    this.dusk.setAlpha(duskAmt);
    const glow = clamp((dark - 0.25) * 1.4, 0, 1);
    for (const g of this.lights) g.setAlpha(glow * (0.85 + Math.sin(this.time.now / 300 + g.x) * 0.05));
  }
  setupRain() {
    this.rainZone = new Phaser.Geom.Rectangle(0, 0, 400, 1);
    this.rain = this.add.particles(0, 0, 'fx-rain', {
      emitZone: { type: 'random', source: this.rainZone },
      lifespan: 1600, speedY: { min: 260, max: 320 }, speedX: { min: -50, max: -30 },
      quantity: 3, frequency: 18, alpha: { start: 0.85, end: 0.4 }, emitting: false,
    }).setDepth(9002);
  }
  updateRain() {
    const raining = state.isRaining();
    const v = this.cameras.main.worldView;
    this.rainZone.setTo(v.x - 20, v.y - 20, v.width + 60, 1);
    if (raining && !this.rain.emitting) this.rain.start();
    if (!raining && this.rain.emitting) this.rain.stop();
    if (raining && !this.wasRaining) ui.banner('Four seasons in one day', 'A Melbourne shower rolls in');
    this.wasRaining = raining;
  }

  // ------------------------------------------------------------ camera
  setupCamera() {
    const cam = this.cameras.main;
    cam.setBounds(0, 0, this.map.w * T, this.map.h * T);
    cam.setRoundPixels(true);
    cam.startFollow(this.player, true, 0.2, 0.2);
    this.onResize();
  }
  onResize() {
    const cam = this.cameras.main;
    const w = this.scale.width, h = this.scale.height;
    let zoom = Math.max(1, Math.floor(Math.min(w, h) / (MIN_TILES_SHORT_SIDE * T)));
    zoom = Math.max(zoom, Math.ceil(Math.max(w / (this.map.w * T), h / (this.map.h * T))));
    cam.setZoom(zoom);
    // Keep the player in the middle of the area not covered by the HUD and touch controls.
    const hud = 56, pad = controls.touchMode ? Math.min(200, h * 0.3) : 0;
    cam.setFollowOffset(0, -(pad - hud) / 2 / zoom);
  }

  // ------------------------------------------------------------ queries
  groundAt(x, y) {
    const tx = Math.floor(x / T), ty = Math.floor(y / T);
    return this.map.ground[ty]?.[tx] ?? null;
  }
  solidAt(x, y) {
    const tx = Math.floor(x / T), ty = Math.floor(y / T);
    if (tx < 0 || ty < 0 || tx >= this.map.w || ty >= this.map.h) return true;
    return !!this.map.solid[ty * this.map.w + tx];
  }

  candidates() {
    return [
      ...this.pets.map(p => ({ kind: 'pet', ref: p, x: p.x, y: p.y - 4 })),
      ...this.npcs.map(n => ({ kind: 'npc', ref: n, x: n.x, y: n.y - 4 })),
      ...this.forage,
      ...this.interactables,
    ];
  }
  findTarget() {
    const p = this.player, [fx, fy] = p.facing();
    const px = p.x + fx * 10, py = p.y - 4 + fy * 10;
    let best = null, bd = Infinity;
    for (const c of this.candidates()) {
      const r = c.r || 16;
      const d = Math.hypot(c.x - px, c.y - py), d2 = Math.hypot(c.x - p.x, c.y - (p.y - 4));
      const score = c.quiet ? d + 6 : d;
      if ((d < r || d2 < 13) && score < bd) { bd = score; best = c; }
    }
    return best;
  }
  bubbleFor(t) {
    if (t.kind === 'pet') {
      const pet = t.ref;
      if (!state.isFound(pet.id)) return 'fx-bubble-talk';
      if (pet.asleep) return 'fx-bubble-zzz';
      const rec = state.pet(pet.id);
      if (rec.giftedDay !== state.data.day && state.bagItems().length) return 'fx-bubble-gift';
      return 'fx-bubble-heart';
    }
    if (t.kind === 'npc') return t.ref.info.gift && state.data.npcDay[t.ref.id] !== state.data.day ? 'fx-bubble-gift' : 'fx-bubble-talk';
    return t.bubble;
  }

  // ------------------------------------------------------------ input
  onTap(pointer) {
    if (ui.blocking() || this.leaving) return;
    const wx = pointer.worldX, wy = pointer.worldY;
    let best = null, bd = 14;
    for (const c of this.candidates()) {
      if (c.kind === 'pet' || c.kind === 'npc') continue; // they handle their own taps
      const d = Math.hypot(c.x - wx, c.y - 4 - wy);
      if (d < bd) { bd = d; best = c; }
    }
    if (best) return this.tapTarget(best);
    if (this.solidAt(wx, wy)) return;
    this.pending = null;
    this.player.target = { x: wx, y: wy + 2 };
    this.tapMarker.setPosition(wx, wy).setVisible(true).setAlpha(1);
    this.tweens.add({ targets: this.tapMarker, alpha: 0, duration: 600, onComplete: () => this.tapMarker.setVisible(false) });
  }
  tapTarget(t) {
    if (ui.blocking() || this.leaving) return;
    const x = t.ref ? t.ref.x : t.x, y = t.ref ? t.ref.y : t.y;
    if (Math.hypot(x - this.player.x, y - this.player.y) < 30) return this.interact(t);
    this.pending = t;
    this.player.target = { x, y: y + 8 };
  }

  facePlayerTo(x, y) {
    const dx = x - this.player.x, dy = y - this.player.y;
    this.player.setDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  }

  async interact(t = this.findTarget()) {
    if (!t || ui.blocking() || this.leaving) return;
    this.player.target = null; this.pending = null;
    this.player.setVelocity(0, 0);
    this.facePlayerTo(t.ref ? t.ref.x : t.x, t.ref ? t.ref.y : t.y);
    if (t.kind === 'pet') return this.talkToPet(t.ref);
    if (t.kind === 'npc') return this.talkToNpc(t.ref);
    if (t.kind === 'item') return this.pickUp(t);
    if (t.kind === 'travel') return this.travel();
    if (t.kind === 'sign') return ui.say(t.lines);
    if (t.kind === 'look') return ui.say(pick(t.lines));
  }

  // ------------------------------------------------------------ pets
  heartsFx(target, n = 3) {
    for (let i = 0; i < n; i++) {
      const h = this.add.image(target.x - 6 + Math.random() * 12, target.y - 14, 'fx-heart').setDepth(9700);
      this.tweens.add({ targets: h, y: h.y - 14 - Math.random() * 10, alpha: 0, duration: 1100 + Math.random() * 400, delay: i * 90, onComplete: () => h.destroy() });
    }
  }

  async talkToPet(pet) {
    const d = pet.data_, rec = state.pet(d.id), day = state.data.day;
    const opts = { name: d.name, portrait: petPortrait(d.id) };
    pet.pause(5); pet.facePoint(this.player.x);
    this.heartsFx(pet, 2);

    if (!rec.found) {
      state.findPet(d.id);
      rec.talkedDay = day; rec.chats++; state.data.stats.chats++;
      state.addPoints(d.id, FRIENDSHIP.talk);
      sfx.found(); this.heartsFx(pet, 6);
      ui.banner('New Petdex entry!', d.name);
      const lines = [
        `You found ${d.name}, the ${TYPES[d.type].name.toLowerCase()} type ${d.species.toLowerCase()}!`,
        d.bio,
        `${d.name} was added to your Petdex.`,
      ];
      if (state.foundCount() === PETS.length) lines.push("That's everyone! Every pet in Melbourne is your friend now. Well, these ones. For now.");
      else lines.push('Come back every day for a chat. Pets love treats, too.');
      this.save();
      return ui.say(lines, opts);
    }
    if (pet.asleep) return ui.say([pick(d.asleep)], opts);

    const hearts = state.hearts(d.id);
    const tiers = Object.keys(d.lines).map(Number).filter(n => n <= hearts).sort((a, b) => b - a);
    let pool = Math.random() < 0.5 ? d.lines[tiers[0]] : tiers.flatMap(t => d.lines[t]);
    if (isNight(state.data.minutes) && d.night && Math.random() < 0.5) pool = d.night;
    if (state.isRaining() && d.rain && Math.random() < 0.5) pool = d.rain;
    const lines = [pick(pool)];
    if (rec.talkedDay !== day) {
      rec.talkedDay = day; rec.chats++; state.data.stats.chats++;
      const r = state.addPoints(d.id, FRIENDSHIP.talk);
      sfx.heart();
      lines.push(...this.heartLines(d, r));
    }
    await ui.say(lines, opts);

    if (rec.giftedDay !== day && state.bagItems().length) {
      const choice = await ui.say({
        text: `Give ${d.name} a treat?`,
        choices: [...state.bagItems().map(id => ({ label: ITEMS[id].name, value: id, icon: itemIcon(id, 32), note: `×${state.count(id)}` })), { label: 'Not now', value: null }],
      }, { ...opts, cancelValue: null });
      if (choice) await this.giveTreat(pet, choice, opts);
    }
    this.save();
  }

  heartLines(d, { before, after }) {
    if (after <= before) return [];
    const lines = [`Your friendship with ${d.name} grew to ${after} ${after === 1 ? 'heart' : 'hearts'}!`];
    if (after === 2) lines.push(`You learned a fun fact about ${d.name}. Check the Petdex.`);
    if ([3, 6, 9].includes(after)) lines.push(`${d.name} seems more comfortable around you now.`);
    if (after === 10) lines.push(`${d.name} is now your best friend. Nothing will ever be the same.`);
    return lines;
  }

  async giveTreat(pet, item, opts) {
    const d = pet.data_, rec = state.pet(d.id), name = ITEMS[item].name.toLowerCase();
    const reaction = d.loves.includes(item) ? 'love' : d.likes.includes(item) ? 'like' : d.dislikes.includes(item) ? 'dislike' : 'neutral';
    state.removeItem(item);
    rec.giftedDay = state.data.day; rec.reactions[item] = reaction;
    state.data.stats.gifts++;
    const r = state.addPoints(d.id, FRIENDSHIP[reaction]);
    const text = {
      love: `${d.name} absolutely LOVES the ${name}! This is the best day of ${d.name}'s life.`,
      like: `${d.name} likes the ${name}. Good choice.`,
      neutral: `${d.name} accepts the ${name} politely.`,
      dislike: `${d.name} does not like the ${name}. Not one bit. You are being judged.`,
    }[reaction];
    if (reaction === 'love') { sfx.heart(); this.heartsFx(pet, 8); pet.emote('fx-bubble-heart', 2000); }
    else if (reaction === 'dislike') { sfx.sad(); pet.emote('fx-bubble-dots', 1600); }
    else { sfx.heart(); this.heartsFx(pet, 3); }
    await ui.say([text, ...this.heartLines(d, r)], opts);
  }

  // ------------------------------------------------------------ people, items, trains
  async talkToNpc(npc) {
    const info = npc.info, day = state.data.day;
    const opts = { name: info.name, portrait: npcIcon(npc.id) };
    npc.pause(5); npc.faceTowards(this.player.x, this.player.y);
    const hints = Object.entries(info.hints || {}).filter(([id]) => !state.isFound(id));
    let lines;
    if (hints.length && Math.random() < 0.6) lines = [hints[0][1]];
    else {
      const i = this.talkIndex[npc.id] = ((this.talkIndex[npc.id] ?? Math.floor(Math.random() * info.lines.length)) + 1) % info.lines.length;
      lines = info.lines[i];
    }
    await ui.say(lines, opts);
    if (info.gift && state.data.npcDay[npc.id] !== day) {
      state.data.npcDay[npc.id] = day;
      state.addItem(info.gift); state.data.stats.treats++;
      sfx.pickup();
      ui.toast(`+1 ${ITEMS[info.gift].name}`, itemIcon(info.gift, 32));
      await ui.say([info.giftLine, `You got: ${ITEMS[info.gift].name}.`], opts);
      this.save();
    }
  }

  pickUp(f) {
    this.forage = this.forage.filter(x => x !== f);
    state.takeForage(this.regionId, f.index);
    state.addItem(f.item); state.data.stats.treats++;
    sfx.pickup();
    this.tweens.killTweensOf(f.sprite);
    this.tweens.add({ targets: f.sprite, y: f.sprite.y - 12, alpha: 0, duration: 400, onComplete: () => f.sprite.destroy() });
    ui.toast(`+1 ${ITEMS[f.item].name}`, itemIcon(f.item, 32));
    this.save();
  }

  async travel() {
    sfx.myki();
    const options = REGION_ORDER.filter(r => r !== this.regionId && state.data.visited.includes(r));
    if (!options.length) {
      return ui.say(['You tap your myki. Beep beep.', 'The screen only lists stations you have already visited. Walk to another suburb first, then you can catch the train back and forth.']);
    }
    const choice = await ui.say({
      text: 'You tap your myki. Beep beep. Where to?',
      choices: [...options.map(r => ({ label: `${REGIONS[r].name} Station`, value: r })), { label: 'Stay here', value: null }],
    }, { cancelValue: null });
    if (choice) this.goTo(choice, 'station', 25);
  }

  goTo(region, entry, minutes = 20) {
    if (this.leaving) return;
    this.leaving = true;
    state.data.minutes += minutes;
    state.data.region = region; state.data.pos = null;
    state.save();
    controls.release();
    this.cameras.main.fadeOut(350, 20, 30, 18);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.restart({ region, entry }));
  }

  async endDay() {
    if (this.endingDay) return;
    this.endingDay = true;
    await ui.say(["It's 2am. You are exhausted.", 'You catch the last train home and fall asleep the moment your head hits the pillow.']);
    state.data.day += 1; state.data.minutes = DAY_START; state.data.pos = null;
    state.save();
    this.leaving = true;
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.restart({ region: this.regionId, entry: 'station', newDay: true }));
  }

  checkExits() {
    const tx = Math.floor(this.player.x / T), ty = Math.floor((this.player.y - 1) / T);
    const ex = this.map.exits.find(e => tx >= e.x && tx < e.x + e.w && ty >= e.y && ty < e.y + e.h);
    if (!ex) { this.lockedExit = null; return; }
    if (ex.to) return this.goTo(ex.to, ex.entry, 20);
    if (this.lockedExit === ex) return;
    this.lockedExit = ex;
    sfx.bump();
    const back = { x: ex.x === 0 ? 1 : ex.x === this.map.w - 1 ? -1 : 0, y: ex.y === 0 ? 1 : ex.y === this.map.h - 1 ? -1 : 0 };
    this.player.setPosition(this.player.x + back.x * 10, this.player.y + back.y * 10);
    this.player.target = null;
    ui.say(ex.label ? ex.lines || [`The way to ${ex.label} is closed for now.`] : ['The way is closed.']);
  }

  // ------------------------------------------------------------ saving & intro
  save() {
    if (window.__ppResetting || !this.player || this.leaving) { if (!window.__ppResetting) state.save(); return; }
    state.data.pos = { x: Math.round(this.player.x), y: Math.round(this.player.y) };
    state.data.dir = this.player.dir;
    state.data.region = this.regionId;
    state.save();
  }

  async intro(firstVisit) {
    if (!this.firstLoad) {
      if (firstVisit) ui.toast(`New station unlocked: ${this.region.name}`);
      return;
    }
    if (state.migrated) {
      state.migrated = false;
      await ui.say(['Welcome back to Project Princess!', 'Your Petdex from the old version came with you. Melbourne has grown a fair bit since you were last here.']);
    }
    if (!state.data.seenIntro) {
      await ui.say([
        'Welcome to Project Princess!',
        "Your friends' pets are scattered across Laverton, Brunswick and Reservoir.",
        controls.touchMode
          ? 'Drag on the left side of the screen to walk. Tap A to talk to pets, people and signs. Tap things to walk to them.'
          : 'Walk with the arrow keys or WASD. Hold Shift to run. Press Space to talk to pets, people and signs.',
        'Chat to each pet once a day and bring them treats to become friends. Check the Petdex to see who is still missing.',
        "You've just stepped off the train at Laverton. Rumour has it a very fluffy poodle runs this suburb.",
      ]);
      state.data.seenIntro = true;
      this.save();
    }
  }

  // ------------------------------------------------------------ main loop
  update(time, delta) {
    const dt = Math.min(0.05, delta / 1000);
    const blocked = ui.blocking() || this.leaving;

    if (!blocked) {
      state.data.minutes += delta / MS_PER_GAME_MINUTE;
      if (state.data.minutes >= DAY_END) this.endDay();
    }
    const label = `${state.data.day}${timeLabel(state.data.minutes)}${state.isRaining()}`;
    if (label !== this.lastLabel) { this.lastLabel = label; ui.updateHud(this.regionId); }

    this.player.update(controls.vector(), blocked);
    if (this.pending) {
      const t = this.pending, x = t.ref ? t.ref.x : t.x, y = t.ref ? t.ref.y : t.y;
      if (Math.hypot(x - this.player.x, y - this.player.y) < 24) this.interact(t);
      else if (!this.player.target) this.pending = null;
      else this.player.target = { x, y: y + 8 };
    }
    for (const p of this.pets) p.update(this.player, dt, blocked);
    for (const n of this.npcs) n.update(this.player, dt, blocked);
    this.traffic.update(dt, this.player, blocked);
    this.updateDecor(dt, blocked);
    this.updateLighting();
    this.updateRain();
    if (!blocked) this.checkExits();

    const t = blocked ? null : this.findTarget();
    if (t) {
      const ref = t.ref || t, top = t.ref ? t.ref.y - t.ref.displayHeight : t.y - 14;
      this.prompt.setTexture(this.bubbleFor(t)).setPosition(Math.round(ref.x), Math.round(top - 2 + (Math.floor(time / 400) % 2 ? -1 : 0))).setVisible(true);
    } else this.prompt.setVisible(false);
  }

  updateDecor(dt, frozen) {
    if (frozen) return;
    const now = this.time.now;
    for (const duck of this.ducks) {
      duck.setDepth(duck.y);
      if (now < duck.next) continue;
      duck.next = now + 3000 + Math.random() * 5000;
      const a = duck.area, ang = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random());
      const tx = (a.cx + 0.5 + Math.cos(ang) * a.rx * r) * T, ty = (a.cy + 0.5 + Math.sin(ang) * a.ry * r) * T;
      duck.setFlipX(tx < duck.x);
      this.tweens.add({ targets: duck, x: tx, y: ty, duration: 2500 + Math.random() * 2000, ease: 'Sine.easeInOut' });
      if (Math.hypot(duck.x - this.player.x, duck.y - this.player.y) < 60 && Math.random() < 0.3) sfx.quack();
    }
    for (const m of this.magpies) {
      m.setDepth(m.y);
      const near = Math.hypot(m.x - this.player.x, m.y - this.player.y) < 26;
      if (!near && now < m.next) continue;
      m.next = now + 1500 + Math.random() * 3000;
      const dist = near ? 30 : 8;
      let tx = m.x, ty = m.y;
      for (let i = 0; i < 6; i++) {
        const a = Math.random() * Math.PI * 2;
        const cx = (near ? m.x : m.home.x) + Math.cos(a) * dist, cy = (near ? m.y : m.home.y) + Math.sin(a) * dist * 0.7;
        if (!this.solidAt(cx, cy) && (!near || Math.hypot(cx - this.player.x, cy - this.player.y) > 30)) { tx = cx; ty = cy; break; }
      }
      m.setFlipX(tx < m.x);
      m.play('fx-magpie-hop');
      this.tweens.add({ targets: m, x: tx, duration: near ? 350 : 500, onComplete: () => { m.stop(); m.setFrame(0); } });
      this.tweens.add({ targets: m, y: { from: m.y, to: ty }, duration: near ? 350 : 500 });
      this.tweens.add({ targets: m, scaleY: 1.15, duration: near ? 175 : 120, yoyo: true });
    }
  }
}
