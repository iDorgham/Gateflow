# Pro Prompt — pagespeed_100 — Phase 5: Global Certification

This phase performs the final Lighthouse audits for global 100/100 performance scores.

---

## Phase 5: Final Audit — Global 100/100 Certification

### Primary role

QA | PERFORMANCE

### Preferred tool

- [x] Gemini CLI — Lighthouse audits, report generation, second opinion
- [ ] Cursor IDE — Final polish, LHR fixes

### Context

- **Project**: GateFlow (Full Monorepo)
- **Initiative**: `pagespeed_100`
- **Goal**: Global 100/100 across Marketing, Client, Admin apps and ShortId routes.

### Goal

Verify and certify the performance of all GateFlow entry points after optimization.

### Scope (in)

- All apps: `marketing`, `client-dashboard`, `admin-dashboard`.
- Routes: `/`, `/dashboard`, `/s/[shortId]`, `/login`.

### Scope (out)

- Feature development (keep to audit items).

### Steps (ordered)

1. **Lighthouse Run**: Manually trigger `lhci` locally or in CI for all target routes.
2. **Analysis**: Review the final report to identify any remaining < 100 metrics.
3. **Hotfixes**: Address any transient score drops (e.g. font loading, CLS items).
4. **Documentation**: Update `docs/plan/learning/pagespeed_results.md` (new) with screenshots and scores.
5. **Backlog Update**: Mark `pagespeed_100` as Complete in `ALL_TASKS_BACKLOG.md`.
6. **Git Cycle**: git add, commit, push.

### Acceptance criteria

- [ ] All primary routes score 100/100 for "Performance" (Mobile & Desktop).
- [ ] No warnings for "Avoid enormous network payloads" or "Minimize main-thread work".
- [ ] All PageSpeed audits are Green.

### Files likely touched

- `docs/plan/backlog/ALL_TASKS_BACKLOG.md`
- `docs/gh-actions/...` (LHR reports).
- `next.config.js` (final tweaks).
