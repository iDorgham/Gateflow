---
name: tailwind
description: Tailwind CSS utilities and theming for GateFlow. Use when styling components, layouts, or extending theme.
---

# Tailwind CSS

## GateFlow setup

- **Config:** `packages/config/tailwind.config.ts` (shared)
- **Apps:** Extend shared; app-specific overrides in app `tailwind.config.ts`
- **Design tokens:** Colors from `packages/ui/src/tokens.ts`; mapped to `hsl(var(--name))`

## Usage

```tsx
className="flex items-center gap-2 rounded-lg border bg-card p-4"
```

- Use token-based colors: `bg-primary`, `text-muted-foreground`, `border-border`
- Responsive: `sm:`, `md:`, `lg:` prefixes
- Dark: `dark:bg-background` (if theme supports)

## Patterns

- **Spacing** — `gap-2`, `p-4`, `space-y-4`
- **Typography** — `text-sm`, `font-medium`, `text-muted-foreground`
- **Layout** — `flex`, `grid`, `flex-col`, `items-center`
- **RTL** — `rtl:` or logical properties; test with `dir="rtl"`

## Avoid

- Hardcoded hex/rgb; use theme colors
- Arbitrary values unless necessary (`w-[137px]`)
- Inline styles for layout; use Tailwind classes
