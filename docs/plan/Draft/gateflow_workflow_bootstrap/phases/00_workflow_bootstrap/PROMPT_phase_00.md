# Phase 00: Workflow bootstrap

## Primary role

PLANNING / DEVOPS (workflow tooling)

## Tool Selection

Phase 00 intentionally uses a **small write set** (Cursor primary, OpenCode fallback) for workflow-script edits. The GateFlow multi-tool stack remains supported for review/dispatch:

| Tool             | Role this phase                                                    |
| ---------------- | ------------------------------------------------------------------ |
| **Cursor**       | Primary writer for Gate-Access workflow scripts                    |
| **OpenCode CLI** | Fallback writer if Cursor unavailable                              |
| **Claude CLI**   | Optional read-only review (architecture/security)                  |
| **Codex CLI**    | Optional control-workspace dispatch (`codex exec -C`) after doctor |
| **Antigravity**  | Optional read-only visual/product review                           |
| **Kiro CLI**     | Available stack tool (not primary for Phase 00)                    |
| **Gemini CLI**   | Available stack tool (not primary for Phase 00)                    |
| **Kilo CLI**     | Available stack tool (not primary for Phase 00)                    |

Rationale: one primary writer per phase; parallel reviewers only.

## Skills to load

- [x] `verification-before-completion`
- [x] `gf-guide`
- [ ] `gf-security` — not required (no product auth changes)

## Scope

App: Workflow tooling only (`scripts/workflow-v2/`, `.ai/workflow-v2/`, docs/plan, agents).  
Do **not** change `apps/client-dashboard` product behavior.

## Steps

1. Confirm focus is `client-dashboard` via `pnpm workflow:v2 status --json`.
2. Extend `guide-cli.js` with `status|next|prompt|delivery` subcommands.
3. Extend state schema for optional `pageScoresFile`, `pilotFlowCoverage`, `selection`, `delivery`.
4. Add `gateflow-guide` agent pointing at `pnpm workflow:v2:guide`.
5. Update `docs/workspace/WORKFLOW_V2.md` and guide workflow for new subcommands.
6. In Dorgham control workspace: run Codex doctor; add `codex` adapter using proven `codex exec -C {workdir}` only.
7. Run `pnpm workflow:v2:check` and confirm next command `/audit all`.

## Acceptance criteria

Canonical Phase 00 status: **complete (local)**. Checklist below is the completed execution record (not an open template).

- [x] Guide subcommands return valid output (JSON and text)
- [x] Schema validates with and without optional pointers
- [x] `gateflow-guide` agent file exists under `.agents/agents/workflow-v2/`
- [x] `pnpm workflow:v2:check` passes
- [x] `pnpm workflow:v2:guide --json` → `nextCommand: "/audit all"`
- [x] No product app code changes

## Mutation boundary

Local files only. No push/merge/deploy/migrate unless separately authorized.

## Exit

```text
/audit all
```
