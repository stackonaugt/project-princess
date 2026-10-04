// Builds every texture the game needs. If you have dropped a custom PNG into
// assets/sprites/, that is used instead of the built-in pixel art.
//
// Custom art is discovered through assets/sprites/manifest.json, which is
// generated automatically (by the GitHub Pages workflow, or by tools/serve.mjs
// when you play locally). You never need to edit it by hand.

import { ART_PATH } from '../config.js';
import { PETS } from '../data/pets.js';
import { NPCS } from '../data/npcs.js';
import { painter, outline } from './paint/painter.js';
import { PET_FRAMES, BASE_PALETTE } from './sprites.js';
import { HEROES } from '../data/heroes.js';
import { drawPerson } from './paint/people.js';
import { OBJECTS } from './paint/objects.js';
import { ITEM_ART } from './paint/items.js';
import { FX, FX_STRIPS, VEHICLES } from './paint/fx.js';
import { paintTuft } from './paint/tiles.js';

// Folder in assets/sprites -> texture key prefix
const FOLDERS = { player: 'player', pets: 'pet', portraits: 'portrait', npcs: 'npc', objects: 'obj', tiles: 'tile', items: 'item', vehicles: 'veh' };
// Character sheets get split into square frames.
const CHARACTER_PREFIXES = ['player', 'pet', 'npc'];

export const custom = new Set();     // texture keys that came from PNGs
export const customURL = {};         // key -> url (used for HTML portraits)

export function keyForPath(path) {
  const m = /^([a-z]+)\/([a-z0-9_-]+)\.(png|jpe?g|webp)$/i.exec(path);
  if (!m || !FOLDERS[m[1]]) return null;
  return `${FOLDERS[m[1]]}-${m[2].toLowerCase()}`;
}

export function queueCustomArt(scene, paths) {
  for (const path of paths) {
    const key = keyForPath(path);
    if (!key) continue;
    scene.load.image(key, ART_PATH + path);
    custom.add(key); customURL[key] = ART_PATH + path;
  }
  scene.load.on('loaderror', file => { custom.delete(file.key); delete customURL[file.key]; });
}

function canvasTexture(scene, key, w, h, draw) {
  if (scene.textures.exists(key)) return;
  const tex = scene.textures.createCanvas(key, w, h);
  draw(painter(tex.getContext()));
  tex.refresh();
}
function stripTexture(scene, key, fw, fh, n, draw, outlined = false) {
  if (scene.textures.exists(key)) return;
  const tex = scene.textures.createCanvas(key, fw * n, fh);
  const p = painter(tex.getContext());
  for (let i = 0; i < n; i++) { p.ctx.save(); p.ctx.translate(i * fw, 0); draw(p, i); p.ctx.restore(); }
  if (outlined) for (let i = 0; i < n; i++) outline(p.ctx, i * fw, 0, fw, fh);
  tex.refresh();
  for (let i = 0; i < n; i++) tex.add(i, 0, i * fw, 0, fw, fh);
}
// Split a custom character sheet into frames numbered 0..n-1. Pets use
// square frames; people are twice as tall as they are wide (16x32).
function splitCustom(scene, key) {
  const tex = scene.textures.get(key), src = tex.getSourceImage();
  const h = src.height, fw = key.startsWith('pet-') ? h : h / 2, n = Math.max(1, Math.round(src.width / fw));
  for (let i = 0; i < n; i++) tex.add(i, 0, i * Math.floor(src.width / n), 0, Math.floor(src.width / n), h);
}
export const frameCount = (scene, key) => Math.max(1, scene.textures.get(key).frameTotal - 1);

// The texture to use for the player: your own art for this character,
// then your own art for everyone, then the built-in sprite. Returns
// [key, flipX] (right-facing reuses left, mirrored, unless you drew it).
export function playerTexture(hero, dir) {
  for (const k of [`player-${hero}-${dir}`, `player-${dir}`]) if (custom.has(k)) return [k, false];
  if (dir === 'right') { const [k] = playerTexture(hero, 'left'); return [k, true]; }
  return [`player-${hero}-${dir}`, false];
}

const STEPS = [0, 1, 2]; // people: standing, left stride, right stride

