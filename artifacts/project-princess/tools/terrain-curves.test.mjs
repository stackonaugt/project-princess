import test from 'node:test';
import assert from 'node:assert/strict';
import { terrainContours, traceTerrain, pathContours, tracePaths } from '../game/src/art/paint/terrain-curves.js';
import { paintGround } from '../game/src/art/paint/tiles.js';
import { painter } from '../game/src/art/paint/painter.js';
import { activeTerrainFeatures, featureContains, featureTrace } from '../game/src/art/paint/terrain-features.js';
import { mapWithEdits, sourceObjectIdentity, resolveSourceObjectIndex } from '../game/src/authoring/map-overrides.js';
import { CIVIC } from '../game/src/art/paint/civic.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const { ZONES }=await import('../game/src/data/regions.js');
const grid=rows=>({w:rows[0].length,h:rows.length,ground:rows.map(r=>[...r])});
test('contours preserve separate pools, holes, diagonal touches and edge channels',()=>{
  assert.equal(terrainContours(grid(['~.~']), '~').length,2);
  assert.equal(terrainContours(grid(['~~~','~.~','~~~']), '~').length,2);
  assert.equal(terrainContours(grid(['~.','.~']), '~').length,2);
  assert.equal(terrainContours(grid(['~~~']), '~').length,1);
  assert.equal(terrainContours(grid(['...']), '~').length,0);
});
test('rounding emits finite continuous paths rather than tile edge rectangles',()=>{
  let curves=0,closed=0;
  const check=(...v)=>v.forEach(n=>assert.ok(Number.isFinite(n)));
  traceTerrain({beginPath(){},moveTo:check,lineTo:check,quadraticCurveTo(...v){check(...v);curves++;},closePath(){closed++;}},terrainContours(grid(['......','..~~..','.~~~~.','..~~..','......']),'~'));
  assert.ok(curves>8);assert.equal(closed,1);
});
test('every map paints without altering its ground, collision, bridges or exits',()=>{
  const ctx={save(){},restore(){},clip(){},rect(){},ellipse(){},beginPath(){},moveTo(){},lineTo(){},quadraticCurveTo(){},closePath(){},stroke(){},fillRect(){}};
  for(const [id,zone] of Object.entries(ZONES)){
    const map=zone.build();const before=JSON.stringify(map);
    paintGround(painter(ctx),map,zone.grass);
    assert.equal(JSON.stringify(map),before,id);
  }
});

test('diagonal components close before consuming another component at their start', () => {
  for (const [rows, count] of [
    [['.=.', '=.='], 3], [['=.=.', '.=.='], 4], [['==..', '==..', '..==', '..=='], 2],
  ]) {
    const loops = pathContours(grid(rows), '=');
    assert.equal(loops.length, count);
    for (const loop of loops) {
      assert.equal(new Set(loop.map(vertex => vertex.point.join(','))).size, loop.length);
    }
  }
});

test('path smoothing stays near cell boundaries even when simplified edges are very long', () => {
  const distanceToBoundary = (map, [px, py]) => {
    let best = Infinity;
    for (let y = Math.max(0, Math.floor(py / 16) - 2); y < Math.min(map.h, Math.floor(py / 16) + 3); y++)
      for (let x = Math.max(0, Math.floor(px / 16) - 2); x < Math.min(map.w, Math.floor(px / 16) + 3); x++) {
        if (!'=ugf'.includes(map.ground[y][x])) continue;
        for (const [dx, dy, a, b] of [
          [0, -1, [x * 16, y * 16], [(x + 1) * 16, y * 16]],
          [1, 0, [(x + 1) * 16, y * 16], [(x + 1) * 16, (y + 1) * 16]],
          [0, 1, [x * 16, (y + 1) * 16], [(x + 1) * 16, (y + 1) * 16]],
          [-1, 0, [x * 16, y * 16], [x * 16, (y + 1) * 16]],
        ]) {
          if ('=ugf'.includes(map.ground[y + dy]?.[x + dx] || '!')) continue;
          const nearX = Math.max(Math.min(a[0], b[0]), Math.min(Math.max(a[0], b[0]), px));
          const nearY = Math.max(Math.min(a[1], b[1]), Math.min(Math.max(a[1], b[1]), py));
          best = Math.min(best, Math.hypot(px - nearX, py - nearY));
        }
      }
    return best;
  };
  for (const id of ['coburglake', 'wetlands', 'lakepark', 'lake', 'gardens']) {
    const map = ZONES[id].build();
    let last;
    const check = point => assert.ok(distanceToBoundary(map, point) <= 12,
      `${id} contour strayed from its local boundary at ${point}`);
    const ctx = {
      beginPath(){}, closePath(){},
      moveTo(x, y){ last = [x, y]; check(last); },
      lineTo(x, y){
        const end = [x, y];
        for (let i = 1; i <= 8; i++) check(last.map((n, axis) => n + (end[axis] - n) * i / 8));
        last = end;
      },
      quadraticCurveTo(x, y, a, b){
        const end = [a, b], control = [x, y];
        for (let i = 1; i <= 8; i++) {
          const t = i / 8;
          check(last.map((n, axis) => (1 - t) ** 2 * n + 2 * (1 - t) * t * control[axis] + t * t * end[axis]));
        }
        last = end;
      },
    };
    tracePaths(ctx, pathContours(map, '=ugf'));
  }
});

