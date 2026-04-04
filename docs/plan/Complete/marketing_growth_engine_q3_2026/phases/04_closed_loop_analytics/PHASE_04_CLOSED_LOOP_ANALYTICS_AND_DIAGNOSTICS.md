# Phase 04 Deliverable: Closed-Loop Analytics and Diagnostics

**Plan:** `marketing_growth_engine_q3_2026`  
**Phase:** 04 — Closed-loop campaign-to-first-scan analytics  
**Status:** Done (report path + diagnostics + export verification)

## 1) Closed-loop report path delivered

Implemented:

- `apps/client-dashboard/src/app/api/analytics/campaign-first-scan/route.ts`

This endpoint is org-scoped and reports:

- campaign
- qualified leads
- first scans
- lead->first-scan linkage %
- attribution gap count

## 2) Attribution diagnostics available

Endpoint diagnostics now include:

- `qualifiedWithoutCampaign`
- `scansWithoutCampaign`
- `campaignsMissingFirstScan`

These diagnostics support QA checks for incomplete attribution chains.

## 3) Dashboard/report flow integration

- Added `CampaignFirstScanLinkage` analytics card to dashboard marketing mode.
- Added API wiring in analytics client/layout exports.
- Updated marketing CSV export (`/api/analytics/export/marketing`) with:
  - qualified lead and first scan columns
  - linkage and attribution gap columns
  - diagnostics summary rows

## 4) Verification

- `pnpm turbo lint --filter=client-dashboard --filter=marketing`
- `pnpm --filter client-dashboard exec tsc --noEmit`
- `pnpm --filter marketing exec tsc --noEmit`
- `pnpm turbo test --filter=client-dashboard`
- `pnpm preflight`

All completed successfully for this phase execution.
