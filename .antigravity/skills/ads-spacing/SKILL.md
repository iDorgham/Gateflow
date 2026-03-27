# SKILL: Atlassian Design System (ADS) Spacing Grid

## Purpose
Enforce the ADS 4px grid system to ensure consistent vertical rhythm and component alignment across all 6 GateFlow apps.

## Core Principles
1.  **Strict 4px Increments**: All spacing must be multiples of 4px.
2.  **Tokenized Gaps**: Use named tokens like `space.100` instead of pixel values.
3.  **Encapsulated Layouts**: Use `gap` and `padding` tokens rather than top/bottom margins on siblings.

## Implementation Rules
- **Basic Tokens**:
  - `space.050` (4px)
  - `space.100` (8px)
  - `space.200` (16px)
  - `space.400` (32px)
  - `space.600` (48px)
- **Container Side Padding**: Always use `space.300` or `space.400` for main dashboard containers.

## Anti-Patterns
- Using `mt-3` (12px) or `mb-5` (20px) which fall outside the 4px grid.
- Hardcoding `padding: 15px`.
- Using `margin` to push sibling components apart (use Flex/Grid `gap` instead).

## Code Examples

### CSS Token Mapping
```css
:root {
  --gf-spacing-small: var(--ds-space-100); /* 8px */
  --gf-spacing-medium: var(--ds-space-200); /* 16px */
  --gf-spacing-large: var(--ds-space-400); /* 32px */
}

.container {
  padding: var(--gf-spacing-large);
  display: flex;
  flex-direction: column;
  gap: var(--gf-spacing-medium);
}
```

### Tailwind Utilities (Mapped in tailwind.config.ts)
```tsx
<div className="p-400 flex flex-col gap-200">
  <h1 className="mb-100">Operation Command</h1>
  <p>System operational status: Normal</p>
</div>
```
