// ============================================================
//  BRUNSWICK EAST. Everything the suburb adds: its people, words,
//  shops, items, wild things and trainers.
// ============================================================
//
// Kept in one file (rather than spread through npcs.js, dialogue.js and the
// rest) so it merges cleanly with work on other suburbs. Each table below is
// merged into the main one of the same kind when that file loads:
//
//   EAST_NPCS     -> NPCS (npcs.js)          looks, shop, daily gift
//   EAST_PEOPLE   -> PEOPLE (dialogue.js)    role, lines, hints, heartScenes, helpsInBattle, battle
//   EAST_FRIENDS  -> FRIENDS (friends.js)    loves / likes / dislikes, rewards, assist
//   EAST_SHOPS    -> SHOPS (shops.js)
//   EAST_ITEMS    -> ITEMS (items.js)        icons in src/art/paint/brunseast.js
//   EAST_ENEMIES  -> ENEMIES, EAST_FOE_TEXT -> FOE_TEXT, EAST_TRAINERS -> TRAINERS (enemies.js)
//   EAST_PLACES   -> PLACES (dialogue.js)    zone taglines
//
// The real places are Holmes St (Adam's unit), 199 Nicholson St (where Helen
// and Paddy used to live), the Nicholson St milk bar strip, Fleming Park and
// the Brunswick Bowls Club. Everyone here is made up, apart from Adam, who is
// a real friend of the owner: keep him affectionate.
//
// Australian spelling, no em dashes, lines under about 140 characters.

// ------------------------------------------------------------ people
export const EAST_NPCS = {
  adam: {
    name: 'Adam', gift: 'cannoli',
    look: { hair: '#3a2416', hairStyle: 'short', skin: '#f0c8a8', shirt: '#2f6aa3', pants: '#3a3a44', shoes: '#f4f4f0', stubble: true },
  },
  chelsea: {
    name: 'Chelsea', gift: 'tennis',
    look: { hair: '#b08a58', hairStyle: 'messybun', skin: '#f2c8a0', shirt: '#3f8a4a', shirtPattern: 'gingham', shirtAccent: '#f4efe0', pants: '#2a2a30', shoes: '#f4f4f0', sunglasses: '#2a2a2a', shades: 'round' },
  },
  // The milk bar. Mystical robes, a crystal ball, and prices that move.
  sorceress: {
    name: 'The Sorceress', shop: 'spells',
    look: { hair: '#1e1a18', hairStyle: 'bun', skin: '#e0b48a', shirt: '#4a2a7a', shirtPattern: 'stripes', shirtAccent: '#f0d040', pants: '#2a1a4a', shoes: '#c8a070', hoops: '#f0d040', lips: '#8a2a5a' },
  },
  enzo: {
    name: 'Enzo', shop: 'eastdeli', gift: 'prosciutto',
    look: { hair: '#d8d4cc', hairStyle: 'short', skin: '#e0a882', shirt: '#f4f4f0', pants: '#3a3a44', apron: '#c8302a', moustache: true },
  },
  juno: {
    name: 'Juno', shop: 'records',
    look: { hair: '#c8443a', hairStyle: 'bob', skin: '#f2c8a8', shirt: '#1e1e24', pants: '#3a3a48', shoes: '#1a1a1a', glasses: '#2a2a2a' },
  },
  concetta: {
    name: 'Concetta', gift: 'egg',
    look: { hair: '#e8e4d8', hairStyle: 'bun', skin: '#e8b48a', shirt: '#3a5a4a', shirtPattern: 'gingham', shirtAccent: '#f4efe0', pants: '#2a2a34', shoes: '#4a3a2a', glasses: true },
  },
  shane: {
    name: 'Shane', gift: 'snag',
    look: { hair: '#8a8d94', hairStyle: 'cap', cap: '#2f6a4a', skin: '#e0a07a', shirt: '#f4f4f0', collar: true, pants: '#e8e4dc', shoes: '#f4f4f0', sunglasses: '#2a2a2a', shades: 'wrap' },
  },
  trudy: {
    name: 'Trudy',
    look: { hair: '#b08a58', hairStyle: 'messybun', skin: '#f2c8a0', shirt: '#e8823a', pants: '#3a5a7a', shoes: '#4a3a2a', holding: 'book' },
  },
  kev: {
    name: 'Kev',
    look: { hair: '#2a1a12', hairStyle: 'short', skin: '#c8906a', shirt: '#3fa38f', pants: '#2a2a30', shoes: '#f4f4f0', beard: true },
  },
  tash: {
    name: 'Tash',
    look: { hair: '#1e1a18', hairStyle: 'long', skin: '#d8a882', shirt: '#f0a0c0', blazer: '#1e1e24', blazerTrim: '#3a3a44', pants: '#2a2a34', shoes: '#1e1e24', lips: '#8a2a4a' },
  },
};

