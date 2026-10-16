// ============================================================
//  FISHING. Everything about fish, rods, the fishing skill and the Coburg
//  Lake fishing comp in one file, merged into the main tables when they load
//  (like north.js):
//
//   FISHING_ITEMS     -> ITEMS (items.js)       fish, junk, the cup, the golden lure
//   FISHING_ITEM_ART  -> ITEM_ART (art/paint/items.js)
//   FISHING_RODS      -> UPGRADES (upgrades.js)  rods are bought once, like tools
//   FISHING_NPCS      -> NPCS (npcs.js)          Ross Millward, scout leader
//   FISHING_PEOPLE    -> PEOPLE (dialogue.js)    his words
//   FISHING_FRIENDS   -> FRIENDS (friends.js)    his tastes
//
// The rules of a fight are in systems/fishing.js, the trip and the comp in
// systems/fishing-trip.js, the screen in ui/fishing.js.
//
// FISH: every catch. tier 0 cheap and easy, 1 uncommon, 2 rare (needs the
// second rod), 3 the best (needs the third rod). fight: [speed, dart] (how
// hard it pulls, how often it darts); zone: how wide the green zone is (0 to 1,
// smaller is harder); cm and kg: size range (the same roll sets both).
// Australian spelling, no em dashes, lines under about 140 characters.

export const FISH = {
  carp:        { tier: 0, fight: [0.84, 0.2], zone: 0.3,   cm: [25, 70],   kg: [0.4, 3.5] },
  yabby:       { tier: 0, fight: [0.95, 0.7], zone: 0.24,  cm: [6, 18],    kg: [0.02, 0.15] },
  redfin:      { tier: 0, fight: [1.05, 0.5], zone: 0.18,  cm: [18, 45],   kg: [0.1, 1.2] },
  eel:         { tier: 1, fight: [1.35, 0.9], zone: 0.12,  cm: [40, 110],  kg: [0.3, 2.5] },
  blackfish:   { tier: 1, fight: [1.25, 0.7], zone: 0.14,  cm: [20, 35],   kg: [0.2, 1.0] },
  goldenperch: { tier: 1, fight: [1.3, 0.6],  zone: 0.13,  cm: [30, 55],   kg: [0.5, 3.0] },
  browntrout:  { tier: 2, fight: [1.45, 0.9], zone: 0.115, cm: [35, 65],   kg: [0.6, 3.5] },
  bass:        { tier: 2, fight: [1.5, 1.0],  zone: 0.11,  cm: [25, 50],   kg: [0.4, 2.5] },
  ghostcarp:   { tier: 3, fight: [1.6, 1.2],  zone: 0.1,   cm: [50, 90],   kg: [3, 12] },
  murraycod:   { tier: 3, fight: [1.65, 0.9], zone: 0.1,   cm: [60, 120],  kg: [4, 25] },
  oldboot:     { tier: 0, junk: true, fight: [0.7, 0], zone: 0.4, cm: [28, 31], kg: [0.6, 0.9] },
  soggymyki:   { tier: 0, junk: true, fight: [0.6, 0], zone: 0.45, cm: [8, 8], kg: [0.01, 0.01] },
};
// Which rod a tier needs (1 the first rod, 2 the carbon rod, 3 the Pro).
export const rodFor = id => Math.max(1, FISH[id]?.tier || 0);
// Fishing skill XP for landing one, and for losing one (you still learn).
export const FISH_XP = { tiers: [12, 22, 40, 70], junk: 4, lost: 3 };
// After this many fish (not junk) in one spot, it is fished out until tomorrow.
export const DAILY_FISH = 4;

// What you can catch where: [item, weight]. Junk weighs half (you always use bait).
// A fish your rod cannot handle still bites, but it snaps the line.
export const FISH_TABLES = {
  lake:       [['redfin', 40], ['carp', 35], ['eel', 10], ['goldenperch', 6], ['bass', 3], ['murraycod', 1], ['oldboot', 15], ['soggymyki', 5]],
  wetlands:   [['yabby', 40], ['eel', 20], ['carp', 20], ['blackfish', 8], ['browntrout', 3], ['oldboot', 15]],
  altona:     [['carp', 35], ['eel', 15], ['yabby', 10], ['goldenperch', 5], ['bass', 3], ['ghostcarp', 1], ['oldboot', 40], ['soggymyki', 10]],
  coburglake: [['carp', 35], ['redfin', 25], ['eel', 12], ['blackfish', 8], ['goldenperch', 6], ['browntrout', 4], ['bass', 2], ['murraycod', 1], ['ghostcarp', 1], ['oldboot', 15]],
  default:    [['carp', 50], ['yabby', 20], ['oldboot', 30]],
};

