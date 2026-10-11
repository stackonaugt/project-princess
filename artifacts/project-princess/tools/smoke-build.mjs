// Run after building. Optional first argument selects a built-site directory.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { BALANCE } from '../game/src/config.js';
import { practiceDriver } from './fixtures/in-world-practice-browser.mjs';

const output = resolve(process.argv[2] || fileURLToPath(new URL('../dist/public', import.meta.url)));
const screenshotDir = process.argv[3] ? resolve(process.argv[3]) : null;
const html = await readFile(resolve(output, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(resolve(output, 'assets/sprites/manifest.json'), 'utf8'));
assert.ok(Array.isArray(manifest.files), 'Built sprite manifest must contain a files array');

// Derive the mount path from the built module URL, not the current dev config.
const moduleURL = html.match(/<script\b[^>]*type="module"[^>]*src="([^"]+)"/)?.[1];
assert.ok(moduleURL, 'Built HTML must contain a module script');
const base = new URL('../', new URL(moduleURL, 'http://localhost/')).pathname;
const mime = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
};

// No Vite middleware, source files, SPA fallback, or generated manifest.
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!pathname.startsWith(base)) {
      response.writeHead(404).end();
      return;
    }
    let file = resolve(output, pathname.slice(base.length) || 'index.html');
    if (!file.startsWith(output + sep)) {
      response.writeHead(403).end();
      return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    response.writeHead(200, {
      'Content-Type': mime[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    }).end(body);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 500).end();
  }
});

