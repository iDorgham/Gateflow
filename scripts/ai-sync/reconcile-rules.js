const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const RULES_DIR = path.join(ROOT, '.antigravity', 'rules');

// 1. 00-gateflow-core.mdc (The ONLY always-apply rule)
const r00 = `---
description: GateFlow core repo rules (must follow)
globs: *
alwaysApply: true
---

# GateFlow — Core Rules

## Package manager

- Use **pnpm only** (never npm or yarn). Prefer root scripts: \`pnpm dev\`, \`pnpm build\`, \`pnpm lint\`, \`pnpm test\`, \`pnpm typecheck\`.

## Monorepo imports

- Prefer workspace packages: \`@gate-access/db\`, \`@gate-access/types\`, \`@gate-access/ui\`, \`@gate-access/api-client\`, \`@gate-access/i18n\`.
- Avoid duplicating shared utilities in apps if a package already provides them (e.g. \`cn()\` from \`@gate-access/ui\`).

## Multi-tenancy & soft deletes

- Any DB query touching tenant data MUST include **\`organizationId\` scoping**.
- Always filter soft deletes with **\`deletedAt: null\` when the model defines \`deletedAt\`**. (Not every model has \`deletedAt\`, e.g. \`ScanLog\`, \`BlogPost\`, \`AuditLog\`). Hard deletes are not used for tenant entities.

## Auth & token handling

- Access tokens are short-lived; always support refresh/rotation flows.
- Never store tokens in \`localStorage\`. Use secure cookies (web) or SecureStore (mobile).

## QR security & scanner invariants

- All QR payloads must be **HMAC-SHA256 signed**. Never generate unsigned QRs.
- Do not break offline sync dedup contract: **\`scanUuid\`** is the deduplication key across scans.

## Secrets

- Never commit \`.env\` / \`.env.local\`. Commit only \`.env.example\` with placeholder keys.
- For security-critical env vars (JWT secrets, QR signing secret, DB URL, Redis keys), prefer **fail-closed** behavior (throw/refuse to start) over unsafe defaults.
`;

// 2. 01-gateflow-ai-workflow.mdc
const r01 = `---
description: GateFlow AI workflow — commands, skills, subagents, MCP, DoD
globs: *
alwaysApply: false
---

# GateFlow — AI Workflow Rules

> Full reference: \`docs/development/guidelines/AI_SKILLS_SUBAGENTS_RULES.md\`

## Master Commands

| Command | What it does |
|---------|--------------|
| \`/idea\` | Capture initiative → \`IDEA_<slug>.md\` + backlog entry |
| \`/plan\` | Turn idea → phased \`PLAN_<slug>.md\` + per-phase pro prompts |
| \`/dev [N]\` | Implement one phase end-to-end (preflight → code → tests → git) |
| \`/dev ralph\` / \`/ralph\` | Bounded execution: implement all remaining phases sequentially via \`/dev loop\` |
| \`/ship\` | Run full plan: idea → plan → all phases via \`/dev\` |
| \`/guide\` | "What should I do now?" — next steps, critical issues, improvements |
| \`/clis team\` | Run CLI team: \`seo\` / \`refactor\` / \`audit\` |

Definitions: \`.agents/workflows/\` (master) · \`.agents/commands-ref/\` (internal flows)

## Skills (load on demand — never pre-load all)

- **Domain:** \`security\` · \`database\` · \`api\` · \`mobile\` · \`architecture\` · \`testing\` · \`i18n\` · \`ui-ux-pro-max\` · \`mcp-guide\` · \`cli-limits\` · \`ads-foundations\` · \`ads-data\` · \`ads-a11y-rtl\`

## MCP Servers

| Task | MCP |
|------|-----|
| Prisma schema / migrations / Studio | Prisma-Local |
| Library docs (React, Next.js, Prisma) | Context7 |
| E2E UI verification | cursor-ide-browser |
| GitHub PRs / issues | GitHub |

## Subagents (smallest tool for the job)

| Task | Subagent |
|------|----------|
| Trace flows, find features | explore |
| pnpm / turbo / git / prisma | shell |
| Login, navigate, verify UI | browser-use |
| Ambiguous mixed investigation | general-purpose |

## Definition of Done

- Lint + typecheck pass for touched workspaces
- Tests pass (or no regression)
- No secrets in git; QR/auth invariants preserved
- \`docs/\` updated if behavior changed
`;

