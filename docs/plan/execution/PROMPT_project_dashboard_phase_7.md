# Pro Prompt — Phase 7: Projects Settings Tab (First Project + Gates)

Copy this prompt when running `/dev` for Phase 7 of the project dashboard plan.

---

## Phase 7: Projects Settings Tab (First Project + Gates)

### Primary role

**FRONTEND** — Use gf-design-guide, gf-api. From `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Rules**: pnpm only; semantic tokens only; multi-tenant (`organizationId`)
- **Refs**: `docs/plan/context/IDEA_project_dashboard.md`, `docs/plan/execution/PLAN_project_dashboard.md`
- **Existing**: `ProjectWizard` in `@/components/project-wizard`, `ProjectsTab` in settings/tabs/projects-tab.tsx

### Goal

Make the Settings Projects tab the **only** place to create the first project. Combine project creation with gates in one flow (project + gates wizard).

### Scope (in)

- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/projects-tab.tsx`
- `apps/client-dashboard/src/components/project-wizard.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/page.tsx`

### Scope (out)

- Admin dashboard, scanner app

### Steps (ordered)

1. **First-project flow** — When org has zero projects, `/dashboard/projects` should show an empty state with CTA: "Create your first project in Settings" linking to `/[locale]/dashboard/settings?tab=projects` (or equivalent). Do not allow project creation from `/dashboard/projects` when org has 0 projects.

2. **Project + Gates wizard** — Extend ProjectWizard (or the create flow in projects-tab) to include gates. After project basic info (name, description, etc.), add a step: "Add gates to this project". User can add one or more gates (name, location) before finishing. Create project via POST `/api/projects`, then create gates via POST `/api/gates` with `projectId` in body. Ensure gates API accepts `projectId` when creating.

3. **Projects tab** — Ensure "New Project" in Settings Projects tab uses the extended wizard. When org has 0 projects, emphasize this as the entry point (e.g. empty state copy: "Create your first project and add gates to get started").

4. **Projects list redirect (optional)** — If user navigates to `/dashboard/projects` with 0 projects, optionally redirect to Settings Projects tab or show prominent CTA.

5. Run `pnpm preflight`. Fix any regressions.

### Acceptance criteria

- [ ] First project can only be created from Settings → Projects tab
- [ ] Project creation includes gate setup (add gates in same wizard flow)
- [ ] Gates API supports `projectId` when creating a gate
- [ ] `/dashboard/projects` with 0 projects shows CTA to Settings
- [ ] Semantic tokens only; RTL support
- [ ] `pnpm preflight` passes

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/settings/tabs/projects-tab.tsx`
- `apps/client-dashboard/src/components/project-wizard.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/page.tsx`
- `apps/client-dashboard/src/app/api/gates/route.ts` (add projectId to CreateGateSchema if missing)
