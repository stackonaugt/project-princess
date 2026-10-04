// Built-in item icons, 12x12 strings centred in a 16x16 texture.
export const ITEM_ART = {
  chicken: { pal: { a: '#c8823a', b: '#e8b060', w: '#f4efe0', k: '#5e3a1a' }, rows: [
    '............', '.........ww.', '........wwww', '.......kaaw.', '......kaab..', '.....kaab...',
    '....kaab....', '...kaab.....', '.wwaab......', 'wwwwk.......', '.ww.........', '............'] },
  sardine: { pal: { a: '#9fb8c8', b: '#d8e8f0', k: '#3a4a5a', e: '#1e1e1e' }, rows: [
    '............', '............', '............', '..kkkkkk..k.', '.kbbbbbbkkak', 'kbebaaaaaaak',
    'kbbaaaaaaaak', '.kaaaaaakkak', '..kkkkkk..k.', '............', '............', '............'] },
  carrot: { pal: { g: '#3f8a3e', l: '#6dbb58', a: '#e8822a', b: '#f0a050', k: '#a0521a' }, rows: [
    '.....gl.g...', '....lgglg...', '.....ggg....', '....kaaak...', '....abaak...', '....aaaka...',
    '.....aba....', '.....aak....', '.....aa.....', '......a.....', '......k.....', '............'] },
  cheese: { pal: { a: '#f5d63a', b: '#fff3a0', k: '#b8961e', r: '#c8443a' }, rows: [
    '............', '............', '..rrrrrrrr..', '.rkaaaaaakr.', '.rabbbbbbar.', '.raaaaaaaar.',
    '.rakaaaakar.', '.raaaaaaaar.', '.rkaaaaaakr.', '..rrrrrrrr..', '............', '............'] },
  snag: { pal: { a: '#f0d9a8', b: '#d8b070', s: '#a0522d', o: '#e8b060', r: '#c8443a' }, rows: [
    '............', '............', '............', '..ssssssss..', '.srrsssssss.', 'aaaaaaaaaaaa',
    'abbbbbbbbbba', 'aooooooooooa', '.aaaaaaaaaa.', '............', '............', '............'] },
  croissant: { pal: { a: '#d8923a', b: '#f0c070', k: '#8a5a2e', w: '#f4efe0' }, rows: [
    '............', '............', '....kkkk....', '..kkbaabkk..', '.kbaakkaabk.', 'kbak.ww.kabk',
    'kak.wwww.kak', 'kk........kk', '.k........k.', '............', '............', '............'] },
  lemon: { pal: { a: '#f5d63a', b: '#fff3a0', k: '#b8961e', g: '#3f8a3e' }, rows: [
    '............', '.......gg...', '......gg....', '....kkkk....', '..kaaaaak...', '.kabbaaaak..',
    'kaabaaaaaak.', 'kaaaaaaaaak.', '.kaaaaaaak..', '..kkaaakk...', '....kkk.....', '............'] },
  tennis: { pal: { a: '#d8e83a', b: '#f0f8a0', w: '#f4f4e8', k: '#8a9a1e' }, rows: [
    '............', '....kkkk....', '..kkaaaakk..', '.kbaaaawaak.', '.kbaaawaaak.', 'kaaaaawaaaak',
    'kaaaawaaaaak', 'kaaaawaaaaak', '.kaaawaaaak.', '.kkaaaaaakk.', '...kkkkkk...', '............'] },
  ribbon: { pal: { a: '#f07ab0', b: '#f8b0d0', k: '#b8407a' }, rows: [
    '............', '............', '.kk......kk.', '.kak....kak.', '.kaakkkkaak.', '.kabaakaabk.',
    '.kaakkkkaak.', '.kak.kk.kak.', '.kk..kk..kk.', '.....kk.....', '....kk.k....', '............'] },
  feather: { pal: { a: '#1e1e24', b: '#f4f4f0', g: '#5a5a66' }, rows: [
    '..........g.', '.........ag.', '........aag.', '.......abg..', '......abb...', '.....abbg...',
    '....aabg....', '...aaag.....', '..aag.......', '.ag.........', 'g...........', '............'] },
};

// Gear icons (pet shop), same format. Texture keys: item-gear-<id>.
export const GEAR_ART = {
  lead: { pal: { a: '#c8443a', b: '#e8705f', k: '#7a2018', m: '#b8b8c0' }, rows: [
    '....kkkk....', '...kaaaak...', '..ka....ak..', '..ka....ak..', '...kaaaak...', '....kabk....',
    '.....ka.....', '.....ka.....', '.....kak....', '......kak...', '.......mm...', '.......mm...'] },
  collar: { pal: { a: '#2a2a32', b: '#4a4a54', m: '#d8d8e0', k: '#101014', g: '#e8c040' }, rows: [
    '............', '............', '...kkkkkk...', '.kkaaaaaakk.', 'kamabamabmak', 'kaaaaaaaaaak',
    '.kkaaaaaakk.', '...kkggkk...', '.....gg.....', '....gkkg....', '.....gg.....', '............'] },
  harness: { pal: { a: '#3a8ad0', b: '#6ab0f0', k: '#1a4a7a', m: '#d8d8e0' }, rows: [
    '............', '..k......k..', '..ka....ak..', '..kak..kak..', '...kakkak...', '...kaaaak...',
    '..kabbbbak..', '..kaaaaaak..', '..kaamaaak..', '..kaaaaaak..', '...kkkkkk...', '............'] },
  bell: { pal: { a: '#e8c040', b: '#fff0a0', k: '#8a6a10', r: '#c8443a' }, rows: [
    '............', '.....rr.....', '....r..r....', '.....kk.....', '....kaak....', '...kabaak...',
    '...kabaak...', '..kaaaaaak..', '..kaaaaaak..', '.kkkkkkkkkk.', '.....kk.....', '............'] },
  bandana: { pal: { a: '#c8443a', b: '#f4f4f0', k: '#7a2018' }, rows: [
    '............', '............', 'kkkkkkkkkkkk', 'kaabaabaabak', '.kaaaaaaaak.', '..kabaabak..',
    '...kaaaak...', '....kaak....', '.....kk.....', '............', '............', '............'] },
  pouch: { pal: { a: '#8a6a3a', b: '#b8905a', k: '#4a3418', r: '#e8823a' }, rows: [
    '............', '...k....k...', '...kk..kk...', '....kkkk....', '..kkaaaakk..', '.kabbbbbbak.',
    '.kaaarraaak.', '.kaarrrraak.', '.kaaaaaaaak.', '.kaaaaaaaak.', '..kkkkkkkk..', '............'] },
  bowtie: { pal: { a: '#6a3ab0', b: '#9a6ae0', k: '#3a1a6a', w: '#f4f4f0' }, rows: [
    '............', '............', '............', 'kk........kk', 'kak..kk..kak', 'kabkkaakkbak',
    'kawakaakawak', 'kak..kk..kak', 'kk........kk', '............', '............', '............'] },
};
