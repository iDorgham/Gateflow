# Phase N: Phase Title

---

## Phase N: Phase Title

### Primary role

BACKEND | FRONTEND | SECURITY | DATABASE | MOBILE

### Preferred tool

- [x] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors
- [ ] Kilo CLI — free agentic, large context
- [ ] Qwen CLI — free agentic, 480B reasoning
- [ ] Cursor IDE — UI/visual iteration (manual)
- [ ] Kiro IDE — review, specs (manual)

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (port 3001), admin-dashboard (3002), scanner-app, marketing (3000)
- **Packages**: db, types, ui
- **Rules**: pnpm only; multi-tenant (`organizationId`); RTL-safe (logical CSS)
- **Refs**: `CLAUDE.md`, `packages/db/src/tenant.ts`, `docs/plan/context/IDEA_<slug>.md`

### Goal

> One clear sentence: what will exist after this phase that didn't before.

### Scope (in)

- Item 1
- Item 2
- Item 3

### Scope (out)

- Deferred item A (Phase N+1)
- Deferred item B

### Steps (ordered)

1. Step 1 — describe action
2. Step 2 — describe action
3. Run `pnpm turbo lint --filter=<workspace>`
4. Run `pnpm turbo typecheck --filter=<workspace>`
5. Run `pnpm turbo test --filter=<workspace>`
6. Commit: `git commit -m "feat(<scope>): <description>"`

### Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] All tests pass (`pnpm turbo test --filter=<workspace>`)
- [ ] Build green (`pnpm turbo build --filter=<workspace>`)
- [ ] No IDOR / multi-tenancy leaks
