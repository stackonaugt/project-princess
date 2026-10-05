// Council motions: the game's version of the Stardew community centre.
// Each motion is pinned on the noticeboard in the Hobsons Bay civic centre
// foyer. Chip in what it needs (items from your bag, or money) and it goes to
// the next council meeting (Tuesday 6:30pm). It passes with 4 of 7 votes:
//
//   Paddy, Rayna and Deanna always vote yes.
//   Lesley and Malcolm always vote no.
//   Kirsty and Dahlia are the swing votes: they vote yes once you are friends
//   enough (SWING hearts), so bring them presents.
//
// A motion that passes changes the world (`effect`, handled in state.passMotion
// and the maps that check state.motionPassed(id)).
//
//   needs    { itemId: count, money: dollars }
//   sponsor  the councillor who moved it (for the debate)
//   debate   lines said in the chamber when it comes up
//   effect   a short line telling you what changed

export const SWING = { kirsty: 4, dahlia: 2 };
export const ALLIES = ['paddy', 'rayna', 'deanna'];
export const AGAINST = ['lesley', 'malcolm'];

export const MOTIONS = {
  bikelane: {
    title: 'A protected bike lane from Laverton to Brunswick',
    needs: { money: 150 },
    sponsor: 'deanna',
    debate: ['Cr Grimes: "Safe bike lanes all the way in. Fewer cars, cleaner air, happier calves."', 'Cr Bentleigh: "BIKE LANES! IN THIS ECONOMY?"'],
    effect: 'The long walks between suburbs now take half the time.',
  },
  gardenplus: {
    title: 'Expand the Edgars Creek community garden',
    needs: { carrot: 3, tomato: 2, seedling: 2 },
    sponsor: 'dahlia',
    debate: ['Cr Kellandra: "Four more plots. Fresh food, grown by locals, for locals."', 'Cr Dismay: "That land could be a car park."'],
    effect: 'Four more plots at the community garden in Reservoir.',
  },
  dogpark: {
    title: 'An off-lead dog park at Lohse St Reserve',
    needs: { tennis: 3, chicken: 2 },
    sponsor: 'rayna',
    debate: ['Cr Hawley: "Dogs need space to run. So do toddlers, frankly."', 'Cr Bentleigh: "DOGS! EVERYWHERE! UNLEASHED!"'],
    effect: 'Pets on your team get a little friendship every day you visit Lohse St Reserve.',
  },
  bookswap: {
    title: 'A street library at Lohse St Reserve',
    needs: { paperback: 3, money: 20 },
    sponsor: 'paddy',
    debate: ['Mayor Paddy: "A little box of free books. Take one, leave one. That is the whole motion."', 'Cr Dismay: "Who will police the books?"'],
    effect: 'A free book appears in the street library at Lohse St Reserve every day.',
  },
  trees: {
    title: 'Plant street trees along Allen St',
    needs: { seedling: 4, olive: 1, money: 40 },
    sponsor: 'deanna',
    debate: ['Cr Grimes: "Shade, birds, cooler footpaths. Trees are infrastructure."', 'Cr Bentleigh: "LEAVES! IN MY GUTTERS!"'],
    effect: 'New street trees and native garden beds along Allen St.',
  },
};
export const MOTION_ORDER = Object.keys(MOTIONS);

// Has everything this motion needs been chipped in?
export function motionReady(id, given = {}) {
  return Object.entries(MOTIONS[id].needs).every(([k, n]) => (given[k] || 0) >= n);
}
