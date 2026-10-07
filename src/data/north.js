// ============================================================
//  COBURG AND PRESTON. Everything the two northern suburbs add:
//  their people, words, shops, items, wild things and trainers.
// ============================================================
//
// Kept in one file (rather than spread through npcs.js, dialogue.js and the
// rest) so it merges cleanly with work on other suburbs. Each table below is
// merged into the main one of the same kind when that file loads:
//
//   NORTH_NPCS      -> NPCS (npcs.js)          looks, shop, daily gift
//   NORTH_PEOPLE    -> PEOPLE (dialogue.js)    role, lines, hints, heartScenes, helpsInBattle, battle
//   NORTH_FRIENDS   -> FRIENDS (friends.js)    loves / likes / dislikes, rewards, assist
//   NORTH_SHOPS     -> SHOPS (shops.js)
//   NORTH_ITEMS     -> ITEMS (items.js)        icons in src/art/paint/north.js. loved: true = everyone loves it as a present
//   NORTH_MOVES     -> MOVES (moves.js)
//   NORTH_ENEMIES   -> ENEMIES, NORTH_FOE_TEXT -> FOE_TEXT, NORTH_TRAINERS -> TRAINERS (enemies.js)
//   NORTH_PLACES    -> PLACES (dialogue.js)    zone taglines
//
//   An NPC's gift can be a list: they hand over a different one each day (Betty's cooking).
//   An enemy's sendOut replaces the trainer's send-out line for that foe (Alison turning into a slug).
//
// The same rules as dialogue.js: Australian spelling, no em dashes, lines
// under about 140 characters. Everyone here is made up, apart from the places
// themselves and two real friends of the owner: Betty (Ward's partner, Moreland Rd)
// and Alison (Murray Rd). Keep those two affectionate.

// ------------------------------------------------------------ people
export const NORTH_NPCS = {
  // Coburg
  hakan: {
    name: 'Hakan', shop: 'pide', gift: 'pide',
    look: { hair: '#1e1a18', hairStyle: 'short', skin: '#d8a07a', shirt: '#f4f4f0', pants: '#3a3a44', shoes: '#2a2a2a', apron: '#f4efe0', moustache: true },
  },
  layla: {
    name: 'Layla', look: { hair: '#2a1a12', hairStyle: 'wavy', skin: '#e0b090', shirt: '#f4e8ec', blazer: '#e8c8d4', pants: '#f4f4f0', shoes: '#c8a070', lips: '#c0505a', hoops: '#e8c040' },
  },
  merv: {
    name: 'Merv', look: { hair: '#d8d4cc', hairStyle: 'short', skin: '#e8b498', shirt: '#4a5a3a', pants: '#5a4a3a', shoes: '#3a2a1a', glasses: '#6a4a2a', longBeard: '#e8e4dc' },
  },
  deb: {
    name: 'Deb', gift: 'paperback',
    look: { hair: '#8a8e96', hairStyle: 'bob', skin: '#f2c8a8', shirt: '#3a8a7a', shirtPattern: 'stripes', shirtAccent: '#f4efe0', pants: '#2a2a3a', shoes: '#c8443a', glasses: '#c8443a', holding: 'book' },
  },
  tash: {
    name: 'Tash', look: { hair: '#e0b860', hairStyle: 'messybun', skin: '#f2c8a8', shirt: '#e8302a', jersey: ['#e8302a', '#1e1e24'], pants: '#1e1e24', shoes: '#f4f4f0', sunglasses: '#3a8ac8', shades: 'wrap' },
  },
  kostas: {
    name: 'Kostas', look: { hair: '#c8c4bc', hairStyle: 'cap', cap: '#3a5a8a', skin: '#d8a07a', shirt: '#6a7a8a', pants: '#3a3a30', shoes: '#4a3a2a', moustache: true },
  },
  // Preston
  stavros: {
    name: 'Stavros', shop: 'deli',
    look: { hair: '#3a3a3a', hairStyle: 'bald', skin: '#d8a07a', shirt: '#f4f4f0', pants: '#2a2a34', shoes: '#1a1a1a', apron: '#f4f4f0', moustache: true },
  },
  linh: {
    name: 'Linh', shop: 'fruitveg',
    look: { hair: '#1a1410', hairStyle: 'bun', skin: '#e8c098', shirt: '#3a8a3a', pants: '#2a3a5a', shoes: '#4a3a2a', apron: '#2a5a2a', bumbag: '#c8443a' },
  },
  marko: {
    name: 'Marko', gift: 'sardine',
    look: { hair: '#6a4a2a', hairStyle: 'short', skin: '#e8b48a', shirt: '#2a6ab8', pants: '#3a3a44', shoes: '#f4f4f0', apron: '#f4f4f0', beard: true, gloves: '#3a8ac8' },
  },
  greco: {
    name: 'Greco', look: { hair: '#d8d4cc', hairStyle: 'short', skin: '#e8b898', shirt: '#e8902a', collar: true, scarf: '#d86a1a', blazer: '#22284a', pants: '#22284a', shoes: '#1a1a1a', glasses: '#1e1e1e', beret: '#1e1e22' },
  },
  nell: {
    name: 'Nell', shop: 'opshop',
    look: { hair: '#e8e4dc', hairStyle: 'pixie', skin: '#f2c8a8', shirt: '#7a5a8a', blazer: '#c8643a', pants: '#3a3a44', shoes: '#6a4a2a', glasses: '#8a5a9a' },
  },
  inspector: {
    name: 'Myki Inspector', look: { hair: '#2a2a2a', hairStyle: 'short', skin: '#e8b48a', shirt: '#1e2a48', collar: true, blazer: '#1e2a48', pants: '#1e2a48', shoes: '#1a1a1a', hivis: true },
  },
  dimi: {
    name: 'Dimi', gift: 'icedcoffee',
    look: { hair: '#1e1612', hairStyle: 'spiky', skin: '#e0b08a', shirt: '#1e1e24', pants: '#3a4a3a', shoes: '#f4f4f0', apron: '#2a5a4a', stubble: true },
  },
  // Real friends of the owner (keep them affectionate)
  betty: {
    name: 'Betty', gift: ['lasagne', 'roast', 'bananabread', 'shepherds', 'lamington', 'crumble', 'quiche', 'scones'],
    look: { hair: '#141010', hairStyle: 'long', skin: '#8a5a3e', shirt: '#1e1e22', pants: '#1e1e22', shoes: '#2a2a2a', lips: '#7a3a3a' },
  },
  // Meghan Hopper: Bell St regular, pushes her cat in a pram, wins every bake-off.
  meghan: {
    name: 'Meghan Hopper', pram: true,
    look: { hair: '#7a4a2a', hairStyle: 'long', skin: '#f2c8a8', shirt: '#c8302a', blazer: '#2a2a30', pants: '#2a2a30', shoes: '#1e1e22', lips: '#b83a4a' },
  },
  alison: {
    name: 'Alison', look: { hair: '#6a4a2a', hairStyle: 'bob', skin: '#f2c8a8', shirt: '#d8d8d4', pants: '#1e1e24', shoes: '#f4f4f0' },
  },
};

