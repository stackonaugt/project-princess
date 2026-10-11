import { h } from "./dom.js";
import {
  BakingSession,
  MIX_METHODS,
  POUR_MAX,
  POUR_RATE,
  bakeColour,
} from "../systems/baking.js";
import { heroIcon } from "./images.js";
import { state } from "../systems/state.js";
import { sfx } from "../systems/sfx.js";

// Draw a bake. side: the view through the oven door and on the plate.
// top: the cake seen from above with its topping and piping.
const esc = s => String(s).replace(/[^#\w.,() -]/g, '');
export function bakeSideSVG(look = {}, { rise = 1, brown = .62, sunk = 0, topping = null } = {}) {
  const crust = bakeColour(brown), crumb = esc(look.crumb || '#f4e0a8'), top = topping ? esc(topping) : crust;
  const ht = 10 + 26 * Math.max(.15, rise), base = 62, dip = sunk * 10;
  const dome = (x0, x1, y) => `M${x0} ${base} L${x0} ${y} Q${(x0 + x1) / 2} ${y - 8 + dip * 2} ${x1} ${y} L${x1} ${base} Z`;
  let body = '';
  switch (look.shape) {
    case 'cookies':
      body = [20, 50, 80].map(x => `<ellipse cx="${x}" cy="${base - 4}" rx="13" ry="${3 + rise * 3}" fill="${crust}" stroke="#3a2416"/>` +
        `<circle cx="${x - 4}" cy="${base - 5}" r="1.6" fill="#3a2016"/><circle cx="${x + 5}" cy="${base - 4}" r="1.4" fill="#3a2016"/>` +
        (topping ? `<path d="M${x - 9} ${base - 6} l4 -2 l4 2 l4 -2 l4 2" stroke="${top}" stroke-width="1.6" fill="none"/>` : '')).join('');
      break;
    case 'scones':
      body = [24, 50, 76].map(x => `<rect x="${x - 10}" y="${base - ht * .7}" width="20" height="${ht * .7}" rx="4" fill="${crumb}" stroke="#3a2416"/>` +
        `<rect x="${x - 10}" y="${base - ht * .7}" width="20" height="5" rx="3" fill="${crust}"/>` +
        (topping ? `<ellipse cx="${x}" cy="${base - ht * .7 - 1}" rx="8" ry="3" fill="${top}"/>` : '')).join('');
      break;
    case 'tart':
      body = `<path d="M12 ${base} L16 ${base - 14} L84 ${base - 14} L88 ${base} Z" fill="${crust}" stroke="#3a2416"/>` +
        `<rect x="18" y="${base - 16}" width="64" height="4" fill="${crumb}"/>` +
        [26, 38, 50, 62, 74].map(x => `<circle cx="${x}" cy="${base - 17}" r="4" fill="#d83a4a" stroke="#7a1a22"/>`).join('') +
        (topping ? `<path d="M18 ${base - 15} L82 ${base - 15}" stroke="${top}" stroke-width="2" opacity=".7"/>` : '');
      break;
    case 'pudding':
      body = `<path d="M16 ${base - 26} L84 ${base - 26} L78 ${base} L22 ${base} Z" fill="#f4f1ea" stroke="#3a3a40"/>` +
        `<path d="${dome(20, 80, base - 22 - ht * .3)}" fill="${crust}" stroke="#3a2416"/>` +
        (topping ? `<path d="M26 ${base - 24 - ht * .3} Q50 ${base - 32 - ht * .3} 74 ${base - 24 - ht * .3}" stroke="${top}" stroke-width="4" fill="none" stroke-linecap="round"/>` : '');
      break;
    case 'loaf':
      body = `<path d="${dome(18, 82, base - ht)}" fill="${crust}" stroke="#3a2416"/>` +
        `<path d="M24 ${base - 6} L76 ${base - 6}" stroke="${crumb}" stroke-width="2" opacity=".6"/>` +
        (topping ? `<path d="M22 ${base - ht - 1} Q50 ${base - ht - 10 + dip * 2} 78 ${base - ht - 1}" stroke="${top}" stroke-width="5" fill="none" stroke-linecap="round"/>` : '');
      break;
    default: { // layer cake
      const half = ht / 2;
      body = `<rect x="18" y="${base - half}" width="64" height="${half}" rx="3" fill="${crumb}" stroke="#3a2416"/>` +
        `<rect x="18" y="${base - half - 3}" width="64" height="3" fill="${esc(look.filling || '#d83a4a')}"/>` +
        `<path d="${dome(18, 82, base - ht)}" transform="translate(0 ${-half})" fill="${crust}" stroke="#3a2416"/>` +
        (topping ? `<path d="M18 ${base - ht - half} Q50 ${base - ht - half - 8 + dip * 2} 82 ${base - ht - half}" stroke="${top}" stroke-width="5" fill="none" stroke-linecap="round"/>` : '');
    }
  }
  const el = h('div', { class: 'bk-side', role: 'img', 'aria-label': 'The bake' });
  el.innerHTML = `<svg viewBox="0 0 100 70" width="100%" height="100%"><ellipse cx="50" cy="64" rx="44" ry="5" fill="#ece6da" stroke="#8a8478"/>${body}</svg>`;
  return el;
}
const pathD = strokes => strokes.map(s => s.map(([x, y], i) => `${i ? 'L' : 'M'}${(x * 100).toFixed(1)} ${(y * 100).toFixed(1)}`).join(' ')).join(' ');
const inkStrokes = ink => { const out = [[]]; for (const p of ink || []) p ? out[out.length - 1].push(p) : out.push([]); return out.filter(s => s.length); };
function topSVG(look, topping, ink, guide) {
  const base = bakeColour(.62), coat = topping?.colour || base;
  return `<svg viewBox="0 0 100 100" width="100%" height="100%">
    <circle cx="50" cy="50" r="47" fill="${esc(look?.crust || base)}" stroke="#3a2416" stroke-width="2"/>
    <circle cx="50" cy="50" r="42" fill="${esc(coat)}" opacity="${topping ? .55 : 0}"/>
    ${guide ? `<path d="${pathD(guide)}" stroke="#3a2416" stroke-opacity=".45" stroke-width="2" stroke-dasharray="2 3" fill="none" stroke-linecap="round"/>` : ''}
    <path d="${pathD(inkStrokes(ink))}" stroke="${esc(coat)}" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 1px 0 rgba(40,20,10,.5))"/>
  </svg>`;
}
export const starText = n => '★'.repeat(Math.floor(n)) + (n % 1 ? '½' : '') + '☆'.repeat(3 - Math.ceil(n));

export function openBaking(panel, close, opts = {}) {
  const s = opts.session instanceof BakingSession ? opts.session : new BakingSession({ recipe: opts.recipe || null });
  const single = !!opts.singleStage;
  const startStage = s.stage;
  let raf = 0, last = 0, cleaned = false, ui = {}, pouring = null, piping = false, nozzle = [.5, .5], nozzleDown = false;
  const body = h("div", { class: "m-scroll bk" });
  const live = h("p", { class: "bk-live", role: "status", "aria-live": "polite" });
  const dots = h("div", { class: "bk-dots", "aria-hidden": "true" });
  panel.replaceChildren(
    h("div", { class: "m-head" },
      h("h2", {}, `${opts.name || "Baking"}${s.competition ? ": workbench" : ""}`),
      h("button", { class: "wood-btn small bk-tap", onclick: () => close() }, "Cancel")),
    body,
  );

  const hero = () => h("img", { class: "pix bk-hero", src: heroIcon(state?.data?.hero || "helen"), alt: "", width: 32, height: 64 });
  const btn = (label, fn, cls = "", aria) => h("button", { class: `wood-btn bk-tap ${cls}`, onclick: fn, "aria-label": aria }, label);
  const holdBtn = (label, on, off, cls = "", aria) => h("button", {
    class: `wood-btn bk-tap ${cls}`, "aria-label": aria || label,
    onpointerdown: e => { e.preventDefault(); on(); }, onpointerup: off, onpointerleave: off, onpointercancel: off,
    onclick: e => { if (e.detail === 0) { on(); setTimeout(off, 250); } },
  }, label);

  function head(help = s.current.instruction) {
    dots.replaceChildren(...s.stages.map((k, i) =>
      h("span", { class: `bk-dot${i < s.stage ? " done" : i === s.stage ? " on" : ""}` }, ['Squeezing', 'Mixing', 'Baking', 'Finishing'][['juice', 'mix', 'oven', 'finish'].indexOf(k)])));
    return [h("div", { class: "bk-top" }, hero(), dots), h("p", { class: "bk-help" }, help)];
  }

  function render() {
    ui = {};
    if (s.complete) return renderFinal();
    if (single && s.stage > startStage) return renderHandoff();
    if (s.kind === 'juice' || (s.juice && !s.juice.done)) renderJuice();
    else if (s.kind === 'mix') renderMix();
    else if (s.kind === 'oven') renderOven();
    else renderFinish();
  }

  // ---------- squeezing
  function renderJuice() {
    ui.lemon = h("div", { class: "bk-lemon", role: "img", "aria-label": "Lemon in the press" });
    ui.press = h("div", { class: "bk-press" }, h("i", { class: "bk-press-zone" }), h("i", { class: "bk-press-mark" }));
    ui.jug = h("div", { class: "bk-jug", role: "img", "aria-label": "Juice jug" }, h("span", { class: "bk-fill", style: { background: "#f6e98a" } }));
    ui.count = h("p", { class: "bk-mixstate" });
    ui.go = btn(s.kind === 'juice' ? s.current.label : 'Done squeezing', () => { if (s.kind === 'juice') finish(); else { s.juiceDone(); live.textContent = s.feedback; render(); } }, "bk-go");
    body.replaceChildren(
      ...head(`First, the lemons. Hold Squeeze to juice each one. Keep the needle in the green: squeeze too hard and the pips go in.`),
      h("div", { class: "bk-juice" }, ui.lemon, h("div", { class: "bk-press-wrap" }, h("small", {}, "Pressure"), ui.press), ui.jug),
      ui.count,
      h("div", { class: "bk-methods" },
        holdBtn("Squeeze (hold J)", () => s.squeeze(true), () => s.squeeze(false), "bk-big"),
        btn("Next lemon (N)", () => { s.nextLemon(); render(); })),
      live, ui.go);
    juiceUpdate();
  }
  let lastPips = 0;
  function juiceUpdate() {
    const j = s.juice; if (!j || !ui.press) return;
    ui.press.style.setProperty('--p', j.pressure);
    ui.lemon.style.setProperty('--squash', 1 - j.pressure * .35);
    ui.lemon.dataset.left = String(Math.round((1 - (j.yields[j.lemon] || 0)) * 100));
    const total = j.yields.reduce((a, b) => a + b, 0) / j.lemons;
    ui.jug.firstChild.style.height = `${total * 100}%`;
    ui.count.textContent = `Lemon ${Math.min(j.lemon + 1, j.lemons)} of ${j.lemons} · ${Math.round((j.yields[j.lemon] || 0) * 100)}% squeezed${j.pips ? ` · ${j.pips} pip${j.pips > 1 ? 's' : ''} in the jug` : ''}`;
    if (j.pips !== lastPips) { lastPips = j.pips; live.textContent = s.feedback; sfx.bump(); }
    ui.go.disabled = !(j.lemon > 0 || j.yields[0] > 0);
  }

  // ---------- mixing
  function renderMix() {
    const rows = s.ingredients.map((ing, i) => {
      const fill = h("span", { class: "bk-fill", style: { background: ing.colour } });
      const line = h("span", { class: "bk-line", style: { bottom: `${(ing.target / POUR_MAX) * 100}%` } });
      const cup = h("div", { class: "bk-cup", role: "img", "aria-label": `${ing.name} cup` }, fill, line);
      ui["f" + ing.id] = fill; ui["l" + ing.id] = line;
      return h("div", { class: `bk-row ${ing.dry ? "dry" : "wet"}` }, cup,
        h("div", { class: "bk-name" }, h("b", {}, `${i + 1}. ${ing.name}`), h("small", {}, ing.dry ? "Dry" : "Wet", ` · hold ${i + 1}`)),
        holdBtn("Pour", () => { pouring = ing.id; }, () => { if (pouring === ing.id) pouring = null; }, "bk-step bk-pour", `Hold to pour ${ing.name}`));
    });
    ui.batter = h("div", { class: "bk-batter" });
    ui.bowl = h("div", { class: "bk-bowl", role: "img", "aria-label": "Mixing bowl" }, ui.batter);
    ui.mixState = h("p", { class: "bk-mixstate" });
    ui.flash = h("p", { class: "bk-flash", role: "timer" });
    ui.methods = MIX_METHODS.map((m) => h("button", { class: "bk-method bk-tap", "aria-pressed": "false", onclick: () => { s.setMethod(m.id); mixUpdate(); } },
      m.id === "fold" ? "Fold: gentle" : "Whisk: quick, risks toughness"));
    ui.stir = btn("Stir (M)", () => { s.stroke(); ui.bowl.classList.remove("stir"); void ui.bowl.offsetWidth; ui.bowl.classList.add("stir"); mixUpdate(); }, "bk-stir");
    ui.go = btn(s.current.label, finish, "bk-go");
    body.replaceChildren(
      ...head(), ui.flash,
      h("div", { class: "bk-grid" }, h("div", { class: "bk-cups" }, rows),
        h("div", { class: "bk-mixer" }, ui.bowl, ui.mixState, s.spec.drink ? null : h("div", { class: "bk-methods" }, ui.methods), ui.stir)),
      live, ui.go);
    mixUpdate();
    s.ingredients.forEach((i) => cupUpdate(i.id));
  }
  function pour(id, d) { s.pour(id, d); cupUpdate(id); mixUpdate(); }
  function cupUpdate(id) { if (ui["f" + id]) ui["f" + id].style.height = `${((s.st.amounts[id] || 0) / POUR_MAX) * 100}%`; }
  const MIXTXT = { dry: "Nothing is mixed yet.", lumpy: "Lumpy. Keep going.", glossy: "Glossy and ready.", tight: "Tight and tough. Too much." };
  function mixUpdate() {
    if (s.kind !== 'mix' || !ui.batter) return;
    const poured = s.ingredients.reduce((a, i) => a + (s.st.amounts[i.id] || 0), 0);
    const sm = s.smoothness();
    ui.batter.style.height = `${Math.min(80, 10 + poured * 2.4)}%`;
    ui.batter.style.setProperty("--smooth", sm);
    ui.batter.style.setProperty("--lumps", Math.round((1 - sm) * 100) + "%");
    ui.batter.dataset.mix = s.mixState();
    ui.mixState.textContent = s.spec.drink ? (s.st.effort >= 10 ? 'Sugar dissolved.' : 'Sugar still gritty. Keep stirring.') : MIXTXT[s.mixState()];
    ui.methods.forEach((el, i) => el.setAttribute("aria-pressed", String(MIX_METHODS[i].id === s.st.method)));
    const show = s.showLines();
    s.ingredients.forEach(i => ui["l" + i.id]?.classList.toggle('gone', !show));
    ui.flash.textContent = show ? `Remember the lines! ${Math.ceil(s.st.flash)}` : 'Pour from memory.';
    ui.go.disabled = !s.canFinish();
  }

  // ---------- the oven
  function renderOven() {
    const o = s.spec.oven;
    ui.view = h("div", { class: "bk-oven-glass", role: "img", "aria-label": "Oven door" });
    ui.glow = h("div", { class: "bk-oven-glow" });
    ui.heat = h("div", { class: "bk-heatfill" });
    ui.temp = h("div", { class: "bk-tempmark" });
    ui.range = h("div", { class: "bk-heat", role: "meter", "aria-label": "Oven heat" }, ui.heat, ui.temp);
    ui.timer = h("p", { class: "bk-ovtimer", role: "timer" });
    ui.peek = btn("", () => { if (s.check()) { sfx.whoosh(); live.textContent = s.feedback; ovenUpdate(true); } }, "bk-big");
    ui.go = btn(s.current.label, finish, "bk-go");
    body.replaceChildren(
      ...head(),
      h("p", { class: "bk-recipe" }, `Recipe card: about ${o.time} seconds with the dial at ${Math.round(o.heat * 10)}. You may open the door ${o.checks === 1 ? 'once' : `${o.checks} times`}.`),
      h("div", { class: "bk-oven" },
        h("div", { class: "bk-oven-body" }, ui.glow, ui.view, ui.timer),
        h("div", { class: "bk-dial" }, h("small", {}, "Dial (arrow keys)"),
          btn("Hotter", () => heat(0.1), "bk-big", "Turn heat up"), ui.range, btn("Cooler", () => heat(-0.1), "bk-big", "Turn heat down"), ui.peek)),
      live, ui.go);
    ovenUpdate(true);
  }
  function heat(d) { s.nudgeHeat(d); ovenUpdate(); }
  let wasPeeking = null;
  function ovenUpdate(force = false) {
    if (s.kind !== 'oven' || !ui.view) return;
    const o = s.st, peeking = o.peek > 0;
    if (peeking !== wasPeeking || force) {
      wasPeeking = peeking;
      ui.view.classList.toggle('open', peeking);
      ui.view.replaceChildren(peeking ? bakeSideSVG(s.spec.look, o) : h('div', { class: 'bk-door' }, h('span', {}, 'Door shut')));
    } else if (peeking) ui.view.firstChild.replaceWith(bakeSideSVG(s.spec.look, o));
    ui.glow.style.opacity = String(0.15 + o.temp * 0.85);
    ui.heat.style.transform = `scaleX(${o.heat})`;
    ui.temp.style.transform = `translateX(${o.temp * 100}%)`;
    const sec = Math.floor(s.clock);
    ui.timer.textContent = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
    ui.peek.textContent = `Peek (${s.checksLeft()} left)`;
    ui.peek.disabled = !s.checksLeft() || peeking;
  }

  // ---------- finishing: a topping, then piping
  function renderFinish() {
    if (!s.st.topping) {
      ui.go = btn(s.current.label, finish, "bk-go"); ui.go.disabled = true;
      ui.timer = h("p", { class: "bk-left bk-timer", role: "timer" });
      body.replaceChildren(...head(),
        h("h3", { class: "bk-sub" }, "Which topping suits it?"),
        h("div", { class: "bk-toppings" }, ...s.toppingChoices().map(t =>
          h("button", { class: "bk-piece bk-tap", onclick: () => { s.chooseTopping(t.id); sfx.select(); render(); } }, h("i", { class: "bk-swatch", style: { background: t.colour } }), h("span", {}, t.name)))),
        ui.timer, live, ui.go);
      return timerUpdate();
    }
    ui.top = h("div", { class: "bk-top-cake bk-pipe", role: "application", "aria-label": "Cake top. Drag along the dotted pattern to pipe. Arrow keys move the nozzle, Space lifts it." });
    ui.nozzle = h("i", { class: "bk-nozzle" });
    ui.wrap = h("div", { class: "bk-pipe-wrap" }, ui.top, ui.nozzle);
    const at = e => { const r = ui.top.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
    ui.top.onpointerdown = e => { e.preventDefault(); ui.top.setPointerCapture?.(e.pointerId); piping = true; s.pipe(...at(e)); topUpdate(); };
    ui.top.onpointermove = e => { if (piping) { s.pipe(...at(e)); topUpdate(); } };
    ui.top.onpointerup = ui.top.onpointercancel = () => { piping = false; s.lift(); };
    ui.timer = h("p", { class: "bk-left bk-timer", role: "timer" });
    ui.go = btn(s.current.label, finish, "bk-go");
    const t = s.toppingChoices().find(x => x.id === s.st.topping);
    body.replaceChildren(...head(),
      h("p", { class: "bk-sub" }, `${t.name}. Trace the pattern in one careful go: there is no taking it back.`),
      ui.wrap, ui.timer, live, ui.go);
    topUpdate();
  }
  function topUpdate() {
    if (!ui.top) return;
    const t = s.toppingChoices().find(x => x.id === s.st.topping);
    ui.top.innerHTML = topSVG(s.spec.look, t, s.st.ink, s.pattern());
    ui.nozzle.style.left = `${nozzle[0] * 100}%`; ui.nozzle.style.top = `${nozzle[1] * 100}%`;
    ui.nozzle.classList.toggle('down', nozzleDown);
    ui.go.disabled = !s.canFinish();
    timerUpdate();
  }
  let lastLeft = null;
  function timerUpdate() {
    const left = s.decoTimeLeft();
    if (!ui.timer || left === lastLeft) return;
    lastLeft = left;
    ui.timer.textContent = left === null ? "" : `Time: ${left}s`;
    ui.timer.classList.toggle("urgent", left !== null && left <= 10);
  }

  // ---------- shared
  function finish() {
    if (!s.canFinish()) return;
    s.finishStage();
    render();
    if (!s.competition) live.textContent = s.feedback;
  }
  function renderHandoff() {
    const r = s.results[s.results.length - 1];
    body.replaceChildren(h("div", { class: "bk-top" }, hero()),
      h("div", { class: "bk-final" }, h("h3", {}, `${r.name} done`),
        h("p", { class: "small" }, "The judges will see the result. Find the next workstation to carry the same bake on."),
        btn("Continue", () => close(), "bk-go")));
  }
  function renderFinal() {
    const r = s.result(), fin = r.results.find(x => x.kind === 'finish'), oven = r.results.find(x => x.kind === 'oven');
    const t = fin && s.toppingChoices().find(x => x.id === fin.topping);
    // The Great Coburg Bake Off keeps your marks secret until the judges' cards.
    if (s.competition) {
      body.replaceChildren(h("div", { class: "bk-top" }, hero()),
        h("div", { class: "bk-final" }, h("h3", {}, "Bake complete"), bakeSideSVG(s.spec.look, { ...(oven || {}), topping: t?.colour }),
          h("p", {}, "Take it to the judges. They will tell you what they think."), btn("Finish", () => close(), "bk-go")));
      return;
    }
    const n = r.stars, per = s.spec.drink ? 1.5 : 1, cls = n >= 3 ? ' best' : n <= 1 ? ' wonky' : '';
    const pics = s.spec.drink
      ? h("div", { class: "bk-glass" + cls, role: "img", "aria-label": "A glass of lemonade" }, h("span", {}))
      : h("div", { class: "bk-show" + cls }, bakeSideSVG(s.spec.look, { ...(oven || {}), topping: t?.colour }),
        (() => { const d = h("div", { class: "bk-top-cake small", role: "img", "aria-label": "From above" }); d.innerHTML = topSVG(s.spec.look, t, fin?.ink, null); return d; })());
    body.replaceChildren(h("div", { class: "bk-final bk-celebrate" + cls },
      h("h3", {}, opts.name || 'Bake complete'), pics,
      h("p", { class: "bk-stars", "aria-label": `${n} out of 3 stars` }, starText(n)),
      h("p", {}, n >= 3 ? 'Perfect. Anyone would love this.' : n >= 2 ? 'Lovely work.' : n > 1 ? 'Rustic, but honest.' : 'Oh dear. Paddy will still say it is good.'),
      h("ul", { class: "bk-list" }, r.results.map(x => h("li", {}, h("b", {}, x.name), h("span", {}, `${Math.round(x.quality / 100 * per * 2) / 2} of ${per} ★`)))),
      btn("Done", () => close(), "bk-go")));
    if (n >= 2) sfx.trumpet(); else sfx.sad();
  }

  function onKey(e) {
    if (cleaned || !panel.isConnected || e.ctrlKey || e.metaKey || e.altKey || s.complete) return;
    const k = e.key;
    let used = true;
    if (s.juice && !s.juice.done) {
      if (k === 'j' || k === 'J') s.squeeze(true);
      else if (k === 'n' || k === 'N') { s.nextLemon(); render(); }
      else used = false;
    } else if (s.kind === 'mix') {
      if (/^[1-9]$/.test(k) && s.ingredients[+k - 1]) pouring = s.ingredients[+k - 1].id;
      else if (k === "m" || k === "M") ui.stir?.click();
      else used = false;
    } else if (s.kind === 'oven') {
      if (k === "ArrowUp" || k === "ArrowRight") heat(0.1);
      else if (k === "ArrowDown" || k === "ArrowLeft") heat(-0.1);
      else if (k === 'p' || k === 'P') ui.peek?.click();
      else used = false;
    } else if (s.kind === 'finish' && ui.top) {
      const d = { ArrowUp: [0, -.02], ArrowDown: [0, .02], ArrowLeft: [-.02, 0], ArrowRight: [.02, 0] }[k];
      if (d) { nozzle = nozzle.map((v, i) => Math.max(0, Math.min(1, v + d[i]))); if (nozzleDown) s.pipe(...nozzle); topUpdate(); }
      else if (k === ' ') { nozzleDown = !nozzleDown; if (nozzleDown) s.pipe(...nozzle); else s.lift(); topUpdate(); e.stopPropagation(); }
      else used = false;
    } else used = false;
    if (used) e.preventDefault();
  }
  function onKeyUp(e) {
    if (/^[1-9]$/.test(e.key) && pouring === s.ingredients?.[+e.key - 1]?.id) pouring = null;
    if (e.key === 'j' || e.key === 'J') s.squeeze(false);
  }
  document.addEventListener("keydown", onKey, true);
  document.addEventListener("keyup", onKeyUp);

  function frame(t) {
    if (cleaned) return;
    const dt = last ? Math.min(0.1, (t - last) / 1000) : 0;
    last = t;
    // Nothing runs on behind the handoff card between workstations.
    if (!document.hidden && !(single && s.stage > startStage)) {
      const before = s.stage;
      if (pouring && s.kind === 'mix') pour(pouring, POUR_RATE[s.competition ? "competition" : "practice"] * dt);
      s.tick(dt);
      const juicing = s.juice && !s.juice.done;
      // A new round, or the last lemon squeezed: draw the next screen.
      if (s.stage !== before || (ui.press && !juicing)) render();
      else if (juicing) juiceUpdate();
      else if (s.kind === 'mix') mixUpdate();
      else if (s.kind === 'oven') ovenUpdate();
      else if (s.kind === 'finish') timerUpdate();
    } else last = 0;
    raf = requestAnimationFrame(frame);
  }

  render();
  raf = requestAnimationFrame(frame);
  return {
    // The A button finishes the round when it can (never mid-squeeze).
    action: () => { if (!(s.juice && !s.juice.done)) finish(); },
    cleanup() {
      if (cleaned) return;
      cleaned = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("keyup", onKeyUp);
      const ok = s.complete || (single && s.stage > startStage);
      opts.done?.(ok ? s.result() : null);
    },
  };
}
