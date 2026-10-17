// ============================================================
//  MORE BATTLERS. The owner asked for someone to battle in every
//  suburb (apart from quiet spots like Allen St). Their people, words,
//  foes, moves and trainer entries live here, merged into the main
//  tables when those files load (like north.js and east.js):
//
//   BATTLER_NPCS      -> NPCS (npcs.js)
//   BATTLER_PEOPLE    -> PEOPLE (dialogue.js)    lines and battle text
//   BATTLER_FOE_TEXT  -> FOE_TEXT (dialogue.js)
//   BATTLER_MOVES     -> MOVES (moves.js)
//   BATTLER_ENEMIES, BATTLER_TRAINERS -> enemies.js
//   art: src/art/paint/battlers.js
//
// A trainer's `ambush: n` makes them walk up and challenge you on your nth
// visit to their zone (and every visit after, until you beat them once).
// Australian spelling, no em dashes, lines under about 140 characters.
// The politicians are playful send-ups. Austin uses they/them.

// ------------------------------------------------------------ people
export const BATTLER_NPCS = {
  // Coburg Lake: a Labor pollster out on his bike.
  kos: {
    name: 'Kos', look: { hair: '#5a4a40', hairStyle: 'short', skin: '#e0b090', shirt: '#1e3a8a', shirtPattern: 'stripes', shirtAccent: '#f0d040', pants: '#141418', shoes: '#f4f4f0', sunglasses: '#3a3a44', shades: 'wrap', short: true },
  },
  // Bell St, outside Coburg Town Hall: the Deputy Mayor of Merri-bek.
  lambros: {
    name: 'Lambros', look: { hair: '#1a1612', hairStyle: 'short', skin: '#e8b890', shirt: '#9a8ac8', shirtPattern: 'gingham', shirtAccent: '#f4f4f0', blazer: '#2a2a30', pants: '#2a2a30', shoes: '#1a1a1a', tie: '#6a4a6a', belly: true, stubble: true },
  },
  // Summerhill: a security guard who could not care less.
  guard: {
    name: 'Security Guard', look: { hair: '#2a2018', hairStyle: 'cap', cap: '#1e2230', skin: '#c89070', shirt: '#2a2e3a', logo: '#f0d040', pants: '#1e2230', shoes: '#141414', belly: true },
  },
  // Flemington: a networker.
  markteapot: {
    name: 'Mark Teapot', look: { hair: '#c8a070', hairStyle: 'wavyshort', skin: '#f6d0b4', shirt: '#f4f4f0', collar: true, blazer: '#4a5a7a', pants: '#c8b890', shoes: '#6a3a1e' },
  },
  // Altona: Amy, who has a comedy show on Saturday.
  amy: {
    name: 'Amy', look: { hair: '#2a1a14', hairStyle: 'long', skin: '#f2c8a8', shirt: '#e8a040', shirtPattern: 'dots', shirtAccent: '#f4f4f0', pants: '#2a2a38', shoes: '#1e1e22', hoops: '#f4c83a', lips: '#c0505a' },
  },
  // Civic Parade, Altona: council's parking officer.
  parking: {
    name: 'Parking Officer Pam', look: { hair: '#8a6a4a', hairStyle: 'bun', skin: '#f0c8a8', shirt: '#2a3a5a', hivis: true, pants: '#2a3a5a', shoes: '#141414', glasses: true },
  },
  // Barkly St, Footscray: a Western Bulldogs tragic.
  doggies: {
    name: 'Doggies Dave', look: { hair: '#4a3a2a', hairStyle: 'bald', skin: '#e8b890', jersey: ['#2a4aa8', '#e8e8e8'], pants: '#2a2a30', shoes: '#f4f4f0', scarf: '#c8202a', beard: true },
  },
};

