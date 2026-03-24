# SKILL: Cinematic Command Motion Philosophy

## Purpose
Define the high-level philosophy of "Cinematic Command" for the GateFlow v9.0 UI, moving beyond simple transitions to purposeful, immersive motion design.

## Core Principles
1.  **Motion with Mission**: Every animation must serve a purpose: guiding attention, indicating status, or confirming an action.
2.  **Cinematic Pacing**: Use purposeful delays and staggeing to create a sense of sequence and hierarchy during page entry.
3.  **Proactive Response**: Motion should feel like it's anticipating the user's next move (e.g., inviting input breaths, pulse alerts).
4.  **Invisible Effort**: The most complex animations should feel effortless and lightweight, never taxing the user's focus or the system's performance.

## Implementation Rules
- **Attention Triage**:
  - `Alerts`: High-frequency, rhythmic motion (pulses).
  - `Context Shifts`: Expansive, layout-morphing motion (layoutId).
  - `Guidance`: Linear, directional motion (slight x/y shifts).
- **Performance Budget**: No more than 10-15 significant animated elements on screen simultaneously.

## Anti-Patterns
- "Cartoonish" over-shoots or bounces that detract from a professional enterprise feel.
- Decorative motion that doesn't convey any information.
- Inconsistent motion timing across different apps in the ecosystem.

## Code Examples

### Purposeful "Pulse" for Alerts
```css
@keyframes attention-pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

.on-critical-alert {
  animation: attention-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  box-shadow: 0 0 0 4px var(--ds-background-danger-subtle);
}
```

### Sequential Page Entry (React)
```tsx
const variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, ease: "easeOut" }
  })
};

// In layout
{sections.map((s, i) => (
  <motion.div custom={i} initial="hidden" animate="visible" variants={variants}>
    {s.content}
  </motion.div>
))}
```
