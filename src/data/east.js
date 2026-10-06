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
//   EAST_MOVES    -> MOVES (moves.js)
//   EAST_PLACES   -> PLACES (dialogue.js)    zone taglines
//
// The real places are Holmes St (Adam's unit), 199 Nicholson St (where Helen
// and Paddy used to live), the Nicholson St milk bar strip, Fleming Park and
// the Brunswick Bowls Club, and Lygon St from the owner's Street View shots.
// Adam, Chelsea, Hatman, Mr Wilkinson, James the tradie, Nonna Concetta,
// Abby's aunt and Michael are real people the owner knows: keep them
// affectionate, specific and never mean. The Sorceress is invented.
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
  // A Brunswick East legend. Broad brimmed grey hat, torn grey trench coat,
  // a ripped blue t-shirt. Yells at nobody in particular. Same sandwich daily.
  hatman: {
    name: 'Hatman',
    look: { hair: '#6a5a48', hairStyle: 'short', skin: '#e0a882', hat: '#8a8a84', coat: '#7a7a72', tatters: true, shirt: '#3a6ab0', rips: true, pants: '#4a4238', shoes: '#3a2a1e', stubble: true },
  },
  // Runs the bar on Lygon St. Grey swept-back hair, short beard, black shirt.
  mrwilkinson: {
    name: 'Mr Wilkinson', gift: 'beans',
    look: { hair: '#7a7068', hairStyle: 'wavyshort', skin: '#e8b894', shirt: '#1e1a1a', collar: true, pants: '#2a3448', shoes: '#1a1414', stubble: true, moustache: '#5a4a40' },
  },
  // A tradie with a big mop of blond hair. Will fix your doors after the party.
  tradie: {
    name: 'James', gift: 'snag',
    look: { hair: '#f0d070', hairStyle: 'curly', skin: '#f0c098', shirt: '#f08a2a', hivis: true, pants: '#3a3a30', shoes: '#5a3a20', gloves: '#c8a050' },
  },
  // The nonna two doors down from 199. The bins go on HER side. No, the other side.
  concetta: {
    name: 'Nonna Concetta', gift: 'egg',
    look: { hair: '#e8e4d8', hairStyle: 'bun', skin: '#e8b48a', shirt: '#1e1e24', pants: '#1e1e24', shoes: '#2a2a2a', glasses: true, scarf: '#3a3a44' },
  },
  // Abby's aunt. A psychologist with an office round the corner.
  abbysaunt: {
    name: 'Abby\'s Aunt', gift: 'honey',
    look: { hair: '#c8a868', hairStyle: 'bob', skin: '#f2c8a8', shirt: '#f4efe0', blazer: '#5a6a8a', pants: '#3a3a48', shoes: '#4a3a2a', glasses: '#8a6a4a' },
  },
  // Black hair, hoodie up. Asks after Nathan and Rose.
  michael: {
    name: 'Michael',
    look: { hair: '#1a1414', hairStyle: 'short', skin: '#f0c8a8', hood: '#3a3a44', shirt: '#3a3a44', pants: '#2a2a30', shoes: '#f4f4f0' },
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
  hatman: {
    role: 'Brunswick East legend. Hat, coat, sandwich',
    lines: [
      ['"THE TRAMS! They KNOW!" Hatman points at the 96, then at you, then at the sky. Then he nods, satisfied.'],
      ['"Ham, cheese, tomato. HAM. CHEESE. TOMATO." He holds up the sandwich like evidence.'],
      ['Hatman yells something long and urgent at a bin. The bin takes it well.'],
      ['"Nobody listens," says Hatman, very clearly. Then he goes back to yelling.'],
    ],
    heartScenes: {
      3: ['Hatman tears his sandwich exactly in half and hands you the bigger bit. He does not say a word. It is the nicest thing anyone has done for you all week.'],
      6: ['Hatman tips his enormous hat to you. Just once. Then he yells at a pigeon for about ten minutes.'],
    },
    helpsInBattle: 'Hatman thunders across the road yelling something about the moon. The foe does not know what is happening. Neither do you.',
    battle: {
      challenge: ['Hatman stops yelling. He looks you dead in the eye.', '"SANDWICH." He unwraps it. It has been waiting for this.'],
      ask: 'Battle Hatman?', yes: 'Bring it', no: 'Back away slowly',
      win: ['Hatman wraps the sandwich back up, very gently. "Good," he says. "GOOD." Then he yells at a tram.'],
      lose: ['The sandwich has won. Hatman raises it to the sky and yells for a while about it.'],
      again: ['"SANDWICH." Here we go again.'],
    },
  },
  mrwilkinson: {
    role: 'Runs the bar on Lygon St',
    lines: [
      ['Come in, come in. Grab a stool. There is a bowl of lollies on the bar. Nobody knows what is in it. That is the point.'],
      ['Trivia is Tuesday. Karaoke is up the road at Benjy\'s. We do not compete. We just listen to it through the wall.'],
      ['Best bar on Lygon St. I am biased. I am also right.'],
    ],
    giftLine: 'Beans from the roaster up the road. Do not tell them I gave them away.',
    heartScenes: {
      3: ['Mr Wilkinson throws his arms wide behind the bar, mid song, and does not stop until the chorus is done. "Sorry. It was a good one."'],
      6: ['Mr Wilkinson pours you something he will not name. "On the house. Do not make it weird." It is very good.'],
    },
    helpsInBattle: 'Mr Wilkinson leans out the door and pours the foe a pint. It sits down to drink it and forgets the battle.',
    battle: {
      challenge: ['Mr Wilkinson wipes down the bar and grins.', '"Fancy a round? Two rounds. Surprise first."'],
      ask: 'Battle Mr Wilkinson?', yes: 'Pour it', no: 'Just looking',
      win: ['"Good game. Next one is on me." He means the pint, not the battle. Probably.'],
      lose: ['"House always wins," says Mr Wilkinson, and finishes the pint himself.'],
      again: ['"Another round? Go on then."'],
    },
  },
  tradie: {
    role: 'A carpenter. Big blond hair, bigger heart',
    lines: [
      ['Having a party? Going to be a big one? If any doors come off, you call me. I mean it.'],
      ['Thirty years of carpentry and the only thing I cannot fix is the rent.'],
      ['Saw your front door, by the way. Hinge is going. Not today. But it is going.'],
    ],
    giftLine: 'Snag from the job site barbie. Still warm. Mostly.',
    heartScenes: {
      3: ['James measures your doorway twice, out of habit. "Cut once," he says, and winks. You do not know what it means, but you feel safer.'],
      6: ['James: "Seriously. Wild party, doors off, bring them round. No charge for mates." He shakes your hand. It is like shaking a fence post.'],
    },
    helpsInBattle: 'James jogs over with a cordless drill. The foe takes one look and decides to be somewhere else.',
  },
  concetta: {
    role: 'Lives two doors from 199 Nicholson St. Watches the bins',
    lines: [
      ['EH! YOU! The bin! She go on THIS side, not THAT side! Every week, the same! Mamma mia!'],
      ['You always make the mess in my street! The leaves, the bins, the little dog! Always!'],
      ['Fifty one years I live here. Fifty one years the bins go on THIS side. Then you come.'],
      ['Thursday is the bins. THURSDAY. Not Wednesday. Not "whenever". Madonna santa.'],
    ],
    giftLine: 'Here. Eggs from my chooks. Eat something, you are too skinny. And fix the bin.',
    heartScenes: {
      3: ['Nonna Concetta catches you putting the bin on the right side. She stares. She nods, once. "Finally." It is the best review of your life.'],
      6: ['Nonna Concetta pinches your cheek hard enough to leave a mark. "You are a good one. A disaster with the bins. But a good one."'],
    },
    helpsInBattle: 'Nonna Concetta storms out with a wooden spoon, yelling in Italian. The foe has never been so sorry.',
  },
  abbysaunt: {
    role: 'Abby\'s aunt. A psychologist with an office nearby',
    lines: [
      ['If you ever need someone to talk to, my office is just round the corner. Second floor, the door with the plant.'],
      ['Twins, a mayor husband and a house full of pets? You are doing really well. It is okay if it does not feel like it.'],
      ['Abby says you are lovely. Abby is a good judge. She gets that from me.'],
    ],
    giftLine: 'Honey from the Merri Creek hives. Very good in tea. Very good for a hard day.',
    heartScenes: {
      3: ['Abby\'s aunt asks how you are, and then waits for a real answer. You give her one. She just listens. It helps more than you expected.'],
      6: ['Abby\'s aunt: "Remember to look after yourself too. Not just the pets." You promise. You mostly mean it.'],
    },
    helpsInBattle: 'Abby\'s aunt says something calm and kind. Your pet takes a deep breath and gets back up.',
  },
  michael: {
    role: 'Hoodie up, hanging round Fleming Park',
    lines: [
      ['Hey. You would not have any codeine on you? No? Yeah. Fair enough.'],
      ['Have you seen Nathan lately? Or Rose? I have not heard from either of them in ages.'],
      ['Tell Rose I said hi if you see her. And Nathan. Tell Nathan too.'],
    ],
    heartScenes: {
      3: ['You tell Michael that Rose is over on Donald St and Nathan runs Rusty round the athletics track. He looks really relieved. "I will text them. I will actually text them."'],
      6: ['Michael: "Rose messaged me back. We are getting a coffee." He pulls his hood down for the first time. "Thanks for that."'],
    },
    helpsInBattle: 'Michael wanders over, hood up, and stands next to your pet. Just being there. It counts.',
  },
};

