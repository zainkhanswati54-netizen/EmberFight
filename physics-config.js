/* ================= BOOT ================= */
.screen-boot {
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at 50% 40%, var(--void-800) 0%, var(--void-950) 75%);
}
.boot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
}
.boot-mark {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, var(--ember-300), var(--ember-500) 45%, var(--ember-700) 100%);
  box-shadow: 0 0 50px 10px var(--ember-glow);
  animation: pulse-glow 1.8s ease-in-out infinite;
}
.boot-title {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--text-parchment);
}
.boot-title span { color: var(--ember-500); }
.boot-bar {
  width: 160px;
  height: 3px;
  border-radius: 2px;
  background: var(--void-700);
  overflow: hidden;
}
.boot-bar-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, var(--ember-600), var(--ember-400));
  transition: width 0.2s ease;
}
.boot-sub {
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--text-faint);
}

/* ================= MENU ================= */
.screen-menu {
  background: var(--void-900);
  padding: env(safe-area-inset-top, 0) 20px env(safe-area-inset-bottom, 0);
  justify-content: space-between;
}
.menu-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 18px;
}
.menu-best {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid var(--void-600);
  border-radius: 999px;
  background: rgba(255,255,255,0.02);
}
.menu-best-label {
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--text-faint);
  text-transform: uppercase;
}
.menu-best-value {
  font-size: 15px;
  font-weight: 700;
  color: var(--ember-400);
}

.menu-mid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-top: -20px;
}
.menu-mark {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, var(--ember-300), var(--ember-500) 45%, var(--ember-700) 100%);
  box-shadow: 0 0 40px 6px var(--ember-glow);
}
.menu-title {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--text-parchment);
  text-align: center;
}
.menu-title span { color: var(--ember-500); display: block; font-size: 0.9em; }
.menu-tag {
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--text-faint);
  text-transform: lowercase;
}

.menu-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding-bottom: 22px;
}

.mode-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mode-card {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 16px;
  background: var(--void-800);
  border: 1px solid var(--void-600);
  border-radius: var(--radius-lg);
  text-align: left;
  transition: border-color 0.15s ease, transform 0.1s ease, background 0.15s ease;
}
.mode-card:active { transform: scale(0.98); background: var(--void-700); }
.mode-card--primary { border-color: var(--ember-700); }

.mode-card-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  flex-shrink: 0;
}
.mode-icon-classic {
  background: radial-gradient(circle at 35% 30%, var(--ember-300), var(--ember-500) 50%, var(--ember-700) 100%);
  box-shadow: 0 0 18px 2px var(--ember-glow);
}
.mode-icon-ember {
  background: conic-gradient(from 200deg, var(--ember-600), var(--void-600), var(--ember-500), var(--void-600), var(--ember-600));
  position: relative;
}
.mode-icon-ember::after {
  content: '';
  position: absolute;
  inset: 9px;
  border-radius: 50%;
  background: var(--void-800);
}

.mode-card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mode-card-title {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-parchment);
}
.mode-card-sub {
  font-size: 10.5px;
  letter-spacing: 0.04em;
  color: var(--text-faint);
}
.mode-card-go {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--ember-500);
  border: 1px solid var(--ember-700);
  padding: 6px 12px;
  border-radius: 999px;
}

/* ================= SUB-SCREEN HEADER (shared: skins/settings/stats) ================= */
.sub-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(env(safe-area-inset-top, 0) + 18px) 18px 10px;
}
.sub-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--text-parchment);
}
.sub-spacer { width: 40px; }

.screen-skins, .screen-settings, .screen-stats {
  background: var(--void-900);
}

/* ================= SKINS ================= */
.skins-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 6px;
}
.skins-arrow {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dim);
  flex-shrink: 0;
}
.skins-arrow:active { color: var(--ember-400); }

.skins-preview-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
#skins-canvas {
  width: 200px;
  height: 200px;
}
.skins-name {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-parchment);
}
.skins-lock {
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: var(--text-faint);
  min-height: 14px;
}