export function buildTextures(scene) {
  for (const key of custom) if (CHARACTER_PREFIXES.some(pfx => key.startsWith(pfx + '-'))) splitCustom(scene, key);

  // Player
  for (const [id, hero] of Object.entries(HEROES)) for (const dir of ['down', 'up', 'left'])
    stripTexture(scene, `player-${id}-${dir}`, 16, 32, 3, (p, i) => drawPerson(p, hero.look, dir, STEPS[i]), true);
  // Pets
  for (const pet of PETS) {
    const frames = PET_FRAMES[pet.sprite], pal = { ...BASE_PALETTE, ...pet.pal };
    stripTexture(scene, `pet-${pet.id}`, 16, 16, frames.length, (p, i) => p.sprite(frames[i], pal, 0, 0), true);
  }
  // People
  for (const [id, npc] of Object.entries(NPCS)) {
    if (custom.has(`npc-${id}`)) continue;
    for (const dir of ['down', 'up', 'left']) stripTexture(scene, `npc-${id}-${dir}`, 16, 32, 3, (p, i) => drawPerson(p, npc.look, dir, STEPS[i]), true);
  }
  // Items
  for (const [id, art] of Object.entries(ITEM_ART)) canvasTexture(scene, `item-${id}`, 16, 16, p => p.sprite(art.rows, art.pal, 2, 2));
  // Effects and vehicles
  for (const [key, [w, h, draw]] of Object.entries(FX)) canvasTexture(scene, key, w, h, draw);
  for (const [key, [fw, fh, n, draw]] of Object.entries(FX_STRIPS)) stripTexture(scene, `fx-${key}`, fw, fh, n, draw);
  for (const [key, [w, h, draw]] of Object.entries(VEHICLES)) canvasTexture(scene, key, w, h, draw);

  createAnims(scene);
}

export function tuftTexture(scene, region, grass) {
  const key = `tuft-${region}`;
  canvasTexture(scene, key, 16, 16, p => paintTuft(p, grass));
  return key;
}

// Object textures are made the first time a map needs them.
export function objectTexture(scene, o) {
  const def = OBJECTS[o.kind];
  const variantName = String(o.kind === 'fence' ? String(o.v).split(':')[0] : o.v).replace(/\s+/g, '').toLowerCase();
  for (const k of [`obj-${o.kind}-${variantName}`, `obj-${o.kind}`]) if (custom.has(k)) return k;
  const key = `obj-${o.kind}-${o.v}`;
  canvasTexture(scene, key, def.tex[0], def.tex[1], p => def.paint(p, o.v, o));
  return key;
}

function createAnims(scene) {
  const make = (key, tex, frames, rate) => {
    if (scene.anims.exists(key)) return;
    scene.anims.create({ key, frames: frames.map(f => ({ key: tex, frame: f })), frameRate: rate, repeat: -1 });
  };
  const walkFrames = (tex, n) => custom.has(tex) ? (n > 2 ? [...Array(n - 1).keys()].map(i => i + 1) : [...Array(n).keys()]) : [1, 0, 2, 0];
  const playerKeys = ['down', 'up', 'left', 'right'].flatMap(d => [`player-${d}`, ...Object.keys(HEROES).map(h => `player-${h}-${d}`)]);
  for (const tex of playerKeys) {
    if (!scene.textures.exists(tex)) continue;
    const n = frameCount(scene, tex);
    if (n > 1) make(`${tex}-walk`, tex, walkFrames(tex, n), 8);
  }
  for (const pet of PETS) {
    const tex = `pet-${pet.id}`, n = frameCount(scene, tex);
    if (n > 1) make(`${tex}-walk`, tex, custom.has(tex) ? [...Array(n).keys()] : [0, 1], 6);
  }
  for (const id of Object.keys(NPCS)) {
    if (custom.has(`npc-${id}`)) {
      const tex = `npc-${id}`, n = frameCount(scene, tex);
      if (n > 1) make(`${tex}-walk`, tex, [...Array(n).keys()], 6);
      continue;
    }
    for (const dir of ['down', 'up', 'left']) make(`npc-${id}-${dir}-walk`, `npc-${id}-${dir}`, [1, 0, 2, 0], 7);
  }
  make('fx-duck-swim', 'fx-duck', [0, 1], 2);
  make('fx-magpie-hop', 'fx-magpie', [0, 1], 4);
}

// Scale that makes a texture fill a slot of `size` world pixels.
export function firstFrame(scene, key) {
  const tex = scene.textures.get(key);
  return tex.has(0) ? 0 : undefined;
}
export function fitScale(scene, key, size, by = 'height') {
  const tex = scene.textures.get(key), f = tex.has(0) ? tex.get(0) : tex.get();
  return size / (by === 'width' ? f.width : f.height);
}

// PNG data URL of one frame, for showing sprites in the HTML interface.
const urlCache = {};
export function frameDataURL(scene, key, frame = 0, size = 64) {
  const id = `${key}:${frame}:${size}`;
  if (urlCache[id]) return urlCache[id];
  if (!scene.textures.exists(key)) return '';
  const tex = scene.textures.get(key), f = tex.has(frame) ? tex.get(frame) : tex.get();
  const c = document.createElement('canvas');
  const scale = Math.max(1, Math.floor(size / Math.max(f.width, f.height)));
  c.width = f.width * scale; c.height = f.height * scale;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  g.drawImage(f.source.image, f.cutX, f.cutY, f.cutWidth, f.cutHeight, 0, 0, c.width, c.height);
  return (urlCache[id] = c.toDataURL());
}

