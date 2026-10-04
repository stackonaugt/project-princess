// Things you can inspect around town. Keyed by object kind (and variant).
// Each entry is a list of possible conversations; one is picked at random.
export const FLAVOUR = {
  brickhouse: [['Nobody is home. A sticker on the letterbox says NO JUNK MAIL, which has been ignored by everyone.'], ['You can hear a TV through the window. It is the footy replay. It is always the footy replay.']],
  weatherboard: [['The verandah has a cane chair, a pot plant and a sleeping cat that is definitely not a pet in this game.'], ['Someone inside is cooking with a lot of garlic. You are not invited, but you are tempted.']],
  terrace: [['A Victorian terrace, about 130 years old. Rent: astronomical. Insulation: none.'], ['A sign in the window says "Brunswick says NO to the new development". Another window says "YES". Neighbours.']],
  cafe: [['The cafe smells like coffee and ambition. There is a queue. There is always a queue.']],
  'shop:records': [['The record shop has a whole crate labelled "Melbourne bands you have never heard of". You have heard of none of them.']],
  'shop:pho': [['The best pho on Sydney Rd, according to a handwritten sign. Also according to everyone.']],
  'shop:books': [['A secondhand bookshop. There is a cat asleep on the poetry section. It is not a pet in this game. It is just a cat.']],
  'shop:milk bar': [['The milk bar. Bags of mixed lollies, a dusty ice cream sign, and Dimitri knows everyone by name.']],
  'shop:bakery': [['The bakery window is full of vanilla slices and something called a "custard scroll extravaganza".']],
  shed: [['A big tin shed. Something inside goes clank, then whirr, then clank again.'], ['A sign on the door: "Safety is everyone\'s job. So is a fair go." Someone has added a union sticker underneath.']],
  warehouse: [['The Hardware Barn. You could spend three hours in here and come out with only a sausage and a potted fern.']],
  container: [['A shipping container. It has been to more countries than you have.']],
  car: [['A parked car. There is a sun shade in the windscreen that says "BACK OFF, I AM HOT".'], ['A parked car with a P-plate. It has been parked very, very carefully.']],
  trolley: [['An abandoned shopping trolley. A Melbourne native, roaming free far from its home supermarket.']],
  crate: [['A milk crate. Possibly Salami\'s. Probably Salami\'s.']],
  bin: [['A wheelie bin. Red for rubbish, yellow for recycling, green for garden. Everyone gets it wrong.'], ['It is not bin night. You check anyway. Everyone checks anyway.']],
  letterbox: [['The letterbox is full of pizza menus and one very sad electricity bill.']],
  bench: [['You sit down for a moment. Your feet thank you.'], ['A little plaque on the bench reads "For Jan, who loved this spot".']],
  picnic: [['A picnic table. Someone has carved "K + M 4EVA" into it. Love is real.']],
  bbq: [['A free council barbecue. Still warm. The sausage-shaped burn marks tell a story.']],
  swings: [['You have a quick go on the swings. Nobody saw. Probably.']],
  slide: [['The slide is hot from the sun. You decide not to risk it.']],
  mural: [['A street art mural. There is a giant friendly cat in the middle. Brunswick really loves its cats.']],
  sizzle: [['The sausage sizzle. Talk to Gaz if you want a snag.']],
  tank: [['A rainwater tank. Tap it and it goes "bonnnng". You do this several times.']],
  tramstop: [['Route 19 to the city. Next tram: "soon". It has said "soon" for a while.']],
  plane: [['A retired air force trainer. You pretend to fly it. Nobody can stop you.']],
  shelter: [['A station shelter. Tap your myki at the green reader to catch a train.']],
};

export function flavourFor(kind, variant) {
  return FLAVOUR[`${kind}:${variant}`] || FLAVOUR[kind] || null;
}
