import { HandlingEvent } from './handling-event.js';
import { ui } from '../ui/ui.js';
import { h } from '../ui/dom.js';
import { controls } from './controls.js';
import { form, petTex, isEvolved } from './forms.js';
import { petSize } from '../data/pet-sizes.js';
import { animationFrames, frameAt, actionFrameAt } from '../data/animation-layouts.js';
import { frameCount, custom } from '../art/textures.js';
import { SHOW_JUDGES } from '../data/dog-show.js';
import { raiseScorecard } from './judge-votes.js';
import { hallCriteria } from './scorecards.js';
import { sfx } from './sfx.js';

const LABELS = { jump: 'Jump', tunnel: 'Through', weave: 'Weave', stay: 'Stay', recall: 'Come', left: 'Left', right: 'Right', heel: 'Heel', sit: 'Sit', down: 'Down' };
export async function startHallEvent(world, { pet, tier = 'novice', mode = 'course', variant = 0, area, guided = world.regionId === 'yard' }) {
  const session = new HandlingEvent(tier, mode, variant, { area });
  if (!guided) await ui.say([
    `The steward reads the route once: ${session.stations.map(s => LABELS[s.kind]).join(' → ')}.`,
    'Remember the order. There are no labels or highlighted targets in this ring. For Stay or Come, leave your dog on the mat, step away and recall. Weave alternates Left, Right, Left, Right, Left.',
  ]);
  return new Promise(resolve => {
    const original = { x: world.player.x, y: world.player.y };
    const pets = world.pets.map(actor => [actor, actor.visible]);
    pets.forEach(([actor]) => actor.setVisible(false));
    const dog = world.add.sprite(session.start.x, session.start.y, petTex(pet), 0).setOrigin(.5, 1);
    const height = petSize(pet, isEvolved(pet));
    dog.setDisplaySize(height * dog.frame.realWidth / dog.frame.realHeight, height);
    const scenery = world.add.graphics().setDepth(3), guide = world.add.graphics().setDepth(4);
    const labels = [];
    session.stations.forEach((s, i) => {
      if (s.kind === 'jump') {
        scenery.fillStyle(0xb35343).fillRect(s.x - 10, s.y - 13, 3, 14).fillRect(s.x + 7, s.y - 13, 3, 14);
        scenery.fillStyle(0xf5dfac).fillRect(s.x - 10, s.y - 9, 20, 3);
      } else if (s.kind === 'tunnel') {
        scenery.fillStyle(0x487b9e).fillRoundedRect(s.x - 13, s.y - 11, 26, 13, 5);
        scenery.fillStyle(0x20394d).fillEllipse(s.x - 8, s.y - 4, 8, 9);
      } else if (s.kind === 'weave') {
        for (let j = -2; j <= 2; j++) scenery.fillStyle(j % 2 ? 0xedc85b : 0xb94943).fillRect(s.x + j * 9, s.y - 13, 2, 15);
      } else scenery.lineStyle(2, 0x70ac9f).strokeEllipse(s.x, s.y, 24, 10);
      if (guided) labels.push(world.add.text(s.x, s.y + 5, `${i + 1} ${LABELS[s.kind]}`, { fontSize: '6px', color: '#fff1d5', backgroundColor: '#3c5547' }).setOrigin(.5, 0).setDepth(4));
    });
    const status = h('p', { role: 'status', 'aria-live': 'polite' });
    const counter = h('small', {});
    let ended = false;
    const finish = complete => {
      if (ended) return; ended = true;
      world.events.off('update', tick); world.events.off('shutdown', cancel);
      dog.destroy(); scenery.destroy(); guide.destroy(); labels.forEach(label => label.destroy());
      pets.forEach(([actor, visible]) => actor.active && actor.setVisible(visible));
      if (world.player?.active) world.player.setPosition(original.x, original.y);
      world.trail.length = 0; bar.remove(); document.body.classList.remove('hall-event');
      ui.activity = null; controls.release();
      world.onResize();
      resolve({ ...session.result(), cancelled: !complete });
    };
    let lastCue = mode === 'course' ? 'jump' : 'heel', shownFeedback = 0;
    const cue = id => { lastCue = id; session.cue(id, world.player); world.player.perform?.('wave'); };
    const buttons = h('div', { class: 'hall-cues' }, ...Object.entries(LABELS).map(([id, label]) =>
      h('button', { class: 'wood-btn small', 'data-cue': id, onclick: () => cue(id) }, label)));
    const bar = h('section', { class: 'hall-event-bar', 'aria-label': 'Exhibition ring event' },
      h('b', {}, `${form(pet).name} · ${mode === 'course' ? 'Agility' : mode === 'presentation' ? 'Breed presentation' : 'Obedience'}`),
      counter, status, buttons, h('button', { class: 'wood-btn small hall-leave', onclick: () => finish(false) }, 'Leave'));
    document.body.append(bar); document.body.classList.add('hall-event');
    world.onResize();
    world.player.setPosition(session.start.x + 9, session.start.y); world.trail.length = 0;
    controls.release();
    ui.activity = { walk: true, action: () => cue(lastCue), cancel: () => finish(false) };
    const tick = (_time, delta) => {
      if (document.hidden || ended) return;
      session.tick(delta / 1000, world.player);
      dog.setPosition(session.dog.x, session.dog.y - session.jump).setDepth(session.dog.y).setFlipX(!!session.flip);
      const frames = animationFrames(dog.texture.key, frameCount(world, dog.texture.key), session.jump ? 'jump' : session.moving ? 'walk' : 'idle', !custom.has(dog.texture.key));
      dog.setFrame(session.jump ? actionFrameAt(frames, session.actionTime / .9) :
        frameAt(frames, session.elapsed * 1000, session.moving ? 9 : 6));
      dog.setAlpha(session.phase === 'action' && session.station?.kind === 'tunnel' ? .55 : 1);
      status.textContent = guided ? session.message :
        `${session.index}/${session.stations.length} complete · ${session.faults} faults · ${session.phase === 'action' ? 'Your dog responds.' : 'Lead calmly. Choose the next cue from memory.'}`;
      counter.textContent = `Station ${Math.min(session.index + 1, session.stations.length)} of ${session.stations.length} · walk with the joystick or arrows`;
      // A tick or a cross pops over the dog after every cue, in practice and in the ring.
      if (session.feedback && session.feedback.n !== shownFeedback) {
        shownFeedback = session.feedback.n;
        const ok = session.feedback.ok;
        const mark = world.add.text(session.dog.x, session.dog.y - 18, ok ? '✓' : '✗', { fontSize: '12px', fontStyle: 'bold', color: ok ? '#7be07b' : '#ff6a5a', stroke: '#1e1a16', strokeThickness: 3 }).setOrigin(.5, 1).setDepth(9600);
        world.tweens.add({ targets: mark, y: mark.y - 12, alpha: 0, delay: 350, duration: 600, onComplete: () => mark.destroy() });
        ok ? sfx.select() : sfx.bump();
      }
      guide.clear();
      // The weave poles are hard to read, so the next pole is always marked, even in the ring.
      if (!guided && session.phase === 'weave') guide.lineStyle(1, 0xffffff, .7).strokeEllipse(session.target.x, session.target.y, 14, 7);
      if (guided && session.target) guide.lineStyle(2, session.ready ? 0xf4d16b : 0xffffff, .85).strokeEllipse(session.target.x, session.target.y, 29, 13);
      for (const button of buttons.children) {
        const id = button.dataset.cue;
        button.hidden = mode === 'course' ? ['heel', 'sit', 'down'].includes(id) :
          ['jump', 'tunnel', 'weave', 'left', 'right'].includes(id);
        button.disabled = session.phase === 'action';
      }
      if (session.complete) finish(true);
    };
    const cancel = () => finish(false);
    world.events.on('update', tick); world.events.once('shutdown', cancel);
    tick(0, 0);
  });
}

export async function judgeHallEvent(result, opts = {}) {
  const criteria = hallCriteria(result.mode);
  for (let i = 0; i < SHOW_JUDGES.length; i++) {
    const judge = SHOW_JUDGES[i], score = result.marks[i];
    const lowerCard = await raiseScorecard(opts.scene, judge.id, score);
    try {
    await ui.say([`${judge.name} raises a score card: ${score}/10.`,
      `${criteria[i]}: ${score >= 9 ? judge.praise : score >= 7 ? judge.good : judge.advice}`],
    { ...opts, name: `${judge.name} · ${criteria[i]}` });
    } finally { lowerCard(); }
  }
  await ui.say([`The judges’ total: ${result.marks.reduce((a, b) => a + b, 0)}/30.`,
    result.passed ? 'The audience claps. Your qualifying result has been recorded.' :
      'The audience cheers your effort. The steward invites you to try again; no entry fee or lost rewards.'], opts);
}
