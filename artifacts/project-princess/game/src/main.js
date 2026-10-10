// Entry point. Loads the save, wires up the interface, starts Phaser.
import { state } from './systems/state.js';
import { controls } from './systems/controls.js';
import { ui } from './ui/ui.js';
import { bus } from './bus.js';
import { BootScene } from './scenes/BootScene.js';
import { WorldScene } from './scenes/WorldScene.js';
import { ActivityScene } from './scenes/ActivityScene.js';
import { BattleScene } from './scenes/BattleScene.js';
import { runtimeArtStatus } from './art/textures.js';
import { rememberResume, clearResume } from './systems/browser-resume.js';

state.migrateToSlots();
controls.init();
// Do not allow double-tapping game buttons to magnify the browser viewport.
// Text panels still scroll; the phone map handles its own pinch gestures.
document.addEventListener('dblclick', event => {
  if (event.target.closest('button, #joyZone, #game, #dialog')) event.preventDefault();
}, { passive: false });
document.addEventListener('gesturestart', event => event.preventDefault(), { passive: false });
ui.init();

// Delete this slot and go back to the title screen.
bus.on('game:reset', () => {
  window.__ppResetting = true;
  clearResume();
  state.reset();
  location.reload();
});
// Save and go back to the title screen.
bus.on('game:title', () => {
  bus.emit('game:save');
  window.__ppResetting = true;
  clearResume();
  location.reload();
});

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#1f3a29',
  pixelArt: true,
  roundPixels: true,
  scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
  physics: { default: 'arcade', arcade: { debug: false } },
  input: { activePointers: 3 },
  audio: { noAudio: true },  // sound effects are synthesised in src/systems/sfx.js
  scene: [BootScene, WorldScene, BattleScene, ActivityScene],
});

const saveForReturn = () => {
  if (window.__ppResetting) return;
  bus.emit('game:save');
  rememberResume(state.slot);
};
window.addEventListener('pagehide', saveForReturn);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) saveForReturn();
  else { controls.release(); game.scale.refresh(); }
});
window.addEventListener('pageshow', () => { controls.release(); game.scale.refresh(); });

// Handy in the browser console: __pp.state.data
window.__pp = { game, state, bus, ui, artworkStatus: () => runtimeArtStatus(game.scene.getScene('Boot')) };