// ------------------------------------------------------------ items
export const FISHING_ITEMS = {
  bait:        { name: 'Bait', price: 2, farm: true, bait: true, desc: 'A tub of wriggly worms. One tub per cast.' },
  // The cheap, easy ones sell for less now.
  carp:        { name: 'Carp', sell: 3, fish: true, desc: 'A pest, honestly. Still counts as a fish.' },
  yabby:       { name: 'Yabby', sell: 4, fish: true, desc: 'A little freshwater crayfish. Pinchy.' },
  redfin:      { name: 'Redfin', sell: 8, fish: true, desc: 'Stripy, spiky and good eating. Cats go feral for it.' },
  eel:         { name: 'Shortfin eel', sell: 18, fish: true, desc: 'Slippery and ancient. Eels have lived in Melbourne creeks forever.' },
  blackfish:   { name: 'River blackfish', sell: 20, fish: true, desc: 'Shy, slimy and dark as a creek at midnight. Hides under snags all day.' },
  goldenperch: { name: 'Golden perch', sell: 24, fish: true, desc: 'A yellowbelly. Gold on the sides, and it knows it.' },
  browntrout:  { name: 'Brown trout', sell: 45, fish: true, desc: 'Spotty, clever and very fussy about bait. Needs a carbon rod to land.' },
  bass:        { name: 'Australian bass', sell: 50, fish: true, desc: 'Fights like it has somewhere to be. Needs a carbon rod to land.' },
  ghostcarp:   { name: 'Ghost carp', sell: 90, fish: true, desc: 'Pale gold and huge. Kostas says it is a creek legend. Only a Pro rod holds it.' },
  murraycod:   { name: 'Murray cod', sell: 120, fish: true, desc: 'The big one. Older than your house and grumpier. Only a Pro rod holds it.' },
  snapper:     { name: 'Snapper', sell: 35, fish: true, desc: 'A pink snapper from the bay. Ardi caught it off Altona pier and insists you have it.' },
  oldboot:     { name: 'Old boot', sell: 1, junk: true, desc: 'Size 11. Full of pond water. Someone, somewhere, is limping.' },
  soggymyki:   { name: 'Soggy myki', sell: 1, junk: true, desc: 'Somebody\'s myki. Still has $1.20 on it. Still will not touch on.' },
  // The comp's prizes.
  fishtrophy:  { name: 'Coburg Lake Fishing Cup', story: true, trophy: true, desc: 'A small silver cup on a wooden base. Ross polished it with his scarf.',
    trophyText: 'Coburg Lake Fishing Cup. First place, awarded by Ross Millward, 1st Coburg Scouts.' },
  goldenlure:  { name: 'Golden lure', story: true, equipment: 'tackle', ease: 0.08, desc: 'Ross\'s own lucky lure, for the comp winner. Fish fight a little less.' },
};

// ------------------------------------------------------------ rods
// Rods are bought once at Anaconda, like garden tools (state.data.upgrades).
// fishLevel: the fishing level Bazza wants to see before he sells it.
// needs: the rod you must already own. rodTier: which fish it can hold.
export const FISHING_RODS = {
  rod:  { name: 'Fishing rod', short: 'a rod', price: 60, tool: true, fishing: true, equipment: 'rod', rodTier: 1, desc: 'Cast off at Edwardes Lake, Edgars Creek, Coburg Lake or Kororoit Creek. Face the water and press A.' },
  rod2: { name: 'Carbon fibre rod', short: 'carbon rod', price: 180, tool: true, fishing: true, equipment: 'rod', rodTier: 2, fishLevel: 3, needs: 'rod', desc: 'Light and strong. Holds brown trout and bass, and fights a little easier.' },
  rod3: { name: 'Pro graphite rod', price: 450, tool: true, fishing: true, equipment: 'rod', rodTier: 3, fishLevel: 5, needs: 'rod2', desc: 'Bazza\'s pride and joy. The only rod that can hold a Murray cod or the ghost carp.' },
};

// ------------------------------------------------------------ equipment slots
// Anything with `equipment: '<slot>'` (an item, or a rod in UPGRADES) shows
// in the Bag's Equipment tab under its slot. Pet gear is listed there too.
export const EQUIPMENT_SLOTS = {
  rod: 'Rods',
  tackle: 'Tackle',
  clothing: 'Clothing',
  weapon: 'Weapons',
};

