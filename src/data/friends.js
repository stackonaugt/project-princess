// Friendships with townsfolk. Chat once a day and give them a gift once a
// day (like the pets). 25 points per heart, up to 10 hearts.
//
//   loves / likes / dislikes   item ids (treats and crops)
//   events   { hearts: [lines] } little scenes the first time you chat at that many hearts
//            (reward: { item, n } or { money }) given at the end of an event
//   assist   at 4+ hearts they may turn up to help in a battle near where they
//            live (same suburb), at random, once per battle:
//            { line, heal | selfAtk | selfDef | foeAtk | foeDef | damage }
// Anyone in npcs.js without an entry here still has hearts, with generic tastes.

export const FRIEND_POINTS = { talk: 10, love: 40, like: 20, neutral: 8, dislike: -10 };
export const ASSIST_HEARTS = 4;

export const FRIENDS = {
  trish: {
    loves: ['strawberry', 'flowers'], likes: ['tomato', 'basil', 'lemon', 'moscato'], dislikes: ['sardine'],
    events: {
      2: ['Trish: "Come in, come in. I made too much lasagne. I always make too much lasagne."', 'You leave with a container. It is still warm.'],
      4: ['Trish shows you a photo album. Helen at six, dressed as a poodle for Book Week.', '"She was always going to end up with Princess, wasn\'t she."'],
      6: ['Trish: "You are family now, love. That means you get the good tupperware. The one with the lid."'],
    },
    rewards: { 2: { item: 'chicken', n: 2 } },
    assist: { line: 'Trish turns up with a casserole. Everyone feels better.', heal: 0.45 },
  },
  gordon: {
    loves: ['byzbook', 'olive'], likes: ['seedling', 'pumpkin', 'tomato', 'coopers'], dislikes: ['hahn'],
    events: {
      2: ['Gordon: "Come and see the fig." It is enormous. "Planted it in 1986. Older than Helen\'s first car, and it runs better."'],
      4: ['Gordon shows you a book of mosaics from Ravenna. "Byzantium. A thousand years. They put gold behind everything. Even the saints."', '"Imagine a tram shelter done like that." You can, now.'],
      6: ['Gordon gives you a cutting from the fig, wrapped in wet newspaper. "Plant it somewhere it can get big. Trees need room. So do people."'],
    },
    rewards: { 4: { item: 'seedling', n: 2 }, 6: { item: 'olive', n: 1 } },
    assist: { line: 'Gordon starts explaining the Hagia Sophia dome. The foe sits down to listen.', foeAtk: 2 },
  },
  gaz: {
    loves: ['snag', 'vb'], likes: ['tomato', 'chicken', 'draught'], dislikes: ['orangewine'],
    events: {
      2: ['Gaz lets you work the tongs for five minutes. Onions on the bottom. You are a natural.'],
      4: ['Gaz: "Eleven years of sizzles. Paid for the club\'s defib. Saved a bloke\'s life last winter." He goes quiet. "Snag?"'],
      6: ['Gaz gives you a Sizzle Crew apron. It is the highest honour in Laverton.'],
    },
    rewards: { 2: { item: 'snag', n: 2 } },
    assist: { line: 'Gaz lobs a snag in bread. Perfect spiral. Energy restored.', heal: 0.3, selfAtk: 1 },
  },
  binman: {
    loves: ['zucchini', 'greatnorthern'], likes: ['snag', 'potato', 'xxxx'], dislikes: ['croissant'],
    events: {
      3: ['Bin Man: "Want to know a secret? I name every bin on my route. That one\'s Kevin."'],
      6: ['Bin Man lets you ride in the truck for one street. You will never be the same.'],
    },
    assist: { line: 'The Bin Man\'s truck reverses in, beeping. Everyone panics.', damage: 0.2 },
  },
  rose: {
    loves: ['paperback', 'orangewine'], likes: ['croissant', 'flowers', 'icedcoffee', 'sardine'], dislikes: ['vb'],
    events: {
      2: ['Rose: "Long week in the Senate office. Three inquiries, two media releases, one senator who replies to emails in all caps."', '"Salami does not care about any of it. That is why I love her."'],
      4: ['Rose lends you a novel with her notes in the margins. "Bring it back. The notes are the best part."'],
      6: ['Rose: "If we ever get a decent renters\' rights bill through, I am framing it. Salami can sit on it."'],
    },
    rewards: { 4: { item: 'paperback', n: 1 } },
    assist: { line: 'Rose drafts the foe a strongly worded letter. It reads it and wilts.', foeAtk: 1, foeDef: 1 },
  },
  slinks: {
    loves: ['penfolds', 'wolfblass', 'orangewine', 'chianti'], likes: ['jacobs', 'yellowtail', 'carrot', 'paperback'], dislikes: ['goon', 'vb'],
    events: {
      2: ['Slinks: "Public service. Policy. I write briefs that ministers do not read." She pours a glass. "Spooky reads them. She has notes."'],
      4: ['Slinks takes you to a wine bar on Lygon St. She orders in a voice you have never heard before. The sommelier is scared of her.'],
      6: ['Slinks: "Spooky likes you. That means I have to like you. Fine. You can come to Friday wine."'],
    },
    rewards: { 4: { item: 'yellowtail', n: 1 } },
    assist: { line: 'Slinks swirls her wine and gives the foe a look. It reconsiders everything.', foeDef: 2 },
  },
  mem: {
    loves: ['seedling', 'icedcoffee', 'guinness'], likes: ['strawberry', 'basil', 'flowers', 'moscato'], dislikes: ['goon'],
    events: {
      2: ['Mem: "My PhD is on urban frogs. Brunswick has more frogs than you think. They hide in the drains and judge us."'],
      4: ['Mem takes you along on a frog survey at dusk. She can tell four species apart by their croak. You can tell none.'],
      6: ['Mem: "Corni and I are running the Merri Creek trail on Sunday. Come. He will cry at the end. He always cries at the end."'],
    },
    rewards: { 4: { item: 'icedcoffee', n: 2 } },
    assist: { line: 'Mem identifies the foe\'s species out loud, with its Latin name. It feels very seen.', foeAtk: 1, foeDef: 1 },
  },
  corni: {
    loves: ['guinness', 'coburglager'], likes: ['croissant', 'potato', 'mountaingoat', 'icedcoffee'], dislikes: ['hahn', 'goon'],
    events: {
      2: ['Corni: "In Germany the beer is good and the trains are on time. Here the beer is fine and the trains are a mood."', '"But here there is Mem. So I stay."'],
      4: ['Corni pours you a Guinness and makes you wait. "Two minutes. It settles. You cannot rush a Guinness. Or a good friend."'],
      6: ['Corni: "Mem and I run the Merri Creek trail on Sundays. You come next week. I will carry the Guinness for after. Prost!"'],
    },
    rewards: { 2: { item: 'guinness', n: 1 }, 6: { item: 'guinness', n: 2 } },
    assist: { line: 'Corni hurls a can of Guinness. "PROST!" It hits the foe and foams everywhere.', damage: 0.18, foeDef: 1 },
  },
  sinead: {
    loves: ['moscato', 'strawberry', 'icedcoffee'], likes: ['flowers', 'tennis', 'gaytime', 'yellowtail'], dislikes: ['sardine'],
    events: {
      2: ['Sinead: "Social work is mostly paperwork and phone calls. And then one day a family gets housed and it is all worth it."'],
      4: ['Sinead sits with you on the unit steps, vaping something called Mango Ice. "Do not tell my mum. Or my clients. Or Seb."'],
      6: ['Sinead: "You\'re basically on the lease now. Poppy has decided. I have filed the paperwork. In my head."'],
    },
    rewards: { 4: { item: 'tennis', n: 2 } },
    assist: { line: 'Sinead blows a massive mango vape cloud. The foe cannot see a thing.', foeAtk: 1, selfDef: 1 },
  },
  tim: {
    loves: ['modeltrain', 'chianti'], likes: ['croissant', 'cheese', 'coopers', 'paperback'], dislikes: ['hahn'],
    events: {
      2: ['Tim: "Union organiser. Today I signed up a whole call centre. Tomorrow, the world. Or at least the car park."'],
      4: ['Tim shows you his photos of Rome. Two hundred of the Forum. Forty of trains. "The Roma Termini platforms, look at them."'],
      6: ['Tim: "Nicholas and I talked. You\'re invited to Stanley\'s birthday. There is a cake. He will not eat it. There will be a toast to solidarity."'],
    },
    rewards: { 6: { item: 'chianti', n: 1 } },
    assist: { line: 'Tim calls a snap stop-work meeting. The foe downs tools.', foeAtk: 2 },
  },
  nicholas: {
    loves: ['icedcoffee', 'paperback'], likes: ['chianti', 'croissant', 'cheese', 'moscato'], dislikes: ['snag'],
    events: {
      2: ['Nicholas: "Law school by night, union office by day. I read contracts for fun now. Something has gone wrong with me."'],
      4: ['Nicholas shows you a video of himself dancing, years ago. Leaps. Actual leaps. "Do not tell Tim you have seen this. He cries."'],
      6: ['Nicholas: "When I am admitted, my first case is Stanley versus the electric blanket. He wants custody."'],
    },
    rewards: { 4: { item: 'icedcoffee', n: 1 } },
    assist: { line: 'Nicholas raises an objection. "Sustained!" says nobody, but the foe is rattled.', foeDef: 1, selfAtk: 1 },
  },
  olly: {
    loves: ['snag', 'vb'], likes: ['seedling', 'tomato', 'potato', 'draught'], dislikes: ['orangewine'],
    events: {
      2: ['Olly: "Twelve years at Bunnings. I know where every hinge in this warehouse lives. Every single one."'],
      4: ['Olly gives you a red apron with your name on it. "Honorary team member. You still have to pay for things."'],
      6: ['Olly: "Best thing about this job? Someone comes in for one screw and leaves with a veggie patch. Changes their life."'],
    },
    rewards: { 4: { item: 'fertiliser', n: 3 } },
    assist: { line: 'Olly turns up with the sausage sizzle tongs. One snag, perfectly cooked, onions on the bottom.', heal: 0.35 },
  },
  ed: {
    loves: ['cheese', 'coopers'], likes: ['chicken', 'croissant', 'paperback'], dislikes: ['moscato'],
    events: {
      2: ['Ed: "Twenty years selling leads. I can tell what a dog is like by how its human picks a collar."'],
      4: ['Ed polishes his glasses, slowly. "You treat those pets right. I can tell. Have a sample." He winks.'],
      6: ['Ed: "If I ever retire, the shop goes to someone who cares. Not a chain. Someone like you." He means it.'],
    },
    rewards: { 4: { money: 25 } },
    assist: { line: 'Ed slides over a free sample from the counter jar. "Shh."', heal: 0.35 },
  },
  macca: {
    loves: ['coburglager', 'mountaingoat'], likes: ['snag', 'croissant', 'potato'], dislikes: ['goon'],
    events: {
      3: ['Macca: "Thirty years behind this counter. Seen Brunswick go from sheds to sourdough. The Guinness drinkers never change."'],
      5: ['Macca slips you a can of something from a tiny brewery in Coburg. "On the house. Don\'t tell the boss. I\'m the boss."'],
    },
    rewards: { 5: { item: 'coburglager', n: 1 } },
    assist: { line: 'Macca rolls a keg out the side door. It thunders past the foe, who dives out of the way.', foeDef: 1, damage: 0.12 },
  },
  wen: {
    loves: ['seedling', 'gloves', 'carrot'], likes: ['basil', 'zucchini', 'potato', 'fertiliser'], dislikes: ['croissant'],
    events: {
      2: ['Wen: "The garden belongs to everyone who turns up. That\'s the whole idea."'],
      4: ['Wen shows you the seed library. People leave seeds, take seeds. Nobody owns it.'],
      6: ['Wen: "Working bee on Saturday. Bring the twins. Bring the dogs. Bring the ghost bunny."'],
    },
    rewards: { 2: { item: 'carrot', n: 3 } },
    assist: { line: 'Wen chucks a handful of compost. Rich, warm, and devastating.', damage: 0.15, heal: 0.15 },
  },
  dimitri: {
    loves: ['lemon', 'melbbitter'], likes: ['potato', 'chilli', 'tomato'], dislikes: ['basil'],
    events: {
      2: ['Dimitri: "Forty years in this milk bar. Seen it all. Except the skyrail. Didn\'t see that coming."'],
      5: ['Dimitri gives you a Golden Gaytime from the back freezer. "Don\'t tell the kids."'],
    },
    assist: { line: 'Dimitri sends over a Paddle Pop. Your pet is revitalised.', heal: 0.3 },
  },
  pina: {
    loves: ['tomato', 'basil', 'olive'], likes: ['lemon', 'zucchini', 'chianti'], dislikes: ['goon'],
    events: {
      2: ['Nonna Pina: "You grow your own basil now? Finally, someone listens."'],
      4: ['Nonna Pina teaches you her sugo. The secret is a whole Sunday.'],
    },
    rewards: { 4: { item: 'lemon', n: 3 } },
    assist: { line: 'Nonna Pina feeds your pet a meatball. Mangia!', heal: 0.4 },
  },
  hipster: {
    loves: ['orangewine', 'moondog'], likes: ['basil', 'chilli', 'croissant'], dislikes: ['vb', 'snag'],
    events: { 3: ['Hipster: "Your basil is... actually good. Do not tell anyone I said that."'] },
    assist: { line: 'The Hipster explains the foe is "derivative". It is crushed.', foeAtk: 1 },
  },
  golfer: {
    loves: ['crown', 'pumpkin'], likes: ['snag', 'tennis', 'xxxx'], dislikes: ['chilli'],
    events: { 3: ['The golfer next door: "Hole in one, 1987. Lost the ball in the celebration. And a tooth."'] },
    assist: { line: 'The golfer next door yells FORE! Everyone ducks except your pet.', foeDef: 1, selfAtk: 1 },
  },
};

export const GENERIC_FRIEND = { loves: [], likes: ['croissant', 'snag', 'tomato', 'strawberry', 'flowers', 'gaytime', 'draught'], dislikes: [] };
export const friendInfo = id => FRIENDS[id] || GENERIC_FRIEND;
