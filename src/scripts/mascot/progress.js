/** Pure milestones and session state. Never stores personal information. */
export const CLICK_KEY='senhorita-minuto-clickcount-session-v1';
export const REPAIR_KEY='senhorita-minuto-repaired-session-v1';
export const MILESTONES=Object.freeze([5,7,12,20,25,50,90,100,200,500,1000]);
export function normalizeCount(value){const n=Number(value);return Number.isSafeInteger(n)&&n>=0?n:0;}
export function crackLevel(count,repaired){if(repaired||count<=50)return '0';if(count<100)return '1';if(count<200)return '2';if(count<500)return '3';return '4';}
export function needsFuture(count,repaired){return normalizeCount(count)>=1000&&!repaired;}
export function readProgress(storage,{reset=false,fallback={count:0,repaired:false}}={}){
  try{if(reset){storage.removeItem(CLICK_KEY);storage.removeItem(REPAIR_KEY);}return {count:normalizeCount(storage.getItem(CLICK_KEY)),repaired:storage.getItem(REPAIR_KEY)==='1'};}
  catch{return {...fallback};}
}
export function writeProgress(storage,{count,repaired}){
  try{storage.setItem(CLICK_KEY,String(normalizeCount(count)));if(repaired)storage.setItem(REPAIR_KEY,'1');else storage.removeItem(REPAIR_KEY);}catch{}
}
export function futureTimeline(readMs){const speechAt=1900,repairAt=speechAt+Math.max(3000,Number.isFinite(readMs)?readMs:3000);return {arrival:1650,arrivalClose:1850,speechAt,repairAt,reassembled:repairAt+1200,departure:repairAt+1950,end:repairAt+2650};}

/** Modern NavigationTiming and the legacy fallback on older browsers. */
export function wasReload(perf){try{const entry=perf?.getEntriesByType?.('navigation')?.[0];if(entry?.type)return entry.type==='reload';return perf?.navigation?.type===1;}catch{return false;}}
