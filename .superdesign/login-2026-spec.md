# GateFlow Dashboard Login 2026 — Design Specification

**Product:** GateFlow Resident Management System (Real Estate / Property Management)  
**Page:** Authentication / Login  
**Target users:** Property managers, administrators, staff accessing the dashboard.

---

## 1. Color Palette (STRICT)

| Role | Hex | Usage |
|------|-----|--------|
| **Primary accent** | `#EB4A00` | CTAs, active states, highlights, focus rings, gradient accent |
| **Primary base** | `#020E73` | Header, sidebar, primary text, button hover gradient start |
| **Neutral background** | `#E6E6E6` | Cards, dividers, secondary backgrounds |
| **Surface** | `#FFFFFF` | Card surfaces, form backgrounds |
| **Text on primary** | `#FFFFFF` | Text on orange/navy buttons and accents |
| **Text on light** | `#020E73` | Primary text on white/light gray |
| **Muted text** | `#020E73` at ~60% opacity | Labels, hints, secondary copy |

**WCAG:** Ensure contrast ratios ≥ 4.5:1 (AA) for body text, ≥ 3:1 for large text; prefer AAA where possible.

---

## 2. Animation & Interaction Specs

- **Page entrance:** Fade-in + subtle slide-up, 300–400ms ease-out.
- **Input focus:** Scale 1.02, border glow with `#EB4A00` at 20% opacity.
- **Button hover:**
  - Background: gradient from `#020E73` → `#EB4A00`.
  - Transform: `translateY(-2px)` + elevated box-shadow.
  - Transition: `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`.
- **Logo / brand mark:** Subtle floating animation, 6s loop, opacity pulse.
- **Form submit:** Loading spinner (smooth rotation) + disabled state transition.
- **Reduced motion:** Respect `@media (prefers-reduced-motion: reduce)` — disable or simplify animations.

---

## 3. Layout & UX (2026 Standards)

- **Layout:** Clean, minimal, card-based; content centered in viewport.
- **Responsive:** Mobile-first; fluid breakpoints 320px → 768px → 1024px → 1440px+.
- **Hierarchy:** Logo → Headline → Form → Actions → Footer links.
- **Micro-interactions:** Real-time validation feedback; password visibility toggle.
- **Dark mode ready:** CSS variables for all colors to allow future theme expansion.
- **Loading:** Skeleton screens for perceived performance where applicable.

---

## 4. Form Elements

- **Email/Username:** Icon + floating label (or top-aligned label), clear focus state.
- **Password:** Show/hide toggle; optional strength indicator.
- **Remember me:** Custom-styled checkbox/toggle.
- **Forgot password:** Link with hover underline animation.
- **Primary CTA:** “Sign In” — full-width on mobile, auto-width on desktop.
- **Secondary:** “Contact Support”, “System Status” as subtle text links.

---

## 5. Visual Enhancements

- **Background:** Subtle abstract geometric mesh in `#020E73` at 5% opacity.
- **Card:** Glass-morphism — `backdrop-filter: blur(12px)` + subtle border.
- **Accent:** Animated gradient line/bar using `#EB4A00` as visual separator.
- **Logo:** Top-center with safe spacing (e.g. 24–32px).

---

## 6. Accessibility & Performance

- **Touch targets:** Minimum 44×44px for all interactive elements.
- **Focus:** Visible, high-contrast ring using `#EB4A00`.
- **Reduced motion:** Honor `prefers-reduced-motion`.
- **Lighthouse targets:** Performance ≥95, Accessibility ≥100.
- **CLS:** Zero layout shift (CLS < 0.1); reserve space for async content.

---

## 7. Deliverables Checklist

- [x] Design spec (this document)
- [x] CSS variables / design token file (`.superdesign/login-2026-tokens.css`)
- [x] Component breakdown (`.superdesign/login-2026-components.md`)
- [x] HTML/CSS prototype (`.superdesign/login-2026-prototype/`)
- [x] Animation keyframes documented in prototype `styles.css` comments
- [x] SuperDesign canvas preview:
  - **Preview URL (stakeholder review):** https://p.superdesign.dev/draft/f3ed8258-c242-4fbf-8a17-097474bc3670
  - **Project (edit drafts):** https://app.superdesign.dev/teams/8c0f45e5-6bb8-4b4e-bead-3c3de7fa03db/projects/1ebd4c46-3f10-4f16-b3ac-ca000f5a4ca3
  - Draft ID: `f3ed8258-c242-4fbf-8a17-097474bc3670`
