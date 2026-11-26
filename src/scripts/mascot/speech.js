import {TimerGroup} from './timers.js';

/** Render emphasis as DOM nodes, never by interpreting dialogue as HTML. */
export function renderSpeech(element,message,highlight='Senhorita Minuto'){
 const value=String(message??'');
 if(!highlight){element.textContent=value;return;}
 const pieces=value.split(highlight),doc=element.ownerDocument,nodes=[];
 for(const [i,piece] of pieces.entries()){
  if(i){const strong=doc.createElement('strong');strong.textContent=highlight;nodes.push(strong);}
  if(piece)nodes.push(doc.createTextNode(piece));
 }
 element.replaceChildren(...nodes);
}

/** A new line cancels its predecessor's exit animation and timeout. */
export function createSpeechBubble(element,{timers=new TimerGroup(),onHide=()=>{},highlight='Senhorita Minuto',exitMs=140}={}){
 const reset=()=>{element.hidden=true;element.classList.remove('bubble-enter','bubble-leave');onHide();};
 function hide(immediate=false){
  timers.clearAll();
  if(element.hidden||immediate){reset();return;}
  element.classList.remove('bubble-enter');element.classList.add('bubble-leave');
  timers.set(reset,exitMs);
 }
 function show(message,duration){
  timers.clearAll();renderSpeech(element,message,highlight);element.hidden=false;
  element.classList.remove('bubble-enter','bubble-leave');void element.offsetWidth;element.classList.add('bubble-enter');
  timers.set(()=>hide(false),duration);
 }
 return {show,hide};
}
