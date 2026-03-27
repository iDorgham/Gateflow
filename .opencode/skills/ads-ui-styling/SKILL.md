# SKILL: Atlassian Design System (ADS) UI Styling Standard

## Purpose
The master standard for combining ADS tokens into cohesive, high-performance UI components for the GateFlow v9.0 "Command" redesign.

## Core Principles
1.  **Token Composition**: Style components by composing tokens, not defining ad-hoc values.
2.  **Stateful Styling**: Explicitly define `hover`, `focus`, `active`, and `disabled` states using ADS interaction tokens.
3.  **Consistency Over Convenience**: Follow established ADS patterns even if a custom design seems "easier."

## Implementation Rules
- **Component Anatomy**:
  - `Base`: Color tokens + Spacing tokens.
  - `Shape`: Radius tokens.
  - `Depth`: Elevation tokens.
  - `Text`: Typography tokens.
- **State Logic**:
  - `Hover`: `color.background.neutral-subtle-hovered`.
  - `Focus`: `color.border.focused` (2px solid).
  - `Disabled`: `color.background.disabled` + `opacity: 0.4`.

## Anti-Patterns
- Using "Magic Numbers" for margins or padding.
- Hardcoded hex values in component files.
- Ignoring standard focus states (important for accessibility!).

## Code Examples

### Structured Style Object
```tsx
const buttonStyles = {
  container: "px-200 py-100 rounded-small border flex items-center gap-100 transition-colors",
  states: "hover:bg-neutral-hovered focus:ring-2 focus:ring-focused active:scale-[0.98]",
  primary: "bg-accent text-inverse border-transparent shadow-raised",
  secondary: "bg-neutral text-default border-neutral"
};

export const CommandButton = ({ children, variant = 'primary' }) => (
  <button className={cn(buttonStyles.container, buttonStyles.states, buttonStyles[variant])}>
    {children}
  </button>
);
```

### CSS Variable Mapping
```css
.ads-input {
  background-color: var(--ds-background-input);
  border: 1px solid var(--ds-border-input);
  padding: var(--ds-space-100) var(--ds-space-200);
  border-radius: var(--ds-border-radius);
  color: var(--ds-text-default);
}
```
