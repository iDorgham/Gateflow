# Execution Artifacts

<div align="center">

**Plans and pro prompts for phased development**

_See `docs/development/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` for the full workflow_

</div>

---

## Workflow

| Step | Action                                                               |
| :--- | :------------------------------------------------------------------- |
| 1    | **Capture idea** → `/idea` creates `context/IDEA_<slug>.md`          |
| 2    | **Create plan** → `/plan` (planning subagent) saves `PLAN_<slug>.md` |
| 3    | **Write pro prompts** → Template creates `PROMPT_<slug>_phase_N.md`  |
| 4    | **Execute** → `/dev` applies phase N or `/ship` runs all phases      |
| 5    | **Capture learnings** → Update `docs/development/learning/` files    |

---

## Files

| File                                         | Purpose                                   |
| :------------------------------------------- | :---------------------------------------- |
| `.cursor/templates/TEMPLATE_PROMPT_phase.md` | Template for pro prompts                  |
| `PLAN_<name>.md`                             | Phased plan (output of planning subagent) |
| `PROMPT_<name>_phase_N.md`                   | Pro prompt for phase N                    |

---

## Example

```
PLAN_resident_portal.md
PROMPT_resident_portal_phase_1.md  → Add Unit model
PROMPT_resident_portal_phase_2.md  → Add VisitorQR model
...
```

---

## Migration Note

New plans should be created in `docs/plan/Draft/` using `/plan` command.

See [docs/plan/README.md](../README.md) for current workflow.

---

<div align="center">

[Return to Archive Root](../README.md)

</div>
