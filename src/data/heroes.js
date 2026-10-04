// Who you play as. Picked at the start of a new game (and once for older
// saves). Each has a perk and different starting treats.
//
//   look   how the built-in sprite looks (see src/art/paint/people.js)
//   perk   what makes them different; the game checks these flags:
//            talkBonus  extra friendship from the first chat each day
//            runBoost   faster running
//            forageBonus  chance of finding two treats instead of one
//   start  treats in your bag on day one
// Custom art: assets/sprites/player/<id>-down.png (or plain down.png for everyone).

export const HEROES = {
  helen: {
    name: 'Helen', blurb: 'Princess\'s human. Knows every dog in Laverton by name.',
    perkName: 'Pet whisperer', perk: { talkBonus: 10 }, perkText: 'Chats make pets like you faster.',
    look: { hair: '#7a4a2a', hairStyle: 'long', skin: '#f2c79a', shirt: '#c86a8a', pants: '#3a4a6a', shoes: '#3a2418' },
    start: { ribbon: 1, chicken: 2 },
  },
  hadrian: {
    name: 'Hadrian', blurb: 'One of the twins. Has never once walked when he could run.',
    perkName: 'Zoomies', perk: { runBoost: 1.3 }, perkText: 'Runs faster than anyone in Melbourne.',
    look: { baby: true, hair: '#e8cc8a', skin: '#f6d4b4', shirt: '#5a8ad0', motif: '#3a9a5a', shoes: '#f4f4f0' },
    start: { tennis: 2, carrot: 1 },
  },
  aleksy: {
    name: 'Aleksy', blurb: 'The other twin. Will find a snack anywhere. Under the couch. In your pocket.',
    perkName: 'Snack magnet', perk: { forageBonus: 0.5 }, perkText: 'Sometimes finds two treats instead of one.',
    look: { baby: true, hair: '#d8b878', skin: '#f6d4b4', shirt: '#6aa86a', motif: '#e8c030', shoes: '#f4f4f0' },
    start: { cheese: 1, sardine: 1, croissant: 1 },
  },
};
export const HERO_ORDER = ['helen', 'hadrian', 'aleksy'];