.skins-dots {
  display: flex;
  justify-content: center;
  gap: 7px;
  padding-bottom: 18px;
}
.skins-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--void-600);
  transition: background 0.2s ease, transform 0.2s ease;
}
.skins-dot.active {
  background: var(--ember-500);
  transform: scale(1.3);
}

#skins-select {
  margin: 0 20px calc(env(safe-area-inset-bottom, 0) + 20px);
  width: calc(100% - 40px);
}

/* ================= SETTINGS ================= */
.settings-list {
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
}
.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 4px;
  border-bottom: 1px solid var(--void-700);
  font-size: 13.5px;
  letter-spacing: 0.03em;
  color: var(--text-parchment);
}

.toggle {
  width: 44px;
  height: 26px;
  border-radius: 999px;
  background: var(--void-600);
  position: relative;
  transition: background 0.2s ease;
}
.toggle[data-on="true"] { background: var(--ember-600); }
.toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--text-parchment);
  transition: transform 0.2s ease;
}
.toggle[data-on="true"] .toggle-knob {
  transform: translateX(18px);
  background: var(--ember-300);
}

/* ================= STATS ================= */
.stats-grid {
  padding: 16px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.stat-tile {
  background: var(--void-800);
  border: 1px solid var(--void-600);
  border-radius: var(--radius-md);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stat-tile-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--text-faint);
  text-transform: uppercase;
}
.stat-tile-value {
  font-size: 22px;
  font-weight: 800;
  color: var(--ember-400);
}

/* ================= READY (tap to start) ================= */
.screen-ready {
  z-index: 4;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.ready-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-top: 18vh;
}
.ready-tap-icon {
  width: 30px;
  height: 30px;
  border: 2px solid var(--ember-400);
  border-radius: 50%;
  animation: ready-pulse 1.3s ease-in-out infinite;
}
.ready-hint p {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--text-parchment);
  opacity: 0.85;
}

/* ================= PAUSE ================= */
.screen-pause {
  align-items: center;
  justify-content: center;
  background: rgba(7, 5, 4, 0.78);
  backdrop-filter: blur(3px);
}
.pause-card {
  width: calc(100% - 64px);
  max-width: 300px;
  background: var(--void-800);
  border: 1px solid var(--void-600);
  border-radius: var(--radius-lg);
  padding: 26px;
  text-align: center;
}
.pause-card h2 {
  font-size: 16px;
  letter-spacing: 0.2em;
  margin-bottom: 20px;
  color: var(--text-parchment);
}

/* ================= GAME OVER ================= */
.screen-over {
  align-items: center;
  justify-content: center;
  background: rgba(7, 5, 4, 0.85);
  backdrop-filter: blur(2px);
}
.over-card {
  width: calc(100% - 56px);
  max-width: 320px;
  background: var(--void-800);
  border: 1px solid var(--void-600);
  border-radius: var(--radius-lg);
  padding: 26px 24px;
  text-align: center;
  box-shadow: var(--shadow-deep);
}
.over-eyebrow {
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--text-faint);
  margin-bottom: 14px;
}
.over-score-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 18px;
}
.over-score-label {
  font-size: 10px;
  letter-spacing: 0.16em;
  color: var(--text-faint);
}
.over-score-value {
  font-size: 48px;
  font-weight: 800;
  color: var(--text-parchment);
  line-height: 1.1;
}
.over-stats-row {
  display: flex;
  justify-content: center;
  gap: 28px;
  padding-bottom: 6px;
}
.over-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.over-stat-label {
  font-size: 9.5px;
  letter-spacing: 0.12em;
  color: var(--text-faint);
}
.over-stat-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--ember-400);
}
.over-new-best {
  margin-top: 12px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: var(--ember-400);
}
.over-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
}
.over-retry-btn { flex: 1; }
.over-icon-btn { flex-shrink: 0; }
