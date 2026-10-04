// Gear: things you buy at the pet shop and put on a pet (one each) for a
// bonus in battles. Icons are drawn in src/art/paint/items.js (GEAR_ART),
// or swap in assets/sprites/items/gear-<id>.png.
//
//   bonus  attack / defence / speed / special: stat multiplier
//          crit: extra chance of a lucky hit
//          regen: fraction of max HP back at the end of every turn
//          xp: experience multiplier
export const GEAR = {
  lead:    { name: 'Sturdy lead', price: 30, desc: '+15% defence. Keeps them grounded.', bonus: { defence: 1.15 } },
  collar:  { name: 'Studded collar', price: 35, desc: '+15% attack. Very punk.', bonus: { attack: 1.15 } },
  harness: { name: 'Zoomies harness', price: 35, desc: '+20% speed. Gets them in first.', bonus: { speed: 1.2 } },
  bell:    { name: 'Jingle bell', price: 30, desc: '+20% special. Extremely distracting.', bonus: { special: 1.2 } },
  bandana: { name: 'Lucky bandana', price: 40, desc: 'More lucky hits.', bonus: { crit: 0.08 } },
  pouch:   { name: 'Snack pouch', price: 55, desc: 'A little energy back every turn.', bonus: { regen: 0.06 } },
  bowtie:  { name: 'Fancy bow tie', price: 45, desc: '+30% experience from battles. Learning is classy.', bonus: { xp: 1.3 } },
};
export const GEAR_ORDER = Object.keys(GEAR);
