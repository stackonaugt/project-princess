// ============================================================
//  ALL THE WORDS. Edit freely! Every line people and pets say lives here.
// ============================================================
//
//  people   townsfolk, by id (same ids as src/data/npcs.js)
//    role          the little description under their name in the Friends app
//    lines         a list of chats; one is picked each time you talk to them
//    hints         { petId: line } said while you still haven't found that pet
//    giftLine      what they say when they hand you their daily gift
//    heartScenes   { hearts: [lines] } little scenes the first time you chat at that many hearts
//    helpsInBattle the line when they turn up to help you in a battle
//    battle        trainers only: challenge, ask (the question), yes / no (the buttons),
//                  win (they say when you win), lose (when you lose), again (rematches)
//  pets     bio, clue (Petdex hint), funFact, favouriteSpot, lines by hearts, night / rain / asleep, evolvedBio
//  foes     wild things: appear (when they jump out) and leave (when they give up)
//  places   the one-line description shown when you enter each zone
//
//  Rules of thumb: Australian spelling, no em dashes, lines under about 140 characters
//  (dialogue boxes are small on phones). Use \' for an apostrophe inside 'quotes'.
//  Signs and the text when you inspect things are in the map files and flavour.js.
import { EAST_PEOPLE, EAST_FOE_TEXT, EAST_PLACES } from './east.js';
import { NORTH_PEOPLE, NORTH_FOE_TEXT, NORTH_PLACES } from './north.js';
//  Summerhill Shopping Centre's people and places are in summerhill.js (merged in here).

import { SH_PEOPLE, SH_FOE_TEXT, SH_PLACES } from './summerhill.js';

