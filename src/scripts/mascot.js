import { MASCOT_TIMING, readingDuration } from './mascot/timing.js';
import { TimerGroup } from './mascot/timers.js';
import { createPortalController } from './mascot/portals.js';

const traveler = document.querySelector('#mascotTraveler');
const button = document.querySelector('#mascotButton');
const speech = document.querySelector('#mascotSpeech');
const portalLeft = document.querySelector('#portalLeft');
const portalRight = document.querySelector('#portalRight');
const interactionPortal = document.querySelector('#interactionPortal');
const climbRouteLeft = document.querySelector('#climbRouteLeft');
const climbRouteRight = document.querySelector('#climbRouteRight');
const windStreaks = document.querySelector('#windStreaks');
const rewindClock = document.querySelector('#rewindClock');
const projectToken = document.querySelector('#projectToken');
const projectTokenName = document.querySelector('#projectTokenName');
const mineEvent = document.querySelector('#mineEvent');
const mineBlast = document.querySelector('#mineBlast');
const musicNotes = document.querySelector('#musicNotes');
const leafShower = document.querySelector('#leafShower');
const clickCounter = document.querySelector('#clickCounter');
const clickCounterValue = document.querySelector('#clickCounterValue');
const futureVisitor = document.querySelector('#futureVisitor');
const futureSpeech = document.querySelector('#futureSpeech');
const repairBeam = document.querySelector('#repairBeam');

const ready =
  traveler instanceof HTMLElement &&
  button instanceof HTMLButtonElement &&
  speech instanceof HTMLElement &&
  portalLeft instanceof HTMLElement &&
  portalRight instanceof HTMLElement &&
  interactionPortal instanceof HTMLElement &&
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
  repairBeam instanceof HTMLElement;

