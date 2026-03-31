# Phase 04: Closed-loop campaign-to-first-scan analytics

### Primary role

**BACKEND-API** (with QA support)

### Preferred tool

- [x] Cursor IDE
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Kiro/Kilo/Qwen

### Skills to load

- `analytics-animation`, `data-viz`, `api`, `testing`, `security`

### MCP

- **Context7** for analytics/event implementation references when needed

### Subagent (optional)

- **shell**: "Run targeted lint/typecheck/tests for touched marketing and dashboard workspaces and report first actionable failure."

### Goal

Deliver a reliable report path from campaign source through qualified lead to first scan.

### Scope (in)

- Data linkage logic and reporting endpoint/query updates
- Quality checks for missing attribution links
- Export/report verification for operations and growth stakeholders

### Scope (out)

- No new major funnel UI redesign

### Steps

1. Implement/report linkage pipeline using existing route/model capabilities.
2. Add diagnostics for attribution breaks or incomplete chains.
3. Validate output in report/export flow.
4. Run verification suite for touched workspaces.

### Acceptance criteria

- [ ] `campaign -> qualified lead -> first scan` is reportable
- [ ] Attribution gap diagnostics available
- [ ] Tests/lint/typecheck pass for touched scopes
