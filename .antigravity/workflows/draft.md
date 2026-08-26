---
name: draft
description: Start or continue a draft initiative folder under docs/plan/Draft/<slug>/ (DRAFT_<slug>.md). Use /draft c to refine and reorganize ideas before /prompt and /plan.
---

# /draft — Capture & Iterate Plan Intent (Pre-`/plan`)

Use **`/draft`** to create or extend **raw planning notes** before a formal
phased plan exists. Output lives under **`docs/plan/Draft/<slug>/`** so it stays
aligned with the **Draft → Ready → Active → Complete** lifecycle
(`docs/development/PLAN_LIFECYCLE.md`).

## Commands

- **`/draft <slug>`** — Create `docs/plan/Draft/<slug>/` if needed. Create or open
  **`DRAFT_<slug>.md`** from `docs/development/plan-templates/DRAFT_CAPTURE_template.md`
  when missing. **Always append** the user’s latest message as a new dated section
  or merge it into the relevant section. Never remove previous brainstorming data.
- **`/draft <slug> c`** or **`/draft <slug> continue`** — **Continue mode:** Read
  `DRAFT_<slug>.md` + any `docs/development/initiatives/IDEA_<slug>.md`.
  **Merge and grow** the existing draft into clearer sections (Goals, Non-goals,
  Users, Constraints, Risks, Open questions, Suggested phases sketch). Enhance and
  structure the document WITHOUT deleting the user's previously captured intent or
  details. List additions at the top in a changelog.
- **`/draft c`** (no slug) — Use the **most recently modified** `DRAFT_*.md` under
  `docs/plan/Draft/` (if unambiguous); if ambiguous, ask the user for `<slug>`.

## Rules (for agents)

- **Additive Only**: Do not delete or replace existing ideas; instead, restructure,
  elaborate, and append.
- Do **not** create `PLAN_<slug>.md` or phase prompts here — that is **`/plan`**.
- Use **snake_case** slugs (e.g. `billing_exports_v2`).
- After the user is satisfied with the draft, they run **`/prompt <slug>`** then
  **`/plan <slug>`**.

## Related

- `/prompt <slug>` — Builds `FOR_PLAN_PROMPT.md` for paste-friendly `/plan` input.
- `/idea` — Broader initiative file in `docs/development/initiatives/`; links from
  the draft.
