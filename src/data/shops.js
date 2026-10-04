// The shops. An NPC with `shop: '<id>'` in npcs.js opens one of these when
// you talk to them (see ui/shop.js). Tabs:
//   treats   pet treats from items.js (with a price)
//   gear     pet gear from gear.js
//   seeds    seed packets for crops.js (list `seeds` to limit which)
//   upgrades house upgrades from upgrades.js
//   sell     sell crops and treats from your bag (crops at their price, treats at half)
export const SHOPS = {
  olly: { name: 'The Leash You Can Do', where: 'Hope St, Brunswick', tabs: ['treats', 'gear'] },
  gaz: { name: 'Gaz\'s Sizzle and Seeds', where: 'Laverton Station', tabs: ['seeds', 'upgrades'], seeds: ['basil', 'carrot', 'zucchini', 'potato', 'pumpkin'] },
  dimitri: { name: 'Dimitri\'s Milk Bar', where: 'Reservoir Station', tabs: ['sell', 'seeds', 'treats'], seeds: ['tomato', 'strawberry', 'chilli', 'basil'] },
};
