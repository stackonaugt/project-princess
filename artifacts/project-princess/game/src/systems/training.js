import { hash } from '../util.js';

export const ACTIVITIES = {
  recall: { title: 'Recall', action: 'Call', help: 'Wait for a check-in, then call your pet back. They will walk back to you; calling while distracted gives them a little more thinking time.' },
  settle: { title: 'Settle and stay', action: 'Settle', help: 'Cue a settle, then wait for the calm bar to fill before rewarding. An early reward is a chance to try again.' },
  agility: { title: 'Obstacle course', action: 'Jump', help: 'Your pet waits at each hurdle. Press Jump to clear it. Early jumps are fine: you can jump again or restart this run.' },
  fetch: { title: 'Fetch', action: 'Throw', help: 'The throw marker moves across the grass. Throw when it reaches the highlighted patch, then watch your pet retrieve the toy.' },
  scent: { title: 'Find the toy', action: 'Search', help: 'Watch where the toy is hidden, then choose a box. Empty boxes stay open, so you can keep searching.' },
  lead: { title: 'Loose lead walk', action: 'Easy', help: 'Walk together. Press Easy when your pet pulls ahead to bring them gently beside you. Keep the gap in the green zone.' },
};
const PROFILES = {
  princess: { pace: .85, toy: 'ribbon', order: ['recall','settle','fetch','scent','agility','lead'], detail: 'Princess likes a fuss and a ribbon. Give her time to check in.' },
  salami: { pace: .8, toy: 'feather', order: ['scent','fetch','settle','agility','recall','lead'], detail: 'Salami prefers a feather hunt to being bossed about. Let curiosity do the work.' },
  spooky: { pace: 1.05, toy: 'squeaky toy', order: ['agility','scent','recall','fetch','lead','settle'], detail: 'Spooky changes direction quickly. Short, clear cues work best.' },
  poppy: { pace: .65, toy: 'ball', order: ['fetch','scent','agility','settle','lead','recall'], detail: 'Poppy works in short bursts. The hurdles are low and the pace is gentle.' },
  chloe: { pace: 1.2, toy: 'tennis ball', order: ['lead','agility','recall','fetch','scent','settle'], detail: 'Chloe wants a job. Work on checking in and keeping a loose lead between bursts of speed.' },
  rusty: { pace: .65, toy: 'soft toy', order: ['scent','settle','recall','lead','fetch','agility'], detail: 'Rusty gets a steady pace and plenty of time to sniff.' },
};
export function lessonPlan({ id, day, skills = {}, behaviour, species = '' }) {
  const profile = PROFILES[id] || { pace: behaviour === 'zoomies' ? 1.15 : .9, toy: /cat/i.test(species) ? 'feather' : 'ball', order: Object.keys(ACTIVITIES), detail: 'Work at your pet’s pace and reward the behaviour you want.' };
  const offset = (day - 1 + Math.floor(hash(id.length, id.charCodeAt(0), 12) * 6)) % 6;
  const choices = [0,1,2].map(i => profile.order[(offset + i) % 6]);
  const legacy = { recall: 'Recall', settle: 'Settle', agility: 'Obstacle course' };
  return { ...profile, choices, level: activity => Math.min(3, Math.floor(((skills[activity] || 0) + (skills[legacy[activity]] || 0)) / 6)) };
}