// 3. 02-gateflow-guide.mdc
const r02 = `---
description: GateFlow workspace guide — pre-flight, full guide on /guide or "what should I do now", optional post-task summary. Load gf-guide skill.
globs: *
alwaysApply: false
---

# GateFlow workspace guide

## When to load \`gf-guide\`

Load **\`.agents/skills/gf-guide/SKILL.md\`** (skill name \`gf-guide\`) when:

- The user message is **\`/guide\`** or starts with \`/guide \` (except when you are only echoing a one-line router handoff).
- The user asks **“what should I do now”**, **“what’s next”**, or equivalent workspace-direction questions.
- You are giving an **optional post-task summary** after completing non-trivial work (Must do / Recommended / Critical + one next command).

Also read **\`docs/development/learning/GUIDE_PREFERENCES.md\`** when present.

## Pre-flight (before non-trivial tasks)

Before phase implementation, large refactors, auth/RBAC/QR/tenant work, or when git/plan state looks risky:

1. Run lightweight checks from \`gf-guide\` § Pre-flight.
2. If something should happen first, offer **1 — Proceed** / **2 — Do suggestions first**.
3. Do not block read-only answers or small fixes unless security-critical.

## Coach vs router

- **Coach:** Situation → Teach → Ask → Action → Motivate; Must do / Recommended / Critical; one copy-ready next command.
- **Router:** \`/guide plan|phase|ready|…\` → follow \`.agents/workflows/guide.md\` shorthand; still end with one clear next step when helpful.

**\`/guide\` does not execute phases** — suggest \`/dev\`, \`/run\`, or \`/ship\` for execution.

## CLI limits

Before suggesting a paid CLI in guide output, apply **\`cli-limits\`** (80% rule).

## Post-task summary

After completing a substantial task, you may add a **short** guide block (not a full recap). Skip if the user asked for answer-only or the footer already covers next steps.
`;

// 4. 03-cli-limits.mdc
const r03 = `---
description: CLI usage limits — agents and commands must not use a CLI at 80%+ without user permission
globs: *
alwaysApply: false
---

# CLI 80% limit rule

When a CLI account has used **80% or more** of its limit (as recorded in \`docs/development/learning/CLI_LIMITS_TRACKING.md\` or \`docs/development/learning/GUIDE_PREFERENCES.md\`):

- **Agents and commands must NOT use that CLI** for any task unless the user has given **explicit permission**.
- Do not invoke it, suggest it as the primary tool, or run phases with it.
- Instead: suggest a free-tier CLI (Kiro, Kilo, Qwen, Opencode) or Cursor, or ask the user: "This CLI is at 80%+ of its limit. Use it anyway, or use [alternative] instead?"

**Load** \`.agents/skills/cli-limits/SKILL.md\` when suggesting or choosing a CLI. This rule applies to \`/dev\`, \`/guide\`, and any phase or command that can invoke an external CLI.
`;

// 5. 04-cursor-master.mdc
const r04 = `---
description: Cursor is the master of the development process; CLIs are tools that assist and must satisfy Cursor
globs: *
alwaysApply: false
---

# Cursor as development master

- **Cursor** is the **source of truth** for workflow decisions: which tool or team to use, acceptance criteria, and what gets changed in the repo.
- **CLIs** (Claude, Gemini, Opencode, Kiro, Kilo, Qwen) are **assistants**. Their outputs are **proposals**; they are not authoritative until Cursor (or the user) applies and verifies them.
- **Cursor applies and verifies** all changes: run tests, lint, typecheck (e.g. \`pnpm preflight\`) before considering CLI output accepted. Cursor decides when CLI output is good enough to integrate.
- CLIs may be used for speed or quality; they must still obey the **80% limit rule** (see \`03-cli-limits.mdc\`). When in doubt, Cursor chooses the tool or team; agents and commands follow Cursor's orchestration.
`;

