# GateFlow Plan — Autonomous Operations & Perimeter Intel (Q1 2026)

**Slug:** autonomous_ops_intelligence
**Focus:** Elevating GateFlow to an Autonomous Community OS.
**Goal:** Reduce manager overhead by 70% via AI and perimeter intelligence.
**Branch:** `feat/autonomous_ops_intelligence`

---

## 1. Plan Summary

Moving GateFlow from a reactive access control platform to a proactive,
autonomous operating system. This plan establishes the foundation for
"Agentic AI" (executors, not just assistants), brings real-time visual perimeter
intelligence into the scan timeline, and converts the resident app into a
lifestyle super-app for premium communities.

---

## 2. Infrastructure & Invariants

- **Multi-Tenancy**: Every operation **must** be hard-scoped to
  `organizationId`.
- **Soft Deletes**: Active for all new modules (Vendors, Incidents, Marketplace).
- **Security**: Perimeter ingestions require cryptographic signature
  verification from hardware partners.
- **i18n**: All UI and resident-facing messaging supports full RTL/Arabic.

---

## 3. Phased Roadmap

| Phase  | Title                  | Primary Role     | Tool      | Goal                                |
| :----- | :--------------------- | :--------------- | :-------- | :---------------------------------- |
| **01** | **Agentic Foundation** | BACKEND-Database | Cursor    | AI Maintenance Executor logic.      |
| **02** | **High-Density UI**    | FRONTEND         | Cursor    | ADS density optimization.           |
| **03** | **Perimeter Bridge**   | ARCHITECTURE     | Multi-CLI | Ingest real-time visual AI events.  |
| **04** | **WhatsApp Concierge** | BACKEND-API      | Cursor    | WhatsApp Business registration bot. |
| **05** | **Resident Super-App** | MOBILE           | Cursor    | Resident Super-App marketplace.     |

---

### Phase 01: Agentic Foundation (Backend)

**Goal:** Allow GateAI to trigger autonomous assignments for hardware failures.

- **Scope:** `apps/client-dashboard/src/lib/ai/`, `packages/db/`
- **Steps:**
  1. **Schema Update**: Add `Vendor` model and link to `Project`.
  2. **Event Trigger**: Add `SCAN_FAILURE` trigger to validation logic.
  3. **GateAI Executor**: Create `MaintenanceExecutor` class for work orders.
  4. **Multi-CLI (Optional)**: Design review for autonomous assignment.
- **Deliverables:** `MaintenanceExecutor` lib, Vendor schema, failure triggers.
- **Accpetance Criteria:**
  - [ ] `pnpm turbo test --filter=client-dashboard` passes.
  - [ ] Mock failures trigger a `status: ASSIGNED` work order via GateAI.
  - [ ] Every assignment is hard-scoped to `organizationId`.

---

### Phase 02: High-Density UI & Diagnostics (Frontend)

**Goal:** Optimize professional tools for high-volume sites and visibility.

- **Scope:** `apps/client-dashboard/`, `apps/scanner-app/`
- **Steps:**
  1. **Dashboard Virtualization**: Virtualization for 1000+ scan entries.
  2. **Scanner Diagnostics**: Add diagnostics overlay for health logs.
  3. **RTL Polish**: Audit density tables for Arabic alignment.
- **Deliverables:** High-density analytics feed, Scanner health dashboard.
- **Accpetance Criteria:**
  - [ ] 100/100 Lighthouse performance on analytics routes.
  - [ ] Diagnostics overlay shows live memory and queue growth logs.

---

### Phase 03: Perimeter Bridge (Infrastructure — Complex)

**Goal:** Ingest real-time visual events (Tailgating, LPR) into the timeline.

- **Scope:** `apps/client-dashboard/src/app/api/perimeter/`
- **Steps:**
  1. **Ingestion API**: `POST /api/perimeter/webhook` with HMAC verify.
  2. **Tailgating Logic**: Cross-reference barrier vs scan-log timings.
  3. **Incident Alerts**: Emit incident events via SSE to the dashboard.
  4. **Multi-CLI (Required)**: Security audit of verification logic.
- **Deliverables:** Perimeter Webhook API, Incident logic, SSE stream.
- **Accpetance Criteria:**
  - [ ] "Boom Barrier Move" without scan triggers `INCIDENT` in < 200ms.
  - [ ] Full HMAC signature verification for all perimeter events.

---

### Phase 04: WhatsApp Concierge (Interactive)

**Goal:** Zero-friction guest registration via WhatsApp bot.

- **Scope:** `apps/client-dashboard/src/app/api/webhooks/whatsapp/`
- **Steps:**
  1. **WhatsApp Hook**: Integrate with WhatsApp Business API.
  2. **Concierge Agent**: Create a "GateAI Guest" for registration chat.
  3. **Approval Flow**: Trigger resident push notification.
- **Deliverables:** WhatsApp Webhook Handler, Guest Agent, Approval flow.
- **Accpetance Criteria:**
  - [ ] `pnpm turbo build --filter=client-dashboard` passes.
  - [ ] Bot registration results in a valid resident-approved QR code.

---

### Phase 05: Resident Super-App (Convergence)

**Goal:** Monetizable lifestyle marketplace & concierge portal.

- **Scope:** `apps/resident-mobile/`, `packages/db/`
- **Steps:**
  1. **Merchant Schema**: Add `Merchant` and `Service` models.
  2. **Marketplace UI**: Implementation of community services tab.
  3. **Integrated Payments**: Scoped payment flow (v0.1) for services.
- **Deliverables:** Resident Marketplace Tab, Service schema, Payment UI.
- **Accpetance Criteria:**
  - [ ] Residents can book and pay for services in Arabic and English.
  - [ ] Payments are hard-scoped to organization and resident.

---

## 4. Dependencies & Risks

- **Hardware Agnosticism**: Webhooks must be flexible for AI hardware.
- **Security Isolation**: Phase 03 requires audit to prevent spoofing.
- **Performance**: High-density UI must not sacrifice interactivity.

---

### Generation Metadata

_Phased Plan created: March 2026_
