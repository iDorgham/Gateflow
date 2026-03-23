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

### Phase 2: Marketing Settings & Retargeting Pixels (COMPLETED)
- **Primary Role**: FRONTEND
- **Goal**: Enable organizations to inject tracking pixels on guest landing pages.
- **Steps**:
  1. Add `pixelMetaId` and `pixelGtmId` to `Organization` model.
  2. Create "Marketing Settings" UI in Client Dashboard.
  3. Conditionally render Facebook/Google scripts on the [shortId] route based on organization settings.
- **Acceptance Criteria**:
  - UI works with standard tokens.
  - Script tags appear only on landing pages of organizations with IDs configured.

### Phase 3: Generic Webhook Engine & HubSpot Preset (COMPLETED)
- **Primary Role**: BACKEND-API
- **Goal**: Real-time sync of physical arrivals to external CRMs.
- **Steps**:
  1. Create `webhookUrl` and `webhookSecret` settings for organizations.
  2. Implement `emitWebhook` background job triggered by successful scans.
  3. Create a "Physical Visit" event payload spec and HubSpot-specific mapping.
- **Acceptance Criteria**:
  - Successful scan triggers a POST request to configured URL.
  - HMAC signature verification in webhook headers.

### Phase 4: Marketing ROI & Funnel Dashboards (COMPLETED)
- **Primary Role**: FRONTEND (Data Viz)
- **Goal**: Visualize the marketing-to-arrival funnel.
- **Steps**:
  1. Add `ShortLinkClick` model to track landing page opens.
  2. Update short-link resolver to log visits with UTM data.
  3. Implement `MarketingFunnel` premium component with 3-stage conversion tracking.
  4. Integrate into Analytics Hub with ROI calculator.
- **Acceptance Criteria**:
  - Funnel logic correctly handles data from Link Clicks to Scanned.
  - Recharts and Framer Motion integration is responsive and follows ADS tokens.

### Phase 5: Advanced Attribution & Export (COMPLETED)
- **Primary Role**: FULLSTACK
- **Goal**: Detailed campaign analysis and multi-format reporting.
- **Steps**:
  1. **UTM Source/Medium Matrix**: Create a heatmap or table showing conversion rates per source/medium.
  2. **Campaign-Specific Funnels**: Update filters to allow viewing the funnel for a single UTM campaign.
  3. **Attribution Export**: Implement CSV/PDF export for marketing reports.
  4. **Persona Analysis**: Correlate UTM traffic with visitor types (Resident/Guest/Vendor).
- **Acceptance Criteria**:
  - Exported files contain accurate UTM and conversion data.
  - UI remains performant with filtered datasets.


## Status
IN_PROGRESS (Phases 1-5 Completed)
