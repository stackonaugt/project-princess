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
  basil: { pal: { a: '#3f8a3e', b: '#6dbb58', k: '#2a5e2e', s: '#8a6a4a' }, rows: [
    '............', '....bb.bb...', '...baakaab..', '..baak.kaab.', '..bak...kab.', '...ak.bb.k..',
    '.....baab...', '....bak.ab..', '.....k.k....', '......s.....', '......s.....', '............'] },
  zucchini: { pal: { a: '#3f8a3e', b: '#6dbb58', k: '#2a5e2e', y: '#f5d63a' }, rows: [
    '............', '..........yy', '.........kyy', '........kak.', '.......kbak.', '......kbak..',
    '.....kbak...', '....kbak....', '...kbak.....', '..kaak......', '..kkk.......', '............'] },
  potato: { pal: { a: '#c8a060', b: '#e0c088', k: '#8a6a3a', d: '#6a4a2a' }, rows: [
    '............', '............', '....kkkk....', '..kkbbaakk..', '.kbbaaadaak.', '.kbaaaaaaak.',
    '.kadaaaaadk.', '.kaaaaaaaak.', '..kkaadakk..', '....kkkk....', '............', '............'] },
  tomato: { pal: { a: '#d8403a', b: '#f07a6a', k: '#8a2020', g: '#3f8a3e' }, rows: [
    '............', '.....gg.....', '...g.gg.g...', '...kggggk...', '..kbbaaaak..', '.kbbaaaaaak.',
    '.kbaaaaaaak.', '.kaaaaaaaak.', '..kaaaaaak..', '...kkkkkk...', '............', '............'] },
  strawberry: { pal: { a: '#e83a5a', b: '#f87a8a', k: '#8a2030', g: '#3f8a3e', y: '#f5e66b' }, rows: [
    '............', '....g.g.g...', '...ggggggg..', '...kaaaaak..', '..kbaayaaak.', '..kbayaaaya.',
    '..kaaaayaak.', '...kayaaak..', '...kaaaak...', '....kaak....', '.....kk.....', '............'] },
  chilli: { pal: { a: '#e8502a', b: '#f08a5a', k: '#8a2a10', g: '#3f8a3e' }, rows: [
    '............', '..g.........', '..gg........', '...kak......', '...kbak.....', '....kbak....',
    '.....kbak...', '......kaak..', '.......kak..', '........kk..', '............', '............'] },
  pumpkin: { pal: { a: '#e89030', b: '#f8b860', k: '#a85a1a', g: '#3f8a3e', s: '#6a4a2a' }, rows: [
    '............', '.....sg.....', '.....s.gg...', '..kkkkkkkk..', '.kbakbaakbk.', 'kbaakaaakaak',
    'kaaakaaakaak', 'kaaakaaakaak', '.kaakaaakak.', '..kkkkkkkk..', '............', '............'] },
  // Fishing: bait, the catch, and camping presents
  bait: { pal: { a: '#e8e4dc', b: '#c8443a', k: '#6a6a72', w: '#e8909a', d: '#6a4a2a' }, rows: [
    '............', '............', '...kkkkkk...', '..kbbbbbbk..', '..kaaaaaak..', '..kadwddak..',
    '..kawwdwak..', '..kaddwdak..', '..kaaaaaak..', '...kkkkkk...', '............', '............'] },
  redfin: { pal: { a: '#7a8a3a', b: '#c8443a', k: '#3a4a1a', w: '#f4efe0', e: '#1e1e1e', s: '#3a4a2a' }, rows: [
    '............', '............', '.....kkk....', '...kkaaakk.k', '..kaesasaakb', '.kawaasasabb',
    '..kwwaasaakb', '...kkwwkkk.k', '.....bb.....', '............', '............', '............'] },
  carp: { pal: { a: '#c8a050', b: '#e8c880', k: '#6a4a1a', e: '#1e1e1e' }, rows: [
    '............', '............', '....kkkkk...', '..kkbbbbbk.k', '.kebaaaaaakk', 'kaaaaaaaaaak',
    '.kaaaaaaaakk', '..kkaaaakk.k', '....kkkk....', '............', '............', '............'] },
  eel: { pal: { a: '#4a5a3a', b: '#7a8a5a', k: '#1e2a1a', e: '#f4efe0' }, rows: [
    '............', '............', '..........kk', '.........kak', '..kkk...kak.', '.kebakkkab..',
    '.kaaabbbak..', '..kkkaaak...', '.....kkk....', '............', '............', '............'] },
  yabby: { pal: { a: '#5a4a6a', b: '#8a7a9a', k: '#2a1a3a', e: '#1e1e1e' }, rows: [
    '............', '.k......k...', 'kak....kak..', '.kak..kak...', '..kaaaak....', '..kebbek....',
    '...kaak.....', '...kaak.....', '...kaak.....', '..kaaaak....', '..k.kk.k....', '............'] },
  oldboot: { pal: { a: '#6a4a2a', b: '#8a6a42', k: '#2a1a0a', w: '#7ab0d8', l: '#c8a070' }, rows: [
    '............', '...kkkkk....', '...kbaak....', '...kaalk....', '...kaaak....', '...kaalk....',
    '...kaaakkkk.', '...kaaaaaabk', '..kaaaaaaaak', '..kkkkkkkkkk', '...w..w.....', '............'] },
  thermos: { pal: { a: '#2a6a5a', b: '#3a8a7a', k: '#1a3a32', s: '#c8ccd0' }, rows: [
    '....kkkk....', '....kssk....', '...kkkkkk...', '...kbaaak...', '...kbaaak...', '...kbaaak...',
    '...kssssk...', '...kbaaak...', '...kbaaak...', '...kbaaak...', '...kkkkkk...', '............'] },
  headtorch: { pal: { a: '#e8643a', b: '#2a2a30', k: '#1a1a1a', l: '#f8f0b0' }, rows: [
    '............', '............', '..kkkkkkkk..', '.kaaaaaaaak.', 'kak......kak', 'ka...kk...ak',
    'ka..kbbk..ak', 'kak.kllk.kak', '.kk.kllk.kk.', '.....kk.....', '............', '............'] },
  // Presents (gift: true) and fertiliser.
  paperback: { pal: { a: '#3a7ac8', b: '#6aa8e8', k: '#1a3a6a', w: '#f4efe0', y: '#e8c040' }, rows: [
    '............', '..kkkkkkkk..', '..kaaaaaawk.', '..kabbbbawk.', '..kayyyyawk.', '..kaaaaaawk.',
    '..kaybbyawk.', '..kaaaaaawk.', '..kaaaaaawk.', '..kaaaaaawk.', '..kkkkkkkkk.', '............'] },
  byzbook: { pal: { a: '#6a1a5a', b: '#9a3a8a', k: '#2a0a24', y: '#e8c040', w: '#f4efe0' }, rows: [
    '............', '.kkkkkkkkk..', '.kaaaaaaaawk', '.kayyyyyyawk', '.kayaaaayawk', '.kayabbayawk',
    '.kayabbayawk', '.kayaaaayawk', '.kayyyyyyawk', '.kaaaaaaaawk', '.kkkkkkkkkkk', '............'] },
  modeltrain: { pal: { a: '#c8ccd0', b: '#f4f4f0', k: '#4a4a54', r: '#c8443a', w: '#7ac8f0', d: '#2a2a2a' }, rows: [
    '............', '............', '............', '.kkkkkkkkkk.', 'kbbbbbbbbbbk', 'kwwakwwakwak',
    'kwwakwwakwak', 'krrrrrrrrrrk', 'kaaaaaaaaaak', '.kdkk..kkdk.', '..d......d..', '............'] },
  flowers: { pal: { r: '#e83a5a', y: '#f5d63a', p: '#c87ae8', g: '#3f8a3e', w: '#e8e0c8', k: '#8a8270' }, rows: [
    '..r..y......', '.rrryyy.p...', '..r.gy.ppp..', '...g.g..p...', '..ywg.gg....', '.yyywggw....',
    '..kwwwwwk...', '..kwwwwwk...', '...kwwwk....', '...kwwwk....', '....kwk.....', '............'] },
  icedcoffee: { pal: { a: '#8a5a32', b: '#f4efe0', k: '#4a2a12', g: '#3a7a4a', w: '#ffffff' }, rows: [
    '....kk......', '...kbbk.....', '..kbbbbk....', '..kkkkkk....', '..kaaaak....', '..kawwak....',
    '..kaaaak....', '..kggggk....', '..kbbbbk....', '..kaaaak....', '..kkkkkk....', '............'] },
  gaytime: { pal: { a: '#d89a3a', b: '#f0c070', k: '#7a4a1a', w: '#8a6a4a', c: '#f4e0b0' }, rows: [
    '....kkkk....', '...kabbak...', '...kbcbak...', '...kaaabk...', '...kabaak...', '...kaabak...',
    '...kbaaak...', '...kaaaak...', '....kkkk....', '.....ww.....', '.....ww.....', '.....ww.....'] },
  seedling: { pal: { g: '#3f8a3e', l: '#6dbb58', r: '#d8403a', k: '#2a2a2a', t: '#4a4a54' }, rows: [
    '.....rr.....', '....rrrr....', '....rrrr.l..', '.l..rrrr.l..', '..l..gg.l...', '...l.g.l....',
    '....lgl.....', '.....g......', '...kkkkk....', '...ktttk....', '...ktttk....', '...kkkkk....'] },
  olive: { pal: { g: '#7a9a6a', l: '#a8c098', k: '#3a4a2a', t: '#6a4a2a', p: '#c87a4a', d: '#8a4a2a' }, rows: [
    '...glg.gl...', '..glgglggl..', '.gllgklgllg.', '..gggkgglg..', '...gl.kgg...', '......k.....',
    '.....tk.....', '.....t......', '..pppppppp..', '...pddddp...', '...pppppp...', '....pppp....'] },
  gloves: { pal: { a: '#4a9a4a', b: '#7ac87a', k: '#1a4a1a', m: '#8a6a3a' }, rows: [
    '............', '..k.k.k.....', '.kakakak....', '.kakakakk...', '.kaaaaakak..', '.kabbaaaak..',
    '.kaaaaaak...', '.kaaaaak....', '.kkkkkkk....', '.kmmmmmk....', '.kkkkkkk....', '............'] },
  fertiliser: { pal: { a: '#c8a060', b: '#e0c088', k: '#6a4a2a', r: '#c8443a', w: '#f4efe0' }, rows: [
    '............', '...kkkkkk...', '..kbbbbbbk..', '..kaaaaaak..', '..kwwwwwwk..', '..kwrrrrwk..',
    '..kwwwwwwk..', '..kaaaaaak..', '..kaaaaaak..', '..kaaaaaak..', '...kkkkkk...', '............'] },
};

