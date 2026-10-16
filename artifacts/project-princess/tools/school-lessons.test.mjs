import test from 'node:test';
import assert from 'node:assert/strict';
import { makeLesson, specialFor, findLessonArea, LESSON_TITLES } from '../game/src/systems/school-lessons.js';
import { PETS } from '../game/src/data/pets.js';

const area = { x: 32, y: 96, w: 240, h: 128 };
const DT = 0.02;
// A pretend player: walks (64 px/s) or runs (108) to points, or waits.
function driver(lesson) {
  const h = { x: lesson.start.x + 9, y: lesson.start.y, dir: 'right', speed: 0 };
  const step = () => { lesson.tick(DT, h); };
  const go = (p, speed = 64) => {
    for (let t = 0; t < 20 && !lesson.ended; t += DT) {
      const d = Math.hypot(p.x - h.x, p.y - h.y);
      if (d < 1) break;
      const s = Math.min(d, speed * DT);
      const dx = (p.x - h.x) / d, dy = (p.y - h.y) / d;
      h.x += dx * s; h.y += dy * s; h.speed = speed;
      h.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      step();
    }
    h.speed = 0;
  };
  const wait = (cond, limit = 15) => { h.speed = 0; for (let t = 0; t < limit && !lesson.ended && !cond(); t += DT) step(); };
  return { h, go, wait, face: dir => { h.dir = dir; } };
}

test('every pet has a special lesson, and each has a title', () => {
  for (const p of PETS) {
    const kind = specialFor(p.id, p.behaviour);
    assert.ok(LESSON_TITLES[kind], `${p.id}: ${kind}`);
  }
});

test('lead the course can be run clean at every class level', () => {
  for (let level = 0; level <= 4; level++) {
    const L = makeLesson('course', { level, area, seed: 0.3, name: 'Princess' });
    const { h, go, wait } = driver(L);
    for (const s of L.stations) {
      const before = (n, dy = 0) => ({ x: s.x - n * s.dir, y: s.y + dy });
      if (s.kind === 'hurdle') {
        go(before(60)); wait(() => Math.hypot(L.pet.x - h.x, L.pet.y - h.y) < 16);
        go({ x: s.x + 40 * s.dir, y: s.y }, 108);
      } else if (s.kind === 'weave') {
        const first = s.poles[0];
        go({ x: first - 30 * s.dir, y: s.y + 8 }); wait(() => Math.hypot(L.pet.x - h.x, L.pet.y - h.y) < 16);
        s.poles.forEach((x, j) => go({ x, y: s.y + (j % 2 ? -8 : 8) }));
        go({ x: s.poles.at(-1) + 30 * s.dir, y: s.y });
      } else if (s.kind === 'tunnel') {
        go({ x: s.entrance.x - 4 * s.dir, y: s.y }); wait(() => L.phase === 'tunnel');
        go({ x: s.entrance.x, y: s.y - 20 }, 108); go({ x: s.exit.x, y: s.y - 20 }, 108); go({ x: s.exit.x + 10 * s.dir, y: s.y }, 108);
        wait(() => L.phase === 'follow');
        go({ x: s.exit.x + 30 * s.dir, y: s.y });
      }
    }
    go(L.finish); wait(() => L.complete, 5);
    assert.equal(L.complete, true, `level ${level}: ${L.message}`);
    assert.equal(L.result().score, 3, `level ${level}: ${L.faults} faults, ${L.message}`);
  }
});

test('walking over a hurdle knocks the bar; an empty tunnel exit makes the pet back out', () => {
  const L = makeLesson('course', { level: 1, area, seed: 0.3, name: 'Poppy' });
  const { h, go, wait } = driver(L);
  const s = L.stations[0];
  go({ x: s.x - 60, y: s.y }); wait(() => Math.hypot(L.pet.x - h.x, L.pet.y - h.y) < 16);
  go({ x: s.x + 40, y: s.y }, 64);
  assert.equal(L.faults, 1); assert.match(L.message, /run-up/);
  const t = L.stations[1];
  go({ x: t.entrance.x - 4, y: t.y }); wait(() => L.phase === 'tunnel');
  wait(() => L.phase === 'follow', 8);
  assert.equal(L.faults, 2); assert.match(L.message, /backs out/);
});

test('look-away: the pet only comes while you stand still with your back turned', () => {
  const L = makeLesson('lookaway', { level: 2, area, seed: 0.4, name: 'Stanley' });
  const { h, wait, face } = driver(L);
  const facePet = () => face(Math.abs(L.pet.x - h.x) > Math.abs(L.pet.y - h.y) ? (L.pet.x > h.x ? 'right' : 'left') : (L.pet.y > h.y ? 'down' : 'up'));
  const turnAway = () => face({ right: 'left', left: 'right', up: 'down', down: 'up' }[(facePet(), h.dir)]);
  facePet(); const d0 = Math.hypot(L.pet.x - h.x, L.pet.y - h.y);
  wait(() => false, 2);
  assert.ok(Math.hypot(L.pet.x - h.x, L.pet.y - h.y) >= d0 - 1, 'does not come while watched');
  for (let i = 0; i < 3; i++) { wait(() => L.phase !== 'leaving'); turnAway(); wait(() => L.visits > i || L.ended, 30); }
  assert.equal(L.complete, true, L.message); assert.equal(L.result().score, 3);
});

