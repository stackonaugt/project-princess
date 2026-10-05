// Things you battle. Wild ones jump out of tall grass; trainers are
// townsfolk you challenge by talking to them.
//
//  ENEMIES   id -> { name, type, stats, moves, held?, drop?, appear }
//            stats use the same scale as pets (roughly 30 to 100)
//            held   a snack it carries; moves with usesHeld need it, and
//                   Poppy's Chew can wreck it
//            drop   [item id, chance] you might find after winning
//            appear the line when it shows up; leave = when it gives up
//            tall   drawn as a person (16x32) rather than an animal
//            art    built-in art in src/art/paint/enemies.js (texture foe-<id>)
//  ENCOUNTERS suburb -> list of { id, lv: [min, max], weight, night?, day?, zones? }
//            zones limits an entry to those zone ids (ducks only at the lake)
//  TRAINERS  npc id -> { team: [[enemy id or 'pet:<id>', level], ...], prize?, lines... }

export const ENEMIES = {
  bag: {
    leave: 'blows away over the rooftops.',
    name: 'Plastic Bag', type: 'plastic', stats: { hp: 38, attack: 45, defence: 35, speed: 90, special: 50 },
    moves: ['flutter', 'suffocate', 'blowaway'], appear: 'A plastic bag blows in on the wind!', float: true, faces: 'front',
  },
  streetcat: {
    leave: 'has had enough and slinks off over a fence.',
    name: 'Street Cat', type: 'street', stats: { hp: 45, attack: 60, defence: 40, speed: 80, special: 45 },
    moves: ['hiss', 'pounce', 'scratch'], appear: 'A street cat drops off a fence!', drop: ['sardine', 0.3],
  },
  dog: {
    leave: 'hears its name called and trots home.',
    name: 'Rival Dog', type: 'leather', stats: { hp: 55, attack: 60, defence: 55, speed: 60, special: 35 },
    moves: ['growlwild', 'tug', 'bite'], appear: 'A dog with something to prove trots up!', drop: ['tennis', 0.3],
  },
  rat: {
    leave: 'scurries back into a drain.',
    name: 'Big Rat', type: 'smelly', stats: { hp: 45, attack: 55, defence: 45, speed: 70, special: 50 },
    moves: ['gnaw', 'plague', 'hide'], appear: 'A big rat. No, bigger than that. It squeaks at you!', drop: ['cheese', 0.3],
  },
  boy: {
    leave: 'is called inside for his tea.',
    name: 'Small Tubby Boy', tall: true, faces: 'left', type: 'street', stats: { hp: 55, attack: 50, defence: 50, speed: 40, special: 40 },
    moves: ['tantrum', 'pokestick', 'sausageroll'], held: 'sausage roll', appear: 'A small tubby boy wants to pat your pet. Very hard.', drop: ['snag', 0.4],
  },
  balls: {
    faces: 'front',
    leave: 'rolls away in every direction.',
    name: 'Pile of Tennis Balls', type: 'plastic', stats: { hp: 50, attack: 55, defence: 60, speed: 30, special: 40 },
    moves: ['bounceball', 'avalanche'], appear: 'A pile of tennis balls rolls out of the grass. How?', drop: ['tennis', 0.7],
  },
  commuter: {
    leave: 'storms off to catch the next train.',
    name: 'Angry Commuter', tall: true, faces: 'left', type: 'old', stats: { hp: 55, attack: 55, defence: 50, speed: 45, special: 60 },
    moves: ['sigh', 'briefcase', 'complain', 'flatwhite'], held: 'flat white', appear: 'An angry commuter has missed the 8:14. It is your fault now.', drop: ['croissant', 0.35],
  },
  ibis: {
    leave: 'flaps off to find a better bin.',
    name: 'Bin Chicken', type: 'smelly', stats: { hp: 50, attack: 60, defence: 45, speed: 60, special: 50 },
    moves: ['binlid', 'plague', 'jab'], appear: 'A bin chicken stalks out of a laneway. It smells like a Saturday night.', drop: ['chicken', 0.3],
  },
  scooter: {
    leave: 'runs out of battery.',
    name: 'E-scooter', type: 'steel', stats: { hp: 50, attack: 65, defence: 60, speed: 85, special: 30 },
    moves: ['scoot2', 'beep', 'rolldown'], appear: 'An abandoned e-scooter beeps to life!',
  },
  duck: {
    leave: 'waddles off, still furious about the bread.',
    name: 'Rogue Duck', type: 'water', stats: { hp: 45, attack: 60, defence: 45, speed: 65, special: 55 },
    moves: ['quack', 'jab', 'splash'], appear: 'A rogue duck waddles up. It wants your bread. You have no bread.', drop: ['croissant', 0.3],
  },
  magpie: {
    leave: 'flies off to swoop someone else.',
    name: 'Swooping Magpie', type: ['park', 'old'], stats: { hp: 45, attack: 70, defence: 40, speed: 85, special: 50 },
    moves: ['swoop', 'jab', 'warble'], appear: 'A magpie has remembered your face!', drop: ['feather', 0.5],
  },
  recycling: {
    faces: 'front',
    leave: 'rolls back up the driveway.',
    name: 'Recycling Bin', type: 'plastic', stats: { hp: 55, attack: 50, defence: 60, speed: 45, special: 55 },
    moves: ['lidslam', 'wrongbin', 'recycle', 'rolldown'], appear: 'The recycling bin rolls forward. Yellow lid. No soft plastics.',
  },
  garbage: {
    faces: 'front',
    leave: 'rolls back up the driveway, leaking slightly.',
    name: 'Garbage Bin', type: 'smelly', stats: { hp: 60, attack: 60, defence: 55, speed: 35, special: 50 },
    moves: ['stench', 'flies', 'rolldown', 'lidslam'], appear: 'The garbage bin rumbles out. It has not been emptied since Tuesday.',
  },
  compost: {
    faces: 'front',
    leave: 'settles down and quietly composts.',
    name: 'Compost Bin', type: 'fire', stats: { hp: 50, attack: 50, defence: 50, speed: 50, special: 65 },
    moves: ['compost', 'rot', 'flies'], appear: 'The little compost bin waddles out, gently steaming.',
  },
  // ---- Brunswick
  alleycat: {
    leave: 'slinks back into the laneway.',
    name: 'Alley Cat', type: 'street', stats: { hp: 48, attack: 66, defence: 42, speed: 84, special: 45 },
    moves: ['hiss', 'pounce', 'scratch'], appear: 'An alley cat drops off a roller door!', drop: ['sardine', 0.3],
  },
  nonna: {
    leave: 'goes back inside to check on the sugo.',
    name: 'Nonna', tall: true, faces: 'left', type: 'old', stats: { hp: 62, attack: 58, defence: 60, speed: 40, special: 66 },
    moves: ['woodenspoon', 'mangia', 'lemonthrow', 'guilttrip'], appear: 'A nonna appears over the fence. "You look too skinny!"', drop: ['lemon', 0.6],
  },
  cavoodle: {
    leave: 'is carried home in a tote bag.',
    name: 'Designer Dog', type: 'fairy', stats: { hp: 46, attack: 50, defence: 50, speed: 75, special: 62 },
    moves: ['yapyap', 'fluffup', 'pose', 'tug'], appear: 'A designer cavoodle in a tiny raincoat prances up!', drop: ['ribbon', 0.25],
  },
  ristretto: {
    faces: 'front', leave: 'goes cold.',
    name: 'Ristretto', type: 'caffeine', stats: { hp: 45, attack: 66, defence: 45, speed: 85, special: 55 },
    moves: ['shot', 'jitters', 'latteart'], appear: 'A ristretto. Single origin. Ethically sourced. Angry.',
  },
  sourdough: {
    faces: 'front', leave: 'sinks back down in its jar.',
    name: 'Sourdough Mother', type: 'smelly', stats: { hp: 62, attack: 55, defence: 60, speed: 35, special: 50 },
    moves: ['starter', 'prove', 'crust'], appear: 'The sourdough mother bubbles ominously. She is eleven years old.',
  },
  recordplayer: {
    faces: 'front', leave: 'skips, and stops.',
    name: 'Record Player', type: 'old', stats: { hp: 55, attack: 50, defence: 55, speed: 50, special: 68 },
    moves: ['bside', 'scratchvinyl', 'actually'], appear: 'The record player starts spinning. It only plays first pressings.',
  },
  flatwhitefoe: {
    faces: 'front', leave: 'goes lukewarm and gives up.',
    name: 'Flat White', type: 'caffeine', stats: { hp: 50, attack: 58, defence: 48, speed: 80, special: 55 },
    moves: ['doubleshot', 'milkfroth', 'extrashot'], appear: 'A flat white slides off a cafe table. Oat, extra hot, and furious.',
  },
  goonbag: {
    faces: 'front', leave: 'deflates with a sad little wheeze.',
    name: 'Goon Bag', type: 'booze', stats: { hp: 60, attack: 52, defence: 55, speed: 40, special: 50 },
    moves: ['hiccup', 'slosh', 'silverpillow', 'beergoggles'], appear: 'A goon bag rolls out of a share house bin! It is half full. Of confidence.',
  },
  // ---- Reservoir
  sprinkler: {
    faces: 'front', leave: 'runs out of water pressure.',
    name: 'Rogue Sprinkler', type: 'water', stats: { hp: 52, attack: 55, defence: 55, speed: 55, special: 60 },
    moves: ['splash', 'hosedown', 'puddle', 'sprinkle'], appear: 'Tick tick tick. A sprinkler swings round to face you. Water restrictions mean nothing to it.',
  },
  possum: {
    leave: 'scrambles up a gum tree and glares.',
    name: 'Brushtail Possum', type: 'park', stats: { hp: 55, attack: 62, defence: 48, speed: 72, special: 45 },
    moves: ['scurry', 'gumnut', 'hissp', 'rosebush'], appear: 'A possum drops out of a tree! It has been in your roof. You knew it.', drop: ['tomato', 0.3],
  },
  bulldog: {
    leave: 'waddles back next door for a nap.',
    name: 'Bulldog Next Door', type: 'rock', stats: { hp: 70, attack: 62, defence: 68, speed: 30, special: 30 },
    moves: ['headbutt', 'slobber', 'snore'], appear: 'The bulldog from next door has escaped again! It wants to play.', drop: ['snag', 0.35],
  },
  golfball: {
    faces: 'front', leave: 'rolls into the water hazard.',
    name: 'Golf Ball', type: 'plastic', stats: { hp: 45, attack: 60, defence: 55, speed: 80, special: 40 },
    moves: ['fore', 'slice', 'bunker'], appear: 'A golf ball, signed by the man himself.',
  },
  fiveiron: {
    faces: 'front', leave: 'is put back in the bag.',
    name: 'Five Iron', type: 'steel', stats: { hp: 52, attack: 70, defence: 55, speed: 55, special: 40 },
    moves: ['swing', 'chip', 'practice'], appear: 'The five iron. Lucky. Bent. Never cleaned.',
  },
  buggy: {
    faces: 'front', leave: 'runs out of charge on the nature strip.',
    name: 'Golf Buggy', type: 'steel', stats: { hp: 66, attack: 62, defence: 66, speed: 35, special: 40 },
    moves: ['runover', 'beep', 'nineteenth'], appear: 'The golf buggy he drives to the shops. Registered? Hard to say.',
  },
  weed: {
    faces: 'front', leave: 'wears off. He sits on the kerb, wrung out.',
    name: 'Weed', type: 'smelly', stats: { hp: 50, attack: 45, defence: 50, speed: 40, special: 55 },
    moves: ['haze', 'paranoia'], appear: '',
  },
  ice: {
    faces: 'front', leave: 'wears off. He crashes hard, exhausted and shaking.',
    name: 'Ice', type: 'street', stats: { hp: 55, attack: 65, defence: 40, speed: 90, special: 40 },
    moves: ['binge', 'comedown'], appear: '',
  },
  fentanyl: {
    faces: 'front', ends: true,
    name: 'Fentanyl', type: 'old', stats: { hp: 1, attack: 1, defence: 1, speed: 1, special: 1 },
    moves: ['sigh'], appear: '',
    endLines: [
      'He pulls out fentanyl and takes it.',
      'Within seconds he slumps over. His lips are going blue. He is barely breathing.',
      'This is not a play-fight any more. You call 000 straight away.',
      'The paramedics arrive fast and give him naloxone. He gasps and comes around.',
      'He is going to hospital. He is alive.',
    ],
  },
};

