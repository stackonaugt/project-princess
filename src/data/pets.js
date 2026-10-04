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
//  lines      what the pet "says", keyed by the hearts needed to unlock them
//  night / rain / asleep      extra lines for those situations

export const PETS = [
  {
    id: 'princess', name: 'Princess', species: 'Toy poodle', type: 'fairy', sprite: 'poodle',
    pal: { a: '#f4f0ea', b: '#d8d0c8', w: '#ffffff', c: '#6a3a28', p: '#f07cc0', n: '#5a3028', e: '#2a1a10' },
    owner: 'Helen and Paddy', region: 'laverton', zone: 'allen', home: [20, 12], range: 3,
    homeSpot: { zone: 'home', x: 19, y: 15 },
    behaviour: 'patrol', patrol: [[17, 9], [24, 10], [25, 14], [20, 16], [15, 14]],
    sleeps: [22 * 60, 26 * 60],
    bio: 'The guardian of Laverton. Sassy, fluffy, and ready to attack.',
    clue: 'Locals talk about a tiny, very fluffy security guard who patrols Allen St. Try right out the front.',
    funFact: 'Her pink tail and pink paws are not natural. Her confidence absolutely is.',
    favouriteSpot: 'The exact centre of the Allen St court, where everyone can see her.',
    loves: ['ribbon', 'chicken', 'strawberry'], likes: ['cheese', 'croissant', 'chilli'], dislikes: ['lemon', 'tennis', 'zucchini'],
    stats: { hp: 55, attack: 72, defence: 45, speed: 80, special: 95 },
    lines: {
      0: ['Princess looks you up and down. You have not passed inspection.', 'Princess yaps once. That was a warning.', 'Princess fluffs her pom-poms. Laverton is under her protection.'],
      3: ['Princess allows you to stand slightly closer than before. An honour.', 'Princess sniffs your shoe and decides it can stay.'],
      6: ['Princess trots beside you for a few steps, like a tiny bodyguard.', 'Princess barks at a passing ute on your behalf.'],
      9: ['Princess rolls over for a belly rub. If you tell anyone, she will deny it.'],
    },
    night: ['Princess is on night patrol. Her eyes glint under the streetlight.'],
    rain: ['Princess refuses to acknowledge the rain. The rain is beneath her.'],
    asleep: ['Princess is asleep, curled into a perfect cloud. She snores like a tiny diesel engine.'],
    evolution: {
      name: 'Flamcess', species: 'Toy poodle (on fire)', type: 'fire', level: 14, hearts: 5, sprite: 'flamcess',
      pal: { a: '#ffe0b0', b: '#f0b070', w: '#fff0a0', c: '#c8501a', p: '#e83a2a', y: '#ffd030', o: '#f08020', r: '#d8301a', n: '#5a2010', e: '#2a1a10' },
      stats: { hp: 70, attack: 88, defence: 55, speed: 92, special: 112 },
      moves: ['blazeclaws', 'hotbite', 'scorchbed', 'pompom'],
      bio: 'Princess, but on fire. Laverton has never been safer, or warmer.',
    },
  },
  {
    id: 'salami', name: 'Salami', species: 'Tabby cat', type: 'street', sprite: 'tabby',
    pal: { a: '#8a6a42', s: '#3a2a18', c: '#c88a4a', w: '#e8d8b8', e: '#8ab83a', p: '#d89a9a' },
    owner: 'Rose', region: 'brunswick', zone: 'donald', home: [11, 7], range: 3,
    homeSpot: { zone: 'home', x: 18, y: 3 },
    behaviour: 'stalk', sleeps: [13 * 60, 15 * 60],
    bio: 'A foundling with a vicious strike.',
    clue: 'Something stripy rules the driveway of a blue-grey block of flats on Donald St.',
    funFact: 'Owns at least three milk crates and one wheelie bin, by right of conquest.',
    favouriteSpot: 'The warm concrete of the driveway at 10 Donald St, around mid-morning.',
    loves: ['sardine', 'feather'], likes: ['snag', 'chicken', 'cheese', 'tomato'], dislikes: ['carrot', 'lemon', 'basil'],
    stats: { hp: 60, attack: 88, defence: 50, speed: 85, special: 60 },
    lines: {
      0: ['Salami eyes your ankles like they owe her money.', 'Salami headbutts your leg, then swipes it. Mixed signals.', 'Salami has claimed a milk crate. It is hers now.'],
      3: ['Salami follows you to the end of the lane, then pretends she was going there anyway.'],
      6: ['Salami brings you a leaf. It is a gift. Do not refuse the leaf.', 'Salami slow-blinks at you. In cat, that is a love letter.'],
      9: ['Salami curls up on your feet. You are not allowed to move now. Those are the rules.'],
    },
    night: ['Salami is out on her night rounds. She knows every cat on Sydney Rd, and outranks most of them.'],
    rain: ['Salami glares at the rain from under a terrace verandah, as if it was your idea.'],
    asleep: ['Salami is having her afternoon nap in a sunbeam. Disturb her at your peril.'],
  },
  {
    id: 'spooky', name: 'Spooky', species: 'Bunny', type: 'ghost', sprite: 'bunny',
    pal: { a: '#2e2836', b: '#1c1622', w: '#4a405a', e: '#9fe8ff', p: '#9a78b0' },
    owner: 'Slinks', region: 'brunswick', zone: 'sydney', home: [10, 13], range: 2.5,
    homeSpot: { zone: 'home', x: 2, y: 6 },
    behaviour: 'phase', sleeps: [9 * 60, 12 * 60],
    bio: 'A night walker who can phase in and out of reality at will.',
    clue: 'Late-night diners at A1 Bakery on Sydney Rd swear a black shape flickers between the tables. Easier to spot after dark.',
    funFact: 'Has been seen in two places at once. Nobody has been brave enough to check which was the real one.',
    favouriteSpot: 'Under the outdoor tables at A1 Bakery, catching dropped za\'atar.',
    loves: ['carrot', 'lemon', 'basil'], likes: ['feather', 'croissant', 'strawberry', 'zucchini'], dislikes: ['snag', 'chicken', 'chilli'],
    stats: { hp: 50, attack: 55, defence: 60, speed: 95, special: 90 },
    lines: {
      0: ['Spooky flickers out of sight, then reappears right behind you.', "Spooky stares at something you can't see.", 'You blink and Spooky is somewhere else entirely.'],
      3: ['Spooky lets you see her for a full five seconds. A rare privilege.'],
      6: ['Spooky does a binky: a little twisting leap of joy. Then she vanishes mid-air.'],
      9: ['Spooky nudges your hand. For a moment, you can see through her. It feels like a secret.'],
    },
    night: ['Spooky is fully solid in the moonlight. She seems more herself at night.', 'Spooky thumps the ground once. Every duck on the pond falls silent.'],
    rain: ['Raindrops fall straight through Spooky. She does not seem to mind.'],
    asleep: ['Spooky is asleep, which mostly means she is see-through and very still.'],
  },
  {
    id: 'poppy', name: 'Poppy', species: 'French bulldog', type: 'rock', sprite: 'frenchie',
    pal: { a: '#26252a', b: '#141418', w: '#f0ece4', g: '#7a7670', p: '#a87878', e: '#7a5030', n: '#0a0a0a', l: '#3a3940' },
    owner: 'Seb and Sinead', region: 'reservoir', zone: 'loddon', home: [18, 10], range: 3,
    homeSpot: { zone: 'yard', x: 25, y: 9 },
    behaviour: 'zoomies', sleeps: [21 * 60, 26 * 60],
    bio: 'Pure muscle and brawn, with very little brains. Ready to bust her way through.',
    clue: 'Unit 1, 835 Plenty Rd (round the corner on Loddon Ave) reports being "body-checked by a small black brick" in the driveway.',
    funFact: 'Has tried to race every jogger at Edwardes Lake. Win record: zero. Enthusiasm: infinite.',
    favouriteSpot: 'The middle of the shared driveway, where every delivery driver has to say hello.',
    loves: ['tennis', 'snag', 'pumpkin', 'potato'], likes: ['chicken', 'cheese', 'croissant', 'sardine', 'carrot', 'lemon', 'zucchini', 'tomato', 'strawberry'], dislikes: [],
    stats: { hp: 85, attack: 80, defence: 90, speed: 50, special: 20 },
    lines: {
      0: ['Poppy charges at you and bounces off. She is thrilled about it.', 'Poppy snorts loudly. Possibly a thought. Probably not.', 'Poppy tries to squeeze through a gap that is clearly too small.'],
      3: ['Poppy leans her whole weight against your legs. It is like being hugged by a bag of cement.'],
      6: ['Poppy does a lap of the picnic tables in your honour. Then another. Then she falls over.'],
      9: ['Poppy sits on your foot and looks up at you with total devotion. Her brain is empty. Her heart is full.'],
    },
    night: ['Poppy is fighting sleep and losing. Her eyelids are doing their best.'],
    rain: ['Poppy is trying to eat the raindrops. She is getting some.'],
    asleep: ['Poppy is asleep on her back with all four legs in the air. Snoring at an impressive volume.'],
    evolution: {
      name: 'Floppy', species: 'French bulldog (squeaky)', type: ['plastic', 'rock'], level: 16, hearts: 5, sprite: 'floppy',
      pal: { a: '#6a5ab0', b: '#483a88', w: '#f0ece4', g: '#b0a8e0', p: '#f07ab0', e: '#1a1010', n: '#1a1010', l: '#8a7ad0', h: '#ffffff', k: '#9a9aa4' },
      stats: { hp: 105, attack: 98, defence: 110, speed: 52, special: 35 },
      moves: ['flopslam', 'squeak', 'bubblewrap', 'chew'],
      bio: 'Poppy has become a squeaky rubber toy made of rock. Nobody, including Poppy, knows how.',
    },
  },
  {
    id: 'stanley', name: 'Stanley', species: 'Mini schnauzer', type: 'psychic', sprite: 'schnauzer',
    pal: { a: '#55585f', l: '#9a9ea6', w: '#e8e6e0', d: '#3a3c42', e: '#2a1a10', n: '#1a1a1a' },
    owner: 'Tim and Nicholas', region: 'reservoir', zone: 'glasgow', home: [25, 8], range: 2.5,
    homeSpot: { zone: 'home', x: 12, y: 16 },
    behaviour: 'aloof', sleeps: [23 * 60, 26 * 60],
    bio: 'Grumpy but loyal. Only likes smart animals like him.',
    clue: 'A distinguished grey gentleman supervises Glasgow Ave from behind an orange brick fence. He will not come to you.',
    funFact: 'Thinks most dogs are idiots. Is usually right.',
    favouriteSpot: 'The front lawn at 57C, where he can judge the whole street at once.',
    loves: ['cheese', 'croissant'], likes: ['chicken', 'sardine', 'basil', 'pumpkin'], dislikes: ['tennis', 'lemon', 'chilli'],
    stats: { hp: 60, attack: 50, defence: 70, speed: 55, special: 98 },
    lines: {
      0: ['Stanley sighs. He was hoping for more intelligent company.', 'Stanley grumbles, but stays close by.', 'Stanley raises one bushy eyebrow at you.'],
      3: ['Stanley no longer walks away when you approach. Progress.', 'Stanley gives a short, approving "hmph".'],
      6: ['Stanley sits next to you and watches the street. You feel like you are being trusted with something.'],
      9: ['Stanley rests his chin on your knee. He has decided you are one of the smart ones.'],
    },
    night: ['Stanley is staying up late, supervising the possums. They are not doing it right.'],
    rain: ['Stanley stands under the verandah, looking at the rain as if it has personally disappointed him.'],
    asleep: ['Stanley is asleep. Even his snoring sounds disapproving.'],
  },
];

export const PET_BY_ID = Object.fromEntries(PETS.map(p => [p.id, p]));
