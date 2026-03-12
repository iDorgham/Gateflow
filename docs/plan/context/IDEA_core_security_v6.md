# IDEA_core_security_v6 — GateFlow v6 security, scanner rules, identity & watchlists

**Owner:** Security + Product + Engineering  
**Created:** 2026-02-27  
**Status:** Draft (Idea captured)  
**Primary references:**  
- `docs/PRD_v7.0.md` (Sections 8, 11–14)  
- `docs/guides/SECURITY_OVERVIEW.md`  
- `.cursor/rules/00-gateflow-core.mdc`  
- `.cursor/rules/gateflow-security.mdc`  
- `.cursor/contracts/CONTRACTS.md`  

---

## 1. Problem & Motivation

GateFlow already has strong **core security invariants** (multi-tenancy, soft deletes, QR signing, auth contracts), but the **v6 security surface** is only partially realized in product behavior:

- **Scanner rules & policies** (gate–account assignment, location rules, gate hours) are specified in `PRD_v7.0.md` and `SECURITY_OVERVIEW.md`, but not yet implemented end-to-end across API, DB, and scanner UX.
- **Visitor identity levels** (Level 0–2 with ID capture/OCR) are described at a product level, but do not yet exist as first-class configuration and flows for tenants and guards.
- **Watchlists/blocklists and incidents** are defined conceptually (person/vehicle watchlists, guard shifts, incident workflows), but there is no cohesive implementation that security teams can rely on day-to-day.
- **Privacy & retention controls** for sensitive security artifacts (ID images, incidents, watchlist data) are outlined, but not wired into actual configuration, storage, and deletion behavior.

As a result:

- GateFlow feels like a **strong access system**, but not yet an indisputable **must-have security layer** for high-security compounds and venues.
- Security Heads cannot fully express their real-world policies (which guards can scan where, how strictly location is enforced, how ID is captured/retained, how watchlists behave).
- There is a risk of **drift** between contracts/rules (`.cursor/rules/*`, `CONTRACTS.md`) and actual implementation/test coverage.

This idea defines a focused **core_security_v6** initiative to close the gap between v6 security requirements and shipped product behavior.

---

## 2. Goals

1. **Make GateFlow a must-have security platform for gated communities**
   - Turn the v6 security sections of the PRD into concrete behavior: scanner policies, identity levels, watchlists, incidents, and privacy controls that Security Heads can configure and trust.

2. **Deliver a cohesive scanner policy layer**
   - Implement gate–account assignment, optional location rules, and (later) gate hours as a consistent policy engine enforced in both the scanner app and APIs.

3. **Introduce configurable visitor identity levels**
   - Allow tenants to choose required identity level (0–2) per org/gate/scenario, with clear guard flows for ID capture/OCR and safe storage & retention of sensitive artifacts.

4. **Ship tenant-managed watchlists & incidents as first-class features**
   - Provide person (and future vehicle) watchlists with hard-stop behavior, automatic incident creation, and guard shift tracking, consistent with PRD v6 and security docs.

5. **Align implementation with contracts, rules, and docs**
   - Ensure `.cursor/rules/*`, `.cursor/contracts/CONTRACTS.md`, `SECURITY_OVERVIEW.md`, and `PRD_v7.0.md` all describe the same security reality, backed by tests and audit-logs.

---

## 3. Scope

### 3.1 In scope

- **Scanner rules & policies (Phaseable)**
  - Gate–account assignment (user/role → gate mapping, enforced in APIs and scanner app).
  - Optional location rule per org/gate (reject scans outside configured radius when enabled).
  - Hooks for future gate-hours policies (defined in PRD v6 but may be phased later).

- **Visitor identity & trust levels**
  - Configuration of required identity level (0–2) at org/gate/scenario level.
  - Scanner flows for ID photo capture and (eventually) OCR & field matching.
  - Secure attachment of artifacts to scan/incident records, respecting retention settings.

- **Watchlists, blocklists & incidents**
  - Tenant-managed person watchlists (and schema hooks for vehicle plates later).
  - Hard-stop behavior on watchlist matches, with automatic incident creation.
  - Guard shifts, incidents, and supervisor workflows consistent with PRD v6.

- **Privacy, retention & auditability**
  - Tenant-level retention configuration for scans, visitor history, ID artifacts, and incidents.
  - Audit logs for watchlist changes, incident state changes, and critical security actions.

- **Docs & contracts alignment**
  - Keep `PRD_v7.0.md` (security-related sections), `SECURITY_OVERVIEW.md`, `.cursor/rules/*`, and `CONTRACTS.md` synchronized with the implementation as phases ship.

### 3.2 Out of scope (for this idea)

- Marketing Intelligence Suite implementation (pixels, UTMs, CRM webhooks) beyond what is already in PRD v6.
- Non-security product areas such as pricing, billing, generic analytics visual polish, or marketing site content.
- Hardware integrations beyond defining logical hooks in scan handling (physical barriers/turnstiles may be scoped into later initiatives).

