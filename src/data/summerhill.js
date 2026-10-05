// SUMMERHILL SHOPPING CENTRE, Reservoir: everything for the zone in one file
// (people, their words, shops, presents, wild things and the trolley bloke),
// so the area can grow without touching every shared data file. Each export
// is merged into its home file at import:
//
//   SH_NPCS -> npcs.js      SH_PEOPLE, SH_FOE_TEXT, SH_PLACES -> dialogue.js
//   SH_ITEMS -> items.js    SH_FRIENDS -> friends.js     SH_SHOPS -> shops.js
//   SH_ENEMIES, SH_TRAINERS, SH_ENCOUNTERS -> enemies.js  SH_MOVES -> moves.js
//
// Maps: src/world/maps/summerhill.js (the car park and the centre's front) and
// summerhillmall.js (inside). Art: src/art/paint/summerhill.js.
// Nobody here is a real person: the shopkeepers and regulars are invented.

export const SH_NPCS = {
  deb: {
    name: 'Deb', shop: 'summerfresh', look: { hair: '#c87a4a', hairStyle: 'curly', skin: '#f2c8a8', shirt: '#2f8a4a', collar: true, pants: '#2a2a30', shoes: '#1a1a1a', glasses: '#8a3a3a' },
  },
  mei: {
    name: 'Mei', shop: 'chemist', look: { hair: '#1a1614', hairStyle: 'bob', skin: '#ecc8a4', shirt: '#7ab8d8', blazer: '#f4f4f0', pants: '#2a3a58', shoes: '#1a1a1a', glasses: '#2a2a2a' },
  },
  kostas: {
    name: 'Kostas', shop: 'newsagent', look: { hair: '#c8c4bc', hairStyle: 'short', skin: '#e0a882', shirt: '#e8e0c8', collar: true, blazer: '#6a4a3a', pants: '#3a3a44', shoes: '#2a1a12', glasses: '#4a3a2a', moustache: true },
  },
  thuy: {
    name: 'Thuy', shop: 'hotbread', gift: 'sausageroll', look: { hair: '#1a1614', hairStyle: 'bun', skin: '#e8c09a', shirt: '#f4efe0', pants: '#2a2a30', shoes: '#f4f4f0', apron: '#f4f4f0' },
  },
  raj: {
    name: 'Raj', shop: 'twodollar', look: { hair: '#1a1614', hairStyle: 'short', skin: '#b07a52', shirt: '#e8c040', shirtPattern: 'stripes', shirtAccent: '#c8443a', pants: '#2a3a58', shoes: '#4a3a2a', beard: true },
  },
  shaz: {
    name: 'Shaz', look: { hair: '#e8d0a0', hairStyle: 'wavy', streak: '#f07ab0', skin: '#f2c0a0', shirt: '#c89a5a', shirtPattern: 'leopard', shirtAccent: '#3a2a1a', pants: '#1e1e24', shoes: '#c8443a', hoops: '#e8c040', lips: '#c8304a' },
  },
  connie: {
    name: 'Connie', look: { hair: '#e8e4d8', hairStyle: 'pixie', skin: '#e8b48a', shirt: '#7a3ab0', pants: '#7a3ab0', shoes: '#f4f4f0', bumbag: '#2a2a30', glasses: true },
  },
  bill: {
    name: 'Bill', look: { hair: '#d8d4cc', hairStyle: 'bald', skin: '#e8b498', shirt: '#9ab0c8', collar: true, pants: '#8a7a5a', shoes: '#4a3a2a', glasses: '#4a3a2a' },
  },
  trev: {
    name: 'Trev', look: { hair: '#6a4a2a', hairStyle: 'cap', cap: '#2a2a30', skin: '#e8b48a', shirt: '#2a3a58', pants: '#2a3a58', shoes: '#2a1a12', hivis: true, stubble: true, gloves: '#c8a050' },
  },
  darren: {
    name: 'Darren', look: { hair: '#8a5a2a', hairStyle: 'short', skin: '#f2c79a', shirt: '#c8443a', jersey: ['#c8443a', '#1e1e24'], pants: '#5a6a4a', shoes: '#f4f4f0', sunglasses: '#2a2a2a', shades: 'wrap' },
  },
};