// Who you can meet in each suburb's tall grass. Weights are relative.
export const ENCOUNTERS = {
  laverton: [
    { id: 'bag', lv: [2, 4], weight: 3 },
    { id: 'streetcat', lv: [2, 4], weight: 3 },
    { id: 'dog', lv: [3, 5], weight: 2 },
    { id: 'rat', lv: [3, 5], weight: 2, night: 3 },
    { id: 'boy', lv: [2, 4], weight: 2, day: true },
    { id: 'balls', lv: [3, 5], weight: 1 },
    { id: 'commuter', lv: [4, 5], weight: 2, day: true },
  ],
  brunswick: [
    { id: 'ibis', lv: [5, 8], weight: 3 },
    { id: 'scooter', lv: [5, 8], weight: 3 },
    { id: 'rat', lv: [5, 8], weight: 2, night: 3 },
    { id: 'streetcat', lv: [5, 7], weight: 2 },
    { id: 'bag', lv: [5, 7], weight: 1 },
    { id: 'commuter', lv: [6, 8], weight: 1, day: true },
    { id: 'alleycat', lv: [5, 8], weight: 3 },
    { id: 'nonna', lv: [6, 9], weight: 2, day: true },
    { id: 'cavoodle', lv: [5, 8], weight: 2, day: true },
    { id: 'flatwhitefoe', lv: [5, 8], weight: 2, day: true },
    { id: 'goonbag', lv: [6, 9], weight: 2, night: 3 },
  ],
  reservoir: [
    { id: 'duck', lv: [7, 10], weight: 6, zones: ['track', 'lake', 'lakepark', 'wetlands'] },
    { id: 'bulldog', lv: [8, 11], weight: 10, zones: ['loddon'] },
    { id: 'magpie', lv: [8, 11], weight: 3, day: true },
    { id: 'dog', lv: [7, 10], weight: 2 },
    { id: 'balls', lv: [7, 10], weight: 1 },
    { id: 'boy', lv: [7, 9], weight: 1, day: true },
    { id: 'bag', lv: [7, 9], weight: 1 },
    { id: 'sprinkler', lv: [7, 10], weight: 2, day: true, zones: ['loddon', 'glasgow', 'lakepark', 'wetlands'] },
    { id: 'possum', lv: [8, 11], weight: 2, night: 4 },
  ],
  // The long walks between suburbs
  altona: [{ id: 'sprinkler', lv: [3, 5], weight: 1, day: true }, { id: 'bag', lv: [3, 5], weight: 3 }, { id: 'rat', lv: [3, 6], weight: 2 }, { id: 'dog', lv: [4, 6], weight: 2 }, { id: 'commuter', lv: [4, 6], weight: 1, day: true }],
  footscray: [{ id: 'goonbag', lv: [4, 6], weight: 1, night: 2 }, { id: 'rat', lv: [4, 6], weight: 2 }, { id: 'ibis', lv: [4, 7], weight: 3 }, { id: 'streetcat', lv: [4, 6], weight: 2 }, { id: 'boy', lv: [4, 6], weight: 1, day: true }],
  flemington: [{ id: 'ibis', lv: [5, 7], weight: 2 }, { id: 'scooter', lv: [5, 7], weight: 2 }, { id: 'magpie', lv: [5, 7], weight: 2, day: true }, { id: 'bag', lv: [5, 7], weight: 1 }],
  coburg: [{ id: 'flatwhitefoe', lv: [6, 9], weight: 1, day: true }, { id: 'scooter', lv: [6, 9], weight: 2 }, { id: 'nonna', lv: [7, 9], weight: 2, day: true }, { id: 'alleycat', lv: [6, 9], weight: 2 }, { id: 'rat', lv: [6, 9], weight: 1 }],
  preston: [{ id: 'possum', lv: [7, 10], weight: 2, night: 3 }, { id: 'nonna', lv: [7, 10], weight: 2, day: true }, { id: 'magpie', lv: [7, 10], weight: 2, day: true }, { id: 'dog', lv: [7, 10], weight: 2 }, { id: 'cavoodle', lv: [7, 9], weight: 1 }],
};