import { authoredValue } from '../authoring/overrides.js';
export let PEOPLE = {
  trish: {
    role: 'Helen\'s mum. Lives at 72 Woods St',
    lines: [
      ['Oh hello, love! Have you eaten? There is a casserole in the freezer with your name on it.'],
      [
        'How is the renovation going? Tell Helen to ring me. She never rings.',
        'Well, she rang yesterday. But she never rings.',
      ],
      [
        'This was Helen and Paddy\'s place, you know. Now it is ours. The colourful tiles stay. Gordon is not allowed to touch them.',
      ],
    ],
    hints: {
      princess: 'Princess will be out on Allen St, guarding the court. Bring her a ribbon. She likes to look her best.',
    },
    giftLine: 'Here, take some treats for the dogs. I buy them in bulk. Do not tell Gordon how much bulk.',
    heartScenes: {
      2: [
        'Trish: "Come in, come in. I made too much lasagne. I always make too much lasagne."',
        'You leave with a container. It is still warm.',
      ],
      4: [
        'Trish shows you a photo album. Helen at six, dressed as a poodle for Book Week.',
        '"She was always going to end up with Princess, wasn\'t she."',
      ],
      6: ['Trish: "You are family now, love. That means you get the good tupperware. The one with the lid."'],
      10: ['Trish sits you down at the kitchen table at 72 Woods St. Gordon is sent out of the room.', '"Right. There is one thing I have never told anyone. Not even Helen."'],
    },
    helpsInBattle: 'Trish turns up with a casserole. Everyone feels better.',
  },
  gordon: {
    role: 'Helen\'s dad. Byzantium, trees, and a beard of legend',
    lines: [
      [
        'Morning. The agapanthus are taking over. I have given up fighting them. We have an understanding now.',
      ],
      [
        'Constantinople stood for a thousand years. This fence will not last till Christmas. Different standards.',
      ],
      [
        'Plant a tree, then sit under it in twenty years. That is the whole plan. Mine is the fig out the back.',
      ],
      [
        'People keep asking if I am Santa. I tell them Santa wishes he had this beard. So did half the Byzantine emperors.',
      ],
      ['Watch the magpies round here in spring. They know your face. They hold grudges.'],
      [
        'Paddy borrowed my good ladder for the renovation. That was in March. Which March, I could not tell you.',
      ],
    ],
    hints: {
      princess: 'The poodle? Over on Allen St. Do not let her size fool you. She once chased off a council truck.',
    },
    heartScenes: {
      2: [
        'Gordon: "Come and see the fig." It is enormous. "Planted it in 1986. Older than Helen\'s first car, and it runs better."',
      ],
      4: [
        'Gordon shows you a book of mosaics from Ravenna. "Byzantium. A thousand years. They put gold behind everything. Even the saints."',
        '"Imagine a tram shelter done like that." You can, now.',
      ],
      6: [
        'Gordon gives you a cutting from the fig, wrapped in wet newspaper. "Plant it somewhere it can get big. Trees need room. So do people."',
      ],
    },
    helpsInBattle: 'Gordon starts explaining the Hagia Sophia dome. The foe sits down to listen.',
  },
  gaz: {
    role: 'Runs the sausage sizzle outside Bunnings, Altona North',
    lines: [
      ['Snag? Onions go on the bottom, mate. Stops them falling out. It is science.'],
      [
        'Been running this sizzle for eleven years. Raised enough for three new netball uniforms and a defibrillator.',
      ],
      [
        'People ask why I do it. Free sausages, community, and nobody can make me use a vegetarian tong. Wait, yes they can. Fair enough.',
      ],
      [
        'Seeds and garden gear? Olly is just inside. He knows where every hinge lives.',
      ],
    ],
    hints: {
      princess: 'Little white poodle on Allen St barks at my ute every morning. Fair dinkum security guard, that one.',
    },
    giftLine: 'Here, have a snag in bread. On the house. Do not tell Olly. He counts them.',
    heartScenes: {
      2: ['Gaz lets you work the tongs for five minutes. Onions on the bottom. You are a natural.'],
      4: [
        'Gaz: "Eleven years of sizzles. Paid for the club\'s defib. Saved a bloke\'s life last winter." He goes quiet. "Snag?"',
      ],
      6: ['Gaz gives you a Sizzle Crew apron. It is the highest honour in Laverton.'],
    },
    helpsInBattle: 'Gaz lobs a snag in bread. Perfect spiral. Energy restored.',
  },
  ardi: {
    role: 'Mechanic. Lives round the corner from the station',
    lines: [
      ['Hi neighbour, how are you? Good? Good. Your car making that noise again? No? Lucky.'],
      ['Hi neighbour, how are you? I just did a timing belt on a Corolla. Two hundred thousand k and still going. Toyotas never die.'],
      ['Hi neighbour! You hear a squeal when you brake, you come see me. Do not wait. Waiting is how a $90 job becomes a $900 job.'],
      ['Everyone wants an EV now. Fine. Less oil on my hands. But who fixes the aircon? Still me.'],
      ['Back home in Surabaya my uncle fixed scooters on the footpath. Now I have a hoist. He thinks I am a king.'],
    ],
    hints: {
      princess: 'Looking for animals? Try Allen St. There is a poodle there who thinks she runs Laverton. Honestly, she might.',
    },
  },
  jack: {
    role: 'Jack McPherson. Paddy\'s cousin. Waiting for the Werribee line',
    lines: [
      ['G\'day! You\'re with Paddy, aren\'t you? My cousin. Tell him he still owes me twenty bucks from the footy tipping.'],
      [
        'See that green myki machine? Tap on there and you can go to any station you\'ve been to before. Saves the legs.',
      ],
      ['How\'s Paddy going as Mayor? Still wearing the big gold chain to the shops? Tell him I said hi. And to get a haircut.'],
      ['Train is delayed. Again. I have read the whole timetable twice for fun.'],
      ['Replacement buses this weekend. Replacement buses every weekend. I have made friends with the bus driver.'],
    ],
  },
  pearman: {
    role: 'Sydney Rd regular. Golf tragic. North Melbourne for life',
    lines: [
      ['Ever wonder why they call me Pearman? Year 7. A dare. A pear. Down the pants. Kept it there all of fourth period. Legend was born.'],
      ['Shot a 94 at Royal Park on Sunday. Would have been an 89 but a magpie took my ball. Fair enough, it was nesting season.'],
      ['North Melbourne. Yes, still. Somebody has to. The Kangas will be back. Any decade now.'],
      ['If you find a golf ball, it\'s mine. Even if it isn\'t. Especially if it isn\'t.'],
      ['I might duck up to the Edinburgh Castle for one. Just the one. Okay, two.'],
    ],
    hints: {
      salami: 'There is a stripy menace in the bluestone lane behind the terraces. Watch your ankles.',
      spooky: 'Night shift staff say there is a black bunny in the park that turns see-through. I think they need more sleep.',
    },
    giftLine: 'Here, have a pear. Fresh. Not THAT pear. A new one. Different pear.',
  },
  jordan: {
    role: 'Plays bass in a band. Busks outside the op shop',
    lines: [
      ['Bass is the most important instrument. Nobody notices it until it stops. Like public transport.'],
      ['This next song is called "No Fault Evictions Are Still Somebody\'s Fault". Thank you, thank you.'],
      ['I know four chords and I use all of them. Every song is about the 19 tram.'],
      ['Spare change? No? Then spare a compliment. Thank you, that one was lovely.'],
    ],
    hints: {
      spooky: 'Played a late gig in the park last week. A bunny watched the whole set, then disappeared. Best crowd I have ever had.',
    },
  },
  abby: {
    role: 'Dog walker',
    lines: [
      ['Six dogs today. Four of them are called Luna.'],
      ['The ducks in this pond are absolute bullies. I respect them.'],
      ['Walking dogs is a real job, you know. The Lunas and I are thinking of unionising.'],
    ],
    hints: {
      spooky: 'Have you seen the black bunny by the pond? She is shy in daylight. Come back after dark and she is easier to spot.',
    },
  },
  pina: {
    role: 'Grower of lemons',
    lines: [
      ['You look skinny. Are you eating? You are not eating.'],
      ['Fifty years in this house. The lemon tree is older than my son and better behaved.'],
      [
        'That schnauzer next door, he is very clever. Like a little professor. He likes cheese, not lemons. Nobody likes my lemons except the bunny people.',
      ],
    ],
    hints: {
      stanley: 'The grey dog on the footpath? Stanley. He is a gentleman. Do not chase him, he hates that. Bring him something fancy to eat.',
    },
    giftLine: 'Take a lemon. Take two. The tree, she never stops.',
    heartScenes: {
      2: ['Nonna Pina: "You grow your own basil now? Finally, someone listens."'],
      4: ['Nonna Pina teaches you her sugo. The secret is a whole Sunday.'],
    },
    helpsInBattle: 'Nonna Pina feeds your pet a meatball. Mangia!',
  },
  james: {
    role: 'Runs the milk bar at Reservoir Station',
    lines: [
      ['The milk bar is a dying art. I am keeping it alive. With mixed lollies and sheer stubbornness.'],
      ['The new supermarket down the road has self-checkouts. I have a self too. I am right here.'],
      [
        'Everyone comes in for cheese sticks for that schnauzer. Very particular dog. He only likes the good brand.',
      ],
    ],
    hints: {
      stanley: 'Stanley comes past every afternoon to judge my window display. If you want him to like you, cheese. Trust me.',
    },
    giftLine: 'Here, a cheese stick. For the schnauzer. Or for you. I do not judge, unlike the schnauzer.',
    heartScenes: {
      2: ['James: "Forty years in this milk bar. Seen it all. Except the skyrail. Didn\'t see that coming."'],
      5: ['James gives you a Golden Gaytime from the back freezer. "Don\'t tell the kids."'],
    },
    helpsInBattle: 'James sends over a Paddle Pop. Your pet is revitalised.',
  },
  chris: {
    role: 'Community gardener',
    lines: [
      [
        'The plots open soon. You will be able to grow your own vegies here.',
        'Carrots, lettuce, maybe a pumpkin if the possums allow it.',
      ],
      ['Gardening is mostly fighting snails and losing gracefully.'],
      ['Community gardens are the best kind of property: everyone shares it and nobody profits off it.'],
      ['Got stale bread? The ducks on the creek go mad for it. Feed them enough and, well. Ducks remember a friend. You might get something special.'],
    ],
    hints: {
      poppy: 'There is a frenchie by the lake who keeps digging under my fence. She has never found anything. She will never stop.',
    },
    giftLine: 'Have a carrot from my plot. Bunnies go wild for them.',
    heartScenes: {
      2: ['Chris: "The garden belongs to everyone who turns up. That\'s the whole idea."'],
      4: ['Chris shows you the seed library. People leave seeds, take seeds. Nobody owns it.'],
      6: ['Chris: "Working bee on Saturday. Bring the twins. Bring the dogs. Bring the ghost bunny."'],
      10: [
        'Chris looks around, then leans in. "Can I tell you a secret? The lake\'s secret."',
        '"There\'s an old duck called Emilio. Older than the steam engine. Wears a little top hat. Nobody believes me."',
        '"Get a fishing rod, and instead of bait, cast in a bit of stale bread. James sells it at the milk bar. Then wait."',
        '"Don\'t tell anyone. He\'s very private. Very distinguished."',
      ],
    },
    helpsInBattle: 'Chris chucks a handful of compost. Rich, warm, and devastating.',
  },
  nathan: {
    role: 'Runs the lake loop with Rusty, his whippet',
    lines: [
      ['Cannot stop! Lap twelve! Rusty is on lap forty. Whippets.'],
      ['This loop is exactly one point eight kilometres. Rusty does it in about ninety seconds. Then shivers.'],
      ['Rusty shakes like a leaf when it is cold. Or warm. Or Tuesday. He is a whippet. It is his whole personality.'],
    ],
    hints: {
      poppy: 'There is a frenchie by the picnic tables who keeps trying to race Rusty. She has never won. She has never stopped trying.',
      rusty: 'Rusty? That brown blur is my whippet. Want him to run with your team? You will have to beat us first.',
    },
    battle: {
      challenge: ['You want Rusty on your team? He is very fast. And very dramatic about it.', 'Race you. Well, play-fight you. Same thing for a whippet.'],
      ask: 'Play-fight Rusty?', yes: 'Ready, set, go', no: 'Let me catch my breath',
      win: ['He is shaking. That is happy shaking. Probably.', 'Rusty can come and stay at your place on Allen St. Keep the heater on. He feels the cold.'],
      lose: ['Zoom. He was gone before you blinked. Come back faster.'],
    },
  },
  rose: {
    role: 'Salami\'s human. Works for a senator. Reads everything',
    lines: [
      [
        'Oh, you want to be friends with Salami? Cute. Everyone does.',
        'You will have to get past me first. Friendly battle. Loser buys the oat milk.',
      ],
      [
        'These pants are leopard print because Salami is basically a tiny leopard. I am dressing for my role as her manager.',
      ],
      [
        'The rent on these flats went up again. Salami has not contributed a single cent. She does contribute vibes.',
      ],
      [
        'I work for a senator. I read legislation all day, then I come home and read novels all night. Salami sits on the good bits.',
      ],
      [
        'Question Time was chaos today. Then I got home and Salami had knocked my book off the shelf. Same energy.',
      ],
    ],
    hints: {
      salami: 'Salami is around the flats somewhere, judging people. Bring a sardine and some patience. Then come and battle me for her heart.',
    },
    giftLine: 'Here, a sardine. For Salami, not for you. I can see you eyeing it.',
    heartScenes: {
      2: [
        'Rose: "Long week in the Senate office. Three inquiries, two media releases, one senator who replies to emails in all caps."',
        '"Salami does not care about any of it. That is why I love her."',
      ],
      4: ['Rose lends you a novel with her notes in the margins. "Bring it back. The notes are the best part."'],
      6: [
        'Rose: "If we ever get a decent renters\' rights bill through, I am framing it. Salami can sit on it."',
      ],
    },
    helpsInBattle: 'Rose drafts the foe a strongly worded letter. It reads it and wilts.',
    battle: {
      challenge: [
        'Oh, you want to be friends with Salami? Ha. Salami decides who her friends are.',
        'Show her you can handle her. Have a little play-fight.',
      ],
      ask: 'Play-fight Salami?',
      yes: 'Let\'s go',
      no: 'Maybe later',
      win: [
        'Wow. She actually likes you. That never happens.',
        'Salami will come and visit your place on Allen St. Feed her well. She keeps score.',
      ],
      lose: ['Ha! Told you. She has a vicious strike. Come back when your pets have had their Weet-Bix.'],
    },
  },
  slinks: {
    role: 'Spooky\'s human. Public servant. Loves a wine',
    lines: [
      ['I am not lurking. I am waiting for the bakery to put out the day-old bread. There is a difference.'],
      [
        'People think I dress like this because I am spooky. No. Spooky is spooky. I just like black. It hides the bunny fur.',
      ],
      ['The 19 tram goes past every few minutes and I still manage to miss it. It is a gift.'],
      [
        'I work in the public service. Policy. If you have ever filled out a form and wept, I am so sorry. It was probably mine.',
      ],
      [
        'A glass of red after work. Not a bottle. A glass. A large glass. Look, it was a long week of Senate Estimates.',
      ],
    ],
    hints: {
      spooky: 'Spooky goes see-through when she is shy. Come back after dark, when she is solid. And bring a carrot. She is not made of stone.',
    },
    giftLine: 'Here, a manoush from the Lebanese bakery up the road. Za\'atar. I bought two. I always buy two.',
    heartScenes: {
      2: [
        'Slinks: "Public service. Policy. I write briefs that ministers do not read." She pours a glass. "Spooky reads them. She has notes."',
      ],
      4: [
        'Slinks takes you to a wine bar on Lygon St. She orders in a voice you have never heard before. The sommelier is scared of her.',
      ],
      6: ['Slinks: "Spooky likes you. That means I have to like you. Fine. You can come to Friday wine."'],
    },
    helpsInBattle: 'Slinks swirls her wine and gives the foe a look. It reconsiders everything.',
    battle: {
      challenge: [
        'Spooky? You can see her? Most people cannot.',
        'If you can catch her in a play-fight, she might just haunt your place instead.',
      ],
      ask: 'Play-fight Spooky?',
      yes: 'Let\'s go',
      no: 'Not yet',
      win: [
        'She stayed solid the whole time. That means she respects you.',
        'Spooky will start appearing at your place. And disappearing. Mostly appearing.',
      ],
      lose: ['She phased out. You were punching air. Come back after dark, maybe. Or with snacks.'],
    },
  },
  mem: {
    role: 'Hope St. Biologist. PhD on muscle loss in bone recovery',
    lines: [
      ['Yes, sunglasses in winter. Melbourne could produce sun at any moment. I like to be ready.'],
      ['Corni and I live just here. Our apartment is small but the rent is enormous, so it evens out.'],
      [
        'My PhD is on muscle wastage while broken bones heal. Turns out lying in a cast is very bad for your quads.',
      ],
      ['Corni and I run the creek trail most mornings. I think about muscle loss. He thinks about Guinness.'],
      ['Third year of the PhD. My supervisor says I am nearly done. My supervisor has said that for a year.'],
      ['Just did 12k along the Merri Creek before breakfast. Corni did 5 and then found a bakery. We each have our strengths.'],
      ['Just got back from Bangkok! Pad kra pao for breakfast every day. Now everything in Brunswick tastes a little shy.'],
      ['My brother Jules is doing really well, by the way. New job, new flat, new haircut. He seems happy. It\'s nice.'],
    ],
    hints: {
      salami: 'The tabby on Donald St? That is Rose\'s. Rose will want a battle. Rose always wants a battle.',
    },
    heartScenes: {
      2: [
        'Mem: "My lab mice have tiny casts on their legs. We give them little treadmills after. They are very brave."',
      ],
      4: [
        'Mem shows you a muscle fibre under the microscope. It looks like spaghetti. "That is a mouse\'s whole recovery," she says, proudly.',
      ],
      6: [
        'Mem: "Corni and I are running the Merri Creek trail on Sunday. Come. He will cry at the end. He always cries at the end."',
      ],
    },
    helpsInBattle: 'Mem calmly explains how fast the foe\'s muscles will waste if it keeps sitting around. It panics.',
  },
  corni: {
    role: 'Hope St. German expat. Guinness enthusiast',
    lines: [
      [
        'Guten Tag! You want a Guinness? It is always a good time for a Guinness. Except before the run. After the run.',
      ],
      ['Mem and I go up to the Edinburgh Castle most nights. Seven o\'clock. One Guinness. Then another. Then home.'],
      ['Mem and I run along the Merri Creek. She talks about mouse muscles. I look for the pub at the end.'],
      [
        'In Germany the trams have timetables you can trust. Here the 19 is more of a suggestion. I love it anyway.',
      ],
    ],
    hints: {
      spooky: 'Last night after the Edinburgh Castle I saw a black bunny near the bakery. Then it vanished. Maybe it was the Guinness. Maybe not.',
    },
    giftLine: 'Here, take a Guinness. Not for the pets! For you, or a friend. Prost!',
    heartScenes: {
      2: [
        'Corni: "In Germany the beer is good and the trains are on time. Here the beer is fine and the trains are a mood."',
        '"But here there is Mem. So I stay."',
      ],
      4: [
        'Corni pours you a Guinness and makes you wait. "Two minutes. It settles. You cannot rush a Guinness. Or a good friend."',
      ],
      6: [
        'Corni: "Mem and I run the Merri Creek trail on Sundays. You come next week. I will carry the Guinness for after. Prost!"',
      ],
    },
    helpsInBattle: 'Corni hurls a can of Guinness. "PROST!" It hits the foe and foams everywhere.',
  },
  sinead: {
    role: 'Poppy\'s human. Social worker. Unit 1, 835 Plenty Rd',
    lines: [
      ['Welcome to the units! Mind the driveway. Poppy has claimed it, and also the bins, and also you.'],
      [
        'Poppy has two speeds: asleep and absolutely flat out. There is nothing in between. There never will be.',
      ],
      ['Seb says Plenty Rd is too loud. I say it is just Reservoir saying hello. Six lanes of hello.'],
      ['Social work is hard some days. Then I come home and Poppy headbutts my shins and I am fine again.'],
      [
        '*puff* Mango Ice. Do not judge me. I have had a week. Housing waitlists are twelve years long, did you know that?',
      ],
    ],
    hints: {
      poppy: 'Poppy will bonk into you at full speed. That is how she says hi. Throw her a tennis ball and you are mates for life.',
    },
    giftLine: 'Take a tennis ball. We have forty. Poppy loses one a day and finds two.',
    heartScenes: {
      2: [
        'Sinead: "Social work is mostly paperwork and phone calls. And then one day a family gets housed and it is all worth it."',
      ],
      4: [
        'Sinead sits with you on the unit steps, vaping something called Mango Ice. "Do not tell my mum. Or my clients. Or Seb."',
      ],
      6: [
        'Sinead: "You\'re basically on the lease now. Poppy has decided. I have filed the paperwork. In my head."',
      ],
    },
    helpsInBattle: 'Sinead blows a massive mango vape cloud. The foe cannot see a thing.',
    battle: {
      challenge: [
        'Hi! Poppy loves a play-fight. Like, LOVES one. Are you sure?',
        'She is basically a bowling ball with ears. Brace yourself.',
      ],
      ask: 'Play-fight Poppy?',
      yes: 'Bring it on',
      no: 'Let me stretch first',
      win: [
        'She is so happy. She has never had this much fun losing. She has never won, to be fair.',
        'Poppy can come stay at your place. She will eat anything. Hide the good snacks.',
      ],
      lose: ['Ooh, sorry! She does not know her own strength. She does not know much, honestly. We love her.'],
    },
  },
  tim: {
    role: 'Stanley\'s human. Union organiser. Loves Rome and trains',
    lines: [
      ['Stanley is a gentleman and a scholar. Mostly a scholar of cheese.'],
      [
        'You want Stanley to like you? Do not chase him. Let him come to you. He is like a cat in a schnauzer costume.',
      ],
      [
        'I could beat you in a battle. Stanley could beat you in a battle. Stanley could beat me in a battle, honestly.',
      ],
      [
        'I organise for the union. If you are not in one, join one. That is the speech. I have a longer version.',
      ],
      [
        'Rome has trams, you know. Old orange ones. I rode every line. Nicholas waited in a cafe and did not regret it.',
      ],
      [
        'The Mernda line on the skyrail is beautiful. I will hear no criticism. Look at those concrete columns.',
      ],
    ],
    hints: {
      stanley: 'Stanley walks away from strangers. It is not personal. Bring him something fancy, then give him time. He comes around.',
    },
    giftLine: 'Have a cheese stick. We buy them by the crate. Stanley has standards.',
    heartScenes: {
      2: [
        'Tim: "Union organiser. Today I signed up a whole call centre. Tomorrow, the world. Or at least the car park."',
      ],
      4: [
        'Tim shows you his photos of Rome. Two hundred of the Forum. Forty of trains. "The Roma Termini platforms, look at them."',
      ],
      6: [
        'Tim: "Nicholas and I talked. You\'re invited to Stanley\'s birthday. There is a cake. He will not eat it. There will be a toast to solidarity."',
      ],
    },
    helpsInBattle: 'Tim calls a snap stop-work meeting. The foe downs tools.',
    battle: {
      challenge: ['You want to befriend Stanley? He only likes smart animals. Let\'s see if your team qualifies.'],
      ask: 'Play-fight Stanley?',
      yes: 'We are smart',
      no: 'Need to study first',
      win: [
        'He is not even sulking. That is basically a standing ovation.',
        'Stanley will visit your place on Allen St. He will judge your furniture. Do not take it personally.',
      ],
      lose: ['Stanley stared at your team until they went home. Classic Stanley. Try again when you are wiser.'],
    },
  },
  nicholas: {
    role: 'Tim\'s partner. Union staffer, law student, former dancer',
    lines: [
      ['Tim does the battling. I do the commentary. And what a performance that was. Truly. Riveting.'],
      [
        'Stanley sleeps on my side of the bed. Tim says that means Stanley loves me more. I say it means Stanley likes the electric blanket.',
      ],
      [
        'The tartan is vintage. So is the house. So is Stanley, in schnauzer years. We are a very vintage household.',
      ],
      ['Law school at night, union work by day. Contract law is just choreography with more commas.'],
      [
        'I used to dance. Contemporary, mostly. Now my only leap is over the puddle at the end of Glasgow Ave.',
      ],
    ],
    hints: {
      stanley: 'If Stanley walks off, keep at it. Three hearts and he stops ignoring you. Six and he comes to say hi. It is very moving.',
    },
    heartScenes: {
      2: [
        'Nicholas: "Law school by night, union office by day. I read contracts for fun now. Something has gone wrong with me."',
      ],
      4: [
        'Nicholas shows you a video of himself dancing, years ago. Leaps. Actual leaps. "Do not tell Tim you have seen this. He cries."',
      ],
      6: [
        'Nicholas: "When I am admitted, my first case is Stanley versus the electric blanket. He wants custody."',
      ],
    },
    helpsInBattle: 'Nicholas raises an objection. "Sustained!" says nobody, but the foe is rattled.',
  },
  binman: {
    role: 'Bin trainer of Laverton',
    lines: [
      [
        'These are my bins. Yellow lid, recycling. Dark green, garbage. Little white one, compost. Raised them from tiny wheelie bins.',
      ],
      ['Bin night is Tuesday. The bins know. They get restless around 6pm.'],
      [
        'Somebody put a pizza box with cheese stuck on it in the yellow bin. Contamination. My recycling bin is devastated.',
      ],
      ['Soft plastics do not go in the yellow bin! I will tell you that one for free, every single time.'],
    ],
    hints: {
      princess: 'The poodle on Allen St barks at my truck every single week. She is a worthy rival. My bins respect her.',
    },
    heartScenes: {
      3: ['Bin Man: "Want to know a secret? I name every bin on my route. That one\'s Kevin."'],
      6: ['Bin Man lets you ride in the truck for one street. You will never be the same.'],
    },
    helpsInBattle: 'The Bin Man\'s truck reverses in, beeping. Everyone panics.',
    battle: {
      challenge: [
        'Oi. You look like someone who puts soft plastics in the recycling.',
        'Only one way to settle this. A bin-off.',
      ],
      ask: 'Battle the Bin Man?',
      yes: 'Bring out the bins',
      no: 'Not today',
      win: [
        'Well I never. Beaten by a pet. My bins have never been so humbled.',
        'Here. Found these in the hard rubbish. Still sealed. Mostly.',
      ],
      lose: ['Ha! Wrong bin, wrong battle. Come back when you know your lids.'],
      again: ['Back for another bin-off? The bins have been training. Mostly by sitting there.'],
    },
  },
  spiro: {
    role: 'Runs the fish van on Kororoit Creek Rd',
    lines: [
      ['Spiro: "Forty years frying fish. Flake, potato cakes, dim sims. The dim sims are not Greek. Nobody complains."'],
      ['Spiro: "You catch, I buy. Better than the milk bar pays, I promise you. James knows. James is jealous."'],
      ['Spiro: "Carp? Fine, fine, I take carp. I will not tell you what goes in the potato cakes."'],
      ['Spiro: "Kororoit Creek used to be full of rubbish. Now there are eels again. The volunteers did that. Respect."'],
    ],
    giftLine: 'Spiro: "Here, a sardine for the dog. Off the books."',
  },
  julie: {
    role: 'Door knocker extraordinaire',
    lines: [['Julie Jana: "Twenty-one weeks! Every door counts!"']],
    byHero: {
      helen: [['Julie Jana: "Hey Helen!!! You ready for some door knocking? We could really use your help! Only 21 weeks until the election, no time to lose!"']],
      hadrian: [['Julie Jana: "Hey boys, where\'s your mumma? She\'s supposed to help me go door knocking."']],
      aleksy: [['Julie Jana: "Hey boys, where\'s your mumma? She\'s supposed to help me go door knocking."']],
    },
    battle: {
      tutorial: [
        '"Oh, is that Princess? Perfect. Let\'s warm up with a quick play-fight. Nobody gets hurt, promise."',
        '"Here\'s how it works. Pick one of Princess\'s moves each turn. Hits lower the other side\'s energy bar."',
        '"Every move has a type. The right type hits twice as hard, the wrong one half. Treats from your bag top her up."',
        '"Get their bar to zero and you win. If Princess runs out, she just runs home. Ready?"',
      ],
      win: [
        '"Ha! She\'s a natural. Way tougher than a door with a Beware of Dog sign."',
        '"Wild things jump out of tall grass, and people around town will want a play-fight too. Win and your pets get stronger."',
        '"Right, I\'ve got 400 doors to knock before lunch. See you on polling day!"',
      ],
      lose: [
        '"Don\'t stress, that\'s what warm-ups are for. Go home and rest her up, she\'ll be right."',
        '"Right, I\'ve got 400 doors to knock before lunch. See you on polling day!"',
      ],
    },
  },
  hipster: {
    role: 'Was into Brunswick before it was cool',
    lines: [
      ['This street was better in 2011. Before the second oat milk place opened.'],
      ['I ferment my own hot sauce. And kombucha. And opinions.'],
      ['My record collection is organised autobiographically. Do not touch it.'],
    ],
    heartScenes: {
      3: ['Hipster: "Your basil is... actually good. Do not tell anyone I said that."'],
    },
    helpsInBattle: 'The Hipster explains the foe is "derivative". It is crushed.',
    battle: {
      challenge: [
        'Oh. You battle? That is so mainstream.',
        'My team is quite underground. You probably have not heard of them.',
      ],
      ask: 'Battle the Hipster?',
      yes: 'Bring your vinyl',
      no: 'Too cool for me',
      win: ['I was going to lose anyway. Ironically.', 'Here. Take this. It was free with my oat flat white.'],
      lose: ['I liked battling before it was cool.'],
      again: ['Back again? I only battle people who were into it early.'],
    },
  },
  golfer: {
    role: 'Our neighbour. Golf, every day, rain or shine',
    lines: [
      ['Mornin\'! Off to the course. Again. The missus says I live there now.'],
      ['Your Frenchie got into my yard again. She ate a golf ball. She seems fine. Proud, even.'],
      ['People ask how I eat pies with no teeth. Patience, mate. And gravy.'],
    ],
    hints: {
      poppy: 'The little black Frenchie next door? Poppy. Charges at my buggy every morning. Sinead\'s usually out the front.',
    },
    heartScenes: {
      3: ['The golfer next door: "Hole in one, 1987. Lost the ball in the celebration. And a tooth."'],
    },
    helpsInBattle: 'The golfer next door yells FORE! Everyone ducks except your pet.',
    battle: {
      challenge: [
        'G\'day neighbour! Lost me teeth on the fourteenth hole in 2009. Never found \'em.',
        'Fancy a round? Loser buys the pies.',
      ],
      ask: 'Play a round?',
      yes: 'Tee off',
      no: 'Rain check',
      win: ['Ha! Good on ya. Best game I\'ve had since the teeth.', 'Here, a little something from the pro shop.'],
      lose: ['Hole in one! Well, close enough. Better luck next time, neighbour.'],
      again: ['Back for another round? The buggy\'s charged. Mostly.'],
    },
  },
  stranger: {
    role: 'Under the skyrail',
    lines: [
      ['Hey. You were there when I... yeah. Thanks for calling the ambos.'],
      ['I\'m seeing someone at the health service now. One day at a time.'],
      ['Day by day, mate. Day by day. Thanks for not walking past.'],
    ],
  },
  olly: {
    role: 'Runs the garden centre at Bunnings Warehouse, Altona North',
    lines: [
      ['Welcome to Bunnings! Seeds, tools, and house bits. If we don\'t have it, you don\'t need it.'],
      ['Water your beds every day, mate. Or get a sprinkler, and let the sprinkler worry about it.'],
      ['The snag stand is out the front on Saturdays. Onions on the bottom. That is not up for debate.'],
      ['A hose that reaches every bed in a garden. Changed my life. Changed my marriage, honestly.'],
    ],
    giftLine: 'Take a seedling. We had a few left over. Give it to someone who\'ll love it.',
    heartScenes: {
      2: [
        'Olly: "Twelve years at Bunnings. I know where every hinge in this warehouse lives. Every single one."',
      ],
      4: [
        'Olly gives you a red apron with your name on it. "Honorary team member. You still have to pay for things."',
      ],
      6: [
        'Olly: "Best thing about this job? Someone comes in for one screw and leaves with a veggie patch. Changes their life."',
      ],
    },
    helpsInBattle: 'Olly turns up with the sausage sizzle tongs. One snag, perfectly cooked, onions on the bottom.',
  },
  // ---- Hobsons Bay City Council (Altona). Paddy talks differently to Helen and the twins,
  //      and gives advice depending on what you have and haven't done yet (advice, below).
  paddy: {
    role: 'Mayor of Hobsons Bay. Helen\'s husband, the twins\' dad',
    lines: [
      ['Council is mostly meetings about meetings. And then, every so often, we fix a footpath. Glorious.'],
      ['The robes are ceremonial. I am told they are also "a lot". I am told this by everyone.'],
      ['People think being mayor is about power. It\'s mostly about bins. Bins, parking and the dog park.'],
    ],
    byHero: {
      helen: [
        ['Hey love. Have you eaten? Trish has been texting me. She thinks you haven\'t eaten.'],
        ['If Lesley rings the house, I\'m in a meeting. I\'m always in a meeting.'],
        ['Long day. Lesley yelled about the bike lane for forty minutes. Then about the font on the agenda.'],
      ],
      hadrian: [
        ['Hey buddy! Did you run here? Of course you ran here. You always run.'],
        ['No running in the chamber, mate. Actually, you know what. Run. Run past Lesley.'],
      ],
      aleksy: [
        ['Hey little man. Is that a biscuit? Where did you find a biscuit? We are in a council building.'],
        ['Aleksy, that is the mayoral chain, not a teething ring. Okay. Fine. Just for a minute.'],
      ],
    },
    // Paddy's advice: the first one that applies is what he says (see WorldScene.paddyAdvice).
    advice: {
      noPets: 'Princess is out the front on Allen St, guarding the court. Say hi and she might join your team.',
      oneTeam: 'When you head out the front door, you pick who comes with you. Up to three pets.',
      noGarden: 'Chris runs the community garden at the Edgars Creek wetlands in Reservoir. Have a chat and she\'ll give you a plot.',
      noMotion: 'See the noticeboard by reception? Those are motions for council. Chip in, and I\'ll try to get them through on Tuesday.',
      swing: 'Kirsty and Dahlia are the swing votes. Be nice to them. Bring them something they love. It\'s called politics.',
      train: 'Tap your myki at the green reader at a station. The train goes to any station you\'ve already visited.',
      friends: 'Make friends around town. At four hearts they\'ll jump in to help if you battle near where they live.',
      types: 'In a battle, pick moves that suit the foe. Water beats fire, park beats water. Look for "Strong!" on the button.',
      rest: 'Pets get their energy back when you come home. Or have a nap. Naps are underrated. I am a mayor and I know this.',
    },
    helpsInBattle: 'Paddy sweeps in, robes flapping. "As mayor, I declare this play-fight in our favour."',
    leaving: ['Paddy grabs his keys and the robes in a dry-cleaning bag.', 'Paddy: "Off to council. Big day of arguing about bins. Love you!"'],
  },
  lesley: {
    role: 'Councillor. Opposes everything Paddy does. Loudly',
    lines: [
      ['WHAT? NO! I DID NOT VOTE FOR THIS CONVERSATION!'],
      ['THE MAYOR IS RUINING THIS CITY! WITH BIKE LANES! AND TREES!'],
      ['I HAVE CONCERNS! I ALWAYS HAVE CONCERNS! I\'LL BE RAISING THEM AT LENGTH!'],
      ['Who let a child into the civic centre? Oh. It\'s HIS child. Of course it is.'],
    ],
  },
  malcolm: {
    role: 'Councillor. Votes with Lesley, every single time',
    lines: [
      ['Back in my day, a council fixed potholes and kept its opinions to itself.'],
      ['Community garden? Sounds like a waste of perfectly good car parking.'],
      ['I\'ll be seconding Councillor Bentleigh\'s motion. I haven\'t read it. I don\'t need to.'],
    ],
  },
  kirsty: {
    role: 'Councillor. A swing vote, leans towards Lesley',
    lines: [
      ['I like to keep an open mind. Then Lesley yells at me and it closes a bit.'],
      ['Convince me. I mean it. Nobody ever actually tries to convince me.'],
      ['I\'d vote for anything that came with a decent bunch of flowers. That was a joke. Mostly.'],
    ],
  },
  dahlia: {
    role: 'Councillor. A swing vote, leans towards Paddy',
    lines: [
      ['Paddy\'s heart is in the right place. His agendas are forty pages too long, but the heart is fine.'],
      ['I usually vote with the mayor. Usually. Keep him honest, I say.'],
      ['If the motion helps actual residents, I\'m in. If it\'s about the font on the agenda, I\'m going home.'],
    ],
  },
  ramon: {
    role: 'Karaoke king of Lohse St Reserve. Dad of Migs and Bea',
    lines: [
      ['Kumusta, neighbour! You sing? Everybody sings. Come, the mic is warm!'],
      ['My wife says I sing like Martin Nievera. My kids say I sing like a car alarm. Both are true.'],
      ['Every Sunday at Tita Baby\'s house we sing until the neighbours join in. Here, the magpies join in.'],
    ],
  },
  liza: {
    role: 'Tita Liza. Nurse at Werribee Mercy, karaoke legend on her day off',
    lines: [
      ['Kain na! Have some pancit, then you sing. That is the rule.'],
      ['Twelve-hour shift yesterday. Today, karaoke. You need balance, anak.'],
      ['Ramon picks the same song every time. I let him. It is love.'],
    ],
  },
  migs: {
    role: 'Migs. Six and three quarters. Plays air guitar',
    lines: [['I can do the high note! Listen! ...That was the high note.'], ['Papa says if I practise I can be on The Voice. Or Bunnings. Same thing.']],
  },
  bea: {
    role: 'Bea. Four. Backup dancer',
    lines: [['I am DANCING. Do you want to dance? You are dancing now.'], ['Mama sings the best. Papa sings the LOUDEST.']],
  },
  narelle: {
    role: 'Civic centre reception. Knows where everything is',
    lines: [
      ['Welcome to Hobsons Bay City Council. Take a number. There\'s nobody else here, but take a number.'],
      ['Council meets Tuesdays at 6:30pm, through the doors on the left. The biscuits go by 6:45.'],
      ['The noticeboard is for motions. Chip in and they go to the next meeting. Very democratic. Very slow.'],
      ['Cr Bentleigh has complained about the pot plants again. They are plastic. She says they look "smug".'],
    ],
  },
  rayna: {
    role: 'Councillor. Paddy\'s ally',
    lines: [
      ['Hi! Has the mayor fed you? He forgets to feed himself on meeting days.'],
      ['Lesley called a point of order on my point of order. It was a long night.'],
      ['We\'ve got the numbers on the community garden. Probably. Bring snacks on Tuesday.'],
    ],
    helpsInBattle: 'Rayna moves a motion that the foe calm down. Seconded. Carried.',
  },
  deanna: {
    role: 'Councillor. Paddy\'s ally',
    lines: [
      ['Every motion is a little fight for the people who actually live here. I love it.'],
      ['Do you know how many trees we planted last year? Ask me. Go on. Nobody ever asks.'],
      ['The bike lane will pass. It has to. My calves are counting on it.'],
    ],
    helpsInBattle: 'Deanna plants a tree right in front of the foe. It is very confused.',
  },
  shannon: {
    role: 'Bookseller at Brunswick Bound, Sydney Rd. Knows a fact about everything',
    lines: [
      ['Fun fact: Australia was one of the first places in the world where women could vote AND stand for parliament. 1902. South Australia even earlier.'],
      ['Fun fact: compulsory voting means about 90 per cent of us vote. In the US it\'s more like two thirds. And their elections are on a Tuesday. A Tuesday!'],
      ['Fun fact: the US Senate filibuster record is over 24 hours. Strom Thurmond, 1957, against civil rights. He had a bucket. Don\'t ask about the bucket.'],
      ['Fun fact: the Australian ballot, the secret one, was invented in Victoria in 1856. The Americans literally call it "the Australian ballot". You\'re welcome, world.'],
      ['Fun fact: our upper house uses preferences, so a senator can get in on two per cent of the primary vote. Ask Rose about it. Actually, don\'t. She\'ll tell you for an hour.'],
      ['Fun fact: in 1975 the Governor-General sacked the Prime Minister. Nobody has ever really calmed down about it. Least of all my dad.'],
      ['Welcome to Brunswick Bound! Classics up the back, new releases on the tables, picture books at toddler height.'],
      ['Buying a present? Monkey Grip for a Melbourne person. Cloudstreet for a crier. Fourth Wing for anyone who likes dragons.'],
    ],
  },
  bazza: {
    role: 'Runs the Anaconda in Preston. Fishing nut',
    lines: [
      ['G\'day! Hike, bike, camp, fish, kayak. Mostly fish, if you ask me.'],
      ['Get yourself a rod. Edwardes Lake has redfin. Edgars Creek has yabbies. Kororoit Creek has... a lot of old boots.'],
      ['Bait helps. Worms. The fish don\'t care about your feelings, they care about worms.'],
      ['Eels have been in Melbourne creeks longer than Melbourne has. Show some respect.'],
    ],
  },
  sam: {
    role: 'Runs Plenty Road Convenience, Preston. Smokes, American confectionary, vapes',
    lines: [
      ['Welcome! Reese\'s, Takis, Twinkies, Pop-Tarts. Everything an American kid eats and an Australian kid wants.'],
      ['Dr Pepper is seven dollars because it came on a boat. The boat is expensive. Not my fault.'],
      ['The Stolberg crowd come in after the pub. Takis. Every time. Their fingers glow red on the tram home.'],
      ['Vapes? Officially pharmacy only now. The sign says VAPES because nobody will pay for a new sign.'],
      ['Your mate from the units on Plenty Rd? Mango Ice. I know everyone by flavour. It is a gift and a curse.'],
    ],
  },
  franco: {
    role: 'Franco Cozzo himself, Footscray',
    lines: [
      ['Footscray! Brunswick! Come on down! Megalo sale! Megalo! Very cheap price! You will be very happy!'],
      ['This couch? Hand carved. Italian. Very beautiful. Your nonna will cry. In a good way.'],
      ['The banana couch. It is not a couch, it is a lifestyle. Your back will thank you. Your guests will stare.'],
      ['Leather, my friend. Real leather. In summer it sticks to your legs. That is how you know it is real.'],
      ['Grazie, grazie! You walk past, you look, you come back. Everybody comes back to Franco.'],
    ],
  },
  // ---- Carlton and the city
  dell: {
    role: 'Walks Girlie the black lab in Carlton Gardens',
    giftLine: 'Here, a spare tennis ball. Girlie has forty. She only loves the one she lost under the fountain.',
    lines: [
      ['Morning! Girlie, leave it. LEAVE IT. That is somebody\'s croissant. Sorry. She is a lab. It is a lifestyle.'],
      ['Two laps of the gardens every morning. Girlie does about six, mostly sideways, mostly towards picnics.'],
      ['Carlton has changed so much. The trams are the same, though. The 96 still rattles up Nicholson St like it owns the place.'],
      ['Like the glasses? Pink. Life is too short for beige frames.'],
    ],
    hints: {
      girlie: 'Girlie is mine, love. If you want her on your team, you will have to win her fair and square. She will not mind. She likes everyone.',
    },
    heartScenes: {
      3: ['Dell: "Girlie came from the lost dogs home. Skinny, nervous little thing. Look at her now. Built like a coffee table."'],
      6: ['Dell squeezes your arm. "You look after her, won\'t you. She thinks she\'s a lap dog. Let her."'],
    },
    helpsInBattle: 'Dell strides over, pink glasses flashing. "Oi! Play nicely!" Everyone, including the foe, sits.',
    battle: {
      challenge: ['You want Girlie on your team? Ha! You will have to get past her first. Good luck. She is mostly tongue.'],
      ask: 'Battle Dell?',
      yes: 'Go, team',
      no: 'Not yet',
      win: ['Well! She likes you. Go on then, Girlie. Off you go. Do not eat their couch.', 'She will be at your place. Bring towels. She WILL find water.'],
      lose: ['Ha! Told you. Come back with more treats. That is how you win a lab over.'],
    },
  },
  // ---- Carlton and the city
  gina: {
    role: 'Runs the gelateria on Lygon St',
    lines: [
      ['Benvenuti! Pistachio is the real test of a gelateria. Ours is green because of pistachios, not because of food dye.'],
      ['The dog gelato is peanut butter and banana. No sugar. The dogs do not know that. Please do not tell them.'],
      ['My nonna made gelato in a bucket of ice and salt in 1956. I have a machine from Bologna. She still thinks hers was better.'],
      ['Lygon St rent has gone up again. Every scoop is now four percent landlord.'],
    ],
    giftLine: 'Here, a cup of the dog gelato. Tell your pets it is from Gina.',
    heartScenes: {
      3: ['Gina hands you a tiny spoon of something new. "Fig and honey. You are the first to try it. Tell me the truth."'],
      6: ['Gina: "When I opened, the bank said a girl cannot run a shop on Lygon St. Thirty years. I keep their letter on the fridge."'],
    },
    helpsInBattle: 'Gina sprints out of the gelateria with a cup of something cold. "Mangia! Then fight!"',
  },
  spruiker: {
    role: 'Spruiker on Lygon St. Will find you a table',
    lines: [
      ['Table for two? Table for you and your little friend? Ten percent off, free garlic bread, I love you, come in.'],
      ['My cousin\'s restaurant next door? Terrible. Same kitchen as ours, but terrible.'],
      ['Thirty years on this footpath. I have seated three premiers and a man who said he was a Wiggle.'],
    ],
    heartScenes: {
      3: ['Tony lowers his voice. "The secret? Make them feel like family. Then charge them like family. Which is a lot."'],
    },
    helpsInBattle: 'Tony steps in with a menu. "Signore, please, sit down, have the special." The foe sits down.',
    battle: {
      challenge: ['Ah! A pet person! Before you eat, a little contest. Win, and the garlic bread is on the house.'],
      ask: 'Battle Tony?',
      yes: 'Table for one',
      no: 'Just looking',
      win: ['Bravo! Bravissimo! You eat for free. Well. The garlic bread is free. Everything else is full price.'],
      lose: ['Ha! Come back hungry. You fight better on a full stomach. Everyone knows this.'],
      again: ['Back again? The meatballs have been resting. They are furious.'],
    },
  },
  enzo: {
    role: 'Plays bocce on Sundays, argues about it the rest of the week. Since 1971',
    lines: [
      ['That ball was touching. I do not care what Vince says. Vince needs new glasses.'],
      ['I came on a ship in 1961. Ten days of seasick, then Carlton. Best decision of my life. Second best was my wife.'],
      ['Lemons from my tree in Brunswick. Take one. Take two. Nobody in my family eats them any more.'],
    ],
    giftLine: 'A lemon from my tree. Grow up strong. Like the lemon.',
    heartScenes: {
      4: ['Nonno Enzo shows you a photo: a young man on a ship\'s deck, squinting. "Me. Nineteen. Not one word of English. Look at me now. Four words."'],
    },
    helpsInBattle: 'Nonno Enzo rolls a bocce ball across the ground. Perfect line. It clips the foe right on the ankle.',
  },
  vince: {
    role: 'Plays bocce with Enzo. Wins, mostly. Shares his table on Lygon St',
    lines: [
      ['Enzo has been cheating since 1971. I let him. It makes him happy. Do not tell him.'],
      ['When I was a boy, a coffee on Lygon St was twenty cents. Now it is six dollars and they draw a leaf on it.'],
      ['My grandson is an engineer. Builds bridges. Joined the union first day. Smart boy. Smarter than me.'],
    ],
  },
  mia: {
    role: 'Melbourne Uni student. Arts and law. Tired',
    lines: [
      ['I have three essays due and I am at a gelateria. This is called balance.'],
      ['My rent is more than my Youth Allowance. So I work at a cafe. To afford the cafe.'],
      ['Did you know the Exhibition Building is where the first federal parliament sat? I learnt that for an exam. Then forgot. Then remembered.'],
    ],
    heartScenes: {
      3: ['Mia: "I joined the student union to get free sausages. Now I am on the rent campaign. The sausages were a trap. A good trap."'],
    },
  },
  ana: {
    role: 'Volunteers at Melbourne Museum',
    lines: [
      ['Welcome! The dinosaurs are on the left, Phar Lap is in the middle, and the forest gallery is through the glass.'],
      ['People ask if Phar Lap is real. Yes. People ask if he is happy. He is a horse in a glass box. He is at peace.'],
      ['Kids love the bugs. Adults pretend not to. Then they spend an hour at the bugs.'],
    ],
    heartScenes: {
      3: ['Ana: "I taught science for forty years. Now I volunteer. Same job, no marking, and the dinosaurs never talk back."'],
    },
    helpsInBattle: 'Ana arrives with a museum fact so interesting the foe stops to listen.',
  },
  jun: {
    role: 'Wedding photographer. Works the fountain',
    lines: [
      ['Every Saturday, six weddings, one fountain. We have a roster. It is in a group chat.'],
      ['Golden hour is at five today. Golden hour is my whole personality.'],
      ['You and your pets want a photo? Stand there. Chin down. Now the dog chin down. No, the other dog.'],
    ],
  },
  possumpat: {
    role: 'Leads possum spotting walks in Carlton Gardens',
    lines: [
      ['Come back after dark. Brushtails in every tree. Ringtails if you are lucky. Pat if you are very lucky.'],
      ['Do not feed the possums. They have enough bread. They have, frankly, too much bread.'],
      ['A possum once lived in my roof for six years. I named him Kevin. He paid no rent. Neither did I, it was a share house.'],
    ],
    giftLine: 'Found a feather on my walk. Magpie, I think. Or a very small angel.',
  },
  chesskev: {
    role: 'Plays giant chess at the State Library. Every day',
    lines: [
      ['Pawn to e4. I always open pawn to e4. Have done since 1983. People know it now. They still lose.'],
      ['The trick with giant chess is your back. Lift with your legs. The king weighs four kilos.'],
      ['Some bloke beat me in 2004. I think about it every day. He never came back.'],
    ],
    heartScenes: {
      4: ['Chess Kev: "Thirty years a fitter at the railway workshops. Then they shut it.', 'So now I play chess. Still moving heavy things around."'],
    },
    helpsInBattle: 'Chess Kev appears, studies the board, and quietly moves your pet out of danger. "Check."',
  },
  luca: {
    role: 'Busks on Swanston St',
    lines: [
      ['Request? I only know four songs. Three of them are the same song with a different hat.'],
      ['Permit? Of course I have a permit. Council issued. Laminated. I laminate everything.'],
      ['Best spot in the city is outside the library. Good acoustics, and the chess players clap for anything.'],
    ],
  },
  margaret: {
    role: 'Librarian in the State Library reading room',
    lines: [
      ['Welcome to the reading room. Membership is free. Wifi is free. Talking is, unfortunately, also free. Please keep it down.'],
      ['People think libraries are quiet. Libraries are where you go to find out everything. That is very loud, actually.'],
      ['Ned Kelly\'s armour is upstairs. He came in for the reading room once. Kidding. Shhh.'],
    ],
    giftLine: 'A book from the discard trolley. It deserves a second life. So do we all.',
    heartScenes: {
      3: ['Margaret: "When they wanted to cut our hours, we organised. Petitions, rallies, the lot. Librarians are terrifying when we have a cause."'],
      6: ['Margaret slips a bookmark into your hand. It reads: "Knowledge is power. Libraries are free. Draw your own conclusions."'],
    },
    helpsInBattle: 'Margaret appears from nowhere. "SHHH." The foe is so startled it forgets what it was doing.',
  },
  mai: {
    role: 'Runs the souvenir kiosk at Fed Square',
    lines: [
      ['Koalas, snow globes, boomerangs, tram magnets! Everything says Melbourne on it. Some of it was made in Melbourne.'],
      ['The four seasons umbrella is my best seller. Tourists buy it at 9am in the sun. By 11am they understand.'],
      ['My mum ran this kiosk for twenty years. Now me. Same spot, same koalas. The koalas are very loyal.'],
    ],
  },
  raelene: {
    role: 'Nurse. On the Parliament steps today',
    lines: [
      ['Safe staffing ratios save lives. One nurse, four patients. Not one nurse, twelve and a broken lift.'],
      ['We did a twelve hour shift, then came here. My feet are a disaster. My spirit is excellent.'],
      ['The pollies inside call us heroes. Lovely. Heroes would also like a pay rise and a lunch break.'],
      ['Every right at work was won by people standing on steps like these. The weekend did not come from nowhere.'],
    ],
    heartScenes: {
      3: ['Raelene hands you a sticker: "WHEN WE FIGHT, WE WIN." "Put it on the pram. The twins can start early."'],
      6: ['Raelene grins. "We won the ratios! In writing. Took three years, a thousand nurses and a lot of thermoses of tea. Never give up, eh."'],
    },
    helpsInBattle: 'Raelene checks your pet\'s pulse, gives a thumbs up and patches it up. "Twelve hour shift. This is nothing."',
  },
  officer: {
    role: 'Authorised officer. Patrols Flinders Street Station',
    lines: [
      ['Afternoon. Just checking everyone has touched on. You touched on, yeah? Course you did.'],
      ['I am not the bad guy. The bad guy is the bloke who designed the myki top up machine.'],
      ['Three hundred dollar fine for a two dollar fare. I do not make the rules. I just enforce them. Very slowly.'],
    ],
    battle: {
      challenge: ['Excuse me. Can I see your myki? Your pets\' mykis? No? Right. Let\'s sort this out the old-fashioned way.'],
      ask: 'Battle the Myki Inspector?',
      yes: 'Show your myki',
      no: 'Walk briskly away',
      win: ['Fine. FINE. No fine. On your way. And touch on next time, yeah?'],
      lose: ['That\'ll be a warning. This time. Have a nice day.'],
      again: ['You again. I remember faces. And cards. Especially cards.'],
    },
  },
  remy: {
    role: 'Runs a coffee cart on Degraves St',
    lines: [
      ['Long black? Magic? Batch brew? Tell me how you feel and I will tell you what you are drinking.'],
      ['A magic is a double ristretto with steamed milk in a small glass. Melbourne invented it. Nobody else knows. Keep it that way.'],
      ['Twelve coffee places on this one laneway. We all buy beans from the same roaster. Please do not tell the tourists.'],
    ],
    heartScenes: {
      3: ['Remy: "I was a chef for ten years. Fifteen hour days, cash in hand. The cart is small, but I am the boss. And I get Sundays."'],
    },
    helpsInBattle: 'Remy hands your pet a babyccino. Marshmallow and everything. It gets its second wind.',
  },
  spray: {
    role: 'Street artist. Hosier Lane is the gallery',
    lines: [
      ['That wall? Mine. Was mine. Someone painted over it on Tuesday. That is the deal here. Nothing lasts.'],
      ['Tourists photograph my work for their socials. I get no credit. I get a lot of selfies in front of me, though.'],
      ['I did a mural of a magpie on Sydney Rd. A real magpie swooped it. Best review I have ever had.'],
    ],
    battle: {
      challenge: ['You want to paint here, you earn a wall. That is how it works. Show me what your crew has got.'],
      ask: 'Battle Spray?',
      yes: 'Earn a wall',
      no: 'Just looking',
      win: ['Respect. Here, take a sticker. Put it somewhere weird.'],
      lose: ['Not bad. Not a wall yet, though. Maybe a small bin.'],
      again: ['Back for another go? The lane has been repainted twice since you left.'],
    },
  },
  dev: {
    role: 'Waiting under the clocks',
    lines: [
      ['I am meeting someone under the clocks. Our first date. I am twenty minutes early. I am fine. I am totally fine.'],
      ['Which clock? There are nine clocks. I said "under the clocks". I should have said which clock.'],
      ['They texted! They are on a train from Frankston. Signal fault at Mordialloc. So, another hour. I am fine.'],
    ],
    heartScenes: {
      4: ['Dev, glowing: "Remember my date? We went to Hosier Lane, then dumplings, then talked till the last train. Second date Friday. Same clock."'],
    },
  },
  marj: {
    role: 'Station staff at Flinders Street',
    lines: [
      ['Next train to anywhere? Board on platform ten. Or it might be thirteen. Check the screen. Then check it again.'],
      ['Twenty two years at Flinders St. I know every pigeon by name. Most of them are called Gary.'],
      ['Under the clocks is the most famous meeting spot in Melbourne. Also the most famous place to get stood up.'],
    ],
  },
  dot: {
    role: 'Runs the hot jam donut van, down at Fed Square for the season',
    lines: [
      ['Hot jam donuts! Careful, the jam is the temperature of the sun. Every year someone forgets. Every year it is my brother-in-law.'],
      ['This van has been here since 1950. Dad ran it, then me. Same recipe. Same van. New tyres, once.'],
      ['Five for ten dollars. Or one for you and four for the walk home. There will be none left by the tram.'],
    ],
    giftLine: 'A hot jam donut for the road. Blow on it. Seriously, blow on it.',
    heartScenes: {
      4: ['Dot: "People ask for the recipe. It is flour, sugar, jam and seventy years of standing in a van. The last bit is hard to buy."'],
    },
    helpsInBattle: 'Dot leans out of the van and lobs a hot jam donut. Your pet catches it. The foe gets the jam.',
  },
  yianni: {
    role: 'Runs a Queen Vic deli stall, at Fed Square for the season',
    lines: [
      ['Try the feta. Try the olives. Try the dolmades. Trying is free. Buying is how I put my kids through uni.'],
      ['Sixty cheeses in this cabinet. My wife can name them all with her eyes closed. I can name forty. On a good day.'],
      ['Saturday mornings, the queue goes past the meat hall. People wait an hour for my taramasalata. I would too.'],
    ],
    giftLine: 'Some cheese, for the pets. Not the good cheese. The good cheese is for people.',
    heartScenes: {
      3: ['Yianni: "My father came from Kalamata with one suitcase and a jar of olives. The jar did not survive the trip. The business did."'],
    },
    helpsInBattle: 'Yianni throws an olive with deadly accuracy. Pit and all.',
  },
  carmel: {
    role: 'Sells fruit and veg at the Fed Square market stalls. Buys crops too',
    lines: [
      ['Two dollar a bag! Two dollar! Strawberries, two dollar! Come on, darl, two dollar!'],
      ['Grow your own? Bring it here. I will buy it, and I will not even tell the customers it came from a toddler.'],
      ['Up at three, at the wholesale market by four, here by six. My husband says I am mad. He is still asleep.'],
    ],
    giftLine: 'Strawberries, a bit squashed. Still sweet. Like me.',
  },
  ward: {
    role: 'Runs the Edinburgh Castle bottle shop. Betty\'s partner. Knows his beer',
    lines: [
      ['VB? No. Put it down. Try this: a hazy pale from a garage in Thornbury. Three people brew it. Two of them are twins.'],
      ['This week it\'s sours. A raspberry gose from Ballarat. It tastes like a picnic that got a bit wild.'],
      ['Wine people are coming round to orange wine. Beer people are coming round to anything with a cartoon on the can.'],
      ['Mountain Goat? Classic. But have you tried their small batch? No. Nobody has. That\'s the point.'],
      ['Betty sends me to work with leftovers every day. The whole of Sydney Rd knows when it\'s lasagne Monday.'],
    ],
    heartScenes: {
      2: ['Ward: "I used to run a pet shop, you know. I still miss the animals. That\'s why I say hello to everyone\'s dog. Every single one."'],
      4: ['Ward slips you a can with a hand-drawn label. "Coburg nano-brewery. Only forty cans exist. Thirty-nine now."'],
      6: ['Ward: "Betty and I have been together nineteen years. She cooks, I bring the beer. It\'s a good system."'],
    },
    helpsInBattle: 'Ward rolls a keg out the side door. It thunders past the foe, who dives out of the way.',
  },
  romey: {
    role: 'Runs The Leash You Can Do, Hope St',
    lines: [
      ['Welcome to The Leash You Can Do! Treats, gear, and a goldfish called Kevin who is not for sale.'],
      ['Free Palestine. I\'ll keep saying it. Every bag that goes out of here has a little watermelon sticker on it now.'],
      ['My dad\'s got a farm out near Ballarat. Sheep, two dogs, one very rude goose. I learned everything about animals from that goose.'],
      ['My boyfriend Bryan works at the Ballarat Courier. Last week he put his work shirts in with the bleach. Half his wardrobe is now "vintage". He wore it to work.'],
      ['Bryan got in trouble at the Courier again. He ran a photo of a prize-winning pumpkin. Upside down. On the front page.'],
      ['Gear makes a real difference in a play-fight. A good lead keeps them steady. A bow tie makes them clever.'],
    ],
    heartScenes: {
      2: ['Romey: "Dad says you can tell a lot about a person by how their dog looks at them. Yours look at you like you\'re the sun."'],
      4: ['Romey: "Bryan tried to make me dinner. He set off the smoke alarm, then the neighbour\'s, then the one at the servo. Three alarms. A personal best."'],
      6: ['Romey: "If I ever get my own place out at Dad\'s, there\'ll be room for every animal nobody wants. You\'ll visit. That\'s an order."'],
    },
    helpsInBattle: 'Romey slides over a free sample from the counter jar. "Shh."',
  },
  sharma: {
    role: 'Palm reader, Preston Market. Gives readings by the deli hall',
    lines: [
      ['Your palm, please. Ah. A long life line. A short attention span. And a very strong craving for borek.'],
      ['I see a journey. Possibly on the 86 tram. Possibly delayed. The lines are never clear about the 86.'],
      ['Palm reading is an ancient art. Also, ten dollars. Card is fine. The spirits accept tap.'],
    ],
    battle: {
      challenge: ['Mr Sharma takes your hand and gasps. "I see... a battle! Right now! With me!"', '"And if you lose, the reading costs one hundred dollars. The spirits are very clear about that."'],
      ask: 'Battle Mr Sharma?', yes: 'Show me my future', no: 'Close my hand',
      win: ['"I did not see that coming. Which is, professionally, embarrassing."', '"No charge today. Please do not leave a review."'],
      lose: ['"As foretold! One hundred dollars, please. The spirits also accept tap."'],
      again: ['"Back so soon? I knew you would be. I am, after all, a professional."'],
    },
  },
  crazyjeff: {
    role: 'President of the Brunswick Bowls Club. Has never once been called "Jeff"',
    lines: [
      ['They call me Crazy Jeff because in 1987 I bowled barefoot in a hailstorm. And won. And then did it again.'],
      ['The jack is the little white ball. Get closer than the other bloke. That\'s it. That\'s the whole game. Fifty years and it never gets old.'],
      ['Barefoot bowls Friday nights. Young people come for the cheap jugs, stay for the glory.'],
      ['Beat us old blokes a few times and the committee might have to dig something out of the cabinet for you. Not that you will.'],
    ],
    battle: {
      challenge: ['Crazy Jeff cracks his knuckles. "You\'ve got the look of a bowler. Let\'s see if you\'ve got the weight."'],
      ask: 'Battle Crazy Jeff?', yes: 'Roll up', no: 'Maybe on Friday',
      win: ['"Ha! Toucher! Lovely weight. You can have a membership. Pay the treasurer. She\'s terrifying."'],
      lose: ['"Short again! You\'ll get there. Bend the knees."'],
      again: ['"Back for another end? Good on ya."'],
    },
  },
  bowler1: { role: 'Bowls every day. Has opinions on the green', lines: [['Green\'s running fast today. Too fast. Crazy Jeff had it shaved. Don\'t tell him I said.'], ['Forty years at this club. Seen four presidents. Jeff\'s the only one who\'s bowled in a hailstorm.']] },
  bowler2: { role: 'Bowls every day. Mostly for the afternoon tea', lines: [['I don\'t come for the bowls. I come for the scones at three o\'clock. The bowls is just what happens between.'], ['Mind the ditch. I fell in it in 2003 and they still bring it up.'], ['There\'s a cup in the cabinet nobody\'s won since 1987. Keep beating Jeff and see what happens.']] },
  ghost: {
    role: 'Haunts Reservoir Station after dark',
    lines: [
      ['Oooooo. I have been waiting for the last train since 1987. Is it here yet? No? Oooooo.'],
      ['They put the trains up on the skyrail. Do you know how hard it is to haunt a skyrail? Very windy.'],
      ['My dog and cat came with me. Into the afterlife. They are very loyal. And very see-through.'],
    ],
    battle: {
      challenge: ['A pale figure drifts out from behind the pillars. "Oooooo. You can see me? Then you can battle me."'],
      ask: 'Battle the ghost?', yes: 'Bring it', no: 'Run for the train',
      win: ['"Oooo... well played. You may pass. The next train is in... forever."'],
      lose: ['"Ooooo! The ghost wins! Again! I have a lot of practice."'],
      again: ['"Back again after dark? Ooooo. Brave."'],
    },
  },
  fairy: {
    role: 'A real fairy. Only visits Coburg Station every few days',
    lines: [
      ['Oh! You can see me? Most people only see a pigeon.'],
      ['I come down to Coburg every few days for the cannoli. Don\'t tell the other fairies.'],
    ],
  },
  bencarroll: {
    role: 'Premier of Victoria. Allegedly',
    lines: [
      ['I\'m not blocking the city. I\'m activating a temporary pause on pedestrian access. Press release went out at 4:59 on a Friday.'],
      ['Kinder? Rest assured, it\'s a priority. It\'s in the forward estimates. Way, way forward. Past the horizon, basically.'],
      ['The Suburban Rail Loop is fully funded. Until about 2050. Don\'t look at the cost. Look at the hi-vis. Isn\'t it bright?'],
      ['Rent too high? Have you tried owning a house instead? I have. Several times. Highly recommend it.'],
      ['The western suburbs? We love you. Every four years. Like clockwork.'],
      ['I\'ll take that on notice. I\'ll get back to you. I won\'t.'],
    ],
    battle: {
      challenge: [
        'The Premier looks at you like you\'re a bad poll. "Ah. Constituents. I\'ve been briefed on you. Very briefly."',
        '"Nobody gets into the city today. Not without a meeting with my office. The next opening is March. Next March. Probably."',
        '"Of course, you could always try to beat me. Many have. Well. None have. I have a very good media unit."',
      ],
      ask: 'Battle the Premier?', yes: 'Hold him to account', no: 'Write a strongly worded letter',
      win: [
        'The Premier\'s smile flickers. "SYSTEM... ERROR. ANNOUNCEABLE NOT... FOUND."',
        'His face slides off to show a tangle of wires and a laminated card of talking points. The Premier was a robot all along!',
        'The police line packs up quietly. The way into the city is open.',
      ],
      lose: ['"That\'ll be two hundred dollars. Call it a congestion levy. On you, specifically."', '"Now off you go. And remember: we\'re getting on with it."'],
      again: ['"You again. I\'ve had my face reattached and the talking points updated. Let\'s go."'],
    },
  },
  ...SH_PEOPLE,
};

