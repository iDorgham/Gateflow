# SKILL: Atlassian Design System (ADS) Iconography Grid

## Purpose
Standardize icon usage, sizing, and stroke weights to ensure a uniform visual language across the GateFlow v9.0 ecosystem.

## Core Principles
1.  **Uniform Stroke**: Use a consistent stroke width (1.5px or 2px) to match ADS patterns.
2.  **Grid Alignment**: Icons must be centered within a standard grid container (usually 24x24 or 16x16).
3.  **RTL Intelligence**: Mirror directional icons (arrows, chevrons, etc.) for Arabic layouts.

## Implementation Rules
- **Standard Sizes**:
  - `Small`: 16x16px (inline text, buttons).
  - `Medium`: 24x24px (standard dashboard icon).
  - `Large`: 32x32px (feature headers).
- **RTL Mirroring**: Use CSS `rtl:-scale-x-1` or React hooks to flip directional icons.
- **Color**: Icons should inherit `var(--ds-icon-subtle)` or match the associated text color token.

## Anti-Patterns
- Using multiple icon libraries with different stroke weights (e.g., FontAwesome mixed with Lucide).
- Squashing or stretching icons by not maintaining aspect ratio.
- Forgetting to flip "Back" or "Forward" arrows in RTL mode.

## Code Examples

### RTL Mirroring (Tailwind)
```tsx
import { ChevronRight } from 'lucide-react';

const NavLink = ({ children, href }) => (
  <a href={href} className="flex justify-between items-center p-100">
    <span>{children}</span>
    <ChevronRight className="w-16 h-16 rtl:rotate-180" />
  </a>
);
```

### CSS Icon Styling
```css
.ads-icon {
  width: 24px;
  height: 24px;
  stroke-width: 1.5;
  color: var(--ds-icon-neutral);
}

.ads-icon-primary {
  color: var(--ds-icon-accent);
}
```
