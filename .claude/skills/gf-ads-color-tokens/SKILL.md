# SKILL: Atlassian Design System (ADS) Color Tokens

## Purpose
Codify the strict usage of ADS semantic color tokens to ensure accessibility, dark mode consistency, and brand alignment across the GateFlow v9.0 ecosystem.

## Core Principles
1.  **Never Use Raw Hex**: Always use CSS variables mapped to ADS semantic tokens.
2.  **Semantic Meaning**: Choose colors based on *what they represent* (e.g., `background.neutral`), not how they look.
3.  **Accessibility First**: Every color pairing must pass WCAG 2.1 AA contrast ratios (Standard 4.5:1).
4.  **Dark Mode First**: Tokens must automatically switch values based on the `.dark` class.

## Implementation Rules
- **Backgrounds**: Use `color.background.neutral`, `color.background.selected`, `color.background.danger`.
- **Text**: Use `color.text.subtle`, `color.text.accent`, `color.text.inverse`.
- **Borders**: Use `color.border.neutral`, `color.border.focused`.
- **Mapping**: Map tokens in `packages/ui/src/styles/tokens.css`.

## Anti-Patterns
- Using `#FFFFFF` or `bg-white` instead of `var(--ds-background-neutral)`.
- Creating ad-hoc color names like `gateflow-blue` instead of `color.text.accent`.
- Hardcoding "light" colors that break in dark mode.

## Code Examples

### Standard Token Usage (CSS)
```css
.card {
  background-color: var(--ds-background-neutral);
  color: var(--ds-text-default);
  border: 1px solid var(--ds-border-neutral);
}

.card:hover {
  background-color: var(--ds-background-neutral-subtle-hovered);
}
```

### React/Tailwind Integration
```tsx
const Badge = ({ children, status }) => {
  const statusColors = {
    success: 'bg-[var(--ds-background-success)] text-[var(--ds-text-success)]',
    danger: 'bg-[var(--ds-background-danger)] text-[var(--ds-text-danger)]',
  };

  return <span className={cn("px-2 py-1 rounded", statusColors[status])}>{children}</span>;
}
```
