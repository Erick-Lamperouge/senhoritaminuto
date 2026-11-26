/** Wrap without duplicating visual items. An even carousel keeps the tie on the right. */
export function wrapIndex(index,length){
 if(!Number.isInteger(index)||!Number.isInteger(length)||length<1)throw new Error('Invalid carousel index');
 return ((index%length)+length)%length;
}
export function carouselOffset(index,active,length){
 const forward=wrapIndex(index-active,length);
 return forward>Math.floor(length/2)?forward-length:forward;
}
export function slotFor(index,active,length){
 const offset=carouselOffset(index,active,length);
 return offset===0?'front':offset===-1?'left':offset===1?'right':offset<0?'back-left':'back-right';
}
export function nextSelection(active,key,length){
 if(key==='ArrowLeft')return wrapIndex(active-1,length);
 if(key==='ArrowRight')return wrapIndex(active+1,length);
 if(key==='Home')return 0;
 if(key==='End')return length-1;
 return active;
}
