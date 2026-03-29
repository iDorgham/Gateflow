# CLI Tool Memory (Scoreboard + Learnings)

**Purpose:** Durable summary of which CLI works best for which task type.
Update from `CLI_USAGE_AND_RESULTS.md` after reviewing logs.

---

## Scoreboard

| Task type              | Gemini | Opencode | Kiro  | Kilo  | Qwen  | Default best |
| ---------------------- | ------ | -------- | ----- | ----- | ----- | ------------ |
| Schema / DB / Prisma   | 0/0/0  | 0/0/0    | 0/0/0 | 0/0/0 | 0/0/0 | Gemini       |
| Refactor / TDD         | 0/0/0  | 0/0/0    | 0/0/0 | 0/0/0 | 0/0/0 | Opencode     |
| Content / SEO draft    | 0/0/0  | 0/0/0    | 0/0/0 | 0/0/0 | 0/0/0 | Kiro or Qwen |
| Quick structural check | 0/0/0  | 0/0/0    | 0/0/0 | 0/0/0 | 0/0/0 | Gemini       |
| Free-tier agentic      | 0/0/0  | 0/0/0    | 0/0/0 | 0/0/0 | 0/0/0 | Kiro or Qwen |
| Free-tier fast tasks   | 0/0/0  | 0/0/0    | 0/0/0 | 0/0/0 | 0/0/0 | Kilo or Kiro |
| Docs sync from code    | 0/0/0  | 0/0/0    | 0/0/0 | 0/0/0 | 0/0/0 | Opencode     |
| CI / headless          | 0/0/0  | 0/0/0    | 0/0/0 | 0/0/0 | 0/0/0 | Opencode     |

_(Format: wins/partials/fails)_

---

## Per-Tool Notes

- **Gemini CLI** — Best for: schema/DB, structural checks, large-context second opinion.
- **Opencode CLI** — Best for: refactor/TDD, docs-from-code, batch code generation.
- **Kiro CLI** — Best for: free-tier agentic coding, cost-aware multi-step tasks.
- **Kilo CLI** — Best for: free fast terminal tasks, speed-first iterative checks.
- **Qwen CLI** — Best for: free-tier large-context workflows, tool-use heavy tasks.
- **Claude** — Escalation only (hardest tasks). Not in competition.

---

## Escalations (Claude only)

| Date                                            | Task | Outcome | Notes |
| ----------------------------------------------- | ---- | ------- | ----- |
| _(add rows when Claude is used for escalation)_ |      |         |       |