// ------------------------------------------------------------ words
export const NORTH_PEOPLE = {
  hakan: {
    role: 'Bakes pide on Sydney Rd, Coburg, since four every morning',
    lines: [
      ['Welcome! Pide, simit, gözleme. The oven has been going since four. So have I.'],
      ['Spinach and cheese, or meat? Wrong answer. Both. Always both.'],
      ['My father had this oven. Coburg has changed a lot. The oven has not changed at all.'],
      ['Brunswick people come up here and say "it\'s so authentic". It is just Tuesday.'],
    ],
    hints: {
      salami: 'A tabby from Donald St sits outside my back door every morning. She knows exactly when the cheese pide comes out.',
    },
    giftLine: 'Here, still warm. Do not tell me you are full. Nobody is full of pide.',
    heartScenes: {
      2: ['Hakan shows you how to fold a pide into a boat. Yours looks like a shoe. "It is a very good shoe," he says.'],
      5: ['Hakan: "You come every week now. You are a regular. Regulars get the corner bit." He hands you three.'],
    },
    helpsInBattle: 'Hakan jogs over with a hot tray. Your pet smells pide and finds a second wind.',
  },
  layla: {
    role: 'Runs Altar Ego, a bridal shop on Sydney Rd',
    lines: [
      ['Sydney Rd has more bridal shops than anywhere in Australia. Probably. I have not checked. Do not check.'],
      ['Every bride says "something simple". Then she sees the one with the twelve metre train.'],
      ['Paddy is a mayor? Weddings, festivals, ribbon cuttings. He needs a good suit. I know a guy. He is my cousin.'],
    ],
    heartScenes: {
      3: ['Layla lets the twins try on veils. They look like two very small, very confused ghosts. Everyone cries a little.'],
    },
  },
  merv: {
    role: 'Gives tours of the old Pentridge Prison. Knows too much',
    lines: [
      ['HM Prison Pentridge. Opened 1850. Closed 1997. Now it\'s apartments with a "heritage feel". The feel is bluestone. And guilt.'],
      ['Ned Kelly\'s remains ended up buried here. They dug him up again in 2009. Ned has not had a restful retirement.'],
      ['The walls are bluestone, quarried by prisoners. Half of Melbourne\'s gutters are prison labour. Think about that next time it rains.'],
      ['People say the watchtower is haunted. I say it\'s possums. Very angry, very historical possums.'],
    ],
    hints: {
      spooky: 'There\'s a bunny in Brunswick that vanishes through walls. I\'ve seen it. I\'ve seen a lot of things. That bunny is in my top five.',
    },
    heartScenes: {
      3: ['Merv: "My dad was a guard here. Never spoke about it. I give the tours so somebody does."'],
      6: ['Merv takes you up the watchtower. You can see all the way to the city. And every possum on Bell St.'],
    },
    helpsInBattle: 'Merv tells the foe a very long story about 1880s prison reform. It loses the will to fight.',
    battle: {
      challenge: ['Fancy the night tour? Fair warning. The possums in this wall have been here longer than the apartments.', 'They are territorial.'],
      ask: 'Take the night tour?', yes: 'Lead on', no: 'Maybe in daylight',
      win: ['Ha! You\'ve got more nerve than half the guards ever did.', 'Here. A little something from the gift shop.'],
      lose: ['The possums win again. Out you go, through the gift shop.'],
      again: ['Back for the tour? The possums remember you.'],
    },
  },
  deb: {
    role: 'Librarian at Coburg Library',
    lines: [
      ['Library cards are free. Books are free. Wi-fi is free. The air con is free. It is the last free thing in Melbourne.'],
      ['Moreland became Merri-bek in 2022. I have been changing the stamps ever since. I am still finding old ones.'],
      ['Toddler storytime is Tuesdays. It is less "story" and more "time". Lovely, though.'],
      ['Rose from Brunswick has eleven books out. Overdue. I have a file on her. It is a very fond file.'],
    ],
    giftLine: 'From the discard trolley. It is twenty cents in the sale, but for you, free. Libraries are like that.',
    heartScenes: {
      3: ['Deb: "A library is the only place you can just be, without buying anything. Fight for them."'],
      6: ['Deb gives you an old Coburg Library date stamp. It says 1994. It still works.'],
    },
    helpsInBattle: 'Deb says "SHHH" so firmly that the foe sits down and is quiet.',
  },
  tash: {
    role: 'Rides the Upfield bike path. Every day. In lycra',
    lines: [
      ['The Upfield path. Brunswick to Coburg and beyond. Single track trains on one side, single track bikes on the other.'],
      ['E-scooters on the bike path. Every day. I ring my bell. They do not care. Nobody cares about the bell.'],
      ['The Upfield line runs every twenty minutes. If it runs. I am faster. I am always faster.'],
      ['They put the trains up on a skyrail here. Now the level crossings are gone and I have nothing to be angry at. Except scooters.'],
    ],
    hints: {
      salami: 'There\'s a tabby on Donald St in Brunswick who sits in the middle of the lane like she owns it. She probably does.',
    },
    heartScenes: {
      4: ['Tash: "I ride for the climate. And for the cafe at the end. Mostly the cafe."'],
    },
    helpsInBattle: 'Tash rings her bell and blasts past. The foe spins around twice.',
    battle: {
      challenge: ['You look like someone who walks three abreast on a shared path.', 'Let\'s settle this. Lycra versus whatever you\'ve got.'],
      ask: 'Battle Tash?', yes: 'On your bike', no: 'I\'ll keep left',
      win: ['Okay, okay. You can use the path. Keep left. Bell on.', 'Have this. Recovery snack.'],
      lose: ['Too slow! Keep left next time.'],
      again: ['Rematch? I\'ve done forty k today. I\'m warmed up.'],
    },
  },
  kostas: {
    role: 'Fishes at Coburg Lake. Has done since 1971',
    lines: [
      ['Coburg Lake. Merri Creek goes through it, over the old weir. Carp, eels, the odd yabby. And swans who think they own the place.'],
      ['Fifty years I fish here. Caught a lot of carp. Caught one eel this long. Nobody believes me. The eel believes me.'],
      ['The black swans. Beautiful. Also, they will chase you to the car park. Respect the swans.'],
      ['My wife says "Kostas, buy fish at the market like a normal person." Where is the fun in that?'],
    ],
    hints: {
      poppy: 'A little black Frenchie up Plenty Rd at Loddon Ave. Chases ducks. Never catches. My kind of dog.',
    },
    heartScenes: {
      3: ['Kostas shows you his secret spot under the willow. "Tell nobody." Three other men are already fishing there.'],
      6: ['Kostas gives you a tin of his own bait. It smells like a crime. The fish love it.'],
    },
    helpsInBattle: 'Kostas casts a line right over the foe\'s head. It is hooked on the idea of leaving.',
    battle: {
      challenge: ['You want to fish my lake? First, you get past my swan. He is a very good boy. He is a very angry boy.'],
      ask: 'Battle Kostas?', yes: 'Cast off', no: 'Not near the swan',
      win: ['Ah! You have the patience of a real fisherman. Here, sardines. For bait. Or lunch.'],
      lose: ['The swan wins. The swan always wins.'],
      again: ['Again? The swan has been practising. He hisses at his own reflection now.'],
    },
  },
  stavros: {
    role: 'Runs the deli at Preston Market',
    lines: [
      ['Fetta! Kalamatas! Taramosalata! Try, try. You don\'t like, you don\'t buy. You will like.'],
      ['Thirty-two years at this counter. My father before me. Before that, a different counter. Same olives.'],
      ['They want to put eighteen storeys of apartments on the market. Where will I put my olives? On the balcony?'],
      ['Ask your nonna where she buys her fetta. She will say here. If she says somewhere else, she is lying to protect me.'],
    ],
    heartScenes: {
      3: ['Stavros cuts you a slice of something. You do not know what it is. It is the best thing you have eaten all year.'],
      5: ['Stavros: "You are family now. Family pays the same price. But family gets extra olives."'],
    },
    helpsInBattle: 'Stavros leans over the counter with a toothpick of fetta. Your pet is restored. Your pet is in love.',
  },
  linh: {
    role: 'Fruit and veg at Preston Market. Loudest voice in Darebin',
    lines: [
      ['TWO DOLLAR A KILO! Two dollar! Tomato, zucchini, everything! Come, come!'],
      ['You grow vegies? Bring them here. I pay fair. Not like the supermarket. The supermarket pays farmers in tears.'],
      ['My mum had this stall. Now me. Next, my daughter. If the developers let us. If.'],
      ['Saturday morning, half of Preston is here. Prams, nonnas, hipsters with tote bags. Everybody needs mangoes.'],
    ],
    heartScenes: {
      3: ['Linh slips an extra mango in your bag. "For the twins. Don\'t tell the other customers. Actually, tell them. Good for business."'],
    },
    helpsInBattle: 'Linh yells "TWO DOLLAR A KILO!" The foe panics and runs to check the price.',
  },
  marko: {
    role: 'Sells fish at Preston Market',
    lines: [
      ['Fresh today! Snapper, flathead, sardines. The sardines are looking at you. That means they are fresh.'],
      ['You caught a carp at the lake? Mate. Nobody buys carp. Even the carp don\'t want carp.'],
      ['Every cat in Preston knows my name. They don\'t know your name. Think about that.'],
    ],
    hints: {
      salami: 'A tabby from Brunswick. Salami? She came all the way up here once, following my van. Rose had to pick her up.',
    },
    giftLine: 'Here. One sardine. For the cat. Or the dog. Or you. I don\'t ask.',
  },
  greco: {
    role: 'Preston Market regular. Beret, cravat, opinions. Leads the Save Preston Market campaign',
    lines: [
      ['Sign the petition? The market has been here since 1970. It belongs to the people who shop here, not the people who own it.'],
      ['A cravat is not an accessory. It is a statement. The statement is: I have standards.'],
      ['They want a "reimagined market". You cannot reimagine a market. A market is people, and fetta, and arguing about the price of fetta.'],
      ['The beret? Paris, 1974. It has outlived two Holdens and three prime ministers. It will outlive the developers.'],
      ['Organise, don\'t agonise. I got that off a badge in 1982. Still good advice.'],
    ],
    hints: {
      stanley: 'A little grey schnauzer comes through on Saturdays with his two dads from Glasgow Ave. Inspects every stall. Very thorough.',
    },
    heartScenes: {
      2: ['Greco: "Every single stallholder here signed. Every one. That is solidarity. Now you sign too. Use the good pen."'],
      5: ['Greco pins a SAVE PRESTON MARKET badge on you and straightens it twice. "There. Now you look like someone who goes to meetings."'],
    },
    helpsInBattle: 'Greco arrives with forty stallholders and a megaphone. The foe is outnumbered, and underdressed.',
    battle: {
      challenge: ['You look like you might be from the developer.', 'Only one way to find out. Allow me to introduce my wardrobe.'],
      ask: 'Battle Greco?', yes: 'Solidarity', no: 'I\'ll sign instead',
      win: ['Not from the developer, then. They never fight fair. You did.', 'Have some baklava. Stall twelve. Tell them Greco sent you.'],
      lose: ['Ha! Forty years of picket lines and a very good tailor. You don\'t beat Greco.'],
      again: ['Back again? Good. The movement needs people with stamina. And better shoes.'],
    },
  },
  nell: {
    role: 'Volunteers at the Second Act op shop, High St, Preston',
    lines: [
      ['Everything here had a first life. This is its second act. Some of these cardigans are on their fifth.'],
      ['Someone donated a whole box of model trains. Your friend Tim from Reservoir? He bought half. He\'ll be back for the rest.'],
      ['No, the price is the price. Yes, even for the Brunswick people. Especially for the Brunswick people.'],
      ['Every Saturday a young person says "this is vintage". It\'s a cardigan. I wore it in 1987.'],
    ],
    heartScenes: {
      3: ['Nell: "We give the takings to the food bank. Rents are what they are. People are hungry in Preston. Real people."'],
    },
    helpsInBattle: 'Nell throws a handknitted cardigan over your pet. Cosy, warm and a little itchy.',
  },
  inspector: {
    role: 'Authorised Officer. Checks mykis at Preston Station',
    lines: [
      ['Touch on, touch off. That\'s all I ask. That\'s all I\'ve ever asked.'],
      ['People say "the reader didn\'t work". The reader always works. In my heart, the reader always works.'],
      ['I am not the bad guy. I am a guy with a hand-held device. There is a difference.'],
      ['Off duty? I still check. My own kids have to show me their concession cards at dinner.'],
    ],
    helpsInBattle: 'The Myki Inspector asks the foe for its ticket. It does not have one. It leaves in shame.',
    battle: {
      challenge: ['Excuse me. Can I see your myki, please?', 'Hmm. Your pets are not on a concession. That\'s an infringement.'],
      ask: 'Contest the fine?', yes: 'See you in court', no: 'Show my myki',
      win: ['Fine. FINE. Not a fine. No fine. You\'re free to go.', 'Don\'t tell the others. They\'ll all want to battle me.'],
      lose: ['That will be two hundred and something dollars. Payable to the Department. Off you go.'],
      again: ['Tickets please. Oh, it\'s you. Here we go again.'],
    },
  },
  dimi: {
    role: 'Runs the coffee cart at Preston Station',
    lines: [
      ['Coffee before the 7:42? You are already late. Here. Drink fast.'],
      ['They put the station up on the skyrail. My cart stayed down here. I am the ground floor now.'],
      ['I know every commuter by their order. Large cap, extra hot? That is Gary. Gary has a lot going on.'],
    ],
    giftLine: 'Iced coffee, on the house. It is basically breakfast if you squint.',
  },
  betty: {
    role: 'Lives on Moreland Rd with Ward from the bottle shop. Cooks for everyone',
    lines: [
      ['You\'re here! Good. I made too much again. I always make too much. That is the correct amount.'],
      ['Ward is at the bottle shop on Sydney Rd all day. He comes home with a new beer I have never heard of. I still drink tea.'],
      ['Monday, lasagne. Tuesday, a roast. Wednesday, banana bread. I cook whatever is in season and whatever is on special.'],
      ['Pastry takes patience. Cold butter, cold hands. Scones, you can rush. Nobody can tell.'],
      ['Everybody on Moreland Rd knows when I am cooking. They walk slower past the gate. I see them.'],
    ],
    giftLine: 'Here, take this, it\'s still warm. No, you are not full. Nobody leaves my house hungry. Not even the front gate.',
    heartScenes: {
      3: ['Betty: "My recipe book is just a shoebox of cards from everyone on this street. Nonna\'s lasagne. The quiche from next door. Mine is the banana bread."'],
      5: ['Betty puts the kettle on and brings out the good teapot. "Three cups. You stay for all three. That is the rule of this house."'],
      7: ['Betty presses a takeaway container into your hands. "For your mum and dad. Tell them it is from Betty. They will know."'],
      8: ['Betty pulls a card out of the shoebox, the oldest one, soft as cloth. "My Victoria sponge. I don\'t give this to just anyone."'],
    },
    helpsInBattle: 'Betty marches over with a plate of food. Your pet eats and is instantly, completely restored.',
  },
  meghan: {
    role: 'Walks Bell St with her cat Whitlam in a pram. Has run for preselection more times than anyone can count. Wins every bake-off',
    lines: [
      ['Hi! Meghan Hopper. You might know me from the ballot paper. Every ballot paper. Since 2010.'],
      ['This is Whitlam. He prefers the pram. Walking is for cats without ambition.'],
      ['Door knocking is just meeting your neighbours with a clipboard. I love it. My knees do not.'],
      ['The bake-off? Oh, I just throw something together. It\'s nothing. It\'s a nine layer torte, but it\'s nothing.'],
    ],
    heartScenes: {
      3: ['Meghan: "Between us, I don\'t even like winning the bake-off. I like Betty\'s face when I win the bake-off."'],
      6: ['Meghan: "If I ever get preselected, I\'m putting Whitlam on the how-to-vote card. He polls very well with the over sixties."'],
    },
    helpsInBattle: 'Meghan wheels the pram straight at the foe. Whitlam hisses from under the blanket.',
    battle: {
      challenge: ['Oh, a challenge? I never back down from a contest. Ask anyone. Ask the electoral commission.', 'Whitlam! Out of the pram! Well, half out.'],
      ask: 'Battle Meghan and Whitlam?', yes: 'You\'re on', no: 'Maybe after the election',
      win: ['Well! A loss is just a win that hasn\'t been preselected yet.', 'Whitlam is fine. He\'s having a lie down. He was always having a lie down.'],
      lose: ['Another win for the Hopper campaign! I\'ll put it in the newsletter.'],
      again: ['A rematch? I love a second round. And a third. And a recount.'],
    },
  },
  alison: {
    role: 'Lives on Murray Rd, Preston. Standing out the front, being an idiot',
    lines: [
      ['Oh hey. I\'m just standing here. Out the front. Like a normal person. Don\'t look at me.'],
      ['Toastie. Same one. Sun-dried tomato and cheese. Every single day. Why would I change? It is perfect.'],
      ['These are my boob pillows. They are two very thin pillows. I don\'t know why I call them that. I just do.'],
      ['Did you know slugs have about twenty-seven thousand teeth? I think about it all the time. ALL the time.'],
    ],
    heartScenes: {
      3: ['Alison makes you the toastie. The same one. It is, annoyingly, perfect. "Told you."'],
      6: ['Alison: "Okay I\'ll be honest. I\'m not an idiot. I\'m a genius doing an idiot impression." She immediately walks into the gate.'],
    },
    helpsInBattle: 'Alison wanders over, stands directly in front of the foe and just stares. It is deeply unsettling. It works.',
    battle: {
      challenge: ['Oh it\'s you. Wanna fight? I\'ve been standing here for ages. I\'m warmed up.', 'I\'ve got my toastie, my boob pillows, and a secret weapon. Me.'],
      ask: 'Battle Alison?', yes: 'Bring the toastie', no: 'Leave her to it',
      win: ['Whatever. The slug was having an off day. Slugs have off days.', 'Here, have some cheese. I had some left over from the toastie. I always have some left over.'],
      lose: ['HA. Beaten by a sandwich, two pillows and a slug. Go home and think about it.'],
      again: ['Rematch? Same toastie. Same pillows. Same slug. Why change a winning team?'],
    },
  },
};

