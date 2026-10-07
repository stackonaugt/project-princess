// Cooking and baking in the kitchen at home (the stove, once the kitchen is
// built in Chapter 2). Everything for it lives here and is merged into ITEMS
// when items.js loads:
//
//   COOK_ITEMS   pantry ingredients (Coles at Summerhill, the Pantry tab),
//                the dishes you make, and the cook books (Brunswick Bound)
//   RECIPES      what you can make. learn: 'start' (known from day one),
//                { book } (have the cook book in your bag), { hearts: [who, n] }
//                (taught at a heart scene), { gift: who } (taught the first
//                time you give that person something they love)
//   BAKE_OFF     the Saturday bake-off at Betty's on Moreland Rd
//
// Dishes marked homegrown use your own veggies: three of them throw the
// street party for the community garden motion (data/council.js).

export const COOK_ITEMS = {
  // Pantry (ingredient: true). Eggs are Nonna Concetta's `egg`, sold at Coles too.
  flour:     { name: 'Plain flour', price: 3, ingredient: true, art: { kind: 'packet', body: '#f4f0e6', label: '#2a6ab8', cap: '#e8c040' }, desc: 'A kilo of plain flour. It will get everywhere.' },
  sugar:     { name: 'Sugar', price: 3, ingredient: true, art: { kind: 'packet', body: '#f4f4f0', label: '#3a9a4a', cap: '#c8302a' }, desc: 'White sugar. Do not let the twins near it.' },
  butter:    { name: 'Butter', price: 5, ingredient: true, art: { kind: 'packet', body: '#f0d870', label: '#c8302a', cap: '#f4f0e6' }, desc: 'Salted. Proper butter, not the spreadable stuff.' },
  milk:      { name: 'Milk', price: 3, ingredient: true, art: { kind: 'jar', body: '#f4f4f0', label: '#2a6ab8', cap: '#2a6ab8' }, desc: 'Two litres of full cream. The blue lid. The only lid.' },
  chocchips: { name: 'Choc chips', price: 4, ingredient: true, art: { kind: 'packet', body: '#5a3020', label: '#f0d070', cap: '#f4f0e6' }, desc: 'Dark choc bits. Half of them will not make it into the cookies.' },

  // Dishes (dish: true). Cooked ones are presents; baked ones can go in the bake-off.
  lemonade:  { name: 'Homemade lemonade', gift: true, dish: true, loved: true, art: { kind: 'jar', body: '#f4e88a', label: '#f4f4f0', cap: '#5ab04a' }, desc: 'Fresh lemons, sugar, cold water. Tastes like a summer on a Laverton nature strip.' },
  vegsoup:   { name: 'Garden veggie soup', gift: true, dish: true, homegrown: true, loved: true, art: { kind: 'plate', body: '#d8803a', label: '#5ab04a' }, desc: 'Carrot, potato and tomato, all from your own beds. Nourishing. Smug, even.' },
  ratatouille: { name: 'Ratatouille', gift: true, dish: true, homegrown: true, loved: true, art: { kind: 'plate', body: '#c8443a', label: '#e8c040' }, desc: 'Zucchini, tomato and basil, slow cooked. The zucchini glut, defeated.' },
  pumpkinsoup: { name: 'Pumpkin soup', gift: true, dish: true, homegrown: true, loved: true, art: { kind: 'plate', body: '#e89030', label: '#f4f0e6' }, desc: 'Velvety, with a swirl of cream. Every pumpkin you grew, in one pot.' },
  sugo:      { name: 'Tomato and basil sugo', gift: true, dish: true, homegrown: true, loved: true, art: { kind: 'jar', body: '#c8302a', label: '#f4f0e6', cap: '#3a9a4a' }, desc: 'A jar of passata the way the nonnas make it. Bottled on a Sunday.' },
  cookies:   { name: 'Choc chip cookies', gift: true, dish: true, baked: true, loved: true, art: { kind: 'donut', body: '#d8a860', label: '#5a3020', cap: '#5a3020' }, desc: 'Crunchy at the edges, gooey in the middle. Still warm.' },
  strawtart: { name: 'Strawberry tart', gift: true, dish: true, baked: true, homegrown: true, loved: true, art: { kind: 'cake', body: '#f0d8a0', cap: '#d83a4a', label: '#5ab04a' }, desc: 'Short pastry, custard and your own strawberries. Princess has questions.' },
  oilcake:   { name: 'Nonna\'s lemon olive oil cake', gift: true, dish: true, baked: true, loved: true, art: { kind: 'cake', body: '#f0e070', cap: '#f4f4f0', label: '#e8c040' }, desc: 'Nonna Concetta\'s recipe. She made you swear on the lemon tree not to share it.' },
  sponge:    { name: 'Victoria sponge', gift: true, dish: true, baked: true, loved: true, art: { kind: 'cake', body: '#f4e0a8', cap: '#f4f4f0', label: '#d83a4a' }, desc: 'Betty\'s sponge: jam, cream and a dusting of icing sugar. Light as a cloud.' },
  lemondelicious: { name: 'Lemon delicious', gift: true, dish: true, baked: true, loved: true, art: { kind: 'cake', body: '#f4e88a', cap: '#d8a040', label: '#f4f4f0' }, desc: 'Trish\'s secret pudding: lemon sponge on top, lemon sauce underneath. A family heirloom.' },
  bike:      { name: 'Shiny red bike', price: 180, gift: true, art: { kind: 'globe', body: '#c8302a', label: '#f4f4f0', cap: '#1e1e24' }, desc: 'A proper road bike with a bell. For someone who never got one as a kid.' },
  blueribbon: { name: 'Blue ribbon', story: true, art: { kind: 'globe', body: '#2a5ad8', label: '#f4f4f0', cap: '#e8c040' }, desc: 'First prize, Moreland Rd Bake-Off. Betty pinned it on you herself.' },

  // Cook books (book: true, so Brunswick Bound sells them). Having one in your bag teaches its recipes.
  cbgarden:  { name: 'From the Patch: Easy Veg', price: 24, gift: true, book: true, cookbook: ['ratatouille', 'pumpkinsoup', 'sugo'], art: { cover: '#5ab04a', band: '#e8c040' }, desc: 'A cook book for gluts. Ratatouille, pumpkin soup and a proper sugo.' },
  cbbaking:  { name: 'The Big Book of Baking', price: 26, gift: true, book: true, cookbook: ['cookies', 'strawtart'], art: { cover: '#f0a0b8', band: '#5a3020' }, desc: 'Cookies, tarts and a whole chapter on not opening the oven door.' },
};

