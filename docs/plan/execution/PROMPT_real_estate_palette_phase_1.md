# Pro Prompt — Phase 1: Design Tokens & CSS Variables

Copy this prompt when running `/dev` for Phase 1 of the real estate palette plan.

---

## Phase 1: Design Tokens & CSS Variables

### Primary role

**FRONTEND** — Use tokens-design and tailwind context. From `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001), admin-dashboard (3002), marketing (3000)
- **Packages**: ui, config
- **Rules**: pnpm only; semantic tokens only (no hardcoded hex in components)
- **Refs**: `docs/plan/context/IDEA_real_estate_palette.md`, `docs/guides/UI_DESIGN_GUIDE.md`, `assets/Images/bbab71814a23880255d1be321d27b24f.jpg`

### Goal

Map the professional real estate color palette (Anti-Flash White, Lace Cap, Kimchi, Midnight Blue, Dark Royalty, Deep Sea) to CSS variables in globals.css across client-dashboard, admin-dashboard, marketing, and packages/ui. Kimchi (#ED4B00) is the accent color.

### Scope (in)

- `apps/client-dashboard/src/app/globals.css`
- `apps/admin-dashboard/src/app/globals.css`
- `apps/marketing/app/globals.css`
- `packages/ui/src/globals.css`
- `docs/guides/UI_DESIGN_GUIDE.md`

### Scope (out)

- Component files, login shell, particles (Phase 2)
- Scanner app, resident portal

### Steps (ordered)

1. Convert palette hex to HSL for CSS variables:
   - Anti-Flash White #F2F3F4 → `210 5% 96%`
   - Lace Cap #EBEAED → `260 7% 93%`
   - Kimchi #ED4B00 → `19 100% 46%`
   - Midnight Blue #020035 → `235 94% 11%`
   - Dark Royalty #02066F → `234 96% 23%`
   - Deep Sea #2000B1 → `248 100% 35%`

2. Update `:root` in each globals.css:
   - `--background`: Anti-Flash White
   - `--foreground`: Midnight Blue
   - `--primary`: Kimchi
   - `--primary-foreground`: `0 0% 100%` (white)
   - `--muted`: Lace Cap
   - `--muted-foreground`: Dark Royalty (or similar for contrast)
   - `--secondary`, `--accent`: Lace Cap or Kimchi/10% for accent
   - `--login-accent`: Kimchi (`19 100% 50%` for HSL)

3. Update `.dark`:
   - `--background`: Midnight Blue
   - `--foreground`: Anti-Flash White
   - `--primary`: Kimchi (keep accent)
   - `--primary-foreground`: white
   - `--muted`: Dark Royalty
   - `--muted-foreground`: Lace Cap

4. Add a **Palette reference** section to `docs/guides/UI_DESIGN_GUIDE.md` with the hex/HSL table and contrast notes from IDEA_real_estate_palette.md.

5. Run `pnpm turbo build --filter=client-dashboard --filter=admin-dashboard --filter=marketing --filter=@gate-access/ui` and fix any errors.

### Acceptance criteria

- [ ] All globals.css files use the new palette in `:root` and `.dark`.
- [ ] No hardcoded hex in components (only in CSS variable definitions).
- [ ] UI_DESIGN_GUIDE.md documents the palette.
- [ ] `pnpm turbo build` passes for affected workspaces.
- [ ] `pnpm turbo lint --filter=client-dashboard --filter=admin-dashboard --filter=marketing` passes.

### Files likely touched

- `apps/client-dashboard/src/app/globals.css`
- `apps/admin-dashboard/src/app/globals.css`
- `apps/marketing/app/globals.css`
- `packages/ui/src/globals.css`
- `docs/guides/UI_DESIGN_GUIDE.md`
