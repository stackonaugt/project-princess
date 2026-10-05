// Things you battle. Wild ones jump out of tall grass; trainers are
// townsfolk you challenge by talking to them.
//
//  ENEMIES   id -> { name, type, stats, moves, held?, drop?, appear }
//            stats use the same scale as pets (roughly 30 to 100)
//            held   a snack it carries; moves with usesHeld need it, and
//                   Poppy's Chew can wreck it
//            drop   [item id, chance] you might find after winning
//            appear the line when it shows up; leave = when it gives up
//            tall   drawn as a person (16x32) rather than an animal
//            art    built-in art in src/art/paint/enemies.js (texture foe-<id>)
//  ENCOUNTERS suburb -> list of { id, lv: [min, max], weight, night?, day?, zones? }
//            zones limits an entry to those zone ids (ducks only at the lake)
//  TRAINERS  npc id -> { team: [[enemy id or 'pet:<id>', level], ...], prize?, lines... }

import { PEOPLE, FOE_TEXT } from './dialogue.js';
import { NORTH_ENEMIES, NORTH_TRAINERS } from './north.js';

export const ENEMIES = {
  bag: {
    name: 'Plastic Bag', type: 'plastic', stats: { hp: 38, attack: 45, defence: 35, speed: 90, special: 50 },
    moves: ['flutter', 'suffocate', 'blowaway'], float: true, faces: 'front',
  },
  streetcat: {
    name: 'Street Cat', type: 'street', stats: { hp: 45, attack: 60, defence: 40, speed: 80, special: 45 },
    moves: ['hiss', 'pounce', 'scratch'], drop: ['sardine', 0.3],
  },
  dog: {
    name: 'Rival Dog', type: 'leather', stats: { hp: 55, attack: 60, defence: 55, speed: 60, special: 35 },
    moves: ['growlwild', 'tug', 'bite'], drop: ['tennis', 0.3],
  },
  rat: {
    name: 'Big Rat', type: 'smelly', stats: { hp: 45, attack: 55, defence: 45, speed: 70, special: 50 },
    moves: ['gnaw', 'plague', 'hide'], drop: ['cheese', 0.3],
  },
  boy: {
    name: 'Small Tubby Boy', tall: true, faces: 'left', type: 'street', stats: { hp: 55, attack: 50, defence: 50, speed: 40, special: 40 },
    moves: ['tantrum', 'pokestick', 'sausageroll'], held: 'sausage roll', drop: ['snag', 0.4],
  },
  balls: {
    faces: 'front',
    name: 'Pile of Tennis Balls', type: 'plastic', stats: { hp: 50, attack: 55, defence: 60, speed: 30, special: 40 },
    moves: ['bounceball', 'avalanche'], drop: ['tennis', 0.7],
  },
  commuter: {
    name: 'Angry Commuter', tall: true, faces: 'left', type: 'old', stats: { hp: 55, attack: 55, defence: 50, speed: 45, special: 60 },
    moves: ['sigh', 'briefcase', 'complain', 'flatwhite'], held: 'flat white', drop: ['croissant', 0.35],
  },
  ibis: {
    name: 'Bin Chicken', type: 'smelly', stats: { hp: 50, attack: 60, defence: 45, speed: 60, special: 50 },
    moves: ['binlid', 'plague', 'jab'], drop: ['chicken', 0.3],
  },
  scooter: {
    name: 'E-scooter', type: 'steel', stats: { hp: 50, attack: 65, defence: 60, speed: 85, special: 30 },
    moves: ['scoot2', 'beep', 'rolldown'],
  },
  duck: {
    name: 'Rogue Duck', type: 'water', stats: { hp: 45, attack: 60, defence: 45, speed: 65, special: 55 },
    moves: ['quack', 'jab', 'splash'], drop: ['croissant', 0.3],
  },
  magpie: {
    name: 'Swooping Magpie', type: ['park', 'old'], stats: { hp: 45, attack: 70, defence: 40, speed: 85, special: 50 },
    moves: ['swoop', 'jab', 'warble'], drop: ['feather', 0.5],
  },
  recycling: {
    faces: 'front',
    name: 'Recycling Bin', type: 'plastic', stats: { hp: 55, attack: 50, defence: 60, speed: 45, special: 55 },
    moves: ['lidslam', 'wrongbin', 'recycle', 'rolldown'],
  },
  garbage: {
    faces: 'front',
    name: 'Garbage Bin', type: 'smelly', stats: { hp: 60, attack: 60, defence: 55, speed: 35, special: 50 },
    moves: ['stench', 'flies', 'rolldown', 'lidslam'],
  },
  compost: {
    faces: 'front',
    name: 'Compost Bin', type: 'fire', stats: { hp: 50, attack: 50, defence: 50, speed: 50, special: 65 },
    moves: ['compost', 'rot', 'flies'],
  },
  // ---- Brunswick
  alleycat: {
    name: 'Alley Cat', type: 'street', stats: { hp: 48, attack: 66, defence: 42, speed: 84, special: 45 },
    moves: ['hiss', 'pounce', 'scratch'], drop: ['sardine', 0.3],
  },
  nonna: {
    name: 'Nonna', tall: true, faces: 'left', type: 'old', stats: { hp: 62, attack: 58, defence: 60, speed: 40, special: 66 },
    moves: ['woodenspoon', 'mangia', 'lemonthrow', 'guilttrip'], drop: ['lemon', 0.6],
  },
  cavoodle: {
    name: 'Designer Dog', type: 'fairy', stats: { hp: 46, attack: 50, defence: 50, speed: 75, special: 62 },
    moves: ['yapyap', 'fluffup', 'pose', 'tug'], drop: ['ribbon', 0.25],
  },
  ristretto: {
    faces: 'front',
    name: 'Ristretto', type: 'caffeine', stats: { hp: 45, attack: 66, defence: 45, speed: 85, special: 55 },
    moves: ['shot', 'jitters', 'latteart'],
  },
  sourdough: {
    faces: 'front',
    name: 'Sourdough Mother', type: 'smelly', stats: { hp: 62, attack: 55, defence: 60, speed: 35, special: 50 },
    moves: ['starter', 'prove', 'crust'],
  },
  recordplayer: {
    faces: 'front',
    name: 'Record Player', type: 'old', stats: { hp: 55, attack: 50, defence: 55, speed: 50, special: 68 },
    moves: ['bside', 'scratchvinyl', 'actually'],
  },
  flatwhitefoe: {
    faces: 'front',
    name: 'Flat White', type: 'caffeine', stats: { hp: 50, attack: 58, defence: 48, speed: 80, special: 55 },
    moves: ['doubleshot', 'milkfroth', 'extrashot'],
  },
  goonbag: {
    faces: 'front',
    name: 'Goon Bag', type: 'booze', stats: { hp: 60, attack: 52, defence: 55, speed: 40, special: 50 },
    moves: ['hiccup', 'slosh', 'silverpillow', 'beergoggles'],
  },
  // ---- Reservoir
  sprinkler: {
    faces: 'front',
    name: 'Rogue Sprinkler', type: 'water', stats: { hp: 52, attack: 55, defence: 55, speed: 55, special: 60 },
    moves: ['splash', 'hosedown', 'puddle', 'sprinkle'],
  },
  possum: {
    name: 'Brushtail Possum', type: 'park', stats: { hp: 55, attack: 62, defence: 48, speed: 72, special: 45 },
    moves: ['scurry', 'gumnut', 'hissp', 'rosebush'], drop: ['tomato', 0.3],
  },
  bulldog: {
    name: 'Bulldog Next Door', type: 'rock', stats: { hp: 70, attack: 62, defence: 68, speed: 30, special: 30 },
    moves: ['headbutt', 'slobber', 'snore'], drop: ['snag', 0.35],
  },
  golfball: {
    faces: 'front',
    name: 'Golf Ball', type: 'plastic', stats: { hp: 45, attack: 60, defence: 55, speed: 80, special: 40 },
    moves: ['fore', 'slice', 'bunker'],
  },
  fiveiron: {
    faces: 'front',
    name: 'Five Iron', type: 'steel', stats: { hp: 52, attack: 70, defence: 55, speed: 55, special: 40 },
    moves: ['swing', 'chip', 'practice'],
  },
  buggy: {
    faces: 'front',
    name: 'Golf Buggy', type: 'steel', stats: { hp: 66, attack: 62, defence: 66, speed: 35, special: 40 },
    moves: ['runover', 'beep', 'nineteenth'],
  },
  weed: {
    faces: 'front',
    name: 'Weed', type: 'smelly', stats: { hp: 50, attack: 45, defence: 50, speed: 40, special: 55 },
    moves: ['haze', 'paranoia'],
  },
  ice: {
    faces: 'front',
    name: 'Ice', type: 'street', stats: { hp: 55, attack: 65, defence: 40, speed: 90, special: 40 },
    moves: ['binge', 'comedown'],
  },
  fentanyl: {
    faces: 'front', ends: true,
    name: 'Fentanyl', type: 'old', stats: { hp: 1, attack: 1, defence: 1, speed: 1, special: 1 },
    moves: ['sigh'],
    endLines: [
      'He pulls out fentanyl and takes it.',
      'Within seconds he slumps over. His lips are going blue. He is barely breathing.',
      'This is not a play-fight any more. You call 000 straight away.',
      'The paramedics arrive fast and give him naloxone. He gasps and comes around.',
      'He is going to hospital. He is alive.',
    ],
  },
};

