// Looking in the trophy cabinet at home (data/trophies.js): pick a trophy to
// read what it is for, or swap one on show for another when you have won
// more than the cabinet holds.
import { state } from './state.js';
import { ui } from '../ui/ui.js';
import { sfx } from './sfx.js';
import { itemIcon } from '../ui/images.js';
import { ITEMS } from '../data/items.js';
import { invalidateMap } from '../data/regions.js';
import { SHELF_SIZE, ownedTrophies, shelfTrophies, shelfVariant, trophyLines, swapTrophy } from '../data/trophies.js';
import { objectTexture } from '../art/textures.js';

export async function trophyShelf(world) {
  for (;;) {
    const shown = shelfTrophies(state.data), spare = ownedTrophies(state.data).filter(id => !shown.includes(id));
    if (!shown.length) return ui.say(['The trophy cabinet is empty and very clean. It is waiting.', 'Win a competition: the bake off, the dog show, the bowls club championship. The trophies go in here.']);
    const choices = shown.map(id => ({ label: ITEMS[id].name, value: id, icon: itemIcon(id, 32) }));
    if (spare.length) choices.push({ label: 'Swap a trophy', value: 'swap' });
    const pickId = await ui.say({ text: `The trophy cabinet: ${shown.length} of ${SHELF_SIZE}. Which one?`, choices: [...choices, { label: 'Close the cabinet', value: null }] }, { cancelValue: null });
    if (!pickId) return;
    if (pickId !== 'swap') { await ui.say(trophyLines(pickId)); continue; }
    const out = await ui.say({ text: 'Take which one down?', choices: [...shown.map(id => ({ label: ITEMS[id].name, value: id, icon: itemIcon(id, 32) })), { label: 'Never mind', value: null }] }, { cancelValue: null });
    if (!out) continue;
    const inn = await ui.say({ text: 'Put which one up?', choices: [...spare.map(id => ({ label: ITEMS[id].name, value: id, icon: itemIcon(id, 32) })), { label: 'Never mind', value: null }] }, { cancelValue: null });
    if (!inn || !swapTrophy(state.data, out, inn)) continue;
    sfx.pickup(); world.save(); invalidateMap('home');
    // Redraw the cabinet in place with the new line-up.
    const o = world.map.objects.find(x => x.kind === 'trophyshelf');
    if (o?.sprite) { o.v = shelfVariant(state.data); o.sprite.setTexture(objectTexture(world, o)); }
    ui.toast(`${ITEMS[inn].name} is on show`);
  }
}
