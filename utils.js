/* ===================================================================
   screens.js — DOM screen management. Pure UI glue: shows/hides the
   right <section>, reads/writes Storage, and calls into Game for
   state transitions. No physics or rendering logic lives here.
=================================================================== */

const Screens = (() => {
  const els = {};
  let skinIndex = 0;
  let skinsCtx = null;
  let skinsRafId = null;
  let skinsT = 0;

  function cacheEls() {
    [
      'screen-boot', 'screen-menu', 'screen-skins', 'screen-settings',
      'screen-stats', 'screen-ready', 'screen-pause', 'screen-over',
      'hud', 'hud-score', 'hud-best', 'hud-pause',
      'boot-bar-fill',
      'menu-best-value', 'btn-settings', 'btn-stats', 'btn-skins',
      'skins-canvas', 'skins-name', 'skins-lock', 'skins-dots',
      'skins-prev', 'skins-next', 'skins-back', 'skins-select',
      'settings-back', 'toggle-sound', 'toggle-haptics', 'toggle-shake',
      'toggle-reduced', 'btn-reset-data',
      'stats-back', 'stats-grid',
      'pause-resume', 'pause-restart', 'pause-menu',
      'over-eyebrow', 'over-score-value', 'over-best-value', 'over-runs-value',
      'over-new-best', 'over-menu', 'over-retry', 'over-share'
    ].forEach(id => { els[id] = document.getElementById(id); });
  }

  function showOnly(id) {
    ['screen-boot', 'screen-menu', 'screen-skins', 'screen-settings', 'screen-stats']
      .forEach(s => els[s].classList.toggle('hidden', s !== id));
  }

  function init() {
    cacheEls();
    bindEvents();
    runBootSequence();
  }

  function runBootSequence() {
    showOnly('screen-boot');
    let p = 0;
    const tick = () => {
      p += Util.randRange(8, 22);
      els['boot-bar-fill'].style.width = Math.min(p, 100) + '%';
      if (p < 100) {
        setTimeout(tick, 90);
      } else {
        setTimeout(goToMenu, 200);
      }
    };
    tick();
  }

  function goToMenu() {
    showOnly('screen-menu');
    els['hud'].classList.add('hidden');
    els['screen-ready'].classList.add('hidden');
    refreshMenuStats();
    Game.setState(Game.STATE.MENU);
  }

  function refreshMenuStats() {
    const best = Math.max(
      Storage.getBestScore('classic'),
      Storage.getBestScore('ember')
    );
    els['menu-best-value'].textContent = best;
  }

  function startMode(mode) {
    Audio_.unlock();
    Audio_.ui();
    Game.setMode(mode);
    document.querySelectorAll('.screen').forEach(s => {
      if (['screen-boot','screen-menu','screen-skins','screen-settings','screen-stats'].includes(s.id)) {
        s.classList.add('hidden');
      }
    });
    els['hud'].classList.remove('hidden');
    els['screen-ready'].classList.remove('hidden');
    els['hud-best'].textContent = 'BEST ' + Storage.getBestScore(mode);
    els['hud-score'].textContent = '0';
    Game.startRun();
  }

  function onScoreChange(score) {
    els['hud-score'].textContent = score;
  }

  function onStateChange(state) {
    if (state === Game.STATE.RUNNING) {
      els['screen-ready'].classList.add('hidden');
      els['screen-pause'].classList.add('hidden');
    }
    if (state === Game.STATE.PAUSED) {
      els['screen-pause'].classList.remove('hidden');
    }
  }

  function onGameOver({ score, isBest, survivalMs, newSkins }) {
    els['hud'].classList.add('hidden');
    els['over-eyebrow'].textContent = Game.getMode() === 'ember' ? 'EMBER RUN ENDED' : 'CLASSIC RUN ENDED';
    els['over-score-value'].textContent = score;
    els['over-best-value'].textContent = Storage.getBestScore(Game.getMode());
    els['over-runs-value'].textContent = Storage.get().totalRuns;
    els['over-new-best'].classList.toggle('hidden', !isBest);
    els['screen-over'].classList.remove('hidden');

    if (newSkins && newSkins.length) {
      setTimeout(() => {
        els['over-eyebrow'].textContent = 'NEW MARK UNLOCKED — ' + newSkins[0].name;
      }, 600);
    }
  }

  function retryRun() {
    Audio_.ui();
    els['screen-over'].classList.add('hidden');
    els['hud'].classList.remove('hidden');
    els['screen-ready'].classList.remove('hidden');
    els['hud-best'].textContent = 'BEST ' + Storage.getBestScore(Game.getMode());
    els['hud-score'].textContent = '0';
    Game.startRun();
  }

  function backToMenuFromOver() {
    Audio_.ui();
    els['screen-over'].classList.add('hidden');
    goToMenu();
  }

  function shareScore() {
    const text = `I scored ${document.getElementById('over-score-value').textContent} in EMBERFLIGHT`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
      flashShareCopied();
    }
  }

  function flashShareCopied() {
    const btn = els['over-share'];
    const orig = btn.style.color;
    btn.style.color = 'var(--ember-400)';
    setTimeout(() => { btn.style.color = orig; }, 600);
  }

  function togglePause() {
    if (Game.getState() === Game.STATE.RUNNING) {
      Audio_.ui();
      Game.pause();
    }
  }

  function resumeFromPause() {
    Audio_.ui();
    els['screen-pause'].classList.add('hidden');
    Game.resume();
  }

  function restartFromPause() {
    Audio_.ui();
    els['screen-pause'].classList.add('hidden');
    retryRun();
  }

  function menuFromPause() {
    Audio_.ui();
    els['screen-pause'].classList.add('hidden');
    els['hud'].classList.add('hidden');
    goToMenu();
  }

  function openSkins() {
    Audio_.ui();
    const skins = Skins.getAll();
    const currentId = Storage.get().selectedSkin;
    skinIndex = Math.max(0, skins.findIndex(s => s.id === currentId));
    showOnly('screen-skins');
    buildSkinDots();
    renderSkinPreview();
    startSkinPreviewLoop();
  }

  function closeSkins() {
    stopSkinPreviewLoop();
    goToMenu();
  }

  function buildSkinDots() {
    const skins = Skins.getAll();
    els['skins-dots'].innerHTML = '';
    skins.forEach((s, i) => {
      const dot = document.createElement('span');
      dot.className = 'skins-dot' + (i === skinIndex ? ' active' : '');
      els['skins-dots'].appendChild(dot);
    });
  }

  function renderSkinPreview() {
    const skins = Skins.getAll();
    const skin = skins[skinIndex];
    const unlocked = Skins.isUnlocked(skin.id);

    els['skins-name'].textContent = skin.name;
    els['skins-lock'].textContent = unlocked ? '' : ('locked — ' + skin.unlockHint);
    els['skins-select'].textContent = unlocked
      ? (Storage.get().selectedSkin === skin.id ? 'SELECTED' : 'SELECT')
      : 'LOCKED';
    els['skins-select'].style.opacity = unlocked ? '1' : '0.45';

    [...els['skins-dots'].children].forEach((d, i) => d.classList.toggle('active', i === skinIndex));
  }

  function startSkinPreviewLoop() {
    if (!skinsCtx) skinsCtx = els['skins-canvas'].getContext('2d');
    const canvasEl = els['skins-canvas'];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasEl.width = 240 * dpr;
    canvasEl.height = 240 * dpr;
    skinsCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const previewPlayer = new Player(Skins.getAll()[skinIndex]);
    previewPlayer.x = 120;
    previewPlayer.y = 120;

    function loop() {
      skinsRafId = requestAnimationFrame(loop);
      skinsT += 0.016;
      previewPlayer.skin = Skins.getAll()[skinIndex];
      previewPlayer.y = 120 + Math.sin(skinsT * 2) * 12;
      previewPlayer.rotation = Math.sin(skinsT * 2) * 8;
      previewPlayer.vy = Math.cos(skinsT * 2) * 100;

      skinsCtx.clearRect(0, 0, 240, 240);
      previewPlayer.draw(skinsCtx);
    }
    loop();
  }

  function stopSkinPreviewLoop() {
    if (skinsRafId) cancelAnimationFrame(skinsRafId);
    skinsRafId = null;
  }

  function skinPrev() {
    Audio_.ui();
    const skins = Skins.getAll();
    skinIndex = (skinIndex - 1 + skins.length) % skins.length;
    renderSkinPreview();
  }

  function skinNext() {
    Audio_.ui();
    const skins = Skins.getAll();
    skinIndex = (skinIndex + 1) % skins.length;
    renderSkinPreview();
  }

  function skinSelect() {
    const skins = Skins.getAll();
    const skin = skins[skinIndex];
    if (!Skins.isUnlocked(skin.id)) {
      Audio_.ui();
      return;
    }
    Audio_.ui();
    Storage.setSelectedSkin(skin.id);
    renderSkinPreview();
  }

  function openSettings() {
    Audio_.ui();
    const s = Storage.get().settings;
    els['toggle-sound'].dataset.on = String(s.sound);
    els['toggle-haptics'].dataset.on = String(s.haptics);
    els['toggle-shake'].dataset.on = String(s.shake);
    els['toggle-reduced'].dataset.on = String(s.reducedMotion);
    showOnly('screen-settings');
  }

  function closeSettings() { goToMenu(); }

  function bindToggle(el, key, onChange) {
    el.addEventListener('click', () => {
      const next = el.dataset.on !== 'true';
      el.dataset.on = String(next);
      Storage.setSetting(key, next);
      if (onChange) onChange(next);
      Audio_.ui();
    });
  }

  function resetProgress() {
    const ok = window.confirm('Reset all progress? This clears your best scores and unlocked marks.');
    if (!ok) return;
    Storage.resetAll();
    refreshMenuStats();
    Audio_.ui();
  }

  function openStats() {
    Audio_.ui();
    const data = Storage.get();
    const avg = data.totalRuns > 0 ? Math.round(data.totalScore / data.totalRuns) : 0;
    const tiles = [
      { label: 'Classic best', value: data.bestScore.classic || 0 },
      { label: 'Ember best', value: data.bestScore.ember || 0 },
      { label: 'Total runs', value: data.totalRuns },
      { label: 'Avg score', value: avg },
      { label: 'Longest run', value: Math.round((data.longestSurvivalMs || 0) / 1000) + 's' },
      { label: 'Marks unlocked', value: data.unlockedSkins.length + ' / ' + Skins.getAll().length }
    ];
    els['stats-grid'].innerHTML = tiles.map(t => `
      <div class="stat-tile">
        <span class="stat-tile-label">${t.label}</span>
        <span class="stat-tile-value">${t.value}</span>
      </div>
    `).join('');
    showOnly('screen-stats');
  }

  function closeStats() { goToMenu(); }

  function bindEvents() {
    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => startMode(card.dataset.mode));
    });

    els['btn-settings'].addEventListener('click', openSettings);
    els['settings-back'].addEventListener('click', closeSettings);
    els['btn-stats'].addEventListener('click', openStats);
    els['stats-back'].addEventListener('click', closeStats);
    els['btn-skins'].addEventListener('click', openSkins);
    els['skins-back'].addEventListener('click', closeSkins);
    els['skins-prev'].addEventListener('click', skinPrev);
    els['skins-next'].addEventListener('click', skinNext);
    els['skins-select'].addEventListener('click', skinSelect);

    bindToggle(els['toggle-sound'], 'sound', (v) => Audio_.setEnabled(v));
    bindToggle(els['toggle-haptics'], 'haptics');
    bindToggle(els['toggle-shake'], 'shake');
    bindToggle(els['toggle-reduced'], 'reducedMotion');
    els['btn-reset-data'].addEventListener('click', resetProgress);

    els['hud-pause'].addEventListener('click', togglePause);
    els['pause-resume'].addEventListener('click', resumeFromPause);
    els['pause-restart'].addEventListener('click', restartFromPause);
    els['pause-menu'].addEventListener('click', menuFromPause);

    els['over-retry'].addEventListener('click', retryRun);
    els['over-menu'].addEventListener('click', backToMenuFromOver);
    els['over-share'].addEventListener('click', shareScore);

    Game.listeners.onScoreChange = onScoreChange;
    Game.listeners.onStateChange = onStateChange;
    Game.listeners.onGameOver = onGameOver;
  }

  return { init };
})();
