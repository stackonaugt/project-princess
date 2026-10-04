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
  '..........rr....',
  '.........wwww...',
  '........wwaaab..',
  '..ww....waaaaab.',
  '.wwab..bbaeaaab.',
  '.waab..bbaaaaan.',
  '..bb...bbbaaab..',
  '...a.aaaabbab...',
  '...aaaaaaaaab...',
  '...waaaaaaaab...',
  '....bbbbbbbb....',
  '....ab....ab....',
  '....ab....ab....',
  '...wab...wab....',
  '...bbb...bbb....',
];
const tabby = [
  '................',
  '..........a...a.',
  '..a.......aa.aa.',
  '.ab.......aaaaa.',
  '.ab......aaeaaa.',
  '..ab.....aaaaaan',
  '..ab.....wawwab.',
  '...ab....aawwa..',
  '...aaaasasaaab..',
  '...asasasasaab..',
  '...aaaaaaaaaab..',
  '...bsbsbsbsbb...',
  '....ab....ab....',
  '....ab....ab....',
  '....ab....ab....',
  '....bb....bb....',
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
  '..........a..a..',
  '.........aaa.aa.',
  '.........apaapa.',
  '.........aaaaaa.',
  '.........aaeaaa.',
  '.........aaaawwn',
  '..a......aaaawwb',
  '..ab...aaaaawwb.',
  '...aaaaaaaaawwb.',
  '..aaaaaaaaaawwb.',
  '..aaaaaaaaaaab..',
  '..bbbbbbbbbbbb..',
  '...ab.....ab....',
  '...ab.....ab....',
  '...bb.....bb....',
];
const schnauzer = [
  '................',
  '..........aa....',
  '.........aaab...',
  '.........wwwaa..',
  '..a......aeaaaa.',
  '..ab.....aaaaaan',
  '...ab....awwwww.',
  '....aaaaaawwwww.',
  '...aaaaaaaaawww.',
  '...aaaaaaaaaab..',
  '...baaaaaaaaab..',
  '...wwbbbbbbbww..',
  '...ww.....ww....',
  '...ww.....ww....',
  '...ww.....ww....',
  '...bb.....bb....',
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