export const NORTH_PLACES = {
  coburgsyd: 'Pide ovens, bridal gowns and the 19 tram.',
  pidebakery: 'Knead to Know. A wood oven, trays of pide and a queue out the door.',
  coburgmall: 'The Victoria St Mall, the library and the station up on its new skyrail.',
  coburglake: 'Merri Creek, an old bluestone weir and a lake full of swans with attitude.',
  prestonmkt: 'Stalls, shouting, and a campaign to keep it all here.',
  prestonhigh: 'High St: the skyrail station, a coffee cart and a strip of shops.',
  moreland: 'Betty and Ward\'s place on the corner of Lygon St, and the smell of something delicious.',
  murray: 'Alison\'s block on St Georges Rd, the 11 tram and a very empty block of land.',
};

// ------------------------------------------------------------ friends
export const NORTH_FRIENDS = {
  hakan: { loves: ['tomato', 'chilli', 'cheese'], likes: ['basil', 'flowers', 'icedcoffee'], dislikes: ['twinkie'], rewards: { 5: { item: 'pide', n: 3 } }, assist: { heal: 0.35 } },
  layla: { loves: ['flowers', 'moscato', 'ribbon'], likes: ['baklava', 'croissant', 'reeses'], dislikes: ['oldboot', 'goon'] },
  merv: { loves: ['byzbook', 'melbbitter'], likes: ['paperback', 'pide', 'snag'], dislikes: ['mangoice'], rewards: { 6: { item: 'feather', n: 2 } }, assist: { foeAtk: 1 } },
  deb: { loves: ['cloudstreet', 'monkeygrip', 'hangingrock'], likes: ['paperback', 'icedcoffee', 'baklava', 'flowers'], dislikes: ['vb'], rewards: { 6: { item: 'paperback', n: 2 } }, assist: { foeAtk: 1, heal: 0.15 } },
  tash: { loves: ['icedcoffee', 'strawberry'], likes: ['croissant', 'pide', 'stonewood'], dislikes: ['snag', 'goon'], assist: { damage: 0.15 } },
  kostas: { loves: ['sardine', 'redfin', 'eel'], likes: ['bait', 'lemon', 'pide'], dislikes: ['carp'], rewards: { 6: { item: 'bait', n: 5 } }, assist: { foeDef: 1 } },
  stavros: { loves: ['olive', 'lemon', 'tomato'], likes: ['fetta', 'basil', 'chianti'], dislikes: ['cheese'], rewards: { 5: { item: 'olivejar', n: 1 } }, assist: { heal: 0.35 } },
  linh: { loves: ['chilli', 'pumpkin', 'strawberry'], likes: ['zucchini', 'basil', 'icedcoffee'], dislikes: ['oldboot'], rewards: { 3: { item: 'strawberry', n: 2 } }, assist: { foeDef: 1, damage: 0.1 } },
  marko: { loves: ['redfin', 'eel', 'vb'], likes: ['lemon', 'yabby', 'pide'], dislikes: ['carp'] },
  greco: { loves: ['baklava', 'nineteen84', 'seedling'], likes: ['flowers', 'icedcoffee', 'snag', 'paperback'], dislikes: ['orangewine'], assist: { selfAtk: 1, foeAtk: 1 } },
  nell: { loves: ['cardigan', 'flowers', 'jacobs'], likes: ['paperback', 'baklava', 'tomato'], dislikes: ['takis'], assist: { heal: 0.2, selfDef: 1 } },
  inspector: { loves: ['modeltrain', 'icedcoffee'], likes: ['snag', 'croissant'], dislikes: ['goon', 'oldboot'] },
  dimi: { loves: ['croissant', 'baklava'], likes: ['icedcoffee', 'pide', 'drpepper'], dislikes: ['moscato'] },
  betty: { loves: ['flowers', 'olivejar', 'baklava'], likes: ['tomato', 'chilli', 'icedcoffee', 'lemon'], dislikes: ['twinkie'], rewards: { 7: { item: 'roast', n: 3 } }, assist: { heal: 0.5 } },
  meghan: { loves: ['flowers', 'lemon', 'puzzlebook'], likes: ['icedcoffee', 'timtams', 'chicken'], dislikes: ['vb'], assist: { foeDef: 1 } },
  alison: { loves: ['cheese', 'reeses'], likes: ['icedcoffee', 'sambusa', 'tomato'], dislikes: ['basil', 'lemon'], assist: { foeAtk: 1, foeDef: 1 } },
};

