// Runs a pet school lesson (systems/school-lessons.js) in the world: you walk
// with the joystick or arrows, the pet and props are drawn over the map, and a
// small bar shows what to do. Modelled on the dog show ring (hall-events.js).
import { ui } from '../ui/ui.js';
import { h } from '../ui/dom.js';
import { controls } from './controls.js';
import { form, petTex, isEvolved } from './forms.js';
import { petSize } from '../data/pet-sizes.js';
import { animationFrames, frameAt, actionFrameAt } from '../data/animation-layouts.js';
import { frameCount, custom } from '../art/textures.js';
import { makeLesson, findLessonArea, LESSON_TITLES } from './school-lessons.js';
import { sfx } from './sfx.js';
import { TILE as T } from '../config.js';

// Find room near the player and run the lesson. Resolves { score, ... },
// { noRoom: true } when there is nowhere open enough, or null if you leave.
export function runSchoolLesson(world, { pet, kind, level }) {
  const area = findLessonArea(world.map, world.player, { tile: T, exits: world.map.exits || [] });
  if (!area) return Promise.resolve({ noRoom: true });
  const types = [form(pet).type].flat();
  const lesson = makeLesson(kind, { level, area, seed: (world.time.now % 997) / 997, name: form(pet).name, speedy: types.includes('speed'), phase: kind === 'seek' && ['spooky'].includes(pet) });
  return new Promise(resolve => {
    const original = { x: world.player.x, y: world.player.y };
    const pets = world.pets.map(actor => [actor, actor.visible]);
    pets.forEach(([actor]) => actor.setVisible(false));
    world.sibling?.setVisible(false); world.duckling?.setVisible?.(false);
    const dog = world.add.sprite(lesson.pet.x, lesson.pet.y, petTex(pet), 0).setOrigin(.5, 1);
    const height = petSize(pet, isEvolved(pet));
    dog.setDisplaySize(height * dog.frame.realWidth / dog.frame.realHeight, height);
    const ground = world.add.graphics().setDepth(2), ring = world.add.graphics().setDepth(4);
    // Things you cannot walk through (the tunnel, the pen walls).
    const blockers = lesson.solids.map(r => {
      const z = world.add.zone(r.x + r.w / 2, r.y + r.h / 2, r.w, r.h);
      world.physics.add.existing(z, true);
      return [z, world.physics.add.collider(world.player, z)];
    });
    const status = h('p', { role: 'status', 'aria-live': 'polite' }), counter = h('small', {});
    let ended = false, closing = false, shown = 0, last = { x: world.player.x, y: world.player.y };
    const finish = done => {
      if (ended) return; ended = true;
      world.events.off('update', tick); world.events.off('shutdown', cancel);
      dog.destroy(); ground.destroy(); ring.destroy();
      blockers.forEach(([z, c]) => { c.destroy(); z.destroy(); });
      if (world.layerCollider) world.layerCollider.active = true;
      pets.forEach(([actor, visible]) => actor.active && actor.setVisible(visible));
      world.sibling?.setVisible(true); world.duckling?.setVisible?.(true);
      if (world.player?.active) world.player.setPosition(original.x, original.y);
      world.trail.length = 0; bar.remove(); document.body.classList.remove('hall-event');
      ui.activity = null; controls.release(); world.onResize();
      resolve(done ? lesson.result() : null);
    };
    // The Leave button sits where the dialogue box was: ignore it for a moment,
    // so the tap (or double tap) that closed the instructions cannot end the lesson.
    const opened = performance.now();
    const bar = h('section', { class: 'hall-event-bar school-bar', 'aria-label': 'Pet school lesson' },
      h('b', {}, `${form(pet).name} · ${LESSON_TITLES[kind]}`), counter, status,
      h('button', { class: 'wood-btn small hall-leave', onclick: () => { if (performance.now() - opened > 1200) finish(false); } }, 'Leave'));
    document.body.append(bar); document.body.classList.add('hall-event');
    // Inside the lesson you can step over a pot plant; the area's edge holds you in.
    if (world.layerCollider) world.layerCollider.active = false;
    world.onResize();
    world.player.setPosition(lesson.start.x + 9, lesson.start.y); world.trail.length = 0;
    last = { x: world.player.x, y: world.player.y };
    controls.release();
    // On phones B is the run button, so it must not end the lesson: Leave does.
    ui.activity = { walk: true, action: () => {}, cancel: () => { if (!controls.touchMode) finish(false); } };

    const draw = () => {
      ground.clear(); ring.clear();
      ground.lineStyle(1, 0xfff1d5, .35).strokeRoundedRect(area.x + 2, area.y + 2, area.w - 4, area.h - 4, 6);
      for (const p of lesson.props()) {
        if (p.kind === 'hurdle') {
          ground.fillStyle(0xb35343).fillRect(p.x - 1, p.y - 13, 3, 14).fillRect(p.x - 1, p.y + 9, 3, 6);
          ground.fillStyle(p.done ? 0x9fd08a : 0xf5dfac).fillRect(p.x - 1, p.y - 11, 3, 22);
        } else if (p.kind === 'tunnel') {
          ground.fillStyle(0x487b9e).fillRoundedRect(p.x - 16, p.y - 9, 32, 14, 5);
          ground.fillStyle(0x20394d).fillEllipse(p.entrance.x + 4 * p.dir, p.y - 2, 6, 10).fillEllipse(p.exit.x - 4 * p.dir, p.y - 2, 6, 10);
        } else if (p.kind === 'weave') {
          for (const x of p.poles) ground.fillStyle(0xb94943).fillRect(x - 1, p.y - 13, 2, 15).fillStyle(0xedc85b).fillRect(x - 1, p.y - 13, 2, 3);
        } else if (p.kind === 'flag' || p.kind === 'pennant') {
          const c = p.kind === 'flag' ? 0xffffff : p.hit ? 0x7be07b : 0xe8643a;
          ground.fillStyle(0x5a4a3a).fillRect(p.x, p.y - 16, 2, 16);
          ground.fillStyle(c).fillTriangle(p.x + 2, p.y - 16, p.x + 11, p.y - 13, p.x + 2, p.y - 10);
          if (p.kind === 'flag') ground.fillStyle(0x1e1a16).fillRect(p.x + 4, p.y - 15, 2, 2).fillRect(p.x + 8, p.y - 13, 2, 2);
        } else if (p.kind === 'bin') {
          ground.fillStyle(0x2f6a3a).fillRect(p.x - 4, p.y - 11, 8, 11).fillStyle(0x1f4a28).fillRect(p.x - 5, p.y - 13, 10, 3);
        } else if (p.kind === 'pen') {
          const g0 = p.y + p.h / 2 - p.gap / 2, g1 = p.y + p.h / 2 + p.gap / 2;
          ground.fillStyle(0xc8a878).fillRect(p.x + 4, p.y + 4, p.w - 8, p.h - 8);
          ground.fillStyle(0x8a5a32).fillRect(p.x, p.y, p.w, 4).fillRect(p.x, p.y + p.h - 4, p.w, 4).fillRect(p.x + p.w - 4, p.y, 4, p.h)
            .fillRect(p.x, p.y, 4, g0 - p.y).fillRect(p.x, g1, 4, p.y + p.h - g1);
        } else if (p.kind === 'chook') {
          const bob = p.moving ? Math.sin(world.time.now / 60 + p.wob) : 0, f = p.flip ? -1 : 1;
          ground.fillStyle(0x000000, .2).fillEllipse(p.x, p.y, 8, 3);
          ground.fillStyle(0xf4efe0).fillEllipse(p.x, p.y - 4 + bob, 9, 7);
          ground.fillStyle(0xf4efe0).fillCircle(p.x + 4 * f, p.y - 8 + bob, 2.5);
          ground.fillStyle(0xd83a2a).fillRect(p.x + 3 * f, p.y - 11 + bob, 2, 2);
          ground.fillStyle(0xe8a830).fillRect(p.x + 6 * f - (f < 0 ? 1 : 0), p.y - 8 + bob, 2, 1);
        } else if (p.kind === 'bush') {
          const s = p.rustle ? Math.sin(world.time.now / 40) * 1.5 : 0;
          ground.fillStyle(0x2f6a3a).fillCircle(p.x - 5 + s, p.y - 6, 6).fillCircle(p.x + 5 - s, p.y - 6, 6);
          ground.fillStyle(0x4a8a3e).fillCircle(p.x + s, p.y - 10, 7);
          if (p.rustle) ground.fillStyle(0x9fd08a).fillRect(p.x - 9 - s, p.y - 17, 2, 2).fillRect(p.x + 8 + s, p.y - 15, 2, 2);
        }
      }
      if (lesson.kind === 'course' && lesson.target && !lesson.ended) ring.lineStyle(2, 0xf4d16b, .85).strokeEllipse(lesson.target.x, lesson.target.y + 2, 26, 11);
    };
    const tick = (_time, delta) => {
      if (document.hidden || ended || closing) return;
      const dt = delta / 1000, p = world.player;
      const cx = Math.max(area.x + 6, Math.min(area.x + area.w - 6, p.x)), cy = Math.max(area.y + 10, Math.min(area.y + area.h - 2, p.y));
      if (cx !== p.x || cy !== p.y) p.setPosition(cx, cy);
      const speed = dt ? Math.hypot(p.x - last.x, p.y - last.y) / dt : 0;
      last = { x: p.x, y: p.y };
      lesson.tick(dt, { x: p.x, y: p.y, dir: p.dir || 'down', speed });
      const P = lesson.pet, jump = P.jump > 0 ? Math.sin((1 - P.jump / .45) * Math.PI) * 12 : 0;
      dog.setPosition(P.x, P.y - jump).setDepth(P.y).setFlipX(!!P.flip).setAlpha(P.alpha ?? 1);
      const frames = animationFrames(dog.texture.key, frameCount(world, dog.texture.key), jump ? 'jump' : P.moving ? 'walk' : 'idle', !custom.has(dog.texture.key));
      dog.setFrame(jump ? actionFrameAt(frames, 1 - P.jump / .45) : frameAt(frames, lesson.elapsed * 1000, P.moving ? 9 : 6));
      if (lesson.feedback && lesson.feedback.n !== shown) {
        shown = lesson.feedback.n;
        const ok = lesson.feedback.ok;
        const mark = world.add.text(P.x, P.y - 18, ok ? '✓' : '✗', { fontSize: '12px', fontStyle: 'bold', color: ok ? '#7be07b' : '#ff6a5a', stroke: '#1e1a16', strokeThickness: 3 }).setOrigin(.5, 1).setDepth(9600);
        world.tweens.add({ targets: mark, y: mark.y - 12, alpha: 0, delay: 350, duration: 600, onComplete: () => mark.destroy() });
        ok ? sfx.select() : sfx.bump();
      }
      draw();
      status.textContent = lesson.message;
      counter.textContent = `${Math.max(0, Math.ceil(lesson.timeLimit - lesson.elapsed))}s left · ${lesson.faults} slip${lesson.faults === 1 ? '' : 's'} · walk with the joystick or arrows, run with B or Shift`;
      // A moment to see the last ✓ before the lesson closes.
      if (lesson.ended && !closing) { closing = true; setTimeout(() => finish(true), 900); }
    };
    const cancel = () => finish(false);
    world.events.on('update', tick); world.events.once('shutdown', cancel);
    tick(0, 0);
  });
}
