// Yard practice runs in WorldScene. No scene switch or arena background.
import { state } from './state.js';
import { HandlingEvent } from './handling-event.js';
import { startHallEvent } from './hall-events.js';
export const YARD_AREA = { x: 2, y: 6, w: 15, h: 8 };
export const yardTier = () => state.count('weavekit') ? 'open' : state.count('courseextension') ? 'novice' : state.count('coursekit') ? 'yardstarter' : null;
export const yardPoint = p => ({ x: (YARD_AREA.x + p.x / 100 * YARD_AREA.w)*16, y:(YARD_AREA.y + p.y / 100 * YARD_AREA.h)*16 });
export function paintYardCourse(world, tier = yardTier()) {
  const area = { x: YARD_AREA.x * 16, y: YARD_AREA.y * 16, w: YARD_AREA.w * 16, h: YARD_AREA.h * 16 };
  const objects = [], session = tier ? new HandlingEvent(tier,'course',0,{area}) : null;
  if (!session) return {destroy(){}};
  const g = world.add.graphics().setDepth(2); objects.push(g);
  for (const [i,s] of session.stations.entries()) {
    const p = s;
    if(s.kind==='jump') {
      g.fillStyle(0xad5241).fillRect(p.x-8,p.y-12,3,14).fillRect(p.x+5,p.y-12,3,14);
      g.fillStyle(0xf7e4b1).fillRect(p.x-8,p.y-8,16,2);
    } else if(s.kind==='tunnel') {
      g.fillStyle(0x4975a0).fillRoundedRect(p.x-10,p.y-10,20,12,5);
      g.fillStyle(0x24394b).fillEllipse(p.x-6,p.y-3,7,8);
    } else if(s.kind==='weave') {
      for(let j=-2;j<=2;j++)g.fillStyle(j%2?0xebc966:0xb9493f).fillRect(p.x+j*9,p.y-12,2,14);
    } else g.lineStyle(2,s.kind==='stay'?0xe9c967:0x7db7ae).strokeEllipse(p.x,p.y,17,7);
    const names = { jump:'Jump', tunnel:'Through', weave:'Weave', stay:'Stay', recall:'Come' };
    objects.push(world.add.text(p.x,p.y+4,`${i+1} ${names[s.kind]}`,{fontSize:'6px',color:'#f5e4c6',backgroundColor:'#49603b'}).setOrigin(.5).setDepth(3));
  }
  return { setVisible(visible){objects.forEach(o=>o.setVisible(visible));}, destroy(){objects.forEach(o=>o.destroy());} };
}
export async function startYardCourse(world, pet, tier, mode = 'course') {
  world.yardCourse?.setVisible?.(false);
  try { return await startHallEvent(world, {
    pet, tier: mode === 'course' ? tier : tier === 'yardstarter' ? 'novice' : tier, mode, guided: true, variant: 0,
    area: { x: YARD_AREA.x * 16, y: YARD_AREA.y * 16, w: YARD_AREA.w * 16, h: YARD_AREA.h * 16 },
  }); } finally { world.yardCourse?.setVisible?.(true); }
}
