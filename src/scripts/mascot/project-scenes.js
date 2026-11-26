import {TimerGroup} from './timers.js';

/** A pose is an owned, finite scene; replacement invalidates its older reset. */
export const JACK_POSES=Object.freeze({idle:0,dribble:1900,cap:2200,limp:3400,react:1300});
export const ARCHIVE_POSES=Object.freeze({idle:0,page:2300,sort:2800,stand:2600,react:1400});
export const SCENE_TIMING=Object.freeze({firstAmbientMs:14000,ambientMs:26000});
export function createScenePlayer(root,{poses,clock=globalThis}){
 const timers=new TimerGroup(clock);
 const reset=()=>{timers.clearAll();root.dataset.pose='idle';};
 function play(pose){
  if(!Object.hasOwn(poses,pose))return false;
  reset();
  if(pose==='idle')return true;
  // Flush the old pose before replaying the same finite animation.
  void root.offsetWidth;
  root.dataset.pose=pose;
  timers.set(reset,poses[pose]);
  return true;
 }
 reset();
 return {play,reset};
}
