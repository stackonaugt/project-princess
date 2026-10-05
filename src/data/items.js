// Treats and trinkets. Pets have favourites (see pets.js). Icons are drawn in
// src/art/paint/items.js, or swap in assets/sprites/items/<id>.png
// price: what a shop charges, in dollars.
//   crop: true    grown in the garden (data/crops.js)
//   drink: true   from the bottle shop. For friends only, never for pets.
//                 art: { kind: can | stubby | longneck | wine | cask, body, label, cap }
//   gift: true    a present for friends (books, plants...). Not a pet treat.
//   farm: true    used on garden beds (fertiliser). Not a pet treat.
export const ITEMS = {
  chicken:   { name: 'Chicken necky', price: 6,      desc: 'A crunchy dog treat. Smells incredible if you are a dog.' },
  sardine:   { name: 'Sardine', price: 6,            desc: 'One whole sardine. Oily, shiny, beloved.' },
  carrot:    { name: 'Carrot', price: 3, crop: true,             desc: 'A garden carrot with the leafy top still on.' },
  cheese:    { name: 'Cheese stick', price: 4,       desc: 'Individually wrapped. Very fancy.' },
  snag:      { name: 'Sausage in bread', price: 5,   desc: 'From the hardware barn sausage sizzle. Onions on the bottom, as is correct.' },
  croissant: { name: 'Almond croissant', price: 7,   desc: 'From a Sydney Rd cafe. Costs about as much as a small car.' },
  lemon:     { name: 'Backyard lemon', price: 2,     desc: 'Every Reservoir backyard has a lemon tree. This is proof.' },
  tennis:    { name: 'Tennis ball', price: 4,        desc: 'Slightly damp. Nobody knows why.' },
  ribbon:    { name: 'Pink ribbon', price: 8,        desc: 'Perfect for a pom-pom.' },
  feather:   { name: 'Magpie feather', price: 6,     desc: 'Dropped mid-swoop. A trophy of survival.' },
  // Crops you grow (crop: true). Sold at Dimitri's; see data/crops.js. Carrot above is also a crop.
  basil:      { name: 'Basil', crop: true,      desc: 'A fragrant bunch. Smells like summer and Nonna.' },
  zucchini:   { name: 'Zucchini', crop: true,   desc: 'One of many. So, so many.' },
  potato:     { name: 'Potato', crop: true,     desc: 'Dirt still on it. Poppy dug it up with enthusiasm.' },
  tomato:     { name: 'Tomato', crop: true,     desc: 'Sun-warm and perfect. Nonna would grudgingly approve.' },
  strawberry: { name: 'Strawberry', crop: true, desc: 'Sweet and red. Princess is watching you hold it.' },
  chilli:     { name: 'Chilli', crop: true,     desc: 'Hot. Fire-type pets go wild for them.' },
  pumpkin:    { name: 'Pumpkin', crop: true,    desc: 'Enormous. A whole battle\'s worth of energy.' },

  // Presents for friends (gift: true). Sold at Dimitri's (Reservoir) and Bunnings (Altona North).
  paperback:  { name: 'Secondhand paperback', price: 5, gift: true, desc: 'From Dimitri\'s book swap shelf. Someone has underlined all the good bits.' },
  byzbook:    { name: 'Byzantium: A History', price: 14, gift: true, desc: 'Nine hundred pages of emperors, mosaics and very complicated hats.' },
  modeltrain: { name: 'Model Comeng train', price: 16, gift: true, desc: 'A tiny silver Comeng. The doors open. Tim would lose his mind.' },
  flowers:    { name: 'Bunch of flowers', price: 6, gift: true, desc: 'Wrapped in newspaper. A bit of everything.' },
  icedcoffee: { name: 'Iced coffee carton', price: 4, gift: true, desc: 'Big, sweet and cold. Fuel for a thesis.' },
  gaytime:    { name: 'Golden Gaytime', price: 3, gift: true, desc: 'From the back freezer. A national treasure.' },
  seedling:   { name: 'Native seedling', price: 4, gift: true, desc: 'A baby bottlebrush in a tube. The bees will thank you.' },
  olive:      { name: 'Potted olive tree', price: 15, gift: true, desc: 'Grey-green and ancient looking. Every nonna\'s favourite tree.' },
  gloves:     { name: 'Gardening gloves', price: 6, gift: true, desc: 'Sturdy, green, and already a bit muddy somehow.' },
  fertiliser: { name: 'Fertiliser', price: 5, farm: true, desc: 'Blood and bone. Use it when you water a bed: one extra day of growth.' },

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
};

// Pets only eat treats and crops. Drinks, presents and fertiliser are for people and plants.
export const isTreat = id => !!ITEMS[id] && !ITEMS[id].drink && !ITEMS[id].gift && !ITEMS[id].farm;