export const RECIPES = {
  // The very dodgy fish pie (Chapter 2) is handled on its own in WorldScene.cook().
  lemonade:    { needs: { lemon: 2, sugar: 1 }, learn: 'start', text: 'You squeeze the lemons, stir in the sugar and top it up with cold water. Sharp, sweet, perfect.' },
  vegsoup:     { needs: { carrot: 1, potato: 1, tomato: 1 }, learn: 'start', text: 'Chop, simmer, season. The whole house smells like a winter Sunday.' },
  cookies:     { needs: { flour: 1, sugar: 1, butter: 1, egg: 1, chocchips: 1 }, learn: 'start', baked: true, score: 5, text: 'Cream the butter and sugar, fold in the choc chips, bake. You eat two straight off the tray. Quality control.' },
  scones:      { needs: { flour: 1, butter: 1, milk: 1 }, learn: 'start', baked: true, score: 5, text: 'Rub in the butter, a splash of milk, a light hand. They rise like the CWA is watching.' },
  ratatouille: { needs: { zucchini: 2, tomato: 1, basil: 1 }, learn: { book: 'cbgarden' }, text: 'Layered, drizzled with oil, slow cooked. It looks like a cartoon rat could have made it.' },
  pumpkinsoup: { needs: { pumpkin: 1, potato: 1, milk: 1 }, learn: { book: 'cbgarden' }, text: 'Roast the pumpkin, blitz it smooth, swirl in the milk. Golden.' },
  sugo:        { needs: { tomato: 3, basil: 1 }, learn: { book: 'cbgarden' }, text: 'You cook the tomatoes down for hours with the basil. You bottle it. You feel a hundred years old in a good way.' },
  strawtart:   { needs: { flour: 1, butter: 1, sugar: 1, egg: 1, strawberry: 2 }, learn: { book: 'cbbaking' }, baked: true, score: 7, text: 'Blind bake the pastry, fill it with custard, crown it with your strawberries. Gorgeous.' },
  oilcake:     { needs: { flour: 1, sugar: 1, egg: 2, lemon: 1 }, learn: { gift: 'concetta' }, baked: true, score: 8, text: 'Olive oil, lemon zest, a lot of eggs. Nonna Concetta would make a face, then ask for a second slice.' },
  sponge:      { needs: { flour: 1, sugar: 1, butter: 1, egg: 2, strawberry: 1 }, learn: { hearts: ['betty', 8] }, baked: true, score: 8, text: 'Two perfect sponges, jam and cream in the middle. Betty\'s voice in your head: "Do NOT open that oven."' },
  lemondelicious: { needs: { lemon: 2, egg: 2, sugar: 1, butter: 1, milk: 1 }, learn: { hearts: ['trish', 10] }, baked: true, score: 10, text: 'The batter splits into sponge on top and lemon sauce underneath, like Trish said it would. Magic.' },
};
export const RECIPE_ORDER = Object.keys(RECIPES);

