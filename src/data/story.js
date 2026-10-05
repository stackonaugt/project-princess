// THE STORY: four chapters, then a pop-up saying more is coming.
// The words live here; the logic is in systems/story.js and the scenes in
// WorldScene (search for "story").
//
//   Chapter 1  Helen's Pet Training School   find every pet, train them, evolve one
//   Chapter 2  Get Bent!                     save Paddy from a spill (the dodgy fish pie)
//   Chapter 3  Boys Go Wild!                 the twins prank Helen's friends (Helen is away)
//   Chapter 4  Election Season               the September Babies Bash, then the vote
//
// A new chapter starts the morning after the last one finishes.

export const CHAPTERS = {
  1: {
    title: 'Helen\'s Pet Training School',
    intro: [
      'The new One Nation government has cancelled early childhood education. Every kinder and childcare centre in the country, gone, by press release.',
      'Helen has lost her job as an educator. That is also why the twins are home from daycare. All day. Every day.',
      'But Helen is undeterred. If she can\'t teach toddlers, she will teach pets. With a little help from two very small assistants.',
      'Helen\'s Pet Training School needs students. Round up all your friends\' pets, then train them up.',
    ],
    done: [
      'Every pet is found, trained and turned up for class. One of them has even evolved. Show-off.',
      'Helen\'s Pet Training School is officially open for business! The first lesson is "sit". The second is "please stop eating the curriculum".',
    ],
  },
  2: {
    title: 'Get Bent!',
    intro: [
      'Paddy\'s enemies on council have spotted a chance. One of his allies is away, and they want to roll him as mayor.',
      'There has to be some way to put one of them out of action. Something sneaky. Something fishy.',
    ],
    done: [
      'Cr Bentleigh is home with a very upset tummy, and the spill motion has nobody to move it.',
      'Paddy is still Mayor of Hobsons Bay. He does not ask how. He does not want to know.',
    ],
    failed: [
      'You ran out of time. On Tuesday night the spill went ahead, four votes to three.',
      'Cr Lesley Bentleigh is the new Mayor of Hobsons Bay. Paddy is plain old Cr McPherson again.',
      'Council motions will be twice as hard to pass from now on. Bentleigh controls the agenda. And the biscuits.',
    ],
  },
  3: {
    title: 'Boys Go Wild!',
    intro: [
      'Nanna Trish and Pop Gordon have caught gastro. Both of them. At the same time. Helen has gone to Woods St to look after them.',
      'That leaves the twins. Paddy is technically in charge. Paddy is on a council Zoom.',
      'The boys have a plan. The plan is pranks.',
    ],
    done: [
      'Helen is home. She has had eleven texts from her friends, and nine of them are photos of googly eyes.',
      '"I leave you two alone for ONE day..." She is trying very hard not to laugh. She is failing.',
    ],
  },
  4: {
    title: 'Election Season',
    intro: [
      'The Hobsons Bay council election is coming, and it\'s anyone\'s game.',
      'Helen and the twins have an idea: throw the biggest party Laverton has ever seen. The September Babies Bash.',
      'Finish the house, stock up on drinks and decorations, and invite everyone you know. The more friends turn up, the better Paddy\'s campaign goes.',
    ],
  },
};

// The objectives each chapter needs (checked in systems/story.js).
export const CH1 = { level: 10, trained: 3 };       // three pets at level 10, and one evolved
export const CH2_RECIPE = { fish: 1, lemon: 1 };     // any fish and a lemon make the dodgy pie
export const CH3_PRANKS = 3;                         // pranks needed
export const CH4 = { drinks: 6, decos: 4, invites: 6, rsvpHearts: 3, rooms: ['kitchen', 'twinsroom', 'study'] };

