---
name: strategist
description: Strategic ideation, market research, and roadmap planning for GateFlow. Use when planning releases, auditing feature gaps, or analyzing Sass markets.
---

# Strategist Skill

Primary reference for strategic app engineering and market-driven planning in the GateFlow monorepo.

## Goal

Take GateFlow to the "next level" by aligning technical engineering with market needs, competitive standards, and strategic release planning.

## Key Capabilities

1.  **Market Research**: Deep analysis of property management, access control, and community SaaS markets using `browser-use`.
2.  **Feature Prioritization**:
    - **RICE Score**: Reach, Impact, Confidence, Effort.
    - **MoSCoW**: Must-have, Should-have, Could-have, Won't-have.
3.  **App Consolidation**: Analyzing architectural "Merge/Split/Prune" opportunities for monorepo efficiency.
4.  **Semantic Release Planning**: Mapping strategic goals to semantic versions (vX.X.X) with clear specs.
5.  **Roadmapping**: Generating 6-12 month strategic roadmaps in `docs/development/brainstorming/`.

## Frameworks to Use

- **Competitive Benchmarking**: Compare GateFlow's Gate/Scanner/Resident flow with top-tier global standards.
- **Value Engineering**: Proposing features that directly impact org efficiency or user delight.
- **Architectural Leverage**: Using shared packages (`@gate-access/*`) to launch new apps faster.

## Checkpoint Patterns

- **Research Subagent**: Always use `browser-use` to check if a proposed feature is already standard elsewhere.
- **Explore Subagent**: Audit existing routes (`docs/reference/cache/API_ROUTES_MAP.md`) before suggesting new ones to avoid redundancy.
- **PRD Alignment**: Ensure all brainstorm results eventually feed into a formal PRD or IDEA document via `/idea`.

## Interaction Logic

- **Default**: Open-ended strategic dialogue.
- **Subcommand: `research`**: Focus strictly on market competitive data.
- **Subcommand: `gaps`**: Focus strictly on what GateFlow is missing compared to "App Engineer" standards.
- **Subcommand: `release`**: Focus strictly on the "Next Step" implementation specs.
