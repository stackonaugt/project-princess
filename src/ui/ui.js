// The HTML layer on top of the game: HUD, dialogue, banners, toasts and the
// pop-up screens (Petdex, Bag, Menu). Text is far crisper as HTML than as
// canvas text on phones, which is why it lives here and not in Phaser.

import { bus } from '../bus.js';
import { h, $ } from './dom.js';
import { sfx } from '../systems/sfx.js';
import { state } from '../systems/state.js';
import { timeLabel } from '../systems/clock.js';
import { PETS } from '../data/pets.js';
import { ZONES, SUBURBS } from '../data/regions.js';
import { openTeam } from './team.js';
import { openHero } from './hero.js';
import { openPetdex } from './petdex.js';
import { openBag } from './bag.js';
import { openMenu } from './menu.js';

const TYPE_SPEED = 38; // characters per second

export const ui = {
  scene: null,         // set by the world scene, used to turn textures into images
  worldAction: null,   // what the A button does when no UI is open
  modalOpen: false,
  dialog: null,

  blocking() { return !!this.dialog || this.modalOpen; },

  init() {
    bus.on('input:action', () => {
      if (this.dialog) return this.advance();
      if (this.modalOpen) return;
      this.worldAction && this.worldAction();
    });
    bus.on('input:cancel', () => {
      if (this.dialog) return this.cancelDialog();
      if (this.modalOpen) return this.closeModal();
    });
    bus.on('input:dir', (dx, dy) => { if (this.dialog?.choices && dy) this.moveChoice(dy); });
    bus.on('input:dex', () => this.toggle('dex'));
    bus.on('input:bag', () => this.toggle('bag'));
    bus.on('input:menu', () => this.toggle('menu'));
    $('btnDex').addEventListener('click', () => this.toggle('dex'));
    $('btnBag').addEventListener('click', () => this.toggle('bag'));
    $('btnMenu').addEventListener('click', () => this.toggle('menu'));
    $('dialog').addEventListener('click', e => { if (!e.target.closest('.d-choices')) this.advance(); });
    $('modal').addEventListener('click', e => { if (e.target.id === 'modal') this.closeModal(); });
    bus.on('petdex:changed', () => this.updateDexCount());
    bus.on('bag:changed', () => this.updateBagCount());
    this.updateDexCount(); this.updateBagCount();
  },

  // ---------- HUD ----------
  updateHud(region) {
    const d = state.data;
    const z = ZONES[region], sub = SUBURBS[z.suburb].name;
    $('hudRegion').textContent = z.name === sub ? z.name : `${z.name}, ${sub}`;
    $('hudClock').textContent = `Day ${d.day} · ${timeLabel(d.minutes)}`;
    $('hudWeather').textContent = state.isRaining() ? '☂' : (d.minutes >= 20 * 60 ? '☾' : '☀');
    $('hudWeather').title = state.isRaining() ? 'Raining' : 'Clear';
  },
  updateDexCount() { $('dexCount').textContent = `${state.foundCount()}/${PETS.length}`; },
  updateBagCount() {
    const n = Object.values(state.data.inventory).reduce((a, b) => a + b, 0);
    $('bagCount').textContent = n ? String(n) : '';
  },

  // ---------- Banner & toasts ----------
  banner(title, sub = '') {
    const el = $('banner');
    el.replaceChildren(h('div', { class: 'b-title' }, title), sub ? h('div', { class: 'b-sub' }, sub) : null);
    el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
    clearTimeout(this._bannerT);
    this._bannerT = setTimeout(() => el.classList.remove('show'), 2600);
  },
  toast(text, icon = null) {
    const el = h('div', { class: 'toast' }, icon ? h('img', { src: icon, alt: '' }) : null, h('span', {}, text));
    $('toasts').append(el);
    setTimeout(() => el.classList.add('out'), 2200);
    setTimeout(() => el.remove(), 2700);
  },

  // ---------- Dialogue ----------
  // lines: strings or { text, name, portrait, choices: [{ label, value }] }
  // Resolves with the chosen value (or undefined).
  say(lines, opts = {}) {
    if (!Array.isArray(lines)) lines = [lines];
    return new Promise(resolve => {
      const queue = lines.map(l => (typeof l === 'string' ? { text: l } : l)).map(l => ({ name: opts.name, portrait: opts.portrait, ...l }));
      const start = () => {
        this.dialog = { queue, i: -1, resolve, result: undefined, cancelValue: opts.cancelValue };
        $('dialog').hidden = false;
        document.body.classList.add('talking');
        this.nextLine();
      };
      if (this.dialog) { const prev = this.dialog.resolve; this.dialog.resolve = v => { prev(v); start(); }; } else start();
    });
  },
  nextLine() {
    const d = this.dialog;
    d.i++;
    if (d.i >= d.queue.length) return this.endDialog();
    const line = d.queue[d.i];
    d.line = line; d.shown = 0; d.choices = null; d.choice = 0;
    $('dName').textContent = line.name || '';
    $('dName').hidden = !line.name;
    const img = $('dPortrait');
    img.hidden = !line.portrait;
    if (line.portrait) img.querySelector('img').src = line.portrait;
    $('dChoices').replaceChildren();
    $('dialog').classList.remove('has-choices', 'done');
    this.typeStart = performance.now();
    clearInterval(this.typeTimer);
    this.typeTimer = setInterval(() => this.typeTick(), 16);
    this.typeTick();
  },
  typeTick() {
    const d = this.dialog; if (!d) return;
    const text = d.line.text, n = Math.min(text.length, Math.floor((performance.now() - this.typeStart) / 1000 * TYPE_SPEED));
    if (n > d.shown && n % 3 === 0) sfx.blip();
    d.shown = n;
    $('dText').textContent = text.slice(0, n);
    if (n >= text.length) { clearInterval(this.typeTimer); this.showChoices(); }
  },
  showChoices() {
    const d = this.dialog;
    $('dialog').classList.toggle('done', true);
    if (!d.line.choices || d.choices) return;
    d.choices = d.line.choices;
    $('dialog').classList.add('has-choices');
    $('dChoices').replaceChildren(...d.choices.map((c, i) => h('li', {},
      h('button', { class: 'choice' + (i === 0 ? ' sel' : ''), onclick: e => { e.stopPropagation(); this.pick(i); } },
        c.icon ? h('img', { src: c.icon, alt: '' }) : null, h('span', {}, c.label), c.note ? h('small', {}, c.note) : null))));
  },
  moveChoice(dy) {
    const d = this.dialog;
    d.choice = (d.choice + dy + d.choices.length) % d.choices.length;
    [...$('dChoices').querySelectorAll('.choice')].forEach((b, i) => b.classList.toggle('sel', i === d.choice));
    $('dChoices').querySelectorAll('.choice')[d.choice]?.scrollIntoView({ block: 'nearest' });
    sfx.select();
  },
  pick(i) {
    const d = this.dialog; if (!d?.choices) return;
    sfx.select();
    d.result = d.choices[i].value;
    this.nextLine();
  },
  advance() {
    const d = this.dialog; if (!d) return;
    if (d.shown < d.line.text.length) { this.typeStart = -1e9; this.typeTick(); return; }
    if (d.choices) return this.pick(d.choice);
    this.nextLine();
  },
  cancelDialog() {
    const d = this.dialog; if (!d) return;
    if (d.choices && d.cancelValue !== undefined) { d.result = d.cancelValue; return this.nextLine(); }
    this.advance();
  },
  endDialog() {
    const d = this.dialog;
    clearInterval(this.typeTimer);
    this.dialog = null;
    $('dialog').hidden = true;
    $('dialog').classList.remove('done', 'has-choices');
    document.body.classList.remove('talking');
    d.resolve(d.result);
  },

  // ---------- Team ----------
  // Resolves with an array of pet ids, or null if they backed out.
  chooseTeam() {
    return new Promise(resolve => {
      this._teamResolve = resolve;
      this.openModal('team');
    });
  },

  // Resolves with a hero id (or null if cancelled, when allowed).
  chooseHero(canCancel = false) {
    return new Promise(resolve => {
      this._heroResolve = resolve; this._heroCancel = canCancel;
      this.openModal('hero');
    });
  },

  // ---------- Modals ----------
  toggle(which) {
    if (this.dialog || this.modalOpen === 'team' || this.modalOpen === 'hero') return;
    if (this.modalOpen === which) return this.closeModal();
    this.openModal(which);
  },
  openModal(which) {
    const panel = $('modalPanel');
    panel.replaceChildren();
    panel.className = `panel panel-${which}`;
    const close = () => this.closeModal();
    if (which === 'dex') openPetdex(panel, close);
    if (which === 'bag') openBag(panel, close);
    if (which === 'menu') openMenu(panel, close);
    if (which === 'hero') openHero(panel, id => { const r = this._heroResolve; this._heroResolve = null; this.closeModal(); r && r(id); }, { canCancel: this._heroCancel });
    if (which === 'team') openTeam(panel, ids => { const r = this._teamResolve; this._teamResolve = null; this.closeModal(); r && r(ids); });
    $('modal').hidden = false;
    if (!this.modalOpen) sfx.open();
    this.modalOpen = which;
    bus.emit('ui:modal', which);
  },
  closeModal() {
    if (!this.modalOpen) return;
    $('modal').hidden = true;
    this.modalOpen = false;
    sfx.close();
    bus.emit('ui:modal', null);
    // Closing the team picker without choosing means "not leaving yet".
    if (this._teamResolve) { const r = this._teamResolve; this._teamResolve = null; r(null); }
    if (this._heroResolve) { if (!this._heroCancel) { this.openModal('hero'); return; } const r = this._heroResolve; this._heroResolve = null; r(null); }
  },
};
