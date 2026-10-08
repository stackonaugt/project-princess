// The sixteen pet types and how they match up in battle.
//
//   strong  this type's attacks do DOUBLE damage to these types
//   resist  this type's attacks do HALF damage to these types
//
// Rock was too strong (it hit four types hard and almost nothing hurt it), so
// it lost Fire from its strong list, and Water and Park now hit it hard too.
// Ghost is weak only to Fairy.

export const TYPES = {
  rock:    { name: 'Rock',    colour: '#9a7a4c', blurb: 'Solid. Dense. Mostly dense.',                 strong: ['fairy', 'smelly', 'old'],          resist: ['steel', 'leather'] },
  fairy:   { name: 'Fairy',   colour: '#e77fb8', blurb: 'Sass, sparkle and surprising violence.',      strong: ['rock', 'ghost', 'street'],         resist: ['steel', 'fire'] },
  fire:    { name: 'Fire',    colour: '#e0602a', blurb: 'Hot under the collar. Hot everywhere else too.', strong: ['plastic', 'leather', 'park'],    resist: ['rock', 'fire', 'water'] },
  street:  { name: 'Street',  colour: '#d0802e', blurb: 'Raised on milk crates and nerve.',             strong: ['psychic', 'plastic'],              resist: ['steel', 'rock'] },
  ghost:   { name: 'Ghost',   colour: '#5b4a8c', blurb: 'Here one minute, behind you the next.',       strong: ['psychic', 'old'],                  resist: ['street'] },
  psychic: { name: 'Psychic', colour: '#a24fc9', blurb: 'Knows what you did. Is disappointed.',        strong: ['street', 'smelly'],                resist: ['steel', 'psychic'] },
  smelly:  { name: 'Stinky',  colour: '#7a8a3a', blurb: 'You smell it before you see it.',             strong: ['psychic', 'fairy', 'leather'],     resist: ['plastic', 'steel'] },
  old:     { name: 'Old',     colour: '#8a7a6a', blurb: 'Has seen it all. Was not impressed.',         strong: ['street', 'plastic'],               resist: ['rock', 'steel'] },
  plastic: { name: 'Plastic', colour: '#4ab8c8', blurb: 'Lightweight, flexible, will outlive us all.', strong: ['smelly', 'steel', 'water'],        resist: ['fire', 'plastic'] },
  steel:   { name: 'Steel',   colour: '#7a8698', blurb: 'Cold, hard and hard to bend.',                strong: ['fire', 'leather'],                 resist: ['steel', 'rock'] },
  leather: { name: 'Leather', colour: '#8a4a2a', blurb: 'Tough, worn in, smells faintly of shoes.',    strong: ['rock', 'steel', 'speed'],          resist: ['fire', 'ghost'] },
  water:   { name: 'Water',   colour: '#3a8ad8', blurb: 'Puddles, sprinklers and the Merri Creek.',    strong: ['fire', 'rock', 'caffeine'],        resist: ['water', 'park', 'plastic'] },
  park:    { name: 'Park',    colour: '#5aa83a', blurb: 'Gum nuts, magpies and wet grass.',            strong: ['water', 'rock', 'booze'],          resist: ['fire', 'plastic', 'park', 'steel'] },
  caffeine:{ name: 'Caffeine',colour: '#8a5a32', blurb: 'Fast, jittery, and talks too much.',          strong: ['old', 'psychic', 'booze'],         resist: ['caffeine', 'steel'] },
  speed:   { name: 'Speed',   colour: '#e8b030', blurb: 'Gone before you finished the sentence.',     strong: ['old', 'rock', 'plastic'],          resist: ['speed', 'caffeine'] },
  booze:   { name: 'Booze',   colour: '#c89a2a', blurb: 'Loud, brave and wobbly. Sorry tomorrow.',     strong: ['street', 'psychic', 'fairy'],      resist: ['old', 'booze', 'rock'] },
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