const errors = [];
const loaded = new Set();
let browser;
let startup;
try {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const url = `http://127.0.0.1:${server.address().port}${base}`;
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    || (existsSync('/repl/tools/bin/chromium') ? '/repl/tools/bin/chromium' : undefined);
  browser = await chromium.launch({
    executablePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--enable-unsafe-swiftshader'],
  });
  // A fresh context prevents saves, service workers, and cached sprites masking failures.
  const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(20_000);
  page.on('pageerror', error => errors.push(`JavaScript: ${error.stack || error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`Console: ${message.text()}`);
  });
  page.on('requestfailed', request => errors.push(`Request: ${request.url()} (${request.failure()?.errorText})`));
  page.on('response', response => {
    if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
    if (response.ok()) loaded.add(new URL(response.url()).pathname);
  });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.locator('#title .title-logo').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#title .title-logo').innerText(), 'Project Princess');
  assert.equal(await page.locator('#title .slot-main').count(), 3, 'All three save slots must appear');
  for (const button of await page.locator('#title .slot-main').all()) {
    assert.ok(await button.isVisible() && await button.isEnabled(), 'Save-slot button must be usable');
  }
  assert.ok(await page.locator('#loading').evaluate(el => el.classList.contains('done')), 'Loading must finish');
  assert.ok(await page.locator('#game canvas').isVisible(), 'Phaser must create a visible canvas');

  startup = await page.evaluate(files => {
    const game = window.__pp?.game;
    // Phaser may use blob URLs internally, so verify texture keys and decoded
    // dimensions rather than comparing the texture image URL to the request.
    const prefixes = { player: 'player', pets: 'pet', portraits: 'portrait', npcs: 'npc', objects: 'obj', tiles: 'tile', items: 'item', vehicles: 'veh', enemies: 'foe', backgrounds: 'battlebg' };
    const sprites = files.filter(file => {
      const match = /^([a-z]+)\/([a-z0-9_-]+)\.(png|jpe?g|webp)$/i.exec(file);
      const key = match && prefixes[match[1]] && `${prefixes[match[1]]}-${match[2].toLowerCase()}`;
      if (!key || !game?.textures.exists(key)) return false;
      const image = game.textures.get(key).getSourceImage();
      return image && image.width > 0 && image.height > 0;
    });
    return {
      bootActive: game?.scene.isActive('Boot'),
      worldActive: game?.scene.isActive('World'),
      sprites,
      artwork: window.__pp?.artworkStatus?.(),
      defaultTextures: ['pet-princess', 'pet-princess-evolved',
        files.some(file => /^npcs\/trish\.(png|jpe?g|webp)$/i.test(file)) ? 'npc-trish' : 'npc-trish-down']
        .filter(key => game?.textures.exists(key)),
      titleImagesOK: Array.from(document.querySelectorAll('#title img')).every(img => img.complete && img.naturalWidth > 0),
    };
  }, manifest.files);
  assert.ok(startup.bootActive && !startup.worldActive, 'Game must remain at the title, not bypass it');
  assert.ok(startup.titleImagesOK, 'Title-screen artwork must decode');
  assert.ok(startup.artwork, 'Runtime artwork binding diagnostics must be available');
  assert.deepEqual(startup.artwork.failures, [],
    `Assigned artwork must resolve to its expected custom textures:\n${startup.artwork.failures.join('\n')}`);
  assert.deepEqual(startup.defaultTextures, ['pet-princess', 'pet-princess-evolved',
    manifest.files.some(file => /^npcs\/trish\.(png|jpe?g|webp)$/i.test(file)) ? 'npc-trish' : 'npc-trish-down'],
    'Stable-ID artwork must use a supplied sheet when present, otherwise its built-in texture');
  assert.ok(loaded.has(`${base}assets/sprites/manifest.json`), 'Game must request the built manifest');
  for (const sprite of manifest.files) {
    const pathname = new URL(`assets/sprites/${sprite}`, url).pathname;
    assert.ok(loaded.has(pathname), `Manifest sprite was not loaded successfully: ${sprite}`);
    assert.ok(startup.sprites.includes(sprite), `Manifest sprite missing from Phaser textures: ${sprite}`);
  }
  for (const privatePath of ['studio/', '__studio_api/catalog', 'src/main.js']) {
    assert.equal((await fetch(new URL(privatePath, url))).status, 404, `${privatePath} must not be public`);
  }
  await page.locator('#title .slot-main').first().click();
  await page.waitForFunction(() => {
    const game = window.__pp?.game;
    return game?.scene.isActive('World') && game.scene.getScene('World').map?.w > 0;
  });
  assert.ok(await page.evaluate(() => window.__pp.game.scene.getScene('World').map.solid.length > 0),
    'The production map and its collision data must load');
  // Only this fresh browser context is touched, never a real player's save.
  await page.evaluate(() => {
    window.__pp.state.data.money = 321;
    window.__pp.state.save();
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__pp?.game.scene.isActive('World'));
  assert.equal(await page.evaluate(() => window.__pp.state.data.money), 321,
    'Reload must resume the active save without losing progress');
  // The explicit title action clears tab-resume state and restores slot choice.
  await page.evaluate(() => window.__pp.bus.emit('game:title'));
  await page.locator('#title .slot-main').first().waitFor();
  assert.match(await page.locator('#title .slot-main').first().innerText(), /\$321/, 'Save slot must survive reload');
  await page.locator('#title .slot-main').first().click();
  await page.waitForFunction(() => window.__pp?.game.scene.isActive('World'));
  assert.equal(await page.evaluate(() => window.__pp.state.data.money), 321, 'Saved progress must load');
  // Recruit Princess through the actual world interaction, including Julie.
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>{
    const {state,ui,game}=window.__pp;state.data.minutes=9*60;
    ui.dialog=null;document.getElementById('dialog').hidden=true;
    game.scene.getScene('World').scene.restart({region:'allen',entry:'house'});
  });
  await page.waitForFunction(()=>window.__pp.game.scene.getScene('World').regionId==='allen'&&window.__pp.game.scene.getScene('World').pets?.some(p=>p.id==='princess'));
  const julie=await page.evaluate(async()=>{
    const {ui,state,game}=window.__pp,world=game.scene.getScene('World'),say=ui.say,battle=world.startBattle;
    let trainer=null;
    try{ui.say=async()=>true;world.startBattle=async opts=>{trainer=opts.trainer;return {outcome:'win'};};await world.talkToPet(world.pets.find(p=>p.id==='princess'));}
    finally{ui.say=say;world.startBattle=battle;}
    return {trainer,found:state.isFound('princess'),done:!!state.data.beaten.julie,team:state.data.party};
  });
  assert.equal(julie.trainer,'julie');assert.ok(julie.found&&julie.done&&julie.team.includes('princess'),'Princess recruitment must reach Julie instead of stopping on an undefined variable');
  const catchUp = await page.evaluate(async () => {
    const { state, ui, game } = window.__pp, world = game.scene.getScene('World');
    const say = ui.say, battle = world.startBattle;
    let trainer;
    delete state.data.beaten.julie;
    state.data.flags.tutorial = true; // Simulate the older interrupted save.
    try {
      ui.say = async () => true;
      world.startBattle = async options => { trainer = options.trainer; return { outcome: 'win' }; };
      await world.catchUpJulie();
    } finally { ui.say = say; world.startBattle = battle; }
    return { trainer, completed: !!state.data.beaten.julie };
  });
  assert.deepEqual(catchUp, { trainer: 'julie', completed: true },
    'An interrupted recruitment save must still reach Julie');
  // Exercise new activities in a disposable save on a phone-sized canvas.
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>{
    const {state,ui,game}=window.__pp;state.findPet('princess');state.setParty(['princess']);
    ui.dialog=null;document.getElementById('dialog').hidden=true;
    game.scene.getScene('World').scene.restart({region:'exhibition',entry:'door'});
  });
  await page.waitForFunction(()=>window.__pp.game.scene.getScene('World').regionId==='exhibition'&&window.__pp.game.scene.getScene('World').npcs?.some(n=>n.id==='showjean'));
  await page.evaluate(()=>window.__pp.ui.openModal('skills'));
  await page.getByText('Pet handling · Level 1',{exact:true}).waitFor();
  await page.evaluate(()=>{window.__pp.ui.closeModal();window.__pp.game.scene.getScene('World').startActivity({mode:'course',pet:'princess',tier:'open',variant:0});});
  await page.locator('.activity-overlay').waitFor();
  await page.waitForFunction(()=>window.__pp.game.scene.isActive('Activity'));
  assert.ok(await page.evaluate(()=>{
    const s=window.__pp.game.scene.getScene('Activity');return Number.isFinite(s.dog.x)&&s.area.top>=document.querySelector('.activity-overlay').getBoundingClientRect().bottom&&s.hero.displayHeight>0;
  }),'Course sprites and instructions must fit the phone layout');
  await page.getByRole('button',{name:'Leave practice',exact:true}).click();
  await page.waitForFunction(()=>window.__pp.game.scene.isActive('World')&&!window.__pp.ui.activity);
  await page.evaluate(()=>{window.__pp.game.scene.getScene('World').startActivity({mode:'sparring'});});
  await page.getByRole('button',{name:'Attack (A)',exact:true}).waitFor();
  await page.getByRole('button',{name:'Attack (A)',exact:true}).click();
  assert.ok(await page.evaluate(()=>window.__pp.game.scene.getScene('Activity').session.stamina<window.__pp.game.scene.getScene('Activity').session.maxStamina),'Player attacks must consume stamina');
  await page.getByRole('button',{name:'Leave practice',exact:true}).click();
  await page.waitForFunction(()=>window.__pp.game.scene.isActive('World'));
  // Current Exhibition and yard courses are player-steered WorldScene events.
  const ring = practiceDriver(page);
  // Keep idle, cancellation and later success on one reward day.
  await page.evaluate(()=>{
    const {state}=window.__pp,show=state.data.side.show;
    state.data.day=Math.max(state.data.day,show.practiceDay+1);
    state.save();
  });
  const exhibitionProgress=()=>page.evaluate(({xpBase,xpCurve})=>{
    const {state}=window.__pp,hero=state.data.hero||'helen',princess=state.pet('princess');
    const level=princess.level||5;
    let petXp=princess.xp||0;
    for(let n=5;n<level;n++)petXp+=Math.round(xpBase+n*n*xpCurve);
    return {day:state.data.day,practiceDay:state.data.side.show.practiceDay,practice:state.data.side.show.practice,
      handling:state.data.playerSkills?.[hero]?.handling||0,petXp};
  },{xpBase:BALANCE.xpBase,xpCurve:BALANCE.xpCurve});
  const exhibitionBaseline=await exhibitionProgress();
  const startExhibitionPractice=async()=>{
    await ring.start();
  };
  const completeExhibitionPractice=async()=>{
    await startExhibitionPractice();
    await ring.finish();
    assert.equal(await page.evaluate(() => window.__practiceMessages.filter(
      line => typeof line === 'string' && line.includes('raises a score card:')).length), 3,
    'A completed Exhibition run must pass through all three judges');
    return await exhibitionProgress();
  };
  await startExhibitionPractice();
  await ring.idle();
  await ring.cancel();
  assert.deepEqual(await exhibitionProgress(),exhibitionBaseline,
    'Waiting without completing a course must not consume the daily XP reward');
  await startExhibitionPractice();
  await ring.cancel();
  const cancelledExhibitionResult=await page.evaluate(async()=>await window.__exhibitionPractice);
  assert.equal(cancelledExhibitionResult,undefined,'Cancelling Exhibition practice must retain its existing early-exit behavior');
  assert.deepEqual(await exhibitionProgress(),exhibitionBaseline,
    'Cancelling Exhibition practice must not change show practice or either XP reward');
  const completedExhibitionProgress=await completeExhibitionPractice();
  assert.equal(completedExhibitionProgress.practiceDay,exhibitionBaseline.day,
    'A completed Exhibition run later that day must record its daily reward');
  assert.equal(completedExhibitionProgress.practice,exhibitionBaseline.practice+1,
    'A qualifying Exhibition run must count once toward show preparation');
  assert.equal(completedExhibitionProgress.handling,exhibitionBaseline.handling+35,
    'A qualifying Exhibition run must award 35 handling XP exactly once');
  assert.equal(completedExhibitionProgress.petXp,exhibitionBaseline.petXp+35,
    'A qualifying Exhibition run must award 35 pet XP exactly once');
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.__pp?.game.scene.isActive('World')&&window.__pp.game.scene.getScene('World').regionId==='exhibition');
  const recoveredExhibitionProgress=await exhibitionProgress();
  assert.deepEqual(recoveredExhibitionProgress,completedExhibitionProgress,
    'Exhibition practice progress and both XP totals must survive a save reload');
  const replayedExhibitionProgress=await completeExhibitionPractice();
  assert.equal(replayedExhibitionProgress.practiceDay,completedExhibitionProgress.practiceDay,
    'A same-day Exhibition replay after reload must retain the reward day');
  assert.equal(replayedExhibitionProgress.practice,completedExhibitionProgress.practice+1,
    'A qualifying same-day Exhibition replay may count as another practice');
  assert.equal(replayedExhibitionProgress.handling,completedExhibitionProgress.handling,
    'A same-day Exhibition replay after reload must not award handling XP twice');
  assert.equal(replayedExhibitionProgress.petXp,completedExhibitionProgress.petXp,
    'A same-day Exhibition replay after reload must not award pet XP twice');
  await page.evaluate(()=>{window.__pp.ui.baking({name:'Test scones',recipe:'scones'});});
  await page.getByRole('heading',{name:'Test scones',exact:true}).waitFor();
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  assert.equal(await page.evaluate(()=>window.__pp.ui.modalOpen),false,'Cancelling baking must close and clean up');
  // Follow the new Woods encounter and care tutorial in this disposable save.
  await page.evaluate(()=>{
    const {state,ui,game}=window.__pp;
    state.data.minutes=9*60;state.data.day=1;state.data.story.chapter=0;
    ui.closeModal();ui.dialog=null;document.getElementById('dialog').hidden=true;
    game.scene.getScene('World').scene.restart({region:'woods',entry:'allen'});
  });
  await page.waitForFunction(()=>window.__pp.game.scene.getScene('World').regionId==='woods'&&window.__pp.game.scene.getScene('World').npcs?.some(n=>n.id==='gordon'));
  const marty = await page.evaluate(async()=>{
    const {state,ui,game}=window.__pp,world=game.scene.getScene('World');
    const say=ui.say,battle=world.startBattle;
    let encounter=null;
    try {
      // Only dialogue and the battle result are accelerated; recruitment and
      // follower spawning run through the real challenge and winPet methods.
      ui.say=async()=>true;
      world.startBattle=async opts=>{encounter=opts.trainer;return {outcome:'win'};};
      world.player.setPosition(20.5*16,12.5*16);
      if(!world.checkMartyEncounter())throw new Error('Woods approach failed');
      for(let frame=0;frame<100&&!state.data.flags.martyCare;frame++)await new Promise(resolve=>setTimeout(resolve,10));
      if(!state.data.flags.martyCare)throw new Error('Marty challenge did not complete');
    } finally {ui.say=say;world.startBattle=battle;}
    return {encounter,found:state.isFound('marty'),party:state.data.party,hp:state.pet('marty').hp,care:state.data.flags.martyCare,texture:game.textures.exists('pet-marty'),following:world.pets.some(p=>p.id==='marty'&&p.mode==='follow')};
  });
  assert.equal(marty.encounter,'gordon');assert.ok(marty.found&&marty.party.includes('marty')&&marty.following&&marty.texture&&marty.care&&marty.hp>0);
  await page.evaluate(()=>window.__pp.ui.openModal('phone'));
  await page.getByRole('button',{name:'Marty could use a treat. Open Bag',exact:true}).click();
  await page.getByRole('button',{name:/^Marty ·/}).click();
  await page.getByRole('status').filter({hasText:/Marty loves the treat/}).waitFor();
  assert.equal(await page.evaluate(()=>window.__pp.state.pet('marty').hp),null,'Bag treatment must fully restore Marty');
  assert.equal(await page.evaluate(()=>window.__pp.state.data.flags.martyCare),false,'Successful treatment must clear the tutorial');
  await page.evaluate(()=>window.__pp.ui.closeModal());
  // Actual yard practice stays in WorldScene, with persistent obstacles.
  await page.evaluate(()=>{
    const {state,ui,game}=window.__pp;ui.closeModal();ui.closeModal();state.addItem('coursekit');
    state.findPet('princess');state.setParty(['princess']);
    state.data.day=Math.max(state.data.day,state.data.side.show.practiceDay+1);
    state.save();
    game.scene.getScene('World').scene.restart({region:'yard',entry:'backdoor'});
  });
  await page.waitForFunction(()=>window.__pp.game.scene.getScene('World').regionId==='yard'&&window.__pp.game.scene.getScene('World').yardCourse);
  const yardBaseline=await page.evaluate(()=>{
    const {state}=window.__pp,hero=state.data.hero||'helen';
    return {day:state.data.day,practiceDay:state.data.side.show.practiceDay,practice:state.data.side.show.practice,
      handling:state.data.playerSkills?.[hero]?.handling||0,petXp:state.pet('princess').xp||0};
  });
  const startYardPractice=async()=>{
    await ring.start();
  };
  const finishYardPractice=async({wrongCueCount=0}={})=>{
    await ring.finish({wrongCueCount});
  };
  const yardProgress=()=>page.evaluate(({xpBase,xpCurve})=>{
    const {state}=window.__pp,hero=state.data.hero||'helen',princess=state.pet('princess');
    // Saved XP is the remainder after level-ups, so compare lifetime-earned XP.
    const level=princess.level||5;
    let petXp=princess.xp||0;
    for(let n=5;n<level;n++)petXp+=Math.round(xpBase+n*n*xpCurve);
    return {day:state.data.day,practiceDay:state.data.side.show.practiceDay,practice:state.data.side.show.practice,
      handling:state.data.playerSkills?.[hero]?.handling||0,petXp};
  },{xpBase:BALANCE.xpBase,xpCurve:BALANCE.xpCurve});
  await startYardPractice();
  await ring.idle();
  await ring.cancel();
  assert.deepEqual(await yardProgress(),yardBaseline,'An idle, abandoned yard run must not change show practice or consume the daily XP reward');
  await startYardPractice();
  await finishYardPractice();
  const firstYardResult=await yardProgress();
  assert.equal(firstYardResult.practiceDay,yardBaseline.day,'A completed yard practice must record its reward day');
  assert.equal(firstYardResult.practice,yardBaseline.practice+1,'A qualifying yard practice must count once toward show preparation');
  assert.equal(firstYardResult.handling,yardBaseline.handling+35,'A qualifying yard practice must award 35 handling XP exactly once');
  assert.equal(firstYardResult.petXp,yardBaseline.petXp+35,'A qualifying yard practice must award 35 pet XP exactly once');
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>window.__pp?.game.scene.isActive('World')&&window.__pp.game.scene.getScene('World').regionId==='yard');
  const recoveredYardResult=await yardProgress();
  assert.deepEqual(recoveredYardResult,firstYardResult,'Yard practice reward and progress must recover from the saved game after reload');
  await startYardPractice();
  await finishYardPractice();
  const replayYardResult=await yardProgress();
  assert.equal(replayYardResult.practiceDay,firstYardResult.practiceDay,'Same-day replay must not move the reward day');
  assert.equal(replayYardResult.practice,firstYardResult.practice+1,'A qualifying same-day replay may count as another practice');
  assert.equal(replayYardResult.handling,firstYardResult.handling,'Same-day replay must not award handling XP again');
  assert.equal(replayYardResult.petXp,firstYardResult.petXp,'Same-day replay must not award pet XP again');
  await startYardPractice();
  await ring.station(1);
  await ring.station(2,{finishAction:false});
  await ring.cancel();
  assert.deepEqual(await yardProgress(),replayYardResult,'Cancelling during the final jump must not add a practice or change either reward');
  const dayAfterYardAdvance=await page.evaluate(()=>{
    const {state}=window.__pp;
    state.newDay();
    state.save();
    return state.data.day;
  });
  assert.equal(dayAfterYardAdvance,replayYardResult.day+1,'The disposable save must advance exactly one day before fresh practice');
  const nextDayYardBaseline=await yardProgress();
  assert.equal(nextDayYardBaseline.practiceDay,replayYardResult.practiceDay,'Advancing the day must leave the previous reward day recorded until practice is completed');
  await startYardPractice();
  await finishYardPractice();
  const nextDayYardResult=await yardProgress();
  assert.equal(nextDayYardResult.practiceDay,nextDayYardBaseline.day,'A completed yard practice must record the newly advanced reward day');
  assert.equal(nextDayYardResult.practice,nextDayYardBaseline.practice+1,'Qualifying practice on a new day must count once toward show preparation');
  assert.equal(nextDayYardResult.handling,nextDayYardBaseline.handling+35,'The new day must award 35 handling XP exactly once');
  assert.equal(nextDayYardResult.petXp,nextDayYardBaseline.petXp+35,'The new day must award 35 pet XP exactly once');
  await startYardPractice();
  await finishYardPractice();
  const nextDayReplayResult=await yardProgress();
  assert.equal(nextDayReplayResult.practiceDay,nextDayYardResult.practiceDay,'Later-day replay must not move the reward day');
  assert.equal(nextDayReplayResult.practice,nextDayYardResult.practice+1,'A qualifying later-day replay may count as another practice');
  assert.equal(nextDayReplayResult.handling,nextDayYardResult.handling,'Later-day replay must not award handling XP again');
  assert.equal(nextDayReplayResult.petXp,nextDayYardResult.petXp,'Later-day replay must not award pet XP again');
  const lowScoreDay=await page.evaluate(()=>{
    const {state}=window.__pp;state.newDay();state.save();return state.data.day;
  });
  const lowScoreBaseline=await yardProgress();
  assert.equal(lowScoreDay,lowScoreBaseline.day,'The low-score practice check must use a fresh day');
  await startYardPractice();
  await finishYardPractice({wrongCueCount:6});
  const lowScoreResult=await yardProgress();
  const lowScoreMessage=await page.evaluate(()=>window.__yardPracticeResultMessage);
  const lowScore=Number(lowScoreMessage?.match(/:\s*(\d+)\/100\./)?.[1]);
  assert.ok(Number.isInteger(lowScore)&&lowScore<60,`The yard run must finish below its 60-point qualifying score (got ${lowScoreMessage})`);
  assert.equal(lowScoreResult.practiceDay,lowScoreBaseline.day,'A completed low-score run must record the daily reward day');
  assert.equal(lowScoreResult.practice,lowScoreBaseline.practice,'A non-qualifying yard run must not count toward show preparation');
  assert.equal(lowScoreResult.handling,lowScoreBaseline.handling+10,'A non-qualifying run must award exactly 10 handling XP');
  assert.equal(lowScoreResult.petXp,lowScoreBaseline.petXp+10,'A non-qualifying run must award exactly 10 pet XP');
  await startYardPractice();
  await finishYardPractice({wrongCueCount:6});
  const lowScoreReplay=await yardProgress();
  const lowScoreReplayMessage=await page.evaluate(()=>window.__yardPracticeResultMessage);
  const lowScoreReplayScore=Number(lowScoreReplayMessage?.match(/:\s*(\d+)\/100\./)?.[1]);
  assert.ok(Number.isInteger(lowScoreReplayScore)&&lowScoreReplayScore<60,'The same-day replay must also remain non-qualifying');
  assert.deepEqual(lowScoreReplay,lowScoreResult,'A same-day non-qualifying replay must not award XP or add show practice');
  await page.evaluate(()=>window.__pp.ui.openModal('phone'));
  // Completing practice can clear the unread count; the app remains available.
  await page.getByRole('button',{name:/^To Do/}).click();
  // A finished tutorial moves to the Completed tab.
  await page.getByRole('button',{name:'Completed',exact:true}).click();
  await page.getByText('Practise the yard course',{exact:true}).waitFor();
  await page.evaluate(()=>{window.__pp.ui.closeModal();window.__pp.ui.closeModal();});
  // Concrete screenshot-reference cases, using only this disposable save.
  if (screenshotDir) await mkdir(screenshotDir, { recursive: true });
  for (const [region, x, y] of [
    ['allen', 19, 27], ['lohse', 4, 24], ['lohse', 37, 24], ['bunnings', 15, 10],
  ]) {
    await page.evaluate(({ region }) => {
      const { state, ui, game } = window.__pp;
      ui.closeModal(); ui.dialog = null; document.getElementById('dialog').hidden = true;
      state.data.flags.parkTutorial = true;
      if (!state.data.visited.includes(region)) state.data.visited.push(region);
      game.scene.getScene('World').scene.restart({ region });
    }, { region });
    await page.waitForFunction(region =>
      window.__pp.game.scene.getScene('World').regionId === region &&
      window.__pp.game.scene.getScene('World').player?.active, region);
    await page.evaluate(({ x, y }) => {
      const world = window.__pp.game.scene.getScene('World');
      world.player.setPosition((x + .5) * 16, (y + .75) * 16);
      world.navigation.cancel(); world.setupCamera();
    }, { x, y });
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 740 });
      await page.waitForTimeout(150);
      assert.ok(await page.evaluate(() => [...document.querySelectorAll('#hud button')]
        .every(button => { const r = button.getBoundingClientRect();
          return r.width > 0 && r.left >= 0 && r.right <= innerWidth; })),
      `${region} HUD controls, including Phone, must fit ${width}px`);
    }
    if (screenshotDir) await page.screenshot({ path: resolve(screenshotDir, `${region}-${x}-${y}.png`) });
    if (region === 'lohse') assert.ok(await page.evaluate(() =>
      !window.__pp.game.scene.getScene('World').map.objects.some(o =>
        o.kind === 'fence' && o.x === 38)), 'The circled eastern Lohse fence must be removed');
  }
  await page.evaluate(() => {
    const { state, ui, game } = window.__pp;
    ui.closeModal(); ui.dialog = null; document.getElementById('dialog').hidden = true;
    if (!state.data.visited.includes('yard')) state.data.visited.push('yard');
    game.scene.getScene('World').scene.restart({ region: 'yard', entry: 'backdoor' });
  });
  await page.waitForFunction(() => window.__pp.game.scene.getScene('World').regionId === 'yard' &&
    window.__pp.game.scene.getScene('World').interactables?.some(t =>
      t.lines?.flat().some(line => line.includes('H&P 4eva'))));
  await page.evaluate(() => {
    const target = window.__pp.game.scene.getScene('World').interactables.find(t =>
      t.lines?.flat().some(line => line.includes('H&P 4eva')));
    window.__pp.ui.say(target.lines[0]);
  });
  await page.getByText(/H&P 4eva/).waitFor();
  if (screenshotDir) await page.screenshot({ path: resolve(screenshotDir, 'yard-inscription.png') });
  await page.evaluate(() => {
    for (let i = 0; i < 5 && window.__pp.ui.dialog; i++) window.__pp.ui.advance();
  });
  // All HUD and battle controls must fit narrow phone viewports.
  for(const width of [320,390]){
    await page.setViewportSize({width,height:740});
    assert.ok(await page.evaluate(()=>Array.from(document.querySelectorAll('#hud button')).every(b=>{const r=b.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;})),'HUD buttons overflowed');
    await page.evaluate(()=>{window.__pp.game.scene.getScene('World').startBattle({wild:{id:'bag',level:2}});});
    await page.waitForFunction(()=>window.__pp.game.scene.isActive('Battle'));
    await page.waitForFunction(()=>!!document.querySelector('#btMenu button'));
    await page.getByRole('button',{name:'Fight',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('#btMenu')?.classList.contains('moves'));
    assert.ok(await page.evaluate(()=>Array.from(document.querySelectorAll('#btMenu button')).every(b=>{const r=b.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;})),'Move buttons overflowed');
    await page.evaluate(()=>window.__pp.game.scene.getScene('Battle').finish('run'));
    await page.waitForFunction(()=>window.__pp.game.scene.isActive('World'));
  }
  // Catch errors from the first few title-screen frames as well as initial loading.
  await page.waitForTimeout(300);
} catch (error) {
  errors.push(error.stack || String(error));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}

if (errors.length) {
  console.error(`Production-build smoke check failed:\n${errors.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Production-build smoke check passed at ${base}: title, map, tab resume and title return, Princess/Julie catch-up, Marty/care, activities, in-world Exhibition judging/cancel/reward reload and replay, yard-practice idle/reward/replay/cancel/reload recovery and low-score XP, phone/battle controls, Lohse fence and H&P inscription, ${manifest.files.length} manifest sprites, ${startup.artwork.bindings.length} assigned artwork bindings, stable-ID artwork, editor excluded, no JavaScript errors or failed requests.`);
}
