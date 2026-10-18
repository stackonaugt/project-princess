// "It's starting!" pop-ups for events you are meant to attend (data/events.js).
// World calls maybeEventPrompt() when it opens and every ten game minutes.
// One pop-up per event per day; Go now takes you straight there.
import { state } from './state.js';
import { ui } from '../ui/ui.js';
import { sfx } from './sfx.js';
import { ZONES } from '../data/regions.js';
import { dueEvents, markPrompted } from '../data/events.js';

export async function maybeEventPrompt(world) {
  if (world.eventPrompting || world.leaving || ui.blocking() || ui.activity || !world.player?.active) return;
  if (world.partying || state.data.flags.partyNow) return;
  if (world.meredith) return;   // the festival keeps its own time   // never during the chapter 4 party
  const e = dueEvents(state.data, world.regionId).find(x => ZONES[x.zone]);
  if (!e) return;
  world.eventPrompting = true;
  try {
    markPrompted(state.data, e.id); state.save();
    sfx.blip?.();
    const go = await ui.say({ text: `${e.name} is starting now at ${e.where}. Go there now?`, choices: [{ label: 'Go now', value: true }, { label: 'Not now', value: false }] }, { cancelValue: false });
    if (go && !world.leaving) world.goTo(e.zone, e.entry, 0);
  } finally { world.eventPrompting = false; }
}
