# Pro Prompt — marketing_suite Phase 4

## Phase 4: Marketing ROI & Funnel Dashboards (P2)

### Primary role
FRONTEND (Data Viz)

### Preferred tool
- [x] OpenCode CLI — generation of complex React components.
- [x] SuperDesign — the funnel visualization needs to look premium.

### Context
- **Project**: GateFlow — Zero-Trust (ADS Design System)
- **Goal**: Visualize the end-to-end marketing funnel from digital click to physical gate arrival.
- **Rule**: ADS tokens (`var(--ds-...)`) and RTL-ready layout.
- **Existing**: `ScanLog` now contains UTM parameters (from Phase 1).

### Goal
Implement a strategic "Marketing ROI" dashboard that visualizes conversion rates across the marketing funnel using high-fidelity charts.

### Scope (in)
- Create `apps/client-dashboard/src/components/analytics/MarketingFunnel.tsx` using `Recharts` or a custom SVG funnel component.
- Add a new "Attribution" or "Marketing" tab to the Analytics Hub.
- Visualize top campaigns, top sources, and conversion rates: `QR Landings` -> `Scans`.
- Implement a simple "Manual Cost" input to calculate the estimated `Cost per Arrival`.

### Scope (out)
- Automatic API integrations with Facebook/Google Ads (keep it to manual cost input for now).
- PDF export of this specific dashboard (covered by general analytics export).

### Steps (ordered)
1. **Design Pass**:
   - Run `superdesign iterate-design-draft` to design the attribution funnel and campaign leaderboard.
   - Use `gf-ads-data-density` tokens for professional analytics scaling.
2. **Data Aggregation**:
   - Create a server action or API route in `client-dashboard` that aggregates `ScanLogs` by `utmSource` and `utmCampaign`.
   - Ensure the counts are scoped to the current active project.
3. **Funnel Implementation**:
   - Implement the `MarketingFunnel` component.
   - Use `AreaChart` or `BarChart` from `Recharts` for temporal attribution trends.
4. **Integration**:
   - Add the new components to the main Analytics Hub.
   - Ensure locales for "Source", "Medium", "Campaign" are added to `en.json` and `ar.json`.
5. **Verification**:
   - Verify that data with different UTMs shows up in the charts correctly.
   - Confirm RTL layout (Arabic) mirrors the charts and legends properly.

### Acceptance criteria
- [ ] Funnel chart correctly visualizes conversion from digital landing to physical arrival.
- [ ] Attribution charts identify "Top Sources" and "Top Campaigns" correctly.
- [ ] Charts follow ADS design tokens and are fully responsive.
- [ ] `pnpm turbo build` passes across the monorepo.

### Files likely touched
- `apps/client-dashboard/src/components/analytics/MarketingFunnel.tsx`
- `apps/client-dashboard/src/app/[locale]/(dashboard)/analytics/page.tsx`
- `packages/i18n/src/locales/en.json`
- `packages/i18n/src/locales/ar.json`
