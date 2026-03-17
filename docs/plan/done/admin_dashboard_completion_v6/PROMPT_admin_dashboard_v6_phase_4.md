# Phase 4: Global User Management

## Primary role
SECURITY

## Preferred tool
- [x] Cursor (default)
- Load `.cursor/skills/gf-security/SKILL.md` before implementing

## Context
- **App**: `apps/admin-dashboard`
- **Refs**:
  - `apps/admin-dashboard/src/app/[locale]/(dashboard)/users/page.tsx` — current stub
  - `apps/admin-dashboard/src/lib/admin-auth.ts`
  - `packages/db/prisma/schema.prisma` — User model (id, name, email, roleId, organizationId, deletedAt, createdAt)
  - `apps/admin-dashboard/src/components/organizations/OrgTable.tsx` — pattern reference for tables
  - `@gate-access/ui` — Sheet, Badge, Button, Input, NativeSelect, cn
  - `.cursor/skills/gf-security/SKILL.md` — security invariants for user management

## Goal
Replace the users stub with a full cross-org user management page. Features: paginated user list with search + org filter + role filter, user detail sheet, role change action, deactivate/reactivate action.

## Scope (in)
- **API routes** (`src/app/[locale]/api/admin/users/`):
  - `route.ts` — `GET`: list users across all orgs with `?search=` (name/email), `?orgId=`, `?role=`, `?status=active|suspended`, `?page=`, `?pageSize=25`. Returns `{ data, total }`. Include `organization.name` and `role.name` in select.
  - `[id]/route.ts` — `GET`: single user detail. `PATCH`: `{ action: 'deactivate' | 'reactivate' }` (sets/clears `deletedAt`) OR `{ roleId: string }` for role change.
- **Security constraints (enforce strictly)**:
  - Admin cannot change their own role or deactivate themselves.
  - Admin cannot elevate a user to PLATFORM_ADMIN (only read/demote).
  - Soft delete only — never hard-delete users.
  - All PATCH actions should be logged (write a simple console.log for now — Phase 9 adds audit trail).
- **`UserTable` component** (`src/components/users/UserTable.tsx`):
  - Columns: Name + email | Org name | Role badge | Status | Last active (if available) | Created | Actions
  - Role badge colors: ADMIN=red, TENANT_ADMIN=blue, TENANT_USER=muted, VISITOR=gray, RESIDENT=green
  - Suspended users: muted row + "Suspended" badge
- **`UserDetailSheet` component** (`src/components/users/UserDetailSheet.tsx`):
  - Shows: user info, org link, role badge, scan count, last login
  - Actions: Change role (NativeSelect with allowed roles) + Deactivate/Reactivate
- **Rebuilt `users/page.tsx`**:
  - Server component fetches initial data from Prisma
  - `<PageHeader title="Users" subtitle="Global user management" />`
  - `FilterBar` with search + org select + role select
  - `<UserTable>` client component

## Steps (ordered)
1. Create `src/app/[locale]/api/admin/users/route.ts` — GET with cross-org query including role + org join.
2. Create `src/app/[locale]/api/admin/users/[id]/route.ts` — GET + PATCH with security guards.
3. Create `src/components/users/UserDetailSheet.tsx`.
4. Create `src/components/users/UserTable.tsx`.
5. Rebuild `src/app/[locale]/(dashboard)/users/page.tsx`.
6. Ensure: admin cannot deactivate or change role of themselves (check against session token — use `isAdminAuthenticated()` context).
7. Run `pnpm turbo lint --filter=admin-dashboard`.
8. Run `pnpm turbo typecheck --filter=admin-dashboard`.
9. Commit: `feat(admin): global user management — cross-org list, role change, deactivate (phase 4)`.

## Scope (out)
- Invite new user from admin panel (deferred)
- Full audit logging (Phase 9)
- Impersonation login (out of scope)

## Acceptance criteria
- [ ] Users list renders cross-org with correct columns.
- [ ] Search by name/email works (server-side).
- [ ] Org filter + role filter + status filter work.
- [ ] Role change PATCH updates the user's role.
- [ ] Deactivate sets `deletedAt`; reactivate clears it.
- [ ] Admin cannot deactivate themselves (returns 403).
- [ ] API returns 401 if unauthenticated.
- [ ] Soft delete enforced — no hard deletes.
- [ ] `pnpm turbo lint --filter=admin-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=admin-dashboard` passes.

## Git commit
```
feat(admin): global user management — cross-org list, role change, deactivate (phase 4)
```
