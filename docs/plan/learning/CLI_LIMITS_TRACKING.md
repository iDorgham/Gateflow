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

| CLI | Limit / quota reference | 80% threshold | Current usage | At 80%+? | Last checked |
|-----|--------------------------|---------------|---------------|----------|--------------|
| Claude CLI | Pro daily ops (typically ~50-190/day; plan-dependent) | 40/50, 80/100, 152/190 | Unknown | Unknown | 2026-03-01 |
| Gemini CLI | Account quota (plan/provider dependent; often req/day based) | 80% of daily cap | Unknown | Unknown | 2026-03-01 |
| Cursor | Plan/rate-limit based usage budget | 80% of plan quota | Unknown | Unknown | 2026-03-01 |
| Opencode CLI | Free tier | n/a | n/a | n/a | 2026-03-01 |
| Kiro CLI | Free tier | n/a | n/a | n/a | 2026-03-01 |
| Kilo CLI | Free tier | n/a | n/a | n/a | 2026-03-01 |
| Qwen CLI | Free tier | n/a | n/a | n/a | 2026-03-01 |

### Notes

- Fill `Current usage` from provider dashboards when available (e.g. `42/50 today`).
- Once a paid tool reaches 80%+, agents should avoid it unless you explicitly approve.
- Free-tier tools are tracked for awareness, but they do not trigger the paid-quota block rule.
