# Phase 2: Unit–Resident Linking

## Primary role

**BACKEND-API** + **FRONTEND** — API for unit–user linking; UI for "Link Resident" flow. Use this role when implementing in Cursor or invoking CLIs.

## Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001), admin-dashboard (3002), scanner-app (8081), marketing (3000), resident-portal (3004)
- **Packages**: db, types, ui, api-client, i18n, config
- **Rules**: pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`); QR HMAC-SHA256; no secrets in git
- **Refs**: `CLAUDE.md`, `packages/db/prisma/schema.prisma`, `docs/plan/execution/PLAN_mvp_and_resident.md`

## Goal

Implement admin/tenant UI to link a User (RESIDENT role) to a Unit. A linked resident can access the resident portal for that unit. Units page: "Link Resident" flow; API: PATCH to set `userId`; resident portal: require linked unit to access.

## Scope (in)

- Units page: "Link Resident" flow — select a User with RESIDENT role, assign to unit (or unlink)
- API: `PATCH /api/units/[id]` — add `userId` to schema; validate user has RESIDENT role and belongs to org
- API: endpoint or reuse existing to list org users with RESIDENT role (for resident selector)
- Resident portal: require `Unit.userId = currentUser.id` to access; redirect or show message if no unit linked

## Scope (out)

- No schema changes (Unit.userId already exists in Prisma)
- No ResidentLimit / quota config (Phase 4)
- No auth consolidation between resident-portal and client-dashboard (Phase 3)

## Steps (ordered)

1. **API: PATCH /api/units/[id]** — Add `userId: z.string().optional().nullable()` to `UpdateUnitSchema`. When setting userId: (a) verify user exists, has RESIDENT role (or Role.name = 'RESIDENT'), belongs to org; (b) if unlinking (userId null), allow. Enforce: one unit per resident (Unit.userId is unique).
2. **API: list residents** — Ensure `/api/team` or similar returns users filterable by role. If none exists, add `GET /api/users?role=RESIDENT` scoped by org (or extend team endpoint). Return users with RESIDENT role for the "Link Resident" dropdown.
3. **Units page UI** — Add "Link Resident" action per unit row (or in edit dialog). Show current resident (if userId set). Dropdown/select to pick a RESIDENT user from org. "Unlink" to clear. Call PATCH with userId.
4. **Units API response** — Include `userId`, `user` (id, email, name) in GET /api/units and PATCH response so UI can show linked resident.
5. **Resident portal** — In auth/layout guard: if user has RESIDENT role, query `Unit.findFirst({ where: { userId: user.id, deletedAt: null } })`. If no unit: redirect to "no unit linked" page or show message. If unit exists: allow access.
6. **i18n** — Add keys: `units.linkResident`, `units.unlinkResident`, `units.noResidentLinked`, `units.residentLinked`, `resident.noUnitLinked` (for portal).
7. Run `pnpm turbo lint --filter=client-dashboard` and `pnpm turbo test --filter=client-dashboard`.

## Subagent (explore)

Before implementation, trace the flow:

```
**Subagent (explore):**
Trace the flow: Units page → /api/units, /api/units/[id] PATCH; Team/users API for org members. Find where RESIDENT role is defined (UserRole enum vs Role model) and how to filter users by role. Return key files.
```

## Subagent (shell)

After implementation:

```
**Subagent (shell):**
Run pnpm preflight and report any failure with file:line.
```

## Acceptance criteria

- [ ] Admin/tenant can link a RESIDENT user to a unit from the Units page
- [ ] Admin/tenant can unlink a resident from a unit
- [ ] PATCH /api/units/[id] accepts `userId` and validates RESIDENT role + org scope
- [ ] Resident portal blocks access if RESIDENT user has no linked unit; shows clear message or redirect
- [ ] Resident portal allows access when RESIDENT user has a linked unit
- [ ] `pnpm turbo lint --filter=client-dashboard` passes
- [ ] `pnpm turbo test --filter=client-dashboard` passes (or no regression)

## Files likely touched

- `apps/client-dashboard/src/app/api/units/[id]/route.ts` — add userId to PATCH
- `apps/client-dashboard/src/app/api/units/route.ts` — include user in GET response
- `apps/client-dashboard/src/app/[locale]/dashboard/residents/units/page.tsx` — Link Resident UI
- `apps/client-dashboard/src/app/api/team/route.ts` or new `/api/users` — list RESIDENT users
- `apps/resident-portal/` — unit-check guard (layout or middleware)
- `packages/i18n/` or `apps/client-dashboard/public/locales/` — new i18n keys

## Multi-CLI

**Skip** — routine CRUD + auth guard. Cursor alone is sufficient.