// ------------------------------------------------------------ shops
export const NORTH_SHOPS = {
  pide: { name: 'Knead to Know', where: 'Sydney Rd, Coburg', tabs: ['treats', 'gifts'], treats: ['pide', 'cheese', 'croissant'], gifts: ['baklava', 'icedcoffee'] },
  deli: { name: 'Stavros\'s Deli', where: 'Preston Market', tabs: ['treats', 'gifts', 'remedies'], remedies: ['laxatives'], treats: ['fetta', 'cheese', 'chicken', 'sardine'], gifts: ['olivejar', 'baklava'] },
  fruitveg: { name: 'Linh\'s Fruit and Veg', where: 'Preston Market', tabs: ['sell', 'seeds', 'gifts'], seeds: ['tomato', 'zucchini', 'chilli', 'pumpkin', 'strawberry'], gifts: ['flowers', 'seedling'] },
  opshop: { name: 'Second Act Op Shop', where: 'High St, Preston', tabs: ['gifts'], gifts: ['cardigan', 'paperback', 'modeltrain', 'byzbook', 'thermos'] },
};

// ------------------------------------------------------------ items
export const NORTH_ITEMS = {
  pide:     { name: 'Cheese pide', price: 5, desc: 'A boat of bread with cheese and egg, straight from the Sydney Rd wood oven.' },
  fetta:    { name: 'Market fetta', price: 6, desc: 'A salty slab from Stavros\'s deli. Every dog in Preston knows the smell.' },
  baklava:  { name: 'Baklava', price: 6, gift: true, desc: 'Pastry, pistachio and honey. Sticky fingers for an hour.' },
  olivejar: { name: 'Jar of olives', price: 9, gift: true, desc: 'Kalamatas from Preston Market. Stavros says they will change your life.' },
  cardigan: { name: 'Op shop cardigan', price: 8, gift: true, desc: 'Handknitted, mustard, slightly itchy. Somebody\'s nan made it with love.' },
  // Betty's cooking: a different dish each day she sees you. Presents, and everyone loves them (loved: true).
  doro:     { name: 'Doro wat and injera', gift: true, loved: true, desc: 'Betty\'s chicken stew, slow and spicy, on a round of spongy injera. People cry a little.' },
  misir:    { name: 'Misir wat', gift: true, loved: true, desc: 'Betty\'s red lentils, rich with berbere. Gone in about four seconds.' },
  shiro:    { name: 'Shiro', gift: true, loved: true, desc: 'A silky chickpea stew Betty makes when it\'s cold. It is somehow always the right thing.' },
  sambusa:  { name: 'Sambusa', gift: true, loved: true, desc: 'Crisp little pastries full of spiced lentils. Betty folded every single one.' },
  lasagne:  { name: 'Betty\'s lasagne', gift: true, loved: true, art: { kind: 'plate', body: '#c8502a', label: '#f0d070' }, desc: 'Eleven layers. Betty counted. The corner piece, because you are special.' },
  bananabread: { name: 'Banana bread', gift: true, loved: true, art: { kind: 'cake', body: '#b8803a', cap: '#7a4a1a', label: '#f0d070' }, desc: 'Still warm, with a slab of butter melting into it. Betty uses the very brown bananas.' },
  dumplings: { name: 'Pork dumplings', gift: true, loved: true, art: { kind: 'plate', body: '#f0e8d0', label: '#3f8a3e' }, desc: 'Betty learned these from her neighbour. Pleated by hand, every single one. Bring your own vinegar.' },
  lamington: { name: 'Lamingtons', gift: true, loved: true, art: { kind: 'cake', body: '#f0e0b0', cap: '#5a3020', label: '#f4f4f0' }, desc: 'Sponge, chocolate, coconut. Betty says the jam ones are for people who have earned them.' },
  curry:    { name: 'Chicken curry', gift: true, loved: true, art: { kind: 'plate', body: '#e8a030', label: '#f4f0e6' }, desc: 'Betty\'s Friday curry, with rice and a dollop of yoghurt. Mild for the twins. Not that mild.' },
  roast:    { name: 'Roast chicken', gift: true, loved: true, art: { kind: 'plate', body: '#c8803a', label: '#f0d070' }, desc: 'Crispy skin, roast potatoes, gravy in a jug. Betty\'s Sunday roast, any day of the week.' },
  shepherds: { name: 'Shepherd\'s pie', gift: true, loved: true, art: { kind: 'plate', body: '#e8c878', label: '#8a4a2a' }, desc: 'Mince underneath, buttery mash on top, crunchy bits on the corners. The corners are the best bit.' },
  crumble:  { name: 'Apple crumble', gift: true, loved: true, art: { kind: 'cake', body: '#d8a050', cap: '#f4f0e6', label: '#c8302a' }, desc: 'Stewed apples under a golden crumble, with a scoop of ice cream already melting.' },
  quiche:   { name: 'Quiche Lorraine', gift: true, loved: true, art: { kind: 'cake', body: '#f0d070', cap: '#c8903a', label: '#f4f0e6' }, desc: 'Bacon, egg and a very short pastry. Betty says real men eat it. Everyone eats it.' },
  scones:   { name: 'Scones', gift: true, loved: true, art: { kind: 'cake', body: '#f0d8a0', cap: '#d8a860', label: '#c8302a' }, desc: 'Jam first, then cream. Betty will not be taking questions.' },
};

