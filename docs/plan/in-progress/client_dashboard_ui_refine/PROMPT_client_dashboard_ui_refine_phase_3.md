# Pro Prompt — Phase 3: Contacts Page

Copy this prompt when running `/dev` for Phase 3 of the client dashboard UI refinement plan.

---

## Phase 3: Contacts Page

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

Apply semantic tokens to contacts page. The page is large (~1190 lines); focus on color token replacement without major structural refactors.

### Scope (in)

- `apps/client-dashboard/src/app/[locale]/dashboard/residents/contacts/page.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/ViewContactsModal.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/ResidentsFilterBar.tsx` (as used by contacts)
- `apps/client-dashboard/src/components/dashboard/residents/TableCustomizerModal.tsx` (if used by contacts)

### Scope (out)

- Units page, Settings, Analytics, QR pages
- Major layout or component extraction (optional refactor only if low-risk)

### Steps (ordered)

1. **Audit** — Search for hardcoded hex/rgb in contacts page and ViewContactsModal. List occurrences.
2. **Replace** — Swap with semantic tokens:
   - Tables: `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`
   - Forms: `bg-background`, `border-input`, `text-foreground`
   - Buttons: `bg-primary`, `text-primary-foreground` for primary; `bg-muted` for secondary
   - Badges, labels, export UI
3. **Do not over-refactor** — Limit changes to token replacement; avoid restructuring the page unless a small extract improves clarity.
4. Run `pnpm preflight`. Fix any regressions.

### Acceptance criteria

- [ ] No hardcoded hex in contacts page and ViewContactsModal.
- [ ] `pnpm preflight` passes.
- [ ] Contacts page renders correctly in light and dark mode.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/residents/contacts/page.tsx`
- `apps/client-dashboard/src/components/dashboard/residents/ViewContactsModal.tsx`
