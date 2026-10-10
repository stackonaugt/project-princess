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
import { BATTLER_MOVES } from './battlers.js';
import { EAST_MOVES } from './east.js';

import { SH_MOVES } from './summerhill.js';

import { authoredValue } from '../authoring/overrides.js';
export let MOVES = {
  smellpoo: { name: 'Smelly poo', type: 'smelly', power: 35, anim: 'stink', text: '{u} proudly shares the smell of something he found on the walk. {t} regrets having a nose.' },
  gordonfood: { name: 'Human Food from Gordon', type: 'street', power: 0, effect: { heal: 0.3 }, anim: 'heal', text: 'Gordon slips {u} a little snack. Energy restored. Trish saw that, Gordon.' },
  // Princess (fairy)
  crownclaw: { name: 'Crown Claw', type: 'fairy', power: 70, anim: 'claw', text: '{u} delivers a precise, royal swipe.' },
  queensdecree: { name: 'Queen’s Decree', type: 'fairy', power: 0, effect: { foeAtk: 2, selfDef: 1 }, anim: 'shout', text: '{u} issues one small, very firm decree. {t} loses confidence; {u} stands tall.' },
  royalrest: { name: 'Royal Rest', type: 'fairy', power: 0, effect: { heal: .45 }, anim: 'heal', text: '{u} settles on an imaginary throne and recovers her energy.' },
  royalwave: { name: 'Royal Wave', type: 'fairy', power: 90, anim: 'beam', text: '{u} sends a glittering royal wave across the room.' },
  growl:      { name: 'Growl', type: 'fairy', power: 0, effect: { foeAtk: 1 }, anim: 'shout', text: '{u} growls. It is tiny. It is terrifying.' },
  clawattack: { name: 'Claw Attack', type: 'fairy', power: 45, anim: 'claw', text: '{u} goes in claws first!' },
  humpbed:    { name: 'Hump Bed', type: 'fairy', power: 0, effect: { heal: 0.4 }, anim: 'bed', text: '{u} humps the nearest bed with great dignity. She feels refreshed.' },
  bite:       { name: 'Bite', type: 'street', power: 55, anim: 'bite', text: '{u} bites!' },
  // Poppy (rock)
  charge:     { name: 'Charge', type: 'rock', power: 60, anim: 'lunge', text: '{u} charges in head first. No plan. Pure commitment.' },
  scoot:      { name: 'Scoot', type: 'rock', power: 0, effect: { heal: 0.4 }, anim: 'heal', text: '{u} scoots across the carpet. Everyone is uncomfortable, but she feels better.' },
  dig:        { name: 'Dig', type: 'rock', power: 50, anim: 'dig', text: '{u} digs under and pops up beneath {t}!' },
  chew:       { name: 'Chew', type: 'leather', power: 35, effect: { destroyItem: true }, anim: 'bite', text: '{u} chews on {t}. And on anything {t} was holding.' },
  // Spooky (ghost)
  ghosthop: { name: 'Ghost Hop', type: 'ghost', power: 75, anim: 'hop', text: '{u} hops through a shadow and reappears beside {t}.' },
  ghostbeam: { name: 'Spectral Wave', type: 'ghost', power: 85, effect: { drain: .25 }, anim: 'beam', text: '{u} sends a pale spectral wave through {t}, gathering energy as it returns.' },
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
  scorchbed:  { name: 'Scorched Bed', type: 'fire', power: 0, effect: { heal: 0.5 }, anim: 'burnbed', text: '{u} humps the nearest bed. It bursts into flames. She feels incredible.' },
  pompom:     { name: 'Pom-pom Inferno', type: 'fire', power: 90, effect: { recoil: 0.1 }, anim: 'flame', text: '{u} spins like a firework. Pom-poms everywhere. Fire everywhere.', recoilText: '{u} singed her own fringe a bit.' },
  // Floppy (Poppy evolved, plastic and rock)
  flopslam:   { name: 'Flop Slam', type: 'rock', power: 75, anim: 'hop', text: '{u} goes completely floppy and lands on {t}. All of her.' },
  squeak:     { name: 'Squeak', type: 'plastic', power: 60, anim: 'shout', text: '{u} squeaks like a dog toy. It is deafening.' },
  bubblewrap: { name: 'Bubble Wrap', type: 'plastic', power: 0, effect: { selfDef: 1, heal: 0.25 }, anim: 'heal', text: '{u} wraps herself in bubble wrap. Pop. Pop. Pop.' },
  // Sopressa (Salami evolved, street and old)
  agedclaws:  { name: 'Aged Claws', type: 'street', power: 75, anim: 'claw', text: '{u} swipes with claws that have seen things. Many things.' },
  grumble:    { name: 'Grumble', type: 'old', power: 0, effect: { foeAtk: 1, foeDef: 1 }, anim: 'shout', text: '{u} grumbles about the price of sardines. {t} feels personally responsible.' },
  cured:      { name: 'Cured', type: 'old', power: 0, effect: { heal: 0.45, selfDef: 1 }, anim: 'heal', text: '{u} hangs in a cool dark cupboard for a bit. Matured. Improved.' },
  backinmyday:{ name: 'Back In My Day', type: 'old', power: 80, anim: 'beam', text: '"Back in my day, Sydney Rd had one cafe." {u} goes on. And on. {t} wilts.' },
  // Poltergeist Spooky (Spooky evolved, ghost and psychic)
  possess:    { name: 'Possess', type: 'ghost', power: 80, anim: 'fade', text: '{u} floats straight into {t}. For a moment {t} really fancies a carrot.' },
  rattlechains:{ name: 'Rattle Chains', type: 'ghost', power: 0, effect: { foeAtk: 1, foeDef: 1 }, anim: 'shout', text: 'Somewhere, chains rattle. The lights flicker. {t} wants to go home.' },
  flicker:    { name: 'Flicker', type: 'psychic', power: 0, effect: { evade: true, heal: 0.2 }, anim: 'fade', text: '{u} flickers like a dodgy fluoro tube and is suddenly somewhere else.' },
  hauntedcarrot:{ name: 'Haunted Carrot', type: 'psychic', power: 70, effect: { drain: 0.4 }, anim: 'beam', text: 'A carrot floats up by itself and bonks {t}. {u} eats it afterwards.' },
  // Centurionely (Stanley evolved, steel)
  pilum:      { name: 'Pilum', type: 'steel', power: 75, anim: 'lunge', text: '{u} hurls a little Roman javelin. It is beautifully made.' },
  testudo:    { name: 'Testudo', type: 'steel', power: 0, effect: { selfDef: 1, heal: 0.3 }, anim: 'heal', text: '{u} forms a tortoise of shields. It is one dog, but the formation is perfect.' },
  venividivici:{ name: 'Veni Vidi Vici', type: 'steel', power: 95, effect: { recoil: 0.1 }, anim: 'claw', text: '{u} came. {u} saw. {u} conquered {t}.', recoilText: '{u} pulled something in his little sandals.' },
  // Steely (Rusty evolved, steel). Slice and Dice and Rust Cloud are kept for old saves and the Studio.
  dangerpaws: { name: 'Danger Paws', type: 'steel', power: 90, anim: 'claw', text: '{u} flashes four steel paws at {t}. Danger. Paws.' },
  sharpen:    { name: 'Sharpen', type: 'steel', power: 0, effect: { selfAtk: 2 }, anim: 'heal', text: '{u} sharpens his claws on the Colorbond. Shing. His attack rises sharply.' },
  // Muddy (Girlie evolved, dirt and water)
  muddypaws:  { name: 'Muddy Paws', type: 'dirt', power: 80, anim: 'lunge', text: '{u} jumps up on {t} with four muddy paws. That will not come out in the wash.' },
  puddlejump: { name: 'Puddle Jump', type: 'water', power: 75, anim: 'lunge', text: '{u} lands in a puddle right next to {t}. Everyone is soaked.' },
  shakeoff:   { name: 'Shake Off', type: 'dirt', power: 0, effect: { foeAtk: 1, foeDef: 1 }, anim: 'gust', text: '{u} shakes from nose to tail. Mud goes everywhere, mostly on {t}.' },
  dirtnap:    { name: 'Dirt Nap', type: 'dirt', power: 0, effect: { heal: 0.4 }, anim: 'bed', text: '{u} flops into a cool patch of mud for a snooze. Bliss.' },
  // Even Rustier's old moves (Rusty evolved, steel and speed)
  sliceanddice:{ name: 'Slice and Dice', type: 'steel', power: 85, anim: 'claw', text: '{u} goes through {t} like a mandoline through a zucchini.' },
  turbozoom:  { name: 'Turbo Zoom', type: 'speed', power: 80, anim: 'lunge', text: '{u} hits 90km/h on the athletics track and forgets to stop.' },
  rustcloud:  { name: 'Rust Cloud', type: 'steel', power: 0, effect: { foeDef: 1, foeAtk: 1 }, anim: 'gust', text: '{u} shakes off a cloud of rust flakes. {t} gets them in its eyes.' },
  oilchange:  { name: 'Oil Change', type: 'steel', power: 0, effect: { heal: 0.4, selfAtk: 1 }, anim: 'heal', text: '{u} pulls into a pit stop. Fresh oil. Purring.' },

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
  // The "Sorry I missed you" card (Julie's tutorial battle): deliberately feeble
  papercut:   { name: 'Paper Cut', type: 'plastic', power: 18, anim: 'claw', text: '{u} gives {t} a paper cut. Tiny. Surprisingly rude.' },
  guilttrip:  { name: 'Guilt Trip', type: 'psychic', power: 0, effect: { foeAtk: 1 }, anim: 'shout', text: '"We knocked, but you weren\'t home." {t} feels a bit bad.' },
  flapinwind: { name: 'Flap in the Wind', type: 'plastic', power: 12, anim: 'gust', text: '{u} flaps about in the breeze, mostly by accident.' },
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
  // Carlton and the city
  mine:       { name: 'Mine! Mine!', type: 'water', power: 0, effect: { foeAtk: 1 }, anim: 'shout', text: '{u} screams MINE MINE MINE. {t} drops everything.' },
  coo:        { name: 'Coo', type: 'psychic', power: 0, effect: { foeDef: 1 }, anim: 'shout', text: '{u} coos and bobs its head. {t} cannot look away.' },
  bigmap:     { name: 'Unfold Map', type: 'old', power: 0, effect: { evade: true }, anim: 'fade', text: '{u} unfolds an enormous paper map. Nobody can see anything.' },
  selfiestick:{ name: 'Selfie Stick', type: 'steel', power: 50, anim: 'lunge', text: '{u} swings a selfie stick round for the perfect angle. Bonk.' },
  directions: { name: 'Ask Directions', type: 'psychic', power: 45, anim: 'beam', text: '{u} asks {t} the way to "the famous laneway". Twice. {t} is exhausted.' },
  gateslam:   { name: 'Gate Slam', type: 'steel', power: 55, anim: 'bite', text: 'The gates snap shut on {t}. Touch on next time.' },
  invalidcard:{ name: 'Card Invalid', type: 'psychic', power: 0, effect: { foeAtk: 1 }, anim: 'shout', text: '"Please touch card again." {t} touches. "Card invalid." {t} loses the will to live.' },
  redtape:    { name: 'Red Tape', type: 'plastic', power: 45, anim: 'claw', text: '{u} wraps {t} in red tape. Form 7B, in triplicate. Unbearable.' },
  triplicate: { name: 'File in Triplicate', type: 'old', power: 0, effect: { heal: 0.3, selfDef: 1 }, anim: 'heal', text: '{u} files itself in triplicate. It feels very official.' },
  napoletana: { name: 'Napoletana', type: 'fire', power: 55, anim: 'flame', text: '{u} splashes hot napoletana sauce all over {t}.' },
  meatroll:   { name: 'Off the Plate', type: 'rock', power: 50, anim: 'lunge', text: '{u} rolls off the plate, across the table and into {t}.' },
  garlicbreath:{ name: 'Garlic Breath', type: 'smelly', power: 55, anim: 'stink', text: '{u} breathes on {t}. Nobody will kiss {t} for a week.' },
  extrabutter:{ name: 'Extra Butter', type: 'smelly', power: 0, effect: { heal: 0.2, selfDef: 1 }, anim: 'heal', text: '{u} gets another coat of butter. Glistening.' },
  tag:        { name: 'Tag', type: 'street', power: 55, anim: 'beam', text: '{u} tags {t}. It is a pretty good tag, honestly.' },
  fumes:      { name: 'Fumes', type: 'smelly', power: 40, effect: { foeDef: 1 }, anim: 'stink', text: '{u} sprays. The fumes make {t}\'s eyes water.' },
  rattle:     { name: 'Rattle', type: 'plastic', power: 0, effect: { selfAtk: 1 }, anim: 'shout', text: 'Clack clack clack. {u} shakes itself up.' },
  binlid:     { name: 'Bin Dive', type: 'smelly', power: 50, anim: 'dig', text: '{u} dives into a bin and comes up swinging.' },
  // Girlie (water/park)
  fetch:      { name: 'Fetch', type: 'park', power: 55, anim: 'lunge', text: '{u} bolts after a stick nobody threw and brings back {t} instead.' },
  fountaindive:{ name: 'Fountain Dive', type: 'water', power: 60, anim: 'gust', text: '{u} leaps into the fountain, climbs out and shakes off all over {t}.' },
  puppyeyes:  { name: 'Puppy Eyes', type: 'psychic', power: 0, effect: { foeAtk: 1 }, anim: 'beam', text: '{u} does the eyes. {t} cannot bring itself to hit hard.' },
  benchsnack: { name: 'Bench Snack', type: 'park', power: 0, effect: { heal: 0.4 }, anim: 'heal', text: '{u} finds half a sandwich under a bench and eats it in one go. She feels amazing.' },
  ...SH_MOVES,
};

