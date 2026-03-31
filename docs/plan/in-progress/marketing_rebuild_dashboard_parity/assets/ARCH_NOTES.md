# ARCH NOTES: marketing_rebuild_dashboard_parity

## Token strategy

- **Single source of truth:** `packages/ui/src/globals.css`, loaded in marketing via `@import "@gate-access/ui/globals.css";` — same pattern as `apps/client-dashboard/src/app/globals.css`.
- **Layering:** Marketing `app/globals.css` repeats `@tailwind base|components|utilities` after the import so app-level Tailwind runs with the imported token `@layer base` in scope.
- **Removed:** The previous ~300-line duplicate of `:root` / `.dark` shadcn + `--ds-*` definitions; elevation utilities (`.ds-elevation-*`) now come only from the UI package.

## Font decision

- **Inter + Cairo retained** for the marketing site (`next/font` in layout, `--font-inter` / `--font-cairo`). `@gate-access/ui` resolves `--ds-font-family-sans` via `var(--font-inter, …)`, so dashboard and marketing both honor the injected Next font variables where the layout sets them.
- **Tailwind:** `fontFamily.sans` / `arabic` in `tailwind.config.ts` continue to use `tokens.typography` + `var(--font-cairo)` for RTL.

## Exceptions (marketing-only CSS)

- **`html`:** `scroll-behavior: smooth` and `zoom: 0.95` (product choice for landing scale).
- **`body`:** `font-feature-settings` for OpenType features on Latin text.
- **`.ds-radius-*` utilities:** Kept as thin aliases mapping to UI radius tokens (plus `6px` / `16px` where the UI file does not define matching names), so any older class names keep working without copying the full token file.

## Build impact

- Not measured in this phase; CSS payload should decrease vs the old duplicate token block.