// Seed packets: drawn from the crop's colour (texture item-seed-<crop>).
export function paintSeedPacket(p, colour) {
  p.r('#6a4a2a', 3, 1, 10, 14); p.r('#f4efe0', 4, 2, 8, 12); p.r('#d8d0b8', 4, 12, 8, 2);
  p.blob(8, 7, 3, colour); p.r('#3f8a3e', 8, 3, 1, 2); p.r('#ffffff', 7, 6, 1, 1);
  p.r('#c8b898', 5, 11, 6, 1);
}

// Bottle shop drinks (items with drink: true), drawn from their art colours.
export function paintDrink(p, a) {
  const k = '#1e1a18', glint = 'rgba(255,255,255,0.45)';
  if (a.kind === 'can') {
    p.r(k, 4, 2, 8, 13); p.r(a.cap, 5, 2, 6, 1); p.r(a.body, 5, 3, 6, 11); p.r(a.cap, 5, 13, 6, 1);
    p.r(a.label, 5, 6, 6, 4); p.r(a.body, 6, 7, 4, 2); p.r(a.label, 7, 7, 2, 2); p.r(glint, 6, 3, 1, 10);
  } else if (a.kind === 'stubby' || a.kind === 'longneck') {
    const top = a.kind === 'longneck' ? 1 : 3;
    p.r(k, 6, top - 1, 4, 5); p.r(a.cap, 7, top - 1, 2, 1); p.r(a.body, 7, top, 2, 4);
    p.r(k, 4, top + 3, 8, 15 - top - 2); p.r(a.body, 5, top + 4, 6, 15 - top - 4);
    p.r(a.label, 5, 9, 6, 4); p.r(a.cap, 7, 10, 2, 2); p.r(glint, 6, top + 4, 1, 4);
  } else if (a.kind === 'wine') {
    p.r(k, 6, 0, 4, 6); p.r(a.cap, 7, 0, 2, 3); p.r(a.body, 7, 3, 2, 3);
    p.r(k, 4, 5, 8, 11); p.r(a.body, 5, 6, 6, 9);
    p.r(a.label, 5, 9, 6, 4); p.r(k, 6, 10, 4, 1); p.r(glint, 6, 6, 1, 3);
  } else if (a.kind === 'packet') {
    p.r(k, 2, 2, 12, 13); p.r(a.body, 3, 3, 10, 11); p.r(shadeHex(a.body), 3, 12, 10, 2);
    p.r(a.cap, 3, 3, 10, 1); p.r(a.label, 4, 6, 8, 4); p.r(a.body, 5, 7, 2, 2); p.r(glint, 4, 4, 1, 7);
  } else if (a.kind === 'vape') {
    p.r(k, 5, 1, 6, 14); p.r(a.cap, 6, 2, 4, 3); p.r(a.body, 6, 5, 4, 9); p.r(shadeHex(a.body), 9, 5, 1, 9);
    p.r(a.label, 6, 8, 3, 3); p.r(glint, 6, 5, 1, 4);
  } else {
    p.r(k, 2, 3, 12, 12); p.r(a.body, 3, 4, 10, 10); p.r(shadeHex(a.body), 3, 12, 10, 2);
    p.r(a.label, 4, 6, 8, 4); p.r(a.body, 5, 7, 6, 2); p.r(a.cap, 10, 14, 2, 2); p.r(k, 6, 2, 4, 2);
  }
}
const shadeHex = c => { const n = parseInt(c.slice(1), 16); const f = v => Math.round(v * 0.8); return '#' + ((1 << 24) | (f(n >> 16) << 16) | (f((n >> 8) & 255) << 8) | f(n & 255)).toString(16).slice(1); };

// Novels from Brunswick Bound (items with book: true), drawn from their cover colours.
export function paintBook(p, a) {
  const k = '#1e1a18';
  p.r(k, 3, 2, 10, 13); p.r(a.cover, 4, 3, 8, 11); p.r(shadeHex(a.cover), 4, 3, 1, 11);
  p.r(a.band, 4, 6, 8, 3); p.r(a.cover, 6, 7, 4, 1);
  p.r('#f4efe0', 12, 3, 1, 11); p.r(k, 13, 3, 1, 12);
}

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
