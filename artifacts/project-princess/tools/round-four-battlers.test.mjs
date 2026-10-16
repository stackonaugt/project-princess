// Round four: twelve more battlers in the zones the owner listed.
import test from 'node:test';
import assert from 'node:assert/strict';

const G = new URL('../game/', import.meta.url);
const mod = p => import(new URL(p, G).href);
const { getMap } = await mod('src/data/regions.js');
const { TRAINERS, ENEMIES } = await mod('src/data/enemies.js');
const { MOVES } = await mod('src/data/moves.js');
const { NPCS } = await mod('src/data/npcs.js');
const { TYPES } = await mod('src/data/types.js');

const AT = {
  vlinegreg: 'station', rosa: 'footscray', hiviskev: 'brunswick', opal: 'donald', lachlan: 'hope', cass: 'sydney',
  terry: 'reservoir', yvonne: 'glasgow', brad: 'preston', zara: 'prestonhigh', ponsonby: 'nicholson', tayla: 'gardens',
};

test('each new battler stands on a walkable, reachable tile in their zone', () => {
  for (const [id, zone] of Object.entries(AT)) {
    const m = getMap(zone), n = m.npcs.find(x => x.id === id);
    assert.ok(n, `${id} in ${zone}`);
    const solid = (x, y) => x < 0 || y < 0 || x >= m.w || y >= m.h || m.solid[y * m.w + x];
    const ent = Object.values(m.entries)[0], seen = new Set([`${ent.x},${ent.y}`]), q = [[ent.x, ent.y]];
    while (q.length) {
      const [x, y] = q.shift();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const k = `${x + dx},${y + dy}`;
        if (!solid(x + dx, y + dy) && !seen.has(k)) { seen.add(k); q.push([x + dx, y + dy]); }
      }
    }
    assert.ok(!solid(n.x, n.y) && seen.has(`${n.x},${n.y}`), `${id} reachable in ${zone}`);
  }
});

test('each new battler has words, foes, moves and art', async () => {
  const { FOE_ART } = await mod('src/art/paint/enemies.js');
  for (const id of Object.keys(AT)) {
    const t = TRAINERS[id];
    assert.ok(NPCS[id] && t, id);
    assert.ok(t.challenge && t.ask && t.win && t.lose && t.again, `${id} lines`);
    for (const [foe] of t.team) {
      const e = ENEMIES[foe];
      assert.ok(e && FOE_ART[foe], `${foe} foe and art`);
      for (const ty of [].concat(e.type)) assert.ok(TYPES[ty], `${foe} type ${ty}`);
      for (const m of e.moves) assert.ok(MOVES[m] && TYPES[MOVES[m].type], `${foe} move ${m}`);
    }
  }
});

test('Marty sharts, and Ardi has a durian then a snapper for you', async () => {
  const { PET_MOVES } = await mod('src/data/moves.js');
  const { PET_BY_ID } = await mod('src/data/pets.js');
  const { ITEMS } = await mod('src/data/items.js');
  const { ITEM_ART } = await mod('src/art/paint/items.js');
  const { PEOPLE } = await mod('src/data/dialogue.js');
  assert.equal(MOVES.shart.name, 'Shart');
  assert.ok(PET_MOVES.marty.includes('shart') && !PET_MOVES.marty.includes('smellpoo'));
  assert.ok(PET_BY_ID.marty.evolution.moves.includes('shart'));
  assert.deepEqual(PEOPLE.ardi.presents.map(([id]) => id), ['durian', 'snapper']);
  for (const id of ['durian', 'snapper']) assert.ok(ITEMS[id] && ITEM_ART[id], id);
  assert.ok(ITEMS.snapper.fish);
});
