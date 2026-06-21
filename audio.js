@keyframes pulse-glow {
  0%, 100% { transform: scale(1); box-shadow: 0 0 50px 10px var(--ember-glow); }
  50% { transform: scale(1.08); box-shadow: 0 0 64px 16px var(--ember-glow); }
}

@keyframes ready-pulse {
  0% { transform: scale(0.85); opacity: 0.4; }
  50% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(0.85); opacity: 0.4; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.screen:not(.hidden) {
  animation: fade-in 0.18s ease;
}

@keyframes shake-flash {
  0% { background: rgba(196, 80, 42, 0.0); }
  15% { background: rgba(196, 80, 42, 0.25); }
  100% { background: rgba(196, 80, 42, 0.0); }
}

@media (prefers-reduced-motion: reduce) {
  .boot-mark, .ready-tap-icon { animation: none !important; }
  .screen:not(.hidden) { animation: none !important; }
}
