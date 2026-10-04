// Entry point. Loads the save, wires up the interface, starts Phaser.
import { state } from './systems/state.js';
import { controls } from './systems/controls.js';
import { ui } from './ui/ui.js';
import { bus } from './bus.js';
import { BootScene } from './scenes/BootScene.js';
import { WorldScene } from './scenes/WorldScene.js';
import { BattleScene } from './scenes/BattleScene.js';

state.migrateToSlots();
controls.init();
ui.init();

// Delete this slot and go back to the title screen.
bus.on('game:reset', () => {
  window.__ppResetting = true;
  state.reset();
  location.reload();
});
// Save and go back to the title screen.
bus.on('game:title', () => {
  bus.emit('game:save');
  window.__ppResetting = true;
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
  scene: [BootScene, WorldScene, BattleScene],
});

window.addEventListener('pagehide', () => bus.emit('game:save'));
document.addEventListener('visibilitychange', () => { if (document.hidden) bus.emit('game:save'); });

// Handy in the browser console: __pp.state.data
window.__pp = { game, state, bus };
