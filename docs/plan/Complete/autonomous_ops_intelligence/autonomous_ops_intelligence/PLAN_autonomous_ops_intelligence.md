# PLAN: Autonomous Operations & Perimeter Intelligence

- **Initiative:** `autonomous_ops_intelligence`
- **Application:** Cross-Platform (`apps/client-dashboard`, `apps/scanner-app`, `apps/resident-mobile`, `packages/db`)
- **Status:** ✅ Complete — all phases 1–5 complete (verified)
- **Priority:** P1 — Agentic AI & Perimeter Security Automation
- **Branch:** `feat/autonomous-ops-intelligence`

---

## Executive Summary

Transform GateFlow into an autonomous community operating system featuring agentic AI work order dispatch upon telemetry anomalies, real-time perimeter tailgating detection with sub-200ms alerts, and conversational WhatsApp guest concierge registration with 1-tap resident approvals.

---

## Ordered Implementation Phases

### Phase 1: Agentic Fault Detector & Autonomous Work Order Dispatcher

- **Role:** BACKEND-API / SECURITY
- **Preferred Tool:** Cursor IDE
- **Scope:**
  - Build anomaly evaluation engine analyzing scanner error rates and gate hardware faults.
  - Implement autonomous dispatch flow: Telemetry Spike $\to$ Vetted Vendor Selection $\to$ Work Order Creation (`actor: 'GATEAI_AGENTIC_SYSTEM'`).
  - Unit tests for anomaly thresholds and autonomous dispatch rules.
- **Acceptance Criteria:**
  - Anomaly engine triggers work order creation when error thresholds are exceeded.
  - Audit trail properly attributes actions to the system AI actor.
  - 100% unit test pass rate.

### Phase 2: Perimeter Security & Tailgating Ingestion Bridge

- **Role:** BACKEND-API / SECURITY
- **Preferred Tool:** Cursor IDE
- **Scope:**
  - Implement edge AI camera webhook ingestion endpoint (`POST /api/perimeter/events`).
  - Classify tailgating incidents (multiple vehicles per scan under 3 seconds).
  - Broadcast real-time security alert payloads to scanner app and client dashboard.
- **Acceptance Criteria:**
  - Webhook validates HMAC signature and tenant isolation.
  - Tailgating detection evaluates timestamps and emits instant incident alerts.
  - Unit tests verify incident classification and alert broadcasting.

### Phase 3: WhatsApp Concierge Bot & Automated Guest Approval

- **Role:** BACKEND-API / FRONTEND
- **Preferred Tool:** Cursor IDE
- **Scope:**
  - Build WhatsApp Business webhook router for conversational visitor pass requests.
  - Verify resident authorization and emit 1-tap push approval notification to resident mobile.
  - Generate signed visitor pass on resident confirmation.
- **Acceptance Criteria:**
  - Incoming WhatsApp message parses guest details and resolves target resident.
  - Resident approval triggers immediate signed QR pass generation.
  - Unit tests verify webhook routing and approval state transitions.

### Phase 4: Client Dashboard Perimeter Intelligence Map & Anomaly Feed

- **Role:** FRONTEND / FULLSTACK
- **Preferred Tool:** Cursor IDE
- **Scope:**
  - Build live Perimeter Intelligence Map in `apps/client-dashboard`.
  - Stream live camera status, real-time tailgating alerts, and agentic AI action history.
  - High-density ADS token styling with dark/light mode parity.
- **Acceptance Criteria:**
  - Perimeter monitor displays live gate status and alerts without layout shifts.
  - Anomaly feed provides historical filter and drill-down actions.
  - Unit tests verify state updates and feed rendering.

### Phase 5: Arabic RTL Localization, Latency Benchmarks & Full Certification

- **Role:** QA / DESIGN / MOBILE
- **Preferred Tool:** Opencode CLI
- **Scope:**
  - Conduct Arabic RTL review across all concierge, alert, and perimeter interfaces.
  - Benchmark alert dispatch latency ($< 200$ms target).
  - Execute full test suites across affected workspaces.
- **Acceptance Criteria:**
  - Arabic RTL strings natural and enterprise-grade.
  - Alert processing latency within $< 200$ms benchmark.
  - 100% test pass rate across all test suites.

---

## Reference Documents

- `docs/plan/Draft/autonomous_ops_intelligence/DRAFT_autonomous_ops_intelligence.md`
- `docs/development/initiatives/IDEA_autonomous_ops_intelligence.md`