export let PET_TEXT = {
  chloe: {
    bio: 'Adam and Chelsea\'s kelpie. Works all day, then sits on a chair at the pub like a person.',
    clue: 'A black and tan kelpie lives in the front unit on Holmes St, Brunswick East. She knows every tram timetable.',
    funFact: 'She has her own bar stool at the local. Nobody decided this. It simply happened.',
    favouriteSpot: 'The driveway at Holmes St, where she can see the whole street at once.',
    lines: {
      0: [
        'Chloe watches you from the driveway. She is working out whether you are livestock.',
        'Chloe does one lap of you at speed. Assessment complete.',
        'Chloe drops a ball at your feet and stares. This is not a request.',
      ],
      3: [
        'Chloe leans her whole weight against your leg. Kelpies do not do halfway.',
        'Chloe herds you gently towards the front gate. She has decided it is time to go somewhere.',
      ],
      6: [
        'Chloe trots at your heel, checking back every few steps that you are keeping up.',
        'Chloe hears a tram three streets away and tells you about it at length.',
      ],
      9: ['Chloe falls asleep across your feet mid-pat. The tail keeps wagging the whole time.'],
    },
    night: ['Chloe is curled on the doormat, one ear up, on duty.'],
    rain: ['Chloe is out in the rain anyway. Kelpies consider weather a rumour.'],
    asleep: ['Chloe is asleep on the couch she is absolutely not allowed on.'],
  },
  princess: {
    bio: 'The guardian of Laverton. Sassy, fluffy, and ready to attack.',
    clue: 'Locals talk about a tiny, very fluffy security guard who patrols Allen St. Try right out the front.',
    funFact: 'Her pink tail and pink paws are not natural. Her confidence absolutely is.',
    favouriteSpot: 'The exact centre of the Allen St court, where everyone can see her.',
    lines: {
      0: [
        'Princess looks you up and down. You have not passed inspection.',
        'Princess yaps once. That was a warning.',
        'Princess fluffs her pom-poms. Laverton is under her protection.',
      ],
      3: [
        'Princess allows you to stand slightly closer than before. An honour.',
        'Princess sniffs your shoe and decides it can stay.',
      ],
      6: [
        'Princess trots beside you for a few steps, like a tiny bodyguard.',
        'Princess barks at a passing ute on your behalf.',
      ],
      9: ['Princess rolls over for a belly rub. If you tell anyone, she will deny it.'],
    },
    night: ['Princess is on night patrol. Her eyes glint under the streetlight.'],
    rain: ['Princess refuses to acknowledge the rain. The rain is beneath her.'],
    asleep: ['Princess is asleep, curled into a perfect cloud. She snores like a tiny diesel engine.'],
    evolvedBio: 'Princess, but on fire. Laverton has never been safer, or warmer.',
  },
  salami: {
    bio: 'A foundling with a vicious strike.',
    clue: 'Something stripy rules the driveway of a blue-grey block of flats on Donald St.',
    funFact: 'Owns at least three milk crates and one wheelie bin, by right of conquest.',
    favouriteSpot: 'The warm concrete of the driveway at 10 Donald St, around mid-morning.',
    lines: {
      0: [
        'Salami eyes your ankles like they owe her money.',
        'Salami headbutts your leg, then swipes it. Mixed signals.',
        'Salami has claimed a milk crate. It is hers now.',
      ],
      3: ['Salami follows you to the end of the lane, then pretends she was going there anyway.'],
      6: [
        'Salami brings you a leaf. It is a gift. Do not refuse the leaf.',
        'Salami slow-blinks at you. In cat, that is a love letter.',
      ],
      9: ['Salami curls up on your feet. You are not allowed to move now. Those are the rules.'],
    },
    night: ['Salami is out on her night rounds. She knows every cat on Sydney Rd, and outranks most of them.'],
    rain: ['Salami glares at the rain from under a terrace verandah, as if it was your idea.'],
    asleep: ['Salami is having her afternoon nap in a sunbeam. Disturb her at your peril.'],
    evolvedBio: 'Salami, aged and cured to perfection. Sopressa wears a flat cap, sits on the porch and judges Donald St.',
  },
  spooky: {
    bio: 'A night walker who can phase in and out of reality at will.',
    clue: 'Late-night diners at A1 Bakery on Sydney Rd swear a black shape flickers between the tables. Easier to spot after dark.',
    funFact: 'Has been seen in two places at once. Nobody has been brave enough to check which was the real one.',
    favouriteSpot: 'Under the outdoor tables at A1 Bakery, catching dropped za\'atar.',
    lines: {
      0: [
        'Spooky flickers out of sight, then reappears right behind you.',
        'Spooky stares at something you can\'t see.',
        'You blink and Spooky is somewhere else entirely.',
      ],
      3: ['Spooky lets you see her for a full five seconds. A rare privilege.'],
      6: ['Spooky does a binky: a little twisting leap of joy. Then she vanishes mid-air.'],
      9: ['Spooky nudges your hand. For a moment, you can see through her. It feels like a secret.'],
    },
    night: [
      'Spooky is fully solid in the moonlight. She seems more herself at night.',
      'Spooky thumps the ground once. Every duck on the pond falls silent.',
    ],
    rain: ['Raindrops fall straight through Spooky. She does not seem to mind.'],
    asleep: ['Spooky is asleep, which mostly means she is see-through and very still.'],
    evolvedBio: 'Spooky has gone full poltergeist. Doors open by themselves. Carrots go missing. She is very pleased with herself.',
  },
  poppy: {
    bio: 'Pure muscle and brawn, with very little brains. Ready to bust her way through.',
    clue: 'Unit 1, 835 Plenty Rd (round the corner on Loddon Ave) reports being "body-checked by a small black brick" in the driveway.',
    funFact: 'Has tried to race every jogger at Edwardes Lake. Win record: zero. Enthusiasm: infinite.',
    favouriteSpot: 'The middle of the shared driveway, where every delivery driver has to say hello.',
    lines: {
      0: [
        'Poppy charges at you and bounces off. She is thrilled about it.',
        'Poppy snorts loudly. Possibly a thought. Probably not.',
        'Poppy tries to squeeze through a gap that is clearly too small.',
      ],
      3: ['Poppy leans her whole weight against your legs. It is like being hugged by a bag of cement.'],
      6: ['Poppy does a lap of the picnic tables in your honour. Then another. Then she falls over.'],
      9: [
        'Poppy sits on your foot and looks up at you with total devotion. Her brain is empty. Her heart is full.',
      ],
    },
    night: ['Poppy is fighting sleep and losing. Her eyelids are doing their best.'],
    rain: ['Poppy is trying to eat the raindrops. She is getting some.'],
    asleep: ['Poppy is asleep on her back with all four legs in the air. Snoring at an impressive volume.'],
    evolvedBio: 'Poppy has become a squeaky rubber toy made of rock. Nobody, including Poppy, knows how.',
  },
  stanley: {
    bio: 'Grumpy but loyal. Only likes smart animals like him.',
    clue: 'A distinguished grey gentleman supervises Glasgow Ave from behind an orange brick fence. He will not come to you.',
    funFact: 'Thinks most dogs are idiots. Is usually right.',
    favouriteSpot: 'The front lawn at 57C, where he can judge the whole street at once.',
    lines: {
      0: [
        'Stanley sighs. He was hoping for more intelligent company.',
        'Stanley grumbles, but stays close by.',
        'Stanley raises one bushy eyebrow at you.',
      ],
      3: [
        'Stanley no longer walks away when you approach. Progress.',
        'Stanley gives a short, approving "hmph".',
      ],
      6: [
        'Stanley sits next to you and watches the street. You feel like you are being trusted with something.',
      ],
      9: ['Stanley rests his chin on your knee. He has decided you are one of the smart ones.'],
    },
    night: ['Stanley is staying up late, supervising the possums. They are not doing it right.'],
    rain: ['Stanley stands under the verandah, looking at the rain as if it has personally disappointed him.'],
    asleep: ['Stanley is asleep. Even his snoring sounds disapproving.'],
    evolvedBio: 'Stanley has joined the legion. Centurionely marches in sandals, guards the house and expects a triumph for every walk.',
  },
  girlie: {
    bio: 'Dell\'s black lab. Soft ears, a tail like a rudder, and a firm belief that every picnic is for her.',
    clue: 'A big black dog has been seen in Carlton Gardens, nose deep in somebody\'s picnic. Her owner, Dell, has pink glasses.',
    funFact: 'Girlie has never once walked past the Hochgurtel fountain without trying to get in.',
    favouriteSpot: 'The fountain in Carlton Gardens. Or anywhere a sandwich has been dropped.',
    lines: {
      0: ['Girlie sniffs your pockets thoroughly. She finds nothing. She checks again, to be sure.', 'Girlie\'s whole back half is wagging.'],
      3: ['Girlie leans her full weight on your legs and gazes up at you. You are her favourite person. For now.'],
      6: ['Girlie brings you a stick. Then a better stick. Then half a tree branch.'],
      9: ['Girlie flops down with her head on your feet and sighs a huge, happy dog sigh.'],
    },
    night: ['Girlie is curled up in a black heap. You can only find her by the snoring.'],
    rain: ['Girlie is delighted by the rain. She has found a puddle. She is in the puddle.'],
    asleep: ['Girlie is asleep, paws paddling. She is swimming in her dreams.'],
    evolvedBio: 'Girlie found the biggest puddle in Carlton Gardens and never really came out. Muddy is half lab, half wetland, and wants a cuddle.',
  },
  rusty: {
    bio: 'A brown whippet. Fastest thing in Reservoir. Shakes like a leaf. Loves a blanket.',
    clue: 'Something brown and very fast is doing laps of the athletics track. Its owner, Nathan, jogs behind it. Slowly.',
    funFact: 'Rusty can reach 60km/h, but prefers to spend most of the day under a blanket.',
    favouriteSpot: 'The warm patch of sun on the lounge room floor. Or under three blankets.',
    lines: {
      0: ['Rusty zooms past. Then back. Then past again. He did not stop to say hello.', 'Rusty is shivering. It is 24 degrees.'],
      3: ['Rusty leans his whole skinny body against your legs. That is a whippet hug.'],
      6: ['Rusty does a lap of the court, then flops down next to you, exhausted and proud.'],
      9: ['Rusty curls up on your feet like a tiny brown deer. You cannot move. You will not move.'],
    },
    night: ['Rusty is tucked under a blanket. Only his nose is showing.'],
    rain: ['Rusty refuses to go out in the rain. He is staring at you like it is your fault.'],
    asleep: ['Rusty is asleep, legs twitching. He is winning a race in his dreams.'],
    evolvedBio: 'Rusty, forged in steel. Steely is faster than a Vline train, sharpens his claws on the fence and squeaks a bit going round corners.',
  },
};