// ------------------------------------------------------------ words
export const EAST_PEOPLE = {
  adam: {
    role: 'Lives in the red brick unit on Holmes St',
    lines: [
      ['Unit 1. The one at the front. I get every delivery for the whole block and I have made peace with it.'],
      ['Trams out the front, the auto parts shop on the corner, and a bakery two minutes away. It is perfect.'],
      ['The 96 goes past my window every six minutes. I have stopped hearing it. My guests have not.'],
      ['Helen and Paddy used to live up on Nicholson St, you know. Before the twins. Before the mayoring.'],
    ],
    hints: {
      salami: 'A tabby comes up the driveway most afternoons, sits on my doormat and judges me. I think she lives on Donald St.',
    },
    giftLine: 'I picked these up this morning. Take one before I eat all four.',
    heartScenes: {
      2: ['Adam makes you a coffee on the machine he saved up for. "It is the only thing in the flat worth anything." It is genuinely great coffee.'],
      4: ['Adam shows you the courtyard out the back. One lemon tree, two chairs, a string of lights. "Small, but it is mine."'],
      6: ['Adam: "You can get the 96 straight into the city from the front door, you know." He says it like he is handing you a gift. He sort of is.'],
    },
    helpsInBattle: 'Adam leans out his front window and yells encouragement. It helps more than you would think.',
    battle: {
      challenge: [
        'Adam looks at your team, then at Chloe, then back at you.',
        '"Alright. If you can get past us, she is yours to take out. She will come back. She always comes back."',
      ],
      ask: 'Battle Adam?', yes: 'Let\'s go', no: 'Not today',
      win: ['"Yeah, fair." Adam crouches down and scratches Chloe\'s ears. "Go on then. Look after her."'],
      lose: ['Chloe does a victory lap of the driveway. Adam does not even pretend to be humble.'],
      again: ['"We are retired, mate. She is on the couch."'],
    },
  },
  chelsea: {
    role: 'Lives on Holmes St with Adam and Chloe',
    lines: [
      ['Chloe is a kelpie. Which means she has three jobs and we have given her none of them.'],
      ['She gets two walks and a park run a day and she is still the most awake thing in the house.'],
      ['Fleming Park, down the bottom end, off the lead. That is her whole personality.'],
      ['She sits on a chair at the pub. On the chair. Nobody taught her that.'],
    ],
    hints: {
      chloe: 'Chloe is right there. Beat Adam first, though. He has been talking about this battle all week.',
    },
    giftLine: 'Here, take one of hers. We have about forty.',
    heartScenes: {
      3: ['Chelsea shows you a photo of Chloe the day they got her: all ears, no idea. "She has not changed much, honestly."'],
      5: ['Chelsea: "She chose us, really. Sat down in the yard and would not leave." Chloe, hearing her name, does one enormous lap of the driveway.'],
    },
    helpsInBattle: 'Chelsea whistles. Whatever Chloe is doing, it stops, and so does the foe.',
  },
  sorceress: {
    role: 'Behind the counter at the East Brunswick milk bar. Powerful',
    lines: [
      ['Welcome. Potato cakes are on the left. The protection spells are behind me. Do not touch the protection spells.'],
      ['The prices move. Not because of me. The market for warding is volatile right now.'],
      ['Yes, it was eighty dollars yesterday. Today it is twenty. Tomorrow, who can say. The moon is involved.'],
      ['Somebody asked for a discount once. The spell worked anyway. It just worked rudely.'],
    ],
    giftLine: 'Take it. Do not ask what is in it.',
    heartScenes: {
      3: ['The Sorceress looks at your pet for a long moment. "This one is already protected. Somebody loves it very much." She charges you nothing. This has never happened.'],
      6: ['The Sorceress tells you the shop has been here ninety years and she has run it for all of them. You decide not to do the arithmetic.'],
    },
    helpsInBattle: 'The Sorceress mutters something old. The foe is briefly very worried about its choices.',
  },
  enzo: {
    role: 'Runs the deli on Lygon St. Will not sell you young cheese',
    lines: [
      ['Prosciutto, parmigiano, cannoli. Everything else is a side dish.'],
      ['Two years is the youngest I sell. Anything younger is for children.'],
      ['My nonna opened this shop. The slicer is older than me and it still goes.'],
    ],
    giftLine: 'Eat it here. It does not travel well. Nothing good travels well.',
    heartScenes: {
      3: ['Enzo gives you a taste of something off the back shelf. "Do not tell the others I let you have this." He says this to everyone.'],
    },
    helpsInBattle: 'Enzo throws a wedge of parmigiano. It lands like a brick. The foe sits down.',
  },
  juno: {
    role: 'Runs Wax Lyrical, the record shop',
    lines: [
      ['Australian stuff is in the front crate. Everything else can wait.'],
      ['People come in asking for "something chill". I hand them The Avalanches and they leave happy.'],
      ['Yes, you can play it before you buy. No, you cannot play it twice.'],
    ],
    heartScenes: {
      4: ['Juno puts on Paul Kelly and both of you stop talking until the song finishes. "Yeah," she says. That is the whole conversation.'],
    },
    helpsInBattle: 'Juno turns the shop speakers towards the street. The bass alone knocks the foe sideways.',
  },
  concetta: {
    role: 'Keeps chooks and a lemon tree behind 199 Nicholson St',
    lines: [
      ['Fifty one years in this street. I have seen four milk bars and one very strange sorceress.'],
      ['The chooks are called Gina, Dina and Other Gina. Do not ask about Other Gina.'],
      ['Helen lived at 199 before you were born, near enough. Lovely girl. Never once took my lemons without asking.'],
    ],
    giftLine: 'Still warm. Take two, I have more than I can use.',
    heartScenes: {
      3: ['Concetta shows you the lemon tree her husband planted in 1974. "It has outlived him and it will outlive me. That is the deal with trees."'],
      6: ['Concetta hands you a bag of lemons and will not hear a word about it. You are now in the lemon arrangement. It is permanent.'],
    },
    helpsInBattle: 'Concetta arrives with a broom and a point of view. The foe backs away.',
  },
  shane: {
    role: 'Bowls at the BBC. Barefoot, always',
    lines: [
      ['Barefoot bowls Friday nights. Everyone welcome, nobody good.'],
      ['The green is in beautiful nick. Do not let the dog on the green.'],
      ['Bocce is through the gate. The bocce blokes have been playing the same game since 1987.'],
    ],
    giftLine: 'Snag from the barbecue. Onions underneath, as God intended.',
    heartScenes: {
      4: ['Shane teaches you the bowls bias. Your bowl curves gently into the ditch. "First one always does," he says, lying kindly.'],
    },
    helpsInBattle: 'Shane rolls a bowl across the grass. It curves, impossibly, right into the foe.',
  },
  trudy: {
    role: 'Walks her greyhound round Fleming Park twice a day',
    lines: [
      ['Off leash area is down the bottom end. The oval is for the cricket and the cricket is very serious about that.'],
      ['Greyhounds sleep twenty hours a day. The other four they spend doing one enormous lap.'],
      ['The playground is up by Albert St. Nice and shady. The twins would love it.'],
    ],
    heartScenes: {
      3: ['Trudy tells you her greyhound was a rescue. "She had never seen grass. First time she felt it she just stood there." She gets a bit teary. So do you.'],
    },
    helpsInBattle: 'Trudy lets the greyhound off the lead. One lap later the foe has given up.',
  },
  kev: {
    role: 'Does the Nicholson St run on a cargo bike',
    lines: [
      ['Two kids, a week of shopping and a crate of oat milk. The bike does not care.'],
      ['Nicholson St bike lane, Fleming Park, the bakery. That is my whole world and it is enough.'],
    ],
    helpsInBattle: 'Kev rings his bell. It is an extremely loud bell.',
    battle: {
      challenge: ['Oh, a battle? Hang on, let me park.', 'Right. Me and the bike. We are undefeated at the school drop-off.'],
      ask: 'Battle Kev?', yes: 'Have a go', no: 'Let him park',
      win: ['Fair enough. Take this, it is from the bottom of the crate.'],
      lose: ['The bike stays undefeated.'],
      again: ['Another go? I have got about four minutes before pick up.'],
    },
  },
  tash: {
    role: 'Runs the coffee window on Lygon St',
    lines: [
      ['Single origin, roasted up the road. No, I will not do it with three sugars. Yes, I will do it with three sugars.'],
      ['Brunswick East has one of everything and four of some things. All of them are good.'],
    ],
    helpsInBattle: 'Tash slides a flat white across. Your pet does not drink coffee but is flattered.',
    battle: {
      challenge: ['You battle? Good. I have had six coffees and nowhere to put the energy.'],
      ask: 'Battle Tash?', yes: 'Bring it', no: 'Just the coffee',
      win: ['Nice work. Cannoli on the house. Do not tell Enzo what I charged you.'],
      lose: ['Caffeine wins again.'],
      again: ['Back for more? The machine is still on.'],
    },
  },
};

