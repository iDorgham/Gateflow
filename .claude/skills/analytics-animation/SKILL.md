# SKILL: Analytics Animation & Data Motion

## Purpose
Apply purposeful motion to data visualizations, count-ups, and charts to make GateFlow analytical insights more engaging and readable.

## Core Principles
1.  **Progressive Disclosure**: Animate charts from left-to-right or bottom-to-top to guide the user's eye through the timeline or distribution.
2.  **Non-Distracting Transitions**: Chart updates should be smooth enough to perceive the change without being so slow that they delay information gathering.
3.  **Numerical Flow**: Use animated count-ups for primary KPIs to emphasize real-time data ingestion.

## Implementation Rules
- **Recharts Integration**: Use `isAnimationActive={true}` with custom spring durations for bars and lines.
- **KPI Count-ups**: Use `framer-motion` `useTransform` or `react-countup` for primary hero numbers.
- **Loading Skeletons**: Transition from skeleton to chart with a subtle cross-fade (`opacity: 0` → `1`).

## Anti-Patterns
- "Bouncing" charts (over-shooting springs in bars/lines).
- Animating every single data point update in a high-frequency stream.
- Using staggered delays longer than 500ms for dashboard initialization (feels laggy).

## Code Examples

### KPI Count-Up (Framer Motion)
```tsx
import { motion, useSpring, useTransform } from "framer-motion";

export const AnimatedKPI = ({ value }) => {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
};
```

### Recharts Animated Bar
```tsx
<BarChart data={data}>
  <Bar
    dataKey="scans"
    fill="var(--ds-background-accent-bold)"
    animationBegin={200}
    animationDuration={800}
    animationEasing="ease-out"
  />
</BarChart>
```