PET_TEXT.ziggy = {
  bio: 'A tiny black and white cat, very fast. He was Mads\'s cat. He grew up with dogs and picked up a bark along the way.',
  clue: 'Something small and black and white darts along the bluestone lane behind the Carlton terraces.',
  funFact: 'Ziggy grew up with dogs. He knows one bark, and he uses it.',
  favouriteSpot: 'The end of the lane, in the sun, where Mads used to call him in.',
  lines: {
    0: ['Ziggy watches you from the end of the lane, tail up. He might let you closer. He might not.'],
    3: ['Ziggy winds round your ankles, then barks. One bark. He looks very pleased with himself.'],
    6: ['Ziggy curls up in your lap. He is tiny, warm and purring like a little engine.'],
    9: ['Ziggy sleeps on your pillow tonight, just like he used to with Mads. You keep very still so you don\'t wake him.'],
  },
  night: ['Ziggy\'s eyes shine in the dark. He has been out patrolling.'],
  rain: ['Ziggy is not going out in that. He is watching the rain from the window sill.'],
  asleep: ['Ziggy is asleep in a sunny patch, paws tucked in.'],
};
PET_TEXT.emilio = {
  bio: 'A big old duck in a little top hat. Nobody knows how old he is, or where the hat came from. He will not say.',
  clue: 'Chris says the old ducks at Edwardes Lake know a secret. Something about bread.',
  funFact: 'Emilio has lived at Edwardes Lake longer than the steam engine has been in Lake Park.',
  favouriteSpot: 'The paddling pool, if you have one. Otherwise, the bath. Otherwise, a puddle.',
  lines: {
    0: ['Emilio looks at you over the brim of his hat. "Quack," he says, gravely.'],
    3: ['Emilio waddles a slow lap of you, then tips his hat. You have been approved.'],
    6: ['Emilio settles down next to you and quacks softly, like he is telling you a long story about the lake.'],
    9: ['Emilio lets you hold his top hat. Just for a moment. It is the greatest honour a duck can give.'],
  },
  night: ['Emilio is asleep with his head tucked under his wing. The hat stays on.'],
  rain: ['Emilio is delighted. Finally, proper weather.'],
  asleep: ['Emilio is asleep standing on one leg. His hat has slipped over one eye.'],
};