// ------------------------------------------------------------ words
export const BATTLER_PEOPLE = {
  kos: {
    role: 'Labor pollster. Rides the Merri Creek trail in very tight Lycra',
    lines: [
      ['Kos. I do numbers for the party. Quick question: on a scale of one to ten, how are you feeling about me?'],
      ['Sixty kilometres before breakfast. The Lycra is aerodynamic. And honest.'],
      ['Every lake has a swing voter. That swan, for example. Very hard to read.'],
    ],
    battle: {
      challenge: ['Kos skids to a stop, unclips one shoe and points at you.', '"Helen! You\'re in my target demographic. Got time for a short survey? It\'s forty minutes."'],
      ask: 'Take the survey (battle Kos)?', yes: 'Fine', no: 'Hang up',
      win: ['Kos: "Interesting. Very interesting. I\'ll tell head office it was within the margin of error."'],
      lose: ['Kos: "Exactly as the polling predicted." He clips back in and rides off.'],
      again: ['Kos: "Follow-up survey! Just as long. Possibly longer."'],
    },
  },
  lambros: {
    role: 'Deputy Mayor of Merri-bek. Always outside the town hall, always on the phone',
    lines: [
      ['Lambros. Deputy Mayor. You\'ll have seen me at the opening of a footpath. Several footpaths.'],
      ['Moreland became Merri-bek in 2022. I still accidentally sign letters with the old name. Do not tell anyone.'],
      ['The trick with council is to second everything. Nobody remembers who moved it. Everybody remembers who seconded it.'],
    ],
    battle: {
      challenge: ['Lambros hangs up the phone and buttons his jacket. It takes a moment.', '"Helen! The Mayor of Hobsons Bay\'s wife, on my turf? I move that we battle. I also second it."'],
      ask: 'Battle Lambros?', yes: 'Motion carried', no: 'Move to adjourn',
      win: ['Lambros: "Point of order! No? Fine. Fine. The motion is lost."', 'He shakes your hand for a photo nobody is taking.'],
      lose: ['Lambros: "Carried unanimously. Well. By me."'],
      again: ['Lambros: "I move to rescind the last result. Shall we?"'],
    },
  },
  guard: {
    role: 'Summerhill security. Watching the car park. Mostly watching his phone',
    lines: [
      ['Mm.'],
      ['Shopping centre closes when it closes. Don\'t ask me.'],
      ['I get paid the same whether the trolley comes back or not.'],
    ],
    battle: {
      challenge: ['The security guard looks up from his phone, sighs, and looks back down.', '"Look, you\'re loitering. I\'m supposed to do something about it. Here."'],
      ask: 'Battle the security guard?', yes: 'Go on then', no: 'Keep walking',
      intro: 'The security guard doesn\'t even stand up straight.',
      win: ['The guard shrugs. "Yeah, nah. Not paid enough for this." He goes back to his phone.'],
      lose: ['The guard: "Right. Move along." He does not look up.'],
      again: ['The guard sighs. "Again? Fine. One trolley. That\'s all you\'re getting."'],
    },
  },
  markteapot: {
    role: 'Networker. Has a card for everything',
    lines: [
      ['Mark Teapot. Let\'s grab a coffee sometime. Not now. Sometime. I\'ll get my people to call your people.'],
      ['I\'m in stakeholder relations. Relations with stakeholders. It\'s a lot of lanyards.'],
    ],
    battle: {
      challenge: [
        'Mark Teapot: "Helen! Mark Teapot. We met at a thing. You won\'t remember. Here\'s my card. And another one."',
        'Mark Teapot: "So, Paddy. Mayor Paddy. Any chance he could pop me in front of a couple of ministers? Just a quick intro. Twenty minutes, tops."',
        'Helen: "No. Absolutely not."',
        'Mark Teapot goes very red. "Right. RIGHT. You\'ll regret that. I know people. Small people. Watch this."',
      ],
      ask: 'Battle Mark Teapot?', yes: 'Bring it', no: 'Back away slowly',
      intro: 'Mark Teapot snaps his fingers. "Get out here!"',
      win: ['Mark Teapot: "This isn\'t over. I\'m putting it in my LinkedIn."'],
      lose: ['Mark Teapot: "Think about that intro, Helen. Just a coffee. Ministers drink coffee."'],
      again: ['Mark Teapot: "Helen! Circling back. Touching base. Any movement on those ministers? No? Then we fight."'],
    },
  },
  amy: {
    role: 'Comedian. Has a show this Saturday, and the Saturday after that',
    lines: [
      ['Amy: "My show\'s on Saturday. Tickets are cheap. Cheaper if you bring a friend. Free if you bring four."'],
      ['Amy: "My new bit is about couches. Nobody laughs at the couch bit. The couch bit is the best bit."'],
    ],
    battle: {
      challenge: ['Amy: "Hi Helen! Will you come to my comedy show this Saturday? I really need the numbers."', 'Amy: "Oh, you\'re busy? We\'ll see about that!"'],
      ask: 'Battle Amy?', yes: 'Let\'s see', no: 'Honestly busy',
      win: ['Amy: "Okay. Okay! That\'s new material. Thanks, Helen."', 'Amy: "Saturday, 8pm. I\'ll save you a seat. I\'ll save you all the seats."'],
      lose: ['Amy: "See? You\'re not busy. You\'re coming Saturday."'],
      again: ['Amy: "Another show, another Saturday, another empty room. Let\'s go!"'],
    },
  },
  parking: {
    role: 'Hobsons Bay parking officer. Has never once let anyone off',
    lines: [
      ['That\'s a loading zone, love. Are you loading? You don\'t look like you\'re loading.'],
      ['Ten years on Civic Parade. I have seen every excuse. My favourite was "the dog was driving".'],
    ],
    battle: {
      challenge: ['Pam clicks her ticket machine. "Two minutes over, Helen. Mayor\'s wife or not."'],
      ask: 'Contest the fine (battle Pam)?', yes: 'Contest it', no: 'Pay up later',
      win: ['Pam: "Fine. FINE. Warning only. Don\'t tell anyone."'],
      lose: ['Pam tucks a ticket under your pet\'s collar. It\'s a warning. Probably.'],
      again: ['Pam: "Back again? I\'ve got a whole new book of tickets."'],
    },
  },
  doggies: {
    role: 'Western Bulldogs supporter since 1954. Still talks about 2016 most days',
    lines: [
      ['2016, mate. Premiers. I cried for a week. I\'m still crying a bit now.'],
      ['Footscray, born and bred. The Barkly St pho is the best in Melbourne. Don\'t @ me.'],
    ],
    battle: {
      challenge: ['Dave: "Oi! You barrack for anyone? Doesn\'t matter. Let\'s have a kick. Well. A fight."'],
      ask: 'Battle Doggies Dave?', yes: 'Bounce it', no: 'Not today',
      win: ['Dave: "Good game, good game. Like the 2016 Grand Final, except we lost."'],
      lose: ['Dave: "Get around ya! Doggies!"'],
      again: ['Dave: "Rematch! Second half! Come on!"'],
    },
  },
};

export const BATTLER_FOE_TEXT = {
  polling: { appear: 'Kos flips open a clipboard. The bar chart on it stands up.', leave: 'is filed under undecided.' },
  fbpost: { appear: 'Kos taps his phone. An arrogant Facebook post rises off the screen. Forty-seven paragraphs.', leave: 'is quietly deleted. Screenshots remain.' },
  permit: { appear: 'A planning permit flaps out of Lambros\'s folder, covered in red tape.', leave: 'goes back into the pile. It will be decided in six to eight months.' },
  scissors: { appear: 'Lambros pulls out a giant pair of novelty scissors. Something somewhere needs opening.', leave: 'goes back into the boot of the council car.' },
  videoke: { appear: 'Tito Ramon wheels out the videoke machine. The screen says 100.', leave: 'is unplugged. The microphone feeds back one last time.' },
  myway: { appear: 'Tito Ramon cues up My Way. Everyone in the park goes quiet.', leave: 'reaches the final curtain.' },
  powerballad: { appear: 'A power ballad swells out of the speakers. Somewhere, a wind machine turns on.', leave: 'fades out on the big note.' },
  pointcookmp: { appear: 'A tiny little politician in a suit steps out from behind Mark Teapot. He waves to camera.', leave: 'heads off to a ribbon cutting in Point Cook.' },
  couch: { appear: 'Amy drags out a mustard velvet couch. The cushions are all slightly the wrong size.', leave: 'is put out on the nature strip with a FREE sign.' },
  austin: { appear: 'Amy: "Austin! Tell Helen about your thing!" Austin has a thing. Austin has many things.', leave: 'finishes their story. Nobody is sure when it started.' },
  nala: { appear: 'Nala trots out, tongue out, tail going. She looks thrilled to be here.', leave: 'flops down for a belly rub. Good girl.' },
  ticket: { appear: 'Pam prints a parking ticket. It keeps printing.', leave: 'blows away down Civic Parade.' },
  clamp: { appear: 'Pam rolls out a big yellow wheel clamp. It snaps at you.', leave: 'is unlocked with a sigh.' },
  footyrecord: { appear: 'Dave rolls up a Footy Record and swings it like a bat.', leave: 'goes back in Dave\'s back pocket, a bit soggy.' },
  halftimepie: { appear: 'Dave produces a half-time pie. Molten in the middle. Dangerous.', leave: 'is eaten in two bites.' },
};