// ------------------------------------------------------------ zone taglines
export const EAST_PLACES = {
  holmes: 'Red brick units, the 96 tram and an auto parts shop on the corner.',
  ebnicholson: 'A milk bar, a sandwich parlour and a wall of graffiti.',
  ebmilkbar: 'Potato cakes, cold drinks and a shelf of protection spells.',
  fleming: 'A big oval, a pavilion and dogs off the lead down the bottom end.',
  bowls: 'Two greens, the bocce courts and the hall on Victoria St.',
  eblygon: 'Bars, karaoke, a toy store that is not a toy store and apartments all the way up.',
};

// ------------------------------------------------------------ friends
export const EAST_FRIENDS = {
  adam: {
    loves: ['beans', 'cannoli', 'honey'], likes: ['croissant', 'icedcoffee', 'littlecreatures', 'paperback'], dislikes: ['goon'],
    rewards: { 4: { item: 'beans', n: 1 } },
    assist: { heal: 0.35, selfAtk: 1 },
  },
  chelsea: { loves: ['tennis', 'chicken', 'kombucha'], likes: ['cannoli', 'icedcoffee', 'strawberry'], dislikes: ['goon'], rewards: { 4: { item: 'tennis', n: 2 } }, assist: { selfAtk: 1, heal: 0.2 } },
  sorceress: { loves: ['kombucha', 'honey'], likes: ['lemon', 'cheese', 'icedcoffee'], dislikes: ['vb'], rewards: { 5: { item: 'kombucha', n: 2 } }, assist: { foeAtk: 1, foeDef: 1 } },
  hatman: { loves: ['snag', 'potato'], likes: ['cheese', 'croissant', 'icedcoffee'], dislikes: ['kombucha'], assist: { foeAtk: 1, foeDef: 1 } },
  mrwilkinson: { loves: ['beans', 'draught', 'orangewine'], likes: ['cannoli', 'prosciutto', 'cheese'], dislikes: ['goon'], rewards: { 4: { item: 'beans', n: 1 } }, assist: { foeAtk: 1 } },
  tradie: { loves: ['snag', 'vb', 'icedcoffee'], likes: ['potato', 'cheese', 'croissant'], dislikes: ['kombucha'], rewards: { 4: { item: 'snag', n: 2 } }, assist: { selfDef: 1, damage: 0.12 } },
  concetta: { loves: ['lemon', 'tomato', 'olive'], likes: ['basil', 'zucchini', 'flowers', 'egg'], dislikes: ['takis'], rewards: { 3: { item: 'egg', n: 3 } }, assist: { damage: 0.2 } },
  abbysaunt: { loves: ['honey', 'flowers', 'paperback'], likes: ['kombucha', 'lemon', 'croissant'], dislikes: ['goon'], rewards: { 4: { item: 'honey', n: 1 } }, assist: { heal: 0.4 } },
  michael: { loves: ['icedcoffee', 'potato'], likes: ['snag', 'cannoli', 'croissant'], dislikes: ['kombucha'], assist: { selfDef: 1 } },
};

