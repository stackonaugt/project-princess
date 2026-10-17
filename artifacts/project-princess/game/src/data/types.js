// The pet types and how they match up in battle.
//
//   strong  this type's attacks do DOUBLE damage to these types
//   resist  this type's attacks do HALF damage to these types
//
// Rock was too strong (it hit four types hard and almost nothing hurt it), so
// it lost Fire from its strong list, and Water and Park now hit it hard too.
// Steel was too hard to hurt: only five types bounce off it now, and Water
// rusts it. Fairy shrugs off Ghost, Street, Old and Dark. The id 'leather'
// shows as Tough (kept so old saves and move data still line up), like
// 'smelly' shows as Stinky. Hack is a political hack. Solidarity is waiting
// for Bongo.

export const TYPES = {
  rock:    { name: 'Rock',    colour: '#9a7a4c', blurb: 'Solid. Dense. Mostly dense.',                 strong: ['fairy', 'smelly', 'old'],          resist: ['steel', 'leather'] },
  fairy:   { name: 'Fairy',   colour: '#e77fb8', blurb: 'Sass, sparkle and surprising violence.',      strong: ['rock', 'ghost', 'street', 'dark'], resist: ['steel', 'fire'] },
  fire:    { name: 'Fire',    colour: '#e0602a', blurb: 'Hot under the collar. Hot everywhere else too.', strong: ['plastic', 'leather', 'park', 'bug'], resist: ['rock', 'fire', 'water'] },
  street:  { name: 'Street',  colour: '#d0802e', blurb: 'Raised on milk crates and nerve.',             strong: ['psychic', 'plastic', 'bird'],      resist: ['steel', 'rock', 'fairy'] },
  ghost:   { name: 'Ghost',   colour: '#5b4a8c', blurb: 'Here one minute, behind you the next.',       strong: ['psychic', 'old'],                  resist: ['street', 'fairy'] },
  psychic: { name: 'Psychic', colour: '#a24fc9', blurb: 'Knows what you did. Is disappointed.',        strong: ['street', 'smelly', 'solidarity'],  resist: ['psychic'] },
  smelly:  { name: 'Stinky',  colour: '#7a8a3a', blurb: 'You smell it before you see it.',             strong: ['psychic', 'fairy', 'leather', 'food'], resist: ['plastic', 'steel'] },
  old:     { name: 'Old',     colour: '#8a7a6a', blurb: 'Has seen it all. Was not impressed.',         strong: ['street', 'plastic', 'hack'],       resist: ['rock', 'fairy'] },
  plastic: { name: 'Plastic', colour: '#4ab8c8', blurb: 'Lightweight, flexible, will outlive us all.', strong: ['smelly', 'steel', 'water'],        resist: ['fire', 'plastic'] },
  steel:   { name: 'Steel',   colour: '#7a8698', blurb: 'Cold, hard and hard to bend.',                strong: ['fire', 'leather'],                 resist: ['steel', 'rock'] },
  leather: { name: 'Tough',   colour: '#8a4a2a', blurb: 'Thick skinned, worn in, hard to rattle.',     strong: ['rock', 'steel', 'speed'],          resist: ['fire', 'ghost'] },
  water:   { name: 'Water',   colour: '#3a8ad8', blurb: 'Puddles, sprinklers and the Merri Creek.',    strong: ['fire', 'rock', 'caffeine', 'dirt', 'steel'], resist: ['water', 'park', 'plastic'] },
  park:    { name: 'Park',    colour: '#5aa83a', blurb: 'Gum nuts, magpies and wet grass.',            strong: ['water', 'rock', 'booze'],          resist: ['fire', 'plastic', 'park', 'steel'] },
  caffeine:{ name: 'Caffeine',colour: '#8a5a32', blurb: 'Fast, jittery, and talks too much.',          strong: ['old', 'psychic', 'booze'],         resist: ['caffeine'] },
  speed:   { name: 'Speed',   colour: '#e8b030', blurb: 'Gone before you finished the sentence.',     strong: ['old', 'rock', 'plastic'],          resist: ['speed', 'caffeine'] },
  dirt:    { name: 'Dirt',    colour: '#8a6236', blurb: 'Mud, puddles and the back paddock.',          strong: ['fire', 'steel', 'smelly', 'electric'], resist: ['park', 'plastic'] },
  booze:   { name: 'Booze',   colour: '#c89a2a', blurb: 'Loud, brave and wobbly. Sorry tomorrow.',     strong: ['street', 'psychic', 'fairy', 'solidarity'], resist: ['old', 'booze', 'rock'] },
  electric:{ name: 'Electric',colour: '#d8c018', blurb: 'Trams, e-scooters and myki readers.',         strong: ['water', 'bird', 'dark'],           resist: ['dirt', 'electric', 'park'] },
  bug:     { name: 'Bug',     colour: '#8fae2c', blurb: 'Mozzies, huntsmen and the odd cockroach.',    strong: ['park', 'food', 'hack'],            resist: ['fire', 'bird', 'dark'] },
  bird:    { name: 'Bird',    colour: '#6aa6cc', blurb: 'Magpies, bin chickens and seagulls.',         strong: ['bug', 'park', 'food'],             resist: ['rock', 'electric'] },
  hack:    { name: 'Hack',    colour: '#2a9a70', blurb: 'Talking points, polling and a fresh announceable.', strong: ['steel', 'psychic', 'plastic'], resist: ['old', 'hack'] },
  dark:    { name: 'Dark',    colour: '#3b2f52', blurb: 'Possums, back lanes and Benjy\'s at 2am.',   strong: ['ghost', 'psychic'],                resist: ['fairy', 'dark', 'street'] },
  food:    { name: 'Food',    colour: '#e0884a', blurb: 'Toasties, pies and free garlic bread.',       strong: ['speed', 'booze', 'old'],           resist: ['smelly', 'bug', 'bird'] },
  solidarity:{ name: 'Solidarity', colour: '#d0304a', blurb: 'An injury to one is an injury to all.', strong: ['hack', 'dark'],                  resist: ['booze'] },
};

// A pet can have one type or two (e.g. Floppy is ['plastic', 'rock']).
export const typeList = t => (Array.isArray(t) ? t : [t]);
export const typeName = t => typeList(t).map(x => TYPES[x].name).join('/');

// Damage multiplier when an attack of type `atk` hits a pet of type(s) `def`.
// Dual types multiply: 2 x 2 = 4, 2 x 0.5 = 1.
export function effectiveness(atk, def) {
  const t = TYPES[atk];
  if (!t || !def) return 1;
  return typeList(def).reduce((m, d) => m * (t.strong.includes(d) ? 2 : t.resist.includes(d) ? 0.5 : 1), 1);
}

// Types that hit `def` for double damage or more (for the Petdex).
export const weaknessesOf = def => Object.keys(TYPES).filter(a => effectiveness(a, def) > 1);
// Types `atk` hits for double damage.
export const strengthsOf = atk => typeList(atk).flatMap(a => TYPES[a].strong).filter((t, i, l) => l.indexOf(t) === i);
