// Friendships with townsfolk. Chat once a day and give them a gift once a
// day (like the pets). 25 points per heart, up to 10 hearts.
//
//   loves / likes / dislikes   item ids (treats and crops)
//   events   heart scenes (the words are heartScenes in dialogue.js)
//   rewards  { hearts: { item, n } or { money } } given at the end of that scene
//   assist   at 4+ hearts they may turn up to help in a battle near where they
//            live (same suburb), at random, once per battle:
//            { heal | selfAtk | selfDef | foeAtk | foeDef | damage } (the line is helpsInBattle in dialogue.js)
// Anyone in npcs.js without an entry here still has hearts, with generic tastes.

import { PEOPLE } from './dialogue.js';
import { EAST_FRIENDS } from './east.js';
import { NORTH_FRIENDS } from './north.js';
import { SH_FRIENDS } from './summerhill.js';
import { ITEMS } from './items.js';

export const FRIEND_POINTS = { talk: 10, love: 40, like: 20, neutral: 8, dislike: -10 };
export const ASSIST_HEARTS = 4;

export const FRIENDS = {
  trish: {
    loves: ['strawberry', 'flowers', 'prideprejudice'], likes: ['tomato', 'basil', 'lemon', 'moscato'], dislikes: ['sardine'],
    rewards: { 2: { item: 'chicken', n: 2 } },
    assist: { heal: 0.45 },
  },
  gordon: {
    loves: ['byzbook', 'olive', 'hangingrock'], likes: ['seedling', 'pumpkin', 'tomato', 'coopers'], dislikes: ['hahn'],
    rewards: { 4: { item: 'seedling', n: 2 }, 6: { item: 'olive', n: 1 } },
    assist: { foeAtk: 2 },
  },
  gaz: {
    loves: ['snag', 'vb'], likes: ['tomato', 'chicken', 'draught'], dislikes: ['orangewine'],
    rewards: { 2: { item: 'snag', n: 2 } },
    assist: { heal: 0.3, selfAtk: 1 },
  },
  binman: {
    loves: ['zucchini', 'greatnorthern'], likes: ['snag', 'potato', 'xxxx'], dislikes: ['croissant'],
    assist: { damage: 0.2 },
  },
  rose: {
    loves: ['paperback', 'orangewine', 'monkeygrip', 'middlemarch', 'thedry'], likes: ['croissant', 'flowers', 'icedcoffee', 'sardine', 'janeeyre', 'prideprejudice'], dislikes: ['vb'],
    rewards: { 4: { item: 'paperback', n: 1 } },
    assist: { foeAtk: 1, foeDef: 1 },
  },
  // Pearman: golf balls, or any booze at all.
  pearman: {
    loves: ['golfball', ...Object.keys(ITEMS).filter(id => ITEMS[id].drink)], likes: ['pear', 'snag', 'hotchips'], dislikes: ['seedling'],
    assist: { foeAtk: 1 },
  },
  slinks: {
    loves: ['penfolds', 'wolfblass', 'orangewine', 'chianti', 'thedry'], likes: ['jacobs', 'yellowtail', 'carrot', 'paperback'], dislikes: ['goon', 'vb'],
    rewards: { 4: { item: 'yellowtail', n: 1 } },
    assist: { foeDef: 2 },
  },
  mem: {
    loves: ['seedling', 'icedcoffee', 'guinness', 'lessonschem'], likes: ['strawberry', 'basil', 'flowers', 'moscato'], dislikes: ['goon'],
    rewards: { 4: { item: 'icedcoffee', n: 2 } },
    assist: { foeAtk: 1, foeDef: 1 },
  },
  corni: {
    loves: ['guinness', 'coburglager'], likes: ['croissant', 'potato', 'mountaingoat', 'icedcoffee'], dislikes: ['hahn', 'goon'],
    rewards: { 2: { item: 'guinness', n: 1 }, 6: { item: 'guinness', n: 2 } },
    assist: { damage: 0.18, foeDef: 1 },
  },
  sinead: {
    loves: ['moscato', 'strawberry', 'icedcoffee', 'fourthwing', 'mangoice'], likes: ['flowers', 'tennis', 'gaytime', 'yellowtail'], dislikes: ['sardine'],
    rewards: { 4: { item: 'tennis', n: 2 } },
    assist: { foeAtk: 1, selfDef: 1 },
  },
  tim: {
    loves: ['modeltrain', 'chianti', 'cloudstreet'], likes: ['croissant', 'cheese', 'coopers', 'paperback'], dislikes: ['hahn'],
    rewards: { 6: { item: 'chianti', n: 1 } },
    assist: { foeAtk: 2 },
  },
  nicholas: {
    loves: ['icedcoffee', 'paperback', 'nineteen84'], likes: ['chianti', 'croissant', 'cheese', 'moscato'], dislikes: ['snag'],
    rewards: { 4: { item: 'icedcoffee', n: 1 } },
    assist: { foeDef: 1, selfAtk: 1 },
  },
  olly: {
    loves: ['snag', 'vb'], likes: ['seedling', 'tomato', 'potato', 'draught'], dislikes: ['orangewine'],
    rewards: { 4: { item: 'fertiliser', n: 3 } },
    assist: { heal: 0.35 },
  },
  romey: {
    loves: ['cheese', 'seedling', 'strawberry'], likes: ['chicken', 'croissant', 'paperback', 'flowers'], dislikes: ['crown'],
    rewards: { 4: { money: 25 } },
    assist: { heal: 0.35 },
  },
  ward: {
    loves: ['mountaingoat', 'coburglager', 'moondog'], likes: ['snag', 'croissant', 'littlecreatures', 'lasagne'], dislikes: ['vb', 'goon'],
    rewards: { 4: { item: 'coburglager', n: 1 } },
    assist: { foeDef: 1, damage: 0.12 },
  },
  paddy: {
    loves: ['coopers', 'byzbook', 'nineteen84'], likes: ['snag', 'croissant', 'icedcoffee', 'paperback'], dislikes: ['goon'],
    assist: { heal: 0.3, selfDef: 1 },
  },
  lesley: { loves: ['penfolds', 'fourthwing'], likes: ['flowers'], dislikes: ['vb', 'goon', 'snag', 'paperback'] },
  malcolm: { loves: ['crown'], likes: ['snag', 'vb'], dislikes: ['orangewine', 'seedling'] },
  kirsty: { loves: ['flowers', 'moscato', 'lessonschem'], likes: ['croissant', 'jacobs', 'paperback'], dislikes: ['vb'] },
  dahlia: { loves: ['seedling', 'icedcoffee', 'tomorrows'], likes: ['strawberry', 'flowers', 'paperback'], dislikes: ['goon'] },
  rayna: { loves: ['gaytime', 'strawberry'], likes: ['croissant', 'flowers'], dislikes: ['sardine'], assist: { selfAtk: 1, foeAtk: 1 } },
  deanna: { loves: ['seedling', 'olive'], likes: ['tomato', 'basil', 'flowers'], dislikes: ['crown'], assist: { heal: 0.2, selfDef: 1 } },
  shannon: { loves: ['monkeygrip', 'intermezzo', 'icedcoffee'], likes: ['croissant', 'flowers', 'paperback'], dislikes: ['vb'] },
  sam: { loves: ['takis', 'drpepper', 'snag'], likes: ['reeses', 'icedcoffee', 'vb'], dislikes: ['orangewine'] },
  bazza: { loves: ['redfin', 'eel', 'thermos'], likes: ['snag', 'vb', 'yabby'], dislikes: ['orangewine'] },
  franco: { loves: ['chianti', 'croissant'], likes: ['coopers', 'cheese', 'flowers'], dislikes: ['goon'] },
  dell: {
    loves: ['flowers', 'seedling', 'monkeygrip'], likes: ['magic', 'tomato', 'jacobs', 'borek'], dislikes: ['goon'],
    rewards: { 3: { item: 'chicken', n: 2 } },
    assist: { heal: 0.3, foeAtk: 1 },
  },
  // ---- Carlton and the city
  gina: {
    loves: ['strawberry', 'chianti', 'magic'], likes: ['lemon', 'basil', 'cannoli', 'flowers'], dislikes: ['goon'],
    rewards: { 3: { item: 'gelato', n: 2 }, 6: { item: 'gelatocone', n: 2 } },
    assist: { heal: 0.35 },
  },
  spruiker: { loves: ['chianti', 'cannoli'], likes: ['tomato', 'basil', 'crown'], dislikes: ['hotchips'], assist: { foeAtk: 1 } },
  enzo: {
    loves: ['tomato', 'chianti', 'lemon'], likes: ['basil', 'zucchini', 'longblack'], dislikes: ['moondog'],
    rewards: { 4: { item: 'lemon', n: 3 } },
    assist: { damage: 0.15 },
  },
  vince: { loves: ['basil', 'longblack'], likes: ['tomato', 'cannoli', 'draught'], dislikes: ['hahn'] },
  mia: { loves: ['icedcoffee', 'monkeygrip', 'gelatocone'], likes: ['magic', 'paperback', 'borek'], dislikes: ['crown'] },
  ana: { loves: ['byzbook', 'hangingrock', 'flowers'], likes: ['paperback', 'magic', 'seedling'], dislikes: ['goon'], assist: { foeDef: 1 } },
  jun: { loves: ['longblack', 'flowers'], likes: ['gelatocone', 'cannoli'], dislikes: ['umbrella'] },
  possumpat: { loves: ['headtorch', 'thermos'], likes: ['lemon', 'carrot', 'coopers'], dislikes: ['hotchips'] },
  chesskev: {
    loves: ['coopers', 'longblack'], likes: ['borek', 'jamdonut', 'paperback'], dislikes: ['orangewine'],
    rewards: { 4: { money: 30 } },
    assist: { selfDef: 2 },
  },
  luca: { loves: ['vb', 'hotchips'], likes: ['longblack', 'jamdonut'], dislikes: ['penfolds'] },
  margaret: {
    loves: ['middlemarch', 'janeeyre', 'monkeygrip'], likes: ['paperback', 'magic', 'flowers'], dislikes: ['goon'],
    rewards: { 3: { item: 'paperback', n: 1 } },
    assist: { foeAtk: 2 },
  },
  mai: { loves: ['magic', 'strawberry'], likes: ['gelatocone', 'jamdonut', 'flowers'], dislikes: ['koala'] },
  raelene: {
    loves: ['thermos', 'longblack', 'jamdonut'], likes: ['icedcoffee', 'flowers', 'gaytime'], dislikes: ['penfolds'],
    rewards: { 3: { item: 'longblack', n: 2 } },
    assist: { heal: 0.45 },
  },
  officer: { loves: ['mykicase', 'jamdonut'], likes: ['longblack', 'snag'], dislikes: ['hotchips'] },
  remy: {
    loves: ['orangewine', 'borek'], likes: ['croissant', 'cannoli', 'olivejar'], dislikes: ['icedcoffee'],
    rewards: { 3: { item: 'magic', n: 2 } },
    assist: { heal: 0.25, selfAtk: 1 },
  },
  spray: { loves: ['takis', 'moondog'], likes: ['hotchips', 'drpepper'], dislikes: ['umbrella'] },
  dev: { loves: ['flowers', 'gelatocone'], likes: ['magic', 'snowglobe'], dislikes: ['hotchips'] },
  marj: { loves: ['mykicase', 'icedcoffee'], likes: ['jamdonut', 'longblack'], dislikes: ['umbrella'] },
  dot: {
    loves: ['strawberry', 'thermos'], likes: ['jamdonut', 'longblack', 'vb'], dislikes: ['orangewine'],
    rewards: { 4: { item: 'jamdonut', n: 3 } },
    assist: { heal: 0.3, damage: 0.1 },
  },
  yianni: {
    loves: ['olive', 'chianti', 'tomato'], likes: ['cheese', 'borek', 'basil'], dislikes: ['hahn'],
    rewards: { 3: { item: 'prosciutto', n: 2 } },
    assist: { damage: 0.18 },
  },
  carmel: { loves: ['pumpkin', 'strawberry'], likes: ['tomato', 'zucchini', 'longblack'], dislikes: ['koala'] },
  chris: {
    loves: ['seedling', 'gloves', 'carrot'], likes: ['basil', 'zucchini', 'potato', 'fertiliser'], dislikes: ['croissant'],
    rewards: { 2: { item: 'carrot', n: 3 } },
    assist: { damage: 0.15, heal: 0.15 },
  },
  james: {
    loves: ['lemon', 'melbbitter'], likes: ['potato', 'chilli', 'tomato'], dislikes: ['basil'],
    assist: { heal: 0.3 },
  },
  pina: {
    loves: ['tomato', 'basil', 'olive'], likes: ['lemon', 'zucchini', 'chianti'], dislikes: ['goon'],
    rewards: { 4: { item: 'lemon', n: 3 } },
    assist: { heal: 0.4 },
  },
  hipster: {
    loves: ['orangewine', 'moondog'], likes: ['basil', 'chilli', 'croissant'], dislikes: ['vb', 'snag'],
    assist: { foeAtk: 1 },
  },
  golfer: {
    loves: ['crown', 'pumpkin'], likes: ['snag', 'tennis', 'xxxx'], dislikes: ['chilli'],
    assist: { foeDef: 1, selfAtk: 1 },
  },
  ...SH_FRIENDS,
};


Object.assign(FRIENDS, EAST_FRIENDS);   // Brunswick East
Object.assign(FRIENDS, NORTH_FRIENDS);   // Coburg and Preston

// Heart scenes and battle-help lines live in dialogue.js.
for (const [id, f] of Object.entries(FRIENDS)) {
  const t = PEOPLE[id] || {};
  if (t.heartScenes) f.events = t.heartScenes;
  if (f.assist && t.helpsInBattle) f.assist.line = t.helpsInBattle;
}

export const GENERIC_FRIEND = { loves: [], likes: ['croissant', 'snag', 'tomato', 'strawberry', 'flowers', 'gaytime', 'draught'], dislikes: [] };
export const friendInfo = id => FRIENDS[id] || GENERIC_FRIEND;
