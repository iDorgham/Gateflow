# Pro Prompt Template — Phase N

Copy this template for each phase. Fill placeholders and save as `docs/plan/{planning,planned,in-progress}/<slug>/PROMPT_<initiative>_phase_<N>.md`.

---

## Phase N: [Title]

### Primary role

From `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`: [PLANNING | ARCHITECTURE | SECURITY | BACKEND-Database | BACKEND-API | FRONTEND | MOBILE | QA | i18n | DEVOPS | EXPLORE]

Use this role when implementing in Kilo or when invoking CLIs for this phase.

### Skills to load

Load these skills when implementing (from `.kilocode/skills/`):

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

### Preferred tool

- [x] Kilo (default)
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
5. After phase passes: git add, commit (conventional), pull --rebase, push

### Subagents (optional)

Invoke these *before* or *during* implementation when the phase needs exploration or verification.

| Subagent | When | Prompt |
|----------|------|--------|
| **explore** | Need to trace flows or find code | "Trace the end-to-end flow for [X] (UI → API → DB). Return key files and call graph." |
| **shell** | Preflight, migrate, test | "Run pnpm preflight and report failures with file:line." |
| **browser-use** | Verify UI after changes | "Login at localhost:3001, navigate to [pages], verify [behaviors]." |

### Commands (when to run)

- **Before phase**: clean git, run `pnpm preflight`
- **After phase**: git add, commit (conventional), pull --rebase, push
- **Security/audit phase**: multi-CLI review

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

### Escalation (optional)

If during implementation you discover the scope exceeds this phase:
- **Break down**: Add a follow-up phase to the plan
- **Investigate first**: Run explore subagent to map dependencies
- **Security**: If touching auth/RBAC/QR and phase isn't SECURITY-primary, pause and add SECURITY phase or review
