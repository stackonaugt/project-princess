// Paints a whole region's ground onto one canvas. Tiles look at their
// neighbours to draw edges (kerbs, shorelines, path borders).
//
// Ground letters (used in src/world/maps/*.js):
//   .  grass        ,  flowers      "  tall grass    =  dirt path
//   #  road         +  tram tracks  x  level crossing r  railway
//   f  footpath     c  concrete     p  platform       b  bluestone lane
//   ~  water        w  bridge       s  sand           d  tilled soil
//   g  gravel       m  mulch        L  mown lawn      u  park gravel (decomposed granite)
//   z  zebra crossing               P  car park bay   h  driveway slabs
// Indoors:
//   W  wall         V  void (outside the house)       D  doorway
//   o  timber floor T  bathroom tiles K  carpet        n  lino (laundry)
//   Q  terrazzo (civic centre foyer)   U  patterned blue carpet (council chamber, brick walls)
import { hash } from '../../util.js';
import { shade } from './painter.js';
import { terrainContours, traceTerrain } from './terrain-curves.js';

export const TILE_NAMES = {
  '.': 'grass', ',': 'flowers', '"': 'tallgrass', '=': 'path', '#': 'road', '+': 'tram', 'x': 'crossing',
  'r': 'rail', 'f': 'footpath', 'c': 'concrete', 'p': 'platform', 'b': 'bluestone', '~': 'water',
  'w': 'bridge', 's': 'sand', 'd': 'soil', 'g': 'gravel', 'm': 'mulch',
  'A': 'track', 'k': 'pavers', 'L': 'lawn', 'u': 'parkgravel', 'z': 'zebra', 'P': 'carpark', 'h': 'driveway',
  'B': 'rail', 'W': 'wall', 'V': 'void', 'D': 'doorway', 'o': 'timber', 'T': 'bathtile', 'K': 'carpet', 'n': 'lino', 'Q': 'terrazzo', 'q': 'malltile', 'U': 'chambercarpet',
  'R': 'rooftop', 'Y': 'houseroof',
};
const WALLISH = 'WV';
const FLOORS = 'oTKnDQqU';

const FLOWERS = ['#f5e66b', '#f28bb0', '#ffffff', '#b79cf0', '#f29a5b'];
const ROADLIKE = '#+xzPk';
const T = 16;

// Painted walls: white, unless the map says otherwise (Lincraft paint at home).
let WALL_PAINT = null;
export function paintGround(p, map, grass, custom = {}) {
  WALL_PAINT = map.wallPaint || null;
  const get = (x, y) => (x < 0 || y < 0 || x >= map.w || y >= map.h) ? null : map.ground[y][x];
  const court = map.id === 'allen';
  const paths= !map.wallPaint && !map.ground.some(row=>row.includes('W'));
  const pathLetters='=ugf';
  for (let ty = 0; ty < map.h; ty++) for (let tx = 0; tx < map.w; tx++) {
    const c = map.ground[ty][tx];
    if (c === '~' || (court && '#f'.includes(c)) || (paths && pathLetters.includes(c))) {
      if (custom.grass) p.ctx.drawImage(custom.grass, tx * T, ty * T, T, T);
      else grassBase(p, tx, ty, tx * T, ty * T, grass);
      continue;
    }
    const img = custom[TILE_NAMES[c]];
    if (img) { p.ctx.drawImage(img, 0, 0, img.width, img.height, tx * T, ty * T, T, T); continue; }
    // A custom grass tile also goes under flowers and tall grass.
    const under = (c === ',' || c === '"') && custom.grass;
    if (under) p.ctx.drawImage(under, 0, 0, under.width, under.height, tx * T, ty * T, T, T);
    paintTile(p, c, tx, ty, tx * T, ty * T, get, grass, !!under);
  }
  if(paths) roundedSurface(p,map,grass,custom,get,pathLetters,'paths','#a19473');
  roundedSurface(p, map, grass, custom, get, '~w', '~', '#2f6aa3');
  if (court) {
    roundedSurface(p, map, grass, custom, get, '#f', 'f', '#9c9686');
    roundedSurface(p, map, grass, custom, get, '#', '#', '#e2dccf');
  }
  // Bridges keep their planks and interaction footprint over the curved water.
  for (let y=0;y<map.h;y++) for (let x=0;x<map.w;x++) if (get(x,y)==='w') {
    if (custom.bridge) p.ctx.drawImage(custom.bridge,x*T,y*T,T,T);
    else paintTile(p,'w',x,y,x*T,y*T,get,grass,false,true);
  }
}

function roundedSurface(p,map,grass,custom,get,letters,material,edge) {
  const loops=terrainContours(map,letters,T,material!=='~');
  if (!loops.length) return;
  p.ctx.save(); traceTerrain(p.ctx,loops); p.ctx.clip('evenodd');
  for (let y=0;y<map.h;y++) for (let x=0;x<map.w;x++) {
    let near=false;
    for (let dy=-1;dy<=1&&!near;dy++) for (let dx=-1;dx<=1;dx++) if (letters.includes(get(x+dx,y+dy)||'!')) { near=true; break; }
    if (!near) continue;
    let surface=material;
    if(material==='paths'){surface=letters.includes(get(x,y)||'!')?get(x,y):null;for(let dy=-1;dy<=1&&!surface;dy++)for(let dx=-1;dx<=1&&!surface;dx++){const c=get(x+dx,y+dy);if(letters.includes(c||'!'))surface=c;}surface ||= '=';}
    const img=custom[TILE_NAMES[surface]];
    if (img) p.ctx.drawImage(img,x*T,y*T,T,T);
    else paintTile(p,surface,x,y,x*T,y*T,get,grass,false,true);
  }
  traceTerrain(p.ctx,loops); p.ctx.strokeStyle=edge; p.ctx.lineWidth=material==='~'?2:2.5; p.ctx.stroke();
  p.ctx.restore();
}

