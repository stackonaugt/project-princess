// Small effect textures: speech bubbles, hearts, glows, rain, ducks and vehicles.
export const FX = {
  // Speech bubbles shown over things you can interact with.
  'fx-bubble-talk': [12, 13, p => bubble(p, b => { b.r('#c0473a', 5, 2, 2, 4); b.r('#c0473a', 5, 7, 2, 1); })],
  'fx-bubble-heart': [12, 13, p => bubble(p, b => heart(b, 3, 3))],
  'fx-bubble-read': [12, 13, p => bubble(p, b => { b.r('#7b4a24', 3, 2, 6, 1); b.r('#7b4a24', 3, 4, 6, 1); b.r('#7b4a24', 3, 6, 4, 1); })],
  'fx-bubble-zzz': [12, 13, p => bubble(p, b => { b.r('#5b4a8c', 3, 2, 4, 1); b.r('#5b4a8c', 5, 3, 1, 1); b.r('#5b4a8c', 4, 4, 1, 1); b.r('#5b4a8c', 3, 5, 4, 1); b.r('#5b4a8c', 7, 6, 2, 1); b.r('#5b4a8c', 7, 7, 2, 1); })],
  'fx-bubble-alert': [12, 13, p => bubble(p, b => { b.r('#e8a030', 5, 2, 2, 4); b.r('#e8a030', 5, 7, 2, 1); })],
  'fx-bubble-gift': [12, 13, p => bubble(p, b => { b.r('#3fa38f', 3, 3, 6, 5); b.r('#f5d63a', 5, 3, 2, 5); b.r('#f5d63a', 3, 2, 2, 1); b.r('#f5d63a', 7, 2, 2, 1); })],
  'fx-bubble-dots': [12, 13, p => bubble(p, b => { b.r('#7b4a24', 2, 5, 2, 2); b.r('#7b4a24', 5, 5, 2, 2); b.r('#7b4a24', 8, 5, 2, 2); })],
  'fx-heart': [5, 4, p => heart(p, 0, 0)],
  'fx-glow': [64, 64, p => {
    const g = p.ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,226,150,0.9)'); g.addColorStop(0.4, 'rgba(255,200,110,0.35)'); g.addColorStop(1, 'rgba(255,190,90,0)');
    p.ctx.fillStyle = g; p.ctx.fillRect(0, 0, 64, 64);
  }],
  'fx-rain': [1, 5, p => p.r('#c8e0f0', 0, 0, 1, 5)],
  'fx-splash': [3, 2, p => { p.r('#c8e0f0', 0, 1, 1, 1); p.r('#c8e0f0', 2, 1, 1, 1); p.r('#c8e0f0', 1, 0, 1, 1); }],
  'fx-sparkle': [3, 1, p => p.r('#c9e8fa', 0, 0, 3, 1)],
  'fx-dust': [2, 2, p => p.r('#e8dcc2', 0, 0, 2, 2)],
  'fx-leaf': [2, 2, p => { p.r('#8a9a42', 0, 0, 2, 1); p.r('#6a7a32', 0, 1, 1, 1); }],
  'fx-shadow': [10, 4, p => { p.r('rgba(30,50,20,.25)', 1, 0, 8, 4); p.r('rgba(30,50,20,.25)', 0, 1, 10, 2); }],
  // Collision tileset: tile 0 empty, tile 1 solid. Never visible.
  'tex-collide': [32, 16, p => p.r('#ff00ff', 16, 0, 16, 16)],
};

// Animated decorations as strips of frames: [frameW, frameH, frames, paint(p, frameIndex)]
export const FX_STRIPS = {
  duck: [10, 8, 2, (p, f) => {
    p.r('#f4efe0', 1, 3, 7, 4); p.r('#dcd4c4', 1, 6, 7, 1); p.r('#3a6a3a', 6, 0, 3, 3); p.r('#e8a030', 9, 1, 1, 1);
    p.r('#c9e8fa', f ? 0 : 2, 7, 3, 1);
  }],
  magpie: [10, 9, 2, (p, f) => {
    p.r('#1e1e24', 2, 2, 6, 4); p.r('#f4f4f0', 3, 3, 3, 2); p.r('#1e1e24', 7, 0, 3, 3); p.r('#b8bcc4', 9, 1, 1, 1);
    p.r('#1e1e24', 0, 3, 2, 2); p.r('#3a3a3a', 4, 6, 1, f ? 3 : 2); p.r('#3a3a3a', 6, 6, 1, f ? 2 : 3);
  }],
};