// ------------------------------------------------------------ moves
export const BATTLER_MOVES = {
  pushpoll: { name: 'Push Poll', type: 'hack', power: 50, effect: { foeDef: 1 }, anim: 'beam', text: '{u} asks {t}: "Would you still like your pet if it lied about everything?"' },
  marginoferror: { name: 'Margin of Error', type: 'hack', power: 0, effect: { evade: true }, anim: 'fade', text: '{u} is plus or minus three percent. Hard to hit.' },
  focusgroup: { name: 'Focus Group', type: 'psychic', power: 55, anim: 'shout', text: 'Eight people in a room tell {t} what they think of it. It hurts.' },
  humblebrag: { name: 'Humblebrag', type: 'hack', power: 0, effect: { selfAtk: 1 }, anim: 'shout', text: '{u}: "So humbled to have been asked to be this amazing." Its attack rose.' },
  replyall: { name: 'Reply Guy', type: 'plastic', power: 50, anim: 'beam', text: '{u} replies to every one of {t}\'s comments. With a link.' },
  seemore: { name: '...See More', type: 'plastic', power: 45, effect: { foeAtk: 1 }, anim: 'gust', text: '{t} taps See More. There is so much more.' },
  redtape: { name: 'Red Tape', type: 'old', power: 40, effect: { foeAtk: 1 }, anim: 'gust', text: '{u} wraps {t} in red tape. Further information is required.' },
  objection: { name: 'Objection', type: 'old', power: 55, anim: 'shout', text: 'Forty-two neighbours object to {t}. One of them is a dog.' },
  ribboncut: { name: 'Ribbon Cutting', type: 'steel', power: 60, anim: 'claw', text: '{u} declares {t} officially open.' },
  photoop: { name: 'Photo Op', type: 'fairy', power: 0, effect: { selfAtk: 1, selfDef: 1 }, anim: 'heal', text: '{u} poses with a big cheque. Its attack and defence rose.' },
  scorecard: { name: 'Score: 62', type: 'psychic', power: 50, anim: 'beam', text: 'The machine gives {t} a score of 62. Devastating.' },
  feedback: { name: 'Feedback', type: 'electric', power: 45, effect: { foeDef: 1 }, anim: 'shout', text: 'The microphone squeals right in {t}\'s ear.' },
  myway: { name: 'I Did It My Way', type: 'old', power: 60, anim: 'shout', text: '{u} belts it out. Regrets? It has had a few. But then again, too few to mention.' },
  finalcurtain: { name: 'The Final Curtain', type: 'old', power: 0, effect: { heal: 0.3 }, anim: 'heal', text: 'And now, the end is near. {u} takes a long, slow bow and feels better.' },
  keychange: { name: 'Key Change', type: 'fairy', power: 0, effect: { charge: true }, anim: 'heal', text: '{u} goes up a key. The next bit is going to be huge.' },
  bignote: { name: 'The Big Note', type: 'fairy', power: 65, anim: 'shout', text: '{u} hits the big note. Windows rattle across Laverton.' },
  networking: { name: 'Networking', type: 'hack', power: 0, effect: { foeAtk: 1, foeDef: 1 }, anim: 'shout', text: '{u} gives {t} a business card, then another one. {t} feels drained.' },
  ribbonsnip: { name: 'Tiny Ribbon', type: 'steel', power: 40, anim: 'claw', text: '{u} cuts a very small ribbon on {t}.' },
  saggy: { name: 'Saggy Cushion', type: 'leather', power: 0, effect: { foeDef: 1 }, anim: 'hop', text: '{t} sinks into the middle seat and cannot get back up.' },
  loosethread: { name: 'Loose Thread', type: 'leather', power: 45, anim: 'claw', text: '{t} pulls a loose thread. The whole arm comes off. It hits {t}.' },
  cushionflop: { name: 'Cushion Flop', type: 'old', power: 50, anim: 'lunge', text: 'A slightly-too-small cushion flops onto {t}.' },
  bragging: { name: 'Bragging', type: 'psychic', power: 55, anim: 'shout', text: '{u} tells {t} about their achievements. All of them. In order.' },
  talkingup: { name: 'Talking Themselves Up', type: 'psychic', power: 0, effect: { selfAtk: 1, selfDef: 1 }, anim: 'heal', text: '{u} talks themselves up. Their attack and defence rose. So did their opinion of themselves.' },
  boredom: { name: 'Bore To Death', type: 'psychic', power: 45, effect: { foeAtk: 1 }, anim: 'beam', text: '{u} explains their spreadsheet. {t} is losing the will to fight.' },
  twofactor: { name: 'Two-Factor Login', type: 'leather', power: 0, effect: { heal: 0.3 }, anim: 'heal', text: '{u} logs back into Teams so Amy doesn\'t have to. What a good girl. She feels better.' },
  kongchase: { name: 'Kong Chase', type: 'leather', power: 55, anim: 'lunge', text: '{u} chases a red Kong straight through {t}.' },
  tongueout: { name: 'Tongue Out', type: 'park', power: 0, effect: { foeAtk: 1 }, anim: 'hop', text: '{u} smiles at {t} with her tongue out. {t} cannot bring itself to fight properly.' },
  ticketed: { name: 'Ticketed', type: 'plastic', power: 50, anim: 'gust', text: '{u} sticks itself to {t}. $99 fine.' },
  appeal: { name: 'Appeal Denied', type: 'old', power: 0, effect: { foeDef: 1 }, anim: 'shout', text: '{t} appeals. {u} denies it.' },
  clampdown: { name: 'Clamp Down', type: 'steel', power: 60, anim: 'bite', text: '{u} clamps onto {t}. Release fee: $150.' },
  barrack: { name: 'Barrack', type: 'street', power: 0, effect: { selfAtk: 1 }, anim: 'shout', text: 'Dave yells "GO DOGGIES!" {u}\'s attack rose.' },
  speccy: { name: 'Speccy', type: 'street', power: 55, anim: 'hop', text: '{u} takes a speccy off {t}\'s back.' },
  molten: { name: 'Molten Middle', type: 'fire', power: 55, anim: 'flame', text: '{t} bites in. The middle is the temperature of the sun.' },
};

