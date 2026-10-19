// ============================================================
//  MEREDITH MUSIC FESTIVAL. The festival expansion, part 1: night one.
//  Its people, words, wild things, trainers, items and the story beats.
// ============================================================
//
// Kept in one file (like north.js and east.js) so it merges cleanly with
// work on the suburbs. Each table is merged into the main one of its kind:
//
//   MF_NPCS     -> NPCS (npcs.js)          looks (Seb's own PNGs win: npcs/<id>.png)
//   MF_PEOPLE   -> PEOPLE (dialogue.js)    role, lines, battle text
//   MF_PETS     -> PETS (pets.js)          Toby, the festival starter
//   MF_PET_MOVES -> PET_MOVES, MF_MOVES -> MOVES (moves.js)
//   MF_ENEMIES  -> ENEMIES, MF_FOE_TEXT -> FOE_TEXT, MF_TRAINERS -> TRAINERS (enemies.js)
//   MF_ITEMS    -> ITEMS (items.js), MF_SHOPS -> SHOPS (shops.js)
//   MF_PLACES   -> PLACES (dialogue.js)    zone taglines
//   MF_TEXT     the story: the charter bus, the portal, the hunt, the sunrise.
//               Listed in the words file (game/words.js) so it can be edited there.
//
// The festival is the real Meredith Supernatural Amphitheatre, from the owner's
// map and photos. Jess Browning, Gabe, Charlotte and Seb are real friends of
// the owner, as are the Melbourne cast who come along. Keep them affectionate.
// Festival goers are made up. Logic: src/systems/meredith.js.
//
// Dialogue style: the person you talk to says plain words; someone cutting in
// is Name: "words"; actions are *in asterisks*. Australian spelling, no em
// dashes, lines under about 140 characters.
import { authoredValue } from '../authoring/overrides.js';

// ------------------------------------------------------------ the festival grounds
export const MF_ZONES = ['mfreception', 'mfbush', 'mfamphi', 'mftop', 'mfsunset', 'mfbluegums', 'mfpines', 'mfflamingo', 'mfstagefront', 'mfsunview'];
// Cutscene-only places: you are taken there for a scene, then brought back.
export const MF_CUTSCENES = ['mfstagefront', 'mfsunview'];
export const isMeredith = id => MF_ZONES.includes(id);
// How far night one has got (state.data.meredith.stage).
export const MF_STAGE = { invited: 1, arrived: 2, wristband: 3, pitched: 4, carrying: 5, night: 6, hunt: 7, sunrise: 8, done: 9, home: 10 };

// The save (state.data.meredith): stage, where each pet landed, who is back.
//   tent      how well you pitched it: 'good' or 'crappy' (null till it is up)
//   heard     pets someone has told you about (their To Do line gets specific)
//   quest     items handed over for pets: { [petId]: true }
//   show      the set you are watching in front of the stage: 'mamaking', then 'icekids'
//   cocktail  the day you drank a Pink Flamingo (the team's power-up for that night)
export const freshMeredith = () => ({ stage: 0, scatter: {}, got: [], partyBefore: null, heroBefore: null, nightSeen: false, glimpsed: false, lostPrincess: false, cursed: false,
  tent: null, heard: [], quest: {}, show: null, mamaDone: false, sunNoticed: false, eyeSpins: 0, cocktail: -1 });

// How many festival goers mill about, by day and by night.
export const MF_BUSY = {
  day: { mfreception: 3, mfbush: 2, mfamphi: 5, mftop: 4, mfsunset: 3, mfbluegums: 2, mfpines: 2 },
  night: { mfreception: 4, mfbush: 6, mfamphi: 18, mftop: 8, mfsunset: 9, mfbluegums: 5, mfpines: 5 },
};

// The festival clock: slower than at home, and it holds at dusk (day phase)
// or before dawn (night phase) until the story moves it on.
export const MF_CLOCK = { slow: 3, dayStart: 13 * 60, dayHold: 18 * 60 + 30, nightStart: 21 * 60 + 15, nightHold: 25 * 60 + 30, dawn: 29 * 60 + 50 };

// Where the scattered pets land, and how you get each one back:
//   wild   the pet is spooked and play-fights you            (pet stands in the zone)
//   goer   a festival goer reckons it is theirs              (beat them in a battle)
//   crowd  a friend has the pet, somewhere in the dark crowd (find them with your torch)
//   dance  a dancer will only hand it back after a dance off (in-world rhythm game)
//   eye    the pet is riding the Meredith Eye                 (spin it till their seat comes up)
//   quest  someone wants something first (`want`, an item); `fight` means they still battle you after
export const MF_SCATTER = {
  salami: { zone: 'mfamphi', how: 'crowd', by: 'rose' },
  poppy: { zone: 'mfbush', how: 'wild', at: [30, 30] },
  stanley: { zone: 'mftop', how: 'eye', by: 'mfeyeguy' },
  rusty: { zone: 'mfflamingo', how: 'dance', by: 'mfshuffle' },
  chloe: { zone: 'mfpines', how: 'wild', at: [33, 14] },
  marty: { zone: 'mfbluegums', how: 'quest', by: 'mfgazebo', want: 'pegs' },
  girlie: { zone: 'mfsunset', how: 'quest', by: 'mfsunsal', want: 'flamingo' },
  ziggy: { zone: 'mfreception', how: 'quest', by: 'mfmankey', want: 'festpie', fight: true },
};
// Pets without their own line above take the next of these, in order.
export const MF_SPARE = [
  { zone: 'mfpines', how: 'goer', by: 'mfhaybale' },
  { zone: 'mfbush', how: 'goer', by: 'mfglitter' },
  { zone: 'mfamphi', how: 'goer', by: 'mfcouchking' },
  { zone: 'mfreception', how: 'wild', at: [24, 26] },
  { zone: 'mftop', how: 'wild', at: [12, 26] },
  { zone: 'mfbluegums', how: 'wild', at: [20, 12] },
];
// No pets come on the bus: they are all at home. The portal pulls every one
// of them to the festival except these: Spooky stays with the twins (part 2),
// Emilio stays on Edwardes Lake, and Toby is Jess's. Princess is pulled in too,
// but nobody finds her till the sunrise.
export const MF_STAY_HOME = ['princess', 'spooky', 'emilio', 'toby'];

// A Pink Flamingo cocktail, drunk at the bar: the whole team's power-up for the night.
export const MF_COCKTAIL = { price: 12, bonus: { attack: 1.15, special: 1.15, speed: 1.1, crit: 0.05 } };

// Seb's music, in assets/audio/meredith/. The day and night lists play round
// the festival one after another, on repeat; the Amphitheatre gets them loudest.
// An empty list or name plays the synth stand-in. The Ice Kids' curse waits
// until their track has played `curseAfter` seconds.
export const MF_MUSIC = {
  day: ['daytime-music1.mp3', 'daytime-music2.mp3', 'daytime-music3.mp3', 'daytime-music4.mp3'],
  night: ['nighttime-music1.mp3', 'nighttime-music2.mp3', 'nighttime-music3.mp3', 'nighttime-music4.mp3'],
  mamaking: 'mama-king.mp3', icekids: 'frost-kids.mp3', curseAfter: 40,
};

