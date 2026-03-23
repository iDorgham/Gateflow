# Pro Prompt — projects_crm_ui — Phase 4

## Phase 4: Project Hub — List & Detail Views

### Primary role

FRONTEND | ARCHITECTURE

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001)
- **Packages**: ui, i18n
- **Rules**: pnpm only; Midnight Blue/Kimchi Orange palette; multi-tenant.
- **Refs**: `apps/client-dashboard/src/app/[locale]/dashboard/projects/page.tsx`, `docs/plan/planning/PLAN_projects_crm_ui.md`

### Goal

Redesign the project list and implement the detailed project "Command Center" dashboard with rich header aggregates.

### Scope (in)

- `apps/client-dashboard/src/app/[locale]/dashboard/projects/page.tsx` (Update)
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx` (New)
- `apps/client-dashboard/src/components/projects/ProjectHero.tsx` (New)
- `apps/client-dashboard/src/components/projects/ProjectKpiCards.tsx` (New)

### Scope (out)

- Contacts/Units implementation.
- Gate Operations logic.

### Steps (ordered)

1. **Update List**: Redesign the existing `/dashboard/projects` card grid:
   - Use high-density cards with project logo/cover preview.
   - Add mini-sparklines (if analytics aggregates exist) for scan growth.
   - Update links to point to the new detail page.
2. **Project Detail Header**: Create `ProjectHero.tsx`:
   - Full-width hero background (cover photo).
   - Project logo, Title, and Location in a floating box.
   - Action buttons (Edit Project, Share) in the header.
3. **KPI Statistics**: Create `ProjectKpiCards.tsx`:
   - 4-card grid: **Contacts**, **Units**, **Active QRs**, **Scan Volume**.
   - Show "Growth %" (calculated in Phase 2) with color markers (Kimchi Orange for up/down alerts).
4. **Tabs Layout**: Implement a tabbed interface for: **Overview**, **Contacts**, **Units**, **Gates**, **Logs**.
5. **Security**: Validate that the user belongs to the requested `projectId` in the server component.
6. Run `pnpm turbo build --filter=client-dashboard`
7. After phase passes: `/github` — git add, commit (conventional), pull --rebase, push

### SuperDesign

Run *before* implementation:

| Scenario | Action |
|----------|--------|
| New page | `superdesign create-design-draft` for "Project Hub detail page with Midnight Blue hero and floating stats", `--context-file` for dashboard |

### Acceptance criteria

- [ ] Project cards properly link to detailed hub.
- [ ] Hero header adapts to project images (cover/logo).
- [ ] KPI cards display accurate growth markers.
- [ ] Everything is RTL-compliant (Arabic layout perfect).
- [ ] Zero cross-org data leaks in page loading.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/projects/page.tsx`
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`
- `apps/client-dashboard/src/components/projects/ProjectHero.tsx`
- `apps/client-dashboard/src/components/projects/ProjectKpiCards.tsx`
