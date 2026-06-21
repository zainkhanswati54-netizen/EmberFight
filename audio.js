.app {
  position: fixed;
  inset: 0;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  max-width: 560px;
  margin: 0 auto;
  background: var(--void-900);
  overflow: hidden;
  box-shadow: var(--shadow-deep);
}

.game-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.screen {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
}

/* icon button base, reused across screens */
.icon-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--text-dim);
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--void-600);
  transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
}
.icon-btn:active {
  transform: scale(0.92);
  background: rgba(232,148,58,0.12);
  color: var(--ember-400);
}

.primary-btn {
  display: block;
  width: 100%;
  padding: 16px;
  text-align: center;
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.12em;
  color: var(--void-950);
  background: linear-gradient(180deg, var(--ember-400), var(--ember-600));
  border-radius: var(--radius-md);
  box-shadow: 0 6px 0 var(--ember-700), 0 10px 24px rgba(232,148,58,0.25);
  transition: transform 0.08s ease, box-shadow 0.08s ease;
}
.primary-btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 var(--ember-700), 0 4px 14px rgba(232,148,58,0.2);
}

.ghost-btn {
  display: block;
  width: 100%;
  padding: 14px;
  text-align: center;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  background: transparent;
  border: 1px solid var(--void-600);
  border-radius: var(--radius-md);
  margin-top: 10px;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.ghost-btn:active {
  border-color: var(--ember-500);
  color: var(--ember-400);
}

.text-link {
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--text-dim);
  padding: 8px;
}
.text-link:active { color: var(--ember-400); }

.danger-link {
  margin-top: 28px;
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--ember-700);
  text-align: center;
  padding: 10px;
}
