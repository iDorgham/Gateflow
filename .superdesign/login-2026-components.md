# GateFlow Login 2026 — Component Breakdown

## 1. Page Shell (`LoginPageShell`)

- **Role:** Full-viewport layout; left (form) + right (brand/accent) or single column on mobile.
- **Contains:** Logo, headline, `LoginForm` card, footer links, optional top-right controls (language, theme).
- **Responsive:** Stack vertically on small screens; split 50/50 or 40/60 on desktop.
- **Animation:** Entrance fade-in + slide-up (see keyframes `login-entrance`).

---

## 2. LoginForm (Card)

- **Role:** Glass-morphism card wrapping the form.
- **Styles:** `backdrop-filter: blur(12px)`, subtle border, `--login-shadow-card`, padding `--login-card-padding`.
- **Contains:** Headline, subtitle, `EmailField`, `PasswordField`, `RememberMe`, `PrimaryButton`, `SecondaryLinks`.
- **Accessibility:** `role="main"` or landmark; focus trap when modal (if ever used as modal).

---

## 3. InputField (Email / Username)

- **Role:** Email or username input with icon and label.
- **Props:** `id`, `name`, `type`, `placeholder`, `autoComplete`, `required`, `aria-invalid`, `aria-describedby`.
- **Behavior:** Floating label or top-aligned label; focus: scale 1.02 + border glow `--login-focus-glow`.
- **Min height:** `--login-touch-min` (44px).
- **Validation:** Real-time feedback; error state with border/icon color.

---

## 4. PasswordField

- **Role:** Password input with show/hide toggle.
- **Same as InputField** plus:
  - Toggle button (icon: eye / eye-off) for `type="password"` ↔ `type="text"`.
  - Optional strength indicator (bar or text).
- **Accessibility:** `aria-label` on toggle; associate label with `htmlFor`.

---

## 5. RememberMe (Checkbox / Toggle)

- **Role:** Custom-styled “Remember me” control.
- **Style:** Checkbox or toggle; accent color `--login-accent` when checked.
- **Touch target:** ≥ 44px; visible focus ring.

---

## 6. PrimaryButton (“Sign In”)

- **Role:** Main CTA; submits form.
- **Desktop:** Auto width (or full width within card).
- **Mobile:** Full width.
- **States:**
  - Default: background `--login-accent` (or gradient from `--login-base` to `--login-accent`).
  - Hover: gradient shift, `translateY(-2px)`, `--login-shadow-button-hover`.
  - Focus: `--login-shadow-focus`.
  - Loading: spinner (rotation animation), disabled.
- **Transition:** `all 0.2s var(--login-ease-out)`.

---

## 7. SecondaryLinks

- **Role:** “Forgot password?”, “Contact Support”, “System Status”.
- **Style:** Subtle text links; hover underline animation.
- **Forgot password:** Primary link; others muted. Ensure 44px min height for touch.

---

## 8. Logo / Brand Mark

- **Role:** GateFlow logo at top-center of form area or shell.
- **Animation:** Subtle float + opacity pulse, 6s loop; respect `prefers-reduced-motion`.

---

## 9. Decorative Accent Bar

- **Role:** Animated gradient line using `--login-accent` as separator below headline or above form.
- **Implementation:** Thin div or pseudo-element; optional gradient animation (e.g. left-to-right shimmer).

---

## 10. Loading Spinner

- **Role:** Shown during form submission.
- **Animation:** Smooth rotation (e.g. 1s linear infinite); optional fade-in.
- **A11y:** `aria-live="polite"` region; “Signing in…” or equivalent.

---

## Keyframes Reference (see prototype CSS)

- `login-entrance` — fade-in + slide-up (300–400ms).
- `login-logo-float` — subtle float + opacity pulse (6s loop).
- `login-spinner` — 360° rotation.
- `login-shimmer` (optional) — gradient bar animation.
- Reduced motion: use `prefers-reduced-motion: reduce` to shorten or disable.
