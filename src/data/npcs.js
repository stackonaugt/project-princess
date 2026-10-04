// People around town. They give hints and the occasional treat.
// Where they stand is set in each map file (b.npc(...)).
//
//  look   how the built-in sprite looks (see src/art/paint/people.js)
//  lines  a list of conversations; one is picked each time you talk
//  hints  { petId: line } shown while you still haven't found that pet
//  gift   item id they give you once a day

export const NPCS = {
  trish: {
    name: 'Trish', role: "Helen's mum. Lives at 72 Woods St", look: { hair: '#d8d4cc', hairStyle: 'pixie', skin: '#f0c8a8', shirt: '#c8ccd0', pants: '#c8ccd0', shoes: '#6a5a4a', glasses: '#6a4a2a', scarf: '#3a8a6a', collar: true },
    lines: [
      ['Oh hello, love! Have you eaten? There is a casserole in the freezer with your name on it.'],
      ['How is the renovation going? Tell Helen to ring me. She never rings.', 'Well, she rang yesterday. But she never rings.'],
      ['This was Helen and Paddy\'s place, you know. Now it is ours. The colourful tiles stay. Gordon is not allowed to touch them.'],
    ],
    hints: { princess: 'Princess will be out on Allen St, guarding the court. Bring her a ribbon. She likes to look her best.' },
    gift: 'chicken', giftLine: 'Here, take some treats for the dogs. I buy them in bulk. Do not tell Gordon how much bulk.',
  },
  gordon: {
    name: 'Gordon', role: "Helen's dad. Beard of legend", look: { hair: '#c8c4bc', hairStyle: 'bald', skin: '#e8a890', shirt: '#2a3a5a', pants: '#2a2a2a', shoes: '#4a3a2a', longBeard: '#e8e4dc' },
    lines: [
      ['Morning. The agapanthus are taking over. I have given up fighting them. We have an understanding now.'],
      ['People keep asking if I am Santa. I tell them Santa wishes he had this beard.'],
      ['Watch the magpies round here in spring. They know your face. They hold grudges.'],
      ['Paddy borrowed my good ladder for the renovation. That was in March. Which March, I could not tell you.'],
    ],
    hints: { princess: 'The poodle? Over on Allen St. Do not let her size fool you. She once chased off a council truck.' },
  },
  gaz: {
    name: 'Gaz', role: 'Sausage sizzle volunteer', look: { hair: '#8a8d94', hairStyle: 'bald', skin: '#e8b48a', shirt: '#c8443a', pants: '#3a3a48', apron: '#f4efe0', moustache: true },
    lines: [
      ['Snag? Onions go on the bottom, mate. Stops them falling out. It is science.'],
      ['Been running this sizzle for eleven years. Raised enough for three new netball uniforms and a defibrillator.'],
      ['People ask why I do it. Free sausages, community, and nobody can make me use a vegetarian tong. Wait, yes they can. Fair enough.'],
    ],
    hints: { princess: 'Little white poodle on Allen St barks at my ute every morning. Fair dinkum security guard, that one.' },
    gift: 'snag', giftLine: 'Here, have a snag in bread. On the house. Do not tell the hardware barn.',
  },
  marisol: {
    name: 'Marisol', role: 'Forklift driver', look: { hair: '#2a1a0c', hairStyle: 'bun', skin: '#c88a5a', shirt: '#e8823a', pants: '#2f4a6a', hivis: true },
    lines: [
      ['Just knocked off a ten hour shift. My feet have opinions.'],
      ['We won our new agreement last month. Proper breaks, a heat policy, and pay that keeps up with rent.', 'Turns out when everyone signs up to the union at once, the boss suddenly finds the money.'],
      ['Mind the forklifts. They beep for a reason.'],
    ],
    hints: { princess: 'If you are looking for animals, try Allen St. There is a poodle there who thinks she runs Laverton. Honestly, she might.' },
  },
  commuter: {
    name: 'Commuter', role: 'Waiting for the Werribee line', look: { hair: '#5a3a1a', hairStyle: 'short', skin: '#f2c79a', shirt: '#5a6a8a', pants: '#2a2a2a', collar: true, glasses: true },
    lines: [
      ['Train is delayed. Again. I have read the whole timetable twice for fun.'],
      ['Tip: tap your myki at the green reader and you can catch a train to any station you have already visited.'],
      ['Replacement buses this weekend. Replacement buses every weekend. I have made friends with the bus driver.'],
    ],
  },
  jules: {
    name: 'Jules', role: 'Barista', look: { hair: '#e8823a', hairStyle: 'bob', skin: '#f2c79a', shirt: '#2f5b4a', pants: '#3a3a48', apron: '#6b4226' },
    lines: [
      ['Oat flat white? We also do a pour-over that tastes like a bushfire, in a good way.'],
      ['My rent went up again. I make the coffee for the guy who owns my flat. He tips in exposure.'],
      ['If you see a tabby in the lane, that is Salami. She gets the milk froth on Fridays. Do not tell my manager.'],
    ],
    hints: { salami: 'There is a stripy menace in the bluestone lane behind the terraces. Watch your ankles.', spooky: 'Night shift staff say there is a black bunny in the park that turns see-through. I think they need more sleep.' },
    gift: 'croissant', giftLine: 'We have a spare almond croissant. Take it before I eat it.',
  },
  busker: {
    name: 'Busker', role: 'Plays outside the op shop', look: { hair: '#3a2412', hairStyle: 'curly', skin: '#8a5a3a', shirt: '#a24fc9', pants: '#3a6aa8', beard: true },
    lines: [
      ['This next song is called "No Fault Evictions Are Still Somebody\'s Fault". Thank you, thank you.'],
      ['I know four chords and I use all of them. Every song is about the 19 tram.'],
      ['Spare change? No? Then spare a compliment. Thank you, that one was lovely.'],
    ],
    hints: { spooky: 'Played a late gig in the park last week. A bunny watched the whole set, then disappeared. Best crowd I have ever had.' },
  },
  priya: {
    name: 'Priya', role: 'Dog walker', look: { hair: '#1e1e24', hairStyle: 'long', skin: '#a8724a', shirt: '#3fa38f', pants: '#5a5a66' },
    lines: [
      ['Six dogs today. Four of them are called Luna.'],
      ['The ducks in this pond are absolute bullies. I respect them.'],
      ['Walking dogs is a real job, you know. The Lunas and I are thinking of unionising.'],
    ],
    hints: { spooky: 'Have you seen the black bunny by the pond? She is shy in daylight. Come back after dark and she is easier to spot.' },
  },
  pina: {
    name: 'Nonna Pina', role: 'Grower of lemons', look: { hair: '#e8e4d8', hairStyle: 'bun', skin: '#e8b48a', shirt: '#2a2a3a', pants: '#2a2a3a', glasses: true },
    lines: [
      ['You look skinny. Are you eating? You are not eating.'],
      ['Fifty years in this house. The lemon tree is older than my son and better behaved.'],
      ['That schnauzer next door, he is very clever. Like a little professor. He likes cheese, not lemons. Nobody likes my lemons except the bunny people.'],
    ],
    hints: { stanley: 'The grey dog on the footpath? Stanley. He is a gentleman. Do not chase him, he hates that. Bring him something fancy to eat.' },
    gift: 'lemon', giftLine: 'Take a lemon. Take two. The tree, she never stops.',
  },
  dimitri: {
    name: 'Dimitri', role: 'Runs the milk bar', look: { hair: '#3a3a3a', hairStyle: 'short', skin: '#d8a070', shirt: '#f4efe0', pants: '#3a3a48', moustache: true, apron: '#2f6aa3' },
    lines: [
      ['Milk bar has been in the family since 1974. We still sell the bags of mixed lollies. Twenty cents each. Inflation.'],
      ['The new supermarket down the road has self-checkouts. I have a self too. I am right here.'],
      ['Everyone comes in for cheese sticks for that schnauzer. Very particular dog. He only likes the good brand.'],
    ],
    hints: { stanley: 'Stanley comes past every afternoon to judge my window display. If you want him to like you, cheese. Trust me.' },
    gift: 'cheese', giftLine: 'Here, a cheese stick. For the schnauzer. Or for you. I do not judge, unlike the schnauzer.',
  },
  wen: {
    name: 'Wen', role: 'Community gardener', look: { hair: '#1e1e24', hairStyle: 'cap', cap: '#6aa83a', skin: '#f0c8a0', shirt: '#8aa858', pants: '#6b4226' },
    lines: [
      ['The plots open soon. You will be able to grow your own vegies here.', 'Carrots, lettuce, maybe a pumpkin if the possums allow it.'],
      ['Gardening is mostly fighting snails and losing gracefully.'],
      ['Community gardens are the best kind of property: everyone shares it and nobody profits off it.'],
    ],
    hints: { poppy: 'There is a frenchie by the lake who keeps digging under my fence. She has never found anything. She will never stop.' },
    gift: 'carrot', giftLine: 'Have a carrot from my plot. Bunnies go wild for them.',
  },
  kez: {
    name: 'Kez', role: 'Jogging the lake loop', look: { hair: '#f5d63a', hairStyle: 'bun', skin: '#f2c79a', shirt: '#e77fb8', pants: '#1e1e24', shoes: '#f4f4f0' },
    lines: [
      ['Cannot stop! Lap twelve! Talk while I run!'],
      ['This loop is exactly one point eight kilometres. I have measured it four hundred times.'],
    ],
    hints: { poppy: 'There is a frenchie by the picnic tables who keeps trying to race me. She has never won. She has never stopped trying.' },
  },
  rose: {
    name: 'Rose', role: "Salami's human. Donald St", look: { hair: '#b08a58', hairStyle: 'wavy', skin: '#f2c8a0', shirt: '#1e1e24', pants: '#d8a860', pantsPattern: 'leopard', shoes: '#1e1e24', sunglasses: '#9a5ad0', frame: '#d8dce4', bumbag: '#18181c', lips: '#c0505a' },
    lines: [
      ['Oh, you want to be friends with Salami? Cute. Everyone does.', 'You will have to get past me first. Friendly battle. Loser buys the oat milk.'],
      ['These pants are leopard print because Salami is basically a tiny leopard. I am dressing for my role as her manager.'],
      ['The rent on these flats went up again. Salami has not contributed a single cent. She does contribute vibes.'],
      ['I have trained Salami for years. Well. She has trained me. Same thing really.'],
    ],
    hints: { salami: 'Salami is around the flats somewhere, judging people. Bring a sardine and some patience. Then come and battle me for her heart.' },
    gift: 'sardine', giftLine: 'Here, a sardine. For Salami, not for you. I can see you eyeing it.',
  },
  slinks: {
    name: 'Slinks', role: "Spooky's human. Lurks near the bakery", look: { hair: '#16121a', hairStyle: 'bob', streak: '#8a5ad0', skin: '#f4dcc8', shirt: '#4a2a5a', blazer: '#1a181e', blazerTrim: '#3a3440', pants: '#1a181e', shoes: '#0e0e10', lips: '#6a2a4a' },
    lines: [
      ['I am not lurking. I am waiting for the bakery to put out the day-old bread. There is a difference.'],
      ['People think I dress like this because I am spooky. No. Spooky is spooky. I just like black. It hides the bunny fur.'],
      ['The 19 tram goes past every few minutes and I still manage to miss it. It is a gift.'],
    ],
    hints: { spooky: 'Spooky goes see-through when she is shy. Come back after dark, when she is solid. And bring a carrot. She is not made of stone.' },
    gift: 'carrot', giftLine: 'Have a carrot. I carry them everywhere now. My bag is basically a crisper.',
  },
  mem: {
    name: 'Mem', role: 'Hope St. Cool, unbothered', look: { hair: '#ecd490', hairStyle: 'bob', skin: '#f2c8a0', shirt: '#2a2a30', blazer: '#1a1a1e', blazerTrim: '#4a4a54', pants: '#8aa4c8', shoes: '#1e1e24', sunglasses: '#1a1a20', shades: 'wrap' },
    lines: [
      ['Yes, sunglasses in winter. Melbourne could produce sun at any moment. I like to be ready.'],
      ['Corni and I live just here. Our apartment is small but the rent is enormous, so it evens out.'],
      ['Leather jacket, 1998. Older than some of the people in the bar downstairs. Still looks better.'],
    ],
    hints: { salami: 'The tabby on Donald St? That is Rose\'s. Rose will want a battle. Rose always wants a battle.' },
  },
  corni: {
    name: 'Corni', role: 'Hope St. Never without the monkey', look: { hair: '#a87a4a', hairStyle: 'mullet', skin: '#f2c79a', shirt: '#2a3a68', pants: '#4a4a52', shoes: '#e8e4dc', holding: 'monkey' },
    lines: [
      ['This is Monkey. He goes everywhere with me. He has been to more gigs than most people in Brunswick.'],
      ['The mullet is a commitment. Business at the front, Sydney Rd at the back.'],
      ['Monkey says hello. Monkey also says the pets around here are very good. Monkey is never wrong.'],
    ],
    hints: { spooky: 'Monkey saw a black bunny near the bakery last night. Then it vanished. Monkey has not slept since.' },
  },
  sinead: {
    name: 'Sinead', role: "Poppy's human. Unit 1, 835 Plenty Rd", look: { hair: '#3a2416', hairStyle: 'long', skin: '#f2c8a8', shirt: '#2a2a30', blazer: '#18181c', blazerTrim: '#44444c', pants: '#2a2a34', shoes: '#1e1e24', sunglasses: '#5a3218', shades: 'round', frame: '#8a5428', hoops: '#f06aa8' },
    lines: [
      ['Welcome to the units! Mind the driveway. Poppy has claimed it, and also the bins, and also you.'],
      ['Poppy has two speeds: asleep and absolutely flat out. There is nothing in between. There never will be.'],
      ['Seb says Plenty Rd is too loud. I say it is just Reservoir saying hello. Six lanes of hello.'],
    ],
    hints: { poppy: 'Poppy will bonk into you at full speed. That is how she says hi. Throw her a tennis ball and you are mates for life.' },
    gift: 'tennis', giftLine: 'Take a tennis ball. We have forty. Poppy loses one a day and finds two.',
  },
  tim: {
    name: 'Tim', role: "Stanley's human. 57C Glasgow Ave", look: { hair: '#2a1a12', hairStyle: 'wavyshort', skin: '#eec09a', shirt: '#3a8a4a', shirtPattern: 'stripes', shirtAccent: '#f2f2ea', blazer: '#22305a', pants: '#3a3a44', shoes: '#4a2e1a', moustache: '#2a1a12', stubble: true },
    lines: [
      ['Stanley is a gentleman and a scholar. Mostly a scholar of cheese.'],
      ['You want Stanley to like you? Do not chase him. Let him come to you. He is like a cat in a schnauzer costume.'],
      ['I could beat you in a battle. Stanley could beat you in a battle. Stanley could beat me in a battle, honestly.'],
    ],
    hints: { stanley: 'Stanley walks away from strangers. It is not personal. Bring him something fancy, then give him time. He comes around.' },
    gift: 'cheese', giftLine: 'Have a cheese stick. We buy them by the crate. Stanley has standards.',
  },
  nicholas: {
    name: 'Nicholas', role: "Tim's partner. Also lives at 57C", look: { hair: '#2a1c14', hairStyle: 'curly', skin: '#f0c8a4', shirt: '#f4f4f0', collar: true, blazer: '#2a3a34', blazerPattern: 'plaid', blazerAccent: ['#5a2a2a', '#1a2420'], pants: '#2a2a30', shoes: '#2a1a12', glasses: '#7a4a22' },
    lines: [
      ['Tim does the battling. I do the commentary. And what a performance that was. Truly. Riveting.'],
      ['Stanley sleeps on my side of the bed. Tim says that means Stanley loves me more. I say it means Stanley likes the electric blanket.'],
      ['The tartan is vintage. So is the house. So is Stanley, in schnauzer years. We are a very vintage household.'],
    ],
    hints: { stanley: 'If Stanley walks off, keep at it. Three hearts and he stops ignoring you. Six and he comes to say hi. It is very moving.' },
  },
  binman: {
    name: 'Bin Man', role: 'Bin trainer of Laverton', look: { hair: '#5a3a1a', hairStyle: 'cap', cap: '#f07a1a', skin: '#e0a880', shirt: '#f07a1a', hivis: true, pants: '#2a3a5a', shoes: '#2a2a2a', gloves: '#e8c040', stubble: true },
    lines: [
      ['These are my bins. Yellow lid, recycling. Dark green, garbage. Little white one, compost. Raised them from tiny wheelie bins.'],
      ['Bin night is Tuesday. The bins know. They get restless around 6pm.'],
      ['Somebody put a pizza box with cheese stuck on it in the yellow bin. Contamination. My recycling bin is devastated.'],
      ['Soft plastics do not go in the yellow bin! I will tell you that one for free, every single time.'],
    ],
    hints: { princess: 'The poodle on Allen St barks at my truck every single week. She is a worthy rival. My bins respect her.' },
  },
  hipster: {
    name: 'Hipster', role: 'Was into Brunswick before it was cool', look: { hair: '#2a1a12', hairStyle: 'cap', cap: '#1e1e22', skin: '#f0c8a0', shirt: '#1e1e22', pants: '#1e1e22', shoes: '#1e1e22', beard: true, glasses: '#3a2a1a' },
    lines: [
      ['This street was better in 2011. Before the second oat milk place opened.'],
      ['I ferment my own hot sauce. And kombucha. And opinions.'],
      ['My record collection is organised autobiographically. Do not touch it.'],
    ],
  },
  golfer: {
    name: 'Golfer Next Door', role: 'Our neighbour. Golf, every day, rain or shine', look: { hair: '#d8d4cc', hairStyle: 'cap', cap: '#f4f4f0', skin: '#e0a07a', shirt: '#9ac8e8', collar: true, pants: '#c8b890', pantsPattern: 'plaid', pantsAccent: ['#8a7a5a', '#c84a3a'], shoes: '#f4f4f0' },
    lines: [
      ['Mornin\'! Off to the course. Again. The missus says I live there now.'],
      ['Your Frenchie got into my yard again. She ate a golf ball. She seems fine. Proud, even.'],
      ['People ask how I eat pies with no teeth. Patience, mate. And gravy.'],
    ],
    hints: { poppy: 'The little black Frenchie next door? Poppy. Charges at my buggy every morning. Sinead\'s usually out the front.' },
  },
  stranger: {
    name: 'Stranger', role: 'Under the skyrail', look: { hair: '#4a3a2a', hairStyle: 'short', skin: '#e0b898', shirt: '#6a6e74', pants: '#2a2e3a', shoes: '#3a3a3a', stubble: true },
    lines: [
      ['Hey. You were there when I... yeah. Thanks for calling the ambos.'],
      ['I\'m seeing someone at the health service now. One day at a time.'],
      ['Day by day, mate. Day by day. Thanks for not walking past.'],
    ],
  },
  dee: {
    name: 'Dee', role: 'Runs The Leash You Can Do', shop: true, look: { hair: '#c8582a', hairStyle: 'curly', skin: '#d8a070', shirt: '#2f6aa3', pants: '#3a3a48', apron: '#c8443a', glasses: '#3a2a20' },
    lines: [
      ['Welcome to The Leash You Can Do! Treats, gear, and a goldfish called Kevin who is not for sale.'],
      ['Gear makes a real difference in a play-fight. A good lead keeps them steady. A bow tie makes them clever.'],
      ['Pet prices are up again. It is the rents, love. Even the goldfish is on a lease.'],
    ],
  },
};
