---
name: multi-cli-cursor-workflow
description: Orchestrate Claude CLI, Opencode CLI, Gemini CLI, Kiro CLI, Kilo CLI, and Qwen CLI in terminal alongside Cursor for parallel AI-assisted development. Use when the user wants faster development, multiple model perspectives, or to run CLI tools while editing in Cursor.
---

# Multi-CLI + Cursor Workflow

Run Claude CLI, Opencode CLI, Gemini CLI, Kiro CLI, Kilo CLI, and Qwen CLI in **separate terminals** alongside Cursor to parallelize AI assistance and increase development speed and accuracy.

---

## Why Run CLIs with Cursor

| Benefit | How |
|---------|-----|
| **Parallel tasks** | Cursor edits files; CLIs answer questions, generate scripts, analyze code |
| **Multi-model consensus** | Same prompt to 2–3 CLIs → compare outputs, reduce mistakes |
| **No context thrashing** | Each tool keeps its own session; Cursor stays focused |
| **Terminal-native** | CLIs shine at piped input, batch analysis, quick Q&A |

---

## Cursor as master; predefined teams

**Cursor is the master** of the development process: it decides when to use a CLI or a team, applies outputs, and verifies (tests, lint, typecheck). CLIs are **tools**; their results are proposals until Cursor (or the user) accepts them.

**Predefined teams** (2–4 CLIs each): run via **`/clis team <name>`** with `<name>` = `seo` | `refactor` | `audit`. Definitions and step-by-step workflows: **`docs/plan/learning/CLI_TEAMS.md`**. Teams: **SEO/Content** (Kiro, Gemini, Opencode, Qwen); **Code/Refactor** (Opencode, Gemini, Kilo); **Review/Audit** (Gemini, Opencode, Claude escalation-only). Claude is escalation-only and excluded from competition; other CLIs can be compared over time via `CLI_USAGE_AND_RESULTS.md` and `CLI_TOOL_MEMORY.md`.

---

## Setup (One-Time)

Ensure all CLIs are installed and authenticated:

```bash
# Claude CLI (Anthropic)
claude auth status   # or: claude auth login

# OpenCode CLI (opencode.ai)
opencode auth login  # if required

# Gemini CLI (Google)
gemini auth login    # if required

# Kiro CLI (qwen3-coder-next, free)
curl -fsSL https://cli.kiro.dev/install | bash

# Kilo CLI (Kilo Code, MiniMax M2.5, free tier)
npm i -g @kilocode/cli

# Qwen CLI (Qwen Code, Qwen3 480B, free tier)
npm i -g @qwen-code/qwen-code
# Configure DashScope API (OpenAI-compatible) then run qwen
```

**Shared context:** All tools should have access to `CLAUDE.md`, `docs/`, `.cursor/rules/`. Point prompts at these or run from repo root.

---

## Orchestration Patterns

### Pattern 1: Cursor Edits, CLI Analyzes

| Tool | Role |
|------|------|
| **Cursor** | Inline edits, refactors, new code |
| **Claude CLI** | "Explain this function", "Find edge cases", "Suggest tests" |
| **Gemini CLI** | Alternative review, different model perspective |

**Example:** You refactor in Cursor; in another terminal:

```bash
claude -p "Review the auth flow in apps/client-dashboard/src/lib/auth.ts. List security concerns."
gemini "Same file: suggest test cases for token refresh."
```

### Pattern 2: Parallel Prompts (Multi-Model Consensus)

Same prompt to multiple CLIs; compare results before implementing.

```bash
# Terminal 1
claude -p "Best approach to add pagination to our Prisma scanLog query? GateFlow uses orgId scope and deletedAt null."

# Terminal 2
gemini "Best approach to add pagination to our Prisma scanLog query? GateFlow uses orgId scope and deletedAt null."
```

Implement in Cursor using the common pattern or the stronger suggestion.

### Pattern 3: Cursor + CLI Pipeline

| Step | Tool | Action |
|------|------|--------|
| 1 | Cursor | Create/modify file |
| 2 | CLI | Analyze: `cat path/to/file.ts \| claude -p "Check for multi-tenant scoping"` |
| 3 | Cursor | Apply fixes from CLI feedback |

### Pattern 4: CLI Script, Cursor Integrate

CLI generates a script or snippet; you paste and adapt in Cursor.

```bash
claude -p "Generate a Zod schema for GateFlow QRCode creation. Include: name, email, phone, role, gateId optional, expiresAt optional."
opencode run "Create a Prisma query for recent ScanLogs with org scope and deletedAt filter. Return last 50."
```

---

## CLI Quick Reference

### Claude CLI

