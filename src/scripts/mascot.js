const traveler=document.querySelector('#mascotTraveler');
const button=document.querySelector('#mascotButton');
const speech=document.querySelector('#mascotSpeech');
const portalLeft=document.querySelector('#portalLeft');
const portalRight=document.querySelector('#portalRight');
const climbRouteLeft=document.querySelector('#climbRouteLeft');
const climbRouteRight=document.querySelector('#climbRouteRight');
const windStreaks=document.querySelector('#windStreaks');
const rewindClock=document.querySelector('#rewindClock');
const projectToken=document.querySelector('#projectToken');
const projectTokenName=document.querySelector('#projectTokenName');
const mineEvent=document.querySelector('#mineEvent');
const mineBlast=document.querySelector('#mineBlast');
const musicNotes=document.querySelector('#musicNotes');
const leafShower=document.querySelector('#leafShower');
const clickCounter=document.querySelector('#clickCounter');
const clickCounterValue=document.querySelector('#clickCounterValue');
const futureVisitor=document.querySelector('#futureVisitor');
const futureSpeech=document.querySelector('#futureSpeech');
const repairBeam=document.querySelector('#repairBeam');

if(
  traveler instanceof HTMLElement &&
  button instanceof HTMLButtonElement &&
  speech instanceof HTMLElement &&
  portalLeft instanceof HTMLElement &&
  portalRight instanceof HTMLElement &&
  climbRouteLeft instanceof HTMLElement &&
  climbRouteRight instanceof HTMLElement &&
  windStreaks instanceof HTMLElement &&
  rewindClock instanceof HTMLElement &&
  projectToken instanceof HTMLAnchorElement &&
  projectTokenName instanceof HTMLElement &&
  mineEvent instanceof HTMLElement &&
  mineBlast instanceof HTMLElement &&
  musicNotes instanceof HTMLElement &&
  leafShower instanceof HTMLElement &&
  clickCounter instanceof HTMLElement &&
  clickCounterValue instanceof HTMLElement &&
  futureVisitor instanceof HTMLElement &&
  futureSpeech instanceof HTMLElement &&
  repairBeam instanceof HTMLElement
){
  const tx=(key,fallback='')=>window.SM_I18N?.t?.(key,fallback) ?? fallback;

  const eggs=new Map([
    [5,'mascot.egg.5'],
    [7,'mascot.egg.7'],
    [12,'mascot.egg.12'],
    [20,'mascot.egg.20'],
    [25,'mascot.egg.25'],
    [50,'mascot.egg.50'],
    [90,'mascot.egg.90'],
    [100,'mascot.egg.100'],
    [200,'mascot.egg.200'],
    [500,'mascot.egg.500'],
    [1000,'mascot.egg.1000']
  ]);

  const projects=[
    {nameKey:'card.scratch.title',name:'Projeto Scratch',href:'/projetos/scratch'},
    {nameKey:'card.fernando.title',name:'FERNANDO',href:'/projetos/fernando'},
    {nameKey:'card.jack.title',name:'Jack-UP',href:'/projetos/jack-up'}
  ];

  let speechTimer=0;
  let actionTimer=0;
  let patrolTimer=0;
  let projectTimer=0;
  let busy=false;
  let side=Math.random()<0.5?'left':'right';
  let patrolTargetIndex=0;
  let clickCount=0;
  let clickCounterTimer=0;
  let interactionTimer=0;
  let futureSequence=false;
  let repaired=false;
  const clickSessionKey='senhorita-minuto-clickcount-session-v1';
  const repairSessionKey='senhorita-minuto-repaired-session-v1';

  const reducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wideLayout=()=>window.innerWidth>=1180;
  const baseY=()=>Math.max(112,window.innerHeight-148);
  const rangeForSide=(which)=>which==='left'?[14,86]:[Math.max(14,window.innerWidth-188),Math.max(92,window.innerWidth-112)];
  const currentRect=()=>traveler.getBoundingClientRect();
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
  const projectMascotVisible=()=>Array.from(document.querySelectorAll('#scratchCatScene,#fernandoInline')).some((node)=>{
    if(!(node instanceof HTMLElement))return false;
    const r=node.getBoundingClientRect();
    return r.bottom>0&&r.top<window.innerHeight&&r.right>0&&r.left<window.innerWidth;
  });

  function setMood(mood='neutral'){traveler.dataset.mood=mood;}

  function updateCracks(){
    if(repaired||clickCount<=50){traveler.dataset.crack='0';return;}
    if(clickCount<100)traveler.dataset.crack='1';
    else if(clickCount<200)traveler.dataset.crack='2';
    else if(clickCount<500)traveler.dataset.crack='3';
    else if(clickCount<1000)traveler.dataset.crack='4';
    else traveler.dataset.crack='4';
  }

  function setPortalPosition(portal,x,y){
    portal.style.right='auto';
    portal.style.left=`${clamp(x,6,Math.max(6,window.innerWidth-96))}px`;
    portal.style.top=`${clamp(y,52,Math.max(52,window.innerHeight-52))}px`;
  }

  function restorePortalPosition(portal){
    portal.style.left='';
    portal.style.right='';
    portal.style.top='';
    portal.classList.remove('future-color');
  }

  function updateCounter(){clickCounterValue.textContent=String(clickCount);}

  function showClickCounter(duration=3000){
    clickCounter.hidden=false;
    window.clearTimeout(clickCounterTimer);
    window.clearTimeout(interactionTimer);
    clickCounterTimer=window.setTimeout(()=>{clickCounter.hidden=true;},duration);
  }

  function setFacing(value){traveler.style.setProperty('--facing',String(value));}
  function setFacingForDirection(nextX,currentX){setFacing(nextX>=currentX?1:-1);}
  function setSide(which){side=which;traveler.dataset.side=which;}

  function say(message,duration=4800){
    speech.textContent=message;
    speech.hidden=false;
    window.clearTimeout(speechTimer);
    speechTimer=window.setTimeout(()=>{speech.hidden=true;},duration);
  }

  function playRetroChime(){
    try{
      const AudioCtx=window.AudioContext||window.webkitAudioContext;
      if(!AudioCtx)return;
      const ctx=new AudioCtx();
      const master=ctx.createGain();
      master.gain.setValueAtTime(0.0001,ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.025,ctx.currentTime+0.015);
      master.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.24);
      master.connect(ctx.destination);
      [620,930].forEach((frequency,index)=>{
        const osc=ctx.createOscillator();
        const gain=ctx.createGain();
        osc.type='triangle';
        osc.frequency.setValueAtTime(frequency,ctx.currentTime+index*0.055);
        gain.gain.setValueAtTime(index===0?0.5:0.3,ctx.currentTime);
        osc.connect(gain);
        gain.connect(master);
        osc.start(ctx.currentTime+index*0.055);
        osc.stop(ctx.currentTime+0.18+index*0.055);
      });
      window.setTimeout(()=>ctx.close(),380);
    }catch{}
  }

  function clearEphemera(){
    windStreaks.classList.remove('active');
    rewindClock.classList.remove('active');
    projectToken.classList.remove('active');
    climbRouteLeft.classList.remove('active');
    climbRouteRight.classList.remove('active');
    mineEvent.classList.remove('active');
    mineBlast.classList.remove('active');
    musicNotes.classList.remove('active');
    leafShower.classList.remove('active');
    window.clearTimeout(projectTimer);
  }

  function setPosition(left,top,instant=false){
    if(instant)traveler.classList.add('no-travel-transition');
    traveler.style.left=`${left}px`;
    traveler.style.top=`${top}px`;
    if(instant){traveler.getBoundingClientRect();traveler.classList.remove('no-travel-transition');}
  }

  function patrolPoints(){
    const [a,b]=rangeForSide(side);
    const y=baseY()-18;
    return [{x:a,y},{x:b,y}];
  }

  function alignToPatrolBase(instant=false){
    const points=patrolPoints();
    const chosen=points[patrolTargetIndex%2];
    traveler.dataset.mode='walk';
    setPosition(chosen.x,chosen.y,instant);
  }

  function startPatrol(){
    window.clearTimeout(patrolTimer);
    if(busy||reducedMotion())return;
    const step=()=>{
      if(busy)return;
      const points=patrolPoints();
      patrolTargetIndex=(patrolTargetIndex+1)%2;
      const target=points[patrolTargetIndex];
      const current=currentRect();
      traveler.dataset.mode='side-walk';
      traveler.style.transition='left 1.8s ease-in-out, top .8s ease, opacity .28s ease, transform .35s ease, filter .35s ease';
      setFacingForDirection(target.x,current.left);
      setPosition(target.x,target.y);
      patrolTimer=window.setTimeout(step,1900);
    };
    step();
  }

  function stopPatrol(){window.clearTimeout(patrolTimer);}

  function resetToPatrol(delay=0){
    window.setTimeout(()=>{
      clearEphemera();
      traveler.style.transition='left .95s cubic-bezier(.2,.72,.25,1), top .95s cubic-bezier(.2,.72,.25,1), opacity .28s ease, transform .35s ease, filter .35s ease';
      const points=patrolPoints();
      const current=currentRect();
      const nearest=Math.abs(current.left-points[0].x)<=Math.abs(current.left-points[1].x)?0:1;
      patrolTargetIndex=nearest;
      setFacingForDirection(points[nearest].x,current.left);
      traveler.dataset.mode='walk';
      setPosition(points[nearest].x,points[nearest].y);
      window.setTimeout(()=>{traveler.classList.remove('power-active','interaction-power','interacting');setMood('neutral');busy=false;startPatrol();},980);
    },delay);
  }

  function returnFromInteraction(homeSide){
    window.clearTimeout(interactionTimer);
    const portal=portalRight;
    const current=currentRect();
    setMood('neutral');
    traveler.dataset.mode='portal';
    setPortalPosition(portal,current.left+8,current.top+54);
    portal.classList.add('is-open');
    window.setTimeout(()=>traveler.classList.add('portal-enter'),160);
    window.setTimeout(()=>{
      const [targetX]=rangeForSide(homeSide);
      const targetY=baseY()-18;
      setSide(homeSide);
      traveler.classList.remove('interacting');
      traveler.style.removeProperty('--sm-interaction-top');
      setPortalPosition(portal,targetX+8,targetY+54);
      setPosition(targetX,targetY,true);
      traveler.classList.remove('portal-enter');
      traveler.classList.add('portal-exit');
      setFacing(homeSide==='left'?1:-1);
    },560);
    window.setTimeout(()=>{
      traveler.classList.remove('portal-exit','interacting','interaction-power','power-active');
      portal.classList.remove('is-open');
      restorePortalPosition(portal);
      traveler.dataset.mode='walk';
      setMood('neutral');
      busy=false;
      startPatrol();
    },1180);
  }

  function teleportNearTarget(detail){
    if(futureSequence)return;
    const selector=typeof detail?.target==='string'?detail.target:'';
    const target=selector?document.querySelector(selector):null;
    if(!(target instanceof HTMLElement)){
      if(typeof detail?.message==='string')say(detail.message,Number(detail.duration)||3000);
      return;
    }
    if(busy)return;

    busy=true;
    stopPatrol();
    clearEphemera();
    window.clearTimeout(interactionTimer);

    const homeSide=side;
    const sourceRect=currentRect();
    const targetRect=target.getBoundingClientRect();
    const targetX=clamp(targetRect.left-92,10,Math.max(10,window.innerWidth-112));
    const targetY=clamp(targetRect.bottom-110,12,Math.max(12,window.innerHeight-124));
    traveler.style.setProperty('--sm-interaction-top',`${targetY}px`);
    const portal=portalRight;
    const power=Boolean(detail?.power);
    const mood=typeof detail?.mood==='string'?detail.mood:'happy';
    const duration=Math.max(1200,Number(detail?.duration)||3200);
    const hold=Math.max(duration+1200,Number(detail?.hold)||duration+1800);

    traveler.classList.add('interacting');
    if(power){traveler.classList.add('power-active','interaction-power');}
    setMood('neutral');
    traveler.dataset.mode='portal';
    setPortalPosition(portal,sourceRect.left+8,sourceRect.top+54);
    portal.classList.add('is-open');

    window.setTimeout(()=>traveler.classList.add('portal-enter'),170);
    window.setTimeout(()=>{
      setPortalPosition(portal,targetX+8,targetY+54);
      setPosition(targetX,targetY,true);
      setSide(targetX>window.innerWidth/2?'right':'left');
      setFacing(1);
      traveler.classList.remove('portal-enter');
      traveler.classList.add('portal-exit');
    },620);
    window.setTimeout(()=>{
      traveler.classList.remove('portal-exit');
      portal.classList.remove('is-open');
      restorePortalPosition(portal);
      traveler.dataset.mode='interaction';
      setMood(mood);
      if(typeof detail?.message==='string')say(detail.message,duration);
    },1260);

    interactionTimer=window.setTimeout(()=>returnFromInteraction(homeSide),1260+hold);
  }

  function runFutureRepair(){
    if(futureSequence||repaired)return;
    futureSequence=true;
    busy=true;
    stopPatrol();
    clearEphemera();
    speech.hidden=true;
    setMood('surprised');
    traveler.dataset.mode='broken';
    traveler.classList.add('is-dismantled');

    const brokenRect=currentRect();
    const portal=portalRight;
    const futureX=clamp(brokenRect.left+(brokenRect.left<window.innerWidth/2?112:-112),14,Math.max(14,window.innerWidth-124));
    const futureY=clamp(brokenRect.top-12,20,Math.max(20,window.innerHeight-142));

    window.setTimeout(()=>{
      setPortalPosition(portal,futureX+14,futureY+62);
      portal.classList.add('future-color','is-open');
    },1250);

    window.setTimeout(()=>{
      futureVisitor.style.left=`${futureX}px`;
      futureVisitor.style.top=`${futureY}px`;
      futureVisitor.dataset.bubbleSide=futureX<window.innerWidth/2?'right':'left';
      futureVisitor.hidden=false;
      futureVisitor.classList.remove('leaving');
      futureVisitor.getBoundingClientRect();
      futureVisitor.classList.add('active');
    },1650);

    window.setTimeout(()=>{
      futureSpeech.textContent=tx('mascot.future','Eu vim do futuro para consertar você.');
      futureSpeech.hidden=false;
    },1900);

    window.setTimeout(()=>{
      futureSpeech.hidden=true;
      repairBeam.classList.add('active');
      traveler.classList.add('is-repairing','power-active');
      setMood('happy');
      repaired=true;
      traveler.dataset.crack='0';
      try{window.sessionStorage.setItem(repairSessionKey,'1');}catch{}
    },4900);

    window.setTimeout(()=>{
      repairBeam.classList.remove('active');
      traveler.classList.remove('is-dismantled','is-repairing','power-active');
      traveler.dataset.mode='walk';
      setMood('happy');
    },6100);

    window.setTimeout(()=>{
      portal.classList.add('is-open','future-color');
      futureVisitor.classList.add('leaving');
    },6850);

    window.setTimeout(()=>{
      futureVisitor.classList.remove('active','leaving');
      futureVisitor.hidden=true;
      portal.classList.remove('is-open','future-color');
      restorePortalPosition(portal);
      futureSequence=false;
      setMood('neutral');
      resetToPatrol(0);
    },7550);
  }

  function placeMine(){
    const rect=currentRect();
    mineEvent.style.left=`${rect.left+26}px`;
    mineEvent.style.top=`${rect.bottom-6}px`;
    mineBlast.style.left=`${rect.left-4}px`;
    mineBlast.style.top=`${rect.bottom-58}px`;
  }

  function placeWindAndClock(top){
    const left=side==='left'?10:Math.max(10,window.innerWidth-150);
    windStreaks.style.left=`${left}px`;
    windStreaks.style.top=`${Math.max(40,top-10)}px`;
    rewindClock.style.left=`${side==='left'?70:Math.max(10,window.innerWidth-130)}px`;
    rewindClock.style.top=`${Math.max(24,top-40)}px`;
  }

  function placeNotes(){
    const rect=currentRect();
    musicNotes.style.left=`${rect.left+64}px`;
    musicNotes.style.top=`${rect.top+20}px`;
  }

  function placeLeaves(){
    const rect=currentRect();
    leafShower.style.left=`${rect.left-6}px`;
    leafShower.style.top=`${Math.max(-8, rect.top-8)}px`;
  }

  function chooseProject(){
    const project=projects[Math.floor(Math.random()*projects.length)];
    projectToken.href=project.href;
    projectTokenName.textContent=tx(project.nameKey,project.name);
    projectToken.style.left=`${side==='left'?106:Math.max(18,window.innerWidth-300)}px`;
    return project;
  }

  function isHorizontalPathClear(){
    if(!wideLayout())return false;
    const rect=currentRect();
    const routeTop=rect.top-10;
    const routeBottom=rect.bottom+10;
    const centerLeft=125;
    const centerRight=window.innerWidth-125;
    const blockers=document.querySelectorAll('main h1, main h2, main h3, main p, main a, main button, main iframe, main .project-card, main .hero-console, main .fernando-hero, main .embed-shell, main .integration-ready, footer');
    return !Array.from(blockers).some((node)=>{
      if(!(node instanceof HTMLElement))return false;
      const style=window.getComputedStyle(node);
      if(style.display==='none'||style.visibility==='hidden'||Number(style.opacity)===0)return false;
      const r=node.getBoundingClientRect();
      return r.bottom>routeTop&&r.top<routeBottom&&r.right>centerLeft&&r.left<centerRight;
    });
  }

  function crossToOtherSide(){
    if(busy||reducedMotion()||!wideLayout())return;
    busy=true;
    stopPatrol();
    clearEphemera();
    if(isHorizontalPathClear())skateAcross();
    else portalJump();
  }

  function skateAcross(){
    const to=side==='left'?'right':'left';
    const targetRange=rangeForSide(to);
    const current=currentRect();
    traveler.dataset.mode='skate';
    traveler.style.transition='left 4.2s linear, top .8s ease, opacity .28s ease, transform .35s ease, filter .35s ease';
    setFacingForDirection(targetRange[0],current.left);
    traveler.dataset.side=to;
    setPosition(targetRange[0],baseY()-18);
    window.setTimeout(()=>{setSide(to);patrolTargetIndex=0;resetToPatrol(0);},4300);
  }

  function portalJump(){
    const from=side;
    const to=side==='left'?'right':'left';
    const source=from==='left'?portalLeft:portalRight;
    const target=to==='left'?portalLeft:portalRight;
    const current=currentRect();
    const portalTop=current.top+54;
    source.style.top=`${portalTop}px`;
    target.style.top=`${portalTop}px`;
    source.classList.add('is-open');
    traveler.dataset.mode='portal';
    window.setTimeout(()=>traveler.classList.add('portal-enter'),180);
    window.setTimeout(()=>{
      const [targetX]=rangeForSide(to);
      target.classList.add('is-open');
      setSide(to);
      setPosition(targetX,current.top,true);
      setFacingForDirection(targetX,current.left);
      traveler.classList.remove('portal-enter');
      traveler.classList.add('portal-exit');
    },650);
    window.setTimeout(()=>{
      traveler.classList.remove('portal-exit');
      source.classList.remove('is-open');
      target.classList.remove('is-open');
      patrolTargetIndex=0;
      resetToPatrol(0);
    },1320);
  }

  function balloonDrop(){
    if(busy||reducedMotion())return;
    busy=true;
    stopPatrol();
    clearEphemera();

    const start=currentRect();
    const sideRange=rangeForSide(side);
    const minX=sideRange[0];
    const maxX=sideRange[1];
    const centerX=(minX+maxX)/2;
    const launchTop=-170;
    const landingTop=baseY()-18;
    const fallDuration=5200;

    traveler.dataset.mode='mine-step';
    traveler.style.transition='left .3s ease, top .3s ease, opacity .28s ease, transform .35s ease, filter .35s ease';
    placeMine();
    mineEvent.classList.add('active');

    window.setTimeout(()=>{
      traveler.dataset.mode='blast';
      mineBlast.classList.add('active');
      traveler.style.transition='left .2s ease, top .85s cubic-bezier(.22,.78,.3,1), opacity .28s ease, transform .35s ease, filter .35s ease';
      setPosition(centerX,launchTop);
    },650);

    window.setTimeout(()=>{
      mineEvent.classList.remove('active');
      mineBlast.classList.remove('active');
      traveler.dataset.mode='balloon-drop';
      say(tx('mascot.balloon','uuuh...'),3200);
      setPosition(centerX,launchTop,true);
      placeLeaves();
      leafShower.classList.add('active');

      const travelerFrames=[
        {left:`${centerX}px`,top:`${launchTop}px`},
        {left:`${centerX+10}px`,top:`${launchTop+(landingTop-launchTop)*.10}px`},
        {left:`${maxX-4}px`,top:`${launchTop+(landingTop-launchTop)*.24}px`},
        {left:`${centerX-8}px`,top:`${launchTop+(landingTop-launchTop)*.38}px`},
        {left:`${minX+4}px`,top:`${launchTop+(landingTop-launchTop)*.52}px`},
        {left:`${centerX+12}px`,top:`${launchTop+(landingTop-launchTop)*.66}px`},
        {left:`${maxX-10}px`,top:`${launchTop+(landingTop-launchTop)*.80}px`},
        {left:`${centerX}px`,top:`${landingTop}px`}
      ];
      const leafFrames=travelerFrames.map((frame)=>({
        left:`${parseFloat(frame.left)-6}px`,
        top:`${parseFloat(frame.top)-8}px`
      }));

      const fall=traveler.animate(travelerFrames,{duration:fallDuration,easing:'linear',fill:'forwards'});
      const leaves=leafShower.animate(leafFrames,{duration:fallDuration,easing:'linear',fill:'forwards'});

      window.setTimeout(()=>{
        fall.cancel();
        leaves.cancel();
        setPosition(centerX,landingTop,true);
        leafShower.classList.remove('active');
        traveler.dataset.mode='impact';
      },fallDuration+20);
    },1600);

    window.setTimeout(()=>{traveler.dataset.mode='rewind';},1600+fallDuration+900);
    window.setTimeout(()=>resetToPatrol(0),1600+fallDuration+2050);
  }

  function guitarSolo(){
    if(busy||reducedMotion())return;
    busy=true;
    stopPatrol();
    clearEphemera();
    traveler.dataset.mode='guitar';
    say(tx('mascot.guitar','♪ Tempo tempo tempo... ♫'),4200);
    placeNotes();
    musicNotes.classList.add('active');
    window.setTimeout(()=>resetToPatrol(0),4300);
  }

  function climbAdventure(){
    if(busy||reducedMotion()||!wideLayout())return;
    busy=true;
    stopPatrol();
    clearEphemera();

    const route=side==='left'?climbRouteLeft:climbRouteRight;
    route.classList.add('active');

    const leftSteps=side==='left'
      ? [16,54,16,56,18,58,22,58]
      : [window.innerWidth-110,window.innerWidth-148,window.innerWidth-110,window.innerWidth-150,window.innerWidth-112,window.innerWidth-152,window.innerWidth-116,window.innerWidth-152];
    const ySteps=[baseY()-18,baseY()-93,baseY()-168,baseY()-243,340,280,220,165];
    const willFall=Math.random()<0.45;

    traveler.dataset.mode='climb';
    setFacing(side==='left'?1:-1);
    setPosition(leftSteps[0],baseY()-18,false);
    traveler.style.transition='left .52s ease, top .56s cubic-bezier(.38,.03,.26,.98), opacity .28s ease, transform .35s ease, filter .35s ease';

    let delay=260;
    const climbTo=willFall?4:8;
    for(let i=0;i<climbTo;i+=1){
      window.setTimeout(()=>setPosition(leftSteps[i],ySteps[i]),delay);
      delay+=560;
    }

    const finishClimb=()=>{
      traveler.dataset.mode='project-found';
      traveler.style.transition='left .4s ease, top .4s ease, opacity .28s ease, transform .35s ease, filter .35s ease';
      const platformStartX=side==='left'?18:Math.max(18,window.innerWidth-118);
      const platformEndX=side==='left'?72:Math.max(72,window.innerWidth-172);
      const jumpX=side==='left'?88:Math.max(88,window.innerWidth-188);
      const topY=46;
      const projectSpeechDuration=5600;
      const projectButtonExtra=3000;
      setFacing(side==='left'?1:-1);
      setPosition(platformStartX,topY);
      const project=chooseProject();
      projectToken.classList.add('active');
      const projectName=tx(project.nameKey,project.name);
      say(tx('mascot.projectFound','Olha esse projeto que incrível: {project}. Clica nele pra olhar.').replace('{project}',projectName),projectSpeechDuration);
      projectTimer=window.setTimeout(()=>projectToken.classList.remove('active'),projectSpeechDuration+projectButtonExtra);

      window.setTimeout(()=>{
        traveler.dataset.mode='side-walk';
        traveler.style.transition='left 1.2s ease-in-out, top .4s ease, opacity .28s ease, transform .35s ease, filter .35s ease';
        setFacingForDirection(platformEndX, platformStartX);
        setPosition(platformEndX, topY);
      },projectSpeechDuration);

      window.setTimeout(()=>{
        traveler.dataset.mode='jump';
        traveler.style.transition='left .45s ease-in-out, top .45s ease-out, opacity .28s ease, transform .35s ease, filter .35s ease';
        setPosition(jumpX, 12);
      },projectSpeechDuration+1450);

      window.setTimeout(()=>{
        traveler.dataset.mode='parachute-drop';
        traveler.style.transition='left .9s ease-in-out, top 2.1s ease-in-out, opacity .28s ease, transform .35s ease, filter .35s ease';
        const midX=side==='left'?50:Math.max(50,window.innerWidth-150);
        setPosition(midX,baseY()-22);
      },projectSpeechDuration+1900);

      window.setTimeout(()=>resetToPatrol(0),projectSpeechDuration+projectButtonExtra+900);
    };

    if(willFall){
      const fallFromY=ySteps[3];
      const fallToY=ySteps[1]+22;
      window.setTimeout(()=>{
        traveler.dataset.mode='climb-fall';
        placeWindAndClock(fallFromY);
        windStreaks.classList.add('active');
        traveler.style.transition='left .25s ease, top .95s cubic-bezier(.52,.03,.92,.36), opacity .28s ease, transform .35s ease, filter .35s ease';
        setPosition(leftSteps[2],fallToY);
      },2500);

      window.setTimeout(()=>{
        windStreaks.classList.remove('active');
        rewindClock.classList.add('active');
        traveler.dataset.mode='climb-rewind';
        traveler.style.transition='left .25s ease, top 1.18s cubic-bezier(.14,.82,.24,1), opacity .28s ease, transform .35s ease, filter .35s ease';
        setPosition(leftSteps[3],fallFromY);
      },3800);

      window.setTimeout(()=>{
        rewindClock.classList.remove('active');
        traveler.dataset.mode='climb-recover';
        traveler.style.transition='left .52s ease, top .56s cubic-bezier(.38,.03,.26,.98), opacity .28s ease, transform .35s ease, filter .35s ease';
        let recoverDelay=220;
        for(let i=4;i<8;i+=1){
          window.setTimeout(()=>setPosition(leftSteps[i],ySteps[i]),recoverDelay);
          recoverDelay+=560;
        }
      },5100);

      window.setTimeout(finishClimb,7400);
    } else {
      window.setTimeout(finishClimb,5000);
    }
  }

  function scheduleAction(){
    window.clearTimeout(actionTimer);
    actionTimer=window.setTimeout(()=>{
      if(busy||projectMascotVisible()){scheduleAction();return;}
      const roll=Math.random();
      if(!wideLayout()){
        if(roll<0.25)balloonDrop();
        else if(roll<0.45)guitarSolo();
      } else if(roll<0.18)climbAdventure();
      else if(roll<0.34)balloonDrop();
      else if(roll<0.5)guitarSolo();
      else if(roll<0.68)crossToOtherSide();
      scheduleAction();
    },7200+Math.random()*3200);
  }

  try{
    const navEntry=window.performance?.getEntriesByType?.('navigation')?.[0];
    if(navEntry&&navEntry.type==='reload'){
      window.sessionStorage.removeItem(clickSessionKey);
      window.sessionStorage.removeItem(repairSessionKey);
    }
    clickCount=Number(window.sessionStorage.getItem(clickSessionKey))||0;
    repaired=window.sessionStorage.getItem(repairSessionKey)==='1';
  }catch{}
  updateCounter();
  updateCracks();
  clickCounter.hidden=true;

  button.addEventListener('click',()=>{
    if(futureSequence)return;
    clickCount+=1;
    updateCounter();
    try{window.sessionStorage.setItem(clickSessionKey,String(clickCount));}catch{}
    updateCracks();
    playRetroChime();

    if(clickCount===1000&&!repaired){
      showClickCounter(3000);
      runFutureRepair();
      return;
    }

    if(eggs.has(clickCount)){
      showClickCounter(3000);
      const key=eggs.get(clickCount);
      say(tx(key,String(key)),3000);
    }
  });

  const firstVisitKey='senhorita-minuto-welcome-v6';
  try{
    if(!window.localStorage.getItem(firstVisitKey)){
      window.setTimeout(()=>{
        say(tx('mascot.welcome','Oi! Eu sou a Senhorita Minuto. Eu patrulho as laterais o tempo todo — e às vezes faço umas entradas mais dramáticas.'),7600);
        window.localStorage.setItem(firstVisitKey,'1');
      },700);
    }
  }catch{
    window.setTimeout(()=>say(tx('mascot.welcome','Oi! Eu sou a Senhorita Minuto.'),6500),700);
  }

  window.addEventListener('sm:say',(event)=>{
    const detail=event instanceof CustomEvent?event.detail:null;
    if(!detail||typeof detail.message!=='string')return;
    say(detail.message,Number(detail.duration)||2600);
  });

  window.addEventListener('sm:interact',(event)=>{
    const detail=event instanceof CustomEvent?event.detail:null;
    if(!detail)return;
    const attempt=()=>{
      if(futureSequence)return;
      if(busy){window.setTimeout(attempt,320);return;}
      teleportNearTarget(detail);
    };
    attempt();
  });

  window.addEventListener('sm:rewind',(event)=>{
    const detail=event instanceof CustomEvent?event.detail:null;
    const duration=Math.max(700,Number(detail?.duration)||1250);
    traveler.classList.add('power-active');
    if(traveler.classList.contains('interacting')){
      setMood('evil');
      window.setTimeout(()=>{
        if(!traveler.classList.contains('interaction-power'))traveler.classList.remove('power-active');
      },duration);
      return;
    }
    const previousMode=traveler.dataset.mode||'walk';
    traveler.dataset.mode='rewind';
    window.setTimeout(()=>{
      traveler.classList.remove('power-active');
      if(!busy)traveler.dataset.mode='side-walk';
      else traveler.dataset.mode=previousMode;
    },duration);
  });

  window.addEventListener('sm:language-changed',()=>{
    if(!speech.hidden&&speech.textContent){/* mantém a fala atual até concluir */}
  });

  setSide(side);
  alignToPatrolBase(true);
  if(!reducedMotion()){
    startPatrol();
    scheduleAction();
  }

  window.addEventListener('resize',()=>{
    if(busy)return;
    clearEphemera();
    alignToPatrolBase(true);
    startPatrol();
  });

  window.addEventListener('pagehide',()=>{
    window.clearTimeout(speechTimer);
    window.clearTimeout(actionTimer);
    window.clearTimeout(projectTimer);
    window.clearTimeout(patrolTimer);
    window.clearTimeout(clickCounterTimer);
    window.clearTimeout(interactionTimer);
  },{once:true});
}
