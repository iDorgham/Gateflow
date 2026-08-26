---
name: framer-motion
description: Specialized workflows and patterns for framer-motion.
---

# SKILL: Framer Motion Layout & Transitions

## Purpose

Enforce premium, purposeful layout transitions and shared element animations using Framer Motion for the GateFlow v9.0 "Command" redesign.

## Core Principles

1.  **Layout Persistence**: Use `layout` and `layoutId` to morph components (e.g., small card → large modal) without jitter.
2.  **Graceful Entry/Exit**: Every dynamic component must use `AnimatePresence`.
3.  **Physics Over Easing**: Prioritize spring physics for a more natural, responsive feel.

## Implementation Rules

- **Standard Springs**:
  - `Smooth`: `stiffness: 100, damping: 20` (Default).
  - `Snappy`: `stiffness: 300, damping: 30` (Buttons, small UI shifts).
- **Layout Morphing**: Match `layoutId` across source and destination components.
- **Dynamic Mounting**: Use `initial={{ opacity: 0, y: 10 }}` to prevent "jumping" content.

## Anti-Patterns

- Using CSS transitions for complex layout shifts (leads to layout thrashing).
- Over-animating everything; only animate elements that change context.
- Using `duration` based transitions for structural UI (feels sluggish).

## Code Examples

### Shared Element Transition (LayoutId)

```tsx
import { motion } from 'framer-motion';

const Card = ({ id, isOpen, toggle }) => (
  <motion.div
    layoutId={`card-${id}`}
    onClick={toggle}
    className="bg-neutral p-300 rounded-medium"
  >
    <motion.h3 layout="position">Mission Data</motion.h3>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-200"
      >
        Deep operational details...
      </motion.div>
    )}
  </motion.div>
);
```

### AnimatePresence List

```tsx
<AnimatePresence mode="popLayout">
  {items.map((item) => (
    <motion.li
      key={item.id}
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring' }}
    >
      {item.name}
    </motion.li>
  ))}
</AnimatePresence>
```
