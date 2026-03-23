# PROMPT_pagespeed_100_phase_1.md (v1.0)

## Role: Performance Architect (Team `perf`)

**Preferred Tools:** Gemini (Lighthouse Scan) + Opencode (Fix Gen) + Kilo (Check).

## Phase 1: Lighthouse CI & Automated Performance Baselines

**Goal**: Integrate a performance measurement and guarding system to target 100/100 scores.

### Context

Automate performance monitoring across all GateFlow platforms (Dashboard, Marketing, Public QR). Performance is a core feature, no regressions allowed.

### Steps

1. **Lighthouse CI / PSI Baseline**:
   - Use `browser-use` subagent to perform a full Lighthouse run on `https://gateflow.ae` (or local dev serve).
   - Capture current Mobile/Desktop scores, LCP, CLS, TBT.
   - Save the raw JSON report to `docs/perf/baseline_psi.json`.
2. **Analysis (Gemini)**:
   - Run `Gemini 1.5 Pro` (Large context) on the report.
   - Output `ANALYSIS_performance_killers.md` with the Top 5 LCP/CLS killers.
3. **CI/CD Guard (LHCI)**:
   - Configure `.lighthouserc.js` to target 100/100 thresholds.
   - Add a step to `.github/workflows/ci.yml` that runs Lighthouse CI on push.
4. **Action Items**:
   - Generate initial performance tasks in `TASKS_pagespeed_100.md`.

### Acceptance Criteria

- [ ] `baseline_psi.json` is saved.
- [ ] `ANALYSIS_performance_killers.md` identifies top bottlenecks.
- [ ] `.github/workflows/ci.yml` has a `performance` job.
- [ ] Auto-Sync triggered: `plan(pagespeed_100): phase 1 foundation`.
