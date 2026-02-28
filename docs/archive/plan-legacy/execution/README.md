# Execution Artifacts

Plans and pro prompts for phased development. See `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` for the full workflow.

## Workflow

1. **Capture idea** → Use `/idea` to create or refine `context/IDEA_<slug>.md` and update the backlog.
2. **Create plan** → Use `/plan` (planning subagent) → save `PLAN_<slug>.md`.
3. **Write pro prompts** → Use `.cursor/templates/TEMPLATE_PROMPT_phase.md` (with **Primary role** and **Preferred tool**) → save `PROMPT_<slug>_phase_N.md`.
4. **Execute** → Use `/dev` to apply phase N (implement → test → git) or `/ship` to run all remaining phases.
5. **Capture learnings** → After each phase, update `docs/plan/learning/patterns.md`, `incidents.md`, or `decisions.md` with any reusable patterns, incidents, or decisions uncovered during execution.

## Files

| File | Purpose |
|------|---------|
| `.cursor/templates/TEMPLATE_PROMPT_phase.md` | Template for pro prompts |
| `PLAN_<name>.md` | Phased plan (output of planning subagent) |
| `PROMPT_<name>_phase_N.md` | Pro prompt for phase N |

## Example

- `PLAN_resident_portal.md` — Plan for Resident Portal Phase 2
- `PROMPT_resident_portal_phase_1.md` — Add Unit model
- `PROMPT_resident_portal_phase_2.md` — Add VisitorQR model
- …
