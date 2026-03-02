---
name: gf-cli-limits
description: Track CLI usage limits (paid and free) and steer tool choice so paid quotas are not exhausted. Use when suggesting which CLI to use, before /dev phase execution, or when the user asks about limits. Ensures agents prefer free-tier CLIs or Cursor when limits are close.
---

# GateFlow CLI Limits Awareness (gf-cli-limits)

You help **avoid burning paid CLI quota** and **prefer free-tier or Cursor** when a tool is near its limit. Load this skill whenever the guide or `/dev` suggests a CLI, so decisions account for the user’s known limits and recorded usage.

---

**Hard rule:** If a CLI account has used **80% or more** of its limit (as noted in `CLI_LIMITS_TRACKING.md` or `GUIDE_PREFERENCES.md`), **agents and commands must NOT use that CLI** for any task unless the user has given **explicit permission** to use it. Suggest a free-tier CLI or Cursor instead, or ask the user for permission before using the at-limit tool.

## 1. When to use this skill

- **Before suggesting a paid CLI** (Claude CLI, Gemini CLI, Cursor) in `/guide` or in phase prompts: check whether the user has indicated "near limit" or "prefer free tier today" (see Section 3).
- **Before choosing a Preferred tool** for a phase: if paid tools are near limit, prefer **Kiro CLI**, **Kilo CLI**, or **Qwen CLI** (free) or **Cursor** for the task when the task-to-tool matrix allows it.
- **After a CLI task**: record the result in `docs/plan/learning/CLI_USAGE_AND_RESULTS.md` so future runs can analyze usage and improve decisions (see gf-guide and gf-dev for the recording step).

---

## 2. Known limits (reference)

Use this as a reference only; actual caps depend on the user’s plan and provider. The user can override or refine in `GUIDE_PREFERENCES.md` or `CLI_LIMITS_TRACKING.md`.

| Tool | Type | Typical limit (example) | Notes |
|------|------|-------------------------|--------|
| **Cursor IDE** | Paid ($20) | Per-plan usage / rate limits | Large context and heavy use can consume quota; prefer subagents and smaller scopes when conserving. |
| **Claude CLI** | Paid ($20) | ~50–190 ops/day (Pro) | Daily operation limit; resets. When close, prefer Kiro/Kilo/Qwen or Cursor. |
| **Gemini CLI** (Antigravity) | Paid ($20) | Per-Google quota (e.g. req/day) | "Exhausted capacity" when over; spread load, use for simpler tasks or use free CLIs. |
| **Opencode CLI** | Free | Generous free tier | Prefer for TDD, refactors, docs-from-code when conserving paid tools. |
| **Kiro CLI** | Free | qwen3-coder-next free tier | Use for agentic coding, large context; no paid quota. |
| **Kilo CLI** | Free | MiniMax M2.5 free tier | Use for fast terminal tasks; no paid quota. |
| **Qwen CLI** | Free | Qwen3 480B free tier | Use for agentic, large context; no paid quota. |

**Strategy:** When the user has marked a paid tool as "near limit" or "prefer free today", suggest **Kiro CLI**, **Kilo CLI**, or **Qwen CLI** (or **Opencode CLI**) for tasks where the task-to-tool matrix lists them as "Also good" or "Primary" for free-tier. Use **Cursor** for inline edits and phase workflows when possible instead of burning Claude/Gemini CLI ops.

---

## 3. Where the user records "near limit" or preferences

- **`docs/plan/learning/GUIDE_PREFERENCES.md`** — Optional section **"CLI limits / usage"** or **"Today’s limits"**: user can add one line such as "Claude CLI near daily limit" or "prefer free tier today" so the guide and agents suggest alternatives.
- **`docs/plan/learning/CLI_LIMITS_TRACKING.md`** (optional) — If present, the user can note current usage or "near limit" per tool (e.g. "Claude: 45/50 ops today"). Agents load this file when suggesting a CLI and prefer free-tier or Cursor when a paid tool is near its stated limit.
- **`docs/plan/learning/CLI_USAGE_AND_RESULTS.md`** — Log of past usage and outcomes. When analyzing (e.g. weekly), use it to see which tools are used heavily and suggest rotating to free tier or Cursor to stay under limits.

**Rule:** If `GUIDE_PREFERENCES.md` or `CLI_LIMITS_TRACKING.md` says a paid tool is near limit or "prefer free today", **do not suggest that paid tool** for new work unless the task strictly requires it (e.g. security audit). Prefer suggesting **Kiro CLI**, **Kilo CLI**, **Qwen CLI**, **Opencode CLI**, or **Cursor** from the task-to-tool matrix.

**80% rule:** If a CLI has reached **80% or more** of its limit (e.g. "Claude: 40/50 ops" = 80%), **agents and commands must NOT use that CLI** without the user's **explicit permission**. Do not invoke it, suggest it, or run phases with it. Instead: suggest a free-tier CLI or Cursor, or ask: "This CLI is at 80%+ of its limit. Do you want to use it anyway, or use [Kiro/Kilo/Qwen/Cursor] instead?"

---

## 4. Checklist for guide and /dev

When suggesting a CLI or choosing a phase **Preferred tool**:

1. **Load** `docs/plan/learning/GUIDE_PREFERENCES.md` and, if it exists, `docs/plan/learning/CLI_LIMITS_TRACKING.md`.
2. **If** a CLI is at **80%+ of its limit**: **do not use or suggest it** unless the user has given explicit permission. Use a free-tier CLI or Cursor instead, or ask for permission.
3. **If** the user has indicated "near limit" or "prefer free tier" for a paid tool (and not yet at 80%+), **prefer** free-tier CLIs (Kiro, Kilo, Qwen, Opencode) or Cursor for tasks where the matrix allows.
4. **Phrase** the suggestion: e.g. "Claude CLI is near your daily limit; for this task use **Kiro CLI** or **Qwen CLI** (free) instead" or "Prefer free tier today; use **Kilo CLI** for this terminal task." If at 80%+: "This CLI is at 80%+ of its limit. Use it anyway or switch to [alternative]?"
5. **After** a task completed with a CLI, remind or ensure one entry is added to `docs/plan/learning/CLI_USAGE_AND_RESULTS.md` (date, CLI, task, outcome, notes).

---

## 5. References

- `docs/guides/TOOL_AND_CLI_REFERENCE.md` — Task-to-tool matrix (Section 9) and quick reference (Section 10); use for "also good" free-tier options when paid is near limit.
- `docs/plan/learning/GUIDE_PREFERENCES.md` — User preferences and optional "CLI limits / usage" or "My tools".
- `docs/plan/learning/CLI_USAGE_AND_RESULTS.md` — Where to record each CLI task result for future analysis and better decisions.
- `.cursor/skills/gf-guide/SKILL.md` — Guide uses this skill when suggesting CLIs.
- `.cursor/skills/gf-dev/SKILL.md` — `/dev` uses this skill when choosing or invoking a CLI for a phase.
