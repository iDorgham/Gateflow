# PROMPT: gateflow_v9_autonomy Phase 1

## Goal
Integrate the v9.0 engineering enforcers into the project's pre-commit lifecycle to ensure absolute compliance before code enters the repository.

## Context
- **Scripts**: `scripts/enforce-ads-design.js`, `scripts/enforce-security-invariants.js`, `scripts/enforce-motion-performance.js`.
- **Target**: Pre-commit hook (Husky or native git hooks).

## Implementation Steps
1. **Infrastructure Audit**: Confirm if Husky is installed. If not, install `husky` and `lint-staged`.
2. **Husky Init**: Run `npx husky-init` and `pnpm install` if needed.
3. **Configure Hook**:
   - Create/Update `.husky/pre-commit`.
   - Add execution lines for the three enforcer scripts.
   - Add `pnpm turbo lint typecheck test` (or `pnpm preflight`).
4. **Lint-Staged (Optional but Recommended)**:
   - Configure `lint-staged` in `package.json` to run enforcers only on changed files to save time.

## Acceptance Criteria
- [ ] Running `git commit` triggers all three enforcer scripts.
- [ ] Build fails if any script exits with code 1.
- [ ] Build fails if lint/typecheck fails.
- [ ] Documentation updated in `PLAN_gateflow_v9_autonomy.md`.
