// Yard practice runs in WorldScene. No scene switch or arena background.
import { state } from './state.js';
import { CourseSession, CUES } from './course.js';
import { ui } from '../ui/ui.js';
import { h } from '../ui/dom.js';
import { controls } from './controls.js';
import { petTex } from './forms.js';
import { petSize } from '../data/pet-sizes.js';
import { animationFrames, frameAt } from '../data/animation-layouts.js';
import { frameCount, custom } from '../art/textures.js';
export const YARD_AREA = { x: 2, y: 6, w: 15, h: 8 };
export const yardTier = () => state.count('weavekit') ? 'open' : state.count('courseextension') ? 'novice' : state.count('coursekit') ? 'yardstarter' : null;
export const yardPoint = p => ({ x: (YARD_AREA.x + p.x / 100 * YARD_AREA.w)*16, y:(YARD_AREA.y + p.y / 100 * YARD_AREA.h)*16 });
export function paintYardCourse(world, tier = yardTier()) {
  const objects = [], session = tier ? new CourseSession(tier,0) : null;
  if (!session) return {destroy(){}};
  const g = world.add.graphics().setDepth(2); objects.push(g);
  for (const [i,s] of session.stations.entries()) {
    const p = yardPoint(s);
    if(s.kind==='jump') {
      g.fillStyle(0xad5241).fillRect(p.x-8,p.y-12,3,14).fillRect(p.x+5,p.y-12,3,14);
      g.fillStyle(0xf7e4b1).fillRect(p.x-8,p.y-8,16,2);
    } else if(s.kind==='tunnel') {
      g.fillStyle(0x4975a0).fillRoundedRect(p.x-10,p.y-10,20,12,5);
      g.fillStyle(0x24394b).fillEllipse(p.x-6,p.y-3,7,8);
    } else if(s.kind==='weave') {
      for(let j=-2;j<=2;j++)g.fillStyle(j%2?0xebc966:0xb9493f).fillRect(p.x+j*5,p.y-12,2,14);
    } else g.lineStyle(2,s.kind==='stay'?0xe9c967:0x7db7ae).strokeEllipse(p.x,p.y,17,7);
    objects.push(world.add.text(p.x,p.y+4,`${i+1}`,{fontSize:'6px',color:'#f5e4c6',backgroundColor:'#49603b'}).setOrigin(.5).setDepth(3));
  }
  return { destroy(){objects.forEach(o=>o.destroy());} };
}
export function startYardCourse(world, pet, tier) {
  return new Promise(resolve=>{
    const session = new CourseSession(tier,0), original = {x:world.player.x,y:world.player.y};
    const actor = world.pets.find(p=>p.id===pet), visible=actor?.visible;
    actor?.setVisible(false);
    const dog = world.add.sprite(0,0,petTex(pet),0).setOrigin(.5,1);
    dog.setDisplaySize(petSize(pet)*dog.frame.realWidth/dog.frame.realHeight,petSize(pet));
    const status=h('p',{class:'small',role:'status','aria-live':'polite'});
    const needle=h('span',{class:'bake-marker'});
    const timing=h('div',{class:'bake-track'},h('span',{class:'bake-band',style:{left:'48%',width:'38%'}}),needle);
    let ended=false;
    const finish = complete => {
      if(ended)return;ended=true;
      world.events.off('update',tick); world.events.off('shutdown',cancel);
      bar.remove();dog.destroy();actor?.setVisible(visible);
      world.player.setPosition(original.x,original.y); world.trail.length=0;
      document.body.classList.remove('yard-practice');ui.activity=null;controls.release();
      resolve({...session.result(),cancelled:!complete,complete});
    };
    const cue = id=>{session.cue(id);world.player.perform?.('wave');};
    const buttons=h('div',{class:'activity-buttons'},...Object.entries(CUES).map(([id,label])=>h('button',{class:'wood-btn small',onclick:()=>cue(id),'data-cue':id},label)));
    const bar=h('section',{class:'yard-course-bar','aria-label':'Yard agility practice'},
      h('b',{},session.course.name),status,timing,buttons,
      h('button',{class:'wood-btn small',onclick:()=>finish(session.complete)},'Leave practice'));
    document.body.append(bar);document.body.classList.add('yard-practice');
    ui.activity={action:()=>session.complete?finish(true):cue(session.phase==='weaving'?(session.weaveCount%2?'right':'left'):session.phase==='performing'?'recall':session.station?.kind),cancel:()=>finish(false)};
    const tick = (_time,delta)=>{
      session.tick(Math.min(.05,delta/1000));
      const p=yardPoint(session),moving=session.moving;
      dog.setPosition(p.x,p.y-session.jump*.4).setFlipX(!!session.flip).setDepth(p.y);
      const frames=animationFrames(dog.texture.key,frameCount(world,dog.texture.key),session.jump?'jump':moving?'walk':'idle',!custom.has(dog.texture.key));
      dog.setFrame(frameAt(frames,session.time*1000,moving?9:6));
      dog.setAlpha(session.phase==='performing'&&session.station?.kind==='tunnel'?.5:1);
      world.player.setPosition(p.x-12,p.y+7);world.player.setDepth(p.y+7);
      status.textContent=`${session.status} Station ${Math.min(session.index+1,session.stations.length)}/${session.stations.length} · ${session.score}/100`;
      timing.hidden=!(session.phase==='waiting'&&session.station?.kind==='jump');needle.style.left=`${session.timing*100}%`;
      for(const button of buttons.children){const id=button.dataset.cue;button.hidden=['left','right'].includes(id)!==(session.phase==='weaving');button.disabled=session.phase==='walking'||(session.phase==='performing'&&session.station?.kind!=='stay');}
      if(session.complete)finish(true);
    };
    const cancel=()=>finish(false);
    world.events.on('update',tick);world.events.once('shutdown',cancel);
  });
}
