// People around town. Where they stand is set in each map file (b.npc(...)).
// Everything they SAY (role, lines, hints, gift line) is in dialogue.js.
//
//  look   how the built-in sprite looks (see src/art/paint/people.js)
//  gift   item id they give you once a day
//  shop   the shop they open after a chat (data/shops.js)

import { PEOPLE } from './dialogue.js';
import { NORTH_NPCS } from './north.js';

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
  marisol: {
    name: 'Marisol', look: { hair: '#2a1a0c', hairStyle: 'bun', skin: '#c88a5a', shirt: '#e8823a', pants: '#2f4a6a', hivis: true },
  },
  commuter: {
    name: 'Commuter', look: { hair: '#5a3a1a', hairStyle: 'short', skin: '#f2c79a', shirt: '#5a6a8a', pants: '#2a2a2a', collar: true, glasses: true },
  },
  pearman: {
    name: 'Pearman', look: { hair: '#e8c8a0', hairStyle: 'bald', skin: '#f2c8a8', shirt: '#18181c', pants: '#1e1e24', shoes: '#1a1a1a', apron: '#6b4226', stubble: true },
    gift: 'croissant',
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
    gift: 'carrot',
  },
  mem: {
    name: 'Mem', look: { hair: '#ecd490', hairStyle: 'bob', skin: '#f2c8a0', shirt: '#2a2a30', blazer: '#1a1a1e', blazerTrim: '#4a4a54', pants: '#8aa4c8', shoes: '#1e1e24', sunglasses: '#1a1a20', shades: 'wrap' },
  },
  corni: {
    name: 'Corni', look: { hair: '#a87a4a', hairStyle: 'mullet', skin: '#f2c79a', shirt: '#2a3a68', pants: '#4a4a52', shoes: '#e8e4dc', holding: 'pint' },
    gift: 'guinness',
  },
  sinead: {
    name: 'Sinead', look: { hair: '#3a2416', hairStyle: 'long', skin: '#f2c8a8', shirt: '#2a2a30', blazer: '#18181c', blazerTrim: '#44444c', pants: '#2a2a34', shoes: '#1e1e24', sunglasses: '#5a3218', shades: 'round', frame: '#8a5428', hoops: '#f06aa8', holding: 'vape' },
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
    name: 'Olly', shop: 'bunnings', look: { hair: '#6a4422', hairStyle: 'short', skin: '#f0c8a0', shirt: '#c8302a', pants: '#3a3a48', apron: '#2f7a3a', stubble: true },
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
  wren: {
    name: 'Wren', shop: 'bookshop', look: { hair: '#c8643a', hairStyle: 'bun', skin: '#f2c8a8', shirt: '#2a3a58', shirtPattern: 'stripes', shirtAccent: '#f4efe0', pants: '#3a3a44', shoes: '#c8a070', glasses: '#2a2a2a', holding: 'book' },
  },
  bazza: {
    name: 'Bazza', shop: 'anaconda', look: { hair: '#8a4a22', hairStyle: 'cap', cap: '#e8643a', skin: '#e8b48a', shirt: '#e8643a', pants: '#5a5a48', shoes: '#4a3a2a', beard: true },
  },
  sam: {
    name: 'Sam', shop: 'vapeshop', look: { hair: '#1e1a18', hairStyle: 'cap', cap: '#2a2a30', skin: '#c8906a', shirt: '#3a3a44', shirtPattern: 'stripes', shirtAccent: '#e8c040', pants: '#2a2a30', shoes: '#f4f4f0', beard: true },
  },
  sal: {
    name: 'Sal', shop: 'cozzo', look: { hair: '#1e1a18', hairStyle: 'short', skin: '#e0a882', shirt: '#f4f4f0', collar: true, blazer: '#2a2a34', pants: '#2a2a34', shoes: '#1a1a1a', moustache: true },
  },
  macca: {
    name: 'Macca', shop: 'bottleshop', look: { hair: '#8a5a2a', hairStyle: 'short', skin: '#e8b48a', shirt: '#1e1e24', pants: '#3a4a6a', shoes: '#2a1a12', beard: true },
  },
  ed: {
    name: 'Ed', shop: 'petshop', look: { hair: '#e0a880', hairStyle: 'bald', skin: '#e8b890', shirt: '#2f6aa3', pants: '#3a3a48', apron: '#c8443a', glasses: '#2a2a2a' },
  },

};

Object.assign(NPCS, NORTH_NPCS);   // Coburg and Preston

// What everyone says lives in dialogue.js.
for (const [id, t] of Object.entries(PEOPLE)) {
  const n = NPCS[id];
  if (!n) continue;
  for (const k of ['role', 'lines', 'hints', 'giftLine', 'byHero', 'advice', 'leaving']) if (t[k] !== undefined) n[k] = t[k];
}