// ------------------------------------------------------------ the comp
// The Coburg Lake Fishing Comp: Sundays 7am to noon, once a week. You enter
// once you have shown Ross a rare fish (tier 2 or better). Ross hands out the
// bait; you get COMP.seconds of real time to land what you can. Total weight
// wins, against three rivals.
export const COMP = {
  day: 'Sunday', from: 7, to: 12,
  seconds: 150,
  minTier: 2,
  rivals: [
    { name: 'Kostas', kg: [3, 9] },
    { name: 'Nonno Sal', kg: [2, 7] },
    { name: 'Ruby the scout', kg: [1, 5] },
  ],
  prizes: [100, 40, 15],
  firstPrize: ['fishtrophy', 'goldenlure'],   // the first win only; later wins are money
};

// ------------------------------------------------------------ Ross
export const FISHING_NPCS = {
  ross: {
    name: 'Ross Millward',
    look: { hair: '#8a6a44', hairStyle: 'short', skin: '#f0c4a0', shirt: '#c8b07a', collar: '#a8905a', scarf: '#2a6a9a', pants: '#7a6a44', shoes: '#4a3420', hat: '#9a7a4a', moustache: '#8a6a44', bumbag: '#5a6a3a' },
  },
};

export const FISHING_PEOPLE = {
  ross: {
    role: 'Scout leader, 1st Coburg Scouts. Runs the Coburg Lake Fishing Comp',
    lines: [
      ['Ross Millward, 1st Coburg Scouts. Be prepared! I have three spare hooks, a whistle and a muesli bar on me at all times.'],
      ['The woggle holds the scarf. The scarf holds the scout. That is the whole system.'],
      ['Carp are a pest here. Every carp out of the Merri Creek is a good deed. I count those for the badge.'],
      ['Knots! Clinch knot for the hook, bowline for the boat. The granny knot is for people who like losing fish.'],
      ['Bazza at Anaconda sells a lovely carbon rod. He only sells it to people who can handle it. Quite right.'],
    ],
    heartScenes: {
      3: ['Ross ties you a perfect clinch knot, then unties it, then makes you do it. Twice. "Now you will never lose a fish to a knot."'],
      6: ['Ross shows you a faded photo: him at twelve, holding a carp almost as big as him. "My first comp. Came last. Best day ever."'],
    },
  },
};

// Ross's words for the comp, in systems/fishing-trip.js.
export const ROSS = {
  ask: 'Ask about the fishing comp',
  about: [
    '"The Coburg Lake Fishing Comp! Sunday mornings, 7 till noon. Total weight wins. I blow the whistle."',
    '"But I only take serious anglers. Bring me something rare: a brown trout or an Australian bass. You need a carbon rod for those."',
  ],
  show: 'Show Ross a rare fish',
  shown: f => [`Ross gasps. "A ${f}! In my lake! Well, near my lake."`, 'He writes it in a little notebook, hands it back, and pins a badge on you. "You are in. Sunday mornings, 7 till noon."'],
  notRare: '"Lovely, but I need to see something rare. A brown trout or a bass. Bazza\'s carbon rod will hold them."',
  enter: 'Enter the fishing comp',
  wrongDay: '"The comp is on Sunday mornings, 7 till noon. Bring your rod. I bring the bait and the whistle."',
  late: '"That is it for the comp this week. Lines are in. See you Sunday at 7!"',
  done: '"You have had your go this week. Come back next Sunday!"',
  rules: secs => [`"Rules! ${Math.round(secs / 60 * 10) / 10} minutes on the clock. I supply the bait. Total weight wins. Carp count. Boots do not."`, 'He blows his whistle. Very, very loudly.'],
  hooter: 'Ross blows the whistle. Lines in! Off to the scales.',
  results: 'Ross reads the results off his clipboard.',
  first: 'Ross shakes your hand so hard the scarf comes loose. "First place! A true scout spirit!"',
  firstPrize: 'He hands over the Coburg Lake Fishing Cup and his own golden lure. "That lure has never let me down. Mostly."',
  placed: n => `"${['First', 'Second', 'Third', 'Fourth'][n]} place! Well done. Next Sunday, eh?"`,
  last: '"Fourth! Everyone who fishes wins. That is not true, but it is nice to say."',
  noRod: '"You will need a rod for the comp. I supply the bait, not the rods. Bazza at Anaconda."',
};

export const FISHING_FRIENDS = {
  ross: { loves: ['thermos', 'headtorch', 'redfin'], likes: ['snag', 'icedcoffee', 'carp', 'browntrout'], dislikes: ['vb', 'oldboot'] },
};