// ------------------------------------------------------------ people
// Seb's own sprites live in assets/sprites/npcs/<id>.png. These looks are the
// fallback and the portraits' source if a PNG is missing.
export const MF_NPCS = {
  jess: {
    name: 'Jess', look: { hair: '#d0402a', hairStyle: 'wavyshort', skin: '#f2c8a8', shirt: '#1e1e22', blazer: '#2a2a30', pants: '#2a3a5a', shoes: '#1a1a1a', sunglasses: '#1e1e24', shades: 'round', hoops: '#e8a040' },
  },
  gabe: {
    name: 'Gabe', look: { hair: '#3a2618', hairStyle: 'long', skin: '#f0c8a8', shirt: '#e8a81e', pants: '#2a2a30', shoes: '#3a2a1a', moustache: '#3a2618', stubble: true },
  },
  charlotte: {
    name: 'Charlotte', look: { hair: '#d89058', hairStyle: 'curly', skin: '#f6d6c0', shirt: '#22222a', pants: '#2a3448', shoes: '#4a3a2a', glasses: '#6a4a2a' },
  },
  seb: {
    name: 'Seb', look: { hair: '#a8562a', hairStyle: 'cap', cap: '#c8302a', skin: '#f0c0a0', shirt: '#b8343a', shirtPattern: 'plaid', shirtAccent: ['#7a1e24', '#1e1e22'], pants: '#2a2a30', shoes: '#2a1a10', longBeard: '#a8562a', belly: true },
  },
  // Festival staff and goers (made up)
  mfgate: { name: 'Wristband Volunteer', look: { hair: '#2a1a10', hairStyle: 'bun', skin: '#d8a07a', shirt: '#e8c030', hivis: true, pants: '#3a3a44', shoes: '#f4f4f0' } },
  mfhelper: { name: 'Helper Hut Helper', look: { hair: '#d8d4cc', hairStyle: 'short', skin: '#f2c8a8', shirt: '#e8302a', hivis: true, pants: '#3a4a3a', shoes: '#4a3a2a', hat: '#d8c89a' } },
  mfeyeguy: { name: 'Eye Ride Operator', look: { hair: '#1e1612', hairStyle: 'cap', cap: '#e8c030', skin: '#c88a5a', shirt: '#c8302a', pants: '#3a3a30', shoes: '#2a2a2a', stubble: true } },
  mfgazebo: { name: 'Gazebo Gary', look: { hair: '#8a6a42', hairStyle: 'mullet', skin: '#e8b48a', shirt: '#f4f0e6', jersey: ['#1e3a8a', '#f4f0e6'], pants: '#3a5a8a', shoes: '#f4f4f0', sunglasses: '#3a8ac8', shades: 'wrap' } },
  mfmankey: { name: 'Tom Mankeys Local', look: { hair: '#e8e4dc', hairStyle: 'messybun', skin: '#f2c8a8', shirt: '#7a3aa8', coat: '#5a2a2a', pants: '#2a2a30', shoes: '#c8443a' } },
  mfsunsal: { name: 'Sunset Sal', look: { hair: '#f0d070', hairStyle: 'wavy', skin: '#e0b090', shirt: '#f28bb0', pants: '#f4efe0', shoes: '#c8a070', hat: '#e8d8a8', hoops: '#e8c040' } },
  mfhaybale: { name: 'Hay Bale Hamish', look: { hair: '#c8743a', hairStyle: 'curly', skin: '#f2c79a', shirt: '#3a8a3a', shirtPattern: 'plaid', shirtAccent: ['#1e3a1e', '#f4efe0'], pants: '#5a4a3a', shoes: '#3a2a1a', beard: true } },
  mfglitter: { name: 'Glitter Gwen', look: { hair: '#b79cf0', hairStyle: 'pixie', skin: '#f6d8b8', shirt: '#e2508a', shirtPattern: 'dots', shirtAccent: '#f5e66b', pants: '#3a8ac8', shoes: '#f4f4f0', lips: '#c0505a' } },
  mfcouchking: { name: 'The Couch King', look: { hair: '#3a2416', hairStyle: 'short', skin: '#b07a4a', shirt: '#d87a2a', shirtPattern: 'leopard', shirtAccent: '#2a1a10', pants: '#2a2a30', shoes: '#1a1a1a', sunglasses: '#1e1e24', shades: 'rect', beret: '#1e1e22' } },
  mfshuffle: { name: 'Shuffles', look: { hair: '#141012', hairStyle: 'curly', skin: '#8a5a34', shirt: '#3fa38f', jersey: ['#3fa38f', '#f5e66b'], pants: '#2a2a30', shoes: '#f4f4f0', headband: '#f28bb0' } },
  // The Ice Kids (from Seb's photo): they play last on night one and curse the festival.
  mficesinger: { name: 'Ice Kids Singer', look: { hair: '#f0e8cc', hairStyle: 'long', skin: '#f6dccb', shirt: '#f2efe4', scarf: '#8e8e94', lips: '#c01e2a', pants: '#e8e4d8', shoes: '#1a1a1a' } },
  mficeguitar: { name: 'Ice Kids Guitarist', look: { hair: '#3a9cb8', hairStyle: 'long', skin: '#f2d2bc', shirt: '#f6f6f2', collar: true, pants: '#1e1e22', shoes: '#1a1a1a' } },
  mfbluecrew: { name: 'The Blue Drink Crew', look: { hair: '#2a1a10', hairStyle: 'short', skin: '#f2c79a', shirt: '#3a7ad8', hood: '#3a7ad8', pants: '#3a7ad8', shoes: '#f4f4f0' } },
  // Mama King, Nathan's favourite band, on before the Ice Kids (made up looks).
  mfmama1: { name: 'Mama King Singer', look: { hair: '#2a1a10', hairStyle: 'curly', skin: '#c88a5a', shirt: '#e8c030', shirtPattern: 'leopard', shirtAccent: '#2a1a10', pants: '#1e1e22', shoes: '#c8302a', hoops: '#e8c040', lips: '#c01e2a', holding: 'mic' } },
  mfmama2: { name: 'Mama King Bassist', look: { hair: '#d8d4cc', hairStyle: 'mullet', skin: '#f2c8a8', shirt: '#7a3aa8', pants: '#2a2a30', shoes: '#1a1a1a', sunglasses: '#1e1e24', shades: 'round', moustache: '#d8d4cc', holding: 'bass' } },
  // The Dickheads the Ice Kids summon: bucket hats, singlets, cargo shorts. Scenery only for now.
  mfdick1: { name: 'Dickhead', look: { hair: '#3a2616', hairStyle: 'short', skin: '#f2c8a8', shirt: '#f4f4f0', pants: '#8a7a52', shoes: '#f4f4f0', hat: '#3a6ac8', sunglasses: '#1e1e24', shades: 'wrap' } },
  mfdick2: { name: 'Dickhead', look: { hair: '#c8a060', hairStyle: 'short', skin: '#e8b48a', shirt: '#c8302a', pants: '#5a5a3a', shoes: '#2a2a2a', hat: '#f5d03a', sunglasses: '#3a8ac8', shades: 'wrap' } },
  mfdick3: { name: 'Dickhead', look: { hair: '#1e1612', hairStyle: 'short', skin: '#d8a07a', shirt: '#1e1e22', pants: '#7a6a4a', shoes: '#f4f4f0', hat: '#2a2a2a', sunglasses: '#1e1e24', shades: 'wrap' } },
};