export const SH_PEOPLE = {
  deb: {
    role: 'Checkout at Summerhill Fresh. Knows everyone in Reservoir by their shopping',
    lines: [
      ['Hiya love. Bags? Five cents. I know. Blame the council. Not your Paddy, the other ones.'],
      ['Tuesday is pension day. The whole of Reservoir is in here by 9am buying one tin of tomatoes each.'],
      ['Unexpected item in the bagging area? That is just Darren. He has been looking for his car since eleven.'],
      ['Tim Tams are half price. They are always half price. Nobody has ever seen them full price.'],
    ],
    heartScenes: {
      3: ['Deb: "Twenty two years on this register. I scanned your mum\'s nappies once. Well, somebody\'s mum."'],
      6: ['Deb slips a packet of Tim Tams into your bag. "Damaged box. Very damaged. I damaged it myself."'],
    },
    helpsInBattle: 'Deb calls PRICE CHECK ON AISLE FOUR over the loudspeaker. The foe freezes in fright.',
  },
  mei: {
    role: 'Pharmacist at Summerhill Discount Chemist',
    lines: [
      ['Hello! Scripts at the back, sunscreen at the front, and please stop asking me about the vapes.'],
      ['Slip, slop, slap, seek, slide. I will quiz you on the way out.'],
      ['Everyone wants to show me a rash. I have seen every rash in Reservoir. I am never surprised.'],
    ],
    heartScenes: {
      4: ['Mei: "I studied for five years and now I mostly explain that you cannot take Panadol with Nurofen. You can. I explain it a lot."'],
    },
    helpsInBattle: 'Mei runs out with a tube of something medicated and patches your pet up. Pharmacist\'s orders.',
  },
  kostas: {
    role: 'Runs the newsagency. Has sold Tatts tickets since the Bracks government',
    lines: [
      ['Paper? Scratchie? Birthday card for someone you forgot? Kostas has got you.'],
      ['Tatts tickets are for the grown-ups, kiddo. But I will tell you a secret: the crosswords are better odds.'],
      ['I sold a first division winner in 2003. They still come in for the Herald Sun. Same coat. Rich people are strange.'],
    ],
    heartScenes: {
      3: ['Kostas: "My father opened this shop when this was all paddocks. Now it is a car park. Progress, they call it."'],
    },
  },
  thuy: {
    role: 'Runs Summerhill Hot Bread. Up at 3am every day',
    lines: [
      ['Fresh! Sausage roll, vanilla slice, finger bun with sprinkles. The tomato sauce is free if you smile.'],
      ['Vanilla slice. Some people call it a snot block. Those people are not welcome in my shop.'],
      ['I start baking at three. By ten the tradies have eaten everything. By two the nonnas want a discount.'],
      ['My banh mi is not on the menu. Ask nicely. Very nicely.'],
    ],
    giftLine: 'Thuy hands you a warm sausage roll wrapped in a paper bag. "Left over. Do not tell the tradies."',
    heartScenes: {
      4: ['Thuy: "Hot bread shops kept my whole family going when we arrived. Now I keep the whole of Plenty Rd going. Fair trade."'],
    },
    helpsInBattle: 'Thuy lobs a warm finger bun over. Your pet eats it mid-fight and feels much better.',
  },
  raj: {
    role: 'Runs the $2 shop. Most things are not two dollars',
    lines: [
      ['Welcome! Everything is two dollars! Except that. And that. And that one. Those are five.'],
      ['Phone cables, fake flowers, a lava lamp, a rubber chicken. Christmas lights, all year round.'],
      ['People laugh at the $2 shop. Then their kid has a party at four o\'clock and suddenly I am a hero.'],
    ],
    heartScenes: {
      3: ['Raj: "Rent here went up again. I said to the landlord, what am I, a $5 shop now? He did not laugh."'],
    },
  },
  shaz: {
    role: 'Hairdresser at Curl Up & Dye. Heard every secret in Reservoir',
    lines: [
      ['Come in, darl, sit down. Just a trim? That is what they all say.'],
      ['I know everything that happens in this suburb. People tell their hairdresser things they would not tell a priest.'],
      ['Connie has had the same perm since 1984. I refuse to change it. It is a heritage listing.'],
      ['Those twins need a haircut. Do not tell Helen I said so.'],
    ],
    byHero: {
      helen: [['Helen, love. Your roots. We need to talk about your roots. Book in. I will do you a deal.']],
      hadrian: [['Look at that hair! Like a little Beatle. Sit still and I will give you a lolly.']],
      aleksy: [['Hello gorgeous! No, you cannot play with the scissors. You can play with the spray bottle.']],
    },
    heartScenes: {
      3: ['Shaz: "My mum had this shop before me. Same chairs. Same dryers. The name was her joke. She was very funny."'],
      6: ['Shaz leans in. "Between you and me, Kostas has a crush on Connie. Thirty years. Never said a word. Men."'],
    },
    helpsInBattle: 'Shaz blasts the foe with a can of hairspray. Big hair, big fumes, big retreat.',
  },
  connie: {
    role: 'Mall walker. Six laps before the shops open, every day',
    lines: [
      ['Keep up, darling! Six laps before nine. Doctor says it is good for the heart. Shaz says it is good for gossip.'],
      ['Forty years I have lived in Reservoir. I have seen this centre change its tiles four times.'],
      ['The young ones go to the gym. Why pay? The centre has air conditioning and a bakery at the finish line.'],
    ],
    heartScenes: {
      4: ['Connie: "My husband and I walked these laps for twenty years. Now I walk them for both of us. Faster, too. He was slow."'],
    },
    helpsInBattle: 'Connie power walks straight through the fight. The foe is knocked flat by her elbows.',
  },
  bill: {
    role: 'Food court regular. Same table, same dim sum, since forever',
    lines: [
      ['Pull up a chair. Not that one, that one wobbles. I have been meaning to tell someone about it since 1996.'],
      ['Four dim sims, steamed, soy sauce. Every day. The doctor says I should vary my diet. I sometimes have them fried.'],
      ['I worked forty years at the tannery on Plenty Rd. Union man. We won the 38 hour week, you know. You are welcome.'],
    ],
    heartScenes: {
      3: ['Bill: "When the plant shut, the union got us our entitlements. Every cent. Remember that when someone says unions are old hat."'],
    },
    helpsInBattle: 'Bill bangs his table and calls a stop work meeting. The foe is so confused it stops working.',
  },
  trev: {
    role: 'Trolley collector. The car park is his kingdom',
    lines: [
      ['Every trolley in this car park has a name. That one is Wonky. That one is Also Wonky.'],
      ['I once found a trolley in Edwardes Lake. Nobody knows how it got there. The ducks know.'],
      ['Twelve trolleys in a line, round the corner, up the ramp. People clap sometimes. I pretend not to notice.'],
    ],
    heartScenes: {
      3: ['Trev: "Casual for nine years. Finally got made permanent last month. The union rep sorted it. Bought the whole crew a pie."'],
    },
    helpsInBattle: 'Trev sends a line of twelve trolleys rumbling across the car park. The foe is bowled over.',
    battle: {
      challenge: ['Oi! You\'ve got that look. The look of someone who leaves trolleys in the disabled bay.', 'My trolleys want a word.'],
      ask: 'Battle Trev?',
      yes: 'Bring it',
      no: 'Not today',
      win: ['Fair play. You can push a trolley with me any day.', 'Here, found this in a trolley. Finders keepers.'],
      lose: ['The trolleys win again. They always do. They have numbers.'],
      again: ['Back for more? Wonky has been training.'],
    },
  },
  darren: {
    role: 'Has lost his car in the car park. Again',
    lines: [
      ['Have you seen a silver Corolla? About this big. Silver. Like every other car here.'],
      ['I parked near a trolley bay. Which one? I thought there was only one trolley bay.'],
      ['The wife is still inside. She thinks I went to warm the car up. That was forty minutes ago.'],
    ],
    helpsInBattle: 'Darren presses his car keys. Forty cars beep at once. The foe panics.',
  },
};