---

## 4. Proposed Tracks / Themes

This initiative should likely decompose into 3–4 execution phases under `/plan` and `/dev`. Proposed tracks:

1. **Track A — Core invariants & enforcement hardening**
   - Reconfirm and test multi-tenancy, soft deletes, QR signing, auth, and API security checklist coverage for existing routes.
   - Add or tighten tests where contracts in `.cursor/contracts/CONTRACTS.md` are not yet enforced by automated coverage.

2. **Track B — Scanner policy engine (gate–account + location rules)**
   - Implement gate–account assignments (data model, dashboard UI, scanner UX, API enforcement).
   - Implement optional location rule: gate coordinates, radius configuration, scanner location context, and server-side enforcement + UX error states.

3. **Track C — Visitor identity levels & artifacts**
   - Model and configuration for identity levels (per org/gate/scenario).
   - Scanner flows for Level 1 (ID photos) and foundation for Level 2 (OCR & matching).
   - Storage and retention behavior for ID artifacts, with clear admin controls.

4. **Track D — Watchlists, incidents & guard accountability**
   - Models and APIs for person watchlists, match behavior on scans/sync.
   - Incident logging and workflows tied to scans, shifts, gates, and operators.
   - Basic dashboards for Security Managers (incident queue, per-guard/per-gate KPIs).

5. **Track E — Privacy, retention & resident-facing controls**
   - Tenant and resident controls for what data is visible (e.g., masking, unit visibility on landing pages).
   - Retention configuration surfaced in UI and enforced in scheduled cleanup jobs.

Exact phasing and naming will be decided in `PLAN_core_security_v6.md`, but this IDEA anchors the main themes.

---

## 5. Success Criteria

- **Security Heads can express real policies in GateFlow**
  - For a given tenant, they can configure:
    - Which gates each guard/role can use.
    - Whether location is enforced and at what radius.
    - Required identity level per gate/scenario.
    - Active watchlists and how incidents are reviewed.

- **Scanner behavior matches PRD v6 expectations**
  - Attempts to scan at unauthorized gates, or far from a gate with location enforcement enabled, are rejected with clear error messages.
  - Watchlist matches cause hard stops and generate incidents automatically.
  - Identity-level requirements drive guard workflows (ID capture steps) rather than being “paper-only” requirements.

- **Contracts and docs are aligned and test-backed**
  - No new or modified API route that touches tenant data violates multi-tenancy, soft delete, QR, auth, or validation contracts.
  - Security-related sections of `PRD_v7.0.md` and `SECURITY_OVERVIEW.md` are kept in sync with shipped behavior.
  - There is targeted test coverage for scanner rules, identity levels, and watchlist/incidents flows.

- **Privacy & retention are explicit, not implicit**
  - Tenants can see and adjust how long scan logs, visitor history, ID images, and incidents are retained.
  - Sensitive artifacts (ID images, incident attachments) are handled according to documented policies.

---

## 6. Open Questions

1. **ID artifact storage & jurisdiction**
   - Where and how should ID images/OCR text be stored (tables, encryption, buckets), and what regional/legal constraints (e.g., EU vs MENA) must we plan for?

2. **Default posture for location enforcement**
   - Should location rules be opt-in per tenant/gate, or is there a “recommended secure default” for high-security deployments?
   - What is the expected behavior when location is unavailable (e.g., basement parking, device permissions off)?

3. **Watchlist schema & scope**
   - Do we start with a minimal person-watchlist model and extend later, or design upfront for person + vehicle + “other identifiers”?
   - How do we handle fuzzy matches (similar names/phones) vs exact matches?

4. **Retention defaults and overrides**
   - What are sensible default retention windows for scan logs, visitor history, ID images, and incidents?
   - How do tenant overrides interact with legal-hold or regulatory requirements?

5. **Resident-facing transparency**
   - How much of watchlist/incident behavior and ID handling should be visible to residents (e.g., privacy notices, consent flows)?

---

## 7. Next Steps

1. Use `/plan` on this IDEA to create `PLAN_core_security_v6.md`, grouping work into phased tracks (A–E) with clear roles (SECURITY, Backend, Mobile, QA) and acceptance criteria.
2. For each phase, generate `PROMPT_core_security_v6_phase_<N>.md` under `docs/plan/execution/` that:
   - References `PRD_v7.0.md`, `SECURITY_OVERVIEW.md`, `.cursor/rules/*`, and `CONTRACTS.md`.
   - Sets **Primary role: SECURITY** where appropriate.
   - Includes explicit gates for tests, lint, typecheck, and security validation.
3. Execute phases via `/dev`, using:
   - `gf-security` and `gf-api` for API/route work.
   - `gf-mobile` for scanner app changes.
   - `gf-testing` for focused security and scanner tests.
4. Keep this IDEA updated with decisions and scope changes as phases complete (linking to `PLAN_*` and `PROMPT_*` artifacts).