// ------------------------------------------------------------ foes
export const BATTLER_ENEMIES = {
  polling: { name: 'Polling', type: 'hack', stats: { hp: 58, attack: 44, defence: 56, speed: 60, special: 72 }, moves: ['pushpoll', 'marginoferror', 'focusgroup'], faces: 'front' },
  fbpost: { name: 'Arrogant Facebook Post', type: ['hack', 'plastic'], stats: { hp: 62, attack: 50, defence: 52, speed: 58, special: 74 }, moves: ['humblebrag', 'replyall', 'seemore'], faces: 'front', float: true },
  permit: { name: 'Planning Permit', type: ['old', 'plastic'], stats: { hp: 64, attack: 50, defence: 66, speed: 40, special: 66 }, moves: ['redtape', 'objection'], faces: 'front' },
  scissors: { name: 'Giant Novelty Scissors', type: 'steel', stats: { hp: 62, attack: 70, defence: 62, speed: 54, special: 50 }, moves: ['ribboncut', 'photoop'], faces: 'front' },
  videoke: { name: 'Videoke Machine', type: ['electric', 'psychic'], stats: { hp: 58, attack: 48, defence: 58, speed: 44, special: 62 }, moves: ['scorecard', 'feedback'], faces: 'front' },
  myway: { name: 'My Way', type: 'old', stats: { hp: 60, attack: 54, defence: 54, speed: 46, special: 64 }, moves: ['myway', 'finalcurtain'], faces: 'front', float: true },
  powerballad: { name: 'Power Ballad', type: 'fairy', stats: { hp: 58, attack: 50, defence: 50, speed: 56, special: 70 }, moves: ['keychange', 'bignote'], faces: 'front', float: true },
  pointcookmp: { name: 'The Member for Point Cook', type: ['hack', 'old'], stats: { hp: 56, attack: 54, defence: 52, speed: 70, special: 66 }, moves: ['talkingpoints', 'networking', 'ribbonsnip'], faces: 'left' },
  couch: { name: 'Poorly Upholstered Couch', type: ['leather', 'old'], stats: { hp: 66, attack: 46, defence: 66, speed: 30, special: 40 }, moves: ['saggy', 'loosethread', 'cushionflop'], faces: 'front' },
  austin: { name: 'Austin', tall: true, faces: 'left', type: 'psychic', stats: { hp: 60, attack: 46, defence: 56, speed: 52, special: 70 }, moves: ['bragging', 'talkingup', 'boredom'] },
  nala: { name: 'Nala', type: ['leather', 'park'], stats: { hp: 64, attack: 62, defence: 54, speed: 64, special: 44 }, moves: ['kongchase', 'tongueout', 'twofactor'] },
  ticket: { name: 'Parking Ticket', type: 'plastic', stats: { hp: 48, attack: 48, defence: 44, speed: 62, special: 50 }, moves: ['ticketed', 'appeal'], faces: 'front', float: true },
  clamp: { name: 'Wheel Clamp', type: 'steel', stats: { hp: 58, attack: 60, defence: 66, speed: 30, special: 30 }, moves: ['clampdown', 'appeal'], faces: 'front' },
  footyrecord: { name: 'Footy Record', type: 'street', stats: { hp: 52, attack: 56, defence: 46, speed: 58, special: 40 }, moves: ['barrack', 'speccy'], faces: 'front' },
  halftimepie: { name: 'Half-time Pie', type: ['food', 'fire'], stats: { hp: 56, attack: 58, defence: 50, speed: 44, special: 50 }, moves: ['molten', 'barrack'], faces: 'front' },
};

export const BATTLER_TRAINERS = {
  kos: { name: 'Kos', team: [['polling', 12], ['fbpost', 13]], reward: { icedcoffee: 1 }, money: 45, sendOut: 'Kos sends out {f}.' },
  lambros: { name: 'Lambros', team: [['permit', 12], ['scissors', 13]], reward: { pide: 1 }, money: 50, sendOut: 'Lambros tables {f}.' },
  guard: { name: 'Security Guard', team: [['trolley', 10]], money: 30, sendOut: 'He kicks a {f} at you without looking up.' },
  // The karaoke dad at Lohse St Reserve: he has been watching you walk past all week.
  ramon: {
    name: 'Tito Ramon', ambush: 4,
    challenge: ['Tito Ramon puts down the mic and points at you. "Four times you walk past and you never sing! Not once!"', '"Okay. If you will not sing, we battle. Karaoke rules. Loser sings My Way."'],
    ask: 'Battle Tito Ramon?', yes: 'Hit it', no: 'I\'ll sing later',
    win: ['Tito Ramon: "Ay! Not bad, not bad. Now you sing. No? Next time. Next time you sing."'],
    lose: ['Tito Ramon: "Ha! Now you have to sing My Way. Rules are rules."'],
    again: ['Tito Ramon: "Rematch! Same songs. Louder."'],
 team: [['videoke', 5], ['myway', 6], ['powerballad', 6]], reward: { pancit: 1 }, money: 30, sendOut: 'Tito Ramon cues up {f}.',
  },
  markteapot: { name: 'Mark Teapot', team: [['pointcookmp', 7]], money: 40, sendOut: 'Mark Teapot sends out {f}.' },
  amy: { name: 'Amy', team: [['couch', 5], ['austin', 5], ['nala', 6]], money: 35, sendOut: 'Amy sends out {f}.' },
  parking: { name: 'Parking Officer Pam', team: [['ticket', 4], ['clamp', 5]], money: 25, sendOut: 'Pam issues {f}.' },
  doggies: { name: 'Doggies Dave', team: [['footyrecord', 5], ['halftimepie', 6]], reward: { snag: 1 }, money: 30, sendOut: 'Dave sends out {f}.' },
};

// ============================================================
//  ROUND FOUR: twelve more battlers the owner asked for, one in each of
//  Laverton Station, Barkly St, Brunswick Station, Donald St, Hope St,
//  Sydney Rd, Reservoir Station, Glasgow Ave, Plenty Rd, Preston Station,
//  Nicholson St (Carlton) and Carlton Gardens. Invented locals, not real
//  people. Merged into the tables above so the importers pick them up.