// ------------------------------------------------------------ shops
export const EAST_SHOPS = {
  spells: { name: 'East Brunswick Take Away and Milk Bar', where: 'Nicholson St, Brunswick East', tabs: ['spells', 'treats', 'gifts', 'remedies'], remedies: ['laxatives'], treats: ['cannoli', 'prosciutto', 'egg', 'cheese', 'snag'], gifts: ['kombucha', 'honey', 'beans', 'parmigiano', 'icedcoffee'] },
};

// ------------------------------------------------------------ items
export const EAST_ITEMS = {
  cannoli:    { name: 'Cannoli', price: 6, desc: 'Ricotta, pistachio and icing sugar on your nose. The milk bar gets them in from Lygon St.' },
  prosciutto: { name: 'Prosciutto', price: 8, desc: 'Sliced so thin you can read through it. Every dog in Brunswick East knows that door.' },
  egg:        { name: 'Free-range egg', price: 3, desc: 'From Concetta\'s chooks. Still warm. Gina would like it back.' },
  parmigiano: { name: 'Wedge of parmigiano', price: 12, gift: true, desc: 'Aged two years. Anything younger is for children, apparently.' },
  beans:      { name: 'Bag of coffee beans', price: 16, gift: true, desc: 'Roasted up the road. Tasting notes of stone fruit and rent.' },
  honey:      { name: 'Merri Creek honey', price: 10, gift: true, desc: 'From the hives by the creek. The bees commute about three kilometres.' },
  kombucha:   { name: 'Kombucha', price: 7, gift: true, desc: 'Homebrewed ginger kombucha. Fizzy, sour and very good for you, apparently.' },
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
export const EAST_MOVES = {
  soggy:        { name: 'Soggy Bottom', type: 'smelly', power: 45, anim: 'stink', text: '{u} has been in the bag since breakfast. {t} gets the full soggy.' },
  beetroot:     { name: 'Beetroot Stain', type: 'park', power: 0, effect: { foeDef: 1 }, anim: 'gust', text: 'A slice of beetroot slides out of {u} and stains {t} for life.' },
  clingwrap:    { name: 'Cling Wrap', type: 'plastic', power: 0, effect: { heal: 0.3 }, anim: 'heal', text: '{u} wraps itself back up tight. Fresh as.' },
  mysterylolly: { name: 'Mystery Lolly', type: 'fairy', power: 50, anim: 'beam', text: '{u} flings a lolly at {t}. Nobody knows what flavour it was. Not even {t}.' },
  sugarrush:    { name: 'Sugar Rush', type: 'caffeine', power: 0, effect: { selfAtk: 1 }, anim: 'shout', text: '{u} has had too many red frogs. Way too many.' },
  chewytoffee:  { name: 'Chewy Toffee', type: 'plastic', power: 40, effect: { foeAtk: 1 }, anim: 'bite', text: '{u} glues {t}\'s jaws together with a toffee.' },
  buzz:         { name: 'Big Buzz', type: 'psychic', power: 45, anim: 'shout', text: '{u} buzzes in a colour {t} has never seen before.' },
  sting:        { name: 'Sting', type: 'park', power: 50, anim: 'lunge', text: '{u} stings {t}. Everything goes a bit paisley.' },
  kaleidoscope: { name: 'Kaleidoscope', type: 'psychic', power: 0, effect: { foeDef: 1 }, anim: 'beam', text: '{u} spins and {t} sees seventeen bees. Seventeen.' },
  whereparty:   { name: 'Where Is The Party', type: 'psychic', power: 0, effect: { foeAtk: 1 }, anim: 'shout', text: '{u} asks {t} where the September Babies party is. {t} does not know. Nobody knows.' },
  happybday:    { name: 'Happy Birthday', type: 'fairy', power: 45, anim: 'shout', text: '{u} sings Happy Birthday at {t}. Badly. And loudly.' },
  partypie:     { name: 'Party Pie', type: 'old', power: 0, effect: { heal: 0.3 }, anim: 'heal', text: '{u} finds a party pie in its pocket. Still warm, somehow.' },
  craneswing:   { name: 'Swinging Load', type: 'steel', power: 55, anim: 'lunge', text: '{u} swings a pallet of bricks right at {t}.' },
  concrete:     { name: 'Concrete Pour', type: 'rock', power: 45, effect: { foeAtk: 1 }, anim: 'dig', text: '{u} pours a slab over {t}\'s feet. Another eight storeys coming.' },
  reversing:    { name: 'Beep Beep Beep', type: 'steel', power: 0, effect: { selfDef: 1 }, anim: 'shout', text: '{u} beeps for a very long time. Nobody can think.' },
  bowl:         { name: 'Bowl', type: 'rock', power: 50, anim: 'lunge', text: '{u} sends a bowl down the green. It curves, impossibly, into {t}.' },
  bias:         { name: 'Bias', type: 'old', power: 0, effect: { foeDef: 1 }, anim: 'gust', text: '{u} explains the bias of a bowl to {t}. For twenty minutes.' },
  barefoot:     { name: 'Barefoot Friday', type: 'old', power: 40, anim: 'hop', text: '{u} kicks off its shoes and stomps on {t}.' },
};

export const EAST_ENEMIES = {
  sandwich: {
    faces: 'front',
    name: 'Milk Bar Sandwich', type: ['old', 'smelly'], stats: { hp: 66, attack: 58, defence: 60, speed: 35, special: 50 },
    moves: ['soggy', 'beetroot', 'clingwrap'], drop: ['cheese', 0.3],
  },
  surprisecandy: {
    faces: 'front',
    name: 'Surprise Candy', type: ['fairy', 'plastic'], stats: { hp: 58, attack: 50, defence: 55, speed: 70, special: 66 },
    moves: ['mysterylolly', 'sugarrush', 'chewytoffee'],
  },
  pint: {
    faces: 'front',
    name: 'Pint o\' Beer', type: 'booze', stats: { hp: 68, attack: 62, defence: 58, speed: 42, special: 55 },
    moves: ['hiccup', 'slosh', 'beergoggles', 'silverpillow'],
  },
  psychbee: {
    name: 'Psychedelic Bee', type: ['psychic', 'park'], stats: { hp: 50, attack: 58, defence: 44, speed: 78, special: 62 },
    moves: ['buzz', 'sting', 'kaleidoscope'], drop: ['honey', 0.2],
  },
  partyguest: {
    faces: 'front',
    name: 'Lost Party Guest', type: ['booze', 'fairy'], stats: { hp: 60, attack: 52, defence: 50, speed: 45, special: 58 },
    moves: ['whereparty', 'happybday', 'hiccup', 'partypie'],
  },
  crane: {
    faces: 'front',
    name: 'Tower Crane', type: 'steel', stats: { hp: 72, attack: 66, defence: 70, speed: 25, special: 35 },
    moves: ['craneswing', 'concrete', 'reversing'],
  },
  bowler: {
    faces: 'front',
    name: 'Lawn Bowler', type: ['old', 'rock'], stats: { hp: 64, attack: 60, defence: 62, speed: 30, special: 50 },
    moves: ['bowl', 'bias', 'barefoot', 'grumble'], drop: ['snag', 0.2],
  },
};

export const EAST_FOE_TEXT = {
  sandwich: { appear: 'Hatman unwraps a ham, cheese and tomato sandwich from the milk bar. It looks ready.', leave: 'is wrapped back up for later.' },
  surprisecandy: { appear: 'Mr Wilkinson slides a bowl of mixed lollies down the bar. Something in there moves.', leave: 'goes back on the bar for the next customer.' },
  pint: { appear: 'A pint o\' beer, poured perfectly, with a head like a cloud.', leave: 'is sipped down to the bottom.' },
  psychbee: { appear: 'A huge bee buzzes out of the flowers. It is every colour at once.', leave: 'drifts off in a cloud of swirls.' },
  partyguest: { appear: 'A very lost guest from the September Babies party stumbles out of the bushes. "Is this the party?"', leave: 'wanders off to find the party. Wrong way.' },
  crane: { appear: 'A tower crane swings round over the new apartments. It has noticed you.', leave: 'goes back to building eight more storeys.' },
  bowler: { appear: 'A lawn bowler in crisp whites lines up a bowl. At you.', leave: 'heads in for a shandy.' },
};

export const EAST_TRAINERS = {
  adam: { name: 'Adam', prize: 'chloe', team: [['pet:chloe', 10]] },
  hatman: { name: 'Hatman', intro: 'Hatman wants to battle! Probably. It is hard to tell.', sendOut: 'He unwraps the {f}.', team: [['sandwich', 10]], reward: { cheese: 1 }, money: 30 },
  mrwilkinson: { name: 'Mr Wilkinson', intro: 'Mr Wilkinson wants to shout you a round!', sendOut: 'He slides the {f} down the bar.', team: [['surprisecandy', 10], ['pint', 11]], reward: { beans: 1 }, money: 50 },
};

// Who you can meet in Brunswick East's tall grass. Lygon St is all concrete.
export const EAST_ENCOUNTERS = [
  { id: 'psychbee', lv: [6, 9], weight: 4, day: true, zones: ['fleming', 'holmes'] },
  { id: 'partyguest', lv: [6, 9], weight: 3, zones: ['fleming', 'ebnicholson'] },
  { id: 'crane', lv: [7, 9], weight: 3, day: true, zones: ['holmes', 'ebnicholson'] },
  { id: 'bowler', lv: [7, 9], weight: 5, day: true, zones: ['bowls'] },
  { id: 'scooter', lv: [6, 9], weight: 2 },
  { id: 'ibis', lv: [6, 8], weight: 2 },
  { id: 'alleycat', lv: [6, 9], weight: 2 },
  { id: 'possum', lv: [7, 9], weight: 2, night: 3 },
];