```bash
claude                    # Interactive session
claude "your prompt"      # Session with initial prompt
claude -p "prompt"       # One-shot, exit immediately
claude -c                # Continue last session
cat file.ts | claude -p "Analyze this"
```

### OpenCode CLI

```bash
opencode                  # Start TUI
opencode run "prompt"     # Non-interactive
```

### Gemini CLI

```bash
gemini "your prompt"
gemini --file path.ts "review this"
gemini chat               # Interactive
```

### Kiro CLI

```bash
kiro                      # Interactive (if available)
kiro "your prompt"        # One-shot or session with prompt
# Use repo root; supports MCP and large context (262K)
```

### Kilo CLI (Kilo Code)

```bash
kilo                      # Interactive (if available)
kilo "your prompt"        # One-shot or session
# MiniMax M2.5; free tier; good for fast terminal tasks
```

### Qwen CLI (Qwen Code)

```bash
qwen                      # Interactive (if available)
qwen "your prompt"        # One-shot or session
# Qwen3 480B; 256K–1M context; DashScope API
```

---

## CLI Selection (Best Results)

**Spread usage** across CLIs to avoid rate limits. **Match CLI to task** by complexity and model strength.

### By task complexity + model strength

| Task | Simple | Medium | Complex |
|------|--------|--------|---------|
| Security review | Gemini | Claude | **Claude** |
| Prisma/DB query | **Gemini** | Claude or Gemini | Claude |
| Code generation | **OpenCode** | OpenCode or Claude | Claude |
| Architecture decision | — | Claude | **Claude** |
| Test generation | Gemini | Claude | **Claude** |

### By model strength

- **Claude** — Security audit, reasoning, detailed analysis. Claude Pro limits.
- **Gemini** — Fast schema/query, snippets, structure. Google One quota; retries on exhaust.
- **OpenCode** — Code workflows, file ops, multi-provider.
- **Kiro CLI** — Free; qwen3-coder-next; agentic coding, large context (262K), MCP.
- **Kilo CLI** — Free tier; MiniMax M2.5; fast terminal tasks, SWE-bench strong.
- **Qwen CLI** — Free tier; Qwen3 480B; agentic, 256K–1M context, tool-use.

### Best practice

1. **Rotate** — Security → Claude; DB query → Gemini; Code gen → OpenCode. Don't hammer one CLI.
2. **Match complexity** — Simple → Gemini (fast). Complex → Claude (depth). Code workflows → OpenCode.
3. **Fallback** — If "exhausted capacity" or quota: switch CLI. Same role prefix keeps quality.
4. **Critical** — Same prompt to 2 CLIs, compare, implement in Cursor.

---

## Task Splitting Guide

| Task Type | Prefer |
|-----------|--------|
| File edits, refactors, new components | **Cursor** |
| Quick Q&A, one-off questions | **Claude CLI**, **Gemini CLI**, **Kilo CLI**, **Kiro CLI** |
| Code generation from spec | **OpenCode**, **Claude CLI**, **Kiro CLI**, **Qwen CLI** |
| Script / batch analysis | **Claude CLI** (pipes well) |
| Second opinion, security review | **Gemini CLI** (different model) |
| Free-tier agentic, large context (terminal) | **Kiro CLI**, **Qwen CLI** |
| Free terminal tasks, fast iteration | **Kilo CLI**, **Kiro CLI** |
| Multi-step plan | **Cursor** (gateflow-planner skill) |
| Build, test, git | **Cursor** shell subagent or manual terminal |

---

## Integration with phases and **Preferred tool**

GateFlow phase prompts (`docs/plan/execution/PROMPT_<slug>_phase_<N>.md`) include a **Preferred tool** field.  
Use this skill to respect that choice instead of inventing a new workflow per phase:

- If **Preferred tool: Cursor (default)**:
  - Do most implementation inside Cursor.
  - Optionally use CLIs for quick Q&A or focused reviews, but keep `/dev` and Cursor as the primary driver.
- If **Preferred tool: Kiro** or **Antigravity**:
  - Use those IDEs to execute the phase steps, but still:
    - Read the same phase prompt and Acceptance criteria.
    - Treat `docs/plan/` as the shared brain (no alternate planning system).
  - Use CLIs as helpers, not planners.
- If **Preferred tool: Claude CLI / Gemini CLI / OpenCode CLI**:
  - Run the phase primarily from that CLI (for example by pasting or referencing the phase prompt).
  - Keep Cursor (or another IDE) open for actual file edits.
