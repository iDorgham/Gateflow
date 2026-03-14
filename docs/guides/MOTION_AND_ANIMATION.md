# GateFlow — Motion & Animation Guide

Canonical reference for CSS animations, Tailwind transitions, micro-interactions, performance, and accessibility. Used by Cursor, CLIs, Antigravity, and design skills.

**Stack:** Tailwind CSS 3.4, `@gate-access/ui`, Next.js 14. Optional: Framer Motion for complex layout morphs (add as dependency if needed).

---

## 1. Principles

- **Purposeful motion** — Animations should reinforce hierarchy, feedback, or state change; avoid decoration-only motion.
- **Performance** — Prefer `transform` and `opacity`; avoid animating `width`, `height`, or `top`/`left`.
- **Accessibility** — Always respect `prefers-reduced-motion: reduce`; provide reduced or no-motion fallbacks.
- **Duration** — Keep transitions short (150–300ms) for micro-interactions; longer (300–500ms) for page transitions if needed.

---

## 2. CSS Keyframes (Tailwind)

Define keyframes in `tailwind.config.ts` or `globals.css`:

```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

Tailwind config:

```js
theme: {
  extend: {
    keyframes: {
      "fade-in": {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
      "slide-up": {
        "0%": { opacity: "0", transform: "translateY(8px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
    },
    animation: {
      "fade-in": "fade-in 0.2s ease-out",
      "slide-up": "slide-up 0.3s ease-out",
    },
  },
},
```

Use: `animate-fade-in`, `animate-slide-up`.

---

## 3. Tailwind Transitions

- **Utility:** `transition`, `transition-colors`, `transition-opacity`, `transition-transform`.
- **Duration:** `duration-150`, `duration-200`, `duration-300`.
- **Easing:** `ease-in`, `ease-out`, `ease-in-out`, `ease-linear`.
- **Example:** `transition-colors duration-200 ease-in-out` for hover states.

---

## 4. Micro-interactions

- **Button hover:** `hover:bg-primary/90`, `active:scale-[0.98]` (subtle).
- **Card hover:** `hover:shadow-md`, `hover:border-primary/50`.
- **Input focus:** `focus:ring-2 focus:ring-ring`; ensure visible focus for keyboard users.
- **Loading:** Skeleton (`animate-pulse`) or spinner; avoid flashing content.
- **Toast/notification:** Fade-in + slide-up; short duration (200–300ms).

---

## 5. Page / Panel Transitions

- **Route change:** Optional fade; avoid long waits.
- **Modal/Dialog:** Fade backdrop + scale/slide content; use `@radix-ui` or similar for accessibility.
- **Sheet/Drawer:** Slide from edge; respect RTL direction.

---

## 6. Layout Morphs (Advanced)

For complex morphs (e.g. login panel → sidebar), consider **Framer Motion**:

- **Shared layout:** `layout` + `layoutId` for elements that change shape/position.
- **Spring presets:** `{ type: "spring", stiffness: 160, damping: 24 }` for balanced; `stiffness: 220, damping: 28` for snappy.
- **Stagger:** `staggerChildren: 0.06`–`0.12` for list entrances.
- **AnimatePresence:** `mode="wait"` for exit/enter sequences.

Add `framer-motion` to `package.json` only when needed; GateFlow does not include it by default.

---

## 7. Performance

- **GPU acceleration:** `transform` and `opacity` are composited; prefer these.
- **`will-change`:** Use sparingly; `will-change: transform` only when animation is imminent.
- **Avoid:** Animating `box-shadow`, `filter`, or layout-affecting properties on large trees.
- **Reduce motion:** Skip or shorten animations when `prefers-reduced-motion: reduce`.

---

## 8. `prefers-reduced-motion` (Accessibility)

**Mandatory:** Respect user preference for reduced motion.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Or use a Tailwind variant:

```js
// tailwind.config — add plugin for reduced-motion
```

In components, avoid auto-playing long animations when reduced motion is preferred. Provide instant state change as fallback.

---

## 9. Motion Checklist (Verification)

Before shipping animated UI:

- [ ] Animations use `transform`/`opacity` where possible.
- [ ] Duration ≤ 300ms for micro-interactions.
- [ ] `prefers-reduced-motion` respected (reduced or no animation).
- [ ] Focus states visible (keyboard navigation).
- [ ] No layout shift (CLS) during animation.
- [ ] RTL: Directional animations flip correctly when `dir="rtl"`.

---

## 10. References

| Resource | Path |
|----------|------|
| Tailwind animation | [Tailwind docs — animation](https://tailwindcss.com/docs/animation) |
| gf-creative-ui-animation | `.antigravity/skills/gf-creative-ui-animation/SKILL.md` |
| UI Design Guide | `docs/guides/UI_DESIGN_GUIDE.md` |
| gf-uiux-animator (Framer Motion) | `docs/cli-context/skills/gf-uiux-animator/SKILL.md` — advanced layout morphs |

---

*Use Tailwind 3.4. Do not upgrade to Tailwind v4 without explicit approval.*
