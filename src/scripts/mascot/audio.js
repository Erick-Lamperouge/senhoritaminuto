/** One audio context per mounted portal, with a modest click rate limit. */
export function createRetroChime({host=globalThis,clock=()=>Date.now()}={}){
 let context=null,last=-Infinity;
 function play(){
  if(clock()-last<110)return;
  last=clock();
  try{
   const AudioCtx=host.AudioContext||host.webkitAudioContext;if(!AudioCtx)return;
   if(!context||context.state==='closed')context=new AudioCtx();
   const ctx=context;
   if(ctx.state==='suspended')ctx.resume().catch(()=>{});
   const now=ctx.currentTime,master=ctx.createGain();
   master.gain.setValueAtTime(.0001,now);master.gain.exponentialRampToValueAtTime(.025,now+.015);master.gain.exponentialRampToValueAtTime(.0001,now+.24);master.connect(ctx.destination);
   const tones=[620,930];let ended=0;
   tones.forEach((frequency,index)=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='triangle';osc.frequency.setValueAtTime(frequency,now+index*.055);gain.gain.setValueAtTime(index===0?.5:.3,now);osc.connect(gain);gain.connect(master);osc.onended=()=>{osc.disconnect();gain.disconnect();if(++ended===tones.length)master.disconnect();};osc.start(now+index*.055);osc.stop(now+.18+index*.055);});
  }catch{}
 }
 function close(){const ctx=context;context=null;last=-Infinity;try{if(ctx&&ctx.state!=='closed')ctx.close().catch(()=>{});}catch{}}
 return {play,close};
}
