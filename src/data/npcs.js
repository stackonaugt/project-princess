// People around town. They give hints and the occasional treat.
// Where they stand is set in each map file (b.npc(...)).
//
//  pal    hair (h), skin (s), shirt (c), pants (l) colours for the built-in sprite
//  lines  a list of conversations; one is picked each time you talk
//  hints  { petId: line } shown while you still haven't found that pet
//  gift   item id they give you once a day

export const NPCS = {
  gaz: {
    name: 'Gaz', role: 'Sausage sizzle volunteer', pal: { h: '#8a8d94', s: '#e8b48a', c: '#c8443a', l: '#3a3a48' },
    lines: [
      ['Snag? Onions go on the bottom, mate. Stops them falling out. It is science.'],
      ['Been running this sizzle for eleven years. Raised enough for three new netball uniforms and a defibrillator.'],
      ['People ask why I do it. Free sausages, community, and nobody can make me use a vegetarian tong. Wait, yes they can. Fair enough.'],
    ],
    hints: { princess: 'Little white poodle down Kookaburra Court barks at my ute every morning. Fair dinkum security guard, that one.' },
    gift: 'snag', giftLine: 'Here, have a snag in bread. On the house. Do not tell the hardware barn.',
  },
  marisol: {
    name: 'Marisol', role: 'Forklift driver', pal: { h: '#2a1a0c', s: '#c88a5a', c: '#e8b730', l: '#2f4a6a' },
    lines: [
      ['Just knocked off a ten hour shift. My feet have opinions.'],
      ['We won our new agreement last month. Proper breaks, a heat policy, and pay that keeps up with rent.', 'Turns out when everyone signs up to the union at once, the boss suddenly finds the money.'],
      ['Mind the forklifts. They beep for a reason.'],
    ],
    hints: { princess: 'If you are looking for animals, try the court across the road. There is a poodle there who thinks she runs Laverton. Honestly, she might.' },
  },
  commuter: {
    name: 'Commuter', role: 'Waiting for the Werribee line', pal: { h: '#5a3a1a', s: '#f2c79a', c: '#5a6a8a', l: '#2a2a2a' },
    lines: [
      ['Train is delayed. Again. I have read the whole timetable twice for fun.'],
      ['Tip: tap your myki at the green reader and you can catch a train to any station you have already visited.'],
      ['Replacement buses this weekend. Replacement buses every weekend. I have made friends with the bus driver.'],
    ],
  },
  jules: {
    name: 'Jules', role: 'Barista', pal: { h: '#e8823a', s: '#f2c79a', c: '#2f5b4a', l: '#3a3a48' },
    lines: [
      ['Oat flat white? We also do a pour-over that tastes like a bushfire, in a good way.'],
      ['My rent went up again. I make the coffee for the guy who owns my flat. He tips in exposure.'],
      ['If you see a tabby in the lane, that is Salami. She gets the milk froth on Fridays. Do not tell my manager.'],
    ],
    hints: { salami: 'There is a stripy menace in the bluestone lane behind the terraces. Watch your ankles.', spooky: 'Night shift staff say there is a black bunny in the park that turns see-through. I think they need more sleep.' },
    gift: 'croissant', giftLine: 'We have a spare almond croissant. Take it before I eat it.',
  },
  busker: {
    name: 'Busker', role: 'Plays outside the op shop', pal: { h: '#3a2412', s: '#8a5a3a', c: '#a24fc9', l: '#3a6aa8' },
    lines: [
      ['This next song is called "No Fault Evictions Are Still Somebody\'s Fault". Thank you, thank you.'],
      ['I know four chords and I use all of them. Every song is about the 19 tram.'],
      ['Spare change? No? Then spare a compliment. Thank you, that one was lovely.'],
    ],
    hints: { spooky: 'Played a late gig in the park last week. A bunny watched the whole set, then disappeared. Best crowd I have ever had.' },
  },
  priya: {
    name: 'Priya', role: 'Dog walker', pal: { h: '#1e1e24', s: '#a8724a', c: '#3fa38f', l: '#5a5a66' },
    lines: [
      ['Six dogs today. Four of them are called Luna.'],
      ['The ducks in this pond are absolute bullies. I respect them.'],
      ['Walking dogs is a real job, you know. The Lunas and I are thinking of unionising.'],
    ],
    hints: { spooky: 'Have you seen the black bunny by the pond? She is shy in daylight. Come back after dark and she is easier to spot.' },
  },
  pina: {
    name: 'Nonna Pina', role: 'Grower of lemons', pal: { h: '#e8e4d8', s: '#e8b48a', c: '#2a2a3a', l: '#2a2a3a' },
    lines: [
      ['You look skinny. Are you eating? You are not eating.'],
      ['Fifty years in this house. The lemon tree is older than my son and better behaved.'],
      ['That schnauzer next door, he is very clever. Like a little professor. He likes cheese, not lemons. Nobody likes my lemons except the bunny people.'],
    ],
    hints: { stanley: 'The grey dog on the footpath? Stanley. He is a gentleman. Do not chase him, he hates that. Bring him something fancy to eat.' },
    gift: 'lemon', giftLine: 'Take a lemon. Take two. The tree, she never stops.',
  },
  dimitri: {
    name: 'Dimitri', role: 'Runs the milk bar', pal: { h: '#3a3a3a', s: '#d8a070', c: '#f4efe0', l: '#3a3a48' },
    lines: [
      ['Milk bar has been in the family since 1974. We still sell the bags of mixed lollies. Twenty cents each. Inflation.'],
      ['The new supermarket down the road has self-checkouts. I have a self too. I am right here.'],
      ['Everyone comes in for cheese sticks for that schnauzer. Very particular dog. He only likes the good brand.'],
    ],
    hints: { stanley: 'Stanley comes past every afternoon to judge my window display. If you want him to like you, cheese. Trust me.' },
    gift: 'cheese', giftLine: 'Here, a cheese stick. For the schnauzer. Or for you. I do not judge, unlike the schnauzer.',
  },
  wen: {
    name: 'Wen', role: 'Community gardener', pal: { h: '#1e1e24', s: '#f0c8a0', c: '#6aa83a', l: '#6b4226' },
    lines: [
      ['The plots open soon. You will be able to grow your own vegies here.', 'Carrots, lettuce, maybe a pumpkin if the possums allow it.'],
      ['Gardening is mostly fighting snails and losing gracefully.'],
      ['Community gardens are the best kind of property: everyone shares it and nobody profits off it.'],
    ],
    hints: { poppy: 'There is a frenchie by the lake who keeps digging under my fence. She has never found anything. She will never stop.' },
    gift: 'carrot', giftLine: 'Have a carrot from my plot. Bunnies go wild for them.',
  },
  kez: {
    name: 'Kez', role: 'Jogging the lake loop', pal: { h: '#f5d63a', s: '#f2c79a', c: '#e77fb8', l: '#1e1e24' },
    lines: [
      ['Cannot stop! Lap twelve! Talk while I run!'],
      ['This loop is exactly one point eight kilometres. I have measured it four hundred times.'],
    ],
    hints: { poppy: 'There is a frenchie by the picnic tables who keeps trying to race me. She has never won. She has never stopped trying.' },
  },
};
