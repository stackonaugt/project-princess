// Crops growing in plots, drawn per stage: 0 just planted, 1 sprout,
// 2 growing, 3 ready to pick. Texture keys: crop-<id>-<stage>.
// Custom art: assets/sprites/objects/crop-<id>-<stage>.png is not wired yet;
// these are tiny, so built-in only for now.
import { shade } from './painter.js';
import { CROPS } from '../../data/crops.js';

const leafCol = '#3f8a3e', leafHi = '#6dbb58', leafDk = '#2a5e2e';

export function paintCrop(p, id, stage) {
  const c = CROPS[id].colour;
  if (stage === 0) { p.r('#5a3a22', 5, 10, 6, 3); p.r('#7a5236', 6, 10, 4, 1); p.r('#e8dcc0', 7, 9, 2, 1); return; }
  if (stage === 1) { p.r(leafDk, 7, 9, 1, 4); p.r(leafHi, 5, 8, 2, 2); p.r(leafCol, 8, 7, 3, 2); p.r(leafHi, 8, 7, 1, 1); return; }
  // stage 2 and 3: a leafy plant, shape by crop
  const tall = ['tomato', 'chilli', 'basil'].includes(id), vine = ['pumpkin', 'zucchini', 'strawberry'].includes(id);
  if (tall) {
    p.r('#8a6a4a', 7, 3, 1, 12);   // stake
    for (const [x, y] of [[5, 5], [9, 4], [4, 8], [9, 8], [6, 11]]) { p.r(leafCol, x, y, 3, 2); p.r(leafHi, x, y, 1, 1); }
  } else if (vine) {
    p.blob(8, 10, 5, leafDk); p.blob(7, 9, 4, leafCol); p.r(leafHi, 5, 7, 2, 1); p.r(leafHi, 10, 8, 2, 1);
  } else {   // roots: carrot and potato, just the leafy tops
    for (let i = 0; i < 5; i++) { p.r(leafCol, 5 + i * 1.5, 6 + (i % 2), 1, 7); p.r(leafHi, 5 + i * 1.5, 6 + (i % 2), 1, 1); }
  }
  if (stage < 3) return;
  // ready: show the produce
  const dot = (x, y, w = 2, h = 2) => { p.r(c, x, y, w, h); p.r(shade(c, 0.35), x, y, 1, 1); };
  if (id === 'pumpkin') { p.blob(8, 11, 4, c); p.r(shade(c, -0.2), 8, 8, 1, 7); p.r(shade(c, 0.3), 6, 9, 2, 1); p.r('#6a4a2a', 8, 6, 1, 2); }
  else if (id === 'zucchini') { p.r(c, 4, 11, 7, 2); p.r(shade(c, 0.3), 4, 11, 6, 1); p.r('#f5d63a', 11, 10, 2, 2); }
  else if (id === 'carrot' || id === 'potato') { p.r(c, 6, 12, 5, 3); p.r(shade(c, 0.3), 6, 12, 4, 1); }
  else if (id === 'basil') { p.r(leafHi, 4, 3, 8, 2); p.r(leafCol, 5, 5, 6, 3); }
  else for (const [x, y] of [[4, 6], [10, 5], [5, 10], [10, 9]]) dot(x, y);
}
