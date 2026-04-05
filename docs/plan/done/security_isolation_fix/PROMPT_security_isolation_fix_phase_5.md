# Pro Prompt — security_isolation_fix — Phase 5: Certification

This phase certifies 100% compliance via automated scanning.

---

## Phase 5: Automated Enforcement & Certification

### Primary role

QA | SECURITY

### Preferred tool

- [x] Gemini CLI — Second opinion, global analysis
- [ ] OpenCode CLI — Automated verification

### Context

- **Project**: GateFlow (Monorepo)
- **Initiative**: `security_isolation_fix`
- **File**: `docs/plan/Draft/security_isolation_fix/PLAN_security_isolation_fix.md`
- **Report**: `docs/plan/learning/SKILL_DISCOVERY_REPORT.md` (Security violations)
- **Goal**: 100% compliance with `organizationId` scoping.

### Goal

Verify that all 15+ vulnerabilities are resolved and no new ones were introduced.

### Scope (in)

- Global audit of the `client-dashboard`.

### Steps (ordered)

1. **Rerun Discovery**: Run `node scripts/ralph-skill-discover.js`.
2. **Review Output**: Ensure zero violations remain for "Missing organizationId guards".
3. **Log Progress**: Update `docs/plan/learning/incidents.md` with the story of the security hardening.
4. **Clean Backlog**: Mark the `security_isolation_fix` as Complete in `ALL_TASKS_BACKLOG.md`.
5. **Git Cycle**: git add, commit, push.

### Acceptance criteria

- [ ] `ralph-skill-discover.js` returns zero violations in the entire `client-dashboard`.
- [ ] Backlog updated.
- [ ] Incident log entry created.

### Files likely touched

- `docs/plan/learning/SKILL_DISCOVERY_REPORT.md`
- `docs/plan/learning/incidents.md`
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md`
