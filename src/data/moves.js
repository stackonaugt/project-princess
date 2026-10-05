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
//              foeHeal: heals the TARGET by this fraction (Nonna feeding you)
//              recoil: the user loses this fraction of its own max HP (recoilText explains)
//   anim     the battle animation ('lunge', 'bite', 'claw', 'beam', 'shout', 'heal', 'fade', 'hop', 'dig', 'gust', 'stink', 'flame')
//   text     the line shown when it's used ({u} = user, {t} = target)
import { NORTH_MOVES } from './north.js';

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

  // Flamcess (Princess evolved, fire)
  flamegrowl: { name: 'Flame Growl', type: 'fire', power: 0, effect: { foeAtk: 1, foeDef: 1 }, anim: 'flame', text: '{u} growls, and her pom-poms flare up. Terrifying. Gorgeous.' },
  hotbite:    { name: 'Hot Bite', type: 'street', power: 65, anim: 'bite', text: '{u} bites. Her teeth are very, very warm.' },
  blazeclaws: { name: 'Blazing Claws', type: 'fire', power: 75, anim: 'claw', text: '{u} goes in claws first, and the claws are on fire.' },
  scorchbed:  { name: 'Scorched Bed', type: 'fire', power: 0, effect: { heal: 0.5 }, anim: 'heal', text: '{u} humps the nearest bed. It bursts into flames. She feels incredible.' },
  pompom:     { name: 'Pom-pom Inferno', type: 'fire', power: 90, effect: { recoil: 0.1 }, anim: 'flame', text: '{u} spins like a firework. Pom-poms everywhere. Fire everywhere.', recoilText: '{u} singed her own fringe a bit.' },
  // Floppy (Poppy evolved, plastic and rock)
  flopslam:   { name: 'Flop Slam', type: 'rock', power: 75, anim: 'hop', text: '{u} goes completely floppy and lands on {t}. All of her.' },
  squeak:     { name: 'Squeak', type: 'plastic', power: 60, anim: 'shout', text: '{u} squeaks like a dog toy. It is deafening.' },
  bubblewrap: { name: 'Bubble Wrap', type: 'plastic', power: 0, effect: { selfDef: 1, heal: 0.25 }, anim: 'heal', text: '{u} wraps herself in bubble wrap. Pop. Pop. Pop.' },

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
  swoop:      { name: 'Swoop', type: 'park', power: 60, anim: 'lunge', text: '{u} swoops at {t}\'s head!' },
  quack:      { name: 'Aggressive Quack', type: 'water', power: 45, anim: 'shout', text: '{u} quacks with real menace.' },
  scoot2:     { name: 'Footpath Zoom', type: 'steel', power: 55, anim: 'lunge', text: '{u} zooms down the footpath at 25km/h!' },
  beep:       { name: 'Beep', type: 'steel', power: 0, effect: { foeDef: 1 }, anim: 'shout', text: '{u} beeps. Nobody moves.' },
  pokestick:  { name: 'Poke With Stick', type: 'street', power: 40, anim: 'lunge', text: '{u} found a stick. {u} pokes {t} with it.' },
  flatwhite:  { name: 'Flat White', type: 'caffeine', power: 0, effect: { heal: 0.35, usesHeld: true }, anim: 'heal', text: '{u} takes a long sip of a flat white. Slightly calmer.' },
  jab:        { name: 'Beak Jab', type: 'street', power: 45, anim: 'lunge', text: '{u} jabs {t} with its beak.' },
  warble:     { name: 'Warble', type: 'old', power: 0, effect: { foeDef: 1 }, anim: 'shout', text: '{u} warbles beautifully. It is somehow a threat.' },
  // Brunswick: nonnas, designer dogs, the hipster's team
  woodenspoon:{ name: 'Wooden Spoon', type: 'old', power: 50, anim: 'lunge', text: '{u} brandishes the wooden spoon. Everyone remembers the wooden spoon.' },
  mangia:     { name: 'Mangia!', type: 'old', power: 0, effect: { foeHeal: 0.2, foeAtk: 1 }, anim: 'shout', text: '{u} feeds {t} a bowl of pasta. {t} is too polite to say no, and now too full to fight.' },
  lemonthrow: { name: 'Lemon Lob', type: 'fire', power: 45, anim: 'gust', text: '{u} lobs a lemon from her tree. It is very sour and very fast.' },
  guilttrip:  { name: 'Guilt Trip', type: 'psychic', power: 0, effect: { foeAtk: 1 }, anim: 'beam', text: '{u}: "You never visit." {t} feels terrible.' },
  yapyap:     { name: 'Yap Yap', type: 'fairy', power: 40, anim: 'shout', text: '{u} yaps. And yaps. And yaps.' },
  fluffup:    { name: 'Fluff Up', type: 'fairy', power: 0, effect: { selfDef: 1 }, anim: 'heal', text: '{u} fluffs up. It cost $300 at the groomer.' },
  pose:       { name: 'Pose', type: 'psychic', power: 0, effect: { foeAtk: 1 }, anim: 'shout', text: '{u} poses for its 40,000 followers. {t} feels inadequate.' },
  shot:       { name: 'Ristretto Shot', type: 'caffeine', power: 55, anim: 'flame', text: '{u} fires a ristretto so short it is basically a rumour.' },
  jitters:    { name: 'Jitters', type: 'caffeine', power: 0, effect: { selfAtk: 1 }, anim: 'shout', text: '{u} vibrates with caffeine.' },
  latteart:   { name: 'Latte Art', type: 'psychic', power: 0, effect: { foeDef: 1 }, anim: 'beam', text: '{u} pours a perfect tiny swan. {t} is mesmerised.' },
  starter:    { name: 'Starter Burp', type: 'smelly', power: 50, anim: 'stink', text: '{u} burps a cloud of wild yeast.' },
  prove:      { name: 'Prove', type: 'smelly', power: 0, effect: { heal: 0.2, selfDef: 1 }, anim: 'heal', text: '{u} sits somewhere warm and rises.' },
  crust:      { name: 'Crust', type: 'rock', power: 45, anim: 'lunge', text: '{u} attacks with a crust you could build a house with.' },
  bside:      { name: 'Obscure B-side', type: 'old', power: 55, anim: 'beam', text: '{u} plays a B-side you have definitely never heard of.' },
  scratchvinyl:{ name: 'Scratch', type: 'plastic', power: 45, anim: 'claw', text: '{u} scratches. Wikka wikka.' },
  actually:   { name: 'Actually...', type: 'old', power: 0, effect: { foeAtk: 1 }, anim: 'shout', text: '"Actually, it sounds warmer on vinyl." {t} loses the will to fight.' },
  // Reservoir: the bulldog next door, the golfer next door
  headbutt:   { name: 'Headbutt', type: 'rock', power: 55, anim: 'lunge', text: '{u} headbutts with a skull like a besser block.' },
  slobber:    { name: 'Slobber', type: 'smelly', power: 40, anim: 'stink', text: '{u} slobbers all over {t}.' },
  snore:      { name: 'Snore', type: 'rock', power: 0, effect: { heal: 0.3 }, anim: 'heal', text: '{u} falls asleep mid-battle. It snores. It feels better.' },
  fore:       { name: 'FORE!', type: 'plastic', power: 50, anim: 'lunge', text: 'FORE! {u} flies straight at {t}.' },
  slice:      { name: 'Slice', type: 'plastic', power: 40, anim: 'gust', text: '{u} slices badly. Somehow it still hits {t}.' },
  bunker:     { name: 'Bunker', type: 'plastic', power: 0, effect: { evade: true }, anim: 'fade', text: '{u} rolls into a bunker and hides.' },
  swing:      { name: 'Swing', type: 'steel', power: 55, anim: 'claw', text: '{u} takes a big swing.' },
  chip:       { name: 'Chip Shot', type: 'steel', power: 45, anim: 'hop', text: '{u} chips one up and over.' },
  practice:   { name: 'Practice Swing', type: 'steel', power: 0, effect: { selfAtk: 1 }, anim: 'shout', text: '{u} does three practice swings. Then a fourth.' },
  runover:    { name: 'Run Over', type: 'steel', power: 60, anim: 'lunge', text: '{u} trundles over {t} at 8km/h.' },
  nineteenth: { name: '19th Hole', type: 'old', power: 0, effect: { heal: 0.35 }, anim: 'heal', text: '{u} pops off to the 19th hole and comes back refreshed.' },
  // The stranger under the skyrail. Every drug hurts him more than anyone.
  haze:       { name: 'Haze', type: 'smelly', power: 30, effect: { foeAtk: 1, recoil: 0.25 }, anim: 'stink', text: 'He smokes. A thick haze rolls over {t}.', recoilText: 'His eyes glaze over. He is slow and foggy, and he knows it.' },
  paranoia:   { name: 'Paranoia', type: 'psychic', power: 35, effect: { recoil: 0.25 }, anim: 'beam', text: 'He gets scared and suspicious, and it spills over onto {t}.', recoilText: 'He is shaking. The fear is hurting him most.' },
  binge:      { name: 'Wired', type: 'street', power: 50, effect: { recoil: 0.3 }, anim: 'lunge', text: 'He has not slept in days. He lashes out at {t}.', recoilText: 'His heart is pounding far too fast. It is hurting him.' },
  comedown:   { name: 'Comedown', type: 'street', power: 25, effect: { recoil: 0.35 }, anim: 'shout', text: 'He crashes. He snaps at {t}, then folds in on himself.', recoilText: 'He is exhausted and miserable. This is what the drug does.' },
  // Rusty (speed)
  shakeleaf:  { name: 'Shake Like a Leaf', type: 'speed', power: 0, effect: { foeAtk: 1 }, anim: 'shout', text: '{u} shakes like a leaf. {t} feels far too guilty to hit hard.' },
  jumponyou:  { name: 'Jump On You', type: 'speed', power: 60, anim: 'hop', text: '{u} launches from nowhere and lands right on {t}. All legs.' },
  clawrusty:  { name: 'Claw', type: 'street', power: 45, anim: 'claw', text: '{u} swipes with long, skinny toes.' },
  runaway:    { name: 'Run Away', type: 'speed', power: 0, effect: { evade: true }, anim: 'fade', text: '{u} zooms off at 60km/h. Good luck catching that.' },
  barkrusty:  { name: 'Bark', type: 'speed', power: 40, anim: 'shout', text: '{u} lets out one sharp, surprisingly loud bark.' },
  // Water, park, caffeine and booze
  splash:     { name: 'Splash', type: 'water', power: 45, anim: 'gust', text: '{u} splashes {t}. Right in the face.' },
  hosedown:   { name: 'Hose Down', type: 'water', power: 60, anim: 'beam', text: '{u} turns the hose on {t}. Full blast.' },
  puddle:     { name: 'Puddle', type: 'water', power: 0, effect: { foeDef: 1 }, anim: 'dig', text: '{u} makes a puddle. {t} steps in it. Wet socks all day.' },
  sprinkle:   { name: 'Tick Tick Tick', type: 'water', power: 0, effect: { heal: 0.3 }, anim: 'heal', text: '{u} ticks round in a circle. Everything feels fresh.' },
  gumnut:     { name: 'Gum Nut', type: 'park', power: 45, anim: 'gust', text: '{u} drops a gum nut on {t}. Bonk.' },
  scurry:     { name: 'Roof Scurry', type: 'park', power: 55, anim: 'lunge', text: '{u} thunders across the roof at 3am and lands on {t}.' },
  hissp:      { name: 'Possum Hiss', type: 'park', power: 0, effect: { foeAtk: 1 }, anim: 'shout', text: '{u} makes the noise. You know the noise. Nobody sleeps.' },
  rosebush:   { name: 'Eat The Roses', type: 'park', power: 0, effect: { heal: 0.35 }, anim: 'heal', text: '{u} eats somebody\'s prize roses. Delicious.' },
  doubleshot: { name: 'Double Shot', type: 'caffeine', power: 55, anim: 'lunge', text: '{u} hits {t} twice. Very fast. Then once more for no reason.' },
  milkfroth:  { name: 'Froth', type: 'caffeine', power: 40, anim: 'gust', text: '{u} froths at {t}. Microfoam everywhere.' },
  extrashot:  { name: 'Extra Shot', type: 'caffeine', power: 0, effect: { selfAtk: 1, heal: 0.15 }, anim: 'heal', text: '{u} adds an extra shot. Its eye twitches.' },
  hiccup:     { name: 'Hiccup', type: 'booze', power: 40, anim: 'shout', text: '{u} hiccups so hard it bounces into {t}.' },
  slosh:      { name: 'Slosh', type: 'booze', power: 60, effect: { recoil: 0.1 }, anim: 'lunge', text: '{u} sloshes all over {t}.', recoilText: '{u} is a bit wobbly now.' },
  silverpillow:{ name: 'Silver Pillow', type: 'booze', power: 0, effect: { heal: 0.35 }, anim: 'heal', text: '{u} lies down. It is very comfy. It is a pillow, technically.' },
  beergoggles:{ name: 'Beer Goggles', type: 'booze', power: 0, effect: { foeDef: 1 }, anim: 'beam', text: '{u} looks at {t} through beer goggles. {t} gets all self-conscious.' },
  binlid:     { name: 'Bin Dive', type: 'smelly', power: 50, anim: 'dig', text: '{u} dives into a bin and comes up swinging.' },
};

// The four moves each pet knows, by pet id.
export const PET_MOVES = {
  princess: ['growl', 'clawattack', 'humpbed', 'bite'],
  poppy: ['charge', 'scoot', 'dig', 'chew'],
  spooky: ['fadeout', 'nibble', 'hop', 'stretch'],
  stanley: ['bark', 'bitestan', 'claw', 'staredown'],
  salami: ['extendclaws', 'scratch', 'bluestring', 'hide'],
  rusty: ['shakeleaf', 'jumponyou', 'clawrusty', 'runaway', 'barkrusty'],
};

Object.assign(MOVES, NORTH_MOVES);   // Coburg and Preston