test('Flinders river meets built banks, bridge and both map edges without pool caps', () => {
  const map = ZONES.flinders.build();
  const loops = terrainContours(map, '~w');
  assert.equal(loops.length, 2);
  assert.ok(loops.flat().every(point => point.square));
  assert.ok(loops.flat().some(([x]) => x === 0));
  assert.ok(loops.flat().some(([x]) => x === map.w * 16));
  assert.ok(loops.flat().some(([x]) => x === 34 * 16));
  assert.ok(loops.flat().some(([x]) => x === 40 * 16));
});

test('landmark shapes are scoped, concentric, and relinquish ground to local edits', () => {
  for (const id of ['allen', 'glasgow', 'reading', 'lake']) {
    const map = ZONES[id].build();
    assert.equal(activeTerrainFeatures(map).length, 1);
    const feature = map.terrainFeatures[0], [x, y] = feature.bounds;
    const altered = mapWithEdits(map, { tiles: [{ x, y, tile: '~' }] });
    assert.equal(activeTerrainFeatures(altered).length, 0);
    assert.equal(altered.ground[y][x], '~');
    assert.equal(activeTerrainFeatures(map).length, 1, 'Source map remains untouched');
    const rotated = mapWithEdits(map, { tiles: [{ x, y, tile: map.ground[y][x], rotation: 1 }] });
    assert.equal(activeTerrainFeatures(rotated).length, 1);
    assert.equal(rotated.tileRotations[y][x], 1);
  }
  for (const id of ['home', 'lohse', 'civiccentre', 'chamber'])
    assert.equal(activeTerrainFeatures(ZONES[id].build()).length, 0);
  const feature = ZONES.glasgow.build().terrainFeatures[0];
  for (const layer of feature.layers) {
    const circle = layer.shapes[0];
    assert.equal(circle.rx, circle.ry);
    assert.deepEqual([circle.cx, circle.cy], [43, 14]);
    for (let i = 0; i < 16; i++) {
      const angle = i * Math.PI / 8;
      assert.ok(featureContains(layer, 43 + Math.cos(angle) * (circle.rx - .01),
        14 + Math.sin(angle) * (circle.ry - .01)));
    }
  }
  let ellipse;
  featureTrace(feature, feature.layers[1])({
    beginPath(){}, closePath(){}, ellipse(...args){ ellipse = args; },
  });
  assert.equal(ellipse[2], ellipse[3], 'Island is a native, exact circle');
});

test('Reading Room defaults fit the oval and creator moves retain their original identities', () => {
  const map = ZONES.reading.build(), layout = mapWithEdits(map);
  for (const object of layout.objects) {
    for (let y = object.y; y < object.y + object.h; y++)
      for (let x = object.x; x < object.x + object.w; x++)
        assert.ok('oD'.includes(layout.ground[y][x]), `${object.kind} at ${x},${y} is outside the oval`);
  }
  const source = sourceObjectIdentity(map.objects[0]);
  assert.equal(resolveSourceObjectIndex(map.objects, source), 0);
  const moved = mapWithEdits(map, { objects: { move: [{ index: 0, source, x: 9, y: 5 }] } });
  assert.deepEqual([moved.objects[0].x, moved.objects[0].y], [9, 5]);
  assert.equal(moved.solid[5 * map.w + 9], 1);
  assert.equal(layout.solid[16 * map.w + 12], 0, 'Door entry remains open');
  assert.ok(layout.exits.some(exit => exit.to === 'swanston'));
});

test('the oval Reading Room still uses supplied wall artwork outside its floor', () => {
  const image = { width: 16, height: 16 }, drawn = [];
  const ctx = { save(){}, restore(){}, clip(){}, rect(){}, ellipse(){}, beginPath(){},
    moveTo(){}, lineTo(){}, quadraticCurveTo(){}, closePath(){}, stroke(){}, fillRect(){},
    drawImage(source){ drawn.push(source); } };
  paintGround(painter(ctx), ZONES.reading.build(), ZONES.reading.grass, { wall: image });
  assert.ok(drawn.filter(source => source === image).length >= 24,
    'A landmark must not replace the creator wall art with a procedural colour');
});

