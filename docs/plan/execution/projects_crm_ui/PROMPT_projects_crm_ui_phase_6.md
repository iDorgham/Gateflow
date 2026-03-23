# Pro Prompt — projects_crm_ui — Phase 6

## Phase 6: Sync & Operations — Project Logs & Team

### Primary role

BACKEND-API | FRONTEND | ARCHITECTURE

### Preferred tool

- [ ] Cursor (default)
- [ ] Claude CLI — security, architecture, complex reasoning
- [x] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001)
- **Packages**: ui, db, api-client
- **Rules**: pnpm only; real-time (SSE/WS context if existing); multi-tenant.
- **Refs**: `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx` (Phase 4), `docs/plan/planning/PLAN_projects_crm_ui.md`

### Goal

Integrate a real-time "Live Logs" feed and gate assignment management directly into the project hub, utilizing the new time-scope fields from Phase 2.

### Scope (in)

- `apps/client-dashboard/src/components/operations/ProjectLiveLogs.tsx` (New)
- `apps/client-dashboard/src/components/operations/ProjectTeamTable.tsx` (New)
- `apps/client-dashboard/src/app/api/projects/[projectId]/logs/route.ts` (API)
- `apps/client-dashboard/src/app/api/projects/[projectId]/team/route.ts` (API)

### Scope (out)

- Static analytics pages (outside project scope).
- Historical logs (> 30 days).

### Steps (ordered)

1. **Project Logs API**: Create `/[locale]/api/projects/[projectId]/logs/`:
   - Returns recent `ScanLog` entries filtered by gates belonging to the project.
   - Include `ProjectName`, `GateName`, `ResidentName` (if applicable) in JSON.
2. **Project Team API**: Create `/[locale]/api/projects/[projectId]/team/`:
   - Returns `GateAssignment` with User data.
   - Support `startTime` and `endTime` (introduced in Phase 2).
3. **Live Logs Feed**: Implement `ProjectLiveLogs.tsx`:
   - Polling or SSE/WS feed of the Logs API.
   - Highlight "Access Denied" or "Watchlist Match" in Red/Alert.
   - Map logs to the "Real Estate Palette" (Midnight Blue headers, Anti-Flash backgrounds).
4. **Project Team Table**: Implement `ProjectTeamTable.tsx` using `AdvancedTable`:
   - Columns: User Name, Assigned Gate, Shift Start, Shift End, IsActive.
   - Action: Open `EditPanel` to manage user/gate assignment.
5. **Time-Scoped Form**: Implement `GateAssignmentForm.tsx` to include the `startTime` / `endTime` fields.
6. **Security Audit**: Ensure every row change checks the `organizationId`.
7. Run `pnpm turbo test --filter=client-dashboard`
8. After phase passes: `/github` — git add, commit (conventional), pull --rebase, push

### Subagents

| Subagent | When | Prompt |
|----------|------|--------|
| **explore** | Logs relations | "Find the relation paths between Gate, Project, and ScanLog to ensure the logs API doesn't perform massive joins." |

### Acceptance criteria

- [ ] "Live Logs" updates when a scan occurs at a gate within the project.
- [ ] Assigning a user to a gate with a specific time-window updates the DB correctly.
- [ ] Users can manage all project operations (Logs, Team) from the single Project Detail Hub.
- [ ] `pnpm turbo build --filter=client-dashboard` passes

### Files likely touched

- `apps/client-dashboard/src/components/operations/ProjectLiveLogs.tsx`
- `apps/client-dashboard/src/components/operations/ProjectTeamTable.tsx`
- `apps/client-dashboard/src/app/api/projects/[projectId]/logs/route.ts`
- `apps/client-dashboard/src/app/api/projects/[projectId]/team/route.ts`
- `packages/db/src/queries/scanlogs.ts`
