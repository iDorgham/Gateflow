# Context Files

<div align="center">

**Context documents that drive planning across all tools**

_The shared brain for GateFlow initiatives_

</div>

---

## Idea Files

**Created by**: `/idea` command (Cursor, Kiro, Antigravity, CLIs)

**Used by**:

- `/plan` to create or refine `PLAN_<slug>.md`
- `/dev` and `/ship` to understand original intent
- All tools as shared background context

**Each idea file should capture**:

- Problem and motivation
- Constraints and success criteria
- Links to relevant specs (PRDs, design docs)
- Status and next steps

---

## Product Brain

`PRODUCT_BRAIN.md` — High-level product narrative, personas, core flows, and terminology.

Read by all IDEs/CLIs as background context.

---

## Project Config

`GATEFLOW_CONFIG.md` — Operational configuration for the monorepo (apps, ports, security invariants, branching).

Read alongside `CLAUDE.md` and rules when reasoning about environment.

---

## Single Source of Truth

Treat these as the **single source of truth** across all IDEs and CLIs:

```
docs/plan/context/IDEA_<slug>.md
docs/plan/context/PRODUCT_BRAIN.md
docs/plan/context/GATEFLOW_CONFIG.md
docs/plan/execution/PLAN_<slug>.md
docs/plan/execution/PROMPT_<slug>_phase_<N>.md
```

---

## Migration Note

New ideas should be created via `/idea` command in `docs/plan/context/`.

See [docs/plan/README.md](../README.md) for current workflow.

---

<div align="center">

[Return to Archive Root](../README.md)

</div>
