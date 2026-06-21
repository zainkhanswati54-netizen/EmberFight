/* ===================================================================
   audio.js — tiny procedural sound engine using the WebAudio API.
   No external sound files: every effect is synthesized on the fly,
   which keeps the repo dependency-free and the sounds thematically
   consistent (warm, low, "ember crackle" feel rather than bleepy
   arcade tones).
=================================================================== */

const Audio_ = (() => {
  let ctx = null;
  let masterGain = null;
  let enabled = true;
  let unlocked = false;

  function ensureContext() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.55;
    masterGain.connect(ctx.destination);
    return ctx;
  }

  function unlock() {
    if (unlocked) return;
    const c = ensureContext();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    unlocked = true;
  }

  function setEnabled(v) {
    enabled = v;
  }

  function now() {
    return ctx ? ctx.currentTime : 0;
  }

  // a soft "flap" — short filtered noise burst + low sine thump
  function flap() {
    if (!enabled) return;
    const c = ensureContext();
    if (!c) return;
    const t = now();

    // thump
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.35, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    osc.connect(g).connect(masterGain);
    osc.start(t);
    osc.stop(t + 0.16);

    // air whoosh (filtered noise)
    const bufferSize = c.sampleRate * 0.15;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const noise = c.createBufferSource();
    noise.buffer = buffer;
    const filt = c.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 900;
    filt.Q.value = 0.6;
    const ng = c.createGain();
    ng.gain.value = 0.18;
    noise.connect(filt).connect(ng).connect(masterGain);
    noise.start(t);
  }

  // score tick — small bright blip
  function score() {
    if (!enabled) return;
    const c = ensureContext();
    if (!c) return;
    const t = now();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(740, t + 0.08);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.25, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.connect(g).connect(masterGain);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // collision/death — low thud + noise crash
  function impact() {
    if (!enabled) return;
    const c = ensureContext();
    if (!c) return;
    const t = now();

    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.4);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    osc.connect(g).connect(masterGain);
    osc.start(t);
    osc.stop(t + 0.55);

    const bufferSize = c.sampleRate * 0.3;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const noise = c.createBufferSource();
    noise.buffer = buffer;
    const filt = c.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 600;
    const ng = c.createGain();
    ng.gain.value = 0.3;
    noise.connect(filt).connect(ng).connect(masterGain);
    noise.start(t);
  }

  // soft UI tap
  function ui() {
    if (!enabled) return;
    const c = ensureContext();
    if (!c) return;
    const t = now();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    osc.connect(g).connect(masterGain);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // gate / surge pickup (ember mode)
  function pickup() {
    if (!enabled) return;
    const c = ensureContext();
    if (!c) return;
    const t = now();
    [0, 0.06].forEach((delay, i) => {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620 + i * 180, t + delay);
      g.gain.setValueAtTime(0.0001, t + delay);
      g.gain.exponentialRampToValueAtTime(0.22, t + delay + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.16);
      osc.connect(g).connect(masterGain);
      osc.start(t + delay);
      osc.stop(t + delay + 0.18);
    });
  }

  return { unlock, setEnabled, flap, score, impact, ui, pickup };
})();
