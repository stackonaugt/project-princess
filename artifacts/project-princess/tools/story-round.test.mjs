import test from 'node:test';
import assert from 'node:assert/strict';

const storage = new Map();
globalThis.localStorage = { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) };
globalThis.window ??= { addEventListener() {} };
globalThis.document ??= { createElement: () => ({}), getElementById: () => null, addEventListener() {} };

const { PRANKS, PARTY_SLUMP, PARTY_BORED, NEWS_RESULT } = await import('../game/src/data/story.js');
const { ITEMS } = await import('../game/src/data/items.js');
const { SHOPS } = await import('../game/src/data/shops.js');
const { NPCS } = await import('../game/src/data/npcs.js');
const { electionVotes } = await import('../game/src/systems/story.js');
const { songWindow } = await import('../game/src/ui/karaoke.js');
const { TrainingSession, difficulty, CLASS_LEVELS, lessonPlan } = await import('../game/src/systems/training.js');
const { propSrc, toyArt } = await import('../game/src/ui/training-props.js');
const { readFileSync } = await import('node:fs');

test('Adam, Chelsea and Nathan can be pranked with things a shop sells', () => {
  for (const id of ['adam', 'chelsea', 'nathan']) {
    const pr = PRANKS[id];
    assert.ok(pr && NPCS[id], id);
    assert.ok(ITEMS[pr.item]?.story && ITEMS[pr.item].art, pr.item);
    assert.ok(pr.scout.length && pr.plan.length && pr.lines.length >= 2);
  }
  for (const pr of Object.values(PRANKS)) {
    const sold = Object.values(SHOPS).some(s => s.tabs?.includes('pranks') && (s.pranks || []).includes(pr.item));
    assert.ok(sold, `${pr.item} is on a Pranks tab`);
    for (const line of [...pr.scout, ...pr.plan, ...pr.lines]) assert.ok(line.length <= 140 && !line.includes('—'), line);
  }
  assert.equal(PRANKS.sinead.react, 'bubbles');
});

test('the party decides the election: a bad party loses, a decent one wins', () => {
  const sitting = { deposed: false, motions: 0 };
  assert.ok(electionVotes(3, 6, sitting) < 50, 'a flat party with six guests loses');
  assert.ok(electionVotes(0, 9, sitting) < 50, 'even lots of guests cannot save a disaster');
  assert.ok(electionVotes(4, 6, sitting) >= 50, 'a decent party wins');
  assert.ok(electionVotes(5, 6, { deposed: true, motions: 0 }) < 50, 'a deposed Paddy needs better');
  assert.ok(electionVotes(7, 6, { deposed: true, motions: 0 }) >= 50);
  assert.ok(electionVotes(13, 12, { deposed: false, motions: 5 }) <= 78);
  assert.equal(NEWS_RESULT(40, false, false, true).length, 4);
  assert.ok(PARTY_SLUMP.choices.length >= 3 && PARTY_BORED.length >= 3);
});

test('karaoke songs stop after about a minute', () => {
  const songs = JSON.parse(readFileSync(new URL('../game/assets/karaoke/songs.json', import.meta.url)));
  for (const song of songs) {
    const w = songWindow(song.lines);
    assert.ok(w.end - w.start >= 50 && w.end - w.start <= 75, `${song.id}: ${w.end - w.start}`);
    assert.ok(w.lines.length > 3 && w.lines.every(([t]) => t < w.end));
  }
});

test('pet school classes get harder as the pet gets better', () => {
  assert.equal(CLASS_LEVELS.length, 5);
  const easy = difficulty(0), hard = difficulty(4);
  assert.ok(hard.skill > easy.skill, 'the pet is quicker');
  assert.ok(hard.hurdles > easy.hurdles && hard.boxes > easy.boxes && hard.throwTolerance < easy.throwTolerance);
  assert.ok(hard.calmTime > easy.calmTime && hard.peek < easy.peek && hard.leadGood > easy.leadGood);
  assert.equal(lessonPlan({ id: 'princess', day: 1, skills: { agility: 24 } }).level('agility'), 4);
  // Advanced: a missed jump cue knocks the bar instead of waiting
  const s = new TrainingSession({ id: 'princess', name: 'Princess', day: 1, skills: { agility: 18 } }, 'agility'); s.action();
  assert.equal(s.hurdles.length, 3);
  for (let t = 0; t < 20000 && s.phase === 'playing'; t += 50) s.advance(50);
  assert.equal(s.phase, 'feedback'); assert.equal(s.score, 0);
  // ...and cueing each jump in time is a clean run
  const c = new TrainingSession({ id: 'princess', name: 'Princess', day: 1, skills: { agility: 18 } }, 'agility'); c.action();
  for (let t = 0; t < 20000 && c.phase === 'playing'; t += 50) { if (!c.jumpAcross && c.hurdle - 10 - c.petX < 6 && c.jump === 0) c.action(); c.advance(50); }
  assert.equal(c.score, 1);
  // Intermediate: rewarding a settle too early spoils the clean run
  const st = new TrainingSession({ id: 'princess', name: 'Princess', day: 1, skills: { settle: 12 } }, 'settle'); st.action(); st.action(); st.action();
  for (let t = 0; t < 10000 && st.calm < 1; t += 50) st.advance(50);
  st.action(); assert.equal(st.phase, 'feedback'); assert.equal(st.score, 0);
});

test('training toys and distractions are pictures, not words', () => {
  for (const toy of ['ribbon', 'feather', 'squeaky toy', 'ball', 'tennis ball', 'soft toy']) assert.match(propSrc(toyArt(toy)), /^data:image\/svg\+xml,/);
  for (const k of ['bird', 'sniff']) assert.match(propSrc(k), /rect/);
  const ui = readFileSync(new URL('../game/src/ui/training.js', import.meta.url), 'utf8');
  for (const word of ["'Feather'", "'Toy'", "'Bird'", "'Sniff spot'", "'Aim here'", "'Empty'"]) assert.ok(!ui.includes(word), word);
});
