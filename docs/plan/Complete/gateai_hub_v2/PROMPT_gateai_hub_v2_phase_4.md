# Phase 4: Scheduling Engine + Automation Hub (GateAI Operations Hub v2.0)

### Primary role

AI/BACKEND

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Preferred tool

- [ ] Cursor (default)
- [ ] Claude CLI — security, architecture, complex reasoning
- [ ] Gemini CLI — DB/schema work, fast structural analysis
- [ ] OpenCode CLI — code generation, scaffolds, refactors
- [x] Multi-CLI — high-risk phases only (compare 2 models before acting) (Recommended: Kiro CLI / Qwen CLI for NLP tasks)

### Context

**Context to Load:**

1. `.antigravity/skills/gf-security/SKILL.md` — Security model, multi-tenancy, RBAC
2. `.antigravity/rules/00-gateflow-core.mdc` — pnpm, soft deletes, QR signing, auth
3. `.antigravity/contracts/CONTRACTS.md` — Authoritative invariants
4. `docs/reference/product/PRD_v8.0_COMPREHENSIVE.md` — Product requirements (Section 2.1 GateAI)
5. `docs/architecture/ARCHITECTURE.md` — System architecture, data flows
6. `packages/db/prisma/schema.prisma` — Current data model

### Goal

Implement the NLP-driven scheduling engine backed by Redis to automate report generation and CSV/PDF data exports.

### Scope (in)

- Extend AI SDK routing to support Function Calling for "Task Building" (e.g., "Email me a visitor report every Friday").
- Implement `AutomationList` UI component in the Workbench.
- Build the Upstash Redis scheduling wrapper to handle cron-like repeating jobs.
- Build server-side CSV/PDF generation pipelines for exports linked to scheduled jobs.

### Scope (out)

- Custom email template HTML design (use basic text for MVP).
- Complex multi-step agentic workflows outside of basic report scheduling.

### Steps (ordered)

1. Set up Upstash Redis queue logic in `apps/client-dashboard` or a shared package if abstracted.
2. Formulate the Vercel AI SDK function tools for parsing natural language into Prisma cron jobs.
3. Build the `AutomationList` component to view, edit, and delete active schedules. Ensure `organizationId` is strictly checked.
4. Add backend export logic (`json2csv` or `jspdf`) triggered by the Redis consumer hook.
5. Run `pnpm turbo lint`, `pnpm turbo typecheck`, and `pnpm turbo test`.
6. After phase passes: `/github` — git add, commit (conventional), pull --rebase, push.

### Acceptance criteria

- [ ] `pnpm preflight` passes (lint + typecheck + test)
- [ ] Security checks: Only users with `MANAGER` or `ADMIN` roles can create/edit automations. All tasks are isolated by `organizationId`.
- [ ] NLP to Prisma mapping operates reliably (correctly parses frequency strings).
- [ ] Schedule execution hits the mocked delivery endpoint with correct PDF/CSV formats.
- [ ] Git commit with conventional message.
- [ ] No breaking changes to existing GateAI v1.0 features.

### Adversarial Review (Mandatory for High-Risk)

**Trigger**: This phase involves Backend Automation Security and Mutative AI Calling.

1. **Invoke Adversary**: Use a second model (Gemini/Opencode) as an "Adversary."
2. **Challenge**: "Analyze the code for edge cases, race conditions, or security bypasses. Attempt to break my implementation."
3. **Loop**: Self-correct _before_ git commit.
4. **Verification**: State total corrected flaws in walkthrough.
