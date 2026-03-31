# Phase 01: Intent taxonomy & KPI contract

### Primary role

**PLANNING** (with ARCHITECTURE support)

### Preferred tool

- [x] Cursor IDE
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Kiro/Kilo/Qwen

### Skills to load

- `planner`, `seo-planning`, `seo-core`, `i18n`, `architecture`

### MCP

- **Context7** for any framework/library reference needed

### Context

- `docs/plan/planning/marketing_growth_engine_q3_2026/CONTEXT_marketing_growth_engine_q3_2026.md`
- `docs/plan/context/IDEA_marketing_growth_engine_q3_2026.md`
- `docs/plan/brainstorming/STRATEGY_marketing_growth_engine_q3_2026.md`

### Goal

Define a stable intent taxonomy and measurable KPI contract before implementation begins.

### Scope (in)

- CTA intent taxonomy and event naming schema
- KPI definitions and baseline-capture plan
- Mapping of existing APIs/events to planned metrics
- Numeric KPI targets and measurement windows for each metric

### Scope (out)

- No production UI code changes
- No new API route implementation

### Steps

1. Create taxonomy for `demo`, `pilot`, `migration`, `consult` intent paths.
2. Define event schema and required fields for reporting.
3. Document KPI metrics and baseline data extraction steps.
4. Lock target thresholds:
   - Demo CTA conversion: +20% relative uplift
   - Qualified lead rate: +15% relative uplift
   - Campaign -> first scan linkage: >= 70% join coverage
   - EN/AR parity gap: <= 10% relative gap
5. Confirm feasibility against current API route map and analytics surfaces.
6. Update phase tasks as complete when accepted.

### Acceptance criteria

- [ ] Intent taxonomy documented and unambiguous
- [ ] KPI contract includes `campaign -> qualified lead -> first scan`
- [ ] AR/EN considerations included in metric specs
- [ ] KPI target values and measurement windows are explicitly documented