test('Carlton northwest diagonal has a cardinally connected path to the main avenue', () => {
  const map = ZONES.gardens.build(), seen = new Set(['2,27']), queue = [[2, 27]];
  while (queue.length) {
    const [x, y] = queue.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const a = x + dx, b = y + dy, key = `${a},${b}`;
      if (map.ground[b]?.[a] !== 'u' || map.solid[b * map.w + a] || seen.has(key)) continue;
      seen.add(key); queue.push([a, b]);
    }
  }
  assert.ok(seen.has('22,16'));
  assert.ok(seen.has('40,29'));
});

test('council roof highlights and seams stay within their shell before outlining', () => {
  const records = [];
  const p = { shadow(){}, text(){}, r(c, x, y, w, h){ records.push({ c, x, y, w, h }); },
    ctx: { getImageData(){ return { data: new Uint8ClampedArray(200 * 130 * 4) }; }, putImageData(){} } };
  CIVIC.chamberdome.paint(p);
  for (const rectangle of records.filter(r => ['#6a7078', '#5e646c', '#353a40'].includes(r.c))) {
    const t = (130 - rectangle.y) / 122, half = Math.round(Math.sqrt(1 - t * t) * 98);
    assert.ok(rectangle.x >= 100 - half && rectangle.x + rectangle.w <= 100 + half);
  }
});

test('path dead-ends stay square at every width, orientation and map edge', () => {
  for (const rows of [
    ['.....', '.===.', '.....'], ['.....', '.===.', '.===.', '.....'],
    ['.=.', '.=.', '.=.'], ['===', '==='], ['...', '.=.', '...'],
  ]) {
    const loops = pathContours(grid(rows), '=ug');
    assert.equal(loops.length, 1);
    assert.ok(loops[0].every(vertex => vertex.square), JSON.stringify(rows));
    let curves = 0;
    tracePaths({ beginPath(){}, moveTo(){}, lineTo(){}, closePath(){},
      quadraticCurveTo(){ curves++; } }, loops);
    assert.equal(curves, 0, 'A straight ribbon must not get a rounded end cap');
  }
});

test('path staircase sides retain smoothing without joining diagonal contacts or filling holes', () => {
  const rows = ['.......', '.==....', '..==...', '...==..', '....==.', '.......'];
  const loops = pathContours(grid(rows), '=');
  assert.equal(loops.length, 1);
  assert.ok(loops[0].some(vertex => !vertex.square), 'Path smoothing remains enabled');
  assert.equal(pathContours(grid(['=.', '.=']), '=').length, 2);
  assert.equal(pathContours(grid(['===', '=.=', '===']), '=').length, 2);
  let curves = 0;
  tracePaths({ beginPath(){}, moveTo(){}, lineTo(){}, closePath(){},
    quadraticCurveTo(...values){ values.forEach(value => assert.ok(Number.isFinite(value))); curves++; } }, loops);
  assert.ok(curves > 0);
  const wideSteps = pathContours(grid([
    '..........', '.===......', '..====....', '....====..', '......===.', '..........',
  ]), '=');
  assert.ok(wideSteps[0].some(vertex => !vertex.square),
    'Multi-cell staircase sides must remain smoothed too');
});

test('all ordinary street paving and Allen southbound ends bypass automatic contours', () => {
  for (const id of ['allen', 'lohse', 'woods']) {
    const map = ZONES[id].build(), calls = [];
    const ctx = { save(){}, restore(){}, clip(){}, rect(){}, beginPath(){}, moveTo(){},
      lineTo(){}, quadraticCurveTo(){}, ellipse(){}, closePath(){}, stroke(){},
      fillRect(x, y, w, h){ calls.push([x, y, w, h]); } };
    paintGround(painter(ctx), map, ZONES[id].grass);
    const cells = id === 'allen' ? [[17, 29], [18, 29], [21, 29], [22, 29]] :
      map.ground.flatMap((row, y) => [...row].map((c, x) => [c, x, y]))
        .filter(([c]) => c === 'f' || c === '#').map(([, x, y]) => [x, y]);
    for (const [x, y] of cells) assert.ok(calls.some(call =>
      call[0] === x * 16 && call[1] === y * 16 && call[2] === 16 && call[3] === 16),
    `${id} paving at ${x},${y} must retain its full square base`);
  }
});

test('street sidewalk junctions stay square while Edwardes park footpaths keep their curves', () => {
  for (const id of ['woods', 'lohse', 'flinders'])
    assert.ok(pathContours(ZONES[id].build(), 'f').flat().every(vertex => vertex.square), id);
  assert.ok(pathContours(ZONES.lake.build(), 'f').flat().some(vertex => !vertex.square));
  assert.equal(pathContours(ZONES.lake.build(), 'f').length, 3,
    'Continuous lake loop has inner/outer boundaries, plus the separate roadside footpath');
  const ring = ZONES.lake.build().terrainFeatures[0].layers[0];
  assert.equal(featureContains(ring, 25.5, 14.5), false, 'Ring never paints over the lake centre');
  assert.equal(featureContains(ring, 25.5, 4.1), true);
  assert.equal(featureContains(ring, 21, 29.9), true, 'South path continues square to the exit');
});
