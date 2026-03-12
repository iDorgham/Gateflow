# Phase 3: Organization Management (Full CRUD)

## Primary role
FULLSTACK

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/admin-dashboard`
- **Refs**:
  - `apps/admin-dashboard/src/app/[locale]/(dashboard)/organizations/page.tsx` — partial implementation (list + search exists)
  - `apps/admin-dashboard/src/lib/admin-auth.ts`
  - `packages/db/prisma/schema.prisma` — Organization model (id, name, email, plan, deletedAt, createdAt)
  - `@gate-access/ui` — Sheet, SheetContent, SheetHeader, SheetTitle, Button, Badge, Input, NativeSelect, cn
  - `apps/client-dashboard/src/app/[locale]/dashboard/residents/contacts/page.tsx` — reference for list + sheet pattern

## Goal
Complete the organizations page: full data table with all org stats, server-side search+filter, detail side sheet showing users/gates/scans counts and a suspend/restore action. API routes for listing and updating.

## Scope (in)
- **API routes** (`src/app/[locale]/api/admin/organizations/`):
  - `route.ts` — `GET`: list orgs with `?search=`, `?plan=`, `?status=` (active/suspended), `?page=`, `?pageSize=25`; returns total count + data with `_count.users`, `_count.gates`, `_count.scanLogs`
  - `[id]/route.ts` — `GET`: single org detail (full stats); `PATCH`: `{ action: 'suspend' | 'restore' }` sets/clears `deletedAt`
- **`OrgTable` component** (`src/components/organizations/OrgTable.tsx`):
  - Client component
  - Columns: Org name + email | Plan badge | Users | Gates | Scans | Status | Created | Actions
  - Row hover → show Edit/View button (opens detail sheet)
  - "Suspended" orgs show with muted styling + "Suspended" badge
- **`OrgDetailSheet` component** (`src/components/organizations/OrgDetailSheet.tsx`):
  - Sheet from `@gate-access/ui` (renders conditionally, not via Radix open prop — use `{open && <Sheet>...}` pattern)
  - Shows: org name, plan, email, stats (users, gates, total scans, scans this month)
  - Action buttons: "Suspend org" (red) / "Restore" (green) depending on `deletedAt` state
  - PATCH call via `csrfFetch` (or plain fetch — no CSRF needed for admin, use `fetch` with cookie)
- **Rebuilt `organizations/page.tsx`**:
  - Server component loads initial data
  - `<PageHeader title="Organizations" subtitle="..." actions={<CreateOrgButton />} />`
  - `FilterBar` with search input + plan select + status select
  - Renders `<OrgTable>` client component with initial data
  - Pagination (prev/next) via URL params

## Steps (ordered)
1. Create `src/app/[locale]/api/admin/organizations/route.ts` — GET with search, plan, status, pagination filters.
2. Create `src/app/[locale]/api/admin/organizations/[id]/route.ts` — GET detail + PATCH suspend/restore.
3. Create `src/components/organizations/OrgDetailSheet.tsx`.
4. Create `src/components/organizations/OrgTable.tsx`.
5. Rebuild `src/app/[locale]/(dashboard)/organizations/page.tsx` — server component calling Prisma directly with the filter params from `searchParams`.
6. Run `pnpm turbo lint --filter=admin-dashboard`.
7. Run `pnpm turbo typecheck --filter=admin-dashboard`.
8. Commit: `feat(admin): complete organizations management — table, detail sheet, suspend/restore (phase 3)`.

## Scope (out)
- Create new org from admin (complex, deferred)
- Billing details per org (Phase 6)
- Impersonation (out of scope for MVP)

## Acceptance criteria
- [ ] Org list renders with all columns and correct data.
- [ ] Search by name filters results (server-side).
- [ ] Plan filter (FREE/PRO/ENTERPRISE/ALL) works.
- [ ] Status filter (active/suspended) works.
- [ ] Suspend action sets `deletedAt`, restore clears it — verified in DB.
- [ ] Detail sheet shows users + gates + scans counts.
- [ ] API returns 401 if unauthenticated.
- [ ] `pnpm turbo lint --filter=admin-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=admin-dashboard` passes.

## Git commit
```
feat(admin): complete organizations management — table, detail sheet, suspend/restore (phase 3)
```
