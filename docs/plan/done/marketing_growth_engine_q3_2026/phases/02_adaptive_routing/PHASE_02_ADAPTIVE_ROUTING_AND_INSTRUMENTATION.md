# Phase 02 Deliverable: Adaptive CTA Routing and Instrumentation

**Plan:** `marketing_growth_engine_q3_2026`  
**Phase:** 02 — Adaptive CTA routing & instrumentation  
**Status:** Done (routing + event contract implemented on prioritized surfaces)

## 1) Intent-aware CTA routing updates

Implemented on high-impact pages in `apps/marketing/app/[locale]/`:

- `page.tsx` (home)
- `solutions/page.tsx`
- `pricing/page.tsx`
- `resources/page.tsx`

CTA links now carry intent context (`intent`, `surface`) into the destination route, while preserving locale-prefixed paths.

## 2) Event instrumentation contract implementation

Added shared instrumentation helpers:

- `apps/marketing/lib/marketing-intent.ts`
- `apps/marketing/components/intent-link.tsx`
- `apps/marketing/components/intent-landing-tracker.tsx`

Event emission milestones implemented:

- `landing` via `IntentLandingTracker`
- `cta_click` via `IntentLink` click handler
- `lead_submit` via contact form success flow

Canonical event names emitted:

- `mkt_intent_cta_clicked`
- `mkt_funnel_stage_progressed`

## 3) Event schema validation endpoint

Added:

- `apps/marketing/app/api/marketing/intent-event/route.ts`

This endpoint validates the Phase 01 schema contract fields and accepts:

- `eventName` (`mkt_intent_cta_clicked` or `mkt_funnel_stage_progressed`)
- full standardized payload (`eventVersion`, `eventId`, `occurredAt`, `intent`, `locale`, `surface`, `funnelStage`, IDs, and UTM envelope)

## 4) EN/AR parity and SEO-safe behavior

- Locale remains explicit and embedded in route generation (`en`, `ar-EG`).
- Event payload always includes `locale`.
- No canonical/meta changes were introduced in modified pages.
- Routing updates use query params only (no slug rewrites), minimizing SEO regression risk.

## 5) Verification run

- `pnpm turbo lint --filter=marketing`
- `pnpm --filter marketing exec tsc --noEmit`

Both commands completed successfully for the touched workspace.
