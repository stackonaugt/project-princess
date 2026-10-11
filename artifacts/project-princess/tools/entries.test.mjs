// Every exit leads to an entry that exists, is walkable, is not itself inside
// an exit, and from which you can walk to the other ways out of that zone.
import test from 'node:test';
import assert from 'node:assert/strict';
import { ZONES, getMap } from '../game/src/data/regions.js';

const STEPS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function arrivalTiles(map, entry) {
  if (!entry.span) return [[entry.x, entry.y]];
  const [a, b] = entry.span, out = [];
  for (let v = Math.min(a, b); v <= Math.max(a, b); v++) out.push(entry.axis === 'y' ? [entry.x, v] : [v, entry.y]);
  return out;
}

function reachable(map, x, y) {
  const seen = new Uint8Array(map.w * map.h), q = [[x, y]];
  seen[y * map.w + x] = 1;
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

const touches = (seen, map, e) => {
  for (let y = e.y; y < e.y + e.h; y++) for (let x = e.x; x < e.x + e.w; x++) if (seen[y * map.w + x]) return true;
  return false;
};

test('every exit lands on a walkable entry with a way onwards', () => {
  const problems = [];
  for (const id of Object.keys(ZONES)) {
    const map = getMap(id);
    for (const exit of map.exits) {
      if (!exit.to) continue;
      const where = `${id} -> ${exit.to}.${exit.entry}`;
      if (!ZONES[exit.to]) { problems.push(`${where}: no such zone`); continue; }
      const target = getMap(exit.to), entry = target.entries[exit.entry];
      if (!entry) { problems.push(`${where}: no such entry`); continue; }
      const open = arrivalTiles(target, entry).filter(([x, y]) => x >= 0 && y >= 0 && x < target.w && y < target.h && !target.solid[y * target.w + x]);
      if (!open.length) { problems.push(`${where}: lands on a solid tile (${entry.x},${entry.y})`); continue; }
      const [x, y] = open[0];
      if (target.exits.some(e => e.to && x >= e.x && x < e.x + e.w && y >= e.y && y < e.y + e.h)) problems.push(`${where}: lands inside an exit`);
      const seen = reachable(target, x, y);
      const ways = target.exits.filter(e => e.to), reached = ways.filter(e => touches(seen, target, e));
      if (reached.length < Math.min(2, ways.length)) problems.push(`${where}: trapped, reaches ${reached.length} of ${ways.length} exits`);
    }
  }
  assert.deepEqual(problems, []);
});

test('Nicholson St to Holmes St arrives on Mitchell St', () => {
  const holmes = getMap('holmes'), e = holmes.entries.south;
  assert.equal(holmes.solid[e.y * holmes.w + e.x], 0);
  const back = holmes.exits.find(x => x.to === 'ebnicholson');
  assert.ok(touches(reachable(holmes, e.x, e.y), holmes, back), 'can walk straight back to Nicholson St');
});
