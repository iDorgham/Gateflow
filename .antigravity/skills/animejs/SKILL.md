---
name: animejs
description: Specialized workflows and patterns for animejs.
---

# SKILL: AnimeJS Sequences & Complex Timelines

## Purpose

Manage complex, multi-element staggering and SVG-based animations using **AnimeJS** for mission-critical visual feedback in GateFlow v9.0.

## Core Principles

1.  **Choreographed Timelines**: Coordinate multiple animations in a single sequence for storytelling (e.g., alert system initialization).
2.  **Staggered Geometry**: Animate grids and lists with mathematical staggered offsets for a cinematic feel.
3.  **SVG Path Intelligence**: Use AnimeJS's superior SVG path manipulation for drawing complex mission maps or QR branding.

## Implementation Rules

- **Timelines**: Use `anime.timeline()` to chain animations.
- **Staggering**: Use `anime.stagger()` for list entries or grid pulses.
- **Performance**: Limit AnimeJS usage to "cinematic moments" (modals, intros, data loading) while using Framer for standard UI interactions.

## Anti-Patterns

- Using `setTimeout` to sequence animations (use the AnimeJS timeline).
- Applying AnimeJS to generic button hovers (Framer is better for interactions).
- Animating strictly via JS when CSS `keyframes` suffice for simple loops.

## Code Examples

### Staggered Grid Initialization

```javascript
import anime from 'animejs';

export const pulseGrid = (selector) => {
  anime({
    targets: selector,
    scale: [0.9, 1],
    opacity: [0, 1],
    delay: anime.stagger(100, { grid: [14, 5], from: 'center' }),
    easing: 'easeOutQuad',
    duration: 800,
  });
};
```

### SVG Path Drawing Sequence

```javascript
const tl = anime.timeline({
  easing: 'easeOutExpo',
  duration: 750,
});

tl.add({
  targets: '.path-main',
  strokeDashoffset: [anime.setDashoffset, 0],
  duration: 1500,
}).add(
  {
    targets: '.path-details',
    opacity: [0, 1],
    translateY: [20, 0],
  },
  '-=1000'
);
```
