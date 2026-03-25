# PLAN: Domain Migration to .site (2026)

Initiative: `domain_migration_2026`
Status: ✅ **COMPLETE**

## Phased Approach

### Phase 1: AI Memory & Master Documentation (Low Risk)

- [x] Update `.ai-memory/architecture.md` with new `*.site` domains.
- [x] Update `docs/PRD_v7.0.md` — replace all 300+ instances of `.io`.
- [x] Update `README.md` and basic repo docs.
- [x] Auto-commit: `docs(site): update core documentation and AI memory`.

### Phase 2: App Code & Constants (Medium Risk)

- [x] Update `apps/client-dashboard/src/lib/constants.ts` (if it exists).
- [x] Update `apps/marketing/config/site.ts`.
- [x] Update API routes (tags, email, analytics) to use `.site` in fallbacks.
- [x] Resolve all hardcoded `gateflow.site` strings in JSX/TSX.
- [x] Auto-commit: `feat(site): migrate code constants to .site domain`.

### Phase 3: Environment & Deployment (High Risk)

- [x] Update `.env.example` with new domains.
- [x] Run `scripts/check-env.js` to verify integrity.
- [x] GitHub Actions: `lighthouse.yml` and others.
- [x] Final sweep for `gateflow.site` across entire repo.
- [x] Auto-commit: `ci(site): update environments and CI configs`.

## Technical Notes

- QR HMAC signatures use `qr_id` and `secret`, not current link domain, so no breakage expected.
- Deep links in emails and WhatsApp shares must be updated to avoid 404s after DNS switch.

## Verification

- `grep -r "gateflow.io" .` is empty (confirmed 2026-03-25).
