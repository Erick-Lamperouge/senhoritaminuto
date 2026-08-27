const traveler=document.querySelector('#mascotTraveler');
const button=document.querySelector('#mascotButton');
const speech=document.querySelector('#mascotSpeech');
const portalLeft=document.querySelector('#portalLeft');
const portalRight=document.querySelector('#portalRight');
const climbRouteLeft=document.querySelector('#climbRouteLeft');
const climbRouteRight=document.querySelector('#climbRouteRight');
const windStreaks=document.querySelector('#windStreaks');
const rewindClock=document.querySelector('#rewindClock');
const mineEvent=document.querySelector('#mineEvent');
const mineBlast=document.querySelector('#mineBlast');
const projectToken=document.querySelector('#projectToken');
const projectTokenName=document.querySelector('#projectTokenName');

if(traveler instanceof HTMLElement&&button instanceof HTMLButtonElement&&speech instanceof HTMLElement&&portalLeft instanceof HTMLElement&&portalRight instanceof HTMLElement&&climbRouteLeft instanceof HTMLElement&&climbRouteRight instanceof HTMLElement&&windStreaks instanceof HTMLElement&&rewindClock instanceof HTMLElement&&mineEvent instanceof HTMLElement&&mineBlast instanceof HTMLElement&&projectToken instanceof HTMLAnchorElement&&projectTokenName instanceof HTMLElement){
  const phrases=[
    'Eu cuido do tempo. Dos bugs, a gente negocia.',
    'Projetos em destaque ficam logo ali. Eu recomendo começar por um deles.',
    'O FERNANDO trabalha com segundos. Finalmente um projeto que respeita minha especialidade.',
    'O Scratch foi uma das primeiras portas deste arquivo.',
    'Se alguma coisa quebrar, eu tenho um plano. O plano envolve voltar alguns segundos.',
    'Eu sou a Senhorita Minuto: assistente digital, guia e risco temporal moderado.',
    'Curiosidade é um projeto antes de ganhar uma pasta no GitHub.',
    'O Jack-UP chegou ao arquivo. Mascotes devem apoiar outros mascotes.',
    'Você clicou em mim. Excelente decisão. Cientificamente questionável, mas excelente.',
    'Portal para texto; skate para pista livre. Eu também tenho regras de trânsito.'
  ];

  const easterEggs=new Map([
    [5,'5 cliques. Você desbloqueou o nível: curiosidade insistente.'],
    [7,'7 cliques. Esse já é um relacionamento sério com a mascote.'],
    [12,'12 cliques. Estatisticamente, você já devia ter ido ver os projetos.'],
    [20,'20 cliques. Ok, isso já conta como teste de qualidade.'],
    [25,'25 cliques. Eu começo a suspeitar que você quer me contratar em tempo integral.'],
    [50,'50 cliques. Meio século de cliques. Eu respeito sua persistência.'],
    [90,'90 cliques. Isso está perigosamente perto de virar uma religião temporal.'],
    [100,'100 cliques! Parabéns. Você encontrou o centésimo segredo da Senhorita Minuto.'],
    [200,'200 cliques. Eu já deveria ter recebido um troféu por isso.'],
    [500,'500 cliques. Não sei se isso é dedicação, arte ou um experimento social.'],
    [1000,'1000 cliques. Você transcendeu o usuário comum. Agora somos oficialmente cúmplices do tempo.']
  ]);

  const projectTargets=[
    {name:'Projeto Scratch',href:'/projetos/scratch'},
    {name:'FERNANDO',href:'/projetos/fernando'},
    {name:'Jack-UP',href:'/projetos/jack-up'}
  ];

  let speechTimer,movementTimer,projectTimer;
  let busy=false,side='left',patrolHigh=false;
  const clickKey='senhorita-minuto-clicks-v1';
  let clickCount=0;
  try{clickCount=Number(localStorage.getItem(clickKey)||0)||0}catch{}

  const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wideLayout=()=>innerWidth>=1180;
  const baseTop=()=>Math.max(108,innerHeight-148);
  const xFor=s=>s==='left'?20:Math.max(20,innerWidth-116);
  const laneX=(s,offset)=>s==='left'?Math.min(62,10+offset):Math.max(innerWidth-166,xFor('right')-offset);

  function faceInward(s=side){traveler.style.setProperty('--facing',s==='left'?'1':'-1')}
  function setPosition(s,top,instant=false){
    if(instant)traveler.classList.add('no-travel-transition');
    traveler.dataset.side=s;traveler.style.left=`${xFor(s)}px`;traveler.style.top=`${top}px`;faceInward(s);
    if(instant){traveler.getBoundingClientRect();traveler.classList.remove('no-travel-transition')}
  }
  function hideSpeech(){clearTimeout(speechTimer);speech.hidden=true}
  function say(message,duration=4800){speech.textContent=message;speech.hidden=false;clearTimeout(speechTimer);speechTimer=setTimeout(()=>{speech.hidden=true},duration)}

  function playRetroChime(){
    try{
      const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
      const ctx=new AudioCtx(),master=ctx.createGain();master.gain.setValueAtTime(.0001,ctx.currentTime);master.gain.exponentialRampToValueAtTime(.025,ctx.currentTime+.015);master.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.24);master.connect(ctx.destination);
      [620,930].forEach((frequency,index)=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='triangle';osc.frequency.setValueAtTime(frequency,ctx.currentTime+index*.055);gain.gain.setValueAtTime(index===0?.5:.3,ctx.currentTime);osc.connect(gain);gain.connect(master);osc.start(ctx.currentTime+index*.055);osc.stop(ctx.currentTime+.18+index*.055)});
      setTimeout(()=>ctx.close(),380);
    }catch{}
  }

  function clearEphemera(){
    windStreaks.classList.remove('active');rewindClock.classList.remove('active');projectToken.classList.remove('active');
    climbRouteLeft.classList.remove('active');climbRouteRight.classList.remove('active');mineEvent.classList.remove('active');mineBlast.classList.remove('active');
    clearTimeout(projectTimer)
  }

  function placeMine(){
    const x=side==='left'?42:Math.max(12,innerWidth-76);
    mineEvent.style.left=`${x}px`;mineEvent.style.top=`${baseTop()+91}px`;
    mineBlast.style.left=`${side==='left'?12:Math.max(8,innerWidth-112)}px`;mineBlast.style.top=`${baseTop()+40}px`;
  }

  function placeWindAndClock(top){
    const left=side==='left'?10:Math.max(10,innerWidth-150);
    windStreaks.style.left=`${left}px`;windStreaks.style.top=`${Math.max(40,top-10)}px`;
    rewindClock.style.left=`${side==='left'?70:Math.max(10,innerWidth-130)}px`;rewindClock.style.top=`${Math.max(24,top-40)}px`;
  }

  function chooseProject(){
    const p=projectTargets[Math.floor(Math.random()*projectTargets.length)];
    projectToken.href=p.href;projectTokenName.textContent=p.name;
    projectToken.style.left=`${side==='left'?92:Math.max(24,innerWidth-300)}px`;
    return p
  }

  function isHorizontalPathClear(){
    if(!wideLayout())return false;
    const rect=traveler.getBoundingClientRect(),routeTop=rect.top-10,routeBottom=rect.bottom+10,centerLeft=125,centerRight=innerWidth-125;
    const blockers=document.querySelectorAll('main h1,main h2,main h3,main p,main a,main button,main iframe,main .project-card,main .hero-console,main .fernando-hero,main .embed-shell,main .integration-ready,footer');
    return !Array.from(blockers).some(node=>{if(!(node instanceof HTMLElement))return false;const style=getComputedStyle(node);if(style.display==='none'||style.visibility==='hidden'||Number(style.opacity)===0)return false;const r=node.getBoundingClientRect();return r.bottom>routeTop&&r.top<routeBottom&&r.right>centerLeft&&r.left<centerRight})
  }

  function sideWalk(){
    if(busy||reducedMotion()||!wideLayout())return;busy=true;clearEphemera();hideSpeech();
    traveler.dataset.mode='side-walk';faceInward();
    const target=patrolHigh?baseTop():Math.max(112,Math.round(innerHeight*.18));
    patrolHigh=!patrolHigh;
    traveler.style.transition='top 5.4s linear,left .4s ease,opacity .28s ease,transform .35s ease,filter .35s ease';
    traveler.style.top=`${target}px`;
    setTimeout(()=>{traveler.dataset.mode='walk';traveler.style.transition='';busy=false},5500)
  }

  function skateAcross(){
    if(busy||reducedMotion()||!wideLayout())return;busy=true;clearEphemera();
    const to=side==='left'?'right':'left',currentTop=traveler.getBoundingClientRect().top;
    traveler.dataset.mode='skate';traveler.style.top=`${currentTop}px`;traveler.style.setProperty('--facing',to==='right'?'1':'-1');traveler.style.transition='left 4.5s linear,opacity .28s ease,transform .35s ease,filter .35s ease';
    traveler.getBoundingClientRect();traveler.dataset.side=to;traveler.style.left=`${xFor(to)}px`;
    setTimeout(()=>{side=to;traveler.dataset.mode='walk';traveler.style.transition='';faceInward();busy=false},4600)
  }

  function portalJump(){
    if(busy||reducedMotion()||!wideLayout())return;busy=true;clearEphemera();
    const from=side,to=side==='left'?'right':'left',source=from==='left'?portalLeft:portalRight,target=to==='left'?portalLeft:portalRight,currentTop=traveler.getBoundingClientRect().top,portalTop=currentTop+54;
    traveler.style.transition='';source.style.top=`${portalTop}px`;target.style.top=`${portalTop}px`;source.classList.add('is-open');traveler.dataset.mode='portal';
    setTimeout(()=>traveler.classList.add('portal-enter'),180);
    setTimeout(()=>{target.classList.add('is-open');side=to;setPosition(side,currentTop,true);traveler.classList.remove('portal-enter');traveler.classList.add('portal-exit')},650);
    setTimeout(()=>{traveler.classList.remove('portal-exit');traveler.dataset.mode='walk';source.classList.remove('is-open');target.classList.remove('is-open');busy=false},1320)
  }

  function crossToOtherSide(){if(!wideLayout())return;if(isHorizontalPathClear())skateAcross();else portalJump()}

  function balloonDrop(){
    if(busy||reducedMotion())return;busy=true;clearEphemera();hideSpeech();
    const landingTop=baseTop();placeMine();setPosition(side,landingTop,true);traveler.dataset.mode='mine-step';mineEvent.classList.add('active');
    setTimeout(()=>say('...isso estava aí antes?',850),180);
    setTimeout(()=>{
      mineBlast.classList.add('active');mineEvent.classList.remove('active');traveler.dataset.mode='blast';traveler.style.transition='top .62s cubic-bezier(.18,.78,.25,1),left .25s ease';traveler.style.top='-118px';
    },760);
    setTimeout(()=>{
      mineBlast.classList.remove('active');traveler.dataset.mode='balloon-drop';say('uuuh...',2800);traveler.classList.add('balloon-falling');
      const topPoints=[-70,Math.round(landingTop*.16),Math.round(landingTop*.38),Math.round(landingTop*.63),landingTop];
      const offsets=[34,8,46,14,30],stepMs=520;
      topPoints.forEach((top,index)=>setTimeout(()=>{traveler.style.top=`${top}px`;traveler.style.left=`${laneX(side,offsets[index])}px`},index*stepMs));
      setTimeout(()=>{hideSpeech();traveler.classList.remove('balloon-falling');traveler.dataset.mode='impact';traveler.style.left=`${xFor(side)}px`},stepMs*topPoints.length+40);
      setTimeout(()=>{traveler.dataset.mode='rewind'},stepMs*topPoints.length+560);
      setTimeout(()=>{traveler.dataset.mode='walk';setPosition(side,landingTop,true);busy=false},stepMs*topPoints.length+1500)
    },1460)
  }

  function finishClimb(route){
    traveler.dataset.mode='project-found';traveler.style.transition='';
    const project=chooseProject();projectToken.classList.add('active');
    say(`Olha esse projeto que incrível: ${project.name}. Clica nele pra olhar.`,7600);
    projectTimer=setTimeout(()=>projectToken.classList.remove('active'),5800);
    setTimeout(()=>{route.classList.remove('active');projectToken.classList.remove('active');setPosition(side,baseTop(),true);traveler.dataset.mode='walk';busy=false},8200)
  }

  function climbAdventure(){
    if(busy||reducedMotion()||!wideLayout())return;busy=true;clearEphemera();hideSpeech();
    const route=side==='left'?climbRouteLeft:climbRouteRight;
    const bottom=baseTop(),positions=[bottom,bottom-82,bottom-164,bottom-246,Math.max(270,bottom-328),220,155,8];
    const willFall=Math.random()<.45;
    route.classList.add('active');traveler.style.transition='top .58s cubic-bezier(.38,.03,.26,.98),left .2s ease,opacity .28s ease,transform .35s ease,filter .35s ease';traveler.dataset.mode='climb';setPosition(side,positions[0],true);

    if(!willFall){
      positions.slice(1).forEach((pos,index)=>setTimeout(()=>{traveler.style.top=`${pos}px`},480+index*620));
      setTimeout(()=>finishClimb(route),480+(positions.length-1)*620+650);
      return
    }

    positions.slice(1,5).forEach((pos,index)=>setTimeout(()=>{traveler.style.top=`${pos}px`},480+index*620));
    const fallStart=480+4*620+260,fallFrom=positions[4],fallTo=positions[2]+20;
    setTimeout(()=>{
      traveler.dataset.mode='climb-fall';placeWindAndClock(fallFrom);windStreaks.classList.add('active');traveler.style.transition='top 1.15s cubic-bezier(.52,.03,.92,.36),left .2s ease';traveler.style.top=`${fallTo}px`
    },fallStart);
    setTimeout(()=>{
      windStreaks.classList.remove('active');rewindClock.classList.add('active');traveler.dataset.mode='climb-rewind';traveler.style.transition='top 1.25s cubic-bezier(.14,.82,.24,1),left .2s ease';traveler.style.top=`${fallFrom}px`
    },fallStart+1850);
    setTimeout(()=>{
      rewindClock.classList.remove('active');traveler.dataset.mode='climb-recover';traveler.style.transition='top .7s cubic-bezier(.38,.03,.26,.98),left .2s ease';traveler.style.top=`${positions[5]}px`
    },fallStart+3350);
    setTimeout(()=>{traveler.style.top=`${positions[6]}px`},fallStart+4150);
    setTimeout(()=>{traveler.style.top=`${positions[7]}px`},fallStart+4950);
    setTimeout(()=>finishClimb(route),fallStart+5750)
  }

  function guitarMoment(){
    if(busy||reducedMotion())return;busy=true;clearEphemera();hideSpeech();
    traveler.dataset.mode='guitar';traveler.style.transition='';
    say('♪ Tempo tempo tempo... ♫',5400);
    setTimeout(()=>{traveler.dataset.mode='walk';hideSpeech();busy=false},5600)
  }

  function ordinaryMove(){traveler.dataset.mode='walk';faceInward()}

  function scheduleNext(){
    clearTimeout(movementTimer);movementTimer=setTimeout(()=>{
      if(busy){scheduleNext();return}
      if(!wideLayout()){
        const mobileRoll=Math.random();
        if(mobileRoll<.2)balloonDrop();else if(mobileRoll<.34)guitarMoment();else ordinaryMove();
        scheduleNext();return
      }
      const roll=Math.random();
      if(roll<.14)climbAdventure();
      else if(roll<.27)balloonDrop();
      else if(roll<.39)guitarMoment();
      else if(roll<.57)sideWalk();
      else crossToOtherSide();
      scheduleNext()
    },6500+Math.random()*3800)
  }

  button.addEventListener('click',()=>{
    clickCount+=1;try{localStorage.setItem(clickKey,String(clickCount))}catch{}
    playRetroChime();say(easterEggs.get(clickCount)||phrases[Math.floor(Math.random()*phrases.length)],easterEggs.has(clickCount)?6500:4800)
  });

  const firstVisitKey='senhorita-minuto-welcome-v4';
  try{if(!localStorage.getItem(firstVisitKey)){setTimeout(()=>{say('Oi! Eu sou a Senhorita Minuto. Clique em “Ver projetos” para começar — eu fico pelas laterais para não atrapalhar sua leitura.',7600);localStorage.setItem(firstVisitKey,'1')},700)}}catch{setTimeout(()=>say('Oi! Clique em “Ver projetos” para começar.',6500),700)}

  side=Math.random()<.5?'left':'right';setPosition(side,baseTop(),true);if(!reducedMotion())scheduleNext();
  addEventListener('resize',()=>{if(busy)return;clearEphemera();setPosition(side,Math.min(traveler.getBoundingClientRect().top,baseTop()),true);ordinaryMove()});
  addEventListener('pagehide',()=>{clearTimeout(speechTimer);clearTimeout(movementTimer);clearTimeout(projectTimer)},{once:true});
}