// Crops for the community garden plots and the backyard veggie patch.
//
//   days     days of growth needed (a day counts if you watered it, or it rained)
//   seed     price of a packet of seeds at Gaz's or Dimitri's
//   sell     what Dimitri pays for one at the milk bar
//   yield    how many you pick at harvest
//   regrow   if set, the plant keeps producing: after picking it needs this many more days
//   colour   the produce colour (crop sprites and seed packets)
// The harvested crop is an item with the same id (see items.js).
export const CROPS = {
  basil:      { name: 'Basil', days: 2, seed: 3, sell: 6, yield: 2, regrow: 2, colour: '#4fa04a', blurb: 'Grows fast. The hipster pays extra for "microgreens".' },
  carrot:     { name: 'Carrot', days: 3, seed: 4, sell: 8, yield: 2, colour: '#e8822a', blurb: 'Spooky\'s absolute favourite.' },
  zucchini:   { name: 'Zucchini', days: 3, seed: 4, sell: 8, yield: 3, colour: '#3f8a3e', blurb: 'You will have too many. Everyone always has too many.' },
  potato:     { name: 'Potato', days: 4, seed: 4, sell: 9, yield: 3, colour: '#c8a060', blurb: 'Dig them up. Poppy is VERY good at this.' },
  tomato:     { name: 'Tomato', days: 4, seed: 5, sell: 11, yield: 2, regrow: 2, colour: '#d8403a', blurb: 'Nonna says yours are good. Not as good as hers.' },
  strawberry: { name: 'Strawberry', days: 4, seed: 6, sell: 13, yield: 2, regrow: 3, colour: '#e83a5a', blurb: 'Princess will do anything for one.' },
  chilli:     { name: 'Chilli', days: 5, seed: 6, sell: 14, yield: 3, regrow: 3, colour: '#e8502a', blurb: 'Fire-type pets love these in a battle.' },
  pumpkin:    { name: 'Pumpkin', days: 6, seed: 8, sell: 24, yield: 1, colour: '#e89030', blurb: 'Huge. A whole battle\'s worth of energy.' },
};
export const CROP_ORDER = Object.keys(CROPS);