export const SH_FOE_TEXT = {
  trolley: {
    appear: 'A runaway trolley rattles across the car park, straight at you!',
    leave: 'wobbles off and wedges itself in a garden bed.',
  },
  seagull: {
    appear: 'A seagull lands in front of you and stares at your pockets. MINE?',
    leave: 'spots a dropped chip and flaps away screaming.',
  },
};

export const SH_PLACES = {
  summerhill: 'Summerhill Shopping Centre. A big car park, a pylon sign and everything you need.',
  summerhillmall: 'Inside Summerhill. Terrazzo, air conditioning and the smell of hot bread.',
};

// Presents for friends (gift: true). Icons in src/art/paint/summerhill.js.
export const SH_ITEMS = {
  timtams:      { name: 'Tim Tams', price: 4, gift: true, desc: 'Half price. They are always half price. Do the Tim Tam Slam with a cuppa.' },
  handcream:    { name: 'Hand cream', price: 8, gift: true, desc: 'Smells like a nana\'s handbag, in the best way.' },
  sunscreen:    { name: 'SPF 50 sunscreen', price: 9, gift: true, desc: 'Slip, slop, slap. Mei will check you have put it on.' },
  puzzlebook:   { name: 'Crossword book', price: 5, gift: true, desc: 'Two hundred cryptics. Someone has already done the first three in pen.' },
  bdaycard:     { name: 'Birthday card', price: 6, gift: true, desc: 'A cartoon dog in a party hat. Inside: "Ruff day? Have a cake!"' },
  sausageroll:  { name: 'Sausage roll', price: 4, gift: true, desc: 'Flaky, hot and dangerous for the first bite. Sauce sachet included.' },
  vanillaslice: { name: 'Vanilla slice', price: 5, gift: true, desc: 'Custard and pink icing between two sheets of pastry. Do not call it a snot block in front of Thuy.' },
  fingerbun:    { name: 'Finger bun', price: 3, gift: true, desc: 'Pink icing, coconut, a sultana or two. Peak Australian morning tea.' },
  fidget:       { name: 'Fidget spinner', price: 2, gift: true, desc: 'Was it 2017 already? It spins for ages. It is still two dollars.' },
  fakeplant:    { name: 'Fake fiddle-leaf fig', price: 5, gift: true, desc: 'Never needs water. Never dies. The only plant Helen has kept alive.' },
};

