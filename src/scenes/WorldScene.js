// The main game scene: one region at a time. Restarted (with new data)
// whenever you walk to another suburb or catch a train.

import { ENCOUNTER_RATE, TILE as T, GROUND_SCALE, MIN_TILES_SHORT_SIDE, MS_PER_GAME_MINUTE, DAY_START, DAY_END, FRIENDSHIP } from '../config.js';
import { ZONES, SUBURBS, SUBURB_ORDER, getMap } from '../data/regions.js';
import { PETS } from '../data/pets.js';
import { NPCS } from '../data/npcs.js';
import { PEOPLE } from '../data/dialogue.js';
import { isAt, inMeeting, isMeetingDay, weekday } from '../data/routines.js';
import { todayJobs } from '../ui/calendar.js';
import { MOTIONS, MOTION_ORDER } from '../data/council.js';
import { REQUEST_BONUS } from '../data/requests.js';
import { CHAPTERS, PADDY_SPILL, PADDY_SPILL_HINT, LUNCH, RECIPES, PRANKS, PRANK_AFTER, NEWS_OPEN, NEWS_RESULT, RSVP, THE_END, CH2_RECIPE, CH4 } from '../data/story.js';
import { story, inChapter, chapterFinished, spillDeadline, objectives, attendees, electionVotes } from '../systems/story.js';

// People you can't invite to the party (Chapter 4).
const NO_INVITE = ['stranger', 'julie', 'commuter', 'binman', 'hipster', 'golfer'];