export const MF_PEOPLE = {
  mficesinger: { role: 'Ice Kids. On last', lines: [['*She stares straight through you without blinking.*']] },
  mficeguitar: { role: 'Ice Kids. On last', lines: [['*He tunes a guitar that is somehow covered in frost.*']] },
  jess: {
    role: 'Organiser at the UWU. Inventor of the pet portal (finally)',
    lines: [
      ['Six years I have been talking about the pet portal. Six years! And tonight, it works.', 'Probably works.'],
      ['Every worker deserves a cuddle at the end of a shift. That is basically the whole union movement.'],
      ['Toby! Stop eating that. That is a tent peg.'],
      ['It auto-detects your pets. No pairing, no app, no account. I hate an account.'],
    ],
  },
  gabe: {
    role: 'Camp legend. Big grin, bee tattoo, always has a spare chair',
    lines: [
      ['Grab a chair, any chair. Except that one. That one has a hole in it. Actually that one is fine.'],
      ['I brought sunnies, a hat and one sock. Two out of three is good for Meredith.'],
      ['The couch is the heart of the camp. The camp is just where we keep the tents.'],
    ],
  },
  charlotte: {
    role: 'Keeps the crew alive. Has sunscreen, snacks and a plan',
    lines: [
      ['Water first. Then fun. Then more water. I am the water person this year.'],
      ['I have put the couch on the roster. Two hours each. Somebody has to hold the spot.'],
      ['If you lose us, we are at the couch. If you lose the couch, we are at the Pink Flamingo.'],
    ],
  },
  seb: {
    role: 'Comms at Professionals Australia. A beard you could camp in',
    lines: [
      ['Professionals are workers too. Engineers, scientists, pharmacists. Everyone here sells their labour, mate.'],
      ['I put the gazebo up myself. The wind put it down again. Solidarity with the wind, I suppose.'],
      ['Best thing about Meredith: no dickheads. That is the rule. The No Dickhead Policy. It mostly works.'],
      ['Our union just won a pay rise for the scientists. Tonight, the couch. Tomorrow, the bosses.'],
    ],
  },
  mfgate: { role: 'Wristband tent, Meredith Reception', lines: [['Welcome to the Sup! Wristband on, rubbish in the bins, and no dickheads.']] },
  mfhelper: {
    role: 'Helper Hut volunteer, Top Camp', lines: [['Lost a mate? Lost a shoe? Lost the plot? We can help with two of those.']],
    pegs: ['Tent pegs? We have a whole bucket. People leave them behind every year.', '*The volunteer hands you a fistful of spare tent pegs.*'],
  },
  mfeyeguy: {
    role: 'Runs the Meredith Eye', lines: [['The Eye goes round. That is the main thing it does.']],
    eye: {
      intro: ['There is a little dog up in one of the seats. Got on by himself. Every time I stop it, he will not get off.', 'Spin her round and see where she lands. Some seats have a prize. Some have a problem. One has a dog.'],
      ask: 'Spin the Meredith Eye?', yes: 'Spin it', no: 'Not yet',
      reward: '*The Eye stops. Somebody left a present in seat {n}.*',
      challenge: '*The Eye stops on seat {n}. Something in it does not want to get off.*',
      again: 'Spin again?',
      stanley: ['*The Eye creaks to a stop. Seat {n}. Stanley is sitting in it like he paid for a ticket.*', '*He steps down onto the platform, looks at you, and leans on your leg.*'],
      after: ['He went round about forty times. Did not blink once. Proper little customer.'],
    },
  },
  mfgazebo: {
    role: 'Owns the biggest gazebo in Blue Gums', lines: [['Twelve pegs. Four ropes. One gazebo. It has never once stayed up.']],
    quest: {
      ask: ['A man is sitting under a collapsed gazebo with a familiar curly dog on his lap.', 'This one dropped out of the sky onto my esky. He is holding the gazebo down for me. I cannot let him go till I have more pegs.', 'The Helper Hut at Top Camp has spare pegs. Bring me some and he is yours.'],
      waiting: ['Pegs, mate. The Helper Hut at Top Camp. Then the dog is all yours.'],
      give: ['Pegs! Beautiful. *He hammers them in. The gazebo stays up for nearly a minute.*', 'There you go, mate. He is a good weight. Best gazebo anchor I ever had.'],
    },
  },
  mfmankey: {
    role: 'Tom Mankeys, under the red neon X', lines: [['Tom Mankeys is the best camp. We have a neon X. What do you have?']],
    quest: {
      ask: ['Someone under the neon X is feeding a tiny black and white cat bits of jaffle.', 'He came out of a purple light. He has eaten all our jaffles. Bring us a pie from Heaven Eleven and we will talk.'],
      waiting: ['A pie from Heaven Eleven, down the Amphitheatre. The cat is getting peckish. So are we.'],
      give: ['*They split the pie seven ways. The cat gets the biggest bit.*', 'Cheers. But a pie is a pie, and a camp cat is a camp cat. Battle us for him.'],
    },
    battle: {
      challenge: ['The Tom Mankeys local cracks their knuckles. The cat watches from a camp chair.'],
      ask: 'Battle for the cat?', yes: 'He has a home', no: 'Not now',
      win: ['"Fine. But he knows where we are. Under the X. Always under the X."'],
      lose: ['The cat eats more pie. Everyone under the X cheers.'],
      again: ['"Back for more pie? Or more battle?"'],
    },
  },
  mfsunsal: {
    role: 'Watches every sunset from the same hay bale', lines: [['Thirty-one Meredith sunsets. I have clapped for every one of them.']],
    quest: {
      ask: ['Sunset Sal is holding a big black lab who is clearly yours. The lab is very happy about it.', 'She has been keeping my bale warm. Lovely girl. I will swap you, though. A Pink Flamingo for the dog. Fair is fair.'],
      waiting: ['A Pink Flamingo, from the bar at the back of the Amphitheatre. Then she is all yours.'],
      give: ['Oh, that is pink. That is very pink. *Sal takes a long sip.*', 'Off you go then, love. Bring her back for a sunset some time.'],
    },
  },
  mfhaybale: {
    role: 'Lives on a hay bale in South Pines', lines: [['Hay bale, best seat in the house. Itchy, though.']],
    battle: {
      challenge: ['Hamish has built a little fort out of hay. A pet is asleep in it.', '"It is a hay fort. It is for the pet. The pet is for the hay fort."'],
      ask: 'Battle Hamish?', yes: 'Go', no: 'Not yet',
      win: ['"Take the pet. I will keep the fort. It was always about the fort."'],
      lose: ['Hamish adds another bale to the fort. It is getting serious.'],
      again: ['"The fort has grown. Want to try again?"'],
    },
  },
  mfglitter: {
    role: 'Bush Camp glitter station', lines: [['Hold still. Little bit of glitter. Little bit more. You are glowing now.']],
    battle: {
      challenge: ['Glitter Gwen has glittered a pet who is yours. Very thoroughly.', '"Look how happy she is! Beat me and you can have her. Glitter stays."'],
      ask: 'Battle Glitter Gwen?', yes: 'Bring the sparkle', no: 'Not now',
      win: ['"Glitter is forever, though. You will be finding it at Christmas."'],
      lose: ['You are now covered in glitter. Gwen calls it a win for everyone.'],
      again: ['"More glitter? There is always more glitter."'],
    },
  },
  mfcouchking: {
    role: 'Has had the same couch spot since 2009', lines: [['This couch has seen eleven festivals and one marriage proposal. She said maybe.']],
    battle: {
      challenge: ['The Couch King is sprawled across a velvet three-seater with one of your pets.', '"Every couch needs a dog. Every king needs a couch. Beat me for both. Well, the dog."'],
      ask: 'Battle the Couch King?', yes: 'Long live the king', no: 'Not today',
      win: ['"Take the dog. Leave the couch. The couch is not negotiable."'],
      lose: ['The Couch King does not get up. He does not need to.'],
      again: ['"The throne awaits. Well, the cushion."'],
    },
  },
  mfshuffle: {
    role: 'Unbeaten on the Pink Flamingo turf since 2016', lines: [['If you want something from Shuffles, you dance for it.']],
  },
  mfmama1: { role: 'Mama King. On before the Ice Kids', lines: [['Thank you Meredith! You are beautiful! All of you! Even you at the back!']] },
  mfmama2: { role: 'Mama King. Plays bass', lines: [['*He nods slowly to a beat only he can hear.*']] },
  mfdick1: { role: 'A Dickhead', lines: [['*He shoulder-barges a gazebo for no reason.*']] },
  mfdick2: { role: 'A Dickhead', lines: [['*He yells "WOOOO" at nobody.*']] },
  mfdick3: { role: 'A Dickhead', lines: [['*He kicks over somebody\'s esky.*']] },
  mfbluecrew: {
    role: 'Six friends in matching blue onesies', lines: [['We are the Blue Drink Crew. We are very hydrated.']],
    battle: {
      challenge: ['Six people in matching blue onesies step forward as one.', '"Our crew against your crew. Hydrated against dehydrated."'],
      ask: 'Battle the Blue Drink Crew?', yes: 'Let\'s go', no: 'Not now',
      win: ['"Respect. Have an electrolyte drink. We have forty."'],
      lose: ['"Hydration wins again." All six of them high five.'],
      again: ['"Round two? Drink some water first."'],
    },
  },
};