// ------------------------------------------------------------ zone taglines
export const EAST_PLACES = {
  holmes: 'Red brick units, the 96 tram and an auto parts shop on the corner.',
  nicholson: 'A milk bar, a sandwich parlour and a wall of graffiti.',
  ebmilkbar: 'Potato cakes, cold drinks and a shelf of protection spells.',
  fleming: 'A big oval, a pavilion and dogs off the lead down the bottom end.',
  bowls: 'Two greens, the bocce courts and the hall on Victoria St.',
  lygon: 'A deli, a record shop and more coffee than one street needs.',
};

// ------------------------------------------------------------ friends
export const EAST_FRIENDS = {
  adam: {
    loves: ['beans', 'cannoli', 'sitandthink'], likes: ['croissant', 'icedcoffee', 'littlecreatures', 'paperback'], dislikes: ['goon'],
    rewards: { 4: { item: 'beans', n: 1 } },
    assist: { heal: 0.35, selfAtk: 1 },
  },
  chelsea: { loves: ['tennis', 'chicken', 'kombucha'], likes: ['cannoli', 'icedcoffee', 'strawberry'], dislikes: ['goon'], rewards: { 4: { item: 'tennis', n: 2 } }, assist: { selfAtk: 1, heal: 0.2 } },
  sorceress: { loves: ['kombucha', 'honey'], likes: ['lemon', 'cheese', 'icedcoffee'], dislikes: ['vb'], rewards: { 5: { item: 'kombucha', n: 2 } }, assist: { foeAtk: 1, foeDef: 1 } },
  enzo: { loves: ['parmigiano', 'chianti', 'olive'], likes: ['tomato', 'basil', 'lemon'], dislikes: ['twinkie'], rewards: { 4: { item: 'prosciutto', n: 2 } }, assist: { damage: 0.18 } },
  juno: { loves: ['gossip', 'sinceileft', 'orangewine'], likes: ['croissant', 'paperback', 'moondog'], dislikes: ['xxxx'], assist: { foeDef: 1 } },
  concetta: { loves: ['lemon', 'tomato', 'olive'], likes: ['basil', 'zucchini', 'flowers', 'egg'], dislikes: ['takis'], rewards: { 3: { item: 'egg', n: 3 } }, assist: { heal: 0.4 } },
  shane: { loves: ['snag', 'draught', 'vb'], likes: ['potato', 'cheese', 'greatnorthern'], dislikes: ['orangewine'], assist: { selfDef: 1, damage: 0.1 } },
  trudy: { loves: ['chicken', 'tennis', 'thedry'], likes: ['sardine', 'paperback', 'flowers'], dislikes: ['goon'], assist: { heal: 0.2, selfAtk: 1 } },
  kev: { loves: ['kombucha', 'carrot'], likes: ['croissant', 'tomato', 'icedcoffee'], dislikes: ['vb'] },
  tash: { loves: ['beans', 'icedcoffee'], likes: ['cannoli', 'croissant', 'strawberry'], dislikes: ['snag'], assist: { damage: 0.15 } },
};

