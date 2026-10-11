// THE TUNING SHEET. Prices, money and pet stats in one place, so they can be
// changed without touching the game code. Edit a number, save, and it applies
// everywhere on the next load (on GitHub: open this file, press the pencil,
// edit, Commit changes; the site redeploys by itself).
//
// Every value here wins over the one written in the data files. Anything left
// out keeps its built-in value. The Developer Studio's own edits still win
// over this sheet. Money is in whole dollars.

export const TUNING = {
  // What things cost in the shops (data/items.js). Selling back pays half, except crops.
  items: {
    chicken: 6, sardine: 6, carrot: 3, cheese: 4, snag: 5, croissant: 7,
    lemon: 2, tennis: 4, ribbon: 8, duckfeather: 4, feather: 6, pear: 3,
    pancit: 8, manoush: 6, bread: 2, golfball: 5, paperback: 5, byzbook: 14,
    modeltrain: 16, flowers: 6, icedcoffee: 4, gaytime: 3, seedling: 4, olive: 15,
    gloves: 6, fertiliser: 5, prideprejudice: 18, middlemarch: 22, janeeyre: 18, nineteen84: 18,
    monkeygrip: 20, cloudstreet: 22, hangingrock: 18, boyswallows: 26, thedry: 24, lessonschem: 26,
    tomorrows: 26, intermezzo: 28, fourthwing: 28, gelato: 6, jamdonut: 4, hotchips: 5,
    gelatocone: 6, longblack: 5, magic: 5, borek: 5, snowglobe: 12, koala: 10,
    umbrella: 15, mykicase: 8, bait: 2, thermos: 24, headtorch: 20, laxatives: 12,
    whoopee: 3, googly: 2, rubbermouse: 2, bookmark: 2, grapejuice: 3, crayons: 2,
    bubbles: 2, wigglescd: 5, bunting: 6, balloons: 4, fairylights: 12, vb: 4,
    draught: 4, melbbitter: 4, coopers: 5, crown: 6, greatnorthern: 4, xxxx: 4,
    furphy: 5, squire: 6, littlecreatures: 6, stonewood: 6, hahn: 5, tooheys: 4,
    boags: 5, guinness: 7, mountaingoat: 6, moondog: 6, coburglager: 6, yellowtail: 9,
    jacobs: 10, penfolds: 30, wolfblass: 12, moscato: 11, chianti: 14, orangewine: 26,
    goon: 12, reeses: 4, drpepper: 4, takis: 6, twinkie: 5, poptarts: 6,
    mangoice: 25, grapeice: 25, watermelon: 25, timtams: 4, handcream: 8, sunscreen: 9,
    puzzlebook: 5, bdaycard: 6, sausageroll: 4, vanillaslice: 5, fingerbun: 3, fidget: 2,
    fakeplant: 5, cannoli: 6, prosciutto: 8, egg: 3, parmigiano: 12, beans: 16,
    honey: 10, kombucha: 7, flour: 3, sugar: 3, butter: 5, milk: 3,
    chocchips: 4, bike: 180, cbgarden: 24, cbbaking: 26, pide: 5, fetta: 6,
    baklava: 6, olivejar: 9, cardigan: 8, timber: 5, cloth: 3, cord: 3,
    bolts: 3,
  },
  // Pet shop gear (data/gear.js)
  gear: {
    lead: 30, collar: 35, harness: 35, bell: 30, bandana: 40, pouch: 55,
    fairycollar: 0, bowtie: 45,
  },
  // House upgrades and garden tools from Olly at Bunnings (data/upgrades.js)
  upgrades: {
    veggiepatch: 60, petdoor: 80, twinsroom: 120, kitchen: 160, study: 110, pool: 100,
    hose: 45, sprinkler: 90, rod: 60,
  },
  // Franco Cozzo furniture (data/furniture.js)
  furniture: {
    old: 0, velvet: 640, banana: 180, leather: 150, floral: 35, sage: 0,
    canopy: 580, waterbed: 260, brass: 140, futon: 45, red: 0, persian: 420,
    shag: 120, stripe: 60, jute: 20, brasslamp: 0, crystal: 360, arc: 150,
    lava: 50, paper: 15, oak: 0, walnut: 300, crates: 25, oaktable: 0,
    marble: 280, glass: 90, cane: 40, stump: 10, mustard: 0, wingback: 390,
    recliner: 210, egg: 95, beanbag: 30, mixed: 0, monstera: 65, bird: 80,
    lemon: 55, lily: 30, ivy: 20, cactus: 12,
  },
  // Seeds: what a packet costs. Crops: what James pays for each one you pick.
  seeds: {
    basil: 3, carrot: 4, zucchini: 4, potato: 4, tomato: 5, strawberry: 6,
    chilli: 6, pumpkin: 8,
  },
  crops: {
    basil: 6, carrot: 8, zucchini: 8, potato: 9, tomato: 11, strawberry: 13,
    chilli: 14, pumpkin: 24,
  },
  // Money you earn.
  money: {
    wildBase: 4,          // a wild play-fight pays wildBase + level x wildPerLevel + a little luck
    wildPerLevel: 0.8,
    allMoney: 1,          // multiplies every battle payout (1 = as written, 1.5 = half as much again)
    requestMin: 12, requestMax: 30,   // the daily request board
    bakeOff: [80, 40, 15],            // The Great Coburg Bake Off: 1st, 2nd, 3rd
  },
  // Pet base stats (roughly 40 to 130 each), and when each one evolves.
  pets: {
    princess: { stats: { hp: 66, attack: 84, defence: 52, speed: 80, special: 100 },
      evolution: { level: 14, hearts: 5, stats: { hp: 82, attack: 98, defence: 62, speed: 92, special: 116 } } },
    salami: { stats: { hp: 60, attack: 88, defence: 50, speed: 85, special: 60 },
      evolution: { level: 15, hearts: 5, stats: { hp: 78, attack: 104, defence: 68, speed: 80, special: 78 } } },
    spooky: { stats: { hp: 50, attack: 55, defence: 60, speed: 95, special: 90 },
      evolution: { level: 15, hearts: 5, stats: { hp: 88, attack: 72, defence: 80, speed: 98, special: 112 } } },
    poppy: { stats: { hp: 85, attack: 80, defence: 80, speed: 50, special: 20 },
      evolution: { level: 16, hearts: 5, stats: { hp: 105, attack: 98, defence: 110, speed: 52, special: 35 } } },
    rusty: { stats: { hp: 66, attack: 78, defence: 50, speed: 115, special: 48 },
      evolution: { level: 16, hearts: 5, stats: { hp: 86, attack: 108, defence: 82, speed: 130, special: 56 } } },
    stanley: { stats: { hp: 60, attack: 50, defence: 70, speed: 55, special: 98 },
      evolution: { level: 16, hearts: 5, stats: { hp: 82, attack: 88, defence: 108, speed: 58, special: 100 } } },
    girlie: { stats: { hp: 82, attack: 76, defence: 66, speed: 62, special: 55 },
      evolution: { level: 16, hearts: 5, stats: { hp: 106, attack: 96, defence: 88, speed: 64, special: 70 } } },
    chloe: { stats: { hp: 68, attack: 82, defence: 58, speed: 104, special: 60 },
      evolution: { level: 16, hearts: 5, stats: { hp: 86, attack: 100, defence: 72, speed: 124, special: 72 } } },
    ziggy: { stats: { hp: 58, attack: 74, defence: 52, speed: 120, special: 64 },
      evolution: { level: 16, hearts: 5, stats: { hp: 76, attack: 90, defence: 68, speed: 128, special: 80 } } },
    emilio: { stats: { hp: 90, attack: 62, defence: 80, speed: 44, special: 76 } },
    marty: { stats: { hp: 72, attack: 64, defence: 58, speed: 52, special: 60 },
      evolution: { level: 14, hearts: 5, stats: { hp: 96, attack: 84, defence: 76, speed: 54, special: 70 } } },
  },
};


// Copy a section of the sheet onto a data table: tune(GEAR, TUNING.gear).
export function tune(table, values, field = 'price') {
  for (const [id, v] of Object.entries(values || {})) if (table[id] && Number.isFinite(v)) table[id][field] = v;
  return table;
}
