---
name: gf-creative-ui-animation
description: CSS/Tailwind animations, micro-interactions, motion design, prefers-reduced-motion, performance. Use when adding or refining animations, transitions, or advanced UI motion.
---

# gf-creative-ui-animation

Motion and animation reference for GateFlow. Load this skill when adding animations, micro-interactions, or advanced UI motion.

## Canonical doc

**Primary reference:** `docs/guides/MOTION_AND_ANIMATION.md`

Read that file for:
- CSS keyframes (Tailwind)
- Tailwind transitions (duration, easing)
- Micro-interactions (hover, focus, loading)
- Page/panel transitions
- Layout morphs (Framer Motion optional)
- Performance (transform/opacity, will-change)
- prefers-reduced-motion (accessibility, mandatory)
- Motion verification checklist

## When to use

- User asks for animations, transitions, or motion design
- Task involves micro-interactions, loading states, or page transitions
- Before shipping animated UI — verify motion checklist and reduced-motion fallback

## Stack

- Tailwind CSS 3.4 (transitions, keyframes)
- Optional: Framer Motion for complex layout morphs (add as dependency if needed)

## Accessibility

- **Mandatory:** Respect `prefers-reduced-motion: reduce`; provide instant state change as fallback
- Use `transform` and `opacity` only where possible (GPU-friendly)
- Duration ≤ 300ms for micro-interactions

## Related skills

- **gf-design-guide** — Layout and token context
- **ui-ux** — General UI/UX patterns
- **tailwind** — Tailwind animation utilities
