/* ===================================================================
   game.js — the core engine. Owns the canvas, the fixed-timestep
   update loop, collision resolution, scoring, and the game's state
   machine (boot -> menu -> ready -> running -> paused -> over).

   Rendering uses a virtual coordinate space (PhysicsConfig.WORLD_W /
   WORLD_H) that's scaled to the actual canvas size every frame, so
   physics tuning is completely independent of device resolution.
=================================================================== */

const Game = (() => {
  const STATE = {
    BOOT: 'boot',
    MENU: 'menu',
    READY: 'ready',
    RUNNING: 'running',
    PAUSED: 'paused',
    OVER: 'over'
  };

  let canvas, ctx;
  let dpr = 1;
  let scale = 1;
  let offsetX = 0, offsetY = 0;

  let state = STATE.BOOT;
  let mode = 'classic';

  let player, background, obstacles, particles;
  let score = 0;
  let runStartTime = 0;
  let elapsedMs = 0;

  let lastFrameTime = 0;
  let rafId = null;
  let timeS = 0;

  let shakeT = 0;
  let surgeSlowT = 0;

  const THEME = {
    skyTop: '#0a0807',
    skyMid: '#120d0a',
    skyHorizon: '#1c130c',
    silhouetteFar: '#1a140f',
    silhouetteNear: '#100b08',
    ground: '#150f0a',
    groundRim: '#3a2e23',
    groundLine: '#0a0705',
    emberDust: '#e8943a',
    barShadow: '#0d0a08',
    barMid: '#2a2018',
    barOutline: 'rgba(232,148,58,0.18)',
    rim: '#e8943a',
    rimSurge: '#ffd99a'
  };

  const listenersExternal = {
    onScoreChange: null,
    onStateChange: null,
    onGameOver: null
  };

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);

    background = new Background();
    particles = new ParticleSystem();
    player = new Player(Skins.getDefault());
    obstacles = new ObstacleField(mode);

    Input.onFlap(handleFlapInput);

    setState(STATE.BOOT);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const rectW = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    const rectH = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

    canvas.width = Math.floor(rectW * dpr);
    canvas.height = Math.floor(rectH * dpr);
    canvas.style.width = rectW + 'px';
    canvas.style.height = rectH + 'px';

    const scaleX = rectW / PhysicsConfig.WORLD_W;
    const scaleY = rectH / PhysicsConfig.WORLD_H;
    scale = Math.max(scaleX, scaleY);

    offsetX = (rectW - PhysicsConfig.WORLD_W * scale) / 2;
    offsetY = (rectH - PhysicsConfig.WORLD_H * scale) / 2;
  }

  function setState(next) {
    state = next;
    if (listenersExternal.onStateChange) listenersExternal.onStateChange(next);
  }

  function getState() { return state; }

  function setMode(m) {
    mode = m;
    obstacles = new ObstacleField(mode);
  }

  function setSkin(skin) {
    player.skin = skin;
  }

  function startRun() {
    score = 0;
    elapsedMs = 0;
    runStartTime = performance.now();
    player.reset();
    player.skin = Skins.getDefault();
    obstacles.reset();
    particles.clear();
    shakeT = 0;
    surgeSlowT = 0;
    setState(STATE.READY);
  }

  function beginFlight(nowMs) {
    if (state !== STATE.READY) return;
    setState(STATE.RUNNING);
    player.flap(nowMs);
    Audio_.flap();
    Util.vibrate(8);
  }

  function handleFlapInput() {
    Audio_.unlock();
    const nowMs = performance.now();

    if (state === STATE.READY) {
      beginFlight(nowMs);
      return;
    }
    if (state === STATE.RUNNING) {
      const did = player.flap(nowMs);
      if (did) {
        Audio_.flap();
        Util.vibrate(6);
      }
      return;
    }
  }

  function pause() {
    if (state !== STATE.RUNNING) return;
    setState(STATE.PAUSED);
  }

  function resume() {
    if (state !== STATE.PAUSED) return;
    lastFrameTime = performance.now();
    setState(STATE.RUNNING);
  }

  function endRun() {
    setState(STATE.OVER);
    Audio_.impact();
    Util.vibrate([0, 30, 40, 30]);
    if (Storage.getSetting('shake')) shakeT = PhysicsConfig.shake.durationMs;
    particles.burst(player.x, player.y, {
      count: 26, speed: 260, color: '#e8943a', life: 0.7
    });

    const survivalMs = performance.now() - runStartTime;
    const isBest = Storage.recordRun(mode, score, survivalMs);
    const newSkins = Skins.checkUnlocks();

    if (listenersExternal.onGameOver) {
      listenersExternal.onGameOver({ score, isBest, survivalMs, newSkins });
    }
  }

  function addScore(n) {
    score += n;
    if (listenersExternal.onScoreChange) listenersExternal.onScoreChange(score);
  }

  function checkCollisions() {
    const bounds = player.getBounds();

    const groundY = PhysicsConfig.WORLD_H - PhysicsConfig.world.groundHeight;
    if (bounds.cy + bounds.r >= groundY) {
      player.y = groundY - bounds.r;
      player.alive = false;
      endRun();
      return;
    }
    if (bounds.cy - bounds.r <= 0) {
      player.y = bounds.r;
      player.vy = 0;
    }

    for (const pair of obstacles.pairs) {
      if (pair.x > player.x + 40 || pair.x + pair.width < player.x - 40) continue;

      const hitTop = pair.topRect.h > 0 && Util.circleRectOverlap(bounds.cx, bounds.cy, bounds.r, pair.topRect);
      const hitBottom = pair.bottomRect.h > 0 && Util.circleRectOverlap(bounds.cx, bounds.cy, bounds.r, pair.bottomRect);

      if (hitTop || hitBottom) {
        player.alive = false;
        endRun();
        return;
      }

      if (!pair.passed && pair.x + pair.width < player.x) {
        pair.passed = true;
        obstacles.passCount += 1;
        if (pair.isSurgeGate) {
          addScore(PhysicsConfig.ember.surgeBonusScore);
          Audio_.pickup();
          surgeSlowT = PhysicsConfig.ember.surgeSlowDurationMs;
          particles.burst(player.x, player.y, { count: 22, speed: 200, color: '#ffd99a', life: 0.5 });
        } else {
          addScore(1);
          Audio_.score();
        }
      }

      const sparkTarget = pair.getSparkTarget();
      if (sparkTarget && Util.circleRectOverlap(bounds.cx, bounds.cy, bounds.r + sparkTarget.r,
            { x: sparkTarget.cx - sparkTarget.r, y: sparkTarget.cy - sparkTarget.r, w: sparkTarget.r * 2, h: sparkTarget.r * 2 })) {
        pair.spark.collected = true;
        addScore(PhysicsConfig.ember.sparkScoreValue);
        Audio_.pickup();
        particles.burst(sparkTarget.cx, sparkTarget.cy, { count: 10, speed: 140, color: '#ffe3b0', life: 0.4 });
      }
    }
  }

  function frame(now) {
    rafId = requestAnimationFrame(frame);

    if (!lastFrameTime) lastFrameTime = now;
    let dt = (now - lastFrameTime) / 1000;
    lastFrameTime = now;
    dt = Math.min(dt, 1 / 30);

    timeS += dt;

    let simDt = dt;
    if (surgeSlowT > 0) {
      surgeSlowT -= dt * 1000;
      simDt = dt * PhysicsConfig.ember.surgeSlowFactor;
    }

    update(simDt, dt, now);
    render();
  }

  function update(simDt, realDt, nowMs) {
    background.update(simDt, timeS);

    if (state === STATE.READY) {
      player.idleBob(timeS);
    } else if (state === STATE.RUNNING) {
      player.update(simDt, nowMs);
      obstacles.update(simDt);
      checkCollisions();
      elapsedMs += simDt * 1000;
    } else if (state === STATE.OVER) {
      player.update(simDt, nowMs);
    }

    particles.update(realDt);

    if (shakeT > 0) shakeT -= realDt * 1000;
  }

  function render() {
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

    let shakeX = 0, shakeY = 0;
    if (shakeT > 0) {
      const t = shakeT / PhysicsConfig.shake.durationMs;
      const mag = PhysicsConfig.shake.magnitude * t;
      shakeX = Util.randRange(-mag, mag);
      shakeY = Util.randRange(-mag, mag);
    }

    ctx.translate(offsetX + shakeX, offsetY + shakeY);
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.rect(0, 0, PhysicsConfig.WORLD_W, PhysicsConfig.WORLD_H);
    ctx.clip();

    background.draw(ctx, THEME);
    obstacles.draw(ctx, THEME);
    particles.draw(ctx);
    if (state !== STATE.BOOT && state !== STATE.MENU) {
      player.draw(ctx);
    }

    ctx.restore();
  }

  function start() {
    if (rafId) return;
    lastFrameTime = 0;
    rafId = requestAnimationFrame(frame);
  }

  function getScore() { return score; }
  function getMode() { return mode; }
  function getPlayer() { return player; }
  function getObstacles() { return obstacles; }

  return {
    STATE, init, start, resize,
    setState, getState, setMode, getMode, setSkin,
    startRun, beginFlight, pause, resume,
    getScore, getPlayer, getObstacles,
    listeners: listenersExternal
  };
})();
