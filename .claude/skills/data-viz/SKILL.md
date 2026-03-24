---
name: gf-data-viz-chat
description: Recharts in chat, CLS prevention, and responsive data visualization for AI responses.
---

# AI Data Visualization (Chat)

## Purpose
Convert GateAI's analytical reasoning into beautiful, interactive charts. This skill ensures charts are performant, correctly themed (ADS), and don't cause layout jumps (CLS).

## Core Principles
1. **Immediate Visualization**: If data has a trend, use a `LineChart`. If it's a breakdown, use a `PieChart`.
2. **ADS Palettes**: Use only ADS-compliant colors for chart series (e.g., `var(--ds-chart-1)`, `var(--ds-chart-2)`).
3. **Empty States**: Always handle "no data found" gracefully within the chart container.

## Implementation Rules
- **Library**: Use `recharts` for internal React components.
- **Aspect Ratio**: Always provide a fixed height (e.g., `h-[200px]`) to the chart container to prevent CLS.
- **Interactivity**: Enable Tooltips with custom ADS styling.
- **Responsiveness**: Use `ResponsiveContainer` to ensure charts work on mobile viewports.

## Anti-Patterns
- Returning raw JSON data to the user without a visual representation.
- Using random colors (red, blue, green) that clash with the GateFlow theme.
- High-latency chart rendering that blocks the text response.

## Code Example
```tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const AIBarChart = ({ data }: { data: any[] }) => (
  <div className="h-[200px] w-full mt-space-200">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" hide />
        <YAxis hide />
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--ds-surface-overlay)', border: 'none' }}
          itemStyle={{ color: 'var(--ds-text)' }}
        />
        <Bar dataKey="value" fill="var(--ds-brand-bold)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
```
