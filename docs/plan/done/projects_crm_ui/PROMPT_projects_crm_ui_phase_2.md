# Pro Prompt — projects_crm_ui — Phase 2

## Phase 2: Core Schema & API — CRM Aggregates

### Primary role

ARCHITECTURE | BACKEND-Database | BACKEND-API

### Preferred tool

- [ ] Cursor (default)
- [ ] Claude CLI — security, architecture, complex reasoning
- [x] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001)
- **Packages**: db, types
- **Rules**: pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`).
- **Refs**: `packages/db/prisma/schema.prisma`, `docs/plan/Draft/PLAN_projects_crm_ui.md`

### Goal

Extend the data model to support shift-based gate assignments and create the API for project-level aggregate metrics.

### Scope (in)

- `packages/db/prisma/schema.prisma` (Extensions)
- `apps/client-dashboard/src/app/api/projects/[projectId]/aggregates/route.ts` (API)
- `packages/db/src/queries/projects.ts` (Helper methods)

### Scope (out)

- Scanning logic changes
- UI components

### Steps (ordered)

1. **Extend Schema**: Modify `schema.prisma`'s `GateAssignment`:
   - Add optional `startTime` (DateTime), `endTime` (DateTime).
   - Add nullable `scheduleJson` (Json) for future flexible shifting.
2. **Prisma Push**: Run `pnpm db push --force` and regenerate clients.
3. **Aggregate API**: Create `/[locale]/api/projects/[projectId]/aggregates/route.ts`:
   - Returns count of `Contacts` (via Units).
   - Returns count of `Units`.
   - Returns count of `qrCodes` and `scanLogs` within a timeframe.
   - Calculates weekly scan growth percentage from a previous 7-day window.
4. **Security Check**: Confirm all queries are scoped by `organizationId`.
5. **Update Types**: Update shared project types in `@gate-access/types` if aggregates are modeled as an interface.
6. Run `pnpm turbo build --filter=@gate-access/db`, `pnpm turbo build --filter=client-dashboard`
7. After phase passes: `/github` — git add, commit (conventional), pull --rebase, push

### Subagents

| Subagent | When | Prompt |
|----------|------|--------|
| **explore** | Find query paths | "Find how Projects relate to Contacts through Units and ContactUnit. Tracing API-to-DB path." |
| **shell** | DB verify | "Run pnpm db push and report status." |

### Acceptance criteria

- [ ] `GateAssignment` supports time-scopes.
- [ ] API successfully returns Project aggregate data for the dashboard hub.
- [ ] Every record returned is validated for the current user's `organizationId`.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes

### Files likely touched

- `packages/db/prisma/schema.prisma`
- `apps/client-dashboard/src/app/api/projects/[projectId]/aggregates/route.ts`
- `packages/db/src/queries/projects.ts`
- `packages/types/src/index.ts`

### Adversarial Review (Mandatory for High-Risk)

**Trigger**: This phase involves Multi-tenancy and Core DB Scripts.

1. **Invoke Adversary**: Use Gemini to challenge: "Check the `aggregates` API for potential IDOR where a user from Org A can request aggregates for Project B belonging to Org B."
2. **Loop**: Self-correct by adding the `claims.orgId` check.
3. **Verification**: State total corrected flaws in walkthrough.
