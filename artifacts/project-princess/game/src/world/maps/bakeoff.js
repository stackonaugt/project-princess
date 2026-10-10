import { MapBuilder } from '../MapBuilder.js';
import { BAKE_CONTESTANTS } from '../../data/bake-event.js';
export function buildBakeOff() {
  const b = new MapBuilder({ id: 'bakeoff', w: 22, h: 18, fill: 'W', seed: 372 });
  b.noDress = true; b.fill(1, 2, 20, 15, 'U'); b.fill(2, 9, 18, 5, 'u');
  b.npc('betty', 4, 3, { face: 'down', still: true });
  b.npc('bakejudge', 10, 3, { face: 'down', still: true });
  b.npc('bakehallie', 16, 3, { face: 'down', still: true });
  b.put('counter', 9, 2, { v: 'kettle', interact: 'bakejudge' });
  BAKE_CONTESTANTS.forEach((c, i) => {
    b.npc(c.id, 4 + i * 6, 6, { face: 'down', still: true });
    b.put('table', 4 + i * 6, 7);
  });
  b.put('counter', 4, 11, { interact: 'bakeprep', v: 'plain' });
  b.put('counter', 10, 11, { interact: 'bakeoven', v: 'stove' });
  b.put('table', 16, 11, { interact: 'bakedecor' });
  b.sign(3, 10, ['Preparation bench. Precisely measure dry ingredients, whisk four times, add wet ingredients, then fold four times.']);
  b.sign(9, 10, ['Oven station. Adjust for the uneven heat. Watch the rise and colour, then remove at golden.']);
  b.sign(15, 10, ['Decorating station. Balance all three toppings and give the centre room.']);
  b.put('bench', 2, 14); b.put('bench', 17, 14);
  for (let i = 0; i < 6; i++) b.npc(`showguest${i}`, i < 3 ? 2 : 19, 4 + i % 3 * 4, { still: true, face: i < 3 ? 'right' : 'left' });
  b.set(10, 17, 'D').set(11, 17, 'D');
  b.entry('door', 10, 15, 'up');
  b.exit(10, 17, 2, 1, 'moreland', 'bakeoff', 'Moreland Rd');
  return b.finish();
}
