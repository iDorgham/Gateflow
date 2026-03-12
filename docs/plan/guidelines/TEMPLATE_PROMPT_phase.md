# Pro Prompt Template — Phase N

Copy this template for each phase. Fill placeholders and save as `docs/plan/execution/PROMPT_<initiative>_phase_<N>.md`.

**SuperDesign:** For UI phases, add "SuperDesign" and run design draft *before* implementation. **Subagents:** Add when the phase benefits from explore/shell/browser-use. See `.cursor/skills/gf-planner/SKILL.md`.

---

## Phase N: [Title]

### Primary role

From `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`: [PLANNING | ARCHITECTURE | SECURITY | BACKEND-Database | BACKEND-API | FRONTEND | MOBILE | QA | i18n | DEVOPS | EXPLORE]

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Preferred tool

- [ ] Cursor (default)
- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors
- [ ] Multi-CLI — high-risk phases only (compare 2 models before acting)

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Apps**: client-dashboard (3001), admin-dashboard (3002), scanner-app (8081), marketing (3000)
- **Packages**: db, types, ui, api-client, i18n, config
- **Rules**: pnpm only; multi-tenant (`organizationId`); soft deletes (`deletedAt: null`); QR HMAC-SHA256; no secrets in git
- **Refs**: `CLAUDE.md`, `packages/db/prisma/schema.prisma`, `docs/plan/backlog/ALL_TASKS_BACKLOG.md`

### Goal

[One clear sentence: what this phase must achieve]

### Scope (in)

- [Item 1]
- [Item 2]
- [Item 3]

### Scope (out)

- [Explicitly exclude] — do not touch [X]

### Steps (ordered)

1. [Concrete step with file paths]
2. [Concrete step]
3. [Add/update tests for...]
4. Run `pnpm turbo lint --filter=<workspace>`, `pnpm turbo typecheck --filter=<workspace>`, and `pnpm turbo test --filter=<workspace>`
5. After phase passes: `/github` — git add, commit (conventional), pull --rebase, push

### SuperDesign (optional — for UI phases)

Run *before* implementation when the phase adds or redesigns UI:

| Scenario | Action |
|----------|--------|
| New page | `superdesign create-design-draft` with design intent and `--context-file` for layout |
| Redesign | `superdesign iterate-design-draft` with improvement prompts, `--mode branch` |
| New feature area | `superdesign create-project` then drafts |

Ensure `.superdesign/init/` exists; use draft output to guide implementation. See `.cursor/skills/superdesign/SKILL.md`.

### Subagents (optional)

Invoke these *before* or *during* implementation when the phase needs exploration or verification.

| Subagent | When | Prompt |
|----------|------|--------|
| **explore** | Need to trace flows or find code | "Trace the end-to-end flow for [X] (UI → API → DB). Return key files and call graph." |
| **shell** | Preflight, migrate, test | "Run pnpm preflight and report failures with file:line." |
| **browser-use** | Verify UI after changes | "Login at localhost:3001, navigate to [pages], verify [behaviors]." |

### Acceptance criteria

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] `pnpm turbo lint --filter=<workspace>` passes
- [ ] `pnpm turbo typecheck --filter=<workspace>` passes
- [ ] `pnpm turbo test --filter=<workspace>` passes (or no regression)

### Files likely touched

- `path/to/file1.ts`
- `path/to/file2.tsx`

### Multi-CLI (optional — only for complex/high-risk phases)

**Use sparingly.** Claude Pro has limits — add only when the phase is security-critical, architectural, or high-risk.
- Routine CRUD, simple UI, config: **skip multi-CLI**
- Auth, multi-tenant, offline sync, conflict resolution: consider `claude -p "[prompt]"` in a separate terminal
