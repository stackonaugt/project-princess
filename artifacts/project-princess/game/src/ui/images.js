import { animationFrames } from '../data/animation-layouts.js';
// Turns game textures into <img> sources for the HTML interface.
import { frameDataURL, frameCount, custom, customURL, playerTexture } from '../art/textures.js';
import { petTex, isEvolved } from '../systems/forms.js';

let scene = null;
export const setImageScene = s => { scene = s; };

export const grassIcon = () => scene ? frameDataURL(scene, `tuft-${scene.regionId}`, 0, 96) : '';
export const petIcon = (id, size = 64) => scene ? frameDataURL(scene, petTex(id), 0, size) : '';
export const petWalkFrames = (id,size=64) => scene ? Array.from({length:frameCount(scene,petTex(id))},(_,i)=>frameDataURL(scene,petTex(id),i,size)) : [''];
export const itemIcon = (id, size = 32) => scene ? frameDataURL(scene, `item-${id}`, 0, size) : '';
export const npcIcon = id => {
  if (customURL[`npcportrait-${id}`]) return customURL[`npcportrait-${id}`];
  if (!scene) return '';
  return custom.has(`npc-${id}`) ? frameDataURL(scene, `npc-${id}`, 0, 64) : frameDataURL(scene, `npc-${id}-down`, 0, 64);
};
// A custom portrait (photo or art) if there is one, otherwise the sprite.
export const petPortrait = id => (isEvolved(id) && customURL[`portrait-${id}-evolved`]) || customURL[`portrait-${id}`] || petIcon(id, 128);
export const hasPhoto = id => custom.has(`portrait-${id}`);
export const heroIcon = id => scene ? frameDataURL(scene, playerTexture(id, 'down')[0], 0, 96) : '';

export const spriteFrames=(key,size=64,action='walk')=>scene?animationFrames(key,frameCount(scene,key),action,!custom.has(key)).map(i=>frameDataURL(scene,key,i,size)):[''];
export const heroFrames=(id,size=96,action='walk')=>spriteFrames(scene?playerTexture(id,'down')[0]:'',size,action);
export const petActionFrames=(id,size=64,action='walk')=>spriteFrames(petTex(id),size,action);