// What you can catch where: [item, weight, junk?]. Bait halves the junk.
const FISH_TABLES = {
  lake: [['redfin', 40], ['carp', 35], ['eel', 10], ['oldboot', 15, true]],
  wetlands: [['yabby', 40], ['eel', 25], ['carp', 20], ['oldboot', 15, true]],
  altona: [['carp', 35], ['eel', 15], ['yabby', 10], ['oldboot', 40, true]],
  default: [['carp', 50], ['yabby', 20], ['oldboot', 30, true]],
};
// How wide the green zone is (0 to 1): smaller is trickier.
const FISH_ZONE = { redfin: 0.18, carp: 0.3, eel: 0.12, yabby: 0.24, oldboot: 0.4 };
import { HEROES } from '../data/heroes.js';
import { ITEMS } from '../data/items.js';
import { TYPES } from '../data/types.js';
import { TRAINERS, PRIZE_TRAINER } from '../data/enemies.js';
import { rollEncounter, readyTeam, START_LEVEL } from '../systems/battle.js';
import { form, canEvolve, evolve } from '../systems/forms.js';
import { friendInfo, FRIEND_POINTS } from '../data/friends.js';
import { CROPS } from '../data/crops.js';
import { typeName } from '../data/types.js';
import { flavourFor } from '../data/flavour.js';
import { OBJECTS, LIGHT_SOURCES } from '../art/paint/objects.js';
import { paintGround, TILE_NAMES } from '../art/paint/tiles.js';
import { painter } from '../art/paint/painter.js';
import { custom, objectTexture, tuftTexture, fitScale, cropTexture, exitSignTexture } from '../art/textures.js';
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
    this.news = data.news || [];
    this.firstLoad = !!data.firstLoad;
    this.leaving = false; this.endingDay = false; this.pending = null; this.lockedExit = null;
  }

  create() {
    const region = ZONES[this.regionId];
    this.region = region;
    this.suburb = SUBURBS[region.suburb];
    this.map = getMap(this.regionId);
    state.data.region = this.regionId;
    const firstVisit = !state.data.visited.includes(this.regionId);
    state.visit(this.regionId);
    // A rest at home fixes everyone.
    const tired = region.home && Object.values(state.data.pets).some(r => r.hp !== null && r.hp !== undefined);
    if (region.home) state.healAll();
    this.lastTile = null; this.stepsSinceBattle = 0; this.inBattle = false;
    setImageScene(this); ui.scene = this;
    this.tuftKey = tuftTexture(this, this.regionId, region.grass);
    this.talkIndex = {};

    this.buildGround();
    this.buildCollision();
    this.buildObjects();
    this.buildDecor();
    this.buildExitMarkers();
    this.buildForage();
    this.buildPlots();

    const spawn = this.spawnPoint();
    this.player = new Player(this, spawn.x, spawn.y, spawn.dir);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.layer);

    // Which pets are here: your team follows you everywhere; pets you've
    // found relax at home; everyone else is out in their own patch.
    this.trail = [];
    this.pets = [];
    let followers = 0;
    for (const p of PETS) {
      let mode = null;
      if (state.inParty(p.id)) mode = 'follow';
      else if (region.home) { if (state.isFound(p.id) && p.homeSpot?.zone === this.regionId) mode = 'home'; }
      else if (p.zone === this.regionId) mode = 'wild';
      if (!mode) continue;
      const pet = new Pet(this, p, { mode, index: mode === 'follow' ? followers++ : 0, near: this.player });
      if (mode !== 'follow') pet.collider = this.physics.add.collider(pet, this.layer);
      pet.on('pointerdown', (ptr, lx, ly, ev) => { ev.stopPropagation(); this.tapTarget({ kind: 'pet', ref: pet }); });
      this.pets.push(pet);
    }
    // People with a routine (routines.js) only appear while they are here.
    this.npcs = this.map.npcs.filter(n => NPCS[n.id] && isAt(n.id, n.at, state.data)).map(n => this.spawnNpc(n));
    this.routineTick = Math.floor(state.data.minutes / 10);
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
      bus.on('game:hero', () => this.pickHero(true)),
      bus.on('ui:modal', () => controls.release()),
      bus.on('story:party', () => this.goToParty()),
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
    } else ui.banner(region.name, region.name === this.suburb.name ? region.tagline : `${this.suburb.name}. ${region.tagline}`);
    this.save();
    if (tired) this.time.delayedCall(900, () => ui.toast('Home sweet home. Your pets are full of energy again.'));
    // The off-lead dog park at Lohse St Reserve (a council motion)
    if (this.regionId === 'lohse' && state.motionPassed('dogpark') && state.data.party.length && state.data.flags.dogparkDay !== state.data.day) {
      state.data.flags.dogparkDay = state.data.day;
      state.data.party.forEach(id => state.addPoints(id, 5));
      this.time.delayedCall(900, () => ui.toast('Off-lead dog park! Your team has a lovely run. +friendship'));
    }
    this.buildStoryBits();
    this.intro(firstVisit).then(() => this.morningNews()).then(() => this.maybeMeeting()).then(() => this.partyTime());
  }

  // A nudge each morning about anything time sensitive today.
  reminders() {
    const ready = MOTION_ORDER.some(id => !state.motionPassed(id) && state.motionReady(id));
    if (isMeetingDay(state.data.day) && ready) ui.toast('Reminder: council votes tonight, 6:30pm at 115 Civic Parade. Check the Calendar app.');
    else { const jobs = todayJobs(); if (jobs.length) ui.toast(`Today: ${jobs[0]}`); }
    const n = story().chapter, next = inChapter(n) && objectives(n).find(o => !o.done);
    if (next) this.time.delayedCall(2600, () => ui.toast(`Story: ${next.text}`));
  }

  // Things that happened overnight (pet door presents, rain on the garden),
  // and the daily splash in the paddling pool.
  async morningNews() {
    if (this.news.length) { await ui.say(this.news); this.news = []; }
    if (this.newDay) await this.advanceStory();
    if (this.newDay) { this.newDay = false; this.reminders(); }
    if (this.regionId === 'yard' && state.hasUpgrade('pool') && state.data.flags.poolDay !== state.data.day) {
      const home = state.foundIds().filter(id => !state.inParty(id));
      if (home.length) {
        state.data.flags.poolDay = state.data.day;
        home.forEach(id => state.addPoints(id, 5));
        ui.toast('Splash! The pets at home love the pool. +friendship');
        this.save();
      }
    }
  }

  // ------------------------------------------------------------ building
  buildGround() {
    const key = `ground-${this.regionId}-${this.map.rev || 0}`;
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
    this.roofs = [];
    for (const o of this.map.objects) {
      const def = OBJECTS[o.kind];
      const key = objectTexture(this, o);
      const x = (o.x + o.w / 2) * T, y = (o.y + o.h) * T;
      const img = this.add.image(x, y, key).setOrigin(0.5, 1).setDepth(y - 0.1);
      if (custom.has(key)) img.setScale(def.tex[0] / img.width);
      o.sprite = img;
      if (def.flat) img.setDepth(-900 + y / 1000);
      if (def.deck) img.setDepth(-990);
      if (def.roof) { img.setDepth(8500 + y / 1000); this.roofs.push({ img, x0: o.x * T, y0: o.y * T, x1: (o.x + o.w) * T, y1: (o.y + o.h) * T }); }
      if (o.kind === 'sign' && o.text) this.interactables.push({ kind: 'sign', x, y: y - 6, lines: o.text, bubble: 'fx-bubble-read' });
      else if (o.travel) this.interactables.push({ kind: 'travel', x, y: y - 6, bubble: 'fx-bubble-read' });
      else if (o.kind === 'noticeboard') this.interactables.push({ kind: 'council', x, y: y - 6, r: 24, bubble: 'fx-bubble-alert' });
      else if (this.region.home && o.kind === 'counter' && o.v === 'stove') this.interactables.push({ kind: 'cook', x, y: y - 6, r: 20, bubble: 'fx-bubble-dots' });
      else if (this.region.home && ['bed', 'single', 'cot'].includes(o.kind)) this.interactables.push({ kind: 'sleep', x, y: y - 4, r: Math.max(18, o.w * 9), bubble: 'fx-bubble-zzz', cot: o.kind === 'cot' });
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

  // A green way sign beside every exit off the edge of the map, and witches
  // hats across the ones that are closed for now.
  buildExitMarkers() {
    const W = this.map.w, H = this.map.h;
    const free = (x, y) => x > 0 && y > 0 && x < W - 1 && y < H - 1 && !this.map.solid[y * W + x];
    for (const e of this.map.exits) {
      const dir = e.x === 0 && e.w === 1 ? 'left' : e.x + e.w === W && e.w === 1 ? 'right' : e.y === 0 && e.h === 1 ? 'up' : e.y + e.h === H && e.h === 1 ? 'down' : null;
      if (!dir) continue;   // doors in the middle of a map are easy to spot
      const vertical = dir === 'left' || dir === 'right';
      const inX = dir === 'left' ? 1 : dir === 'right' ? W - 2 : 0, inY = dir === 'up' ? 1 : dir === 'down' ? H - 2 : 0;
      if (!e.to) {
        const n = vertical ? e.h : e.w;
        for (let i = 0; i < n; i++) {
          const tx = vertical ? inX : e.x + i, ty = vertical ? e.y + i : inY;
          const x = (tx + 0.5) * T, y = (ty + 0.7) * T;
          this.add.image(x, y, 'fx-cone').setOrigin(0.5, 1).setDepth(y);
        }
        continue;
      }
      if (!e.label) continue;
      const spots = vertical ? [[inX, e.y - 1], [inX, e.y + e.h], [inX + (dir === 'left' ? 1 : -1), e.y - 1]] : [[e.x - 1, inY], [e.x + e.w, inY], [e.x - 1, inY + (dir === 'up' ? 1 : -1)]];
      const [sx, sy] = spots.find(([x, y]) => free(x, y)) || spots[0];
      const key = exitSignTexture(this, e.label, dir);
      const x = (sx + 0.5) * T, y = (sy + 1) * T - 2;
      this.add.image(x, y, key).setOrigin(0.5, 1).setDepth(y);
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

  // ------------------------------------------------------------ garden plots
  plotOpen(p) {
    if (p.id.startsWith('cg')) return !!state.data.flags.garden;
    return true;   // backyard beds only exist once you've bought the veggie patch
  }
  buildPlots() {
    this.plots = [];
    for (const p of this.map.plots || []) {
      const pos = toWorld(p.x, p.y);
      const soil = this.add.rectangle((p.x + 0.5) * T, (p.y + 0.5) * T, T - 2, T - 2, 0x2a1a0c, 0).setDepth(-899);
      const crop = this.add.image(pos.x, (p.y + 1) * T - 1, '__WHITE').setOrigin(0.5, 1).setVisible(false);
      const t = { kind: 'plot', plot: p, x: pos.x, y: pos.y - 2, soil, crop, bubble: 'fx-bubble-dots' };
      this.plots.push(t);
      this.refreshPlot(t);
    }
    this.interactables.push(...this.plots);
  }
  refreshPlot(t) {
    const f = state.data.farm[t.plot.id], c = f && CROPS[f.crop];
    t.soil.setFillStyle(0x2a1a0c, f && f.watered === state.data.day ? 0.35 : 0);
    if (!c) { t.crop.setVisible(false); t.bubble = this.plotOpen(t.plot) ? 'fx-bubble-read' : 'fx-bubble-dots'; return; }
    const stage = f.growth >= c.days ? 3 : f.growth === 0 ? 0 : f.growth >= c.days / 2 ? 2 : 1;
    t.crop.setTexture(cropTexture(this, f.crop, stage)).setVisible(true).setDepth(t.crop.y);
    t.bubble = stage === 3 ? 'fx-bubble-alert' : f.watered === state.data.day ? 'fx-bubble-heart' : 'fx-bubble-dots';
  }
  async usePlot(t) {
    const p = t.plot, day = state.data.day;
    if (!this.plotOpen(p)) return ui.say(['These are community garden plots. Have a chat with Chris first.']);
    const f = state.data.farm[p.id], c = f && CROPS[f.crop];
    if (!c) {
      const seeds = Object.keys(state.data.seeds).filter(k => state.seedCount(k));
      if (!seeds.length) return ui.say(['An empty bed of good soil. You have no seeds. Olly at Bunnings (Altona North) and James at Reservoir sell them.']);
      const pick = await ui.say({ text: 'Plant something?', choices: [...seeds.map(k => ({ label: `${CROPS[k].name} seeds`, value: k, icon: itemIcon(`seed-${k}`, 32), note: `×${state.seedCount(k)} · ${CROPS[k].days} days` })), { label: 'Not now', value: null }] }, { cancelValue: null });
      if (!pick || !state.useSeed(pick)) return;
      state.data.farm[p.id] = { crop: pick, growth: 0, watered: day, boost: false };
      sfx.pickup(); this.splash(t);
      this.refreshPlot(t); this.save();
      return ui.say([`You plant the ${CROPS[pick].name.toLowerCase()} and give it a drink.`, 'Water it once a day. Rain counts. Check the Garden app on your phone.']);
    }
    if (f.growth >= c.days) {
      let n = c.yield;
      const extra = [];
      if (state.inParty('poppy')) { n++; extra.push(`${form('poppy').name} digs with total enthusiasm and finds an extra one.`); }
      if (state.inParty('stanley') && Math.random() < 0.4) { n++; extra.push(`${form('stanley').name} points, sternly, at one you missed.`); }
      state.addItem(f.crop, n);
      sfx.found(); this.heartsFx(t, 4);
      if (c.regrow) Object.assign(f, { growth: Math.max(0, c.days - c.regrow), watered: 0 });
      else delete state.data.farm[p.id];
      this.refreshPlot(t); this.save();
      ui.toast(`+${n} ${c.name}`, itemIcon(f.crop, 32));
      return ui.say([`You pick ${n} ${c.name.toLowerCase()}${n > 1 && !c.name.endsWith('s') ? 's' : ''}!`, ...extra, ...(c.regrow ? ['It will keep producing. Keep watering it.'] : [])]);
    }
    const lines = [];
    if (f.watered === day) lines.push(`The ${c.name.toLowerCase()} has had its water today. ${f.growth} of ${c.days} days grown.`);
    else {
      f.watered = day;
      lines.push(`You water the ${c.name.toLowerCase()}. ${f.growth} of ${c.days} days grown.`);
      if (state.inParty('spooky') && isNight(state.data.minutes)) { f.boost = true; lines.push(`${form('spooky').name} hops into the bed and does something spooky to it. It will grow extra tonight.`); }
      // The long hose from Bunnings reaches every bed in this garden.
      if (state.hasUpgrade('hose')) {
        let n = 0;
        for (const o of this.plots) {
          const of = state.data.farm[o.plot.id];
          if (o === t || !of || !this.plotOpen(o.plot) || of.watered === day || of.growth >= CROPS[of.crop].days) continue;
          of.watered = day; n++; this.splash(o); this.refreshPlot(o);
        }
        if (n) lines.push(`The long hose reaches the other ${n === 1 ? 'bed' : `${n} beds`} too.`);
      }
      sfx.pickup(); this.splash(t);
      this.refreshPlot(t); this.save();
    }
    await ui.say(lines);
    if (state.count('fertiliser') && f.growth < c.days - 1 && !f.fed) {
      const yes = await ui.say({ text: 'Add some fertiliser? One extra day of growth.', choices: [{ label: `Yes (${state.count('fertiliser')} left)`, value: true }, { label: 'Not now', value: false }] }, { cancelValue: false });
      if (yes) {
        state.removeItem('fertiliser'); f.growth++; f.fed = true;
        sfx.found(); this.heartsFx(t, 3); this.refreshPlot(t); this.save();
        await ui.say([`You dig in some blood and bone. The ${c.name.toLowerCase()} perks right up. ${f.growth} of ${c.days} days grown.`]);
      }
    }
  }
  splash(t) {
    for (let i = 0; i < 8; i++) {
      const d = this.add.image(t.x + (Math.random() - 0.5) * 12, t.y - 6, 'fx-sparkle').setDepth(9700).setTint(0x7ac8f0);
      this.tweens.add({ targets: d, y: d.y + 6 + Math.random() * 6, alpha: 0, duration: 500 + Math.random() * 300, onComplete: () => d.destroy() });
    }
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
    const m = state.data.minutes, indoor = this.region.indoor;
    const dark = darkness(m) * (indoor ? 0.45 : 1), rain = state.isRaining() && !indoor ? 0.18 : 0;
    this.night.setAlpha(Math.min(0.62, dark * 0.55 + rain));
    const duskAmt = !indoor && m > 17.5 * 60 && m < 20.5 * 60 ? Math.sin((m - 17.5 * 60) / 180 * Math.PI) * 0.12 : 0;
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
    const raining = state.isRaining() && !this.region.indoor;
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
    // Let the camera scroll a little past the map edges so the HUD and the
    // touch controls never sit on top of you when you stand at an edge.
    cam.setBounds(0, -hud / zoom, this.map.w * T, this.map.h * T + (hud + pad) / zoom);
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
      ...this.npcs.filter(n => !n.gone).map(n => ({ kind: 'npc', ref: n, x: n.x, y: n.y - 4 })),
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
      if (rec.giftedDay !== state.data.day && state.treatItems().length) return 'fx-bubble-gift';
      return 'fx-bubble-heart';
    }
    if (t.kind === 'npc') {
      if (state.todaysRequests().some(q => q.who === t.ref.id && !q.done)) return 'fx-bubble-alert';
      return t.ref.info.gift && state.data.npcDay[t.ref.id] !== state.data.day ? 'fx-bubble-gift' : 'fx-bubble-talk';
    }
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
    if (!t && !ui.blocking() && !this.leaving && this.waterAhead()) return this.goFishing();
    if (!t || ui.blocking() || this.leaving) return;
    this.player.target = null; this.pending = null;
    this.player.setVelocity(0, 0);
    this.facePlayerTo(t.ref ? t.ref.x : t.x, t.ref ? t.ref.y : t.y);
    if (t.kind === 'pet') return this.talkToPet(t.ref);
    if (t.kind === 'npc') return this.talkToNpc(t.ref);
    if (t.kind === 'item') return this.pickUp(t);
    if (t.kind === 'travel') return this.travel();
    if (t.kind === 'council') { ui.openModal('council'); return; }
    if (t.kind === 'sign') return ui.say(t.lines);
    if (t.kind === 'look') return ui.say(pick(t.lines));
    if (t.kind === 'sleep') return this.sleep(t);
    if (t.kind === 'plot') return this.usePlot(t);
    if (t.kind === 'cook') return this.cook();
    if (t.kind === 'lunch') return this.lunch(t);
  }

  // ------------------------------------------------------------ fishing
  // Water in front of you (or one tile further)?
  waterAhead() {
    const v = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[this.player.dir] || [0, 1];
    const tx = Math.floor(this.player.x / T), ty = Math.floor((this.player.y - 1) / T);
    return [1, 2].some(k => this.map.ground[ty + v[1] * k]?.[tx + v[0] * k] === '~');
  }
  async goFishing() {
    if (!state.hasUpgrade('rod')) return ui.say(['The water looks fishy. You would need a fishing rod. Bazza at Anaconda in Preston sells them.']);
    const table = FISH_TABLES[this.regionId] || FISH_TABLES.default;
    const bait = state.count('bait') > 0;
    if (bait) state.removeItem('bait');
    let r = Math.random() * table.reduce((a, [, w, j]) => a + (bait && j ? w / 2 : w), 0), fish = table[0][0];
    for (const [id, w, j] of table) { r -= bait && j ? w / 2 : w; if (r <= 0) { fish = id; break; } }
    state.data.minutes += 10;
    const got = await ui.fish(fish, FISH_ZONE[fish] + (bait ? 0.06 : 0));
    if (got) { state.addItem(got); state.data.stats.fish = (state.data.stats.fish || 0) + 1; ui.toast(`+1 ${ITEMS[got].name}`, itemIcon(got, 32)); }
    this.save();
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
    const opts = { name: form(d.id).name, portrait: petPortrait(d.id) };
    pet.pause(5); pet.facePoint(this.player.x);
    this.heartsFx(pet, 2);

    if (!rec.found && PRIZE_TRAINER[d.id]) {
      const owner = TRAINERS[PRIZE_TRAINER[d.id]].name;
      return ui.say([`${d.name} sizes you up.`, `${owner} is keeping an eye on things nearby. Win a friendly play-fight with ${owner}, and ${d.name} might come home with you.`], opts);
    }
    if (!rec.found) {
      state.findPet(d.id);
      rec.talkedDay = day; rec.chats++; state.data.stats.chats++;
      state.addPoints(d.id, FRIENDSHIP.talk);
      sfx.found(); this.heartsFx(pet, 6);
      ui.banner('New Petdex entry!', d.name);
      const lines = [
        `You found ${d.name}, the ${typeName(d.type).toLowerCase()} type ${d.species.toLowerCase()}!`,
        d.bio,
        `${d.name} was added to your Petdex.`,
      ];
      if (state.foundCount() === PETS.length) lines.push("That's everyone! Every pet in Melbourne is your friend now. Well, these ones. For now.");
      else lines.push('Come back every day for a chat. Pets love treats, too.');
      const joined = this.joinTeam(pet);
      if (joined) lines.push(`${d.name} falls in behind you. She is on your team now!`);
      this.save();
      await ui.say(lines, opts);
      if (d.id === 'princess' && !state.data.flags.tutorial) await this.julieTutorial();
      return;
    }
    if (pet.asleep) return ui.say([pick(d.asleep)], opts);

    // Chat, or give a treat (once a day): your choice.
    for (let first = true; ; first = false) {
      const canTreat = rec.giftedDay !== day && state.treatItems().length;
      let act = 'chat';
      if (canTreat || !first) {
        if (!canTreat) break;
        act = await ui.say({
          text: first ? `${d.name} looks up at you.` : `Anything else for ${d.name}?`,
          choices: [{ label: 'Chat', value: 'chat' }, { label: 'Give a treat', value: 'treat' }, { label: 'Bye', value: null }],
        }, { ...opts, cancelValue: null });
      }
      if (!act) break;
      if (act === 'chat') await this.chatPet(pet, opts);
      if (act === 'treat') {
        const choice = await ui.say({
          text: `Give ${d.name} a treat?`,
          choices: [...state.treatItems().map(id => ({ label: ITEMS[id].name, value: id, icon: itemIcon(id, 32), note: `×${state.count(id)}` })), { label: 'Not now', value: null }],
        }, { ...opts, cancelValue: null });
        if (choice) await this.giveTreat(pet, choice, opts);
      }
    }
    this.save();
  }

  async chatPet(pet, opts) {
    const d = pet.data_, rec = state.pet(d.id), day = state.data.day;
    const hearts = state.hearts(d.id);
    const tiers = Object.keys(d.lines).map(Number).filter(n => n <= hearts).sort((a, b) => b - a);
    let pool = Math.random() < 0.5 ? d.lines[tiers[0]] : tiers.flatMap(t => d.lines[t]);
    if (isNight(state.data.minutes) && d.night && Math.random() < 0.5) pool = d.night;
    if (state.isRaining() && d.rain && Math.random() < 0.5) pool = d.rain;
    const lines = [pick(pool)];
    if (rec.talkedDay !== day) {
      rec.talkedDay = day; rec.chats++; state.data.stats.chats++;
      const r = state.addPoints(d.id, FRIENDSHIP.talk + (HEROES[state.data.hero]?.perk.talkBonus || 0));
      sfx.heart();
      lines.push(...this.heartLines(d, r));
    }
    await ui.say(lines, opts);
    if (canEvolve(d.id)) await this.evolveInWorld(pet);
  }

  // A pet you have just found trots straight onto your team if there's room.
  joinTeam(pet) {
    const party = state.data.party;
    if (party.length >= 3 || party.includes(pet.id)) return false;
    state.setParty([...party, pet.id]);
    pet.collider?.destroy(); pet.collider = null;
    pet.mode = 'follow'; pet.index = state.data.party.length - 1;
    this.trail.length = 0;
    return true;
  }

  // Straight after you find Princess, Julie Jana pops round for a warm-up
  // play-fight that shows you the ropes. Then she's off door knocking for good.
  async julieTutorial() {
    state.data.flags.tutorial = true;
    const P = PEOPLE.julie, t = TRAINERS.julie;
    const spot = { id: 'julie', x: Math.floor(this.player.x / T) + 2, y: Math.floor(this.player.y / T), face: 'left' };
    if (this.solidAt((spot.x + 0.5) * T, (spot.y + 0.75) * T)) spot.x -= 4;
    const npc = this.spawnNpc(spot);
    this.npcs.push(npc);
    npc.setAlpha(0); this.tweens.add({ targets: npc, alpha: 1, duration: 400 });
    npc.faceTowards(this.player.x, this.player.y);
    this.facePlayerTo(npc.x, npc.y);
    const opts = { name: 'Julie Jana', portrait: npcIcon('julie') };
    await ui.say([...(P.byHero[state.data.hero] || P.lines)[0], ...t.tutorial], opts);
    const result = await this.startBattle({ trainer: 'julie' });
    state.data.beaten.julie = state.data.day;
    if (result.outcome === 'lose') state.healAll();
    await ui.say(result.outcome === 'win' ? t.win : t.lose, opts);
    this.removeNpc(npc);
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
    if (canEvolve(d.id)) await this.evolveInWorld(pet);
  }

  // A pet that's levelled up enough evolves once your friendship is strong enough.
  async evolveInWorld(pet) {
    const id = pet.id, before = form(id).name;
    await ui.say([`What's this? ${before} is glowing!`]);
    sfx.found();
    const cam = this.cameras.main;
    for (let i = 0; i < 6; i++) { pet.setTintFill(0xffffff); await new Promise(r => setTimeout(r, 140)); pet.clearTint(); await new Promise(r => setTimeout(r, 120)); }
    cam.flash(500, 255, 255, 255);
    evolve(id);
    pet.refreshForm();
    this.heartsFx(pet, 10);
    const d = form(id);
    ui.banner('Evolution!', `${before} became ${d.name}`);
    await ui.say([`${before} evolved into ${d.name}!`, d.bio, `${d.name} is ${typeName(d.type)} type now, with brand new moves. Check the Petdex.`], { name: d.name, portrait: petPortrait(id) });
    this.save();
  }

  // ------------------------------------------------------------ people, items, trains
  async talkToNpc(npc) {
    const info = npc.info, day = state.data.day;
    const opts = { name: info.name, portrait: npcIcon(npc.id) };
    npc.pause(5); npc.faceTowards(this.player.x, this.player.y);
    const trainer = TRAINERS[npc.id];
    const done = (trainer?.prize && state.isFound(trainer.prize)) || (trainer?.once && state.data.beaten[npc.id]);
    // Trainers you have never beaten go straight to their challenge.
    if (trainer && !done && !state.data.beaten[npc.id]) return this.challenge(npc, trainer, opts);
    const f = state.friend(npc.id);
    if (!f.met) { f.met = true; bus.emit('friends:changed'); }
    // Chris hands out the community garden plots the first time you chat
    if (npc.id === 'chris' && !state.data.flags.garden) await this.chrisGarden(opts);
    // A menu: chat, give a gift, shop, or a rematch. Just one thing to do? Straight to it.
    const greet = ['"Oh, hi!"', '"G\'day!"', '"Hey, you."', '"Hiya!"', '"Oh, it\'s you!"'][Math.floor(hash(npc.id.length, npc.id.charCodeAt(0)) * 5)];
    for (let first = true; ; first = false) {
      const choices = [{ label: 'Chat', value: 'chat' }];
      const giftable = state.bagItems().filter(id => !ITEMS[id].story && !ITEMS[id].deco);
      if (f.giftedDay !== day && giftable.length) choices.push({ label: 'Give a gift', value: 'gift' });
      // The story: pranks (Chapter 3) and party invitations (Chapter 4)
      if (inChapter(3) && PRANKS[npc.id] && !story().pranks.includes(npc.id)) choices.push({ label: `Prank: ${PRANKS[npc.id].label}`, value: 'prank' });
      if (inChapter(4) && !NO_INVITE.includes(npc.id) && !story().invited.includes(npc.id)) choices.push({ label: 'Invite to the party', value: 'invite' });
      if (info.shop) choices.push({ label: 'Shop', value: 'shop' });
      if (trainer && !done) choices.push({ label: 'Play-fight', value: 'fight' });
      let act = 'chat';
      if (choices.length > 1 || !first) {
        if (!first && choices.length === 1) break;
        act = await ui.say({ text: first ? `${info.name}: ${greet}` : 'Anything else?', choices: [...choices, { label: 'Bye', value: null }] }, { ...opts, cancelValue: null });
      }
      if (!act) break;
      if (act === 'chat') await this.chatNpc(npc, opts);
      if (act === 'gift') {
        const choice = await ui.say({
          text: `Give ${info.name} a gift?`,
          choices: [...giftable.map(id => ({ label: ITEMS[id].name, value: id, icon: itemIcon(id, 32), note: `×${state.count(id)}` })), { label: 'Not today', value: null }],
        }, { ...opts, cancelValue: null });
        if (choice) await this.giveFriendGift(npc, choice, opts);
      }
      if (act === 'shop') { await ui.shop(info.shop); }
      if (act === 'prank') await this.prank(npc, opts);
      if (act === 'invite') await this.invite(npc, opts);
      if (act === 'fight') { await this.challenge(npc, trainer, opts); break; }
      this.save();
    }
    this.save();
  }

  async chatNpc(npc, opts) {
    const info = npc.info, day = state.data.day;
    const f = state.friend(npc.id), fi = friendInfo(npc.id);
    // A heart event the first time you chat at a new heart level, otherwise a normal line
    const hc = state.friendHearts(npc.id);
    const ev = Object.keys(fi.events || {}).map(Number).sort((x, y) => x - y).find(n => n <= hc && !f.events.includes(n));
    if (ev) await this.heartEvent(npc, ev, opts);
    else {
      const hints = Object.entries(info.hints || {}).filter(([id]) => !state.isFound(id));
      let lines;
      if (hints.length && Math.random() < 0.6) lines = [hints[0][1]];
      else {
        // Some people talk differently to Helen and to the twins.
        const pool = [...(info.byHero?.[state.data.hero] || []), ...info.lines];
        const i = this.talkIndex[npc.id] = ((this.talkIndex[npc.id] ?? Math.floor(Math.random() * pool.length)) + 1) % pool.length;
        lines = pool[i];
      }
      if (npc.spot.leave && info.leaving) lines = info.leaving;
      // Paddy's advice once a day, before anything else.
      if (npc.id === 'paddy' && f.talkedDay !== day && !npc.spot.leave) lines = [...lines, this.paddyAdvice()];
      await ui.say(lines, opts);
    }
    // First chat of the day: friendship
    if (f.talkedDay !== day) {
      f.talkedDay = day;
      const r = state.addFriendPoints(npc.id, FRIEND_POINTS.talk + (HEROES[state.data.hero]?.perk.talkBonus ? 5 : 0));
      if (r.after > r.before) { sfx.heart(); this.heartsFx(npc, 3); ui.toast(`${info.name}: ${r.after} ${r.after === 1 ? 'heart' : 'hearts'}`); }
    }
    if (info.gift && state.data.npcDay[npc.id] !== day) {
      // A list of gifts takes turns, one a day (Betty's cooking).
      const gift = Array.isArray(info.gift) ? info.gift[day % info.gift.length] : info.gift;
      state.data.npcDay[npc.id] = day;
      state.addItem(gift); state.data.stats.treats++;
      sfx.pickup();
      ui.toast(`+1 ${ITEMS[gift].name}`, itemIcon(gift, 32));
      await ui.say([info.giftLine, `You got: ${ITEMS[gift].name}.`], opts);
    }
  }

  // What Paddy suggests depends on how far along you are.
  paddyAdvice() {
    const d = state.data, A = NPCS.paddy.advice;
    if (!state.foundIds().length) return A.noPets;
    if (!d.party.length) return A.oneTeam;
    if (!d.flags.garden) return A.noGarden;
    if (state.foundCount() >= 2 && !Object.keys(d.council.given).length && !d.council.passed.length) return A.noMotion;
    const rest = [A.swing, A.train, A.friends, A.types, A.rest];
    return rest[d.day % rest.length];
  }

  async heartEvent(npc, hearts, opts) {
    const f = state.friend(npc.id), fi = friendInfo(npc.id);
    f.events.push(hearts);
    sfx.found(); this.heartsFx(npc, 6);
    ui.banner(`${npc.info.name}`, `${hearts} hearts`);
    await ui.say(fi.events[hearts], opts);
    const reward = fi.rewards?.[hearts];
    if (reward?.item) { state.addItem(reward.item, reward.n || 1); await ui.say(`You got: ${reward.n || 1} ${ITEMS[reward.item].name}.`, opts); }
    if (reward?.money) { state.addMoney(reward.money); await ui.say(`You got: $${reward.money}.`, opts); }
    if (hearts >= 4 && fi.assist) await ui.say(`${npc.info.name} has your back now. Battle near their part of town and they might turn up to help.`);
  }

  async giveFriendGift(npc, item, opts) {
    const f = state.friend(npc.id), fi = friendInfo(npc.id), name = ITEMS[item].name.toLowerCase();
    // Handing someone back the thing they give you every day doesn't count.
    if ([].concat(npc.info.gift).includes(item)) {
      sfx.bump();
      return ui.say([`${npc.info.name} squints at the ${name}. "Hang on. That's mine. I gave you that."`, `"Keep it. Re-gifting to the person who gifted it is a bold move, though."`], opts);
    }
    // Some things (Betty's cooking) everyone loves, unless they've said otherwise.
    const reaction = fi.loves.includes(item) || (ITEMS[item].loved && !fi.dislikes.includes(item)) ? 'love' : fi.likes.includes(item) ? 'like' : fi.dislikes.includes(item) ? 'dislike' : 'neutral';
    state.removeItem(item);
    f.giftedDay = state.data.day; f.reactions[item] = reaction;
    const r = state.addFriendPoints(npc.id, FRIEND_POINTS[reaction]);
    const n = npc.info.name;
    const text = {
      love: `${n} LOVES the ${name}! "How did you know?"`,
      like: `${n} is pleased with the ${name}. "Ta, that's lovely."`,
      neutral: `${n} takes the ${name} politely. "Oh. Thanks."`,
      dislike: `${n} looks at the ${name}. "...I'll find a use for it."`,
    }[reaction];
    if (reaction === 'love' || reaction === 'like') { sfx.heart(); this.heartsFx(npc, reaction === 'love' ? 8 : 3); } else if (reaction === 'dislike') sfx.sad();
    const lines = [text];
    // A request from the board?
    const req = state.todaysRequests().find(q => q.who === npc.id && q.item === item && !q.done);
    if (req) {
      state.completeRequest(req.id); state.addMoney(req.money); state.addFriendPoints(npc.id, REQUEST_BONUS.points);
      sfx.found(); ui.toast(`Request done! +$${req.money}`);
      lines.push(`"You remembered! Here, for your trouble." You got $${req.money}.`);
    }
    const after = state.friendHearts(npc.id);
    if (after > r.before) lines.push(`You and ${n} are now ${after} ${after === 1 ? 'heart' : 'hearts'} close.`);
    await ui.say(lines, opts);
  }

  // Chris gives you the community garden plots and some seeds to start.
  async chrisGarden(opts) {
    state.data.flags.garden = true;
    state.addSeeds('carrot', 3); state.addSeeds('basil', 2);
    sfx.found();
    await ui.say([
      'Chris: "Oh, perfect timing. Plots are open! The two beds on the right are yours."',
      '"Here: carrot and basil seeds to start. Water every day. Rain counts. Snails do not count."',
      'You got: 3 carrot seeds and 2 basil seeds. The Garden app on your phone keeps track.',
    ], opts);
    this.plots?.forEach(t => this.refreshPlot(t));
  }

  // ------------------------------------------------------------ battles
  // Talking to a trainer: they offer a play-fight.
  async challenge(npc, t, opts) {
    const beaten = state.data.beaten[npc.id];
    await ui.say(beaten && t.again ? t.again : t.challenge, opts);
    if (!readyTeam().length) {
      const lines = state.foundCount()
        ? ['You need a pet with you for that. Pick your team as you head out the front door at home.']
        : ['You need a pet with you for that. Make friends with Princess on Allen St first. She is always up for a fight.'];
      return ui.say(lines, opts);
    }
    const go = await ui.say({ text: t.ask, choices: [{ label: t.yes, value: true }, { label: t.no, value: false }] }, { ...opts, cancelValue: false });
    if (!go) return;
    const result = await this.startBattle({ trainer: npc.id });
    if (result.outcome === 'win') {
      const firstToday = beaten !== state.data.day;
      state.data.beaten[npc.id] = state.data.day;
      await ui.say(t.win, opts);
      if (firstToday && (t.money ?? (t.prize ? 0 : 20))) {
        const cash = t.money ?? (t.prize ? 0 : 20);
        state.addMoney(cash);
        sfx.pickup();
        await ui.say(`${t.name} hands over $${cash}. Fair's fair.`, opts);
      }
      if (t.reward && firstToday) {
        for (const [item, n] of Object.entries(t.reward)) state.addItem(item, n);
        sfx.pickup();
        await ui.say(`You got: ${Object.entries(t.reward).map(([item, n]) => `${n} ${ITEMS[item].name}`).join(', ')}.`, opts);
      }
      if (t.prize) await this.winPet(t.prize);
      this.save();
    } else if (result.outcome === 'lose') {
      await ui.say(t.lose, opts);
      await this.lostBattle();
    }
  }

  async winPet(id) {
    const d = PETS.find(p => p.id === id), rec = state.pet(id);
    state.findPet(id);
    rec.level = rec.level || START_LEVEL[id]; rec.hp = null;
    rec.talkedDay = state.data.day; rec.chats++;
    state.addPoints(id, FRIENDSHIP.talk);
    sfx.found();
    const pet = this.pets.find(p => p.id === id);
    if (pet) this.heartsFx(pet, 6);
    ui.banner('New Petdex entry!', d.name);
    const lines = [`You befriended ${d.name}, the ${typeName(d.type).toLowerCase()} type ${d.species.toLowerCase()}!`, `${d.name} was added to your Petdex, and will hang out at your place on Allen St.`];
    if (state.foundCount() === PETS.length) lines.push("That's everyone! Every pet in Melbourne is your friend now. Well, these ones. For now.");
    await ui.say(lines, { name: d.name, portrait: petPortrait(id) });
  }

  // Tall grass: a chance of something jumping out each new tile you step on.
  checkEncounter() {
    if (this.region.home || this.inBattle) return;
    const tx = Math.floor(this.player.x / T), ty = Math.floor((this.player.y - 2) / T), key = tx + ',' + ty;
    if (key === this.lastTile) return;
    this.lastTile = key;
    this.stepsSinceBattle++;
    if (this.map.ground[ty]?.[tx] !== '"' || this.stepsSinceBattle < 6) return;
    if (Math.random() > ENCOUNTER_RATE || !readyTeam().length) return;
    const wild = rollEncounter(this.region.suburb, isNight(state.data.minutes), this.regionId);
    if (!wild) return;
    this.startBattle({ wild }).then(r => { if (r.outcome === 'lose') this.lostBattle(); });
  }

  // Flash the screen, pause the world and run the BattleScene over it.
  startBattle(opts) {
    this.inBattle = true; ui.battlePending = true;
    controls.release();
    this.player.target = null; this.pending = null; this.player.setVelocity(0, 0);
    sfx.encounter();
    const cam = this.cameras.main;
    cam.flash(160, 255, 255, 255);
    this.time.delayedCall(240, () => cam.flash(160, 255, 255, 255));
    cam.shake(400, 0.004);
    return new Promise(resolve => {
      this.time.delayedCall(560, () => {
        ui.battlePending = false;
        this.scene.launch('Battle', { ...opts, suburb: this.region.suburb, done: result => {
          this.scene.resume();
          this.inBattle = false; this.stepsSinceBattle = 0;
          this.syncFollowers();
          this.save();
          resolve(result);
        } });
        this.scene.pause();
      });
    });
  }

  // Pets that ran home stop following you.
  syncFollowers() {
    for (const pet of this.pets.filter(p => p.mode === 'follow' && !state.inParty(p.id))) {
      this.pets.splice(this.pets.indexOf(pet), 1);
      this.tweens.add({ targets: pet, alpha: 0, duration: 300, onComplete: () => pet.destroy() });
    }
    this.pets.filter(p => p.mode === 'follow').forEach((p, i) => { p.index = i; });
  }

  async lostBattle() {
    await ui.say(['You scoop up your things and head home to Allen St. Everyone needs a lie down.']);
    this.goTo('home', 'start', 30);
  }

  pickUp(f) {
    this.forage = this.forage.filter(x => x !== f);
    state.takeForage(this.regionId, f.index);
    const n = Math.random() < (HEROES[state.data.hero]?.perk.forageBonus || 0) ? 2 : 1;
    state.addItem(f.item, n); state.data.stats.treats += n;
    sfx.pickup();
    this.tweens.killTweensOf(f.sprite);
    this.tweens.add({ targets: f.sprite, y: f.sprite.y - 12, alpha: 0, duration: 400, onComplete: () => f.sprite.destroy() });
    ui.toast(n > 1 ? `+2 ${ITEMS[f.item].name}! Snack magnet!` : `+1 ${ITEMS[f.item].name}`, itemIcon(f.item, 32));
    this.save();
  }

  async travel() {
    sfx.myki();
    const options = SUBURB_ORDER.filter(s => s !== this.region.suburb && state.suburbVisited(s));
    if (!options.length) {
      return ui.say(['You tap your myki. Beep beep.', 'The screen only lists stations you have already visited. Walk to another suburb first, then you can catch the train back and forth.']);
    }
    const choice = await ui.say({
      text: 'You tap your myki. Beep beep. Where to?',
      choices: [...options.map(s => ({ label: `${SUBURBS[s].name} Station`, value: s })), { label: 'Stay here', value: null }],
    }, { cancelValue: null });
    if (choice) this.goTo(SUBURBS[choice].station, 'station', 25);
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

  // Leaving the house: pick up to three pets to bring along.
  async chooseTeamThenGo(ex) {
    if (this.choosingTeam) return;
    this.choosingTeam = true;
    this.player.setVelocity(0, 0); this.player.target = null;
    const team = await ui.chooseTeam();
    this.choosingTeam = false;
    if (team === null) {   // changed their mind: step back inside
      const [fx, fy] = this.player.facing();
      this.player.setPosition(this.player.x - fx * 12, this.player.y - fy * 12);
      return;
    }
    state.setParty(team);
    this.goTo(ex.to, ex.entry, 3);
  }

  // Your bed (or a twin's cot): sleep until morning, or a quick nap.
  async sleep(t) {
    const baby = HEROES[state.data.hero]?.look.baby;
    if (t.cot && !baby) return ui.say(['A cot. You would not fit. You would also never get back out.']);
    const late = state.data.minutes >= 18 * 60;
    const choice = await ui.say({
      text: late ? 'Getting late. Go to bed?' : 'Your bed looks very comfy.',
      choices: [{ label: 'Sleep until morning', value: 'night' }, { label: 'Have a nap (2 hours)', value: 'nap' }, { label: 'Not yet', value: null }],
    }, { cancelValue: null });
    if (choice === 'nap') {
      state.data.minutes = Math.min(DAY_END - 30, state.data.minutes + 120);
      state.healAll();
      this.cameras.main.fadeOut(400, 0, 0, 0);
      await new Promise(r => this.cameras.main.once('camerafadeoutcomplete', r));
      this.cameras.main.fadeIn(500, 0, 0, 0);
      ui.updateHud(this.regionId);
      return ui.say([baby ? 'A big nap. Everyone is relieved, mostly the grown-ups.' : 'A lovely nap. Everyone feels refreshed.']);
    }
    if (choice !== 'night') return;
    await ui.say([baby ? 'Into the cot. Zzz.' : 'You climb into bed. The house creaks. Somewhere, a possum. Zzz.']);
    this.endingDay = true;
    const news = state.newDay();
    state.save();
    this.leaving = true;
    this.cameras.main.fadeOut(700, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.restart({ region: 'home', entry: this.bedEntry(), newDay: true, news }));
  }

  // Helen wakes in her bed, the twins in their cots.
  bedEntry() { return HEROES[state.data.hero]?.look.baby ? 'cot' : 'bed'; }

  async endDay() {
    if (this.endingDay) return;
    this.endingDay = true;
    await ui.say(["It's 2am. You are exhausted.", 'You head home and fall asleep the moment your head hits the pillow.']);
    const news = state.newDay();
    state.save();
    this.leaving = true;
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.restart({ region: 'home', entry: this.bedEntry(), newDay: true, news }));
  }

  checkExits() {
    const tx = Math.floor(this.player.x / T), ty = Math.floor((this.player.y - 1) / T);
    const ex = this.map.exits.find(e => tx >= e.x && tx < e.x + e.w && ty >= e.y && ty < e.y + e.h);
    if (!ex) { this.lockedExit = null; return; }
    // You can't wander off from Allen St until you've made friends with Princess.
    if (ex.to && this.regionId === 'allen' && !['home', 'yard'].includes(ex.to) && !state.isFound('princess')) {
      if (this.lockedExit === ex) return;
      this.lockedExit = ex;
      return this.bounceBack(ex, ['I really should get Princess before I go...', 'She is usually doing laps of the court.']);
    }
    if (ex.to && ex.team && state.foundIds().length) return this.chooseTeamThenGo(ex);
    // Walking into another suburb takes 20 minutes, 10 once the bike lane motion passes.
    if (ex.to) return this.goTo(ex.to, ex.entry, ZONES[ex.to].suburb === this.region.suburb ? 3 : state.motionPassed('bikelane') ? 10 : 20);
    if (this.lockedExit === ex) return;
    this.lockedExit = ex;
    this.bounceBack(ex, ex.label ? ex.lines || [`The way to ${ex.label} is closed for now.`] : ['The way is closed.']);
  }
  bounceBack(ex, lines) {
    sfx.bump();
    const back = { x: ex.x === 0 ? 1 : ex.x === this.map.w - 1 ? -1 : 0, y: ex.y === 0 ? 1 : ex.y === this.map.h - 1 ? -1 : 0 };
    this.player.setPosition(this.player.x + back.x * 10, this.player.y + back.y * 10);
    this.player.target = null;
    ui.say(lines);
  }

  // ------------------------------------------------------------ saving & intro
  save() {
    if (window.__ppResetting || !this.player || this.leaving) { if (!window.__ppResetting) state.save(); return; }
    state.data.pos = { x: Math.round(this.player.x), y: Math.round(this.player.y) };
    state.data.dir = this.player.dir;
    state.data.region = this.regionId;
    state.save();
  }

  // Pick (or change) who you are playing as.
  async pickHero(canCancel = false) {
    const id = await ui.chooseHero(canCancel);
    if (!id) return;
    if (id === 'helen' && inChapter(3)) return ui.say(['Mum is at Nanna and Pop\'s, looking after them. Today belongs to the boys.']);
    const first = !state.data.startGiven;
    state.data.hero = id;
    if (first) {
      for (const [item, n] of Object.entries(HEROES[id].start)) state.addItem(item, n);
      state.data.startGiven = true;
    }
    this.player.refreshLook();
    this.save();
    if (first) ui.toast(`${HEROES[id].name}'s treats are in your bag`);
  }

  async intro(firstVisit) {
    if (this.firstLoad && !state.data.hero) await this.pickHero(false);
    if (!this.firstLoad) {
      if (firstVisit && this.region.name === this.suburb.name) ui.toast(`New station unlocked: ${this.suburb.name}`);
      return;
    }
    if (state.migrated) {
      state.migrated = false;
      await ui.say(['Welcome back to Project Princess!', 'You have moved into a new place on Allen St, Laverton. Pets you have found will hang out here.', 'Before you head out the door, you can pick up to three of them to come along.']);
    }
    if (!state.data.seenIntro) {
      await ui.say([
        `Welcome to Project Princess, ${HEROES[state.data.hero].name}!`,
        "Your friends' pets are scattered across Laverton, Brunswick and Reservoir.",
        controls.touchMode
          ? 'Drag on the left side of the screen to walk. Tap A to talk to pets, people and signs. Tap things to walk to them.'
          : 'Walk with the arrow keys or WASD. Hold Shift to run. Press Space to talk to pets, people and signs.',
        'Chat to each pet once a day and bring them treats to become friends. Pets you find come and live here with you.',
        'This is your new place on Allen St, Laverton. It is mid-renovation. Mind the paint tins.',
        'Rumour has it a very fluffy poodle runs the court right out the front. Head out the front door to say hello.',
      ]);
      state.data.seenIntro = true;
      this.save();
    }
    await this.advanceStory();
  }

  // ------------------------------------------------------------ main loop
  spawnNpc(n) {
    const npc = new Npc(this, n.id, NPCS[n.id], n);
    npc.on('pointerdown', (ptr, lx, ly, ev) => { ev.stopPropagation(); this.tapTarget({ kind: 'npc', ref: npc }); });
    npc.collider = this.physics.add.collider(this.player, npc);
    return npc;
  }
  // Someone walks off (end of their path, or their routine says they're elsewhere).
  removeNpc(npc) {
    if (npc.gone) return;
    npc.gone = true;
    npc.collider?.destroy();
    this.tweens.add({ targets: npc, alpha: 0, duration: 500, onComplete: () => { this.npcs = this.npcs.filter(n => n !== npc); npc.destroy(); } });
  }
  npcLeft(npc) {
    if (npc.id === 'paddy') state.data.flags.paddyLeft = state.data.day;
    this.removeNpc(npc);
  }
  // Council meets in the chamber on Tuesday nights. Be there to watch.
  async maybeMeeting() {
    const d = state.data;
    if (this.regionId !== 'chamber' || !inMeeting(d) || d.council.metDay === d.day || ui.blocking() || this.meetingNow) return;
    this.meetingNow = true;
    const say = (who, lines) => ui.say(lines, { name: NPCS[who].name, portrait: npcIcon(who) });
    if (state.paddyDeposed()) await say('lesley', ['ORDER! I declare this meeting open. I am the MAYOR now. Paddy will be taking the minutes.', 'I acknowledge the Bunurong people, the Traditional Owners of this land.']);
    else await say('paddy', ['Order, order. I declare this meeting of Hobsons Bay City Council open.', 'I acknowledge the Bunurong people, the Traditional Owners of this land.']);
    // The spill (Chapter 2), if the fish pie never happened
    const c2 = story().ch2;
    if (inChapter(2) && c2.deadline === d.day && !c2.swapped) {
      await say('lesley', ['I MOVE A SPILL! All in favour of a new mayor? Me, Malcolm, Kirsty and Dahlia. Four votes!']);
      await say('paddy', ['...The motion is carried. Congratulations, Mayor Bentleigh.']);
      c2.deposed = true; story().done[2] = d.day; sfx.sad();
      await ui.card({ kicker: 'Chapter 2', title: 'Paddy is rolled', lines: CHAPTERS[2].failed });
    }
    const ready = MOTION_ORDER.filter(id => !state.motionPassed(id) && state.motionReady(id));
    if (!ready.length) {
      await say('lesley', ['POINT OF ORDER! The agenda is in the WRONG FONT!']);
      await say('paddy', ['Noted, Councillor. Again. No motions are ready tonight. Chip in on the noticeboard in the foyer, everyone.', 'Meeting closed. Thank you all.']);
    }
    const results = state.holdMeeting(d.day);
    for (const r of results) {
      const m = MOTIONS[r.id];
      await say(m.sponsor, [`I move: "${m.title}".`]);
      await ui.say(m.debate);
      await say('paddy', [`All those in favour?`, `${r.yes.map(id => NPCS[id].name.replace(/^Cr /, '')).join(', ')}. ${r.yes.length} for.`, `Against: ${r.no.map(id => NPCS[id].name.replace(/^Cr /, '')).join(', ')}. ${r.no.length} against.`]);
      if (r.passed) { sfx.found(); await say('paddy', ['The motion is CARRIED!', m.effect]); }
      else { sfx.sad(); await say('lesley', ['HA! DEFEATED!']); await say('paddy', ['The motion is lost. We go again next week. Maybe bring Kirsty or Dahlia some flowers.']); }
    }
    this.save();
    this.meetingNow = false;
  }

  // ------------------------------------------------------------ the story (data/story.js)
  // A chapter that's done hands over to the next one the following morning.
  async advanceStory() {
    const s = story(), d = state.data;
    if (!state.data.hero) return;
    if (s.chapter === 0) return this.startChapter(1);
    if (s.chapter < 4 && s.done[s.chapter] && s.done[s.chapter] < d.day) return this.startChapter(s.chapter + 1);
  }

  async startChapter(n) {
    const s = story(), d = state.data;
    s.chapter = n;
    this.save();
    if (n === 4) {
      if (s.heroBefore) { d.hero = s.heroBefore; s.heroBefore = null; this.player.refreshLook(); }
      await ui.news({ lines: NEWS_OPEN(s.ch2.deposed) });
    }
    sfx.found();
    await ui.card({ kicker: `Chapter ${n}`, title: CHAPTERS[n].title, lines: CHAPTERS[n].intro, button: 'Let\'s go' });
    if (n === 2) {
      s.ch2 = { ...s.ch2, start: d.day, deadline: spillDeadline(d.day) };
      const npc = this.visitor('paddy');
      await ui.say(PADDY_SPILL, { name: 'Paddy', portrait: npcIcon('paddy') });
      if (npc) this.removeNpc(npc);
      await ui.say([PADDY_SPILL_HINT, `The spill vote is at council on ${weekday(s.ch2.deadline)} night, day ${s.ch2.deadline}. Check the Story app on your Pawphone.`]);
    }
    if (n === 3) {
      if (d.hero === 'helen') { s.heroBefore = 'helen'; d.hero = 'hadrian'; this.player.refreshLook(); }
      await ui.say(['Helen: "Right, I\'m off to Nanna and Pop\'s. Dad\'s in charge. Be good, boys!"', 'The front door closes. The boys look at each other.', 'You are playing as the twins until Helen gets home. Swap between them in Settings.']);
    }
    if (n === 4) await ui.say(['Helen: "Right, team. The September Babies Bash. We\'re going to throw the party of the century, and the whole town is invited."', 'Check the Story app on your Pawphone for the to-do list.']);
    this.save();
  }

  // Someone pops round to say something: they appear beside you for a scene.
  visitor(id) {
    const tx = Math.floor(this.player.x / T), ty = Math.floor(this.player.y / T);
    const spot = [[2, 0], [-2, 0], [0, 2], [0, -2], [1, 1]].map(([dx, dy]) => ({ id, x: tx + dx, y: ty + dy, face: 'down' })).find(p => !this.solidAt((p.x + 0.5) * T, (p.y + 0.75) * T));
    if (!spot || !NPCS[id]) return null;
    const npc = this.spawnNpc(spot);
    this.npcs.push(npc);
    npc.setAlpha(0); this.tweens.add({ targets: npc, alpha: 1, duration: 400 });
    npc.faceTowards(this.player.x, this.player.y);
    this.facePlayerTo(npc.x, npc.y);
    return npc;
  }

  // Chapters 1 and 3 finish by themselves once their objectives are done.
  async checkStory() {
    const n = story().chapter;
    if (this.storyBusy || !chapterFinished(n)) return;
    this.storyBusy = true;
    await this.finishChapter(n);
    this.storyBusy = false;
  }
  async finishChapter(n) {
    story().done[n] = state.data.day;
    this.save();
    sfx.found();
    ui.banner(`Chapter ${n} complete!`, CHAPTERS[n].title);
    await ui.card({ kicker: `Chapter ${n} complete`, title: CHAPTERS[n].title, lines: [...CHAPTERS[n].done, 'The next chapter starts tomorrow morning. Get some sleep!'] });
  }

  // Story things placed in maps: Cr Bentleigh's lunch in the foyer (Chapter 2).
  buildStoryBits() {
    this.lunchSpot = null;
    if (this.regionId === 'civiccentre' && inChapter(2) && !story().ch2.swapped) {
      const pos = toWorld(18, 9);
      const sprite = this.add.image(pos.x, pos.y - 4, 'item-lunchbowl').setOrigin(0.5, 1).setDepth(pos.y).setScale(fitScale(this, 'item-lunchbowl', 12));
      this.lunchSpot = { kind: 'lunch', x: pos.x, y: pos.y - 4, r: 18, sprite, bubble: 'fx-bubble-alert' };
      this.interactables.push(this.lunchSpot);
    }
  }
  lesleyHere() { return this.npcs.some(n => n.id === 'lesley' && !n.gone); }

  // The kitchen stove: cook the dodgy fish pie.
  async cook() {
    const fish = Object.keys(ITEMS).find(id => ITEMS[id].fish && state.count(id) >= CH2_RECIPE.fish);
    const r = RECIPES.fishpie;
    const pick = await ui.say({ text: 'The new oven. It still has the plastic on the dials. Cook something?', choices: [{ label: r.name, value: 'fishpie', note: r.needs }, { label: 'Not now', value: null }] }, { cancelValue: null });
    if (!pick) return;
    if (!fish || state.count('lemon') < CH2_RECIPE.lemon) return ui.say([`You need ${r.needs}. Catch a fish at Edwardes Lake, Edgars Creek or Kororoit Creek. Lemons grow on every second tree in Melbourne.`]);
    state.removeItem(fish); state.removeItem('lemon');
    state.addItem('fishpie');
    story().ch2.pie = true;
    sfx.found();
    ui.toast(`+1 ${ITEMS.fishpie.name}`, itemIcon('fishpie', 32));
    await ui.say(r.text);
    this.save();
  }

  // Cr Bentleigh's lunch on the booth in the foyer (Chapter 2).
  async lunch(t) {
    const s = story(), c2 = s.ch2;
    if (!this.lesleyHere()) return ui.say(['An empty booth. Cr Bentleigh eats her lunch here every weekday, 11am to 3pm.']);
    await ui.say(LUNCH.look);
    if (!state.count('fishpie')) return ui.say([LUNCH.noPie]);
    await ui.say([LUNCH.watching]);
    const pet = this.pets.find(p => p.mode === 'follow');
    if (!pet) return ui.say([LUNCH.noPet]);
    const go = await ui.say({ text: `Send ${form(pet.id).name} to cause a distraction?`, choices: [{ label: 'Go on, cause chaos', value: true }, { label: 'Not yet', value: false }] }, { cancelValue: false });
    if (!go) return;
    const lesley = this.npcs.find(n => n.id === 'lesley' && !n.gone);
    pet.pause?.(3); this.heartsFx(pet, 4); sfx.encounter();
    await ui.say(LUNCH.distract(form(pet.id).name), { name: 'Cr Lesley Bentleigh', portrait: npcIcon('lesley') });
    lesley?.setVisible(false);
    state.removeItem('fishpie');
    t.sprite.setTint(0xc8a050);
    await ui.say(LUNCH.swap);
    lesley?.setVisible(true);
    await ui.say(LUNCH.eat, { name: 'Cr Lesley Bentleigh', portrait: npcIcon('lesley') });
    c2.swapped = true; c2.sickUntil = state.data.day + 7;
    if (lesley) this.removeNpc(lesley);
    this.tweens.add({ targets: t.sprite, alpha: 0, duration: 600, onComplete: () => t.sprite.destroy() });
    this.interactables = this.interactables.filter(x => x !== t); this.lunchSpot = null;
    this.save();
    await this.finishChapter(2);
  }

  // Chapter 3: a prank on one of Helen's friends.
  async prank(npc, opts) {
    const s = story();
    await ui.say(PRANKS[npc.id].lines, opts);
    s.pranks.push(npc.id);
    state.addFriendPoints(npc.id, 5);
    sfx.heart(); this.heartsFx(npc, 4);
    ui.toast(PRANK_AFTER(s.pranks.length));
    this.save();
  }

  // Chapter 4: invite a friend to the party. They come if you're close enough.
  async invite(npc, opts) {
    const s = story(), yes = state.friendHearts(npc.id) >= CH4.rsvpHearts;
    s.invited.push(npc.id);
    await ui.say([`You invite ${npc.info.name} to the September Babies Bash.`, pick(yes ? RSVP.yes : RSVP.maybe)], opts);
    if (yes) { sfx.heart(); this.heartsFx(npc, 3); }
    ui.toast(`Invited: ${s.invited.length}. Coming: ${attendees().length}.`);
    this.save();
  }

  // Chapter 4: the party, in the backyard.
  goToParty() {
    if (this.leaving || !inChapter(4)) return;
    state.data.flags.partyNow = true;
    state.data.minutes = Math.max(state.data.minutes, 18 * 60);
    if (this.regionId === 'yard') { this.partyTime(); return; }
    this.goTo('yard', 'backdoor', 0);
  }
  async partyTime() {
    const s = story(), d = state.data;
    if (!d.flags.partyNow || this.regionId !== 'yard' || this.partying) return;
    this.partying = true; delete d.flags.partyNow;
    const guests = attendees();
    // Everyone who RSVP'd turns up in the backyard.
    const free = [];
    for (let y = 6; y <= 13; y++) for (let x = 3; x <= 18; x++) if (!this.solidAt((x + 0.5) * T, (y + 0.75) * T)) free.push([x, y]);
    free.sort((a, b) => hash(a[0], a[1], d.day) - hash(b[0], b[1], d.day));
    guests.forEach((id, i) => {
      const [x, y] = free[i % free.length], npc = this.spawnNpc({ id, x, y, face: 'down' });
      npc.setAlpha(0); this.tweens.add({ targets: npc, alpha: 1, duration: 400, delay: i * 120 });
      this.npcs.push(npc);
    });
    ui.banner('The September Babies Bash', `${guests.length} ${guests.length === 1 ? 'guest' : 'guests'}`);
    await ui.say([guests.length ? `${guests.length} ${guests.length === 1 ? 'friend turns' : 'friends turn'} up! The backyard is full of fairy lights, bunting and people holding plates.` : 'Nobody you invited could make it. The twins don\'t mind. More cake.', 'Helen: "Right! Party games!"']);
    const score = await ui.party(guests);
    // The drinks and decorations get used up.
    let need = CH4.drinks;
    for (const id of Object.keys(ITEMS).filter(k => ITEMS[k].drink)) while (need > 0 && state.count(id)) { state.removeItem(id); need--; }
    need = CH4.decos;
    for (const id of Object.keys(ITEMS).filter(k => ITEMS[k].deco)) while (need > 0 && state.count(id)) { state.removeItem(id); need--; }
    guests.forEach(id => state.addFriendPoints(id, 10));
    const votes = electionVotes(score, guests.length), won = votes >= 50;
    s.party = { score, attendees: guests, votes, won };
    s.done[4] = d.day;
    this.save();
    await ui.say(['The party winds down at 1am. Somebody is asleep in the paddling pool. It is Corni.', 'A week later, Hobsons Bay votes.']);
    this.cameras.main.fadeOut(500, 0, 0, 0);
    await new Promise(r => this.cameras.main.once('camerafadeoutcomplete', r));
    await ui.news({ lines: NEWS_RESULT(votes, won, s.ch2.deposed), votes });
    this.cameras.main.fadeIn(500, 0, 0, 0);
    if (won) { sfx.found(); this.heartsFx(this.player, 10); }
    await ui.card({ kicker: 'The end, for now', title: won ? 'Mayor Paddy!' : 'So close!', lines: THE_END, button: 'Keep playing' });
    s.chapter = 5;
    this.partying = false;
    this.save();
  }

  syncRoutines() {
    for (const n of this.map.npcs) {
      if (!n.at || !NPCS[n.id]) continue;
      const here = isAt(n.id, n.at, state.data), live = this.npcs.find(x => x.spot === n && !x.gone);
      if (here && !live) { const npc = this.spawnNpc(n); npc.setAlpha(0); this.tweens.add({ targets: npc, alpha: 1, duration: 500 }); this.npcs.push(npc); }
      else if (!here && live && !n.leave) this.removeNpc(live);
    }
  }

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
    // Breadcrumb trail for the pets following you
    const last = this.trail[this.trail.length - 1];
    if (!last || Math.hypot(last.x - this.player.x, last.y - this.player.y) > 3) {
      this.trail.push({ x: this.player.x, y: this.player.y });
      if (this.trail.length > 80) this.trail.shift();
    }
    // Roofs (carports, canopies) fade when you walk underneath
    for (const r of this.roofs) {
      const under = this.player.x > r.x0 && this.player.x < r.x1 && this.player.y > r.y0 && this.player.y < r.y1 + 6;
      r.img.setAlpha(Phaser.Math.Linear(r.img.alpha, under ? 0.35 : 1, 0.2));
    }
    if (this.pending) {
      const t = this.pending, x = t.ref ? t.ref.x : t.x, y = t.ref ? t.ref.y : t.y;
      if (Math.hypot(x - this.player.x, y - this.player.y) < 24) this.interact(t);
      else if (!this.player.target) this.pending = null;
      else this.player.target = { x, y: y + 8 };
    }
    for (const p of this.pets) p.update(this.player, dt, blocked);
    for (const n of this.npcs) if (!n.gone) n.update(this.player, dt, blocked);
    const tick = Math.floor(state.data.minutes / 10);
    if (tick !== this.routineTick) { this.routineTick = tick; this.syncRoutines(); this.maybeMeeting(); }
    this.traffic.update(dt, this.player, blocked);
    this.updateDecor(dt, blocked);
    this.updateLighting();
    this.updateRain();
    if (!blocked) { this.checkExits(); this.checkEncounter(); }
    if (!blocked && time > (this.nextStoryCheck || 0)) { this.nextStoryCheck = time + 1000; this.checkStory(); }
    if (this.lunchSpot) this.lunchSpot.sprite.setVisible(this.lesleyHere());

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
