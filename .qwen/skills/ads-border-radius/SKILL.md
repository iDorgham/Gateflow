# SKILL: Atlassian Design System (ADS) Border Radius

## Purpose
Standardize rounding for all UI elements to ensure a premium, modern, and consistent look across the GateFlow v9.0 dashboard.

## Core Principles
1.  **Tokenized Rounding**: Use ADS radius tokens instead of arbitrary pixel values.
2.  **Geometric Consistency**: Elements of the same type (e.g., all buttons) must share the same radius.
3.  **Nested Harmony**: Inner radii should be smaller than outer radii for nested elements (e.g., card vs. internal button).

## Implementation Rules
- **Radius tokens**:
  - `radius.none` (0px)
  - `radius.small` (3px) - Small buttons, inputs.
  - `radius.medium` (8px) - Cards, modals.
  - `radius.full` (50%) - Avatars, circular icons.
- **Exceptions**: Specific brand elements (like QR codes) use custom radii specified in `ARCHITECTURE.md`.

## Anti-Patterns
- Using `rounded-none` on standard buttons unless explicitly requested.
- Hardcoding `border-radius: 15px` for a "bubbly" look that deviates from ADS.
- Inconsistent rounding (e.g., square buttons next to rounded inputs).

## Code Examples

### CSS Class Enforcement
```css
.ads-button {
  border-radius: var(--ds-border-radius); /* Default is usually 3px or 4px */
}

.dashboard-card {
  border-radius: var(--ds-border-radius-medium); /* 8px */
  overflow: hidden; /* Ensure content doesn't bleed */
}
```

### Tailwind Usage
```tsx
<button className="rounded-small bg-accent text-inverse px-100 py-050">
  Lock Gate
</button>

<div className="rounded-medium bg-neutral shadow-raised p-200">
  <img src={qrCode} className="rounded-small" />
</div>
```
