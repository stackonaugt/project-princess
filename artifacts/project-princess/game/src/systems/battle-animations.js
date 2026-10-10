import { TYPES } from '../data/types.js';
import { MOVE_ANIMATIONS } from '../data/move-animations.js';
import { objectTexture } from '../art/textures.js';

const hex = colour => parseInt(colour.slice(1), 16);

export { MOVE_ANIMATIONS };

export function createBattleEffectTextures(scene) {
  if (scene.textures.exists('bt-dot')) return;
  const g = scene.make.graphics({ add: false });
  g.fillStyle(0xffffff); g.fillCircle(4, 4, 4); g.generateTexture('bt-dot', 8, 8); g.clear();
  g.fillStyle(0xffffff); g.fillRect(0, 0, 3, 20); g.generateTexture('bt-slash', 3, 20); g.clear();
  g.lineStyle(3, 0xffffff); g.strokeCircle(16, 16, 13); g.generateTexture('bt-ring', 32, 32); g.clear();
  g.fillStyle(0xffffff); g.fillRect(3, 0, 2, 8); g.fillRect(0, 3, 8, 2); g.generateTexture('bt-star', 8, 8); g.clear();
  g.fillStyle(0xffffff); g.fillCircle(6, 10, 6); g.fillCircle(13, 7, 7); g.fillCircle(19, 11, 5); g.generateTexture('bt-cloud', 26, 18); g.clear();
  g.fillStyle(0xffffff); g.fillTriangle(0, 0, 12, 0, 6, 12); g.generateTexture('bt-fang', 12, 12);
  g.destroy();
}

