# PLAN: marketing_suite — Marketing & Sales Attribution Suite

## Objective
Implement full-funnel marketing attribution by bridging URL-based UTM parameters to physical gate arrival events, including retargeting pixels and CRM webhooks.

## Context
See [IDEA_marketing_suite.md](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/context/IDEA_marketing_suite.md) for full initiative goals and constraints.

## Phases

### Phase 1: UTM Schema, Session Capture & Propagation (COMPLETED)
- **Primary Role**: BACKEND-Database
- **Goal**: Establish the storage and capture mechanism for UTM parameters.
- **Steps**:
  1. Add `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`, `utmTerm` to `VisitorQR` and `ScanLog` models in `schema.prisma`.
  2. Implement `utm-capture.ts` utility to read URL params and sync to `localStorage` or session.
  3. Update `createVisitorQR` logic to propagate UTM data from the session to the database.
- **Acceptance Criteria**:
  - `pnpm prisma db push` successful.
  - Test QR creation with UTM params result in correct DB records.

### Phase 2: Marketing Settings & Retargeting Pixels (CURRENT)
- **Primary Role**: FRONTEND
- **Goal**: Enable organizations to inject tracking pixels on guest landing pages.
- **Steps**:
  1. Add `pixelMetaId` and `pixelGtmId` to `Organization` model.
  2. Create "Marketing Settings" UI in Client Dashboard.
  3. Conditionally render Facebook/Google scripts on the [shortId] route based on organization settings.
- **Acceptance Criteria**:
  - UI works with standard tokens.
  - Script tags appear only on landing pages of organizations with IDs configured.

### Phase 3: Generic Webhook Engine & HubSpot Preset (P1)
- **Primary Role**: BACKEND-API
- **Goal**: Real-time sync of physical arrivals to external CRMs.
- **Steps**:
  1. Create `webhookUrl` and `webhookSecret` settings for organizations.
  2. Implement `emitWebhook` background job triggered by successful scans.
  3. Create a "Physical Visit" event payload spec and HubSpot-specific mapping.
- **Acceptance Criteria**:
  - Successful scan triggers a POST request to configured URL.
  - HMAC signature verification in webhook headers.

### Phase 4: Marketing ROI & Funnel Dashboards (P2)
- **Primary Role**: FRONTEND (Data Viz)
- **Goal**: Visualize the marketing-to-arrival funnel.
- **Steps**:
  1. Create `MarketingAnalytics` component with conversion funnel: `Landing Click` -> `Digital Action` -> `Physical Arrival`.
  2. Add "Top Campaigns" and "Cost Per Visit" charts to the Analytics Hub.
  3. Ensure RTL/LTR parity for new charts.
- **Acceptance Criteria**:
  - Recharts integration is responsive and follows ADS tokens.
  - Funnel logic correctly handles data from Phase 1.

## Status
DRAFT
