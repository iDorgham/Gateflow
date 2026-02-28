## Context Files (Shared Brain)

This directory stores **context documents** that drive planning across all tools.

- **Idea files**: `IDEA_<slug>.md`
  - **Created by**: Cursor `/idea` command (and equivalent flows in other tools)
  - **Used by**:
    - `/plan` to create or refine `PLAN_<slug>.md`
    - `/dev` and `/ship` to understand original intent while executing phases
    - Kiro/Antigravity/CLIs as shared background context (never as an alternate planning system)
  - Each idea file should briefly capture:
    - Problem and motivation
    - Constraints and success criteria
    - Links to relevant specs (PRDs, design docs)
    - Status and next steps

- **Product brain**: `PRODUCT_BRAIN.md`
  - High-level product narrative, personas, core flows, and terminology.
  - Read by all IDEs/CLIs as background context when interpreting ideas, plans, and phases.

- **Project config**: `GATEFLOW_CONFIG.md`
  - Operational configuration for the monorepo (apps, ports, security invariants, branching).
  - Tools should read this alongside `CLAUDE.md` and `.cursor/rules/00-gateflow-core.mdc` when reasoning about environment or setup.

Treat:

- `docs/plan/context/IDEA_<slug>.md`
- `docs/plan/context/PRODUCT_BRAIN.md`
- `docs/plan/context/GATEFLOW_CONFIG.md`
- `docs/plan/execution/PLAN_<slug>.md`
- `docs/plan/execution/PROMPT_<slug>_phase_<N>.md`

as the **single source of truth** for ideas, context, plans, and phases across all IDEs and CLIs.

