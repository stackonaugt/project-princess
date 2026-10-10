// Treats and trinkets. Pets have favourites (see pets.js). Icons are drawn in
// src/art/paint/items.js, or swap in assets/sprites/items/<id>.png
// price: what a shop charges, in dollars.
//   crop: true    grown in the garden (data/crops.js)
//   drink: true   from the bottle shop. For friends only, never for pets.
//                 art: { kind: can | stubby | longneck | wine | cask, body, label, cap }
//   gift: true    a present for friends (books, plants...). Not a pet treat.
//   farm: true    used on garden beds (fertiliser) or for fishing (bait). Not a pet treat.
//   book: true    a novel from Brunswick Bound (also gift: true). art: { cover, band }
//   lolly: true   American lollies from the Plenty Rd convenience store (also gift: true).
//   vape: true    vapes from the same shop, adults only (also gift: true). Both use `art` like drinks:
//                 art: { kind: packet | vape, body, label, cap }
//   story: true   a story item (the fish pie). deco: true  party decorations. Neither is a treat or a present.
//   record: true  vinyl from Wax Lyrical, Lygon St (also gift: true). art: { cover, band }
//   fish: true    caught fishing (a treat pets eat). sell: what James pays. junk: true for old boots
import { NORTH_ITEMS } from './north.js';
import { SH_ITEMS } from './summerhill.js';

