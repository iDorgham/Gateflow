# Pro Prompt — Phase 0: Ready & /ai Page Scaffold

**Primary role:** FRONTEND — Use this role when implementing or when invoking CLIs.
**Preferred tool:** Cursor

### Context
- **Project**: GateFlow (Turborepo, pnpm)
- **App**: client-dashboard (3001)
- **Packages**: ui, i18n
- **Rules**: pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`)
- **Refs**: `CLAUDE.md`, `docs/plan/execution/PLAN_gateai.md`

### Goal
Setup the structural foundations for GateAI, including the `/ai` hub page and navigation.

### Scope (in)
- Create `/app/[locale]/dashboard/ai/page.tsx` with a premium empty state.
- Add "GateAI" to the sidebar navigation (use mediaBubble AI branding).
- Ensure RTL/LTR support for the new page.

### Scope (out)
- No Gemini integration yet.
- No chat functionality.

### Steps
1. Add `ai` link to `apps/client-dashboard/src/components/dashboard/sidebar.tsx` with a suitable icon (e.g., `Brain` or `Sparkles`).
2. Create the directory `apps/client-dashboard/src/app/[locale]/dashboard/ai`.
3. Create `page.tsx` in that directory. Implement a clean, Atlassian-style layout with a "Welcome to GateAI" hero section.
4. Add translations for "GateAI" and welcome messages in `packages/i18n`.
5. Run `pnpm turbo lint --filter=client-dashboard` and `pnpm turbo typecheck --filter=client-dashboard`.
6. `/github` — feat(gateai): phase 0 — /ai page scaffold.

### Acceptance Criteria
- [ ] Navigating to `/dashboard/ai` shows the new page.
- [ ] Sidebar highlights the correct link.
- [ ] No type or lint errors.
