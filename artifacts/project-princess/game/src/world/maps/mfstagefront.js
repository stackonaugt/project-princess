// MEREDITH: THE FRONT OF THE STAGE. Cutscene only: you are brought here for
// the big sets (Mama King, then the Ice Kids) and taken back to the couch
// after. The One and Only Stage from the front, the barrier, and the crowd.
import { MapBuilder } from '../MapBuilder.js';

export function buildMfStageFront() {
  const b = new MapBuilder({ id: 'mfstagefront', w: 28, h: 20, seed: 9111 });
  b.fill(0, 0, 28, 20, 'u');
  b.put('mfstage', 7, 6);
  b.put('mfspeaker', 3, 6); b.put('mfspeaker', 23, 6);
  b.put('mflighttower', 1, 12); b.put('mflighttower', 26, 12);
  // The crowd behind you, packed in (silhouettes), with a gap where your crew stands
  const v = 'abcdef';
  let n = 0;
  for (const y of [15, 17, 19]) for (let x = 1 + (y === 17 ? 1 : 0); x <= 24; x += 3) {
    if (y === 15 && x >= 9 && x <= 18) continue;
    b.put('mfsil', x, y, { v: v[n++ % 6] });
  }
  b.entry('crowd', 14, 13, 'up');
  return b.finish();
}