// Who you can meet in each suburb's tall grass. Weights are relative.
export const ENCOUNTERS = {
  laverton: [
    { id: 'bag', lv: [2, 4], weight: 3 },
    { id: 'streetcat', lv: [2, 4], weight: 3 },
    { id: 'dog', lv: [3, 5], weight: 2 },
    { id: 'rat', lv: [3, 5], weight: 2, night: 3 },
    { id: 'boy', lv: [2, 4], weight: 2, day: true },
    { id: 'balls', lv: [3, 5], weight: 1 },
    { id: 'commuter', lv: [4, 5], weight: 2, day: true },
  ],
  brunswick: [
    { id: 'ibis', lv: [5, 8], weight: 3 },
    { id: 'scooter', lv: [5, 8], weight: 3 },
    { id: 'rat', lv: [5, 8], weight: 2, night: 3 },
    { id: 'streetcat', lv: [5, 7], weight: 2 },
    { id: 'bag', lv: [5, 7], weight: 1 },
    { id: 'commuter', lv: [6, 8], weight: 1, day: true },
    { id: 'alleycat', lv: [5, 8], weight: 3 },
    { id: 'nonna', lv: [6, 9], weight: 2, day: true },
    { id: 'cavoodle', lv: [5, 8], weight: 2, day: true },
    { id: 'flatwhitefoe', lv: [5, 7], weight: 2, day: true },
    { id: 'goonbag', lv: [5, 7], weight: 2, night: 3 },
  ],
  reservoir: [
    { id: 'duck', lv: [7, 10], weight: 6, zones: ['track', 'lake', 'lakepark', 'wetlands'] },
    { id: 'bulldog', lv: [8, 11], weight: 10, zones: ['loddon'] },
    { id: 'magpie', lv: [8, 11], weight: 3, day: true },
    { id: 'dog', lv: [7, 10], weight: 2 },
    { id: 'balls', lv: [7, 10], weight: 1 },
    { id: 'boy', lv: [7, 9], weight: 1, day: true },
    { id: 'bag', lv: [7, 9], weight: 1 },
    { id: 'sprinkler', lv: [7, 10], weight: 2, day: true, zones: ['loddon', 'glasgow', 'lakepark', 'wetlands'] },
    { id: 'possum', lv: [8, 11], weight: 2, night: 4 },
  ],
  civic: [{ id: 'magpie', lv: [3, 5], weight: 3, day: true }, { id: 'sprinkler', lv: [3, 5], weight: 2, day: true }, { id: 'bag', lv: [2, 4], weight: 2 }, { id: 'rat', lv: [3, 5], weight: 2, night: 3 }],
  // The long walks between suburbs
  altona: [{ id: 'sprinkler', lv: [3, 5], weight: 1, day: true }, { id: 'bag', lv: [3, 5], weight: 3 }, { id: 'rat', lv: [3, 6], weight: 2 }, { id: 'dog', lv: [4, 6], weight: 2 }, { id: 'commuter', lv: [4, 6], weight: 1, day: true }],
  footscray: [{ id: 'goonbag', lv: [4, 6], weight: 1, night: 2 }, { id: 'rat', lv: [4, 6], weight: 2 }, { id: 'ibis', lv: [4, 7], weight: 3 }, { id: 'streetcat', lv: [4, 6], weight: 2 }, { id: 'boy', lv: [4, 6], weight: 1, day: true }],
  flemington: [{ id: 'ibis', lv: [5, 7], weight: 2 }, { id: 'scooter', lv: [5, 7], weight: 2 }, { id: 'magpie', lv: [5, 7], weight: 2, day: true }, { id: 'bag', lv: [5, 7], weight: 1 }],
  // Coburg and Preston (foes from data/north.js)
  coburg: [
    { id: 'flatwhitefoe', lv: [6, 9], weight: 1, day: true }, { id: 'scooter', lv: [6, 9], weight: 2 }, { id: 'nonna', lv: [7, 9], weight: 2, day: true },
    { id: 'alleycat', lv: [6, 9], weight: 2 }, { id: 'rat', lv: [6, 9], weight: 1 },
    { id: 'duck', lv: [7, 9], weight: 5, zones: ['coburglake'] }, { id: 'swan', lv: [8, 10], weight: 3, zones: ['coburglake'] },
    { id: 'myki', lv: [7, 9], weight: 2, zones: ['coburgmall'] }, { id: 'possum', lv: [7, 10], weight: 2, night: 3 },
  ],
  preston: [
    { id: 'possum', lv: [7, 10], weight: 2, night: 3 }, { id: 'nonna', lv: [7, 10], weight: 2, day: true }, { id: 'magpie', lv: [7, 10], weight: 2, day: true },
    { id: 'dog', lv: [7, 10], weight: 2 }, { id: 'cavoodle', lv: [7, 9], weight: 1 },
    { id: 'render', lv: [8, 10], weight: 5, zones: ['prestonmkt'] }, { id: 'trolley', lv: [8, 10], weight: 3, zones: ['prestonmkt', 'prestonhigh'] },
    { id: 'myki', lv: [8, 10], weight: 2, zones: ['prestonhigh'] },
  ],
};

