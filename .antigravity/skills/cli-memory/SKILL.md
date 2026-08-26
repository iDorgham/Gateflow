---
name: cli-memory
description: Update CLI tool memory from usage logs. Use when reviewing CLI outcomes, updating the scoreboard, or when the guide/orchestrator should prefer a tool based on past results. Summarizes CLI_USAGE_AND_RESULTS.md into CLI_TOOL_MEMORY.md; Claude entries go to Escalations only.
---

# GateFlow CLI tool memory (gf-cli-memory)

You maintain the **durable tool memory** so Cursor and agents can prefer the right CLI for each task type. Load this skill when doing a **structured update** of `CLI_TOOL_MEMORY.md` from the usage log, or when the user asks to "update tool memory" or "refresh CLI scoreboard."

---

## 1. When to use this skill

- **After a batch of CLI runs** — Summarize the last N entries from `CLI_USAGE_AND_RESULTS.md` into `CLI_TOOL_MEMORY.md` (scoreboard and per-tool notes).
- **When the guide or orchestrator needs a recommendation** — Ensure "Recommended tool per task" and per-tool notes in `CLI_TOOL_MEMORY.md` reflect recent outcomes.
- **User asks** — "Update CLI memory," "Refresh the CLI scoreboard," or "Summarize CLI usage into tool memory."

---

## 2. Inputs

- **`docs/development/learning/CLI_USAGE_AND_RESULTS.md`** — Log of date, CLI, task/phase, outcome, notes.
- **`docs/development/learning/CLI_LIMITS_TRACKING.md`** (optional) — Current limits; don’t recommend a CLI at 80%+.
- **`docs/development/learning/GUIDE_PREFERENCES.md`** (optional) — User’s preferred tools; respect them when updating "Best for."
- **`docs/guides/TOOL_AND_CLI_REFERENCE.md`** — Task-to-tool matrix; use as default when no memory yet.

---

## 3. Procedure

1. **Run the automated aggregator**:
   ```bash
   node scripts/ai-sync/memory-aggregator.mjs
   ```
2. **Verify the update**:
   Check `docs/development/learning/CLI_TOOL_MEMORY.md` to ensure the scoreboard and per-tool notes reflect the latest logs.
3. **Manual adjustment (Optional)**:
   If specific task-to-tool mappings need human nuance, edit the "Recommended tool per task" section in `CLI_TOOL_MEMORY.md` manually.

---

## 4. Rules

- **Claude** — Always logged in `CLI_USAGE_AND_RESULTS.md`; in `CLI_TOOL_MEMORY.md` only in the **Escalations** section. Never add Claude to the competition scoreboard.
- **80% rule** — If `CLI_LIMITS_TRACKING.md` or `GUIDE_PREFERENCES.md` says a CLI is at 80%+, do not recommend it as "Best for" for new work unless the user has permitted it.
- **Cursor is master** — Tool memory is a recommendation; Cursor still decides which tool to use.

---

## 5. References

- `docs/development/learning/CLI_USAGE_AND_RESULTS.md` — Source log.
- `docs/development/learning/CLI_TOOL_MEMORY.md` — Target file to update.
- `.antigravity/skills/gf-cli-limits/SKILL.md` — Limits and 80% rule.
- `docs/guides/TOOL_AND_CLI_REFERENCE.md` — Task-to-tool matrix and defaults.
