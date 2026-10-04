// Pet types. Colours are used for Petdex badges.
// strong/weak are NOT used yet: they are the planned battle matchups (see CLAUDE.md).

export const TYPES = {
  fairy:   { name: 'Fairy',   colour: '#e77fb8', blurb: 'Sass, sparkle and surprising violence.',  strong: ['street', 'rock'],  weak: ['ghost', 'psychic'] },
  street:  { name: 'Street',  colour: '#d0802e', blurb: 'Raised on milk crates and nerve.',          strong: ['psychic', 'fairy'], weak: ['rock'] },
  ghost:   { name: 'Ghost',   colour: '#5b4a8c', blurb: 'Here one minute, behind you the next.',    strong: ['fairy', 'psychic'], weak: ['street'] },
  rock:    { name: 'Rock',    colour: '#9a7a4c', blurb: 'Solid. Dense. Mostly dense.',              strong: ['street', 'ghost'],  weak: ['fairy', 'psychic'] },
  psychic: { name: 'Psychic', colour: '#a24fc9', blurb: 'Knows what you did. Is disappointed.',     strong: ['rock', 'fairy'],   weak: ['street', 'ghost'] },
};