export const FOE_TEXT = {
  lifeline: { appear: 'A long, curling Life Line peels off Mr Sharma\'s palm!', leave: 'curls back into his hand. A long life, but a short battle.' },
  heartline: { appear: 'A Heart Line flutters up, all swoops and sighs!', leave: 'goes back to the palm to think about someone special.' },
  crystalball: { appear: 'A crystal ball rolls out from under the table, glowing!', leave: 'clouds over. Reply hazy. Try again later.' },
  jack_: { appear: 'The jack, the little white bowl, rolls across the green on its own!', leave: 'rolls into the ditch. Dead jack.' },
  ghostdog: { appear: 'A see-through dog bounds through the ticket barrier!', leave: 'fades into the night with a ghostly wag.' },
  ghostcat: { appear: 'A ghost cat drops down from the skyrail, glowing faintly!', leave: 'walks through a wall, very smug.' },
  staffer: { appear: 'A media staffer bursts out of a side door, phone in each hand!', leave: 'gets a call from the Premier\'s office and sprints off.' },
  juniormp: { appear: 'A junior MP shuffles out, clutching a list of approved answers!', leave: 'is sent to the backbench to think about what it did.' },
  robocarroll: { appear: 'The Premier himself steps up. His eyes flash a little bit blue.', leave: 'powers down mid-sentence. It was still on message.' },
  bag: {
    appear: 'A plastic bag blows in on the wind!',
    leave: 'blows away over the rooftops.',
  },
  streetcat: {
    appear: 'A street cat drops off a fence!',
    leave: 'has had enough and slinks off over a fence.',
  },
  dog: {
    appear: 'A dog with something to prove trots up!',
    leave: 'hears its name called and trots home.',
  },
  rat: {
    appear: 'A big rat. No, bigger than that. It squeaks at you!',
    leave: 'scurries back into a drain.',
  },
  boy: {
    appear: 'A small tubby boy wants to pat your pet. Very hard.',
    leave: 'is called inside for his tea.',
  },
  balls: {
    appear: 'A pile of tennis balls rolls out of the grass. How?',
    leave: 'rolls away in every direction.',
  },
  commuter: {
    appear: 'An angry commuter has missed the 8:14. It is your fault now.',
    leave: 'storms off to catch the next train.',
  },
  ibis: {
    appear: 'A bin chicken stalks out of a laneway. It smells like a Saturday night.',
    leave: 'flaps off to find a better bin.',
  },
  scooter: {
    appear: 'An abandoned e-scooter beeps to life!',
    leave: 'runs out of battery.',
  },
  duck: {
    appear: 'A rogue duck waddles up. It wants your bread. You have no bread.',
    leave: 'waddles off, still furious about the bread.',
  },
  magpie: {
    appear: 'A magpie has remembered your face!',
    leave: 'flies off to swoop someone else.',
  },
  dlcard: {
    appear: 'A "Sorry I missed you" card flutters out from under the door!',
    leave: 'goes in the recycling. Where it was always going to end up.',
  },
  recycling: {
    appear: 'The recycling bin rolls forward. Yellow lid. No soft plastics.',
    leave: 'rolls back up the driveway.',
  },
  garbage: {
    appear: 'The garbage bin rumbles out. It has not been emptied since Tuesday.',
    leave: 'rolls back up the driveway, leaking slightly.',
  },
  compost: {
    appear: 'The little compost bin waddles out, gently steaming.',
    leave: 'settles down and quietly composts.',
  },
  alleycat: {
    appear: 'An alley cat drops off a roller door!',
    leave: 'slinks back into the laneway.',
  },
  nonna: {
    appear: 'A nonna appears over the fence. "You look too skinny!"',
    leave: 'goes back inside to check on the sugo.',
  },
  cavoodle: {
    appear: 'A designer cavoodle in a tiny raincoat prances up!',
    leave: 'is carried home in a tote bag.',
  },
  ristretto: {
    appear: 'A ristretto. Single origin. Ethically sourced. Angry.',
    leave: 'goes cold.',
  },
  sourdough: {
    appear: 'The sourdough mother bubbles ominously. She is eleven years old.',
    leave: 'sinks back down in its jar.',
  },
  recordplayer: {
    appear: 'The record player starts spinning. It only plays first pressings.',
    leave: 'skips, and stops.',
  },
  flatwhitefoe: {
    appear: 'A flat white slides off a cafe table. Oat, extra hot, and furious.',
    leave: 'goes lukewarm and gives up.',
  },
  goonbag: {
    appear: 'A goon bag rolls out of a share house bin! It is half full. Of confidence.',
    leave: 'deflates with a sad little wheeze.',
  },
  sprinkler: {
    appear: 'Tick tick tick. A sprinkler swings round to face you. Water restrictions mean nothing to it.',
    leave: 'runs out of water pressure.',
  },
  possum: {
    appear: 'A possum drops out of a tree! It has been in your roof. You knew it.',
    leave: 'scrambles up a gum tree and glares.',
  },
  bulldog: {
    appear: 'The bulldog from next door has escaped again! It wants to play.',
    leave: 'waddles back next door for a nap.',
  },
  golfball: {
    appear: 'A golf ball, signed by the man himself.',
    leave: 'rolls into the water hazard.',
  },
  fiveiron: {
    appear: 'The five iron. Lucky. Bent. Never cleaned.',
    leave: 'is put back in the bag.',
  },
  buggy: {
    appear: 'The golf buggy he drives to the shops. Registered? Hard to say.',
    leave: 'runs out of charge on the nature strip.',
  },
  // Carlton and the city
  pigeon: {
    appear: 'A city pigeon struts out of the grass. One foot. Total confidence.',
    leave: 'waddles off to sit on a statue.',
  },
  tourist: {
    appear: 'A lost tourist backs into you, map first. "Excuse me, which way is the famous laneway?"',
    leave: 'heads off towards a laneway. Not the famous one.',
  },
  ticketgate: {
    appear: 'The ticket gates at Flinders St snap shut. They only open for people who do not need them to.',
    leave: 'flashes green and gives up.',
  },
  finenotice: {
    appear: 'A fine notice flutters out of the inspector\'s book. $278. Payable within 28 days.',
    leave: 'is waived on appeal.',
  },
  meatball: {
    appear: 'A meatball rolls off a plate on Lygon St, steaming and angry.',
    leave: 'rolls under a table and stays there.',
  },
  garlicbread: {
    appear: 'Free garlic bread! It is free. It is also fighting you.',
    leave: 'goes cold and floppy.',
  },
  spraycan: {
    appear: 'Clack clack clack. A spray can rattles to life.',
    leave: 'runs out of paint with a sad hiss.',
  },
  weed: {
    leave: 'wears off. He sits on the kerb, wrung out.',
  },
  ice: {
    leave: 'wears off. He crashes hard, exhausted and shaking.',
  },
  ...SH_FOE_TEXT,
};

