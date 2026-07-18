# GateFlow - Master Product Requirements Document (PRD)

**Document Version:** 12.0 (Ultra Detailed Unified Edition)  
**Status:** Active / Production  
**Last Updated:** 2026-04-30  
**Confidentiality:** Internal Engineering, Product, Operations

---

## 1. Executive Summary

GateFlow is a multi-tenant physical-access and operational intelligence platform for gated communities, compounds, and real-estate projects. It unifies:

- secure perimeter access control,
- resident and visitor lifecycle management,
- marketing-to-physical attribution,
- admin-grade governance and compliance,
- AI-assisted operations and automation.

GateFlow's core differentiator is full-lifecycle traceability from first digital touchpoint to physical gate event while preserving strict tenant isolation and security invariants.

---

## 2. Product Vision, Mission, and Business Outcomes

### 2.1 Vision

Become the default operating system for secure access, resident operations, and physical conversion intelligence across MENA real estate ecosystems.

### 2.2 Mission

Deliver high-trust, low-friction access experiences with measurable operational and growth outcomes for every stakeholder: developer, operator, guard, resident, and platform admin.

### 2.3 Business Outcomes

- Security integrity: near-zero unauthorized entry events.
- Guard throughput: materially lower check-in latency at peak.
- Resident autonomy: high self-service invite/pass usage.
- Marketing attribution: reliable digital-to-physical conversion tracking.
- Platform operability: stable, auditable multi-tenant operations at scale.

---

## 3. Scope Definition

### 3.1 In Scope

- Web admin products (`client-dashboard`, `admin-dashboard`, `marketing`, `resident-portal`).
- Mobile products (`scanner-app`, `resident-mobile`).
- Shared platform packages (`db`, `types`, `ui`, `api-client`, `i18n`, `config`, `utils`).
- Security model, data model, API contracts, and planning lifecycle governance.
- AI-assisted operations features and automation support.

### 3.2 Out of Scope

- Non-GateFlow third-party product roadmaps not integrated via defined APIs.
- Hard-delete data lifecycle strategy as default model.
- Uncontrolled cross-tenant analytics/querying bypassing org boundaries.

---

## 4. Personas and Jobs-to-be-Done

### 4.1 Property Manager (Operations Lead)

- JTBD: run safe and efficient property access and resident operations.
- Success metrics: fewer manual overrides, faster gate flow, lower incident rates.

### 4.2 Marketing Manager (Growth)

- JTBD: map marketing spend to physical visits and lead quality.
- Success metrics: trusted CPV and channel-level physical attribution.

### 4.3 Security Guard (Field Operator)

- JTBD: verify visitors quickly, reliably, and safely in unstable network conditions.
- Success metrics: low verification time, low false deny/allow friction.

### 4.4 Resident (End User)

- JTBD: create and share guest access with minimal effort.
- Success metrics: invite completion rate, low support dependency.

### 4.5 Platform Admin (Governance)

- JTBD: keep platform healthy, secure, compliant, and auditable.
- Success metrics: uptime, security posture, low operational drift.

---

## 5. Product Surfaces and Responsibilities

### 5.1 Client Dashboard (`apps/client-dashboard`)

Primary operator console for property organizations:

- analytics and operational KPIs,
- resident and contact management,
- gates, scans, incidents, and watchlist operations,
- workspace configuration (keys, webhooks, billing, settings),
- embedded AI workflows and automations.

### 5.2 Admin Dashboard (`apps/admin-dashboard`)

Platform control plane:

- tenant and organization governance,
- admin tools (auth keys, health, reset/seed operations),
- CMS and support tooling,
- intelligence and monitoring workflows,
- audit and compliance controls.

### 5.3 Scanner App (`apps/scanner-app`)

Mobile field execution surface:

- high-speed QR scan verification,
- offline-first verification and queued sync patterns,
- guard-focused, low-latency interaction loop.

### 5.4 Resident Mobile (`apps/resident-mobile`)

Native resident self-service:

- invitation and pass creation,
- pass history and resident actions,
- push-first resident updates.

### 5.5 Resident Portal (`apps/resident-portal`)

Web resident experience:

- visitor and pass workflows,
- resident profile and notification controls,
- browser/PWA-compatible flows.

### 5.6 Marketing Site (`apps/marketing`)

Acquisition and conversion web surface:

- SEO and localized pages,
- lead capture and intent event collection,
- marketing performance signal flow to platform.

---

## 6. Functional Requirements

### 6.1 Access Control and Pass Lifecycle