test('charge: stopping where the line crosses a flag gets it; a bin in the way is a bonk', () => {
  const L = makeLesson('charge', { level: 0, area, seed: 0.6, name: 'Poppy' });
  const { go, wait } = driver(L);
  const clear = (from, to) => L.bins.every(b => {
    const vx = to.x - from.x, vy = to.y - from.y, t = Math.max(0, Math.min(1, ((b.x - from.x) * vx + (b.y - from.y) * vy) / (vx * vx + vy * vy || 1)));
    return Math.hypot(b.x - from.x - vx * t, b.y - from.y - vy * t) > 12;
  });
  const inside = p => p.x > area.x + 8 && p.x < area.x + area.w - 8 && p.y > area.y + 8 && p.y < area.y + area.h - 8;
  for (let tries = 0; tries < 12 && !L.ended; tries++) {
    const f = L.flags.find(g => !g.hit); if (!f) break;
    const d = Math.hypot(f.x - L.pet.x, f.y - L.pet.y) || 1;
    const spot = [20, 35, 50, 70].map(k => ({ x: f.x + (f.x - L.pet.x) / d * k, y: f.y + (f.y - L.pet.y) / d * k })).find(p => inside(p) && clear(L.pet, p));
    // No clean line from here: call the pet somewhere else first.
    const target = spot || [[0.2, 0.2], [0.8, 0.8], [0.2, 0.8], [0.8, 0.2], [0.5, 0.5]].map(([u, v]) => ({ x: area.x + area.w * u, y: area.y + area.h * v })).find(p => clear(L.pet, p) && Math.hypot(p.x - L.pet.x, p.y - L.pet.y) > 30);
    go(target, 108); wait(() => L.phase === 'charge', 2); wait(() => L.phase === 'sit', 4);
  }
  assert.ok(L.complete, L.message);
  const B = makeLesson('charge', { level: 0, area, seed: 0.6, name: 'Poppy' });
  const b = B.bins[0], dv = driver(B), dd = Math.hypot(b.x - B.pet.x, b.y - B.pet.y);
  dv.go({ x: b.x + (b.x - B.pet.x) / dd * 25, y: b.y + (b.y - B.pet.y) / dd * 25 }, 108);
  dv.wait(() => B.phase === 'dazed', 4);
  assert.equal(B.faults, 1); assert.match(B.message, /BONK/);
});

test('herd: chooks run from the dog and can be pushed into the pen', () => {
  const L = makeLesson('herd', { level: 0, area, seed: 0.5, name: 'Chloe' });
  const { h, go, wait } = driver(L);
  const gap = { x: L.pen.x, y: L.pen.y + L.pen.h / 2 };
  for (let round = 0; round < 30 && !L.complete; round++) {
    const c = L.chooks.find(k => !k.penned); if (!c) break;
    // Circle behind the chook, then walk it towards the gap.
    const d = Math.hypot(gap.x - c.x, gap.y - c.y) || 1, ux = (gap.x - c.x) / d, uy = (gap.y - c.y) / d;
    go({ x: c.x - ux * 50, y: c.y - uy * 50 + (round % 2 ? 30 : -30) }, 108);
    go({ x: c.x - ux * 50, y: c.y - uy * 50 }, 108);
    wait(() => Math.hypot(L.pet.x - h.x, L.pet.y - h.y) < 14, 2);
    go({ x: c.x - ux * 8, y: c.y - uy * 8 }, 64);
    wait(() => c.penned, 0.5);
  }
  assert.ok(L.chooks.filter(c => c.penned).length >= 2, 'a clumsy robot still pens most of them');
  // Nothing walks through a wall: a chook placed beside the closed side stays out.
  const M = makeLesson('herd', { level: 0, area, seed: 0.5, name: 'Chloe' });
  const c = M.chooks[0]; c.x = M.pen.x - 4; c.y = M.pen.y + 6; M.pet.x = c.x - 20; M.pet.y = c.y;
  for (let i = 0; i < 50; i++) M.tick(DT, { x: M.pet.x - 10, y: M.pet.y, dir: 'right', speed: 0 });
  assert.equal(c.penned, false);
});

test('hide and seek: the rustling bush finds the pet, a wrong bush is a slip', () => {
  const L = makeLesson('seek', { level: 1, area, seed: 0.2, name: 'Spooky', phase: true });
  const { go, wait } = driver(L);
  const wrong = L.bushes.findIndex((_, i) => i !== L.at);
  go(L.bushes[wrong], 108);
  assert.ok(L.faults >= 1);
  for (let i = 0; i < 3 && !L.ended; i++) {
    wait(() => L.phase !== 'found');
    wait(() => L.rustling >= 0, 6);
    go(L.bushes[L.rustling >= 0 ? L.rustling : L.at], 108);
  }
  assert.equal(L.complete, true, L.message);
});

test('the lesson area avoids solid tiles and exits, nearest the player', () => {
  const map = { w: 30, h: 20, solid: new Uint8Array(600) };
  for (let x = 0; x < 30; x++) map.solid[10 * 30 + x] = 1;   // a wall across the middle
  const a = findLessonArea(map, { x: 20 * 16, y: 15 * 16 }, { exits: [] });
  assert.ok(a.y >= 11 * 16, 'below the wall, near the player');
  const tiny = { w: 10, h: 8, solid: new Uint8Array(80) };
  assert.equal(findLessonArea(tiny, { x: 0, y: 0 }), null);
});
