import test from 'node:test';
import assert from 'node:assert/strict';
import { terrainContours, traceTerrain } from '../game/src/art/paint/terrain-curves.js';
import { paintGround } from '../game/src/art/paint/tiles.js';
import { painter } from '../game/src/art/paint/painter.js';
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
  traceTerrain({beginPath(){},moveTo:check,quadraticCurveTo(...v){check(...v);curves++;},closePath(){closed++;}},terrainContours(grid(['.~~.','~~~~','.~~.']),'~'));
  assert.ok(curves>8);assert.equal(closed,1);
});
test('every map paints without altering its ground, collision, bridges or exits',()=>{
  const ctx={save(){},restore(){},clip(){},beginPath(){},moveTo(){},quadraticCurveTo(){},closePath(){},stroke(){},fillRect(){}};
  for(const [id,zone] of Object.entries(ZONES)){
    const map=zone.build();const before=JSON.stringify(map);
    paintGround(painter(ctx),map,zone.grass);
    assert.equal(JSON.stringify(map),before,id);
  }
});
