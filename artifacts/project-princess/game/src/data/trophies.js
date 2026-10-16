// The trophy cabinet at home (house upgrade `trophyshelf`, Olly's House tab).
//
// A trophy is any item with `trophy: true` plus:
//   trophyText  what the cabinet says it is for, when you look at it
//   trophyArt   how it is drawn on the shelf: 'cup' (gold), 'silvercup',
//               'bowl' (a cup with a lawn bowl), 'ribbon' (blue), 'rosette'
//               (pink), 'fish' (a cup with a fish on it). Unknown: 'cup'.
// The fishing comp's `fishtrophy` (data/fishing.js) has no trophyArt: it is drawn as 'fish'.
// Give it `story: true` too, so it is never offered to a pet or as a present.
// Win one with state.addItem(id): it shows in the cabinet the next time the
// house is built (WorldScene rebuilds home when the cabinet's contents change).
import { ITEMS } from './items.js';

export const SHELF_SIZE = 6;
export const TROPHY_ART = ['cup', 'silvercup', 'bowl', 'ribbon', 'rosette', 'fish'];

export const trophyIds = () => Object.keys(ITEMS).filter(id => ITEMS[id].trophy);
const has = (data, id) => (data.inventory?.[id] || 0) > 0 || (id === 'newcomerscup' && !!data.side?.trophy);   // older saves only have side.trophy

// Every trophy you have won, in the order they are listed in the items.
export const ownedTrophies = data => trophyIds().filter(id => has(data, id));

// The ones on show: your own picks first (data.shelf), then the rest in order, up to SHELF_SIZE.
export function shelfTrophies(data) {
  const owned = ownedTrophies(data), out = (Array.isArray(data.shelf) ? data.shelf : []).filter((id, i, a) => owned.includes(id) && a.indexOf(id) === i);
  for (const id of owned) if (!out.includes(id)) out.push(id);
  return out.slice(0, SHELF_SIZE);
}
const artOf = id => TROPHY_ART.includes(ITEMS[id]?.trophyArt) ? ITEMS[id].trophyArt : id === 'fishtrophy' ? 'fish' : 'cup';
// The cabinet's texture variant: the art of each trophy on show, in order ('empty' with none).
export const shelfVariant = data => shelfTrophies(data).map(artOf).join('.') || 'empty';
export const shelfArt = v => (!v || v === 'empty' ? [] : String(v).split('.').map(a => TROPHY_ART.includes(a) ? a : 'cup')).slice(0, SHELF_SIZE);
// What you read when you look at one.
export const trophyLines = id => [`${ITEMS[id].name}.`, ITEMS[id].trophyText || ITEMS[id].desc || 'You give it a polish.'];

// Swap a trophy on show for one in the cupboard.
export function swapTrophy(data, out, inn) {
  const shown = shelfTrophies(data), i = shown.indexOf(out);
  if (i < 0 || !ownedTrophies(data).includes(inn) || shown.includes(inn)) return false;
  shown[i] = inn; data.shelf = shown;
  return true;
}
