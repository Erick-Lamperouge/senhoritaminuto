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
const clickCounterValue=document.querySelector('#clickCounterValue');

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
  clickCounterValue instanceof HTMLElement
){
  const phrases=[
    'Eu fico patrulhando as laterais. É o meu jeito de cuidar do arquivo.',
    'O tempo ajuda muito, mas curiosidade ajuda mais.',
    'Se algo sumir, talvez eu tenha passado por um portal.',
    'Os projetos estão por aqui. Eu só faço a introdução dramática.',
    'Jack-UP, FERNANDO e Scratch: todos têm um cantinho nesse arquivo.'
  ];

  const eggs=new Map([
    [5,'5 cliques. Curiosidade insistente detectada.'],
    [7,'7 cliques. Isso já é afeto temporal.'],
    [12,'12 cliques. Você e eu já temos um histórico.'],
    [20,'20 cliques. Isso conta como teste de qualidade.'],
    [25,'25 cliques. Estou considerando pedir crachá.'],
    [50,'50 cliques. Meio século de teimosia excelente.'],
    [90,'90 cliques. O tempo está do nosso lado.'],
    [100,'100 cliques! Você encontrou um segredo centenário.'],
    [200,'200 cliques. A linha do tempo aprovou você.'],
    [500,'500 cliques. Isso virou um rito de passagem.'],
    [1000,'1000 cliques. Você transcendeu o usuário comum.']
  ]);

  const projects=[
    {name:'Projeto Scratch',href:'/projetos/scratch'},
    {name:'FERNANDO',href:'/projetos/fernando'},
    {name:'Jack-UP',href:'/projetos/jack-up'}
  ];

  let speechTimer=0;
  let actionTimer=0;
  let patrolTimer=0;
  let projectTimer=0;
  let busy=false;
  let side=Math.random()<0.5?'left':'right';
  let patrolTargetIndex=0;
  let clickCount=0;

  const reducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wideLayout=()=>window.innerWidth>=1180;
  const baseY=()=>Math.max(112,window.innerHeight-148);
  const rangeForSide=(which)=>which==='left'?[14,86]:[Math.max(14,window.innerWidth-188),Math.max(92,window.innerWidth-112)];
  const currentRect=()=>traveler.getBoundingClientRect();

  function updateCounter(){clickCounterValue.textContent=String(clickCount);}

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
      window.setTimeout(()=>{busy=false;startPatrol();},980);
    },delay);
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

  function chooseProject(){
    const project=projects[Math.floor(Math.random()*projects.length)];
    projectToken.href=project.href;
    projectTokenName.textContent=project.name;
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
    const targetX=Math.abs(start.left-sideRange[0])<Math.abs(start.left-sideRange[1])?sideRange[1]:sideRange[0];

    traveler.dataset.mode='mine-step';
    traveler.style.transition='left .3s ease, top .3s ease, opacity .28s ease, transform .35s ease, filter .35s ease';
    placeMine();
    mineEvent.classList.add('active');

    window.setTimeout(()=>{
      traveler.dataset.mode='blast';
      mineBlast.classList.add('active');
      setPosition(start.left,start.top-120);
    },650);

    window.setTimeout(()=>{
      mineEvent.classList.remove('active');
      mineBlast.classList.remove('active');
      traveler.dataset.mode='balloon-drop';
      say('uuuh...',1900);
      setPosition(start.left,-170,true);
      traveler.classList.add('balloon-falling');
      setFacingForDirection(targetX,start.left);
      setPosition(targetX,baseY()-18);
    },1150);

    window.setTimeout(()=>{
      traveler.classList.remove('balloon-falling');
      traveler.dataset.mode='impact';
    },2550);

    window.setTimeout(()=>{traveler.dataset.mode='rewind';},3450);
    window.setTimeout(()=>resetToPatrol(0),4600);
  }

  function guitarSolo(){
    if(busy||reducedMotion())return;
    busy=true;
    stopPatrol();
    clearEphemera();
    traveler.dataset.mode='guitar';
    say('♪ Tempo tempo tempo... ♫',4200);
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
      ? [20,56,18,58,20,60,24,60]
      : [window.innerWidth-116,window.innerWidth-152,window.innerWidth-118,window.innerWidth-154,window.innerWidth-120,window.innerWidth-156,window.innerWidth-122,window.innerWidth-156];
    const ySteps=[baseY()-20,baseY()-92,baseY()-164,baseY()-236,324,264,204,46];
    const willFall=Math.random()<0.45;

    traveler.dataset.mode='climb';
    setFacing(side==='left'?1:-1);
    setPosition(leftSteps[0],baseY()-18,true);
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
      const topX=side==='left'?18:Math.max(18,window.innerWidth-118);
      setFacing(side==='left'?1:-1);
      setPosition(topX,46);
      const project=chooseProject();
      projectToken.classList.add('active');
      say(`Olha esse projeto que incrível: ${project.name}. Clica nele pra olhar.`,5600);
      projectTimer=window.setTimeout(()=>projectToken.classList.remove('active'),3600);

      window.setTimeout(()=>{
        traveler.dataset.mode='parachute-drop';
        traveler.style.transition='left .9s ease-in-out, top 1.9s ease-in-out, opacity .28s ease, transform .35s ease, filter .35s ease';
        const midX=side==='left'?46:Math.max(46,window.innerWidth-146);
        setPosition(midX,baseY()-22);
      },2200);

      window.setTimeout(()=>resetToPatrol(0),4400);
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
      if(busy){scheduleAction();return;}
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

  button.addEventListener('click',()=>{
    clickCount+=1;
    updateCounter();
    try{window.localStorage.setItem('senhorita-minuto-clickcount-v3',String(clickCount));}catch{}
    playRetroChime();
    if(eggs.has(clickCount))say(eggs.get(clickCount),6200);
    else say(phrases[Math.floor(Math.random()*phrases.length)]);
  });

  try{
    const saved=window.localStorage.getItem('senhorita-minuto-clickcount-v3');
    if(saved)clickCount=Number(saved)||0;
  }catch{}
  updateCounter();

  const firstVisitKey='senhorita-minuto-welcome-v6';
  try{
    if(!window.localStorage.getItem(firstVisitKey)){
      window.setTimeout(()=>{
        say('Oi! Eu sou a Senhorita Minuto. Eu patrulho as laterais o tempo todo — e às vezes faço umas entradas mais dramáticas.',7600);
        window.localStorage.setItem(firstVisitKey,'1');
      },700);
    }
  }catch{
    window.setTimeout(()=>say('Oi! Eu sou a Senhorita Minuto.',6500),700);
  }

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
  },{once:true});
}
