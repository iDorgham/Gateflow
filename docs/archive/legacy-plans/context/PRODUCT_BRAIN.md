# GateFlow — Product Brain

## Purpose

Single, high-level reference for **what GateFlow is**, **who it serves**, and **how it is supposed to behave**.  
This file is read by Cursor, CLIs, Kiro, and Antigravity as background context for ideas, plans, and phases.

## Personas

- **Platform admin (ADMIN)**  
  Owns the overall GateFlow deployment, billing, and global configuration.

- **Tenant admin (TENANT_ADMIN)**  
  Runs a compound / venue. Manages organization, projects, gates, users, QR rules, webhooks, and API keys.

- **Tenant operator (TENANT_USER)**  
  Day‑to‑day operator in the client dashboard: creates QR codes, monitors scans, exports logs.

- **Gate guard / scanner operator (VISITOR)**  
  Uses the **scanner-app** on mobile devices to validate QRs online/offline at physical gates.

- **Resident (RESIDENT, planned)**  
  Uses resident‑portal / resident‑mobile to manage their own visitor QRs under quota and access rules.

## Core product value

- Replace paper guest books and ad‑hoc QR sharing with a **zero‑trust, auditable access system**.
- Guarantee **multi‑tenant isolation** between compounds and venues.
- Provide **offline‑capable scanning** with reliable deduplication and audit logs.
- Offer **analytics, exports, and integrations** (webhooks, API keys) for operators and admins.

## Key flows

- **Visitor QR lifecycle**
  - Create single / recurring / permanent QRs in client dashboard (or resident portal).
  - All QRs are **HMAC‑SHA256 signed** and scoped by `organizationId` and gate/project rules.
  - QRs are shared digitally (link, image, email) and validated by the scanner app.

- **Scan & audit**
  - Scanner app validates signature **offline** when needed, queues scans with encrypted payload.
  - When online, scanner syncs scans in bulk to the backend, using `scanUuid` for deduplication.
  - Client dashboard shows live analytics, history, and exports; webhooks notify external systems.

- **Administration**
  - Tenant admins manage organizations, projects, gates, users, roles, and feature configuration.
  - Platform admins manage tenants, plans, and overall system health.

## Terminology (canonical)

- **Organization** — Top‑level tenant (compound, venue). All tenant data must be scoped by `organizationId`.
- **Project** — Logical subdivision within an organization (e.g. “Tower A”, “Event X”).
- **Gate** — Physical access point where scans occur.
- **QRCode** — A generated and signed access code (single, recurring, permanent).
- **ScanLog** — Immutable audit record for a single scan (includes status, gate, user, timestamps).
- **User** — Authenticated account (ADMIN, TENANT_ADMIN, TENANT_USER, VISITOR, RESIDENT).
- **Unit / Resident / VisitorQR** — Resident‑portal concepts for linking residents to units and visitor access (Phase 2).

## Where to go deeper

- **Requirements & flows**
  - `docs/PRD_v5.0.md`
  - `docs/RESIDENT_PORTAL_SPEC.md`
  - `docs/APP_DESIGN_DOCS.md`

- **Security & invariants**
  - `.cursor/rules/00-gateflow-core.mdc`
  - `.cursor/rules/gateflow-security.mdc`
  - `.cursor/contracts/CONTRACTS.md`
  - `docs/SECURITY_OVERVIEW.md`

- **Planning & phases**
  - `docs/plan/backlog/ALL_TASKS_BACKLOG.md`
  - `docs/plan/execution/PLAN_<slug>.md`
  - `docs/plan/execution/PROMPT_<slug>_phase_<N>.md`