// 6. 05-cli-learning.mdc
const r05 = `---
description: Mandatory CLI usage logging and optional tool memory updates after any CLI run
globs: *
alwaysApply: false
---

# CLI learning (mandatory logging)

- **After any CLI usage** (Claude, Gemini, Opencode, Kiro, Kilo, Qwen), agents must **append one row** to \`docs/development/learning/CLI_USAGE_AND_RESULTS.md\` (Date | CLI | Task/phase | Outcome | Notes).
- When a pattern repeats (e.g. same tool+task type wins several times), update \`docs/development/learning/CLI_TOOL_MEMORY.md\` with a short note, or invoke \`.agents/skills/cli-memory/SKILL.md\` for a structured update.
- This applies to single-CLI runs and to **team runs** (\`/clis team seo|refactor|audit\`): log each CLI that was used in the team.
`;

// 7. 06-response-format.mdc
const r06 = `---
description: Standard response format — concise technical output matching GUIDE_RESPONSE_CONTRACT
globs: *
alwaysApply: false
---

# Response Format Standard

## Core Rules

- **Concise & Direct**: Start immediately with the action or technical answer. Avoid filler conversational preambles.
- **No Emoji Banners**: Do not use decorative emoji banners or unicode progress bars. Use clean GitHub markdown headers.
- **Explicit Sections**:
  - \`### Situation\` — What was discovered, root cause, context.
  - \`### Changes\` (or \`### Accomplishments\`) — Specific files and actions taken.
  - \`### Verification\` — Exact commands run with test/lint/typecheck outputs.
  - \`### Critical\` — Risks, blockers, or "None" explicitly.
  - \`### Next Action\` — Clear copy-pasteable slash command or terminal command.
- **File Links**: Format file references as clickable links \`[filename](file:///path/to/file)\`.
`;

// 8. 07-adversarial-review.mdc
const r07 = `---
description: Rules for the Adversary persona and cross-model verification in bounded review loops.
globs: *
alwaysApply: false
---

# Adversarial Review (The Second Brain)

You are the **Adversary**. Your goal is to find flaws, exploits, and edge cases in code that has already passed standard enforcers.

## Triggers
- Core script modifications (\`scripts/*.js\`)
- Auth/RBAC changes
- Multi-tenancy logic (\`organizationId\`)
- Schema migrations

## The Adversary Role
1. **Assume Failure**: Assume the implementation has a hidden flaw.
2. **Identify Edge Cases**: Look for race conditions, null-pointer exceptions, or logic bypasses.
3. **Multi-Model Check**: If you are Cursor, suggest running the check via \`gemini -p "[prompt]"\` or \`claude -p "[prompt]"\` to get a truly independent perspective.

## Command: \`/adversary\`
Use this template for adversarial prompts:
> "Acting as a Security & Architecture Adversary, review [FILES]. I have implemented [FEATURES]. Identify 3 ways this code could fail or be exploited. Focus on [TENANT-ISOLATION | RACE-CONDITIONS | PERFORMANCE]."

## Self-Correction Loop
- Any flaw identified by the Adversary must be fixed **before** the phase or loop exits.
- Document flaws and fixes in the Phase Walkthrough.
`;

// Remove all old files in rules directory
const files = fs.readdirSync(RULES_DIR);
for (const f of files) {
  fs.unlinkSync(path.join(RULES_DIR, f));
}

// Write the unified, clean set of 8 .mdc rules
fs.writeFileSync(path.join(RULES_DIR, '00-gateflow-core.mdc'), r00, 'utf8');
fs.writeFileSync(
  path.join(RULES_DIR, '01-gateflow-ai-workflow.mdc'),
  r01,
  'utf8'
);
fs.writeFileSync(path.join(RULES_DIR, '02-gateflow-guide.mdc'), r02, 'utf8');
fs.writeFileSync(path.join(RULES_DIR, '03-cli-limits.mdc'), r03, 'utf8');
fs.writeFileSync(path.join(RULES_DIR, '04-cursor-master.mdc'), r04, 'utf8');
fs.writeFileSync(path.join(RULES_DIR, '05-cli-learning.mdc'), r05, 'utf8');
fs.writeFileSync(path.join(RULES_DIR, '06-response-format.mdc'), r06, 'utf8');
fs.writeFileSync(
  path.join(RULES_DIR, '07-adversarial-review.mdc'),
  r07,
  'utf8'
);

console.log(
  'Reconciled all rules in .antigravity/rules/ to 8 canonical .mdc files.'
);
