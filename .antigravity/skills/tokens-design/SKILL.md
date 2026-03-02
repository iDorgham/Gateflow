---
name: tokens-design
description: Design token architecture for consistent theming. Use when defining colors, spacing, typography, or aligning UI with the design system.
---

# Design Tokens

## GateFlow tokens

- **Source:** `packages/ui/src/tokens.ts`
- **Web:** CSS variables `hsl(var(--name))` in globals.css; Tailwind theme extends these
- **Native:** `nativeTokens` export for React Native/Expo

## Structure

```ts
tokens = {
  colors: { primary, secondary, muted, destructive, ... },
  radius: { sm, md, lg, ... },
  spacing: { ... },
  typography: { ... },
}
```

## Usage

- **Tailwind:** `bg-primary`, `text-muted-foreground`, `rounded-md`
- **CSS:** `hsl(var(--primary))`
- **Do not** hardcode colors; use tokens

## Adding tokens

1. Add to `packages/ui/src/tokens.ts`
2. Add CSS variable in `globals.css` (web)
3. Extend Tailwind theme in `packages/config/tailwind.config.ts` if needed

## Reference

- `packages/ui/src/tokens.ts` — Full token definitions
- `docs/plan/architecture/DESIGN_TOKENS.md` — Documentation