export let PLACES = {
  home: 'A brick veneer on Allen St. Mid-renovation.',
  yard: 'A big backyard with a Hills Hoist, a shed and a carport.',
  allen: 'A quiet court of brick veneers and front lawns.',
  petshop: 'Treats, leads, collars and a goldfish tank.',
  woods: 'A long suburban street of brick houses and agapanthus.',
  lohse: 'Gum trees, a playground and a very clean toilet block.',
  civic: 'Hobsons Bay City Council: a domed chamber, a field gun and a rainbow path.',
  civiccentre: 'The council foyer. Terrazzo, couches and a noticeboard full of motions.',
  chamber: 'Where council meets on Tuesday nights. Bring a snack. It runs long.',
  station: 'Werribee line. Trains roughly as advertised.',
  brunswick: 'Upfield line. Mind the gap, and the cyclists.',
  sydney: 'Trams, bakeries and shopfronts all the way along.',
  albion: 'The Edinburgh Castle, the 19 tram and a lot of For Lease signs.',
  bottleshop: 'Fridges of cold cans and a wall of beer coasters.',
  donald: 'Bluestone lanes, blue-grey flats and a weedy vacant lot.',
  hope: 'Apartments, warehouses and a lot of balcony plants.',
  reservoir: 'Mernda line, up on the skyrail.',
  loddon: 'Brick units just off six lanes of Plenty Rd.',
  glasgow: 'Weatherboards, lemon trees and a yarn-bombed roundabout.',
  track: 'Edwardes Lake Park. An athletics track and the Little Athletics clubhouse.',
  lake: 'A lake full of opinions (ducks).',
  lakepark: 'A steam engine, a pink slide and a playground by Griffiths St.',
  altona: 'Factories, trucks and Kororoit Creek. The long walk east begins.',
  footscray: 'Pho, the river and a lot of pigeons.',
  flemington: 'Racecourse Rd, the flats and the tram.',
  coburg: 'Bell St: six lanes, the old Pentridge wall and the Town Hall.',
  preston: 'Plenty Rd, Preston: a sage green pub, a convenience store and the 86 tram.',
  bunnings: 'Bunnings Warehouse. Aisles of everything, and a garden centre out the back.',
  cozzo: 'The Franco Cozzo showroom. Megalo couches as far as the eye can see.',
  anaconda: 'Anaconda: tents, kayaks and a whole wall of fishing rods.',
  bookshop: 'Brunswick Bound. Classics up the back, new releases on the tables.',
  vapeshop: 'Plenty Road Convenience. American lollies, cold drinks and a sign that says VAPES.',
  lygon: 'Melbourne\'s little Italy. Trattorias, gelato and a spruiker every ten metres.',
  gelateria: 'Twenty flavours in a glass case, and one for dogs.',
  gardens: 'The Exhibition Building, a fountain and possums in every tree.',
  nicholson: 'Terraces back to back, the 96 tram and the corner where Seb grew up.',
  swanston: 'The State Library, really big, and a lawn full of people eating lunch.',
  reading: 'A domed hall of desks and green lamps. Shhh.',
  bourke: 'Parliament, the Princess Theatre and a pub on the corner for after.',
  laneways: 'Painted walls, tiny cafes and a lot of people photographing both.',
  flinders: 'Meet you under the clocks. Bring a donut.',
  wetlands: 'Reeds, frogs and paths that all look the same.',
  ...SH_PLACES,
};

// Brunswick East keeps its words in east.js.
Object.assign(PEOPLE, EAST_PEOPLE);
Object.assign(FOE_TEXT, EAST_FOE_TEXT);
Object.assign(PLACES, EAST_PLACES);
// Coburg and Preston keep their words in north.js.
Object.assign(PEOPLE, NORTH_PEOPLE);
Object.assign(FOE_TEXT, NORTH_FOE_TEXT);
Object.assign(PLACES, NORTH_PLACES);
PEOPLE = authoredValue('data/dialogue.js', 'PEOPLE', PEOPLE);
PET_TEXT = authoredValue('data/dialogue.js', 'PET_TEXT', PET_TEXT);
PLACES = authoredValue('data/dialogue.js', 'PLACES', PLACES);
