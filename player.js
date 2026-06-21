/* ===================================================================
   physics-config.js — every tunable physics constant lives here so
   the feel of the game can be tuned in one place without hunting
   through game logic.

   Units: pixels are in a fixed virtual coordinate space (see Game),
   velocities are px/second, accelerations are px/second^2. We run
   real delta-time integration (not fixed per-frame increments) so
   the game feels identical at 30fps, 60fps, 90fps and 120fps.
=================================================================== */

const PhysicsConfig = {
  // virtual world size — the canvas is scaled to fit this regardless
  // of actual device resolution, so physics tuning never depends on
  // screen size.
  WORLD_W: 400,
  WORLD_H: 711, // ~9:16

  player: {
    radius: 13,
    startX: 120,

    // gravity is applied continuously; this is acceleration, not a
    // per-frame velocity add, so timing is frame-rate independent
    gravity: 1500,           // px/s^2

    // terminal velocity — caps fall speed so it never feels
    // "uncontrollable", classic-arcade-flappy style but smoother
    maxFallSpeed: 620,        // px/s
    maxRiseSpeed: -560,       // px/s (negative = up)

    // flap is an instantaneous velocity SET (not additive), which
    // is what makes Flappy-style controls feel crisp instead of
    // mushy — every tap gives a consistent, predictable pop
    flapVelocity: -420,       // px/s

    // a tiny grace window after a flap during which a second tap
    // is ignored — prevents accidental double-taps from feeling
    // broken, without adding any input lag you can perceive
    flapDebounceMs: 60,

    // rotation: visual tilt is derived from vertical velocity, not
    // an independent simulation, so it can never desync from motion
    rotationMaxUp: -28,       // degrees, nose-up when rising
    rotationMaxDown: 78,      // degrees, nose-down when diving
    rotationSmoothing: 14,    // higher = snappier tilt response

    // squash/stretch tied to velocity magnitude for extra juice
    squashAmount: 0.16,

    // how far from world edges the orb can legally sit before it
    // counts as out-of-bounds (ceiling bonk / floor death)
    ceilingY: 0,
    floorMargin: 90 // matches ground height in background.js
  },

  obstacles: {
    width: 56,
    gapHeight: 168,            // classic mode base gap
    gapHeightEmber: 178,       // ember mode slightly more forgiving (more hazards)
    minGapCenterMargin: 90,    // keep gap center away from extreme top/bottom
    speed: 165,                // px/s leftward scroll, classic
    speedEmber: 158,
    spawnIntervalPx: 230,      // horizontal distance between obstacle pairs

    // difficulty ramp: every N obstacles passed, speed and gap
    // tighten slightly, capped so it never becomes unfair
    rampEveryNPasses: 5,
    rampSpeedStep: 6,
    rampSpeedCap: 320,
    rampGapStep: -4,
    rampGapCap: 122
  },

  ember: {
    sparkChance: 0.6,         // chance an obstacle gap also spawns a collectible spark
    sparkScoreValue: 1,
    surgeChance: 0.12,        // chance an obstacle pair is replaced by a "surge gate" bonus
    surgeBonusScore: 5,
    surgeSlowFactor: 0.55,    // brief time-dilation feel when passing a surge gate
    surgeSlowDurationMs: 420
  },

  world: {
    parallaxFarSpeed: 18,
    parallaxNearSpeed: 46,
    groundHeight: 90,
    groundScrollSpeed: 165
  },

  // screen shake on death
  shake: {
    durationMs: 280,
    magnitude: 9
  }
};
