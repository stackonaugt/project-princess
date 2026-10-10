// Export replaceable defaults without changing any active user PNGs.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { PETS } from '../game/src/data/pets.js';
import { PET_FRAMES, BASE_PALETTE } from '../game/src/art/sprites.js';
import { SHOW_NPCS } from '../game/src/data/dog-show.js';
import { BAKE_NPCS } from '../game/src/data/bake-event.js';
const root = new URL('../game/assets/sprites/templates/', import.meta.url);
await mkdir(new URL('pets/', root), { recursive: true });
await mkdir(new URL('npcs/', root), { recursive: true });
for (const id of ['princess', 'spooky']) {
  const pet = PETS.find(p => p.id === id), evolution = pet.evolution;
  const frames = PET_FRAMES[evolution.sprite], palette = { ...BASE_PALETTE, ...pet.pal, ...evolution.pal };
  const width = 16 * frames.length, data = Buffer.alloc(width * 16 * 4);
  const pixel = (x, y, colour) => {
    const n = parseInt(colour.slice(1), 16), i = (y * width + x) * 4;
    data[i] = n >> 16 & 255; data[i + 1] = n >> 8 & 255; data[i + 2] = n & 255; data[i + 3] = 255;
  };
  frames.forEach((frame, index) => {
    for (let y = 0; y < frame.length; y++) for (let x = 0; x < frame[y].length; x++) {
      const colour = palette[frame[y][x]]; if (colour && frame[y][x] !== '.') pixel(index * 16 + x, y, colour);
    }
    if (id === 'princess') {
      const rect = (x, y, w, h, colour) => { for (let a = x; a < x + w; a++) for (let b = y; b < y + h; b++) pixel(index * 16 + a, b, colour); };
      rect(9, 3, 6, 1, '#a66c25'); rect(9, 1, 1, 3, '#edc35b'); rect(11, 0, 2, 4, '#edc35b');
      rect(14, 1, 1, 3, '#edc35b'); rect(11, 2, 2, 1, '#a079b8');
    }
  });
  await sharp(data, { raw: { width, height: 16, channels: 4 } }).png().toFile(new URL(`pets/${id}-evolved.png`, root).pathname);
}
for (const [id, npc] of Object.entries({ ...SHOW_NPCS, ...BAKE_NPCS })) {
  const look = npc.look;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="32"><rect x="5" y="21" width="3" height="9" fill="${look.pants}"/><rect x="9" y="21" width="3" height="9" fill="${look.pants}"/><rect x="4" y="12" width="9" height="11" fill="${look.shirt}"/><rect x="3" y="14" width="2" height="8" fill="${look.skin}"/><rect x="13" y="14" width="2" height="8" fill="${look.skin}"/><rect x="5" y="4" width="8" height="9" fill="${look.skin}"/><rect x="4" y="2" width="10" height="4" fill="${look.hair}"/><rect x="4" y="5" width="2" height="5" fill="${look.hair}"/><rect x="8" y="7" width="1" height="1" fill="#302b2b"/><rect x="11" y="7" width="1" height="1" fill="#302b2b"/></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(new URL(`npcs/${id}.png`, root).pathname);
}
const background = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="320"><rect width="512" height="320" fill="#e2d7bc"/><rect width="512" height="24" fill="#6d7772"/><g fill="#f1e5c5"><rect x="45" y="24" width="22" height="110"/><rect x="172" y="24" width="22" height="110"/><rect x="299" y="24" width="22" height="110"/><rect x="426" y="24" width="22" height="110"/></g><rect y="110" width="512" height="24" fill="#947d62"/><rect y="134" width="512" height="186" fill="#c9b28d"/><rect x="26" y="150" width="460" height="170" fill="#658f77" stroke="#e4d3a0" stroke-width="4"/><g fill="#c28d68">${Array.from({ length: 10 }, (_, i) => `<circle cx="${26 + i * 51}" cy="96" r="9"/>`).join('')}</g><g fill="#607a8b">${Array.from({ length: 10 }, (_, i) => `<rect x="${17 + i * 51}" y="105" width="18" height="12"/>`).join('')}</g><g fill="#c15d4f">${Array.from({ length: 10 }, (_, i) => `<path d="M${17 + i * 51},35h18l-9,20Z"/>`).join('')}</g></svg>`;
const backgroundDir = new URL('../game/assets/sprites/backgrounds/templates/', import.meta.url);
await mkdir(backgroundDir, { recursive: true });
await sharp(Buffer.from(background)).png().toFile(new URL('exhibition.png', backgroundDir).pathname);
console.log('Competition templates exported; active artwork was not changed.');
