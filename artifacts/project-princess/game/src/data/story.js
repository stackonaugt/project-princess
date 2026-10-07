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

import { authoredValue } from '../authoring/overrides.js';
export let CHAPTERS = {
  1: {
    title: 'Helen\'s Pet Training School',
    intro: [
      'Helen has lost her job as an educator. That is also why the twins are home from daycare. All day. Every day.',
      'But Helen is undeterred. If she can\'t teach toddlers, she will teach pets. With a little help from two very small assistants.',
      'Helen\'s Pet Training School needs students. Round up six of your friends\' pets, then train them up.',
    ],
    done: [
      'Six pets enrolled, three trained up, and one of them has even evolved. Show-off.',
      'Helen\'s Pet Training School is officially open for business! The first lesson is "sit". The second is "please stop eating the curriculum".',
    ],
  },
  2: {
    title: 'Get Bent!',
    intro: [
      'Paddy\'s enemies on council have spotted a chance. One of his allies is away, and they want to roll him as mayor.',
      'There is a fishy way to disrupt their numbers, but it feels wrong. Maybe Kirsty and Dahlia can help make the case for Paddy instead.',
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

// What each chapter is called in the To Do app (no chapter numbers there).
export let GOALS = { 1: 'Start Helen\'s Pet School', 2: 'Stop Paddy being ousted as Mayor', 3: 'Prank Helen\'s friends while she\'s away', 4: 'Win the election for Paddy' };

// The objectives each chapter needs (checked in systems/story.js).
export let CH1 = { find: 6, level: 10, trained: 3 }; // any six pets, then three at level 10, and one evolved

// Chapter 1 opens with the morning paper, then Helen thinks out loud.
export let CH1_PAPER = {
  masthead: 'THE WESTERN WHINGE',
  date: 'Laverton edition. $2.50, or free if you nick it off the lawn',
  headline: 'PM HANSON SHUTS EVERY KINDER IN THE COUNTRY. PARENTS SHOCKED!',
  lines: [
    'Prime Minister Pauline Hanson has closed every early childhood education centre in Australia, effective immediately, in a press release spelt three different ways.',
    '"Kids learned to talk just fine in my day," said the PM, who then could not explain what "early childhood" meant. "Sounds woke."',
    'Thousands of educators are out of work. Parents across the west are reportedly staring at their toddlers, and their toddlers are staring back.',
  ],
  more: 'Continued on page 3: Is your cavoodle secretly a Greens voter?',
};
export let CH1_HELEN = [
  '"Well... I\'ve lost my job thanks to those nut jobs in One Nation! Plus Hadrian and Aleksy will have nowhere to go each day..."',
  '"Hmmm... I know! I\'ll start a pet school! I should start by getting all my friends\' pets to enrol."',
  '"Let\'s see... who is there... Princess, of course. Where is she?"',
  '"She\'s got out AGAIN!"',
  'Helen grabs her shoes and runs out the door.',
];
// Once six pets are enrolled.
export let CH1_ENROLLED = [
  '"Six students! The school is officially full of fur."',
  '"Now I need to prove how good I am at training these pets!"',
  'New jobs in the To Do list: train three pets to level 10, and evolve one.',
];
// What each owner says about the school when you beat them, and the $10 enrolment they hand over.
export let SCHOOL_FEE = 10;
export let SCHOOL_LINES = {
  rose: 'Rose: "A pet school? Fine. Salami can enrol. Here\'s $10 for the fees. I want a written report each term."',
  slinks: 'Slinks: "Spooky at school. Imagine. Here\'s $10, and good luck taking the roll. She won\'t always be visible."',
  sinead: 'Sinead: "Poppy needs boundaries, honestly. Here\'s $10. If she headbutts the other students, that\'s on you."',
  nathan: 'Nathan: "Rusty, at school? He can\'t sit still for one second. Here\'s $10. Maybe start with \'stop\'."',
  tim: 'Tim: "Stanley will want to see the curriculum first. Here\'s $10 in fees. He\'s a member of the union, mind."',
  dell: 'Dell: "Girlie loves learning. Mostly about food. Here\'s $10 for the term, Helen."',
  adam: 'Adam: "Chloe at pet school? She\'s a kelpie, she\'ll be teaching it by Friday. Here\'s $10."',
};
export let SCHOOL_DEFAULT = '"A pet school? What a great idea. Here\'s $10 towards the fees."';
export let CH2_RECIPE = { fish: 1, lemon: 1, laxatives: 1 }; // any fish, a lemon and laxatives make the dodgy pie
export let CH3_PRANKS = 3;                         // pranks needed
export let CH4 = { drinks: 6, decos: 4, invites: 6, rsvpHearts: 3, rooms: ['kitchen', 'twinsroom', 'study'] };

// Paddy turns up the first morning after Chapter 1.
export let PADDY_SPILL = [
  'Paddy: "Morning, love. Have you got a minute? Sit down. Actually, I\'ll sit down."',
  '"Rayna is away walking the Camino for a fortnight. Without her vote, Bentleigh and Dismay reckon they have the numbers."',
  '"They\'re moving a spill at council. They want to roll me as mayor."',
  '"I don\'t know what to do. If only one of THEM had to take a bit of leave too. Then it would be a tie, and a tie means I stay."',
  '"But that would never happen. Bentleigh hasn\'t had a sick day since 1987. She eats the same lunch in the foyer every weekday like clockwork."',
  '"Oh well. I\'m off to work. Wish me luck."',
];
export let PADDY_SPILL_HINT = 'For the fish pie route, Cr Bentleigh eats lunch in the civic centre foyer weekdays, 11am to 3pm. For a clean campaign, build Kirsty to 4 hearts and Dahlia to 2, then ask Paddy to make the case.';

// Lesley's lunch on the foyer booth (Chapter 2).
export let LUNCH = {
  look: ['Cr Bentleigh\'s lunch: her homemade fish pie, the same as every day. There is a sticky note on the lid.', '"LESLEY\'S. DO NOT TOUCH. THIS MEANS YOU, PADDY."'],
  noPie: 'You would need a fish pie of your own to swap it with. A very special one. A kitchen would help.',
  watching: 'Cr Bentleigh is guarding her lunch like a magpie in spring. You need a distraction.',
  noPet: 'Bring a pet along. Nothing distracts a councillor like a dog in the civic centre.',
  distract: pet => [`${pet} tears across the foyer and does three laps of the reception desk.`, 'Cr Bentleigh: "WHO LET AN ANIMAL INTO THE CIVIC CENTRE?! I am writing to MYSELF about this!"', 'She storms off to find a ranger. Her lunch sits there, unguarded.'],
  swap: ['Quick! You swap her fish pie for your very dodgy one and put the sticky note back on top.'],
  eat: ['Cr Bentleigh stomps back to her booth. "Typical. No rangers anywhere. Right. LUNCH."', 'She sits down and digs in.', '"Hmm. Fishier than usual. Lemony. Warm, somehow."', '"Oh. Oh no. Oh, my tummy."', '"I need to go home. I may be some time. A WEEK, possibly."'],
};

// The kitchen (Chapter 2 onwards): what you can cook.
export let RECIPES = {
  fishpie: { name: 'Very dodgy fish pie', needs: 'any fish, a lemon and laxatives', text: ['You bake the fish, the lemon and the whole packet of laxatives into a pie. You leave it on the windowsill for three days, just to be sure.', 'It smells like the bottom of Kororoit Creek. Perfect.'] },
};

// Chapter 3: the twins' pranks. Talk to one of these friends and pick "Prank".
// Each prank goes: visit the friend (scout), the twins hatch a plan (plan),
// buy the thing (where), then come back and pull it (lines).
export let PRANKS = {
  paddy: { item: 'whoopee', react: 'jump', label: 'Whoopee cushion', where: 'Bunnings (Pranks tab) or the $2 shop at Summerhill',
    scout: ['Dad sinks into his armchair with a groan. "Ahh. My chair. The only thing in this house that never talks back."'],
    plan: ['Hadrian: "His chair. He LOVES his chair."', 'Aleksy: "Whoopee cushion. Under the cushion. Bunnings has them, or the $2 shop."'],
    lines: ['You hide a whoopee cushion under the cushion of Dad\'s chair.', 'Paddy sits down. PFFFFRRRRT.', 'Paddy: "That was the CHAIR. Everyone heard that it was the chair. ...Boys?"'] },
  corni: { item: 'googly', react: 'shake', label: 'Googly eyes', where: 'the Lincraft stall at Summerhill',
    scout: ['Corni opens his fridge. It is wall to wall Guinness. "My little friends. Always there for me."'],
    plan: ['Aleksy: "His little friends need faces."', 'Hadrian: "Googly eyes! Lincraft at Summerhill has a jar of a million."'],
    lines: ['You stick googly eyes on every can of Guinness in Corni\'s fridge.', 'Corni opens the fridge. Forty eyes look back at him.', 'Corni: "Mein Gott. They are watching me. I cannot drink something that is watching me."'] },
  mem: { item: 'rubbermouse', react: 'jump', label: 'Rubber mouse', where: 'the Lincraft stall at Summerhill',
    scout: ['Mem pats her lab coat pocket. "Lab mice, all present. Well, not in my pocket. That would be weird."'],
    plan: ['Hadrian: "What if there WAS a mouse in her pocket?"', 'Aleksy: "A fake one. With a broken leg. Lincraft has rubber mice."'],
    lines: ['You leave a rubber mouse with a tiny plaster cast in Mem\'s lab coat pocket.', 'Mem: "Oh! A broken femur. Poor thing. Wait. Who has been reading my thesis?"'] },
  rose: { item: 'bookmark', react: 'shake', label: 'Swap the bookmark', where: 'Brunswick Bound on Sydney Rd',
    scout: ['Rose is on page 847 of a 900 page novel. "Nearly there. Do NOT tell me how it ends."'],
    plan: ['Aleksy: "Page 847..."', 'Hadrian: "...what if it was page one? We need a bookmark. Brunswick Bound sells fancy ones."'],
    lines: ['Rose has a bookmark in a nine hundred page novel. You move it back to page one.', 'Rose: "...Have I read this? I have read this. Haven\'t I? Oh no."'] },
  slinks: { item: 'grapejuice', react: 'shake', label: 'Grape juice', where: 'Coles at Summerhill',
    scout: ['Slinks swirls a glass of shiraz. "Notes of blackberry. Notes of a long week at the department."'],
    plan: ['Hadrian: "It\'s purple. Grape juice is purple."', 'Aleksy: "Coles sells grape juice in a bottle that looks like wine!"'],
    lines: ['You swap Slinks\'s glass of shiraz for grape juice.', 'Slinks takes a sip. "Hmm. Fruit forward. Very... young. VERY young."', 'Slinks: "Boys. Where is my wine."'] },
  sinead: { item: 'bubbles', react: 'shake', label: 'Bubble vape', where: 'the $2 shop at Summerhill',
    scout: ['Sinead takes a long puff of her Mango Ice. "Don\'t vape, boys. Do as I say, not as I do."'],
    plan: ['Aleksy: "The $2 shop has bubble wands that look JUST like that."', 'Hadrian: "Swap it. Swap it now. Well, after we buy it."'],
    lines: ['You swap Sinead\'s Mango Ice vape for a bubble wand that looks just like it.', 'Sinead takes a big puff. A stream of bubbles floats out over Loddon Ave.', 'Sinead: "Okay. That is actually very calming. I am charging you for the session."'] },
  tim: { item: 'crayons', react: 'jump', label: 'Toy train timetable', where: 'the Lincraft stall at Summerhill',
    scout: ['Tim taps the Upfield line timetable on his fridge. "Every ten minutes. One day. One glorious day."'],
    plan: ['Hadrian: "We could make him a better timetable."', 'Aleksy: "With dinosaurs. Lincraft has crayons."'],
    lines: ['You swap the Upfield line timetable on Tim\'s fridge for one you drew yourself. Every train is a dinosaur.', 'Tim: "Twenty minute frequency, all day, on a T-rex? That\'s better service than the real thing."'] },
  nicholas: { item: 'wigglescd', react: 'spin', label: 'Dance-off', where: 'James\'s milk bar at Reservoir Station',
    scout: ['Nicholas does a little spin on the spot. "Twelve years of ballet. The body never forgets."'],
    plan: ['Aleksy: "Dance-off."', 'Hadrian: "DANCE-OFF. We need the Wiggles. James at the milk bar has the CD."'],
    lines: ['You put on the Wiggles at full volume and challenge Nicholas to a dance-off.', 'Nicholas does a perfect pirouette. You fall over. Twice.', 'Nicholas: "I won, but you two have real stage presence."'] },
};
const ITEM_A = { whoopee: 'a whoopee cushion', googly: 'googly eyes', rubbermouse: 'a rubber mouse', bookmark: 'a bookmark', grapejuice: 'grape juice', bubbles: 'a bubble wand', crayons: 'crayons', wigglescd: 'the Wiggles CD' };
export const PRANK_NEED = pr => `You need ${ITEM_A[pr.item] || 'the right thing'} for that. Try ${pr.where}.`;
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
export let RSVP = {
  yes: ['"A party? For the twins AND Paddy\'s campaign? We\'ll be there!"', '"Count me in. I\'ll bring a plate."', '"Wouldn\'t miss it. Is there a dress code? I\'m wearing a dress code."', '"Yes! I love a September baby."'],
  maybe: ['"Oh, maybe? I\'ll see how I go." (They\'d come if you were closer friends.)', '"I\'ll try! No promises." (Get to know them better first.)'],
};

// The party mini-games (ui/party.js).
export let TRIVIA = [
  { q: 'What is Mem doing her PhD on?', a: ['Muscle wastage while broken bones heal', 'Why magpies swoop', 'The history of the parma'], right: 0 },
  { q: 'What does Corni love more than anything?', a: ['Vegemite', 'Guinness', 'Kale smoothies'], right: 1 },
  { q: 'What does Gordon love?', a: ['Monster trucks', 'Byzantine art, plants and trees', 'Reality TV'], right: 1 },
  { q: 'Which flavour does Sinead vape?', a: ['Grape Ice', 'Watermelon', 'Mango Ice'], right: 2 },
  { q: 'What does Tim love, apart from trains?', a: ['Rome', 'Golf', 'Cricket'], right: 0 },
  { q: 'Who runs the garden centre at Bunnings?', a: ['Gaz', 'Olly', 'Romey'], right: 1 },
  { q: 'What does Rose do for work?', a: ['Works for a senator', 'Drives a tram', 'Sells couches'], right: 0 },
  { q: 'What did Nicholas used to do?', a: ['Play footy', 'Dance', 'Juggle'], right: 1 },
  { q: 'Where is Paddy mayor of?', a: ['Moreland', 'Hobsons Bay', 'Wyndham'], right: 1 },
];

// Late at the party, guests tell stories (up to four of them, in the yard).
export let PARTY_STORIES = {
  corni: ['"Did I ever tell you about the time I ran the Merri Creek trail in the wrong direction for nine kilometres? Mem waited at the finish with a Guinness. True love."'],
  mem: ['"So one of my lab mice broke her leg on purpose, I swear. She just wanted the extra attention. And honestly? Same."'],
  rose: ['"Senate estimates went until 11pm and a senator asked me what a fax machine was. I said, a printer that phones people. He wrote that down."'],
  slinks: ['"I once did a wine tour in the Yarra Valley and came home with eleven bottles and no memory of buying any of them. No regrets. Some regrets."'],
  tim: ['"Picture this: Rome, 2019, a train strike. I joined the picket line. In Italian. I do not speak Italian. They gave me a sandwich."'],
  nicholas: ['"In my dancing days I did a whole show with a sprained ankle. Nobody noticed. Then I fell off the stage at the curtain call. Everybody noticed."'],
  paddy: ['"First council meeting as mayor, I got stuck in the chamber lift for forty minutes. Bentleigh moved a motion to leave me there. It was seconded."'],
  pearman: ['"My BETTY shirt? A woman named Betty gave it to me at a pub in 2004 and I\'ve never found out why. I wear it to honour her."'],
  nathan: ['"Rusty once ran so fast at the dog park he lapped a greyhound. The greyhound\'s owner asked for his number. Rusty\'s, not mine."'],
  sinead: ['"I had a client last week who said I was the first person to ever listen to him properly. Then he asked if I could watch his ferret for a month."'],
  gordon: ['"In Ravenna there\'s a mosaic so beautiful I cried in front of a tour group of Year 9s. They clapped. It was very moving for all of us."'],
  trish: ['"When Helen was little she ran a pet school for the neighbourhood snails. Charged them a leaf each. Some things never change!"'],
};
export const PARTY_STORY_DEFAULT = name => [`${name} tells a long story about a parking ticket in Footscray. It has a twist. Everybody gasps.`];
// Guests you have already heard from.
export let PARTY_MINGLE = [
  name => `${name} is deep in a chat about rent prices by the esky.`,
  name => `${name}: "Best party in Laverton. Don't tell anyone in Altona."`,
  name => `${name} is teaching the twins a dance. It is mostly stomping.`,
  name => `${name} raises a sausage in a toast to you.`,
];
// Paddy at the party: a line if you chat, then his speech at the end.
export let PADDY_PARTY = [
  'Paddy: "Have you had a snag? Have a snag. I\'m saving my speech for later. It\'s a good one. I wrote it on a napkin."',
  'Paddy: "The twins have had four fairy breads each. This is fine. This is democracy."',
  'Paddy: "Don\'t tell Lesley, but this is the best turnout of any event in Hobsons Bay this year. Including council."',
];
export let PADDY_SPEECH = [
  'Paddy taps his glass with a fork. Clink clink clink. The music stops. Somebody shushes the twins. The twins shush back.',
  '"Thanks, everyone. Seriously. Thank you all for coming. Look at this backyard. Look at all of you."',
  '"First up: Hadrian and Aleksy. Happy birthday, boys. You are the loudest, funniest, stickiest little blokes I know, and I love you to bits."',
  '"And Helen. You held this whole family together while I was off fighting about bike lanes. You ran a pet school. You threw this party. You are amazing, and I don\'t say it enough."',
  '"On council, all I\'m trying to do is make Hobsons Bay a place where kids like ours can grow up: more trees, safe streets, a lemon tree or two, and a council that listens."',
  '"So whatever happens next week, thank you for being here. Now eat something. There are forty sausages left and I am not taking them home."',
];
export let PARTY_END = [
  'It gets late. The fairy lights glow, the twins are asleep in a pile of party hats, and the music gets softer.',
  'Helen: "Has everyone had a drink? Have I had a drink? I think I\'ve had... a few drinks."',
  'Helen: "I love you all. I love this backyard. I love that tree. Hello, tree."',
  'Helen lies down on the trampoline to look at the stars, and is asleep in about four seconds.',
  'What a night. Corni tucks a beach towel over her. Somebody is asleep in the paddling pool. It is also Corni.',
];

// The end of the story (for now).
export let THE_END = [
  'That\'s it for now!',
  'Thanks for playing Project Princess. You can keep playing: the pets, the garden, the council and the shops are all still here.',
  'More is planned if people want it: more pets, mini-games and a big Meredith finale. Tell Seb if you want more!',
];

CHAPTERS = authoredValue('data/story.js', 'CHAPTERS', CHAPTERS);
GOALS = authoredValue('data/story.js', 'GOALS', GOALS);
CH1 = authoredValue('data/story.js', 'CH1', CH1);
CH1_PAPER = authoredValue('data/story.js', 'CH1_PAPER', CH1_PAPER);
CH1_HELEN = authoredValue('data/story.js', 'CH1_HELEN', CH1_HELEN);
CH1_ENROLLED = authoredValue('data/story.js', 'CH1_ENROLLED', CH1_ENROLLED);
SCHOOL_FEE = authoredValue('data/story.js', 'SCHOOL_FEE', SCHOOL_FEE);
SCHOOL_LINES = authoredValue('data/story.js', 'SCHOOL_LINES', SCHOOL_LINES);
SCHOOL_DEFAULT = authoredValue('data/story.js', 'SCHOOL_DEFAULT', SCHOOL_DEFAULT);
CH2_RECIPE = authoredValue('data/story.js', 'CH2_RECIPE', CH2_RECIPE);
CH3_PRANKS = authoredValue('data/story.js', 'CH3_PRANKS', CH3_PRANKS);
CH4 = authoredValue('data/story.js', 'CH4', CH4);
PADDY_SPILL = authoredValue('data/story.js', 'PADDY_SPILL', PADDY_SPILL);
PADDY_SPILL_HINT = authoredValue('data/story.js', 'PADDY_SPILL_HINT', PADDY_SPILL_HINT);
LUNCH = authoredValue('data/story.js', 'LUNCH', LUNCH);
RECIPES = authoredValue('data/story.js', 'RECIPES', RECIPES);
PRANKS = authoredValue('data/story.js', 'PRANKS', PRANKS);
RSVP = authoredValue('data/story.js', 'RSVP', RSVP);
TRIVIA = authoredValue('data/story.js', 'TRIVIA', TRIVIA);
PARTY_STORIES = authoredValue('data/story.js', 'PARTY_STORIES', PARTY_STORIES);
PARTY_MINGLE = authoredValue('data/story.js', 'PARTY_MINGLE', PARTY_MINGLE);
PADDY_PARTY = authoredValue('data/story.js', 'PADDY_PARTY', PADDY_PARTY);
PADDY_SPEECH = authoredValue('data/story.js', 'PADDY_SPEECH', PADDY_SPEECH);
PARTY_END = authoredValue('data/story.js', 'PARTY_END', PARTY_END);
THE_END = authoredValue('data/story.js', 'THE_END', THE_END);