// The four moves each pet knows, by pet id.
// Chloe's moves (Brunswick East).
MOVES.herd = { name: 'Herd', type: 'park', power: 0, effect: { foeAtk: 1, foeDef: 1 }, anim: 'lunge', text: '{u} circles {t} and moves it exactly where she wants it.' };
MOVES.kelpiestare = { name: 'Kelpie Stare', type: 'psychic', power: 60, anim: 'beam', text: '{u} fixes {t} with the stare. Nothing moves for a moment.' };
MOVES.heelnip = { name: 'Heel Nip', type: 'street', power: 50, anim: 'bite', text: '{u} nips at {t}\'s heels. Keep moving.' };
MOVES.pubnap = { name: 'Pub Nap', type: 'old', power: 0, effect: { heal: 0.4 }, anim: 'heal', text: '{u} climbs onto the bench seat and has a nap. Pub rules.' };

// Ziggy and Emilio, and the Premier's lot
Object.assign(MOVES, {
  longlife:   { name: 'Long Life', type: 'fairy', power: 0, effect: { heal: 0.3 }, anim: 'heal', text: '{u} stretches out. A long, long life. Very healing.' },
  fortune:    { name: 'Fortune Told', type: 'psychic', power: 55, anim: 'beam', text: '{u} tells {t}\'s fortune. It is not a good one.' },
  heartbreak: { name: 'Heartbreak', type: 'fairy', power: 60, anim: 'beam', text: '{u} reveals {t} will meet a tall, dark stranger. Who will leave. {t} is devastated.' },
  foresee:    { name: 'Foresee', type: 'psychic', power: 0, effect: { evade: true }, anim: 'fade', text: '{u} saw that coming. Literally.' },
  rollup:     { name: 'Roll Up', type: 'steel', power: 60, anim: 'lunge', text: '{u} trundles across the green and stops right against {t}. Perfect weight.' },
  spookyhowl: { name: 'Spooky Howl', type: 'ghost', power: 55, anim: 'shout', text: '{u} howls down the empty platform. The lights flicker.' },
  phasebite:  { name: 'Phase Bite', type: 'ghost', power: 60, anim: 'bite', text: '{u} bites straight through {t}. Then through the wall.' },
  talkingpoints:    { name: 'Talking Points', type: 'psychic', power: 55, anim: 'beam', text: '{u} repeats the same three sentences until {t} loses the will to live.' },
  background:       { name: 'Background Briefing', type: 'psychic', power: 0, effect: { foeAtk: -1 }, anim: 'shout', text: '{u} leaks something unflattering about {t} to a friendly journalist.' },
  questiononnotice: { name: 'Question On Notice', type: 'psychic', power: 0, effect: { evade: true }, anim: 'fade', text: '{u} takes the question on notice. Nobody will ever hear the answer.' },
  dorothy:          { name: 'Dorothy Dixer', type: 'old', power: 60, anim: 'shout', text: '{u} asks the Premier how good the Premier is. The answer goes on for twenty minutes. {t} is crushed.' },
  toetheline:       { name: 'Toe The Line', type: 'steel', power: 0, effect: { selfDef: 2 }, anim: 'shout', text: '{u} votes exactly as told. Nothing can get through to it now.' },
  announceable:     { name: 'Announceable', type: 'steel', power: 75, anim: 'beam', text: '{u} announces a brand new project in front of a hard hat and a hi-vis vest. It lands on {t}.' },
  costblowout:      { name: 'Cost Blowout', type: 'plastic', power: 90, effect: { recoil: 0.2 }, recoilText: 'The bill lands on {u} too. Somebody always pays.', anim: 'lunge', text: '{u} goes ten billion dollars over budget, straight into {t}.' },
  reboot:           { name: 'Reboot', type: 'steel', power: 0, effect: { heal: 0.35 }, anim: 'heal', text: '{u} goes quiet, beeps twice and comes back on message.' },
  zoomcat:      { name: 'Midnight Zoomies', type: 'speed', power: 60, anim: 'lunge', text: '{u} tears across the room at 3am speed and bowls straight into {t}.' },
  barkziggy:    { name: 'Borrowed Bark', type: 'leather', power: 55, anim: 'shout', text: '{u} lets out a bark. A real dog bark. He learned it from the dogs. {t} is very confused.' },
  helpfrommads: { name: 'Help from Mads', type: 'fairy', power: 0, effect: { heal: 0.5 }, anim: 'heal', text: 'A warm feeling settles over {u}, like a hand on his back. Help from Mads. He feels much better.' },
  quack:        { name: 'Almighty Quack', type: 'water', power: 55, anim: 'shout', text: '{u} lets out a quack so loud the whole lake goes quiet.' },
  hattip:       { name: 'Tip of the Hat', type: 'old', power: 0, effect: { selfDef: 1, selfAtk: 1 }, anim: 'shout', text: '{u} tips his little top hat. A gentleman is always ready.' },
  paddle:       { name: 'Paddle Slap', type: 'water', power: 65, anim: 'lunge', text: '{u} slaps {t} with a big orange foot.' },
  breadcrumbs:  { name: 'Breadcrumbs', type: 'park', power: 0, effect: { heal: 0.35 }, anim: 'heal', text: '{u} finds some breadcrumbs in his hat. Delicious. He feels better.' },
});

