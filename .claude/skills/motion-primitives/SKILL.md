# SKILL: Motion.dev Primitives & Performance

## Purpose
Leverage high-performance, low-level animation primitives from **motion.dev** for scroll-linked effects and gesture-driven interactions in GateFlow v9.0.

## Core Principles
1.  **Performance Budgets**: Use the lightweight `motion` library for simple transforms to keep bundle sizes small.
2.  **Scroll Awareness**: Synchronize UI states with scroll progress for immersive dashboard scrolling.
3.  **Zero-Latency Gestures**: Ensure pan, swipe, and drag gestures feel direct and immediate.

## Implementation Rules
- **Scroll Hook**: Use `useScroll` for progress-based headers or alert-badge reveals.
- **Optimized Transforms**: Animate `transform` and `opacity` only; never animate layout-triggering properties (`width`, `height`, `left`, etc.) directly unless using `layout` prop.
- **Hardware Acceleration**: Ensure `will-change: transform` is applied to heavy animated elements.

## Anti-Patterns
- Manually calculating scroll offsets with `window.addEventListener('scroll')` (use `useScroll` instead).
- Animating non-composite properties on the main thread.
- Overloading the DOM with too many `motion.div` elements simultaneously.

## Code Examples

### Scroll-Linked Header
```tsx
import { motion, useScroll, useTransform } from "framer-motion";

export const DynamicHeader = () => {
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const headerBlur = useTransform(scrollYProgress, [0, 0.1], ["0px", "8px"]);

  return (
    <motion.header
      style={{ opacity: headerOpacity, backdropFilter: `blur(${headerBlur})` }}
      className="sticky top-0 bg-neutral/80 p-200"
    >
      Dashboard Command
    </motion.header>
  );
};
```

### Gesture Pan Interaction
```tsx
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 300 }}
  onDragEnd={(e, info) => {
    if (info.offset.x > 150) archiveSms();
  }}
  className="p-150 bg-sunken rounded-small"
>
  Swipe to Archive
</motion.div>
```
