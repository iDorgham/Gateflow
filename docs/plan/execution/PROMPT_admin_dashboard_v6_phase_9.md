# Phase 9: Polish + Tests + PRD Update

## Primary role
QA

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/admin-dashboard`
- **Refs**:
  - All pages built in Phases 1–8
  - `apps/admin-dashboard/package.json` — add Jest config
  - `docs/PRD_v6.0.md` — update admin dashboard completion %
  - `apps/client-dashboard/jest.config.js` — Jest config reference
  - `@gate-access/ui` — design tokens reference

## Goal
Final polish pass: consistent design tokens, dark mode checks, `PageHeader` on all remaining pages, `space-y-6` section spacing, add `typecheck` + `test` scripts, write API endpoint tests for the 5 main routes, update PRD v6 admin dashboard status.

## Scope (in)

### Visual polish
- **Apply `PageHeader`** to any page not yet using it:
  - `scans/page.tsx`, `gates/page.tsx`, `projects/page.tsx`, `audit-logs/page.tsx`
- **Consistent section spacing**: wrap page content in `<div className="space-y-6">` on all pages
- **Dark mode check**: verify all new components use `text-foreground`, `bg-card`, `border-border` — no hardcoded `text-slate-900` or `bg-white`
- **Typography**: ensure all page titles use `text-xl font-black uppercase tracking-tight` via `PageHeader`
- **Sidebar active indicator**: verify the existing sidebar active state still works after Phase 6 Finance addition

### Scripts + testing
- **Add scripts to `package.json`**:
  ```json
  "typecheck": "tsc --noEmit",
  "test": "jest"
  ```
- **Add Jest config** (`jest.config.js` or inline in `package.json`):
  - `testEnvironment: 'node'`
  - `transform: { '^.+\\.tsx?$': ['ts-jest', {}] }`
  - Add `ts-jest`, `jest`, `@types/jest` to devDependencies
- **API endpoint tests** (`src/app/[locale]/api/admin/`):
  - `health/route.test.ts` — mock Prisma, verify shape of response
  - `organizations/route.test.ts` — verify 401 without auth, verify list shape
  - `users/route.test.ts` — verify 401, verify PATCH prevents self-deactivation
  - `analytics/route.test.ts` — verify 401, verify response has scanTrend/orgGrowth
  - `finance/route.test.ts` — verify 401, verify MRR calculation
- Each test file: `export {}` at top (module isolation), mock `@/lib/admin-auth` to control auth state

### PRD update
- Open `docs/PRD_v6.0.md`
- Find the admin dashboard status row (was "~15% complete")
- Update to "~85% complete (phases 1–8 done; Stripe integration + MFA pending)"
- Update any status table or progress indicator in the PRD that references admin dashboard

## Steps (ordered)
1. Apply `PageHeader` to `scans/page.tsx`, `gates/page.tsx`, `projects/page.tsx`, `audit-logs/page.tsx`.
2. Add `space-y-6` wrapper to all pages that don't have it.
3. Dark mode audit: search for `text-slate-*`, `text-gray-*`, `bg-white`, `bg-gray-*` in new admin components — replace with design tokens.
4. Add `typecheck` + `test` scripts to `package.json`.
5. Install Jest deps: `pnpm add -D jest ts-jest @types/jest --filter=admin-dashboard`.
6. Create `jest.config.js`.
7. Write 5 API test files (minimal: auth check + response shape).
8. Run `pnpm turbo typecheck --filter=admin-dashboard` — fix any remaining type errors.
9. Run `pnpm turbo test --filter=admin-dashboard` — all tests pass.
10. Update `docs/PRD_v6.0.md` admin dashboard status.
11. Run `pnpm turbo lint --filter=admin-dashboard` — passes.
12. Commit: `feat(admin): polish, tests, typecheck, PRD update — admin dashboard phase 9 complete`.

## Scope (out)
- E2E browser tests (Playwright — deferred)
- 100% test coverage
- Component snapshot tests
- Stripe real integration

## Acceptance criteria
- [ ] `PageHeader` applied to all dashboard pages (8+ pages).
- [ ] All new components use design tokens — no hardcoded `slate-900` or `bg-white`.
- [ ] `pnpm turbo typecheck --filter=admin-dashboard` passes with 0 errors.
- [ ] `pnpm turbo test --filter=admin-dashboard` passes (5 test files, ≥ 10 test cases).
- [ ] Every API test verifies 401 without auth.
- [ ] `docs/PRD_v6.0.md` updated — admin dashboard shows ≥ 85% completion.
- [ ] `pnpm turbo lint --filter=admin-dashboard` passes.

## Git commit
```
feat(admin): polish, tests, typecheck, PRD update — admin dashboard complete (phase 9)
```
