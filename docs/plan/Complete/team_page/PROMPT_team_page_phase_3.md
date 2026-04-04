# Pro Prompt Phase 3: Team Page (Member Management & RBAC)

### Primary role

[FRONTEND | BACKEND-Database]

### Preferred tool

- [x] OpenCode CLI — Scaffold the management table
- [ ] Claude CLI — (for logic verification)

### Context

- **Project**: GateFlow — Zero-Trust platform (Turborepo)
- **App**: client-dashboard (3001) for the core UI
- **Package**: db for Prisma schema relations
- **Rules**: pnpm only; 100% multi-tenant isolation; use desaturated grays (#18191a / #1f1f21).
- **Refs**: `CLAUDE.md`, `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsKPICard.tsx`

### Goal

Implement the dedicated Team management page with high-density member tables and role editing per organization.

### Scope (in)

- **New Page:** `apps/client-dashboard/src/app/[locale]/dashboard/team/page.tsx`.
- **UI Components:** `TeamMembersTable.tsx`, `AddMemberModal.tsx` (using `EditPanel.tsx` pattern).
- **Member Table:** Display name, email, current role, and "Joined" date.
- **Role Management:** Inline dropdown to change user roles (Admin, Moderator, Operator, Viewer).
- **Invitation Flow:** Simple "Invite" modal that saves a new (pending) User to the database scoped to the organization.
- **Soft Deletes:** Ability to "Remove" a user (sets `deletedAt` to NOW()).

### Scope (out)

- No user-facing permissions configuration (roles are fixed presets for now).
- No actual email invitation system (just manual DB entry for now).

### Steps (ordered)

2. **Page Scaffold:** Create the `/dashboard/team` route. Add it to `NAV_ITEMS` in `dashboard-layout.tsx`.
3. **Table Component:** Create `apps/client-dashboard/src/components/dashboard/team/TeamMembersTable.tsx`. Use `@tanstack/react-table` if appropriate, or standard ADS table layout.
4. **API:** Create `PATCH /api/team/members` to update roles and `DELETE /api/team/members` for soft removals.
5. **Logic:** Ensure `GET /api/team/members` from Phase 1 is fully integrated to populate the table.
6. **Polish:** Implement "Member Status" badges (Active, Pending) with subtle ADS colors.
7. Run `pnpm turbo lint --filter=client-dashboard` and `pnpm turbo typecheck --filter=client-dashboard`.

### Acceptance criteria

- [ ] Users can browse to `/dashboard/team` from the sidebar.
- [ ] The member list correctly displays all users in the current Org.
- [ ] Changing a role in the dropdown persists to the database.
- [ ] "Remove Member" accurately sets `deletedAt` and filters the user from future lists.
- [ ] Table follows high-density patterns (0 raw hexes).

### Files likely touched

- `apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx` (sidebar menu)
- `apps/client-dashboard/src/app/[locale]/dashboard/team/page.tsx`
- `apps/client-dashboard/src/components/dashboard/team/TeamMembersTable.tsx`
- `apps/client-dashboard/src/app/api/team/members/route.ts` (expansion)