function same(get, x, y, set) { const c = get(x, y); return c === null || set.includes(c); }

function grassBase(p, tx, ty, sx, sy, g) {
  const r = hash(tx, ty);
  p.r(r > 0.5 ? g[0] : g[1], sx, sy, T, T);
  for (let i = 0; i < 3; i++) {
    const q = hash(tx * 5 + i, ty * 3 - i);
    if (q < 0.6) {
      const x = sx + 1 + Math.floor(q * 23) % 13, y = sy + 2 + Math.floor(q * 41) % 11;
      p.r(g[2], x, y, 1, 2); p.r(g[2], x + 2, y - 1, 1, 3); p.r(g[3], x + 1, y - 2, 1, 1);
    }
  }
}

function paintTile(p, c, tx, ty, sx, sy, get, g, overlayOnly = false, smooth = false) {
  const r = hash(tx, ty), r2 = hash(ty + 7, tx + 3);
  switch (c) {
    case '~': case 'w': {
      p.r('#4a90cf', sx, sy, T, T);
      const W = '~w';
      if (!smooth && !same(get, tx, ty - 1, W)) { p.r('#2f6aa3', sx, sy, T, 3); p.r(g[2], sx, sy, T, 1); }
      if (!smooth && !same(get, tx - 1, ty, W)) p.r('#3c7bb8', sx, sy, 2, T);
      if (!smooth && !same(get, tx + 1, ty, W)) p.r('#3c7bb8', sx + T - 2, sy, 2, T);
      if (!smooth && !same(get, tx, ty + 1, W)) p.r('#a8d8f2', sx, sy + T - 2, T, 2);
      p.r('#5a9ed8', sx + 3 + Math.floor(r * 7), sy + 5 + Math.floor(r2 * 6), 4, 1);
      if (c === 'w') {
        p.r('#8a5a2e', sx, sy + 1, T, 14);
        for (let i = 0; i < 4; i++) p.r('#a8723c', sx + i * 4, sy + 2, 3, 12);
        p.r('#5e3a1a', sx, sy + 1, T, 1); p.r('#5e3a1a', sx, sy + 14, T, 1);
        p.r('#6b4226', sx, sy, T, 1); p.r('#6b4226', sx, sy + 15, T, 1);
      }
      return;
    }
    case '=': {
      p.r('#d4ad78', sx, sy, T, T);
      const P = '=wf#+cxpbg';
      if (!smooth && !same(get, tx, ty - 1, P)) p.r('#c29a64', sx, sy, T, 1);
      if (!smooth && !same(get, tx, ty + 1, P)) p.r('#b98f5c', sx, sy + T - 1, T, 1);
      if (!smooth && !same(get, tx - 1, ty, P)) p.r('#c29a64', sx, sy, 1, T);
      if (!smooth && !same(get, tx + 1, ty, P)) p.r('#c29a64', sx + T - 1, sy, 1, T);
      p.r('#bf955d', sx + Math.floor(r * 13), sy + Math.floor(r2 * 13), 2, 1);
      p.r('#e3c290', sx + Math.floor(r2 * 12), sy + Math.floor(r * 12), 2, 1);
      return;
    }
    case 'W': {
      // White painted walls with white skirting; tiled walls in the bathroom and laundry.
      const below = get(tx, ty + 1), below2 = get(tx, ty + 2);
      const face = below !== null && !WALLISH.includes(below);
      const upper = below === 'W' && below2 !== null && !WALLISH.includes(below2);
      const room = face ? below : below2;
      const tiled = room === 'T' || room === 'n';
      const paint = WALL_PAINT || '#f2f0ea', shadeL = WALL_PAINT ? shade(WALL_PAINT, -0.08) : '#e2dfd6', grout = '#cfd3d4';
      const cap = '#6a6460', capL = '#7e7872';
      const tiles = (y0) => { for (let y = y0; y < T; y += 4) p.r(grout, sx, sy + y, T, 1); for (let x = (ty % 2) * 2; x < T; x += 4) p.r(grout, sx + x, sy + y0, 1, T - y0); };
      if (face && room === 'U') {
        // the council chamber: a face brick wall with a timber dado
        p.r('#a8603a', sx, sy, T, T);
        for (let y = 0; y < T; y += 4) { p.r('#c89a7a', sx, sy + y + 3, T, 1); p.r('#c89a7a', sx + ((y / 4 + tx) % 2) * 8, sy + y, 1, 3); }
        p.r('#8a5a32', sx, sy + T - 4, T, 4); p.r('#a8723c', sx, sy + T - 4, T, 1);
        if (!upper && get(tx, ty - 1) !== 'W') p.r(cap, sx, sy, T, 2);
      } else if (face) {
        p.r(paint, sx, sy, T, T);
        if (tiled) { p.r('#f8f8f6', sx, sy + 4, T, T - 4); tiles(4); }
        else { p.r(shadeL, sx, sy, T, 1); p.r(WALL_PAINT ? shade(WALL_PAINT, -0.04) : '#ebe8e0', sx, sy + 5, T, 1); }   // picture rail
        p.r('#ffffff', sx, sy + T - 3, T, 3); p.r('#d8d4cc', sx, sy + T - 3, T, 1);
        if (!upper && get(tx, ty - 1) !== 'W') p.r(cap, sx, sy, T, 2);
      } else if (upper) {
        p.r(cap, sx, sy, T, 5); p.r(capL, sx, sy + 4, T, 1);
        p.r(paint, sx, sy + 5, T, T - 5);
        if (tiled) { p.r('#f8f8f6', sx, sy + 9, T, T - 9); tiles(9); }
      } else {
        p.r(cap, sx, sy, T, T);
        p.r(capL, sx + 2, sy + 2, T - 4, T - 4);
        if (FLOORS.includes(get(tx - 1, ty) || 'V')) p.r('#4a4440', sx, sy, 2, T);
        if (FLOORS.includes(get(tx + 1, ty) || 'V')) p.r('#4a4440', sx + T - 2, sy, 2, T);
      }
      return;
    }
    case 'V': p.r('#1a1410', sx, sy, T, T); return;
    case 'o': case 'D': case 'n': {
      // honey-coloured floorboards (the laundry has a lighter laminate)
      const lam = c === 'n';
      const a = lam ? '#d4a878' : '#c48a50', b = lam ? '#caa070' : '#b87e46', j = lam ? '#b08458' : '#9a6634';
      for (let row = 0; row < 4; row++) {
        const y = sy + row * 4, off = (row * 7 + tx * 3) % 16;
        p.r(row % 2 ? a : b, sx, y, T, 4);
        p.r(j, sx, y + 3, T, 1);
        p.r(j, sx + off % T, y, 1, 3);
        if (hash(tx * 4 + row, ty) > 0.7) p.r(lam ? '#e0b88a' : '#d09a60', sx + (off + 5) % 14, y + 1, 3, 1);
      }
      if (c === 'D') { p.r('#a0703c', sx, sy, T, 2); p.r('#a0703c', sx, sy + T - 2, T, 2); }
      return;
    }
    case 'T': {
      // small terracotta floor tiles
      p.r('#a8744e', sx, sy, T, T);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) p.r((i + j + tx + ty) % 3 ? '#b4805a' : '#9a6a46', sx + i * 4, sy + j * 4, 3, 3);
      return;
    }
    case 'Q': {
      // speckled terrazzo
      p.r('#e4e0d8', sx, sy, T, T);
      for (let i = 0; i < 14; i++) p.r(['#b8b2a8', '#f4f2ee', '#9a948a', '#d8c8b0'][i % 4], sx + Math.floor(hash(tx * 17 + i, ty) * 15), sy + Math.floor(hash(tx, ty * 17 + i) * 15), 1, 1);
      return;
    }
    case 'q': {
      // plain grey shopping centre floor tiles, big squares with a faint shine
      p.r('#c8ccd0', sx, sy, T, T);
      if ((tx + ty) % 2) p.r('#c2c6ca', sx, sy, T, T);
      p.r('#b4b8bc', sx, sy + T - 1, T, 1); p.r('#b4b8bc', sx + T - 1, sy, 1, T); p.r('#d6dade', sx + 2, sy + 2, 3, 1);
      return;
    }
    case 'U': {
      // navy chamber carpet with a little red and gold dot pattern
      p.r('#2a3a68', sx, sy, T, T);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if ((i + j + tx + ty) % 2 === 0) p.r(i % 2 ? '#a8443a' : '#c8a84a', sx + i * 4 + 1, sy + j * 4 + 1, 1, 1);
      return;
    }
    case 'K': {
      p.r('#c9b49a', sx, sy, T, T);
      for (let i = 0; i < 10; i++) p.r(i % 2 ? '#bca68c' : '#d4c0a6', sx + Math.floor(hash(tx * 13 + i, ty) * 15), sy + Math.floor(hash(tx, ty * 13 + i) * 15), 1, 1);
      return;
    }
    case 'L': {
      const stripe = Math.floor(tx / 2) % 2;
      p.r(stripe ? '#6cbc4a' : '#62b244', sx, sy, T, T);
      for (let i = 0; i < 5; i++) { const q = hash(tx * 7 + i, ty * 5); p.r(stripe ? '#58a83c' : '#7cc858', sx + Math.floor(q * 15), sy + Math.floor(hash(ty, tx + i) * 14), 1, 2); }
      return;
    }
    case 'u': {
      p.r('#d8b884', sx, sy, T, T);
      for (let i = 0; i < 8; i++) p.r(i % 3 ? '#c8a670' : '#e8cca0', sx + Math.floor(hash(tx * 11 + i, ty) * 15), sy + Math.floor(hash(tx, ty * 11 + i) * 15), 1, 1);
      if (!smooth && !same(get, tx, ty - 1, 'u=')) p.r('#c29a64', sx, sy, T, 1);
      if (!smooth && !same(get, tx, ty + 1, 'u=')) p.r('#b98f5c', sx, sy + T - 1, T, 1);
      return;
    }
    case 'A': {
      // red athletics track; white lane lines follow whichever way the track runs
      p.r('#c0503a', sx, sy, T, T);
      for (let i = 0; i < 4; i++) p.r('#cc5e46', sx + Math.floor(hash(tx * 5 + i, ty) * 15), sy + Math.floor(hash(tx, ty * 5 + i) * 15), 1, 1);
      const horiz = same(get, tx - 1, ty, 'A') && same(get, tx + 1, ty, 'A');
      if (horiz) { p.r('#ece4dc', sx, sy + 5, T, 1); p.r('#ece4dc', sx, sy + 11, T, 1); }
      else { p.r('#ece4dc', sx + 5, sy, 1, T); p.r('#ece4dc', sx + 11, sy, 1, T); }
      return;
    }
    case 'k': {
      p.r('#b86a4a', sx, sy, T, T);
      for (let y = 0; y < T; y += 4) for (let x = (y / 4) % 2 ? 0 : 4; x < T; x += 8) p.r('#c8805e', sx + x, sy + y, 7, 3);
      return;
    }
    case 'h': {
      p.r('#c4c0b6', sx, sy, T, T);
      if (tx % 3 === 0) p.r('#aaa69c', sx, sy, 1, T);
      if (ty % 3 === 0) p.r('#aaa69c', sx, sy, T, 1);
      if (hash(tx, ty) > 0.8) p.r('#b4b0a6', sx + 5, sy + 6, 4, 2);
      return;
    }
    case '#': case '+': case 'x': case 'z': case 'P': {
      p.r('#5d5f66', sx, sy, T, T);
      p.r('#6b6d74', sx + Math.floor(r * 13), sy + Math.floor(r2 * 13), 2, 1);
      p.r('#53555c', sx + Math.floor(r2 * 13), sy + Math.floor(r * 11), 1, 1);
      const roadU = same(get, tx, ty - 1, ROADLIKE), roadD = same(get, tx, ty + 1, ROADLIKE);
      const roadL = same(get, tx - 1, ty, ROADLIKE), roadR = same(get, tx + 1, ty, ROADLIKE);
      if (c === '#' || c === 'P') asphalt(p, c, tx, ty, sx, sy, r, r2, get, roadU, roadD, roadL, roadR, smooth);
      if (c === '+' && (get(tx - 1, ty) === '+' || get(tx + 1, ty) === '+') && !(get(tx, ty - 1) === '+' && get(tx, ty + 1) === '+')) {
        // tram tracks running east-west
        p.r('#3e4046', sx, sy + 3, T, 2); p.r('#3e4046', sx, sy + 11, T, 2);
        p.r('#b8bcc4', sx, sy + 3, T, 1); p.r('#b8bcc4', sx, sy + 11, T, 1);
      } else if (c === '+') {
        p.r('#3e4046', sx + 3, sy, 2, T); p.r('#3e4046', sx + 11, sy, 2, T);
        p.r('#b8bcc4', sx + 3, sy, 1, T); p.r('#b8bcc4', sx + 11, sy, 1, T);
      } else if (c === 'x') {
        const vert = get(tx, ty - 1) === 'r' || get(tx, ty + 1) === 'r' || get(tx, ty - 1) === 'x' && get(tx, ty + 1) !== '#';
        p.r('#7d7f86', sx + 1, sy + 1, T - 2, T - 2);
        if (vert) { p.r('#b8bcc4', sx + 4, sy, 1, T); p.r('#b8bcc4', sx + 11, sy, 1, T); p.r('#3e4046', sx + 5, sy, 1, T); p.r('#3e4046', sx + 12, sy, 1, T); }
        else { p.r('#b8bcc4', sx, sy + 4, T, 1); p.r('#b8bcc4', sx, sy + 11, T, 1); p.r('#3e4046', sx, sy + 5, T, 1); p.r('#3e4046', sx, sy + 12, T, 1); }
        return;
      } else if (!smooth) {
        // centre line dashes for two-lane roads
        if ((roadL || roadR) && roadD && !roadU && get(tx, ty + 1) === '#' && tx % 2 === 0) p.r('#e8e4d8', sx + 4, sy + 15, 8, 1);
        if ((roadU || roadD) && roadR && !roadL && get(tx + 1, ty) === '#' && ty % 2 === 0) p.r('#e8e4d8', sx + 15, sy + 4, 1, 8);
      }
      if (c === 'z') {
        const vert = same(get, tx - 1, ty, ROADLIKE) && same(get, tx + 1, ty, ROADLIKE);
        for (let i = 1; i < T; i += 5) vert ? p.r('#ece8dc', sx + 1, sy + i, T - 2, 3) : p.r('#ece8dc', sx + i, sy + 1, 3, T - 2);
      }
      if (c === 'P') { p.r('#ece8dc', sx, sy + 1, 1, T - 2); if (get(tx, ty + 1) !== 'P') p.r('#ece8dc', sx, sy + T - 2, T, 1); }
      if (!smooth && !roadU) p.r('#9a9ca2', sx, sy, T, 1);
      if (!smooth && !roadD) p.r('#46484e', sx, sy + T - 1, T, 1);
      if (!smooth && !roadL) p.r('#9a9ca2', sx, sy, 1, T);
      if (!smooth && !roadR) p.r('#46484e', sx + T - 1, sy, 1, T);
      return;
    }
    case 'r': case 'B': {
      p.r('#8a8478', sx, sy, T, T);
      for (let i = 0; i < 6; i++) p.r(i % 2 ? '#a09a8c' : '#6e695f', sx + Math.floor(hash(tx * 9 + i, ty) * 15), sy + Math.floor(hash(tx, ty * 9 + i) * 15), 1, 1);
      const vert = 'rxB'.includes(get(tx, ty - 1) || '-') || 'rxB'.includes(get(tx, ty + 1) || '-');
      if (vert) {
        for (let y = 1; y < T; y += 4) p.r('#6b4a2e', sx + 1, sy + y, 14, 2);
        p.r('#5d616a', sx + 3, sy, 2, T); p.r('#5d616a', sx + 11, sy, 2, T); p.r('#c9ccd2', sx + 3, sy, 1, T); p.r('#c9ccd2', sx + 11, sy, 1, T);
      } else {
        for (let x = 1; x < T; x += 4) p.r('#6b4a2e', sx + x, sy + 1, 2, 14);
        p.r('#5d616a', sx, sy + 3, T, 2); p.r('#5d616a', sx, sy + 11, T, 2); p.r('#c9ccd2', sx, sy + 3, T, 1); p.r('#c9ccd2', sx, sy + 11, T, 1);
      }
      return;
    }
    case 'f': {
      p.r('#cbc3b3', sx, sy, T, T); p.r('#b3ab9b', sx, sy + 7, T, 1); p.r('#b3ab9b', sx + 7, sy, 1, 7); p.r('#b3ab9b', sx + 11, sy + 8, 1, 8);
      p.r('#b3ab9b', sx, sy + 15, T, 1);
      p.r('#d6cfc0', sx + 1, sy + 1, 5, 1); p.r('#d6cfc0', sx + 8, sy + 9, 2, 1);   // worn shine on the slabs
      if (r > 0.85) p.r('#a39b8b', sx + 2, sy + 10, 2, 1);
      speckle(p, tx, ty, sx, sy, ['#c0b8a8', '#d4ccbc'], 4);
      crack(p, tx, ty, sx, sy, '#9e9686', 0.07);
      if (r2 > 0.9) { p.r('#6a8a3a', sx + 7, sy + 6, 1, 2); p.r('#8aaa4a', sx + 6, sy + 6, 1, 1); p.r('#6a8a3a', sx + 9, sy + 7, 1, 1); } // weeds in the seam
      if (hash(tx * 3, ty * 5 + 1) > 0.93) { p.r('#c8823a', sx + 3, sy + 12, 2, 1); p.r('#a8602a', sx + 12, sy + 3, 1, 2); }   // gum leaves
      if (!smooth) kerbs(p, sx, sy, get, tx, ty);
      return;
    }
    case 'R': { roofTile(p, tx, ty, sx, sy, get); return; }
    case 'Y': { houseRoofTile(p, tx, ty, sx, sy, get); return; }
    case 'c': {
      p.r('#bab7af', sx, sy, T, T); p.r('#a5a29a', sx, sy + 15, T, 1); p.r('#a5a29a', sx + 15, sy, 1, T);
      speckle(p, tx, ty, sx, sy, ['#b0ada5', '#c4c1b9'], 5);
      crack(p, tx, ty, sx, sy, '#8e8b83', 0.06);
      if (hash(tx * 7, ty * 2) > 0.95) { p.r('rgba(40,40,40,0.18)', sx + 3, sy + 4, 7, 5); p.r('rgba(40,40,40,0.12)', sx + 2, sy + 5, 9, 3); }   // stain
      if (r > 0.6) p.r('#9a978f', sx + 3 + Math.floor(r2 * 8), sy + 5, 4, 1);
      if (r2 > 0.92) { p.r('#8a8780', sx + 4, sy + 9, 5, 3); p.r('#7a776f', sx + 5, sy + 10, 3, 1); }
      return;
    }
    case 'p': {
      p.r('#c9c5bb', sx, sy, T, T); p.r('#b5b1a7', sx, sy + 15, T, 1); p.r('#b5b1a7', sx + 15, sy, 1, T);
      const railAt = [[0, -1], [0, 1], [-1, 0], [1, 0]].find(([i, j]) => get(tx + i, ty + j) === 'r');
      if (railAt) {
        const [i, j] = railAt;
        const x = i < 0 ? sx : i > 0 ? sx + 12 : sx, y = j < 0 ? sy : j > 0 ? sy + 12 : sy;
        const w = i ? 4 : T, h = j ? 4 : T;
        p.r('#e8c030', x, y, w, h);
        for (let a = 0; a < (i ? T : T); a += 3) p.r('#c8a020', i ? x + 1 : x + a + 1, i ? y + a + 1 : y + 1, 1, 1);
      }
      return;
    }
    case 'b': {
      p.r('#3a3e48', sx, sy, T, T);
      for (let row = 0; row < 4; row++) for (let col = 0; col < 3; col++) {
        const off = row % 2 ? 3 : 0, x = sx + col * 6 - off, y = sy + row * 4;
        const shade = hash(tx * 3 + col, ty * 4 + row) > 0.5 ? '#4f5462' : '#555a68';
        p.r(shade, Math.max(sx, x + 1), y + 1, Math.min(5, x + 6 - Math.max(sx, x + 1)), 3);
      }
      p.r('#3a3e48', sx + 7, sy, 2, T);
      return;
    }
    case 's': {
      p.r('#e8d6a0', sx, sy, T, T);
      for (let i = 0; i < 4; i++) p.r(i % 2 ? '#d4c088' : '#f4e6b8', sx + Math.floor(hash(tx * 7 + i, ty) * 15), sy + Math.floor(hash(tx, ty * 7 + i) * 15), 1, 1);
      return;
    }
    case 'd': {
      p.r('#7a5232', sx, sy, T, T);
      for (let y = 2; y < T; y += 4) { p.r('#5e3e24', sx, sy + y, T, 1); p.r('#8e6442', sx, sy + y + 1, T, 1); }
      if (!smooth && !same(get, tx, ty - 1, 'd')) p.r('#6b4226', sx, sy, T, 1);
      return;
    }
    case 'g': {
      p.r('#b0a48c', sx, sy, T, T);
      for (let i = 0; i < 7; i++) p.r(i % 2 ? '#9a8e76' : '#c8bca4', sx + Math.floor(hash(tx * 11 + i, ty) * 15), sy + Math.floor(hash(tx, ty * 11 + i) * 15), 1, 1);
      return;
    }
    case 'm': {
      p.r('#8a5a3a', sx, sy, T, T);
      for (let i = 0; i < 8; i++) p.r(i % 2 ? '#a8723c' : '#6b4226', sx + Math.floor(hash(tx * 13 + i, ty) * 14), sy + Math.floor(hash(tx, ty * 13 + i) * 15), 2, 1);
      return;
    }
    case '"': {
      if (!overlayOnly) p.r(g[1], sx, sy, T, T);
      for (let i = 0; i < 9; i++) {
        const x = sx + (i * 5 + Math.floor(r * 4)) % 15, y = sy + 3 + ((i * 7) % 11);
        p.r(g[2], x, y, 1, 4); p.r(g[2], x + 1, y + 1, 1, 3); p.r(g[3], x, y - 1, 1, 1);
      }
      return;
    }
    default: {
      if (!overlayOnly) grassBase(p, tx, ty, sx, sy, g);
      if (c === ',') {
        for (let i = 0; i < 3; i++) {
          const fx = sx + 2 + Math.floor(hash(tx * 3 + i, ty) * 11), fy = sy + 3 + Math.floor(hash(tx, ty * 3 + i) * 10);
          p.r(g[2], fx, fy + 1, 1, 2); p.r(FLOWERS[Math.floor(hash(i, tx + ty) * 5)], fx - 1, fy - 1, 3, 2); p.r('#f0a030', fx, fy - 1, 1, 1);
        }
      }
    }
  }
}

