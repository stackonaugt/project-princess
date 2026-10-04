// The eleven pet types and how they match up in battle.
//
//   strong  this type's attacks do DOUBLE damage to these types
//   resist  this type's attacks do HALF damage to these types
//
// Rock is weak only to Fairy and Leather; Ghost is weak only to Fairy.

export const TYPES = {
  rock:    { name: 'Rock',    colour: '#9a7a4c', blurb: 'Solid. Dense. Mostly dense.',                 strong: ['fairy', 'smelly', 'old', 'fire'],  resist: ['steel', 'leather'] },
  fairy:   { name: 'Fairy',   colour: '#e77fb8', blurb: 'Sass, sparkle and surprising violence.',      strong: ['rock', 'ghost', 'street'],         resist: ['steel', 'fire'] },
  fire:    { name: 'Fire',    colour: '#e0602a', blurb: 'Hot under the collar. Hot everywhere else too.', strong: ['plastic', 'leather', 'old'],     resist: ['rock', 'fire'] },
  street:  { name: 'Street',  colour: '#d0802e', blurb: 'Raised on milk crates and nerve.',             strong: ['psychic', 'plastic'],              resist: ['steel', 'rock'] },
  ghost:   { name: 'Ghost',   colour: '#5b4a8c', blurb: 'Here one minute, behind you the next.',       strong: ['psychic', 'old'],                  resist: ['street'] },
  psychic: { name: 'Psychic', colour: '#a24fc9', blurb: 'Knows what you did. Is disappointed.',        strong: ['street', 'smelly'],                resist: ['steel', 'psychic'] },
  smelly:  { name: 'Smelly',  colour: '#7a8a3a', blurb: 'You smell it before you see it.',             strong: ['psychic', 'fairy', 'leather'],     resist: ['plastic', 'steel'] },
  old:     { name: 'Old',     colour: '#8a7a6a', blurb: 'Has seen it all. Was not impressed.',         strong: ['street', 'plastic'],               resist: ['rock', 'steel'] },
  plastic: { name: 'Plastic', colour: '#4ab8c8', blurb: 'Lightweight, flexible, will outlive us all.', strong: ['smelly', 'steel'],                 resist: ['fire', 'plastic'] },
  steel:   { name: 'Steel',   colour: '#7a8698', blurb: 'Cold, hard and hard to bend.',                strong: ['fire', 'leather'],                 resist: ['steel', 'rock'] },
  leather: { name: 'Leather', colour: '#8a4a2a', blurb: 'Tough, worn in, smells faintly of shoes.',    strong: ['rock', 'steel'],                   resist: ['fire', 'ghost'] },
};

// Damage multiplier when an attack of type `atk` hits a pet of type `def`.
export function effectiveness(atk, def) {
  const t = TYPES[atk];
  if (!t || !def) return 1;
  if (t.strong.includes(def)) return 2;
  if (t.resist.includes(def)) return 0.5;
  return 1;
}

// Types that hit `def` for double damage (for the Petdex).
export const weaknessesOf = def => Object.keys(TYPES).filter(a => TYPES[a].strong.includes(def));