// Paddy turns up the first morning after Chapter 1.
export const PADDY_SPILL = [
  'Paddy: "Morning, love. Have you got a minute? Sit down. Actually, I\'ll sit down."',
  '"Rayna is away walking the Camino for a fortnight. Without her vote, Bentleigh and Dismay reckon they have the numbers."',
  '"They\'re moving a spill at council. They want to roll me as mayor."',
  '"I don\'t know what to do. If only one of THEM had to take a bit of leave too. Then it would be a tie, and a tie means I stay."',
  '"But that would never happen. Bentleigh hasn\'t had a sick day since 1987. She eats the same lunch in the foyer every weekday like clockwork."',
  '"Oh well. I\'m off to work. Wish me luck."',
];
export const PADDY_SPILL_HINT = 'Cr Bentleigh eats her lunch in the civic centre foyer every weekday, 11am to 3pm. If only something fishy happened to it.';

// Lesley's lunch on the foyer booth (Chapter 2).
export const LUNCH = {
  look: ['Cr Bentleigh\'s lunch: a kale and quinoa bowl. There is a sticky note on the lid.', '"LESLEY\'S. DO NOT TOUCH. THIS MEANS YOU, PADDY."'],
  noPie: 'You would need something to swap it with. Something... fishy. A kitchen would help.',
  watching: 'Cr Bentleigh is guarding her lunch like a magpie in spring. You need a distraction.',
  noPet: 'Bring a pet along. Nothing distracts a councillor like a dog in the civic centre.',
  distract: pet => [`${pet} tears across the foyer and does three laps of the reception desk.`, 'Cr Bentleigh: "WHO LET AN ANIMAL INTO THE CIVIC CENTRE?! I am writing to MYSELF about this!"', 'She storms off to find a ranger. Her lunch sits there, unguarded.'],
  swap: ['Quick! You swap the kale bowl for the dodgy fish pie and put the sticky note on top.'],
  eat: ['Cr Bentleigh: "Typical. No rangers anywhere. Right. LUNCH."', '"This kale tastes... fishy. Lemony. Warm, somehow."', '"Oh. Oh no. Oh, my tummy."', '"I need to go home. I may be some time. A WEEK, possibly."'],
};

// The kitchen (Chapter 2 onwards): what you can cook.
export const RECIPES = {
  fishpie: { name: 'Very dodgy fish pie', needs: 'any fish and a lemon', text: ['You bake the fish and the lemon into a pie. You leave it on the windowsill for three days, just to be sure.', 'It smells like the bottom of Kororoit Creek. Perfect.'] },
};

// Chapter 3: the twins' pranks. Talk to one of these friends and pick "Prank".
export const PRANKS = {
  paddy: { label: 'Whoopee cushion', lines: ['You hide a whoopee cushion under the cushion of Dad\'s chair.', 'Paddy sits down. PFFFFRRRRT.', 'Paddy: "That was the CHAIR. Everyone heard that it was the chair. ...Boys?"'] },
  corni: { label: 'Googly eyes', lines: ['You stick googly eyes on every can of Guinness in Corni\'s fridge.', 'Corni opens the fridge. Forty eyes look back at him.', 'Corni: "Mein Gott. They are watching me. I cannot drink something that is watching me."'] },
  mem: { label: 'Rubber mouse', lines: ['You leave a rubber mouse with a tiny plaster cast in Mem\'s lab coat pocket.', 'Mem: "Oh! A broken femur. Poor thing. Wait. Who has been reading my thesis?"'] },
  rose: { label: 'Swap the bookmark', lines: ['Rose has a bookmark in a nine hundred page novel. You move it back to page one.', 'Rose: "...Have I read this? I have read this. Haven\'t I? Oh no."'] },
  slinks: { label: 'Grape juice', lines: ['You swap Slinks\'s glass of shiraz for grape juice.', 'Slinks takes a sip. "Hmm. Fruit forward. Very... young. VERY young."', 'Slinks: "Boys. Where is my wine."'] },
  tim: { label: 'Toy train timetable', lines: ['You swap the Upfield line timetable on Tim\'s fridge for one you drew yourself. Every train is a dinosaur.', 'Tim: "Twenty minute frequency, all day, on a T-rex? That\'s better service than the real thing."'] },
  nicholas: { label: 'Dance-off', lines: ['You put on the Wiggles at full volume and challenge Nicholas to a dance-off.', 'Nicholas does a perfect pirouette. You fall over. Twice.', 'Nicholas: "I won, but you two have real stage presence."'] },
};
export const PRANK_AFTER = n => `"Got one!" Pranks pulled: ${n} of 3.`;

