---
name: ads-foundations
description: Foundational design tokens and styling rules for the Atlassian/GateFlow Design System (ADS), including color palettes, typography scale, spacing grid, border radii, shadows, and iconography.
---

# ADS Foundations

Foundations of the Atlassian Design System (ADS) tokens for GateFlow, covering color, space, typography, elevation, and UI styling standards.

## Design Token Architecture

- **Colors**: Use semantic tokens (e.g. `color.background.neutral`, `color.text.subtle`) rather than raw hex.
- **Typography**: Inter / Outfit typography scale with defined line heights and weights.
- **Spacing**: 8pt grid with 4pt baseline intervals (e.g. `space.050`, `space.100`, `space.200`, `space.300`, `space.400`).
- **Radius**: `border.radius.100` (3px), `border.radius.200` (6px), `border.radius.300` (12px), `border.radius.circle` (9999px).
- **Elevation**: Sub-surface shadow layers (`elevation.surface.sunken`, `elevation.surface.raised`, `elevation.surface.overlay`).
- **Iconography**: 16px, 20px, 24px icon sizes aligned to component optical centers.

## Enforcement

- Use `token()` from `@atlaskit/tokens` in web apps.
- In React Native / Expo, resolve to hex via `nativeTokens` from `@gate-access/ui/tokens`.
- Enforce with `pnpm check:ads`.
