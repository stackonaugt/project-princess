// Built-in pet pixel art, written as strings. Each letter is a palette
// colour, '.' is transparent. Pets are 16x16, drawn side-on facing right,
// and get a dark outline added automatically. A second walking frame is
// made by spreading the legs (see stride()).
//
// You never need to touch this file to use your own art: drop PNGs into
// assets/sprites/ instead (see assets/sprites/README.md).

// Second frame: legs in the bottom `n` rows step apart.
function stride(rows, n = 4) {
  const top = rows.slice(0, rows.length - n);
  const mid = 8;
  const legs = rows.slice(rows.length - n).map(r => {
    const left = r.slice(0, mid), right = r.slice(mid);
    return (left.slice(1) + '.') .slice(0, mid) + ('.' + right).slice(0, 16 - mid);
  });
  return top.concat(legs);
}

const poodle = [
  '................',
  '..pp......www...',
  '.pppp....wwwww..',
  '.pppp...cwwwwww.',
  '..pp...ccwcceww.',
  '...a...cccwwwwwn',
  '...aa..cccawwww.',
  '...aaaacccaaaa..',
  '...aaaapppaaaa..',
  '...aaaaaaaaaab..',
  '...baaaaaaaab...',
  '....bbbbbbbb....',
  '....aa....aa....',
  '....aa....aa....',
  '...pppp..pppp...',
  '...pppp..pppp...',
];
const tabby = [
  '................',
  '..........a...a.',
  '.ss.......ap.ap.',
  '.sa.......aaaaa.',
  '..sa.....asaasa.',
  '..as.....aaaeaa.',
  '...a.....awwwap.',
  '...as....awwwa..',
  '...asaaasaaaa...',
  '...asasasasaac..',
  '...aaaaaaaaacc..',
  '....ccccccccc...',
  '....as....as....',
  '....as....as....',
  '....as....as....',
  '....ss....ss....',
];
const bunny = [
  '.........aa.....',
  '........apa.aa..',
  '........apaapa..',
  '........apaapa..',
  '.........aaaa...',
  '........aaaaab..',
  '.......aaaeaab..',
  '.......aaaaaaap.',
  '...aaaaaaaaaab..',
  '..aaaaaaaaaaab..',
  '.wwaaaaaaaaaab..',
  '.wwaaaaaaaaaab..',
  '..baaaaaaaaab...',
  '..bbbbbbbbbbb...',
  '..aab....aab....',
  '..bbbb...bbbb...',
];
const frenchie = [
  '................',
  '.........a...a..',
  '........aaa.aaa.',
  '........apa.apa.',
  '........aaaaaaa.',
  '........aaeaaal.',
  '........aaaaggn.',
  '...a....aaaaggg.',
  '...aa.aaaaaaww..',
  '...aaaaaaaaww...',
  '..aaaaaaaaaaw...',
  '..aaaaaaaaaaa...',
  '..bbbbbbbbbbb...',
  '...aa....aa.....',
  '...aa....aa.....',
  '...gg....gg.....',
];
const schnauzer = [
  '................',
  '.........dd.....',
  '..a.....dadd....',
  '..a.....aaaal...',
  '..aa....wwwal...',
  '...a....aeaaaa..',
  '...a....aaaaaan.',
  '...aaaaaawwwww..',
  '...aaaaaawwwwww.',
  '...aaaaaaawww...',
  '...lllllllll....',
  '...wwlllllww....',
  '...ww.....ww....',
  '...ww.....ww....',
  '...ww.....ww....',
  '...ww.....ww....',
];

// Rusty: a slim brown whippet, deep chest, tucked belly, long legs, white bib.
const whippet = [
  '................',
  '...........kk...',
  '..........kaaa..',
  '..........aeaaa.',
  '...........aaaan',
  '...........wa...',
  '...aaaaaaaaww...',
  '..aaaaaaaaaww...',
  '.a.abaaaaaww....',
  'a...b...aww.....',
  'a...b....b......',
  '....a....a......',
  '...a.....a......',
  '...a.....a......',
  '...a.....a......',
  '..aa.....aa.....',
];

// Girlie: Dell's black labrador. Big, soft ears, a thick otter tail, tongue out.
const lab = [
  '................',
  '................',
  '..........aaa...',
  '.........aaaaa..',
  '.........aeaaal.',
  '........baaaaaan',
  '........baaaaaa.',
  '.a......aaaaap..',
  '..a.aaaaaaaaa...',
  '...aaaaaaaaaa...',
  '..laaaaaaaaaa...',
  '...aaaaaaaaaa...',
  '...bbbbbbbbbb...',
  '...aa.....aa....',
  '...aa.....aa....',
  '...aa.....aa....',
];
// Chloe: a black and tan kelpie, prick ears, tan eyebrows, legs and chest.
const kelpie = [
  '................',
  '.........a.a....',
  '........aaaaa...',
  '........attaa...',
  '.......atetaan..',
  '........aaaata..',
  '..a.....aaaa....',
  '..aa...aaaa.....',
  '..aaaaaaaaa.....',
  '..taaaaaaata....',
  '...taaaaatta....',
  '...tt....tt.....',
  '...tt....tt.....',
  '...tt....tt.....',
  '...tt....tt.....',
  '..ttt....ttt....',
];

