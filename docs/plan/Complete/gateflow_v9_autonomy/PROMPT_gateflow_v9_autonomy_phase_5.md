## Phase 5: Self-Evolving Ecosystem

### Primary role

**PLATFORM-ARCHITECT**

### Context

- GateFlow (Zero-Trust platform, Turborepo monorepo)
- Root directory: `/Users/Dorgham/Documents/Work/Devleopment/Gate-Access`
- Existing scripts: `scripts/ralph-git.js`, `scripts/enforce-*.js`
- Roadmap: `docs/plan/Complete/gateflow_v9_autonomy/PLAN_gateflow_v9_autonomy.md`
- Backlog: `docs/plan/backlog/ALL_TASKS_BACKLOG.md`

### Goal

Implement the next generation of Ralph Loop automation: **Self-Evolving Ecosystem**. This involves creating tools for AI-driven backlog prioritization and automated enforcer discovery.

### Scope (in)

1. **Prioritization Engine**: Create `scripts/ralph-prioritize.js` to suggest the next phase.
2. **Skill Discovery Engine**: Create `scripts/ralph-skill-discover.js` to scan for patterns and suggest enforcers.
3. **Workflow Integration**: Update `/guide` to leverage these new Ralph tools.

### Steps (ordered)

1. **Create `scripts/ralph-prioritize.js`**:
   - Parse `ALL_TASKS_BACKLOG.md` and current initiative.
   - Suggest the next phase (e.g., "Phase 6 of atlassian_ui_remake") based on status.
2. **Create `scripts/ralph-skill-discover.js`**:
   - Implement basic pattern matching for ADS tokens (hex colors vs `var(--ds-...)`).
   - Implement check for `organizationId` in `packages/db` queries.
   - Output a report summary to `docs/development/learning/SKILL_DISCOVERY_REPORT.md`.
3. **Enhance `/guide`**:
   - Update `.antigravity/workflows/guide.md` to run these scripts as pre-flight checks.
   - Include the "Ralph Perspective" in the guide output.

### Acceptance criteria

- [ ] `node scripts/ralph-prioritize.js` outputs a valid next-step recommendation.
- [ ] `node scripts/ralph-skill-discover.js` generates a report with at least one finding.
- [ ] `/guide` command output includes a "Self-Evolution" section.

### Files likely touched

- scripts/ralph-prioritize.js [NEW]
- scripts/ralph-skill-discover.js [NEW]
- .antigravity/workflows/guide.md [MODIFY]
- docs/development/learning/SKILL_DISCOVERY_REPORT.md [NEW]
