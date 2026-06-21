/* ===================================================================
   utils.js — small shared helpers used across the game modules.
   No dependencies. Attaches everything to a single global `Util`
   namespace so we don't pollute window with dozens of names.
=================================================================== */

const Util = (() => {

  function clamp(v, min, max) {
    return v < min ? min : (v > max ? max : v);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // exponential smoothing toward target, framerate independent
  function damp(current, target, lambda, dt) {
    return lerp(current, target, 1 - Math.exp(-lambda * dt));
  }

  function randRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function randInt(min, max) {
    return Math.floor(randRange(min, max + 1));
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
  }

  // circle vs axis-aligned rect collision (used for the orb vs bar obstacles)
  function circleRectOverlap(cx, cy, radius, rect) {
    const nearestX = clamp(cx, rect.x, rect.x + rect.w);
    const nearestY = clamp(cy, rect.y, rect.y + rect.h);
    const dx = cx - nearestX;
    const dy = cy - nearestY;
    return (dx * dx + dy * dy) < (radius * radius);
  }

  function formatNumber(n) {
    return n.toString();
  }

  // simple seeded PRNG (mulberry32) — used so daily/seeded runs are reproducible
  function mulberry32(seed) {
    let a = seed;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function once(fn) {
    let called = false, result;
    return (...args) => {
      if (!called) { called = true; result = fn(...args); }
      return result;
    };
  }

  function vibrate(pattern) {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) { /* ignore */ }
    }
  }

  return {
    clamp, lerp, damp, randRange, randInt,
    rectsOverlap, circleRectOverlap, formatNumber,
    mulberry32, once, vibrate
  };
})();