// Trainers: talk to them to battle. `prize` is the pet you win (pets with
// an owner are won by beating the owner; Princess is free).
export const TRAINERS = {
  binman: {
    name: 'Bin Man', team: [['recycling', 3], ['garbage', 4], ['compost', 4]],
    challenge: ['Oi. You look like someone who puts soft plastics in the recycling.', 'Only one way to settle this. A bin-off.'],
    ask: 'Battle the Bin Man?', yes: 'Bring out the bins', no: 'Not today',
    win: ['Well I never. Beaten by a pet. My bins have never been so humbled.', 'Here. Found these in the hard rubbish. Still sealed. Mostly.'],
    lose: ['Ha! Wrong bin, wrong battle. Come back when you know your lids.'],
    again: ['Back for another bin-off? The bins have been training. Mostly by sitting there.'],
    reward: { snag: 2, chicken: 1 },
  },
  rose: {
    name: 'Rose', prize: 'salami', team: [['alleycat', 6], ['pet:salami', 8]],
    challenge: ['Oh, you want to be friends with Salami? Ha. Salami decides who her friends are.', 'Show her you can handle her. Have a little play-fight.'],
    ask: 'Play-fight Salami?', yes: 'Let\'s go', no: 'Maybe later',
    win: ['Wow. She actually likes you. That never happens.', 'Salami will come and visit your place on Allen St. Feed her well. She keeps score.'],
    lose: ['Ha! Told you. She has a vicious strike. Come back when your pets have had their Weet-Bix.'],
  },
  slinks: {
    name: 'Slinks', prize: 'spooky', team: [['streetcat', 6], ['pet:spooky', 8]],
    challenge: ['Spooky? You can see her? Most people cannot.', 'If you can catch her in a play-fight, she might just haunt your place instead.'],
    ask: 'Play-fight Spooky?', yes: 'Let\'s go', no: 'Not yet',
    win: ['She stayed solid the whole time. That means she respects you.', 'Spooky will start appearing at your place. And disappearing. Mostly appearing.'],
    lose: ['She phased out. You were punching air. Come back after dark, maybe. Or with snacks.'],
  },
  sinead: {
    name: 'Sinead', prize: 'poppy', team: [['pet:poppy', 11]],
    challenge: ['Hi! Poppy loves a play-fight. Like, LOVES one. Are you sure?', 'She is basically a bowling ball with ears. Brace yourself.'],
    ask: 'Play-fight Poppy?', yes: 'Bring it on', no: 'Let me stretch first',
    win: ['She is so happy. She has never had this much fun losing. She has never won, to be fair.', 'Poppy can come stay at your place. She will eat anything. Hide the good snacks.'],
    lose: ['Ooh, sorry! She does not know her own strength. She does not know much, honestly. We love her.'],
  },
  tim: {
    name: 'Tim', prize: 'stanley', team: [['magpie', 12], ['pet:stanley', 14]],
    challenge: ['You want to befriend Stanley? He only likes smart animals. Let\'s see if your team qualifies.'],
    ask: 'Play-fight Stanley?', yes: 'We are smart', no: 'Need to study first',
    win: ['He is not even sulking. That is basically a standing ovation.', 'Stanley will visit your place on Allen St. He will judge your furniture. Do not take it personally.'],
    lose: ['Stanley stared at your team until they went home. Classic Stanley. Try again when you are wiser.'],
  },
  hipster: {
    name: 'Hipster', team: [['ristretto', 9], ['sourdough', 9], ['recordplayer', 10]],
    challenge: ['Oh. You battle? That is so mainstream.', 'My team is quite underground. You probably have not heard of them.'],
    ask: 'Battle the Hipster?', yes: 'Bring your vinyl', no: 'Too cool for me',
    win: ['I was going to lose anyway. Ironically.', 'Here. Take this. It was free with my oat flat white.'],
    lose: ['I liked battling before it was cool.'],
    again: ['Back again? I only battle people who were into it early.'],
    reward: { croissant: 1 }, money: 40,
  },
  golfer: {
    name: 'Golfer Next Door', team: [['golfball', 11], ['fiveiron', 12], ['buggy', 12]],
    challenge: ['G\'day neighbour! Lost me teeth on the fourteenth hole in 2009. Never found \'em.', 'Fancy a round? Loser buys the pies.'],
    ask: 'Play a round?', yes: 'Tee off', no: 'Rain check',
    win: ['Ha! Good on ya. Best game I\'ve had since the teeth.', 'Here, a little something from the pro shop.'],
    lose: ['Hole in one! Well, close enough. Better luck next time, neighbour.'],
    again: ['Back for another round? The buggy\'s charged. Mostly.'],
    reward: { snag: 1 }, money: 50,
  },
  stranger: {
    name: 'Stranger', once: true, noXp: true, intro: 'He squares up, swaying on his feet.', team: [['weed', 8], ['ice', 9], ['fentanyl', 9]], sendOut: 'He pulls out {f}.',
    challenge: ['He is pacing and talking fast. "You. Yeah, you. You wanna go?"', 'He is not well. He wants to fight anyway.'],
    ask: 'Battle him?', yes: 'Okay', no: 'Walk on',
    win: ['Fentanyl is so strong that a speck can stop someone breathing.', 'If you or someone you love uses drugs, DirectLine is free and confidential, any time: 1800 888 236.'],
    lose: ['He wanders off down the bike path, still talking to himself. You hope he is okay.'],
  },
};

// Who owns which pet you have to win (Princess has no trainer: she is free).
export const PRIZE_TRAINER = Object.fromEntries(Object.entries(TRAINERS).filter(([, t]) => t.prize).map(([id, t]) => [t.prize, id]));
