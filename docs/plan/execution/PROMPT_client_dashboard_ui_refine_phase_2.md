# Pro Prompt — Phase 2: Units Page

Copy this prompt when running `/dev` for Phase 2 of the client dashboard UI refinement plan.

---

## Phase 2: Units Page

### Primary role

**FRONTEND** — Use gf-design-guide and tokens-design context. From `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Rules**: pnpm only; semantic tokens only; no hardcoded hex
- **Refs**: `docs/plan/context/IDEA_client_dashboard_ui_refine.md`, `docs/guides/UI_DESIGN_GUIDE.md`

### Goal

Apply semantic tokens to units page, table, modals, and filter bar.

### Scope (in)

- `apps/client-dashboard/src/app/[locale]/dashboard/residents/units/page.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/ViewUnitsModal.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/ResidentsFilterBar.tsx` (as used by units)
- `apps/client-dashboard/src/components/dashboard/residents/TableCustomizerModal.tsx` (if used by units)

### Scope (out)

- Contacts page, Settings, Analytics, QR pages
- ResidentsFilterBar changes must not break contacts page (shared component)

### Steps (ordered)

1. **Audit** — Search for hardcoded hex/rgb in units page and ViewUnitsModal. List occurrences.
2. **Replace** — Swap with semantic tokens:
   - Table: `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`
   - Badges: `bg-primary`, `text-primary-foreground` or `bg-muted`, `text-muted-foreground`
   - Buttons: `bg-primary` for primary actions
   - Modals: `bg-background`, `border-border`
3. **ResidentsFilterBar** — If it has hardcoded colors, use tokens that work for both units and contacts.
4. Run `pnpm preflight`. Fix any regressions.

### Acceptance criteria

- [ ] No hardcoded hex in units page and ViewUnitsModal.
- [ ] Shared ResidentsFilterBar uses tokens; units and contacts both render correctly.
- [ ] `pnpm preflight` passes.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/residents/units/page.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/ViewUnitsModal.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/ResidentsFilterBar.tsx` (if needed)