// ------------------------------------------------------------ icons
// 12x12 rows centred in a 16x16 texture, like art/paint/items.js.
const FISH_ROWS = ['............', '............', '....kkkkk...', '..kkbbbbbk.k', '.kebaaaaaakk', 'kaaaaaaaaaak',
  '.kaaaaaaaakk', '..kkaaaakk.k', '....kkkk....', '............', '............', '............'];
const SPOT_ROWS = ['............', '............', '....kkkkk...', '..kkbbsbbk.k', '.kebasaasakk', 'kaasaaasaaak',
  '.kaaasaasakk', '..kkasaakk.k', '....kkkk....', '............', '............', '............'];
const BIG_ROWS = ['............', '...kkkkkk..k', '.kkbbsbbbkkk', 'kebasaasaaak', 'kaaasaaasaak', 'kaasaaasaakk',
  '.kkaasaaakkk', '...kkkkkk..k', '............', '............', '............', '............'];
const ROD_ROWS = ['..........kk', '.........kw.', '........k.w.', '.......k..w.', '......k...w.', '.....k....w.',
  '....k.....w.', '..rrk.....e.', '..rb.......', '.kk.........', 'kk..........', '............'].map(r => r.padEnd(12, '.'));
export const FISHING_ITEM_ART = {
  blackfish: { pal: { a: '#2a2a26', b: '#4a4a40', k: '#0e0e0a', e: '#f4efe0' }, rows: FISH_ROWS },
  goldenperch: { pal: { a: '#d8b03a', b: '#f0d878', k: '#6a5016', e: '#1e1e1e' }, rows: FISH_ROWS },
  browntrout: { pal: { a: '#9a7a4a', b: '#d8c090', s: '#3a2a1a', k: '#4a3418', e: '#1e1e1e' }, rows: SPOT_ROWS },
  bass: { pal: { a: '#7a8a7a', b: '#c8d0c0', k: '#2a3a2a', e: '#c8443a' }, rows: FISH_ROWS },
  ghostcarp: { pal: { a: '#f0e8c8', b: '#fff8e0', s: '#e8a040', k: '#8a7a50', e: '#1e1e1e' }, rows: BIG_ROWS },
  murraycod: { pal: { a: '#5a7a3a', b: '#a8c078', s: '#2a3a1a', k: '#1e2a10', e: '#f4efe0' }, rows: BIG_ROWS },
  snapper: { pal: { a: '#e8707a', b: '#f8b8b8', s: '#5ab0e8', k: '#8a2a3a', e: '#1e1e1e' }, rows: SPOT_ROWS },
  soggymyki: { pal: { a: '#1e1e22', b: '#8ac83a', k: '#0a0a0a', w: '#f4f4f0', u: '#7ab0d8' }, rows: [
    '............', '............', '.kkkkkkkkkk.', '.kaaaaaaaak.', '.kabbbbaaak.', '.kaaaaaaaak.',
    '.kaaaaaawwk.', '.kaaaaaaaak.', '.kkkkkkkkkk.', '..u...u.....', '.....u......', '............'] },
  fishtrophy: { pal: { a: '#c8ccd4', b: '#f4f4f8', k: '#5a5e6a', d: '#6a4a2a' }, rows: [
    '............', '.kkkkkkkkkk.', 'kkaabaaaaakk', 'k.kabaaaak.k', '.kkaaaaaakk.', '...kaaaak...',
    '....kaak....', '.....kk.....', '....kaak....', '...kkkkkk...', '...kddddk...', '...kkkkkk...'] },
  goldenlure: { pal: { a: '#e8b830', b: '#fff0a0', k: '#7a5a10', e: '#c8443a' }, rows: [
    '............', '............', '.....kkk....', '...kkaabkk..', '..kaaabaaak.', '.kaeaaaaaakk',
    '..kaaaaaak.k', '...kkaakk...', '.....k......', '....k.k.....', '.....k......', '............'] },
  rod: { pal: { k: '#6a4a2a', r: '#b8bcc4', b: '#5a5e66', w: '#e8e4dc', e: '#c8443a' }, rows: ROD_ROWS },
  rod2: { pal: { k: '#2a2a30', r: '#c8443a', b: '#7a2018', w: '#e8e4dc', e: '#c8443a' }, rows: ROD_ROWS },
  rod3: { pal: { k: '#3a5a8a', r: '#e8b830', b: '#7a5a10', w: '#e8e4dc', e: '#e8b830' }, rows: ROD_ROWS },
};
