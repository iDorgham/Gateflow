# GateFlow Guide & Agent Response Contract

All Workflow v2 commands and autonomous agent outputs strictly implement this standardized, highly organized, and intelligence-driven response structure.

---

## Required Response Layout & Section Order

Every agent or guide response MUST follow this exact, structured order:

### 1. `Status: [READY | BLOCKED | GATE | DONE]`

- High-level state indicator:
  - `READY`: Ready to proceed to the next lifecycle command without blockers.
  - `BLOCKED`: Blocked by missing prerequisites, failed checks, or environment errors.
  - `GATE`: Awaiting deterministic gate verification or explicit user confirmation.
  - `DONE`: Current task, phase, or initiative lifecycle step is fully completed.

### 2. `Situation`

- A clean, high-density markdown table summarizing the live state:
  - **Active application**: App under development or audit (e.g. `client-dashboard`, `resident-mobile`, `packages/db`).
  - **Current stage**: Current workflow stage and phase status (`Planning`, `Draft`, `Active`, `Complete`).
  - **Current plan**: Active plan slug, path, and phase number.
  - **Pilot-flow coverage**: Completed and outstanding pilot gates with deterministic evidence.
  - **Page-score summary**: Current focused-page scores and evidence freshness.
  - **DevOps & GitHub pipeline**: Exact position in the lifecycle:
    `Plan ➜ Dev ➜ GitHub/Branch ➜ PR Create ➜ 5-Gate Review ➜ Fix CI ➜ Merge ➜ Docs/Deploy`
  - **Coverage & test readiness**: Unit test status, verification logs, and acceptance gates.
  - **Blockers**: Any blocking condition or invariant constraints.

### 3. `Why this is next`

- A concise, evidence-based explanation specifying:
  - Why this specific step follows from recent code changes and test outputs.
  - Dependencies completed or prerequisites verified.
  - Strategic objective for the upcoming step.

### 4. `Action`

Divided into three explicit categories:

- **Must do**:
  - The single mandatory action required to advance the initiative or workflow.
  - Explicitly route to GitHub lifecycle actions where appropriate:
    - **Create Branch**: `/github branch feat/<slug>`
    - **Inspect Repository**: `/github`
    - **Create Pull Request**: `gh pr create --title "..." --body "..."`
    - **5-Gate PR Review**: `/review <pr_number>`
    - **Triage & Fix CI**: `pnpm turbo test lint typecheck`
    - **Safe Merge**: `/review <pr_number> --merge`
- **Recommended**:
  - Proactive quality enhancements, test expansion, token semantic checks, RTL validation, or backlog prioritization.
- **Critical**:
  - Security invariants (tenant isolation, AES-256-GCM PII encryption), breaking migrations, and data protection alerts.

### 5. `Copy-ready prompt`

- A self-contained, fully contextual prompt block ready to copy and run directly or paste into any AI CLI / assistant:
  - Line 1: The exact slash command (e.g., `/dev <slug> <N>`, `/github`, `/review`, `/plan`).
  - Target application and plan paths.
  - Required role and tool recommendations.
  - Explicit deliverables, acceptance criteria, and mutation boundaries.

### 6. `Next command`

- Exactly ONE executable slash command formatted in a single code block for instantaneous execution:
  ```text
  /<command> [args]
  ```

---

## Canonical Lifecycle Pipeline Reference

```
+-----------------------------------------------------------------------------------+
|                            GateFlow DevOps & Dev Loop                             |
+-----------------------------------------------------------------------------------+
|  1. /draft <slug>       ➜ Refine and capture initiative concepts                  |
|  2. /prompt <slug>      ➜ Generate high-density FOR_PLAN_PROMPT.md                |
|  3. /plan <slug>        ➜ Generate 3-phase PLAN, TASKS, and per-phase prompts     |
|  4. /dev <slug> <N>     ➜ Implement phase N end-to-end (code + tests + phase_log) |
|  5. /github             ➜ Inspect git diff, verify branch, and prepare PR         |
|  6. /review             ➜ Run 5-gate audit (Security, Invariants, Perf, Tests)    |
|  7. Fix CI / Checks     ➜ Resolve any CI or lint errors deterministically         |
|  8. /review --merge     ➜ Squash merge and delete feature branch                  |
|  9. /docs & /version    ➜ Update CHANGELOG/PRD and prepare the semantic release   |
| 10. /audit or /certify  ➜ Verify deterministic pilot and release evidence         |
| 11. /deploy <app>       ➜ Dispatch the authorized manual Vercel release            |
+-----------------------------------------------------------------------------------+
```

---

## Style & Tone Rules

- **Organized & Clear**: Use structured markdown tables, bulleted lists, and clear headers.
- **Evidence-Based**: Reference actual files (`file:///...`), test results, and deterministic diffs.
- **Zero Fluff**: Avoid empty decorative text, unsupported percentages, or fake progress bars.
- **Strict Single Next Command**: Never output multiple conflicting next commands. Provide one definitive next command.