// ------------------------------------------------------------ shops
export const EAST_SHOPS = {
  spells: { name: 'East Brunswick Take Away and Milk Bar', where: 'Nicholson St, Brunswick East', tabs: ['spells', 'treats', 'gifts'], treats: ['cannoli', 'cheese', 'snag'], gifts: ['kombucha', 'icedcoffee', 'gaytime'] },
  eastdeli: { name: 'Pasta La Vista', where: 'Lygon St, Brunswick East', tabs: ['treats', 'gifts'], treats: ['prosciutto', 'cannoli', 'cheese'], gifts: ['parmigiano', 'beans', 'olive'] },
  records: { name: 'Wax Lyrical', where: 'Lygon St, Brunswick East', tabs: ['gifts'], gifts: ['gossip', 'eastlp', 'sitandthink', 'sinceileft'] },
};

// ------------------------------------------------------------ items
export const EAST_ITEMS = {
  cannoli:    { name: 'Cannoli', price: 6, desc: 'Ricotta, pistachio and icing sugar on your nose. From the Lygon St deli.' },
  prosciutto: { name: 'Prosciutto', price: 8, desc: 'Sliced so thin you can read through it. Every dog in Brunswick East knows that door.' },
  egg:        { name: 'Free-range egg', price: 3, desc: 'From Concetta\'s chooks. Still warm. Gina would like it back.' },
  parmigiano: { name: 'Wedge of parmigiano', price: 12, gift: true, desc: 'Aged two years. Enzo says anything younger is for children.' },
  beans:      { name: 'Bag of coffee beans', price: 16, gift: true, desc: 'Roasted up the road. Tasting notes of stone fruit and rent.' },
  honey:      { name: 'Merri Creek honey', price: 10, gift: true, desc: 'From the hives by the creek. The bees commute about three kilometres.' },
  kombucha:   { name: 'Kombucha', price: 7, gift: true, desc: 'Homebrewed ginger kombucha. Fizzy, sour and very good for you, apparently.' },
  // Vinyl from Wax Lyrical (record: true). art: { cover, band } for the sleeve.
  gossip:      { name: 'Paul Kelly: Gossip', price: 30, gift: true, record: true, art: { cover: '#e8d8b0', band: '#c8302a' }, desc: 'Melbourne songs about Melbourne things. Darling it hurts.' },
  eastlp:      { name: 'Cold Chisel: East', price: 30, gift: true, record: true, art: { cover: '#c8302a', band: '#f4efe0' }, desc: 'Pub rock for the drive home from the pub.' },
  sitandthink: { name: 'Courtney Barnett: Sometimes I Sit and Think', price: 34, gift: true, record: true, art: { cover: '#7ab0d8', band: '#e8c040' }, desc: 'Recorded just up the road. Very Brunswick East.' },
  sinceileft:  { name: 'The Avalanches: Since I Left You', price: 36, gift: true, record: true, art: { cover: '#3fa38f', band: '#f0a0c0' }, desc: 'Nine hundred samples and a parrot. Melbourne\'s greatest party record.' },
};

