// Treats and trinkets. Pets have favourites (see pets.js). Icons are drawn in
// src/art/paint/items.js, or swap in assets/sprites/items/<id>.png
// price: what the pet shop charges, in dollars.
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
};