const R4_NPCS = {
  // Laverton Station: a V/Line commuter, always running late.
  vlinegreg: { name: 'Geelong Greg', look: { hair: '#6a5a4a', hairStyle: 'short', skin: '#f0c8a8', shirt: '#e8e8f0', collar: true, tie: '#7a1e2a', blazer: '#3a3e4a', pants: '#3a3e4a', shoes: '#1a1a1a', glasses: true, belly: true } },
  // Barkly St: a fruit shop owner with an opinion about durians.
  rosa: { name: 'Rosa', look: { hair: '#2a2420', hairStyle: 'bun', skin: '#d8a880', shirt: '#c83a3a', apron: '#3a8a4a', pants: '#2a2a30', shoes: '#4a3a2a', hoops: '#f0c040' } },
  // Brunswick Station: a level crossing removal worker.
  hiviskev: { name: 'Hi-Vis Kev', look: { hair: '#c89a5a', hairStyle: 'cap', cap: '#f07a1a', skin: '#e8b48a', shirt: '#f07a1a', hivis: true, pants: '#2a3a5a', shoes: '#4a3020', beard: true, sunglasses: '#2a2a30', shades: 'wrap' } },
  // Donald St: an op shop regular.
  opal: { name: 'Op Shop Opal', look: { hair: '#c8c8d0', hairStyle: 'curly', skin: '#f2d0b8', shirt: '#b85a8a', shirtPattern: 'dots', shirtAccent: '#f0e0a0', blazer: '#5a8a5a', pants: '#8a6a3a', shoes: '#6a3a1e', glasses: true, lips: '#c04a6a' } },
  // Hope St: a landlord checking on his investment.
  lachlan: { name: 'Landlord Lachlan', look: { hair: '#d8c08a', hairStyle: 'wavyshort', skin: '#f6d0b4', shirt: '#8ac0e8', collar: true, blazer: '#1e3a6a', pants: '#c8b890', shoes: '#6a3a1e', sunglasses: '#2a2a30', shades: 'rect' } },
  // Sydney Rd: a cyclist who has been doored more than once.
  cass: { name: 'Cyclist Cass', look: { hair: '#c84a2a', hairStyle: 'bob', skin: '#f2c8a8', shirt: '#2ac8a0', shirtPattern: 'stripes', shirtAccent: '#1e1e24', pants: '#1e1e24', shoes: '#f4f4f0', sunglasses: '#e85a8a', shades: 'wrap' } },
  // Reservoir Station: a trainspotter who loves the skyrail.
  terry: { name: 'Trainspotter Terry', look: { hair: '#7a6a5a', hairStyle: 'bald', skin: '#f0c8a8', shirt: '#c8b890', bumbag: '#2a3a2a', pants: '#5a5a40', shoes: '#4a3a2a', glasses: true, beard: true, short: true } },
  // Glasgow Ave: the yarn bomber of the Botha Ave roundabout.
  yvonne: { name: 'Yarn Bomber Yvonne', look: { hair: '#e8e0d8', hairStyle: 'bun', skin: '#f2d0b8', shirt: '#e86a9a', shirtPattern: 'plaid', shirtAccent: ['#f0c040', '#5aa0d8'], scarf: '#8a4ac8', pants: '#3a5a8a', shoes: '#c83a3a', glasses: true } },
  // Plenty Rd: a hoon who lives for a burnout.
  brad: { name: 'Burnout Brad', look: { hair: '#5a3a1e', hairStyle: 'mullet', skin: '#e8b48a', shirt: '#1e1e24', logo: '#e8c040', pants: '#3a4a6a', shoes: '#f4f4f0', moustache: true, sunglasses: '#c8a020', shades: 'wrap' } },
  // Preston Station: a uni student on the way to La Trobe.
  zara: { name: 'Zara', look: { hair: '#1a1410', hairStyle: 'long', skin: '#c89070', shirt: '#6a4ac8', pants: '#3a3a44', shoes: '#f4f4f0', bumbag: '#e8a040', holding: 'book' } },
  // Nicholson St, Carlton: a professor walking to the uni.
  ponsonby: { name: 'Professor Ponsonby', look: { hair: '#d8d8d8', hairStyle: 'wavyshort', skin: '#f6d0b4', shirt: '#e8e0c8', collar: true, tie: '#3a5a3a', blazer: '#8a6a3a', blazerPattern: 'plaid', blazerAccent: ['#6a4a2a', '#a88a5a'], pants: '#5a4a3a', shoes: '#3a2418', glasses: true, beard: '#d8d8d8' } },
  // Carlton Gardens: a personal trainer running a bootcamp.
  tayla: { name: 'PT Tayla', look: { hair: '#e8c87a', hairStyle: 'messybun', skin: '#e8b890', shirt: '#e83a8a', pants: '#1e1e24', pantsPattern: 'stripes', pantsAccent: '#e83a8a', shoes: '#f4f4f0', headband: '#f4f4f0' } },
};

