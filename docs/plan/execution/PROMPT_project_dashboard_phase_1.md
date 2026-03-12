# Pro Prompt — Phase 1: Project Detail Data Layer

Copy this prompt when running `/dev` for Phase 1 of the project dashboard plan.

---

## Phase 1: Project Detail Data Layer

### Primary role

**BACKEND-Database** — Prisma queries, aggregates, multi-tenant scoping. From `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Rules**: pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`)
- **Refs**: `packages/db/prisma/schema.prisma`, `docs/plan/context/IDEA_project_dashboard.md`

### Goal

Implement server-side data fetching for project detail: project by id with gates, units, aggregates (contacts, unit types, QR metrics, access metrics), gate assignments, and recent scan logs.

### Scope (in)

- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx` (new)
- Prisma queries for Project, Gate, Unit, GateAssignment, ScanLog

### Scope (out)

- UI components (minimal placeholder only)
- Admin dashboard, marketing

### Steps (ordered)

1. **Create route** — Add `[projectId]/page.tsx` under `[locale]/dashboard/projects/`.
2. **Auth & org scope** — Use `getSessionClaims()`, redirect if no orgId. Validate project belongs to org.
3. **Project query** — Fetch project with:
   - `where: { id: projectId, organizationId: orgId, deletedAt: null }`
   - Include: gates (deletedAt null), units, qrCodes, gateAssignments with user
4. **Aggregates:**
   - Contacts: unique count from units → ContactUnit
   - Unit types: distinct from units (UnitType enum)
   - QR metrics: count of QR codes; optionally scans per QR for last 7d/30d
   - Access metrics: ScanLog count for project gates in last 1d, 7d, 30d
5. **Recent scan logs** — Last 20 ScanLogs where gate.projectId = projectId, order by scannedAt desc.
6. **404** — If project not found, `notFound()`.
7. **Minimal UI** — Return a simple div with project name to verify data (Phase 2 will add layout).
8. Run `pnpm preflight`. Fix any regressions.

### Acceptance criteria

- [ ] Route `/[locale]/dashboard/projects/[projectId]` exists and resolves.
- [ ] All queries scoped by `organizationId`.
- [ ] Project not in org returns 404.
- [ ] `pnpm preflight` passes.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx` (new)