- Generate pass artifacts for multiple access models (single-use, recurring, permanent, open flows).
- Bind pass lifecycle to policy and tenant constraints.
- Support validation and deny/override workflows with full traceability.

### 6.2 Scan Verification and Event Integrity

- Validate access artifacts securely and deterministically.
- Support degraded network operation for field workflows.
- Log scan outcomes, metadata, and decision pathways for audit.

### 6.3 Resident and Contact Operations

- Manage resident-unit mappings and invite lifecycle.
- Maintain contact and unit domain quality with operational tooling.
- Support lifecycle operations for active/inactive resident states.

### 6.4 Gates, Incidents, and Watchlist Operations

- Manage gate definitions and assignments.
- Record and resolve incidents with operational context.
- Apply watchlist checks and enforcement workflows.

### 6.5 Analytics and Intelligence

- Deliver operational and growth analytics with practical segmentation.
- Support export/reporting flows and management visibility.
- Provide AI-assisted query/insight workflows with governed access.

### 6.6 Marketing Attribution and Conversion

- Persist campaign context to pass/visit domain entities.
- Emit conversion signals tied to physical scan outcomes.
- Enable CRM synchronization with attribution context.

### 6.7 Admin Governance and Platform Controls

- Tenant-level management and diagnostics.
- Authorization key and admin access controls.
- Platform health, audit, and support capabilities.

### 6.8 AI Operations Layer

- Assistant-driven operational requests in dashboard contexts.
- Action logging and traceability for AI-triggered operations.
- Automation policies for repetitive operational tasks.

---

## 7. Data and Domain Model Requirements

Primary source of truth: `packages/db/prisma/schema.prisma`.

### 7.1 Core Domain Clusters

- Identity and tenancy: organizations, users, roles, invitations, auth tokens.
- Access domain: gates, QR artifacts, scan logs, incidents, watchlist entries.
- CRM/resident domain: contacts, units, tags, project and lead/deal flows.
- AI domain: tasks, action logs, automations, generated assets, usage logs.
- Integration domain: webhooks, deliveries, communication config and logs.
- Content domain: landing pages, blog posts/categories, style/theming entities.

### 7.2 Data Integrity Requirements

- Tenant isolation via `organizationId` in tenant-scoped reads/writes.
- Soft-delete semantics respected where applicable (`deletedAt` model behavior).
- No default hard-delete dependence for operational data lifecycle.
- Auditability for sensitive operations (security, admin, access outcomes).

---

## 8. API Requirements and Contract Expectations

GateFlow uses app-local API handlers (`app/api/**/route.ts`) as a distributed API gateway model.

### 8.1 API Surface Responsibilities

- Client dashboard APIs: largest operational domain footprint.
- Admin dashboard APIs: governance and control plane APIs.
- Marketing APIs: contact and intent event ingestion.
- Resident portal APIs: resident notifications/push flows.

### 8.2 Contract Requirements

- Explicit auth enforcement and permission boundaries.
- Stable response/error contract shape per route family.
- Input validation and error status consistency.
- Tenant-safe data access in all scoped operations.

---

## 9. Security and Compliance Requirements

### 9.1 Security Invariants

- Multi-tenant isolation is mandatory and non-negotiable.
- Sensitive credential material must never be committed.
- Access/session controls must follow secure token lifecycle principles.
- QR/access integrity protections must be maintained end-to-end.

### 9.2 Operational Security Requirements

- Security checks integrated into CI and preflight loops.
- Governance visibility for critical admin and access operations.
- Reproducible audit trail for high-risk actions.

---

## 10. UX, Accessibility, and Localization Requirements

- Arabic and English support with RTL/LTR correctness.
- Accessible interaction patterns for web and mobile surfaces.
- High-density operational UI without sacrificing usability.
- Clear, fast guard/resident critical-path interactions.

---

## 11. Non-Functional Requirements

### 11.1 Performance

- Fast scan verification and low perceived latency for guard flows.
- Responsive dashboard performance under operational load.
- Predictable API latency envelopes for critical user journeys.

### 11.2 Reliability

- Resilient operation across network instability (especially field/mobile).
- Graceful degradation for non-critical subsystems.
- Queue/retry patterns for eventual sync domains.

### 11.3 Scalability

- Support for multi-org, multi-project deployments from one codebase.
- Maintain performance under growth in scans, contacts, and analytics volume.

### 11.4 Maintainability

- Strong package boundaries and shared-contract governance.
- Phased plan execution and documentation-backed development lifecycle.

