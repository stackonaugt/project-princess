// MEREDITH: THE VIEW FROM THE SUNSET STRIP. Cutscene only: the whole crew in
// a row on the hill, looking out over the paddocks for the sunrise.
import { MapBuilder } from '../MapBuilder.js';

export function buildMfSunView() {
  const b = new MapBuilder({ id: 'mfsunview', w: 30, h: 17, seed: 9112 });
  b.fill(0, 0, 30, 17, 'L');
  b.put('mfvista', 0, 13);
  for (const [x, v] of [[3, 'square'], [24, 'round'], [26, 'square']]) b.put('mfhaybale', x, 15, { v });
  b.entry('hill', 15, 15, 'up');
  return b.finish();
}
