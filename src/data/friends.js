// Friendships with townsfolk. Chat once a day and give them a gift once a
// day (like the pets). 25 points per heart, up to 10 hearts.
//
//   loves / likes / dislikes   item ids (treats and crops)
//   events   { hearts: [lines] } little scenes the first time you chat at that many hearts
//            (reward: { item, n } or { money }) given at the end of an event
//   assist   at 4+ hearts you can call them once per battle (Call a friend):
//            { line, heal | selfAtk | selfDef | foeAtk | foeDef | damage }
// Anyone in npcs.js without an entry here still has hearts, with generic tastes.

export const FRIEND_POINTS = { talk: 10, love: 40, like: 20, neutral: 8, dislike: -10 };
export const ASSIST_HEARTS = 4;

export const FRIENDS = {
  trish: {
    loves: ['strawberry', 'croissant'], likes: ['tomato', 'basil', 'lemon'], dislikes: ['sardine'],
    events: {
      2: ['Trish: "Come in, come in. I made too much lasagne. I always make too much lasagne."', 'You leave with a container. It is still warm.'],
      4: ['Trish shows you a photo album. Helen at six, dressed as a poodle for Book Week.', '"She was always going to end up with Princess, wasn\'t she."'],
      6: ['Trish: "You are family now, love. That means you get the good tupperware. The one with the lid."'],
    },
    rewards: { 2: { item: 'chicken', n: 2 } },
    assist: { line: 'Trish turns up with a casserole. Everyone feels better.', heal: 0.45 },
  },
  gordon: {
    loves: ['pumpkin', 'snag'], likes: ['potato', 'zucchini'], dislikes: ['basil'],
    events: {
      2: ['Gordon: "Want to see the shed?" You do. It is incredible. Four thousand jars of screws, sorted.'],
      4: ['Gordon teaches you to sharpen a mower blade. You do not own a mower. He does not care.'],
      6: ['Gordon: "Paddy still has my ladder." A long pause. "You can have the other ladder. You\'re all right."'],
    },
    rewards: { 4: { money: 30 } },
    assist: { line: 'Gordon tells a very long story about agapanthus. The foe loses the will to fight.', foeAtk: 2 },
  },
  gaz: {
    loves: ['snag', 'potato'], likes: ['tomato', 'chicken'], dislikes: ['strawberry'],
    events: {
      2: ['Gaz lets you work the tongs for five minutes. Onions on the bottom. You are a natural.'],
      4: ['Gaz: "Eleven years of sizzles. Paid for the club\'s defib. Saved a bloke\'s life last winter." He goes quiet. "Snag?"'],
      6: ['Gaz gives you a Sizzle Crew apron. It is the highest honour in Laverton.'],
    },
    rewards: { 2: { item: 'snag', n: 2 } },
    assist: { line: 'Gaz lobs a snag in bread. Perfect spiral. Energy restored.', heal: 0.3, selfAtk: 1 },
  },
  binman: {
    loves: ['zucchini', 'potato'], likes: ['snag', 'tennis'], dislikes: ['croissant'],
    events: {
      3: ['Bin Man: "Want to know a secret? I name every bin on my route. That one\'s Kevin."'],
      6: ['Bin Man lets you ride in the truck for one street. You will never be the same.'],
    },
    assist: { line: 'The Bin Man\'s truck reverses in, beeping. Everyone panics.', damage: 0.2 },
  },
  rose: {
    loves: ['sardine', 'strawberry'], likes: ['croissant', 'chilli'], dislikes: ['potato'],
    events: {
      2: ['Rose: "Salami was a foundling, you know. Turned up in the stairwell with one ear inside out."', '"She chose me. I had no say in it."'],
      4: ['Rose lends you her purple sunnies for the afternoon. You have never looked cooler.'],
      6: ['Rose: "Salami brought me a whole sausage today. Stolen, obviously. Proudest day of my life."'],
    },
    rewards: { 4: { item: 'sardine', n: 2 } },
    assist: { line: 'Rose yells "GO ON, GET IT!" from the sidelines. Your pet feels unstoppable.', selfAtk: 2 },
  },
  slinks: {
    loves: ['carrot', 'chilli'], likes: ['lemon', 'tomato'], dislikes: ['snag'],
    events: {
      2: ['Slinks: "Spooky only comes out properly at night. She is not shy. She is selective."'],
      5: ['Slinks shows you a photo where Spooky is in two places at once. You look for a long time.'],
    },
    assist: { line: 'Slinks flickers the streetlight. The foe gets a fright.', foeDef: 2 },
  },
  mem: {
    loves: ['croissant', 'chilli'], likes: ['tomato', 'basil'], dislikes: ['zucchini'],
    events: {
      2: ['Mem: "Corni names every pigeon on Hope St. There are forty. He knows all of them."'],
      4: ['Mem takes you to the brewery for one lemonade. It is a nice afternoon.'],
      6: ['Mem: "You\'re one of us now. That means you have to come to trivia. We lose every week."'],
    },
    assist: { line: 'Mem stares down the foe through wrap sunglasses. It backs off.', foeAtk: 1, foeDef: 1 },
  },
  corni: {
    loves: ['strawberry', 'basil'], likes: ['carrot', 'feather'], dislikes: ['sardine'],
    events: {
      2: ['Corni introduces you to the toy monkey. Its name is Gerald. Gerald is shy.'],
      4: ['Corni: "Gerald says you can hold him." You hold Gerald. It is an honour.'],
      6: ['Corni gives you a friendship bracelet made from tram ticket stubs. Old ones. Very rare.'],
    },
    rewards: { 6: { item: 'feather', n: 1 } },
    assist: { line: 'Corni waves Gerald the monkey at the foe. Nobody knows why, but it works.', selfDef: 2 },
  },
  sinead: {
    loves: ['strawberry', 'croissant'], likes: ['tomato', 'basil', 'lemon'], dislikes: ['sardine'],
    events: {
      2: ['Sinead: "Poppy ate a whole bar of soap once. Burped bubbles for a day. Unbothered."'],
      4: ['Sinead lends you her round sunnies. "They suit you. Keep them till Sunday."'],
      6: ['Sinead: "You\'re basically on the lease now. Poppy has decided."'],
    },
    rewards: { 4: { item: 'tennis', n: 2 } },
    assist: { line: 'Sinead throws a tennis ball. Your pet goes absolutely feral for it.', selfAtk: 1, heal: 0.15 },
  },
  tim: {
    loves: ['basil', 'tomato'], likes: ['croissant', 'cheese'], dislikes: ['chilli'],
    events: {
      2: ['Tim: "Stanley watches the news with us. He sighs at the economy. Every time."'],
      4: ['Tim does your hair. You did not ask. It looks incredible.'],
      6: ['Tim: "Nicholas and I talked. You\'re invited to Stanley\'s birthday. There is a cake. He will not eat it."'],
    },
    assist: { line: 'Tim critiques the foe\'s outfit. Its confidence crumbles.', foeDef: 2 },
  },
  nicholas: {
    loves: ['cheese', 'croissant'], likes: ['basil', 'strawberry'], dislikes: ['snag'],
    events: {
      2: ['Nicholas: "I do the commentary. Stanley does the judging. Tim does the battling. It is a system."'],
      5: ['Nicholas reads you a passage from a very long book. You feel smarter. Stanley approves.'],
    },
    assist: { line: 'Nicholas commentates the battle beautifully. Your pet plays up to the crowd.', selfAtk: 1, selfDef: 1 },
  },
  olly: {
    loves: ['croissant', 'pumpkin'], likes: ['chicken', 'carrot'], dislikes: ['lemon'],
    events: {
      2: ['Olly: "Kevin the goldfish is eleven. Older than the shop. Older than my lease, which is saying something."'],
      4: ['Olly gives you a staff discount card. It does nothing. It is laminated, though.'],
      6: ['Olly: "If I ever get a second shop, you\'re running it." You both laugh. Then Olly gets a business plan out of the drawer.'],
    },
    rewards: { 4: { money: 25 } },
    assist: { line: 'Olly tosses over a sample treat. "On the house. Don\'t tell Kevin."', heal: 0.35 },
  },
  wen: {
    loves: ['carrot', 'tomato'], likes: ['basil', 'zucchini', 'potato'], dislikes: ['croissant'],
    events: {
      2: ['Wen: "The garden belongs to everyone who turns up. That\'s the whole idea."'],
      4: ['Wen shows you the seed library. People leave seeds, take seeds. Nobody owns it.'],
      6: ['Wen: "Working bee on Saturday. Bring the twins. Bring the dogs. Bring the ghost bunny."'],
    },
    rewards: { 2: { item: 'carrot', n: 3 } },
    assist: { line: 'Wen chucks a handful of compost. Rich, warm, and devastating.', damage: 0.15, heal: 0.15 },
  },
  dimitri: {
    loves: ['lemon', 'tomato'], likes: ['potato', 'chilli'], dislikes: ['basil'],
    events: {
      2: ['Dimitri: "Forty years in this milk bar. Seen it all. Except the skyrail. Didn\'t see that coming."'],
      5: ['Dimitri gives you a Golden Gaytime from the back freezer. "Don\'t tell the kids."'],
    },
    assist: { line: 'Dimitri sends over a Paddle Pop. Your pet is revitalised.', heal: 0.3 },
  },
  pina: {
    loves: ['tomato', 'basil'], likes: ['lemon', 'zucchini'], dislikes: ['croissant'],
    events: {
      2: ['Nonna Pina: "You grow your own basil now? Finally, someone listens."'],
      4: ['Nonna Pina teaches you her sugo. The secret is a whole Sunday.'],
    },
    rewards: { 4: { item: 'lemon', n: 3 } },
    assist: { line: 'Nonna Pina feeds your pet a meatball. Mangia!', heal: 0.4 },
  },
  hipster: {
    loves: ['basil', 'chilli'], likes: ['croissant', 'tomato'], dislikes: ['snag'],
    events: { 3: ['Hipster: "Your basil is... actually good. Do not tell anyone I said that."'] },
    assist: { line: 'The Hipster explains the foe is "derivative". It is crushed.', foeAtk: 1 },
  },
  golfer: {
    loves: ['pumpkin', 'potato'], likes: ['snag', 'tennis'], dislikes: ['chilli'],
    events: { 3: ['The golfer next door: "Hole in one, 1987. Lost the ball in the celebration. And a tooth."'] },
    assist: { line: 'The golfer next door yells FORE! Everyone ducks except your pet.', foeDef: 1, selfAtk: 1 },
  },
};

export const GENERIC_FRIEND = { loves: [], likes: ['croissant', 'snag', 'cheese', 'tomato', 'strawberry'], dislikes: [] };
export const friendInfo = id => FRIENDS[id] || GENERIC_FRIEND;
