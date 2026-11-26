import { MASCOT_TIMING, readingDuration } from './timing.js';
import { TimerGroup } from './timers.js';

/** Shared controller for project characters with sequential dialogue. */
export function createProjectDialogue({root, character, speech, source, entries, initialDelay=650}) {
  if (!root || !character || !speech || !Array.isArray(entries) || entries.length < 2) return null;
  const timers=new TimerGroup();
  const abort=new AbortController();
  const listen=(target,name,fn)=>target.addEventListener(name,fn,{signal:abort.signal});
  const tx=(key,fallback)=>window.SM_I18N?.t?.(key,fallback)??fallback;
  let next=1,greeted=false,busy=false;
  const visible=()=>{const r=root.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth&&document.visibilityState==='visible';};
  const hide=()=>{timers.clearAll();speech.hidden=true;};
  function speak(entry,initial=false) {
    if(busy||!visible())return false;
    hide();
    window.dispatchEvent(new CustomEvent('sm:project-bubble-open',{detail:{source}}));
    const message=tx(entry.key,entry.text);
    speech.dataset.i18n=entry.key;speech.textContent=message;speech.hidden=false;
    const duration=readingDuration(message,{min:initial?MASCOT_TIMING.initialMinMs:MASCOT_TIMING.normalMinMs});
    timers.set(()=>{
      speech.hidden=true;
      if(entry.replyKey&&entry.reply&&visible()){
        timers.set(()=>{
          if(!visible()||busy)return;
          const reply=tx(entry.replyKey,entry.reply);
          const replyDuration=readingDuration(reply);
          window.dispatchEvent(new CustomEvent('sm:interact',{detail:{target:'#'+root.id,message:reply,duration:replyDuration,hold:replyDuration+900,mood:entry.mood??'happy'}}));
        },MASCOT_TIMING.speakerGapMs);
      }
    },duration);
    return true;
  }
  function greet(){if(!greeted&&!busy&&visible()&&speak(entries[0],true))greeted=true;}
  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(items=>{if(items.some(e=>e.isIntersecting))greet();else if(!visible())hide();},{threshold:0.25}):null;
  observer?.observe(root);
  listen(character,'click',()=>{if(busy)return;if(speak(entries[next])){greeted=true;next=next===entries.length-1?1:next+1;}});
  listen(window,'sm:minute-bubble-open',hide);
  listen(window,'sm:project-bubble-open',event=>{if(event.detail?.source!==source)hide();});
  listen(window,'sm:interaction-state',event=>{
    busy=event.detail?.active===true;
    character.setAttribute('aria-disabled',String(busy));
    if(busy)hide();
  });
  listen(window,'sm:language-changed',()=>{hide();greeted=false;timers.set(greet,350);});
  listen(document,'visibilitychange',()=>{if(document.hidden)hide();});
  listen(window,'pagehide',event=>{hide();observer?.disconnect();if(!event.persisted)abort.abort();});
  listen(window,'pageshow',event=>{if(event.persisted){busy=false;character.setAttribute('aria-disabled','false');observer?.observe(root);}});
  timers.set(greet,initialDelay);
  return {hide,dispose(){hide();observer?.disconnect();abort.abort();}};
}
