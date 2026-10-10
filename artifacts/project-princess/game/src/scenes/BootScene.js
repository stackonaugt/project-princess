// Loads any custom sprite art listed in assets/sprites/manifest.json, then
// builds the built-in textures for everything else.
import { ART_PATH } from '../config.js';
import { queueCustomArt, buildTextures, runtimeArtStatus } from '../art/textures.js';
import { state, SLOT_COUNT } from '../systems/state.js';
import { showTitle } from '../ui/title.js';
import { resumeSlot } from '../systems/browser-resume.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    this.load.json('manifest', `${ART_PATH}manifest.json?v=${Date.now()}`);
  }

  create() {
    const m = this.cache.json.get('manifest');
    const files = Array.isArray(m) ? m : (m && Array.isArray(m.files) ? m.files : []);
    if (!queueCustomArt(this, files)) return this.finish();
    this.load.once('complete', () => this.finish());
    this.load.start();
  }

  async finish() {
    buildTextures(this);
    for (const failure of runtimeArtStatus(this).failures) console.error(failure);
    document.getElementById('loading')?.classList.add('done');
    const loading = document.getElementById('loading');
    if (loading) { loading.hidden = true; loading.setAttribute('aria-hidden', 'true'); }
    // ?slot=2 in the address skips the title screen (handy for testing)
    const asked = +new URLSearchParams(location.search).get('slot');
    const returning = resumeSlot();
    const slot = asked >= 1 && asked <= SLOT_COUNT ? asked :
      returning && state.slots()[returning - 1] ? returning : await showTitle(this);
    state.useSlot(slot);
    this.scene.start('World', { region: state.data.region, firstLoad: true });
  }
}
