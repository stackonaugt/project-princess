import test from 'node:test';
import assert from 'node:assert/strict';
import { routeControlInput } from '../game/src/ui/control-routing.js';

test('the action button advances dialogue instead of a stale active game activity', () => {
  const called=[];
  const state={dialog:{},activity:{action:()=>called.push('activity')},advance:()=>called.push('dialog')};
  routeControlInput('action',{dialog:{choices:true,action:()=>called.push('dialog')},activity:state.activity});
  assert.deepEqual(called,['dialog']);
});

test('the cancel button dismisses dialogue before forwarding to gameplay', () => {
  const called=[];
  const state={dialog:{},activity:{cancel:()=>called.push('activity')},cancelDialog:()=>called.push('dialog')};
  routeControlInput('cancel',{dialog:{cancel:()=>called.push('dialog')},activity:state.activity});
  assert.deepEqual(called,['dialog']);
});

test('dialogue choice navigation takes direction input before a stale activity', () => {
  const called=[];
  const state={dialog:{choices:[{value:'pet'},{value:'bye'}]},activity:{},moveChoice:n=>called.push(n)};
  routeControlInput('direction',{dialog:{choices:true,direction:(_x,n)=>called.push(n)},activity:state.activity},0,1);
  assert.deepEqual(called,[1]);
});
