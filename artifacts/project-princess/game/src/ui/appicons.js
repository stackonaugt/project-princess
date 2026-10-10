// Pixel art app icons for the Pawphone, 16x16 like the rest of the game,
// drawn from little character grids (one letter per pixel, '.' is clear).
const ICONS = {
  skills: { pal: { k:'#4a2a12', a:'#f0bd83', b:'#d18a52' }, rows: [
    '................','.........kkkk...','........kaaaak..','........kaaaak..','.........kaak...','.........kaak...','...kkkk..kaak...','..kaaaakkkaak...','.kaaaaaaaaaak...','.kaaaaabaaaak...','.kaaaabbaaaak...','..kaabbbbaaak...','...kaaaaaaak....','....kkkkkkk.....','................','................'] },
  todo: { pal: { k: '#1e1a18', w: '#ffffff', g: '#d8d8e0', t: '#3aa85a' }, rows: [
    '................', '..kkkkkkkkkk....', '..kwwwwwwwwk..tt', '..kwwwwwwwwk.tt.', '..kwwwwwwwtktt..', '..kwwwwwwttkt...', '..ktwwwwttwk....', '..kttwwttwwk....',
    '..kwttttwwwk....', '..kwwttwwwwk....', '..kwwwwwwwwk....', '..kgggggggggk...', '..kkkkkkkkkkk...', '................', '................', '................'] },
  dex: { pal: { k: '#1e1a18', r: '#d83a3a', d: '#a02020', b: '#6ac8f0', w: '#ffffff', y: '#f5d63a', g: '#3a3a44' }, rows: [
    '................', '.kkkkkkkkkkkkk..', '.krrrrrrrrrrrk..', '.krkkkkrrywrrk..', '.krkbbkrrrrrrk..', '.krkbwkrrrrrrk..', '.krkkkkrrrrrrk..', '.krrrrrrrrrrrk..',
    '.kddddddddddddk.', '.krrkkkkkkkrrk..', '.krrkggggggkrrk.', '.krrkggggggkrrk.', '.krrkkkkkkkrrk..', '.krrrrrrrrrrrk..', '.kkkkkkkkkkkkk..', '................'] },
  bag: { pal: { k: '#1e1a18', b: '#3a7ad8', d: '#2a58a8', l: '#7ab0f0', y: '#f5d63a' }, rows: [
    '................', '.....kkkkkk.....', '....kk....kk....', '...kkkkkkkkkk...', '..kbbbbbbbbbbk..', '..kblllllllbbk..', '..kbbbbbbbbbbk..', '..kbdddddddbbk..',
    '..kbdbbybbdbbk..', '..kbdbbbbbdbbk..', '..kbdddddddbbk..', '..kbbbbbbbbbbk..', '..kdddddddddddk.', '...kkkkkkkkkkk..', '................', '................'] },
  friends: { pal: { k: '#1e1a18', r: '#e2306a', o: '#f08030', y: '#f5c83a', p: '#a03ac8', w: '#ffffff' }, rows: [
    '................', '..kkkkkkkkkkkk..', '.kppppprrrrrrrk.', '.kpwwwwwwwwwwrk.', '.kpw.......wwrk.', '.krw..kkk...wok.', '.krw.kwwwk..wok.', '.krw.kw.wk..wok.',
    '.krw.kwwwk..wok.', '.kow..kkk...wyk.', '.kow........wyk.', '.kowwwwwwwwwwyk.', '.kooooyyyyyyyyk.', '..kkkkkkkkkkkk..', '................', '................'] },
  map: { pal: { k: '#1e1a18', g: '#6a6e78', l: '#c8ccd4', w: '#ffffff', b: '#2a6ab0', t: '#78be20', r: '#e2506a' }, rows: [
    '................', '..kkkkkkkkkkkk..', '.kggggggggggggk.', '.kgwwwwwwwwwwgk.', '.kgwbbbbbbbbwgk.', '.kgwbwwwwwwbwgk.', '.kgwbbbbbbbbwgk.', '.kgwwwwwwwwwwgk.',
    '.kgwttttttttwgk.', '.kgwtwwtwwtwwgk.', '.kgwttttttttwgk.', '.kgwwkwwwwkwwgk.', '.kggggggggggggk.', '..kkkkkkkkkkkk..', '................', '................'] },
  garden: { pal: { k: '#1e1a18', g: '#5aa83a', d: '#3a7a28', b: '#8a5a30', n: '#6a4020', o: '#d87a3a' }, rows: [
    '................', '.......k........', '..kk..kgk..kk...', '.kggk.kgk.kggk..', '.kgggkkgkkgggk..', '..kgggkgkgggk...', '...kddkgkddk....', '.....kkgkk......',
    '......kgk.......', '...kkkkkkkkk....', '...kooooooook...', '....koooooook...', '....kbbbbbbbk...', '.....knnnnnk....', '......kkkkk.....', '................'] },
  calendar: { pal: { k: '#1e1a18', r: '#d83a3a', w: '#ffffff', g: '#b8b8c0', b: '#1e1a18' }, rows: [
    '................', '...k......k.....', '.kkkkkkkkkkkkk..', '.krrrrrrrrrrrk..', '.krrrrrrrrrrrk..', '.kwwwwwwwwwwwk..', '.kwgwgwgwgwgwk..', '.kwwwwwwwwwwwk..',
    '.kwgwgwbbwgwwk..', '.kwwwwwbbwwwwk..', '.kwgwgwgwgwgwk..', '.kwwwwwwwwwwwk..', '.kkkkkkkkkkkkk..', '................', '................', '................'] },
  settings: { pal: { k: '#1e1a18', g: '#8a8e98', d: '#5a5e68', l: '#c8ccd4' }, rows: [
    '................', '.......kk.......', '...kk.kggk.kk...', '..kggkggggkggk..', '...kggggggggk...', '...kgggkkgggk...', '.kkggkkllkkggkk.', 'kgggggklllkggggk',
    'kgggggklllkggggk', '.kkggkkllkkggkk.', '...kgggkkgggk...', '...kggggggggk...', '..kggkggggkggk..', '...kk.kggk.kk...', '.......kk.......', '................'] },
  cheats: { pal: { k: '#1e1a18', g: '#9a9ea8', l: '#d0d4dc', r: '#c8302a' }, rows: [
    '................', '..........kkk...', '.........kggk...', '........kggk.k..', '........kgggkgk.', '.......kggggggk.', '......kggkkkkk..', '.....kggk.......',
    '....kggk........', '...krrk.........', '..krrk..........', '.krrk...........', '.kkk............', '................', '................', '................'] },
};

const cache = {};
// A data URL of an app icon, scaled up crisp.
export function appIcon(id, size = 48) {
  const key = id + size;
  if (cache[key]) return cache[key];
  const icon = ICONS[id];
  if (!icon) return '';
  const c = document.createElement('canvas');
  c.width = c.height = 16;
  const g = c.getContext('2d');
  icon.rows.forEach((row, y) => [...row].forEach((ch, x) => { if (icon.pal[ch]) { g.fillStyle = icon.pal[ch]; g.fillRect(x, y, 1, 1); } }));
  const out = document.createElement('canvas');
  out.width = out.height = size;
  const o = out.getContext('2d');
  o.imageSmoothingEnabled = false;
  o.drawImage(c, 0, 0, size, size);
  return (cache[key] = out.toDataURL());
}
