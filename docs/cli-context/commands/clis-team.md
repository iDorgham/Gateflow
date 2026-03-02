---
name: clis-team
description: Run a predefined CLI team (seo, refactor, audit). Cursor is master; team outputs are proposals until Cursor applies and verifies.
---

# /clis team — Run a CLI team

Use **`/clis team <name>`** to run a fixed team of 2–4 CLIs in sequence. **Cursor is the master**: it decides when to run the team, receives outputs, and applies/verifies (tests, lint, typecheck). Team definitions, **ratings** (including remix/collaboration potential — why 2–3 CLIs together can produce something different and new), and step-by-step workflows are in **`docs/plan/learning/CLI_TEAMS.md`**.

## Teams

| Name | Command | Team | Purpose |
|------|---------|------|---------|
| **SEO / Content** | `/clis team seo` | Kiro, Gemini, Opencode, Qwen | Draft → 2 improvers → curator → humanize. **Remix: High.** |
| **Code / Refactor** | `/clis team refactor` | Opencode, Gemini, Kilo | Refactor lead → second opinion → fast verify. **Remix: Medium–High.** |
| **Review / Audit** | `/clis team audit` | Gemini, Opencode, Claude (escalation) | Broad pass → code pass → escalate if hardest. **Remix: Medium (coverage/safety).** |

## How to use

- **`/clis team seo`** — Run SEO/content pipeline (draft → improve ×2 → curate → humanize). Provide brief or topic when prompted.
- **`/clis team refactor`** — Run refactor team (Opencode → Gemini → Kilo). Provide target files or TDD context.
- **`/clis team audit`** — Run audit team (Gemini → Opencode; Claude only if escalation needed). Provide scope (e.g. dir or module).

## Implementation notes (for agents)

1. **Load** `docs/plan/learning/CLI_TEAMS.md` for the chosen team’s roster and steps.
2. **Check limits** — Load `gf-cli-limits` and `CLI_LIMITS_TRACKING.md`; if any CLI in the team is at **80%+**, do not use it without user permission; substitute or skip that step.
3. **Run steps** — Execute each step (prompt the CLI in terminal or sequence); capture outputs. Cursor does not apply blindly; user/agent reviews and applies.
4. **Apply & verify** — Cursor (or user) applies chosen changes; run `pnpm preflight` (or equivalent) when code changes are involved.
5. **Log** — Append one entry per CLI used to `docs/plan/learning/CLI_USAGE_AND_RESULTS.md`.
6. **Claude** — In team `audit`, use Claude only for escalation (hardest security/architecture issues); Claude is not in competition with other CLIs.