// ------------------------------------------------------------ battles
export const NORTH_MOVES = {
  windsor:     { name: 'Windsor Knot', type: 'leather', power: 55, anim: 'claw', text: '{u} ties itself around {t} in a perfect Windsor. Very tight. Very smart.' },
  flourish:    { name: 'Flourish', type: 'old', power: 0, effect: { selfAtk: 1 }, anim: 'shout', text: '{u} does a little flourish. It feels tremendously well dressed.' },
  tilt:        { name: 'Jaunty Tilt', type: 'psychic', power: 0, effect: { foeAtk: -1 }, anim: 'shout', text: '{u} tilts to one side. {t} feels terribly unsophisticated.' },
  existential: { name: 'Existential Crisis', type: 'psychic', power: 60, anim: 'beam', text: '{u} asks {t} what any of it means, really. {t} has no answer.' },
  touchon:      { name: 'Touch On', type: 'plastic', power: 0, effect: { selfAtk: 1 }, anim: 'shout', text: '{u} touches on. Beep. It feels validated.' },
  insufficient: { name: 'Insufficient Funds', type: 'psychic', power: 55, anim: 'beam', text: '{u} flashes INSUFFICIENT FUNDS at {t}. Devastating.' },
  cardnotread:  { name: 'Card Not Read', type: 'steel', power: 0, effect: { evade: true }, anim: 'fade', text: '"Card not read. Please try again." {u} cannot be reached.' },
  fine:         { name: 'On-the-Spot Fine', type: 'old', power: 65, anim: 'beam', text: '{u} issues {t} with a fine. Two hundred and something dollars. Ouch.' },
  wingbeat:     { name: 'Wing Beat', type: 'park', power: 55, anim: 'gust', text: '{u} beats its huge black wings at {t}.' },
  luxury:       { name: 'Luxury Living', type: 'psychic', power: 45, effect: { foeDef: 1 }, anim: 'beam', text: '{u} promises "luxury living from $899k". {t} suddenly feels very poor.' },
  wonkywheel:   { name: 'Wonky Wheel', type: 'steel', power: 0, effect: { evade: true }, anim: 'fade', text: '{u}\'s wonky wheel sends it veering off sideways. Nobody can predict it.' },
  // Meghan's cat Whitlam, battling from his pram
  doorknock:    { name: 'Door Knock', type: 'old', power: 55, anim: 'lunge', text: '{u} knocks on {t}\'s door three times and asks if it has five minutes.' },
  preselect:    { name: 'Preselection', type: 'psychic', power: 0, effect: { selfAtk: 1 }, anim: 'shout', text: '{u} is preselected! For now. It feels very confident.' },
  pramram:      { name: 'Pram Ram', type: 'steel', power: 60, anim: 'lunge', text: '{u}\'s pram rolls straight into {t}. Brakes are for other cats.' },
  cathiss:      { name: 'Pram Hiss', type: 'street', power: 45, effect: { foeAtk: 1 }, anim: 'shout', text: '{u} hisses from under the blanket. {t} loses its nerve.' },
  // Alison's team
  sundried:     { name: 'Sun-Dried Tomato', type: 'fire', power: 50, anim: 'flame', text: '{u} flings a hot sun-dried tomato at {t}. It sticks.' },
  autismattack: { name: 'Autism Attack', type: 'psychic', power: 60, anim: 'beam', text: '{u} info-dumps about its favourite topic for forty minutes straight. {t} is overwhelmed.' },
  cheesymelt:   { name: 'Cheesy Melt', type: 'fire', power: 45, effect: { foeDef: 1 }, anim: 'flame', text: '{u} oozes molten cheese all over {t}. Sticky. Delicious. Defeating.' },
  pillowfight:  { name: 'Pillow Fight', type: 'fairy', power: 40, anim: 'lunge', text: '{u} whack {t}. They have the stopping power of two sheets of paper.' },
  flatout:      { name: 'Flat Out', type: 'fairy', power: 0, effect: { selfDef: 1 }, anim: 'heal', text: '{u} lie there, extremely flat. It is weirdly hard to hit them.' },
  snuggle:      { name: 'Snuggle', type: 'fairy', power: 0, effect: { heal: 0.3 }, anim: 'heal', text: '{u} get hugged. Nobody asks why they are called that. Nobody dares.' },
  slimetrail:   { name: 'Slime Trail', type: 'smelly', power: 50, anim: 'stink', text: '{u} oozes right across {t}\'s paws. Gross.' },
  eyestalks:    { name: 'Eye Stalks', type: 'psychic', power: 0, effect: { foeAtk: 1 }, anim: 'shout', text: '{u} extends both eye stalks and stares at {t}. It feels deeply judged.' },
  lettuceraid:  { name: 'Lettuce Raid', type: 'park', power: 60, anim: 'lunge', text: '{u} charges at {t} at 0.03 km/h. Somehow, it still lands.' },
};

