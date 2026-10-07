// Council motions: the game's version of the Stardew community centre.
// Each motion is pinned on the noticeboard in the Hobsons Bay civic centre
// foyer. Chip in what it needs (items from your bag, or money) and it goes to
// the next council meeting (Tuesday 6:30pm), at most MAX_PER_MEETING a
// night. It passes with 4 of 7 votes.
//
// Every motion splits the council its own way (`votes`): some vote yes, some
// no, and the undecided can be won over (`swing`), each in their own way:
//   { hearts: n }   be friends enough (doubled while Paddy is not mayor)
//   { gift: id }    give them that present (lemonade, a bike, the right book)
//   { party: true } throw the street party at the community garden
// Paddy drops a tip about it at home in the evening (`tip`). Won-over
// councillors are kept in state.data.council.won[motion].
//
// A motion that passes changes the world (`effect`, handled in state.passMotion
// and the maps that check state.motionPassed(id)).
//
//   needs    { itemId: count, money: dollars }
//   sponsor  the councillor who moved it (for the debate)
//   debate   lines said in the chamber when it comes up
//   effect   a short line telling you what changed
//   votes    { yes: [...], no: [...], swing: { who: { how..., hint, won } } }
//   tip      what Paddy says about it at night

// Who has to be won over to back Paddy as mayor (hearts), and the old blocs.
export const SWING = { kirsty: 4, dahlia: 2 };
export const MAX_PER_MEETING = 2;
export const COUNCIL_ALL = ['paddy', 'rayna', 'deanna', 'lesley', 'malcolm', 'kirsty', 'dahlia'];
const LEMONADE = { gift: 'lemonade', hint: 'wants to taste these lemons before voting', won: '"Oh, that\'s GOOD lemonade. Fine. Plant the tree."' };
export const ALLIES = ['paddy', 'rayna', 'deanna'];
export const AGAINST = ['lesley', 'malcolm'];

// What each councillor says when you ask about the next vote, or ask them to back Paddy.
export const COUNCIL_VIEWS = {
  rayna: { yes: 'Cr Hawley: "Yes! I\'ve already written my speech. It has a slideshow."', no: '', unsure: '', nothing: 'Cr Hawley: "Nothing on the board yet. Go and put something up there!"', backYes: 'Cr Hawley: "Back Paddy? Always. He remembers everyone\'s birthday. Even Lesley\'s."' },
  deanna: { yes: 'Cr Grimes: "Voting yes. It\'s good for the people who actually live here."', no: '', unsure: '', nothing: 'Cr Grimes: "The board\'s empty. That\'s how Lesley likes it."', backYes: 'Cr Grimes: "I\'m with Paddy. Ride or die. Well, ride. Bike lanes."' },
  lesley: { yes: '', no: 'Cr Bentleigh: "NO. Absolutely not. I haven\'t read it, and I\'m voting NO."', unsure: '', nothing: 'Cr Bentleigh: "No motions? GOOD. Council should do LESS."', backNo: 'Cr Bentleigh: "Support PADDY? I\'d rather support a BIN CHICKEN."' },
  malcolm: { yes: '', no: 'Cr Dismay: "I\'ll be voting with Lesley. As is tradition."', unsure: '', nothing: 'Cr Dismay: "Nothing on the agenda. Lovely. Early night."', backNo: 'Cr Dismay: "Lesley says no, so it\'s no. Sorry. I\'m not sorry. Lesley, I said it."' },
  kirsty: { yes: 'Cr Bishopp: "You know what? I\'ll back it. Don\'t tell my donors."', no: '', unsure: 'Cr Bishopp: "Hmm. It sounds expensive. Convince me. Ideally with a present."', nothing: 'Cr Bishopp: "Nothing on the board. Fiscally responsible, I call that."', backYes: 'Cr Bishopp: "Fine. Paddy\'s all right. I\'ll vote with him."', backMaybe: 'Cr Bishopp: "Paddy? I\'m not sure we\'re close enough for that yet."' },
  dahlia: { yes: 'Cr Kellandra: "A yes from me. Obviously."', no: '', unsure: 'Cr Kellandra: "I like it, but I need to know the community is behind it. Are YOU behind it?"', nothing: 'Cr Kellandra: "The board\'s empty. Put something up and I\'ll have a look."', backYes: 'Cr Kellandra: "Of course I\'ll back Paddy. Just keep being nice to me."', backMaybe: 'Cr Kellandra: "I lean his way. Lean. Give me a reason to fall over."' },
};