// Pure simulation, driven by elapsed time and player actions. No timers or DOM.
export class TrainingSession {
  constructor(opts, activity) {
    this.opts = opts; this.profile = lessonPlan(opts); this.activity = activity;
    this.level = this.profile.level(activity); this.name = opts.name; this.hero = opts.heroName || 'Helen';
    this.round = 0; this.score = 0; this.phase = 'ready'; this.clock = 0; this.petX = 60; this.heroX = 10;
    this.status = `${this.profile.detail} Today’s setup changes with the day and your progress.`;
    this.moving = false; this.heroMoving = false; this.petY = 0; this.flip = false;
  }
  get complete() { return this.phase === 'complete'; }
  get label() { return this.activity === 'settle' && this.stage === 'calm' ? 'Reward' : ACTIVITIES[this.activity].action; }
  next() {
    this.round++; this.clock = 0; this.stage = 'play'; this.phase = 'playing'; this.petY = 0;
    this.calm = 0; this.calmTime = 0; this.attentive = false;
    this.clean = true; this.attempts = 0; this.focus = 0; this.goodTime = 0; this.easyFor = 0;
    this.seed = hash(this.opts.day, this.round, this.opts.id.charCodeAt(0));
    this.target = 35 + this.seed * 40;
    this.attentionAt = 900 + this.seed * 1200;
    this.petX = this.activity === 'agility' ? 14 : this.activity === 'lead' ? 22 : 58;
    this.heroX = 10;
    this.hurdles = this.level > 0 ? [35+this.seed*5,65+this.seed*5] : [45+this.seed*20];
    this.hurdleIndex = 0; this.hurdle = this.hurdles[0];
    this.throwTolerance = 19-this.level*2;
    this.jump = 0; this.jumpQueued = 0; this.boxCount = this.level >= 2 ? 4 : 3;
    this.box = Math.floor(this.seed * this.boxCount); this.openBoxes = []; this.aim = 15;
    this.status = `Run ${this.round} of 3. ${ACTIVITIES[this.activity].help}`;
  }
  finishRound(clean = true) {
    this.score += clean ? 1 : 0; this.phase = 'feedback'; this.feedback = 1300;
    this.moving = false; this.heroMoving = false; this.petY = 0;
    this.status = clean ? `${this.name} did it. ${this.hero} rewards the effort.` : `${this.name} practised successfully. Try a calmer cue next time.`;
  }
  retry() { if (this.phase === 'playing') { this.round--; this.next(); this.status = 'Take your time. This run has restarted.'; } }
  action(box = null) {
    if (this.phase === 'ready') return this.next();
    if (this.phase !== 'playing') return;
    const a = this.activity;
    if (a === 'recall' && this.stage === 'play') {
      this.clean = this.attentive; this.stage = 'return'; this.thinking = this.clean ? 0 : 650;
      this.status = this.clean ? `${this.hero} calls. ${this.name} comes running!` : `${this.name} finishes sniffing, then comes back to ${this.hero}.`;
    } else if (a === 'settle') {
      if (this.stage === 'play') { this.stage = 'calm'; this.calmTime = 0; this.status = `${this.name} settles. Wait for a full moment of calm.`; }
      else if (this.calmTime >= 1300 + this.level * 250) this.finishRound();
      else this.status = 'Almost. Keep waiting for the calm bar to fill, then reward.';
    } else if (a === 'agility') {
      if (this.jump > 0) return;
      this.jump = 650; this.jumpQueued = 600;
      this.status = 'Jump cued. You can cue another jump if this one was early.';
    } else if (a === 'fetch' && this.stage === 'play') {
      this.ball = this.aim; this.clean = Math.abs(this.ball - this.target) < this.throwTolerance;
      this.stage = 'out'; this.status = `${this.name} chases the ${this.profile.toy}!`;
    } else if (a === 'scent' && this.clock >= 1500 && this.stage === 'play') {
      const choice = box ?? this.focus;
      this.chosenBox = choice; this.stage = 'search'; this.status = `${this.name} sniffs box ${choice + 1}...`;
    } else if (a === 'lead') { this.easyFor = 1100; this.status = `${this.hero} says “easy”. The lead goes slack.`; }
  }
  advance(delta) {
    const dt = Math.max(0, Math.min(100, delta)), seconds = dt / 1000;
    this.clock += dt;
    if (this.phase === 'feedback') {
      this.feedback -= dt;
      if (this.feedback <= 0) { if (this.round >= 3) { this.phase = 'complete'; this.status = `${this.score}/3 calm, clean runs. ${this.name} has finished today’s practice.`; } else this.next(); }
      return;
    }
    if (this.phase !== 'playing') return;
    const speed = 24 * this.profile.pace, a = this.activity;
    this.moving = false; this.heroMoving = false; this.petY = 0;
    if (a === 'recall') {
      if (this.stage === 'play') {
        this.attentive = Math.floor(Math.max(0,this.clock - this.attentionAt) / (1500-this.level*150)) % 2 === 0 && this.clock >= this.attentionAt;
        const x = 58 + Math.sin(this.clock / 600) * 8; this.flip = this.attentive; this.moving = !this.attentive; this.petX = x;
        this.status = this.attentive ? `${this.name} checks in with ${this.hero}. Call now.` : `${this.name} is sniffing around. Wait for a check-in.`;
      } else {
        this.thinking -= dt;
        if (this.thinking <= 0) { this.moving = true; this.flip = true; this.petX -= speed * seconds; if (this.petX <= 18) this.finishRound(this.clean); }
      }
    } else if (a === 'settle') {
      if (this.stage === 'play') { this.moving = true; this.petX = 52 + Math.sin(this.clock/450)*12; this.flip = Math.cos(this.clock/450)<0; }
      else { this.calmTime += dt; this.calm = Math.min(1,this.calmTime/(1300+this.level*250)); this.heroX = 10 + Math.min(12,this.calmTime/150); this.status = this.calm >= 1 ? 'Calm bar full. Reward now.' : 'Let that calm behaviour last a little longer.'; }
    } else if (a === 'agility') {
      this.jump = Math.max(0,this.jump-dt); this.jumpQueued = Math.max(0,this.jumpQueued-dt);
      this.petY = this.jump > 0 ? -Math.sin(this.jump/650*Math.PI)*38 : 0;
      if (this.stage === 'play') {
        if (this.petX < this.hurdle-10) { this.petX += speed*seconds; this.moving = true; }
        else if (this.jump > 120 || this.jumpQueued > 0) {
          this.petX = this.hurdle+8; this.status = 'Over the hurdle!';
          this.hurdleIndex++;
          if (this.hurdleIndex < this.hurdles.length) { this.hurdle=this.hurdles[this.hurdleIndex];this.jumpQueued=0; }
          else this.stage='cleared';
        }
        else this.status = `${this.name} waits at the hurdle. Press Jump whenever you’re ready.`;
      } else { this.petX += speed*seconds; this.moving = true; if (this.petX >= 85) this.finishRound(); }
    } else if (a === 'fetch') {
      if (this.stage === 'play') { this.aim = 15 + (Math.sin(this.clock/(1100-this.level*100))+1)*35; this.status = Math.abs(this.aim-this.target)<this.throwTolerance ? 'Throw marker is in the patch. Throw now.' : 'Aim at the highlighted patch.'; }
      else if (this.stage === 'out') {
        const d = this.ball-this.petX; this.flip = d<0; this.moving = true; this.petX += Math.sign(d)*Math.min(Math.abs(d),speed*seconds);
        if (Math.abs(d)<2) this.stage='return';
      } else { this.moving = true; this.flip = true; this.petX -= speed*seconds; if (this.petX<=18) this.finishRound(this.clean); }
    } else if (a === 'scent') {
      if (this.stage === 'play') {
        this.petX=25+(Math.sin(this.clock/1000)+1)*28; this.moving=true; this.flip=Math.cos(this.clock/1000)<0;
        this.status = this.clock<1500 ? `Watch the ${this.profile.toy}. Remember which box it goes into.` : 'Choose a box to search. Empty boxes are another clue.';
      } else {
        const target=20+this.chosenBox*(60/(this.boxCount-1)), d=target-this.petX;
        this.moving = Math.abs(d)>1; this.flip=d<0; this.petX+=Math.sign(d)*Math.min(Math.abs(d),speed*seconds);
        if (Math.abs(d)<1) {
          if (this.chosenBox===this.box) this.finishRound(this.openBoxes.length===0);
          else { this.openBoxes.push(this.chosenBox); this.stage='play'; this.status='Empty box. Keep searching; no run is lost.'; }
        }
      }
    } else if (a === 'lead') {
      this.heroMoving=true; this.moving=true; this.heroX=10+Math.min(60,this.clock/140);
      this.easyFor=Math.max(0,this.easyFor-dt);
      const target=this.heroX+(this.easyFor>0?8:20+this.profile.pace*3);
      this.petX += (target-this.petX)*Math.min(1,seconds*3);
      this.gap=this.petX-this.heroX; if (this.gap>=4&&this.gap<=15) this.goodTime+=dt;
      this.status = this.gap<=15 ? 'Walking together. The lead is loose.' : `${this.name} is pulling ahead. Give a gentle Easy cue.`;
      if (this.clock>=7000) this.finishRound(this.goodTime>=3000);
    }
  }
}
