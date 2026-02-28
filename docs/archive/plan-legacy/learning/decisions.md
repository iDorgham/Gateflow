# GateFlow — Architecture & Process Decisions

**Purpose:** Central log of important decisions that affect how we design, implement, and operate GateFlow. Each entry should reference the plan and phase where the decision was made and link to the relevant code and docs.

Use this file to answer: *“Why do we do it this way?”* for future phases, CLIs, and IDEs.

## Decision entry template

Copy this block for each new decision:

```markdown
### [Decision title]

- **Date:** YYYY‑MM‑DD
- **Plan / Phase:** `PLAN_<slug>.md` — Phase N: [Title] (or `Global` for repo‑wide decisions)
- **Status:** [Accepted / Deprecated / Proposed]
- **Context:** [Short description of the problem and constraints]
- **Decision:** [What we chose to do]
- **Consequences:**
  - [Positive consequence 1]
  - [Negative or trade‑off 1]
- **References:**
  - [File or doc 1]
  - [File or doc 2]
```

## Seed decisions

### Use docs/plan/learning as shared knowledge base

- **Date:** 2026‑02‑27
- **Plan / Phase:** `cursor-god-mode-final` — Roadmap step “add learning docs and begin capturing outcomes from each phase”
- **Status:** Accepted
- **Context:** We needed a single, tool‑agnostic place for Cursor, CLIs, Kiro, and Antigravity to consume cross‑phase learnings without duplicating planning logic in every tool.
- **Decision:** Store reusable patterns, incidents, and decisions under `docs/plan/learning/` and treat these files as the canonical learning layer for all phase execution.
- **Consequences:**
  - Phases and prompts stay focused on *what* to do, while `learning/` captures *what we learned* across plans.
  - All tools can index a single directory to reuse prior work, making future planning and reviews faster.
  - Requires lightweight discipline to update learning docs when phases complete or incidents occur.
- **References:**
  - `.cursor/plans/cursor-god-mode-final_005f5566.plan.md`
  - `docs/plan/learning/patterns.md`
  - `docs/plan/learning/incidents.md`