// Evolved forms
const flamcess = [
  '..y.......y.y...',
  '.yoy.....yoyoy..',
  '.roor...rwwwwwr.',
  '.ryyr...cwwwwww.',
  '..rr...ccwcceww.',
  '...a...cccwwwwwn',
  '...aa..cccawwww.',
  '..oaaaacccaaaa..',
  '.o.aaaapppaaaao.',
  '...aaaaaaaaaab.o',
  '..ybaaaaaaaab...',
  '....bbbbbbbb....',
  '....aa....aa....',
  '....aa....aa....',
  '...rooy..rooy...',
  '...yyyy..yyyy...',
];
const floppy = [
  '................',
  '................',
  '........aaaaa...',
  '.......paaaaaap.',
  '.......paahaaap.',
  '.......ppaeaalp.',
  '........aaaaggn.',
  '...a....aaaaggg.',
  '...aa.aaaaaaww..',
  '...aahaaahaww...',
  '..aaaakaaaaaw...',
  '..akaaaaakaaa...',
  '..bbbbbbbbbbb...',
  '...aa....aa.....',
  '...aa....aa.....',
  '...gg....gg.....',
];

// Sopressa: Salami, aged. Flat cap, grey whiskers, more of her to love.
const sopressa = [
  '................',
  '.........fffff..',
  '.ss.....ffffffff',
  '.sa......aaaaa..',
  '..sa.....asaasa.',
  '..as.....aaaeaa.',
  '...a.....agggap.',
  '...as...gagggag.',
  '...asaaasaaaaa..',
  '..aasasasasaacc.',
  '..aaaaaaaaaaccc.',
  '...ccccccccccc..',
  '....as....as....',
  '....as....as....',
  '....as....as....',
  '....ss....ss....',
];
// Poltergeist Spooky: no feet, just a wisp. Little sparks of something.
const poltergeist = [
  '.x.......aa.....',
  '........apa.aa..',
  '....x...apaapa..',
  '........apaapa..',
  '.........aaaa..x',
  '........aaaaab..',
  '.......aaaeaab..',
  '.......aaaaaaap.',
  '...aaaaaaaaaab..',
  '..aaaaaaaaaaab..',
  '.wwaaaaaaaaaab..',
  '.wwaaaaaaaaaab..',
  '..gaaaaaaaaab...',
  '...ggggggggg....',
  '.....ggg.ggg....',
  '......g...g..x..',
];
// Centurionely: Stanley in a Roman helmet with a red crest, red cape, armour and sandals.
const centurionely = [
  '.......rrrrr....',
  '......rrrrrrr...',
  '..a.....hhhh....',
  '..a....hhhhhhl..',
  '..aa...hwwwal...',
  '...a...haeaaaa..',
  '...a....aaaaaan.',
  '.cccmmmmmawwww..',
  '.cccmgmgmmwwwww.',
  '.cccmmmmmmaww...',
  '..cclllllll.....',
  '...wwlllllww....',
  '...ww.....ww....',
  '...ww.....ww....',
  '...gg.....gg....',
  '...gg.....gg....',
];
// Even Rustier: Rusty, but made of metal. Rivets, rust patches, glowing eye.
const evenrustier = [
  '................',
  '...........kk...',
  '..........kaaa..',
  '..........aeaaa.',
  '...........aaaan',
  '...........wa...',
  '...aaroaaraww...',
  '..aaaaaaoaaww...',
  '.a.abaraaaww....',
  'a...b...aww.....',
  'a...b....b......',
  '....a....a......',
  '...a.....a......',
  '...a.....a......',
  '...a.....a......',
  '..kk.....kk.....',
];

export const PET_FRAMES = {
  sopressa:  [sopressa, stride(sopressa)],
  poltergeist: [poltergeist, stride(poltergeist, 3)],
  centurionely: [centurionely, stride(centurionely)],
  evenrustier: [evenrustier, stride(evenrustier, 5)],
  flamcess:  [flamcess, stride(flamcess)],
  floppy:    [floppy, stride(floppy, 3)],
  poodle:    [poodle, stride(poodle)],
  tabby:     [tabby, stride(tabby)],
  bunny:     [bunny, stride(bunny, 3)],
  frenchie:  [frenchie, stride(frenchie, 3)],
  schnauzer: [schnauzer, stride(schnauzer)],
  whippet:   [whippet, stride(whippet, 5)],
  lab:       [lab, stride(lab, 3)],
  kelpie:    [kelpie, stride(kelpie, 5)],
};

// Colours shared by every pet unless the pet overrides them in pets.js.
export const BASE_PALETTE = {
  e: '#1a1010', n: '#2a1a1a', p: '#f08aa0', r: '#e8508a', w: '#ffffff', s: '#5a3a1a',
};

