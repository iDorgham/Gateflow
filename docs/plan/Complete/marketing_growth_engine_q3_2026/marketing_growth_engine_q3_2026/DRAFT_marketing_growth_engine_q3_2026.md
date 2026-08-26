# Draft — `marketing_growth_engine_q3_2026`

**Slug:** `marketing_growth_engine_q3_2026`  
**Last updated:** 2026-08-24  
**Champion:** Marketing & Growth Engineering Team  
**Initiative Link:** `docs/development/initiatives/IDEA_marketing_growth_engine_q3_2026.md`  
**Target:** Q3 2026

> Raw planning notes for GateFlow Marketing Growth Engine & Conversion Funnel. When this feels complete, run **`/prompt marketing_growth_engine_q3_2026`** then **`/plan marketing_growth_engine_q3_2026`**.

---

## 1. What I Want

- **Adaptive Intent Funnel**:
  - Intelligent CTA routing on marketing pages based on buyer persona:
    1. **Compound Developer / Owner**: "Schedule On-Site Pilot"
    2. **Property Manager / HOA**: "Live Interactive Demo"
    3. **Legacy Hardware Switcher**: "Migration Calculator & ROI Assessment"
  - Interactive QR Pass Simulator widget on the homepage allowing prospects to generate a live test pass and scan it using their phone.
- **Vertical Landing Pages & Playbooks**:
  - Dedicated conversion landing pages for key MENA verticals:
    - `/solutions/compounds` (Residential luxury compounds & gated villas)
    - `/solutions/commercial` (Business parks & office towers)
    - `/solutions/schools-universities` (Campus security & parent pickup passes)
    - `/solutions/events-clubs` (High-throughput temporary event access)
- **Closed-Loop Attribution & Quality Telemetry**:
  - UTM + Referrer persistence into CRM leads (`packages/db/prisma/schema.prisma` `Lead` and `ScanLog` models).
  - Funnel stage event tracking: `page_view` $\to$ `interactive_pass_generated` $\to$ `demo_requested` $\to$ `pilot_activated` $\to$ `first_gate_scan`.
- **International Arabic & English SEO Engine**:
  - Automated JSON-LD structured data (`SoftwareApplication`, `Organization`, `FAQPage`).
  - Perfect hreflang links (`en` / `ar-EG`) and dynamic open-graph preview images.
  - PageSpeed 100 optimization (Core Web Vitals LCP < 1.2s, CLS = 0).

---

## 2. Constraints & Guardrails

- **Stack**: Next.js App Router (`apps/marketing`), Tailwind CSS, `@gate-access/ui/tokens` (`nativeTokensNewEra`), `@gate-access/i18n`.
- **Bilingual & RTL**: 100% feature and design parity between Arabic (`ar-EG`) and English (`en`) with logical CSS properties.
- **Tenant & Privacy Invariants**: Zero tracking of PII before consent; adhere to MENA privacy compliance standards.
- **Performance**: Static site generation (SSG) / ISR for all public landing pages; 0 layout shift.

---

## 3. Suggested 5-Phase Plan Sketch

1. **Phase 1: Interactive Pass Simulation & Hero Redesign**:
   - Build live interactive QR pass generator widget embedded in the marketing hero.
   - Prospects create a test pass and receive a live SMS/WhatsApp preview link on their phone.
2. **Phase 2: Vertical Solutions Landing Pages**:
   - Create high-converting vertical templates for `/solutions/compounds`, `/solutions/commercial`, and `/solutions/events`.
   - Dynamic ROI & gate hardware replacement calculator.
3. **Phase 3: Adaptive Intent Lead Capture & Qualification Engine**:
   - Multi-step smart modal routing leads by property size, gate count, and timeline.
   - Lead ingestion API into CRM with UTM attribution and automated calendar invite webhook.
4. **Phase 4: Closed-Loop Attribution Telemetry & Dashboard Analytics**:
   - Track full lifecycle metrics: `campaign_visit` $\to$ `demo_request` $\to$ `org_activation` $\to$ `first_scan`.
   - Expose conversion dashboard in Client/Admin Analytics.
5. **Phase 5: SEO Core Web Vitals 100, Arabic RTL Audit & Pilot Certification**:
   - Structured JSON-LD schema, dynamic OG image generation, sitemap updates, and PageSpeed 100 audit.
   - Arabic RTL copy polish and comprehensive automated test suite.

---

## 4. Open Questions

- [ ] What is the default webhook destination for sales leads (Slack webhook, HubSpot, or internal CRM)?
- [ ] Should the interactive QR demo allow prospects to test scanned results against a sample gate simulated view?
- [ ] Are custom pricing tiers dynamic based on gate count, or fixed starter/growth/enterprise buckets?

---

## 5. Changelog

- **2026-08-24**: Initialized draft from `IDEA_marketing_growth_engine_q3_2026.md` with interactive pass simulation, vertical playbooks, closed-loop attribution, and SEO engine.
