import { TYPES } from '../data/types.js';
import { MOVE_ANIMATIONS, ANIMATION_POSES } from '../data/move-animations.js';
import { ANIMATION_LAYOUTS, animationFrames } from '../data/animation-layouts.js';
import { objectTexture, frameCount } from '../art/textures.js';

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
  g.fillStyle(0xffffff); g.fillTriangle(0, 0, 12, 0, 6, 12); g.generateTexture('bt-fang', 12, 12); g.clear();
  g.fillStyle(0xffffff); g.fillCircle(3, 3, 3); g.fillCircle(8, 3, 3); g.fillTriangle(0, 4, 11, 4, 5.5, 10); g.generateTexture('bt-heart', 11, 10);
  g.destroy();
}

// Cycle a pet's sheet action (walk, jump, paw) while a routine plays. Sprites
// without an action sheet (foes, people, Studio samples) are left alone.
// Returns a function that stops it and puts the pet back on its idle frame.
export function poseFrames(scene, spr, action) {
  const key = spr?.texture?.key;
  if (!action || !key || !ANIMATION_LAYOUTS[key] || !scene.textures?.exists(key)) return [];
  return animationFrames(key, frameCount(scene, key), action);
}
function startPose(scene, spr, action, rate = 10) {
  const frames = poseFrames(scene, spr, action);
  if (!frames.length) return () => {};
  let i = 0;
  spr.setFrame(frames[0]);
  const timer = scene.time.addEvent({ delay: 1000 / rate, loop: true, callback: () => { i = (i + 1) % frames.length; spr.setFrame(frames[i]); } });
  return () => { timer.remove(); if (spr.texture?.has?.(0)) spr.setFrame(0); };
}
// Little puffs of dust where a pet drags or skids along the ground.
function dust(scene, x, y, u, colour = 0xb59a74) {
  for (let i = 0; i < 3; i++) {
    const p = scene.add.image(x + (Math.random() - .5) * 3 * u, y - Math.random() * u, 'bt-cloud').setDepth(29).setTint(colour).setAlpha(.8).setScale(u / 10);
    scene.tweens.add({ targets: p, x: p.x + (Math.random() - .5) * 6 * u, y: p.y - (2 + Math.random() * 3) * u, scale: u / 5, alpha: 0, duration: 420, onComplete: () => p.destroy() });
  }
}
// The green sparkles of getting energy back.
function sparkle(scene, spr, u, n = 10) {
  const m = scene.mid(spr);
  for (let i = 0; i < n; i++) {
    const p = scene.add.image(m.x + (Math.random() - 0.5) * 16 * u, spr.y - Math.random() * 6 * u, i % 3 ? 'bt-star' : 'bt-dot').setDepth(30).setTint(i % 2 ? 0x8af08a : 0xffffff).setScale(u / 3);
    scene.tweens.add({ targets: p, y: p.y - (10 + Math.random() * 10) * u, alpha: 0, duration: 700, delay: i * 40, onComplete: () => p.destroy() });
  }
}
// Facing: pet sheets face right, so flipX means facing left.
const face = (spr, vx) => { if (vx) spr.setFlipX(vx < 0); };

