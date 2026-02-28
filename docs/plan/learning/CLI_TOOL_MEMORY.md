# CLI tool memory (scoreboard + learnings)

**Purpose:** Durable summary of which CLI works best for which task type. Updated from `CLI_USAGE_AND_RESULTS.md` (manually or via **gf-cli-memory** skill). Cursor uses this to prefer the right tool when suggesting or running CLIs; **Claude is escalation-only** and is not scored in the competition.

---

## Scoreboard (wins / partials / fails by task type)

Lightweight tally by task category. Update when reviewing the usage log (e.g. weekly).

| Task type | Gemini | Opencode | Kiro | Kilo | Qwen | Best for |
|-----------|--------|----------|------|------|------|----------|
| Schema / DB / Prisma | | | | | | |
| Refactor / TDD | | | | | | |
| Content / SEO draft | | | | | | |
| Quick structural check | | | | | | |
| Free-tier agentic | | | | | | |

*(Fill in counts or "—" as you log; "Best for" = recommended tool for that row.)*

---

## Per-tool notes (best-for, avoid-when, recent wins/failures)

- **Gemini CLI** — Best for: large context, schema/DB, quick second opinion. Avoid when: highest first-pass correctness required. Notes: |
- **Opencode CLI** — Best for: refactors, TDD, docs-from-code. Avoid when: deep security prose. Notes: |
- **Kiro CLI** — Best for: free agentic, 262K context. Avoid when: Claude-level audit. Notes: |
- **Kilo CLI** — Best for: free fast terminal, SWE-bench-style tasks. Avoid when: very large context. Notes: |
- **Qwen CLI** — Best for: free agentic, 256K–1M context, curation/humanize. Avoid when: escalation-only audit. Notes: |

---

## Escalations (Claude only — logged, not scored)

Claude is used only for the **hardest** tasks (security audit, architecture deep-dive, high-risk refactors). Log each use in `CLI_USAGE_AND_RESULTS.md` but **do not** add Claude to the scoreboard or competition. Entries here are for reference only.

| Date | Task / phase | Outcome | Notes |
|------|--------------|---------|-------|
| | | | |

---

## Recommended tool per task (from memory)

When the guide or an agent suggests a CLI, prefer the tool listed here for that task type (subject to 80% rule and user preferences):

- **Schema / DB / Prisma** — *(from scoreboard or default: Gemini)*
- **Refactor / TDD** — *(from scoreboard or default: Opencode)*
- **Content / SEO** — *(from scoreboard or default: Kiro or Qwen for draft/curate)*
- **Security / architecture (hardest)** — **Claude** (escalation-only; not in competition)