export async function playBattleAnimation(scene, anim, user, target, type, hit, soundEffects = null) {
  const us = scene.sprOf(user), ts = scene.sprOf(target), u = scene.unit;
  const c = hex(TYPES[type]?.colour || '#f4f0ea'), dir = user.side === 'mine' ? 1 : -1;
  const ux = us.x, uy = us.y, tm = scene.mid(ts), um = scene.mid(us);
  const sound = name => soundEffects?.[name]?.();
  scene.animating = true;
  try {
  switch (anim) {
    case 'lunge': {
      sound('whoosh');
      await scene.tw(us, { x: ux + (ts.x - ux) * 0.45, y: uy + (ts.y - uy) * 0.45, duration: 170, ease: 'Quad.easeIn' });
      scene.burst(tm.x, tm.y, c, 8);
      await scene.tw(us, { x: ux, y: uy, duration: 220, ease: 'Quad.easeOut' });
      break;
    }
    case 'hop': {
      sound('whoosh');
      await scene.tw(us, { x: ux + (ts.x - ux) * 0.5, y: uy + (ts.y - uy) * 0.5 - 18 * u, duration: 220, ease: 'Quad.easeOut' });
      await scene.tw(us, { x: ts.x - dir * 6 * u, y: ts.y, duration: 160, ease: 'Quad.easeIn' });
      scene.burst(tm.x, ts.y - 2 * u, c, 10);
      await scene.tw(us, { x: ux, y: uy, duration: 320, ease: 'Sine.easeInOut' });
      break;
    }
    case 'bite': {
      await scene.tw(us, { x: ux + dir * 6 * u, duration: 120, yoyo: true });
      const top = scene.add.image(tm.x, tm.y - 8 * u, 'bt-fang').setDepth(30).setScale(u / 2.5);
      const bot = scene.add.image(tm.x, tm.y + 8 * u, 'bt-fang').setDepth(30).setScale(u / 2.5).setFlipY(true);
      sound('hit');
      await Promise.all([
        scene.tw(top, { y: tm.y - u, duration: 140, ease: 'Quad.easeIn' }),
        scene.tw(bot, { y: tm.y + u, duration: 140, ease: 'Quad.easeIn' }),
      ]);
      scene.burst(tm.x, tm.y, c, 6);
      await scene.tw([top, bot], { alpha: 0, duration: 160 });
      top.destroy(); bot.destroy();
      break;
    }
    case 'claw': {
      for (let i = 0; i < 3; i++) {
        const s = scene.add.image(tm.x + (i - 1) * 4 * u, tm.y, 'bt-slash').setDepth(30).setAngle(-30 * dir).setTint(i === 1 ? c : 0xffffff).setScale(u / 3, 0);
        sound('whoosh');
        scene.tweens.add({ targets: s, scaleY: u / 1.6, duration: 90, onComplete: () => scene.tweens.add({ targets: s, alpha: 0, duration: 220, onComplete: () => s.destroy() }) });
        await scene.wait(90);
      }
      await scene.wait(120);
      break;
    }
    case 'beam': {
      for (let i = 0; i < 6; i++) {
        const r = scene.add.image(um.x, um.y, 'bt-ring').setDepth(30).setTint(c).setScale(u / 6);
        scene.tweens.add({ targets: r, x: tm.x, y: tm.y, scale: u / 2.5, alpha: 0.2, duration: 420, ease: 'Sine.easeIn', onComplete: () => r.destroy() });
        sound('blip');
        await scene.wait(70);
      }
      await scene.wait(380);
      ts.setTint(c); await scene.wait(140); ts.clearTint();
      break;
    }
    case 'shout': {
      sound('yap');
      scene.tweens.add({ targets: us, scaleY: us.scaleY * 1.15, scaleX: us.scaleX * 0.92, duration: 110, yoyo: true, repeat: 1 });
      for (let i = 0; i < 3; i++) {
        const r = scene.add.image(um.x + dir * 6 * u, um.y - 2 * u, 'bt-ring').setDepth(30).setTint(c).setScale(u / 8);
        scene.tweens.add({ targets: r, scale: u / 1.6, alpha: 0, x: r.x + dir * 14 * u, duration: 520, onComplete: () => r.destroy() });
        await scene.wait(120);
      }
      await scene.wait(260);
      break;
    }
    case 'bed':
    case 'burnbed': {
      const bed = scene.add.image(ux + dir * 9 * u, uy, objectTexture(scene, {kind:'petbed',v:'blue'}))
        .setOrigin(.5, 1).setDisplaySize(28 * u, 12 * u).setDepth(us.depth - 1);
      try {
        sound('whoosh');
        await scene.tw(us, { x: ux + dir * 8 * u, duration: 250, ease: 'Sine.easeInOut' });
        await scene.tw(us, { x: ux + dir * 11 * u, y: uy - 3 * u, angle: -7 * dir, duration: 150, yoyo: true, repeat: 4, ease: 'Sine.easeInOut' });
        if (anim === 'burnbed') {
          for (let i = 0; i < 14; i++) {
            const flame = scene.add.image(bed.x + (Math.random() - .5) * 20 * u, uy - 3 * u, 'bt-dot')
              .setTint(i % 2 ? 0xf5b43c : 0xeb6430).setDepth(us.depth + 1).setScale(u / 2);
            scene.tweens.add({targets:flame,y:uy - 23 * u,alpha:0,duration:550,delay:i*30,onComplete:()=>flame.destroy()});
          }
          await scene.wait(650);
        }
        await scene.tw(us, { x: ux, y: uy, angle: 0, duration: 250, ease: 'Sine.easeInOut' });
      } finally { bed.destroy(); us.setAngle(0); }
      // Retain the healing particles after the physical bed animation.
    }
    case 'heal': {
      sound('healUp');
      for (let i = 0; i < 12; i++) {
        const p = scene.add.image(um.x + (Math.random() - 0.5) * 16 * u, us.y - Math.random() * 6 * u, i % 3 ? 'bt-star' : 'bt-dot').setDepth(30).setTint(i % 2 ? 0x8af08a : 0xffffff).setScale(u / 3);
        scene.tweens.add({ targets: p, y: p.y - (10 + Math.random() * 10) * u, alpha: 0, duration: 700, delay: i * 40, onComplete: () => p.destroy() });
      }
      us.setTint(0xb8ffb8); await scene.wait(420); us.clearTint(); await scene.wait(200);
      break;
    }
    case 'fade': {
      sound('whoosh');
      await scene.tw(us, { alpha: 0.25, duration: 380 });
      break;
    }
    case 'dig': {
      scene.burst(ux, uy - u, 0x8a6a4a, 10, { rise: 10 });
      await scene.tw(us, { y: uy + 8 * u, alpha: 0, duration: 260, ease: 'Quad.easeIn' });
      await scene.wait(200);
      scene.burst(ts.x, ts.y - u, 0x8a6a4a, 14, { rise: 20, spread: 40 });
      if (!scene.silentPreview) scene.cameras.main.shake(160, 0.008);
      await scene.tw(ts, { y: ts.y - 5 * u, duration: 120, yoyo: true, ease: 'Quad.easeOut' });
      us.setY(uy - 6 * u);
      await scene.tw(us, { y: uy, alpha: 1, duration: 260, ease: 'Bounce.easeOut' });
      break;
    }
    case 'gust': {
      sound('whoosh');
      for (let i = 0; i < 7; i++) {
        const s = scene.add.image(um.x, tm.y + (Math.random() - 0.5) * 12 * u, 'bt-slash').setDepth(30).setAngle(90).setTint(i % 2 ? c : 0xffffff).setAlpha(0.85).setScale(u / 4, u / 2);
        scene.tweens.add({ targets: s, x: tm.x + dir * 20 * u, alpha: 0, duration: 380, delay: i * 50, onComplete: () => s.destroy() });
      }
      await scene.wait(300);
      await scene.tw(ts, { angle: 8 * dir, duration: 80, yoyo: true, repeat: 1 });
      break;
    }
    case 'stink': {
      for (let i = 0; i < 7; i++) {
        const p = scene.add.image(tm.x + (Math.random() - 0.5) * 16 * u, tm.y + (Math.random() - 0.3) * 10 * u, 'bt-cloud').setDepth(30).setTint(i % 2 ? 0x9ac040 : c).setAlpha(0).setScale(u / 6);
        scene.tweens.add({ targets: p, alpha: 0.85, scale: u / 3, y: p.y - 6 * u, duration: 380, delay: i * 70, yoyo: true, hold: 200, onComplete: () => p.destroy() });
      }
      sound('weakHit');
      await scene.wait(900);
      break;
    }
    case 'flame': {
      for (let i = 0; i < 16; i++) {
        const p = scene.add.image(tm.x + (Math.random() - 0.5) * 14 * u, ts.y - Math.random() * 4 * u, 'bt-dot').setDepth(30).setTint([0xf0a030, 0xe85030, 0xf8e070][i % 3]).setScale(u / 3);
        scene.tweens.add({ targets: p, y: p.y - (10 + Math.random() * 14) * u, scale: 0.2, alpha: 0, duration: 600, delay: i * 30, onComplete: () => p.destroy() });
      }
      sound('whoosh');
      await scene.wait(700);
      break;
    }
    default: await scene.wait(200);
  }
  } finally {
    scene.animating = false;
    scene.layout?.();
  }
}
