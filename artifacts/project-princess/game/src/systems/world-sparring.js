import { ui } from '../ui/ui.js';
import { h } from '../ui/dom.js';
import { controls } from './controls.js';

// Equipment training stays in the yard. This is not a new enemy encounter.
export function startWorldSparring(world) {
  return new Promise(resolve => {
    const original = { x: world.player.x, y: world.player.y };
    const target = { x: 14 * 16, y: 11 * 16, hp: 8 };
    const dummy = world.add.graphics().setDepth(target.y);
    dummy.fillStyle(0x72523b).fillRect(target.x - 2, target.y - 24, 4, 25);
    dummy.fillStyle(0xc9a375).fillRoundedRect(target.x - 9, target.y - 23, 18, 18, 5);
    dummy.fillStyle(0x342a21).fillCircle(target.x - 3, target.y - 17, 1).fillCircle(target.x + 3, target.y - 17, 1);
    const status = h('p', {role:'status'}, 'Move with the joystick. Tap the world to swing or aim.');
    let weapon = 'sword', cooldown = 0, elapsed = 0, ended = false;
    const effects = new Set();
    const equipment = h('div', {class:'hall-cues'},
      ...['sword', 'water'].map(id => h('button', {class:'wood-btn small','aria-pressed':id==='sword',onclick:()=>{
        weapon = id;
        [...equipment.children].forEach((button, i) => button.setAttribute('aria-pressed', ['sword','water'][i] === id));
      }}, id === 'sword' ? 'Practice sword' : 'Water pistol')));
    const bar = h('section', {class:'hall-event-bar','aria-label':'In-world equipment practice'},
      h('b', {}, 'Padded dummy · equipment practice'), status, equipment,
      h('button', {class:'wood-btn small hall-leave',onclick:()=>finish(false)}, 'Leave'));
    const finish = win => {
      if (ended) return; ended = true;
      world.events.off('update', tick); world.events.off('shutdown', cancel);
      world.input.off('pointerdown', tap);
      for (const effect of effects) effect.destroy();
      dummy.destroy(); bar.remove(); document.body.classList.remove('hall-event');
      ui.activity = null; controls.release();
      if (world.player.active) world.player.setPosition(original.x, original.y);
      world.onResize();
      resolve({win, hp:70, time:elapsed, cancelled:!win});
    };
    const attack = point => {
      if (cooldown > 0 || ended) return;
      const player = world.player, dx = point.x - player.x, dy = point.y - player.y;
      const length = Math.hypot(dx, dy) || 1, range = weapon === 'sword' ? 32 : 140;
      const reach = Math.min(range, length);
      const end = {x:player.x + dx / length * reach, y:player.y + dy / length * reach};
      const vx = end.x - player.x, vy = end.y - player.y;
      const projection = Math.max(0, Math.min(1, ((target.x-player.x)*vx+(target.y-player.y)*vy)/(vx*vx+vy*vy||1)));
      const hit = Math.hypot(target.x-player.x-vx*projection,target.y-player.y-vy*projection) < 12;
      cooldown = .4;
      player.setDir(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up');
      player.perform(weapon==='sword'?'wave':'throw',400);
      const effect = world.add.graphics().setDepth(9600);
      effects.add(effect);
      if (weapon === 'sword') {
        effect.lineStyle(2,0xf5f1ce).beginPath().arc(player.x,player.y-8,24,Math.atan2(dy,dx)-.65,Math.atan2(dy,dx)+.65).strokePath();
      } else {
        effect.fillStyle(0x79d3f0).fillCircle(0,0,2).setPosition(player.x,player.y-10);
        world.tweens.add({targets:effect,x:end.x,y:end.y-10,duration:230});
      }
      world.time.delayedCall(320,()=>{
        effect.destroy(); effects.delete(effect);
        if (ended) return;
        if (hit) target.hp--;
        status.textContent = `${hit?'Hit!':'Miss: step closer or aim at the dummy.'} ${Math.max(0,target.hp)}/8 padding left.`;
        if (target.hp <= 0) finish(true);
      });
    };
    const tap = pointer => attack(world.cameras.main.getWorldPoint(pointer.x,pointer.y));
    const tick = (_time, delta) => {
      if (document.hidden) return;
      const dt = Math.min(.05,delta/1000); elapsed+=dt; cooldown=Math.max(0,cooldown-dt);
    };
    const cancel = () => finish(false);
    world.player.setPosition(11*16, 12*16); world.trail.length=0;
    document.body.append(bar); document.body.classList.add('hall-event'); world.onResize();
    controls.release();
    ui.activity={walk:true,action:()=>{const [x,y]=world.player.facing();attack({x:world.player.x+x*140,y:world.player.y+y*140});},cancel};
    world.input.on('pointerdown',tap);
    world.events.on('update',tick);world.events.once('shutdown',cancel);
  });
}