export const NORTH_ENEMIES = {
  cravat: {
    name: 'Cravat', type: ['leather', 'old'], stats: { hp: 56, attack: 58, defence: 60, speed: 66, special: 64 },
    moves: ['windsor', 'flourish', 'backinmyday'], faces: 'front',
  },
  beret: {
    name: 'Living Beret', type: ['psychic', 'old'], stats: { hp: 64, attack: 52, defence: 62, speed: 58, special: 70 },
    moves: ['tilt', 'existential', 'flourish'], faces: 'front',
  },
  myki: {
    name: 'Myki Card', type: 'plastic', stats: { hp: 48, attack: 55, defence: 55, speed: 70, special: 62 },
    moves: ['touchon', 'insufficient', 'flutter'], faces: 'front',
  },
  reader: {
    name: 'Myki Reader', type: 'steel', stats: { hp: 62, attack: 60, defence: 66, speed: 40, special: 55 },
    moves: ['cardnotread', 'fine', 'beep'], faces: 'front',
  },
  swan: {
    name: 'Black Swan', type: ['water', 'park'], stats: { hp: 58, attack: 64, defence: 50, speed: 60, special: 50 },
    moves: ['hiss', 'splash', 'wingbeat'], drop: ['feather', 0.25],
  },
  render: {
    name: 'Artist\'s Impression', type: ['plastic', 'psychic'], stats: { hp: 50, attack: 45, defence: 50, speed: 62, special: 66 },
    moves: ['luxury', 'pose', 'flutter'], faces: 'front',
  },
  trolley: {
    name: 'Runaway Trolley', type: 'steel', stats: { hp: 58, attack: 64, defence: 62, speed: 50, special: 30 },
    moves: ['rolldown', 'wonkywheel', 'beep'], faces: 'front', drop: ['tennis', 0.2],
  },
  whitlam: {
    name: 'Whitlam (in his pram)', type: ['street', 'steel'], stats: { hp: 66, attack: 62, defence: 64, speed: 48, special: 60 },
    moves: ['doorknock', 'pramram', 'cathiss', 'preselect'], faces: 'front',
  },
  toastie: {
    name: 'The Same Toastie', type: 'fire', stats: { hp: 55, attack: 60, defence: 50, speed: 55, special: 66 },
    moves: ['sundried', 'autismattack', 'cheesymelt'], faces: 'front',
  },
  boobpillows: {
    name: 'Boob Pillows', type: 'fairy', stats: { hp: 50, attack: 40, defence: 62, speed: 45, special: 55 },
    moves: ['pillowfight', 'flatout', 'snuggle'], faces: 'front', float: true,
  },
  slugalison: {
    name: 'Slug Alison', type: ['smelly', 'park'], stats: { hp: 72, attack: 62, defence: 62, speed: 30, special: 62 },
    moves: ['slimetrail', 'eyestalks', 'lettuceraid'], sendOut: 'Alison takes a deep breath and turns INTO A SLUG.',
  },
};