export const SH_SHOPS = {
  summerfresh: { name: 'Summerhill Fresh', where: 'Summerhill Shopping Centre, Reservoir', tabs: ['treats', 'seeds', 'gifts'], seeds: ['carrot', 'potato', 'zucchini', 'pumpkin'], gifts: ['timtams', 'icedcoffee', 'gaytime', 'flowers'] },
  chemist: { name: 'Summerhill Discount Chemist', where: 'Summerhill Shopping Centre, Reservoir', tabs: ['gifts'], gifts: ['handcream', 'sunscreen'] },
  newsagent: { name: 'Summerhill Newsagency', where: 'Summerhill Shopping Centre, Reservoir', tabs: ['gifts'], gifts: ['puzzlebook', 'bdaycard', 'paperback'] },
  hotbread: { name: 'Summerhill Hot Bread', where: 'Summerhill Shopping Centre, Reservoir', tabs: ['gifts'], gifts: ['sausageroll', 'vanillaslice', 'fingerbun'] },
  twodollar: { name: 'Everything $2', where: 'Summerhill Shopping Centre, Reservoir', tabs: ['gifts'], gifts: ['fidget', 'fakeplant', 'flowers'] },
};

export const SH_FRIENDS = {
  deb: { loves: ['timtams', 'vanillaslice', 'moscato'], likes: ['icedcoffee', 'flowers', 'handcream'], dislikes: ['orangewine'], assist: { foeAtk: 1, foeDef: 1 } },
  mei: { loves: ['sunscreen', 'lessonschem', 'strawberry'], likes: ['handcream', 'flowers', 'icedcoffee'], dislikes: ['mangoice', 'grapeice', 'watermelon'], assist: { heal: 0.4 } },
  kostas: { loves: ['puzzlebook', 'byzbook', 'olive'], likes: ['lemon', 'paperback', 'sausageroll'], dislikes: ['fidget'] },
  thuy: { loves: ['chilli', 'basil', 'thermos'], likes: ['tomato', 'icedcoffee', 'flowers'], dislikes: ['vanillaslice'], assist: { heal: 0.35 } },
  raj: { loves: ['fidget', 'mangoice', 'takis'], likes: ['sausageroll', 'drpepper', 'chilli'], dislikes: ['fakeplant'] },
  shaz: { loves: ['handcream', 'moscato', 'flowers'], likes: ['vanillaslice', 'fakeplant', 'timtams'], dislikes: ['oldboot'], assist: { foeAtk: 1, damage: 0.08 } },
  connie: { loves: ['lemon', 'tomato', 'fingerbun'], likes: ['puzzlebook', 'flowers', 'olive'], dislikes: ['takis'], assist: { damage: 0.14 } },
  bill: { loves: ['sausageroll', 'melbbitter', 'nineteen84'], likes: ['puzzlebook', 'vb', 'potato'], dislikes: ['orangewine'], assist: { foeAtk: 1, foeDef: 1 } },
  trev: { loves: ['sausageroll', 'vb', 'snag'], likes: ['icedcoffee', 'fingerbun', 'headtorch'], dislikes: ['fakeplant'], assist: { damage: 0.15 } },
  darren: { loves: ['headtorch', 'crown'], likes: ['sausageroll', 'snag', 'icedcoffee'], dislikes: ['puzzlebook'], assist: { foeDef: 1 } },
};

