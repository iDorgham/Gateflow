# Pro Prompt — Phase 3: KPIs, Gates, Team & Logs

Copy this prompt when running `/dev` for Phase 3 of the project dashboard plan.

---

## Phase 3: KPIs, Gates, Team & Logs

### Primary role

**FRONTEND** — Use gf-design-guide and tokens-design. From `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Rules**: pnpm only; semantic tokens only; no hardcoded hex
- **Refs**: `docs/plan/context/IDEA_project_dashboard.md`, `docs/guides/UI_DESIGN_GUIDE.md`

### Goal

Add KPI cards (contacts, unit types, QR metrics, access metrics), gates list, team section, gate logs table, and security shift placeholder to the project detail page.

### Scope (in)

- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`
- KPI cards section
- Gates list (cards or table)
- Team section (users from GateAssignment)
- Gate logs (recent ScanLogs)
- Security shift countdown placeholder

### Scope (out)

- Full gate assignment CRUD (link to existing page in Phase 4)

### Steps (ordered)

1. **KPI cards** — Grid of cards:
   - Contacts count
   - Unit types (count or list)
   - Avg daily/weekly/monthly QR usage (scans or created — use scans per QR for "usage")
   - Avg daily/weekly/monthly access (scan count)
2. **Gates section** — List gates: name, isActive badge, lastAccessedAt, QR count. Use semantic tokens.
3. **Team section** — Users assigned to project gates (from GateAssignment). Show name, email; link to gate-assignments.
4. **Gate logs** — Table or list of recent ScanLogs: gate, QR code, time, status. Limit to 20–50.
5. **Security shift placeholder** — Simple card or badge: "Shift status" with "—" or "On duty" placeholder. No backend; UI slot only.
6. **Semantic tokens** — All sections use `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `text-success`, `text-warning`, etc.
7. Run `pnpm preflight`. Fix any regressions.

### Acceptance criteria

- [ ] KPI cards display real data.
- [ ] Gates list shows all project gates.
- [ ] Team section shows assigned users.
- [ ] Gate logs show recent scans.
- [ ] Shift placeholder present.
- [ ] Semantic tokens only.
- [ ] `pnpm preflight` passes.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx`
- Possibly extract `ProjectDetailClient` if client interactivity needed (e.g. expandable logs)
