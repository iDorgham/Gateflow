# Phase 1: Agentic Foundation (Backend)

## Primary role: BACKEND-Database

## Tool Selection

| Priority | Tool   | Why                                     |
| :------- | :----- | :-------------------------------------- |
| Tool 1   | Cursor | Schema changes and logic integration.   |
| Tool 2   | Gemini | Generating unit tests for the Executor. |

### Skills to load

- [x] `using-superpowers`
- [x] `test-driven-development`
- [x] `verification-before-completion`
- [x] `database`
- [x] `api`
- [x] `architecture`

### MCP to use

| MCP          | When                                    |
| :----------- | :-------------------------------------- |
| Prisma-Local | Schema change, migration, Prisma Studio |

### Context

- **Project**: GateFlow — Zero-Trust platform (Turborepo, pnpm)
- **Goal**: Enable GateAI as an "Autonomous Executor" for maintenance.
- **Rules**: pnpm; multi-tenant (orgId); soft delete; HMAC-SHA256.

### Goal

Implement the `Vendor` schema and the `MaintenanceExecutor` foundation to allow
GateAI to autonomously trigger work orders on scan failures.

### Scope (in)

- `packages/db/prisma/schema.prisma`: Add `Vendor` model.
- `packages/db/`: Generate and migrate.
- `apps/client-dashboard/src/lib/ai/maintenance-executor.ts`: Assignment logic.
- `apps/client-dashboard/src/app/api/qrcodes/validate/`: Trigger failure events.

### Scope (out)

- UI components (handled in Phase 2).
- Real-time SSE (handled in Phase 3).

### Steps (ordered)

1. **Schema Evolution**: Add `Vendor` model with standard fields and `orgId`.
2. **Migration**: Run `pnpm db:generate` and `npx prisma migrate dev`.
3. **Event Trigger**: In QR validation, emit `SCAN_FAILURE` to `EventLog`.
4. **MaintenanceExecutor**: Create logic to listen for failures and create
   assigned `WorkOrder` records based on project vendors.
5. **Tests**: Add unit tests in `src/lib/ai/__tests__/maintenance-executor.ts`.
6. **Preflight**: Run turbo lint, typecheck, and test for `client-dashboard`.

### Acceptance criteria

- [ ] `Vendor` model exists and is safely multi-tenant.
- [ ] `MaintenanceExecutor` correctly creates a `WorkOrder` when triggered.
- [ ] All tests pass; `organizationId` is present on all new records.

### Files likely touched

- `packages/db/prisma/schema.prisma`
- `apps/client-dashboard/src/app/api/qrcodes/validate/route.ts`
- `apps/client-dashboard/src/lib/ai/maintenance-executor.ts`
