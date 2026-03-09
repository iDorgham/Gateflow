# GateFlow Login 2026 — HTML/CSS Prototype

Pixel-perfect static prototype for the 2026 dashboard login page.

## How to view

1. Open `index.html` in a browser (double-click or `open index.html` on macOS).
2. Or serve the folder with any static server, e.g.:
   - `npx serve .`
   - `python3 -m http.server 8080`

## Contents

- **index.html** — Semantic markup: logo, headline, form (email, password, remember me, forgot link), Sign In CTA, Contact Support / System Status.
- **styles.css** — Design tokens, keyframes (see comments), responsive rules (320px → 1440px+), glass card, focus/hover states, reduced-motion support.

## Design tokens

Colors and spacing are defined in `:root` in `styles.css`. For reuse in the app, see `.superdesign/login-2026-tokens.css`.

## Keyframes (in styles.css)

- `login-entrance` — Fade-in + slide-up (300–400ms).
- `login-logo-float` — Logo float + opacity pulse (6s loop).
- `login-spinner` — Loading spinner rotation.
- `login-shimmer` — Gradient bar accent animation.
