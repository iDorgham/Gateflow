---
name: shadcn-ads
description: Specialized workflows and patterns for shadcn-ads.
---

# SKILL: Shadcn/UI to ADS Adapter Standards

## Purpose

Codify the rules for adapting Shadcn/Radix components to visually and behaviorally match the Atlassian Design System (ADS) in GateFlow v9.0.

## Core Principles

1.  **Thematic Overrides**: Inject ADS tokens into the `tailwind.config.ts` and `index.css` to override Shadcn defaults.
2.  **Radix Accessibility**: Retain Radix's superior accessible behavior (keyboard, focus) while applying ADS visuals.
3.  **Simplified API**: Provide pre-configured wrappers for common components (Buttons, Modals, Inputs).

## Implementation Rules

- **Overriding Values**:
  - `primary`: Map to `var(--ds-background-accent-bold)`.
  - `border`: Map to `var(--ds-border-neutral)`.
  - `radius`: Map to `var(--ds-border-radius)`.
- **Component Modifications**: Customize `variants` in `cva` to include "subtle", "bold", and "minimal" ADS styles.

## Anti-Patterns

- Using Shadcn "out of the box" without token overrides.
- Manually styling every instance (use the modular `components/ui` folder for overrides).
- Breaking Radix's `z-index` or `Portal` logic with custom styles.

## Code Examples

### ADS-Styled Button Variant

```tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-small text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        ads: 'bg-[var(--ds-background-accent-bold)] text-white hover:bg-[var(--ds-background-accent-bold-hovered)]',
        subtle: 'bg-neutral-subtle text-default hover:bg-neutral-hovered',
        danger: 'bg-danger text-white hover:bg-danger-hovered',
      },
    },
    defaultVariants: { variant: 'ads' },
  }
);
```

### Tailwinding Tokens

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: {
          accent: 'var(--ds-background-accent-bold)',
          neutral: 'var(--ds-background-neutral)',
        },
      },
      borderRadius: {
        small: 'var(--ds-border-radius)',
      },
    },
  },
};
```
