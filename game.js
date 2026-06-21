:root {
  /* ---- Core surfaces ---- */
  --void-950: #070504;   /* deepest background */
  --void-900: #0d0a08;   /* base background */
  --void-800: #16110d;   /* elevated panels */
  --void-700: #221a14;   /* card surfaces */
  --void-600: #3a2e23;   /* borders / chrome */
  --void-500: #5a4836;   /* muted UI elements */

  /* ---- Ember (warm accent family) ---- */
  --ember-700: #8a3d1c;
  --ember-600: #c4502a;
  --ember-500: #e8943a;  /* primary accent */
  --ember-400: #f4b860;
  --ember-300: #ffd99a;
  --ember-glow: rgba(232, 148, 58, 0.45);

  /* ---- Secondary glow (rare, for highlights only) ---- */
  --coal-red: #c4502a;

  /* ---- Text ---- */
  --text-parchment: #ece2cf;
  --text-dim: #9c8a73;
  --text-faint: #5a4f42;

  /* ---- Type scale ---- */
  --font-display: 'JetBrains Mono', monospace;

  /* ---- Misc ---- */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --shadow-deep: 0 12px 40px rgba(0,0,0,0.55);

  /* viewport-safe heights */
  --vh: 1vh;
}

body {
  background: var(--void-900);
  color: var(--text-parchment);
}

.hidden { display: none !important; }
