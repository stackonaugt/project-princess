// People around town. Where they stand is set in each map file (b.npc(...)).
// Everything they SAY (role, lines, hints, gift line) is in dialogue.js.
//
//  look   how the built-in sprite looks (see src/art/paint/people.js)
//  gift   item id they give you once a day
//  shop   the shop they open after a chat (data/shops.js)

import { PEOPLE } from './dialogue.js';
import { EAST_NPCS } from './east.js';
import { NORTH_NPCS } from './north.js';
import { SH_NPCS } from './summerhill.js';

export const NPCS = {
  trish: {
    name: 'Trish', look: { hair: '#d8d4cc', hairStyle: 'pixie', skin: '#f0c8a8', shirt: '#c8ccd0', pants: '#c8ccd0', shoes: '#6a5a4a', glasses: '#6a4a2a', scarf: '#3a8a6a', collar: true },
    gift: 'chicken',
  },
  gordon: {
    name: 'Gordon', look: { hair: '#c8c4bc', hairStyle: 'bald', skin: '#e8a890', shirt: '#2a3a5a', pants: '#2a2a2a', shoes: '#4a3a2a', longBeard: '#e8e4dc' },
  },
  gaz: {
    name: 'Gaz', look: { hair: '#8a8d94', hairStyle: 'bald', skin: '#e8b48a', shirt: '#c8443a', pants: '#3a3a48', apron: '#f4efe0', moustache: true },
    gift: 'snag',
  },
  ardi: {
    name: 'Ardi', look: { hair: '#141010', hairStyle: 'short', skin: '#8a5a3a', shirt: '#3a4a6a', pants: '#3a4a6a', shoes: '#2a1a12', hivis: true, gloves: '#3a3a3a', stubble: true },
  },
  jack: {
    name: 'Jack McPherson', look: { hair: '#5a3a1a', hairStyle: 'wavyshort', skin: '#f2c79a', shirt: '#5a6a8a', pants: '#2a2a2a', collar: true, glasses: true, beard: '#4a2e16' },
  },
  pearman: {
    name: 'Pearman', look: { hair: '#c8a070', hairStyle: 'short', skin: '#f2c8a8', shirt: '#18181c', blazer: '#2a2a30', pants: '#1e1e24', shoes: '#1a1a1a', glasses: '#1e1e1e', stubble: true },
    gift: 'pear',
  },
  jordan: {
    name: 'Jordan', look: { hair: '#3a2416', hairStyle: 'short', skin: '#f0c8a8', shirt: '#a8d0a0', collar: true, pants: '#1a1a1e', shoes: '#1a1a1a', lips: '#2a2a2a', holding: 'bass' },
  },
  abby: {
    name: 'Abby', look: { hair: '#f0d890', hairStyle: 'long', skin: '#f6d0b4', shirt: '#3fa38f', pants: '#5a5a66' },
  },
  pina: {
    name: 'Nonna Pina', look: { hair: '#e8e4d8', hairStyle: 'bun', skin: '#e8b48a', shirt: '#2a2a3a', pants: '#2a2a3a', glasses: true },
    gift: 'lemon',
  },
  james: {
    name: 'James Blackman', shop: 'milkbar', look: { hair: '#141012', hairStyle: 'long', skin: '#f0c8a8', shirt: '#2a2a30', pants: '#3a3a48', apron: '#2f6aa3' },
    gift: 'cheese',
  },
  chris: {
    name: 'Chris Bates', look: { hair: '#3a2414', hairStyle: 'wavyshort', skin: '#f2c8a8', shirt: '#2a3a5a', shirtPattern: 'plaid', shirtAccent: ['#a8683a', '#e8a040'], pants: '#3a3a44', shoes: '#4a3a2a', beard: true },
    gift: 'carrot',
  },
  nathan: {
    name: 'Nathan', look: { hair: '#4a3020', hairStyle: 'short', skin: '#f2c8a8', shirt: '#18181c', pants: '#4a4a52', shoes: '#f4f4f0' },
  },
  rose: {
    name: 'Rose', look: { hair: '#b08a58', hairStyle: 'wavy', skin: '#f2c8a0', shirt: '#1e1e24', pants: '#d8a860', pantsPattern: 'leopard', shoes: '#1e1e24', sunglasses: '#9a5ad0', frame: '#d8dce4', bumbag: '#18181c', lips: '#c0505a', holding: 'book' },
    gift: 'sardine',
  },
  slinks: {
    name: 'Slinks', look: { hair: '#100c12', hairStyle: 'bob', skin: '#f4dcc8', shirt: '#4a2a5a', blazer: '#1a181e', blazerTrim: '#3a3440', pants: '#1a181e', shoes: '#0e0e10', lips: '#6a2a4a', holding: 'wine' },
    gift: 'manoush',
  },
  mem: {
    name: 'Mem', look: { hair: '#d8c8a0', hairStyle: 'bob', skin: '#f6d6c0', shirt: '#f4f4f0', pants: '#2a2a34', shoes: '#1a1a1a' },
  },
  corni: {
    name: 'Corni', look: { hair: '#c89a5a', hairStyle: 'short', skin: '#f2c8a8', shirt: '#1e1e24', pants: '#2a2e3a', shoes: '#1a1a1a', moustache: true, stubble: true },
    gift: 'guinness',
  },
  sinead: {
    name: 'Sinead', look: { hair: '#5a3420', hairStyle: 'bun', headband: '#1e1e22', skin: '#f6d6c0', shirt: '#1e1e24', shirtPattern: 'plaid', shirtAccent: ['#e8a030', '#3a8ac8'], pants: '#2a2a34', shoes: '#1e1e24', hoops: '#e8c040', lips: '#c0505a', holding: 'vape' },
    gift: 'tennis',
  },
  tim: {
    name: 'Tim', look: { hair: '#2a1a12', hairStyle: 'wavyshort', skin: '#eec09a', shirt: '#3a8a4a', shirtPattern: 'stripes', shirtAccent: '#f2f2ea', blazer: '#22305a', pants: '#3a3a44', shoes: '#4a2e1a', moustache: '#2a1a12', stubble: true },
    gift: 'cheese',
  },
  nicholas: {
    name: 'Nicholas', look: { hair: '#2a1c14', hairStyle: 'curly', skin: '#f0c8a4', shirt: '#f4f4f0', collar: true, blazer: '#2a3a34', blazerPattern: 'plaid', blazerAccent: ['#5a2a2a', '#1a2420'], pants: '#2a2a30', shoes: '#2a1a12', glasses: '#7a4a22' },
  },
  binman: {
    name: 'Bin Man', look: { hair: '#5a3a1a', hairStyle: 'cap', cap: '#f07a1a', skin: '#e0a880', shirt: '#f07a1a', hivis: true, pants: '#2a3a5a', shoes: '#2a2a2a', gloves: '#e8c040', stubble: true },
  },
  spiro: {
    name: 'Spiro', shop: 'fishvan', look: { hair: '#d8d4cc', hairStyle: 'short', skin: '#e0b088', shirt: '#f4f4f0', apron: '#2f6aa3', pants: '#2a2e3a', shoes: '#2a2a2a', moustache: '#d8d4cc' },
    gift: 'sardine',
  },
  // The dela Cruz family: karaoke at Lohse St Reserve every day (Lohse St, the shade by the toilets)
  ramon: {
    name: 'Tito Ramon', look: { hair: '#1a1614', hairStyle: 'short', skin: '#b07a52', shirt: '#f4f4f0', shirtPattern: 'stripes', shirtAccent: '#2a5ab8', pants: '#3a3a44', shoes: '#f4f4f0', moustache: true, holding: 'mic' },
  },
  liza: {
    name: 'Tita Liza', look: { hair: '#1a1614', hairStyle: 'long', skin: '#c08a5e', shirt: '#e8507a', pants: '#2a2a38', shoes: '#f4c83a', hoops: '#f4c83a', holding: 'mic' },
  },
  migs: {
    name: 'Migs', look: { baby: true, hair: '#1a1614', hairStyle: 'short', skin: '#b88660', shirt: '#2a8ac8', motif: '#f4c83a', print: 'star', pants: '#3a3a44', shoes: '#e8e8e8' },
  },
  bea: {
    name: 'Bea', look: { baby: true, hair: '#1a1614', hairStyle: 'long', skin: '#c08a5e', shirt: '#f08ab0', motif: '#ffffff', print: 'heart', shoes: '#e8e8e8' },
  },
  narelle: {
    name: 'Narelle', look: { hair: '#c8b8a8', hairStyle: 'bob', skin: '#f2c8a8', shirt: '#6a4a8a', pants: '#2a2a38', shoes: '#1e1a18', glasses: true },
  },
  julie: {
    name: 'Julie Jana', look: { hair: '#9a7a58', hairStyle: 'long', skin: '#f2c8a8', shirt: '#d8202a', logo: '#f4f4f0', pants: '#3a5a8a', shoes: '#f4f4f0', lips: '#c8202a', hoops: '#e8a070' },
  },
  hipster: {
    name: 'Hipster', look: { hair: '#2a1a12', hairStyle: 'cap', cap: '#1e1e22', skin: '#f0c8a0', shirt: '#1e1e22', pants: '#1e1e22', shoes: '#1e1e22', beard: true, glasses: '#3a2a1a' },
  },
  golfer: {
    name: 'Golfer Next Door', look: { hair: '#d8d4cc', hairStyle: 'cap', cap: '#f4f4f0', skin: '#e0a07a', shirt: '#9ac8e8', collar: true, pants: '#c8b890', pantsPattern: 'plaid', pantsAccent: ['#8a7a5a', '#c84a3a'], shoes: '#f4f4f0' },
  },
  stranger: {
    name: 'Stranger', look: { hair: '#4a3a2a', hairStyle: 'short', skin: '#e0b898', shirt: '#6a6e74', pants: '#2a2e3a', shoes: '#3a3a3a', stubble: true },
  },
  olly: {
    name: 'Olly', shop: 'bunnings', look: { hair: '#3a2416', hairStyle: 'short', skin: '#f2c8a8', shirt: '#2a2a30', pants: '#3a3a48', apron: '#1f7a3a', stubble: true },
    gift: 'seedling',
  },
  // Hobsons Bay City Council (the civic centre in Altona). Near-names for the
  // real councillors. Paddy is the mayor, Helen's husband and the twins' dad.
  paddy: {
    name: 'Paddy', look: { hair: '#4a3020', hairStyle: 'wavyshort', skin: '#f0c4a4', shirt: '#e8ecd8', collar: true, blazer: '#141416', blazerTrim: '#d8b440', pants: '#141416', shoes: '#1a1a1a', beard: '#3a2618' },
  },
  lesley: {
    name: 'Cr Lesley Bentleigh', look: { hair: '#d89a58', hairStyle: 'bob', skin: '#e8907a', shirt: '#f4ecb0', blazer: '#18181c', blazerTrim: '#2a2a30', pants: '#18181c', shoes: '#1a1a1a', glasses: '#c8a070', hoops: '#e8e4dc', lips: '#c0505a' },
  },
  malcolm: {
    name: 'Cr Malcolm Dismay', look: { hair: '#e8e4dc', hairStyle: 'short', skin: '#e8b498', shirt: '#c8d0dc', collar: true, blazer: '#2a2e3a', pants: '#2a2e3a', shoes: '#1a1a1a', glasses: '#8a8e96' },
  },
  kirsty: {
    name: 'Cr Kirsty Bishopp', look: { hair: '#e0cfa0', hairStyle: 'long', skin: '#f2c8a8', shirt: '#7a2a3a', shirtPattern: 'gingham', shirtAccent: '#3a6a8a', blazer: '#1e2a48', pants: '#1e2a48', shoes: '#1a1a1a' },
  },
  dahlia: {
    name: 'Cr Dahlia Kellandra', look: { hair: '#f0dca0', hairStyle: 'long', skin: '#f6d0b4', shirt: '#f4f4f0', blazer: '#2a4a8a', pants: '#2a2e3a', shoes: '#1a1a1a' },
  },
  rayna: {
    name: 'Cr Rayna Hawley', look: { hair: '#1e1612', hairStyle: 'wavy', skin: '#d8a882', shirt: '#f4f4f0', blazer: '#e8509a', pants: '#f4f4f0', shoes: '#c8a070', lips: '#b04060' },
  },
  deanna: {
    name: 'Cr Deanna Grimes', look: { hair: '#b8955a', hairStyle: 'wavy', skin: '#f2c8a8', shirt: '#5a3a8a', shirtPattern: 'plaid', shirtAccent: ['#c8b8e8', '#2a1a4a'], pants: '#2a2a30', shoes: '#1a1a1a' },
  },
  shannon: {
    name: 'Shannon', shop: 'bookshop', look: { hair: '#241612', hairStyle: 'curly', skin: '#f6d6c0', shirt: '#7a1a2a', shirtPattern: 'dots', shirtAccent: '#f4efe0', pants: '#2a2a34', shoes: '#1a1a1a', lips: '#c0505a', holding: 'book' },
  },
  bazza: {
    name: 'Bazza', shop: 'anaconda', look: { hair: '#8a4a22', hairStyle: 'cap', cap: '#e8643a', skin: '#e8b48a', shirt: '#e8643a', pants: '#5a5a48', shoes: '#4a3a2a', beard: true },
  },
  sam: {
    name: 'Sam', shop: 'vapeshop', look: { hair: '#1e1a18', hairStyle: 'cap', cap: '#2a2a30', skin: '#c8906a', shirt: '#3a3a44', shirtPattern: 'stripes', shirtAccent: '#e8c040', pants: '#2a2a30', shoes: '#f4f4f0', beard: true },
  },
  franco: {
    name: 'Franco Cozzo', shop: 'cozzo', look: { hair: '#d8d4cc', hairStyle: 'wavyshort', skin: '#e0a882', shirt: '#f4f4f0', collar: true, scarf: '#5a6a9a', blazer: '#22284a', pants: '#22284a', shoes: '#1a1a1a' },
  },
  // ---- Carlton and the city
  dell: {
    name: 'Dell', look: { hair: '#ecebe6', hairStyle: 'pixie', skin: '#f2c8a8', shirt: '#c8c8c0', blazer: '#4a6a9a', blazerTrim: '#3a5a88', pants: '#b8c040', shoes: '#2a2a30', glasses: '#e83a8a', hoops: '#3a3a44' },
    gift: 'tennis',
  },
  // ---- Carlton and the city
  gina: {
    name: 'Gina', shop: 'gelateria', look: { hair: '#2a1e1a', hairStyle: 'bun', streak: '#d8d4cc', skin: '#e0b088', shirt: '#f4f0e6', pants: '#2a2a30', shoes: '#1a1a1a', apron: '#f0a0b8', hoops: '#e8c040', lips: '#c0505a' },
    gift: 'gelato',
  },
  spruiker: {
    name: 'Tony', look: { hair: '#1e1a18', hairStyle: 'short', skin: '#e0a882', shirt: '#f4f4f0', collar: true, blazer: '#1e1e24', pants: '#1e1e24', shoes: '#1a1a1a', moustache: true },
  },
  enzo: {
    name: 'Nonno Enzo', look: { hair: '#e8e4dc', hairStyle: 'cap', cap: '#5a5a60', skin: '#e8b48a', shirt: '#c8b898', blazer: '#6a5a4a', pants: '#4a4a52', shoes: '#3a2a1e', glasses: true },
    gift: 'lemon',
  },
  vince: {
    name: 'Nonno Vince', look: { hair: '#c8c4bc', hairStyle: 'bald', skin: '#d8a070', shirt: '#f4f4f0', collar: true, pants: '#6a4a2a', shoes: '#3a2a1e', moustache: true },
  },
  mia: {
    name: 'Mia', look: { hair: '#3a2416', hairStyle: 'messybun', skin: '#f2c8a8', shirt: '#e8823a', pants: '#4a6a9a', shoes: '#f4f4f0', glasses: '#2a2a2a', holding: 'book' },
  },
  ana: {
    name: 'Ana', look: { hair: '#c8c4bc', hairStyle: 'bob', skin: '#c88a5a', shirt: '#f4f0e6', blazer: '#2a3a58', pants: '#2a3a58', shoes: '#1a1a1a', glasses: '#6a4a2a', scarf: '#c8443a' },
  },
  jun: {
    name: 'Jun', look: { hair: '#141012', hairStyle: 'wavyshort', skin: '#e8c8a0', shirt: '#1e1e24', pants: '#1e1e24', shoes: '#1a1a1a', glasses: '#2a2a2a' },
  },
  possumpat: {
    name: 'Possum Pat', look: { hair: '#a8a8a8', hairStyle: 'cap', cap: '#3a6a3a', skin: '#f0c8a8', shirt: '#7a7a5a', pants: '#5a5a48', shoes: '#4a3a2a', beard: true },
    gift: 'feather',
  },
  chesskev: {
    name: 'Chess Kev', look: { hair: '#8a8d94', hairStyle: 'bald', skin: '#e8b498', shirt: '#3a5a8a', shirtPattern: 'plaid', shirtAccent: ['#c8443a', '#1e2a48'], pants: '#4a4a40', shoes: '#4a3a2a', longBeard: '#c8c4bc' },
  },
  luca: {
    name: 'Luca', look: { hair: '#6a3a1a', hairStyle: 'curly', skin: '#f0c8a0', shirt: '#c8302a', pants: '#2a2a30', shoes: '#1a1a1a', stubble: true, holding: 'bass' },
  },
  margaret: {
    name: 'Margaret', look: { hair: '#d8d4cc', hairStyle: 'bun', skin: '#f2d0b8', shirt: '#f4f0e6', blazer: '#6a3a5a', pants: '#3a3a44', shoes: '#4a3a2a', glasses: '#8a6a4a', scarf: '#3a8a6a', holding: 'book' },
    gift: 'paperback',
  },
  mai: {
    name: 'Mai', shop: 'souvenirs', look: { hair: '#141012', hairStyle: 'long', skin: '#e8c090', shirt: '#e8c040', pants: '#2a2a30', shoes: '#f4f4f0', apron: '#3a6aa8' },
  },
  raelene: {
    name: 'Raelene', look: { hair: '#c8643a', hairStyle: 'messybun', skin: '#f2c8a8', shirt: '#5ab0b0', pants: '#5ab0b0', shoes: '#f4f4f0', lips: '#c0505a' },
  },
  officer: {
    name: 'Authorised Officer', look: { hair: '#4a3a2a', hairStyle: 'cap', cap: '#1e2a48', skin: '#e8b48a', shirt: '#2a3a5a', collar: true, blazer: '#1e2a48', pants: '#1e2a48', shoes: '#1a1a1a', moustache: true },
  },
  remy: {
    name: 'Remy', shop: 'coffeecart', look: { hair: '#3a2416', hairStyle: 'mullet', skin: '#f0c8a8', shirt: '#1e1e24', pants: '#3a3a44', shoes: '#f4f4f0', apron: '#6a4a2a', beard: true },
  },
  spray: {
    name: 'Spray', look: { hair: '#1e1a18', hairStyle: 'spiky', streak: '#f07ab0', skin: '#c8906a', shirt: '#5a3a8a', pants: '#2a2a30', shoes: '#e8c040', gloves: '#3a9a5a' },
  },
  dev: {
    name: 'Dev', look: { hair: '#1e1a18', hairStyle: 'wavyshort', skin: '#a8704a', shirt: '#f4f0e6', collar: true, blazer: '#5a3a2a', pants: '#2a2a30', shoes: '#4a2a1a' },
  },
  marj: {
    name: 'Marj', look: { hair: '#e8d890', hairStyle: 'bob', skin: '#f2c8a8', shirt: '#2a8ad0', pants: '#2a2a30', shoes: '#1a1a1a', hivis: true },
  },
  dot: {
    name: 'Dot', shop: 'donuts', look: { hair: '#c8c4bc', hairStyle: 'curly', skin: '#f0c8a8', shirt: '#f4f0e6', pants: '#3a3a48', shoes: '#4a3a2a', apron: '#c8302a' },
    gift: 'jamdonut',
  },
  yianni: {
    name: 'Yianni', shop: 'qvdeli', look: { hair: '#8a8d94', hairStyle: 'bald', skin: '#d8a070', shirt: '#2a5aa8', pants: '#2a2a30', shoes: '#1a1a1a', apron: '#f4f4f0', moustache: true },
    gift: 'cheese',
  },
  carmel: {
    name: 'Carmel', shop: 'fruit', look: { hair: '#5a3a1a', hairStyle: 'cap', cap: '#c8302a', skin: '#e8b48a', shirt: '#3a8a4a', pants: '#3a3a44', shoes: '#4a3a2a', bumbag: '#1e1e24' },
    gift: 'strawberry',
  },
  ward: {
    name: 'Ward', shop: 'bottleshop', greetsPets: true, look: { hair: '#e0a880', hairStyle: 'bald', skin: '#f0c4a4', shirt: '#18181c', logo: '#c8302a', pants: '#3a4a6a', shoes: '#1a1a1a', stubble: true },
  },
  romey: {
    name: 'Romey', shop: 'petshop', look: { hair: '#3a2214', hairStyle: 'long', skin: '#f6d6c0', shirt: '#f4f0e6', pants: '#3a3a48', shoes: '#6a4a2a', apron: '#c8443a' },
  },
  sharma: {
    name: 'Mr Sharma', look: { hair: '#1e1a18', hairStyle: 'short', skin: '#b07a50', shirt: '#6a2a7a', collar: true, scarf: '#e8b040', pants: '#2a2a34', shoes: '#4a2a1a', moustache: true },
  },
  crazyjeff: {
    name: 'Crazy Jeff', look: { hair: '#e8e4dc', hairStyle: 'wavyshort', skin: '#f0c4a4', shirt: '#f4f4f0', collar: true, pants: '#f4f4f0', shoes: '#f4f4f0', hat: '#f4f4f0', moustache: true },
  },
  bowler1: { name: 'Merv the Bowler', look: { hair: '#c8c4bc', hairStyle: 'bald', skin: '#e8b498', shirt: '#f4f4f0', collar: true, pants: '#f4f4f0', shoes: '#f4f4f0', glasses: '#4a4a4a' } },
  bowler2: { name: 'Stan the Bowler', look: { hair: '#d8d4cc', hairStyle: 'short', skin: '#c8906a', shirt: '#f4f4f0', collar: true, pants: '#f4f4f0', shoes: '#f4f4f0', hat: '#f4f4f0' } },
  ghost: {
    name: 'The Station Ghost', look: { hair: '#e8eef4', hairStyle: 'short', skin: '#dce8f0', shirt: '#c8d8e8', pants: '#b8c8d8', shoes: '#a8b8c8', coat: '#d8e4f0', tatters: true },
  },
  fairy: {
    name: 'A Real Fairy', look: { hair: '#f0a0d0', hairStyle: 'long', skin: '#f6dcc8', shirt: '#a0e8f0', pants: '#f0a0d0', shoes: '#f4f4f0', lips: '#e05a9a', pinafore: '#c8a0f0' },
  },
  // The Premier, outside Parliament. Guards the way into the city.
  bencarroll: {
    name: 'Premier Ben Carroll', look: { hair: '#3a2a1e', hairStyle: 'short', skin: '#f0c8a8', shirt: '#f4f4f0', collar: true, blazer: '#1e2440', pants: '#1e2440', shoes: '#141414' },
  },
  ...SH_NPCS,
};

Object.assign(NPCS, EAST_NPCS);   // Brunswick East
Object.assign(NPCS, NORTH_NPCS);   // Coburg and Preston

// What everyone says lives in dialogue.js.
for (const [id, t] of Object.entries(PEOPLE)) {
  const n = NPCS[id];
  if (!n) continue;
  for (const k of ['role', 'lines', 'hints', 'giftLine', 'byHero', 'advice', 'leaving']) if (t[k] !== undefined) n[k] = t[k];
}