// Chapter 4: the news (the morning it starts) and the election result.
export const NEWS_OPEN = deposed => [
  'Good evening, and welcome to West is Best News.',
  'Hobsons Bay goes to the polls next week, and the race for council is wide open.',
  deposed
    ? 'Recently deposed mayor Paddy McPherson is fighting to win his old job back from Mayor Lesley Bentleigh. Locals say anything could happen.'
    : 'Mayor Paddy McPherson is up for re-election, after surviving a dramatic spill attempt and a mysterious outbreak of fish pie.',
  'Meanwhile in Laverton, the McPhersons are said to be planning a party. More after the weather: four seasons, in one day.',
];
export const NEWS_RESULT = (votes, won, deposed) => [
  'Good evening. This is West is Best News with the Hobsons Bay election result.',
  `The count is in. Paddy McPherson: ${votes}% of the vote.`,
  won
    ? (deposed ? 'Paddy McPherson wins back the mayoralty! Lesley Bentleigh has demanded a recount, then a re-recount, then a cup of tea.' : 'Paddy McPherson is re-elected Mayor of Hobsons Bay! The September Babies Bash is being called the turning point of the campaign.')
    : 'It is not quite enough. Paddy falls short this time, but locals say the September Babies Bash will be talked about for years.',
];

// Party invitations (Chapter 4): what friends say when you ask them.
export const RSVP = {
  yes: ['"A party? For the twins AND Paddy\'s campaign? We\'ll be there!"', '"Count me in. I\'ll bring a plate."', '"Wouldn\'t miss it. Is there a dress code? I\'m wearing a dress code."', '"Yes! I love a September baby."'],
  maybe: ['"Oh, maybe? I\'ll see how I go." (They\'d come if you were closer friends.)', '"I\'ll try! No promises." (Get to know them better first.)'],
};

// The party mini-games (ui/party.js).
export const TRIVIA = [
  { q: 'What is Mem doing her PhD on?', a: ['Muscle wastage while broken bones heal', 'Why magpies swoop', 'The history of the parma'], right: 0 },
  { q: 'What does Corni love more than anything?', a: ['Vegemite', 'Guinness', 'Kale smoothies'], right: 1 },
  { q: 'What does Gordon love?', a: ['Monster trucks', 'Byzantine art, plants and trees', 'Reality TV'], right: 1 },
  { q: 'Which flavour does Sinead vape?', a: ['Grape Ice', 'Watermelon', 'Mango Ice'], right: 2 },
  { q: 'What does Tim love, apart from trains?', a: ['Rome', 'Golf', 'Cricket'], right: 0 },
  { q: 'Who runs the garden centre at Bunnings?', a: ['Gaz', 'Olly', 'Ed'], right: 1 },
  { q: 'What does Rose do for work?', a: ['Works for a senator', 'Drives a tram', 'Sells couches'], right: 0 },
  { q: 'What did Nicholas used to do?', a: ['Play footy', 'Dance', 'Juggle'], right: 1 },
  { q: 'Where is Paddy mayor of?', a: ['Moreland', 'Hobsons Bay', 'Wyndham'], right: 1 },
];

// The end of the story (for now).
export const THE_END = [
  'That\'s it for now!',
  'Thanks for playing Project Princess. You can keep playing: the pets, the garden, the council and the shops are all still here.',
  'More is planned if people want it: Coburg and Preston as full suburbs, Brunswick East, Carlton and the CBD, and a big Meredith finale. Tell Seb if you want more!',
];
