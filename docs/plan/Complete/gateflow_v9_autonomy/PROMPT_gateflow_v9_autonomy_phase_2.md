# PROMPT: gateflow_v9_autonomy Phase 2 (Autonomous Pilot)

## Request

Prove the **Ralph Loop** by executing a "Zero-Violation" refactor of a core UI component. You must use the enforcer scripts aggressively and self-correct any issues they find.

## Primary Role

FRONTEND-UX

## Preferred Tool

Cursor (with Ralph Loop recursive refactoring)

## Steps

1. **Target Identification**: Run `node scripts/enforce-ads-design.js` and find a high-visibility component with raw hex codes or spacing violations.
2. **Refactor**:
   - Replace all raw hex codes with ADS tokens (`var(--ds-...)`).
   - Standardize spacing using ADS space tokens.
   - Ensure Framer Motion animations use transform/opacity only.
3. **The Ralph Loop**:
   - **Run Enforcers**: `node scripts/enforce-ads-design.js`, `node scripts/enforce-motion-performance.js`.
   - **Self-Correct**: If any violations are reported, fix them immediately and re-run.
   - **Verify Health**: Run `pnpm preflight` for the affected workspace.
4. **Git Completion**:
   - Use `node scripts/ralph-git.js commit gateflow_v9_autonomy 2` and `merge gateflow_v9_autonomy 2` once green.

## Acceptance Criteria

- [ ] Component has zero `scripts/enforce-ads-design.js` violations.
- [ ] `pnpm preflight` is green.
- [ ] Walkthrough includes "Loop Log" (how many iterations it took).