- If **Preferred tool: Kiro CLI / Kilo CLI / Qwen CLI**:
  - Run the phase primarily from that CLI (paste or reference the phase prompt in the terminal).
  - Keep Cursor open for actual file edits; use the CLI for prompts, analysis, or generation as the phase specifies.
  - Same pattern as Claude/Gemini/Opencode: shared brain in `docs/plan/`, no ad-hoc plans in the CLI.
- If **Preferred tool: Multi-CLI**:
  - Reserved for **complex/high‑risk phases** (security-critical, architectural, or large refactors).
  - Use the phase prompt as the single source of truth and:
    - Send the same focused question to 2 CLIs (e.g. Claude + Gemini) for consensus on tricky decisions.
    - Implement the agreed approach in Cursor/Kiro, then run the tests/lint from the phase’s Acceptance criteria.

In all cases:

- Do **not** create ad‑hoc plans in CLIs; always align with `PLAN_<slug>.md` and `PROMPT_<slug>_phase_<N>.md`.
- Treat CLIs as **supporting tools** that help execute the phase, not as a separate planning or orchestration layer.

---

## GateFlow-Specific Prompts

When using CLIs, include GateFlow context:

```
Context: GateFlow monorepo. Rules: pnpm only, organizationId scope, deletedAt null, 
QR HMAC-SHA256. Ref: CLAUDE.md.
```

**Example prompts:**

- "Given GateFlow's multi-tenant rules, suggest a Prisma query for active gates by project."
- "Review this API route for auth, org scope, and rate limiting. File: [path]"
- "Generate a Jest test for our requireAuth middleware."

---

## Workflow Checklist

- [ ] Cursor open in IDE for edits
- [ ] 1–3 CLI terminals ready (Claude, Gemini, OpenCode, Kiro, Kilo, Qwen as needed)
- [ ] All run from repo root (or `--add-dir` / context paths)
- [ ] Shared context: CLAUDE.md, docs/plan/guidelines/
- [ ] Delegate by task type (edits → Cursor, analysis → CLIs)
- [ ] For critical logic: run same prompt on 2 CLIs, compare

---

## Subagent Hierarchy (Consistency Across All CLIs)

GateFlow uses a **development-company-style subagent hierarchy**. When using **any** CLI (Claude, Opencode, Gemini, Kiro, Kilo, Qwen), prefix your prompt with the role to get consistent quality. See `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` for full role definitions.

**Role prefixes (copy for CLIs):**
- Security: `You are the GateFlow Security Specialist. Check: requireAuth, organizationId scope, deletedAt null. `
- API: `You are the GateFlow API Specialist. Pattern: requireAuth → org scope → Zod. `
- Database: `You are the GateFlow Database Specialist. Schema: packages/db/prisma/schema.prisma. Always scope by organizationId. `
- Frontend: `You are the GateFlow Frontend Specialist. Use @gate-access/ui, Tailwind. `
- Mobile: `You are the GateFlow Mobile Specialist. SecureStore, scanUuid dedup. `
- QA: `You are the GateFlow QA Specialist. Jest, mock Prisma/auth. `
- Architecture: `You are the GateFlow Architecture Lead. pnpm only, org scope, @gate-access/*. `

Example: `claude -p "You are the GateFlow Security Specialist. Review apps/client-dashboard/src/app/api/gates/route.ts for multi-tenant scoping."`

---

## Usage limits

- **Claude Pro** — Usage limits. Reserve for complex, high-risk prompts.
- **Gemini** — Google One quota; shows "exhausted capacity" and retries. Spread load: use for simple tasks (DB queries, snippets).

**Strategy:** Rotate CLIs by task type. Simple → Gemini. Complex → Claude. Code workflows → OpenCode.

## Integration with gateflow-planner

During phased execution, pro prompts include **Multi-CLI** only for complex/high-risk phases. Use CLIs for:
- Design decisions (same prompt to 2 CLIs, compare)
- Code review (`cat file | claude -p "Check for multi-tenant scoping"`)
- Test generation (`claude -p "Generate Jest test for [module]"`)

See `.cursor/skills/gf-planner/SKILL.md` for pro prompt template with multi-CLI section.

---

## References

- `docs/guides/TOOL_AND_CLI_REFERENCE.md` — Canonical task-to-tool matrix (Cursor, Claude, Gemini, Opencode, Kiro, Kilo, Qwen)
- `docs/plan/guidelines/AI_SKILLS_SUBAGENTS_RULES.md` — Single brain for roles, subagents, and phased execution
- `docs/plan/guidelines/SUBAGENT_HIERARCHY.md` — Role definitions and CLI prefixes
- `.cursor/skills/gf-planner/SKILL.md` — Phased planning with subagents and Multi-CLI integration
- `CLAUDE.md` — Repo rules (apply to all tools)
