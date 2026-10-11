import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { BakingSession, INGREDIENTS } from '../game/src/systems/baking.js';
import { HandlingEvent } from '../game/src/systems/handling-event.js';
import { TrainingSession } from '../game/src/systems/training.js';
import { getMap } from '../game/src/data/regions.js';
import { MOVES } from '../game/src/data/moves.js';

// Pick the best topping and trace the piping pattern exactly.
function finishWell(s) {
  s.chooseTopping(s.toppingChoices()[0].id);
  for (const st of s.pattern()) { for (let i = 1; i < st.length; i++) for (let k = 0; k <= 5; k++) s.pipe(st[i - 1][0] + (st[i][0] - st[i - 1][0]) * k / 5, st[i - 1][1] + (st[i][1] - st[i - 1][1]) * k / 5); s.lift(); }
}


test('home routines retain show station order and never move the handler automatically', () => {
  const area={x:32,y:96,w:240,h:128};
  for (const mode of ['course','obedience']) {
    const home=new HandlingEvent('novice',mode,0,{area});
    const show=new HandlingEvent('novice',mode);
    assert.deepEqual(home.stations.map(s=>s.kind),show.stations.map(s=>s.kind));
    const handler={...home.start}, before={...handler};
    for(let i=0;i<200;i++)home.tick(.05,handler);
    assert.deepEqual(handler,before);
    assert.equal(home.index,0);
    assert.ok(home.stations.every(s=>s.x>=area.x&&s.x<=area.x+area.w&&s.y>=area.y&&s.y<=area.y+area.h));
  }
});
test('a show jump follows a continuous arc and lands exactly at the action endpoint', () => {
  const s=new HandlingEvent();
  s.dog={...s.station};s.nearTime=.5;
  s.cue('jump',{x:s.dog.x+8,y:s.dog.y});
  const end={...s.actionEnd};let previous={...s.dog}, peak=0;
  for(let i=0;i<18;i++){
    s.tick(.05,{x:previous.x+8,y:previous.y});
    assert.ok(Math.hypot(s.dog.x-previous.x,s.dog.y-previous.y)<4);
    previous={...s.dog};peak=Math.max(peak,s.jump);
  }
  assert.ok(peak>11);
  assert.ok(Math.hypot(s.dog.x-end.x,s.dog.y-end.y)<.01);
});
test('school hurdle crossing is continuous and restarting clears the active arc', () => {
  const s=new TrainingSession({id:'princess',name:'Princess',species:'Dog',hero:'helen',day:2,skills:{}},'agility');
  s.action();s.petX=s.hurdle-10;s.action();
  const start=s.petX;
  s.advance(16);
  assert.ok(s.petX>start && s.petX-start<1);
  assert.ok(s.petY<0);
  s.retry();assert.equal(s.jumpAcross,null);assert.equal(s.petY,0);
});
function mix(s, correct=true) {
  for(const i of INGREDIENTS.filter(i=>i.dry))s.pour(i.id,i.target);
  if(correct){s.setMethod('whisk');for(let i=0;i<4;i++)s.stroke();}
  for(const i of INGREDIENTS.filter(i=>!i.dry))s.pour(i.id,i.target);
  s.setMethod('fold');for(let i=0;i<(correct?4:12);i++)s.stroke();
}
test('competition mixing requires the two methods, not just a glossy batter', () => {
  const perfect=new BakingSession({competition:true});mix(perfect);
  const simple=new BakingSession({competition:true});mix(simple,false);
  assert.equal(perfect.stageQuality(),100);
  assert.ok(simple.stageQuality()<=70);
  simple.pour('flour',2);assert.ok(simple.stageQuality()<60);
});
test('a carefully steered competition oven can still produce a winning bake', () => {
  const s=new BakingSession({competition:true});mix(s);s.finishStage();
  for(let i=0;i<1000&&s.st.brown<.62;i++){
    s.setHeat(.6-s.ovenDrift(s.clock+.05));
    s.tick(.05);
  }
  assert.ok(s.st.rise>.95);
  assert.ok(s.stageQuality()>=90);
  s.finishStage();
  finishWell(s);
  assert.equal(s.stageQuality(),100);
  s.finishStage();
  assert.ok(s.results.reduce((n,r)=>n+Math.floor(r.quality/10),0)>=29);
  assert.equal(s.complete,true);
});
test('competition state survives JSON and old ordinary baking remains forgiving', () => {
  const s=new BakingSession({competition:true});mix(s);s.finishStage();s.tick(.1);
  const restored=Object.assign(new BakingSession(),JSON.parse(JSON.stringify(s)));
  assert.equal(restored.competition,true);assert.equal(restored.stageQuality(),s.stageQuality());
  const old=new BakingSession();mix(old,false);assert.ok(old.stageQuality()>=90);
});
test('the compact bake hall keeps all workstations, spectators and a valid return exit', () => {
  const map=getMap('bakeoff');
  assert.equal(map.w,22);assert.equal(map.h,18);
  for(const kind of ['bakeprep','bakeoven','bakedecor'])assert.ok(map.objects.some(o=>o.interact===kind));
  assert.ok(map.npcs.filter(n=>n.id.startsWith('showguest')).length===6);
  assert.ok(map.exits.some(e=>e.to==='moreland'));
});
test('bed moves have physical animations and show play has no automatic correct A cue', async () => {
  assert.equal(MOVES.humpbed.anim,'bed');assert.equal(MOVES.scorchbed.anim,'burnbed');
  const hall=await readFile(new URL('../game/src/systems/hall-events.js',import.meta.url),'utf8');
  assert.match(hall,/if \(guided\) labels.push/);
  assert.match(hall,/if \(guided && session.target\)/);
  assert.match(hall,/action: \(\) => cue\(lastCue\)/);
});
