---
name: svg-animation
description: Specialized workflows and patterns for svg-animation.
---

# SKILL: SVG Animation & Vector Motion

## Purpose

Standardize the animation of vector assets, icons, and diagrams to provide high-fidelity visual feedback in the GateFlow v9.0 UI.

## Core Principles

1.  **Semantic Strokes**: Animate strokes to reveal paths (drawing effect).
2.  **Contextual Motion**: Icons shouldn't just "move"; they should morph or reveal based on their function (e.g., a lock icon closing).
3.  **Performance**: Prioritize CSS animations for simple SVG loops and JS for path-length morphing.

## Implementation Rules

- **Stroke Drawing**: Use `stroke-dasharray` and `stroke-dashoffset` for reveal animations.
- **Icon Morphs**: Animate `d` (path data) using Framer Motion's SVG path support for seamless icon transitions.
- **Viewport Optimization**: Ensure SVGs have fixed `viewBox` but responsive `width/height`.

## Anti-Patterns

- Using large GIF/Lottie files when simple SVG animations are more efficient.
- Jagged path transitions due to mismatched path point counts in morphs.
- Over-animating purely decorative icons (adds cognitive load).

## Code Examples

### SVG Path Drawing (Framer Motion)

```tsx
import { motion } from 'framer-motion';

export const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="w-24 h-24 stroke-success">
    <motion.path
      d="M5 13l4 4L19 7"
      fill="transparent"
      strokeWidth="2"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    />
  </svg>
);
```

### CSS Infinite Dash Loop

```css
@keyframes dash-loop {
  to {
    stroke-dashoffset: -20;
  }
}

.anim-stroke-path {
  stroke-dasharray: 5, 5;
  animation: dash-loop 1s linear infinite;
}
```
