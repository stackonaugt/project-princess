import { h } from "./dom.js";
import {
  BakingSession,
  BAKE_STAGES,
  INGREDIENTS,
  MIX_METHODS,
  DECO_TYPES,
  DECO_PIECES,
  POUR_MAX,
  bakeColour,
} from "../systems/baking.js";
import { heroIcon } from "./images.js";
import { state } from "../systems/state.js";

export function openBaking(panel, close, opts = {}) {
  const s = opts.session instanceof BakingSession ? opts.session : new BakingSession();
  const single = !!opts.singleStage;
  const startStage = s.stage;
  let raf = 0,
    last = 0,
    cleaned = false,
    ui = {},
    selDeco = DECO_TYPES[0].id,
    shownStage = -1;
  const body = h("div", { class: "m-scroll bk" });
  const live = h("p", { class: "bk-live", role: "status", "aria-live": "polite" });
  const dots = h("div", { class: "bk-dots", "aria-hidden": "true" });
  panel.replaceChildren(
    h(
      "div",
      { class: "m-head" },
      h("h2", {}, `${opts.name || "Bake-off"}: workbench`),
      h("button", { class: "wood-btn small bk-tap", onclick: () => close() }, "Cancel"),
    ),
    body,
  );

  const hero = () =>
    h("img", {
      class: "pix bk-hero",
      src: heroIcon(state?.data?.hero || "helen"),
      alt: "",
      width: 32,
      height: 64,
    });
  const btn = (label, fn, cls = "", aria) =>
    h("button", { class: `wood-btn bk-tap ${cls}`, onclick: fn, "aria-label": aria }, label);

  function head() {
    dots.replaceChildren(
      ...BAKE_STAGES.map((d, i) =>
        h("span", { class: `bk-dot${i < s.stage ? " done" : i === s.stage ? " on" : ""}` }, d.name),
      ),
    );
    return [
      h("div", { class: "bk-top" }, hero(), dots),
      h("p", { class: "bk-help" }, s.current.instruction),
    ];
  }

  function render() {
    shownStage = s.stage;
    ui = {};
    if (s.complete) return renderFinal();
    if (single && s.stage > startStage) return renderHandoff();
    if (s.stage === 0) renderMix();
    else if (s.stage === 1) renderOven();
    else renderDeco();
  }

  // ---------- activity 1
  function renderMix() {
    const rows = INGREDIENTS.map((ing, i) => {
      const fill = h("span", { class: "bk-fill" });
      const line = h("span", { class: "bk-line", style: { bottom: `${(ing.target / POUR_MAX) * 100}%` } });
      const cup = h("div", { class: "bk-cup", role: "img", "aria-label": `${ing.name} cup` }, fill, line);
      ui["f" + ing.id] = fill;
      return h(
        "div",
        { class: `bk-row ${ing.dry ? "dry" : "wet"}` },
        cup,
        h("div", { class: "bk-name" }, h("b", {}, ing.name), h("small", {}, ing.dry ? "Dry" : "Wet", ` - key ${i + 1}`)),
        btn("-", () => pour(ing.id, -1), "bk-step", `Remove ${ing.name}`),
        btn("+", () => pour(ing.id, 1), "bk-step", `Add ${ing.name}`),
      );
    });
    ui.batter = h("div", { class: "bk-batter" });
    ui.bowl = h("div", { class: "bk-bowl", role: "img", "aria-label": "Mixing bowl" }, ui.batter);
    ui.mixState = h("p", { class: "bk-mixstate" });
    ui.methods = MIX_METHODS.map((m) =>
      h(
        "button",
        {
          class: "bk-method bk-tap",
          "aria-pressed": "false",
          onclick: () => {
            s.setMethod(m.id);
            mixUpdate();
          },
        },
        m.id === "fold" ? "Fold: gentle" : "Whisk: quick, risks toughness",
      ),
    );
    ui.stir = btn("Stir (M)", () => {
      s.stroke();
      ui.bowl.classList.remove("stir");
      void ui.bowl.offsetWidth;
      ui.bowl.classList.add("stir");
      mixUpdate();
    }, "bk-stir");
    ui.go = btn(s.current.label, finish, "bk-go");
    body.replaceChildren(
      ...head(),
      h("div", { class: "bk-grid" }, h("div", { class: "bk-cups" }, rows), h("div", { class: "bk-mixer" }, ui.bowl, ui.mixState, h("div", { class: "bk-methods" }, ui.methods), ui.stir)),
      live,
      ui.go,
    );
    mixUpdate();
    INGREDIENTS.forEach((i) => cupUpdate(i.id));
  }
  function pour(id, d) {
    s.pour(id, d);
    cupUpdate(id);
    mixUpdate();
  }
  function cupUpdate(id) {
    if (ui["f" + id]) ui["f" + id].style.height = `${((s.st.amounts[id] || 0) / POUR_MAX) * 100}%`;
  }
  const MIXTXT = {
    dry: "Nothing is mixed yet.",
    lumpy: "Lumpy. Keep going.",
    glossy: "Glossy and ready.",
    tight: "Tight and tough. Too much.",
  };
  function mixUpdate() {
    if (s.stage !== 0 || !ui.batter) return;
    const poured = INGREDIENTS.reduce((a, i) => a + (s.st.amounts[i.id] || 0), 0);
    const sm = s.smoothness();
    ui.batter.style.height = `${Math.min(80, 10 + poured * 2.4)}%`;
    ui.batter.style.setProperty("--smooth", sm);
    ui.batter.style.setProperty("--lumps", Math.round((1 - sm) * 100) + "%");
    ui.batter.dataset.mix = s.mixState();
    ui.mixState.textContent = MIXTXT[s.mixState()];
    ui.methods.forEach((el, i) => el.setAttribute("aria-pressed", String(MIX_METHODS[i].id === s.st.method)));
    ui.go.disabled = !s.canFinish();
  }

  // ---------- activity 2
  function renderOven() {
    ui.cake = h("div", { class: "bk-cake" });
    ui.tin = h("div", { class: "bk-tin" }, ui.cake);
    ui.glass = h("div", { class: "bk-oven-glass", role: "img", "aria-label": "Oven window showing the cake" }, ui.tin);
    ui.glow = h("div", { class: "bk-oven-glow" });
    ui.heat = h("div", { class: "bk-heatfill" });
    ui.temp = h("div", { class: "bk-tempmark" });
    ui.range = h("div", { class: "bk-heat", role: "meter", "aria-label": "Oven heat" }, ui.heat, ui.temp);
    ui.go = btn(s.current.label, finish, "bk-go");
    body.replaceChildren(
      ...head(),
      h("div", { class: "bk-oven" }, h("div", { class: "bk-oven-body" }, ui.glow, ui.glass), h("div", { class: "bk-dial" }, h("small", {}, "Dial (arrow keys)"), btn("Hotter", () => heat(0.1), "bk-big", "Turn heat up"), ui.range, btn("Cooler", () => heat(-0.1), "bk-big", "Turn heat down"))),
      live,
      ui.go,
    );
    ovenUpdate();
  }
  function heat(d) {
    s.nudgeHeat(d);
    ovenUpdate();
  }
  let lastCue = "";
  function ovenUpdate() {
    if (s.stage !== 1 || !ui.cake) return;
    const o = s.st;
    ui.cake.style.transform = `scale(${0.96 + 0.04 * o.rise}, ${0.25 + 0.75 * o.rise})`;
    ui.cake.style.background = bakeColour(o.brown);
    ui.cake.classList.toggle("cracked", o.crack > 0.15);
    ui.glow.style.opacity = String(0.15 + o.temp * 0.85);
    ui.heat.style.transform = `scaleX(${o.heat})`;
    ui.temp.style.transform = `translateX(${o.temp * 100}%)`;
    const cue = s.ovenCue();
    if (cue !== lastCue) {
      lastCue = cue;
      live.textContent = cue;
    }
  }

  // ---------- activity 3
  function renderDeco() {
    const slots = Array.from({ length: 9 }, (_, i) => {
      const pos =
        i === 8
          ? { left: "50%", top: "50%" }
          : { left: `${50 + 38 * Math.cos((i * Math.PI) / 4 - Math.PI / 2)}%`, top: `${50 + 38 * Math.sin((i * Math.PI) / 4 - Math.PI / 2)}%` };
      // ring slot 0 is the top; slot geometry is only used visually
      const el = h("button", { class: "bk-slot", style: pos, onclick: () => placeAt(i) });
      return el;
    });
    ui.slots = slots;
    ui.tray = DECO_TYPES.map((t, i) =>
      h("button", { class: "bk-piece bk-tap", "aria-pressed": "false", onclick: () => { selDeco = t.id; decoUpdate(); } }, h("i", { class: `bk-deco ${t.id}` }), h("span", {}, t.name), h("small", {}, `key ${i + 1}`)),
    );
    ui.left = h("p", { class: "bk-left" });
    ui.go = btn(s.current.label, finish, "bk-go");
    body.replaceChildren(
      ...head(),
      h("div", { class: "bk-deco-wrap" }, h("div", { class: "bk-top-cake", role: "group", "aria-label": "Cake top, tap a spot to place or lift a topping" }, slots), h("div", { class: "bk-tray" }, ui.tray, ui.left)),
      live,
      ui.go,
    );
    decoUpdate();
  }
  function placeAt(i) {
    s.place(i, selDeco);
    decoUpdate();
  }
  function decoUpdate() {
    if (s.stage !== 2 || !ui.slots) return;
    ui.slots.forEach((el, i) => {
      const t = s.st.slots[i];
      el.replaceChildren(t ? h("i", { class: `bk-deco ${t}` }) : "");
      el.classList.toggle("filled", !!t);
      el.setAttribute(
        "aria-label",
        `${i === 8 ? "Centre" : "Ring spot " + (i + 1)}: ${t ? DECO_TYPES.find((x) => x.id === t).name + ", tap to lift" : "empty"}`,
      );
    });
    ui.tray.forEach((el, i) => el.setAttribute("aria-pressed", String(DECO_TYPES[i].id === selDeco)));
    const left = DECO_PIECES - s.piecesPlaced();
    ui.left.textContent = left ? `${left} toppings left to place.` : "All placed. Lift any to rearrange.";
    ui.go.disabled = !s.canFinish();
  }

  // ---------- shared
  function finish() {
    if (!s.canFinish()) return;
    s.finishStage();
    render();
    live.textContent = s.feedback;
  }
  function renderHandoff() {
    const r = s.results[s.results.length - 1];
    body.replaceChildren(
      h("div", { class: "bk-top" }, hero()),
      h("div", { class: "bk-final" }, h("h3", {}, `${r.name} done`), h("p", {}, s.feedback), h("p", { class: "small" }, "Find the next workstation to carry the same bake on."), btn("Continue", () => close(), "bk-go")),
    );
  }
  function verdict(q) {
    return q >= 85 ? "Showstopper" : q >= 60 ? "Proud work" : q >= 35 ? "Rustic" : "Brave attempt";
  }
  function renderFinal() {
    const r = s.result();
    body.replaceChildren(
      h("div", { class: "bk-top" }, hero()),
      h(
        "div",
        { class: "bk-final" },
        h("h3", {}, "Bake complete"),
        h("p", { class: "bk-big-q" }, `${r.quality} / 100`),
        h("p", {}, verdict(r.quality)),
        h("ul", { class: "bk-list" }, r.results.map((x) => h("li", {}, h("b", {}, x.name), h("span", {}, `${x.quality}`, " - ", verdict(x.quality))))),
        btn("Finish preparation", () => close(), "bk-go"),
      ),
    );
  }

  function onKey(e) {
    if (cleaned || !panel.isConnected || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    let used = true;
    if (s.stage === 0 && !s.complete) {
      if (/^[1-5]$/.test(k)) pour(INGREDIENTS[+k - 1].id, 1);
      else if (k === "Backspace") {
        const o = s.st.order;
        if (o.length) pour(o[o.length - 1], -1);
      } else if (k === "m" || k === "M") ui.stir?.click();
      else used = false;
    } else if (s.stage === 1 && !s.complete) {
      if (k === "ArrowUp" || k === "ArrowRight") heat(0.1);
      else if (k === "ArrowDown" || k === "ArrowLeft") heat(-0.1);
      else used = false;
    } else if (s.stage === 2 && !s.complete) {
      if (/^[1-3]$/.test(k)) {
        selDeco = DECO_TYPES[+k - 1].id;
        decoUpdate();
      } else used = false;
    } else used = false;
    if (used) e.preventDefault();
  }
  document.addEventListener("keydown", onKey);

  function frame(t) {
    if (cleaned) return;
    const dt = last ? Math.min(0.1, (t - last) / 1000) : 0;
    last = t;
    if (!document.hidden) {
      const before = s.stage;
      s.tick(dt);
      if (s.stage !== before) render();
      else if (s.stage === 1) ovenUpdate();
    } else last = 0;
    raf = requestAnimationFrame(frame);
  }

  render();
  raf = requestAnimationFrame(frame);
  return {
    action: finish,
    cleanup() {
      if (cleaned) return;
      cleaned = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      const ok = s.complete || (single && s.stage > startStage);
      opts.done?.(ok ? s.result() : null);
    },
  };
}
