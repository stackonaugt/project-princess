import { TYPES } from '../src/data/types.js';
import { MOVE_ANIMATIONS } from '../src/data/move-animations.js';
import { createBattleEffectTextures, playBattleAnimation } from '../src/systems/battle-animations.js';
import { element } from './utils.js';

class MovePreviewScene extends Phaser.Scene {
  constructor(onReady) {
    super('MoveAnimationPreview');
    this.onReady = onReady;
    this.silentPreview = true;
  }

  create() {
    createBattleEffectTextures(this);
    this.drawSampleActors();
    this.bg = this.add.graphics().setDepth(0);
    this.userSprite = this.add.image(0, 0, 'studio-preview-user').setOrigin(0.5, 1).setDepth(10);
    this.targetSprite = this.add.image(0, 0, 'studio-preview-target').setOrigin(0.5, 1).setDepth(9);
    this.user = { side: 'mine' };
    this.target = { side: 'foe' };
    this.scale.on('resize', this.layout, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.layout, this));
    this.layout();
    this.onReady();
  }

  drawSampleActors() {
    const pet = this.make.graphics({ add: false });
    pet.fillStyle(0x29243b); pet.fillEllipse(16, 28, 25, 6);
    pet.fillStyle(0xc27642); pet.fillTriangle(5, 13, 8, 1, 15, 11); pet.fillTriangle(17, 11, 24, 1, 27, 14);
    pet.fillStyle(0xc27642); pet.fillEllipse(16, 18, 23, 20);
    pet.fillStyle(0xf0c9a1); pet.fillEllipse(16, 22, 13, 8);
    pet.fillStyle(0x242330); pet.fillRect(10, 15, 2, 3); pet.fillRect(20, 15, 2, 3);
    pet.fillStyle(0xe77fb8); pet.fillTriangle(14, 20, 18, 20, 16, 22);
    pet.generateTexture('studio-preview-user', 32, 32); pet.destroy();

    const foe = this.make.graphics({ add: false });
    foe.fillStyle(0x29243b); foe.fillEllipse(16, 28, 25, 6);
    foe.fillStyle(0x638a55); foe.fillTriangle(7, 13, 10, 2, 16, 12); foe.fillTriangle(16, 12, 23, 2, 26, 14);
    foe.fillStyle(0x638a55); foe.fillEllipse(16, 18, 24, 20);
    foe.fillStyle(0xb9d294); foe.fillEllipse(16, 23, 14, 8);
    foe.fillStyle(0x242330); foe.fillRect(10, 15, 2, 3); foe.fillRect(20, 15, 2, 3);
    foe.fillStyle(0xe7c66d); foe.fillTriangle(14, 20, 18, 20, 16, 22);
    foe.generateTexture('studio-preview-target', 32, 32); foe.destroy();
  }

  layout() {
    const width = this.scale.width, height = this.scale.height;
    this.unit = Math.max(2, Math.min(5, Math.floor(Math.min(width / 100, height / 52))));
    this.userPosition = { x: Math.round(width * 0.27), y: Math.round(height * 0.84) };
    this.targetPosition = { x: Math.round(width * 0.74), y: Math.round(height * 0.65) };
    this.bg.clear();
    this.bg.fillGradientStyle(0x85bfda, 0x85bfda, 0xcbe3dc, 0xcbe3dc, 1);
    this.bg.fillRect(0, 0, width, height * 0.44);
    this.bg.fillStyle(0x83ae59, 1); this.bg.fillRect(0, height * 0.44, width, height * 0.56);
    this.bg.fillStyle(0x739b4c, 1);
    this.bg.fillEllipse(this.targetPosition.x, this.targetPosition.y - this.unit, 34 * this.unit, 7 * this.unit);
    this.bg.fillEllipse(this.userPosition.x, this.userPosition.y - this.unit, 38 * this.unit, 8 * this.unit);
    if (!this.animating) this.resetActors();
  }

  resetActors() {
    if (!this.userSprite || !this.targetSprite) return;
    for (const sprite of [this.userSprite, this.targetSprite]) {
      this.tweens.killTweensOf(sprite);
      sprite.setAlpha(1).clearTint().setAngle(0).setScale(this.unit);
    }
    this.userSprite.setPosition(this.userPosition.x, this.userPosition.y);
    this.targetSprite.setPosition(this.targetPosition.x, this.targetPosition.y);
  }

  sprOf(fighter) { return fighter.side === 'foe' ? this.targetSprite : this.userSprite; }
  mid(sprite) { return { x: sprite.x, y: sprite.y - sprite.displayHeight / 2 }; }
  tw(targets, props) { return new Promise(resolve => this.tweens.add({ targets, ...props, onComplete: resolve })); }
  wait(ms) { return new Promise(resolve => this.time.delayedCall(ms, resolve)); }
  burst(x, y, colour, count = 10, { key = 'bt-dot', spread = 30, rise = 0, scale = 1, dur = 500 } = {}) {
    const size = this.unit / 4;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = (0.4 + Math.random() * 0.6) * spread * size;
      const particle = this.add.image(x, y, key).setTint(colour).setDepth(30).setScale(scale * size * (0.6 + Math.random() * 0.6));
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance - rise * size,
        alpha: 0,
        duration: dur + Math.random() * 200,
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  async preview(animation, type) {
    const safeType = Object.hasOwn(TYPES, type) ? type : 'fairy';
    try {
      await playBattleAnimation(this, animation, this.user, this.target, safeType, true);
    } finally {
      this.animating = false;
      this.resetActors();
    }
  }
}