// Toby, Jess's little black poodle cross. The festival starter. Seb's art
// can replace pets/toby.png; the built-in sheet is built from his Marty.
export const MF_PETS = [
  {
    id: 'toby', name: 'Toby', species: 'Poodle cross', type: ['electric', 'dark'], sprite: 'cavoodle',
    pal: { a: '#2a2626', b: '#141212', c: '#3e3838', e: '#0a0a0a', n: '#141010', h: '#d8303a' },
    owner: 'Jess', region: 'meredith', zone: 'mftop', home: [21, 20], range: 1.2,
    homeSpot: { zone: 'yard', x: 16, y: 10 }, behaviour: 'wander',
    loves: ['chicken', 'snag', 'cheese'], likes: ['egg', 'tennis', 'festpie'], dislikes: ['lemon'],
    stats: { hp: 66, attack: 62, defence: 54, speed: 74, special: 66 },
    bio: 'Jess\'s little black poodle cross, with a red heart on his collar. First through the portal, first back out. Slightly static.',
    clue: 'Jess brings him to Meredith. He comes back out of the portal before anyone else.',
    funFact: 'His curls hold a charge since the portal. Do not rub him on a jumper.', favouriteSpot: 'In Jess\'s sleeping bag, right at the bottom.',
    lines: { 0: ['Toby sneezes, and a tiny spark jumps off his nose.', 'He sits on your foot. That is where he lives now.'] },
    night: ['Toby\'s curls are glowing a little in the dark. That is new.'], rain: ['Wet poodle. Wet, slightly sparky poodle.'], asleep: ['Toby is asleep, twitching. Dreaming of tent pegs.'],
  },
];
export const MF_PET_MOVES = { toby: ['staticcurls', 'portalhop', 'nibble', 'puppydogeyes'] };
export const MF_MOVES = {
  staticcurls: { name: 'Static Curls', type: 'electric', power: 55, anim: 'beam', text: '{u} shakes his curls. Every one of them crackles at {t}.' },
  portalhop: { name: 'Portal Hop', type: 'dark', power: 50, effect: { evade: true }, anim: 'fade', text: '{u} blinks out of the air and pops back behind {t}.' },
  nibble: { name: 'Nibble', type: 'street', power: 35, anim: 'bite', text: '{u} gives {t} a little nibble. Little, but pointy.' },
  puppydogeyes: { name: 'Puppy Dog Eyes', type: 'fairy', power: 0, effect: { foeAtk: 1 }, anim: 'puppyeyes', text: '{u} looks up at {t}. Nobody can hit that face properly.' },
  // Festival foes
  glowsplash: { name: 'Glow Splash', type: 'electric', power: 45, anim: 'beam', text: '{u} cracks and glows. {t} cannot see a thing.' },
  boot: { name: 'The Boot', type: 'leather', power: 60, anim: 'lunge', text: 'The whole crowd holds up a boot for the band. {u} swings one at {t}.' },
  flop: { name: 'Thong Flop', type: 'plastic', power: 40, anim: 'hop', text: '{u} slaps across the ground at {t}. Flip. Flop.' },
  coldsnap: { name: 'Cold Snap', type: 'water', power: 45, effect: { foeDef: 1 }, anim: 'splash', text: '{u} pops its lid. A blast of ice-cold air hits {t}.' },
  peg: { name: 'Loose Peg', type: 'steel', power: 50, anim: 'claw', text: 'A tent peg pings out of the ground at {t}.' },
  billow: { name: 'Billow', type: 'park', power: 45, anim: 'gust', text: '{u} catches the wind and billows into {t}.' },
  dustup: { name: 'Dust Up', type: 'dirt', power: 50, anim: 'gust', text: '{u} spins up a cloud of paddock dust around {t}.' },
  sparkle: { name: 'Sparkle', type: 'fairy', power: 45, effect: { foeAtk: 1 }, anim: 'beam', text: '{u} bursts into glitter. {t} will be finding it for years.' },
  buzz: { name: 'Buzz', type: 'bug', power: 40, anim: 'hop', text: '{u} buzzes right past {t}\'s ear. Then the other ear.' },
  bassdrop: { name: 'Bass Drop', type: 'electric', power: 65, anim: 'shout', text: 'The bass drops. {t} feels it in their teeth.' },
  sundown: { name: 'Golden Hour', type: 'fire', power: 55, anim: 'flame', text: 'The sun gets low and gold behind {u}. {t} is dazzled.' },
};