const R4_PEOPLE = {
  vlinegreg: {
    role: 'Commutes from Geelong. The train is always running late, and so is he',
    lines: [
      ['Greg. Geelong. Forty-five minutes on a good day. There are no good days.'],
      ['"Replaced by buses between Werribee and Laverton." My four favourite words. That\'s a lie.'],
    ],
    battle: {
      challenge: ['Greg checks his watch, then the board, then his watch again.', '"Twenty-minute delay. Signal fault at Little River. Right. Let\'s pass the time."'],
      ask: 'Battle Geelong Greg?', yes: 'All aboard', no: 'Mind the gap',
      win: ['Greg: "Beaten AND late. Classic Tuesday."'],
      lose: ['Greg: "Ha! First thing that\'s gone my way all week."'],
      again: ['Greg: "Another delay. Another battle. This is my life now."'],
    },
  },
  rosa: {
    role: 'Runs a fruit shop on Barkly St. Every price is a bargain. Every one',
    lines: [
      ['Rosa: "Mangoes, five for ten! Ten for five! I don\'t know, I\'m very tired."'],
      ['Rosa: "Durian is the king of fruit. People complain about the smell. People complain about everything."'],
    ],
    battle: {
      challenge: ['Rosa: "You! You squeezed my avocados. Don\'t lie. I saw."', 'Rosa: "You squeeze, you pay. Or you battle."'],
      ask: 'Battle Rosa?', yes: 'Fair enough', no: 'I\'ll pay',
      win: ['Rosa: "Okay, okay. Take an avocado. It\'s ripe. You\'ve made sure of that."'],
      lose: ['Rosa: "Ha! Never squeeze in Footscray."'],
      again: ['Rosa: "Fresh battle! Just in today!"'],
    },
  },
  hiviskev: {
    role: 'Level crossing removal crew. Has removed eleven crossings and one eyebrow',
    lines: [
      ['Kev. Level Crossing Removal Project. Another boom gate gone. Eighty-five down, heaps to go.'],
      ['We just dig a big hole and put the train in it. Or up on stilts. Depends on the vibe.'],
    ],
    battle: {
      challenge: ['Kev pulls out a big orange EXPECT DELAYS sign.', '"Sorry mate, path\'s closed. Works till 2031. Or you could fight your way through."'],
      ask: 'Battle Hi-Vis Kev?', yes: 'Fight through', no: 'Take the detour',
      win: ['Kev: "Fair play. Path\'s open. Mind the witches hats."'],
      lose: ['Kev: "Detour\'s that way. Follow the arrows. All forty of them."'],
      again: ['Kev: "New stage of works! Same delays!"'],
    },
  },
  opal: {
    role: 'Op shop regular. Knows the price of every fondue set in Brunswick',
    lines: [
      ['Opal: "Darling, this cardigan was four dollars. It\'s Italian. It\'s from 1974. It smells of 1974."'],
      ['Opal: "Never buy new. Everything you need is already in a Vinnies somewhere."'],
    ],
    battle: {
      challenge: ['Opal clutches a fondue set to her chest.', 'Opal: "You were eyeing this off. I saw you. It\'s mine, darling, and I will fight for it."'],
      ask: 'Battle Op Shop Opal?', yes: 'Fondue or die', no: 'It\'s all yours',
      win: ['Opal: "Fine. Fine! There\'s another one in the Salvos. There always is."'],
      lose: ['Opal: "Back to the racks with you, darling."'],
      again: ['Opal: "New stock day! Rematch!"'],
    },
  },
  lachlan: {
    role: 'Owns three units on Hope St. Lives in none of them',
    lines: [
      ['Lachlan: "Just doing an inspection. A routine one. Every week. Routinely."'],
      ['Lachlan: "Mould? That\'s character. That\'s a feature. I\'ve put it in the listing."'],
    ],
    battle: {
      challenge: ['Lachlan: "Right, the market review is in. Rent\'s going up. Twenty percent."', 'Lachlan: "Don\'t like it? I\'ve got forty people at the open for inspection who would."'],
      ask: 'Battle Landlord Lachlan?', yes: 'Rent strike', no: 'Not today',
      win: ['Lachlan: "Okay. Ten percent. Fine. Five. Don\'t tell the tenants union."'],
      lose: ['Lachlan: "Lovely. Your new lease is in the post."'],
      again: ['Lachlan: "New financial year, new rent review!"'],
    },
  },
  cass: {
    role: 'Rides Sydney Rd every day. Has strong opinions about bike lanes',
    lines: [
      ['Cass: "Sydney Rd needs a separated bike lane. I will say this until I die. Which may be soon, on Sydney Rd."'],
      ['Cass: "Doored three times this year. I\'ve started naming the doors."'],
    ],
    battle: {
      challenge: ['Cass skids up onto the footpath.', 'Cass: "You! You stepped in the bike lane! The painted one! Which is basically just a suggestion."'],
      ask: 'Battle Cyclist Cass?', yes: 'Ding ding', no: 'Look both ways',
      win: ['Cass: "Fine. Fair. Just, please. Check your mirrors."'],
      lose: ['Cass: "Ding ding! On your right!"'],
      again: ['Cass: "Critical mass rematch!"'],
    },
  },
  terry: {
    role: 'Trainspotter. Has photographed every train on the Mernda line. Twice',
    lines: [
      ['Terry: "That one\'s a X\'Trapolis 100. Set 47. She\'s running four minutes early. Unheard of."'],
      ['Terry: "The skyrail\'s lovely. You can see the trains from underneath now. A whole new angle."'],
    ],
    battle: {
      challenge: ['Terry lowers his camera.', 'Terry: "You stood in my shot. The 8:42 express. It only comes once a day."', 'Terry: "There\'s only one way to settle this."'],
      ask: 'Battle Trainspotter Terry?', yes: 'All aboard', no: 'Sorry, Terry',
      win: ['Terry: "Remarkable. I\'ll write this down. I write everything down."'],
      lose: ['Terry: "Next train in eleven minutes. Don\'t stand in the shot."'],
      again: ['Terry: "A rematch! Like the 8:42. Except this happens more than once."'],
    },
  },
  yvonne: {
    role: 'Yarn bombs the Botha Ave gum. Has knitted a jumper for a stobie pole',
    lines: [
      ['Yvonne: "Knit one, purl one, cover the whole tree. That\'s my motto."'],
      ['Yvonne: "The council took my last one down. Now the possums have nowhere to stay warm."'],
    ],
    battle: {
      challenge: ['Yvonne puts down her needles.', 'Yvonne: "Are you from the council? You look like you\'re from the council. Show me your lanyard."'],
      ask: 'Battle Yarn Bomber Yvonne?', yes: 'Cast on', no: 'Not council',
      win: ['Yvonne: "Oh, you\'re all right. Here, have a tea cosy. I have forty."'],
      lose: ['Yvonne: "Tell the council the gum stays knitted."'],
      again: ['Yvonne: "I\'ve finished a new piece. Want to see? It\'s a battle."'],
    },
  },
  brad: {
    role: 'Lives for a burnout on Plenty Rd. His mum wants him home for tea',
    lines: [
      ['Brad: "She\'s a VE Commodore, mate. V8. Six hundred horsepower. Well. Two hundred. Good ones."'],
      ['Brad: "The tyre shop knows me by name. They\'re very nice. I spend a lot there."'],
    ],
    battle: {
      challenge: ['Brad revs the Commodore. A bit of smoke comes out. Some of it is meant to.', 'Brad: "Race ya. Well, fight ya. Racing\'s illegal."'],
      ask: 'Battle Burnout Brad?', yes: 'Rev it', no: 'Not my thing',
      win: ['Brad: "Yeah, fair. Mum\'s calling anyway. It\'s rissoles."'],
      lose: ['Brad does a small, legal donut in the car park.'],
      again: ['Brad: "New tyres! Rematch!"'],
    },
  },
  zara: {
    role: 'Uni student, third year of a two-year degree',
    lines: [
      ['Zara: "I have an essay due at midnight. It\'s 3pm. I\'ve written my name."'],
      ['Zara: "Instant noodles are a food group if you\'re brave."'],
    ],
    battle: {
      challenge: ['Zara slams her laptop shut.', 'Zara: "I\'m procrastinating. You\'re perfect. Battle me."'],
      ask: 'Battle Zara?', yes: 'Study break', no: 'Do your essay',
      win: ['Zara: "Okay. Okay! Essay. Right now. After one video."'],
      lose: ['Zara: "Better than the essay. Everything is better than the essay."'],
      again: ['Zara: "Another extension! Another battle!"'],
    },
  },
  ponsonby: {
    role: 'Professor of something. Walks to the uni the long way, through his own thoughts',
    lines: [
      ['Ponsonby: "Ah. You\'ll want to read my monograph. Four hundred pages. On footnotes."'],
      ['Ponsonby: "Carlton was terribly bohemian in my day. Now it\'s terribly expensive. Also bohemian."'],
    ],
    battle: {
      challenge: ['Professor Ponsonby peers at you over his glasses.', 'Ponsonby: "Hm. A challenger. Your argument is unreferenced. Let us test it."'],
      ask: 'Battle Professor Ponsonby?', yes: 'Defend thesis', no: 'Office hours',
      win: ['Ponsonby: "Fascinating. A distinction. I don\'t give those out."'],
      lose: ['Ponsonby: "See me after class."'],
      again: ['Ponsonby: "A second paper! I have notes."'],
    },
  },
  tayla: {
    role: 'Runs a 6am bootcamp in Carlton Gardens. Also a 6pm one. Also a noon one',
    lines: [
      ['Tayla: "Morning! Twenty burpees. No? Ten. No? A brisk walk. Wonderful."'],
      ['Tayla: "The Exhibition Building steps are free leg day. Free!"'],
    ],
    battle: {
      challenge: ['Tayla blows a whistle right at you.', 'Tayla: "You\'re standing still! In my park! Drop and give me a battle!"'],
      ask: 'Battle PT Tayla?', yes: 'Let\'s go', no: 'Rest day',
      win: ['Tayla: "YES! Love that energy! Hydrate!"'],
      lose: ['Tayla: "Good effort! Now a cool-down lap. Of the whole gardens."'],
      again: ['Tayla: "Round two! Feel the burn!"'],
    },
  },
};

