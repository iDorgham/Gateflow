# Phase Prompt — Part Template

Use this for **Part B, C, D** of a long phase. Part A uses the standard TEMPLATE*PROMPT_phase.md.
Save as: `docs/plan/{state}/<slug>/phases/NN*<title>/PROMPT*phase_NN_part*<letter>.md`

---

## Phase N — Part [B/C/D]: [Sub-title]

> **Continuation of Phase N Part [Previous]**
> This part assumes Part [Previous] is **complete and committed**.

### Summary of previous parts

| Part   | What was done                    | Key files created/modified                    |
| ------ | -------------------------------- | --------------------------------------------- |
| Part A | [e.g. Schema + migrations added] | `packages/db/prisma/schema.prisma`, migration |
| Part B | [e.g. API routes implemented]    | `apps/client-dashboard/src/app/api/...`       |

### Primary role

[PLANNING | ARCHITECTURE | SECURITY | BACKEND-Database | BACKEND-API | FRONTEND | MOBILE | QA | i18n | DEVOPS | EXPLORE]

### Tool Selection (Quality vs Cost)

|                            | Tool                | Why                                            |
| -------------------------- | ------------------- | ---------------------------------------------- |
| **Tool 1** (best quality)  | [e.g. Cursor]       | [e.g. UI implementation, inline feedback]      |
| **Tool 2** (free fallback) | [e.g. OpenCode CLI] | [e.g. Same quality for routine component work] |

> Use Tool 2 when Tool 1 is at 80%+ limit or on a budget day.
> Load `gf-cli-limits` skill to check before starting.

### Skills to load

- [ ] `verification-before-completion` — always
- [ ] `test-driven-development` — if behavior changes
- [ ] [domain skill] — gf-api / gf-database / gf-security / etc.

### Context

- **Depends on:** Phase N Part [Previous] committed on branch `feat/<slug>`
- **Starting state:** [e.g. Schema is migrated, API route exists at `/api/...`]
- **Rules:** pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`)

### Goal

[One sentence: what this part achieves]

### Scope (in)

- [Item 1]
- [Item 2]

### Scope (out)

- Do not redo Part A/B work
- Do not touch [X]

### Steps (ordered)

1. Verify Part [Previous] is merged: `git log --oneline -3`
2. [Concrete step with file path]
3. [Concrete step]
4. Add/update tests for [specific behavior]
5. `pnpm turbo lint --filter=<workspace>` && `pnpm turbo typecheck --filter=<workspace>` && `pnpm turbo test --filter=<workspace>`
6. After green: `/github` — commit as `feat(<scope>): phase N part [letter] - <desc>`

### Acceptance criteria

- [ ] [Criterion specific to this part]
- [ ] `pnpm turbo lint --filter=<workspace>` passes
- [ ] `pnpm turbo typecheck --filter=<workspace>` passes
- [ ] `pnpm turbo test --filter=<workspace>` passes
- [ ] No regression from previous parts

### Files likely touched

- `path/to/file1.tsx`
- `path/to/file2.ts`

### Handoff to Part [Next] / Phase [N+1]

After this part commits, the next part/phase starts with:

- [State: e.g. "Component exists at `src/components/foo.tsx`, API route live at `/api/foo`"]
