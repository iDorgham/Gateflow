# Pro Prompt — Phase 5: Create QR, Overview & Shell

Copy this prompt when running `/dev` for Phase 5 of the client dashboard UI refinement plan.

---

## Phase 5: Create QR, Overview & Shell

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
- **Refs**: `docs/plan/context/IDEA_client_dashboard_ui_refine.md`, `docs/guides/UI_DESIGN_GUIDE.md`, `CLAUDE.md` (API routes for qrcodes)

### Goal

Add or fix Create QR page so sidebar and overview links work; apply semantic tokens to overview, sidebar, and shell.

### Scope (in)

- `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/` — add `page.tsx` (list) and `create/page.tsx` if missing
- `apps/client-dashboard/src/app/[locale]/dashboard/page.tsx` (overview)
- `apps/client-dashboard/src/components/dashboard/sidebar.tsx`
- `apps/client-dashboard/src/components/dashboard/shell.tsx`
- `apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx`

### Scope (out)

- Admin dashboard, marketing, scanner app
- Full QR creation flow (API exists; UI can be minimal for this phase)

### Steps (ordered)

1. **Check QR routes** — Verify if `[locale]/dashboard/qrcodes/page.tsx` and `[locale]/dashboard/qrcodes/create/page.tsx` exist. If 404:
   - Add minimal `page.tsx` for list (e.g. placeholder or redirect to create)
   - Add minimal `create/page.tsx` with basic form shell using semantic tokens (can defer full form to a later initiative)
2. **Overview** — Replace hardcoded hex in `dashboard/page.tsx`. CTA buttons: `bg-primary`, `text-primary-foreground`. Cards: `bg-card`, `border-border`.
3. **Sidebar** — Active/hover states use `bg-primary` or `bg-muted`; `text-foreground`, `text-muted-foreground`. Icons and labels use tokens.
4. **Shell** — Search bar, notifications, user dropdown use tokens.
5. **Dashboard layout** — If it has nav or layout-specific colors, apply tokens.
6. Run `pnpm preflight`. Fix any regressions.

### Subagents (optional)

| Subagent | When | Prompt |
|----------|------|--------|
| **explore** | If QR routes missing | "Find existing QR creation API routes and any QR-related UI. List key files for POST /api/qrcodes and GET." |
| **browser-use** | After implementation | "Login at localhost:3001. Click sidebar 'QR Codes', click overview 'Create QR Code'. Verify no 404 and palette consistency." |

### Acceptance criteria

- [ ] `/dashboard/qrcodes` and `/dashboard/qrcodes/create` resolve (no 404).
- [ ] Overview, sidebar, shell use semantic tokens only.
- [ ] `pnpm preflight` passes.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/page.tsx` (new if missing)
- `apps/client-dashboard/src/app/[locale]/dashboard/qrcodes/create/page.tsx` (new if missing)
- `apps/client-dashboard/src/app/[locale]/dashboard/page.tsx`
- `apps/client-dashboard/src/components/dashboard/sidebar.tsx`
- `apps/client-dashboard/src/components/dashboard/shell.tsx`
- `apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx`
