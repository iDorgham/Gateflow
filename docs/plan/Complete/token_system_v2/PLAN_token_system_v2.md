# PLAN: GateFlow Token System v2 — 2026 Design Overhaul

**Slug:** `token_system_v2`
**Status:** Active
**Created:** 2026-04-06
**Goal:** Fix broken dark mode, unify the token architecture, and redesign the visual palette to a clean, modern 2026 aesthetic across all GateFlow apps and dashboards.

---

## Problem Summary

Three cascading issues were found during investigation:

### 1. Dark mode is completely broken

- `ThemeProvider` sets `data-color-mode="dark"` on `<html>`
- Tailwind configs in all apps use `darkMode: ['class']` — looking for the `.dark` class
- **Result:** Tailwind `dark:` variants never activate. Components never switch.
- Secondary: shadcn HSL aliases (`--background`, `--foreground`, `--card`, etc.) in `tokens.css` are only defined in `:root` and have no `[data-color-mode="dark"]` override. Even the `--gf-*` semantic vars that resolve correctly never reach the shadcn layer.

### 2. Three competing token systems

- `--gf-color-*` → canonical OKLCH tokens in `packages/tokens/css/tokens.css`
- `--ds-*` → Atlassian-inspired mapping layer in `packages/ui/src/globals.css`
- Raw HSL tuples → shadcn legacy format (`--background: 0 0% 100%`) used by shadcn components
- These three are not synchronized. Adding dark mode values to one doesn't update the others.

### 3. Wrong brand color + dated palette

- Tokens use "Atlassian-inspired Blue/Indigo" as primary brand
- GateFlow's actual accent is **Kimchi #ED4B00**
- Neutral palette is blue-tinted (`hue 250`) — feels cold and corporate
- No proper surface hierarchy (bg → card → raised → overlay → modal)

---

## Architecture Decision

**Single source of truth:** `packages/tokens/css/tokens.css`

All consumers bridge to it:

- shadcn components → via CSS var aliases in `tokens.css`
- Tailwind colors → via JS tokens in `packages/ui/src/tokens.ts`
- `--ds-*` legacy layer → via redirections in `globals.css`

**Dark mode strategy:** Use `[data-color-mode="dark"]` everywhere:

- Update all `tailwind.config.ts` to `darkMode: [['data-color-mode', 'dark']]`
- Keep `ThemeProvider` as-is (already sets `data-color-mode`)
- All dark mode CSS in `tokens.css` under `[data-color-mode="dark"]`

---

## Phases

### Phase 1 — Fix Dark Mode Wiring (Critical)

**File:** `phases/01_dark_mode_fix/PROMPT_phase_01.md`
Fix the mismatch between ThemeProvider (`data-color-mode`) and Tailwind (`class`). Add shadcn HSL dark overrides. Zero visual changes — just makes dark mode work.

### Phase 2 — Redesign Token Palette (2026)

**File:** `phases/02_token_palette/PROMPT_phase_02.md`
Replace the blue-tinted palette with a warm-neutral, Kimchi-accented modern system. Design a proper dark mode (charcoal surfaces, not pure black). Add missing semantic tokens.

### Phase 3 — Unify Token Architecture

**File:** `phases/03_token_architecture/PROMPT_phase_03.md`
Remove HSL-tuple format from `tokens.css`. Ensure ALL consumers (`--ds-*`, shadcn, tailwind) resolve from `--gf-*`. Remove redundancy.

### Phase 4 — App Integration + Verification

**File:** `phases/04_app_integration/PROMPT_phase_04.md`
Update all app tailwind configs. Test across client-dashboard, admin-dashboard, design-system, marketing, resident-portal. Capture light/dark screenshots.

---

## Files Changed Per Phase

| Phase | Files                                                                                        |
| ----- | -------------------------------------------------------------------------------------------- |
| 1     | `packages/tokens/css/tokens.css`, all `apps/*/tailwind.config.ts`                            |
| 2     | `packages/tokens/css/tokens.css`, `packages/tokens/src/token.ts`                             |
| 3     | `packages/tokens/css/tokens.css`, `packages/ui/src/globals.css`, `packages/ui/src/tokens.ts` |
| 4     | All app tailwind configs, design-system color page                                           |

---

## Success Criteria

- [ ] Toggling dark mode in any app visually switches all colors
- [ ] `dark:` Tailwind variants work in all apps
- [ ] shadcn components (Card, Button, Input, Dialog) look correct in both modes
- [ ] Brand color is Kimchi `#ED4B00` as primary accent
- [ ] Surfaces have visible hierarchy: page bg → card → raised → overlay
- [ ] No more blue-tinted neutrals
- [ ] design-system color showcase reflects actual token values