export async function playBattleAnimation(scene, anim, user, target, type, hit, soundEffects = null) {
  const us = scene.sprOf(user), ts = scene.sprOf(target), u = scene.unit;
  const c = hex(TYPES[type]?.colour || '#f4f0ea'), dir = user.side === 'mine' ? 1 : -1;
  const ux = us.x, uy = us.y, tm = scene.mid(ts), um = scene.mid(us);
  const sound = name => soundEffects?.[name]?.();
  const flip0 = us.flipX, sx0 = us.scaleX, sy0 = us.scaleY, depth0 = us.depth;
  scene.animating = true;
  const stopPose = startPose(scene, us, ANIMATION_POSES[anim]);
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
    case 'scoot': {
      // Sit down, bum on the ground, nose up, and drag along with the front paws.
      sound('scoot');
      const lean = () => (us.flipX ? 1 : -1) * 9;
      await scene.tw(us, { scaleY: sy0 * .76, scaleX: sx0 * 1.08, angle: lean(), duration: 150 });
      const far = ux + (ts.x - ux) * .5;
      for (let i = 1; i <= 6; i++) {
        dust(scene, us.x - dir * 6 * u, uy, u);
        await scene.tw(us, { x: ux + (far - ux) * i / 6, scaleY: sy0 * (i % 2 ? .7 : .78), duration: 120, ease: 'Sine.easeOut' });
      }
      sound('scoot');
      us.setFlipX(!flip0); us.setAngle(lean());
      for (let i = 1; i <= 4; i++) {
        dust(scene, us.x + dir * 6 * u, uy, u);
        await scene.tw(us, { x: far + (ux - far) * i / 4, scaleY: sy0 * (i % 2 ? .7 : .78), duration: 120, ease: 'Sine.easeOut' });
      }
      us.setFlipX(flip0);
      await scene.tw(us, { scaleX: sx0, scaleY: sy0, angle: 0, x: ux, y: uy, duration: 160 });
      sound('healUp'); sparkle(scene, us, u, 8);
      await scene.wait(300);
      break;
    }
    case 'zoomies': {
      // Two mad laps of the pad, then (if it hits) straight into the target.
      sound('zoom');
      const lap = { t: 0 }, rx = 13 * u, ry = 4 * u;
      let lastX = us.x, n = 0;
      await scene.tw(lap, { t: 2, duration: 1000, ease: 'Sine.easeInOut', onUpdate: () => {
        const a = lap.t * Math.PI * 2;
        us.setPosition(ux + Math.sin(a) * rx, uy - (1 - Math.cos(a)) * ry);
        face(us, us.x - lastX); lastX = us.x;
        if (++n % 4 === 0) dust(scene, us.x, us.y, u);
      } });
      us.setFlipX(flip0);
      if (hit) {
        sound('whoosh');
        await scene.tw(us, { x: ts.x - dir * 8 * u, y: ts.y, duration: 170, ease: 'Quad.easeIn' });
        scene.burst(tm.x, tm.y, c, 12);
        if (!scene.silentPreview) scene.cameras.main.shake(140, 0.006);
        await scene.tw(us, { x: ux, y: uy, duration: 280, ease: 'Quad.easeOut' });
      } else await scene.tw(us, { x: ux, y: uy, duration: 120 });
      break;
    }
    case 'herd': {
      // A kelpie rounding up a mob of one: run out wide and circle the target.
      sound('whoosh');
      const sx = ts.x - dir * 16 * u, sy = ts.y;
      await scene.tw(us, { x: sx, y: sy, duration: 280, ease: 'Sine.easeIn' });
      const lap = { t: 0 }, rx = 16 * u, ry = 5 * u;
      let lastX = us.x, n = 0;
      await scene.tw(lap, { t: 1, duration: 800, ease: 'Sine.easeInOut', onUpdate: () => {
        const a = Math.PI + lap.t * Math.PI * 2;
        us.setPosition(ts.x + dir * Math.cos(a) * rx, ts.y - Math.sin(a) * ry);
        us.setDepth(us.y < ts.y ? ts.depth - 1 : Math.max(depth0, ts.depth + 1));
        face(us, us.x - lastX); lastX = us.x;
        if (++n % 5 === 0) dust(scene, us.x, us.y, u);
      } });
      us.setFlipX(flip0);
      sound('yap');
      await scene.tw(ts, { x: ts.x + dir * 3 * u, duration: 90, yoyo: true, repeat: 1 });
      if (hit) scene.burst(tm.x, tm.y, c, 8);
      await scene.tw(us, { x: ux, y: uy, duration: 300, ease: 'Sine.easeOut' });
      us.setDepth(depth0);
      break;
    }
    case 'nap': {
      // Flop down, a few big Zs, wake up refreshed.
      sound('snore');
      await scene.tw(us, { scaleY: sy0 * .72, scaleX: sx0 * 1.1, duration: 240, ease: 'Quad.easeOut' });
      const zs = [];
      for (let i = 0; i < 3; i++) {
        const z = scene.add.text(us.x + dir * (3 + i * 3) * u, us.y - us.displayHeight - i * 2 * u, 'Z', { fontFamily: 'monospace', fontStyle: 'bold', fontSize: `${(3 + i) * u}px`, color: '#ffffff', stroke: '#3a3a5a', strokeThickness: Math.max(2, u / 2) }).setOrigin(.5).setDepth(31).setAlpha(0);
        zs.push(z);
        scene.tweens.add({ targets: z, alpha: 1, y: z.y - 6 * u, x: z.x + dir * 2 * u, duration: 500, delay: i * 260, yoyo: true, hold: 200 });
      }
      await scene.tw(us, { scaleY: sy0 * .66, duration: 420, yoyo: true, repeat: 1, ease: 'Sine.easeInOut' });
      zs.forEach(z => z.destroy());
      await scene.tw(us, { scaleY: sy0 * 1.08, scaleX: sx0, duration: 140, ease: 'Quad.easeOut' });
      await scene.tw(us, { scaleY: sy0, duration: 120 });
      sound('healUp'); sparkle(scene, us, u, 10);
      await scene.wait(350);
      break;
    }
    case 'stare':
    case 'puppyeyes': {
      // Lean in, eyes glint, the target wilts.
      const big = anim === 'puppyeyes' ? 1.1 : 1.05;
      await scene.tw(us, { x: ux + dir * 3 * u, scaleX: sx0 * big, scaleY: sy0 * big, duration: 220, ease: 'Quad.easeOut' });
      const eye = { x: us.x + dir * us.displayWidth * .28, y: us.y - us.displayHeight * .72 };
      const glints = [0, 1].map(i => scene.add.image(eye.x - dir * i * 2.5 * u, eye.y, 'bt-star').setDepth(31).setTint(anim === 'puppyeyes' ? 0xffffff : c).setScale(0));
      sound(anim === 'puppyeyes' ? 'heart' : 'blip');
      await scene.tw(glints, { scale: u / 2.5, angle: 90, duration: 200, yoyo: true, hold: 160 });
      glints.forEach(g => g.destroy());
      if (anim === 'puppyeyes') {
        for (let i = 0; i < 6; i++) {
          const h = scene.add.image(um.x, um.y, 'bt-heart').setDepth(30).setTint(i % 2 ? 0xff8ab8 : 0xffc0d8).setScale(u / 4);
          scene.tweens.add({ targets: h, x: tm.x + (Math.random() - .5) * 10 * u, y: tm.y - Math.random() * 8 * u, alpha: .2, duration: 520, delay: i * 70, ease: 'Sine.easeInOut', onComplete: () => h.destroy() });
        }
        await scene.wait(600);
        ts.setTint(0xffb0d0);
        await scene.tw(ts, { scaleY: ts.scaleY * .9, duration: 160, yoyo: true });
      } else {
        for (let i = 0; i < 3; i++) {
          const r = scene.add.image(eye.x, eye.y, 'bt-ring').setDepth(30).setTint(c).setScale(u / 10).setAlpha(.9);
          scene.tweens.add({ targets: r, x: tm.x, y: tm.y, scale: u / 3, alpha: 0, duration: 380, delay: i * 90, onComplete: () => r.destroy() });
        }
        await scene.wait(420);
        ts.setTint(c);
        const tx = ts.x;
        await scene.tw(ts, { x: tx + u, duration: 40, yoyo: true, repeat: 4 });
        ts.x = tx;
      }
      ts.clearTint();
      await scene.tw(us, { x: ux, scaleX: sx0, scaleY: sy0, duration: 200 });
      break;
    }
    case 'snack': {
      // A snack drops in from above, a leap to catch it, munch munch munch.
      const food = scene.add.image(us.x + dir * 4 * u, -10 * u, 'bt-dot').setDepth(31).setTint(0xe8b860).setScale(u / 2.2);
      const crust = scene.add.image(food.x, food.y, 'bt-dot').setDepth(31).setTint(0xa86a3a).setScale(u / 4);
      const catchY = us.y - us.displayHeight * .8;
      sound('whoosh');
      scene.tweens.add({ targets: [food, crust], y: catchY, duration: 420, ease: 'Quad.easeIn' });
      await scene.wait(240);
      await scene.tw(us, { y: uy - 6 * u, duration: 180, ease: 'Quad.easeOut' });
      food.destroy(); crust.destroy();
      await scene.tw(us, { y: uy, duration: 160, ease: 'Quad.easeIn' });
      for (let i = 0; i < 3; i++) {
        sound('munch');
        scene.burst(us.x + dir * 5 * u, us.y - us.displayHeight * .55, 0xe8c080, 3, { spread: 10, rise: -8, dur: 300 });
        await scene.tw(us, { scaleY: sy0 * .88, scaleX: sx0 * 1.06, duration: 90, yoyo: true });
      }
      sound('healUp'); sparkle(scene, us, u, 10);
      await scene.wait(380);
      break;
    }
    case 'fetch': {
      // A stick sails over, the pet tears after it, bowls through the target and trots back with it.
      const stick = scene.add.image(um.x, um.y - 4 * u, 'bt-slash').setDepth(31).setTint(0x8a5a32).setScale(u / 3, u / 3);
      const land = { x: ts.x + dir * 12 * u, y: ts.y - u };
      sound('whoosh');
      const arc = { t: 0 }, sx = stick.x, sy = stick.y;
      scene.tweens.add({ targets: arc, t: 1, duration: 520, ease: 'Linear', onUpdate: () => {
        stick.setPosition(sx + (land.x - sx) * arc.t, sy + (land.y - sy) * arc.t - Math.sin(arc.t * Math.PI) * 22 * u).setAngle(arc.t * 540);
      } });
      await scene.wait(160);
      await scene.tw(us, { x: ts.x - dir * 4 * u, y: ts.y, duration: 260, ease: 'Quad.easeIn' });
      if (hit) { scene.burst(tm.x, tm.y, c, 10); if (!scene.silentPreview) scene.cameras.main.shake(120, 0.005); }
      await scene.tw(us, { x: land.x, y: land.y + u, duration: 160 });
      stick.setAngle(90 * dir);
      us.setFlipX(!flip0);
      const carry = () => stick.setPosition(us.x - dir * us.displayWidth * .35, us.y - us.displayHeight * .55);
      carry();
      await scene.tw(us, { x: ux, y: uy, duration: 520, ease: 'Sine.easeInOut', onUpdate: carry });
      us.setFlipX(flip0);
      await scene.tw(stick, { alpha: 0, duration: 160 });
      stick.destroy();
      break;
    }
    case 'splash': {
      // Leap high and land with a big splash on (or next to) the target.
      sound('whoosh');
      await scene.tw(us, { x: ux + (ts.x - ux) * .5, y: Math.min(uy, ts.y) - 22 * u, angle: 20 * dir, duration: 300, ease: 'Quad.easeOut' });
      await scene.tw(us, { x: ts.x - dir * 6 * u, y: ts.y, angle: 50 * dir, duration: 200, ease: 'Quad.easeIn' });
      sound('splash');
      const ring = scene.add.image(ts.x - dir * 6 * u, ts.y - u, 'bt-ring').setDepth(29).setTint(0x8ad0f0).setScale(u / 6, u / 16);
      scene.tweens.add({ targets: ring, scaleX: u / 1.4, scaleY: u / 4, alpha: 0, duration: 500, onComplete: () => ring.destroy() });
      for (let i = 0; i < 18; i++) {
        const d = scene.add.image(ts.x - dir * 6 * u, ts.y - 2 * u, 'bt-dot').setDepth(31).setTint(i % 3 ? 0x5ab0e8 : 0xe8f6ff).setScale(u / (4 + Math.random() * 3));
        const vx = (Math.random() - .5) * 30 * u, up = (8 + Math.random() * 14) * u;
        scene.tweens.add({ targets: d, x: d.x + vx, y: d.y - up, duration: 260, ease: 'Quad.easeOut', yoyo: true, onComplete: () => d.destroy() });
      }
      if (hit) ts.setTint(0x8ad0f0);
      await scene.wait(380);
      ts.clearTint();
      us.setAngle(0);
      await scene.tw(us, { x: ux, y: uy, duration: 320, ease: 'Sine.easeInOut' });
      break;
    }
    case 'shake': {
      // A full nose-to-tail shake, flinging bits (mud, water, nerves) at the target.
      sound('shake');
      for (let i = 0; i < 16; i++) {
        const d = scene.add.image(um.x, um.y, i % 4 ? 'bt-dot' : 'bt-star').setDepth(31).setTint(i % 2 ? c : 0xffffff).setScale(u / 4);
        const toward = Math.random() < .7;
        scene.tweens.add({ targets: d, x: toward ? tm.x + (Math.random() - .5) * 14 * u : um.x + (Math.random() - .5) * 24 * u, y: (toward ? tm.y : um.y) + (Math.random() - .5) * 10 * u, alpha: 0, duration: 420, delay: i * 35, ease: 'Quad.easeOut', onComplete: () => d.destroy() });
      }
      await scene.tw(us, { angle: { from: -12, to: 12 }, duration: 55, yoyo: true, repeat: 7, ease: 'Sine.easeInOut' });
      us.setAngle(0);
      await scene.tw(ts, { angle: 6 * dir, duration: 80, yoyo: true, repeat: 1 });
      break;
    }
    case 'string': {
      // A bit of blue string dangles; batting at it is all that matters.
      const top = us.y - us.displayHeight - 14 * u, sx = us.x + dir * 7 * u;
      const line = scene.add.graphics().setDepth(31), swing = { a: 0 };
      const draw = () => {
        const ex = sx + Math.sin(swing.a) * 5 * u, ey = us.y - us.displayHeight * .5;
        line.clear().lineStyle(Math.max(1, u / 2), 0x3a7ae0).beginPath().moveTo(sx, top).lineTo(ex, ey).strokePath();
        line.fillStyle(0x3a7ae0).fillCircle(ex, ey, u * .8);
      };
      draw();
      sound('blip');
      const swingTween = scene.tweens.add({ targets: swing, a: { from: -1, to: 1 }, duration: 260, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', onUpdate: draw });
      for (let i = 0; i < 3; i++) {
        await scene.tw(us, { y: uy - 5 * u, x: ux + dir * 2 * u, duration: 160, ease: 'Quad.easeOut' });
        sound('blip');
        await scene.tw(us, { y: uy, x: ux, duration: 160, ease: 'Quad.easeIn' });
      }
      swingTween.remove(); line.destroy();
      sound('healUp'); sparkle(scene, us, u, 8);
      await scene.wait(300);
      break;
    }
    case 'stretch':
    case 'sharpen': {
      // A long, luxurious stretch (or claws on the Colorbond): front paws out, claws glinting.
      if (anim === 'stretch') sound('whoosh');
      await scene.tw(us, { scaleX: sx0 * 1.28, scaleY: sy0 * .8, angle: 6 * dir, x: ux + dir * 2 * u, duration: 360, ease: 'Sine.easeOut' });
      const paw = { x: us.x + dir * us.displayWidth * .45, y: us.y - 2 * u };
      for (let i = 0; i < (anim === 'sharpen' ? 4 : 3); i++) {
        if (anim === 'sharpen') sound('shing');
        const s = scene.add.image(paw.x + dir * i * 1.5 * u, paw.y - i * u, 'bt-slash').setDepth(31).setAngle(-40 * dir).setTint(i % 2 ? c : 0xffffff).setScale(u / 4, 0);
        scene.tweens.add({ targets: s, scaleY: u / 3, duration: 80, yoyo: true, hold: 120, onComplete: () => s.destroy() });
        if (anim === 'sharpen') scene.burst(paw.x, paw.y - 2 * u, 0xf8e070, 4, { key: 'bt-star', spread: 14, rise: 6, dur: 260 });
        await scene.wait(anim === 'sharpen' ? 140 : 110);
      }
      await scene.tw(us, { scaleX: sx0, scaleY: sy0, angle: 0, x: ux, duration: 260, ease: 'Sine.easeInOut' });
      break;
    }
    default: await scene.wait(200);
  }
  } finally {
    stopPose();
    us.setFlipX(flip0).setAngle(0).setDepth(depth0);
    scene.animating = false;
    scene.layout?.();
  }
}
