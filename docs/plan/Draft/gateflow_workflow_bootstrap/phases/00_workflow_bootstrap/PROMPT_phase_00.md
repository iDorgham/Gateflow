# Phase 00: Workflow bootstrap

## Primary role

PLANNING / DEVOPS (workflow tooling)

### Tool Selection

|            | Tool         | Why                                          |
| ---------- | ------------ | -------------------------------------------- |
| **Tool 1** | Cursor       | Inline edits to Gate-Access workflow scripts |
| **Tool 2** | OpenCode CLI | Fallback if Cursor unavailable               |

### Skills to load

- [x] `verification-before-completion`
- [x] `gf-guide`
- [ ] `gf-security` — not required (no product auth changes)

### Scope

App: Workflow tooling only (`scripts/workflow-v2/`, `.ai/workflow-v2/`, docs/plan, agents).  
Do **not** change `apps/client-dashboard` product behavior.

### Steps

1. Confirm focus is `client-dashboard` via `pnpm workflow:v2 status --json`.
2. Extend `guide-cli.js` with `status|next|prompt|delivery` subcommands.
3. Extend state schema for optional `pageScoresFile`, `pilotFlowCoverage`, `selection`, `delivery`.
4. Add `gateflow-guide` agent pointing at `pnpm workflow:v2:guide`.
5. Update `docs/workspace/WORKFLOW_V2.md` and guide workflow for new subcommands.
6. In Dorgham control workspace: run Codex doctor; add `codex` adapter using proven `codex exec -C {workdir}` only.
7. Run `pnpm workflow:v2:check` and confirm next command `/audit all`.

### Acceptance criteria

- [ ] Guide subcommands return valid output (JSON and text)
- [ ] Schema validates with and without optional pointers
- [ ] `gateflow-guide` agent file exists under `.agents/agents/workflow-v2/`
- [ ] `pnpm workflow:v2:check` passes
- [ ] `pnpm workflow:v2:guide --json` → `nextCommand: "/audit all"`
- [ ] No product app code changes

### Mutation boundary

Local files only. No push/merge/deploy/migrate unless separately authorized.

### Exit

```text
/audit all
```