export const MF_ENEMIES = {
  glowstick: { faces: 'front', name: 'Glow Stick', type: ['electric', 'plastic'], stats: { hp: 52, attack: 54, defence: 48, speed: 72, special: 62 }, moves: ['glowsplash', 'flop'] },
  lostthong: { faces: 'front', name: 'Lost Thong', type: 'plastic', stats: { hp: 54, attack: 56, defence: 52, speed: 66, special: 40 }, moves: ['flop', 'dustup'], drop: ['feather', 0.2] },
  esky: { faces: 'front', name: 'Esky', type: ['water', 'plastic'], stats: { hp: 74, attack: 50, defence: 72, speed: 30, special: 50 }, moves: ['coldsnap', 'flop'], drop: ['icypole', 0.35] },
  gazebofoe: { faces: 'front', name: 'Runaway Gazebo', type: ['steel', 'park'], stats: { hp: 66, attack: 60, defence: 64, speed: 50, special: 44 }, moves: ['billow', 'peg'] },
  dustdevil: { faces: 'front', name: 'Dust Devil', type: 'dirt', stats: { hp: 56, attack: 64, defence: 48, speed: 76, special: 50 }, moves: ['dustup', 'billow'] },
  festfly: { name: 'Festival Fly', type: 'bug', stats: { hp: 44, attack: 50, defence: 40, speed: 86, special: 50 }, moves: ['buzz', 'dustup'] },
  glitterbomb: { faces: 'front', name: 'Glitter Bomb', type: 'fairy', stats: { hp: 56, attack: 50, defence: 50, speed: 62, special: 70 }, moves: ['sparkle', 'glowsplash'] },
  theboot: { faces: 'front', name: 'The Boot', type: 'leather', stats: { hp: 68, attack: 72, defence: 62, speed: 44, special: 40 }, moves: ['boot', 'flop'] },
  speakerstack: { faces: 'front', name: 'Speaker Stack', type: ['electric', 'steel'], stats: { hp: 78, attack: 66, defence: 70, speed: 30, special: 72 }, moves: ['bassdrop', 'glowsplash'] },
  sunsetfoe: { faces: 'front', name: 'Golden Hour', type: 'fire', stats: { hp: 60, attack: 62, defence: 54, speed: 60, special: 70 }, moves: ['sundown', 'dustup'] },
};
export const MF_FOE_TEXT = {
  glowstick: { appear: 'A glow stick snaps itself and leaps out of the dark!', leave: 'fades to a faint green and gives up.' },
  lostthong: { appear: 'A single lost thong flip-flops out of the grass. Its owner is long gone.', leave: 'flops off to find its other half.' },
  esky: { appear: 'An esky lid creaks open. Something cold inside does not want to share.', leave: 'clunks shut.' },
  gazebofoe: { appear: 'A gazebo tears free of its pegs and tumbles towards you!', leave: 'collapses in a heap. Somebody will be cross.' },
  dustdevil: { appear: 'A little whirlwind of paddock dust spins up out of nowhere!', leave: 'settles down into the dirt.' },
  festfly: { appear: 'A festival fly. It has been to every stage. It has been on every sausage.', leave: 'buzzes off to the food court.' },
  glitterbomb: { appear: 'A pouch of glitter bursts open. It is everywhere now. Forever.', leave: 'settles into your socks for good.' },
  theboot: { appear: 'A boot rises above the crowd. Then it turns and looks at you.', leave: 'is lowered with respect.' },
  speakerstack: { appear: 'A speaker stack thumps into life. The ground wobbles.', leave: 'cuts to silence. Everyone cheers anyway.' },
  sunsetfoe: { appear: 'The low sun flares gold right in your eyes!', leave: 'slips behind the hills.' },
};
export const MF_TRAINERS = {
  mfmankey: { name: 'Tom Mankeys Local', sendOut: 'Out comes a {f}.', team: [['glowstick', 21], ['theboot', 23]], money: 30 },
  mfhaybale: { name: 'Hay Bale Hamish', sendOut: 'A {f} rolls out of the hay.', team: [['dustdevil', 22], ['festfly', 23]], money: 30 },
  mfglitter: { name: 'Glitter Gwen', sendOut: 'She flings a {f}.', team: [['glitterbomb', 23], ['glowstick', 23]], money: 30 },
  mfcouchking: { name: 'The Couch King', sendOut: 'He produces a {f} from under a cushion.', team: [['theboot', 24], ['esky', 25]], money: 35 },
  mfbluecrew: { name: 'The Blue Drink Crew', sendOut: 'They pass forward a {f}.', team: [['esky', 22], ['lostthong', 22], ['glowstick', 23]], money: 40 },
};
// What jumps out of the long paddock grass. Levels follow your team.
export const MF_ENCOUNTERS = [
  { id: 'lostthong', lv: [18, 24], weight: 3 },
  { id: 'festfly', lv: [18, 24], weight: 3, day: true },
  { id: 'dustdevil', lv: [20, 26], weight: 2, day: true },
  { id: 'glowstick', lv: [20, 26], weight: 1, night: 4 },
  { id: 'esky', lv: [20, 26], weight: 2 },
  { id: 'glitterbomb', lv: [20, 26], weight: 1, night: 3 },
];

// ------------------------------------------------------------ the corner store
export const MF_ITEMS = {
  icypole: { name: 'Icy pole', price: 3, desc: 'A Heaven Eleven icy pole. Gone in thirty seconds in this heat.' },
  festpie: { name: 'Festival pie', price: 7, desc: 'A hot pie at 3am. Tastes better than any pie has ever tasted.' },
  hotchips: { name: 'Hot chips', price: 6, desc: 'Salty, hot and in a paper cone. Pets go silly for them.' },
  sunscreen: { name: 'Sunscreen', price: 9, gift: true, desc: 'SPF 50. Charlotte will check you have put it on. She will check twice.' },
  festsocks: { name: 'Dry socks', price: 8, gift: true, desc: 'The most valuable thing at any festival. Worth more than gold.' },
  electrolytes: { name: 'Electrolyte drink', price: 4, drink: true, art: { kind: 'can', body: '#3a7ad8', label: '#e8f0ff', cap: '#c8c8d0' }, desc: 'Cold, blue and full of salts. The morning after starts here.' },
  flamingo: { name: 'Pink Flamingo', price: 12, drink: true, art: { kind: 'cup', body: '#f26aa8', label: '#ffd0e4', cap: '#f5d03a' }, desc: 'The Pink Flamingo\'s own cocktail. Pink, cold and a little bit dangerous. Some people will swap anything for one.' },
  pegs: { name: 'Spare tent pegs', price: 0, story: true, art: { kind: 'packet', body: '#8a8e96', label: '#c8ccd4', cap: '#5a5e66' }, desc: 'A fistful of spare pegs from the Helper Hut. Gazebo Gary needs these.' },
};
export const MF_SHOPS = {
  heaveneleven: { name: 'Heaven Eleven', where: 'The Amphitheatre, Meredith', tabs: ['treats', 'gifts'], treats: ['icypole', 'festpie', 'hotchips', 'snag'], gifts: ['sunscreen', 'festsocks', 'electrolytes'] },
};

