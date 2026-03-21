# Pro Prompt — Phase 4: Navigation & Integration

Copy this prompt when running `/dev` for Phase 4 of the project dashboard plan.

---

## Phase 4: Navigation & Integration

### Primary role

**FRONTEND** — Use gf-design-guide. From `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Rules**: pnpm only; semantic tokens only
- **Refs**: `docs/plan/context/IDEA_project_dashboard.md`

### Goal

Wire projects list to project detail page; add gate assignments shortcut from project page; verify sidebar navigation.

### Scope (in)

- `apps/client-dashboard/src/app/[locale]/dashboard/projects/page.tsx` (or projects-client if used)
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/projects-tab.tsx`
- Project detail page — "Manage gate assignments" CTA
- Gate assignments page — support `?project=` query param if feasible

### Scope (out)

- Admin dashboard, marketing

### Steps (ordered)

1. **Projects list** — Update project cards/links so clicking a project navigates to `/{locale}/dashboard/projects/{projectId}` instead of staying on list or going elsewhere.
2. **Settings projects tab** — Ensure "Dashboard" / "View" button links to project detail.
3. **Project detail** — Add "Manage gate assignments" button that links to `/{locale}/dashboard/team/gate-assignments` (optionally with `?project={projectId}` if gate-assignments supports it).
4. **Gate assignments** — If not already supported: add optional `project` query param to filter by project. Read `searchParams.project`, filter gates by projectId when present.
5. **Sidebar** — Verify "Projects" or equivalent links to `/dashboard/projects` (list).
6. Run `pnpm preflight`. Fix any regressions.

### Acceptance criteria

- [ ] Projects list → detail navigation works.
- [ ] Settings projects tab → detail works.
- [ ] "Manage gate assignments" reachable from project detail.
- [ ] Gate assignments can be filtered by project (if param added).
- [ ] `pnpm preflight` passes.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/projects/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/projects-client.tsx` (if exists)
- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/projects-tab.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/team/gate-assignments/page.tsx` or `gate-assignments-client.tsx`
