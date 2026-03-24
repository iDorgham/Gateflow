# Pro Prompt Template — Phase N

Copy this template for each phase. Fill placeholders and save as `docs/plan/{planning,planned,in-progress}/<slug>/PROMPT_<initiative>_phase_<N>.md`.

**Enrichment:** Add **Skills**, **MCP**, **Subagents**, **Commands** when the phase benefits. See `docs/plan/PLANNING_ENHANCEMENTS.md` and `.antigravity/skills/gf-planner/SKILL.md`.

---

## Phase N: [Title]

### Primary role

From `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` (or `docs/archive/plan-legacy/guidelines/SUBAGENT_HIERARCHY.md`): [PLANNING | ARCHITECTURE | SECURITY | BACKEND-Database | BACKEND-API | FRONTEND | MOBILE | QA | i18n | DEVOPS | EXPLORE]

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

**Process skills (apply based on task type):**
- [ ] `using-superpowers` — always check skills first before any response
- [ ] `test-driven-development` — write failing test BEFORE any behavior-changing code
- [ ] `systematic-debugging` — when fix attempts fail or cause is unclear
- [ ] `verification-before-completion` — before claiming done, committing, or opening PR
- [ ] `executing-plans` — disciplined batch execution with checkpoints
- [ ] `subagent-driven-development` — when phase has 3+ independent sub-tasks
- [ ] `dispatching-parallel-agents` — when 2+ unrelated failures exist in parallel
- [ ] `brainstorming` — when requirements are unclear or creative work is needed
- [ ] `finishing-a-development-branch` — when implementation complete, before PR merge
- [ ] `requesting-code-review` — after pushing, before merging
- [ ] `receiving-code-review` — when reviewer comments arrive
- [ ] `using-git-worktrees` — for risky or parallel work requiring isolation
- [ ] `writing-skills` — when a new recurring pattern should become a skill

**Domain skills (load by phase domain):**
- [ ] gf-security — auth, RBAC, QR, multi-tenant
- [ ] gf-database — Prisma, migrations, queries
- [ ] gf-api — API routes, validation, rate limiting
- [ ] gf-mobile — Expo, offline sync
- [ ] gf-architecture — monorepo, conventions
- [ ] gf-testing — Jest, test patterns
- [ ] (none — skip for straightforward phases)

### MCP to use

| MCP | When |
|-----|------|
| Prisma-Local | Schema change, migration, Prisma Studio |
| Context7 | React/Next.js/Prisma API lookup |
| cursor-ide-browser | E2E verification after UI changes |

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

#### Subagents (optional)

Invoke these *before* or *during* implementation when the phase needs exploration or verification.

| Subagent | When | Prompt |
|----------|------|--------|
| **explore** | Need to trace flows or find code | "Trace the end-to-end flow for [X] (UI → API → DB). Return key files and call graph." |
| **shell** | Preflight, migrate, test | "Run pnpm preflight and report failures with file:line." |
| **browser-use** | Verify UI after changes | "Login at localhost:3001, navigate to [pages], verify [behaviors]." |

### Commands (when to run)

- **Before phase**: `/ready` — clean git, run `pnpm preflight`
- **After phase**: `/github` — add, commit (conventional), pull --rebase, push
- **Security/audit phase**: `/clis team audit` — multi-CLI review

### Acceptance criteria

**Checklist:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] `pnpm turbo lint --filter=<workspace>` passes
- [ ] `pnpm turbo typecheck --filter=<workspace>` passes
- [ ] `pnpm turbo test --filter=<workspace>` passes (or no regression)

**Given/When/Then (optional — for precise behavior):**
- **Given** [precondition], **When** [action], **Then** [expected outcome]

### Files likely touched

- `path/to/file1.ts`
- `path/to/file2.tsx`

### Multi-CLI (optional — only for complex/high-risk phases)

**Use sparingly.** Claude Pro has limits — add only when the phase is security-critical, architectural, or high-risk.
- Routine CRUD, simple UI, config: **skip multi-CLI**
- Auth, multi-tenant, offline sync, conflict resolution: consider `claude -p "[prompt]"` in a separate terminal

### Escalation (optional)

If during implementation you discover the scope exceeds this phase:
- **Break down**: Add a follow-up phase to the plan
- **Investigate first**: Run explore subagent to map dependencies
- **Security**: If touching auth/RBAC/QR and phase isn't SECURITY-primary, pause and add SECURITY phase or review