export function mountMovePreview(container, initialAnimation, initialType) {
  const preview = element('section', { className: 'studio-move-preview', 'aria-label': 'Move animation preview' });
  const heading = element('div', { className: 'studio-move-preview-heading' }, [
    element('div', {}, [
      element('h4', { text: 'Animation preview' }),
      element('p', { text: 'Sample actors only. Previewing does not start a battle or save changes.' }),
    ]),
  ]);
  const stage = element('div', { className: 'studio-move-preview-stage', 'data-testid': 'move-animation-preview' });
  const controls = element('div', { className: 'studio-move-preview-controls' });
  const status = element('p', { className: 'studio-move-preview-status', role: 'status', 'aria-live': 'polite' });
  const playButton = element('button', {
    className: 'studio-button',
    type: 'button',
    text: 'Play preview',
    'data-testid': 'play-move-animation',
    disabled: true,
  });
  controls.append(playButton, status);
  preview.append(heading, stage, controls);
  container.append(preview);

  let animation = initialAnimation, type = initialType, activeAnimation = initialAnimation;
  let ready = false, running = false, disposed = false;
  const isSupported = () => MOVE_ANIMATIONS.includes(animation);
  const updateStatus = () => {
    if (running) {
      status.textContent = `Playing ${activeAnimation} animation…`;
      status.classList.remove('is-error');
    } else if (!isSupported()) {
      const display = animation === '' || animation == null ? '(empty)' : String(animation);
      status.textContent = `Unsupported animation “${display}”. Choose a supported animation before saving.`;
      status.classList.add('is-error');
    } else {
      status.textContent = ready ? `Ready to preview: ${animation}.` : 'Preparing sample actors…';
      status.classList.remove('is-error');
    }
    playButton.textContent = running ? 'Playing…' : 'Play preview';
    playButton.disabled = !ready || running || !isSupported();
  };
  updateStatus();

  if (!window.Phaser) {
    status.textContent = 'The animation preview engine could not be loaded.';
    status.classList.add('is-error');
    return { update: () => {}, destroy: () => preview.remove() };
  }

  let game;
  try {
    const scene = new MovePreviewScene(() => {
      ready = true;
      updateStatus();
    });
    game = new Phaser.Game({
      type: Phaser.CANVAS,
      parent: stage,
      backgroundColor: '#cbe3dc',
      pixelArt: true,
      roundPixels: true,
      scale: { mode: Phaser.Scale.RESIZE, width: 480, height: 220 },
      audio: { noAudio: true },
      scene,
    });
    playButton.onclick = async () => {
      if (!ready || running || !isSupported()) return;
      running = true;
      activeAnimation = animation;
      updateStatus();
      try {
        await scene.preview(animation, type);
      } catch (error) {
        console.error('Move animation preview failed:', error);
        status.textContent = `Preview failed: ${error.message}`;
        status.classList.add('is-error');
      } finally {
        running = false;
        if (!disposed) updateStatus();
      }
    };
  } catch (error) {
    status.textContent = `The animation preview could not start: ${error.message}`;
    status.classList.add('is-error');
  }

  return {
    update(nextAnimation, nextType) {
      animation = nextAnimation;
      type = nextType;
      updateStatus();
    },
    destroy() {
      disposed = true;
      if (game) game.destroy(true);
      preview.remove();
    },
  };
}