// Trainers: talk to them to battle. `prize` is the pet you win (pets with
// an owner are won by beating the owner; Princess is free).
export const TRAINERS = {
  binman: {
    name: 'Bin Man', team: [['recycling', 3], ['garbage', 4], ['compost', 4]],
    
    reward: { snag: 2, chicken: 1 },
  },
  rose: {
    name: 'Rose', prize: 'salami', team: [['alleycat', 6], ['pet:salami', 8]],
    
  },
  slinks: {
    name: 'Slinks', prize: 'spooky', team: [['streetcat', 6], ['pet:spooky', 8]],
    
  },
  sinead: {
    name: 'Sinead', prize: 'poppy', team: [['pet:poppy', 12]],
    
  },
  nathan: {
    name: 'Nathan', prize: 'rusty', team: [['pet:rusty', 16]],
  },
  tim: {
    name: 'Tim', prize: 'stanley', team: [['magpie', 12], ['pet:stanley', 14]],
    
  },
  hipster: {
    name: 'Hipster', team: [['ristretto', 9], ['sourdough', 9], ['recordplayer', 10]],
    
    reward: { croissant: 1 }, money: 40,
  },
  golfer: {
    name: 'Golfer Next Door', team: [['golfball', 11], ['fiveiron', 12], ['buggy', 12]],
    
    reward: { snag: 1 }, money: 50,
  },
  stranger: {
    name: 'Stranger', once: true, noXp: true, intro: 'He squares up, swaying on his feet.', team: [['weed', 8], ['ice', 9], ['fentanyl', 9]], sendOut: 'He pulls out {f}.',
    challenge: ['He is pacing and talking fast. "You. Yeah, you. You wanna go?"', 'He is not well. He wants to fight anyway.'],
    ask: 'Battle him?', yes: 'Okay', no: 'Walk on',
    win: ['Fentanyl is so strong that a speck can stop someone breathing.', 'If you or someone you love uses drugs, DirectLine is free and confidential, any time: 1800 888 236.'],
    lose: ['He wanders off down the bike path, still talking to himself. You hope he is okay.'],
  },
};

// Coburg and Preston
Object.assign(ENEMIES, NORTH_ENEMIES);
Object.assign(TRAINERS, NORTH_TRAINERS);

// Who owns which pet you have to win (Princess has no trainer: she is free).
export const PRIZE_TRAINER = Object.fromEntries(Object.entries(TRAINERS).filter(([, t]) => t.prize).map(([id, t]) => [t.prize, id]));

// Battle lines (wild things appearing and leaving, trainers' challenges) live in dialogue.js.
for (const [id, e] of Object.entries(ENEMIES)) Object.assign(e, { appear: '' }, e.appear !== undefined ? { appear: e.appear } : {}, FOE_TEXT[id] || {});
for (const [id, t] of Object.entries(TRAINERS)) if (PEOPLE[id]?.battle) Object.assign(t, PEOPLE[id].battle);
