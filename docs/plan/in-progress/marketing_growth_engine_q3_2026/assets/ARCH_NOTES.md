# ARCH NOTES: marketing_growth_engine_q3_2026

## Decision log

- 2026-03-31 (Phase 01): Locked stable intent taxonomy v1 (`demo`, `pilot`, `migration`, `consult`) and canonical event contract for funnel analytics.
- 2026-03-31 (Phase 01): Reuse existing attribution and analytics routes (no new API routes in Phase 01), with join contract formalized for `campaign -> qualified lead -> first scan`.

## Intended architecture direction

- Reuse existing marketing + dashboard attribution rails; avoid duplicate event pipelines.
- Keep intent taxonomy stable and versioned for reporting continuity.