// Protection spells from the milk bar (spell: true). They go on a pet like
// gear, but they wear off after a day. `swing` is how wildly the price moves.
export const SPELLS = {
  warding:  { name: 'Ward of the Back Lane', base: 60, swing: 0.8, bonus: { defence: 1.25 }, desc: '+25% defence for every pet, today only. Smells faintly of potato cakes.' },
  swift:    { name: 'Charm of the 96', base: 70, swing: 1.1, bonus: { speed: 1.25 }, desc: '+25% speed, today only. Arrives when it arrives, then all at once.' },
  fortune:  { name: 'Blessing of Small Fortune', base: 90, swing: 1.4, bonus: { crit: 0.1 }, desc: 'Luckier hits, today only. The Sorceress will not elaborate.' },
  vigour:   { name: 'Draught of Second Wind', base: 110, swing: 1.2, bonus: { regen: 0.06 }, desc: 'A little energy back each turn, today only. Tastes purple.' },
};
export const SPELL_ORDER = Object.keys(SPELLS);
// The price swings with the day and the spell. Wildly, and usually upwards.
export function spellPrice(id, day) {
  const s = SPELLS[id];
  const wave = Math.sin(day * 2.3 + id.length * 1.7) * 0.5 + Math.sin(day * 0.7 + id.length) * 0.5;
  return Math.max(10, Math.round(s.base * (1 + wave * s.swing) / 5) * 5);
}

