*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  overscroll-behavior: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: none;
}

body {
  font-family: 'JetBrains Mono', ui-monospace, 'SF Mono', Consolas, monospace;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
}

button {
  font-family: inherit;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
}

ul, ol { list-style: none; }
a { color: inherit; text-decoration: none; }
svg { display: block; }
canvas { display: block; }

button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--ember-500, #e8943a);
  outline-offset: 3px;
}
