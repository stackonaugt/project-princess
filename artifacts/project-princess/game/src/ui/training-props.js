// Little pixel pictures for the pet school board: the toys, the box toy and
// the recall distractions. Drawn as tiny SVGs (one rect per pixel, 1px dark
// outline like the rest of the built-in art) so they work without a canvas.
// '.' is clear; every other letter is a palette colour.
const O = '#2a211c';
const ART = {
  ball: { pal: { o: O, r: '#d8483c', h: '#f08a6c', d: '#9c2e28' }, rows: [
    '...oooo...', '..orrrro..', '.orhhrrro.', 'orrhrrrrro', 'orrrrrrrro', 'orrrrrrrdo', 'orrrrrrddo', '.orrrrddo.', '..odddo...', '...ooo....'] },
  tennis: { pal: { o: O, y: '#c9e04a', h: '#e8f58a', w: '#f8f6e8', d: '#94ab2c' }, rows: [
    '...oooo...', '..oyyywo..', '.ohhyywyo.', 'oyhywwyyyo', 'oyywyyyyyo', 'owwyyyyydo', 'oyyyyyyddo', '.oyyyyddo.', '..odddo...', '...ooo....'] },
  feather: { pal: { o: O, k: '#26262e', w: '#f2f0ea', g: '#9aa0a8', s: '#6a5a48' }, rows: [
    '.......oo.', '......okko', '.....okwko', '....okwwko', '...okkwko.', '..okwwko..', '.okkwko...', '.okkko....', 'oso.o.....', 'so........'] },
  ribbon: { pal: { o: O, p: '#e86a9a', h: '#f8a8c8', d: '#b03e6c' }, rows: [
    '..........', 'oo......oo', 'ohpo..ophp', 'ohppoopphp', 'opppddpppo', 'opppddpppo', 'odpooo opd', 'oo.opo.oo.', '...odo....', '...oo.....'] },
  squeaky: { pal: { o: O, y: '#f2cc3a', h: '#f8e488', b: '#e8873a', e: O }, rows: [
    '..ooo.....', '.ohyyo....', '.oyeyobb..', '.oyyyoob..', '..oyyoo...', '.oyyyyyoo.', 'ohyyyyyyyo', 'oyyyyyyyyo', '.oyyyyyyo.', '..oooooo..'] },
  soft: { pal: { o: O, b: '#a8703e', h: '#c99a62', d: '#7a4e2a', e: O, n: '#e8c8a0' }, rows: [
    'oo....oo..', 'obo..obo..', 'obbooobbo.', '.obhhbbbo.', '.obebebbo.', '.obbnnbbo.', '..obbbbo..', '.obbbbbbo.', '.obdbbdbo.', '..oo..oo..'] },
  bird: { pal: { o: O, k: '#26262e', w: '#f2f0ea', y: '#e8c050', e: '#f8f8f8' }, rows: [
    '..........', '...ooo....', '..okeko...', '.yokkkko..', '..okwwwko.', '..okkwwwko', '...okkkkko', '....ooook.', '.....o.o..', '.....o.o..'] },
  sniff: { pal: { o: O, g: '#5a9a3c', h: '#8cc85a', d: '#3c6e2a', f: '#f0e060', p: '#e86a9a' }, rows: [
    '...o..o...', '..ofo.opo.', '...o.o.o..', '.o.og.go..', 'ohoghoghgo', 'ogghgghggo', 'oggdggdggo', '.ogggggdo.', '.oddddddo.', '..oooooo..'] },
};
// The toy each pet trains with (lessonPlan's `toy`) to its picture.
const TOY = { ball: 'ball', 'tennis ball': 'tennis', feather: 'feather', ribbon: 'ribbon', 'squeaky toy': 'squeaky', 'soft toy': 'soft' };
export const toyArt = toy => TOY[toy] || 'ball';
export const DISTRACTIONS = ['bird', 'sniff', 'ball'];

const cache = {};
export function propSrc(kind) {
  if (cache[kind]) return cache[kind];
  const a = ART[kind] || ART.ball, rects = [];
  a.rows.forEach((row, y) => [...row].forEach((c, x) => { if (a.pal[c]) rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${a.pal[c]}"/>`); }));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" shape-rendering="crispEdges">${rects.join('')}</svg>`;
  return (cache[kind] = `data:image/svg+xml,${encodeURIComponent(svg)}`);
}
