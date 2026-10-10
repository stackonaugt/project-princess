// Fictional competitors, not new story characters or collectible pets.
export const SHOW_DOGS = {
  biscuit: {
    name: "Biscuit",
    breed: "Corgi",
    coat: "#c99852",
    mark: "#f5e7ce",
    size: 15,
    ears: "point",
    type: "street",
  },
  pepper: {
    name: "Pepper",
    breed: "Miniature schnauzer",
    coat: "#737984",
    mark: "#ddd5c4",
    size: 16,
    ears: "point",
    type: "steel",
  },
  cleo: {
    name: "Cleo",
    breed: "Whippet",
    coat: "#c3a282",
    mark: "#eee4cf",
    size: 16,
    ears: "fold",
    type: "street",
  },
  waffles: {
    name: "Waffles",
    breed: "Golden retriever",
    coat: "#ceac63",
    mark: "#e6cb8b",
    size: 20,
    ears: "drop",
    type: "fairy",
  },
  moss: {
    name: "Moss",
    breed: "Border collie",
    coat: "#303b39",
    mark: "#f1eadb",
    size: 18,
    ears: "point",
    type: "psychic",
  },
  bear: {
    name: "Bear",
    breed: "Bernese mountain dog",
    coat: "#333437",
    mark: "#e2b280",
    size: 23,
    ears: "drop",
    type: "leather",
  },
};
const looks = [
  ["#603928", "#64a6a0", "#b88054"],
  ["#28262b", "#bb6851", "#d7a17d"],
  ["#e0bd77", "#4c648e", "#f2c5a1"],
  ["#493229", "#a577a0", "#b17a5c"],
  ["#313532", "#d49b4c", "#d8b28d"],
  ["#30262b", "#6f8a5b", "#ac7654"],
];
export const COMPETITORS = [
  {
    id: "showmira",
    name: "Mira",
    dog: "biscuit",
    intro:
      "Biscuit has little legs and absolutely no sense of proportion. We train in short bursts. He thinks every cone is a trophy.",
    tip: "Let your dog reach the hurdle before asking for a jump.",
  },
  {
    id: "showrafi",
    name: "Rafi",
    dog: "pepper",
    intro:
      "Pepper used to bark at the tunnel. We started with one step, then two. Now I have to persuade him to come out.",
    tip: "Give one clear cue. Repeating a cue louder is usually just noise.",
  },
  {
    id: "showjo",
    name: "Jo",
    dog: "cleo",
    intro:
      "Cleo could sprint this in ten seconds. Convincing her to stay still for two seconds took six weeks.",
    tip: "The stay mat is about patience. Wait for the release.",
  },
  {
    id: "showedie",
    name: "Edie",
    dog: "waffles",
    intro:
      "Waffles loves everybody. Our main obstacle is the audience, especially anyone holding a sandwich.",
    tip: "Walk at a steady pace. There is no prize for confusing your dog quickly.",
  },
  {
    id: "showtheo",
    name: "Theo",
    dog: "moss",
    intro:
      "Moss memorised the course yesterday. Today they have moved the poles. He has lodged a formal complaint.",
    tip: "Watch the station, not yesterday’s route. Championship layouts change.",
  },
  {
    id: "showsana",
    name: "Sana",
    dog: "bear",
    intro:
      "Bear is huge but very gentle. I started with broad turns and low hurdles. Confidence comes before speed.",
    tip: "A clean, calm run beats rushing. You can recover from a missed cue.",
  },
];
export const SHOW_NPCS = Object.fromEntries(
  COMPETITORS.map((c, i) => [
    c.id,
    {
      name: c.name,
      role: "Dog show competitor",
      lines: [[c.intro]],
      look: {
        hair: looks[i][0],
        shirt: looks[i][1],
        skin: looks[i][2],
        pants: "#343b45",
        hairStyle: i % 2 ? "short" : "long",
      },
    },
  ]),
);
export const SHOW_JUDGES = [
  { id: 'showalma', name: 'Alma', praise: 'Precise, clear cues. Beautiful work.', good: 'A good run with a few details to refine.', advice: 'Get your dog into position before asking for the movement.' },
  { id: 'showian', name: 'Ian', praise: 'You stayed together as a team.', good: 'Your handling is becoming confident.', advice: 'Slow down on the turns. Keep your dog close rather than pulling ahead.' },
  { id: 'shownoor', name: 'Noor', praise: 'Calm and composed, even with an audience.', good: 'You recovered well and finished positively.', advice: 'Take a breath, hold the stay, and give one clear release.' },
];
for (const [i, judge] of SHOW_JUDGES.entries()) SHOW_NPCS[judge.id] = {
  name: judge.name, role: 'Exhibition judge', lines: [[judge.advice]],
  look: { hair: ['#b7aba0', '#3e3430', '#29252c'][i], shirt: '#435c70', pants: '#343b45', skin: looks[i][2], hairStyle: 'short' },
};
for (let i = 0; i < 6; i++) SHOW_NPCS[`showguest${i}`] = {
  name: ['Pat', 'Alex', 'Ren', 'Kim', 'Lou', 'Ari'][i], role: 'Show spectator',
  lines: [[['That tunnel run was lovely. I was cheering from the first jump.', 'I came for the dogs. I am staying for the very serious judges.', 'The little dogs have such enormous confidence.'][i % 3]]],
  look: { hair: looks[i][0], shirt: looks[i][1], skin: looks[i][2], pants: '#343b45', hairStyle: i % 2 ? 'short' : 'long' },
};
SHOW_NPCS.showjean = {
  name: "Jean",
  role: "Show steward",
  lines: [
    [
      "Welcome to the Exhibition. Everybody starts somewhere. Even the very confident dogs.",
    ],
  ],
  look: {
    hair: "#a7a3a0",
    hairStyle: "pixie",
    skin: "#edc8a1",
    shirt: "#46687c",
    pants: "#35333d",
    glasses: true,
  },
};
export const DIVISIONS = [
  {
    id: "novice",
    name: "Neighbourhood novice",
    rivals: ["showmira", "showrafi"],
    obedience: "recall",
    level: 5,
    reward: 30,
    description:
      "A gentle first show: recall, a short course and two friendly play-fights.",
  },
  {
    id: "open",
    name: "City circuit",
    rivals: ["showjo", "showedie"],
    obedience: "settle",
    level: 9,
    reward: 55,
    description:
      "Longer turns, weave poles and the challenge of settling with an audience.",
  },
  {
    id: "champion",
    name: "Exhibition championship",
    rivals: ["showtheo", "showsana"],
    obedience: "lead",
    level: 13,
    reward: 100,
    description:
      "A championship course, loose-lead teamwork and the final two rivals.",
  },
];
export const SHOW_ENEMIES = Object.fromEntries(
  Object.entries(SHOW_DOGS).map(([id, d]) => [
    `show-${id}`,
    {
      name: d.name,
      type: d.type,
      stats: {
        hp: 52,
        attack: 48,
        defence: 48,
        speed: id === "cleo" ? 70 : 48,
        special: 48,
      },
      moves: ["bite", "growl"],
      leave: "settles down beside their person.",
      faces: "right",
    },
  ]),
);
