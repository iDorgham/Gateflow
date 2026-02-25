# GateFlow — AI Skills, Subagents, and Rules

This document defines **how we use AI assistance in this repo**: which skills exist, when to use subagents, and the engineering rules that must be followed to keep GateFlow safe, consistent, and shippable.

---

## What GateFlow is (context in 30 seconds)

GateFlow is a **Zero‑Trust digital gate infrastructure platform** (MENA-focused) spanning:

- **Web apps (Next.js 14)**: `apps/client-dashboard`, `apps/admin-dashboard`, `apps/marketing`, `apps/resident-portal` (planned)
- **Mobile apps (Expo SDK 54)**: `apps/scanner-app`, `apps/resident-mobile` (planned)
- **Shared packages**: `packages/db`, `packages/types`, `packages/ui`, `packages/api-client`, `packages/i18n`, `packages/config`

Primary flows: **QR generation (signed)** → **scan (online/offline)** → **audit logs + analytics** → **exports/integrations (webhooks/API keys)**.

Reference: `CLAUDE.md`, `docs/PRD_v5.0.md`, `docs/APP_DESIGN_DOCS.md`.

---

## Skills available in this workspace

### `superdesign`

- **Purpose**: UI/UX design exploration + infinite-canvas drafts, then mapping to production UI.
- **Trigger it when**:
  - Designing/redesigning a page, flow, layout, or component.
  - You need to align a UI change with existing tokens/components.
  - The user mentions SuperDesign or SuperDesign CLI commands.
- **Where**: `.cursor/skills/superdesign/SKILL.md`
- **Important**: Follow the skill’s mandatory pre-checks (CLI install + login), and keep `.superdesign/init/` current.

### Cursor workflow skills (system-level)

These are useful when the task is explicitly about Cursor configuration or authoring new skills/rules:

- **Create Cursor rules**: `.cursor/skills-cursor/create-rule/SKILL.md`
- **Create a new skill**: `.cursor/skills-cursor/create-skill/SKILL.md`
- **Install skills**: `~/.codex/skills/.system/skill-installer/SKILL.md`
- **Update Cursor settings**: `.cursor/skills-cursor/update-cursor-settings/SKILL.md`

If you’re making product changes (API/UI/mobile), you typically won’t use these unless asked.

---

## Subagents: when to use which one

Use subagents to reduce latency and keep context clean. Pick the smallest tool for the job.

### Explore subagent (codebase scanning)

Use when you need to **understand an area of the repo quickly**:

- Finding where a feature is implemented (routes, schemas, components)
- Mapping a flow across apps/packages
- Locating all references for a refactor

**Good prompts**:
- “Where is QR signature verified and how is it used by scanner sync?”
- “List all API routes involved in onboarding and token issuance.”

### Shell subagent (commands + git + builds)

Use when you need to run **multiple terminal actions**:

- `pnpm` / turbo pipelines, tests, typecheck
- git inspection (status/diff/log), PR creation via `gh`
- local scripts, prisma generate/migrate

### Browser-use subagent (UI verification)

Use when you need **multi-step UI verification** or “click-through testing”:

- Validate navigation, auth redirect loops, table filters, exports, i18n switching
- Capture screenshots or confirm UI states after changes

### General-purpose subagent (mixed investigation)

Use when the task is ambiguous or spans code + docs + behavior and you want one agent to synthesize findings, but still keep a tight scope (avoid “do everything” prompts).

---

## Subagent prompt recipes (copy/paste)

### Explore

- **Trace a flow**: “Trace the end-to-end flow for \<X\> (UI → API routes → DB models). Return the key files and a short call graph.”
- **Refactor discovery**: “Find all places where \<symbol/string\> is used across apps/packages and group by feature area.”
- **Route inventory**: “List all API routes under \<path\> and summarize inputs/outputs/auth requirements.”

### Shell

- **Pre-PR checks**: “Run lint + typecheck + tests for only the affected workspaces: \<filters\>. Return failures with file/line.”
- **Release sanity**: “Run `pnpm turbo build` and report any workspace that fails with the first actionable error.”

### Browser-use

- **Regression pass**: “Login as \<role\>, navigate to \<pages\>, verify \<behaviors\>, and capture screenshots for any broken states.”
- **i18n check**: “Toggle locale and verify routes, navigation labels, and RTL/LTR layout correctness.”

---

## Repo rules (non‑negotiable)

### Package manager

- **Use `pnpm` only**. Never use `npm` or `yarn`.
- Root scripts: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm typecheck`.

### Multi-tenancy and soft deletes

Any query touching tenant data must:

- **Scope by `organizationId`** (row-level tenant isolation)
- **Filter soft deletes** with `deletedAt: null` where applicable

Schema location: `packages/db/prisma/schema.prisma`.

### Auth and token handling

- Access tokens are **short-lived** (15 min). Always handle refresh flows.
- **Never store tokens in `localStorage`**. Use secure cookies (web) / SecureStore (mobile).

### QR security

- QR payloads must be **HMAC‑SHA256 signed** (no unsigned QRs).
- Scanner must preserve **`scanUuid` deduplication** contract for offline sync.

### Secrets and environment variables

- **Never commit** `.env` / `.env.local`.
- Prefer `.env.example` for variable keys only.
- If an env var is security-critical, prefer **hard fail** over unsafe defaults.

Reference: `docs/ENVIRONMENT_VARIABLES.md`, `docs/CODE_QUALITY_AND_PERFORMANCE_AUDIT.md`.

### Shared packages and imports

- Use workspace package imports (`@gate-access/db`, `@gate-access/types`, `@gate-access/ui`, …).
- Avoid duplicating shared utilities in apps if `packages/*` already owns them (e.g., `cn()` should come from `@gate-access/ui`).

---

## “Definition of done” for AI-assisted changes

- **Correctness**: Works for the intended role(s) and tenant scope.
- **Security**: No new unsafe defaults, no secrets in git, QR/auth invariants preserved.
- **Quality**: Lint + typecheck pass for touched workspaces; tests added/updated for critical logic.
- **Docs**: Update `docs/` when behavior or setup changes.

---

## Where to look first (fast navigation)

- **Product / requirements**: `docs/PRD_v5.0.md`, `docs/RESIDENT_PORTAL_SPEC.md`
- **System design**: `docs/APP_DESIGN_DOCS.md`, `docs/PROJECT_STRUCTURE.md`
- **Security model**: `docs/SECURITY_OVERVIEW.md`, `docs/CODE_QUALITY_AND_PERFORMANCE_AUDIT.md`
- **Roadmaps**: `docs/IMPROVEMENTS_AND_ROADMAP.md`, `docs/PHASE_2_ROADMAP.md`