// A 16x16 tuft drawn over feet when standing in tall grass.
// ---- ground detail helpers (deterministic, from hash())
// CITY ROOFTOPS (R): a dense block of flat roofs seen from above. Buildings
// are irregular bands of tiles, each with its own membrane colour, parapet
// seams between them, and AC units, skylights, vents and water tanks on top.
// Where the roofs meet the street below, a sliver of facade with windows.
const ROOF_COLS = ['#8f8f8a', '#a39c8f', '#7b8087', '#9b8b78', '#6d7177', '#b1a998', '#887868', '#94989a'];
const WALL_COLS = ['#c9b79a', '#a8644a', '#d8d0c0', '#8a8e94', '#b98a5a', '#e0d6c2', '#7a5a48', '#9aa4a8'];
function roofBand(ty) { return Math.floor(ty / 4); }
function roofId(tx, ty) {
  const band = roofBand(ty), w = 3 + Math.floor(hash(band, 3) * 5), off = Math.floor(hash(band, 9) * 7);
  return band * 1000 + Math.floor((tx + off) / w);
}
function roofTile(p, tx, ty, sx, sy, get) {
  const id = roofId(tx, ty), rr = hash(id, 17), col = ROOF_COLS[Math.floor(rr * ROOF_COLS.length)];
  const isR = (x, y) => { const c = get(x, y); return c === null || c === 'R'; };
  p.r(col, sx, sy, T, T);
  speckle(p, tx, ty, sx, sy, [shade(col, 0.08), shade(col, -0.08)], 6);
  if (hash(id, 23) > 0.6) for (let y = 3; y < T; y += 5) p.r(shade(col, -0.05), sx, sy + y, T, 1);   // membrane seams
  const sameR = (x, y) => isR(x, y) && (get(x, y) === null || roofId(x, y) === id);
  const up = sameR(tx, ty - 1), down = sameR(tx, ty + 1), left = sameR(tx - 1, ty), right = sameR(tx + 1, ty);
  // Parapets: a light lip and a shadow inside it on every building edge.
  if (!up) { p.r(shade(col, 0.28), sx, sy, T, 2); p.r(shade(col, -0.18), sx, sy + 2, T, 1); }
  if (!left) { p.r(shade(col, 0.22), sx, sy, 2, T); p.r(shade(col, -0.12), sx + 2, sy, 1, T); }
  if (!right) { p.r(shade(col, -0.3), sx + 14, sy, 2, T); }
  const front = !isR(tx, ty + 1);
  if (!down && !front) { p.r(shade(col, -0.32), sx, sy + 14, T, 2); }
  // Rooftop clutter, kept off the edges.
  const q = hash(tx * 7 + 1, ty * 5 + 2), q2 = hash(ty * 3 + 4, tx * 9 + 1);
  if (up && down && left && right && !front) {
    if (q > 0.9) {   // an air-conditioning unit with a fan
      p.r('#3a3c40', sx + 3, sy + 4, 10, 9); p.r('#c4c8cc', sx + 3, sy + 3, 10, 9); p.r('#e2e6ea', sx + 3, sy + 3, 10, 1);
      p.r('#6a6e74', sx + 5, sy + 5, 6, 6); p.r('#9aa0a6', sx + 6, sy + 6, 4, 4); p.r('#4a4e54', sx + 7, sy + 7, 2, 2);
    } else if (q > 0.84) {   // a glass skylight
      p.r('#3a4a5a', sx + 2, sy + 3, 12, 9); p.r('#7aa4c4', sx + 3, sy + 4, 10, 7); p.r('#b4d4ea', sx + 3, sy + 4, 4, 2); p.r('#3a4a5a', sx + 8, sy + 4, 1, 7);
    } else if (q > 0.8) {   // a round water tank
      p.r('#5a5e62', sx + 3, sy + 12, 10, 2); p.r('#b8bcc0', sx + 3, sy + 3, 10, 10); p.r('#d4d8dc', sx + 4, sy + 3, 8, 2); p.r('#8a8e92', sx + 12, sy + 4, 1, 8);
    } else if (q > 0.76) {   // vents
      p.r('#5a5c60', sx + 4, sy + 6, 3, 4); p.r('#9a9ca0', sx + 4, sy + 5, 3, 2); p.r('#5a5c60', sx + 10, sy + 9, 3, 4); p.r('#9a9ca0', sx + 10, sy + 8, 3, 2);
    } else if (q > 0.72 && hash(id, 41) > 0.5) {   // solar panels
      for (let i = 0; i < 2; i++) { p.r('#1e2a44', sx + 2, sy + 2 + i * 7, 12, 5); p.r('#34508a', sx + 3, sy + 3 + i * 7, 10, 3); p.r('#5a7ab4', sx + 3, sy + 3 + i * 7, 10, 1); }
    }
    if (q2 > 0.93) { p.r(shade(col, -0.25), sx + 6, sy + 7, 2, 2); }   // a drain
  }
  // The street face of the building: a strip of wall with windows.
  if (front) {
    const wall = WALL_COLS[Math.floor(hash(id, 29) * WALL_COLS.length)];
    p.r(shade(col, 0.25), sx, sy + 7, T, 1);
    p.r(wall, sx, sy + 8, T, 8); p.r(shade(wall, 0.15), sx, sy + 8, T, 1); p.r(shade(wall, -0.25), sx, sy + 15, T, 1);
    const glass = hash(id, 31) > 0.5 ? '#4a6278' : '#5a7a94';
    for (let x = 2; x < 14; x += 6) { p.r(shade(wall, -0.35), sx + x, sy + 10, 4, 4); p.r(glass, sx + x + 1, sy + 11, 2, 3); p.r(shade(glass, 0.4), sx + x + 1, sy + 11, 1, 1); }
    if (!right) p.r(shade(wall, -0.3), sx + 15, sy + 8, 1, 8);
    if (!left) p.r(shade(wall, 0.2), sx, sy + 8, 1, 8);
  }
}

