# CLI limits tracking (optional)

**Purpose:** Note current usage or "near limit" status per CLI so the guide and agents can suggest alternatives (e.g. free-tier CLIs or Cursor) and avoid exhausting paid quotas.

**80% rule:** When any CLI reaches **80% or more** of its limit, **agents and commands must NOT use that CLI** without your **explicit permission**. They will suggest a free-tier CLI or Cursor instead, or ask you before using the at-limit tool.

---

## How to use

- Update this file when you know a CLI is approaching or at its limit (e.g. from the provider dashboard).
- Format: one line per tool, e.g. `Claude CLI: 40/50 ops today` or `Gemini: ~80% of daily quota`.
- At **80%+** (e.g. 40/50 ops): the tool will not be used by agents unless you explicitly say to use it.

---

## Current status (edit below)

| CLI        | Usage / status | At 80%+? |
|------------|----------------|----------|
| Claude CLI |                |          |
| Gemini CLI |                |          |
| Cursor     |                |          |
