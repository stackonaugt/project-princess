// The shops. An NPC with `shop: '<id>'` in npcs.js opens one of these when
// you talk to them (see ui/shop.js). Tabs:
//   treats   pet treats from items.js (with a price, not crops, drinks or presents) (list `treats` to limit which;
//            local: true treats are left out unless listed)
//   spells   the milk bar sorceress's protection spells (data/east.js). Prices move every day
//   gear     pet gear from gear.js
//   seeds    seed packets for crops.js (list `seeds` to limit which)
//   tools    garden tools from upgrades.js (tool: true)
//   upgrades house upgrades from upgrades.js
//   gifts    presents for friends (list `gifts`: item ids)
//   drinks   the bottle shop's beers and wines (items with drink: true)
//   books    the bookshop's novels (items with book: true)
//   lollies  the convenience store's American lollies (lolly: true)
//   vapes    vapes (vape: true). List it in `adultTabs` and toddlers are turned away from that tab
//   fishing  the fishing rod (a tool in upgrades.js) and bait
//   furniture couches for the house (data/furniture.js)
//   fish     sell the fish you catch (Spiro pays 50% more than anyone else)
//   party    party decorations (items with deco: true), for the Chapter 4 party
//   sell     sell crops and treats from your bag (crops at their price, treats at half)
import { NORTH_SHOPS } from './north.js';
import { SH_SHOPS } from './summerhill.js';

export const SHOPS = {
  petshop: { name: 'The Leash You Can Do', where: 'Hope St, Brunswick', tabs: ['treats', 'gear'] },
  bunnings: { name: 'Bunnings Warehouse', where: 'Kororoit Creek Rd, Altona North', tabs: ['seeds', 'tools', 'upgrades', 'party', 'gifts'], gifts: ['seedling', 'olive', 'gloves', 'fertiliser'] },
  milkbar: { name: 'James\'s Milk Bar', where: 'Reservoir Station', tabs: ['sell', 'seeds', 'treats', 'gifts'], seeds: ['tomato', 'strawberry', 'chilli', 'basil'], gifts: ['gaytime', 'icedcoffee', 'flowers', 'paperback', 'byzbook', 'modeltrain'] },
  bookshop: { name: 'Brunswick Bound', where: 'Sydney Rd, Brunswick', tabs: ['books'] },
  anaconda: { name: 'Anaconda', where: 'Plenty Rd, Preston', tabs: ['fishing', 'gifts'], gifts: ['thermos', 'headtorch'] },
  cozzo: { name: 'Franco Cozzo', where: 'Barkly St, Footscray', tabs: ['furniture'] },
  fishvan: { name: 'Spiro\'s Fish Van', where: 'Kororoit Creek Rd, Altona North', tabs: ['fish'] },
  vapeshop: { name: 'Plenty Road Convenience', where: 'Plenty Rd, Preston', tabs: ['lollies', 'vapes'], adultTabs: ['vapes'] },
  // Carlton and the city
  gelateria: { name: 'Gelateria', where: 'Lygon St, Carlton', tabs: ['treats', 'gifts'], treats: ['gelato', 'cannoli'], gifts: ['gelatocone'] },
  donuts: { name: 'Hot Jam Donut Van', where: 'Fed Square', tabs: ['treats'], treats: ['jamdonut', 'hotchips'] },
  qvdeli: { name: 'Yianni\'s Deli', where: 'Fed Square', tabs: ['treats', 'gifts'], treats: ['prosciutto', 'cheese', 'sardine'], gifts: ['olivejar', 'borek'] },
  fruit: { name: 'Carmel\'s Fruit and Veg', where: 'Fed Square', tabs: ['sell', 'seeds'], seeds: ['strawberry', 'tomato', 'zucchini', 'pumpkin'] },
  souvenirs: { name: 'Melbourne Souvenirs', where: 'Fed Square', tabs: ['gifts'], gifts: ['snowglobe', 'koala', 'umbrella', 'mykicase'] },
  coffeecart: { name: 'Remy\'s Coffee Cart', where: 'Degraves St', tabs: ['gifts'], gifts: ['longblack', 'magic'] },
  bottleshop: { name: 'Edinburgh Castle Bottleshop', where: 'Sydney Rd, Brunswick', tabs: ['drinks'], adults: true },
  ...SH_SHOPS,
};

import { EAST_SHOPS } from './east.js';
Object.assign(SHOPS, EAST_SHOPS);   // Brunswick East
Object.assign(SHOPS, NORTH_SHOPS);   // Coburg and Preston
