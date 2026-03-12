# Pro Prompt — Phase 6: Edit Panel + Project Page

Copy this prompt when running `/dev` for Phase 6 of the project dashboard plan.

---

## Phase 6: Edit Panel + Project Page

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
- **Rules**: pnpm only; semantic tokens only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`)
- **APIs**: `/api/projects/[id]` (PATCH), `/api/contacts` (POST), `/api/units` (POST), `/api/gates` (GET, POST, PATCH), `/api/gates/assignments` (GET, POST, DELETE), `/api/watchlist` (GET, POST, DELETE; PATCH if added)
- **Refs**: `docs/plan/context/IDEA_project_dashboard.md`, `docs/plan/execution/PLAN_project_dashboard.md`, `apps/client-dashboard/src/components/dashboard/EditPanel.tsx`

### Goal

Integrate EditPanel into project page (or projects list): Edit project, Add contact, Add unit, Add/Edit gate, Manage gate assignments, Add/Edit watchlist entry; optional search in panel.

### Scope (in)

- Project detail page `[projectId]/page.tsx` or projects list — action buttons that open EditPanel
- EditPanel with mode/variant: project, contact, unit, gate, gate-assignments, watchlist
- Forms for each entity type; API calls for CRUD

### Scope (out)

- Full integration into contacts page, units page, gates page, watchlist page (future phases)
- Admin dashboard, marketing, scanner app

### Steps (ordered)

1. **Edit project** — Add "Edit project" button. Opens EditPanel with project form (name, description, location, logoUrl, coverUrl, website). On save: PATCH `/api/projects/[id]`. Use existing projects API.

2. **Add contact** — Add "Add contact" button. Opens EditPanel with contact form. On save: POST `/api/contacts`. Use existing contacts API.

3. **Add unit** — Add "Add unit" button. Opens EditPanel with unit form; prefill or require projectId from context. On save: POST `/api/units`.

4. **Add/Edit gate** — Add "Add gate" and (from gates list) "Edit gate" buttons. Gate form: name, location, projectId (optional, from context when on project page), isActive. POST `/api/gates` for add (extend schema to accept projectId if not supported). PATCH `/api/gates` for edit (id in body). Use existing gates API.

5. **Manage gate assignments** — Add "Manage assignments" button. Opens EditPanel with: user dropdown (org users), gate multi-select (project gates or org gates). On save: POST `/api/gates/assignments` (userId, gateIds). Optional: list current assignments and allow remove via DELETE. Requires `gates:manage` permission.

6. **Add/Edit watchlist entry** — Add "Add watchlist entry" button. Form: name, idNumber, phone, notes. POST `/api/watchlist` for add. If edit is needed: add PATCH to `/api/watchlist` (or create `/api/watchlist/[id]`) for update; otherwise "Edit" can open panel with pre-filled form and PATCH. Requires `gates:manage` permission.

7. **Search (optional)** — Use EditPanel `headerExtra` prop to render a Command/search input. Query `/api/search` (or existing search). On select: load entity in panel (e.g. contact → contact form, gate → gate form). Can be deferred to a follow-up if time-constrained.

8. **State & mode** — Use local state (e.g. `panelMode: 'project' | 'contact' | 'unit' | 'gate' | 'gate-assignments' | 'watchlist' | null`) to control which form renders in EditPanel. Pass `onOpenChange`, `onSave` per mode.

9. **Permissions** — Gate assignments and watchlist require `gates:manage`. Hide or disable those buttons if user lacks permission.

10. Run `pnpm preflight`. Fix any regressions.

### Acceptance criteria

- [ ] Edit project works from project page
- [ ] Add contact opens EditPanel with form; saves via POST
- [ ] Add unit opens EditPanel with form; projectId from context
- [ ] Add gate opens EditPanel; new gate created; projectId supported when on project page
- [ ] Edit gate opens EditPanel with existing gate data; saves via PATCH
- [ ] Manage gate assignments: assign users to gates; list/remove if feasible
- [ ] Add watchlist entry opens EditPanel; saves via POST
- [ ] Edit watchlist entry works (add PATCH if missing)
- [ ] Permission checks: gates:manage for assignments and watchlist
- [ ] Semantic tokens only; RTL support
- [ ] `pnpm preflight` passes

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx` (or projects list client)
- `apps/client-dashboard/src/components/dashboard/EditPanel.tsx` (if props change)
- New: `apps/client-dashboard/src/components/dashboard/forms/` (project-form, contact-form, unit-form, gate-form, gate-assignments-form, watchlist-form) — or inline in page
- `apps/client-dashboard/src/app/api/gates/route.ts` (add projectId to CreateGateSchema if missing)
- `apps/client-dashboard/src/app/api/watchlist/route.ts` (add PATCH if needed)