// Vehicles that drive past. Horizontal ones face right, vertical ones face down.
export const VEHICLES = {
  'veh-tram': [20, 76, p => {
    p.r('#2a2e33', 1, 0, 18, 76); p.r('#e8e4d8', 2, 1, 16, 74); p.r('#3a8a5a', 2, 14, 16, 48);
    p.r('#5aa878', 2, 14, 16, 2); p.r('#b8bcc4', 5, 4, 10, 6); p.r('#b8bcc4', 5, 66, 10, 6);
    for (let y = 18; y < 60; y += 10) p.r('#a8d4e8', 3, y, 2, 6), p.r('#a8d4e8', 15, y, 2, 6);
    p.r('#f5e66b', 4, 74, 3, 2); p.r('#f5e66b', 13, 74, 3, 2); p.r('#3c4148', 9, 36, 2, 6);
  }],
  // Metro trains: stainless steel, blue livery, yellow ends
  'veh-train-h': [184, 24, p => metroTrain(p, false)],
  'veh-train-v': [24, 184, p => metroTrain(p, true)],
  'veh-tram-h': [76, 20, p => { p.ctx.save(); p.ctx.translate(0, 20); p.ctx.rotate(-Math.PI / 2); VEHICLES['veh-tram'][2](p); p.ctx.restore(); }],
  'veh-car-h-red': [28, 16, p => carH(p, '#c8443a', '#9a3028')],
  'veh-car-h-blue': [28, 16, p => carH(p, '#3a6aa8', '#2a5080')],
  'veh-car-h-white': [28, 16, p => carH(p, '#f0f0ec', '#c9c9c4')],
  'veh-ute-h': [30, 16, p => { carH(p, '#e8e4d8', '#b8b4a8'); p.r('#5d616a', 2, 4, 10, 7); p.r('#c8823a', 3, 5, 4, 3); }],
  'veh-car-v-yellow': [16, 28, p => carV(p, '#e8c030', '#b8961e')],
  'veh-car-v-silver': [16, 28, p => carV(p, '#b8bcc4', '#8e939b')],
  'veh-bike-v': [8, 14, p => { p.r('#1e1e1e', 3, 0, 2, 4); p.r('#1e1e1e', 3, 10, 2, 4); p.r('#c8443a', 3, 4, 2, 6); p.r('#f2c79a', 2, 5, 4, 3); p.r('#2a5a8a', 2, 4, 4, 2); }],
};

function metroTrain(p, vertical) {
  // draw horizontally into a scratch canvas, then rotate for the vertical version
  const draw = q => {
    for (let c = 0; c < 3; c++) {
      const x = 2 + c * 60;
      q.r('#2a2e33', x, 2, 58, 20); q.r('#c4c8ce', x + 1, 3, 56, 18);
      for (let i = x + 3; i < x + 56; i += 3) q.r('#b0b4ba', i, 3, 1, 18);
      q.r('#2a6ac8', x + 1, 9, 56, 7); q.r('#5aa0e8', x + 8 + c * 6, 9, 14, 7); q.r('#1e4a9a', x + 30, 13, 20, 3);
      for (let i = 0; i < 4; i++) q.r('#2a3440', x + 6 + i * 13, 4, 8, 4);
      q.r('#8a8e96', x + 1, 20, 56, 1);
    }
    for (const x of [0, 176]) { q.r('#f0c020', x, 3, 8, 18); q.r('#2a6ac8', x + 2, 9, 4, 6); q.r('#2a3440', x + 1, 5, 6, 3); }
    q.r('#f5f0a0', 182, 17, 2, 2); q.r('#f5f0a0', 0, 17, 2, 2);
  };
  if (!vertical) return draw(p);
  const c = document.createElement('canvas'); c.width = 184; c.height = 24;
  draw({ r(col, x, y, w, h) { const g = c.getContext('2d'); g.fillStyle = col; g.fillRect(x, y, w, h); } });
  p.ctx.save(); p.ctx.translate(24, 0); p.ctx.rotate(Math.PI / 2); p.ctx.drawImage(c, 0, 0); p.ctx.restore();
}

function carH(p, a, b) {
  p.r('rgba(0,0,0,.25)', 1, 13, 27, 3);
  p.r('#1e1e1e', 4, 12, 5, 3); p.r('#1e1e1e', 19, 12, 5, 3);
  p.r(a, 1, 5, 26, 8); p.r(b, 1, 11, 26, 2); p.r(a, 7, 1, 14, 6); p.r('#7fb4d2', 8, 2, 5, 4); p.r('#7fb4d2', 15, 2, 5, 4);
  p.r('#f5e66b', 26, 7, 2, 2); p.r('#d83c3c', 0, 7, 1, 2);
}
function carV(p, a, b) {
  p.r('rgba(0,0,0,.25)', 2, 3, 14, 25);
  p.r(a, 1, 1, 14, 26); p.r(b, 1, 1, 1, 26); p.r(b, 14, 1, 1, 26);
  p.r('#7fb4d2', 3, 17, 10, 5); p.r('#7fb4d2', 3, 6, 10, 3); p.r(b, 3, 10, 10, 6);
  p.r('#f5e66b', 2, 26, 3, 1); p.r('#f5e66b', 11, 26, 3, 1);
}

function bubble(p, inner) {
  p.r('#3a2412', 0, 0, 12, 10); p.r('#fff6e0', 1, 1, 10, 8); p.r('#3a2412', 4, 10, 4, 1); p.r('#fff6e0', 5, 9, 2, 2); p.r('#3a2412', 5, 11, 2, 1);
  inner(p);
}
function heart(p, x, y) {
  const c = '#e2506a';
  p.r(c, x, y, 2, 1); p.r(c, x + 3, y, 2, 1); p.r(c, x, y + 1, 5, 1); p.r(c, x + 1, y + 2, 3, 1); p.r(c, x + 2, y + 3, 1, 1);
}