const R4_FOE_TEXT = {
  replacementbus: { appear: 'A replacement bus pulls up. It is not going where you\'re going.', leave: 'goes the long way round, via Werribee.' },
  durian: { appear: 'Rosa holds up a durian. The whole street can smell it.', leave: 'is wrapped in three plastic bags.' },
  boomgate: { appear: 'Kev drags out an old boom gate. Ding ding ding ding.', leave: 'goes up for the last time. Removed.' },
  roadworks: { appear: 'An EXPECT DELAYS sign unfolds itself.', leave: 'is folded up. The delays continue.' },
  fondueset: { appear: 'Opal unboxes a 1970s fondue set. Orange. Gorgeous.', leave: 'goes back on the shelf at $6.' },
  rentincrease: { appear: 'A rent increase notice slides under the door.', leave: 'is taken to VCAT.' },
  mould: { appear: 'Rental mould creeps out of the bathroom ceiling.', leave: 'is wiped off. It will be back.' },
  cardoor: { appear: 'A parked car\'s door swings open, right into the bike lane.', leave: 'is shut. The driver did not look.' },
  xtrapolis: { appear: 'A train rolls in on the skyrail. Terry takes forty photos.', leave: 'departs on time. Terry gasps.' },
  yarnbomb: { appear: 'A knitted cosy unrolls itself off the gum tree.', leave: 'wraps itself back round the trunk.' },
  commodore: { appear: 'Brad\'s Commodore rumbles up. The exhaust is very loud and slightly on fire.', leave: 'drives home for tea.' },
  hecsdebt: { appear: 'Zara\'s HECS debt looms up. It is indexed. It grows as you watch.', leave: 'will be dealt with later. Much later.' },
  footnote: { appear: 'A footnote drops off the bottom of the page. It has its own footnotes.', leave: 'is relegated to an appendix.' },
  burpee: { appear: 'Tayla shouts "BURPEE!" and a burpee happens.', leave: 'collapses on the lawn.' },
  proteinshake: { appear: 'A protein shake rattles in its shaker. Vanilla. Allegedly.', leave: 'is drunk in one go. Gains.' },
};

const R4_MOVES = {
  latetrain: { name: 'Running Late', type: 'old', power: 0, effect: { foeAtk: 1 }, anim: 'fade', text: '{u} is delayed. {t} gets bored waiting.' },
  allstops: { name: 'All Stations', type: 'steel', power: 55, anim: 'lunge', text: '{u} stops at every single station, right into {t}.' },
  kingfruit: { name: 'King of Fruit', type: 'food', power: 55, anim: 'stink', text: 'The smell of {u} rolls over {t}. It is not a nice smell.' },
  spiky: { name: 'Spiky Husk', type: 'park', power: 45, effect: { foeDef: 1 }, anim: 'claw', text: '{u} rolls onto {t}. Spikes!' },
  dingding: { name: 'Ding Ding Ding', type: 'electric', power: 50, anim: 'shout', text: 'The bells ring and ring at {t}. Ding ding ding ding.' },
  boomdown: { name: 'Boom Down', type: 'steel', power: 60, anim: 'lunge', text: 'The boom comes down on {t}.' },
  expectdelays: { name: 'Expect Delays', type: 'plastic', power: 0, effect: { foeAtk: 1, foeDef: 1 }, anim: 'shout', text: '{t} is held up by works. For months.' },
  detour: { name: 'Detour', type: 'plastic', power: 0, effect: { evade: true }, anim: 'fade', text: '{u} sends {t} the long way round.' },
  fondue: { name: 'Hot Cheese', type: 'fire', power: 55, anim: 'flame', text: '{u} dunks {t} in molten cheese.' },
  retro: { name: 'Retro Chic', type: 'old', power: 0, effect: { selfDef: 1, heal: 0.2 }, anim: 'heal', text: '{u} is back in fashion. It feels better about itself.' },
  rentup: { name: 'Rent Review', type: 'psychic', power: 55, anim: 'beam', text: '{t}\'s rent goes up twenty percent. It is devastated.' },
  bond: { name: 'Keep the Bond', type: 'psychic', power: 0, effect: { drain: 0.5 }, anim: 'beam', text: '{u} keeps {t}\'s bond for "cleaning".' },
  spores: { name: 'Spores', type: 'smelly', power: 50, effect: { foeAtk: 1 }, anim: 'stink', text: 'Black spores drift onto {t}. Cough cough.' },
  damp: { name: 'Rising Damp', type: 'water', power: 45, anim: 'gust', text: 'Damp creeps up {t}\'s legs.' },
  dooring: { name: 'Dooring', type: 'steel', power: 60, anim: 'lunge', text: '{u} swings open right into {t}. Nobody checked the mirror.' },
  sorrymate: { name: 'Sorry Mate', type: 'street', power: 0, effect: { selfAtk: 1 }, anim: 'shout', text: '"Sorry mate, didn\'t see ya." {u}\'s attack rose.' },
  express: { name: 'Express Service', type: 'speed', power: 60, anim: 'lunge', text: '{u} runs express straight past {t}. And through it.' },
  skyrail: { name: 'Skyrail', type: 'electric', power: 0, effect: { selfDef: 1, selfAtk: 1 }, anim: 'heal', text: '{u} rises up onto the skyrail. Its attack and defence rose.' },
  knit: { name: 'Knit One', type: 'leather', power: 45, anim: 'claw', text: '{u} knits {t} into a tea cosy.' },
  cosy: { name: 'Cosy Up', type: 'fairy', power: 0, effect: { heal: 0.3 }, anim: 'heal', text: '{u} wraps itself up warm and feels better.' },
  burnout: { name: 'Burnout', type: 'fire', power: 55, effect: { foeAtk: 1 }, anim: 'flame', text: '{u} spins its wheels. {t} is lost in the smoke.' },
  donut: { name: 'Donut', type: 'speed', power: 50, anim: 'lunge', text: '{u} does a donut round {t}.' },
  indexed: { name: 'Indexation', type: 'old', power: 0, effect: { charge: true }, anim: 'heal', text: '{u} is indexed. It gets bigger every year.' },
  compound: { name: 'Compound Interest', type: 'psychic', power: 60, anim: 'beam', text: '{u} compounds on {t}.' },
  ibid: { name: 'Ibid.', type: 'old', power: 50, anim: 'shout', text: '{u} cites {t}. Ibid. Ibid. Ibid.' },
  peerreview: { name: 'Peer Review', type: 'psychic', power: 0, effect: { foeAtk: 1, foeDef: 1 }, anim: 'beam', text: 'Reviewer 2 tears {t} apart.' },
  burpees: { name: 'Twenty Burpees', type: 'speed', power: 55, anim: 'hop', text: '{u} does twenty burpees all over {t}.' },
  plank: { name: 'Plank', type: 'rock', power: 0, effect: { selfDef: 1 }, anim: 'heal', text: '{u} holds a plank. Its defence rose.' },
  gains: { name: 'Gains', type: 'caffeine', power: 0, effect: { selfAtk: 1, heal: 0.2 }, anim: 'heal', text: '{u} is mostly protein. Its attack rose.' },
  shakeup: { name: 'Shake It Up', type: 'caffeine', power: 50, anim: 'gust', text: '{u} rattles its shaker ball at {t}.' },
};

