# Pro Prompt — Phase 8: Gate Assignments with Time

Copy this prompt when running `/dev` for Phase 8 of the project dashboard plan.

---

## Phase 8: Gate Assignments with Time

### Primary role

**BACKEND-Database** (schema, migration) + **FRONTEND** (UI). From `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

### Preferred tool

- [x] Cursor (default)
- [ ] Gemini CLI — for schema work
- [ ] Claude CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Rules**: pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`)
- **Schema**: `packages/db/prisma/schema.prisma` — GateAssignment model
- **Refs**: `docs/plan/context/IDEA_project_dashboard.md`, `.cursor/skills/gf-database/SKILL.md`

### Goal

Allow assigning team members to gates **with time** (shift window). Extend GateAssignment with time fields; update API and gate-assignments UI.

### Scope (in)

- `packages/db/prisma/schema.prisma`
- `apps/client-dashboard/src/app/api/gates/assignments/route.ts`
- `apps/client-dashboard/src/app/[locale]/dashboard/team/gate-assignments/`
- Settings Team tab (if it includes gate assignments)

### Scope (out)

- Full Shift model; time-aware scanner validation (optional future)

### Steps (ordered)

1. **Schema** — Add optional time fields to GateAssignment. Option A: `startTime DateTime?`, `endTime DateTime?` (store time-of-day; use a fixed date like 1970-01-01 for time-only). Option B: PostgreSQL `@db.Time` if Prisma supports. Option C: `shiftStart String?` (e.g. "08:00"), `shiftEnd String?` (e.g. "16:00") for simplicity. Prefer Option C (string HH:mm) for MVP to avoid timezone complexity.

2. **Migration** — Run `pnpm exec prisma migrate dev --name add_gate_assignment_time` from packages/db or root.

3. **API** — Extend POST `/api/gates/assignments`: accept optional `startTime`, `endTime` (or `shiftStart`, `shiftEnd` strings). Extend GET to return these fields. Update Zod schema.

4. **UI** — Gate-assignments page: when assigning user to gate, add optional time inputs (e.g. "Shift start" 08:00, "Shift end" 16:00). Display time on assignment list/cards.

5. **Scanner (optional)** — If time fields are set, optionally check current time when validating gate assignment. Defer to follow-up if scope is large.

6. Run `pnpm preflight`. Fix any regressions.

### Acceptance criteria

- [ ] GateAssignment has startTime/endTime (or shiftStart/shiftEnd) fields
- [ ] Migration applies cleanly
- [ ] POST /api/gates/assignments accepts and stores time
- [ ] GET returns time for assignments
- [ ] Gate-assignments UI: assign user + gate + optional time
- [ ] List shows time for each assignment
- [ ] `pnpm preflight` passes

### Files likely touched

- `packages/db/prisma/schema.prisma`
- `packages/db/prisma/migrations/` (new migration)
- `apps/client-dashboard/src/app/api/gates/assignments/route.ts`
- `apps/client-dashboard/src/app/[locale]/dashboard/team/gate-assignments/gate-assignments-client.tsx`
