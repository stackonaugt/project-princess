import { MapBuilder } from "../MapBuilder.js";
import { COMPETITORS, SHOW_JUDGES } from "../../data/dog-show.js";
export function buildExhibition() {
  const b = new MapBuilder({
    id: "exhibition",
    w: 40,
    h: 30,
    fill: "W",
    seed: 1880,
  });
  b.fill(1, 2, 38, 27, "U");
  b.fill(8, 7, 24, 15, "L");
  b.noDress = true;
  // A wide centre aisle, competition ring and spectator benches.
  b.fill(18, 22, 4, 7, "h");
  b.set(19, 29, "D");
  b.set(20, 29, "D");
  b.put("counter", 18, 4, { v: "kettle", interact: "showdesk" });
  b.put('counter', 30, 4, { interact: 'showgroom', v: 'plain' });
  b.sign(30, 5, ['Grooming and breed presentation ring. Every dog can enter; brush gently and handle calmly.']);
  b.npc("showjean", 21, 5, { face: "down", leave: true });
  SHOW_JUDGES.forEach((judge, i) => b.npc(judge.id, 11 + i * 8, 5, { face: 'down', still: true }));
  for (let i = 0; i < 6; i++) b.npc(`showguest${i}`, i < 3 ? 5 : 35, 10 + i % 3 * 5, { face: i < 3 ? 'right' : 'left', still: true });
  b.sign(17, 5, [
    "Exhibition Dog Show.",
    "Register with Jean. Each division has two friendly battles, agility and obedience. Progress saves after every event.",
  ]);
  for (const x of [3, 33]) for (const y of [8, 13, 18]) b.put("bench", x, y);
  for (const x of [8, 14, 26, 31]) b.put("ropebarrier", x, 6);
  b.put("flagstand", 5, 3, { v: "aus" });
  b.put("flagstand", 34, 3, { v: "aboriginal" });
  b.put("tallplant", 2, 3);
  b.put("tallplant", 36, 3);
  b.put("sign", 11, 24, { interact: "course" });
  const positions = [
    [5, 23],
    [9, 25],
    [14, 25],
    [26, 25],
    [30, 25],
    [34, 23],
  ];
  COMPETITORS.forEach((c, i) => {
    const [x, y] = positions[i];
    b.npc(c.id, x, y, { face: "up", leave: true });
    b.decor.push({ kind: "showdog", id: c.dog, x: x + 1, y: y - 1 });
  });
  b.exit(19, 29, 2, 1, "gardens", "exhibition", "Carlton Gardens");
  b.entry("door", 19, 27, "up");
  return b.finish();
}
