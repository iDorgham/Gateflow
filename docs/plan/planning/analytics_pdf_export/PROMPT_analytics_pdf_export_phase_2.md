## Phase 2: Report layout & UX (wire Export PDF button)

### Primary role
FRONTEND

### Skills to load
- [ ] react
- [ ] tailwind
- [ ] gf-i18n

### MCP to use
| MCP | When |
|-----|------|
| cursor-ide-browser | Smoke-test download flow (optional) |

### Preferred tool
- [x] Cursor (default)

### Context
- Analytics page: `apps/client-dashboard/src/app/[locale]/dashboard/analytics/analytics-client.tsx`
- CSV export pattern: `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsAudienceExportButton.tsx`
- PDF route: `/api/analytics/export-pdf`

### Goal
Add an “Export PDF” button to the Analytics UI that calls the server PDF export endpoint using the current filters and triggers a file download.

### Scope (in)
- Add `AnalyticsPDFExportButton` component (client-side)
- Wire into analytics header toolbar + bottom export row
- Add i18n key `analytics.exportPdf` (en + ar)

### Scope (out)
- Advanced toasts/analytics events (Phase 3 / follow-up)

### Steps (ordered)
1. Create `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsPDFExportButton.tsx`:
   - Build URL from filters: `dateFrom`, `dateTo`, `projectId`, `gateId`, `unitType`
   - `fetch(url, { credentials: 'include' })`
   - Convert to `blob`, createObjectURL, click `<a download>`
   - Loading state uses existing `analytics.exporting`
2. Export from `apps/client-dashboard/src/components/dashboard/analytics/index.ts`.
3. Use in `analytics-client.tsx`:
   - Header toolbar
   - Bottom export row next to CSV
4. Add i18n:
   - `packages/i18n/src/locales/en.json`: `dashboard.analytics.exportPdf`
   - `packages/i18n/src/locales/ar-EG.json`: `dashboard.analytics.exportPdf`
5. Run:
   - `pnpm turbo lint --filter=client-dashboard`

### Acceptance criteria
- [ ] Clicking “Export PDF” downloads `analytics-YYYY-MM-DD-to-YYYY-MM-DD.pdf`
- [ ] Works in Chrome/Edge/Safari
- [ ] Loading state shown during fetch
- [ ] `pnpm turbo lint --filter=client-dashboard` passes

