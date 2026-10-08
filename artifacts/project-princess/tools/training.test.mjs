import test from 'node:test';
import assert from 'node:assert/strict';
import { TrainingSession, lessonPlan, ACTIVITIES } from '../game/src/systems/training.js';

const opts = { id:'princess',name:'Princess',day:1,heroName:'Helen' };
const wait = (s, condition, limit=30000) => {
  for (let t=0;t<limit && !condition();t+=50) s.advance(50);
  assert.ok(condition(), `${s.activity}: ${s.status}`);
};
test('every lesson can finish three clean runs through its own controls', () => {
  for (const activity of Object.keys(ACTIVITIES)) {
    const s=new TrainingSession(opts,activity);s.action();
    for (let run=1;run<=3;run++) {
      if (activity==='recall') { wait(s,()=>s.attentive);s.action(); }
      if (activity==='settle') { s.action();wait(s,()=>s.calm>=1);s.action(); }
      if (activity==='agility') { wait(s,()=>s.petX>=s.hurdle-10);s.action(); }
      if (activity==='fetch') { wait(s,()=>Math.abs(s.aim-s.target)<10);s.action(); }
      if (activity==='scent') { wait(s,()=>s.clock>=1500);s.action(s.box); }
      if (activity==='lead') {
        for (let t=0;t<9000&&s.phase==='playing';t+=50) { s.action();s.advance(50); }
      }
      wait(s,()=>s.phase==='feedback');
      wait(s,()=>s.phase!=='feedback');
    }
    assert.equal(s.complete,true);assert.equal(s.score,3);
  }
});
test('an early jump and an unlimited wait do not lose an obstacle run', () => {
  const s=new TrainingSession(opts,'agility');s.action();s.action();
  wait(s,()=>s.petX>=s.hurdle-10);
  for(let t=0;t<10000;t+=50)s.advance(50);
  assert.equal(s.round,1);assert.equal(s.phase,'playing');
  assert.equal(s.jump,0);s.action();wait(s,()=>s.phase==='feedback');assert.equal(s.score,1);
});
test('early rewards, wrong boxes and restarts remain recoverable',()=>{
  const settle=new TrainingSession(opts,'settle');settle.action();settle.action();settle.action();
  assert.equal(settle.phase,'playing');wait(settle,()=>settle.calm>=1);settle.action();assert.equal(settle.score,1);
  const scent=new TrainingSession(opts,'scent');scent.action();wait(scent,()=>scent.clock>=1500);
  scent.action((scent.box+1)%scent.boxCount);wait(scent,()=>scent.stage==='play');
  assert.equal(scent.round,1);assert.equal(scent.openBoxes.length,1);
  scent.action(scent.box);wait(scent,()=>scent.phase==='feedback');
  const agility=new TrainingSession(opts,'agility');agility.action();agility.advance(100);agility.retry();
  assert.equal(agility.round,1);assert.equal(agility.score,0);assert.equal(agility.petX,14);
});
test('days rotate all six activities, pets differ and old saved progress raises the stage',()=>{
  const choices=new Set(Array.from({length:6},(_,i)=>lessonPlan({...opts,day:i+1}).choices).flat());
  assert.equal(choices.size,6);
  assert.notDeepEqual(lessonPlan(opts).choices,lessonPlan({...opts,day:2}).choices);
  assert.notEqual(lessonPlan({...opts,id:'chloe'}).pace,lessonPlan({...opts,id:'poppy'}).pace);
  assert.equal(lessonPlan({...opts,skills:{Recall:6}}).level('recall'),1);
  assert.equal(lessonPlan({...opts,skills:{recall:6,Recall:6}}).level('recall'),2);
});

test('advanced courses have two forgiving hurdles and four recoverable scent boxes',()=>{
  const s=new TrainingSession({...opts,skills:{agility:12}},'agility');s.action();
  assert.equal(s.hurdles.length,2);
  for(let hurdle=0;hurdle<2;hurdle++) {
    wait(s,()=>s.petX>=s.hurdle-10&&s.jump===0);s.action();
    wait(s,()=>s.hurdleIndex===hurdle+1);
  }
  wait(s,()=>s.phase==='feedback');assert.equal(s.score,1);
  const scent=new TrainingSession({...opts,skills:{scent:12}},'scent');scent.action();assert.equal(scent.boxCount,4);
});
