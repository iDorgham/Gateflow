---
name: prompt
description: From DRAFT_<slug>.md (and IDEA), write FOR_PLAN_PROMPT.md — a single block to drive /plan <slug>.
---

# /prompt — Handoff Prompt for `/plan`

Use **`/prompt <slug>`** after **`/draft`** (or when the user has a clear spec) to produce **one file** that **`/plan <slug>`** can consume as the primary instruction source.

## Input

- `docs/plan/Draft/<slug>/DRAFT_<slug>.md` (required for best results)
- `docs/development/initiatives/IDEA_<slug>.md` (optional)
- User message in chat (optional overrides)

## Output

Write or replace:

**`docs/plan/Draft/<slug>/FOR_PLAN_PROMPT.md`**

Structure the file as:

1. **Mission** — One paragraph outcome.
2. **In scope / Out of scope**
3. **Users & constraints** — Tenancy, security, perf, i18n, apps touched (`apps/...`, `packages/...`).
4. **Definition of done** — Tests, lint, docs, feature flags, etc.
5. **Suggested phase breakdown** — Numbered high-level phases (titles only); `/plan` will expand into full prompts.
6. **References** — IDEA path, PRD links, Figma, prior plans under `Complete/<slug>/` if relevant.

End with a **literal block** the user can copy:

```text
/plan <slug>
```

Use the actual slug in place of `<slug>`.

## Rules (for agents)

- Do not write `PLAN_<slug>.md` or `phases/` here — **`/plan`** owns that.
- Keep `FOR_PLAN_PROMPT.md` under **5–8 minutes** reading time; move detail to `DRAFT_<slug>.md` if needed.
- If `Draft/<slug>/` does not exist, create it (same as `/draft <slug>`) then write `FOR_PLAN_PROMPT.md`.
