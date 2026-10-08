import { SHOW_DOGS } from "../../data/dog-show.js";
export const SHOW_DOG_ART = Object.fromEntries(
  Object.entries(SHOW_DOGS).map(([id, d]) => [
    `show-${id}`,
    [
      24,
      24,
      (p, frame = 0) => {
        const short = id === "biscuit",
          slim = id === "cleo",
          y = short ? 11 : 8,
          h = slim ? 5 : 8;
        p.r(d.coat, 5, y, 14, h);
        p.r(d.mark, 8, y + h - 2, 9, 2);
        p.r(d.coat, 16, y - 4, 6, 7);
        p.r(d.mark, 19, y - 1, 4, 3);
        if (d.ears === "point") {
          p.r(d.coat, 16, y - 8, 2, 5);
          p.r(d.coat, 20, y - 7, 2, 4);
        } else p.r(d.coat, 15, y - 3, 3, 6);
        p.px("#151c21", 20, y - 2);
        p.px("#29231e", 23, y);
        p.r("#aa5c54", 20, y + 3, 2, 1);
        const stride = [0, 1, 0, -1][frame % 4];
        p.r(d.coat, 6 + stride, y + h, 3, short ? 3 : 6);
        p.r(d.mark, 15 - stride, y + h, 3, short ? 3 : 6);
        p.r(d.coat, 2, y - 2, 4, 3);
        p.px(d.mark, 3, y - 3);
        if (id === "moss" || id === "bear") p.r(d.mark, 17, y - 3, 2, 5);
        if (id === "pepper") {
          p.r(d.mark, 19, y + 2, 4, 2);
          p.r(d.mark, 17, y - 3, 2, 1);
        }
        if (id === "waffles") p.r(d.mark, 4, y + 2, 3, 5);
      },
    ],
  ]),
);
