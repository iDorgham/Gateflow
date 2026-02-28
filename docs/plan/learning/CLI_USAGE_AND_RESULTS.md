# CLI Usage and Results Log

**Purpose:** Record which CLI was used for which task and the outcome. Over time, this supports better decisions (which CLI for which task type) and analysis of usage vs. results.

**Used by:** gf-guide, gf-dev, and gf-cli-limits skill. After any task completed with a CLI (e.g. during `/dev` or ad‑hoc), append a short entry below so we can refine tool choice and respect limits.

---

## How to record (for agents)

After a task or phase was executed **using a CLI** (Claude CLI, Gemini CLI, Opencode CLI, Kiro CLI, Kilo CLI, Qwen CLI):

1. Append one line to the **Log entries** section in this file (or add a new row to the table).
2. Include: **Date**, **CLI**, **Task/phase** (e.g. phase 1 of core_security_v6, or "ad-hoc: review auth.ts"), **Outcome** (success / partial / fail), **Notes** (optional: limit impact, quality, or "near daily limit").
3. Keep entries short (one line or one table row). This file is for pattern analysis and limits awareness, not full incident reports (use `incidents.md` for that).

**Template line:**
```text
- **YYYY-MM-DD** | **Claude CLI** | Phase 2 core_security_v6 | success | —
```

**Template table row:**
| Date | CLI | Task / phase | Outcome | Notes |
|------|-----|--------------|---------|-------|
| YYYY-MM-DD | Claude CLI | phase 1 core_security_v6 | success | — |

---

## Log entries

| Date | CLI | Task / phase | Outcome | Notes |
|------|-----|--------------|--------|-------|
| *(add new rows below)* | | | | |

---

## Analysis (periodic)

When reviewing this log (e.g. weekly or before planning):

- Which CLI is used most for which task type? Prefer that in the task-to-tool matrix or GUIDE_PREFERENCES.
- Are paid CLIs (Claude, Gemini) often near limit? Prefer suggesting free-tier (Kiro, Kilo, Qwen) earlier in the day or for non-critical tasks.
- Any repeated partial/fail outcomes for a given CLI+task? Consider a different primary tool for that task in `docs/guides/TOOL_AND_CLI_REFERENCE.md`.
