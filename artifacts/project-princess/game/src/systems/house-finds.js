// Once-per-save finds around the house and yard (data/house-finds.js).
// WorldScene calls buildHouseFinds(scene) when a zone loads and
// takeHouseFind(scene, target) when you press A on one.
import { state } from './state.js';
import { HOUSE_FINDS, HOUSE_FIND_NUDGE } from '../data/house-finds.js';
import { ITEMS } from '../data/items.js';
import { addTutorial, completeTutorial } from './todo.js';
import { TILE as T } from '../config.js';

const found = () => state.data.houseFinds || (state.data.houseFinds = []);
export const houseFindsLeft = (zone = null) => HOUSE_FINDS.filter(f => (!zone || f.zone === zone) && !found().includes(f.id));

// A 7x7 four-point star, gold with a white heart and a dark rim so it shows on pale furniture.
const STAR = ['...k...', '..kyk..', '.kywyk.', 'kywwwyk', '.kywyk.', '..kyk..', '...k...'];
function starTexture(scene) {
  const key = 'fx-housefind';
  if (scene.textures.exists(key)) return key;
  const c = scene.textures.createCanvas(key, 7, 7), ctx = c.getContext();
  const col = { k: '#6a4a10', y: '#f4c430', w: '#fffbe8' };
  STAR.forEach((row, j) => [...row].forEach((ch, i) => { if (col[ch]) { ctx.fillStyle = col[ch]; ctx.fillRect(i, j, 1, 1); } }));
  c.refresh();
  return key;
}

export function buildHouseFinds(scene) {
  const left = houseFindsLeft(scene.regionId);
  if (['home', 'yard'].includes(scene.regionId) && houseFindsLeft().length && !found().length)
    addTutorial(HOUSE_FIND_NUDGE.id, HOUSE_FIND_NUDGE.title, HOUSE_FIND_NUDGE.text);
  return left.map(f => {
    const x = (f.x + 0.5) * T, y = (f.y + 0.5) * T, top = (f.y + 1) * T + 2;   // above the furniture it sits on (depth = footprint bottom)
    // A little gold twinkle that pulses over the spot.
    const star = scene.add.image(x, y - 6, starTexture(scene)).setDepth(top).setScale(1.4).setAlpha(0.3);
    scene.tweens.add({ targets: star, alpha: 1, scale: 2, duration: 700, yoyo: true, repeat: -1, repeatDelay: 500, ease: 'Sine.easeInOut', delay: (f.x * 7 + f.y * 13) % 700 });
    const sprites = [star];
    return { kind: 'housefind', find: f, x, y: y - 2, r: 18, sprites, bubble: 'fx-bubble-alert' };
  });
}

// Records the find and adds the item. Returns false if it was already taken.
export function claimHouseFind(scene, t) {
  const f = t.find;
  if (found().includes(f.id)) return false;
  found().push(f.id);
  scene.houseFinds = (scene.houseFinds || []).filter(x => x !== t);
  for (const s of t.sprites) { scene.tweens.killTweensOf(s); s.destroy(); }
  state.addItem(f.item, f.n || 1);
  if (!houseFindsLeft().length) completeTutorial(HOUSE_FIND_NUDGE.id);
  state.save();
  return true;
}

export async function takeHouseFind(scene, t) {
  if (!claimHouseFind(scene, t)) return;
  // The interface is loaded lazily so the rules above import cleanly in Node tests.
  const [{ ui }, { sfx }, { itemIcon }] = await Promise.all([import('../ui/ui.js'), import('./sfx.js'), import('../ui/images.js')]);
  const f = t.find;
  sfx.pickup();
  ui.toast(`+${f.n || 1} ${ITEMS[f.item].name}`, itemIcon(f.item, 32));
  await ui.say(f.lines);
}
