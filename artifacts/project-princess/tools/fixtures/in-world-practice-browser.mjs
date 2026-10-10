import assert from 'node:assert/strict';
import { HandlingEvent } from '../../game/src/systems/handling-event.js';

// Only drives the disposable browser save. The actual WorldScene, cue handlers,
// reward path and judging animations remain in use; there is no fake result.
export function practiceDriver(page) {
  let stations;
  return {
    async start() {
      const setup = await page.evaluate(() => {
        const { ui, state, game } = window.__pp, world = game.scene.getScene('World');
        const originalSay = ui.say, yard = world.regionId === 'yard';
        window.__practiceMessages = [];
        window.__practiceChildren = new Set(world.children.list);
        ui.say = async message => {
          if (message?.text === 'Who is practising?') return 'princess';
          if (message?.text === 'Choose a practice layout.') return 'novice';
          if (message?.text?.startsWith('Home practice has labels')) return 'course';
          if (Array.isArray(message)) {
            window.__practiceMessages.push(...message);
            if (typeof message[0] === 'string' && /\d+\/100\./.test(message[0]))
              window.__yardPracticeResultMessage = message[0];
          }
          return true;
        };
        window.__yardPracticeResultMessage = null;
        const promise = world.coursePractice().finally(() => { ui.say = originalSay; });
        window.__practiceDone = promise;
        window[yard ? '__yardPractice' : '__exhibitionPractice'] = promise;
        return { yard, variant: yard ? 0 : state.data.day,
          tier: yard ? state.count('weavekit') ? 'open' :
            state.count('courseextension') ? 'novice' : 'yardstarter' : 'novice' };
      });
      await page.locator('.hall-event-bar').waitFor();
      assert.ok(await page.evaluate(() =>
        window.__pp.game.scene.isActive('World') && !window.__pp.game.scene.isActive('Activity')),
      'Practice must stay in the world rather than opening the retired activity screen');
      stations = new HandlingEvent(setup.tier, 'course', setup.variant, {
        area: setup.yard ? { x: 32, y: 96, w: 240, h: 128 } : undefined,
      }).stations;
      await page.evaluate(() => {
        const { game } = window.__pp, world = game.scene.getScene('World');
        window.__practiceDog = world.children.list.find(actor =>
          !window.__practiceChildren.has(actor) && actor.type === 'Sprite' &&
          actor.texture?.key?.startsWith('pet-'));
        if (!window.__practiceDog) throw new Error('Practice dog was not created');
        // Deterministic input and animation frames, without real-time drift.
        game.loop.sleep();
      });
    },
    async station(number, { wrongCueCount = 0, finishAction = true } = {}) {
      const station = stations[number - 1];
      assert.ok(station, `Missing station ${number}`);
      await page.evaluate(({ station, wrongCueCount, finishAction }) => {
        const world = window.__pp.game.scene.getScene('World'), dog = window.__practiceDog;
        const tick = count => {
          for (let i = 0; i < count && window.__pp.ui.activity; i++)
            world.events.emit('update', 0, 50);
        };
        const walk = (x, y) => {
          for (let i = 0; i < 700; i++) {
            const dx = x - world.player.x, dy = y - world.player.y, distance = Math.hypot(dx, dy);
            if (distance > .1) {
              const step = Math.min(distance, 1.5);
              world.player.body.reset(world.player.x + dx / distance * step,
                world.player.y + dy / distance * step);
            }
            tick(1);
            if (distance < .1 && Math.hypot(dog.x - (x - 9), dog.y - (y - 1)) < 3) return;
          }
          throw new Error('Practice dog did not reach its handler');
        };
        const cue = id => {
          const button = document.querySelector(`.hall-event-bar [data-cue="${id}"]`);
          if (!button || button.hidden || button.disabled) throw new Error(`Cue unavailable: ${id}`);
          button.click();
        };
        walk(station.x + 9, station.y + 1);
        tick(8);
        for (let i = 0; i < wrongCueCount; i++) cue(station.kind === 'jump' ? 'tunnel' : 'jump');
        cue(station.kind === 'recall' ? 'stay' : station.kind);
        if (station.kind === 'weave') {
          for (let i = 0; i < 5; i++) {
            walk(station.x + (i - 2) * 9 + 9, station.y + (i % 2 ? -11 : 11) + 1);
            cue(i % 2 ? 'right' : 'left');
          }
        } else if (['stay', 'recall'].includes(station.kind)) {
          // During Stay the dog holds its mat instead of following the handler.
          world.player.body.reset(station.x + 40, station.y);
          tick(station.kind === 'recall' ? 12 : 65);
          cue('recall');
          if (finishAction) tick(20);
        } else if (finishAction) tick(20);
      }, { station, wrongCueCount, finishAction });
    },
    async finish(options = {}) {
      for (let i = 1; i <= stations.length; i++) await this.station(i, options);
      await page.waitForFunction(() => !window.__pp.ui.activity);
      await page.evaluate(async () => {
        window.__pp.game.loop.wake();
        await window.__practiceDone;
      });
    },
    async idle() {
      await page.evaluate(() => {
        const world = window.__pp.game.scene.getScene('World');
        for (let i = 0; i < 4000; i++) world.events.emit('update', 0, 50);
      });
      assert.match(await page.locator('.hall-event-bar small').innerText(), /Station 1 of/,
        'Waiting alone must not advance a player-steered course');
    },
    async cancel() {
      await page.locator('.hall-event-bar .hall-leave').click();
      await page.evaluate(async () => {
        window.__pp.game.loop.wake();
        await window.__practiceDone;
      });
      assert.equal(await page.locator('.hall-event-bar').count(), 0,
        'Leaving must remove the ring controls');
    },
  };
}
