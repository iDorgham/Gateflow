# Phase 01 Deliverable: Intent Taxonomy and KPI Contract

**Plan:** `marketing_growth_engine_q3_2026`  
**Phase:** 01 — Intent taxonomy and KPI contract  
**Status:** Done (documentation contract locked)

## 1) Intent taxonomy (v1)

This taxonomy is stable across EN and AR pages and should be used in all CTA tracking payloads.

| Intent key  | Primary user outcome              | Default CTA label (EN)     | Default CTA label (AR) | Qualified when                       |
| ----------- | --------------------------------- | -------------------------- | ---------------------- | ------------------------------------ |
| `demo`      | Book a guided product walkthrough | Book Demo                  | احجز عرضا توضيحيا      | Meeting booked or form marked MQL    |
| `pilot`     | Start a time-boxed pilot rollout  | Start Pilot                | ابدأ تجربة تشغيل       | Pilot request accepted by sales/ops  |
| `migration` | Move from legacy gate system      | Plan Migration             | خطط للترحيل            | Migration checklist intake submitted |
| `consult`   | Discuss architecture/security fit | Talk to Security Architect | تحدث مع خبير الأمان    | Consultation session scheduled       |

### Required taxonomy dimensions

- `intent`: One of `demo | pilot | migration | consult`.
- `locale`: One of `en | ar-EG`.
- `surface`: Marketing surface key (for example `home_hero`, `pricing_cta`, `solutions_card`, `resources_gate`).
- `funnelStage`: One of `landing | cta_click | lead_submit | qualified | first_scan`.
- `campaign`: UTM envelope (`utm_source`, `utm_medium`, `utm_campaign`, optional `utm_content`, `utm_term`).

## 2) Event schema contract

### Canonical event names

- `mkt_intent_cta_clicked`
- `mkt_lead_form_submitted`
- `mkt_lead_qualified`
- `mkt_first_scan_linked`
- `mkt_funnel_stage_progressed`

### Required event payload fields

| Field            | Type           | Notes                                                      |
| ---------------- | -------------- | ---------------------------------------------------------- | --------- | ----------- | --------- | ----------- |
| `eventVersion`   | string         | Start with `v1` for stable reporting contracts             |
| `eventId`        | string         | UUID generated client/server side for dedup and replay     |
| `occurredAt`     | string (ISO)   | UTC timestamp                                              |
| `intent`         | enum           | `demo                                                      | pilot     | migration   | consult`  |
| `locale`         | enum           | `en                                                        | ar-EG`    |
| `surface`        | string         | CTA or page placement key                                  |
| `funnelStage`    | enum           | `landing                                                   | cta_click | lead_submit | qualified | first_scan` |
| `organizationId` | string \| null | Null for pre-auth marketing events                         |
| `leadId`         | string \| null | Set once lead exists in CRM                                |
| `scanId`         | string \| null | Set when linked to first scan                              |
| `utm`            | object         | `source`, `medium`, `campaign`, optional `content`, `term` |

### AR/EN parity requirements

- Event keys and enum values remain language-neutral in English.
- `locale` is always captured, never inferred from headers only.
- Copy variants in AR/EN must map to the same `intent` and `surface` keys.

## 3) KPI contract and measurement windows

| KPI                            | Formula                                                         | Baseline extraction                                       | Target                 | Measurement window        |
| ------------------------------ | --------------------------------------------------------------- | --------------------------------------------------------- | ---------------------- | ------------------------- |
| Demo CTA conversion rate       | `demo lead_submit / demo cta_click`                             | Query intent=`demo` in event stream exports               | `+20%` relative uplift | 28-day rolling window     |
| Qualified lead rate            | `qualified leads / total leads`                                 | Join `mkt_lead_form_submitted` to `mkt_lead_qualified`    | `+15%` relative uplift | Calendar month            |
| Campaign -> first scan linkage | `first_scan_linked leads / campaign-attributed qualified leads` | Join UTM-tagged qualified leads to first scan event       | `>= 70%` join coverage | 45-day attribution window |
| EN vs AR conversion parity gap | `abs(conv_en - conv_ar) / max(conv_en, conv_ar)`                | Split conversion by locale on same intent and surface set | `<= 10%` relative gap  | Weekly + monthly rollup   |

## 4) Feasibility map against current API and analytics surfaces

Validated against `docs/cache/API_ROUTES_MAP.md`.

| Needed capability                             | Existing surface                                                                             | Feasibility                                                                            |
| --------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Capture campaign attribution at entry         | `POST /api/marketing/utm-track`                                                              | Ready; reuse with eventVersion + intent fields                                         |
| Funnel reporting and segmentation             | `GET /api/analytics/funnel`, `GET /api/analytics/campaigns`, `GET /api/analytics/utm-matrix` | Ready; extend query dimensions without new route creation                              |
| Export validation datasets                    | `GET /api/analytics/export`, `GET /api/analytics/export/marketing`                           | Ready for baseline and QA snapshots                                                    |
| Link lead progression to operational outcomes | `GET /api/scans/*` family + webhook rails (`/api/webhooks*`)                                 | Feasible; requires join contract by `leadId` and first linked `scanId` in later phases |

## 5) Phase 01 acceptance checklist

- [x] Intent taxonomy documented and unambiguous
- [x] KPI contract includes `campaign -> qualified lead -> first scan`
- [x] AR/EN considerations included in metric specs
- [x] KPI target values and measurement windows are explicitly documented
