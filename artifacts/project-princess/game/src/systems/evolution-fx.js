// The Pokémon-style evolution sequence, shared by battles and the world.
// The pet glows white, its old and new silhouettes flicker faster and faster,
// a burst of light, then the new form fades in to a fanfare. About 4.5 s.
//
//   await playEvolution(scene, sprite, { from, to, reveal })
//
// `from` and `to` are texture keys (`to` falls back to `from` when a pet has
// no evolved art). `reveal()` is called at the burst: evolve the pet and swap
// the real sprite to its new form there. Callers block input while it plays.

import { sfx } from './sfx.js';

export const EVOLUTION_TIMING = Object.freeze({ glow: 700, flickerStart: 340, flickerEnd: 45, flickerRatio: 0.8, finalFlickers: 8, burst: 260, reveal: 1100 });

// Flicker intervals: each swap a little quicker, then a quick final run.
export function flickerSchedule(t = EVOLUTION_TIMING) {
  const out = [];
  for (let ms = t.flickerStart; ms > t.flickerEnd; ms *= t.flickerRatio) out.push(Math.round(ms));
  for (let i = 0; i < t.finalFlickers; i++) out.push(t.flickerEnd);
  return out;
}

function ensureTextures(scene) {
  if (!scene.textures.exists('evo-glow')) {
    const c = scene.textures.createCanvas('evo-glow', 64, 64), x = c.getContext();
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,250,215,0.7)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64); c.refresh();
  }
  if (!scene.textures.exists('evo-spark')) {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(0xffffff); g.fillRect(3, 0, 1, 7); g.fillRect(0, 3, 7, 1); g.fillRect(2, 2, 3, 3);
    g.generateTexture('evo-spark', 7, 7); g.destroy();
  }
}

