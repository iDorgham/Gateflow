# Design Tokens (tokens.ts)

The GateFlow UI utilizes a centralized Design Tokens architecture located at `packages/ui/src/tokens.ts`. This serves as the single source of truth for both web (Tailwind / Next.js) and native (React Native / Expo) platforms within the monorepo.

## System Overview

### Color Palette
- **Semantic Colors**: Extends basic hues into semantic states.
    - `primary`: Core brand color.
    - `secondary`: Accents and muting.
    - `success`, `danger`, `warning`, `info`: Feedback and statuses.
- **Backgrounds & Text**: `background`, `foreground`, `card`, `popover`, `muted`, `accent`.

### Border Radius
We use a standard scaling system mapped securely to CSS Variables (`--radius-md`, etc.) and native styles (`borderRadius.md`).
- `sm`: 6px
- `md`: 12px (Standard card/input border)
- `lg`: 16px (Dialogs/Popovers)
- `xl`: 24px (Large sweeping boundaries like Overlays)
- `full`: 9999px (Avatars, pills)

### Layout & Spacing
A complete 4pt grid system mapped to both Tailwind spacing (`p-4`, `m-2`) and generic container spacing points (`spacing.md`, `spacing.xl`).

## Platform Integration

### 1. Web (Next.js & Tailwind CSS)
Web implementations consume these tokens via CSS custom properties defined in `globals.css` and linked within the Tailwind config extensions in `packages/config/tailwind.config.ts`.
- Changes made to `globals.css` instantly sync across `marketing`, `resident-portal`, `client-dashboard`, and `admin-dashboard`.

### 2. Native (React Native)
Native implementations import the raw dictionary exported as `nativeTokens` from `@gate-access/ui`.
- Never use hardcoded stylistic constants (e.g., `borderRadius: 12`) inside Mobile app components. Instead use `nativeTokens.borderRadius.md`.

## Modifying Tokens
To adjust the core appearance of the GateFlow ecosystem:
1. Update values globally inside `packages/ui/src/globals.css`.
2. Update the numeric bindings mapping into the React Native export inside `packages/ui/src/tokens.ts`.
3. Re-run `pnpm turbo build` to ensure type checks traverse styling structures successfully.
