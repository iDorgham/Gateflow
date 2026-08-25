# Phase 4: Closed-Loop Attribution Telemetry & Analytics

## Primary Role

FULLSTACK / ANALYTICS

## Tool Selection

- **Tool 1**: Cursor IDE (Attribution client & telemetry pipeline)
- **Tool 2**: Opencode CLI (Telemetry unit tests)

## Context

- **Focused App**: `apps/marketing`, `apps/client-dashboard`
- **Scope**: Attribution capture utility, telemetry event tracking, dashboard marketing analytics card.
- **Packages**: `@gate-access/ui`, `@gate-access/types`.

## Goal

Implement client-side UTM / referrer attribution capturing that ties initial marketing visits through lead submission, organization signup, and first gate scan.

## Scope (In)

1. UTM & Campaign Parser:
   - Capture `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `referrer` into session storage.
   - Attach attribution tags to lead generation payloads.
2. Conversion Telemetry:
   - Funnel events: `hero_pass_simulated`, `roi_calculated`, `lead_submitted`, `onboarding_started`.
3. Analytics View:
   - Marketing performance card in Client Dashboard summarizing lead volume by source and conversion quality.
4. Unit tests:
   - UTM extraction, session storage persistence, and analytics data aggregation.
5. Write `phase_logs/PHASE_LOG_phase_04.md`.

## Acceptance Criteria

- [ ] UTM parameters are reliably captured and attached to lead submissions.
- [ ] Marketing analytics card displays clean aggregated counts.
- [ ] Unit tests pass with 100% green status.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_04.md` created.
