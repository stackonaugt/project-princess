// Presents to find around the Allen St house and yard: every spot exists,
// can be reached from the zone's entries, gives an item someone the player
// meets early loves or likes, and is found once per save.
import test from 'node:test';
import assert from 'node:assert/strict';
import { HOUSE_FINDS, HOUSE_ITEMS, HOUSE_ITEM_ART } from '../game/src/data/house-finds.js';
import { ITEMS } from '../game/src/data/items.js';
import { ITEM_ART } from '../game/src/art/paint/items.js';
import { friendInfo } from '../game/src/data/friends.js';
import { getMap, invalidateMap } from '../game/src/data/regions.js';
import { state } from '../game/src/systems/state.js';

// The people a new player meets first: home, Allen St, Woods St, Laverton Station, Lohse St Reserve.
const EARLY = ['paddy', 'trish', 'gordon', 'lesley', 'kirsty', 'dahlia', 'malcolm', 'rayna', 'deanna', 'jack', 'ardi', 'binman', 'liza', 'ramon'];
const STEPS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function reachable(map) {
  const seen = new Uint8Array(map.w * map.h), q = [];
  for (const e of Object.values(map.entries)) if (!map.solid[e.y * map.w + e.x]) { seen[e.y * map.w + e.x] = 1; q.push([e.x, e.y]); }
  while (q.length) {
    const [cx, cy] = q.pop();
    for (const [dx, dy] of STEPS) {
      const X = cx + dx, Y = cy + dy, k = Y * map.w + X;
      if (X < 0 || Y < 0 || X >= map.w || Y >= map.h || seen[k] || map.solid[k]) continue;
      seen[k] = 1; q.push([X, Y]);
    }
  }
  return seen;
}

function checkSpots(label) {
  for (const zone of ['home', 'yard']) {
    invalidateMap(zone);
    const map = getMap(zone), seen = reachable(map);
    for (const f of HOUSE_FINDS.filter(f => f.zone === zone)) {
      const ok = [[0, 0], ...STEPS].some(([dx, dy]) => seen[(f.y + dy) * map.w + f.x + dx]);
      assert.ok(ok, `${label}: ${f.id} at ${zone} ${f.x},${f.y} can be reached`);
    }
  }
}

test('five to seven finds, unique ids, all in the house or yard', () => {
  assert.ok(HOUSE_FINDS.length >= 5 && HOUSE_FINDS.length <= 7);
  assert.equal(new Set(HOUSE_FINDS.map(f => f.id)).size, HOUSE_FINDS.length);
  for (const f of HOUSE_FINDS) {
    assert.ok(['home', 'yard'].includes(f.zone));
    assert.ok(ITEMS[f.item], `${f.item} is an item`);
    assert.ok(f.lines.length && f.lines.every(l => l.length <= 140 && !l.includes('—')), `${f.id} lines are short`);
  }
  for (const id of Object.keys(HOUSE_ITEMS)) {
    assert.ok(ITEMS[id]?.gift, `${id} is a present`);
    assert.ok(ITEM_ART[id] === HOUSE_ITEM_ART[id], `${id} has an icon`);
    const art = HOUSE_ITEM_ART[id];
    assert.equal(art.rows.length, 12);
    for (const r of art.rows) { assert.equal(r.length, 12, `${id} row ${r}`); for (const c of r) assert.ok(c === '.' || art.pal[c], `${id} colour ${c}`); }
  }
});

test('every find is loved or liked by someone the player meets early', () => {
  for (const f of HOUSE_FINDS) {
    const who = EARLY.filter(p => friendInfo(p).loves.includes(f.item) || friendInfo(p).likes.includes(f.item));
    assert.ok(who.length, `${f.item} suits someone early`);
  }
  // Gordon and Trish each have at least one find they love.
  for (const p of ['gordon', 'trish']) assert.ok(HOUSE_FINDS.some(f => friendInfo(p).loves.includes(f.item)), `${p} has a find they love`);
});

test('spots are reachable and do not wall anything off (default and upgraded house)', () => {
  state.data.upgrades = {};
  checkSpots('default');
  state.data.upgrades = { kitchen: true, study: true, twinsroom: true, veggiepatch: true, pool: true };
  checkSpots('upgraded');
  state.data.upgrades = {};
  for (const z of ['home', 'yard']) invalidateMap(z);
});

test('each spot is found once per save and survives a reload', async () => {
  const { buildHouseFinds, claimHouseFind, houseFindsLeft } = await import('../game/src/systems/house-finds.js');
  state.data.houseFinds = []; state.data.inventory = {};
  const tw = { add() {}, killTweensOf() {} };
  const sprite = () => { const s = { setDepth: () => s, setScale: () => s, setAlpha: () => s, setTint: () => s, setAngle: () => s, destroy() {} }; return s; };
  const scene = { regionId: 'yard', add: { image: sprite }, tweens: tw, textures: { exists: () => true } };
  const spots = buildHouseFinds(scene);
  assert.equal(spots.length, HOUSE_FINDS.filter(f => f.zone === 'yard').length);
  scene.houseFinds = spots;
  const first = spots[0];
  assert.equal(claimHouseFind(scene, first), true);
  assert.equal(state.count(first.find.item), 1);
  assert.equal(claimHouseFind(scene, first), false);
  assert.equal(state.count(first.find.item), 1, 'not given twice');
  assert.equal(buildHouseFinds(scene).length, spots.length - 1, 'not shown again');
  assert.equal(houseFindsLeft().length, HOUSE_FINDS.length - 1);
  // A new day does not bring it back, and the save keeps it.
  state.data.day += 1;
  assert.equal(buildHouseFinds(scene).length, spots.length - 1);
  const raw = JSON.parse(JSON.stringify(state.data));
  assert.deepEqual(raw.houseFinds, [first.find.id]);
});
