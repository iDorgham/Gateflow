# PLAN_analytics_pdf_export — Analytics PDF Export

**Initiative:** analytics_pdf_export  
**App:** client-dashboard (Next.js 14)  
**Page:** `/[locale]/dashboard/analytics`  

---

## 1. Objectives

Add a **PDF export** for the Analytics dashboard that:

- Produces a **shareable, read‑only report** matching the key analytics layout (KPIs + core charts).
- Respects **current filters** (date range, project, gate, unit type).
- Is secure, multi‑tenant aware, i18n‑ready, and consistent with existing CSV export.

Success looks like: A security/marketing lead can click “Export PDF”, wait a few seconds, and get a well‑formatted PDF report they can email or attach to a deck—with correct data and branding.

---

## 2. Phases (overview)

1. **Phase 1 — Backend PDF export API**
   - Add `/api/analytics/export-pdf` route.
   - Reuse analytics filters and summary/series queries.
   - Generate a basic, branded PDF (server‑side renderer or headless browser) and return as `application/pdf`.

2. **Phase 2 — Report layout & UX**
   - Design a concise PDF report layout (cover → KPIs → 2–4 key charts → footer).
   - Wire **“Export PDF”** button(s) on Analytics page.
   - Handle loading, error, and success states (toasts).

3. **Phase 3 — Hardening, i18n & tests**
   - Add unit/integration tests for API and client trigger.
   - Verify multi‑tenancy, i18n, and performance.
   - Document usage and limitations (e.g. max date span).

---

## 3. Dependencies & Constraints

- **Security & multi‑tenancy**
  - Must reuse existing auth (`getSessionClaims` / `requireAuth`) and analytics filters helpers.
  - Scope all queries by `organizationId` and `deletedAt: null`.

- **Rendering technology**
  - Prefer **server‑side PDF generation** (e.g. `@react-pdf/renderer` or html‑to‑pdf/headless Chromium) in the API route.
  - Avoid client‑side PDF generation for security and consistency.
  - No new heavy dependencies without explicit approval; consider reusing any existing PDF tooling if present.

- **Performance**
  - Target under ~5s for typical ranges (7–30 days) on standard datasets.
  - Add basic guardrails (max date span, pagination or truncation for huge orgs).

---

## 4. Detailed phases

### Phase 1 — Backend PDF export API

**Scope (in)**

- New route `apps/client-dashboard/src/app/api/analytics/export-pdf/route.ts`.
- Accept query params: `dateFrom`, `dateTo`, `projectId?`, `gateId?`, `unitType?`, `locale?`.
- Auth via existing analytics helpers; reuse analytics summary + core time‑series queries.
- Implement a minimal PDF report generator (function that accepts a typed DTO and returns a PDF buffer/stream).

**Scope (out)**

- Fancy visual theming—just basic brand header, headings, and tables/charts representation.
- Client‑side buttons/UX (Phase 2).

**Acceptance criteria**

- Route returns:
  - `401` for unauthenticated, `400` for invalid filters, `200` with `Content-Type: application/pdf` for valid requests.
- PDF includes:
  - Org name, date range, filter summary.
  - KPIs: total visits, pass rate, peak hour, denied scans, attributed scans.
  - At least one visits‑over‑time section (table or simple chart representation).
- All queries scoped by `organizationId` and `deletedAt: null`.

---

### Phase 2 — Report layout & UX

**Scope (in)**

- Design the PDF sections (can align with SuperDesign draft):
  - Cover/header with logo + title + date range.
  - KPI band.
  - 2–4 key sections (Visits over time, Heatmap summary, Incidents, UTM/marketing).
  - Footer with generated timestamp and workspace name.
- Add **“Export PDF”** button(s) to Analytics page:
  - Primary placement near existing CSV export at bottom.
  - Optional secondary icon button in header toolbar.
- Implement client‑side call to `export-pdf` API:
  - Shows loading state.
  - On success, triggers download `<a download>` with a good filename (`analytics-YYYY-MM-DD.pdf`).
  - Error toast on failure.

**Scope (out)**

- Per‑chart custom export toggles.
- Per‑tenant custom branding (beyond current theme/logo).

**Acceptance criteria**

- Buttons only enabled when user is authenticated and filters are valid.
- PDF download works in modern browsers (Chrome, Edge, Safari).
- Layout is readable on A4/Letter (no cropped content).

---

### Phase 3 — Hardening, i18n & tests

**Scope (in)**

- Add tests:
  - Unit tests for the `export-pdf` route (happy path, invalid filters, unauthorized).
  - At least one client test mocking fetch to ensure download code paths don’t throw.
- Ensure strings in the PDF are i18n‑aware (support EN/AR via existing translation files).
- Add basic monitoring/logging:
  - Log PDF generation failures (without leaking sensitive data).
  - Optionally log generation duration for performance tracking.

**Scope (out)**

- Centralized analytics events for export usage (can be a follow‑up task).

**Acceptance criteria**

- `pnpm turbo lint --filter=client-dashboard` passes.
- `pnpm turbo test --filter=client-dashboard` passes (including new tests).
- Manual smoke test:
  - Security mode and Marketing mode each generate PDFs with appropriate content.
  - AR locale PDFs render translated labels and RTL‑safe layout where applicable.

