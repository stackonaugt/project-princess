// A fishing trip (face the water and press A) and Ross Millward's Coburg Lake
// Fishing Comp. Rules of the fight: systems/fishing.js; progress: angler.js;
// numbers and words: data/fishing.js; the screen: ui/fishing.js.
import { state } from './state.js';
import { ui } from '../ui/ui.js';
import { sfx } from './sfx.js';
import { ITEMS } from '../data/items.js';
import { UPGRADES } from '../data/upgrades.js';
import { FISH, DAILY_FISH, COMP, ROSS, rodFor } from '../data/fishing.js';
import { itemIcon } from '../ui/images.js';
import { PEOPLE } from '../data/dialogue.js';
import {
  bestRod, rodTier, rodLock, currentEase, fishingLevel, caughtHere, fishedOut, rollFish, recordCatch, recordLost,
  compOpen, compDay, compHours, compWeek, isMember, rareFish, joinComp, startComp, compResults, awardComp,
} from './angler.js';

const kg = n => `${n.toFixed(2)} kg`;
const infoLine = zone => `Bait: ${state.count('bait')} · Fishing Lv ${fishingLevel()} · ${UPGRADES[bestRod()]?.name || 'No rod'} · Here today: ${caughtHere(zone)}/${DAILY_FISH}`;

export async function goFishing(world) {
  if (!bestRod()) return ui.say(['The water looks fishy. You would need a fishing rod. Bazza at Anaconda in Preston sells them.']);
  if (world.emilioWaiting?.()) return world.emilio();
  const zone = world.regionId;
  // Four fish from one spot and it is fished out until tomorrow.
  if (fishedOut(zone)) return ui.say(['It\'s all fished out here for now. Come back later.', 'The fish here need a day to forget about you. Try another spot, or come back tomorrow.']);
  // Every cast costs one bait, caught or not. No bait, no fishing.
  if (state.count('bait') < 1) return ui.say(['No bait left. Bazza at Anaconda in Preston sells it, a couple of dollars a tub.']);
  state.removeItem('bait');
  const fish = rollFish(zone);
  state.data.minutes += 10;
  world.save();
  // Too big for your rod: it bites, then snaps the line.
  if (rodFor(fish) > rodTier()) {
    recordLost(); world.save();
    sfx.sad();
    return ui.say(['Something huge takes the bait and bends your rod double.', 'Snap! Gone. You would need a stronger rod for that one. Bazza at Anaconda might have one, if you are good enough.']);
  }
  let size = null;
  const got = await ui.fish(fish, FISH[fish].zone, { ease: currentEase(), info: infoLine(zone), onLand: s => { size = s; } });
  if (got) {
    recordCatch(got, size, zone);
    ui.toast(`+1 ${ITEMS[got].name}`, itemIcon(got, 32));
    if (fishedOut(zone)) ui.toast('That is four. All fished out here for today.');
  } else recordLost();
  world.save();
}

// ------------------------------------------------------------ Ross and the comp
// The talk menu options Ross adds (WorldScene.talkToNpc).
// Bazza's fishing tips: what you need next, else a general tip (one a day each).
export const bazzaChoices = id => id === 'bazza' ? [{ label: 'Fishing tips', value: 'bazzaTip' }] : [];
export function bazzaTip() {
  const t = PEOPLE.bazza.tips, f = state.data.fishing || {};
  if (!bestRod()) return t.rod;
  if (state.count('bait') < 1) return t.bait;
  if (!state.hasUpgrade('rod3') && !rodLock('rod3')) return t.rod3;
  if (!state.hasUpgrade('rod2') && !state.hasUpgrade('rod3') && !rodLock('rod2')) return t.rod2;
  if (!f.member) return t.ross;
  const n = (f.tips || 0) % t.general.length;
  f.tips = (f.tips || 0) + 1;
  return t.general[n];
}

export function rossChoices(id) {
  if (id !== 'ross') return [];
  if (!isMember()) return [{ label: ROSS.ask, value: 'rossAsk' }, ...(rareFish().length ? [{ label: ROSS.show, value: 'rossShow' }] : [])];
  return compOpen() ? [{ label: ROSS.enter, value: 'rossComp' }] : [{ label: ROSS.ask, value: 'rossAsk' }];
}

export async function rossAction(world, act, opts) {
  if (act === 'rossAsk') {
    if (!isMember()) return ui.say(ROSS.about, opts);
    if (state.data.fishing.compWeek === compWeek() && compDay()) return ui.say([ROSS.done], opts);
    if (compDay() && state.data.minutes >= COMP.to * 60) return ui.say([ROSS.late], opts);
    return ui.say([ROSS.wrongDay], opts);
  }
  if (act === 'rossShow') {
    const rare = rareFish();
    if (!rare.length) return ui.say([ROSS.notRare], opts);
    joinComp(); sfx.found();
    await ui.say(ROSS.shown(ITEMS[rare[0]].name.toLowerCase()), opts);
    ui.toast('Fishing comp: Sundays, 7am to noon, Coburg Lake');
    return world.save();
  }
  if (act === 'rossComp') return fishingComp(world, opts);
}

// The comp: Ross hands out bait and starts the clock. Cast after cast until
// the whistle; total weight against three rivals.
async function fishingComp(world, opts) {
  if (!bestRod()) return ui.say([ROSS.noRod], opts);
  if (!compOpen() || !compHours()) return ui.say([ROSS.wrongDay], opts);
  await ui.say(ROSS.rules(COMP.seconds), opts);
  startComp(); world.save();
  const ends = performance.now() + COMP.seconds * 1000;
  let total = 0, n = 0, stopped = false;
  while (!stopped && performance.now() < ends - 400) {
    // Ross's comp water only has what your rod can hold.
    const fish = rollFish('coburglake', { maxTier: rodTier() });
    let size = null;
    const got = await ui.fish(fish, FISH[fish].zone, {
      ease: currentEase(), comp: { ends },
      info: `Comp bait supplied · ${n} fish · ${kg(total)}`,
      onLand: s => { size = s; }, onStop: () => { stopped = true; },
    });
    if (got) {
      recordCatch(got, size, 'coburglake', { comp: true });
      if (!FISH[got].junk) { total += size?.kg || 0; n++; }
    } else if (performance.now() < ends) recordLost();
  }
  state.data.minutes += 60;
  await ui.say([ROSS.hooter, ROSS.results], opts);
  const { rows, place } = compResults(total);
  await ui.say([rows.map((r, i) => `${i + 1}. ${r.you ? 'You' : r.name}: ${kg(r.kg)}`).join('  ')], opts);
  const prize = awardComp(place);
  if (place === 0) {
    sfx.found();
    await ui.say([ROSS.first, ...(prize.items.length ? [ROSS.firstPrize] : [])], opts);
    ui.banner('First place!', 'Coburg Lake Fishing Comp');
  } else await ui.say([place < 3 ? ROSS.placed(place) : ROSS.last], opts);
  if (prize.money) ui.toast(`+$${prize.money} prize money`);
  for (const id of prize.items) ui.toast(`+1 ${ITEMS[id].name}`, itemIcon(id, 32));
  world.save();
}
