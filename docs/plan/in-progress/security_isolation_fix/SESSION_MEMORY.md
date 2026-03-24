# SESSION_MEMORY — security_isolation_fix

## Active State

- **Phase 1:** ✅ COMPLETED — commit `0e7ee3c`
- **Phase 2:** ✅ COMPLETED — commit `72bfec8` — fix(security): CRM contacts & units org isolation confirmed
- **Next action:** Start Phase 3 — QR Codes & Workspace Exports

## Cross-Session Decisions

1. **Static scanner is a naive regex tool** — `ralph-skill-discover.js` checks if `organizationId` appears inline in `findMany({...})`. It cannot trace variable references or understand nested Prisma relation filters (e.g., `qrCode: { organizationId }`). Use `// ignore-security-guard` to suppress false positives after confirming actual security.

2. **ScanLog has no direct `organizationId` field** — Scoping is always via `qrCode.organizationId` (nested relation). This is the correct and only approach for ScanLog queries. Always add `// ignore-security-guard` with explanation.

3. **`gateWhere` / `gateFilter` variable pattern** — Both `api/gates/route.ts` and `dashboard/gates/page.tsx` build the org-scoped where object as a named variable before passing to `findMany`. This is secure but triggers the scanner. Add `// ignore-security-guard` for these.

## Discovered Gotchas

- `dashboard/scans/page.tsx` had a missing null check on `claims` — `const orgId = claims.orgId` on line 54 (pre-fix) would crash if session was absent. Fixed by adding `if (!claims?.orgId) redirect('/login')` and importing `redirect` from `next/navigation`.
- The plan was in `docs/plan/planned/` — moved to `docs/plan/in-progress/` as lifecycle requires.

## Phase 1 Files Touched

- `apps/client-dashboard/src/app/[locale]/dashboard/scans/page.tsx` — Added null check + redirect + `ignore-security-guard`
- `apps/client-dashboard/src/app/api/gates/route.ts` — Added `ignore-security-guard`
- `apps/client-dashboard/src/app/[locale]/dashboard/gates/page.tsx` — Added `ignore-security-guard`
- `apps/client-dashboard/src/app/api/scans/export/route.ts` — Added `ignore-security-guard`
- `docs/plan/in-progress/security_isolation_fix/` — Plan moved from `planned/`

## Test / Verification Status

- `pnpm turbo typecheck --filter=client-dashboard` → ✅ 2/2 tasks successful
- `pnpm turbo lint --filter=client-dashboard` → ✅ 2/2 tasks successful (1 pre-existing warning in unrelated test file)
- `node scripts/ralph-skill-discover.js` → Gates/scans files cleared from Phase 1 scope

## Context Budget (this session)

- L0: git log ✅
- L1: TASKS (none existed) ✅
- L2: PLAN ✅
- L3: PROMPT_phase_1 ✅
- L4: schema (ScanLog model only) ✅
- L5: SESSION_MEMORY (created this session)

## Remaining Phases

- Phase 3: `api/qrcodes/*`, `api/workspace/export/*`, `api/resident/visitors/*`
- Phase 4: `api/analytics/export/route.ts`, `api/incidents/route.ts`
- Phase 5: Rerun discovery with zero violations
- Phase 6: Gate-Assignment Management UI

## Phase 2 Notes

- `api/contacts/[id]/tags/route.ts` & `api/contacts/tags/bulk/route.ts`: `contactTag.findMany` has no direct `organizationId` — it's a pure junction table. Security is enforced via pre-validated `contactId`/`tagId` foreign keys (both filtered by org before use). Pattern: **pre-validated FK** = safe, add `ignore-security-guard`.
- All 6 CRM routes were already secure; no data-path changes required.
