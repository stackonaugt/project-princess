import { h } from "./dom.js";
import { BakingSession } from "../systems/baking.js";
import { heroIcon } from "./images.js";
import { state } from "../systems/state.js";
export function openBaking(panel, close, opts) {
  const s = new BakingSession();
  let raf = 0,
    last = 0,
    cleaned = false;
  const help = h("p", {}),
    feedback = h("p", { role: "status", "aria-live": "polite" }),
    marker = h("span", { class: "bake-marker" }),
    band = h("span", { class: "bake-band" });
  const action = h("button", { class: "wood-btn", onclick: act });
  panel.replaceChildren(
    h(
      "div",
      { class: "m-head" },
      h("h2", {}, `${opts.name}: bake preparation`),
      h("button", { class: "wood-btn small", onclick: close }, "Cancel"),
    ),
    h(
      "div",
      { class: "m-scroll baking-board" },
      h("img", {
        class: "pix",
        src: heroIcon(state.data.hero || "helen"),
        alt: "Your character at the oven",
        width: 64,
        height: 128,
      }),
      help,
      h(
        "div",
        { class: "bake-track", "aria-label": "Green timing zone" },
        band,
        marker,
      ),
      feedback,
      action,
    ),
  );
  function render() {
    feedback.textContent = s.feedback;
    if (s.complete) {
      help.textContent = `${s.score}/3 clean stages. These points will help your entry.`;
      action.textContent = "Finish preparation";
      return;
    }
    const d = s.current;
    help.textContent = `${s.stage + 1}/3: ${d.name}. ${d.instruction}`;
    action.textContent = d.label;
    band.style.left = `${(d.target - d.width / 2) * 100}%`;
    band.style.width = `${d.width * 100}%`;
    marker.style.left = `${s.value * 100}%`;
  }
  function act() {
    if (s.complete) return close();
    s.action();
    render();
  }
  function tick(t) {
    if (cleaned) return;
    const dt = last ? Math.min(0.1, (t - last) / 1000) : 0;
    last = t;
    if (!document.hidden) s.tick(dt);
    render();
    raf = requestAnimationFrame(tick);
  }
  render();
  raf = requestAnimationFrame(tick);
  return {
    action: act,
    cleanup() {
      if (cleaned) return;
      cleaned = true;
      cancelAnimationFrame(raf);
      opts.done?.(s.complete ? s.result() : null);
    },
  };
}
