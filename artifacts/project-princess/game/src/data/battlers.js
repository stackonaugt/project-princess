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
  pushpoll: { name: 'Push Poll', type: 'psychic', power: 50, effect: { foeDef: 1 }, anim: 'beam', text: '{u} asks {t}: "Would you still like your pet if it lied about everything?"' },
  marginoferror: { name: 'Margin of Error', type: 'psychic', power: 0, effect: { evade: true }, anim: 'fade', text: '{u} is plus or minus three percent. Hard to hit.' },
  focusgroup: { name: 'Focus Group', type: 'psychic', power: 55, anim: 'shout', text: 'Eight people in a room tell {t} what they think of it. It hurts.' },
  humblebrag: { name: 'Humblebrag', type: 'psychic', power: 0, effect: { selfAtk: 1 }, anim: 'shout', text: '{u}: "So humbled to have been asked to be this amazing." Its attack rose.' },
  replyall: { name: 'Reply Guy', type: 'plastic', power: 50, anim: 'beam', text: '{u} replies to every one of {t}\'s comments. With a link.' },
  seemore: { name: '...See More', type: 'plastic', power: 45, effect: { foeAtk: 1 }, anim: 'gust', text: '{t} taps See More. There is so much more.' },
  redtape: { name: 'Red Tape', type: 'old', power: 40, effect: { foeAtk: 1 }, anim: 'gust', text: '{u} wraps {t} in red tape. Further information is required.' },
  objection: { name: 'Objection', type: 'old', power: 55, anim: 'shout', text: 'Forty-two neighbours object to {t}. One of them is a dog.' },
  ribboncut: { name: 'Ribbon Cutting', type: 'steel', power: 60, anim: 'claw', text: '{u} declares {t} officially open.' },
  photoop: { name: 'Photo Op', type: 'fairy', power: 0, effect: { selfAtk: 1, selfDef: 1 }, anim: 'heal', text: '{u} poses with a big cheque. Its attack and defence rose.' },
  scorecard: { name: 'Score: 62', type: 'psychic', power: 50, anim: 'beam', text: 'The machine gives {t} a score of 62. Devastating.' },
  feedback: { name: 'Feedback', type: 'steel', power: 45, effect: { foeDef: 1 }, anim: 'shout', text: 'The microphone squeals right in {t}\'s ear.' },
  myway: { name: 'I Did It My Way', type: 'old', power: 60, anim: 'shout', text: '{u} belts it out. Regrets? It has had a few. But then again, too few to mention.' },
  finalcurtain: { name: 'The Final Curtain', type: 'old', power: 0, effect: { heal: 0.3 }, anim: 'heal', text: 'And now, the end is near. {u} takes a long, slow bow and feels better.' },
  keychange: { name: 'Key Change', type: 'fairy', power: 0, effect: { charge: true }, anim: 'heal', text: '{u} goes up a key. The next bit is going to be huge.' },
  bignote: { name: 'The Big Note', type: 'fairy', power: 65, anim: 'shout', text: '{u} hits the big note. Windows rattle across Laverton.' },
  networking: { name: 'Networking', type: 'psychic', power: 0, effect: { foeAtk: 1, foeDef: 1 }, anim: 'shout', text: '{u} gives {t} a business card, then another one. {t} feels drained.' },
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
  polling: { name: 'Polling', type: 'psychic', stats: { hp: 58, attack: 44, defence: 56, speed: 60, special: 72 }, moves: ['pushpoll', 'marginoferror', 'focusgroup'], faces: 'front' },
  fbpost: { name: 'Arrogant Facebook Post', type: ['psychic', 'plastic'], stats: { hp: 62, attack: 50, defence: 52, speed: 58, special: 74 }, moves: ['humblebrag', 'replyall', 'seemore'], faces: 'front', float: true },
  permit: { name: 'Planning Permit', type: ['old', 'plastic'], stats: { hp: 64, attack: 50, defence: 66, speed: 40, special: 66 }, moves: ['redtape', 'objection'], faces: 'front' },
  scissors: { name: 'Giant Novelty Scissors', type: 'steel', stats: { hp: 62, attack: 70, defence: 62, speed: 54, special: 50 }, moves: ['ribboncut', 'photoop'], faces: 'front' },
  videoke: { name: 'Videoke Machine', type: ['steel', 'psychic'], stats: { hp: 58, attack: 48, defence: 58, speed: 44, special: 62 }, moves: ['scorecard', 'feedback'], faces: 'front' },
  myway: { name: 'My Way', type: 'old', stats: { hp: 60, attack: 54, defence: 54, speed: 46, special: 64 }, moves: ['myway', 'finalcurtain'], faces: 'front', float: true },
  powerballad: { name: 'Power Ballad', type: 'fairy', stats: { hp: 58, attack: 50, defence: 50, speed: 56, special: 70 }, moves: ['keychange', 'bignote'], faces: 'front', float: true },
  pointcookmp: { name: 'The Member for Point Cook', type: ['psychic', 'old'], stats: { hp: 56, attack: 54, defence: 52, speed: 70, special: 66 }, moves: ['talkingpoints', 'networking', 'ribbonsnip'], faces: 'left' },
  couch: { name: 'Poorly Upholstered Couch', type: ['leather', 'old'], stats: { hp: 66, attack: 46, defence: 66, speed: 30, special: 40 }, moves: ['saggy', 'loosethread', 'cushionflop'], faces: 'front' },
  austin: { name: 'Austin', tall: true, faces: 'left', type: 'psychic', stats: { hp: 60, attack: 46, defence: 56, speed: 52, special: 70 }, moves: ['bragging', 'talkingup', 'boredom'] },
  nala: { name: 'Nala', type: ['leather', 'park'], stats: { hp: 64, attack: 62, defence: 54, speed: 64, special: 44 }, moves: ['kongchase', 'tongueout', 'twofactor'] },
  ticket: { name: 'Parking Ticket', type: 'plastic', stats: { hp: 48, attack: 48, defence: 44, speed: 62, special: 50 }, moves: ['ticketed', 'appeal'], faces: 'front', float: true },
  clamp: { name: 'Wheel Clamp', type: 'steel', stats: { hp: 58, attack: 60, defence: 66, speed: 30, special: 30 }, moves: ['clampdown', 'appeal'], faces: 'front' },
  footyrecord: { name: 'Footy Record', type: 'street', stats: { hp: 52, attack: 56, defence: 46, speed: 58, special: 40 }, moves: ['barrack', 'speccy'], faces: 'front' },
  halftimepie: { name: 'Half-time Pie', type: 'fire', stats: { hp: 56, attack: 58, defence: 50, speed: 44, special: 50 }, moves: ['molten', 'barrack'], faces: 'front' },
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
