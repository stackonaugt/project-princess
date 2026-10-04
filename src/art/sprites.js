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

export const PET_FRAMES = {
  poodle:    [poodle, stride(poodle)],
  tabby:     [tabby, stride(tabby)],
  bunny:     [bunny, stride(bunny, 3)],
  frenchie:  [frenchie, stride(frenchie, 3)],
  schnauzer: [schnauzer, stride(schnauzer)],
};

// Colours shared by every pet unless the pet overrides them in pets.js.
export const BASE_PALETTE = {
  e: '#1a1010', n: '#2a1a1a', p: '#f08aa0', r: '#e8508a', w: '#ffffff', s: '#5a3a1a',
};

// The player's look (see src/art/paint/people.js for the options).
export const PLAYER_LOOK = { skin: '#f2c79a', hair: '#6b3f1f', hairStyle: 'short', shirt: '#3fa38f', pants: '#33446e', shoes: '#4a2a18' };
