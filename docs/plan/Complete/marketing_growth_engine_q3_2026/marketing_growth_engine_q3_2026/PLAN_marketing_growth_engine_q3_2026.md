# PLAN: Marketing Growth Engine & Conversion Funnel (Q3 2026)

- **Initiative:** `marketing_growth_engine_q3_2026`
- **Application:** `apps/marketing`, `apps/client-dashboard`
- **Status:** 🟢 Ready (Queued for `/dev marketing_growth_engine_q3_2026 1`)
- **Priority:** P1 — Growth & B2B Customer Acquisition
- **Branch:** `feat/marketing-growth-engine-q3-2026`

---

## Strategic Goals

1. **Adaptive Buyer Persona Intent Funnel**:
   - Intelligent CTA routing tailored to Compound Owners, Property Managers, and Legacy System switchers.
   - Interactive live QR Pass Simulator embedded in the hero section to immediately demonstrate product value.
2. **Vertical Solution Landing Pages**:
   - Dedicated high-converting pages for Compounds, Commercial Business Parks, and Events with interactive ROI calculators.
3. **Closed-Loop Attribution & Quality Telemetry**:
   - Persist UTM and referrer parameters through lead capture to first scan event.
   - Live funnel analytics in the dashboard.
4. **International SEO & Performance**:
   - Structured JSON-LD schema, hreflang parity, Arabic RTL perfection, and PageSpeed 100 benchmark.

---

## Ordered Phases

### Phase 1: Interactive Pass Simulation & Hero Redesign

- **Scope**: Build interactive live pass generator widget in `apps/marketing` hero allowing prospects to customize and test a visitor pass on their own phone.
- **Deliverables**: Pass generator component, phone QR preview drawer, real-time animation, unit tests.
- **Primary Role**: FRONTEND / DESIGN

### Phase 2: Vertical Solutions Landing Pages & ROI Calculator

- **Scope**: Build `/solutions/compounds`, `/solutions/commercial`, and `/solutions/events` landing pages with gate hardware ROI calculator.
- **Deliverables**: Vertical route templates, ROI calculation utility, case studies section, unit tests.
- **Primary Role**: FRONTEND / SEO

### Phase 3: Adaptive Intent Lead Capture & Qualification Engine

- **Scope**: Multi-step qualification modal with persona routing, lead ingestion API endpoint, and CRM webhook dispatch.
- **Deliverables**: Lead capture modal, validation schemas (`zod`), `/api/leads` route, unit tests.
- **Primary Role**: BACKEND-API / FRONTEND

### Phase 4: Closed-Loop Attribution Telemetry & Analytics

- **Scope**: UTM attribution tracking, lifecycle event tracking (`page_view` $\to$ `first_scan`), and marketing analytics view.
- **Deliverables**: Attribution client utility, telemetry ingestion API, dashboard analytics card, unit tests.
- **Primary Role**: FULLSTACK / ANALYTICS

### Phase 5: SEO Core Web Vitals 100, Arabic RTL Audit & Full Test Certification

- **Scope**: Structured JSON-LD, dynamic OG preview images, sitemap indexing, complete Arabic RTL layout review, and full automated test suite certification.
- **Deliverables**: SEO metadata helpers, Arabic copy audit, 100% passing Jest suite, 0 TypeScript errors.
- **Primary Role**: QA / SEO / DESIGN

---

## Invariants & Guardrails

1. **ADS Semantic Design Tokens**: Strict usage of `@gate-access/ui/tokens` (`nativeTokensNewEra`).
2. **Bilingual RTL Parity**: Zero visual or functional regressions between English (`en`) and Arabic (`ar-EG`).
3. **Performance First**: Static Generation / ISR with Core Web Vitals LCP < 1.2s and CLS = 0.
