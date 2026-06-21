/* ===================================================================
   storage.js — wraps localStorage with a versioned save schema.
   Falls back silently to an in-memory store if localStorage is
   unavailable (private browsing, embedded webviews, etc.)
=================================================================== */

const Storage = (() => {
  const KEY = 'emberflight.save.v1';

  const DEFAULTS = {
    version: 1,
    bestScore: { classic: 0, ember: 0 },
    totalRuns: 0,
    totalScore: 0,
    longestSurvivalMs: 0,
    coins: 0,
    unlockedSkins: ['ember'],
    selectedSkin: 'ember',
    settings: {
      sound: true,
      haptics: true,
      shake: true,
      reducedMotion: false
    }
  };

  let memoryFallback = null;
  let cache = null;

  function isLocalStorageAvailable() {
    try {
      const t = '__ef_test__';
      window.localStorage.setItem(t, '1');
      window.localStorage.removeItem(t);
      return true;
    } catch (e) {
      return false;
    }
  }

  const hasLS = isLocalStorageAvailable();

  function load() {
    if (cache) return cache;

    let raw = null;
    if (hasLS) {
      raw = window.localStorage.getItem(KEY);
    } else {
      raw = memoryFallback;
    }

    if (!raw) {
      cache = structuredCloneFallback(DEFAULTS);
      return cache;
    }

    try {
      const parsed = JSON.parse(raw);
      // shallow-merge with defaults so new fields appear after updates
      cache = Object.assign({}, structuredCloneFallback(DEFAULTS), parsed);
      cache.bestScore = Object.assign({}, DEFAULTS.bestScore, parsed.bestScore || {});
      cache.settings = Object.assign({}, DEFAULTS.settings, parsed.settings || {});
      cache.unlockedSkins = parsed.unlockedSkins || DEFAULTS.unlockedSkins.slice();
      return cache;
    } catch (e) {
      cache = structuredCloneFallback(DEFAULTS);
      return cache;
    }
  }

  function structuredCloneFallback(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function save() {
    if (!cache) return;
    const raw = JSON.stringify(cache);
    if (hasLS) {
      try { window.localStorage.setItem(KEY, raw); } catch (e) { /* quota etc */ }
    } else {
      memoryFallback = raw;
    }
  }

  function get() {
    return load();
  }

  function patch(partial) {
    const data = load();
    Object.assign(data, partial);
    save();
    return data;
  }

  function setBestScore(mode, score) {
    const data = load();
    if (!data.bestScore[mode] || score > data.bestScore[mode]) {
      data.bestScore[mode] = score;
      save();
      return true; // new best
    }
    return false;
  }

  function getBestScore(mode) {
    return load().bestScore[mode] || 0;
  }

  function recordRun(mode, score, survivalMs) {
    const data = load();
    data.totalRuns += 1;
    data.totalScore += score;
    if (survivalMs > data.longestSurvivalMs) data.longestSurvivalMs = survivalMs;
    const isBest = setBestScore(mode, score);
    save();
    return isBest;
  }

  function setSetting(key, value) {
    const data = load();
    data.settings[key] = value;
    save();
  }

  function getSetting(key) {
    return load().settings[key];
  }

  function unlockSkin(id) {
    const data = load();
    if (!data.unlockedSkins.includes(id)) {
      data.unlockedSkins.push(id);
      save();
    }
  }

  function isSkinUnlocked(id) {
    return load().unlockedSkins.includes(id);
  }

  function setSelectedSkin(id) {
    patch({ selectedSkin: id });
  }

  function resetAll() {
    cache = structuredCloneFallback(DEFAULTS);
    save();
  }

  return {
    get, patch, setBestScore, getBestScore, recordRun,
    setSetting, getSetting, unlockSkin, isSkinUnlocked,
    setSelectedSkin, resetAll
  };
})();
