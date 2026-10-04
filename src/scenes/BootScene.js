// Loads any custom sprite art listed in assets/sprites/manifest.json, then
// builds the built-in textures for everything else.
import { ART_PATH } from '../config.js';
import { queueCustomArt, buildTextures } from '../art/textures.js';
import { state } from '../systems/state.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    this.load.json('manifest', `${ART_PATH}manifest.json?v=${Date.now()}`);
  }

  create() {
    const m = this.cache.json.get('manifest');
    const files = Array.isArray(m) ? m : (m && Array.isArray(m.files) ? m.files : []);
    if (!files.length) return this.finish();
    queueCustomArt(this, files);
    this.load.once('complete', () => this.finish());
    this.load.start();
  }

  finish() {
    buildTextures(this);
    document.getElementById('loading')?.classList.add('done');
    this.scene.start('World', { region: state.data.region, firstLoad: true });
  }
}
