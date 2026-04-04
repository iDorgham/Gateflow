# PROMPT: Phase 1 — Foundation (Schema & Domain Models)

### Primary role

`backend-database.md` (Domain Expert: Prisma, Schema, Postgres)

### Tool Selection

| Tool       | Model                    | Why                                                              |
| :--------- | :----------------------- | :--------------------------------------------------------------- |
| **Tool 1** | Gemini CLI (Antigravity) | Excellent with large schema reasoning and free for bulk changes. |
| **Tool 2** | Cursor                   | Best for reviewing diffs and running migrations.                 |

### Skills to load

- [x] `gf-database` — Prisma, migrations, relations.
- [x] `gf-architecture` — Monorepo pathing and type extraction rules.
- [x] `systematic-debugging` — If migration fails due to drift.

### Context

- **Backlog**: `maintenance_management` initiative.
- **Reference**: `packages/db/prisma/schema.prisma` and `packages/types/src/base.ts`.
- **Constraint**: Every new model must have `organizationId`, `createdAt`, `updatedAt`, and `deletedAt`.

### Goal

Define the data structures for the Maintenance Hub and establish relationships with existing Gate, Unit, and Project assets.

### Scope (in)

- **Prisma Enums**:
  - `MaintenanceStatus`: `OPEN`, `ASSIGNED`, `IN_PROGRESS`, `PENDING_PARTS`, `RESOLVED`, `CANCELLED`, `CLOSED`.
  - `MaintenancePriority`: `LOW`, `MEDIUM`, `HIGH`, `URGENT`.
  - `MaintenanceCategory`: `ELECTRICAL`, `PLUMBING`, `HVAC`, `HARDWARE`, `GENERAL`, `FACILITY`.
- **`WorkOrder` Model**:
  - `id`, `organizationId`, `title`, `description`.
  - `status`, `priority`, `category`.
  - `locationType` (GATE | UNIT | PROJECT).
  - `locationId` (Relation id for the specific asset).
  - `reporterId` (User), `assigneeId` (User - optional).
  - `dueDate`, `createdAt`, `updatedAt`, `deletedAt`.
- **Relationships**:
  - `Organization` → `WorkOrder` (1:N).
  - `Gate` / `Unit` / `Project` → `WorkOrder` (1:N).
- **TypeScript**: Shared interfaces in `packages/types/src/base.ts`.

### Steps

1. Load `gf-database` and `gf-architecture` skills.
2. Update `packages/db/prisma/schema.prisma` with the new enums and the `WorkOrder` model.
3. Link `WorkOrder` to `Organization`, `Gate`, `Unit`, and `Project` with appropriate `@relation` and `@index` guards.
4. Run `pnpm db:generate` to refresh the client.
5. Extract base types into `packages/types/src/base.ts` (following the non-circular pattern established in `user.ts` and `organization.ts`).
6. Run `pnpm preflight` to ensure no breakages in existing models.
7. Prepare migration: `pnpm exec prisma migrate dev --name maintenance_hub_initial`.

### Acceptance criteria

- [ ] `WorkOrder` model exists in `schema.prisma` with all required enums.
- [ ] Relationships to `Gate`, `Unit`, and `Project` are established without schema errors.
- [ ] `pnpm db:generate` succeeds.
- [ ] `packages/types/src/base.ts` contains the new maintenance types.
- [ ] `pnpm preflight` (or lint/typecheck) passes for all packages.
- [ ] Conv commit: `feat(db): add maintenance hub work order models`
