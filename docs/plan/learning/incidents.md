# Docs & Planning Incidents (v2)

This file logs notable incidents or failures in planning or documentation flows.

- For historical incidents, see `docs/archive/plan-legacy/learning/incidents.md`.
- New entries should include:
  - Initiative and phase.
  - What went wrong.
  - Root cause (once known).
  - Follow-up actions and links to PRs or tasks.

---

## Seed Incidents

### Incident 1 — Duplicate PRD v6.0 Locations

- **Initiative:** `docs_v2_refresh` — Phase 1
- **What went wrong:** For a short period, `PRD_v7.0.md` existed both at `docs/`
  and under `docs/archive/plan-legacy/phase-1-mvp/specs/` without clearly
  marking the root file as canonical.
- **Root cause:** Transition from legacy docs to Docs v2 while keeping history
  intact; initial structure was not immediately clarified.
- **Follow-up actions:**
  - Mark root `docs/PRD_v7.0.md` as canonical in its header.
  - Add `docs/README.md` to explain the structure and archive location.

---

## GateFlow — Incidents & Post‑mortems

**Purpose:** Single place to record incidents, regressions, and near‑misses.
Each entry documents what happened, why, and how we avoid it.

Use this file to answer: _“What has gone wrong before,
and what did we learn?”_

## When to add an incident

Add an entry whenever:

- A production or staging issue occurs during or after a phase.
- A phase uncovers a serious bug, data issue, or security risk.
- A test failure reveals a non‑obvious edge case worth remembering.

## Incident entry template

Copy this block for each new incident:

```markdown
### [Short title]

- **Date:** YYYY‑MM‑DD
- **Plan / Phase:** `PLAN_<slug>.md` — Phase N: [Title]
- **Environment:** [local / staging / production]
- **Impact:** [What broke / who was affected]
- **Root cause:** [Underlying cause, with links to code if relevant]
- **Detection:** [How we discovered it]
- **Resolution:** [What we changed to fix it]
- **Prevention / follow‑ups:**
  - [Action item 1]
  - [Action item 2]
```

## Recorded incidents

### Multi-Tenant Isolation Hardening (Certification)

- **Date:** 2026-03-24
- **Plan / Phase:** `PLAN_security_isolation_fix.md` —
  Phase 5: Automated Enforcement & Certification
- **Environment:** local
- **Impact:** Hardened 15+ core API routes against multi-tenant leaks.
- **Root cause:** Early-stage API routes lacked systematic `organizationId`
  scoping in certain `findMany` and `update` operations.
- **Detection:** Discovered by `ralph-skill-discover.js` during audit.
- **Resolution:** Conducted a 4-phase systematic remediation pass.
  Added explicit `organizationId` filters and `deletedAt: null` guards to all
  high-risk routes (Gates, Scans, CRM, Contacts, Units, QR Codes, Analytics).
- **Prevention / follow-ups:**
  - Automated security discovery is now part of the verification loop.
  - Next: Phase 6 will implement a dedicated Gate-Assignment UI.

### Multi-Tenant Isolation — UI-Inclusive Final Certification

- **Date:** 2026-04-02
- **Plan / Phase:** `PLAN_security_isolation_fix.md` —
  Phase 7: Final Certification & Audit
- **Environment:** local
- **Impact:** Certified 100% compliance across all 30+ dashboard API routes,
  including the new Gate-Assignment Management UI.
- **Root cause:** Final verification pass including the Phase 6 UI components.
- **Detection:** `node scripts/ralph/ralph-skill-discover.js` — Zero security
  violations found (100% Compliance Score).
- **Resolution:** The initiative is now officially complete. All core services
  (Gates, Scans, CRM, Analytics, QR, and Gate-Assignments) are confirmed
  secure and multi-tenant isolated.
- **Prevention / follow-ups:**
  - Automated security discovery is now a hard-gate in the workflows.
  - Recommended: Regular audit of `GateAssignment` model usage.
