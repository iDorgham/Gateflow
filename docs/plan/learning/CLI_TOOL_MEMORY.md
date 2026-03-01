# CLI tool memory (scoreboard + learnings)

**Purpose:** Durable summary of which CLI works best for which task type. Updated from `CLI_USAGE_AND_RESULTS.md` (manually or via **gf-cli-memory** skill). Cursor uses this to prefer the right tool when suggesting or running CLIs; **Claude is escalation-only** and is not scored in the competition.

---

## Scoreboard (wins / partials / fails by task type)

Lightweight tally by task category. Update when reviewing the usage log (e.g. weekly).

| Task type | Gemini | Opencode | Kiro | Kilo | Qwen | Best for |
|-----------|--------|----------|------|------|------|----------|
| Schema / DB / Prisma | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | Gemini |
| Refactor / TDD | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | Opencode |
| Content / SEO draft | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | Kiro or Qwen |
| Quick structural check | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | Gemini |
| Free-tier agentic | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | Kiro or Qwen |
| Free-tier fast terminal tasks | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | Kilo or Kiro |
| Docs sync from code | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | Opencode |
| CI / headless automation | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | 0/0/0 | Opencode (Claude escalation) |

*(Counts are `wins/partials/fails`. Current rows are baseline defaults from `TOOL_AND_CLI_REFERENCE.md` until real usage rows are logged in `CLI_USAGE_AND_RESULTS.md`.)*

---

## Per-tool notes (best-for, avoid-when, recent wins/failures)

- **Gemini CLI** — Best for: schema/DB/Prisma, quick structural checks, large-context fast second opinion. Avoid when: highest first-pass correctness is mandatory. Notes: baseline default; add evidence rows as logs accumulate.
- **Opencode CLI** — Best for: refactor/TDD, docs-from-code, batch code generation, terminal-first implementation loops. Avoid when: deep security or architecture writeups are required. Notes: baseline default; add evidence rows as logs accumulate.
- **Kiro CLI** — Best for: free-tier agentic coding, large-context terminal flows, cost-aware multi-step tasks. Avoid when: escalation-level audit depth is needed. Notes: baseline default; pair with Qwen/Kilo when quotas are tight.
- **Kilo CLI** — Best for: free fast terminal tasks, quick implementation loops, cost-efficient iterative checks. Avoid when: very large context or long architectural reasoning is needed. Notes: baseline default; strongest as a speed-first free option.
- **Qwen CLI** — Best for: free-tier agentic coding with very large context, tool-use heavy terminal workflows, curation passes. Avoid when: escalation-only security/architecture audit is needed. Notes: baseline default; good alternative to Kiro for long contexts.

---

## Escalations (Claude only — logged, not scored)

Claude is used only for the **hardest** tasks (security audit, architecture deep-dive, high-risk refactors). Log each use in `CLI_USAGE_AND_RESULTS.md` but **do not** add Claude to the scoreboard or competition. Entries here are for reference only.

| Date | Task / phase | Outcome | Notes |
|------|--------------|---------|-------|
| *(add rows when Claude CLI is used for escalation tasks)* | | | |

---

## Recommended tool per task (from memory)

When the guide or an agent suggests a CLI, prefer the tool listed here for that task type (subject to 80% rule and user preferences):

- **Schema / DB / Prisma** — *(from scoreboard or default: Gemini)*
- **Refactor / TDD** — *(from scoreboard or default: Opencode)*
- **Content / SEO** — *(from scoreboard or default: Kiro or Qwen for draft/curate; Opencode for docs sync)*
- **Quick structural check / second opinion** — *(from scoreboard or default: Gemini)*
- **Free-tier agentic (large context)** — *(from scoreboard or default: Kiro or Qwen)*
- **Free-tier fast terminal tasks** — *(from scoreboard or default: Kilo or Kiro)*
- **CI / headless automation** — *(from scoreboard or default: Opencode; Claude for hard escalation only)*
- **Security / architecture (hardest)** — **Claude** (escalation-only; not in competition)