export async function playEvolution(scene, spr, { from, to, reveal, depth = 30 } = {}) {
  ensureTextures(scene);
  const T = EVOLUTION_TIMING;
  const wait = ms => new Promise(r => scene.time.delayedCall(ms, r));
  const tw = (targets, props) => new Promise(r => scene.tweens.add({ targets, ...props, onComplete: () => r() }));
  const target = to && scene.textures.exists(to) ? to : from || spr.texture.key;
  const source = from && scene.textures.exists(from) ? from : spr.texture.key;
  const size = Math.max(spr.displayHeight, spr.displayWidth, 8);
  const mid = () => ({ x: spr.x, y: spr.y - spr.displayHeight * spr.originY + spr.displayHeight / 2 });
  const made = [];
  const keep = o => (made.push(o), o);
  // The white silhouette sits exactly over the pet.
  const sil = keep(scene.add.image(spr.x, spr.y, source, 0).setOrigin(spr.originX, spr.originY)
    .setScale(spr.scaleX, spr.scaleY).setFlipX(spr.flipX).setTintFill(0xffffff).setAlpha(0).setDepth(depth + 1));
  const scaleOf = {};
  scaleOf[source] = spr.scaleY;
  // Keep the same height for both forms while they flicker.
  const fit = key => {
    const f = scene.textures.getFrame(key, 0) || scene.textures.getFrame(key);
    const base = scene.textures.getFrame(source, 0) || scene.textures.getFrame(source);
    return f && base ? spr.scaleY * base.height / f.height : spr.scaleY;
  };
  scaleOf[target] = fit(target);
  const halo = keep(scene.add.image(mid().x, mid().y, 'evo-glow').setDepth(depth).setScale(0).setAlpha(0.75).setBlendMode('ADD'));
  const spark = (x, y, tint = 0xffffff) => keep(scene.add.image(x, y, 'evo-spark').setDepth(depth + 2).setTint(tint).setScale(size / 28));
  try {
    // 1. Glow: the pet whitens and a halo swells behind it.
    sfx.evolveStart();
    scene.tweens.add({ targets: halo, scale: size * 2.1 / 64, duration: T.glow, ease: 'Sine.easeOut' });
    await tw(sil, { alpha: 1, duration: T.glow, ease: 'Sine.easeIn' });
    spr.setVisible(false);

    // 2. Flicker: old and new silhouettes, faster and faster, sparkles drawn in.
    const schedule = flickerSchedule(T);
    sfx.evolveShimmer(schedule.reduce((a, b) => a + b, 0) / 1000 + 0.15);
    const pulse = scene.tweens.add({ targets: halo, alpha: { from: 0.45, to: 0.85 }, duration: 180, yoyo: true, repeat: -1 });
    for (let i = 0; i < schedule.length; i++) {
      const key = i % 2 ? source : target;
      sil.setTexture(key, 0).setScale(spr.scaleX / spr.scaleY * scaleOf[key], scaleOf[key]);
      if (i % 2 === 0) {
        const m = mid(), a = Math.random() * Math.PI * 2, r = size * (0.9 + Math.random() * 0.5);
        const s = spark(m.x + Math.cos(a) * r, m.y + Math.sin(a) * r, i % 4 ? 0xfff2a8 : 0xffffff);
        scene.tweens.add({ targets: s, x: m.x, y: m.y, alpha: 0.2, angle: 180, duration: 420, ease: 'Quad.easeIn', onComplete: () => s.destroy() });
      }
      await wait(schedule[i]);
    }
    pulse.remove();

    // 3. Burst: flash, an expanding ring of light and sparkles flying out.
    sfx.evolveBurst();
    if (!scene.silentPreview) scene.cameras.main.flash(380, 255, 255, 255);
    reveal?.();
    spr.setVisible(false);
    const m = mid();
    sil.setTexture(spr.texture.key, 0).setOrigin(spr.originX, spr.originY).setScale(spr.scaleX, spr.scaleY).setFlipX(spr.flipX).setPosition(spr.x, spr.y).setAlpha(1);
    scene.tweens.add({ targets: halo, scale: size * 6 / 64, alpha: 0, duration: 600, ease: 'Quad.easeOut' });
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * Math.PI * 2, s = spark(m.x, m.y, [0xffffff, 0xfff2a8, 0xa8e8ff, 0xffc8e8][i % 4]);
      const d = size * (1.4 + Math.random() * 1.2);
      scene.tweens.add({ targets: s, x: m.x + Math.cos(a) * d, y: m.y + Math.sin(a) * d * 0.8, alpha: 0, angle: 360, duration: 700 + Math.random() * 250, ease: 'Quad.easeOut', onComplete: () => s.destroy() });
    }
    await wait(T.burst);

    // 4. Reveal: the white melts away, the new form pops, fanfare.
    spr.setVisible(true);
    sfx.evolveFanfare();
    const sx = spr.scaleX, sy = spr.scaleY;
    scene.tweens.add({ targets: spr, scaleX: sx * 1.18, scaleY: sy * 1.18, duration: 160, yoyo: true, ease: 'Quad.easeOut', onComplete: () => spr.setScale(sx, sy) });
    scene.tweens.add({ targets: sil, scaleX: sil.scaleX * 1.18, scaleY: sil.scaleY * 1.18, duration: 160, yoyo: true, ease: 'Quad.easeOut' });
    await tw(sil, { alpha: 0, duration: 520, ease: 'Sine.easeOut' });
    for (let i = 0; i < 6; i++) {
      const p = mid(), s = spark(p.x + (Math.random() - 0.5) * size * 1.4, p.y + (Math.random() - 0.5) * size, 0xfff2a8).setScale(0);
      scene.tweens.add({ targets: s, scale: size / 22, duration: 180, delay: i * 70, yoyo: true, onComplete: () => s.destroy() });
    }
    await wait(T.reveal - 520);
  } finally {
    spr.setVisible(true);
    for (const o of made) if (o.active) o.destroy();
  }
}