export const NORTH_FOE_TEXT = {
  cravat: { appear: 'A silk cravat slithers out, perfectly knotted!', leave: 'loosens itself and goes back to the drawer, offended.' },
  beret: { appear: 'A black beret floats down at a jaunty angle!', leave: 'sighs, lights an imaginary cigarette and drifts off to Paris.' },
  myki: { appear: 'A dropped myki card skitters across the ground!', leave: 'slides down a drain. It had no credit anyway.' },
  reader: { appear: 'A myki reader on a pole blinks red at you!', leave: 'goes "Card not read" and switches itself off.' },
  swan: { appear: 'A black swan rises up out of the reeds, hissing!', leave: 'glides back across the lake, still muttering.' },
  render: { appear: 'An artist\'s impression of "Preston\'s newest address" blows in on the wind!', leave: 'is rolled up and taken back to the planning office.' },
  trolley: { appear: 'A shopping trolley rolls out of the car park on its own!', leave: 'wobbles off towards the Merri Creek. They always end up in the creek.' },
  whitlam: { appear: 'A grey cat peers out of a pram, wearing a tiny red rosette!', leave: 'curls up under the pram blanket. It\'s time for his nap. It was always time for his nap.' },
  toastie: { appear: 'A toasted sandwich. The same one as always.', leave: 'goes cold. Alison will make another one tomorrow. The same one.' },
  boobpillows: { appear: 'Two very thin pillows flop onto the ground.', leave: 'slide gently under a couch.' },
  slugalison: { appear: 'Alison has become a slug. A big one.', leave: 'turns back into Alison, a bit slimy and very pleased with herself.' },
};

export const NORTH_TRAINERS = {
  merv: { name: 'Merv', team: [['possum', 12], ['rat', 13]], reward: { cheese: 1 }, money: 40 },
  tash: { name: 'Tash', team: [['scooter', 11], ['ristretto', 11]], reward: { croissant: 1 }, money: 45 },
  kostas: { name: 'Kostas', team: [['duck', 13], ['swan', 14]], reward: { sardine: 2 }, money: 45 },
  greco: { name: 'Greco', team: [['cravat', 15], ['beret', 16]], reward: { baklava: 1 }, money: 30, sendOut: 'Greco unknots {f} from his neck.' },
  inspector: { name: 'Myki Inspector', intro: 'He steps out from behind a pillar with a hand-held device.', team: [['myki', 16], ['reader', 17]], money: 70 },
  meghan: { name: 'Meghan Hopper', team: [['whitlam', 15]], sendOut: 'Meghan pulls back the pram blanket: {f}!', reward: { timtams: 1 }, money: 45 },
  alison: { name: 'Alison', team: [['toastie', 12], ['boobpillows', 11], ['slugalison', 14]], sendOut: 'Alison whips out {f}.', reward: { cheese: 1 }, money: 50 },
};
