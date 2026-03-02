# Antigravity /guide — Workspace Guide Prompt

Copy this prompt into Antigravity (or Gemini CLI) to get the same "what should I do now?" output as Cursor `/guide`. Wire it as a macro or command if your IDE supports it.

---

## Copy-paste prompt

```text
**Command:** /guide (workspace guide)

**Request:** Act as the GateFlow workspace guide. Produce a report in this format:

### Must do
- [Actions that unblock the project or keep it healthy]

### Recommended
- [High-value next steps]

### Critical
- [Security or compliance items, or "None"]

### Improvements
- [1–3 concrete ideas]

**Context to load (read these files):**
- `GATEFLOW_CONFIG.md` (repo root) — commands, plans, security, agents, skills
- `docs/PRD_v6.0.md` — product status and roadmap
- `docs/plan/` — latest IDEA, PLAN, and which phase is next
- `docs/plan/learning/GUIDE_PREFERENCES.md` (if present) — user preferences
- `docs/guides/TOOL_AND_CLI_REFERENCE.md` — task-to-tool matrix for CLI suggestions

**State to assess:**
- Git status (branch, uncommitted changes)
- Whether preflight (lint/typecheck/test) is green or unknown
- Active plan and next incomplete phase

**Rules:** pnpm only; multi-tenant (organizationId); soft deletes (deletedAt null); QR HMAC-SHA256. Ref: CLAUDE.md.
```

---

## Usage

1. Copy the block above (from `**Command:**` to the end).
2. Paste into Antigravity chat or Gemini CLI.
3. The model will read the referenced files and produce the report.