export const MF_PLACES = {
  mfreception: 'Wristbands, the bus stop and the red neon X of Tom Mankeys.',
  mfbush: 'Tents under the gums, the sportsfield toilets and a cinema in the bush.',
  mfamphi: 'The One and Only Stage, the couches, the lanterns, Heaven Eleven and the Red Tree.',
  mftop: 'The biggest camp, the Meredith Eye, the Helper Hut and our campsite.',
  mfsunset: 'South Bank food and the Sunset Strip, the best view of the sky.',
  mfbluegums: 'Blue Gums: tents in the trees and gazebos in the wind.',
  mfpines: 'South Pines, Highway to Hell Rd and the Outer Space paddock.',
  mfflamingo: 'A white marquee bar at the back of the Amphitheatre. Pink chairs, hay bales and Pink Flamingos.',
  mfstagefront: 'Right up the front of the One and Only Stage.',
  mfsunview: 'The view from the top of the Sunset Strip.',
};

// ------------------------------------------------------------ the story (words file)
export let MF_TEXT = {
  title: 'Meredith',
  // The day after the party: Jess texts about the charter bus.
  invite: [
    '*Your Pawphone buzzes. A message from Jess.*',
    'Jess: "MEREDITH!!! The charter bus leaves from Allen St. Everyone is coming. Leave the pets at home, it is no place for a dog. I have a surprise."',
    'The charter bus is parked on Allen St. Talk to the driver when you are ready to go.',
  ],
  busDriver: 'The charter bus driver checks a clipboard.',
  busAsk: 'Get on the charter bus to Meredith?',
  busYes: 'All aboard',
  busNo: 'Not yet',
  busNotYet: ['The bus is not going anywhere without you. Literally. You are on the list.'],
  busRide: [
    '*The charter bus rumbles out of Laverton. Every seat is taken by someone you know.*',
    'Paddy: "Right. Nobody call me Mayor this weekend. I am just Paddy. Festival Paddy."',
    'Corni: "Festival Paddy! Prost!" *Corni has a Guinness. It is 9am.*',
    'Mem: "I brought electrolytes, a hat and a book about mouse femurs. For the downtime."',
    'Jess: "And I brought... a surprise. You will see. Tonight. In my tent."',
    'Seb: "She has been talking about this surprise for six years. It is the portal. Everyone knows it is the portal."',
    'Jess: "It is NOT the portal." *It is the portal.*',
    '*Two hours later the bus pulls into a paddock full of gum trees, tents and dust. Meredith.*',
  ],
  stayHome: ['The pets are staying home with the twins, Trish and Gordon. A festival is no place for a dog. Probably.'],
  arriveCard: ['The Meredith Music Festival. One stage, three days, and a paddock full of friends.', 'Time moves slowly out here. The night only starts when the day is done.'],
  wristbandHint: 'Get your wristband from the volunteer at Reception.',
  wristband: [
    'Here you go. Wristband on. It stays on till Monday. Do not cut it off. People cut it off. Do not.',
    'Your crew is camping at Top Camp. Follow the High Road east and turn down the Long and Winding Road. You cannot miss the beard.',
  ],
  wristbandAgain: ['Wristband on? Good. Top Camp is east. Follow the beard.'],
  noLeave: ['The charter bus does not go back till the festival is over. You are here now. Embrace it.'],
  noLeaveYet: ['The bus home leaves once everyone, and every pet, is back together.'],
  needWristband: ['A volunteer in hi-vis waves you back. "Wristband first! Reception is just there."'],
  // Top Camp, setting up
  campHint: 'Find the crew at the Top Camp campsite.',
  campSeb: [
    'You made it! Welcome to the campsite. We have a gazebo, six chairs and a very strong opinion about couches.',
    'Your tent goes there, next to Jess. Do not put it next to Gabe. He snores like a tractor.',
    'Gabe: "I do not snore." *He absolutely snores.*',
  ],
  tentSpot: ['Your patch of grass, next to Jess. Your tent is still in its bag.'],
  pitchAsk: 'Pitch your tent?',
  pitchYes: 'Pitch it',
  pitchIntro: ['Four pegs, one at each corner. Press A (or tap Hammer) when the marker is in the green. Ready?'],
  pitchBar: 'Peg {n} of 4. Hit it in the green!',
  pitchGood: ['*Four perfect pegs. The tent goes up tight as a drum.*', 'Seb: "Look at that! Best tent in Top Camp. Nobody is touching that in a storm."'],
  pitchCrappy: ['*The pegs go in at funny angles. The tent sags in the middle and leans to the left.*', 'Gabe: "It has character. That is what we will say. It has character."'],
  pitched: ['Your tent is up.'],
  couchHint: 'Help Gabe carry the couch down to the Amphitheatre.',
  couchGabe: [
    'Right. The couch. It is a beauty. Cream cushions, wooden arms, and a little bar on the back for your drinks.',
    'You take that end, I will take this end, and we walk it down to the Amphitheatre. Charlotte is holding the spot.',
  ],
  couchAsk: 'Grab an end of the couch?',
  couchYes: 'Lift with the legs',
  couchCarry: 'Carry the couch to Charlotte at the Amphitheatre.',
  couchArrive: [
    'Charlotte: "There you are! Down, down, down. Perfect. Right on the hill, right in front of the lanterns."',
    'Gabe: "The couch. We are home."',
    '*You all sink into the couch. Somewhere behind the gums, the sun starts to drop.*',
  ],
  nightFalls: ['*The sky goes pink, then purple. One by one, the lanterns over the Amphitheatre glow.*', 'Night one at Meredith has started.'],
  nightCard: ['The lanterns are on and the crowd is pouring in.', 'Jess says the portal is ready. Meet her at the campsite.'],
  portalHint: 'Meet Jess back at the campsite for the portal demo.',
  // The portal goes wrong
  portal: [
    'Jess: "Okay! Everybody gather round! Behold. The Pet Portal."',
    '*It is about the size of a shoebox: a ring of fairy lights, a very large battery and a little purple spiral, humming.*',
    'Jess: "Pop it in your tent, and at bedtime it finds your pets, wherever they are, and brings them to you for cuddles. No setup."',
    'Seb: "Does it detect just YOUR pets or..."',
    'Jess: "It auto-detects pets! Watch. Toby is at home with my housemate. Three, two, one..."',
  ],
  portalToby: [
    '*WHOMP WHOMP ZAP. A little black poodle tumbles out of the spiral and lands on the grass.*',
    'Jess: "TOBY! Ta-da!" *The whole campsite claps. Toby sneezes. A tiny spark jumps off his nose.*',
  ],
  portalWrong: [
    '*The fairy lights go red. The battery starts to hum. Then whine. Then scream.*',
    'Jess: "That is not a noise it made in testing."',
    '*The spiral spins faster and faster. WHOMP. Something small and furry shoots out of it. WHOMP. Then another. WHOMP WHOMP WHOMP.*',
    'Helen: "Wait. Was that {pet}? That was {pet}! They are meant to be at home!"',
    'Jess: "It is detecting ALL the pets. Every pet I have ever met. All the way back in Melbourne."',
    '*ZAP. The pets come out so fast they fly straight up, high into the night sky, in every direction.*',
    '*Little shapes sail over the gums, over the stage, over the Eye. Then they are gone.*',
  ],
  portalAfter: [
    'Jess: "Okay. Okay okay okay. So. Some small bugs."',
    'Jess: "Toby is tuned to the portal now. Look at his curls. He will help you find them. Take him."',
    'Seb: "Right. Everyone split up. Ask around. They are out there somewhere. And have a good time doing it, we are at Meredith."',
  ],
  tobyJoins: 'Toby has joined your team for the festival! He is a little bit electric now.',
  huntHint:'Find the scattered pets around the festival. {n} still out there.',
  huntToast: 'Ask around about the missing pets. Check your Pawphone To Do list.',
  // Asking around: everyone at the festival has seen something.
  rumour: {
    wild: 'I saw {pet} round {place}. Looked a bit wild. Wired, almost. Like it needed a play-fight.',
    goer: 'Someone round {place} has a pet who looks a lot like {pet}. They are calling it theirs.',
    crowd: '{who} texted. They have got {pet}! They are somewhere in the crowd at {place}. Good luck finding them.',
    dance: '{pet}? Last I saw, {who} had them at the Pink Flamingo. {who} wants a dance off.',
    eye: '{pet} is riding the Meredith Eye at Top Camp. Round and round. The operator cannot get them off.',
    quest: '{who} at {place} has {pet}. They want something before they hand them back.',
  },
  placeName: {
    mfreception: 'Reception, near Tom Mankeys', mfbush: 'Bush Camp', mfamphi: 'the Amphitheatre', mftop: 'Top Camp',
    mfsunset: 'the Sunset Strip', mfbluegums: 'Blue Gums', mfpines: 'South Pines', mfflamingo: 'the Pink Flamingo',
  },
  // The To Do list during the hunt: one line per pet, more specific once someone has told you.
  todoUnknown: 'Find {pet}. Ask around the festival.',
  todo: {
    wild: 'Calm {pet} down with a play-fight ({place})',
    goer: 'Beat {who} to get {pet} back ({place})',
    crowd: 'Find {who} in the dark crowd with {pet} (ask Charlotte at the couch)',
    dance: 'Win a dance off with {who} for {pet} ({place})',
    eye: 'Spin the Meredith Eye till {pet}\'s seat comes up (Top Camp)',
    quest: 'Bring {who} {item} for {pet} ({place})',
  },
  todoPrincess: 'Princess is out there somewhere too. Nobody has seen her yet.',
  // The Meredith Eye
  eyeBar: 'Seat {n} of 12...',
  eyeRewardCash: 'There is ${cash} down the back of the seat.',
  eyeFoes: ['A {f} is sitting in the seat and will not get off. It wants a play-fight.', 'A {f} has been riding the Eye all night. It is very dizzy and very cross.'],
  eyeWorn: ['Your pets are worn out. Have a lie down in your tent at the campsite first.'],
  // Quests
  questHave: 'Give {who} the {item}?',
  questGive: 'Hand it over',
  questKeep: 'Not yet',
  // The Pink Flamingo bar
  barSign: ['The Pink Flamingo bar. A big pink jug of Pink Flamingos sits on the counter.'],
  barAsk: 'A Pink Flamingo is ${price}.',
  barDrink: 'Drink it now',
  barTake: 'Take it with you',
  barNo: 'Just looking',
  barBroke: ['You do not have enough money for a Pink Flamingo.'],
  barDrunk: ['*You drink the Pink Flamingo. It is very pink. Everything feels a bit stronger and a bit faster.*', 'Your team is powered up for the rest of the night.'],
  barAlready: 'You have already had one tonight. Charlotte would not approve of another.',
  barTook: 'A Pink Flamingo, to go. Somebody out there might want it more than you.',
  noCouncil: ['Helen, I don\'t want to talk about council at Meredith! I am here to relax, not think about Lesley.'],
  heavenSign: ['Heaven Eleven. Open all day and all night. Ice, sunscreen, socks and pies.'],
  wildPet:['{name} spins round, crackling with purple sparks from the portal.', '{name} does not seem to know who you are. A play-fight should shake it loose.'],
  wildAsk:'Play-fight {name}?',
  wildBack:['The purple sparks fizzle out. {name} blinks, sees you, and runs straight into your arms.'],
  wildLose:['{name} bolts off, still crackling. It does not go far.'],
  heldPet: ['{name} is on a lead held by {who}.', 'Talk to {who} about it.'],
  crowdPet:['{name} is not here. Someone in the crowd must have them.'],
  crowdStart: ['Charlotte: "{who} texted. They have got {pet}, somewhere in the crowd! But it is pitch black in there. Take my torch."', '*Walk through the crowd. Only the people near your torch light up.*'],
  crowdFound: ['There you are! I have been holding {pet} up in the air for twenty minutes.', '*{who} hands {pet} over. Big hugs all round.*'],
  crowdMissed:'You give Charlotte her torch back. Ask her at the couch to try again.',
  crowdBar: 'Find {who} in the dark. Shine the torch around.',
  crowdMoved: '{who} has wandered somewhere else in the crowd.',
  danceIntro: ['You want {pet}? Then you dance for {pet}.', 'Copy my moves. Arrow keys, or the buttons. Ready?'],
  danceAsk: 'Dance off?',
  danceYes: 'Let\'s dance',
  danceNo: 'Warm up first',
  danceWin: ['*The crowd on the Pink Flamingo turf goes off.*', 'Okay. Okay! You can dance. Take {pet}. Come back and dance with me any time.'],
  danceLose: ['Not bad. Not good either. Come back when your feet are awake.'],
  danceBar: 'Dance off: move {n} of 8. Copy the arrow! {got}/{need} to win',
  petBack:'{name} is back on your team!',
  restAsk: 'Your tent. Have a lie down?',
  restYes: 'Quick kip (rest the pets)',
  restNo: 'Not now',
  rested: ['You crawl into the tent for a kip. Everyone feels better. Mostly.'],
  campSwap: 'Bring {name} along?',
  campSwapYes: 'Join the team',
  campSwapWho: 'Who goes back to the campsite?',
  campBack: '{name} flops down at the campsite with Jess.',
  campFull: '{name} is waiting at the campsite with Jess. Your team is full.',
  crowdName: 'Festival goer',
  campPets: 'Pets you have found who are not on your team hang out at the campsite with Jess.',
  lost: ['Your pets are worn out. You head back to the campsite for a lie down in the tent.'],
  allBack: [
    'Jess: "That is everyone! Every single one! I am never building anything ever again."',
    'Seb: "You will build something again by Tuesday."',
    'Jess: "I will build something again by Tuesday."',
  ],
  mamaCall: ['Nathan: "Guys, Mama King, my favourite band, is on next! We can\'t miss them."'],
  mamaHint: 'Meet everyone at the couch in the Amphitheatre for Mama King.',
  mamaKing: [
    '*You push right up the front. The lights come up warm and gold. It is Mama King.*',
    'Mama King Singer: "Good evening Meredith! Who wants to DANCE?"',
    'Nathan: "This is the one! Everybody dance! Copy me!"',
  ],
  mamaDance: 'Dance to Mama King',
  mamaBar: 'Mama King: move {n} of 10. Copy the arrow! {got} so far',
  mamaWin: ['*The whole crowd is dancing. Nathan has his arms in the air. Even Charlotte is dancing.*', 'Nathan: "BEST. SET. EVER."'],
  mamaOk: ['*You dance like nobody is watching. Lots of people are watching. Nobody minds.*', 'Nathan: "That was amazing. You were... enthusiastic."'],
  mamaBye: ['Mama King Singer: "Thank you Meredith! You have been beautiful!"', '*The lights go down. A boot goes up somewhere at the back.*'],
  iceHint: 'Watch the Ice Kids close night one at the Amphitheatre.',
  iceKids: [
    'Jordan: "Ice Kids are next! I am SO excited. I have been waiting all year for this."',
    '*The lanterns go out. The whole Amphitheatre goes quiet.*',
    '*Then the strobes start. White light, black, white, black. Lasers cut across the crowd.*',
    '*Two figures walk onto the stage in a cold blue light. It is the Ice Kids.*',
    '*The first chord is so cold your breath fogs. Frost creeps across the stage.*',
  ],
  iceCurse: [
    'Ice Kids Singer: "Meredith. You have had your fun. Now you get what you deserve."',
    '*She raises her hands. Blue lightning cracks out of the speakers and across the sky.*',
    '*The stage splits open. Dark shapes in bucket hats and cargo shorts come pouring out of it, shoving and yelling.*',
    'Seb: "Oh no. Those are dickheads. Hundreds of them."',
  ],
  iceAfter: [
    '*The Ice Kids are gone. The stage is empty, and covered in ice.*',
    'Gabe: "They have cursed the festival. The Dickheads will take over by tomorrow."',
    'Jess: "We are doomed. Completely doomed."',
  ],
  sunNotice: [
    'A festival goer: "Hey. Is the sky getting lighter over there?"',
    'Seb: "What the hell, it\'s sunrise already? I guess time flies when you\'re having fun..."',
    'Mem: "Quick, let\'s go to the Sunset Strip to watch!"',
  ],
  sunriseHint: 'Watch the sunrise with everyone at the Sunset Strip.',
  sunrise: [
    '*The whole crew sits on the hill at the Sunset Strip. The sky over the paddocks starts to glow orange.*',
    'Gabe: "Here it comes. Meredith sunrise. Best thing you will ever see."',
    '*The glow gets brighter. And brighter. It is rising very fast for a sun.*',
    'Mem: "That is not the sun."',
    '*Over the horizon rises an enormous, blazing, glowing poodle, wreathed in flame and wearing a crown.*',
    'Helen: "...Princess?"',
  ],
  princessPulled: ['*One little pink shape flies much further than the others, out past the paddocks. Nobody sees where it lands.*'],
  princessLands: [
    '*The Flame Queen floats down off the horizon and lands right in your arms, still glowing. It is Princess.*',
    'Jess: "The portal! It must have pulled her in from Melbourne with everyone else. She has been out past the paddocks all night."',
  ],
  princessEvolved: ['Helen: "She looks different. She must have evolved."'],
  princessTeam: 'Princess joins your team.',
  goodnight: ['Helen: "Well. At least I have my dog. Time to sleep. We can deal with these dickheads tomorrow."'],
  sunriseCard: ['The Ice Kids have cursed Meredith, and the Dickheads are coming.', 'But Princess is back. What is happening back in Melbourne?', 'To be continued in part 2: the twins.'],
  afterSunrise: ['*You wake up in the tent around lunchtime with Princess curled up on your feet.*', 'For now, the bus home is waiting at Reception.'],
  busHomeAsk: 'Take the charter bus home?',
  busHome: ['*Everyone piles onto the charter bus. Within five minutes, the whole bus is asleep.*', 'Your pets are back home on Allen St, safe and sound.'],
  glimpse: ['*Something small and spiky trundles across the path in the dark, glowing faintly. Then it is gone.*', 'A festival goer: "Did you see that? The Meredith echidna! It is real!"'],
  legend: [
    'They say the old echidna on the Meredith posters is real. Comes out once a festival.',
    'My mate swears there is a glowing echidna under the Red Tree at 4am. Swears it.',
    'The legends say the festival pets only show themselves to people with no dickhead in them.',
    'Ever seen the echidna? No? Then you have never really been to Meredith.',
  ],
  // What the Melbourne crew say at the festival
  friends: {
    paddy: ['Festival Paddy, reporting for duty. Nobody here knows I am the mayor. Lovely.', 'Someone asked me to fix a pothole on the Low Road. Even here.'],

    mem: ['Did you know mice can run four kilometres a night? I am doing my own study. In this crowd.', 'Electrolyte? I have twelve.'],
    corni: ['In Germany we have festivals with beer. Here, festivals with beer AND a couch. Wunderbar.', 'I ran the Low Road this morning. Twice. Prost!'],
    rose: ['I brought three books. I have read two of them. In the queue for the toilets.', 'The senator thinks I am at a wellness retreat. This is a wellness retreat.'],
    nathan: ['Rusty is home in his jumper. I brought a spare jumper anyway. For me.', 'Tall people go to the back of the crowd. That is the rule. I follow it.'],
    alison: ['I brought my boob pillows. For the couch. They are very comfortable. Do not make it weird.', 'I made a toastie on a camp stove. It is the same toastie. It is always the same toastie.'],
    olly: ['Gazebo pegs need to go in at forty-five degrees. Nobody listens. Then the wind comes.', 'Lovely red gums out here. Old ones. Older than the festival.'],
    ward: ['Every dog here is a good dog. I have checked. I have checked a lot of them.', 'I packed treats for every pet. Then the portal took the pets. I still have the treats.'],
    betty: ['I made a lasagne. On a camp stove. In a paddock. Have some, love.', 'You look hungry. Everyone at a festival looks hungry.'],
    james: ['Heaven Eleven charges four dollars for an icy pole. I charge three. I am not saying anything.', 'Milk bar people do not take holidays. We just stand in different shops.'],
    sinead: ['Mango Ice and a sunset. That is self care.', 'Social work tip: drink water, sit down, and let someone else hold the couch.'],
    jordan: ['I brought the guitar. I have been asked to play Wonderwall four times. I have refused four times.', 'One day I will be on that stage. Today I am on the couch.'],
    tim: ['One stage. Everyone together. No clashes. Like a union meeting, but with lanterns.', 'There is a train station in Meredith, you know. Closed now. Tragic.'],
    adam: ['Chloe would love it out here. Paddocks for days.', 'We got the best camping spot. We have been up since 5am. Worth it.'],
    chelsea: ['I brought the good sunscreen. And the bad sunscreen. In case.', 'Adam set up the tent in four minutes. He is very proud. Ask him about it.'],
  },
  festLines: [
    'Is this the line for the toilets or the line for the pies? Either way, I am in it.',
    'No dickheads! That is the policy. I love this place.',
    'Have you seen my mate? About this tall, wearing a hat. Everyone is wearing a hat.',
    'I have been on the couch for six hours. I am not moving. The couch is my home.',
    'Boot up! Boot up for the band!',
    'The lanterns! Look at the lanterns!',
    'I lost my thong in the paddock. I will find it in 2031.',
    'I came for one band and stayed for the Pink Flamingo.',
    'Is it Saturday? It feels like Saturday. It might be Sunday.',
    'Heaven Eleven has hot pies at 3am. That is the only thing I know for certain.',
    'Toilet queue update: long. Toilet update: fine, actually.',
    'Someone said there is a portal at Top Camp. Is that a band?',
  ],
};
MF_TEXT = authoredValue('data/meredith.js', 'MF_TEXT', MF_TEXT);
