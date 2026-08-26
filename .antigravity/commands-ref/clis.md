# CLIs (invoke safely + log learnings)

Use this internal flow when invoking **any external CLI** for GateFlow work:
**Claude CLI**, **Gemini CLI**, **Opencode CLI**, **Kiro CLI**, **Kilo CLI**, **Qwen CLI**.

This flow enforces:

- **Cursor is master** — Cursor decides when to use a CLI; CLI outputs are proposals until Cursor applies and verifies.
- **Competition** — For non-escalation work, prefer the tool with better outcomes in `CLI_TOOL_MEMORY.md` (subject to 80% rule). **Claude is escalation-only** and excluded from competition scoring.
- **Limits awareness + 80% rule** (block usage without explicit permission)
- **Result logging** (so we learn which tool works best over time)
- **Optional tool memory updates** (short, durable “what we learned” notes)

## Before you run any CLI (mandatory)

1. **Load limits + preferences**
   - `docs/development/learning/GUIDE_PREFERENCES.md`
   - `docs/development/learning/CLI_LIMITS_TRACKING.md` (if present)
   - `.antigravity/skills/gf-cli-limits/SKILL.md`

2. **Enforce the 80% rule**
   - If the target CLI is at **80%+** of its limit, **do not run it** unless the user has given **explicit permission**.
   - Prefer a free-tier alternative (**Kiro / Kilo / Qwen / Opencode**) or **Cursor**.

## Invoke (run in separate terminal)

Use GateFlow constraints inline in prompts (pnpm-only, org scoping, soft deletes, QR/auth invariants when relevant).

```bash
# Claude CLI (security/architecture, correctness)
claude -p "GateFlow monorepo. Rules: pnpm only; tenant queries must scope organizationId; filter deletedAt: null; never store tokens in localStorage; QR payloads must be HMAC-SHA256 signed. Task: [your prompt]"

# Gemini CLI (DB/schema, large context, speed)
gemini "GateFlow monorepo. Rules: pnpm only; organizationId scope; deletedAt null. Task: [your prompt]"

# Opencode CLI (code gen/refactors/TDD)
opencode run "[your prompt]"

# Kiro CLI (free-tier agentic / large context)
kiro "[your prompt]"

# Kilo CLI (free-tier fast terminal tasks)
kilo "[your prompt]"

# Qwen CLI (free-tier agentic / very large context)
qwen-code "[your prompt]"
```

## After the CLI finishes (mandatory)

1. **Record the outcome**
   - Append one entry to `docs/development/learning/CLI_USAGE_AND_RESULTS.md` (date | CLI | task/phase | outcome | notes).

2. **Update tool memory (optional but recommended weekly)**
   - If you learned something durable (“X is best for Y” / “avoid Z”), add 1–2 bullets to:
     - `docs/development/learning/CLI_TOOL_MEMORY.md`
   - For a structured update, use `.antigravity/skills/gf-cli-memory/SKILL.md`.

## Team runs (predefined 2–4 CLIs)

Use **`/clis team <name>`** to run a team. Definitions and step-by-step workflows: **`docs/development/learning/CLI_TEAMS.md`**.

| Team         | Name            | CLIs                                  | Use when                                                |
| ------------ | --------------- | ------------------------------------- | ------------------------------------------------------- |
| **seo**      | SEO / Content   | Kiro, Gemini, Opencode, Qwen          | Draft → 2 improvers → curator → humanize.               |
| **refactor** | Code / Refactor | Opencode, Gemini, Kilo                | Refactor lead → second opinion → fast verify.           |
| **audit**    | Review / Audit  | Gemini, Opencode, Claude (escalation) | Broad pass → code pass → escalate to Claude if hardest. |

Before running a team, check **80% rule** (gf-cli-limits + CLI_LIMITS_TRACKING.md). After the run, log **each CLI used** in `CLI_USAGE_AND_RESULTS.md`. Cursor is master: it applies and verifies; CLI outputs are proposals.

## Quick selection

| Task type                             | Prefer                      |
| ------------------------------------- | --------------------------- |
| Security / architecture / correctness | Claude CLI (unless limited) |
| DB / schema / Prisma / quick analysis | Gemini CLI (unless limited) |
| Code gen / refactors / TDD loops      | Opencode CLI                |
| Free-tier agentic / large context     | Kiro CLI / Qwen CLI         |
| Free-tier fast terminal tasks         | Kilo CLI                    |
