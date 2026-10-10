import test from 'node:test';
import assert from 'node:assert/strict';
import { state } from '../game/src/systems/state.js';
import { formText } from '../game/src/systems/forms.js';

test('pet dialogue keeps its base name before evolution and uses the current name afterward', () => {
  const record = state.pet('spooky');
  const wasEvolved = record.evolved;
  try {
    record.evolved = false;
    assert.equal(formText('spooky', "Spooky nudges your hand. Spooky's ears twitch."),
      "Spooky nudges your hand. Spooky's ears twitch.");

    record.evolved = true;
    assert.equal(formText('spooky', "Spooky nudges your hand. Spooky's ears twitch."),
      "Ghost nudges your hand. Ghost's ears twitch.");
    assert.equal(formText('spooky', 'You give Spooky a carrot.'),
      'You give Ghost a carrot.');
  } finally {
    record.evolved = wasEvolved;
  }
});

test('pet text without the base-form name is left intact', () => {
  const record = state.pet('spooky');
  const wasEvolved = record.evolved;
  try {
    record.evolved = true;
    assert.equal(formText('spooky', 'Raindrops pass straight through her.'), 'Raindrops pass straight through her.');
  } finally {
    record.evolved = wasEvolved;
  }
});
