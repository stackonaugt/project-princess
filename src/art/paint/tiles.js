// Paints a whole region's ground onto one canvas. Tiles look at their
// neighbours to draw edges (kerbs, shorelines, path borders).
//
// Ground letters (used in src/world/maps/*.js):
//   .  grass        ,  flowers      "  tall grass    =  dirt path
//   #  road         +  tram tracks  x  level crossing r  railway
//   f  footpath     c  concrete     p  platform       b  bluestone lane
//   ~  water        w  bridge       s  sand           d  tilled soil
//   g  gravel       m  mulch
import { hash } from '../../util.js';

export const TILE_NAMES = {
  '.': 'grass', ',': 'flowers', '"': 'tallgrass', '=': 'path', '#': 'road', '+': 'tram', 'x': 'crossing',
  'r': 'rail', 'f': 'footpath', 'c': 'concrete', 'p': 'platform', 'b': 'bluestone', '~': 'water',
  'w': 'bridge', 's': 'sand', 'd': 'soil', 'g': 'gravel', 'm': 'mulch',
};

const FLOWERS = ['#f5e66b', '#f28bb0', '#ffffff', '#b79cf0', '#f29a5b'];
const ROADLIKE = '#+x';
const T = 16;

export function paintGround(p, map, grass, custom = {}) {
  const get = (x, y) => (x < 0 || y < 0 || x >= map.w || y >= map.h) ? null : map.ground[y][x];
  for (let ty = 0; ty < map.h; ty++) for (let tx = 0; tx < map.w; tx++) {
    const c = map.ground[ty][tx];
    const img = custom[TILE_NAMES[c]];
    if (img) { p.ctx.drawImage(img, 0, 0, img.width, img.height, tx * T, ty * T, T, T); continue; }
    // A custom grass tile also goes under flowers and tall grass.
    const under = (c === ',' || c === '"') && custom.grass;
    if (under) p.ctx.drawImage(under, 0, 0, under.width, under.height, tx * T, ty * T, T, T);
    paintTile(p, c, tx, ty, tx * T, ty * T, get, grass, !!under);
  }
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

function paintTile(p, c, tx, ty, sx, sy, get, g, overlayOnly = false) {
  const r = hash(tx, ty), r2 = hash(ty + 7, tx + 3);
  switch (c) {
    case '~': case 'w': {
      p.r('#4a90cf', sx, sy, T, T);
      const W = '~w';
      if (!same(get, tx, ty - 1, W)) { p.r('#2f6aa3', sx, sy, T, 3); p.r(g[2], sx, sy, T, 1); }
      if (!same(get, tx - 1, ty, W)) p.r('#3c7bb8', sx, sy, 2, T);
      if (!same(get, tx + 1, ty, W)) p.r('#3c7bb8', sx + T - 2, sy, 2, T);
      if (!same(get, tx, ty + 1, W)) p.r('#a8d8f2', sx, sy + T - 2, T, 2);
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
      if (!same(get, tx, ty - 1, P)) p.r('#c29a64', sx, sy, T, 1);
      if (!same(get, tx, ty + 1, P)) p.r('#b98f5c', sx, sy + T - 1, T, 1);
      if (!same(get, tx - 1, ty, P)) p.r('#c29a64', sx, sy, 1, T);
      if (!same(get, tx + 1, ty, P)) p.r('#c29a64', sx + T - 1, sy, 1, T);
      p.r('#bf955d', sx + Math.floor(r * 13), sy + Math.floor(r2 * 13), 2, 1);
      p.r('#e3c290', sx + Math.floor(r2 * 12), sy + Math.floor(r * 12), 2, 1);
      return;
    }
    case '#': case '+': case 'x': {
      p.r('#5d5f66', sx, sy, T, T);
      p.r('#6b6d74', sx + Math.floor(r * 13), sy + Math.floor(r2 * 13), 2, 1);
      p.r('#53555c', sx + Math.floor(r2 * 13), sy + Math.floor(r * 11), 1, 1);
      const roadU = same(get, tx, ty - 1, ROADLIKE), roadD = same(get, tx, ty + 1, ROADLIKE);
      const roadL = same(get, tx - 1, ty, ROADLIKE), roadR = same(get, tx + 1, ty, ROADLIKE);
      if (c === '+') {
        p.r('#3e4046', sx + 3, sy, 2, T); p.r('#3e4046', sx + 11, sy, 2, T);
        p.r('#b8bcc4', sx + 3, sy, 1, T); p.r('#b8bcc4', sx + 11, sy, 1, T);
      } else if (c === 'x') {
        const vert = get(tx, ty - 1) === 'r' || get(tx, ty + 1) === 'r' || get(tx, ty - 1) === 'x' && get(tx, ty + 1) !== '#';
        p.r('#7d7f86', sx + 1, sy + 1, T - 2, T - 2);
        if (vert) { p.r('#b8bcc4', sx + 4, sy, 1, T); p.r('#b8bcc4', sx + 11, sy, 1, T); p.r('#3e4046', sx + 5, sy, 1, T); p.r('#3e4046', sx + 12, sy, 1, T); }
        else { p.r('#b8bcc4', sx, sy + 4, T, 1); p.r('#b8bcc4', sx, sy + 11, T, 1); p.r('#3e4046', sx, sy + 5, T, 1); p.r('#3e4046', sx, sy + 12, T, 1); }
        return;
      } else {
        // centre line dashes for two-lane roads
        if ((roadL || roadR) && roadD && !roadU && get(tx, ty + 1) === '#' && tx % 2 === 0) p.r('#e8e4d8', sx + 4, sy + 15, 8, 1);
        if ((roadU || roadD) && roadR && !roadL && get(tx + 1, ty) === '#' && ty % 2 === 0) p.r('#e8e4d8', sx + 15, sy + 4, 1, 8);
      }
      if (!roadU) p.r('#9a9ca2', sx, sy, T, 1);
      if (!roadD) p.r('#46484e', sx, sy + T - 1, T, 1);
      if (!roadL) p.r('#9a9ca2', sx, sy, 1, T);
      if (!roadR) p.r('#46484e', sx + T - 1, sy, 1, T);
      return;
    }
    case 'r': {
      p.r('#8a8478', sx, sy, T, T);
      for (let i = 0; i < 6; i++) p.r(i % 2 ? '#a09a8c' : '#6e695f', sx + Math.floor(hash(tx * 9 + i, ty) * 15), sy + Math.floor(hash(tx, ty * 9 + i) * 15), 1, 1);
      const vert = 'rx'.includes(get(tx, ty - 1)) || 'rx'.includes(get(tx, ty + 1));
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
      if (r > 0.85) p.r('#a39b8b', sx + 2, sy + 10, 2, 1);
      return;
    }
    case 'c': {
      p.r('#bab7af', sx, sy, T, T); p.r('#a5a29a', sx, sy + 15, T, 1); p.r('#a5a29a', sx + 15, sy, 1, T);
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
      if (!same(get, tx, ty - 1, 'd')) p.r('#6b4226', sx, sy, T, 1);
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
export function paintTuft(p, g) {
  for (let i = 0; i < 7; i++) {
    const x = 1 + i * 2;
    p.r(g[2], x, 9 + (i % 2), 1, 7); p.r(g[1], x + 1, 10, 1, 6); p.r(g[3], x, 8 + (i % 2), 1, 1);
  }
}
