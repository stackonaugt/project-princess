import { h } from "./dom.js";
import { SKILLS, skill } from "../systems/player-skills.js";
import { state } from "../systems/state.js";
import { HEROES } from "../data/heroes.js";
export function openSkills(panel, close) {
  panel.replaceChildren(
    h(
      "div",
      { class: "m-head" },
      h("h2", {}, `${HEROES[state.data.hero || "helen"].name}'s skills`),
      h("button", { class: "wood-btn small", onclick: close }, "Close"),
    ),
    h(
      "div",
      { class: "m-scroll" },
      h(
        "p",
        {},
        "Learn by doing. Each character keeps their own skills. Maximum level: 10.",
      ),
      ...Object.entries(SKILLS).map(([id, d]) => {
        const p = skill(id);
        return h(
          "div",
          { class: "note" },
          h("h4", {}, `${d.name} · Level ${p.level}`),
          h("progress", {
            max: 1,
            value: p.fraction,
            "aria-label": `${d.name} progress`,
          }),
          h(
            "p",
            { class: "small" },
            p.level === 10
              ? "Mastered"
              : `${p.current} / ${p.needed} XP to the next level`,
          ),
          h("p", {}, d.source),
          h("p", { class: "small" }, d.perk),
        );
      }),
    ),
  );
}