// Who teaches what, in their own words.
export const TEACH_LINES = {
  oilcake: ['Nonna Concetta clutches the present to her chest. "You know what I like. So I tell you a secret."', '"My lemon olive oil cake. Olive oil, NOT butter. Butter is for the French."', 'You learnt a recipe: Nonna\'s lemon olive oil cake.'],
  sponge: ['Betty: "Right. You\'re ready. Sit down. I\'m going to teach you my Victoria sponge."', '"Room temperature eggs. Never open the oven. And never, ever tell Ed it\'s easy."', 'You learnt a recipe: Victoria sponge.'],
  lemondelicious: ['Trish: "I\'ve never written this down. My mother never wrote it down. Her mother never wrote it down."', '"Lemon delicious. It makes its own sauce. Like magic. Don\'t tell Gordon how much butter."', 'You learnt a recipe: Lemon delicious. It is the best thing you will ever bake.'],
};

// The Moreland Rd Bake-Off: every Saturday at Betty's, one entry a week.
// Your score is the recipe's score plus a little luck (and a point if you grew
// some of it yourself), against three rivals.
export const BAKE_OFF = {
  day: 'Saturday',
  intro: ['Betty: "It\'s Saturday! Bake-off day! Three locals, one judge, no mercy."', '"Bring me something you baked yourself. Shop-bought gets you banned for life. I can tell."'],
  noEntry: 'Betty: "Nothing baked in that bag, love. Cookies, scones, a tart: anything from your own oven. The kitchen\'s at home."',
  done: 'Betty: "You\'ve had your go this week. Same time next Saturday. Practise your sponge."',
  // Meghan Hopper enters every week and nearly always wins. Only a secret
  // recipe (one somebody taught you: Nonna's oil cake, Betty's sponge, Trish's
  // lemon delicious) gets the bonus that can beat her.
  meghan: { name: 'Meghan Hopper', dishes: ['a nine layer torte with a perfect mirror glaze', 'a pavlova shaped like the Labor rose', 'a croquembouche taller than Whitlam'], score: 10 },
  secretBonus: 2,
  rivalry: ['Betty: "Oh, while you\'re here. The Moreland Rd Bake-Off. Every Saturday, here at mine."',
    '"And every Saturday, Meghan Hopper wins it. Nine layer tortes. Mirror glazes. She pushes her cat around in a PRAM, and she still has time to temper chocolate."',
    '"I\'m not bitter. I\'m a little bitter. Help me beat her, love. You\'ll need a special recipe, something somebody has handed down. Nothing from a book will do it."'],
  beatMeghan: ['Betty screams. Ward drops a beer in the next room.', 'Betty: "YOU BEAT MEGHAN HOPPER! Twelve years! TWELVE YEARS!"', 'Meghan Hopper: "Congratulations! Genuinely! I\'ll be demanding a recount, but genuinely!"'],
  lostToMeghan: 'Betty: "Meghan. Again. It\'s that glaze. You need something special, love. A recipe somebody gave you."',
  rivals: [
    { name: 'Nonna Concetta', dish: 'a ricotta cake heavy enough to anchor a boat' },
    { name: 'Hakan', dish: 'a tray of baklava, glistening with honey' },
    { name: 'Trish', dish: 'a pavlova, piled with passionfruit' },
    { name: 'Gina', dish: 'cannoli, filled to order' },
    { name: 'Mem', dish: 'lab-grade lamingtons, measured to the gram' },
    { name: 'Tito Ramon', dish: 'ube crinkle cookies, very purple' },
    { name: 'Deb from Coles', dish: 'a Coles mud cake she swears she made' },
  ],
  prize: [60, 25, 10],           // dollars for first, second, third
  results: ['First place!', 'Second place.', 'Third place.', 'Fourth place.'],
  win: 'Betty pins a blue ribbon on you. "Best in show. I\'m not crying, it\'s the icing sugar."',
};
