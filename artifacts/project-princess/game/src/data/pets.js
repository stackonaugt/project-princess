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
import { authoredValue } from '../authoring/overrides.js';
import { TUNING } from './tuning.js';

export let PETS = [
  {
    id: 'princess', name: 'Princess', species: 'Toy poodle', type: 'fairy', sprite: 'poodle',
    pal: { a: '#f4f0ea', b: '#d8d0c8', w: '#ffffff', c: '#6a3a28', p: '#f07cc0', n: '#5a3028', e: '#2a1a10' },
    owner: 'Helen and Paddy', region: 'laverton', zone: 'allen', home: [20, 12], range: 3,
    homeSpot: { zone: 'home', x: 19, y: 15 },
    behaviour: 'patrol', patrol: [[17, 9], [24, 10], [25, 14], [20, 16], [15, 14]],
    sleeps: [22 * 60, 26 * 60],
    loves: ['ribbon', 'chicken', 'strawberry'], likes: ['cheese', 'croissant', 'chilli'], dislikes: ['lemon', 'tennis', 'zucchini'],
    stats: { hp: 66, attack: 84, defence: 52, speed: 80, special: 100 },
    evolution: {
      name: 'Queencess', species: 'Royal toy poodle', type: 'fairy', level: 14, hearts: 5, sprite: 'poodle',
      pal: { a: '#fff7ed', b: '#e0d6cb', w: '#ffffff', c: '#866443', p: '#a079b8', n: '#5a3028', e: '#2a1a10' },
      bio: 'Princess has become Queencess. A tiny crown, an enormous sense of authority, and the same beloved poodle beneath it.',
      stats: { hp: 82, attack: 98, defence: 62, speed: 92, special: 116 },
      moves: ['crownclaw', 'queensdecree', 'royalrest', 'royalwave'],
    },
  },
  {
    id: 'salami', name: 'Salami', species: 'Tabby cat', type: 'street', sprite: 'tabby',
    pal: { a: '#8a6a42', s: '#3a2a18', c: '#c88a4a', w: '#e8d8b8', e: '#8ab83a', p: '#d89a9a' },
    owner: 'Rose', region: 'brunswick', zone: 'donald', home: [11, 7], range: 3,
    homeSpot: { zone: 'home', x: 18, y: 3 },
    behaviour: 'stalk', sleeps: [13 * 60, 15 * 60],
    loves: ['redfin', 'sardine', 'feather'], likes: ['snag', 'chicken', 'cheese', 'tomato'], dislikes: ['carrot', 'lemon', 'basil'],
    stats: { hp: 60, attack: 88, defence: 50, speed: 85, special: 60 },
    evolution: {
      name: 'Sopressa', species: 'Tabby cat (aged, like a fine salami)', type: ['street', 'old'], level: 15, hearts: 5, sprite: 'sopressa',
      pal: { a: '#7a5e3c', s: '#3a2a18', c: '#c8a070', w: '#e8d8b8', g: '#c8c8c0', f: '#4a5a3a', e: '#8ab83a', p: '#d89a9a' },
      stats: { hp: 78, attack: 104, defence: 68, speed: 80, special: 78 },
      moves: ['agedclaws', 'grumble', 'cured', 'backinmyday'],
    },
  },
  {
    id: 'spooky', name: 'Spooky', species: 'Bunny', type: 'ghost', sprite: 'bunny',
    pal: { a: '#2e2836', b: '#1c1622', w: '#4a405a', e: '#9fe8ff', p: '#9a78b0' },
    owner: 'Slinks', region: 'brunswick', zone: 'sydney', home: [10, 13], range: 2.5,
    homeSpot: { zone: 'home', x: 4, y: 6 },
    behaviour: 'phase', sleeps: [9 * 60, 12 * 60],
    loves: ['carrot', 'lemon', 'basil'], likes: ['feather', 'croissant', 'strawberry', 'zucchini'], dislikes: ['snag', 'chicken', 'chilli'],
    stats: { hp: 50, attack: 55, defence: 60, speed: 95, special: 90 },
    evolution: {
      name: 'Ghost', species: 'Large white bunny', type: 'ghost', level: 15, hearts: 5, sprite: 'bunny',
      pal: { a: '#ffffff', b: '#dce9ed', w: '#f4ffff', e: '#68c6dd', p: '#d7adc9', g: '#9fe8ff', x: '#e8f8ff' },
      bio: 'Spooky becomes Ghost, a large white bunny with gentle blue eyes. She can step through shadows, vanish, and send spectral waves through the room.',
      stats: { hp: 88, attack: 72, defence: 80, speed: 98, special: 112 },
      moves: ['ghosthop', 'ghostbeam', 'flicker', 'hauntedcarrot'],
    },
  },
  {
    id: 'poppy', name: 'Poppy', species: 'French bulldog', type: 'rock', sprite: 'frenchie',
    pal: { a: '#26252a', b: '#141418', w: '#f0ece4', g: '#7a7670', p: '#a87878', e: '#7a5030', n: '#0a0a0a', l: '#3a3940' },
    owner: 'Seb and Sinead', region: 'reservoir', zone: 'loddon', home: [18, 10], range: 3,
    homeSpot: { zone: 'yard', x: 25, y: 12 },
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
    id: 'rusty', name: 'Rusty', species: 'Whippet', type: 'speed', sprite: 'whippet',
    pal: { a: '#c07a3a', b: '#9a5a26', k: '#7a4a22', w: '#f0e8dc', e: '#1a1010', n: '#1a1010' },
    owner: 'Nathan', region: 'reservoir', zone: 'track', home: [30, 22], range: 4,
    homeSpot: { zone: 'home', x: 13, y: 15 },
    behaviour: 'zoomies', sleeps: [20 * 60, 26 * 60],
    loves: ['chicken', 'redfin', 'cheese'], likes: ['snag', 'sardine', 'tennis', 'carrot'], dislikes: ['lemon', 'chilli'],
    stats: { hp: 66, attack: 78, defence: 50, speed: 115, special: 48 },
    evolution: {
      name: 'Steely', species: 'Whippet (forged steel)', type: 'steel', level: 16, hearts: 5, sprite: 'evenrustier',
      pal: { a: '#9aa2ac', b: '#6a727c', k: '#b8642a', w: '#e8eef4', r: '#4a4e56', o: '#c87a3a', e: '#e83a2a', n: '#1a1010' },
      stats: { hp: 86, attack: 108, defence: 82, speed: 130, special: 56 },
      moves: ['dangerpaws', 'sharpen', 'turbozoom', 'oilchange'],
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
    evolution: {
      name: 'Centurionely', species: 'Mini schnauzer (Roman centurion)', type: 'steel', level: 16, hearts: 5, sprite: 'centurionely',
      pal: { a: '#55585f', l: '#9a9ea6', w: '#e8e6e0', d: '#3a3c42', h: '#b8bec8', r: '#c8302a', c: '#a8202a', m: '#8a929e', g: '#c89a3a', e: '#2a1a10', n: '#1a1a1a' },
      stats: { hp: 82, attack: 88, defence: 108, speed: 58, special: 100 },
      moves: ['pilum', 'testudo', 'venividivici', 'staredown'],
    },
  },
  {
    id: 'girlie', name: 'Girlie', species: 'Black labrador', type: ['water', 'park'], sprite: 'lab',
    pal: { a: '#26252a', b: '#141418', l: '#3a3940', e: '#6a4a2a', n: '#0a0a0a', p: '#e8708a' },
    owner: 'Dell', region: 'carlton', zone: 'gardens', home: [12, 23], range: 3,
    homeSpot: { zone: 'yard', x: 23, y: 9 },
    behaviour: 'wander', sleeps: [14 * 60, 16 * 60],
    loves: ['chicken', 'jamdonut', 'hotchips', 'tennis'], likes: ['snag', 'cheese', 'sardine', 'croissant', 'carrot', 'pumpkin', 'potato', 'gelato', 'prosciutto', 'redfin'], dislikes: ['lemon'],
    stats: { hp: 82, attack: 76, defence: 66, speed: 62, special: 55 },
    evolution: {
      // Art: assets/sprites/pets/girlie-evolved.png (Girlie's sheet, splattered with mud).
      name: 'Muddy', species: 'Black labrador (mostly mud)', type: ['dirt', 'water'], level: 16, hearts: 5, sprite: 'lab',
      pal: { a: '#4a3624', b: '#2e2216', l: '#6e5232' },
      stats: { hp: 106, attack: 96, defence: 88, speed: 64, special: 70 },
      moves: ['muddypaws', 'puddlejump', 'shakeoff', 'dirtnap'],
    },
  },
  {
    id: 'chloe', name: 'Chloe', species: 'Kelpie', type: ['park', 'speed'], sprite: 'kelpie',
    pal: { a: '#1e1a1c', t: '#b87a3a', w: '#e8dcc8', e: '#c8a040', n: '#1a1010' },
    owner: 'Adam and Chelsea', region: 'brunswickeast', zone: 'holmes', home: [12, 7], range: 3,
    homeSpot: { zone: 'yard', x: 7, y: 8 },
    behaviour: 'patrol', patrol: [[12, 9], [13, 9], [13, 5], [11, 2], [13, 5], [13, 9]],
    sleeps: [21 * 60, 26 * 60],
    loves: ['prosciutto', 'chicken', 'tennis'], likes: ['cheese', 'snag', 'sardine', 'egg'], dislikes: ['lemon', 'basil', 'kombucha'],
    stats: { hp: 68, attack: 82, defence: 58, speed: 104, special: 60 },
  },
  {
    // Ziggy was Mads's cat. Nobody owns him now: win a play-fight with him
    // and he comes home with you (challenge: true).
    id: 'ziggy', name: 'Ziggy', species: 'Black and white cat', type: ['speed', 'street'], sprite: 'kitten',
    pal: { a: '#1a1a1e', w: '#f4f4f0', e: '#c8e040', n: '#1a1010' },
    owner: 'Mads', region: 'carlton', zone: 'nicholson', home: [4, 6], range: 2, challenge: true,
    homeSpot: { zone: 'home', x: 6, y: 6 },
    behaviour: 'wander', sleeps: [12 * 60, 14 * 60],
    loves: ['sardine', 'chicken', 'cheese'], likes: ['redfin', 'prosciutto', 'snag'], dislikes: ['lemon', 'chilli'],
    stats: { hp: 58, attack: 74, defence: 52, speed: 120, special: 64 },
  },
  {
    // Emilio only turns up if you fish Edwardes Lake with bread (see goFishing).
    id: 'emilio', name: 'Emilio', species: 'Big old duck (top hat)', type: 'water', sprite: 'emilio',
    pal: { a: '#2a6a3a', l: '#8a6a4a', w: '#e8dcc0', o: '#e8a030', h: '#1e1e22', b: '#c8302a', e: '#1a1010' },
    owner: 'Nobody (Edwardes Lake)', region: 'reservoir', zone: 'secret', home: [20, 20], range: 2,
    homeSpot: { zone: 'yard', x: 20, y: 14 },
    behaviour: 'wander', sleeps: [21 * 60, 26 * 60],
    loves: ['bread', 'redfin', 'tomato'], likes: ['carrot', 'zucchini', 'strawberry'], dislikes: ['chilli', 'lemon'],
    stats: { hp: 90, attack: 62, defence: 80, speed: 44, special: 76 },
  },
  {
    id: 'marty', name: 'Marty', species: 'Cavoodle', type: 'smelly', sprite: 'cavoodle',
    pal: { a: '#655c52', b: '#403d3b', c: '#8d867d', e: '#171616', n: '#24201d', h: '#cf7335' },
    owner: 'Trish and Gordon', region: 'laverton', zone: 'woods', home: [20, 11], range: 1.5,
    homeSpot: { zone: 'yard', x: 18, y: 8 }, behaviour: 'wander', sleeps: [19 * 60, 26 * 60],
    loves: ['chicken', 'cheese', 'snag'], likes: ['egg', 'sardine', 'tennis'], dislikes: ['lemon', 'chilli'],
    stats: { hp: 72, attack: 64, defence: 58, speed: 52, special: 60 },
    bio: 'Trish and Gordon’s brown-grey cavoodle. Soft curls, orange harness, spectacularly questionable perfume.',
    clue: 'Trish and Gordon can introduce you on Woods St during the day.',
    funFact: 'Gordon is the source of all the best human food.', favouriteSpot: 'Beside Gordon on the couch.',
    lines: { 0: ['Marty sniffs your shoes, then leans against your leg.', 'His orange harness is clean. The rest of him is debatable.'] },
    night: ['Marty is ready for a couch nap.'], rain: ['Wet cavoodle. The smell has somehow become stronger.'], asleep: ['Marty snores into his curls.'],
  },
];


// What pets say, and their Petdex text, live in dialogue.js.
// Stats and evolution thresholds from the tuning sheet (data/tuning.js).
for (const p of PETS) {
  const t = TUNING.pets[p.id];
  if (!t) continue;
  if (t.stats) p.stats = { ...p.stats, ...t.stats };
  if (t.evolution && p.evolution) for (const k of ['level', 'hearts']) if (Number.isFinite(t.evolution[k])) p.evolution[k] = t.evolution[k];
  if (t.evolution?.stats && p.evolution) p.evolution.stats = { ...p.evolution.stats, ...t.evolution.stats };
}
PETS = authoredValue('data/pets.js', 'PETS', PETS);
for (const p of PETS) {
  const t = PET_TEXT[p.id] || {};
  for (const k of ['bio', 'clue', 'funFact', 'favouriteSpot', 'lines', 'night', 'rain', 'asleep']) if (t[k] !== undefined) p[k] = t[k];
  if (p.evolution && t.evolvedBio && !p.evolution.bio) p.evolution.bio = t.evolvedBio;
}

export const PET_BY_ID = Object.fromEntries(PETS.map(p => [p.id, p]));