import { authoredValue } from '../authoring/overrides.js';
export let ITEMS = {
  chicken:   { name: 'Chicken necky', price: 6,      desc: 'A crunchy dog treat. Smells incredible if you are a dog.' },
  sardine:   { name: 'Sardine', price: 6,            desc: 'One whole sardine. Oily, shiny, beloved.' },
  carrot:    { name: 'Carrot', price: 3, crop: true,             desc: 'A garden carrot with the leafy top still on.' },
  cheese:    { name: 'Cheese stick', price: 4,       desc: 'Individually wrapped. Very fancy.' },
  snag:      { name: 'Sausage in bread', price: 5,   desc: 'From the hardware barn sausage sizzle. Onions on the bottom, as is correct.' },
  croissant: { name: 'Almond croissant', price: 7,   desc: 'From a Sydney Rd cafe. Costs about as much as a small car.' },
  lemon:     { name: 'Backyard lemon', price: 2,     desc: 'Every Reservoir backyard has a lemon tree. This is proof.' },
  tennis:    { name: 'Tennis ball', price: 4,        desc: 'Slightly damp. Nobody knows why.' },
  ribbon:    { name: 'Pink ribbon', price: 8,        desc: 'Perfect for a pom-pom.' },
  duckfeather: { name: 'Duck feather', price: 4,   desc: 'Soft, brown and a bit damp. A thank you from the ducks.' },
  feather:   { name: 'Magpie feather', price: 6,     desc: 'Dropped mid-swoop. A trophy of survival.' },
  pear:      { name: 'Pear', price: 3, art: { kind: 'pear', body: '#c8d050', label: '#3f8a3e' }, desc: 'From Pearman. Do not ask where he has been keeping it. Actually, he will tell you anyway.' },
  pancit:    { name: 'Pancit', price: 8, gift: true, art: { kind: 'plate', body: '#e8c878', label: '#3f8a3e', cap: '#f4f0e6' }, desc: 'Tita Liza\'s pancit bihon. Long noodles, for a long life. Still warm.' },
  manoush:   { name: 'Manoush', price: 6, gift: true, art: { kind: 'plate', body: '#d8a850', label: '#3f8a3e', cap: '#e8d8b0' }, desc: 'Lebanese flatbread with za\'atar and oil, still warm, from Sydney Rd. Slinks swears by it.' },
  bread:     { name: 'Stale bread', price: 2, art: { kind: 'cake', body: '#e8c888', cap: '#b8803a', label: '#d8a860' }, desc: 'Half a loaf, gone hard. Not good for ducks, really. Although some ducks know what to do with it.' },
  golfball:  { name: 'Golf ball', price: 5, gift: true, art: { kind: 'ball', body: '#f4f4f0', label: '#c8c8c0' }, desc: 'Found in the long grass. Pearman will want it. Pearman always wants one more.' },
  // Crops you grow (crop: true). Sold at James's; see data/crops.js. Carrot above is also a crop.
  basil:      { name: 'Basil', crop: true,      desc: 'A fragrant bunch. Smells like summer and Nonna.' },
  zucchini:   { name: 'Zucchini', crop: true,   desc: 'One of many. So, so many.' },
  potato:     { name: 'Potato', crop: true,     desc: 'Dirt still on it. Poppy dug it up with enthusiasm.' },
  tomato:     { name: 'Tomato', crop: true,     desc: 'Sun-warm and perfect. Nonna would grudgingly approve.' },
  strawberry: { name: 'Strawberry', crop: true, desc: 'Sweet and red. Princess is watching you hold it.' },
  chilli:     { name: 'Chilli', crop: true,     desc: 'Hot. Fire-type pets go wild for them.' },
  pumpkin:    { name: 'Pumpkin', crop: true,    desc: 'Enormous. A whole battle\'s worth of energy.' },

  // Presents for friends (gift: true). Sold at James's (Reservoir) and Bunnings (Altona North).
  paperback:  { name: 'Secondhand paperback', price: 5, gift: true, desc: 'From James\'s book swap shelf. Someone has underlined all the good bits.' },
  byzbook:    { name: 'Byzantium: A History', price: 14, gift: true, desc: 'Nine hundred pages of emperors, mosaics and very complicated hats.' },
  modeltrain: { name: 'Model Comeng train', price: 16, gift: true, desc: 'A tiny silver Comeng. The doors open. Tim would lose his mind.' },
  flowers:    { name: 'Bunch of flowers', price: 6, gift: true, desc: 'Wrapped in newspaper. A bit of everything.' },
  icedcoffee: { name: 'Iced coffee carton', price: 4, gift: true, desc: 'Big, sweet and cold. Fuel for a thesis.' },
  gaytime:    { name: 'Golden Gaytime', price: 3, gift: true, desc: 'From the back freezer. A national treasure.' },
  seedling:   { name: 'Native seedling', price: 4, gift: true, desc: 'A baby bottlebrush in a tube. The bees will thank you.' },
  olive:      { name: 'Potted olive tree', price: 15, gift: true, desc: 'Grey-green and ancient looking. Every nonna\'s favourite tree.' },
  gloves:     { name: 'Gardening gloves', price: 6, gift: true, desc: 'Sturdy, green, and already a bit muddy somehow.' },
  fertiliser: { name: 'Fertiliser', price: 5, farm: true, desc: 'Blood and bone. Use it when you water a bed: one extra day of growth.' },

  // Brunswick Bound (book: true): classics and the latest hits. Presents for friends.
  // art: { cover, band } colours for the icon.
  prideprejudice: { name: 'Pride and Prejudice', price: 18, gift: true, book: true, art: { cover: '#e8d8b0', band: '#7a2a3a' }, desc: 'Jane Austen. Everyone is very polite and very cross.' },
  middlemarch:    { name: 'Middlemarch', price: 22, gift: true, book: true, art: { cover: '#3a5a7a', band: '#e8c040' }, desc: 'George Eliot. Eight hundred pages of a small town having feelings.' },
  janeeyre:       { name: 'Jane Eyre', price: 18, gift: true, book: true, art: { cover: '#2a2a30', band: '#c8443a' }, desc: 'Charlotte Bronte. Never trust a man with a locked attic.' },
  nineteen84:     { name: 'Nineteen Eighty-Four', price: 18, gift: true, book: true, art: { cover: '#c8302a', band: '#f4f4f0' }, desc: 'George Orwell. Big Brother is watching. So is the council.' },
  monkeygrip:     { name: 'Monkey Grip', price: 20, gift: true, book: true, art: { cover: '#e8823a', band: '#2a2a30' }, desc: 'Helen Garner. Carlton share houses, swimming pools, heartbreak. Very Melbourne.' },
  cloudstreet:    { name: 'Cloudstreet', price: 22, gift: true, book: true, art: { cover: '#7ab0d8', band: '#f4efe0' }, desc: 'Tim Winton. Two families, one big house, a talking pig.' },
  hangingrock:    { name: 'Picnic at Hanging Rock', price: 18, gift: true, book: true, art: { cover: '#d8c090', band: '#5a7a3a' }, desc: 'Joan Lindsay. A school picnic goes very, very wrong.' },
  boyswallows:    { name: 'Boy Swallows Universe', price: 26, gift: true, book: true, art: { cover: '#2a8ad8', band: '#e8c040' }, desc: 'Trent Dalton. Brisbane, crime, a big heart.' },
  thedry:         { name: 'The Dry', price: 24, gift: true, book: true, art: { cover: '#e8a050', band: '#5a2a1a' }, desc: 'Jane Harper. A drought, a small town and a murder.' },
  lessonschem:    { name: 'Lessons in Chemistry', price: 26, gift: true, book: true, art: { cover: '#e8c040', band: '#c8302a' }, desc: 'Bonnie Garmus. A chemist hosts a cooking show. Science wins.' },
  tomorrows:      { name: 'Tomorrow, and Tomorrow, and Tomorrow', price: 26, gift: true, book: true, art: { cover: '#f0a0b8', band: '#2a6ab8' }, desc: 'Gabrielle Zevin. Two friends, thirty years, a lot of video games.' },
  intermezzo:     { name: 'Intermezzo', price: 28, gift: true, book: true, art: { cover: '#a8c890', band: '#1e1e24' }, desc: 'Sally Rooney. Brothers, chess and complicated feelings.' },
  fourthwing:     { name: 'Fourth Wing', price: 28, gift: true, book: true, art: { cover: '#1e1e24', band: '#e8a030' }, desc: 'Rebecca Yarros. Dragons. Romance. More dragons.' },

  // Carlton and the city. Treats with local: true are only sold at their own shop
  // (not Romey's pet shop). Their icons are drawn from art (kinds: cone, donut, cup, chips, packet).
  gelato:     { name: 'Dog gelato', price: 6, local: true, art: { kind: 'cone', body: '#e8c870', label: '#d8a050', cap: '#8a5a32' }, desc: 'Gina\'s pup-safe gelato. Peanut butter and banana, no sugar. The dogs do not know.' },
  jamdonut:   { name: 'Hot jam donut', price: 4, local: true, art: { kind: 'donut', body: '#d8a050', label: '#c8302a', cap: '#f4f0e6' }, desc: 'From the van at Queen Vic. The jam is the temperature of the sun.' },
  hotchips:   { name: 'Hot chips', price: 5, local: true, art: { kind: 'chips', body: '#c8302a', label: '#f4d070', cap: '#f4f0e6' }, desc: 'Chicken salt, obviously. Guard them from seagulls with your life.' },
  gelatocone: { name: 'Gelato cone', price: 6, gift: true, art: { kind: 'cone', body: '#8ad0a0', label: '#d8a050', cap: '#f0a0b8' }, desc: 'Pistachio and stracciatella. Eat it fast. It is not waiting for you.' },
  longblack:  { name: 'Long black', price: 5, gift: true, art: { kind: 'cup', body: '#f4f0e6', label: '#2a5a4a', cap: '#3a2a24' }, desc: 'From Remy\'s cart on Degraves St. Strong enough to fix a Monday.' },
  magic:      { name: 'A magic', price: 5, gift: true, art: { kind: 'cup', body: '#f4f0e6', label: '#c8a070', cap: '#e8d8b8' }, desc: 'Double ristretto, steamed milk, small glass. Melbourne\'s secret coffee.' },
  borek:      { name: 'Borek', price: 5, gift: true, art: { kind: 'packet', body: '#e8d8b0', label: '#3a8a3a', cap: '#f4f0e6' }, desc: 'Spinach and cheese, from the market. Everyone queues. Everyone is right.' },
  snowglobe:  { name: 'Tram snow globe', price: 12, gift: true, art: { kind: 'globe', body: '#c8e0f0', label: '#3a8a4a', cap: '#3a6aa8' }, desc: 'A little green tram in a snowstorm. It has never snowed on Swanston St. Yet.' },
  koala:      { name: 'Toy koala', price: 10, gift: true, art: { kind: 'koala', body: '#9a9aa2', label: '#f4f0e6', cap: '#2a2a30' }, desc: 'Soft, grey and made of recycled bottles. Clips onto a bag.' },
  umbrella:   { name: 'Four seasons umbrella', price: 15, gift: true, art: { kind: 'brolly', body: '#3a6aa8', label: '#e8c040', cap: '#2a2a30' }, desc: 'For Melbourne\'s four seasons in one day. Mostly the wet one.' },
  mykicase:   { name: 'Myki wallet', price: 8, gift: true, art: { kind: 'packet', body: '#7ab040', label: '#2a2a30', cap: '#f4f0e6' }, desc: 'A little green wallet for your myki. Touching on has never been so stylish.' },

  // Fishing (Anaconda, Preston): bait, and what you catch. Fish are treats; sell
  // them at James's (sell: price paid).
  bait:       { name: 'Bait', price: 2, farm: true, desc: 'A tub of wriggly worms. Better bites while you have some.' },
  redfin:     { name: 'Redfin', sell: 14, fish: true, desc: 'Stripy, spiky and good eating. Cats go feral for it.' },
  carp:       { name: 'Carp', sell: 6, fish: true, desc: 'A pest, honestly. Still counts as a fish.' },
  eel:        { name: 'Shortfin eel', sell: 18, fish: true, desc: 'Slippery and ancient. Eels have lived in Melbourne creeks forever.' },
  yabby:      { name: 'Yabby', sell: 10, fish: true, desc: 'A little freshwater crayfish. Pinchy.' },
  oldboot:    { name: 'Old boot', sell: 1, junk: true, desc: 'Size 11. Full of pond water. Someone, somewhere, is limping.' },
  thermos:    { name: 'Thermos', price: 24, gift: true, desc: 'Keeps tea hot for twelve hours. Keeps soup hot for a whole council meeting.' },
  headtorch:  { name: 'Head torch', price: 20, gift: true, desc: 'For night runs, possum spotting and finding the car keys.' },

  // The story (data/story.js). story: true items are for the plot: not treats, not presents.
  fishpie:    { name: 'Very dodgy fish pie', story: true, desc: 'Fish, lemon, laxatives and three days on a windowsill. For Cr Bentleigh\'s lunch. Do NOT eat.' },
  laxatives:  { name: 'Laxatives', price: 12, story: true, art: { kind: 'packet', body: '#e8eef4', label: '#3a7ac8', cap: '#c83a3a' }, desc: 'Extra strength. "Do not exceed the stated dose." Noted.' },
  // Chapter 3 prank supplies (data/story.js PRANKS). Bunnings, the $2 shop and James's milk bar.
  whoopee:    { name: 'Whoopee cushion', price: 3, story: true, art: { kind: 'ball', body: '#d83a4a', label: '#f08090' }, desc: 'Pink rubber, maximum comedy. Place under an unsuspecting dad.' },
  googly:     { name: 'Googly eyes', price: 2, story: true, art: { kind: 'packet', body: '#f4f4f0', label: '#1e1a18', cap: '#3a7ac8' }, desc: 'A bag of two hundred googly eyes. Everything is funnier when it is looking at you.' },
  rubbermouse:{ name: 'Rubber mouse', price: 2, story: true, art: { kind: 'ball', body: '#9a9aa8', label: '#e8a0b0' }, desc: 'A squeaky grey mouse. Comes with a tiny plaster cast, for some reason.' },
  bookmark:   { name: 'Tassel bookmark', price: 2, story: true, art: { kind: 'packet', body: '#c8443a', label: '#e8c040', cap: '#e8c040' }, desc: 'Fancy. Perfect for losing someone\'s place in a very long book.' },
  grapejuice: { name: 'Grape juice', price: 3, story: true, art: { kind: 'wine', body: '#6a2a5a', label: '#f4e8c8', cap: '#3a1a2a' }, desc: 'In a wine bottle. From a distance, it is a shiraz. Up close, it is for kids.' },
  crayons:    { name: 'Crayons', price: 2, story: true, art: { kind: 'packet', body: '#e8c040', label: '#3a9a4a', cap: '#c8443a' }, desc: 'Twenty-four colours. Enough to redraw an entire train timetable. With dinosaurs.' },
  bubbles:    { name: 'Bubble wand', price: 2, story: true, art: { kind: 'packet', body: '#f0a830', label: '#8ad0e8', cap: '#f4f4f0' }, desc: 'A little bottle of bubble mix shaped like a vape. Mango scented, sort of.' },
  wigglescd:  { name: 'Wiggles CD', price: 5, story: true, art: { kind: 'globe', body: '#e8c040', label: '#c8443a', cap: '#3a7ac8' }, desc: 'Hot Potato, Fruit Salad, the hits. Guaranteed to start a dance-off.' },
  // Party decorations (deco: true) from Bunnings, for the September Babies Bash.
  bunting:    { name: 'Bunting', price: 6, deco: true, desc: 'Ten metres of little triangle flags. Gets tangled just by looking at it.' },
  balloons:   { name: 'Balloons', price: 4, deco: true, desc: 'A bag of balloons. Somebody is going to have to blow these up.' },
  fairylights:{ name: 'Fairy lights', price: 12, deco: true, desc: 'Warm white, solar powered. Makes any backyard look like a wedding.' },

  // The bottle shop at the Edinburgh Castle (drink: true). Presents for friends. Never for pets.
  vb:          { name: 'VB', price: 4, drink: true, art: { kind: 'stubby', body: '#4a2a12', label: '#2a7a3a', cap: '#c8443a' }, desc: 'A hard-earned thirst needs a big cold beer. Apparently.' },
  draught:     { name: 'Carlton Draught', price: 4, drink: true, art: { kind: 'stubby', body: '#4a2a12', label: '#2a3a6a', cap: '#e8c040' }, desc: 'Made from beer. The pub standard.' },
  melbbitter:  { name: 'Melbourne Bitter', price: 4, drink: true, art: { kind: 'can', body: '#c83a2a', label: '#f4efe0', cap: '#b8b8c0' }, desc: 'The red can. Your uncle\'s favourite.' },
  coopers:     { name: 'Coopers Pale Ale', price: 5, drink: true, art: { kind: 'stubby', body: '#5a3a14', label: '#3a8a4a', cap: '#e8c040' }, desc: 'Cloudy. Roll it gently first. It\'s the rules.' },
  crown:       { name: 'Crown Lager', price: 6, drink: true, art: { kind: 'stubby', body: '#2a3a20', label: '#e8c040', cap: '#e8c040' }, desc: 'Fancy. For weddings and promotions.' },
  greatnorthern: { name: 'Great Northern', price: 4, drink: true, art: { kind: 'can', body: '#2a5a8a', label: '#f4efe0', cap: '#b8b8c0' }, desc: 'Mid-strength. Tastes like a fishing trip.' },
  xxxx:        { name: 'XXXX Gold', price: 4, drink: true, art: { kind: 'can', body: '#e8b830', label: '#c8443a', cap: '#b8b8c0' }, desc: 'Queensland\'s finest. Brought down by a cousin.' },
  furphy:      { name: 'Furphy', price: 5, drink: true, art: { kind: 'can', body: '#f4efe0', label: '#c8443a', cap: '#b8b8c0' }, desc: 'Named after a water cart. True story. Probably.' },
  squire:      { name: 'James Squire', price: 6, drink: true, art: { kind: 'stubby', body: '#5a3a14', label: '#f4e0b0', cap: '#2a2a2a' }, desc: 'One Fifty Lashes. History in a bottle.' },
  littlecreatures: { name: 'Little Creatures', price: 6, drink: true, art: { kind: 'stubby', body: '#4a2a12', label: '#e8823a', cap: '#2a2a2a' }, desc: 'Fremantle pale ale. Hoppy and pleased with itself.' },
  stonewood:   { name: 'Stone & Wood', price: 6, drink: true, art: { kind: 'can', body: '#3a9ab0', label: '#f4efe0', cap: '#b8b8c0' }, desc: 'Pacific Ale. Tastes like Byron in a can.' },
  hahn:        { name: 'Hahn SuperDry', price: 5, drink: true, art: { kind: 'stubby', body: '#c8ccd0', label: '#2a3a6a', cap: '#2a3a6a' }, desc: 'Low carb. Ordered by people who also order a salad.' },
  tooheys:     { name: 'Tooheys New', price: 4, drink: true, art: { kind: 'can', body: '#2a2a2a', label: '#f4efe0', cap: '#b8b8c0' }, desc: 'A New South Wales thing. Someone has to drink it.' },
  boags:       { name: 'Boag\'s Draught', price: 5, drink: true, art: { kind: 'stubby', body: '#2a3a20', label: '#2a4a8a', cap: '#c8ccd0' }, desc: 'From Tassie. Crisp, like a Launceston morning.' },
  guinness:    { name: 'Guinness', price: 7, drink: true, art: { kind: 'can', body: '#16161a', label: '#e8d8b0', cap: '#b8b8c0' }, desc: 'Dark, creamy, and Corni\'s one true love.' },
  mountaingoat: { name: 'Mountain Goat Steam Ale', price: 6, drink: true, art: { kind: 'can', body: '#f4efe0', label: '#2a2a2a', cap: '#b8b8c0' }, desc: 'Brewed in Richmond. Goat on the can.' },
  moondog:     { name: 'Moon Dog Old Mate', price: 6, drink: true, art: { kind: 'can', body: '#f07ab0', label: '#2a2a2a', cap: '#b8b8c0' }, desc: 'Abbotsford\'s pink can. Cheeky.' },
  coburglager: { name: 'Coburg Lager', price: 6, drink: true, art: { kind: 'stubby', body: '#2a3a20', label: '#f4efe0', cap: '#c8443a' }, desc: 'Brewed up the road. A proper German-style lager.' },
  yellowtail:  { name: 'Yellow Tail Shiraz', price: 9, drink: true, art: { kind: 'wine', body: '#3a0e1a', label: '#e8c040', cap: '#2a2a2a' }, desc: 'A wallaby on the label. Fine at a barbecue.' },
  jacobs:      { name: 'Jacob\'s Creek Chardonnay', price: 10, drink: true, art: { kind: 'wine', body: '#a8b860', label: '#f4efe0', cap: '#e8c040' }, desc: 'Barossa. The safe choice for a dinner party.' },
  penfolds:    { name: 'Penfolds Bin 28', price: 30, drink: true, art: { kind: 'wine', body: '#2a0a12', label: '#f4efe0', cap: '#c8443a' }, desc: 'Serious red. The bottle shop keeps it behind the counter.' },
  wolfblass:   { name: 'Wolf Blass Yellow Label', price: 12, drink: true, art: { kind: 'wine', body: '#3a0e1a', label: '#e8c040', cap: '#e8c040' }, desc: 'Cab sav with an eagle on it. Very confident.' },
  moscato:     { name: 'Brown Brothers Moscato', price: 11, drink: true, art: { kind: 'wine', body: '#f0a0b8', label: '#f4efe0', cap: '#e8c040' }, desc: 'Pink, sweet and fizzy. Milawa\'s gift to brunch.' },
  chianti:     { name: 'Chianti', price: 14, drink: true, art: { kind: 'wine', body: '#3a0e1a', label: '#c8443a', cap: '#f4efe0' }, desc: 'In a straw basket. All roads lead to it.' },
  orangewine:  { name: 'Natural orange wine', price: 26, drink: true, art: { kind: 'wine', body: '#e8902a', label: '#f4efe0', cap: '#2a2a2a' }, desc: 'Cloudy, funky, from a small Yarra Valley producer. The hipster approves.' },
  goon:        { name: 'Cask of goon', price: 12, drink: true, art: { kind: 'cask', body: '#e8e0d0', label: '#8a1a2a', cap: '#c8443a' }, desc: 'Four litres of fruity lexia. The silver pillow of uni days.' },

  // Plenty Road Convenience, Preston (SMOKES AMERICAN CONFECTIONARY VAPES). Presents for friends, not pets.
  reeses:     { name: 'Reese\'s Cups', price: 4, gift: true, lolly: true, art: { kind: 'packet', body: '#e8823a', label: '#f4e040', cap: '#7a3a1a' }, desc: 'Peanut butter in chocolate. America\'s one good idea.' },
  drpepper:   { name: 'Dr Pepper', price: 4, gift: true, lolly: true, art: { kind: 'can', body: '#6a1a24', label: '#f4efe0', cap: '#b8b8c0' }, desc: 'Tastes like 23 flavours arguing. Imported, so it costs a fortune.' },
  takis:      { name: 'Takis Fuego', price: 6, gift: true, lolly: true, art: { kind: 'packet', body: '#6a2a8a', label: '#e8302a', cap: '#f4e040' }, desc: 'Rolled chilli lime chips. Your fingers will be red for a week.' },
  twinkie:    { name: 'Twinkie', price: 5, gift: true, lolly: true, art: { kind: 'packet', body: '#f4f4f0', label: '#2a6ad0', cap: '#e8302a' }, desc: 'A golden sponge cake that will outlive us all.' },
  poptarts:   { name: 'Pop-Tarts', price: 6, gift: true, lolly: true, art: { kind: 'packet', body: '#2a8ad0', label: '#f07ab0', cap: '#f4efe0' }, desc: 'Frosted strawberry. Toast them or don\'t. Nobody can stop you.' },
  mangoice:   { name: 'Mango Ice vape', price: 25, gift: true, vape: true, art: { kind: 'vape', body: '#f0a030', label: '#f4efe0', cap: '#3a3a44' }, desc: 'Sinead\'s flavour. Smells like a tropical holiday in a bus shelter.' },
  grapeice:   { name: 'Grape Ice vape', price: 25, gift: true, vape: true, art: { kind: 'vape', body: '#7a3ab0', label: '#f4efe0', cap: '#3a3a44' }, desc: 'Purple. Very purple. Leaves a cloud like a nightclub smoke machine.' },
  watermelon: { name: 'Watermelon vape', price: 25, gift: true, vape: true, art: { kind: 'vape', body: '#e85a6a', label: '#5ab04a', cap: '#3a3a44' }, desc: 'Watermelon bubblegum flavour. Officially, vapes are pharmacy only now. Officially.' },
  ...SH_ITEMS,
};

import { EAST_ITEMS } from './east.js';
Object.assign(ITEMS, EAST_ITEMS);   // Brunswick East

import { COOK_ITEMS } from './cooking.js';
Object.assign(ITEMS, COOK_ITEMS);   // cooking: pantry, dishes, cook books

// Pets only eat treats and crops. Drinks, presents and fertiliser are for people and plants.
export const isTreat = id => !!ITEMS[id] && !ITEMS[id].drink && !ITEMS[id].gift && !ITEMS[id].farm && !ITEMS[id].junk && !ITEMS[id].story && !ITEMS[id].deco && !ITEMS[id].ingredient;

Object.assign(ITEMS, NORTH_ITEMS);   // Coburg and Preston
import { CRAFT_ITEMS } from './crafting.js';
Object.assign(ITEMS,CRAFT_ITEMS);
Object.assign(ITEMS, {
  groomrosette: { ...ITEMS.showrosette, name: 'Grooming Rosette', desc: 'Awarded for gentle care and a well-presented coat.' },
  breedrosette: { ...ITEMS.showrosette, name: 'Breed Presentation Rosette', desc: 'Awarded for breed character, condition and calm movement.' },
});
ITEMS = authoredValue('data/items.js', 'ITEMS', ITEMS);
