---
name: idea
description: Capture a high-level GateFlow initiative into docs/development/initiatives/IDEA_<slug>.md and backlog entry.
---

# /idea — Capture Initiative

Use **`/idea <slug>`** to record a new initiative before drafting or planning.

## What `/idea` does

1. Create or update **`docs/development/initiatives/IDEA_<slug>.md`** (snake_case slug).
2. Capture: problem, users, success criteria, constraints, links to PRD/docs.
3. Optionally add a row or section in **`docs/plan/backlog/ALL_TASKS_BACKLOG.md`**.
4. Point next step to **`/draft <slug>`** then **`/prompt <slug>`** → **`/plan <slug>`**.

## Commands

- **`/idea <slug>`** — Create/open IDEA file; append user context from chat.
- **`/idea new <slug>`** — Same as above (alias).

## Rules

- Do **not** create `PLAN_<slug>.md` here — use **`/plan`**.
- Prefer additive edits; do not erase prior IDEA content.
- After capture, suggest: `/draft <slug>` to expand under `docs/plan/Draft/<slug>/`.

## Related

- **`/draft`** — raw plan notes in `docs/plan/Draft/<slug>/DRAFT_<slug>.md`
- **`/brainstorm`** — strategic exploration before formal IDEA
- **`/guide`** — what to do next
