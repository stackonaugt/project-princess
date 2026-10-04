// The HTML half of a battle: status boxes, messages and the action menus.
// The BattleScene drives it; this file only shows things and waits for taps.

import { h, $ } from './dom.js';
import { TYPES } from '../data/types.js';
import { sfx } from '../systems/sfx.js';

const TYPE_SPEED = 55;   // characters per second
const AUTO_MS = 1500;    // messages move on by themselves after this (plus reading time)

const typeTag = type => h('span', { class: 'tag', style: { background: TYPES[type].colour } }, TYPES[type].name);

export const battleUI = {
  active: false,
  _msg: null, _menu: null,

  open() {
    this.active = true;
    $('battle').hidden = false;
    document.body.classList.add('battling');
    $('btFoe').classList.add('off'); $('btMine').classList.add('off');
    $('btMsg').textContent = ''; $('btMenu').replaceChildren();
    $('battle').querySelector('.bt-panel').onclick = e => { if (!e.target.closest('.bt-menu')) this.action(); };
  },
  close() {
    this.active = false;
    clearInterval(this._typeT); clearTimeout(this._autoT);
    $('battle').hidden = true;
    document.body.classList.remove('battling');
  },
  panelHeight() { return $('battle').querySelector('.bt-panel').offsetHeight; },

  // ---------- status boxes ----------
  show(side, on = true) { $(side === 'foe' ? 'btFoe' : 'btMine').classList.toggle('off', !on); },
  setFighter(f, extra = {}) {
    const box = $(f.side === 'foe' ? 'btFoe' : 'btMine');
    box.replaceChildren(...[
      h('div', { class: 'bt-name' }, h('span', {}, f.name), h('span', { class: 'lv' }, `Lv ${f.level}`)),
      h('div', { class: 'bt-sub' }, typeTag(f.type), f.held ? h('span', { class: 'bt-held' }, `holding a ${f.held}`) : null),
      h('div', { class: 'bt-hp' }, h('span', {}, 'HP'), h('div', { class: 'track' }, h('div', { class: 'fill' }))),
      f.side === 'mine' ? h('div', { class: 'bt-nums' }) : null,
      f.side === 'mine' ? h('div', { class: 'bt-xp' }, h('span')) : null,
      extra.team ? h('div', { class: 'bt-team', 'aria-label': 'Your team' }, ...extra.team.map(s => h('i', { class: s }))) : null,
    ].filter(Boolean));
    this.hp(f, true);
    if (extra.xp != null) this.xp(extra.xp, true);
  },
  hp(f, instant = false) {
    const box = $(f.side === 'foe' ? 'btFoe' : 'btMine'), fill = box.querySelector('.fill');
    if (!fill) return;
    const pct = Math.max(0, f.hp / f.maxHp * 100);
    if (instant) { fill.style.transition = 'none'; void fill.offsetWidth; }
    fill.style.width = pct + '%';
    fill.classList.toggle('mid', pct <= 50 && pct > 20); fill.classList.toggle('low', pct <= 20);
    if (instant) { void fill.offsetWidth; fill.style.transition = ''; }
    const nums = box.querySelector('.bt-nums');
    if (nums) nums.textContent = `${Math.max(0, Math.ceil(f.hp))} / ${f.maxHp}`;
    const held = box.querySelector('.bt-held');
    if (held && !f.held) held.remove();
  },
  xp(frac, instant = false) {
    const bar = $('btMine').querySelector('.bt-xp span');
    if (!bar) return;
    if (instant) { bar.style.transition = 'none'; void bar.offsetWidth; }
    bar.style.width = Math.min(100, frac * 100) + '%';
    if (instant) { void bar.offsetWidth; bar.style.transition = ''; }
  },

  // ---------- messages ----------
  // Types the text out, then resolves on a tap or after a short wait.
  message(text, { auto = true } = {}) {
    this.clearMenu();
    return new Promise(resolve => {
      clearInterval(this._typeT); clearTimeout(this._autoT);
      const el = $('btMsg');
      el.classList.remove('wait');
      const start = performance.now();
      this._msg = { text, done: false, resolve };
      const finish = () => {
        clearInterval(this._typeT);
        el.textContent = text; this._msg.done = true;
        el.classList.add('wait');
        if (auto) this._autoT = setTimeout(() => this.action(), AUTO_MS + text.length * 18);
      };
      this._msg.finish = finish;
      this._typeT = setInterval(() => {
        const n = Math.floor((performance.now() - start) / 1000 * TYPE_SPEED);
        if (n >= text.length) return finish();
        el.textContent = text.slice(0, n);
      }, 16);
    });
  },
  // Show text without waiting (for menus).
  prompt(text) {
    clearInterval(this._typeT); clearTimeout(this._autoT);
    this._msg = null;
    $('btMsg').classList.remove('wait');
    $('btMsg').textContent = text;
  },

  // ---------- menus ----------
  // items: { label, value, note, type, icon, disabled, back }
  menu(items, { layout = 'grid' } = {}) {
    return new Promise(resolve => {
      const el = $('btMenu');
      el.className = 'bt-menu ' + layout;
      this._menu = { items, resolve, sel: Math.max(0, items.findIndex(i => !i.disabled)) };
      el.replaceChildren(...items.map((it, i) => h('button', {
        class: 'bt-btn' + (it.back ? ' back' : ''), disabled: !!it.disabled,
        style: it.type ? { borderLeftColor: TYPES[it.type].colour } : {},
        onclick: e => { e.stopPropagation(); this.pick(i); },
      }, it.icon ? h('img', { src: it.icon, alt: '' }) : null, h('span', {}, it.label), it.type ? typeTag(it.type) : null, it.note ? h('small', {}, it.note) : null)));
      this.highlight();
    });
  },
  highlight() {
    const m = this._menu; if (!m) return;
    [...$('btMenu').children].forEach((b, i) => b.classList.toggle('sel', i === m.sel));
  },
  pick(i) {
    const m = this._menu; if (!m || m.items[i].disabled) return;
    sfx.select();
    this._menu = null;
    this.clearMenu();
    m.resolve(m.items[i].value);
  },
  clearMenu() { $('btMenu').replaceChildren(); },

  // ---------- input (keyboard and the A/B buttons) ----------
  action() {
    if (this._menu) return this.pick(this._menu.sel);
    const m = this._msg; if (!m) return;
    if (!m.done) return m.finish();
    clearTimeout(this._autoT);
    this._msg = null;
    $('btMsg').classList.remove('wait');
    m.resolve();
  },
  cancel() {
    const m = this._menu;
    if (m) { const i = m.items.findIndex(it => it.back); if (i >= 0) return this.pick(i); return; }
    this.action();
  },
  dir(dx, dy) {
    const m = this._menu; if (!m) return;
    const cols = getComputedStyle($('btMenu')).gridTemplateColumns.split(' ').length;
    const step = dy ? dy * cols : dx;
    let i = m.sel;
    for (let k = 0; k < m.items.length; k++) {
      i = (i + step + m.items.length) % m.items.length;
      if (!m.items[i].disabled) break;
    }
    m.sel = i; sfx.select(); this.highlight();
  },
};