const R4_ENEMIES = {
  replacementbus: { name: 'Replacement Bus', type: ['steel', 'old'], stats: { hp: 56, attack: 48, defence: 58, speed: 30, special: 40 }, moves: ['latetrain', 'allstops'], faces: 'left' },
  durian: { name: 'Durian', type: ['food', 'smelly'], stats: { hp: 60, attack: 54, defence: 60, speed: 32, special: 50 }, moves: ['kingfruit', 'spiky'], faces: 'front' },
  boomgate: { name: 'Boom Gate', type: ['electric', 'steel'], stats: { hp: 60, attack: 62, defence: 62, speed: 36, special: 44 }, moves: ['dingding', 'boomdown'], faces: 'front' },
  roadworks: { name: 'Expect Delays', type: 'plastic', stats: { hp: 54, attack: 46, defence: 56, speed: 50, special: 50 }, moves: ['expectdelays', 'detour'], faces: 'front' },
  fondueset: { name: 'Fondue Set', type: ['old', 'fire'], stats: { hp: 58, attack: 56, defence: 54, speed: 40, special: 56 }, moves: ['fondue', 'retro'], faces: 'front' },
  rentincrease: { name: 'Rent Increase', type: ['psychic', 'plastic'], stats: { hp: 58, attack: 46, defence: 52, speed: 54, special: 68 }, moves: ['rentup', 'bond'], faces: 'front', float: true },
  mould: { name: 'Rental Mould', type: ['smelly', 'water'], stats: { hp: 62, attack: 50, defence: 56, speed: 40, special: 56 }, moves: ['spores', 'damp'], faces: 'front' },
  cardoor: { name: 'Car Door', type: 'steel', stats: { hp: 56, attack: 64, defence: 60, speed: 48, special: 36 }, moves: ['dooring', 'sorrymate'], faces: 'front' },
  xtrapolis: { name: 'X\'Trapolis Train', type: ['steel', 'speed'], stats: { hp: 64, attack: 66, defence: 62, speed: 66, special: 40 }, moves: ['express', 'skyrail'], faces: 'left' },
  yarnbomb: { name: 'Yarn Bomb', type: ['leather', 'fairy'], stats: { hp: 62, attack: 50, defence: 58, speed: 48, special: 62 }, moves: ['knit', 'cosy'], faces: 'front' },
  commodore: { name: 'VE Commodore', type: ['steel', 'speed'], stats: { hp: 62, attack: 68, defence: 58, speed: 68, special: 40 }, moves: ['burnout', 'donut'], faces: 'left' },
  hecsdebt: { name: 'HECS Debt', type: ['old', 'psychic'], stats: { hp: 66, attack: 48, defence: 60, speed: 40, special: 70 }, moves: ['indexed', 'compound'], faces: 'front', float: true },
  footnote: { name: 'Footnote', type: ['old', 'psychic'], stats: { hp: 58, attack: 48, defence: 58, speed: 52, special: 70 }, moves: ['ibid', 'peerreview'], faces: 'front', float: true },
  burpee: { name: 'Burpee', type: ['speed', 'rock'], stats: { hp: 60, attack: 66, defence: 56, speed: 66, special: 36 }, moves: ['burpees', 'plank'], faces: 'front' },
  proteinshake: { name: 'Protein Shake', type: 'caffeine', stats: { hp: 58, attack: 60, defence: 54, speed: 56, special: 46 }, moves: ['shakeup', 'gains'], faces: 'front' },
};

const R4_TRAINERS = {
  vlinegreg: { name: 'Geelong Greg', team: [['commuter', 4], ['replacementbus', 5]], money: 25, sendOut: 'Greg sends out {f}.' },
  rosa: { name: 'Rosa', team: [['durian', 5], ['pigeon', 6]], reward: { lemon: 2 }, money: 30, sendOut: 'Rosa throws {f} at you.' },
  hiviskev: { name: 'Hi-Vis Kev', team: [['roadworks', 7], ['boomgate', 8]], money: 35, sendOut: 'Kev rolls out {f}.' },
  opal: { name: 'Op Shop Opal', team: [['recordplayer', 7], ['fondueset', 8]], money: 30, sendOut: 'Opal pulls {f} off the rack.' },
  lachlan: { name: 'Landlord Lachlan', team: [['mould', 8], ['rentincrease', 9]], money: 45, sendOut: 'Lachlan serves {f}.' },
  cass: { name: 'Cyclist Cass', team: [['scooter', 8], ['cardoor', 9]], money: 35, sendOut: 'Out of nowhere comes {f}.' },
  terry: { name: 'Trainspotter Terry', team: [['ticketgate', 11], ['xtrapolis', 12]], money: 40, sendOut: 'Terry points at {f}. "There she is!"' },
  yvonne: { name: 'Yarn Bomber Yvonne', team: [['possum', 11], ['yarnbomb', 12]], money: 40, sendOut: 'Yvonne unleashes {f}.' },
  brad: { name: 'Burnout Brad', team: [['scooter', 12], ['commodore', 13]], money: 45, sendOut: 'Brad brings out {f}.' },
  zara: { name: 'Zara', team: [['flatwhitefoe', 13], ['hecsdebt', 14]], money: 40, sendOut: 'Zara is haunted by {f}.' },
  ponsonby: { name: 'Professor Ponsonby', team: [['beret', 13], ['footnote', 14]], money: 50, sendOut: 'Ponsonby cites {f}.' },
  tayla: { name: 'PT Tayla', team: [['proteinshake', 13], ['burpee', 14]], money: 45, sendOut: 'Tayla blows her whistle. Out comes {f}.' },
};

Object.assign(BATTLER_NPCS, R4_NPCS);
Object.assign(BATTLER_PEOPLE, R4_PEOPLE);
Object.assign(BATTLER_FOE_TEXT, R4_FOE_TEXT);
Object.assign(BATTLER_MOVES, R4_MOVES);
Object.assign(BATTLER_ENEMIES, R4_ENEMIES);
Object.assign(BATTLER_TRAINERS, R4_TRAINERS);
