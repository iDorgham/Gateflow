---
name: gf-ads-core-tokens
description: Foundations of the Atlassian Design System (ADS) tokens for GateFlow, covering color, space, and typography.
---

# Atlassian Design Tokens (ADS) Core

## Purpose
Ensure total visual consistency across the GateFlow ecosystem by strictly adhering to the Atlassian Design System token architecture. This skill prevents "ad-hoc" styling and ensures a premium, enterprise-grade feel.

## Core Principles
1. **Semantic over Literal**: Never use `blue-500`; use `color.background.selected.bold`.
2. **Predictable Spacing**: Use the 8pt grid system. Tokens like `space.100` (8px) or `space.200` (16px).
3. **Contrast Continuity**: Tokens must respond to light/dark mode changes automatically via CSS variables.

## Implementation Rules
- **Color**: Always use `var(--ds-bg-*)`, `var(--ds-text-*)`, and `var(--ds-border-*)` CSS variables.
- **Spacing**: Use `utils/spacing.ts` or Tailwind aliases that map to ADS space tokens (e.g., `p-space-200`).
- **Typography**: Strictly follow `font.heading.*` and `font.body.*` tokens. Headings use **Inter** or **Outfit** as defined in `gf-design-guide`.
- **RTL Support**: Ensure spacing tokens use logical properties (e.g., `padding-inline-start` instead of `padding-left`).

## Anti-Patterns
- Hardcoding hex codes (e.g., `#0052CC`).
- Ad-hoc Tailwind values (e.g., `w-[15px]`).
- Using "standard" Tailwind colors like `bg-blue-600` instead of `bg-accent-bold`.

## Code Example
```tsx
import { cn } from "@/utils/cn";

export const PageHeader = ({ title, children }: { title: string; children?: React.ReactNode }) => {
  return (
    <header className={cn(
      "flex flex-col gap-space-100", // Using ADS Space Token
      "bg-ds-surface border-b border-ds-border", // Semantic tokens
      "px-space-400 py-space-300"
    )}>
      <h1 className="text-ds-text-heading font-heading-xlarge">{title}</h1>
      {children && <div className="mt-space-200">{children}</div>}
    </header>
  );
};
```
