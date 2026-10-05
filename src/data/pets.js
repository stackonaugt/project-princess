// ============================================================
//  THE PETS. Edit freely! This is the heart of the game.
// ============================================================
//
//  id         unique, lowercase. Also the filename for custom art:
//             assets/sprites/pets/<id>.png and assets/sprites/portraits/<id>.png
//  sprite     which built-in pixel sprite to use (see src/art/sprites.js)
//  pal        colour overrides for the built-in sprite
//  region     suburb: 'laverton' | 'brunswick' | 'reservoir' (Petdex grouping)
//  zone       the area it lives in before you find it (see data/regions.js)
//  home       [x, y] tile in that zone it hangs around; range = how far it wanders
//  homeSpot   where it hangs out at your place once found: { zone: 'home' | 'yard', x, y }
//  behaviour  'wander' | 'patrol' | 'phase' | 'zoomies' | 'stalk' | 'aloof'
//  sleeps     [from, to] in minutes after midnight (26*60 = 2am), or null
//  loves / likes / dislikes   item ids from src/data/items.js
//  stats      battle stats (moves are in src/data/moves.js, PET_MOVES)
//  evolution  optional new form: { name, species, type (one or two), level, hearts, stats, moves, sprite, pal, bio }
//             The pet evolves once it reaches `level` AND your friendship reaches `hearts`.
//  Words (bio, clue, fun fact, lines by hearts, night / rain / asleep) are in dialogue.js.

import { PET_TEXT } from './dialogue.js';

export const PETS = [
  {
    id: 'princess', name: 'Princess', species: 'Toy poodle', type: 'fairy', sprite: 'poodle',
    pal: { a: '#f4f0ea', b: '#d8d0c8', w: '#ffffff', c: '#6a3a28', p: '#f07cc0', n: '#5a3028', e: '#2a1a10' },
    owner: 'Helen and Paddy', region: 'laverton', zone: 'allen', home: [20, 12], range: 3,
    homeSpot: { zone: 'home', x: 19, y: 15 },
    behaviour: 'patrol', patrol: [[17, 9], [24, 10], [25, 14], [20, 16], [15, 14]],
    sleeps: [22 * 60, 26 * 60],
    loves: ['ribbon', 'chicken', 'strawberry'], likes: ['cheese', 'croissant', 'chilli'], dislikes: ['lemon', 'tennis', 'zucchini'],
    stats: { hp: 55, attack: 72, defence: 45, speed: 80, special: 95 },
    evolution: {
      name: 'Flamcess', species: 'Toy poodle (on fire)', type: 'fire', level: 14, hearts: 5, sprite: 'flamcess',
      pal: { a: '#ffe0b0', b: '#f0b070', w: '#fff0a0', c: '#c8501a', p: '#e83a2a', y: '#ffd030', o: '#f08020', r: '#d8301a', n: '#5a2010', e: '#2a1a10' },
      stats: { hp: 70, attack: 88, defence: 55, speed: 92, special: 112 },
      moves: ['blazeclaws', 'hotbite', 'scorchbed', 'pompom'],
    },
  },
  {
    id: 'salami', name: 'Salami', species: 'Tabby cat', type: 'street', sprite: 'tabby',
    pal: { a: '#8a6a42', s: '#3a2a18', c: '#c88a4a', w: '#e8d8b8', e: '#8ab83a', p: '#d89a9a' },
    owner: 'Rose', region: 'brunswick', zone: 'donald', home: [11, 7], range: 3,
    homeSpot: { zone: 'home', x: 18, y: 3 },
    behaviour: 'stalk', sleeps: [13 * 60, 15 * 60],
    loves: ['sardine', 'feather'], likes: ['snag', 'chicken', 'cheese', 'tomato'], dislikes: ['carrot', 'lemon', 'basil'],
    stats: { hp: 60, attack: 88, defence: 50, speed: 85, special: 60 },
  },
  {
    id: 'spooky', name: 'Spooky', species: 'Bunny', type: 'ghost', sprite: 'bunny',
    pal: { a: '#2e2836', b: '#1c1622', w: '#4a405a', e: '#9fe8ff', p: '#9a78b0' },
    owner: 'Slinks', region: 'brunswick', zone: 'sydney', home: [10, 13], range: 2.5,
    homeSpot: { zone: 'home', x: 2, y: 6 },
    behaviour: 'phase', sleeps: [9 * 60, 12 * 60],
    loves: ['carrot', 'lemon', 'basil'], likes: ['feather', 'croissant', 'strawberry', 'zucchini'], dislikes: ['snag', 'chicken', 'chilli'],
    stats: { hp: 50, attack: 55, defence: 60, speed: 95, special: 90 },
  },
  {
    id: 'poppy', name: 'Poppy', species: 'French bulldog', type: 'rock', sprite: 'frenchie',
    pal: { a: '#26252a', b: '#141418', w: '#f0ece4', g: '#7a7670', p: '#a87878', e: '#7a5030', n: '#0a0a0a', l: '#3a3940' },
    owner: 'Seb and Sinead', region: 'reservoir', zone: 'loddon', home: [18, 10], range: 3,
    homeSpot: { zone: 'yard', x: 25, y: 9 },
    behaviour: 'zoomies', sleeps: [21 * 60, 26 * 60],
    loves: ['tennis', 'snag', 'pumpkin', 'potato'], likes: ['chicken', 'cheese', 'croissant', 'sardine', 'carrot', 'lemon', 'zucchini', 'tomato', 'strawberry'], dislikes: [],
    stats: { hp: 85, attack: 80, defence: 80, speed: 50, special: 20 },
    evolution: {
      name: 'Floppy', species: 'French bulldog (squeaky)', type: ['plastic', 'rock'], level: 16, hearts: 5, sprite: 'floppy',
      pal: { a: '#6a5ab0', b: '#483a88', w: '#f0ece4', g: '#b0a8e0', p: '#f07ab0', e: '#1a1010', n: '#1a1010', l: '#8a7ad0', h: '#ffffff', k: '#9a9aa4' },
      stats: { hp: 105, attack: 98, defence: 110, speed: 52, special: 35 },
      moves: ['flopslam', 'squeak', 'bubblewrap', 'chew'],
    },
  },
  {
    id: 'stanley', name: 'Stanley', species: 'Mini schnauzer', type: 'psychic', sprite: 'schnauzer',
    pal: { a: '#55585f', l: '#9a9ea6', w: '#e8e6e0', d: '#3a3c42', e: '#2a1a10', n: '#1a1a1a' },
    owner: 'Tim and Nicholas', region: 'reservoir', zone: 'glasgow', home: [25, 8], range: 2.5,
    homeSpot: { zone: 'home', x: 12, y: 16 },
    behaviour: 'aloof', sleeps: [23 * 60, 26 * 60],
    loves: ['cheese', 'croissant'], likes: ['chicken', 'sardine', 'basil', 'pumpkin'], dislikes: ['tennis', 'lemon', 'chilli'],
    stats: { hp: 60, attack: 50, defence: 70, speed: 55, special: 98 },
  },
];


// What pets say, and their Petdex text, live in dialogue.js.
for (const p of PETS) {
  const t = PET_TEXT[p.id] || {};
  for (const k of ['bio', 'clue', 'funFact', 'favouriteSpot', 'lines', 'night', 'rain', 'asleep']) if (t[k] !== undefined) p[k] = t[k];
  if (p.evolution && t.evolvedBio) p.evolution.bio = t.evolvedBio;
}

export const PET_BY_ID = Object.fromEntries(PETS.map(p => [p.id, p]));
