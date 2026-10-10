import { state } from "./state.js";
import { DIVISIONS, COMPETITORS } from "../data/dog-show.js";
import { trainingStarted } from "./progression-gates.js";
export const showUnlocked = () => trainingStarted(state.data);
export function divisionProgress(id) {
  const sh = state.data.side.show;
  sh.divisions[id] ??= { battles: [], course: 0, obedience: 0 };
  return sh.divisions[id];
}
export function divisionDone(id) {
  const p = divisionProgress(id);
  return (p.battles?.length || 0) >= 2 && p.course > 0 && p.obedience >= 2;
}
export function showReady(pet) {
  const skills = state.data.side.school.skills[pet] || {},
    values = Object.values(skills).map((x) => Math.max(0, Number(x) || 0));
  return (
    values.reduce((a, b) => a + b, 0) >= 6 &&
    values.filter((x) => x > 0).length >= 2 &&
    state.data.side.show.practice >= 2
  );
}
export function showObjectives() {
  if (!showUnlocked()) return [];
  const sh = state.data.side.show;
  const objectives = [
    {
      text: "Find a course: build the yard kit or visit the Exhibition practice ring",
      done:
        state.count("coursekit") > 0 ||
        state.data.visited.includes("exhibition"),
    },
    {
      text: "Finish two qualifying course practices in the yard or Exhibition",
      done: sh.practice >= 2,
    },
    {
      text: "Train a dog: six clean school runs across at least two activities",
      done: state
        .visiblePets()
        .some(
          (p) =>
            state.isFound(p.id) &&
            !/cat|bunny|duck|rabbit/i.test(p.species) &&
            showReady(p.id),
        ),
    },
    {
      text: "Register your dog with Jean inside the Royal Exhibition Building",
      done: sh.entered,
    },
    ...DIVISIONS.flatMap(d => {
      const p = sh.divisions[d.id] || { battles: [], course: 0, obedience: 0 };
      return [
        ...d.rivals.map(id => ({
          text: `${d.name}: friendly play-fight with ${COMPETITORS.find(c => c.id === id).name}`,
          done: sh.claimed.includes(d.id) || p.battles.includes(id),
        })),
        { text: `${d.name}: demonstrate agility in the hall`, done: sh.claimed.includes(d.id) || p.course > 0 },
        { text: `${d.name}: demonstrate ${d.obedience}`, done: sh.claimed.includes(d.id) || p.obedience >= 2 },
        { text: `${d.name}: collect your award from Jean`, done: sh.claimed.includes(d.id) },
      ];
    }),
    {
      text: "Collect the champion rosette from Jean",
      done: sh.claimed.includes("champion"),
    },
  ];
  return [objectives.find(objective => !objective.done) ||
    { text: 'Exhibition champion! Your award is recorded.', done: true }];
}
