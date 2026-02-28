# GateFlow — MVP Launch & Resident Portal Plan

**Created:** February 27, 2026  
**Source:** `ALL_TASKS_BACKLOG.md`, `PROJECT_PROGRESS_DASHBOARD.md`, `RESIDENT_PORTAL_SPEC.md`  
**Status:** In progress

---

## Plan Summary

GateFlow MVP is ~98% complete. Several backlog items (CSRF on project switch, scan export project filter, supervisor override auth, recharts) are **already implemented**. This plan prioritizes: (1) MVP verification and remaining polish; (2) unit–resident linking for Phase 2; (3) resident portal integration and completion.

---

## Current State (Verified)

| Item | Status | Notes |
|------|--------|------|
| CSRF on ProjectSwitcher | ✅ Done | `x-csrf-token` sent, validated in `/api/project/switch` |
| recharts | ✅ Done | In client-dashboard package.json |
| Scan export project filter | ✅ Done | `project` param in export route and page |
| Supervisor override auth | ✅ Done | Scanner sends Bearer token, `getSessionClaims` validates |
| Admin org row navigation | ✅ Done | Uses Next.js `Link` (docs outdated) |
| Resident schema (Unit, VisitorQR, AccessRule, ResidentLimit) | ✅ Done | In Prisma |
| Quota engine (checkAndConsumeQuota, canCreateOpenQR) | ✅ Done | packages/db/quota |
| Resident APIs (units, quota, visitors) | ✅ Done | client-dashboard API routes |
| QR validation for VISITOR/OPEN | ✅ Done | `/api/qrcodes/validate` |
| Resident-portal app | ⚠️ Exists | Standalone app, uses @gate-access/db directly |
| Unit–user linking UI | ❌ Incomplete | Units page has form but resident assignment flow unclear |

---

## Phases

### Phase 1: MVP Verification & Polish
- **Scope:** Verify migrations, fix any remaining issues, ensure builds pass.
- **Deliverables:**
  - Run `prisma migrate deploy` (or verify migrations applied)
  - Replace onboarding `window.location.href` with router if appropriate
  - Ensure `pnpm turbo build` passes
  - Document verification steps for staging deployment
- **Depends on:** None
- **Test criteria:** `pnpm turbo build`, `pnpm turbo lint`, `pnpm turbo typecheck` pass

### Phase 2: Unit–Resident Linking
- **Scope:** Admin/tenant UI to link a User (RESIDENT role) to a Unit.
- **Deliverables:**
  - Units page: "Link Resident" flow (select user, assign to unit)
  - API: `PATCH /api/units/:id` to set `userId`
  - Enforce RESIDENT role for linked users
  - Resident portal: require linked unit to access
- **Depends on:** Phase 1
- **Test criteria:** Admin can link resident to unit; resident sees unit in portal

### Phase 3: Resident Portal Integration
- **Scope:** Ensure resident-portal works with client-dashboard auth or consolidate.
- **Deliverables:**
  - Resident-portal auth: shared cookie/JWT flow or SSO from client-dashboard
  - Resident dashboard route in client-dashboard: `/dashboard/residents` (self-service) for RESIDENT role
  - Redirect RESIDENT users to resident self-service on login
- **Depends on:** Phase 2
- **Test criteria:** RESIDENT user logs in → sees resident dashboard with quota/visitors

### Phase 4: ResidentLimit & Open QR Defaults
- **Scope:** Org-level ResidentLimit configuration and seeding.
- **Deliverables:**
  - Workspace settings: ResidentLimit CRUD (unit type → monthlyQuota, canCreateOpenQR)
  - Seed default ResidentLimit rows for new orgs
  - Resident portal: display Open QR availability based on canCreateOpenQR
- **Depends on:** Phase 2
- **Test criteria:** Org can configure quotas; resident sees correct Open QR eligibility

### Phase 5: Smoke Tests & Deployment Prep
- **Scope:** Automated and manual verification.
- **Deliverables:**
  - Smoke test script for critical paths (login, scan, export)
  - Staging deployment checklist
  - Update PROJECT_PROGRESS_DASHBOARD with completed items
- **Depends on:** Phases 1–4
- **Test criteria:** Smoke tests pass; deployment docs updated

---

## Dependencies

| Phase | Files / Packages |
|-------|------------------|
| 1 | `apps/client-dashboard/`, `packages/db/`, `apps/admin-dashboard/` |
| 2 | `apps/client-dashboard/src/app/[locale]/dashboard/residents/units/`, `api/units/` |
| 3 | `apps/client-dashboard/`, `apps/resident-portal/`, auth flows |
| 4 | `packages/db/`, workspace settings, seed |
| 5 | All apps, `docs/` |

---

## Risks / Blockers

- **Resident-portal vs client-dashboard:** Two apps (resident-portal on 3004, client-dashboard on 3001). Decision: either (a) keep separate with shared auth, or (b) move resident self-service into client-dashboard `/dashboard/residents`.
- **Role model:** Current schema uses Role (custom) not UserRole enum. RESIDENT role must exist in seed/data.
- **Build env:** `ENCRYPTION_MASTER_KEY` must be set for client-dashboard production build (`openssl rand -hex 32`).
- **Expo apps:** scanner-app and resident-mobile use `expo export`; full `pnpm turbo build` may need `--filter=!scanner-app --filter=!resident-mobile` until Expo build config is finalized.

## Phase 1 Progress (Feb 27, 2026)

**Completed fixes:**
- Admin dashboard: Role model migration (roleId, find role by name)
- Admin: Plan enum (FREE/PRO only), remove ENTERPRISE
- Admin: monitoring i18n keys, i18n plural handling
- Client-dashboard: team actions (roleId), workspace role create
- Client-dashboard: analytics roleCounts (role.name)
- Client-dashboard: locale 'ar' → 'ar-EG', DropdownMenuContent side prop
- Client-dashboard: scans export generator (function expression)
- Client-dashboard: bulk-sync Set iteration (Array.from)
- Client-dashboard: auth tests (mock role object)
- Override: claims.roleName
- Packages/types: UserRole const, QRCodeType VISITOR/OPEN, qr-validate 'denied'

**Remaining for full build:** Set ENCRYPTION_MASTER_KEY in .env.local for production build.
