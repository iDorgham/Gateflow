# ARCH NOTES: marketing_growth_engine_q3_2026

## Decision log

- 2026-03-31 (Phase 01): Locked stable intent taxonomy v1 (`demo`, `pilot`, `migration`, `consult`) and canonical event contract for funnel analytics.
- 2026-03-31 (Phase 01): Reuse existing attribution and analytics routes (no new API routes in Phase 01), with join contract formalized for `campaign -> qualified lead -> first scan`.
- 2026-03-31 (Phase 02): Added shared client instrumentation helpers (`buildMarketingEvent`, `emitMarketingEvent`) and standardized event emission for landing/click/lead-submit milestones.
- 2026-03-31 (Phase 02): Introduced intent-aware CTA routing by enriching high-impact links with `intent` and `surface` query dimensions to preserve funnel attribution context into contact conversion.
- 2026-03-31 (Phase 02): Added lightweight `/api/marketing/intent-event` ingestion endpoint in marketing app for schema validation and contract-safe event capture (persistence to be extended in later phases).
- 2026-03-31 (Phase 03): Added vertical playbook assets under `/resources/playbooks/{compounds,schools,events,clubs}` with localized EN/AR content and SEO metadata.
- 2026-03-31 (Phase 03): Updated resources and solution routes to preserve intent context across playbook discovery and lead-gate transitions (IntentLink + surface keys per vertical).
- 2026-03-31 (Phase 03): Extended sitemap with playbook routes to improve crawl coverage and internal-link discoverability.
- 2026-03-31 (Phase 04): Added closed-loop analytics endpoint `/api/analytics/campaign-first-scan` (org-scoped) reporting campaign -> qualified lead -> first scan with linkage rate and gap counts.
- 2026-03-31 (Phase 04): Added attribution diagnostics (`qualifiedWithoutCampaign`, `scansWithoutCampaign`, `campaignsMissingFirstScan`) for QA and growth operations.
- 2026-03-31 (Phase 04): Updated marketing attribution export to include qualified leads, first scans, linkage coverage, attribution gaps, and diagnostics rows for stakeholder reporting.
- 2026-03-31 (Phase 04): Wired dashboard analytics surface with `CampaignFirstScanLinkage` card to make closed-loop coverage visible without a major funnel UI redesign.

## Intended architecture direction

- Reuse existing marketing + dashboard attribution rails; avoid duplicate event pipelines.
- Keep intent taxonomy stable and versioned for reporting continuity.