export const MOTIONS = {
  // The first one is low stakes, so the board makes sense early on.
  lemontree: {
    title: 'Plant a lemon tree outside the civic centre',
    needs: { money: 20, lemon: 1 },
    sponsor: 'rayna',
    debate: ['Cr Hawley: "One lemon tree. Free lemons for anyone walking past. That\'s the whole motion."', 'Cr Dismay: "Who will be liable for the lemons?"'],
    effect: 'A lemon tree grows on the civic centre lawn in Altona. Free lemons for all.',
    votes: { yes: ['paddy', 'rayna'], no: ['lesley'], swing: { malcolm: LEMONADE, kirsty: LEMONADE, deanna: LEMONADE, dahlia: LEMONADE } },
    tip: 'If council tried your delicious lemonade, I bet they\'d all be in favour of Rayna\'s lemon tree. Two lemons and some sugar, love.',
  },
  bikelane: {
    title: 'A protected bike lane from Laverton to Brunswick',
    needs: { money: 150 },
    sponsor: 'deanna',
    debate: ['Cr Grimes: "Safe bike lanes all the way in. Fewer cars, cleaner air, happier calves."', 'Cr Bentleigh: "BIKE LANES! IN THIS ECONOMY?"'],
    effect: 'The long walks between suburbs now take half the time.',
    votes: { yes: ['paddy', 'deanna', 'dahlia'], no: ['lesley', 'kirsty'], swing: {
      malcolm: { gift: 'bike', hint: 'goes quiet whenever anyone mentions bikes', won: '"A bike? For ME? I always wanted one. With a BELL. Yes. Bike lanes. Yes."' },
      rayna: { hearts: 3, hint: 'is worried about parking outside her mum\'s. A friend could talk her round' } } },
    tip: 'Malcolm is only against the bike lanes because he\'s bitter he never got a bike as a kid. Anaconda on Plenty Rd sells a lovely red one.',
  },
  gardenplus: {
    title: 'Expand the Edgars Creek community garden',
    needs: { carrot: 3, tomato: 2, seedling: 2 },
    sponsor: 'dahlia',
    debate: ['Cr Kellandra: "Four more plots. Fresh food, grown by locals, for locals."', 'Cr Dismay: "That land could be a car park."'],
    effect: 'Four more plots at the community garden in Reservoir.',
    votes: { yes: ['paddy', 'dahlia', 'deanna'], no: ['lesley', 'malcolm'], swing: {
      kirsty: { party: true, hint: 'thinks nobody actually eats what the garden grows' },
      rayna: { party: true, hint: 'wants to see the community turn up for it first' } } },
    tip: 'Throw a street party at the community garden. Cook three dishes with veggies you grew yourself, then talk to Chris Bates. Kirsty and Rayna will come round.',
  },
  dogpark: {
    title: 'An off-lead dog park at Lohse St Reserve',
    needs: { tennis: 3, chicken: 2 },
    sponsor: 'rayna',
    debate: ['Cr Hawley: "Dogs need space to run. So do toddlers, frankly."', 'Cr Bentleigh: "DOGS! EVERYWHERE! UNLEASHED!"'],
    effect: 'Pets on your team get a little friendship every day you visit Lohse St Reserve.',
    votes: { yes: ['paddy', 'rayna', 'deanna'], no: ['lesley', 'malcolm'], swing: { kirsty: { hearts: 4, hint: 'is not sure about dogs. A friend might change her mind' }, dahlia: { hearts: 2, hint: 'likes dogs, likes you, mostly' } } },
    tip: 'Kirsty and Dahlia are on the fence about the dog park. A little friendship goes a long way. So do flowers.',
  },
  bookswap: {
    title: 'A street library at Lohse St Reserve',
    needs: { paperback: 3, money: 20 },
    sponsor: 'paddy',
    debate: ['Mayor Paddy: "A little box of free books. Take one, leave one. That is the whole motion."', 'Cr Dismay: "Who will police the books?"'],
    effect: 'A free book appears in the street library at Lohse St Reserve every day.',
    votes: { yes: ['paddy'], no: [], swing: {
      lesley: { gift: 'nineteen84', hint: 'says she has never read a book she agreed with', won: '"Big Brother is watching. I KNEW it. The only true book. Fine. One little library."' },
      malcolm: { gift: 'thedry', hint: 'only reads crime, in his car, at lunch', won: '"A murder in a drought? This is my sort of thing. Street library, carried."' },
      kirsty: { gift: 'prideprejudice', hint: 'likes manners, money and a good marriage plot', won: '"Ten thousand a year and a man who learns his lesson? Yes. I\'ll vote for books."' },
      rayna: { gift: 'fourthwing', hint: 'wants something with dragons in it', won: '"DRAGONS. This is going in my slideshow. Yes to the library!"' },
      deanna: { gift: 'cloudstreet', hint: 'loves a big messy family story', won: '"Two families, one house, a talking pig. That\'s my street. Yes."' },
      dahlia: { gift: 'monkeygrip', hint: 'wants a Melbourne book', won: '"Carlton share houses and heartbreak. That was my twenties. A yes from me."' } } },
    tip: 'Every councillor has a book they\'d vote for anything for. Shannon at Brunswick Bound knows them all. Ask her.',
  },
  trees: {
    title: 'Plant street trees along Allen St',
    needs: { seedling: 4, olive: 1, money: 40 },
    sponsor: 'deanna',
    debate: ['Cr Grimes: "Shade, birds, cooler footpaths. Trees are infrastructure."', 'Cr Bentleigh: "LEAVES! IN MY GUTTERS!"'],
    effect: 'New street trees and native garden beds along Allen St.',
    votes: { yes: ['paddy', 'deanna', 'rayna'], no: ['lesley', 'malcolm'], swing: {
      kirsty: { hearts: 4, hint: 'thinks trees are a cost. A friend could show her they are an asset' },
      dahlia: { gift: 'seedling', hint: 'wants to plant one with her own hands', won: '"A bottlebrush! I\'ll plant it myself. Yes to trees."' } } },
    tip: 'Dahlia would back the street trees if she could plant one herself. A native seedling from Bunnings would do it.',
  },
};
export const MOTION_ORDER = Object.keys(MOTIONS);

