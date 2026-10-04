// Battle moves. Every pet, enemy and bin uses moves from this list.
//
//   type     the move's type (decides effectiveness)
//   power    damage strength (0 for moves that don't hit)
//   effect   optional extra:
//              heal: fraction of max HP restored
//              foeAtk / foeDef: lower the target's attack / defence a stage
//              selfAtk / selfDef: raise your own attack / defence a stage
//              evade: dodge the next attack aimed at you
//              charge: your next damaging move does double damage
//              destroyItem: wreck the foe's held snack so they can't use it
//              drain: heal for this fraction of the damage done
//              usesHeld: needs the user's held snack (fails if it was chewed up)
//   anim     the battle animation ('lunge', 'bite', 'claw', 'beam', 'shout', 'heal', 'fade', 'hop', 'dig', 'gust', 'stink', 'flame')
//   text     the line shown when it's used ({u} = user, {t} = target)

export const MOVES = {
  // Princess (fairy)
  growl:      { name: 'Growl', type: 'fairy', power: 0, effect: { foeAtk: 1 }, anim: 'shout', text: '{u} growls. It is tiny. It is terrifying.' },
  clawattack: { name: 'Claw Attack', type: 'fairy', power: 45, anim: 'claw', text: '{u} goes in claws first!' },
  humpbed:    { name: 'Hump Bed', type: 'fairy', power: 0, effect: { heal: 0.4 }, anim: 'heal', text: '{u} humps the nearest bed with great dignity. She feels refreshed.' },
  bite:       { name: 'Bite', type: 'street', power: 55, anim: 'bite', text: '{u} bites!' },
  // Poppy (rock)
  charge:     { name: 'Charge', type: 'rock', power: 60, anim: 'lunge', text: '{u} charges in head first. No plan. Pure commitment.' },
  scoot:      { name: 'Scoot', type: 'rock', power: 0, effect: { heal: 0.4 }, anim: 'heal', text: '{u} scoots across the carpet. Everyone is uncomfortable, but she feels better.' },
  dig:        { name: 'Dig', type: 'rock', power: 50, anim: 'dig', text: '{u} digs under and pops up beneath {t}!' },
  chew:       { name: 'Chew', type: 'leather', power: 35, effect: { destroyItem: true }, anim: 'bite', text: '{u} chews on {t}. And on anything {t} was holding.' },
  // Spooky (ghost)
  fadeout:    { name: 'Fade Out', type: 'ghost', power: 0, effect: { evade: true }, anim: 'fade', text: '{u} fades out of reality. Good luck hitting that.' },
  nibble:     { name: 'Nibble', type: 'ghost', power: 40, effect: { drain: 0.5 }, anim: 'bite', text: '{u} nibbles {t} from somewhere it shouldn\'t be.' },
  hop:        { name: 'Hop', type: 'ghost', power: 50, anim: 'hop', text: '{u} hops straight through {t}.' },
  stretch:    { name: 'Stretch', type: 'ghost', power: 0, effect: { heal: 0.25, selfAtk: 1 }, anim: 'heal', text: '{u} does a long, luxurious stretch.' },
  // Stanley (psychic)
  bark:       { name: 'Bark', type: 'psychic', power: 0, effect: { foeDef: 1 }, anim: 'shout', text: '{u} barks one single, disappointed bark.' },
  bitestan:   { name: 'Bite Attack', type: 'street', power: 55, anim: 'bite', text: '{u} bites, reluctantly but firmly.' },
  claw:       { name: 'Claw', type: 'street', power: 45, anim: 'claw', text: '{u} swipes with a well-groomed paw.' },
  staredown:  { name: 'Stare Down', type: 'psychic', power: 70, anim: 'beam', text: '{u} stares at {t} until {t} questions everything.' },
  // Salami (street)
  extendclaws: { name: 'Extend Claws', type: 'street', power: 0, effect: { charge: true }, anim: 'shout', text: '{u} slowly extends every claw. The next hit will hurt.' },
  scratch:    { name: 'Scratch', type: 'street', power: 45, anim: 'claw', text: '{u} scratches!' },
  bluestring: { name: 'Play With Blue String', type: 'street', power: 0, effect: { heal: 0.4 }, anim: 'heal', text: '{u} plays with a piece of blue string. Nothing else matters.' },
  hide:       { name: 'Hide', type: 'street', power: 0, effect: { evade: true }, anim: 'fade', text: '{u} hides in a box that is far too small. It works.' },

  // Wild things and bins
  flutter:    { name: 'Flutter', type: 'plastic', power: 30, anim: 'gust', text: '{u} flutters into {t}\'s face.' },
  suffocate:  { name: 'Cling', type: 'plastic', power: 40, anim: 'gust', text: '{u} wraps itself around {t}. Ew.' },
  blowaway:   { name: 'Blow Away', type: 'plastic', power: 0, effect: { evade: true }, anim: 'fade', text: 'A gust of wind lifts {u} out of reach.' },
  hiss:       { name: 'Hiss', type: 'street', power: 0, effect: { foeAtk: 1 }, anim: 'shout', text: '{u} hisses like a punctured tyre.' },
  pounce:     { name: 'Pounce', type: 'street', power: 50, anim: 'lunge', text: '{u} pounces!' },
  growlwild:  { name: 'Snarl', type: 'leather', power: 0, effect: { foeDef: 1 }, anim: 'shout', text: '{u} snarls and shows its teeth.' },
  tug:        { name: 'Tug of War', type: 'leather', power: 50, anim: 'bite', text: '{u} grabs on and tugs!' },
  gnaw:       { name: 'Gnaw', type: 'smelly', power: 45, anim: 'bite', text: '{u} gnaws with its horrible little teeth.' },
  plague:     { name: 'Bin Juice', type: 'smelly', power: 55, anim: 'stink', text: '{u} smells of bin juice. It is unbearable.' },
  tantrum:    { name: 'Tantrum', type: 'street', power: 45, anim: 'shout', text: '{u} throws a full-volume tantrum.' },
  sausageroll:{ name: 'Sausage Roll', type: 'old', power: 0, effect: { heal: 0.35, usesHeld: true }, anim: 'heal', text: '{u} eats a sausage roll from his pocket.' },
  bounceball: { name: 'Bounce', type: 'plastic', power: 40, anim: 'hop', text: 'Tennis balls bounce everywhere. Some of them hit {t}.' },
  avalanche:  { name: 'Ball Avalanche', type: 'plastic', power: 60, anim: 'dig', text: 'The whole pile collapses onto {t}!' },
  sigh:       { name: 'Loud Sigh', type: 'old', power: 0, effect: { foeAtk: 1 }, anim: 'shout', text: '{u} sighs loudly. "This train is delayed AGAIN."' },
  briefcase:  { name: 'Briefcase Swing', type: 'leather', power: 50, anim: 'lunge', text: '{u} swings a leather briefcase!' },
  complain:   { name: 'Write To The Council', type: 'old', power: 55, anim: 'beam', text: '{u} composes a strongly worded letter.' },
  lidslam:    { name: 'Lid Slam', type: 'plastic', power: 45, anim: 'bite', text: '{u} slams its lid shut on {t}.' },
  recycle:    { name: 'Recycle', type: 'plastic', power: 0, effect: { heal: 0.35 }, anim: 'heal', text: '{u} reuses its own bits. Very sustainable.' },
  wrongbin:   { name: 'Wrong Bin', type: 'plastic', power: 55, anim: 'gust', text: 'Someone put a pizza box in {u}. It hurls it at {t}.' },
  stench:     { name: 'Stench', type: 'smelly', power: 50, anim: 'stink', text: '{u} opens its lid. The smell is a physical force.' },
  rolldown:   { name: 'Roll Down Driveway', type: 'steel', power: 50, anim: 'lunge', text: '{u} rolls down the driveway at speed!' },
  flies:      { name: 'Swarm of Flies', type: 'smelly', power: 40, effect: { foeDef: 1 }, anim: 'stink', text: 'A cloud of flies rises out of {u}.' },
  compost:    { name: 'Hot Compost', type: 'fire', power: 50, anim: 'flame', text: '{u} is warm and steaming. It throws some of it.' },
  rot:        { name: 'Rot', type: 'smelly', power: 0, effect: { heal: 0.3, selfDef: 1 }, anim: 'heal', text: '{u} quietly decomposes. It seems happier.' },
  swoop:      { name: 'Swoop', type: 'old', power: 60, anim: 'lunge', text: '{u} swoops at {t}\'s head!' },
  quack:      { name: 'Aggressive Quack', type: 'fire', power: 45, anim: 'shout', text: '{u} quacks with real menace.' },
  scoot2:     { name: 'Footpath Zoom', type: 'steel', power: 55, anim: 'lunge', text: '{u} zooms down the footpath at 25km/h!' },
  beep:       { name: 'Beep', type: 'steel', power: 0, effect: { foeDef: 1 }, anim: 'shout', text: '{u} beeps. Nobody moves.' },
  pokestick:  { name: 'Poke With Stick', type: 'street', power: 40, anim: 'lunge', text: '{u} found a stick. {u} pokes {t} with it.' },
  flatwhite:  { name: 'Flat White', type: 'old', power: 0, effect: { heal: 0.35, usesHeld: true }, anim: 'heal', text: '{u} takes a long sip of a flat white. Slightly calmer.' },
  jab:        { name: 'Beak Jab', type: 'street', power: 45, anim: 'lunge', text: '{u} jabs {t} with its beak.' },
  warble:     { name: 'Warble', type: 'old', power: 0, effect: { foeDef: 1 }, anim: 'shout', text: '{u} warbles beautifully. It is somehow a threat.' },
  binlid:     { name: 'Bin Dive', type: 'smelly', power: 50, anim: 'dig', text: '{u} dives into a bin and comes up swinging.' },
};

// The four moves each pet knows, by pet id.
export const PET_MOVES = {
  princess: ['growl', 'clawattack', 'humpbed', 'bite'],
  poppy: ['charge', 'scoot', 'dig', 'chew'],
  spooky: ['fadeout', 'nibble', 'hop', 'stretch'],
  stanley: ['bark', 'bitestan', 'claw', 'staredown'],
  salami: ['extendclaws', 'scratch', 'bluestring', 'hide'],
};
