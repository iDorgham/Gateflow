## Phase 2: Project page under Projects & header project switching

### Primary role

FRONTEND

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

- [ ] react — React/Next.js patterns  
- [ ] gf-architecture — app structure, routing  
- [ ] gf-design-guide — layout, hierarchy, spacing  
- [ ] gf-i18n — AR/EN & RTL considerations  
- [ ] gf-testing — component and integration tests

### MCP to use

| MCP              | When                           |
|------------------|--------------------------------|
| Context7         | Next.js App Router references  |
| cursor-ide-browser | Manual E2E click-through (optional) |

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

### Context

- Existing project detail work is tracked in `TASKS_project_dashboard.md` and implemented in:
  - `apps/client-dashboard/src/app/[locale]/dashboard/projects/page.tsx`
  - `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`
  - `apps/client-dashboard/src/components/dashboard/project-detail/*`
- A `ProjectFilterContext` already drives analytics and residents filters.
- Goal: make **Projects** feel like a hub where the selected project is reflected in both the header and the central project page, with smooth transitions.

### Goal

Expose a clear **Project page under Projects** that:
- Shows the selected project’s key CRM metrics and overview, and  
- Smoothly updates when the user switches project from the header.

### Scope (in)

- Ensure the Projects index (`/dashboard/projects`) clearly links to the project detail route.
- Align the project detail page layout so it reads like a full “Project dashboard”:
  - Keep the hero, KPIs, gates, team and logs, but verify copy and labels match the CRM vision (projects as “nodes” with gates, units, contacts).
- Wire project selection:
  - Integrate `ProjectFilterContext` (or equivalent) so the **current project** is shown in the header.
  - When the user switches project via the header selector, the project detail view should update to the newly selected project (e.g. via `router.push` or context-driven navigation) with a smooth experience (no jarring full-page flicker).
- Update Projects cards to show:
  - Project name, location, logo, cover (or gradient fallback).
  - High-level metrics: gates, QR codes, units, contacts.
  - Unit type diversity (e.g. `N` unit types) where easily available.

### Scope (out)

- No new analytics charts; re-use existing counts/metrics.
- No changes to ProjectWizard; that is handled by existing plans.

### Steps (ordered)

1. Load `react`, `gf-architecture`, `gf-design-guide`, and `gf-i18n` skills to align with current layout patterns.
2. Review `ProjectFilterContext` and how it’s currently consumed in analytics/residents filter bars; document how the “current project” is chosen (cookie, default, etc.).
3. In `projects/page.tsx` and `ProjectsTab`:
   - Confirm that each project card links consistently to `projects/[projectId]`.
   - Augment the card to ensure logo, cover, description, location, and key counts are visible and visually balanced.
4. In `projects/[projectId]/page.tsx` and `ProjectDetailContent`:
   - Confirm the layout is treated as the main project dashboard and adjust headings/copy if needed.
   - Ensure it can safely handle being navigated to from both:
     - (a) Projects list
     - (b) Header project switcher.
5. Introduce or refine glue between header project selector and routing:
   - When the header project changes, navigate to that project’s detail route while preserving locale.
   - Ensure analytics/residents filters also update (or at least don’t conflict) when the current project changes.
6. Add loading/empty states for:
   - No projects available.
   - Project ID invalid or not found (friendly 404 within dashboard layout).
7. Add or adjust tests where helpful (e.g. simple React tests for project card composition or a smoke test that project detail renders given mock data).
8. Run:
   - `pnpm turbo lint --filter=client-dashboard`
   - `pnpm turbo typecheck --filter=client-dashboard`
   - `pnpm turbo test --filter=client-dashboard`

### SuperDesign (optional — for layout refinement)

For deeper visual polish:

| Scenario | Action |
|----------|--------|
| Project dashboard layout needs rebalancing | `superdesign iterate-design-draft` with screenshots of current project detail and cards to refine hierarchy and density before final tweaks. |

### Subagents (optional)

| Subagent      | When | Prompt |
|---------------|------|--------|
| **browser-use** | Verify navigation flows | "Login to client-dashboard at localhost:3001, switch projects from the header, open `/dashboard/projects`, and confirm the project detail updates correctly when changing the current project." |

### Commands (when to run)

- Before beginning: `/ready` (optional) to ensure a clean working tree.
- After success: `/github` to commit and push changes.

### Acceptance criteria

- [ ] From Projects list, each project card opens its project dashboard.
- [ ] From the header project selector, choosing a project navigates to its dashboard and the selected project is visually obvious.
- [ ] Projects cards show logo (if present), cover (or gradient), description snippet, location, and key counts without layout breakage in EN/AR.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.
- [ ] `pnpm turbo test --filter=client-dashboard` passes (or no regressions).

