import { h } from './dom.js';
import { petActionFrames, heroFrames, heroIcon } from './images.js';
import { ACTIVITIES, TrainingSession, lessonPlan } from '../systems/training.js';

export function openTraining(panel, close, opts) {
  const plan = lessonPlan(opts), frames = petActionFrames(opts.id,64,'walk');
  const jumpFrames=petActionFrames(opts.id,64,'jump'),idleFrames=petActionFrames(opts.id,64,'idle');
  const heroName = opts.heroName || 'Helen', personFrames=heroFrames(opts.hero||'helen'),armFrames=heroFrames(opts.hero||'helen',96,'wave');
  let cueAt=-10000;
  if(opts.activity)plan.choices=[opts.activity];
  let activity = plan.choices[0], session = null, raf = 0, last = 0, cleaned = false, lastFrame = -1;
  const title = key => /cat/i.test(opts.species || '') && key==='fetch' ? 'Feather chase' : /cat/i.test(opts.species || '') && key==='agility' ? 'Pounce trail' : ACTIVITIES[key].title;
  const instructions = h('p', { class: 'training-help' });
  const status = h('p', { class:'training-status',role:'status','aria-live':'polite' });
  const tally = h('p',{class:'training-tally'});
  const pet = h('img',{class:'pix training-pet',src:frames[0],alt:opts.name});
  const hero = h('div',{class:'training-person'},h('img',{class:'pix',src:heroIcon(opts.hero || 'helen'),alt:heroName}),h('span',{},heroName));
  const props = h('div',{class:'training-props'});
  const board = h('div',{class:'training-board','aria-label':`${heroName} and ${opts.name} practise together`},props,hero,pet);
  const meter = h('progress',{class:'training-meter',max:1,value:0,'aria-label':'Training progress'});
  const action = h('button',{class:'wood-btn',onclick:()=>act()},'Start practice');
  const retry = h('button',{class:'wood-btn small',hidden:true,onclick:()=>{session?.retry();render();}},'Restart this run');
  const boxes = h('div',{class:'training-box-buttons'});
  const chooser = h('div',{class:'training-choices'},...plan.choices.map(key=>h('button',{class:'wood-btn small',onclick:()=>{activity=key;explain();}},title(key))));
  function explain() {
    instructions.textContent = `${title(activity)}. ${ACTIVITIES[activity].help}`;
    status.textContent = `${plan.detail} ${opts.practice ? 'Extra practice today; no additional XP.' : 'Choose one of today’s three activities.'}`;
    tally.textContent = `Day ${opts.day}. ${title(activity)} stage ${plan.level(activity)+1}.`;
    chooser.children && [...chooser.children].forEach((button,i)=>button.setAttribute('aria-pressed',plan.choices[i]===activity));
  }
  function act(box=null) {
    if (session?.complete) return close();
    if (!session) {
      session=new TrainingSession(opts,activity); chooser.hidden=true; retry.hidden=false;
      session.action(); last=0; raf=requestAnimationFrame(tick);
      if (activity==='scent') boxes.replaceChildren(...Array.from({length:session.boxCount},(_,i)=>h('button',{class:'wood-btn small',onclick:()=>{session.focus=i;act(i);}},`Box ${i+1}`)));
    } else session.action(box);
    cueAt=performance.now();
    render();
  }
  function render() {
    if (!session) return;
    if (status.textContent!==session.status) status.textContent=session.status;
    tally.textContent=`Run ${session.round}/3. Clean runs: ${session.score}. ${session.complete ? 'Practice complete.' : ''}`;
    action.textContent=session.complete?'Finish':session.label;
    action.disabled=session.phase==='feedback' || (activity==='scent'&&session.clock<1500);
    retry.hidden=session.complete || session.phase==='feedback';
    pet.style.left=`${session.petX}%`;
    pet.style.transform=`translateX(-50%) translateY(${session.petY}px) scaleX(${session.flip?-1:1}) ${activity==='settle'&&session.stage==='calm'?'scaleY(.8)':''}`;
    const sequencePet=session.petY<0&&jumpFrames.length?jumpFrames:session.moving?frames:idleFrames;
    const petURL=sequencePet[Math.floor(session.clock/135)%sequencePet.length]||frames[0];
    if(pet.src!==petURL)pet.src=petURL;
    pet.classList.toggle('training-bob',session.moving&&frames.length===1);
    const person=hero.children[0];
    const sequence=performance.now()-cueAt<600&&armFrames.length?armFrames:session.heroMoving?personFrames:[heroIcon(opts.hero||'helen')];
    person.src=sequence[Math.floor(session.clock/140)%sequence.length]||heroIcon(opts.hero||'helen');
    hero.style.left=`${session.heroX}%`;
    hero.classList.toggle('training-person-walking',!!session.heroMoving);
    const decorations=[];
    if (activity==='lead') decorations.push(h('div',{class:'training-lead',style:{left:`${session.heroX}%`,width:`${Math.max(0,session.petX-session.heroX)}%`}}));
    if (activity==='agility') for (const hurdle of session.hurdles) decorations.push(h('div',{class:'training-hurdle',style:{left:`${hurdle}%`,height:opts.id==='poppy'?'22px':'32px'}},h('span',{},'Jump')));
    if (activity==='fetch') {
      decorations.push(h('div',{class:'training-target',style:{left:`${session.target}%`}},'Aim here'));
      decorations.push(h('span',{class:'training-toy',style:{left:`${session.stage==='play'?session.aim:session.stage==='return'?session.petX:session.ball}%`}},plan.toy==='feather'?'Feather':'Toy'));
    }
    if (activity==='scent') for (let i=0;i<session.boxCount;i++) {
      decorations.push(h('div',{class:`training-box ${session.openBoxes.includes(i)?'open':''}`,style:{left:`${20+i*(60/(session.boxCount-1))}%`}},session.clock<1500&&i===session.box?'Toy':session.openBoxes.includes(i)?'Empty':String(i+1)));
      if (boxes.children[i]) { boxes.children[i].disabled=session.clock<1500||session.openBoxes.includes(i)||session.phase!=='playing'||session.stage!=='play';boxes.children[i].setAttribute('aria-pressed',i===session.focus); }
    }
    if (activity==='recall'&&session.stage==='play') decorations.push(h('span',{class:'training-distraction',style:{left:'78%'}},['Bird','Sniff spot','Rolling toy'][(opts.day+session.round)%3]));
    props.replaceChildren(...decorations);
    meter.hidden=!['settle','lead'].includes(activity);
    meter.value=activity==='settle'?(session.calm||0):Math.max(0,Math.min(1,1-Math.abs((session.gap||8)-8)/18));
    meter.setAttribute('aria-label',activity==='settle'?'Calm behaviour':'Loose lead');
  }
  function tick(now) {
    const delta=last?now-last:0;last=now;
    // Suspend the practice clock while the browser tab is hidden.
    if (delta<250) session.advance(delta);
    render(); if (!session.complete) raf=requestAnimationFrame(tick);
  }
  const body=h('div',{class:'m-scroll training-content'},chooser,instructions,board,meter,boxes,status,tally,h('div',{class:'training-controls'},action,retry));
  panel.replaceChildren(h('div',{class:'m-head'},h('h2',{},`${opts.name}: pet school`),h('button',{class:'wood-btn small',onclick:close},'Stop')),body);
  explain();
  return {
    action:()=>act(),
    direction(dx) { if (session&&activity==='scent') { session.focus=(session.focus+dx+session.boxCount)%session.boxCount;render(); } },
    cleanup() { if (cleaned) return;cleaned=true;cancelAnimationFrame(raf);opts.done(session?.complete?{score:session.score,drill:activity,title:title(activity)}:null); },
  };
}
