import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const vite = await createServer({
  configFile: resolve(projectRoot, 'vite.config.ts'),
  server: { host: '127.0.0.1', port: 0, strictPort: false, hmr: false },
});
let browser;

try {
  await vite.listen();
  const address = vite.httpServer.address();
  const origin = `http://127.0.0.1:${address.port}`;
  const base = vite.config.base;
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    || (existsSync('/repl/tools/bin/chromium') ? '/repl/tools/bin/chromium' : undefined);

  browser = await chromium.launch({
    executablePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const context = await browser.newContext({
    serviceWorkers: 'block',
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.stack || error.message));

  // Keep the game shell and real modal DOM, but do not boot the unrelated Phaser world.
  await page.route('**/src/main.js', route => route.fulfill({
    status: 200,
    contentType: 'text/javascript',
    body: '',
  }));
  await page.route('**/lib/phaser.min.js', route => route.fulfill({
    status: 200,
    contentType: 'text/javascript',
    body: '',
  }));
  await page.goto(new URL(base, origin).href, { waitUntil: 'domcontentloaded' });
  await page.locator('#modalPanel').waitFor({ state: 'attached' });
  await page.locator('#loading').evaluate(element => { element.style.display = 'none'; });

  await page.evaluate(async basePath => {
    const load = path => import(new URL(path, new URL(basePath, location.origin)).href);
    const [{ ui }, { state }, { BakingSession, INGREDIENTS }] = await Promise.all([
      load('src/ui/ui.js'),
      load('src/systems/state.js'),
      load('src/systems/baking.js'),
    ]);

    const callbacks = new Map();
    let nextFrameId = 0;
    window.requestAnimationFrame = callback => {
      const id = ++nextFrameId;
      callbacks.set(id, callback);
      return id;
    };
    window.cancelAnimationFrame = id => callbacks.delete(id);
    const activeKeydown = new Set();
    const add = document.addEventListener.bind(document);
    const remove = document.removeEventListener.bind(document);
    document.addEventListener = (type, listener, options) => {
      if (type === 'keydown') activeKeydown.add(listener);
      return add(type, listener, options);
    };
    document.removeEventListener = (type, listener, options) => {
      if (type === 'keydown') activeKeydown.delete(listener);
      return remove(type, listener, options);
    };

    function makeOvenSession() {
      const session = new BakingSession({ competition: true });
      for (const ingredient of INGREDIENTS.filter(item => item.dry))
        session.pour(ingredient.id, ingredient.target);
      session.setMethod('whisk');
      for (let i = 0; i < 4; i++) session.stroke();
      for (const ingredient of INGREDIENTS.filter(item => !item.dry))
        session.pour(ingredient.id, ingredient.target);
      session.setMethod('fold');
      for (let i = 0; i < 4; i++) session.stroke();
      session.finishStage();
      return session;
    }

    window.__bakingRegression = {
      ui,
      state,
      makeOvenSession,
      load,
      clock: {
        step(time) {
          const frame = [...callbacks.values()];
          callbacks.clear();
          for (const callback of frame) callback(time);
        },
        pending: () => callbacks.size,
      },
      keydownListeners: () => activeKeydown.size,
    };
    state.data.settings.sound = false;
    state.data.inventory = { sponge: 1, flour: 2, butter: 3 };
    state.data.side.bakeQuest.entries = 3;
    state.data.flags.bakeoffWeek = null;
  }, base);

  // Closing the actual baking modal must resolve as a cancellation and release its
  // keyboard handler and scheduled animation frame.
  await page.evaluate(() => {
    const test = window.__bakingRegression;
    const session = test.makeOvenSession();
    test.cancelSession = session;
    test.cancelResult = test.ui.baking({
      name: 'Victoria sponge',
      session,
      singleStage: true,
    });
  });
  await page.getByRole('button', { name: 'Cancel' }).click();
  const cancelled = await page.evaluate(async () => {
    const test = window.__bakingRegression;
    const session = test.cancelSession;
    const result = await test.cancelResult;
    const stageAfterClose = session.stage;
    const resultCountAfterClose = session.results.length;
    const heatAfterClose = session.st.heat;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
    return {
      result,
      stageAfterClose,
      resultCountAfterClose,
      heatAfterClose,
      heatAfterAnotherKey: session.st.heat,
      listeners: test.keydownListeners(),
      frames: test.clock.pending(),
      modalHidden: document.querySelector('#modal').hidden,
    };
  });
  assert.equal(cancelled.result, null, 'Cancel must not report a completed bake stage');
  assert.equal(cancelled.stageAfterClose, 1, 'Cancel must leave the oven stage unfinished');
  assert.equal(cancelled.resultCountAfterClose, 1, 'Cancel must not add a result');
  assert.equal(cancelled.heatAfterAnotherKey, cancelled.heatAfterClose,
    'The closed oven must no longer respond to keyboard input');
  assert.equal(cancelled.listeners, 0, 'Cancel must remove the oven keydown listener');
  assert.equal(cancelled.frames, 0, 'Cancel must cancel the oven animation frame');
  assert.equal(cancelled.modalHidden, true, 'Cancel must close the real modal');

  await page.evaluate(() => {
    const test = window.__bakingRegression;
    const { state, ui } = test;
    const session = test.makeOvenSession();
    const week = Math.floor(state.data.day / 7);
    const attempt = { id: 'sponge', week, session, helped: false, drama: true };
    state.data.flags.bakeAttempt = {
      id: attempt.id,
      week,
      session: structuredClone(session),
      helped: false,
      drama: true,
    };
    test.attempt = attempt;
    test.inventoryBefore = structuredClone(state.data.inventory);
    test.entryCountBefore = state.count(attempt.id);
    test.questEntriesBefore = state.data.side.bakeQuest.entries;
    test.bakeoffWeekBefore = state.data.flags.bakeoffWeek;
    test.startStage = session.stage;
    test.startResultCount = session.results.length;
    test.startScore = session.score;
    test.completion = ui.baking({
      name: 'Victoria sponge',
      session,
      singleStage: true,
    });
  });

  // Use the real heat control, then advance only the UI's animation clock until its
  // normal golden-and-risen cue appears. No production timing or difficulty changes.
  await page.getByRole('button', { name: 'Turn heat up' }).click();
  const golden = await page.evaluate(() => {
    const test = window.__bakingRegression;
    const session = test.attempt.session;
    let time = 0;
    let frames = 0;
    test.clock.step(time);
    while (frames < 400 && session.stage === 1 && session.ovenCue() !== 'Golden and tall. Ready.') {
      time += 100;
      test.clock.step(time);
      frames++;
    }
    return {
      reached: session.ovenCue() === 'Golden and tall. Ready.',
      stage: session.stage,
      frames,
      rise: session.st.rise,
      brown: session.st.brown,
      quality: session.stageQuality(),
      resultCount: session.results.length,
      score: session.score,
    };
  });
  assert.equal(golden.reached, true, 'Controlled browser clock must reach the golden, risen window');
  assert.equal(golden.stage, 1, 'The oven must not auto-remove the cake before take-out');
  assert.ok(golden.rise > 0.85, `Cake must be risen, got ${golden.rise}`);
  assert.ok(golden.brown > 0.55 && golden.brown < 1, `Cake must be golden, got ${golden.brown}`);
  assert.ok(golden.frames < 400, 'Golden window should be reached by the deterministic clock');

  await page.getByRole('button', { name: 'Take out of oven', exact: true }).click();
  const takenOut = await page.evaluate(() => {
    const { attempt, startStage, startResultCount, startScore } = window.__bakingRegression;
    const session = attempt.session;
    return {
      stage: session.stage,
      results: session.results.map(result => ({ ...result })),
      score: session.score,
      startStage,
      startResultCount,
      startScore,
    };
  });
  assert.equal(takenOut.stage, takenOut.startStage + 1, 'Take out must advance exactly one stage');
  assert.equal(takenOut.results.length, takenOut.startResultCount + 1,
    'Take out must record exactly one oven result');
  assert.equal(takenOut.results[1].name, 'Baking');
  assert.equal(takenOut.results[1].quality, golden.quality,
    'The recorded oven quality must match the golden cake state at the real button click');
  assert.equal(takenOut.results[1].clean, golden.quality >= 60);
  assert.equal(takenOut.score, takenOut.startScore + (golden.quality >= 60 ? 1 : 0));

  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  const completed = await page.evaluate(async () => {
    const { attempt, state, completion, clock, keydownListeners } = window.__bakingRegression;
    const result = await completion;
    const { saveBakeAttempt } = await window.__bakingRegression.load('src/systems/bake-event.js');
    saveBakeAttempt({ bakeAttempt: attempt });
    return {
      result,
      savedAttempt: state.data.flags.bakeAttempt,
      inventory: structuredClone(state.data.inventory),
      entryCount: state.count(attempt.id),
      questEntries: state.data.side.bakeQuest.entries,
      bakeoffWeek: state.data.flags.bakeoffWeek,
      listeners: keydownListeners(),
      frames: clock.pending(),
    };
  });
  assert.equal(completed.result.stage, 2, 'The handoff must preserve the next workstation stage');
  assert.equal(completed.result.results.length, 2);
  assert.equal(completed.result.results[1].quality, golden.quality);
  assert.equal(completed.savedAttempt.id, 'sponge', 'The registered bake-off entry must remain active');
  assert.equal(completed.savedAttempt.session.stage, 2, 'The oven-stage progress must be saved');
  assert.deepEqual(completed.inventory, { sponge: 1, flour: 2, butter: 3 },
    'Neither the bake-off entry nor ingredients may be removed before judging');
  assert.equal(completed.entryCount, 1);
  assert.equal(completed.questEntries, 3, 'Bake-off entry totals change only when judged');
  assert.equal(completed.bakeoffWeek, null, 'The bake-off must remain unclaimed before judging');
  assert.equal(completed.listeners, 0, 'Completing the station must remove its keydown listener');
  assert.equal(completed.frames, 0, 'Completing the station must stop its animation frame');
  assert.deepEqual(pageErrors, [], 'The browser test must not produce JavaScript errors');
  await context.close();
  console.log('Baking oven browser regression passed.');
} finally {
  await browser?.close();
  await vite.close();
}
