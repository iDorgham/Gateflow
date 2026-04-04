# IDEA: marketing_suite — Marketing & Sales Attribution Suite

## Goal

Close the loop between digital marketing spend and physical entry events. This initiative enables property managers and event organizers to see exactly which marketing campaigns (Facebook, Google, LinkedIn) resulted in actual physical attendance at their gates.

## Background

Currently, GateFlow tracks visitor scans and QR creation, but it treats all visitors as "organic." We lack the ability to attribute a visitor to a specific UTM source, medium, or campaign. By capturing UTM parameters from the initial "Guest Invite" or "Public Registration" landing pages and carrying them through to the `ScanLog`, we can provide a "Cost-per-Physical-Visit" metric—the Holy Grail for event marketers.

## Constraints

- **Privacy**: No PII (Personally Identifiable Information) can be sent to external pixels (Facebook/Google) without explicit consent, or should be hashed.
- **Performance**: Funnel calculations (Cost-per-visit) must be pre-aggregated or cached to avoid heavy deep joins on `ScanLog` during dashboard rendering.
- **Multi-tenancy**: Marketing configurations (Pixel IDs, Webhook URLs) must be strictly scoped to the `organizationId`.
- **Latency**: Webhook delivery must be asynchronous (background job) to ensure it doesn't slow down the scan verification process.

## Scope

### Phase 1: UTM Foundation & Schema (P0)

- Update `VisitorQR` and `ScanLog` schemas to store `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`, and `utmTerm`.
- Implement a `utmCapture` utility in the Resident Portal and Client Registration pages to read from URL search params and store in session/local storage.

### Phase 2: Retargeting & Pixel Engine (P1)

- Add "Marketing Settings" to the Client Dashboard to allow organizations to input their Meta Pixel ID and Google Tag Manager ID.
- Implement conditional injection of these tags on the Public Guest Landing pages (`apps/resident-portal/src/app/[locale]/s/[shortId]`).

### Phase 3: CRM Webhooks & Integration (P1)

- Build a generic Webhook Engine that triggers on `SCAN_SUCCESS`.
- Allow organizations to configure a Webhook URL and Secret in the dashboard.
- Create a Hubspot-specific preset for "Physical Visit" custom events.

### Phase 4: Funnel Analytics & ROI Dashboard (P2)

- Create a new "Marketing ROI" tab in the Analytics Hub.
- Visualize conversion rates: `Link Click` -> `Digital Check-in` -> `Physical Arrival`.
- Integrate cost-per-click data (via manual entry or API) to calculate `Cost-per-Arrival`.

## Success Criteria

- [ ] `VisitorQR` records contain UTM metadata from the referring URL.
- [ ] `ScanLog` inherits UTM data, allowing for Campaign-based filtering of arrival logs.
- [ ] Meta/Google pixels successfully fire "Lead" or "PhysicalVisit" events when a QR is scanned.
- [ ] HubSpot CRM receives a webhook event when a tagged visitor arrives at a gate.
- [ ] Client Dashboard shows a "Top Marketing Channels" chart based on physical arrivals.