export const SH_MOVES = {
  wonkywheel: { name: 'Wonky Wheel', type: 'steel', power: 50, anim: 'lunge', text: '{u} veers sideways on its wonky wheel and clips {t}.' },
  coinlock:   { name: 'Coin Lock', type: 'steel', power: 0, effect: { selfDef: 1 }, anim: 'shout', text: '{u} locks its coin slot. It will take two dollars to move it now.' },
  chipsteal:  { name: 'Chip Steal', type: 'street', power: 45, effect: { drain: 0.5 }, anim: 'claw', text: '{u} snatches a chip right off {t}\'s nose.' },
  squawk:     { name: 'MINE MINE', type: 'park', power: 0, effect: { foeAtk: 1 }, anim: 'shout', text: '{u} screams MINE MINE MINE until {t} backs off.' },
  divebomb:   { name: 'Dive Bomb', type: 'park', power: 55, anim: 'lunge', text: '{u} dives out of the sky at {t}!' },
};

export const SH_ENEMIES = {
  trolley: {
    faces: 'front',
    name: 'Runaway Trolley', type: 'steel', stats: { hp: 60, attack: 60, defence: 66, speed: 40, special: 35 },
    moves: ['wonkywheel', 'runover', 'coinlock'],
  },
  seagull: {
    name: 'Car Park Seagull', type: ['park', 'street'], stats: { hp: 48, attack: 58, defence: 42, speed: 85, special: 45 },
    moves: ['chipsteal', 'squawk', 'divebomb'], drop: ['fingerbun', 0.25],
  },
};

// Joined onto the Reservoir list in enemies.js.
export const SH_ENCOUNTERS = [
  { id: 'trolley', lv: [8, 11], weight: 5, zones: ['summerhill'] },
  { id: 'seagull', lv: [8, 11], weight: 5, day: true, zones: ['summerhill'] },
];

export const SH_TRAINERS = {
  trev: {
    name: 'Trev', team: [['trolley', 10], ['seagull', 11], ['trolley', 12]],
    reward: { sausageroll: 2 }, money: 45,
  },
};