// What Shannon at Brunswick Bound says about books for council (the street library).
export const BOOK_RECS = {
  lesley: 'Shannon: "Cr Bentleigh? Nineteen Eighty-Four. She\'ll think it\'s about her. It sort of is."',
  malcolm: 'Shannon: "Cr Dismay reads crime in his car. The Dry, by Jane Harper. Trust me."',
  kirsty: 'Shannon: "Cr Bishopp is a Pride and Prejudice girl. Money, manners, a man who improves."',
  rayna: 'Shannon: "Cr Hawley? Fourth Wing. Dragons. She will make a slideshow about it."',
  deanna: 'Shannon: "Cr Grimes wants Cloudstreet. Big families, one house, a pig that talks."',
  dahlia: 'Shannon: "Cr Kellandra grew up in Carlton. Monkey Grip, Helen Garner. Done."',
};

// Has everything this motion needs been chipped in?
export function motionReady(id, given = {}) {
  return Object.entries(MOTIONS[id].needs).every(([k, n]) => (given[k] || 0) >= n);
}

// Silly little motions council debates at every meeting, on top of yours.
// One or two come up each Tuesday; if one passes it's gone for good
// (state.data.council.silly), if it fails it goes back in the pile.
export const SILLY_MOTIONS = [
  'Rename Kororoit Creek "Kororoit Creek (Pronounced Kororoit Creek)"',
  'Give the Altona pelicans a formal vote at council',
  'Install a second bin next to the first bin, for balance',
  'Declare the third Thursday of every month "Wear Thongs to Work Day"',
  'Paint the Laverton water tower to look like a giant cup of tea',
  'Officially recognise the Westgate Bridge as "a bit much"',
  'Ban leaf blowers before 8am, and after 8:01am',
  'Name a pothole on Aviation Rd after its discoverer',
  'Fund a feasibility study into a feasibility study',
  'Allow dogs to attend council meetings, as long as they don\'t heckle',
  'Change the council logo to a seagull eating a chip',
  'Put a tiny hat on the Williamstown time ball',
  'Hold one council meeting a year entirely in interpretive dance',
  'Rename the Altona foreshore "The Altona Riviera"',
  'Make the sausage sizzle onion placement (on the bottom) a local law',
  'Plant a single sunflower on every roundabout',
  'Install a suggestion box for the suggestion box',
  'Give the civic centre lift a name. Proposed: Lifty McLiftface',
  'Replace the chamber bell with a kookaburra recording',
  'Ask Werribee to please stop being so close',
  'Declare magpie swooping season "a shared community experience"',
  'Fund one (1) public trampoline, for science',
  'Adopt an official council biscuit. Shortlist: Tim Tam, Monte Carlo, Iced VoVo',
  'Investigate why the Laverton station clock is always four minutes fast',
  'Put a bench facing the bin, so the bin has company',
  'Rename Tuesday "Councilday" within the municipality',
  'Install free wifi at the Altona Pier, for the fish',
  'Officially welcome the ibis as "valued neighbours"',
  'Ban the phrase "per my last email" from council correspondence',
  'Hire a council DJ for the Williamstown Farmers Market',
  'Paint the speed humps in rainbow colours, to soften the blow',
  'Commission a statue of the first person to finish a council meeting on time',
  'Rename Civic Parade "Civic Parade (With Floats)"',
  'Hold the budget meeting in the Laverton pool, to keep everyone cool',
  'Fund a study into whether the Seaholme sea is real',
  'Formally apologise to the possum Cr Dismay called "rude"',
  'Install a "Take a Lemon, Leave a Lemon" box at every library',
  'Give every resident one free compliment, delivered by a councillor',
  'Allow karaoke in the council chamber after 9pm on Fridays',
  'Change the hold music on the council phone line to a didgeridoo cover of Khe Sanh',
  'Rename the Altona Coastal Park "Altona Coastal Park, Mate"',
  'Make the last Friday in June "Wear Your Footy Scarf Indoors Day"',
  'Fund a community choir for people who cannot sing',
  'Ban the word "synergy" from council documents',
  'Install a giant chess board on the Altona foreshore',
  'Offer a reward for finding Cr Bentleigh\'s missing stapler',
  'Officially twin Laverton with a village in Wales nobody can pronounce',
  'Put the council minutes on a mug',
  'Introduce a "Neighbour of the Month" award, with a ribbon and a sausage',
  'Investigate the smell near the Brooklyn tip, again',
  'Give the street sweeper a little bell, like an ice cream truck',
  'Rename the stormwater drains "Little Rivers"',
  'Fund one extra hour of daylight in winter',
  'Make it illegal to say "it\'s a dry heat" in Hobsons Bay',
  'Put googly eyes on every council vehicle',
  'Hold a bake-off between councillors, judged by the public gallery',
  'Allow residents to name the council garbage trucks',
  'Install a "you are here" map that also says "and that\'s OK"',
  'Formally request the Bureau of Meteorology be more optimistic',
  'Build a tiny library for the Altona Pier seagulls',
  'Make the council\'s email signature a limerick',
  'Install a slide from the civic centre first floor to the foyer',
  'Rename the recycling bin "the yellow bin of hope"',
  'Declare the fish and chip shop on Pier St a heritage site',
  'Add a dog bowl to every council meeting room',
  'Paint a mural of Paddy on the side of the civic centre. Paddy objects',
  'Fund a study into why Hobsons Bay is called a bay when it is mostly sea',
  'Introduce a council mascot. Proposal: Peter the Pelican',
  'Give out a free sausage with every parking fine',
  'Ban reply-all on council emails',
  'Light up the Westgate in Hobsons Bay colours once a year',
  'Make the Altona beach volleyball net "a public art piece"',
  'Hold the Christmas party in March, when everyone is less busy',
  'Provide snacks at council meetings that are not just Arnott\'s Arrowroot',
  'Rename the roundabout near Bunnings "The Snag Circle"',
  'Introduce a "Quiet Hour" at the tip',
  'Install mood lighting in the council chamber',
  'Fund a council cat to catch the council mice',
  'Paint every bus shelter a different colour, so people stop getting lost',
  'Formally thank the lollipop lady at Laverton Primary for 30 years of waving',
  'Ban Cr Bentleigh\'s air horn from the chamber',
  'Make "Have a good one" the official council greeting',
  'Put a small fountain in the car park. Just a little one',
  'Grow tomatoes on the civic centre roof',
  'Change the council motto to "We\'ll look into it"',
  'Rename the Laverton Creek trail "The Long Way Round"',
  'Officially name the wind in Altona "Gusty"',
  'Install a buzzer that plays applause when you pay your rates on time',
  'Give every new resident a free lemon tree',
  'Hold a sandcastle competition, with council judges in wetsuits',
  'Commission a song about the Kororoit Creek Rd roadworks',
  'Rename the Altona Meadows "The Altona Medium-Sized Meadows"',
  'Allow residents to vote on the colour of the new council carpet',
  'Make the Williamstown ferry free on Sundays, for the vibes',
  'Install a hammock in the council library',
  'Fund a weekly sausage sizzle for the council IT department, who deserve it',
  'Ask Footscray to please return the shopping trolleys',
  'Rename the chamber "The Room Where It Happens"',
  'Give the civic centre pot plants names and little name tags',
  'Hold a minute\'s silence for every parking spot lost to roadworks',
];

