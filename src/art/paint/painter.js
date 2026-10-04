// Drawing helpers for the procedural (built-in) art. Everything is plain
// rectangles on a 2D canvas so it stays crisp pixel art.

export function painter(ctx) {
  ctx.imageSmoothingEnabled = false;
  const p = {
    ctx,
    r(c, x, y, w, h) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); },
    px(c, x, y) { p.r(c, x, y, 1, 1); },
    // Filled pixel circle.
    blob(cx, cy, r, c) {
      ctx.fillStyle = c;
      for (let dy = -r; dy <= r; dy++) {
        const w = Math.round(Math.sqrt(r * r - dy * dy));
        ctx.fillRect(Math.round(cx - w), Math.round(cy + dy), w * 2, 1);
      }
    },
    // Soft ground shadow under an object.
    shadow(cx, cy, w, a = 0.22) {
      ctx.fillStyle = `rgba(30,50,20,${a})`;
      ctx.fillRect(Math.round(cx - w / 2), cy - 2, w, 3);
      ctx.fillRect(Math.round(cx - w / 2) + 2, cy - 3, w - 4, 5);
    },
    // Draw a string sprite (see sprites.js) at x,y.
    sprite(rows, pal, x = 0, y = 0, silhouette = null) {
      rows.forEach((row, j) => {
        for (let i = 0; i < row.length; i++) {
          const ch = row[i];
          if (ch === '.') continue;
          ctx.fillStyle = silhouette || pal[ch] || '#ff00ff';
          ctx.fillRect(x + i, y + j, 1, 1);
        }
      });
    },
    // Tiny 3x5 pixel font for shop signs.
    text(str, x, y, c) {
      ctx.fillStyle = c;
      let cx = x;
      for (const ch of str.toUpperCase()) {
        const g = GLYPHS[ch];
        if (g) for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) if (g[j * 3 + i] === '1') ctx.fillRect(cx + i, y + j, 1, 1);
        cx += ch === ' ' ? 2 : 4;
      }
      return cx - x;
    },
  };
  return p;
}

export function textWidth(str) {
  let w = 0;
  for (const ch of str) w += ch === ' ' ? 2 : 4;
  return w - 1;
}

const GLYPHS = {
  A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110',
  E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101',
  I: '111010010010111', K: '101101110101101', L: '100100100100111', M: '101111111101101',
  N: '110101101101101', O: '010101101101010', P: '110101110100100', R: '110101110101101',
  S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010',
  W: '101101111111101', Y: '101101010010010', J: '001001001101010', Z: '111001010100111',
  '!': '010010010000010', '.': '000000000000010', '&': '010101010101011', '1': '010110010010111',
  '9': '111101111001001', '0': '111101101101111', '2': '110001010100111',
};