// ------------------------------------------------------------ battles
export const EAST_ENEMIES = {
  scoby: {
    faces: 'front',
    name: 'Kombucha SCOBY', type: 'smelly', stats: { hp: 58, attack: 50, defence: 58, speed: 40, special: 58 },
    moves: ['stench', 'rot', 'plague'], drop: ['kombucha', 0.1],
  },
  rakali: {
    name: 'Rakali', type: 'water', stats: { hp: 54, attack: 60, defence: 48, speed: 75, special: 45 },
    moves: ['splash', 'gnaw', 'hide'], drop: ['sardine', 0.3],
  },
  cargobike: {
    faces: 'front',
    name: 'Cargo Bike', type: 'steel', stats: { hp: 64, attack: 60, defence: 62, speed: 50, special: 35 },
    moves: ['runover', 'beep', 'scoot2'], drop: ['carrot', 0.3],
  },
};

export const EAST_FOE_TEXT = {
  scoby: { appear: 'A kombucha mother slides out of its jar. It has been fermenting. It has thoughts.', leave: 'settles back into the jar to keep brewing.' },
  rakali: { appear: 'A rakali slips out of the Merri Creek! A native water rat, gold belly, white tipped tail.', leave: 'slides back into the creek without a splash.' },
  cargobike: { appear: 'An unattended cargo bike rolls down the bike lane at you!', leave: 'coasts off towards the bakery.' },
};

export const EAST_TRAINERS = {
  adam: { name: 'Adam', prize: 'chloe', team: [['cargobike', 8], ['pet:chloe', 10]] },
  kev: { name: 'Kev', team: [['cargobike', 9], ['scooter', 10]], reward: { carrot: 2 }, money: 40 },
  tash: { name: 'Tash', team: [['flatwhitefoe', 9], ['ristretto', 10], ['scoby', 10]], reward: { cannoli: 1 }, money: 45 },
};

// Who you can meet in Brunswick East's tall grass.
export const EAST_ENCOUNTERS = [
  { id: 'scoby', lv: [6, 9], weight: 2 },
  { id: 'cargobike', lv: [6, 9], weight: 2, day: true },
  { id: 'rakali', lv: [6, 9], weight: 4, zones: ['fleming'] },
  { id: 'flatwhitefoe', lv: [6, 8], weight: 2, day: true, zones: ['lygon', 'nicholson'] },
  { id: 'sourdough', lv: [6, 9], weight: 1, zones: ['lygon'] },
  { id: 'scooter', lv: [6, 9], weight: 2 },
  { id: 'ibis', lv: [6, 8], weight: 2 },
  { id: 'alleycat', lv: [6, 9], weight: 2 },
  { id: 'possum', lv: [7, 9], weight: 2, night: 3 },
  { id: 'rat', lv: [6, 8], weight: 1, night: 2 },
];
