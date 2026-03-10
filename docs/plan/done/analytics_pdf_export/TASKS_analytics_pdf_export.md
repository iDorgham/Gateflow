# TASKS_analytics_pdf_export

Status: In progress
Last updated: 2026-03-10

## Phase 1 — Backend PDF export API
- [x] Implement `/api/analytics/export-pdf` route (PDFKit)
- [x] Add dependency (`pdfkit`) and lockfile updates
- [x] Lint passes for client-dashboard
- [x] Commit: `4426655`

## Phase 2 — Report layout & UX
- [x] Add `AnalyticsPDFExportButton` component
- [x] Wire button into Analytics header and bottom export row
- [x] Add i18n key `analytics.exportPdf` (en + ar)
- [x] Commit: `03c04e0`

## Phase 3 — Hardening, i18n & tests
- [x] Add API route tests for export-pdf (401/400/200)
- [x] Add client test for download trigger
- [x] Make PDF labels i18n-aware (EN/AR)
- [x] Run `pnpm turbo lint --filter=client-dashboard`
- [x] Run `pnpm --filter=client-dashboard test`
- [x] Commit + push

