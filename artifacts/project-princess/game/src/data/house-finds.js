// Things to find around the Allen St house and yard, once per save, so a new
// player has a present or two for the first people they meet (Trish and
// Gordon on Woods St, the councillors next door, Jack and Ardi at the station).
// Spots are tiles in the `home` and `yard` maps; a spot on furniture is
// picked up from the tile next to it. Picked-up ids: state.data.houseFinds.
// Presents Trish and Gordon like, not their favourites: those stay for requests.
// Logic: systems/house-finds.js. Items are merged into ITEMS (lovedBy/likedBy
// become friend tastes in data/friends.js) and their icons into ITEM_ART.

export const HOUSE_ITEMS = {
  rosecutting: { name: 'Rose cutting', price: 5, gift: true, lovedBy: ['deanna'], likedBy: ['gordon', 'trish', 'dahlia', 'kirsty'],
    desc: 'A cutting from the old rose out the back, rooting in a jar. Somebody will give it a good home.' },
  teacup: { name: 'Good china teacup', price: 8, gift: true, lovedBy: ['liza'], likedBy: ['trish', 'gordon', 'rayna', 'kirsty'],
    desc: 'Blue flowers, gold rim. One of Trish\'s good set, lent for the housewarming and never returned.' },
  wattle: { name: 'Self-sown wattle', price: 4, gift: true, lovedBy: ['dahlia', 'deanna'], likedBy: ['gordon', 'trish'],
    desc: 'A baby wattle that came up on its own, potted in an old yoghurt tub.' },
  jackiou: { name: 'Paddy\'s IOU to Jack', price: 1, gift: true, lovedBy: ['jack'], likedBy: ['paddy'],
    desc: '"IOU Jack $20. Footy tipping. Will pay." In Paddy\'s writing. Dated three seasons ago.' },
  socketset: { name: 'Socket set', price: 12, gift: true, lovedBy: ['ardi'], likedBy: ['binman', 'jack', 'malcolm'],
    desc: 'Still in its plastic. A Father\'s Day present Paddy has never opened.' },
};

// id: spot id saved once found. zone/x/y: tile. item and how many. lines: what you see.
export const HOUSE_FINDS = [
  { id: 'storagebooks', zone: 'home', x: 7, y: 12, item: 'paperback', lines: ['A box marked BOOKS (MISC). On top: a secondhand paperback about the roads of the Roman Empire.', 'Gordon would like this. It is not Byzantium, but it is close.'] },
  { id: 'esky', zone: 'home', x: 13, y: 2, item: 'moscato', lines: ['Under the ice packs in the esky: a bottle of moscato left over from the housewarming.', 'Cr Bishopp up the street loves a moscato. So does Trish, a bit.'] },
  { id: 'kitchenbox', zone: 'home', x: 17, y: 7, item: 'teacup', lines: ['A box of kitchen things nobody has unpacked. Wrapped in newspaper: one of Trish\'s good teacups.', 'She will want that back. Take it round to Woods St.'] },
  { id: 'sidetable', zone: 'home', x: 17, y: 14, item: 'jackiou', lines: ['Under a coaster: "IOU Jack $20. Footy tipping." Paddy\'s writing.', 'Jack waits at Laverton Station most days. He would enjoy this far too much.'] },
  { id: 'rose', zone: 'yard', x: 11, y: 1, item: 'rosecutting', lines: ['You snip a cutting from the old rose and pop it in a jar of water.', 'Gordon and Trish would both like a rose for their garden.'] },
  { id: 'cypress', zone: 'yard', x: 2, y: 13, item: 'wattle', lines: ['A little wattle has come up on its own by the cypress. You pot it in an old yoghurt tub.', 'Cr Kellandra on Allen St and Cr Grimes on Woods St both love a native.'] },
  { id: 'wheelbarrow', zone: 'yard', x: 19, y: 1, item: 'socketset', lines: ['In the wheelbarrow by the shed: a socket set, still in its plastic.', 'Paddy is not a socket set person. Ardi the mechanic, by the station, very much is.'] },
];

export const HOUSE_FIND_NUDGE = { id: 'house-finds', title: 'Look around the house',
  text: 'Have a look around the house and yard (look for things lying about). There might be something nice to take to Trish and Gordon on Woods St.' };

export const HOUSE_ITEM_ART = {
  rosecutting: { pal: { r: '#c83a5a', p: '#f07aa0', g: '#3f8a3e', l: '#6dbb58', k: '#5a6a70', w: '#e4f2f6', b: '#9ec8d8' }, rows: [
    '.....rr.....', '....rppr....', '....rppr....', '.l...rr.....', '.ll..g......', '..lllg......',
    '.....g.ll...', '...kkgkkk...', '...kwgbbk...', '...kwbbbk...', '...kwbbbk...', '....kkkk....'] },
  teacup: { pal: { w: '#f8f6f0', s: '#d8d4cc', k: '#5a5a6a', b: '#3a6ac8', g: '#e8c040' }, rows: [
    '............', '............', '............', '.kkkkkkkk...', '.kggggggk...', '.kwbwwbwkkk.',
    '.kwwbbwwk.k.', '.kwbwwbwkkk.', '..kwwwwk....', 'kkkkkkkkkkk.', 'ksssssssssk.', '.kkkkkkkkk..'] },
  wattle: { pal: { y: '#f2d03a', o: '#d8a820', g: '#5a8a3e', t: '#4a6a2a', k: '#4a4a54', w: '#f4f4f0', b: '#3a8ad0' }, rows: [
    '...y..yy....', '..yoy.yoy...', '...yggy.y...', '.y..gtg.yy..', 'yoy..t.gg...', '.y.g.t.g....',
    '....gtg.....', '.....t......', '..kkkkkkk...', '..kwwwwwk...', '...kbbbk....', '...kkkkk....'] },
  jackiou: { pal: { w: '#f4efe0', l: '#a8a090', k: '#6a6050', r: '#c83a3a' }, rows: [
    '............', '............', '.kkkkkkkkkk.', '.kwwwwwwwwk.', '.kwllllwwwk.', '.kwwwwwwwwk.',
    '.kwlllllwwk.', '.kwwwwwwwwk.', '.kwwwrrrrwk.', '.kwwwwwwwwk.', '.kkkkkkkkkk.', '............'] },
  socketset: { pal: { r: '#c83a2a', d: '#8a2418', k: '#3a1a14', s: '#c8ccd0', g: '#7a7e88' }, rows: [
    '............', '............', '............', '.kkkkkkkkkk.', '.krrrrrrrrk.', '.kddddddddk.',
    'kkkkkkkkkkkk', 'krsrsrsrsrrk', 'krgrgrgrgrrk', 'krrrrrrrrrrk', 'kddddddddddk', 'kkkkkkkkkkkk'] },
};
