import { state } from './state.js';
import { trainingStarted } from './progression-gates.js';
import { weekday } from '../data/routines.js';
import { BAKE_OFF } from '../data/cooking.js';
import { objectives } from './story.js';
import { ZONES, getMap } from '../data/regions.js';
import { NPCS } from '../data/npcs.js';
import { PET_BY_ID } from '../data/pets.js';
import { isAt, onDuty } from '../data/routines.js';
import { TILE as T } from '../config.js';
const toWorld = (x, y) => ({ x: (x + 0.5) * T, y: (y + 0.75) * T });

export const initialObjective = () => ({ id: 'find-princess', text: 'She has got out again. Head outside and find her on Allen St.', done: state.isFound('princess'), destination: { pet: 'princess' } });
export function isPinned(kind, id) {
  const pin = state.data.pinned;
  return !!pin && pin.kind === kind && pin.id === id && (kind === 'request' ? pin.day === state.data.day : id === 'find-princess' || pin.chapter === state.data.story.chapter);
}
export function pinObjective(kind, id) {
  state.data.pinned = isPinned(kind, id) ? null : { kind, id, day: state.data.day, chapter: state.data.story.chapter };
  state.save();
}
export function pinnedObjective() {
  const pin = state.data.pinned;
  if (!pin) return null;
  if (pin.kind === 'request') {
    if (pin.day !== state.data.day) return null;
    return state.todaysRequests().find(q => q.id === pin.id) || null;
  }
  if (pin.id === 'find-princess') return initialObjective();
  if (pin.chapter !== state.data.story.chapter) return null;
  return objectives(pin.chapter).find(o => o.id === pin.id) || null;
}
export function exitRestriction(from, exit, scene) {
  if (!exit.to) return 'This exit is closed.';
  if (exit.to === 'bakeoff' && (!state.data.side.bake || weekday(state.data.day) !== BAKE_OFF.day))
    return 'Talk to Betty, then return on Saturday for the bake-off.';
  if (exit.to === 'exhibition' && !trainingStarted(state.data)) return 'Start a pet-school lesson before visiting the Exhibition Dog Show.';
  if (scene?.party) return 'You cannot leave your own party.';
  if (from === 'allen' && !['home', 'yard'].includes(exit.to) && !state.isFound('princess')) return 'Find Princess before leaving Allen St.';
  if (from === 'allen' && exit.to === 'station' && !state.isFound('marty')) return 'Visit Woods St and befriend Marty before using the station shortcut.';
  if (exit.gate && !state.data.beaten[exit.gate]) return 'This walking route is progression locked.';
  if (scene?.shutShop(exit.to)) return 'The destination shop is closed right now.';
  return null;
}
// Use actual directed walking connections, never ROUTE's display ordering.
export function nextWalkingExit(from, to, scene) {
  const queue = [{ region: from, first: null }], seen = new Set([from]);
  for (let i = 0; i < queue.length; i++) {
    const node = queue[i];
    for (const exit of getMap(node.region).exits) {
      if (!exit.to || seen.has(exit.to) || exitRestriction(node.region, exit, scene)) continue;
      const first = node.first || exit;
      if (exit.to === to) return first;
      seen.add(exit.to); queue.push({ region: exit.to, first });
    }
  }
  return null;
}
export function exitPoint(exit, scene) {
  // One flood search for any reachable trigger tile, even along a very wide exit.
  const result = scene.navigation.router.route(scene.player, {}, p => {
    const x = Math.floor(p.x / T), y = Math.floor((p.y - 1) / T);
    return x >= exit.x && x < exit.x + exit.w && y >= exit.y && y < exit.y + exit.h;
  });
  return result.status === 'ok' ? result.points.at(-1) : null;
}
export function resolveDestination(destination, scene) {
  if (!destination) return { status: 'instructions', text: 'Follow the objective instructions; there is no fixed destination.' };
  let region = destination.region, point, target;
  if (destination.npc) {
    const id = destination.npc;
    for (const z of state.data.visited) {
      const spot = getMap(z).npcs.find(n => n.id === id && isAt(id, n.at, state.data) && onDuty(n, NPCS[id], state.data, ZONES[z].home));
      if (spot) { region = z; point = toWorld(spot.x, spot.y); break; }
    }
    if (!region) return { status: 'unknown', text: 'Their current location is unknown or they are away. Check again later.' };
    if (region === scene.regionId) {
      const ref = scene.npcs.find(n => n.id === id && !n.gone && n.visible);
      if (!ref) return { status: 'unknown', text: 'They are not here right now. Check again later.' };
      target = { kind: 'npc', ref, r: ref.spot.counter ? 30 : 22 }; point = { x: ref.x, y: ref.y };
    }
  }
  if (destination.pet) {
    const pet = PET_BY_ID[destination.pet];
    if (!pet) return { status: 'unknown', text: 'Location unknown.' };
    region = state.isFound(pet.id) ? pet.homeSpot.zone : pet.zone;
    if (region === scene.regionId || state.inParty(pet.id)) {
      const ref = scene.pets.find(p => p.id === pet.id);
      if (ref) { region = scene.regionId; point = { x: ref.x, y: ref.y }; target = { kind: 'pet', ref }; }
    }
  }
  if (!region || !state.data.visited.includes(region)) return { status: 'unknown', text: 'Destination not discovered. Follow the existing instructions to explore.' };
  if (region !== scene.regionId) {
    const exit = nextWalkingExit(scene.regionId, region, scene);
    if (!exit) return { status: 'unreachable', text: 'No open walking route right now. A progression lock or closed door may block it.' };
    point = exitPoint(exit, scene);
    if (!point) return { status: 'unreachable', text: 'The next walking exit cannot be reached from here.' };
    const name = state.data.visited.includes(exit.to) ? ZONES[exit.to].name : 'the unexplored exit';
    return { status: 'exit', point, text: `Next: walk to ${name}. Continue using the map after entering the next region.` };
  }
  if (destination.kind) {
    target = scene.interactables.find(t => t.kind === destination.kind);
    if (target) point = { x: target.x, y: target.y };
  }
  if (!point) return { status: 'local', text: `You are at ${ZONES[region].name}. Follow the instructions here.` };
  if (scene.navigation.router.route(scene.player, point, target ? target.r || 22 : 0).status !== 'ok')
    return { status: 'unreachable', text: 'The destination is known, but no local walking route reaches it.' };
  return { status: 'local', point, target, text: target ? 'Walk over to interact.' : `Destination: ${ZONES[region].name}.` };
}
