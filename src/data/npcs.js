// People around town. They give hints and the occasional treat.
// Where they stand is set in each map file (b.npc(...)).
//
//  look   how the built-in sprite looks (see src/art/paint/people.js)
//  lines  a list of conversations; one is picked each time you talk
//  hints  { petId: line } shown while you still haven't found that pet
//  gift   item id they give you once a day

export const NPCS = {
  trish: {
    name: 'Trish', role: "Helen's mum. Lives at 72 Woods St", look: { hair: '#d8d4cc', hairStyle: 'pixie', skin: '#f0c8a8', shirt: '#c8ccd0', pants: '#c8ccd0', shoes: '#6a5a4a', glasses: '#6a4a2a', scarf: '#3a8a6a', collar: true },
    lines: [
      ['Oh hello, love! Have you eaten? There is a casserole in the freezer with your name on it.'],
      ['How is the renovation going? Tell Helen to ring me. She never rings.', 'Well, she rang yesterday. But she never rings.'],
      ['This was Helen and Paddy\'s place, you know. Now it is ours. The colourful tiles stay. Gordon is not allowed to touch them.'],
    ],
    hints: { princess: 'Princess will be out on Allen St, guarding the court. Bring her a ribbon. She likes to look her best.' },
    gift: 'chicken', giftLine: 'Here, take some treats for the dogs. I buy them in bulk. Do not tell Gordon how much bulk.',
  },
  gordon: {
    name: 'Gordon', role: "Helen's dad. Beard of legend", look: { hair: '#c8c4bc', hairStyle: 'bald', skin: '#e8a890', shirt: '#2a3a5a', pants: '#2a2a2a', shoes: '#4a3a2a', longBeard: '#e8e4dc' },
    lines: [
      ['Morning. The agapanthus are taking over. I have given up fighting them. We have an understanding now.'],
      ['People keep asking if I am Santa. I tell them Santa wishes he had this beard.'],
      ['Watch the magpies round here in spring. They know your face. They hold grudges.'],
      ['Paddy borrowed my good ladder for the renovation. That was in March. Which March, I could not tell you.'],
    ],
    hints: { princess: 'The poodle? Over on Allen St. Do not let her size fool you. She once chased off a council truck.' },
  },
  gaz: {
    name: 'Gaz', role: 'Sausage sizzle volunteer', look: { hair: '#8a8d94', hairStyle: 'bald', skin: '#e8b48a', shirt: '#c8443a', pants: '#3a3a48', apron: '#f4efe0', moustache: true },
    lines: [
      ['Snag? Onions go on the bottom, mate. Stops them falling out. It is science.'],
      ['Been running this sizzle for eleven years. Raised enough for three new netball uniforms and a defibrillator.'],
      ['People ask why I do it. Free sausages, community, and nobody can make me use a vegetarian tong. Wait, yes they can. Fair enough.'],
    ],
    hints: { princess: 'Little white poodle on Allen St barks at my ute every morning. Fair dinkum security guard, that one.' },
    gift: 'snag', giftLine: 'Here, have a snag in bread. On the house. Do not tell the hardware barn.',
  },
  marisol: {
    name: 'Marisol', role: 'Forklift driver', look: { hair: '#2a1a0c', hairStyle: 'bun', skin: '#c88a5a', shirt: '#e8823a', pants: '#2f4a6a', hivis: true },
    lines: [
      ['Just knocked off a ten hour shift. My feet have opinions.'],
      ['We won our new agreement last month. Proper breaks, a heat policy, and pay that keeps up with rent.', 'Turns out when everyone signs up to the union at once, the boss suddenly finds the money.'],
      ['Mind the forklifts. They beep for a reason.'],
    ],
    hints: { princess: 'If you are looking for animals, try Allen St. There is a poodle there who thinks she runs Laverton. Honestly, she might.' },
  },
  commuter: {
    name: 'Commuter', role: 'Waiting for the Werribee line', look: { hair: '#5a3a1a', hairStyle: 'short', skin: '#f2c79a', shirt: '#5a6a8a', pants: '#2a2a2a', collar: true, glasses: true },
    lines: [
      ['Train is delayed. Again. I have read the whole timetable twice for fun.'],
      ['Tip: tap your myki at the green reader and you can catch a train to any station you have already visited.'],
      ['Replacement buses this weekend. Replacement buses every weekend. I have made friends with the bus driver.'],
    ],
  },
  jules: {
    name: 'Jules', role: 'Barista', look: { hair: '#e8823a', hairStyle: 'bob', skin: '#f2c79a', shirt: '#2f5b4a', pants: '#3a3a48', apron: '#6b4226' },
    lines: [
      ['Oat flat white? We also do a pour-over that tastes like a bushfire, in a good way.'],
      ['My rent went up again. I make the coffee for the guy who owns my flat. He tips in exposure.'],
      ['If you see a tabby in the lane, that is Salami. She gets the milk froth on Fridays. Do not tell my manager.'],
    ],
    hints: { salami: 'There is a stripy menace in the bluestone lane behind the terraces. Watch your ankles.', spooky: 'Night shift staff say there is a black bunny in the park that turns see-through. I think they need more sleep.' },
    gift: 'croissant', giftLine: 'We have a spare almond croissant. Take it before I eat it.',
  },
  busker: {
    name: 'Busker', role: 'Plays outside the op shop', look: { hair: '#3a2412', hairStyle: 'curly', skin: '#8a5a3a', shirt: '#a24fc9', pants: '#3a6aa8', beard: true },
    lines: [
      ['This next song is called "No Fault Evictions Are Still Somebody\'s Fault". Thank you, thank you.'],
      ['I know four chords and I use all of them. Every song is about the 19 tram.'],
      ['Spare change? No? Then spare a compliment. Thank you, that one was lovely.'],
    ],
    hints: { spooky: 'Played a late gig in the park last week. A bunny watched the whole set, then disappeared. Best crowd I have ever had.' },
  },
  priya: {
    name: 'Priya', role: 'Dog walker', look: { hair: '#1e1e24', hairStyle: 'long', skin: '#a8724a', shirt: '#3fa38f', pants: '#5a5a66' },
    lines: [
      ['Six dogs today. Four of them are called Luna.'],
      ['The ducks in this pond are absolute bullies. I respect them.'],
      ['Walking dogs is a real job, you know. The Lunas and I are thinking of unionising.'],
    ],
    hints: { spooky: 'Have you seen the black bunny by the pond? She is shy in daylight. Come back after dark and she is easier to spot.' },
  },
  pina: {
    name: 'Nonna Pina', role: 'Grower of lemons', look: { hair: '#e8e4d8', hairStyle: 'bun', skin: '#e8b48a', shirt: '#2a2a3a', pants: '#2a2a3a', glasses: true },
    lines: [
      ['You look skinny. Are you eating? You are not eating.'],
      ['Fifty years in this house. The lemon tree is older than my son and better behaved.'],
      ['That schnauzer next door, he is very clever. Like a little professor. He likes cheese, not lemons. Nobody likes my lemons except the bunny people.'],
    ],
    hints: { stanley: 'The grey dog on the footpath? Stanley. He is a gentleman. Do not chase him, he hates that. Bring him something fancy to eat.' },
    gift: 'lemon', giftLine: 'Take a lemon. Take two. The tree, she never stops.',
  },
  dimitri: {
    name: 'Dimitri', role: 'Runs the milk bar', look: { hair: '#3a3a3a', hairStyle: 'short', skin: '#d8a070', shirt: '#f4efe0', pants: '#3a3a48', moustache: true, apron: '#2f6aa3' },
    lines: [
      ['Milk bar has been in the family since 1974. We still sell the bags of mixed lollies. Twenty cents each. Inflation.'],
      ['The new supermarket down the road has self-checkouts. I have a self too. I am right here.'],
      ['Everyone comes in for cheese sticks for that schnauzer. Very particular dog. He only likes the good brand.'],
    ],
    hints: { stanley: 'Stanley comes past every afternoon to judge my window display. If you want him to like you, cheese. Trust me.' },
    gift: 'cheese', giftLine: 'Here, a cheese stick. For the schnauzer. Or for you. I do not judge, unlike the schnauzer.',
  },
  wen: {
    name: 'Wen', role: 'Community gardener', look: { hair: '#1e1e24', hairStyle: 'cap', cap: '#6aa83a', skin: '#f0c8a0', shirt: '#8aa858', pants: '#6b4226' },
    lines: [
      ['The plots open soon. You will be able to grow your own vegies here.', 'Carrots, lettuce, maybe a pumpkin if the possums allow it.'],
      ['Gardening is mostly fighting snails and losing gracefully.'],
      ['Community gardens are the best kind of property: everyone shares it and nobody profits off it.'],
    ],
    hints: { poppy: 'There is a frenchie by the lake who keeps digging under my fence. She has never found anything. She will never stop.' },
    gift: 'carrot', giftLine: 'Have a carrot from my plot. Bunnies go wild for them.',
  },
  kez: {
    name: 'Kez', role: 'Jogging the lake loop', look: { hair: '#f5d63a', hairStyle: 'bun', skin: '#f2c79a', shirt: '#e77fb8', pants: '#1e1e24', shoes: '#f4f4f0' },
    lines: [
      ['Cannot stop! Lap twelve! Talk while I run!'],
      ['This loop is exactly one point eight kilometres. I have measured it four hundred times.'],
    ],
    hints: { poppy: 'There is a frenchie by the picnic tables who keeps trying to race me. She has never won. She has never stopped trying.' },
  },
};