// Lines councillors throw in during the silly debates.
export const SILLY_DEBATE = {
  yes: ['"About time someone said it."', '"I support this with my whole chest."', '"The people have spoken. Well, one person, on Facebook."', '"Finally, a motion I understand."', '"I\'ve wanted this since 1994."'],
  no: ['"Absolutely not. Where does it END?"', '"This is a slippery slope, and I am wearing socks."', '"Who is paying for this? It\'s me, isn\'t it."', '"I have concerns. Mostly about the font."', '"Over my dead body. Or at least over my sore back."'],
};

// Which silly motions come up on a given meeting day (indexes into SILLY_MOTIONS),
// skipping the ones that already passed. One or two a meeting.
export function sillyFor(day, passed = []) {
  const left = SILLY_MOTIONS.map((_, i) => i).filter(i => !passed.includes(i));
  if (!left.length) return [];
  const n = 1 + (day % 2), out = [];
  for (let k = 0; out.length < Math.min(n, left.length) && k < 20; k++) {
    const i = left[(day * 37 + k * 53) % left.length];
    if (!out.includes(i)) out.push(i);
  }
  return out;
}
// How a silly motion goes: 3 to 6 yes votes, decided by the day and the motion.
export const sillyYes = (day, i) => 2 + ((day * 13 + i * 7) % 5);