// Evolved moves for BIG MART, Chlo-nado and Ziggy Iggy.
Object.assign(MOVES, {
  towerover: { name: 'Tower Over', type: 'smelly', power: 60, effect: { foeAtk: 1 }, anim: 'lunge', text: '{u} stands up to full height. {t} has to look up. And up.' },
  twister: { name: 'Twister', type: 'speed', power: 70, anim: 'gust', text: '{u} spins into a whirlwind and herds {t} straight off its feet.' },
  piggyback: { name: 'Piggyback', type: 'speed', power: 65, anim: 'lunge', text: '{u} charges at {t} with Iggy hanging on and squealing.' },
  babygiggle: { name: 'Baby Giggle', type: 'fairy', power: 0, effect: { foeAtk: 1, heal: 0.15 }, anim: 'heal', text: 'Iggy giggles. {t} cannot bring itself to fight properly, and {u} feels better.' },
});

export let PET_MOVES = {
  marty: ['smellpoo', 'bite', 'growl', 'gordonfood'],
  princess: ['growl', 'clawattack', 'humpbed', 'bite'],
  poppy: ['charge', 'scoot', 'dig', 'chew'],
  spooky: ['fadeout', 'nibble', 'hop', 'stretch'],
  stanley: ['bark', 'bitestan', 'claw', 'staredown'],
  salami: ['extendclaws', 'scratch', 'bluestring', 'hide'],
  girlie: ['fetch', 'fountaindive', 'puppyeyes', 'benchsnack'],
  rusty: ['shakeleaf', 'jumponyou', 'clawrusty', 'runaway', 'barkrusty'],
  chloe: ['herd', 'kelpiestare', 'heelnip', 'pubnap'],
  ziggy: ['zoomcat', 'scratch', 'barkziggy', 'helpfrommads'],
  emilio: ['quack', 'hattip', 'paddle', 'breadcrumbs'],
};

Object.assign(MOVES, NORTH_MOVES);   // Coburg and Preston
Object.assign(MOVES, BATTLER_MOVES);   // battlers.js
Object.assign(MOVES, EAST_MOVES);    // Brunswick East
MOVES = authoredValue('data/moves.js', 'MOVES', MOVES);
PET_MOVES = authoredValue('data/moves.js', 'PET_MOVES', PET_MOVES);
