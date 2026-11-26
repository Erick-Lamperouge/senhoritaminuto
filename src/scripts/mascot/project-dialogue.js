import { MASCOT_TIMING, readingDuration } from './timing.js';
import { TimerGroup } from './timers.js';
import { createSpeechBubble } from './speech.js';
import { createScenePlayer, SCENE_TIMING } from './project-scenes.js';

/** Project mascots share one dialogue lifecycle and separate finite pose timers. */
export function createProjectDialogue({root,character,speech,source,entries,poses={idle:0},ambient=[],initialDelay=650}) {
  if(!root||!character||!speech||!Array.isArray(entries)||entries.length<2)return null;
  const timers=new TimerGroup(),ambientTimers=new TimerGroup(),abort=new AbortController();
  const listen=(target,name,fn)=>target.addEventListener(name,fn,{signal:abort.signal});
  const tx=(key,fallback)=>window.SM_I18N?.t?.(key,fallback)??fallback;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const player=createScenePlayer(root,{poses});
  const bubble=createSpeechBubble(speech,{highlight:'Senhorita Minuto'});
  const pause=root.querySelector('[data-mascot-motion]');
  let next=1,greeted=false,busy=false,speaking=false,ambientIndex=0,paused=false;
  const visible=()=>{const r=character.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth&&document.visibilityState==='visible';};
  const minuteAvailable=()=>!['sleep','broken','portal','interaction'].includes(document.querySelector('#mascotTraveler')?.dataset.mode);
  function hide(){timers.clearAll();speaking=false;bubble.hide(true);player.reset();}
  function scheduleAmbient(delay=SCENE_TIMING.ambientMs){
    ambientTimers.clearAll();
    if(!ambient.length||document.hidden||paused||motion.matches)return;
    ambientTimers.set(()=>{
      if(visible()&&!busy&&!speaking&&minuteAvailable()){player.play(ambient[ambientIndex%ambient.length]);ambientIndex++;}
      scheduleAmbient();
    },delay);
  }
  function speak(entry,initial=false){
    if(busy||!visible())return false;
    hide();ambientTimers.clearAll();
    window.dispatchEvent(new CustomEvent('sm:project-bubble-open',{detail:{source}}));
    const message=tx(entry.key,entry.text);
    const duration=readingDuration(message,{min:initial?MASCOT_TIMING.initialMinMs:MASCOT_TIMING.clickMinMs});
    speech.dataset.i18n=entry.key;speaking=true;bubble.show(message,duration);
    player.play(entry.pose??'idle');
    timers.set(()=>{
      speaking=false;
      if(entry.replyKey&&entry.reply&&visible()){
        timers.set(()=>{
          if(!visible()||busy)return;
          const reply=tx(entry.replyKey,entry.reply),replyDuration=readingDuration(reply);
          window.dispatchEvent(new CustomEvent('sm:interact',{detail:{target:'#'+root.id,message:reply,duration:replyDuration,hold:replyDuration+900,mood:entry.mood??'happy'}}));
        },MASCOT_TIMING.speakerGapMs);
      }
      scheduleAmbient();
    },duration);
    return true;
  }
  function greet(){if(!greeted&&!busy&&visible()&&speak(entries[0],true))greeted=true;}
  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(items=>{
    if(items.some(e=>e.isIntersecting)&&visible()){greet();if(!speaking&&!busy)scheduleAmbient(SCENE_TIMING.firstAmbientMs);}
    else if(!visible()){hide();ambientTimers.clearAll();}
  },{threshold:0.1}):null;
  observer?.observe(character);
  listen(character,'click',()=>{if(busy)return;if(speak(entries[next])){greeted=true;next=next===entries.length-1?1:next+1;}});
  listen(window,'sm:minute-bubble-open',()=>{hide();scheduleAmbient();});
  listen(window,'sm:project-bubble-open',event=>{if(event.detail?.source!==source){hide();scheduleAmbient();}});
  listen(window,'sm:interaction-state',event=>{
    busy=event.detail?.active===true;character.setAttribute('aria-disabled',String(busy));
    if(busy){hide();ambientTimers.clearAll();}
    else scheduleAmbient();
  });
  listen(window,'sm:language-changed',()=>{hide();ambientTimers.clearAll();greeted=false;timers.set(greet,350);scheduleAmbient();});
  listen(document,'visibilitychange',()=>{if(document.hidden){hide();ambientTimers.clearAll();}else{greet();scheduleAmbient(SCENE_TIMING.firstAmbientMs);}});
  listen(motion,'change',()=>{player.reset();ambientTimers.clearAll();if(!motion.matches)scheduleAmbient(SCENE_TIMING.firstAmbientMs);});
  if(pause){
    pause.hidden=false;
    listen(pause,'click',()=>{
      paused=!paused;root.dataset.motionPaused=String(paused);player.reset();
      pause.setAttribute('aria-pressed',String(paused));
      pause.dataset.i18n=paused?'mascot.motion.resume':'mascot.motion.pause';
      pause.textContent=tx(pause.dataset.i18n,paused?'Retomar movimentos':'Pausar movimentos');
      scheduleAmbient(SCENE_TIMING.firstAmbientMs);
    });
  }
  listen(window,'pagehide',event=>{hide();ambientTimers.clearAll();observer?.disconnect();if(!event.persisted)abort.abort();});
  listen(window,'pageshow',event=>{if(event.persisted){busy=false;character.setAttribute('aria-disabled','false');observer?.observe(character);scheduleAmbient(SCENE_TIMING.firstAmbientMs);}});
  timers.set(greet,initialDelay);scheduleAmbient(SCENE_TIMING.firstAmbientMs);
  return {hide,dispose(){hide();ambientTimers.clearAll();observer?.disconnect();abort.abort();}};
}
