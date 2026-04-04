---
name: draft
description: Start or continue a draft initiative folder under docs/plan/Draft/<slug>/ (DRAFT_<slug>.md). Use /draft c to refine and reorganize ideas before /prompt and /plan.
---

# /draft — Capture & Iterate Plan Intent (Pre-`/plan`)

Use **`/draft`** to create or extend **raw planning notes** before a formal phased plan exists. Output lives under **`docs/plan/Draft/<slug>/`** so it stays aligned with the **Draft → Ready → Active → Complete** lifecycle (`docs/development/PLAN_LIFECYCLE.md`).

## Commands

- **`/draft <slug>`** — Create `docs/plan/Draft/<slug>/` if needed. Create or open **`DRAFT_<slug>.md`** from `docs/development/plan-templates/DRAFT_CAPTURE_template.md` when missing. Append the user’s latest message as a new dated section (or merge if they paste a full spec).
- **`/draft <slug> c`** or **`/draft <slug> continue`** — **Continue mode:** Read `DRAFT_<slug>.md` + any `docs/development/initiatives/IDEA_<slug>.md`. Rewrite into clearer sections (Goals, Non-goals, Users, Constraints, Risks, Open questions, Suggested phases sketch). Preserve meaning; improve structure and wording. Save back to `DRAFT_<slug>.md` and list what changed at the top of the file in a short changelog bullet list.
- **`/draft c`** (no slug) — Use the **most recently modified** `DRAFT_*.md` under `docs/plan/Draft/` (if unambiguous); if ambiguous, ask the user for `<slug>`.

## Rules (for agents)

- Do **not** create `PLAN_<slug>.md` or phase prompts here — that is **`/plan`**.
- Use **snake_case** slugs (e.g. `billing_exports_v2`).
- After the user is satisfied with the draft, they run **`/prompt <slug>`** then **`/plan <slug>`**.

## Related

- `/prompt <slug>` — Builds `FOR_PLAN_PROMPT.md` for paste-friendly `/plan` input.
- `/idea` — Broader initiative file in `docs/development/initiatives/`; can link from the draft.
