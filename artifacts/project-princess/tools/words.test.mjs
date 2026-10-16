// The words file (game/words.js): one searchable file of every line of text.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseWords, applyWords, writeWords, escapeWords } from '../game/src/authoring/words-file.js';
import { buildWords } from '../game/tools/words.mjs';

test('words.js is up to date with the game (run node game/tools/words.mjs after adding text)', async () => {
  assert.equal(readFileSync(new URL('../game/words.js', import.meta.url), 'utf8'), await buildWords());
});

test('an edit in the words file changes the text in game, and only text', () => {
  const people = { ardi: { name: 'Ardi', lines: [['Hi neighbour.', 'Second.'], ['Third line.']], gift: 'durian' } };
  const file = writeWords({ PEOPLE: people });
  assert.match(file, /\[PEOPLE\.ardi\]/);
  assert.match(file, /^lines\.1\.2 = Second\.$/m);
  assert.doesNotMatch(file, /gift = durian/, 'ids are left out');
  const edited = file.replace('lines.2.1 = Third line.', 'lines.2.1 = G\'day, $5 `tops`.\\nNew line.').replace('lines.1.1 = Hi neighbour.', 'gift = hacked');
  const out = applyWords(people, parseWords(edited).PEOPLE);
  assert.equal(out.ardi.lines[1][0], 'G\'day, $5 `tops`.\nNew line.');
  assert.equal(out.ardi.gift, 'durian', 'a key that is not text is never changed');
  assert.equal(people.ardi.lines[1][0], 'Third line.', 'source tables are not mutated');
});

test('escaping round-trips awkward characters', () => {
  for (const s of ['a `b` c', 'cost ${x} here', 'back\\slash', 'two\nlines', '$90 job']) {
    const back = parseWords(`[T]\nk = ${escapeWords(s)}`).T[0][1];
    assert.equal(back, s);
  }
});

test('a new line with the next number is added; gaps and new keys are ignored', () => {
  const people = { ardi: { lines: [['One.'], ['Two.']], hints: ['A hint.'], heart: { 2: 'Hi.' } } };
  const add = `[PEOPLE.ardi]\nlines.3.1 = Three.\nlines.3.2 = Three again.\nlines.2.2 = Two again.\nlines.9.1 = Too far.\nhints.2 = Another hint.\nheart.4 = Not a key yet.\nlines.1.1.1 = Too deep.`;
  const out = applyWords(people, parseWords(add).PEOPLE).ardi;
  assert.deepEqual(out.lines, [['One.'], ['Two.', 'Two again.'], ['Three.', 'Three again.']]);
  assert.deepEqual(out.hints, ['A hint.', 'Another hint.']);
  assert.deepEqual(out.heart, { 2: 'Hi.' });
  assert.deepEqual(people.ardi.lines, [['One.'], ['Two.']], 'source tables are not mutated');
});
