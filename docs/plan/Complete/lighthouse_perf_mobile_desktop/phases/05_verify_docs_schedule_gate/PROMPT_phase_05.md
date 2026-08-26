# Phase 5: Verification, Documentation & Hard Schedule Gate

## Initiative

- **Slug:** `lighthouse_perf_mobile_desktop`
- **Plan:** `docs/plan/Complete/lighthouse_perf_mobile_desktop/PLAN_lighthouse_perf_mobile_desktop.md`
- **Phase:** 5 of 5

---

### Primary Role

`QA` / `FRONTEND`

### Tool Selection

|                            | Tool                      | Why                                                                                  |
| -------------------------- | ------------------------- | ------------------------------------------------------------------------------------ |
| **Tool 1** (best quality)  | Cursor / Claude Code CLI  | Comprehensive multi-app verification, documentation compilation, and CI gate testing |
| **Tool 2** (free fallback) | Gemini CLI / OpenCode CLI | Automated test execution and summary reporting                                       |

### Skills to Load

- [x] `using-superpowers`
- [x] `verification-before-completion`
- [x] `gf-guide`

### Goal

Execute end-to-end LHCI verification across all targeted routes and form factors, record comprehensive before/after proof in `docs/guides/performance/LIGHTHOUSE_PERF_CERTIFICATION.md`, and ensure GitHub Actions schedule CI functions as a strict hard regression gate.

### Scope (in)

- Run LHCI audits across:
  - `https://www.gateflow.site` (Mobile + Desktop)
  - `https://www.gateflow.site/en/features` (Mobile)
  - `https://www.gateflow.site/en/pricing` (Mobile)
  - `https://app.gateflow.site/en` (Desktop)
- Validate that all 7 assertions in `.lighthouserc.js` pass with 0 errors.
- Confirm `.github/workflows/lighthouse.yml` maintains strict hard-fail exit behavior on schedule cron without soft-passing.
- Publish `docs/guides/performance/LIGHTHOUSE_PERF_CERTIFICATION.md` detailing before/after scores, residual risks, and operational guidelines.
- Execute full monorepo preflight (`pnpm preflight`).

### Scope (out)

- Lowering assertion thresholds in `.lighthouserc.js`.
- Adding new feature scope or modifying database schemas.

### Steps (ordered)

1. Trigger local/remote LHCI run against production or preview targets for all routes and form factors.
2. Verify all 7 metric thresholds (Perf, A11y, BP, SEO, LCP, TBT, CLS) pass cleanly.
3. Review `.github/workflows/lighthouse.yml` to ensure scheduled workflow fails on assert miss and is never silenced.
4. Compile and format before/after benchmark comparison into `docs/guides/performance/LIGHTHOUSE_PERF_CERTIFICATION.md`.
5. Run full workspace preflight: `pnpm preflight`.
6. Update task backlog and prepare plan for completion.

### Acceptance Criteria

- [ ] All target URLs meet or exceed `.lighthouserc.js` floors on Mobile and Desktop.
- [ ] Scheduled CI policy remains hard-fail on regression.
- [ ] `docs/guides/performance/LIGHTHOUSE_PERF_CERTIFICATION.md` is complete with before/after matrix and residual analysis.
- [ ] `pnpm preflight` passes with 0 errors across all workspaces.
