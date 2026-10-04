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
//  ENCOUNTERS suburb -> list of { id, lv: [min, max], weight, night? }
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
    name: 'Rogue Duck', type: 'fire', stats: { hp: 45, attack: 60, defence: 45, speed: 65, special: 55 },
    moves: ['quack', 'jab', 'flutter'], appear: 'A rogue duck waddles up. It wants your bread. You have no bread.', drop: ['croissant', 0.3],
  },
  magpie: {
    leave: 'flies off to swoop someone else.',
    name: 'Swooping Magpie', type: 'old', stats: { hp: 45, attack: 70, defence: 40, speed: 85, special: 50 },
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
  ],
  reservoir: [
    { id: 'duck', lv: [7, 10], weight: 3 },
    { id: 'magpie', lv: [8, 11], weight: 3, day: true },
    { id: 'dog', lv: [7, 10], weight: 2 },
    { id: 'balls', lv: [7, 10], weight: 1 },
    { id: 'boy', lv: [7, 9], weight: 1, day: true },
    { id: 'bag', lv: [7, 9], weight: 1 },
  ],
};

// Trainers: talk to them to battle. `prize` is the pet you win (pets with
// an owner are won by beating the owner; Princess is free).
export const TRAINERS = {
  binman: {
    name: 'Bin Man', team: [['recycling', 4], ['garbage', 4], ['compost', 5]],
    challenge: ['Oi. You look like someone who puts soft plastics in the recycling.', 'Only one way to settle this. A bin-off.'],
    ask: 'Battle the Bin Man?', yes: 'Bring out the bins', no: 'Not today',
    win: ['Well I never. Beaten by a pet. My bins have never been so humbled.', 'Here. Found these in the hard rubbish. Still sealed. Mostly.'],
    lose: ['Ha! Wrong bin, wrong battle. Come back when you know your lids.'],
    again: ['Back for another bin-off? The bins have been training. Mostly by sitting there.'],
    reward: { snag: 2, chicken: 1 },
  },
  rose: {
    name: 'Rose', prize: 'salami', team: [['pet:salami', 7]],
    challenge: ['Oh, you want to be friends with Salami? Ha. Salami decides who her friends are.', 'Show her you can handle her. Have a little play-fight.'],
    ask: 'Play-fight Salami?', yes: 'Let\'s go', no: 'Maybe later',
    win: ['Wow. She actually likes you. That never happens.', 'Salami will come and visit your place on Allen St. Feed her well. She keeps score.'],
    lose: ['Ha! Told you. She has a vicious strike. Come back when your pets have had their Weet-Bix.'],
  },
  slinks: {
    name: 'Slinks', prize: 'spooky', team: [['pet:spooky', 8]],
    challenge: ['Spooky? You can see her? Most people cannot.', 'If you can catch her in a play-fight, she might just haunt your place instead.'],
    ask: 'Play-fight Spooky?', yes: 'Let\'s go', no: 'Not yet',
    win: ['She stayed solid the whole time. That means she respects you.', 'Spooky will start appearing at your place. And disappearing. Mostly appearing.'],
    lose: ['She phased out. You were punching air. Come back after dark, maybe. Or with snacks.'],
  },
  sinead: {
    name: 'Sinead', prize: 'poppy', team: [['pet:poppy', 10]],
    challenge: ['Hi! Poppy loves a play-fight. Like, LOVES one. Are you sure?', 'She is basically a bowling ball with ears. Brace yourself.'],
    ask: 'Play-fight Poppy?', yes: 'Bring it on', no: 'Let me stretch first',
    win: ['She is so happy. She has never had this much fun losing. She has never won, to be fair.', 'Poppy can come stay at your place. She will eat anything. Hide the good snacks.'],
    lose: ['Ooh, sorry! She does not know her own strength. She does not know much, honestly. We love her.'],
  },
  tim: {
    name: 'Tim', prize: 'stanley', team: [['pet:stanley', 12]],
    challenge: ['You want to befriend Stanley? He only likes smart animals. Let\'s see if your team qualifies.'],
    ask: 'Play-fight Stanley?', yes: 'We are smart', no: 'Need to study first',
    win: ['He is not even sulking. That is basically a standing ovation.', 'Stanley will visit your place on Allen St. He will judge your furniture. Do not take it personally.'],
    lose: ['Stanley stared at your team until they went home. Classic Stanley. Try again when you are wiser.'],
  },
};

// Who owns which pet you have to win (Princess has no trainer: she is free).
export const PRIZE_TRAINER = Object.fromEntries(Object.entries(TRAINERS).filter(([, t]) => t.prize).map(([id, t]) => [t.prize, id]));
