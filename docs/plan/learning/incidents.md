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
- **What went wrong:** For a short period, `PRD_v7.0.md` existed both at `docs/` and under `docs/archive/plan-legacy/phase-1-mvp/specs/` without clearly marking the root file as canonical.
- **Root cause:** Transition from legacy docs to Docs v2 while keeping history intact; initial structure was not immediately clarified.
- **Follow-up actions:**
  - Mark root `docs/PRD_v7.0.md` as canonical in its header.
  - Add `docs/README.md` to explain the new structure and archive location.

# GateFlow — Incidents & Post‑mortems

**Purpose:** Single place to record incidents, regressions, and near‑misses that occur while executing phases in `PLAN_<slug>.md`. Each entry should document what happened, why, and how we will avoid it in future phases.

Use this file to answer: *“What has gone wrong before, and what did we learn?”*

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

No incidents have been recorded yet. Use the template above to add the first entry the next time a phase uncovers a significant issue.