---

## 12. Platform and Engineering Governance

### 12.1 Development Lifecycle

- Canonical plan lifecycle: `Draft -> Ready -> Active -> Complete`.
- Phase-driven execution with verification gates.
- Task, phase-log, and session-memory continuity for long-running initiatives.

### 12.2 Quality Gates

- Lint, typecheck, and tests required in preflight workflows.
- Security and invariant checks integrated into automation loops.
- Documentation updates required for behavior/contract changes.

### 12.3 AI-Assisted Delivery Governance

- AI context sources are documented under `docs/reference/apps`.
- Planning and execution should consume structured references before coding.
- Symbol-level references available for function-impact precision.

---

## 13. KPIs and Success Metrics

### 13.1 Security and Access

- Unauthorized/invalid access event rate.
- Override rate and override resolution timing.
- Incident rate and closure SLA.

### 13.2 Operations

- Scan throughput and median verification time.
- Guard task completion efficiency.
- Resident self-service completion rate.

### 13.3 Growth and Attribution

- Physical conversion events by campaign/source.
- Cost per physical visit and conversion quality trend.
- Marketing-to-CRM signal integrity.

### 13.4 Platform Health

- API reliability and error rates by domain.
- CI/preflight pass rates.
- Tenant health and support ticket resolution metrics.

---

## 14. Release Strategy and Rollout Model

- Use phased feature delivery with explicit scope boundaries.
- Prefer domain-isolated rollouts for high-risk changes (DB/API/UI split).
- Require rollback strategy and verification checklist for risky deployments.
- Keep roadmap alignment with `docs/reference/product/UPCOMING.md`.

---

## 15. Risks and Mitigations

### 15.1 Core Risks

- Cross-tenant leakage from unscoped queries.
- API contract drift across fast-changing route surfaces.
- Operational regressions in scan and guard-critical flows.
- Documentation drift between implementation and planning references.

### 15.2 Mitigations

- Mandatory invariant checks and scoped review.
- Contract-aware phased execution and verification.
- Symbol-level impact analysis for refactors.
- Continuous doc updates tied to lifecycle/automation.

---

## 16. Traceability Matrix (Reference Sources)

Use these as authoritative context packs during planning and execution:

- `docs/reference/apps/GATEFLOW_COMPLETE_CONTEXT_REFERENCE.md`
- `docs/reference/apps/PLANNING_AND_PLAN_LIFECYCLE_REFERENCE.md`
- `docs/reference/apps/FILES_AND_STRUCTURE_REFERENCE.md`
- `docs/reference/apps/DATABASE_BACKEND_AND_TECH_REFERENCE.md`
- `docs/reference/apps/API_GATEWAY_AND_CONTRACTS_REFERENCE.md`
- `docs/reference/apps/FUNCTIONS_AND_SERVICES_INDEX_REFERENCE.md`
- `docs/reference/apps/PAGES_AND_ROUTES_INDEX_REFERENCE.md`
- `docs/reference/apps/UI_UX_AND_DESIGN_REFERENCE.md`
- `docs/reference/apps/WORKSPACE_AI_ENVIRONMENT_REFERENCE.md`
- `docs/reference/apps/MEMORY_AND_LEARNED_DATA_REFERENCE.md`
- `docs/reference/apps/AI_CONTEXT_BLOCK_REFERENCE.md`
- `docs/reference/apps/symbols/README.md`

App-specific deep references:

- `docs/reference/apps/CLIENT_DASHBOARD_REFERENCE.md`
- `docs/reference/apps/ADMIN_DASHBOARD_REFERENCE.md`
- `docs/reference/apps/SCANNER_APP_REFERENCE.md`
- `docs/reference/apps/RESIDENT_PORTAL_REFERENCE.md`
- `docs/reference/apps/MARKETING_APP_REFERENCE.md`
- `docs/reference/apps/DESIGN_SYSTEM_REFERENCE.md`

---

## 17. Glossary

- HMAC: Hash-based Message Authentication Code.
- RBAC: Role-Based Access Control.
- PWA: Progressive Web App.
- KPI: Key Performance Indicator.
- CPV: Cost Per Visit.
- RTL/LTR: Right-to-Left / Left-to-Right layout direction.
- Ralph Loop: GateFlow autonomous quality/governance loop.

---

This PRD is the strategic and execution-level source of truth for GateFlow product and engineering decisions.  
All major plan proposals, implementation phases, and release decisions should trace back to this document and the linked reference matrix.