// HOUSE ROOFS (Y): terrace roofs packed side by side, three tiles a house.
// Corrugated iron, terracotta and slate, with a ridge, brick party walls
// poking up between houses, chimneys, and a gutter on the street side.
const HOUSE_ROOFS = [['#a8b0b4', 'iron'], ['#b8543a', 'tile'], ['#5a6068', 'slate'], ['#c0c4c0', 'iron'], ['#a04a34', 'tile'], ['#8a5a44', 'tile'], ['#6a8a8a', 'iron']];
function houseId(tx, ty) {
  const band = Math.floor(ty / 3), off = Math.floor(hash(band, 5) * 3);
  return band * 1000 + Math.floor((tx + off) / 3);
}
function houseRoofTile(p, tx, ty, sx, sy, get) {
  const id = houseId(tx, ty), [col, kind] = HOUSE_ROOFS[Math.floor(hash(id, 13) * HOUSE_ROOFS.length)];
  const isY = (x, y) => { const c = get(x, y); return c === null || c === 'Y'; };
  const row = ty % 3;   // 0: back slope, 1: ridge and front slope, 2: front slope and gutter
  const base = row === 0 ? shade(col, -0.22) : col;
  p.r(base, sx, sy, T, T);
  if (kind === 'iron') for (let x = 1; x < T; x += 3) { p.r(shade(base, 0.18), sx + x, sy, 1, T); p.r(shade(base, -0.12), sx + x + 1, sy, 1, T); }
  else if (kind === 'tile') for (let y = 2; y < T; y += 4) { p.r(shade(base, -0.2), sx, sy + y, T, 1); for (let x = (y % 8 ? 0 : 2); x < T; x += 4) p.r(shade(base, 0.12), sx + x, sy + y - 2, 2, 1); }
  else for (let y = 3; y < T; y += 4) { p.r(shade(base, 0.12), sx, sy + y, T, 1); for (let x = (y % 8 === 3 ? 1 : 4); x < T; x += 6) p.r(shade(base, -0.18), sx + x, sy + y - 3, 1, 3); }
  if (row === 1) { p.r(shade(col, -0.35), sx, sy, T, 1); p.r(shade(col, 0.3), sx, sy + 1, T, 2); }   // the ridge
  if (row === 2) { p.r('#7a7e80', sx, sy + 14, T, 2); p.r('#b8bcbe', sx, sy + 14, T, 1); }   // gutter
  if (row === 0 && !isY(tx, ty - 1)) p.r(shade(col, -0.4), sx, sy, T, 1);
  // Party walls between houses: a brick firewall on the left edge of each house.
  if (houseId(tx - 1, ty) !== id && isY(tx - 1, ty)) {
    p.r('#8a4a34', sx, sy, 3, T); p.r('#b06a4a', sx, sy, 1, T); p.r('#5a2e20', sx + 2, sy, 1, T);
    for (let y = 2; y < T; y += 4) p.r('#6e3a28', sx, sy + y, 3, 1);
  }
  // A chimney on some houses, on the back slope.
  if (row === 0 && hash(id, 19) > 0.55 && houseId(tx + 1, ty) !== id) {
    p.r('#3a2a22', sx + 7, sy + 6, 6, 9); p.r('#a85a40', sx + 7, sy + 4, 6, 9); p.r('#c87a5a', sx + 7, sy + 4, 6, 1);
    p.r('#5a5a5a', sx + 8, sy + 2, 2, 3); p.r('#5a5a5a', sx + 11, sy + 2, 1, 3);
  }
  if (!isY(tx + 1, ty)) p.r(shade(col, -0.4), sx + 15, sy, 1, T);
  if (!isY(tx - 1, ty)) p.r(shade(col, 0.3), sx, sy, 1, T);
}

