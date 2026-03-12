# GateFlow — Learning Patterns

**Purpose:** Canonical place to capture reusable implementation patterns that emerge from executing phases in `PLAN_<slug>.md` and their `PROMPT_<slug>_phase_<N>.md` pro prompts.

Use this file to answer: *“How did we solve this before?”* for future phases, CLIs, and IDEs.

## How to use this doc

- After completing a phase, if you discover a technique that is likely to repeat, add a new pattern entry.
- Keep each pattern **grounded in a specific plan + phase** so it is easy to trace back to code and docs.
- Reference the **exact files** (routes, components, schema, skills, prompts) where the pattern is implemented.

## Pattern entry template

Copy this block for each new pattern:

```markdown
### [Pattern name]

- **Context:** `PLAN_<slug>.md` — Phase N: [Title]
- **Problem:** [What we needed to solve]
- **Pattern:** [How we solved it — the repeatable part]
- **Trade‑offs:** [When to use / not use this pattern]
- **References:**
  - [File or doc 1]
  - [File or doc 2]
```

## Seed patterns

### Phase-driven knowledge capture

- **Context:** `cursor-god-mode-final` — Plan section “Shared Knowledge Base (Plans & Learnings)” and roadmap step “add learning docs and begin capturing outcomes from each phase”.
- **Problem:** Knowledge from phases was scattered across chats and code, making it hard for Cursor, CLIs, and other IDEs to reuse past solutions.
- **Pattern:** For every plan, use:
  - `PLAN_<slug>.md` for phases and scope,
  - `PROMPT_<slug>_phase_<N>.md` for execution prompts,
  - `docs/plan/learning/patterns.md`, `incidents.md`, and `decisions.md` to capture cross‑phase learnings and make them discoverable to all tools.
- **Trade‑offs:** Adds a small documentation step to each phase, but greatly reduces future planning time and duplicated work.
- **References:**
  - `.cursor/plans/cursor-god-mode-final_005f5566.plan.md`
  - `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md`

