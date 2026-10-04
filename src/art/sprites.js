// Built-in pixel sprites, written as strings. Each letter is a palette colour,
// '.' is transparent. Characters are 12x12 and get centred in a 16x16 frame.
//
// Every sprite has a list of frames. Pets: [idle, step]. People: [idle, stepA, stepB].
// You never need to touch this file to use your own art: drop PNGs into
// assets/sprites/ instead (see assets/sprites/README.md).

// Replace the last N rows of a sprite to make an extra animation frame.
const legs = (rows, ...tail) => rows.slice(0, rows.length - tail.length).concat(tail);

const poodle = [
  '.....rr.....', '....kaak....', '...kaaaak...', '.kkkaaaakkk.', 'kbbkaaaakbbk', 'kbbaeaaeabbk',
  'kbbaaaaaabbk', '.kbaakkaabk.', '..kaaaaaak..', '..kbaaaabk..', '.kaak..kaak.', '.kkk....kkk.',
];
const tabby = [
  '............', '.k........k.', '.kk......kk.', '.kpk....kpk.', '.kaabbbbaak.', '.kaaabbaaak.',
  '.kaeaaaaeak.', '.kaaaaaaaak.', '.kaaappaaak.', '..kbaaaabk..', '..kak..kak..', '..kk....kk..',
];
const bunny = [
  '...kk..kk...', '..kbk..kbk..', '..kbk..kbk..', '..kak..kak..', '..kaakkaak..', '.kaaaaaaaak.',
  '.kaeaaaaeak.', '.kaaappaaak.', '.kaaaaaaaak.', '..kaaaaaak..', '..kaaaaaak..', '...kk..kk...',
];
const frenchie = [
  '.kk......kk.', 'kbak....kabk', 'kbaak..kaabk', '.kaakkkkaak.', '.kaaaaaaaak.', 'kaeaaaaaaeak',
  'kaaaaaaaaaak', 'kaaakkkkaaak', '.kaaawwaaak.', '.kaaawwaaak.', '.kaak..kaak.', '.kkk....kkk.',
];
const schnauzer = [
  '.kk......kk.', '.kak....kak.', '..kakkkkak..', '..kaaaaaak..', '.kbbbaabbbk.', '.kaeaaaaeak.',
  '.kaaaaaaaak.', '.kawwkkwwak.', '..kwwwwwwk..', '..kwwwwwwk..', '.kaak..kaak.', '.kkk....kkk.',
];

export const PET_FRAMES = {
  poodle:    [poodle, legs(poodle, '..kaakkaak..', '..kkk..kkk..')],
  tabby:     [tabby, legs(tabby, '...kakkak...', '...kk..kk...')],
  bunny:     [bunny, legs(bunny, '..kaaaaaak..', '..kk....kk..')],
  frenchie:  [frenchie, legs(frenchie, '..kaakkaak..', '..kkk..kkk..')],
  schnauzer: [schnauzer, legs(schnauzer, '..kaakkaak..', '..kkk..kkk..')],
};

const pDown = [
  '...kkkkkk...', '..khhhhhhk..', '.khhhhhhhhk.', '.khsssssshk.', '.kskssssksk.', '..kssssssk..',
  '..kcccccck..', '.ksccccccsk.', '.ksccccccsk.', '..kllllllk..', '..kll..llk..', '..kkk..kkk..',
];
const pUp = [
  '...kkkkkk...', '..khhhhhhk..', '.khhhhhhhhk.', '.khhhhhhhhk.', '.khhhhhhhhk.', '..khhhhhhk..',
  '..kcccccck..', '.ksccccccsk.', '.ksccccccsk.', '..kllllllk..', '..kll..llk..', '..kkk..kkk..',
];
const pLeft = [
  '...kkkkkk...', '..khhhhhhk..', '.khhhhhhhhk.', '.ksssshhhhk.', '.kkssshhhhk.', '..kssssshk..',
  '..kcccccck..', '..kscccccck.', '..kscccccck.', '..kllllllk..', '..kll..llk..', '..kkk..kkk..',
];
const walk = rows => [
  rows,
  legs(rows, '..kll..lk...', '..kkk..kk...'),
  legs(rows, '...kl..llk..', '...kk..kkk..'),
];
export const PERSON_FRAMES = { down: walk(pDown), up: walk(pUp), left: walk(pLeft) };

// Colours shared by every sprite unless a pet or person overrides them.
export const BASE_PALETTE = {
  k: '#3a2412', e: '#2a1a0c', p: '#f08aa0', y: '#f0a030', w: '#ffffff', r: '#d83c3c',
  h: '#6b3f1f', s: '#f2c79a', c: '#3fa38f', l: '#33446e',
};

export const PLAYER_PALETTE = { h: '#6b3f1f', s: '#f2c79a', c: '#3fa38f', l: '#33446e' };