function speckle(p, tx, ty, sx, sy, cols, n) {
  for (let i = 0; i < n; i++) {
    const q = hash(tx * 13 + i, ty * 7 - i), q2 = hash(ty * 11 + i, tx * 5 + i);
    p.r(cols[i % cols.length], sx + Math.floor(q * 15), sy + Math.floor(q2 * 15), 1, 1);
  }
}
function crack(p, tx, ty, sx, sy, col, chance) {
  if (hash(tx * 17 + 3, ty * 13 + 5) > chance) return;
  let x = sx + 2 + Math.floor(hash(tx, ty * 3) * 6), y = sy + 3;
  for (let i = 0; i < 9; i++) { p.r(col, x, y, 1, 1); x += hash(tx + i, ty) > 0.5 ? 1 : 0; y += 1; if (y > sy + 14 || x > sx + 14) break; }
}
// A raised kerb where a footpath meets a road: light lip, dark shadow onto the road side.
function kerbs(p, sx, sy, get, tx, ty) {
  const road = c => c && '#+P'.includes(c);
  if (road(get(tx, ty + 1))) { p.r('#e2dccf', sx, sy + 13, T, 1); p.r('#9c9686', sx, sy + 14, T, 2); }
  if (road(get(tx, ty - 1))) { p.r('#8e887a', sx, sy, T, 1); p.r('#e2dccf', sx, sy + 1, T, 1); }
  if (road(get(tx + 1, ty))) { p.r('#e2dccf', sx + 13, sy, 1, T); p.r('#9c9686', sx + 14, sy, 2, T); }
  if (road(get(tx - 1, ty))) { p.r('#8e887a', sx, sy, 1, T); p.r('#e2dccf', sx + 1, sy, 1, T); }
}
// Asphalt: grain, tyre wear, patches, oil, manholes and gutter drains.
function asphalt(p, c, tx, ty, sx, sy, r, r2, get, U, D, L, R, smooth = false) {
  speckle(p, tx, ty, sx, sy, ['#686a71', '#54565d', '#62646b'], 7);
  const horiz = L && R && !(U && D && !L);
  if (c === '#') {
    // tyre wear: darker bands where wheels run
    if (!smooth && horiz && U && D) { p.r('rgba(35,35,42,0.16)', sx, sy + 3, T, 3); p.r('rgba(35,35,42,0.16)', sx, sy + 10, T, 3); }
    else if (!smooth && U && D && !L !== !R) { p.r('rgba(35,35,42,0.16)', sx + 3, sy, 3, T); p.r('rgba(35,35,42,0.16)', sx + 10, sy, 3, T); }
    if (r > 0.86 && r < 0.9) { p.r('#53555c', sx + 2, sy + 3, 10, 7); p.r('#4c4e55', sx + 2, sy + 3, 10, 1); }   // patch
    if (r2 > 0.965 && U && D && L && R) {   // manhole
      p.blob(sx + 8, sy + 8, 4, '#4a4c52'); p.blob(sx + 8, sy + 8, 3, '#5a5c62');
      for (let i = -2; i <= 2; i += 2) p.r('#44464c', sx + 6, sy + 8 + i, 5, 1);
    }
    // gutter drain where the road meets a footpath
    const fp = ch => ch === 'f' || ch === 'c';
    if (fp(get(tx, ty - 1)) && tx % 7 === 3) { p.r('#2a2c30', sx + 4, sy + 1, 8, 3); for (let i = 5; i < 12; i += 2) p.r('#6a6c72', sx + i, sy + 1, 1, 3); }
    if (fp(get(tx, ty + 1)) && tx % 7 === 5) { p.r('#2a2c30', sx + 4, sy + 12, 8, 3); for (let i = 5; i < 12; i += 2) p.r('#6a6c72', sx + i, sy + 12, 1, 3); }
  }
  if (r > 0.93) { p.r('rgba(25,25,32,0.3)', sx + 4, sy + 5, 6, 4); p.r('rgba(25,25,32,0.2)', sx + 3, sy + 6, 8, 2); p.r('rgba(120,90,160,0.18)', sx + 5, sy + 6, 2, 1); }   // oil
  if (r2 < 0.05) crack(p, tx, ty, sx, sy, '#45474d', 1);
}

export function paintTuft(p, g) {
  for (let i = 0; i < 7; i++) {
    const x = 1 + i * 2;
    p.r(g[2], x, 9 + (i % 2), 1, 7); p.r(g[1], x + 1, 10, 1, 6); p.r(g[3], x, 8 + (i % 2), 1, 1);
  }
}
