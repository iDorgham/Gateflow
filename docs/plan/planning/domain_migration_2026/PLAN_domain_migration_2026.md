# PLAN: Domain Migration to .site (2026)

Initiative: `domain_migration_2026`
Status: **DRAFT**

## Phased Approach

### Phase 1: AI Memory & Master Documentation (Low Risk)

- [ ] Update `.ai-memory/architecture.md` with new `*.site` domains.
- [ ] Update `docs/PRD_v7.0.md` — replace all 300+ instances of `.io`.
- [ ] Update `README.md` and basic repo docs.
- [ ] Auto-commit: `docs(site): update core documentation and AI memory`.

### Phase 2: App Code & Constants (Medium Risk)

- [ ] Update `apps/client-dashboard/src/lib/constants.ts` (if it exists).
- [ ] Update `apps/marketing/config/site.ts`.
- [ ] Update API routes (tags, email, analytics) to use `.site` in fallbacks.
- [ ] Resolve all hardcoded `gateflow.site` strings in JSX/TSX.
- [ ] Auto-commit: `feat(site): migrate code constants to .site domain`.

### Phase 3: Environment & Deployment (High Risk)

- [ ] Update `.env.example` with new domains.
- [ ] Run `scripts/check-env.js` to verify integrity.
- [ ] GitHub Actions: `lighthouse.yml` and others.
- [ ] Final sweep for `gateflow.site` across entire repo.
- [ ] Auto-commit: `ci(site): update environments and CI configs`.

## Technical Notes

- QR HMAC signatures use `qr_id` and `secret`, not current link domain, so no breakage expected.
- Deep links in emails and WhatsApp shares must be updated to avoid 404s after DNS switch.

## Verification

- `grep -r "gateflow.site" .` should be empty (excluding .ai-memory backup).
