# Phase 02: Adaptive CTA routing & instrumentation

### Primary role

**FRONTEND** (with BACKEND-API support)

### Preferred tool

- [x] Cursor IDE
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Kiro/Kilo/Qwen

### Skills to load

- `tailwind`, `design-guide`, `api`, `testing`, `i18n`

### MCP

- **Context7** if API/Next.js metadata specifics are needed

### Subagent (optional)

- **explore**: "Trace current CTA click paths on marketing pages and list all existing route targets and tracking hooks."

### Goal

Implement intent-aware CTA paths and event instrumentation on high-impact routes.

### Scope (in)

- Update CTA components/routes on home, solutions, pricing, resources
- Emit standardized intent events using Phase 01 schema
- Preserve metadata and locale behavior

### Scope (out)

- No dashboard analytics UI in this phase
- No content-heavy playbook rollout (Phase 03)

### Steps

1. Update CTA routing logic for intent paths.
2. Add instrumentation at click/landing milestones.
3. Validate EN/AR route and copy parity.
4. Run lint/typecheck/tests for touched workspace(s).

### Acceptance criteria

- [ ] Intent routes function for all targeted pages
- [ ] Events emit with required taxonomy fields
- [ ] No SEO/canonical regressions introduced
- [ ] EN/AR parity verified