if (ready) {
  const tx = (key, fallback = '') => window.SM_I18N?.t?.(key, fallback) ?? fallback;
  const DEBUG = new URLSearchParams(window.location.search).has('smdebug');
  const debug = (...args) => { if (DEBUG) console.debug('[Senhorita Minuto]', ...args); };
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wideLayout = () => window.innerWidth >= 1180;
  const baseY = () => Math.max(112, window.innerHeight - 148);
  const rangeForSide = (which) =>
    which === 'left'
      ? [14, 86]
      : [Math.max(14, window.innerWidth - 188), Math.max(92, window.innerWidth - 112)];
  const currentRect = () => traveler.getBoundingClientRect();

  const timers = {
    speech: new TimerGroup(),
    patrol: new TimerGroup(),
    scheduler: new TimerGroup(),
    action: new TimerGroup(),
    interaction: new TimerGroup(),
    special: new TimerGroup(),
    idle: new TimerGroup(),
    wake: new TimerGroup(),
    ui: new TimerGroup(),
  };

  const portals = createPortalController({
    left: portalLeft,
    right: portalRight,
    interaction: interactionPortal,
    clamp,
  });

  const activeAnimations = new Set();

  const state = {
    owner: 'patrol', // patrol | autonomous | interaction | sleep | future
    side: Math.random() < 0.5 ? 'left' : 'right',
    patrolTargetIndex: 0,
    clickCount: 0,
    repaired: false,
    lastUserActivity: Date.now(),
    wakeScheduled: false,
  };

  const clickSessionKey = 'senhorita-minuto-clickcount-session-v1';
  const repairSessionKey = 'senhorita-minuto-repaired-session-v1';

  const eggs = new Map([
    [5, 'mascot.egg.5'],
    [7, 'mascot.egg.7'],
    [12, 'mascot.egg.12'],
    [20, 'mascot.egg.20'],
    [25, 'mascot.egg.25'],
    [50, 'mascot.egg.50'],
    [90, 'mascot.egg.90'],
    [100, 'mascot.egg.100'],
    [200, 'mascot.egg.200'],
    [500, 'mascot.egg.500'],
    [1000, 'mascot.egg.1000'],
  ]);

  const projects = [
    { nameKey: 'card.scratch.title', name: 'Projeto Scratch', href: '/projetos/scratch' },
    { nameKey: 'card.fernando.title', name: 'FERNANDO', href: '/projetos/fernando' },
    { nameKey: 'card.jack.title', name: 'Jack-UP', href: '/projetos/jack-up' },
  ];

  function projectMascotVisible() {
    return Array.from(document.querySelectorAll('#scratchCatScene,#fernandoInline')).some((node) => {
      if (!(node instanceof HTMLElement)) return false;
      const rect = node.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    });
  }

  function setMood(mood = 'neutral') {
    traveler.dataset.mood = mood;
  }

  function setFacing(value) {
    traveler.style.setProperty('--facing', String(value));
  }

  function setFacingForDirection(nextX, currentX) {
    setFacing(nextX >= currentX ? 1 : -1);
  }

  function setSide(which) {
    state.side = which;
    traveler.dataset.side = which;
  }

  function setPosition(left, top, instant = false) {
    if (instant) traveler.classList.add('no-travel-transition');
    traveler.style.left = `${left}px`;
    traveler.style.top = `${top}px`;
    if (instant) {
      traveler.getBoundingClientRect();
      traveler.classList.remove('no-travel-transition');
    }
  }

  function cancelActiveAnimations() {
    for (const animation of activeAnimations) {
      try {
        animation.cancel();
      } catch {}
    }
    activeAnimations.clear();
  }

  function trackAnimation(animation) {
    activeAnimations.add(animation);
    const done = () => activeAnimations.delete(animation);
    animation.addEventListener?.('finish', done, { once: true });
    animation.addEventListener?.('cancel', done, { once: true });
    return animation;
  }

  function patrolPoints() {
    const [a, b] = rangeForSide(state.side);
    const y = baseY() - 18;
    return [
      { x: a, y },
      { x: b, y },
    ];
  }

  function alignToPatrolBase(instant = false) {
    const points = patrolPoints();
    const chosen = points[state.patrolTargetIndex % 2];
    traveler.dataset.mode = 'walk';
    setPosition(chosen.x, chosen.y, instant);
  }

  function hideMinuteSpeech(immediate = false) {
    timers.speech.clearAll();
    if (speech.hidden) return;
    if (immediate) {
      speech.hidden = true;
      speech.classList.remove('bubble-enter', 'bubble-leave');
      return;
    }
    speech.classList.remove('bubble-enter');
    speech.classList.add('bubble-leave');
    timers.speech.set(() => {
      speech.hidden = true;
      speech.classList.remove('bubble-leave');
    }, 140);
  }

  function say(message, duration) {
    const nextDuration =
      typeof duration === 'number'
        ? duration
        : readingDuration(message, { min: MASCOT_TIMING.normalMinMs, max: 12_000 });

    window.dispatchEvent(new CustomEvent('sm:minute-bubble-open'));
    speech.textContent = message;
    speech.hidden = false;
    speech.classList.remove('bubble-leave', 'bubble-enter');
    void speech.offsetWidth;
    speech.classList.add('bubble-enter');
    timers.speech.clearAll();
    timers.speech.set(() => hideMinuteSpeech(false), nextDuration);
  }

  function updateCounter() {
    clickCounterValue.textContent = String(state.clickCount);
  }

  function showClickCounter(duration = 3000) {
    clickCounter.hidden = false;
    timers.ui.set(() => {
      clickCounter.hidden = true;
    }, duration);
  }

  function updateCracks() {
    if (state.repaired || state.clickCount <= 50) {
      traveler.dataset.crack = '0';
      return;
    }
    if (state.clickCount < 100) traveler.dataset.crack = '1';
    else if (state.clickCount < 200) traveler.dataset.crack = '2';
    else if (state.clickCount < 500) traveler.dataset.crack = '3';
    else traveler.dataset.crack = '4';
  }

  function clearVisualEphemera({ closePortals = true } = {}) {
    windStreaks.classList.remove('active');
    rewindClock.classList.remove('active');
    projectToken.classList.remove('active');
    climbRouteLeft.classList.remove('active');
    climbRouteRight.classList.remove('active');
    mineEvent.classList.remove('active');
    mineBlast.classList.remove('active');
    musicNotes.classList.remove('active');
    leafShower.classList.remove('active');
    if (closePortals) portals.closeAll();
  }

  function normalizeTravelerClasses() {
    traveler.classList.remove(
      'portal-enter',
      'portal-exit',
      'blink-in',
      'interacting',
      'interaction-power',
      'power-active',
      'balloon-falling',
    );
    traveler.style.removeProperty('--sm-interaction-top');
  }

  function stopPatrol() {
    timers.patrol.clearAll();
  }

  function startPatrol() {
    stopPatrol();
    if (state.owner !== 'patrol' || reducedMotion()) return;

    const step = () => {
      if (state.owner !== 'patrol') return;
      const points = patrolPoints();
      state.patrolTargetIndex = (state.patrolTargetIndex + 1) % 2;
      const target = points[state.patrolTargetIndex];
      const current = currentRect();
      traveler.dataset.mode = 'side-walk';
      traveler.style.transition =
        'left 1.8s ease-in-out, top .8s ease, opacity .28s ease, transform .35s ease, filter .35s ease';
      setFacingForDirection(target.x, current.left);
      setPosition(target.x, target.y);
      timers.patrol.set(step, 1900);
    };

    step();
  }

  function returnToPatrol({ instant = false } = {}) {
    timers.action.clearAll();
    cancelActiveAnimations();
    clearVisualEphemera();
    normalizeTravelerClasses();
    setMood('neutral');
    state.owner = 'patrol';
    traveler.dataset.mode = 'walk';

    const points = patrolPoints();
    const current = currentRect();
    const nearest = Math.abs(current.left - points[0].x) <= Math.abs(current.left - points[1].x) ? 0 : 1;
    state.patrolTargetIndex = nearest;
    setFacingForDirection(points[nearest].x, current.left);
    setPosition(points[nearest].x, points[nearest].y, instant);
    startPatrol();
    scheduleAutonomousAction();
  }

  function cancelAutonomousAction({ keepPosition = true } = {}) {
    if (state.owner !== 'autonomous') return;
    timers.action.clearAll();
    cancelActiveAnimations();
    clearVisualEphemera();
    normalizeTravelerClasses();
    setMood('neutral');
    state.owner = 'patrol';
    traveler.dataset.mode = 'walk';
    if (!keepPosition) alignToPatrolBase(true);
  }

  function beginAutonomous(mode) {
    if (state.owner !== 'patrol' || reducedMotion()) return false;
    state.owner = 'autonomous';
    stopPatrol();
    timers.action.clearAll();
    cancelActiveAnimations();
    clearVisualEphemera();
    normalizeTravelerClasses();
    traveler.dataset.mode = mode;
    return true;
  }

  function finishAutonomous(delay = 0) {
    timers.action.set(() => returnToPatrol(), delay);
  }

  function scheduleAutonomousAction() {
    timers.scheduler.clearAll();
    if (reducedMotion() || state.owner === 'sleep' || state.owner === 'future') return;

    timers.scheduler.set(() => {
      if (state.owner !== 'patrol' || projectMascotVisible()) {
        scheduleAutonomousAction();
        return;
      }

      const roll = Math.random();
      if (!wideLayout()) {
        if (roll < 0.27) balloonDrop();
        else if (roll < 0.48) guitarSolo();
      } else if (roll < 0.18) climbAdventure();
      else if (roll < 0.34) balloonDrop();
      else if (roll < 0.50) guitarSolo();
      else if (roll < 0.68) crossToOtherSide();

      scheduleAutonomousAction();
    }, 7200 + Math.random() * 3200);
  }

  function scheduleIdleSleep() {
    timers.idle.clearAll();
    if (reducedMotion() || state.owner === 'sleep' || state.owner === 'future') return;

    const elapsed = Date.now() - state.lastUserActivity;
    const remaining = Math.max(0, MASCOT_TIMING.idleSleepMs - elapsed);
    timers.idle.set(tryIdleSleep, remaining);
  }

  function tryIdleSleep() {
    timers.idle.clearAll();
    const elapsed = Date.now() - state.lastUserActivity;
    if (elapsed < MASCOT_TIMING.idleSleepMs) {
      scheduleIdleSleep();
      return;
    }

    if (state.owner === 'future') {
      timers.idle.set(tryIdleSleep, 1000);
      return;
    }

    if (state.owner === 'interaction') {
      timers.idle.set(tryIdleSleep, 750);
      return;
    }

    if (state.owner === 'autonomous') cancelAutonomousAction({ keepPosition: true });
    enterSleep('idle');
  }

  function sleepMessage(reason) {
    const options =
      reason === 'hidden'
        ? [
            tx('mascot.sleep.hidden1', 'Dê tempo ao tempo... eu já volto.'),
            tx('mascot.sleep.hidden2', 'Preciso descansar um pouquinho.'),
          ]
        : [
            tx('mascot.sleep.idle1', 'Dê tempo ao tempo.'),
            tx('mascot.sleep.idle2', 'Que sono... preciso descansar.'),
            tx('mascot.sleep.idle3', 'Só vou tirar um cochilo rapidinho.'),
          ];
    return options[Math.floor(Math.random() * options.length)];
  }

  function enterSleep(reason = 'idle') {
    debug('sleep:start', { reason, owner: state.owner, idleMs: Date.now() - state.lastUserActivity });
    if (state.owner === 'sleep' || state.owner === 'future') return;

    timers.scheduler.clearAll();
    timers.action.clearAll();
    timers.interaction.clearAll();
    timers.idle.clearAll();
    timers.wake.clearAll();
    state.wakeScheduled = false;
    cancelActiveAnimations();
    stopPatrol();
    clearVisualEphemera();
    normalizeTravelerClasses();
    hideMinuteSpeech(true);

    state.owner = 'sleep';
    setMood('neutral');

    const points = patrolPoints();
    const current = currentRect();
    const nearest = Math.abs(current.left - points[0].x) <= Math.abs(current.left - points[1].x) ? 0 : 1;
    state.patrolTargetIndex = nearest;
    const destination = points[nearest];
    setFacing(1);
    traveler.dataset.mode = 'walk';
    traveler.style.transition =
      'left .65s ease, top .65s ease, opacity .28s ease, transform .35s ease, filter .35s ease';
    setPosition(destination.x, destination.y);

    timers.idle.set(() => {
      if (state.owner !== 'sleep') return;
      traveler.dataset.mode = 'sleep';
      const message = sleepMessage(reason);
      say(message, readingDuration(message, { min: 3000, max: 6200 }));
    }, 680);
  }

  function wakeFromSleep() {
    debug('sleep:wake');
    if (state.owner !== 'sleep') return;
    timers.wake.clearAll();
    timers.idle.clearAll();
    state.wakeScheduled = false;
    hideMinuteSpeech(true);
    clearVisualEphemera();
    normalizeTravelerClasses();
    state.owner = 'patrol';
    traveler.dataset.mode = 'walk';
    setMood('neutral');
    alignToPatrolBase(true);
    state.lastUserActivity = Date.now();
    startPatrol();
    scheduleAutonomousAction();
    scheduleIdleSleep();
  }

  function registerUserActivity() {
    state.lastUserActivity = Date.now();

    if (state.owner === 'sleep') {
      // A primeira movimentação inicia a contagem. Movimentos seguintes não
      // reiniciam os 3 s; assim ela sempre acorda três segundos depois.
      if (!state.wakeScheduled) {
        state.wakeScheduled = true;
        timers.wake.set(wakeFromSleep, MASCOT_TIMING.wakeDelayMs);
      }
      return;
    }

    scheduleIdleSleep();
  }

  function beginInteraction(detail) {
    debug('interaction:request', detail?.target);
    if (state.owner === 'sleep' || state.owner === 'future' || state.owner === 'interaction') return false;
    if (state.owner === 'autonomous') cancelAutonomousAction({ keepPosition: true });

    const selector = typeof detail?.target === 'string' ? detail.target : '';
    const target = selector ? document.querySelector(selector) : null;
    if (!(target instanceof HTMLElement)) {
      if (typeof detail?.message === 'string') {
        say(detail.message, Number(detail.duration) || readingDuration(detail.message, { min: 3000 }));
      }
      return false;
    }

    state.owner = 'interaction';
    debug('interaction:start', { target: selector });
    timers.scheduler.clearAll();
    timers.interaction.clearAll();
    stopPatrol();
    cancelActiveAnimations();
    clearVisualEphemera();
    normalizeTravelerClasses();
    hideMinuteSpeech(true);

    const homeSide = state.side;
    const targetRect = target.getBoundingClientRect();
    const targetX = clamp(targetRect.left - 92, 10, Math.max(10, window.innerWidth - 112));
    const targetY = clamp(targetRect.bottom - 110, 12, Math.max(12, window.innerHeight - 124));
    const power = Boolean(detail?.power);
    const mood = typeof detail?.mood === 'string' ? detail.mood : 'happy';
    const duration = Math.max(
      MASCOT_TIMING.normalMinMs,
      Number(detail?.duration) || readingDuration(detail?.message || '', { min: 3000, max: 10_000 }),
    );
    const hold = Math.max(duration + 900, Number(detail?.hold) || duration + 1500);

    traveler.classList.add('interacting');
    if (power) traveler.classList.add('power-active', 'interaction-power');
    traveler.style.setProperty('--sm-interaction-top', `${targetY}px`);
    traveler.dataset.mode = 'portal';
    setMood('neutral');

    portals.closeGlobals();
    portals.openInteraction({ power });

    timers.interaction.set(() => traveler.classList.add('portal-enter'), 170);
    timers.interaction.set(() => {
      // O portal de interação mora dentro do traveler. Ele viaja junto com ela,
      // então nunca existe um segundo portal órfão na lateral da tela.
      setPosition(targetX, targetY, true);
      setSide(targetX > window.innerWidth / 2 ? 'right' : 'left');
      setFacing(1);
      traveler.classList.remove('portal-enter');
      traveler.classList.add('blink-in');
    }, 560);
    timers.interaction.set(() => portals.closeInteraction(), 820);
    timers.interaction.set(() => {
      traveler.dataset.mode = 'interaction';
      setMood(mood);
      if (typeof detail?.message === 'string') say(detail.message, duration);
    }, 900);
    timers.interaction.set(() => traveler.classList.remove('blink-in'), 1180);
    timers.interaction.set(() => returnFromInteraction(homeSide), 900 + hold);
    return true;
  }

  function returnFromInteraction(homeSide) {
    debug('interaction:return', { homeSide });
    if (state.owner !== 'interaction') return;
    timers.interaction.clearAll();
    portals.closeGlobals();
    portals.openInteraction({ power: traveler.classList.contains('interaction-power') });
    hideMinuteSpeech(true);
    setMood('neutral');
    traveler.dataset.mode = 'portal';

    timers.interaction.set(() => traveler.classList.add('portal-enter'), 150);
    timers.interaction.set(() => {
      const [targetX] = rangeForSide(homeSide);
      const targetY = baseY() - 18;
      setSide(homeSide);
      traveler.classList.remove('interacting');
      traveler.style.removeProperty('--sm-interaction-top');
      setPosition(targetX, targetY, true);
      traveler.classList.remove('portal-enter');
      traveler.classList.add('blink-in');
      setFacing(homeSide === 'left' ? 1 : -1);
    }, 500);
    timers.interaction.set(() => portals.closeInteraction(), 760);
    timers.interaction.set(() => {
      normalizeTravelerClasses();
      traveler.dataset.mode = 'walk';
      setMood('neutral');
      state.owner = 'patrol';
      startPatrol();
      scheduleAutonomousAction();
      scheduleIdleSleep();
    }, 1120);
  }

  function placeMine() {
    const rect = currentRect();
    mineEvent.style.left = `${rect.left + 26}px`;
    mineEvent.style.top = `${rect.bottom - 6}px`;
    mineBlast.style.left = `${rect.left - 4}px`;
    mineBlast.style.top = `${rect.bottom - 58}px`;
  }

  function placeWindAndClock(top) {
    const left = state.side === 'left' ? 10 : Math.max(10, window.innerWidth - 150);
    windStreaks.style.left = `${left}px`;
    windStreaks.style.top = `${Math.max(40, top - 10)}px`;
    rewindClock.style.left = `${state.side === 'left' ? 70 : Math.max(10, window.innerWidth - 130)}px`;
    rewindClock.style.top = `${Math.max(24, top - 40)}px`;
  }

  function placeNotes() {
    const rect = currentRect();
    musicNotes.style.left = `${rect.left + 64}px`;
    musicNotes.style.top = `${rect.top + 20}px`;
  }

  function placeLeaves() {
    const rect = currentRect();
    leafShower.style.left = `${rect.left - 6}px`;
    leafShower.style.top = `${Math.max(-8, rect.top - 8)}px`;
  }

  function chooseProject() {
    const project = projects[Math.floor(Math.random() * projects.length)];
    projectToken.href = project.href;
    projectTokenName.textContent = tx(project.nameKey, project.name);
    projectToken.style.left = `${state.side === 'left' ? 106 : Math.max(18, window.innerWidth - 300)}px`;
    return project;
  }

  function isHorizontalPathClear() {
    if (!wideLayout()) return false;
    const rect = currentRect();
    const routeTop = rect.top - 10;
    const routeBottom = rect.bottom + 10;
    const centerLeft = 125;
    const centerRight = window.innerWidth - 125;
    const blockers = document.querySelectorAll(
      'main h1, main h2, main h3, main p, main a, main button, main iframe, main .project-card, main .hero-console, main .fernando-hero, main .embed-shell, main .integration-ready, footer',
    );

    return !Array.from(blockers).some((node) => {
      if (!(node instanceof HTMLElement)) return false;
      const style = window.getComputedStyle(node);
      if (style.visibility === 'hidden' || style.display === 'none') return false;
      const box = node.getBoundingClientRect();
      return box.right > centerLeft && box.left < centerRight && box.bottom > routeTop && box.top < routeBottom;
    });
  }

  function crossToOtherSide() {
    if (isHorizontalPathClear()) skateCross();
    else portalJump();
  }

  function skateCross() {
    if (!beginAutonomous('skate')) return;
    const to = state.side === 'left' ? 'right' : 'left';
    const targetRange = rangeForSide(to);
    const current = currentRect();
    traveler.style.transition =
      'left 4.2s cubic-bezier(.18,.72,.24,1), top .8s ease, opacity .28s ease, transform .35s ease, filter .35s ease';
    setFacingForDirection(targetRange[0], current.left);
    traveler.dataset.side = to;
    setPosition(targetRange[0], baseY() - 18);
    timers.action.set(() => {
      setSide(to);
      state.patrolTargetIndex = 0;
      returnToPatrol();
    }, 4300);
  }

  function portalJump() {
    debug('portal:autonomous-jump', { from: state.side });
    if (!beginAutonomous('portal')) return;
    const from = state.side;
    const to = from === 'left' ? 'right' : 'left';
    const source = from === 'left' ? portalLeft : portalRight;
    const target = to === 'left' ? portalLeft : portalRight;
    const current = currentRect();
    const [targetX] = rangeForSide(to);
    const portalY = current.top + 54;

    portals.closeGlobals();
    portals.openGlobal(source, { x: current.left + 8, y: portalY });
    timers.action.set(() => traveler.classList.add('portal-enter'), 180);
    timers.action.set(() => {
      portals.openGlobal(target, { x: targetX + 8, y: portalY });
      setSide(to);
      setPosition(targetX, current.top, true);
      setFacingForDirection(targetX, current.left);
      traveler.classList.remove('portal-enter');
      traveler.classList.add('portal-exit');
    }, 650);
    timers.action.set(() => {
      portals.closeGlobals();
      traveler.classList.remove('portal-exit');
      state.patrolTargetIndex = 0;
      returnToPatrol();
    }, 1320);
  }

  function balloonDrop() {
    if (!beginAutonomous('mine-step')) return;

    const sideRange = rangeForSide(state.side);
    const minX = sideRange[0];
    const maxX = sideRange[1];
    const centerX = (minX + maxX) / 2;
    const launchTop = -170;
    const landingTop = baseY() - 18;
    const fallDuration = 5200;

    traveler.style.transition =
      'left .3s ease, top .3s ease, opacity .28s ease, transform .35s ease, filter .35s ease';
    placeMine();
    mineEvent.classList.add('active');

    timers.action.set(() => {
      traveler.dataset.mode = 'blast';
      mineBlast.classList.add('active');
      traveler.style.transition =
        'left .2s ease, top .85s cubic-bezier(.22,.78,.3,1), opacity .28s ease, transform .35s ease, filter .35s ease';
      setPosition(centerX, launchTop);
    }, 650);

    timers.action.set(() => {
      mineEvent.classList.remove('active');
      mineBlast.classList.remove('active');
      traveler.dataset.mode = 'balloon-drop';
      say(tx('mascot.balloon', 'uuuh...'), 3200);
      setPosition(centerX, launchTop, true);
      placeLeaves();
      leafShower.classList.add('active');

      const travelerFrames = [
        { left: `${centerX}px`, top: `${launchTop}px` },
        { left: `${centerX + 10}px`, top: `${launchTop + (landingTop - launchTop) * 0.1}px` },
        { left: `${maxX - 4}px`, top: `${launchTop + (landingTop - launchTop) * 0.24}px` },
        { left: `${centerX - 8}px`, top: `${launchTop + (landingTop - launchTop) * 0.38}px` },
        { left: `${minX + 4}px`, top: `${launchTop + (landingTop - launchTop) * 0.52}px` },
        { left: `${centerX + 12}px`, top: `${launchTop + (landingTop - launchTop) * 0.66}px` },
        { left: `${maxX - 10}px`, top: `${launchTop + (landingTop - launchTop) * 0.8}px` },
        { left: `${centerX}px`, top: `${landingTop}px` },
      ];
      const leafFrames = travelerFrames.map((frame) => ({
        left: `${parseFloat(frame.left) - 6}px`,
        top: `${parseFloat(frame.top) - 8}px`,
      }));

      const fall = trackAnimation(traveler.animate(travelerFrames, { duration: fallDuration, easing: 'linear', fill: 'forwards' }));
      const leaves = trackAnimation(leafShower.animate(leafFrames, { duration: fallDuration, easing: 'linear', fill: 'forwards' }));

      timers.action.set(() => {
        try {
          fall.cancel();
          leaves.cancel();
        } catch {}
        setPosition(centerX, landingTop, true);
        leafShower.classList.remove('active');
        traveler.dataset.mode = 'impact';
      }, fallDuration + 20);
    }, 1600);

    timers.action.set(() => {
      traveler.dataset.mode = 'rewind';
    }, 1600 + fallDuration + 900);
    finishAutonomous(1600 + fallDuration + 2050);
  }

  function guitarSolo() {
    if (!beginAutonomous('guitar')) return;
    const message = tx('mascot.guitar', '♪ Tempo tempo tempo... ♫');
    say(message, readingDuration(message, { min: 4200, max: 7200 }));
    placeNotes();
    musicNotes.classList.add('active');
    finishAutonomous(4400);
  }

  function climbAdventure() {
    if (!wideLayout() || !beginAutonomous('climb')) return;

    const route = state.side === 'left' ? climbRouteLeft : climbRouteRight;
    route.classList.add('active');

    const leftSteps =
      state.side === 'left'
        ? [16, 54, 16, 56, 18, 58, 22, 58]
        : [
            window.innerWidth - 110,
            window.innerWidth - 148,
            window.innerWidth - 110,
            window.innerWidth - 150,
            window.innerWidth - 112,
            window.innerWidth - 152,
            window.innerWidth - 116,
            window.innerWidth - 152,
          ];
    const ySteps = [baseY() - 18, baseY() - 93, baseY() - 168, baseY() - 243, 340, 280, 220, 165];
    const willFall = Math.random() < 0.45;

    setFacing(state.side === 'left' ? 1 : -1);
    setPosition(leftSteps[0], baseY() - 18, false);
    traveler.style.transition =
      'left .52s ease, top .56s cubic-bezier(.38,.03,.26,.98), opacity .28s ease, transform .35s ease, filter .35s ease';

    let delay = 260;
    const climbTo = willFall ? 4 : 8;
    for (let i = 0; i < climbTo; i += 1) {
      timers.action.set(() => setPosition(leftSteps[i], ySteps[i]), delay);
      delay += 560;
    }

    const finishClimb = () => {
      if (state.owner !== 'autonomous') return;
      traveler.dataset.mode = 'project-found';
      traveler.style.transition =
        'left .4s ease, top .4s ease, opacity .28s ease, transform .35s ease, filter .35s ease';
      const platformStartX = state.side === 'left' ? 18 : Math.max(18, window.innerWidth - 118);
      const platformEndX = state.side === 'left' ? 72 : Math.max(72, window.innerWidth - 172);
      const jumpX = state.side === 'left' ? 88 : Math.max(88, window.innerWidth - 188);
      const topY = 46;
      const projectSpeechDuration = 5600;
      const projectButtonExtra = 3000;

      setFacing(state.side === 'left' ? 1 : -1);
      setPosition(platformStartX, topY);
      const project = chooseProject();
      projectToken.classList.add('active');
      const projectName = tx(project.nameKey, project.name);
      const message = tx(
        'mascot.projectFound',
        'Olha esse projeto que incrível: {project}. Clica nele pra olhar.',
      ).replace('{project}', projectName);
      say(message, Math.max(projectSpeechDuration, readingDuration(message, { min: 5200, max: 9000 })));

      timers.action.set(() => projectToken.classList.remove('active'), projectSpeechDuration + projectButtonExtra);
      timers.action.set(() => {
        traveler.dataset.mode = 'side-walk';
        traveler.style.transition =
          'left 1.2s ease-in-out, top .4s ease, opacity .28s ease, transform .35s ease, filter .35s ease';
        setFacingForDirection(platformEndX, platformStartX);
        setPosition(platformEndX, topY);
      }, projectSpeechDuration);
      timers.action.set(() => {
        traveler.dataset.mode = 'jump';
        traveler.style.transition =
          'left .45s ease-in-out, top .45s ease-out, opacity .28s ease, transform .35s ease, filter .35s ease';
        setPosition(jumpX, 12);
      }, projectSpeechDuration + 1450);
      timers.action.set(() => {
        traveler.dataset.mode = 'parachute-drop';
        traveler.style.transition =
          'left .9s ease-in-out, top 2.1s ease-in-out, opacity .28s ease, transform .35s ease, filter .35s ease';
        const midX = state.side === 'left' ? 50 : Math.max(50, window.innerWidth - 150);
        setPosition(midX, baseY() - 22);
      }, projectSpeechDuration + 1900);
      finishAutonomous(projectSpeechDuration + projectButtonExtra + 900);
    };

    if (willFall) {
      const fallFromY = ySteps[3];
      const fallToY = ySteps[1] + 22;
      timers.action.set(() => {
        traveler.dataset.mode = 'climb-fall';
        placeWindAndClock(fallFromY);
        windStreaks.classList.add('active');
        traveler.style.transition =
          'left .25s ease, top .95s cubic-bezier(.52,.03,.92,.36), opacity .28s ease, transform .35s ease, filter .35s ease';
        setPosition(leftSteps[2], fallToY);
      }, 2500);
      timers.action.set(() => {
        windStreaks.classList.remove('active');
        rewindClock.classList.add('active');
        traveler.dataset.mode = 'climb-rewind';
        traveler.style.transition =
          'left .25s ease, top 1.18s cubic-bezier(.14,.82,.24,1), opacity .28s ease, transform .35s ease, filter .35s ease';
        setPosition(leftSteps[3], fallFromY);
      }, 3800);
      timers.action.set(() => {
        rewindClock.classList.remove('active');
        traveler.dataset.mode = 'climb-recover';
        traveler.style.transition =
          'left .52s ease, top .56s cubic-bezier(.38,.03,.26,.98), opacity .28s ease, transform .35s ease, filter .35s ease';
        let recoverDelay = 220;
        for (let i = 4; i < 8; i += 1) {
          timers.action.set(() => setPosition(leftSteps[i], ySteps[i]), recoverDelay);
          recoverDelay += 560;
        }
      }, 5100);
      timers.action.set(finishClimb, 7400);
    } else {
      timers.action.set(finishClimb, 5000);
    }
  }

  function playRetroChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, ctx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.025, ctx.currentTime + 0.015);
      master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.24);
      master.connect(ctx.destination);
      [620, 930].forEach((frequency, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime + index * 0.055);
        gain.gain.setValueAtTime(index === 0 ? 0.5 : 0.3, ctx.currentTime);
        osc.connect(gain);
        gain.connect(master);
        osc.start(ctx.currentTime + index * 0.055);
        osc.stop(ctx.currentTime + 0.18 + index * 0.055);
      });
      timers.ui.set(() => ctx.close(), 380);
    } catch {}
  }

  function runFutureRepair() {
    debug('future:repair:start');
    if (state.owner === 'future' || state.repaired) return;
    if (state.owner === 'autonomous') cancelAutonomousAction({ keepPosition: true });
    if (state.owner === 'interaction' || state.owner === 'sleep') return;

    state.owner = 'future';
    timers.scheduler.clearAll();
    timers.action.clearAll();
    timers.special.clearAll();
    stopPatrol();
    cancelActiveAnimations();
    clearVisualEphemera();
    hideMinuteSpeech(true);
    setMood('surprised');
    traveler.dataset.mode = 'broken';
    traveler.classList.add('is-dismantled');

    const brokenRect = currentRect();
    const futureX = clamp(
      brokenRect.left + (brokenRect.left < window.innerWidth / 2 ? 112 : -112),
      14,
      Math.max(14, window.innerWidth - 124),
    );
    const futureY = clamp(brokenRect.top - 12, 20, Math.max(20, window.innerHeight - 142));

    timers.special.set(() => {
      portals.openGlobal(portalRight, { x: futureX + 14, y: futureY + 62, future: true });
    }, 1250);
    timers.special.set(() => {
      futureVisitor.style.left = `${futureX}px`;
      futureVisitor.style.top = `${futureY}px`;
      futureVisitor.dataset.bubbleSide = futureX < window.innerWidth / 2 ? 'right' : 'left';
      futureVisitor.hidden = false;
      futureVisitor.classList.remove('leaving');
      futureVisitor.getBoundingClientRect();
      futureVisitor.classList.add('active');
    }, 1650);
    timers.special.set(() => {
      futureSpeech.textContent = tx('mascot.future', 'Eu vim do futuro para consertar você.');
      futureSpeech.hidden = false;
    }, 1900);
    timers.special.set(() => {
      futureSpeech.hidden = true;
      repairBeam.classList.add('active');
      traveler.classList.add('is-repairing', 'power-active');
      setMood('happy');
      state.repaired = true;
      traveler.dataset.crack = '0';
      try {
        window.sessionStorage.setItem(repairSessionKey, '1');
      } catch {}
    }, 4900);
    timers.special.set(() => {
      repairBeam.classList.remove('active');
      traveler.classList.remove('is-dismantled', 'is-repairing', 'power-active');
      traveler.dataset.mode = 'walk';
      setMood('happy');
    }, 6100);
    timers.special.set(() => {
      futureVisitor.classList.add('leaving');
      portals.openGlobal(portalRight, { x: futureX + 14, y: futureY + 62, future: true });
    }, 6850);
    timers.special.set(() => {
      futureVisitor.classList.remove('active', 'leaving');
      futureVisitor.hidden = true;
      portals.closeAll();
      state.owner = 'patrol';
      setMood('neutral');
      returnToPatrol({ instant: true });
      scheduleIdleSleep();
    }, 7550);
  }

  function loadPersistentState() {
    try {
      const navEntry = window.performance?.getEntriesByType?.('navigation')?.[0];
      if (navEntry && navEntry.type === 'reload') {
        window.sessionStorage.removeItem(clickSessionKey);
        window.sessionStorage.removeItem(repairSessionKey);
      }
      state.clickCount = Number(window.sessionStorage.getItem(clickSessionKey)) || 0;
      state.repaired = window.sessionStorage.getItem(repairSessionKey) === '1';
    } catch {}
    updateCounter();
    updateCracks();
    clickCounter.hidden = true;
  }

  button.addEventListener('click', () => {
    if (state.owner === 'future') return;
    registerUserActivity();
    state.clickCount += 1;
    updateCounter();
    try {
      window.sessionStorage.setItem(clickSessionKey, String(state.clickCount));
    } catch {}
    updateCracks();
    playRetroChime();

    if (state.clickCount === 1000 && !state.repaired) {
      showClickCounter(3000);
      runFutureRepair();
      return;
    }

    if (eggs.has(state.clickCount)) {
      showClickCounter(3000);
      const key = eggs.get(state.clickCount);
      const message = tx(key, String(key));
      const duration = readingDuration(message, { min: MASCOT_TIMING.clickMinMs, max: 9800 });
      if (state.owner === 'sleep') {
        timers.ui.set(() => say(message, duration), MASCOT_TIMING.wakeDelayMs + 180);
      } else {
        say(message, duration);
      }
    }
  });

  window.addEventListener('sm:project-bubble-open', () => {
    // Falas de mascotes têm prioridade. Se uma ação autônoma antiga ainda
    // estivesse em andamento, ela é cancelada junto com seus timers.
    if (state.owner === 'autonomous') cancelAutonomousAction({ keepPosition: true });
    portals.closeGlobals();
    if (state.owner !== 'interaction') hideMinuteSpeech(true);
  });

  window.addEventListener('sm:say', (event) => {
    const detail = event instanceof CustomEvent ? event.detail : null;
    if (!detail || typeof detail.message !== 'string' || state.owner === 'sleep') return;
    if (state.owner === 'autonomous') cancelAutonomousAction({ keepPosition: true });
    portals.closeGlobals();
    say(
      detail.message,
      Number(detail.duration) || readingDuration(detail.message, { min: 4200, max: 9000 }),
    );
  });

  window.addEventListener('sm:interact', (event) => {
    const detail = event instanceof CustomEvent ? event.detail : null;
    if (!detail || state.owner === 'sleep' || state.owner === 'future') return;

    const attempt = () => {
      if (state.owner === 'sleep' || state.owner === 'future') return;
      if (state.owner === 'interaction') {
        timers.ui.set(attempt, 350);
        return;
      }
      beginInteraction(detail);
    };
    attempt();
  });

  window.addEventListener('sm:rewind', (event) => {
    if (state.owner === 'sleep' || state.owner === 'future') return;
    const detail = event instanceof CustomEvent ? event.detail : null;
    const duration = Math.max(700, Number(detail?.duration) || 1250);
    traveler.classList.add('power-active');
    if (state.owner === 'interaction') {
      setMood('evil');
      timers.ui.set(() => {
        if (!traveler.classList.contains('interaction-power')) traveler.classList.remove('power-active');
      }, duration);
      return;
    }
    const previousMode = traveler.dataset.mode || 'walk';
    traveler.dataset.mode = 'rewind';
    timers.ui.set(() => {
      traveler.classList.remove('power-active');
      traveler.dataset.mode = state.owner === 'patrol' ? 'side-walk' : previousMode;
    }, duration);
  });

  const firstVisitKey = 'senhorita-minuto-welcome-v6';
  try {
    if (!window.localStorage.getItem(firstVisitKey) && !projectMascotVisible()) {
      timers.ui.set(() => {
        const welcome = tx(
          'mascot.welcome',
          'Oi! Eu sou a Senhorita Minuto. Eu patrulho as laterais o tempo todo — e às vezes faço umas entradas mais dramáticas.',
        );
        say(welcome, readingDuration(welcome, { min: MASCOT_TIMING.initialMinMs, max: 11_000 }));
        window.localStorage.setItem(firstVisitKey, '1');
      }, 700);
    }
  } catch {
    if (!projectMascotVisible()) {
      timers.ui.set(() => {
        const welcome = tx('mascot.welcome', 'Oi! Eu sou a Senhorita Minuto.');
        say(welcome, readingDuration(welcome, { min: MASCOT_TIMING.initialMinMs, max: 11_000 }));
      }, 700);
    }
  }

  ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((eventName) => {
    window.addEventListener(eventName, registerUserActivity, { passive: true });
  });

  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      if (state.owner === 'autonomous') cancelAutonomousAction({ keepPosition: true });
      if (state.owner !== 'future' && state.owner !== 'interaction') enterSleep('hidden');
      return;
    }
    // Ela permanece dormindo ao voltar para a aba. O primeiro movimento real
    // do usuário dispara o relógio de 3 segundos para acordar.
    if (state.owner !== 'sleep') {
      state.lastUserActivity = Date.now();
      scheduleIdleSleep();
    }
  });

  window.addEventListener('resize', () => {
    portals.closeGlobals();
    if (state.owner !== 'patrol') return;
    alignToPatrolBase(true);
    startPatrol();
  });

  window.addEventListener(
    'pagehide',
    () => {
      Object.values(timers).forEach((group) => group.clearAll());
      cancelActiveAnimations();
      portals.closeAll();
    },
    { once: true },
  );

  loadPersistentState();
  setSide(state.side);
  alignToPatrolBase(true);
  if (!reducedMotion()) {
    startPatrol();
    scheduleAutonomousAction();
    scheduleIdleSleep();
  }
}
