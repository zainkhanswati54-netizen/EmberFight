# Ember Flight

A dark, minimal gravity-flight game. Tap to rise, let go to fall.

Same core physics idea as classic tap-to-fly games — gravity, a flap impulse,
gaps to thread — rebuilt with a moody, monochrome-warm visual identity
(near-black backgrounds, ember/amber glow, silhouette skylines) instead of
a bright cartoon look.

No build step. No frameworks. No dependencies. Pure HTML/CSS/JS, runs
straight from static files.

## Play it locally

Just open `index.html` in a browser, or serve the folder so the manifest
and relative paths resolve cleanly:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy to GitHub Pages (already wired up)

This repo ships with a GitHub Actions workflow at
`.github/workflows/deploy.yml` that publishes the site to GitHub Pages
automatically on every push to `main`.

To turn it on after pushing this repo to GitHub:

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).
4. Your game will be live at `https://<your-username>.github.io/<repo-name>/`.

A second workflow, `.github/workflows/ci.yml`, syntax-checks every JS file
on every push and pull request so a broken commit never silently reaches
Pages.

## How it's organized

```
index.html              All screens (boot, menu, skins, settings, stats,
                         HUD, pause, game over) as plain DOM markup.
css/
  reset.css              Browser reset
  theme.css               Color tokens — the whole palette lives here
  layout.css               Shared structural/button styles
  screens.css                Per-screen layout
  hud.css                     In-run HUD
  animations.css               Keyframes, reduced-motion handling
js/
  utils.js                Math/random/collision helpers
  storage.js               Versioned localStorage save layer
  audio.js                  Procedurally synthesized SFX (no audio files)
  input.js                   Unified pointer/touch/keyboard -> "flap" events
  skins.js                    Selectable player marks + unlock conditions
  particles.js                  Burst particle system (death/pickup FX)
  player.js                      The orb: physics + rendering
  obstacles.js                    Bar obstacles + Ember-mode collectibles
  background.js                    Parallax silhouette layers + ground
  physics-config.js                 Every tunable physics constant
  game.js                            Core loop, state machine, collisions
  screens.js                          DOM screen wiring
  main.js                              Boot sequence
assets/icons/favicon.svg   App icon
manifest.json              PWA manifest (installable, standalone)
```

## Physics notes

- Gravity and velocity are integrated with **real delta-time**, not fixed
  per-frame increments — the game feels identical at 30/60/90/120fps.
- A flap **sets** vertical velocity to a fixed value rather than adding to
  it, which is what gives tap controls a crisp, predictable pop instead of
  feeling mushy or stackable.
- Fall speed is capped at a tunable terminal velocity.
- Visual rotation and squash/stretch are *derived* from velocity every
  frame rather than separately animated, so they can never desync from
  the actual motion.
- All tuning constants live in one file: `js/physics-config.js`.

## Modes

- **Classic** — pure score run, closest to the original formula.
- **Ember Run** — adds collectible sparks and rare "surge gates" that grant
  bonus score and a brief time-dilation moment.

## License

MIT — see `LICENSE`.
